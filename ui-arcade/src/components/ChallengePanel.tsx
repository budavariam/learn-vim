import { useRef, useEffect } from 'react'
import type { ActiveChallenge } from '../engine/types'
import { CountdownRing } from './CountdownRing'

interface ChallengePanelProps {
  challenges: ActiveChallenge[]
  onMarkUnsupported: (commandId: string) => void
}

const CATEGORY_COLORS: Record<string, string> = {
  Motion:     'bg-blue-900   text-blue-300',
  Edit:       'bg-green-900  text-green-300',
  Search:     'bg-yellow-900 text-yellow-300',
  Visual:     'bg-purple-900 text-purple-300',
  Window:     'bg-red-900    text-red-300',
  Insert:     'bg-cyan-900   text-cyan-300',
  Delete:     'bg-orange-900 text-orange-300',
  Yank:       'bg-teal-900   text-teal-300',
}

function getCategoryColor(category: string): string {
  for (const [key, val] of Object.entries(CATEGORY_COLORS)) {
    if (category.toLowerCase().includes(key.toLowerCase())) return val
  }
  return 'bg-gray-700 text-gray-300'
}

export function ChallengePanel({ challenges, onMarkUnsupported }: ChallengePanelProps) {
  const active = challenges.filter(c => c.status === 'active')
  const done   = challenges.filter(c => c.status !== 'active')

  return (
    <div className="space-y-3">
      <h2 className="text-gray-400 text-xs font-mono uppercase tracking-wider">
        Active Challenges ({active.length})
      </h2>

      {active.length === 0 && (
        <p className="text-gray-600 text-sm font-mono italic">Loading challenges…</p>
      )}

      {active.map(c => (
        <ChallengeCard key={c.id} challenge={c} onMarkUnsupported={onMarkUnsupported} />
      ))}

      {done.length > 0 && (
        <>
          <h2 className="text-gray-600 text-xs font-mono uppercase tracking-wider mt-4">Recent</h2>
          {done.slice(-3).map(c => (
            <RecentCard key={c.id} challenge={c} />
          ))}
        </>
      )}
    </div>
  )
}

function ChallengeCard({ challenge: c, onMarkUnsupported }: { challenge: ActiveChallenge; onMarkUnsupported: (commandId: string) => void }) {
  const prevStatus = useRef(c.status)
  const cardRef = useRef<HTMLDivElement | null>(null)

  // Flash animation on status change
  useEffect(() => {
    if (c.status !== prevStatus.current && cardRef.current) {
      const cls = c.status === 'completed' ? 'challenge-completed' : 'challenge-failed'
      cardRef.current.classList.add(cls)
      const id = setTimeout(() => cardRef.current?.classList.remove(cls), 500)
      prevStatus.current = c.status
      return () => clearTimeout(id)
    }
  }, [c.status])

  return (
    <div
      ref={cardRef}
      className="bg-gray-800 rounded-lg p-3 border border-gray-700 flex gap-3 items-start"
    >
      <CountdownRing startedAt={c.startedAt} timeLimit={c.timeLimit} size={44} />

      <div className="flex-1 min-w-0">
        {/* Category + level + badges */}
        <div className="flex items-center gap-1.5 flex-wrap mb-1">
          <span className={`text-xs px-2 py-0.5 rounded font-mono ${getCategoryColor(c.category)}`}>
            {c.category}
          </span>
          <span className="text-xs text-gray-500 font-mono">Lv{c.level}</span>
          {c.isVerification && (
            <span className="text-xs bg-indigo-900 text-indigo-300 px-1.5 py-0.5 rounded font-mono">
              🔍 verify
            </span>
          )}
          {c.showSolution && (
            <span className="text-xs bg-purple-900/50 text-purple-400 px-1.5 py-0.5 rounded font-mono">
              guided
            </span>
          )}
        </div>

        {/* Question */}
        <p className="text-white text-sm font-mono leading-relaxed">{c.question}</p>

        {/* Solution hint (guided mode) */}
        {c.showSolution && c.solution.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {c.solution.map((sol, i) => (
              <kbd
                key={i}
                className="inline-block px-2 py-1 bg-gray-700 text-yellow-300 font-mono text-xs rounded border border-gray-500 shadow-sm"
              >
                {sol}
              </kbd>
            ))}
          </div>
        )}
        <div className="mt-2 flex justify-end">
          <button
            className="text-xs font-mono px-1.5 py-0.5 rounded bg-transparent text-gray-600 hover:text-red-400 hover:bg-red-900/20 border border-transparent hover:border-red-800 transition-colors"
            onClick={e => { e.stopPropagation(); onMarkUnsupported(c.commandId) }}
          >
            [✕ not supported]
          </button>
        </div>
      </div>
    </div>
  )
}

function RecentCard({ challenge: c }: { challenge: ActiveChallenge }) {
  const isOk = c.status === 'completed'
  return (
    <div className={`rounded-lg p-3 border flex gap-3 items-center opacity-60 ${
      isOk ? 'border-green-800 bg-green-900/20' : 'border-red-800 bg-red-900/20'
    }`}>
      <span className="text-xl flex-shrink-0">{isOk ? '✓' : '✗'}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-mono text-gray-400 truncate">{c.question}</p>
        {isOk && c.pointsEarned > 0 && (
          <p className="text-xs text-green-400 font-mono">+{c.pointsEarned} pts</p>
        )}
      </div>
    </div>
  )
}
