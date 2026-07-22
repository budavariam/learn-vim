import type React from 'react'
import type { VimGolfChallenge } from '../engine/types'
import type { GoalState } from '../hooks/useGoalGame'
import { ChallengePanel } from './ChallengePanel'
import { ScoreDisplay } from './ScoreDisplay'
import { LevelIndicator } from './LevelIndicator'
interface GoalGameProps {
  state:            GoalState
  currentChallenge: VimGolfChallenge | null
  editorRef:        React.RefObject<HTMLDivElement | null>
  statusRef:        React.RefObject<HTMLDivElement | null>
  targetEditorRef:  React.RefObject<HTMLDivElement | null>
  onCheck:          () => void
  onSkip:           () => void
  onQuit:           () => void
  onMarkUnsupported?: (id: string) => void
}

const DIFFICULTY_BADGE: Record<VimGolfChallenge['difficulty'], string> = {
  easy:   'bg-green-900/50 text-green-400 border border-green-700',
  medium: 'bg-yellow-900/50 text-yellow-400 border border-yellow-700',
  hard:   'bg-red-900/50 text-red-400 border border-red-700',
}

function formatTime(ms: number): string {
  const total = Math.floor(ms / 1000)
  const m = Math.floor(total / 60).toString().padStart(2, '0')
  const s = (total % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export function GoalGame({
  state, currentChallenge,
  editorRef, statusRef, targetEditorRef,
  onCheck, onSkip, onQuit,
  onMarkUnsupported = () => {},
}: GoalGameProps) {
  const total       = state.challenges.length
  const idx         = state.index
  const limit       = state.config?.timeLimitMs ?? 0
  const remainingMs = limit > 0 ? Math.max(0, limit - state.elapsedMs) : 0
  const isLowTime   = limit > 0 && remainingMs < 10_000
  const recentResults = state.results.slice(-3).reverse()
  const arcade      = state.arcadeState

  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden relative font-mono">

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700 flex-shrink-0">
        <button onClick={onQuit} className="text-gray-400 hover:text-white text-sm transition-colors">
          ← Quit
        </button>
        <div className="flex items-center gap-6">
          {currentChallenge && (
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-xs uppercase tracking-widest">
                {idx + 1} / {total}
              </span>
              <span className="font-bold text-white text-sm">{currentChallenge.title}</span>
              <span className={`px-1.5 py-0.5 rounded text-xs font-bold uppercase ${DIFFICULTY_BADGE[currentChallenge.difficulty]}`}>
                {currentChallenge.difficulty}
              </span>
            </div>
          )}
          <div className={`text-lg font-bold ${isLowTime ? 'text-red-400' : 'text-gray-300'}`}>
            {limit > 0 ? formatTime(remainingMs) : formatTime(state.elapsedMs)}
          </div>
          <div className="text-yellow-400 font-bold">
            {state.totalScore + (arcade?.score ?? 0)} pts
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCheck}
            className="px-4 py-1.5 bg-green-700 hover:bg-green-600 text-white text-sm rounded transition-colors"
          >
            Check ✓
          </button>
          <button
            onClick={onSkip}
            className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded transition-colors"
          >
            Skip →
          </button>
        </div>
      </div>

      {/* Main: three-column layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left (~40%): editable editor ── */}
        <div className="flex flex-col min-w-0 border-r border-gray-700" style={{ flex: '0 0 40%' }}>
          <div className="flex items-center px-3 py-1.5 bg-gray-800 border-b border-gray-700 flex-shrink-0">
            <span className="text-gray-400 text-xs">editing</span>
            <span className="ml-auto text-gray-600 text-xs">{state.keystrokes} keys</span>
          </div>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <div ref={editorRef as any} className="flex-1 min-h-0" />
          <div
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ref={statusRef as any}
            className="h-6 bg-gray-800 border-t border-gray-700 px-3 text-xs text-gray-400 flex items-center flex-shrink-0"
          />
        </div>

        {/* ── Middle (~35%): read-only target ── */}
        <div className="flex flex-col min-w-0 border-r border-gray-700" style={{ flex: '0 0 35%' }}>
          <div className="flex items-center px-3 py-1.5 bg-gray-800 border-b border-gray-700 flex-shrink-0">
            <span className="text-gray-400 text-xs">target</span>
            {currentChallenge && (
              <span className="ml-3 text-gray-600 text-xs truncate">{currentChallenge.description}</span>
            )}
          </div>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <div ref={targetEditorRef as any} className="flex-1 min-h-0" />
          {/* Diff legend */}
          <div className="h-6 bg-gray-800 border-t border-gray-700 px-3 flex items-center gap-4 flex-shrink-0">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: '#f59e0b' }} />
              changed
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: '#22c55e' }} />
              need to add
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: '#ef4444' }} />
              need to remove
            </span>
          </div>
        </div>

        {/* ── Right (~25%): arcade command challenges ── */}
        <div className="flex flex-col min-w-0 overflow-hidden" style={{ flex: '0 0 25%' }}>
          {/* Score + level header */}
          <div className="flex items-center gap-3 px-3 py-2 bg-gray-800 border-b border-gray-700 flex-shrink-0">
            {arcade ? (
              <>
                <ScoreDisplay score={arcade.score} combo={arcade.combo} />
                <LevelIndicator ceiling={arcade.ceiling} levelPct={arcade.levelPct} />
              </>
            ) : (
              <span className="text-gray-500 text-xs font-mono">Commands</span>
            )}
          </div>
          {/* Challenges scroll area */}
          <div className="flex-1 overflow-y-auto p-3">
            <ChallengePanel
              challenges={arcade?.activeChallenges ?? []}
              onMarkUnsupported={onMarkUnsupported}
            />
          </div>
        </div>
      </div>

      {/* Recent results strip at bottom */}
      {recentResults.length > 0 && (
        <div className="flex-shrink-0 border-t border-gray-700 bg-gray-800 px-4 py-1.5 flex gap-6 text-xs">
          {recentResults.map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-gray-500 truncate max-w-32">{r.title}</span>
              {r.solved
                ? <span className="text-green-400 font-bold">+{r.points}</span>
                : <span className="text-red-400 font-bold">FAILED</span>
              }
            </div>
          ))}
        </div>
      )}

      {/* Results overlay */}
      {state.status === 'results' && (
        <ResultsOverlay state={state} onQuit={onQuit} />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Results overlay
// ---------------------------------------------------------------------------

function ResultsOverlay({ state, onQuit }: { state: GoalState; onQuit: () => void }) {
  const arcadeScore = state.arcadeState?.score ?? 0
  const grandTotal  = state.totalScore + arcadeScore
  return (
    <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center overflow-auto">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 max-w-2xl w-full mx-4 font-mono">
        <h2 className="text-4xl font-bold text-white text-center mb-2">COMPLETE</h2>
        <div className="text-center mb-4">
          <span className="text-5xl font-bold text-yellow-400">{grandTotal}</span>
          <div className="text-sm text-gray-400 mt-1 uppercase tracking-widest">Total Score</div>
        </div>

        {arcadeScore > 0 && (
          <div className="flex justify-center gap-8 mb-6 text-sm font-mono">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{state.totalScore}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Editing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{arcadeScore}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Commands</div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left py-2 pr-3">Challenge</th>
                <th className="text-center py-2 px-2">Result</th>
                <th className="text-right py-2 px-2">Keys</th>
                <th className="text-right py-2 px-2">Time</th>
                <th className="text-right py-2 pl-2">Points</th>
              </tr>
            </thead>
            <tbody>
              {state.results.map((r, i) => (
                <tr key={i} className="border-t border-gray-800">
                  <td className="py-2 pr-3 text-gray-300 truncate max-w-48">{r.title}</td>
                  <td className="py-2 px-2 text-center">
                    {r.solved
                      ? <span className="text-green-400 font-bold">✓</span>
                      : <span className="text-red-400 font-bold">✗</span>}
                  </td>
                  <td className="py-2 px-2 text-right text-gray-400">{r.keystrokes}</td>
                  <td className="py-2 px-2 text-right text-gray-400">{formatTime(r.elapsedMs)}</td>
                  <td className="py-2 pl-2 text-right font-bold">
                    {r.solved
                      ? <span className="text-yellow-400">+{r.points}</span>
                      : <span className="text-gray-600">0</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={onQuit}
          className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  )
}
