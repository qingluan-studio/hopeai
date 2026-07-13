import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
interface TabItem {
  /** 标签唯一 key */
  key: string
  /** 标签文字 */
  label: React.ReactNode
  /** 图标 */
  icon?: React.ReactNode
  /** 是否禁用 */
  disabled?: boolean
  /** 内容 */
  children?: React.ReactNode
}

interface TabsProps {
  /** 标签项列表 */
  items: TabItem[]
  /** 当前激活的 key（受控） */
  activeKey?: string
  /** 默认激活的 key */
  defaultActiveKey?: string
  /** 方向 */
  direction?: 'horizontal' | 'vertical'
  /** 是否可滚动（标签过多时） */
  scrollable?: boolean
  /** 切换回调 */
  onChange?: (key: string) => void
  /** 自定义类名 */
  className?: string
  /** 标签栏类名 */
  tabBarClassName?: string
  /** 内容区类名 */
  contentClassName?: string
  /** 主色调 */
  color?: string
  /** 是否显示内容 */
  showContent?: boolean
}

/**
 * Cyber 终端风格选项卡组件
 * - 选项卡切换
 * - 横向 / 竖向
 * - 可滚动
 * - 下划线动画
 * - 图标 + 文字
 */
export function Tabs({
  items,
  activeKey,
  defaultActiveKey,
  direction = 'horizontal',
  scrollable = false,
  onChange,
  className,
  tabBarClassName,
  contentClassName,
  color = '#00ff88',
  showContent = true,
}: TabsProps) {
  const [internalActiveKey, setInternalActiveKey] = useState<string>(
    defaultActiveKey || items[0]?.key || ''
  )
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({})
  const tabBarRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const isControlled = activeKey !== undefined
  const currentKey = isControlled ? activeKey! : internalActiveKey

  // 更新指示器位置
  const updateIndicator = (key: string) => {
    const tabEl = tabRefs.current[key]
    if (!tabEl || !tabBarRef.current) return

    const rect = tabEl.getBoundingClientRect()
    const parentRect = tabBarRef.current.getBoundingClientRect()

    if (direction === 'horizontal') {
      setIndicatorStyle({
        left: rect.left - parentRect.left,
        width: rect.width,
        top: 'auto',
        height: '2px',
      })
    } else {
      setIndicatorStyle({
        top: rect.top - parentRect.top,
        height: rect.height,
        left: 0,
        width: '2px',
      })
    }
  }

  useEffect(() => {
    updateIndicator(currentKey)
  }, [currentKey, direction, items])

  // 窗口大小变化时更新
  useEffect(() => {
    const handleResize = () => updateIndicator(currentKey)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentKey])

  const handleTabClick = (key: string) => {
    const item = items.find((i) => i.key === key)
    if (item?.disabled) return

    if (!isControlled) {
      setInternalActiveKey(key)
    }
    onChange?.(key)
  }

  const activeItem = items.find((i) => i.key === currentKey)

  // 横向布局
  if (direction === 'horizontal') {
    return (
      <div className={cn('w-full', className)}>
        {/* 标签栏 */}
        <div
          ref={tabBarRef}
          className={cn(
            'relative flex items-center border-b border-cyber-border',
            scrollable && 'overflow-x-auto scrollbar-hide',
            tabBarClassName
          )}
        >
          {items.map((item) => (
            <div
              key={item.key}
              ref={(el) => (tabRefs.current[item.key] = el)}
              onClick={() => handleTabClick(item.key)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-3 text-sm font-mono cursor-pointer transition-colors',
                'whitespace-nowrap',
                currentKey === item.key
                  ? 'text-cyber-accent'
                  : item.disabled
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-400 hover:text-cyber-text',
                'transition-colors duration-200'
              )}
              style={{ color: currentKey === item.key ? color : undefined }}
            >
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              <span>{item.label}</span>
            </div>
          ))}

          {/* 活动指示器 */}
          <div
            className="absolute bottom-0 transition-all duration-300 ease-out rounded-full"
            style={{
              ...indicatorStyle,
              backgroundColor: color,
              boxShadow: `0 0 8px ${color}`,
            }}
          />
        </div>

        {/* 内容区 */}
        {showContent && (
          <div className={cn('pt-4', contentClassName)}>
            {activeItem?.children}
          </div>
        )}
      </div>
    )
  }

  // 竖向布局
  return (
    <div className={cn('flex h-full', className)}>
      {/* 标签栏 */}
      <div
        ref={tabBarRef}
        className={cn(
          'relative flex flex-col border-r border-cyber-border flex-shrink-0',
          scrollable && 'overflow-y-auto scrollbar-hide',
          tabBarClassName
        )}
      >
        {items.map((item) => (
          <div
            key={item.key}
            ref={(el) => (tabRefs.current[item.key] = el)}
            onClick={() => handleTabClick(item.key)}
            className={cn(
              'relative flex items-center gap-2 px-4 py-3 text-sm font-mono cursor-pointer transition-colors',
              'whitespace-nowrap',
              currentKey === item.key
                ? 'text-cyber-accent bg-cyber-accent/5'
                : item.disabled
                ? 'text-gray-600 cursor-not-allowed'
                : 'text-gray-400 hover:text-cyber-text hover:bg-white/5',
              'transition-colors duration-200'
            )}
            style={{ color: currentKey === item.key ? color : undefined }}
          >
            {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
            <span>{item.label}</span>
          </div>
        ))}

        {/* 活动指示器 */}
        <div
          className="absolute left-0 transition-all duration-300 ease-out rounded-full"
          style={{
            ...indicatorStyle,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}`,
          }}
        />
      </div>

      {/* 内容区 */}
      {showContent && (
        <div className={cn('flex-1 pl-4 overflow-auto', contentClassName)}>
          {activeItem?.children}
        </div>
      )}
    </div>
  )
}

export default Tabs
