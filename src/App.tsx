import { useEffect, useRef, useState } from 'react'
import { WORDS } from './constant'
import { Input } from './components/ui/input'
import { toast } from 'sonner'
import { Toaster } from './components/ui/sonner'

const getRandomInt = () => {
  return Math.floor(Math.random() * 100)
}

export default function App() {
  const [currentWordIndex, setCurrentWordIndex] = useState(getRandomInt())
  const [typed, setTyped] = useState('')
  const [barProgress, setBarProgress] = useState(0)
  const [point, setPoint] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const barProgressRef = useRef(0)

  const currentWord = WORDS[currentWordIndex]

  useEffect(() => {
    startBar()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Enter' && typed === currentWord.word) {
        handlePoint()
        nextWord()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [typed])

  const startBar = () => {
    if (intervalRef.current) return
    intervalRef.current = setInterval(() => {
      setBarProgress((prev) => {
        const next = prev >= 100 ? 0 : prev + 1
        barProgressRef.current = next
        return next
      })
    }, 40)
  }

  const nextWord = () => {
    startBar()
    setBarProgress(0)
    setTyped('')
    setCurrentWordIndex(getRandomInt())
  }
  const handlePoint = () => {
    const progress = barProgressRef.current

    let points = 0
    let message = ''

    if ((progress >= 75 && progress <= 80) || (progress >= 96 && progress <= 100)) {
      points = 10
      message = 'Cool! +10'
    } else if ((progress >= 81 && progress <= 85) || (progress >= 91 && progress <= 95)) {
      points = 15
      message = 'Great! +15'
    } else if (progress >= 86 && progress <= 90) {
      points = 20
      message = 'Perfect! +20'
    } else {
      points = -10
      message = 'Miss! -10'
    }

    if (points > 0) {
      toast.success(message)
    } else {
      toast.error(message)
    }
    setPoint((prev) => prev + points)
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4 bg-gray-900 text-white">
        <h1 className="text-4xl font-bold">Points: {point}</h1>
        <h1 className="text-4xl font-bold text-yellow-300">{currentWord.word}</h1>
        <h2 className="text-xl font-bold">{currentWord.meaning}</h2>
        <Input className="text-primary-foreground px-4 py-2 rounded" value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Type the word" autoFocus />
        <div className="relative w-96 h-4 bg-gray-700 rounded overflow-hidden">
          <div className="absolute top-0 left-0 w-4 h-4 bg-yellow-400 rounded-full" style={{ left: `${barProgress}%` }} />
          <div className="absolute top-0 left-[90%] w-1 h-4 bg-red-500" style={{ transform: 'translateX(-50%)' }} />
        </div>
        <p className="text-sm text-secondary">Type the word and press Enter at the right timing.</p>
        <Toaster position="top-left" richColors duration={1000} />
      </div>
    </>
  )
}
