import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'

export default defineConfig({
  base: '/learn-vim/game/',
  plugins: [
    react(),
    {
      name: 'generate-quiz-data',
      buildStart() {
        // Generate data from markdown during build
        try {
          execSync('node scripts/generateData.js', { stdio: 'inherit' });
        } catch (error) {
          console.error('Failed to generate quiz data:', error);
          throw error;
        }
      }
    }
  ],
})
