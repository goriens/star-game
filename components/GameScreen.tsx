'use client'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { LevelConfig } from '@/types/game'

interface GameScreenProps {
  level: number
  timer: number
  onCompleteLevel: (results: Partial<{ correct: number; incorrect: number; missed: number }>) => void
  onNextLevel: () => void
}

// 🎮 Base configs for each level (title + description)
const LEVEL_CONFIGS: Record<number, any> = {
  1: {
    title: 'Level 1: Match the Stars!',
    description: 'Drag ⭐ to the star shapes!',
    shapes: [
      { type: 'star' },
      { type: 'circle' },
      { type: 'circle' },
      { type: 'star' },
    ],
  },
  2: {
    title: 'Level 2: Match the Stars!!',
    description: 'Drag ☀️ to the sun shapes. Be careful — moons are tricky!',
    shapes: [
      { type: 'sun' },
      { type: 'moon' },
      { type: 'sun' },
      { type: 'moon' },
    ],
  },
  3: {
    title: 'Level 3: Match the Stars!!',
    description: 'Find all the hidden stars among 12 shapes!',
    shapes: [],
  },
  4: {
    title: 'Level 4: Match the Stars!!',
    description: '8 shapes, 16 icons — spot the shining stars!',
    shapes: [],
  },
  5: {
    title: 'Level 5: Match the Stars!!',
    description: 'Now there are 16 icons and 6 hidden stars. Focus hard!',
    shapes: [],
  },
  6: {
    title: 'Level 6: Match the Stars!!',
    description: '20 icons · 16 shapes · 8 stars. Can you conquer the cosmos?',
    shapes: [],
  },
}

export default function GameScreen({ level, onCompleteLevel, onNextLevel }: GameScreenProps) {
  const [LevelComponent, setLevelComponent] = useState<React.ComponentType<any> | null>(null)

  useEffect(() => {
    // Dynamically import correct Level component (e.g., Level1, Level2...)
    import(`@/components/levels/Level${level}.tsx`)
      .then((mod) => setLevelComponent(() => mod.default))
      .catch((err) => console.error(`Could not load Level ${level}`, err))
  }, [level])

  const handleLevelComplete = (
    success: boolean,
    stats?: { correct: number; incorrect: number; missed: number }
  ) => {
    // ✅ Send results up to parent (page.tsx)
    if (stats) onCompleteLevel(stats)
    // ✅ Move to next level
    onNextLevel()
  }

  if (!LevelComponent) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <p className="text-lg text-gray-600">Loading Level {level}...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <LevelComponent
        config={LEVEL_CONFIGS[level]}
        onStickerPlace={() => {}}
        // 👇 Each level calls this when complete (with results)
        onLevelComplete={(success: boolean, stats: any) =>
          handleLevelComplete(success, stats)
        }
      />
    </div>
  )
}
