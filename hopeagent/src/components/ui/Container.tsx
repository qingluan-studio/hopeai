import React from 'react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
interface ContainerProps {
  /** 最大宽度 */
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | number
  /** 是否居中 */
  centered?: boolean
  /** 内边距 */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** 是否响应式 */
  responsive?: boolean
  /** 子元素 */
  children: React.ReactNode
  /** 自定义类名 */
  className?: string
}

// ============ 宽度映射 ============
const widthMap: Record<string, string> = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full',
}

// ============ 内边距映射 ============
const paddingMap = {
  none: 'px-0',
  sm: 'px-2',
  md: 'px-4',
  lg: 'px-6',
}

/**
 * Cyber 终端风格容器
 * - 最大宽度 / 居中 / 响应式
 */
export function Container({
  maxWidth = 'lg',
  centered = true,
  padding = 'md',
  responsive = false,
  children,
  className,
}: ContainerProps) {
  // 数字宽度
  const widthStyle = typeof maxWidth === 'number' ? { maxWidth: `${maxWidth}px` } : undefined
  const widthClass = typeof maxWidth === 'string' ? widthMap[maxWidth] : ''

  return (
    <div
      className={cn(
        'w-full mx-auto',
        centered && 'mx-auto',
        typeof maxWidth === 'string' && widthClass,
        paddingMap[padding],
        responsive && 'sm:px-4 md:px-6 lg:px-8',
        className
      )}
      style={widthStyle}
    >
      {children}
    </div>
  )
}

export default Container
