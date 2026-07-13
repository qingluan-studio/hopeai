import React, { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
interface Column<RecordType = any> {
  /** 列标题 */
  title: React.ReactNode
  /** 数据字段名 */
  dataIndex?: string
  /** 列唯一 key */
  key: string
  /** 宽度 */
  width?: number | string
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 是否可排序 */
  sorter?: boolean | ((a: RecordType, b: RecordType) => number)
  /** 自定义渲染 */
  render?: (value: any, record: RecordType, index: number) => React.ReactNode
  /** 固定列 */
  fixed?: 'left' | 'right'
}

interface TableProps<RecordType = any> {
  /** 列定义 */
  columns: Column<RecordType>[]
  /** 数据源 */
  dataSource: RecordType[]
  /** 行唯一 key */
  rowKey?: string | ((record: RecordType) => string)
  /** 是否斑马纹 */
  striped?: boolean
  /** 是否有边框 */
  bordered?: boolean
  /** 悬停高亮 */
  hoverable?: boolean
  /** 加载中状态 */
  loading?: boolean
  /** 空状态文案 */
  emptyText?: React.ReactNode
  /** 表格大小 */
  size?: 'sm' | 'md'
  /** 自定义类名 */
  className?: string
  /** 行点击回调 */
  onRowClick?: (record: RecordType, index: number) => void
}

// ============ 尺寸样式 ============
const sizeStyles = {
  sm: 'text-xs',
  md: 'text-sm',
}

const cellSizeStyles = {
  sm: 'px-2 py-1.5',
  md: 'px-3 py-2.5',
}

/**
 * Cyber 终端风格表格组件
 * - 列定义 columns
 * - 行数据 dataSource
 * - 斑马纹 / 边框 / 悬停高亮
 * - 简单排序
 * - 空状态
 * - 加载中 skeleton
 */
export function Table<RecordType extends Record<string, any> = any>({
  columns,
  dataSource,
  rowKey = 'id',
  striped = true,
  bordered = false,
  hoverable = true,
  loading = false,
  emptyText = '暂无数据',
  size = 'md',
  className,
  onRowClick,
}: TableProps<RecordType>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null)

  // 获取行 key
  const getRowKey = (record: RecordType, index: number): string => {
    if (typeof rowKey === 'function') return rowKey(record)
    return record[rowKey] ?? String(index)
  }

  // 处理排序
  const handleSort = (column: Column<RecordType>) => {
    if (!column.sorter) return

    if (sortKey !== column.key) {
      setSortKey(column.key)
      setSortOrder('asc')
    } else if (sortOrder === 'asc') {
      setSortOrder('desc')
    } else {
      setSortKey(null)
      setSortOrder(null)
    }
  }

  // 排序后的数据
  const sortedData = useMemo(() => {
    if (!sortKey || !sortOrder) return dataSource

    const column = columns.find((c) => c.key === sortKey)
    if (!column) return dataSource

    return [...dataSource].sort((a, b) => {
      if (typeof column.sorter === 'function') {
        const result = column.sorter(a, b)
        return sortOrder === 'asc' ? result : -result
      }

      const aVal = a[column.dataIndex as string]
      const bVal = b[column.dataIndex as string]

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }, [dataSource, sortKey, sortOrder, columns])

  // 渲染单元格内容
  const renderCell = (column: Column<RecordType>, record: RecordType, index: number) => {
    if (column.render) {
      const value = column.dataIndex ? record[column.dataIndex] : undefined
      return column.render(value, record, index)
    }
    if (column.dataIndex) {
      return record[column.dataIndex]
    }
    return null
  }

  // Skeleton 加载行
  const renderSkeletonRows = () => {
    return Array.from({ length: 5 }).map((_, i) => (
      <tr key={i} className="border-b border-cyber-border/50">
        {columns.map((col, j) => (
          <td key={j} className={cellSizeStyles[size]}>
            <div className="h-4 bg-cyber-border/50 rounded animate-pulse w-full" style={{ maxWidth: `${60 + Math.random() * 40}%` }} />
          </td>
        ))}
      </tr>
    ))
  }

  return (
    <div className={cn('w-full overflow-auto rounded-lg', bordered && 'border border-cyber-border', className)}>
      <table className={cn('w-full font-mono', sizeStyles[size])}>
        {/* 表头 */}
        <thead>
          <tr className="bg-cyber-accent/5 border-b border-cyber-border">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'font-medium text-left text-gray-400',
                  cellSizeStyles[size],
                  column.align === 'center' && 'text-center',
                  column.align === 'right' && 'text-right',
                  column.sorter && 'cursor-pointer select-none hover:text-cyber-accent transition-colors',
                  column.width && `w-[${column.width}px]`
                )}
                style={{ width: column.width }}
                onClick={() => handleSort(column)}
              >
                <span className="inline-flex items-center gap-1">
                  {column.title}
                  {column.sorter && (
                    <span className="flex flex-col -space-y-1">
                      <ChevronUp
                        className={cn(
                          'w-3 h-3 transition-colors',
                          sortKey === column.key && sortOrder === 'asc'
                            ? 'text-cyber-accent'
                            : 'text-gray-600'
                        )}
                      />
                      <ChevronDown
                        className={cn(
                          'w-3 h-3 transition-colors',
                          sortKey === column.key && sortOrder === 'desc'
                            ? 'text-cyber-accent'
                            : 'text-gray-600'
                        )}
                      />
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        {/* 表体 */}
        <tbody>
          {loading ? (
            renderSkeletonRows()
          ) : sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center">
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <div className="w-12 h-12 rounded-full bg-cyber-border/30 flex items-center justify-center">
                    <span className="text-xl">📭</span>
                  </div>
                  <span className="text-xs">{emptyText}</span>
                </div>
              </td>
            </tr>
          ) : (
            sortedData.map((record, index) => (
              <tr
                key={getRowKey(record, index)}
                className={cn(
                  'border-b border-cyber-border/50 transition-colors',
                  striped && index % 2 === 1 && 'bg-cyber-bg/50',
                  hoverable && 'hover:bg-cyber-accent/5',
                  onRowClick && 'cursor-pointer'
                )}
                onClick={() => onRowClick?.(record, index)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      'text-cyber-text',
                      cellSizeStyles[size],
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right'
                    )}
                  >
                    {renderCell(column, record, index)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 加载中遮罩 */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-cyber-bg/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-cyber-accent">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-mono">加载中...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Table
