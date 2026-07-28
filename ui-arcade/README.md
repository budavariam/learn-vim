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

### 🤖 VimBots

Inspired by the classic Unix `robots` game — survive waves of robots using only vim cursor movement.

**How to play:** Move your cursor with standard vim motion keys (`h`, `j`, `k`, `l`, `w`, `b`, `e`, `gg`, `G`, `0`, `$`, etc.). No editing commands are used — only navigation.

**Game mechanics:**
- After each move you make, every robot advances one step toward your cursor.
- When two or more robots collide (with each other or with existing fire), they explode into fire.
- Fire tiles are permanent — robots that walk into fire are destroyed.
- If a robot reaches your cursor, the game ends.
- Clear all robots to advance to the next level.

**Special actions:**

| Action          | Description                                         | Limit        |
| --------------- | --------------------------------------------------- | ------------ |
| Random teleport | Jump to a random free cell (may land near a robot)  | Limited uses |
| Safe teleport   | Jump to a cell guaranteed to be safe                | More limited |

**Difficulty levels** (percentage of grid cells initially filled with robots):

| Level    | Robot density |
| -------- | ------------- |
| Beginner | 5%            |
| Easy     | 10%           |
| Medium   | 20%           |
| Hard     | 40%           |
| Expert   | 70%           |

**Grid sizes:** Small 20×20 · Medium 40×40 · Large 60×60

**Scoring:**

| Event                  | Points                  |
| ---------------------- | ----------------------- |
| Robot collision        | 10 pts per robot        |
| Level clear bonus      | level × 100 pts         |
| Safe teleport bonus    | bonus pts per safe jump |

**Tips:**
- Lure robots into each other rather than avoiding them — collisions are how you score.
- Position yourself so robots funnel through fire you have already created.
- Save safe teleports for desperate situations; random teleports are risky but plentiful.
- On higher difficulties, chain collisions by drawing robots across existing fire fields.

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
