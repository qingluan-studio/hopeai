import React, { useState, useRef, useEffect } from 'react'
import { Clock as ClockIcon, ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
interface TimePickerProps {
  /** 当前值（受控）HH:MM:SS */
  value?: string
  /** 默认值 */
  defaultValue?: string
  /** 占位符 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否使用 12 小时制 */
  use12Hours?: boolean
  /** 变化回调 */
  onChange?: (value: string) => void
  /** 自定义类名 */
  className?: string
}

// 解析时间字符串
const parseTime = (str?: string): { h: number; m: number; s: number } => {
  if (!str) return { h: 0, m: 0, s: 0 }
  const parts = str.split(':').map(Number)
  return { h: parts[0] || 0, m: parts[1] || 0, s: parts[2] || 0 }
}

// 格式化为两位数
const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Cyber 终端风格时间选择器
 * - 时 / 分 / 秒滚轮
 * - 12 / 24 小时制
 */
export function TimePicker({
  value,
  defaultValue,
  placeholder = '选择时间',
  disabled = false,
  use12Hours = false,
  onChange,
  className,
}: TimePickerProps) {
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue)
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const [open, setOpen] = useState(false)
  const { h, m, s } = parseTime(currentValue)
  const containerRef = useRef<HTMLDivElement>(null)

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

  // 设置某个字段
  const setField = (field: 'h' | 'm' | 's', val: number) => {
    const max = field === 'h' ? (use12Hours ? 12 : 23) : 59
    const min = field === 'h' && use12Hours ? 1 : 0
    const v = Math.max(min, Math.min(max, val))
    const next = field === 'h'
      ? `${pad(v)}:${pad(m)}:${pad(s)}`
      : field === 'm'
      ? `${pad(h)}:${pad(v)}:${pad(s)}`
      : `${pad(h)}:${pad(m)}:${pad(v)}`
    if (!isControlled) setInternalValue(next)
    onChange?.(next)
  }

  // 滚轮列
  const Column = ({ field, val, max }: { field: 'h' | 'm' | 's'; val: number; max: number }) => {
    const items = Array.from({ length: max + 1 }, (_, i) => i)
    return (
      <div className="flex flex-col items-center">
        <button onClick={() => setField(field, val + 1)} className="text-gray-500 hover:text-cyber-accent p-0.5">
          <ChevronUp className="w-3 h-3" />
        </button>
        <div className="h-24 w-10 overflow-y-auto scrollbar-hide flex flex-col items-center py-1">
          {items.map((i) => (
            <button
              key={i}
              onClick={() => setField(field, i)}
              className={cn(
                'w-8 h-6 text-xs font-mono rounded transition-colors',
                i === val
                  ? 'bg-cyber-accent/20 text-cyber-accent border border-cyber-accent shadow-[0_0_8px_rgba(0,255,136,0.3)]'
                  : 'text-gray-400 hover:text-cyber-text hover:bg-white/5'
              )}
            >
              {pad(i)}
            </button>
          ))}
        </div>
        <button onClick={() => setField(field, val - 1)} className="text-gray-500 hover:text-cyber-accent p-0.5">
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      {/* 触发器 */}
      <div
        onClick={() => !disabled && setOpen(!open)}
        className={cn(
          'flex items-center gap-2 h-10 px-3 bg-cyber-bg border border-cyber-border rounded-lg cursor-pointer font-mono text-sm transition-all',
          open ? 'border-cyber-accent/60 ring-2 ring-cyber-accent/20' : 'hover:border-cyber-accent/30',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <ClockIcon className="w-4 h-4 text-cyber-accent flex-shrink-0" />
        <span className={cn('flex-1', !currentValue && 'text-gray-600')}>
          {currentValue || placeholder}
        </span>
      </div>

      {/* 滚轮面板 */}
      {open && (
        <div className="absolute z-50 mt-1 p-3 bg-cyber-panel border border-cyber-border rounded-lg shadow-[0_0_25px_rgba(0,255,136,0.15)] animate-scaleIn origin-top">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-accent/50 to-transparent" />
          <div className="flex items-center gap-1">
            <Column field="h" val={h} max={use12Hours ? 12 : 23} />
            <span className="text-cyber-accent font-mono">:</span>
            <Column field="m" val={m} max={59} />
            <span className="text-cyber-accent font-mono">:</span>
            <Column field="s" val={s} max={59} />
          </div>
        </div>
      )}
    </div>
  )
}

export default TimePicker
