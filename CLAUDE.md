# learn-vim

One pnpm workspace that builds a single Vite app. `src/main.ts` lazy-loads the apps by URL:
`ui-cheatsheet` (`/learn-vim/`), `ui-practice` (`/learn-vim/game/`, HashRouter) and
`ui-arcade` (`/learn-vim/arcade/`, BrowserRouter). Keep these URLs and base paths unchanged.
`vimtutor/` and `ui-arcade/vim-golf-challenges/` are git submodules: do not modify them.

## Setup

- Node 24 (`.nvmrc`): run `nvm use` before any install or script.
- pnpm only (`packageManager` in `package.json`); never use npm to install or create lockfiles.

## After finishing a development task

Run `pnpm lint` (the `npm run lint` equivalent for this repo). It chains ESLint, knip and
Prettier (`lint:eslint`, `lint:knip`, `lint:format`). Fix what it reports, then also run
`pnpm typecheck` and `pnpm test`. Report anything that could not be run.

- knip is deliberately not part of CI; it is a local check only.
- Prettier covers the whole repo (`pnpm format` to fix). `vim-cheatsheet.md` is excluded on
  purpose: `scripts/generateData.js` parses its `*` bullets.

## Notes

- `ui-cheatsheet/src/data.json` is generated from `vim-cheatsheet.md` by
  `scripts/generateData.js` (runs on every `vite` start/build). It stays committed because the
  Neovim plugin reads it. Apps import it as `@data`.
- Tailwind 4: each app's `src/index.css` scopes scanning with `source('.')`.
