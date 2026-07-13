import React, { useState, useMemo } from 'react'
import { ChevronRight, Folder, FolderOpen, File } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
interface TreeNode {
  /** 唯一 key */
  key: string
  /** 标题 */
  title: React.ReactNode
  /** 子节点 */
  children?: TreeNode[]
  /** 是否禁用 */
  disabled?: boolean
  /** 是否禁用选中 */
  disableCheckbox?: boolean
  /** 图标 */
  icon?: React.ReactNode
  /** 是否是叶子节点 */
  isLeaf?: boolean
}

interface TreeProps {
  /** 树数据 */
  treeData: TreeNode[]
  /** 展开的 keys（受控） */
  expandedKeys?: string[]
  /** 默认展开 keys */
  defaultExpandedKeys?: string[]
  /** 选中的 keys（受控） */
  selectedKeys?: string[]
  /** 默认选中 keys */
  defaultSelectedKeys?: string[]
  /** 勾选的 keys（受控） */
  checkedKeys?: string[]
  /** 默认勾选 keys */
  defaultCheckedKeys?: string[]
  /** 是否显示复选框 */
  checkable?: boolean
  /** 是否可多选 */
  multiple?: boolean
  /** 展开回调 */
  onExpand?: (keys: string[]) => void
  /** 选中回调 */
  onSelect?: (keys: string[]) => void
  /** 勾选回调 */
  onCheck?: (keys: string[]) => void
  /** 自定义类名 */
  className?: string
}

/**
 * Cyber 终端风格树形组件
 * - 展开 / 折叠
 * - 选择 / 勾选
 * - 自定义图标
 */
export function Tree({
  treeData,
  expandedKeys,
  defaultExpandedKeys = [],
  selectedKeys,
  defaultSelectedKeys = [],
  checkedKeys,
  defaultCheckedKeys = [],
  checkable = false,
  multiple = false,
  onExpand,
  onSelect,
  onCheck,
  className,
}: TreeProps) {
  const [internalExpanded, setInternalExpanded] = useState<string[]>(defaultExpandedKeys)
  const [internalSelected, setInternalSelected] = useState<string[]>(defaultSelectedKeys)
  const [internalChecked, setInternalChecked] = useState<string[]>(defaultCheckedKeys)

  const isExpControlled = expandedKeys !== undefined
  const isSelControlled = selectedKeys !== undefined
  const isChkControlled = checkedKeys !== undefined

  const currentExpanded = isExpControlled ? expandedKeys : internalExpanded
  const currentSelected = isSelControlled ? selectedKeys : internalSelected
  const currentChecked = isChkControlled ? checkedKeys : internalChecked

  // 收集所有节点 key（含子节点）
  const collectKeys = (nodes: TreeNode[]): string[] => {
    const keys: string[] = []
    const walk = (list: TreeNode[]) => {
      list.forEach((n) => {
        keys.push(n.key)
        if (n.children) walk(n.children)
      })
    }
    walk(nodes)
    return keys
  }

  // 切换展开
  const toggleExpand = (key: string) => {
    const next = currentExpanded.includes(key)
      ? currentExpanded.filter((k) => k !== key)
      : [...currentExpanded, key]
    if (!isExpControlled) setInternalExpanded(next)
    onExpand?.(next)
  }

  // 切换选中
  const toggleSelect = (key: string, disabled?: boolean) => {
    if (disabled) return
    let next: string[]
    if (multiple) {
      next = currentSelected.includes(key)
        ? currentSelected.filter((k) => k !== key)
        : [...currentSelected, key]
    } else {
      next = currentSelected.includes(key) ? [] : [key]
    }
    if (!isSelControlled) setInternalSelected(next)
    onSelect?.(next)
  }

  // 切换勾选（含子节点联动）
  const toggleCheck = (node: TreeNode) => {
    if (node.disableCheckbox) return
    const childKeys = node.children ? collectKeys(node.children) : []
    const allKeys = [node.key, ...childKeys]
    const allChecked = allKeys.every((k) => currentChecked.includes(k))
    const next = allChecked
      ? currentChecked.filter((k) => !allKeys.includes(k))
      : [...new Set([...currentChecked, ...allKeys])]
    if (!isChkControlled) setInternalChecked(next)
    onCheck?.(next)
  }

  // 渲染节点
  const renderNode = (node: TreeNode, level: number) => {
    const expanded = currentExpanded.includes(node.key)
    const selected = currentSelected.includes(node.key)
    const checked = currentChecked.includes(node.key)
    const hasChildren = node.children && node.children.length > 0
    const isLeaf = node.isLeaf ?? !hasChildren

    // 复选框状态
    const childKeys = node.children ? collectKeys(node.children) : []
    const allChildChecked = childKeys.length > 0 && childKeys.every((k) => currentChecked.includes(k))
    const someChildChecked = childKeys.some((k) => currentChecked.includes(k))

    return (
      <div key={node.key}>
        <div
          className={cn(
            'flex items-center gap-1.5 py-1 px-2 rounded text-sm font-mono cursor-pointer transition-colors group',
            'hover:bg-cyber-accent/5',
            selected && 'bg-cyber-accent/10 text-cyber-accent',
            node.disabled && 'opacity-50 cursor-not-allowed'
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => toggleSelect(node.key, node.disabled)}
        >
          {/* 展开/折叠箭头 */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (hasChildren) toggleExpand(node.key)
            }}
            className={cn(
              'w-4 h-4 flex items-center justify-center flex-shrink-0 transition-transform',
              hasChildren ? 'text-gray-400 hover:text-cyber-accent' : 'opacity-0'
            )}
          >
            {hasChildren && (
              <ChevronRight className={cn('w-3 h-3 transition-transform', expanded && 'rotate-90')} />
            )}
          </button>

          {/* 复选框 */}
          {checkable && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleCheck(node)
              }}
              className={cn(
                'w-3.5 h-3.5 flex items-center justify-center border rounded flex-shrink-0 transition-all',
                checked || allChildChecked
                  ? 'bg-cyber-accent/20 border-cyber-accent'
                  : someChildChecked
                  ? 'border-cyber-accent'
                  : 'border-cyber-border'
              )}
            >
              {checked || allChildChecked ? (
                <span className="text-cyber-accent text-[10px]">✓</span>
              ) : someChildChecked ? (
                <span className="text-cyber-accent text-[10px]">–</span>
              ) : null}
            </button>
          )}

          {/* 图标 */}
          <span className="flex-shrink-0 text-cyber-accent">
            {node.icon ?? (isLeaf ? <File className="w-3.5 h-3.5" /> : expanded ? <FolderOpen className="w-3.5 h-3.5" /> : <Folder className="w-3.5 h-3.5" />)}
          </span>

          {/* 标题 */}
          <span className={cn('truncate', selected ? 'text-cyber-accent' : 'text-cyber-text')}>
            {node.title}
          </span>
        </div>

        {/* 子节点 */}
        {hasChildren && expanded && (
          <div>
            {node.children!.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      {treeData.map((node) => renderNode(node, 0))}
    </div>
  )
}

export default Tree
