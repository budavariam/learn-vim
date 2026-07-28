import { useEffect, useReducer, useRef, useCallback, useState, useMemo } from 'react'
import type React from 'react'
import { useMonacoEditor } from '../hooks/useMonacoEditor'
import { loadHighScores, saveHighScores, addVimBotsHighScore } from '../engine/HighScoreEngine'
import { loadUsername } from '../engine/UserPrefs'
import { initGameState, tick, handleCommandExecuted } from '../engine/ChallengeEngine'
import { loadUnsupported, markUnsupported } from '../engine/UnsupportedEngine'
import type { VimBotsHighScoreEntry, GameState, GameConfig, VimCommandData } from '../engine/types'
import rawData from '../data.json'
import {
  initVimBotsState,
  movePlayer,
  teleport,
  safeTeleport,
  waitInPlace,
  startNextLevel,
  activeTypesForLevel,
  computeSafeCells,
  countSafeMoves,
} from '../engine/VimBotsEngine'
import type { VimBotsConfig, VimBotsState, Pos, VimBotsDifficulty } from '../engine/VimBotsEngine'
import { MOTION_CHALLENGE_CATEGORIES } from '../hooks/useMotionRace'
import { ScoreDisplay } from './ScoreDisplay'
import { LevelIndicator } from './LevelIndicator'
import { ChallengePanel } from './ChallengePanel'
import { TopBar } from './TopBar'
import { ArrowLeft, Zap, Shield, Trophy } from 'lucide-react'
import { VimBotsSetup, buildGridContent } from './VimBotsSetup'

const allCommands = rawData as VimCommandData[]

// ── Types ─────────────────────────────────────────────────────────────────────

export interface VimBotsGameProps {
  config: VimBotsConfig
  gridContent: string
  onQuit: () => void
  onReplay: () => void
  onViewHighScores: (difficulty: VimBotsDifficulty) => void
  onLevelComplete?: (level: number, score: number) => void
}

// ── Game state reducer ────────────────────────────────────────────────────────

type GameAction =
  | { type: 'MOVE'; pos: Pos }
  | { type: 'WAIT' }
  | { type: 'TELEPORT' }
  | { type: 'SAFE_TELEPORT' }
  | { type: 'NEXT_LEVEL' }
  | { type: 'USE_HELPER' }
  | { type: 'TRAPPED' }

function gameReducer(state: VimBotsState, action: GameAction): VimBotsState {
  switch (action.type) {
    case 'MOVE':
      return movePlayer(state, action.pos)
    case 'WAIT':
      return waitInPlace(state)
    case 'TELEPORT':
      return teleport(state)
    case 'SAFE_TELEPORT':
      return safeTeleport(state)
    case 'NEXT_LEVEL':
      return startNextLevel(state)
    case 'USE_HELPER':
      return state.helperGridLeft > 0
        ? { ...state, helperGridLeft: state.helperGridLeft - 1 }
        : state
    case 'TRAPPED':
      return { ...state, status: 'dead', message: 'No safe moves — you are trapped!' }
  }
}

// ── VimBotsGame ───────────────────────────────────────────────────────────────

export function VimBotsGame({
  config,
  gridContent,
  onQuit,
  onReplay,
  onViewHighScores,
  onLevelComplete,
}: VimBotsGameProps) {
  const initialState = initVimBotsState(config, gridContent)
  const [state, dispatch] = useReducer(gameReducer, initialState)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const decorationsRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const monacoRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorInstanceRef = useRef<any>(null)
  // Incremented when the editor becomes ready so decoration effects re-run
  const [editorReady, setEditorReady] = useState(0)
  // Helper grid: toggled by the HUD button, hidden on each player move
  const [helperActive, setHelperActive] = useState(false)

  // ── Arcade challenge engine (challenge mode) ────────────────────────────────
  const arcadeStateRef = useRef<GameState | null>(null)
  const arcadeCmdsRef = useRef<VimCommandData[]>([])
  const arcadeConfigRef = useRef<GameConfig | null>(null)
  const [arcadeState, setArcadeState] = useState<GameState | null>(null)

  // Initialise arcade engine on mount if challenge mode is on
  useEffect(() => {
    if (!config.challengeMode) return
    const cmds =
      config.challengeCategories.length > 0
        ? allCommands.filter(c => config.challengeCategories.includes(c.category))
        : allCommands.filter(c => MOTION_CHALLENGE_CATEGORIES.includes(c.category))
    const unsupported = loadUnsupported()
    const filtered = cmds.filter(c => !unsupported.has(c.id))
    const arcadeCfg: GameConfig = {
      mode: 'general',
      language: 'typescript',
      startingLevel: config.challengeStartingLevel,
      repetitionTarget: config.challengeRepetition,
      guidedMode: config.challengeGuidedMode,
      categories: null,
      dynamicAssist: null,
      commandTimeMultiplier: config.challengeTimeMultiplier,
      knowledgeFilter: 'all',
      drillMode: config.challengeDrillMode,
    }
    const initialArcade = initGameState(arcadeCfg, filtered)
    arcadeConfigRef.current = arcadeCfg
    arcadeCmdsRef.current = filtered
    arcadeStateRef.current = initialArcade
    setArcadeState(initialArcade)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Tick arcade engine every 100ms
  useEffect(() => {
    if (!config.challengeMode) return
    const id = setInterval(() => {
      if (!arcadeStateRef.current || !arcadeCmdsRef.current.length) return
      const next = tick(arcadeStateRef.current, arcadeCmdsRef.current, Date.now())
      arcadeStateRef.current = next
      setArcadeState(next)
    }, 100)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.challengeMode])

  const onCommandExecuted = useCallback((cmd: string) => {
    if (!arcadeStateRef.current || !arcadeCmdsRef.current.length) return
    const next = handleCommandExecuted(
      arcadeStateRef.current,
      cmd,
      arcadeCmdsRef.current,
      Date.now()
    )
    arcadeStateRef.current = next
    setArcadeState(next)
  }, [])
  // ──────────────────────────────────────────────────────────────────────────

  const stateRef = useRef(state)
  stateRef.current = state

  // Track previous player position to avoid re-triggering on same cell
  const prevPosRef = useRef<Pos>(initialState.playerPos)

  const onCursorChange = useCallback((position: { lineNumber: number; column: number }) => {
    const newPos: Pos = { row: position.lineNumber - 1, col: position.column - 1 }
    const prev = prevPosRef.current
    if (newPos.row === prev.row && newPos.col === prev.col) return
    prevPosRef.current = newPos
    const current = stateRef.current
    if (current.status !== 'playing') return
    setHelperActive(false) // hide helper on each move
    dispatch({ type: 'MOVE', pos: newPos })
  }, [])

  const onEditorCreated = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (monaco: any, editor: any) => {
      monacoRef.current = monaco
      editorInstanceRef.current = editor
      decorationsRef.current = editor.createDecorationsCollection([])
      setEditorReady(n => n + 1)
    },
    []
  )

  const { editorRef, statusRef, positionCursor, focusEditor } = useMonacoEditor({
    defaultValue: gridContent,
    readOnly: true,
    wordWrapOverride: 'off',
    onCommandExecuted: config.challengeMode ? onCommandExecuted : undefined,
    onCursorChange,
    onEditorCreated,
  })

  // Sync Monaco cursor when player position changes (e.g. teleport)
  const lastSyncedPosRef = useRef<Pos>(initialState.playerPos)
  useEffect(() => {
    const p = state.playerPos
    const last = lastSyncedPosRef.current
    if (p.row === last.row && p.col === last.col) return
    lastSyncedPosRef.current = p
    prevPosRef.current = p
    positionCursor({ lineNumber: p.row + 1, column: p.col + 1 })
  }, [state.playerPos, positionCursor])

  // Safe move count — recomputed only when robots or fire change
  // Declared here so the decoration effect can include it in deps
  const safeMoveCount = useMemo(
    () => countSafeMoves(state),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.robots, state.fire]
  )

  // Update decorations when state changes
  useEffect(() => {
    const col = decorationsRef.current
    const monaco = monacoRef.current
    if (!col || !monaco) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decs: any[] = []

    // Safe cells first (rendered below everything else)
    if (helperActive && config.enableHelperGrid) {
      for (const pos of computeSafeCells(state)) {
        decs.push({
          range: new monaco.Range(pos.row + 1, pos.col + 1, pos.row + 1, pos.col + 2),
          options: { inlineClassName: 'vimbots-safe', description: 'vimbots-safe' },
        })
      }
    }

    // Player — blue background
    const pr = state.playerPos.row + 1
    const pc = state.playerPos.col + 1
    decs.push({
      range: new monaco.Range(pr, pc, pr, pc + 1),
      options: { inlineClassName: 'vimbots-player', description: 'vimbots-player' },
    })

    // Robots — each uses its type-specific CSS class
    for (const robot of state.robots) {
      const rr = robot.pos.row + 1
      const rc = robot.pos.col + 1
      decs.push({
        range: new monaco.Range(rr, rc, rr, rc + 1),
        options: { inlineClassName: robot.type, description: robot.type },
      })
    }

    // Fire — orange with border
    for (const fire of state.fire) {
      const fr = fire.row + 1
      const fc = fire.col + 1
      decs.push({
        range: new monaco.Range(fr, fc, fr, fc + 1),
        options: { inlineClassName: 'vimbots-fire', description: 'vimbots-fire' },
      })
    }

    col.set(decs)
  }, [state.playerPos, state.robots, state.fire, editorReady, helperActive, safeMoveCount])

  // Notify parent on level complete
  const prevStatusRef = useRef(state.status)
  useEffect(() => {
    if (prevStatusRef.current !== 'level_cleared' && state.status === 'level_cleared') {
      onLevelComplete?.(state.level, state.score)
    }
    prevStatusRef.current = state.status
  }, [state.status, state.level, state.score, onLevelComplete])

  // Key handler for level_cleared → next level on any key
  useEffect(() => {
    if (state.status !== 'level_cleared') return

    const handler = (e: KeyboardEvent) => {
      if (['Meta', 'Control', 'Alt', 'Shift'].includes(e.key)) return
      dispatch({ type: 'NEXT_LEVEL' })
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [state.status])

  // Period key → wait in place (pass turn without moving)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== '.') return
      const s = stateRef.current
      if (s.status !== 'playing') return
      e.preventDefault()
      e.stopPropagation()
      setHelperActive(false)
      dispatch({ type: 'WAIT' })
    }
    document.addEventListener('keydown', handler, { capture: true })
    return () => document.removeEventListener('keydown', handler, { capture: true })
  }, [])

  // Focus editor on mount
  useEffect(() => {
    focusEditor()
  }, [focusEditor])

  const isDead = state.status === 'dead' || state.status === 'game_over'
  const isLevelCleared = state.status === 'level_cleared'

  // Trapped detection — 0 safe moves while playing = game over
  useEffect(() => {
    if (state.status === 'playing' && safeMoveCount === 0) {
      dispatch({ type: 'TRAPPED' })
    }
  }, [state.status, safeMoveCount])

  // Enter = play again, Escape = back to menu on game over
  useEffect(() => {
    if (!isDead) return

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        onReplay()
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        onQuit()
      }
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isDead, onReplay, onQuit])

  // Save score and compute rank when the game ends
  const [rank, setRank] = useState<number | null>(null)
  const scoreSavedRef = useRef(false)
  useEffect(() => {
    if (!isDead || scoreSavedRef.current) return
    scoreSavedRef.current = true

    const boardLabel = config.boardSource === 'grid' ? config.gridPreset : config.boardSource

    const entry: VimBotsHighScoreEntry = {
      id: crypto.randomUUID(),
      username: loadUsername(),
      timestamp: Date.now(),
      difficulty: config.difficulty,
      levelsCleared: state.level - 1,
      totalScore: state.score,
      challengeScore: arcadeStateRef.current?.score ?? 0,
      gridSize: boardLabel,
    }

    const scores = loadHighScores()
    const updated = addVimBotsHighScore(scores, entry)
    saveHighScores(updated)

    // Rank = position in the difficulty-filtered list (1-based)
    const sameLevel = updated.vimbots.filter(e => e.difficulty === config.difficulty)
    const pos = sameLevel.findIndex(e => e.id === entry.id)
    setRank(pos >= 0 ? pos + 1 : null)
  }, [isDead]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="h-full bg-gray-900 flex flex-col overflow-hidden font-mono relative">
      {/* Inline decoration styles — one per robot type + player + fire */}
      <style>{`
        .vimbots-player { background: rgba(59,130,246,0.7);  border-radius: 2px; }
        .borg           { background: rgba(239,68,68,0.75);   border-radius: 2px; }
        .reaper         { background: rgba(168,85,247,0.75);  border-radius: 2px; }
        .phantom        { background: rgba(34,211,238,0.75);  border-radius: 2px; }
        .inferno        { background: rgba(251,191,36,0.75);  border-radius: 2px; }
        .decimator      { background: rgba(248,250,252,0.85); border-radius: 2px; }
        .vimbots-fire   { background: rgba(249,115,22,0.65);  border-radius: 2px; outline: 2px solid rgba(253,186,116,0.9); outline-offset: -1px; }
        .vimbots-safe   { background: rgba(20,184,166,0.18);  border-radius: 2px; outline: 1px dashed rgba(45,212,191,0.55); outline-offset: -1px; }

        ${
          config.animatedEffects
            ? (() => {
                const t = Date.now() / 1000
                const fireOff = -(t % 1.4).toFixed(3)
                const offs = [2.0, 1.6, 1.3, 1.0, 0.8].map(d => `${-(t % d).toFixed(3)}s`)
                return `
          @keyframes vimbots-fire-glow {
            0%   { background: rgba(249,115,22,0.7);  outline-color: rgba(253,186,116,0.95); }
            25%  { background: rgba(239,68,68,0.85);  outline-color: rgba(252,165,165,1.0); }
            55%  { background: rgba(251,191,36,0.9);  outline-color: rgba(253,224,71,1.0); }
            80%  { background: rgba(249,115,22,0.75); outline-color: rgba(253,186,116,0.9); }
            100% { background: rgba(249,115,22,0.7);  outline-color: rgba(253,186,116,0.95); }
          }
          .vimbots-fire {
            animation: vimbots-fire-glow 1.4s ease-in-out infinite;
            animation-delay: ${fireOff}s;
          }

          @keyframes vimbots-pulse {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.2; }
          }
          .borg      { animation: vimbots-pulse 2.0s ease-in-out infinite; animation-delay: ${offs[0]}; }
          .reaper    { animation: vimbots-pulse 1.6s ease-in-out infinite; animation-delay: ${offs[1]}; }
          .phantom   { animation: vimbots-pulse 1.3s ease-in-out infinite; animation-delay: ${offs[2]}; }
          .inferno   { animation: vimbots-pulse 1.0s ease-in-out infinite; animation-delay: ${offs[3]}; }
          .decimator { animation: vimbots-pulse 0.8s ease-in-out infinite; animation-delay: ${offs[4]}; }
        `
              })()
            : ''
        }
      `}</style>

      {/* Header */}
      <TopBar
        title="VimBots"
        onBack={onQuit}
        backLabel={
          <>
            <ArrowLeft className="w-4 h-4" /> Quit
          </>
        }
      >
        <span className="text-yellow-300 tabular-nums font-bold">Level {state.level}</span>
        <span className="text-green-400 tabular-nums font-bold">Score {state.score}</span>
      </TopBar>

      {/* Game over overlay */}
      {isDead && (
        <div className="absolute inset-0 z-40 backdrop-blur-sm bg-gray-900/80 flex flex-col items-center justify-center px-6">
          <div className="w-full max-w-md bg-gray-900/90 border border-gray-600 rounded-2xl shadow-2xl p-8 text-center">
            <Trophy className="w-14 h-14 text-yellow-400 mx-auto mb-3" />
            <h2 className="text-3xl font-bold text-white mb-2">Game Over</h2>
            <p className="text-gray-400 text-sm mb-4">{state.message}</p>
            <div className="text-gray-300 text-lg font-bold mb-1">
              Final Score: <span className="text-green-400">{state.score}</span>
              <span className="text-gray-500 text-sm ml-3">
                {state.level > 1
                  ? `${state.level - 1} level${state.level - 1 !== 1 ? 's' : ''} cleared`
                  : 'Level 1'}
              </span>
            </div>
            {arcadeState && arcadeState.score > 0 && (
              <div className="text-sm text-indigo-400 mb-2">
                +{arcadeState.score} challenge pts
                <span className="text-gray-500 ml-2">
                  = {state.score + arcadeState.score} total
                </span>
              </div>
            )}
            {/* Rank badge */}
            {rank !== null && (
              <div
                className={`mb-4 text-sm font-mono font-bold ${rank <= 3 ? 'text-yellow-400' : 'text-blue-300'}`}
              >
                {rank === 1
                  ? '🥇 New #1 on '
                  : rank === 2
                    ? '🥈 #2 on '
                    : rank === 3
                      ? '🥉 #3 on '
                      : `#${rank} on `}
                <span className="capitalize">{config.difficulty}</span> leaderboard
                {' · '}
                <button
                  onClick={() => onViewHighScores(config.difficulty)}
                  className="underline underline-offset-2 hover:text-white transition-colors"
                >
                  view scores
                </button>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={onReplay}
                className="flex-1 py-2.5 rounded bg-green-700 hover:bg-green-600 text-white font-bold text-sm transition-colors"
              >
                Play again
                <span className="ml-1.5 text-green-300 font-normal text-xs opacity-80">↵</span>
              </button>
              <button
                onClick={onQuit}
                className="flex-1 py-2.5 rounded bg-gray-700 hover:bg-gray-600 text-white font-bold text-sm transition-colors"
              >
                Back to menu
                <span className="ml-1.5 text-gray-400 font-normal text-xs opacity-80">Esc</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Level cleared overlay */}
      {isLevelCleared && (
        <div className="absolute inset-0 z-40 backdrop-blur-sm bg-gray-900/70 flex flex-col items-center justify-center px-6 pointer-events-none">
          <div className="bg-gray-900/90 border border-green-700 rounded-2xl shadow-2xl p-8 text-center pointer-events-none">
            <div className="text-4xl mb-2">🎉</div>
            <h2 className="text-2xl font-bold text-green-400 mb-2">{state.message}</h2>
            <p className="text-gray-400 text-sm mt-3 animate-pulse">Press any key to continue…</p>
          </div>
        </div>
      )}

      {/* Challenge bar — shown when challenge mode active and a challenge is queued */}
      {config.challengeMode &&
        arcadeState &&
        arcadeState.activeChallenges.length > 0 &&
        !isDead &&
        !isLevelCleared &&
        (() => {
          const ch = arcadeState.activeChallenges.find(c => c.status === 'active')
          if (!ch) return null
          return (
            <div className="flex items-center gap-3 px-4 py-2 bg-indigo-950/60 border-b border-indigo-800 flex-shrink-0 text-xs font-mono">
              <Zap className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
              <span className="text-white">{ch.question}</span>
              {ch.showSolution && ch.solution.length > 0 && (
                <div className="flex gap-1 ml-1">
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
              <span className="ml-auto text-indigo-400 tabular-nums">+{arcadeState.score}</span>
            </div>
          )
        })()}

      {/* Main content row */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Monaco editor — left flex-[3] */}
        <div className="flex-[3] min-w-0 min-h-0 relative">
          <div ref={editorRef as React.RefObject<HTMLDivElement>} className="h-full" />
        </div>

        {/* Sidebar HUD — right flex-[2] */}
        <div className="flex-[2] min-w-[200px] max-w-xs bg-gray-800 border-l border-gray-700 flex flex-col gap-0 overflow-y-auto">
          {/* Challenge panel (challenge mode) */}
          {config.challengeMode && arcadeState && (
            <div className="px-3 pt-3 pb-1 border-b border-gray-700 flex gap-2 items-start flex-shrink-0">
              <ScoreDisplay score={arcadeState.score} combo={arcadeState.combo} />
              <LevelIndicator ceiling={arcadeState.ceiling} levelPct={arcadeState.levelPct} />
            </div>
          )}
          {config.challengeMode && arcadeState && (
            <div className="px-3 py-2 border-b border-gray-700 max-h-48 overflow-y-auto flex-shrink-0">
              <ChallengePanel
                challenges={arcadeState.activeChallenges}
                onMarkUnsupported={id => {
                  markUnsupported(id)
                  arcadeCmdsRef.current = arcadeCmdsRef.current.filter(c => c.id !== id)
                  if (arcadeStateRef.current) {
                    arcadeStateRef.current = {
                      ...arcadeStateRef.current,
                      activeChallenges: arcadeStateRef.current.activeChallenges.map(c =>
                        c.commandId === id ? { ...c, status: 'failed' as const } : c
                      ),
                    }
                    setArcadeState(arcadeStateRef.current)
                  }
                }}
              />
            </div>
          )}
          {/* Level & Score */}
          <div className="px-4 py-3 border-b border-gray-700">
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Level</div>
            <div className="text-3xl font-bold text-yellow-300 tabular-nums">{state.level}</div>
          </div>
          <div className="px-4 py-3 border-b border-gray-700">
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Score</div>
            <div className="text-2xl font-bold text-green-400 tabular-nums">{state.score}</div>
          </div>

          {/* Enemy legend — per type */}
          <div className="px-4 py-3 border-b border-gray-700">
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">
              Enemies{' '}
              <span className="text-white font-bold tabular-nums">{state.robots.length}</span>
              <span className="text-gray-500"> / {state.initialRobotCount}</span>
            </div>
            {activeTypesForLevel(
              Math.max(1, (config.startingEnemyLevel ?? 1) + state.level - 1)
            ).map(def => {
              const current = state.robots.filter(r => r.type === def.type).length
              const initial = state.initialRobotsByType[def.type] ?? 0
              if (initial === 0) return null
              return (
                <div key={def.type} className="flex items-center gap-2 mb-1.5">
                  <span
                    className="inline-block w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ background: def.color, outline: def.outline, outlineOffset: '-1px' }}
                  />
                  <span className="text-xs text-gray-300 flex-1">{def.name}</span>
                  <span className="text-xs text-gray-400 tabular-nums">
                    <span
                      className={
                        current === 0 ? 'text-gray-600 line-through' : 'text-white font-bold'
                      }
                    >
                      {current}
                    </span>
                    <span className="text-gray-600"> / {initial}</span>
                  </span>
                  <span className="text-gray-600 text-[10px]">×{def.speed}</span>
                </div>
              )
            })}
            <div className="flex items-center justify-between text-sm mt-2 pt-1.5 border-t border-gray-700/60">
              <span className="text-orange-400 text-xs">🔥 Fire</span>
              <span className="font-bold text-white tabular-nums text-xs">{state.fire.length}</span>
            </div>
            <div
              className={`flex items-center justify-between text-sm mt-1 pt-1 border-t border-gray-700/60`}
            >
              <span
                className={`text-xs ${safeMoveCount === 0 ? 'text-red-400 font-bold' : 'text-teal-400'}`}
              >
                {safeMoveCount === 0 ? '⚠ Safe moves' : '✦ Safe moves'}
              </span>
              <span
                className={`font-bold tabular-nums text-xs ${safeMoveCount === 0 ? 'text-red-400' : safeMoveCount <= 3 ? 'text-yellow-400' : 'text-teal-300'}`}
              >
                {safeMoveCount}
              </span>
            </div>
          </div>

          {/* Wait + Teleport buttons */}
          <div className="px-4 py-3 border-b border-gray-700 flex flex-col gap-2">
            {/* Wait — pass turn without moving */}
            <button
              onClick={() => {
                dispatch({ type: 'WAIT' })
                focusEditor()
              }}
              disabled={state.status !== 'playing'}
              className="flex items-center gap-2 px-3 py-2 rounded bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-bold transition-colors w-full"
              title="Pass turn — let robots advance without moving (.)"
            >
              <span className="text-base leading-none">⏸</span>
              <span>
                Wait <span className="text-gray-400 font-normal text-xs ml-1">(.)</span>
              </span>
            </button>
            {config.enableTeleport && (
              <button
                onClick={() => {
                  setHelperActive(false)
                  dispatch({ type: 'TELEPORT' })
                  focusEditor()
                }}
                disabled={state.teleportsLeft <= 0 || state.status !== 'playing'}
                className="flex items-center gap-2 px-3 py-2 rounded bg-indigo-700 hover:bg-indigo-600 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-bold transition-colors w-full"
              >
                <Zap className="w-4 h-4 flex-shrink-0" />
                <span>Teleport ({state.teleportsLeft} left)</span>
              </button>
            )}
            {config.enableSafeTeleport && (
              <button
                onClick={() => {
                  setHelperActive(false)
                  dispatch({ type: 'SAFE_TELEPORT' })
                  focusEditor()
                }}
                disabled={state.safeTeleportsLeft <= 0 || state.status !== 'playing'}
                className="flex items-center gap-2 px-3 py-2 rounded bg-teal-700 hover:bg-teal-600 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-bold transition-colors w-full"
              >
                <Shield className="w-4 h-4 flex-shrink-0" />
                <span>Safe Teleport ({state.safeTeleportsLeft} left)</span>
              </button>
            )}
            {config.enableHelperGrid && (
              <button
                onClick={() => {
                  if (!helperActive && state.helperGridLeft > 0) {
                    dispatch({ type: 'USE_HELPER' })
                    setHelperActive(true)
                  } else {
                    setHelperActive(h => !h)
                  }
                  focusEditor()
                }}
                disabled={!helperActive && state.helperGridLeft <= 0}
                className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-bold transition-colors w-full ${
                  helperActive
                    ? 'bg-teal-600 hover:bg-teal-500 text-white'
                    : state.helperGridLeft > 0
                      ? 'bg-teal-900/60 hover:bg-teal-800/60 border border-teal-700 text-teal-300'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span className="text-base leading-none">🔍</span>
                <span>
                  {helperActive
                    ? 'Hide safe cells'
                    : `Show safe cells (${state.helperGridLeft} left)`}
                </span>
              </button>
            )}
          </div>

          {/* Status message */}
          <div className="px-4 py-3 border-b border-gray-700 flex-1">
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Status</div>
            <div
              className={`text-sm font-mono leading-relaxed ${
                state.status === 'dead' || state.status === 'game_over'
                  ? 'text-red-400'
                  : state.status === 'level_cleared'
                    ? 'text-green-400'
                    : 'text-gray-300'
              }`}
            >
              {state.message || 'Playing…'}
            </div>
          </div>

          {/* Player indicator */}
          <div className="px-4 py-2 border-b border-gray-700">
            <div className="text-xs text-gray-500">
              Player @ row {state.playerPos.row + 1}, col {state.playerPos.col + 1}
            </div>
          </div>

          {/* Quit / Replay buttons */}
          <div className="px-4 py-3 flex flex-col gap-2">
            {isDead && (
              <button
                onClick={onReplay}
                className="w-full px-3 py-2 rounded bg-green-700 hover:bg-green-600 text-white text-sm font-bold transition-colors"
              >
                Play again
              </button>
            )}
            <button
              onClick={onQuit}
              className="w-full px-3 py-2 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-bold transition-colors"
            >
              {isDead ? 'Back to menu' : 'Quit'}
            </button>
          </div>
        </div>
      </div>

      {/* Vim status bar */}
      <div
        ref={statusRef as React.RefObject<HTMLDivElement>}
        className="h-7 bg-gray-800 border-t border-gray-700 px-3 flex items-center text-xs text-gray-400 flex-shrink-0"
      />
    </div>
  )
}

// ── VimBotsWrapper ────────────────────────────────────────────────────────────

type WrapperState =
  | { screen: 'setup' }
  | { screen: 'game'; config: VimBotsConfig; gridContent: string; playKey: number }

type WrapperAction =
  { type: 'START'; config: VimBotsConfig; gridContent: string } | { type: 'QUIT' }

function wrapperReducer(prev: WrapperState, action: WrapperAction): WrapperState {
  switch (action.type) {
    case 'START': {
      const prevKey = prev.screen === 'game' ? prev.playKey : 0
      return {
        screen: 'game',
        config: action.config,
        gridContent: action.gridContent,
        playKey: prevKey + 1,
      }
    }
    case 'QUIT':
      return { screen: 'setup' }
  }
}

export function VimBotsWrapper({
  onBack,
  onViewHighScores,
}: {
  onBack: () => void
  onViewHighScores: (difficulty: VimBotsDifficulty) => void
}) {
  const [state, dispatch] = useReducer(wrapperReducer, { screen: 'setup' })

  if (state.screen === 'setup') {
    return (
      <VimBotsSetup
        onStart={(config, gridContent) => dispatch({ type: 'START', config, gridContent })}
        onBack={onBack}
      />
    )
  }

  return (
    <VimBotsGame
      key={state.playKey}
      config={state.config}
      gridContent={state.gridContent}
      onQuit={() => dispatch({ type: 'QUIT' })}
      onReplay={() => {
        const fresh = buildGridContent(
          state.config.boardSource,
          state.config.gridPreset,
          state.config.customRows,
          state.config.customCols,
          state.config.codeFileSize
        )
        dispatch({ type: 'START', config: state.config, gridContent: fresh })
      }}
      onViewHighScores={onViewHighScores}
    />
  )
}
