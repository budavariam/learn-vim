import { useRef } from 'react'

const LEVEL_LABELS = ['Novice', 'Beginner', 'Basic', 'Familiar', 'Intermediate', 'Proficient', 'Advanced', 'Expert', 'Master', 'Wizard']

export default function DualRangeSlider({ min, max, value, onChange, className = '' }) {
  const [lo, hi] = value
  const total = max - min
  const loPercent = ((lo - min) / total) * 100
  const hiPercent = ((hi - min) / total) * 100

  const handleLo = (e) => {
    const v = Math.min(Number(e.target.value), hi)
    onChange([v, hi])
  }

  const handleHi = (e) => {
    const v = Math.max(Number(e.target.value), lo)
    onChange([lo, v])
  }

  return (
    <div className={`dual-range-slider ${className}`}>
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1 font-mono">
        <span>{LEVEL_LABELS[lo]} ({lo})</span>
        <span>{LEVEL_LABELS[hi]} ({hi})</span>
      </div>

      <div className="relative h-6 flex items-center">
        <div className="absolute w-full h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
        <div
          className="absolute h-1.5 rounded-full bg-blue-500"
          style={{ left: `${loPercent}%`, width: `${hiPercent - loPercent}%` }}
        />
        <input
          type="range" min={min} max={max} value={lo} onChange={handleLo}
          className="dual-range-input"
        />
        <input
          type="range" min={min} max={max} value={hi} onChange={handleHi}
          className="dual-range-input"
        />
      </div>

      <div className="flex justify-between mt-1">
        {Array.from({ length: max - min + 1 }, (_, i) => (
          <div
            key={i}
            className={`text-xs font-mono text-center ${i + min >= lo && i + min <= hi ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-400 dark:text-gray-600'}`}
            style={{ width: `${100 / (max - min + 1)}%` }}
          >
            {i + min}
          </div>
        ))}
      </div>
    </div>
  )
}
