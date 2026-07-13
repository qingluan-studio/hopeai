import React from 'react'
import { Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
interface EmptyProps {
  /** 自定义图标 */
  icon?: React.ReactNode
  /** 描述文字 */
  description?: React.ReactNode
  /** 图片 / 自定义内容 */
  image?: React.ReactNode
  /** 操作区 */
  action?: React.ReactNode
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg'
  /** 自定义类名 */
  className?: string
}

// ============ 尺寸样式映射 ============
const sizeStyles = {
  sm: { icon: 'w-8 h-8', text: 'text-xs', py: 'py-4' },
  md: { icon: 'w-12 h-12', text: 'text-sm', py: 'py-8' },
  lg: { icon: 'w-16 h-16', text: 'text-base', py: 'py-12' },
}

/**
 * Cyber 终端风格空状态
 * - 自定义图标 / 文字 / 操作
 */
export function Empty({
  icon,
  description = '暂无数据',
  image,
  action,
  size = 'md',
  className,
}: EmptyProps) {
  const s = sizeStyles[size]

  return (
    <div className={cn('flex flex-col items-center justify-center text-center', s.py, className)}>
      {image ? (
        <div className="mb-3">{image}</div>
      ) : (
        <div className="relative mb-3">
          {/* 默认图标 */}
          <div className={cn('text-gray-700', s.icon)}>
            {icon ?? <Inbox className="w-full h-full" strokeWidth={1} />}
          </div>
          {/* 扫描线效果 */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute left-0 right-0 h-px bg-cyber-accent/40"
              style={{ animation: 'scanMove 3s linear infinite' }}
            />
          </div>
        </div>
      )}
      <div className={cn('text-gray-500 font-mono', s.text)}>
        {description}
      </div>
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}

export default Empty
