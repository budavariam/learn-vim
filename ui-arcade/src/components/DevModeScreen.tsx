import { useReducer, useCallback, useRef, useEffect, useMemo } from 'react'
import type { VimCommandData } from '../engine/types'
import type { KeyDisplayEvent } from '../hooks/useMonacoEditor'
import { useMonacoEditor } from '../hooks/useMonacoEditor'
import { normaliseVimKey, VimSequenceMatcher } from '../engine/vimKeyUtils'
import { loadUnsupported, markUnsupported, unmarkUnsupported, saveUnsupported, exportUnsupportedIds } from '../engine/UnsupportedEngine'
import { loadKnown, toggleKnown } from '../engine/KnownEngine'
import rawData from '../data.json'

const allCommands = rawData as VimCommandData[]

const DEV_BUFFER = `The quick brown fox
jumps over the lazy dog.

function hello(name) {
  return "Hello, " + name;
}

const items = [1, 2, 3, 4, 5];
const result = items.map(x => x * 2);

// Line ten
// Line eleven
// Line twelve
`

interface LogEntry {
  id:               number
  key:              string
  vimMode:          'normal' | 'other'
  inSolutions:      boolean
  matchResult:      string | null   // matched solution string, or null
  matchesChallenge: boolean | null
  isEmitted:        boolean         // true = from onCommandExecuted (vs raw keypress)
  timestamp:        number
}

let logIdCounter = 0

function matchesSearch(cmd: VimCommandData, q: string): boolean {
  const lq = q.toLowerCase()
  return (
    cmd.question.toLowerCase().includes(lq) ||
    cmd.category.toLowerCase().includes(lq) ||
    cmd.solution.some(s => s.toLowerCase().includes(lq))
  )
}

// ── Reducer ───────────────────────────────────────────────────────────────────

type DevState = {
  search:           string
  selected:         VimCommandData | null
  log:              LogEntry[]
  completed:        boolean
  unsupported:      Set<string>
  known:            Set<string>
  showUnsuppOnly:   boolean
  showKnownFilter:  'all' | 'known' | 'unknown'
  isDrill:          boolean
  autoAdvance:      boolean
}

type DevAction =
  | { type: 'SET_SEARCH'; value: string }
  | { type: 'SELECT_COMMAND'; cmd: VimCommandData | null }
  | { type: 'APPEND_LOG'; entry: LogEntry }
  | { type: 'CLEAR_LOG' }
  | { type: 'SET_COMPLETED'; value: boolean }
  | { type: 'RELOAD_UNSUPPORTED' }
  | { type: 'RELOAD_KNOWN' }
  | { type: 'TOGGLE_UNSUPP_ONLY' }
  | { type: 'CYCLE_KNOWN_FILTER' }
  | { type: 'START_DRILL' }
  | { type: 'STOP_DRILL' }
  | { type: 'ADVANCE_DRILL'; commands: VimCommandData[] }
  | { type: 'TOGGLE_AUTO_ADVANCE' }

function devReducer(state: DevState, action: DevAction): DevState {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, search: action.value }
    case 'SELECT_COMMAND':
      return { ...state, selected: action.cmd, log: [], completed: false }
    case 'APPEND_LOG': {
      const next = [...state.log, action.entry]
      return { ...state, log: next.length > 200 ? next.slice(-200) : next }
    }
    case 'CLEAR_LOG':
      return { ...state, log: [] }
    case 'SET_COMPLETED':
      return { ...state, completed: action.value }
    case 'RELOAD_UNSUPPORTED':
      return { ...state, unsupported: loadUnsupported() }
    case 'RELOAD_KNOWN':
      return { ...state, known: loadKnown() }
    case 'TOGGLE_UNSUPP_ONLY':
      return { ...state, showUnsuppOnly: !state.showUnsuppOnly }
    case 'CYCLE_KNOWN_FILTER': {
      const next =
        state.showKnownFilter === 'all'     ? 'known' :
        state.showKnownFilter === 'known'   ? 'unknown' : 'all'
      return { ...state, showKnownFilter: next }
    }
    case 'START_DRILL':
      return { ...state, isDrill: true }
    case 'STOP_DRILL':
      return { ...state, isDrill: false }
    case 'ADVANCE_DRILL': {
      const idx = action.commands.findIndex(c => c.id === state.selected?.id)
      const next = action.commands[idx + 1] ?? action.commands[0] ?? null
      return { ...state, selected: next, log: [], completed: false }
    }
    case 'TOGGLE_AUTO_ADVANCE':
      return { ...state, autoAdvance: !state.autoAdvance }
    default:
      return state
  }
}

const initialDevState: DevState = {
  search:          '',
  selected:        null,
  log:             [],
  completed:       false,
  unsupported:     loadUnsupported(),
  known:           loadKnown(),
  showUnsuppOnly:  false,
  showKnownFilter: 'all',
  isDrill:         false,
  autoAdvance:     true,
}

export function DevModeScreen({ onBack }: { onBack: () => void }) {
  const [state, dispatch] = useReducer(devReducer, initialDevState)
  const {
    search, selected, log, completed,
    unsupported, known,
    showUnsuppOnly, showKnownFilter,
    isDrill, autoAdvance,
  } = state

  // Refs for stable closures
  const autoAdvanceRef  = useRef(autoAdvance)
  const isDrillRef      = useRef(isDrill)
  const selectedRef     = useRef(selected)
  // Stable ref to focusEditor so advanceDrill (defined before useMonacoEditor) can call it
  const focusEditorRef  = useRef<() => void>(() => {})
  // Guard against double-firing: both handleKeyDisplay and handleCommandExecuted
  // can call onSolutionMatched for the same keystroke, causing two advanceDrill calls.
  const solutionHandledRef = useRef(false)

  // Keep refs in sync with reducer state (needed for closures inside callbacks/timers)
  useEffect(() => { autoAdvanceRef.current = autoAdvance }, [autoAdvance])
  useEffect(() => { isDrillRef.current = isDrill }, [isDrill])
  useEffect(() => {
    selectedRef.current = selected
    solutionHandledRef.current = false  // reset guard for new command
  }, [selected])

  const logEndRef      = useRef<HTMLDivElement>(null)
  const selectedRowRef = useRef<HTMLButtonElement | null>(null)

  // The shared sequence matcher — same logic used during actual gameplay
  const matcherRef = useRef(new VimSequenceMatcher())

  // Auto-scroll log
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [log])

  // Scroll list to active item in drill mode
  useEffect(() => {
    if (isDrill) selectedRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [selected, isDrill])

  // ── filtered list ─────────────────────────────────────────────────────────

  const filteredCommands = useMemo(() => {
    return allCommands.filter(cmd => {
      if (showUnsuppOnly && !unsupported.has(cmd.id)) return false
      if (showKnownFilter === 'known'   && !known.has(cmd.id)) return false
      if (showKnownFilter === 'unknown' &&  known.has(cmd.id)) return false
      if (search && !matchesSearch(cmd, search)) return false
      return true
    })
  }, [search, showUnsuppOnly, showKnownFilter, unsupported, known])

  // ── drill ─────────────────────────────────────────────────────────────────

  const advanceDrill = useCallback(() => {
    dispatch({ type: 'ADVANCE_DRILL', commands: filteredCommands })
    matcherRef.current.reset()
    focusEditorRef.current()   // use ref — avoids TDZ with focusEditor declared later
  }, [filteredCommands])

  function startDrill() {
    const first = selected && filteredCommands.some(c => c.id === selected.id)
      ? selected
      : filteredCommands[0] ?? null
    dispatch({ type: 'SELECT_COMMAND', cmd: first })
    matcherRef.current.reset()
    dispatch({ type: 'START_DRILL' })
  }

  // ── unsupported helpers ───────────────────────────────────────────────────

  function toggleUnsupported(id: string) {
    if (unsupported.has(id)) unmarkUnsupported(id)
    else markUnsupported(id)
    dispatch({ type: 'RELOAD_UNSUPPORTED' })
  }

  function handleToggleKnown(id: string) {
    toggleKnown(id)
    dispatch({ type: 'RELOAD_KNOWN' })
  }

  function handleUnsupportedOnDrillItem(id: string) {
    markUnsupported(id)
    dispatch({ type: 'RELOAD_UNSUPPORTED' })
    if (isDrill) setTimeout(() => advanceDrill(), 300)
  }

  function markAllUnsupported() {
    allCommands.forEach(c => markUnsupported(c.id))
    dispatch({ type: 'RELOAD_UNSUPPORTED' })
  }

  function clearAllUnsupported() {
    saveUnsupported(new Set())
    dispatch({ type: 'RELOAD_UNSUPPORTED' })
  }

  // ── shared completion helper ──────────────────────────────────────────────

  // Extracted so both handleKeyDisplay (normal/multi-key) and
  // handleCommandExecuted (ex commands) use the same logic.
  const onSolutionMatched = useCallback((_matchedCmd: string) => {
    if (solutionHandledRef.current) return
    solutionHandledRef.current = true
    const cmd = selectedRef.current
    dispatch({ type: 'SET_COMPLETED', value: true })
    if (cmd && unsupported.has(cmd.id)) {
      unmarkUnsupported(cmd.id)
      dispatch({ type: 'RELOAD_UNSUPPORTED' })
    }
    if (isDrillRef.current && autoAdvanceRef.current) {
      setTimeout(() => advanceDrill(), 500)
    } else {
      setTimeout(() => dispatch({ type: 'SET_COMPLETED', value: false }), 1500)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advanceDrill])

  // ── onCommandExecuted: receives complete solutions including ex commands ──
  // The game engine's emitIfKnown() calls this for every matched solution.
  // In particular, ex commands like ':close' are emitted HERE (not via
  // onKeyDisplay's per-character matcher) because they're submitted as a unit.

  const handleCommandExecuted = useCallback((emittedCmd: string) => {
    const cmd = selectedRef.current
    const solvedNorm = cmd?.solution.map(s => normaliseVimKey(s)) ?? []
    const matchesChallenge = solvedNorm.includes(normaliseVimKey(emittedCmd))

    const entry: LogEntry = {
      id:               ++logIdCounter,
      key:              emittedCmd,
      vimMode:          'normal',
      inSolutions:      true,
      matchResult:      emittedCmd,
      matchesChallenge,
      isEmitted:        true,
      timestamp:        Date.now(),
    }
    dispatch({ type: 'APPEND_LOG', entry })

    if (matchesChallenge) onSolutionMatched(emittedCmd)
  }, [onSolutionMatched])

  // ── keypress handler (uses VimSequenceMatcher — identical to gameplay) ────

  const handleKeyDisplay = useCallback((event: KeyDisplayEvent) => {
    if (!event.display) return

    // Reset matcher on mode change (same as gameplay); discard any flushed
    // solution here — the game engine's onCommandExecuted will log it separately.
    if (event.vimMode !== 'normal') {
      matcherRef.current.reset()
    }

    // Run the sequence matcher — same logic as useMonacoEditor.
    // push() returns 0-2 results: empty = still buffering, 1 = matched,
    // 2 = flushed ambiguous buffer + new key match (dead-end case).
    let matchResult: string | null = null
    if (event.vimMode === 'normal') {
      const matches = matcherRef.current.push(event.display)
      // Take the last result for display (most recent match wins in the log row)
      matchResult = matches.length > 0 ? matches[matches.length - 1] : null
    }

    // Check if the match is the selected challenge's solution
    const cmd = selectedRef.current
    const solvedNormalized = cmd?.solution.map(s => normaliseVimKey(s)) ?? []
    const matchesChallenge = matchResult !== null
      ? solvedNormalized.includes(matchResult)
      : null

    const entry: LogEntry = {
      id:               ++logIdCounter,
      key:              event.display,
      vimMode:          event.vimMode,
      inSolutions:      event.inSolutions,
      matchResult,
      matchesChallenge,
      isEmitted:        false,
      timestamp:        Date.now(),
    }
    dispatch({ type: 'APPEND_LOG', entry })

    if (matchesChallenge) onSolutionMatched(matchResult!)
  }, [onSolutionMatched])

  const { editorRef, statusRef, focusEditor } = useMonacoEditor({
    language:          'plaintext',
    defaultValue:      DEV_BUFFER,
    onKeyDisplay:      handleKeyDisplay,
    onCommandExecuted: handleCommandExecuted,
  })
  // Keep ref in sync so advanceDrill (defined before this hook) can call focusEditor
  focusEditorRef.current = focusEditor

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (isDrill && !autoAdvance && e.altKey && e.key === 'n') {
        e.preventDefault()
        advanceDrill()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isDrill, autoAdvance, advanceDrill])

  // ── grouping ──────────────────────────────────────────────────────────────

  const categoryOrder: string[] = []
  const byCategory: Record<string, VimCommandData[]> = {}
  for (const cmd of filteredCommands) {
    if (!byCategory[cmd.category]) {
      byCategory[cmd.category] = []
      categoryOrder.push(cmd.category)
    }
    byCategory[cmd.category].push(cmd)
  }

  const unsupportedCount = unsupported.size
  const drillIdx = filteredCommands.findIndex(c => c.id === selected?.id)

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden font-mono">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-800 border-b border-gray-700 flex-shrink-0 flex-wrap">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white text-sm px-3 py-1 rounded border border-gray-600 hover:border-gray-400 transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-white font-bold text-base">Dev Mode</h1>

        <div className="flex items-center gap-2 ml-auto flex-wrap">
          {/* Drill toggle */}
          <button
            onClick={isDrill ? () => dispatch({ type: 'STOP_DRILL' }) : startDrill}
            disabled={filteredCommands.length === 0}
            className={`px-3 py-1.5 rounded text-xs font-bold border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              isDrill
                ? 'bg-orange-600 border-orange-500 text-white'
                : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-400'
            }`}
          >
            {isDrill ? `⚡ Drill ${drillIdx + 1}/${filteredCommands.length}` : '⚡ Start Drill'}
          </button>

          {/* Auto-advance toggle — only visible when drill is running */}
          {isDrill && (
            <>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_AUTO_ADVANCE' })}
                className={`px-3 py-1.5 rounded text-xs border transition-colors ${
                  autoAdvance
                    ? 'bg-orange-900/50 border-orange-700 text-orange-300'
                    : 'bg-gray-700 border-gray-600 text-gray-400'
                }`}
                title="Toggle auto-advance on match"
              >
                {autoAdvance ? '⏩ Auto' : '⏸ Manual'}
              </button>
              {/* Manual next button when auto-advance is off */}
              {!autoAdvance && (
                <button
                  onClick={advanceDrill}
                  className="px-3 py-1.5 rounded text-xs border border-gray-500 bg-gray-700 text-gray-300 hover:border-gray-300 hover:text-white transition-colors"
                >
                  Next → ⌥N
                </button>
              )}
            </>
          )}

          {/* Known filter (cycles: All → Known → Unknown → All) */}
          <button
            onClick={() => dispatch({ type: 'CYCLE_KNOWN_FILTER' })}
            className={`px-3 py-1.5 rounded text-xs border transition-colors ${
              showKnownFilter === 'known'
                ? 'bg-yellow-900/60 border-yellow-600 text-yellow-300'
                : showKnownFilter === 'unknown'
                  ? 'bg-blue-900/40 border-blue-700 text-blue-300'
                  : 'bg-gray-700 border-gray-600 text-gray-400 hover:border-gray-500'
            }`}
          >
            {showKnownFilter === 'known'
              ? `★ Known only (${[...known].filter(id => allCommands.some(c => c.id === id)).length})`
              : showKnownFilter === 'unknown'
                ? '☆ Unknown only'
                : `★ Known (${[...known].filter(id => allCommands.some(c => c.id === id)).length})`}
          </button>

          {/* Unsupported filter */}
          <button
            onClick={() => dispatch({ type: 'TOGGLE_UNSUPP_ONLY' })}
            className={`px-3 py-1.5 rounded text-xs border transition-colors ${
              showUnsuppOnly
                ? 'bg-red-900/60 border-red-600 text-red-300'
                : 'bg-gray-700 border-gray-600 text-gray-400 hover:border-gray-500'
            }`}
          >
            ⊘ Unsupported ({unsupportedCount})
          </button>

          {/* Mark all unsupported */}
          <button
            onClick={markAllUnsupported}
            className="px-3 py-1.5 rounded text-xs border border-red-900 bg-red-950/30 text-red-500 hover:text-red-300 hover:border-red-700 transition-colors"
            title="Mark every command as unsupported (then use drill mode to validate)"
          >
            ⊘ Mark all
          </button>

          {/* Clear all unsupported */}
          {unsupportedCount > 0 && (
            <button
              onClick={clearAllUnsupported}
              className="px-3 py-1.5 rounded text-xs border border-gray-600 bg-gray-700 text-gray-400 hover:text-white transition-colors"
              title="Remove all unsupported marks"
            >
              ✓ Clear all
            </button>
          )}

          {/* Export unsupported IDs — download unsupported-defaults.json */}
          {unsupportedCount > 0 && (
            <button
              onClick={exportUnsupportedIds}
              className="px-3 py-1.5 rounded text-xs border border-gray-600 bg-gray-700 text-gray-400 hover:text-white transition-colors"
              title="Download as unsupported-defaults.json — place in public/ to pre-seed new users"
            >
              ⬇ Export ({unsupportedCount})
            </button>
          )}

          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={e => dispatch({ type: 'SET_SEARCH', value: e.target.value })}
            className="px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 w-36"
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: command list */}
        <div className="w-72 flex-shrink-0 flex flex-col border-r border-gray-700 overflow-hidden">
          <div className="flex-1 overflow-y-auto text-xs">
            {filteredCommands.length === 0 && (
              <p className="text-gray-600 italic px-4 py-4">No commands match.</p>
            )}
            {categoryOrder.map(cat => (
              <div key={cat}>
                <div className="sticky top-0 bg-gray-800 px-3 py-1.5 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-700 z-10">
                  {cat}
                </div>
                {byCategory[cat].map(cmd => {
                  const isUnsupported = unsupported.has(cmd.id)
                  const isActive = selected?.id === cmd.id
                  return (
                    <div
                      key={cmd.id}
                      className={`flex items-center border-b border-gray-800 ${
                        isActive
                          ? isDrill ? 'bg-orange-900/40 border-orange-800' : 'bg-blue-900/40 border-blue-800'
                          : isUnsupported ? 'bg-red-950/30' : 'hover:bg-gray-800'
                      }`}
                    >
                      <button
                        ref={isActive ? selectedRowRef : undefined}
                        onClick={() => {
                          dispatch({ type: 'SELECT_COMMAND', cmd })
                          matcherRef.current.reset()
                          focusEditor()
                        }}
                        className="flex-1 text-left px-3 py-2 min-w-0"
                      >
                        <div className={`truncate flex items-center gap-1 ${isUnsupported ? 'text-red-400' : isActive ? 'text-white' : 'text-gray-300'}`}>
                          {known.has(cmd.id) && (
                            <span className="text-yellow-500 text-xs flex-shrink-0">★</span>
                          )}
                          {cmd.question}
                        </div>
                        <div className={`text-xs truncate ${isUnsupported ? 'text-red-600' : 'text-gray-500'}`}>
                          {cmd.solution.join(', ')} · Lv{cmd.level}
                        </div>
                      </button>
                      <button
                        onClick={() => isDrill && isActive ? handleUnsupportedOnDrillItem(cmd.id) : toggleUnsupported(cmd.id)}
                        title={isUnsupported ? 'Remove from unsupported' : 'Mark as unsupported'}
                        className={`flex-shrink-0 px-2 py-2 transition-colors ${
                          isUnsupported ? 'text-red-500 hover:text-red-300' : 'text-gray-700 hover:text-red-500'
                        }`}
                      >
                        ⊘
                      </button>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Centre: editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className={`flex-shrink-0 px-4 py-3 border-b border-gray-700 transition-colors ${
            completed ? 'bg-green-900/40 border-green-700' : 'bg-gray-800'
          }`}>
            {selected ? (
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className={`text-sm font-bold ${unsupported.has(selected.id) ? 'text-red-400' : 'text-white'}`}>
                    {selected.question}
                    {unsupported.has(selected.id) && (
                      <span className="ml-2 text-xs text-red-500 font-normal">(unsupported)</span>
                    )}
                  </p>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {selected.solution.map((s, i) => (
                      <kbd key={i} className="px-2 py-0.5 bg-gray-700 text-yellow-300 text-xs rounded border border-gray-600">{s}</kbd>
                    ))}
                    <span className="text-gray-500 text-xs self-center">· {selected.category} · Lv{selected.level}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {completed && <span className="text-green-400 font-bold text-sm">✓ MATCHED!</span>}
                  {/* Known/unknown toggle */}
                  <button
                    onClick={() => handleToggleKnown(selected.id)}
                    className={`px-2 py-1 rounded text-xs border transition-colors ${
                      known.has(selected.id)
                        ? 'bg-yellow-900/50 border-yellow-700 text-yellow-300 hover:bg-yellow-900'
                        : 'bg-gray-700 border-gray-600 text-gray-400 hover:border-yellow-600 hover:text-yellow-400'
                    }`}
                  >
                    {known.has(selected.id) ? '★ Known' : '☆ Unknown'}
                  </button>
                  {/* Unsupported toggle */}
                  <button
                    onClick={() => isDrill ? handleUnsupportedOnDrillItem(selected.id) : toggleUnsupported(selected.id)}
                    className={`px-2 py-1 rounded text-xs border transition-colors ${
                      unsupported.has(selected.id)
                        ? 'bg-red-900/50 border-red-700 text-red-300 hover:bg-red-900'
                        : 'bg-gray-700 border-gray-600 text-gray-400 hover:border-red-600 hover:text-red-400'
                    }`}
                  >
                    {unsupported.has(selected.id) ? '✓ restore' : '⊘ unsupported'}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-xs">← Select a command, or start Drill mode</p>
            )}
          </div>

          <div className="flex-1 min-h-0">
            <div ref={editorRef} className="h-full" />
          </div>
          <div
            ref={statusRef}
            className="h-7 bg-gray-800 border-t border-gray-700 px-3 flex items-center text-xs text-gray-400"
          />
        </div>

        {/* Right: log */}
        <div className="w-80 flex-shrink-0 border-l border-gray-700 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700 flex-shrink-0">
            <span className="text-gray-400 text-xs uppercase tracking-wider">Keystroke Log</span>
            <button onClick={() => { dispatch({ type: 'CLEAR_LOG' }); matcherRef.current.reset() }} className="text-gray-600 hover:text-gray-300 text-xs">
              Clear
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5 text-xs">
            {log.length === 0 && (
              <p className="text-gray-600 italic px-1 py-2">Type in the editor…</p>
            )}
            {log.map(entry => {
              const modeShort = entry.vimMode === 'normal' ? 'N' : 'O'
              const bg = entry.matchesChallenge
                ? 'bg-green-900/30 border-l-2 border-green-600'
                : entry.isEmitted
                  ? 'bg-blue-900/20 border-l-2 border-blue-700'
                  : entry.matchResult && !entry.matchesChallenge
                    ? 'bg-yellow-900/10'
                    : ''
              return (
                <div
                  key={entry.id}
                  className={`px-2 py-0.5 font-mono text-xs leading-5 ${bg}`}
                >
                  {/* Mode badge — stays inline so the whole line copies as one */}
                  <span className={entry.vimMode === 'normal' ? 'text-gray-600' : 'text-indigo-500'}>
                    [{modeShort}]
                  </span>
                  {' '}
                  {/* Key (emitted entries shown in blue, matched in green, others white/dim) */}
                  <span className={
                    entry.isEmitted
                      ? 'text-blue-300 font-bold'
                      : entry.matchesChallenge
                        ? 'text-green-300 font-bold'
                        : entry.vimMode === 'normal'
                          ? 'text-white'
                          : 'text-indigo-300'
                  }>
                    {entry.key}
                  </span>
                  {/* Matched solution (only if different from key itself) */}
                  {entry.matchResult && entry.matchResult !== entry.key && (
                    <span className={entry.matchesChallenge ? 'text-green-500' : 'text-yellow-600'}>
                      {' → '}{entry.matchResult}
                    </span>
                  )}
                  {/* Single-char solution indicator */}
                  {entry.inSolutions && !entry.matchResult && (
                    <span className="text-blue-600"> (sol)</span>
                  )}
                  {/* Match badge */}
                  {entry.matchesChallenge && (
                    <span className="text-green-400 font-bold"> ✓</span>
                  )}
                </div>
              )
            })}
            <div ref={logEndRef} />
          </div>
        </div>
      </div>
    </div>
  )
}
