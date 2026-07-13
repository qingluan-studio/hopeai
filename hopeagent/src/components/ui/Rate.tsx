import React, { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
interface RateProps {
  /** 当前评分（受控） */
  value?: number
  /** 默认评分 */
  defaultValue?: number
  /** 最大星数 */
  count?: number
  /** 是否允许半选 */
  allowHalf?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 自定义图标 */
  icon?: React.ReactNode
  /** 图标尺寸 */
  size?: number
  /** 颜色 */
  color?: string
  /** 变化回调 */
  onChange?: (value: number) => void
  /** 自定义类名 */
  className?: string
}

/**
 * Cyber 终端风格评分组件
 * - 星级 / 自定义图标
 * - 支持半选
 */
export function Rate({
  value,
  defaultValue = 0,
  count = 5,
  allowHalf = false,
  disabled = false,
  readonly = false,
  icon,
  size = 20,
  color = '#00ff88',
  onChange,
  className,
}: RateProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [hoverValue, setHoverValue] = useState<number | null>(null)
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue
  const displayValue = hoverValue ?? currentValue
  const isInteractive = !disabled && !readonly

  // 渲染单个星
  const renderStar = (idx: number) => {
    const starValue = idx + 1
    const filled = displayValue >= starValue
    const half = allowHalf && !filled && displayValue >= starValue - 0.5

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!isInteractive || !allowHalf) return
      const rect = e.currentTarget.getBoundingClientRect()
      const isLeft = e.clientX - rect.left < rect.width / 2
      setHoverValue(starValue - (isLeft ? 0.5 : 0))
    }

    const handleClick = () => {
      if (!isInteractive) return
      const v = hoverValue ?? starValue
      if (!isControlled) setInternalValue(v)
      onChange?.(v)
    }

    // 渲染星星图标（支持自定义图标或默认 Star）
    const renderIcon = (iconColor: string, extraStyle?: React.CSSProperties) => {
      if (icon) {
        return (
          <span
            className="absolute inset-0 flex items-center justify-center"
            style={{ color: iconColor, width: size, height: size, ...extraStyle }}
          >
            {icon}
          </span>
        )
      }
      return (
        <Star
          className="absolute inset-0"
          style={{ width: size, height: size, color: iconColor, ...extraStyle }}
          fill="currentColor"
        />
      )
    }

    return (
      <span
        key={idx}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isInteractive && setHoverValue(null)}
        onClick={handleClick}
        className={cn(
          'inline-block relative',
          isInteractive ? 'cursor-pointer' : 'cursor-default'
        )}
        style={{ width: size, height: size }}
      >
        {/* 灰色底 */}
        {renderIcon('#3a4555')}
        {/* 高亮层 */}
        {(filled || half) && (
          <span
            className="absolute inset-0 overflow-hidden"
            style={{ width: half ? size / 2 : size }}
          >
            {renderIcon(color, { filter: `drop-shadow(0 0 4px ${color}88)` })}
          </span>
        )}
      </span>
    )
  }

  return (
    <div className={cn('inline-flex items-center gap-0.5', className)}>
      {Array.from({ length: count }, (_, i) => renderStar(i))}
      {displayValue > 0 && (
        <span className="ml-2 text-xs font-mono text-gray-400">
          <span style={{ color }}>{displayValue}</span>
        </span>
      )}
    </div>
  )
}

export default Rate
