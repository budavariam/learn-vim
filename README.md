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

## Vim Arcade (`/arcade`)

An interactive vim practice game served at **`/learn-vim/arcade/`**.

### Running locally

```sh
cd ui-arcade
npm install
npm run generate-data   # populate data.json from vim-cheatsheet.md
npm run dev             # http://localhost:5174/learn-vim/arcade/
```

Or with Docker (requires the repo root as build context):

```sh
docker compose --profile dev up          # hot-reload dev server on :5174
docker compose --profile prod up --build # production nginx on :3001
```

### Game modes

| Mode | Description |
|------|-------------|
| **General** | Endless practice — earn points, unlock higher command levels. |
| **Timed Challenge** | Fixed session: 1, 2, 5, 10, or 15 minutes. Score as many commands as possible. |
| **Survival** | Every miss ends the game. Longer time limits but zero tolerance. |
| **VimGolf** | Reach the target buffer state in the fewest keystrokes possible. |

### Arcade features

| Feature | Description |
|---------|-------------|
| **Real code editor** | Monaco editor (VS Code's engine) with full vim key bindings (monaco-vim). |
| **Languages** | Go, Rust, Python, TypeScript, C, C++ — a ~200-line realistic file loads for each. |
| **Command detection** | Keystrokes matched against the vim-cheatsheet data; ex commands (`:wq`, `:s/…`) detected via the vim statusbar. |
| **Progressive difficulty** | Commands are drawn from levels 0–ceiling. Ceiling advances when 75 % of current-level commands reach the repetition target. |
| **Concurrent challenges** | Starts with 1 active challenge, grows to up to 4 as you hit completion milestones. |
| **Dynamic scoring** | Points × time multiplier (Lightning/Fast/Good/Completed) × combo multiplier (up to ×3). |
| **Combo system** | Consecutive successes boost the multiplier (×1.5 at 3, up to ×3 at 12). |
| **Repetition target** | 1×, 2×, 3×, or 5× — how many times each command must be completed before the ceiling advances. |
| **Guided mode** | Six variants: None / First only / After failure / First + on failure / Alternating / Always. Guided completions earn 20 % of normal points; a blind verification challenge queues after guided reveals. |
| **Dynamic assist** | Optional: auto-reveal the solution at X % of the time limit (30–150 %). Capped at 100 % in Survival mode. Togglable without restarting via the in-game settings drawer (⌘⇧P). |
| **Category focus** | Pick which command categories to practice. Color-coded chips with the same hue algorithm as the cheatsheet. Defaults to 6 essential categories. Presets saved in localStorage. |
| **Unsupported commands** | Mark any command as "not supported in Monaco" during a session. Toggle at setup to skip marked commands in future games. |
| **Warmup** | 1–3 easy challenges at the start of each session; count scales with starting level (level 9 → 1 warmup). |
| **Survival stats** | High score tracks "achieved time" vs "expected time" (sum of presented challenge limits). |
| **Post-game review** | After any session, review every challenged command with its success rate. Items with ≥ 60 % success across ≥ 3 attempts are suggested for "mark as known" — shared with the quiz app's `knownItems` localStorage key. |
| **High scores** | Top-10 per mode in localStorage. General/Timed sorted by score; Survival sorted by time survived. |
| **Quit + Info** | In-game Quit button navigates back to setup. Info button (ℹ) shows current config in a modal. |

### VimGolf mode

| Feature | Description |
|---------|-------------|
| **20 built-in challenges** | Easy → Hard, covering motions, operators, macros, `:sort`, `:g/^/m0`, visual-block, regex substitutions, and more. |
| **Keystroke counter** | Every keydown in the editor counts. Displayed prominently. |
| **Timer** | Runs from first keystroke; pauses after solve. |
| **Reset** | Restores the buffer to the starting state and resets the keystroke counter. Timer keeps running. |
| **Check / Diff** | Click Check to compare current content to the target. On mismatch, a line-level LCS diff overlay shows what's missing or extra. |
| **Solution toggle** | Show/hide the expected result. Available in the panel and via the ⌘⇧P settings drawer. |
| **High scores per challenge** | Top-10 entries sorted by keystrokes (ASC) then time (ASC). |
| **Import challenges** | Fetch by vimgolf.com challenge ID (best-effort, CORS permitting) or paste raw JSON. Custom challenges persisted in localStorage. |
| **Attribution** | Challenges with a `vimgolfId` field link back to vimgolf.com. |

### Settings drawer (⌘⇧P)

Opens an in-game panel without leaving the editor. Currently toggles:
- **Guided mode** — switch between all six guided variants live without restarting.

### Neovim arcade plugin

`VimLearnArcade` command opens an arcade session inside Neovim:
- Same engine logic as the browser game (mirrored in Lua).
- `vim.ui.select` setup wizard: mode, language, level, repetition, guided, dynamic assist, category multi-select (Space toggle, presets saved in `vim-learn-state.json`).
- Vertical split: editor buffer (left) + challenge panel (right).
- Key interception via `vim.on_key`; ex commands via `CmdlineLeave` autocmd.
- High scores saved to `stdpath('data')/vim-learn-arcade-scores.json`.

---



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
