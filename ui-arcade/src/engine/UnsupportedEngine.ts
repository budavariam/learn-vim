const UNSUPPORTED_KEY    = 'vim_arcade_unsupported'
const DEFAULTS_VER_KEY   = 'vim_arcade_defaults_version'

export function loadUnsupported(): Set<string> {
  try {
    const raw = localStorage.getItem(UNSUPPORTED_KEY)
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
  } catch { return new Set() }
}

export function saveUnsupported(ids: Set<string>): void {
  try { localStorage.setItem(UNSUPPORTED_KEY, JSON.stringify([...ids])) } catch { /* ignore */ }
}

export function markUnsupported(id: string): void {
  const set = loadUnsupported(); set.add(id); saveUnsupported(set)
}

export function unmarkUnsupported(id: string): void {
  const set = loadUnsupported(); set.delete(id); saveUnsupported(set)
}

export function isUnsupported(id: string): boolean {
  return loadUnsupported().has(id)
}

// ── Defaults seed ──────────────────────────────────────────────────────────

interface DefaultsFile {
  version: string
  unsupported: string[]
}

/**
 * Fetch /unsupported-defaults.json and merge its IDs into localStorage.
 * Uses a version key so new items from the file are only merged once per
 * version bump — preserving the user's own restores between loads.
 * Call this once at startup (awaited before first render) so components see
 * the merged list immediately.
 */
export async function loadAndMergeDefaults(): Promise<void> {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}unsupported-defaults.json`)
    if (!res.ok) return
    const { version, unsupported: defaults } = await res.json() as DefaultsFile

    const storedVer = localStorage.getItem(DEFAULTS_VER_KEY)
    if (storedVer === version) return  // already applied this version

    // Add any new default IDs the user hasn't seen yet
    const current = loadUnsupported()
    let changed = false
    for (const id of defaults) {
      if (!current.has(id)) { current.add(id); changed = true }
    }
    if (changed) saveUnsupported(current)
    localStorage.setItem(DEFAULTS_VER_KEY, version)
  } catch { /* network / parse errors — proceed silently */ }
}

// ── Export ─────────────────────────────────────────────────────────────────

/**
 * Trigger a browser download of the current unsupported list in the same
 * format as /unsupported-defaults.json so the file can be dropped straight
 * into public/ to seed new users.
 */
export function exportUnsupportedIds(): void {
  const ids = [...loadUnsupported()].sort()
  const payload: DefaultsFile = { version: 'v1', unsupported: ids }
  const json = JSON.stringify(payload, null, 2)
  const blob = new URL(
    `data:application/json;charset=utf-8,${encodeURIComponent(json)}`
  )
  const a = document.createElement('a')
  a.href = blob.href
  a.download = 'unsupported-defaults.json'
  a.click()
}
