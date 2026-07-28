export type Language = 'go' | 'rust' | 'python' | 'typescript' | 'c' | 'cpp' | 'lorem'

// ── Shared challenge config ───────────────────────────────────────────────────
// All game modes that support an inline challenge panel embed this interface.
// Defaults are exported so each mode can reference a single source of truth.

export interface ChallengeConfig {
  challengeMode: boolean
  challengeGuidedMode: GuidedMode
  challengeStartingLevel: number
  challengeRepetition: RepetitionLevel
  challengeTimeMultiplier: number
  challengeCategories: string[]
  challengeDrillMode: boolean
}

export const CHALLENGE_CONFIG_DEFAULTS: ChallengeConfig = {
  challengeMode: false,
  challengeGuidedMode: 'none',
  challengeStartingLevel: 0,
  challengeRepetition: 1,
  challengeTimeMultiplier: 1,
  challengeCategories: [], // each mode supplies its own category list default
  challengeDrillMode: false,
}

// ── Shared handicap config ────────────────────────────────────────────────────
// Visual/input modifiers that make any game mode harder.
// All game modes embed these fields; MotionRace adds its own trail-specific extras.

export interface HandicapConfig {
  hjklOnly: boolean  // restrict movement to h/j/k/l only
  noHjkl: boolean    // block h/j/k/l — must use word/search motions
  opacityFade: boolean // dim text far from cursor
  snowEffect: boolean  // floating snowflakes overlay
}

export const HANDICAP_CONFIG_DEFAULTS: HandicapConfig = {
  hjklOnly: false,
  noHjkl: false,
  opacityFade: false,
  snowEffect: false,
}

export type GameMode = 'general' | 'timed_challenge' | 'survival'

export type TimedChallengeDuration = 1 | 2 | 5 | 10 | 15

export type RepetitionLevel = 1 | 2 | 3 | 5

export type GameStatus = 'setup' | 'warmup' | 'playing' | 'paused' | 'results'

export type ChallengeStatus = 'active' | 'completed' | 'failed'

// How the solution is surfaced during guided play
export type GuidedMode =
  | 'none' // never show solution
  | 'all' // always show solution
  | 'first_only' // show on first occurrence only, then queue a blind verification
  | 'alternating' // show on odd appearances (1st, 3rd, 5th…)
  | 'after_failure' // show only after the command has been failed at least once
  | 'first_then_failure' // show on 1st occurrence AND after any failure

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
  timedDurationMs?: number // only for timed_challenge
  guidedMode: GuidedMode
  categories: string[] | null // null = all categories
  // Optional time-based solution reveal: % of the challenge time limit after which
  // the solution auto-shows.  e.g. 50 = after 50% of the limit has elapsed.
  // Capped at 100% in survival mode (can't reveal after the failure threshold).
  // null = disabled.
  dynamicAssist: number | null
  skipUnsupported?: boolean
  commandTimeMultiplier?: number // scales getTimeLimit output (default 1)
  // Which knowledge state to practise: 'unknown' = items not yet marked known,
  // 'known' = review only, 'all' = no filter.
  knowledgeFilter: 'all' | 'known' | 'unknown'
  // Drill mode: present commands one-by-one in sequential order, no randomisation.
  drillMode?: boolean
  // Handicaps (optional for backward compat with saved configs)
  hjklOnly?: boolean
  noHjkl?: boolean
  opacityFade?: boolean
  snowEffect?: boolean
}

// Shape coming from data.json (generated from vim-cheatsheet.md)
export interface VimCommandData {
  id: string
  category: string
  question: string // "Delete the current line"
  solution: string[] // ["dd"]
  level: number // 0–9
}

export interface ActiveChallenge {
  id: string // unique instance id (not VimCommandData.id)
  commandId: string // VimCommandData.id
  level: number
  category: string
  question: string
  solution: string[]
  startedAt: number // ms timestamp at activation
  timeLimit: number // ms
  status: ChallengeStatus
  pointsEarned: number
  showSolution: boolean // whether to render the solution hint
  isVerification: boolean // follow-up blind check after a guided occurrence
  doneAt?: number // ms timestamp when status transitioned to completed/failed
}

export interface ComboState {
  count: number
  multiplier: number
}

export interface LevelProgress {
  [level: number]: {
    seen: Set<string> // commandIds ever presented
    completionCounts: Map<string, number> // commandId → times completed
    failureCounts: Map<string, number> // commandId → times failed (for guided logic)
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
  expectedTimeMs: number // sum of timeLimit for all challenges ever presented
  achievedTimeMs: number // time from start to first failure (0 while alive)
}

export interface GameState {
  status: GameStatus
  config: GameConfig
  liveSettings: GameSettings // mutable in-game overrides
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
  levelPct: number // 0–100, progress toward ceiling advance
  sessionElapsedMs: number
  // pending verification challenges (commandIds that need a blind follow-up)
  pendingVerifications: string[]
  // Sequential drill index — only used when config.drillMode is true
  drillIndex: number
}

export type NotificationType =
  'lightning' | 'fast' | 'good' | 'completed' | 'failed' | 'combo' | 'levelup'

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
  completions: number // times successfully completed this session
  failures: number // times failed / timed out this session
  suggestKnown: boolean // engine recommendation
  alreadyKnown: boolean // was already in known list before this session
}

export interface HighScoreEntry {
  id: string
  username?: string // 'vim-user' default; absent in legacy entries loaded from localStorage
  timestamp: number
  score: number
  mode: GameMode
  language: Language
  startingLevel: number
  repetitionTarget: RepetitionLevel
  guidedMode: GuidedMode
  challengesCompleted: number
  challengesFailed: number
  accuracy: number // 0–1
  sessionDurationMs: number
  // survival-specific
  expectedTimeMs: number
  achievedTimeMs: number
}

export interface MotionRaceHighScoreEntry {
  id: string
  username?: string
  timestamp: number
  endGoal: 'timed' | 'survival' | 'total_goals'
  score: number
  keystrokes: number
  sessionDurationMs: number
  language: string
}

export interface GoalModeHighScoreEntry {
  id: string
  username?: string
  timestamp: number
  challengeCount: number
  difficulty: string
  solved: number
  totalKeystrokes: number
  totalElapsedMs: number
  totalPoints: number
}

export interface VimBotsHighScoreEntry {
  id: string
  username?: string
  timestamp: number
  difficulty: 'beginner' | 'easy' | 'medium' | 'hard' | 'expert'
  levelsCleared: number
  totalScore: number
  challengeScore: number // arcade challenge points earned during the run (0 if challenge mode off)
  gridSize: string // preset name or language — flexible for all board sources
}

export interface HighScores {
  general: HighScoreEntry[]
  timed_challenge: HighScoreEntry[]
  survival: HighScoreEntry[]
  motionrace_timed: MotionRaceHighScoreEntry[]
  motionrace_survival: MotionRaceHighScoreEntry[]
  motionrace_total_goals: MotionRaceHighScoreEntry[]
  goal: GoalModeHighScoreEntry[]
  vimbots: VimBotsHighScoreEntry[]
}

// --- VimGolf mode ------------------------------------------------------------

export interface VimGolfChallenge {
  id: string
  title: string
  description: string
  start: string // initial editor content
  end: string // expected final content
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  vimgolfId?: string // vimgolf.com challenge ID for attribution
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

export type GoalTimeLimitMs = 30_000 | 60_000 | 120_000 | 0 // 0 = unlimited

export interface GoalModeConfig {
  // ── Text transformation goals ──────────────────────────────────────────
  challengeCount: number // number of text editing goals, default 5
  timeLimitMs: GoalTimeLimitMs // per text goal (0 = unlimited)
  difficulty: 'easy' | 'medium' | 'hard' | 'all'

  // ── Arcade command challenges ──────────────────────────────────────────
  concurrentChallenges: number // how many command challenges at once, default 5
  commandTimeMultiplier: number // scale command time limits (1.0–3.0), default 2.0

  // ── Shared with Arcade GameConfig ─────────────────────────────────────
  language: Language
  startingLevel: number
  repetitionTarget: RepetitionLevel
  guidedMode: GuidedMode
  categories: string[] | null
  dynamicAssist: number | null
  skipUnsupported: boolean
  solvedFilter?: 'all' | 'unsolved' | 'solved' | 'mixed'
  // Handicaps (optional for backward compat with saved configs)
  hjklOnly?: boolean
  noHjkl?: boolean
  opacityFade?: boolean
  snowEffect?: boolean
}

export interface GoalChallengeResult {
  challengeId: string
  title: string
  solved: boolean
  elapsedMs: number
  keystrokes: number
  points: number
}
