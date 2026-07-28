import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import type {
  HighScores,
  HighScoreEntry,
  GameMode,
  MotionRaceHighScoreEntry,
  GoalModeHighScoreEntry,
  VimBotsHighScoreEntry,
} from '../engine/types'
import { loadHighScores, emptyHighScores } from '../engine/HighScoreEngine'
import { loadUsername } from '../engine/UserPrefs'

// ── Vim-bot placeholder scores ────────────────────────────────────────────────
// These seed the table so new users have visible goals to aim for.
// Real user scores displace bots when they rank higher.

function makeBot(overrides: Partial<HighScoreEntry>): HighScoreEntry & { isBot: true } {
  return {
    id: `bot-${overrides.score}-${overrides.mode}`,
    username: 'vim-bot',
    timestamp: 0,
    score: 0,
    mode: 'general',
    language: 'typescript',
    startingLevel: 3,
    repetitionTarget: 2,
    guidedMode: 'none',
    challengesCompleted: 0,
    challengesFailed: 0,
    accuracy: 0.85,
    sessionDurationMs: 0,
    expectedTimeMs: 0,
    achievedTimeMs: 0,
    isBot: true,
    ...overrides,
  }
}

const BOT_SEEDS: Record<GameMode, (HighScoreEntry & { isBot: boolean })[]> = {
  general: [
    makeBot({ score: 3200, accuracy: 0.92, challengesCompleted: 64 }),
    makeBot({ score: 2100, accuracy: 0.88, challengesCompleted: 42 }),
    makeBot({ score: 1400, accuracy: 0.83, challengesCompleted: 28 }),
  ],
  timed_challenge: [
    makeBot({
      mode: 'timed_challenge',
      score: 2600,
      sessionDurationMs: 300_000,
      accuracy: 0.9,
      challengesCompleted: 52,
    }),
    makeBot({
      mode: 'timed_challenge',
      score: 1700,
      sessionDurationMs: 300_000,
      accuracy: 0.86,
      challengesCompleted: 34,
    }),
    makeBot({
      mode: 'timed_challenge',
      score: 1000,
      sessionDurationMs: 300_000,
      accuracy: 0.8,
      challengesCompleted: 20,
    }),
  ],
  survival: [
    makeBot({
      mode: 'survival',
      score: 900,
      achievedTimeMs: 180_000,
      expectedTimeMs: 210_000,
      accuracy: 0.9,
      challengesCompleted: 18,
    }),
    makeBot({
      mode: 'survival',
      score: 600,
      achievedTimeMs: 120_000,
      expectedTimeMs: 145_000,
      accuracy: 0.85,
      challengesCompleted: 12,
    }),
    makeBot({
      mode: 'survival',
      score: 350,
      achievedTimeMs: 60_000,
      expectedTimeMs: 72_000,
      accuracy: 0.78,
      challengesCompleted: 7,
    }),
  ],
}

function makeMRBot(
  overrides: Partial<MotionRaceHighScoreEntry>
): MotionRaceHighScoreEntry & { isBot: true } {
  return {
    id: `bot-mr-${overrides.score}-${overrides.endGoal}`,
    username: 'vim-bot',
    timestamp: 0,
    endGoal: 'timed',
    score: 0,
    keystrokes: 0,
    sessionDurationMs: 0,
    language: 'typescript',
    isBot: true,
    ...overrides,
  }
}

const BOT_SEEDS_MR: Record<
  'timed' | 'survival' | 'total_goals',
  (MotionRaceHighScoreEntry & { isBot: boolean })[]
> = {
  timed: [
    makeMRBot({ endGoal: 'timed', score: 32, sessionDurationMs: 60_000, keystrokes: 240 }),
    makeMRBot({ endGoal: 'timed', score: 21, sessionDurationMs: 60_000, keystrokes: 180 }),
    makeMRBot({ endGoal: 'timed', score: 14, sessionDurationMs: 60_000, keystrokes: 110 }),
  ],
  survival: [
    makeMRBot({ endGoal: 'survival', score: 45, sessionDurationMs: 180_000, keystrokes: 410 }),
    makeMRBot({ endGoal: 'survival', score: 28, sessionDurationMs: 120_000, keystrokes: 260 }),
    makeMRBot({ endGoal: 'survival', score: 15, sessionDurationMs: 70_000, keystrokes: 150 }),
  ],
  total_goals: [
    makeMRBot({ endGoal: 'total_goals', score: 10, sessionDurationMs: 12_000, keystrokes: 85 }),
    makeMRBot({ endGoal: 'total_goals', score: 10, sessionDurationMs: 18_000, keystrokes: 110 }),
    makeMRBot({ endGoal: 'total_goals', score: 10, sessionDurationMs: 27_000, keystrokes: 160 }),
  ],
}

function makeGoalBot(
  overrides: Partial<GoalModeHighScoreEntry>
): GoalModeHighScoreEntry & { isBot: true } {
  return {
    id: `bot-goal-${overrides.totalPoints}`,
    username: 'vim-bot',
    timestamp: 0,
    challengeCount: 5,
    difficulty: 'medium',
    solved: 5,
    totalKeystrokes: 0,
    totalElapsedMs: 0,
    totalPoints: 0,
    isBot: true,
    ...overrides,
  }
}

const BOT_SEEDS_GOAL: (GoalModeHighScoreEntry & { isBot: boolean })[] = [
  makeGoalBot({ totalPoints: 12500, solved: 5, totalElapsedMs: 45_000, totalKeystrokes: 65 }),
  makeGoalBot({ totalPoints: 8200, solved: 4, totalElapsedMs: 72_000, totalKeystrokes: 95 }),
  makeGoalBot({ totalPoints: 4100, solved: 3, totalElapsedMs: 110_000, totalKeystrokes: 140 }),
]

type DisplayEntry = (HighScoreEntry & { isBot?: boolean }) | null
type DisplayMREntry = (MotionRaceHighScoreEntry & { isBot?: boolean }) | null
type DisplayGoalEntry = (GoalModeHighScoreEntry & { isBot?: boolean }) | null
type DisplayVimBotsEntry = (VimBotsHighScoreEntry & { isBot?: boolean }) | null

function buildRows(mode: GameMode, real: HighScoreEntry[]): DisplayEntry[] {
  const sortedReal = [...real].sort((a, b) =>
    mode === 'survival' ? b.achievedTimeMs - a.achievedTimeMs : b.score - a.score
  )
  const bots = BOT_SEEDS[mode]
  const combined = [...sortedReal, ...bots]
    .sort((a, b) => (mode === 'survival' ? b.achievedTimeMs - a.achievedTimeMs : b.score - a.score))
    .slice(0, 10)
  while (combined.length < 10) combined.push(null as any)
  return combined
}

function buildRowsMR(
  mode: 'timed' | 'survival' | 'total_goals',
  entries: MotionRaceHighScoreEntry[]
): DisplayMREntry[] {
  const sortedReal = [...entries].sort((a, b) =>
    mode === 'survival'
      ? b.sessionDurationMs - a.sessionDurationMs
      : mode === 'total_goals'
        ? a.sessionDurationMs - b.sessionDurationMs
        : b.score - a.score
  )
  const bots = BOT_SEEDS_MR[mode]
  const combined: DisplayMREntry[] = [...sortedReal, ...bots]
    .sort((a, b) =>
      mode === 'survival'
        ? b.sessionDurationMs - a.sessionDurationMs
        : mode === 'total_goals'
          ? a.sessionDurationMs - b.sessionDurationMs
          : b.score - a.score
    )
    .slice(0, 10)

  while (combined.length < 10) combined.push(null)
  return combined
}

function makeVimBotsBot(
  overrides: Partial<VimBotsHighScoreEntry>
): VimBotsHighScoreEntry & { isBot: true } {
  return {
    id: `bot-vimbots-${overrides.totalScore}`,
    username: 'vim-bot',
    timestamp: 0,
    difficulty: 'medium',
    levelsCleared: 0,
    totalScore: 0,
    challengeScore: 0,
    gridSize: 'medium',
    isBot: true,
    ...overrides,
  }
}

const BOT_SEEDS_VIMBOTS: (VimBotsHighScoreEntry & { isBot: boolean })[] = [
  makeVimBotsBot({ totalScore: 800, levelsCleared: 3, difficulty: 'beginner', gridSize: 'small' }),
  makeVimBotsBot({ totalScore: 400, levelsCleared: 1, difficulty: 'beginner', gridSize: 'tiny' }),
  makeVimBotsBot({ totalScore: 150, levelsCleared: 0, difficulty: 'beginner', gridSize: 'tiny' }),
  makeVimBotsBot({ totalScore: 1500, levelsCleared: 5, difficulty: 'easy', gridSize: 'small' }),
  makeVimBotsBot({ totalScore: 800, levelsCleared: 2, difficulty: 'easy', gridSize: 'small' }),
  makeVimBotsBot({ totalScore: 300, levelsCleared: 0, difficulty: 'easy', gridSize: 'medium' }),
  makeVimBotsBot({ totalScore: 2500, levelsCleared: 5, difficulty: 'medium', gridSize: 'medium' }),
  makeVimBotsBot({ totalScore: 1200, levelsCleared: 2, difficulty: 'medium', gridSize: 'medium' }),
  makeVimBotsBot({ totalScore: 450, levelsCleared: 0, difficulty: 'medium', gridSize: 'large' }),
  makeVimBotsBot({ totalScore: 5000, levelsCleared: 10, difficulty: 'hard', gridSize: 'large' }),
  makeVimBotsBot({ totalScore: 2200, levelsCleared: 4, difficulty: 'hard', gridSize: 'medium' }),
  makeVimBotsBot({ totalScore: 800, levelsCleared: 1, difficulty: 'hard', gridSize: 'medium' }),
  makeVimBotsBot({ totalScore: 9000, levelsCleared: 8, difficulty: 'expert', gridSize: 'large' }),
  makeVimBotsBot({ totalScore: 4500, levelsCleared: 3, difficulty: 'expert', gridSize: 'xlarge' }),
  makeVimBotsBot({ totalScore: 1500, levelsCleared: 0, difficulty: 'expert', gridSize: 'medium' }),
]

function buildRowsVimBots(
  entries: VimBotsHighScoreEntry[],
  difficulty: VimBotsHighScoreEntry['difficulty']
): DisplayVimBotsEntry[] {
  const bots = BOT_SEEDS_VIMBOTS.filter(b => b.difficulty === difficulty)
  const combined: DisplayVimBotsEntry[] = [...entries, ...bots]
    .sort((a, b) => b.totalScore - a.totalScore || b.levelsCleared - a.levelsCleared)
    .slice(0, 10)
  while (combined.length < 10) combined.push(null)
  return combined
}

function buildRowsGoal(entries: GoalModeHighScoreEntry[]): DisplayGoalEntry[] {
  const sortedReal = [...entries].sort((a, b) => b.totalPoints - a.totalPoints)
  const combined: DisplayGoalEntry[] = [...sortedReal, ...BOT_SEEDS_GOAL]
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, 10)
  while (combined.length < 10) combined.push(null)
  return combined
}

function fmt(ms: number) {
  const s = Math.round(ms / 1000)
  if (s < 60) return `${s}s`
  return `${Math.floor(s / 60)}m ${s % 60}s`
}

function fmtDate(ts: number) {
  if (ts === 0) return '—'
  return new Date(ts).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: '2-digit',
  })
}

const RANK_COLOR = ['text-yellow-400', 'text-gray-300', 'text-amber-600']

// ── Shared table primitives ───────────────────────────────────────────────────

function HsTableShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs font-mono border-collapse">{children}</table>
    </div>
  )
}

function HsEmptyRow({ rank, colSpan }: { rank: number; colSpan: number }) {
  const rankColor = rank <= 3 ? RANK_COLOR[rank - 1] : 'text-gray-600'
  return (
    <tr className="border-b border-gray-800/50">
      <td className={`py-2.5 px-3 font-bold ${rankColor}`}>{rank}</td>
      <td colSpan={colSpan} className="py-2.5 px-3 text-gray-700">
        —
      </td>
    </tr>
  )
}

// ── Arcade Table ─────────────────────────────────────────────────────────────

function ScoreTable({
  mode,
  rows,
  username,
}: {
  mode: GameMode
  rows: DisplayEntry[]
  username: string
}) {
  const isSurvival = mode === 'survival'
  return (
    <HsTableShell>
      <thead>
        <tr className="border-b border-gray-700 text-gray-500 uppercase tracking-wider">
          <th className="py-2 px-3 text-left w-8">#</th>
          <th className="py-2 px-3 text-left">Player</th>
          <th className="py-2 px-3 text-right">{isSurvival ? 'Survived' : 'Score'}</th>
          <th className="py-2 px-3 text-right hidden sm:table-cell">
            {isSurvival ? 'Expected' : 'Session'}
          </th>
          <th className="py-2 px-3 text-center hidden md:table-cell">Lang</th>
          <th className="py-2 px-3 text-center hidden md:table-cell">Lv</th>
          <th className="py-2 px-3 text-right hidden lg:table-cell">✓/✗</th>
          <th className="py-2 px-3 text-right hidden lg:table-cell">Acc</th>
          <th className="py-2 px-3 text-right hidden xl:table-cell">Date</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((entry, i) => {
          const rankColor = i < 3 ? RANK_COLOR[i] : 'text-gray-600'
          const isMe = entry && !entry.isBot && (!entry.username || entry.username === username)
          if (!entry) return <HsEmptyRow key={i} rank={i + 1} colSpan={8} />
          const isBot = !!entry.isBot
          return (
            <tr
              key={entry.id}
              className={`border-b border-gray-800 transition-colors ${isMe ? 'bg-blue-900/15' : isBot ? 'bg-gray-900' : 'hover:bg-gray-800/40'}`}
            >
              <td className={`py-2.5 px-3 font-bold text-sm ${rankColor}`}>{i + 1}</td>
              <td className="py-2.5 px-3">
                <span
                  className={
                    isMe
                      ? 'text-blue-300 font-bold'
                      : isBot
                        ? 'text-gray-500 italic'
                        : 'text-gray-300'
                  }
                >
                  {entry.username ?? username}
                </span>
              </td>
              <td className="py-2.5 px-3 text-right font-bold">
                {isSurvival ? (
                  <span className="text-green-400">{fmt(entry.achievedTimeMs)}</span>
                ) : (
                  <span
                    className={isMe ? 'text-blue-300' : isBot ? 'text-gray-400' : 'text-yellow-400'}
                  >
                    {entry.score.toLocaleString()}
                  </span>
                )}
              </td>
              <td className="py-2.5 px-3 text-right text-gray-500 hidden sm:table-cell">
                {isSurvival ? fmt(entry.expectedTimeMs) : fmt(entry.sessionDurationMs)}
              </td>
              <td className="py-2.5 px-3 text-center text-gray-400 hidden md:table-cell">
                {entry.language}
              </td>
              <td className="py-2.5 px-3 text-center text-gray-400 hidden md:table-cell">
                {entry.startingLevel}
              </td>
              <td className="py-2.5 px-3 text-right text-gray-500 hidden lg:table-cell">
                <span className="text-green-600">{entry.challengesCompleted}✓</span>{' '}
                <span className="text-red-700">{entry.challengesFailed}✗</span>
              </td>
              <td className="py-2.5 px-3 text-right text-gray-500 hidden lg:table-cell">
                {Math.round(entry.accuracy * 100)}%
              </td>
              <td className="py-2.5 px-3 text-right text-gray-600 hidden xl:table-cell">
                {fmtDate(entry.timestamp)}
              </td>
            </tr>
          )
        })}
      </tbody>
    </HsTableShell>
  )
}

// ── Motion Race Table ────────────────────────────────────────────────────────
function MotionRaceTable({ rows, username }: { rows: DisplayMREntry[]; username: string }) {
  return (
    <HsTableShell>
      <thead>
        <tr className="border-b border-gray-700 text-gray-500 uppercase tracking-wider">
          <th className="py-2 px-3 text-left w-8">#</th>
          <th className="py-2 px-3 text-left">Player</th>
          <th className="py-2 px-3 text-right">Goals</th>
          <th className="py-2 px-3 text-right">Time</th>
          <th className="py-2 px-3 text-center hidden md:table-cell">Keystrokes</th>
          <th className="py-2 px-3 text-center hidden lg:table-cell">Lang</th>
          <th className="py-2 px-3 text-right hidden lg:table-cell">Date</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((entry, i) => {
          const rankColor = i < 3 ? RANK_COLOR[i] : 'text-gray-600'
          const isMe = entry && (!entry.username || entry.username === username)
          if (!entry) return <HsEmptyRow key={i} rank={i + 1} colSpan={6} />
          return (
            <tr
              key={entry.id}
              className={`border-b border-gray-800 transition-colors ${isMe ? 'bg-blue-900/15' : 'hover:bg-gray-800/40'}`}
            >
              <td className={`py-2.5 px-3 font-bold text-sm ${rankColor}`}>{i + 1}</td>
              <td className="py-2.5 px-3">
                <span className={isMe ? 'text-blue-300 font-bold' : 'text-gray-300'}>
                  {entry.username ?? username}
                </span>
              </td>
              <td className="py-2.5 px-3 text-right font-bold">
                <span className="text-yellow-400">{entry.score}</span>
              </td>
              <td className="py-2.5 px-3 text-right text-green-400">
                {fmt(entry.sessionDurationMs)}
              </td>
              <td className="py-2.5 px-3 text-center text-gray-500 hidden md:table-cell">
                {entry.keystrokes}
              </td>
              <td className="py-2.5 px-3 text-center text-gray-500 hidden lg:table-cell">
                {entry.language}
              </td>
              <td className="py-2.5 px-3 text-right text-gray-600 hidden lg:table-cell">
                {fmtDate(entry.timestamp)}
              </td>
            </tr>
          )
        })}
      </tbody>
    </HsTableShell>
  )
}

// ── Goal Mode Table ──────────────────────────────────────────────────────────
function GoalTable({ rows, username }: { rows: DisplayGoalEntry[]; username: string }) {
  return (
    <HsTableShell>
      <thead>
        <tr className="border-b border-gray-700 text-gray-500 uppercase tracking-wider">
          <th className="py-2 px-3 text-left w-8">#</th>
          <th className="py-2 px-3 text-left">Player</th>
          <th className="py-2 px-3 text-right">Score</th>
          <th className="py-2 px-3 text-center hidden md:table-cell">Difficulty</th>
          <th className="py-2 px-3 text-center hidden md:table-cell">Solved</th>
          <th className="py-2 px-3 text-right hidden sm:table-cell">Time</th>
          <th className="py-2 px-3 text-right hidden lg:table-cell">Keys</th>
          <th className="py-2 px-3 text-right hidden lg:table-cell">Date</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((entry, i) => {
          const rankColor = i < 3 ? RANK_COLOR[i] : 'text-gray-600'
          const isMe = entry && (!entry.username || entry.username === username)
          if (!entry) return <HsEmptyRow key={i} rank={i + 1} colSpan={7} />
          return (
            <tr
              key={entry.id}
              className={`border-b border-gray-800 transition-colors ${isMe ? 'bg-blue-900/15' : 'hover:bg-gray-800/40'}`}
            >
              <td className={`py-2.5 px-3 font-bold text-sm ${rankColor}`}>{i + 1}</td>
              <td className="py-2.5 px-3">
                <span className={isMe ? 'text-blue-300 font-bold' : 'text-gray-300'}>
                  {entry.username ?? username}
                </span>
              </td>
              <td className="py-2.5 px-3 text-right font-bold">
                <span className="text-yellow-400">{entry.totalPoints}</span>
              </td>
              <td className="py-2.5 px-3 text-center text-gray-500 hidden md:table-cell">
                {entry.difficulty}
              </td>
              <td className="py-2.5 px-3 text-center text-green-400 hidden md:table-cell">
                {entry.solved} / {entry.challengeCount}
              </td>
              <td className="py-2.5 px-3 text-right text-gray-500 hidden sm:table-cell">
                {fmt(entry.totalElapsedMs)}
              </td>
              <td className="py-2.5 px-3 text-right text-gray-500 hidden lg:table-cell">
                {entry.totalKeystrokes}
              </td>
              <td className="py-2.5 px-3 text-right text-gray-600 hidden lg:table-cell">
                {fmtDate(entry.timestamp)}
              </td>
            </tr>
          )
        })}
      </tbody>
    </HsTableShell>
  )
}

// ── VimBots Table ────────────────────────────────────────────────────────────
function VimBotsTable({ rows, username }: { rows: DisplayVimBotsEntry[]; username: string }) {
  return (
    <HsTableShell>
      <thead>
        <tr className="border-b border-gray-700 text-gray-500 uppercase tracking-wider">
          <th className="py-2 px-3 text-left w-8">#</th>
          <th className="py-2 px-3 text-left">Player</th>
          <th className="py-2 px-3 text-right">Score</th>
          <th className="py-2 px-3 text-center hidden md:table-cell">Difficulty</th>
          <th className="py-2 px-3 text-center hidden md:table-cell">Levels Cleared</th>
          <th className="py-2 px-3 text-center hidden sm:table-cell">Grid Size</th>
          <th className="py-2 px-3 text-right hidden lg:table-cell">Date</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((entry, i) => {
          const rankColor = i < 3 ? RANK_COLOR[i] : 'text-gray-600'
          const isMe = entry && !entry.isBot && (!entry.username || entry.username === username)
          if (!entry) return <HsEmptyRow key={i} rank={i + 1} colSpan={6} />
          const isBot = !!entry.isBot
          return (
            <tr
              key={entry.id}
              className={`border-b border-gray-800 transition-colors ${isMe ? 'bg-blue-900/15' : isBot ? 'bg-gray-900' : 'hover:bg-gray-800/40'}`}
            >
              <td className={`py-2.5 px-3 font-bold text-sm ${rankColor}`}>{i + 1}</td>
              <td className="py-2.5 px-3">
                <span
                  className={
                    isMe
                      ? 'text-blue-300 font-bold'
                      : isBot
                        ? 'text-gray-500 italic'
                        : 'text-gray-300'
                  }
                >
                  {entry.username ?? username}
                </span>
              </td>
              <td className="py-2.5 px-3 text-right font-bold">
                <span
                  className={isMe ? 'text-blue-300' : isBot ? 'text-gray-400' : 'text-yellow-400'}
                >
                  {entry.totalScore.toLocaleString()}
                </span>
              </td>
              <td className="py-2.5 px-3 text-center text-gray-500 hidden md:table-cell">
                {entry.difficulty}
              </td>
              <td className="py-2.5 px-3 text-center text-green-400 hidden md:table-cell">
                {entry.levelsCleared}
              </td>
              <td className="py-2.5 px-3 text-center text-gray-500 hidden sm:table-cell">
                {entry.gridSize}
              </td>
              <td className="py-2.5 px-3 text-right text-gray-600 hidden lg:table-cell">
                {fmtDate(entry.timestamp)}
              </td>
            </tr>
          )
        })}
      </tbody>
    </HsTableShell>
  )
}

// ── Main screen ───────────────────────────────────────────────────────────────

type TopLevelCategory = 'motionrace' | 'goal' | 'arcade' | 'vimbots'

const TOP_LEVEL_TABS: { id: TopLevelCategory; label: string }[] = [
  { id: 'motionrace', label: 'Motion Race' },
  { id: 'goal', label: 'Goal Mode' },
  { id: 'arcade', label: 'Classic Arcade' },
  { id: 'vimbots', label: 'VimBots' },
]

export function HighScoreScreen() {
  const location = useLocation()
  const initTab = (location.state as { tab?: TopLevelCategory })?.tab ?? 'motionrace'
  const initVimbotsTab =
    (location.state as { vimbotsTab?: VimBotsHighScoreEntry['difficulty'] })?.vimbotsTab ?? 'medium'

  const [topCategory, setTopCategory] = useState<TopLevelCategory>(initTab)
  const [mrTab, setMrTab] = useState<'timed' | 'survival' | 'total_goals'>('timed')
  const [arcadeTab, setArcadeTab] = useState<GameMode>('general')
  const [vimbotsTab, setVimbotsTab] = useState<VimBotsHighScoreEntry['difficulty']>(initVimbotsTab)
  const [scores, setScores] = useState<HighScores>(emptyHighScores())
  const username = loadUsername()

  useEffect(() => {
    setScores(loadHighScores())
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 font-mono">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">High Scores</h1>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-blue-400">{username}</span> is you
            </p>
          </div>
        </div>
        {/* Top Level Category Tabs */}
        <div className="flex gap-2 mb-4 bg-gray-800 p-1 rounded-lg w-max">
          {TOP_LEVEL_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setTopCategory(tab.id)}
              className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${
                topCategory === tab.id
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Sub tabs depending on top category */}
        {topCategory === 'motionrace' && (
          <div className="flex gap-1 mb-6 border-b border-gray-700">
            {[
              { id: 'timed', label: 'Timed' },
              { id: 'survival', label: 'Survival' },
              { id: 'total_goals', label: 'Total Goals' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setMrTab(t.id as any)}
                className={`px-4 py-2 text-sm font-mono transition-colors border-b-2 -mb-px ${
                  mrTab === t.id
                    ? 'border-green-500 text-green-300'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
        {topCategory === 'arcade' && (
          <div className="flex gap-1 mb-6 border-b border-gray-700">
            {[
              { id: 'general', label: 'General' },
              { id: 'timed_challenge', label: 'Timed' },
              { id: 'survival', label: 'Survival' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setArcadeTab(t.id as any)}
                className={`px-4 py-2 text-sm font-mono transition-colors border-b-2 -mb-px ${
                  arcadeTab === t.id
                    ? 'border-green-500 text-green-300'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
        {topCategory === 'goal' && <div className="mb-6" />} {/* Spacing for alignment */}
        {topCategory === 'vimbots' && (
          <div className="flex gap-1 mb-6 border-b border-gray-700">
            {(['beginner', 'easy', 'medium', 'hard', 'expert'] as const).map(d => (
              <button
                key={d}
                onClick={() => setVimbotsTab(d)}
                className={`px-4 py-2 text-sm font-mono transition-colors border-b-2 -mb-px capitalize ${
                  vimbotsTab === d
                    ? 'border-green-500 text-green-300'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        )}
        {/* Table */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          {topCategory === 'motionrace' && (
            <MotionRaceTable
              rows={buildRowsMR(mrTab, scores[`motionrace_${mrTab}`])}
              username={username}
            />
          )}
          {topCategory === 'arcade' && (
            <ScoreTable
              mode={arcadeTab}
              rows={buildRows(arcadeTab, scores[arcadeTab])}
              username={username}
            />
          )}
          {topCategory === 'goal' && (
            <GoalTable rows={buildRowsGoal(scores.goal)} username={username} />
          )}
          {topCategory === 'vimbots' && (
            <VimBotsTable
              rows={buildRowsVimBots(
                (scores.vimbots ?? []).filter(e => e.difficulty === vimbotsTab),
                vimbotsTab
              )}
              username={username}
            />
          )}
        </div>
      </div>
    </div>
  )
}
