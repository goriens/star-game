'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Star, Target, Clock, Trophy } from 'lucide-react'

const StartScreen: React.FC<{ onStartGame: () => void }> = ({ onStartGame }) => {
  const [windowSize, setWindowSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 })

  // safely access window only on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({ w: window.innerWidth, h: window.innerHeight })
    }
  }, [])

  const features = [
    {
      icon: <Target className="w-8 h-8 text-blue-500" />,
      title: '6 Progressive Levels',
      description: 'Start simple and work your way up to master challenges',
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-500" />,
      title: 'Focus on Stars',
      description: 'Place stickers ONLY on the target shapes',
    },
    {
      icon: <Clock className="w-8 h-8 text-green-500" />,
      title: 'Timed Challenges',
      description: 'Complete each level before time runs out',
    },
    {
      icon: <Trophy className="w-8 h-8 text-purple-500" />,
      title: 'Track Progress',
      description: 'Get detailed feedback on your performance',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
          {/* Header */}
          <motion.div  className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.2 }}
              className="text-8xl mb-6"
            >
              🎮
            </motion.div>

            <motion.h1
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl font-bold text-primary mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
            >
              Sticker Star Adventure
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Embark on an exciting journey to test your focus skills! Place stickers ONLY on the
              stars across 6 challenging levels.
            </motion.p>
          </motion.div>

          {/* Features */}
          <motion.div >
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-2xl">What to Expect</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-start gap-4 p-4 hover:bg-secondary/20 rounded-lg transition-colors"
                    >
                      <div className="flex-shrink-0 mt-1">{feature.icon}</div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Game Rules */}
          <motion.div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-6 h-6" />
                  Game Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  {[
                    'Drag and drop stickers ONLY on the target shapes (stars)',
                    'Complete each level before the timer runs out',
                    'Progress through 6 levels with increasing difficulty',
                    'Get performance feedback and tips for improvement',
                  ].map((rule, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span>{rule}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Start Button */}
          <motion.div  className="text-center pt-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                onClick={onStartGame}
                className="text-lg px-12 py-6 text-white bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg"
              >
                <Star className="w-6 h-6 mr-2" />
                Start Your Adventure!
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="text-sm text-muted-foreground mt-4"
            >
              Perfect for testing attention and focus in children aged 4–6 years
            </motion.p>
          </motion.div>

          {/* Floating Elements */}
          {windowSize.w > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="fixed inset-0 pointer-events-none z-50"
            >
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  initial={{
                    y: Math.random() * windowSize.h,
                    x: Math.random() * windowSize.w,
                  }}
                  animate={{
                    y: [null, -50, windowSize.h + 50],
                    rotate: 360,
                  }}
                  transition={{
                    duration: Math.random() * 10 + 10,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                  }}
                >
                  {['⭐', '🌟', '🎯', '✨'][Math.floor(Math.random() * 4)]}
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
