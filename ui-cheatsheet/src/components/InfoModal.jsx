export default function InfoModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="info-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h2 id="info-modal-title" className="text-lg font-bold text-gray-900 dark:text-white">
            About this project
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-4 space-y-6 text-sm text-gray-700 dark:text-gray-300">

          {/* Intro */}
          <p>
            A collection of Vim shortcuts, commands, and practice tools assembled to make
            learning Vim practical. The goal is an overview of the features and commands
            that boost productivity — not exhaustive reference, but a solid launchpad.
          </p>

          {/* Web cheatsheet */}
          <Section title="Web cheatsheet">
            <FeatureList items={[
              ['Fuzzy search', 'Type in the search bar to filter commands by key, description, or category (Fuse.js powered).'],
              ['Level range slider', 'Narrow down to commands at a given difficulty tier (0 = essential, 9 = advanced).'],
              ['Category filter', 'Focus a single Vim topic from the dropdown.'],
              ['Known tracking', 'Click a card to mark/unmark it as learned. State is saved in localStorage.'],
              ['Unknown-only mode', 'Toggle the lightbulb icon to hide everything you already know.'],
              ['Mark all / reset', 'Bulk-mark everything as known, or reset to all unknown.'],
              ['Memorize drawer', 'Alt-click a card to pin it to the Memorize list for focused review. Drag to reorder.'],
              ['Quiz game', 'Flash-card quiz at /game — tests recall across all commands.'],
              ['Interactive keyboard', 'Visual keyboard overlay. Keys are colour-coded by Vim category. Toggle Ctrl/Shift to explore modifier combos. Filter to known/unknown/memorize. Three locale layouts (EN / HU / ES).'],
              ['Dark mode', 'Toggle via the moon/sun button. Preference is persisted.'],
              ['Table of contents', 'Sidebar (desktop) or drawer (mobile) for quick category navigation.'],
            ]} />
          </Section>

          {/* Neovim plugin */}
          <Section title="Neovim plugin">
            <p className="mb-2">
              Lives in <code className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">nvim-plugin/</code>.
              Reads the same <code className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">data.json</code> as
              the web cheatsheet — one source of truth.
              Install via <a href="https://github.com/folke/lazy.nvim" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 dark:hover:text-blue-400">lazy.nvim</a> pointing
              at <code className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">budavariam/learn-vim</code>.
            </p>
            <FeatureList items={[
              ['Cheatsheet overlay', 'Floating window over any buffer. Live fuzzy search (/), filter by known/unknown (f), toggle known (Space). Category colours match the web UI.'],
              ['Quiz overlay', 'Flash-card quiz inside Neovim. Unknown items shown first. k = mark known, n = skip, r = reshuffle, u = mark unknown.'],
            ]} />
            <Keybinds rows={[
              ['<leader>vl', 'Open cheatsheet overlay'],
              ['<leader>vq', 'Open quiz overlay'],
            ]} />
          </Section>

          {/* Source of truth */}
          <Section title="Source of truth">
            <p>
              All commands live in{' '}
              <code className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">vim-cheatsheet.md</code>.
              Running{' '}
              <code className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">node scripts/generateData.js</code>{' '}
              regenerates{' '}
              <code className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">ui-cheatsheet/src/data.json</code>,
              which both the web app and the Neovim plugin read at runtime.
              Edit the markdown → regenerate → both surfaces update.
            </p>
            <p className="mt-2">
              Entry format:{' '}
              <code className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">
                * LEVEL - `cmd1`, `cmd2` - description
              </code>
            </p>
          </Section>

          {/* Practice */}
          <Section title="CLI practice script">
            <p>
              <code className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">practice.py</code>{' '}
              is a Python 3 terminal quiz that drills the commands from the cheatsheet.
              Run it with <code className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">python3 practice.py</code>.
            </p>
          </Section>

          {/* Resources */}
          <Section title="Recommended resources">
            <ul className="space-y-1 list-disc list-inside marker:text-gray-400">
              {[
                ['vimtutor', 'Built-in interactive tutorial — run vimtutor in your terminal.', null],
                ['openvim.com', 'Browser-based interactive tutorial.', 'https://www.openvim.com/'],
                ['vim.rtorr.com', 'Great cheatsheet that inspired this one.', 'https://vim.rtorr.com/'],
                ['vim fandom wiki', 'Deep-dive tips and tricks.', 'https://vim.fandom.com/wiki/Vim_Tips_Wiki'],
                ['vimgolf.com', 'Fun challenges to sharpen muscle memory.', 'https://www.vimgolf.com/'],
              ].map(([name, desc, href]) => (
                <li key={name}>
                  {href
                    ? <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium underline hover:text-blue-600 dark:hover:text-blue-400">{name}</a>
                    : <span className="font-medium">{name}</span>
                  }
                  {' — '}{desc}
                </li>
              ))}
            </ul>
          </Section>

          {/* Source link */}
          <p className="text-xs text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-700">
            Source:{' '}
            <a
              href="https://github.com/budavariam/learn-vim"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-600 dark:hover:text-gray-300"
            >
              github.com/budavariam/learn-vim
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 pb-1 border-b border-gray-100 dark:border-gray-700">
        {title}
      </h3>
      {children}
    </div>
  )
}

function FeatureList({ items }) {
  return (
    <ul className="space-y-1.5">
      {items.map(([label, desc]) => (
        <li key={label} className="flex gap-2">
          <span className="font-medium text-gray-900 dark:text-white shrink-0">{label}</span>
          <span className="text-gray-500 dark:text-gray-400">—</span>
          <span>{desc}</span>
        </li>
      ))}
    </ul>
  )
}

function Keybinds({ rows }) {
  return (
    <table className="mt-2 text-xs w-full">
      <tbody>
        {rows.map(([key, desc]) => (
          <tr key={key}>
            <td className="pr-4 py-0.5 font-mono text-gray-800 dark:text-gray-200 whitespace-nowrap">
              {key}
            </td>
            <td className="text-gray-500 dark:text-gray-400">{desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
