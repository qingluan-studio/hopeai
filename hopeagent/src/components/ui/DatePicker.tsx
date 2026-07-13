import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Calendar as CalIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
interface DatePickerProps {
  /** 当前值（受控） */
  value?: Date | null
  /** 默认值 */
  defaultValue?: Date | null
  /** 是否范围选择 */
  range?: boolean
  /** 范围结束值（受控） */
  endValue?: Date | null
  /** 默认结束值 */
  defaultEndValue?: Date | null
  /** 占位符 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 变化回调 */
  onChange?: (value: Date | null, endValue?: Date | null) => void
  /** 自定义类名 */
  className?: string
}

// 格式化日期为 YYYY-MM-DD
const formatDate = (d: Date | null): string => {
  if (!d) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// 判断是否同一天
const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

/**
 * Cyber 终端风格日期选择器
 * - 日历面板
 * - 单选 / 范围选择
 */
export function DatePicker({
  value,
  defaultValue = null,
  range = false,
  endValue,
  defaultEndValue = null,
  placeholder = '选择日期',
  disabled = false,
  onChange,
  className,
}: DatePickerProps) {
  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue)
  const [internalEnd, setInternalEnd] = useState<Date | null>(defaultEndValue)
  const isControlled = value !== undefined
  const isEndControlled = endValue !== undefined
  const currentValue = isControlled ? value : internalValue
  const currentEnd = isEndControlled ? endValue : internalEnd

  const [open, setOpen] = useState(false)
  // 视图月份
  const [viewDate, setViewDate] = useState<Date>(currentValue || new Date())
  // 范围选择临时起点
  const [rangeStart, setRangeStart] = useState<Date | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 点击外部关闭
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setRangeStart(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // 生成日历网格
  const days = useMemo(() => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startOffset = firstDay.getDay()
    const totalDays = lastDay.getDate()
    const cells: (Date | null)[] = []
    for (let i = 0; i < startOffset; i++) cells.push(null)
    for (let d = 1; d <= totalDays; d++) cells.push(new Date(year, month, d))
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
  }, [viewDate])

  // 选择日期
  const handleSelect = (date: Date) => {
    if (range) {
      if (!rangeStart || rangeStart > date) {
        setRangeStart(date)
        if (!isControlled) setInternalValue(date)
        if (!isEndControlled) setInternalEnd(null)
      } else {
        if (!isControlled) setInternalValue(rangeStart)
        if (!isEndControlled) setInternalEnd(date)
        onChange?.(rangeStart, date)
        setRangeStart(null)
        setOpen(false)
      }
    } else {
      if (!isControlled) setInternalValue(date)
      onChange?.(date)
      setOpen(false)
    }
  }

  // 判断是否在范围内
  const inRange = (date: Date) => {
    if (!range) return false
    const start = rangeStart || currentValue
    const end = rangeStart ? null : currentEnd
    if (start && end) return date >= start && date <= end
    return false
  }

  const displayText = range
    ? `${formatDate(currentValue)}${currentEnd ? ` ~ ${formatDate(currentEnd)}` : ''}`
    : formatDate(currentValue)

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
        <CalIcon className="w-4 h-4 text-cyber-accent flex-shrink-0" />
        <span className={cn('flex-1 truncate', !currentValue && 'text-gray-600')}>
          {displayText || placeholder}
        </span>
      </div>

      {/* 日历面板 */}
      {open && (
        <div className="absolute z-50 mt-1 w-72 p-3 bg-cyber-panel border border-cyber-border rounded-lg shadow-[0_0_25px_rgba(0,255,136,0.15)] animate-scaleIn origin-top">
          {/* 顶部扫描线 */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-accent/50 to-transparent" />
          {/* 头部 */}
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} className="p-1 text-gray-400 hover:text-cyber-accent">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-mono font-bold text-cyber-text">
              {viewDate.getFullYear()} / {String(viewDate.getMonth() + 1).padStart(2, '0')}
            </span>
            <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} className="p-1 text-gray-400 hover:text-cyber-accent">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {/* 星期表头 */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {['日', '一', '二', '三', '四', '五', '六'].map((d) => (
              <div key={d} className="text-center text-xs text-gray-500 font-mono">{d}</div>
            ))}
          </div>
          {/* 日期网格 */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, idx) => {
              if (!date) return <div key={idx} />
              const isToday = isSameDay(date, new Date())
              const isSelected = currentValue && isSameDay(date, currentValue)
              const isEnd = currentEnd && isSameDay(date, currentEnd)
              const isInRange = inRange(date)
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(date)}
                  className={cn(
                    'h-8 text-xs font-mono rounded transition-all',
                    (isSelected || isEnd)
                      ? 'bg-cyber-accent/30 text-cyber-accent border border-cyber-accent shadow-[0_0_8px_rgba(0,255,136,0.4)]'
                      : isInRange
                      ? 'bg-cyber-accent/10 text-cyber-accent'
                      : 'text-gray-300 hover:bg-cyber-accent/10 hover:text-cyber-accent',
                    isToday && !isSelected && !isEnd && 'ring-1 ring-cyber-accent/40'
                  )}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default DatePicker
