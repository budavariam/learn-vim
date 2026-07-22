import { useVimGolfGame } from '../hooks/useVimGolfGame'
import { VimGolfDiff } from './VimGolfDiff'
import type { VimGolfChallenge } from '../engine/types'

interface VimGolfGameProps {
  challenge: VimGolfChallenge
  onBack: () => void
}

function formatTime(ms: number): string {
  const total = Math.floor(ms / 1000)
  const m = Math.floor(total / 60).toString().padStart(2, '0')
  const s = (total % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

const DIFFICULTY_BADGE: Record<VimGolfChallenge['difficulty'], string> = {
  easy:   'bg-green-900/50 text-green-400 border border-green-700',
  medium: 'bg-yellow-900/50 text-yellow-400 border border-yellow-700',
  hard:   'bg-red-900/50 text-red-400 border border-red-700',
}

export function VimGolfGame({ challenge, onBack }: VimGolfGameProps) {
  const {
    editorRef, statusRef,
    keystrokes, elapsedMs, resetCount, status,
    showSolution, showDiff, diffLines, isCorrect, bestEntry,
    handleCheck, handleReset, toggleSolution, toggleDiff,
  } = useVimGolfGame(challenge)

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Editor — 60% */}
        <div className="flex-[6] flex flex-col min-h-0">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <div ref={editorRef as any} className="flex-1" />
          <div
            ref={statusRef as any}
            className="h-6 bg-gray-800 border-t border-gray-700 px-3 text-xs font-mono text-gray-400 flex items-center"
          />
        </div>

        {/* HUD — 40% */}
        <div className="flex-[4] bg-gray-800 border-l border-gray-700 overflow-y-auto p-5 flex flex-col gap-4">
          {/* Back button */}
          <div>
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-white font-mono text-sm transition-colors"
            >
              ← Back
            </button>
          </div>

          {/* Challenge header */}
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="font-mono font-bold text-white text-lg">{challenge.title}</h1>
              <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold uppercase ${DIFFICULTY_BADGE[challenge.difficulty]}`}>
                {challenge.difficulty}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {challenge.tags.map(tag => (
                <span key={tag} className="px-1.5 py-0.5 bg-gray-700 text-gray-400 rounded text-xs font-mono">
                  {tag}
                </span>
              ))}
            </div>
            {challenge.vimgolfId && (
              <a
                href={`https://www.vimgolf.com/challenges/${challenge.vimgolfId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 font-mono mt-1 inline-block"
              >
                View on vimgolf.com ↗
              </a>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-300 font-mono text-sm">{challenge.description}</p>

          <hr className="border-gray-700" />

          {/* Keystrokes counter */}
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-yellow-400">{keystrokes}</div>
            <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mt-1">Keystrokes</div>
          </div>

          {/* Timer */}
          <div className="text-center">
            <div className="text-2xl font-mono text-gray-400">{formatTime(elapsedMs)}</div>
          </div>

          {/* Reset count */}
          {resetCount > 0 && (
            <div className="text-center text-sm font-mono text-gray-600">
              ↺ {resetCount} reset{resetCount > 1 ? 's' : ''}
            </div>
          )}

          {/* Best score */}
          {bestEntry && (
            <div className="text-center text-sm font-mono text-teal-400">
              Best: {bestEntry.keystrokes} keys in {(bestEntry.timeMs / 1000).toFixed(1)}s
            </div>
          )}

          <hr className="border-gray-700" />

          {/* Buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={handleCheck}
              disabled={status === 'solved'}
              className="w-full py-2 bg-green-700 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-mono text-sm rounded-lg transition-colors"
            >
              Check
            </button>
            <button
              onClick={handleReset}
              className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 font-mono text-sm rounded-lg transition-colors"
            >
              Reset ↺
            </button>
            <button
              onClick={toggleDiff}
              className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 font-mono text-sm rounded-lg transition-colors"
            >
              {showDiff ? 'Hide Diff' : 'Show Diff'}
            </button>
            <button
              onClick={toggleSolution}
              className={`w-full py-2 font-mono text-sm rounded-lg transition-colors ${
                showSolution
                  ? 'bg-purple-700 hover:bg-purple-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {showSolution ? 'Hide Solution' : 'Toggle Solution'}
            </button>
          </div>

          {/* Solution */}
          {showSolution && (
            <div>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Solution</p>
              <pre className="bg-gray-900 rounded-lg p-3 text-yellow-300 font-mono text-sm overflow-x-auto max-h-40 overflow-y-auto whitespace-pre border border-gray-700">
                {challenge.end}
              </pre>
            </div>
          )}

          {/* Solved banner */}
          {status === 'solved' && (
            <div className="bg-green-900/50 border border-green-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-mono font-bold text-green-400">✓ SOLVED!</div>
              <div className="text-sm font-mono text-green-300 mt-1">
                {keystrokes} keystroke{keystrokes !== 1 ? 's' : ''}
              </div>
            </div>
          )}

          {/* Incorrect feedback */}
          {isCorrect === false && status !== 'solved' && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-center">
              <div className="text-sm font-mono text-red-400">Not quite — check the diff above</div>
            </div>
          )}

          {/* Hint */}
          <div className="mt-auto pt-4 text-xs font-mono text-gray-600 text-center">
            ⌘⇧P · vim commands active
          </div>
        </div>
      </div>

      {/* Diff overlay */}
      {showDiff && diffLines.length > 0 && (
        <VimGolfDiff diffLines={diffLines} onClose={toggleDiff} challenge={challenge} />
      )}
    </div>
  )
}
