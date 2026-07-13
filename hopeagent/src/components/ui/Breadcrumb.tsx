import React, { useState } from 'react'
import { ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
interface BreadcrumbItem {
  /** 标题 */
  title: React.ReactNode
  /** 图标 */
  icon?: React.ReactNode
  /** 点击回调 */
  onClick?: () => void
  /** 跳转链接 */
  href?: string
}

interface BreadcrumbProps {
  /** 面包屑项 */
  items: BreadcrumbItem[]
  /** 自定义分隔符 */
  separator?: React.ReactNode
  /** 折叠阈值（超过则折叠中间项） */
  maxItems?: number
  /** 自定义类名 */
  className?: string
  /** 单项类名 */
  itemClassName?: string
}

/**
 * Cyber 终端风格面包屑导航
 * - 支持图标
 * - 自定义分隔符
 * - 中间项折叠
 */
export function Breadcrumb({
  items,
  separator,
  maxItems = 4,
  className,
  itemClassName,
}: BreadcrumbProps) {
  const [expanded, setExpanded] = useState(false)
  const Sep = separator ?? <ChevronRight className="w-3.5 h-3.5 text-gray-600" />

  // 计算是否需要折叠
  const needCollapse = items.length > maxItems && !expanded

  // 渲染单项
  const renderItem = (item: BreadcrumbItem, idx: number, isLast: boolean) => {
    const content = (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 text-sm font-mono transition-colors',
          isLast ? 'text-cyber-accent' : 'text-gray-400 hover:text-cyber-text',
          item.onClick && !isLast && 'cursor-pointer'
        )}
      >
        {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
        <span>{item.title}</span>
      </span>
    )

    return (
      <React.Fragment key={idx}>
        <li className={cn('inline-flex items-center', itemClassName)}>
          {item.href && !isLast ? (
            <a href={item.href} className="inline-flex" onClick={item.onClick}>
              {content}
            </a>
          ) : (
            <span onClick={item.onClick}>{content}</span>
          )}
        </li>
        {!isLast && <li className="inline-flex items-center mx-1.5">{Sep}</li>}
      </React.Fragment>
    )
  }

  return (
    <nav className={cn('flex items-center', className)} aria-label="breadcrumb">
      <ol className="flex items-center flex-wrap">
        {needCollapse
          ? [
              renderItem(items[0], 0, false),
              <li key="sep-collapse-1" className="inline-flex items-center mx-1.5">{Sep}</li>,
              <li key="collapse" className="inline-flex items-center mx-1.5">
                <button
                  onClick={() => setExpanded(true)}
                  className="text-gray-500 hover:text-cyber-accent transition-colors p-0.5 rounded hover:bg-cyber-accent/10"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </li>,
              <li key="sep-collapse-2" className="inline-flex items-center mx-1.5">{Sep}</li>,
              renderItem(items[items.length - 1], items.length - 1, true),
            ]
          : items.map((item, idx) => renderItem(item, idx, idx === items.length - 1))}
      </ol>
    </nav>
  )
}

export default Breadcrumb
