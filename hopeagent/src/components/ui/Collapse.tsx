import React, { useState, useCallback } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
interface CollapsePanel {
  /** 唯一 key */
  key: string
  /** 标题 */
  header: React.ReactNode
  /** 内容 */
  children: React.ReactNode
  /** 是否禁用 */
  disabled?: boolean
  /** 是否默认展开 */
  defaultExpanded?: boolean
  /** 额外信息（右侧） */
  extra?: React.ReactNode
}

interface CollapseProps {
  /** 面板列表 */
  panels: CollapsePanel[]
  /** 当前展开项（受控） */
  activeKeys?: string[]
  /** 默认展开项 */
  defaultActiveKeys?: string[]
  /** 是否手风琴模式（只展开一个） */
  accordion?: boolean
  /** 自定义类名 */
  className?: string
  /** 面板类名 */
  panelClassName?: string
}

/**
 * Cyber 终端风格折叠面板
 * - 手风琴 / 多开模式
 * - 展开折叠动画
 * - 禁用面板
 */
export function Collapse({
  panels,
  activeKeys,
  defaultActiveKeys = [],
  accordion = false,
  className,
  panelClassName,
}: CollapseProps) {
  const [internalKeys, setInternalKeys] = useState<string[]>(defaultActiveKeys)
  const isControlled = activeKeys !== undefined
  const currentKeys = isControlled ? activeKeys! : internalKeys

  // 切换面板展开状态
  const toggle = useCallback(
    (key: string) => {
      let next: string[]
      if (accordion) {
        next = currentKeys.includes(key) ? [] : [key]
      } else {
        next = currentKeys.includes(key)
          ? currentKeys.filter((k) => k !== key)
          : [...currentKeys, key]
      }
      if (!isControlled) setInternalKeys(next)
    },
    [accordion, currentKeys, isControlled]
  )

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {panels.map((panel) => {
        const expanded = currentKeys.includes(panel.key)
        return (
          <div
            key={panel.key}
            className={cn(
              'border border-cyber-border rounded-lg overflow-hidden bg-cyber-panel/40 transition-colors',
              expanded && 'border-cyber-accent/40 shadow-[0_0_15px_rgba(0,255,136,0.1)]',
              panelClassName
            )}
          >
            {/* 头部 */}
            <div
              onClick={() => !panel.disabled && toggle(panel.key)}
              className={cn(
                'flex items-center justify-between px-4 py-3 transition-colors',
                panel.disabled
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer hover:bg-cyber-accent/5'
              )}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-xs font-mono text-cyber-accent flex-shrink-0">
                  {expanded ? '[-]' : '[+]'}
                </span>
                <span className="text-sm font-mono font-bold text-cyber-text truncate">
                  {panel.header}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {panel.extra}
                <ChevronDown
                  className={cn(
                    'w-4 h-4 text-gray-500 transition-transform duration-200',
                    expanded && 'rotate-180 text-cyber-accent'
                  )}
                />
              </div>
            </div>

            {/* 内容区 */}
            {expanded && (
              <div className="px-4 py-3 border-t border-cyber-border/50 text-sm text-gray-300 animate-slideDown">
                {panel.children}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default Collapse
