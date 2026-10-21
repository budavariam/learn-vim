import { Zap, BookOpen, Database, Layers, Brain, Repeat, Grid3x3 } from 'lucide-react'
import quizData from '@data'

export interface QuizQuestion {
  id?: string
  category: string
  question: string
  solution: string[]
  level: number
}

export interface QuizResult {
  question: QuizQuestion
  userAnswer: string
  isCorrect: boolean
  wasKnownBefore: boolean
}

export type GameMode =
  | 'flash'
  | 'regular'
  | 'all'
  | 'flashcard'
  | 'flashcard-unknown'
  | 'flashcard-repeat'
  | 'mc-easy'
  | 'mc-medium'
  | 'mc-hard'

export interface GameModeConfig {
  name: string
  description: string
  questionCount: number
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  category?: 'quiz' | 'practice' | 'test'
}

export const gameModes: Record<GameMode, GameModeConfig> = {
  flash: {
    name: 'Flash Mode',
    description: 'Quick 10-question challenge',
    questionCount: 10,
    icon: Zap,
    color: 'color-yellow',
    bgColor: 'from-yellow-500 to-orange-500',
    category: 'quiz',
  },
  regular: {
    name: 'Regular Mode',
    description: 'Standard 50-question practice',
    questionCount: 50,
    icon: BookOpen,
    color: 'color-blue',
    bgColor: 'from-blue-500 to-purple-500',
    category: 'quiz',
  },
  all: {
    name: 'Master Mode',
    description: `All ${quizData.length} questions`,
    questionCount: quizData.length,
    icon: Database,
    color: 'color-green',
    bgColor: 'from-green-500 to-teal-500',
    category: 'quiz',
  },
  flashcard: {
    name: 'Flashcard - All',
    description: 'Study all commands',
    questionCount: 50,
    icon: Layers,
    color: 'color-purple',
    bgColor: 'from-purple-500 to-pink-500',
    category: 'practice',
  },
  'flashcard-unknown': {
    name: 'Flashcard - Unknown',
    description: 'Practice only unknown commands',
    questionCount: 9999,
    icon: Brain,
    color: 'color-orange',
    bgColor: 'from-orange-500 to-red-500',
    category: 'practice',
  },
  'flashcard-repeat': {
    name: 'Flashcard - Review',
    description: 'Review all known commands',
    questionCount: 9999,
    icon: Repeat,
    color: 'color-teal',
    bgColor: 'from-teal-500 to-cyan-500',
    category: 'practice',
  },
  'mc-easy': {
    name: 'MC Easy',
    description: 'Multiple choice - random options',
    questionCount: 50,
    icon: Grid3x3,
    color: 'color-green',
    bgColor: 'from-green-400 to-emerald-500',
    category: 'test',
  },
  'mc-medium': {
    name: 'MC Medium',
    description: 'Multiple choice - mixed difficulty',
    questionCount: 30,
    icon: Grid3x3,
    color: 'color-yellow',
    bgColor: 'from-yellow-400 to-orange-500',
    category: 'test',
  },
  'mc-hard': {
    name: 'MC Hard',
    description: 'Multiple choice - similar answers',
    questionCount: 10,
    icon: Grid3x3,
    color: 'color-red',
    bgColor: 'from-red-500 to-rose-600',
    category: 'test',
  },
}

export const getKnownItems = (): Set<string> => {
  try {
    const saved = JSON.parse(localStorage.getItem('knownItems') || '[]')
    return new Set(saved)
  } catch (error) {
    console.error('Error reading knownItems from localStorage:', error)
    return new Set()
  }
}

export const calculateImpacts = (results: QuizResult[]) => {
  const knownItems = getKnownItems()
  const correctAnswers = results.filter(r => r.isCorrect)
  const incorrectAnswers = results.filter(r => !r.isCorrect)

  const correctToAdd = correctAnswers.filter(
    result => result.question.id && !knownItems.has(result.question.id)
  ).length

  const incorrectToRemove = incorrectAnswers.filter(
    result => result.question.id && knownItems.has(result.question.id)
  ).length

  return { correctToAdd, incorrectToRemove }
}
