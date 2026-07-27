import React, { useReducer, useState, useMemo } from 'react'
import {
  X,
  Plus,
  RotateCcw,
  EyeOff,
  FileJson,
  PenLine,
  Download,
  Pencil,
  Trash2,
  List,
} from 'lucide-react'
import {
  loadVimGolfHighScores,
  loadVimGolfRecords,
  resetVimGolfScoresForChallenge,
  loadExcludedChallenges,
  saveExcludedChallenges,
} from '../engine/VimGolfEngine'
import { getCachedChallenges } from '../hooks/useVimGolfChallenges'
import { STORAGE_KEYS } from '../engine/storageKeys'
import type { VimGolfChallenge } from '../engine/types'

// ── Custom challenge storage ──────────────────────────────────────────────────

function loadCustomChallenges(): VimGolfChallenge[] {
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

// ── Shared UI primitives ──────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon className="w-4 h-4 text-yellow-400" />
      <h2 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h2>
    </div>
  )
}

function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
  hint?: string
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-400 font-mono">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-gray-600">{hint}</p>}
    </div>
  )
}

const DIFF_BADGE_CLS: Record<VimGolfChallenge['difficulty'], string> = {
  easy: 'text-green-400  bg-green-900/30  border border-green-800',
  medium: 'text-yellow-400 bg-yellow-900/30 border border-yellow-800',
  hard: 'text-red-400    bg-red-900/30    border border-red-800',
}

const inputCls =
  'w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 font-mono'

const textareaCls =
  'w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 font-mono resize-y'

// ── Challenges tab (list + form) ──────────────────────────────────────────────

type FormState = {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string
  start: string
  end: string
  vimgolfId: string
}

const FORM_BLANK: FormState = {
  id: '',
  title: '',
  description: '',
  difficulty: 'medium',
  tags: '',
  start: '',
  end: '',
  vimgolfId: '',
}

function challengeToForm(c: VimGolfChallenge): FormState {
  return {
    id: c.id,
    title: c.title,
    description: c.description ?? '',
    difficulty: c.difficulty,
    tags: (c.tags ?? []).join(', '),
    start: c.start,
    end: c.end,
    vimgolfId: c.vimgolfId ?? '',
  }
}

function ChallengesTab({ onChanged }: { onChanged: () => void }) {
  const [list, setList] = useState<VimGolfChallenge[]>(() => loadCustomChallenges())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [form, setForm] = useReducer(
    (s: FormState, p: Partial<FormState>) => ({ ...s, ...p }),
    FORM_BLANK
  )
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const set = (p: Partial<FormState>) => setForm(p)
  const isEditing = editingId !== null

  function refresh() {
    const updated = loadCustomChallenges()
    setList(updated)
    onChanged()
  }

  function startEdit(c: VimGolfChallenge) {
    setEditingId(c.id)
    setForm(challengeToForm(c))
    setError('')
    setSaved(false)
    // scroll form into view
    document.getElementById('challenge-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(FORM_BLANK)
    setError('')
  }

  function handleDelete(id: string) {
    const next = loadCustomChallenges().filter(c => c.id !== id)
    saveCustomChallenges(next)
    setDeleteConfirmId(null)
    if (editingId === id) cancelEdit()
    refresh()
  }

  function handleSave() {
    setError('')
    if (!form.id.trim()) {
      setError('ID is required.')
      return
    }
    if (!form.title.trim()) {
      setError('Title is required.')
      return
    }
    if (!form.start.trim()) {
      setError('Starting content is required.')
      return
    }
    if (!form.end.trim()) {
      setError('Target content is required.')
      return
    }

    const challenge: VimGolfChallenge = {
      id: form.id.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
      difficulty: form.difficulty,
      tags: form.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
      start: form.start,
      end: form.end,
      vimgolfId: form.vimgolfId.trim() || undefined,
    }

    const existing = loadCustomChallenges().filter(c => c.id !== challenge.id)
    saveCustomChallenges([...existing, challenge])
    setEditingId(null)
    setForm(FORM_BLANK)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    refresh()
  }

  function handleExport() {
    const data = JSON.stringify(list, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'vimgolf-custom-challenges.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5">
      {/* Existing challenges list */}
      {list.length === 0 ? (
        <p className="text-xs text-gray-600 italic">No custom challenges yet. Add one below.</p>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">
              {list.length} custom challenge{list.length !== 1 ? 's' : ''}
            </span>
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-400 bg-gray-700 hover:bg-gray-600 transition-colors font-mono"
              title="Download all custom challenges as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
          <div className="space-y-1">
            {list.map(c => (
              <div
                key={c.id}
                className={`flex items-center gap-2 px-3 py-2 rounded border text-xs font-mono transition-colors ${
                  editingId === c.id
                    ? 'bg-blue-900/30 border-blue-700'
                    : 'bg-gray-800 border-gray-700'
                }`}
              >
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] flex-shrink-0 ${DIFF_BADGE_CLS[c.difficulty]}`}
                >
                  {c.difficulty[0].toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-white truncate block">{c.title}</span>
                  <span className="text-gray-600 text-[10px]">{c.id}</span>
                </div>
                <button
                  type="button"
                  onClick={() => startEdit(c)}
                  className="text-gray-500 hover:text-blue-400 transition-colors p-1 flex-shrink-0"
                  title="Edit"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                {deleteConfirmId === c.id ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      className="text-red-400 hover:text-red-300 transition-colors text-[10px] flex-shrink-0 animate-pulse"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(null)}
                      className="text-gray-600 hover:text-gray-400 transition-colors p-1 flex-shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(c.id)}
                    className="text-gray-600 hover:text-red-400 transition-colors p-1 flex-shrink-0"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      <hr className="border-gray-700" />

      {/* Form */}
      <div id="challenge-form">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
            {isEditing ? `Editing: ${editingId}` : 'New Challenge'}
          </span>
          {isEditing && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
          )}
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="ID" required hint="Unique identifier, e.g. my_challenge_1">
              <input
                value={form.id}
                onChange={e => set({ id: e.target.value })}
                placeholder="my_challenge_1"
                readOnly={isEditing}
                className={`${inputCls} ${isEditing ? 'opacity-60 cursor-default' : ''}`}
              />
            </Field>
            <Field label="Title" required>
              <input
                value={form.title}
                onChange={e => set({ title: e.target.value })}
                placeholder="Delete trailing spaces"
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Description">
            <input
              value={form.description}
              onChange={e => set({ description: e.target.value })}
              placeholder="Optional description"
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Difficulty">
              <div className="flex gap-2">
                {(['easy', 'medium', 'hard'] as const).map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => set({ difficulty: d })}
                    className={`px-3 py-1 rounded text-xs font-mono capitalize transition-colors ${
                      form.difficulty === d
                        ? d === 'easy'
                          ? 'bg-green-700 text-white'
                          : d === 'medium'
                            ? 'bg-yellow-700 text-white'
                            : 'bg-red-700 text-white'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Tags" hint="Comma-separated">
              <input
                value={form.tags}
                onChange={e => set({ tags: e.target.value })}
                placeholder="motion, delete"
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Starting content" required>
            <textarea
              value={form.start}
              onChange={e => set({ start: e.target.value })}
              placeholder="The text the editor starts with…"
              rows={4}
              className={textareaCls}
            />
          </Field>

          <Field label="Target content" required>
            <textarea
              value={form.end}
              onChange={e => set({ end: e.target.value })}
              placeholder="The text the editor must become…"
              rows={4}
              className={textareaCls}
            />
          </Field>

          <Field label="VimGolf.com challenge ID" hint="Optional — for attribution">
            <input
              value={form.vimgolfId}
              onChange={e => set({ vimgolfId: e.target.value })}
              placeholder="4d1a34cce3f1d84e5500001c"
              className={inputCls}
            />
          </Field>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs font-mono transition-colors"
            >
              {isEditing ? 'Update challenge' : 'Save challenge'}
            </button>
            {saved && (
              <span className="text-xs text-green-400">{isEditing ? 'Updated!' : 'Saved!'}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Import JSON ───────────────────────────────────────────────────────────────

function ImportJsonSection({ onSaved }: { onSaved: () => void }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [savedCount, setSavedCount] = useState<number | null>(null)

  function handleImport() {
    setError('')
    setSavedCount(null)
    try {
      const raw = JSON.parse(input)
      const items: Partial<VimGolfChallenge>[] = Array.isArray(raw) ? raw : [raw]

      const validated: VimGolfChallenge[] = []
      for (const parsed of items) {
        if (!parsed.id?.trim()) {
          setError('Every entry must have an "id" field.')
          return
        }
        if (!parsed.title || !parsed.start || !parsed.end) {
          setError(`Entry "${parsed.id}" is missing "title", "start", or "end".`)
          return
        }
        validated.push({
          id: parsed.id.trim(),
          title: parsed.title,
          description: parsed.description ?? '',
          start: parsed.start,
          end: parsed.end,
          difficulty: parsed.difficulty ?? 'medium',
          tags: parsed.tags ?? [],
          vimgolfId: parsed.vimgolfId,
        })
      }

      const existing = loadCustomChallenges()
      const existingMap = new Map(existing.map(c => [c.id, c]))
      for (const c of validated) existingMap.set(c.id, c)
      saveCustomChallenges([...existingMap.values()])
      setInput('')
      setSavedCount(validated.length)
      setTimeout(() => setSavedCount(null), 3000)
      onSaved()
    } catch {
      setError('Invalid JSON.')
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500">
        Paste a JSON object or an array of objects. Required fields per entry:{' '}
        <code className="text-gray-300">id, title, start, end</code>. Optional:{' '}
        <code className="text-gray-300">description, difficulty, tags, vimgolfId</code>. Existing
        entries with the same ID are overwritten.
      </p>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={'{\n  "id": "my_id",\n  "title": "...",\n  "start": "...",\n  "end": "..."\n}'}
        rows={7}
        className={textareaCls}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleImport}
          className="px-4 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs font-mono transition-colors"
        >
          Import
        </button>
        {savedCount !== null && (
          <span className="text-xs text-green-400">
            {savedCount} challenge{savedCount !== 1 ? 's' : ''} imported.
          </span>
        )}
      </div>
    </div>
  )
}

// ── Reset Scores ──────────────────────────────────────────────────────────────

function ResetScoresSection() {
  const [id, setId] = useState('')
  const [confirmSingle, setConfirmSingle] = useState(false)
  const [confirmAll, setConfirmAll] = useState(false)
  const [done, setDone] = useState('')

  const scores = loadVimGolfHighScores()
  const records = loadVimGolfRecords()
  const trimmed = id.trim()
  const entryCount = scores[trimmed]?.length ?? 0
  const hasRecord = records[trimmed] !== undefined
  const totalScoredCount = Object.keys(scores).length

  function flash(msg: string) {
    setDone(msg)
    setTimeout(() => setDone(''), 2500)
  }

  function handleResetOne() {
    if (!trimmed) return
    resetVimGolfScoresForChallenge(trimmed)
    setId('')
    setConfirmSingle(false)
    flash('Scores cleared.')
  }

  function handleResetAll() {
    localStorage.removeItem(STORAGE_KEYS.VIMGOLF_SCORES)
    localStorage.removeItem(STORAGE_KEYS.VIMGOLF_RECORDS)
    setConfirmAll(false)
    flash('All scores cleared.')
  }

  return (
    <div className="space-y-5">
      {/* Per-challenge reset */}
      <div className="space-y-3">
        <p className="text-xs text-gray-500">
          Enter a challenge ID to permanently delete its scores and personal best.
        </p>
        <div className="flex gap-2">
          <input
            value={id}
            onChange={e => {
              setId(e.target.value)
              setConfirmSingle(false)
            }}
            placeholder="challenge-id"
            className={`${inputCls} flex-1`}
          />
          {!confirmSingle ? (
            <button
              type="button"
              onClick={() => {
                if (trimmed) setConfirmSingle(true)
              }}
              disabled={!trimmed}
              className="px-3 py-1.5 bg-red-800 hover:bg-red-700 disabled:opacity-40 text-white rounded text-xs font-mono transition-colors flex-shrink-0"
            >
              Reset
            </button>
          ) : (
            <div className="flex gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={handleResetOne}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-mono transition-colors animate-pulse"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setConfirmSingle(false)}
                className="px-2 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-xs font-mono transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        {trimmed && (entryCount > 0 || hasRecord) && (
          <p className="text-xs text-gray-400">
            Found:{' '}
            <span className="text-white">
              {entryCount} score{entryCount !== 1 ? 's' : ''}
            </span>
            {hasRecord && (
              <span>
                , personal best <span className="text-yellow-400">{records[trimmed]}</span>{' '}
                keystrokes
              </span>
            )}
          </p>
        )}
        {trimmed && entryCount === 0 && !hasRecord && (
          <p className="text-xs text-gray-600">No scores found for this ID.</p>
        )}
      </div>

      <hr className="border-gray-700" />

      {/* Reset all */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-300 font-mono">Reset all scores</p>
            <p className="text-xs text-gray-600 mt-0.5">
              Clears every score and personal best.
              {totalScoredCount > 0 && (
                <span className="text-gray-500 ml-1">
                  ({totalScoredCount} challenge{totalScoredCount !== 1 ? 's' : ''} currently have
                  scores)
                </span>
              )}
            </p>
          </div>
          {!confirmAll ? (
            <button
              type="button"
              onClick={() => setConfirmAll(true)}
              disabled={totalScoredCount === 0}
              className="px-3 py-1.5 bg-red-900 hover:bg-red-800 disabled:opacity-40 text-red-300 rounded text-xs font-mono transition-colors flex-shrink-0"
            >
              Reset all
            </button>
          ) : (
            <div className="flex gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={handleResetAll}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-mono transition-colors animate-pulse"
              >
                Yes, clear everything
              </button>
              <button
                type="button"
                onClick={() => setConfirmAll(false)}
                className="px-2 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-xs font-mono transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {done && <p className="text-xs text-green-400">{done}</p>}
    </div>
  )
}

// ── Excluded Challenges ───────────────────────────────────────────────────────

function ExcludedSection() {
  const [excluded, setExcludedState] = useState<string[]>(() => loadExcludedChallenges())
  const [input, setInput] = useState('')

  // Build a title lookup from the combined challenge pool
  const titleMap = useMemo(() => {
    const map = new Map<string, string>()
    const cached = getCachedChallenges()
    for (const c of cached) map.set(c.id, c.title)
    for (const c of loadCustomChallenges()) map.set(c.id, c.title)
    return map
  }, [])

  function add() {
    const val = input.trim()
    if (!val || excluded.includes(val)) {
      setInput('')
      return
    }
    const next = [...excluded, val]
    saveExcludedChallenges(next)
    setExcludedState(next)
    setInput('')
  }

  function remove(id: string) {
    const next = excluded.filter(e => e !== id)
    saveExcludedChallenges(next)
    setExcludedState(next)
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">
        Excluded challenges are hidden from the VimGolf listing and not used in Goal Mode.
      </p>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') add()
          }}
          placeholder="challenge-id"
          className={`${inputCls} flex-1`}
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs font-mono transition-colors flex-shrink-0 flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Exclude
        </button>
      </div>
      {excluded.length === 0 ? (
        <p className="text-xs text-gray-600 italic">No challenges excluded.</p>
      ) : (
        <div className="space-y-1">
          {excluded.map(id => {
            const title = titleMap.get(id)
            return (
              <div
                key={id}
                className="flex items-center justify-between px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs font-mono"
              >
                <div className="min-w-0">
                  {title ? (
                    <>
                      <span className="text-white truncate block">{title}</span>
                      <span className="text-gray-600 text-[10px]">{id}</span>
                    </>
                  ) : (
                    <span className="text-gray-400">{id}</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => remove(id)}
                  className="text-gray-600 hover:text-red-400 transition-colors ml-3 flex-shrink-0"
                  title="Remove from exclusion list"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Main screen ───────────────────────────────────────────────────────────────

type Tab = 'challenges' | 'import' | 'reset' | 'exclude'

export function HelpVimGolfScreen() {
  const [tab, setTab] = useState<Tab>('challenges')
  const [customCount, setCustomCount] = useState(() => loadCustomChallenges().length)

  function refreshCount() {
    setCustomCount(loadCustomChallenges().length)
  }

  const tabs: { id: Tab; icon: React.ElementType; label: string }[] = [
    { id: 'challenges', icon: List, label: 'Challenges' },
    { id: 'import', icon: FileJson, label: 'Import JSON' },
    { id: 'reset', icon: RotateCcw, label: 'Reset Scores' },
    { id: 'exclude', icon: EyeOff, label: 'Excluded' },
  ]

  return (
    <div className="min-h-screen bg-gray-900 font-mono text-white">
      <div className="max-w-2xl mx-auto py-8 px-5">
        <div className="mb-6">
          <h1 className="text-lg font-bold text-yellow-400 tracking-wider mb-1">
            VimGolf Management
          </h1>
          <p className="text-xs text-gray-500">
            Manage custom challenges, scores, and visibility.
            {customCount > 0 && (
              <span className="ml-2 text-gray-400">
                {customCount} custom challenge{customCount !== 1 ? 's' : ''} stored.
              </span>
            )}
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 border-b border-gray-700 mb-6">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono transition-colors border-b-2 -mb-px ${
                tab === t.id
                  ? 'border-yellow-400 text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-5">
          {tab === 'challenges' && (
            <>
              <SectionHeader icon={PenLine} title="Custom Challenges" />
              <ChallengesTab onChanged={refreshCount} />
            </>
          )}
          {tab === 'import' && (
            <>
              <SectionHeader icon={FileJson} title="Import from JSON" />
              <ImportJsonSection onSaved={refreshCount} />
            </>
          )}
          {tab === 'reset' && (
            <>
              <SectionHeader icon={RotateCcw} title="Reset Challenge Scores" />
              <ResetScoresSection />
            </>
          )}
          {tab === 'exclude' && (
            <>
              <SectionHeader icon={EyeOff} title="Excluded Challenges" />
              <ExcludedSection />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
