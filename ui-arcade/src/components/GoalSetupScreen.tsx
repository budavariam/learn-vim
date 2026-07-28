import { STORAGE_KEYS } from '../engine/storageKeys'
import { useReducer, useState } from 'react'
import type {
  GoalModeConfig,
  GoalTimeLimitMs,
  Language,
  RepetitionLevel,
  GuidedMode,
  HandicapConfig,
} from '../engine/types'
import { HANDICAP_CONFIG_DEFAULTS } from '../engine/types'
import { loadUnsupported } from '../engine/UnsupportedEngine'
import { DEFAULT_CATEGORIES, MIN_CATEGORIES } from '../engine/categoryColors'
import { CategoryPicker } from './CategoryPicker'
import { useVimGolfChallenges } from '../hooks/useVimGolfChallenges'
import { loadVimGolfRecords } from '../engine/VimGolfEngine'
import {
  cls,
  CollapseSection,
  ChallengeToggleSection,
  LanguageGrid,
  SetupPageShell,
  UnifiedChallengeOptions,
  HandicapsSection,
  StartButton,
  ReplayButton,
} from './SetupPrimitives'
import { Globe, Target, Settings2 } from 'lucide-react'

const TIME_OPTIONS: { value: GoalTimeLimitMs; label: string }[] = [
  { value: 30_000, label: '30s' },
  { value: 60_000, label: '1m' },
  { value: 120_000, label: '2m' },
  { value: 0, label: '∞' },
]

type Difficulty = 'all' | 'easy' | 'medium' | 'hard'

const DIFFICULTIES: { id: Difficulty; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
]

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

type GoalSetupState = {
  // Text goals
  challengeCount: number
  timeLimitMs: GoalTimeLimitMs
  difficulty: Difficulty
  solvedFilter: 'all' | 'unsolved' | 'solved' | 'mixed'
  // Command challenges
  commandChallengesEnabled: boolean
  concurrentChallenges: number
  commandTimeMultiplier: number
  // Shared arcade options
  language: Language
  startingLevel: number
  repetition: RepetitionLevel
  guidedMode: GuidedMode
  categories: string[]
  assistEnabled: boolean
  assistPct: number
  skipUnsupported: boolean
  handicaps: HandicapConfig
}

type GoalSetupAction =
  | { type: 'SET_COUNT'; value: number }
  | { type: 'SET_TIME'; value: GoalTimeLimitMs }
  | { type: 'SET_DIFFICULTY'; value: Difficulty }
  | { type: 'SET_SOLVED_FILTER'; value: 'all' | 'unsolved' | 'solved' | 'mixed' }
  | { type: 'TOGGLE_CMD_CHALLENGES' }
  | { type: 'SET_CONCURRENT'; value: number }
  | { type: 'SET_TIME_MULT'; value: number }
  | { type: 'SET_LANGUAGE'; value: Language }
  | { type: 'SET_LEVEL'; value: number }
  | { type: 'SET_REPETITION'; value: RepetitionLevel }
  | { type: 'SET_GUIDED'; value: GuidedMode }
  | { type: 'SET_CATEGORIES'; value: string[] }
  | { type: 'SET_ASSIST_PCT'; value: number }
  | { type: 'PATCH_HANDICAPS'; patch: Partial<HandicapConfig> }
  | { type: 'TOGGLE_ASSIST' }
  | { type: 'TOGGLE_SKIP_UNSUPPORTED' }

function setupReducer(state: GoalSetupState, action: GoalSetupAction): GoalSetupState {
  switch (action.type) {
    case 'SET_COUNT':
      return { ...state, challengeCount: action.value }
    case 'SET_TIME':
      return { ...state, timeLimitMs: action.value }
    case 'TOGGLE_CMD_CHALLENGES':
      return { ...state, commandChallengesEnabled: !state.commandChallengesEnabled }
    case 'SET_DIFFICULTY':
      return { ...state, difficulty: action.value }
    case 'SET_SOLVED_FILTER':
      return { ...state, solvedFilter: action.value }
    case 'SET_CONCURRENT':
      return { ...state, concurrentChallenges: action.value }
    case 'SET_TIME_MULT':
      return { ...state, commandTimeMultiplier: action.value }
    case 'SET_LANGUAGE':
      return { ...state, language: action.value }
    case 'SET_LEVEL':
      return { ...state, startingLevel: action.value }
    case 'SET_REPETITION':
      return { ...state, repetition: action.value }
    case 'SET_GUIDED':
      return { ...state, guidedMode: action.value }
    case 'SET_CATEGORIES':
      return { ...state, categories: action.value }
    case 'SET_ASSIST_PCT':
      return { ...state, assistPct: action.value }
    case 'PATCH_HANDICAPS':
      return { ...state, handicaps: { ...state.handicaps, ...action.patch } }
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

const defaultState: GoalSetupState = {
  challengeCount: 5,
  timeLimitMs: 60_000,
  difficulty: 'all',
  solvedFilter: 'all',
  commandChallengesEnabled: true,
  concurrentChallenges: 5,
  commandTimeMultiplier: 2.0,
  language: 'typescript',
  startingLevel: 0,
  repetition: 2,
  guidedMode: 'none',
  categories: [...DEFAULT_CATEGORIES],
  assistEnabled: false,
  assistPct: 100,
  skipUnsupported: (() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SKIP_UNSUPPORTED)
      return raw === null ? true : raw === 'true'
    } catch {
      return true
    }
  })(),
  handicaps: { ...HANDICAP_CONFIG_DEFAULTS },
}

// ---------------------------------------------------------------------------
// Last-config persistence helpers
// ---------------------------------------------------------------------------

function loadLastGoalConfig(): GoalModeConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LAST_GOAL_CONFIG)
    return raw ? (JSON.parse(raw) as GoalModeConfig) : null
  } catch {
    return null
  }
}

function saveLastGoalConfig(config: GoalModeConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_GOAL_CONFIG, JSON.stringify(config))
  } catch {
    /* ignore */
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface GoalSetupScreenProps {
  onStart: (config: GoalModeConfig) => void
  onBack: () => void
}

export function GoalSetupScreen({ onStart, onBack: _onBack }: GoalSetupScreenProps) {
  const [s, dispatch] = useReducer(setupReducer, defaultState)
  const [lastConfig, setLastConfig] = useState<GoalModeConfig | null>(loadLastGoalConfig)
  const { challenges: allChallenges } = useVimGolfChallenges()

  const available =
    s.difficulty === 'all'
      ? allChallenges.length
      : allChallenges.filter(c => c.difficulty === s.difficulty).length

  const unsupportedCount = loadUnsupported().size
  const canStart = available > 0 && s.categories.length >= MIN_CATEGORIES

  function handleStart() {
    const records = loadVimGolfRecords()
    let pool = allChallenges
    if (s.difficulty !== 'all') pool = pool.filter(c => c.difficulty === s.difficulty)
    if (s.solvedFilter === 'solved') pool = pool.filter(c => records[c.id] !== undefined)
    if (s.solvedFilter === 'unsolved') pool = pool.filter(c => records[c.id] === undefined)
    if (s.solvedFilter === 'mixed') {
      const solved = pool.filter(c => records[c.id] !== undefined)
      const unsolved = pool.filter(c => records[c.id] === undefined)
      const wantUnsolved = Math.ceil(s.challengeCount * 0.7)
      const wantSolved = s.challengeCount - wantUnsolved
      pool = [...unsolved.slice(0, wantUnsolved), ...solved.slice(0, wantSolved)]
    }
    const count = Math.min(s.challengeCount, pool.length)
    const config: GoalModeConfig = {
      challengeCount: count,
      timeLimitMs: s.timeLimitMs,
      difficulty: s.difficulty,
      solvedFilter: s.solvedFilter,
      concurrentChallenges: s.commandChallengesEnabled ? s.concurrentChallenges : 0,
      commandTimeMultiplier: s.commandTimeMultiplier,
      language: s.language,
      startingLevel: s.startingLevel,
      repetitionTarget: s.repetition,
      guidedMode: s.guidedMode,
      categories: s.categories.length === 0 ? null : s.categories,
      dynamicAssist: s.assistEnabled ? s.assistPct : null,
      skipUnsupported: s.skipUnsupported,
      ...s.handicaps,
    }
    saveLastGoalConfig(config)
    setLastConfig(config)
    onStart(config)
  }

  const actions = (
    <div className="space-y-3">
      <StartButton onClick={handleStart} disabled={!canStart} />
      {lastConfig && (
        <ReplayButton
          onClick={() => onStart(lastConfig)}
          summary={`${lastConfig.difficulty} · ${lastConfig.language}`}
        />
      )}
    </div>
  )

  return (
    <SetupPageShell
      title="Goal Mode"
      subtitle="Transform the editor to match the target"
      actions={actions}
    >
      {/* ── Language ──────────────────────────────────────────────────── */}
      <CollapseSection label="Language" icon={Globe} defaultOpen={true} badge={s.language}>
        <LanguageGrid
          value={s.language}
          onChange={lang => dispatch({ type: 'SET_LANGUAGE', value: lang })}
        />
      </CollapseSection>

      {/* ── Text Goals ────────────────────────────────────────────────── */}
      <CollapseSection label="Text Goals" icon={Target} defaultOpen={true}>
        {/* Challenge count */}
        <div className="mb-4">
          <h3 className="text-gray-400 font-mono text-xs uppercase tracking-wider mb-2">
            Challenges: <span className="text-yellow-400">{s.challengeCount}</span>
          </h3>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={s.challengeCount}
            onChange={e => dispatch({ type: 'SET_COUNT', value: Number(e.target.value) })}
            className="w-full accent-green-500"
          />
          <div className="flex justify-between text-xs text-gray-500 font-mono mt-1">
            <span>1</span>
            <span className="text-gray-500">{available} available</span>
            <span>20</span>
          </div>
          {s.challengeCount > available && (
            <p className="text-yellow-500 font-mono text-xs mt-1">
              Only {available} challenge{available !== 1 ? 's' : ''} available — will use{' '}
              {available}
            </p>
          )}
        </div>

        {/* Difficulty */}
        <div className="mb-4">
          <h3 className="text-gray-400 font-mono text-xs uppercase tracking-wider mb-2">
            Difficulty
          </h3>
          <div className="flex gap-2 flex-wrap">
            {DIFFICULTIES.map(d => (
              <button
                key={d.id}
                onClick={() => dispatch({ type: 'SET_DIFFICULTY', value: d.id })}
                className={cls.pill(s.difficulty === d.id)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time per challenge */}
        <div>
          <h3 className="text-gray-400 font-mono text-xs uppercase tracking-wider mb-2">
            Time per Challenge
          </h3>
          <div className="flex gap-2 flex-wrap">
            {TIME_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => dispatch({ type: 'SET_TIME', value: opt.value })}
                className={cls.pill(s.timeLimitMs === opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </CollapseSection>

      {/* ── Command Challenges ────────────────────────────────────────── */}
      <ChallengeToggleSection
        enabled={s.commandChallengesEnabled}
        onToggle={() => dispatch({ type: 'TOGGLE_CMD_CHALLENGES' })}
      >
        <UnifiedChallengeOptions
          guidedMode={s.guidedMode}
          onGuidedMode={v => dispatch({ type: 'SET_GUIDED', value: v })}
          startingLevel={s.startingLevel}
          onStartingLevel={v => dispatch({ type: 'SET_LEVEL', value: v })}
          repetition={s.repetition}
          onRepetition={v => dispatch({ type: 'SET_REPETITION', value: v })}
          timeMultiplier={s.commandTimeMultiplier}
          onTimeMultiplier={v => dispatch({ type: 'SET_TIME_MULT', value: v })}
          concurrent={s.concurrentChallenges}
          onConcurrent={v => dispatch({ type: 'SET_CONCURRENT', value: v })}
          dynamicAssistEnabled={s.assistEnabled}
          onDynamicAssistToggle={() => dispatch({ type: 'TOGGLE_ASSIST' })}
          dynamicAssistPct={s.assistPct}
          onDynamicAssistPct={v => dispatch({ type: 'SET_ASSIST_PCT', value: v })}
          solvedFilter={s.solvedFilter}
          onSolvedFilter={v => dispatch({ type: 'SET_SOLVED_FILTER', value: v })}
        />
      </ChallengeToggleSection>

      {/* ── Advanced Options ──────────────────────────────────────────── */}
      <CollapseSection label="Advanced Options" icon={Settings2} defaultOpen={false}>
        {/* Focus areas / Categories */}
        <div className="mb-4">
          <h3 className="text-gray-400 font-mono text-xs uppercase tracking-wider mb-2">
            Focus areas <span className="text-gray-600 normal-case">(min {MIN_CATEGORIES})</span>
          </h3>
          <CategoryPicker
            selected={s.categories}
            onChange={value => dispatch({ type: 'SET_CATEGORIES', value })}
          />
        </div>

        {/* Skip Unsupported Commands */}
        <div>
          <h3 className="text-gray-400 font-mono text-xs uppercase tracking-wider mb-2">
            Skip Unsupported Commands
          </h3>
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
        </div>
      </CollapseSection>

      {/* Handicaps */}
      <HandicapsSection
        config={s.handicaps}
        onPatch={patch => dispatch({ type: 'PATCH_HANDICAPS', patch })}
      />
    </SetupPageShell>
  )
}
