import { goFile }         from './go'
import { rustFile }       from './rust'
import { pythonFile }     from './python'
import { typescriptFile } from './typescript'
import { cFile }          from './c'
import { cppFile }        from './cpp'
import type { Language }  from '../engine/types'

export const FILES: Record<Language, string> = {
  go:         goFile,
  rust:       rustFile,
  python:     pythonFile,
  typescript: typescriptFile,
  c:          cFile,
  cpp:        cppFile,
}

export function getFile(lang: Language): string {
  return FILES[lang]
}
