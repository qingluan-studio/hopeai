import { useState, useMemo } from 'react'
import {
  Bell,
  Search,
  Check,
  CheckCheck,
  Trash2,
  Archive,
  Settings as SettingsIcon,
  X,
  Info,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Megaphone,
  Filter,
  ChevronDown,
  ChevronRight,
  Clock,
  ExternalLink,
  Mail,
  Webhook,
  Inbox,
  Circle,
  Star,
  Tag,
  Calendar,
  Cpu,
  Gift,
  AlertCircle,
  BellOff,
  Volume2,
  Smartphone,
  Globe,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// 消息类别类型
type NotificationCategory = 'system' | 'chat' | 'task' | 'social' | 'marketing'

// 消息项类型
interface NotificationItem {
  id: string
  category: NotificationCategory
  title: string
  content: string
  time: string
  read: boolean
  archived: boolean
  starred: boolean
  action?: { label: string; type: 'primary' | 'secondary' | 'danger' }
  icon: typeof Info
  priority: 'low' | 'normal' | 'high'
}

// Tab 配置
const categoryTabs: { id: NotificationCategory | 'all'; label: string; icon: typeof Info }[] = [
  { id: 'all', label: '全部', icon: Inbox },
  { id: 'system', label: '系统', icon: Info },
  { id: 'chat', label: '对话', icon: MessageSquare },
  { id: 'task', label: '任务', icon: CheckCircle2 },
  { id: 'social', label: '社交', icon: Sparkles },
  { id: 'marketing', label: '营销', icon: Megaphone },
]

// 模拟消息数据
const initialNotifications: NotificationItem[] = [
  // 系统消息
  {
    id: 'n1', category: 'system', title: '系统升级通知',
    content: 'HopeAgent Pro 已升级至 v3.0.0，新增 Agent 大脑、工作流引擎、思维导图等模块。建议查看更新日志了解全部新特性。',
    time: '2026-07-13 09:30', read: false, archived: false, starred: true,
    action: { label: '查看更新', type: 'primary' },
    icon: AlertCircle, priority: 'high',
  },
  {
    id: 'n2', category: 'system', title: '安全提醒',
    content: '检测到来自新设备 (Windows PC / Edge) 的登录，定位：北京。如非本人操作，请立即修改密码。',
    time: '2026-07-12 14:23', read: false, archived: false, starred: false,
    action: { label: '立即处理', type: 'danger' },
    icon: AlertTriangle, priority: 'high',
  },
  {
    id: 'n3', category: 'system', title: '维护通知',
    content: '系统将于今晚 23:00-02:00 进行例行维护，期间部分服务可能不可用。请提前保存工作。',
    time: '2026-07-12 10:00', read: true, archived: false, starred: false,
    icon: Info, priority: 'normal',
  },
  {
    id: 'n4', category: 'system', title: 'API 限流调整',
    content: '您的 API 调用频率已接近上限 (4500/5000)。如需更高配额，请升级到企业版。',
    time: '2026-07-11 16:45', read: true, archived: false, starred: false,
    icon: AlertTriangle, priority: 'normal',
  },
  // 对话消息
  {
    id: 'n5', category: 'chat', title: 'Agent 回复完成',
    content: '代码架构师 已完成对「React 性能优化方案」的回复，共生成 1,856 字。点击查看完整回答。',
    time: '2026-07-13 08:15', read: false, archived: false, starred: false,
    action: { label: '查看对话', type: 'primary' },
    icon: MessageSquare, priority: 'normal',
  },
  {
    id: 'n6', category: 'chat', title: '知识库检索结果',
    content: '在您的知识库中找到 12 条与「TypeScript 类型系统」相关的条目，已自动整理为参考列表。',
    time: '2026-07-13 07:42', read: false, archived: false, starred: false,
    action: { label: '查看结果', type: 'secondary' },
    icon: Search, priority: 'low',
  },
  {
    id: 'n7', category: 'chat', title: '对话被分享',
    content: '用户 @TechReviewer 分享了你的对话「大模型微调实践」。已有 23 人查看。',
    time: '2026-07-12 20:18', read: true, archived: false, starred: false,
    icon: Sparkles, priority: 'low',
  },
  {
    id: 'n8', category: 'chat', title: 'Agent 工具调用',
    content: '数据工程师 调用了「Web 搜索」工具，查询关键词："2026 年 AI 趋势报告"，获取到 8 条结果。',
    time: '2026-07-12 15:30', read: true, archived: false, starred: false,
    icon: Cpu, priority: 'low',
  },
  // 任务消息
  {
    id: 'n9', category: 'task', title: '工作流执行完成',
    content: '工作流「每日数据分析报告」已成功执行，生成了 5 张图表与 1 份摘要。耗时 2 分 18 秒。',
    time: '2026-07-13 06:00', read: false, archived: false, starred: true,
    action: { label: '查看报告', type: 'primary' },
    icon: CheckCircle2, priority: 'normal',
  },
  {
    id: 'n10', category: 'task', title: '任务失败提醒',
    content: '工作流「自动部署到生产」执行失败，错误原因：构建超时。已自动重试 3 次。',
    time: '2026-07-12 22:45', read: false, archived: false, starred: false,
    action: { label: '查看日志', type: 'danger' },
    icon: AlertTriangle, priority: 'high',
  },
  {
    id: 'n11', category: 'task', title: '代码执行结果',
    content: '代码沙箱任务已完成，输出 256 行结果。内存使用：128MB，耗时：1.2s。',
    time: '2026-07-12 18:20', read: true, archived: false, starred: false,
    action: { label: '查看输出', type: 'secondary' },
    icon: CheckCircle2, priority: 'low',
  },
  {
    id: 'n12', category: 'task', title: '计划任务提醒',
    content: '您设定的「每周数据备份」任务将于 30 分钟后执行，请确认相关服务可用。',
    time: '2026-07-12 11:30', read: true, archived: false, starred: false,
    icon: Calendar, priority: 'normal',
  },
  // 社交消息
  {
    id: 'n13', category: 'social', title: '新的关注者',
    content: '@AIExplorer 开始关注你。你们有 8 个共同兴趣：React、TypeScript、AI Agent、RAG...',
    time: '2026-07-13 10:15', read: false, archived: false, starred: false,
    action: { label: '回关', type: 'primary' },
    icon: Sparkles, priority: 'low',
  },
  {
    id: 'n14', category: 'social', title: '模板被点赞',
    content: '你分享的模板「产品需求文档生成器」获得了 50 个赞和 12 条好评。',
    time: '2026-07-12 19:00', read: true, archived: false, starred: false,
    icon: Star, priority: 'low',
  },
  {
    id: 'n15', category: 'social', title: '收到评论',
    content: '@DevMaster 在你的工作流「API 自动化测试」下评论："这个流程设计得很棒，能否分享下条件分支的实现？"',
    time: '2026-07-12 16:22', read: true, archived: false, starred: false,
    action: { label: '回复', type: 'primary' },
    icon: MessageSquare, priority: 'normal',
  },
  {
    id: 'n16', category: 'social', title: '团队邀请',
    content: '你被邀请加入团队「AI 创新实验室」，担任 Agent 架构师角色。',
    time: '2026-07-11 14:00', read: true, archived: false, starred: true,
    action: { label: '接受邀请', type: 'primary' },
    icon: Sparkles, priority: 'high',
  },
  // 营销消息
  {
    id: 'n17', category: 'marketing', title: '限时优惠',
    content: '年度会员限时 7 折！升级后解锁无限对话、33 个高级 Agent、优先客服支持。活动截止：7月20日。',
    time: '2026-07-13 08:00', read: false, archived: false, starred: false,
    action: { label: '立即升级', type: 'primary' },
    icon: Gift, priority: 'normal',
  },
  {
    id: 'n18', category: 'marketing', title: '新功能发布',
    content: 'Mind Map 思维导图模块已上线！支持 AI 自动生成、节点编辑、多种布局。立即体验。',
    time: '2026-07-12 09:00', read: true, archived: false, starred: false,
    action: { label: '体验', type: 'primary' },
    icon: Sparkles, priority: 'low',
  },
  {
    id: 'n19', category: 'marketing', title: '社区活动',
    content: '本周六下午 14:00 举办「Agent 开发实战」线上分享会，特邀技术专家讲解多 Agent 协作架构。',
    time: '2026-07-11 12:00', read: true, archived: false, starred: false,
    action: { label: '报名参加', type: 'secondary' },
    icon: Megaphone, priority: 'low',
  },
  {
    id: 'n20', category: 'marketing', title: '调研邀请',
    content: '我们正在进行用户体验调研，完成 5 分钟问卷即可获得 100 积分奖励。',
    time: '2026-07-10 15:00', read: true, archived: true, starred: false,
    icon: Tag, priority: 'low',
  },
]

// 通知偏好设置结构
interface NotificationPrefs {
  // 类别订阅
  subscriptions: Record<NotificationCategory, boolean>
  // 推送方式
  channels: {
    inApp: boolean
    email: boolean
    webhook: boolean
  }
  // 免打扰
  doNotDisturb: boolean
  dndStart: string
  dndEnd: string
}

// 默认偏好设置
const defaultPrefs: NotificationPrefs = {
  subscriptions: {
    system: true,
    chat: true,
    task: true,
    social: true,
    marketing: false,
  },
  channels: {
    inApp: true,
    email: true,
    webhook: false,
  },
  doNotDisturb: false,
  dndStart: '22:00',
  dndEnd: '08:00',
}

// 优先级颜色映射
const priorityColors = {
  low: 'text-gray-500',
  normal: 'text-cyber-accent2',
  high: 'text-yellow-400',
}

// 类别颜色映射
const categoryColors: Record<NotificationCategory, string> = {
  system: '#00ff88',
  chat: '#00d4ff',
  task: '#34d399',
  social: '#c084fc',
  marketing: '#fb923c',
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [activeTab, setActiveTab] = useState<NotificationCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [detailItem, setDetailItem] = useState<NotificationItem | null>(null)
  const [prefs, setPrefs] = useState(defaultPrefs)
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'normal' | 'high'>('all')

  // 过滤后的消息列表
  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      // 类别过滤
      if (activeTab !== 'all' && n.category !== activeTab) return false
      // 归档过滤
      if (!showArchived && n.archived) return false
      if (showArchived && !n.archived) return false
      // 优先级过滤
      if (filterPriority !== 'all' && n.priority !== filterPriority) return false
      // 搜索过滤
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
      }
      return true
    })
  }, [notifications, activeTab, showArchived, filterPriority, searchQuery])

  // 未读数量统计
  const unreadCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0, system: 0, chat: 0, task: 0, social: 0, marketing: 0 }
    notifications.forEach(n => {
      if (!n.read && !n.archived) {
        counts.all++
        counts[n.category]++
      }
    })
    return counts
  }, [notifications])

  // 标记单条已读
  const handleMarkRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  }

  // 标记全部已读
  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n =>
      activeTab === 'all' || n.category === activeTab
        ? { ...n, read: true }
        : n
    ))
  }

  // 切换选中状态
  const handleToggleSelect = (id: string) => {
    setSelectedIds(selectedIds.includes(id)
      ? selectedIds.filter(i => i !== id)
      : [...selectedIds, id]
    )
  }

  // 删除选中
  const handleDeleteSelected = () => {
    setNotifications(notifications.filter(n => !selectedIds.includes(n.id)))
    setSelectedIds([])
  }

  // 删除单条
  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
    if (detailItem?.id === id) setDetailItem(null)
  }

  // 归档单条
  const handleArchive = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, archived: true } : n))
  }

  // 切换星标
  const handleToggleStar = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, starred: !n.starred } : n))
  }

  // 全选当前列表
  const handleSelectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredNotifications.map(n => n.id))
    }
  }

  // 渲染消息卡片
  const renderNotificationCard = (item: NotificationItem) => {
    const Icon = item.icon
    const isSelected = selectedIds.includes(item.id)
    const categoryColor = categoryColors[item.category]

    return (
      <div
        key={item.id}
        className={cn(
          'relative rounded-xl border p-3 transition-all',
          item.read
            ? 'bg-white/[0.02] border-cyber-border/40'
            : 'bg-cyber-panel/60 border-cyber-accent/20 hover:border-cyber-accent/40',
          isSelected && 'ring-1 ring-cyber-accent/40'
        )}
      >
        {/* 未读指示器 */}
        {!item.read && (
          <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyber-accent animate-pulse" />
        )}

        <div className="flex items-start gap-3 pl-2">
          {/* 选中复选框 */}
          <button
            onClick={() => handleToggleSelect(item.id)}
            className="mt-1 flex-shrink-0"
          >
            {isSelected
              ? <CheckCircle2 className="w-4 h-4 text-cyber-accent" />
              : <Circle className="w-4 h-4 text-gray-600 hover:text-gray-400" />
            }
          </button>

          {/* 图标 */}
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: `${categoryColor}15`,
              border: `1px solid ${categoryColor}30`,
            }}
          >
            <Icon className="w-4 h-4" style={{ color: categoryColor }} />
          </div>

          {/* 内容 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <h4 className={cn(
                  'text-sm truncate',
                  item.read ? 'text-gray-300 font-normal' : 'text-cyber-text font-bold'
                )}>
                  {item.title}
                </h4>
                {item.priority === 'high' && (
                  <span className="px-1.5 py-0.5 rounded bg-yellow-500/15 text-yellow-400 text-[9px] font-mono flex-shrink-0">
                    重要
                  </span>
                )}
                {item.starred && (
                  <Star className="w-3 h-3 text-yellow-400 fill-current flex-shrink-0" />
                )}
              </div>
              <span className="text-[10px] text-gray-500 font-mono flex-shrink-0">
                {item.time}
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-2">
              {item.content}
            </p>
            {/* 操作按钮 */}
            <div className="flex items-center gap-2">
              {item.action && (
                <button
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all',
                    item.action.type === 'primary' && 'bg-cyber-accent/15 text-cyber-accent hover:bg-cyber-accent/25 border border-cyber-accent/30',
                    item.action.type === 'secondary' && 'bg-cyber-accent2/15 text-cyber-accent2 hover:bg-cyber-accent2/25 border border-cyber-accent2/30',
                    item.action.type === 'danger' && 'bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/30',
                  )}
                >
                  {item.action.label}
                </button>
              )}
              {!item.read && (
                <button
                  onClick={() => handleMarkRead(item.id)}
                  className="px-2 py-1 rounded-lg text-[10px] font-mono text-gray-500 hover:text-cyber-accent hover:bg-white/5 transition-all"
                >
                  标为已读
                </button>
              )}
              <button
                onClick={() => setDetailItem(item)}
                className="px-2 py-1 rounded-lg text-[10px] font-mono text-gray-500 hover:text-cyber-accent2 hover:bg-white/5 transition-all flex items-center gap-1"
              >
                详情
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* 右侧操作 */}
          <div className="flex flex-col gap-1 flex-shrink-0">
            <button
              onClick={() => handleToggleStar(item.id)}
              className="p-1 rounded hover:bg-white/5 text-gray-600 hover:text-yellow-400 transition-colors"
              title="星标"
            >
              <Star className={cn('w-3.5 h-3.5', item.starred && 'text-yellow-400 fill-current')} />
            </button>
            <button
              onClick={() => handleArchive(item.id)}
              className="p-1 rounded hover:bg-white/5 text-gray-600 hover:text-cyber-accent2 transition-colors"
              title="归档"
            >
              <Archive className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="p-1 rounded hover:bg-white/5 text-gray-600 hover:text-red-400 transition-colors"
              title="删除"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 渲染设置面板
  const renderSettingsPanel = () => (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowSettings(false)}>
      <div
        className="bg-cyber-panel border border-cyber-accent/30 rounded-t-2xl sm:rounded-xl w-full sm:max-w-md max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="sticky top-0 bg-cyber-panel border-b border-cyber-border/30 px-4 py-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-cyber-text flex items-center gap-2">
            <SettingsIcon className="w-4 h-4 text-cyber-accent" />
            通知设置
          </h3>
          <button
            onClick={() => setShowSettings(false)}
            className="p-1 rounded hover:bg-white/5 text-gray-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* 类别订阅 */}
          <div>
            <h4 className="text-xs font-mono text-gray-400 uppercase mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              消息订阅
            </h4>
            <div className="space-y-1.5">
              {([
                { key: 'system' as const, label: '系统消息', desc: '安全、维护、版本更新' },
                { key: 'chat' as const, label: '对话消息', desc: 'Agent 回复、知识检索' },
                { key: 'task' as const, label: '任务消息', desc: '工作流、代码执行结果' },
                { key: 'social' as const, label: '社交消息', desc: '关注、评论、点赞' },
                { key: 'marketing' as const, label: '营销消息', desc: '活动、优惠、调研' },
              ]).map(item => (
                <div key={item.key} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02] border border-cyber-border/30">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-sm text-gray-300">{item.label}</p>
                    <p className="text-[10px] text-gray-500 font-mono">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setPrefs({
                      ...prefs,
                      subscriptions: {
                        ...prefs.subscriptions,
                        [item.key]: !prefs.subscriptions[item.key],
                      }
                    })}
                    className={cn(
                      'relative w-11 h-6 rounded-full transition-colors flex-shrink-0',
                      prefs.subscriptions[item.key] ? 'bg-cyber-accent/40' : 'bg-cyber-border'
                    )}
                  >
                    <div className={cn(
                      'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform',
                      prefs.subscriptions[item.key] ? 'translate-x-5' : 'translate-x-0.5'
                    )} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 推送方式 */}
          <div>
            <h4 className="text-xs font-mono text-gray-400 uppercase mb-2 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5" />
              推送方式
            </h4>
            <div className="space-y-1.5">
              {([
                { key: 'inApp' as const, label: '站内通知', desc: '应用内消息中心', icon: Inbox },
                { key: 'email' as const, label: '邮件推送', desc: '发送到绑定邮箱', icon: Mail },
                { key: 'webhook' as const, label: 'Webhook', desc: '推送到自定义 URL', icon: Webhook },
              ]).map(item => {
                const Icon = item.icon
                return (
                  <div key={item.key} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/[0.02] border border-cyber-border/30">
                    <Icon className="w-4 h-4 text-cyber-accent2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-300">{item.label}</p>
                      <p className="text-[10px] text-gray-500 font-mono">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setPrefs({
                        ...prefs,
                        channels: {
                          ...prefs.channels,
                          [item.key]: !prefs.channels[item.key],
                        }
                      })}
                      className={cn(
                        'relative w-11 h-6 rounded-full transition-colors flex-shrink-0',
                        prefs.channels[item.key] ? 'bg-cyber-accent/40' : 'bg-cyber-border'
                      )}
                    >
                      <div className={cn(
                        'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform',
                        prefs.channels[item.key] ? 'translate-x-5' : 'translate-x-0.5'
                      )} />
                    </button>
                  </div>
                )
              })}
            </div>
            {prefs.channels.webhook && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="https://your-webhook.url/notify"
                  className="w-full bg-white/[0.02] border border-cyber-border focus:border-cyber-accent outline-none rounded-lg px-3 py-2 text-xs text-cyber-text font-mono"
                />
              </div>
            )}
          </div>

          {/* 免打扰 */}
          <div>
            <h4 className="text-xs font-mono text-gray-400 uppercase mb-2 flex items-center gap-1.5">
              <BellOff className="w-3.5 h-3.5" />
              免打扰模式
            </h4>
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02] border border-cyber-border/30 mb-2">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-300">启用免打扰</span>
              </div>
              <button
                onClick={() => setPrefs({ ...prefs, doNotDisturb: !prefs.doNotDisturb })}
                className={cn(
                  'relative w-11 h-6 rounded-full transition-colors',
                  prefs.doNotDisturb ? 'bg-cyber-accent/40' : 'bg-cyber-border'
                )}
              >
                <div className={cn(
                  'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform',
                  prefs.doNotDisturb ? 'translate-x-5' : 'translate-x-0.5'
                )} />
              </button>
            </div>
            {prefs.doNotDisturb && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-gray-500 font-mono">开始时间</label>
                  <input
                    type="time"
                    value={prefs.dndStart}
                    onChange={e => setPrefs({ ...prefs, dndStart: e.target.value })}
                    className="w-full bg-white/[0.02] border border-cyber-border focus:border-cyber-accent outline-none rounded-lg px-2 py-1.5 text-xs text-cyber-text font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 font-mono">结束时间</label>
                  <input
                    type="time"
                    value={prefs.dndEnd}
                    onChange={e => setPrefs({ ...prefs, dndEnd: e.target.value })}
                    className="w-full bg-white/[0.02] border border-cyber-border focus:border-cyber-accent outline-none rounded-lg px-2 py-1.5 text-xs text-cyber-text font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 保存按钮 */}
          <button className="w-full py-2.5 rounded-lg bg-cyber-accent/20 border border-cyber-accent/30 text-cyber-accent text-sm font-mono hover:bg-cyber-accent/30 transition-all">
            保存设置
          </button>
        </div>
      </div>
    </div>
  )

  // 渲染消息详情弹窗
  const renderDetailModal = () => {
    if (!detailItem) return null
    const Icon = detailItem.icon
    const categoryColor = categoryColors[detailItem.category]

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setDetailItem(null)}>
        <div
          className="bg-cyber-panel border border-cyber-accent/30 rounded-xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* 头部 */}
          <div className="border-b border-cyber-border/30 px-4 py-3 flex items-center justify-between sticky top-0 bg-cyber-panel">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${categoryColor}15`, border: `1px solid ${categoryColor}30` }}
              >
                <Icon className="w-4 h-4" style={{ color: categoryColor }} />
              </div>
              <span className="text-xs font-mono text-gray-500 uppercase">
                {categoryTabs.find(t => t.id === detailItem.category)?.label}消息
              </span>
            </div>
            <button
              onClick={() => setDetailItem(null)}
              className="p-1 rounded hover:bg-white/5 text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 内容 */}
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base font-bold text-cyber-text">{detailItem.title}</h3>
              {detailItem.starred && (
                <Star className="w-4 h-4 text-yellow-400 fill-current flex-shrink-0 mt-1" />
              )}
            </div>
            <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {detailItem.time}
              </span>
              <span className={cn('px-1.5 py-0.5 rounded', priorityColors[detailItem.priority])}>
                {detailItem.priority === 'high' ? '高优先级' : detailItem.priority === 'normal' ? '普通' : '低优先级'}
              </span>
              <span className={detailItem.read ? 'text-gray-500' : 'text-cyber-accent'}>
                {detailItem.read ? '已读' : '未读'}
              </span>
            </div>
            <div className="bg-white/[0.02] border border-cyber-border/30 rounded-lg p-3">
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                {detailItem.content}
              </p>
            </div>

            {/* 操作 */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-cyber-border/30">
              {detailItem.action && (
                <button
                  className={cn(
                    'flex-1 min-w-[120px] py-2 rounded-lg text-xs font-mono transition-all',
                    detailItem.action.type === 'primary' && 'bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/30 hover:bg-cyber-accent/30',
                    detailItem.action.type === 'secondary' && 'bg-cyber-accent2/20 text-cyber-accent2 border border-cyber-accent2/30 hover:bg-cyber-accent2/30',
                    detailItem.action.type === 'danger' && 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30',
                  )}
                >
                  {detailItem.action.label}
                </button>
              )}
              {!detailItem.read && (
                <button
                  onClick={() => {
                    handleMarkRead(detailItem.id)
                    setDetailItem({ ...detailItem, read: true })
                  }}
                  className="px-3 py-2 rounded-lg border border-cyber-border text-gray-400 text-xs font-mono hover:bg-white/5"
                >
                  标为已读
                </button>
              )}
              <button
                onClick={() => {
                  handleArchive(detailItem.id)
                  setDetailItem(null)
                }}
                className="px-3 py-2 rounded-lg border border-cyber-border text-gray-400 text-xs font-mono hover:bg-white/5 flex items-center gap-1"
              >
                <Archive className="w-3.5 h-3.5" />
                归档
              </button>
              <button
                onClick={() => {
                  handleDelete(detailItem.id)
                }}
                className="px-3 py-2 rounded-lg border border-red-500/30 text-red-400 text-xs font-mono hover:bg-red-500/10 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* 顶部标题栏 */}
      <div className="border-b border-cyber-border bg-cyber-panel/50 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-cyber-text flex items-center gap-2">
              <Bell className="w-4 h-4 text-cyber-accent" />
              消息通知
              {unreadCounts.all > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-cyber-accent/20 text-cyber-accent text-[10px] font-mono">
                  {unreadCounts.all} 未读
                </span>
              )}
            </h1>
            <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
              系统消息 · 对话动态 · 任务通知
            </p>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-lg bg-white/[0.03] border border-cyber-border/50 text-gray-400 hover:text-cyber-accent hover:border-cyber-accent/30 transition-all"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>

        {/* 搜索框 */}
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="搜索消息标题或内容..."
            className="w-full bg-white/[0.02] border border-cyber-border focus:border-cyber-accent outline-none rounded-lg pl-9 pr-9 py-2 text-sm text-cyber-text"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyber-text"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tab 切换栏 */}
      <div className="border-b border-cyber-border/30 bg-cyber-bg/30 flex-shrink-0">
        <div className="flex items-center gap-1 px-2 py-2 overflow-x-auto">
          {categoryTabs.map(tab => {
            const Icon = tab.icon
            const count = unreadCounts[tab.id] || 0
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setShowArchived(false) }}
                className={cn(
                  'relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex-shrink-0',
                  activeTab === tab.id && !showArchived
                    ? 'bg-cyber-accent/15 text-cyber-accent border border-cyber-accent/30'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                {count > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[9px] font-mono">
                    {count}
                  </span>
                )}
              </button>
            )
          })}
          <div className="w-px h-5 bg-cyber-border mx-1 flex-shrink-0" />
          <button
            onClick={() => setShowArchived(true)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex-shrink-0',
              showArchived
                ? 'bg-cyber-accent2/15 text-cyber-accent2 border border-cyber-accent2/30'
                : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'
            )}
          >
            <Archive className="w-3.5 h-3.5" />
            归档
          </button>
        </div>
      </div>

      {/* 批量操作栏 */}
      {(selectedIds.length > 0 || filteredNotifications.length > 0) && (
        <div className="border-b border-cyber-border/30 bg-cyber-bg/20 px-3 py-2 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            {selectedIds.length > 0 ? (
              <>
                <span className="text-xs font-mono text-cyber-accent">
                  已选 {selectedIds.length} 项
                </span>
                <button
                  onClick={() => setSelectedIds([])}
                  className="text-[10px] text-gray-500 hover:text-gray-300 font-mono"
                >
                  取消
                </button>
              </>
            ) : (
              <button
                onClick={handleSelectAll}
                className="text-[10px] text-gray-500 hover:text-cyber-accent font-mono flex items-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3" />
                全选
              </button>
            )}
          </div>
          <div className="flex items-center gap-1">
            {/* 优先级过滤 */}
            <div className="relative">
              <select
                value={filterPriority}
                onChange={e => setFilterPriority(e.target.value as 'all' | 'low' | 'normal' | 'high')}
                className="appearance-none bg-white/[0.03] border border-cyber-border/50 rounded-lg pl-2 pr-7 py-1 text-[10px] text-gray-400 font-mono outline-none focus:border-cyber-accent/30"
              >
                <option value="all">全部优先级</option>
                <option value="high">高</option>
                <option value="normal">普通</option>
                <option value="low">低</option>
              </select>
              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
            </div>
            {selectedIds.length > 0 ? (
              <>
                <button
                  onClick={handleDeleteSelected}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-mono hover:bg-red-500/20 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                  删除
                </button>
              </>
            ) : (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent text-[10px] font-mono hover:bg-cyber-accent/20 transition-all"
              >
                <CheckCheck className="w-3 h-3" />
                全部已读
              </button>
            )}
          </div>
        </div>
      )}

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredNotifications.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-12">
            <BellOff className="w-12 h-12 text-gray-700 mb-3" />
            <p className="text-sm text-gray-500 mb-1">
              {showArchived ? '归档为空' : searchQuery ? '未找到匹配消息' : '暂无消息'}
            </p>
            <p className="text-[11px] text-gray-600 font-mono">
              {showArchived ? '归档的消息将显示在这里' : '新消息将显示在这里'}
            </p>
          </div>
        ) : (
          filteredNotifications.map(renderNotificationCard)
        )}
      </div>

      {/* 设置面板 */}
      {showSettings && renderSettingsPanel()}

      {/* 详情弹窗 */}
      {detailItem && renderDetailModal()}
    </div>
  )
}
