import { useState } from 'react'
import type { ReviewItem } from '../engine/types'
import { getCategoryColor } from '../engine/categoryColors'
import { markKnown } from '../engine/KnownEngine'

interface SessionReviewScreenProps {
  items: ReviewItem[]
  onDone: () => void
}

export function SessionReviewScreen({ items, onDone }: SessionReviewScreenProps) {
  // Start with all suggested items checked, others unchecked
  const [checked, setChecked] = useState<Set<string>>(
    () => new Set(items.filter(i => i.suggestKnown && !i.alreadyKnown).map(i => i.commandId))
  )

  const suggested = items.filter(i => i.suggestKnown && !i.alreadyKnown)
  const rest       = items.filter(i => !i.suggestKnown || i.alreadyKnown)
  const alreadyKnown = items.filter(i => i.alreadyKnown)

  function toggle(id: string) {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleSave() {
    const toMark = [...checked]
    if (toMark.length > 0) markKnown(toMark)
    onDone()
  }

  const newlyMarked = [...checked].filter(id => !items.find(i => i.commandId === id)?.alreadyKnown)

  return (
    <div className="min-h-screen bg-gray-900 overflow-y-auto">
      <div className="max-w-2xl mx-auto py-10 px-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white font-mono">Session Review</h1>
            <p className="text-gray-500 font-mono text-sm mt-1">
              {items.length} commands encountered this session
            </p>
          </div>
        </div>

        {/* Suggested section */}
        {suggested.length > 0 && (
          <section>
            <h2 className="text-green-400 font-mono text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>✓ Looks learned</span>
              <span className="text-gray-600">— mark as known?</span>
            </h2>
            <div className="space-y-2">
              {suggested.map(item => (
                <ReviewRow
                  key={item.commandId}
                  item={item}
                  checked={checked.has(item.commandId)}
                  onToggle={() => toggle(item.commandId)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Still learning section */}
        {rest.filter(i => !i.alreadyKnown).length > 0 && (
          <section>
            <h2 className="text-yellow-500 font-mono text-xs uppercase tracking-wider mb-3">
              Still practicing
            </h2>
            <div className="space-y-2">
              {rest.filter(i => !i.alreadyKnown).map(item => (
                <ReviewRow
                  key={item.commandId}
                  item={item}
                  checked={checked.has(item.commandId)}
                  onToggle={() => toggle(item.commandId)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Already known */}
        {alreadyKnown.length > 0 && (
          <section>
            <h2 className="text-gray-600 font-mono text-xs uppercase tracking-wider mb-3">
              Already known
            </h2>
            <div className="space-y-2">
              {alreadyKnown.map(item => (
                <ReviewRow
                  key={item.commandId}
                  item={item}
                  checked={false}
                  onToggle={() => {}}
                  readonly
                />
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white font-mono font-bold rounded-lg transition-colors"
          >
            {newlyMarked.length > 0
              ? `Mark ${newlyMarked.length} as known & finish`
              : 'Done'}
          </button>
          <button
            onClick={onDone}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-400 font-mono text-sm rounded-lg border border-gray-700"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Row component ─────────────────────────────────────────────────────────────

interface ReviewRowProps {
  item: ReviewItem
  checked: boolean
  onToggle: () => void
  readonly?: boolean
}

function ReviewRow({ item, checked, onToggle, readonly = false }: ReviewRowProps) {
  const total  = item.completions + item.failures
  const pct    = total > 0 ? Math.round((item.completions / total) * 100) : 0
  const color  = getCategoryColor(item.category)

  const barColor = pct >= 80 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <div
      className={`bg-gray-800 rounded-lg p-3 border transition-all ${
        readonly
          ? 'border-gray-700 opacity-50'
          : checked
            ? 'border-green-700 cursor-pointer hover:border-green-500'
            : 'border-gray-700 cursor-pointer hover:border-gray-500'
      }`}
      onClick={readonly ? undefined : onToggle}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        {!readonly && (
          <div className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
            checked ? 'border-green-500 bg-green-500' : 'border-gray-600'
          }`}>
            {checked && <span className="text-white text-xs leading-none">✓</span>}
          </div>
        )}
        {readonly && (
          <div className="mt-0.5 w-4 h-4 flex items-center justify-center flex-shrink-0 text-gray-600 text-xs">
            ●
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className="text-xs px-2 py-0.5 rounded font-mono"
              style={{ color, borderColor: color, border: '1px solid', backgroundColor: `${color}18` }}
            >
              {item.category}
            </span>
            <span className="text-xs text-gray-500 font-mono">Lv{item.level}</span>
          </div>
          <p className="text-white text-sm font-mono">{item.question}</p>
          <div className="flex items-center gap-3 mt-1.5">
            {/* Solution */}
            <div className="flex gap-1">
              {item.solution.slice(0, 3).map((sol, i) => (
                <kbd key={i} className="px-1.5 py-0.5 bg-gray-700 text-yellow-300 font-mono text-xs rounded border border-gray-600">
                  {sol}
                </kbd>
              ))}
            </div>
            {/* Stats */}
            {total > 0 && (
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs font-mono" style={{ color: barColor }}>
                  {item.completions}/{total} ({pct}%)
                </span>
                <div className="w-16 bg-gray-700 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: barColor }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
