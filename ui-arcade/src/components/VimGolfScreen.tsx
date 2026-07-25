import { useMemo, useReducer } from 'react'
import { Plus, CheckCircle2, KeyRound } from 'lucide-react'
import { useVimGolfChallenges } from '../hooks/useVimGolfChallenges'
import { loadVimGolfRecords } from '../engine/VimGolfEngine'
import { STORAGE_KEYS } from '../engine/storageKeys'
import type { VimGolfChallenge } from '../engine/types'

export function loadCustomChallenges(): VimGolfChallenge[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_VG_CHALLENGES)
    return raw ? (JSON.parse(raw) as VimGolfChallenge[]) : []
  } catch {
    return []
  }
}

function saveCustomChallenges(challenges: VimGolfChallenge[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_VG_CHALLENGES, JSON.stringify(challenges))
  } catch {
    /* ignore */
  }
}

interface VimGolfScreenProps {
  onBack?: () => void // kept for API compat; navbar handles home navigation
  onPlay: (challenge: VimGolfChallenge, list: VimGolfChallenge[]) => void
}

type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard'
type SolvedFilter = 'all' | 'solved' | 'unsolved'
type SortKey = 'default' | 'difficulty' | 'name' | 'id'

const DIFF_BADGE: Record<VimGolfChallenge['difficulty'], string> = {
  easy: 'text-green-400 bg-green-900/30 border border-green-800',
  medium: 'text-yellow-400 bg-yellow-900/30 border border-yellow-800',
  hard: 'text-red-400   bg-red-900/30   border border-red-800',
}

const DIFF_ORDER = { easy: 0, medium: 1, hard: 2 }

type VimGolfState = {
  records: ReturnType<typeof loadVimGolfRecords>
  diffFilter: DifficultyFilter
  solvedFilter: SolvedFilter
  sortKey: SortKey
  search: string
  showAddJson: boolean
  jsonInput: string
  jsonError: string
}

export function VimGolfScreen({ onPlay }: VimGolfScreenProps) {
  const { challenges: allChallenges, loading } = useVimGolfChallenges()
  const [state, setState] = useReducer(
    (
      s: VimGolfState,
      patch: Partial<VimGolfState> | ((prev: VimGolfState) => Partial<VimGolfState>)
    ) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }),
    {
      records: loadVimGolfRecords(),
      diffFilter: 'all',
      solvedFilter: 'all',
      sortKey: 'default',
      search: '',
      showAddJson: false,
      jsonInput: '',
      jsonError: '',
    }
  )
  const { records, diffFilter, solvedFilter, sortKey, search, showAddJson, jsonInput, jsonError } =
    state

  const combined = useMemo(() => {
    if (!allChallenges.length) return []
    const custom = loadCustomChallenges()
    const existingIds = new Set(allChallenges.map(c => c.id))
    return [...allChallenges, ...custom.filter(c => !existingIds.has(c.id))]
  }, [allChallenges])

  const filtered = useMemo(() => {
    let list = combined

    if (diffFilter !== 'all') list = list.filter(c => c.difficulty === diffFilter)

    if (solvedFilter === 'solved') list = list.filter(c => records[c.id] !== undefined)
    if (solvedFilter === 'unsolved') list = list.filter(c => records[c.id] === undefined)

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        c =>
          c.id.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tags?.some(t => t.toLowerCase().includes(q))
      )
    }

    // Sort
    if (sortKey === 'difficulty') {
      list = [...list].sort((a, b) => DIFF_ORDER[a.difficulty] - DIFF_ORDER[b.difficulty])
    } else if (sortKey === 'name') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortKey === 'id') {
      // IDs from org file look like org_42_title — sort numerically by the number part
      list = [...list].sort((a, b) => {
        const numA = parseInt(a.id.split('_')[1] ?? '0', 10)
        const numB = parseInt(b.id.split('_')[1] ?? '0', 10)
        return isNaN(numA) || isNaN(numB) ? a.id.localeCompare(b.id) : numA - numB
      })
    }

    return list
  }, [combined, diffFilter, solvedFilter, sortKey, search, records])

  function handleAddJson() {
    setState({ jsonError: '' })
    try {
      const parsed = JSON.parse(jsonInput) as Partial<VimGolfChallenge>
      if (!parsed.title || !parsed.start || !parsed.end) {
        setState({ jsonError: 'JSON must have "title", "start", and "end" fields.' })
        return
      }
      const challenge: VimGolfChallenge = {
        id: `custom_${Date.now()}`,
        title: parsed.title,
        description: parsed.description ?? '',
        start: parsed.start,
        end: parsed.end,
        difficulty: parsed.difficulty ?? 'medium',
        tags: parsed.tags ?? [],
        vimgolfId: parsed.vimgolfId,
      }
      const existing = loadCustomChallenges().filter(c => c.id !== challenge.id)
      saveCustomChallenges([...existing, challenge])
      setState({ jsonInput: '', showAddJson: false })
    } catch {
      setState({ jsonError: 'Invalid JSON.' })
    }
  }

  return (
    <div className="h-full bg-gray-900 flex flex-col overflow-hidden font-mono">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border-b border-gray-700 flex-shrink-0 flex-wrap">
        <span className="font-bold text-yellow-400 tracking-widest text-sm">VIMGOLF</span>
        {loading && <span className="text-xs text-gray-500 animate-pulse">Loading…</span>}
        {!loading && (
          <span className="text-xs text-gray-600">
            {filtered.length} / {combined.length}
          </span>
        )}

        {/* Search */}
        <input
          type="text"
          placeholder="Search…"
          value={search}
          onChange={e => setState({ search: e.target.value })}
          className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 w-32"
        />

        {/* Difficulty filter */}
        <div className="flex gap-1 ml-auto flex-wrap">
          {(['all', 'easy', 'medium', 'hard'] as DifficultyFilter[]).map(f => (
            <button
              key={f}
              onClick={() => setState({ diffFilter: f })}
              className={`px-2 py-1 rounded text-xs uppercase transition-colors ${
                diffFilter === f
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {f}
            </button>
          ))}

          {/* Solved filter */}
          <button
            onClick={() =>
              setState(s => ({
                solvedFilter:
                  s.solvedFilter === 'all'
                    ? 'unsolved'
                    : s.solvedFilter === 'unsolved'
                      ? 'solved'
                      : 'all',
              }))
            }
            className={`px-2 py-1 rounded text-xs transition-colors flex items-center gap-1 ${
              solvedFilter === 'solved'
                ? 'bg-green-700 text-white'
                : solvedFilter === 'unsolved'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
            title="Filter by solved / unsolved"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {solvedFilter === 'all' ? 'all' : solvedFilter}
          </button>

          {/* Sort */}
          <select
            value={sortKey}
            onChange={e => setState({ sortKey: e.target.value as SortKey })}
            className="px-2 py-1 rounded text-xs bg-gray-800 text-gray-400 border border-gray-700 focus:outline-none focus:border-blue-500 flex items-center gap-1"
            title="Sort"
          >
            <option value="default">Order: default</option>
            <option value="difficulty">Order: difficulty</option>
            <option value="name">Order: name A–Z</option>
            <option value="id">Order: ID</option>
          </select>

          <button
            onClick={() => setState(s => ({ showAddJson: !s.showAddJson }))}
            className="px-2 py-1 rounded text-xs bg-gray-700 text-gray-400 hover:bg-gray-600 transition-colors flex items-center gap-1"
            title="Add custom challenge via JSON"
          >
            <Plus className="w-3.5 h-3.5" /> JSON
          </button>
        </div>
      </div>

      {/* Add-by-JSON panel */}
      {showAddJson && (
        <div className="px-4 py-3 bg-gray-800 border-b border-gray-700 flex-shrink-0">
          <p className="text-xs text-gray-400 mb-2">
            Paste a challenge JSON (fields: title, start, end, [description, difficulty, tags])
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={jsonInput}
              onChange={e => setState({ jsonInput: e.target.value })}
              placeholder='{"title":"...","start":"...","end":"..."}'
              className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleAddJson}
              className="px-3 py-1 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs transition-colors"
            >
              Add
            </button>
          </div>
          {jsonError && <p className="text-xs text-red-400 mt-1">{jsonError}</p>}
        </div>
      )}

      {/* Challenge list */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
            <span className="animate-pulse">Parsing challenges…</span>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-gray-600 italic text-sm px-4 py-6 text-center">No challenges match.</p>
        )}

        {!loading &&
          filtered.map(challenge => {
            const record = records[challenge.id]
            const solved = record !== undefined
            return (
              <button
                key={challenge.id}
                onClick={() => onPlay(challenge, filtered)}
                className="w-full text-left px-4 py-2.5 border-b border-gray-800 hover:bg-gray-800 transition-colors flex items-center gap-3"
              >
                {/* Solved indicator */}
                <CheckCircle2
                  className={`w-3.5 h-3.5 flex-shrink-0 ${solved ? 'text-green-500' : 'text-gray-700'}`}
                />

                {/* Difficulty badge */}
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded flex-shrink-0 ${DIFF_BADGE[challenge.difficulty]}`}
                >
                  {challenge.difficulty[0].toUpperCase()}
                </span>

                {/* Title + id + description */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm text-white truncate">{challenge.title}</span>
                    <span className="text-[10px] text-gray-600 flex-shrink-0 hidden sm:inline">
                      {challenge.id}
                    </span>
                  </div>
                  {challenge.description && (
                    <div className="text-xs text-gray-500 truncate">
                      {challenge.description.slice(0, 80)}
                    </div>
                  )}
                </div>

                {/* Personal best record — keystrokes count */}
                {solved && (
                  <span className="text-xs text-yellow-400 flex-shrink-0 tabular-nums flex items-center gap-1">
                    <KeyRound className="w-3 h-3 opacity-60" />
                    {record}
                  </span>
                )}
              </button>
            )
          })}
      </div>
    </div>
  )
}
