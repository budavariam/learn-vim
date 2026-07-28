import { useEffect, useReducer, useState, useRef } from 'react'
import type React from 'react'
import { useQvimx } from '../hooks/useQvimx'
import type { QvimxConfig } from '../hooks/useQvimx'
import { TopBar } from './TopBar'
import { QvimxSetup } from './QvimxSetup'
import { Timer, Zap, Trophy, ArrowLeft } from 'lucide-react'

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtCountdown(remainMs: number) {
  const ms = Math.max(0, remainMs)
  const s = Math.ceil(ms / 1000)
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

function LivesDisplay({ count, max }: { count: number; max: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < count ? 'text-red-400' : 'text-gray-600'}>
          ♥
        </span>
      ))}
    </div>
  )
}

// ── Game screen ───────────────────────────────────────────────────────────────

interface GameProps {
  config: QvimxConfig
  onQuit: () => void
}

function QvimxGameScreen({ config, onQuit }: GameProps) {
  const { state, editorRef, statusRef, startGame, getVisibleRange } = useQvimx()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    startGame(config)
  }, [])

  // Penalty toast — watch penaltySeq so we show a message each time a life is lost
  const [penaltyToast, setPenaltyToast] = useState<string | null>(null)
  const prevPenaltySeq = useRef(0)
  useEffect(() => {
    if (state.penaltySeq > prevPenaltySeq.current) {
      prevPenaltySeq.current = state.penaltySeq
      const msg =
        state.penaltySource === 'ball'
          ? '● Ball hit your line!'
          : state.penaltySource === 'bomb'
            ? '◉ Bomb touched you!'
            : state.penaltySource === 'bomb-stix'
              ? '◉ Bomb cut your line!'
              : '⚠ Penalty!'
      setPenaltyToast(msg)
      const id = setTimeout(() => setPenaltyToast(null), 1500)
      return () => clearTimeout(id)
    }
  }, [state.penaltySeq, state.penaltySource])

  // Ball-caught toast
  const [catchToast, setCatchToast] = useState<string | null>(null)
  const prevCatchSeq = useRef(0)
  useEffect(() => {
    if (state.catchSeq > prevCatchSeq.current) {
      prevCatchSeq.current = state.catchSeq
      const n = state.catchCount
      setCatchToast(n === 1 ? '🎯 Ball caught!' : `🎯 ${n} balls caught!`)
      const id = setTimeout(() => setCatchToast(null), 1800)
      return () => clearTimeout(id)
    }
  }, [state.catchSeq, state.catchCount])

  const isResults = state.status === 'results'
  const remainMs = Math.max(0, config.timerMs - state.totalElapsedMs)

  const winner =
    state.playerScore > state.enemyScore
      ? 'You win!'
      : state.enemyScore > state.playerScore
        ? 'Enemy wins!'
        : 'Draw!'

  return (
    <div className="h-full bg-gray-900 flex flex-col overflow-hidden font-mono relative">
      {/* Penalty toast */}
      {penaltyToast && !isResults && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
          <div className="bg-red-900/90 border-2 border-red-500 text-red-200 font-bold px-6 py-3 rounded-lg shadow-2xl animate-pulse text-base">
            {penaltyToast}
          </div>
        </div>
      )}
      {/* Ball-caught toast */}
      {catchToast && !isResults && (
        <div className="absolute top-2/5 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-green-900/90 border-2 border-green-400 text-green-200 font-bold px-6 py-3 rounded-lg shadow-2xl text-base">
            {catchToast}
          </div>
        </div>
      )}
      {/* Results overlay */}
      {isResults && (
        <div className="absolute inset-0 z-40 backdrop-blur-sm bg-gray-900/80 flex flex-col items-center justify-center px-6">
          <div className="w-full max-w-lg bg-gray-900/90 border border-gray-600 rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-3">
                <Trophy className="w-14 h-14 text-yellow-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-1">{winner}</h2>
              <p className="text-gray-400 text-sm">
                {state.endReason === 'time'
                  ? 'Time up'
                  : state.endReason === 'lives'
                    ? 'Out of lives'
                    : 'Level complete'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-center">
              <div className="bg-gray-800 rounded-xl p-4 border border-green-800">
                <div className="text-2xl font-bold text-green-400">{state.playerScore}%</div>
                <div className="text-xs text-gray-400 mt-1">You claimed</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 border border-red-800">
                <div className="text-2xl font-bold text-red-400">{state.enemyScore}%</div>
                <div className="text-xs text-gray-400 mt-1">Enemy claimed</div>
              </div>
            </div>

            {config.subMode === 'championship' && (
              <div className="text-center mb-4 text-purple-400 text-sm">
                Level reached: <span className="font-bold">{state.level}</span>
              </div>
            )}

            {state.challengeScore > 0 && (
              <div className="text-center mb-4 text-indigo-400 text-sm">
                Challenges solved: <span className="font-bold">{state.challengeScore}</span>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => startGame(config)}
                className="flex-1 py-2.5 rounded bg-green-700 hover:bg-green-600 text-white font-bold text-sm transition-colors"
              >
                Play again
              </button>
              <button
                onClick={onQuit}
                className="flex-1 py-2.5 rounded bg-gray-700 hover:bg-gray-600 text-white font-bold text-sm transition-colors"
              >
                Back to menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <TopBar
        title="QVIMX"
        onBack={onQuit}
        backLabel={
          <>
            <ArrowLeft className="w-4 h-4" /> Quit
          </>
        }
      >
        <span
          className={`font-bold tabular-nums flex items-center gap-1 ${remainMs < 10_000 ? 'text-red-400' : 'text-blue-300'}`}
        >
          <Timer className="w-3.5 h-3.5" /> {fmtCountdown(remainMs)}
        </span>
        <span className="text-green-400 tabular-nums font-bold">You: {state.playerScore}%</span>
        <span className="text-red-400 tabular-nums font-bold">Enemy: {state.enemyScore}%</span>
        {config.ballCount > 0 && (
          <span className="text-orange-400 tabular-nums text-xs">
            ● {config.ballCount} ball{config.ballCount > 1 ? 's' : ''}
          </span>
        )}
        {config.bombCount > 0 && (
          <span className="text-rose-400 tabular-nums text-xs">
            ◉ {state.bombPatrols.length} bomb{state.bombPatrols.length !== 1 ? 's' : ''}
          </span>
        )}
      </TopBar>

      {/* Lives bar */}
      <div className="flex items-center gap-6 px-4 py-1.5 bg-gray-800 border-b border-gray-700 flex-shrink-0 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs">You</span>
          <LivesDisplay count={state.playerLives} max={config.lives} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs">Enemy</span>
          <LivesDisplay count={state.enemyLives} max={config.lives} />
        </div>
        <div className="ml-auto text-xs text-gray-500 tabular-nums">
          {state.playerDrawState === 'drawing' ? 'Drawing...' : 'On border'}
        </div>
      </div>

      {/* Challenge bar */}
      {config.challengeMode && state.activeChallenge && !isResults && (
        <div className="flex items-center gap-3 px-4 py-2 bg-indigo-950/60 border-b border-indigo-800 flex-shrink-0 text-xs font-mono">
          <Zap className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
          <span className="text-white">{state.activeChallenge.question}</span>
          <span className="ml-auto text-indigo-400 tabular-nums">+{state.challengeScore}</span>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 min-h-0 relative">
        <div ref={editorRef as React.RefObject<HTMLDivElement>} className="h-full" />
      </div>

      {/* Status bar */}
      <div
        ref={statusRef as React.RefObject<HTMLDivElement>}
        className="h-7 bg-gray-800 border-t border-gray-700 px-3 flex items-center text-xs text-gray-400 flex-shrink-0"
      />
    </div>
  )

  void getVisibleRange
}

// ── Public wrapper ────────────────────────────────────────────────────────────

type WrapperState = { screen: 'setup' } | { screen: 'game'; config: QvimxConfig }
type WrapperAction = { type: 'START'; config: QvimxConfig } | { type: 'QUIT' }

function wrapperReducer(_state: WrapperState, action: WrapperAction): WrapperState {
  switch (action.type) {
    case 'START':
      return { screen: 'game', config: action.config }
    case 'QUIT':
      return { screen: 'setup' }
  }
}

export function QvimxWrapper({ onBack }: { onBack: () => void }) {
  const [state, dispatch] = useReducer(wrapperReducer, { screen: 'setup' })

  if (state.screen === 'setup') {
    return <QvimxSetup onStart={config => dispatch({ type: 'START', config })} onBack={onBack} />
  }

  return (
    <QvimxGameScreen
      config={state.config}
      onQuit={() => {
        dispatch({ type: 'QUIT' })
        onBack()
      }}
    />
  )
}
