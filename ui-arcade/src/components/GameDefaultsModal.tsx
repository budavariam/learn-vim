/**
 * GameDefaultsModal
 *
 * A modal that lets the user configure default pre-filled values for each game
 * mode's setup screen. Saves to the same localStorage keys the setup screens
 * read on load, so the next launch shows the user's chosen starting point.
 */
import { useReducer, useState } from 'react'
import React from 'react'
import {
  X,
  Globe,
  Timer,
  Hash,
  Target,
  Bot,
  Circle,
  Heart,
  Shield,
  Layers,
  LayoutGrid,
  Maximize2,
  Users,
  Skull,
  Map,
} from 'lucide-react'
import type {
  Language,
  GameMode,
  RepetitionLevel,
  GuidedMode,
  GameConfig,
  GoalModeConfig,
  GoalTimeLimitMs,
} from '../engine/types'
import { CHALLENGE_CONFIG_DEFAULTS } from '../engine/types'
import type {
  MotionRaceConfig,
  EndGoalType,
  DistanceMode,
  GoalDisplayMode,
  EnemySpeed,
} from '../hooks/useMotionRace'
import { MOTION_CHALLENGE_CATEGORIES } from '../hooks/useMotionRace'
import type {
  QvimxAILevel,
  QvimxBallSpeed,
  QvimxSubMode,
  QvimxBorderShape,
  QvimxCodeSize,
} from '../hooks/useQvimx'
import { STORAGE_KEYS } from '../engine/storageKeys'
import type { VimBotsConfig, VimBoardPreset, VimBotsDifficulty } from '../engine/VimBotsEngine'
import {
  LanguageGrid,
  CollapseSection,
  ChallengeToggleSection,
  UnifiedChallengeOptions,
  cls,
  TIME_MULTIPLIER_OPTIONS,
  patchReducer,
} from './SetupPrimitives'

// ── Public type ───────────────────────────────────────────────────────────────

export type ModalMode = 'arcade' | 'goal' | 'motion' | 'qvimx' | 'vimbots'

// ── Validation helpers ────────────────────────────────────────────────────────

function pick<T>(value: unknown, valid: ReadonlyArray<T>, fallback: T, onFail: () => void): T {
  if ((valid as ReadonlyArray<unknown>).includes(value)) return value as T
  onFail()
  return fallback
}

function pickNumber(
  value: unknown,
  min: number,
  max: number,
  fallback: number,
  onFail: () => void
): number {
  if (typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max)
    return value
  onFail()
  return fallback
}

function pickBool(value: unknown, fallback: boolean, onFail: () => void): boolean {
  if (typeof value === 'boolean') return value
  onFail()
  return fallback
}

function pickStringArray(
  value: unknown,
  validItems: readonly string[],
  fallback: string[],
  onFail: () => void
): string[] {
  if (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(v => typeof v === 'string' && validItems.includes(v))
  ) {
    return value as string[]
  }
  onFail()
  return [...fallback]
}

function pickNullableStringArray(value: unknown, onFail: () => void): string[] | null {
  if (value === null || value === undefined) return null
  if (Array.isArray(value) && value.every(v => typeof v === 'string')) return value as string[]
  onFail()
  return null
}

function pickTrailMultiplier(
  value: unknown,
  fallback: number | 'infinite',
  onFail: () => void
): number | 'infinite' {
  if (value === 'infinite') return 'infinite'
  if (typeof value === 'number' && value > 0) return value
  onFail()
  return fallback
}

const VALID_LANGUAGES: Language[] = ['go', 'rust', 'python', 'typescript', 'c', 'cpp', 'lorem']
const VALID_GAME_MODES: GameMode[] = ['general', 'timed_challenge', 'survival']
const VALID_GUIDED_MODES: GuidedMode[] = [
  'none',
  'all',
  'first_only',
  'alternating',
  'after_failure',
  'first_then_failure',
]
const VALID_REPETITIONS: RepetitionLevel[] = [1, 2, 3, 5]
const VALID_TIME_MULTIPLIERS = [1, 1.5, 2, 3] as const
const VALID_TIMED_DURATIONS = [60_000, 120_000, 300_000, 600_000, 900_000] as const
const VALID_KNOWLEDGE_FILTERS = ['all', 'known', 'unknown'] as const

// ── Internal helpers ──────────────────────────────────────────────────────────

function loadModeConfig<T>(
  key: string,
  defaultState: T,
  sanitize: (raw: unknown) => { state: T; hadInvalid: boolean }
): { state: T; hadInvalid: boolean } {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return { state: defaultState, hadInvalid: false }
    return sanitize(JSON.parse(raw) as unknown)
  } catch {
    return { state: defaultState, hadInvalid: false }
  }
}

function usePanelStorage<T>(key: string, state: T, onClose: () => void, hadInvalid = false) {
  const [showWarning, setShowWarning] = React.useState(hadInvalid)
  const save = React.useCallback(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch {
      /* ignore */
    }
  }, [key, state])
  const handleSave = React.useCallback(() => {
    save()
    onClose()
  }, [save, onClose])
  const handleTidy = React.useCallback(() => {
    save()
    setShowWarning(false)
  }, [save])
  return { handleSave, handleTidy, showWarning, setShowWarning }
}

// ─────────────────────────────────────────────────────────────────────────────
// ARCADE MODE
// ─────────────────────────────────────────────────────────────────────────────

type ArcadeFormState = {
  language: Language
  mode: GameMode
  timedDurationMs: number
  startingLevel: number
  repetitionTarget: RepetitionLevel
  guidedMode: GuidedMode
  assistEnabled: boolean
  dynamicAssistPct: number
  knowledgeFilter: 'all' | 'known' | 'unknown'
  commandTimeMultiplier: number
  drillMode: boolean
  // preserved but not shown in form
  categories: string[] | null
  skipUnsupported: boolean
}

const ARCADE_DEFAULT: ArcadeFormState = {
  language: 'typescript',
  mode: 'timed_challenge',
  timedDurationMs: 60_000,
  startingLevel: 0,
  repetitionTarget: 2,
  guidedMode: 'none',
  assistEnabled: true,
  dynamicAssistPct: 100,
  knowledgeFilter: 'all',
  commandTimeMultiplier: 1,
  drillMode: false,
  categories: null,
  skipUnsupported: true,
}

function sanitizeArcadeConfig(raw: unknown): { state: ArcadeFormState; hadInvalid: boolean } {
  if (!raw || typeof raw !== 'object') return { state: ARCADE_DEFAULT, hadInvalid: false }
  const r = raw as Record<string, unknown>
  let hadInvalid = false
  const fail = () => {
    hadInvalid = true
  }

  const rawAssist = r.dynamicAssist
  let assistEnabled: boolean
  let dynamicAssistPct: number
  if (rawAssist === null) {
    assistEnabled = false
    dynamicAssistPct = 100
  } else if (typeof rawAssist === 'number' && rawAssist >= 10 && rawAssist <= 100) {
    assistEnabled = true
    dynamicAssistPct = rawAssist
  } else {
    fail()
    assistEnabled = ARCADE_DEFAULT.assistEnabled
    dynamicAssistPct = ARCADE_DEFAULT.dynamicAssistPct
  }

  const state: ArcadeFormState = {
    language: pick(r.language, VALID_LANGUAGES, ARCADE_DEFAULT.language, fail),
    mode: pick(r.mode, VALID_GAME_MODES, ARCADE_DEFAULT.mode, fail),
    timedDurationMs: pick(
      r.timedDurationMs,
      VALID_TIMED_DURATIONS,
      ARCADE_DEFAULT.timedDurationMs,
      () => {
        // timedDurationMs is optional — only flag invalid if present and wrong
        if (r.timedDurationMs !== undefined) fail()
      }
    ),
    startingLevel: pickNumber(r.startingLevel, 0, 9, ARCADE_DEFAULT.startingLevel, fail),
    repetitionTarget: pick(
      r.repetitionTarget,
      VALID_REPETITIONS,
      ARCADE_DEFAULT.repetitionTarget,
      fail
    ),
    guidedMode: pick(r.guidedMode, VALID_GUIDED_MODES, ARCADE_DEFAULT.guidedMode, fail),
    assistEnabled,
    dynamicAssistPct,
    knowledgeFilter: pick(
      r.knowledgeFilter,
      VALID_KNOWLEDGE_FILTERS,
      ARCADE_DEFAULT.knowledgeFilter,
      fail
    ),
    commandTimeMultiplier: pick(
      r.commandTimeMultiplier,
      VALID_TIME_MULTIPLIERS,
      ARCADE_DEFAULT.commandTimeMultiplier,
      () => {
        if (r.commandTimeMultiplier !== undefined) fail()
      }
    ),
    categories: pickNullableStringArray(r.categories, fail),
    skipUnsupported: pickBool(r.skipUnsupported, ARCADE_DEFAULT.skipUnsupported, () => {
      if (r.skipUnsupported !== undefined) fail()
    }),
    drillMode: pickBool(r.drillMode, ARCADE_DEFAULT.drillMode, () => {
      if (r.drillMode !== undefined) fail()
    }),
  }

  if (hadInvalid) {
    console.warn(
      '[GameDefaultsModal] Some saved Arcade config fields were invalid; reset to defaults.'
    )
  }
  return { state, hadInvalid }
}

function arcadeFormToConfig(s: ArcadeFormState): GameConfig {
  return {
    mode: s.mode,
    language: s.language,
    startingLevel: s.startingLevel,
    repetitionTarget: s.repetitionTarget,
    timedDurationMs: s.mode === 'timed_challenge' ? s.timedDurationMs : undefined,
    guidedMode: s.guidedMode,
    categories: s.categories,
    dynamicAssist: s.assistEnabled ? s.dynamicAssistPct : null,
    skipUnsupported: s.skipUnsupported,
    knowledgeFilter: s.knowledgeFilter,
    commandTimeMultiplier: s.commandTimeMultiplier,
    drillMode: s.drillMode,
  }
}

const ARCADE_MODES: { id: GameMode; label: string; desc: string }[] = [
  { id: 'general', label: 'General', desc: 'Practice endlessly, level up naturally' },
  { id: 'timed_challenge', label: 'Timed', desc: 'Race the clock for a fixed session' },
  { id: 'survival', label: 'Survival', desc: 'One miss ends it — no mercy' },
]

const ARCADE_DURATIONS: { label: string; ms: number }[] = [
  { label: '1m', ms: 60_000 },
  { label: '2m', ms: 120_000 },
  { label: '5m', ms: 300_000 },
  { label: '10m', ms: 600_000 },
  { label: '15m', ms: 900_000 },
]

function ArcadeDefaultsPanel({ onClose }: { onClose: () => void }) {
  const [{ state: init, hadInvalid }] = useState(() =>
    loadModeConfig(STORAGE_KEYS.LAST_CONFIG, ARCADE_DEFAULT, sanitizeArcadeConfig)
  )
  const [s, dispatch] = useReducer(patchReducer<ArcadeFormState>, init)
  const set = (payload: Partial<ArcadeFormState>) => dispatch({ type: 'PATCH', payload })
  const { handleSave, handleTidy, showWarning } = usePanelStorage(
    STORAGE_KEYS.LAST_CONFIG,
    arcadeFormToConfig(s),
    onClose,
    hadInvalid
  )

  return (
    <ModalShell
      title="Arcade Defaults"
      onClose={onClose}
      onSave={handleSave}
      showWarning={showWarning}
      onTidy={handleTidy}
    >
      <CollapseSection label="Language" icon={Globe} defaultOpen>
        <LanguageGrid value={s.language} onChange={v => set({ language: v })} />
      </CollapseSection>

      <CollapseSection label="Game Mode" defaultOpen>
        <div className="space-y-2 mb-3">
          {ARCADE_MODES.map(m => (
            <button
              key={m.id}
              type="button"
              onClick={() => set({ mode: m.id })}
              className={cls.modeCard(s.mode === m.id)}
            >
              <span className="font-bold">{m.label}</span>
              <span
                className={`text-xs font-normal ml-2 ${s.mode === m.id ? 'text-blue-200' : 'text-gray-500'}`}
              >
                {m.desc}
              </span>
            </button>
          ))}
        </div>
        {s.mode === 'timed_challenge' && (
          <>
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Duration</p>
            <div className="flex gap-2 flex-wrap">
              {ARCADE_DURATIONS.map(d => (
                <button
                  key={d.ms}
                  type="button"
                  onClick={() => set({ timedDurationMs: d.ms })}
                  className={cls.pill(s.timedDurationMs === d.ms)}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </>
        )}
      </CollapseSection>

      <CollapseSection label="Starting Level" defaultOpen>
        <p className="text-xs text-gray-500 mb-1">
          Level:{' '}
          <span className="text-yellow-400">
            {s.startingLevel === 0 ? 'Beginner' : `Lv ${s.startingLevel}`}
          </span>
        </p>
        <input
          type="range"
          min={0}
          max={9}
          step={1}
          value={s.startingLevel}
          onChange={e => set({ startingLevel: Number(e.target.value) })}
          className="w-full accent-purple-500"
        />
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>Beginner</span>
          <span>Expert</span>
        </div>
      </CollapseSection>

      <CollapseSection label="Repetitions per Command" defaultOpen>
        <div className="flex gap-2 flex-wrap">
          {([1, 2, 3, 5] as RepetitionLevel[]).map(r => (
            <button
              key={r}
              type="button"
              onClick={() => set({ repetitionTarget: r })}
              className={cls.pill(s.repetitionTarget === r)}
            >
              {r}×
            </button>
          ))}
        </div>
      </CollapseSection>

      <CollapseSection label="Guided Mode">
        <div className="space-y-1">
          {VALID_GUIDED_MODES.map(g => (
            <button
              key={g}
              type="button"
              onClick={() => set({ guidedMode: g })}
              className={`w-full text-left px-3 py-1.5 rounded border text-xs font-mono transition-colors ${
                s.guidedMode === g
                  ? 'bg-purple-900/40 border-purple-700 text-white font-bold'
                  : 'bg-gray-800/60 border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </CollapseSection>

      <CollapseSection label="Knowledge Filter">
        <div className="flex gap-2 flex-wrap">
          {VALID_KNOWLEDGE_FILTERS.map(f => (
            <button
              key={f}
              type="button"
              onClick={() => set({ knowledgeFilter: f })}
              className={cls.pill(s.knowledgeFilter === f)}
            >
              {f === 'all' ? 'All commands' : f === 'unknown' ? 'Unknown only' : 'Known only'}
            </button>
          ))}
        </div>
      </CollapseSection>

      <CollapseSection label="Command Time">
        <div className="flex gap-2 flex-wrap">
          {TIME_MULTIPLIER_OPTIONS.map(t => (
            <button
              key={t.value}
              type="button"
              onClick={() => set({ commandTimeMultiplier: t.value })}
              className={cls.pill(s.commandTimeMultiplier === t.value)}
            >
              {t.label}
              <span className="text-xs font-normal opacity-60 ml-1">{t.desc}</span>
            </button>
          ))}
        </div>
      </CollapseSection>

      <CollapseSection label="Command Order">
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => set({ drillMode: false })}
            className={cls.pill(!s.drillMode)}
          >
            Randomize
          </button>
          <button
            type="button"
            onClick={() => set({ drillMode: true })}
            className={cls.pill(s.drillMode)}
          >
            Drill
            <span className="text-xs font-normal opacity-60 ml-1">in order</span>
          </button>
        </div>
      </CollapseSection>

      <CollapseSection label="Dynamic Assist">
        <div className="flex items-center gap-3 mb-2">
          <button
            type="button"
            role="switch"
            aria-checked={s.assistEnabled}
            onClick={() => set({ assistEnabled: !s.assistEnabled })}
            className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${s.assistEnabled ? 'bg-orange-600' : 'bg-gray-700'}`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${s.assistEnabled ? 'translate-x-4' : 'translate-x-0.5'}`}
            />
          </button>
          <span className="text-xs text-gray-400">
            {s.assistEnabled ? `Show hint after ${s.dynamicAssistPct}% of time` : 'Off'}
          </span>
        </div>
        {s.assistEnabled && (
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={s.dynamicAssistPct}
            onChange={e => set({ dynamicAssistPct: Number(e.target.value) })}
            className="w-full accent-orange-500"
          />
        )}
      </CollapseSection>
    </ModalShell>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// GOAL MODE
// ─────────────────────────────────────────────────────────────────────────────

type GoalFormState = {
  challengeCount: number
  timeLimitMs: GoalTimeLimitMs
  difficulty: 'all' | 'easy' | 'medium' | 'hard'
  solvedFilter: 'all' | 'unsolved' | 'solved' | 'mixed'
  commandChallengesEnabled: boolean
  concurrentChallenges: number
  commandTimeMultiplier: number
  language: Language
  startingLevel: number
  repetitionTarget: RepetitionLevel
  guidedMode: GuidedMode
  assistEnabled: boolean
  dynamicAssistPct: number
  categories: string[] | null
  skipUnsupported: boolean
}

const GOAL_DEFAULT: GoalFormState = {
  challengeCount: 5,
  timeLimitMs: 60_000,
  difficulty: 'all',
  solvedFilter: 'all',
  commandChallengesEnabled: true,
  concurrentChallenges: 5,
  commandTimeMultiplier: 2.0,
  language: 'typescript',
  startingLevel: 0,
  repetitionTarget: 2,
  guidedMode: 'none',
  assistEnabled: false,
  dynamicAssistPct: 100,
  categories: null,
  skipUnsupported: true,
}

const VALID_GOAL_TIME_LIMITS: GoalTimeLimitMs[] = [30_000, 60_000, 120_000, 0]
const VALID_DIFFICULTIES = ['all', 'easy', 'medium', 'hard'] as const
const VALID_SOLVED_FILTERS = ['all', 'unsolved', 'solved', 'mixed'] as const

function sanitizeGoalConfig(raw: unknown): { state: GoalFormState; hadInvalid: boolean } {
  if (!raw || typeof raw !== 'object') return { state: GOAL_DEFAULT, hadInvalid: false }
  const r = raw as Record<string, unknown>
  let hadInvalid = false
  const fail = () => {
    hadInvalid = true
  }

  const rawAssist = r.dynamicAssist
  let assistEnabled: boolean
  let dynamicAssistPct: number
  if (rawAssist === null) {
    assistEnabled = false
    dynamicAssistPct = 100
  } else if (typeof rawAssist === 'number' && rawAssist >= 10 && rawAssist <= 100) {
    assistEnabled = true
    dynamicAssistPct = rawAssist
  } else {
    if (rawAssist !== undefined) fail()
    assistEnabled = GOAL_DEFAULT.assistEnabled
    dynamicAssistPct = GOAL_DEFAULT.dynamicAssistPct
  }

  const rawConcurrent = r.concurrentChallenges
  const concurrentValid =
    typeof rawConcurrent === 'number' && rawConcurrent >= 0 && rawConcurrent <= 20
  if (!concurrentValid) fail()
  const concurrentVal = concurrentValid
    ? (rawConcurrent as number)
    : GOAL_DEFAULT.concurrentChallenges

  const state: GoalFormState = {
    challengeCount: pickNumber(r.challengeCount, 1, 50, GOAL_DEFAULT.challengeCount, fail),
    timeLimitMs: pick(r.timeLimitMs, VALID_GOAL_TIME_LIMITS, GOAL_DEFAULT.timeLimitMs, fail),
    difficulty: pick(r.difficulty, VALID_DIFFICULTIES, GOAL_DEFAULT.difficulty, fail),
    solvedFilter: pick(r.solvedFilter, VALID_SOLVED_FILTERS, GOAL_DEFAULT.solvedFilter, () => {
      if (r.solvedFilter !== undefined) fail()
    }),
    commandChallengesEnabled: concurrentVal > 0,
    concurrentChallenges: concurrentVal > 0 ? concurrentVal : GOAL_DEFAULT.concurrentChallenges,
    commandTimeMultiplier: pick(
      r.commandTimeMultiplier,
      VALID_TIME_MULTIPLIERS,
      GOAL_DEFAULT.commandTimeMultiplier,
      fail
    ),
    language: pick(r.language, VALID_LANGUAGES, GOAL_DEFAULT.language, fail),
    startingLevel: pickNumber(r.startingLevel, 0, 9, GOAL_DEFAULT.startingLevel, fail),
    repetitionTarget: pick(
      r.repetitionTarget,
      VALID_REPETITIONS,
      GOAL_DEFAULT.repetitionTarget,
      fail
    ),
    guidedMode: pick(r.guidedMode, VALID_GUIDED_MODES, GOAL_DEFAULT.guidedMode, fail),
    assistEnabled,
    dynamicAssistPct,
    categories: pickNullableStringArray(r.categories, fail),
    skipUnsupported: pickBool(r.skipUnsupported, GOAL_DEFAULT.skipUnsupported, () => {
      if (r.skipUnsupported !== undefined) fail()
    }),
  }

  if (hadInvalid) {
    console.warn(
      '[GameDefaultsModal] Some saved Goal Mode config fields were invalid; reset to defaults.'
    )
  }
  return { state, hadInvalid }
}

function goalFormToConfig(s: GoalFormState): GoalModeConfig {
  return {
    challengeCount: s.challengeCount,
    timeLimitMs: s.timeLimitMs,
    difficulty: s.difficulty,
    solvedFilter: s.solvedFilter,
    concurrentChallenges: s.commandChallengesEnabled ? s.concurrentChallenges : 0,
    commandTimeMultiplier: s.commandTimeMultiplier,
    language: s.language,
    startingLevel: s.startingLevel,
    repetitionTarget: s.repetitionTarget,
    guidedMode: s.guidedMode,
    categories: s.categories,
    dynamicAssist: s.assistEnabled ? s.dynamicAssistPct : null,
    skipUnsupported: s.skipUnsupported,
  }
}

const GOAL_TIME_OPTIONS: { value: GoalTimeLimitMs; label: string }[] = [
  { value: 30_000, label: '30s' },
  { value: 60_000, label: '1m' },
  { value: 120_000, label: '2m' },
  { value: 0, label: '∞' },
]

function GoalDefaultsPanel({ onClose }: { onClose: () => void }) {
  const [{ state: init, hadInvalid }] = useState(() =>
    loadModeConfig(STORAGE_KEYS.LAST_GOAL_CONFIG, GOAL_DEFAULT, sanitizeGoalConfig)
  )
  const [s, dispatch] = useReducer(patchReducer<GoalFormState>, init)
  const set = (payload: Partial<GoalFormState>) => dispatch({ type: 'PATCH', payload })
  const { handleSave, handleTidy, showWarning } = usePanelStorage(
    STORAGE_KEYS.LAST_GOAL_CONFIG,
    goalFormToConfig(s),
    onClose,
    hadInvalid
  )

  return (
    <ModalShell
      title="Goal Mode Defaults"
      onClose={onClose}
      onSave={handleSave}
      showWarning={showWarning}
      onTidy={handleTidy}
    >
      <CollapseSection label="Language" icon={Globe} defaultOpen>
        <LanguageGrid value={s.language} onChange={v => set({ language: v })} />
      </CollapseSection>

      <CollapseSection label="Text Goals" icon={Target} defaultOpen>
        <p className="text-xs text-gray-500 mb-1">
          Challenges: <span className="text-yellow-400">{s.challengeCount}</span>
        </p>
        <input
          type="range"
          min={1}
          max={20}
          step={1}
          value={s.challengeCount}
          onChange={e => set({ challengeCount: Number(e.target.value) })}
          className="w-full accent-green-500 mb-3"
        />

        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Time per challenge</p>
        <div className="flex gap-2 flex-wrap mb-4">
          {GOAL_TIME_OPTIONS.map(o => (
            <button
              key={o.value}
              type="button"
              onClick={() => set({ timeLimitMs: o.value })}
              className={cls.pill(s.timeLimitMs === o.value)}
            >
              {o.label}
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Difficulty</p>
        <div className="flex gap-2 flex-wrap mb-4">
          {VALID_DIFFICULTIES.map(d => (
            <button
              key={d}
              type="button"
              onClick={() => set({ difficulty: d })}
              className={cls.pill(s.difficulty === d)}
            >
              {d === 'all' ? 'All' : d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Focus</p>
        <div className="flex gap-2 flex-wrap">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'unsolved', label: 'Unsolved' },
              { id: 'solved', label: 'Solved' },
              { id: 'mixed', label: 'Mixed (70% new)' },
            ] as const
          ).map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => set({ solvedFilter: f.id })}
              className={cls.pill(s.solvedFilter === f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </CollapseSection>

      <ChallengeToggleSection
        enabled={s.commandChallengesEnabled}
        onToggle={() => set({ commandChallengesEnabled: !s.commandChallengesEnabled })}
      >
        <UnifiedChallengeOptions
          guidedMode={s.guidedMode}
          onGuidedMode={v => set({ guidedMode: v })}
          startingLevel={s.startingLevel}
          onStartingLevel={v => set({ startingLevel: v })}
          repetition={s.repetitionTarget}
          onRepetition={v => set({ repetitionTarget: v })}
          timeMultiplier={s.commandTimeMultiplier}
          onTimeMultiplier={v => set({ commandTimeMultiplier: v })}
          concurrent={s.concurrentChallenges}
          onConcurrent={v => set({ concurrentChallenges: v })}
          dynamicAssistEnabled={s.assistEnabled}
          onDynamicAssistToggle={() => set({ assistEnabled: !s.assistEnabled })}
          dynamicAssistPct={s.dynamicAssistPct}
          onDynamicAssistPct={v => set({ dynamicAssistPct: v })}
          solvedFilter={s.solvedFilter}
          onSolvedFilter={v => set({ solvedFilter: v })}
        />
      </ChallengeToggleSection>
    </ModalShell>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MOTION RACE
// ─────────────────────────────────────────────────────────────────────────────

const MOTION_CONFIG_DEFAULT: MotionRaceConfig = {
  language: 'typescript',
  endGoal: 'timed',
  targetCount: 10,
  durationMs: 60_000,
  startFromPrevious: true,
  distanceMode: 'mixed',
  goalDisplayMode: 'next',
  multiGoalCount: 3,
  snakeTrail: true,
  enemyCount: 0,
  enemyTrail: false,
  enemySpeed: 'medium',
  snowEffect: false,
  opacityFade: false,
  confettiOnGoal: false,
  penaltyFlash: false,
  hjklOnly: false,
  noHjkl: false,
  fogOfWar: false,
  enemyMultiColor: true,
  showMinimap: true,
  challengeMode: false,
  challengeCategories: [...MOTION_CHALLENGE_CATEGORIES],
  challengeGuidedMode: 'none',
  challengeStartingLevel: 0,
  challengeRepetition: 1,
  challengeTimeMultiplier: 1,
  challengeDrillMode: false,
  padEmptyLines: true,
  startAtFirstLine: true,
  solidTrails: true,
  trailLengthMultiplier: 1,
  enemyTrailSolid: true,
  enemyTrailMultiplier: 1,
}

const VALID_END_GOALS: EndGoalType[] = ['timed', 'user_count', 'total_count', 'survival']
const VALID_DISTANCE_MODES: DistanceMode[] = ['short', 'medium', 'long', 'mixed']
const VALID_GOAL_DISPLAYS: GoalDisplayMode[] = ['next', 'all']
const VALID_ENEMY_SPEEDS: EnemySpeed[] = ['slow', 'medium', 'fast', 'mixed']
const VALID_MOTION_DURATIONS = [60_000, 120_000, 300_000, 600_000] as const
const VALID_ENEMY_COUNTS = [0, 1, 3, 5, 10] as const

function sanitizeMotionConfig(raw: unknown): { state: MotionRaceConfig; hadInvalid: boolean } {
  if (!raw || typeof raw !== 'object') return { state: MOTION_CONFIG_DEFAULT, hadInvalid: false }
  const r = raw as Record<string, unknown>
  let hadInvalid = false
  const fail = () => {
    hadInvalid = true
  }

  const state: MotionRaceConfig = {
    language: pick(r.language, VALID_LANGUAGES, MOTION_CONFIG_DEFAULT.language, fail),
    endGoal: pick(r.endGoal, VALID_END_GOALS, MOTION_CONFIG_DEFAULT.endGoal, fail),
    targetCount: pickNumber(r.targetCount, 1, 200, MOTION_CONFIG_DEFAULT.targetCount, fail),
    durationMs: pick(r.durationMs, VALID_MOTION_DURATIONS, MOTION_CONFIG_DEFAULT.durationMs, fail),
    startFromPrevious: pickBool(r.startFromPrevious, MOTION_CONFIG_DEFAULT.startFromPrevious, fail),
    distanceMode: pick(
      r.distanceMode,
      VALID_DISTANCE_MODES,
      MOTION_CONFIG_DEFAULT.distanceMode,
      fail
    ),
    goalDisplayMode: pick(
      r.goalDisplayMode,
      VALID_GOAL_DISPLAYS,
      MOTION_CONFIG_DEFAULT.goalDisplayMode,
      fail
    ),
    multiGoalCount: pickNumber(r.multiGoalCount, 0, 10, MOTION_CONFIG_DEFAULT.multiGoalCount, fail),
    snakeTrail: pickBool(r.snakeTrail, MOTION_CONFIG_DEFAULT.snakeTrail, fail),
    enemyCount: pick(r.enemyCount, VALID_ENEMY_COUNTS, MOTION_CONFIG_DEFAULT.enemyCount, fail),
    enemyTrail: pickBool(r.enemyTrail, MOTION_CONFIG_DEFAULT.enemyTrail, fail),
    enemySpeed: pick(r.enemySpeed, VALID_ENEMY_SPEEDS, MOTION_CONFIG_DEFAULT.enemySpeed, fail),
    snowEffect: pickBool(r.snowEffect, MOTION_CONFIG_DEFAULT.snowEffect, fail),
    opacityFade: pickBool(r.opacityFade, MOTION_CONFIG_DEFAULT.opacityFade, fail),
    confettiOnGoal: pickBool(r.confettiOnGoal, MOTION_CONFIG_DEFAULT.confettiOnGoal, fail),
    penaltyFlash: pickBool(r.penaltyFlash, MOTION_CONFIG_DEFAULT.penaltyFlash, fail),
    hjklOnly: pickBool(r.hjklOnly, MOTION_CONFIG_DEFAULT.hjklOnly, fail),
    noHjkl: pickBool(r.noHjkl, MOTION_CONFIG_DEFAULT.noHjkl, fail),
    fogOfWar: pickBool(r.fogOfWar, MOTION_CONFIG_DEFAULT.fogOfWar, fail),
    enemyMultiColor: pickBool(r.enemyMultiColor, MOTION_CONFIG_DEFAULT.enemyMultiColor, fail),
    showMinimap: pickBool(r.showMinimap, MOTION_CONFIG_DEFAULT.showMinimap, fail),
    challengeMode: pickBool(r.challengeMode, MOTION_CONFIG_DEFAULT.challengeMode, fail),
    challengeCategories: pickStringArray(
      r.challengeCategories,
      MOTION_CHALLENGE_CATEGORIES,
      MOTION_CONFIG_DEFAULT.challengeCategories,
      fail
    ),
    challengeGuidedMode: pick(
      r.challengeGuidedMode,
      VALID_GUIDED_MODES,
      MOTION_CONFIG_DEFAULT.challengeGuidedMode,
      fail
    ),
    challengeStartingLevel: pickNumber(
      r.challengeStartingLevel,
      0,
      9,
      MOTION_CONFIG_DEFAULT.challengeStartingLevel,
      fail
    ),
    challengeRepetition: pick(
      r.challengeRepetition,
      VALID_REPETITIONS,
      MOTION_CONFIG_DEFAULT.challengeRepetition,
      fail
    ),
    challengeTimeMultiplier: pick(
      r.challengeTimeMultiplier,
      VALID_TIME_MULTIPLIERS,
      MOTION_CONFIG_DEFAULT.challengeTimeMultiplier,
      fail
    ),
    challengeDrillMode: pickBool(
      r.challengeDrillMode,
      MOTION_CONFIG_DEFAULT.challengeDrillMode ?? false,
      () => {
        if (r.challengeDrillMode !== undefined) fail()
      }
    ),
    padEmptyLines: pickBool(r.padEmptyLines, MOTION_CONFIG_DEFAULT.padEmptyLines, fail),
    startAtFirstLine: pickBool(r.startAtFirstLine, MOTION_CONFIG_DEFAULT.startAtFirstLine, fail),
    solidTrails: pickBool(r.solidTrails, MOTION_CONFIG_DEFAULT.solidTrails, fail),
    trailLengthMultiplier: pickTrailMultiplier(
      r.trailLengthMultiplier,
      MOTION_CONFIG_DEFAULT.trailLengthMultiplier,
      fail
    ),
    enemyTrailSolid: pickBool(r.enemyTrailSolid, MOTION_CONFIG_DEFAULT.enemyTrailSolid, fail),
    enemyTrailMultiplier: pickTrailMultiplier(
      r.enemyTrailMultiplier,
      MOTION_CONFIG_DEFAULT.enemyTrailMultiplier,
      fail
    ),
  }

  if (hadInvalid) {
    console.warn(
      '[GameDefaultsModal] Some saved Motion Race config fields were invalid; reset to defaults.'
    )
  }
  return { state, hadInvalid }
}

// Re-declared locally (not exported from MotionRaceGame.tsx)
const MOTION_COUNT_OPTIONS = [3, 5, 10, 15, 20, 30]
const MOTION_DURATION_OPTIONS: { label: string; ms: number }[] = [
  { label: '1 min', ms: 60_000 },
  { label: '2 min', ms: 120_000 },
  { label: '5 min', ms: 300_000 },
  { label: '10 min', ms: 600_000 },
]
const MOTION_DIST_LABELS: { id: DistanceMode; label: string; desc: string }[] = [
  { id: 'short', label: 'Short', desc: '≤8 lines' },
  { id: 'medium', label: 'Medium', desc: '9–25 lines' },
  { id: 'long', label: 'Long', desc: '26+ lines' },
  { id: 'mixed', label: 'Mixed', desc: 'Varied' },
]
const MOTION_END_GOAL_OPTIONS: {
  id: EndGoalType
  icon: React.ElementType
  label: string
  desc: string
}[] = [
  { id: 'timed', icon: Timer, label: 'Timed', desc: 'Play until time runs out' },
  { id: 'user_count', icon: Hash, label: 'Count (you)', desc: 'Collect N goals yourself' },
  { id: 'total_count', icon: Users, label: 'Count (all)', desc: 'N goals total' },
  { id: 'survival', icon: Skull, label: 'Survival', desc: 'Survive — hitting any trail ends it' },
]
const MOTION_ENEMY_SPEED_OPTIONS: { id: EnemySpeed; label: string }[] = [
  { id: 'slow', label: 'Slow' },
  { id: 'medium', label: 'Medium' },
  { id: 'fast', label: 'Fast' },
  { id: 'mixed', label: 'Mixed' },
]

function MotionDefaultsPanel({ onClose }: { onClose: () => void }) {
  const [{ state: init, hadInvalid }] = useState(() =>
    loadModeConfig(STORAGE_KEYS.LAST_MOTION_CONFIG, MOTION_CONFIG_DEFAULT, sanitizeMotionConfig)
  )
  const [s, dispatch] = useReducer(patchReducer<MotionRaceConfig>, init)
  const set = (payload: Partial<MotionRaceConfig>) => dispatch({ type: 'PATCH', payload })
  const { handleSave, handleTidy, showWarning } = usePanelStorage(
    STORAGE_KEYS.LAST_MOTION_CONFIG,
    s,
    onClose,
    hadInvalid
  )

  const isCountBased = s.endGoal === 'user_count' || s.endGoal === 'total_count'
  const hasEnemies = s.enemyCount > 0

  return (
    <ModalShell
      title="Motion Race Defaults"
      onClose={onClose}
      onSave={handleSave}
      showWarning={showWarning}
      onTidy={handleTidy}
    >
      <CollapseSection label="Language" icon={Globe} defaultOpen>
        <LanguageGrid value={s.language} onChange={v => set({ language: v })} />
      </CollapseSection>

      <CollapseSection label="End Condition" icon={Target} defaultOpen>
        <div className="flex flex-col gap-2">
          {MOTION_END_GOAL_OPTIONS.map(o => (
            <button
              key={o.id}
              type="button"
              onClick={() => set({ endGoal: o.id })}
              className={`${cls.modeCard(s.endGoal === o.id)} flex items-center gap-2`}
            >
              <o.icon className="w-4 h-4 flex-shrink-0" />
              <span>{o.label}</span>
              <span
                className={`text-xs font-normal ml-1 ${s.endGoal === o.id ? 'text-blue-200' : 'text-gray-500'}`}
              >
                {o.desc}
              </span>
            </button>
          ))}
        </div>
      </CollapseSection>

      {isCountBased && (
        <CollapseSection label="Goal Count" icon={Hash} defaultOpen>
          <div className="flex gap-2 flex-wrap">
            {MOTION_COUNT_OPTIONS.map(n => (
              <button
                key={n}
                type="button"
                onClick={() => set({ targetCount: n })}
                className={cls.pill(s.targetCount === n)}
              >
                {n}
              </button>
            ))}
          </div>
        </CollapseSection>
      )}

      {s.endGoal === 'timed' && (
        <CollapseSection label="Duration" icon={Timer} defaultOpen>
          <div className="flex gap-2 flex-wrap">
            {MOTION_DURATION_OPTIONS.map(d => (
              <button
                key={d.ms}
                type="button"
                onClick={() => set({ durationMs: d.ms })}
                className={cls.pill(s.durationMs === d.ms)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </CollapseSection>
      )}

      <CollapseSection label="Goal Options" icon={Map} defaultOpen>
        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Distance</p>
        <div className="flex gap-2 flex-wrap mb-4">
          {MOTION_DIST_LABELS.map(d => (
            <button
              key={d.id}
              type="button"
              onClick={() => set({ distanceMode: d.id })}
              className={cls.modeCard(s.distanceMode === d.id)}
            >
              <span className="font-bold">{d.label}</span>
              <span
                className={`text-xs font-normal ml-1 ${s.distanceMode === d.id ? 'text-blue-200' : 'text-gray-500'}`}
              >
                {d.desc}
              </span>
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Goal Display</p>
        <div className="flex gap-2 flex-wrap">
          {(
            [
              { id: 'next', label: 'Next only', desc: 'One goal at a time' },
              { id: 'all', label: 'All at once', desc: 'Multiple visible' },
            ] as const
          ).map(o => (
            <button
              key={o.id}
              type="button"
              onClick={() => set({ goalDisplayMode: o.id })}
              className={cls.modeCard(s.goalDisplayMode === o.id)}
            >
              <span className="font-bold">{o.label}</span>
              <span
                className={`text-xs font-normal ml-1 ${s.goalDisplayMode === o.id ? 'text-blue-200' : 'text-gray-500'}`}
              >
                {o.desc}
              </span>
            </button>
          ))}
        </div>
      </CollapseSection>

      <CollapseSection label="Enemies" icon={Bot}>
        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Enemy Count</p>
        <div className="flex gap-2 flex-wrap mb-3">
          {([0, 1, 3, 5, 10] as const).map(n => (
            <button
              key={n}
              type="button"
              onClick={() => set({ enemyCount: n })}
              className={cls.pill(s.enemyCount === n)}
            >
              {n === 0 ? 'None' : n}
            </button>
          ))}
        </div>
        {hasEnemies && (
          <>
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Enemy Speed</p>
            <div className="flex gap-2 flex-wrap">
              {MOTION_ENEMY_SPEED_OPTIONS.map(o => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => set({ enemySpeed: o.id })}
                  className={cls.pill(s.enemySpeed === o.id)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </>
        )}
      </CollapseSection>

      <ChallengeToggleSection
        enabled={s.challengeMode}
        onToggle={() => set({ challengeMode: !s.challengeMode })}
      >
        <UnifiedChallengeOptions
          guidedMode={s.challengeGuidedMode}
          onGuidedMode={v => set({ challengeGuidedMode: v })}
          startingLevel={s.challengeStartingLevel}
          onStartingLevel={v => set({ challengeStartingLevel: v })}
          repetition={s.challengeRepetition}
          onRepetition={v => set({ challengeRepetition: v })}
          timeMultiplier={s.challengeTimeMultiplier}
          onTimeMultiplier={v => set({ challengeTimeMultiplier: v })}
          selectableCategories={MOTION_CHALLENGE_CATEGORIES}
          selectedCategories={s.challengeCategories}
          onToggleCategory={cat =>
            set({
              challengeCategories: s.challengeCategories.includes(cat)
                ? s.challengeCategories.length > 1
                  ? s.challengeCategories.filter(c => c !== cat)
                  : s.challengeCategories
                : [...s.challengeCategories, cat],
            })
          }
          drillMode={s.challengeDrillMode ?? false}
          onDrillMode={v => set({ challengeDrillMode: v })}
        />
      </ChallengeToggleSection>
    </ModalShell>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// QVIMX
// ─────────────────────────────────────────────────────────────────────────────

// Mirror of the unexported QvimxSetupState from QvimxGame.tsx
type QvimxDefaultsState = {
  lang: Language
  codeSize: QvimxCodeSize
  borderShape: QvimxBorderShape
  subMode: QvimxSubMode
  ballCount: 1 | 2 | 3 | 4 | 5
  ballSpeed: QvimxBallSpeed
  enemyAI: QvimxAILevel
  lives: 1 | 3 | 5
  timerMs: number
  diagonalMode: boolean
  challengeMode: boolean
  challengeGuidedMode: GuidedMode
  challengeStartingLevel: number
  challengeRepetition: RepetitionLevel
  challengeTimeMultiplier: number
  challengeCategories: string[]
  challengeDrillMode: boolean
  bombCount: 0 | 1 | 2 | 3
}

const QVIMX_DEFAULT: QvimxDefaultsState = {
  lang: 'typescript',
  codeSize: 'medium',
  borderShape: 'full-rect',
  subMode: 'classic',
  ballCount: 2,
  ballSpeed: 'medium',
  enemyAI: 'wanderer',
  lives: 3,
  timerMs: 120_000,
  diagonalMode: false,
  challengeMode: false,
  challengeGuidedMode: 'none',
  challengeStartingLevel: 0,
  challengeRepetition: 1,
  challengeTimeMultiplier: 1,
  challengeCategories: [...MOTION_CHALLENGE_CATEGORIES],
  challengeDrillMode: false,
  bombCount: 1,
}

const VALID_CODE_SIZES: QvimxCodeSize[] = ['short', 'medium', 'long']
const VALID_BORDER_SHAPES: QvimxBorderShape[] = [
  'full-rect',
  'code-right',
  'inverse-code',
  'sub-rect',
  'rectangles',
]
const VALID_SUB_MODES: QvimxSubMode[] = ['classic', 'championship', 'ball-escalation', 'combo']
const VALID_AI_LEVELS: QvimxAILevel[] = ['passive', 'wanderer', 'hunter', 'cutter', 'unstoppable']
const VALID_BALL_SPEEDS: QvimxBallSpeed[] = ['slow', 'medium', 'fast', 'mixed']
const VALID_QVIMX_TIMERS = [60_000, 120_000, 300_000] as const
const VALID_LIVES = [1, 3, 5] as const
const VALID_BOMB_COUNTS = [0, 1, 2, 3] as const
const VALID_BALL_COUNTS = [1, 2, 3, 4, 5] as const

function sanitizeQvimxConfig(raw: unknown): { state: QvimxDefaultsState; hadInvalid: boolean } {
  if (!raw || typeof raw !== 'object') return { state: QVIMX_DEFAULT, hadInvalid: false }
  const r = raw as Record<string, unknown>
  let hadInvalid = false
  const fail = () => {
    hadInvalid = true
  }

  const state: QvimxDefaultsState = {
    lang: pick(r.lang, VALID_LANGUAGES, QVIMX_DEFAULT.lang, fail),
    codeSize: pick(r.codeSize, VALID_CODE_SIZES, QVIMX_DEFAULT.codeSize, fail),
    borderShape: pick(r.borderShape, VALID_BORDER_SHAPES, QVIMX_DEFAULT.borderShape, fail),
    subMode: pick(r.subMode, VALID_SUB_MODES, QVIMX_DEFAULT.subMode, fail),
    ballCount: pick(r.ballCount, VALID_BALL_COUNTS, QVIMX_DEFAULT.ballCount, fail),
    ballSpeed: pick(r.ballSpeed, VALID_BALL_SPEEDS, QVIMX_DEFAULT.ballSpeed, fail),
    enemyAI: pick(r.enemyAI, VALID_AI_LEVELS, QVIMX_DEFAULT.enemyAI, fail),
    lives: pick(r.lives, VALID_LIVES, QVIMX_DEFAULT.lives, fail),
    timerMs: pick(r.timerMs, VALID_QVIMX_TIMERS, QVIMX_DEFAULT.timerMs, fail),
    diagonalMode: pickBool(r.diagonalMode, QVIMX_DEFAULT.diagonalMode, fail),
    challengeMode: pickBool(r.challengeMode, QVIMX_DEFAULT.challengeMode, fail),
    challengeGuidedMode: pick(
      r.challengeGuidedMode,
      VALID_GUIDED_MODES,
      QVIMX_DEFAULT.challengeGuidedMode,
      fail
    ),
    challengeStartingLevel: pickNumber(
      r.challengeStartingLevel,
      0,
      9,
      QVIMX_DEFAULT.challengeStartingLevel,
      fail
    ),
    challengeRepetition: pick(
      r.challengeRepetition,
      VALID_REPETITIONS,
      QVIMX_DEFAULT.challengeRepetition,
      fail
    ),
    challengeTimeMultiplier: pick(
      r.challengeTimeMultiplier,
      VALID_TIME_MULTIPLIERS,
      QVIMX_DEFAULT.challengeTimeMultiplier,
      fail
    ),
    challengeCategories: pickStringArray(
      r.challengeCategories,
      MOTION_CHALLENGE_CATEGORIES,
      QVIMX_DEFAULT.challengeCategories,
      fail
    ),
    challengeDrillMode: pickBool(r.challengeDrillMode, QVIMX_DEFAULT.challengeDrillMode, () => {
      if (r.challengeDrillMode !== undefined) fail()
    }),
    bombCount: pick(r.bombCount, VALID_BOMB_COUNTS, QVIMX_DEFAULT.bombCount, fail),
  }

  if (hadInvalid) {
    console.warn(
      '[GameDefaultsModal] Some saved QVIMX config fields were invalid; reset to defaults.'
    )
  }
  return { state, hadInvalid }
}

// Re-declared locally (not exported from QvimxGame.tsx)
const QVIMX_CODE_SIZE_OPTIONS: { id: QvimxCodeSize; label: string; desc: string }[] = [
  { id: 'short', label: 'Short', desc: '~20 lines' },
  { id: 'medium', label: 'Medium', desc: '~60 lines' },
  { id: 'long', label: 'Long', desc: '~150 lines' },
]
const QVIMX_SUB_MODE_OPTIONS: { id: QvimxSubMode; label: string; desc: string }[] = [
  { id: 'classic', label: 'Classic', desc: 'Single timed round' },
  { id: 'championship', label: 'Championship', desc: 'Progress through board sizes' },
  { id: 'ball-escalation', label: 'Ball Escalation', desc: '+1 ball each win' },
  { id: 'combo', label: 'Combo', desc: 'Championship + ball escalation' },
]
const QVIMX_BORDER_OPTIONS: { id: QvimxBorderShape; label: string; desc: string }[] = [
  { id: 'full-rect', label: 'Full Rect', desc: 'Rectangle around the entire file' },
  { id: 'code-right', label: 'Code Right', desc: 'Right edge hugs last character' },
  {
    id: 'inverse-code',
    label: 'Inverse Code',
    desc: 'Code text is walls — play in the whitespace',
  },
  { id: 'sub-rect', label: 'Sub Rect', desc: 'Inner rectangle, outer code visible' },
  { id: 'rectangles', label: 'Rectangles', desc: 'Two stacked play areas' },
]
const QVIMX_AI_OPTIONS: { id: QvimxAILevel; label: string; desc: string }[] = [
  { id: 'passive', label: 'Passive', desc: 'Rarely leaves the border' },
  { id: 'wanderer', label: 'Wanderer', desc: 'Roams, occasionally claims strips' },
  { id: 'hunter', label: 'Hunter', desc: 'Targets your claimed territory' },
  { id: 'cutter', label: 'Cutter', desc: 'Intercepts your draw lines' },
  { id: 'unstoppable', label: 'Unstoppable', desc: 'Cuts lines AND hunts territory' },
]
const QVIMX_BALL_SPEED_OPTIONS: { id: QvimxBallSpeed; label: string }[] = [
  { id: 'slow', label: 'Slow' },
  { id: 'medium', label: 'Medium' },
  { id: 'fast', label: 'Fast' },
  { id: 'mixed', label: 'Mixed' },
]
const QVIMX_TIMER_OPTIONS: { label: string; ms: number }[] = [
  { label: '1 min', ms: 60_000 },
  { label: '2 min', ms: 120_000 },
  { label: '5 min', ms: 300_000 },
]

function QvimxDefaultsPanel({ onClose }: { onClose: () => void }) {
  const [{ state: init, hadInvalid }] = useState(() =>
    loadModeConfig(STORAGE_KEYS.LAST_QVIMX_CONFIG, QVIMX_DEFAULT, sanitizeQvimxConfig)
  )
  const [s, dispatch] = useReducer(patchReducer<QvimxDefaultsState>, init)
  const set = (payload: Partial<QvimxDefaultsState>) => dispatch({ type: 'PATCH', payload })
  const { handleSave, handleTidy, showWarning } = usePanelStorage(
    STORAGE_KEYS.LAST_QVIMX_CONFIG,
    s,
    onClose,
    hadInvalid
  )

  return (
    <ModalShell
      title="QVIMX Defaults"
      onClose={onClose}
      onSave={handleSave}
      showWarning={showWarning}
      onTidy={handleTidy}
    >
      <CollapseSection label="Language" icon={Globe} defaultOpen>
        <LanguageGrid value={s.lang} onChange={v => set({ lang: v })} />
      </CollapseSection>

      <CollapseSection label="Code Size" icon={Layers} defaultOpen>
        <div className="flex flex-col gap-2">
          {QVIMX_CODE_SIZE_OPTIONS.map(o => (
            <button
              key={o.id}
              type="button"
              onClick={() => set({ codeSize: o.id })}
              className={cls.modeCard(s.codeSize === o.id)}
            >
              <span className="font-bold">{o.label}</span>
              <span
                className={`text-xs font-normal ml-2 ${s.codeSize === o.id ? 'text-blue-200' : 'text-gray-500'}`}
              >
                {o.desc}
              </span>
            </button>
          ))}
        </div>
      </CollapseSection>

      <CollapseSection label="Sub Mode" icon={LayoutGrid} defaultOpen>
        <div className="flex flex-col gap-2">
          {QVIMX_SUB_MODE_OPTIONS.map(o => (
            <button
              key={o.id}
              type="button"
              onClick={() => set({ subMode: o.id })}
              className={cls.modeCard(s.subMode === o.id)}
            >
              <span className="font-bold">{o.label}</span>
              <span
                className={`text-xs font-normal ml-2 block mt-0.5 ${s.subMode === o.id ? 'text-blue-200' : 'text-gray-500'}`}
              >
                {o.desc}
              </span>
            </button>
          ))}
        </div>
      </CollapseSection>

      <CollapseSection label="Board Shape" icon={Maximize2}>
        <div className="flex flex-col gap-2">
          {QVIMX_BORDER_OPTIONS.map(o => (
            <button
              key={o.id}
              type="button"
              onClick={() => set({ borderShape: o.id })}
              className={cls.modeCard(s.borderShape === o.id)}
            >
              <span className="font-bold">{o.label}</span>
              <span
                className={`text-xs font-normal ml-2 block mt-0.5 ${s.borderShape === o.id ? 'text-blue-200' : 'text-gray-500'}`}
              >
                {o.desc}
              </span>
            </button>
          ))}
        </div>
      </CollapseSection>

      <CollapseSection label="Timer" icon={Timer} defaultOpen>
        <div className="flex gap-2 flex-wrap">
          {QVIMX_TIMER_OPTIONS.map(o => (
            <button
              key={o.ms}
              type="button"
              onClick={() => set({ timerMs: o.ms })}
              className={cls.pill(s.timerMs === o.ms)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </CollapseSection>

      <CollapseSection label="Lives" icon={Heart} defaultOpen>
        <div className="flex gap-2 flex-wrap">
          {([1, 3, 5] as const).map(n => (
            <button
              key={n}
              type="button"
              onClick={() => set({ lives: n })}
              className={cls.pill(s.lives === n)}
            >
              {Array.from({ length: n }, () => '♥').join(' ')}
            </button>
          ))}
        </div>
      </CollapseSection>

      <CollapseSection label="Bombs (Border Patrol)" icon={Shield}>
        <div className="flex gap-2 flex-wrap">
          {([0, 1, 2, 3] as const).map(n => (
            <button
              key={n}
              type="button"
              onClick={() => set({ bombCount: n })}
              className={cls.pill(s.bombCount === n)}
            >
              {n === 0 ? 'Off' : `${n} bomb${n > 1 ? 's' : ''}`}
            </button>
          ))}
        </div>
      </CollapseSection>

      <CollapseSection label="Enemy AI" icon={Bot}>
        <div className="flex flex-col gap-2">
          {QVIMX_AI_OPTIONS.map(o => (
            <button
              key={o.id}
              type="button"
              onClick={() => set({ enemyAI: o.id })}
              className={cls.modeCard(s.enemyAI === o.id)}
            >
              <span className="font-bold">{o.label}</span>
              <span
                className={`text-xs font-normal ml-2 block mt-0.5 ${s.enemyAI === o.id ? 'text-blue-200' : 'text-gray-500'}`}
              >
                {o.desc}
              </span>
            </button>
          ))}
        </div>
      </CollapseSection>

      <CollapseSection label="Hazard Balls" icon={Circle}>
        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Count</p>
        <div className="flex gap-2 flex-wrap mb-4">
          {([1, 2, 3, 4, 5] as const).map(n => (
            <button
              key={n}
              type="button"
              onClick={() => set({ ballCount: n })}
              className={cls.pill(s.ballCount === n)}
            >
              {n}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Speed</p>
        <div className="flex gap-2 flex-wrap">
          {QVIMX_BALL_SPEED_OPTIONS.map(o => (
            <button
              key={o.id}
              type="button"
              onClick={() => set({ ballSpeed: o.id })}
              className={cls.pill(s.ballSpeed === o.id)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </CollapseSection>

      <ChallengeToggleSection
        enabled={s.challengeMode}
        onToggle={() => set({ challengeMode: !s.challengeMode })}
      >
        <UnifiedChallengeOptions
          guidedMode={s.challengeGuidedMode}
          onGuidedMode={v => set({ challengeGuidedMode: v })}
          startingLevel={s.challengeStartingLevel}
          onStartingLevel={v => set({ challengeStartingLevel: v })}
          repetition={s.challengeRepetition}
          onRepetition={v => set({ challengeRepetition: v })}
          timeMultiplier={s.challengeTimeMultiplier}
          onTimeMultiplier={v => set({ challengeTimeMultiplier: v })}
          selectableCategories={MOTION_CHALLENGE_CATEGORIES}
          selectedCategories={s.challengeCategories}
          onToggleCategory={cat =>
            set({
              challengeCategories: s.challengeCategories.includes(cat)
                ? s.challengeCategories.length > 1
                  ? s.challengeCategories.filter(c => c !== cat)
                  : s.challengeCategories
                : [...s.challengeCategories, cat],
            })
          }
          drillMode={s.challengeDrillMode}
          onDrillMode={v => set({ challengeDrillMode: v })}
        />
      </ChallengeToggleSection>
    </ModalShell>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// VIMBOTS
// ─────────────────────────────────────────────────────────────────────────────

const VIMBOTS_DEFAULT: VimBotsConfig = {
  boardSource: 'grid',
  gridPreset: 'medium',
  customRows: 60,
  customCols: 40,
  codeFileSize: 'medium',
  difficulty: 'easy',
  enableTeleport: true,
  enableSafeTeleport: true,
  maxTeleports: 3,
  maxSafeTeleports: 3,
  animatedEffects: true,
  enableHelperGrid: false,
  startingEnemyLevel: 1,
  ...CHALLENGE_CONFIG_DEFAULTS,
}

const VALID_GRID_PRESETS: VimBoardPreset[] = [
  'tiny',
  'small',
  'medium',
  'large',
  'xlarge',
  'custom',
]
const VALID_VIMBOTS_DIFFICULTIES: VimBotsDifficulty[] = [
  'beginner',
  'easy',
  'medium',
  'hard',
  'expert',
]

function sanitizeVimBotsConfig(raw: unknown): { state: VimBotsConfig; hadInvalid: boolean } {
  if (!raw || typeof raw !== 'object') return { state: VIMBOTS_DEFAULT, hadInvalid: false }
  const r = raw as Record<string, unknown>
  let hadInvalid = false
  const fail = () => {
    hadInvalid = true
  }

  const state: VimBotsConfig = {
    boardSource: (r.boardSource as VimBotsConfig['boardSource']) ?? VIMBOTS_DEFAULT.boardSource,
    gridPreset: pick(r.gridPreset, VALID_GRID_PRESETS, VIMBOTS_DEFAULT.gridPreset, fail),
    customRows: pickNumber(r.customRows, 5, 300, VIMBOTS_DEFAULT.customRows, fail),
    customCols: pickNumber(r.customCols, 5, 300, VIMBOTS_DEFAULT.customCols, fail),
    codeFileSize: (r.codeFileSize as VimBotsConfig['codeFileSize']) ?? VIMBOTS_DEFAULT.codeFileSize,
    difficulty: pick(r.difficulty, VALID_VIMBOTS_DIFFICULTIES, VIMBOTS_DEFAULT.difficulty, fail),
    enableTeleport: pickBool(r.enableTeleport, VIMBOTS_DEFAULT.enableTeleport, fail),
    enableSafeTeleport: pickBool(r.enableSafeTeleport, VIMBOTS_DEFAULT.enableSafeTeleport, fail),
    maxTeleports: pickNumber(r.maxTeleports, 0, 20, VIMBOTS_DEFAULT.maxTeleports, fail),
    maxSafeTeleports: pickNumber(r.maxSafeTeleports, 0, 20, VIMBOTS_DEFAULT.maxSafeTeleports, fail),
    animatedEffects: pickBool(r.animatedEffects, VIMBOTS_DEFAULT.animatedEffects, fail),
    enableHelperGrid: pickBool(r.enableHelperGrid, VIMBOTS_DEFAULT.enableHelperGrid, fail),
    startingEnemyLevel: pickNumber(
      r.startingEnemyLevel,
      1,
      9,
      VIMBOTS_DEFAULT.startingEnemyLevel,
      fail
    ),
    challengeMode: pickBool(r.challengeMode, VIMBOTS_DEFAULT.challengeMode, fail),
    challengeGuidedMode: pick(
      r.challengeGuidedMode,
      VALID_GUIDED_MODES,
      VIMBOTS_DEFAULT.challengeGuidedMode,
      fail
    ),
    challengeStartingLevel: pickNumber(
      r.challengeStartingLevel,
      0,
      9,
      VIMBOTS_DEFAULT.challengeStartingLevel,
      fail
    ),
    challengeRepetition: pick(
      r.challengeRepetition,
      VALID_REPETITIONS,
      VIMBOTS_DEFAULT.challengeRepetition,
      fail
    ),
    challengeTimeMultiplier: pickNumber(
      r.challengeTimeMultiplier,
      0.5,
      5,
      VIMBOTS_DEFAULT.challengeTimeMultiplier,
      fail
    ),
    challengeCategories: pickStringArray(
      r.challengeCategories,
      MOTION_CHALLENGE_CATEGORIES,
      VIMBOTS_DEFAULT.challengeCategories,
      fail
    ),
    challengeDrillMode: pickBool(
      r.challengeDrillMode ?? false,
      VIMBOTS_DEFAULT.challengeDrillMode,
      fail
    ),
  }

  if (hadInvalid) {
    console.warn(
      '[GameDefaultsModal] Some saved VimBots config fields were invalid; reset to defaults.'
    )
  }
  return { state, hadInvalid }
}

const VIMBOTS_GRID_SIZE_OPTIONS: { id: VimBoardPreset; label: string; desc: string }[] = [
  { id: 'tiny', label: 'Tiny', desc: '20 × 60' },
  { id: 'small', label: 'Small', desc: '40 × 100' },
  { id: 'medium', label: 'Medium', desc: '60 × 140' },
  { id: 'large', label: 'Large', desc: '100 × 200' },
  { id: 'xlarge', label: 'XLarge', desc: '150 × 280' },
]

const VIMBOTS_DIFFICULTY_OPTIONS: { id: VimBotsDifficulty; label: string; desc: string }[] = [
  { id: 'beginner', label: 'Beginner', desc: '~2% robots' },
  { id: 'easy', label: 'Easy', desc: 'Few robots' },
  { id: 'medium', label: 'Medium', desc: 'Moderate density' },
  { id: 'hard', label: 'Hard', desc: 'Many robots' },
  { id: 'expert', label: 'Expert', desc: 'Maximum density' },
]

const VIMBOTS_TELEPORT_COUNTS = [0, 1, 2, 3, 5, 10] as const

function VimBotsDefaultsPanel({ onClose }: { onClose: () => void }) {
  const [{ state: init, hadInvalid }] = useState(() =>
    loadModeConfig(STORAGE_KEYS.LAST_VIMBOTS_CONFIG, VIMBOTS_DEFAULT, sanitizeVimBotsConfig)
  )
  const [s, dispatch] = useReducer(patchReducer<VimBotsConfig>, init)
  const set = (payload: Partial<VimBotsConfig>) => dispatch({ type: 'PATCH', payload })
  const { handleSave, handleTidy, showWarning } = usePanelStorage(
    STORAGE_KEYS.LAST_VIMBOTS_CONFIG,
    s,
    onClose,
    hadInvalid
  )

  return (
    <ModalShell
      title="VimBots Defaults"
      onClose={onClose}
      onSave={handleSave}
      showWarning={showWarning}
      onTidy={handleTidy}
    >
      <CollapseSection label="Grid Size" icon={LayoutGrid} defaultOpen>
        <div className="flex flex-col gap-2">
          {VIMBOTS_GRID_SIZE_OPTIONS.map(o => (
            <button
              key={o.id}
              type="button"
              onClick={() => set({ gridPreset: o.id })}
              className={cls.modeCard(s.gridPreset === o.id)}
            >
              <span className="font-bold">{o.label}</span>
              <span
                className={`text-xs font-normal ml-2 ${s.gridPreset === o.id ? 'text-blue-200' : 'text-gray-500'}`}
              >
                {o.desc}
              </span>
            </button>
          ))}
        </div>
      </CollapseSection>

      <CollapseSection label="Difficulty" icon={Skull} defaultOpen>
        <div className="flex flex-col gap-2">
          {VIMBOTS_DIFFICULTY_OPTIONS.map(o => (
            <button
              key={o.id}
              type="button"
              onClick={() => set({ difficulty: o.id })}
              className={cls.modeCard(s.difficulty === o.id)}
            >
              <span className="font-bold">{o.label}</span>
              <span
                className={`text-xs font-normal ml-2 ${s.difficulty === o.id ? 'text-blue-200' : 'text-gray-500'}`}
              >
                {o.desc}
              </span>
            </button>
          ))}
        </div>
      </CollapseSection>

      <CollapseSection label="Teleport" icon={Maximize2} defaultOpen>
        <div className="flex items-center gap-3 mb-3">
          <button
            type="button"
            role="switch"
            aria-checked={s.enableTeleport}
            onClick={() => set({ enableTeleport: !s.enableTeleport })}
            className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${s.enableTeleport ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${s.enableTeleport ? 'translate-x-4' : 'translate-x-0.5'}`}
            />
          </button>
          <span className="text-xs text-gray-400">{s.enableTeleport ? 'Enabled' : 'Disabled'}</span>
        </div>
        {s.enableTeleport && (
          <>
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Max Teleports</p>
            <div className="flex gap-2 flex-wrap">
              {VIMBOTS_TELEPORT_COUNTS.map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => set({ maxTeleports: n })}
                  className={cls.pill(s.maxTeleports === n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </>
        )}
      </CollapseSection>

      <CollapseSection label="Safe Teleport" icon={Shield} defaultOpen>
        <div className="flex items-center gap-3 mb-3">
          <button
            type="button"
            role="switch"
            aria-checked={s.enableSafeTeleport}
            onClick={() => set({ enableSafeTeleport: !s.enableSafeTeleport })}
            className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${s.enableSafeTeleport ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${s.enableSafeTeleport ? 'translate-x-4' : 'translate-x-0.5'}`}
            />
          </button>
          <span className="text-xs text-gray-400">
            {s.enableSafeTeleport ? 'Enabled' : 'Disabled'}
          </span>
        </div>
        {s.enableSafeTeleport && (
          <>
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">
              Max Safe Teleports
            </p>
            <div className="flex gap-2 flex-wrap">
              {VIMBOTS_TELEPORT_COUNTS.map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => set({ maxSafeTeleports: n })}
                  className={cls.pill(s.maxSafeTeleports === n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </>
        )}
      </CollapseSection>
    </ModalShell>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Modal shell
// ─────────────────────────────────────────────────────────────────────────────

interface ModalShellProps {
  title: string
  onClose: () => void
  onSave: () => void
  showWarning: boolean
  onTidy: () => void
  children: React.ReactNode
}

function ModalShell({ title, onClose, onSave, showWarning, onTidy, children }: ModalShellProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-700">
          <h2 className="text-base font-bold text-white font-mono">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning banner */}
        {showWarning && (
          <div className="flex-shrink-0 mx-5 mt-4 p-3 bg-yellow-900/40 border border-yellow-700 rounded-lg">
            <p className="text-yellow-300 text-xs font-mono leading-relaxed">
              Some saved options were invalid and were reset to defaults.
            </p>
            <button
              type="button"
              onClick={onTidy}
              className="mt-2 px-3 py-1 text-xs font-mono bg-yellow-700 hover:bg-yellow-600 text-white rounded transition-colors"
            >
              Tidy
            </button>
          </div>
        )}

        {/* Scrollable form */}
        <div className="overflow-y-auto flex-1 bg-gray-800/40 border-y border-gray-700 divide-y divide-gray-800 mx-0 px-5 my-4">
          {children}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex gap-3 px-5 pb-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-mono bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:border-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="flex-1 py-2.5 text-sm font-mono font-bold bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Save as default
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Public export
// ─────────────────────────────────────────────────────────────────────────────

interface GameDefaultsModalProps {
  mode: ModalMode
  onClose: () => void
}

export function GameDefaultsModal({ mode, onClose }: GameDefaultsModalProps) {
  if (mode === 'arcade') return <ArcadeDefaultsPanel onClose={onClose} />
  if (mode === 'goal') return <GoalDefaultsPanel onClose={onClose} />
  if (mode === 'motion') return <MotionDefaultsPanel onClose={onClose} />
  if (mode === 'qvimx') return <QvimxDefaultsPanel onClose={onClose} />
  if (mode === 'vimbots') return <VimBotsDefaultsPanel onClose={onClose} />
  return null
}
