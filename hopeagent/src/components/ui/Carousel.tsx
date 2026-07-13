import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
interface CarouselProps {
  /** 轮播内容 */
  children: React.ReactNode[]
  /** 是否自动播放 */
  autoplay?: boolean
  /** 自动播放间隔（毫秒） */
  interval?: number
  /** 是否显示指示器 */
  showDots?: boolean
  /** 是否显示箭头 */
  showArrows?: boolean
  /** 是否循环 */
  loop?: boolean
  /** 过渡时长（毫秒） */
  duration?: number
  /** 切换回调 */
  onChange?: (index: number) => void
  /** 自定义类名 */
  className?: string
}

/**
 * Cyber 终端风格轮播图
 * - 自动播放
 * - 指示器 / 箭头
 * - 循环切换
 */
export function Carousel({
  children,
  autoplay = false,
  interval = 3000,
  showDots = true,
  showArrows = true,
  loop = true,
  duration = 500,
  onChange,
  className,
}: CarouselProps) {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const total = children.length

  // 切换到指定页
  const goTo = useCallback(
    (idx: number) => {
      if (total === 0) return
      let next = idx
      if (loop) {
        next = ((idx % total) + total) % total
      } else {
        next = Math.max(0, Math.min(total - 1, idx))
      }
      setCurrent(next)
      onChange?.(next)
    },
    [total, loop, onChange]
  )

  // 上一张 / 下一张
  const prev = () => goTo(current - 1)
  const next = () => goTo(current + 1)

  // 自动播放
  useEffect(() => {
    if (!autoplay || isPaused || total <= 1) return
    timerRef.current = setInterval(() => {
      goTo(current + 1)
    }, interval)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [autoplay, isPaused, current, interval, total, goTo])

  if (total === 0) return null

  return (
    <div
      className={cn('relative overflow-hidden rounded-lg bg-cyber-panel border border-cyber-border', className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 顶部扫描线 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-accent/50 to-transparent z-10" />

      {/* 轨道 */}
      <div
        className="flex transition-transform ease-out"
        style={{ transform: `translateX(-${current * 100}%)`, transitionDuration: `${duration}ms` }}
      >
        {children.map((child, idx) => (
          <div key={idx} className="w-full flex-shrink-0">
            {child}
          </div>
        ))}
      </div>

      {/* 箭头 */}
      {showArrows && total > 1 && (
        <>
          <button
            onClick={prev}
            disabled={!loop && current === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 border border-cyber-border text-cyber-text hover:bg-cyber-accent/20 hover:text-cyber-accent hover:border-cyber-accent/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            disabled={!loop && current === total - 1}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 border border-cyber-border text-cyber-text hover:bg-cyber-accent/20 hover:text-cyber-accent hover:border-cyber-accent/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* 指示器 */}
      {showDots && total > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
          {children.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={cn(
                'h-1.5 rounded-full transition-all',
                idx === current
                  ? 'w-5 bg-cyber-accent shadow-[0_0_8px_rgba(0,255,136,0.6)]'
                  : 'w-1.5 bg-gray-600 hover:bg-gray-400'
              )}
            />
          ))}
        </div>
      )}

      {/* 计数 */}
      <div className="absolute top-2 right-2 z-10 px-2 py-0.5 bg-black/50 border border-cyber-border rounded text-xs font-mono text-cyber-accent">
        {current + 1} / {total}
      </div>
    </div>
  )
}

export default Carousel
