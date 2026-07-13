import React from 'react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
interface DescriptionItem {
  /** 标签 */
  label: React.ReactNode
  /** 内容 */
  children: React.ReactNode
  /** 跨列数 */
  span?: number
}

interface DescriptionsProps {
  /** 标题 */
  title?: React.ReactNode
  /** 描述项 */
  items: DescriptionItem[]
  /** 列数 */
  column?: number
  /** 是否带边框 */
  bordered?: boolean
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg'
  /** 是否竖向 */
  layout?: 'horizontal' | 'vertical'
  /** 自定义类名 */
  className?: string
}

// ============ 尺寸样式映射 ============
const sizeStyles = {
  sm: 'text-xs py-1.5 px-2',
  md: 'text-sm py-2 px-3',
  lg: 'text-base py-3 px-4',
}

/**
 * Cyber 终端风格描述列表
 * - 键值对展示
 * - 多列布局
 * - 边框 / 无边框
 */
export function Descriptions({
  title,
  items,
  column = 3,
  bordered = true,
  size = 'md',
  layout = 'horizontal',
  className,
}: DescriptionsProps) {
  const s = sizeStyles[size]

  return (
    <div className={cn('w-full', className)}>
      {/* 标题 */}
      {title && (
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1 h-4 bg-cyber-accent rounded-full shadow-[0_0_6px_rgba(0,255,136,0.6)]" />
          <h3 className="text-sm font-mono font-bold text-cyber-text">{title}</h3>
        </div>
      )}

      {/* 描述网格 */}
      <div
        className={cn(
          'grid gap-px',
          bordered ? 'border border-cyber-border rounded-lg overflow-hidden bg-cyber-border' : 'gap-2'
        )}
        style={{ gridTemplateColumns: `repeat(${column}, minmax(0, 1fr))` }}
      >
        {items.map((item, idx) => {
          const span = Math.min(item.span ?? 1, column)
          return (
            <div
              key={idx}
              className={cn(bordered ? 'bg-cyber-panel/40' : 'bg-cyber-panel/30 rounded-lg p-2')}
              style={{ gridColumn: `span ${span} / span ${span}` }}
            >
              {layout === 'vertical' ? (
                <div className="flex flex-col">
                  <div className={cn('text-gray-500 font-mono', s)}>{item.label}</div>
                  <div className={cn('text-cyber-text font-mono font-bold', s)}>{item.children}</div>
                </div>
              ) : (
                <div className={cn('flex items-center gap-3', s)}>
                  <div className="text-gray-500 font-mono flex-shrink-0 min-w-[80px]">
                    {item.label}
                  </div>
                  <div className="text-cyber-text font-mono flex-1 break-all">
                    {item.children}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Descriptions
