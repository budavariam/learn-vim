export type Language = 'go' | 'rust' | 'python' | 'typescript' | 'c' | 'cpp'

export type GameMode = 'general' | 'timed_challenge' | 'survival'

export type TimedChallengeDuration = 1 | 2 | 5 | 10 | 15

export type RepetitionLevel = 1 | 2 | 3 | 5

export type GameStatus = 'setup' | 'warmup' | 'playing' | 'paused' | 'results'

export type ChallengeStatus = 'active' | 'completed' | 'failed'

// How the solution is surfaced during guided play
export type GuidedMode =
  | 'none'              // never show solution
  | 'all'               // always show solution
  | 'first_only'        // show on first occurrence only, then queue a blind verification
  | 'alternating'       // show on odd appearances (1st, 3rd, 5th…)
  | 'after_failure'     // show only after the command has been failed at least once
  | 'first_then_failure'// show on 1st occurrence AND after any failure

// In-game settings that can be toggled from the settings drawer without restarting
export interface GameSettings {
  guidedMode: GuidedMode
}

export interface CategoryPreset {
  name: string
  categories: string[]
}

export interface GameConfig {
  mode: GameMode
  language: Language
  startingLevel: number
  repetitionTarget: RepetitionLevel
  timedDurationMs?: number  // only for timed_challenge
  guidedMode: GuidedMode
  categories: string[] | null  // null = all categories
  // Optional time-based solution reveal: % of the challenge time limit after which
  // the solution auto-shows.  e.g. 50 = after 50% of the limit has elapsed.
  // Capped at 100% in survival mode (can't reveal after the failure threshold).
  // null = disabled.
  dynamicAssist: number | null
  skipUnsupported?: boolean
  commandTimeMultiplier?: number   // scales getTimeLimit output (default 1)
  // Which knowledge state to practise: 'unknown' = items not yet marked known,
  // 'known' = review only, 'all' = no filter.
  knowledgeFilter: 'all' | 'known' | 'unknown'
}

// Shape coming from data.json (generated from vim-cheatsheet.md)
export interface VimCommandData {
  id: string
  category: string
  question: string       // "Delete the current line"
  solution: string[]     // ["dd"]
  level: number          // 0–9
}

export interface ActiveChallenge {
  id: string             // unique instance id (not VimCommandData.id)
  commandId: string      // VimCommandData.id
  level: number
  category: string
  question: string
  solution: string[]
  startedAt: number      // ms timestamp at activation
  timeLimit: number      // ms
  status: ChallengeStatus
  pointsEarned: number
  showSolution: boolean   // whether to render the solution hint
  isVerification: boolean // follow-up blind check after a guided occurrence
  doneAt?: number         // ms timestamp when status transitioned to completed/failed
}

export interface ComboState {
  count: number
  multiplier: number
}

export interface LevelProgress {
  [level: number]: {
    seen: Set<string>                      // commandIds ever presented
    completionCounts: Map<string, number>  // commandId → times completed
    failureCounts: Map<string, number>     // commandId → times failed (for guided logic)
  }
}

export interface SessionStats {
  totalChallenges: number
  completed: number
  failed: number
  totalPoints: number
  bestCombo: number
  startedAt: number
  // survival mode
  expectedTimeMs: number   // sum of timeLimit for all challenges ever presented
  achievedTimeMs: number   // time from start to first failure (0 while alive)
}

export interface GameState {
  status: GameStatus
  config: GameConfig
  liveSettings: GameSettings   // mutable in-game overrides
  // convenience aliases (same as config.language / config.startingLevel)
  language: Language
  startingLevel: number
  activeChallenges: ActiveChallenge[]
  maxConcurrent: number
  ceiling: number
  score: number
  combo: ComboState
  levelProgress: LevelProgress
  sessionStats: SessionStats
  recentNotifications: Notification[]
  // computed each tick
  levelPct: number         // 0–100, progress toward ceiling advance
  sessionElapsedMs: number
  // pending verification challenges (commandIds that need a blind follow-up)
  pendingVerifications: string[]
}

export type NotificationType = 'lightning' | 'fast' | 'good' | 'completed' | 'failed' | 'combo' | 'levelup'

export interface Notification {
  id: string
  type: NotificationType
  text: string
  points?: number
  expiresAt: number
}

// --- Post-game review --------------------------------------------------------

export interface ReviewItem {
  commandId: string
  question: string
  solution: string[]
  category: string
  level: number
  completions: number   // times successfully completed this session
  failures: number      // times failed / timed out this session
  suggestKnown: boolean // engine recommendation
  alreadyKnown: boolean // was already in known list before this session
}


export interface HighScoreEntry {
  id: string
  timestamp: number
  score: number
  mode: GameMode
  language: Language
  startingLevel: number
  repetitionTarget: RepetitionLevel
  guidedMode: GuidedMode
  challengesCompleted: number
  challengesFailed: number
  accuracy: number        // 0–1
  sessionDurationMs: number
  // survival-specific
  expectedTimeMs: number
  achievedTimeMs: number
}

export interface HighScores {
  general: HighScoreEntry[]
  timed_challenge: HighScoreEntry[]
  survival: HighScoreEntry[]
}

// --- VimGolf mode ------------------------------------------------------------

export interface VimGolfChallenge {
  id: string
  title: string
  description: string
  start: string       // initial editor content
  end: string         // expected final content
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  vimgolfId?: string  // vimgolf.com challenge ID for attribution
}

export interface VimGolfEntry {
  id: string
  timestamp: number
  keystrokes: number
  timeMs: number
  resetCount: number
}

// Keyed by challengeId; sorted keystrokes ASC, timeMs ASC (lower = better)
export interface VimGolfHighScores {
  [challengeId: string]: VimGolfEntry[]
}

export interface DiffLine {
  type: 'equal' | 'added' | 'removed'
  content: string
}

// --- Goal Mode ------------------------------------------------------------

export type GoalTimeLimitMs = 30_000 | 60_000 | 120_000 | 0   // 0 = unlimited

export interface GoalModeConfig {
  // ── Text transformation goals ──────────────────────────────────────────
  challengeCount:     number           // number of text editing goals, default 5
  timeLimitMs:        GoalTimeLimitMs  // per text goal (0 = unlimited)
  difficulty:         'easy' | 'medium' | 'hard' | 'all'

  // ── Arcade command challenges ──────────────────────────────────────────
  concurrentChallenges: number        // how many command challenges at once, default 5
  commandTimeMultiplier: number       // scale command time limits (1.0–3.0), default 2.0

  // ── Shared with Arcade GameConfig ─────────────────────────────────────
  language:           Language
  startingLevel:      number
  repetitionTarget:   RepetitionLevel
  guidedMode:         GuidedMode
  categories:         string[] | null
  dynamicAssist:      number | null
  skipUnsupported:    boolean
}

export interface GoalChallengeResult {
  challengeId: string
  title:       string
  solved:      boolean
  elapsedMs:   number
  keystrokes:  number
  points:      number
}
