// lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

// Format time in minutes:seconds
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Calculate performance level based on accuracy
export function getPerformanceLevel(accuracy: number) {
  if (accuracy >= 90) return { level: 'Excellent', color: 'text-green-500', icon: '🏆' }
  if (accuracy >= 70) return { level: 'Good', color: 'text-blue-500', icon: '⭐' }
  if (accuracy >= 50) return { level: 'Fair', color: 'text-yellow-500', icon: '👍' }
  return { level: 'Needs Practice', color: 'text-orange-500', icon: '💪' }
}