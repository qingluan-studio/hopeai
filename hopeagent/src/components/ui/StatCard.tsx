import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
type StatCardColor = 'cyber' | 'cyan' | 'purple' | 'amber'

interface StatCardProps {
  /** 标题 */
  title: string
  /** 数值 */
  value: string | number
  /** 变化率（正值上升，负值下降） */
  change?: number
  /** 变化描述 */
  changeText?: string
  /** 趋势数据（迷你柱状图，0-100 的数组） */
  trendData?: number[]
  /** 配色方案 */
  color?: StatCardColor
  /** 前置图标 */
  icon?: React.ReactNode
  /** 自定义类名 */
  className?: string
  /** 点击回调 */
  onClick?: () => void
}

// ============ 颜色配置 ============
const colorConfig: Record<StatCardColor, {
  primary: string
  bg: string
  border: string
  text: string
  glow: string
}> = {
  cyber: {
    primary: '#00ff88',
    bg: 'bg-cyber-accent/5',
    border: 'border-cyber-accent/20',
    text: 'text-cyber-accent',
    glow: 'shadow-[0_0_30px_rgba(0,255,136,0.15)]',
  },
  cyan: {
    primary: '#00d4ff',
    bg: 'bg-cyan-500/5',
    border: 'border-cyan-500/20',
    text: 'text-cyan-400',
    glow: 'shadow-[0_0_30px_rgba(0,212,255,0.15)]',
  },
  purple: {
    primary: '#a78bfa',
    bg: 'bg-purple-500/5',
    border: 'border-purple-500/20',
    text: 'text-purple-400',
    glow: 'shadow-[0_0_30px_rgba(167,139,250,0.15)]',
  },
  amber: {
    primary: '#fbbf24',
    bg: 'bg-amber-500/5',
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    glow: 'shadow-[0_0_30px_rgba(251,191,36,0.15)]',
  },
}

/**
 * Cyber 终端风格统计卡片组件
 * - 标题 + 数值 + 变化率（上升/下降箭头）
 * - 趋势小图（迷你柱状）
 * - 4 种配色方案
 * - 悬浮效果
 */
export function StatCard({
  title,
  value,
  change,
  changeText,
  trendData,
  color = 'cyber',
  icon,
  className,
  onClick,
}: StatCardProps) {
  const config = colorConfig[color]
  const isPositive = change !== undefined && change >= 0

  return (
    <div
      className={cn(
        'p-4 rounded-xl bg-cyber-panel/50 border transition-all duration-300',
        'hover:-translate-y-0.5 cursor-pointer',
        config.bg,
        config.border,
        onClick && config.glow,
        className
      )}
      onClick={onClick}
    >
      {/* 头部：标题 + 图标 */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-500 font-mono">{title}</span>
        {icon && (
          <div
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center',
              config.bg,
              config.border,
              'border'
            )}
          >
            <span className={config.text}>{icon}</span>
          </div>
        )}
      </div>

      {/* 数值 */}
      <div className="flex items-baseline gap-2 mb-3">
        <span
          className="text-2xl font-bold font-mono"
          style={{ color: config.primary }}
        >
          {value}
        </span>
        {change !== undefined && (
          <span
            className={cn(
              'text-xs font-mono flex items-center gap-0.5',
              isPositive ? 'text-emerald-400' : 'text-red-400'
            )}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {isPositive ? '+' : ''}
            {change}%
          </span>
        )}
      </div>

      {/* 变化描述 */}
      {changeText && (
        <p className="text-[10px] text-gray-500 mb-3 font-mono">{changeText}</p>
      )}

      {/* 趋势迷你柱状图 */}
      {trendData && trendData.length > 0 && (
        <div className="flex items-end gap-1 h-10">
          {trendData.map((val, i) => {
            const height = Math.max(4, Math.min(100, val))
            return (
              <div
                key={i}
                className="flex-1 rounded-sm transition-all duration-300"
                style={{
                  height: `${height}%`,
                  backgroundColor: config.primary,
                  opacity: 0.3 + (i / trendData.length) * 0.7,
                  boxShadow: i === trendData.length - 1 ? `0 0 6px ${config.primary}` : 'none',
                }}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default StatCard
