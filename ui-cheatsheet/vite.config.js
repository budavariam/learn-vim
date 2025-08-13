import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'

export default defineConfig({
  base: '/learn-vim/',
  plugins: [
    react(),
    {
      name: 'generate-quiz-data',
      buildStart() {
        // Generate data from markdown during build
        try {
          execSync('node ../scripts/generateData.js ui-cheatsheet', { stdio: 'inherit' });
        } catch (error) {
          console.error('Failed to generate quiz data:', error);
          throw error;
        }
      }
    }
  ],
})
