import React from 'react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
type CardVariant = 'default' | 'bordered' | 'ghost'

interface CardProps {
  /** 卡片变体 */
  variant?: CardVariant
  /** 卡片标题 */
  title?: React.ReactNode
  /** 卡片副标题 */
  subTitle?: React.ReactNode
  /** 头部额外内容 */
  extra?: React.ReactNode
  /** 卡片内容 */
  children?: React.ReactNode
  /** 底部操作区 */
  footer?: React.ReactNode
  /** 是否有悬浮效果 */
  hoverable?: boolean
  /** 自定义类名 */
  className?: string
  /** 头部自定义类名 */
  headerClassName?: string
  /** 内容区自定义类名 */
  bodyClassName?: string
  /** 底部自定义类名 */
  footerClassName?: string
}

// ============ 变体样式映射 ============
const variantStyles: Record<CardVariant, string> = {
  default: 'bg-cyber-panel/50 border border-cyber-border',
  bordered: 'bg-cyber-bg border-2 border-cyber-accent/20',
  ghost: 'bg-transparent border border-transparent',
}

/**
 * Cyber 终端风格卡片组件
 * - 标题 + 内容 + 底部操作区
 * - 3 种变体：default / bordered / ghost
 * - 悬浮效果
 */
export function Card({
  variant = 'default',
  title,
  subTitle,
  extra,
  children,
  footer,
  hoverable = false,
  className,
  headerClassName,
  bodyClassName,
  footerClassName,
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl overflow-hidden transition-all duration-300',
        variantStyles[variant],
        hoverable && 'hover:border-cyber-accent/40 hover:shadow-[0_0_30px_rgba(0,255,136,0.1)] hover:-translate-y-0.5',
        className
      )}
    >
      {/* 头部 */}
      {(title || extra) && (
        <div
          className={cn(
            'flex items-center justify-between px-4 py-3 border-b border-cyber-border/50',
            'bg-gradient-to-r from-cyber-accent/5 to-transparent',
            headerClassName
          )}
        >
          <div className="flex items-center gap-2 min-w-0">
            {title && (
              <h3 className="text-sm font-mono font-bold text-cyber-text truncate">{title}</h3>
            )}
            {subTitle && (
              <span className="text-xs text-gray-500 truncate">{subTitle}</span>
            )}
          </div>
          {extra && <div className="flex-shrink-0">{extra}</div>}
        </div>
      )}

      {/* 内容区 */}
      {children && (
        <div className={cn('p-4', bodyClassName)}>
          {children}
        </div>
      )}

      {/* 底部操作区 */}
      {footer && (
        <div
          className={cn(
            'px-4 py-3 border-t border-cyber-border/50 bg-cyber-bg/30',
            footerClassName
          )}
        >
          {footer}
        </div>
      )}
    </div>
  )
}

export default Card
