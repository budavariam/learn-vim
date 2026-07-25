import { STORAGE_KEYS } from './storageKeys'

const DEFAULT_USERNAME = 'vim-user'

export function loadUsername(): string {
  try {
    const v = localStorage.getItem(STORAGE_KEYS.USERNAME)
    return v && /^[a-zA-Z0-9]{2,20}$/.test(v) ? v : DEFAULT_USERNAME
  } catch {
    return DEFAULT_USERNAME
  }
}

export function saveUsername(name: string): void {
  if (!/^[a-zA-Z0-9]{2,20}$/.test(name)) return
  try {
    localStorage.setItem(STORAGE_KEYS.USERNAME, name)
  } catch {
    /* ignore */
  }
}
