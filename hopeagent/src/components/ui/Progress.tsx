import React from 'react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
type ProgressType = 'line' | 'circle' | 'dashboard'
type ProgressStatus = 'normal' | 'success' | 'error' | 'warning'

interface ProgressProps {
  /** 进度百分比 0-100 */
  percent: number
  /** 进度条类型 */
  type?: ProgressType
  /** 状态 */
  status?: ProgressStatus
  /** 线条宽度 */
  strokeWidth?: number
  /** 尺寸（圆形/仪表盘模式） */
  size?: number
  /** 是否显示文字 */
  showInfo?: boolean
  /** 自定义文字格式 */
  format?: (percent: number) => React.ReactNode
  /** 自定义类名 */
  className?: string
  /** 动画效果 */
  animated?: boolean
}

// ============ 状态颜色映射 ============
const statusColors: Record<ProgressStatus, string> = {
  normal: '#00ff88',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
}

/**
 * Cyber 终端风格进度条组件
 * - 线性进度条
 * - 环形进度条（SVG circle）
 * - 仪表盘进度
 * - 动画效果
 * - 多种状态颜色
 */
export function Progress({
  percent,
  type = 'line',
  status = 'normal',
  strokeWidth = 8,
  size = 120,
  showInfo = true,
  format,
  className,
  animated = true,
}: ProgressProps) {
  // 确保百分比在 0-100 之间
  const safePercent = Math.min(100, Math.max(0, percent))
  const color = statusColors[status]

  // 渲染文字信息
  const renderInfo = () => {
    if (!showInfo) return null
    if (format) return format(safePercent)
    return <span className="text-xs font-mono">{safePercent}%</span>
  }

  // 线性进度条
  if (type === 'line') {
    return (
      <div className={cn('w-full flex items-center gap-3', className)}>
        <div className="flex-1 relative h-2 bg-cyber-border rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-500', animated && 'animate-pulse-glow')}
            style={{
              width: `${safePercent}%`,
              backgroundColor: color,
              boxShadow: `0 0 10px ${color}50`,
            }}
          />
          {/* 发光端点 */}
          {safePercent > 0 && safePercent < 100 && (
            <div
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
              style={{
                left: `calc(${safePercent}% - 4px)`,
                backgroundColor: color,
                boxShadow: `0 0 8px ${color}`,
              }}
            />
          )}
        </div>
        {showInfo && (
          <span className="text-xs font-mono text-gray-400 flex-shrink-0 w-12 text-right">
            {renderInfo()}
          </span>
        )}
      </div>
    )
  }

  // 圆形 / 仪表盘进度
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (safePercent / 100) * circumference

  // 仪表盘模式：270度
  const isDashboard = type === 'dashboard'
  const dashArray = isDashboard ? (circumference * 270) / 360 : circumference
  const dashOffset = isDashboard
    ? dashArray - (safePercent / 100) * dashArray
    : offset

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        {/* 背景轨道 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(26, 35, 50, 0.8)"
          strokeWidth={strokeWidth}
          strokeDasharray={isDashboard ? `${dashArray} ${circumference}` : undefined}
          strokeLinecap="round"
        />
        {/* 进度条 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${dashArray} ${circumference}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className="transition-all duration-500"
          style={{
            filter: `drop-shadow(0 0 6px ${color}50)`,
          }}
        />
      </svg>

      {/* 中心文字 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="font-mono font-bold"
          style={{ color, fontSize: size * 0.22 }}
        >
          {renderInfo()}
        </span>
      </div>
    </div>
  )
}

export default Progress
