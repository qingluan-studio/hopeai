import { useState } from 'react'
import {
  Network,
  Plus,
  Trash2,
  Edit3,
  ChevronDown,
  ChevronRight,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Palette,
  Layout,
  FileText,
  FileJson,
  List,
  Image,
  Settings,
  MoreHorizontal,
  GripVertical,
  FolderOpen,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// 思维导图节点类型
interface MindMapNode {
  id: string
  text: string
  children: MindMapNode[]
  color?: string
  collapsed?: boolean
}

interface MindMapData {
  id: string
  title: string
  root: MindMapNode
  layout: 'mindmap' | 'org' | 'fishbone' | 'timeline'
  theme: 'cyber' | 'simple' | 'rainbow' | 'retro'
}

// 示例思维导图
const sampleMindMaps: MindMapData[] = [
  {
    id: '1',
    title: '产品规划',
    layout: 'mindmap',
    theme: 'cyber',
    root: {
      id: 'root',
      text: '产品规划 2026',
      color: '#00ff88',
      children: [
        {
          id: 'n1',
          text: '核心功能',
          color: '#00d4ff',
          children: [
            { id: 'n1-1', text: '对话系统', color: '#00d4ff', children: [] },
            { id: 'n1-2', text: '知识库', color: '#00d4ff', children: [] },
            { id: 'n1-3', text: 'Agent 协作', color: '#00d4ff', children: [] },
          ],
        },
        {
          id: 'n2',
          text: '技术架构',
          color: '#c084fc',
          children: [
            { id: 'n2-1', text: '前端 React', color: '#c084fc', children: [] },
            { id: 'n2-2', text: '后端 Node.js', color: '#c084fc', children: [] },
            { id: 'n2-3', text: '向量数据库', color: '#c084fc', children: [] },
          ],
        },
        {
          id: 'n3',
          text: '用户体验',
          color: '#f472b6',
          children: [
            { id: 'n3-1', text: '响应式设计', color: '#f472b6', children: [] },
            { id: 'n3-2', text: '性能优化', color: '#f472b6', children: [] },
          ],
        },
        {
          id: 'n4',
          text: '运营推广',
          color: '#fbbf24',
          children: [
            { id: 'n4-1', text: '内容营销', color: '#fbbf24', children: [] },
            { id: 'n4-2', text: '社区运营', color: '#fbbf24', children: [] },
          ],
        },
      ],
    },
  },
  {
    id: '2',
    title: '学习笔记 - 前端工程化',
    layout: 'org',
    theme: 'simple',
    root: {
      id: 'root',
      text: '前端工程化',
      color: '#00ff88',
      children: [
        {
          id: 'n1',
          text: '构建工具',
          color: '#00d4ff',
          children: [
            { id: 'n1-1', text: 'Webpack', color: '#00d4ff', children: [] },
            { id: 'n1-2', text: 'Vite', color: '#00d4ff', children: [] },
            { id: 'n1-3', text: 'Rollup', color: '#00d4ff', children: [] },
          ],
        },
        {
          id: 'n2',
          text: '代码规范',
          color: '#c084fc',
          children: [
            { id: 'n2-1', text: 'ESLint', color: '#c084fc', children: [] },
            { id: 'n2-2', text: 'Prettier', color: '#c084fc', children: [] },
            { id: 'n2-3', text: 'TypeScript', color: '#c084fc', children: [] },
          ],
        },
        {
          id: 'n3',
          text: '测试体系',
          color: '#f472b6',
          children: [
            { id: 'n3-1', text: '单元测试', color: '#f472b6', children: [] },
            { id: 'n3-2', text: 'E2E 测试', color: '#f472b6', children: [] },
          ],
        },
      ],
    },
  },
  {
    id: '3',
    title: '项目拆解 - HopeAgent',
    layout: 'mindmap',
    theme: 'rainbow',
    root: {
      id: 'root',
      text: 'HopeAgent Pro',
      color: '#00ff88',
      children: [
        {
          id: 'n1',
          text: '第一阶段',
          color: '#00d4ff',
          children: [
            { id: 'n1-1', text: '基础架构搭建', color: '#00d4ff', children: [] },
            { id: 'n1-2', text: '对话系统实现', color: '#00d4ff', children: [] },
          ],
        },
        {
          id: 'n2',
          text: '第二阶段',
          color: '#c084fc',
          children: [
            { id: 'n2-1', text: '知识库功能', color: '#c084fc', children: [] },
            { id: 'n2-2', text: '多 Agent 协作', color: '#c084fc', children: [] },
          ],
        },
        {
          id: 'n3',
          text: '第三阶段',
          color: '#f472b6',
          children: [
            { id: 'n3-1', text: '工作流编排', color: '#f472b6', children: [] },
            { id: 'n3-2', text: '数据分析', color: '#f472b6', children: [] },
          ],
        },
      ],
    },
  },
  {
    id: '4',
    title: '知识体系 - AI 算法',
    layout: 'fishbone',
    theme: 'retro',
    root: {
      id: 'root',
      text: 'AI 算法体系',
      color: '#00ff88',
      children: [
        {
          id: 'n1',
          text: '机器学习',
          color: '#00d4ff',
          children: [
            { id: 'n1-1', text: '监督学习', color: '#00d4ff', children: [] },
            { id: 'n1-2', text: '无监督学习', color: '#00d4ff', children: [] },
            { id: 'n1-3', text: '强化学习', color: '#00d4ff', children: [] },
          ],
        },
        {
          id: 'n2',
          text: '深度学习',
          color: '#c084fc',
          children: [
            { id: 'n2-1', text: 'CNN', color: '#c084fc', children: [] },
            { id: 'n2-2', text: 'RNN', color: '#c084fc', children: [] },
            { id: 'n2-3', text: 'Transformer', color: '#c084fc', children: [] },
          ],
        },
      ],
    },
  },
]

const layouts = [
  { id: 'mindmap', label: '思维导图', icon: '🧠' },
  { id: 'org', label: '组织结构图', icon: '📊' },
  { id: 'fishbone', label: '鱼骨图', icon: '🐟' },
  { id: 'timeline', label: '时间线', icon: '⏱️' },
]

const themes = [
  { id: 'cyber', label: 'Cyber 风', colors: ['#00ff88', '#00d4ff', '#c084fc', '#f472b6', '#fbbf24'] },
  { id: 'simple', label: '简约', colors: ['#6b7280', '#4b5563', '#374151', '#1f2937', '#111827'] },
  { id: 'rainbow', label: '彩虹', colors: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'] },
  { id: 'retro', label: '复古', colors: ['#b45309', '#92400e', '#78350f', '#451a03', '#7c2d12'] },
]

const colorPalette = ['#00ff88', '#00d4ff', '#c084fc', '#f472b6', '#fbbf24', '#34d399', '#f87171', '#60a5fa']

export default function MindMapPage() {
  const [showList, setShowList] = useState(false)
  const [currentMap, setCurrentMap] = useState<MindMapData>(sampleMindMaps[0])
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [zoom, setZoom] = useState(1)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const [showLayoutMenu, setShowLayoutMenu] = useState(false)
  const [viewMode, setViewMode] = useState<'outline' | 'visual'>('outline')

  const toggleCollapse = (nodeId: string) => {
    const updateNode = (node: MindMapNode): MindMapNode => {
      if (node.id === nodeId) {
        return { ...node, collapsed: !node.collapsed }
      }
      return { ...node, children: node.children.map(updateNode) }
    }
    setCurrentMap(prev => ({ ...prev, root: updateNode(prev.root) }))
  }

  const addChildNode = (parentId: string) => {
    const newNode: MindMapNode = {
      id: `n_${Date.now()}`,
      text: '新节点',
      children: [],
      color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
    }

    const addToNode = (node: MindMapNode): MindMapNode => {
      if (node.id === parentId) {
        return { ...node, children: [...node.children, newNode], collapsed: false }
      }
      return { ...node, children: node.children.map(addToNode) }
    }

    setCurrentMap(prev => ({ ...prev, root: addToNode(prev.root) }))
    setSelectedNodeId(newNode.id)
    setEditingNodeId(newNode.id)
    setEditText('新节点')
  }

  const deleteNode = (nodeId: string) => {
    if (nodeId === 'root') return

    const removeFromNode = (node: MindMapNode): MindMapNode => {
      return {
        ...node,
        children: node.children
          .filter(c => c.id !== nodeId)
          .map(removeFromNode),
      }
    }

    setCurrentMap(prev => ({ ...prev, root: removeFromNode(prev.root) }))
    setSelectedNodeId(null)
  }

  const startEdit = (node: MindMapNode) => {
    setEditingNodeId(node.id)
    setEditText(node.text)
  }

  const finishEdit = () => {
    if (!editingNodeId) return

    const updateNode = (node: MindMapNode): MindMapNode => {
      if (node.id === editingNodeId) {
        return { ...node, text: editText }
      }
      return { ...node, children: node.children.map(updateNode) }
    }

    setCurrentMap(prev => ({ ...prev, root: updateNode(prev.root) }))
    setEditingNodeId(null)
  }

  const changeNodeColor = (nodeId: string, color: string) => {
    const updateNode = (node: MindMapNode): MindMapNode => {
      if (node.id === nodeId) {
        return { ...node, color }
      }
      return { ...node, children: node.children.map(updateNode) }
    }

    setCurrentMap(prev => ({ ...prev, root: updateNode(prev.root) }))
  }

  const findNode = (node: MindMapNode, id: string): MindMapNode | null => {
    if (node.id === id) return node
    for (const child of node.children) {
      const found = findNode(child, id)
      if (found) return found
    }
    return null
  }

  const selectedNode = selectedNodeId ? findNode(currentMap.root, selectedNodeId) : null

  const exportToMarkdown = () => {
    const toMarkdown = (node: MindMapNode, level: number): string => {
      const prefix = '#'.repeat(Math.min(level + 1, 6))
      let result = `${prefix} ${node.text}\n\n`
      if (!node.collapsed) {
        for (const child of node.children) {
          result += toMarkdown(child, level + 1)
        }
      }
      return result
    }
    const md = toMarkdown(currentMap.root, 0)
    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentMap.title}.md`
    a.click()
    URL.revokeObjectURL(url)
    setShowExportMenu(false)
  }

  const exportToJSON = () => {
    const json = JSON.stringify(currentMap, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentMap.title}.json`
    a.click()
    URL.revokeObjectURL(url)
    setShowExportMenu(false)
  }

  const exportToText = () => {
    const toText = (node: MindMapNode, indent: number): string => {
      const prefix = '  '.repeat(indent) + '- '
      let result = `${prefix}${node.text}\n`
      if (!node.collapsed) {
        for (const child of node.children) {
          result += toText(child, indent + 1)
        }
      }
      return result
    }
    const text = toText(currentMap.root, 0)
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentMap.title}.txt`
    a.click()
    URL.revokeObjectURL(url)
    setShowExportMenu(false)
  }

  // 大纲列表节点渲染
  const OutlineNode = ({ node, level }: { node: MindMapNode; level: number }) => {
    const hasChildren = node.children.length > 0
    const isSelected = selectedNodeId === node.id
    const isEditing = editingNodeId === node.id

    return (
      <div>
        <div
          className={cn(
            'flex items-center gap-1.5 py-1.5 px-2 rounded-lg cursor-pointer transition-all group',
            isSelected ? 'bg-cyber-accent/10 border border-cyber-accent/30' : 'hover:bg-white/[0.02] border border-transparent'
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => setSelectedNodeId(node.id)}
        >
          {hasChildren ? (
            <button
              onClick={(e) => { e.stopPropagation(); toggleCollapse(node.id) }}
              className="p-0.5 rounded hover:bg-white/10 text-gray-500"
            >
              {node.collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          ) : (
            <span className="w-4.5" />
          )}

          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: node.color || '#00ff88' }}
          />

          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={finishEdit}
              onKeyDown={(e) => e.key === 'Enter' && finishEdit()}
              className="flex-1 bg-cyber-bg border border-cyber-accent/50 rounded px-2 py-0.5 text-xs text-cyber-text outline-none font-mono"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span
              className="text-xs text-gray-300 flex-1 truncate"
              onDoubleClick={() => startEdit(node)}
            >
              {node.text}
            </span>
          )}

          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); addChildNode(node.id) }}
              className="p-1 rounded hover:bg-cyber-accent/20 text-gray-500 hover:text-cyber-accent"
              title="添加子节点"
            >
              <Plus className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); startEdit(node) }}
              className="p-1 rounded hover:bg-white/10 text-gray-500 hover:text-gray-300"
              title="编辑"
            >
              <Edit3 className="w-3 h-3" />
            </button>
            {node.id !== 'root' && (
              <button
                onClick={(e) => { e.stopPropagation(); deleteNode(node.id) }}
                className="p-1 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400"
                title="删除"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {hasChildren && !node.collapsed && (
          <div>
            {node.children.map(child => (
              <OutlineNode key={child.id} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* 顶部标题栏 */}
      <div className="border-b border-cyber-border bg-cyber-panel/50 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowList(!showList)}
              className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-cyber-text transition-colors"
            >
              <FolderOpen className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-base font-bold text-cyber-text flex items-center gap-2">
                <Network className="w-4 h-4 text-cyber-accent" />
                {currentMap.title}
              </h1>
              <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
                思维导图 · 可视化思考
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* 视图切换 */}
            <div className="flex items-center bg-white/[0.02] rounded-lg p-0.5 border border-cyber-border/50">
              <button
                onClick={() => setViewMode('outline')}
                className={cn(
                  'p-1.5 rounded-md transition-all',
                  viewMode === 'outline' ? 'bg-cyber-accent/20 text-cyber-accent' : 'text-gray-500 hover:text-gray-300'
                )}
                title="大纲视图"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('visual')}
                className={cn(
                  'p-1.5 rounded-md transition-all',
                  viewMode === 'visual' ? 'bg-cyber-accent/20 text-cyber-accent' : 'text-gray-500 hover:text-gray-300'
                )}
                title="可视化视图"
              >
                <Network className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 布局 */}
            <div className="relative">
              <button
                onClick={() => setShowLayoutMenu(!showLayoutMenu)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-cyber-text transition-colors"
                title="布局"
              >
                <Layout className="w-4 h-4" />
              </button>
              {showLayoutMenu && (
                <div className="absolute right-0 top-full mt-1 bg-cyber-panel border border-cyber-border rounded-lg shadow-xl z-20 overflow-hidden min-w-[140px]">
                  {layouts.map(layout => (
                    <button
                      key={layout.id}
                      onClick={() => {
                        setCurrentMap(prev => ({ ...prev, layout: layout.id as any }))
                        setShowLayoutMenu(false)
                      }}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors',
                        currentMap.layout === layout.id ? 'bg-cyber-accent/10 text-cyber-accent' : 'text-gray-300 hover:bg-white/5'
                      )}
                    >
                      <span>{layout.icon}</span>
                      {layout.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 主题 */}
            <div className="relative">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-cyber-text transition-colors"
                title="主题"
              >
                <Palette className="w-4 h-4" />
              </button>
              {showThemeMenu && (
                <div className="absolute right-0 top-full mt-1 bg-cyber-panel border border-cyber-border rounded-lg shadow-xl z-20 overflow-hidden min-w-[140px]">
                  {themes.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        setCurrentMap(prev => ({ ...prev, theme: theme.id as any }))
                        setShowThemeMenu(false)
                      }}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors',
                        currentMap.theme === theme.id ? 'bg-cyber-accent/10 text-cyber-accent' : 'text-gray-300 hover:bg-white/5'
                      )}
                    >
                      <div className="flex gap-0.5">
                        {theme.colors.slice(0, 4).map((c, i) => (
                          <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                        ))}
                      </div>
                      {theme.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 导出 */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-cyber-text transition-colors"
                title="导出"
              >
                <Download className="w-4 h-4" />
              </button>
              {showExportMenu && (
                <div className="absolute right-0 top-full mt-1 bg-cyber-panel border border-cyber-border rounded-lg shadow-xl z-20 overflow-hidden min-w-[140px]">
                  <button
                    onClick={exportToMarkdown}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-white/5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-cyber-accent" />
                    导出 Markdown
                  </button>
                  <button
                    onClick={exportToJSON}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-white/5 transition-colors"
                  >
                    <FileJson className="w-3.5 h-3.5 text-cyber-accent" />
                    导出 JSON
                  </button>
                  <button
                    onClick={exportToText}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-white/5 transition-colors"
                  >
                    <List className="w-3.5 h-3.5 text-cyber-accent" />
                    导出文本大纲
                  </button>
                  <button
                    onClick={() => { alert('导出图片功能需要后端支持（演示版本）'); setShowExportMenu(false) }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-white/5 transition-colors"
                  >
                    <Image className="w-3.5 h-3.5 text-cyber-accent" />
                    导出图片
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* 思维导图列表侧边栏 */}
        {showList && (
          <div className="w-56 border-r border-cyber-border bg-cyber-panel/30 flex flex-col overflow-hidden flex-shrink-0">
            <div className="p-3 border-b border-cyber-border">
              <h3 className="text-xs font-mono text-gray-400">我的脑图</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {sampleMindMaps.map(map => (
                <button
                  key={map.id}
                  onClick={() => {
                    setCurrentMap(map)
                    setSelectedNodeId(null)
                    setShowList(false)
                  }}
                  className={cn(
                    'w-full flex items-center gap-2 p-2.5 rounded-lg text-left transition-all',
                    currentMap.id === map.id
                      ? 'bg-cyber-accent/10 border border-cyber-accent/30'
                      : 'bg-white/[0.02] border border-transparent hover:border-cyber-border/50'
                  )}
                >
                  <Network className="w-4 h-4 text-cyber-accent flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-300 truncate">{map.title}</div>
                    <div className="text-[10px] text-gray-600 font-mono mt-0.5">
                      {layouts.find(l => l.id === map.layout)?.label}
                    </div>
                  </div>
                </button>
              ))}

              <button className="w-full flex items-center gap-2 p-2.5 rounded-lg border border-dashed border-cyber-border/50 text-gray-500 hover:border-cyber-accent/30 hover:text-cyber-accent transition-all text-xs">
                <Plus className="w-4 h-4" />
                新建脑图
              </button>
            </div>
          </div>
        )}

        {/* 主内容区 */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* 工具栏 */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-cyber-border/50 bg-cyber-bg/50">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setZoom(z => Math.min(z + 0.1, 2))}
                className="p-1.5 rounded-md hover:bg-white/5 text-gray-500 hover:text-gray-300"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] text-gray-500 font-mono w-12 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))}
                className="p-1.5 rounded-md hover:bg-white/5 text-gray-500 hover:text-gray-300"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="p-1.5 rounded-md hover:bg-white/5 text-gray-500 hover:text-gray-300"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => addChildNode(selectedNodeId || 'root')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyber-accent/10 text-cyber-accent text-[10px] font-mono hover:bg-cyber-accent/20 transition-colors"
              >
                <Plus className="w-3 h-3" />
                添加节点
              </button>
            </div>
          </div>

          {/* 内容区 */}
          <div className="flex-1 overflow-auto p-4">
            {viewMode === 'outline' ? (
              /* 大纲视图 */
              <div className="max-w-2xl mx-auto bg-cyber-panel/30 rounded-xl border border-cyber-border/50 p-3">
                <OutlineNode node={currentMap.root} level={0} />
              </div>
            ) : (
              /* 可视化视图（简化版 SVG） */
              <div className="w-full h-full flex items-center justify-center">
                <svg viewBox="0 0 800 500" className="w-full h-full max-w-4xl" style={{ transform: `scale(${zoom})` }}>
                  {/* 根节点 */}
                  <rect x="320" y="220" width="160" height="60" rx="12" fill="#0a0e14" stroke={currentMap.root.color || '#00ff88'} strokeWidth="2" />
                  <text x="400" y="255" textAnchor="middle" fill={currentMap.root.color || '#00ff88'} fontSize="14" fontWeight="bold" fontFamily="monospace">
                    {currentMap.root.text}
                  </text>

                  {/* 子节点 */}
                  {currentMap.root.children.map((child, idx) => {
                    const y = 80 + idx * 110
                    const isLeft = idx % 2 === 0
                    const x = isLeft ? 80 : 560

                    return (
                      <g key={child.id}>
                        {/* 连线 */}
                        <path
                          d={isLeft
                            ? `M 320 250 Q 200 250 200 ${y + 25} Q 200 ${y + 25} ${x + 160} ${y + 25}`
                            : `M 480 250 Q 600 250 600 ${y + 25} Q 600 ${y + 25} ${x} ${y + 25}`
                          }
                          fill="none"
                          stroke={child.color || '#00d4ff'}
                          strokeWidth="1.5"
                          strokeDasharray="4 2"
                          opacity="0.6"
                        />
                        {/* 节点 */}
                        <rect x={x} y={y} width="160" height="50" rx="10" fill="#0a0e14" stroke={child.color || '#00d4ff'} strokeWidth="1.5" />
                        <text x={x + 80} y={y + 30} textAnchor="middle" fill={child.color || '#00d4ff'} fontSize="12" fontFamily="monospace">
                          {child.text}
                        </text>

                        {/* 孙子节点 */}
                        {child.children.slice(0, 2).map((grand, gIdx) => {
                          const gy = y + (gIdx - 0.5) * 60 + (gIdx === 0 ? -40 : 40)
                          const gx = isLeft ? x - 140 : x + 160

                          return (
                            <g key={grand.id}>
                              <path
                                d={isLeft
                                  ? `M ${x} ${y + 25} Q ${x - 40} ${y + 25} ${x - 40} ${gy + 18} Q ${x - 40} ${gy + 18} ${gx + 120} ${gy + 18}`
                                  : `M ${x + 160} ${y + 25} Q ${x + 200} ${y + 25} ${x + 200} ${gy + 18} Q ${x + 200} ${gy + 18} ${gx} ${gy + 18}`
                                }
                                fill="none"
                                stroke={grand.color || '#c084fc'}
                                strokeWidth="1"
                                strokeDasharray="3 2"
                                opacity="0.5"
                              />
                              <rect x={gx} y={gy} width="120" height="36" rx="8" fill="#0a0e14" stroke={grand.color || '#c084fc'} strokeWidth="1" />
                              <text x={gx + 60} y={gy + 22} textAnchor="middle" fill={grand.color || '#c084fc'} fontSize="10" fontFamily="monospace">
                                {grand.text}
                              </text>
                            </g>
                          )
                        })}
                      </g>
                    )
                  })}
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* 右侧属性面板 */}
        {selectedNode && (
          <div className="w-56 border-l border-cyber-border bg-cyber-panel/30 flex flex-col overflow-hidden flex-shrink-0 hidden md:flex">
            <div className="p-3 border-b border-cyber-border flex items-center justify-between">
              <h3 className="text-xs font-mono text-gray-400">节点属性</h3>
              <button
                onClick={() => setSelectedNodeId(null)}
                className="text-gray-500 hover:text-gray-300 text-sm"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              <div>
                <label className="text-[11px] text-gray-400 font-mono block mb-1.5">节点文本</label>
                <input
                  type="text"
                  value={selectedNode.text}
                  onChange={(e) => {
                    const updateNode = (node: MindMapNode): MindMapNode => {
                      if (node.id === selectedNode.id) return { ...node, text: e.target.value }
                      return { ...node, children: node.children.map(updateNode) }
                    }
                    setCurrentMap(prev => ({ ...prev, root: updateNode(prev.root) }))
                  }}
                  className="w-full px-2.5 py-2 rounded-lg bg-cyber-bg border border-cyber-border text-xs text-cyber-text outline-none focus:border-cyber-accent/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-400 font-mono block mb-2">节点颜色</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {colorPalette.map(color => (
                    <button
                      key={color}
                      onClick={() => changeNodeColor(selectedNode.id, color)}
                      className={cn(
                        'w-full aspect-square rounded-md border-2 transition-all',
                        selectedNode.color === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                      )}
                      style={{ background: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => addChildNode(selectedNode.id)}
                  className="w-full py-2 rounded-lg bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent text-xs font-mono hover:bg-cyber-accent/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  添加子节点
                </button>

                {selectedNode.id !== 'root' && (
                  <button
                    onClick={() => deleteNode(selectedNode.id)}
                    className="w-full py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono hover:bg-red-500/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    删除节点
                  </button>
                )}
              </div>

              <div className="pt-2 border-t border-cyber-border/50">
                <div className="text-[10px] text-gray-600 font-mono space-y-1">
                  <div className="flex justify-between">
                    <span>节点 ID:</span>
                    <span>{selectedNode.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>子节点数:</span>
                    <span>{selectedNode.children.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
