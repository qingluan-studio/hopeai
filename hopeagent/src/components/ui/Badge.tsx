import React from 'react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
type BadgeStatus = 'success' | 'warning' | 'error' | 'info' | 'default'
type BadgeSize = 'sm' | 'md'
type BadgeMode = 'dot' | 'number' | 'text'

interface BadgeProps {
  /** 状态类型 */
  status?: BadgeStatus
  /** 尺寸 */
  size?: BadgeSize
  /** 显示模式 */
  mode?: BadgeMode
  /** 显示内容（文字模式或数字模式的数值） */
  content?: React.ReactNode
  /** 最大数字（超过显示 99+ 等） */
  max?: number
  /** 是否为点状 */
  dot?: boolean
  /** 自定义颜色 */
  color?: string
  /** 自定义类名 */
  className?: string
  /** 子元素（被标记的元素） */
  children?: React.ReactNode
}

// ============ 状态颜色映射 ============
const statusColors: Record<BadgeStatus, { bg: string; text: string; border: string; dot: string }> = {
  success: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/40',
    dot: 'bg-emerald-500',
  },
  warning: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/40',
    dot: 'bg-amber-500',
  },
  error: {
    bg: 'bg-red-500/15',
    text: 'text-red-400',
    border: 'border-red-500/40',
    dot: 'bg-red-500',
  },
  info: {
    bg: 'bg-cyan-500/15',
    text: 'text-cyan-400',
    border: 'border-cyan-500/40',
    dot: 'bg-cyan-500',
  },
  default: {
    bg: 'bg-gray-500/15',
    text: 'text-gray-400',
    border: 'border-gray-500/40',
    dot: 'bg-gray-500',
  },
}

// ============ 尺寸样式映射 ============
const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-[10px] rounded',
  md: 'px-2 py-0.5 text-xs rounded-md',
}

const dotSizeStyles: Record<BadgeSize, string> = {
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
}

/**
 * Cyber 终端风格徽标组件
 * - 5 种状态：success / warning / error / info / default
 * - 2 种尺寸：sm / md
 * - 3 种模式：点模式 / 数字模式 / 文字模式
 */
export function Badge({
  status = 'default',
  size = 'md',
  mode = 'text',
  content,
  max = 99,
  dot = false,
  color,
  className,
  children,
}: BadgeProps) {
  const colors = statusColors[status]

  // 处理数字显示
  const displayContent = React.useMemo(() => {
    if (mode === 'number' && typeof content === 'number') {
      return content > max ? `${max}+` : content
    }
    return content
  }, [mode, content, max])

  // 如果有子元素，徽标作为角标
  if (children) {
    return (
      <div className={cn('relative inline-flex', className)}>
        {children}
        <span
          className={cn(
            'absolute -top-1 -right-1 flex items-center justify-center',
            'font-mono font-bold border',
            colors.bg,
            colors.text,
            colors.border,
            dot ? dotSizeStyles[size] : sizeStyles[size],
            'min-w-[16px]'
          )}
          style={color ? { backgroundColor: `${color}20`, color, borderColor: `${color}60` } : undefined}
        >
          {!dot && displayContent}
        </span>
      </div>
    )
  }

  // 独立徽标
  if (dot) {
    return (
      <span
        className={cn(
          'inline-block rounded-full',
          dotSizeStyles[size],
          colors.dot,
          'animate-pulse',
          className
        )}
        style={color ? { backgroundColor: color } : undefined}
      />
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-mono font-medium border',
        colors.bg,
        colors.text,
        colors.border,
        sizeStyles[size],
        className
      )}
      style={color ? { backgroundColor: `${color}20`, color, borderColor: `${color}40` } : undefined}
    >
      {displayContent}
    </span>
  )
}

export default Badge
