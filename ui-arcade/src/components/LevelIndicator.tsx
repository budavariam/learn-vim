import type { LevelProgress } from '../engine/types'

interface LevelIndicatorProps {
  ceiling: number
  levelPct: number  // 0–100, pre-computed by engine
}

export function LevelIndicator({ ceiling, levelPct }: LevelIndicatorProps) {
  return (
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-mono font-bold text-yellow-400">Lv{ceiling}</span>
        <span className="text-xs text-gray-500 font-mono">ceiling</span>
      </div>
      <div className="mt-1 w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, levelPct)}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 font-mono mt-0.5">
        {Math.round(levelPct)}% to next level
      </div>
    </div>
  )
}

// Keep the type export for any future use, but suppress the unused-import warning
export type { LevelProgress }
