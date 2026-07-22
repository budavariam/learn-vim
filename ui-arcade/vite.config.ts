import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'

const basePath = '/learn-vim/arcade/'

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    {
      name: 'generate-arcade-data',
      buildStart() {
        try {
          execSync('node ../scripts/generateData.js ui-arcade', { stdio: 'inherit' })
        } catch (e) {
          console.error('Failed to generate arcade data:', e)
          throw e
        }
      },
    },
  ],
  // Monaco workers are registered via monacoSetup.ts using ?worker imports.
  // No need to exclude monaco-editor from optimisation; let Vite pre-bundle it.
  optimizeDeps: {
    include: ['monaco-editor', 'monaco-vim'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('monaco-editor') || id.includes('monaco-vim')) {
            return 'monaco'
          }
        },
      },
    },
  },
  worker: {
    format: 'es',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.ts'],
    setupFiles: ['src/engine/__tests__/setup.ts'],
  },
})
