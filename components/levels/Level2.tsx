'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Circle, Square, Heart, CheckCircle2, AlertCircle, Smile } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LevelConfig } from '@/types/game'
import { useEffect, useState } from 'react'

const Level2: React.FC<{
  config: LevelConfig
  onStickerPlace: (shapeIndex: number, sticker: string) => void
  onLevelComplete: (
    success: boolean,
    stats?: { correct: number; incorrect: number; missed: number }
  ) => void
}> = ({ config, onStickerPlace, onLevelComplete }) => {
  const [attempts, setAttempts] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [celebrations, setCelebrations] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(75)
  const MAX_ATTEMPTS = 6

  type ShapeType = 'star' | 'circle' | 'square' | 'heart'
  const [targetShape, setTargetShape] = useState<ShapeType>('star')
  const [shapes, setShapes] = useState<
    { type: ShapeType; hasSticker: boolean; disabled: boolean }[]
  >([])

  /* 🎲 Setup round */
  useEffect(() => {
    const shapeTypes: ShapeType[] = ['star', 'circle', 'square', 'heart']
    const chosen = shapeTypes[Math.floor(Math.random() * shapeTypes.length)]
    setTargetShape(chosen)

    const corrects = Array(2).fill({ type: chosen, hasSticker: false, disabled: false })
    const others = shapeTypes
      .filter((s) => s !== chosen)
      .flatMap((type) => Array(1).fill({ type, hasSticker: false, disabled: false }))
    const mix = [...corrects, ...others, ...others.slice(0, 1)] // total 6 shapes
    setShapes(mix.sort(() => Math.random() - 0.5))
  }, [])

  /* ⏱ Timer */
  useEffect(() => {
    if (gameOver || showPopup) return
    if (timeLeft <= 0) return setGameOver(true)
    const t = setInterval(() => setTimeLeft((v) => v - 1), 1000)
    return () => clearInterval(t)
  }, [timeLeft, gameOver, showPopup])

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  /* 🖱 Handle Click */
  const handleClick = (i: number) => {
    if (gameOver || showPopup) return
    const shape = shapes[i]
    if (shape.disabled) return

    const isCorrect = shape.type === targetShape
    const updated = [...shapes]

    if (isCorrect) {
      updated[i] = { ...shape, hasSticker: true, disabled: true }
      setShapes(updated)
      setCelebrations((p) => [...p, i])
      setTimeout(() => setCelebrations((p) => p.filter((x) => x !== i)), 2000)

      onStickerPlace(i, shapeIcon(shape.type))
      const allFound = updated.filter((s) => s.type === targetShape).every((s) => s.hasSticker)
      if (allFound) setTimeout(() => setShowPopup(true), 800)
    } else {
      const newA = attempts + 1
      setAttempts(newA)
      const el = document.getElementById(`shape-${i}`)
      if (el) {
        el.style.animation = 'gentleBounce 0.6s ease'
        setTimeout(() => (el.style.animation = ''), 600)
      }
      if (newA >= MAX_ATTEMPTS) setGameOver(true)
    }
  }

  const restart = () => window.location.reload()

  /* 🎉 SUCCESS POPUP */
  if (showPopup)
    return (
      <PlayBackground>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="text-center space-y-6 bg-white/95 p-8 rounded-3xl shadow-2xl border-8 border-green-300 mx-4"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto fill-green-400" />
          </motion.div>

          <h2 className="text-5xl font-extrabold text-green-600">Amazing! 🎉</h2>
          <p className="text-2xl text-gray-800 font-bold">
            You found all {shapeName(targetShape)}s!
          </p>
          <Confetti />

          <Button
            onClick={() =>
              onLevelComplete(true, {
                correct: shapes.filter((s) => s.type === targetShape && s.hasSticker).length,
                incorrect: attempts,
                missed: shapes.filter((s) => s.type === targetShape && !s.hasSticker).length,
              })
            }
            className="text-xl px-12 py-6 bg-gradient-to-r from-green-500 to-blue-500 hover:scale-105 transition-transform text-white rounded-2xl shadow-xl border-4 border-yellow-300 font-bold"
          >
            NEXT LEVEL 🚀
          </Button>
        </motion.div>
      </PlayBackground>
    )

  /* 💥 GAME OVER */
  if (gameOver)
    return (
      <PlayBackground gradient="from-red-100 via-pink-50 to-orange-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 bg-white/95 p-8 rounded-3xl shadow-2xl border-8 border-red-300 mx-4"
        >
          <AlertCircle className="w-24 h-24 text-red-500 mx-auto fill-red-200" />
          <h2 className="text-4xl font-extrabold text-red-600">Almost there! 💪</h2>
          <p className="text-2xl text-gray-800 font-bold">
            Try again and find all {shapeName(targetShape)}s!
          </p>
          <Button
            onClick={restart}
            className="text-xl px-12 py-6 bg-gradient-to-r from-green-500 to-purple-500 hover:scale-105 transition-transform text-white rounded-2xl shadow-xl border-4 border-yellow-300 font-bold"
          >
            PLAY AGAIN 🔄
          </Button>
        </motion.div>
      </PlayBackground>
    )

  /* 🧩 ACTIVE GAME */
  return (
    <PlayBackground gradient="from-lime-100 via-blue-50 to-pink-100">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-4 border-yellow-200 mx-4 mt-2"
      >
        <Smile className="w-12 h-12 text-pink-500 mx-auto animate-bounce" />
        <h2 className="text-3xl md:text-4xl font-extrabold text-purple-700 mb-2 animate-pulse">
          Find all the {shapeName(targetShape)}s {shapeIcon(targetShape)}
        </h2>
        <p className="text-lg text-gray-700 font-bold">
          Tap the matching shapes quickly! 🌟
        </p>
      </motion.div>

      {/* Timer & Attempts */}
      <div className="flex justify-center items-center gap-4 mb-8">
        <div className="bg-white/80 px-6 py-3 rounded-full shadow-md border-4 border-green-200 text-2xl font-bold text-green-600">
          ⏱ {formatTime(timeLeft)}
        </div>
        <div className="flex gap-2">
          {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
            <motion.div
              key={i}
              className={`w-6 h-6 rounded-full border-2 border-white shadow-md ${
                i < attempts ? 'bg-rose-400' : 'bg-green-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Shapes Grid */}
      <div className="grid grid-cols-3 gap-6 justify-items-center px-6 pb-6 max-w-2xl mx-auto">
        {shapes.map((shape, i) => (
          <motion.div
            key={i}
            id={`shape-${i}`}
            whileHover={{ scale: shape.disabled ? 1 : 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 60, delay: i * 0.15 }}
            onClick={() => handleClick(i)}
            className={`relative flex items-center justify-center w-32 h-32 rounded-3xl cursor-pointer shadow-xl transition-all ${
              shape.disabled
                ? 'bg-green-100 border-6 border-green-400'
                : 'bg-white hover:border-yellow-300 border-6 border-transparent'
            }`}
          >
            {getShapeIcon(shape.type)}
            {shape.hasSticker && (
              <motion.div
                className="absolute text-5xl text-green-500"
                initial={{ scale: 0 }}
                animate={{ scale: 1.1 }}
              >
                ✅
              </motion.div>
            )}
            {celebrations.includes(i) && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1.5 }}
              >
                <div className="text-4xl">🎉</div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Encouragement */}
      <AnimatePresence>
        {attempts > 0 && !showPopup && !gameOver && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`text-2xl font-bold px-6 py-3 rounded-xl border-4 shadow-md ${
              attempts >= 4
                ? 'bg-red-100 border-red-400 text-red-700'
                : 'bg-green-100 border-green-400 text-green-700'
            }`}
          >
            {attempts >= 4 ? 'Careful! 💫' : 'Good try! Keep going! 🌟'}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes gentleBounce {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(0.9); }
          50% { transform: scale(1.1); }
          75% { transform: scale(0.95); }
        }
      `}</style>
    </PlayBackground>
  )
}

/* 🖼 Shape renderer */
function getShapeIcon(shape: 'star' | 'circle' | 'square' | 'heart') {
  const size = 'w-16 h-16'
  switch (shape) {
    case 'star':
      return <Star className={`${size} text-yellow-400 fill-yellow-300`} />
    case 'circle':
      return <Circle className={`${size} text-blue-500 fill-blue-300 stroke-[3]`} />
    case 'square':
      return <Square className={`${size} text-purple-500 fill-purple-300`} />
    case 'heart':
      return <Heart className={`${size} text-rose-500 fill-rose-300`} />
  }
}

/* 🔤 Helpers */
function shapeName(shape: string) {
  return shape.charAt(0).toUpperCase() + shape.slice(1)
}
function shapeIcon(shape: string) {
  switch (shape) {
    case 'star': return '⭐'
    case 'circle': return '🔵'
    case 'square': return '🟪'
    case 'heart': return '❤️'
    default: return '🌟'
  }
}

/* 🎉 Confetti */
function Confetti() {
  const confetti = Array.from({ length: 15 })
  return (
    <div className="absolute inset-0 pointer-events-none">
      {confetti.map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-xl"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          initial={{ y: -100, opacity: 1 }}
          animate={{
            y: 1000,
            opacity: 0,
            rotate: 360,
            x: Math.random() * 200 - 100,
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            delay: Math.random() * 0.5,
          }}
        >
          {['🎉', '⭐', '🎈', '🌈', '✨'][Math.floor(Math.random() * 5)]}
        </motion.div>
      ))}
    </div>
  )
}

/* 🌈 Background */
function PlayBackground({
  children,
  gradient = 'from-pink-50 via-white to-blue-50',
}: {
  children: React.ReactNode
  gradient?: string
}) {
  const floaters = Array.from({ length: 8 })
  return (
    <div
      className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b ${gradient}`}
    >
      {floaters.map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl opacity-20"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{ y: [0, -60, 0], rotate: [0, 180, 360] }}
          transition={{
            duration: Math.random() * 8 + 8,
            repeat: Infinity,
            delay: Math.random() * 4,
          }}
        >
          {['⭐', '🔵', '🟪', '❤️'][i % 4]}
        </motion.div>
      ))}
      <div className="relative z-10 w-full max-w-3xl text-center">{children}</div>
    </div>
  )
}

export default Level2
