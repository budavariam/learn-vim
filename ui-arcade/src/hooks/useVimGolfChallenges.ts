import { useState, useEffect, useRef } from 'react'
import type { VimGolfChallenge } from '../engine/types'
import { BUILTIN_CHALLENGES } from '../engine/vimgolfChallenges'
import OrgWorker from '../workers/orgParser.worker?worker'

export interface VimGolfChallengesResult {
  challenges: VimGolfChallenge[]
  loading: boolean
}

// Module-level cache — parsed once per session, shared across all hook callers
let _cached: VimGolfChallenge[] | null = null
let _promise: Promise<VimGolfChallenge[]> | null = null

function startWorker(): Promise<VimGolfChallenge[]> {
  if (_promise) return _promise
  _promise = new Promise(resolve => {
    const worker = new OrgWorker()
    worker.onmessage = (e: MessageEvent<VimGolfChallenge[]>) => {
      worker.terminate()
      // Merge: built-ins first (they have curated IDs / tags), then org challenges
      // Deduplicate by title to avoid showing the same challenge twice
      const orgChallenges = e.data
      const builtinTitles = new Set(BUILTIN_CHALLENGES.map(c => c.title.toLowerCase()))
      const uniqueOrg = orgChallenges.filter(c => !builtinTitles.has(c.title.toLowerCase()))
      _cached = [...BUILTIN_CHALLENGES, ...uniqueOrg]
      resolve(_cached)
    }
    worker.onerror = () => {
      worker.terminate()
      _cached = BUILTIN_CHALLENGES
      resolve(_cached)
    }
  })
  return _promise
}

/** Synchronous access to the cached challenge list (populated after first load). Falls back to built-ins. */
export function getCachedChallenges(): VimGolfChallenge[] {
  return _cached ?? BUILTIN_CHALLENGES
}

/**
 * Returns all VimGolf challenges (built-ins + org file), loading on first call.
 * Subsequent calls return instantly from the module cache.
 */
export function useVimGolfChallenges(): VimGolfChallengesResult {
  const [challenges, setChallenges] = useState<VimGolfChallenge[]>(_cached ?? [])
  const [loading, setLoading] = useState(!_cached)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    if (_cached) {
      setChallenges(_cached)
      setLoading(false)
      return
    }
    startWorker().then(list => {
      if (!mounted.current) return
      setChallenges(list)
      setLoading(false)
    })
    return () => {
      mounted.current = false
    }
  }, [])

  return { challenges, loading }
}
