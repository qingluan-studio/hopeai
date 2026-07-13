import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
type PopoverPlacement =
  | 'top' | 'top-left' | 'top-right'
  | 'bottom' | 'bottom-left' | 'bottom-right'
  | 'left' | 'left-top' | 'left-bottom'
  | 'right' | 'right-top' | 'right-bottom'

interface PopoverProps {
  /** 标题 */
  title?: React.ReactNode
  /** 内容 */
  content: React.ReactNode
  /** 触发方式 */
  trigger?: 'hover' | 'click' | 'focus'
  /** 位置 */
  placement?: PopoverPlacement
  /** 子元素 */
  children: React.ReactNode
  /** 是否禁用 */
  disabled?: boolean
  /** 自定义类名 */
  className?: string
  /** 内容类名 */
  contentClassName?: string
  /** 是否显示箭头 */
  arrow?: boolean
  /** 宽度 */
  width?: number | string
}

// ============ 位置样式映射 ============
const placementStyles: Record<PopoverPlacement, string> = {
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

// ============ 箭头位置样式 ============
const arrowStyles: Record<string, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 -mt-1 border-t-0 border-l-0',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-b-0 border-r-0',
  left: 'left-full top-1/2 -translate-y-1/2 -ml-1 border-b-0 border-l-0',
  right: 'right-full top-1/2 -translate-y-1/2 -mr-1 border-t-0 border-r-0',
}

/**
 * Cyber 终端风格气泡卡片
 * - 触发方式：hover / click / focus
 * - 12 个方向
 * - 标题 + 内容
 */
export function Popover({
  title,
  content,
  trigger = 'hover',
  placement = 'top',
  children,
  disabled = false,
  className,
  contentClassName,
  arrow = true,
  width,
}: PopoverProps) {
  const [visible, setVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 显示
  const show = () => {
    if (disabled) return
    if (timerRef.current) clearTimeout(timerRef.current)
    setVisible(true)
  }

  // 隐藏
  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setVisible(false), 100)
  }

  // 切换
  const toggle = () => {
    if (disabled) return
    setVisible(!visible)
  }

  // 点击外部关闭
  useEffect(() => {
    if (trigger !== 'click' || !visible) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setVisible(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [trigger, visible])

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  // 触发事件
  const triggerProps =
    trigger === 'hover'
      ? { onMouseEnter: show, onMouseLeave: hide }
      : trigger === 'focus'
      ? { onFocus: show, onBlur: hide }
      : { onClick: toggle }

  // 箭头方向
  const arrowDir = placement.split('-')[0]

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)} {...triggerProps}>
      {children}

      {/* 气泡 */}
      {visible && (
        <div
          className={cn(
            'absolute z-50 bg-cyber-panel border border-cyber-accent/30 rounded-lg',
            'shadow-[0_0_20px_rgba(0,255,136,0.15)] animate-scaleIn',
            placementStyles[placement],
            contentClassName
          )}
          style={{ width: typeof width === 'number' ? `${width}px` : width }}
        >
          {/* 顶部扫描线 */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-accent/50 to-transparent" />

          {/* 箭头 */}
          {arrow && (
            <div
              className={cn(
                'absolute w-2 h-2 bg-cyber-panel border border-cyber-accent/30 rotate-45',
                arrowStyles[arrowDir]
              )}
            />
          )}

          {/* 标题 */}
          {title && (
            <div className="px-3 py-2 border-b border-cyber-border/50 text-sm font-mono font-bold text-cyber-accent">
              {title}
            </div>
          )}

          {/* 内容 */}
          <div className="px-3 py-2 text-sm text-cyber-text font-mono">
            {content}
          </div>
        </div>
      )}
    </div>
  )
}

export default Popover
