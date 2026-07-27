import { useEffect, useRef, useCallback } from 'react'
import {
  formatKeyEvent,
  SOLUTIONS,
  VimSequenceMatcher,
  CROSS_MODE_SOLUTIONS,
} from '../engine/vimKeyUtils'

// Solution sets and matching logic are in vimKeyUtils, shared with DevModeScreen.

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Passed to onKeyDisplay so consumers (debug bar, dev mode) get full context. */
export interface KeyDisplayEvent {
  display: string // formatted key string, e.g. "<Esc>", "j"
  vimMode: 'normal' | 'other'
  inSolutions: boolean // true if display is a known vim solution
}

export interface MonacoAction {
  id: string
  label: string
  run: () => void
}

export interface UseMonacoEditorOptions {
  onCommandExecuted?: (cmd: string) => void
  /** Called for every keydown regardless of mode (used for VimGolf counting). */
  onAnyKey?: () => void
  /** Called for every keydown with full context (debug bar, dev mode). */
  onKeyDisplay?: (event: KeyDisplayEvent) => void
  /** Called once after Monaco + vim mode finish initialising. */
  onReady?: () => void
  /**
   * Called once inside the Monaco init() function, right after the editor
   * instance and its built-in decoration collections are created but before
   * vim mode starts. Consumers can use this to create additional decoration
   * collections or store a reference to the editor/monaco instances.
   * eslint-disable-next-line @typescript-eslint/no-explicit-any
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEditorCreated?: (monaco: any, editor: any) => void
  onCursorChange?: (position: { lineNumber: number; column: number }) => void
  /** Called whenever the editor content changes (after each model edit). */
  onContentChange?: (content: string) => void
  language?: string
  /** Initial buffer content — applied at editor creation time (async-safe). */
  defaultValue?: string
  /**
   * If provided together with `targetEditorRef`, creates a read-only Monaco
   * editor showing this content and draws colored gutter diff markers on both
   * the editing pane and the target pane for every line that differs.
   */
  targetContent?: string
  /** Container div for the read-only target editor (diff right-pane). */
  targetEditorRef?: React.RefObject<HTMLDivElement>
  /** Extra actions registered into Monaco's command palette (F1). */
  monacoActions?: MonacoAction[]
  /**
   * When true the Monaco editor is created with readOnly:true — cursor
   * movement and search work normally; text-editing commands have no effect.
   * Use this instead of manually blocking keydown events (which would also
   * suppress Monaco's own vim-mode key handling).
   */
  readOnly?: boolean
}

export interface TrailEntry {
  lineNumber: number
  column: number
  age: number // 0 = cursor position, 1 = most recent trail, higher = older
  type: 'user' | 'enemy'
  colorIdx?: number // enemy only: which SCSS palette (0–5)
  isSolid?: boolean
}

export interface UseMonacoEditorReturn {
  editorRef: React.RefObject<HTMLDivElement>
  statusRef: React.RefObject<HTMLDivElement>
  setContent: (content: string) => void
  resetCursor: () => void
  getContent: () => string
  focusEditor: () => void
  positionCursor: (pos: { lineNumber: number; column: number }) => void
  setTargetHighlight: (pos: { lineNumber: number; column: number } | null) => void
  setGoalHighlights: (goals: { lineNumber: number; column: number }[]) => void
  setTrailDecorations: (trail: TrailEntry[]) => void
  getVisibleRange: () => { startLine: number; endLine: number } | null
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useMonacoEditor(options: UseMonacoEditorOptions = {}): UseMonacoEditorReturn {
  const { language = 'plaintext' } = options

  const onCommandRef = useRef(options.onCommandExecuted)
  useEffect(() => {
    onCommandRef.current = options.onCommandExecuted
  }, [options.onCommandExecuted])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEditorCreatedRef = useRef(options.onEditorCreated)
  useEffect(() => {
    onEditorCreatedRef.current = options.onEditorCreated
  }, [options.onEditorCreated])

  const onAnyKeyRef = useRef(options.onAnyKey)
  useEffect(() => {
    onAnyKeyRef.current = options.onAnyKey
  }, [options.onAnyKey])

  const onKeyDisplayRef = useRef(options.onKeyDisplay)
  useEffect(() => {
    onKeyDisplayRef.current = options.onKeyDisplay
  }, [options.onKeyDisplay])

  const onCursorChangeRef = useRef(options.onCursorChange)
  useEffect(() => {
    onCursorChangeRef.current = options.onCursorChange
  }, [options.onCursorChange])

  const onReadyRef = useRef(options.onReady)
  useEffect(() => {
    onReadyRef.current = options.onReady
  }, [options.onReady])

  const onContentChangeRef = useRef(options.onContentChange)
  useEffect(() => {
    onContentChangeRef.current = options.onContentChange
  }, [options.onContentChange])

  const monacoActionsRef = useRef(options.monacoActions ?? [])
  useEffect(() => {
    monacoActionsRef.current = options.monacoActions ?? []
  }, [options.monacoActions])

  const defaultValueRef = useRef(options.defaultValue ?? '')
  const targetContentRef = useRef(options.targetContent ?? '')
  const editorRef = useRef<HTMLDivElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorInstanceRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vimModeRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const monacoRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const targetHighlightColRef = useRef<any>(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const trailDecColRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const goalDecColRef = useRef<any>(null)

  const setContent = useCallback((content: string) => {
    editorInstanceRef.current?.setValue(content)
  }, [])
  const resetCursor = useCallback(() => {
    const e = editorInstanceRef.current
    if (!e) return
    e.setPosition({ lineNumber: 1, column: 1 })
    e.revealPosition({ lineNumber: 1, column: 1 })
  }, [])
  const getContent = useCallback((): string => editorInstanceRef.current?.getValue() ?? '', [])
  const focusEditor = useCallback(() => {
    editorInstanceRef.current?.focus()
  }, [])
  const positionCursor = useCallback((pos: { lineNumber: number; column: number }) => {
    const ed = editorInstanceRef.current
    if (!ed) return
    ed.setPosition(pos)
    ed.revealPositionInCenter(pos)
  }, [])
  const setTargetHighlight = useCallback((pos: { lineNumber: number; column: number } | null) => {
    const col = targetHighlightColRef.current
    const m = monacoRef.current
    const ed = editorInstanceRef.current
    if (!col || !m || !ed) return
    if (!pos) {
      col.set([])
      return
    }
    const model = ed.getModel()
    const maxCol =
      model && pos.lineNumber <= model.getLineCount() ? model.getLineMaxColumn(pos.lineNumber) : 1
    let startCol = pos.column
    let endCol = pos.column + 1
    const isPastEnd = startCol >= maxCol
    if (startCol > maxCol) startCol = maxCol
    if (endCol > maxCol) endCol = maxCol

    col.set([
      {
        range: new m.Range(pos.lineNumber, startCol, pos.lineNumber, endCol),
        options: {
          inlineClassName: isPastEnd ? undefined : 'motion-race-target',
          linesDecorationsClassName: 'motion-race-target-gutter',
          description: 'motion-race-target',
          ...(isPastEnd
            ? { after: { content: '\u00A0', inlineClassName: 'motion-race-target' } }
            : {}),
        },
      },
    ])
  }, [])

  const setGoalHighlights = useCallback((goals: { lineNumber: number; column: number }[]) => {
    const targetCol = targetHighlightColRef.current
    const altCol = goalDecColRef.current
    const m = monacoRef.current
    const ed = editorInstanceRef.current
    if (!m || !ed) return
    if (goals.length === 0) {
      targetCol?.set([])
      altCol?.set([])
      return
    }
    const model = ed.getModel()
    if (!model) return

    if (targetCol) {
      targetCol.set(
        goals.map(pos => {
          const maxCol =
            pos.lineNumber <= model.getLineCount() ? model.getLineMaxColumn(pos.lineNumber) : 1
          let startCol = pos.column
          let endCol = pos.column + 1
          const isPastEnd = startCol >= maxCol
          if (startCol > maxCol) startCol = maxCol
          if (endCol > maxCol) endCol = maxCol

          return {
            range: new m.Range(pos.lineNumber, startCol, pos.lineNumber, endCol),
            options: {
              inlineClassName: isPastEnd ? undefined : 'motion-race-target',
              linesDecorationsClassName: 'motion-race-target-gutter',
              description: 'motion-race-target',
              ...(isPastEnd
                ? { after: { content: '\u00A0', inlineClassName: 'motion-race-target' } }
                : {}),
            },
          }
        })
      )
    }
    if (altCol) {
      altCol.set([])
    }
  }, [])

  const setTrailDecorations = useCallback((trail: TrailEntry[]) => {
    const col = trailDecColRef.current
    const m = monacoRef.current
    const ed = editorInstanceRef.current
    if (!col || !m || !ed) return
    const model = ed.getModel()
    if (!model) return

    const decorations = trail.map(pos => {
      const maxAge = pos.isSolid ? 3 : 8
      const age = Math.min(pos.age, maxAge)
      const cls = pos.type === 'user' ? `trail-user-${age}` : `trail-ec${pos.colorIdx ?? 0}-${age}`

      const maxCol =
        pos.lineNumber <= model.getLineCount() ? model.getLineMaxColumn(pos.lineNumber) : 1
      let startCol = pos.column
      let endCol = pos.column + 1
      const isPastEnd = startCol >= maxCol

      if (startCol > maxCol) startCol = maxCol
      if (endCol > maxCol) endCol = maxCol

      return {
        range: new m.Range(pos.lineNumber, startCol, pos.lineNumber, endCol),
        options: {
          inlineClassName: isPastEnd ? undefined : cls,
          description: 'motion-race-trail',
          ...(isPastEnd ? { after: { content: '\u00A0', inlineClassName: cls } } : {}),
        },
      }
    })

    col.set(decorations)
  }, [])

  const getVisibleRange = useCallback((): { startLine: number; endLine: number } | null => {
    const ed = editorInstanceRef.current
    if (!ed) return null
    const ranges = ed.getVisibleRanges()
    if (!ranges.length) return null
    return {
      startLine: ranges[0].startLineNumber,
      endLine: ranges[ranges.length - 1].endLineNumber,
    }
  }, [])

  // Apply new defaultValue immediately if Monaco is already running (e.g. language switch)
  useEffect(() => {
    defaultValueRef.current = options.defaultValue ?? ''
    const ed = editorInstanceRef.current
    if (ed) {
      ed.setValue(defaultValueRef.current)
      ed.setPosition({ lineNumber: 1, column: 1 })
    }
  }, [options.defaultValue])

  // Update targetContent ref; the diff logic inside init() reads it
  // via onDidChangeModelContent and applies gutter decorations.
  useEffect(() => {
    targetContentRef.current = options.targetContent ?? ''
    // Sync the read-only target editor value when content changes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const targetEd: any = (options.targetEditorRef?.current as any)?.__monacoEditor
    if (targetEd) targetEd.setValue(targetContentRef.current)
  }, [options.targetContent, options.targetEditorRef])

  // ── Main Monaco init effect ───────────────────────────────────────────────
  useEffect(() => {
    if (!editorRef.current) return
    let disposed = false
    let cleanupKeydown: (() => void) | null = null
    let cleanupObserver: (() => void) | null = null

    async function init() {
      try {
        const monaco = await import('monaco-editor')
        const { initVimMode } = await import('monaco-vim')
        if (disposed || !editorRef.current) return

        const editor = monaco.editor.create(editorRef.current, {
          value: defaultValueRef.current,
          language,
          theme: 'vs-dark',
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          renderLineHighlight: 'all',
          automaticLayout: true,
          wordWrap: 'off',
          inlineSuggest: { enabled: false },
          renderWhitespace: 'all',
          readOnly: options.readOnly ?? false,
        })
        editorInstanceRef.current = editor

        // ── Target (read-only) editor + diff gutter markers ───────────────
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let targetEditor: any = null
        const targetContainer = options.targetEditorRef?.current

        if (targetContainer) {
          targetEditor = monaco.editor.create(targetContainer, {
            value: targetContentRef.current,
            language,
            theme: 'vs-dark',
            readOnly: true,
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            renderLineHighlight: 'none',
            automaticLayout: true,
            wordWrap: 'off',
            domReadOnly: true,
            scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            renderWhitespace: 'all',
          })
          // Expose on the container element so the targetContent effect can reach it
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(targetContainer as any).__monacoEditor = targetEditor
        }

        // Gutter diff decorations — applied to both editors.
        // linesDecorationsClassName places a coloured bar in the left margin.
        const editDecols = editor.createDecorationsCollection([])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const targetDecols = targetEditor
          ? (targetEditor as any).createDecorationsCollection([])
          : null

        const updateDiffDecorations = () => {
          const target = targetContentRef.current
          const model = editor.getModel()
          if (!target || !model) {
            editDecols.set([])
            targetDecols?.set([])
            return
          }

          const currentLines = model.getValue().split('\n')
          const targetLines = target.split('\n')
          const maxLines = Math.max(currentLines.length, targetLines.length)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const editDecs: any[] = []
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const tgtDecs: any[] = []

          for (let i = 0; i < maxLines; i++) {
            const cur = currentLines[i]
            const tgt = targetLines[i]
            if (cur === tgt) continue

            const lineNum = i + 1
            if (lineNum > model.getLineCount()) continue

            // classify the change
            let cls: string
            if (cur === undefined) {
              cls = 'goal-diff-added' // target has more lines — need to add
            } else if (tgt === undefined) {
              cls = 'goal-diff-removed' // too many lines — need to remove
            } else {
              cls = 'goal-diff-changed' // line exists but differs
            }

            const decoOpts = { linesDecorationsClassName: cls, description: 'goal-diff' }
            const range = new monaco.Range(lineNum, 1, lineNum, 1)
            editDecs.push({ range, options: decoOpts })
            tgtDecs.push({
              range: new monaco.Range(lineNum, 1, lineNum, 1),
              options: decoOpts,
            })
          }

          editDecols.set(editDecs)
          if (targetDecols && targetEditor) {
            // Ensure target model has the right number of lines for decoration
            const tgtModel = targetEditor.getModel()
            const filteredTgt = tgtDecs.filter(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (d: any) => d.range.startLineNumber <= (tgtModel?.getLineCount() ?? 0)
            )
            targetDecols.set(filteredTgt)
          }
        }

        if (targetContentRef.current) updateDiffDecorations()
        const diffContentListener = editor.onDidChangeModelContent(updateDiffDecorations)

        monacoRef.current = monaco
        targetHighlightColRef.current = editor.createDecorationsCollection([])
        trailDecColRef.current = editor.createDecorationsCollection([])
        goalDecColRef.current = editor.createDecorationsCollection([])

        onEditorCreatedRef.current?.(monaco, editor)

        const cursorListener = editor.onDidChangeCursorPosition(e => {
          onCursorChangeRef.current?.(e.position)
        })
        const contentListener = editor.onDidChangeModelContent(() => {
          onContentChangeRef.current?.(editor.getValue())
        })

        const statusEl = statusRef.current ?? document.createElement('div')
        const vimMode = initVimMode(editor, statusEl)
        vimModeRef.current = vimMode

        // ── Mode tracking ────────────────────────────────────────────────
        let currentVimMode: 'normal' | 'other' = 'normal'
        let lastStatusText = ''
        const matcher = new VimSequenceMatcher()

        // Map vim fold commands to Monaco editor actions.
        // Monaco must have folding enabled (it is by default for most languages).
        const FOLD_ACTION_MAP: Record<string, string> = {
          za: 'editor.toggleFold',
          zo: 'editor.unfold',
          zc: 'editor.fold',
          zO: 'editor.unfoldRecursively',
          zC: 'editor.foldRecursively',
          zR: 'editor.unfoldAll',
          zM: 'editor.foldAll',
          zr: 'editor.unfoldRecursively',
          zm: 'editor.foldAll',
        }

        const emitIfKnown = (cmd: string) => {
          if (!SOLUTIONS.has(cmd)) return
          onCommandRef.current?.(cmd)
          // Fold commands: also trigger Monaco's native fold action so the editor responds
          const foldActionId = FOLD_ACTION_MAP[cmd]
          if (foldActionId) {
            editor.getAction(foldActionId)?.run()
          }
        }

        // Monaco-vim appends a <form><input> to the statusbar for command-line
        // mode. textContent returns '' for input elements, so we must read the
        // input's value explicitly to detect ':'-mode and capture the full command.
        function getStatusText(): string {
          const input = statusEl.querySelector('input[type="text"]') as HTMLInputElement | null
          if (input) return ':' + input.value
          return (statusEl.textContent ?? '').trim()
        }

        const modeObserver = new MutationObserver(mutations => {
          // Check if the command-line input element was REMOVED (command submitted).
          // Reading .value from a removed node is reliable — the JS object persists
          // even after DOM detachment — so we get the full command (e.g. ':close').
          // This is more reliable than listening for 'input' events because
          // monaco-vim uses keydown + preventDefault for command-line chars,
          // which suppresses the browser's own 'input' events.
          for (const mutation of mutations) {
            for (const removed of Array.from(mutation.removedNodes)) {
              const inp =
                removed instanceof HTMLInputElement
                  ? removed
                  : removed instanceof Element
                    ? removed.querySelector('input[type="text"]')
                    : null
              if (inp) {
                const val = (inp as HTMLInputElement).value ?? ''
                // Input value is just the command text without the ':' prefix
                const cmd = val ? ':' + val : lastStatusText.trim()
                if (cmd.startsWith(':')) emitIfKnown(cmd)
                lastStatusText = ''
                currentVimMode = 'normal'
                return
              }
            }
          }

          // No input removed — regular mode-change detection
          const text = getStatusText()
          if (text === lastStatusText) return

          if (lastStatusText.startsWith(':') && text === '') {
            emitIfKnown(lastStatusText.trim())
          }
          lastStatusText = text

          if (
            text.includes('INSERT') ||
            text.includes('REPLACE') ||
            text.includes('VISUAL') ||
            text.startsWith(':') ||
            text.startsWith('/') ||
            text.startsWith('?')
          ) {
            // Flush any buffered ambiguous solution before losing normal mode.
            // e.g. user presses 'ea': 'e' is buffered (ambiguous), 'a' extends
            // to 'ea' (also ambiguous), then vim enters insert mode — we flush
            // 'ea' here so the challenge completes.
            const flushed = matcher.reset()
            if (flushed) emitIfKnown(flushed)
            currentVimMode = 'other'
          } else {
            currentVimMode = 'normal'
          }
        })
        modeObserver.observe(statusEl, { childList: true, subtree: true, characterData: true })

        // Also track input events as a secondary mechanism for keeping
        // lastStatusText current (fallback if removed-node approach misses edge cases).
        const handleStatusInput = (e: Event) => {
          const target = e.target as HTMLInputElement
          if (!statusEl.contains(target)) return
          lastStatusText = ':' + target.value
          currentVimMode = 'other'
        }
        statusEl.addEventListener('input', handleStatusInput)

        // ── Keystroke handler ─────────────────────────────────────────────
        // Rolling cross-mode buffer: tracks all keypresses regardless of vim
        // mode so that space-containing solutions like 'ea 2f' (normal 'ea'
        // then insert ' 2f') can be detected across mode boundaries.
        const CROSS_MODE_WINDOW = 12 // max keystroke count for any cross-mode solution
        const crossModeKeys: string[] = []
        const editorDomNode = editor.getDomNode()

        const handleKeydown = (e: KeyboardEvent) => {
          // Only process when the editor main area or vim command-line has focus
          const active = document.activeElement
          const inEditor = !!editorDomNode?.contains(active)
          const inCmdLine = !!statusEl.contains(active)
          if (!inEditor && !inCmdLine) return

          // Do not count the submission shortcut (Cmd/Ctrl + Enter)
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) return

          const display = formatKeyEvent(e)

          // Only count and log keypresses that carry vim meaning
          if (display) {
            onAnyKeyRef.current?.()
            onKeyDisplayRef.current?.({
              display,
              vimMode: currentVimMode,
              inSolutions: SOLUTIONS.has(display),
            })

            // Cross-mode rolling buffer: add key and check space-containing solutions.
            // e.g. 'ea 2f': 'e','a' in normal mode, ' ','2','f' in insert mode.
            crossModeKeys.push(display)
            if (crossModeKeys.length > CROSS_MODE_WINDOW) crossModeKeys.shift()

            for (const sol of CROSS_MODE_SOLUTIONS) {
              if (crossModeKeys.length >= sol.length) {
                const suffix = crossModeKeys.slice(-sol.length).join('')
                if (suffix === sol) {
                  emitIfKnown(sol)
                  crossModeKeys.length = 0 // clear after a cross-mode match
                  break
                }
              }
            }
          }

          // Escape: flush any buffered ambiguous solution, reset cross-mode buffer
          if (e.key === 'Escape' || (e.ctrlKey && !e.altKey && !e.metaKey && e.key === '[')) {
            crossModeKeys.length = 0
            const flushed = matcher.reset()
            if (flushed) emitIfKnown(flushed)
            emitIfKnown('<Esc>')
            return
          }

          if (currentVimMode !== 'normal') return
          if (e.altKey || e.metaKey) return

          let key: string
          if (e.ctrlKey) {
            if (e.key.length === 1 || e.key === ']' || e.key === '^') {
              key = `<C-${e.key.toLowerCase()}>`
            } else {
              return
            }
          } else if (e.key.length === 1) {
            key = e.key
          } else {
            return
          }

          // push() may return 0, 1, or 2 solutions (flush+retry on dead end)
          const matches = matcher.push(key)
          for (const m of matches) emitIfKnown(m)
        }

        document.addEventListener('keydown', handleKeydown, { capture: true })
        cleanupKeydown = () => {
          document.removeEventListener('keydown', handleKeydown, { capture: true })
          statusEl.removeEventListener('input', handleStatusInput)
          cursorListener.dispose()
          contentListener.dispose()
          diffContentListener.dispose()
          editDecols.clear()
          targetDecols?.clear()
          targetHighlightColRef.current?.clear()
          targetHighlightColRef.current = null
          trailDecColRef.current?.clear()
          trailDecColRef.current = null
          goalDecColRef.current?.clear()
          goalDecColRef.current = null
          monacoRef.current = null
          if (targetEditor) {
            try {
              targetEditor.dispose()
            } catch (_) {
              /* */
            }
            if (options.targetEditorRef?.current) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              delete (options.targetEditorRef.current as any).__monacoEditor
            }
          }
        }
        cleanupObserver = () => modeObserver.disconnect()

        // Register command palette actions (F1)
        for (const action of monacoActionsRef.current) {
          const id = action.id
          editor.addAction({
            id,
            label: action.label,
            contextMenuGroupId: 'vim-arcade',
            run: () => monacoActionsRef.current.find(a => a.id === id)?.run(),
          })
        }

        onReadyRef.current?.()
        editor.focus()
      } catch (err) {
        console.error('[useMonacoEditor] init failed — vim mode will not work:', err)
      }
    }

    init()

    return () => {
      disposed = true
      cleanupKeydown?.()
      cleanupObserver?.()
      if (vimModeRef.current) {
        try {
          vimModeRef.current.dispose()
        } catch (_) {
          /* */
        }
        vimModeRef.current = null
      }
      if (editorInstanceRef.current) {
        try {
          editorInstanceRef.current.dispose()
        } catch (_) {
          /* */
        }
        editorInstanceRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const ed = editorInstanceRef.current
    if (!ed) return
    import('monaco-editor').then(monaco => {
      const model = ed.getModel()
      if (model) monaco.editor.setModelLanguage(model, language)
    })
  }, [language])

  return {
    editorRef,
    statusRef,
    setContent,
    resetCursor,
    getContent,
    focusEditor,
    positionCursor,
    setTargetHighlight,
    setGoalHighlights,
    setTrailDecorations,
    getVisibleRange,
  }
}
