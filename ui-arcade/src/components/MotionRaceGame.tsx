import { useState, useEffect, useCallback, useRef, useReducer } from 'react'
import type React from 'react'
import { useMotionRace } from '../hooks/useMotionRace'
import type {
  MotionRaceConfig,
  CompletedPath,
  DistanceMode,
  GoalDisplayMode,
  EndGoalType,
  EnemySpeed,
} from '../hooks/useMotionRace'
import { MOTION_CHALLENGE_CATEGORIES } from '../hooks/useMotionRace'
import type { Language } from '../engine/types'
import { STORAGE_KEYS } from '../engine/storageKeys'
import { TopBar } from './TopBar'
import {
  LanguageGrid,
  CollapseSection,
  SetupPageShell,
  ChallengeToggleSection,
  UnifiedChallengeOptions,
  cls,
  StartButton,
  ReplayButton,
} from './SetupPrimitives'
import type { GuidedMode, RepetitionLevel } from '../engine/types'
import {
  Globe,
  Target,
  Hash,
  Users,
  Timer,
  Map,
  Waves,
  Bot,
  Sliders,
  ArrowLeft,
  Zap,
  Skull,
  Trophy,
  Flame,
  EyeOff,
  Eye,
  Snowflake,
  Sparkles,
  AlertCircle,
  Check,
  Link,
  Shuffle,
} from 'lucide-react'

// ── Constants ─────────────────────────────────────────────────────────────────

const COUNT_OPTIONS = [3, 5, 10, 15, 20, 30]

const DURATION_OPTIONS: { label: string; ms: number }[] = [
  { label: '1 min', ms: 60_000 },
  { label: '2 min', ms: 120_000 },
  { label: '5 min', ms: 300_000 },
  { label: '10 min', ms: 600_000 },
]

const DIST_LABELS: { id: DistanceMode; label: string; desc: string }[] = [
  { id: 'short', label: 'Short', desc: 'Stay nearby (≤8 lines)' },
  { id: 'medium', label: 'Medium', desc: 'Mid-range (9–25 lines)' },
  { id: 'long', label: 'Long', desc: 'Far away (26+ lines)' },
  { id: 'mixed', label: 'Mixed', desc: 'Mostly short, occasional long' },
]

const GOAL_DISPLAY_OPTIONS: { id: GoalDisplayMode; label: string; desc: string }[] = [
  { id: 'next', label: 'Next only', desc: 'One goal at a time' },
  { id: 'all', label: 'All at once', desc: 'Multiple visible, collect any order' },
]

const END_GOAL_OPTIONS: {
  id: EndGoalType
  icon: React.ElementType
  label: string
  desc: string
}[] = [
  { id: 'timed', icon: Timer, label: 'Timed', desc: 'Play until time runs out' },
  { id: 'user_count', icon: Hash, label: 'Count (you)', desc: 'Collect N goals yourself' },
  { id: 'total_count', icon: Users, label: 'Count (all)', desc: 'N goals total — yours + enemies' },
  {
    id: 'survival',
    icon: Skull,
    label: 'Survival',
    desc: 'Survive — hitting any trail ends the game',
  },
]

// Matches hues in enemy-trails.scss $enemy-hues map
const ENEMY_PALETTE_COLORS = [
  'hsl(30,90%,58%)', // 0 orange
  'hsl(0,90%,58%)', // 1 red
  'hsl(280,90%,68%)', // 2 violet (lightened for dark bg)
  'hsl(185,90%,50%)', // 3 cyan
  'hsl(330,90%,65%)', // 4 pink
  'hsl(90,85%,52%)', // 5 lime
]

const ENEMY_COUNT_OPTIONS: (0 | 1 | 3 | 5 | 10)[] = [0, 1, 3, 5, 10]
const ENEMY_SPEED_OPTIONS: { id: EnemySpeed; label: string }[] = [
  { id: 'slow', label: 'Slow' },
  { id: 'medium', label: 'Medium' },
  { id: 'fast', label: 'Fast' },
  { id: 'mixed', label: 'Mixed' },
]

// ── Last-config persistence ───────────────────────────────────────────────────

function loadLastMotionConfig(): MotionRaceConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LAST_MOTION_CONFIG)
    return raw ? (JSON.parse(raw) as MotionRaceConfig) : null
  } catch {
    return null
  }
}
function saveLastMotionConfig(config: MotionRaceConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_MOTION_CONFIG, JSON.stringify(config))
  } catch {
    /* ignore */
  }
}

// ── Setup reducer ─────────────────────────────────────────────────────────────

type MotionSetupState = {
  lang: Language
  endGoal: EndGoalType
  count: number
  durationMs: number
  startFromPrev: boolean
  distMode: DistanceMode
  goalDisplay: GoalDisplayMode
  multiGoalCount: number
  snakeTrail: boolean
  enemyCount: 0 | 1 | 3 | 5 | 10
  enemyTrail: boolean
  enemySpeed: EnemySpeed
  snowEffect: boolean
  opacityFade: boolean
  confettiOnGoal: boolean
  penaltyFlash: boolean
  hjklOnly: boolean
  noHjkl: boolean
  fogOfWar: boolean
  enemyMultiColor: boolean
  showMinimap: boolean
  challengeMode: boolean
  challengeGuidedMode: GuidedMode
  challengeStartingLevel: number
  challengeRepetition: RepetitionLevel
  challengeTimeMultiplier: number
  challengeCategories: string[]
  challengeDrillMode: boolean
  padEmptyLines: boolean
  startAtFirstLine: boolean
  solidTrails: boolean
  trailLengthMultiplier: number | 'infinite'
  enemyTrailSolid: boolean
  enemyTrailMultiplier: number | 'infinite'
}

const MOTION_SETUP_DEFAULT: MotionSetupState = {
  lang: 'typescript',
  endGoal: 'timed',
  count: 10,
  durationMs: 60_000,
  startFromPrev: true,
  distMode: 'mixed',
  goalDisplay: 'next',
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
  challengeGuidedMode: 'none',
  challengeStartingLevel: 0,
  challengeRepetition: 1,
  challengeTimeMultiplier: 1,
  challengeCategories: MOTION_CHALLENGE_CATEGORIES,
  challengeDrillMode: false,
  padEmptyLines: true,
  startAtFirstLine: true,
  solidTrails: true,
  trailLengthMultiplier: 1,
  enemyTrailSolid: true,
  enemyTrailMultiplier: 1,
}

type MotionSetupAction = { type: 'PATCH'; payload: Partial<MotionSetupState> }

function motionSetupReducer(state: MotionSetupState, action: MotionSetupAction): MotionSetupState {
  const next = { ...state, ...action.payload }
  if (
    (next.endGoal === 'user_count' || next.endGoal === 'total_count') &&
    next.multiGoalCount > 0 &&
    next.multiGoalCount > next.count
  ) {
    next.multiGoalCount = next.count
  }
  return next
}

// ── Setup screen ──────────────────────────────────────────────────────────────

interface SetupProps {
  onStart: (config: MotionRaceConfig) => void
  onBack: () => void
}

function MotionRaceSetup({ onStart, onBack: _onBack }: SetupProps) {
  const [s, dispatch] = useReducer(motionSetupReducer, MOTION_SETUP_DEFAULT)
  const set = (payload: Partial<MotionSetupState>) => dispatch({ type: 'PATCH', payload })

  const lastConfig = loadLastMotionConfig()

  const hasEnemies = s.enemyCount > 0

  function handleStart() {
    const configObj: MotionRaceConfig = {
      language: s.lang,
      endGoal: s.endGoal,
      targetCount: s.count,
      durationMs: s.durationMs,
      startFromPrevious: s.startFromPrev,
      distanceMode: s.distMode,
      goalDisplayMode: s.goalDisplay,
      multiGoalCount: s.multiGoalCount === 0 ? s.count : s.multiGoalCount,
      snakeTrail: s.snakeTrail,
      enemyCount: s.enemyCount,
      enemyTrail: hasEnemies && s.enemyTrail,
      enemySpeed: s.enemySpeed,
      snowEffect: s.snowEffect,
      opacityFade: s.opacityFade,
      confettiOnGoal: s.confettiOnGoal,
      penaltyFlash: s.penaltyFlash,
      hjklOnly: s.hjklOnly && !s.noHjkl,
      noHjkl: s.noHjkl && !s.hjklOnly,
      fogOfWar: hasEnemies && s.fogOfWar,
      enemyMultiColor: s.enemyMultiColor,
      showMinimap: s.showMinimap,
      challengeMode: s.challengeMode,
      challengeCategories: s.challengeCategories,
      challengeGuidedMode: s.challengeGuidedMode,
      challengeStartingLevel: s.challengeStartingLevel,
      challengeRepetition: s.challengeRepetition,
      challengeTimeMultiplier: s.challengeTimeMultiplier,
      challengeDrillMode: s.challengeDrillMode,
      padEmptyLines: s.padEmptyLines,
      startAtFirstLine: s.startAtFirstLine,
      solidTrails: s.solidTrails,
      trailLengthMultiplier: s.trailLengthMultiplier,
      enemyTrailSolid: s.enemyTrailSolid,
      enemyTrailMultiplier: s.enemyTrailMultiplier,
    }
    saveLastMotionConfig(configObj)
    onStart(configObj)
  }

  const activeHandicapCount = [
    s.snowEffect,
    s.opacityFade,
    s.confettiOnGoal,
    s.penaltyFlash,
    s.hjklOnly,
    s.noHjkl,
    s.solidTrails && s.endGoal !== 'survival',
  ].filter(Boolean).length

  const countOrDurationLabel =
    s.endGoal === 'total_count'
      ? 'Total goals to reach'
      : s.endGoal === 'user_count'
        ? 'Number of goals'
        : 'Duration'

  return (
    <SetupPageShell
      title="Motion Race"
      subtitle="Navigate to highlighted positions — pure vim movement"
      actions={
        <div className="flex flex-col gap-2">
          <StartButton onClick={handleStart} />
          {lastConfig && (
            <ReplayButton
              onClick={() => onStart(lastConfig)}
              summary={`${lastConfig.endGoal} · ${lastConfig.language} · ${lastConfig.distanceMode}`}
            />
          )}
        </div>
      }
    >
      {/* Language */}
      <CollapseSection label="Language" icon={Globe} defaultOpen={true}>
        <LanguageGrid value={s.lang} onChange={v => set({ lang: v })} />
      </CollapseSection>

      {/* End Condition */}
      <CollapseSection label="End Condition" icon={Target} defaultOpen={true}>
        <div className="flex gap-2 flex-col">
          {END_GOAL_OPTIONS.map(o => (
            <button
              key={o.id}
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

      {/* Count or Duration */}
      {(s.endGoal === 'user_count' || s.endGoal === 'total_count') && (
        <CollapseSection label={countOrDurationLabel} icon={Hash} defaultOpen={true}>
          <div className="flex gap-2 flex-wrap">
            {COUNT_OPTIONS.map(n => (
              <button key={n} onClick={() => set({ count: n })} className={cls.pill(s.count === n)}>
                {n}
              </button>
            ))}
          </div>
        </CollapseSection>
      )}

      {s.endGoal === 'timed' && (
        <CollapseSection label="Duration" icon={Timer} defaultOpen={true}>
          <div className="flex gap-2 flex-wrap">
            {DURATION_OPTIONS.map(d => (
              <button
                key={d.ms}
                onClick={() => set({ durationMs: d.ms })}
                className={cls.pill(s.durationMs === d.ms)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </CollapseSection>
      )}

      {/* Goal Options */}
      <CollapseSection label="Goal Options" icon={Map} defaultOpen={true}>
        {/* Distance mode */}
        <p className="text-xs text-gray-500 mb-1.5">Distance</p>
        <div className="flex gap-2 flex-wrap mb-4">
          {DIST_LABELS.map(d => (
            <button
              key={d.id}
              onClick={() => set({ distMode: d.id })}
              className={cls.modeCard(s.distMode === d.id)}
            >
              <div className="font-bold">{d.label}</div>
              <div
                className={`text-xs font-normal mt-0.5 ${s.distMode === d.id ? 'text-blue-200' : 'text-gray-500'}`}
              >
                {d.desc}
              </div>
            </button>
          ))}
        </div>

        {/* Goal display */}
        <p className="text-xs text-gray-500 mb-1.5">Goal Display</p>
        <div className="flex gap-2 flex-wrap mb-3">
          {GOAL_DISPLAY_OPTIONS.map(o => (
            <button
              key={o.id}
              onClick={() => set({ goalDisplay: o.id })}
              className={cls.modeCard(s.goalDisplay === o.id)}
            >
              {o.label}
              <div
                className={`text-xs font-normal mt-0.5 ${s.goalDisplay === o.id ? 'text-blue-200' : 'text-gray-500'}`}
              >
                {o.desc}
              </div>
            </button>
          ))}
        </div>
        {s.goalDisplay === 'all' && (
          <div className="mt-2 flex items-center gap-2 mb-3">
            <span className="text-xs text-gray-400">Simultaneous goals:</span>
            {[2, 3, 4, 5]
              .filter(n => !(s.endGoal === 'user_count' || s.endGoal === 'total_count') || n <= s.count)
              .map(n => (
              <button
                key={n}
                onClick={() => set({ multiGoalCount: n })}
                className={cls.pill(s.multiGoalCount === n)}
              >
                {n}
              </button>
            ))}
            {(s.endGoal === 'user_count' || s.endGoal === 'total_count') && (
              <button
                onClick={() => set({ multiGoalCount: 0 })}
                className={cls.pill(s.multiGoalCount === 0)}
              >
                All
              </button>
            )}
          </div>
        )}

        {/* Start position */}
        <p className="text-xs text-gray-500 mb-1.5 mt-3">Initial start</p>
        <div className="flex gap-2 flex-wrap mb-4">
          {([true, false] as const).map(v => (
            <button
              key={String(v)}
              onClick={() => set({ startAtFirstLine: v })}
              className={cls.modeCard(s.startAtFirstLine === v)}
            >
              <span className="flex items-center gap-1.5 font-bold">
                {v ? 'Line 1' : 'Random position'}
              </span>
              <div
                className={`text-xs font-normal mt-0.5 ${s.startAtFirstLine === v ? 'text-blue-200' : 'text-gray-500'}`}
              >
                {v ? 'Start at top of file' : 'Start anywhere'}
              </div>
            </button>
          ))}
        </div>

        {s.goalDisplay === 'next' && (
          <>
            <p className="text-xs text-gray-500 mb-1.5">After first path</p>
            <div className="flex gap-2 flex-wrap">
              {([true, false] as const).map(v => (
                <button
                  key={String(v)}
                  onClick={() => set({ startFromPrev: v })}
                  className={cls.modeCard(s.startFromPrev === v)}
                >
                  <span className="flex items-center gap-1.5">
                    {v ? (
                      <>
                        <Link className="w-3.5 h-3.5" /> Continue from last
                      </>
                    ) : (
                      <>
                        <Shuffle className="w-3.5 h-3.5" /> Random each time
                      </>
                    )}
                  </span>
                  <div
                    className={`text-xs font-normal mt-0.5 ${s.startFromPrev === v ? 'text-blue-200' : 'text-gray-500'}`}
                  >
                    {v ? 'Chain paths' : 'Jump to fresh start'}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        <p className="text-xs text-gray-500 mb-1.5 mt-3">Editor behavior</p>
        <div className="flex gap-2 flex-wrap">
          {([true, false] as const).map(v => (
            <button
              key={String(v)}
              onClick={() => set({ padEmptyLines: v })}
              className={`${cls.pill(s.padEmptyLines === v)} flex items-center gap-1.5`}
            >
              {v ? 'Pad empty lines' : 'Original file content'}
            </button>
          ))}
        </div>
      </CollapseSection>

      {/* Snake Trail */}
      <CollapseSection label="Snake Trail" icon={Waves} defaultOpen={true}>
        <div className="flex gap-2 flex-wrap">
          {([true, false] as const).map(v => (
            <button
              key={String(v)}
              onClick={() => set({ snakeTrail: v })}
              className={`${cls.pill(s.snakeTrail === v)} flex items-center gap-1.5`}
            >
              <Waves className="w-3.5 h-3.5" />
              {v ? 'Trail on' : 'No trail'}
            </button>
          ))}
        </div>
        {s.snakeTrail && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-1.5">Trail length multiplier</p>
            <div className="flex gap-2 flex-wrap">
              {([1, 2, 3, 5, 10, 'infinite'] as const).map(v => (
                <button
                  key={String(v)}
                  onClick={() => set({ trailLengthMultiplier: v })}
                  className={cls.pill(s.trailLengthMultiplier === v)}
                >
                  {v === 'infinite' ? 'Infinite (Experimental)' : `${v}x`}
                </button>
              ))}
            </div>
          </div>
        )}
      </CollapseSection>

      {/* Enemies */}
      <CollapseSection label="Enemies" icon={Bot} defaultOpen={false}>
        <p className="text-xs text-gray-500 mb-1.5">Count</p>
        <div className="flex gap-2 flex-wrap mb-4">
          {ENEMY_COUNT_OPTIONS.map(n => (
            <button
              key={n}
              onClick={() => set({ enemyCount: n })}
              className={`px-4 py-2 rounded border text-sm font-mono transition-colors ${s.enemyCount === n ? 'bg-orange-700 border-orange-500 text-white font-bold' : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'}`}
            >
              {n === 0 ? 'None' : n}
            </button>
          ))}
        </div>
        <div className={s.enemyCount === 0 ? 'opacity-40 pointer-events-none' : ''}>
          <p className="text-xs text-gray-500 mb-1.5">Speed</p>
          <div className="flex gap-2 flex-wrap mb-4">
            {ENEMY_SPEED_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => set({ enemySpeed: opt.id })}
                className={cls.pill(s.enemySpeed === opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mb-1.5">Enemy trails</p>
          <div className="flex gap-2 flex-wrap mb-3">
            {([true, false] as const).map(v => (
              <button
                key={String(v)}
                onClick={() => set({ enemyTrail: v })}
                className={`${cls.pill(s.enemyTrail === v)} flex items-center gap-1.5`}
              >
                <Flame className="w-3.5 h-3.5" />
                {v ? 'Trails on' : 'No trails'}
              </button>
            ))}
          </div>
          {s.enemyTrail && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1.5">Enemy trail type</p>
              <div className="flex gap-2 flex-wrap mb-3">
                {([true, false] as const).map(v => (
                  <button
                    key={String(v)}
                    onClick={() => set({ enemyTrailSolid: v })}
                    className={cls.pill(s.enemyTrailSolid === v)}
                  >
                    {v ? 'Solid (Blocking)' : 'Decorative'}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mb-1.5">Enemy trail length multiplier</p>
              <div className="flex gap-2 flex-wrap mb-3">
                {([1, 2, 3, 5, 10, 'infinite'] as const).map(v => (
                  <button
                    key={String(v)}
                    onClick={() => set({ enemyTrailMultiplier: v })}
                    className={cls.pill(s.enemyTrailMultiplier === v)}
                  >
                    {v === 'infinite' ? 'Infinite' : `${v}x`}
                  </button>
                ))}
              </div>
            </div>
          )}
          <p className="text-xs text-gray-500 mb-1.5">Fog of war</p>
          <div className="flex gap-2 flex-wrap">
            {([true, false] as const).map(v => (
              <button
                key={String(v)}
                onClick={() => set({ fogOfWar: v })}
                className={`${cls.pill(s.fogOfWar === v)} flex items-center gap-1.5`}
              >
                {v ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" /> Hide enemies
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" /> Visible
                  </>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mb-1.5 mt-3">Enemy colors</p>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => set({ enemyMultiColor: true })}
              className={cls.pill(s.enemyMultiColor)}
            >
              {ENEMY_PALETTE_COLORS.slice(0, 4).map((c, i) => (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: c,
                    marginRight: '2px',
                    verticalAlign: 'middle',
                  }}
                />
              ))}{' '}
              Multi-color
            </button>
            <button
              onClick={() => set({ enemyMultiColor: false })}
              className={cls.pill(!s.enemyMultiColor)}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: ENEMY_PALETTE_COLORS[0],
                  marginRight: '4px',
                  verticalAlign: 'middle',
                }}
              />
              Single color
            </button>
          </div>
        </div>
      </CollapseSection>

      {/* Minimap */}
      <CollapseSection label="Minimap" icon={Map} defaultOpen={false}>
        <div className="flex gap-2 flex-wrap">
          {([true, false] as const).map(v => (
            <button
              key={String(v)}
              onClick={() => set({ showMinimap: v })}
              className={`${cls.pill(s.showMinimap === v)} flex items-center gap-1.5`}
            >
              {v ? (
                <>
                  <Map className="w-3.5 h-3.5" /> On
                </>
              ) : (
                <>
                  <Map className="w-3.5 h-3.5 opacity-40" /> Off
                </>
              )}
            </button>
          ))}
        </div>
      </CollapseSection>

      {/* Handicaps */}
      <CollapseSection
        label="Handicaps"
        icon={Sliders}
        defaultOpen={false}
        badge={
          activeHandicapCount > 0 ? (
            <span className="bg-yellow-800 text-yellow-300 text-xs px-1.5 py-0.5 rounded font-bold">
              {activeHandicapCount} active
            </span>
          ) : undefined
        }
      >
        <div className="space-y-2">
          {(s.snowEffect || s.confettiOnGoal) && (
            <p className="text-xs text-yellow-400 bg-yellow-900/30 border border-yellow-700 rounded px-2 py-1.5">
              Epilepsy warning: flashing / moving visuals enabled.
            </p>
          )}
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                {
                  key: 'snowEffect',
                  icon: Snowflake,
                  label: 'Snow',
                  desc: 'Snowflakes overlay',
                  value: s.snowEffect,
                  set: (v: boolean) => set({ snowEffect: v }),
                },
                {
                  key: 'opacityFade',
                  icon: Eye,
                  label: 'Opacity fade',
                  desc: 'Dims text far from cursor',
                  value: s.opacityFade,
                  set: (v: boolean) => set({ opacityFade: v }),
                },
                {
                  key: 'confettiOnGoal',
                  icon: Sparkles,
                  label: 'Confetti',
                  desc: 'Burst on goal collect',
                  value: s.confettiOnGoal,
                  set: (v: boolean) => set({ confettiOnGoal: v }),
                },
                {
                  key: 'penaltyFlash',
                  icon: AlertCircle,
                  label: 'Penalty flash',
                  desc: 'Red flash on enemy goal',
                  value: s.penaltyFlash,
                  set: (v: boolean) => set({ penaltyFlash: v }),
                },
                ...(s.endGoal !== 'survival' ? [{
                  key: 'solidTrails',
                  icon: Waves,
                  label: 'Solid trails',
                  desc: 'Trails block movement',
                  value: s.solidTrails,
                  set: (v: boolean) => set({ solidTrails: v }),
                }] : []),
              ] as const
            ).map(item => (
              <button
                key={item.key}
                onClick={() => item.set(!item.value)}
                className={`py-2.5 px-3 rounded border text-left text-sm font-mono transition-colors ${item.value ? 'bg-yellow-800 border-yellow-600 text-white font-bold' : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'}`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </div>
                <div
                  className={`text-xs font-normal mt-0.5 ${item.value ? 'text-yellow-300' : 'text-gray-500'}`}
                >
                  {item.desc}
                </div>
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-500 mt-1">Key restrictions (mutually exclusive):</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                set({ hjklOnly: !s.hjklOnly })
                if (!s.hjklOnly) set({ noHjkl: false })
              }}
              className={`py-2.5 px-3 rounded border text-left text-sm font-mono transition-colors ${s.hjklOnly ? 'bg-blue-700 border-blue-500 text-white font-bold' : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'}`}
            >
              <div className="font-bold">hjkl only</div>
              <div
                className={`text-xs font-normal mt-0.5 ${s.hjklOnly ? 'text-blue-200' : 'text-gray-500'}`}
              >
                Only basic moves allowed
              </div>
            </button>
            <button
              onClick={() => {
                set({ noHjkl: !s.noHjkl })
                if (!s.noHjkl) set({ hjklOnly: false })
              }}
              className={`py-2.5 px-3 rounded border text-left text-sm font-mono transition-colors ${s.noHjkl ? 'bg-red-800 border-red-600 text-white font-bold' : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'}`}
            >
              <div className="font-bold">No hjkl</div>
              <div
                className={`text-xs font-normal mt-0.5 ${s.noHjkl ? 'text-red-300' : 'text-gray-500'}`}
              >
                Must use word/search motions
              </div>
            </button>
          </div>
        </div>
      </CollapseSection>

      {/* Challenge Mode */}
      <ChallengeToggleSection
        enabled={s.challengeMode}
        onToggle={() => set({ challengeMode: !s.challengeMode })}
      >
        <p className="text-xs text-gray-500 mb-4">
          Earn bonus points by completing motion/search commands alongside navigation. Only cursor
          movement, search, marks, and folding commands — no editing required.
        </p>
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

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtMs(ms: number) {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  return m > 0 ? `${m}:${String(s % 60).padStart(2, '0')}` : `${s}s`
}

function fmtCountdown(remainMs: number) {
  const ms = Math.max(0, remainMs)
  const s = Math.ceil(ms / 1000)
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

function PathPill({ path, idx }: { path: CompletedPath; idx: number }) {
  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono border ${
        path.valid
          ? 'bg-green-900/30 border-green-800 text-green-300'
          : 'bg-red-900/30 border-red-800 text-red-400'
      }`}
    >
      <span className="text-gray-500">#{idx + 1}</span>
      <span>{path.keystrokes}k</span>
      <span className="text-gray-500">·</span>
      <span>{fmtMs(path.elapsedMs)}</span>
      {!path.valid && <span title="Text was modified">⚠</span>}
    </div>
  )
}

// ── Off-screen goal indicator ─────────────────────────────────────────────────

interface GoalIndicatorProps {
  goalLine: number
  isVisible: boolean
  getRange: () => { startLine: number; endLine: number } | null
}

function GoalIndicator({ goalLine, isVisible, getRange }: GoalIndicatorProps) {
  if (isVisible) return null
  const range = getRange()
  if (!range) return null
  const dir = goalLine < range.startLine ? '↑' : '↓'
  return (
    <div
      className={`absolute right-4 ${dir === '↑' ? 'top-2' : 'bottom-2'} z-20 pointer-events-none`}
    >
      <span className="bg-yellow-800/80 text-yellow-300 text-lg font-bold px-2 py-1 rounded shadow-lg border border-yellow-700">
        {dir} Goal
      </span>
    </div>
  )
}

// ── Game screen ───────────────────────────────────────────────────────────────

interface GameProps {
  config: MotionRaceConfig
  onQuit: () => void
}

function MotionRaceGameScreen({ config, onQuit }: GameProps) {
  const { state, editorRef, statusRef, startGame, getVisibleRange, totalLines } = useMotionRace()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    startGame(config)
  }, [])

  const [isGoalVisible, setIsGoalVisible] = useState(true)

  // Handicap effect state
  const [confettiActive, setConfettiActive] = useState(false)
  const [penaltyActive, setPenaltyActive] = useState(false)
  const prevUserScore = useRef(0)
  const prevEnemyScore = useRef(0)

  useEffect(() => {
    if (state.userScore > prevUserScore.current) setConfettiActive(true)
    prevUserScore.current = state.userScore
  }, [state.userScore])

  useEffect(() => {
    if (state.enemyScore > prevEnemyScore.current) setPenaltyActive(true)
    prevEnemyScore.current = state.enemyScore
  }, [state.enemyScore])

  useEffect(() => {
    if (!penaltyActive) return
    const id = setTimeout(() => setPenaltyActive(false), 800)
    return () => clearTimeout(id)
  }, [penaltyActive])

  const [collisionToast, setCollisionToast] = useState(0)

  useEffect(() => {
    if (state.lastCollision > 0) {
      setCollisionToast(state.lastCollision)
      const id = setTimeout(() => setCollisionToast(0), 1200)
      return () => clearTimeout(id)
    }
  }, [state.lastCollision])

  const checkVisibility = useCallback(() => {
    const range = getVisibleRange()
    if (!range || !state.goals.length) {
      setIsGoalVisible(true)
      return
    }
    const primary = state.goals[0]
    setIsGoalVisible(primary.lineNumber >= range.startLine && primary.lineNumber <= range.endLine)
  }, [getVisibleRange, state.goals])

  useEffect(() => {
    checkVisibility()
  }, [checkVisibility])

  const {
    goals,
    currentPos,
    keystrokes,
    contentValid,
    completedPaths,
    totalElapsedMs,
    pathElapsedMs,
    userScore,
    enemyScore,
  } = state

  const isResults = state.status === 'results'
  const primaryGoal = goals[0]
  const atTarget =
    !isResults && primaryGoal
      ? currentPos.lineNumber === primaryGoal.lineNumber && currentPos.column === primaryGoal.column
      : false
  const remainMs =
    config.endGoal === 'timed' ? Math.max(0, config.durationMs - totalElapsedMs) : null
  const pathsDone = completedPaths.length
  const validCount = completedPaths.filter(p => p.valid).length

  // Results computed lazily (only used when isResults)
  const avgKeys =
    pathsDone > 0
      ? (completedPaths.reduce((a, p) => a + p.keystrokes, 0) / pathsDone).toFixed(1)
      : '—'
  const avgTime =
    pathsDone > 0 ? fmtMs(completedPaths.reduce((a, p) => a + p.elapsedMs, 0) / pathsDone) : '—'

  return (
    <div className="h-full bg-gray-900 flex flex-col overflow-hidden font-mono relative">
      {/* Collision Toast */}
      {collisionToast > 0 && !isResults && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-900/90 border-2 border-red-500 text-red-200 font-bold px-6 py-3 rounded-lg shadow-2xl z-50 pointer-events-none animate-pulse">
          Blocked by trail!
        </div>
      )}

      {/* Results overlay — glossy frosted glass over the editor */}
      {isResults && (
        <div className="absolute inset-0 z-40 backdrop-blur-sm bg-gray-900/80 flex flex-col items-center justify-center px-6">
          <div className="w-full max-w-lg bg-gray-900/90 border border-gray-600 rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-3">
                {state.endReason === 'survival' ? (
                  <Skull className="w-14 h-14 text-red-400" />
                ) : (
                  <Trophy className="w-14 h-14 text-yellow-400" />
                )}
              </div>
              <h2 className="text-3xl font-bold text-white mb-1">
                {state.endReason === 'survival' ? 'You hit a trail!' : 'Finished!'}
              </h2>
              <p className="text-gray-400 text-sm">{fmtMs(totalElapsedMs)} total</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4 text-center">
              <StatCard value={validCount} label="Your goals" color="text-green-400" />
              <StatCard value={avgKeys} label="Avg keys" color="text-blue-400" />
              <StatCard value={avgTime} label="Avg time" color="text-purple-400" />
            </div>

            {config.enemyCount > 0 && (
              <div className="text-center mb-4 text-orange-400 text-sm">
                Enemies scored: <span className="font-bold">{enemyScore}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-8 max-h-32 overflow-y-auto">
              {completedPaths.map((p, i) => (
                <PathPill key={i} path={p} idx={i} />
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => startGame(config)}
                className="w-full py-2.5 rounded bg-green-700 hover:bg-green-600 text-white font-bold text-sm transition-colors"
              >
                Play again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header — always visible */}
      <TopBar
        title="Motion Race"
        onBack={onQuit}
        backLabel={
          <>
            <ArrowLeft className="w-4 h-4" /> Quit
          </>
        }
      >
        {config.endGoal === 'timed' && remainMs !== null ? (
          <span
            className={`font-bold tabular-nums flex items-center gap-1 ${remainMs < 10_000 ? 'text-red-400' : 'text-blue-300'}`}
          >
            <Timer className="w-3.5 h-3.5" /> {fmtCountdown(remainMs)}
          </span>
        ) : (
          <span className="text-gray-400 tabular-nums">
            <span className="text-green-400 font-bold">{userScore}</span>
            {config.endGoal === 'user_count' && (
              <span className="text-gray-600"> / {config.targetCount}</span>
            )}
            {' goals'}
          </span>
        )}
        {config.enemyCount > 0 && (
          <span className="text-orange-400 tabular-nums text-xs">enemies: {enemyScore}</span>
        )}
        <span className="text-gray-500 tabular-nums">{fmtMs(pathElapsedMs)}</span>
        <span className="text-gray-500 tabular-nums">{keystrokes} keys</span>
      </TopBar>

      {/* Target bar */}
      <div
        className={`flex items-center gap-4 px-4 py-2.5 border-b flex-shrink-0 text-sm transition-colors ${
          !contentValid
            ? 'bg-red-900/40 border-red-700'
            : atTarget
              ? 'bg-green-900/40 border-green-700'
              : 'bg-gray-800 border-gray-700'
        }`}
      >
        {config.goalDisplayMode === 'next' && primaryGoal ? (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Goal</span>
            <kbd className="px-2 py-0.5 bg-yellow-900/60 border border-yellow-700 rounded text-xs text-yellow-300 font-bold">
              L{primaryGoal.lineNumber} C{primaryGoal.column}
            </kbd>
            <span className="text-gray-600 text-xs">
              #{pathsDone + 1}
              {config.endGoal === 'user_count' ? ` / ${config.targetCount}` : ''}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-gray-400 text-xs">Goals:</span>
            {goals.slice(0, 6).map((g, i) => (
              <kbd
                key={i}
                className="px-1.5 py-0.5 bg-yellow-900/60 border border-yellow-700 rounded text-xs text-yellow-300 font-bold"
              >
                L{g.lineNumber}C{g.column}
              </kbd>
            ))}
            {goals.length > 6 && <span className="text-gray-500 text-xs">+{goals.length - 6}</span>}
          </div>
        )}
        <div className="ml-auto flex items-center gap-3">
          {!contentValid && <span className="text-red-400 text-xs font-bold">⚠ Text modified</span>}
          {atTarget && contentValid && (
            <span className="text-green-400 text-xs font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> On target!
            </span>
          )}
          <span className="text-gray-500 text-xs tabular-nums">
            L{currentPos.lineNumber} C{currentPos.column}
          </span>
        </div>
      </div>

      {/* Challenge bar — shown when challenge mode is on and a challenge is active */}
      {config.challengeMode &&
        state.activeChallenge &&
        !isResults &&
        (() => {
          const ch = state.activeChallenge
          const gm = config.challengeGuidedMode ?? 'none'
          // Determine whether to show solution keys based on guided mode
          // For simplicity: 'all' always shows, 'none' never shows, others show
          const showSolution =
            gm === 'all' ||
            gm === 'first_only' ||
            gm === 'first_then_failure' ||
            gm === 'alternating'
          return (
            <div className="flex items-center gap-3 px-4 py-2 bg-indigo-950/60 border-b border-indigo-800 flex-shrink-0 text-xs font-mono">
              <Zap className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
              <span className="text-white">{ch.question}</span>
              {showSolution && (
                <div className="flex gap-1.5 ml-1">
                  {ch.solution.map((s, i) => (
                    <kbd
                      key={i}
                      className="px-1.5 py-0.5 bg-gray-700 text-yellow-300 rounded border border-gray-600"
                    >
                      {s}
                    </kbd>
                  ))}
                </div>
              )}
              <span className="ml-auto text-indigo-400 tabular-nums">+{state.challengeScore}</span>
            </div>
          )
        })()}

      {/* Editor + Minimap row — always mounted so Monaco stays alive through Play Again */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Editor area with overlays */}
        <div className="flex-1 relative min-w-0">
          <div ref={editorRef as React.RefObject<HTMLDivElement>} className="h-full" />
          {config.snowEffect && <SnowOverlay />}
          {config.confettiOnGoal && (
            <ConfettiOverlay isActive={confettiActive} onDone={() => setConfettiActive(false)} />
          )}
          {config.penaltyFlash && <PenaltyFlash isActive={penaltyActive} />}
          {config.opacityFade && (
            <OpacityFadeOverlay
              cursorLine={state.currentPos.lineNumber}
              getVisibleRange={getVisibleRange}
            />
          )}
          {primaryGoal && !isResults && (
            <GoalIndicator
              goalLine={primaryGoal.lineNumber}
              isVisible={isGoalVisible}
              getRange={getVisibleRange}
            />
          )}
        </div>

        {/* Minimap sidebar — enemies (orange) and goals (yellow), no trails */}
        {config.showMinimap && (
          <RaceMinimap
            totalLines={totalLines || 200}
            goals={state.goals}
            enemies={state.enemies}
            cursorLine={state.currentPos.lineNumber}
            visibleRange={getVisibleRange()}
          />
        )}
      </div>

      <div
        ref={statusRef as React.RefObject<HTMLDivElement>}
        className="h-7 bg-gray-800 border-t border-gray-700 px-3 flex items-center text-xs text-gray-400 flex-shrink-0"
      />

      {completedPaths.length > 0 && !isResults && (
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-t border-gray-700 flex-shrink-0 overflow-x-auto">
          {completedPaths.slice(-8).map((p, i) => (
            <PathPill
              key={i}
              path={p}
              idx={completedPaths.length - Math.min(8, completedPaths.length) + i}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({
  value,
  label,
  color,
}: {
  value: string | number
  label: string
  color: string
}) {
  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  )
}

// ── Visual effect components (handicaps) ─────────────────────────────────────

function SnowOverlay() {
  const [flakes] = useState(() =>
    Array.from({ length: 25 }, (_, i) => {
      const left = Math.floor(Math.random() * 100)
      const duration = 8 + Math.random() * 8
      const delay = -(Math.random() * 16)
      const fontSize = 10 + Math.floor(Math.random() * 5)
      const opacity = 0.4 + Math.random() * 0.4
      const char = Math.random() > 0.5 ? '❄' : '*'
      return { i, left, duration, delay, fontSize, opacity, char }
    })
  )

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    >
      {flakes.map(f => (
        <span
          key={f.i}
          className="snow-flake"
          style={{
            left: `${f.left}%`,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            fontSize: `${f.fontSize}px`,
            opacity: f.opacity,
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          {f.char}
        </span>
      ))}
    </div>
  )
}

const CONFETTI_COLORS = [
  '#f43f5e',
  '#fb923c',
  '#fbbf24',
  '#4ade80',
  '#60a5fa',
  '#c084fc',
  '#f472b6',
]

interface ConfettiOverlayProps {
  isActive: boolean
  onDone: () => void
}

function ConfettiOverlay({ isActive, onDone }: ConfettiOverlayProps) {
  useEffect(() => {
    if (!isActive) return
    const id = setTimeout(onDone, 1500)
    return () => clearTimeout(id)
  }, [isActive, onDone])

  if (!isActive) return null

  const pieces = Array.from({ length: 30 }, (_, i) => {
    const left = Math.floor(Math.random() * 100)
    const top = Math.floor(Math.random() * 60)
    const rotation = Math.floor(Math.random() * 360)
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]
    const delay = Math.random() * 0.3
    return { i, left, top, rotation, color, delay }
  })

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 6,
        overflow: 'hidden',
      }}
    >
      {pieces.map(p => (
        <div
          key={p.i}
          style={
            {
              position: 'absolute',
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: '4px',
              height: '8px',
              background: p.color,
              '--r': `${p.rotation}deg`,
              animation: `confetti-fall 1.5s ease-out ${p.delay}s forwards`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

interface PenaltyFlashProps {
  isActive: boolean
}

function PenaltyFlash({ isActive }: PenaltyFlashProps) {
  if (!isActive) return null
  return (
    <div
      className="penalty-flash-anim"
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(220, 38, 38, 0.45)',
        pointerEvents: 'none',
        zIndex: 4,
      }}
    />
  )
}

interface OpacityFadeOverlayProps {
  cursorLine: number
  getVisibleRange: () => { startLine: number; endLine: number } | null
}

function OpacityFadeOverlay({ cursorLine, getVisibleRange }: OpacityFadeOverlayProps) {
  // We use useLayoutEffect or just calculate in render. 
  // However, getVisibleRange might change or become available after mount.
  // Since cursorLine changes on every move, a render calc is usually sufficient.
  let currentPct = 50
  const range = getVisibleRange()
  if (range) {
    const visibleLines = Math.max(1, range.endLine - range.startLine)
    currentPct = Math.round(((cursorLine - range.startLine) / visibleLines) * 100)
    currentPct = Math.max(0, Math.min(100, currentPct))
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 3,
        background: `radial-gradient(ellipse 80% 40% at 50% ${currentPct}%, transparent 0%, rgba(0,0,0,0.75) 100%)`,
      }}
    />
  )
}

// ── Minimap component ─────────────────────────────────────────────────────────

import type { Enemy } from '../hooks/useMotionRace'

interface MinimapProps {
  totalLines: number
  goals: { lineNumber: number; column: number }[]
  enemies: Enemy[]
  cursorLine: number
  visibleRange: { startLine: number; endLine: number } | null
}

function RaceMinimap({ totalLines, goals, enemies, cursorLine, visibleRange }: MinimapProps) {
  const pct = (line: number) => `${Math.round((line / Math.max(1, totalLines)) * 100)}%`

  return (
    <div className="w-12 flex-shrink-0 border-l border-gray-700 bg-gray-950 relative overflow-hidden select-none">
      {/* Viewport highlight */}
      {visibleRange && (
        <div
          className="absolute inset-x-0 bg-white/8 pointer-events-none"
          style={{
            top: pct(visibleRange.startLine),
            height: pct(visibleRange.endLine - visibleRange.startLine + 1),
          }}
        />
      )}

      {/* Goal positions — yellow diamonds */}
      {goals.map((g, i) => (
        <div
          key={`gm-${i}`}
          className="absolute w-2 h-2 bg-yellow-400 rotate-45 pointer-events-none"
          style={{
            top: pct(g.lineNumber),
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(45deg)',
          }}
        />
      ))}

      {/* Enemy positions — each with its palette hue */}
      {enemies.map(e => (
        <div
          key={`em-${e.id}`}
          className="absolute w-2 h-2 rounded-full pointer-events-none"
          style={{
            top: pct(e.pos.lineNumber),
            right: '6px',
            transform: 'translateY(-50%)',
            backgroundColor: ENEMY_PALETTE_COLORS[e.colorIdx % ENEMY_PALETTE_COLORS.length],
          }}
        />
      ))}

      {/* User cursor — blue circle */}
      <div
        className="absolute w-2.5 h-2.5 rounded-full bg-blue-400 pointer-events-none"
        style={{ top: pct(cursorLine), left: '6px', transform: 'translateY(-50%)' }}
      />

      {/* Label */}
      <div className="absolute bottom-1 inset-x-0 text-center text-gray-600 text-[9px] leading-none select-none">
        map
      </div>
    </div>
  )
}

// ── Public wrapper ────────────────────────────────────────────────────────────

export function MotionRaceWrapper({ onBack }: { onBack: () => void }) {
  const [config, setConfig] = useState<MotionRaceConfig | null>(null)

  if (!config) {
    return <MotionRaceSetup onStart={setConfig} onBack={onBack} />
  }

  return (
    <MotionRaceGameContainer
      config={config}
      onQuit={() => {
        setConfig(null)
      }}
      onBack={onBack}
    />
  )
}

function MotionRaceGameContainer({ config, onQuit, onBack }: GameProps & { onBack: () => void }) {
  return (
    <MotionRaceGameScreen
      config={config}
      onQuit={() => {
        onQuit()
        onBack()
      }}
    />
  )
}
