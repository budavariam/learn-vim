import { useReducer, useEffect, useRef, useMemo } from 'react'
import { loadUnsupported } from '../engine/UnsupportedEngine'
import { loadKnown } from '../engine/KnownEngine'
import { ALL_CATEGORIES, DEFAULT_CATEGORIES, MIN_CATEGORIES } from '../engine/categoryColors'
import type { Language, GameMode, TimedChallengeDuration, RepetitionLevel, GuidedMode, GameConfig } from '../engine/types'
import { CategoryPicker } from './CategoryPicker'
import rawData from '../data.json'

const allCommands = rawData as Array<{ id: string; category: string }>

// Minimum commands required for a playable session, by game mode
const MIN_COMMANDS: Record<GameMode, number> = {
  general:         10,
  timed_challenge: 10,
  survival:         5,
}

const LANGUAGES: { id: Language; label: string; icon: string }[] = [
  { id: 'go',         label: 'Go',         icon: '🐹' },
  { id: 'rust',       label: 'Rust',       icon: '🦀' },
  { id: 'python',     label: 'Python',     icon: '🐍' },
  { id: 'typescript', label: 'TypeScript', icon: '🟦' },
  { id: 'c',          label: 'C',          icon: '🔷' },
  { id: 'cpp',        label: 'C++',        icon: '🔶' },
]

const MODES: { id: GameMode; label: string; desc: string }[] = [
  { id: 'general',         label: 'General',         desc: 'Practice endlessly, level up naturally' },
  { id: 'timed_challenge', label: 'Timed Challenge',  desc: 'Race the clock for a fixed session' },
  { id: 'survival',        label: 'Survival',         desc: 'One miss ends it — longer limits, no mercy' },
]

const DURATIONS: TimedChallengeDuration[] = [1, 2, 5, 10, 15]

const REPETITIONS: { value: RepetitionLevel; label: string; desc: string }[] = [
  { value: 1, label: '1×', desc: 'Each command once' },
  { value: 2, label: '2×', desc: 'Reinforce twice' },
  { value: 3, label: '3×', desc: 'Build muscle memory' },
  { value: 5, label: '5×', desc: 'Deep mastery' },
]

const GUIDED_MODES: { id: GuidedMode; label: string; desc: string }[] = [
  { id: 'none',               label: 'None',                desc: 'No hints — you know this' },
  { id: 'first_only',         label: 'First only',          desc: 'Show once, then test blindly' },
  { id: 'after_failure',      label: 'After failure',       desc: 'Hint appears after a miss' },
  { id: 'first_then_failure', label: 'First + on failure',  desc: 'Show once, re-show after misses' },
  { id: 'alternating',        label: 'Alternating',         desc: 'Show on every other occurrence' },
  { id: 'all',                label: 'Always',              desc: 'Solution always visible (minimal points)' },
]

interface SetupScreenProps {
  onStart: (config: GameConfig) => void
  onHighScores: () => void
  lastConfig: GameConfig | null
}

// ── Reducer ──────────────────────────────────────────────────────────────────

type SetupState = {
  lang: Language
  level: number
  mode: GameMode
  duration: TimedChallengeDuration
  repetition: RepetitionLevel
  guided: GuidedMode
  categories: string[]
  assistEnabled: boolean
  assistPct: number
  skipUnsupported: boolean
  knowledgeFilter: 'all' | 'known' | 'unknown'
}

type SetupAction =
  | { type: 'SET_LANG'; value: Language }
  | { type: 'SET_LEVEL'; value: number }
  | { type: 'SET_MODE'; value: GameMode }
  | { type: 'SET_DURATION'; value: TimedChallengeDuration }
  | { type: 'SET_REPETITION'; value: RepetitionLevel }
  | { type: 'SET_GUIDED'; value: GuidedMode }
  | { type: 'SET_CATEGORIES'; value: string[] }
  | { type: 'SET_ASSIST_PCT'; value: number }
  | { type: 'SET_KNOWLEDGE_FILTER'; value: 'all' | 'known' | 'unknown' }
  | { type: 'TOGGLE_ASSIST' }
  | { type: 'TOGGLE_SKIP_UNSUPPORTED' }

function setupReducer(state: SetupState, action: SetupAction): SetupState {
  switch (action.type) {
    case 'SET_LANG':        return { ...state, lang: action.value }
    case 'SET_LEVEL':       return { ...state, level: action.value }
    case 'SET_MODE':        return { ...state, mode: action.value }
    case 'SET_DURATION':    return { ...state, duration: action.value }
    case 'SET_REPETITION':  return { ...state, repetition: action.value }
    case 'SET_GUIDED':      return { ...state, guided: action.value }
    case 'SET_CATEGORIES':  return { ...state, categories: action.value }
    case 'SET_ASSIST_PCT':  return { ...state, assistPct: action.value }
    case 'SET_KNOWLEDGE_FILTER': return { ...state, knowledgeFilter: action.value }
    case 'TOGGLE_ASSIST':   return { ...state, assistEnabled: !state.assistEnabled }
    case 'TOGGLE_SKIP_UNSUPPORTED': {
      const next = !state.skipUnsupported
      try { localStorage.setItem('vim_arcade_skip_unsupported', String(next)) } catch { /* ignore */ }
      return { ...state, skipUnsupported: next }
    }
    default: return state
  }
}

function makeInitialState(lastConfig: GameConfig | null): SetupState {
  return {
    lang:            lastConfig?.language ?? 'typescript',
    level:           lastConfig?.startingLevel ?? 0,
    mode:            lastConfig?.mode ?? 'general',
    duration:        (lastConfig?.timedDurationMs ? lastConfig.timedDurationMs / 60_000 : 5) as TimedChallengeDuration,
    repetition:      lastConfig?.repetitionTarget ?? 2,
    guided:          lastConfig?.guidedMode ?? 'none',
    categories:      lastConfig?.categories ?? [...DEFAULT_CATEGORIES],
    assistEnabled:   lastConfig?.dynamicAssist !== null && lastConfig?.dynamicAssist !== undefined,
    assistPct:       lastConfig?.dynamicAssist ?? 100,
    skipUnsupported: (() => {
      try {
        const raw = localStorage.getItem('vim_arcade_skip_unsupported')
        return raw === null ? true : raw === 'true'
      } catch { return true }
    })(),
    knowledgeFilter: (lastConfig?.knowledgeFilter ?? 'all') as 'all' | 'known' | 'unknown',
  }
}

// ─────────────────────────────────────────────────────────────────────────────

export function SetupScreen({ onStart, onHighScores, lastConfig }: SetupScreenProps) {
  const [s, dispatch] = useReducer(setupReducer, lastConfig, makeInitialState)

  // Derived values — computed inline, no extra state
  const unsupportedCount = loadUnsupported().size

  // Compute the number of commands available under all active filters.
  // Used to enforce per-mode minimums before allowing Start.
  const availableCount = useMemo(() => {
    let cmds = s.categories.length < ALL_CATEGORIES.length
      ? allCommands.filter(c => s.categories.includes(c.category))
      : allCommands
    if (s.skipUnsupported) {
      const unsupported = loadUnsupported()
      cmds = cmds.filter(c => !unsupported.has(c.id))
    }
    if (s.knowledgeFilter !== 'all') {
      const known = loadKnown()
      cmds = s.knowledgeFilter === 'known'
        ? cmds.filter(c => known.has(c.id))
        : cmds.filter(c => !known.has(c.id))
    }
    return cmds.length
  }, [s.categories, s.skipUnsupported, s.knowledgeFilter])

  const minCommands    = MIN_COMMANDS[s.mode]
  const enoughCommands = availableCount >= minCommands
  const canStart = s.categories.length >= MIN_CATEGORIES && enoughCommands
  const effectiveAssistPct = s.mode === 'survival' ? Math.min(100, s.assistPct) : s.assistPct

  function handleStart() {
    const config: GameConfig = {
      mode:             s.mode,
      language:         s.lang,
      startingLevel:    s.level,
      repetitionTarget: s.repetition,
      guidedMode:       s.guided,
      categories:       s.categories.length === 0 ? null : s.categories,
      timedDurationMs:  s.mode === 'timed_challenge' ? s.duration * 60_000 : undefined,
      dynamicAssist:    s.assistEnabled ? effectiveAssistPct : null,
      skipUnsupported:  s.skipUnsupported,
      knowledgeFilter:  s.knowledgeFilter,
    }
    onStart(config)
  }

  // Use a ref so the keydown handler always calls the latest handleStart
  // without the stale closure bug.
  const handleStartRef = useRef(handleStart)
  handleStartRef.current = handleStart

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      if (e.key === 'Enter' && target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && canStart) {
        handleStartRef.current()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [canStart])

  return (
    <div className="min-h-screen bg-gray-900 overflow-y-auto">
      <div className="max-w-xl mx-auto py-12 px-6 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white font-mono mb-1">VIM ARCADE</h1>
          <p className="text-gray-400 font-mono text-sm">Practice vim commands in real code</p>
        </div>

        {/* Language */}
        <Section label="Language">
          <div className="grid grid-cols-3 gap-3">
            {LANGUAGES.map(l => (
              <OptionButton
                key={l.id}
                active={s.lang === l.id}
                onClick={() => dispatch({ type: 'SET_LANG', value: l.id })}
              >
                <span className="text-xl mr-2">{l.icon}</span>
                <span>{l.label}</span>
              </OptionButton>
            ))}
          </div>
        </Section>

        {/* Starting level */}
        <Section label={<>Starting Level: <span className="text-yellow-400">{s.level}</span></>}>
          <input
            type="range" min={0} max={9} step={1} value={s.level}
            onChange={e => dispatch({ type: 'SET_LEVEL', value: Number(e.target.value) })}
            className="w-full accent-green-500"
          />
          <div className="flex justify-between text-xs text-gray-500 font-mono mt-1">
            <span>Beginner</span><span>Expert</span>
          </div>
        </Section>

        {/* Game mode */}
        <Section label="Game Mode">
          <div className="space-y-2">
            {MODES.map(m => (
              <OptionButton
                key={m.id}
                active={s.mode === m.id}
                onClick={() => dispatch({ type: 'SET_MODE', value: m.id })}
                className="flex-col items-start gap-0.5"
              >
                <span className="font-bold font-mono">{m.label}</span>
                <span className="text-xs text-gray-400">{m.desc}</span>
              </OptionButton>
            ))}
          </div>

          {s.mode === 'timed_challenge' && (
            <div className="mt-3">
              <p className="text-gray-400 font-mono text-xs uppercase tracking-wider mb-2">Duration</p>
              <div className="flex gap-2 flex-wrap">
                {DURATIONS.map(d => (
                  <button
                    key={d}
                    onClick={() => dispatch({ type: 'SET_DURATION', value: d })}
                    className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
                      s.duration === d
                        ? 'bg-blue-600 text-white border-2 border-blue-400'
                        : 'bg-gray-800 text-gray-400 border-2 border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    {d}m
                  </button>
                ))}
              </div>
            </div>
          )}
        </Section>

        {/* Repetition */}
        <Section label="Repetition per Command">
          <div className="grid grid-cols-2 gap-2">
            {REPETITIONS.map(r => (
              <OptionButton
                key={r.value}
                active={s.repetition === r.value}
                onClick={() => dispatch({ type: 'SET_REPETITION', value: r.value })}
                className="flex-col items-start gap-0"
              >
                <span className="font-bold font-mono text-lg">{r.label}</span>
                <span className="text-xs text-gray-400">{r.desc}</span>
              </OptionButton>
            ))}
          </div>
        </Section>

        {/* Guided mode */}
        <Section label="Guided Mode">
          <div className="space-y-1.5">
            {GUIDED_MODES.map(g => (
              <label
                key={g.id}
                className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  s.guided === g.id
                    ? 'border-purple-500 bg-purple-900/30'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                }`}
              >
                <input
                  type="radio" name="guided" value={g.id}
                  checked={s.guided === g.id}
                  onChange={() => dispatch({ type: 'SET_GUIDED', value: g.id })}
                  className="mt-0.5 accent-purple-500"
                />
                <div>
                  <div className="font-mono text-sm text-white font-medium">{g.label}</div>
                  <div className="text-xs text-gray-400">{g.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </Section>

        {/* Dynamic Assist */}
        <Section label="Dynamic Assist">
          <div className="flex items-center gap-3">
            <button
              role="switch"
              aria-checked={s.assistEnabled}
              onClick={() => dispatch({ type: 'TOGGLE_ASSIST' })}
              className={`relative w-10 h-6 rounded-full transition-colors ${
                s.assistEnabled ? 'bg-orange-600' : 'bg-gray-700'
              }`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                s.assistEnabled ? 'translate-x-5' : 'translate-x-1'
              }`} />
            </button>
            <span className="font-mono text-sm text-gray-300">
              {s.assistEnabled
                ? `Show solution after ${effectiveAssistPct}% of time limit`
                : 'Off — no automatic hint'}
            </span>
          </div>

          {s.assistEnabled && (
            <div className="mt-3 space-y-2">
              <input
                type="range" min={30} max={150} step={10} value={s.assistPct}
                onChange={e => dispatch({ type: 'SET_ASSIST_PCT', value: Number(e.target.value) })}
                className="w-full accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-500 font-mono">
                <span>30% (early)</span>
                <span className="text-orange-400 font-bold">{s.assistPct}%</span>
                <span>150% (late)</span>
              </div>
              <p className="text-gray-500 font-mono text-xs">
                e.g. with a 10 s limit and {s.assistPct}%, solution appears after{' '}
                <span className="text-orange-300">{(10 * s.assistPct / 100).toFixed(1)} s</span>
                {s.mode === 'survival' && s.assistPct > 100 && (
                  <span className="text-yellow-500 ml-2">
                    ⚠ capped at 100% in Survival mode
                  </span>
                )}
              </p>
            </div>
          )}
        </Section>

        {/* Categories */}
        <Section label={<>Focus areas <span className="text-gray-600 normal-case">(min {MIN_CATEGORIES})</span></>}>
          <CategoryPicker
            selected={s.categories}
            onChange={value => dispatch({ type: 'SET_CATEGORIES', value })}
          />
        </Section>

        {/* Skip unsupported */}
        <Section label="Skip Unsupported Commands">
          <div className="flex items-center justify-between">
            <label
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => dispatch({ type: 'TOGGLE_SKIP_UNSUPPORTED' })}
            >
              <div className={`relative w-10 h-6 rounded-full transition-colors ${s.skipUnsupported ? 'bg-green-600' : 'bg-gray-700'}`}>
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${s.skipUnsupported ? 'translate-x-5' : 'translate-x-1'}`} />
              </div>
              <span className="font-mono text-sm text-gray-300">
                {s.skipUnsupported ? 'On — skip marked commands' : 'Off — include all commands'}
              </span>
            </label>
            {unsupportedCount > 0 && (
              <span className="text-gray-500 font-mono text-xs">({unsupportedCount} marked)</span>
            )}
          </div>
        </Section>

        {/* Knowledge filter */}
        <Section label="Practice Focus">
          <div className="space-y-2">
            {([ ['all', 'All commands', 'No filter — practice everything'],
               ['unknown', 'Unknown only', 'Commands not yet marked as known — build new skills'],
               ['known',   'Known only',   'Commands you already know — refresh and maintain'],
             ] as const).map(([id, label, desc]) => (
              <label
                key={id}
                className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  s.knowledgeFilter === id
                    ? 'border-blue-500 bg-blue-900/30'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                }`}
              >
                <input
                  type="radio"
                  name="knowledgeFilter"
                  checked={s.knowledgeFilter === id}
                  onChange={() => dispatch({ type: 'SET_KNOWLEDGE_FILTER', value: id })}
                  className="mt-0.5 accent-blue-500"
                />
                <div>
                  <div className="font-mono text-sm text-white font-medium">{label}</div>
                  <div className="text-xs text-gray-400">{desc}</div>
                </div>
              </label>
            ))}
          </div>

          {/* Available count + minimum warning */}
          <div className="mt-3 flex items-center justify-between text-xs font-mono">
            <span className={enoughCommands ? 'text-gray-500' : 'text-red-400'}>
              {availableCount} command{availableCount !== 1 ? 's' : ''} available
            </span>
            {!enoughCommands && (
              <span className="text-red-400">
                need at least {minCommands} for {s.mode.replace('_', ' ')}
              </span>
            )}
          </div>
        </Section>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleStart}
            disabled={!canStart}
            className={`flex-1 py-4 font-mono font-bold text-lg rounded-lg transition-colors uppercase tracking-wider ${
              canStart
                ? 'bg-green-600 hover:bg-green-500 text-white'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            {!enoughCommands
              ? `Too few commands (${availableCount}/${minCommands})`
              : 'Start'}
          </button>
          <button
            onClick={onHighScores}
            className="px-6 py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 font-mono text-sm rounded-lg transition-colors border border-gray-700"
          >
            High Scores
          </button>
        </div>

        {/* Quick-repeat last session */}
        {lastConfig && (
          <button
            onClick={() => onStart(lastConfig)}
            className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-400 font-mono text-sm rounded-lg border border-gray-700 transition-colors"
          >
            ↩ Repeat last: {lastConfig.mode} · {lastConfig.language} · Lv{lastConfig.startingLevel} · {lastConfig.repetitionTarget}× rep
          </button>
        )}
      </div>
    </div>
  )
}

function Section({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-gray-300 font-mono text-xs uppercase tracking-wider mb-3">{label}</h2>
      {children}
    </div>
  )
}

function OptionButton({
  active,
  onClick,
  children,
  className = '',
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 w-full p-3 rounded-lg border-2 font-mono text-sm transition-all ${
        active
          ? 'border-green-500 bg-green-900/30 text-green-300'
          : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500'
      } ${className}`}
    >
      {children}
    </button>
  )
}
