import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
type TooltipPlacement =
  | 'top'
  | 'top-left'
  | 'top-right'
  | 'bottom'
  | 'bottom-left'
  | 'bottom-right'
  | 'left'
  | 'left-top'
  | 'left-bottom'
  | 'right'
  | 'right-top'
  | 'right-bottom'

interface TooltipProps {
  /** 提示内容 */
  content: React.ReactNode
  /** 触发方式 */
  trigger?: 'hover' | 'click'
  /** 位置 */
  placement?: TooltipPlacement
  /** 子元素（被包裹的元素） */
  children: React.ReactNode
  /** 是否禁用 */
  disabled?: boolean
  /** 显示延迟（毫秒） */
  delay?: number
  /** 自定义类名 */
  className?: string
  /** 箭头是否显示 */
  arrow?: boolean
}

// ============ 位置样式映射 ============
const placementStyles: Record<TooltipPlacement, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  'top-left': 'bottom-full left-0 mb-2',
  'top-right': 'bottom-full right-0 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  'bottom-left': 'top-full left-0 mt-2',
  'bottom-right': 'top-full right-0 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  'left-top': 'right-full top-0 mr-2',
  'left-bottom': 'right-full bottom-0 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  'right-top': 'left-full top-0 ml-2',
  'right-bottom': 'left-full bottom-0 ml-2',
}

/**
 * Cyber 终端风格 Tooltip 组件
 * - 悬浮提示
 * - 12 个方向
 * - 淡入淡出动画
 * - 禁用状态
 * - 点击/悬浮触发
 */
export function Tooltip({
  content,
  trigger = 'hover',
  placement = 'top',
  children,
  disabled = false,
  delay = 100,
  className,
  arrow = true,
}: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = () => {
    if (disabled) return
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setVisible(true)
    }, delay)
  }

  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setVisible(false)
    }, 50)
  }

  const handleClick = () => {
    if (trigger === 'click') {
      setVisible(!visible)
    }
  }

  // 点击外部关闭（click 模式）
  useEffect(() => {
    if (trigger !== 'click' || !visible) return

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setVisible(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [visible, trigger])

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const triggerProps = trigger === 'hover'
    ? { onMouseEnter: show, onMouseLeave: hide }
    : { onClick: handleClick }

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      {...triggerProps}
    >
      {children}

      {/* Tooltip 内容 */}
      {visible && (
        <div
          className={cn(
            'absolute z-50 px-2.5 py-1.5 text-xs font-mono text-cyber-text',
            'bg-cyber-panel border border-cyber-accent/30 rounded-md',
            'shadow-[0_0_15px_rgba(0,255,136,0.15)]',
            'whitespace-nowrap animate-fadeIn',
            placementStyles[placement],
            className
          )}
        >
          {/* 箭头 */}
          {arrow && (
            <div
              className={cn(
                'absolute w-2 h-2 bg-cyber-panel border border-cyber-accent/30 rotate-45',
                placement.startsWith('top') && 'top-full left-1/2 -translate-x-1/2 -mt-1 border-t-0 border-l-0',
                placement.startsWith('bottom') && 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-b-0 border-r-0',
                placement.startsWith('left') && 'left-full top-1/2 -translate-y-1/2 -ml-1 border-b-0 border-l-0',
                placement.startsWith('right') && 'right-full top-1/2 -translate-y-1/2 -mr-1 border-t-0 border-r-0'
              )}
            />
          )}
          {content}
        </div>
      )}
    </div>
  )
}

export default Tooltip
