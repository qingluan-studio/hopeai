import { useState, useEffect } from 'react'
import { 
  Crown, 
  BarChart3, 
  Code2, 
  Search, 
  GitBranch, 
  Package, 
  Send,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type AgentStatus = 'idle' | 'thinking' | 'working' | 'done' | 'error'

export interface Agent {
  id: string
  name: string
  role: string
  status: AgentStatus
  progress: number
  currentTask: string
  icon: typeof Crown
}

const agentConfigs: Omit<Agent, 'status' | 'progress' | 'currentTask'>[] = [
  { id: 'chairman', name: '董事长', role: 'CHAIRMAN', icon: Crown },
  { id: 'analyst', name: '分析员', role: 'ANALYST', icon: BarChart3 },
  { id: 'coder1', name: '代码员1', role: 'CODER-01', icon: Code2 },
  { id: 'coder2', name: '代码员2', role: 'CODER-02', icon: Code2 },
  { id: 'coder3', name: '代码员3', role: 'CODER-03', icon: Code2 },
  { id: 'inspector1', name: '检查员1', role: 'INSPECTOR-01', icon: Search },
  { id: 'inspector2', name: '检查员2', role: 'INSPECTOR-02', icon: Search },
  { id: 'extender', name: '扩展员', role: 'EXTENDER', icon: GitBranch },
  { id: 'packer', name: '打包员', role: 'PACKER', icon: Package },
  { id: 'deliverer', name: '输送员', role: 'DELIVERER', icon: Send },
]

const statusConfig: Record<AgentStatus, { color: string; bgColor: string; text: string; glow: string }> = {
  idle: { color: 'text-gray-500', bgColor: 'bg-gray-600', text: 'IDLE', glow: '' },
  thinking: { color: 'text-yellow-400', bgColor: 'bg-yellow-500', text: 'THINKING', glow: 'shadow-[0_0_12px_rgba(234,179,8,0.6)]' },
  working: { color: 'text-green-400', bgColor: 'bg-green-500', text: 'WORKING', glow: 'shadow-[0_0_12px_rgba(34,197,94,0.6)]' },
  done: { color: 'text-blue-400', bgColor: 'bg-blue-500', text: 'DONE', glow: 'shadow-[0_0_12px_rgba(59,130,246,0.6)]' },
  error: { color: 'text-red-400', bgColor: 'bg-red-500', text: 'ERROR', glow: 'shadow-[0_0_12px_rgba(239,68,68,0.6)]' },
}

const taskTemplates = [
  '初始化系统模块...',
  '分析需求文档...',
  '编写核心代码...',
  '代码审查中...',
  '运行测试用例...',
  '优化性能瓶颈...',
  '构建项目包...',
  '部署到服务器...',
  '等待指令...',
  '生成报告...',
]

function AgentCard({ agent }: { agent: Agent }) {
  const Icon = agent.icon
  const status = statusConfig[agent.status]
  const isActive = agent.status === 'working' || agent.status === 'thinking'

  return (
    <div 
      className={cn(
        'relative p-3 bg-gray-900/60 border border-gray-800 rounded-lg transition-all duration-300',
        'hover:border-green-700/50 hover:bg-gray-900/80 cursor-pointer group',
        isActive && 'border-green-800/60'
      )}
      style={{
        boxShadow: isActive ? '0 0 20px rgba(34, 197, 94, 0.15), inset 0 0 20px rgba(34, 197, 94, 0.05)' : undefined
      }}
    >
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-green-500/10 blur-sm" />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={cn(
              'p-1.5 rounded border',
              isActive 
                ? 'bg-green-900/30 border-green-700/50' 
                : 'bg-gray-800/50 border-gray-700/50'
            )}>
              <Icon 
                className={cn('w-4 h-4', status.color)} 
                style={{ filter: isActive ? `drop-shadow(0 0 4px currentColor)` : undefined }}
              />
            </div>
            <div>
              <div className={cn('text-sm font-medium', status.color)} style={{ textShadow: isActive ? '0 0 8px currentColor' : undefined }}>
                {agent.name}
              </div>
              <div className="text-[10px] text-gray-500 font-mono tracking-wider">
                {agent.role}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className={cn(
              'w-2 h-2 rounded-full',
              status.bgColor,
              status.glow,
              isActive && 'animate-pulse'
            )} />
            <span className={cn('text-[10px] font-mono', status.color)}>
              {status.text}
            </span>
          </div>
        </div>

        <div className="mb-2">
          <div className="flex justify-between text-[10px] font-mono mb-1">
            <span className="text-gray-500">PROGRESS</span>
            <span className={status.color}>{agent.progress}%</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={cn(
                'h-full rounded-full transition-all duration-500',
                agent.status === 'error' ? 'bg-red-500' :
                agent.status === 'done' ? 'bg-blue-500' :
                'bg-gradient-to-r from-green-600 to-green-400'
              )}
              style={{ 
                width: `${agent.progress}%`,
                boxShadow: agent.status !== 'idle' && agent.status !== 'error' 
                  ? '0 0 8px rgba(34, 197, 94, 0.5)' 
                  : undefined 
              }}
            />
          </div>
        </div>

        <div className="flex items-start gap-1.5">
          <Zap className="w-3 h-3 text-gray-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-400 truncate font-mono">
            {agent.currentTask}
          </p>
        </div>
      </div>

      {isActive && (
        <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
      )}
    </div>
  )
}

export default function AgentPanel() {
  const [agents, setAgents] = useState<Agent[]>(() => 
    agentConfigs.map(config => ({
      ...config,
      status: 'idle' as AgentStatus,
      progress: 0,
      currentTask: '等待指令...',
    }))
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => 
        prev.map(agent => {
          const rand = Math.random()
          
          if (agent.status === 'idle' && rand < 0.1) {
            return {
              ...agent,
              status: 'thinking' as AgentStatus,
              currentTask: taskTemplates[Math.floor(Math.random() * taskTemplates.length)],
              progress: Math.floor(Math.random() * 20),
            }
          }
          
          if (agent.status === 'thinking' && rand < 0.3) {
            return {
              ...agent,
              status: 'working' as AgentStatus,
              progress: Math.min(agent.progress + Math.floor(Math.random() * 15), 90),
            }
          }
          
          if (agent.status === 'working') {
            const newProgress = Math.min(agent.progress + Math.floor(Math.random() * 10), 100)
            if (newProgress >= 100) {
              return {
                ...agent,
                status: 'done' as AgentStatus,
                progress: 100,
                currentTask: '任务完成',
              }
            }
            return { ...agent, progress: newProgress }
          }
          
          if (agent.status === 'done' && rand < 0.05) {
            return {
              ...agent,
              status: 'idle' as AgentStatus,
              progress: 0,
              currentTask: '等待指令...',
            }
          }
          
          return agent
        })
      )
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  const activeCount = agents.filter(a => a.status === 'working' || a.status === 'thinking').length
  const doneCount = agents.filter(a => a.status === 'done').length

  return (
    <div className="w-72 h-full bg-gray-950/80 border-r border-green-900/30 flex flex-col backdrop-blur-sm">
      <div className="p-4 border-b border-green-900/30">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-green-400 font-mono text-sm tracking-widest" style={{ textShadow: '0 0 10px rgba(34, 197, 94, 0.5)' }}>
            AGENT POOL
          </h2>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-green-400">{activeCount}</span>
            <span className="text-gray-600">ACTIVE</span>
            <span className="text-gray-700">|</span>
            <span className="text-blue-400">{doneCount}</span>
            <span className="text-gray-600">DONE</span>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-green-500/50 via-green-500/20 to-transparent" />
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        {agents.map(agent => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      <div className="p-3 border-t border-green-900/30 bg-gray-900/50">
        <div className="flex items-center justify-between text-[10px] font-mono text-gray-500">
          <span>TOTAL: {agents.length} AGENTS</span>
          <span>v2.4.1</span>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 197, 94, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 197, 94, 0.5);
        }
      `}</style>
    </div>
  )
}
