import React, { useEffect } from 'react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
interface BackdropProps {
  /** 是否可见 */
  visible: boolean
  /** 透明度 0-1 */
  opacity?: number
  /** 是否模糊 */
  blur?: boolean
  /** 模糊强度（px） */
  blurAmount?: number
  /** 是否可点击关闭 */
  closable?: boolean
  /** 关闭回调 */
  onClose?: () => void
  /** 背景色 */
  backgroundColor?: string
  /** 自定义类名 */
  className?: string
  /** 子元素 */
  children?: React.ReactNode
  /** z-index */
  zIndex?: number
}

/**
 * Cyber 终端风格背景蒙层
 * - 模糊 / 透明度可调
 */
export function Backdrop({
  visible,
  opacity = 0.6,
  blur = true,
  blurAmount = 4,
  closable = false,
  onClose,
  backgroundColor = '#000000',
  className,
  children,
  zIndex = 40,
}: BackdropProps) {
  // 锁定滚动
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [visible])

  if (!visible) return null

  return (
    <div
      className={cn('fixed inset-0 flex items-center justify-center animate-fadeIn', className)}
      style={{
        backgroundColor,
        opacity,
        backdropFilter: blur ? `blur(${blurAmount}px)` : undefined,
        WebkitBackdropFilter: blur ? `blur(${blurAmount}px)` : undefined,
        zIndex,
      }}
      onClick={() => closable && onClose?.()}
    >
      {/* 扫描线装饰 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute left-0 right-0 h-px bg-cyber-accent/30"
          style={{ animation: 'scanMove 4s linear infinite' }}
        />
      </div>
      {children}
    </div>
  )
}

export default Backdrop
