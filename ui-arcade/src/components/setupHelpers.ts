// ── Style tokens ──────────────────────────────────────────────────────────────

export const cls = {
  /** Standard selectable pill — active: blue */
  pill: (active: boolean) =>
    `px-4 py-2 rounded border text-sm font-mono transition-colors ${
      active
        ? 'bg-blue-700 border-blue-500 text-white font-bold'
        : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'
    }`,

  /** Language button — active: green, icon-left inline layout */
  lang: (active: boolean) =>
    `flex items-center px-3 py-2 rounded border text-xs font-mono transition-colors ${
      active
        ? 'bg-green-900/30 border-green-500 text-green-300 font-bold'
        : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'
    }`,

  /** Mode/end-condition card with subtitle — active: blue */
  modeCard: (active: boolean) =>
    `py-2.5 px-3 rounded border text-sm font-mono transition-colors text-left w-full ${
      active
        ? 'bg-blue-700 border-blue-500 text-white'
        : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'
    }`,
} as const

// ── Shared time-multiplier options ────────────────────────────────────────────
export const TIME_MULTIPLIER_OPTIONS = [
  { value: 1.0, label: '1×', desc: 'Default pace' },
  { value: 1.5, label: '1.5×', desc: 'Slower' },
  { value: 2.0, label: '2×', desc: 'Relaxed' },
  { value: 3.0, label: '3×', desc: 'No rush' },
] as const

// ── patchReducer ─────────────────────────────────────────────────────────────
// Replaces the (s, a) => ({ ...s, ...a.payload }) pattern used in 7 setup reducers.
export function patchReducer<S>(s: S, a: { type: 'PATCH'; payload: Partial<S> }): S {
  return { ...s, ...a.payload }
}

// ── toggleCategory ────────────────────────────────────────────────────────────
// Toggle cat in/out of the list; never removes the last item.
export function toggleCategory(categories: string[], cat: string): string[] {
  if (categories.includes(cat)) {
    return categories.length > 1 ? categories.filter(c => c !== cat) : categories
  }
  return [...categories, cat]
}
