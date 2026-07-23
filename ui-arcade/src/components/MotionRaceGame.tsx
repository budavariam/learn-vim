import { useState, useEffect } from 'react'
import type React from 'react'
import { useMotionRace } from '../hooks/useMotionRace'
import type { MotionRaceConfig, CompletedPath } from '../hooks/useMotionRace'
import type { Language } from '../engine/types'

// ── Setup screen ──────────────────────────────────────────────────────────────

const LANGUAGES: { id: Language; label: string; icon: string }[] = [
  { id: 'go',         label: 'Go',         icon: '🐹' },
  { id: 'rust',       label: 'Rust',       icon: '🦀' },
  { id: 'python',     label: 'Python',     icon: '🐍' },
  { id: 'typescript', label: 'TypeScript', icon: '🟦' },
  { id: 'c',          label: 'C',          icon: '🔷' },
  { id: 'cpp',        label: 'C++',        icon: '🔶' },
]

const COUNT_OPTIONS = [3, 5, 10, 15, 20, 30]
const DURATION_OPTIONS: { label: string; ms: number }[] = [
  { label: '1 min',  ms: 60_000 },
  { label: '2 min',  ms: 120_000 },
  { label: '5 min',  ms: 300_000 },
  { label: '10 min', ms: 600_000 },
]

interface SetupProps {
  onStart: (config: MotionRaceConfig) => void
  onBack:  () => void
}

function MotionRaceSetup({ onStart, onBack }: SetupProps) {
  const [lang,              setLang]              = useState<Language>('typescript')
  const [mode,              setMode]              = useState<'count' | 'timed'>('timed')
  const [count,             setCount]             = useState(10)
  const [durationMs,        setDurationMs]        = useState(60_000)
  const [startFromPrevious, setStartFromPrevious] = useState(true)

  function handleStart() {
    onStart({ language: lang, mode, targetCount: count, durationMs, startFromPrevious })
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-6 py-12 font-mono">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-1">Motion Race</h1>
          <p className="text-gray-400 text-sm">Navigate to highlighted positions using vim motions — no editing allowed</p>
        </div>

        {/* Language */}
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Language</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {LANGUAGES.map(l => (
              <button
                key={l.id}
                onClick={() => setLang(l.id)}
                className={`py-2 rounded border text-xs transition-colors ${
                  lang === l.id
                    ? 'bg-blue-700 border-blue-500 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="text-lg">{l.icon}</div>
                <div>{l.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Mode */}
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Mode</p>
          <div className="grid grid-cols-2 gap-2">
            {(['count', 'timed'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`py-3 rounded border text-sm transition-colors ${
                  mode === m
                    ? 'bg-green-800 border-green-600 text-white font-bold'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'
                }`}
              >
                {m === 'count' ? '# Paths' : '⏱ Timed'}
                <div className="text-xs text-gray-400 font-normal mt-0.5">
                  {m === 'count' ? 'Fixed number of targets' : 'Keep going until time runs out'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Count or Duration */}
        {mode === 'count' ? (
          <div className="mb-6">
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Number of paths</p>
            <div className="flex gap-2 flex-wrap">
              {COUNT_OPTIONS.map(n => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`px-4 py-2 rounded border text-sm transition-colors ${
                    count === n
                      ? 'bg-blue-700 border-blue-500 text-white font-bold'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Duration</p>
            <div className="flex gap-2 flex-wrap">
              {DURATION_OPTIONS.map(d => (
                <button
                  key={d.ms}
                  onClick={() => setDurationMs(d.ms)}
                  className={`px-4 py-2 rounded border text-sm transition-colors ${
                    durationMs === d.ms
                      ? 'bg-blue-700 border-blue-500 text-white font-bold'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Start position */}
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Start position</p>
          <div className="grid grid-cols-2 gap-2">
            {([true, false] as const).map(v => (
              <button
                key={String(v)}
                onClick={() => setStartFromPrevious(v)}
                className={`py-3 rounded border text-sm transition-colors ${
                  startFromPrevious === v
                    ? 'bg-green-800 border-green-600 text-white font-bold'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'
                }`}
              >
                {v ? '⛓ Continue from last' : '🎲 Random each time'}
                <div className="text-xs text-gray-400 font-normal mt-0.5">
                  {v ? 'Chain paths — cursor stays where you ended' : 'Jump to a fresh start each path'}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onBack}
            className="px-5 py-2.5 rounded border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 text-sm transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={handleStart}
            className="flex-1 py-2.5 rounded bg-green-700 hover:bg-green-600 text-white font-bold text-sm transition-colors"
          >
            Start →
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtMs(ms: number) {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  return m > 0 ? `${m}:${String(s % 60).padStart(2, '0')}` : `${s}s`
}

function fmtCountdown(remainMs: number) {
  const ms  = Math.max(0, remainMs)
  const s   = Math.ceil(ms / 1000)
  const m   = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

function PathPill({ path, idx }: { path: CompletedPath; idx: number }) {
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono border ${
      path.valid
        ? 'bg-green-900/30 border-green-800 text-green-300'
        : 'bg-red-900/30 border-red-800 text-red-400'
    }`}>
      <span className="text-gray-500">#{idx + 1}</span>
      <span>{path.keystrokes}k</span>
      <span className="text-gray-500">·</span>
      <span>{fmtMs(path.elapsedMs)}</span>
      {!path.valid && <span title="Text was modified">⚠</span>}
    </div>
  )
}

// ── Game + results screen ─────────────────────────────────────────────────────

interface GameProps {
  config:  MotionRaceConfig
  onQuit:  () => void
}

function MotionRaceGameScreen({ config, onQuit }: GameProps) {
  const { state, editorRef, statusRef, startGame } = useMotionRace()

  useEffect(() => { startGame(config) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const { from, to, currentPos, keystrokes, contentValid, completedPaths, totalElapsedMs, pathElapsedMs } = state

  const atTarget = currentPos.lineNumber === to.lineNumber && currentPos.column === to.column
  const remainMs = config.mode === 'timed' ? Math.max(0, config.durationMs - totalElapsedMs) : null
  const pathsDone = completedPaths.length
  const validCount = completedPaths.filter(p => p.valid).length

  if (state.status === 'results') {
    const avgKeys = pathsDone > 0
      ? (completedPaths.reduce((a, p) => a + p.keystrokes, 0) / pathsDone).toFixed(1)
      : '—'
    const avgTime = pathsDone > 0
      ? fmtMs(completedPaths.reduce((a, p) => a + p.elapsedMs, 0) / pathsDone)
      : '—'

    return (
      <div className="h-screen bg-gray-900 flex flex-col items-center justify-center font-mono px-6">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🏁</div>
            <h2 className="text-3xl font-bold text-white mb-1">Finished!</h2>
            <p className="text-gray-400 text-sm">{fmtMs(totalElapsedMs)} total</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8 text-center">
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="text-2xl font-bold text-green-400">{validCount}</div>
              <div className="text-xs text-gray-400 mt-1">Valid paths</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="text-2xl font-bold text-blue-400">{avgKeys}</div>
              <div className="text-xs text-gray-400 mt-1">Avg keystrokes</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="text-2xl font-bold text-purple-400">{avgTime}</div>
              <div className="text-xs text-gray-400 mt-1">Avg time</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8 max-h-32 overflow-y-auto">
            {completedPaths.map((p, i) => <PathPill key={i} path={p} idx={i} />)}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onQuit}
              className="flex-1 py-2.5 rounded border border-gray-600 text-gray-300 hover:text-white text-sm transition-colors"
            >
              ← Menu
            </button>
            <button
              onClick={() => startGame(config)}
              className="flex-1 py-2.5 rounded bg-green-700 hover:bg-green-600 text-white font-bold text-sm transition-colors"
            >
              Play again →
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden font-mono">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-800 border-b border-gray-700 flex-shrink-0 flex-wrap">
        <button
          onClick={onQuit}
          className="text-gray-400 hover:text-white text-sm px-3 py-1 rounded border border-gray-600 hover:border-gray-400 transition-colors"
        >
          ← Quit
        </button>
        <span className="text-white font-bold text-base">Motion Race</span>

        <div className="flex items-center gap-3 ml-auto flex-wrap text-sm">
          {config.mode === 'timed' && remainMs !== null ? (
            <span className={`font-bold tabular-nums ${remainMs < 10_000 ? 'text-red-400' : 'text-blue-300'}`}>
              ⏱ {fmtCountdown(remainMs)}
            </span>
          ) : (
            <span className="text-gray-400 tabular-nums">
              Path <span className="text-white font-bold">{pathsDone + 1}</span>
              <span className="text-gray-600"> / {config.targetCount}</span>
            </span>
          )}
          <span className="text-gray-500 tabular-nums">{fmtMs(pathElapsedMs)}</span>
          <span className="text-gray-500 tabular-nums">{keystrokes} keys</span>
        </div>
      </div>

      {/* Navigation target bar */}
      <div className={`flex items-center gap-4 px-4 py-2.5 border-b flex-shrink-0 text-sm transition-colors ${
        !contentValid
          ? 'bg-red-900/40 border-red-700'
          : atTarget
            ? 'bg-green-900/40 border-green-700'
            : 'bg-gray-800 border-gray-700'
      }`}>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">From</span>
          <kbd className="px-2 py-0.5 bg-gray-700 border border-gray-600 rounded text-xs text-blue-300">
            L{from.lineNumber} C{from.column}
          </kbd>
          <span className="text-gray-600">→</span>
          <span className="text-gray-400">To</span>
          <kbd className="px-2 py-0.5 bg-yellow-900/60 border border-yellow-700 rounded text-xs text-yellow-300 font-bold">
            L{to.lineNumber} C{to.column}
          </kbd>
        </div>

        <div className="ml-auto flex items-center gap-3">
          {!contentValid && (
            <span className="text-red-400 text-xs font-bold">⚠ Text modified — won't count</span>
          )}
          {atTarget && contentValid && (
            <span className="text-green-400 text-xs font-bold">✓ On target!</span>
          )}
          <span className="text-gray-500 text-xs">
            cursor: L{currentPos.lineNumber} C{currentPos.column}
          </span>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <div ref={editorRef as React.RefObject<HTMLDivElement>} className="h-full" />
      </div>
      <div ref={statusRef as React.RefObject<HTMLDivElement>} className="h-7 bg-gray-800 border-t border-gray-700 px-3 flex items-center text-xs text-gray-400 flex-shrink-0" />

      {/* Recent paths strip */}
      {completedPaths.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-t border-gray-700 flex-shrink-0 overflow-x-auto">
          {completedPaths.slice(-8).map((p, i) => (
            <PathPill key={i} path={p} idx={completedPaths.length - Math.min(8, completedPaths.length) + i} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Public wrapper (setup → game) ─────────────────────────────────────────────

export function MotionRaceWrapper({ onBack }: { onBack: () => void }) {
  const [config, setConfig] = useState<MotionRaceConfig | null>(null)

  if (!config) {
    return <MotionRaceSetup onStart={setConfig} onBack={onBack} />
  }

  return (
    <MotionRaceGameContainer
      config={config}
      onQuit={() => { setConfig(null) }}
      onBack={onBack}
    />
  )
}

// Mount the game only after config is chosen (same pattern as GoalGameContainer)
// so Monaco's init effect fires when the editor div is in the DOM.
function MotionRaceGameContainer({ config, onQuit, onBack }: GameProps & { onBack: () => void }) {
  return <MotionRaceGameScreen config={config} onQuit={() => { onQuit(); onBack() }} />
}
