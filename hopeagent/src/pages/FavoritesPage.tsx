import { useState, useMemo } from 'react'
import {
  Star,
  Search,
  Plus,
  Grid,
  List,
  Tag,
  Edit3,
  Trash2,
  X,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Copy,
  Download,
  Upload,
  MessageSquare,
  BookOpen,
  Wrench,
  Globe,
  FileText,
  Code2,
  Eye,
  TrendingUp,
  Clock,
  Bookmark,
  Share2,
  Filter,
  MoreVertical,
  Archive,
  StarOff,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============

// 收藏分类
type FavoriteCategory = 'conversation' | 'knowledge' | 'tool' | 'webpage' | 'file' | 'code'

// 收藏项
interface FavoriteItem {
  id: string
  title: string
  description: string
  category: FavoriteCategory
  source: string
  url?: string
  tags: string[]
  folderId: string | null
  visits: number
  lastVisitedAt: string | null
  createdAt: string
  content?: string
}

// 收藏夹文件夹
interface FavoriteFolder {
  id: string
  name: string
  color: string
}

// 视图模式
type ViewMode = 'grid' | 'list'

// 排序方式
type SortMode = 'time' | 'name' | 'category' | 'visits'

// ============ 常量配置 ============

// 分类配置
const categoryConfig: Record<FavoriteCategory, { label: string; color: string; bgColor: string; icon: typeof Star }> = {
  conversation: { label: '对话', color: 'text-cyan-400', bgColor: 'bg-cyan-500/10', icon: MessageSquare },
  knowledge: { label: '知识', color: 'text-cyber-accent', bgColor: 'bg-cyber-accent/10', icon: BookOpen },
  tool: { label: '工具', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', icon: Wrench },
  webpage: { label: '网页', color: 'text-purple-400', bgColor: 'bg-purple-500/10', icon: Globe },
  file: { label: '文件', color: 'text-orange-400', bgColor: 'bg-orange-500/10', icon: FileText },
  code: { label: '代码片段', color: 'text-pink-400', bgColor: 'bg-pink-500/10', icon: Code2 },
}

// 文件夹颜色
const folderColors = ['#00ff88', '#00d4ff', '#c084fc', '#fbbf24', '#f87171', '#ec4899']

// 所有标签
const allTags = ['前端', '后端', '设计', '工具', '学习', '参考', '灵感', '常用', '重要', '收藏', '技术', '资源']

// ============ Mock 数据生成 ============

const generateMockFavorites = (): FavoriteItem[] => {
  const titles: Record<FavoriteCategory, string[]> = {
    conversation: ['React性能优化对话', 'Vue3迁移方案讨论', 'TypeScript类型推导', 'Node.js部署问题', 'CSS布局技巧', '数据库设计咨询', 'API设计建议', '前端安全防护'],
    knowledge: ['JavaScript闭包详解', 'CSS Grid完全指南', 'HTTP/2特性总结', 'Webpack配置手册', 'Git工作流规范', '设计模式精要', '算法基础笔记', '前端工程化实践'],
    tool: ['JSON格式化工具', '正则表达式测试', '颜色取色器', 'Base64编解码', 'Markdown编辑器', 'API测试工具', '图片压缩', '代码美化工具'],
    webpage: ['MDN Web Docs', 'React官方文档', 'Tailwind CSS官网', 'TypeScript中文手册', 'Vue.js指南', 'Can I Use', 'CodePen', 'GitHub Trending'],
    file: ['项目架构设计文档.pdf', '前端规范v2.0.docx', 'UI设计规范.fig', 'API接口文档.json', '数据库ER图.png', '部署手册.md', '技术选型报告.pdf', '会议纪要.docx'],
    code: ['防抖节流函数', '深拷贝实现', 'Promise.all并发控制', '事件委托封装', 'URL参数解析', '日期格式化', '数组去重方法', 'Cookie操作工具'],
  }
  const sources = ['智能助手', '知识库', '浏览器', '本地文件', '代码片段', '社区分享']
  const descriptions = [
    '非常实用的内容，包含详细说明和示例代码。',
    '解决了关键问题，建议收藏备用。',
    '高质量参考资源，值得反复阅读。',
    '日常工作必备工具，提升效率神器。',
    '官方权威文档，遇到问题首先查阅。',
    '精选代码片段，可直接复用到项目中。',
  ]

  const items: FavoriteItem[] = []
  const now = Date.now()

  for (let i = 0; i < 40; i++) {
    const categories: FavoriteCategory[] = ['conversation', 'knowledge', 'tool', 'webpage', 'file', 'code']
    const category = categories[i % 6]
    const catTitles = titles[category]
    const title = catTitles[i % catTitles.length]
    const createdAt = new Date(now - i * 86400000 * 0.5).toISOString()
    const visits = Math.floor(Math.random() * 50)

    items.push({
      id: `fav_${i + 1}`,
      title,
      description: descriptions[i % descriptions.length],
      category,
      source: sources[i % sources.length],
      url: category === 'webpage' ? `https://example.com/${i + 1}` : undefined,
      tags: [allTags[i % allTags.length], allTags[(i + 4) % allTags.length]].filter((v, idx, arr) => arr.indexOf(v) === idx),
      folderId: i % 3 === 0 ? `folder_${(i % 3) + 1}` : null,
      visits,
      lastVisitedAt: visits > 0 ? new Date(now - Math.floor(Math.random() * 7) * 86400000).toISOString() : null,
      createdAt,
      content: category === 'code' ? `// ${title}\nfunction example() {\n  console.log('Hello World')\n}` : undefined,
    })
  }

  return items
}

const initialFavorites = generateMockFavorites()

// 初始文件夹
const initialFolders: FavoriteFolder[] = [
  { id: 'folder_1', name: '前端开发', color: '#00ff88' },
  { id: 'folder_2', name: '学习资源', color: '#00d4ff' },
  { id: 'folder_3', name: '常用工具', color: '#fbbf24' },
]

// ============ 主组件 ============

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(initialFavorites)
  const [folders, setFolders] = useState<FavoriteFolder[]>(initialFolders)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<FavoriteCategory | 'all'>('all')
  const [activeFolder, setActiveFolder] = useState<string | 'all'>('all')
  const [activeTag, setActiveTag] = useState<string>('all')
  const [sortMode, setSortMode] = useState<SortMode>('time')
  const [showFilter, setShowFilter] = useState(false)
  const [editingItem, setEditingItem] = useState<FavoriteItem | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [showFolderManager, setShowFolderManager] = useState(false)
  const [showImportExport, setShowImportExport] = useState<'import' | 'export' | null>(null)

  // 过滤后收藏
  const filteredFavorites = useMemo(() => {
    let result = favorites
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(f =>
        f.title.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.source.toLowerCase().includes(q)
      )
    }
    if (activeCategory !== 'all') result = result.filter(f => f.category === activeCategory)
    if (activeFolder !== 'all') result = result.filter(f => f.folderId === activeFolder)
    if (activeTag !== 'all') result = result.filter(f => f.tags.includes(activeTag))
    // 排序
    result = [...result].sort((a, b) => {
      if (sortMode === 'time') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sortMode === 'name') return a.title.localeCompare(b.title)
      if (sortMode === 'category') return a.category.localeCompare(b.category)
      if (sortMode === 'visits') return b.visits - a.visits
      return 0
    })
    return result
  }, [favorites, searchQuery, activeCategory, activeFolder, activeTag, sortMode])

  // 统计
  const stats = useMemo(() => {
    const total = favorites.length
    const totalVisits = favorites.reduce((sum, f) => sum + f.visits, 0)
    const mostVisited = [...favorites].sort((a, b) => b.visits - a.visits)[0]
    const recent = [...favorites].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    return {
      total,
      totalVisits,
      mostVisited,
      recent,
      categories: Object.keys(categoryConfig).map(cat => ({
        cat: cat as FavoriteCategory,
        count: favorites.filter(f => f.category === cat).length,
      })),
    }
  }, [favorites])

  // 删除
  const handleDelete = (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id))
  }

  // 保存
  const handleSave = (item: FavoriteItem) => {
    if (isCreating) {
      setFavorites(prev => [item, ...prev])
    } else {
      setFavorites(prev => prev.map(f => f.id === item.id ? item : f))
    }
    setEditingItem(null)
    setIsCreating(false)
  }

  // 访问
  const handleVisit = (item: FavoriteItem) => {
    setFavorites(prev => prev.map(f => f.id === item.id ? { ...f, visits: f.visits + 1, lastVisitedAt: new Date().toISOString() } : f))
    if (item.url) window.open(item.url, '_blank')
  }

  // 移动到文件夹
  const handleMoveToFolder = (id: string, folderId: string | null) => {
    setFavorites(prev => prev.map(f => f.id === id ? { ...f, folderId } : f))
  }

  // 文件夹管理
  const handleAddFolder = (name: string, color: string) => {
    setFolders(prev => [...prev, { id: `folder_${Date.now()}`, name, color }])
  }

  const handleRenameFolder = (id: string, name: string) => {
    setFolders(prev => prev.map(f => f.id === id ? { ...f, name } : f))
  }

  const handleDeleteFolder = (id: string) => {
    setFolders(prev => prev.filter(f => f.id !== id))
    setFavorites(prev => prev.map(f => f.folderId === id ? { ...f, folderId: null } : f))
    if (activeFolder === id) setActiveFolder('all')
  }

  // 导入导出
  const handleExport = () => {
    const data = JSON.stringify({ favorites, folders }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hopeagent_favorites_${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    setShowImportExport(null)
  }

  const handleImport = () => {
    // 模拟导入
    setShowImportExport(null)
  }

  const hasActiveFilter = activeCategory !== 'all' || activeFolder !== 'all' || activeTag !== 'all'

  return (
    <div className="h-full flex flex-col bg-cyber-bg">
      {/* 顶部标题栏 */}
      <div className="border-b border-cyber-border/30 bg-cyber-panel/40 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-base font-bold text-cyber-text flex items-center gap-2">
              <Star className="w-4 h-4 text-cyber-accent" fill="currentColor" />
              收藏夹
            </h1>
            <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
              网格 · 列表 · 共 {favorites.length} 条收藏
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowImportExport('import')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono text-gray-400 hover:text-cyber-text hover:bg-white/5 border border-cyber-border/30 transition-all flex items-center gap-1"
            >
              <Upload className="w-3 h-3" />
              <span className="hidden sm:inline">导入</span>
            </button>
            <button
              onClick={() => setShowImportExport('export')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono text-gray-400 hover:text-cyber-text hover:bg-white/5 border border-cyber-border/30 transition-all flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              <span className="hidden sm:inline">导出</span>
            </button>
            <button
              onClick={() => setShowFolderManager(true)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono text-gray-400 hover:text-cyber-text hover:bg-white/5 border border-cyber-border/30 transition-all flex items-center gap-1"
            >
              <Folder className="w-3 h-3" />
              <span className="hidden sm:inline">文件夹</span>
            </button>
            <button
              onClick={() => { setIsCreating(true); setEditingItem(null) }}
              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/30 hover:bg-cyber-accent/20 transition-all flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>添加</span>
            </button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          <StatCard icon={Star} label="收藏总数" value={`${stats.total}`} color="text-cyber-accent" />
          <StatCard icon={Eye} label="总访问" value={`${stats.totalVisits}`} color="text-cyan-400" />
          <StatCard icon={TrendingUp} label="最常访问" value={stats.mostVisited?.title.slice(0, 6) || '-'} sub={`${stats.mostVisited?.visits || 0}次`} color="text-yellow-400" />
          <StatCard icon={Clock} label="最近添加" value={stats.recent?.title.slice(0, 6) || '-'} color="text-purple-400" />
        </div>

        {/* 工具栏 */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[160px] max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜索收藏..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg text-cyber-text placeholder-gray-600 focus:outline-none focus:border-cyber-accent/50"
            />
          </div>

          <button
            onClick={() => setShowFilter(!showFilter)}
            className={cn(
              'px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all flex items-center gap-1',
              hasActiveFilter || showFilter
                ? 'bg-cyber-accent/10 text-cyber-accent border-cyber-accent/30'
                : 'text-gray-400 hover:text-cyber-text border-cyber-border/30 hover:bg-white/5'
            )}
          >
            <Filter className="w-3 h-3" />
            <span>筛选</span>
            {hasActiveFilter && <span className="w-1.5 h-1.5 rounded-full bg-cyber-accent" />}
          </button>

          <select
            value={sortMode}
            onChange={e => setSortMode(e.target.value as SortMode)}
            className="px-2 py-1.5 text-xs font-mono bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg text-gray-400 focus:outline-none focus:border-cyber-accent/50"
          >
            <option value="time">按时间</option>
            <option value="name">按名称</option>
            <option value="category">按分类</option>
            <option value="visits">按访问</option>
          </select>

          <div className="flex items-center bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg p-0.5">
            {(['grid', 'list'] as ViewMode[]).map(mode => {
              const Icon = mode === 'grid' ? Grid : List
              return (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn('p-1.5 rounded transition-all', viewMode === mode ? 'bg-cyber-accent/20 text-cyber-accent' : 'text-gray-500 hover:text-gray-300')}
                  title={mode === 'grid' ? '网格视图' : '列表视图'}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              )
            })}
          </div>
        </div>

        {/* 分类与文件夹筛选 */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          <FilterChip active={activeFolder === 'all'} onClick={() => setActiveFolder('all')} icon={Folder}>全部</FilterChip>
          {folders.map(f => (
            <FilterChip key={f.id} active={activeFolder === f.id} onClick={() => setActiveFolder(f.id)}>
              <span className="w-2 h-2 rounded-full inline-block mr-1" style={{ backgroundColor: f.color }} />
              {f.name}
            </FilterChip>
          ))}
          <span className="w-px h-4 bg-cyber-border/30 mx-1 self-center" />
          <FilterChip active={activeCategory === 'all'} onClick={() => setActiveCategory('all')}>全部分类</FilterChip>
          {(Object.keys(categoryConfig) as FavoriteCategory[]).map(cat => {
            const c = categoryConfig[cat]
            const Icon = c.icon
            return (
              <FilterChip key={cat} active={activeCategory === cat} onClick={() => setActiveCategory(cat)}>
                <Icon className={cn('w-2.5 h-2.5', c.color)} />
                {c.label}
              </FilterChip>
            )
          })}
        </div>

        {/* 标签筛选 */}
        {showFilter && (
          <div className="mt-2 p-2 bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg flex flex-wrap gap-1">
            <FilterChip active={activeTag === 'all'} onClick={() => setActiveTag('all')}>全部标签</FilterChip>
            {allTags.map(tag => (
              <FilterChip key={tag} active={activeTag === tag} onClick={() => setActiveTag(tag)}>
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </FilterChip>
            ))}
          </div>
        )}

        {hasActiveFilter && (
          <button
            onClick={() => { setActiveCategory('all'); setActiveFolder('all'); setActiveTag('all'); setSearchQuery('') }}
            className="mt-2 px-2 py-1 text-[10px] text-gray-500 hover:text-red-400 font-mono"
          >
            清除筛选
          </button>
        )}
      </div>

      {/* 快速访问区 */}
      {!hasActiveFilter && !searchQuery && (
        <div className="px-4 py-3 border-b border-cyber-border/20">
          <h3 className="text-xs font-mono text-gray-500 mb-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-cyber-accent" />
            快速访问
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[...favorites].sort((a, b) => b.visits - a.visits).slice(0, 4).map(item => {
              const c = categoryConfig[item.category]
              const Icon = c.icon
              return (
                <button
                  key={item.id}
                  onClick={() => handleVisit(item)}
                  className={cn('p-2 rounded-lg border text-left hover:border-cyber-accent/40 transition-all', c.bgColor, 'border-cyber-border/20')}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className={cn('w-3 h-3', c.color)} />
                    <span className="text-[10px] text-gray-500 font-mono">{item.visits}次访问</span>
                  </div>
                  <div className="text-[11px] text-cyber-text truncate font-bold">{item.title}</div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* 收藏列表 */}
      <div className="flex-1 overflow-auto min-h-0 p-3">
        {filteredFavorites.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-600 font-mono">暂无收藏</div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {filteredFavorites.map(item => (
              <FavoriteCard
                key={item.id}
                item={item}
                folders={folders}
                onClick={() => handleVisit(item)}
                onEdit={() => { setEditingItem(item); setIsCreating(false) }}
                onDelete={() => handleDelete(item.id)}
                onMove={fid => handleMoveToFolder(item.id, fid)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredFavorites.map(item => (
              <FavoriteListItem
                key={item.id}
                item={item}
                folders={folders}
                onClick={() => handleVisit(item)}
                onEdit={() => { setEditingItem(item); setIsCreating(false) }}
                onDelete={() => handleDelete(item.id)}
                onMove={fid => handleMoveToFolder(item.id, fid)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 编辑/创建弹窗 */}
      {editingItem !== null || isCreating ? (
        <FavoriteEditModal
          item={editingItem}
          folders={folders}
          isCreating={isCreating}
          onClose={() => { setEditingItem(null); setIsCreating(false) }}
          onSave={handleSave}
        />
      ) : null}

      {/* 文件夹管理弹窗 */}
      {showFolderManager && (
        <FolderManagerModal
          folders={folders}
          favorites={favorites}
          onClose={() => setShowFolderManager(false)}
          onAdd={handleAddFolder}
          onRename={handleRenameFolder}
          onDelete={handleDeleteFolder}
        />
      )}

      {/* 导入导出弹窗 */}
      {showImportExport && (
        <ImportExportModal
          mode={showImportExport}
          count={favorites.length}
          onClose={() => setShowImportExport(null)}
          onAction={showImportExport === 'export' ? handleExport : handleImport}
        />
      )}
    </div>
  )
}

// ============ 统计卡片 ============

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: typeof Star
  label: string
  value: string
  sub?: string
  color: string
}) {
  return (
    <div className="bg-cyber-bg-secondary/60 border border-cyber-border/20 rounded-lg p-2.5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-gray-500 font-mono">{label}</span>
        <Icon className={cn('w-3 h-3', color)} />
      </div>
      <div className={cn('text-sm font-bold font-mono truncate', color)}>{value}</div>
      {sub && <div className="text-[9px] text-gray-600 font-mono">{sub}</div>}
    </div>
  )
}

// ============ 筛选芯片 ============

function FilterChip({ active, onClick, children, icon: Icon }: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  icon?: typeof Star
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all flex items-center gap-1',
        active
          ? 'bg-cyber-accent/20 text-cyber-accent border-cyber-accent/40'
          : 'text-gray-400 hover:text-cyber-text border-cyber-border/30 hover:bg-white/5'
      )}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </button>
  )
}

// ============ 收藏卡片 ============

function FavoriteCard({ item, folders, onClick, onEdit, onDelete, onMove }: {
  item: FavoriteItem
  folders: FavoriteFolder[]
  onClick: () => void
  onEdit: () => void
  onDelete: () => void
  onMove: (folderId: string | null) => void
}) {
  const [showMenu, setShowMenu] = useState(false)
  const c = categoryConfig[item.category]
  const Icon = c.icon
  const folder = folders.find(f => f.id === item.folderId)
  return (
    <div
      className="relative bg-cyber-panel/60 border border-cyber-border/30 rounded-lg p-3 cursor-pointer hover:border-cyber-accent/40 transition-all group"
      onClick={onClick}
    >
      {/* 顶部 */}
      <div className="flex items-start justify-between mb-2">
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', c.bgColor)}>
          <Icon className={cn('w-4 h-4', c.color)} />
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu) }}
          className="p-1 text-gray-500 hover:text-cyber-text rounded hover:bg-white/5 opacity-0 group-hover:opacity-100"
        >
          <MoreVertical className="w-3.5 h-3.5" />
        </button>
      </div>
      {/* 标题 */}
      <h3 className="text-xs font-bold text-cyber-text mb-1 line-clamp-2">{item.title}</h3>
      {/* 描述 */}
      <p className="text-[10px] text-gray-400 line-clamp-2 mb-2">{item.description}</p>
      {/* 标签 */}
      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {item.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-1 py-0.5 text-[9px] font-mono bg-cyber-accent/10 text-cyber-accent/70 rounded">#{tag}</span>
          ))}
        </div>
      )}
      {/* 底部 */}
      <div className="flex items-center justify-between text-[9px] text-gray-600 font-mono">
        <span className="flex items-center gap-1">
          <Eye className="w-2.5 h-2.5" />
          {item.visits}次
        </span>
        {folder && (
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: folder.color }} />
            {folder.name}
          </span>
        )}
      </div>

      {/* 操作菜单 */}
      {showMenu && (
        <div
          className="absolute top-10 right-2 bg-cyber-bg border border-cyber-border/40 rounded-lg shadow-lg py-1 z-10 min-w-[120px]"
          onClick={e => e.stopPropagation()}
        >
          <MenuItem icon={ExternalLink} label="打开" onClick={() => { onClick(); setShowMenu(false) }} />
          <MenuItem icon={Edit3} label="编辑" onClick={() => { onEdit(); setShowMenu(false) }} />
          <MenuItem icon={Share2} label="分享" onClick={() => { setShowMenu(false) }} />
          <div className="border-t border-cyber-border/20 my-1" />
          <div className="px-3 py-1 text-[9px] text-gray-500 font-mono">移动到</div>
          <MenuItem icon={FolderOpen} label="无文件夹" onClick={() => { onMove(null); setShowMenu(false) }} />
          {folders.map(f => (
            <MenuItem key={f.id} icon={Folder} label={f.name} onClick={() => { onMove(f.id); setShowMenu(false) }} />
          ))}
          <div className="border-t border-cyber-border/20 my-1" />
          <MenuItem icon={Trash2} label="删除" danger onClick={() => { onDelete(); setShowMenu(false) }} />
        </div>
      )}
    </div>
  )
}

// ============ 收藏列表项 ============

function FavoriteListItem({ item, folders, onClick, onEdit, onDelete, onMove }: {
  item: FavoriteItem
  folders: FavoriteFolder[]
  onClick: () => void
  onEdit: () => void
  onDelete: () => void
  onMove: (folderId: string | null) => void
}) {
  const [showMenu, setShowMenu] = useState(false)
  const c = categoryConfig[item.category]
  const Icon = c.icon
  const folder = folders.find(f => f.id === item.folderId)
  return (
    <div
      className="relative flex items-center gap-3 p-2.5 bg-cyber-panel/40 border border-cyber-border/20 rounded-lg cursor-pointer hover:border-cyber-accent/40 transition-all group"
      onClick={onClick}
    >
      <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0', c.bgColor)}>
        <Icon className={cn('w-3.5 h-3.5', c.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-xs font-bold text-cyber-text truncate">{item.title}</h4>
          <span className={cn('px-1 py-0.5 text-[9px] font-mono rounded', c.bgColor, c.color)}>{c.label}</span>
          {folder && (
            <span className="flex items-center gap-1 text-[9px] text-gray-500 font-mono">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: folder.color }} />
              {folder.name}
            </span>
          )}
        </div>
        <p className="text-[10px] text-gray-500 truncate mt-0.5">{item.description}</p>
      </div>
      <div className="flex items-center gap-2 text-[10px] text-gray-600 font-mono">
        <span className="flex items-center gap-0.5">
          <Eye className="w-2.5 h-2.5" />
          {item.visits}
        </span>
        <span>{formatDateShort(item.createdAt)}</span>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu) }}
        className="p-1 text-gray-500 hover:text-cyber-text rounded hover:bg-white/5"
      >
        <MoreVertical className="w-3.5 h-3.5" />
      </button>
      {showMenu && (
        <div
          className="absolute right-2 top-10 bg-cyber-bg border border-cyber-border/40 rounded-lg shadow-lg py-1 z-10 min-w-[120px]"
          onClick={e => e.stopPropagation()}
        >
          <MenuItem icon={ExternalLink} label="打开" onClick={() => { onClick(); setShowMenu(false) }} />
          <MenuItem icon={Edit3} label="编辑" onClick={() => { onEdit(); setShowMenu(false) }} />
          <MenuItem icon={Share2} label="分享" onClick={() => { setShowMenu(false) }} />
          <div className="border-t border-cyber-border/20 my-1" />
          <div className="px-3 py-1 text-[9px] text-gray-500 font-mono">移动到</div>
          <MenuItem icon={FolderOpen} label="无文件夹" onClick={() => { onMove(null); setShowMenu(false) }} />
          {folders.map(f => (
            <MenuItem key={f.id} icon={Folder} label={f.name} onClick={() => { onMove(f.id); setShowMenu(false) }} />
          ))}
          <div className="border-t border-cyber-border/20 my-1" />
          <MenuItem icon={Trash2} label="删除" danger onClick={() => { onDelete(); setShowMenu(false) }} />
        </div>
      )}
    </div>
  )
}

// ============ 菜单项 ============

function MenuItem({ icon: Icon, label, onClick, danger }: {
  icon: typeof Edit3
  label: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full px-3 py-1.5 text-left text-[11px] font-mono flex items-center gap-2 hover:bg-white/5 transition-colors',
        danger ? 'text-red-400' : 'text-gray-300'
      )}
    >
      <Icon className="w-3 h-3" />
      {label}
    </button>
  )
}

// ============ 收藏编辑弹窗 ============

function FavoriteEditModal({ item, folders, isCreating, onClose, onSave }: {
  item: FavoriteItem | null
  folders: FavoriteFolder[]
  isCreating: boolean
  onClose: () => void
  onSave: (item: FavoriteItem) => void
}) {
  const [form, setForm] = useState<FavoriteItem>(item || {
    id: `fav_${Date.now()}`,
    title: '',
    description: '',
    category: 'webpage',
    source: '手动添加',
    url: '',
    tags: [],
    folderId: null,
    visits: 0,
    lastVisitedAt: null,
    createdAt: new Date().toISOString(),
    content: '',
  })
  const [tagInput, setTagInput] = useState('')

  const handleSubmit = () => {
    if (!form.title.trim()) return
    onSave(form)
  }

  const toggleTag = (tag: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div
        className="bg-cyber-bg border border-cyber-border/40 rounded-t-xl sm:rounded-xl w-full sm:max-w-md max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b border-cyber-border/30 flex items-center justify-between">
          <h2 className="text-sm font-bold text-cyber-text font-mono">{isCreating ? '添加收藏' : '编辑收藏'}</h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-cyber-text rounded hover:bg-white/5">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div>
            <label className="text-[10px] text-gray-500 font-mono block mb-1">标题 *</label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="收藏标题..."
              className="w-full px-3 py-2 text-xs bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg text-cyber-text placeholder-gray-600 focus:outline-none focus:border-cyber-accent/50"
            />
          </div>

          <div>
            <label className="text-[10px] text-gray-500 font-mono block mb-1">描述</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="描述内容..."
              rows={2}
              className="w-full px-3 py-2 text-xs bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg text-cyber-text placeholder-gray-600 focus:outline-none focus:border-cyber-accent/50 resize-none"
            />
          </div>

          <div>
            <label className="text-[10px] text-gray-500 font-mono block mb-1">分类</label>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(categoryConfig) as FavoriteCategory[]).map(cat => {
                const c = categoryConfig[cat]
                const Icon = c.icon
                return (
                  <button
                    key={cat}
                    onClick={() => setForm({ ...form, category: cat })}
                    className={cn(
                      'px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all flex items-center gap-1',
                      form.category === cat ? cn(c.bgColor, c.color, 'border-current') : 'border-cyber-border/30 text-gray-500 hover:text-cyber-text'
                    )}
                  >
                    <Icon className="w-3 h-3" />
                    {c.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-500 font-mono block mb-1">来源</label>
              <input
                value={form.source}
                onChange={e => setForm({ ...form, source: e.target.value })}
                placeholder="来源..."
                className="w-full px-3 py-2 text-xs bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg text-cyber-text placeholder-gray-600 focus:outline-none focus:border-cyber-accent/50"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 font-mono block mb-1">文件夹</label>
              <select
                value={form.folderId || ''}
                onChange={e => setForm({ ...form, folderId: e.target.value || null })}
                className="w-full px-2 py-2 text-xs bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg text-cyber-text focus:outline-none focus:border-cyber-accent/50"
              >
                <option value="">无文件夹</option>
                {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
          </div>

          {(form.category === 'webpage' || form.category === 'file' || form.category === 'code') && (
            <div>
              <label className="text-[10px] text-gray-500 font-mono block mb-1">
                {form.category === 'webpage' ? 'URL' : form.category === 'code' ? '代码内容' : '文件路径'}
              </label>
              {form.category === 'code' ? (
                <textarea
                  value={form.content || ''}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  placeholder="代码内容..."
                  rows={4}
                  className="w-full px-3 py-2 text-xs bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg text-cyber-text placeholder-gray-600 focus:outline-none focus:border-cyber-accent/50 resize-none font-mono"
                />
              ) : (
                <input
                  value={form.url || ''}
                  onChange={e => setForm({ ...form, url: e.target.value })}
                  placeholder={form.category === 'webpage' ? 'https://...' : '文件路径'}
                  className="w-full px-3 py-2 text-xs bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg text-cyber-text placeholder-gray-600 focus:outline-none focus:border-cyber-accent/50"
                />
              )}
            </div>
          )}

          <div>
            <label className="text-[10px] text-gray-500 font-mono block mb-1">标签</label>
            <div className="flex flex-wrap gap-1 mb-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    'px-2 py-0.5 text-[10px] font-mono rounded border transition-all',
                    form.tags.includes(tag)
                      ? 'bg-cyber-accent/20 text-cyber-accent border-cyber-accent/40'
                      : 'border-cyber-border/30 text-gray-500 hover:text-cyber-text'
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && tagInput.trim()) {
                  if (!form.tags.includes(tagInput.trim())) {
                    setForm({ ...form, tags: [...form.tags, tagInput.trim()] })
                  }
                  setTagInput('')
                }
              }}
              placeholder="自定义标签..."
              className="w-full px-2 py-1 text-[10px] bg-cyber-bg-secondary border border-cyber-border/30 rounded text-cyber-text placeholder-gray-600 focus:outline-none focus:border-cyber-accent/50"
            />
          </div>
        </div>

        <div className="px-4 py-3 border-t border-cyber-border/30 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-xs text-gray-400 hover:text-cyber-text font-mono">取消</button>
          <button
            onClick={handleSubmit}
            disabled={!form.title.trim()}
            className="px-4 py-1.5 text-xs bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/30 rounded-lg hover:bg-cyber-accent/20 disabled:opacity-40 disabled:cursor-not-allowed font-mono"
          >
            {isCreating ? '添加' : '保存'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============ 文件夹管理弹窗 ============

function FolderManagerModal({ folders, favorites, onClose, onAdd, onRename, onDelete }: {
  folders: FavoriteFolder[]
  favorites: FavoriteItem[]
  onClose: () => void
  onAdd: (name: string, color: string) => void
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
}) {
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(folderColors[0])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-cyber-bg border border-cyber-border/40 rounded-t-xl sm:rounded-xl w-full sm:max-w-md max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="px-4 py-3 border-b border-cyber-border/30 flex items-center justify-between">
          <h2 className="text-sm font-bold text-cyber-text font-mono flex items-center gap-2">
            <Folder className="w-4 h-4 text-cyber-accent" />
            文件夹管理
          </h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-cyber-text rounded hover:bg-white/5">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {folders.map(f => {
            const count = favorites.filter(fav => fav.folderId === f.id).length
            return (
              <div key={f.id} className="flex items-center gap-2 p-2.5 bg-cyber-bg-secondary/40 rounded-lg border border-cyber-border/20">
                <Folder className="w-4 h-4 flex-shrink-0" style={{ color: f.color }} />
                {editingId === f.id ? (
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && editName.trim()) {
                        onRename(f.id, editName.trim())
                        setEditingId(null)
                      }
                    }}
                    className="flex-1 px-2 py-1 text-xs bg-cyber-bg border border-cyber-accent/30 rounded text-cyber-text focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <span className="flex-1 text-xs text-cyber-text">{f.name}</span>
                )}
                <span className="text-[10px] text-gray-500 font-mono">{count} 项</span>
                <button onClick={() => { setEditingId(f.id); setEditName(f.name) }} className="p-1 text-gray-500 hover:text-cyber-accent hover:bg-white/5 rounded">
                  <Edit3 className="w-3 h-3" />
                </button>
                <button onClick={() => onDelete(f.id)} className="p-1 text-gray-500 hover:text-red-400 hover:bg-white/5 rounded">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )
          })}
        </div>
        <div className="px-4 py-3 border-t border-cyber-border/30">
          <div className="flex items-center gap-2 mb-2">
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="新文件夹名称..."
              className="flex-1 px-2 py-1.5 text-xs bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg text-cyber-text placeholder-gray-600 focus:outline-none focus:border-cyber-accent/50"
            />
            <button
              onClick={() => { if (newName.trim()) { onAdd(newName.trim(), newColor); setNewName('') } }}
              disabled={!newName.trim()}
              className="px-3 py-1.5 text-xs bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/30 rounded-lg hover:bg-cyber-accent/20 disabled:opacity-40 font-mono"
            >
              添加
            </button>
          </div>
          <div className="flex gap-1.5">
            {folderColors.map(c => (
              <button
                key={c}
                onClick={() => setNewColor(c)}
                className={cn('w-5 h-5 rounded-full border-2 transition-all', newColor === c ? 'border-white scale-110' : 'border-transparent')}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ 导入导出弹窗 ============

function ImportExportModal({ mode, count, onClose, onAction }: {
  mode: 'import' | 'export'
  count: number
  onClose: () => void
  onAction: () => void
}) {
  const Icon = mode === 'import' ? Upload : Download
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-cyber-bg border border-cyber-border/40 rounded-t-xl sm:rounded-xl w-full sm:max-w-sm p-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-cyber-text font-mono flex items-center gap-2">
            <Icon className="w-4 h-4 text-cyber-accent" />
            {mode === 'import' ? '导入收藏' : '导出收藏'}
          </h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-cyber-text rounded hover:bg-white/5">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[11px] text-gray-400 mb-3">
          {mode === 'import'
            ? '从 JSON 文件导入收藏数据。导入后会合并到现有收藏中。'
            : `将当前 ${count} 条收藏导出为 JSON 文件，方便备份或迁移。`}
        </p>
        <button
          onClick={onAction}
          className="w-full px-4 py-2 text-xs bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/30 rounded-lg hover:bg-cyber-accent/20 font-mono flex items-center justify-center gap-2"
        >
          <Icon className="w-3.5 h-3.5" />
          {mode === 'import' ? '选择文件导入' : '导出为 JSON'}
        </button>
      </div>
    </div>
  )
}

// ============ 工具函数 ============

function formatDateShort(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  if (diff < 7 * 86400000) return `${Math.floor(diff / 86400000)}天前`
  return `${d.getMonth() + 1}/${d.getDate()}`
}
