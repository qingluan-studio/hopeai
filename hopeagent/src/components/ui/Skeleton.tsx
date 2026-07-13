import React from 'react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
interface SkeletonProps {
  /** 是否显示动画 */
  active?: boolean
  /** 自定义类名 */
  className?: string
}

interface SkeletonAvatarProps extends SkeletonProps {
  /** 头像尺寸 */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** 形状 */
  shape?: 'circle' | 'square'
}

interface SkeletonTextProps extends SkeletonProps {
  /** 行数 */
  rows?: number
  /** 首行宽度（百分比） */
  firstRowWidth?: string
}

interface SkeletonParagraphProps extends SkeletonProps {
  /** 段落行数 */
  rows?: number
  /** 最后一行宽度 */
  lastRowWidth?: string
}

interface SkeletonCardProps extends SkeletonProps {
  /** 是否显示头像 */
  avatar?: boolean
  /** 是否显示标题 */
  title?: boolean
  /** 段落行数 */
  paragraphRows?: number
}

// ============ 基础骨架动画 ============
const skeletonBase = 'bg-cyber-border/60 rounded animate-pulse'

/**
 * 基础骨架块
 */
function SkeletonBlock({ className, active = true }: SkeletonProps & { className?: string }) {
  return (
    <div
      className={cn(
        skeletonBase,
        active && 'animate-pulse',
        className
      )}
    />
  )
}

/**
 * 头像骨架
 */
function SkeletonAvatar({
  size = 'md',
  shape = 'circle',
  active = true,
  className,
}: SkeletonAvatarProps) {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  }

  return (
    <div
      className={cn(
        skeletonBase,
        sizeMap[size],
        shape === 'circle' ? 'rounded-full' : 'rounded-lg',
        active && 'animate-pulse',
        className
      )}
    />
  )
}

/**
 * 单行文字骨架
 */
function SkeletonText({
  rows = 1,
  active = true,
  firstRowWidth = '100%',
  className,
}: SkeletonTextProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={cn(
            skeletonBase,
            'h-4 rounded',
            active && 'animate-pulse'
          )}
          style={{
            width: i === 0 ? firstRowWidth : `${60 + Math.random() * 35}%`,
          }}
        />
      ))}
    </div>
  )
}

/**
 * 段落骨架
 */
function SkeletonParagraph({
  rows = 4,
  lastRowWidth = '60%',
  active = true,
  className,
}: SkeletonParagraphProps) {
  return (
    <div className={cn('space-y-2.5', className)}>
      {Array.from({ length: rows }).map((_, i) => {
        const isLast = i === rows - 1
        const width = isLast
          ? lastRowWidth
          : `${80 + Math.random() * 20}%`
        return (
          <div
            key={i}
            className={cn(
              skeletonBase,
              'h-3.5 rounded',
              active && 'animate-pulse'
            )}
            style={{ width }}
          />
        )
      })}
    </div>
  )
}

/**
 * 卡片骨架
 */
function SkeletonCard({
  avatar = false,
  title = true,
  paragraphRows = 3,
  active = true,
  className,
}: SkeletonCardProps) {
  return (
    <div
      className={cn(
        'p-4 bg-cyber-panel/50 border border-cyber-border rounded-xl',
        className
      )}
    >
      {/* 头部 */}
      {(avatar || title) && (
        <div className="flex items-center gap-3 mb-4">
          {avatar && <SkeletonAvatar size="md" active={active} />}
          {title && (
            <div className="flex-1">
              <SkeletonText rows={1} firstRowWidth="50%" active={active} />
            </div>
          )}
        </div>
      )}

      {/* 内容 */}
      <SkeletonParagraph rows={paragraphRows} active={active} />

      {/* 底部 */}
      <div className="mt-4 pt-3 border-t border-cyber-border/50">
        <SkeletonText rows={1} firstRowWidth="30%" active={active} />
      </div>
    </div>
  )
}

/**
 * Cyber 终端风格骨架屏组件
 * - 头像 / 文字 / 段落 / 卡片
 * - 动画闪烁效果
 */
interface SkeletonComponent extends React.FC<SkeletonProps> {
  Avatar: typeof SkeletonAvatar
  Text: typeof SkeletonText
  Paragraph: typeof SkeletonParagraph
  Card: typeof SkeletonCard
}

export const Skeleton = SkeletonBlock as SkeletonComponent
Skeleton.Avatar = SkeletonAvatar
Skeleton.Text = SkeletonText
Skeleton.Paragraph = SkeletonParagraph
Skeleton.Card = SkeletonCard

export default Skeleton
