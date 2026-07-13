import React, { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
type DropdownTrigger = 'hover' | 'click'
type DropdownPlacement =
  | 'bottom' | 'bottom-left' | 'bottom-right'
  | 'top' | 'top-left' | 'top-right'

interface DropdownItem {
  /** 唯一 key */
  key: string
  /** 标签 */
  label: React.ReactNode
  /** 图标 */
  icon?: React.ReactNode
  /** 是否禁用 */
  disabled?: boolean
  /** 是否分隔线 */
  divider?: boolean
  /** 点击回调 */
  onClick?: () => void
}

interface DropdownProps {
  /** 菜单项 */
  items: DropdownItem[]
  /** 触发方式 */
  trigger?: DropdownTrigger
  /** 弹出位置 */
  placement?: DropdownPlacement
  /** 触发元素 */
  children: React.ReactNode
  /** 是否禁用 */
  disabled?: boolean
  /** 自定义类名 */
  className?: string
  /** 菜单类名 */
  menuClassName?: string
  /** 悬浮延迟（毫秒） */
  hoverDelay?: number
}

// ============ 位置样式映射 ============
const placementStyles: Record<DropdownPlacement, string> = {
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-1',
  'bottom-left': 'top-full left-0 mt-1',
  'bottom-right': 'top-full right-0 mt-1',
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-1',
  'top-left': 'bottom-full left-0 mb-1',
  'top-right': 'bottom-full right-0 mb-1',
}

/**
 * Cyber 终端风格下拉菜单
 * - 触发方式：hover / click
 * - 弹出位置：6 个方向
 * - 分隔线、禁用项
 * - 点击外部关闭
 */
export function Dropdown({
  items,
  trigger = 'click',
  placement = 'bottom-left',
  children,
  disabled = false,
  className,
  menuClassName,
  hoverDelay = 100,
}: DropdownProps) {
  const [visible, setVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 显示菜单
  const show = useCallback(() => {
    if (disabled) return
    if (timerRef.current) clearTimeout(timerRef.current)
    if (trigger === 'hover') {
      timerRef.current = setTimeout(() => setVisible(true), hoverDelay)
    } else {
      setVisible(true)
    }
  }, [disabled, trigger, hoverDelay])

  // 隐藏菜单
  const hide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (trigger === 'hover') {
      timerRef.current = setTimeout(() => setVisible(false), 100)
    } else {
      setVisible(false)
    }
  }, [trigger])

  // 切换菜单
  const toggle = () => {
    if (disabled) return
    visible ? hide() : show()
  }

  // 点击外部关闭
  useEffect(() => {
    if (!visible) return
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setVisible(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [visible])

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  // 处理菜单项点击
  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled || item.divider) return
    item.onClick?.()
    setVisible(false)
  }

  // 触发器事件
  const triggerProps =
    trigger === 'hover'
      ? { onMouseEnter: show, onMouseLeave: hide }
      : { onClick: toggle }

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)} {...triggerProps}>
      {children}

      {/* 下拉菜单 */}
      {visible && (
        <div
          className={cn(
            'absolute z-50 min-w-[160px] py-1 bg-cyber-panel border border-cyber-border rounded-lg',
            'shadow-[0_0_20px_rgba(0,255,136,0.15)] animate-scaleIn origin-top',
            placementStyles[placement],
            menuClassName
          )}
        >
          {/* 顶部扫描线 */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-accent/40 to-transparent" />
          {items.map((item) => {
            if (item.divider) {
              return <div key={item.key} className="my-1 h-px bg-cyber-border/60" />
            }
            return (
              <div
                key={item.key}
                onClick={() => handleItemClick(item)}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 text-sm font-mono cursor-pointer transition-colors',
                  item.disabled
                    ? 'text-gray-600 cursor-not-allowed opacity-50'
                    : 'text-cyber-text hover:bg-cyber-accent/10 hover:text-cyber-accent'
                )}
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                <span className="flex-1">{item.label}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Dropdown
