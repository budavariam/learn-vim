import { STORAGE_KEYS } from '../engine/storageKeys'
import { useReducer, useEffect, useRef, useMemo } from 'react'
import { loadUnsupported } from '../engine/UnsupportedEngine'
import { loadKnown } from '../engine/KnownEngine'
import { ALL_CATEGORIES, DEFAULT_CATEGORIES, MIN_CATEGORIES } from '../engine/categoryColors'
import type {
  Language,
  GameMode,
  TimedChallengeDuration,
  RepetitionLevel,
  GuidedMode,
  GameConfig,
} from '../engine/types'
import { CategoryPicker } from './CategoryPicker'
import rawData from '../data.json'
import {
  cls,
  LanguageGrid,
  CollapseSection,
  SetupPageShell,
  UnifiedChallengeOptions,
  StartButton,
  ReplayButton,
} from './SetupPrimitives'
import { Globe, Gamepad2, Zap, Ban } from 'lucide-react'

const allCommands = rawData as Array<{ id: string; category: string }>

// Minimum commands required for a playable session, by game mode
const MIN_COMMANDS: Record<GameMode, number> = {
  general: 10,
  timed_challenge: 10,
  survival: 5,
}

const MODES: { id: GameMode; label: string; desc: string }[] = [
  { id: 'general', label: 'General', desc: 'Practice endlessly, level up naturally' },
  { id: 'timed_challenge', label: 'Timed Challenge', desc: 'Race the clock for a fixed session' },
  { id: 'survival', label: 'Survival', desc: 'One miss ends it — longer limits, no mercy' },
]

const DURATIONS: TimedChallengeDuration[] = [1, 2, 5, 10, 15]

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
  commandTimeMultiplier: number
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
  | { type: 'SET_TIME_MULT'; value: number }
  | { type: 'TOGGLE_ASSIST' }
  | { type: 'TOGGLE_SKIP_UNSUPPORTED' }

function setupReducer(state: SetupState, action: SetupAction): SetupState {
  switch (action.type) {
    case 'SET_LANG':
      return { ...state, lang: action.value }
    case 'SET_LEVEL':
      return { ...state, level: action.value }
    case 'SET_MODE':
      return { ...state, mode: action.value }
    case 'SET_DURATION':
      return { ...state, duration: action.value }
    case 'SET_REPETITION':
      return { ...state, repetition: action.value }
    case 'SET_GUIDED':
      return { ...state, guided: action.value }
    case 'SET_CATEGORIES':
      return { ...state, categories: action.value }
    case 'SET_ASSIST_PCT':
      return { ...state, assistPct: action.value }
    case 'SET_KNOWLEDGE_FILTER':
      return { ...state, knowledgeFilter: action.value }
    case 'SET_TIME_MULT':
      return { ...state, commandTimeMultiplier: action.value }
    case 'TOGGLE_ASSIST':
      return { ...state, assistEnabled: !state.assistEnabled }
    case 'TOGGLE_SKIP_UNSUPPORTED': {
      const next = !state.skipUnsupported
      try {
        localStorage.setItem(STORAGE_KEYS.SKIP_UNSUPPORTED, String(next))
      } catch {
        /* ignore */
      }
      return { ...state, skipUnsupported: next }
    }
    default:
      return state
  }
}

function makeInitialState(lastConfig: GameConfig | null): SetupState {
  return {
    lang: lastConfig?.language ?? 'typescript',
    level: lastConfig?.startingLevel ?? 0,
    mode: lastConfig?.mode ?? 'timed_challenge',
    duration: (lastConfig?.timedDurationMs
      ? lastConfig.timedDurationMs / 60_000
      : 1) as TimedChallengeDuration,
    repetition: lastConfig?.repetitionTarget ?? 2,
    guided: lastConfig?.guidedMode ?? 'none',
    categories: lastConfig?.categories ?? [...DEFAULT_CATEGORIES],
    assistEnabled: lastConfig
      ? lastConfig.dynamicAssist !== null && lastConfig.dynamicAssist !== undefined
      : true,
    assistPct: lastConfig?.dynamicAssist ?? 100,
    skipUnsupported: (() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.SKIP_UNSUPPORTED)
        return raw === null ? true : raw === 'true'
      } catch {
        return true
      }
    })(),
    knowledgeFilter: (lastConfig?.knowledgeFilter ?? 'all') as 'all' | 'known' | 'unknown',
    commandTimeMultiplier: lastConfig?.commandTimeMultiplier ?? 1,
  }
}

// ─────────────────────────────────────────────────────────────────────────────

export function SetupScreen({
  onStart,
  onHighScores: _onHighScores,
  lastConfig,
}: SetupScreenProps) {
  const [s, dispatch] = useReducer(setupReducer, lastConfig, makeInitialState)

  // Derived values — computed inline, no extra state
  const unsupportedCount = loadUnsupported().size

  // Compute the number of commands available under all active filters.
  // Used to enforce per-mode minimums before allowing Start.
  const availableCount = useMemo(() => {
    let cmds =
      s.categories.length < ALL_CATEGORIES.length
        ? allCommands.filter(c => s.categories.includes(c.category))
        : allCommands
    if (s.skipUnsupported) {
      const unsupported = loadUnsupported()
      cmds = cmds.filter(c => !unsupported.has(c.id))
    }
    if (s.knowledgeFilter !== 'all') {
      const known = loadKnown()
      cmds =
        s.knowledgeFilter === 'known'
          ? cmds.filter(c => known.has(c.id))
          : cmds.filter(c => !known.has(c.id))
    }
    return cmds.length
  }, [s.categories, s.skipUnsupported, s.knowledgeFilter])

  const minCommands = MIN_COMMANDS[s.mode]
  const enoughCommands = availableCount >= minCommands
  const canStart = s.categories.length >= MIN_CATEGORIES && enoughCommands
  const effectiveAssistPct = s.mode === 'survival' ? Math.min(100, s.assistPct) : s.assistPct

  function handleStart() {
    const config: GameConfig = {
      mode: s.mode,
      language: s.lang,
      startingLevel: s.level,
      repetitionTarget: s.repetition,
      guidedMode: s.guided,
      categories: s.categories.length === 0 ? null : s.categories,
      timedDurationMs: s.mode === 'timed_challenge' ? s.duration * 60_000 : undefined,
      dynamicAssist: s.assistEnabled ? effectiveAssistPct : null,
      skipUnsupported: s.skipUnsupported,
      knowledgeFilter: s.knowledgeFilter,
      commandTimeMultiplier: s.commandTimeMultiplier,
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
      if (
        e.key === 'Enter' &&
        target.tagName !== 'INPUT' &&
        target.tagName !== 'TEXTAREA' &&
        canStart
      ) {
        handleStartRef.current()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [canStart])

  const actions = (
    <div className="space-y-3">
      <StartButton
        onClick={handleStart}
        disabled={!canStart}
        disabledLabel={`Too few commands (${availableCount}/${minCommands})`}
      />

      {lastConfig && (
        <ReplayButton
          onClick={() => onStart(lastConfig!)}
          summary={`${lastConfig.mode} · ${lastConfig.language} · Lv${lastConfig.startingLevel}`}
        />
      )}
    </div>
  )

  return (
    <SetupPageShell
      title="VIM ARCADE"
      subtitle="Practice vim commands in real code"
      actions={actions}
    >
      {/* Language */}
      <CollapseSection label="Language" icon={Globe} defaultOpen={true}>
        <LanguageGrid value={s.lang} onChange={v => dispatch({ type: 'SET_LANG', value: v })} />
      </CollapseSection>

      {/* Game Mode */}
      <CollapseSection label="Game Mode" icon={Gamepad2} defaultOpen={true}>
        <div className="space-y-2">
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => dispatch({ type: 'SET_MODE', value: m.id })}
              className={cls.modeCard(s.mode === m.id)}
            >
              <div className="font-bold">{m.label}</div>
              <div className="text-xs text-gray-400">{m.desc}</div>
            </button>
          ))}
        </div>

        {s.mode === 'timed_challenge' && (
          <div className="mt-3">
            <p className="text-gray-400 font-mono text-xs uppercase tracking-wider mb-2">
              Duration
            </p>
            <div className="flex gap-2 flex-wrap">
              {DURATIONS.map(d => (
                <button
                  key={d}
                  onClick={() => dispatch({ type: 'SET_DURATION', value: d })}
                  className={cls.pill(s.duration === d)}
                >
                  {d}m
                </button>
              ))}
            </div>
          </div>
        )}
      </CollapseSection>

      {/* Challenge Options */}
      <CollapseSection label="Challenge Options" icon={Zap} defaultOpen={false}>
        <UnifiedChallengeOptions
          guidedMode={s.guided}
          onGuidedMode={v => dispatch({ type: 'SET_GUIDED', value: v })}
          startingLevel={s.level}
          onStartingLevel={v => dispatch({ type: 'SET_LEVEL', value: v })}
          repetition={s.repetition}
          onRepetition={v => dispatch({ type: 'SET_REPETITION', value: v })}
          timeMultiplier={s.commandTimeMultiplier}
          onTimeMultiplier={v => dispatch({ type: 'SET_TIME_MULT', value: v })}
          dynamicAssistEnabled={s.assistEnabled}
          onDynamicAssistToggle={() => dispatch({ type: 'TOGGLE_ASSIST' })}
          dynamicAssistPct={s.assistEnabled ? effectiveAssistPct : undefined}
          onDynamicAssistPct={v => dispatch({ type: 'SET_ASSIST_PCT', value: v })}
          knowledgeFilter={s.knowledgeFilter}
          onKnowledgeFilter={v => dispatch({ type: 'SET_KNOWLEDGE_FILTER', value: v as any })}
        />
      </CollapseSection>

      {/* Categories */}
      <CollapseSection
        label={
          <>
            Focus areas <span className="text-gray-600 normal-case">(min {MIN_CATEGORIES})</span>
          </>
        }
        defaultOpen={false}
      >
        <CategoryPicker
          selected={s.categories}
          onChange={value => dispatch({ type: 'SET_CATEGORIES', value })}
        />
      </CollapseSection>

      {/* Skip unsupported */}
      <CollapseSection
        label="Skip Unsupported Commands"
        icon={Ban}
        defaultOpen={false}
        badge={s.skipUnsupported ? 'On' : 'Off'}
      >
        <div className="flex items-center justify-between">
          <label
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => dispatch({ type: 'TOGGLE_SKIP_UNSUPPORTED' })}
          >
            <div
              className={`relative w-10 h-6 rounded-full transition-colors ${s.skipUnsupported ? 'bg-green-600' : 'bg-gray-700'}`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${s.skipUnsupported ? 'translate-x-5' : 'translate-x-1'}`}
              />
            </div>
            <span className="font-mono text-sm text-gray-300">
              {s.skipUnsupported ? 'On — skip marked commands' : 'Off — include all commands'}
            </span>
          </label>
          {unsupportedCount > 0 && (
            <span className="text-gray-500 font-mono text-xs">({unsupportedCount} marked)</span>
          )}
        </div>
      </CollapseSection>
    </SetupPageShell>
  )
}
