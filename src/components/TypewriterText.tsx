import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface TypewriterTextProps {
  text: string
  speed?: number
  delay?: number
  showCursor?: boolean
  cursorChar?: string
  onComplete?: () => void
  className?: string
  cursorClassName?: string
}

export default function TypewriterText({
  text,
  speed = 50,
  delay = 0,
  showCursor = true,
  cursorChar = '█',
  onComplete,
  className = '',
  cursorClassName = '',
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const indexRef = useRef(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    setDisplayedText('')
    setIsComplete(false)
    indexRef.current = 0

    const startTyping = () => {
      const type = () => {
        if (indexRef.current < text.length) {
          setDisplayedText(text.slice(0, indexRef.current + 1))
          indexRef.current++
          timeoutRef.current = setTimeout(type, speed)
        } else {
          setIsComplete(true)
          onComplete?.()
        }
      }
      type()
    }

    const startTimeout = setTimeout(startTyping, delay)

    return () => {
      clearTimeout(startTimeout)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [text, speed, delay, onComplete])

  return (
    <span className={cn('inline', className)}>
      {displayedText}
      {showCursor && (
        <span 
          className={cn(
            'inline-block animate-pulse ml-0.5',
            cursorClassName
          )}
          style={{ 
            textShadow: '0 0 10px currentColor',
          }}
        >
          {cursorChar}
        </span>
      )}
      {isComplete && showCursor && (
        <span className="inline-block w-0 h-0" />
      )}
    </span>
  )
}
