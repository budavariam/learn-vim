import data from './data.json'

// Sort categories alphabetically and assign evenly spaced hues across the full color wheel.
// This guarantees maximum perceptual distance between adjacent categories.
const categories = [...new Set(data.map(item => item.category))].sort()
const n = categories.length

const COLOR_MAP = Object.fromEntries(
  categories.map((cat, i) => {
    const hue = Math.round((i / n) * 360)
    return [cat, `hsl(${hue}, 70%, 52%)`]
  })
)

export function getCategoryColor(category) {
  return COLOR_MAP[category] ?? 'hsl(0, 0%, 50%)'
}
