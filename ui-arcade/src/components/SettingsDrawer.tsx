import { useEffect, useRef, useState } from 'react'
import type React from 'react'
import type { GameSettings, GuidedMode } from '../engine/types'

const GUIDED_OPTIONS: { id: GuidedMode; label: string }[] = [
  { id: 'none',               label: 'None' },
  { id: 'first_only',         label: 'First only' },
  { id: 'after_failure',      label: 'After failure' },
  { id: 'first_then_failure', label: 'First + on failure' },
  { id: 'alternating',        label: 'Alternating' },
  { id: 'all',                label: 'Always' },
]

interface SettingsDrawerProps {
  settings: GameSettings
  onUpdate: (patch: Partial<GameSettings>) => void
  triggerRef?: React.RefObject<HTMLElement>
}

export function SettingsDrawer({ settings, onUpdate, triggerRef }: SettingsDrawerProps) {
  const [open, setOpen] = useState(false)
  const firstRadioRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Cmd+Shift+P (Mac) or Ctrl+Shift+P (other)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault()
        setOpen(prev => !prev)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) {
      firstRadioRef.current?.focus()
    } else {
      triggerRef?.current?.focus()
    }
  }, [open, triggerRef])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 pointer-events-auto"
        onClick={() => setOpen(false)}
      />

      {/* Drawer panel */}
      <div
        className="relative z-10 bg-gray-900 border border-gray-600 rounded-xl shadow-2xl w-full max-w-sm pointer-events-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <span className="text-white font-mono font-bold text-sm">Settings</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-mono text-xs">⌘⇧P to close</span>
            <button
              aria-label="Close settings"
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white font-mono text-sm px-1 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <p className="text-gray-400 font-mono text-xs uppercase tracking-wider mb-2">Guided Mode</p>
            <div className="space-y-1">
              {GUIDED_OPTIONS.map((g, index) => (
                <label
                  key={g.id}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                    settings.guidedMode === g.id
                      ? 'bg-purple-900/40 text-purple-300'
                      : 'text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  <input
                    type="radio" name="live-guided"
                    ref={index === 0 ? firstRadioRef : undefined}
                    checked={settings.guidedMode === g.id}
                    onChange={() => onUpdate({ guidedMode: g.id })}
                    className="accent-purple-500"
                  />
                  <span className="font-mono text-sm">{g.label}</span>
                </label>
              ))}
            </div>
          </div>

          <hr className="border-gray-700" />

          <div>
            <p className="text-gray-400 font-mono text-xs uppercase tracking-wider mb-2">Keyboard Shortcuts</p>
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 items-center">
              <kbd className="px-1.5 py-0.5 rounded bg-gray-800 border border-gray-600 font-mono text-xs text-gray-300 whitespace-nowrap">⌘⇧P</kbd>
              <span className="font-mono text-xs text-gray-500">Open / close settings</span>

              <kbd className="px-1.5 py-0.5 rounded bg-gray-800 border border-gray-600 font-mono text-xs text-gray-300 whitespace-nowrap">?</kbd>
              <span className="font-mono text-xs text-gray-500">Keyboard shortcuts overlay</span>

              <kbd className="px-1.5 py-0.5 rounded bg-gray-800 border border-gray-600 font-mono text-xs text-gray-300 whitespace-nowrap">ℹ</kbd>
              <span className="font-mono text-xs text-gray-500">Game info modal</span>

              <kbd className="px-1.5 py-0.5 rounded bg-gray-800 border border-gray-600 font-mono text-xs text-gray-300 whitespace-nowrap">✕ Quit</kbd>
              <span className="font-mono text-xs text-gray-500">Return to setup screen</span>

              <kbd className="px-1.5 py-0.5 rounded bg-gray-800 border border-gray-600 font-mono text-xs text-gray-300 whitespace-nowrap">Esc</kbd>
              <span className="font-mono text-xs text-gray-500">Close overlays</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
