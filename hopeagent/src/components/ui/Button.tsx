import React, { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 按钮变体 */
  variant?: ButtonVariant
  /** 按钮尺寸 */
  size?: ButtonSize
  /** 加载状态 */
  loading?: boolean
  /** 激活状态 */
  active?: boolean
  /** 前置图标 */
  leftIcon?: React.ReactNode
  /** 后置图标 */
  rightIcon?: React.ReactNode
  /** 波纹效果 */
  ripple?: boolean
}

// ============ 变体样式映射 ============
const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-cyber-accent text-black hover:bg-cyber-accent/90 border-cyber-accent shadow-[0_0_20px_rgba(0,255,136,0.3)] hover:shadow-[0_0_30px_rgba(0,255,136,0.5)]',
  secondary: 'bg-cyber-panel text-cyber-text hover:bg-cyber-border border-cyber-border hover:border-cyber-accent/50',
  ghost: 'bg-transparent text-cyber-text hover:bg-cyber-accent/10 border-transparent hover:border-cyber-accent/30',
  danger: 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/40 hover:border-red-500/60 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]',
  success: 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border-emerald-500/40 hover:border-emerald-500/60 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]',
  outline: 'bg-transparent text-cyber-accent border-cyber-accent/50 hover:bg-cyber-accent/10 hover:border-cyber-accent',
}

// ============ 尺寸样式映射 ============
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-7 px-2.5 text-xs gap-1 rounded-md',
  md: 'h-9 px-4 text-sm gap-1.5 rounded-lg',
  lg: 'h-11 px-6 text-base gap-2 rounded-xl',
  xl: 'h-14 px-8 text-lg gap-2.5 rounded-2xl',
}

/**
 * Cyber 终端风格按钮组件
 * - 支持 6 种变体：primary / secondary / ghost / danger / success / outline
 * - 支持 4 种尺寸：sm / md / lg / xl
 * - 支持加载、禁用、激活状态
 * - 支持前后置图标
 * - 波纹点击效果
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  active = false,
  leftIcon,
  rightIcon,
  ripple = true,
  disabled,
  className,
  children,
  onClick,
  ...props
}: ButtonProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([])

  // 处理波纹效果
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple && !disabled && !loading) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const id = Date.now()
      setRipples((prev) => [...prev, { x, y, id }])
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id))
      }, 600)
    }
    onClick?.(e)
  }

  return (
    <button
      className={cn(
        'relative inline-flex items-center justify-center font-mono font-medium border transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyber-accent/50',
        'overflow-hidden',
        variantStyles[variant],
        sizeStyles[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        active && 'ring-2 ring-cyber-accent/50',
        className
      )}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {/* 波纹效果 */}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute bg-white/30 rounded-full animate-ripple pointer-events-none"
          style={{
            left: r.x,
            top: r.y,
            width: '10px',
            height: '10px',
            marginLeft: '-5px',
            marginTop: '-5px',
          }}
        />
      ))}

      {/* 前置图标 */}
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}

      {/* 文字内容 */}
      {children && <span className="whitespace-nowrap">{children}</span>}

      {/* 后置图标 */}
      {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  )
}

export default Button
