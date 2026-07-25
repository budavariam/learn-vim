import type React from 'react'
import { ArrowLeft } from 'lucide-react'

interface TopBarProps {
  title: string
  onBack: () => void
  backLabel?: React.ReactNode
  children?: React.ReactNode // extra controls to show on the right
}

/** Consistent top navigation bar used by all game/setup screens. */
export function TopBar({ title, onBack, backLabel, children }: TopBarProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-800 border-b border-gray-700 flex-shrink-0 flex-wrap font-mono">
      <button
        onClick={onBack}
        className="text-gray-400 hover:text-white text-sm px-3 py-1 rounded border border-gray-600 hover:border-gray-400 transition-colors flex items-center gap-1.5"
      >
        {backLabel ?? (
          <>
            <ArrowLeft className="w-4 h-4" /> Back
          </>
        )}
      </button>
      <span className="text-white font-bold text-base">{title}</span>
      {children && (
        <div className="flex items-center gap-3 ml-auto flex-wrap text-sm">{children}</div>
      )}
    </div>
  )
}
