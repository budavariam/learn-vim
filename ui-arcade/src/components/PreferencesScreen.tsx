import { useState } from 'react'
import { loadUsername, saveUsername } from '../engine/UserPrefs'

export function PreferencesScreen() {
  const [draft, setDraft] = useState(loadUsername)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

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

        <p className="text-xs text-gray-600 text-center">More preferences coming soon.</p>
      </div>
    </div>
  )
}
