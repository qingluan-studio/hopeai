import React, { useState, useRef, useEffect } from 'react'
import { X, Eye, EyeOff, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
type InputVariant = 'default' | 'filled' | 'underline'
type InputSize = 'sm' | 'md' | 'lg'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** 输入框变体 */
  variant?: InputVariant
  /** 输入框尺寸 */
  size?: InputSize
  /** 前缀图标 */
  prefixIcon?: React.ReactNode
  /** 后缀图标 */
  suffixIcon?: React.ReactNode
  /** 是否可清除 */
  clearable?: boolean
  /** 是否为密码框（支持显示/隐藏） */
  showPasswordToggle?: boolean
  /** 错误状态 */
  error?: boolean
  /** 错误提示文字 */
  errorMessage?: string
  /** 外层容器类名 */
  wrapperClassName?: string
}

// ============ 变体样式映射 ============
const variantStyles: Record<InputVariant, string> = {
  default: 'bg-cyber-bg border-cyber-border focus-within:border-cyber-accent/60 hover:border-cyber-accent/30',
  filled: 'bg-cyber-panel border-cyber-panel focus-within:border-cyber-accent/60 hover:bg-cyber-panel/80',
  underline: 'bg-transparent border-x-0 border-t-0 border-b-cyber-border focus-within:border-b-cyber-accent rounded-none px-0',
}

// ============ 尺寸样式映射 ============
const sizeStyles: Record<InputSize, string> = {
  sm: 'h-7 px-2 text-xs gap-1.5 rounded-md',
  md: 'h-10 px-3 text-sm gap-2 rounded-lg',
  lg: 'h-12 px-4 text-base gap-2.5 rounded-xl',
}

/**
 * Cyber 终端风格输入框组件
 * - 支持 3 种变体：default / filled / underline
 * - 支持 3 种尺寸：sm / md / lg
 * - 支持前缀/后缀图标
 * - 支持清除按钮
 * - 支持密码显示/隐藏切换
 * - 错误状态 + 错误提示
 */
export function Input({
  variant = 'default',
  size = 'md',
  prefixIcon,
  suffixIcon,
  clearable = false,
  showPasswordToggle = false,
  error = false,
  errorMessage,
  wrapperClassName,
  className,
  type,
  value,
  defaultValue,
  onChange,
  disabled,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const inputRef = useRef<HTMLInputElement>(null)

  // 判断是否受控
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(e.target.value)
    }
    onChange?.(e)
  }

  // 清除内容
  const handleClear = () => {
    if (!isControlled) {
      setInternalValue('')
    }
    const event = { target: { value: '' } } as React.ChangeEvent<HTMLInputElement>
    onChange?.(event)
    inputRef.current?.focus()
  }

  // 切换密码显示
  const togglePassword = () => {
    setShowPassword(!showPassword)
  }

  // 确定输入框类型
  const inputType = showPasswordToggle
    ? showPassword
      ? 'text'
      : 'password'
    : type

  return (
    <div className={cn('w-full', wrapperClassName)}>
      <div
        className={cn(
          'flex items-center w-full border transition-all duration-200 font-mono',
          'focus-within:ring-2 focus-within:ring-cyber-accent/20',
          variantStyles[variant],
          sizeStyles[size],
          error && 'border-red-500/60 focus-within:border-red-500 focus-within:ring-red-500/20',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        {/* 前缀图标 */}
        {prefixIcon && (
          <span className="flex-shrink-0 text-gray-500">{prefixIcon}</span>
        )}

        {/* 输入框本体 */}
        <input
          ref={inputRef}
          type={inputType}
          value={currentValue}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            'flex-1 bg-transparent outline-none min-w-0 placeholder:text-gray-600 text-cyber-text',
            variant === 'underline' && 'px-0'
          )}
          {...props}
        />

        {/* 清除按钮 */}
        {clearable && currentValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="flex-shrink-0 text-gray-500 hover:text-cyber-text transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* 密码显示切换 */}
        {showPasswordToggle && !disabled && (
          <button
            type="button"
            onClick={togglePassword}
            className="flex-shrink-0 text-gray-500 hover:text-cyber-text transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}

        {/* 后缀图标 */}
        {suffixIcon && !showPasswordToggle && !clearable && (
          <span className="flex-shrink-0 text-gray-500">{suffixIcon}</span>
        )}
      </div>

      {/* 错误提示 */}
      {error && errorMessage && (
        <p className="mt-1 text-xs text-red-400 font-mono flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
          {errorMessage}
        </p>
      )}
    </div>
  )
}

/** 搜索输入框便捷组件 */
export function SearchInput(props: Omit<InputProps, 'prefixIcon' | 'type'>) {
  return <Input type="text" prefixIcon={<Search className="w-4 h-4" />} {...props} />
}

export default Input
