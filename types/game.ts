// types/game.ts
export interface GameState {
  currentScreen: 'start' | 'game' | 'results'
  currentLevel: number
  timer: number
  isRunning: boolean
  results: {
    correct: number
    incorrect: number
    missed: number
    reminders: number
  }
}

export interface Shape {
  type: string
  icon: string
  hasSticker: boolean
  sticker: string | null
  isCorrect: boolean
  disabled: boolean
}

export interface LevelConfig {
  level: number
  title: string
  description: string
  duration: number
  shapes: Shape[]
  targetShape: string
}