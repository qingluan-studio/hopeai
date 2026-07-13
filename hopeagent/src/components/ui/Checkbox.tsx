import React, { useState } from 'react'
import { Check, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
interface CheckboxProps {
  /** 是否选中（受控） */
  checked?: boolean
  /** 默认是否选中 */
  defaultChecked?: boolean
  /** 不确定状态 */
  indeterminate?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 标签 */
  label?: React.ReactNode
  /** 变化回调 */
  onChange?: (checked: boolean) => void
  /** 自定义类名 */
  className?: string
}

interface CheckboxGroupProps {
  /** 可选项 */
  options: { label: React.ReactNode; value: string | number; disabled?: boolean }[]
  /** 当前选中值（受控） */
  value?: (string | number)[]
  /** 默认选中值 */
  defaultValue?: (string | number)[]
  /** 是否禁用整个组 */
  disabled?: boolean
  /** 变化回调 */
  onChange?: (value: (string | number)[]) => void
  /** 自定义类名 */
  className?: string
}

/**
 * Cyber 终端风格复选框
 * - 选中 / 不确定 / 未选中
 * - 支持全选
 */
export function Checkbox({
  checked,
  defaultChecked = false,
  indeterminate = false,
  disabled = false,
  label,
  onChange,
  className,
}: CheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked)
  const isControlled = checked !== undefined
  const isChecked = isControlled ? checked : internalChecked

  // 切换选中
  const toggle = () => {
    if (disabled) return
    const next = !isChecked
    if (!isControlled) setInternalChecked(next)
    onChange?.(next)
  }

  // 显示状态：优先 indeterminate
  const showChecked = indeterminate || isChecked

  return (
    <label
      className={cn(
        'inline-flex items-center gap-2 cursor-pointer select-none font-mono text-sm',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      onClick={toggle}
    >
      {/* 框 */}
      <span
        className={cn(
          'flex-shrink-0 w-4 h-4 flex items-center justify-center border rounded transition-all',
          showChecked
            ? 'bg-cyber-accent/20 border-cyber-accent shadow-[0_0_8px_rgba(0,255,136,0.4)]'
            : 'bg-cyber-bg border-cyber-border hover:border-cyber-accent/50'
        )}
      >
        {indeterminate ? (
          <Minus className="w-3 h-3 text-cyber-accent" />
        ) : isChecked ? (
          <Check className="w-3 h-3 text-cyber-accent" />
        ) : null}
      </span>
      {/* 标签 */}
      {label && <span className="text-cyber-text">{label}</span>}
    </label>
  )
}

/**
 * 复选框组（支持全选）
 */
export function CheckboxGroup({
  options,
  value,
  defaultValue = [],
  disabled = false,
  onChange,
  className,
}: CheckboxGroupProps) {
  const [internalValue, setInternalValue] = useState<(string | number)[]>(defaultValue)
  const isControlled = value !== undefined
  const currentValue = isControlled ? value! : internalValue

  // 切换单项
  const toggleItem = (itemValue: string | number) => {
    const next = currentValue.includes(itemValue)
      ? currentValue.filter((v) => v !== itemValue)
      : [...currentValue, itemValue]
    if (!isControlled) setInternalValue(next)
    onChange?.(next)
  }

  // 全选 / 取消全选
  const allChecked = options.every((opt) => currentValue.includes(opt.value))
  const someChecked = options.some((opt) => currentValue.includes(opt.value))

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {/* 全选项 */}
      <Checkbox
        checked={allChecked}
        indeterminate={!allChecked && someChecked}
        disabled={disabled}
        label="全选"
        onChange={() => {
          const next = allChecked ? [] : options.map((o) => o.value)
          if (!isControlled) setInternalValue(next)
          onChange?.(next)
        }}
      />
      <div className="flex flex-col gap-2 pl-6 border-l border-cyber-border/40">
        {options.map((opt) => (
          <Checkbox
            key={opt.value}
            checked={currentValue.includes(opt.value)}
            disabled={disabled || opt.disabled}
            label={opt.label}
            onChange={() => toggleItem(opt.value)}
          />
        ))}
      </div>
    </div>
  )
}

export default Checkbox
