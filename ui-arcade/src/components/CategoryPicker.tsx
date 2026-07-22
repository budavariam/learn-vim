import { useState } from 'react'
import {
  ALL_CATEGORIES,
  DEFAULT_CATEGORIES,
  getCategoryColor,
  MIN_CATEGORIES,
} from '../engine/categoryColors'
import {
  loadCategoryPresets,
  addCategoryPreset,
  deleteCategoryPreset,
  type CategoryPresetStore,
} from '../engine/KnownEngine'

interface CategoryPickerProps {
  selected: string[]
  onChange: (cats: string[]) => void
}

export function CategoryPicker({ selected, onChange }: CategoryPickerProps) {
  const [presets, setPresets] = useState<CategoryPresetStore[]>(loadCategoryPresets)
  const [savingName, setSavingName] = useState('')
  const [showSaveInput, setShowSaveInput] = useState(false)

  const selSet = new Set(selected)
  const allSelected = selected.length === ALL_CATEGORIES.length
  const tooFew = selected.length < MIN_CATEGORIES

  function toggle(cat: string) {
    if (selSet.has(cat)) {
      onChange(selected.filter(c => c !== cat))
    } else {
      onChange([...selected, cat])
    }
  }

  function applyPreset(cats: string[]) {
    onChange(cats)
  }

  function handleSavePreset() {
    if (!savingName.trim() || selected.length === 0) return
    const updated = addCategoryPreset(savingName.trim(), [...selected])
    setPresets(updated)
    setSavingName('')
    setShowSaveInput(false)
  }

  function handleDeletePreset(name: string) {
    const updated = deleteCategoryPreset(name)
    setPresets(updated)
  }

  if (ALL_CATEGORIES.length === 0) {
    return (
      <p className="text-gray-600 font-mono text-xs italic">
        No categories yet — generate data.json first.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {/* Quick actions */}
      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={() => onChange([...ALL_CATEGORIES])}
          className={`px-3 py-1 rounded font-mono text-xs border transition-all ${
            allSelected
              ? 'bg-gray-600 border-gray-500 text-white'
              : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-400'
          }`}
        >
          All
        </button>
        <button
          onClick={() => onChange([])}
          className="px-3 py-1 rounded font-mono text-xs border border-gray-600 bg-gray-800 text-gray-400 hover:border-gray-400 transition-all"
        >
          None
        </button>
        <button
          onClick={() => onChange([...DEFAULT_CATEGORIES])}
          className="px-3 py-1 rounded font-mono text-xs border border-gray-600 bg-gray-800 text-gray-400 hover:border-gray-400 transition-all"
        >
          Defaults
        </button>

        <span className="text-gray-700 font-mono text-xs">·</span>

        {/* Preset chips */}
        {presets.map(p => (
          <div key={p.name} className="flex items-center gap-0.5">
            <button
              onClick={() => applyPreset(p.categories)}
              className="px-3 py-1 rounded-l font-mono text-xs border border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-400 hover:text-white transition-all"
            >
              {p.name}
            </button>
            <button
              onClick={() => handleDeletePreset(p.name)}
              className="px-1.5 py-1 rounded-r font-mono text-xs border border-l-0 border-gray-600 bg-gray-800 text-gray-600 hover:text-red-400 hover:border-red-700 transition-all focus-visible:ring-2 focus-visible:ring-red-500"
              title={`Delete preset "${p.name}"`}
              aria-label={`Delete preset "${p.name}"`}
            >
              ×
            </button>
          </div>
        ))}

        {/* Save preset */}
        {showSaveInput ? (
          <div className="flex items-center gap-1">
            <input
              autoFocus
              value={savingName}
              onChange={e => setSavingName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSavePreset()
                if (e.key === 'Escape') { setShowSaveInput(false); setSavingName('') }
              }}
              placeholder="Preset name…"
              className="px-2 py-1 rounded font-mono text-xs bg-gray-700 border border-gray-500 text-white placeholder-gray-500 w-32 focus:outline-none focus:border-green-500"
            />
            <button
              onClick={handleSavePreset}
              className="px-2 py-1 rounded font-mono text-xs border border-green-700 bg-green-900/30 text-green-400 hover:bg-green-900/60 transition-all"
            >
              Save
            </button>
            <button
              onClick={() => { setShowSaveInput(false); setSavingName('') }}
              className="px-2 py-1 rounded font-mono text-xs border border-gray-600 text-gray-500 hover:text-gray-300 transition-all"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowSaveInput(true)}
            className="px-3 py-1 rounded font-mono text-xs border border-dashed border-gray-600 text-gray-500 hover:border-gray-400 hover:text-gray-300 transition-all"
            title="Save current selection as a preset"
          >
            + Save preset
          </button>
        )}
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        {ALL_CATEGORIES.map(cat => {
          const active = selSet.has(cat)
          const color  = getCategoryColor(cat)
          return (
            <button
              key={cat}
              onClick={() => toggle(cat)}
              style={active
                ? { borderColor: color, backgroundColor: `${color}28`, color }
                : { borderColor: '#374151', color: '#6b7280' }
              }
              className="px-3 py-1.5 rounded-lg border font-mono text-xs transition-all hover:opacity-90 flex items-center gap-1.5"
            >
              <span
                style={{ backgroundColor: active ? color : '#4b5563' }}
                className="inline-block w-2 h-2 rounded-full flex-shrink-0"
              />
              {cat}
            </button>
          )
        })}
      </div>

      {/* Validation feedback */}
      {tooFew && (
        <p className="text-yellow-500 font-mono text-xs">
          Select at least {MIN_CATEGORIES} categories to start
          {selected.length > 0 ? ` (${selected.length} selected)` : ''}.
        </p>
      )}
      {!tooFew && (
        <p className="text-gray-600 font-mono text-xs">
          {selected.length === ALL_CATEGORIES.length
            ? 'All categories selected'
            : `${selected.length} of ${ALL_CATEGORIES.length} categories`}
        </p>
      )}
    </div>
  )
}
