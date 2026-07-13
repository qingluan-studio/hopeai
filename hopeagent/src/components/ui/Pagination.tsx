import React, { useMemo } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
interface PaginationProps {
  /** 当前页码（受控） */
  current?: number
  /** 默认页码 */
  defaultCurrent?: number
  /** 总条数 */
  total?: number
  /** 每页条数 */
  pageSize?: number
  /** 是否显示总数 */
  showTotal?: boolean
  /** 是否显示每页条数选择器 */
  showSizeChanger?: boolean
  /** 每页条数选项 */
  pageSizeOptions?: number[]
  /** 页码变化回调 */
  onChange?: (page: number, pageSize: number) => void
  /** 每页条数变化回调 */
  onPageSizeChange?: (pageSize: number) => void
  /** 自定义类名 */
  className?: string
}

/**
 * Cyber 终端风格分页器
 * - 页码 / 前后跳 / 首末页跳
 * - 每页条数选择器
 * - 总数显示
 */
export function Pagination({
  current = 1,
  total = 0,
  pageSize = 10,
  showTotal = true,
  showSizeChanger = false,
  pageSizeOptions = [10, 20, 50, 100],
  onChange,
  onPageSizeChange,
  className,
}: PaginationProps) {
  // 计算总页数
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  // 生成页码列表
  const pageList = useMemo(() => {
    const list: (number | string)[] = []
    const delta = 1
    const range: (number | string)[] = []
    const left = Math.max(2, current - delta)
    const right = Math.min(totalPages - 1, current + delta)

    range.push(1)
    if (left > 2) range.push('...')
    for (let i = left; i <= right; i++) range.push(i)
    if (right < totalPages - 1) range.push('...')
    if (totalPages > 1) range.push(totalPages)

    return range
  }, [current, totalPages])

  // 跳转到指定页
  const goTo = (page: number) => {
    const target = Math.min(Math.max(1, page), totalPages)
    if (target !== current) onChange?.(target, pageSize)
  }

  // 页码按钮
  const PageBtn = ({ page, children, active }: { page: number; children: React.ReactNode; active?: boolean }) => (
    <button
      onClick={() => goTo(page)}
      className={cn(
        'min-w-[28px] h-7 px-1.5 text-xs font-mono rounded transition-all border',
        active
          ? 'bg-cyber-accent/20 border-cyber-accent text-cyber-accent shadow-[0_0_10px_rgba(0,255,136,0.3)]'
          : 'bg-cyber-panel border-cyber-border text-gray-400 hover:border-cyber-accent/40 hover:text-cyber-text'
      )}
    >
      {children}
    </button>
  )

  return (
    <div className={cn('flex items-center gap-1.5 text-xs font-mono', className)}>
      {/* 总数 */}
      {showTotal && (
        <span className="text-gray-500 mr-2">
          共 <span className="text-cyber-accent">{total}</span> 条
        </span>
      )}

      {/* 首页 */}
      <button
        onClick={() => goTo(1)}
        disabled={current === 1}
        className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-cyber-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronsLeft className="w-3.5 h-3.5" />
      </button>

      {/* 上一页 */}
      <button
        onClick={() => goTo(current - 1)}
        disabled={current === 1}
        className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-cyber-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      {/* 页码 */}
      {pageList.map((p, idx) =>
        typeof p === 'number' ? (
          <PageBtn key={idx} page={p} active={p === current}>
            {p}
          </PageBtn>
        ) : (
          <span key={idx} className="px-1 text-gray-600">
            {p}
          </span>
        )
      )}

      {/* 下一页 */}
      <button
        onClick={() => goTo(current + 1)}
        disabled={current === totalPages}
        className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-cyber-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>

      {/* 末页 */}
      <button
        onClick={() => goTo(totalPages)}
        disabled={current === totalPages}
        className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-cyber-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronsRight className="w-3.5 h-3.5" />
      </button>

      {/* 每页条数 */}
      {showSizeChanger && (
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
          className="h-7 px-1.5 ml-2 bg-cyber-panel border border-cyber-border text-cyber-text rounded text-xs font-mono outline-none focus:border-cyber-accent/60"
        >
          {pageSizeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}/页
            </option>
          ))}
        </select>
      )}
    </div>
  )
}

export default Pagination
