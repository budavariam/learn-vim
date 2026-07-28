import { useReducer, useEffect, useRef, useCallback } from 'react'
import { useMonacoEditor } from './useMonacoEditor'
import { getSizedFile } from '../files'
import type { Language, VimCommandData, ChallengeConfig } from '../engine/types'
import {
  buildBorderedContent,
  allBorderCells,
  allInteriorCells,
  borderStartPositions,
  floodFillClaim,
  classifyCell,
  orderedBorderCells,
} from '../engine/QvimxBorderEngine'
import type {
  Pos,
  BoardDimensions,
  QvimxBorderShape,
  QvimxCodeSize,
  CellKind,
} from '../engine/QvimxBorderEngine'
import { normaliseVimKey } from '../engine/vimKeyUtils'
import rawData from '../data.json'

import { MOTION_CHALLENGE_CATEGORIES } from './useMotionRace'
export { MOTION_CHALLENGE_CATEGORIES }

const allCommands = rawData as VimCommandData[]

// ── Types ──────────────────────────────────────────────────────────────────────

export type QvimxAILevel = 'passive' | 'wanderer' | 'hunter' | 'cutter' | 'unstoppable'
export type QvimxBallSpeed = 'slow' | 'medium' | 'fast' | 'mixed'
export type QvimxSubMode = 'classic' | 'championship' | 'ball-escalation' | 'combo'

export type { QvimxBorderShape, QvimxCodeSize, Pos, BoardDimensions }

export interface QvimxConfig extends ChallengeConfig {
  language: Language
  codeSize: QvimxCodeSize
  borderShape: QvimxBorderShape
  subMode: QvimxSubMode
  ballCount: 1 | 2 | 3 | 4 | 5
  ballSpeed: QvimxBallSpeed
  enemyAI: QvimxAILevel
  lives: 1 | 3 | 5
  timerMs: number
  diagonalMode: boolean
  bombCount: 0 | 1 | 2 | 3
}

export interface Ball {
  id: number
  pos: Pos
  dx: 1 | -1
  dy: 1 | -1
  speedMs: number
}

export interface BombPatrol {
  id: number
  borderIdx: number
  direction: 1 | -1
}

export type DrawState = 'on-border' | 'drawing'

export interface QvimxGameState {
  status: 'setup' | 'playing' | 'results'
  config: QvimxConfig
  dims: BoardDimensions | null
  playerPos: Pos
  playerLives: number
  playerDrawState: DrawState
  playerTempLine: Pos[]
  playerClaimed: Pos[]
  playerScore: number
  enemyPos: Pos
  enemyLives: number
  enemyDrawState: DrawState
  enemyTempLine: Pos[]
  enemyClaimed: Pos[]
  enemyScore: number
  balls: Ball[]
  bombPatrols: BombPatrol[]
  totalElapsedMs: number
  level: number
  activeChallenge: VimCommandData | null
  challengeScore: number
  endReason: 'time' | 'lives' | 'level-complete' | null
  // Penalty event — incremented each time the player loses a life; used by UI for toasts
  penaltySeq: number
  penaltySource: string // e.g. "ball", "bomb"
  // Ball-caught event — incremented each time the player traps a ball in claimed territory
  catchSeq: number
  catchCount: number // how many balls were caught in the last claim
}

// ── Intervals ────────────────────────────────────────────────────────────────

const BALL_TICK_MS: Record<QvimxBallSpeed, number> = {
  slow: 800,
  medium: 400,
  fast: 200,
  mixed: 0,
}

const ENEMY_TICK_MS: Record<QvimxAILevel, number> = {
  passive: 1200,
  wanderer: 800,
  hunter: 500,
  cutter: 300,
  unstoppable: 150,
}

// ── Reducer ───────────────────────────────────────────────────────────────────

const ZERO_POS: Pos = { lineNumber: 1, column: 1 }

const BLANK_CONFIG: QvimxConfig = {
  language: 'typescript',
  codeSize: 'medium',
  borderShape: 'full-rect',
  subMode: 'classic',
  ballCount: 2,
  ballSpeed: 'medium',
  enemyAI: 'wanderer',
  lives: 3,
  timerMs: 120_000,
  diagonalMode: false,
  challengeMode: false,
  challengeGuidedMode: 'none',
  challengeStartingLevel: 0,
  challengeRepetition: 1,
  challengeTimeMultiplier: 1,
  challengeCategories: MOTION_CHALLENGE_CATEGORIES,
  challengeDrillMode: false,
  bombCount: 0,
}

const BLANK: QvimxGameState = {
  status: 'setup',
  config: BLANK_CONFIG,
  dims: null,
  playerPos: ZERO_POS,
  playerLives: 3,
  playerDrawState: 'on-border',
  playerTempLine: [],
  playerClaimed: [],
  playerScore: 0,
  enemyPos: ZERO_POS,
  enemyLives: 3,
  enemyDrawState: 'on-border',
  enemyTempLine: [],
  enemyClaimed: [],
  enemyScore: 0,
  balls: [],
  bombPatrols: [],
  totalElapsedMs: 0,
  level: 1,
  activeChallenge: null,
  challengeScore: 0,
  endReason: null,
  penaltySeq: 0,
  penaltySource: '',
  catchSeq: 0,
  catchCount: 0,
}

type QvimxAction =
  | {
      type: 'START'
      config: QvimxConfig
      dims: BoardDimensions
      playerPos: Pos
      enemyPos: Pos
      balls: Ball[]
      bombPatrols: BombPatrol[]
      firstChallenge: VimCommandData | null
    }
  | {
      type: 'CURSOR_MOVED'
      pos: Pos
      playerDrawState: DrawState
      playerTempLine: Pos[]
    }
  | {
      type: 'CLAIM_TERRITORY'
      playerClaimed: Pos[]
      playerScore: number
      playerTempLine: Pos[]
      playerDrawState: DrawState
      playerPos: Pos
    }
  | { type: 'BALL_TICK'; balls: Ball[] }
  | { type: 'BOMB_TICK'; bombPatrols: BombPatrol[] }
  | {
      type: 'ENEMY_TICK'
      enemyPos: Pos
      enemyDrawState: DrawState
      enemyTempLine: Pos[]
      enemyClaimed: Pos[]
      enemyScore: number
    }
  | {
      type: 'LOSE_LIFE'
      who: 'player' | 'enemy'
      playerPos?: Pos
      enemyPos?: Pos
      playerTempLine?: Pos[]
      enemyTempLine?: Pos[]
      penaltySource?: string
    }
  | { type: 'END'; endReason: 'time' | 'lives' | 'level-complete' }
  | { type: 'TICK'; totalMs: number }
  | { type: 'CHALLENGE_DONE'; next: VimCommandData | null; challengeScore: number }
  | { type: 'BALL_CAUGHT'; balls: Ball[]; count: number }

function qvimxReducer(state: QvimxGameState, action: QvimxAction): QvimxGameState {
  switch (action.type) {
    case 'START':
      return {
        ...BLANK,
        status: 'playing',
        config: action.config,
        dims: action.dims,
        playerPos: action.playerPos,
        playerLives: action.config.lives,
        playerDrawState: 'on-border',
        enemyPos: action.enemyPos,
        enemyLives: action.config.lives,
        enemyDrawState: 'on-border',
        balls: action.balls,
        bombPatrols: action.bombPatrols,
        activeChallenge: action.firstChallenge,
        endReason: null,
      }
    case 'CURSOR_MOVED':
      return {
        ...state,
        playerPos: action.pos,
        playerDrawState: action.playerDrawState,
        playerTempLine: action.playerTempLine,
      }
    case 'CLAIM_TERRITORY':
      return {
        ...state,
        playerClaimed: action.playerClaimed,
        playerScore: action.playerScore,
        playerTempLine: action.playerTempLine,
        playerDrawState: action.playerDrawState,
        playerPos: action.playerPos,
      }
    case 'BALL_TICK':
      return { ...state, balls: action.balls }
    case 'BOMB_TICK':
      return { ...state, bombPatrols: action.bombPatrols }
    case 'ENEMY_TICK':
      return {
        ...state,
        enemyPos: action.enemyPos,
        enemyDrawState: action.enemyDrawState,
        enemyTempLine: action.enemyTempLine,
        enemyClaimed: action.enemyClaimed,
        enemyScore: action.enemyScore,
      }
    case 'LOSE_LIFE': {
      const next = { ...state }
      if (action.who === 'player') {
        next.playerLives = state.playerLives - 1
        if (action.playerPos) next.playerPos = action.playerPos
        next.playerTempLine = action.playerTempLine ?? []
        next.playerDrawState = 'on-border'
        next.penaltySeq = state.penaltySeq + 1
        next.penaltySource = action.penaltySource ?? 'unknown'
      } else {
        next.enemyLives = state.enemyLives - 1
        if (action.enemyPos) next.enemyPos = action.enemyPos
        next.enemyTempLine = action.enemyTempLine ?? []
        next.enemyDrawState = 'on-border'
      }
      return next
    }
    case 'END':
      return { ...state, status: 'results', endReason: action.endReason }
    case 'TICK':
      return { ...state, totalElapsedMs: action.totalMs }
    case 'CHALLENGE_DONE':
      return { ...state, activeChallenge: action.next, challengeScore: action.challengeScore }
    case 'BALL_CAUGHT':
      return {
        ...state,
        balls: action.balls,
        catchSeq: state.catchSeq + 1,
        catchCount: action.count,
      }
    default:
      return state
  }
}

// ── Pos helpers ───────────────────────────────────────────────────────────────

function posEq(a: Pos, b: Pos): boolean {
  return a.lineNumber === b.lineNumber && a.column === b.column
}

function posInArray(p: Pos, arr: Pos[]): boolean {
  return arr.some(x => posEq(x, p))
}

// ── Ball helpers ──────────────────────────────────────────────────────────────

function buildBalls(count: number, speed: QvimxBallSpeed, dims: BoardDimensions): Ball[] {
  const speeds = [BALL_TICK_MS.slow, BALL_TICK_MS.medium, BALL_TICK_MS.fast]
  const innerMinLine = dims.minLine + 1
  const innerMaxLine = dims.maxLine - 1
  const innerMinCol = dims.minCol + 1
  const innerMaxCol = dims.maxCol - 1
  const centerLine = Math.floor((innerMinLine + innerMaxLine) / 2)
  const centerCol = Math.floor((innerMinCol + innerMaxCol) / 2)
  const balls: Ball[] = []
  for (let i = 0; i < count; i++) {
    const offset = Math.floor(i / 2) + 1
    const ln = Math.max(
      innerMinLine,
      Math.min(innerMaxLine, centerLine + (i % 2 === 0 ? offset : -offset))
    )
    const col = Math.max(
      innerMinCol,
      Math.min(innerMaxCol, centerCol + (i % 3 === 0 ? offset : -offset))
    )
    const dx: 1 | -1 = i % 2 === 0 ? 1 : -1
    const dy: 1 | -1 = i % 3 === 0 ? 1 : -1
    const speedMs = speed === 'mixed' ? speeds[i % 3] : BALL_TICK_MS[speed]
    balls.push({ id: i, pos: { lineNumber: ln, column: col }, dx, dy, speedMs })
  }
  return balls
}

// claimedSet = union of all player + enemy claimed cells, passed in from the hook
function moveBall(ball: Ball, dims: BoardDimensions, claimedSet: Set<string>): Ball {
  const { lineNumber: ln, column: col } = ball.pos
  const { dx, dy } = ball
  const innerMin = dims.minLine + 1
  const innerMax = dims.maxLine - 1
  const innerMinC = dims.minCol + 1
  const innerMaxC = dims.maxCol - 1

  function blocked(l: number, c: number): boolean {
    if (l < innerMin || l > innerMax || c < innerMinC || c > innerMaxC) return true
    return claimedSet.has(`${l},${c}`)
  }

  const nextLn = ln + dy
  const nextCol = col + dx

  if (!blocked(nextLn, nextCol)) {
    return { ...ball, pos: { lineNumber: nextLn, column: nextCol } }
  }

  // Full move blocked — try each axis independently to determine reflection
  const canY = !blocked(nextLn, col) // can move in line direction only
  const canX = !blocked(ln, nextCol) // can move in col direction only

  if (canY && !canX) {
    // Column axis blocked: reflect dx, move in line only
    return { ...ball, pos: { lineNumber: nextLn, column: col }, dx: -dx as 1 | -1 }
  }
  if (canX && !canY) {
    // Line axis blocked: reflect dy, move in col only
    return { ...ball, pos: { lineNumber: ln, column: nextCol }, dy: -dy as 1 | -1 }
  }
  // Corner or fully blocked: reflect both, stay in place this tick
  return { ...ball, dx: -dx as 1 | -1, dy: -dy as 1 | -1 }
}

// ── Bomb helpers ──────────────────────────────────────────────────────────────

function buildBombs(count: number, orderedBorder: Pos[]): BombPatrol[] {
  if (count === 0 || orderedBorder.length === 0) return []
  const bombs: BombPatrol[] = []
  const spread = Math.floor(orderedBorder.length / Math.max(count, 1))
  for (let i = 0; i < count; i++) {
    bombs.push({ id: i, borderIdx: i * spread, direction: i % 2 === 0 ? 1 : -1 })
  }
  return bombs
}

// ── Enemy AI helpers ──────────────────────────────────────────────────────────

function pickEnemyStep(
  enemyPos: Pos,
  _enemyDrawState: DrawState,
  playerPos: Pos,
  playerTempLine: Pos[],
  playerClaimed: Pos[],
  dims: BoardDimensions,
  borderCells: Pos[],
  enemyClaimed: Pos[],
  ai: QvimxAILevel
): Pos {
  const { minLine, maxLine, minCol, maxCol } = dims

  // Clamp helper
  function clamp(p: Pos): Pos {
    return {
      lineNumber: Math.max(minLine, Math.min(maxLine, p.lineNumber)),
      column: Math.max(minCol, Math.min(maxCol, p.column)),
    }
  }

  function onBorder(p: Pos): boolean {
    return posInArray(p, borderCells)
  }

  // For simple AI: walk clockwise along border
  function nextBorderStep(cur: Pos): Pos {
    // find current border cell index and advance
    const idx = borderCells.findIndex(b => posEq(b, cur))
    if (idx === -1) {
      // snap to nearest border cell
      return borderCells[0] ?? cur
    }
    return borderCells[(idx + 1) % borderCells.length]
  }

  switch (ai) {
    case 'passive': {
      if (Math.random() < 0.8) {
        return onBorder(enemyPos) ? nextBorderStep(enemyPos) : (borderCells[0] ?? enemyPos)
      }
      // Venture a couple cells inward randomly then return
      const dl = Math.random() > 0.5 ? 1 : -1
      return clamp({ lineNumber: enemyPos.lineNumber + dl, column: enemyPos.column })
    }

    case 'wanderer': {
      // Wander along border most of the time
      if (Math.random() < 0.7) {
        return nextBorderStep(enemyPos)
      }
      const dc = Math.random() > 0.5 ? 1 : -1
      return clamp({ lineNumber: enemyPos.lineNumber, column: enemyPos.column + dc })
    }

    case 'hunter': {
      // Move toward cells adjacent to playerClaimed
      if (playerClaimed.length === 0) return nextBorderStep(enemyPos)
      const target = playerClaimed[Math.floor(Math.random() * playerClaimed.length)]
      const dl = Math.sign(target.lineNumber - enemyPos.lineNumber)
      const dc = Math.sign(target.column - enemyPos.column)
      if (
        Math.abs(target.lineNumber - enemyPos.lineNumber) >=
        Math.abs(target.column - enemyPos.column)
      ) {
        return clamp({ lineNumber: enemyPos.lineNumber + (dl || 1), column: enemyPos.column })
      }
      return clamp({ lineNumber: enemyPos.lineNumber, column: enemyPos.column + (dc || 1) })
    }

    case 'cutter':
    case 'unstoppable': {
      // Try to intercept player's tempLine
      if (playerTempLine.length > 0) {
        const target = playerTempLine[Math.floor(playerTempLine.length / 2)]
        const dl = Math.sign(target.lineNumber - enemyPos.lineNumber)
        const dc = Math.sign(target.column - enemyPos.column)
        if (dl !== 0)
          return clamp({ lineNumber: enemyPos.lineNumber + dl, column: enemyPos.column })
        if (dc !== 0)
          return clamp({ lineNumber: enemyPos.lineNumber, column: enemyPos.column + dc })
      }
      // Fall back to hunting
      if (playerClaimed.length > 0) {
        const target = playerClaimed[Math.floor(Math.random() * playerClaimed.length)]
        const dl = Math.sign(target.lineNumber - enemyPos.lineNumber)
        const dc = Math.sign(target.column - enemyPos.column)
        if (dl !== 0)
          return clamp({ lineNumber: enemyPos.lineNumber + dl, column: enemyPos.column })
        if (dc !== 0)
          return clamp({ lineNumber: enemyPos.lineNumber, column: enemyPos.column + dc })
      }
      return nextBorderStep(enemyPos)
    }

    default:
      return nextBorderStep(enemyPos)
  }

  // Suppress unreachable-code TS lint for the `void` return path above
  void playerPos
  void enemyClaimed
}

// ── Decoration helper ─────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DecEntry = { range: any; options: any }

function makeDecoration(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  monaco: any,
  ln: number,
  col: number,
  className: string
): DecEntry {
  return {
    range: new monaco.Range(ln, col, ln, col + 1),
    options: {
      inlineClassName: className,
      description: 'qvimx',
    },
  }
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export interface UseQvimxReturn {
  state: QvimxGameState
  editorRef: React.RefObject<HTMLDivElement | null>
  statusRef: React.RefObject<HTMLDivElement | null>
  startGame: (config: QvimxConfig) => void
  getVisibleRange: () => { startLine: number; endLine: number } | null
}

export function useQvimx(): UseQvimxReturn {
  const [state, dispatch] = useReducer(qvimxReducer, BLANK)

  // Stable mutable refs
  const configRef = useRef<QvimxConfig | null>(null)
  const fileContentRef = useRef('')
  const dimsRef = useRef<BoardDimensions | null>(null)
  const borderCellsRef = useRef<Pos[]>([])
  const interiorCellsRef = useRef<Pos[]>([])
  // Fast-lookup Sets kept in sync with their array counterparts
  const interiorCellsSetRef = useRef<Set<string>>(new Set())
  const classifyCellRef = useRef<((p: Pos) => CellKind) | null>(null)
  const gameStartRef = useRef(0)
  const gameStatusRef = useRef<'idle' | 'playing' | 'results'>('idle')

  // Player state refs
  const playerPosRef = useRef<Pos>(ZERO_POS)
  const playerDrawStateRef = useRef<DrawState>('on-border')
  const playerTempLineRef = useRef<Pos[]>([])
  const playerClaimedRef = useRef<Pos[]>([])
  const playerClaimedSetRef = useRef<Set<string>>(new Set())
  // Player temp-line set for O(1) ball collision checks
  const playerTempLineSetRef = useRef<Set<string>>(new Set())

  // Enemy state refs
  const enemyPosRef = useRef<Pos>(ZERO_POS)
  const enemyDrawStateRef = useRef<DrawState>('on-border')
  const enemyTempLineRef = useRef<Pos[]>([])
  const enemyClaimedRef = useRef<Pos[]>([])
  const enemyClaimedSetRef = useRef<Set<string>>(new Set())
  // Enemy temp-line set for O(1) ball collision checks
  const enemyTempLineSetRef = useRef<Set<string>>(new Set())
  const enemyScoreRef = useRef(0)

  // Neutral cells — permanent walls pre-set at game start.
  // inverse-code: code-char interior cells are neutral (play area = whitespace).
  // code-right: whitespace interior cells are neutral (play area = code chars).
  // full-rect / sub-rect: empty.
  const neutralCellsRef = useRef<Pos[]>([])
  const neutralClaimedSetRef = useRef<Set<string>>(new Set())

  // Ball refs
  const ballsRef = useRef<Ball[]>([])

  // Bomb refs
  const orderedBorderRef = useRef<Pos[]>([])
  const bombPatrolsRef = useRef<BombPatrol[]>([])
  const bombTickRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const playerBorderEntryRef = useRef<Pos | null>(null)
  const enemyBorderEntryRef = useRef<Pos | null>(null)
  // Forward ref to loseLife so tickBombs can call it without declaration-order dependency
  const loseLifeRef = useRef<(who: 'player' | 'enemy', source?: string) => void>(() => {})

  // Challenge refs
  const activeChallengeRef = useRef<VimCommandData | null>(null)
  const challengeScoreRef = useRef(0)
  const challengeCompletionsRef = useRef<Map<string, number>>(new Map())
  const challengeDrillIndexRef = useRef(0)

  // Interval refs
  const ballTickRefsMap = useRef<Map<number, ReturnType<typeof setInterval>>>(new Map())
  const enemyTickRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timerTickRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Monaco forward refs — filled synchronously via onEditorCreated
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const monacoRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const qvimxDecColRef = useRef<any>(null)
  const setContentRef = useRef<(c: string) => void>(() => {})
  const positionCursorRef = useRef<(p: Pos) => void>(() => {})
  const focusEditorRef = useRef<() => void>(() => {})
  const getVisibleRangeRef = useRef<() => { startLine: number; endLine: number } | null>(() => null)
  // Stores the start params if startGame runs before Monaco is ready
  const pendingStartRef = useRef<{ content: string; playerStart: Pos } | null>(null)

  // Cleanup all intervals
  function clearAllIntervals() {
    ballTickRefsMap.current.forEach(id => clearInterval(id))
    ballTickRefsMap.current.clear()
    if (enemyTickRef.current) {
      clearInterval(enemyTickRef.current)
      enemyTickRef.current = null
    }
    if (timerTickRef.current) {
      clearInterval(timerTickRef.current)
      timerTickRef.current = null
    }
    if (bombTickRef.current) {
      clearInterval(bombTickRef.current)
      bombTickRef.current = null
    }
  }

  useEffect(() => () => clearAllIntervals(), [])

  // ── Decoration sync ───────────────────────────────────────────────────────

  const syncDecorations = useCallback(() => {
    const col = qvimxDecColRef.current
    const monaco = monacoRef.current
    if (!col || !monaco) return

    const decs: DecEntry[] = []

    // Border cells
    for (const p of borderCellsRef.current) {
      decs.push(makeDecoration(monaco, p.lineNumber, p.column, 'qvimx-border'))
    }

    // Neutral cells — permanent walls (inverse-code code chars / code-right whitespace)
    for (const p of neutralCellsRef.current) {
      decs.push(makeDecoration(monaco, p.lineNumber, p.column, 'qvimx-neutral'))
    }

    // Build lookup sets for fast adjacency checks
    const playerSet = new Set<string>(
      playerClaimedRef.current.map(p => `${p.lineNumber},${p.column}`)
    )
    const enemySet = new Set<string>(
      enemyClaimedRef.current.map(p => `${p.lineNumber},${p.column}`)
    )

    function isEdge(p: Pos, ownerSet: Set<string>): boolean {
      const nbrs: [number, number][] = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]
      return nbrs.some(([dl, dc]) => !ownerSet.has(`${p.lineNumber + dl},${p.column + dc}`))
    }

    // Player claimed — edge cells get a brighter outline border
    for (const p of playerClaimedRef.current) {
      const cls = isEdge(p, playerSet) ? 'qvimx-player-edge' : 'qvimx-player-claimed'
      decs.push(makeDecoration(monaco, p.lineNumber, p.column, cls))
    }

    // Enemy claimed
    for (const p of enemyClaimedRef.current) {
      const cls = isEdge(p, enemySet) ? 'qvimx-enemy-edge' : 'qvimx-enemy-claimed'
      decs.push(makeDecoration(monaco, p.lineNumber, p.column, cls))
    }

    // Player tempLine
    for (const p of playerTempLineRef.current) {
      decs.push(makeDecoration(monaco, p.lineNumber, p.column, 'qvimx-temp-line'))
    }

    // Enemy tempLine
    for (const p of enemyTempLineRef.current) {
      decs.push(makeDecoration(monaco, p.lineNumber, p.column, 'qvimx-enemy-temp-line'))
    }

    // Balls
    for (const ball of ballsRef.current) {
      decs.push(makeDecoration(monaco, ball.pos.lineNumber, ball.pos.column, 'qvimx-ball-char'))
    }

    // Enemy cursor
    decs.push(
      makeDecoration(
        monaco,
        enemyPosRef.current.lineNumber,
        enemyPosRef.current.column,
        'qvimx-enemy-cursor'
      )
    )

    // Bombs (border patrol)
    for (const bomb of bombPatrolsRef.current) {
      const pos = orderedBorderRef.current[bomb.borderIdx]
      if (pos) decs.push(makeDecoration(monaco, pos.lineNumber, pos.column, 'qvimx-bomb-char'))
    }

    col.set(decs)
  }, [])

  // Keep Set refs in sync with their array counterparts for O(1) lookups
  function syncSet(arr: Pos[], setRef: React.MutableRefObject<Set<string>>) {
    setRef.current = new Set(arr.map(p => `${p.lineNumber},${p.column}`))
  }

  // ── Score computation — interior cells only ──────────────────────────────
  // claimed[] may include border cells and temp-line cells; cap at 100 %
  // and count only cells that are in the interior set.

  function computeScore(claimed: Pos[]): number {
    const total = interiorCellsRef.current.length
    if (total === 0) return 0
    const iSet = interiorCellsSetRef.current
    const n = claimed.filter(p => iSet.has(`${p.lineNumber},${p.column}`)).length
    return Math.min(100, Math.round((n / total) * 100))
  }

  // ── Claim territory ───────────────────────────────────────────────────────

  const claimTerritory = useCallback(
    (who: 'player' | 'enemy', entryCell: Pos | null, exitCell: Pos | null) => {
      const dims = dimsRef.current
      if (!dims) return

      const tempLine = who === 'player' ? playerTempLineRef.current : enemyTempLineRef.current
      const alreadyClaimed = who === 'player' ? playerClaimedRef.current : enemyClaimedRef.current
      const interior = interiorCellsRef.current
      const totalInterior = interior.length

      // Use fast-lookup Sets — avoid re-building from arrays on every claim
      const pSet = playerClaimedSetRef.current
      const eSet = enemyClaimedSetRef.current
      const freeCells = interior.filter(p => {
        const k = `${p.lineNumber},${p.column}`
        return !pSet.has(k) && !eSet.has(k)
      })

      const beforeCount = alreadyClaimed.length

      let newInteriorCells = floodFillClaim(
        freeCells,
        tempLine,
        entryCell ?? borderCellsRef.current[0] ?? { lineNumber: dims.minLine, column: dims.minCol },
        exitCell ?? borderCellsRef.current[1] ?? { lineNumber: dims.minLine, column: dims.maxCol },
        orderedBorderRef.current
      )

      // Sanity check: if the claim is ≥ 90% of available unclaimed cells,
      // something likely went wrong. Try the complementary region instead.
      if (freeCells.length > 20 && newInteriorCells.length >= freeCells.length * 0.9) {
        const claimedSet = new Set<string>(newInteriorCells.map(p => `${p.lineNumber},${p.column}`))
        const tempSet = new Set<string>(tempLine.map(p => `${p.lineNumber},${p.column}`))
        const altCells = freeCells.filter(p => {
          const k = `${p.lineNumber},${p.column}`
          return !claimedSet.has(k) && !tempSet.has(k)
        })
        console.warn(
          `[qvimx] ${who} claim sanity: ${newInteriorCells.length}/${freeCells.length} free cells — trying complement (${altCells.length} cells)`
        )
        if (altCells.length < newInteriorCells.length) {
          newInteriorCells = altCells
        }
      }

      // Also claim adjacent board-border cells (board border cells that touch
      // the newly claimed interior region become part of the player's territory,
      // so the player can draw from them in future without re-entering the border)
      const newCellsSet = new Set<string>(newInteriorCells.map(p => `${p.lineNumber},${p.column}`))
      const opponentSet = who === 'player' ? eSet : pSet
      const adjacentBorderCells = borderCellsRef.current.filter(bp => {
        const bk = `${bp.lineNumber},${bp.column}`
        if (pSet.has(bk) || eSet.has(bk)) return false
        return (
          newCellsSet.has(`${bp.lineNumber - 1},${bp.column}`) ||
          newCellsSet.has(`${bp.lineNumber + 1},${bp.column}`) ||
          newCellsSet.has(`${bp.lineNumber},${bp.column - 1}`) ||
          newCellsSet.has(`${bp.lineNumber},${bp.column + 1}`)
        )
      })

      // Always include the temp-line cells in the claim — even when no area
      // is enclosed, the drawn path becomes owned territory (new safe boundary).
      // Exclude cells already claimed by the player or the opponent (fix #2).
      const alreadySet = new Set<string>(alreadyClaimed.map(p => `${p.lineNumber},${p.column}`))
      const tempLineOwned = tempLine.filter(p => {
        const k = `${p.lineNumber},${p.column}`
        return !alreadySet.has(k) && !opponentSet.has(k)
      })

      const merged = [
        ...alreadyClaimed,
        ...newInteriorCells,
        ...adjacentBorderCells,
        ...tempLineOwned,
      ]

      console.log(
        `[qvimx] ${who} claim: ${newInteriorCells.length} interior + ${adjacentBorderCells.length} border cells` +
          ` | before=${beforeCount} after=${merged.length}` +
          ` | total interior=${totalInterior} unclaimed=${freeCells.length}` +
          ` | tempLine=${tempLine.length}`
      )

      if (who === 'player') {
        playerClaimedRef.current = merged
        syncSet(merged, playerClaimedSetRef)
        playerTempLineRef.current = []
        playerDrawStateRef.current = 'on-border'
        const score = computeScore(merged)
        // safeStart is only used for the React state display; game-logic refs
        // keep playerPosRef.current at the actual Monaco cursor position (the
        // exit border cell set in handleCursorChange before this call).
        const startPositions = borderStartPositions(dims)
        const safeStart =
          startPositions.find(
            p => !enemyClaimedSetRef.current.has(`${p.lineNumber},${p.column}`)
          ) ??
          startPositions[0] ??
          playerPosRef.current
        dispatch({
          type: 'CLAIM_TERRITORY',
          playerClaimed: merged,
          playerScore: score,
          playerTempLine: [],
          playerDrawState: 'on-border',
          playerPos: safeStart,
        })
        // DO NOT update playerPosRef.current here — it was already set to the
        // real exit border cell by handleCursorChange before calling claimTerritory.
        // Overwriting it with safeStart (a predefined position) would cause the
        // next drawing session to record safeStart as the border entry point
        // even though the Monaco cursor is physically at the exit cell.
      } else {
        enemyClaimedRef.current = merged
        syncSet(merged, enemyClaimedSetRef)
        enemyTempLineRef.current = []
        enemyDrawStateRef.current = 'on-border'
        enemyScoreRef.current = computeScore(merged)
      }
      // Eject any ball that ended up inside newly claimed territory so it doesn't
      // freeze on subsequent ticks (moveBall would block it every time).
      const combinedSet = new Set([
        ...playerClaimedSetRef.current,
        ...enemyClaimedSetRef.current,
        ...neutralClaimedSetRef.current,
      ])
      const ejectedBalls = ballsRef.current.map(ball => {
        if (!combinedSet.has(`${ball.pos.lineNumber},${ball.pos.column}`)) return ball
        const nearest = interiorCellsRef.current.find(
          p => !combinedSet.has(`${p.lineNumber},${p.column}`)
        )
        return nearest ? { ...ball, pos: nearest } : ball
      })
      const caughtCount = ejectedBalls.filter((b, i) => b !== ballsRef.current[i]).length
      if (caughtCount > 0) {
        console.log(`[qvimx] ${who} caught ${caughtCount} ball(s) in claimed territory`)
        ballsRef.current = ejectedBalls
        dispatch({ type: 'BALL_CAUGHT', balls: ejectedBalls, count: caughtCount })
      }

      syncDecorations()
    },
    [syncDecorations]
  )

  const handleCursorChange = useCallback(
    (pos: Pos) => {
      if (gameStatusRef.current !== 'playing') return

      const dims = dimsRef.current
      if (!dims) return

      const classify = classifyCellRef.current
      if (!classify) return

      const kind: CellKind = classify(pos)
      const prevState = playerDrawStateRef.current
      const prevTempLine = playerTempLineRef.current

      let newDrawState = prevState
      let newTempLine = [...prevTempLine]

      if (prevState === 'on-border') {
        if (kind === 'interior') {
          // Entering interior — record border entry and start temp-line.
          // If f/search/G jumped several cells past the border, interpolate
          // the path from the border cell into the interior so no cells are missed.
          const borderEntry = playerPosRef.current
          playerBorderEntryRef.current = borderEntry
          newDrawState = 'drawing'

          const classify = classifyCellRef.current!
          const dl = pos.lineNumber - borderEntry.lineNumber
          const dc = pos.column - borderEntry.column
          const isAdjacent = Math.abs(dl) + Math.abs(dc) <= 1

          if (isAdjacent) {
            newTempLine = [pos]
          } else {
            // Interpolate from borderEntry toward pos, skipping the border
            // cell itself and any other border cells along the path.
            const interpCells: Pos[] = []
            const useDiag = configRef.current?.diagonalMode ?? false
            let ln = borderEntry.lineNumber
            let col = borderEntry.column
            const dlSign = Math.sign(dl)
            const dcSign = Math.sign(dc)

            if (useDiag) {
              while (ln !== pos.lineNumber || col !== pos.column) {
                if (ln !== pos.lineNumber) ln += dlSign
                if (col !== pos.column) col += dcSign
                if (ln === pos.lineNumber && col === pos.column) break
                const p2 = { lineNumber: ln, column: col }
                if (classify(p2) === 'interior') interpCells.push(p2)
              }
            } else {
              while (ln !== pos.lineNumber) {
                ln += dlSign
                if (ln === pos.lineNumber && dcSign === 0) break
                const p2 = { lineNumber: ln, column: col }
                if (classify(p2) === 'interior') interpCells.push(p2)
              }
              while (col !== pos.column) {
                col += dcSign
                if (col === pos.column) break
                const p2 = { lineNumber: ln, column: col }
                if (classify(p2) === 'interior') interpCells.push(p2)
              }
            }
            newTempLine = [...interpCells, pos]
          }
        }
      } else if (prevState === 'drawing') {
        if (
          kind === 'border' ||
          playerClaimedSetRef.current.has(`${pos.lineNumber},${pos.column}`)
        ) {
          // Reached border or claimed — interpolate any jump gap, then claim.
          const lastCell = prevTempLine[prevTempLine.length - 1]
          let fullTempLine = prevTempLine
          if (lastCell) {
            const dl = pos.lineNumber - lastCell.lineNumber
            const dc = pos.column - lastCell.column
            const notAdjacent = Math.abs(dl) + Math.abs(dc) > 1
            if (notAdjacent) {
              // Fill interior cells between the last drawn point and the exit cell.
              // The exit cell itself is a border/claimed cell — don't add it.
              const classify = classifyCellRef.current!
              const useDiag = configRef.current?.diagonalMode ?? false
              const interpCells: Pos[] = []
              let ln = lastCell.lineNumber
              let col = lastCell.column
              const dlSign = Math.sign(dl)
              const dcSign = Math.sign(dc)
              if (useDiag) {
                while (ln !== pos.lineNumber || col !== pos.column) {
                  if (ln !== pos.lineNumber) ln += dlSign
                  if (col !== pos.column) col += dcSign
                  if (ln === pos.lineNumber && col === pos.column) break
                  if (classify({ lineNumber: ln, column: col }) === 'interior')
                    interpCells.push({ lineNumber: ln, column: col })
                }
              } else {
                while (ln !== pos.lineNumber) {
                  ln += dlSign
                  if (ln === pos.lineNumber && dcSign === 0) break
                  if (classify({ lineNumber: ln, column: col }) === 'interior')
                    interpCells.push({ lineNumber: ln, column: col })
                }
                while (col !== pos.column) {
                  col += dcSign
                  if (col === pos.column) break
                  if (classify({ lineNumber: ln, column: col }) === 'interior')
                    interpCells.push({ lineNumber: ln, column: col })
                }
              }
              fullTempLine = [...prevTempLine, ...interpCells]
            }
          }
          const entryCell = playerBorderEntryRef.current
          const exitCell = pos
          playerBorderEntryRef.current = null
          playerPosRef.current = pos
          playerDrawStateRef.current = 'on-border'
          playerTempLineRef.current = fullTempLine
          syncSet(fullTempLine, playerTempLineSetRef)
          claimTerritory('player', entryCell, exitCell)
          return // CLAIM_TERRITORY dispatch handles state
        } else if (kind === 'interior') {
          // Interpolate intermediate cells for multi-step vim jumps.
          // Priority: retreat check first (even for non-adjacent jumps).
          const lastCell = newTempLine[newTempLine.length - 1]
          if (lastCell) {
            // Check retreat regardless of adjacency — a backward jump to an
            // already-visited cell (e.g. Td) must truncate, not extend.
            const retreatIdx = prevTempLine.findIndex(t => posEq(t, pos))
            if (retreatIdx !== -1) {
              newTempLine = prevTempLine.slice(0, retreatIdx + 1)
            } else {
              const isAdjacent =
                Math.abs(pos.lineNumber - lastCell.lineNumber) +
                  Math.abs(pos.column - lastCell.column) <=
                1
              if (isAdjacent) {
                newTempLine = [...prevTempLine, pos]
              } else {
                // Fill in cells along the path from lastCell to pos.
                // diagonalMode=true: step line+column simultaneously (Bresenham-like).
                // diagonalMode=false (default): L-shape — line-first then column.
                const classify = classifyCellRef.current!
                const config = configRef.current
                const interpCells: Pos[] = []
                let claimedMid = false

                const useDiag = config?.diagonalMode ?? false
                let ln = lastCell.lineNumber
                let col = lastCell.column
                const dlSign = Math.sign(pos.lineNumber - ln)
                const dcSign = Math.sign(pos.column - col)

                outer: {
                  if (useDiag) {
                    // True diagonal: step both axes simultaneously until both reach target
                    while (ln !== pos.lineNumber || col !== pos.column) {
                      if (ln !== pos.lineNumber) ln += dlSign
                      if (col !== pos.column) col += dcSign
                      if (ln === pos.lineNumber && col === pos.column) break // final = pos, appended below
                      const p2 = { lineNumber: ln, column: col }
                      const revIdx = prevTempLine.findIndex(t => posEq(t, p2))
                      if (revIdx !== -1) {
                        newTempLine = prevTempLine.slice(0, revIdx + 1)
                        claimedMid = true
                        break outer
                      }
                      const k2 = classify(p2)
                      if (
                        k2 === 'border' ||
                        playerClaimedSetRef.current.has(`${p2.lineNumber},${p2.column}`)
                      ) {
                        const entryCell = playerBorderEntryRef.current
                        playerBorderEntryRef.current = null
                        playerPosRef.current = p2
                        playerDrawStateRef.current = 'on-border'
                        playerTempLineRef.current = [...newTempLine, ...interpCells]
                        claimTerritory('player', entryCell, p2)
                        return
                      }
                      interpCells.push(p2)
                    }
                  } else {
                    // L-shape: line-first then column
                    while (ln !== pos.lineNumber) {
                      ln += dlSign
                      const p2 = { lineNumber: ln, column: col }
                      if (ln === pos.lineNumber && dcSign === 0) break
                      const revIdx = prevTempLine.findIndex(t => posEq(t, p2))
                      if (revIdx !== -1) {
                        newTempLine = prevTempLine.slice(0, revIdx + 1)
                        claimedMid = true
                        break outer
                      }
                      const k2 = classify(p2)
                      if (
                        k2 === 'border' ||
                        playerClaimedSetRef.current.has(`${p2.lineNumber},${p2.column}`)
                      ) {
                        const entryCell = playerBorderEntryRef.current
                        playerBorderEntryRef.current = null
                        playerPosRef.current = p2
                        playerDrawStateRef.current = 'on-border'
                        playerTempLineRef.current = [...newTempLine, ...interpCells]
                        claimTerritory('player', entryCell, p2)
                        return
                      }
                      interpCells.push(p2)
                    }
                    while (col !== pos.column) {
                      col += dcSign
                      if (col === pos.column) break
                      const p2 = { lineNumber: ln, column: col }
                      const revIdx = prevTempLine.findIndex(t => posEq(t, p2))
                      if (revIdx !== -1) {
                        newTempLine = prevTempLine.slice(0, revIdx + 1)
                        claimedMid = true
                        break outer
                      }
                      const k2 = classify(p2)
                      if (
                        k2 === 'border' ||
                        playerClaimedSetRef.current.has(`${p2.lineNumber},${p2.column}`)
                      ) {
                        const entryCell = playerBorderEntryRef.current
                        playerBorderEntryRef.current = null
                        playerPosRef.current = p2
                        playerDrawStateRef.current = 'on-border'
                        playerTempLineRef.current = [...newTempLine, ...interpCells]
                        claimTerritory('player', entryCell, p2)
                        return
                      }
                      interpCells.push(p2)
                    }
                  }
                }
                if (!claimedMid) newTempLine = [...newTempLine, ...interpCells, pos]
              }
            }
          } else {
            newTempLine = [pos]
          }
        }
      } else if (prevState === 'on-border') {
        // already handled above — no-op here keeps exhaustive matching tidy
      }

      playerPosRef.current = pos
      playerDrawStateRef.current = newDrawState
      playerTempLineRef.current = newTempLine
      syncSet(newTempLine, playerTempLineSetRef)

      dispatch({
        type: 'CURSOR_MOVED',
        pos,
        playerDrawState: newDrawState,
        playerTempLine: newTempLine,
      })

      syncDecorations()
    },
    [claimTerritory, syncDecorations]
  )

  // ── Ball tick ─────────────────────────────────────────────────────────────

  const tickBall = useCallback(
    (ballId: number) => {
      if (gameStatusRef.current !== 'playing') return
      const dims = dimsRef.current
      if (!dims) return

      const balls = ballsRef.current
      const idx = balls.findIndex(b => b.id === ballId)
      if (idx === -1) return

      const updated = [...balls]
      // Build combined claimed set so balls bounce off player+enemy territory
      const claimedSet = new Set<string>([
        ...playerClaimedSetRef.current,
        ...enemyClaimedSetRef.current,
        ...neutralClaimedSetRef.current,
      ])
      const moved = moveBall(updated[idx], dims, claimedSet)
      updated[idx] = moved
      ballsRef.current = updated

      // Check collisions — use Set lookups instead of linear array scan
      const bk = `${moved.pos.lineNumber},${moved.pos.column}`
      const hitPlayerTemp = playerTempLineSetRef.current.has(bk)
      const hitEnemyTemp = enemyTempLineSetRef.current.has(bk)

      if (hitPlayerTemp) {
        console.log(
          `[qvimx] ball ${ballId} hit player temp-line at (${moved.pos.lineNumber},${moved.pos.column}), tempLine.length=${playerTempLineRef.current.length}`
        )
        loseLife('player', 'ball')
      } else if (hitEnemyTemp) {
        loseLife('enemy', 'ball')
      } else {
        dispatch({ type: 'BALL_TICK', balls: updated })
        syncDecorations()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [syncDecorations]
  )

  // Keep loseLife callback stable but with fresh lives count via ref
  const playerLivesRef = useRef(3)
  useEffect(() => {
    playerLivesRef.current = state.playerLives
  }, [state.playerLives])

  // ── Bomb tick ─────────────────────────────────────────────────────────────

  const tickBombs = useCallback(() => {
    if (gameStatusRef.current !== 'playing') return
    const ordered = orderedBorderRef.current
    if (!ordered.length) return

    const updated = bombPatrolsRef.current.map(bomb => {
      const nextIdx = (bomb.borderIdx + bomb.direction + ordered.length) % ordered.length
      return { ...bomb, borderIdx: nextIdx }
    })
    bombPatrolsRef.current = updated

    // Collision: bomb at player's position or player's stix foot
    const playerPos = playerPosRef.current
    const stixFoot = playerBorderEntryRef.current

    for (const bomb of updated) {
      const bombPos = ordered[bomb.borderIdx]
      if (!bombPos) continue
      const hitPlayer = posEq(bombPos, playerPos)
      const hitStix = stixFoot !== null && posEq(bombPos, stixFoot)
      if (hitPlayer || hitStix) {
        const reason = hitStix ? 'bomb-stix' : 'bomb'
        console.log(
          `[qvimx] bomb hit player at (${bombPos.lineNumber},${bombPos.column}), reason=${reason}`
        )
        loseLifeRef.current('player', reason)
        return
      }
    }

    dispatch({ type: 'BOMB_TICK', bombPatrols: updated })
    syncDecorations()
  }, [syncDecorations])

  // ── Lose life ─────────────────────────────────────────────────────────────

  const loseLife = useCallback(
    (who: 'player' | 'enemy', source = 'unknown') => {
      const dims = dimsRef.current
      if (!dims) return
      const starts = borderStartPositions(dims)

      if (who === 'player') {
        // Respawn at a border position not occupied by enemy territory
        const newPos =
          starts.find(p => !enemyClaimedSetRef.current.has(`${p.lineNumber},${p.column}`)) ??
          starts[2] ??
          starts[0] ??
          ZERO_POS
        playerPosRef.current = newPos
        playerTempLineRef.current = []
        playerTempLineSetRef.current = new Set()
        playerDrawStateRef.current = 'on-border'
        playerBorderEntryRef.current = null

        const newLives = playerLivesRef.current - 1
        playerLivesRef.current = newLives // update immediately to prevent stale read before next render
        console.log(`[qvimx] player lost life (source=${source}), lives remaining=${newLives}`)
        dispatch({
          type: 'LOSE_LIFE',
          who: 'player',
          playerPos: newPos,
          playerTempLine: [],
          penaltySource: source,
        })
        positionCursorRef.current(newPos)

        if (newLives <= 0) {
          gameStatusRef.current = 'results'
          clearAllIntervals()
          dispatch({ type: 'END', endReason: 'lives' })
        }
      } else {
        const newPos = starts[3] ?? starts[1] ?? ZERO_POS
        enemyPosRef.current = newPos
        enemyTempLineRef.current = []
        enemyTempLineSetRef.current = new Set()
        enemyDrawStateRef.current = 'on-border'
        enemyBorderEntryRef.current = null
        console.log(`[qvimx] enemy lost life (source=${source})`)
        dispatch({ type: 'LOSE_LIFE', who: 'enemy', enemyPos: newPos, enemyTempLine: [] })
      }

      syncDecorations()
    },
    [syncDecorations]
  )

  // Keep the loseLifeRef in sync so tickBombs can call it
  loseLifeRef.current = loseLife

  // ── Enemy tick ────────────────────────────────────────────────────────────

  const tickEnemy = useCallback(() => {
    if (gameStatusRef.current !== 'playing') return
    const dims = dimsRef.current
    if (!dims) return
    const config = configRef.current!

    const newPos = pickEnemyStep(
      enemyPosRef.current,
      enemyDrawStateRef.current,
      playerPosRef.current,
      playerTempLineRef.current,
      playerClaimedRef.current,
      dims,
      borderCellsRef.current,
      enemyClaimedRef.current,
      config.enemyAI
    )

    const classify = classifyCellRef.current
    const kind = classify ? classify(newPos) : 'outside'

    let newDrawState = enemyDrawStateRef.current
    let newTempLine = [...enemyTempLineRef.current]

    if (enemyDrawStateRef.current === 'on-border') {
      if (kind === 'interior') {
        enemyBorderEntryRef.current = enemyPosRef.current
        newDrawState = 'drawing'
        newTempLine = [newPos]
      }
    } else if (enemyDrawStateRef.current === 'drawing') {
      if (
        kind === 'border' ||
        enemyClaimedSetRef.current.has(`${newPos.lineNumber},${newPos.column}`)
      ) {
        const entryCell = enemyBorderEntryRef.current
        const exitCell = newPos
        enemyBorderEntryRef.current = null
        enemyPosRef.current = newPos
        enemyDrawStateRef.current = 'on-border'
        enemyTempLineRef.current = newTempLine
        claimTerritory('enemy', entryCell, exitCell)
        return
      } else if (kind === 'interior') {
        const revisitIdx = newTempLine.findIndex(t => posEq(t, newPos))
        if (revisitIdx !== -1) {
          newTempLine = newTempLine.slice(0, revisitIdx + 1)
        } else {
          newTempLine = [...newTempLine, newPos]
        }
      }
    }

    enemyPosRef.current = newPos
    enemyDrawStateRef.current = newDrawState
    enemyTempLineRef.current = newTempLine
    syncSet(newTempLine, enemyTempLineSetRef)

    dispatch({
      type: 'ENEMY_TICK',
      enemyPos: newPos,
      enemyDrawState: newDrawState,
      enemyTempLine: newTempLine,
      enemyClaimed: enemyClaimedRef.current,
      enemyScore: enemyScoreRef.current,
    })

    syncDecorations()
  }, [claimTerritory, syncDecorations])

  // ── Timer ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (state.status !== 'playing') return
    const id = setInterval(() => {
      const totalMs = Date.now() - gameStartRef.current
      dispatch({ type: 'TICK', totalMs })
      const config = configRef.current
      if (config && totalMs >= config.timerMs && gameStatusRef.current === 'playing') {
        gameStatusRef.current = 'results'
        clearAllIntervals()
        dispatch({ type: 'END', endReason: 'time' })
      }
    }, 200)
    timerTickRef.current = id
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status])

  // ── Challenge handling ────────────────────────────────────────────────────

  const handleCommandExecuted = useCallback((cmd: string) => {
    if (gameStatusRef.current !== 'playing') return
    const config = configRef.current
    if (!config?.challengeMode) return
    const challenge = activeChallengeRef.current
    if (!challenge) return

    const solved = challenge.solution.map(s => normaliseVimKey(s))
    if (!solved.includes(normaliseVimKey(cmd))) return

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
      next = challenge
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

  // ── Monaco editor created ─────────────────────────────────────────────────
  // Called synchronously inside useMonacoEditor's init() once the editor
  // instance and its built-in decoration collections exist.  This is the
  // correct place to create extra decoration collections and to flush any
  // content that startGame() stored in pendingStartRef before Monaco was ready.

  const handleEditorCreated = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (monaco: any, editor: any) => {
      monacoRef.current = monaco
      qvimxDecColRef.current = editor.createDecorationsCollection([])

      const pending = pendingStartRef.current
      if (pending) {
        pendingStartRef.current = null
        editor.setValue(pending.content)
        editor.setPosition(pending.playerStart)
        editor.revealPositionInCenter(pending.playerStart)
        editor.focus()
        syncDecorations()
      }
    },
    [syncDecorations]
  )

  // ── Monaco init ───────────────────────────────────────────────────────────

  const { editorRef, statusRef, setContent, positionCursor, focusEditor, getVisibleRange } =
    useMonacoEditor({
      onEditorCreated: handleEditorCreated,
      onCursorChange: handleCursorChange,
      onCommandExecuted: handleCommandExecuted,
      readOnly: true,
    })

  // Keep forward refs in sync so startGame and callbacks always use fresh fns
  setContentRef.current = setContent
  positionCursorRef.current = positionCursor
  focusEditorRef.current = focusEditor
  getVisibleRangeRef.current = getVisibleRange

  // ── startGame ─────────────────────────────────────────────────────────────

  const startGame = useCallback(
    (config: QvimxConfig) => {
      clearAllIntervals()

      const rawContent = getSizedFile(config.language, config.codeSize)
      const { borderedContent, dims, allRectDims } = buildBorderedContent(
        rawContent,
        config.borderShape
      )
      fileContentRef.current = borderedContent
      dimsRef.current = dims
      const baseClassify = (pos: Pos) => classifyCell(pos, dims)

      // ── Board setup: classify, neutral cells, border/interior, ordered border ─
      const neutralCells: Pos[] = []

      if (allRectDims && allRectDims.length > 1) {
        // rectangles mode: multiple inner rects — between-zone cells are neutral walls.
        const innerCellsSet = new Set<string>()
        for (const rd of allRectDims) {
          for (const p of allInteriorCells(rd)) innerCellsSet.add(`${p.lineNumber},${p.column}`)
          for (const p of allBorderCells(rd)) innerCellsSet.add(`${p.lineNumber},${p.column}`)
        }
        for (const p of allInteriorCells(dims)) {
          if (!innerCellsSet.has(`${p.lineNumber},${p.column}`)) neutralCells.push(p)
        }
        neutralCellsRef.current = neutralCells
        syncSet(neutralCells, neutralClaimedSetRef)

        classifyCellRef.current = (pos: Pos): CellKind => {
          if (neutralClaimedSetRef.current.has(`${pos.lineNumber},${pos.column}`)) return 'border'
          for (const rd of allRectDims) {
            const k = classifyCell(pos, rd)
            if (k !== 'outside') return k
          }
          return baseClassify(pos)
        }

        borderCellsRef.current = allRectDims.flatMap(rd => allBorderCells(rd))
        interiorCellsRef.current = allRectDims.flatMap(rd => allInteriorCells(rd))
        syncSet(interiorCellsRef.current, interiorCellsSetRef)

        const starts = borderStartPositions(allRectDims[0])
        const playerStart = starts[0] ?? ZERO_POS
        const enemyStart =
          borderStartPositions(allRectDims[allRectDims.length - 1])[1] ?? starts[0] ?? ZERO_POS

        playerPosRef.current = playerStart
        playerDrawStateRef.current = 'on-border'
        playerTempLineRef.current = []
        playerClaimedRef.current = []
        syncSet([], playerClaimedSetRef)
        playerBorderEntryRef.current = null
        enemyPosRef.current = enemyStart
        enemyDrawStateRef.current = 'on-border'
        enemyTempLineRef.current = []
        enemyClaimedRef.current = []
        syncSet([], enemyClaimedSetRef)
        enemyScoreRef.current = 0
        enemyBorderEntryRef.current = null
        challengeScoreRef.current = 0
        challengeCompletionsRef.current = new Map()

        const balls = buildBalls(config.ballCount, config.ballSpeed, dims)
        const firstOpen = interiorCellsRef.current[0]
        const finalBalls = firstOpen
          ? balls.map(b =>
              neutralClaimedSetRef.current.has(`${b.pos.lineNumber},${b.pos.column}`)
                ? { ...b, pos: firstOpen }
                : b
            )
          : balls
        ballsRef.current = finalBalls

        const orderedBorder = allRectDims.flatMap(rd => orderedBorderCells(rd))
        orderedBorderRef.current = orderedBorder
        const bombs = buildBombs(config.bombCount, orderedBorder)
        bombPatrolsRef.current = bombs

        configRef.current = config
        gameStatusRef.current = 'playing'
        gameStartRef.current = Date.now()
        challengeDrillIndexRef.current = 0

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

        if (qvimxDecColRef.current) {
          setContentRef.current(borderedContent)
          positionCursorRef.current(playerStart)
          focusEditorRef.current()
        } else {
          pendingStartRef.current = { content: borderedContent, playerStart }
        }

        dispatch({
          type: 'START',
          config,
          dims,
          playerPos: playerStart,
          enemyPos: enemyStart,
          balls: finalBalls,
          bombPatrols: bombs,
          firstChallenge,
        })

        for (const ball of finalBalls) {
          const speedMs = ball.speedMs || BALL_TICK_MS.medium
          const id = setInterval(() => tickBall(ball.id), speedMs)
          ballTickRefsMap.current.set(ball.id, id)
        }

        const enemyMs = ENEMY_TICK_MS[config.enemyAI]
        enemyTickRef.current = setInterval(tickEnemy, enemyMs)

        if (bombs.length > 0) {
          bombTickRef.current = setInterval(tickBombs, 600)
        }
        return
      }

      // ── Single-rect modes (full-rect, sub-rect, inverse-code, code-right) ────
      const lcw = dims.lineContentWidths
      if (lcw && (config.borderShape === 'inverse-code' || config.borderShape === 'code-right')) {
        for (let ln = dims.minLine + 1; ln < dims.maxLine; ln++) {
          const lineIdx = ln - dims.minLine - 1
          const codeWidth = lcw[lineIdx] ?? 0
          for (let col = dims.minCol + 1; col < dims.maxCol; col++) {
            const isCodeCell = col - dims.minCol <= codeWidth
            const isNeutral = config.borderShape === 'inverse-code' ? isCodeCell : !isCodeCell
            if (isNeutral) neutralCells.push({ lineNumber: ln, column: col })
          }
        }
      }
      neutralCellsRef.current = neutralCells
      syncSet(neutralCells, neutralClaimedSetRef)

      classifyCellRef.current = (pos: Pos): CellKind => {
        if (neutralClaimedSetRef.current.has(`${pos.lineNumber},${pos.column}`)) return 'border'
        return baseClassify(pos)
      }

      borderCellsRef.current = allBorderCells(dims)
      interiorCellsRef.current = allInteriorCells(dims).filter(
        p => !neutralClaimedSetRef.current.has(`${p.lineNumber},${p.column}`)
      )
      syncSet(interiorCellsRef.current, interiorCellsSetRef)
      const starts = borderStartPositions(dims)
      const playerStart = starts[0] ?? ZERO_POS
      const enemyStart = starts[1] ?? starts[0] ?? ZERO_POS

      playerPosRef.current = playerStart
      playerDrawStateRef.current = 'on-border'
      playerTempLineRef.current = []
      playerClaimedRef.current = []
      syncSet([], playerClaimedSetRef)
      playerBorderEntryRef.current = null
      enemyPosRef.current = enemyStart
      enemyDrawStateRef.current = 'on-border'
      enemyTempLineRef.current = []
      enemyClaimedRef.current = []
      syncSet([], enemyClaimedSetRef)
      enemyScoreRef.current = 0
      enemyBorderEntryRef.current = null
      challengeScoreRef.current = 0
      challengeCompletionsRef.current = new Map()

      const balls = buildBalls(config.ballCount, config.ballSpeed, dims)
      // Eject any ball whose spawn landed inside a neutral cell.
      const firstOpen = interiorCellsRef.current[0]
      const finalBalls = firstOpen
        ? balls.map(b =>
            neutralClaimedSetRef.current.has(`${b.pos.lineNumber},${b.pos.column}`)
              ? { ...b, pos: firstOpen }
              : b
          )
        : balls
      ballsRef.current = finalBalls

      const orderedBorder = orderedBorderCells(dims)
      orderedBorderRef.current = orderedBorder
      const bombs = buildBombs(config.bombCount, orderedBorder)
      bombPatrolsRef.current = bombs

      configRef.current = config
      gameStatusRef.current = 'playing'
      gameStartRef.current = Date.now()
      challengeDrillIndexRef.current = 0

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

      // Apply content + cursor. If Monaco's decoration collection is already
      // ready, apply immediately; otherwise stash for handleEditorCreated.
      if (qvimxDecColRef.current) {
        setContentRef.current(borderedContent)
        positionCursorRef.current(playerStart)
        focusEditorRef.current()
      } else {
        pendingStartRef.current = { content: borderedContent, playerStart }
      }

      dispatch({
        type: 'START',
        config,
        dims,
        playerPos: playerStart,
        enemyPos: enemyStart,
        balls: finalBalls,
        bombPatrols: bombs,
        firstChallenge,
      })

      // Start ball intervals (per-ball)
      for (const ball of finalBalls) {
        const speedMs = ball.speedMs || BALL_TICK_MS.medium
        const id = setInterval(() => tickBall(ball.id), speedMs)
        ballTickRefsMap.current.set(ball.id, id)
      }

      // Enemy interval
      const enemyMs = ENEMY_TICK_MS[config.enemyAI]
      enemyTickRef.current = setInterval(tickEnemy, enemyMs)

      // Bomb patrol interval (600ms)
      if (bombs.length > 0) {
        bombTickRef.current = setInterval(tickBombs, 600)
      }
    },
    [tickBall, tickEnemy, tickBombs]
  )

  return {
    state,
    editorRef,
    statusRef,
    startGame,
    getVisibleRange,
  }
}
