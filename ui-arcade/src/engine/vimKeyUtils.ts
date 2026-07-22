/**
 * Shared vim-key utilities used by useMonacoEditor, DevModeScreen, and any
 * future consumer that needs to detect or display vim key sequences.
 */

import rawData from '../data.json'

// ── Key normalisation ─────────────────────────────────────────────────────────

/** Normalise data.json solution strings to the internal <C-x>/<Esc> format. */
export function normaliseVimKey(raw: string): string {
  const ctrlM = /^ctrl[-+\s](.+)/i.exec(raw)
  if (ctrlM) return `<C-${ctrlM[1].toLowerCase()}>`
  if (/^esc$/i.test(raw)) return '<Esc>'
  // Strip " + movement", " + motion" etc. — documentation notation.
  // e.g. "gu + movement" → "gu", "= + motion" → "="
  const stripped = raw.replace(/\s+\+\s+\S+.*$/, '')
  if (stripped !== raw) return stripped
  return raw
}

/** Convert a KeyboardEvent to its vim display string. Returns '' for keys
 *  that carry no vim meaning (arrows, F-keys, …). */
export function formatKeyEvent(e: KeyboardEvent): string {
  if (e.key === 'Escape' || (e.ctrlKey && !e.altKey && !e.metaKey && e.key === '[')) return '<Esc>'
  if (e.key === 'Enter')     return '<CR>'
  if (e.key === 'Backspace') return '<BS>'
  // Tab in vim normal mode is identical to <C-i> (jump list forward).
  if (e.key === 'Tab')       return '<C-i>'
  if (e.key === 'Delete')    return '<Del>'
  if (e.ctrlKey && !e.altKey && !e.metaKey) {
    if (e.key.length === 1 || e.key === ']' || e.key === '^') {
      return `<C-${e.key.toLowerCase()}>`
    }
  }
  if (e.altKey && !e.ctrlKey && !e.metaKey && e.key.length === 1) {
    return `<M-${e.key}>`
  }
  if (e.key.length === 1) return e.key
  return ''
}

// ── Solution sets (built once from data.json) ─────────────────────────────────

const _cmds = rawData as Array<{ solution: string[] }>

/**
 * Solutions stripped from "gu + movement" etc. — they are vim operators that
 * REQUIRE a motion argument.  The matcher must buffer them until the user types
 * at least one more key (the motion) before emitting.  Otherwise "gu" alone
 * (operator-pending, vim waiting for motion) would be treated as a complete
 * command.
 */
const MOTION_OPERATORS = new Set<string>()

/**
 * Vim text-object solutions (e.g. 'ap', 'iw', 'a"').  These are normally typed
 * in Visual or operator-pending mode, not bare Normal mode.  Adding them to
 * CROSS_MODE_SOLUTIONS lets the rolling all-modes buffer detect them even after
 * a Visual-mode entry ('v', 'V', '<C-v>') resets the normal-mode matcher.
 *
 * A text-object solution is a 2-character solution starting with 'a' or 'i'
 * followed by a delimiter or paragraph/sentence/word specifier.
 */
const TEXT_OBJECT_RE = /^[ai][wWbBspt"'`)([\]{}><]$/

function _build() {
  const solutions           = new Set<string>()
  const prefixes            = new Set<string>()
  const crossModeSolutions  = new Set<string>()

  for (const cmd of _cmds) {
    for (const raw of cmd.solution) {
      if (!raw) continue
      const sol = normaliseVimKey(raw)

      if (sol.includes(' ')) {
        // Cross-mode sequence spanning a mode boundary (e.g. 'ea 2f').
        crossModeSolutions.add(sol)
      } else {
        // Track stripped motion operators so the matcher knows to wait.
        if (raw !== sol && /\s+\+\s+\S+/.test(raw)) {
          MOTION_OPERATORS.add(sol)
        }

        solutions.add(sol)
        for (let i = 1; i <= sol.length; i++) prefixes.add(sol.slice(0, i))

        // Text-object solutions also go in the cross-mode set so the rolling
        // buffer catches them when typed in Visual or operator-pending mode
        // (where pressing 'a'/'i' does NOT enter insert mode).
        if (TEXT_OBJECT_RE.test(sol)) {
          crossModeSolutions.add(sol)
        }
      }
    }
  }
  return { solutions, prefixes, crossModeSolutions }
}

const { solutions: SOLUTIONS, prefixes: PREFIXES, crossModeSolutions: CROSS_MODE_SOLUTIONS } = _build()

/**
 * Solutions that are also prefixes of OTHER, LONGER solutions — must be
 * buffered until a dead-end key extends or flushes them.
 */
const AMBIGUOUS_SOLUTIONS = (() => {
  const s = new Set<string>()
  for (const sol of SOLUTIONS) {
    for (const other of SOLUTIONS) {
      if (other.length > sol.length && other.startsWith(sol)) {
        s.add(sol)
        break
      }
    }
  }
  return s
})()

export { SOLUTIONS, PREFIXES, CROSS_MODE_SOLUTIONS, AMBIGUOUS_SOLUTIONS, MOTION_OPERATORS }

// ── VimSequenceMatcher ────────────────────────────────────────────────────────

export class VimSequenceMatcher {
  private buf = ''

  push(key: string): string[] {
    const candidate = this.buf + key

    if (SOLUTIONS.has(candidate)) {
      if (AMBIGUOUS_SOLUTIONS.has(candidate) || MOTION_OPERATORS.has(candidate)) {
        // AMBIGUOUS: could be extended by a longer solution.
        // MOTION_OPERATOR: needs at least one more key (the motion) before emitting.
        // Both cases: buffer and wait.
        this.buf = candidate
        return []
      }
      this.buf = ''
      return [candidate]
    }

    if (PREFIXES.has(candidate)) {
      this.buf = candidate
      return []
    }

    // Dead end — flush buffered solution and retry with the new key
    const prev = this.buf
    this.buf = ''
    const results: string[] = []

    if (prev && SOLUTIONS.has(prev)) {
      results.push(prev)
    }

    if (SOLUTIONS.has(key)) {
      if (AMBIGUOUS_SOLUTIONS.has(key) || MOTION_OPERATORS.has(key)) {
        this.buf = key
      } else {
        results.push(key)
      }
    } else if (PREFIXES.has(key)) {
      this.buf = key
    }

    return results
  }

  reset(): string | null {
    const buf = this.buf
    this.buf = ''
    // Motion operators in the buffer: a mode change means the user executed the
    // operator (e.g. pressed 'gu' and vim is waiting for motion in normal mode).
    // Flush and emit — the motion was implicit in the mode transition context.
    return (buf && SOLUTIONS.has(buf)) ? buf : null
  }
}
