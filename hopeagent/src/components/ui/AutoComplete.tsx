import React, { useState, useRef, useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
interface AutoCompleteOption {
  /** 值 */
  value: string
  /** 标签 */
  label?: React.ReactNode
}

interface AutoCompleteProps {
  /** 当前值（受控） */
  value?: string
  /** 默认值 */
  defaultValue?: string
  /** 选项列表 */
  options?: AutoCompleteOption[]
  /** 远程搜索（返回 Promise） */
  onSearch?: (searchText: string) => void | AutoCompleteOption[] | Promise<AutoCompleteOption[]>
  /** 占位符 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否清空 */
  clearable?: boolean
  /** 选中回调 */
  onSelect?: (value: string, option: AutoCompleteOption) => void
  /** 变化回调 */
  onChange?: (value: string) => void
  /** 自定义类名 */
  className?: string
}

/**
 * Cyber 终端风格自动补全输入框
 * - 本地 / 远程搜索
 * - 键盘导航（上下/回车/ESC）
 */
export function AutoComplete({
  value,
  defaultValue = '',
  options = [],
  onSearch,
  placeholder = '请输入...',
  disabled = false,
  clearable = true,
  onSelect,
  onChange,
  className,
}: AutoCompleteProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [asyncOptions, setAsyncOptions] = useState<AutoCompleteOption[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 当前选项列表
  const currentOptions = useMemo(() => {
    if (onSearch) return asyncOptions
    // 本地过滤
    if (!currentValue) return options
    return options.filter((opt) =>
      opt.value.toLowerCase().includes(currentValue.toLowerCase())
    )
  }, [onSearch, asyncOptions, options, currentValue])

  // 点击外部关闭
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // 处理输入
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    if (!isControlled) setInternalValue(v)
    onChange?.(v)
    setOpen(true)
    setActiveIndex(-1)
    if (onSearch) {
      const result = onSearch(v)
      if (Array.isArray(result)) {
        setAsyncOptions(result)
      } else if (result instanceof Promise) {
        result.then(setAsyncOptions)
      }
    }
  }

  // 选中选项
  const handleSelect = (option: AutoCompleteOption) => {
    if (!isControlled) setInternalValue(option.value)
    onChange?.(option.value)
    onSelect?.(option.value, option)
    setOpen(false)
    inputRef.current?.focus()
  }

  // 键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || currentOptions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) => (prev + 1) % currentOptions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => (prev - 1 + currentOptions.length) % currentOptions.length)
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      handleSelect(currentOptions[activeIndex])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  // 清空
  const handleClear = () => {
    if (!isControlled) setInternalValue('')
    onChange?.('')
    inputRef.current?.focus()
  }

  return (
    <div ref={containerRef} className={cn('relative inline-block w-full', className)}>
      <div
        className={cn(
          'flex items-center h-10 px-3 bg-cyber-bg border border-cyber-border rounded-lg font-mono text-sm transition-all',
          open ? 'border-cyber-accent/60 ring-2 ring-cyber-accent/20' : 'hover:border-cyber-accent/30',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          ref={inputRef}
          type="text"
          value={currentValue}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          disabled={disabled}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-cyber-text placeholder:text-gray-600"
        />
        {clearable && currentValue && !disabled && (
          <button onClick={handleClear} className="text-gray-500 hover:text-cyber-text">
            ✕
          </button>
        )}
      </div>

      {/* 下拉列表 */}
      {open && currentOptions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-cyber-panel border border-cyber-border rounded-lg overflow-hidden shadow-[0_0_20px_rgba(0,255,136,0.15)] animate-scaleIn origin-top">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-accent/40 to-transparent" />
          <div className="max-h-60 overflow-y-auto">
            {currentOptions.map((opt, idx) => (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt)}
                className={cn(
                  'px-3 py-2 text-sm font-mono cursor-pointer transition-colors',
                  idx === activeIndex
                    ? 'bg-cyber-accent/10 text-cyber-accent'
                    : 'text-gray-300 hover:bg-cyber-accent/5 hover:text-cyber-text'
                )}
              >
                {opt.label ?? opt.value}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AutoComplete
