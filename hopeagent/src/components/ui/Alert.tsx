import React, { useState } from 'react'
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
type AlertType = 'success' | 'error' | 'warning' | 'info'
type AlertVariant = 'filled' | 'bordered'

interface AlertProps {
  /** 类型 */
  type?: AlertType
  /** 风格变体 */
  variant?: AlertVariant
  /** 标题 */
  title?: React.ReactNode
  /** 描述 */
  description?: React.ReactNode
  /** 是否可关闭 */
  closable?: boolean
  /** 关闭回调 */
  onClose?: () => void
  /** 自定义图标 */
  icon?: React.ReactNode
  /** 自定义类名 */
  className?: string
  /** 是否显示图标 */
  showIcon?: boolean
}

// ============ 类型配置 ============
const typeConfig: Record<AlertType, {
  icon: typeof CheckCircle
  bordered: { bg: string; border: string; text: string; iconColor: string }
  filled: { bg: string; text: string; iconColor: string }
}> = {
  success: {
    icon: CheckCircle,
    bordered: {
      bg: 'bg-emerald-500/5',
      border: 'border-emerald-500/40',
      text: 'text-emerald-400',
      iconColor: 'text-emerald-400',
    },
    filled: {
      bg: 'bg-emerald-500/20',
      text: 'text-emerald-300',
      iconColor: 'text-emerald-400',
    },
  },
  error: {
    icon: XCircle,
    bordered: {
      bg: 'bg-red-500/5',
      border: 'border-red-500/40',
      text: 'text-red-400',
      iconColor: 'text-red-400',
    },
    filled: {
      bg: 'bg-red-500/20',
      text: 'text-red-300',
      iconColor: 'text-red-400',
    },
  },
  warning: {
    icon: AlertTriangle,
    bordered: {
      bg: 'bg-amber-500/5',
      border: 'border-amber-500/40',
      text: 'text-amber-400',
      iconColor: 'text-amber-400',
    },
    filled: {
      bg: 'bg-amber-500/20',
      text: 'text-amber-300',
      iconColor: 'text-amber-400',
    },
  },
  info: {
    icon: Info,
    bordered: {
      bg: 'bg-cyan-500/5',
      border: 'border-cyan-500/40',
      text: 'text-cyan-400',
      iconColor: 'text-cyan-400',
    },
    filled: {
      bg: 'bg-cyan-500/20',
      text: 'text-cyan-300',
      iconColor: 'text-cyan-400',
    },
  },
}

/**
 * Cyber 终端风格警告提示组件
 * - 4 种类型：success / error / warning / info
 * - 可关闭
 * - 图标 + 标题 + 描述
 * - 边框 / 填充 两种风格
 */
export function Alert({
  type = 'info',
  variant = 'bordered',
  title,
  description,
  closable = false,
  onClose,
  icon,
  className,
  showIcon = true,
}: AlertProps) {
  const [visible, setVisible] = useState(true)
  const config = typeConfig[type]
  const style = variant === 'filled' ? config.filled : config.bordered
  const Icon = config.icon

  const handleClose = () => {
    setVisible(false)
    onClose?.()
  }

  if (!visible) return null

  return (
    <div
      className={cn(
        'relative flex items-start gap-3 p-4 rounded-lg transition-all duration-300',
        style.bg,
        variant === 'bordered' && ['border', (style as typeof config.bordered).border],
        className
      )}
    >
      {/* 左侧发光线 */}
      {variant === 'bordered' && (
        <div
          className={cn(
            'absolute left-0 top-0 bottom-0 w-0.5 rounded-l-full',
            style.text.replace('text-', 'bg-')
          )}
        />
      )}

      {/* 图标 */}
      {showIcon && (
        <div className={cn('flex-shrink-0 mt-0.5', style.iconColor)}>
          {icon || <Icon className="w-5 h-5" />}
        </div>
      )}

      {/* 内容 */}
      <div className="flex-1 min-w-0">
        {title && (
          <div className={cn('text-sm font-medium font-mono', style.text)}>
            {title}
          </div>
        )}
        {description && (
          <div className={cn('text-xs mt-1', variant === 'filled' ? 'text-gray-300' : 'text-gray-400')}>
            {description}
          </div>
        )}
      </div>

      {/* 关闭按钮 */}
      {closable && (
        <button
          onClick={handleClose}
          className={cn(
            'flex-shrink-0 transition-colors p-0.5 rounded',
            variant === 'filled' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-300'
          )}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default Alert
