// Per-app page metadata. Shared by the runtime host (main.ts, used by the dev server)
// and the build (vite.config.ts bakes it into each sub-path's index.html).

export interface AppMeta {
  /** First path segment below the base that selects this app ('' = default). */
  segment: string
  title: string
  description: string
  themeColor?: string
  /** Load JetBrains Mono (used by the game-like apps only). */
  monoFont?: boolean
  favicon?: string
}

export const MONO_FONT_HREF =
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap'

export const APP_META: AppMeta[] = [
  {
    segment: 'arcade',
    title: 'Vim Arcade',
    description: 'Practice Vim commands in an arcade game with real code files',
    themeColor: '#1f2937',
    monoFont: true,
    favicon:
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎮</text></svg>",
  },
  {
    segment: 'game',
    title: 'Interactive Quiz Game',
    description:
      'Learn Vim commands with interactive quizzes, flashcards, and multiple choice tests',
    themeColor: '#1f2937',
    monoFont: true,
  },
  {
    segment: '',
    title: 'Learn Vim Cheatsheet',
    description: 'Searchable Vim cheatsheet',
  },
]

/** Pick the app for a pathname, given the Vite base ('/learn-vim/'). */
export function pickAppMeta(pathname: string, base: string): AppMeta {
  const rest = pathname.slice(base.length - 1).replace(/^\/+/, '')
  const [first = ''] = rest.split('/')
  return APP_META.find(app => app.segment === first) ?? APP_META[APP_META.length - 1]
}
