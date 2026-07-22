import { useState, useCallback, useRef, useEffect } from 'react'
import type { GameState } from '../engine/types'
import { Editor } from './Editor'
import { ChallengePanel } from './ChallengePanel'
import { ScoreDisplay } from './ScoreDisplay'
import { LevelIndicator } from './LevelIndicator'
import { ComboNotification } from './ComboNotification'
import { SettingsDrawer } from './SettingsDrawer'
import { KeystrokeDebug } from './KeystrokeDebug'
import { ShortcutsOverlay } from './ShortcutsOverlay'
import type { GameSettings } from '../engine/types'
import type { KeyDisplayEvent } from '../hooks/useMonacoEditor'

const MAX_LOG_CHARS = 120

interface ArcadeGameProps {
  state: GameState
  onCommandExecuted: (cmd: string) => void
  onUpdateSettings: (patch: Partial<GameSettings>) => void
  onQuit: () => void
  onMarkUnsupported: (commandId: string) => void
}

const MODE_LABELS: Record<string, string> = {
  general: 'General',
  timed_challenge: 'Timed Challenge',
  survival: 'Survival',
}

export function ArcadeGame({ state, onCommandExecuted, onUpdateSettings, onQuit, onMarkUnsupported }: ArcadeGameProps) {
  const [showInfo, setShowInfo] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [keystrokeLog, setKeystrokeLog] = useState('')
  const panelRef = useRef<HTMLDivElement>(null)
  const infoButtonRef = useRef<HTMLButtonElement>(null)
  const settingsTriggerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (showInfo) panelRef.current?.focus()
  }, [showInfo])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      if (e.key === '?' && target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        setShowShortcuts(prev => !prev)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const handleKeyDisplay = useCallback((event: KeyDisplayEvent) => {
    if (!event.display) return
    setKeystrokeLog(prev => {
      const next = prev + event.display
      return next.length > MAX_LOG_CHARS ? next.slice(next.length - MAX_LOG_CHARS) : next
    })
  }, [])

  const isTimed = state.config.mode === 'timed_challenge'
  const isSurvival = state.config.mode === 'survival'
  const timedPct = isTimed && state.config.timedDurationMs
    ? Math.min(100, (state.sessionElapsedMs / state.config.timedDurationMs) * 100)
    : 0
  const timedRemaining = isTimed && state.config.timedDurationMs
    ? Math.max(0, Math.ceil((state.config.timedDurationMs - state.sessionElapsedMs) / 1000))
    : 0

  const dynamicAssistLabel = state.config.dynamicAssist === null
    ? 'off'
    : `${state.config.dynamicAssist}% of limit`

  const categoriesLabel = state.config.categories === null
    ? 'All categories'
    : state.config.categories.join(', ')

  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden relative">
      {isTimed && (
        <div className="w-full bg-gray-800 h-1.5 relative">
          <div
            className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-100"
            style={{ width: `${100 - timedPct}%` }}
          />
          <div className="absolute right-2 top-0 -translate-y-full pb-0.5 text-xs text-blue-300 font-mono">
            {timedRemaining}s
          </div>
        </div>
      )}

      {isSurvival && (
        <div className="bg-red-900/60 border-b border-red-700 text-center py-1">
          <span className="text-red-300 font-mono text-xs uppercase tracking-widest font-bold">
            ⚠ SURVIVAL — one miss ends it
          </span>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-[3] flex flex-col min-w-0">
          <Editor
            language={state.language}
            onCommandExecuted={onCommandExecuted}
            onKeyDisplay={handleKeyDisplay}
          />
        </div>

        <div className="flex-[2] flex flex-col border-l border-gray-700 min-w-0 overflow-y-auto">
          <div className="p-4 border-b border-gray-700 flex gap-4 items-start">
            <ScoreDisplay score={state.score} combo={state.combo} />
            <LevelIndicator ceiling={state.ceiling} levelPct={state.levelPct} />
          </div>
          <div className="px-4 pt-3 pb-1 flex gap-2">
            <button
              onClick={onQuit}
              className="text-xs font-mono px-2 py-1 rounded bg-gray-800 text-gray-400 hover:bg-red-900/50 hover:text-red-300 border border-gray-700 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              ✕ Quit
            </button>
            <button
              ref={infoButtonRef}
              onClick={() => setShowInfo(true)}
              className="text-xs font-mono px-2 py-1 rounded bg-gray-800 text-gray-400 hover:bg-blue-900/50 hover:text-blue-300 border border-gray-700 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              ℹ Info
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <ChallengePanel challenges={state.activeChallenges} onMarkUnsupported={onMarkUnsupported} />
          </div>
          <div className="px-4 pb-3 text-xs text-gray-600 font-mono text-center">
            ⌘⇧P settings · ? shortcuts
          </div>
        </div>
      </div>

      <ComboNotification notifications={state.recentNotifications} />
      <SettingsDrawer settings={state.liveSettings} onUpdate={onUpdateSettings} triggerRef={settingsTriggerRef} />
      <KeystrokeDebug log={keystrokeLog} />

      {showShortcuts && <ShortcutsOverlay onClose={() => setShowShortcuts(false)} />}

      {showInfo && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
          onClick={() => setShowInfo(false)}
          onKeyDown={(e) => { if (e.key === 'Escape') { setShowInfo(false); infoButtonRef.current?.focus() } }}
        >
          <div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="info-modal-title"
            className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-sm w-full mx-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="info-modal-title" className="text-white font-mono font-bold text-lg mb-4">Game Info</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-400 text-xs font-mono">Mode</span>
              <span className="text-white text-sm font-mono">{MODE_LABELS[state.config.mode] ?? state.config.mode}</span>

              <span className="text-gray-400 text-xs font-mono">Language</span>
              <span className="text-white text-sm font-mono">{state.config.language}</span>

              <span className="text-gray-400 text-xs font-mono">Starting level</span>
              <span className="text-white text-sm font-mono">{state.config.startingLevel}</span>

              <span className="text-gray-400 text-xs font-mono">Level ceiling</span>
              <span className="text-white text-sm font-mono">{state.ceiling}</span>

              <span className="text-gray-400 text-xs font-mono">Repetition target</span>
              <span className="text-white text-sm font-mono">{state.config.repetitionTarget}</span>

              <span className="text-gray-400 text-xs font-mono">Guided mode</span>
              <span className="text-white text-sm font-mono">{state.config.guidedMode}</span>

              <span className="text-gray-400 text-xs font-mono">Dynamic assist</span>
              <span className="text-white text-sm font-mono">{dynamicAssistLabel}</span>

              <span className="text-gray-400 text-xs font-mono">Categories</span>
              <span className="text-white text-sm font-mono">{categoriesLabel}</span>

              <span className="text-gray-400 text-xs font-mono">Concurrent challenges</span>
              <span className="text-white text-sm font-mono">{state.maxConcurrent}</span>
            </div>
            <p className="text-gray-500 text-xs font-mono text-center mt-4">Click anywhere to close</p>
          </div>
        </div>
      )}
    </div>
  )
}
