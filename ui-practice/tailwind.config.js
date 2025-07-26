/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'media', // Enable automatic dark mode detection
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#0d1117',
          fg: '#f0f6fc',
          red: '#ff6b6b',
          green: '#51cf66',
          yellow: '#ffd43b',
          blue: '#74c0fc',
          cyan: '#22d3ee',
        },
        light: {
          bg: '#ffffff',
          fg: '#1f2937',
          red: '#dc2626',
          green: '#059669',
          yellow: '#d97706',
          blue: '#2563eb',
          cyan: '#0891b2',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
