import { goFile, goFileShort, goFileMedium, goFileLong } from './go'
import { rustFile, rustFileShort, rustFileMedium, rustFileLong } from './rust'
import { pythonFile, pythonFileShort, pythonFileMedium, pythonFileLong } from './python'
import {
  typescriptFile,
  typescriptFileShort,
  typescriptFileMedium,
  typescriptFileLong,
} from './typescript'
import { cFile, cFileShort, cFileMedium, cFileLong } from './c'
import { cppFile, cppFileShort, cppFileMedium, cppFileLong } from './cpp'
import { loremFileShort, loremFileMedium, loremFileLong } from './lorem'
import type { Language } from '../engine/types'

export const FILES: Record<Language, string> = {
  go: goFile,
  rust: rustFile,
  python: pythonFile,
  typescript: typescriptFile,
  c: cFile,
  cpp: cppFile,
  lorem: loremFileMedium,
}

export const SIZED_FILES: Record<Language, { short: string; medium: string; long: string }> = {
  go: { short: goFileShort, medium: goFileMedium, long: goFileLong },
  rust: { short: rustFileShort, medium: rustFileMedium, long: rustFileLong },
  python: { short: pythonFileShort, medium: pythonFileMedium, long: pythonFileLong },
  typescript: {
    short: typescriptFileShort,
    medium: typescriptFileMedium,
    long: typescriptFileLong,
  },
  c: { short: cFileShort, medium: cFileMedium, long: cFileLong },
  cpp: { short: cppFileShort, medium: cppFileMedium, long: cppFileLong },
  lorem: { short: loremFileShort, medium: loremFileMedium, long: loremFileLong },
}

export function getFile(lang: Language): string {
  return FILES[lang]
}

export function getSizedFile(lang: Language, size: 'short' | 'medium' | 'long'): string {
  return SIZED_FILES[lang][size]
}
