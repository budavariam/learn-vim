import { useReducer, useState } from 'react'
import { getPresetDimensions, generateGrid } from '../engine/VimBotsEngine'
import type {
  VimBotsConfig,
  VimBotsDifficulty,
  VimBoardPreset,
  VimBotsBoardSource,
} from '../engine/VimBotsEngine'
import { getSizedFile } from '../files/index'
import type { Language } from '../engine/types'
import { CHALLENGE_CONFIG_DEFAULTS } from '../engine/types'
import { STORAGE_KEYS, loadStoredConfig, saveStoredConfig } from '../engine/storageKeys'
import {
  SetupPageShell,
  CollapseSection,
  StartButton,
  ReplayButton,
  LanguageGrid,
  ChallengeToggleSection,
  UnifiedChallengeOptions,
  cls,
  patchReducer,
  toggleCategory,
} from './SetupPrimitives'
import { MOTION_CHALLENGE_CATEGORIES } from '../hooks/useMotionRace'
import { ArrowLeft as _ArrowLeft, Zap, Shield, Cpu, Zap as ZapIcon, FileCode } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

export type VimBotsSetupState = VimBotsConfig

// ── Constants ─────────────────────────────────────────────────────────────────

const PRESET_OPTIONS: { id: VimBoardPreset; label: string; desc: string }[] = [
  { id: 'tiny', label: 'Tiny', desc: '20 × 60' },
  { id: 'small', label: 'Small', desc: '40 × 100' },
  { id: 'medium', label: 'Medium', desc: '60 × 140' },
  { id: 'large', label: 'Large', desc: '100 × 200' },
  { id: 'xlarge', label: 'XLarge', desc: '150 × 280' },
  { id: 'custom', label: 'Custom', desc: 'set rows & cols' },
]

const CODE_SIZE_OPTIONS: { id: 'short' | 'medium' | 'long'; label: string }[] = [
  { id: 'short', label: 'Short (~20 lines)' },
  { id: 'medium', label: 'Medium (~60 lines)' },
  { id: 'long', label: 'Long (~150 lines)' },
]

const DIFFICULTY_OPTIONS: { id: VimBotsDifficulty; label: string; desc: string; pct: string }[] = [
  {
    id: 'beginner',
    label: 'Beginner',
    desc: 'Very few robots, plenty of room to learn',
    pct: '~2%',
  },
  { id: 'easy', label: 'Easy', desc: 'Light opposition — good for warming up', pct: '~10%' },
  { id: 'medium', label: 'Medium', desc: 'Balanced challenge — the default', pct: '~20%' },
  { id: 'hard', label: 'Hard', desc: 'Dense horde — high strategic pressure', pct: '~40%' },
  {
    id: 'expert',
    label: 'Expert',
    desc: 'Near-total occupation — survive if you can',
    pct: '~70%',
  },
]

const DIFFICULTY_INDEX: Record<VimBotsDifficulty, number> = {
  beginner: 0,
  easy: 1,
  medium: 2,
  hard: 3,
  expert: 4,
}

const DIFFICULTY_BY_INDEX = ['beginner', 'easy', 'medium', 'hard', 'expert'] as VimBotsDifficulty[]

export const VIMBOTS_SETUP_DEFAULT: VimBotsSetupState = {
  boardSource: 'grid',
  gridPreset: 'medium',
  customRows: 50,
  customCols: 70,
  codeFileSize: 'medium',
  difficulty: 'easy',
  enableTeleport: true,
  enableSafeTeleport: true,
  maxTeleports: 5,
  maxSafeTeleports: 2,
  animatedEffects: true,
  enableHelperGrid: false,
  startingEnemyLevel: 1,
  ...CHALLENGE_CONFIG_DEFAULTS,
  challengeCategories: MOTION_CHALLENGE_CATEGORIES,
}

// ── Grid content loading ──────────────────────────────────────────────────────

export function buildGridContent(
  boardSource: VimBotsBoardSource,
  gridPreset: VimBoardPreset,
  customRows: number,
  customCols: number,
  codeFileSize: 'short' | 'medium' | 'long'
): string {
  if (boardSource === 'grid') {
    const dims =
      gridPreset === 'custom'
        ? { rows: customRows, cols: customCols }
        : getPresetDimensions(gridPreset)
    return generateGrid(dims.rows, dims.cols)
  }
  return getSizedFile(boardSource as Language, codeFileSize)
}

// ── Storage helpers ───────────────────────────────────────────────────────────

function loadLastVimBotsConfig(): VimBotsSetupState | null {
  return loadStoredConfig<VimBotsSetupState>(STORAGE_KEYS.LAST_VIMBOTS_CONFIG)
}

function saveLastVimBotsConfig(s: VimBotsSetupState): void {
  saveStoredConfig(STORAGE_KEYS.LAST_VIMBOTS_CONFIG, s)
}

// ── Summary helper ────────────────────────────────────────────────────────────

function summariseConfig(s: VimBotsSetupState): string {
  const board =
    s.boardSource === 'grid'
      ? s.gridPreset === 'custom'
        ? `${s.customRows}×${s.customCols}`
        : s.gridPreset
      : `${s.boardSource} ${s.codeFileSize}`
  return `${board} · ${s.difficulty}`
}

// ── VimBotsSetup ──────────────────────────────────────────────────────────────

interface VimBotsSetupProps {
  onStart: (config: VimBotsConfig, gridContent: string) => void
  onBack: () => void
}

export function VimBotsSetup({ onStart, onBack: _onBack }: VimBotsSetupProps) {
  const [lastSaved] = useState(() => loadLastVimBotsConfig())
  const [s, dispatch] = useReducer(
    patchReducer<VimBotsSetupState>,
    lastSaved ?? VIMBOTS_SETUP_DEFAULT
  )
  const set = (payload: Partial<VimBotsSetupState>) => dispatch({ type: 'PATCH', payload })

  function handleStart(state: VimBotsSetupState = s) {
    const config: VimBotsConfig = {
      boardSource: state.boardSource,
      gridPreset: state.gridPreset,
      customRows: state.customRows,
      customCols: state.customCols,
      codeFileSize: state.codeFileSize,
      difficulty: state.difficulty,
      enableTeleport: state.enableTeleport,
      enableSafeTeleport: state.enableSafeTeleport,
      maxTeleports: state.maxTeleports,
      maxSafeTeleports: state.maxSafeTeleports,
      animatedEffects: state.animatedEffects,
      enableHelperGrid: state.enableHelperGrid,
      startingEnemyLevel: state.startingEnemyLevel,
      challengeMode: state.challengeMode,
      challengeGuidedMode: state.challengeGuidedMode,
      challengeStartingLevel: state.challengeStartingLevel,
      challengeRepetition: state.challengeRepetition,
      challengeTimeMultiplier: state.challengeTimeMultiplier,
      challengeCategories: state.challengeCategories,
      challengeDrillMode: state.challengeDrillMode,
    }
    saveLastVimBotsConfig(state)
    const gridContent = buildGridContent(
      config.boardSource,
      config.gridPreset,
      config.customRows,
      config.customCols,
      config.codeFileSize
    )
    onStart(config, gridContent)
  }

  const isCodeSource = s.boardSource !== 'grid'
  const presetDims = s.gridPreset !== 'custom' ? getPresetDimensions(s.gridPreset) : null

  return (
    <SetupPageShell
      title="VimBots"
      subtitle="Dodge robots using Vim cursor motions — lure them into each other to destroy them"
      actions={
        <div className="space-y-3">
          <StartButton onClick={() => handleStart()} />
          {lastSaved && (
            <ReplayButton
              onClick={() => handleStart(lastSaved)}
              summary={summariseConfig(lastSaved)}
            />
          )}
        </div>
      }
    >
      {/* ── Board ───────────────────────────────────────────────────── */}
      <CollapseSection
        label="Board"
        icon={FileCode}
        defaultOpen={true}
        badge={s.boardSource === 'grid' ? 'alphanumeric grid' : s.boardSource}
      >
        {/* Tab bar */}
        <div className="flex border-b border-gray-700 mb-4 -mx-0">
          <button
            type="button"
            onClick={() => set({ boardSource: 'grid' })}
            className={`px-4 py-2 text-sm font-mono font-bold border-b-2 -mb-px transition-colors ${
              s.boardSource === 'grid'
                ? 'border-blue-500 text-blue-300'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            Alphanumeric grid
          </button>
          <button
            type="button"
            onClick={() =>
              set({ boardSource: s.boardSource === 'grid' ? 'typescript' : s.boardSource })
            }
            className={`px-4 py-2 text-sm font-mono font-bold border-b-2 -mb-px transition-colors ${
              s.boardSource !== 'grid'
                ? 'border-blue-500 text-blue-300'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            Code file
          </button>
        </div>

        {/* Tab: Alphanumeric grid */}
        {!isCodeSource && (
          <div className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              {PRESET_OPTIONS.map(o => (
                <button
                  key={o.id}
                  onClick={() => set({ gridPreset: o.id })}
                  className={cls.pill(s.gridPreset === o.id)}
                >
                  <span className="font-bold">{o.label}</span>
                  <span className="ml-1 opacity-60">{o.desc}</span>
                </button>
              ))}
            </div>

            {s.gridPreset !== 'custom' && presetDims && (
              <p className="text-xs text-gray-600 font-mono">
                {presetDims.rows} rows × {presetDims.cols} cols —{' '}
                {presetDims.rows * presetDims.cols} cells
              </p>
            )}

            {s.gridPreset === 'custom' && (
              <div className="flex items-center gap-3 mt-2">
                <label className="text-xs text-gray-400">Rows</label>
                <input
                  type="number"
                  min={5}
                  max={300}
                  value={s.customRows}
                  onChange={e =>
                    set({ customRows: Math.max(5, Math.min(300, Number(e.target.value))) })
                  }
                  className="w-20 px-2 py-1.5 rounded border border-gray-700 bg-gray-800 text-gray-300 text-sm font-mono text-center focus:outline-none focus:border-blue-500"
                />
                <label className="text-xs text-gray-400">Cols</label>
                <input
                  type="number"
                  min={5}
                  max={300}
                  value={s.customCols}
                  onChange={e =>
                    set({ customCols: Math.max(5, Math.min(300, Number(e.target.value))) })
                  }
                  className="w-20 px-2 py-1.5 rounded border border-gray-700 bg-gray-800 text-gray-300 text-sm font-mono text-center focus:outline-none focus:border-blue-500"
                />
                <span className="text-xs text-gray-600 font-mono">
                  = {s.customRows * s.customCols} cells
                </span>
              </div>
            )}
          </div>
        )}

        {/* Tab: Code file */}
        {isCodeSource && (
          <div className="space-y-3">
            <LanguageGrid
              value={s.boardSource as Language}
              onChange={lang => set({ boardSource: lang })}
            />
            <div className="flex gap-2 flex-wrap mt-1">
              {CODE_SIZE_OPTIONS.map(o => (
                <button
                  key={o.id}
                  onClick={() => set({ codeFileSize: o.id })}
                  className={cls.pill(s.codeFileSize === o.id)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </CollapseSection>

      {/* ── Difficulty ───────────────────────────────────────────────── */}
      <CollapseSection
        label="Difficulty"
        icon={Cpu}
        defaultOpen={true}
        badge={`${DIFFICULTY_OPTIONS[DIFFICULTY_INDEX[s.difficulty]]?.label} (${DIFFICULTY_OPTIONS[DIFFICULTY_INDEX[s.difficulty]]?.pct})`}
      >
        <div className="space-y-3">
          <input
            type="range"
            min={0}
            max={4}
            step={1}
            value={DIFFICULTY_INDEX[s.difficulty]}
            onChange={e => set({ difficulty: DIFFICULTY_BY_INDEX[Number(e.target.value)] })}
            className="w-full accent-red-500"
          />
          <div className="flex justify-between text-gray-600 text-xs -mt-1">
            {DIFFICULTY_OPTIONS.map(o => (
              <span key={o.id} className={s.difficulty === o.id ? 'text-white font-bold' : ''}>
                {o.label}
              </span>
            ))}
          </div>
          {(() => {
            const opt = DIFFICULTY_OPTIONS[DIFFICULTY_INDEX[s.difficulty]]
            return opt ? (
              <div className="bg-gray-800/60 border border-gray-700 rounded p-2.5 text-xs font-mono">
                <span className="text-white font-bold">{opt.label}</span>
                <span className="text-gray-500 ml-1">{opt.pct} of cells</span>
                <p className="text-gray-400 mt-1">{opt.desc}</p>
              </div>
            ) : null
          })()}
        </div>
      </CollapseSection>

      {/* ── Teleport ─────────────────────────────────────────────────── */}
      <CollapseSection label="Teleport" icon={ZapIcon} defaultOpen={false}>
        <p className="text-xs text-gray-500 mb-3">
          Random teleport lands anywhere (may be dangerous). Safe teleport guarantees no adjacent
          hazards but is more limited.
        </p>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={s.enableTeleport}
              onChange={e => set({ enableTeleport: e.target.checked })}
              className="accent-indigo-500"
            />
            <span className="text-sm text-gray-300">Enable random teleport</span>
          </label>
          {s.enableTeleport && (
            <div className="ml-6 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400">Max per level:</span>
              <div className="flex gap-1 flex-wrap">
                {[1, 3, 5, 8, 10].map(n => (
                  <button
                    key={n}
                    onClick={() => set({ maxTeleports: n })}
                    className={cls.pill(s.maxTeleports === n)}
                  >
                    {n}
                  </button>
                ))}
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={s.maxTeleports}
                  onChange={e => {
                    const v = Math.max(1, Math.min(99, Number(e.target.value)))
                    if (!isNaN(v)) set({ maxTeleports: v })
                  }}
                  className="w-16 px-2 py-1.5 rounded border border-gray-700 bg-gray-800 text-gray-300 text-sm font-mono text-center focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={s.enableSafeTeleport}
              onChange={e => set({ enableSafeTeleport: e.target.checked })}
              className="accent-teal-500"
            />
            <span className="text-sm text-gray-300">Enable safe teleport</span>
          </label>
          {s.enableSafeTeleport && (
            <div className="ml-6 flex items-center gap-2">
              <span className="text-xs text-gray-400">Max per level:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => set({ maxSafeTeleports: n })}
                    className={cls.pill(s.maxSafeTeleports === n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </CollapseSection>

      {/* ── Visual Effects ──────────────────────────────────────────── */}
      <CollapseSection
        label="Visual Effects"
        icon={Zap}
        defaultOpen={false}
        badge={s.animatedEffects ? 'on' : 'off'}
      >
        <button
          type="button"
          onClick={() => set({ animatedEffects: !s.animatedEffects })}
          className={`w-full py-2.5 px-3 rounded border text-sm font-mono transition-colors text-left ${
            s.animatedEffects
              ? 'bg-green-800 border-green-600 text-white font-bold'
              : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
          }`}
        >
          {s.animatedEffects ? '✓ Animations enabled' : '○ Animations disabled'}
          <span
            className={`text-xs font-normal ml-2 ${s.animatedEffects ? 'text-green-300' : 'text-gray-600'}`}
          >
            {s.animatedEffects
              ? 'Fire cycles colour; robots pulse by speed'
              : 'Static colours, no animation'}
          </span>
        </button>
      </CollapseSection>

      {/* ── Helper Grid ─────────────────────────────────────────────── */}
      <CollapseSection
        label="Helper Grid"
        icon={Shield}
        defaultOpen={false}
        badge={s.enableHelperGrid ? 'on' : 'off'}
      >
        <p className="text-xs text-gray-500 mb-3">
          Highlights every cell that is safe to move to. Beginner and Easy start with a few uses;
          Hard and Expert start with none but gain one every few levels.
        </p>
        <button
          type="button"
          onClick={() => set({ enableHelperGrid: !s.enableHelperGrid })}
          className={`w-full py-2.5 px-3 rounded border text-sm font-mono transition-colors text-left ${
            s.enableHelperGrid
              ? 'bg-teal-800 border-teal-600 text-white font-bold'
              : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
          }`}
        >
          {s.enableHelperGrid ? '✓ Helper grid enabled' : '○ Helper grid disabled'}
          <span
            className={`text-xs font-normal ml-2 ${s.enableHelperGrid ? 'text-teal-300' : 'text-gray-600'}`}
          >
            {s.enableHelperGrid
              ? 'Safe cells shown as teal highlights'
              : 'Enable for safe-cell hints'}
          </span>
        </button>
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
            set({ challengeCategories: toggleCategory(s.challengeCategories, cat) })
          }
          drillMode={s.challengeDrillMode}
          onDrillMode={v => set({ challengeDrillMode: v })}
        />
      </ChallengeToggleSection>

      {/* ── Starting Enemy Level ─────────────────────────────────────── */}
      <CollapseSection
        label="Starting Enemy Level"
        icon={Cpu}
        defaultOpen={false}
        badge={s.startingEnemyLevel === 1 ? 'default' : `tier ${s.startingEnemyLevel}`}
      >
        <p className="text-xs text-gray-500 mb-3">
          Which enemy tier appears from the very first level. Useful for debugging or spicing up a
          run. New tiers unlock every 2 levels normally.
        </p>
        <div className="flex gap-2 flex-wrap">
          {[
            { level: 1, label: 'Borg only', desc: 'tier 1' },
            { level: 3, label: 'Borg + Reaper', desc: 'tier 3' },
            { level: 5, label: '+ Phantom', desc: 'tier 5' },
            { level: 7, label: '+ Inferno', desc: 'tier 7' },
            { level: 9, label: '+ Decimator', desc: 'tier 9' },
          ].map(o => (
            <button
              key={o.level}
              type="button"
              onClick={() => set({ startingEnemyLevel: o.level })}
              className={cls.pill(s.startingEnemyLevel === o.level)}
            >
              <span className="font-bold">{o.label}</span>
              <span className="ml-1 opacity-60">{o.desc}</span>
            </button>
          ))}
        </div>
      </CollapseSection>
    </SetupPageShell>
  )
}
