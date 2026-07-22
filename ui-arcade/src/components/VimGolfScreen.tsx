import { useReducer, useState } from 'react'
import { BUILTIN_CHALLENGES } from '../engine/vimgolfChallenges'
import { loadVimGolfHighScores } from '../engine/VimGolfEngine'
import { fetchVimGolfChallenge } from '../engine/VimGolfEngine'
import type { VimGolfChallenge } from '../engine/types'

const CUSTOM_KEY = 'vim_arcade_custom_vgchallenges'

export function loadCustomChallenges(): VimGolfChallenge[] {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY)
    return raw ? (JSON.parse(raw) as VimGolfChallenge[]) : []
  } catch { return [] }
}

function saveCustomChallenges(challenges: VimGolfChallenge[]): void {
  try { localStorage.setItem(CUSTOM_KEY, JSON.stringify(challenges)) } catch { /* ignore */ }
}

interface VimGolfScreenProps {
  onBack: () => void
  onPlay: (challenge: VimGolfChallenge) => void
}

type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard'

const DIFFICULTY_BADGE: Record<VimGolfChallenge['difficulty'], string> = {
  easy:   'bg-green-900/50 text-green-400 border border-green-700',
  medium: 'bg-yellow-900/50 text-yellow-400 border border-yellow-700',
  hard:   'bg-red-900/50 text-red-400 border border-red-700',
}

// ── Reducer ──────────────────────────────────────────────────────────────────

type VGScreenState = {
  filter: DifficultyFilter
  showImport: boolean
  importId: string
  importJson: string
  importError: string
  importLoading: boolean
  challenges: VimGolfChallenge[]
}

type VGScreenAction =
  | { type: 'SET_FILTER'; value: DifficultyFilter }
  | { type: 'TOGGLE_IMPORT' }
  | { type: 'SET_IMPORT_ID'; value: string }
  | { type: 'SET_IMPORT_JSON'; value: string }
  | { type: 'SET_IMPORT_ERROR'; value: string }
  | { type: 'SET_IMPORT_LOADING'; value: boolean }
  | { type: 'ADD_CHALLENGE'; value: VimGolfChallenge }
  | { type: 'RESET_IMPORT' }

function vgScreenReducer(state: VGScreenState, action: VGScreenAction): VGScreenState {
  switch (action.type) {
    case 'SET_FILTER':
      return { ...state, filter: action.value }
    case 'TOGGLE_IMPORT':
      return { ...state, showImport: !state.showImport, importError: '' }
    case 'SET_IMPORT_ID':
      return { ...state, importId: action.value }
    case 'SET_IMPORT_JSON':
      return { ...state, importJson: action.value }
    case 'SET_IMPORT_ERROR':
      return { ...state, importError: action.value }
    case 'SET_IMPORT_LOADING':
      return { ...state, importLoading: action.value }
    case 'ADD_CHALLENGE':
      return { ...state, challenges: [...state.challenges, action.value] }
    case 'RESET_IMPORT':
      return { ...state, importId: '', importJson: '', importError: '', showImport: false }
    default:
      return state
  }
}

function makeInitialVGState(): VGScreenState {
  return {
    filter: 'all',
    showImport: false,
    importId: '',
    importJson: '',
    importError: '',
    importLoading: false,
    challenges: [...BUILTIN_CHALLENGES, ...loadCustomChallenges()],
  }
}

// ─────────────────────────────────────────────────────────────────────────────

export function VimGolfScreen({ onBack, onPlay }: VimGolfScreenProps) {
  const [st, dispatch] = useReducer(vgScreenReducer, undefined, makeInitialVGState)
  // scores is loaded from localStorage — separate external concern
  const [scores] = useState(loadVimGolfHighScores)

  const filtered = st.filter === 'all'
    ? st.challenges
    : st.challenges.filter(c => c.difficulty === st.filter)

  async function handleFetchById() {
    if (!st.importId.trim()) return
    dispatch({ type: 'SET_IMPORT_LOADING', value: true })
    dispatch({ type: 'SET_IMPORT_ERROR', value: '' })
    try {
      const result = await fetchVimGolfChallenge(st.importId.trim())
      if (!result || !result.start || !result.end) {
        dispatch({ type: 'SET_IMPORT_ERROR', value: 'Could not fetch challenge. CORS may be blocking the request — try pasting JSON instead.' })
        return
      }
      const challenge = result as VimGolfChallenge
      dispatch({ type: 'ADD_CHALLENGE', value: challenge })
      saveCustomChallenges([...st.challenges.filter(c => !BUILTIN_CHALLENGES.find(b => b.id === c.id)), challenge])
      dispatch({ type: 'RESET_IMPORT' })
    } catch {
      dispatch({ type: 'SET_IMPORT_ERROR', value: 'Fetch failed.' })
    } finally {
      dispatch({ type: 'SET_IMPORT_LOADING', value: false })
    }
  }

  function handlePasteJson() {
    dispatch({ type: 'SET_IMPORT_ERROR', value: '' })
    try {
      const parsed = JSON.parse(st.importJson) as Partial<VimGolfChallenge>
      if (!parsed.title || !parsed.start || !parsed.end) {
        dispatch({ type: 'SET_IMPORT_ERROR', value: 'JSON must have "title", "start", and "end" fields.' })
        return
      }
      const challenge: VimGolfChallenge = {
        id:          `custom_${Date.now()}`,
        title:       parsed.title,
        description: parsed.description ?? '',
        start:       parsed.start,
        end:         parsed.end,
        difficulty:  parsed.difficulty ?? 'medium',
        tags:        parsed.tags ?? [],
        vimgolfId:   parsed.vimgolfId,
      }
      dispatch({ type: 'ADD_CHALLENGE', value: challenge })
      saveCustomChallenges([...st.challenges.filter(c => !BUILTIN_CHALLENGES.find(b => b.id === c.id)), challenge])
      dispatch({ type: 'RESET_IMPORT' })
    } catch {
      dispatch({ type: 'SET_IMPORT_ERROR', value: 'Invalid JSON.' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 overflow-y-auto">
      <div className="max-w-3xl mx-auto py-10 px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-gray-400 hover:text-white font-mono text-sm transition-colors">
              ← Back
            </button>
            <h1 className="text-3xl font-bold font-mono text-yellow-400 tracking-widest">VIMGOLF</h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {(['all', 'easy', 'medium', 'hard'] as DifficultyFilter[]).map(f => (
              <button
                key={f}
                onClick={() => dispatch({ type: 'SET_FILTER', value: f })}
                className={`px-3 py-1 rounded font-mono text-xs uppercase transition-colors ${
                  st.filter === f
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {f}
              </button>
            ))}
            <button
              onClick={() => dispatch({ type: 'TOGGLE_IMPORT' })}
              className="px-3 py-1 rounded font-mono text-xs bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
            >
              Import {st.showImport ? '▴' : '▾'}
            </button>
          </div>
        </div>

        {/* Import panel */}
        {st.showImport && (
          <div className="mb-6 bg-gray-800 border border-gray-700 rounded-xl p-5 space-y-4">
            <h2 className="font-mono font-bold text-white">Import Challenge</h2>

            {/* Fetch by ID */}
            <div>
              <p className="text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">Fetch by ID from vimgolf.com</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={st.importId}
                  onChange={e => dispatch({ type: 'SET_IMPORT_ID', value: e.target.value })}
                  placeholder="e.g. 9v006210f9f49000000000b9"
                  className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 font-mono text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-600"
                />
                <button
                  onClick={handleFetchById}
                  disabled={st.importLoading || !st.importId.trim()}
                  className="px-4 py-2 bg-yellow-700 hover:bg-yellow-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-mono text-sm rounded-lg transition-colors"
                >
                  {st.importLoading ? '...' : 'Fetch'}
                </button>
              </div>
            </div>

            <div className="text-center text-gray-600 font-mono text-xs">— or —</div>

            {/* Paste JSON */}
            <div>
              <p className="text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">Paste JSON</p>
              <textarea
                value={st.importJson}
                onChange={e => dispatch({ type: 'SET_IMPORT_JSON', value: e.target.value })}
                rows={4}
                placeholder={'{"title":"...", "description":"...", "start":"...", "end":"..."}'}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 font-mono text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-600 resize-none"
              />
              <button
                onClick={handlePasteJson}
                disabled={!st.importJson.trim()}
                className="mt-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-mono text-sm rounded-lg transition-colors"
              >
                Import JSON
              </button>
            </div>

            {st.importError && (
              <p className="text-red-400 font-mono text-sm">{st.importError}</p>
            )}
          </div>
        )}

        {/* Challenge count */}
        <p className="text-gray-500 font-mono text-xs mb-3">
          {filtered.length} challenge{filtered.length !== 1 ? 's' : ''}
          {st.filter !== 'all' ? ` · ${st.filter}` : ''}
        </p>

        {/* Challenge list */}
        <div className="space-y-3">
          {filtered.map(challenge => {
            const best = scores[challenge.id]?.[0] ?? null
            const isCustom = !BUILTIN_CHALLENGES.find(c => c.id === challenge.id)
            return (
              <button
                key={challenge.id}
                onClick={() => onPlay(challenge)}
                className="w-full text-left bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-gray-600 rounded-xl p-4 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  {/* Solved indicator */}
                  <div className="mt-0.5 w-5 flex-shrink-0 text-center">
                    {best ? (
                      <span className="text-green-400 font-bold">✓</span>
                    ) : (
                      <span className="text-gray-700">○</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono font-bold text-white group-hover:text-yellow-300 transition-colors">
                        {challenge.title}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-xs font-mono font-bold uppercase ${DIFFICULTY_BADGE[challenge.difficulty]}`}>
                        {challenge.difficulty}
                      </span>
                      {isCustom && (
                        <span className="px-1.5 py-0.5 rounded text-xs font-mono bg-purple-900/50 text-purple-400 border border-purple-700">
                          Custom
                        </span>
                      )}
                      {challenge.vimgolfId && (
                        <span
                          onClick={e => { e.stopPropagation(); window.open(`https://www.vimgolf.com/challenges/${challenge.vimgolfId}`, '_blank') }}
                          className="text-xs text-blue-400 hover:text-blue-300 font-mono cursor-pointer"
                        >
                          vimgolf.com ↗
                        </span>
                      )}
                    </div>

                    <p className="text-gray-400 font-mono text-sm truncate">{challenge.description}</p>

                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {challenge.tags.map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 bg-gray-700 text-gray-500 rounded text-xs font-mono">
                          {tag}
                        </span>
                      ))}
                      {best && (
                        <span className="text-xs font-mono text-teal-400 ml-auto">
                          Best: {best.keystrokes} keys in {(best.timeMs / 1000).toFixed(1)}s
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
