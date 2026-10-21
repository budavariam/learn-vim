import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { generateDataFromMarkdown, OUTPUT_PATH } from './scripts/generateData.js'
import { APP_META, MONO_FONT_HREF, type AppMeta } from './src/apps'

const base = '/learn-vim/'
const gameBase = `${base}game/`

/** Generates data.json from vim-cheatsheet.md once, for every app. */
function generateData(): Plugin {
  return {
    name: 'generate-data',
    buildStart() {
      generateDataFromMarkdown()
    },
  }
}

// Everything that only the arcade needs (Monaco, its workers, its CSS) gets an `arcade-` prefix so the
// quiz's service worker can leave it out of the precache without listing individual chunks.
const ARCADE_ONLY = /[\\/](ui-arcade|monaco-editor|monaco-vim)[\\/@]/

const MANIFEST_LINK = /<link rel="manifest"[^>]*>\s*/

/** The quiz is the only PWA, so only its page should advertise the manifest. */
function manifestOnlyForQuiz(): Plugin {
  return {
    name: 'manifest-only-for-quiz',
    apply: 'build',
    enforce: 'post', // after vite-plugin-pwa injects its link
    transformIndexHtml: {
      order: 'post',
      handler: html => html.replace(MANIFEST_LINK, ''),
    },
  }
}

/** Bake an app's head tags into a copy of the root shell (for crawlers and no-JS previews). */
function shellFor(rootHtml: string, app: AppMeta, manifestLink: string): string {
  const tags = [
    `<meta name="description" content="${app.description}" />`,
    app.themeColor ? `<meta name="theme-color" content="${app.themeColor}" />` : '',
    app.monoFont ? `<link rel="stylesheet" href="${MONO_FONT_HREF}" />` : '',
    manifestLink,
  ].filter(Boolean)
  let html = rootHtml
    .replace(/<title>.*?<\/title>/, `<title>${app.title}</title>`)
    .replace(/<meta name="description"[^>]*>\s*/, '')
    .replace(MANIFEST_LINK, '')
  if (app.favicon)
    html = html.replace(/<link rel="icon"[^>]*>/, `<link rel="icon" href="${app.favicon}" />`)
  return html.replace('</head>', `    ${tags.join('\n    ')}\n  </head>`)
}

/**
 * The apps are served from sub-paths of the same bundle. On static hosting
 * (gh-pages) those paths need their own index.html, so write the shell there.
 */
function subPathShells(): Plugin {
  let outDir = 'dist'
  return {
    name: 'sub-path-shells',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      const rootHtml = readFileSync(`${outDir}/index.html`, 'utf-8')
      for (const app of APP_META.filter(app => app.segment)) {
        const manifestLink =
          app.segment === 'game' ? `<link rel="manifest" href="${base}manifest.webmanifest" />` : ''
        mkdirSync(`${outDir}/${app.segment}`, { recursive: true })
        writeFileSync(`${outDir}/${app.segment}/index.html`, shellFor(rootHtml, app, manifestLink))
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
      // monaco-editor >= 0.5x no longer exposes (it is `monaco-editor/<path>` now).
      { find: /^monaco-editor\/esm\/vs\/(.*)$/, replacement: 'monaco-editor/$1' },
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
        // Precache the shell and everything the quiz needs so it works offline after the first
        // visit. The arcade (Monaco, workers) is large and is left out via its `arcade-` prefix.
        globPatterns: ['index.html', '*.{ico,png,svg}', 'assets/*.{js,css}'],
        globIgnores: ['assets/arcade-*', '**/*.worker-*'],
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
    manifestOnlyForQuiz(),
    subPathShells(),
  ],
  worker: { format: 'es' },
  build: {
    rolldownOptions: {
      output: {
        chunkFileNames: chunk =>
          chunk.moduleIds.some(id => ARCADE_ONLY.test(id))
            ? 'assets/arcade-[name]-[hash].js'
            : 'assets/[name]-[hash].js',
        assetFileNames: asset =>
          asset.originalFileNames.some(file => ARCADE_ONLY.test(file))
            ? 'assets/arcade-[name]-[hash][extname]'
            : 'assets/[name]-[hash][extname]',
      },
    },
  },
})
