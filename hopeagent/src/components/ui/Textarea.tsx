import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'resize'> {
  /** 是否自动调整高度 */
  autoSize?: boolean
  /** 最小行数 */
  minRows?: number
  /** 最大行数 */
  maxRows?: number
  /** 是否显示字数统计 */
  showCount?: boolean
  /** 最大字数 */
  maxLength?: number
  /** resize 方向 */
  resize?: 'none' | 'both' | 'horizontal' | 'vertical'
  /** 错误状态 */
  error?: boolean
  /** 外层容器类名 */
  wrapperClassName?: string
}

/**
 * Cyber 终端风格文本域组件
 * - 自动高度调整
 * - 最大行数限制
 * - 字数统计显示
 * - 支持 resize 控制
 * - 错误状态
 */
export function Textarea({
  autoSize = false,
  minRows = 3,
  maxRows = 6,
  showCount = false,
  maxLength,
  resize = 'none',
  error = false,
  wrapperClassName,
  className,
  value,
  defaultValue,
  onChange,
  disabled,
  style,
  ...props
}: TextareaProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 判断是否受控
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue
  const charCount = String(currentValue).length

  // 自动调整高度
  useEffect(() => {
    if (autoSize && textareaRef.current) {
      const textarea = textareaRef.current
      textarea.style.height = 'auto'

      const lineHeight = 20
      const minHeight = minRows * lineHeight + 16
      const maxHeight = maxRows * lineHeight + 16

      let newHeight = textarea.scrollHeight
      newHeight = Math.max(newHeight, minHeight)
      newHeight = Math.min(newHeight, maxHeight)

      textarea.style.height = `${newHeight}px`
    }
  }, [currentValue, autoSize, minRows, maxRows])

  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) {
      setInternalValue(e.target.value)
    }
    onChange?.(e)
  }

  // resize 样式映射
  const resizeMap: Record<string, string> = {
    none: 'resize-none',
    both: 'resize',
    horizontal: 'resize-x',
    vertical: 'resize-y',
  }

  return (
    <div className={cn('w-full relative', wrapperClassName)}>
      <textarea
        ref={textareaRef}
        value={currentValue}
        onChange={handleChange}
        disabled={disabled}
        maxLength={maxLength}
        rows={minRows}
        className={cn(
          'w-full px-3 py-2 bg-cyber-bg border border-cyber-border rounded-lg',
          'text-sm text-cyber-text font-mono placeholder:text-gray-600',
          'focus:outline-none focus:border-cyber-accent/60 focus:ring-2 focus:ring-cyber-accent/20',
          'hover:border-cyber-accent/30 transition-all duration-200',
          resizeMap[resize],
          error && 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        style={autoSize ? { ...style, overflow: 'hidden' } : style}
        {...props}
      />

      {/* 字数统计 */}
      {showCount && (
        <div className="absolute bottom-2 right-3 text-[10px] font-mono text-gray-600 flex items-center gap-1">
          <span className={cn(charCount > (maxLength || Infinity) * 0.9 && 'text-amber-400')}>
            {charCount}
          </span>
          {maxLength && (
            <>
              <span>/</span>
              <span>{maxLength}</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default Textarea
