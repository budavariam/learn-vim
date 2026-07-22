import React, { useReducer, useEffect, useRef, useCallback, useState } from 'react'
import type { GoalModeConfig, GoalChallengeResult, GameConfig, GameState, VimCommandData } from '../engine/types'
import type { VimGolfChallenge } from '../engine/types'
import { BUILTIN_CHALLENGES } from '../engine/vimgolfChallenges'
import { isContentCorrect } from '../engine/VimGolfEngine'
import { getTimeRating, getBasePoints } from '../engine/ScoreEngine'
import { useMonacoEditor } from './useMonacoEditor'
import { initGameState, tick, handleCommandExecuted } from '../engine/ChallengeEngine'
import { loadUnsupported } from '../engine/UnsupportedEngine'
import rawData from '../data.json'

// Suppress unused import warning — React is needed for JSX in the same module
void React

const allCommands = rawData as VimCommandData[]

// ---------------------------------------------------------------------------
// State & Actions
// ---------------------------------------------------------------------------

export type GoalState = {
  status:     'idle' | 'playing' | 'results'
  challenges: VimGolfChallenge[]
  index:      number
  elapsedMs:  number
  keystrokes: number
  results:    GoalChallengeResult[]
  totalScore: number
  config:     GoalModeConfig | null
  arcadeState: GameState | null
}

type GoalAction =
  | { type: 'START'; challenges: VimGolfChallenge[]; config: GoalModeConfig; arcadeState: GameState }
  | { type: 'TICK'; ms: number }
  | { type: 'INCREMENT_KEY' }
  | { type: 'CHALLENGE_SOLVED'; result: GoalChallengeResult; arcadeState: GameState }
  | { type: 'CHALLENGE_FAILED'; result: GoalChallengeResult; arcadeState: GameState }
  | { type: 'ARCADE_TICK'; newState: GameState }
  | { type: 'ARCADE_COMMAND'; newState: GameState }
  | { type: 'RESET' }

const blankState: GoalState = {
  status:     'idle',
  challenges: [],
  index:      0,
  elapsedMs:  0,
  keystrokes: 0,
  results:    [],
  totalScore: 0,
  config:     null,
  arcadeState: null,
}

function goalReducer(state: GoalState, action: GoalAction): GoalState {
  switch (action.type) {
    case 'START':
      return {
        ...blankState,
        status:     'playing',
        challenges: action.challenges,
        config:     action.config,
        arcadeState: action.arcadeState,
      }
    case 'TICK':
      return { ...state, elapsedMs: action.ms }
    case 'INCREMENT_KEY':
      return { ...state, keystrokes: state.keystrokes + 1 }
    case 'CHALLENGE_SOLVED':
    case 'CHALLENGE_FAILED': {
      const results    = [...state.results, action.result]
      const totalScore = results.reduce((sum, r) => sum + r.points, 0)
      const nextIndex  = state.index + 1
      if (nextIndex >= state.challenges.length) {
        return { ...state, results, totalScore, status: 'results', arcadeState: action.arcadeState }
      }
      return { ...state, results, totalScore, index: nextIndex, elapsedMs: 0, keystrokes: 0, arcadeState: action.arcadeState }
    }
    case 'ARCADE_TICK':
    case 'ARCADE_COMMAND':
      return { ...state, arcadeState: action.newState }
    case 'RESET':
      return { ...blankState }
    default:
      return state
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function buildArcadeConfig(config: GoalModeConfig): GameConfig {
  return {
    mode: 'general',
    language: config.language,
    startingLevel: config.startingLevel,
    repetitionTarget: config.repetitionTarget,
    guidedMode: config.guidedMode,
    categories: config.categories,
    dynamicAssist: config.dynamicAssist,
    skipUnsupported: config.skipUnsupported,
    commandTimeMultiplier: config.commandTimeMultiplier,
    knowledgeFilter: 'all',  // Goal Mode always uses all commands for the arcade panel
  }
}

function filterCommands(config: GoalModeConfig): VimCommandData[] {
  let cmds = config.categories
    ? allCommands.filter(c => config.categories!.includes(c.category))
    : allCommands
  if (config.skipUnsupported) {
    const unsupported = loadUnsupported()
    cmds = cmds.filter(c => !unsupported.has(c.id))
  }
  return cmds
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export interface UseGoalGameReturn {
  editorRef:        React.RefObject<HTMLDivElement | null>
  statusRef:        React.RefObject<HTMLDivElement | null>
  targetEditorRef:  React.RefObject<HTMLDivElement | null>
  state:            GoalState
  currentChallenge: VimGolfChallenge | null
  startGame:        (config: GoalModeConfig) => void
  checkSolution:    () => void
  resetGame:        () => void
}

export function useGoalGame(): UseGoalGameReturn {
  const [state, dispatch] = useReducer(goalReducer, blankState)
  const [targetContent, setTargetContent] = useState<string | undefined>(undefined)

  const startRef       = useRef(Date.now())
  const timerRef       = useRef<ReturnType<typeof setInterval> | null>(null)
  const keystrokesRef  = useRef(0)
  const configRef      = useRef<GoalModeConfig | null>(null)
  const indexRef       = useRef(0)
  const challengesRef  = useRef<VimGolfChallenge[]>([])
  const elapsedMsRef   = useRef(0)
  const playingRef     = useRef(false)

  // Arcade engine state refs (avoid stale closures in intervals)
  const arcadeStateRef = useRef<GameState | null>(null)
  const arcadeCmdsRef  = useRef<VimCommandData[]>([])
  const arcadeConfigRef = useRef<GameConfig | null>(null)

  const targetEditorRef = useRef<HTMLDivElement | null>(null)

  const { editorRef, statusRef, setContent, getContent } = useMonacoEditor({
    language: 'plaintext',
    targetContent,
    targetEditorRef,
    onAnyKey: useCallback(() => {
      keystrokesRef.current++
      dispatch({ type: 'INCREMENT_KEY' })
    }, []),
    onCommandExecuted: useCallback((cmd: string) => {
      if (!arcadeStateRef.current || !arcadeCmdsRef.current.length) return
      const newState = handleCommandExecuted(arcadeStateRef.current, cmd, arcadeCmdsRef.current, Date.now())
      arcadeStateRef.current = newState
      dispatch({ type: 'ARCADE_COMMAND', newState })
    }, []),
  })

  const loadChallenge = useCallback((challenge: VimGolfChallenge) => {
    setTargetContent(challenge.end)
    const pollId = setInterval(() => {
      setContent(challenge.start)
      const current = getContent()
      // Empty string start is valid — poll until content matches
      if (current === challenge.start) {
        clearInterval(pollId)
      }
    }, 150)
    return () => clearInterval(pollId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // advanceOrFinish reads only mutable refs so it doesn't need memoisation
  function advanceOrFinish(result: GoalChallengeResult) {
    const wasLast = indexRef.current >= challengesRef.current.length - 1

    // Reset arcade state for the new text challenge
    let newArcadeState = arcadeStateRef.current
    if (arcadeConfigRef.current && arcadeCmdsRef.current.length > 0 && !wasLast) {
      const freshArcade = {
        ...initGameState(arcadeConfigRef.current, arcadeCmdsRef.current),
        maxConcurrent: configRef.current?.concurrentChallenges ?? 5,
      }
      arcadeStateRef.current = freshArcade
      newArcadeState = freshArcade
    }

    if (result.solved) {
      dispatch({ type: 'CHALLENGE_SOLVED', result, arcadeState: newArcadeState! })
    } else {
      dispatch({ type: 'CHALLENGE_FAILED', result, arcadeState: newArcadeState! })
    }

    if (wasLast) {
      playingRef.current = false
      return
    }

    const nextIdx = indexRef.current + 1
    indexRef.current  = nextIdx
    elapsedMsRef.current  = 0
    startRef.current  = Date.now()
    keystrokesRef.current = 0
    const nextChallenge = challengesRef.current[nextIdx]
    if (nextChallenge) loadChallenge(nextChallenge)
  }

  // Always-running 100ms timer; guarded by playingRef
  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (!playingRef.current || configRef.current === null) return

      // Text goal timer
      const ms = Date.now() - startRef.current
      elapsedMsRef.current = ms
      dispatch({ type: 'TICK', ms })

      const limit = configRef.current.timeLimitMs
      if (limit > 0 && ms >= limit) {
        const challenge = challengesRef.current[indexRef.current]
        if (!challenge) return
        const result: GoalChallengeResult = {
          challengeId: challenge.id,
          title:       challenge.title,
          solved:      false,
          elapsedMs:   ms,
          keystrokes:  keystrokesRef.current,
          points:      0,
        }
        advanceOrFinish(result)
      }

      // Arcade challenge tick
      if (arcadeStateRef.current && arcadeCmdsRef.current.length > 0) {
        const newArcade = tick(arcadeStateRef.current, arcadeCmdsRef.current, Date.now())
        arcadeStateRef.current = newArcade
        dispatch({ type: 'ARCADE_TICK', newState: newArcade })
      }
    }, 100)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const startGame = useCallback((config: GoalModeConfig) => {
    const pool = config.difficulty === 'all'
      ? BUILTIN_CHALLENGES
      : BUILTIN_CHALLENGES.filter(c => c.difficulty === config.difficulty)

    const chosen = shuffle(pool).slice(0, config.challengeCount)

    // Build arcade engine state
    const arcadeGameConfig = buildArcadeConfig(config)
    const cmds = filterCommands(config)
    const initialArcade: GameState = {
      ...initGameState(arcadeGameConfig, cmds),
      maxConcurrent: config.concurrentChallenges,
    }

    arcadeConfigRef.current = arcadeGameConfig
    arcadeCmdsRef.current   = cmds
    arcadeStateRef.current  = initialArcade

    configRef.current     = config
    challengesRef.current = chosen
    indexRef.current      = 0
    elapsedMsRef.current  = 0
    keystrokesRef.current = 0
    startRef.current      = Date.now()
    playingRef.current    = true

    dispatch({ type: 'START', challenges: chosen, config, arcadeState: initialArcade })
    if (chosen[0]) loadChallenge(chosen[0])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadChallenge])

  const checkSolution = useCallback(() => {
    const challenge = challengesRef.current[indexRef.current]
    if (!challenge || configRef.current === null || !playingRef.current) return

    const current   = getContent()
    const solved    = isContentCorrect(current, challenge.end)
    const elapsedMs = elapsedMsRef.current
    const limit     = configRef.current.timeLimitMs || 300_000

    let points = 0
    if (solved) {
      const { multiplier } = getTimeRating(elapsedMs, limit)
      points = Math.floor(getBasePoints(0) * 10 * multiplier)
    }

    const result: GoalChallengeResult = {
      challengeId: challenge.id,
      title:       challenge.title,
      solved,
      elapsedMs,
      keystrokes:  keystrokesRef.current,
      points,
    }
    advanceOrFinish(result)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getContent])

  const resetGame = useCallback(() => {
    playingRef.current    = false
    configRef.current     = null
    challengesRef.current = []
    indexRef.current      = 0
    elapsedMsRef.current  = 0
    keystrokesRef.current = 0
    arcadeStateRef.current = null
    arcadeCmdsRef.current  = []
    arcadeConfigRef.current = null
    setTargetContent(undefined)
    dispatch({ type: 'RESET' })
  }, [])

  const currentChallenge = state.status === 'playing'
    ? (state.challenges[state.index] ?? null)
    : null

  return { editorRef, statusRef, targetEditorRef, state, currentChallenge, startGame, checkSolution, resetGame }
}
