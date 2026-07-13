import React, { useState, useCallback, useEffect } from 'react'
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Loader2,
  X,
} from 'lucide-react'
import { cn, uid } from '@/lib/utils'

// ============ 类型定义 ============
type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading'

interface ToastItem {
  id: string
  type: ToastType
  message: React.ReactNode
  description?: React.ReactNode
  duration?: number
  onClose?: () => void
}

interface ToastProps {
  /** Toast 列表 */
  toasts: ToastItem[]
  /** 移除 Toast */
  onRemove: (id: string) => void
}

interface ToastOptions {
  /** 消息内容 */
  message: React.ReactNode
  /** 描述 */
  description?: React.ReactNode
  /** 持续时间（毫秒），0 表示不自动关闭 */
  duration?: number
  /** 关闭回调 */
  onClose?: () => void
}

// ============ 类型配置 ============
const typeConfig: Record<ToastType, { icon: typeof CheckCircle; color: string; bg: string; border: string }> = {
  success: {
    icon: CheckCircle,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
  },
  error: {
    icon: XCircle,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
  },
  info: {
    icon: Info,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
  },
  loading: {
    icon: Loader2,
    color: 'text-cyber-accent',
    bg: 'bg-cyber-accent/10',
    border: 'border-cyber-accent/30',
  },
}

// ============ 全局 Toast 状态管理 ============
let globalToasts: ToastItem[] = []
let listeners: ((toasts: ToastItem[]) => void)[] = []

const notifyListeners = () => {
  listeners.forEach((fn) => fn([...globalToasts]))
}

const addToast = (type: ToastType, options: ToastOptions): string => {
  const id = uid()
  const toast: ToastItem = {
    id,
    type,
    message: options.message,
    description: options.description,
    duration: options.duration ?? 3000,
    onClose: options.onClose,
  }

  globalToasts = [...globalToasts, toast]
  notifyListeners()

  // 自动关闭
  if (toast.duration && toast.duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, toast.duration)
  }

  return id
}

const removeToast = (id: string) => {
  const toast = globalToasts.find((t) => t.id === id)
  globalToasts = globalToasts.filter((t) => t.id !== id)
  notifyListeners()
  toast?.onClose?.()
}

/**
 * Toast 容器组件
 */
function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    const listener = (newToasts: ToastItem[]) => setToasts(newToasts)
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }, [])

  const handleRemove = useCallback((id: string) => {
    removeToast(id)
  }, [])

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <ToastItemComponent key={toast.id} toast={toast} onClose={() => handleRemove(toast.id)} />
      ))}
    </div>
  )
}

/**
 * 单个 Toast 组件
 */
function ToastItemComponent({ toast, onClose }: { toast: ToastItem; onClose: () => void }) {
  const [leaving, setLeaving] = useState(false)
  const config = typeConfig[toast.type]
  const Icon = config.icon

  const handleClose = () => {
    setLeaving(true)
    setTimeout(onClose, 200)
  }

  return (
    <div
      className={cn(
        'pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm',
        'shadow-lg transition-all duration-300',
        config.bg,
        config.border,
        leaving ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0',
        'animate-slideDown'
      )}
      style={{
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* 图标 */}
      <div className={cn('flex-shrink-0 mt-0.5', config.color)}>
        <Icon className={cn('w-5 h-5', toast.type === 'loading' && 'animate-spin')} />
      </div>

      {/* 内容 */}
      <div className="flex-1 min-w-0">
        <div className={cn('text-sm font-medium font-mono', config.color)}>
          {toast.message}
        </div>
        {toast.description && (
          <div className="text-xs text-gray-400 mt-1">{toast.description}</div>
        )}
      </div>

      {/* 关闭按钮 */}
      <button
        onClick={handleClose}
        className="flex-shrink-0 text-gray-500 hover:text-gray-300 transition-colors p-0.5"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

/**
 * Cyber 终端风格 Toast 组件
 * - 全局通知
 * - 5 种类型：success / error / warning / info / loading
 * - 自动关闭
 * - 顶部堆叠
 * - 手动关闭
 * - createToast() API
 */
export const Toast = {
  success: (options: ToastOptions) => addToast('success', options),
  error: (options: ToastOptions) => addToast('error', options),
  warning: (options: ToastOptions) => addToast('warning', options),
  info: (options: ToastOptions) => addToast('info', options),
  loading: (options: ToastOptions) => addToast('loading', options),
  dismiss: (id: string) => removeToast(id),
  Container: ToastContainer,
}

/** 创建 Toast 的便捷函数 */
export function createToast() {
  return {
    success: (message: React.ReactNode, options?: Omit<ToastOptions, 'message'>) =>
      addToast('success', { message, ...options }),
    error: (message: React.ReactNode, options?: Omit<ToastOptions, 'message'>) =>
      addToast('error', { message, ...options }),
    warning: (message: React.ReactNode, options?: Omit<ToastOptions, 'message'>) =>
      addToast('warning', { message, ...options }),
    info: (message: React.ReactNode, options?: Omit<ToastOptions, 'message'>) =>
      addToast('info', { message, ...options }),
    loading: (message: React.ReactNode, options?: Omit<ToastOptions, 'message'>) =>
      addToast('loading', { message, ...options }),
    dismiss: (id: string) => removeToast(id),
  }
}

export default Toast
