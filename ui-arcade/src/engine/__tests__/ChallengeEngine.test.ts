import { describe, it, expect, beforeEach } from 'vitest'
import type { GameConfig, GameState, VimCommandData } from '../types'
import { initGameState, handleCommandExecuted, tick } from '../ChallengeEngine'

// ── fixtures ──────────────────────────────────────────────────────────────────

function cmd(id: string, level: number, solution: string[] = [id]): VimCommandData {
  return { id, level, category: 'Motion', question: 'q ' + id, solution }
}

const CMDS: VimCommandData[] = [
  cmd('c1', 0, ['h']),
  cmd('c2', 0, ['j']),
  cmd('c3', 0, ['k']),
  cmd('c4', 1, ['G']),
  cmd('c5', 1, ['dd']),
  cmd('c6', 2, ['dw']),
]

function cfg(overrides: Partial<GameConfig> = {}): GameConfig {
  return {
    mode: 'general',
    language: 'go',
    startingLevel: 0,
    repetitionTarget: 1,
    guidedMode: 'none',
    categories: null,
    dynamicAssist: null,
    knowledgeFilter: 'all',
    ...overrides,
  }
}

// ── initGameState ─────────────────────────────────────────────────────────────

describe('initGameState', () => {
  it('returns warmup status when startingLevel ≤1 (3 warmup challenges expected)', () => {
    const state = initGameState(cfg({ startingLevel: 0 }), CMDS)
    expect(state.status).toBe('warmup')
  })

  it('returns warmup status for startingLevel 5 (1 warmup)', () => {
    const state = initGameState(cfg({ startingLevel: 5 }), CMDS)
    expect(state.status).toBe('warmup')
  })

  it('ceiling equals startingLevel (capped at 9)', () => {
    expect(initGameState(cfg({ startingLevel: 3 }), CMDS).ceiling).toBe(3)
    expect(initGameState(cfg({ startingLevel: 9 }), CMDS).ceiling).toBe(9)
  })

  it('initialises score, combo to zero', () => {
    const state = initGameState(cfg(), CMDS)
    expect(state.score).toBe(0)
    expect(state.combo.count).toBe(0)
    expect(state.combo.multiplier).toBe(1.0)
  })

  it('initialises levelProgress for all command levels', () => {
    const state = initGameState(cfg(), CMDS)
    // levels 0, 1, 2 exist in CMDS
    expect(state.levelProgress[0]).toBeDefined()
    expect(state.levelProgress[1]).toBeDefined()
    expect(state.levelProgress[2]).toBeDefined()
  })

  it('liveSettings uses config guidedMode', () => {
    const state = initGameState(cfg({ guidedMode: 'all' }), CMDS)
    expect(state.liveSettings.guidedMode).toBe('all')
  })

  it('survival and timed_challenge also start in warmup', () => {
    for (const mode of ['survival', 'timed_challenge'] as const) {
      const state = initGameState(cfg({ mode }), CMDS)
      expect(state.status).toBe('warmup')
    }
  })
})

// ── handleCommandExecuted ─────────────────────────────────────────────────────

describe('handleCommandExecuted', () => {
  let state: GameState

  beforeEach(() => {
    // Start with a known challenge active
    state = initGameState(cfg(), CMDS)
    // Manually inject a challenge for a predictable test
    state = {
      ...state,
      activeChallenges: [{
        id: 'ch1',
        commandId: 'c1',
        level: 0,
        category: 'Motion',
        question: 'move left',
        solution: ['h'],
        startedAt: Date.now() - 500,  // 500ms elapsed → 'fast' (50% of 10s)
        timeLimit: 10_000,
        status: 'active',
        pointsEarned: 0,
        showSolution: false,
        isVerification: false,
      }],
    }
  })

  it('no match → state unchanged', () => {
    const next = handleCommandExecuted(state, 'x', CMDS, Date.now())
    expect(next.score).toBe(0)
    expect(next.combo.count).toBe(0)
    expect(next.activeChallenges[0].status).toBe('active')
  })

  it('matching command → challenge marked completed', () => {
    const next = handleCommandExecuted(state, 'h', CMDS, Date.now())
    expect(next.activeChallenges[0].status).toBe('completed')
  })

  it('matching command → score increases', () => {
    const next = handleCommandExecuted(state, 'h', CMDS, Date.now())
    expect(next.score).toBeGreaterThan(0)
  })

  it('matching command → combo count increments', () => {
    const next = handleCommandExecuted(state, 'h', CMDS, Date.now())
    expect(next.combo.count).toBe(1)
  })

  it('consecutive matches grow the combo', () => {
    let s = state
    // Add two more challenges
    s = {
      ...s,
      activeChallenges: [
        ...s.activeChallenges,
        { id: 'ch2', commandId: 'c2', level: 0, category: 'Motion', question: 'q', solution: ['j'],
          startedAt: Date.now(), timeLimit: 10_000, status: 'active', pointsEarned: 0,
          showSolution: false, isVerification: false },
        { id: 'ch3', commandId: 'c3', level: 0, category: 'Motion', question: 'q', solution: ['k'],
          startedAt: Date.now(), timeLimit: 10_000, status: 'active', pointsEarned: 0,
          showSolution: false, isVerification: false },
      ],
    }
    const now = Date.now()
    s = handleCommandExecuted(s, 'h', CMDS, now)
    s = handleCommandExecuted(s, 'j', CMDS, now)
    s = handleCommandExecuted(s, 'k', CMDS, now)
    expect(s.combo.count).toBe(3)
    expect(s.combo.multiplier).toBe(1.5) // 3-combo threshold
  })

  it('guided challenge earns fewer points than blind', () => {
    const guidedState = {
      ...state,
      activeChallenges: [{
        ...state.activeChallenges[0],
        showSolution: true,
      }],
    }
    const blindNext  = handleCommandExecuted(state,       'h', CMDS, Date.now())
    const guidedNext = handleCommandExecuted(guidedState, 'h', CMDS, Date.now())
    expect(guidedNext.score).toBeLessThan(blindNext.score)
  })

  it('completionCounts updated in levelProgress', () => {
    const next = handleCommandExecuted(state, 'h', CMDS, Date.now())
    expect(next.levelProgress[0]?.completionCounts.get('c1')).toBe(1)
  })

  it('schedules verification for first_only guided mode', () => {
    const guidedState: GameState = {
      ...state,
      liveSettings: { guidedMode: 'first_only' },
      activeChallenges: [{
        ...state.activeChallenges[0],
        showSolution: true,
        isVerification: false,
      }],
    }
    const next = handleCommandExecuted(guidedState, 'h', CMDS, Date.now())
    expect(next.pendingVerifications).toContain('c1')
  })

  it('warmup transitions to playing after warmup count completions', () => {
    let s = initGameState(cfg({ startingLevel: 5 }), CMDS) // 1 warmup challenge
    s = {
      ...s,
      activeChallenges: [{
        id: 'w1', commandId: 'c1', level: 0, category: 'Motion', question: 'q',
        solution: ['h'], startedAt: Date.now(), timeLimit: 10_000,
        status: 'active', pointsEarned: 0, showSolution: false, isVerification: false,
      }],
      sessionStats: { ...s.sessionStats, completed: 0 },
    }
    const next = handleCommandExecuted(s, 'h', CMDS, Date.now())
    expect(next.status).toBe('playing')
  })
})

// ── tick ──────────────────────────────────────────────────────────────────────

describe('tick', () => {
  it('does nothing in setup/results/paused', () => {
    for (const status of ['setup', 'results', 'paused'] as const) {
      const s = { ...initGameState(cfg(), CMDS), status }
      const next = tick(s, CMDS, Date.now())
      expect(next).toBe(s) // same reference — untouched
    }
  })

  it('expires a timed-out active challenge', () => {
    let s = initGameState(cfg(), CMDS)
    const now = Date.now()
    s = {
      ...s,
      status: 'playing',
      activeChallenges: [{
        id: 'ch1', commandId: 'c1', level: 0, category: 'Motion', question: 'q',
        solution: ['h'], startedAt: now - 15_000, timeLimit: 10_000,
        status: 'active', pointsEarned: 0, showSolution: false, isVerification: false,
      }],
    }
    const next = tick(s, CMDS, now)
    const ch = next.activeChallenges.find(c => c.id === 'ch1')
    expect(ch?.status).toBe('failed')
  })

  it('failure resets combo', () => {
    let s = initGameState(cfg(), CMDS)
    const now = Date.now()
    s = {
      ...s,
      status: 'playing',
      combo: { count: 5, multiplier: 2.0 },
      activeChallenges: [{
        id: 'ch1', commandId: 'c1', level: 0, category: 'Motion', question: 'q',
        solution: ['h'], startedAt: now - 15_000, timeLimit: 10_000,
        status: 'active', pointsEarned: 0, showSolution: false, isVerification: false,
      }],
    }
    const next = tick(s, CMDS, now)
    expect(next.combo.count).toBe(0)
    expect(next.combo.multiplier).toBe(1.0)
  })

  it('survival ends game on first failure', () => {
    let s = initGameState(cfg({ mode: 'survival' }), CMDS)
    const now = Date.now()
    s = {
      ...s,
      status: 'playing',
      activeChallenges: [{
        id: 'ch1', commandId: 'c1', level: 0, category: 'Motion', question: 'q',
        solution: ['h'], startedAt: now - 20_000, timeLimit: 10_000,
        status: 'active', pointsEarned: 0, showSolution: false, isVerification: false,
      }],
    }
    const next = tick(s, CMDS, now)
    expect(next.status).toBe('results')
  })

  it('timed_challenge ends when session duration reached', () => {
    let s = initGameState(cfg({ mode: 'timed_challenge', timedDurationMs: 60_000 }), CMDS)
    s = {
      ...s,
      status: 'playing',
      activeChallenges: [],
    }
    // Simulate that 61s have elapsed since session start
    const now = s.sessionStats.startedAt + 61_000
    const next = tick(s, CMDS, now)
    expect(next.status).toBe('results')
  })

  it('timed_challenge does not end before duration', () => {
    let s = initGameState(cfg({ mode: 'timed_challenge', timedDurationMs: 60_000 }), CMDS)
    s = { ...s, status: 'playing', activeChallenges: [] }
    const now = s.sessionStats.startedAt + 30_000  // only 30s in
    const next = tick(s, CMDS, now)
    expect(next.status).not.toBe('results')
  })

  it('fills empty slots up to maxConcurrent', () => {
    let s = initGameState(cfg(), CMDS)
    s = { ...s, status: 'playing', activeChallenges: [], maxConcurrent: 2 }
    const next = tick(s, CMDS, Date.now())
    const active = next.activeChallenges.filter(c => c.status === 'active')
    expect(active.length).toBe(2)
  })

  it('does not fill beyond maxConcurrent', () => {
    let s = initGameState(cfg(), CMDS)
    s = { ...s, status: 'playing', maxConcurrent: 1 }
    // already has one active challenge
    s.activeChallenges = [{
      id: 'existing', commandId: 'c1', level: 0, category: 'Motion', question: 'q',
      solution: ['h'], startedAt: Date.now(), timeLimit: 10_000,
      status: 'active', pointsEarned: 0, showSolution: false, isVerification: false,
    }]
    const next = tick(s, CMDS, Date.now())
    const active = next.activeChallenges.filter(c => c.status === 'active')
    expect(active.length).toBe(1)
  })
})
