import type { VimGolfHighScores, VimGolfEntry, VimGolfChallenge, DiffLine } from './types'

const VIMGOLF_KEY = 'vim_arcade_vimgolf_scores'
export const VIMGOLF_MAX_ENTRIES = 10

// ── high scores ───────────────────────────────────────────────────────────────

export function loadVimGolfHighScores(): VimGolfHighScores {
  try {
    const raw = localStorage.getItem(VIMGOLF_KEY)
    return raw ? (JSON.parse(raw) as VimGolfHighScores) : {}
  } catch { return {} }
}

export function saveVimGolfHighScores(scores: VimGolfHighScores): void {
  try { localStorage.setItem(VIMGOLF_KEY, JSON.stringify(scores)) } catch { /* ignore */ }
}

// Sorted: keystrokes ASC, then timeMs ASC (lower is better for both)
export function addVimGolfEntry(
  scores: VimGolfHighScores,
  challengeId: string,
  entry: VimGolfEntry
): VimGolfHighScores {
  const list = [...(scores[challengeId] ?? []), entry]
    .sort((a, b) => a.keystrokes !== b.keystrokes ? a.keystrokes - b.keystrokes : a.timeMs - b.timeMs)
    .slice(0, VIMGOLF_MAX_ENTRIES)
  return { ...scores, [challengeId]: list }
}

export function getBestEntry(scores: VimGolfHighScores, challengeId: string): VimGolfEntry | null {
  return scores[challengeId]?.[0] ?? null
}

// ── content comparison ────────────────────────────────────────────────────────

// Normalise by stripping a single trailing newline so Monaco's auto-newline
// doesn't cause spurious failures.
function normalise(s: string): string {
  return s.endsWith('\n') ? s.slice(0, -1) : s
}

export function isContentCorrect(current: string, expected: string): boolean {
  return normalise(current) === normalise(expected)
}

// Fast check using string length before full comparison
export function quickCheck(current: string, expected: string): boolean {
  if (current.length !== expected.length && Math.abs(current.length - expected.length) > 1) {
    return false
  }
  return isContentCorrect(current, expected)
}

// ── line-level diff (LCS-based) ───────────────────────────────────────────────

export function computeDiff(current: string, expected: string): DiffLine[] {
  const a = normalise(current).split('\n')
  const b = normalise(expected).split('\n')
  const m = a.length, n = b.length

  // Build LCS table
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1])

  // Backtrace iteratively
  const result: DiffLine[] = []
  let i = m, j = n
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      result.unshift({ type: 'equal',   content: a[i - 1] }); i--; j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'added',   content: b[j - 1] }); j--
    } else {
      result.unshift({ type: 'removed', content: a[i - 1] }); i--
    }
  }
  return result
}

// ── vimgolf.com fetch (best-effort; may fail due to CORS) ────────────────────

export async function fetchVimGolfChallenge(id: string): Promise<Partial<VimGolfChallenge> | null> {
  try {
    // The vimgolf gem uses this endpoint. CORS may block it in the browser;
    // if it fails the caller should offer a manual paste workflow.
    const res = await fetch(`https://www.vimgolf.com/challenges/${id}.json`, {
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await res.json() as any
    // The vimgolf JSON has different shapes depending on version:
    // New: { challenge: { title, description, in: { data }, out: { data } } }
    // Old: { in: { data }, out: { data } }
    const ch   = data.challenge ?? data
    const start = ch.in?.data  ?? ch.indata  ?? ''
    const end   = ch.out?.data ?? ch.outdata ?? ''
    if (!start || !end) return null
    return {
      id:          `vgdotcom_${id}`,
      vimgolfId:   id,
      title:       ch.title       ?? `VimGolf #${id}`,
      description: ch.description ?? '',
      start,
      end,
      difficulty:  'medium',
      tags:        [],
    }
  } catch {
    return null
  }
}
