'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Circle, CheckCircle2, AlertCircle, Smile } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LevelConfig } from '@/types/game'
import { useEffect, useState } from 'react'

const Level1: React.FC<{
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
  const [timeLeft, setTimeLeft] = useState(90)
  const [celebrations, setCelebrations] = useState<number[]>([])
  const MAX_ATTEMPTS = 6

  const [targetShape, setTargetShape] = useState<'star' | 'circle'>('star')
  const [shapes, setShapes] = useState<
    { type: 'star' | 'circle'; hasSticker: boolean; disabled: boolean }[]
  >([])

  // 🎯 Setup round
  useEffect(() => {
    const chosen = Math.random() > 0.5 ? 'star' : 'circle'
    setTargetShape(chosen)

    const corrects = Array(2).fill({ type: chosen, hasSticker: false, disabled: false })
    const distractors = Array(2).fill({
      type: chosen === 'star' ? 'circle' : 'star',
      hasSticker: false,
      disabled: false,
    })
    setShapes([...corrects, ...distractors].sort(() => Math.random() - 0.5))
  }, [])

  // ⏱ timer
  useEffect(() => {
    if (gameOver || showPopup) return
    if (timeLeft <= 0) return setGameOver(true)
    const t = setInterval(() => setTimeLeft((v) => v - 1), 1000)
    return () => clearInterval(t)
  }, [timeLeft, gameOver, showPopup])

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  // 🖱 handle shape click
  const handleClick = (i: number) => {
    if (gameOver || showPopup) return
    const shape = shapes[i]
    if (shape.disabled) return
    const isCorrect = shape.type === targetShape
    const updated = [...shapes]

    if (isCorrect) {
      updated[i] = { ...shape, hasSticker: true, disabled: true }
      setShapes(updated)
      setCelebrations(prev => [...prev, i])
      setTimeout(() => setCelebrations(prev => prev.filter(x => x !== i)), 2000)
      
      onStickerPlace(i, targetShape === 'star' ? '⭐' : '🔵')

      const allFound = updated
        .filter((s) => s.type === targetShape)
        .every((s) => s.hasSticker)
      if (allFound) setTimeout(() => setShowPopup(true), 1000)
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

  /* ================= SUCCESS POPUP ================= */
  if (showPopup)
    return (
      <PlayBackground>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-center space-y-6 bg-white/95 p-8 rounded-3xl shadow-2xl border-8 border-yellow-300 mx-4"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto fill-green-400" />
          </motion.div>
          
          <motion.h2 
            className="text-4xl font-extrabold text-green-600"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            YAY! 🎉
          </motion.h2>
          
          <motion.p 
            className="text-2xl text-gray-800 font-bold"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            All {targetShape === 'star' ? 'Stars ⭐' : 'Circles 🔵'} found!
          </motion.p>
          
          <Confetti />
          
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              onClick={() =>
                onLevelComplete(true, {
                  correct: shapes.filter((s) => s.type === targetShape && s.hasSticker).length,
                  incorrect: attempts,
                  missed: shapes.filter((s) => s.type === targetShape && !s.hasSticker).length,
                })
              }
              className="text-xl px-12 py-6 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 border-4 border-yellow-300 font-bold"
            >
              NEXT LEVEL 🚀
            </Button>
          </motion.div>
        </motion.div>
      </PlayBackground>
    )

  /* ================= GAME OVER ================= */
  if (gameOver)
    return (
      <PlayBackground gradient="from-red-100 via-pink-50 to-orange-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 bg-white/95 p-8 rounded-3xl shadow-2xl border-8 border-red-300  mx-4"
        >
          <motion.div
            transition={{ duration: 0.5 }}
          >
            <AlertCircle className="w-24 h-24 text-red-500 mx-auto fill-red-200" />
          </motion.div>
          
          <h2 className="text-3xl font-extrabold text-red-600">
            Let's Try Again! 🤗
          </h2>
          <p className="text-xl text-gray-800 font-bold">
            Find all the {targetShape === 'star' ? 'Stars' : 'Circles'}!
          </p>
          
          <Button
            onClick={restart}
            className="text-xl px-12 py-6 bg-gradient-to-r from-green-500 to-purple-500 hover:from-green-600 hover:to-purple-600 text-white rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 border-4 border-yellow-300 font-bold"
          >
            PLAY AGAIN 🔄
          </Button>
        </motion.div>
      </PlayBackground>
    )

  /* ================= ACTIVE GAME ================= */
  return (
    <PlayBackground gradient="from-blue-100 via-purple-50 to-pink-100">
      {/* Header Section - Compact */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center mb-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-4 border-pink-200 mx-4 mt-2"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-2"
        >
          <Smile className="w-12 h-12 text-yellow-500 fill-yellow-300 mx-auto" />
        </motion.div>
        
        <h2 className="text-2xl md:text-3xl font-extrabold text-purple-600 mb-2">
          Find the{' '}
          {targetShape === 'star' ? (
            <span className="text-yellow-500 animate-pulse">STARS ⭐</span>
          ) : (
            <span className="text-blue-500 animate-pulse">CIRCLES 🔵</span>
          )}
        </h2>
        
        <p className="text-lg text-gray-700 font-bold">
          Tap the {targetShape === 'star' ? 'yellow stars' : 'blue circles'}! 🌈
        </p>
      </motion.div>

      {/* Progress Indicators - Compact */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border-4 border-green-200 mx-4">
        {/* Timer */}
        <motion.div 
          className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl px-4 py-2 shadow-md"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-2xl">⏱️</div>
          <div className="text-xl font-bold text-white">
            {formatTime(timeLeft)}
          </div>
        </motion.div>

        {/* Attempts */}
        <div className="flex items-center gap-3">
          <div className="text-lg font-bold text-gray-700">Tries:</div>
          <div className="flex gap-2">
            {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
              <motion.div
                key={i}
                className={`w-6 h-6 rounded-full border-2 border-white shadow-md ${
                  i < attempts ? 'bg-red-400' : 'bg-green-400'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Shapes Grid - Better Spacing */}
      <div className="grid grid-cols-2 gap-6 justify-items-center px-4 pb-6 max-w-2xl mx-auto">
        {shapes.map((shape, i) => (
          <motion.div
            key={i}
            id={`shape-${i}`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 50, delay: i * 0.2 }}
            whileHover={{ scale: shape.disabled ? 1 : 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`relative flex items-center justify-center w-36 h-36 rounded-3xl shadow-xl cursor-pointer transition-all duration-300 ${
              shape.disabled 
                ? 'bg-green-100 border-6 border-green-400' 
                : 'bg-white border-6 border-transparent hover:border-yellow-300'
            }`}
            onClick={() => handleClick(i)}
          >
            {/* Shape */}
            {shape.type === 'star' ? (
              <motion.div
                animate={{ 
                  rotate: shape.disabled ? 0 : [0, 5, -5, 0],
                  scale: shape.disabled ? 1 : [1, 1.05, 1]
                }}
                transition={{ duration: 2, repeat: shape.disabled ? 0 : Infinity }}
              >
                <Star className="w-20 h-20 text-yellow-400 fill-yellow-300" />
              </motion.div>
            ) : (
              <motion.div
                animate={{ 
                  scale: shape.disabled ? 1 : [1, 1.03, 1]
                }}
                transition={{ duration: 1.5, repeat: shape.disabled ? 0 : Infinity }}
              >
                <Circle className="w-20 h-20 text-blue-500 fill-blue-300 stroke-[3]" />
              </motion.div>
            )}

            {/* Success Checkmark */}
            {shape.hasSticker && (
              <motion.div
                className="absolute text-6xl text-green-500 drop-shadow-lg"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1.1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                ✅
              </motion.div>
            )}

            {/* Celebration Effect */}
            {celebrations.includes(i) && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 2 }}
              >
                <div className="text-4xl">🎉</div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Encouragement Messages */}
      <AnimatePresence>
        {attempts > 0 && !showPopup && !gameOver && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className={`text-xl font-bold p-4 rounded-xl border-4 ${
              attempts >= 4 
                ? 'bg-red-100 border-red-400 text-red-700' 
                : 'bg-orange-100 border-orange-400 text-orange-700'
            } shadow-lg mx-4 mb-4`}
          >
            {attempts >= 4 ? (
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                Few left attempts! 🌟
              </motion.div>
            ) : (
              "Ops Wrong Shape! 👏"
            )}
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

/* 🎉 Confetti Component */
function Confetti() {
  const confetti = Array.from({ length: 15 })
  return (
    <div className="absolute inset-0 pointer-events-none">
      {confetti.map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{ y: -100, opacity: 1, rotate: 0 }}
          animate={{ 
            y: 1000, 
            opacity: 0, 
            rotate: 360,
            x: Math.random() * 200 - 100
          }}
          transition={{ 
            duration: Math.random() * 2 + 1,
            delay: Math.random() * 0.5
          }}
        >
          {['🎉', '⭐', '🎈', '🌈', '✨'][Math.floor(Math.random() * 5)]}
        </motion.div>
      ))}
    </div>
  )
}

/* 🩵 Soft animated background */
function PlayBackground({
  children,
  gradient = 'from-blue-50 via-white to-pink-50',
}: {
  children: React.ReactNode
  gradient?: string
}) {
  const floatingElements = Array.from({ length: 8 })
  
  return (
    <div
      className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b ${gradient}`}
    >
      {/* Floating Background Elements */}
      {floatingElements.map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{ 
            y: [0, -80, 0],
            x: [0, Math.random() * 40 - 20, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: Math.random() * 8 + 8,
            repeat: Infinity,
            delay: Math.random() * 4,
          }}
        >
          <div className="text-2xl opacity-20">
            {['⭐', '🔵', '🌈', '💫'][i % 4]}
          </div>
        </motion.div>
      ))}
      
      {/* Soft Bubbles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={`bubble-${i}`}
          className="absolute rounded-full bg-white/30 blur-xl"
          style={{
            width: `${Math.random() * 150 + 80}px`,
            height: `${Math.random() * 150 + 80}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{ 
            y: [0, -60, 0], 
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: Math.random() * 6 + 5,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
      
      <div className="relative z-10 w-full max-w-2xl text-center">
        {children}
      </div>
    </div>
  )
}

export default Level1