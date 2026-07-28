import { useReducer } from 'react'
import type React from 'react'
import type {
  MotionRaceConfig,
  DistanceMode,
  GoalDisplayMode,
  EndGoalType,
  EnemySpeed,
} from '../hooks/useMotionRace'
import { MOTION_CHALLENGE_CATEGORIES } from '../hooks/useMotionRace'
import type { Language, GuidedMode, RepetitionLevel } from '../engine/types'
import { STORAGE_KEYS, loadStoredConfig, saveStoredConfig } from '../engine/storageKeys'
import {
  LanguageGrid,
  CollapseSection,
  SetupPageShell,
  ChallengeToggleSection,
  UnifiedChallengeOptions,
  cls,
  StartButton,
  ReplayButton,
  toggleCategory,
} from './SetupPrimitives'
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
  Skull,
  Flame,
  EyeOff,
  Eye,
  Snowflake,
  Sparkles,
  AlertCircle,
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
export const ENEMY_PALETTE_COLORS = [
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

export function MotionRaceSetup({ onStart, onBack: _onBack }: SetupProps) {
  const [s, dispatch] = useReducer(motionSetupReducer, MOTION_SETUP_DEFAULT)
  const set = (payload: Partial<MotionSetupState>) => dispatch({ type: 'PATCH', payload })

  const lastConfig = loadStoredConfig<MotionRaceConfig>(STORAGE_KEYS.LAST_MOTION_CONFIG)

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
    saveStoredConfig(STORAGE_KEYS.LAST_MOTION_CONFIG, configObj)
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
              .filter(
                n => !(s.endGoal === 'user_count' || s.endGoal === 'total_count') || n <= s.count
              )
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
                ...(s.endGoal !== 'survival'
                  ? [
                      {
                        key: 'solidTrails',
                        icon: Waves,
                        label: 'Solid trails',
                        desc: 'Trails block movement',
                        value: s.solidTrails,
                        set: (v: boolean) => set({ solidTrails: v }),
                      },
                    ]
                  : []),
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
            set({ challengeCategories: toggleCategory(s.challengeCategories, cat) })
          }
          drillMode={s.challengeDrillMode}
          onDrillMode={v => set({ challengeDrillMode: v })}
        />
      </ChallengeToggleSection>
    </SetupPageShell>
  )
}
