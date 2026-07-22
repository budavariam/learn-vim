import { describe, it, expect, beforeEach } from 'vitest'
import type { GameState, HighScoreEntry, HighScores } from '../types'
import {
  emptyHighScores,
  loadHighScores,
  saveHighScores,
  addHighScore,
  buildHighScoreEntry,
} from '../HighScoreEngine'

// ── helpers ───────────────────────────────────────────────────────────────────

function entry(overrides: Partial<HighScoreEntry> = {}): HighScoreEntry {
  return {
    id: 'e1',
    timestamp: 1_700_000_000,
    score: 500,
    mode: 'general',
    language: 'go',
    startingLevel: 0,
    repetitionTarget: 1,
    guidedMode: 'none',
    challengesCompleted: 10,
    challengesFailed: 2,
    accuracy: 0.83,
    sessionDurationMs: 60_000,
    expectedTimeMs: 0,
    achievedTimeMs: 0,
    ...overrides,
  }
}

beforeEach(() => {
  localStorage.clear()
})

// ── emptyHighScores ───────────────────────────────────────────────────────────

describe('emptyHighScores', () => {
  it('has three empty arrays', () => {
    const s = emptyHighScores()
    expect(s.general).toEqual([])
    expect(s.timed_challenge).toEqual([])
    expect(s.survival).toEqual([])
  })
})

// ── loadHighScores ────────────────────────────────────────────────────────────

describe('loadHighScores', () => {
  it('returns empty scores when localStorage is empty', () => {
    const scores = loadHighScores()
    expect(scores.general).toEqual([])
    expect(scores.timed_challenge).toEqual([])
    expect(scores.survival).toEqual([])
  })

  it('returns empty scores when localStorage has invalid JSON', () => {
    localStorage.setItem('vim_arcade_high_scores', 'not-json')
    const scores = loadHighScores()
    expect(scores.general).toEqual([])
  })

  it('returns stored data on roundtrip', () => {
    const stored: HighScores = {
      general: [entry({ id: 'x', score: 999 })],
      timed_challenge: [],
      survival: [],
    }
    localStorage.setItem('vim_arcade_high_scores', JSON.stringify(stored))
    const loaded = loadHighScores()
    expect(loaded.general[0].id).toBe('x')
    expect(loaded.general[0].score).toBe(999)
  })

  it('fills missing mode arrays with []', () => {
    localStorage.setItem('vim_arcade_high_scores', JSON.stringify({ general: [] }))
    const scores = loadHighScores()
    expect(Array.isArray(scores.timed_challenge)).toBe(true)
    expect(Array.isArray(scores.survival)).toBe(true)
  })
})

// ── saveHighScores / loadHighScores roundtrip ─────────────────────────────────

describe('saveHighScores', () => {
  it('persists to localStorage and is retrievable', () => {
    const scores: HighScores = {
      general: [entry({ id: 'save-test', score: 1234 })],
      timed_challenge: [],
      survival: [],
    }
    saveHighScores(scores)
    const loaded = loadHighScores()
    expect(loaded.general[0].id).toBe('save-test')
  })
})

// ── addHighScore ──────────────────────────────────────────────────────────────

describe('addHighScore', () => {
  it('adds an entry to the correct mode', () => {
    const scores = emptyHighScores()
    const next   = addHighScore(scores, entry({ mode: 'general', id: 'g1' }))
    expect(next.general.length).toBe(1)
    expect(next.timed_challenge.length).toBe(0)
    expect(next.survival.length).toBe(0)
  })

  it('general/timed sorted by score descending', () => {
    let scores = emptyHighScores()
    scores = addHighScore(scores, entry({ score: 100 }))
    scores = addHighScore(scores, entry({ score: 500 }))
    scores = addHighScore(scores, entry({ score: 300 }))
    expect(scores.general[0].score).toBe(500)
    expect(scores.general[1].score).toBe(300)
    expect(scores.general[2].score).toBe(100)
  })

  it('survival sorted by achievedTimeMs descending', () => {
    let scores = emptyHighScores()
    scores = addHighScore(scores, entry({ mode: 'survival', id: 's1', achievedTimeMs: 4000 }))
    scores = addHighScore(scores, entry({ mode: 'survival', id: 's2', achievedTimeMs: 9000 }))
    scores = addHighScore(scores, entry({ mode: 'survival', id: 's3', achievedTimeMs: 6000 }))
    expect(scores.survival[0].achievedTimeMs).toBe(9000)
    expect(scores.survival[1].achievedTimeMs).toBe(6000)
    expect(scores.survival[2].achievedTimeMs).toBe(4000)
  })

  it('caps at 10 entries per mode', () => {
    let scores = emptyHighScores()
    for (let i = 0; i < 12; i++) {
      scores = addHighScore(scores, entry({ id: 'e' + i, score: i * 10 }))
    }
    expect(scores.general.length).toBe(10)
    // Should keep the highest 10 (scores 110 down to 20)
    expect(scores.general[0].score).toBe(110)
  })

  it('does not mutate the original scores object', () => {
    const original = emptyHighScores()
    addHighScore(original, entry())
    expect(original.general.length).toBe(0)
  })

  it('modes are isolated — timed_challenge entry does not appear in general', () => {
    let scores = emptyHighScores()
    scores = addHighScore(scores, entry({ mode: 'timed_challenge', id: 'tc1' }))
    expect(scores.general.length).toBe(0)
    expect(scores.timed_challenge.length).toBe(1)
  })
})

// ── buildHighScoreEntry ────────────────────────────────────────────────────────

describe('buildHighScoreEntry', () => {
  function makeState(overrides: Partial<GameState> = {}): GameState {
    const base: GameState = {
      status: 'results',
      config: {
        mode: 'general', language: 'go', startingLevel: 2,
        repetitionTarget: 2, guidedMode: 'first_only',
        categories: null, dynamicAssist: null, knowledgeFilter: 'all',
      },
      liveSettings: { guidedMode: 'none' },
      language: 'go',
      startingLevel: 2,
      activeChallenges: [],
      maxConcurrent: 2,
      ceiling: 3,
      score: 1500,
      combo: { count: 0, multiplier: 1.0 },
      levelProgress: {},
      sessionStats: {
        totalChallenges: 20,
        completed: 18,
        failed: 2,
        totalPoints: 1500,
        bestCombo: 7,
        startedAt: Date.now() - 90_000,
        expectedTimeMs: 200_000,
        achievedTimeMs: 0,
      },
      recentNotifications: [],
      levelPct: 60,
      sessionElapsedMs: 90_000,
      pendingVerifications: [],
    }
    return { ...base, ...overrides }
  }

  it('maps score correctly', () => {
    const e = buildHighScoreEntry(makeState())
    expect(e.score).toBe(1500)
  })

  it('computes accuracy from sessionStats', () => {
    const e = buildHighScoreEntry(makeState())
    expect(e.accuracy).toBeCloseTo(18 / 20)
  })

  it('accuracy is 0 when totalChallenges is 0', () => {
    const s = makeState()
    s.sessionStats.totalChallenges = 0
    expect(buildHighScoreEntry(s).accuracy).toBe(0)
  })

  it('carries config fields', () => {
    const e = buildHighScoreEntry(makeState())
    expect(e.mode).toBe('general')
    expect(e.language).toBe('go')
    expect(e.startingLevel).toBe(2)
    expect(e.repetitionTarget).toBe(2)
  })

  it('uses liveSettings.guidedMode (may differ from config.guidedMode)', () => {
    const s = makeState()
    s.liveSettings.guidedMode = 'all'
    const e = buildHighScoreEntry(s)
    expect(e.guidedMode).toBe('all')
  })

  it('survivalAchievedTimeMs carried from sessionStats', () => {
    const s = makeState()
    s.sessionStats.achievedTimeMs = 45_000
    const e = buildHighScoreEntry(s)
    expect(e.achievedTimeMs).toBe(45_000)
  })

  it('generates a unique id on each call', () => {
    const s = makeState()
    const e1 = buildHighScoreEntry(s)
    const e2 = buildHighScoreEntry(s)
    expect(e1.id).not.toBe(e2.id)
  })
})
