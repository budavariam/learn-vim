import { useCallback, useEffect, useRef } from 'react'
import { BookOpen } from 'lucide-react'
import { useMonacoEditor } from '../hooks/useMonacoEditor'
import { TopBar } from './TopBar'
import { ChallengePanel } from './ChallengePanel'
import { ScoreDisplay } from './ScoreDisplay'
import { LevelIndicator } from './LevelIndicator'
import { type VimTutorConfig, getFilteredContent } from '../data/vimtutor'
import { initGameState, tick, handleCommandExecuted } from '../engine/ChallengeEngine'
import { loadUnsupported } from '../engine/UnsupportedEngine'
import type { GameState, VimCommandData, GameConfig } from '../engine/types'
import rawData from '../data.json'
import { useReducer } from 'react'

const allCommands = rawData as VimCommandData[]

function buildArcadeConfig(config: VimTutorConfig): GameConfig {
  return {
    mode: 'general',
    language: 'typescript',
    startingLevel: config.challengeStartingLevel,
    repetitionTarget: config.challengeRepetition,
    guidedMode: config.challengeGuidedMode,
    categories: config.challengeCategories.length > 0 ? config.challengeCategories : null,
    dynamicAssist: null,
    skipUnsupported: false,
    commandTimeMultiplier: config.challengeTimeMultiplier,
    knowledgeFilter: 'all',
    drillMode: config.challengeDrillMode,
  }
}

function filterCommands(config: VimTutorConfig): VimCommandData[] {
  let cmds =
    config.challengeCategories.length > 0
      ? allCommands.filter(c => config.challengeCategories.includes(c.category))
      : allCommands
  const unsupported = loadUnsupported()
  cmds = cmds.filter(c => !unsupported.has(c.id))
  if (config.challengeStartingLevel > 0) {
    cmds = cmds.filter(c => c.level >= config.challengeStartingLevel)
  }
  return cmds
}

// ── Arcade state management ───────────────────────────────────────────────────

type ArcadeAction =
  | { type: 'TICK'; newState: GameState }
  | { type: 'COMMAND'; newState: GameState }
  | { type: 'MARK_UNSUPPORTED'; commandId: string; newState: GameState }

function arcadeReducer(_state: GameState, action: ArcadeAction): GameState {
  return action.newState
}

// ── TutorEditor (no challenge) ────────────────────────────────────────────────

function TutorEditor({ content, chapter }: { content: string; chapter: number }) {
  const { editorRef, statusRef } = useMonacoEditor({
    language: 'plaintext',
    defaultValue: content,
  })

  return (
    <div className="flex flex-col h-full bg-gray-950">
      <div className="flex items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-gray-400 text-xs font-mono">vimtutor</span>
        <span className="ml-auto text-xs text-gray-500 font-mono uppercase">chapter {chapter}</span>
      </div>
      <div ref={editorRef} className="flex-1 min-h-0" />
      <div
        ref={statusRef}
        className="h-7 bg-gray-800 border-t border-gray-700 px-3 flex items-center text-xs font-mono text-gray-400"
      />
    </div>
  )
}

// ── TutorEditorWithChallenges ─────────────────────────────────────────────────

function TutorEditorWithChallenges({
  content,
  chapter,
  config,
}: {
  content: string
  chapter: number
  config: VimTutorConfig
}) {
  const arcadeConfigRef = useRef<GameConfig | null>(null)
  const arcadeCmdsRef = useRef<VimCommandData[]>([])
  const arcadeStateRef = useRef<GameState | null>(null)

  const [arcadeState, dispatchArcade] = useReducer(arcadeReducer, null, (): GameState => {
    const cfg = buildArcadeConfig(config)
    const cmds = filterCommands(config)
    arcadeConfigRef.current = cfg
    arcadeCmdsRef.current = cmds
    const state = initGameState(cfg, cmds)
    arcadeStateRef.current = state
    return state
  })

  const onCommandExecuted = useCallback((cmd: string) => {
    if (!arcadeStateRef.current || !arcadeCmdsRef.current.length) return
    const newState = handleCommandExecuted(
      arcadeStateRef.current,
      cmd,
      arcadeCmdsRef.current,
      Date.now()
    )
    arcadeStateRef.current = newState
    dispatchArcade({ type: 'COMMAND', newState })
  }, [])

  const { editorRef, statusRef } = useMonacoEditor({
    language: 'plaintext',
    defaultValue: content,
    onCommandExecuted,
  })

  useEffect(() => {
    const id = setInterval(() => {
      if (!arcadeStateRef.current || !arcadeCmdsRef.current.length) return
      const newState = tick(arcadeStateRef.current, arcadeCmdsRef.current, Date.now())
      arcadeStateRef.current = newState
      dispatchArcade({ type: 'TICK', newState })
    }, 100)
    return () => clearInterval(id)
  }, [])

  const onMarkUnsupported = useCallback((commandId: string) => {
    if (!arcadeStateRef.current) return
    arcadeCmdsRef.current = arcadeCmdsRef.current.filter(c => c.id !== commandId)
    // Re-init so the removed command is no longer queued
    if (arcadeConfigRef.current && arcadeCmdsRef.current.length > 0) {
      const newState = initGameState(arcadeConfigRef.current, arcadeCmdsRef.current)
      arcadeStateRef.current = newState
      dispatchArcade({ type: 'MARK_UNSUPPORTED', commandId, newState })
    }
  }, [])

  return (
    <div className="flex h-full overflow-hidden">
      {/* Editor pane */}
      <div className="flex-[3] flex flex-col min-w-0 bg-gray-950">
        <div className="flex items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
          <span className="text-gray-400 text-xs font-mono">vimtutor</span>
          <span className="ml-auto text-xs text-gray-500 font-mono uppercase">
            chapter {chapter}
          </span>
        </div>
        <div ref={editorRef} className="flex-1 min-h-0" />
        <div
          ref={statusRef}
          className="h-7 bg-gray-800 border-t border-gray-700 px-3 flex items-center text-xs font-mono text-gray-400"
        />
      </div>

      {/* Challenge sidebar */}
      <div className="flex-[2] flex flex-col border-l border-gray-700 min-w-0 overflow-hidden">
        <div className="p-3 border-b border-gray-700 flex gap-3 items-start flex-shrink-0">
          <ScoreDisplay score={arcadeState.score} combo={arcadeState.combo} />
          <LevelIndicator ceiling={arcadeState.ceiling} levelPct={arcadeState.levelPct} />
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <ChallengePanel
            challenges={arcadeState.activeChallenges}
            onMarkUnsupported={onMarkUnsupported}
          />
        </div>
      </div>
    </div>
  )
}

// ── VimTutorScreen ────────────────────────────────────────────────────────────

interface VimTutorScreenProps {
  config: VimTutorConfig
  onBack: () => void
}

export function VimTutorScreen({ config, onBack }: VimTutorScreenProps) {
  const content = getFilteredContent(config.chapter, config.sections)

  const sectionLabel = config.sections.length === 0 ? 'all lessons' : config.sections.join(', ')

  return (
    <div className="h-full flex flex-col">
      <TopBar title="VimTutor" onBack={onBack}>
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
          <BookOpen className="w-4 h-4" />
          <span>Ch. {config.chapter}</span>
          <span className="text-gray-600">·</span>
          <span>{sectionLabel}</span>
        </div>
      </TopBar>
      <div className="flex-1 min-h-0">
        {config.challengeMode ? (
          <TutorEditorWithChallenges content={content} chapter={config.chapter} config={config} />
        ) : (
          <TutorEditor content={content} chapter={config.chapter} />
        )}
      </div>
    </div>
  )
}
