import type { LevelProgress, VimCommandData, GuidedMode } from './types'

export const CEILING_ADVANCE_THRESHOLD = 0.75

export function tryAdvanceCeiling(
  ceiling: number,
  progress: LevelProgress,
  allCommands: VimCommandData[],
  repetitionTarget: number
): number {
  if (ceiling >= 9) return 9
  const completion = getLevelCompletion(ceiling, progress, allCommands, repetitionTarget)
  return completion >= CEILING_ADVANCE_THRESHOLD ? Math.min(9, ceiling + 1) : ceiling
}

// % of commands at a level that have reached the repetition target (0.0–1.0)
export function getLevelCompletion(
  level: number,
  progress: LevelProgress,
  allCommands: VimCommandData[],
  repetitionTarget: number
): number {
  const commandsAtLevel = allCommands.filter(c => c.level === level)
  if (commandsAtLevel.length === 0) return 1.0
  const metTarget = commandsAtLevel.filter(
    c => (progress[level]?.completionCounts?.get(c.id) ?? 0) >= repetitionTarget
  ).length
  return metTarget / commandsAtLevel.length
}

// Weighted random: ceiling level gets 40% weight, lower levels share the rest equally
export function pickChallengeLevel(ceiling: number, warmupRemaining: number): number {
  if (warmupRemaining > 0) return 0
  if (ceiling === 0) return 0
  const rand = Math.random()
  if (rand < 0.4) return ceiling
  return Math.floor(Math.random() * ceiling)
}

export function getWarmupCount(startingLevel: number): number {
  if (startingLevel <= 1) return 3
  if (startingLevel <= 4) return 2
  return 1
}

// After every 10 successful completions, grow the slot count (max 4)
export function shouldIncreaseConcurrent(completedCount: number, current: number): boolean {
  if (current >= 4) return false
  return completedCount > 0 && completedCount % 10 === 0
}

// Returns whether showSolution should be true for a new challenge occurrence.
// occurrenceIndex = how many times this command has been presented so far (0-based).
// hasFailure = command has been failed at least once.
export function shouldShowSolution(
  guidedMode: GuidedMode,
  occurrenceIndex: number,
  hasFailure: boolean,
  isVerification: boolean
): boolean {
  if (isVerification) return false  // verification challenges are always blind
  switch (guidedMode) {
    case 'none':               return false
    case 'all':                return true
    case 'first_only':         return occurrenceIndex === 0
    case 'alternating':        return occurrenceIndex % 2 === 0
    case 'after_failure':      return hasFailure
    case 'first_then_failure': return occurrenceIndex === 0 || hasFailure
    default:                   return false
  }
}

export function pickNextCommand(
  commands: VimCommandData[],
  targetLevel: number,
  activeCommandIds: Set<string>,
  progress: LevelProgress,
  repetitionTarget: number,
  pendingVerifications: string[]
): VimCommandData | null {
  // Prioritise pending verification challenges (blind follow-ups after guided)
  if (pendingVerifications.length > 0) {
    const verifyId = pendingVerifications[0]
    const cmd = commands.find(c => c.id === verifyId && !activeCommandIds.has(c.id))
    if (cmd) return cmd
  }

  const notActive = commands.filter(c => !activeCommandIds.has(c.id))

  const getCount = (c: VimCommandData) =>
    progress[c.level]?.completionCounts?.get(c.id) ?? 0

  const atTargetLevel = notActive.filter(c => c.level === targetLevel)

  // Prefer target level, below repetition target
  const targetBelowRep = atTargetLevel.filter(c => getCount(c) < repetitionTarget)
  if (targetBelowRep.length > 0) {
    const minCount = Math.min(...targetBelowRep.map(getCount))
    const leastDone = targetBelowRep.filter(c => getCount(c) === minCount)
    return leastDone[Math.floor(Math.random() * leastDone.length)]
  }

  // Target level, any (all already met repetition target)
  if (atTargetLevel.length > 0) {
    return atTargetLevel[Math.floor(Math.random() * atTargetLevel.length)]
  }

  // Fallback: any level, below repetition target
  const anyBelowRep = notActive.filter(c => getCount(c) < repetitionTarget)
  if (anyBelowRep.length > 0) {
    const minCount = Math.min(...anyBelowRep.map(getCount))
    const leastDone = anyBelowRep.filter(c => getCount(c) === minCount)
    return leastDone[Math.floor(Math.random() * leastDone.length)]
  }

  return notActive.length > 0
    ? notActive[Math.floor(Math.random() * notActive.length)]
    : null
}
