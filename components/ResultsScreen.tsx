// components/game/ResultsScreen.tsx
'use client'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Trophy, Star, X, Clock, Download } from 'lucide-react'

const ResultsScreen: React.FC<{
  results: {
    correct: number
    incorrect: number
    missed: number
    reminders: number
  }
  onPlayAgain: () => void
}> = ({ results, onPlayAgain }) => {
  const totalStars = results.correct + results.missed
  const accuracy = totalStars > 0 ? (results.correct / totalStars) * 100 : 0
  const score = results.correct * 10 - results.incorrect * 5

  const getPerformanceLevel = () => {
    if (accuracy >= 90) return { level: 'Excellent', color: 'text-green-500', icon: '🏆' }
    if (accuracy >= 70) return { level: 'Good', color: 'text-blue-500', icon: '⭐' }
    if (accuracy >= 50) return { level: 'Fair', color: 'text-yellow-500', icon: '👍' }
    return { level: 'Needs Practice', color: 'text-orange-500', icon: '💪' }
  }

  const performance = getPerformanceLevel()

  const exportResults = () => {
    const data = {
      correct: results.correct,
      incorrect: results.incorrect,
      missed: results.missed,
      accuracy: Math.round(accuracy),
      score: score,
      performance: performance.level,
      timestamp: new Date().toLocaleString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `sticker-game-results-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-4 flex items-center justify-center"
    >
      <div className="max-w-4xl w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Header */}
          <motion.div  className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="text-8xl mb-4"
            >
              {performance.icon}
            </motion.div>
            <h1 className="text-4xl font-bold text-primary mb-2">
              Game Complete!
            </h1>
            <p className={`text-2xl font-semibold ${performance.color} mb-4`}>
              {performance.level} Performance
            </p>
          </motion.div>

          {/* Performance Overview */}
          <motion.div >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Score */}
                  <div className="text-center p-4 bg-secondary/20 rounded-lg">
                    <div className="text-3xl font-bold text-primary">{score}</div>
                    <div className="text-sm text-muted-foreground">Total Score</div>
                  </div>

                  {/* Accuracy */}
                  <div className="text-center p-4 bg-secondary/20 rounded-lg">
                    <div className="text-3xl font-bold text-primary">{Math.round(accuracy)}%</div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                  </div>
                </div>

                <Progress value={accuracy} className="h-3" />
              </CardContent>
            </Card>
          </motion.div>

          {/* Detailed Results */}
          <motion.div>
            <Card>
              <CardHeader>
                <CardTitle>Detailed Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Correct */}
                  <motion.div
                    className="text-center p-4 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex justify-center mb-2">
                      <Star className="w-8 h-8 text-green-500 fill-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">{results.correct}</div>
                    <div className="text-sm text-green-700">Correct</div>
                  </motion.div>

                  {/* Incorrect */}
                  <motion.div
                    className="text-center p-4 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div className="flex justify-center mb-2">
                      <X className="w-8 h-8 text-red-500" />
                    </div>
                    <div className="text-2xl font-bold text-red-600">{results.incorrect}</div>
                    <div className="text-sm text-red-700">Incorrect</div>
                  </motion.div>

                  {/* Missed */}
                  <motion.div
                    className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                  >
                    <div className="flex justify-center mb-2">
                      <Clock className="w-8 h-8 text-yellow-500" />
                    </div>
                    <div className="text-2xl font-bold text-yellow-600">{results.missed}</div>
                    <div className="text-sm text-yellow-700">Missed</div>
                  </motion.div>

                  {/* Total */}
                  <motion.div
                    className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    <div className="flex justify-center mb-2">
                      <Trophy className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{totalStars}</div>
                    <div className="text-sm text-blue-700">Total Stars</div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Feedback */}
          <motion.div >
            <Card>
              <CardHeader>
                <CardTitle>Performance Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accuracy >= 90 && (
                    <div className="text-green-600 bg-green-50 p-4 rounded-lg border border-green-200">
                      <strong>Outstanding! </strong>
                      You demonstrated excellent attention to detail and followed instructions perfectly!
                    </div>
                  )}
                  
                  {accuracy >= 70 && accuracy < 90 && (
                    <div className="text-blue-600 bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <strong>Great job! </strong>
                      You showed good focus and understanding of the task. Keep up the good work!
                    </div>
                  )}
                  
                  {accuracy >= 50 && accuracy < 70 && (
                    <div className="text-yellow-600 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <strong>Good effort! </strong>
                      You're getting the hang of it! With a bit more practice, you'll be excellent.
                    </div>
                  )}
                  
                  {accuracy < 50 && (
                    <div className="text-orange-600 bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <strong>Keep practicing! </strong>
                      Remember to focus on placing stickers only on the target shapes. You can do it!
                    </div>
                  )}

                  {results.incorrect > 0 && (
                    <div className="text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
                      <strong>Tip: </strong>
                      Try to be more careful about which shapes you place stickers on. Focus on the target shapes only.
                    </div>
                  )}

                  {results.missed > 0 && (
                    <div className="text-purple-600 bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <strong>Tip: </strong>
                      Make sure to find all the target shapes before time runs out!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
          >
            <Button
              size="lg"
              onClick={onPlayAgain}
              className="text-lg px-8 py-3"
            >
              🎮 Play Again
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={exportResults}
              className="text-lg px-8 py-3"
            >
              <Download className="w-5 h-5 mr-2" />
              Export Results
            </Button>
          </motion.div>

          {/* Celebration Confetti Effect */}
          {accuracy >= 80 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="fixed inset-0 pointer-events-none z-50"
            >
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
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
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                  style={{
                    left: `${Math.random() * 100}%`,
                  }}
                >
                  {['🎉', '🎊', '⭐', '🌟', '🏆'][Math.floor(Math.random() * 5)]}
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default ResultsScreen