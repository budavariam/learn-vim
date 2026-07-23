import { useReducer, useEffect, useRef, useCallback } from 'react'
import { useMonacoEditor } from './useMonacoEditor'
import { getFile } from '../files'
import type { Language } from '../engine/types'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MotionRaceConfig {
  language:          Language
  mode:              'count' | 'timed'
  targetCount:       number   // 3–30 (count mode)
  durationMs:        number   // 60_000 | 120_000 | 300_000 | 600_000 (timed mode)
  startFromPrevious: boolean  // true = new path starts where last one ended
}

export interface CompletedPath {
  keystrokes: number
  elapsedMs:  number
  valid:       boolean  // false = text was modified during navigation
}

type Pos = { lineNumber: number; column: number }

export interface MotionRaceGameState {
  status:         'playing' | 'results'
  config:         MotionRaceConfig
  from:           Pos
  to:             Pos
  currentPos:     Pos
  keystrokes:     number
  contentValid:   boolean
  completedPaths: CompletedPath[]
  totalElapsedMs: number
  pathElapsedMs:  number
}

// ── Reducer ───────────────────────────────────────────────────────────────────

type RaceAction =
  | { type: 'START';        config: MotionRaceConfig; from: Pos; to: Pos }
  | { type: 'CURSOR_MOVED'; pos: Pos }
  | { type: 'CONTENT_INVALID' }
  | { type: 'TICK';         totalMs: number; pathMs: number }
  | { type: 'INCREMENT_KEYS' }
  | { type: 'NEXT_PATH';    from: Pos; to: Pos; completed: CompletedPath[]; totalMs: number }
  | { type: 'END';          completed: CompletedPath[]; totalMs: number }

const ZERO: Pos = { lineNumber: 1, column: 1 }

const BLANK: MotionRaceGameState = {
  status:         'playing',
  config:         { language: 'typescript', mode: 'count', targetCount: 5, durationMs: 60_000, startFromPrevious: true },
  from:           ZERO,
  to:             ZERO,
  currentPos:     ZERO,
  keystrokes:     0,
  contentValid:   true,
  completedPaths: [],
  totalElapsedMs: 0,
  pathElapsedMs:  0,
}

function raceReducer(state: MotionRaceGameState, action: RaceAction): MotionRaceGameState {
  switch (action.type) {
    case 'START':
      return { ...BLANK, config: action.config, from: action.from, to: action.to, currentPos: action.from }
    case 'CURSOR_MOVED':
      return { ...state, currentPos: action.pos }
    case 'CONTENT_INVALID':
      return { ...state, contentValid: false }
    case 'TICK':
      return { ...state, totalElapsedMs: action.totalMs, pathElapsedMs: action.pathMs }
    case 'INCREMENT_KEYS':
      return { ...state, keystrokes: state.keystrokes + 1 }
    case 'NEXT_PATH':
      return {
        ...state,
        from:           action.from,
        to:             action.to,
        currentPos:     action.from,
        keystrokes:     0,
        contentValid:   true,
        completedPaths: action.completed,
        totalElapsedMs: action.totalMs,
        pathElapsedMs:  0,
      }
    case 'END':
      return { ...state, status: 'results', completedPaths: action.completed, totalElapsedMs: action.totalMs }
    default:
      return state
  }
}

// ── Position generation ───────────────────────────────────────────────────────

function buildValidLines(content: string) {
  return content.split('\n').map((line, i) => {
    const cols: number[] = []
    for (let j = 0; j < line.length; j++) {
      if (line[j].trim() !== '') cols.push(j + 1)
    }
    return { n: i + 1, cols }
  }).filter(({ cols }) => cols.length > 0)
}

function pickFrom(cols: number[], n: number): Pos {
  return { lineNumber: n, column: cols[Math.floor(Math.random() * cols.length)] }
}

function generatePath(content: string, fixedFrom?: Pos): { from: Pos; to: Pos } | null {
  const valid = buildValidLines(content)
  if (valid.length < 2) return null

  // Determine from position
  const from: Pos = fixedFrom
    ?? (() => { const e = valid[Math.floor(Math.random() * valid.length)]; return pickFrom(e.cols, e.n) })()

  // Pick to on a different line than from
  const toEntries = valid.filter(({ n }) => n !== from.lineNumber)
  if (toEntries.length === 0) return null
  const toEntry = toEntries[Math.floor(Math.random() * toEntries.length)]

  return { from, to: pickFrom(toEntry.cols, toEntry.n) }
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export interface UseMotionRaceReturn {
  state:      MotionRaceGameState
  editorRef:  React.RefObject<HTMLDivElement | null>
  statusRef:  React.RefObject<HTMLDivElement | null>
  startGame:  (config: MotionRaceConfig) => void
}

export function useMotionRace(): UseMotionRaceReturn {
  const [state, dispatch] = useReducer(raceReducer, BLANK)

  // Stable mutable refs — callbacks capture these to avoid stale closures
  const configRef        = useRef<MotionRaceConfig | null>(null)
  const fileContentRef   = useRef('')
  const gameStartRef     = useRef(0)
  const pathStartRef     = useRef(0)
  const contentValidRef  = useRef(true)
  const keystrokesRef    = useRef(0)
  const toRef            = useRef<Pos>(ZERO)
  const completedRef     = useRef<CompletedPath[]>([])
  const gameStatusRef    = useRef<'idle' | 'playing' | 'results'>('idle')
  const invalidTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isRestoringRef   = useRef(false)

  // Forward refs — filled after useMonacoEditor is called below
  const positionCursorRef     = useRef<(p: Pos) => void>(() => {})
  const setTargetHighlightRef = useRef<(p: Pos | null) => void>(() => {})
  const setContentEditorRef   = useRef<(c: string) => void>(() => {})
  const focusEditorRef        = useRef<() => void>(() => {})
  // Pending setup applied once Monaco signals it is ready via onReady
  const pendingSetupRef       = useRef<{ from: Pos; to: Pos } | null>(null)

  // Keep completedRef in sync with render state
  useEffect(() => { completedRef.current = state.completedPaths }, [state.completedPaths])

  // ── advancePath ─────────────────────────────────────────────────────────────

  const advancePath = useCallback((valid: boolean) => {
    if (gameStatusRef.current !== 'playing') return

    const now       = Date.now()
    const totalMs   = now - gameStartRef.current
    const pathMs    = now - pathStartRef.current
    const config    = configRef.current!
    const newEntry: CompletedPath = { keystrokes: keystrokesRef.current, elapsedMs: pathMs, valid }
    const completed = [...completedRef.current, newEntry]

    const countDone = config.mode === 'count' && completed.length >= config.targetCount
    const timeDone  = config.mode === 'timed'  && totalMs >= config.durationMs

    if (countDone || timeDone) {
      gameStatusRef.current = 'results'
      setTargetHighlightRef.current(null)
      dispatch({ type: 'END', completed, totalMs })
      return
    }

    // Generate next path — start from where the user just landed if configured
    const prevEnd = toRef.current
    const fixedFrom = config.startFromPrevious ? prevEnd : undefined
    const path = generatePath(fileContentRef.current, fixedFrom)
    if (!path) return

    contentValidRef.current = true
    keystrokesRef.current   = 0
    pathStartRef.current    = Date.now()
    toRef.current           = path.to
    completedRef.current    = completed

    if (!valid) {
      // Content was modified — restore it, then reposition the cursor.
      // setValue moves the cursor to 1,1 so we defer the setPosition one
      // microtask to let Monaco flush the model-change event first.
      isRestoringRef.current = true
      setContentEditorRef.current(fileContentRef.current)
      Promise.resolve().then(() => {
        positionCursorRef.current(path.from)
        isRestoringRef.current = false
        focusEditorRef.current()
      })
    } else if (!config.startFromPrevious) {
      // Random start — cursor is elsewhere, move and center it.
      positionCursorRef.current(path.from)
      focusEditorRef.current()
    }
    // startFromPrevious && valid: cursor is already at path.from, leave the
    // view untouched so the user doesn't get a jarring re-center.

    setTargetHighlightRef.current(path.to)

    dispatch({ type: 'NEXT_PATH', from: path.from, to: path.to, completed, totalMs })
  }, [])

  // ── Monaco callbacks ─────────────────────────────────────────────────────────

  const handleReady = useCallback(() => {
    const setup = pendingSetupRef.current
    if (!setup) return
    pendingSetupRef.current = null
    setContentEditorRef.current(fileContentRef.current)
    positionCursorRef.current(setup.from)
    setTargetHighlightRef.current(setup.to)
    focusEditorRef.current()
  }, [])

  const handleCursorChange = useCallback((pos: Pos) => {
    if (gameStatusRef.current !== 'playing') return
    dispatch({ type: 'CURSOR_MOVED', pos })

    const to = toRef.current
    if (pos.lineNumber === to.lineNumber && pos.column === to.column) {
      advancePath(contentValidRef.current)
    }
  }, [advancePath])

  const handleContentChange = useCallback((_content: string) => {
    if (gameStatusRef.current !== 'playing') return
    if (isRestoringRef.current) return
    if (!contentValidRef.current) return  // already invalid

    contentValidRef.current = false
    dispatch({ type: 'CONTENT_INVALID' })

    // Auto-advance after a short pause so the user sees the warning
    if (invalidTimerRef.current) clearTimeout(invalidTimerRef.current)
    invalidTimerRef.current = setTimeout(() => {
      advancePath(false)
    }, 1200)
  }, [advancePath])

  const handleAnyKey = useCallback(() => {
    if (gameStatusRef.current !== 'playing') return
    keystrokesRef.current += 1
    dispatch({ type: 'INCREMENT_KEYS' })
  }, [])

  // ── useMonacoEditor ───────────────────────────────────────────────────────────

  const { editorRef, statusRef, setContent, positionCursor, setTargetHighlight, focusEditor } =
    useMonacoEditor({
      onReady:         handleReady,
      onCursorChange:  handleCursorChange,
      onContentChange: handleContentChange,
      onAnyKey:        handleAnyKey,
    })

  // Sync forward refs after hook call
  positionCursorRef.current     = positionCursor
  setTargetHighlightRef.current = setTargetHighlight
  setContentEditorRef.current   = setContent
  focusEditorRef.current        = focusEditor

  // ── Timer ────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (state.status !== 'playing') return
    const id = setInterval(() => {
      const now     = Date.now()
      const totalMs = now - gameStartRef.current
      const pathMs  = now - pathStartRef.current
      dispatch({ type: 'TICK', totalMs, pathMs })

      const cfg = configRef.current
      if (cfg?.mode === 'timed' && totalMs >= cfg.durationMs && gameStatusRef.current === 'playing') {
        gameStatusRef.current = 'results'
        setTargetHighlightRef.current(null)
        dispatch({ type: 'END', completed: completedRef.current, totalMs })
      }
    }, 100)
    return () => clearInterval(id)
  }, [state.status])

  // ── startGame ────────────────────────────────────────────────────────────────

  const startGame = useCallback((config: MotionRaceConfig) => {
    if (invalidTimerRef.current) clearTimeout(invalidTimerRef.current)

    const content = getFile(config.language)
    fileContentRef.current = content

    const path = generatePath(content)
    if (!path) return

    configRef.current       = config
    gameStatusRef.current   = 'playing'
    contentValidRef.current = true
    keystrokesRef.current   = 0
    completedRef.current    = []
    toRef.current           = path.to
    gameStartRef.current    = Date.now()
    pathStartRef.current    = Date.now()

    // Monaco may not be ready yet — store the setup and apply it in onReady.
    // If Monaco is already initialised (e.g. Play Again), apply immediately.
    pendingSetupRef.current = { from: path.from, to: path.to }
    setContentEditorRef.current(content)          // no-op if not ready yet
    positionCursorRef.current(path.from)          // no-op if not ready yet
    setTargetHighlightRef.current(path.to)        // no-op if not ready yet

    dispatch({ type: 'START', config, from: path.from, to: path.to })
  }, [])

  return { state, editorRef, statusRef, startGame }
}
