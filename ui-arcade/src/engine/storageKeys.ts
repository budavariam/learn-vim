/**
 * Central registry of every localStorage key used by this app.
 * All keys are prefixed with `vimarcade_` for namespace isolation.
 * Import STORAGE_KEYS here — never write key strings inline.
 */

export const STORAGE_KEYS = {
  HIGH_SCORES: 'vimarcade_high_scores',
  LAST_CONFIG: 'vimarcade_last_config',
  LAST_GOAL_CONFIG: 'vimarcade_last_goal_config',
  LAST_MOTION_CONFIG: 'vimarcade_last_motion_config',
  SKIP_UNSUPPORTED: 'vimarcade_skip_unsupported',
  UNSUPPORTED: 'vimarcade_unsupported',
  DEFAULTS_VERSION: 'vimarcade_defaults_version',
  USERNAME: 'vimarcade_username',
  CUSTOM_VG_CHALLENGES: 'vimarcade_custom_vgchallenges',
  /** Shared with ui-practice — intentionally no vimarcade_ prefix. */
  KNOWN_ITEMS: 'knownItems',
  CATEGORY_PRESETS: 'vimarcade_category_presets',
  VIMGOLF_SCORES: 'vimarcade_vimgolf_scores',
  /** Personal-best keystrokes per VimGolf challenge — lightweight map for filtering/sorting. */
  VIMGOLF_RECORDS: 'vimarcade_vimgolf_records',
  LAST_QVIMX_CONFIG: 'vimarcade_last_qvimx_config',
} as const

// ── One-time migration from legacy key names ──────────────────────────────────
// Run once at app startup (before first localStorage read).
// For each pair: if the new key is absent but the old key exists, copy and remove.
// KNOWN_ITEMS is intentionally absent — shared with ui-practice, never migrated.

const LEGACY_MIGRATIONS: [string, string][] = [
  ['vim_arcade_high_scores', STORAGE_KEYS.HIGH_SCORES],
  ['vim_arcade_last_config', STORAGE_KEYS.LAST_CONFIG],
  ['vim_arcade_skip_unsupported', STORAGE_KEYS.SKIP_UNSUPPORTED],
  ['vim_arcade_unsupported', STORAGE_KEYS.UNSUPPORTED],
  ['vim_arcade_defaults_version', STORAGE_KEYS.DEFAULTS_VERSION],
  ['vim_arcade_username', STORAGE_KEYS.USERNAME],
  ['vim_arcade_custom_vgchallenges', STORAGE_KEYS.CUSTOM_VG_CHALLENGES],
  ['vim_arcade_category_presets', STORAGE_KEYS.CATEGORY_PRESETS],
  ['vim_arcade_vimgolf_scores', STORAGE_KEYS.VIMGOLF_SCORES],
]

export function migrateStorage(): void {
  try {
    for (const [oldKey, newKey] of LEGACY_MIGRATIONS) {
      if (localStorage.getItem(newKey) !== null) continue // already on new key
      const value = localStorage.getItem(oldKey)
      if (value !== null) {
        localStorage.setItem(newKey, value)
        localStorage.removeItem(oldKey)
      }
    }
  } catch {
    /* quota or private-mode errors — proceed silently */
  }
}
