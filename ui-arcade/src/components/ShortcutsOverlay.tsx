import { useEffect, useRef } from 'react'

interface ShortcutsOverlayProps {
  onClose: () => void
}

export function ShortcutsOverlay({ onClose }: ShortcutsOverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    panelRef.current?.focus()
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
        className="bg-gray-900 border border-gray-600 rounded-xl p-6 max-w-md w-full mx-4 focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="shortcuts-title" className="text-white font-mono font-bold text-lg mb-5">
          Keyboard Shortcuts
        </h2>

        <div className="space-y-5">
          {/* General shortcuts */}
          <div>
            <p className="text-gray-400 font-mono text-xs uppercase tracking-wider mb-2">General</p>
            <table className="w-full text-sm font-mono">
              <tbody className="space-y-1">
                {[
                  ['?', 'Open this help overlay'],
                  ['Esc', 'Close overlays / Exit insert mode'],
                  ['⌘⇧P', 'Open settings drawer'],
                  ['Tab', 'Navigate between controls'],
                  ['Enter', 'Confirm / Submit (on setup screen)'],
                  ['← Back', 'Return to previous screen'],
                ].map(([key, action]) => (
                  <tr key={key} className="border-b border-gray-800">
                    <td className="py-1.5 pr-4 text-yellow-300 whitespace-nowrap">{key}</td>
                    <td className="py-1.5 text-gray-300">{action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* In-game shortcuts */}
          <div>
            <p className="text-gray-400 font-mono text-xs uppercase tracking-wider mb-2">In-game</p>
            <table className="w-full text-sm font-mono">
              <tbody>
                {[
                  ['F1', 'Monaco command palette (editor commands)'],
                  ['⌘⇧P', 'Toggle guided mode (live)'],
                  ['ℹ', 'View current game config'],
                  ['✕ Quit', 'Return to setup'],
                ].map(([key, action]) => (
                  <tr key={key} className="border-b border-gray-800">
                    <td className="py-1.5 pr-4 text-yellow-300 whitespace-nowrap">{key}</td>
                    <td className="py-1.5 text-gray-300">{action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-gray-600 font-mono text-xs text-center mt-5">
          Press Esc or click outside to close
        </p>
      </div>
    </div>
  )
}
