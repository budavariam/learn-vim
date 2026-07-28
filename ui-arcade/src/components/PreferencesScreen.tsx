import React, { useState } from 'react'
import { loadUsername, saveUsername } from '../engine/UserPrefs'
import { STORAGE_KEYS } from '../engine/storageKeys'
import { loadMonacoPrefs, saveMonacoPrefs, type MonacoUserPrefs } from '../engine/MonacoPrefs'
import { GameDefaultsModal } from './GameDefaultsModal'
import type { ModalMode } from './GameDefaultsModal'

const GAME_MODE_ROWS: {
  key: ModalMode
  label: string
  storageKey: string
}[] = [
  { key: 'arcade', label: 'Arcade', storageKey: STORAGE_KEYS.LAST_CONFIG },
  { key: 'goal', label: 'Goal Mode', storageKey: STORAGE_KEYS.LAST_GOAL_CONFIG },
  { key: 'motion', label: 'Motion Race', storageKey: STORAGE_KEYS.LAST_MOTION_CONFIG },
  { key: 'qvimx', label: 'QVIMX', storageKey: STORAGE_KEYS.LAST_QVIMX_CONFIG },
  { key: 'vimbots', label: 'VimBots', storageKey: STORAGE_KEYS.LAST_VIMBOTS_CONFIG },
]

// ── shared pill button style ──────────────────────────────────────────────────

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded border text-xs font-mono transition-colors ${
        active
          ? 'bg-blue-700 border-blue-500 text-white font-bold'
          : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'
      }`}
    >
      {children}
    </button>
  )
}

// ── Editor Settings section ───────────────────────────────────────────────────

function EditorSettings() {
  const [prefs, setPrefs] = useState<MonacoUserPrefs>(loadMonacoPrefs)

  function update(patch: Partial<MonacoUserPrefs>) {
    const next = { ...prefs, ...patch }
    setPrefs(next)
    saveMonacoPrefs(next)
  }

  return (
    <div className="mb-6">
      <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
        Editor Settings
      </label>
      <p className="text-xs text-gray-500 mb-4">
        Applied to all Monaco editors. Reload the page after changing font size or whitespace
        rendering.
      </p>

      <div className="space-y-4">
        {/* Word Wrap */}
        <div>
          <p className="text-xs text-gray-400 mb-1.5">Word Wrap</p>
          <div className="flex gap-2">
            <Pill active={prefs.wordWrap === 'on'} onClick={() => update({ wordWrap: 'on' })}>
              On
            </Pill>
            <Pill active={prefs.wordWrap === 'off'} onClick={() => update({ wordWrap: 'off' })}>
              Off
            </Pill>
          </div>
        </div>

        {/* Font Size */}
        <div>
          <p className="text-xs text-gray-400 mb-1.5">
            Font Size: <span className="text-yellow-400">{prefs.fontSize}px</span>
          </p>
          <input
            type="range"
            min={10}
            max={24}
            step={1}
            value={prefs.fontSize}
            onChange={e => update({ fontSize: Number(e.target.value) })}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-gray-600 text-xs mt-1">
            <span>10</span>
            <span>24</span>
          </div>
        </div>

        {/* Line Numbers */}
        <div>
          <p className="text-xs text-gray-400 mb-1.5">Line Numbers</p>
          <div className="flex gap-2">
            <Pill active={prefs.lineNumbers === 'on'} onClick={() => update({ lineNumbers: 'on' })}>
              Absolute
            </Pill>
            <Pill
              active={prefs.lineNumbers === 'relative'}
              onClick={() => update({ lineNumbers: 'relative' })}
            >
              Relative
            </Pill>
            <Pill
              active={prefs.lineNumbers === 'off'}
              onClick={() => update({ lineNumbers: 'off' })}
            >
              Off
            </Pill>
          </div>
        </div>

        {/* Render Whitespace */}
        <div>
          <p className="text-xs text-gray-400 mb-1.5">Render Whitespace</p>
          <div className="flex gap-2 flex-wrap">
            <Pill
              active={prefs.renderWhitespace === 'none'}
              onClick={() => update({ renderWhitespace: 'none' })}
            >
              None
            </Pill>
            <Pill
              active={prefs.renderWhitespace === 'boundary'}
              onClick={() => update({ renderWhitespace: 'boundary' })}
            >
              Boundary
            </Pill>
            <Pill
              active={prefs.renderWhitespace === 'all'}
              onClick={() => update({ renderWhitespace: 'all' })}
            >
              All
            </Pill>
          </div>
        </div>

        {/* Minimap */}
        <div>
          <p className="text-xs text-gray-400 mb-1.5">Minimap</p>
          <div className="flex gap-2">
            <Pill active={prefs.minimap} onClick={() => update({ minimap: true })}>
              On
            </Pill>
            <Pill active={!prefs.minimap} onClick={() => update({ minimap: false })}>
              Off
            </Pill>
          </div>
        </div>

        {/* Mouse click cursor repositioning */}
        <div>
          <p className="text-xs text-gray-400 mb-1.5">Mouse click moves cursor</p>
          <p className="text-xs text-gray-600 mb-2">
            When off, left-click no longer repositions the cursor — only keyboard motions do.
            Right-click context menu is unaffected.
          </p>
          <div className="flex gap-2">
            <Pill active={!prefs.disableMouse} onClick={() => update({ disableMouse: false })}>
              Enabled
            </Pill>
            <Pill active={prefs.disableMouse} onClick={() => update({ disableMouse: true })}>
              Disabled
            </Pill>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function PreferencesScreen() {
  const [draft, setDraft] = useState(loadUsername)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [openModal, setOpenModal] = useState<ModalMode | null>(null)
  const [resetConfirm, setResetConfirm] = useState<ModalMode | null>(null)

  const isValid = /^[a-zA-Z0-9]{2,20}$/.test(draft)

  function handleChange(val: string) {
    setDraft(val)
    setSaved(false)
    if (val.length > 0 && !/^[a-zA-Z0-9]*$/.test(val)) {
      setError('Only letters and numbers allowed')
    } else if (val.length > 20) {
      setError('Max 20 characters')
    } else if (val.length > 0 && val.length < 2) {
      setError('At least 2 characters')
    } else {
      setError('')
    }
  }

  function handleSave() {
    if (!isValid) return
    saveUsername(draft)
    setSaved(true)
  }

  function handleReset(mode: ModalMode, storageKey: string) {
    if (resetConfirm === mode) {
      try {
        localStorage.removeItem(storageKey)
      } catch {
        /* ignore */
      }
      setResetConfirm(null)
    } else {
      setResetConfirm(mode)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 font-mono flex flex-col items-center justify-start py-12 px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white mb-1">Preferences</h1>
        <p className="text-gray-500 text-sm mb-8">Settings are stored locally in your browser.</p>

        {/* Username */}
        <div className="mb-6">
          <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
            Username
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Shown next to your scores on the High Scores page. Letters and numbers only, 2–20 chars.
          </p>
          <input
            type="text"
            value={draft}
            onChange={e => handleChange(e.target.value)}
            maxLength={20}
            placeholder="vim-user"
            className={`w-full px-3 py-2.5 rounded border text-sm text-white bg-gray-800 focus:outline-none transition-colors ${
              error
                ? 'border-red-600 focus:border-red-500'
                : isValid
                  ? 'border-green-700 focus:border-green-500'
                  : 'border-gray-700 focus:border-blue-500'
            }`}
          />
          {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
          {!error && draft.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Preview: <span className="text-blue-300">{draft}</span>
            </p>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={!isValid}
          className={`w-full py-2.5 rounded border text-sm font-bold transition-colors ${
            saved
              ? 'bg-green-800 border-green-600 text-green-200'
              : isValid
                ? 'bg-blue-700 border-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          {saved ? '✓ Saved' : 'Save'}
        </button>

        <hr className="border-gray-700 my-8" />

        {/* Editor Settings */}
        <EditorSettings />

        <hr className="border-gray-700 my-8" />

        {/* Game Mode Defaults */}
        <div className="mb-6">
          <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
            Game Mode Defaults
          </label>
          <p className="text-xs text-gray-500 mb-4">
            Pre-fill each mode's setup screen with your preferred starting options. Saved
            configurations are loaded automatically the next time you open a mode.
          </p>

          <div className="space-y-2">
            {GAME_MODE_ROWS.map(({ key, label, storageKey }) => (
              <div key={key} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setResetConfirm(null)
                    setOpenModal(key)
                  }}
                  className="flex-1 px-3 py-2 rounded border text-sm font-mono bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white text-left transition-colors"
                >
                  {label}
                </button>
                <button
                  type="button"
                  onClick={() => handleReset(key, storageKey)}
                  title={
                    resetConfirm === key
                      ? 'Click again to confirm reset'
                      : 'Reset to original defaults'
                  }
                  className={`px-3 py-2 rounded border text-xs font-mono transition-colors whitespace-nowrap ${
                    resetConfirm === key
                      ? 'bg-red-900/40 border-red-700 text-red-300 hover:bg-red-900/60'
                      : 'bg-gray-800 border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-400'
                  }`}
                >
                  {resetConfirm === key ? 'Confirm reset' : 'Reset'}
                </button>
              </div>
            ))}

            {/* VimGolf: no configurable defaults */}
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2 rounded border text-sm font-mono bg-gray-800/40 border-gray-700/50 text-gray-600">
                VimGolf
              </div>
              <span className="text-xs font-mono text-gray-600 px-2">No configurable defaults</span>
            </div>
          </div>

          {resetConfirm && (
            <p className="text-xs text-yellow-500 mt-2">
              Click "Confirm reset" to clear the saved defaults for that mode. This cannot be
              undone.
            </p>
          )}
        </div>

        <hr className="border-gray-700 my-8" />
      </div>

      {/* Game defaults modal */}
      {openModal && <GameDefaultsModal mode={openModal} onClose={() => setOpenModal(null)} />}
    </div>
  )
}
