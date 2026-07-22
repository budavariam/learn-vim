import type {
  GameState, ActiveChallenge, VimCommandData, LevelProgress,
  Notification, NotificationType, GameConfig, GameSettings,
} from './types'
import { normaliseVimKey } from './vimKeyUtils'
import {
  getBasePoints, getTimeLimit, getTimeRating, getComboMultiplier, calculatePoints,
} from './ScoreEngine'
import {
  tryAdvanceCeiling, pickChallengeLevel, getWarmupCount, shouldIncreaseConcurrent,
  getLevelCompletion, shouldShowSolution, pickNextCommand,
} from './LevelEngine'

function makeNotification(
  type: NotificationType,
  text: string,
  now: number,
  points?: number
): Notification {
  return { id: crypto.randomUUID(), type, text, points, expiresAt: now + 2500 }
}

function emptyLevelEntry() {
  return {
    seen: new Set<string>(),
    completionCounts: new Map<string, number>(),
    failureCounts: new Map<string, number>(),
  }
}

function cloneLevelProgress(lp: LevelProgress): LevelProgress {
  const out: LevelProgress = {}
  for (const [k, v] of Object.entries(lp)) {
    out[Number(k)] = {
      seen: new Set(v.seen),
      completionCounts: new Map(v.completionCounts),
      failureCounts: new Map(v.failureCounts),
    }
  }
  return out
}

export function initGameState(config: GameConfig, commands: VimCommandData[]): GameState {
  const ceiling = Math.min(config.startingLevel, 9)
  const maxLevel = commands.length > 0 ? Math.max(...commands.map(c => c.level)) : 9
  const levelProgress: LevelProgress = {}
  for (let i = 0; i <= maxLevel; i++) levelProgress[i] = emptyLevelEntry()

  return {
    status: getWarmupCount(config.startingLevel) > 0 ? 'warmup' : 'playing',
    config,
    liveSettings: { guidedMode: config.guidedMode },
    language: config.language,
    startingLevel: config.startingLevel,
    activeChallenges: [],
    maxConcurrent: 1,
    ceiling,
    score: 0,
    combo: { count: 0, multiplier: 1.0 },
    levelProgress,
    sessionStats: {
      totalChallenges: 0,
      completed: 0,
      failed: 0,
      totalPoints: 0,
      bestCombo: 0,
      startedAt: Date.now(),
      expectedTimeMs: 0,
      achievedTimeMs: 0,
    },
    recentNotifications: [],
    levelPct: 0,
    sessionElapsedMs: 0,
    pendingVerifications: [],
  }
}

export function createChallenge(
  cmd: VimCommandData,
  ceiling: number,
  mode: GameConfig['mode'],
  guidedMode: GameSettings['guidedMode'],
  progress: LevelProgress,
  isVerification: boolean,
  now: number,
  commandTimeMultiplier = 1
): ActiveChallenge {
  const timeLimit = getTimeLimit(cmd.level, ceiling, mode, commandTimeMultiplier)
  const occurrenceIndex = (progress[cmd.level]?.seen?.has(cmd.id) ? 1 : 0) +
    (progress[cmd.level]?.completionCounts?.get(cmd.id) ?? 0)
  const hasFailure = (progress[cmd.level]?.failureCounts?.get(cmd.id) ?? 0) > 0
  const showSolution = shouldShowSolution(guidedMode, occurrenceIndex, hasFailure, isVerification)

  return {
    id: crypto.randomUUID(),
    commandId: cmd.id,
    level: cmd.level,
    category: cmd.category,
    question: cmd.question,
    solution: cmd.solution,
    startedAt: now,
    timeLimit,
    status: 'active',
    pointsEarned: 0,
    showSolution,
    isVerification,
  }
}

export function updateLiveSettings(state: GameState, patch: Partial<GameSettings>): GameState {
  return { ...state, liveSettings: { ...state.liveSettings, ...patch } }
}

export function handleCommandExecuted(
  state: GameState,
  executedCommand: string,
  commands: VimCommandData[],
  now: number
): GameState {
  // executedCommand is already normalised (e.g. '<Esc>', '<C-a>').
  // c.solution contains RAW data.json strings (e.g. 'Esc', 'ctrl-a').
  // Normalise each before comparing so 'Esc' matches '<Esc>' etc.
  const matchingIdx = state.activeChallenges.findIndex(
    c => c.status === 'active' && c.solution.some(s => normaliseVimKey(s) === executedCommand)
  )
  if (matchingIdx === -1) return state

  const challenge = state.activeChallenges[matchingIdx]
  const elapsed = now - challenge.startedAt
  const { multiplier: timeMultiplier, rating } = getTimeRating(elapsed, challenge.timeLimit)

  const newComboCount = state.combo.count + 1
  const comboMultiplier = getComboMultiplier(newComboCount)
  const basePoints = getBasePoints(challenge.level)
  const points = calculatePoints(basePoints, timeMultiplier, comboMultiplier, challenge.showSolution)

  const newLevelProgress = cloneLevelProgress(state.levelProgress)
  if (!newLevelProgress[challenge.level]) newLevelProgress[challenge.level] = emptyLevelEntry()
  const entry = newLevelProgress[challenge.level]
  entry.seen.add(challenge.commandId)
  entry.completionCounts.set(
    challenge.commandId,
    (entry.completionCounts.get(challenge.commandId) ?? 0) + 1
  )

  const newCeiling = tryAdvanceCeiling(
    state.ceiling, newLevelProgress, commands, state.config.repetitionTarget
  )
  const leveledUp = newCeiling > state.ceiling

  const updatedChallenges = state.activeChallenges.map((c, i) =>
    i === matchingIdx ? { ...c, status: 'completed' as const, pointsEarned: points, doneAt: now } : c
  )

  const activeNotifications = state.recentNotifications.filter(n => n.expiresAt > now)
  const newNotifications: Notification[] = [
    ...activeNotifications,
    makeNotification(rating as NotificationType, `+${points}`, now, points),
  ]
  if (newComboCount >= 3) {
    newNotifications.push(makeNotification('combo', `${newComboCount}x COMBO!`, now))
  }
  if (leveledUp) {
    newNotifications.push(makeNotification('levelup', `Level ${newCeiling}!`, now))
  }

  const newCompleted = state.sessionStats.completed + 1

  // Schedule a blind verification if the challenge was guided (first_only / first_then_failure)
  let newPending = [...state.pendingVerifications]
  if (challenge.showSolution &&
      (state.liveSettings.guidedMode === 'first_only' ||
       state.liveSettings.guidedMode === 'first_then_failure') &&
      !challenge.isVerification) {
    newPending.push(challenge.commandId)
  }

  const levelPct = getLevelCompletion(newCeiling, newLevelProgress, commands, state.config.repetitionTarget) * 100

  const warmupTarget = getWarmupCount(state.startingLevel)
  const newStatus = state.status === 'warmup' && newCompleted >= warmupTarget ? 'playing' : state.status

  return {
    ...state,
    activeChallenges: updatedChallenges,
    score: state.score + points,
    ceiling: newCeiling,
    combo: { count: newComboCount, multiplier: comboMultiplier },
    levelProgress: newLevelProgress,
    maxConcurrent: shouldIncreaseConcurrent(newCompleted, state.maxConcurrent)
      ? state.maxConcurrent + 1
      : state.maxConcurrent,
    sessionStats: {
      ...state.sessionStats,
      completed: newCompleted,
      totalChallenges: state.sessionStats.totalChallenges + 1,
      totalPoints: state.sessionStats.totalPoints + points,
      bestCombo: Math.max(state.sessionStats.bestCombo, newComboCount),
    },
    recentNotifications: newNotifications,
    status: newStatus,
    levelPct,
    pendingVerifications: newPending,
  }
}

export function tick(state: GameState, commands: VimCommandData[], now: number): GameState {
  if (state.status === 'setup' || state.status === 'results' || state.status === 'paused') {
    return state
  }

  const sessionElapsedMs = now - state.sessionStats.startedAt

  // Timed challenge: end when time is up
  if (
    state.config.mode === 'timed_challenge' &&
    state.config.timedDurationMs &&
    sessionElapsedMs >= state.config.timedDurationMs
  ) {
    return { ...state, status: 'results', sessionElapsedMs }
  }

  const activeNotifications = state.recentNotifications.filter(n => n.expiresAt > now)
  const newNotifications: Notification[] = [...activeNotifications]

  // Dynamic assist: auto-reveal solution when the configured % of the time limit is reached.
  // In survival mode cap at 100 % — revealing after the failure threshold is pointless.
  const assistPct = state.config.dynamicAssist !== null
    ? (state.config.mode === 'survival'
        ? Math.min(100, state.config.dynamicAssist)
        : state.config.dynamicAssist)
    : null

  const assistedChallenges = assistPct !== null
    ? state.activeChallenges.map(c => {
        if (c.status === 'active' && !c.showSolution) {
          const elapsed = now - c.startedAt
          if (elapsed >= c.timeLimit * (assistPct / 100)) {
            return { ...c, showSolution: true }
          }
        }
        return c
      })
    : state.activeChallenges

  // Clone level-progress ONCE up front — shared by survival early-return and the
  // normal path so failure counts are never silently discarded (fix: Bug #3).
  let newLevelProgress = cloneLevelProgress(state.levelProgress)

  // Expire timed-out active challenges
  let newFailedCount = 0
  const updatedChallenges = assistedChallenges.map(c => {
    if (c.status === 'active' && now - c.startedAt > c.timeLimit) {
      newFailedCount++
      return { ...c, status: 'failed' as const, doneAt: now }
    }
    return c
  })

  let newCombo = state.combo
  let newSessionStats = state.sessionStats

  if (newFailedCount > 0) {
    newCombo = { count: 0, multiplier: 1.0 }
    newSessionStats = {
      ...newSessionStats,
      failed: newSessionStats.failed + newFailedCount,
      totalChallenges: newSessionStats.totalChallenges + newFailedCount,
    }
    newNotifications.push(makeNotification('failed', 'Time up!', now))

    // Write failure counts into the single shared clone (fix: Bug #3 duplicate write removed)
    for (const c of updatedChallenges) {
      if (c.status === 'failed') {
        if (!newLevelProgress[c.level]) newLevelProgress[c.level] = emptyLevelEntry()
        const entry = newLevelProgress[c.level]
        entry.failureCounts.set(c.commandId, (entry.failureCounts.get(c.commandId) ?? 0) + 1)
      }
    }

    // Survival: end game on first failure
    if (state.config.mode === 'survival') {
      return {
        ...state,
        activeChallenges: updatedChallenges,
        combo: newCombo,
        levelProgress: newLevelProgress,   // fix: Bug #3 — was spreading state.levelProgress
        sessionStats: {
          ...newSessionStats,
          achievedTimeMs: sessionElapsedMs,
        },
        recentNotifications: newNotifications,
        status: 'results',
        sessionElapsedMs,
      }
    }
  }

  // Remove settled challenges after a short display window.
  // Fix (Bug #4): use c.doneAt so completed cards linger the same as failed ones.
  // Previously completed cards had doneAt=startedAt (+0) and vanished immediately.
  const DONE_DISPLAY_MS = 600
  const visibleChallenges = updatedChallenges.filter(c => {
    if (c.status === 'active') return true
    return now - (c.doneAt ?? now) < DONE_DISPLAY_MS
  })

  // newLevelProgress already cloned above — no second clone needed here

  let newCeiling = state.ceiling
  const warmupTarget = getWarmupCount(state.startingLevel)
  const warmupRemaining = state.status === 'warmup'
    ? Math.max(0, warmupTarget - newSessionStats.completed)
    : 0
  let newStatus = state.status === 'warmup' && warmupRemaining <= 0 ? 'playing' : state.status

  // Fill empty slots with new challenges
  const activeSlots = visibleChallenges.filter(c => c.status === 'active')
  const slotsToFill = state.maxConcurrent - activeSlots.length
  const addedChallenges: ActiveChallenge[] = []
  let addedExpectedMs = 0

  if (slotsToFill > 0 && commands.length > 0) {
    let newPending = [...state.pendingVerifications]

    for (let i = 0; i < slotsToFill; i++) {
      const wi = warmupRemaining - i
      const targetLevel = pickChallengeLevel(newCeiling, wi)
      const allActiveIds = new Set([
        ...activeSlots.map(c => c.commandId),
        ...addedChallenges.map(c => c.commandId),
      ])

      const isVerification = newPending.length > 0
      const cmd = pickNextCommand(
        commands, targetLevel, allActiveIds, newLevelProgress,
        state.config.repetitionTarget, newPending
      )

      if (cmd) {
        if (isVerification && newPending[0] === cmd.id) {
          newPending = newPending.slice(1)
        }

        const challenge = createChallenge(
          cmd, newCeiling, state.config.mode,
          state.liveSettings.guidedMode, newLevelProgress, isVerification, now,
          state.config.commandTimeMultiplier ?? 1
        )
        addedChallenges.push(challenge)
        addedExpectedMs += challenge.timeLimit

        if (!newLevelProgress[cmd.level]) newLevelProgress[cmd.level] = emptyLevelEntry()
        newLevelProgress[cmd.level].seen.add(cmd.id)
      } else if (isVerification) {
        // Fix (Bug #5): pending verification command is not in the filtered command set.
        // Discard it so the slot is not permanently starved.
        newPending = newPending.slice(1)
      }
    }

    // Fix (Bug #2): was copying state.pendingVerifications instead of newPending,
    // so the dequeued verification IDs were never removed from state.
    state = { ...state, pendingVerifications: newPending }
  }

  const levelPct = getLevelCompletion(newCeiling, newLevelProgress, commands, state.config.repetitionTarget) * 100

  return {
    ...state,
    status: newStatus,
    activeChallenges: [...visibleChallenges, ...addedChallenges],
    combo: newCombo,
    ceiling: newCeiling,
    levelProgress: newLevelProgress,
    sessionStats: {
      ...newSessionStats,
      expectedTimeMs: newSessionStats.expectedTimeMs + addedExpectedMs,
    },
    recentNotifications: newNotifications,
    levelPct,
    sessionElapsedMs,
  }
}
