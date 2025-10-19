// app/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GameState } from '@/types/game'
import StartScreen from '@/components/StartScreen'
import ResultsScreen from '@/components/ResultsScreen'
import GameScreen from '@/components/GameScreen'

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({
    currentScreen: 'start',
    currentLevel: 1,
    timer: 180,
    isRunning: false,
    results: {
      correct: 0,
      incorrect: 0,
      missed: 0,
      reminders: 0
    }
  })

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      currentScreen: 'game',
      currentLevel: 1,
      timer: 180,
      results: { correct: 0, incorrect: 0, missed: 0, reminders: 0 }
    }))
  }

  const completeLevel = (results: Partial<GameState['results']>) => {
    setGameState(prev => ({
      ...prev,
      results: { ...prev.results, ...results }
    }))
  }

  const nextLevel = () => {
    if (gameState.currentLevel < 6) {
      setGameState(prev => ({
        ...prev,
        currentLevel: prev.currentLevel + 1,
        timer: 180
      }))
    } else {
      setGameState(prev => ({
        ...prev,
        currentScreen: 'results'
      }))
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <AnimatePresence mode="wait">
        {gameState.currentScreen === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <StartScreen onStartGame={startGame} />
          </motion.div>
        )}

        {gameState.currentScreen === 'game' && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GameScreen
              level={gameState.currentLevel}
              timer={gameState.timer}
              onCompleteLevel={completeLevel}
              onNextLevel={nextLevel}
            />
          </motion.div>
        )}

        {gameState.currentScreen === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ResultsScreen
              results={gameState.results}
              onPlayAgain={startGame}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}