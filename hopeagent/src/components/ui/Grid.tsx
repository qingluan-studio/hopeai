import React from 'react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface RowProps {
  /** 列间距（单位：px 或 [水平, 垂直]） */
  gutter?: number | [number, number]
  /** 对齐方式 */
  align?: 'top' | 'middle' | 'bottom'
  /** 水平排列方式 */
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between'
  /** 子元素 */
  children?: React.ReactNode
  /** 自定义类名 */
  className?: string
  /** 是否自动换行 */
  wrap?: boolean
}

interface ColProps {
  /** 栅格占比（1-24） */
  span?: number
  /** 左侧偏移量 */
  offset?: number
  /** 向右偏移 */
  push?: number
  /** 向左偏移 */
  pull?: number
  /** 子元素 */
  children?: React.ReactNode
  /** 自定义类名 */
  className?: string
  /** 响应式配置 */
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
}

// ============ 断点映射 ============
const breakpointMap: Record<Breakpoint, string> = {
  xs: '',
  sm: 'sm:',
  md: 'md:',
  lg: 'lg:',
  xl: 'xl:',
}

/**
 * 根据 span 生成宽度样式类名
 */
const getSpanClass = (span: number, prefix: string = ''): string => {
  const percent = (span / 24) * 100
  return `${prefix}w-[${percent}%]`
}

/**
 * Cyber 终端风格栅格组件
 * - Row / Col 栅格布局
 * - 24 栏栅格系统
 * - 响应式断点
 * - 间距 gutter 支持
 */
export function Row({
  gutter = 0,
  align = 'top',
  justify = 'start',
  children,
  className,
  wrap = true,
}: RowProps) {
  // 处理 gutter
  const horizontalGutter = Array.isArray(gutter) ? gutter[0] : gutter
  const verticalGutter = Array.isArray(gutter) ? gutter[1] : 0

  // 对齐方式
  const alignMap = {
    top: 'items-start',
    middle: 'items-center',
    bottom: 'items-end',
  }

  const justifyMap = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    'space-around': 'justify-around',
    'space-between': 'justify-between',
  }

  // 为子元素添加 gutter 样式
  const clonedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child
    return React.cloneElement(child as React.ReactElement<any>, {
      style: {
        paddingLeft: horizontalGutter / 2,
        paddingRight: horizontalGutter / 2,
        paddingTop: verticalGutter / 2,
        paddingBottom: verticalGutter / 2,
        ...(child.props as any).style,
      },
    })
  })

  return (
    <div
      className={cn(
        'flex flex-row',
        alignMap[align],
        justifyMap[justify],
        wrap && 'flex-wrap',
        className
      )}
      style={{
        marginLeft: -horizontalGutter / 2,
        marginRight: -horizontalGutter / 2,
        marginTop: -verticalGutter / 2,
        marginBottom: -verticalGutter / 2,
      }}
    >
      {clonedChildren}
    </div>
  )
}

/**
 * Col 列组件
 */
export function Col({
  span = 24,
  offset = 0,
  push = 0,
  pull = 0,
  children,
  className,
  xs,
  sm,
  md,
  lg,
  xl,
  ...props
}: ColProps & React.HTMLAttributes<HTMLDivElement>) {
  // 生成宽度样式
  const widthStyle: React.CSSProperties = {
    width: `${(span / 24) * 100}%`,
  }

  // 偏移样式
  const offsetStyle: React.CSSProperties = {
    marginLeft: offset > 0 ? `${(offset / 24) * 100}%` : undefined,
    left: push > 0 ? `${(push / 24) * 100}%` : undefined,
    right: pull > 0 ? `${(pull / 24) * 100}%` : undefined,
  }

  // 响应式断点样式
  const responsiveStyle: Record<string, React.CSSProperties> = {}
  const breakpoints: [Breakpoint, number | undefined][] = [
    ['xs', xs],
    ['sm', sm],
    ['md', md],
    ['lg', lg],
    ['xl', xl],
  ]

  return (
    <div
      className={cn('flex-shrink-0', className)}
      style={{ ...widthStyle, ...offsetStyle, ...props.style }}
      {...props}
    >
      {children}
    </div>
  )
}

// Grid 命名空间
export const Grid = {
  Row,
  Col,
}

export default Grid
