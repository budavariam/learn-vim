import { useState, useEffect, useRef } from 'react'
import type React from 'react'

const SECTIONS = [
  { id: 'arcade', label: '🎮 Arcade Mode' },
  { id: 'motion-race', label: '🏃 Motion Race' },
  { id: 'goal', label: '🎯 Goal Mode' },
  { id: 'vimgolf', label: '⛳ VimGolf' },
  { id: 'high-scores', label: '🏆 High Scores' },
  { id: 'preferences', label: '⚙ Preferences' },
  { id: 'shortcuts', label: '⌨ Shortcuts' },
  { id: 'dev', label: '🔬 Dev Mode' },
]

/** A human-readable overview of all game modes and features. */
export function AppReadmeScreen() {
  const [active, setActive] = useState(SECTIONS[0].id)
  const containerRef = useRef<HTMLDivElement>(null)

  // Track which section is in view via IntersectionObserver
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const nodes = SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean) as HTMLElement[]
    const obs = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(e.target.id)
            break
          }
        }
      },
      { root: el, threshold: 0.4 }
    )
    nodes.forEach(n => obs.observe(n))
    return () => obs.disconnect()
  }, [])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="h-full bg-gray-900 font-mono flex overflow-hidden">
      {/* Sticky TOC sidebar */}
      <nav className="hidden md:flex flex-col w-48 flex-shrink-0 border-r border-gray-800 py-6 px-3 overflow-y-auto">
        <p className="text-gray-600 text-xs uppercase tracking-wider mb-3 px-1">Contents</p>
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className={`text-left text-xs px-2 py-1.5 rounded transition-colors mb-0.5 ${
              active === s.id
                ? 'text-white bg-gray-800 border-l-2 border-blue-400 pl-1.5'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {/* Scrollable content */}
      <div ref={containerRef} className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto py-8 px-6 space-y-10 text-sm text-gray-300">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">VIM ARCADE — Feature Guide</h1>
            <p className="text-gray-500 text-xs">
              A quick reference for everything the app can do. See{' '}
              <code className="text-blue-300">README.md</code> in the repo for developer notes.
            </p>
          </div>

          {/* ─── Arcade Mode ─────────────────────────────── */}
          <Section id="arcade" title="🎮 Arcade Mode" route="/arcade">
            <p>
              Practice vim commands under time pressure. Commands appear as challenges; complete
              them to score points and advance your level ceiling.
            </p>
            <ul>
              <li>
                <b>Modes</b> — General (endless), Timed Challenge (fixed session), Survival (one
                miss ends it).
              </li>
              <li>
                <b>Guided modes</b> — None, First-only, After-failure, First+failure, Alternating,
                Always. Accessible via <kbd>F1</kbd> palette →{' '}
                <code>Vim Arcade: Guided Mode: …</code>
              </li>
              <li>
                <b>Challenge time pace</b> — multiply base time limits (1× – 3×) for a slower, more
                deliberate pace.
              </li>
              <li>
                <b>Dynamic assist</b> — auto-reveal solutions after X% of the time limit.
              </li>
              <li>
                <b>Category + Knowledge filters</b> — practice only what you want.
              </li>
            </ul>
          </Section>

          {/* ─── Motion Race ─────────────────────────────── */}
          <Section id="motion-race" title="🏃 Motion Race" route="/motion-race">
            <p>Navigate to highlighted positions using only vim motions. No editing allowed.</p>
            <ul>
              <li>
                <b>End conditions</b> — Timed, Count (your goals), Count (all incl. enemies),
                Survival.
              </li>
              <li>
                <b>Distance modes</b> — Short (≤8 lines), Medium, Long (26+), Mixed.
              </li>
              <li>
                <b>Goal display</b> — One at a time, or All-at-once (collect any order).
              </li>
              <li>
                <b>Snake trail</b> — blue fading trail; length = current score (classic snake
                mechanic).
              </li>
              <li>
                <b>Enemies</b> — AI cursors racing toward goals. 0/1/3/5/10 enemies, configurable
                speed and per-enemy SCSS HSL color palettes. Optional blocking trails.
              </li>
              <li>
                <b>Fog of war</b> — hides enemies in editor; they remain visible on the minimap.
              </li>
              <li>
                <b>Minimap sidebar</b> — goal diamonds (yellow) + color-coded enemy dots.
              </li>
              <li>
                <b>Handicaps</b> — Snow, Opacity fade, Confetti on goal, Penalty flash, hjkl-only,
                No-hjkl.
              </li>
              <li>
                <b>Challenge mode</b> — optional motion/search command challenges in a bar below the
                target.
              </li>
            </ul>
          </Section>

          {/* ─── Goal Mode ───────────────────────────────── */}
          <Section id="goal" title="🎯 Goal Mode" route="/goal">
            <p>
              Transform text from a start state to a target state. Think real-world editing tasks.
            </p>
            <ul>
              <li>
                <b>Text goals</b> — count, difficulty, time limit per challenge.
              </li>
              <li>
                <b>Command challenges</b> — optional concurrent vim-command challenges. Toggle in
                setup (collapsible).
              </li>
              <li>1,000+ challenges from the bundled org-file submodule, shuffled each session.</li>
              <li>Difficulty auto-assigned by edit-distance percentile.</li>
            </ul>
          </Section>

          {/* ─── VimGolf ─────────────────────────────────── */}
          <Section id="vimgolf" title="⛳ VimGolf" route="/vimgolf">
            <p>Transform text using the fewest keystrokes possible.</p>
            <ul>
              <li>
                1,000+ challenges parsed at runtime from the bundled{' '}
                <code>vim-golf-challenges/README.org</code> submodule via a Web Worker.
              </li>
              <li>Difficulty auto-assigned by edit distance (percentile-based).</li>
              <li>Inline search + Easy / Medium / Hard filter.</li>
              <li>Personal bests tracked. Add custom challenges via JSON paste.</li>
            </ul>
          </Section>

          {/* ─── High Scores ─────────────────────────────── */}
          <Section id="high-scores" title="🏆 High Scores" route="/high-scores">
            <ul>
              <li>Tabbed by mode (General, Timed, Survival), always 10 rows.</li>
              <li>
                <b>vim-bot</b> seed entries give you targets to beat; your scores displace them when
                you rank higher.
              </li>
              <li>Your display name (set in Preferences) appears in the Player column.</li>
            </ul>
          </Section>

          {/* ─── Preferences ─────────────────────────────── */}
          <Section id="preferences" title="⚙ Preferences" route="/preferences">
            <ul>
              <li>
                Set a <b>username</b> (alphanumeric, 2–20 chars) shown on the High Scores table.
              </li>
              <li>
                All settings stored locally in your browser under <code>vimarcade_*</code> keys.
              </li>
            </ul>
          </Section>

          {/* ─── Keyboard shortcuts ──────────────────────── */}
          <Section id="shortcuts" title="⌨ Keyboard Shortcuts">
            <table className="w-full text-xs border-collapse">
              <tbody>
                {[
                  ['F1', 'Monaco command palette — search all in-game settings'],
                  ['?', 'In-game shortcuts overlay (Arcade mode)'],
                  ['Esc', 'Close overlays / return to normal mode'],
                ].map(([key, desc]) => (
                  <tr key={key} className="border-b border-gray-800">
                    <td className="py-1.5 pr-4 w-24">
                      <kbd className="px-1.5 py-0.5 bg-gray-800 border border-gray-600 rounded text-gray-200">
                        {key}
                      </kbd>
                    </td>
                    <td className="py-1.5 text-gray-400">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          {/* ─── Dev Mode ────────────────────────────────── */}
          <Section id="dev" title="🔬 Dev Mode" route="/help">
            <p>Test and debug command detection. Not needed for normal play.</p>
            <ul>
              <li>Live keystroke log with solution matching and mode tracking.</li>
              <li>
                Mark commands as unsupported; export the list (ID / +Command / +Description format).
              </li>
              <li>Drill mode — cycle through filtered commands automatically.</li>
              <li>Known / Unknown filter and inline search by description, command, or ID.</li>
            </ul>
          </Section>
        </div>
      </div>
    </div>
  )
}

function Section({
  id,
  title,
  route,
  children,
}: {
  id: string
  title: string
  route?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-4">
      <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
        {title}
        {route && <span className="text-xs text-gray-600 font-normal">{route}</span>}
      </h2>
      <div className="space-y-1.5 text-gray-400 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_b]:text-gray-200 [&_kbd]:text-xs [&_kbd]:px-1 [&_kbd]:py-0.5 [&_kbd]:bg-gray-800 [&_kbd]:border [&_kbd]:border-gray-600 [&_kbd]:rounded [&_code]:text-blue-300">
        {children}
      </div>
    </section>
  )
}
