import { useState, useEffect, useRef, useMemo } from 'react'
import Keyboard from 'react-simple-keyboard'
import 'react-simple-keyboard/build/css/index.css'
import parse from 'html-react-parser'
import { getCategoryColor } from '../constants'

const KEYBOARD_LAYOUTS = {
  EN: {
    label: 'EN',
    default: [
      `{esc} 1 2 3 4 5 6 7 8 9 0 - = {bksp}`,
      `{tab} q w e r t y u i o p [ ] \\`,
      `{lock} a s d f g h j k l ; ' {enter}`,
      `{shift} z x c v b n m , . / {shift}`,
      `{ctrl} {space} {ctrl}`,
    ],
    shift: [
      `{esc} ! @ # $ % ^ & * ( ) _ + {bksp}`,
      `{tab} Q W E R T Y U I O P { } |`,
      `{lock} A S D F G H J K L : " {enter}`,
      `{shift} Z X C V B N M < > ? {shift}`,
      `{ctrl} {space} {ctrl}`,
    ],
  },
  HU: {
    label: 'HU',
    default: [
      `{esc} 1 2 3 4 5 6 7 8 9 0 ö ü ó {bksp}`,
      `{tab} q w e r t z u i o p ő ú`,
      `{lock} a s d f g h j k l é á {enter}`,
      `{shift} í y x c v b n m , . - {shift}`,
      `{ctrl} {space} {ctrl}`,
    ],
    shift: [
      `{esc} ' " + ! % / = ( ) Ö Ü Ó {bksp}`,
      `{tab} Q W E R T Z U I O P Ő Ú`,
      `{lock} A S D F G H J K L É Á {enter}`,
      `{shift} Í Y X C V B N M ; : _ {shift}`,
      `{ctrl} {space} {ctrl}`,
    ],
  },
  ES: {
    label: 'ES',
    default: [
      `{esc} 1 2 3 4 5 6 7 8 9 0 ' ¡ {bksp}`,
      `{tab} q w e r t y u i o p \` +`,
      `{lock} a s d f g h j k l ñ ´ {enter}`,
      `{shift} z x c v b n m , . - {shift}`,
      `{ctrl} {space} {ctrl}`,
    ],
    shift: [
      `{esc} ! " · $ % & / ( ) = ? ¿ {bksp}`,
      `{tab} Q W E R T Y U I O P ^ *`,
      `{lock} A S D F G H J K L Ñ ¨ {enter}`,
      `{shift} Z X C V B N M ; : _ {shift}`,
      `{ctrl} {space} {ctrl}`,
    ],
  },
}

const SPECIAL_KEY_DISPLAY = {
  '{esc}': 'Escape',
  '{bksp}': 'Backspace',
  '{enter}': 'Enter',
  '{tab}': 'Tab',
  '{space}': ' ',
  '{lock}': 'CapsLock',
  '{shift}': 'Shift',
  '{ctrl}': 'Ctrl',
}

function displayKeyToChar(key) {
  return SPECIAL_KEY_DISPLAY[key] ?? key
}

function physicalKeyToDisplay(key) {
  const reverse = Object.fromEntries(
    Object.entries(SPECIAL_KEY_DISPLAY).map(([k, v]) => [v, k])
  )
  if (reverse[key]) return reverse[key]
  if (key.length === 1) return key
  return null
}

function buildKeyIndex(data) {
  const index = {}

  const add = (key, item) => {
    if (!index[key]) index[key] = []
    if (!index[key].find(i => i.id === item.id)) index[key].push(item)
  }

  data.forEach(item => {
    item.solution.forEach(sol => {
      if (sol.startsWith(':')) return

      // Data uses "ctrl-x" notation (hyphen); also handle "ctrl+x" for safety
      const ctrlMatch = sol.match(/^[Cc]trl[-+](.)$/)
      if (ctrlMatch) {
        add(`ctrl+${ctrlMatch[1].toLowerCase()}`, item)
        return
      }

      if (sol.length === 1) add(sol, item)
    })
  })

  return index
}

export default function KeyboardModal({ data, knownItems, memoryItemIds, onClose }) {
  const [activeKey, setActiveKey] = useState(null)
  const [shift, setShift] = useState(false)
  const [ctrl, setCtrl] = useState(false)
  const [locale, setLocale] = useState(() => localStorage.getItem('keyboardLocale') || 'EN')
  const [filterMode, setFilterMode] = useState('all')
  const keyboardRef = useRef(null)

  const filteredData = useMemo(() => {
    if (filterMode === 'memorize') return data.filter(item => memoryItemIds.includes(item.id))
    if (filterMode === 'known') return data.filter(item => knownItems.has(item.id))
    if (filterMode === 'unknown') return data.filter(item => !knownItems.has(item.id))
    return data
  }, [data, filterMode, knownItems, memoryItemIds])

  const keyIndex = useMemo(() => buildKeyIndex(filteredData), [filteredData])

  const layoutName = shift ? 'shift' : 'default'
  const currentLayout = KEYBOARD_LAYOUTS[locale]

  const buttonTheme = useMemo(() => {
    const catKeys = {}
    const layoutRows = currentLayout[layoutName]
    const layoutKeys = new Set(layoutRows.flatMap(row => row.split(' ')))

    layoutKeys.forEach(displayKey => {
      const ch = displayKeyToChar(displayKey)
      if (ch.length !== 1) return
      const lower = ch.toLowerCase()
      let items
      if (ctrl) {
        items = keyIndex[`ctrl+${lower}`] || []
      } else {
        // Prefer the exact char (handles uppercase shift-layer commands like A, G)
        // then fall back to lowercase for keys shown in default layout
        items = keyIndex[ch] || keyIndex[lower] || []
      }
      if (!items.length) return
      const cat = items[0].category
      if (!catKeys[cat]) catKeys[cat] = []
      catKeys[cat].push(displayKey)
    })

    const theme = Object.entries(catKeys).map(([cat, keys]) => ({
      class: `hg-vim-${cat.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`,
      buttons: keys.join(' '),
    }))

    if (activeKey) theme.push({ class: 'hg-active-key', buttons: activeKey })
    if (ctrl) theme.push({ class: 'hg-ctrl-active', buttons: '{ctrl}' })

    return theme
  }, [keyIndex, layoutName, currentLayout, activeKey, ctrl])

  const dynamicStyles = useMemo(() => {
    const catSet = new Set(data.map(item => item.category))
    const catRules = Array.from(catSet).map(cat => {
      const color = getCategoryColor(cat)
      const cls = cat.replace(/[^a-z0-9]/gi, '-').toLowerCase()
      return [
        `.hg-vim-${cls}.hg-button { background: ${color}28 !important; border-bottom: 2px solid ${color} !important; }`,
        `.dark .hg-vim-${cls}.hg-button { background: ${color}50 !important; border-bottom: 2px solid ${color} !important; color: #e5e7eb !important; }`,
      ].join('\n')
    }).join('\n')

    return catRules + `
.hg-active-key.hg-button { background: rgba(59,130,246,0.4) !important; box-shadow: 0 0 0 2px #3b82f6 !important; z-index: 1; }
.dark .hg-active-key.hg-button { background: rgba(59,130,246,0.55) !important; box-shadow: 0 0 0 2px #60a5fa !important; color: #fff !important; }
.hg-ctrl-active.hg-button { background: rgba(59,130,246,0.4) !important; box-shadow: 0 0 0 2px #3b82f6 !important; }
.dark .hg-ctrl-active.hg-button { background: rgba(59,130,246,0.55) !important; box-shadow: 0 0 0 2px #60a5fa !important; color: #fff !important; }
.vim-keyboard .hg-button { min-width: 1.8rem !important; height: 2.2rem !important; font-size: 0.7rem !important; padding: 0 !important; }
.vim-keyboard .hg-button[data-skbtn="{space}"] { min-width: 8rem !important; }
`
  }, [data])

  useEffect(() => {
    localStorage.setItem('keyboardLocale', locale)
  }, [locale])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'Shift') { setShift(true); return }
      if (e.key === 'Control') { setCtrl(true); return }
      if (e.key === 'Alt' || e.key === 'Meta') return

      e.preventDefault()
      const displayKey = physicalKeyToDisplay(e.key)
      if (displayKey) setActiveKey(displayKey)
    }
    const handleKeyUp = (e) => {
      if (e.key === 'Shift') setShift(false)
      if (e.key === 'Control') setCtrl(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [onClose])

  const activeCommands = useMemo(() => {
    if (!activeKey) return null

    const ch = displayKeyToChar(activeKey)
    const isLetter = ch.length === 1 && /[a-zA-Z]/.test(ch)
    const lower = isLetter ? ch.toLowerCase() : ch
    const upper = isLetter ? ch.toUpperCase() : null

    return {
      plain: keyIndex[lower] || [],
      shift: upper ? (keyIndex[upper] || []) : [],
      ctrl: keyIndex[`ctrl+${lower}`] || [],
      plainLabel: lower,
      shiftLabel: upper,
      ctrlLabel: `Ctrl+${lower}`,
    }
  }, [activeKey, keyIndex])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-3xl overflow-hidden"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="keyboard-modal-title"
      >
        <style>{dynamicStyles}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 id="keyboard-modal-title" className="text-base font-semibold text-gray-900 dark:text-white">
              Keyboard View
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Click a key or press a physical key — colors show Vim categories
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Locale selector */}
            <div className="flex rounded-md overflow-hidden border border-gray-300 dark:border-gray-600 text-xs">
              {Object.entries(KEYBOARD_LAYOUTS).map(([key, { label }]) => (
                <button
                  key={key}
                  onClick={() => setLocale(key)}
                  className={`px-2 py-1 font-mono transition-colors ${locale === key
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {/* Modifier indicators */}
            <span className={`px-2 py-0.5 rounded text-xs font-mono ${shift ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'}`}>
              Shift
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-mono ${ctrl ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'}`}>
              Ctrl
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close keyboard view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
          {[
            { id: 'all', label: 'All' },
            { id: 'unknown', label: 'Unknown' },
            { id: 'known', label: 'Known' },
            { id: 'memorize', label: 'Memorize' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilterMode(id)}
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${filterMode === id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
            {filteredData.length} commands
          </span>
        </div>

        {/* Virtual keyboard */}
        <div className="px-4 pt-3 pb-1">
          <Keyboard
            keyboardRef={r => (keyboardRef.current = r)}
            layoutName={layoutName}
            layout={currentLayout}
            onKeyPress={key => {
              if (key === '{shift}') { setShift(s => !s); return }
              if (key === '{ctrl}') { setCtrl(s => !s); return }
              setActiveKey(key)
            }}
            buttonTheme={buttonTheme}
            theme="hg-theme-default hg-layout-default vim-keyboard"
            display={{
              '{esc}': 'Esc',
              '{bksp}': '⌫',
              '{enter}': '↵',
              '{shift}': '⇧',
              '{tab}': '⇥',
              '{lock}': 'Caps',
              '{ctrl}': 'Ctrl',
              '{space}': ' ',
            }}
          />
        </div>

        {/* Command info panel */}
        <div className="px-4 pb-4 min-h-[6rem]">
          {activeKey && activeCommands ? (
            <div className="space-y-1.5">
              {activeCommands.plain.map(item => (
                <CommandLine key={`plain-${item.id}`} label={activeCommands.plainLabel} item={item} />
              ))}
              {activeCommands.shift.map(item => (
                <CommandLine key={`shift-${item.id}`} label={activeCommands.shiftLabel} item={item} />
              ))}
              {activeCommands.ctrl.map(item => (
                <CommandLine key={`ctrl-${item.id}`} label={activeCommands.ctrlLabel} item={item} />
              ))}
              {!activeCommands.plain.length && !activeCommands.shift.length && !activeCommands.ctrl.length && (
                <p className="text-xs text-gray-400 dark:text-gray-500 py-2">
                  No single-key Vim commands for{' '}
                  <code className="font-mono">{displayKeyToChar(activeKey)}</code>
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-400 dark:text-gray-500 py-2">
              Click a key or press a physical key to see its Vim commands
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function CommandLine({ label, item }) {
  const color = getCategoryColor(item.category)
  return (
    <div className="flex items-center gap-2 text-xs">
      <code className="font-mono px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 whitespace-nowrap min-w-[3.5rem] text-center">
        {label}
      </code>
      <span className="text-gray-700 dark:text-gray-300 flex-1 leading-relaxed">
        {parse(item.question)}
      </span>
      <span
        className="text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap"
        style={{ backgroundColor: color + '28', color }}
      >
        {item.category}
      </span>
    </div>
  )
}
