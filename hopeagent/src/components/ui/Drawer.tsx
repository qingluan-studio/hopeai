import React, { useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom'

interface DrawerProps {
  /** 是否可见 */
  visible: boolean
  /** 标题 */
  title?: React.ReactNode
  /** 内容 */
  children?: React.ReactNode
  /** 底部 */
  footer?: React.ReactNode
  /** 方向 */
  placement?: DrawerPlacement
  /** 宽度（左右） */
  width?: number | string
  /** 高度（上下） */
  height?: number | string
  /** 点击蒙层关闭 */
  maskClosable?: boolean
  /** 是否显示关闭按钮 */
  closable?: boolean
  /** 关闭回调 */
  onClose?: () => void
  /** 自定义类名 */
  className?: string
  /** 蒙层类名 */
  maskClassName?: string
}

// ============ 方向样式映射 ============
const placementStyles: Record<DrawerPlacement, string> = {
  left: 'left-0 top-0 bottom-0 animate-slideRight',
  right: 'right-0 top-0 bottom-0 animate-slideLeft',
  top: 'left-0 right-0 top-0 animate-slideDown',
  bottom: 'left-0 right-0 bottom-0 animate-slideUp',
}

/**
 * Cyber 终端风格抽屉
 * - 左 / 右 / 上 / 下四个方向
 * - 蒙层 + 滑入动画
 */
export function Drawer({
  visible,
  title,
  children,
  footer,
  placement = 'right',
  width = 378,
  height = 378,
  maskClosable = true,
  closable = true,
  onClose,
  className,
  maskClassName,
}: DrawerProps) {
  // ESC 关闭
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.()
    },
    [onClose]
  )

  useEffect(() => {
    if (visible) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [visible, handleKeyDown])

  if (!visible) return null

  // 抽屉尺寸
  const sizeStyle: React.CSSProperties =
    placement === 'left' || placement === 'right'
      ? { width: typeof width === 'number' ? `${width}px` : width }
      : { height: typeof height === 'number' ? `${height}px` : height }

  // 是否水平方向
  const isHorizontal = placement === 'left' || placement === 'right'

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* 蒙层 */}
      <div
        className={cn('absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn', maskClassName)}
        onClick={() => maskClosable && onClose?.()}
      />

      {/* 抽屉主体 */}
      <div
        className={cn(
          'absolute bg-cyber-panel border-cyber-border shadow-[0_0_50px_rgba(0,255,136,0.1)] flex flex-col',
          isHorizontal ? 'border-l' : 'border-t',
          placementStyles[placement],
          className
        )}
        style={sizeStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 顶部扫描线 */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-accent/50 to-transparent" />

        {/* 头部 */}
        {(title || closable) && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-cyber-border/50 flex-shrink-0">
            <h3 className="text-sm font-mono font-bold text-cyber-text">{title}</h3>
            {closable && (
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-cyber-text transition-colors p-1 rounded hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* 内容区 */}
        <div className="flex-1 overflow-auto px-5 py-4 text-sm text-cyber-text/90">
          {children}
        </div>

        {/* 底部 */}
        {footer && (
          <div className="px-5 py-3 border-t border-cyber-border/50 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Drawer
