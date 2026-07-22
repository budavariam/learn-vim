import type { Language } from '../engine/types'
import type { KeyDisplayEvent } from '../hooks/useMonacoEditor'
import { useMonacoEditor } from '../hooks/useMonacoEditor'
import { getFile } from '../files/index'

interface EditorProps {
  language:           Language
  onCommandExecuted:  (cmd: string) => void
  onKeyDisplay?:      (event: KeyDisplayEvent) => void
}

const MONACO_LANGUAGE: Record<Language, string> = {
  go:         'go',
  rust:       'rust',
  python:     'python',
  typescript: 'typescript',
  c:          'c',
  cpp:        'cpp',
}

const FILE_NAME: Record<Language, string> = {
  go:         'utils.go',
  rust:       'utils.rs',
  python:     'utils.py',
  typescript: 'utils.ts',
  c:          'utils.c',
  cpp:        'utils.cpp',
}

export function Editor({ language, onCommandExecuted, onKeyDisplay }: EditorProps) {
  const { editorRef, statusRef } = useMonacoEditor({
    onCommandExecuted,
    onKeyDisplay,
    language:     MONACO_LANGUAGE[language],
    defaultValue: getFile(language),
  })

  return (
    <div className="flex flex-col h-full bg-gray-950">
      <div className="flex items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-gray-400 text-xs font-mono">{FILE_NAME[language]}</span>
        <span className="ml-auto text-xs text-gray-500 font-mono uppercase">{language}</span>
      </div>
      <div ref={editorRef} className="flex-1 min-h-0" />
      <div
        ref={statusRef}
        className="h-7 bg-gray-800 border-t border-gray-700 px-3 flex items-center text-xs font-mono text-gray-400"
      />
    </div>
  )
}
