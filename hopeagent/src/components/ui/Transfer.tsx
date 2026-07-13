import React, { useState, useMemo } from 'react'
import { ChevronRight, ChevronLeft, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
interface TransferItem {
  /** 唯一 key */
  key: string
  /** 标题 */
  title: React.ReactNode
  /** 描述 */
  description?: React.ReactNode
  /** 是否禁用 */
  disabled?: boolean
}

interface TransferProps {
  /** 全部数据 */
  dataSource: TransferItem[]
  /** 当前右侧 keys（受控） */
  targetKeys?: string[]
  /** 默认右侧 keys */
  defaultTargetKeys?: string[]
  /** 是否可搜索 */
  searchable?: boolean
  /** 左侧标题 */
  titles?: [string, string]
  /** 变化回调 */
  onChange?: (targetKeys: string[], direction: 'left' | 'right', moveKeys: string[]) => void
  /** 自定义类名 */
  className?: string
}

/**
 * Cyber 终端风格穿梭框
 * - 左右列表选择
 * - 搜索过滤
 * - 批量移动
 */
export function Transfer({
  dataSource,
  targetKeys,
  defaultTargetKeys = [],
  searchable = false,
  titles = ['源列表', '目标列表'],
  onChange,
  className,
}: TransferProps) {
  const [internalTarget, setInternalTarget] = useState<string[]>(defaultTargetKeys)
  const isControlled = targetKeys !== undefined
  const currentTarget = isControlled ? targetKeys : internalTarget

  const [leftChecked, setLeftChecked] = useState<string[]>([])
  const [rightChecked, setRightChecked] = useState<string[]>([])
  const [leftSearch, setLeftSearch] = useState('')
  const [rightSearch, setRightSearch] = useState('')

  // 源数据
  const leftItems = useMemo(() => {
    return dataSource
      .filter((item) => !currentTarget.includes(item.key))
      .filter((item) => !searchable || !leftSearch || String(item.title).toLowerCase().includes(leftSearch.toLowerCase()))
  }, [dataSource, currentTarget, searchable, leftSearch])

  // 目标数据
  const rightItems = useMemo(() => {
    return dataSource
      .filter((item) => currentTarget.includes(item.key))
      .filter((item) => !searchable || !rightSearch || String(item.title).toLowerCase().includes(rightSearch.toLowerCase()))
  }, [dataSource, currentTarget, searchable, rightSearch])

  // 移到右侧
  const moveToRight = () => {
    if (leftChecked.length === 0) return
    const next = [...currentTarget, ...leftChecked]
    if (!isControlled) setInternalTarget(next)
    onChange?.(next, 'right', leftChecked)
    setLeftChecked([])
  }

  // 移到左侧
  const moveToLeft = () => {
    if (rightChecked.length === 0) return
    const moveKeys = rightChecked
    const next = currentTarget.filter((k) => !rightChecked.includes(k))
    if (!isControlled) setInternalTarget(next)
    onChange?.(next, 'left', moveKeys)
    setRightChecked([])
  }

  // 列表面板
  const Panel = ({
    items,
    checked,
    setChecked,
    title,
    search,
    setSearch,
  }: {
    items: TransferItem[]
    checked: string[]
    setChecked: (v: string[]) => void
    title: string
    search: string
    setSearch: (v: string) => void
  }) => {
    const allChecked = items.length > 0 && items.every((i) => checked.includes(i.key) || i.disabled)
    const someChecked = items.some((i) => checked.includes(i.key))

    const toggleItem = (key: string, disabled?: boolean) => {
      if (disabled) return
      setChecked(checked.includes(key) ? checked.filter((k) => k !== key) : [...checked, key])
    }

    return (
      <div className="flex-1 border border-cyber-border rounded-lg bg-cyber-panel/40 overflow-hidden flex flex-col min-w-[160px]">
        {/* 头部 */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-cyber-border/50 bg-gradient-to-r from-cyber-accent/5 to-transparent">
          <button
            onClick={() => setChecked(allChecked ? [] : items.filter((i) => !i.disabled).map((i) => i.key))}
            className={cn(
              'w-4 h-4 flex items-center justify-center border rounded transition-all flex-shrink-0',
              allChecked || someChecked
                ? 'bg-cyber-accent/20 border-cyber-accent'
                : 'border-cyber-border'
            )}
          >
            {(allChecked || someChecked) && (
              <span className="text-cyber-accent text-[10px] leading-none">
                {allChecked ? '✓' : '–'}
              </span>
            )}
          </button>
          <span className="text-sm font-mono font-bold text-cyber-text flex-1">{title}</span>
          <span className="text-xs text-gray-500 font-mono">{items.length}</span>
        </div>
        {/* 搜索 */}
        {searchable && (
          <div className="px-2 py-1.5 border-b border-cyber-border/50 flex items-center gap-1">
            <Search className="w-3 h-3 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索..."
              className="flex-1 bg-transparent outline-none text-xs font-mono text-cyber-text placeholder:text-gray-600"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-gray-500 hover:text-cyber-text">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
        {/* 列表 */}
        <div className="flex-1 overflow-y-auto max-h-60 min-h-[120px]">
          {items.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-600 font-mono">无数据</div>
          ) : (
            items.map((item) => {
              const isChecked = checked.includes(item.key)
              return (
                <div
                  key={item.key}
                  onClick={() => toggleItem(item.key, item.disabled)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 text-sm font-mono cursor-pointer transition-colors border-b border-cyber-border/20',
                    item.disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : isChecked
                      ? 'bg-cyber-accent/10 text-cyber-accent'
                      : 'text-gray-300 hover:bg-cyber-accent/5'
                  )}
                >
                  <span
                    className={cn(
                      'w-3.5 h-3.5 flex items-center justify-center border rounded flex-shrink-0',
                      isChecked ? 'bg-cyber-accent/20 border-cyber-accent' : 'border-cyber-border'
                    )}
                  >
                    {isChecked && <span className="text-cyber-accent text-[10px]">✓</span>}
                  </span>
                  <span className="flex-1 truncate">{item.title}</span>
                </div>
              )
            })
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex items-stretch gap-2', className)}>
      {/* 左侧 */}
      <Panel
        items={leftItems}
        checked={leftChecked}
        setChecked={setLeftChecked}
        title={titles[0]}
        search={leftSearch}
        setSearch={setLeftSearch}
      />

      {/* 中间操作按钮 */}
      <div className="flex flex-col justify-center gap-1">
        <button
          onClick={moveToRight}
          disabled={leftChecked.length === 0}
          className="w-8 h-8 flex items-center justify-center border border-cyber-border rounded bg-cyber-panel text-gray-400 hover:text-cyber-accent hover:border-cyber-accent/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={moveToLeft}
          disabled={rightChecked.length === 0}
          className="w-8 h-8 flex items-center justify-center border border-cyber-border rounded bg-cyber-panel text-gray-400 hover:text-cyber-accent hover:border-cyber-accent/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* 右侧 */}
      <Panel
        items={rightItems}
        checked={rightChecked}
        setChecked={setRightChecked}
        title={titles[1]}
        search={rightSearch}
        setSearch={setRightSearch}
      />
    </div>
  )
}

export default Transfer
