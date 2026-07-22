import { describe, it, expect } from 'vitest'
import type { VimCommandData, LevelProgress, GuidedMode } from '../types'
import {
  shouldShowSolution,
  pickChallengeLevel,
  getWarmupCount,
  shouldIncreaseConcurrent,
  getLevelCompletion,
  tryAdvanceCeiling,
  pickNextCommand,
  CEILING_ADVANCE_THRESHOLD,
} from '../LevelEngine'

// ── helpers ───────────────────────────────────────────────────────────────────

function cmd(id: string, level: number): VimCommandData {
  return { id, level, category: 'Motion', question: 'q', solution: [id] }
}

function emptyProg(): LevelProgress[number] {
  return { seen: new Set(), completionCounts: new Map(), failureCounts: new Map() }
}

function prog(completions: Record<string, number> = {}, failures: Record<string, number> = {}): LevelProgress[number] {
  return {
    seen: new Set(Object.keys(completions)),
    completionCounts: new Map(Object.entries(completions)),
    failureCounts: new Map(Object.entries(failures)),
  }
}

// ── shouldShowSolution ────────────────────────────────────────────────────────

describe('shouldShowSolution', () => {
  const MODES: GuidedMode[] = ['none', 'all', 'first_only', 'alternating', 'after_failure', 'first_then_failure']

  it('is_verification → always false regardless of mode', () => {
    for (const mode of MODES) {
      expect(shouldShowSolution(mode, 0, true, true), `mode=${mode}`).toBe(false)
    }
  })

  it('none → never show', () => {
    expect(shouldShowSolution('none', 0, false, false)).toBe(false)
    expect(shouldShowSolution('none', 0, true,  false)).toBe(false)
    expect(shouldShowSolution('none', 5, true,  false)).toBe(false)
  })

  it('all → always show', () => {
    expect(shouldShowSolution('all', 0, false, false)).toBe(true)
    expect(shouldShowSolution('all', 5, true,  false)).toBe(true)
  })

  it('first_only → show only on occurrence 0', () => {
    expect(shouldShowSolution('first_only', 0, false, false)).toBe(true)
    expect(shouldShowSolution('first_only', 1, false, false)).toBe(false)
    expect(shouldShowSolution('first_only', 5, false, false)).toBe(false)
  })

  it('alternating → show on even occurrences', () => {
    expect(shouldShowSolution('alternating', 0, false, false)).toBe(true)
    expect(shouldShowSolution('alternating', 1, false, false)).toBe(false)
    expect(shouldShowSolution('alternating', 2, false, false)).toBe(true)
    expect(shouldShowSolution('alternating', 3, false, false)).toBe(false)
  })

  it('after_failure → false without failure, true with failure', () => {
    expect(shouldShowSolution('after_failure', 0, false, false)).toBe(false)
    expect(shouldShowSolution('after_failure', 0, true,  false)).toBe(true)
    expect(shouldShowSolution('after_failure', 5, true,  false)).toBe(true)
  })

  it('first_then_failure → true on first OR after failure', () => {
    expect(shouldShowSolution('first_then_failure', 0, false, false)).toBe(true)  // first
    expect(shouldShowSolution('first_then_failure', 1, false, false)).toBe(false) // not first, no fail
    expect(shouldShowSolution('first_then_failure', 1, true,  false)).toBe(true)  // failure
    expect(shouldShowSolution('first_then_failure', 3, true,  false)).toBe(true)  // failure
  })
})

// ── pickChallengeLevel ────────────────────────────────────────────────────────

describe('pickChallengeLevel', () => {
  it('warmup_remaining > 0 always returns 0', () => {
    for (let wr = 1; wr <= 3; wr++) {
      for (let i = 0; i < 20; i++) {
        expect(pickChallengeLevel(5, wr), `wr=${wr}`).toBe(0)
      }
    }
  })

  it('ceiling = 0 always returns 0', () => {
    for (let i = 0; i < 20; i++) {
      expect(pickChallengeLevel(0, 0)).toBe(0)
    }
  })

  it('returns a value in [0, ceiling]', () => {
    for (let i = 0; i < 100; i++) {
      const v = pickChallengeLevel(5, 0)
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThanOrEqual(5)
    }
  })
})

// ── getWarmupCount ────────────────────────────────────────────────────────────

describe('getWarmupCount', () => {
  it.each<[number, number]>([
    [0, 3], [1, 3],
    [2, 2], [3, 2], [4, 2],
    [5, 1], [6, 1], [9, 1],
  ])('level %i → %i warmups', (level, expected) => {
    expect(getWarmupCount(level)).toBe(expected)
  })
})

// ── shouldIncreaseConcurrent ──────────────────────────────────────────────────

describe('shouldIncreaseConcurrent', () => {
  it('at or above cap (4) → false', () => {
    expect(shouldIncreaseConcurrent(10, 4)).toBe(false)
    expect(shouldIncreaseConcurrent(10, 5)).toBe(false)
  })

  it('completed = 0 → false', () => {
    expect(shouldIncreaseConcurrent(0, 1)).toBe(false)
  })

  it('multiples of 10 below cap → true', () => {
    expect(shouldIncreaseConcurrent(10, 1)).toBe(true)
    expect(shouldIncreaseConcurrent(20, 2)).toBe(true)
    expect(shouldIncreaseConcurrent(30, 3)).toBe(true)
  })

  it('non-multiples of 10 → false', () => {
    for (const n of [1, 9, 11, 19, 21]) {
      expect(shouldIncreaseConcurrent(n, 1), `completed=${n}`).toBe(false)
    }
  })
})

// ── getLevelCompletion ────────────────────────────────────────────────────────

describe('getLevelCompletion', () => {
  const cmdsAtLv2 = [cmd('a', 2), cmd('b', 2), cmd('c', 2), cmd('d', 2)]

  it('no commands at level → 1.0', () => {
    expect(getLevelCompletion(5, {}, [], 1)).toBe(1.0)
  })

  it('zero completions → 0.0', () => {
    expect(getLevelCompletion(2, { 2: emptyProg() }, cmdsAtLv2, 1)).toBe(0.0)
  })

  it('all commands met rep target → 1.0', () => {
    const lp: LevelProgress = {
      2: prog({ a: 2, b: 2, c: 2, d: 2 }),
    }
    expect(getLevelCompletion(2, lp, cmdsAtLv2, 2)).toBe(1.0)
  })

  it('half met → 0.5', () => {
    const lp: LevelProgress = { 2: prog({ a: 1, b: 1 }) }
    expect(getLevelCompletion(2, lp, cmdsAtLv2, 1)).toBe(0.5)
  })

  it('below rep target not counted', () => {
    const lp: LevelProgress = { 0: prog({ a: 1 }) }
    const cmds = [cmd('a', 0)]
    expect(getLevelCompletion(0, lp, cmds, 3)).toBe(0.0) // 1 < 3
  })

  it('ignores commands at other levels', () => {
    const lp: LevelProgress = { 1: prog({ a: 1 }) }
    const cmds = [cmd('a', 1), cmd('b', 2)]
    expect(getLevelCompletion(2, lp, cmds, 1)).toBe(0.0)
  })
})

// ── tryAdvanceCeiling ─────────────────────────────────────────────────────────

describe('tryAdvanceCeiling', () => {
  it('stays when below threshold', () => {
    // 5/8 = 62.5% < 75%
    const cmds = [1,2,3,4,5,6,7,8].map(i => cmd('c'+i, 2))
    const lp: LevelProgress = { 2: prog({ c1:1,c2:1,c3:1,c4:1,c5:1 }) }
    expect(tryAdvanceCeiling(2, lp, cmds, 1)).toBe(2)
  })

  it('advances at threshold', () => {
    // 3/4 = 75% = threshold
    const cmds = [1,2,3,4].map(i => cmd('c'+i, 2))
    const lp: LevelProgress = { 2: prog({ c1:1, c2:1, c3:1 }) }
    expect(tryAdvanceCeiling(2, lp, cmds, 1)).toBe(3)
  })

  it('caps at 9', () => {
    const cmds = [cmd('x', 9)]
    const lp: LevelProgress = { 9: prog({ x: 1 }) }
    expect(tryAdvanceCeiling(9, lp, cmds, 1)).toBe(9)
  })

  it('respects repetition target', () => {
    const cmds = [cmd('x', 3)]
    const lp1: LevelProgress = { 3: prog({ x: 1 }) }
    expect(tryAdvanceCeiling(3, lp1, cmds, 2)).toBe(3) // 1 < 2 → not met

    const lp2: LevelProgress = { 3: prog({ x: 2 }) }
    expect(tryAdvanceCeiling(3, lp2, cmds, 2)).toBe(4) // 2 = 2 → met
  })

  it('threshold constant is 0.75', () => {
    expect(CEILING_ADVANCE_THRESHOLD).toBe(0.75)
  })
})

// ── pickNextCommand ───────────────────────────────────────────────────────────

describe('pickNextCommand', () => {
  it('returns null when all commands are active', () => {
    const cmds = [cmd('c1', 0)]
    expect(pickNextCommand(cmds, 0, new Set(['c1']), {}, 1, [])).toBeNull()
  })

  it('picks at target level', () => {
    const cmds = [cmd('c1', 0), cmd('c2', 1), cmd('c3', 2)]
    const result = pickNextCommand(cmds, 1, new Set(), {}, 1, [])
    expect(result?.level).toBe(1)
  })

  it('falls back to other levels when target level exhausted', () => {
    const cmds = [cmd('c1', 2), cmd('c2', 2)]
    const result = pickNextCommand(cmds, 0, new Set(), {}, 1, [])
    expect(result).not.toBeNull()
  })

  it('prefers commands below rep target', () => {
    const cmds = [cmd('c1', 0), cmd('c2', 0)]
    // c2 has 3 completions (met target 2), c1 has 0 → must pick c1
    const lp: LevelProgress = { 0: prog({ c2: 3 }) }
    const result = pickNextCommand(cmds, 0, new Set(), lp, 2, [])
    expect(result?.id).toBe('c1')
  })

  it('pending verification takes priority', () => {
    const cmds = [cmd('c1', 0), cmd('c2', 1)]
    const result = pickNextCommand(cmds, 1, new Set(), {}, 1, ['c1'])
    expect(result?.id).toBe('c1')
  })

  it('respects active_ids exclusion', () => {
    const cmds = [cmd('c1', 0), cmd('c2', 0)]
    const result = pickNextCommand(cmds, 0, new Set(['c1']), {}, 1, [])
    expect(result?.id).toBe('c2')
  })

  it('prefers least-completed command within below-target group', () => {
    // c1: 0 completions, c2: 1 completion, both below target 3
    const cmds = [cmd('c1', 0), cmd('c2', 0)]
    const lp: LevelProgress = { 0: prog({ c2: 1 }) }
    // run many times — c1 (0) should always be preferred over c2 (1)
    for (let i = 0; i < 20; i++) {
      const r = pickNextCommand(cmds, 0, new Set(), lp, 3, [])
      expect(r?.id).toBe('c1')
    }
  })
})
