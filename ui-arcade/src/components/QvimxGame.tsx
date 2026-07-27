import { useEffect, useReducer, useState, useRef } from 'react'
import type React from 'react'
import { useQvimx } from '../hooks/useQvimx'
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
import {
  Globe,
  Timer,
  Heart,
  Bot,
  Zap,
  Trophy,
  ArrowLeft,
  Layers,
  Circle,
  Maximize2,
  LayoutGrid,
  Shield,
} from 'lucide-react'

// ── Setup state ───────────────────────────────────────────────────────────────

type QvimxSetupState = {
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
  return { ...state, ...action.payload }
}

function loadLastQvimxConfig(): QvimxSetupState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LAST_QVIMX_CONFIG)
    return raw ? (JSON.parse(raw) as QvimxSetupState) : null
  } catch {
    return null
  }
}

function saveLastQvimxConfig(s: QvimxSetupState): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_QVIMX_CONFIG, JSON.stringify(s))
  } catch {
    /* ignore */
  }
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
  { id: 'full-rect', label: 'Full Rect', desc: 'Rectangle around the entire file — the classic board' },
  { id: 'code-right', label: 'Code Right', desc: 'Right edge hugs each line\'s last character — irregular right border' },
  { id: 'inverse-code', label: 'Inverse Code', desc: 'Code text is pre-claimed walls — play in the whitespace' },
  { id: 'sub-rect', label: 'Sub Rect', desc: 'Inner rectangle (80% of file) — outer code visible but outside the board' },
  { id: 'rectangles', label: 'Rectangles', desc: 'Two stacked bordered rectangles — top and bottom play areas' },
]

const SUB_MODE_OPTIONS: { id: QvimxSubMode; label: string; desc: string }[] = [
  { id: 'classic', label: 'Classic', desc: 'Single level — highest territory % when the timer ends wins' },
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
  { id: 'unstoppable', label: 'Unstoppable', desc: 'Cuts your lines AND hunts your territory — reacts instantly' },
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

function QvimxSetup({ onStart, onBack: _onBack }: SetupProps) {
  const [s, dispatch] = useReducer(qvimxSetupReducer, QVIMX_SETUP_DEFAULT)
  const set = (payload: Partial<QvimxSetupState>) => dispatch({ type: 'PATCH', payload })
  const lastConfig = loadLastQvimxConfig()

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
    saveLastQvimxConfig(s)
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
          Bombs patrol the border. If one reaches you while you're on the border — or
          cuts across where you stepped off to start drawing — you lose a life. Based
          on the Sparx enemies from the original Qix arcade game.
        </p>
        <div className="flex gap-2 flex-wrap">
          {([0, 1, 2, 3] as const).map(n => (
            <button key={n} onClick={() => set({ bombCount: n })} className={cls.pill(s.bombCount === n)}>
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
          Controls how your draw line is recorded when a motion moves diagonally (e.g. a search
          that lands several lines away and several columns over). When off, the path is snapped to
          the closest cardinal axis — a 45° move becomes vertical.
        </p>
        <div className="flex flex-col gap-2">
          {(
            [
              { v: false, label: 'Axis-aligned only', desc: 'Lines are always horizontal or vertical (45° → vertical)' },
              { v: true, label: 'Diagonal allowed', desc: 'Diagonal paths are drawn as-is — more expressive but harder to predict' },
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

function fmtCountdown(remainMs: number) {
  const ms = Math.max(0, remainMs)
  const s = Math.ceil(ms / 1000)
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

function LivesDisplay({ count, max }: { count: number; max: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < count ? 'text-red-400' : 'text-gray-600'}>
          ♥
        </span>
      ))}
    </div>
  )
}

// ── Game screen ───────────────────────────────────────────────────────────────

interface GameProps {
  config: QvimxConfig
  onQuit: () => void
}

function QvimxGameScreen({ config, onQuit }: GameProps) {
  const { state, editorRef, statusRef, startGame, getVisibleRange } = useQvimx()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    startGame(config)
  }, [])

  // Penalty toast — watch penaltySeq so we show a message each time a life is lost
  const [penaltyToast, setPenaltyToast] = useState<string | null>(null)
  const prevPenaltySeq = useRef(0)
  useEffect(() => {
    if (state.penaltySeq > prevPenaltySeq.current) {
      prevPenaltySeq.current = state.penaltySeq
      const msg =
        state.penaltySource === 'ball'
          ? '● Ball hit your line!'
          : state.penaltySource === 'bomb'
            ? '◉ Bomb touched you!'
            : state.penaltySource === 'bomb-stix'
              ? '◉ Bomb cut your line!'
              : '⚠ Penalty!'
      setPenaltyToast(msg)
      const id = setTimeout(() => setPenaltyToast(null), 1500)
      return () => clearTimeout(id)
    }
  }, [state.penaltySeq, state.penaltySource])

  // Ball-caught toast
  const [catchToast, setCatchToast] = useState<string | null>(null)
  const prevCatchSeq = useRef(0)
  useEffect(() => {
    if (state.catchSeq > prevCatchSeq.current) {
      prevCatchSeq.current = state.catchSeq
      const n = state.catchCount
      setCatchToast(n === 1 ? '🎯 Ball caught!' : `🎯 ${n} balls caught!`)
      const id = setTimeout(() => setCatchToast(null), 1800)
      return () => clearTimeout(id)
    }
  }, [state.catchSeq, state.catchCount])

  const isResults = state.status === 'results'
  const remainMs = Math.max(0, config.timerMs - state.totalElapsedMs)

  const winner =
    state.playerScore > state.enemyScore
      ? 'You win!'
      : state.enemyScore > state.playerScore
        ? 'Enemy wins!'
        : 'Draw!'

  return (
    <div className="h-full bg-gray-900 flex flex-col overflow-hidden font-mono relative">
      {/* Penalty toast */}
      {penaltyToast && !isResults && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
          <div className="bg-red-900/90 border-2 border-red-500 text-red-200 font-bold px-6 py-3 rounded-lg shadow-2xl animate-pulse text-base">
            {penaltyToast}
          </div>
        </div>
      )}
      {/* Ball-caught toast */}
      {catchToast && !isResults && (
        <div className="absolute top-2/5 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-green-900/90 border-2 border-green-400 text-green-200 font-bold px-6 py-3 rounded-lg shadow-2xl text-base">
            {catchToast}
          </div>
        </div>
      )}
      {/* Results overlay */}
      {isResults && (
        <div className="absolute inset-0 z-40 backdrop-blur-sm bg-gray-900/80 flex flex-col items-center justify-center px-6">
          <div className="w-full max-w-lg bg-gray-900/90 border border-gray-600 rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-3">
                <Trophy className="w-14 h-14 text-yellow-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-1">{winner}</h2>
              <p className="text-gray-400 text-sm">
                {state.endReason === 'time'
                  ? 'Time up'
                  : state.endReason === 'lives'
                    ? 'Out of lives'
                    : 'Level complete'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-center">
              <div className="bg-gray-800 rounded-xl p-4 border border-green-800">
                <div className="text-2xl font-bold text-green-400">{state.playerScore}%</div>
                <div className="text-xs text-gray-400 mt-1">You claimed</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 border border-red-800">
                <div className="text-2xl font-bold text-red-400">{state.enemyScore}%</div>
                <div className="text-xs text-gray-400 mt-1">Enemy claimed</div>
              </div>
            </div>

            {config.subMode === 'championship' && (
              <div className="text-center mb-4 text-purple-400 text-sm">
                Level reached: <span className="font-bold">{state.level}</span>
              </div>
            )}

            {state.challengeScore > 0 && (
              <div className="text-center mb-4 text-indigo-400 text-sm">
                Challenges solved: <span className="font-bold">{state.challengeScore}</span>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => startGame(config)}
                className="flex-1 py-2.5 rounded bg-green-700 hover:bg-green-600 text-white font-bold text-sm transition-colors"
              >
                Play again
              </button>
              <button
                onClick={onQuit}
                className="flex-1 py-2.5 rounded bg-gray-700 hover:bg-gray-600 text-white font-bold text-sm transition-colors"
              >
                Back to menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <TopBar
        title="QVIMX"
        onBack={onQuit}
        backLabel={
          <>
            <ArrowLeft className="w-4 h-4" /> Quit
          </>
        }
      >
        <span
          className={`font-bold tabular-nums flex items-center gap-1 ${remainMs < 10_000 ? 'text-red-400' : 'text-blue-300'}`}
        >
          <Timer className="w-3.5 h-3.5" /> {fmtCountdown(remainMs)}
        </span>
        <span className="text-green-400 tabular-nums font-bold">You: {state.playerScore}%</span>
        <span className="text-red-400 tabular-nums font-bold">Enemy: {state.enemyScore}%</span>
        {config.ballCount > 0 && (
          <span className="text-orange-400 tabular-nums text-xs">
            ● {config.ballCount} ball{config.ballCount > 1 ? 's' : ''}
          </span>
        )}
        {config.bombCount > 0 && (
          <span className="text-rose-400 tabular-nums text-xs">
            ◉ {state.bombPatrols.length} bomb{state.bombPatrols.length !== 1 ? 's' : ''}
          </span>
        )}
      </TopBar>

      {/* Lives bar */}
      <div className="flex items-center gap-6 px-4 py-1.5 bg-gray-800 border-b border-gray-700 flex-shrink-0 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs">You</span>
          <LivesDisplay count={state.playerLives} max={config.lives} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs">Enemy</span>
          <LivesDisplay count={state.enemyLives} max={config.lives} />
        </div>
        <div className="ml-auto text-xs text-gray-500 tabular-nums">
          {state.playerDrawState === 'drawing' ? 'Drawing...' : 'On border'}
        </div>
      </div>

      {/* Challenge bar */}
      {config.challengeMode && state.activeChallenge && !isResults && (
        <div className="flex items-center gap-3 px-4 py-2 bg-indigo-950/60 border-b border-indigo-800 flex-shrink-0 text-xs font-mono">
          <Zap className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
          <span className="text-white">{state.activeChallenge.question}</span>
          <span className="ml-auto text-indigo-400 tabular-nums">+{state.challengeScore}</span>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 min-h-0 relative">
        <div ref={editorRef as React.RefObject<HTMLDivElement>} className="h-full" />
      </div>

      {/* Status bar */}
      <div
        ref={statusRef as React.RefObject<HTMLDivElement>}
        className="h-7 bg-gray-800 border-t border-gray-700 px-3 flex items-center text-xs text-gray-400 flex-shrink-0"
      />
    </div>
  )

  void getVisibleRange
}

// ── Public wrapper ────────────────────────────────────────────────────────────

type WrapperState = { screen: 'setup' } | { screen: 'game'; config: QvimxConfig }
type WrapperAction = { type: 'START'; config: QvimxConfig } | { type: 'QUIT' }

function wrapperReducer(_state: WrapperState, action: WrapperAction): WrapperState {
  switch (action.type) {
    case 'START':
      return { screen: 'game', config: action.config }
    case 'QUIT':
      return { screen: 'setup' }
  }
}

export function QvimxWrapper({ onBack }: { onBack: () => void }) {
  const [state, dispatch] = useReducer(wrapperReducer, { screen: 'setup' })

  if (state.screen === 'setup') {
    return <QvimxSetup onStart={config => dispatch({ type: 'START', config })} onBack={onBack} />
  }

  return (
    <QvimxGameScreen
      config={state.config}
      onQuit={() => {
        dispatch({ type: 'QUIT' })
        onBack()
      }}
    />
  )
}
