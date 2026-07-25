/**
 * Pure org-mode challenge parser — no imports, no side effects.
 * Called from the Web Worker so the main thread stays responsive.
 * Difficulty is assigned dynamically based on the relative edit distance
 * between start and end content (percentile-based: bottom 33% = easy,
 * 33–75% = medium, top 25% = hard).
 */
import type { VimGolfChallenge } from './types'

function slugify(title: string, idx: number): string {
  return (
    'org_' +
    idx +
    '_' +
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '')
      .slice(0, 40)
  )
}

/** Ratio of changed characters relative to the longer string length (0–1). */
function changeRatio(a: string, b: string): number {
  if (!a && !b) return 0
  const longer = Math.max(a.length, b.length)
  let diff = Math.abs(a.length - b.length)
  const minLen = Math.min(a.length, b.length)
  for (let i = 0; i < minLen; i++) {
    if (a[i] !== b[i]) diff++
  }
  return diff / longer
}

function assignDifficulties(challenges: VimGolfChallenge[], ratios: number[]): void {
  // Sort ratios to find percentile thresholds
  const sorted = [...ratios].sort((a, b) => a - b)
  const p33 = sorted[Math.floor(sorted.length * 0.33)]
  const p75 = sorted[Math.floor(sorted.length * 0.75)]

  for (let i = 0; i < challenges.length; i++) {
    const r = ratios[i]
    challenges[i].difficulty = r <= p33 ? 'easy' : r <= p75 ? 'medium' : 'hard'
  }
}

export function parseOrgChallenges(raw: string): VimGolfChallenge[] {
  const results: VimGolfChallenge[] = []
  const ratios: number[] = []

  // Split on level-1 headings; index 0 is the preamble
  const sections = raw.split(/\n(?=\* )/)

  for (const section of sections) {
    const firstNL = section.indexOf('\n')
    const heading = firstNL === -1 ? section : section.slice(0, firstNL)
    if (!heading.startsWith('* ')) continue

    const title = heading.slice(2).trim()
    if (!title || /table of contents/i.test(title)) continue

    // Description: text between title and first level-2 heading
    const l2 = section.indexOf('\n** ')
    const descRaw = l2 > firstNL ? section.slice(firstNL + 1, l2) : ''
    const description = descRaw.replace(/^\s+|\s+$/g, '').replace(/\n{3,}/g, '\n\n')

    // Extract start/end from #+BEGIN_SRC … #+END_SRC blocks
    const startM = /\*\* Start file[\s\S]*?#\+BEGIN_SRC[^\n]*\n([\s\S]*?)#\+END_SRC/i.exec(section)
    const endM = /\*\* End file[\s\S]*?#\+BEGIN_SRC[^\n]*\n([\s\S]*?)#\+END_SRC/i.exec(section)

    if (!startM || !endM) continue

    const start = startM[1].replace(/\n$/, '')
    const end = endM[1].replace(/\n$/, '')
    if (!start || !end || start === end) continue

    const ratio = changeRatio(start, end)
    ratios.push(ratio)
    results.push({
      id: slugify(title, results.length),
      title,
      description,
      start,
      end,
      difficulty: 'medium', // filled in by assignDifficulties below
      tags: [],
    })
  }

  assignDifficulties(results, ratios)
  return results
}
