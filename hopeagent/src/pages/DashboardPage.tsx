import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  MessageSquarePlus,
  Upload,
  Search,
  Brain,
  Settings,
  Download,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Layers,
  Zap,
  BookOpen,
  Clock,
  Wifi,
  Cpu,
  HardDrive,
  Activity,
  User,
  Sun,
  Cloud,
  CloudRain,
  ChevronRight,
  Sparkles,
  Terminal,
  Code,
  Bot,
  Palette,
  FileText,
} from 'lucide-react'
import { useChatStore, useAppStore, useKnowledgeStore } from '@/store'
import { agents } from '@/engine/agents'
import { cn } from '@/lib/utils'

// 模拟天气数据
const mockWeather = {
  city: '北京',
  temperature: 26,
  condition: '晴',
  icon: Sun,
}

// 模拟今日统计数据
const mockStats = {
  messages: 128,
  conversations: 12,
  tokens: 45680,
  knowledgeEntries: 156,
  messagesChange: 23.5,
  conversationsChange: 12.3,
  tokensChange: -5.2,
  knowledgeChange: 8.7,
}

// 模拟最近对话
const mockRecentConversations = [
  { id: '1', title: 'React 性能优化方案讨论', lastMessage: '是的，我们可以使用 useMemo 来优化...', agentName: '代码架构师', time: '10:32', messageCount: 24 },
  { id: '2', title: '产品需求文档撰写', lastMessage: '好的，我来帮你整理一下需求...', agentName: '产品经理', time: '09:15', messageCount: 18 },
  { id: '3', title: '数据库表结构设计', lastMessage: '建议添加索引来提升查询速度...', agentName: '数据工程师', time: '昨天', messageCount: 31 },
  { id: '4', title: '英语翻译辅助', lastMessage: '这句话的地道表达应该是...', agentName: '语言专家', time: '昨天', messageCount: 42 },
  { id: '5', title: '周报生成', lastMessage: '本周工作总结如下...', agentName: '办公助手', time: '周一', messageCount: 8 },
]

// 模拟活动时间线
const mockTimeline = [
  { id: '1', type: 'message' as const, title: '新建对话', description: '与代码架构师讨论 React 性能优化', time: '10:32' },
  { id: '2', type: 'knowledge' as const, title: '添加知识条目', description: '新增「前端性能优化最佳实践」', time: '09:45' },
  { id: '3', type: 'agent' as const, title: 'Agent 激活', description: '超级大脑模式已启用', time: '09:00' },
  { id: '4', type: 'system' as const, title: '系统更新', description: '知识库向量索引重建完成', time: '08:30' },
  { id: '5', type: 'message' as const, title: '对话归档', description: '「项目方案讨论」已归档', time: '昨天 18:20' },
  { id: '6', type: 'knowledge' as const, title: '批量导入', description: '成功导入 23 条知识条目', time: '昨天 15:30' },
]

// 模拟快捷命令
const mockQuickCommands = [
  { id: '1', cmd: '/explain', desc: '解释代码' },
  { id: '2', cmd: '/refactor', desc: '重构代码' },
  { id: '3', cmd: '/summary', desc: '总结对话' },
  { id: '4', cmd: '/translate', desc: '翻译内容' },
  { id: '5', cmd: '/brainstorm', desc: '头脑风暴' },
  { id: '6', cmd: '/review', desc: '代码审查' },
]

export default function DashboardPage() {
  const { setCurrentPage } = useAppStore()
  const { createConversation, setActiveAgent, conversations } = useChatStore()
  const { entries } = useKnowledgeStore()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [systemStatus, setSystemStatus] = useState({
    backend: 'online',
    model: 'healthy',
    cacheHit: 87.5,
    storage: 2.3,
    storageTotal: 10,
  })

  // 实时更新时间
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const formatDate = (date: Date) => {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekday = weekdays[date.getDay()]
    return `${month}月${day}日 ${weekday}`
  }

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 6) return '凌晨好'
    if (hour < 12) return '早上好'
    if (hour < 14) return '中午好'
    if (hour < 18) return '下午好'
    return '晚上好'
  }

  const handleNewChat = () => {
    createConversation()
    setCurrentPage('chat')
  }

  const handleAgentChat = (agentId: string) => {
    setActiveAgent(agentId)
    createConversation()
    setCurrentPage('chat')
  }

  const quickActions = [
    { id: 'new-chat', icon: MessageSquarePlus, label: '新建对话', action: handleNewChat, color: '#00ff88' },
    { id: 'upload', icon: Upload, label: '上传文件', action: () => {}, color: '#00d4ff' },
    { id: 'search', icon: Search, label: '知识库搜索', action: () => setCurrentPage('knowledge'), color: '#c084fc' },
    { id: 'agents', icon: Brain, label: 'Agent 管理', action: () => setCurrentPage('agents'), color: '#f472b6' },
    { id: 'settings', icon: Settings, label: '设置', action: () => setCurrentPage('settings'), color: '#fbbf24' },
    { id: 'export', icon: Download, label: '导出数据', action: () => {}, color: '#34d399' },
  ]

  const commonlyUsedAgents = agents.slice(0, 4)

  const totalMessages = conversations.reduce((sum, c) => sum + c.messages.length, 0)

  return (
    <div className="h-full flex flex-col">
      {/* 顶部标题栏 */}
      <div className="border-b border-cyber-border bg-cyber-panel/50 px-4 py-3">
        <h1 className="text-base font-bold text-cyber-text flex items-center gap-2">
          <LayoutDashboard className="w-4 h-4 text-cyber-accent" />
          工作台
        </h1>
        <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
          总览 · 快捷操作 · 系统状态
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* 欢迎区 */}
        <div className="rounded-xl border border-cyber-border bg-gradient-to-br from-cyber-accent/10 via-cyber-panel/50 to-purple-500/10 p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cyber-accent/20 border border-cyber-accent/40 flex items-center justify-center">
                <User className="w-6 h-6 text-cyber-accent" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-cyber-text">
                  {getGreeting()}，开发者
                </h2>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  {formatDate(currentTime)} {formatTime(currentTime)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-cyber-accent">
                <Sun className="w-5 h-5" />
                <span className="text-lg font-bold font-mono">{mockWeather.temperature}°</span>
              </div>
              <p className="text-[10px] text-gray-500 font-mono">{mockWeather.city} · {mockWeather.condition}</p>
            </div>
          </div>
        </div>

        {/* 快速操作 */}
        <div className="rounded-xl border border-cyber-border bg-cyber-panel/50 p-3">
          <h3 className="text-xs font-mono text-gray-400 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyber-accent" />
            快速操作
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {quickActions.map(action => {
              const Icon = action.icon
              return (
                <button
                  key={action.id}
                  onClick={action.action}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/[0.02] border border-cyber-border/50 hover:border-cyber-accent/30 hover:bg-cyber-accent/5 transition-all group"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-all group-hover:scale-110"
                    style={{
                      background: `${action.color}15`,
                      border: `1px solid ${action.color}30`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: action.color }} />
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">{action.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 今日统计卡片 */}
        <div className="rounded-xl border border-cyber-border bg-cyber-panel/50 p-3">
          <h3 className="text-xs font-mono text-gray-400 mb-3 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyber-accent" />
            今日统计
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <StatCard
              icon={MessageSquare}
              label="消息数"
              value={totalMessages || mockStats.messages}
              change={mockStats.messagesChange}
              color="#00ff88"
            />
            <StatCard
              icon={Layers}
              label="对话数"
              value={conversations.length || mockStats.conversations}
              change={mockStats.conversationsChange}
              color="#00d4ff"
            />
            <StatCard
              icon={Zap}
              label="Token 用量"
              value={mockStats.tokens}
              change={mockStats.tokensChange}
              color="#c084fc"
            />
            <StatCard
              icon={BookOpen}
              label="知识条目"
              value={entries.length || mockStats.knowledgeEntries}
              change={mockStats.knowledgeChange}
              color="#f472b6"
            />
          </div>
        </div>

        {/* 最近对话 */}
        <div className="rounded-xl border border-cyber-border bg-cyber-panel/50 p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyber-accent" />
              最近对话
            </h3>
            <button
              onClick={() => setCurrentPage('chat')}
              className="text-[10px] text-cyber-accent font-mono hover:underline"
            >
              查看全部
            </button>
          </div>
          <div className="space-y-1.5">
            {(conversations.slice(0, 5).length > 0 ? conversations.slice(0, 5) : mockRecentConversations).map((conv, idx) => (
              <div
                key={conv.id}
                onClick={() => {
                  if ('messageCount' in conv) {
                    handleNewChat()
                  } else {
                    setCurrentPage('chat')
                  }
                }}
                className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.02] border border-cyber-border/50 hover:border-cyber-accent/30 hover:bg-cyber-accent/5 transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-cyber-accent/10 border border-cyber-accent/20 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-4 h-4 text-cyber-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm text-cyber-text truncate">{conv.title}</h4>
                    <span className="text-[10px] text-gray-600 font-mono flex-shrink-0">
                      {'time' in conv ? conv.time : new Date(conv.updatedAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {'lastMessage' in conv ? conv.lastMessage : conv.messages[conv.messages.length - 1]?.content || '暂无消息'}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* 常用 Agent */}
        <div className="rounded-xl border border-cyber-border bg-cyber-panel/50 p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-cyber-accent" />
              常用 Agent
            </h3>
            <button
              onClick={() => setCurrentPage('agents')}
              className="text-[10px] text-cyber-accent font-mono hover:underline"
            >
              全部 Agent
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {commonlyUsedAgents.map(agent => (
              <button
                key={agent.id}
                onClick={() => handleAgentChat(agent.id)}
                className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.02] border border-cyber-border/50 hover:border-cyber-accent/30 hover:bg-cyber-accent/5 transition-all text-left"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${agent.color}20, ${agent.color}10)`,
                    border: `1px solid ${agent.color}30`,
                  }}
                >
                  {agent.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-medium text-cyber-text truncate">{agent.name}</h4>
                  <p className="text-[10px] text-gray-500 truncate">{agent.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 系统状态 */}
        <div className="rounded-xl border border-cyber-border bg-cyber-panel/50 p-3">
          <h3 className="text-xs font-mono text-gray-400 mb-3 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyber-accent" />
            系统状态
          </h3>
          <div className="space-y-2.5">
            <StatusRow
              icon={Wifi}
              label="后端连接"
              status={systemStatus.backend === 'online' ? '在线' : '离线'}
              statusType="success"
            />
            <StatusRow
              icon={Zap}
              label="模型状态"
              status={systemStatus.model === 'healthy' ? '正常' : '异常'}
              statusType="success"
            />
            <StatusRow
              icon={Activity}
              label="缓存命中率"
              status={`${systemStatus.cacheHit}%`}
              statusType="success"
              progress={systemStatus.cacheHit}
            />
            <StatusRow
              icon={HardDrive}
              label="存储用量"
              status={`${systemStatus.storage}GB / ${systemStatus.storageTotal}GB`}
              statusType="warning"
              progress={(systemStatus.storage / systemStatus.storageTotal) * 100}
            />
          </div>
        </div>

        {/* 活动时间线 */}
        <div className="rounded-xl border border-cyber-border bg-cyber-panel/50 p-3">
          <h3 className="text-xs font-mono text-gray-400 mb-3 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyber-accent" />
            活动时间线
          </h3>
          <div className="relative">
            <div className="absolute left-[11px] top-1 bottom-1 w-px bg-cyber-border" />
            <div className="space-y-3">
              {mockTimeline.map((item, idx) => (
                <TimelineItem key={item.id} item={item} isLast={idx === mockTimeline.length - 1} />
              ))}
            </div>
          </div>
        </div>

        {/* 快捷命令 */}
        <div className="rounded-xl border border-cyber-border bg-cyber-panel/50 p-3">
          <h3 className="text-xs font-mono text-gray-400 mb-3 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyber-accent" />
            快捷命令
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {mockQuickCommands.map(cmd => (
              <button
                key={cmd.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-cyber-border/50 hover:border-cyber-accent/30 hover:bg-cyber-accent/5 transition-all text-left"
              >
                <code className="text-[11px] text-cyber-accent font-mono bg-cyber-accent/10 px-1.5 py-0.5 rounded">
                  {cmd.cmd}
                </code>
                <span className="text-[11px] text-gray-400 truncate">{cmd.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="h-4" />
      </div>
    </div>
  )
}

// 统计卡片组件
function StatCard({ icon: Icon, label, value, change, color }: {
  icon: any
  label: string
  value: number
  change: number
  color: string
}) {
  const isPositive = change >= 0

  return (
    <div className="bg-white/[0.02] border border-cyber-border/50 rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: `${color}15`,
            border: `1px solid ${color}30`,
          }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <div className={cn(
          'flex items-center gap-0.5 text-[10px] font-mono',
          isPositive ? 'text-green-400' : 'text-red-400'
        )}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(change)}%
        </div>
      </div>
      <p className="text-lg font-bold font-mono" style={{ color }}>{value.toLocaleString()}</p>
      <p className="text-[10px] text-gray-500 font-mono mt-0.5">{label}</p>
    </div>
  )
}

// 状态行组件
function StatusRow({ icon: Icon, label, status, statusType, progress }: {
  icon: any
  label: string
  status: string
  statusType: 'success' | 'warning' | 'error'
  progress?: number
}) {
  const statusColors = {
    success: 'text-green-400 bg-green-400/10 border-green-400/30',
    warning: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    error: 'text-red-400 bg-red-400/10 border-red-400/30',
  }

  const progressColors = {
    success: 'bg-green-400',
    warning: 'bg-yellow-400',
    error: 'bg-red-400',
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-gray-500" />
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {progress !== undefined && (
          <div className="w-16 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full', progressColors[statusType])}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
        <span className={cn(
          'text-[10px] font-mono px-2 py-0.5 rounded border',
          statusColors[statusType]
        )}>
          {status}
        </span>
      </div>
    </div>
  )
}

// 时间线项目组件
function TimelineItem({ item, isLast }: {
  item: { id: string; type: string; title: string; description: string; time: string }
  isLast: boolean
}) {
  const typeConfig: Record<string, { icon: any; color: string }> = {
    message: { icon: MessageSquare, color: '#00ff88' },
    knowledge: { icon: BookOpen, color: '#00d4ff' },
    agent: { icon: Brain, color: '#c084fc' },
    system: { icon: Cpu, color: '#f472b6' },
  }

  const config = typeConfig[item.type] || typeConfig.system
  const Icon = config.icon

  return (
    <div className="relative flex gap-3 pl-6">
      <div
        className="absolute left-0 top-0.5 w-[22px] h-[22px] rounded-full flex items-center justify-center"
        style={{
          background: `${config.color}20`,
          border: `2px solid ${config.color}40`,
        }}
      >
        <Icon className="w-3 h-3" style={{ color: config.color }} />
      </div>
      <div className="flex-1 pb-1">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-medium text-cyber-text">{item.title}</h4>
          <span className="text-[10px] text-gray-600 font-mono flex-shrink-0 ml-2">{item.time}</span>
        </div>
        <p className="text-[11px] text-gray-500 mt-0.5">{item.description}</p>
      </div>
    </div>
  )
}
