import React, { useState } from 'react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
interface RadioProps {
  /** 是否选中 */
  checked?: boolean
  /** 默认是否选中 */
  defaultChecked?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 标签 */
  label?: React.ReactNode
  /** 值 */
  value?: string | number
  /** 变化回调 */
  onChange?: (checked: boolean) => void
  /** 自定义类名 */
  className?: string
}

interface RadioGroupProps {
  /** 选项 */
  options: { label: React.ReactNode; value: string | number; disabled?: boolean }[]
  /** 当前值 */
  value?: string | number
  /** 默认值 */
  defaultValue?: string | number
  /** 是否禁用 */
  disabled?: boolean
  /** 样式：默认圆点 / 按钮组 */
  variant?: 'default' | 'button'
  /** 变化回调 */
  onChange?: (value: string | number) => void
  /** 自定义类名 */
  className?: string
}

/**
 * Cyber 终端风格单选框
 */
export function Radio({
  checked,
  defaultChecked = false,
  disabled = false,
  label,
  onChange,
  className,
}: RadioProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked)
  const isControlled = checked !== undefined
  const isChecked = isControlled ? checked : internalChecked

  const toggle = () => {
    if (disabled || isChecked) return
    if (!isControlled) setInternalChecked(true)
    onChange?.(true)
  }

  return (
    <label
      className={cn(
        'inline-flex items-center gap-2 cursor-pointer select-none font-mono text-sm',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      onClick={toggle}
    >
      <span
        className={cn(
          'flex-shrink-0 w-4 h-4 flex items-center justify-center border rounded-full transition-all',
          isChecked
            ? 'border-cyber-accent shadow-[0_0_8px_rgba(0,255,136,0.4)]'
            : 'bg-cyber-bg border-cyber-border hover:border-cyber-accent/50'
        )}
      >
        {isChecked && <span className="w-2 h-2 rounded-full bg-cyber-accent" />}
      </span>
      {label && <span className="text-cyber-text">{label}</span>}
    </label>
  )
}

/**
 * 单选框组（支持按钮组样式）
 */
export function RadioGroup({
  options,
  value,
  defaultValue,
  disabled = false,
  variant = 'default',
  onChange,
  className,
}: RadioGroupProps) {
  const [internalValue, setInternalValue] = useState<string | number | undefined>(defaultValue)
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const handleSelect = (itemValue: string | number) => {
    if (disabled) return
    if (!isControlled) setInternalValue(itemValue)
    onChange?.(itemValue)
  }

  // 按钮组样式
  if (variant === 'button') {
    return (
      <div className={cn('inline-flex border border-cyber-border rounded-lg overflow-hidden', className)}>
        {options.map((opt, idx) => {
          const active = currentValue === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              disabled={disabled || opt.disabled}
              className={cn(
                'px-4 py-1.5 text-sm font-mono transition-all border-r border-cyber-border last:border-r-0',
                active
                  ? 'bg-cyber-accent/20 text-cyber-accent shadow-[inset_0_0_10px_rgba(0,255,136,0.2)]'
                  : 'bg-cyber-panel text-gray-400 hover:text-cyber-text hover:bg-cyber-accent/5',
                (disabled || opt.disabled) && 'opacity-50 cursor-not-allowed'
              )}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    )
  }

  // 默认圆点样式
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {options.map((opt) => (
        <Radio
          key={opt.value}
          checked={currentValue === opt.value}
          disabled={disabled || opt.disabled}
          label={opt.label}
          onChange={() => handleSelect(opt.value)}
        />
      ))}
    </div>
  )
}

export default Radio
