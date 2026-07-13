import React, { useState } from 'react'
import { X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
type TagColor = 'cyber' | 'cyan' | 'purple' | 'pink' | 'amber' | 'red' | 'green' | 'blue' | 'gray'

interface TagProps {
  /** 标签颜色 */
  color?: TagColor
  /** 是否可关闭 */
  closable?: boolean
  /** 是否可选中 */
  checkable?: boolean
  /** 是否选中（受控） */
  checked?: boolean
  /** 默认选中状态 */
  defaultChecked?: boolean
  /** 关闭回调 */
  onClose?: () => void
  /** 选中变化回调 */
  onChange?: (checked: boolean) => void
  /** 前置图标 */
  icon?: React.ReactNode
  /** 标签内容 */
  children?: React.ReactNode
  /** 自定义类名 */
  className?: string
}

// ============ 颜色样式映射 ============
const colorStyles: Record<TagColor, { bg: string; text: string; border: string; hover: string }> = {
  cyber: {
    bg: 'bg-cyber-accent/15',
    text: 'text-cyber-accent',
    border: 'border-cyber-accent/40',
    hover: 'hover:bg-cyber-accent/25 hover:border-cyber-accent/60',
  },
  cyan: {
    bg: 'bg-cyan-500/15',
    text: 'text-cyan-400',
    border: 'border-cyan-500/40',
    hover: 'hover:bg-cyan-500/25 hover:border-cyan-500/60',
  },
  purple: {
    bg: 'bg-purple-500/15',
    text: 'text-purple-400',
    border: 'border-purple-500/40',
    hover: 'hover:bg-purple-500/25 hover:border-purple-500/60',
  },
  pink: {
    bg: 'bg-pink-500/15',
    text: 'text-pink-400',
    border: 'border-pink-500/40',
    hover: 'hover:bg-pink-500/25 hover:border-pink-500/60',
  },
  amber: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/40',
    hover: 'hover:bg-amber-500/25 hover:border-amber-500/60',
  },
  red: {
    bg: 'bg-red-500/15',
    text: 'text-red-400',
    border: 'border-red-500/40',
    hover: 'hover:bg-red-500/25 hover:border-red-500/60',
  },
  green: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/40',
    hover: 'hover:bg-emerald-500/25 hover:border-emerald-500/60',
  },
  blue: {
    bg: 'bg-blue-500/15',
    text: 'text-blue-400',
    border: 'border-blue-500/40',
    hover: 'hover:bg-blue-500/25 hover:border-blue-500/60',
  },
  gray: {
    bg: 'bg-gray-500/15',
    text: 'text-gray-400',
    border: 'border-gray-500/40',
    hover: 'hover:bg-gray-500/25 hover:border-gray-500/60',
  },
}

/**
 * Cyber 终端风格标签组件
 * - 9 种 cyber 配色
 * - 可关闭
 * - 可选中
 * - 前置图标
 */
export function Tag({
  color = 'cyber',
  closable = false,
  checkable = false,
  checked,
  defaultChecked = false,
  onClose,
  onChange,
  icon,
  children,
  className,
}: TagProps) {
  const [visible, setVisible] = useState(true)
  const [internalChecked, setInternalChecked] = useState(defaultChecked)

  const isControlled = checked !== undefined
  const isChecked = isControlled ? checked : internalChecked
  const styles = colorStyles[color]

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    setVisible(false)
    onClose?.()
  }

  const handleClick = () => {
    if (checkable) {
      const newChecked = !isChecked
      if (!isControlled) {
        setInternalChecked(newChecked)
      }
      onChange?.(newChecked)
    }
  }

  if (!visible) return null

  return (
    <span
      onClick={handleClick}
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono border rounded-md',
        'transition-all duration-200',
        styles.bg,
        styles.text,
        styles.border,
        checkable && 'cursor-pointer',
        checkable && !isChecked && 'opacity-60',
        checkable && styles.hover,
        className
      )}
    >
      {/* 选中状态图标 */}
      {checkable && isChecked && (
        <Check className="w-3 h-3 flex-shrink-0" />
      )}

      {/* 前置图标 */}
      {icon && <span className="flex-shrink-0">{icon}</span>}

      {/* 标签内容 */}
      {children}

      {/* 关闭按钮 */}
      {closable && (
        <button
          onClick={handleClose}
          className={cn(
            'flex-shrink-0 -mr-0.5 rounded hover:bg-white/10 transition-colors',
            'p-0.5'
          )}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  )
}

export default Tag
