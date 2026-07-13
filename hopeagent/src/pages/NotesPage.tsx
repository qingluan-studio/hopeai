import { useState, useMemo } from 'react'
import {
  Notebook,
  Search,
  Plus,
  Grid,
  List,
  Tag,
  Star,
  Pin,
  Edit3,
  Trash2,
  X,
  Eye,
  Code2,
  Share2,
  Download,
  History,
  BookOpen,
  ChevronRight,
  ChevronDown,
  FileText,
  Calendar,
  Copy,
  Check,
  Bold,
  Italic,
  List as ListIcon,
  Heading,
  Quote,
  Code,
  Link as LinkIcon,
  Image,
  Coffee,
  BookMarked,
  ListChecks,
  PenLine,
  Filter,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============

// 笔记
interface Note {
  id: string
  title: string
  content: string
  notebookId: string
  tags: string[]
  isFavorite: boolean
  isPinned: boolean
  createdAt: string
  updatedAt: string
  views: number
  versions: NoteVersion[]
}

// 笔记版本
interface NoteVersion {
  id: string
  version: number
  content: string
  updatedAt: string
  operator: string
}

// 笔记本
interface Notebook {
  id: string
  name: string
  color: string
  description: string
  noteCount: number
}

// 笔记模板
interface NoteTemplate {
  id: string
  name: string
  icon: string
  description: string
  content: string
}

// 视图模式
type ViewMode = 'card' | 'list'

// ============ 常量配置 ============

// 笔记本颜色
const notebookColors = [
  { value: '#00ff88', label: '赛博绿' },
  { value: '#00d4ff', label: '电光蓝' },
  { value: '#c084fc', label: '霓虹紫' },
  { value: '#fbbf24', label: '警示黄' },
  { value: '#f87171', label: '警报红' },
  { value: '#ec4899', label: '荧光粉' },
]

// 所有标签
const allTags = ['前端', '后端', '学习', '工作', '灵感', '技术', '生活', '阅读', '会议', '总结', '草稿', '重要']

// 笔记模板
const noteTemplates: NoteTemplate[] = [
  {
    id: 'tpl_meeting',
    name: '会议记录',
    icon: '📝',
    description: '记录会议要点、决议与待办事项',
    content: `# 会议记录\n\n**会议主题**：\n**会议时间**：\n**参会人员**：\n\n## 会议议题\n\n1. \n2. \n3. \n\n## 讨论内容\n\n- \n\n## 决议事项\n\n- \n\n## 待办事项\n\n- [ ] 任务一 - 负责人：\n- [ ] 任务二 - 负责人：\n\n## 下次会议\n\n时间：\n议题：`,
  },
  {
    id: 'tpl_reading',
    name: '读书笔记',
    icon: '📚',
    description: '记录书籍核心观点与个人感悟',
    content: `# 读书笔记\n\n**书名**：\n**作者**：\n**阅读时间**：\n**评分**：⭐⭐⭐⭐⭐\n\n## 内容简介\n\n\n\n## 核心观点\n\n1. \n2. \n3. \n\n## 精彩摘录\n\n> \n\n## 个人感悟\n\n\n\n## 行动计划\n\n- [ ] \n- [ ] `,
  },
  {
    id: 'tpl_diary',
    name: '日记',
    icon: '📔',
    description: '记录每日生活与心情',
    content: `# 今日日记\n\n**日期**：${new Date().toLocaleDateString('zh-CN')}\n**天气**：\n**心情**：😊\n\n## 今日事件\n\n\n\n## 心情记录\n\n\n\n## 感悟思考\n\n\n\n## 明日计划\n\n- [ ] \n- [ ] `,
  },
  {
    id: 'tpl_todo',
    name: '待办清单',
    icon: '✅',
    description: '管理任务清单与进度',
    content: `# 待办清单\n\n**日期**：${new Date().toLocaleDateString('zh-CN')}\n\n## 今日待办\n\n- [ ] 任务一\n- [ ] 任务二\n- [ ] 任务三\n\n## 本周计划\n\n- [ ] 周一：\n- [ ] 周二：\n- [ ] 周三：\n- [ ] 周四：\n- [ ] 周五：\n\n## 长期目标\n\n- [ ] \n- [ ] \n\n## 已完成\n\n- [x] ~~示例任务~~`,
  },
]

// ============ Mock 数据生成 ============

// 初始笔记本
const initialNotebooks: Notebook[] = [
  { id: 'nb_1', name: '技术笔记', color: '#00ff88', description: '前端、后端、架构等技术相关笔记', noteCount: 12 },
  { id: 'nb_2', name: '学习笔记', color: '#00d4ff', description: '课程、书籍、教程学习笔记', noteCount: 8 },
  { id: 'nb_3', name: '工作记录', color: '#fbbf24', description: '会议记录、工作计划、项目文档', noteCount: 6 },
  { id: 'nb_4', name: '灵感收藏', color: '#c084fc', description: '灵感、创意、想法记录', noteCount: 4 },
]

// 生成 mock 笔记
const generateMockNotes = (): Note[] => {
  const titles = [
    'React 18 新特性总结', 'TypeScript 高级类型用法', 'Tailwind CSS 实战技巧',
    'Vue3 Composition API 笔记', 'Node.js 异步编程指南', 'Webpack 构建优化方案',
    'CSS Grid 布局详解', 'JavaScript 设计模式', '前端性能优化清单',
    'HTTP 缓存机制深入', 'GraphQL 与 REST 对比', '微前端架构实践',
    'Docker 容器化部署', 'Git 工作流规范', 'Linux 常用命令',
    '算法与数据结构笔记', '设计原则与模式', '产品需求文档模板',
    '项目复盘记录', '团队协作流程', '周会会议纪要',
    '季度总结报告', '读书笔记：《深入理解计算机系统》', '学习路线规划',
    '英语学习笔记', '面试题目整理', '代码评审要点',
    'API 设计最佳实践', '前端安全防护', '移动端适配方案',
  ]
  const contents = [
    `# ${titles[0]}\n\n## 概述\n\nReact 18 引入了多项重要更新，包括并发渲染、自动批处理、Transitions 等特性。\n\n## 核心特性\n\n### 1. 并发渲染\n\nReact 18 的核心是并发渲染机制，允许 React 中断、暂停、恢复渲染过程。\n\n### 2. 自动批处理\n\nReact 18 将多次状态更新自动合并为一次重渲染，提升性能。\n\n### 3. Transitions\n\n使用 \`startTransition\` 标记非紧急更新，保持界面响应。\n\n## 代码示例\n\n\`\`\`jsx\nimport { startTransition } from 'react'\n\nstartTransition(() => {\n  setFilter(value)\n})\n\`\`\`\n\n## 总结\n\nReact 18 通过并发模式大幅提升了用户体验，值得在生产环境中使用。`,
    `# ${titles[1]}\n\n## 泛型\n\nTypeScript 泛型是构建可复用组件的核心特性。\n\n\`\`\`typescript\nfunction identity<T>(arg: T): T {\n  return arg\n}\n\`\`\`\n\n## 条件类型\n\n\`\`\`typescript\ntype Exclude<T, U> = T extends U ? never : T\n\`\`\`\n\n## 映射类型\n\n\`\`\`typescript\ntype Readonly<T> = {\n  readonly [P in keyof T]: T[P]\n}\n\`\`\``,
    `# ${titles[2]}\n\n## 常用技巧\n\n- 使用 \`@apply\` 复用样式\n- 响应式前缀：\`sm:\`、\`md:\`、\`lg:\`\n- 暗黑模式：\`dark:\`\n- 状态变体：\`hover:\`、\`focus:\`、\`active:\`\n\n## 自定义配置\n\n在 \`tailwind.config.js\` 中扩展主题。`,
    `# ${titles[3]}\n\n## setup 语法糖\n\n\`\`\`vue\n<script setup>\nimport { ref } from 'vue'\nconst count = ref(0)\n\`\`\`\n\n## 响应式 API\n\n- \`ref\`：基本类型\n- \`reactive\`：对象\n- \`computed\`：计算属性\n- \`watch\`：监听`,
    `# ${titles[4]}\n\n## Promise\n\n\`\`\`javascript\nasync function fetchData() {\n  const res = await fetch('/api/data')\n  return res.json()\n}\n\`\`\`\n\n## 事件循环\n\nNode.js 基于事件循环实现非阻塞 I/O。`,
    `# ${titles[5]}\n\n## 优化方向\n\n1. 减少打包体积\n2. 提升构建速度\n3. 优化运行时性能\n\n## 代码分割\n\n\`\`\`javascript\nimport(/* webpackChunkName: "lodash" */ 'lodash')\n\`\`\``,
  ]
  const now = Date.now()
  const notes: Note[] = []

  for (let i = 0; i < 30; i++) {
    const notebookId = `nb_${(i % 4) + 1}`
    const tags = [allTags[i % allTags.length], allTags[(i + 5) % allTags.length]].filter((v, idx, arr) => arr.indexOf(v) === idx)
    const createdAt = new Date(now - (30 - i) * 86400000).toISOString()
    const updatedAt = new Date(now - Math.floor(Math.random() * 7) * 86400000).toISOString()
    const content = contents[i % contents.length]

    notes.push({
      id: `note_${i + 1}`,
      title: titles[i],
      content,
      notebookId,
      tags,
      isFavorite: i % 5 === 0,
      isPinned: i % 7 === 0,
      createdAt,
      updatedAt,
      views: Math.floor(Math.random() * 100) + 1,
      versions: [
        { id: `ver_${i}_1`, version: 1, content: content.slice(0, 100) + '...', updatedAt: createdAt, operator: '我' },
        { id: `ver_${i}_2`, version: 2, content, updatedAt, operator: '我' },
      ],
    })
  }

  return notes
}

const initialNotes = generateMockNotes()

// ============ 主组件 ============

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [notebooks, setNotebooks] = useState<Notebook[]>(initialNotebooks)
  const [viewMode, setViewMode] = useState<ViewMode>('card')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeNotebook, setActiveNotebook] = useState<string>('all')
  const [activeTag, setActiveTag] = useState<string>('all')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [showPinnedOnly, setShowPinnedOnly] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showNotebookManager, setShowNotebookManager] = useState(false)
  const [showHistory, setShowHistory] = useState<Note | null>(null)
  const [shareNote, setShareNote] = useState<Note | null>(null)
  const [exportNote, setExportNote] = useState<Note | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // 过滤后笔记
  const filteredNotes = useMemo(() => {
    let result = notes
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
      )
    }
    if (activeNotebook !== 'all') result = result.filter(n => n.notebookId === activeNotebook)
    if (activeTag !== 'all') result = result.filter(n => n.tags.includes(activeTag))
    if (showFavoritesOnly) result = result.filter(n => n.isFavorite)
    if (showPinnedOnly) result = result.filter(n => n.isPinned)
    // 排序：置顶优先，再按更新时间
    return [...result].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  }, [notes, searchQuery, activeNotebook, activeTag, showFavoritesOnly, showPinnedOnly])

  // 统计
  const stats = useMemo(() => {
    return {
      total: notes.length,
      favorites: notes.filter(n => n.isFavorite).length,
      pinned: notes.filter(n => n.isPinned).length,
      notebooks: notebooks.length,
    }
  }, [notes, notebooks])

  // 切换收藏
  const toggleFavorite = (id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, isFavorite: !n.isFavorite } : n))
  }

  // 切换置顶
  const togglePinned = (id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n))
  }

  // 删除笔记
  const handleDelete = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  // 保存笔记
  const handleSave = (note: Note) => {
    if (isCreating) {
      // 添加版本
      note.versions = [{ id: `ver_${Date.now()}`, version: 1, content: note.content, updatedAt: note.updatedAt, operator: '我' }]
      setNotes(prev => [note, ...prev])
    } else {
      // 添加新版本
      const updated = { ...note, updatedAt: new Date().toISOString() }
      updated.versions = [...note.versions, { id: `ver_${Date.now()}`, version: note.versions.length + 1, content: note.content, updatedAt: updated.updatedAt, operator: '我' }]
      setNotes(prev => prev.map(n => n.id === note.id ? updated : n))
    }
    setEditingNote(null)
    setIsCreating(false)
  }

  // 从模板创建
  const handleCreateFromTemplate = (template: NoteTemplate) => {
    const newNote: Note = {
      id: `note_${Date.now()}`,
      title: `${template.name} - ${new Date().toLocaleDateString('zh-CN')}`,
      content: template.content,
      notebookId: activeNotebook !== 'all' ? activeNotebook : 'nb_1',
      tags: [],
      isFavorite: false,
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      versions: [],
    }
    setNotes(prev => [newNote, ...prev])
    setEditingNote(newNote)
    setIsCreating(false)
    setShowTemplates(false)
  }

  // 复制分享链接
  const handleCopyShare = (note: Note) => {
    const shareUrl = `https://hopeagent.pro/notes/${note.id}`
    navigator.clipboard?.writeText(shareUrl)
    setCopiedId(note.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // 导出笔记
  const handleExport = (note: Note, format: 'md' | 'html' | 'pdf') => {
    let content = ''
    let filename = `${note.title}.${format === 'pdf' ? 'html' : format}`
    if (format === 'md') {
      content = note.content
    } else if (format === 'html' || format === 'pdf') {
      content = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${note.title}</title><style>body{font-family:sans-serif;max-width:800px;margin:40px auto;padding:20px;line-height:1.6;}pre{background:#f4f4f4;padding:12px;border-radius:4px;overflow-x:auto;}code{background:#f4f4f4;padding:2px 4px;border-radius:2px;}blockquote{border-left:4px solid #ddd;margin:0;padding-left:12px;color:#666;}</style></head><body>${markdownToHtml(note.content)}${format === 'pdf' ? '<script>window.onload=function(){window.print()}</script>' : ''}</body></html>`
    }
    // 模拟下载
    const blob = new Blob([content], { type: format === 'md' ? 'text/markdown' : 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  // 笔记本管理
  const handleAddNotebook = (name: string, color: string) => {
    const newNb: Notebook = { id: `nb_${Date.now()}`, name, color, description: '', noteCount: 0 }
    setNotebooks(prev => [...prev, newNb])
  }

  const handleRenameNotebook = (id: string, name: string) => {
    setNotebooks(prev => prev.map(nb => nb.id === id ? { ...nb, name } : nb))
  }

  const handleDeleteNotebook = (id: string) => {
    setNotebooks(prev => prev.filter(nb => nb.id !== id))
    if (activeNotebook === id) setActiveNotebook('all')
  }

  return (
    <div className="h-full flex flex-col bg-cyber-bg">
      {/* 顶部标题栏 */}
      <div className="border-b border-cyber-border/30 bg-cyber-panel/40 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-base font-bold text-cyber-text flex items-center gap-2">
              <Notebook className="w-4 h-4 text-cyber-accent" />
              笔记系统
            </h1>
            <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
              Markdown 编辑 · 共 {notes.length} 条笔记
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNotebookManager(true)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono text-gray-400 hover:text-cyber-text hover:bg-white/5 border border-cyber-border/30 transition-all flex items-center gap-1"
            >
              <BookOpen className="w-3 h-3" />
              <span className="hidden sm:inline">笔记本</span>
            </button>
            <button
              onClick={() => setShowTemplates(true)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono text-gray-400 hover:text-cyber-text hover:bg-white/5 border border-cyber-border/30 transition-all flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              <span className="hidden sm:inline">模板</span>
            </button>
            <button
              onClick={() => { setIsCreating(true); setEditingNote(null) }}
              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/30 hover:bg-cyber-accent/20 transition-all flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>新建</span>
            </button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          <StatCard icon={FileText} label="笔记总数" value={`${stats.total}`} color="text-cyber-accent" />
          <StatCard icon={Star} label="收藏" value={`${stats.favorites}`} color="text-yellow-400" />
          <StatCard icon={Pin} label="置顶" value={`${stats.pinned}`} color="text-red-400" />
          <StatCard icon={BookOpen} label="笔记本" value={`${stats.notebooks}`} color="text-purple-400" />
        </div>

        {/* 工具栏 */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[160px] max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜索笔记..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg text-cyber-text placeholder-gray-600 focus:outline-none focus:border-cyber-accent/50"
            />
          </div>

          <button
            onClick={() => { setShowFavoritesOnly(!showFavoritesOnly); setShowPinnedOnly(false) }}
            className={cn(
              'px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all flex items-center gap-1',
              showFavoritesOnly ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' : 'text-gray-400 hover:text-cyber-text border-cyber-border/30 hover:bg-white/5'
            )}
          >
            <Star className="w-3 h-3" />
            <span className="hidden sm:inline">收藏</span>
          </button>

          <button
            onClick={() => { setShowPinnedOnly(!showPinnedOnly); setShowFavoritesOnly(false) }}
            className={cn(
              'px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all flex items-center gap-1',
              showPinnedOnly ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'text-gray-400 hover:text-cyber-text border-cyber-border/30 hover:bg-white/5'
            )}
          >
            <Pin className="w-3 h-3" />
            <span className="hidden sm:inline">置顶</span>
          </button>

          <div className="flex items-center bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg p-0.5">
            {(['card', 'list'] as ViewMode[]).map(mode => {
              const Icon = mode === 'card' ? Grid : List
              return (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn('p-1.5 rounded transition-all', viewMode === mode ? 'bg-cyber-accent/20 text-cyber-accent' : 'text-gray-500 hover:text-gray-300')}
                  title={mode === 'card' ? '卡片视图' : '列表视图'}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              )
            })}
          </div>
        </div>

        {/* 笔记本与标签筛选 */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          <FilterChip active={activeNotebook === 'all'} onClick={() => setActiveNotebook('all')}>全部笔记本</FilterChip>
          {notebooks.map(nb => (
            <FilterChip key={nb.id} active={activeNotebook === nb.id} onClick={() => setActiveNotebook(nb.id)} color={nb.color}>
              <span className="w-2 h-2 rounded-full inline-block mr-1" style={{ backgroundColor: nb.color }} />
              {nb.name}
            </FilterChip>
          ))}
          <span className="w-px h-4 bg-cyber-border/30 mx-1 self-center" />
          <FilterChip active={activeTag === 'all'} onClick={() => setActiveTag('all')}>全部标签</FilterChip>
          {allTags.slice(0, 6).map(tag => (
            <FilterChip key={tag} active={activeTag === tag} onClick={() => setActiveTag(tag)}>
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* 笔记列表 */}
      <div className="flex-1 overflow-auto min-h-0 p-3">
        {filteredNotes.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-600 font-mono">暂无笔记</div>
        ) : viewMode === 'card' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {filteredNotes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                notebook={notebooks.find(nb => nb.id === note.notebookId)}
                copiedId={copiedId}
                onClick={() => { setEditingNote(note); setIsCreating(false) }}
                onToggleFavorite={() => toggleFavorite(note.id)}
                onTogglePinned={() => togglePinned(note.id)}
                onDelete={() => handleDelete(note.id)}
                onShare={() => setShareNote(note)}
                onExport={() => setExportNote(note)}
                onHistory={() => setShowHistory(note)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredNotes.map(note => (
              <NoteListItem
                key={note.id}
                note={note}
                notebook={notebooks.find(nb => nb.id === note.notebookId)}
                copiedId={copiedId}
                onClick={() => { setEditingNote(note); setIsCreating(false) }}
                onToggleFavorite={() => toggleFavorite(note.id)}
                onTogglePinned={() => togglePinned(note.id)}
                onDelete={() => handleDelete(note.id)}
                onShare={() => setShareNote(note)}
                onExport={() => setExportNote(note)}
                onHistory={() => setShowHistory(note)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 笔记编辑器 */}
      {editingNote !== null || isCreating ? (
        <NoteEditor
          note={editingNote}
          notebooks={notebooks}
          isCreating={isCreating}
          onClose={() => { setEditingNote(null); setIsCreating(false) }}
          onSave={handleSave}
        />
      ) : null}

      {/* 模板选择 */}
      {showTemplates && (
        <TemplateModal onClose={() => setShowTemplates(false)} onSelect={handleCreateFromTemplate} />
      )}

      {/* 笔记本管理 */}
      {showNotebookManager && (
        <NotebookManagerModal
          notebooks={notebooks}
          notes={notes}
          onClose={() => setShowNotebookManager(false)}
          onAdd={handleAddNotebook}
          onRename={handleRenameNotebook}
          onDelete={handleDeleteNotebook}
        />
      )}

      {/* 版本历史 */}
      {showHistory && (
        <HistoryModal note={showHistory} onClose={() => setShowHistory(null)} onRestore={(version) => {
          setNotes(prev => prev.map(n => n.id === showHistory.id ? { ...n, content: version.content } : n))
          setShowHistory(null)
        }} />
      )}

      {/* 分享弹窗 */}
      {shareNote && (
        <ShareModal note={shareNote} copied={copiedId === shareNote.id} onCopy={() => handleCopyShare(shareNote)} onClose={() => setShareNote(null)} />
      )}

      {/* 导出弹窗 */}
      {exportNote && (
        <ExportModal note={exportNote} onExport={(fmt) => { handleExport(exportNote, fmt); setExportNote(null) }} onClose={() => setExportNote(null)} />
      )}
    </div>
  )
}

// ============ 统计卡片 ============

function StatCard({ icon: Icon, label, value, color }: {
  icon: typeof Notebook
  label: string
  value: string
  color: string
}) {
  return (
    <div className="bg-cyber-bg-secondary/60 border border-cyber-border/20 rounded-lg p-2.5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-gray-500 font-mono">{label}</span>
        <Icon className={cn('w-3 h-3', color)} />
      </div>
      <div className={cn('text-lg font-bold font-mono', color)}>{value}</div>
    </div>
  )
}

// ============ 筛选芯片 ============

function FilterChip({ active, onClick, children, color }: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  color?: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all flex items-center',
        active
          ? 'bg-cyber-accent/20 text-cyber-accent border-cyber-accent/40'
          : 'text-gray-400 hover:text-cyber-text border-cyber-border/30 hover:bg-white/5'
      )}
    >
      {children}
    </button>
  )
}

// ============ 笔记卡片 ============

function NoteCard({ note, notebook, copiedId, onClick, onToggleFavorite, onTogglePinned, onDelete, onShare, onExport, onHistory }: {
  note: Note
  notebook?: Notebook
  copiedId: string | null
  onClick: () => void
  onToggleFavorite: () => void
  onTogglePinned: () => void
  onDelete: () => void
  onShare: () => void
  onExport: () => void
  onHistory: () => void
}) {
  const [showMenu, setShowMenu] = useState(false)
  return (
    <div
      className={cn(
        'relative bg-cyber-panel/60 border rounded-lg p-3 cursor-pointer hover:border-cyber-accent/40 transition-all group',
        note.isPinned ? 'border-cyber-accent/40 bg-cyber-accent/5' : 'border-cyber-border/30'
      )}
      onClick={onClick}
    >
      {note.isPinned && (
        <Pin className="absolute top-2 right-2 w-3 h-3 text-cyber-accent" fill="currentColor" />
      )}
      {/* 笔记本标记 */}
      {notebook && (
        <div className="flex items-center gap-1 mb-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: notebook.color }} />
          <span className="text-[9px] text-gray-500 font-mono">{notebook.name}</span>
        </div>
      )}
      {/* 标题 */}
      <h3 className="text-sm font-bold text-cyber-text mb-1 line-clamp-1 pr-4">{note.title}</h3>
      {/* 内容预览 */}
      <p className="text-[11px] text-gray-400 line-clamp-3 mb-2 leading-relaxed">
        {note.content.replace(/[#*`>\-]/g, '').slice(0, 120)}
      </p>
      {/* 标签 */}
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {note.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-1.5 py-0.5 text-[9px] font-mono bg-cyber-accent/10 text-cyber-accent/70 rounded">#{tag}</span>
          ))}
        </div>
      )}
      {/* 底部信息 */}
      <div className="flex items-center justify-between text-[10px] text-gray-600 font-mono">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-0.5">
            <Calendar className="w-2.5 h-2.5" />
            {formatDateShort(note.updatedAt)}
          </span>
          <span className="flex items-center gap-0.5">
            <Eye className="w-2.5 h-2.5" />
            {note.views}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite() }}
            className={cn('p-0.5 rounded hover:bg-white/10', note.isFavorite ? 'text-yellow-400' : 'text-gray-600 hover:text-gray-400')}
          >
            <Star className="w-3 h-3" fill={note.isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu) }}
            className="p-0.5 rounded hover:bg-white/10 text-gray-600 hover:text-cyber-text"
          >
            <Edit3 className="w-3 h-3" />
          </button>
        </div>
      </div>
      {/* 操作菜单 */}
      {showMenu && (
        <div
          className="absolute bottom-2 right-2 bg-cyber-bg border border-cyber-border/40 rounded-lg shadow-lg py-1 z-10 min-w-[100px]"
          onClick={e => e.stopPropagation()}
        >
          <MenuItem icon={Pin} label={note.isPinned ? '取消置顶' : '置顶'} onClick={() => { onTogglePinned(); setShowMenu(false) }} />
          <MenuItem icon={Share2} label="分享" onClick={() => { onShare(); setShowMenu(false) }} />
          <MenuItem icon={Download} label="导出" onClick={() => { onExport(); setShowMenu(false) }} />
          <MenuItem icon={History} label="历史" onClick={() => { onHistory(); setShowMenu(false) }} />
          <MenuItem icon={Trash2} label="删除" danger onClick={() => { onDelete(); setShowMenu(false) }} />
        </div>
      )}
    </div>
  )
}

// ============ 笔记列表项 ============

function NoteListItem({ note, notebook, onClick, onToggleFavorite, onTogglePinned, onDelete, onShare, onExport, onHistory }: {
  note: Note
  notebook?: Notebook
  copiedId: string | null
  onClick: () => void
  onToggleFavorite: () => void
  onTogglePinned: () => void
  onDelete: () => void
  onShare: () => void
  onExport: () => void
  onHistory: () => void
}) {
  const [showMenu, setShowMenu] = useState(false)
  return (
    <div
      className={cn(
        'relative flex items-center gap-3 p-2.5 bg-cyber-panel/40 border rounded-lg cursor-pointer hover:border-cyber-accent/40 transition-all',
        note.isPinned ? 'border-cyber-accent/40 bg-cyber-accent/5' : 'border-cyber-border/20'
      )}
      onClick={onClick}
    >
      {note.isPinned && <Pin className="w-3 h-3 text-cyber-accent flex-shrink-0" fill="currentColor" />}
      {notebook && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: notebook.color }} />}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-xs font-bold text-cyber-text truncate">{note.title}</h4>
          {note.tags.slice(0, 2).map(tag => (
            <span key={tag} className="px-1 py-0.5 text-[9px] font-mono bg-cyber-accent/10 text-cyber-accent/70 rounded">#{tag}</span>
          ))}
        </div>
        <p className="text-[10px] text-gray-500 truncate mt-0.5">{note.content.replace(/[#*`>\-]/g, '').slice(0, 80)}</p>
      </div>
      <div className="flex items-center gap-1 text-[10px] text-gray-600 font-mono">
        <Calendar className="w-2.5 h-2.5" />
        {formatDateShort(note.updatedAt)}
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onToggleFavorite() }}
        className={cn('p-1 rounded hover:bg-white/10', note.isFavorite ? 'text-yellow-400' : 'text-gray-600 hover:text-gray-400')}
      >
        <Star className="w-3 h-3" fill={note.isFavorite ? 'currentColor' : 'none'} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu) }}
        className="p-1 rounded hover:bg-white/10 text-gray-600 hover:text-cyber-text"
      >
        <Edit3 className="w-3 h-3" />
      </button>
      {showMenu && (
        <div
          className="absolute right-2 top-10 bg-cyber-bg border border-cyber-border/40 rounded-lg shadow-lg py-1 z-10 min-w-[100px]"
          onClick={e => e.stopPropagation()}
        >
          <MenuItem icon={Pin} label={note.isPinned ? '取消置顶' : '置顶'} onClick={() => { onTogglePinned(); setShowMenu(false) }} />
          <MenuItem icon={Share2} label="分享" onClick={() => { onShare(); setShowMenu(false) }} />
          <MenuItem icon={Download} label="导出" onClick={() => { onExport(); setShowMenu(false) }} />
          <MenuItem icon={History} label="历史" onClick={() => { onHistory(); setShowMenu(false) }} />
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

// ============ 笔记编辑器 ============

function NoteEditor({ note, notebooks, isCreating, onClose, onSave }: {
  note: Note | null
  notebooks: Notebook[]
  isCreating: boolean
  onClose: () => void
  onSave: (note: Note) => void
}) {
  const [form, setForm] = useState<Note>(note || {
    id: `note_${Date.now()}`,
    title: '',
    content: '',
    notebookId: notebooks[0]?.id || 'nb_1',
    tags: [],
    isFavorite: false,
    isPinned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 0,
    versions: [],
  })
  const [showPreview, setShowPreview] = useState(false)
  const [tagInput, setTagInput] = useState('')

  const insertText = (before: string, after: string = '') => {
    const textarea = document.getElementById('note-textarea') as HTMLTextAreaElement
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = form.content.substring(start, end)
    const newContent = form.content.substring(0, start) + before + selected + after + form.content.substring(end)
    setForm({ ...form, content: newContent })
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  const handleSave = () => {
    if (!form.title.trim()) return
    onSave({ ...form, updatedAt: new Date().toISOString() })
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div
        className="bg-cyber-bg border border-cyber-border/40 rounded-t-xl sm:rounded-xl w-full sm:max-w-3xl h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="px-4 py-3 border-b border-cyber-border/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PenLine className="w-4 h-4 text-cyber-accent" />
            <h2 className="text-sm font-bold text-cyber-text font-mono">{isCreating ? '新建笔记' : '编辑笔记'}</h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={cn('p-1.5 rounded-lg transition-all', showPreview ? 'bg-cyber-accent/10 text-cyber-accent' : 'text-gray-400 hover:text-cyber-text hover:bg-white/5')}
              title={showPreview ? '编辑' : '预览'}
            >
              {showPreview ? <Code2 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button onClick={onClose} className="p-1.5 text-gray-500 hover:text-cyber-text rounded hover:bg-white/5">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 元信息 */}
        <div className="px-4 py-2 border-b border-cyber-border/20 flex items-center gap-2 flex-wrap">
          <select
            value={form.notebookId}
            onChange={e => setForm({ ...form, notebookId: e.target.value })}
            className="px-2 py-1 text-[10px] bg-cyber-bg-secondary border border-cyber-border/30 rounded text-cyber-text focus:outline-none focus:border-cyber-accent/50 font-mono"
          >
            {notebooks.map(nb => <option key={nb.id} value={nb.id}>{nb.name}</option>)}
          </select>
          {form.tags.map(tag => (
            <span key={tag} className="px-1.5 py-0.5 text-[9px] font-mono bg-cyber-accent/10 text-cyber-accent/70 rounded flex items-center gap-1">
              #{tag}
              <button onClick={() => setForm({ ...form, tags: form.tags.filter(t => t !== tag) })} className="text-gray-500 hover:text-red-400">
                <X className="w-2 h-2" />
              </button>
            </span>
          ))}
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
            placeholder="+标签"
            className="w-16 px-1 py-0.5 text-[10px] bg-transparent border border-cyber-border/30 rounded text-cyber-text placeholder-gray-600 focus:outline-none focus:border-cyber-accent/50"
          />
        </div>

        {/* 富文本工具栏 */}
        {!showPreview && (
          <div className="px-4 py-1.5 border-b border-cyber-border/20 flex items-center gap-0.5 flex-wrap">
            <ToolbarButton icon={Heading} onClick={() => insertText('# ')} title="标题" />
            <ToolbarButton icon={Bold} onClick={() => insertText('**', '**')} title="粗体" />
            <ToolbarButton icon={Italic} onClick={() => insertText('*', '*')} title="斜体" />
            <ToolbarButton icon={ListIcon} onClick={() => insertText('- ')} title="列表" />
            <ToolbarButton icon={ListChecks} onClick={() => insertText('- [ ] ')} title="待办" />
            <ToolbarButton icon={Quote} onClick={() => insertText('> ')} title="引用" />
            <ToolbarButton icon={Code} onClick={() => insertText('`', '`')} title="代码" />
            <ToolbarButton icon={LinkIcon} onClick={() => insertText('[', '](url)')} title="链接" />
            <ToolbarButton icon={Image} onClick={() => insertText('![alt](', ')')} title="图片" />
          </div>
        )}

        {/* 标题 */}
        <div className="px-4 py-2 border-b border-cyber-border/20">
          <input
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="笔记标题..."
            className="w-full text-base font-bold bg-transparent text-cyber-text placeholder-gray-600 focus:outline-none"
          />
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-auto">
          {showPreview ? (
            <div className="p-4 prose-sm text-cyber-text">
              <MarkdownPreview content={form.content} />
            </div>
          ) : (
            <textarea
              id="note-textarea"
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              placeholder="开始输入内容...支持 Markdown 语法"
              className="w-full h-full p-4 text-xs bg-transparent text-cyber-text placeholder-gray-600 focus:outline-none resize-none font-mono leading-relaxed"
            />
          )}
        </div>

        {/* 底部 */}
        <div className="px-4 py-3 border-t border-cyber-border/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] text-gray-600 font-mono">
            <span>{form.content.length} 字符</span>
            <span>·</span>
            <span>{form.content.split('\n').length} 行</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-3 py-1.5 text-xs text-gray-400 hover:text-cyber-text font-mono">取消</button>
            <button
              onClick={handleSave}
              disabled={!form.title.trim()}
              className="px-4 py-1.5 text-xs bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/30 rounded-lg hover:bg-cyber-accent/20 disabled:opacity-40 disabled:cursor-not-allowed font-mono"
            >
              {isCreating ? '创建' : '保存'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ 工具栏按钮 ============

function ToolbarButton({ icon: Icon, onClick, title }: {
  icon: typeof Bold
  onClick: () => void
  title: string
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="p-1.5 rounded text-gray-400 hover:text-cyber-accent hover:bg-white/5 transition-all"
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  )
}

// ============ Markdown 预览 ============

function MarkdownPreview({ content }: { content: string }) {
  return (
    <div className="text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }} />
  )
}

// ============ Markdown 转 HTML ============

function markdownToHtml(md: string): string {
  let html = md
  // 转义 HTML
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  // 代码块
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => `<pre class="bg-cyber-bg-secondary p-3 rounded-lg overflow-x-auto my-2"><code>${code.trim()}</code></pre>`)
  // 标题
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-sm font-bold text-cyber-text mt-3 mb-1">$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-base font-bold text-cyber-text mt-3 mb-1">$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-lg font-bold text-cyber-text mt-3 mb-2">$1</h1>')
  // 粗体斜体
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="text-cyber-text font-bold">$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
  // 行内代码
  html = html.replace(/`(.+?)`/g, '<code class="bg-cyber-bg-secondary px-1 py-0.5 rounded text-cyber-accent">$1</code>')
  // 引用
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-2 border-cyber-accent/40 pl-3 text-gray-400 my-2">$1</blockquote>')
  // 待办列表
  html = html.replace(/^- \[ \] (.+)$/gm, '<div class="flex items-center gap-2 my-1"><input type="checkbox" disabled class="accent-cyber-accent" /><span class="text-gray-300">$1</span></div>')
  html = html.replace(/^- \[x\] (.+)$/gm, '<div class="flex items-center gap-2 my-1"><input type="checkbox" checked disabled class="accent-cyber-accent" /><span class="text-gray-500 line-through">$1</span></div>')
  // 无序列表
  html = html.replace(/^- (.+)$/gm, '<li class="ml-4 text-gray-300 list-disc">$1</li>')
  // 有序列表
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 text-gray-300 list-decimal">$1</li>')
  // 段落
  html = html.replace(/\n\n/g, '</p><p class="text-gray-300 my-1">')
  html = `<p class="text-gray-300">${html}</p>`
  return html
}

// ============ 模板选择弹窗 ============

function TemplateModal({ onClose, onSelect }: {
  onClose: () => void
  onSelect: (template: NoteTemplate) => void
}) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-cyber-bg border border-cyber-border/40 rounded-t-xl sm:rounded-xl w-full sm:max-w-md p-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-cyber-text font-mono flex items-center gap-2">
            <Copy className="w-4 h-4 text-cyber-accent" />
            选择模板
          </h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-cyber-text rounded hover:bg-white/5">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {noteTemplates.map(tpl => (
            <button
              key={tpl.id}
              onClick={() => onSelect(tpl)}
              className="text-left p-3 bg-cyber-bg-secondary/40 border border-cyber-border/30 rounded-lg hover:border-cyber-accent/40 hover:bg-cyber-accent/5 transition-all"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{tpl.icon}</span>
                <span className="text-xs font-bold text-cyber-text">{tpl.name}</span>
              </div>
              <p className="text-[10px] text-gray-500">{tpl.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============ 笔记本管理弹窗 ============

function NotebookManagerModal({ notebooks, notes, onClose, onAdd, onRename, onDelete }: {
  notebooks: Notebook[]
  notes: Note[]
  onClose: () => void
  onAdd: (name: string, color: string) => void
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
}) {
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(notebookColors[0].value)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-cyber-bg border border-cyber-border/40 rounded-t-xl sm:rounded-xl w-full sm:max-w-md max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="px-4 py-3 border-b border-cyber-border/30 flex items-center justify-between">
          <h2 className="text-sm font-bold text-cyber-text font-mono flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyber-accent" />
            笔记本管理
          </h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-cyber-text rounded hover:bg-white/5">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {notebooks.map(nb => {
            const count = notes.filter(n => n.notebookId === nb.id).length
            return (
              <div key={nb.id} className="flex items-center gap-2 p-2.5 bg-cyber-bg-secondary/40 rounded-lg border border-cyber-border/20">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: nb.color }} />
                {editingId === nb.id ? (
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && editName.trim()) {
                        onRename(nb.id, editName.trim())
                        setEditingId(null)
                      }
                    }}
                    className="flex-1 px-2 py-1 text-xs bg-cyber-bg border border-cyber-accent/30 rounded text-cyber-text focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <span className="flex-1 text-xs text-cyber-text">{nb.name}</span>
                )}
                <span className="text-[10px] text-gray-500 font-mono">{count} 篇</span>
                {editingId === nb.id ? (
                  <button onClick={() => { onRename(nb.id, editName.trim()); setEditingId(null) }} className="p-1 text-cyber-accent hover:bg-white/5 rounded">
                    <Check className="w-3 h-3" />
                  </button>
                ) : (
                  <button onClick={() => { setEditingId(nb.id); setEditName(nb.name) }} className="p-1 text-gray-500 hover:text-cyber-accent hover:bg-white/5 rounded">
                    <Edit3 className="w-3 h-3" />
                  </button>
                )}
                <button onClick={() => onDelete(nb.id)} className="p-1 text-gray-500 hover:text-red-400 hover:bg-white/5 rounded">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )
          })}
        </div>
        {/* 新建笔记本 */}
        <div className="px-4 py-3 border-t border-cyber-border/30">
          <div className="flex items-center gap-2 mb-2">
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="新笔记本名称..."
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
            {notebookColors.map(c => (
              <button
                key={c.value}
                onClick={() => setNewColor(c.value)}
                className={cn('w-5 h-5 rounded-full border-2 transition-all', newColor === c.value ? 'border-white scale-110' : 'border-transparent')}
                style={{ backgroundColor: c.value }}
                title={c.label}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ 版本历史弹窗 ============

function HistoryModal({ note, onClose, onRestore }: {
  note: Note
  onClose: () => void
  onRestore: (version: NoteVersion) => void
}) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-cyber-bg border border-cyber-border/40 rounded-t-xl sm:rounded-xl w-full sm:max-w-md max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="px-4 py-3 border-b border-cyber-border/30 flex items-center justify-between">
          <h2 className="text-sm font-bold text-cyber-text font-mono flex items-center gap-2">
            <History className="w-4 h-4 text-cyber-accent" />
            版本历史
          </h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-cyber-text rounded hover:bg-white/5">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {[...note.versions].reverse().map(v => (
            <div key={v.id} className="p-3 bg-cyber-bg-secondary/40 border border-cyber-border/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 text-[9px] font-mono bg-cyber-accent/10 text-cyber-accent rounded">v{v.version}</span>
                  <span className="text-[10px] text-gray-500 font-mono">{v.operator}</span>
                </div>
                <span className="text-[10px] text-gray-600 font-mono">{formatDateTime(v.updatedAt)}</span>
              </div>
              <p className="text-[11px] text-gray-400 line-clamp-3 mb-2">{v.content.slice(0, 100)}...</p>
              <button
                onClick={() => onRestore(v)}
                className="px-2 py-1 text-[10px] text-cyber-accent border border-cyber-accent/30 rounded hover:bg-cyber-accent/10 font-mono"
              >
                恢复此版本
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============ 分享弹窗 ============

function ShareModal({ note, copied, onCopy, onClose }: {
  note: Note
  copied: boolean
  onCopy: () => void
  onClose: () => void
}) {
  const shareUrl = `https://hopeagent.pro/notes/${note.id}`
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-cyber-bg border border-cyber-border/40 rounded-t-xl sm:rounded-xl w-full sm:max-w-sm p-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-cyber-text font-mono flex items-center gap-2">
            <Share2 className="w-4 h-4 text-cyber-accent" />
            分享笔记
          </h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-cyber-text rounded hover:bg-white/5">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[11px] text-gray-400 mb-2">复制下方链接分享笔记：</p>
        <div className="flex items-center gap-2 p-2 bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg">
          <input
            readOnly
            value={shareUrl}
            className="flex-1 text-[11px] bg-transparent text-cyber-text font-mono focus:outline-none"
          />
          <button
            onClick={onCopy}
            className={cn('p-1.5 rounded transition-all', copied ? 'text-cyber-accent bg-cyber-accent/10' : 'text-gray-400 hover:text-cyber-accent hover:bg-white/5')}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
        {copied && <p className="text-[10px] text-cyber-accent mt-2 font-mono">链接已复制到剪贴板</p>}
      </div>
    </div>
  )
}

// ============ 导出弹窗 ============

function ExportModal({ note, onExport, onClose }: {
  note: Note
  onExport: (format: 'md' | 'html' | 'pdf') => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-cyber-bg border border-cyber-border/40 rounded-t-xl sm:rounded-xl w-full sm:max-w-sm p-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-cyber-text font-mono flex items-center gap-2">
            <Download className="w-4 h-4 text-cyber-accent" />
            导出笔记
          </h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-cyber-text rounded hover:bg-white/5">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2">
          <button
            onClick={() => onExport('md')}
            className="w-full flex items-center gap-3 p-3 bg-cyber-bg-secondary/40 border border-cyber-border/20 rounded-lg hover:border-cyber-accent/40 hover:bg-cyber-accent/5 transition-all text-left"
          >
            <FileText className="w-4 h-4 text-cyber-accent" />
            <div>
              <div className="text-xs text-cyber-text font-bold">Markdown</div>
              <div className="text-[10px] text-gray-500">.md 格式，通用 Markdown 文件</div>
            </div>
          </button>
          <button
            onClick={() => onExport('html')}
            className="w-full flex items-center gap-3 p-3 bg-cyber-bg-secondary/40 border border-cyber-border/20 rounded-lg hover:border-cyber-accent/40 hover:bg-cyber-accent/5 transition-all text-left"
          >
            <Code2 className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-xs text-cyber-text font-bold">HTML</div>
              <div className="text-[10px] text-gray-500">.html 格式，可直接在浏览器打开</div>
            </div>
          </button>
          <button
            onClick={() => onExport('pdf')}
            className="w-full flex items-center gap-3 p-3 bg-cyber-bg-secondary/40 border border-cyber-border/20 rounded-lg hover:border-cyber-accent/40 hover:bg-cyber-accent/5 transition-all text-left"
          >
            <FileText className="w-4 h-4 text-red-400" />
            <div>
              <div className="text-xs text-cyber-text font-bold">PDF（模拟）</div>
              <div className="text-[10px] text-gray-500">通过浏览器打印功能生成 PDF</div>
            </div>
          </button>
        </div>
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

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
