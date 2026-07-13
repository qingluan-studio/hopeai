import { useState, useMemo, useRef, useEffect } from 'react'
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  Calendar,
  MoreVertical,
  Edit3,
  Trash2,
  User,
  Tag,
  Flag,
  X,
  ChevronLeft,
  ChevronRight,
  Paperclip,
  MessageSquare,
  History,
  CheckSquare,
  Square,
  Download,
  Copy,
  Archive,
  ArrowUp,
  ArrowDown,
  Calendar as CalendarIcon,
  Users,
  TrendingUp,
  AlertTriangle,
  Target,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============

// 任务状态
type TaskStatus = 'todo' | 'doing' | 'review' | 'done'

// 任务优先级
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

// 任务类型
interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  tags: string[]
  assignee: string
  dueDate: string
  createdAt: string
  updatedAt: string
  progress: number
  comments: TaskComment[]
  attachments: TaskAttachment[]
  history: TaskHistory[]
  subtasks: { id: string; title: string; done: boolean }[]
}

// 任务评论
interface TaskComment {
  id: string
  author: string
  content: string
  createdAt: string
}

// 任务附件
interface TaskAttachment {
  id: string
  name: string
  size: string
  type: string
}

// 任务历史
interface TaskHistory {
  id: string
  action: string
  operator: string
  timestamp: string
}

// 任务模板
interface TaskTemplate {
  id: string
  name: string
  icon: string
  title: string
  description: string
  priority: TaskPriority
  tags: string[]
}

// 视图类型
type ViewMode = 'board' | 'list' | 'calendar'

// 排序字段
type SortField = 'dueDate' | 'priority' | 'createdAt' | 'title'

// ============ 常量配置 ============

// 状态配置
const statusConfig: Record<TaskStatus, { label: string; color: string; bgColor: string; borderColor: string; icon: typeof Circle }> = {
  todo: { label: '待办', color: 'text-gray-400', bgColor: 'bg-gray-500/10', borderColor: 'border-gray-500/30', icon: Circle },
  doing: { label: '进行中', color: 'text-cyan-400', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/30', icon: Clock },
  review: { label: '审核中', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/30', icon: AlertCircle },
  done: { label: '已完成', color: 'text-cyber-accent', bgColor: 'bg-cyber-accent/10', borderColor: 'border-cyber-accent/30', icon: CheckCircle2 },
}

// 优先级配置
const priorityConfig: Record<TaskPriority, { label: string; color: string; bgColor: string; icon: typeof Flag }> = {
  low: { label: '低', color: 'text-gray-400', bgColor: 'bg-gray-500/10', icon: Flag },
  medium: { label: '中', color: 'text-blue-400', bgColor: 'bg-blue-500/10', icon: Flag },
  high: { label: '高', color: 'text-orange-400', bgColor: 'bg-orange-500/10', icon: Flag },
  urgent: { label: '紧急', color: 'text-red-400', bgColor: 'bg-red-500/10', icon: AlertTriangle },
}

// 优先级排序权重
const priorityWeight: Record<TaskPriority, number> = { urgent: 4, high: 3, medium: 2, low: 1 }

// 团队成员
const teamMembers = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']

// 所有标签
const allTags = ['前端', '后端', '设计', '测试', '文档', 'Bug', '功能', '优化', '安全', '性能', '重构', '会议']

// 任务模板
const taskTemplates: TaskTemplate[] = [
  { id: 'tpl_1', name: 'Bug修复', icon: '🐛', title: '修复[模块]的[问题描述]', description: '描述Bug复现步骤、影响范围与修复方案。', priority: 'high', tags: ['Bug', '测试'] },
  { id: 'tpl_2', name: '功能开发', icon: '✨', title: '开发[功能名称]功能', description: '描述功能需求、技术方案与验收标准。', priority: 'medium', tags: ['功能', '前端'] },
  { id: 'tpl_3', name: '性能优化', icon: '⚡', title: '优化[模块]性能', description: '描述性能瓶颈、优化目标与方案。', priority: 'high', tags: ['优化', '性能'] },
  { id: 'tpl_4', name: '文档撰写', icon: '📝', title: '撰写[文档名称]', description: '描述文档类型、目标读者与大纲。', priority: 'low', tags: ['文档'] },
  { id: 'tpl_5', name: '代码评审', icon: '🔍', title: '评审[PR名称]', description: '描述评审重点与注意事项。', priority: 'medium', tags: ['重构'] },
  { id: 'tpl_6', name: '会议安排', icon: '📅', title: '组织[会议主题]会议', description: '描述会议目的、参会人与议程。', priority: 'medium', tags: ['会议'] },
]

// ============ Mock 数据生成 ============

// 生成 mock 任务数据
const generateMockTasks = (): Task[] => {
  const titles = [
    '优化首页加载性能', '修复登录页面闪烁问题', '设计新的用户引导流程',
    '重构状态管理逻辑', '编写API接口文档', '添加单元测试覆盖',
    '实现暗黑模式切换', '优化数据库查询性能', '修复移动端布局错乱',
    '设计数据可视化图表', '完成支付模块对接', '优化图片懒加载策略',
    '修复表单验证Bug', '重构组件库按钮组件', '添加错误边界处理',
    '实现消息推送功能', '优化SEO元信息', '修复路由跳转异常',
    '设计空状态插画', '完成国际化配置', '优化打包构建速度',
    '修复跨域请求问题', '实现拖拽排序功能', '添加操作日志记录',
    '优化首屏渲染策略', '修复时间显示错误', '设计加载动画',
    '完成用户反馈收集', '优化缓存策略', '修复权限校验问题',
  ]
  const descriptions = [
    '分析当前性能瓶颈，制定优化方案并实施。重点关注首屏加载时间和交互响应速度。',
    '需要复现问题场景，定位根因并修复。同时补充相关测试用例避免回归。',
    '根据产品需求设计交互流程，输出设计方案并与开发团队对齐实现细节。',
    '梳理现有代码结构，提取公共逻辑，降低耦合度，提升可维护性。',
    '梳理所有接口字段与参数，输出规范的接口文档供前后端联调使用。',
    '补充核心模块的单元测试，提升覆盖率到80%以上，确保关键路径稳定。',
  ]
  const statuses: TaskStatus[] = ['todo', 'doing', 'review', 'done']
  const priorities: TaskPriority[] = ['low', 'medium', 'high', 'urgent']
  const attachmentNames = ['需求文档.pdf', '设计稿.fig', '原型图.png', '技术方案.md', '测试报告.xlsx']
  const commentTexts = ['已开始处理', '需要前端配合', '方案已确认', '请补充测试用例', '已修复，待验证', '建议增加异常处理']
  const historyActions = ['创建任务', '修改状态', '更新描述', '分配负责人', '修改优先级', '添加评论', '上传附件']

  const tasks: Task[] = []
  const now = Date.now()

  for (let i = 0; i < 30; i++) {
    const status = statuses[i % 4]
    const priority = priorities[i % 4]
    const dueOffset = (i - 10) * 86400000
    const dueDate = new Date(now + dueOffset).toISOString()
    const createdAt = new Date(now - (20 - i % 20) * 86400000).toISOString()
    const updatedAt = new Date(now - Math.floor(Math.random() * 5) * 86400000).toISOString()

    const commentCount = Math.floor(Math.random() * 4)
    const comments: TaskComment[] = []
    for (let j = 0; j < commentCount; j++) {
      comments.push({
        id: `cmt_${i}_${j}`,
        author: teamMembers[Math.floor(Math.random() * teamMembers.length)],
        content: commentTexts[Math.floor(Math.random() * commentTexts.length)],
        createdAt: new Date(now - Math.floor(Math.random() * 7) * 86400000).toISOString(),
      })
    }

    const attachmentCount = Math.floor(Math.random() * 3)
    const attachments: TaskAttachment[] = []
    for (let j = 0; j < attachmentCount; j++) {
      const name = attachmentNames[Math.floor(Math.random() * attachmentNames.length)]
      attachments.push({
        id: `att_${i}_${j}`,
        name,
        size: `${Math.floor(Math.random() * 500) + 50}KB`,
        type: name.split('.').pop() || 'file',
      })
    }

    const historyCount = Math.floor(Math.random() * 4) + 1
    const history: TaskHistory[] = []
    for (let j = 0; j < historyCount; j++) {
      history.push({
        id: `his_${i}_${j}`,
        action: historyActions[Math.floor(Math.random() * historyActions.length)],
        operator: teamMembers[Math.floor(Math.random() * teamMembers.length)],
        timestamp: new Date(now - (historyCount - j) * 3600000 * Math.floor(Math.random() * 24 + 1)).toISOString(),
      })
    }

    const subtaskCount = Math.floor(Math.random() * 4)
    const subtasks = []
    for (let j = 0; j < subtaskCount; j++) {
      subtasks.push({
        id: `sub_${i}_${j}`,
        title: `子任务 ${j + 1}`,
        done: Math.random() > 0.5,
      })
    }

    tasks.push({
      id: `task_${i + 1}`,
      title: titles[i],
      description: descriptions[i % descriptions.length],
      status,
      priority,
      tags: [allTags[i % allTags.length], allTags[(i + 3) % allTags.length]].filter((v, idx, arr) => arr.indexOf(v) === idx),
      assignee: teamMembers[i % teamMembers.length],
      dueDate,
      createdAt,
      updatedAt,
      progress: status === 'done' ? 100 : status === 'review' ? 80 : status === 'doing' ? Math.floor(Math.random() * 50) + 30 : 0,
      comments,
      attachments,
      history,
      subtasks,
    })
  }

  return tasks
}

const initialTasks = generateMockTasks()

// ============ 主组件 ============

export default function TaskManagePage() {
  // 任务数据
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  // 当前视图
  const [viewMode, setViewMode] = useState<ViewMode>('board')
  // 搜索关键字
  const [searchQuery, setSearchQuery] = useState('')
  // 筛选条件
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all')
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all')
  const [filterTag, setFilterTag] = useState<string>('all')
  const [filterAssignee, setFilterAssignee] = useState<string>('all')
  // 排序
  const [sortField, setSortField] = useState<SortField>('dueDate')
  const [sortAsc, setSortAsc] = useState(true)
  // 显示筛选面板
  const [showFilter, setShowFilter] = useState(false)
  // 选中任务（详情弹窗）
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  // 编辑/创建任务
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  // 批量选中
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  // 显示模板
  const [showTemplates, setShowTemplates] = useState(false)
  // 拖拽中的任务
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(null)
  // 日历当前月份
  const [calendarDate, setCalendarDate] = useState(new Date())

  // 过滤后的任务
  const filteredTasks = useMemo(() => {
    let result = tasks
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q)
      )
    }
    if (filterStatus !== 'all') result = result.filter(t => t.status === filterStatus)
    if (filterPriority !== 'all') result = result.filter(t => t.priority === filterPriority)
    if (filterTag !== 'all') result = result.filter(t => t.tags.includes(filterTag))
    if (filterAssignee !== 'all') result = result.filter(t => t.assignee === filterAssignee)
    return result
  }, [tasks, searchQuery, filterStatus, filterPriority, filterTag, filterAssignee])

  // 排序后的任务
  const sortedTasks = useMemo(() => {
    const result = [...filteredTasks]
    result.sort((a, b) => {
      let cmp = 0
      if (sortField === 'dueDate') cmp = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      else if (sortField === 'priority') cmp = priorityWeight[b.priority] - priorityWeight[a.priority]
      else if (sortField === 'createdAt') cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      else if (sortField === 'title') cmp = a.title.localeCompare(b.title)
      return sortAsc ? cmp : -cmp
    })
    return result
  }, [filteredTasks, sortField, sortAsc])

  // 统计数据
  const stats = useMemo(() => {
    const total = tasks.length
    const done = tasks.filter(t => t.status === 'done').length
    const now = Date.now()
    const weekStart = now - 7 * 86400000
    const overdue = tasks.filter(t => t.status !== 'done' && new Date(t.dueDate).getTime() < now).length
    const thisWeek = tasks.filter(t => {
      const created = new Date(t.createdAt).getTime()
      return created >= weekStart
    }).length
    return {
      total,
      done,
      completionRate: total > 0 ? Math.round((done / total) * 100) : 0,
      overdue,
      overdueRate: total > 0 ? Math.round((overdue / total) * 100) : 0,
      thisWeek,
      todo: tasks.filter(t => t.status === 'todo').length,
      doing: tasks.filter(t => t.status === 'doing').length,
      review: tasks.filter(t => t.status === 'review').length,
    }
  }, [tasks])

  // 按状态分组（看板视图）
  const tasksByStatus = useMemo(() => {
    const groups: Record<TaskStatus, Task[]> = { todo: [], doing: [], review: [], done: [] }
    filteredTasks.forEach(t => groups[t.status].push(t))
    return groups
  }, [filteredTasks])

  // 拖拽开始
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggingId(taskId)
    e.dataTransfer.effectAllowed = 'move'
  }

  // 拖拽放置
  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault()
    if (!draggingId) return
    setTasks(prev => prev.map(t => t.id === draggingId ? { ...t, status, progress: status === 'done' ? 100 : t.progress } : t))
    setDraggingId(null)
    setDragOverStatus(null)
  }

  // 切换排序
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(true)
    }
  }

  // 删除任务
  const handleDelete = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
    setSelectedTask(null)
  }

  // 保存任务（创建/编辑）
  const handleSaveTask = (task: Task) => {
    if (isCreating) {
      setTasks(prev => [task, ...prev])
    } else {
      setTasks(prev => prev.map(t => t.id === task.id ? task : t))
    }
    setEditingTask(null)
    setIsCreating(false)
  }

  // 从模板创建任务
  const handleCreateFromTemplate = (template: TaskTemplate) => {
    const newTask: Task = {
      id: `task_${Date.now()}`,
      title: template.title,
      description: template.description,
      status: 'todo',
      priority: template.priority,
      tags: template.tags,
      assignee: teamMembers[0],
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: 0,
      comments: [],
      attachments: [],
      history: [{ id: `his_${Date.now()}`, action: '从模板创建任务', operator: '我', timestamp: new Date().toISOString() }],
      subtasks: [],
    }
    setTasks(prev => [newTask, ...prev])
    setShowTemplates(false)
  }

  // 批量删除
  const handleBatchDelete = () => {
    setTasks(prev => prev.filter(t => !selectedIds.includes(t.id)))
    setSelectedIds([])
  }

  // 批量修改状态
  const handleBatchStatus = (status: TaskStatus) => {
    setTasks(prev => prev.map(t => selectedIds.includes(t.id) ? { ...t, status } : t))
    setSelectedIds([])
  }

  // 切换选中
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  // 清除筛选
  const clearFilters = () => {
    setFilterStatus('all')
    setFilterPriority('all')
    setFilterTag('all')
    setFilterAssignee('all')
    setSearchQuery('')
  }

  const hasActiveFilter = filterStatus !== 'all' || filterPriority !== 'all' || filterTag !== 'all' || filterAssignee !== 'all'

  return (
    <div className="h-full flex flex-col bg-cyber-bg">
      {/* 顶部标题栏 */}
      <div className="border-b border-cyber-border/30 bg-cyber-panel/40 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-base font-bold text-cyber-text flex items-center gap-2">
              <Target className="w-4 h-4 text-cyber-accent" />
              任务管理
            </h1>
            <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
              看板 · 列表 · 日历 · 共 {tasks.length} 个任务
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setShowTemplates(true) }}
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono text-gray-400 hover:text-cyber-text hover:bg-white/5 border border-cyber-border/30 transition-all flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              <span className="hidden sm:inline">模板</span>
            </button>
            <button
              onClick={() => { setIsCreating(true); setEditingTask(null) }}
              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/30 hover:bg-cyber-accent/20 transition-all flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>新建任务</span>
            </button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          <StatCard icon={CheckCircle2} label="完成率" value={`${stats.completionRate}%`} sub={`${stats.done}/${stats.total}`} color="text-cyber-accent" />
          <StatCard icon={AlertTriangle} label="延期率" value={`${stats.overdueRate}%`} sub={`${stats.overdue} 个延期`} color="text-red-400" />
          <StatCard icon={TrendingUp} label="本周新增" value={`${stats.thisWeek}`} sub="个任务" color="text-cyan-400" />
          <StatCard icon={Clock} label="进行中" value={`${stats.doing}`} sub={`${stats.review} 个审核`} color="text-yellow-400" />
        </div>

        {/* 工具栏 */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* 搜索框 */}
          <div className="relative flex-1 min-w-[160px] max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜索任务..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg text-cyber-text placeholder-gray-600 focus:outline-none focus:border-cyber-accent/50"
            />
          </div>

          {/* 筛选按钮 */}
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

          {/* 视图切换 */}
          <div className="flex items-center bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg p-0.5">
            {(['board', 'list', 'calendar'] as ViewMode[]).map(mode => {
              const Icon = mode === 'board' ? LayoutGrid : mode === 'list' ? List : CalendarIcon
              return (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    'p-1.5 rounded transition-all',
                    viewMode === mode
                      ? 'bg-cyber-accent/20 text-cyber-accent'
                      : 'text-gray-500 hover:text-gray-300'
                  )}
                  title={mode === 'board' ? '看板视图' : mode === 'list' ? '列表视图' : '日历视图'}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              )
            })}
          </div>

          {hasActiveFilter && (
            <button
              onClick={clearFilters}
              className="px-2 py-1 text-[10px] text-gray-500 hover:text-red-400 font-mono"
            >
              清除筛选
            </button>
          )}
        </div>

        {/* 筛选面板 */}
        {showFilter && (
          <div className="mt-2 p-3 bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-2">
            <FilterSelect
              label="状态"
              value={filterStatus}
              options={[{ value: 'all', label: '全部' }, ...Object.entries(statusConfig).map(([k, v]) => ({ value: k, label: v.label }))]}
              onChange={v => setFilterStatus(v as TaskStatus | 'all')}
            />
            <FilterSelect
              label="优先级"
              value={filterPriority}
              options={[{ value: 'all', label: '全部' }, ...Object.entries(priorityConfig).map(([k, v]) => ({ value: k, label: v.label }))]}
              onChange={v => setFilterPriority(v as TaskPriority | 'all')}
            />
            <FilterSelect
              label="标签"
              value={filterTag}
              options={[{ value: 'all', label: '全部' }, ...allTags.map(t => ({ value: t, label: t }))]}
              onChange={setFilterTag}
            />
            <FilterSelect
              label="负责人"
              value={filterAssignee}
              options={[{ value: 'all', label: '全部' }, ...teamMembers.map(m => ({ value: m, label: m }))]}
              onChange={setFilterAssignee}
            />
          </div>
        )}

        {/* 批量操作栏 */}
        {selectedIds.length > 0 && (
          <div className="mt-2 p-2 bg-cyber-accent/5 border border-cyber-accent/30 rounded-lg flex items-center gap-2 flex-wrap">
            <span className="text-xs text-cyber-accent font-mono">已选 {selectedIds.length} 项</span>
            <div className="flex items-center gap-1 ml-auto">
              <button onClick={() => handleBatchStatus('todo')} className="px-2 py-1 text-[10px] text-gray-400 hover:text-cyber-text hover:bg-white/5 rounded font-mono">设为待办</button>
              <button onClick={() => handleBatchStatus('doing')} className="px-2 py-1 text-[10px] text-gray-400 hover:text-cyber-text hover:bg-white/5 rounded font-mono">设为进行中</button>
              <button onClick={() => handleBatchStatus('done')} className="px-2 py-1 text-[10px] text-gray-400 hover:text-cyber-text hover:bg-white/5 rounded font-mono">设为完成</button>
              <button onClick={handleBatchDelete} className="px-2 py-1 text-[10px] text-red-400 hover:bg-red-500/10 rounded font-mono flex items-center gap-1">
                <Trash2 className="w-3 h-3" />删除
              </button>
              <button onClick={() => setSelectedIds([])} className="px-2 py-1 text-[10px] text-gray-500 hover:text-gray-300 font-mono">取消</button>
            </div>
          </div>
        )}
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-auto min-h-0">
        {viewMode === 'board' && (
          <BoardView
            tasksByStatus={tasksByStatus}
            draggingId={draggingId}
            dragOverStatus={dragOverStatus}
            onDragStart={handleDragStart}
            onDragOver={(e, status) => { e.preventDefault(); setDragOverStatus(status) }}
            onDragLeave={() => setDragOverStatus(null)}
            onDrop={handleDrop}
            onDragEnd={() => { setDraggingId(null); setDragOverStatus(null) }}
            onSelectTask={setSelectedTask}
          />
        )}
        {viewMode === 'list' && (
          <ListView
            tasks={sortedTasks}
            selectedIds={selectedIds}
            sortField={sortField}
            sortAsc={sortAsc}
            onToggleSort={toggleSort}
            onToggleSelect={toggleSelect}
            onSelectTask={setSelectedTask}
            onEditTask={t => { setEditingTask(t); setIsCreating(false) }}
          />
        )}
        {viewMode === 'calendar' && (
          <CalendarView
            tasks={filteredTasks}
            calendarDate={calendarDate}
            onPrevMonth={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))}
            onNextMonth={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))}
            onToday={() => setCalendarDate(new Date())}
            onSelectTask={setSelectedTask}
          />
        )}
      </div>

      {/* 任务详情弹窗 */}
      {selectedTask && (
        <TaskDetailModal
          task={tasks.find(t => t.id === selectedTask.id) || selectedTask}
          onClose={() => setSelectedTask(null)}
          onEdit={() => { setEditingTask(selectedTask); setSelectedTask(null); setIsCreating(false) }}
          onDelete={() => handleDelete(selectedTask.id)}
          onStatusChange={(status) => {
            const updated = { ...selectedTask, status, progress: status === 'done' ? 100 : selectedTask.progress }
            setTasks(prev => prev.map(t => t.id === selectedTask.id ? updated : t))
            setSelectedTask(updated)
          }}
        />
      )}

      {/* 任务编辑/创建弹窗 */}
      {editingTask !== null || isCreating ? (
        <TaskEditModal
          task={editingTask}
          isCreating={isCreating}
          onClose={() => { setEditingTask(null); setIsCreating(false) }}
          onSave={handleSaveTask}
        />
      ) : null}

      {/* 模板选择弹窗 */}
      {showTemplates && (
        <TemplateModal
          onClose={() => setShowTemplates(false)}
          onSelect={handleCreateFromTemplate}
        />
      )}
    </div>
  )
}

// ============ 统计卡片组件 ============

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: typeof Target
  label: string
  value: string
  sub: string
  color: string
}) {
  return (
    <div className="bg-cyber-bg-secondary/60 border border-cyber-border/20 rounded-lg p-2.5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-gray-500 font-mono">{label}</span>
        <Icon className={cn('w-3 h-3', color)} />
      </div>
      <div className={cn('text-lg font-bold font-mono', color)}>{value}</div>
      <div className="text-[9px] text-gray-600 font-mono">{sub}</div>
    </div>
  )
}

// ============ 筛选下拉组件 ============

function FilterSelect({ label, value, options, onChange }: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="text-[10px] text-gray-500 font-mono block mb-1">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-2 py-1 text-xs bg-cyber-bg border border-cyber-border/30 rounded text-cyber-text focus:outline-none focus:border-cyber-accent/50"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}

// ============ 看板视图 ============

function BoardView({ tasksByStatus, draggingId, dragOverStatus, onDragStart, onDragOver, onDragLeave, onDrop, onDragEnd, onSelectTask }: {
  tasksByStatus: Record<TaskStatus, Task[]>
  draggingId: string | null
  dragOverStatus: TaskStatus | null
  onDragStart: (e: React.DragEvent, id: string) => void
  onDragOver: (e: React.DragEvent, status: TaskStatus) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent, status: TaskStatus) => void
  onDragEnd: () => void
  onSelectTask: (task: Task) => void
}) {
  const statuses: TaskStatus[] = ['todo', 'doing', 'review', 'done']
  return (
    <div className="h-full overflow-x-auto p-3">
      <div className="flex gap-3 min-w-fit h-full">
        {statuses.map(status => {
          const config = statusConfig[status]
          const StatusIcon = config.icon
          const list = tasksByStatus[status]
          return (
            <div
              key={status}
              onDragOver={e => onDragOver(e, status)}
              onDragLeave={onDragLeave}
              onDrop={e => onDrop(e, status)}
              className={cn(
                'w-[280px] flex-shrink-0 flex flex-col rounded-lg border bg-cyber-bg-secondary/40 transition-colors',
                dragOverStatus === status ? 'border-cyber-accent/50 bg-cyber-accent/5' : 'border-cyber-border/20'
              )}
            >
              {/* 列头 */}
              <div className={cn('px-3 py-2 border-b border-cyber-border/20 flex items-center justify-between', config.bgColor)}>
                <div className="flex items-center gap-2">
                  <StatusIcon className={cn('w-3.5 h-3.5', config.color)} />
                  <span className={cn('text-xs font-mono font-bold', config.color)}>{config.label}</span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono">{list.length}</span>
              </div>
              {/* 任务卡片列表 */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[100px]">
                {list.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isDragging={draggingId === task.id}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onClick={() => onSelectTask(task)}
                  />
                ))}
                {list.length === 0 && (
                  <div className="text-center py-8 text-[10px] text-gray-600 font-mono">
                    拖拽任务到此列
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============ 任务卡片组件 ============

function TaskCard({ task, isDragging, onDragStart, onDragEnd, onClick }: {
  task: Task
  isDragging: boolean
  onDragStart: (e: React.DragEvent, id: string) => void
  onDragEnd: () => void
  onClick: () => void
}) {
  const prio = priorityConfig[task.priority]
  const isOverdue = task.status !== 'done' && new Date(task.dueDate).getTime() < Date.now()
  const PrioIcon = prio.icon
  return (
    <div
      draggable
      onDragStart={e => onDragStart(e, task.id)}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={cn(
        'bg-cyber-panel/60 border rounded-lg p-2.5 cursor-pointer hover:border-cyber-accent/40 transition-all',
        isDragging ? 'opacity-40 border-cyber-accent/50' : 'border-cyber-border/30'
      )}
    >
      {/* 标题与优先级 */}
      <div className="flex items-start gap-2 mb-1.5">
        <PrioIcon className={cn('w-3 h-3 mt-0.5 flex-shrink-0', prio.color)} />
        <h4 className="text-xs font-medium text-cyber-text leading-snug flex-1 line-clamp-2">{task.title}</h4>
      </div>
      {/* 描述 */}
      <p className="text-[10px] text-gray-500 line-clamp-2 mb-2 ml-5">{task.description}</p>
      {/* 标签 */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2 ml-5">
          {task.tags.map(tag => (
            <span key={tag} className="px-1.5 py-0.5 text-[9px] font-mono bg-cyber-accent/10 text-cyber-accent/80 rounded border border-cyber-accent/20">
              {tag}
            </span>
          ))}
        </div>
      )}
      {/* 进度条 */}
      {task.status !== 'todo' && task.status !== 'done' && (
        <div className="ml-5 mb-2">
          <div className="h-1 bg-cyber-bg rounded-full overflow-hidden">
            <div className="h-full bg-cyber-accent/60" style={{ width: `${task.progress}%` }} />
          </div>
        </div>
      )}
      {/* 底部信息 */}
      <div className="flex items-center justify-between ml-5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[9px] text-gray-500 font-mono">
            <CalendarIcon className="w-2.5 h-2.5" />
            <span className={isOverdue ? 'text-red-400' : ''}>{formatDateShort(task.dueDate)}</span>
          </div>
          {task.comments.length > 0 && (
            <div className="flex items-center gap-0.5 text-[9px] text-gray-500 font-mono">
              <MessageSquare className="w-2.5 h-2.5" />
              {task.comments.length}
            </div>
          )}
          {task.attachments.length > 0 && (
            <div className="flex items-center gap-0.5 text-[9px] text-gray-500 font-mono">
              <Paperclip className="w-2.5 h-2.5" />
              {task.attachments.length}
            </div>
          )}
        </div>
        <div className="w-5 h-5 rounded-full bg-cyber-accent/20 text-cyber-accent flex items-center justify-center text-[9px] font-mono">
          {task.assignee.charAt(0)}
        </div>
      </div>
    </div>
  )
}

// ============ 列表视图 ============

function ListView({ tasks, selectedIds, sortField, sortAsc, onToggleSort, onToggleSelect, onSelectTask, onEditTask }: {
  tasks: Task[]
  selectedIds: string[]
  sortField: SortField
  sortAsc: boolean
  onToggleSort: (field: SortField) => void
  onToggleSelect: (id: string) => void
  onSelectTask: (task: Task) => void
  onEditTask: (task: Task) => void
}) {
  const allSelected = tasks.length > 0 && tasks.every(t => selectedIds.includes(t.id))
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowDown className="w-2.5 h-2.5 text-gray-700 inline" />
    return sortAsc ? <ArrowDown className="w-2.5 h-2.5 text-cyber-accent inline" /> : <ArrowUp className="w-2.5 h-2.5 text-cyber-accent inline" />
  }
  return (
    <div className="p-3">
      <div className="bg-cyber-bg-secondary/60 border border-cyber-border/20 rounded-lg overflow-hidden">
        {/* 表头 */}
        <div className="grid grid-cols-[24px_1fr_70px_70px_80px_90px_40px] gap-2 px-3 py-2 border-b border-cyber-border/20 text-[10px] font-mono text-gray-500 uppercase">
          <button onClick={() => tasks.forEach(t => selectedIds.includes(t.id) ? onToggleSelect(t.id) : null)}>
            {allSelected ? <CheckSquare className="w-3.5 h-3.5 text-cyber-accent" /> : <Square className="w-3.5 h-3.5 text-gray-600" />}
          </button>
          <button onClick={() => onToggleSort('title')} className="text-left hover:text-cyber-text">任务标题 <SortIcon field="title" /></button>
          <button onClick={() => onToggleSort('priority')} className="text-left hover:text-cyber-text">优先级 <SortIcon field="priority" /></button>
          <span className="hidden sm:block">状态</span>
          <span className="hidden sm:block">标签</span>
          <button onClick={() => onToggleSort('dueDate')} className="text-left hover:text-cyber-text">截止日期 <SortIcon field="dueDate" /></button>
          <span className="text-center">操作</span>
        </div>
        {/* 表体 */}
        <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
          {tasks.map(task => {
            const config = statusConfig[task.status]
            const prio = priorityConfig[task.priority]
            const isOverdue = task.status !== 'done' && new Date(task.dueDate).getTime() < Date.now()
            const isSelected = selectedIds.includes(task.id)
            return (
              <div
                key={task.id}
                className={cn(
                  'grid grid-cols-[24px_1fr_70px_70px_80px_90px_40px] gap-2 px-3 py-2 border-b border-cyber-border/10 items-center text-xs hover:bg-white/5 transition-colors',
                  isSelected && 'bg-cyber-accent/5'
                )}
              >
                <button onClick={() => onToggleSelect(task.id)}>
                  {isSelected ? <CheckSquare className="w-3.5 h-3.5 text-cyber-accent" /> : <Square className="w-3.5 h-3.5 text-gray-600" />}
                </button>
                <div className="min-w-0 cursor-pointer" onClick={() => onSelectTask(task)}>
                  <div className="text-cyber-text truncate font-medium">{task.title}</div>
                  <div className="text-[10px] text-gray-500 truncate">{task.assignee}</div>
                </div>
                <span className={cn('px-1.5 py-0.5 text-[9px] font-mono rounded inline-block w-fit', prio.bgColor, prio.color)}>{prio.label}</span>
                <span className={cn('px-1.5 py-0.5 text-[9px] font-mono rounded inline-block w-fit', config.bgColor, config.color)}>
                  <span className="hidden sm:inline">{config.label}</span>
                  <span className="sm:hidden">{config.label.charAt(0)}</span>
                </span>
                <div className="hidden sm:flex flex-wrap gap-1">
                  {task.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-1 py-0.5 text-[9px] font-mono bg-cyber-accent/10 text-cyber-accent/70 rounded">{tag}</span>
                  ))}
                </div>
                <span className={cn('text-[10px] font-mono', isOverdue ? 'text-red-400' : 'text-gray-400')}>
                  {formatDateShort(task.dueDate)}
                </span>
                <button
                  onClick={() => onEditTask(task)}
                  className="p-1 text-gray-500 hover:text-cyber-accent rounded hover:bg-white/5"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>
            )
          })}
          {tasks.length === 0 && (
            <div className="py-12 text-center text-xs text-gray-600 font-mono">暂无任务</div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============ 日历视图 ============

function CalendarView({ tasks, calendarDate, onPrevMonth, onNextMonth, onToday, onSelectTask }: {
  tasks: Task[]
  calendarDate: Date
  onPrevMonth: () => void
  onNextMonth: () => void
  onToday: () => void
  onSelectTask: (task: Task) => void
}) {
  const year = calendarDate.getFullYear()
  const month = calendarDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startWeekday = firstDay.getDay()
  const daysInMonth = lastDay.getDate()
  const today = new Date()

  // 生成日历格子（含前后月份填充）
  const days: { date: Date; isCurrentMonth: boolean }[] = []
  // 上月填充
  for (let i = startWeekday - 1; i >= 0; i--) {
    days.push({ date: new Date(year, month, -i), isCurrentMonth: false })
  }
  // 当月
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ date: new Date(year, month, i), isCurrentMonth: true })
  }
  // 下月填充至 42 格
  while (days.length < 42) {
    const last = days[days.length - 1].date
    days.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), isCurrentMonth: false })
  }

  // 按日期分组任务
  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {}
    tasks.forEach(t => {
      const d = new Date(t.dueDate)
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
      if (!map[key]) map[key] = []
      map[key].push(t)
    })
    return map
  }, [tasks])

  const weekDays = ['日', '一', '二', '三', '四', '五', '六']

  return (
    <div className="p-3 h-full flex flex-col">
      {/* 日历头 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-cyber-text font-mono">{year}年{month + 1}月</h3>
          <button onClick={onToday} className="px-2 py-0.5 text-[10px] font-mono text-cyber-accent border border-cyber-accent/30 rounded hover:bg-cyber-accent/10">今天</button>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onPrevMonth} className="p-1 rounded hover:bg-white/5 text-gray-400"><ChevronLeft className="w-4 h-4" /></button>
          <button onClick={onNextMonth} className="p-1 rounded hover:bg-white/5 text-gray-400"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
      {/* 日历主体 */}
      <div className="flex-1 bg-cyber-bg-secondary/40 border border-cyber-border/20 rounded-lg overflow-hidden flex flex-col">
        {/* 星期头 */}
        <div className="grid grid-cols-7 border-b border-cyber-border/20">
          {weekDays.map(d => (
            <div key={d} className="px-2 py-1.5 text-[10px] font-mono text-gray-500 text-center border-r border-cyber-border/10 last:border-r-0">{d}</div>
          ))}
        </div>
        {/* 日期格子 */}
        <div className="grid grid-cols-7 flex-1 overflow-y-auto">
          {days.map((day, idx) => {
            const key = `${day.date.getFullYear()}-${day.date.getMonth()}-${day.date.getDate()}`
            const dayTasks = tasksByDate[key] || []
            const isToday = day.date.toDateString() === today.toDateString()
            return (
              <div
                key={idx}
                className={cn(
                  'border-r border-b border-cyber-border/10 p-1 min-h-[80px] last:border-r-0',
                  !day.isCurrentMonth && 'bg-cyber-bg/40 opacity-50'
                )}
              >
                <div className={cn(
                  'text-[10px] font-mono mb-1 w-5 h-5 flex items-center justify-center rounded',
                  isToday ? 'bg-cyber-accent text-cyber-bg font-bold' : 'text-gray-500'
                )}>
                  {day.date.getDate()}
                </div>
                <div className="space-y-0.5">
                  {dayTasks.slice(0, 3).map(task => {
                    const prio = priorityConfig[task.priority]
                    return (
                      <div
                        key={task.id}
                        onClick={() => onSelectTask(task)}
                        className={cn('px-1 py-0.5 text-[9px] rounded cursor-pointer truncate', prio.bgColor, prio.color, 'hover:opacity-80')}
                      >
                        {task.title}
                      </div>
                    )
                  })}
                  {dayTasks.length > 3 && (
                    <div className="text-[9px] text-gray-500 font-mono">+{dayTasks.length - 3}</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ============ 任务详情弹窗 ============

function TaskDetailModal({ task, onClose, onEdit, onDelete, onStatusChange }: {
  task: Task
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
  onStatusChange: (status: TaskStatus) => void
}) {
  const [activeTab, setActiveTab] = useState<'comments' | 'attachments' | 'history' | 'subtasks'>('comments')
  const [newComment, setNewComment] = useState('')
  const config = statusConfig[task.status]
  const prio = priorityConfig[task.priority]
  const PrioIcon = prio.icon
  const isOverdue = task.status !== 'done' && new Date(task.dueDate).getTime() < Date.now()

  const handleAddComment = () => {
    if (!newComment.trim()) return
    task.comments.push({
      id: `cmt_${Date.now()}`,
      author: '我',
      content: newComment,
      createdAt: new Date().toISOString(),
    })
    setNewComment('')
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div
        className="bg-cyber-bg border border-cyber-border/40 rounded-t-xl sm:rounded-xl w-full sm:max-w-2xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="px-4 py-3 border-b border-cyber-border/30 flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <PrioIcon className={cn('w-3.5 h-3.5', prio.color)} />
              <span className={cn('px-1.5 py-0.5 text-[9px] font-mono rounded', config.bgColor, config.color)}>{config.label}</span>
              <span className={cn('px-1.5 py-0.5 text-[9px] font-mono rounded', prio.bgColor, prio.color)}>{prio.label}</span>
            </div>
            <h2 className="text-sm font-bold text-cyber-text">{task.title}</h2>
          </div>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-cyber-text rounded hover:bg-white/5">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 基本信息 */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-[10px] text-gray-500 font-mono mb-1">负责人</div>
              <div className="flex items-center gap-1.5 text-cyber-text">
                <div className="w-5 h-5 rounded-full bg-cyber-accent/20 text-cyber-accent flex items-center justify-center text-[9px] font-mono">{task.assignee.charAt(0)}</div>
                {task.assignee}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500 font-mono mb-1">截止日期</div>
              <div className={cn('flex items-center gap-1.5', isOverdue ? 'text-red-400' : 'text-cyber-text')}>
                <CalendarIcon className="w-3 h-3" />
                {formatDateFull(task.dueDate)}
                {isOverdue && <span className="text-[9px]">(已延期)</span>}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500 font-mono mb-1">创建时间</div>
              <div className="text-gray-400">{formatDateFull(task.createdAt)}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500 font-mono mb-1">进度</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-cyber-bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-cyber-accent" style={{ width: `${task.progress}%` }} />
                </div>
                <span className="text-cyber-accent font-mono text-[10px]">{task.progress}%</span>
              </div>
            </div>
          </div>

          {/* 标签 */}
          {task.tags.length > 0 && (
            <div>
              <div className="text-[10px] text-gray-500 font-mono mb-1.5">标签</div>
              <div className="flex flex-wrap gap-1">
                {task.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 text-[10px] font-mono bg-cyber-accent/10 text-cyber-accent/80 rounded border border-cyber-accent/20">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* 描述 */}
          <div>
            <div className="text-[10px] text-gray-500 font-mono mb-1.5">任务描述</div>
            <p className="text-xs text-gray-300 leading-relaxed bg-cyber-bg-secondary/40 p-3 rounded-lg border border-cyber-border/20">{task.description}</p>
          </div>

          {/* 状态切换 */}
          <div>
            <div className="text-[10px] text-gray-500 font-mono mb-1.5">变更状态</div>
            <div className="flex gap-1.5">
              {(Object.keys(statusConfig) as TaskStatus[]).map(s => {
                const c = statusConfig[s]
                return (
                  <button
                    key={s}
                    onClick={() => onStatusChange(s)}
                    className={cn(
                      'px-2.5 py-1 text-[10px] font-mono rounded border transition-all',
                      task.status === s ? cn(c.bgColor, c.color, c.borderColor) : 'border-cyber-border/30 text-gray-500 hover:text-cyber-text'
                    )}
                  >
                    {c.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tab 切换 */}
          <div className="border-t border-cyber-border/20 pt-3">
            <div className="flex gap-3 mb-3 border-b border-cyber-border/20">
              {([
                { id: 'comments', label: '评论', count: task.comments.length },
                { id: 'attachments', label: '附件', count: task.attachments.length },
                { id: 'subtasks', label: '子任务', count: task.subtasks.length },
                { id: 'history', label: '历史', count: task.history.length },
              ] as const).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'pb-2 text-[11px] font-mono border-b-2 transition-all',
                    activeTab === tab.id ? 'border-cyber-accent text-cyber-accent' : 'border-transparent text-gray-500 hover:text-cyber-text'
                  )}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* 评论 */}
            {activeTab === 'comments' && (
              <div className="space-y-2">
                {task.comments.map(c => (
                  <div key={c.id} className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-cyber-accent/20 text-cyber-accent flex items-center justify-center text-[10px] font-mono flex-shrink-0">{c.author.charAt(0)}</div>
                    <div className="flex-1 bg-cyber-bg-secondary/40 rounded-lg p-2">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] font-mono text-cyber-text">{c.author}</span>
                        <span className="text-[9px] text-gray-600 font-mono">{formatDateShort(c.createdAt)}</span>
                      </div>
                      <p className="text-[11px] text-gray-300">{c.content}</p>
                    </div>
                  </div>
                ))}
                <div className="flex gap-2 mt-2">
                  <input
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                    placeholder="输入评论..."
                    className="flex-1 px-2 py-1.5 text-xs bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg text-cyber-text placeholder-gray-600 focus:outline-none focus:border-cyber-accent/50"
                  />
                  <button onClick={handleAddComment} className="px-3 py-1.5 text-xs bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/30 rounded-lg hover:bg-cyber-accent/20 font-mono">发送</button>
                </div>
              </div>
            )}

            {/* 附件 */}
            {activeTab === 'attachments' && (
              <div className="space-y-1.5">
                {task.attachments.map(a => (
                  <div key={a.id} className="flex items-center gap-2 p-2 bg-cyber-bg-secondary/40 rounded-lg border border-cyber-border/20">
                    <Paperclip className="w-3 h-3 text-cyber-accent" />
                    <span className="text-xs text-cyber-text flex-1 truncate">{a.name}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{a.size}</span>
                    <button className="p-1 text-gray-500 hover:text-cyber-accent"><Download className="w-3 h-3" /></button>
                  </div>
                ))}
                {task.attachments.length === 0 && <p className="text-center text-[10px] text-gray-600 py-4 font-mono">暂无附件</p>}
              </div>
            )}

            {/* 子任务 */}
            {activeTab === 'subtasks' && (
              <div className="space-y-1">
                {task.subtasks.map(s => (
                  <div key={s.id} className="flex items-center gap-2 p-1.5 text-xs">
                    {s.done ? <CheckSquare className="w-3.5 h-3.5 text-cyber-accent" /> : <Square className="w-3.5 h-3.5 text-gray-600" />}
                    <span className={s.done ? 'text-gray-500 line-through' : 'text-cyber-text'}>{s.title}</span>
                  </div>
                ))}
                {task.subtasks.length === 0 && <p className="text-center text-[10px] text-gray-600 py-4 font-mono">暂无子任务</p>}
              </div>
            )}

            {/* 历史 */}
            {activeTab === 'history' && (
              <div className="space-y-2">
                {task.history.map(h => (
                  <div key={h.id} className="flex items-start gap-2 text-[11px]">
                    <History className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-cyber-text">{h.operator}</span>
                      <span className="text-gray-400"> {h.action}</span>
                      <span className="text-[9px] text-gray-600 font-mono ml-2">{formatDateShort(h.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 底部操作 */}
        <div className="px-4 py-3 border-t border-cyber-border/30 flex items-center justify-between">
          <button
            onClick={onDelete}
            className="px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 rounded-lg font-mono flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />删除
          </button>
          <button
            onClick={onEdit}
            className="px-3 py-1.5 text-xs bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/30 rounded-lg hover:bg-cyber-accent/20 font-mono flex items-center gap-1"
          >
            <Edit3 className="w-3 h-3" />编辑
          </button>
        </div>
      </div>
    </div>
  )
}

// ============ 任务编辑/创建弹窗 ============

function TaskEditModal({ task, isCreating, onClose, onSave }: {
  task: Task | null
  isCreating: boolean
  onClose: () => void
  onSave: (task: Task) => void
}) {
  const [form, setForm] = useState<Task>(task || {
    id: `task_${Date.now()}`,
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    tags: [],
    assignee: teamMembers[0],
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    progress: 0,
    comments: [],
    attachments: [],
    history: [],
    subtasks: [],
  })
  const [tagInput, setTagInput] = useState('')

  const handleSubmit = () => {
    if (!form.title.trim()) return
    onSave({ ...form, updatedAt: new Date().toISOString() })
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
        className="bg-cyber-bg border border-cyber-border/40 rounded-t-xl sm:rounded-xl w-full sm:max-w-lg max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="px-4 py-3 border-b border-cyber-border/30 flex items-center justify-between">
          <h2 className="text-sm font-bold text-cyber-text font-mono">{isCreating ? '创建任务' : '编辑任务'}</h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-cyber-text rounded hover:bg-white/5">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 表单 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* 标题 */}
          <div>
            <label className="text-[10px] text-gray-500 font-mono block mb-1">任务标题 *</label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="输入任务标题..."
              className="w-full px-3 py-2 text-xs bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg text-cyber-text placeholder-gray-600 focus:outline-none focus:border-cyber-accent/50"
            />
          </div>
          {/* 描述 */}
          <div>
            <label className="text-[10px] text-gray-500 font-mono block mb-1">任务描述</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="描述任务详情..."
              rows={3}
              className="w-full px-3 py-2 text-xs bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg text-cyber-text placeholder-gray-600 focus:outline-none focus:border-cyber-accent/50 resize-none"
            />
          </div>
          {/* 状态与优先级 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-500 font-mono block mb-1">状态</label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value as TaskStatus })}
                className="w-full px-2 py-2 text-xs bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg text-cyber-text focus:outline-none focus:border-cyber-accent/50"
              >
                {(Object.keys(statusConfig) as TaskStatus[]).map(s => (
                  <option key={s} value={s}>{statusConfig[s].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 font-mono block mb-1">优先级</label>
              <select
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value as TaskPriority })}
                className="w-full px-2 py-2 text-xs bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg text-cyber-text focus:outline-none focus:border-cyber-accent/50"
              >
                {(Object.keys(priorityConfig) as TaskPriority[]).map(p => (
                  <option key={p} value={p}>{priorityConfig[p].label}</option>
                ))}
              </select>
            </div>
          </div>
          {/* 负责人与截止日期 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-500 font-mono block mb-1">负责人</label>
              <select
                value={form.assignee}
                onChange={e => setForm({ ...form, assignee: e.target.value })}
                className="w-full px-2 py-2 text-xs bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg text-cyber-text focus:outline-none focus:border-cyber-accent/50"
              >
                {teamMembers.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 font-mono block mb-1">截止日期</label>
              <input
                type="date"
                value={form.dueDate.split('T')[0]}
                onChange={e => setForm({ ...form, dueDate: new Date(e.target.value).toISOString() })}
                className="w-full px-2 py-2 text-xs bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg text-cyber-text focus:outline-none focus:border-cyber-accent/50"
              />
            </div>
          </div>
          {/* 进度 */}
          <div>
            <label className="text-[10px] text-gray-500 font-mono block mb-1">进度: {form.progress}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={form.progress}
              onChange={e => setForm({ ...form, progress: parseInt(e.target.value) })}
              className="w-full accent-cyber-accent"
            />
          </div>
          {/* 标签 */}
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
            <div className="flex gap-1">
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
                className="flex-1 px-2 py-1 text-[10px] bg-cyber-bg-secondary border border-cyber-border/30 rounded text-cyber-text placeholder-gray-600 focus:outline-none focus:border-cyber-accent/50"
              />
            </div>
          </div>
        </div>

        {/* 底部 */}
        <div className="px-4 py-3 border-t border-cyber-border/30 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-xs text-gray-400 hover:text-cyber-text font-mono">取消</button>
          <button
            onClick={handleSubmit}
            disabled={!form.title.trim()}
            className="px-4 py-1.5 text-xs bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/30 rounded-lg hover:bg-cyber-accent/20 disabled:opacity-40 disabled:cursor-not-allowed font-mono"
          >
            {isCreating ? '创建' : '保存'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============ 模板选择弹窗 ============

function TemplateModal({ onClose, onSelect }: {
  onClose: () => void
  onSelect: (template: TaskTemplate) => void
}) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div
        className="bg-cyber-bg border border-cyber-border/40 rounded-t-xl sm:rounded-xl w-full sm:max-w-lg max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b border-cyber-border/30 flex items-center justify-between">
          <h2 className="text-sm font-bold text-cyber-text font-mono flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyber-accent" />
            任务模板
          </h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-cyber-text rounded hover:bg-white/5">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {taskTemplates.map(tpl => (
            <button
              key={tpl.id}
              onClick={() => onSelect(tpl)}
              className="text-left p-3 bg-cyber-bg-secondary/40 border border-cyber-border/30 rounded-lg hover:border-cyber-accent/40 hover:bg-cyber-accent/5 transition-all"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{tpl.icon}</span>
                <span className="text-xs font-bold text-cyber-text">{tpl.name}</span>
              </div>
              <p className="text-[10px] text-gray-500 mb-2 line-clamp-2">{tpl.description}</p>
              <div className="flex items-center gap-1">
                {tpl.tags.map(tag => (
                  <span key={tag} className="px-1 py-0.5 text-[9px] font-mono bg-cyber-accent/10 text-cyber-accent/70 rounded">{tag}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============ 工具函数 ============

// 格式化日期（短）
function formatDateShort(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const isThisYear = d.getFullYear() === now.getFullYear()
  if (isThisYear) return `${d.getMonth() + 1}/${d.getDate()}`
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
}

// 格式化日期（完整）
function formatDateFull(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
