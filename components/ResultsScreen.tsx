'use client'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Trophy, Star, X, Clock, Download, Smile } from 'lucide-react'

const ResultsScreen: React.FC<{
  results: { correct: number; incorrect: number; missed: number; reminders: number }
  onPlayAgain: () => void
}> = ({ results, onPlayAgain }) => {
  const totalShapes = results.correct + results.missed
  const accuracy = totalShapes > 0 ? (results.correct / totalShapes) * 100 : 0
  const score = results.correct * 10 - results.incorrect * 5

  const getPerformance = () => {
    if (accuracy >= 90) return { label: 'Shape Master!', color: 'text-green-600', emoji: '🏆' }
    if (accuracy >= 70) return { label: 'Super Star!', color: 'text-blue-600', emoji: '⭐' }
    if (accuracy >= 50) return { label: 'Great Try!', color: 'text-yellow-600', emoji: '💪' }
    return { label: 'Keep Practicing!', color: 'text-orange-600', emoji: '🌈' }
  }
  const performance = getPerformance()

  const exportResults = () => {
    const data = {
      correct: results.correct,
      incorrect: results.incorrect,
      missed: results.missed,
      accuracy: Math.round(accuracy),
      score,
      performance: performance.label,
      time: new Date().toLocaleString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `match-the-shapes-results-${Date.now()}.json`
    link.click()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-yellow-100 via-pink-50 to-blue-100 overflow-hidden relative"
    >
      <div className="max-w-4xl w-full space-y-8 text-center relative z-10">
        {/* 🎉 Header */}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          <div className="text-8xl mb-2">{performance.emoji}</div>
          <h1 className="text-5xl font-extrabold text-purple-700 mb-2 drop-shadow-sm">
            You Did It!
          </h1>
          <p className={`text-3xl font-bold ${performance.color}`}>{performance.label}</p>
        </motion.div>

        {/* 🧠 Stats Card */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-4 border-pink-200 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex justify-center items-center gap-2 text-2xl text-purple-700">
                <Trophy className="w-7 h-7 text-yellow-500" />
                Your Scoreboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                  <Star className="w-8 h-8 text-green-500 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-green-600">{results.correct}</div>
                  <div className="text-sm text-green-700">Correct</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <X className="w-8 h-8 text-red-500 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-red-600">{results.incorrect}</div>
                  <div className="text-sm text-red-700">Incorrect</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                  <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-yellow-600">{results.missed}</div>
                  <div className="text-sm text-yellow-700">Missed</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                  <Trophy className="w-8 h-8 text-blue-500 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-blue-600">{score}</div>
                  <div className="text-sm text-blue-700">Total Score</div>
                </div>
              </div>

              <div className="space-y-2">
                <Progress value={accuracy} className="h-4 rounded-full" />
                <p className="text-sm text-gray-700 font-semibold">
                  Accuracy: {Math.round(accuracy)}%
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 💬 Feedback */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-4 border-blue-200 bg-white/80 backdrop-blur-sm rounded-3xl shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 text-2xl text-blue-700">
                <Smile className="w-7 h-7 text-blue-500" />
                What This Means
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-lg text-gray-700 font-medium">
              {accuracy >= 90 && (
                <p>
                  🌟 Wow! You’re a **Shape Genius** — every tap was almost perfect. Keep shining!
                </p>
              )}
              {accuracy >= 70 && accuracy < 90 && (
                <p>
                  🎉 Great job! You know your shapes really well. A little more focus and you’ll be
                  unbeatable!
                </p>
              )}
              {accuracy >= 50 && accuracy < 70 && (
                <p>
                  💡 Good effort! You’re learning fast — next time, try to spot those tricky shapes
                  quicker.
                </p>
              )}
              {accuracy < 50 && (
                <p>
                  💪 Keep going! You’re improving with every try. Watch carefully and tap the right
                  shapes next time!
                </p>
              )}

              {results.missed > 0 && (
                <p className="text-purple-600">
                  ⏰ Try not to let the timer run out — you’ve got this!
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* 🎮 Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            size="lg"
            onClick={onPlayAgain}
            className="text-lg px-10 py-5 rounded-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 text-white border-4 border-yellow-200"
          >
            🎮 Play Again
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={exportResults}
            className="text-lg px-10 py-5 rounded-2xl font-bold border-4 border-blue-300 hover:bg-blue-50"
          >
            <Download className="w-5 h-5 mr-2" />
            Download My Report 🎁
          </Button>
        </div>

        {/* ✨ Confetti */}
        {accuracy >= 70 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="fixed inset-0 pointer-events-none z-0"
          >
            {[...Array(35)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-3xl opacity-40"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -50,
                  rotate: 0,
                }}
                animate={{
                  y: window.innerHeight + 100,
                  rotate: 360,
                }}
                transition={{
                  duration: Math.random() * 4 + 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              >
                {['🎉', '⭐', '🌟', '💖', '🎊'][Math.floor(Math.random() * 5)]}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default ResultsScreen
