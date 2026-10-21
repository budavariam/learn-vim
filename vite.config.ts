import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { copyFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { generateDataFromMarkdown, OUTPUT_PATH } from './scripts/generateData.js'

const base = '/learn-vim/'
const gameBase = `${base}game/`
const monacoDir = fileURLToPath(new URL('./ui-arcade/node_modules/monaco-editor', import.meta.url))

/** Generates data.json from vim-cheatsheet.md once, for every app. */
function generateData(): Plugin {
  return {
    name: 'generate-data',
    buildStart() {
      generateDataFromMarkdown()
    },
  }
}

/**
 * The apps are served from sub-paths of the same bundle. On static hosting
 * (gh-pages) those paths need their own index.html, so copy the shell there.
 */
function subPathShells(segments: string[]): Plugin {
  let outDir = 'dist'
  return {
    name: 'sub-path-shells',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      for (const segment of segments) {
        mkdirSync(`${outDir}/${segment}`, { recursive: true })
        copyFileSync(`${outDir}/index.html`, `${outDir}/${segment}/index.html`)
      }
    },
  }
}

export default defineConfig({
  base,
  resolve: {
    alias: [
      { find: '@data', replacement: fileURLToPath(new URL(OUTPUT_PATH, import.meta.url)) },
      // monaco-vim@0.4.x deep-imports `monaco-editor/esm/vs/...`, which the `exports` map of
      // monaco-editor >= 0.5x no longer exposes. Point those imports at the real files.
      {
        find: /^monaco-editor\/esm\/vs\/(.*)$/,
        replacement: `${monacoDir}/esm/vs/$1`,
      },
    ],
  },
  plugins: [
    generateData(),
    react(),
    tailwindcss(),
    VitePWA({
      // Only the quiz app is a PWA; it registers the worker itself (see ui-practice/src/entry.tsx).
      injectRegister: false,
      registerType: 'autoUpdate',
      base,
      scope: gameBase,
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Vim Quiz Learning App',
        short_name: 'VimQuiz',
        description:
          'Learn Vim commands with interactive quizzes, flashcards, and multiple choice tests',
        theme_color: '#1f2937',
        background_color: '#111827',
        display: 'standalone',
        scope: gameBase,
        start_url: gameBase,
        orientation: 'portrait',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        // Only the shell is precached. The bundle also holds the arcade (Monaco, several MB), so
        // hashed assets are cached on first use instead; the quiz works offline after one visit.
        globPatterns: ['index.html', '*.{ico,png,svg}'],
        navigateFallback: `${base}index.html`,
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith(`${base}assets/`),
            handler: 'CacheFirst',
            options: {
              cacheName: 'app-assets',
              expiration: { maxEntries: 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
    subPathShells(['game', 'arcade']),
  ],
  worker: { format: 'es' },
})
