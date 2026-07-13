import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
type LoadingType = 'spinner' | 'dots' | 'bars' | 'grid' | 'pulse' | 'ring'
type LoadingSize = 'sm' | 'md' | 'lg'

interface LoadingProps {
  /** 加载类型 */
  type?: LoadingType
  /** 尺寸 */
  size?: LoadingSize
  /** 提示文字 */
  tip?: React.ReactNode
  /** 是否全屏 */
  fullscreen?: boolean
  /** 颜色 */
  color?: string
  /** 是否显示蒙层 */
  mask?: boolean
  /** 自定义类名 */
  className?: string
}

// ============ 尺寸映射 ============
const sizeMap: Record<LoadingSize, number> = {
  sm: 16,
  md: 24,
  lg: 40,
}

/**
 * Cyber 终端风格加载动画
 * - 旋转 / 点 / 条 / 网格 / 脉冲 / 圆环
 */
export function Loading({
  type = 'spinner',
  size = 'md',
  tip,
  fullscreen = false,
  color = '#00ff88',
  mask = false,
  className,
}: LoadingProps) {
  const px = sizeMap[size]

  // 渲染加载指示器
  const renderIndicator = () => {
    switch (type) {
      case 'spinner':
        return <Loader2 className="animate-spin" style={{ width: px, height: px, color }} />

      case 'dots':
        return (
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="rounded-full"
                style={{
                  width: px / 3,
                  height: px / 3,
                  backgroundColor: color,
                  animation: `pulseGlow 1s ease-in-out ${i * 0.15}s infinite`,
                  boxShadow: `0 0 6px ${color}`,
                }}
              />
            ))}
          </div>
        )

      case 'bars':
        return (
          <div className="flex items-end gap-1" style={{ height: px }}>
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="w-1 rounded-sm"
                style={{
                  backgroundColor: color,
                  height: '100%',
                  transformOrigin: 'bottom',
                  animation: `barScale 1s ease-in-out ${i * 0.1}s infinite`,
                  boxShadow: `0 0 4px ${color}`,
                }}
              />
            ))}
          </div>
        )

      case 'grid':
        return (
          <div className="grid grid-cols-3 gap-1" style={{ width: px, height: px }}>
            {Array.from({ length: 9 }).map((_, i) => (
              <span
                key={i}
                style={{
                  backgroundColor: color,
                  animation: `gridPulse 1.2s ease-in-out ${(i % 3) * 0.1 + Math.floor(i / 3) * 0.1}s infinite`,
                  borderRadius: '1px',
                }}
              />
            ))}
          </div>
        )

      case 'pulse':
        return (
          <div className="relative" style={{ width: px, height: px }}>
            <span
              className="absolute inset-0 rounded-full"
              style={{
                backgroundColor: color,
                opacity: 0.3,
                animation: 'pulseExpand 1.5s ease-out infinite',
              }}
            />
            <span
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
            />
          </div>
        )

      case 'ring':
        return (
          <div
            className="rounded-full animate-spin"
            style={{
              width: px,
              height: px,
              border: `${Math.max(2, px / 12)}px solid ${color}33`,
              borderTopColor: color,
              boxShadow: `0 0 8px ${color}66`,
            }}
          />
        )

      default:
        return null
    }
  }

  // 自定义动画样式（一次性注入）
  const animStyle = (
    <style>{`
      @keyframes barScale {
        0%, 100% { transform: scaleY(0.4); opacity: 0.5; }
        50% { transform: scaleY(1); opacity: 1; }
      }
      @keyframes gridPulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
      }
      @keyframes pulseExpand {
        0% { transform: scale(1); opacity: 0.6; }
        100% { transform: scale(1.8); opacity: 0; }
      }
    `}</style>
  )

  // 全屏
  if (fullscreen) {
    return (
      <>
        {animStyle}
        <div className={cn('fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-3', mask && 'bg-black/60 backdrop-blur-sm', className)}>
          {renderIndicator()}
          {tip && <div className="text-sm font-mono text-cyber-accent">{tip}</div>}
        </div>
      </>
    )
  }

  return (
    <>
      {animStyle}
      <div className={cn('inline-flex flex-col items-center justify-center gap-2', className)}>
        {renderIndicator()}
        {tip && <div className="text-xs font-mono text-gray-400">{tip}</div>}
      </div>
    </>
  )
}

export default Loading
