import { useState, useMemo } from 'react'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Clock,
  Bell,
  Edit3,
  Trash2,
  X,
  AlertCircle,
  List,
  CalendarDays,
  CalendarRange,
  Repeat,
  Tag,
  Filter,
  Briefcase,
  User,
  Users,
  Gift,
  Zap,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============

// 日程分类
type ScheduleCategory = 'work' | 'personal' | 'meeting' | 'reminder' | 'birthday'

// 重复类型
type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'

// 日程事件
interface ScheduleEvent {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  category: ScheduleCategory
  color: string
  location?: string
  repeat: RepeatType
  reminder: number // 提前几分钟，0表示不提醒
  attendees: string[]
  createdAt: string
}

// 视图类型
type ViewMode = 'month' | 'week' | 'day' | 'list'

// ============ 常量配置 ============

// 分类配置
const categoryConfig: Record<ScheduleCategory, { label: string; color: string; bgColor: string; borderColor: string; icon: typeof Briefcase }> = {
  work: { label: '工作', color: 'text-cyan-400', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/40', icon: Briefcase },
  personal: { label: '个人', color: 'text-purple-400', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/40', icon: User },
  meeting: { label: '会议', color: 'text-cyber-accent', bgColor: 'bg-cyber-accent/10', borderColor: 'border-cyber-accent/40', icon: Users },
  reminder: { label: '提醒', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/40', icon: Bell },
  birthday: { label: '生日', color: 'text-pink-400', bgColor: 'bg-pink-500/10', borderColor: 'border-pink-500/40', icon: Gift },
}

// 颜色选项
const colorOptions = [
  { value: '#00ff88', label: '赛博绿' },
  { value: '#00d4ff', label: '电光蓝' },
  { value: '#c084fc', label: '霓虹紫' },
  { value: '#fbbf24', label: '警示黄' },
  { value: '#f87171', label: '警报红' },
  { value: '#ec4899', label: '荧光粉' },
]

// 重复选项
const repeatOptions: { value: RepeatType; label: string }[] = [
  { value: 'none', label: '不重复' },
  { value: 'daily', label: '每天' },
  { value: 'weekly', label: '每周' },
  { value: 'monthly', label: '每月' },
  { value: 'yearly', label: '每年' },
]

// 提醒选项
const reminderOptions = [
  { value: 0, label: '不提醒' },
  { value: 5, label: '提前5分钟' },
  { value: 15, label: '提前15分钟' },
  { value: 30, label: '提前30分钟' },
  { value: 60, label: '提前1小时' },
  { value: 1440, label: '提前1天' },
]

// ============ Mock 数据生成 ============

const generateMockEvents = (): ScheduleEvent[] => {
  const titles: Record<ScheduleCategory, string[]> = {
    work: ['项目周会', '代码评审', '需求评审', '技术分享', '版本发布', '性能优化会议', '产品复盘'],
    personal: ['健身', '看电影', '购物', '理发', '看医生', '家庭聚餐'],
    meeting: ['团队晨会', '客户沟通', '跨部门协调', '产品演示', '面试候选人', '季度总结会'],
    reminder: ['提交周报', '缴纳房租', '续费服务', '还信用卡', '更新简历', '备份资料'],
    birthday: ['同事生日聚会', '朋友生日', '家人生日', '同学生日'],
  }
  const descriptions = [
    '请准时参加，提前准备好相关材料。',
    '讨论近期工作进展和下一步计划。',
    '需要所有人到场，请合理安排时间。',
    '重点关注本次议题，提前阅读相关文档。',
    '请携带笔记本电脑和必要资料。',
  ]
  const locations = ['会议室A', '会议室B', '线上腾讯会议', '办公室', '咖啡厅', '家中', '健身房']
  const attendees = ['张三', '李四', '王五', '赵六', '钱七', '孙八']

  const events: ScheduleEvent[] = []
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  for (let i = 0; i < 40; i++) {
    const categories: ScheduleCategory[] = ['work', 'personal', 'meeting', 'reminder', 'birthday']
    const category = categories[i % 5]
    const catTitles = titles[category]
    // 事件分布在前后 30 天
    const dayOffset = Math.floor(Math.random() * 60) - 30
    const eventDate = new Date(today)
    eventDate.setDate(eventDate.getDate() + dayOffset)
    const startHour = Math.floor(Math.random() * 12) + 8 // 8-20点
    const startMinute = Math.random() > 0.5 ? 0 : 30
    const duration = (Math.floor(Math.random() * 3) + 1) * 30 // 30-120分钟
    const start = new Date(eventDate)
    start.setHours(startHour, startMinute, 0, 0)
    const end = new Date(start.getTime() + duration * 60000)
    const color = colorOptions[i % colorOptions.length].value

    events.push({
      id: `evt_${i + 1}`,
      title: catTitles[i % catTitles.length],
      description: descriptions[i % descriptions.length],
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      category,
      color,
      location: locations[i % locations.length],
      repeat: i % 7 === 0 ? repeatOptions[(i % 5) + 1].value : 'none',
      reminder: reminderOptions[i % reminderOptions.length].value,
      attendees: attendees.slice(0, Math.floor(Math.random() * 4) + 1),
      createdAt: new Date(now.getTime() - i * 86400000).toISOString(),
    })
  }

  return events.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
}

const initialEvents = generateMockEvents()

// ============ 主组件 ============

export default function SchedulePage() {
  const [events, setEvents] = useState<ScheduleEvent[]>(initialEvents)
  const [viewMode, setViewMode] = useState<ViewMode>('month')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<ScheduleCategory | 'all'>('all')
  const [showFilter, setShowFilter] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null)
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  // 当前显示日期
  const [currentDate, setCurrentDate] = useState(new Date())

  // 过滤后的事件
  const filteredEvents = useMemo(() => {
    let result = events
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        (e.location || '').toLowerCase().includes(q)
      )
    }
    if (filterCategory !== 'all') result = result.filter(e => e.category === filterCategory)
    return result
  }, [events, searchQuery, filterCategory])

  // 统计数据
  const stats = useMemo(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today.getTime() + 86400000)
    const weekEnd = new Date(today.getTime() + 7 * 86400000)
    return {
      total: events.length,
      today: events.filter(e => {
        const s = new Date(e.startTime)
        return s >= today && s < tomorrow
      }).length,
      thisWeek: events.filter(e => {
        const s = new Date(e.startTime)
        return s >= today && s < weekEnd
      }).length,
      meetings: events.filter(e => e.category === 'meeting').length,
      reminders: events.filter(e => e.reminder > 0).length,
    }
  }, [events])

  // 冲突检测
  const conflicts = useMemo(() => {
    const conflictPairs: [ScheduleEvent, ScheduleEvent][] = []
    const sorted = [...filteredEvents].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    for (let i = 0; i < sorted.length - 1; i++) {
      const cur = sorted[i]
      const next = sorted[i + 1]
      if (new Date(cur.endTime).getTime() > new Date(next.startTime).getTime() &&
          new Date(cur.startTime).toDateString() === new Date(next.startTime).toDateString()) {
        conflictPairs.push([cur, next])
      }
    }
    return conflictPairs
  }, [filteredEvents])

  // 删除事件
  const handleDelete = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id))
    setSelectedEvent(null)
  }

  // 保存事件
  const handleSave = (event: ScheduleEvent) => {
    if (isCreating) {
      setEvents(prev => [...prev, event].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()))
    } else {
      setEvents(prev => prev.map(e => e.id === event.id ? event : e))
    }
    setEditingEvent(null)
    setIsCreating(false)
  }

  // 视图导航
  const navigate = (direction: -1 | 1) => {
    const newDate = new Date(currentDate)
    if (viewMode === 'month') newDate.setMonth(newDate.getMonth() + direction)
    else if (viewMode === 'week') newDate.setDate(newDate.getDate() + direction * 7)
    else newDate.setDate(newDate.getDate() + direction)
    setCurrentDate(newDate)
  }

  // 当前视图标题
  const viewTitle = useMemo(() => {
    if (viewMode === 'month') return `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月`
    if (viewMode === 'week') {
      const weekStart = new Date(currentDate)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)
      return `${weekStart.getMonth() + 1}/${weekStart.getDate()} - ${weekEnd.getMonth() + 1}/${weekEnd.getDate()}`
    }
    if (viewMode === 'day') return `${currentDate.getMonth() + 1}月${currentDate.getDate()}日`
    return '即将到来'
  }, [currentDate, viewMode])

  const hasActiveFilter = filterCategory !== 'all'

  return (
    <div className="h-full flex flex-col bg-cyber-bg">
      {/* 顶部标题栏 */}
      <div className="border-b border-cyber-border/30 bg-cyber-panel/40 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-base font-bold text-cyber-text flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyber-accent" />
              日程管理
            </h1>
            <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
              月 · 周 · 日 · 列表 · 共 {events.length} 个事件
            </p>
          </div>
          <button
            onClick={() => { setIsCreating(true); setEditingEvent(null) }}
            className="px-3 py-1.5 rounded-lg text-xs font-mono bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/30 hover:bg-cyber-accent/20 transition-all flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>新建日程</span>
          </button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          <StatCard icon={Calendar} label="今日" value={`${stats.today}`} sub="个事件" color="text-cyber-accent" />
          <StatCard icon={CalendarRange} label="本周" value={`${stats.thisWeek}`} sub="个事件" color="text-cyan-400" />
          <StatCard icon={Users} label="会议" value={`${stats.meetings}`} sub="个" color="text-purple-400" />
          <StatCard icon={AlertTriangle} label="冲突" value={`${conflicts.length}`} sub="对冲突" color={conflicts.length > 0 ? 'text-red-400' : 'text-gray-400'} />
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
              placeholder="搜索日程..."
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
            {(['month', 'week', 'day', 'list'] as ViewMode[]).map(mode => {
              const Icon = mode === 'month' ? CalendarDays : mode === 'week' ? CalendarRange : mode === 'day' ? Calendar : List
              return (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    'p-1.5 rounded transition-all',
                    viewMode === mode ? 'bg-cyber-accent/20 text-cyber-accent' : 'text-gray-500 hover:text-gray-300'
                  )}
                  title={mode === 'month' ? '月视图' : mode === 'week' ? '周视图' : mode === 'day' ? '日视图' : '列表视图'}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              )
            })}
          </div>
        </div>

        {/* 筛选面板 */}
        {showFilter && (
          <div className="mt-2 p-3 bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg">
            <div className="flex flex-wrap gap-1.5">
              <FilterChip active={filterCategory === 'all'} onClick={() => setFilterCategory('all')}>全部</FilterChip>
              {(Object.keys(categoryConfig) as ScheduleCategory[]).map(cat => {
                const c = categoryConfig[cat]
                const Icon = c.icon
                return (
                  <FilterChip key={cat} active={filterCategory === cat} onClick={() => setFilterCategory(cat)} icon={Icon} color={c.color}>
                    {c.label}
                  </FilterChip>
                )
              })}
            </div>
          </div>
        )}

        {/* 冲突警告 */}
        {conflicts.length > 0 && (
          <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
            <span className="text-[11px] text-red-400 font-mono">
              检测到 {conflicts.length} 对时间冲突: {conflicts[0][0].title} 与 {conflicts[0][1].title}
            </span>
          </div>
        )}
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-auto min-h-0">
        {/* 视图导航条 */}
        {viewMode !== 'list' && (
          <div className="flex items-center justify-between px-4 py-2 border-b border-cyber-border/20">
            <h3 className="text-sm font-bold text-cyber-text font-mono">{viewTitle}</h3>
            <div className="flex items-center gap-1">
              <button onClick={() => navigate(-1)} className="p-1 rounded hover:bg-white/5 text-gray-400"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={() => setCurrentDate(new Date())} className="px-2 py-0.5 text-[10px] font-mono text-cyber-accent border border-cyber-accent/30 rounded hover:bg-cyber-accent/10">今天</button>
              <button onClick={() => navigate(1)} className="p-1 rounded hover:bg-white/5 text-gray-400"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}

        {viewMode === 'month' && <MonthView events={filteredEvents} currentDate={currentDate} onSelectEvent={setSelectedEvent} onSelectDate={(d) => { setCurrentDate(d); setViewMode('day') }} />}
        {viewMode === 'week' && <WeekView events={filteredEvents} currentDate={currentDate} onSelectEvent={setSelectedEvent} />}
        {viewMode === 'day' && <DayView events={filteredEvents} currentDate={currentDate} onSelectEvent={setSelectedEvent} />}
        {viewMode === 'list' && <ListView events={filteredEvents} onSelectEvent={setSelectedEvent} />}
      </div>

      {/* 事件详情弹窗 */}
      {selectedEvent && (
        <EventDetailModal
          event={events.find(e => e.id === selectedEvent.id) || selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEdit={() => { setEditingEvent(selectedEvent); setSelectedEvent(null); setIsCreating(false) }}
          onDelete={() => handleDelete(selectedEvent.id)}
        />
      )}

      {/* 事件编辑/创建弹窗 */}
      {editingEvent !== null || isCreating ? (
        <EventEditModal
          event={editingEvent}
          isCreating={isCreating}
          onClose={() => { setEditingEvent(null); setIsCreating(false) }}
          onSave={handleSave}
        />
      ) : null}
    </div>
  )
}

// ============ 统计卡片 ============

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: typeof Calendar
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

// ============ 筛选芯片 ============

function FilterChip({ active, onClick, children, icon: Icon, color }: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  icon?: typeof Briefcase
  color?: string
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
      {Icon && <Icon className={cn('w-3 h-3', active ? 'text-cyber-accent' : color)} />}
      {children}
    </button>
  )
}

// ============ 月视图 ============

function MonthView({ events, currentDate, onSelectEvent, onSelectDate }: {
  events: ScheduleEvent[]
  currentDate: Date
  onSelectEvent: (event: ScheduleEvent) => void
  onSelectDate: (date: Date) => void
}) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startWeekday = firstDay.getDay()
  const daysInMonth = lastDay.getDate()
  const today = new Date()

  const days: { date: Date; isCurrentMonth: boolean }[] = []
  for (let i = startWeekday - 1; i >= 0; i--) {
    days.push({ date: new Date(year, month, -i), isCurrentMonth: false })
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ date: new Date(year, month, i), isCurrentMonth: true })
  }
  while (days.length < 42) {
    const last = days[days.length - 1].date
    days.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), isCurrentMonth: false })
  }

  const eventsByDate = useMemo(() => {
    const map: Record<string, ScheduleEvent[]> = {}
    events.forEach(e => {
      const d = new Date(e.startTime)
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
      if (!map[key]) map[key] = []
      map[key].push(e)
    })
    return map
  }, [events])

  const weekDays = ['日', '一', '二', '三', '四', '五', '六']

  return (
    <div className="p-3 h-full flex flex-col">
      <div className="flex-1 bg-cyber-bg-secondary/40 border border-cyber-border/20 rounded-lg overflow-hidden flex flex-col">
        <div className="grid grid-cols-7 border-b border-cyber-border/20">
          {weekDays.map(d => (
            <div key={d} className="px-2 py-1.5 text-[10px] font-mono text-gray-500 text-center border-r border-cyber-border/10 last:border-r-0">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 flex-1 overflow-y-auto">
          {days.map((day, idx) => {
            const key = `${day.date.getFullYear()}-${day.date.getMonth()}-${day.date.getDate()}`
            const dayEvents = eventsByDate[key] || []
            const isToday = day.date.toDateString() === today.toDateString()
            return (
              <div
                key={idx}
                onClick={() => onSelectDate(day.date)}
                className={cn(
                  'border-r border-b border-cyber-border/10 p-1 min-h-[70px] cursor-pointer hover:bg-white/5 transition-colors last:border-r-0',
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
                  {dayEvents.slice(0, 3).map(event => {
                    const c = categoryConfig[event.category]
                    return (
                      <div
                        key={event.id}
                        onClick={(e) => { e.stopPropagation(); onSelectEvent(event) }}
                        className={cn('px-1 py-0.5 text-[9px] rounded truncate border-l-2', c.bgColor, c.color)}
                        style={{ borderLeftColor: event.color }}
                      >
                        <span className="font-mono">{formatTime(event.startTime)}</span> {event.title}
                      </div>
                    )
                  })}
                  {dayEvents.length > 3 && (
                    <div className="text-[9px] text-gray-500 font-mono">+{dayEvents.length - 3}</div>
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

// ============ 周视图 ============

function WeekView({ events, currentDate, onSelectEvent }: {
  events: ScheduleEvent[]
  currentDate: Date
  onSelectEvent: (event: ScheduleEvent) => void
}) {
  const weekStart = useMemo(() => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() - d.getDay())
    d.setHours(0, 0, 0, 0)
    return d
  }, [currentDate])

  const weekDays = useMemo(() => {
    const days = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart)
      d.setDate(d.getDate() + i)
      days.push(d)
    }
    return days
  }, [weekStart])

  const today = new Date()
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const eventsByDay = useMemo(() => {
    const map: Record<number, ScheduleEvent[]> = {}
    weekDays.forEach((_, i) => { map[i] = [] })
    events.forEach(e => {
      const eventDate = new Date(e.startTime)
      const dayDiff = Math.floor((eventDate.getTime() - weekStart.getTime()) / 86400000)
      if (dayDiff >= 0 && dayDiff < 7) {
        map[dayDiff].push(e)
      }
    })
    return map
  }, [events, weekStart, weekDays])

  const weekDayLabels = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

  return (
    <div className="p-3 h-full">
      <div className="bg-cyber-bg-secondary/40 border border-cyber-border/20 rounded-lg overflow-hidden h-full flex flex-col">
        {/* 日期头 */}
        <div className="grid grid-cols-[50px_repeat(7,1fr)] border-b border-cyber-border/20">
          <div className="px-1 py-2 text-[10px] font-mono text-gray-500 text-center border-r border-cyber-border/10"></div>
          {weekDays.map((d, i) => {
            const isToday = d.toDateString() === today.toDateString()
            return (
              <div key={i} className="px-1 py-2 text-center border-r border-cyber-border/10 last:border-r-0">
                <div className="text-[10px] font-mono text-gray-500">{weekDayLabels[i]}</div>
                <div className={cn('text-xs font-bold font-mono', isToday ? 'text-cyber-accent' : 'text-cyber-text')}>{d.getDate()}</div>
              </div>
            )
          })}
        </div>
        {/* 时间轴 */}
        <div className="flex-1 overflow-y-auto">
          {hours.map(hour => (
            <div key={hour} className="grid grid-cols-[50px_repeat(7,1fr)] border-b border-cyber-border/10 min-h-[40px]">
              <div className="px-1 py-1 text-[9px] font-mono text-gray-500 text-center border-r border-cyber-border/10">
                {String(hour).padStart(2, '0')}:00
              </div>
              {weekDays.map((_, dayIdx) => {
                const dayEvents = (eventsByDay[dayIdx] || []).filter(e => {
                  const s = new Date(e.startTime)
                  return s.getHours() === hour
                })
                return (
                  <div key={dayIdx} className="border-r border-cyber-border/10 last:border-r-0 p-0.5 relative">
                    {dayEvents.map(event => {
                      const c = categoryConfig[event.category]
                      return (
                        <div
                          key={event.id}
                          onClick={() => onSelectEvent(event)}
                          className={cn('px-1 py-0.5 text-[9px] rounded cursor-pointer truncate border-l-2 mb-0.5', c.bgColor, c.color)}
                          style={{ borderLeftColor: event.color }}
                        >
                          {event.title}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============ 日视图 ============

function DayView({ events, currentDate, onSelectEvent }: {
  events: ScheduleEvent[]
  currentDate: Date
  onSelectEvent: (event: ScheduleEvent) => void
}) {
  const today = new Date()
  const isToday = currentDate.toDateString() === today.toDateString()
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const dayEvents = useMemo(() => {
    return events.filter(e => {
      const eventDate = new Date(e.startTime)
      return eventDate.toDateString() === currentDate.toDateString()
    }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
  }, [events, currentDate])

  return (
    <div className="p-3 h-full flex flex-col">
      {/* 当日事件概览 */}
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs font-mono text-gray-400">
          {isToday ? '今日' : ''} {dayEvents.length} 个事件
        </div>
      </div>

      <div className="flex-1 bg-cyber-bg-secondary/40 border border-cyber-border/20 rounded-lg overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {hours.map(hour => {
            const hourEvents = dayEvents.filter(e => new Date(e.startTime).getHours() === hour)
            const isCurrentHour = isToday && today.getHours() === hour
            return (
              <div key={hour} className={cn('grid grid-cols-[60px_1fr] border-b border-cyber-border/10 min-h-[50px]', isCurrentHour && 'bg-cyber-accent/5')}>
                <div className="px-2 py-1.5 text-[10px] font-mono text-gray-500 text-center border-r border-cyber-border/10">
                  {String(hour).padStart(2, '0')}:00
                </div>
                <div className="p-1.5 space-y-1">
                  {hourEvents.map(event => {
                    const c = categoryConfig[event.category]
                    const Icon = c.icon
                    return (
                      <div
                        key={event.id}
                        onClick={() => onSelectEvent(event)}
                        className={cn('p-2 rounded-lg cursor-pointer border-l-2 hover:opacity-80 transition-opacity', c.bgColor, c.color)}
                        style={{ borderLeftColor: event.color }}
                      >
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <Icon className="w-3 h-3" />
                          <span className="text-xs font-bold">{event.title}</span>
                          <span className="text-[9px] font-mono ml-auto">{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                        </div>
                        {event.location && (
                          <div className="text-[10px] opacity-70 flex items-center gap-1">
                            <span>📍</span> {event.location}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ============ 列表视图 ============

function ListView({ events, onSelectEvent }: {
  events: ScheduleEvent[]
  onSelectEvent: (event: ScheduleEvent) => void
}) {
  const now = new Date()
  const upcoming = useMemo(() => {
    return events
      .filter(e => new Date(e.startTime).getTime() >= now.getTime() - 3600000)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
  }, [events, now])

  // 按日期分组
  const grouped = useMemo(() => {
    const groups: Record<string, ScheduleEvent[]> = {}
    upcoming.forEach(e => {
      const d = new Date(e.startTime)
      const key = formatDateGroup(d)
      if (!groups[key]) groups[key] = []
      groups[key].push(e)
    })
    return groups
  }, [upcoming])

  return (
    <div className="p-3">
      {Object.entries(grouped).map(([date, list]) => (
        <div key={date} className="mb-4">
          <div className="text-xs font-mono text-gray-500 mb-2 flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            {date}
            <span className="text-gray-700">({list.length})</span>
          </div>
          <div className="space-y-1.5">
            {list.map(event => {
              const c = categoryConfig[event.category]
              const Icon = c.icon
              return (
                <div
                  key={event.id}
                  onClick={() => onSelectEvent(event)}
                  className={cn('p-2.5 rounded-lg border-l-2 cursor-pointer hover:bg-white/5 transition-colors flex items-center gap-3', c.bgColor)}
                  style={{ borderLeftColor: event.color }}
                >
                  <Icon className={cn('w-4 h-4 flex-shrink-0', c.color)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-cyber-text truncate">{event.title}</span>
                      {event.repeat !== 'none' && <Repeat className="w-3 h-3 text-gray-500" />}
                      {event.reminder > 0 && <Bell className="w-3 h-3 text-yellow-400" />}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-500 font-mono">
                      <Clock className="w-2.5 h-2.5" />
                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                      {event.location && <span>· {event.location}</span>}
                    </div>
                  </div>
                  <span className={cn('px-1.5 py-0.5 text-[9px] font-mono rounded', c.bgColor, c.color)}>{c.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      ))}
      {upcoming.length === 0 && (
        <div className="py-12 text-center text-xs text-gray-600 font-mono">暂无即将到来的日程</div>
      )}
    </div>
  )
}

// ============ 事件详情弹窗 ============

function EventDetailModal({ event, onClose, onEdit, onDelete }: {
  event: ScheduleEvent
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const c = categoryConfig[event.category]
  const Icon = c.icon
  const startDate = new Date(event.startTime)
  const endDate = new Date(event.endTime)
  const duration = Math.round((endDate.getTime() - startDate.getTime()) / 60000)

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div
        className="bg-cyber-bg border border-cyber-border/40 rounded-t-xl sm:rounded-xl w-full sm:max-w-md max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="px-4 py-3 border-b border-cyber-border/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', c.bgColor)}>
              <Icon className={cn('w-4 h-4', c.color)} />
            </div>
            <div>
              <span className={cn('px-1.5 py-0.5 text-[9px] font-mono rounded', c.bgColor, c.color)}>{c.label}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-cyber-text rounded hover:bg-white/5">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <h2 className="text-base font-bold text-cyber-text">{event.title}</h2>

          {/* 时间 */}
          <div className="bg-cyber-bg-secondary/40 rounded-lg p-3 space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <Clock className="w-3.5 h-3.5 text-cyber-accent" />
              <span className="text-gray-400">开始:</span>
              <span className="text-cyber-text font-mono">{formatDateTime(event.startTime)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Clock className="w-3.5 h-3.5 text-cyber-accent" />
              <span className="text-gray-400">结束:</span>
              <span className="text-cyber-text font-mono">{formatDateTime(event.endTime)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-gray-400">时长:</span>
              <span className="text-cyber-text font-mono">
                {duration >= 60 ? `${Math.floor(duration / 60)}小时` : ''}{duration % 60 > 0 ? `${duration % 60}分钟` : ''}
              </span>
            </div>
          </div>

          {/* 位置 */}
          {event.location && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500">📍 位置:</span>
              <span className="text-cyber-text">{event.location}</span>
            </div>
          )}

          {/* 描述 */}
          <div>
            <div className="text-[10px] text-gray-500 font-mono mb-1">描述</div>
            <p className="text-xs text-gray-300 leading-relaxed bg-cyber-bg-secondary/40 p-3 rounded-lg border border-cyber-border/20">{event.description}</p>
          </div>

          {/* 重复与提醒 */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-cyber-bg-secondary/40 rounded-lg p-2">
              <div className="text-[10px] text-gray-500 font-mono mb-0.5">重复</div>
              <div className="text-xs text-cyber-text flex items-center gap-1">
                <Repeat className="w-3 h-3 text-cyber-accent" />
                {repeatOptions.find(r => r.value === event.repeat)?.label}
              </div>
            </div>
            <div className="bg-cyber-bg-secondary/40 rounded-lg p-2">
              <div className="text-[10px] text-gray-500 font-mono mb-0.5">提醒</div>
              <div className="text-xs text-cyber-text flex items-center gap-1">
                <Bell className="w-3 h-3 text-yellow-400" />
                {reminderOptions.find(r => r.value === event.reminder)?.label}
              </div>
            </div>
          </div>

          {/* 参与人 */}
          {event.attendees.length > 0 && (
            <div>
              <div className="text-[10px] text-gray-500 font-mono mb-1.5">参与人 ({event.attendees.length})</div>
              <div className="flex flex-wrap gap-1.5">
                {event.attendees.map(a => (
                  <div key={a} className="flex items-center gap-1 px-2 py-0.5 bg-cyber-accent/10 border border-cyber-accent/20 rounded-full">
                    <div className="w-4 h-4 rounded-full bg-cyber-accent/20 text-cyber-accent flex items-center justify-center text-[9px] font-mono">{a.charAt(0)}</div>
                    <span className="text-[10px] text-cyber-text">{a}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 底部 */}
        <div className="px-4 py-3 border-t border-cyber-border/30 flex items-center justify-between">
          <button onClick={onDelete} className="px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 rounded-lg font-mono flex items-center gap-1">
            <Trash2 className="w-3 h-3" />删除
          </button>
          <button onClick={onEdit} className="px-3 py-1.5 text-xs bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/30 rounded-lg hover:bg-cyber-accent/20 font-mono flex items-center gap-1">
            <Edit3 className="w-3 h-3" />编辑
          </button>
        </div>
      </div>
    </div>
  )
}

// ============ 事件编辑/创建弹窗 ============

function EventEditModal({ event, isCreating, onClose, onSave }: {
  event: ScheduleEvent | null
  isCreating: boolean
  onClose: () => void
  onSave: (event: ScheduleEvent) => void
}) {
  const defaultStart = new Date()
  defaultStart.setMinutes(0, 0, 0)
  const defaultEnd = new Date(defaultStart.getTime() + 60 * 60000)

  const [form, setForm] = useState<ScheduleEvent>(event || {
    id: `evt_${Date.now()}`,
    title: '',
    description: '',
    startTime: defaultStart.toISOString(),
    endTime: defaultEnd.toISOString(),
    category: 'work',
    color: colorOptions[0].value,
    location: '',
    repeat: 'none',
    reminder: 15,
    attendees: [],
    createdAt: new Date().toISOString(),
  })

  const handleSubmit = () => {
    if (!form.title.trim()) return
    onSave(form)
  }

  const toggleAttendee = (name: string) => {
    setForm(prev => ({
      ...prev,
      attendees: prev.attendees.includes(name) ? prev.attendees.filter(a => a !== name) : [...prev.attendees, name]
    }))
  }

  const attendees = ['张三', '李四', '王五', '赵六', '钱七', '孙八']

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div
        className="bg-cyber-bg border border-cyber-border/40 rounded-t-xl sm:rounded-xl w-full sm:max-w-md max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b border-cyber-border/30 flex items-center justify-between">
          <h2 className="text-sm font-bold text-cyber-text font-mono">{isCreating ? '创建日程' : '编辑日程'}</h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-cyber-text rounded hover:bg-white/5">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* 标题 */}
          <div>
            <label className="text-[10px] text-gray-500 font-mono block mb-1">事件标题 *</label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="输入事件标题..."
              className="w-full px-3 py-2 text-xs bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg text-cyber-text placeholder-gray-600 focus:outline-none focus:border-cyber-accent/50"
            />
          </div>

          {/* 时间 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-500 font-mono block mb-1">开始时间</label>
              <input
                type="datetime-local"
                value={toDateTimeLocal(form.startTime)}
                onChange={e => setForm({ ...form, startTime: new Date(e.target.value).toISOString() })}
                className="w-full px-2 py-2 text-xs bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg text-cyber-text focus:outline-none focus:border-cyber-accent/50"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 font-mono block mb-1">结束时间</label>
              <input
                type="datetime-local"
                value={toDateTimeLocal(form.endTime)}
                onChange={e => setForm({ ...form, endTime: new Date(e.target.value).toISOString() })}
                className="w-full px-2 py-2 text-xs bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg text-cyber-text focus:outline-none focus:border-cyber-accent/50"
              />
            </div>
          </div>

          {/* 分类 */}
          <div>
            <label className="text-[10px] text-gray-500 font-mono block mb-1">分类</label>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(categoryConfig) as ScheduleCategory[]).map(cat => {
                const c = categoryConfig[cat]
                const Icon = c.icon
                return (
                  <button
                    key={cat}
                    onClick={() => setForm({ ...form, category: cat, color: colorOptions[Object.keys(categoryConfig).indexOf(cat) % colorOptions.length].value })}
                    className={cn(
                      'px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all flex items-center gap-1',
                      form.category === cat ? cn(c.bgColor, c.color, c.borderColor) : 'border-cyber-border/30 text-gray-500 hover:text-cyber-text'
                    )}
                  >
                    <Icon className="w-3 h-3" />
                    {c.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 颜色 */}
          <div>
            <label className="text-[10px] text-gray-500 font-mono block mb-1">颜色</label>
            <div className="flex gap-2">
              {colorOptions.map(c => (
                <button
                  key={c.value}
                  onClick={() => setForm({ ...form, color: c.value })}
                  className={cn('w-6 h-6 rounded-full border-2 transition-all', form.color === c.value ? 'border-white scale-110' : 'border-transparent')}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* 位置 */}
          <div>
            <label className="text-[10px] text-gray-500 font-mono block mb-1">位置</label>
            <input
              value={form.location || ''}
              onChange={e => setForm({ ...form, location: e.target.value })}
              placeholder="输入位置..."
              className="w-full px-3 py-2 text-xs bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg text-cyber-text placeholder-gray-600 focus:outline-none focus:border-cyber-accent/50"
            />
          </div>

          {/* 描述 */}
          <div>
            <label className="text-[10px] text-gray-500 font-mono block mb-1">描述</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="描述详情..."
              rows={2}
              className="w-full px-3 py-2 text-xs bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg text-cyber-text placeholder-gray-600 focus:outline-none focus:border-cyber-accent/50 resize-none"
            />
          </div>

          {/* 重复与提醒 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-500 font-mono block mb-1">重复</label>
              <select
                value={form.repeat}
                onChange={e => setForm({ ...form, repeat: e.target.value as RepeatType })}
                className="w-full px-2 py-2 text-xs bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg text-cyber-text focus:outline-none focus:border-cyber-accent/50"
              >
                {repeatOptions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 font-mono block mb-1">提醒</label>
              <select
                value={form.reminder}
                onChange={e => setForm({ ...form, reminder: parseInt(e.target.value) })}
                className="w-full px-2 py-2 text-xs bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg text-cyber-text focus:outline-none focus:border-cyber-accent/50"
              >
                {reminderOptions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
          </div>

          {/* 参与人 */}
          <div>
            <label className="text-[10px] text-gray-500 font-mono block mb-1">参与人</label>
            <div className="flex flex-wrap gap-1.5">
              {attendees.map(a => (
                <button
                  key={a}
                  onClick={() => toggleAttendee(a)}
                  className={cn(
                    'px-2 py-0.5 text-[10px] font-mono rounded border transition-all',
                    form.attendees.includes(a)
                      ? 'bg-cyber-accent/20 text-cyber-accent border-cyber-accent/40'
                      : 'border-cyber-border/30 text-gray-500 hover:text-cyber-text'
                  )}
                >
                  {a}
                </button>
              ))}
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

// ============ 工具函数 ============

function formatTime(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()} ${formatTime(iso)}`
}

function formatDateGroup(d: Date): string {
  const today = new Date()
  const tomorrow = new Date(today.getTime() + 86400000)
  if (d.toDateString() === today.toDateString()) return '今天'
  if (d.toDateString() === tomorrow.toDateString()) return '明天'
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
}

function toDateTimeLocal(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
