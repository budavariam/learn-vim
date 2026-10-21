// The quiz used to be a separate app whose service worker lived at /learn-vim/game/sw.js.
// The worker now lives at /learn-vim/sw.js (see vite.config.ts), so returning visitors would
// keep getting the old cached app and could never update. When the browser re-checks this URL
// it finds this script, which drops the old worker and caches and reloads the open pages.
self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) await caches.delete(key)
      await self.registration.unregister()
      for (const client of await self.clients.matchAll({ type: 'window' })) client.navigate(client.url)
    })()
  )
})
