import { useEffect } from 'react'
import type { DiffLine, VimGolfChallenge } from '../engine/types'

interface VimGolfDiffProps {
  diffLines: DiffLine[]
  onClose: () => void
  challenge: VimGolfChallenge
}

function renderWithWs(text: string) {
  if (!text) return ' '
  return text.split('').map((ch, i) =>
    ch === ' '
      ? <span key={i} className="diff-ws"> </span>
      : ch
  )
}

export function VimGolfDiff({ diffLines, onClose, challenge }: VimGolfDiffProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h2 className="font-mono font-bold text-white text-lg">Diff — Expected vs Current</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white font-mono text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-2 px-6 py-2 bg-gray-800 border-b border-gray-700">
          <span className="font-mono text-xs uppercase tracking-wider text-gray-400">Current</span>
          <span className="font-mono text-xs uppercase tracking-wider text-gray-400">Expected</span>
        </div>

        {/* Diff lines */}
        <div className="overflow-y-auto flex-1 font-mono text-sm">
          {diffLines.map((line, idx) => {
            if (line.type === 'equal') {
              return (
                <div key={idx} className="grid grid-cols-2 px-6 py-0.5">
                  <span className="text-gray-500 whitespace-pre truncate">{renderWithWs(line.content)}</span>
                  <span className="text-gray-500 whitespace-pre truncate">{renderWithWs(line.content)}</span>
                </div>
              )
            }
            if (line.type === 'removed') {
              return (
                <div key={idx} className="grid grid-cols-2 px-6 py-0.5 bg-red-900/40">
                  <span className="text-red-300 whitespace-pre truncate">
                    <span className="text-red-500 mr-1">−</span>{renderWithWs(line.content)}
                  </span>
                  <span className="text-gray-600">—</span>
                </div>
              )
            }
            // added
            return (
              <div key={idx} className="grid grid-cols-2 px-6 py-0.5 bg-green-900/40">
                <span className="text-gray-600">—</span>
                <span className="text-green-300 whitespace-pre truncate">
                  <span className="text-green-500 mr-1">+</span>{renderWithWs(line.content)}
                </span>
              </div>
            )
          })}
        </div>

        {/* Expected result */}
        <div className="border-t border-gray-700 px-6 py-4">
          <p className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-2">Expected result</p>
          <pre className="bg-gray-800 rounded-lg p-3 text-green-300 font-mono text-sm overflow-x-auto max-h-40 overflow-y-auto whitespace-pre">
            {challenge.end}
          </pre>
        </div>

        <div className="px-6 py-3 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 font-mono text-sm rounded-lg transition-colors"
          >
            Close (Esc)
          </button>
        </div>
      </div>
    </div>
  )
}
