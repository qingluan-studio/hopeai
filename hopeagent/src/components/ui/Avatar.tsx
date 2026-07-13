import React from 'react'
import { User } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type AvatarShape = 'circle' | 'square'

interface AvatarProps {
  /** 图片地址 */
  src?: string
  /** 文字内容 */
  text?: string
  /** 图标 */
  icon?: React.ReactNode
  /** 尺寸 */
  size?: AvatarSize
  /** 形状 */
  shape?: AvatarShape
  /** 背景色 */
  bgColor?: string
  /** 文字颜色 */
  textColor?: string
  /** 边框颜色 */
  borderColor?: string
  /** 在线状态 */
  status?: 'online' | 'offline' | 'busy' | 'away'
  /** 自定义类名 */
  className?: string
  /** 图片加载失败回调 */
  onError?: () => void
  /** 点击回调 */
  onClick?: () => void
}

interface AvatarGroupProps {
  /** 头像列表 */
  avatars?: AvatarProps[]
  /** 最大显示数量 */
  maxCount?: number
  /** 头像尺寸 */
  size?: AvatarSize
  /** 头像形状 */
  shape?: AvatarShape
  /** 间距（负值表示重叠） */
  spacing?: number
  /** 自定义类名 */
  className?: string
  /** 子元素 */
  children?: React.ReactNode
}

// ============ 尺寸映射 ============
const sizeMap: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
}

const statusColors: Record<string, string> = {
  online: 'bg-emerald-500',
  offline: 'bg-gray-500',
  busy: 'bg-red-500',
  away: 'bg-amber-500',
}

const statusSizeMap: Record<AvatarSize, string> = {
  xs: 'w-2 h-2 -bottom-0.5 -right-0.5',
  sm: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5',
  md: 'w-3 h-3 -bottom-0.5 -right-0.5',
  lg: 'w-4 h-4 -bottom-1 -right-1',
  xl: 'w-5 h-5 -bottom-1 -right-1',
}

/**
 * Cyber 终端风格头像组件
 * - 图片 / 文字 / 图标 三种模式
 * - 5 种尺寸：xs/sm/md/lg/xl
 * - 圆形 / 方形
 * - 在线状态指示
 */
export function Avatar({
  src,
  text,
  icon,
  size = 'md',
  shape = 'circle',
  bgColor,
  textColor,
  borderColor,
  status,
  className,
  onError,
  onClick,
}: AvatarProps) {
  const [imgError, setImgError] = React.useState(false)

  const handleError = () => {
    setImgError(true)
    onError?.()
  }

  // 处理文字显示（最多两个字符）
  const displayText = text?.slice(0, 2).toUpperCase()

  // 渲染头像内容
  const renderContent = () => {
    if (src && !imgError) {
      return (
        <img
          src={src}
          alt="avatar"
          className="w-full h-full object-cover"
          onError={handleError}
        />
      )
    }

    if (icon) {
      return <span className="flex items-center justify-center w-full h-full">{icon}</span>
    }

    if (text) {
      return <span className="font-mono font-medium">{displayText}</span>
    }

    return (
      <span className="flex items-center justify-center w-full h-full">
        <User className={cn(sizeMap[size].split(' ').filter(s => s.startsWith('text-') ? `w-1/2 h-1/2` : ''), 'text-gray-400')} />
      </span>
    )
  }

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center border-2 overflow-hidden flex-shrink-0',
        sizeMap[size],
        shape === 'circle' ? 'rounded-full' : 'rounded-lg',
        onClick && 'cursor-pointer hover:ring-2 hover:ring-cyber-accent/50 transition-all',
        className
      )}
      style={{
        backgroundColor: bgColor || 'rgba(0, 255, 136, 0.1)',
        borderColor: borderColor || 'rgba(0, 255, 136, 0.3)',
        color: textColor || '#00ff88',
      }}
      onClick={onClick}
    >
      {renderContent()}

      {/* 状态点 */}
      {status && (
        <span
          className={cn(
            'absolute rounded-full border-2 border-cyber-bg',
            statusColors[status],
            statusSizeMap[size]
          )}
        />
      )}
    </div>
  )
}

/**
 * 头像组组件
 */
function AvatarGroup({
  avatars = [],
  maxCount = 5,
  size = 'md',
  shape = 'circle',
  spacing = -8,
  className,
  children,
}: AvatarGroupProps) {
  const displayAvatars = avatars.slice(0, maxCount)
  const hiddenCount = avatars.length - maxCount

  return (
    <div className={cn('inline-flex items-center', className)}>
      {displayAvatars.map((avatarProps, index) => (
        <div
          key={index}
          style={{ marginLeft: index > 0 ? spacing : 0 }}
          className="relative z-0"
        >
          <Avatar {...avatarProps} size={size} shape={shape} />
        </div>
      ))}

      {children &&
        React.Children.map(children, (child, index) => (
          <div
            key={`child-${index}`}
            style={{ marginLeft: index > 0 || avatars.length > 0 ? spacing : 0 }}
            className="relative z-0"
          >
            {child}
          </div>
        ))}

      {hiddenCount > 0 && (
        <div style={{ marginLeft: spacing }} className="relative z-0">
          <Avatar
            text={`+${hiddenCount}`}
            size={size}
            shape={shape}
            bgColor="rgba(107, 114, 128, 0.3)"
            textColor="#9ca3af"
            borderColor="rgba(107, 114, 128, 0.5)"
          />
        </div>
      )}
    </div>
  )
}

Avatar.Group = AvatarGroup

export { AvatarGroup }
export default Avatar
