import type { GameState, SessionStats, GameMode } from '../engine/types'

interface ResultsScreenProps {
  state: GameState
  onRestart: () => void
  onHighScores: () => void
  onReview: () => void
  reviewCount: number  // how many items are reviewable
}

export function ResultsScreen({ state, onRestart, onHighScores, onReview, reviewCount }: ResultsScreenProps) {
  const { sessionStats: stats, score, config } = state
  const accuracy = stats.totalChallenges > 0
    ? Math.round((stats.completed / stats.totalChallenges) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white font-mono mb-1">
            {config.mode === 'survival' ? 'ELIMINATED' : 'GAME OVER'}
          </h1>
          <p className="text-gray-500 font-mono text-sm">
            {modeSubtitle(config.mode, state)}
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 space-y-4">
          <div className="text-center">
            <div className="text-5xl font-mono font-bold text-yellow-400">
              {score.toLocaleString()}
            </div>
            <div className="text-gray-400 text-sm font-mono">Final Score</div>
          </div>

          <hr className="border-gray-700" />

          <div className="grid grid-cols-2 gap-4">
            <Stat label="Completed" value={stats.completed}          color="text-green-400" />
            <Stat label="Failed"    value={stats.failed}             color="text-red-400" />
            <Stat label="Accuracy"  value={`${accuracy}%`}           color="text-blue-400" />
            <Stat label="Best Combo" value={`${stats.bestCombo}×`}   color="text-purple-400" />
            <Stat label="Duration"  value={formatMs(state.sessionElapsedMs)} color="text-gray-300" />
            <Stat label="Level"     value={`Lv${state.ceiling}`}     color="text-yellow-500" />
          </div>

          {config.mode === 'survival' && stats.achievedTimeMs > 0 && (
            <>
              <hr className="border-gray-700" />
              <div className="grid grid-cols-2 gap-4">
                <Stat
                  label="Survived"
                  value={formatMs(stats.achievedTimeMs)}
                  color="text-green-300"
                />
                <Stat
                  label="Expected"
                  value={formatMs(stats.expectedTimeMs)}
                  color="text-gray-400"
                />
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onRestart}
            className="flex-1 py-4 bg-green-600 hover:bg-green-500 text-white font-mono font-bold text-lg rounded-lg transition-colors uppercase tracking-wider"
          >
            Play Again
          </button>
          <button
            onClick={onHighScores}
            className="px-5 py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 font-mono text-sm rounded-lg border border-gray-700"
          >
            High Scores
          </button>
        </div>
        {reviewCount > 0 && (
          <button
            onClick={onReview}
            className="w-full py-3 bg-indigo-900/50 hover:bg-indigo-900/80 text-indigo-300 font-mono text-sm rounded-lg border border-indigo-700 transition-colors"
          >
            Review session ({reviewCount} commands) →
          </button>
        )}
      </div>
    </div>
  )
}

function modeSubtitle(mode: GameMode, state: GameState): string {
  if (mode === 'survival') {
    const s = Math.round(state.sessionStats.achievedTimeMs / 1000)
    return `You survived ${s}s before your first miss`
  }
  if (mode === 'timed_challenge' && state.config.timedDurationMs) {
    const m = state.config.timedDurationMs / 60_000
    return `${m}-minute session complete`
  }
  return 'Session complete'
}

function formatMs(ms: number): string {
  const s = Math.round(ms / 1000)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  return `${m}:${String(s % 60).padStart(2, '0')}`
}

function Stat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="text-center">
      <div className={`text-xl font-mono font-bold ${color}`}>{value}</div>
      <div className="text-gray-500 text-xs font-mono">{label}</div>
    </div>
  )
}

// Re-export unused import to avoid TS errors until more callers are added
export type { SessionStats }
