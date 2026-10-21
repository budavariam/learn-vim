import { goFileShort, goFileMedium, goFileLong } from './go'
import { rustFileShort, rustFileMedium, rustFileLong } from './rust'
import { pythonFileShort, pythonFileMedium, pythonFileLong } from './python'
import { typescriptFileShort, typescriptFileMedium, typescriptFileLong } from './typescript'
import { cFileShort, cFileMedium, cFileLong } from './c'
import { cppFileShort, cppFileMedium, cppFileLong } from './cpp'
import { loremFileShort, loremFileMedium, loremFileLong } from './lorem'
import type { Language } from '../engine/types'

const FILES: Record<Language, string> = {
  go: goFileMedium,
  rust: rustFileMedium,
  python: pythonFileMedium,
  typescript: typescriptFileMedium,
  c: cFileMedium,
  cpp: cppFileMedium,
  lorem: loremFileMedium,
}

const SIZED_FILES: Record<Language, { short: string; medium: string; long: string }> = {
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
