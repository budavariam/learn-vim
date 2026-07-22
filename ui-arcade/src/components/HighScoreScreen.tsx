import type { HighScores, GameMode, HighScoreEntry } from '../engine/types'

const MODE_LABELS: Record<GameMode, string> = {
  general: 'General',
  timed_challenge: 'Timed Challenge',
  survival: 'Survival',
}

interface HighScoreScreenProps {
  scores: HighScores
  onClose: () => void
}

export function HighScoreScreen({ scores, onClose }: HighScoreScreenProps) {
  const modes: GameMode[] = ['general', 'timed_challenge', 'survival']

  return (
    <div className="min-h-screen bg-gray-900 overflow-y-auto">
      <div className="max-w-xl mx-auto py-10 px-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white font-mono">HIGH SCORES</h1>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white font-mono text-sm px-4 py-2 bg-gray-800 rounded-lg"
          >
            ← Back
          </button>
        </div>

        {modes.map(mode => (
          <section key={mode}>
            <h2 className="text-gray-400 font-mono text-xs uppercase tracking-wider mb-3">
              {MODE_LABELS[mode]}
            </h2>
            {scores[mode].length === 0 ? (
              <p className="text-gray-600 font-mono text-sm italic">No scores yet</p>
            ) : (
              <div className="space-y-2">
                {scores[mode].map((entry, i) => (
                  <ScoreRow key={entry.id} rank={i + 1} entry={entry} mode={mode} />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}

function ScoreRow({ rank, entry, mode }: { rank: number; entry: HighScoreEntry; mode: GameMode }) {
  const date = new Date(entry.timestamp).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
  })
  const time = new Date(entry.timestamp).toLocaleTimeString(undefined, {
    hour: '2-digit', minute: '2-digit',
  })

  const rankColor = rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-gray-300' : rank === 3 ? 'text-amber-600' : 'text-gray-500'

  return (
    <div className="bg-gray-800 rounded-lg p-3 flex items-center gap-4">
      <div className={`text-xl font-mono font-bold w-7 text-center ${rankColor}`}>{rank}</div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-yellow-400 font-mono font-bold text-lg">
            {entry.score.toLocaleString()}
          </span>
          <span className="text-xs text-gray-500 font-mono">
            {entry.language} · Lv{entry.startingLevel} · {entry.repetitionTarget}× rep · {entry.guidedMode === 'none' ? 'blind' : 'guided'}
          </span>
        </div>

        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 font-mono flex-wrap">
          {mode === 'survival' ? (
            <>
              <span className="text-green-400">
                survived {formatMs(entry.achievedTimeMs)}
              </span>
              <span className="text-gray-600">
                / expected {formatMs(entry.expectedTimeMs)}
              </span>
            </>
          ) : mode === 'timed_challenge' ? (
            <span>{formatMs(entry.sessionDurationMs)} session</span>
          ) : null}
          <span>{entry.challengesCompleted}✓ {entry.challengesFailed}✗</span>
          <span>{Math.round(entry.accuracy * 100)}% acc</span>
          <span className="text-gray-600">{date} {time}</span>
        </div>
      </div>
    </div>
  )
}

function formatMs(ms: number): string {
  const s = Math.round(ms / 1000)
  if (s < 60) return `${s}s`
  return `${Math.floor(s / 60)}m ${s % 60}s`
}
