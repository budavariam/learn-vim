# Learn Vim

A collection of Vim shortcuts, commands, and practice tools assembled to make
learning Vim practical. The goal is an overview of features and commands that
boost productivity — not exhaustive reference, but a solid launchpad.

All commands live in [`vim-cheatsheet.md`](./vim-cheatsheet.md) as the single
source of truth. Run `node scripts/generateData.js ui-cheatsheet` to regenerate
`ui-cheatsheet/src/data.json`, which both the web app and the Neovim plugin read
at runtime.

Entry format: `* LEVEL - \`cmd1\`, \`cmd2\` - description`

---

## Web cheatsheet

Live at **[budavariam.github.io/learn-vim](https://budavariam.github.io/learn-vim)**.

| Feature | Description |
|---------|-------------|
| Fuzzy search | Filter commands by key, description, or category (Fuse.js). |
| Level range slider | Narrow to commands at a given difficulty tier (0 = essential → 9 = advanced). |
| Category filter | Focus a single Vim topic from the dropdown. |
| Known tracking | Click a card to mark/unmark it as learned. Persisted in localStorage. |
| Unknown-only mode | Toggle to hide everything you already know. |
| Mark all / reset | Bulk-mark everything known, or reset to all unknown. |
| Memorize drawer | Alt-click a card to pin it for focused review. Drag to reorder. |
| Quiz game | Flash-card quiz at `/game`. |
| Interactive keyboard | Visual keyboard overlay — keys colour-coded by Vim category. Toggle Ctrl/Shift for modifier combos. Filter to known/unknown/memorize. Three locale layouts (EN / HU / ES). |
| Dark mode | Toggle via the sun/moon button; preference is persisted. |
| Table of contents | Sidebar on desktop, drawer on mobile for quick category navigation. |
| About modal | `?` button opens a full feature overview. |

---

## Neovim plugin

Lives in [`nvim-plugin/`](./nvim-plugin/).
Reads the same `data.json` as the web cheatsheet — one source of truth.

Install with [lazy.nvim](https://github.com/folke/lazy.nvim):

```lua
{
  'budavariam/learn-vim',
  config = function()
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

| Keymap | Action |
|--------|--------|
| `<leader>vl` | Floating cheatsheet: live fuzzy search (`/`), filter (`f`), toggle known (`Space`). |
| `<leader>vq` | Flash-card quiz: `k` = known, `n` = skip, `r` = reshuffle, `u` = unknown. |

---

## CLI practice script

[`practice.py`](./practice.py) is a Python 3 terminal quiz.

```sh
python3 practice.py
```

---

## Recommended resources

- `vimtutor` — built-in interactive tutorial; run it in your terminal
- [openvim.com](https://www.openvim.com/) — browser-based interactive tutorial
- [vim.rtorr.com](https://vim.rtorr.com/) — great cheatsheet that inspired this one
- [vim fandom wiki](https://vim.fandom.com/wiki/Vim_Tips_Wiki) — deep-dive tips and tricks
- [vimgolf.com](https://www.vimgolf.com/) — fun challenges to sharpen muscle memory
- `vim :help` — the definitive reference, always at hand

## Configuration

My Neovim configuration is available in my
[dotfiles repository](https://github.com/budavariam/dotfiles).
