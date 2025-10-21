'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shapes, Puzzle, Clock, Trophy, Sparkles } from 'lucide-react'

const StartScreen: React.FC<{ onStartGame: () => void }> = ({ onStartGame }) => {
  const [windowSize, setWindowSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({ w: window.innerWidth, h: window.innerHeight })
    }
  }, [])

  const features = [
    {
      icon: <Shapes className="w-8 h-8 text-blue-500" />,
      title: 'Fun Shape Matching',
      description: 'Tap the correct shapes like stars, hearts, circles, and more!',
    },
    {
      icon: <Puzzle className="w-8 h-8 text-pink-500" />,
      title: '6 Colorful Levels',
      description: 'Each level brings new shapes and challenges to explore.',
    },
    {
      icon: <Clock className="w-8 h-8 text-green-500" />,
      title: 'Beat the Timer',
      description: 'Find all shapes before the time runs out!',
    },
    {
      icon: <Trophy className="w-8 h-8 text-yellow-500" />,
      title: 'Celebrate Wins',
      description: 'Earn stars and confetti when you complete levels! 🎉',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-blue-100 via-pink-50 to-yellow-100 overflow-hidden relative"
    >
      <div className="max-w-4xl w-full z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.2 }}
              className="text-8xl mb-6"
            >
              🎨
            </motion.div>

            <motion.h1
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent"
            >
              Match the Shapes
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto font-medium"
            >
              Get ready to tap, match, and smile! 🎯  
              Spot the correct shapes in each level and become a Shape Master!
            </motion.p>
          </motion.div>

          {/* Features */}
          <motion.div>
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-4 border-pink-200 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-center text-2xl font-bold text-purple-700">
                  What Makes It Fun ✨
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-start gap-4 p-4 hover:bg-purple-50 rounded-xl transition-all"
                    >
                      <div className="flex-shrink-0 mt-1">{feature.icon}</div>
                      <div>
                        <h3 className="font-semibold text-lg text-purple-800 mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Game Rules */}
          <motion.div>
            <Card className="bg-white/80 backdrop-blur-sm border-4 border-blue-200 rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Sparkles className="w-6 h-6" />
                  How to Play
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-base text-gray-700 font-medium">
                  {[
                    'Tap only the target shapes shown at the top.',
                    'Avoid wrong shapes — they count as a miss!',
                    'Each level gets a little trickier and faster.',
                    'Celebrate your success with confetti and stars!',
                  ].map((rule, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-3 h-3 bg-blue-400 rounded-full" />
                      <span>{rule}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Start Button */}
          <motion.div className="text-center pt-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                onClick={onStartGame}
                className="text-lg px-12 py-6 text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-xl rounded-2xl font-bold border-4 border-yellow-200"
              >
                <Shapes className="w-6 h-6 mr-2" />
                Start Playing!
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="text-sm text-gray-600 mt-4"
            >
              Perfect for children aged 4–6 to learn focus, memory, and matching skills 🧠
            </motion.p>
          </motion.div>

          {/* Floating Elements */}
          {windowSize.w > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="fixed inset-0 pointer-events-none z-0"
            >
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-3xl opacity-30"
                  initial={{
                    y: Math.random() * windowSize.h,
                    x: Math.random() * windowSize.w,
                  }}
                  animate={{
                    y: [null, -60, windowSize.h + 60],
                    rotate: 360,
                  }}
                  transition={{
                    duration: Math.random() * 10 + 8,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                  }}
                >
                  {['⭐', '💖', '🔵', '🟢', '🟪', '🌟', '❤️', '⚡'][Math.floor(Math.random() * 8)]}
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default StartScreen
