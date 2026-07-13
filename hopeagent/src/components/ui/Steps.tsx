import React, { useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
interface StepItem {
  /** 标题 */
  title: React.ReactNode
  /** 描述 */
  description?: React.ReactNode
  /** 图标 */
  icon?: React.ReactNode
  /** 状态覆盖 */
  status?: 'wait' | 'process' | 'finish' | 'error'
}

interface StepsProps {
  /** 步骤列表 */
  items: StepItem[]
  /** 当前步骤（受控） */
  current?: number
  /** 默认当前步骤 */
  defaultCurrent?: number
  /** 方向 */
  direction?: 'horizontal' | 'vertical'
  /** 是否可点击切换 */
  clickable?: boolean
  /** 切换回调 */
  onChange?: (current: number) => void
  /** 自定义类名 */
  className?: string
}

// ============ 状态样式映射 ============
const statusStyles = {
  wait: 'border-cyber-border bg-cyber-panel text-gray-500',
  process: 'border-cyber-accent bg-cyber-accent/20 text-cyber-accent shadow-[0_0_15px_rgba(0,255,136,0.4)]',
  finish: 'border-cyber-accent/50 bg-cyber-accent/10 text-cyber-accent',
  error: 'border-red-500 bg-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]',
}

const titleStyles = {
  wait: 'text-gray-500',
  process: 'text-cyber-accent',
  finish: 'text-cyber-text',
  error: 'text-red-400',
}

/**
 * Cyber 终端风格步骤条
 * - 横向 / 竖向
 * - 可点击切换
 * - 4 种状态：wait / process / finish / error
 */
export function Steps({
  items,
  current,
  defaultCurrent = 0,
  direction = 'horizontal',
  clickable = false,
  onChange,
  className,
}: StepsProps) {
  const [internalCurrent, setInternalCurrent] = useState(defaultCurrent)
  const isControlled = current !== undefined
  const currentStep = isControlled ? current! : internalCurrent

  // 获取每步状态
  const getStatus = (idx: number, item: StepItem): 'wait' | 'process' | 'finish' | 'error' => {
    if (item.status) return item.status
    if (idx < currentStep) return 'finish'
    if (idx === currentStep) return 'process'
    return 'wait'
  }

  // 点击步骤
  const handleClick = (idx: number) => {
    if (!clickable) return
    if (!isControlled) setInternalCurrent(idx)
    onChange?.(idx)
  }

  const isVertical = direction === 'vertical'

  return (
    <div
      className={cn(
        isVertical ? 'flex flex-col' : 'flex items-start',
        className
      )}
    >
      {items.map((item, idx) => {
        const status = getStatus(idx, item)
        const isLast = idx === items.length - 1

        return (
          <div
            key={idx}
            className={cn(
              'flex',
              isVertical ? 'flex-row min-h-[60px]' : 'flex-col items-center flex-1',
              isVertical && !isLast && 'pb-2'
            )}
          >
            <div className={cn('flex', isVertical ? 'flex-row' : 'w-full')}>
              {/* 步骤圆圈 */}
              <button
                onClick={() => handleClick(idx)}
                disabled={!clickable}
                className={cn(
                  'flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border-2 font-mono text-xs font-bold transition-all',
                  statusStyles[status],
                  clickable && 'cursor-pointer hover:scale-110'
                )}
              >
                {status === 'finish' ? (
                  <Check className="w-4 h-4" />
                ) : status === 'error' ? (
                  '!'
                ) : item.icon ? (
                  item.icon
                ) : (
                  idx + 1
                )}
              </button>

              {/* 步骤信息 */}
              <div className={cn(isVertical ? 'ml-3 flex-1' : 'mt-2 text-center')}>
                <div className={cn('text-sm font-mono font-bold', titleStyles[status])}>
                  {item.title}
                </div>
                {item.description && (
                  <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                )}
              </div>
            </div>

            {/* 连接线 */}
            {!isLast && (
              isVertical ? (
                <div className="ml-4 w-px flex-1 my-1 bg-gradient-to-b from-cyber-accent/30 to-cyber-border" />
              ) : (
                <div className="absolute" />
              )
            )}

            {/* 横向连接线 */}
            {!isVertical && !isLast && (
              <div className="hidden" />
            )}
          </div>
        )
      })}

      {/* 横向连接线层 */}
      {!isVertical && items.length > 1 && (
        <div className="hidden" />
      )}
    </div>
  )
}

export default Steps
