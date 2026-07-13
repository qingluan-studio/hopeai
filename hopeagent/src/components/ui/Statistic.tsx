import React, { useState, useEffect, useRef } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
interface StatisticProps {
  /** 标题 */
  title?: React.ReactNode
  /** 数值 */
  value?: number | string
  /** 精度 */
  precision?: number
  /** 前缀 */
  prefix?: React.ReactNode
  /** 后缀 */
  suffix?: React.ReactNode
  /** 是否加载中 */
  loading?: boolean
  /** 是否数值动画 */
  animation?: boolean
  /** 动画时长（毫秒） */
  animationDuration?: number
  /** 变化趋势 */
  trend?: 'up' | 'down'
  /** 趋势值 */
  trendValue?: number | string
  /** 自定义类名 */
  className?: string
  /** 值类名 */
  valueClassName?: string
}

// 格式化数值
const formatValue = (val: number | string, precision?: number): string => {
  if (typeof val === 'string') return val
  if (precision !== undefined) return val.toFixed(precision)
  return val.toLocaleString('zh-CN')
}

/**
 * Cyber 终端风格统计数值
 * - 前缀 / 后缀
 * - 数值动画
 * - 趋势指示
 */
export function Statistic({
  title,
  value = 0,
  precision,
  prefix,
  suffix,
  loading = false,
  animation = false,
  animationDuration = 1000,
  trend,
  trendValue,
  className,
  valueClassName,
}: StatisticProps) {
  const [displayValue, setDisplayValue] = useState<number>(0)
  const rafRef = useRef<number | null>(null)

  // 数值动画
  useEffect(() => {
    if (!animation || typeof value !== 'number') {
      setDisplayValue(typeof value === 'number' ? value : 0)
      return
    }
    const start = displayValue
    const end = value
    const startTime = performance.now()

    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / animationDuration, 1)
      // easeOutQuart
      const eased = 1 - Math.pow(1 - progress, 4)
      setDisplayValue(start + (end - start) * eased)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [value, animation, animationDuration]) // eslint-disable-line

  const finalValue = animation && typeof value === 'number' ? formatValue(displayValue, precision) : formatValue(value, precision)

  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown
  const trendColor = trend === 'up' ? 'text-emerald-400' : 'text-red-400'

  return (
    <div className={cn('inline-flex flex-col', className)}>
      {/* 标题 */}
      {title && (
        <div className="text-xs text-gray-500 font-mono mb-1">{title}</div>
      )}

      {/* 数值区 */}
      <div className="flex items-baseline gap-1">
        {loading ? (
          <div className="h-8 w-20 bg-cyber-border/40 rounded animate-skeleton" />
        ) : (
          <>
            {prefix && <span className="text-sm text-cyber-accent font-mono">{prefix}</span>}
            <span
              className={cn(
                'text-2xl font-mono font-bold text-cyber-text',
                'glow-text',
                valueClassName
              )}
              style={{ textShadow: '0 0 10px rgba(0,255,136,0.4)' }}
            >
              {finalValue}
            </span>
            {suffix && <span className="text-sm text-gray-400 font-mono">{suffix}</span>}
          </>
        )}
      </div>

      {/* 趋势 */}
      {trend && trendValue !== undefined && (
        <div className={cn('flex items-center gap-1 mt-1 text-xs font-mono', trendColor)}>
          <TrendIcon className="w-3 h-3" />
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  )
}

export default Statistic
