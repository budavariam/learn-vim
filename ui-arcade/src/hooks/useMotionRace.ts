import { useReducer, useEffect, useRef, useCallback } from 'react'
import { useMonacoEditor } from './useMonacoEditor'
import type { TrailEntry } from './useMonacoEditor'
import { getFile } from '../files'
import type { Language, VimCommandData, GuidedMode, RepetitionLevel } from '../engine/types'
import { normaliseVimKey } from '../engine/vimKeyUtils'
import rawData from '../data.json'
import { loadHighScores, saveHighScores, addMotionRaceHighScore } from '../engine/HighScoreEngine'
import type { MotionRaceHighScoreEntry } from '../engine/types'

const allCommands = rawData as VimCommandData[]

// Motion-safe categories — no editing, only navigation/search/marks
export const MOTION_CHALLENGE_CATEGORIES = [
  'Cursor movement',
  'Marks',
  'Search and replace',
  'Folding',
]

// ── Types ─────────────────────────────────────────────────────────────────────

export type DistanceMode = 'short' | 'medium' | 'long' | 'mixed'
export type GoalDisplayMode = 'next' | 'all'
export type EndGoalType = 'user_count' | 'total_count' | 'timed' | 'survival'
export type EnemySpeed = 'slow' | 'medium' | 'fast' | 'mixed'

export interface MotionRaceConfig {
  language: Language
  endGoal: EndGoalType
  targetCount: number // for user_count mode
  durationMs: number // for timed mode
  startFromPrevious: boolean
  distanceMode: DistanceMode
  goalDisplayMode: GoalDisplayMode
  multiGoalCount: number // how many goals shown at once (1–5)
  snakeTrail: boolean // user has a snake trail
  enemyCount: 0 | 1 | 3 | 5 | 10
  enemyTrail: boolean // enemy trails block movement
  enemySpeed: EnemySpeed
  // Handicaps / visual effects
  snowEffect: boolean // floating snowflakes overlay
  opacityFade: boolean // text dims with distance from cursor line
  confettiOnGoal: boolean // burst of colored particles on goal reached
  penaltyFlash: boolean // red flash when enemy scores
  hjklOnly: boolean // restrict to hjkl only (mutually exclusive with noHjkl)
  noHjkl: boolean // block hjkl — must use word/search motions (mutually exclusive with hjklOnly)
  fogOfWar: boolean // hide enemy cursors and trails in the editor (still visible in minimap)
  enemyMultiColor: boolean // give each enemy a distinct color; false = all enemies share palette 0
  showMinimap: boolean // minimap sidebar showing enemies and goals
  challengeMode: boolean // show motion/search challenges alongside navigation
  challengeCategories: string[] // which command categories to pull challenges from
  challengeGuidedMode: GuidedMode // when to show solution hints
  challengeStartingLevel: number // minimum command level to include
  challengeRepetition: RepetitionLevel // how many times each command must be completed
  challengeTimeMultiplier: number // time multiplier for challenge timer (1 = default)
  challengeDrillMode?: boolean // present challenges in sequential order instead of random
  padEmptyLines: boolean // inject a single space into empty lines
  startAtFirstLine: boolean // start at the first valid line
  solidTrails: boolean // trails block movement
  trailLengthMultiplier: number | 'infinite'
  enemyTrailSolid: boolean // enemy trails block user
  enemyTrailMultiplier: number | 'infinite'
}

export interface CompletedPath {
  keystrokes: number
  elapsedMs: number
  valid: boolean
}

type Pos = { lineNumber: number; column: number }

export type TrailPos = Pos & { age: number }

export interface Enemy {
  id: number
  pos: Pos
  trail: TrailPos[]
  score: number
  colorIdx: number // index into SCSS enemy palette (0–5)
}

export interface MotionRaceGameState {
  status: 'playing' | 'results'
  endReason: 'count' | 'timed' | 'survival' | null
  config: MotionRaceConfig
  from: Pos
  goals: Pos[] // all active goal positions (1 for 'next', N for 'all')
  currentPos: Pos
  keystrokes: number
  contentValid: boolean
  completedPaths: CompletedPath[]
  totalElapsedMs: number
  pathElapsedMs: number
  trail: TrailPos[] // user's snake trail
  userScore: number // goals collected by user
  enemies: Enemy[]
  enemyScore: number // goals collected by enemies
  activeChallenge: VimCommandData | null // current motion challenge (or null)
  challengeScore: number // challenges completed
  lastCollision: number // timestamp of last wall collision
}

// ── Reducer ───────────────────────────────────────────────────────────────────

type RaceAction =
  | {
      type: 'START'
      config: MotionRaceConfig
      from: Pos
      goals: Pos[]
      firstChallenge: VimCommandData | null
    }
  | { type: 'CURSOR_MOVED'; pos: Pos; trail: TrailPos[] }
  | { type: 'CONTENT_INVALID' }
  | { type: 'TICK'; totalMs: number; pathMs: number }
  | { type: 'INCREMENT_KEYS' }
  | {
      type: 'NEXT_PATH'
      from: Pos
      goals: Pos[]
      completed: CompletedPath[]
      totalMs: number
      userScore: number
    }
  | {
      type: 'GOAL_REPLACED'
      goals: Pos[]
      completed: CompletedPath[]
      totalMs: number
      userScore: number
    }
  | {
      type: 'END'
      completed: CompletedPath[]
      totalMs: number
      reason: 'count' | 'timed' | 'survival'
    }
  | { type: 'ENEMY_TICK'; enemies: Enemy[]; enemyScore: number; goals: Pos[] }
  | { type: 'CHALLENGE_DONE'; next: VimCommandData | null; challengeScore: number }
  | { type: 'TRAIL_COLLISION' }

const ZERO: Pos = { lineNumber: 1, column: 1 }

const BLANK: MotionRaceGameState = {
  status: 'playing',
  endReason: null,
  config: {
    language: 'typescript',
    endGoal: 'timed',
    targetCount: 10,
    durationMs: 60_000,
    startFromPrevious: true,
    distanceMode: 'mixed',
    goalDisplayMode: 'next',
    multiGoalCount: 3,
    snakeTrail: true,
    enemyCount: 0,
    enemyTrail: false,
    enemySpeed: 'medium',
    snowEffect: false,
    opacityFade: false,
    confettiOnGoal: false,
    penaltyFlash: false,
    hjklOnly: false,
    noHjkl: false,
    fogOfWar: false,
    enemyMultiColor: true,
    showMinimap: true,
    challengeMode: false,
    challengeCategories: MOTION_CHALLENGE_CATEGORIES,
    challengeGuidedMode: 'none' as GuidedMode,
    challengeStartingLevel: 0,
    challengeRepetition: 1 as RepetitionLevel,
    challengeTimeMultiplier: 1,
    challengeDrillMode: false,
    padEmptyLines: true,
    startAtFirstLine: true,
    solidTrails: true,
    trailLengthMultiplier: 1,
    enemyTrailSolid: true,
    enemyTrailMultiplier: 1,
  },
  from: ZERO,
  goals: [ZERO],
  currentPos: ZERO,
  keystrokes: 0,
  contentValid: true,
  completedPaths: [],
  totalElapsedMs: 0,
  pathElapsedMs: 0,
  trail: [],
  userScore: 0,
  enemies: [],
  enemyScore: 0,
  activeChallenge: null,
  challengeScore: 0,
  lastCollision: 0,
}

function raceReducer(state: MotionRaceGameState, action: RaceAction): MotionRaceGameState {
  switch (action.type) {
    case 'START':
      return {
        ...BLANK,
        status: 'playing',
        config: action.config,
        from: action.from,
        currentPos: action.from,
        goals: action.goals,
        activeChallenge: action.firstChallenge,
        trail: [
          {
            ...action.from,
            age: 0,
          },
        ],
        lastCollision: 0,
      }
    case 'CURSOR_MOVED':
      return { ...state, currentPos: action.pos, trail: action.trail }
    case 'CONTENT_INVALID':
      return { ...state, contentValid: false }
    case 'TICK':
      return { ...state, totalElapsedMs: action.totalMs, pathElapsedMs: action.pathMs }
    case 'INCREMENT_KEYS':
      return { ...state, keystrokes: state.keystrokes + 1 }
    case 'NEXT_PATH':
      return {
        ...state,
        from: action.from,
        goals: action.goals,
        currentPos: action.from,
        keystrokes: 0,
        contentValid: true,
        completedPaths: action.completed,
        totalElapsedMs: action.totalMs,
        pathElapsedMs: 0,
        userScore: action.userScore,
      }
    case 'GOAL_REPLACED':
      return {
        ...state,
        goals: action.goals,
        completedPaths: action.completed,
        totalElapsedMs: action.totalMs,
        pathElapsedMs: 0,
        userScore: action.userScore,
      }
    case 'END':
      return {
        ...state,
        status: 'results',
        endReason: action.reason,
        completedPaths: action.completed,
        totalElapsedMs: action.totalMs,
      }
    case 'ENEMY_TICK':
      return {
        ...state,
        enemies: action.enemies,
        enemyScore: action.enemyScore,
        goals: action.goals,
      }
    case 'CHALLENGE_DONE':
      return { ...state, activeChallenge: action.next, challengeScore: action.challengeScore }
    case 'TRAIL_COLLISION':
      return { ...state, lastCollision: Date.now() }
    default:
      return state
  }
}

// ── Position generation ───────────────────────────────────────────────────────

const DIST_SHORT = 8
const DIST_MEDIUM = 25

function buildValidLines(content: string) {
  return content
    .split('\n')
    .map((line, i) => {
      const cols: number[] = []
      for (let j = 0; j < line.length; j++) {
        const code = line.charCodeAt(j)
        // Only allow standard ASCII printable characters (excluding space)
        if (code >= 33 && code <= 126) {
          cols.push(j + 1)
        }
      }
      return { n: i + 1, cols }
    })
    .filter(({ cols }) => cols.length > 0)
}

function lineDist(a: Pos, b: Pos): number {
  return Math.abs(a.lineNumber - b.lineNumber)
}

function posEq(a: Pos, b: Pos): boolean {
  return a.lineNumber === b.lineNumber && a.column === b.column
}

function isDistanceOk(from: Pos, to: Pos, mode: DistanceMode): boolean {
  const d = lineDist(from, to)
  if (d === 0) return false
  switch (mode) {
    case 'short':
      return d <= DIST_SHORT
    case 'medium':
      return d > DIST_SHORT && d <= DIST_MEDIUM
    case 'long':
      return d > DIST_MEDIUM
    case 'mixed':
      return Math.random() < 0.7 ? d <= DIST_SHORT : d > DIST_MEDIUM
  }
}

function isBlocked(pos: Pos, trail: TrailPos[]): boolean {
  return trail.some(t => posEq(t, pos))
}

type ValidLines = ReturnType<typeof buildValidLines>

function generateGoal(
  content: string,
  from: Pos,
  trail: TrailPos[],
  distMode: DistanceMode,
  excluded: Pos[] = [],
  validLines?: ValidLines
): Pos | null {
  const valid = validLines ?? buildValidLines(content)
  const candidates = valid
    .filter(({ n }) => n !== from.lineNumber)
    .flatMap(({ n, cols }) => cols.map(c => ({ lineNumber: n, column: c })))
    .filter(p => !isBlocked(p, trail) && !excluded.some(e => posEq(e, p)))

  // Try with distance constraint first
  const distOk = candidates.filter(p => isDistanceOk(from, p, distMode))
  if (distOk.length > 0) return distOk[Math.floor(Math.random() * distOk.length)]

  // Fallback: ignore distance constraint
  if (candidates.length > 0) return candidates[Math.floor(Math.random() * candidates.length)]

  return null
}

function generateFrom(content: string, trail: TrailPos[], validLines?: ValidLines): Pos | null {
  const valid = validLines ?? buildValidLines(content)
  const candidates = valid
    .flatMap(({ n, cols }) => cols.map(c => ({ lineNumber: n, column: c })))
    .filter(p => !isBlocked(p, trail))
  if (candidates.length === 0) {
    const all = valid.flatMap(({ n, cols }) => cols.map(c => ({ lineNumber: n, column: c })))
    return all.length > 0 ? all[Math.floor(Math.random() * all.length)] : null
  }
  return candidates[Math.floor(Math.random() * candidates.length)]
}

function generateInitialGoals(
  content: string,
  from: Pos,
  count: number,
  trail: TrailPos[],
  distMode: DistanceMode,
  validLines?: ValidLines
): Pos[] {
  const goals: Pos[] = []
  for (let i = 0; i < count; i++) {
    const g = generateGoal(content, from, trail, distMode, goals, validLines)
    if (g) goals.push(g)
  }
  return goals
}

// ── Trail helpers ─────────────────────────────────────────────────────────────

// Trail length equals score — like classic snake, grows as you collect goals.
// No hard cap so the trail persists as earned. CSS age is clamped at 8 for rendering.
function trailMax(userScore: number, multiplier: number | 'infinite'): number {
  if (multiplier === 'infinite') return Infinity
  return (userScore > 0 ? userScore + 1 : 0) * multiplier
}

function advanceTrail(current: TrailPos[], newPos: Pos, maxLen: number): TrailPos[] {
  if (maxLen === 0) return []
  const aged = current.map(p => ({ ...p, age: p.age + 1 }))
  if (maxLen === Infinity) {
    return [{ ...newPos, age: 1 }, ...aged]
  }
  return [{ ...newPos, age: 1 }, ...aged].slice(0, maxLen)
}

// ── Enemy helpers ─────────────────────────────────────────────────────────────

const ENEMY_TICK_MS: Record<EnemySpeed, number> = {
  slow: 1200,
  medium: 500,
  fast: 200,
  mixed: 0, // per-enemy random from the three above
}

// Snap a position to the nearest valid (non-whitespace) character on its line.
// If the line is blank, walk outward to the nearest non-blank line.
function snapToValidPos(pos: Pos, content: string): Pos {
  const lines = content.split('\n')
  const lineIdx = Math.min(Math.max(pos.lineNumber - 1, 0), lines.length - 1)

  function validColsFor(idx: number): number[] {
    const line = lines[idx] ?? ''
    const cols: number[] = []
    for (let j = 0; j < line.length; j++) {
      if (line[j].trim() !== '') cols.push(j + 1)
    }
    return cols
  }

  let cols = validColsFor(lineIdx)

  if (cols.length === 0) {
    // Blank line — find nearest non-blank line
    for (let offset = 1; offset < lines.length; offset++) {
      for (const delta of [1, -1]) {
        const idx = lineIdx + delta * offset
        if (idx < 0 || idx >= lines.length) continue
        cols = validColsFor(idx)
        if (cols.length > 0) return { lineNumber: idx + 1, column: cols[0] }
      }
    }
    return ZERO
  }

  // Snap column to nearest valid position
  let best = cols[0]
  let bestDist = Math.abs(pos.column - best)
  for (const c of cols) {
    const d = Math.abs(pos.column - c)
    if (d < bestDist) {
      bestDist = d
      best = c
    }
  }
  return { lineNumber: lineIdx + 1, column: best }
}

const ENEMY_PALETTE_COUNT = 6 // must match number of $enemy-hues in enemy-trails.scss

function buildEnemies(
  count: number,
  content: string,
  _trail: TrailPos[],
  multiColor: boolean
): Enemy[] {
  const valid = buildValidLines(content)
  const all = valid.flatMap(({ n, cols }) => cols.map(c => ({ lineNumber: n, column: c })))
  const enemies: Enemy[] = []
  for (let i = 0; i < count; i++) {
    const pos = all[Math.floor(Math.random() * all.length)] ?? ZERO
    const colorIdx = multiColor ? i % ENEMY_PALETTE_COUNT : 0
    enemies.push({ id: i, pos, trail: [], score: 0, colorIdx })
  }
  return enemies
}

function moveEnemyToward(
  enemy: Enemy,
  goal: Pos,
  trail: TrailPos[],
  enemyTrails: TrailPos[][]
): Pos {
  const { pos } = enemy
  if (posEq(pos, goal)) return pos

  const dLine = goal.lineNumber - pos.lineNumber
  const dCol = goal.column - pos.column

  // Try primary direction first (larger delta), then secondary
  const candidates: Pos[] = []
  if (Math.abs(dLine) >= Math.abs(dCol)) {
    candidates.push({ lineNumber: pos.lineNumber + Math.sign(dLine), column: pos.column })
    candidates.push({ lineNumber: pos.lineNumber, column: pos.column + Math.sign(dCol) })
  } else {
    candidates.push({ lineNumber: pos.lineNumber, column: pos.column + Math.sign(dCol) })
    candidates.push({ lineNumber: pos.lineNumber + Math.sign(dLine), column: pos.column })
  }

  for (const c of candidates) {
    const blocked = isBlocked(c, trail) || enemyTrails.some(et => isBlocked(c, et))
    if (!blocked) return c
  }
  return pos // stuck — don't move
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export interface UseMotionRaceReturn {
  state: MotionRaceGameState
  editorRef: React.RefObject<HTMLDivElement | null>
  statusRef: React.RefObject<HTMLDivElement | null>
  startGame: (config: MotionRaceConfig) => void
  getVisibleRange: () => { startLine: number; endLine: number } | null
  totalLines: number
}

export function useMotionRace(): UseMotionRaceReturn {
  const [state, dispatch] = useReducer(raceReducer, BLANK)

  // Stable mutable refs
  const configRef = useRef<MotionRaceConfig | null>(null)
  const fileContentRef = useRef('')
  const validLinesRef = useRef<ReturnType<typeof buildValidLines>>([]) // cached, recomputed on startGame
  const totalLinesRef = useRef(0)
  const gameStartRef = useRef(0)
  const pathStartRef = useRef(0)
  const contentValidRef = useRef(true)
  const keystrokesRef = useRef(0)
  const goalsRef = useRef<Pos[]>([ZERO])
  const completedRef = useRef<CompletedPath[]>([])
  const gameStatusRef = useRef<'idle' | 'playing' | 'results'>('idle')
  const invalidTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isRestoringRef = useRef(false)
  const userScoreRef = useRef(0)
  const trailRef = useRef<TrailPos[]>([])
  const enemiesRef = useRef<Enemy[]>([])
  const challengeScoreRef = useRef(0)
  const activeChallengeRef = useRef<VimCommandData | null>(null)
  const challengeDrillIndexRef = useRef(0)
  const enemyScoreRef = useRef(0)
  const enemyTickRefs = useRef<ReturnType<typeof setInterval>[]>([])

  // Forward refs filled after useMonacoEditor
  const positionCursorRef = useRef<(p: Pos) => void>(() => {})
  const setGoalHighlightsRef = useRef<(gs: Pos[]) => void>(() => {})
  const setTrailDecorationsRef = useRef<(t: TrailEntry[]) => void>(() => {})
  const setContentEditorRef = useRef<(c: string) => void>(() => {})
  const focusEditorRef = useRef<() => void>(() => {})
  const getVisibleRangeRef = useRef<() => { startLine: number; endLine: number } | null>(() => null)
  const pendingSetupRef = useRef<{ from: Pos; goals: Pos[] } | null>(null)

  // Cleanup enemy intervals on unmount
  useEffect(
    () => () => {
      enemyTickRefs.current.forEach(clearInterval)
      if (invalidTimerRef.current) clearTimeout(invalidTimerRef.current)
    },
    []
  )

  // Key restriction enforcement (hjklOnly / noHjkl)
  useEffect(() => {
    const config = configRef.current
    if (!config || (!config.hjklOnly && !config.noHjkl)) return

    const HJKL_KEYS = new Set(['h', 'j', 'k', 'l'])
    function onKey(e: KeyboardEvent) {
      if (gameStatusRef.current !== 'playing') return
      if (e.ctrlKey || e.altKey || e.metaKey) return
      if (e.key.length !== 1) return
      if (config!.noHjkl && HJKL_KEYS.has(e.key)) {
        e.preventDefault()
        e.stopPropagation()
      } else if (config!.hjklOnly && !HJKL_KEYS.has(e.key)) {
        // Allow: hjkl, Escape, Enter, numbers (counts), colon (ex commands)
        if (!':0123456789'.includes(e.key)) {
          e.preventDefault()
          e.stopPropagation()
        }
      }
    }
    document.addEventListener('keydown', onKey, { capture: true })
    return () => document.removeEventListener('keydown', onKey, { capture: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status])

  // Keep completedRef in sync
  useEffect(() => {
    completedRef.current = state.completedPaths
  }, [state.completedPaths])
  useEffect(() => {
    trailRef.current = state.trail
  }, [state.trail])
  useEffect(() => {
    enemiesRef.current = state.enemies
  }, [state.enemies])
  useEffect(() => {
    activeChallengeRef.current = state.activeChallenge
  }, [state.activeChallenge])

  // ── Trail decoration sync ────────────────────────────────────────────────────

  const syncTrailDecorations = useCallback((trail: TrailPos[], enemies: Enemy[]) => {
    const config = configRef.current
    const showEnemiesInEditor = !config?.fogOfWar
    const isSolid = config?.solidTrails || config?.endGoal === 'survival'
    const enemyIsSolid = !!config?.enemyTrailSolid
    const entries: TrailEntry[] = [
      ...trail.map(p => ({ ...p, type: 'user' as const, isSolid })),
      ...(showEnemiesInEditor
        ? enemies.map(e => ({ ...e.pos, age: 0, type: 'enemy' as const, colorIdx: e.colorIdx, isSolid: enemyIsSolid }))
        : []),
      ...(showEnemiesInEditor
        ? enemies.flatMap(e =>
            e.trail.map(p => ({ ...p, type: 'enemy' as const, colorIdx: e.colorIdx, isSolid: enemyIsSolid }))
          )
        : []),
    ]
    setTrailDecorationsRef.current(entries)
  }, [])

  // ── advancePath (next mode) ──────────────────────────────────────────────────

  const advancePath = useCallback((valid: boolean) => {
    if (gameStatusRef.current !== 'playing') return

    const now = Date.now()
    const totalMs = now - gameStartRef.current
    const pathMs = now - pathStartRef.current
    const config = configRef.current!
    const newEntry: CompletedPath = { keystrokes: keystrokesRef.current, elapsedMs: pathMs, valid }
    const completed = [...completedRef.current, newEntry]
    const newScore = userScoreRef.current + (valid ? 1 : 0)

    // Check end conditions
    const countDone = config.endGoal === 'user_count' && newScore >= config.targetCount
    const totalDone =
      config.endGoal === 'total_count' && newScore + enemyScoreRef.current >= config.targetCount
    const timeDone = config.endGoal === 'timed' && totalMs >= config.durationMs

    if (countDone || totalDone || timeDone) {
      gameStatusRef.current = 'results'
      setGoalHighlightsRef.current([])
      dispatch({
        type: 'END',
        completed,
        totalMs,
        reason: countDone || totalDone ? 'count' : 'timed',
      })
      return
    }

    // Generate next path
    const prevEnd = goalsRef.current[0]
    const fixedFrom = config.startFromPrevious ? prevEnd : undefined
    const trail = trailRef.current
    const from =
      fixedFrom ?? generateFrom(fileContentRef.current, trail, validLinesRef.current) ?? ZERO
    
    const newGoals = config.goalDisplayMode === 'all'
      ? generateInitialGoals(fileContentRef.current, from, config.multiGoalCount, trail, config.distanceMode, validLinesRef.current)
      : (() => {
          const g = generateGoal(fileContentRef.current, from, trail, config.distanceMode, [], validLinesRef.current)
          return g ? [g] : []
        })()
    
    if (!newGoals.length) return

    contentValidRef.current = true
    keystrokesRef.current = 0
    pathStartRef.current = Date.now()
    userScoreRef.current = newScore
    goalsRef.current = newGoals
    completedRef.current = completed

    if (!valid) {
      isRestoringRef.current = true
      setContentEditorRef.current(fileContentRef.current)
      Promise.resolve().then(() => {
        positionCursorRef.current(from)
        isRestoringRef.current = false
        focusEditorRef.current()
      })
    } else if (!config.startFromPrevious) {
      positionCursorRef.current(from)
      focusEditorRef.current()
    }

    setGoalHighlightsRef.current(newGoals)
    dispatch({ type: 'NEXT_PATH', from, goals: newGoals, completed, totalMs, userScore: newScore })
  }, [])

  // ── collectGoal (all mode) ───────────────────────────────────────────────────

  const collectGoalInAllMode = useCallback((goalIdx: number) => {
    if (gameStatusRef.current !== 'playing') return

    const now = Date.now()
    const totalMs = now - gameStartRef.current
    const pathMs = now - pathStartRef.current
    const config = configRef.current!
    const newEntry: CompletedPath = {
      keystrokes: keystrokesRef.current,
      elapsedMs: pathMs,
      valid: true,
    }
    const completed = [...completedRef.current, newEntry]
    const newScore = userScoreRef.current + 1

    keystrokesRef.current = 0
    pathStartRef.current = Date.now()
    userScoreRef.current = newScore

    // Check end condition
    const countDone = config.endGoal === 'user_count' && newScore >= config.targetCount
    const totalDone =
      config.endGoal === 'total_count' && newScore + enemyScoreRef.current >= config.targetCount
    if (countDone || totalDone) {
      gameStatusRef.current = 'results'
      setGoalHighlightsRef.current([])
      dispatch({ type: 'END', completed, totalMs, reason: 'count' })
      return
    }

    // Replace collected goal with a new one anchored to the collected position
    const collectedPos = goalsRef.current[goalIdx]
    const currentGoals = [...goalsRef.current]
    currentGoals.splice(goalIdx, 1)
    const trail = trailRef.current
    const newGoal = generateGoal(
      fileContentRef.current,
      collectedPos,
      trail,
      config.distanceMode,
      currentGoals,
      validLinesRef.current
    )
    if (newGoal) currentGoals.splice(goalIdx, 0, newGoal)

    goalsRef.current = currentGoals
    completedRef.current = completed
    setGoalHighlightsRef.current(currentGoals)
    dispatch({
      type: 'GOAL_REPLACED',
      goals: currentGoals,
      completed,
      totalMs,
      userScore: newScore,
    })
  }, [])

  // ── Monaco callbacks ─────────────────────────────────────────────────────────

  const handleReady = useCallback(() => {
    const setup = pendingSetupRef.current
    if (!setup) return
    pendingSetupRef.current = null
    isRestoringRef.current = true
    setContentEditorRef.current(fileContentRef.current)
    Promise.resolve().then(() => {
      isRestoringRef.current = false
    })
    positionCursorRef.current(setup.from)
    setGoalHighlightsRef.current(setup.goals)
    focusEditorRef.current()
  }, [])

  const currentPosRef = useRef<Pos>(ZERO)

  const handleCursorChange = useCallback(
    (pos: Pos) => {
      if (gameStatusRef.current !== 'playing') return

      const config = configRef.current!
      
      const blockingTrail: TrailPos[] = [
        ...(config.snakeTrail ? trailRef.current : []),
        ...(config.enemyTrail && config.enemyTrailSolid ? enemiesRef.current.flatMap(e => e.trail) : []),
      ]
      const isSurvivalMode = config.endGoal === 'survival'
      const hitTrail = isBlocked(pos, blockingTrail)
      
      if (blockingTrail.length > 0 && hitTrail) {
        if (isSurvivalMode) {
          gameStatusRef.current = 'results'
          const totalMs = Date.now() - gameStartRef.current
          setGoalHighlightsRef.current([])
          dispatch({ type: 'END', completed: completedRef.current, totalMs, reason: 'survival' })
          return
        } else if (config.solidTrails) {
          // Revert cursor to previous position
          positionCursorRef.current(currentPosRef.current)
          dispatch({ type: 'TRAIL_COLLISION' })
          return
        }
      }

      currentPosRef.current = pos

      const newTrail = config.snakeTrail
        ? advanceTrail(trailRef.current, pos, trailMax(userScoreRef.current, config.trailLengthMultiplier))
        : []

      // Update trail decorations
      syncTrailDecorations(newTrail, enemiesRef.current)

      dispatch({ type: 'CURSOR_MOVED', pos, trail: newTrail })

      // Check if any goal reached
      const goals = goalsRef.current
      const hitIdx = goals.findIndex(g => posEq(g, pos))
      if (hitIdx !== -1) {
        if (config.goalDisplayMode === 'all') {
          collectGoalInAllMode(hitIdx)
        } else {
          advancePath(contentValidRef.current)
        }
      }
    },
    [advancePath, collectGoalInAllMode, syncTrailDecorations]
  )

  const handleContentChange = useCallback(
    (_content: string) => {
      if (gameStatusRef.current !== 'playing') return
      if (isRestoringRef.current) return
      if (!contentValidRef.current) return

      contentValidRef.current = false
      dispatch({ type: 'CONTENT_INVALID' })

      if (invalidTimerRef.current) clearTimeout(invalidTimerRef.current)
      invalidTimerRef.current = setTimeout(() => {
        advancePath(false)
      }, 1200)
    },
    [advancePath]
  )

  const handleAnyKey = useCallback(() => {
    if (gameStatusRef.current !== 'playing') return
    keystrokesRef.current += 1
    dispatch({ type: 'INCREMENT_KEYS' })
  }, [])

  // ── Challenge completion ─────────────────────────────────────────────────────

  // Tracks per-command completion counts for repetition logic
  const challengeCompletionsRef = useRef<Map<string, number>>(new Map())

  const handleCommandExecuted = useCallback((cmd: string) => {
    if (gameStatusRef.current !== 'playing') return
    const config = configRef.current
    if (!config?.challengeMode) return
    const challenge = activeChallengeRef.current
    if (!challenge) return

    const solved = challenge.solution.map(s => normaliseVimKey(s))
    if (!solved.includes(normaliseVimKey(cmd))) return

    // Track repetitions — only pick a new challenge when repetition target is met
    const completions = challengeCompletionsRef.current
    const current = (completions.get(challenge.id) ?? 0) + 1
    completions.set(challenge.id, current)

    const rep = config.challengeRepetition ?? 1
    const newScore = challengeScoreRef.current + 1
    challengeScoreRef.current = newScore

    const advanceToNext = current >= rep
    const pool = allCommands.filter(
      c =>
        config.challengeCategories.includes(c.category) &&
        c.level >= (config.challengeStartingLevel ?? 0) &&
        (advanceToNext ? c.id !== challenge.id : c.id === challenge.id)
    )

    let next: VimCommandData | null
    if (!advanceToNext) {
      next = challenge // stay on same challenge until rep target met
    } else if (pool.length === 0) {
      next = null
    } else if (config.challengeDrillMode) {
      const idx = challengeDrillIndexRef.current % pool.length
      next = pool[idx]
      challengeDrillIndexRef.current = (idx + 1) % pool.length
    } else {
      next = pool[Math.floor(Math.random() * pool.length)]
    }

    activeChallengeRef.current = next

    dispatch({ type: 'CHALLENGE_DONE', next, challengeScore: newScore })
  }, [])

  // ── useMonacoEditor ───────────────────────────────────────────────────────────

  const {
    editorRef,
    statusRef,
    setContent,
    positionCursor,
    setGoalHighlights,
    setTrailDecorations,
    setTargetHighlight,
    focusEditor,
    getVisibleRange,
  } = useMonacoEditor({
    onReady: handleReady,
    onCursorChange: handleCursorChange,
    onContentChange: handleContentChange,
    onAnyKey: handleAnyKey,
    onCommandExecuted: handleCommandExecuted,
  })

  // Sync forward refs
  positionCursorRef.current = positionCursor
  setGoalHighlightsRef.current = setGoalHighlights
  setTrailDecorationsRef.current = setTrailDecorations
  setContentEditorRef.current = setContent
  focusEditorRef.current = focusEditor
  getVisibleRangeRef.current = getVisibleRange
  // setTargetHighlight is still available for single-goal backward compat
  void setTargetHighlight

  // ── Enemy ticks ──────────────────────────────────────────────────────────────

  // Move a single enemy (identified by index) toward its target goal.
  // Called by per-enemy intervals for mixed speed, or called for all at once otherwise.
  const tickSingleEnemy = useCallback(
    (enemyIdx: number) => {
      if (gameStatusRef.current !== 'playing') return
      const config = configRef.current!
      const goals = goalsRef.current
      if (!goals.length) return

      const allEnemies = enemiesRef.current
      if (enemyIdx >= allEnemies.length) return

      const enemy = allEnemies[enemyIdx]
      const allTrails = allEnemies.map(e => e.trail)
      const userTrail = trailRef.current

      const targetGoal = goals[enemy.id % goals.length]
      const rawPos = moveEnemyToward(enemy, targetGoal, userTrail, allTrails)
      // Snap to nearest valid character — enemies must never sit on blank space
      const newPos = snapToValidPos(rawPos, fileContentRef.current)
      const maxTrailLen = config.enemyTrail ? trailMax(userScoreRef.current, config.trailLengthMultiplier) : 0
      const newTrail = maxTrailLen > 0 ? advanceTrail(enemy.trail, enemy.pos, maxTrailLen) : []
      const updated = [...allEnemies]
      updated[enemyIdx] = { ...enemy, pos: newPos, trail: newTrail }

      let newEnemyScore = enemyScoreRef.current
      let newGoals = [...goals]
      const goalIdx = newGoals.findIndex(g => posEq(g, newPos))
      if (goalIdx !== -1) {
        newEnemyScore++
        const newGoal = generateGoal(
          fileContentRef.current,
          newPos,
          trailRef.current,
          config.distanceMode,
          newGoals,
          validLinesRef.current
        )
        if (newGoal) newGoals[goalIdx] = newGoal
      }

      enemiesRef.current = updated
      enemyScoreRef.current = newEnemyScore
      goalsRef.current = newGoals

      syncTrailDecorations(trailRef.current, updated)
      setGoalHighlightsRef.current(newGoals)

      dispatch({ type: 'ENEMY_TICK', enemies: updated, enemyScore: newEnemyScore, goals: newGoals })
    },
    [syncTrailDecorations]
  )

  const tickAllEnemies = useCallback(() => {
    const count = enemiesRef.current.length
    for (let i = 0; i < count; i++) tickSingleEnemy(i)
  }, [tickSingleEnemy])

  // ── Timer ────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (state.status !== 'playing') return
    const id = setInterval(() => {
      const now = Date.now()
      const totalMs = now - gameStartRef.current
      const pathMs = now - pathStartRef.current
      dispatch({ type: 'TICK', totalMs, pathMs })

      const cfg = configRef.current
      if (
        cfg?.endGoal === 'timed' &&
        totalMs >= cfg.durationMs &&
        gameStatusRef.current === 'playing'
      ) {
        gameStatusRef.current = 'results'
        setGoalHighlightsRef.current([])
        dispatch({ type: 'END', completed: completedRef.current, totalMs, reason: 'timed' })
      }
    }, 100)
    return () => clearInterval(id)
  }, [state.status])

  // ── High Scores ──────────────────────────────────────────────────────────────

  useEffect(() => {
    if (state.status === 'results') {
      const entry: MotionRaceHighScoreEntry = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        endGoal: state.config.endGoal === 'user_count' ? 'total_goals' : state.config.endGoal as any,
        score: state.userScore,
        keystrokes: state.keystrokes,
        sessionDurationMs: state.totalElapsedMs,
        language: state.config.language,
      }
      
      const scores = loadHighScores()
      const updated = addMotionRaceHighScore(scores, entry)
      saveHighScores(updated)
    }
  }, [state.status])

  // ── startGame ────────────────────────────────────────────────────────────────

  const startGame = useCallback(
    (config: MotionRaceConfig) => {
      if (invalidTimerRef.current) clearTimeout(invalidTimerRef.current)
      enemyTickRefs.current.forEach(clearInterval)
      enemyTickRefs.current = []

      let content = getFile(config.language)
      if (config.padEmptyLines) {
        content = content.split('\n').map(line => line === '' ? ' ' : line).join('\n')
      }
      fileContentRef.current = content
      validLinesRef.current = buildValidLines(content)
      totalLinesRef.current = content.split('\n').length

      const from = config.startAtFirstLine
        ? (() => {
            const firstLine = validLinesRef.current.find(l => l.n === 1)
            return { lineNumber: 1, column: firstLine ? firstLine.cols[0] : 1 }
          })()
        : (generateFrom(content, []) ?? ZERO)
      const goals =
        config.goalDisplayMode === 'all'
          ? generateInitialGoals(
              content,
              from,
              config.multiGoalCount,
              [],
              config.distanceMode,
              validLinesRef.current
            )
          : (() => {
              const g = generateGoal(content, from, [], config.distanceMode)
              return g ? [g] : []
            })()

      if (!goals.length) return

      configRef.current = config
      gameStatusRef.current = 'playing'
      contentValidRef.current = true
      keystrokesRef.current = 0
      completedRef.current = []
      goalsRef.current = goals
      gameStartRef.current = Date.now()
      pathStartRef.current = Date.now()
      userScoreRef.current = 0
      trailRef.current = []
      enemyScoreRef.current = 0
      challengeScoreRef.current = 0
      challengeCompletionsRef.current = new Map()
      challengeDrillIndexRef.current = 0

      // Pick initial challenge respecting starting level
      const firstChallenge = config.challengeMode
        ? (() => {
            const pool = allCommands.filter(
              c =>
                config.challengeCategories.includes(c.category) &&
                c.level >= (config.challengeStartingLevel ?? 0)
            )
            if (pool.length === 0) return null
            if (config.challengeDrillMode) {
              const first = pool[0]
              challengeDrillIndexRef.current = 1 % pool.length
              return first
            }
            return pool[Math.floor(Math.random() * pool.length)]
          })()
        : null
      activeChallengeRef.current = firstChallenge

      const enemies = buildEnemies(config.enemyCount, content, [], config.enemyMultiColor)
      enemiesRef.current = enemies

      // Start enemy ticks — one interval per enemy with individual speed (for mixed),
      // or one shared interval for all enemies when speed is uniform.
      if (config.enemyCount > 0) {
        if (config.enemySpeed === 'mixed') {
          const speeds = [ENEMY_TICK_MS.slow, ENEMY_TICK_MS.medium, ENEMY_TICK_MS.fast]
          for (let i = 0; i < config.enemyCount; i++) {
            const intervalMs = speeds[Math.floor(Math.random() * speeds.length)]
            const idx = i
            const id = setInterval(() => tickSingleEnemy(idx), intervalMs)
            enemyTickRefs.current.push(id)
          }
        } else {
          const intervalMs = ENEMY_TICK_MS[config.enemySpeed] || ENEMY_TICK_MS.medium
          const id = setInterval(tickAllEnemies, intervalMs)
          enemyTickRefs.current.push(id)
        }
      }

      pendingSetupRef.current = { from, goals }
      isRestoringRef.current = true
      setContentEditorRef.current(content)
      Promise.resolve().then(() => {
        isRestoringRef.current = false
      })
      positionCursorRef.current(from)
      setGoalHighlightsRef.current(goals)
      setTrailDecorationsRef.current([])

      dispatch({ type: 'START', config, from, goals, firstChallenge })
    },
    [tickSingleEnemy, tickAllEnemies]
  )

  return {
    state,
    editorRef,
    statusRef,
    startGame,
    getVisibleRange,
    totalLines: totalLinesRef.current,
  }
}
