import { useEffect } from 'react'

const HJKL_KEYS = new Set(['h', 'j', 'k', 'l'])

/**
 * Enforces hjklOnly / noHjkl key restrictions while the game is playing.
 * hjklOnly — only h/j/k/l (plus Escape, numbers, colon) are allowed.
 * noHjkl   — h/j/k/l are blocked; word/search motions required.
 * The two are mutually exclusive; hjklOnly takes precedence if both are set.
 */
export function useKeyRestriction(
  config: { hjklOnly?: boolean; noHjkl?: boolean } | undefined | null,
  isPlaying: boolean
) {
  const hjklOnly = config?.hjklOnly ?? false
  const noHjkl = config?.noHjkl ?? false

  useEffect(() => {
    if (!hjklOnly && !noHjkl) return

    function onKey(e: KeyboardEvent) {
      if (!isPlaying) return
      if (e.ctrlKey || e.altKey || e.metaKey) return
      if (e.key.length !== 1) return
      if (noHjkl && HJKL_KEYS.has(e.key)) {
        e.preventDefault()
        e.stopPropagation()
      } else if (hjklOnly && !HJKL_KEYS.has(e.key)) {
        if (!':0123456789'.includes(e.key)) {
          e.preventDefault()
          e.stopPropagation()
        }
      }
    }

    document.addEventListener('keydown', onKey, { capture: true })
    return () => document.removeEventListener('keydown', onKey, { capture: true })
  }, [isPlaying, hjklOnly, noHjkl])
}
