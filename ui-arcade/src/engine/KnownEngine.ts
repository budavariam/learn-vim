import { STORAGE_KEYS } from './storageKeys'

// ── known items ───────────────────────────────────────────────────────────────

export interface CategoryPresetStore {
  name: string
  categories: string[]
}

export function loadKnown(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.KNOWN_ITEMS)
    return new Set(raw ? (JSON.parse(raw) as string[]) : [])
  } catch {
    return new Set()
  }
}

export function saveKnown(known: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.KNOWN_ITEMS, JSON.stringify([...known]))
  } catch {
    /* ignore */
  }
}

export function isKnown(id: string): boolean {
  return loadKnown().has(id)
}

export function markKnown(ids: string[]): void {
  const known = loadKnown()
  for (const id of ids) known.add(id)
  saveKnown(known)
}

export function toggleKnown(id: string): void {
  const known = loadKnown()
  if (known.has(id)) known.delete(id)
  else known.add(id)
  saveKnown(known)
}

// ── suggestion logic ──────────────────────────────────────────────────────────

export function shouldSuggestKnown(completions: number, failures: number): boolean {
  const total = completions + failures
  return total >= 3 && completions / total >= 0.6
}

// ── category presets ─────────────────────────────────────────────────────────

export function loadCategoryPresets(): CategoryPresetStore[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORY_PRESETS)
    return raw ? (JSON.parse(raw) as CategoryPresetStore[]) : []
  } catch {
    return []
  }
}

export function saveCategoryPresets(presets: CategoryPresetStore[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORY_PRESETS, JSON.stringify(presets))
  } catch {
    /* ignore */
  }
}

export function addCategoryPreset(name: string, categories: string[]): CategoryPresetStore[] {
  const presets = loadCategoryPresets().filter(p => p.name !== name)
  presets.push({ name, categories })
  saveCategoryPresets(presets)
  return presets
}

export function deleteCategoryPreset(name: string): CategoryPresetStore[] {
  const presets = loadCategoryPresets().filter(p => p.name !== name)
  saveCategoryPresets(presets)
  return presets
}
