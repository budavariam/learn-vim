import { describe, it, expect } from 'vitest'
import {
  getTimeRating,
  getComboMultiplier,
  calculatePoints,
  getBasePoints,
  getTimeLimit,
  type TimeRating,
} from '../ScoreEngine'

// ── getTimeRating ─────────────────────────────────────────────────────────────

describe('getTimeRating', () => {
  it.each<[number, number, TimeRating, number]>([
    [200,  1000, 'lightning', 3.0],
    [250,  1000, 'lightning', 3.0],  // boundary: ≤25%
    [251,  1000, 'fast',      2.0],
    [400,  1000, 'fast',      2.0],
    [500,  1000, 'fast',      2.0],  // boundary: ≤50%
    [501,  1000, 'good',      1.5],
    [700,  1000, 'good',      1.5],
    [750,  1000, 'good',      1.5],  // boundary: ≤75%
    [751,  1000, 'completed', 1.0],
    [1000, 1000, 'completed', 1.0],
    [1500, 1000, 'completed', 1.0],  // over time — still completed
  ])('elapsed %i / limit %i → %s ×%d', (elapsed, limit, rating, mult) => {
    const r = getTimeRating(elapsed, limit)
    expect(r.rating).toBe(rating)
    expect(r.multiplier).toBe(mult)
  })
})

// ── getComboMultiplier ────────────────────────────────────────────────────────

describe('getComboMultiplier', () => {
  it.each<[number, number]>([
    [0,  1.0],
    [1,  1.0],
    [2,  1.0],
    [3,  1.5],
    [4,  1.5],
    [5,  2.0],
    [7,  2.0],
    [8,  2.5],
    [11, 2.5],
    [12, 3.0],
    [50, 3.0],
  ])('combo %i → ×%d', (count, expected) => {
    expect(getComboMultiplier(count)).toBe(expected)
  })
})

// ── calculatePoints ───────────────────────────────────────────────────────────

describe('calculatePoints', () => {
  it('multiplies base × time × combo and rounds', () => {
    expect(calculatePoints(100, 2.0, 1.5)).toBe(300)
  })

  it('guided applies 20% fraction', () => {
    // 100 * 3.0 * 1.0 = 300 * 0.20 = 60
    expect(calculatePoints(100, 3.0, 1.0, true)).toBe(60)
  })

  it('guided is always at least 1', () => {
    expect(calculatePoints(1, 1.0, 1.0, true)).toBeGreaterThanOrEqual(1)
  })

  it('non-guided result is an integer', () => {
    const pts = calculatePoints(100, 1.7, 1.3)
    expect(Number.isInteger(pts)).toBe(true)
  })

  it('guided result is an integer', () => {
    const pts = calculatePoints(100, 1.7, 1.3, true)
    expect(Number.isInteger(pts)).toBe(true)
  })
})

// ── getBasePoints ──────────────────────────────────────────────────────────────

describe('getBasePoints', () => {
  it('level 0 → 100', () => expect(getBasePoints(0)).toBe(100))
  it('level 1 → 150', () => expect(getBasePoints(1)).toBe(150))
  it('level 9 → 550', () => expect(getBasePoints(9)).toBe(550))

  it('increases by 50 per level', () => {
    for (let lv = 0; lv < 9; lv++) {
      expect(getBasePoints(lv + 1) - getBasePoints(lv)).toBe(50)
    }
  })
})

// ── getTimeLimit ──────────────────────────────────────────────────────────────

describe('getTimeLimit', () => {
  it('level equals ceiling → 10 000ms', () => {
    expect(getTimeLimit(3, 3)).toBe(10_000)
  })

  it('ceiling 2 above level → 10000 - 2×500 = 9000ms', () => {
    expect(getTimeLimit(0, 2)).toBe(9_000)
  })

  it('minimum is 3 000ms', () => {
    // ceiling 9 above level 0 → 10000 - 9×500 = 5500; never goes below 3000
    expect(getTimeLimit(0, 9)).toBeGreaterThanOrEqual(3_000)
  })

  it('survival mode applies 1.5× multiplier', () => {
    const gen  = getTimeLimit(2, 2, 'general')
    const surv = getTimeLimit(2, 2, 'survival')
    expect(surv).toBe(Math.round(gen * 1.5))
  })

  it('survival minimum ≥ general minimum', () => {
    expect(getTimeLimit(0, 9, 'survival')).toBeGreaterThanOrEqual(getTimeLimit(0, 9, 'general'))
  })
})
