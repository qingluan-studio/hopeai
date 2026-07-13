import React, { useState } from 'react'
import { ChevronRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
interface ListItemProps {
  /** 主标题 */
  title: React.ReactNode
  /** 副标题 */
  description?: React.ReactNode
  /** 左侧内容（图片/图标/头像等） */
  leftContent?: React.ReactNode
  /** 右侧操作区 */
  rightContent?: React.ReactNode
  /** 额外内容（显示在下方） */
  extra?: React.ReactNode
  /** 是否可点击 */
  clickable?: boolean
  /** 点击回调 */
  onClick?: () => void
  /** 自定义类名 */
  className?: string
}

interface ListProps {
  /** 列表项数据 */
  dataSource?: any[]
  /** 渲染列表项 */
  renderItem?: (item: any, index: number) => React.ReactNode
  /** 子元素（直接传入 ListItem） */
  children?: React.ReactNode
  /** 是否显示分隔线 */
  bordered?: boolean
  /** 列表大小 */
  size?: 'sm' | 'md'
  /** 加载中状态 */
  loading?: boolean
  /** 空状态文案 */
  emptyText?: React.ReactNode
  /** 加载更多 */
  loadMore?: boolean
  /** 加载更多回调 */
  onLoadMore?: () => void
  /** 自定义类名 */
  className?: string
  /** 列表头部 */
  header?: React.ReactNode
  /** 列表底部 */
  footer?: React.ReactNode
}

/**
 * Cyber 终端风格列表项组件
 */
function ListItem({
  title,
  description,
  leftContent,
  rightContent,
  extra,
  clickable = false,
  onClick,
  className,
}: ListItemProps) {
  return (
    <div
      className={cn(
        'flex gap-3 py-3 px-4 transition-colors',
        clickable && 'cursor-pointer hover:bg-cyber-accent/5',
        className
      )}
      onClick={onClick}
    >
      {/* 左侧内容 */}
      {leftContent && <div className="flex-shrink-0">{leftContent}</div>}

      {/* 主内容区 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-cyber-text truncate">{title}</div>
            {description && (
              <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">{description}</div>
            )}
          </div>
          {rightContent && <div className="flex-shrink-0">{rightContent}</div>}
        </div>
        {extra && <div className="mt-2">{extra}</div>}
      </div>

      {/* 可点击箭头 */}
      {clickable && (
        <div className="flex-shrink-0 flex items-center text-gray-500">
          <ChevronRight className="w-4 h-4" />
        </div>
      )}
    </div>
  )
}

/**
 * Cyber 终端风格列表组件
 * - 列表项 + 分隔线
 * - 左图/右操作/副标题
 * - 空状态
 * - 加载更多
 */
export function List({
  dataSource,
  renderItem,
  children,
  bordered = true,
  size = 'md',
  loading = false,
  emptyText = '暂无数据',
  loadMore = false,
  onLoadMore,
  className,
  header,
  footer,
}: ListProps) {
  const [loadingMore, setLoadingMore] = useState(false)

  const handleLoadMore = async () => {
    if (loadingMore) return
    setLoadingMore(true)
    await onLoadMore?.()
    setLoadingMore(false)
  }

  // 渲染骨架屏
  const renderSkeleton = () => {
    return Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className={cn('flex gap-3 py-3 px-4', bordered && 'border-b border-cyber-border/50')}>
        <div className="w-10 h-10 rounded-lg bg-cyber-border/50 animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-cyber-border/50 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-cyber-border/30 rounded animate-pulse w-1/2" />
        </div>
      </div>
    ))
  }

  // 渲染列表内容
  const renderContent = () => {
    if (loading) {
      return renderSkeleton()
    }

    if (dataSource && renderItem) {
      if (dataSource.length === 0) {
        return (
          <div className="py-12 text-center">
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <div className="w-12 h-12 rounded-full bg-cyber-border/30 flex items-center justify-center">
                <span className="text-xl">📭</span>
              </div>
              <span className="text-xs">{emptyText}</span>
            </div>
          </div>
        )
      }

      return dataSource.map((item, index) => (
        <div
          key={index}
          className={cn(bordered && index < dataSource.length - 1 && 'border-b border-cyber-border/50')}
        >
          {renderItem(item, index)}
        </div>
      ))
    }

    if (children) {
      return React.Children.map(children, (child, index) => (
        <div
          key={index}
          className={cn(
            bordered && index < React.Children.count(children) - 1 && 'border-b border-cyber-border/50'
          )}
        >
          {child}
        </div>
      ))
    }

    return null
  }

  return (
    <div className={cn('bg-cyber-panel/30 rounded-lg overflow-hidden border border-cyber-border/50', className)}>
      {/* 头部 */}
      {header && (
        <div className="px-4 py-2 border-b border-cyber-border/50 bg-cyber-accent/5">
          {header}
        </div>
      )}

      {/* 列表内容 */}
      <div>{renderContent()}</div>

      {/* 加载更多 */}
      {loadMore && (
        <div className="px-4 py-3 border-t border-cyber-border/50">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs text-cyber-accent hover:bg-cyber-accent/5 rounded transition-colors font-mono"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                加载中...
              </>
            ) : (
              '加载更多'
            )}
          </button>
        </div>
      )}

      {/* 底部 */}
      {footer && (
        <div className="px-4 py-2 border-t border-cyber-border/50">
          {footer}
        </div>
      )}
    </div>
  )
}

List.Item = ListItem

export { ListItem }
export default List
