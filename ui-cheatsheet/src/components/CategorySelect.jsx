import { useState, useEffect, useRef } from 'react'
import { getCategoryColor } from '../constants'

export default function CategorySelect({ categories, selected, onChange }) {
  // selected: Set|null, onChange: (Set|null) => void
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  const count = selected?.size ?? 0

  const toggle = (cat) => {
    const next = new Set(selected ?? [])
    if (next.has(cat)) next.delete(cat); else next.add(cat)
    onChange(next.size === 0 ? null : next)
  }

  const clear = (e) => {
    e.stopPropagation()
    onChange(null)
  }

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition-colors ${
          count > 0
            ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300'
            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-400'
        }`}
      >
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 8h10M10 12h4" />
        </svg>
        {count === 0
          ? 'All categories'
          : `${count} categor${count === 1 ? 'y' : 'ies'}`
        }
        {count > 0 && (
          <span
            onClick={clear}
            role="button"
            aria-label="Clear category filter"
            className="ml-0.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-700 p-0.5 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
        )}
        <svg className={`w-3 h-3 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full mt-1 z-30 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-[13rem] max-h-72 overflow-y-auto py-1">
          {/* Select all / clear row */}
          <div className="flex gap-2 px-3 py-1.5 border-b border-gray-100 dark:border-gray-700">
            <button
              type="button"
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
              onClick={() => onChange(new Set(categories))}
            >
              All
            </button>
            <span className="text-gray-300 dark:text-gray-600">·</span>
            <button
              type="button"
              className="text-[11px] text-gray-500 dark:text-gray-400 hover:underline"
              onClick={() => onChange(null)}
            >
              None
            </button>
          </div>

          {categories.map(cat => {
            const checked = selected?.has(cat) ?? false
            const color = getCategoryColor(cat)
            return (
              <label
                key={cat}
                className="flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(cat)}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 w-3.5 h-3.5"
                />
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-gray-700 dark:text-gray-200 flex-1 min-w-0 truncate">
                  {cat}
                </span>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}
