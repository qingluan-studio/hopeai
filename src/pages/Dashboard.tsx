import React, { useState, useRef, useEffect } from 'react'
import { Send, Crown, Search, Code2, Shield, Rocket, Package, Sparkles, ChevronLeft, MoreVertical, Users, Zap, Cpu, Palette, ClipboardList, FlaskConical, FileText, Users2, Landmark, Megaphone, Headphones, ShieldAlert, Scale, Settings2, Bot, Lightbulb, BookOpen, Wrench, FileCode, Calculator, FileJson, FileSearch, FileEdit, FolderOpen, Braces, Hash } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useChatStore } from '@/store/useChatStore'
import { useAgentStore } from '@/store/useAgentStore'
import { useKnowledgeStore } from '@/store/useKnowledgeStore'
import { useThemeStore } from '@/store/useThemeStore'
import { WorkflowEngine, type WorkflowProgress } from '@/engine/workflowEngine'
import { toolEngine, type ToolDefinition } from '@/tools/toolEngine'
import { templateStore, type Template } from '@/engine/templateStore'

const roleConfig: Record<string, { name: string; color: string; bg: string; border: string; icon: any }> = {
  user: { name: '董事长', color: 'text-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-700/50', icon: Crown },
  chairman: { name: '董事长', color: 'text-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-700/50', icon: Crown },
  system: { name: '系统', color: 'text-gray-400', bg: 'bg-gray-900/60', border: 'border-gray-700/50', icon: Zap },
  cto: { name: '技术总监', color: 'text-amber-400', bg: 'bg-amber-900/30', border: 'border-amber-700/50', icon: Cpu },
  pm: { name: '产品经理', color: 'text-sky-400', bg: 'bg-sky-900/30', border: 'border-sky-700/50', icon: ClipboardList },
  analyst: { name: '分析员', color: 'text-blue-400', bg: 'bg-blue-900/30', border: 'border-blue-700/50', icon: Search },
  'ux-designer': { name: 'UX设计师', color: 'text-pink-400', bg: 'bg-pink-900/30', border: 'border-pink-700/50', icon: Palette },
  'ui-designer': { name: 'UI设计师', color: 'text-rose-400', bg: 'bg-rose-900/30', border: 'border-rose-700/50', icon: Palette },
  arch: { name: '架构师', color: 'text-violet-400', bg: 'bg-violet-900/30', border: 'border-violet-700/50', icon: Lightbulb },
  'tech-lead': { name: '技术主管', color: 'text-indigo-400', bg: 'bg-indigo-900/30', border: 'border-indigo-700/50', icon: Code2 },
  'coder-1': { name: '代码员小绿', color: 'text-green-400', bg: 'bg-green-900/30', border: 'border-green-700/50', icon: Code2 },
  'coder-2': { name: '代码员小蓝', color: 'text-cyan-400', bg: 'bg-cyan-900/30', border: 'border-cyan-700/50', icon: Code2 },
  'coder-3': { name: '代码员小紫', color: 'text-purple-400', bg: 'bg-purple-900/30', border: 'border-purple-700/50', icon: Code2 },
  'coder-4': { name: '代码员小青', color: 'text-teal-400', bg: 'bg-teal-900/30', border: 'border-teal-700/50', icon: Code2 },
  'coder-5': { name: '代码员小橙', color: 'text-orange-400', bg: 'bg-orange-900/30', border: 'border-orange-700/50', icon: Code2 },
  devops: { name: '运维工程师', color: 'text-lime-400', bg: 'bg-lime-900/30', border: 'border-lime-700/50', icon: Settings2 },
  'inspector-1': { name: '检查员甲', color: 'text-pink-400', bg: 'bg-pink-900/30', border: 'border-pink-700/50', icon: Shield },
  'inspector-2': { name: '检查员乙', color: 'text-red-400', bg: 'bg-red-900/30', border: 'border-red-700/50', icon: Shield },
  'qa-lead': { name: '测试主管', color: 'text-fuchsia-400', bg: 'bg-fuchsia-900/30', border: 'border-fuchsia-700/50', icon: FlaskConical },
  expander: { name: '扩展员', color: 'text-indigo-400', bg: 'bg-indigo-900/30', border: 'border-indigo-700/50', icon: Sparkles },
  researcher: { name: '研究员', color: 'text-purple-400', bg: 'bg-purple-900/30', border: 'border-purple-700/50', icon: Lightbulb },
  'data-scientist': { name: '数据科学家', color: 'text-violet-400', bg: 'bg-violet-900/30', border: 'border-violet-700/50', icon: Bot },
  packer: { name: '打包员', color: 'text-amber-400', bg: 'bg-amber-900/30', border: 'border-amber-700/50', icon: Package },
  deliverer: { name: '输送员', color: 'text-emerald-400', bg: 'bg-emerald-900/30', border: 'border-emerald-700/50', icon: Rocket },
  'doc-writer': { name: '文档工程师', color: 'text-slate-400', bg: 'bg-slate-900/30', border: 'border-slate-700/50', icon: FileText },
  hr: { name: '人事专员', color: 'text-rose-400', bg: 'bg-rose-900/30', border: 'border-rose-700/50', icon: Users2 },
  finance: { name: '财务专员', color: 'text-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-700/50', icon: Landmark },
  marketing: { name: '市场专员', color: 'text-orange-400', bg: 'bg-orange-900/30', border: 'border-orange-700/50', icon: Megaphone },
  'customer-service': { name: '客服专员', color: 'text-sky-400', bg: 'bg-sky-900/30', border: 'border-sky-700/50', icon: Headphones },
  security: { name: '安全工程师', color: 'text-red-400', bg: 'bg-red-900/30', border: 'border-red-700/50', icon: ShieldAlert },
  legal: { name: '法务顾问', color: 'text-blue-400', bg: 'bg-blue-900/30', border: 'border-blue-700/50', icon: Scale },
  'sys-admin': { name: '系统管理员', color: 'text-gray-400', bg: 'bg-gray-900/60', border: 'border-gray-700/50', icon: Settings2 },
}

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  idle: { label: '空闲', color: 'text-gray-500', dot: 'bg-gray-600' },
  thinking: { label: '思考中', color: 'text-yellow-400', dot: 'bg-yellow-500 animate-pulse' },
  working: { label: '工作中', color: 'text-green-400', dot: 'bg-green-500 animate-pulse' },
  done: { label: '已完成', color: 'text-blue-400', dot: 'bg-blue-500' },
  error: { label: '错误', color: 'text-red-400', dot: 'bg-red-500' },
}

// 手机版消息气泡
function MobileMessage({ message }: { message: any }) {
  const role = message.role || 'system'
  const config = roleConfig[role] || roleConfig.system
  const isUser = role === 'user'
  const Icon = config.icon

  return (
    <div className={cn('flex gap-2 px-3 py-2', isUser && 'flex-row-reverse')}>
      {/* 头像 */}
      <div className={cn(
        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border',
        config.bg, config.border
      )}>
        <Icon className={cn('w-4 h-4', config.color)} />
      </div>

      {/* 消息内容 */}
      <div className={cn('flex-1 min-w-0 max-w-[78%]', isUser && 'flex flex-col items-end')}>
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className={cn('text-[11px] font-mono', config.color)}>{config.name}</span>
          <span className="text-[9px] font-mono text-gray-600">
            {new Date(message.timestamp).toLocaleTimeString('zh-CN', { hour12: false })}
          </span>
        </div>
        <div className={cn(
          'rounded-xl px-3 py-2 text-[13px] leading-relaxed break-words',
          isUser
            ? 'bg-yellow-900/30 border border-yellow-700/40 text-yellow-100'
            : cn(config.bg, config.border, 'text-gray-100 border')
        )}>
          <MessageContent content={message.content} />
        </div>
      </div>
    </div>
  )
}

// 消息内容渲染（支持简单markdown）
function MessageContent({ content }: { content: string }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const parts = content.split(/(```[\s\S]*?```)/g)

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 1500)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 1500)
    }
  }

  return (
    <div className="whitespace-pre-wrap">
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const code = part.replace(/^```\w*\n?/, '').replace(/```$/, '')
          return (
            <div key={i} className="my-1.5 relative group">
              <pre className="my-0 p-3 bg-gray-950/90 border border-gray-800 rounded-xl overflow-x-auto text-[11px] font-mono text-green-300">
                <code>{code}</code>
              </pre>
              <button
                onClick={() => handleCopy(code, i)}
                className={cn(
                  'absolute top-2 right-2 p-1.5 rounded-lg bg-gray-800/80 hover:bg-gray-700/80 transition-all',
                  copiedIndex === i 
                    ? 'opacity-100 text-green-400 bg-green-900/30' 
                    : 'opacity-0 group-hover:opacity-100 text-gray-400 hover:text-green-400'
                )}
              >
                {copiedIndex === i ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </div>
  )
}

// 打字指示器
function TypingIndicator() {
  return (
    <div className="flex gap-2 px-3 py-2">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-800/60 border border-gray-700/50 flex items-center justify-center">
        <div className="flex gap-0.5">
          <span className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
      <div className="flex items-center px-3 py-2 rounded-xl bg-gray-900/60 border border-gray-800 text-[12px] text-gray-400">
        团队正在协作处理...
      </div>
    </div>
  )
}

// 团队成员卡片
function TeamMemberCard({ agent }: { agent: any }) {
  const config = roleConfig[agent.id] || roleConfig.system
  const status = statusConfig[agent.status] || statusConfig.idle
  const Icon = config.icon

  return (
    <div className={cn(
      'p-3 rounded-xl border transition-all',
      agent.status === 'idle' ? 'bg-gray-900/40 border-gray-800' : cn(config.bg, config.border)
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          'relative w-10 h-10 rounded-full flex items-center justify-center border flex-shrink-0',
          config.bg, config.border
        )}>
          <Icon className={cn('w-5 h-5', config.color)} />
          {agent.status !== 'idle' && (
            <div className={cn('absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-950', status.dot)} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className={cn('text-sm font-mono', config.color)}>{agent.name}</span>
            <span className={cn('text-[10px] font-mono', status.color)}>{status.label}</span>
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5 truncate">
            {agent.currentTask || '待命中...'}
          </div>
          {agent.status !== 'idle' && (
            <div className="mt-1.5 h-1 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={cn('h-full transition-all duration-500', config.color.replace('text-', 'bg-'))}
                style={{ width: `${agent.progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// 团队页面
function TeamView() {
  const { agents } = useAgentStore()
  const activeCount = agents.filter(a => a.status === 'working' || a.status === 'thinking').length
  const doneCount = agents.filter(a => a.status === 'done').length

  const departments = [
    { name: '决策层', color: 'text-yellow-400' },
    { name: '产品部', color: 'text-sky-400' },
    { name: '设计部', color: 'text-pink-400' },
    { name: '技术部', color: 'text-green-400' },
    { name: '质量部', color: 'text-fuchsia-400' },
    { name: '研发部', color: 'text-purple-400' },
    { name: '运维部', color: 'text-lime-400' },
    { name: '战略部', color: 'text-indigo-400' },
    { name: '文档部', color: 'text-slate-400' },
    { name: '人事部', color: 'text-rose-400' },
    { name: '财务部', color: 'text-amber-400' },
    { name: '市场部', color: 'text-orange-400' },
    { name: '客服部', color: 'text-cyan-400' },
    { name: '安全部', color: 'text-red-400' },
    { name: '法务部', color: 'text-blue-400' },
  ]

  return (
    <div className="min-h-full flex flex-col">
      {/* 顶部标题 */}
      <div className="sticky top-0 z-20 bg-gray-950/90 backdrop-blur-md border-b border-green-900/30 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <h1 className="text-base font-mono font-bold text-blue-400" style={{ textShadow: '0 0 8px rgba(59,130,246,0.5)' }}>
              团队
            </h1>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span className="text-green-400">{activeCount} 活跃</span>
            <span className="text-gray-600">|</span>
            <span className="text-blue-400">{doneCount} 完成</span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-500">共 {agents.length}人</span>
          </div>
        </div>
      </div>

      {/* 成员列表 - 按部门分组 */}
      <div className="flex-1 p-3 space-y-4 max-w-md mx-auto w-full pb-20">
        {departments.map(dept => {
          const deptAgents = agents.filter(a => a.department === dept.name)
          if (deptAgents.length === 0) return null
          return (
            <div key={dept.name}>
              <div className={cn('text-[11px] font-mono px-1 mb-2 tracking-wider flex items-center gap-2', dept.color)}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'currentColor' }} />
                {dept.name}
                <span className="text-gray-600 text-[10px]">({deptAgents.length}人)</span>
              </div>
              <div className="space-y-2">
                {deptAgents.map(agent => (
                  <TeamMemberCard key={agent.id} agent={agent} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// 数据看板首页
function DashboardView() {
  const { agents } = useAgentStore()
  const { entries } = useKnowledgeStore()
  const { messages } = useChatStore()

  const totalAgents = agents.length
  const activeAgents = agents.filter(a => a.status === 'working' || a.status === 'thinking').length
  const doneAgents = agents.filter(a => a.status === 'done').length
  const departments = [...new Set(agents.map(a => a.department).filter(Boolean))]

  const tools = toolEngine.getAllTools()
  const templates = templateStore.getAll()
  
  const stats = [
    { label: '团队成员', value: totalAgents, unit: '人', color: 'text-green-400', bg: 'bg-green-900/20', border: 'border-green-800/40' },
    { label: '活跃中', value: activeAgents, unit: '人', color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-800/40' },
    { label: '知识库', value: entries.length, unit: '条', color: 'text-purple-400', bg: 'bg-purple-900/20', border: 'border-purple-800/40' },
    { label: '部门数', value: departments.length, unit: '个', color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-800/40' },
    { label: '工具数', value: tools.length, unit: '个', color: 'text-cyan-400', bg: 'bg-cyan-900/20', border: 'border-cyan-800/40' },
    { label: '模板数', value: templates.length, unit: '个', color: 'text-orange-400', bg: 'bg-orange-900/20', border: 'border-orange-800/40' },
  ]

  const quickActions = [
    { label: '下达指令', icon: Send, color: 'text-green-400', action: 'chat' },
    { label: '查看团队', icon: Users, color: 'text-blue-400', action: 'team' },
    { label: '知识库', icon: BookOpen, color: 'text-purple-400', action: 'knowledge' },
    { label: '部署上线', icon: Rocket, color: 'text-orange-400', action: 'deploy' },
  ]

  return (
    <div className="min-h-full flex flex-col pb-20">
      {/* 顶部标题栏 */}
      <div className="sticky top-0 z-20 bg-gray-950/90 backdrop-blur-md border-b border-green-900/30 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-900/30 border border-green-700/50 flex items-center justify-center">
              <Crown className="w-4.5 h-4.5 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-sm font-mono font-bold text-green-400" style={{ textShadow: '0 0 8px rgba(34,197,94,0.5)' }}>
                HOPEAI
              </h1>
              <p className="text-[9px] font-mono text-gray-500 -mt-0.5">清鸢AI公司 · 控制中心</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono text-green-400">系统运行中</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-3 space-y-4 max-w-md mx-auto w-full">
        {/* 欢迎语 */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-green-900/30 via-gray-900/50 to-blue-900/20 border border-green-800/40">
          <p className="text-[11px] font-mono text-gray-400 mb-1">董事长，您好</p>
          <p className="text-base font-mono text-green-400" style={{ textShadow: '0 0 8px rgba(34,197,94,0.3)' }}>
            欢迎来到清鸢AI公司
          </p>
          <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
            {totalAgents}名员工随时待命，{departments.length}个部门高效运转。
            下达您的指令，团队将自动协作完成任务。
          </p>
        </div>

        {/* 数据统计卡片 */}
        <div>
          <div className="text-[11px] font-mono text-gray-400 px-1 mb-2 flex items-center gap-2">
            <span className="w-1 h-1 bg-green-400 rounded-full" />
            公司数据
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {stats.map(stat => (
              <div key={stat.label} className={cn(
                'p-3 rounded-xl border transition-all',
                stat.bg, stat.border
              )}>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={cn('text-xl font-mono font-bold', stat.color)}>{stat.value}</span>
                  <span className="text-[10px] text-gray-500">{stat.unit}</span>
                </div>
                <div className="text-[10px] text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 工具面板 */}
        <div>
          <div className="text-[11px] font-mono text-gray-400 px-1 mb-2 flex items-center gap-2">
            <Wrench className="w-3 h-3" />
            可用工具
          </div>
          <div className="grid grid-cols-4 gap-2">
            {tools.slice(0, 8).map(tool => {
              const toolIcon = getToolIcon(tool.category)
              return (
                <button
                  key={tool.id}
                  className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-gray-900/60 border border-gray-800 hover:border-cyan-700/50 transition-all active:scale-95"
                  title={tool.description}
                >
                  <div className="p-1.5 rounded-lg bg-cyan-900/30 text-cyan-400">
                    {React.createElement(toolIcon, { className: 'w-4 h-4' })}
                  </div>
                  <span className="text-[9px] font-mono text-gray-400 text-center line-clamp-1">{tool.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 模板面板 */}
        <div>
          <div className="text-[11px] font-mono text-gray-400 px-1 mb-2 flex items-center gap-2">
            <FileCode className="w-3 h-3" />
            代码模板
          </div>
          <div className="space-y-1.5">
            {templates.slice(0, 4).map(template => (
              <div 
                key={template.id} 
                className="p-2.5 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-orange-700/40 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono text-gray-300">{template.name}</span>
                  <span className="text-[9px] text-gray-500 px-1.5 py-0.5 rounded bg-gray-800/50">{template.category}</span>
                </div>
                <div className="text-[10px] text-gray-500 truncate">{template.description}</div>
                <div className="flex gap-1 mt-1.5">
                  {template.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[9px] text-gray-500">#{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 快捷操作 */}
        <div>
          <div className="text-[11px] font-mono text-gray-400 px-1 mb-2 flex items-center gap-2">
            <span className="w-1 h-1 bg-yellow-400 rounded-full" />
            快捷操作
          </div>
          <div className="grid grid-cols-4 gap-2">
            {quickActions.map(action => {
              const Icon = action.icon
              return (
                <button
                  key={action.label}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gray-900/60 border border-gray-800 hover:border-gray-700 transition-all active:scale-95"
                >
                  <div className={cn('p-2 rounded-lg bg-gray-800/50', action.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-gray-400">{action.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 部门概览 */}
        <div>
          <div className="text-[11px] font-mono text-gray-400 px-1 mb-2 flex items-center gap-2">
            <span className="w-1 h-1 bg-blue-400 rounded-full" />
            部门概览
          </div>
          <div className="space-y-2">
            {departments.slice(0, 6).map(dept => {
              const deptAgents = agents.filter(a => a.department === dept)
              const deptActive = deptAgents.filter(a => a.status === 'working' || a.status === 'thinking').length
              const deptPercent = Math.round((deptActive / deptAgents.length) * 100)
              return (
                <div key={dept} className="p-3 rounded-xl bg-gray-900/50 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-mono text-gray-300">{dept}</span>
                    <span className="text-[10px] text-gray-500">{deptAgents.length}人</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-500"
                      style={{ width: `${deptPercent}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 最近动态 */}
        {messages.length > 0 && (
          <div>
            <div className="text-[11px] font-mono text-gray-400 px-1 mb-2 flex items-center gap-2">
              <span className="w-1 h-1 bg-purple-400 rounded-full" />
              最近动态
            </div>
            <div className="p-3 rounded-xl bg-gray-900/50 border border-gray-800">
              <p className="text-[11px] text-gray-400 line-clamp-2">
                {messages[messages.length - 1]?.content?.slice(0, 80) || '暂无消息'}...
              </p>
              <div className="mt-2 text-[10px] text-gray-500 font-mono">
                {new Date(messages[messages.length - 1]?.timestamp || Date.now()).toLocaleString('zh-CN')}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// 迷你数据看板（聊天页内使用）
function DashboardMiniView({ onStartChat }: { onStartChat: () => void }) {
  const { agents } = useAgentStore()
  const { entries } = useKnowledgeStore()
  const { messages } = useChatStore()

  const totalAgents = agents.length
  const activeAgents = agents.filter(a => a.status === 'working' || a.status === 'thinking').length
  const departments = [...new Set(agents.map(a => a.department).filter(Boolean))]

  const stats = [
    { label: '团队成员', value: totalAgents, unit: '人', color: 'text-green-400', bg: 'bg-green-900/20', border: 'border-green-800/40' },
    { label: '活跃中', value: activeAgents, unit: '人', color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-800/40' },
    { label: '知识库', value: entries.length, unit: '条', color: 'text-purple-400', bg: 'bg-purple-900/20', border: 'border-purple-800/40' },
    { label: '部门数', value: departments.length, unit: '个', color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-800/40' },
  ]

  return (
    <div className="flex-1 overflow-y-auto py-2">
      <div className="p-3 space-y-3 max-w-md mx-auto w-full">
        {/* 欢迎语 */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-green-900/30 via-gray-900/50 to-blue-900/20 border border-green-800/40">
          <p className="text-[11px] font-mono text-gray-400 mb-1">董事长，您好</p>
          <p className="text-base font-mono text-green-400" style={{ textShadow: '0 0 8px rgba(34,197,94,0.3)' }}>
            欢迎来到清鸢AI公司
          </p>
          <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
            {totalAgents}名员工随时待命，{departments.length}个部门高效运转。
          </p>
          <button
            onClick={onStartChat}
            className="mt-3 w-full py-2 rounded-xl bg-green-900/40 border border-green-700/50 text-green-400 text-[12px] font-mono hover:bg-green-900/60 transition-all"
          >
            → 下达新指令
          </button>
        </div>

        {/* 数据统计 */}
        <div className="grid grid-cols-2 gap-2">
          {stats.map(stat => (
            <div key={stat.label} className={cn('p-3 rounded-xl border', stat.bg, stat.border)}>
              <div className="flex items-baseline gap-1 mb-0.5">
                <span className={cn('text-xl font-mono font-bold', stat.color)}>{stat.value}</span>
                <span className="text-[10px] text-gray-500">{stat.unit}</span>
              </div>
              <div className="text-[10px] text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 部门概览 */}
        <div>
          <div className="text-[11px] font-mono text-gray-400 px-1 mb-2 flex items-center gap-2">
            <span className="w-1 h-1 bg-blue-400 rounded-full" />
            部门概览
          </div>
          <div className="space-y-1.5">
            {departments.slice(0, 8).map(dept => {
              const deptAgents = agents.filter(a => a.department === dept)
              const deptActive = deptAgents.filter(a => a.status === 'working' || a.status === 'thinking').length
              const deptPercent = deptAgents.length > 0 ? Math.round((deptActive / deptAgents.length) * 100) : 0
              return (
                <div key={dept} className="p-2.5 rounded-xl bg-gray-900/50 border border-gray-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono text-gray-300">{dept}</span>
                    <span className="text-[10px] text-gray-500">{deptAgents.length}人</span>
                  </div>
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-500"
                      style={{ width: `${deptPercent}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 最近动态 */}
        {messages.length > 0 && (
          <div>
            <div className="text-[11px] font-mono text-gray-400 px-1 mb-2 flex items-center gap-2">
              <span className="w-1 h-1 bg-purple-400 rounded-full" />
              最近动态
            </div>
            <div className="p-3 rounded-xl bg-gray-900/50 border border-gray-800">
              <p className="text-[11px] text-gray-400 line-clamp-2">
                {messages[messages.length - 1]?.content?.slice(0, 60)}...
              </p>
              <div className="mt-1.5 text-[10px] text-gray-500 font-mono">
                {new Date(messages[messages.length - 1]?.timestamp || Date.now()).toLocaleString('zh-CN')}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// 聊天主页
function ChatView() {
  const { messages, isStreaming, addMessage, setStreaming } = useChatStore()
  const { resetAllAgents, updateAgentStatus, setAgentProgress } = useAgentStore()
  const { workflowSpeed } = useThemeStore()
  const { addEntry } = useKnowledgeStore()
  const [input, setInput] = useState('')
  const [phase, setPhase] = useState<string>('idle')
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat'>('dashboard')
  const scrollRef = useRef<HTMLDivElement>(null)
  const workflowEngineRef = useRef<WorkflowEngine | null>(null)
  const processedAgentsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isStreaming])

  useEffect(() => {
    workflowEngineRef.current = new WorkflowEngine({ speedFactor: workflowSpeed })
  }, [workflowSpeed])

  const agentIdToStoreId: Record<string, string> = {
    analyst: 'analyst',
    'coder-a': 'coder-1',
    'coder-b': 'coder-2',
    'coder-c': 'coder-3',
    'coder-d': 'coder-4',
    'coder-e': 'coder-5',
    reviewer: 'inspector-1',
    'bug-detector': 'inspector-2',
    extender: 'expander',
    packager: 'packer',
    deployer: 'deliverer',
    'knowledge-manager': 'doc-writer',
  }

  const handleSend = async () => {
    const command = input.trim()
    if (!command || isStreaming) return

    setInput('')
    processedAgentsRef.current.clear()
    resetAllAgents()

    // 用户消息
    addMessage({
      id: Date.now().toString(),
      role: 'user',
      content: command,
      timestamp: Date.now(),
      type: 'text',
    })

    setStreaming(true)
    updateAgentStatus('chairman', 'working')
    setAgentProgress('chairman', 30, '下达指令')

    addMessage({
      id: (Date.now() + 1).toString(),
      role: 'system',
      content: `📋 指令已接收，正在分发给分析员...\n\n"${command}"`,
      timestamp: Date.now() + 100,
      type: 'text',
    })

    try {
      if (workflowEngineRef.current) {
        workflowEngineRef.current.setOnProgress((progress: WorkflowProgress) => {
          setPhase(progress.phase)

          // 更新董事长进度
          setAgentProgress('chairman', Math.min(100, ((progress.phaseIndex + 1) / progress.totalPhases) * 100), '监督工作流')

          // 根据阶段更新Agent状态并添加消息
          if (progress.agent && progress.content && !processedAgentsRef.current.has(progress.agent.id)) {
            processedAgentsRef.current.add(progress.agent.id)
            const storeId = agentIdToStoreId[progress.agent.id] || progress.agent.id
            updateAgentStatus(storeId, 'working')
            setAgentProgress(storeId, 50, progress.message)
            setTimeout(() => {
              updateAgentStatus(storeId, 'done')
              setAgentProgress(storeId, 100)
            }, 1500)

            addMessage({
              id: `${Date.now()}-${progress.agent.id}`,
              role: storeId,
              content: progress.content,
              timestamp: Date.now(),
              type: 'text',
              metadata: { agentId: storeId, phase: progress.phase },
            })
          }
        })

        const result = await workflowEngineRef.current.executeWorkflow(command)

        // 知识沉淀：将任务经验自动存入知识库（无论如何都执行）
        try {
          const allOutputs = result.phases
            .flatMap(p => p.outputs)
            .join('\n\n')
            .slice(0, 3000)

          // 提取关键词作为标签
          const keywords = command
            .replace(/[，。、！？\s]+/g, ' ')
            .split(' ')
            .filter(w => w.length > 1)
            .slice(0, 5)

          // 根据内容判断分类
          const cmdLower = command.toLowerCase()
          let category = '任务经验'
          if (cmdLower.includes('python') || cmdLower.includes('fastapi') || cmdLower.includes('后端')) {
            category = '后端开发'
          } else if (cmdLower.includes('react') || cmdLower.includes('前端') || cmdLower.includes('组件')) {
            category = '前端开发'
          } else if (cmdLower.includes('ai') || cmdLower.includes('智能体') || cmdLower.includes('agent')) {
            category = 'AI/智能体'
          } else if (cmdLower.includes('sql') || cmdLower.includes('数据库')) {
            category = '数据库'
          } else if (cmdLower.includes('部署') || cmdLower.includes('docker')) {
            category = 'DevOps'
          }

          const knowledgeId = `auto-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
          addEntry({
            id: knowledgeId,
            title: `任务经验：${command.slice(0, 40)}${command.length > 40 ? '...' : ''}`,
            content: `## 任务记录

### 用户指令
${command}

### 执行结果摘要
${allOutputs.slice(0, 2000)}

### 执行统计
- 阶段数：${result.phases.length}
- 耗时：${(result.totalDuration / 1000).toFixed(1)}秒
- 状态：${result.isSuccess ? '✅ 成功' : '❌ 失败'}
- 生成时间：${new Date().toLocaleString('zh-CN')}

---
*此条目由自我学习系统自动生成*`,
            tags: [...keywords, '自动生成', '任务经验', category],
            category,
            createdAt: Date.now(),
            source: '自我学习系统',
          })
        } catch (e) {
          // 知识沉淀失败不影响主流程
          console.error('知识沉淀失败:', e)
        }

        // 完成消息
        addMessage({
          id: (Date.now() + 999).toString(),
          role: 'system',
          content: result.isSuccess
            ? `✅ 任务完成！\n\n📊 执行统计：\n• 共 ${result.phases.length} 个阶段\n• 耗时 ${(result.totalDuration / 1000).toFixed(1)} 秒\n• 全部Agent协作完成\n\n📚 本次任务经验已自动存入知识库\n\n结果已交付，请查阅。`
            : `⚠️ 任务执行结束（部分阶段可能异常）\n\n📊 执行统计：\n• 共 ${result.phases.length} 个阶段\n• 耗时 ${(result.totalDuration / 1000).toFixed(1)} 秒\n\n📚 本次任务经验已自动存入知识库\n\n结果已交付，请查阅。`,
          timestamp: Date.now(),
          type: 'text',
        })

        updateAgentStatus('chairman', 'done')
        setAgentProgress('chairman', 100, '任务完成')
      }
    } catch (error) {
      addMessage({
        id: (Date.now() + 998).toString(),
        role: 'system',
        content: `❌ 错误: ${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: Date.now(),
        type: 'text',
      })
    } finally {
      setStreaming(false)
      setPhase('idle')
    }
  }

  const quickCommands = [
    { label: '分析', cmd: '分析一下用户管理系统的需求' },
    { label: '开发', cmd: '开发一个待办清单应用' },
    { label: '优化', cmd: '优化现有代码的性能' },
    { label: '部署', cmd: '部署到GitHub Pages' },
  ]

  return (
    <div className="h-full flex flex-col">
      {/* 顶部标题栏 */}
      <div className="sticky top-0 z-20 bg-gray-950/90 backdrop-blur-md border-b border-green-900/30 px-4 pt-2.5 pb-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-green-900/30 border border-green-700/50 flex items-center justify-center">
              <Crown className="w-4 h-4 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-sm font-mono font-bold text-green-400" style={{ textShadow: '0 0 8px rgba(34,197,94,0.5)' }}>
                HOPEAI
              </h1>
              <p className="text-[9px] font-mono text-gray-500 -mt-0.5">清鸢AI公司</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono text-green-400">在线</span>
          </div>
        </div>

        {/* Tab切换 */}
        <div className="flex gap-1 mb-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={cn(
              'flex-1 py-1.5 rounded-lg text-[11px] font-mono transition-all',
              activeTab === 'dashboard'
                ? 'bg-green-900/40 text-green-400 border border-green-800/50'
                : 'text-gray-500 hover:text-gray-300'
            )}
          >
            控制中心
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={cn(
              'flex-1 py-1.5 rounded-lg text-[11px] font-mono transition-all',
              activeTab === 'chat'
                ? 'bg-green-900/40 text-green-400 border border-green-800/50'
                : 'text-gray-500 hover:text-gray-300'
            )}
          >
            下达指令
          </button>
        </div>
      </div>

      {/* 内容区 */}
      {activeTab === 'dashboard' ? (
        <DashboardMiniView onStartChat={() => setActiveTab('chat')} />
      ) : (
        <>
          {/* 消息列表 */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto py-2">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center px-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-green-900/20 border border-green-700/40 flex items-center justify-center mb-4">
                  <Crown className="w-8 h-8 text-yellow-400 opacity-70" />
                </div>
                <h2 className="text-base font-mono text-green-400 mb-1">欢迎，董事长</h2>
                <p className="text-[12px] text-gray-500 leading-relaxed">
                  下达您的指令，团队将自动协作完成<br />
                  分析 → 编码 → 审查 → 扩展 → 打包 → 部署
                </p>
                <div className="mt-6 grid grid-cols-2 gap-2 w-full max-w-xs">
                  {quickCommands.map((q) => (
                    <button
                      key={q.label}
                      onClick={() => setInput(q.cmd)}
                      className="px-3 py-2 rounded-lg bg-gray-900/60 border border-gray-800 hover:border-green-700/50 text-[11px] font-mono text-gray-400 hover:text-green-400 transition-all"
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg) => <MobileMessage key={msg.id} message={msg} />)}
                {isStreaming && <TypingIndicator />}
              </>
            )}
          </div>

          {/* 输入框 */}
          <div className="flex-shrink-0 bg-gray-950/90 backdrop-blur-md border-t border-green-900/30 p-2.5">
            <div className="flex items-end gap-2 max-w-md mx-auto">
              <div className="flex-1 relative">
                <div className="flex items-center bg-gray-900/80 border border-gray-800 rounded-2xl focus-within:border-green-700/50 transition-colors">
                  <span className="pl-3 text-green-500 font-mono text-sm">{`>`}</span>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                    placeholder="下达指令..."
                    rows={1}
                    className="flex-1 bg-transparent px-2 py-2.5 text-[13px] text-gray-100 placeholder-gray-600 font-mono resize-none outline-none max-h-24"
                    disabled={isStreaming}
                  />
                </div>
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
                className={cn(
                  'flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-all',
              input.trim() && !isStreaming
                ? 'bg-green-600 text-white shadow-[0_0_12px_rgba(34,197,94,0.5)] hover:bg-green-500'
                : 'bg-gray-800 text-gray-600'
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
        </>
      )}
    </div>
  )
}

function getToolIcon(category: string) {
  const icons: Record<string, any> = {
    code: Code2,
    filesystem: FolderOpen,
    utility: Calculator,
    search: FileSearch,
    data: FileJson,
    ai: Sparkles,
    default: Wrench
  }
  return icons[category] || icons.default
}

export default function Dashboard({ initialView = 'chat' }: { initialView?: 'chat' | 'team' }) {
  if (initialView === 'team') {
    return <TeamView />
  }
  return <ChatView />
}
