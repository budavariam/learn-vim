import React, { useReducer } from 'react'
import type { GoalModeConfig, GoalTimeLimitMs, Language, RepetitionLevel, GuidedMode } from '../engine/types'
import { BUILTIN_CHALLENGES } from '../engine/vimgolfChallenges'
import { loadUnsupported } from '../engine/UnsupportedEngine'
import { DEFAULT_CATEGORIES, MIN_CATEGORIES } from '../engine/categoryColors'
import { CategoryPicker } from './CategoryPicker'

const LANGUAGES: { id: Language; label: string; icon: string }[] = [
  { id: 'go',         label: 'Go',         icon: '🐹' },
  { id: 'rust',       label: 'Rust',       icon: '🦀' },
  { id: 'python',     label: 'Python',     icon: '🐍' },
  { id: 'typescript', label: 'TypeScript', icon: '🟦' },
  { id: 'c',          label: 'C',          icon: '🔷' },
  { id: 'cpp',        label: 'C++',        icon: '🔶' },
]

const TIME_OPTIONS: { value: GoalTimeLimitMs; label: string }[] = [
  { value: 30_000,  label: '30s' },
  { value: 60_000,  label: '1m'  },
  { value: 120_000, label: '2m'  },
  { value: 0,       label: '∞'   },
]

const TIME_MULTIPLIER_OPTIONS: { value: number; label: string }[] = [
  { value: 1.0, label: '1×'   },
  { value: 1.5, label: '1.5×' },
  { value: 2.0, label: '2×'   },
  { value: 3.0, label: '3×'   },
]

type Difficulty = 'all' | 'easy' | 'medium' | 'hard'

const DIFFICULTIES: { id: Difficulty; label: string }[] = [
  { id: 'all',    label: 'All'    },
  { id: 'easy',   label: 'Easy'   },
  { id: 'medium', label: 'Medium' },
  { id: 'hard',   label: 'Hard'   },
]

const REPETITIONS: { value: RepetitionLevel; label: string; desc: string }[] = [
  { value: 1, label: '1×', desc: 'Each command once' },
  { value: 2, label: '2×', desc: 'Reinforce twice' },
  { value: 3, label: '3×', desc: 'Build muscle memory' },
  { value: 5, label: '5×', desc: 'Deep mastery' },
]

const GUIDED_MODES: { id: GuidedMode; label: string; desc: string }[] = [
  { id: 'none',               label: 'None',               desc: 'No hints — you know this' },
  { id: 'first_only',         label: 'First only',         desc: 'Show once, then test blindly' },
  { id: 'after_failure',      label: 'After failure',      desc: 'Hint appears after a miss' },
  { id: 'first_then_failure', label: 'First + on failure', desc: 'Show once, re-show after misses' },
  { id: 'alternating',        label: 'Alternating',        desc: 'Show on every other occurrence' },
  { id: 'all',                label: 'Always',             desc: 'Solution always visible (minimal points)' },
]

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

type GoalSetupState = {
  // Text goals
  challengeCount:   number
  timeLimitMs:      GoalTimeLimitMs
  difficulty:       Difficulty
  // Command challenges
  concurrentChallenges:  number
  commandTimeMultiplier: number
  // Shared arcade options
  language:         Language
  startingLevel:    number
  repetition:       RepetitionLevel
  guidedMode:       GuidedMode
  categories:       string[]
  assistEnabled:    boolean
  assistPct:        number
  skipUnsupported:  boolean
}

type GoalSetupAction =
  | { type: 'SET_COUNT';       value: number }
  | { type: 'SET_TIME';        value: GoalTimeLimitMs }
  | { type: 'SET_DIFFICULTY';  value: Difficulty }
  | { type: 'SET_CONCURRENT';  value: number }
  | { type: 'SET_TIME_MULT';   value: number }
  | { type: 'SET_LANGUAGE';    value: Language }
  | { type: 'SET_LEVEL';       value: number }
  | { type: 'SET_REPETITION';  value: RepetitionLevel }
  | { type: 'SET_GUIDED';      value: GuidedMode }
  | { type: 'SET_CATEGORIES';  value: string[] }
  | { type: 'SET_ASSIST_PCT';  value: number }
  | { type: 'TOGGLE_ASSIST' }
  | { type: 'TOGGLE_SKIP_UNSUPPORTED' }

function setupReducer(state: GoalSetupState, action: GoalSetupAction): GoalSetupState {
  switch (action.type) {
    case 'SET_COUNT':       return { ...state, challengeCount: action.value }
    case 'SET_TIME':        return { ...state, timeLimitMs: action.value }
    case 'SET_DIFFICULTY':  return { ...state, difficulty: action.value }
    case 'SET_CONCURRENT':  return { ...state, concurrentChallenges: action.value }
    case 'SET_TIME_MULT':   return { ...state, commandTimeMultiplier: action.value }
    case 'SET_LANGUAGE':    return { ...state, language: action.value }
    case 'SET_LEVEL':       return { ...state, startingLevel: action.value }
    case 'SET_REPETITION':  return { ...state, repetition: action.value }
    case 'SET_GUIDED':      return { ...state, guidedMode: action.value }
    case 'SET_CATEGORIES':  return { ...state, categories: action.value }
    case 'SET_ASSIST_PCT':  return { ...state, assistPct: action.value }
    case 'TOGGLE_ASSIST':   return { ...state, assistEnabled: !state.assistEnabled }
    case 'TOGGLE_SKIP_UNSUPPORTED': {
      const next = !state.skipUnsupported
      try { localStorage.setItem('vim_arcade_skip_unsupported', String(next)) } catch { /* ignore */ }
      return { ...state, skipUnsupported: next }
    }
    default: return state
  }
}

const defaultState: GoalSetupState = {
  challengeCount:        5,
  timeLimitMs:           60_000,
  difficulty:            'all',
  concurrentChallenges:  5,
  commandTimeMultiplier: 2.0,
  language:              'typescript',
  startingLevel:         0,
  repetition:            2,
  guidedMode:            'none',
  categories:            [...DEFAULT_CATEGORIES],
  assistEnabled:         false,
  assistPct:             100,
  skipUnsupported: (() => {
    try {
      const raw = localStorage.getItem('vim_arcade_skip_unsupported')
      return raw === null ? true : raw === 'true'
    } catch { return true }
  })(),
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface GoalSetupScreenProps {
  onStart: (config: GoalModeConfig) => void
  onBack:  () => void
}

export function GoalSetupScreen({ onStart, onBack }: GoalSetupScreenProps) {
  const [s, dispatch] = useReducer(setupReducer, defaultState)

  const available = s.difficulty === 'all'
    ? BUILTIN_CHALLENGES.length
    : BUILTIN_CHALLENGES.filter(c => c.difficulty === s.difficulty).length

  const unsupportedCount = loadUnsupported().size
  const canStart = available > 0 && s.categories.length >= MIN_CATEGORIES

  function handleStart() {
    const count = Math.min(s.challengeCount, available)
    const config: GoalModeConfig = {
      challengeCount:        count,
      timeLimitMs:           s.timeLimitMs,
      difficulty:            s.difficulty,
      concurrentChallenges:  s.concurrentChallenges,
      commandTimeMultiplier: s.commandTimeMultiplier,
      language:              s.language,
      startingLevel:         s.startingLevel,
      repetitionTarget:      s.repetition,
      guidedMode:            s.guidedMode,
      categories:            s.categories.length === 0 ? null : s.categories,
      dynamicAssist:         s.assistEnabled ? s.assistPct : null,
      skipUnsupported:       s.skipUnsupported,
    }
    onStart(config)
  }

  return (
    <div className="min-h-screen bg-gray-900 overflow-y-auto">
      <div className="max-w-xl mx-auto py-12 px-6 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white font-mono mb-1">GOAL MODE</h1>
          <p className="text-gray-400 font-mono text-sm">Transform the editor to match the target, with vim command challenges alongside</p>
        </div>

        {/* ── Language ──────────────────────────────────────────────────── */}
        <Section label="Language">
          <div className="grid grid-cols-3 gap-3">
            {LANGUAGES.map(l => (
              <button
                key={l.id}
                onClick={() => dispatch({ type: 'SET_LANGUAGE', value: l.id })}
                className={`flex items-center gap-1 w-full p-3 rounded-lg border-2 font-mono text-sm transition-all ${
                  s.language === l.id
                    ? 'border-green-500 bg-green-900/30 text-green-300'
                    : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500'
                }`}
              >
                <span className="text-xl mr-2">{l.icon}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </div>
        </Section>

        {/* ── Starting Level ────────────────────────────────────────────── */}
        <Section label={<>Starting Level: <span className="text-yellow-400">{s.startingLevel}</span></>}>
          <input
            type="range" min={0} max={9} step={1} value={s.startingLevel}
            onChange={e => dispatch({ type: 'SET_LEVEL', value: Number(e.target.value) })}
            className="w-full accent-green-500"
          />
          <div className="flex justify-between text-xs text-gray-500 font-mono mt-1">
            <span>Beginner</span><span>Expert</span>
          </div>
        </Section>

        {/* ── Repetition per Command ───────────────────────────────────── */}
        <Section label="Repetition per Command">
          <div className="grid grid-cols-2 gap-2">
            {REPETITIONS.map(r => (
              <button
                key={r.value}
                onClick={() => dispatch({ type: 'SET_REPETITION', value: r.value })}
                className={`flex flex-col items-start p-3 rounded-lg border-2 font-mono text-sm transition-all ${
                  s.repetition === r.value
                    ? 'border-green-500 bg-green-900/30 text-green-300'
                    : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500'
                }`}
              >
                <span className="font-bold text-lg">{r.label}</span>
                <span className="text-xs text-gray-400">{r.desc}</span>
              </button>
            ))}
          </div>
        </Section>

        {/* ── Guided Mode ───────────────────────────────────────────────── */}
        <Section label="Guided Mode">
          <div className="space-y-1.5">
            {GUIDED_MODES.map(g => (
              <label
                key={g.id}
                className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  s.guidedMode === g.id
                    ? 'border-purple-500 bg-purple-900/30'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                }`}
              >
                <input
                  type="radio" name="guided" value={g.id}
                  checked={s.guidedMode === g.id}
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

        {/* ── Dynamic Assist ───────────────────────────────────────────── */}
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
                ? `Show solution after ${s.assistPct}% of time limit`
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
            </div>
          )}
        </Section>

        {/* ── Category Focus ────────────────────────────────────────────── */}
        <Section label={<>Focus areas <span className="text-gray-600 normal-case">(min {MIN_CATEGORIES})</span></>}>
          <CategoryPicker
            selected={s.categories}
            onChange={value => dispatch({ type: 'SET_CATEGORIES', value })}
          />
        </Section>

        {/* ── Skip Unsupported ─────────────────────────────────────────── */}
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

        {/* ══ Text Goals section ══════════════════════════════════════════ */}
        <div className="border-t border-gray-700 pt-6">
          <p className="text-blue-400 font-mono text-xs uppercase tracking-widest mb-4">Text Goals</p>

          <div className="space-y-6">
            {/* Challenge count */}
            <Section label={<>Challenges: <span className="text-yellow-400">{s.challengeCount}</span></>}>
              <input
                type="range" min={1} max={20} step={1} value={s.challengeCount}
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
                  Only {available} challenge{available !== 1 ? 's' : ''} available — will use {available}
                </p>
              )}
            </Section>

            {/* Difficulty */}
            <Section label="Difficulty">
              <div className="flex gap-2 flex-wrap">
                {DIFFICULTIES.map(d => (
                  <PillButton
                    key={d.id}
                    active={s.difficulty === d.id}
                    onClick={() => dispatch({ type: 'SET_DIFFICULTY', value: d.id })}
                  >
                    {d.label}
                  </PillButton>
                ))}
              </div>
            </Section>

            {/* Time per challenge */}
            <Section label="Time per Challenge">
              <div className="flex gap-2 flex-wrap">
                {TIME_OPTIONS.map(opt => (
                  <PillButton
                    key={opt.value}
                    active={s.timeLimitMs === opt.value}
                    onClick={() => dispatch({ type: 'SET_TIME', value: opt.value })}
                  >
                    {opt.label}
                  </PillButton>
                ))}
              </div>
            </Section>
          </div>
        </div>

        {/* ══ Command Challenges section ══════════════════════════════════ */}
        <div className="border-t border-gray-700 pt-6">
          <p className="text-purple-400 font-mono text-xs uppercase tracking-widest mb-4">Command Challenges</p>

          <div className="space-y-6">
            {/* Concurrent challenges */}
            <Section label={<>Concurrent Challenges: <span className="text-yellow-400">{s.concurrentChallenges}</span></>}>
              <input
                type="range" min={1} max={10} step={1} value={s.concurrentChallenges}
                onChange={e => dispatch({ type: 'SET_CONCURRENT', value: Number(e.target.value) })}
                className="w-full accent-purple-500"
              />
              <div className="flex justify-between text-xs text-gray-500 font-mono mt-1">
                <span>1</span>
                <span>10</span>
              </div>
            </Section>

            {/* Time multiplier */}
            <Section label="Command Time Limit Multiplier">
              <div className="flex gap-2 flex-wrap">
                {TIME_MULTIPLIER_OPTIONS.map(opt => (
                  <PillButton
                    key={opt.value}
                    active={s.commandTimeMultiplier === opt.value}
                    onClick={() => dispatch({ type: 'SET_TIME_MULT', value: opt.value })}
                  >
                    {opt.label}
                  </PillButton>
                ))}
              </div>
              <p className="text-gray-500 font-mono text-xs mt-2">
                Scales command time limits — 2× = twice as long since your attention is split
              </p>
            </Section>
          </div>
        </div>

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
            Start
          </button>
          <button
            onClick={onBack}
            className="px-6 py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 font-mono text-sm rounded-lg transition-colors border border-gray-700"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Section({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-gray-300 font-mono text-xs uppercase tracking-wider mb-3">{label}</h2>
      {children}
    </div>
  )
}

function PillButton({
  active, onClick, children,
}: {
  active: boolean; onClick: () => void; children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-mono text-sm transition-all border-2 ${
        active
          ? 'bg-blue-600 text-white border-blue-400'
          : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500'
      }`}
    >
      {children}
    </button>
  )
}
