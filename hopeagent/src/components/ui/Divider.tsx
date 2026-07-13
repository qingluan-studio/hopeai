import React from 'react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
type DividerOrientation = 'horizontal' | 'vertical'
type DividerType = 'solid' | 'dashed'

interface DividerProps {
  /** 方向 */
  orientation?: DividerOrientation
  /** 线条类型 */
  type?: DividerType
  /** 中间文字（仅水平模式） */
  children?: React.ReactNode
  /** 文字位置 */
  align?: 'left' | 'center' | 'right'
  /** 自定义类名 */
  className?: string
  /** 颜色 */
  color?: string
}

/**
 * Cyber 终端风格分割线组件
 * - 水平 / 垂直
 * - 带文字居中
 * - 虚线 / 实线
 */
export function Divider({
  orientation = 'horizontal',
  type = 'solid',
  children,
  align = 'center',
  className,
  color,
}: DividerProps) {
  const borderStyle = type === 'dashed' ? 'border-dashed' : 'border-solid'
  const borderColor = color || 'border-cyber-border'

  // 垂直模式
  if (orientation === 'vertical') {
    return (
      <div
        className={cn(
          'inline-block h-full w-px mx-2 border-l',
          borderStyle,
          borderColor,
          className
        )}
      />
    )
  }

  // 水平模式（带文字）
  if (children) {
    const alignMap = {
      left: 'before:flex-[0_0_10%] after:flex-1',
      center: 'before:flex-1 after:flex-1',
      right: 'before:flex-1 after:flex-[0_0_10%]',
    }

    return (
      <div
        className={cn(
          'flex items-center gap-3 my-4 w-full',
          alignMap[align],
          className
        )}
      >
        <div
          className={cn('h-px border-t flex-1 min-w-[20px]', borderStyle, borderColor)}
          style={color ? { borderColor: color } : undefined}
        />
        <span className="text-xs text-gray-500 font-mono whitespace-nowrap px-1">
          {children}
        </span>
        <div
          className={cn('h-px border-t flex-1 min-w-[20px]', borderStyle, borderColor)}
          style={color ? { borderColor: color } : undefined}
        />
      </div>
    )
  }

  // 水平模式（纯线条）
  return (
    <div
      className={cn('w-full h-px border-t my-4', borderStyle, borderColor, className)}
      style={color ? { borderColor: color } : undefined}
    />
  )
}

export default Divider
