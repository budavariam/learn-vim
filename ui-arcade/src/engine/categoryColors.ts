import rawData from '../data.json'
import type { VimCommandData } from './types'

const _cmds = rawData as VimCommandData[]

// Sorted alphabetically — same ordering as ui-cheatsheet/src/constants.js
export const ALL_CATEGORIES: string[] = [...new Set(_cmds.map(c => c.category))].sort()

// Hue evenly spaced across 360° for max perceptual distance between neighbours.
// Direct port of the algorithm in ui-cheatsheet/src/constants.js.
export function getCategoryColor(category: string): string {
  const n   = ALL_CATEGORIES.length
  const idx = ALL_CATEGORIES.indexOf(category)
  if (n === 0 || idx === -1) return 'hsl(0, 0%, 50%)'
  const hue = Math.round((idx / n) * 360)
  return `hsl(${hue}, 70%, 52%)`
}

// The 6 most practical categories for someone learning vim from scratch.
// Shown pre-selected by default.
const DEFAULT_NAMES = [
  'Cursor movement',
  'Editing',
  'Insert mode, inserting/appending text',
  'Cut and paste',
  'Search and replace',
  'Text objects',
]

export const DEFAULT_CATEGORIES: string[] = ALL_CATEGORIES.length > 0
  ? ALL_CATEGORIES.filter(c => DEFAULT_NAMES.includes(c))
  : DEFAULT_NAMES

export const MIN_CATEGORIES = 3
