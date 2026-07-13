import React, { useState } from 'react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
type SwitchSize = 'sm' | 'md'

interface SwitchProps {
  /** 是否选中（受控） */
  checked?: boolean
  /** 默认选中状态 */
  defaultChecked?: boolean
  /** 尺寸 */
  size?: SwitchSize
  /** 禁用状态 */
  disabled?: boolean
  /** 选中时颜色 */
  checkedColor?: string
  /** 未选中时颜色 */
  uncheckedColor?: string
  /** 变化回调 */
  onChange?: (checked: boolean) => void
  /** 点击回调 */
  onClick?: () => void
  /** 自定义类名 */
  className?: string
  /** 选中时的文字/图标 */
  checkedChildren?: React.ReactNode
  /** 未选中时的文字/图标 */
  uncheckedChildren?: React.ReactNode
}

// ============ 尺寸映射 ============
const sizeMap = {
  sm: {
    track: 'w-9 h-5',
    thumb: 'w-4 h-4',
    thumbChecked: 'translate-x-4',
    text: 'text-[8px]',
  },
  md: {
    track: 'w-12 h-6',
    thumb: 'w-5 h-5',
    thumbChecked: 'translate-x-6',
    text: 'text-[10px]',
  },
}

/**
 * Cyber 终端风格开关组件
 * - 开关切换
 * - 尺寸 sm/md
 * - 选中/未选中颜色自定义
 * - 动画效果
 * - 支持文字/图标
 */
export function Switch({
  checked,
  defaultChecked = false,
  size = 'md',
  disabled = false,
  checkedColor = '#00ff88',
  uncheckedColor = '#374151',
  onChange,
  onClick,
  className,
  checkedChildren,
  uncheckedChildren,
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked)

  const isControlled = checked !== undefined
  const isChecked = isControlled ? checked : internalChecked
  const sizes = sizeMap[size]

  const handleToggle = () => {
    if (disabled) return

    const newChecked = !isChecked
    if (!isControlled) {
      setInternalChecked(newChecked)
    }
    onChange?.(newChecked)
    onClick?.()
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      onClick={handleToggle}
      disabled={disabled}
      className={cn(
        'relative inline-flex items-center rounded-full transition-all duration-300',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyber-accent/50',
        sizes.track,
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      style={{
        backgroundColor: isChecked ? checkedColor : uncheckedColor,
        boxShadow: isChecked ? `0 0 15px ${checkedColor}50` : 'none',
      }}
    >
      {/* 内部文字/图标 */}
      <span className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none">
        {checkedChildren && (
          <span
            className={cn(
              'font-mono font-bold transition-opacity duration-200',
              sizes.text,
              isChecked ? 'opacity-100 text-black' : 'opacity-0'
            )}
          >
            {checkedChildren}
          </span>
        )}
        {uncheckedChildren && (
          <span
            className={cn(
              'font-mono font-bold transition-opacity duration-200 ml-auto',
              sizes.text,
              !isChecked ? 'opacity-100 text-gray-400' : 'opacity-0'
            )}
          >
            {uncheckedChildren}
          </span>
        )}
      </span>

      {/* 滑块 */}
      <span
        className={cn(
          'absolute bg-white rounded-full shadow-md transition-all duration-300',
          sizes.thumb,
          isChecked ? sizes.thumbChecked : 'translate-x-0.5'
        )}
        style={{
          boxShadow: isChecked
            ? `0 0 10px ${checkedColor}`
            : '0 2px 4px rgba(0,0,0,0.3)',
        }}
      />
    </button>
  )
}

export default Switch
