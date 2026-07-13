import React, { useState, useRef, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
interface SliderProps {
  /** 当前值（受控） */
  value?: number | [number, number]
  /** 默认值 */
  defaultValue?: number | [number, number]
  /** 最小值 */
  min?: number
  /** 最大值 */
  max?: number
  /** 步长 */
  step?: number
  /** 是否为范围选择（双滑块） */
  range?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示 tooltip */
  tooltip?: boolean
  /** 刻度标记 */
  marks?: { value: number; label?: React.ReactNode }[]
  /** 是否显示刻度 */
  showMarks?: boolean
  /** 变化回调（拖动中） */
  onChange?: (value: number | [number, number]) => void
  /** 变化结束回调（鼠标松开） */
  onAfterChange?: (value: number | [number, number]) => void
  /** 自定义类名 */
  className?: string
  /** 主色调 */
  color?: string
}

/**
 * Cyber 终端风格滑块组件
 * - 单滑块 / 双滑块（范围选择）
 * - 刻度标记
 * - 自定义 tooltip
 * - 键盘操作支持
 */
export function Slider({
  value,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  range = false,
  disabled = false,
  tooltip = true,
  marks = [],
  showMarks = false,
  onChange,
  onAfterChange,
  className,
  color = '#00ff88',
}: SliderProps) {
  const [internalValue, setInternalValue] = useState<number | [number, number]>(defaultValue)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [showTooltip, setShowTooltip] = useState<number | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  // 单值还是范围
  const isRange = range || Array.isArray(currentValue)

  // 计算百分比
  const getPercent = (val: number) => {
    return ((val - min) / (max - min)) * 100
  }

  // 根据位置计算值
  const getValueFromPosition = useCallback(
    (clientX: number): number => {
      if (!trackRef.current) return min
      const rect = trackRef.current.getBoundingClientRect()
      const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
      const rawValue = min + (percent / 100) * (max - min)
      // 步长取整
      const stepped = Math.round(rawValue / step) * step
      return Math.max(min, Math.min(max, stepped))
    },
    [min, max, step]
  )

  // 处理拖动
  const handleMouseDown = (e: React.MouseEvent, index: number) => {
    if (disabled) return
    e.preventDefault()
    setActiveIndex(index)
    setShowTooltip(index)

    const handleMouseMove = (e: MouseEvent) => {
      const newValue = getValueFromPosition(e.clientX)

      let result: number | [number, number]
      if (isRange) {
        const arr = Array.isArray(currentValue) ? [...currentValue] : [currentValue, max]
        arr[index] = newValue
        // 确保两个值不交叉
        if (index === 0 && arr[0] > arr[1]) arr[0] = arr[1]
        if (index === 1 && arr[1] < arr[0]) arr[1] = arr[0]
        result = [arr[0], arr[1]] as [number, number]
      } else {
        result = newValue
      }

      if (!isControlled) {
        setInternalValue(result)
      }
      onChange?.(result)
    }

    const handleMouseUp = () => {
      setActiveIndex(null)
      setShowTooltip(null)
      onAfterChange?.(currentValue)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // 键盘操作
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (disabled) return

    let delta = 0
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        delta = step
        break
      case 'ArrowLeft':
      case 'ArrowDown':
        delta = -step
        break
      default:
        return
    }
    e.preventDefault()

    let result: number | [number, number]
    if (isRange) {
      const arr = Array.isArray(currentValue) ? [...currentValue] : [min, max]
      arr[index] = Math.max(min, Math.min(max, arr[index] + delta))
      if (index === 0 && arr[0] > arr[1]) arr[0] = arr[1]
      if (index === 1 && arr[1] < arr[0]) arr[1] = arr[0]
      result = [arr[0], arr[1]] as [number, number]
    } else {
      result = Math.max(min, Math.min(max, (currentValue as number) + delta))
    }

    if (!isControlled) {
      setInternalValue(result)
    }
    onChange?.(result)
  }

  // 渲染滑块
  const renderThumb = (val: number, index: number) => {
    const percent = getPercent(val)
    const isActive = activeIndex === index
    const isTooltipVisible = showTooltip === index || isActive

    return (
      <div
        key={index}
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
        style={{ left: `${percent}%` }}
      >
        {/* Tooltip */}
        {tooltip && isTooltipVisible && (
          <div
            className={cn(
              'absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1',
              'bg-cyber-panel border border-cyber-accent/40 rounded text-xs font-mono whitespace-nowrap',
              'animate-fadeIn'
            )}
            style={{ color }}
          >
            {val}
            <div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-cyber-panel border-r border-b border-cyber-accent/40 rotate-45"
            />
          </div>
        )}

        {/* 滑块按钮 */}
        <div
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={val}
          onMouseDown={(e) => handleMouseDown(e, index)}
          onMouseEnter={() => !disabled && setShowTooltip(index)}
          onMouseLeave={() => !isActive && setShowTooltip(null)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={cn(
            'w-5 h-5 rounded-full cursor-pointer transition-all duration-200',
            'border-2 flex items-center justify-center',
            disabled && 'opacity-50 cursor-not-allowed',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyber-accent/50'
          )}
          style={{
            backgroundColor: '#0a0e14',
            borderColor: color,
            boxShadow: isActive
              ? `0 0 15px ${color}, 0 0 25px ${color}50`
              : `0 0 8px ${color}50`,
            transform: isActive ? 'scale(1.2)' : 'scale(1)',
          }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
    )
  }

  // 计算已填充区域
  const getFillStyle = () => {
    if (isRange && Array.isArray(currentValue)) {
      const left = getPercent(currentValue[0])
      const width = getPercent(currentValue[1]) - left
      return { left: `${left}%`, width: `${width}%` }
    }
    const val = isRange ? (currentValue as number[])[0] : (currentValue as number)
    return { left: 0, width: `${getPercent(val)}%` }
  }

  const fillStyle = getFillStyle()

  return (
    <div className={cn('relative w-full py-4', disabled && 'opacity-50', className)}>
      {/* 轨道 */}
      <div
        ref={trackRef}
        className="relative h-1.5 bg-cyber-border rounded-full cursor-pointer"
        onClick={(e) => {
          if (disabled) return
          // 单滑块时点击轨道跳转
          if (!isRange) {
            const newValue = getValueFromPosition(e.clientX)
            if (!isControlled) {
              setInternalValue(newValue)
            }
            onChange?.(newValue)
            onAfterChange?.(newValue)
          }
        }}
      >
        {/* 已填充部分 */}
        <div
          className="absolute top-0 h-full rounded-full transition-all duration-100"
          style={{
            ...fillStyle,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}50`,
          }}
        />

        {/* 滑块 */}
        {isRange && Array.isArray(currentValue) ? (
          <>
            {renderThumb(currentValue[0], 0)}
            {renderThumb(currentValue[1], 1)}
          </>
        ) : (
          renderThumb(currentValue as number, 0)
        )}
      </div>

      {/* 刻度标记 */}
      {(showMarks || marks.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2">
          <div className="relative h-4">
            {marks.map((mark) => (
              <div
                key={mark.value}
                className="absolute -translate-x-1/2 flex flex-col items-center"
                style={{ left: `${getPercent(mark.value)}%` }}
              >
                <div
                  className="w-px h-2"
                  style={{ backgroundColor: color, opacity: 0.5 }}
                />
                {mark.label && (
                  <span className="text-[10px] font-mono text-gray-500 mt-1 whitespace-nowrap">
                    {mark.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Slider
