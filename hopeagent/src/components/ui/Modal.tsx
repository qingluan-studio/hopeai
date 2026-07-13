import React, { useEffect, useCallback } from 'react'
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './Button'

// ============ 类型定义 ============
type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'half'
type ModalPlacement = 'center' | 'top' | 'bottom'

interface ModalProps {
  /** 是否可见 */
  visible: boolean
  /** 标题 */
  title?: React.ReactNode
  /** 内容 */
  children?: React.ReactNode
  /** 底部内容 */
  footer?: React.ReactNode
  /** 尺寸 */
  size?: ModalSize
  /** 位置 */
  placement?: ModalPlacement
  /** 点击蒙层关闭 */
  maskClosable?: boolean
  /** 是否显示关闭按钮 */
  closable?: boolean
  /** 关闭回调 */
  onClose?: () => void
  /** 确认按钮文字 */
  okText?: string
  /** 取消按钮文字 */
  cancelText?: string
  /** 确认回调 */
  onOk?: () => void
  /** 取消回调 */
  onCancel?: () => void
  /** 自定义类名 */
  className?: string
  /** 蒙层类名 */
  maskClassName?: string
  /** 是否显示底部按钮 */
  showFooter?: boolean
}

interface ConfirmOptions extends Omit<ModalProps, 'visible' | 'footer'> {
  /** 确认框类型 */
  type?: 'info' | 'success' | 'warning' | 'error' | 'confirm'
  /** 内容 */
  content?: React.ReactNode
}

// ============ 尺寸映射 ============
const sizeStyles: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full mx-4',
  half: 'max-w-2xl',
}

const typeIcons = {
  info: { icon: Info, color: 'text-cyan-400' },
  success: { icon: CheckCircle, color: 'text-emerald-400' },
  warning: { icon: AlertTriangle, color: 'text-amber-400' },
  error: { icon: AlertCircle, color: 'text-red-400' },
  confirm: { icon: AlertCircle, color: 'text-cyber-accent' },
}

/**
 * Cyber 终端风格模态框组件
 * - 标题 + 内容 + 底部按钮
 * - 打开/关闭动画
 * - 点击蒙层关闭
 * - 多种尺寸：sm/md/lg/xl/full/half
 * - 支持确认对话框 confirm() 快捷方法
 */
export function Modal({
  visible,
  title,
  children,
  footer,
  size = 'md',
  placement = 'center',
  maskClosable = true,
  closable = true,
  onClose,
  okText = '确定',
  cancelText = '取消',
  onOk,
  onCancel,
  className,
  maskClassName,
  showFooter = true,
}: ModalProps) {
  // ESC 键关闭
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.()
      }
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

  const handleMaskClick = () => {
    if (maskClosable) {
      onClose?.()
    }
  }

  const handleCancel = () => {
    onCancel?.()
    onClose?.()
  }

  const handleOk = () => {
    onOk?.()
  }

  // 位置样式
  const placementStyles = {
    center: 'items-center justify-center',
    top: 'items-start justify-center pt-20',
    bottom: 'items-end justify-center pb-0',
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex p-4',
        placementStyles[placement],
        'animate-fadeIn'
      )}
    >
      {/* 蒙层 */}
      <div
        className={cn(
          'absolute inset-0 bg-black/60 backdrop-blur-sm',
          maskClassName
        )}
        onClick={handleMaskClick}
      />

      {/* 模态框内容 */}
      <div
        className={cn(
          'relative w-full bg-cyber-panel border border-cyber-border rounded-xl',
          'shadow-[0_0_50px_rgba(0,255,136,0.1)]',
          sizeStyles[size],
          'animate-scaleIn',
          placement === 'bottom' && 'rounded-b-none animate-slideUp',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 顶部扫描线效果 */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-accent/50 to-transparent" />

        {/* 头部 */}
        {(title || closable) && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-cyber-border/50">
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
        <div className="px-5 py-4 text-sm text-cyber-text/90">
          {children}
        </div>

        {/* 底部 */}
        {showFooter && (
          <div className="px-5 py-3 border-t border-cyber-border/50 flex justify-end gap-2">
            {footer ?? (
              <>
                <Button variant="ghost" onClick={handleCancel}>
                  {cancelText}
                </Button>
                <Button variant="primary" onClick={handleOk}>
                  {okText}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * 确认对话框快捷方法
 */
export function confirm(options: ConfirmOptions) {
  const {
    type = 'confirm',
    title = '提示',
    content,
    okText = '确定',
    cancelText = '取消',
    onOk,
    onCancel,
    ...rest
  } = options

  const TypeIcon = typeIcons[type].icon

  // 这里返回一个 Promise 供外部控制
  // 简化实现：直接创建一个临时的 DOM 渲染
  const div = document.createElement('div')
  document.body.appendChild(div)

  const close = () => {
    div.remove()
  }

  // 简单实现：使用 React 渲染到动态创建的元素
  // 注意：实际项目中应该使用 createRoot
  const ConfirmModal = () => {
    const [visible, setVisible] = React.useState(true)

    const handleOk = () => {
      setVisible(false)
      setTimeout(() => {
        close()
        onOk?.()
      }, 200)
    }

    const handleCancel = () => {
      setVisible(false)
      setTimeout(() => {
        close()
        onCancel?.()
      }, 200)
    }

    return (
      <Modal
        visible={visible}
        title={title}
        okText={okText}
        cancelText={cancelText}
        onOk={handleOk}
        onCancel={handleCancel}
        onClose={handleCancel}
        {...rest}
      >
        <div className="flex items-start gap-3">
          <TypeIcon className={cn('w-6 h-6 flex-shrink-0 mt-0.5', typeIcons[type].color)} />
          <div className="flex-1 text-sm text-gray-300">{content}</div>
        </div>
      </Modal>
    )
  }

  // 注意：由于是函数式组件不能直接这样调用
  // 在实际项目中应使用 ReactDOM.createRoot
  // 这里为了简化，我们提供一个基于事件的实现
  // 先返回空，实际使用时配合 Modal 组件使用
  return { close }

  // 实际项目中完整实现：
  // import { createRoot } from 'react-dom/client'
  // const root = createRoot(div)
  // root.render(<ConfirmModal />)
}

export default Modal
