import React from 'react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
type TimelineMode = 'left' | 'right' | 'alternate'
type TimelineItemStatus = 'default' | 'success' | 'warning' | 'error' | 'info'

interface TimelineItemProps {
  /** 标题 */
  title: React.ReactNode
  /** 内容 */
  content?: React.ReactNode
  /** 时间戳 */
  timestamp?: React.ReactNode
  /** 图标 */
  icon?: React.ReactNode
  /** 状态颜色 */
  status?: TimelineItemStatus
  /** 自定义颜色 */
  color?: string
}

interface TimelineProps {
  /** 时间线项 */
  items: TimelineItemProps[]
  /** 模式：左 / 右 / 交替 */
  mode?: TimelineMode
  /** 自定义类名 */
  className?: string
}

// ============ 状态颜色映射 ============
const statusColors: Record<TimelineItemStatus, string> = {
  default: '#6b7280',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#00d4ff',
}

/**
 * Cyber 终端风格时间线
 * - 左 / 右 / 交替三种模式
 * - 自定义图标
 * - 状态颜色
 */
export function Timeline({ items, mode = 'left', className }: TimelineProps) {
  return (
    <div className={cn('relative', className)}>
      {items.map((item, idx) => {
        const color = item.color ?? statusColors[item.status ?? 'default']
        const isAlternate = mode === 'alternate'
        const isLeft = isAlternate ? idx % 2 === 0 : mode === 'left'

        // 圆点
        const dot = (
          <div
            className="absolute w-3 h-3 rounded-full border-2 z-10 flex items-center justify-center"
            style={{
              backgroundColor: color,
              borderColor: color,
              boxShadow: `0 0 8px ${color}99`,
              [isLeft ? 'left' : 'right']: 'calc(50% - 6px)',
              top: '4px',
            }}
          >
            {item.icon && <div className="scale-50 text-white">{item.icon}</div>}
          </div>
        )

        // 内容卡片
        const content = (
          <div
            className="bg-cyber-panel/40 border border-cyber-border rounded-lg p-3"
            style={{ borderColor: `${color}33` }}
          >
            {item.title && (
              <div className="text-sm font-mono font-bold" style={{ color }}>
                {item.title}
              </div>
            )}
            {item.content && <div className="text-xs text-gray-400 mt-1">{item.content}</div>}
            {item.timestamp && (
              <div className="text-[10px] text-gray-600 font-mono mt-1">{item.timestamp}</div>
            )}
          </div>
        )

        // 主轴线
        const axis = (
          <div
            className="absolute top-0 bottom-0 w-px"
            style={{
              left: '50%',
              backgroundColor: `${color}33`,
            }}
          />
        )

        if (isAlternate) {
          return (
            <div key={idx} className="relative flex min-h-[60px]">
              {axis}
              {dot}
              {/* 左右交替布局 */}
              <div className={cn('w-1/2 pr-8', isLeft ? 'text-right' : 'opacity-0')}>
                {isLeft && content}
              </div>
              <div className={cn('w-1/2 pl-8', !isLeft ? '' : 'opacity-0')}>
                {!isLeft && content}
              </div>
            </div>
          )
        }

        // 单边布局
        return (
          <div key={idx} className="relative flex min-h-[60px] pl-6">
            {/* 主轴 */}
            <div
              className="absolute top-0 bottom-0 w-px bg-cyber-border"
              style={{ left: '5px', backgroundColor: `${color}33` }}
            />
            {/* 圆点 */}
            <div
              className="absolute w-3 h-3 rounded-full border-2 z-10 flex items-center justify-center"
              style={{
                backgroundColor: color,
                borderColor: color,
                boxShadow: `0 0 8px ${color}99`,
                left: '0',
                top: '4px',
              }}
            >
              {item.icon && <div className="scale-50 text-white">{item.icon}</div>}
            </div>
            {/* 内容 */}
            <div className="flex-1 pb-4">
              {content}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Timeline
