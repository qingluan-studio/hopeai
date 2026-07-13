import React, { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
interface CalendarEvent {
  /** 日期 YYYY-MM-DD */
  date: string
  /** 内容 */
  content: React.ReactNode
  /** 颜色 */
  color?: string
}

interface CalendarProps {
  /** 当前月份（受控） */
  value?: Date
  /** 默认月份 */
  defaultValue?: Date
  /** 事件列表 */
  events?: CalendarEvent[]
  /** 选中日期变化回调 */
  onSelect?: (date: Date) => void
  /** 月份变化回调 */
  onChange?: (date: Date) => void
  /** 自定义类名 */
  className?: string
}

// 格式化日期为 YYYY-MM-DD
const formatDate = (d: Date): string => {
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
 * Cyber 终端风格日历
 * - 月视图
 * - 事件标记
 */
export function Calendar({
  value,
  defaultValue,
  events = [],
  onSelect,
  onChange,
  className,
}: CalendarProps) {
  const [internalValue, setInternalValue] = useState<Date>(defaultValue || new Date())
  const isControlled = value !== undefined
  const currentDate = isControlled ? value! : internalValue
  const [selected, setSelected] = useState<Date>(currentDate)

  // 生成日历网格
  const days = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startOffset = firstDay.getDay()
    const totalDays = lastDay.getDate()
    const cells: (Date | null)[] = []
    // 上月填充
    for (let i = 0; i < startOffset; i++) {
      cells.push(new Date(year, month, -startOffset + i + 1))
    }
    // 本月
    for (let d = 1; d <= totalDays; d++) {
      cells.push(new Date(year, month, d))
    }
    // 下月填充至 6 行
    while (cells.length < 42) {
      const last = cells[cells.length - 1]
      cells.push(new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1))
    }
    return cells
  }, [currentDate])

  // 事件映射
  const eventMap = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {}
    events.forEach((e) => {
      if (!map[e.date]) map[e.date] = []
      map[e.date].push(e)
    })
    return map
  }, [events])

  // 切换月份
  const changeMonth = (delta: number) => {
    const next = new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1)
    if (!isControlled) setInternalValue(next)
    onChange?.(next)
  }

  // 选择日期
  const handleSelect = (date: Date) => {
    setSelected(date)
    onSelect?.(date)
    // 如果选的是其他月份，切换月份
    if (date.getMonth() !== currentDate.getMonth() || date.getFullYear() !== currentDate.getFullYear()) {
      const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
      if (!isControlled) setInternalValue(firstOfMonth)
      onChange?.(firstOfMonth)
    }
  }

  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  const today = new Date()

  return (
    <div className={cn('p-3 bg-cyber-panel/40 border border-cyber-border rounded-lg', className)}>
      {/* 顶部扫描线 */}
      <div className="relative h-px mb-3 bg-gradient-to-r from-transparent via-cyber-accent/50 to-transparent" />

      {/* 头部 */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => changeMonth(-1)} className="p-1 text-gray-400 hover:text-cyber-accent transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="text-sm font-mono font-bold text-cyber-text">
          {currentDate.getFullYear()} / {String(currentDate.getMonth() + 1).padStart(2, '0')}
        </div>
        <button onClick={() => changeMonth(1)} className="p-1 text-gray-400 hover:text-cyber-accent transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 星期表头 */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map((d) => (
          <div key={d} className="text-center text-xs text-gray-500 font-mono py-1">{d}</div>
        ))}
      </div>

      {/* 日期网格 */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, idx) => {
          if (!date) return <div key={idx} />
          const isCurrentMonth = date.getMonth() === currentDate.getMonth()
          const isToday = isSameDay(date, today)
          const isSelected = isSameDay(date, selected)
          const dayEvents = eventMap[formatDate(date)] || []
          return (
            <button
              key={idx}
              onClick={() => handleSelect(date)}
              className={cn(
                'relative aspect-square flex flex-col items-center justify-center text-xs font-mono rounded transition-all border',
                isSelected
                  ? 'bg-cyber-accent/20 border-cyber-accent text-cyber-accent shadow-[0_0_8px_rgba(0,255,136,0.3)]'
                  : isToday
                  ? 'border-cyber-accent/40 text-cyber-accent'
                  : 'border-transparent',
                isCurrentMonth ? 'text-cyber-text' : 'text-gray-600',
                'hover:bg-cyber-accent/10 hover:text-cyber-accent'
              )}
            >
              <span>{date.getDate()}</span>
              {/* 事件标记 */}
              {dayEvents.length > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  {dayEvents.slice(0, 3).map((e, i) => (
                    <span
                      key={i}
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: e.color || '#00ff88' }}
                    />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* 当日事件列表 */}
      {eventMap[formatDate(selected)] && eventMap[formatDate(selected)].length > 0 && (
        <div className="mt-3 pt-3 border-t border-cyber-border/50">
          <div className="text-xs font-mono text-gray-500 mb-2">
            {formatDate(selected)} 事件
          </div>
          <div className="flex flex-col gap-1">
            {eventMap[formatDate(selected)].map((e, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-2 py-1 bg-cyber-bg/50 rounded text-xs font-mono"
                style={{ borderLeft: `2px solid ${e.color || '#00ff88'}` }}
              >
                <span className="text-cyber-text">{e.content}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Calendar
