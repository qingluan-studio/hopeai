import React, { useState, useRef, useEffect, useMemo } from 'react'
import { ChevronDown, X, Check, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
interface SelectOption {
  /** 选项值 */
  value: string | number
  /** 选项标签 */
  label: React.ReactNode
  /** 是否禁用 */
  disabled?: boolean
  /** 自定义渲染 */
  render?: (option: SelectOption) => React.ReactNode
}

interface SelectProps {
  /** 选项列表 */
  options: SelectOption[]
  /** 当前选中值（受控） */
  value?: string | number | (string | number)[]
  /** 默认选中值 */
  defaultValue?: string | number | (string | number)[]
  /** 是否多选 */
  multiple?: boolean
  /** 是否可搜索 */
  searchable?: boolean
  /** 占位符 */
  placeholder?: string
  /** 禁用状态 */
  disabled?: boolean
  /** 是否可清除 */
  clearable?: boolean
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg'
  /** 变化回调 */
  onChange?: (value: any) => void
  /** 自定义选项渲染 */
  optionRender?: (option: SelectOption) => React.ReactNode
  /** 自定义类名 */
  className?: string
  /** 下拉菜单类名 */
  dropdownClassName?: string
}

/**
 * Cyber 终端风格下拉选择组件
 * - 单选 / 多选
 * - 搜索过滤
 * - 自定义选项渲染
 * - 清除按钮
 * - 键盘操作支持
 */
export function Select({
  options,
  value,
  defaultValue,
  multiple = false,
  searchable = false,
  placeholder = '请选择',
  disabled = false,
  clearable = true,
  size = 'md',
  onChange,
  optionRender,
  className,
  dropdownClassName,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [internalValue, setInternalValue] = useState<any>(
    defaultValue ?? (multiple ? [] : '')
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  // 尺寸样式
  const sizeStyles = {
    sm: 'h-7 px-2 text-xs',
    md: 'h-10 px-3 text-sm',
    lg: 'h-12 px-4 text-base',
  }

  // 过滤选项
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchText) return options
    return options.filter((opt) =>
      String(opt.label).toLowerCase().includes(searchText.toLowerCase())
    )
  }, [options, searchText, searchable])

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSearchText('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 打开时聚焦搜索框
  useEffect(() => {
    if (isOpen && searchable) {
      inputRef.current?.focus()
    }
  }, [isOpen, searchable])

  // 判断是否选中
  const isSelected = (optValue: string | number) => {
    if (multiple) {
      return Array.isArray(currentValue) && currentValue.includes(optValue)
    }
    return currentValue === optValue
  }

  // 获取选中的标签
  const getSelectedLabel = (): React.ReactNode => {
    if (multiple) {
      const selectedOptions = options.filter((opt) =>
        Array.isArray(currentValue) && currentValue.includes(opt.value)
      )
      if (selectedOptions.length === 0) return null
      return (
        <div className="flex flex-wrap gap-1 flex-1 min-w-0">
          {selectedOptions.map((opt) => (
            <span
              key={opt.value}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/40 rounded font-mono"
            >
              {opt.label}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelect(opt.value)
                }}
                className="hover:text-white"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      )
    }

    const selected = options.find((opt) => opt.value === currentValue)
    return selected ? selected.label : null
  }

  // 处理选择
  const handleSelect = (optValue: string | number) => {
    const option = options.find((o) => o.value === optValue)
    if (option?.disabled) return

    let newValue: any
    if (multiple) {
      const arr = Array.isArray(currentValue) ? [...currentValue] : []
      const index = arr.indexOf(optValue)
      if (index > -1) {
        arr.splice(index, 1)
      } else {
        arr.push(optValue)
      }
      newValue = arr
    } else {
      newValue = optValue
      setIsOpen(false)
      setSearchText('')
    }

    if (!isControlled) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }

  // 清除选择
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newValue = multiple ? [] : ''
    if (!isControlled) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
    setSearchText('')
  }

  // 是否有值
  const hasValue = multiple
    ? Array.isArray(currentValue) && currentValue.length > 0
    : currentValue !== '' && currentValue !== undefined && currentValue !== null

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {/* 选择框 */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 w-full bg-cyber-bg border border-cyber-border rounded-lg cursor-pointer',
          'transition-all duration-200 font-mono',
          isOpen
            ? 'border-cyber-accent/60 ring-2 ring-cyber-accent/20'
            : 'hover:border-cyber-accent/30',
          sizeStyles[size],
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        {/* 搜索框（可搜索模式） */}
        {searchable && isOpen ? (
          <input
            ref={inputRef}
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none min-w-0 text-cyber-text placeholder:text-gray-600"
          />
        ) : (
          <div className="flex-1 min-w-0 flex items-center">
            {hasValue ? (
              getSelectedLabel()
            ) : (
              <span className="text-gray-600 truncate">{placeholder}</span>
            )}
          </div>
        )}

        {/* 右侧操作区 */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {clearable && hasValue && !disabled && (
            <button
              onClick={handleClear}
              className="text-gray-500 hover:text-gray-300 transition-colors p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <ChevronDown
            className={cn(
              'w-4 h-4 text-gray-500 transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
        </div>
      </div>

      {/* 下拉菜单 */}
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 w-full mt-1 bg-cyber-panel border border-cyber-border rounded-lg overflow-hidden',
            'shadow-[0_0_20px_rgba(0,255,136,0.1)]',
            'animate-fadeIn',
            dropdownClassName
          )}
        >
          {/* 搜索结果为空 */}
          {filteredOptions.length === 0 && (
            <div className="py-6 text-center text-xs text-gray-500">
              无匹配选项
            </div>
          )}

          {/* 选项列表 */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.map((option) => {
              const selected = isSelected(option.value)
              return (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors font-mono',
                    option.disabled
                      ? 'text-gray-600 cursor-not-allowed opacity-50'
                      : selected
                      ? 'bg-cyber-accent/10 text-cyber-accent'
                      : 'text-cyber-text hover:bg-cyber-accent/5'
                  )}
                >
                  <div className="flex-1 min-w-0 truncate">
                    {optionRender ? optionRender(option) : option.label}
                  </div>
                  {selected && <Check className="w-4 h-4 flex-shrink-0" />}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Select
