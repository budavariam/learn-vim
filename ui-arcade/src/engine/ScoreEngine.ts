import type { GameMode } from './types'

export type TimeRating = 'lightning' | 'fast' | 'good' | 'completed'

export const SURVIVAL_TIME_MULTIPLIER = 1.5
// Guided challenges earn a fraction of normal points so blind completion feels rewarding
export const GUIDED_POINTS_FRACTION = 0.2

export function getTimeRating(elapsed: number, timeLimit: number): { multiplier: number; rating: TimeRating } {
  const fraction = elapsed / timeLimit
  if (fraction <= 0.25) return { multiplier: 3.0, rating: 'lightning' }
  if (fraction <= 0.5)  return { multiplier: 2.0, rating: 'fast' }
  if (fraction <= 0.75) return { multiplier: 1.5, rating: 'good' }
  return { multiplier: 1.0, rating: 'completed' }
}

export function getComboMultiplier(comboCount: number): number {
  if (comboCount >= 12) return 3.0
  if (comboCount >= 8)  return 2.5
  if (comboCount >= 5)  return 2.0
  if (comboCount >= 3)  return 1.5
  return 1.0
}

export function calculatePoints(
  basePoints: number,
  timeMultiplier: number,
  comboMultiplier: number,
  guided = false
): number {
  const raw = Math.round(basePoints * timeMultiplier * comboMultiplier)
  return guided ? Math.max(1, Math.round(raw * GUIDED_POINTS_FRACTION)) : raw
}

// Base points scale with level: level 0 = 100, +50 per level
export function getBasePoints(level: number): number {
  return 100 + level * 50
}

// Dynamic time limit in ms. Survival mode gets 1.5× longer limits.
export function getTimeLimit(
  challengeLevel: number,
  ceiling: number,
  mode: GameMode = 'general',
  extraMultiplier = 1
): number {
  const base = 10_000
  const reduction = Math.max(0, ceiling - challengeLevel) * 500
  const limit = Math.max(3_000, base - reduction)
  const modeMult = mode === 'survival' ? SURVIVAL_TIME_MULTIPLIER : 1
  return Math.round(limit * modeMult * extraMultiplier)
}
