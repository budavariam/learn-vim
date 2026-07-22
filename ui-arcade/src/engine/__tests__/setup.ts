// setup.ts — runs before every test file via vitest setupFiles
// Mocks data.json so tests never depend on the generated file.
import { vi } from 'vitest'

vi.mock('../../data.json', () => ({
  default: [
    { id: 'c1', category: 'Motion',  question: 'move left',          solution: ['h'],  level: 0 },
    { id: 'c2', category: 'Motion',  question: 'move down',          solution: ['j'],  level: 0 },
    { id: 'c3', category: 'Motion',  question: 'move up',            solution: ['k'],  level: 0 },
    { id: 'c4', category: 'Motion',  question: 'go to last line',    solution: ['G'],  level: 1 },
    { id: 'c5', category: 'Edit',    question: 'undo',               solution: ['u'],  level: 0 },
    { id: 'c6', category: 'Edit',    question: 'delete line',        solution: ['dd'], level: 1 },
    { id: 'c7', category: 'Edit',    question: 'yank line',          solution: ['yy'], level: 1 },
    { id: 'c8', category: 'Edit',    question: 'paste after',        solution: ['p'],  level: 0 },
    { id: 'c9', category: 'Motion',  question: 'word forward',       solution: ['w'],  level: 0 },
    { id: 'c10', category: 'Motion', question: 'end of line',        solution: ['$'],  level: 0 },
  ],
}))
