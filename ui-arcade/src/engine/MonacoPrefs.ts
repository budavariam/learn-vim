export interface MonacoUserPrefs {
  wordWrap: 'on' | 'off'
  fontSize: number
  lineNumbers: 'on' | 'off' | 'relative'
  renderWhitespace: 'none' | 'boundary' | 'all'
  minimap: boolean
  /** Prevent mouse clicks from repositioning the cursor — keeps navigation intentional. */
  disableMouse: boolean
}

export const MONACO_PREFS_DEFAULT: MonacoUserPrefs = {
  wordWrap: 'on',
  fontSize: 14,
  lineNumbers: 'on',
  renderWhitespace: 'all',
  minimap: false,
  disableMouse: true,
}

const STORAGE_KEY = 'vimarcade_monaco_prefs'

export function loadMonacoPrefs(): MonacoUserPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...MONACO_PREFS_DEFAULT }
    const parsed = JSON.parse(raw) as Partial<MonacoUserPrefs>
    return {
      wordWrap: parsed.wordWrap ?? MONACO_PREFS_DEFAULT.wordWrap,
      fontSize: parsed.fontSize ?? MONACO_PREFS_DEFAULT.fontSize,
      lineNumbers: parsed.lineNumbers ?? MONACO_PREFS_DEFAULT.lineNumbers,
      renderWhitespace: parsed.renderWhitespace ?? MONACO_PREFS_DEFAULT.renderWhitespace,
      minimap: parsed.minimap ?? MONACO_PREFS_DEFAULT.minimap,
      disableMouse: parsed.disableMouse ?? MONACO_PREFS_DEFAULT.disableMouse,
    }
  } catch {
    return { ...MONACO_PREFS_DEFAULT }
  }
}

export function saveMonacoPrefs(prefs: MonacoUserPrefs): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  } catch {
    /* ignore */
  }
}
