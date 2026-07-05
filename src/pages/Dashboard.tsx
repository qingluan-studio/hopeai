import { useState, useRef, useEffect } from 'react'
import { Send, Crown, Search, Code2, Shield, Rocket, Package, Sparkles, ChevronLeft, MoreVertical, Users, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useChatStore } from '@/store/useChatStore'
import { useAgentStore } from '@/store/useAgentStore'
import { WorkflowEngine, type WorkflowProgress } from '@/engine/workflowEngine'

// 角色配置
const roleConfig: Record<string, { name: string; color: string; bg: string; border: string; icon: typeof Crown }> = {
  user: { name: '董事长', color: 'text-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-700/50', icon: Crown },
  system: { name: '系统', color: 'text-gray-400', bg: 'bg-gray-900/60', border: 'border-gray-700/50', icon: Zap },
  analyst: { name: '分析员', color: 'text-blue-400', bg: 'bg-blue-900/30', border: 'border-blue-700/50', icon: Search },
  'coder-1': { name: '代码员小绿', color: 'text-green-400', bg: 'bg-green-900/30', border: 'border-green-700/50', icon: Code2 },
  'coder-2': { name: '代码员小蓝', color: 'text-cyan-400', bg: 'bg-cyan-900/30', border: 'border-cyan-700/50', icon: Code2 },
  'coder-3': { name: '代码员小紫', color: 'text-purple-400', bg: 'bg-purple-900/30', border: 'border-purple-700/50', icon: Code2 },
  'coder-4': { name: '代码员小青', color: 'text-teal-400', bg: 'bg-teal-900/30', border: 'border-teal-700/50', icon: Code2 },
  'coder-5': { name: '代码员小橙', color: 'text-orange-400', bg: 'bg-orange-900/30', border: 'border-orange-700/50', icon: Code2 },
  'inspector-1': { name: '检查员甲', color: 'text-pink-400', bg: 'bg-pink-900/30', border: 'border-pink-700/50', icon: Shield },
  'inspector-2': { name: '检查员乙', color: 'text-red-400', bg: 'bg-red-900/30', border: 'border-red-700/50', icon: Shield },
  expander: { name: '扩展员', color: 'text-indigo-400', bg: 'bg-indigo-900/30', border: 'border-indigo-700/50', icon: Sparkles },
  packer: { name: '打包员', color: 'text-amber-400', bg: 'bg-amber-900/30', border: 'border-amber-700/50', icon: Package },
  deliverer: { name: '输送员', color: 'text-emerald-400', bg: 'bg-emerald-900/30', border: 'border-emerald-700/50', icon: Rocket },
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
  // 检测是否有代码块
  const parts = content.split(/(```[\s\S]*?```)/g)

  return (
    <div className="whitespace-pre-wrap">
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const code = part.replace(/^```\w*\n?/, '').replace(/```$/, '')
          return (
            <pre key={i} className="my-1.5 p-2 bg-gray-950/80 border border-gray-800 rounded-lg overflow-x-auto text-[11px] font-mono text-green-300">
              <code>{code}</code>
            </pre>
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
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="text-green-400">{activeCount} 活跃</span>
            <span className="text-gray-600">|</span>
            <span className="text-blue-400">{doneCount} 完成</span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-500">共 {agents.length}</span>
          </div>
        </div>
      </div>

      {/* 成员列表 */}
      <div className="flex-1 p-3 space-y-2 max-w-md mx-auto w-full">
        {/* 董事长 */}
        <div className="mb-2">
          <div className="text-[10px] font-mono text-gray-600 px-1 mb-1.5 tracking-wider">管理层</div>
          <TeamMemberCard agent={agents.find(a => a.id === 'chairman') || agents[0]} />
        </div>

        {/* 分析员 */}
        <div className="mb-2">
          <div className="text-[10px] font-mono text-gray-600 px-1 mb-1.5 tracking-wider">分析层</div>
          <TeamMemberCard agent={agents.find(a => a.id === 'analyst') || agents[1]} />
        </div>

        {/* 代码员 */}
        <div className="mb-2">
          <div className="text-[10px] font-mono text-gray-600 px-1 mb-1.5 tracking-wider">开发层</div>
          <div className="space-y-2">
            {agents.filter(a => a.role === 'Coder').map(a => <TeamMemberCard key={a.id} agent={a} />)}
          </div>
        </div>

        {/* 检查员 */}
        <div className="mb-2">
          <div className="text-[10px] font-mono text-gray-600 px-1 mb-1.5 tracking-wider">质检层</div>
          <div className="space-y-2">
            {agents.filter(a => a.role === 'Inspector').map(a => <TeamMemberCard key={a.id} agent={a} />)}
          </div>
        </div>

        {/* 后勤 */}
        <div className="mb-2">
          <div className="text-[10px] font-mono text-gray-600 px-1 mb-1.5 tracking-wider">交付层</div>
          <div className="space-y-2">
            <TeamMemberCard agent={agents.find(a => a.id === 'expander')!} />
            <TeamMemberCard agent={agents.find(a => a.id === 'packer')!} />
            <TeamMemberCard agent={agents.find(a => a.id === 'deliverer')!} />
          </div>
        </div>
      </div>
    </div>
  )
}

// 聊天主页
function ChatView() {
  const { messages, isStreaming, addMessage, setStreaming } = useChatStore()
  const { resetAllAgents, updateAgentStatus, setAgentProgress } = useAgentStore()
  const [input, setInput] = useState('')
  const [phase, setPhase] = useState<string>('idle')
  const scrollRef = useRef<HTMLDivElement>(null)
  const workflowEngineRef = useRef<WorkflowEngine | null>(null)
  const processedAgentsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isStreaming])

  useEffect(() => {
    workflowEngineRef.current = new WorkflowEngine({ speedFactor: 2 })
  }, [])

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
            const storeId = agentIdToStoreId[progress.agent.id]
            if (storeId) {
              updateAgentStatus(storeId, 'working')
              setAgentProgress(storeId, 50, progress.message)
              setTimeout(() => {
                updateAgentStatus(storeId, 'done')
                setAgentProgress(storeId, 100)
              }, 1500)
            }

            addMessage({
              id: `${Date.now()}-${progress.agent.id}`,
              role: progress.agent.id,
              content: progress.content,
              timestamp: Date.now(),
              type: 'text',
              metadata: { agentId: progress.agent.id, phase: progress.phase },
            })
          }
        })

        const result = await workflowEngineRef.current.executeWorkflow(command)

        // 完成消息
        addMessage({
          id: (Date.now() + 999).toString(),
          role: 'system',
          content: result.isSuccess
            ? `✅ 任务完成！\n\n📊 执行统计：\n• 共 ${result.phases.length} 个阶段\n• 耗时 ${(result.totalDuration / 1000).toFixed(1)} 秒\n• 全部Agent协作完成\n\n结果已交付，请查阅。`
            : '❌ 任务执行失败，请重试。',
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
      <div className="sticky top-0 z-20 bg-gray-950/90 backdrop-blur-md border-b border-green-900/30 px-4 py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-green-900/30 border border-green-700/50 flex items-center justify-center">
              <Crown className="w-4 h-4 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-sm font-mono font-bold text-green-400" style={{ textShadow: '0 0 8px rgba(34,197,94,0.5)' }}>
                HOPEAI
              </h1>
              <p className="text-[9px] font-mono text-gray-500 -mt-0.5">多Agent协作系统</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono text-green-400">在线</span>
          </div>
        </div>
      </div>

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
    </div>
  )
}

export default function Dashboard({ initialView = 'chat' }: { initialView?: 'chat' | 'team' }) {
  if (initialView === 'team') {
    return <TeamView />
  }
  return <ChatView />
}
