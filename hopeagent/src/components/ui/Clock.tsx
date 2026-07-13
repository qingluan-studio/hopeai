import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
interface ClockProps {
  /** 样式：数字 / 模拟 */
  variant?: 'digital' | 'analog'
  /** 是否 24 小时制 */
  hour24?: boolean
  /** 时区偏移（小时） */
  timezone?: number
  /** 是否显示秒 */
  showSeconds?: boolean
  /** 是否显示日期 */
  showDate?: boolean
  /** 自定义类名 */
  className?: string
  /** 颜色 */
  color?: string
}

// 格式化数字
const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Cyber 终端风格实时时钟
 * - 数字 / 模拟两种样式
 * - 12 / 24 小时制
 * - 时区
 */
export function Clock({
  variant = 'digital',
  hour24 = true,
  timezone,
  showSeconds = true,
  showDate = false,
  className,
  color = '#00ff88',
}: ClockProps) {
  const [now, setNow] = useState(new Date())

  // 每秒更新
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 获取调整时区后的时间
  const getTime = () => {
    if (timezone === undefined) return now
    const utc = now.getTime() + now.getTimezoneOffset() * 60000
    return new Date(utc + timezone * 3600000)
  }

  const time = getTime()
  const hours = time.getHours()
  const minutes = time.getMinutes()
  const seconds = time.getSeconds()

  // 12 小时制
  const displayHours = hour24 ? hours : hours % 12 || 12
  const ampm = !hour24 ? (hours >= 12 ? 'PM' : 'AM') : ''

  // 数字时钟
  if (variant === 'digital') {
    return (
      <div className={cn('inline-flex flex-col items-center font-mono', className)}>
        {/* 时间 */}
        <div className="flex items-center gap-1">
          <span
            className="text-2xl font-bold tracking-wider"
            style={{ color, textShadow: `0 0 10px ${color}88` }}
          >
            {pad(displayHours)}:{pad(minutes)}
            {showSeconds && `:${pad(seconds)}`}
          </span>
          {ampm && (
            <span className="text-sm ml-1" style={{ color }}>
              {ampm}
            </span>
          )}
        </div>
        {/* 日期 */}
        {showDate && (
          <div className="text-xs text-gray-500 mt-0.5">
            {time.getFullYear()}-{pad(time.getMonth() + 1)}-{pad(time.getDate())}
          </div>
        )}
        {/* 终端风格光标 */}
        <span
          className="inline-block w-2 h-4 mt-1 animate-blink"
          style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
        />
      </div>
    )
  }

  // 模拟时钟
  const hourAngle = (hours % 12) * 30 + minutes * 0.5
  const minuteAngle = minutes * 6 + seconds * 0.1
  const secondAngle = seconds * 6

  // 指针渲染
  const Hand = ({ angle, length, width, color: c }: { angle: number; length: number; width: number; color: string }) => (
    <div
      className="absolute left-1/2 top-1/2 origin-bottom"
      style={{
        width: `${width}px`,
        height: `${length}px`,
        backgroundColor: c,
        transform: `translate(-50%, -100%) rotate(${angle}deg)`,
        transformOrigin: 'bottom center',
        borderRadius: '2px',
        boxShadow: `0 0 4px ${c}`,
      }}
    />
  )

  // 刻度
  const ticks = Array.from({ length: 12 }, (_, i) => i)

  return (
    <div
      className={cn('relative rounded-full border-2 flex items-center justify-center', className)}
      style={{
        width: 120,
        height: 120,
        borderColor: `${color}44`,
        backgroundColor: '#0a0e14',
        boxShadow: `0 0 20px ${color}33, inset 0 0 20px ${color}11`,
      }}
    >
      {/* 刻度 */}
      {ticks.map((i) => {
        const angle = i * 30
        const isMain = i % 3 === 0
        return (
          <div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-50px)`,
            }}
          >
            <div
              style={{
                width: isMain ? 3 : 1,
                height: isMain ? 8 : 5,
                backgroundColor: isMain ? color : `${color}66`,
                borderRadius: '1px',
              }}
            />
          </div>
        )
      })}

      {/* 时针 */}
      <Hand angle={hourAngle} length={30} width={3} color={color} />
      {/* 分针 */}
      <Hand angle={minuteAngle} length={42} width={2} color={color} />
      {/* 秒针 */}
      <Hand angle={secondAngle} length={48} width={1} color="#ff00aa" />

      {/* 中心点 */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 6,
          height: 6,
          backgroundColor: color,
          boxShadow: `0 0 6px ${color}`,
        }}
      />
    </div>
  )
}

export default Clock
