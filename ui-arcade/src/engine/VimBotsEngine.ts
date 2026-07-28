import type { Language, ChallengeConfig } from './types'

export type VimBoardPreset = 'tiny' | 'small' | 'medium' | 'large' | 'xlarge' | 'custom'
export type VimBotsBoardSource = 'grid' | Language
export type VimBotsDifficulty = 'beginner' | 'easy' | 'medium' | 'hard' | 'expert'

export interface VimBotsConfig extends ChallengeConfig {
  boardSource: VimBotsBoardSource
  gridPreset: VimBoardPreset
  customRows: number
  customCols: number
  codeFileSize: 'short' | 'medium' | 'long'
  difficulty: VimBotsDifficulty
  enableTeleport: boolean
  enableSafeTeleport: boolean
  maxTeleports: number
  maxSafeTeleports: number
  animatedEffects: boolean
  enableHelperGrid: boolean
  /** Which enemy tier the first level spawns — 1 = Borg only, 3 = Borgs+Reapers, etc. */
  startingEnemyLevel: number
}

export interface Pos {
  row: number
  col: number
}

// ── Robot types ───────────────────────────────────────────────────────────────

export type RobotType = 'borg' | 'reaper' | 'phantom' | 'inferno' | 'decimator'

export interface Robot {
  pos: Pos
  type: RobotType
}

export interface RobotTypeDef {
  type: RobotType
  name: string
  /** Chebyshev steps taken each turn */
  speed: number
  /** First level where this type appears */
  minLevel: number
  /** CSS rgba color string */
  color: string
  /** Monaco inline decoration class */
  cssClass: string
  /** Outline CSS for the fire-border style (reused in legend swatch) */
  outline: string
}

export const ROBOT_TYPE_DEFS: RobotTypeDef[] = [
  {
    type: 'borg',
    name: 'Borg',
    speed: 1,
    minLevel: 1,
    color: 'rgba(239,68,68,0.75)',
    cssClass: 'vimbots-borg',
    outline: '2px solid rgba(252,165,165,0.8)',
  },
  {
    type: 'reaper',
    name: 'Reaper',
    speed: 2,
    minLevel: 3,
    color: 'rgba(168,85,247,0.75)',
    cssClass: 'vimbots-reaper',
    outline: '2px solid rgba(216,180,254,0.8)',
  },
  {
    type: 'phantom',
    name: 'Phantom',
    speed: 2,
    minLevel: 5,
    color: 'rgba(34,211,238,0.75)',
    cssClass: 'vimbots-phantom',
    outline: '2px solid rgba(103,232,249,0.8)',
  },
  {
    type: 'inferno',
    name: 'Inferno',
    speed: 3,
    minLevel: 7,
    color: 'rgba(251,191,36,0.75)',
    cssClass: 'vimbots-inferno',
    outline: '2px solid rgba(253,224,71,0.8)',
  },
  {
    type: 'decimator',
    name: 'Decimator',
    speed: 3,
    minLevel: 9,
    color: 'rgba(248,250,252,0.85)',
    cssClass: 'vimbots-decimator',
    outline: '2px solid rgba(255,255,255,0.9)',
  },
]

export function activeTypesForLevel(level: number): RobotTypeDef[] {
  return ROBOT_TYPE_DEFS.filter(d => level >= d.minLevel)
}

// ── State ─────────────────────────────────────────────────────────────────────

export type CellContent = 'empty' | 'player' | 'robot' | 'fire'

export interface VimBotsState {
  config: VimBotsConfig
  gridContent: string
  rows: number
  cols: number
  playerPos: Pos
  robots: Robot[]
  fire: Pos[]
  level: number
  score: number
  status: 'playing' | 'dead' | 'level_cleared' | 'game_over'
  teleportsLeft: number
  safeTeleportsLeft: number
  helperGridLeft: number
  robotsDestroyedThisLevel: number
  initialRobotCount: number
  initialRobotsByType: Partial<Record<RobotType, number>>
  message: string
}

// ── Preset / grid helpers ─────────────────────────────────────────────────────

export function getPresetDimensions(preset: VimBoardPreset): { rows: number; cols: number } {
  switch (preset) {
    case 'tiny':
      return { rows: 20, cols: 60 }
    case 'small':
      return { rows: 40, cols: 100 }
    case 'medium':
      return { rows: 60, cols: 140 }
    case 'large':
      return { rows: 100, cols: 200 }
    case 'xlarge':
      return { rows: 150, cols: 280 }
    case 'custom':
      return { rows: 40, cols: 100 }
  }
}

const GRID_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

export function generateGrid(rows: number, cols: number): string {
  const lines: string[] = []
  for (let r = 0; r < rows; r++) {
    let line = ''
    for (let c = 0; c < cols; c++) {
      line += GRID_CHARS[Math.floor(Math.random() * GRID_CHARS.length)]
    }
    lines.push(line)
  }
  return lines.join('\n')
}

// Keep for backward-compat
export type GridSize = VimBoardPreset

// ── Pure helpers ──────────────────────────────────────────────────────────────

function difficultyRobotFraction(difficulty: VimBotsDifficulty): number {
  switch (difficulty) {
    case 'beginner':
      return 0.02
    case 'easy':
      return 0.1
    case 'medium':
      return 0.2
    case 'hard':
      return 0.4
    case 'expert':
      return 0.7
  }
}

function posEq(a: Pos, b: Pos): boolean {
  return a.row === b.row && a.col === b.col
}

function inBounds(pos: Pos, rows: number, cols: number): boolean {
  return pos.row >= 0 && pos.row < rows && pos.col >= 0 && pos.col < cols
}

function sign(n: number): number {
  if (n > 0) return 1
  if (n < 0) return -1
  return 0
}

function stepToward(from: Pos, target: Pos): Pos {
  return {
    row: from.row + sign(target.row - from.row),
    col: from.col + sign(target.col - from.col),
  }
}

function isOnFire(pos: Pos, fire: Pos[]): boolean {
  return fire.some(f => posEq(f, pos))
}

function isOnRobot(pos: Pos, robots: Robot[]): boolean {
  return robots.some(r => posEq(r.pos, pos))
}

function robotPositions(robots: Robot[]): Pos[] {
  return robots.map(r => r.pos)
}

function isAdjacentToHazard(pos: Pos, robots: Robot[], fire: Pos[]): boolean {
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue
      const neighbor: Pos = { row: pos.row + dr, col: pos.col + dc }
      if (isOnRobot(neighbor, robots) || isOnFire(neighbor, fire)) return true
    }
  }
  return false
}

function randomInt(max: number): number {
  return Math.floor(Math.random() * max)
}

// ── Robot placement ───────────────────────────────────────────────────────────

function placeRobotGroup(
  type: RobotType,
  count: number,
  rows: number,
  cols: number,
  playerPos: Pos,
  occupiedPositions: Pos[]
): Robot[] {
  const result: Robot[] = []
  const occupied = [...occupiedPositions]
  let attempts = 0
  const maxAttempts = count * 100

  while (result.length < count && attempts < maxAttempts) {
    attempts++
    const candidate: Pos = { row: randomInt(rows), col: randomInt(cols) }
    if (posEq(candidate, playerPos)) continue
    if (occupied.some(p => posEq(p, candidate))) continue
    result.push({ pos: candidate, type })
    occupied.push(candidate)
  }

  return result
}

function buildRobotsForLevel(
  level: number,
  totalCount: number,
  rows: number,
  cols: number,
  playerPos: Pos
): Robot[] {
  const types = activeTypesForLevel(level)
  // Equal split; Borg absorbs the remainder
  const perType = Math.floor(totalCount / types.length)
  const counts = types.map((t, i) => ({
    type: t.type,
    count: i === 0 ? totalCount - perType * (types.length - 1) : perType,
  }))

  const robots: Robot[] = []
  const occupied: Pos[] = []
  for (const { type, count } of counts) {
    const group = placeRobotGroup(type, count, rows, cols, playerPos, occupied)
    for (const r of group) occupied.push(r.pos)
    robots.push(...group)
  }
  return robots
}

function countsByType(robots: Robot[]): Partial<Record<RobotType, number>> {
  const result: Partial<Record<RobotType, number>> = {}
  for (const r of robots) {
    result[r.type] = (result[r.type] ?? 0) + 1
  }
  return result
}

// ── Collision resolution ──────────────────────────────────────────────────────

function resolveCollisions(
  robots: Robot[],
  existingFire: Pos[]
): { survivors: Robot[]; newFire: Pos[]; destroyed: number } {
  const grouped = new Map<string, Robot[]>()
  for (const r of robots) {
    const key = `${r.pos.row},${r.pos.col}`
    const group = grouped.get(key) ?? []
    group.push(r)
    grouped.set(key, group)
  }

  const survivors: Robot[] = []
  const newFire: Pos[] = [...existingFire]
  let destroyed = 0

  for (const [, group] of grouped) {
    const pos = group[0].pos
    const landsOnFire = isOnFire(pos, existingFire)
    if (group.length > 1 || landsOnFire) {
      destroyed += group.length
      if (!landsOnFire) newFire.push(pos)
    } else {
      survivors.push(group[0])
    }
  }

  return { survivors, newFire, destroyed }
}

// ── Grid helpers ──────────────────────────────────────────────────────────────

function countGridRows(gridContent: string): number {
  return gridContent.split('\n').length
}

function countGridCols(gridContent: string): number {
  return gridContent.split('\n').reduce((max, line) => Math.max(max, line.length), 0)
}

// ── Helper grid & safe-move logic ────────────────────────────────────────────

function initialHelperGridCount(difficulty: VimBotsDifficulty): number {
  switch (difficulty) {
    case 'beginner':
      return 3
    case 'easy':
      return 2
    case 'medium':
      return 1
    case 'hard':
      return 0
    case 'expert':
      return 0
  }
}

function helperGridGainInterval(difficulty: VimBotsDifficulty): number {
  switch (difficulty) {
    case 'beginner':
      return 3
    case 'easy':
      return 3
    case 'medium':
      return 4
    case 'hard':
      return 5
    case 'expert':
      return 7
  }
}

function helperGridCap(difficulty: VimBotsDifficulty): number {
  return Math.max(3, initialHelperGridCount(difficulty) * 2)
}

/**
 * Core safe-cell computation — no state dependency, works with raw arrays.
 * A cell is "unsafe" if any robot can reach it within its Chebyshev speed.
 * Conservative (ignores robot-robot collision cancellations) and O(robots × speed²).
 */
function safeCellsRaw(robots: Robot[], fire: Pos[], rows: number, cols: number): Pos[] {
  const unsafe = new Set<string>()

  for (const robot of robots) {
    const def = ROBOT_TYPE_DEFS.find(d => d.type === robot.type)!
    const s = def.speed
    const { row: rr, col: rc } = robot.pos
    for (let dr = -s; dr <= s; dr++) {
      for (let dc = -s; dc <= s; dc++) {
        const nr = rr + dr
        const nc = rc + dc
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) unsafe.add(`${nr},${nc}`)
      }
    }
  }

  for (const f of fire) unsafe.add(`${f.row},${f.col}`)

  const safe: Pos[] = []
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) if (!unsafe.has(`${r},${c}`)) safe.push({ row: r, col: c })

  return safe
}

/** Returns all cells the player can safely move to. Used for highlights and trapped detection. */
export function computeSafeCells(state: VimBotsState): Pos[] {
  return safeCellsRaw(state.robots, state.fire, state.rows, state.cols)
}

/** Fast count of safe moves — used for HUD counter and trapped detection. */
export function countSafeMoves(state: VimBotsState): number {
  return safeCellsRaw(state.robots, state.fire, state.rows, state.cols).length
}

/**
 * Guarantees ≥1 safe cell exists by removing the nearest robot(s) until one opens up.
 * This mirrors the Minesweeper first-click guarantee.
 */
function guaranteeSafeStart(robots: Robot[], rows: number, cols: number, playerPos: Pos): Robot[] {
  let current = [...robots]
  while (current.length > 0) {
    if (safeCellsRaw(current, [], rows, cols).length > 0) break
    // Remove the Chebyshev-closest robot to the player
    let minDist = Infinity
    let minIdx = 0
    current.forEach((r, i) => {
      const d = Math.max(Math.abs(r.pos.row - playerPos.row), Math.abs(r.pos.col - playerPos.col))
      if (d < minDist) {
        minDist = d
        minIdx = i
      }
    })
    current = current.filter((_, i) => i !== minIdx)
  }
  return current
}

// ── Public engine functions ───────────────────────────────────────────────────

export function initVimBotsState(config: VimBotsConfig, gridContent: string): VimBotsState {
  const rows = countGridRows(gridContent)
  const cols = countGridCols(gridContent)
  const playerPos: Pos = { row: Math.floor(rows / 2), col: Math.floor(cols / 2) }

  const totalCells = rows * cols
  const fraction = difficultyRobotFraction(config.difficulty)
  const robotCount = Math.max(1, Math.floor(totalCells * fraction))

  // startingEnemyLevel offsets which enemy types appear from level 1
  const effectiveLevel = Math.max(1, config.startingEnemyLevel ?? 1)
  const robots = guaranteeSafeStart(
    buildRobotsForLevel(effectiveLevel, robotCount, rows, cols, playerPos),
    rows,
    cols,
    playerPos
  )

  return {
    config,
    gridContent,
    rows,
    cols,
    playerPos,
    robots,
    fire: [],
    level: 1,
    score: 0,
    status: 'playing',
    teleportsLeft: config.maxTeleports,
    safeTeleportsLeft: config.maxSafeTeleports,
    helperGridLeft: config.enableHelperGrid ? initialHelperGridCount(config.difficulty) : 0,
    robotsDestroyedThisLevel: 0,
    initialRobotCount: robots.length,
    initialRobotsByType: countsByType(robots),
    message: 'Level 1!',
  }
}

export function advanceRobots(state: VimBotsState): VimBotsState {
  if (state.status !== 'playing') return state

  const { playerPos, robots, fire, level, score } = state

  // Each robot takes `speed` Chebyshev steps toward the player
  const movedRobots: Robot[] = robots.map(r => {
    const def = ROBOT_TYPE_DEFS.find(d => d.type === r.type)!
    let pos = r.pos
    for (let i = 0; i < def.speed; i++) {
      pos = stepToward(pos, playerPos)
    }
    return { pos, type: r.type }
  })

  const { survivors, newFire, destroyed } = resolveCollisions(movedRobots, fire)

  let newScore = score + destroyed * 10
  let message = state.message
  if (destroyed > 0) {
    message = `BOOM! ${destroyed} robot${destroyed > 1 ? 's' : ''} destroyed`
  }

  const newRobotsDestroyedThisLevel = state.robotsDestroyedThisLevel + destroyed

  if (isOnRobot(playerPos, survivors) || isOnFire(playerPos, newFire)) {
    return {
      ...state,
      robots: survivors,
      fire: newFire,
      score: newScore,
      status: 'dead',
      robotsDestroyedThisLevel: newRobotsDestroyedThisLevel,
      message: 'You were caught! Game over.',
    }
  }

  if (survivors.length === 0) {
    const bonus = level * 100
    newScore += bonus
    return {
      ...state,
      robots: survivors,
      fire: newFire,
      score: newScore,
      status: 'level_cleared',
      robotsDestroyedThisLevel: newRobotsDestroyedThisLevel,
      message: `Level ${level} cleared! Bonus: ${bonus} pts`,
    }
  }

  return {
    ...state,
    robots: survivors,
    fire: newFire,
    score: newScore,
    status: 'playing',
    robotsDestroyedThisLevel: newRobotsDestroyedThisLevel,
    message,
  }
}

export function movePlayer(state: VimBotsState, newPos: Pos): VimBotsState {
  if (state.status !== 'playing') return state
  if (!inBounds(newPos, state.rows, state.cols)) return state

  if (isOnFire(newPos, state.fire)) {
    return {
      ...state,
      playerPos: newPos,
      status: 'dead',
      message: 'You stepped into fire! Game over.',
    }
  }

  if (isOnRobot(newPos, state.robots)) {
    return {
      ...state,
      playerPos: newPos,
      status: 'dead',
      message: 'You were caught by a robot! Game over.',
    }
  }

  return advanceRobots({ ...state, playerPos: newPos })
}

/** Pass the turn without moving — robots advance, player stays put. */
export function waitInPlace(state: VimBotsState): VimBotsState {
  if (state.status !== 'playing') return state
  return advanceRobots(state)
}

export function teleport(state: VimBotsState): VimBotsState {
  if (state.status !== 'playing') return state
  if (!state.config.enableTeleport || state.teleportsLeft <= 0) return state

  const { rows, cols, robots, fire } = state
  const emptyCells: Pos[] = []

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const pos: Pos = { row: r, col: c }
      if (!isOnFire(pos, fire) && !isOnRobot(pos, robots)) emptyCells.push(pos)
    }
  }

  if (emptyCells.length === 0) {
    return {
      ...state,
      teleportsLeft: state.teleportsLeft - 1,
      status: 'dead',
      message: 'Nowhere to teleport! Game over.',
    }
  }

  const newPos = emptyCells[randomInt(emptyCells.length)]
  const movedState: VimBotsState = {
    ...state,
    playerPos: newPos,
    teleportsLeft: state.teleportsLeft - 1,
  }

  if (isOnRobot(newPos, robots)) {
    return { ...movedState, status: 'dead', message: 'Teleported into a robot! Game over.' }
  }

  return advanceRobots(movedState)
}

export function safeTeleport(state: VimBotsState): VimBotsState {
  if (state.status !== 'playing') return state
  if (!state.config.enableSafeTeleport || state.safeTeleportsLeft <= 0) return state

  const { rows, cols, robots, fire } = state
  const safeCells: Pos[] = []

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const pos: Pos = { row: r, col: c }
      if (isOnFire(pos, fire) || isOnRobot(pos, robots)) continue
      if (isAdjacentToHazard(pos, robots, fire)) continue
      safeCells.push(pos)
    }
  }

  if (safeCells.length === 0) {
    return { ...state, message: 'No safe cell found' }
  }

  const newPos = safeCells[randomInt(safeCells.length)]
  return advanceRobots({
    ...state,
    playerPos: newPos,
    safeTeleportsLeft: state.safeTeleportsLeft - 1,
    score: state.score + 5,
  })
}

export function startNextLevel(state: VimBotsState): VimBotsState {
  if (state.status !== 'level_cleared') return state

  const { config, rows, cols, level, score } = state
  const newLevel = level + 1
  const playerPos: Pos = { row: Math.floor(rows / 2), col: Math.floor(cols / 2) }

  const totalCells = rows * cols
  const fraction = difficultyRobotFraction(config.difficulty)
  const baseCount = Math.max(1, Math.floor(totalCells * fraction))
  const robotCount = Math.min(
    Math.floor(baseCount * (1 + (newLevel - 1) * 0.1)),
    Math.floor(totalCells * 0.9)
  )

  // Enemy tier = starting level offset + levels cleared
  const clearedLevels = newLevel - 1
  const enemyTier = Math.max(1, (config.startingEnemyLevel ?? 1) + clearedLevels)
  const robots = guaranteeSafeStart(
    buildRobotsForLevel(enemyTier, robotCount, rows, cols, playerPos),
    rows,
    cols,
    playerPos
  )

  // Helper grid: gain 1 use every N levels (based on difficulty)
  let newHelperLeft = state.helperGridLeft
  if (config.enableHelperGrid) {
    const interval = helperGridGainInterval(config.difficulty)
    if (interval > 0 && clearedLevels > 0 && clearedLevels % interval === 0) {
      newHelperLeft = Math.min(state.helperGridLeft + 1, helperGridCap(config.difficulty))
    }
  }

  return {
    ...state,
    playerPos,
    robots,
    fire: [],
    level: newLevel,
    score,
    status: 'playing',
    teleportsLeft: Math.min(state.teleportsLeft + config.maxTeleports, config.maxTeleports * 2),
    safeTeleportsLeft: Math.min(
      state.safeTeleportsLeft + config.maxSafeTeleports,
      config.maxSafeTeleports * 2
    ),
    helperGridLeft: newHelperLeft,
    robotsDestroyedThisLevel: 0,
    initialRobotCount: robots.length,
    initialRobotsByType: countsByType(robots),
    message: `Level ${newLevel}!`,
  }
}

// Re-export for teleport helpers that check positions
export { robotPositions }
