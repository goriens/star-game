'use client'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star,
  Triangle,
  Square,
  Hexagon,
  Heart,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LevelConfig } from '@/types/game'
import { useEffect, useState } from 'react'

// helper to shuffle array
const shuffleArray = <T,>(arr: T[]): T[] =>
  arr
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item)

const Level2: React.FC<{
  config: LevelConfig
  onStickerPlace: (shapeIndex: number, sticker: string) => void
  onLevelComplete: (success: boolean) => void
}> = ({ config, onStickerPlace, onLevelComplete }) => {
  const [attempts, setAttempts] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [timeLeft, setTimeLeft] = useState(180)
  const MAX_ATTEMPTS = 6

  // base shape set before randomization
  const baseShapes = [
    { type: 'star', hasSticker: false, sticker: '', disabled: false },
    { type: 'triangle', hasSticker: false, sticker: '', disabled: false },
    { type: 'square', hasSticker: false, sticker: '', disabled: false },
    { type: 'hexagon', hasSticker: false, sticker: '', disabled: false },
    { type: 'star', hasSticker: false, sticker: '', disabled: false },
    { type: 'heart', hasSticker: false, sticker: '', disabled: false },
    { type: 'triangle', hasSticker: false, sticker: '', disabled: false },
    { type: 'square', hasSticker: false, sticker: '', disabled: false },
  ]

  const [shapes, setShapes] = useState(() => shuffleArray(baseShapes))

  // randomize again each time user restarts or revisits level
  const restartLevel = () => {
    setAttempts(0)
    setGameOver(false)
    setShowPopup(false)
    setTimeLeft(180)
    setShapes(shuffleArray(baseShapes))
  }

  // countdown timer
  useEffect(() => {
    if (gameOver || showPopup) return
    if (timeLeft <= 0) {
      setGameOver(true)
      return
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft, gameOver, showPopup])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const handleStickerPlace = (index: number, sticker: string) => {
    if (gameOver || showPopup) return
    const shape = shapes[index]
    const isCorrect = shape.type === 'star' && sticker === '⭐'

    if (isCorrect) {
      const updated = [...shapes]
      updated[index] = { ...shape, hasSticker: true, sticker, disabled: true }
      setShapes(updated)
      onStickerPlace(index, sticker)
      const allDone = updated
        .filter((s) => s.type === 'star')
        .every((s) => s.hasSticker)
      if (allDone) setTimeout(() => setShowPopup(true), 600)
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      const el = document.getElementById(`shape-${index}`)
      if (el) {
        el.style.animation = 'shake 0.4s ease'
        setTimeout(() => (el.style.animation = ''), 400)
      }
      if (newAttempts >= MAX_ATTEMPTS) setGameOver(true)
    }
  }

  // ---------- Popups ----------
  if (showPopup)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-green-50 via-white to-blue-50 text-center">
        <AnimatePresence>
          <motion.div
            key="popup"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
            <h2 className="text-4xl font-bold text-green-600 drop-shadow-sm">
              🎉 Level Complete!
            </h2>
            <p className="text-lg text-gray-700">Awesome! You matched all stars!</p>
            <Button
              onClick={() => onLevelComplete(true)}
              className="text-lg px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-md"
            >
              Go to Level 3 ➡️
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>
    )

  if (gameOver)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50 text-center">
        <AlertCircle className="w-20 h-20 text-red-500 mx-auto" />
        <h2 className="text-3xl font-bold text-red-600 drop-shadow-sm">
          Oops! Try Again!
        </h2>
        <p className="text-lg text-gray-700">
          You ran out of time or attempts. Try again!
        </p>
        <Button
          onClick={restartLevel}
          className="mt-4 text-lg px-10 py-4 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-md"
        >
          Restart 🔄
        </Button>
      </div>
    )

  // ---------- Active Game ----------
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 text-center overflow-hidden p-4">
      <FloatingStars />

      {/* Attempts */}
      <div className="flex justify-center gap-2 mb-2">
        {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full ${
              i < attempts ? 'bg-red-400' : 'bg-green-400'
            }`}
          />
        ))}
      </div>

      {/* Timer */}
      <p className="text-sm text-gray-700 mb-4">
        ⏳ Time left:{' '}
        <span className="font-semibold text-indigo-700">{formatTime(timeLeft)}</span>
      </p>

      {/* Title */}
      <h2 className="text-3xl font-bold text-indigo-700 mb-2">{config.title}</h2>
      <p className="text-gray-600 text-lg mb-4">{config.description}</p>

      {/* Sticker */}
      <motion.div
        className="flex justify-center gap-8 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="cursor-grab text-7xl"
          draggable
          onDragStart={(e:any) => e.dataTransfer.setData('sticker', '⭐')}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          ⭐
        </motion.div>
      </motion.div>

      {/* 2×4 Grid */}
      <div className="grid grid-cols-4 gap-10 justify-items-center px-4 pb-10">
        {shapes.map((shape, i) => (
          <motion.div
            key={i}
            id={`shape-${i}`}
            className="relative flex items-center justify-center w-32 h-32 rounded-full bg-white shadow-md hover:shadow-lg"
            onDrop={(e) => {
              e.preventDefault()
              const sticker = e.dataTransfer.getData('sticker')
              handleStickerPlace(i, sticker)
            }}
            onDragOver={(e) => e.preventDefault()}
            whileHover={{ scale: shape.disabled ? 1 : 1.1 }}
          >
            {shape.type === 'star' && (
              <Star className="w-20 h-20 text-yellow-400 fill-yellow-300" />
            )}
            {shape.type === 'triangle' && (
              <Triangle className="w-20 h-20 text-purple-400" />
            )}
            {shape.type === 'square' && (
              <Square className="w-20 h-20 text-blue-400" />
            )}
            {shape.type === 'hexagon' && (
              <Hexagon className="w-20 h-20 text-rose-400" />
            )}
            {shape.type === 'heart' && (
              <Heart className="w-20 h-20 text-pink-400 fill-pink-300" />
            )}
            {shape.hasSticker && (
              <motion.div
                className="absolute text-5xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                ⭐
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Feedback */}
      {attempts > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-lg font-semibold ${
            attempts >= 4 ? 'text-orange-600' : 'text-green-600'
          }`}
        >
          {attempts >= 4
            ? 'Careful! Only a few tries left! 💫'
            : "You're doing great! Keep going! 🌟"}
        </motion.p>
      )}

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  )
}

function FloatingStars() {
  const stars = Array.from({ length: 15 })
  return (
    <div className="absolute inset-0 pointer-events-none">
      {stars.map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-yellow-300 opacity-40"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 1.5 + 1.2}rem`,
          }}
          animate={{ y: [0, -25, 0], opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          ⭐
        </motion.div>
      ))}
    </div>
  )
}

export default Level2
