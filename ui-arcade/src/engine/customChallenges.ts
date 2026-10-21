import { STORAGE_KEYS } from './storageKeys'
import type { VimGolfChallenge } from './types'

export function loadCustomChallenges(): VimGolfChallenge[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_VG_CHALLENGES)
    return raw ? (JSON.parse(raw) as VimGolfChallenge[]) : []
  } catch {
    return []
  }
}
