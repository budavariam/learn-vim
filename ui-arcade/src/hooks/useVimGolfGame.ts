import { useReducer, useEffect, useRef, useCallback } from 'react'
import type { VimGolfChallenge, VimGolfEntry, DiffLine } from '../engine/types'
import {
  loadVimGolfHighScores, saveVimGolfHighScores, addVimGolfEntry,
  getBestEntry, isContentCorrect, computeDiff,
} from '../engine/VimGolfEngine'
import { useMonacoEditor } from './useMonacoEditor'

export interface UseVimGolfGameReturn {
  editorRef: React.RefObject<HTMLDivElement | null>
  statusRef: React.RefObject<HTMLDivElement | null>
  keystrokes: number
  elapsedMs: number
  resetCount: number
  status: 'playing' | 'solved'
  showSolution: boolean
  showDiff: boolean
  diffLines: DiffLine[]
  isCorrect: boolean | null
  bestEntry: VimGolfEntry | null
  handleCheck: () => void
  handleReset: () => void
  toggleSolution: () => void
  toggleDiff: () => void
  handleSubmitScore: () => void
}

// ── Reducer ───────────────────────────────────────────────────────────────────

type VimGolfHighScores = ReturnType<typeof loadVimGolfHighScores>

type VimGolfGameState = {
  keystrokes:   number
  elapsedMs:    number
  resetCount:   number
  status:       'playing' | 'solved'
  showSolution: boolean
  showDiff:     boolean
  diffLines:    DiffLine[]
  isCorrect:    boolean | null
  scores:       VimGolfHighScores
}

type VimGolfGameAction =
  | { type: 'INCREMENT_KEY' }
  | { type: 'SET_ELAPSED'; ms: number }
  | { type: 'RESET' }
  | { type: 'SOLVE' }
  | { type: 'CHECK_FAILED'; diffLines: DiffLine[] }
  | { type: 'TOGGLE_SOLUTION' }
  | { type: 'TOGGLE_DIFF'; diffLines?: DiffLine[] }
  | { type: 'SAVE_SCORE'; entry: VimGolfEntry; challengeId: string }

function vimGolfGameReducer(state: VimGolfGameState, action: VimGolfGameAction): VimGolfGameState {
  switch (action.type) {
    case 'INCREMENT_KEY':
      return { ...state, keystrokes: state.keystrokes + 1 }
    case 'SET_ELAPSED':
      return { ...state, elapsedMs: action.ms }
    case 'RESET':
      return {
        ...state,
        keystrokes:  0,
        resetCount:  state.resetCount + 1,
        status:      'playing',
        isCorrect:   null,
        diffLines:   [],
        showDiff:    false,
      }
    case 'SOLVE':
      return { ...state, status: 'solved', diffLines: [], showDiff: false }
    case 'CHECK_FAILED':
      return { ...state, isCorrect: false, showDiff: true, diffLines: action.diffLines }
    case 'TOGGLE_SOLUTION':
      return { ...state, showSolution: !state.showSolution }
    case 'TOGGLE_DIFF': {
      const turningOn = !state.showDiff
      if (turningOn && state.diffLines.length === 0 && action.diffLines) {
        return { ...state, showDiff: true, diffLines: action.diffLines }
      }
      return { ...state, showDiff: !state.showDiff }
    }
    case 'SAVE_SCORE': {
      const updated = addVimGolfEntry(state.scores, action.challengeId, action.entry)
      saveVimGolfHighScores(updated)
      return { ...state, scores: updated }
    }
    default:
      return state
  }
}

export function useVimGolfGame(challenge: VimGolfChallenge): UseVimGolfGameReturn {
  const [state, dispatch] = useReducer(vimGolfGameReducer, undefined, () => ({
    keystrokes:   0,
    elapsedMs:    0,
    resetCount:   0,
    status:       'playing' as const,
    showSolution: false,
    showDiff:     false,
    diffLines:    [],
    isCorrect:    null,
    scores:       loadVimGolfHighScores(),
  }))

  const {
    keystrokes, elapsedMs, resetCount, status,
    showSolution, showDiff, diffLines, isCorrect, scores,
  } = state

  // Refs for values read inside callbacks to avoid stale closures (fix: Bug #7)
  const keystrokesRef = useRef(0)
  const resetCountRef = useRef(0)
  const startRef      = useRef(Date.now())
  const timerRef      = useRef<ReturnType<typeof setInterval> | null>(null)
  const solvedAtRef   = useRef<number | null>(null)

  const bestEntry = getBestEntry(scores, challenge.id)

  // Timer — stops when solved
  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (solvedAtRef.current !== null) return
      dispatch({ type: 'SET_ELAPSED', ms: Date.now() - startRef.current })
    }, 100)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const { editorRef, statusRef, setContent, getContent } = useMonacoEditor({
    language: 'plaintext',
    onAnyKey: useCallback(() => {
      keystrokesRef.current++
      dispatch({ type: 'INCREMENT_KEY' })
    }, []),
  })

  // Load initial content whenever the challenge changes.
  // Fix (Bug #8): use challenge.id (not challenge.start) so swapping to a
  // challenge with identical start text still triggers a reload.
  // Also reset contentLoaded each run so re-running the hook for a new
  // challenge doesn't skip the load.
  const contentLoaded = useRef(false)
  useEffect(() => {
    contentLoaded.current = false
    const id = setInterval(() => {
      setContent(challenge.start)
      if (getContent().length > 0) {
        contentLoaded.current = true
        clearInterval(id)
      }
    }, 150)
    return () => clearInterval(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge.id])

  const handleCheck = useCallback(() => {
    const current = getContent()
    const correct = isContentCorrect(current, challenge.end)
    if (correct) {
      dispatch({ type: 'SOLVE' })
      solvedAtRef.current = Date.now()
    } else {
      const diff = computeDiff(current, challenge.end)
      dispatch({ type: 'CHECK_FAILED', diffLines: diff })
    }
  }, [getContent, challenge.end])

  // Fix (Bug #6): Reset must fully restore playing state including the timer
  // origin and solvedAtRef — otherwise elapsed time jumps after reset and a
  // re-solve submits a score entry with the wrong keystroke count.
  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET' })
    keystrokesRef.current = 0
    resetCountRef.current++
    startRef.current = Date.now()
    solvedAtRef.current = null
    setContent(challenge.start)
  }, [setContent, challenge.start])

  // Fix (Bug #7): Read from refs so the auto-submit effect always captures the
  // current values regardless of when the useCallback was last re-created.
  const handleSubmitScore = useCallback(() => {
    if (solvedAtRef.current === null) return   // not solved yet
    const entry: VimGolfEntry = {
      id:         crypto.randomUUID(),
      timestamp:  Date.now(),
      keystrokes: keystrokesRef.current,
      timeMs:     solvedAtRef.current - startRef.current,
      resetCount: resetCountRef.current,
    }
    dispatch({ type: 'SAVE_SCORE', entry, challengeId: challenge.id })
  }, [challenge.id])

  // Auto-submit score when solved
  useEffect(() => {
    if (status === 'solved') handleSubmitScore()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  return {
    editorRef, statusRef,
    keystrokes, elapsedMs, resetCount, status,
    showSolution, showDiff, diffLines, isCorrect, bestEntry,
    handleCheck,
    handleReset,
    toggleSolution: useCallback(() => dispatch({ type: 'TOGGLE_SOLUTION' }), []),
    // Compute diff on demand when first opened so "Show Diff" always works
    // even if the user hasn't pressed "Check" yet.
    toggleDiff: useCallback(() => {
      if (!showDiff && diffLines.length === 0) {
        const diff = computeDiff(getContent(), challenge.end)
        dispatch({ type: 'TOGGLE_DIFF', diffLines: diff })
      } else {
        dispatch({ type: 'TOGGLE_DIFF' })
      }
    }, [showDiff, diffLines.length, getContent, challenge.end]),
    handleSubmitScore,
  }
}
