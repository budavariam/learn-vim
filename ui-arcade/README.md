# VIM ARCADE

A browser-based vim training suite. Practice real vim commands in a live Monaco editor — no installation, no plugin needed.

---

## Game Modes

### 🎮 Arcade Mode

Vim challenges appear one at a time. Type the correct command to score points. Level up as you master more commands.

- **General** — endless practice; level ceiling rises automatically
- **Timed Challenge** — fixed-duration session (1-15 min)
- **Survival** — one miss ends the game; commands have longer time limits

**Options:**

| Option              | Description                                                                                                       |
| ------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Language            | Go, Rust, Python, TypeScript, C, C++                                                                              |
| Starting level      | 0-9                                                                                                               |
| Repetition target   | Each command must be hit N times before ceiling advances                                                          |
| Guided mode         | None / First-only / After-failure / First+failure / Alternating / Always — controls when the solution is revealed |
| Challenge time pace | 1× - 3× multiplier to slow down time limits                                                                       |
| Dynamic assist      | Auto-reveal solution after X% of the time limit                                                                   |
| Category filter     | Practice only selected command categories                                                                         |
| Knowledge filter    | All / Known / Unknown                                                                                             |

### 🏃 Motion Race

Navigate to highlighted positions using only vim motions. No editing allowed.

- **End conditions** — Timed, Count (your goals), Count (all incl. enemies), Survival (stepping on a trail ends the game)
- **Distance modes** — Short (≤8 lines), Medium, Long, Mixed
- **Goal display** — Next only, or All-at-once (collect any in any order)
- **Snake trail** — your cursor leaves a fading blue trail; length = current score
- **Enemies** — AI cursors racing toward the same goals
  - 0 / 1 / 3 / 5 / 10 enemies, configurable speed (Slow / Medium / Fast / Mixed)
  - Each enemy gets a distinct HSL color (6-palette SCSS)
  - Optional blocking trails; multi-color or single-color toggle
  - **Fog of war** — hides enemy positions in the editor (still visible on minimap)
- **Minimap sidebar** — shows goal diamonds and color-coded enemy dots
- **Handicaps** — Snow overlay, Opacity fade, Confetti on goal, Penalty flash, hjkl-only, No-hjkl movement restriction
- **Challenge mode** — optional motion/search command challenges shown alongside navigation

### 🎯 Goal Mode

Transform text from a start state to a target state. Challenges come from 1,000+ real vimgolf puzzles.

- Select challenge count, difficulty, and per-challenge time limit
- **Command challenges** — optional concurrent vim-command challenges (toggle on/off)
- Challenges are drawn from the bundled org-file submodule and shuffled each session
- Difficulty auto-assigned by edit-distance percentile (bottom 33% easy, 33-75% medium, top 25% hard)

### ⛳ VimGolf

Transform text using the fewest keystrokes possible.

- 1,000+ challenges parsed at runtime from the bundled `vim-golf-challenges/README.org` submodule (via Web Worker)
- Difficulty assigned by edit distance between start and end
- Search by title/description; filter by Easy / Medium / Hard
- Personal bests tracked per challenge
- Add custom challenges via JSON paste

---

## High Scores

Tabbed by mode (General / Timed / Survival), always showing 10 rows.

- **vim-bot** seed entries give you targets to beat; they're displaced when your score ranks higher
- Your display name (set in Preferences) appears in the Player column

---

## Preferences

Set a **username** (alphanumeric, 2-20 chars) that appears on the High Scores table.

---

## Dev / Help

The "Help" link in the navbar leads to two tabs:

- **Dev Mode** — live keystroke log, solution matching, command drill mode, unsupported/known command management
- **Readme** — this feature guide

---

## Keyboard Shortcuts

| Key   | Action                                                                                   |
| ----- | ---------------------------------------------------------------------------------------- |
| `F1`  | Monaco command palette — search all in-game settings (e.g. "Vim Arcade: Guided Mode: …") |
| `?`   | In-game keyboard shortcuts overlay (Arcade mode)                                         |
| `Esc` | Close overlays                                                                           |

---

## Architecture

| Layer      | Path                        | Description                                                                                                     |
| ---------- | --------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Engine     | `src/engine/`               | Pure TypeScript: scoring, levels, challenges, high scores                                                       |
| Hooks      | `src/hooks/`                | React hooks: `useArcadeGame`, `useMotionRace`, `useGoalGame`, `useVimGolfChallenges`                            |
| Components | `src/components/`           | React UI: setup screens, game screens, shared primitives                                                        |
| Workers    | `src/workers/`              | Web Workers for off-thread parsing (org file)                                                                   |
| Data       | `vim-cheatsheet.md`         | Source of truth for all vim commands; generates `src/data.json` via `scripts/generateData.js`                   |
| Challenges | `vim-golf-challenges/`      | Git submodule with 1,000+ vimgolf challenges in org-mode format                                                 |
| Storage    | `src/engine/storageKeys.ts` | Centralised localStorage key registry (all keys prefixed `vimarcade_`; `knownItems` is shared with ui-practice) |

---

## Development

```bash
npm install
npm run dev      # start dev server
npm run build    # production build (also regenerates data.json)
npm test         # vitest unit tests (engine layer only)
```
