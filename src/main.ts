// Single entry point for the whole site. Each app lives in its own workspace
// package and is only downloaded when its URL is visited:
//
//   /learn-vim/          → ui-cheatsheet
//   /learn-vim/game/     → ui-practice (HashRouter)
//   /learn-vim/arcade/   → ui-arcade   (BrowserRouter, basename /learn-vim/arcade)
//
// No router is rendered here: the apps own their routers, so URLs stay as-is.

import { MONO_FONT_HREF, pickAppMeta } from './apps'

interface AppEntry {
  mount: (root: HTMLElement) => void | Promise<void>
}

const LOADERS: Record<string, () => Promise<AppEntry>> = {
  arcade: () => import('ui-arcade'),
  game: () => import('ui-practice'),
  '': () => import('ui-cheatsheet'),
}

/** Create (or update) the head tag matching `selector`. */
function setHead(selector: string, tag: 'meta' | 'link', attrs: Record<string, string>) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement(tag)
    document.head.appendChild(el)
  }
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value)
}

function showLoadError(root: HTMLElement, error: unknown) {
  console.error('Failed to load app', error)
  root.innerHTML =
    '<div style="font-family:monospace;padding:2rem;text-align:center">' +
    '<p>Could not load the app (a new version may have been deployed).</p>' +
    '<button style="margin-top:1rem;padding:.5rem 1.5rem" onclick="location.reload()">Reload</button>' +
    '</div>'
}

const meta = pickAppMeta(window.location.pathname, import.meta.env.BASE_URL)
const root = document.getElementById('root')!

document.title = meta.title
setHead('meta[name="description"]', 'meta', { name: 'description', content: meta.description })
if (meta.themeColor) {
  setHead('meta[name="theme-color"]', 'meta', { name: 'theme-color', content: meta.themeColor })
}
if (meta.favicon) setHead('link[rel="icon"]', 'link', { rel: 'icon', href: meta.favicon })
if (meta.monoFont) {
  setHead('link[href*="fonts.googleapis.com/css2"]', 'link', {
    rel: 'stylesheet',
    href: MONO_FONT_HREF,
  })
}

LOADERS[meta.segment]()
  .then(({ mount }) => mount(root))
  .catch(error => showLoadError(root, error))
