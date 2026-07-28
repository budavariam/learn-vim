import { useState, useEffect, useCallback, useRef } from 'react'
import type React from 'react'
import { useMotionRace } from '../hooks/useMotionRace'
import type { MotionRaceConfig, CompletedPath } from '../hooks/useMotionRace'
import { TopBar } from './TopBar'
import { MotionRaceSetup, ENEMY_PALETTE_COLORS } from './MotionRaceSetup'
import {
  SnowOverlay,
  OpacityFadeOverlay,
  ConfettiOverlay,
  PenaltyFlash,
} from './GameOverlays'
import { ArrowLeft, Zap, Skull, Trophy, Timer, Check } from 'lucide-react'

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtMs(ms: number) {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  return m > 0 ? `${m}:${String(s % 60).padStart(2, '0')}` : `${s}s`
}

function fmtCountdown(remainMs: number) {
  const ms = Math.max(0, remainMs)
  const s = Math.ceil(ms / 1000)
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

function PathPill({ path, idx }: { path: CompletedPath; idx: number }) {
  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono border ${
        path.valid
          ? 'bg-green-900/30 border-green-800 text-green-300'
          : 'bg-red-900/30 border-red-800 text-red-400'
      }`}
    >
      <span className="text-gray-500">#{idx + 1}</span>
      <span>{path.keystrokes}k</span>
      <span className="text-gray-500">·</span>
      <span>{fmtMs(path.elapsedMs)}</span>
      {!path.valid && <span title="Text was modified">⚠</span>}
    </div>
  )
}

// ── Off-screen goal indicator ─────────────────────────────────────────────────

interface GoalIndicatorProps {
  goalLine: number
  isVisible: boolean
  getRange: () => { startLine: number; endLine: number } | null
}

function GoalIndicator({ goalLine, isVisible, getRange }: GoalIndicatorProps) {
  if (isVisible) return null
  const range = getRange()
  if (!range) return null
  const dir = goalLine < range.startLine ? '↑' : '↓'
  return (
    <div
      className={`absolute right-4 ${dir === '↑' ? 'top-2' : 'bottom-2'} z-20 pointer-events-none`}
    >
      <span className="bg-yellow-800/80 text-yellow-300 text-lg font-bold px-2 py-1 rounded shadow-lg border border-yellow-700">
        {dir} Goal
      </span>
    </div>
  )
}

// ── Game screen ───────────────────────────────────────────────────────────────

interface GameProps {
  config: MotionRaceConfig
  onQuit: () => void
}

function MotionRaceGameScreen({ config, onQuit }: GameProps) {
  const { state, editorRef, statusRef, startGame, getVisibleRange, totalLines } = useMotionRace()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    startGame(config)
  }, [])

  const [isGoalVisible, setIsGoalVisible] = useState(true)

  // Handicap effect state
  const [confettiActive, setConfettiActive] = useState(false)
  const [penaltyActive, setPenaltyActive] = useState(false)
  const prevUserScore = useRef(0)
  const prevEnemyScore = useRef(0)

  useEffect(() => {
    if (state.userScore > prevUserScore.current) setConfettiActive(true)
    prevUserScore.current = state.userScore
  }, [state.userScore])

  useEffect(() => {
    if (state.enemyScore > prevEnemyScore.current) setPenaltyActive(true)
    prevEnemyScore.current = state.enemyScore
  }, [state.enemyScore])

  useEffect(() => {
    if (!penaltyActive) return
    const id = setTimeout(() => setPenaltyActive(false), 800)
    return () => clearTimeout(id)
  }, [penaltyActive])

  const [collisionToast, setCollisionToast] = useState(0)

  useEffect(() => {
    if (state.lastCollision > 0) {
      setCollisionToast(state.lastCollision)
      const id = setTimeout(() => setCollisionToast(0), 1200)
      return () => clearTimeout(id)
    }
  }, [state.lastCollision])

  const checkVisibility = useCallback(() => {
    const range = getVisibleRange()
    if (!range || !state.goals.length) {
      setIsGoalVisible(true)
      return
    }
    const primary = state.goals[0]
    setIsGoalVisible(primary.lineNumber >= range.startLine && primary.lineNumber <= range.endLine)
  }, [getVisibleRange, state.goals])

  useEffect(() => {
    checkVisibility()
  }, [checkVisibility])

  const {
    goals,
    currentPos,
    keystrokes,
    contentValid,
    completedPaths,
    totalElapsedMs,
    pathElapsedMs,
    userScore,
    enemyScore,
  } = state

  const isResults = state.status === 'results'
  const primaryGoal = goals[0]
  const atTarget =
    !isResults && primaryGoal
      ? currentPos.lineNumber === primaryGoal.lineNumber && currentPos.column === primaryGoal.column
      : false
  const remainMs =
    config.endGoal === 'timed' ? Math.max(0, config.durationMs - totalElapsedMs) : null
  const pathsDone = completedPaths.length
  const validCount = completedPaths.filter(p => p.valid).length

  // Results computed lazily (only used when isResults)
  const avgKeys =
    pathsDone > 0
      ? (completedPaths.reduce((a, p) => a + p.keystrokes, 0) / pathsDone).toFixed(1)
      : '—'
  const avgTime =
    pathsDone > 0 ? fmtMs(completedPaths.reduce((a, p) => a + p.elapsedMs, 0) / pathsDone) : '—'

  return (
    <div className="h-full bg-gray-900 flex flex-col overflow-hidden font-mono relative">
      {/* Collision Toast */}
      {collisionToast > 0 && !isResults && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-900/90 border-2 border-red-500 text-red-200 font-bold px-6 py-3 rounded-lg shadow-2xl z-50 pointer-events-none animate-pulse">
          Blocked by trail!
        </div>
      )}

      {/* Results overlay — glossy frosted glass over the editor */}
      {isResults && (
        <div className="absolute inset-0 z-40 backdrop-blur-sm bg-gray-900/80 flex flex-col items-center justify-center px-6">
          <div className="w-full max-w-lg bg-gray-900/90 border border-gray-600 rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-3">
                {state.endReason === 'survival' ? (
                  <Skull className="w-14 h-14 text-red-400" />
                ) : (
                  <Trophy className="w-14 h-14 text-yellow-400" />
                )}
              </div>
              <h2 className="text-3xl font-bold text-white mb-1">
                {state.endReason === 'survival' ? 'You hit a trail!' : 'Finished!'}
              </h2>
              <p className="text-gray-400 text-sm">{fmtMs(totalElapsedMs)} total</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4 text-center">
              <StatCard value={validCount} label="Your goals" color="text-green-400" />
              <StatCard value={avgKeys} label="Avg keys" color="text-blue-400" />
              <StatCard value={avgTime} label="Avg time" color="text-purple-400" />
            </div>

            {config.enemyCount > 0 && (
              <div className="text-center mb-4 text-orange-400 text-sm">
                Enemies scored: <span className="font-bold">{enemyScore}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-8 max-h-32 overflow-y-auto">
              {completedPaths.map((p, i) => (
                <PathPill key={i} path={p} idx={i} />
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => startGame(config)}
                className="w-full py-2.5 rounded bg-green-700 hover:bg-green-600 text-white font-bold text-sm transition-colors"
              >
                Play again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header — always visible */}
      <TopBar
        title="Motion Race"
        onBack={onQuit}
        backLabel={
          <>
            <ArrowLeft className="w-4 h-4" /> Quit
          </>
        }
      >
        {config.endGoal === 'timed' && remainMs !== null ? (
          <span
            className={`font-bold tabular-nums flex items-center gap-1 ${remainMs < 10_000 ? 'text-red-400' : 'text-blue-300'}`}
          >
            <Timer className="w-3.5 h-3.5" /> {fmtCountdown(remainMs)}
          </span>
        ) : (
          <span className="text-gray-400 tabular-nums">
            <span className="text-green-400 font-bold">{userScore}</span>
            {config.endGoal === 'user_count' && (
              <span className="text-gray-600"> / {config.targetCount}</span>
            )}
            {' goals'}
          </span>
        )}
        {config.enemyCount > 0 && (
          <span className="text-orange-400 tabular-nums text-xs">enemies: {enemyScore}</span>
        )}
        <span className="text-gray-500 tabular-nums">{fmtMs(pathElapsedMs)}</span>
        <span className="text-gray-500 tabular-nums">{keystrokes} keys</span>
      </TopBar>

      {/* Target bar */}
      <div
        className={`flex items-center gap-4 px-4 py-2.5 border-b flex-shrink-0 text-sm transition-colors ${
          !contentValid
            ? 'bg-red-900/40 border-red-700'
            : atTarget
              ? 'bg-green-900/40 border-green-700'
              : 'bg-gray-800 border-gray-700'
        }`}
      >
        {config.goalDisplayMode === 'next' && primaryGoal ? (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Goal</span>
            <kbd className="px-2 py-0.5 bg-yellow-900/60 border border-yellow-700 rounded text-xs text-yellow-300 font-bold">
              L{primaryGoal.lineNumber} C{primaryGoal.column}
            </kbd>
            <span className="text-gray-600 text-xs">
              #{pathsDone + 1}
              {config.endGoal === 'user_count' ? ` / ${config.targetCount}` : ''}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-gray-400 text-xs">Goals:</span>
            {goals.slice(0, 6).map((g, i) => (
              <kbd
                key={i}
                className="px-1.5 py-0.5 bg-yellow-900/60 border border-yellow-700 rounded text-xs text-yellow-300 font-bold"
              >
                L{g.lineNumber}C{g.column}
              </kbd>
            ))}
            {goals.length > 6 && <span className="text-gray-500 text-xs">+{goals.length - 6}</span>}
          </div>
        )}
        <div className="ml-auto flex items-center gap-3">
          {!contentValid && <span className="text-red-400 text-xs font-bold">⚠ Text modified</span>}
          {atTarget && contentValid && (
            <span className="text-green-400 text-xs font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> On target!
            </span>
          )}
          <span className="text-gray-500 text-xs tabular-nums">
            L{currentPos.lineNumber} C{currentPos.column}
          </span>
        </div>
      </div>

      {/* Challenge bar — shown when challenge mode is on and a challenge is active */}
      {config.challengeMode &&
        state.activeChallenge &&
        !isResults &&
        (() => {
          const ch = state.activeChallenge
          const gm = config.challengeGuidedMode ?? 'none'
          // Determine whether to show solution keys based on guided mode
          // For simplicity: 'all' always shows, 'none' never shows, others show
          const showSolution =
            gm === 'all' ||
            gm === 'first_only' ||
            gm === 'first_then_failure' ||
            gm === 'alternating'
          return (
            <div className="flex items-center gap-3 px-4 py-2 bg-indigo-950/60 border-b border-indigo-800 flex-shrink-0 text-xs font-mono">
              <Zap className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
              <span className="text-white">{ch.question}</span>
              {showSolution && (
                <div className="flex gap-1.5 ml-1">
                  {ch.solution.map((s, i) => (
                    <kbd
                      key={i}
                      className="px-1.5 py-0.5 bg-gray-700 text-yellow-300 rounded border border-gray-600"
                    >
                      {s}
                    </kbd>
                  ))}
                </div>
              )}
              <span className="ml-auto text-indigo-400 tabular-nums">+{state.challengeScore}</span>
            </div>
          )
        })()}

      {/* Editor + Minimap row — always mounted so Monaco stays alive through Play Again */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Editor area with overlays */}
        <div className="flex-1 relative min-w-0">
          <div ref={editorRef as React.RefObject<HTMLDivElement>} className="h-full" />
          {config.snowEffect && <SnowOverlay />}
          {config.confettiOnGoal && (
            <ConfettiOverlay isActive={confettiActive} onDone={() => setConfettiActive(false)} />
          )}
          {config.penaltyFlash && <PenaltyFlash isActive={penaltyActive} />}
          {config.opacityFade && (
            <OpacityFadeOverlay
              cursorLine={state.currentPos.lineNumber}
              getVisibleRange={getVisibleRange}
            />
          )}
          {primaryGoal && !isResults && (
            <GoalIndicator
              goalLine={primaryGoal.lineNumber}
              isVisible={isGoalVisible}
              getRange={getVisibleRange}
            />
          )}
        </div>

        {/* Minimap sidebar — enemies (orange) and goals (yellow), no trails */}
        {config.showMinimap && (
          <RaceMinimap
            totalLines={totalLines || 200}
            goals={state.goals}
            enemies={state.enemies}
            cursorLine={state.currentPos.lineNumber}
            visibleRange={getVisibleRange()}
          />
        )}
      </div>

      <div
        ref={statusRef as React.RefObject<HTMLDivElement>}
        className="h-7 bg-gray-800 border-t border-gray-700 px-3 flex items-center text-xs text-gray-400 flex-shrink-0"
      />

      {completedPaths.length > 0 && !isResults && (
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-t border-gray-700 flex-shrink-0 overflow-x-auto">
          {completedPaths.slice(-8).map((p, i) => (
            <PathPill
              key={i}
              path={p}
              idx={completedPaths.length - Math.min(8, completedPaths.length) + i}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({
  value,
  label,
  color,
}: {
  value: string | number
  label: string
  color: string
}) {
  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  )
}

// ── Minimap component ─────────────────────────────────────────────────────────

import type { Enemy } from '../hooks/useMotionRace'

interface MinimapProps {
  totalLines: number
  goals: { lineNumber: number; column: number }[]
  enemies: Enemy[]
  cursorLine: number
  visibleRange: { startLine: number; endLine: number } | null
}

function RaceMinimap({ totalLines, goals, enemies, cursorLine, visibleRange }: MinimapProps) {
  const pct = (line: number) => `${Math.round((line / Math.max(1, totalLines)) * 100)}%`

  return (
    <div className="w-12 flex-shrink-0 border-l border-gray-700 bg-gray-950 relative overflow-hidden select-none">
      {/* Viewport highlight */}
      {visibleRange && (
        <div
          className="absolute inset-x-0 bg-white/8 pointer-events-none"
          style={{
            top: pct(visibleRange.startLine),
            height: pct(visibleRange.endLine - visibleRange.startLine + 1),
          }}
        />
      )}

      {/* Goal positions — yellow diamonds */}
      {goals.map((g, i) => (
        <div
          key={`gm-${i}`}
          className="absolute w-2 h-2 bg-yellow-400 rotate-45 pointer-events-none"
          style={{
            top: pct(g.lineNumber),
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(45deg)',
          }}
        />
      ))}

      {/* Enemy positions — each with its palette hue */}
      {enemies.map(e => (
        <div
          key={`em-${e.id}`}
          className="absolute w-2 h-2 rounded-full pointer-events-none"
          style={{
            top: pct(e.pos.lineNumber),
            right: '6px',
            transform: 'translateY(-50%)',
            backgroundColor: ENEMY_PALETTE_COLORS[e.colorIdx % ENEMY_PALETTE_COLORS.length],
          }}
        />
      ))}

      {/* User cursor — blue circle */}
      <div
        className="absolute w-2.5 h-2.5 rounded-full bg-blue-400 pointer-events-none"
        style={{ top: pct(cursorLine), left: '6px', transform: 'translateY(-50%)' }}
      />

      {/* Label */}
      <div className="absolute bottom-1 inset-x-0 text-center text-gray-600 text-[9px] leading-none select-none">
        map
      </div>
    </div>
  )
}

// ── Public wrapper ────────────────────────────────────────────────────────────

export function MotionRaceWrapper({ onBack }: { onBack: () => void }) {
  const [config, setConfig] = useState<MotionRaceConfig | null>(null)

  if (!config) {
    return <MotionRaceSetup onStart={setConfig} onBack={onBack} />
  }

  return (
    <MotionRaceGameContainer
      config={config}
      onQuit={() => {
        setConfig(null)
      }}
      onBack={onBack}
    />
  )
}

function MotionRaceGameContainer({ config, onQuit, onBack }: GameProps & { onBack: () => void }) {
  return (
    <MotionRaceGameScreen
      config={config}
      onQuit={() => {
        onQuit()
        onBack()
      }}
    />
  )
}
