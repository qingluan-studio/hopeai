import { useEffect, useRef } from 'react'

interface MatrixBackgroundProps {
  opacity?: number
  speed?: number
  fontSize?: number
  charColor?: string
  className?: string
}

export default function MatrixBackground({
  opacity = 0.15,
  speed = 50,
  fontSize = 14,
  charColor = '#22c55e',
  className = '',
}: MatrixBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const dropsRef = useRef<number[]>([])
  const charsRef = useRef<string[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*()'
    const charArray = chars.split('')
    charsRef.current = charArray

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      const columns = Math.floor(canvas.width / fontSize)
      dropsRef.current = Array(columns).fill(0).map(() => Math.random() * -100)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let lastTime = 0
    const animate = (currentTime: number) => {
      if (currentTime - lastTime < speed) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      lastTime = currentTime

      ctx.fillStyle = `rgba(0, 0, 0, 0.05)`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px monospace`
      
      const drops = dropsRef.current
      const chars = charsRef.current

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, fontSize * 2)
        gradient.addColorStop(0, charColor)
        gradient.addColorStop(1, 'transparent')
        
        ctx.fillStyle = charColor
        ctx.globalAlpha = opacity
        ctx.fillText(text, x, y)
        
        ctx.globalAlpha = opacity * 0.3
        ctx.fillText(text, x, y - fontSize)
        
        ctx.globalAlpha = 1

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [opacity, speed, fontSize, charColor])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  )
}
