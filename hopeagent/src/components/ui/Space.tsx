import React from 'react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
interface SpaceProps {
  /** 方向 */
  direction?: 'horizontal' | 'vertical'
  /** 间距大小 */
  size?: 'sm' | 'md' | 'lg' | number
  /** 对齐方式 */
  align?: 'start' | 'center' | 'end' | 'baseline'
  /** 是否换行 */
  wrap?: boolean
  /** 分隔符 */
  split?: React.ReactNode
  /** 子元素 */
  children: React.ReactNode
  /** 自定义类名 */
  className?: string
}

// ============ 尺寸映射 ============
const sizeMap = {
  sm: 4,
  md: 8,
  lg: 16,
}

/**
 * Cyber 终端风格间距组件
 * - 横向 / 竖向
 * - 换行
 * - 分隔符
 */
export function Space({
  direction = 'horizontal',
  size = 'md',
  align = 'center',
  wrap = false,
  split,
  children,
  className,
}: SpaceProps) {
  // 计算间距值
  const gap = typeof size === 'number' ? size : sizeMap[size]

  // 子元素数组
  const items = React.Children.toArray(children).filter(Boolean)

  return (
    <div
      className={cn(
        'flex',
        direction === 'vertical' ? 'flex-col' : 'flex-row',
        wrap && 'flex-wrap',
        align === 'start' && 'items-start',
        align === 'center' && 'items-center',
        align === 'end' && 'items-end',
        align === 'baseline' && 'items-baseline',
        className
      )}
      style={{ gap: `${gap}px` }}
    >
      {items.map((child, idx) => (
        <React.Fragment key={idx}>
          {child}
          {/* 分隔符 */}
          {split && idx < items.length - 1 && (
            <span className="text-gray-600 font-mono flex items-center">{split}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default Space
