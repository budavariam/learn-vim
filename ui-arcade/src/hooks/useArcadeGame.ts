import { useState, useReducer, useEffect, useRef, useCallback } from 'react'
import type { GameState, GameConfig, GameSettings, HighScores, VimCommandData, ReviewItem } from '../engine/types'
import { initGameState, tick, handleCommandExecuted, updateLiveSettings } from '../engine/ChallengeEngine'
import { loadHighScores, saveHighScores, addHighScore, buildHighScoreEntry } from '../engine/HighScoreEngine'
import { shouldSuggestKnown, loadKnown } from '../engine/KnownEngine'
import rawData from '../data.json'
import { loadUnsupported, markUnsupported } from '../engine/UnsupportedEngine'

const allCommands = rawData as VimCommandData[]
const TICK_INTERVAL_MS = 100
const CONFIG_STORAGE_KEY = 'vim_arcade_last_config'

function loadLastConfig(): GameConfig | null {
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY)
    if (!raw) return null
    const config = JSON.parse(raw) as GameConfig
    // Fix (Bug #9): configs saved before dynamicAssist was added have the field
    // absent (undefined). undefined !== null, so the engine would compute
    // Math.min(100, undefined) = NaN and silently break the assist logic.
    config.dynamicAssist    = config.dynamicAssist ?? null
    config.knowledgeFilter  = config.knowledgeFilter ?? 'all'
    return config
  } catch { return null }
}

function saveLastConfig(config: GameConfig) {
  try { localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config)) } catch { /* ignore */ }
}

function buildReviewItems(state: GameState, sessionCommands: VimCommandData[]): ReviewItem[] {
  const known = loadKnown()
  const seen  = new Map<string, VimCommandData>()
  for (const cmd of sessionCommands) seen.set(cmd.id, cmd)

  const items: ReviewItem[] = []

  for (const [level, prog] of Object.entries(state.levelProgress)) {
    const allIds = new Set([...prog.completionCounts.keys(), ...prog.failureCounts.keys()])
    for (const id of allIds) {
      const cmd = seen.get(id)
      if (!cmd) continue
      const completions = prog.completionCounts.get(id) ?? 0
      const failures    = prog.failureCounts.get(id) ?? 0
      items.push({
        commandId:    id,
        question:     cmd.question,
        solution:     cmd.solution,
        category:     cmd.category,
        level:        Number(level),
        completions,
        failures,
        suggestKnown: shouldSuggestKnown(completions, failures),
        alreadyKnown: known.has(id),
      })
    }
  }

  // Sort: suggested first, then by success rate desc
  return items.sort((a, b) => {
    if (a.suggestKnown !== b.suggestKnown) return a.suggestKnown ? -1 : 1
    const ra = a.completions / Math.max(1, a.completions + a.failures)
    const rb = b.completions / Math.max(1, b.completions + b.failures)
    return rb - ra
  })
}

export interface UseArcadeGameReturn {
  state: GameState
  lastConfig: GameConfig | null
  reviewItems: ReviewItem[]
  startGame: (config: GameConfig) => void
  onCommandExecuted: (cmd: string) => void
  resetGame: () => void
  updateSettings: (patch: Partial<GameSettings>) => void
  highScores: HighScores
  showingHighScores: boolean
  openHighScores: () => void
  closeHighScores: () => void
  markChallengeUnsupported: (commandId: string) => void
}

function makeSetupState(): GameState {
  const config: GameConfig = {
    mode: 'general',
    language: 'typescript',
    startingLevel: 0,
    repetitionTarget: 1,
    guidedMode: 'none',
    categories: null,
    dynamicAssist: null,
    skipUnsupported: true,
    knowledgeFilter: 'all',
  }
  return {
    status: 'setup',
    config,
    liveSettings: { guidedMode: 'none' },
    language: 'typescript',
    startingLevel: 0,
    activeChallenges: [],
    maxConcurrent: 1,
    ceiling: 0,
    score: 0,
    combo: { count: 0, multiplier: 1.0 },
    levelProgress: {},
    sessionStats: {
      totalChallenges: 0,
      completed: 0,
      failed: 0,
      totalPoints: 0,
      bestCombo: 0,
      startedAt: 0,
      expectedTimeMs: 0,
      achievedTimeMs: 0,
    },
    recentNotifications: [],
    levelPct: 0,
    sessionElapsedMs: 0,
    pendingVerifications: [],
  }
}

// ── Reducer ──────────────────────────────────────────────────────────────────

type ArcadeHookState = {
  gameState: GameState
  highScores: HighScores
  reviewItems: ReviewItem[]
  showingHighScores: boolean
}

type ArcadeHookAction =
  | { type: 'SET_GAME_STATE'; value: GameState }
  | { type: 'SET_GAME_STATE_FN'; fn: (prev: GameState) => GameState }
  | { type: 'SET_HIGH_SCORES'; value: HighScores }
  | { type: 'SET_HIGH_SCORES_FN'; fn: (prev: HighScores) => HighScores }
  | { type: 'SET_REVIEW_ITEMS'; value: ReviewItem[] }
  | { type: 'SET_SHOWING_HIGH_SCORES'; value: boolean }

function arcadeHookReducer(state: ArcadeHookState, action: ArcadeHookAction): ArcadeHookState {
  switch (action.type) {
    case 'SET_GAME_STATE':
      return { ...state, gameState: action.value }
    case 'SET_GAME_STATE_FN':
      return { ...state, gameState: action.fn(state.gameState) }
    case 'SET_HIGH_SCORES':
      return { ...state, highScores: action.value }
    case 'SET_HIGH_SCORES_FN':
      return { ...state, highScores: action.fn(state.highScores) }
    case 'SET_REVIEW_ITEMS':
      return { ...state, reviewItems: action.value }
    case 'SET_SHOWING_HIGH_SCORES':
      return { ...state, showingHighScores: action.value }
    default:
      return state
  }
}

function makeInitialArcadeState(): ArcadeHookState {
  return {
    gameState:         makeSetupState(),
    highScores:        loadHighScores(),
    reviewItems:       [],
    showingHighScores: false,
  }
}

// ─────────────────────────────────────────────────────────────────────────────

export function useArcadeGame(): UseArcadeGameReturn {
  const [hs, dispatch] = useReducer(arcadeHookReducer, undefined, makeInitialArcadeState)
  // lastConfig is initialised from localStorage and never changes after mount —
  // effectively a read-once constant.
  const [lastConfig] = useState<GameConfig | null>(loadLastConfig)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  // Holds the filtered command list for the current session so the interval
  // callback always uses the correct category-filtered set.
  const activeCommandsRef = useRef<VimCommandData[]>(allCommands)

  const stopTick = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
  }, [])

  const startTick = useCallback(() => {
    stopTick()
    intervalRef.current = setInterval(() => {
      dispatch({ type: 'SET_GAME_STATE_FN', fn: prev => tick(prev, activeCommandsRef.current, Date.now()) })
    }, TICK_INTERVAL_MS)
  }, [stopTick])

  useEffect(() => () => stopTick(), [stopTick])

  // Auto-save high score when game ends and compute review items
  useEffect(() => {
    if (hs.gameState.status !== 'results') return
    stopTick()
    dispatch({ type: 'SET_REVIEW_ITEMS', value: buildReviewItems(hs.gameState, activeCommandsRef.current) })
    const entry = buildHighScoreEntry(hs.gameState)
    dispatch({
      type: 'SET_HIGH_SCORES_FN',
      fn: prev => {
        const updated = addHighScore(prev, entry)
        saveHighScores(updated)
        return updated
      },
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hs.gameState.status])

  const startGame = useCallback((config: GameConfig) => {
    saveLastConfig(config)
    activeCommandsRef.current = config.categories
      ? allCommands.filter(c => config.categories!.includes(c.category))
      : allCommands
    if (config.skipUnsupported) {
      const unsupported = loadUnsupported()
      activeCommandsRef.current = activeCommandsRef.current.filter(c => !unsupported.has(c.id))
    }
    if (config.knowledgeFilter !== 'all') {
      const known = loadKnown()
      if (config.knowledgeFilter === 'known') {
        activeCommandsRef.current = activeCommandsRef.current.filter(c => known.has(c.id))
      } else {
        activeCommandsRef.current = activeCommandsRef.current.filter(c => !known.has(c.id))
      }
    }
    dispatch({ type: 'SET_REVIEW_ITEMS', value: [] })
    const initial = initGameState(config, activeCommandsRef.current)
    dispatch({ type: 'SET_GAME_STATE', value: initial })
    startTick()
  }, [startTick])

  const onCommandExecuted = useCallback((cmd: string) => {
    dispatch({
      type: 'SET_GAME_STATE_FN',
      fn: prev => handleCommandExecuted(prev, cmd, activeCommandsRef.current, Date.now()),
    })
  }, [])

  const resetGame = useCallback(() => {
    stopTick()
    dispatch({ type: 'SET_REVIEW_ITEMS', value: [] })
    dispatch({ type: 'SET_GAME_STATE', value: makeSetupState() })
  }, [stopTick])

  const updateSettings = useCallback((patch: Partial<GameSettings>) => {
    dispatch({ type: 'SET_GAME_STATE_FN', fn: prev => updateLiveSettings(prev, patch) })
  }, [])

  const markChallengeUnsupported = useCallback((commandId: string) => {
    markUnsupported(commandId)
    dispatch({
      type: 'SET_GAME_STATE_FN',
      fn: prev => ({
        ...prev,
        activeChallenges: prev.activeChallenges.map(c =>
          c.commandId === commandId ? { ...c, status: 'failed' as const } : c
        ),
      }),
    })
  }, [])

  return {
    state:             hs.gameState,
    lastConfig,
    reviewItems:       hs.reviewItems,
    startGame,
    onCommandExecuted,
    resetGame,
    updateSettings,
    highScores:        hs.highScores,
    showingHighScores: hs.showingHighScores,
    openHighScores:    () => dispatch({ type: 'SET_SHOWING_HIGH_SCORES', value: true }),
    closeHighScores:   () => dispatch({ type: 'SET_SHOWING_HIGH_SCORES', value: false }),
    markChallengeUnsupported,
  }
}
