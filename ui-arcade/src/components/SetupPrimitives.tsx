/**
 * Shared setup-screen UI primitives used by SetupScreen, GoalSetupScreen,
 * and MotionRaceGame's setup section.
 *
 * Rule: import constants from here so they're identical across all modes.
 */
import { useState } from 'react'
import type React from 'react'
import type { LucideIcon } from 'lucide-react'
import { Zap, RotateCcw } from 'lucide-react'
import type { Language, GuidedMode, RepetitionLevel } from '../engine/types'
import { getCategoryColor } from '../engine/categoryColors'

// ── Shared constants ──────────────────────────────────────────────────────────

/** Colored abbreviation badge for each language — no emoji, works everywhere. */
export const SETUP_LANGUAGES: { id: Language; label: string; abbr: string; badgeCls: string }[] = [
  {
    id: 'go',
    label: 'Go',
    abbr: 'go',
    badgeCls: 'text-teal-300   bg-teal-900/50   border border-teal-800',
  },
  {
    id: 'rust',
    label: 'Rust',
    abbr: 'rs',
    badgeCls: 'text-orange-300 bg-orange-900/50 border border-orange-800',
  },
  {
    id: 'python',
    label: 'Python',
    abbr: 'py',
    badgeCls: 'text-yellow-300 bg-yellow-900/50 border border-yellow-800',
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    abbr: 'ts',
    badgeCls: 'text-blue-300   bg-blue-900/50   border border-blue-800',
  },
  {
    id: 'c',
    label: 'C',
    abbr: 'c',
    badgeCls: 'text-gray-300   bg-gray-700/50   border border-gray-600',
  },
  {
    id: 'cpp',
    label: 'C++',
    abbr: 'c++',
    badgeCls: 'text-purple-300 bg-purple-900/50 border border-purple-800',
  },
  {
    id: 'lorem',
    label: 'Lorem Ipsum',
    abbr: 'txt',
    badgeCls: 'text-pink-300   bg-pink-900/50   border border-pink-800',
  },
]

// ── Style tokens ──────────────────────────────────────────────────────────────

export const cls = {
  /** Standard selectable pill — active: blue */
  pill: (active: boolean) =>
    `px-4 py-2 rounded border text-sm font-mono transition-colors ${
      active
        ? 'bg-blue-700 border-blue-500 text-white font-bold'
        : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'
    }`,

  /** Language button — active: green, icon-left inline layout */
  lang: (active: boolean) =>
    `flex items-center px-3 py-2 rounded border text-xs font-mono transition-colors ${
      active
        ? 'bg-green-900/30 border-green-500 text-green-300 font-bold'
        : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'
    }`,

  /** Mode/end-condition card with subtitle — active: blue */
  modeCard: (active: boolean) =>
    `py-2.5 px-3 rounded border text-sm font-mono transition-colors text-left w-full ${
      active
        ? 'bg-blue-700 border-blue-500 text-white'
        : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'
    }`,
} as const

// ── LanguageGrid ──────────────────────────────────────────────────────────────

interface LanguageGridProps {
  value: Language
  onChange: (lang: Language) => void
}

export function LanguageGrid({ value, onChange }: LanguageGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {SETUP_LANGUAGES.map(l => (
        <button key={l.id} onClick={() => onChange(l.id)} className={cls.lang(value === l.id)}>
          <span
            className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded flex-shrink-0 ${l.badgeCls}`}
          >
            {l.abbr}
          </span>
          <span className="ml-1.5 truncate">{l.label}</span>
        </button>
      ))}
    </div>
  )
}

// ── CollapseSection ───────────────────────────────────────────────────────────

interface CollapseSectionProps {
  label: React.ReactNode
  icon?: LucideIcon
  defaultOpen?: boolean
  badge?: React.ReactNode
  children: React.ReactNode
}

export function CollapseSection({
  label,
  icon: Icon,
  defaultOpen = false,
  badge,
  children,
}: CollapseSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-800 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between py-3 text-left group"
      >
        <span className="flex items-center gap-1.5">
          {Icon && <Icon className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />}
          <span className="text-xs font-mono uppercase tracking-wider text-gray-400 group-hover:text-gray-300 transition-colors">
            {label}
          </span>
        </span>
        <span className="flex items-center gap-2 flex-shrink-0">
          {!open && badge && <span className="text-xs text-gray-500">{badge}</span>}
          <span
            className={`text-gray-600 text-xs transition-transform duration-150 ${open ? 'rotate-90' : ''}`}
          >
            ▶
          </span>
        </span>
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  )
}

// ── SetupPageShell ────────────────────────────────────────────────────────────

interface SetupPageShellProps {
  title: string
  subtitle: string
  children: React.ReactNode
  actions: React.ReactNode // back + start buttons
}

export function SetupPageShell({ title, subtitle, children, actions }: SetupPageShellProps) {
  return (
    <div className="min-h-screen bg-gray-900 overflow-y-auto font-mono">
      <div className="max-w-lg mx-auto py-10 px-5">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">{title}</h1>
          <p className="text-gray-400 text-sm">{subtitle}</p>
        </div>

        <div className="bg-gray-800/40 border border-gray-700 rounded-xl px-5 divide-y divide-gray-800">
          {children}
        </div>

        <div className="mt-6">{actions}</div>
      </div>
    </div>
  )
}

// ── ChallengeToggleSection ────────────────────────────────────────────────────
// Reusable "Challenge Mode" block shared by Goal Mode and Motion Race.
// Callers pass the expanded sub-options as children.

interface ChallengeToggleSectionProps {
  enabled: boolean
  onToggle: () => void
  children?: React.ReactNode // sub-options shown when enabled
}

export function ChallengeToggleSection({
  enabled,
  onToggle,
  children,
}: ChallengeToggleSectionProps) {
  return (
    <CollapseSection
      label="Challenge Mode"
      icon={Zap}
      defaultOpen={enabled}
      badge={enabled ? <span className="text-green-400 font-bold text-[10px]">ON</span> : undefined}
    >
      <button
        type="button"
        onClick={onToggle}
        className={`w-full py-2.5 px-3 rounded border text-sm font-mono transition-colors text-left mb-3 ${
          enabled
            ? 'bg-green-800 border-green-600 text-white font-bold'
            : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
        }`}
      >
        {enabled ? '✓ Enabled' : '○ Disabled'}
        <span
          className={`text-xs font-normal ml-2 ${enabled ? 'text-green-300' : 'text-gray-600'}`}
        >
          {enabled
            ? 'Earning bonus points for completed challenges'
            : 'Enable to practice commands alongside navigation'}
        </span>
      </button>
      {enabled && children && (
        <div className="space-y-3 pl-1 border-l border-gray-700">{children}</div>
      )}
    </CollapseSection>
  )
}

// ── Shared challenge constants ────────────────────────────────────────────────

export const SETUP_GUIDED_MODES: { id: GuidedMode; label: string; desc: string }[] = [
  { id: 'none', label: 'None', desc: 'No hints — type from memory' },
  { id: 'all', label: 'Always', desc: 'Solution always visible' },
  { id: 'first_only', label: 'First only', desc: 'Show once, then test blindly' },
  { id: 'after_failure', label: 'After failure', desc: 'Hint appears after a miss' },
  {
    id: 'first_then_failure',
    label: 'First + on failure',
    desc: 'Show once, re-show after misses',
  },
  { id: 'alternating', label: 'Alternating', desc: 'Show on every other occurrence' },
]

export const SETUP_REPETITIONS: { value: RepetitionLevel; label: string; desc: string }[] = [
  { value: 1, label: '1×', desc: 'Each command once' },
  { value: 2, label: '2×', desc: 'Reinforce twice' },
  { value: 3, label: '3×', desc: 'Build muscle memory' },
  { value: 5, label: '5×', desc: 'Deep mastery' },
]

// ── MotionChallengeOptions ────────────────────────────────────────────────────
// Challenge sub-options valid in Motion Race (no edit mode).

interface MotionChallengeOptionsProps {
  guidedMode: GuidedMode
  setGuidedMode: (v: GuidedMode) => void
  startingLevel: number
  setStartingLevel: (v: number) => void
  repetition: RepetitionLevel
  setRepetition: (v: RepetitionLevel) => void
}

export function MotionChallengeOptions({
  guidedMode,
  setGuidedMode,
  startingLevel,
  setStartingLevel,
  repetition,
  setRepetition,
}: MotionChallengeOptionsProps) {
  return (
    <div className="space-y-4 text-xs font-mono">
      {/* Guided mode */}
      <div>
        <p className="text-gray-500 mb-2 uppercase tracking-wider">Solution Hints</p>
        <div className="space-y-1">
          {SETUP_GUIDED_MODES.map(g => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGuidedMode(g.id)}
              className={`w-full text-left px-3 py-1.5 rounded border transition-colors ${
                guidedMode === g.id
                  ? 'bg-purple-900/40 border-purple-700 text-white font-bold'
                  : 'bg-gray-800/60 border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              <span className="text-white">{g.label}</span>
              <span className="text-gray-500 ml-2">{g.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Starting level */}
      <div>
        <p className="text-gray-500 mb-1 uppercase tracking-wider">
          Starting Level:{' '}
          <span className="text-yellow-400">
            {startingLevel === 0 ? 'Beginner' : `Lv ${startingLevel}`}
          </span>
        </p>
        <input
          type="range"
          min={0}
          max={9}
          step={1}
          value={startingLevel}
          onChange={e => setStartingLevel(Number(e.target.value))}
          className="w-full accent-purple-500"
        />
        <div className="flex justify-between text-gray-600 mt-1">
          <span>Beginner</span>
          <span>Expert</span>
        </div>
      </div>

      {/* Repetition */}
      <div>
        <p className="text-gray-500 mb-2 uppercase tracking-wider">Repetitions per command</p>
        <div className="flex gap-2 flex-wrap">
          {SETUP_REPETITIONS.map(r => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRepetition(r.value)}
              className={cls.pill(repetition === r.value)}
            >
              {r.label}
              <span className="text-xs font-normal opacity-70 ml-1">{r.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── StartButton / ReplayButton ────────────────────────────────────────────────
// Shared across all setup screens for a consistent call-to-action.

interface StartButtonProps {
  onClick: () => void
  disabled?: boolean
  label?: string
  disabledLabel?: string
}

export function StartButton({
  onClick,
  disabled = false,
  label = 'Start',
  disabledLabel,
}: StartButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3.5 font-mono font-bold text-base rounded-xl uppercase tracking-wider transition-colors ${
        disabled
          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
          : 'bg-green-600 hover:bg-green-500 text-white'
      }`}
    >
      {disabled && disabledLabel ? disabledLabel : label}
    </button>
  )
}

interface ReplayButtonProps {
  onClick: () => void
  summary: string // short description of the last config
}

export function ReplayButton({ onClick, summary }: ReplayButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-400 font-mono text-sm rounded-xl border border-gray-700 transition-colors flex items-center justify-center gap-1.5"
    >
      <RotateCcw className="w-3.5 h-3.5 flex-shrink-0" />
      <span className="truncate">Repeat last: {summary}</span>
    </button>
  )
}

// ── Shared time-multiplier options ────────────────────────────────────────────
export const TIME_MULTIPLIER_OPTIONS = [
  { value: 1.0, label: '1×', desc: 'Default pace' },
  { value: 1.5, label: '1.5×', desc: 'Slower' },
  { value: 2.0, label: '2×', desc: 'Relaxed' },
  { value: 3.0, label: '3×', desc: 'No rush' },
] as const

// ── UnifiedChallengeOptions ───────────────────────────────────────────────────
// Single source-of-truth component for challenge configuration.
// Used in Arcade, Goal Mode, and Motion Race — different props control which
// sections are shown, but the layout and style are identical.

export interface UnifiedChallengeOptionsProps {
  // Always rendered
  guidedMode: GuidedMode
  onGuidedMode: (v: GuidedMode) => void
  startingLevel: number
  onStartingLevel: (v: number) => void
  repetition: RepetitionLevel
  onRepetition: (v: RepetitionLevel) => void
  timeMultiplier: number
  onTimeMultiplier: (v: number) => void

  // Goal Mode: concurrent challenges slider
  concurrent?: number
  onConcurrent?: (v: number) => void

  // Arcade Mode: dynamic assist (null = disabled)
  dynamicAssistEnabled?: boolean
  dynamicAssistPct?: number
  onDynamicAssistToggle?: () => void
  onDynamicAssistPct?: (v: number) => void

  // Arcade Mode: knowledge filter
  knowledgeFilter?: 'all' | 'known' | 'unknown'
  onKnowledgeFilter?: (v: 'all' | 'known' | 'unknown') => void

  // Goal Mode: solved/unsolved/mixed filter for the challenge pool
  solvedFilter?: 'all' | 'unsolved' | 'solved' | 'mixed'
  onSolvedFilter?: (v: 'all' | 'unsolved' | 'solved' | 'mixed') => void

  // Motion Race: selectable subset of available categories (at least 1 required)
  selectableCategories?: string[]
  selectedCategories?: string[]
  onToggleCategory?: (cat: string) => void

  // Drill mode: sequential order instead of random
  drillMode?: boolean
  onDrillMode?: (v: boolean) => void
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-gray-500 text-[11px] font-mono uppercase tracking-wider mb-2">{children}</p>
  )
}

export function UnifiedChallengeOptions({
  guidedMode,
  onGuidedMode,
  startingLevel,
  onStartingLevel,
  repetition,
  onRepetition,
  timeMultiplier,
  onTimeMultiplier,
  concurrent,
  onConcurrent,
  dynamicAssistEnabled,
  dynamicAssistPct,
  onDynamicAssistToggle,
  onDynamicAssistPct,
  knowledgeFilter,
  onKnowledgeFilter,
  solvedFilter,
  onSolvedFilter,
  selectableCategories,
  selectedCategories,
  onToggleCategory,
  drillMode,
  onDrillMode,
}: UnifiedChallengeOptionsProps) {
  return (
    <div className="space-y-5 text-xs font-mono">
      {/* Drill Mode */}
      {onDrillMode !== undefined && (
        <div>
          <SubLabel>Command order</SubLabel>
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => onDrillMode(false)}
              className={cls.pill(drillMode === false || drillMode === undefined)}
            >
              Randomize
            </button>
            <button
              type="button"
              onClick={() => onDrillMode(true)}
              className={cls.pill(drillMode === true)}
            >
              Drill
              <span className="text-xs font-normal opacity-60 ml-1">in order</span>
            </button>
          </div>
        </div>
      )}
      {/* Guided Mode */}
      <div>
        <SubLabel>Solution hints</SubLabel>
        <div className="space-y-1">
          {SETUP_GUIDED_MODES.map(g => (
            <button
              key={g.id}
              type="button"
              onClick={() => onGuidedMode(g.id)}
              className={`w-full text-left px-3 py-1.5 rounded border transition-colors ${
                guidedMode === g.id
                  ? 'bg-purple-900/40 border-purple-700 text-white font-bold'
                  : 'bg-gray-800/60 border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              <span className="text-white text-xs">{g.label}</span>
              <span className="text-gray-500 ml-2">{g.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Starting level */}
      <div>
        <SubLabel>
          Starting level:{' '}
          <span className="text-yellow-400">
            {startingLevel === 0 ? 'Beginner' : `Lv ${startingLevel}`}
          </span>
        </SubLabel>
        <input
          type="range"
          min={0}
          max={9}
          step={1}
          value={startingLevel}
          onChange={e => onStartingLevel(Number(e.target.value))}
          className="w-full accent-purple-500"
        />
        <div className="flex justify-between text-gray-600 mt-1">
          <span>Beginner</span>
          <span>Expert</span>
        </div>
      </div>

      {/* Repetition */}
      <div>
        <SubLabel>Repetitions per command</SubLabel>
        <div className="flex gap-2 flex-wrap">
          {SETUP_REPETITIONS.map(r => (
            <button
              key={r.value}
              type="button"
              onClick={() => onRepetition(r.value)}
              className={cls.pill(repetition === r.value)}
            >
              {r.label}
              <span className="text-xs font-normal opacity-60 ml-1">{r.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Time multiplier */}
      <div>
        <SubLabel>Time per challenge</SubLabel>
        <div className="flex gap-2 flex-wrap">
          {TIME_MULTIPLIER_OPTIONS.map(t => (
            <button
              key={t.value}
              type="button"
              onClick={() => onTimeMultiplier(t.value)}
              className={cls.pill(timeMultiplier === t.value)}
            >
              {t.label}
              <span className="text-xs font-normal opacity-60 ml-1">{t.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Concurrent challenges — Goal Mode only */}
      {onConcurrent !== undefined && concurrent !== undefined && (
        <div>
          <SubLabel>
            Concurrent challenges: <span className="text-yellow-400">{concurrent}</span>
          </SubLabel>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={concurrent}
            onChange={e => onConcurrent(Number(e.target.value))}
            className="w-full accent-purple-500"
          />
          <div className="flex justify-between text-gray-600 mt-1">
            <span>1</span>
            <span>10</span>
          </div>
        </div>
      )}

      {/* Dynamic Assist — Arcade only */}
      {onDynamicAssistToggle !== undefined && (
        <div>
          <SubLabel>Dynamic assist</SubLabel>
          <div className="flex items-center gap-3 mb-2">
            <button
              type="button"
              role="switch"
              aria-checked={dynamicAssistEnabled}
              onClick={onDynamicAssistToggle}
              className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${dynamicAssistEnabled ? 'bg-orange-600' : 'bg-gray-700'}`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${dynamicAssistEnabled ? 'translate-x-4' : 'translate-x-0.5'}`}
              />
            </button>
            <span className="text-gray-400">
              {dynamicAssistEnabled ? `Show hint after ${dynamicAssistPct ?? 100}% of time` : 'Off'}
            </span>
          </div>
          {dynamicAssistEnabled && onDynamicAssistPct !== undefined && (
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={dynamicAssistPct ?? 100}
              onChange={e => onDynamicAssistPct(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
          )}
        </div>
      )}

      {/* Knowledge Filter — Arcade only */}
      {onKnowledgeFilter !== undefined && knowledgeFilter !== undefined && (
        <div>
          <SubLabel>Practice focus</SubLabel>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'unknown', 'known'] as const).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => onKnowledgeFilter(f)}
                className={cls.pill(knowledgeFilter === f)}
              >
                {f === 'all' ? 'All commands' : f === 'unknown' ? 'Unknown only' : 'Known only'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Solved filter — Goal Mode only */}
      {onSolvedFilter !== undefined && solvedFilter !== undefined && (
        <div>
          <SubLabel>Focus</SubLabel>
          <div className="flex gap-2 flex-wrap">
            {(
              [
                { id: 'all', label: 'All challenges' },
                { id: 'unsolved', label: 'Unsolved only' },
                { id: 'solved', label: 'Solved only' },
                { id: 'mixed', label: 'Mixed (70% new)' },
              ] as const
            ).map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => onSolvedFilter(f.id)}
                className={cls.pill(solvedFilter === f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selectable challenge categories — Motion Race only */}
      {selectableCategories && selectedCategories && onToggleCategory && (
        <div>
          <SubLabel>
            Focus areas <span className="text-gray-600 normal-case">(select at least one)</span>
          </SubLabel>
          <div className="flex flex-wrap gap-2">
            {selectableCategories.map(cat => {
              const active = selectedCategories.includes(cat)
              const isLast = active && selectedCategories.length === 1
              const hsl = getCategoryColor(cat) // e.g. "hsl(28, 70%, 52%)"
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    if (!isLast) onToggleCategory(cat)
                  }}
                  title={isLast ? 'At least one category required' : undefined}
                  style={
                    active
                      ? {
                          borderColor: hsl,
                          color: hsl,
                          backgroundColor: hsl.replace('52%)', '18%)').replace('70%,', '60%,'),
                        }
                      : undefined
                  }
                  className={`px-3 py-1.5 rounded border text-xs font-mono transition-colors font-bold ${
                    active ? '' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                  } ${isLast ? 'opacity-60 cursor-default' : ''}`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
