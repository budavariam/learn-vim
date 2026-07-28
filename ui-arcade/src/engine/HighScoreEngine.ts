import type {
  GameState,
  HighScoreEntry,
  HighScores,
  GameMode,
  MotionRaceHighScoreEntry,
  GoalModeHighScoreEntry,
  VimBotsHighScoreEntry,
} from './types'
import { loadUsername } from './UserPrefs'
import { STORAGE_KEYS } from './storageKeys'

const MAX_PER_MODE = 10

export function emptyHighScores(): HighScores {
  return {
    general: [],
    timed_challenge: [],
    survival: [],
    motionrace_timed: [],
    motionrace_survival: [],
    motionrace_total_goals: [],
    goal: [],
    vimbots: [],
  }
}

export function loadHighScores(): HighScores {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HIGH_SCORES)
    if (!raw) return emptyHighScores()
    const parsed = JSON.parse(raw) as HighScores
    return {
      general: parsed.general ?? [],
      timed_challenge: parsed.timed_challenge ?? [],
      survival: parsed.survival ?? [],
      motionrace_timed: parsed.motionrace_timed ?? [],
      motionrace_survival: parsed.motionrace_survival ?? [],
      motionrace_total_goals: parsed.motionrace_total_goals ?? [],
      goal: parsed.goal ?? [],
      vimbots: parsed.vimbots ?? [],
    }
  } catch {
    return emptyHighScores()
  }
}

export function saveHighScores(scores: HighScores): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HIGH_SCORES, JSON.stringify(scores))
  } catch {
    /* ignore quota errors */
  }
}

function sortKey(mode: GameMode, a: HighScoreEntry, b: HighScoreEntry): number {
  if (mode === 'survival') {
    // longest survival wins; break ties by score
    const diff = b.achievedTimeMs - a.achievedTimeMs
    return diff !== 0 ? diff : b.score - a.score
  }
  return b.score - a.score
}

export function addHighScore(scores: HighScores, entry: HighScoreEntry): HighScores {
  const list = [...(scores[entry.mode] ?? []), entry]
    .sort((a, b) => sortKey(entry.mode, a, b))
    .slice(0, MAX_PER_MODE)
  return { ...scores, [entry.mode]: list }
}

export function buildHighScoreEntry(state: GameState): HighScoreEntry {
  const stats = state.sessionStats
  const accuracy = stats.totalChallenges > 0 ? stats.completed / stats.totalChallenges : 0
  return {
    id: crypto.randomUUID(),
    username: loadUsername(),
    timestamp: Date.now(),
    score: state.score,
    mode: state.config.mode,
    language: state.config.language,
    startingLevel: state.config.startingLevel,
    repetitionTarget: state.config.repetitionTarget,
    guidedMode: state.liveSettings.guidedMode,
    challengesCompleted: stats.completed,
    challengesFailed: stats.failed,
    accuracy,
    sessionDurationMs: state.sessionElapsedMs,
    expectedTimeMs: stats.expectedTimeMs,
    achievedTimeMs: stats.achievedTimeMs,
  }
}

export function addMotionRaceHighScore(
  scores: HighScores,
  entry: MotionRaceHighScoreEntry
): HighScores {
  const key = `motionrace_${entry.endGoal}` as keyof HighScores
  const list = [...((scores[key] as MotionRaceHighScoreEntry[]) ?? []), entry]

  list.sort((a, b) => {
    if (entry.endGoal === 'survival') {
      const diff = b.sessionDurationMs - a.sessionDurationMs
      return diff !== 0 ? diff : b.score - a.score
    }
    if (entry.endGoal === 'total_goals') {
      const diff = a.sessionDurationMs - b.sessionDurationMs // lower time is better
      return diff !== 0 ? diff : b.score - a.score
    }
    // timed
    return b.score - a.score
  })

  return { ...scores, [key]: list.slice(0, MAX_PER_MODE) }
}

export function addGoalModeHighScore(
  scores: HighScores,
  entry: GoalModeHighScoreEntry
): HighScores {
  const list = [...(scores.goal ?? []), entry]
  list.sort((a, b) => b.totalPoints - a.totalPoints)
  return { ...scores, goal: list.slice(0, MAX_PER_MODE) }
}

export function addVimBotsHighScore(scores: HighScores, entry: VimBotsHighScoreEntry): HighScores {
  const list = [...(scores.vimbots ?? []), entry]
  list.sort((a, b) => b.totalScore - a.totalScore || b.levelsCleared - a.levelsCleared)
  return { ...scores, vimbots: list.slice(0, 10) }
}
