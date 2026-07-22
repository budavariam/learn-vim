import type { ComboState } from '../engine/types'

interface ScoreDisplayProps {
  score: number
  combo: ComboState
}

export function ScoreDisplay({ score, combo }: ScoreDisplayProps) {
  return (
    <div className="flex-1">
      <div className="text-3xl font-mono font-bold text-white">
        {score.toLocaleString()}
      </div>
      <div className="text-xs text-gray-500 font-mono uppercase tracking-wider">Score</div>
      {combo.count >= 2 && (
        <div className="mt-1 flex items-center gap-2">
          <span className="text-orange-400 font-mono font-bold text-sm">
            {combo.count}x COMBO
          </span>
          <span className="text-xs bg-orange-900 text-orange-300 px-1.5 py-0.5 rounded font-mono">
            ×{combo.multiplier.toFixed(1)}
          </span>
        </div>
      )}
    </div>
  )
}
