import { useState } from 'react'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Layers,
  Zap,
  Users,
  Clock,
  Wrench,
  Download,
  Calendar,
  Filter,
  ChevronDown,
  Bot,
  FileJson,
  FileSpreadsheet,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// 时间范围选项
const timeRanges = [
  { id: 'today', label: '今天' },
  { id: 'week', label: '本周' },
  { id: 'month', label: '本月' },
  { id: 'quarter', label: '本季度' },
  { id: 'year', label: '本年' },
  { id: 'custom', label: '自定义' },
]

// 核心指标数据
const coreMetrics = {
  totalMessages: { value: 128456, change: 12.5, label: '总消息数', icon: MessageSquare, color: '#00ff88' },
  totalConversations: { value: 3842, change: 8.3, label: '总对话数', icon: Layers, color: '#00d4ff' },
  totalTokens: { value: 2847650, change: 15.2, label: '总 Token 用量', icon: Zap, color: '#c084fc' },
  activeUsers: { value: 1256, change: 5.8, label: '活跃用户数', icon: Users, color: '#f472b6' },
  avgResponseTime: { value: 2.3, change: -3.2, label: '平均响应时长(s)', icon: Clock, color: '#fbbf24' },
  toolCalls: { value: 18934, change: 22.1, label: '工具调用次数', icon: Wrench, color: '#34d399' },
}

// 消息量趋势数据（7天）
const messageTrend7d = [
  { day: '周一', value: 1200 },
  { day: '周二', value: 1500 },
  { day: '周三', value: 1800 },
  { day: '周四', value: 1650 },
  { day: '周五', value: 2100 },
  { day: '周六', value: 900 },
  { day: '周日', value: 800 },
]

// 消息量趋势数据（30天）
const messageTrend30d = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}日`,
  value: Math.floor(Math.random() * 2000) + 800,
}))

// Token 用量趋势
const tokenTrend = [
  { day: '周一', value: 45000 },
  { day: '周二', value: 52000 },
  { day: '周三', value: 61000 },
  { day: '周四', value: 58000 },
  { day: '周五', value: 72000 },
  { day: '周六', value: 32000 },
  { day: '周日', value: 28000 },
]

// 活跃用户趋势
const userTrend = [
  { day: '周一', value: 450 },
  { day: '周二', value: 520 },
  { day: '周三', value: 610 },
  { day: '周四', value: 580 },
  { day: '周五', value: 720 },
  { day: '周六', value: 320 },
  { day: '周日', value: 280 },
]

// Agent 使用排行 Top 10
const agentUsageRank = [
  { name: '代码架构师', count: 3421, color: '#00ff88' },
  { name: '产品经理', count: 2890, color: '#00d4ff' },
  { name: '数据工程师', count: 2456, color: '#c084fc' },
  { name: '语言专家', count: 2100, color: '#f472b6' },
  { name: '办公助手', count: 1890, color: '#fbbf24' },
  { name: '创意设计师', count: 1567, color: '#34d399' },
  { name: '测试工程师', count: 1234, color: '#f87171' },
  { name: '运维专家', count: 987, color: '#60a5fa' },
  { name: '营销顾问', count: 876, color: '#a78bfa' },
  { name: '法务助手', count: 654, color: '#fb923c' },
]

// 工具调用统计
const toolStats = [
  { name: 'Web 搜索', calls: 4521, success: 96.5 },
  { name: '代码执行', calls: 3890, success: 92.3 },
  { name: '文件操作', calls: 2678, success: 98.1 },
  { name: '知识库检索', calls: 2345, success: 97.8 },
  { name: '数据处理', calls: 1987, success: 94.2 },
  { name: '图片生成', calls: 1567, success: 89.5 },
  { name: '邮件发送', calls: 1234, success: 99.1 },
  { name: 'API 调用', calls: 987, success: 91.6 },
]

// 对话分布数据
const conversationDistribution = [
  { name: '编程开发', value: 35, color: '#00ff88' },
  { name: '创意写作', value: 20, color: '#00d4ff' },
  { name: '数据分析', value: 15, color: '#c084fc' },
  { name: '知识问答', value: 12, color: '#f472b6' },
  { name: '办公辅助', value: 10, color: '#fbbf24' },
  { name: '其他', value: 8, color: '#6b7280' },
]

// 热门关键词
const hotKeywords = [
  { word: 'React', weight: 100 },
  { word: 'TypeScript', weight: 90 },
  { word: 'Python', weight: 85 },
  { word: 'AI', weight: 95 },
  { word: '前端', weight: 75 },
  { word: '后端', weight: 65 },
  { word: '数据库', weight: 70 },
  { word: '性能优化', weight: 60 },
  { word: '架构设计', weight: 80 },
  { word: '微服务', weight: 55 },
  { word: 'Docker', weight: 50 },
  { word: 'Kubernetes', weight: 45 },
  { word: '机器学习', weight: 88 },
  { word: '深度学习', weight: 72 },
  { word: '大模型', weight: 92 },
  { word: 'RAG', weight: 68 },
  { word: 'Agent', weight: 78 },
  { word: '自动化', weight: 58 },
  { word: '测试', weight: 52 },
  { word: '部署', weight: 48 },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('week')
  const [trendPeriod, setTrendPeriod] = useState<'7d' | '30d'>('7d')
  const [showExportMenu, setShowExportMenu] = useState(false)

  const messageTrend = trendPeriod === '7d' ? messageTrend7d : messageTrend30d
  const maxMessageValue = Math.max(...messageTrend.map(d => d.value))
  const maxTokenValue = Math.max(...tokenTrend.map(d => d.value))
  const maxUserValue = Math.max(...userTrend.map(d => d.value))
  const maxAgentCount = Math.max(...agentUsageRank.map(a => a.count))

  // 生成饼图 conic-gradient
  const pieGradient = conversationDistribution.reduce((acc, item, index) => {
    const start = conversationDistribution.slice(0, index).reduce((sum, i) => sum + i.value, 0)
    const end = start + item.value
    return acc + `${item.color} ${start}% ${end}%, `
  }, '').slice(0, -2)

  const handleExport = (format: string) => {
    setShowExportMenu(false)
    alert(`导出 ${format.toUpperCase()} 格式数据（演示功能）`)
  }

  return (
    <div className="h-full flex flex-col">
      {/* 顶部标题栏 */}
      <div className="border-b border-cyber-border bg-cyber-panel/50 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-cyber-text flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyber-accent" />
              数据分析
            </h1>
            <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
              实时监控 · 数据洞察 · 趋势分析
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent text-xs font-mono hover:bg-cyber-accent/20 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              导出数据
              <ChevronDown className="w-3 h-3" />
            </button>
            {showExportMenu && (
              <div className="absolute right-0 top-full mt-1 bg-cyber-panel border border-cyber-border rounded-lg shadow-xl z-20 overflow-hidden min-w-[140px]">
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-white/5 transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-cyber-accent" />
                  导出 CSV
                </button>
                <button
                  onClick={() => handleExport('json')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-white/5 transition-colors"
                >
                  <FileJson className="w-3.5 h-3.5 text-cyber-accent" />
                  导出 JSON
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 时间范围选择 */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
          <Calendar className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
          {timeRanges.map(range => (
            <button
              key={range.id}
              onClick={() => setTimeRange(range.id)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-mono transition-all flex-shrink-0',
                timeRange === range.id
                  ? 'bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/40'
                  : 'bg-white/[0.02] text-gray-400 border border-cyber-border/50 hover:border-cyber-accent/30'
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* 核心指标卡 6 宫格 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(coreMetrics).map(([key, metric]) => {
            const Icon = metric.icon
            const isPositive = metric.change >= 0
            return (
              <div
                key={key}
                className="bg-white/[0.02] border border-cyber-border/50 rounded-xl p-3 hover:border-cyber-accent/30 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: `${metric.color}15`,
                      border: `1px solid ${metric.color}30`,
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color: metric.color }} />
                  </div>
                  <div className={cn(
                    'flex items-center gap-0.5 text-[10px] font-mono',
                    isPositive ? 'text-green-400' : 'text-red-400'
                  )}>
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(metric.change)}%
                  </div>
                </div>
                <p className="text-base font-bold font-mono" style={{ color: metric.color }}>
                  {metric.value.toLocaleString()}
                </p>
                <p className="text-[10px] text-gray-500 font-mono mt-0.5">{metric.label}</p>
              </div>
            )
          })}
        </div>

        {/* 趋势图区 */}
        <div className="space-y-3">
          {/* 消息量趋势 */}
          <div className="rounded-xl border border-cyber-border bg-cyber-panel/50 p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-cyber-accent" />
                消息量趋势
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setTrendPeriod('7d')}
                  className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-mono transition-all',
                    trendPeriod === '7d'
                      ? 'bg-cyber-accent/20 text-cyber-accent'
                      : 'text-gray-500 hover:text-gray-300'
                  )}
                >
                  7天
                </button>
                <button
                  onClick={() => setTrendPeriod('30d')}
                  className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-mono transition-all',
                    trendPeriod === '30d'
                      ? 'bg-cyber-accent/20 text-cyber-accent'
                      : 'text-gray-500 hover:text-gray-300'
                  )}
                >
                  30天
                </button>
              </div>
            </div>
            <div className="h-40 flex items-end gap-1">
              {messageTrend.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col items-center flex-1 justify-end">
                    <div
                      className="w-full rounded-t-sm bg-gradient-to-t from-cyber-accent/20 to-cyber-accent/60 transition-all hover:from-cyber-accent/30 hover:to-cyber-accent/80"
                      style={{ height: `${(item.value / maxMessageValue) * 100}%`, minHeight: '4px' }}
                    />
                  </div>
                  <span className="text-[9px] text-gray-600 font-mono truncate w-full text-center">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Token 用量趋势 + 活跃用户趋势 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Token 用量趋势 */}
            <div className="rounded-xl border border-cyber-border bg-cyber-panel/50 p-3">
              <h3 className="text-xs font-mono text-gray-400 mb-3 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                Token 用量趋势
              </h3>
              <div className="h-28 flex items-end gap-1">
                {tokenTrend.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex-1 flex items-end">
                      <div
                        className="w-full rounded-t-sm bg-gradient-to-t from-purple-500/20 to-purple-400/60"
                        style={{ height: `${(item.value / maxTokenValue) * 100}%`, minHeight: '3px' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-1">
                {tokenTrend.map((item, idx) => (
                  <span key={idx} className="text-[9px] text-gray-600 font-mono">{item.day}</span>
                ))}
              </div>
            </div>

            {/* 活跃用户趋势 */}
            <div className="rounded-xl border border-cyber-border bg-cyber-panel/50 p-3">
              <h3 className="text-xs font-mono text-gray-400 mb-3 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-pink-400" />
                活跃用户趋势
              </h3>
              <div className="h-28 flex items-end gap-1">
                {userTrend.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex-1 flex items-end">
                      <div
                        className="w-full rounded-t-sm bg-gradient-to-t from-pink-500/20 to-pink-400/60"
                        style={{ height: `${(item.value / maxUserValue) * 100}%`, minHeight: '3px' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-1">
                {userTrend.map((item, idx) => (
                  <span key={idx} className="text-[9px] text-gray-600 font-mono">{item.day}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Agent 使用排行 + 工具调用统计 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Agent 使用排行 */}
          <div className="rounded-xl border border-cyber-border bg-cyber-panel/50 p-3">
            <h3 className="text-xs font-mono text-gray-400 mb-3 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-cyber-accent" />
              Agent 使用排行 Top 10
            </h3>
            <div className="space-y-2">
              {agentUsageRank.map((agent, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className={cn(
                    'w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono flex-shrink-0',
                    idx < 3 ? 'bg-cyber-accent/20 text-cyber-accent' : 'bg-gray-800 text-gray-500'
                  )}>
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs text-gray-300 truncate">{agent.name}</span>
                      <span className="text-[10px] text-gray-500 font-mono ml-2">{agent.count}</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(agent.count / maxAgentCount) * 100}%`,
                          background: `linear-gradient(90deg, ${agent.color}60, ${agent.color})`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 工具调用统计 */}
          <div className="rounded-xl border border-cyber-border bg-cyber-panel/50 p-3">
            <h3 className="text-xs font-mono text-gray-400 mb-3 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-cyber-accent" />
              工具调用统计
            </h3>
            <div className="space-y-2">
              {toolStats.map((tool, idx) => (
                <div key={idx} className="flex items-center justify-between py-1.5 border-b border-cyber-border/30 last:border-b-0">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-cyber-accent/10 border border-cyber-accent/20 flex items-center justify-center">
                      <Wrench className="w-3 h-3 text-cyber-accent" />
                    </div>
                    <span className="text-xs text-gray-300">{tool.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-gray-500 font-mono">{tool.calls} 次</span>
                    <span className={cn(
                      'text-[10px] font-mono px-1.5 py-0.5 rounded',
                      tool.success >= 95 ? 'bg-green-500/10 text-green-400' :
                      tool.success >= 90 ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-red-500/10 text-red-400'
                    )}>
                      {tool.success}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 对话分布 + 热门关键词 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* 对话分布饼图 */}
          <div className="rounded-xl border border-cyber-border bg-cyber-panel/50 p-3">
            <h3 className="text-xs font-mono text-gray-400 mb-3 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-cyber-accent" />
              对话分布
            </h3>
            <div className="flex items-center gap-4">
              {/* 饼图 */}
              <div
                className="w-24 h-24 rounded-full flex-shrink-0 relative"
                style={{ background: `conic-gradient(${pieGradient})` }}
              >
                <div className="absolute inset-2 bg-cyber-panel rounded-full flex items-center justify-center">
                  <span className="text-[10px] text-gray-500 font-mono">分类</span>
                </div>
              </div>
              {/* 图例 */}
              <div className="flex-1 space-y-1.5">
                {conversationDistribution.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                      style={{ background: item.color }}
                    />
                    <span className="text-[11px] text-gray-400 flex-1">{item.name}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 热门关键词 */}
          <div className="rounded-xl border border-cyber-border bg-cyber-panel/50 p-3">
            <h3 className="text-xs font-mono text-gray-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyber-accent" />
              热门关键词
            </h3>
            <div className="flex flex-wrap gap-2 items-center justify-center py-2">
              {hotKeywords.map((kw, idx) => {
                const fontSize = 10 + (kw.weight / 100) * 14
                const colors = ['#00ff88', '#00d4ff', '#c084fc', '#f472b6', '#fbbf24', '#34d399']
                const color = colors[idx % colors.length]
                return (
                  <span
                    key={idx}
                    className="font-mono cursor-pointer hover:opacity-80 transition-opacity"
                    style={{
                      fontSize: `${fontSize}px`,
                      color: color,
                      opacity: 0.6 + (kw.weight / 100) * 0.4,
                    }}
                  >
                    {kw.word}
                  </span>
                )
              })}
            </div>
          </div>
        </div>

        <div className="h-4" />
      </div>
    </div>
  )
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  )
}
