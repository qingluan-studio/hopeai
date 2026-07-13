import React from 'react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
interface StackProps {
  /** 间距 */
  spacing?: 'sm' | 'md' | 'lg' | number
  /** 对齐方式 */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  /** 主轴对齐 */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  /** 是否换行 */
  wrap?: boolean
  /** 子元素 */
  children: React.ReactNode
  /** 自定义类名 */
  className?: string
}

// ============ 尺寸映射 ============
const spacingMap = {
  sm: 4,
  md: 8,
  lg: 16,
}

const alignMap = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
}

const justifyMap = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
}

/**
 * Cyber 终端风格横向堆栈
 */
export function HStack({
  spacing = 'md',
  align = 'center',
  justify = 'start',
  wrap = false,
  children,
  className,
}: StackProps) {
  const gap = typeof spacing === 'number' ? spacing : spacingMap[spacing]
  return (
    <div
      className={cn(
        'flex flex-row',
        alignMap[align],
        justifyMap[justify],
        wrap && 'flex-wrap',
        className
      )}
      style={{ gap: `${gap}px` }}
    >
      {children}
    </div>
  )
}

/**
 * Cyber 终端风格竖向堆栈
 */
export function VStack({
  spacing = 'md',
  align = 'stretch',
  justify = 'start',
  children,
  className,
}: StackProps) {
  const gap = typeof spacing === 'number' ? spacing : spacingMap[spacing]
  return (
    <div
      className={cn('flex flex-col', alignMap[align], justifyMap[justify], className)}
      style={{ gap: `${gap}px` }}
    >
      {children}
    </div>
  )
}

/**
 * Cyber 终端风格 Z 轴堆栈（层叠）
 */
export function ZStack({
  align = 'center',
  justify = 'center',
  children,
  className,
}: Omit<StackProps, 'spacing' | 'wrap'>) {
  return (
    <div className={cn('relative', alignMap[align], justifyMap[justify], className)}>
      {React.Children.map(children, (child, idx) => (
        <div
          key={idx}
          className={cn(idx === 0 ? 'relative' : 'absolute inset-0 flex', alignMap[align], justifyMap[justify])}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

export default HStack
