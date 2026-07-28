import { useReducer } from 'react'
import type {
  QvimxConfig,
  QvimxBorderShape,
  QvimxCodeSize,
  QvimxSubMode,
  QvimxAILevel,
  QvimxBallSpeed,
} from '../hooks/useQvimx'
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
  patchReducer,
  toggleCategory,
} from './SetupPrimitives'
import {
  Globe,
  Timer,
  Heart,
  Bot,
  Layers,
  Circle,
  Maximize2,
  LayoutGrid,
  Shield,
} from 'lucide-react'

// ── Setup state ───────────────────────────────────────────────────────────────

export type QvimxSetupState = {
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

type QvimxSetupAction = { type: 'PATCH'; payload: Partial<QvimxSetupState> }

const QVIMX_SETUP_DEFAULT: QvimxSetupState = {
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
  challengeCategories: MOTION_CHALLENGE_CATEGORIES,
  challengeDrillMode: false,
  bombCount: 0,
}

function qvimxSetupReducer(state: QvimxSetupState, action: QvimxSetupAction): QvimxSetupState {
  return patchReducer(state, action)
}

// ── Setup option definitions ──────────────────────────────────────────────────

const TIMER_OPTIONS: { label: string; ms: number }[] = [
  { label: '1 min', ms: 60_000 },
  { label: '2 min', ms: 120_000 },
  { label: '5 min', ms: 300_000 },
]

const CODE_SIZE_OPTIONS: { id: QvimxCodeSize; label: string; desc: string }[] = [
  { id: 'short', label: 'Short', desc: '~20 lines — quick games, small board' },
  { id: 'medium', label: 'Medium', desc: '~60 lines — balanced challenge' },
  { id: 'long', label: 'Long', desc: '~150 lines — large board, epic battles' },
]

const BORDER_SHAPE_OPTIONS: { id: QvimxBorderShape; label: string; desc: string }[] = [
  {
    id: 'full-rect',
    label: 'Full Rect',
    desc: 'Rectangle around the entire file — the classic board',
  },
  {
    id: 'code-right',
    label: 'Code Right',
    desc: "Right edge hugs each line's last character — irregular right border",
  },
  {
    id: 'inverse-code',
    label: 'Inverse Code',
    desc: 'Code text is pre-claimed walls — play in the whitespace',
  },
  {
    id: 'sub-rect',
    label: 'Sub Rect',
    desc: 'Inner rectangle (80% of file) — outer code visible but outside the board',
  },
  {
    id: 'rectangles',
    label: 'Rectangles',
    desc: 'Two stacked bordered rectangles — top and bottom play areas',
  },
]

const SUB_MODE_OPTIONS: { id: QvimxSubMode; label: string; desc: string }[] = [
  {
    id: 'classic',
    label: 'Classic',
    desc: 'Single level — highest territory % when the timer ends wins',
  },
  {
    id: 'championship',
    label: 'Championship',
    desc: 'Progress through Short → Medium → Long boards; out-claim the enemy each round to advance',
  },
  {
    id: 'ball-escalation',
    label: 'Ball Escalation',
    desc: 'Start with your configured balls; +1 hazard ball each time you win a round',
  },
  {
    id: 'combo',
    label: 'Combo',
    desc: 'Championship size progression AND ball escalation combined — the hardest mode',
  },
]

const ENEMY_AI_OPTIONS: { id: QvimxAILevel; label: string; desc: string }[] = [
  { id: 'passive', label: 'Passive', desc: 'Rarely leaves the border — mostly a distraction' },
  { id: 'wanderer', label: 'Wanderer', desc: 'Roams the border, occasionally claims a thin strip' },
  { id: 'hunter', label: 'Hunter', desc: 'Targets your claimed territory to block expansion' },
  { id: 'cutter', label: 'Cutter', desc: 'Actively intercepts your in-progress draw lines' },
  {
    id: 'unstoppable',
    label: 'Unstoppable',
    desc: 'Cuts your lines AND hunts your territory — reacts instantly',
  },
]

const BALL_SPEED_OPTIONS: { id: QvimxBallSpeed; label: string; desc: string }[] = [
  { id: 'slow', label: 'Slow', desc: 'One step every 0.8 s' },
  { id: 'medium', label: 'Medium', desc: 'One step every 0.4 s' },
  { id: 'fast', label: 'Fast', desc: 'One step every 0.2 s' },
  { id: 'mixed', label: 'Mixed', desc: 'Each ball gets a random speed' },
]

// ── Setup screen ──────────────────────────────────────────────────────────────

interface SetupProps {
  onStart: (config: QvimxConfig) => void
  onBack: () => void
}

export function QvimxSetup({ onStart, onBack: _onBack }: SetupProps) {
  const [s, dispatch] = useReducer(qvimxSetupReducer, QVIMX_SETUP_DEFAULT)
  const set = (payload: Partial<QvimxSetupState>) => dispatch({ type: 'PATCH', payload })
  const lastConfig = loadStoredConfig<QvimxSetupState>(STORAGE_KEYS.LAST_QVIMX_CONFIG)

  function handleStart() {
    const config: QvimxConfig = {
      language: s.lang,
      codeSize: s.codeSize,
      borderShape: s.borderShape,
      subMode: s.subMode,
      ballCount: s.ballCount,
      ballSpeed: s.ballSpeed,
      enemyAI: s.enemyAI,
      lives: s.lives,
      timerMs: s.timerMs,
      diagonalMode: s.diagonalMode,
      challengeMode: s.challengeMode,
      challengeGuidedMode: s.challengeGuidedMode,
      challengeStartingLevel: s.challengeStartingLevel,
      challengeRepetition: s.challengeRepetition,
      challengeTimeMultiplier: s.challengeTimeMultiplier,
      challengeCategories: s.challengeCategories,
      challengeDrillMode: s.challengeDrillMode,
      bombCount: s.bombCount,
    }
    saveStoredConfig(STORAGE_KEYS.LAST_QVIMX_CONFIG, s)
    onStart(config)
  }

  function handleReplay(saved: QvimxSetupState) {
    const config: QvimxConfig = {
      language: saved.lang,
      codeSize: saved.codeSize,
      borderShape: saved.borderShape,
      subMode: saved.subMode,
      ballCount: saved.ballCount,
      ballSpeed: saved.ballSpeed,
      enemyAI: saved.enemyAI,
      lives: saved.lives,
      timerMs: saved.timerMs,
      diagonalMode: saved.diagonalMode,
      challengeMode: saved.challengeMode,
      challengeGuidedMode: saved.challengeGuidedMode,
      challengeStartingLevel: saved.challengeStartingLevel,
      challengeRepetition: saved.challengeRepetition,
      challengeTimeMultiplier: saved.challengeTimeMultiplier,
      challengeCategories: saved.challengeCategories,
      challengeDrillMode: saved.challengeDrillMode ?? false,
      bombCount: saved.bombCount ?? 1,
    }
    onStart(config)
  }

  return (
    <SetupPageShell
      title="QVIMX"
      subtitle="Claim territory using Vim motions — draw lines to conquer the board"
      actions={
        <div className="flex flex-col gap-2">
          <StartButton onClick={handleStart} />
          {lastConfig && (
            <ReplayButton
              onClick={() => handleReplay(lastConfig)}
              summary={`${lastConfig.subMode} · ${lastConfig.lang} · ${lastConfig.enemyAI}`}
            />
          )}
        </div>
      }
    >
      {/* Language */}
      <CollapseSection label="Language" icon={Globe} defaultOpen={true}>
        <p className="text-xs text-gray-500 mb-3">
          Pick the source language to navigate. Lorem Ipsum is plain prose — good for practising
          line and word motions without syntax noise.
        </p>
        <LanguageGrid value={s.lang} onChange={v => set({ lang: v })} />
      </CollapseSection>

      {/* Code Size */}
      <CollapseSection label="Code Size" icon={Layers} defaultOpen={true}>
        <p className="text-xs text-gray-500 mb-3">
          Determines how many lines of code are loaded. Bigger files mean a larger board with more
          territory to claim — and more room for the enemy and balls to roam.
        </p>
        <div className="flex flex-col gap-2">
          {CODE_SIZE_OPTIONS.map(o => (
            <button
              key={o.id}
              onClick={() => set({ codeSize: o.id })}
              className={`${cls.modeCard(s.codeSize === o.id)}`}
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

      {/* Sub Mode */}
      <CollapseSection label="Sub Mode" icon={LayoutGrid} defaultOpen={true}>
        <p className="text-xs text-gray-500 mb-3">
          Choose the overall game structure. Classic is a single timed round. The other modes add
          progression: bigger boards, more balls, or both.
        </p>
        <div className="flex flex-col gap-2">
          {SUB_MODE_OPTIONS.map(o => (
            <button
              key={o.id}
              onClick={() => set({ subMode: o.id })}
              className={`${cls.modeCard(s.subMode === o.id)}`}
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

      {/* Board Shape */}
      <CollapseSection label="Board Shape" icon={Maximize2} defaultOpen={true}>
        <p className="text-xs text-gray-500 mb-3">
          Controls the shape of the ASCII border drawn around the code. The border is where you
          start and where you must return to complete a claim.
        </p>
        <div className="flex flex-col gap-2">
          {BORDER_SHAPE_OPTIONS.map(o => (
            <button
              key={o.id}
              onClick={() => set({ borderShape: o.id })}
              className={`${cls.modeCard(s.borderShape === o.id)}`}
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

      {/* Timer */}
      <CollapseSection label="Timer" icon={Timer} defaultOpen={true}>
        <p className="text-xs text-gray-500 mb-3">
          How long each round lasts. When time runs out, whoever has claimed more territory wins.
        </p>
        <div className="flex gap-2 flex-wrap">
          {TIMER_OPTIONS.map(o => (
            <button
              key={o.ms}
              onClick={() => set({ timerMs: o.ms })}
              className={cls.pill(s.timerMs === o.ms)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </CollapseSection>

      {/* Lives */}
      <CollapseSection label="Lives" icon={Heart} defaultOpen={true}>
        <p className="text-xs text-gray-500 mb-3">
          Each life lost resets your draw-line and moves you back to a border start point. Lose all
          lives and the game ends immediately — regardless of the timer.
        </p>
        <div className="flex gap-2 flex-wrap">
          {([1, 3, 5] as const).map(n => (
            <button key={n} onClick={() => set({ lives: n })} className={cls.pill(s.lives === n)}>
              {Array.from({ length: n }, () => '♥').join(' ')}
            </button>
          ))}
        </div>
      </CollapseSection>

      {/* Bombs (Border Patrol) */}
      <CollapseSection label="Bombs (Border Patrol)" icon={Shield} defaultOpen={false}>
        <p className="text-xs text-gray-500 mb-3">
          Bombs patrol the border. If one reaches you while you're on the border — or cuts across
          where you stepped off to start drawing — you lose a life. Based on the Sparx enemies from
          the original Qix arcade game.
        </p>
        <div className="flex gap-2 flex-wrap">
          {([0, 1, 2, 3] as const).map(n => (
            <button
              key={n}
              onClick={() => set({ bombCount: n })}
              className={cls.pill(s.bombCount === n)}
            >
              {n === 0 ? 'Off' : `${n} bomb${n > 1 ? 's' : ''}`}
            </button>
          ))}
        </div>
      </CollapseSection>

      {/* Enemy AI */}
      <CollapseSection label="Enemy AI" icon={Bot} defaultOpen={false}>
        <p className="text-xs text-gray-500 mb-3">
          The AI opponent claims territory using the same rules as you — draw a line, return to the
          border, region is filled. Higher levels make it faster and more aggressive.
        </p>
        <div className="flex flex-col gap-2">
          {ENEMY_AI_OPTIONS.map(o => (
            <button
              key={o.id}
              onClick={() => set({ enemyAI: o.id })}
              className={`${cls.modeCard(s.enemyAI === o.id)}`}
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

      {/* Balls */}
      <CollapseSection label="Hazard Balls" icon={Circle} defaultOpen={false}>
        <p className="text-xs text-gray-500 mb-3">
          Balls bounce around the board and are deadly to{' '}
          <span className="text-gray-300">both</span> you and the enemy cursor — if a ball hits
          either player's in-progress draw line, that player loses a life.
        </p>
        <p className="text-xs text-gray-500 mb-1.5">Count</p>
        <div className="flex gap-2 flex-wrap mb-4">
          {([1, 2, 3, 4, 5] as const).map(n => (
            <button
              key={n}
              onClick={() => set({ ballCount: n })}
              className={cls.pill(s.ballCount === n)}
            >
              {n}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mb-1.5">Speed</p>
        <div className="flex flex-col gap-2">
          {BALL_SPEED_OPTIONS.map(o => (
            <button
              key={o.id}
              onClick={() => set({ ballSpeed: o.id })}
              className={`${cls.modeCard(s.ballSpeed === o.id)}`}
            >
              <span className="font-bold">{o.label}</span>
              <span
                className={`text-xs font-normal ml-2 ${s.ballSpeed === o.id ? 'text-blue-200' : 'text-gray-500'}`}
              >
                {o.desc}
              </span>
            </button>
          ))}
        </div>
      </CollapseSection>

      {/* Diagonal Mode */}
      <CollapseSection label="Diagonal Mode" icon={Maximize2} defaultOpen={false}>
        <p className="text-xs text-gray-500 mb-3">
          Controls how your draw line is recorded when a motion moves diagonally (e.g. a search that
          lands several lines away and several columns over). When off, the path is snapped to the
          closest cardinal axis — a 45° move becomes vertical.
        </p>
        <div className="flex flex-col gap-2">
          {(
            [
              {
                v: false,
                label: 'Axis-aligned only',
                desc: 'Lines are always horizontal or vertical (45° → vertical)',
              },
              {
                v: true,
                label: 'Diagonal allowed',
                desc: 'Diagonal paths are drawn as-is — more expressive but harder to predict',
              },
            ] as const
          ).map(({ v, label, desc }) => (
            <button
              key={String(v)}
              onClick={() => set({ diagonalMode: v })}
              className={`${cls.modeCard(s.diagonalMode === v)}`}
            >
              <span className="font-bold">{label}</span>
              <span
                className={`text-xs font-normal ml-2 block mt-0.5 ${s.diagonalMode === v ? 'text-blue-200' : 'text-gray-500'}`}
              >
                {desc}
              </span>
            </button>
          ))}
        </div>
      </CollapseSection>

      {/* Challenge Mode */}
      <ChallengeToggleSection
        enabled={s.challengeMode}
        onToggle={() => set({ challengeMode: !s.challengeMode })}
      >
        <p className="text-xs text-gray-500 mb-4">
          Earn bonus points by completing motion commands while claiming territory.
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
