// Single entry point for the whole site. Each app lives in its own workspace
// package and is only downloaded when its URL is visited:
//
//   /learn-vim/          → ui-cheatsheet
//   /learn-vim/game/     → ui-practice (HashRouter)
//   /learn-vim/arcade/   → ui-arcade   (BrowserRouter, basename /learn-vim/arcade)
//
// No router is rendered here: the apps own their routers, so URLs stay as-is.

interface AppEntry {
  mount: (root: HTMLElement) => void | Promise<void>
}

interface AppMeta {
  /** First path segment below the base that selects this app ('' = default). */
  segment: string
  title: string
  description: string
  themeColor?: string
  /** Load JetBrains Mono (used by the game-like apps only). */
  monoFont?: boolean
  load: () => Promise<AppEntry>
}

const APPS: AppMeta[] = [
  {
    segment: 'arcade',
    title: 'Vim Arcade',
    description: 'Practice Vim commands in an arcade game with real code files',
    themeColor: '#1f2937',
    monoFont: true,
    load: () => import('ui-arcade'),
  },
  {
    segment: 'game',
    title: 'Interactive Quiz Game',
    description:
      'Learn Vim commands with interactive quizzes, flashcards, and multiple choice tests',
    themeColor: '#1f2937',
    monoFont: true,
    load: () => import('ui-practice'),
  },
  {
    segment: '',
    title: 'Learn Vim Cheatsheet',
    description: 'Searchable Vim cheatsheet',
    load: () => import('ui-cheatsheet'),
  },
]

function pickApp(pathname: string): AppMeta {
  const rest = pathname.slice(import.meta.env.BASE_URL.length - 1).replace(/^\/+/, '')
  const [first = ''] = rest.split('/')
  return APPS.find(app => app.segment === first) ?? APPS[APPS.length - 1]
}

function addHead(tag: 'meta' | 'link', attrs: Record<string, string>) {
  const el = document.createElement(tag)
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value)
  document.head.appendChild(el)
}

const app = pickApp(window.location.pathname)

document.title = app.title
addHead('meta', { name: 'description', content: app.description })
if (app.themeColor) addHead('meta', { name: 'theme-color', content: app.themeColor })
if (app.monoFont) {
  addHead('link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' })
  addHead('link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' })
  addHead('link', {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap',
  })
}

app.load().then(({ mount }) => mount(document.getElementById('root')!))
