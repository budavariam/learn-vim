# vim-learn.nvim

A Neovim overlay plugin that reads the same `data.json` source of truth as the
learn-vim web cheatsheet, giving you a floating cheatsheet browser and a quiz
mode without leaving the editor.

## Features

- **Cheatsheet** – searchable floating window with category colours matching the
  web UI, level indicators, and persistent "known" state.
- **Quiz** – flash-card style quiz: unknown items first, then known ones for
  review. Mark known (`k`), skip (`n`), reshuffle (`r`).

## Keymaps (inside the windows)

### Cheatsheet (`<leader>vl`)

| Key | Action |
|-----|--------|
| `/` | Open fuzzy search bar (live filter as you type) |
| `CR` | Confirm search and return focus to list |
| `Esc` in search | Clear query and return focus |
| `f` | Cycle filter (all → unknown → known) |
| `Space` / `CR` | Toggle "known" for item under cursor |
| `Esc` in list | Clear active search query (or close if none) |
| `R` | Reload data.json |
| `Q` | Switch to quiz mode |
| `q` | Close |

### Quiz (`<leader>vq`)

| Key | Action |
|-----|--------|
| `Space` / `CR` | Reveal answer (first press) / next card (second press) |
| `k` | Mark known + next |
| `u` | Mark unknown + next |
| `n` | Skip + next |
| `r` | Reshuffle remaining items |
| `q` / `Esc` | Close |

## Data source

Both the web cheatsheet and this plugin read
`ui-cheatsheet/src/data.json`, which is generated from `vim-cheatsheet.md` via
`node scripts/generateData.js`. Run that script after editing the markdown to
update both surfaces simultaneously.

## Installation (lazy.nvim)

```lua
{
  'budavariam/learn-vim',
  config = function()
    -- the plugin lives in the nvim-plugin/ subdirectory of the repo
    local root = vim.fn.stdpath('data') .. '/lazy/learn-vim/nvim-plugin'
    vim.opt.rtp:prepend(root)
    require('vim-learn').setup({
      data_path = vim.fn.stdpath('data') .. '/lazy/learn-vim/ui-cheatsheet/src/data.json',
    })
  end,
  keys = {
    { '<leader>vl', '<cmd>VimLearnCheatsheet<CR>', desc = 'Vim cheatsheet' },
    { '<leader>vq', '<cmd>VimLearnQuiz<CR>',       desc = 'Vim quiz' },
  },
}
```
