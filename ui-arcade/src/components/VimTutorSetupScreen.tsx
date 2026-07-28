import { useReducer, useState } from 'react'
import { BookOpen, BookMarked, RotateCcw } from 'lucide-react'
import { STORAGE_KEYS } from '../engine/storageKeys'
import {
  type VimTutorConfig,
  type VimTutorChapter,
  CHAPTER1_SECTIONS,
  CHAPTER2_SECTIONS,
  SECTIONS_BY_CHAPTER,
} from '../data/vimtutor'
import type { ChallengeConfig } from '../engine/types'
import { MOTION_CHALLENGE_CATEGORIES } from '../hooks/useMotionRace'
import {
  CollapseSection,
  SetupPageShell,
  StartButton,
  ChallengeToggleSection,
  UnifiedChallengeOptions,
  cls,
} from './SetupPrimitives'

// ── Reducer ───────────────────────────────────────────────────────────────────

type SetupState = { chapter: VimTutorChapter; sections: string[] } & ChallengeConfig

type SetupAction =
  | { type: 'SET_CHAPTER'; value: VimTutorChapter }
  | { type: 'TOGGLE_SECTION'; id: string }
  | { type: 'SET_ALL_SECTIONS'; chapter: VimTutorChapter }
  | { type: 'PATCH'; payload: Partial<SetupState> }

function allSectionIds(chapter: VimTutorChapter): string[] {
  return SECTIONS_BY_CHAPTER[chapter].map(s => s.id)
}

const CHALLENGE_DEFAULTS: ChallengeConfig = {
  challengeMode: false,
  challengeGuidedMode: 'none',
  challengeStartingLevel: 0,
  challengeRepetition: 1,
  challengeTimeMultiplier: 1,
  challengeCategories: MOTION_CHALLENGE_CATEGORIES,
  challengeDrillMode: false,
}

function reducer(state: SetupState, action: SetupAction): SetupState {
  switch (action.type) {
    case 'SET_CHAPTER':
      return { ...state, chapter: action.value, sections: allSectionIds(action.value) }
    case 'TOGGLE_SECTION': {
      const has = state.sections.includes(action.id)
      if (has && state.sections.length === 1) return state
      const next = has
        ? state.sections.filter(s => s !== action.id)
        : [...state.sections, action.id]
      return { ...state, sections: next }
    }
    case 'SET_ALL_SECTIONS':
      return { ...state, sections: allSectionIds(action.chapter) }
    case 'PATCH':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

// ── Persistence ───────────────────────────────────────────────────────────────

function loadLastConfig(): VimTutorConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LAST_VIMTUTOR_CONFIG)
    return raw ? (JSON.parse(raw) as VimTutorConfig) : null
  } catch {
    return null
  }
}

function saveLastConfig(config: VimTutorConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_VIMTUTOR_CONFIG, JSON.stringify(config))
  } catch {
    /* ignore */
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

interface VimTutorSetupScreenProps {
  onStart: (config: VimTutorConfig) => void
  onBack: () => void
}

const CHAPTERS: { value: VimTutorChapter; label: string; desc: string }[] = [
  { value: 1, label: 'Chapter 1', desc: 'Basic editing — 30 min' },
  { value: 2, label: 'Chapter 2', desc: 'Registers, marks, text objects — 10 min' },
]

export function VimTutorSetupScreen({ onStart, onBack: _onBack }: VimTutorSetupScreenProps) {
  const [lastConfig, setLastConfig] = useState<VimTutorConfig | null>(loadLastConfig)

  const [s, dispatch] = useReducer(reducer, null, () => {
    const saved = loadLastConfig()
    if (saved) {
      const valid = SECTIONS_BY_CHAPTER[saved.chapter].map(sec => sec.id)
      const sections = saved.sections.filter(id => valid.includes(id))
      return {
        chapter: saved.chapter,
        sections: sections.length > 0 ? sections : allSectionIds(saved.chapter),
        challengeMode: saved.challengeMode ?? false,
        challengeGuidedMode: saved.challengeGuidedMode ?? 'none',
        challengeStartingLevel: saved.challengeStartingLevel ?? 0,
        challengeRepetition: saved.challengeRepetition ?? 1,
        challengeTimeMultiplier: saved.challengeTimeMultiplier ?? 1,
        challengeCategories: saved.challengeCategories ?? MOTION_CHALLENGE_CATEGORIES,
        challengeDrillMode: saved.challengeDrillMode ?? false,
      }
    }
    return {
      chapter: 1 as VimTutorChapter,
      sections: allSectionIds(1),
      ...CHALLENGE_DEFAULTS,
    }
  })

  const set = (payload: Partial<SetupState>) => dispatch({ type: 'PATCH', payload })

  const chapterSections = s.chapter === 1 ? CHAPTER1_SECTIONS : CHAPTER2_SECTIONS

  const allSelected = s.sections.length === chapterSections.length
  const noneDeselectable = s.sections.length === 1

  function buildConfig(state: SetupState): VimTutorConfig {
    return {
      chapter: state.chapter,
      sections: state.sections,
      challengeMode: state.challengeMode,
      challengeGuidedMode: state.challengeGuidedMode,
      challengeStartingLevel: state.challengeStartingLevel,
      challengeRepetition: state.challengeRepetition,
      challengeTimeMultiplier: state.challengeTimeMultiplier,
      challengeCategories: state.challengeCategories,
      challengeDrillMode: state.challengeDrillMode,
    }
  }

  function handleStart() {
    const config = buildConfig(s)
    saveLastConfig(config)
    setLastConfig(config)
    onStart(config)
  }

  const actions = (
    <div className="space-y-3">
      <StartButton onClick={handleStart} />
      {lastConfig && (
        <button
          onClick={() => onStart(lastConfig)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 border border-gray-700 hover:border-gray-500 rounded-lg text-sm font-mono text-gray-300 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Replay — Ch.{lastConfig.chapter}{' '}
          {lastConfig.sections.length > 0 ? `· ${lastConfig.sections.join(', ')}` : '· all lessons'}
        </button>
      )}
    </div>
  )

  return (
    <SetupPageShell
      title="VimTutor"
      subtitle="Follow the official vim tutorial — practice every lesson"
      actions={actions}
    >
      {/* ── Chapter ──────────────────────────────────────────────────── */}
      <CollapseSection
        label="Chapter"
        icon={BookOpen}
        defaultOpen={true}
        badge={`Ch. ${s.chapter}`}
      >
        <div className="flex gap-2 flex-wrap">
          {CHAPTERS.map(ch => (
            <button
              key={ch.value}
              onClick={() => dispatch({ type: 'SET_CHAPTER', value: ch.value })}
              className={cls.modeCard(s.chapter === ch.value)}
            >
              <span className="font-bold">{ch.label}</span>
              <span
                className={`block text-xs mt-0.5 ${s.chapter === ch.value ? 'text-blue-200' : 'text-gray-500'}`}
              >
                {ch.desc}
              </span>
            </button>
          ))}
        </div>
      </CollapseSection>

      {/* ── Lessons ──────────────────────────────────────────────────── */}
      <CollapseSection
        label="Lessons"
        icon={BookMarked}
        defaultOpen={true}
        badge={allSelected ? 'all' : `${s.sections.length}/${chapterSections.length}`}
      >
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-500 font-mono text-xs">Select the lessons to practice</span>
          {!allSelected ? (
            <button
              onClick={() => dispatch({ type: 'SET_ALL_SECTIONS', chapter: s.chapter })}
              className="text-xs text-blue-400 hover:text-blue-300 font-mono"
            >
              select all
            </button>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          {chapterSections.map(sec => {
            const active = s.sections.includes(sec.id)
            const disabled = active && noneDeselectable
            return (
              <button
                key={sec.id}
                onClick={() => dispatch({ type: 'TOGGLE_SECTION', id: sec.id })}
                disabled={disabled}
                className={`flex items-start gap-3 px-3 py-2.5 rounded border text-left transition-colors font-mono ${
                  active
                    ? 'bg-green-900/30 border-green-600 text-green-100'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`w-4 h-4 mt-0.5 flex-shrink-0 rounded-sm border text-xs flex items-center justify-center ${
                    active ? 'bg-green-600 border-green-500 text-white' : 'border-gray-600'
                  }`}
                >
                  {active ? '✓' : ''}
                </span>
                <span>
                  <span className="text-sm font-bold block">{sec.title}</span>
                  <span className="text-xs text-gray-400 mt-0.5 block">{sec.description}</span>
                </span>
              </button>
            )
          })}
        </div>
      </CollapseSection>

      {/* ── Challenge Mode ───────────────────────────────────────────── */}
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
    </SetupPageShell>
  )
}
