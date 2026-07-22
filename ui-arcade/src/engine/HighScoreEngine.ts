import type { GameState, HighScoreEntry, HighScores, GameMode } from './types'

const STORAGE_KEY = 'vim_arcade_high_scores'
const MAX_PER_MODE = 10

export function emptyHighScores(): HighScores {
  return { general: [], timed_challenge: [], survival: [] }
}

export function loadHighScores(): HighScores {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyHighScores()
    const parsed = JSON.parse(raw) as HighScores
    // ensure all three keys exist
    return {
      general: parsed.general ?? [],
      timed_challenge: parsed.timed_challenge ?? [],
      survival: parsed.survival ?? [],
    }
  } catch {
    return emptyHighScores()
  }
}

export function saveHighScores(scores: HighScores): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores))
  } catch {
    // ignore quota errors
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
