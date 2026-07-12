import { useState, useEffect } from 'react'
import { Brain, Sparkles, ChevronRight, Zap, Layers, Activity, Cpu, Wifi, WifiOff, Server } from 'lucide-react'
import { agents, getAgentsByCategory } from '@/engine/agents'
import { useChatStore, useAppStore } from '@/store'
import type { Agent } from '@/types'
import { getState as getSuperState, getStats as getSuperStats, toggle as toggleSuper } from '@/services/superAgentService'
import { statsApi, healthApi } from '@/services/apiClient'
import { cn } from '@/lib/utils'

export default function AgentsPage() {
  const { setActiveAgent, createConversation } = useChatStore()
  const { setCurrentPage, backendOnline, useBackend } = useAppStore()
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [superOn, setSuperOn] = useState(getSuperState().enabled)
  const [stats, setStats] = useState<{ totalMessages: number; totalConversations: number; totalKnowledge: number; totalTokens: number } | null>(null)
  const [uptime, setUptime] = useState<number | null>(null)
  const categories = getAgentsByCategory()

  // 拉取后端统计
  useEffect(() => {
    if (!useBackend || !backendOnline) return
    const fetchStats = async () => {
      try {
        const [s, h] = await Promise.all([statsApi.get(), healthApi.check()])
        setStats(s)
        setUptime(h.uptime)
      } catch {}
    }
    fetchStats()
    const id = setInterval(fetchStats, 5000)
    return () => clearInterval(id)
  }, [useBackend, backendOnline])

  const handleToggleSuper = () => {
    toggleSuper()
    setSuperOn(getSuperState().enabled)
  }

  const handleChatWithAgent = (agent: Agent) => {
    setActiveAgent(agent.id)
    createConversation()
    setCurrentPage('chat')
  }

  const superStats = getSuperStats(agents as any)
  const layerCounts: Record<string, number> = {
    'L1 编排调度': categories['L1 编排调度']?.length || 3,
    'L2 交付执行': categories['L2 交付执行']?.length || 5,
    'L3 数据底座': categories['L3 数据底座']?.length || 4,
    'L4 治理安全': categories['L4 治理安全']?.length || 6,
    'SP 特殊智能': categories['SP 特殊智能']?.length || 3,
  }

  return (
    <div className="h-full flex flex-col">
      {/* 顶部 */}
      <div className="border-b border-cyber-border bg-cyber-panel/50 px-4 py-3">
        <h1 className="text-base font-bold text-cyber-text flex items-center gap-2">
          <Brain className="w-4 h-4 text-cyber-accent" />
          {superOn ? '超级大脑' : 'Agent团队'}
        </h1>
        <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
          {agents.length} 个Agent · 5层能力 · {superOn ? '融合模式' : '独立模式'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* 超级大脑面板 */}
        <div className={cn(
          'rounded-xl border p-4 transition-all',
          superOn
            ? 'bg-purple-500/10 border-purple-500/40'
            : 'bg-cyber-panel/50 border-cyber-border'
        )}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center',
                superOn ? 'bg-purple-500/20' : 'bg-white/5'
              )}>
                <Brain className={cn('w-5 h-5', superOn ? 'text-purple-400' : 'text-gray-500')} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-cyber-text">超级大脑</h2>
                <p className="text-[10px] font-mono text-gray-500">
                  {superOn ? '已激活 · 23 Agent融合' : '未激活'}
                </p>
              </div>
            </div>
            <button
              onClick={handleToggleSuper}
              className={cn(
                'relative w-11 h-6 rounded-full transition-all',
                superOn ? 'bg-purple-500/30 border border-purple-500/50' : 'bg-gray-800 border border-gray-700'
              )}
            >
              <div className={cn(
                'absolute top-1 w-4 h-4 rounded-full transition-all',
                superOn ? 'left-6 bg-purple-400' : 'left-1 bg-gray-600'
              )} />
            </button>
          </div>

          {superOn && (
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-purple-500/20">
              <div className="text-center">
                <p className="text-lg font-bold text-purple-400 font-mono">{superStats.evolutionCount || 0}</p>
                <p className="text-[9px] text-gray-500 font-mono">进化次数</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-purple-400 font-mono">{superStats.totalTools || 0}</p>
                <p className="text-[9px] text-gray-500 font-mono">工具数</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-purple-400 font-mono">{agents.length}</p>
                <p className="text-[9px] text-gray-500 font-mono">融合Agent</p>
              </div>
            </div>
          )}
        </div>

        {/* 能力分层统计 */}
        <div className="rounded-xl border border-cyber-border bg-cyber-panel/50 p-3">
          <h3 className="text-xs font-mono text-gray-400 mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyber-accent" />
            能力分层
          </h3>
          <div className="space-y-1.5">
            {Object.entries(layerCounts).map(([layer, count]) => (
              <div key={layer} className="flex items-center justify-between text-xs">
                <span className="text-gray-400 font-mono">{layer}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyber-accent rounded-full"
                      style={{ width: `${(count / 6) * 100}%` }}
                    />
                  </div>
                  <span className="text-cyber-accent font-mono w-4 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 后端统计 */}
        {useBackend && backendOnline && stats && (
          <div className="rounded-xl border border-cyber-border bg-cyber-panel/50 p-3">
            <h3 className="text-xs font-mono text-gray-400 mb-2 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-cyber-accent" />
              后端统计
              <span className="ml-auto flex items-center gap-1 text-[10px] text-cyber-accent">
                <Wifi className="w-2.5 h-2.5" />
                在线
              </span>
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <StatCard icon={Activity} label="消息数" value={stats.totalMessages} />
              <StatCard icon={Layers} label="对话数" value={stats.totalConversations} />
              <StatCard icon={Cpu} label="知识条目" value={stats.totalKnowledge} />
              <StatCard icon={Zap} label="Tokens" value={stats.totalTokens} />
            </div>
            {uptime !== null && (
              <div className="mt-2 pt-2 border-t border-cyber-border/50 text-[10px] font-mono text-gray-600 flex justify-between">
                <span>运行时长</span>
                <span className="text-cyber-accent">{formatUptime(uptime)}</span>
              </div>
            )}
          </div>
        )}

        {useBackend && !backendOnline && (
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-3 text-center">
            <WifiOff className="w-5 h-5 text-gray-600 mx-auto mb-1" />
            <p className="text-xs text-gray-500 font-mono">后端服务未启动</p>
            <p className="text-[10px] text-gray-600 mt-0.5">运行 node server/index.js</p>
          </div>
        )}

        {/* Agent列表 — 按层级 */}
        {Object.entries(categories).map(([category, categoryAgents]) => (
          <div key={category}>
            <h2 className="text-xs font-mono text-gray-400 mb-2 flex items-center gap-1.5 px-1">
              <Sparkles className="w-3 h-3 text-cyber-accent" />
              {category}
              <span className="text-gray-600">({categoryAgents.length})</span>
            </h2>
            <div className="space-y-1.5">
              {categoryAgents.map(agent => (
                <AgentRow
                  key={agent.id}
                  agent={agent}
                  onClick={() => setSelectedAgent(agent)}
                  onChat={() => handleChatWithAgent(agent)}
                />
              ))}
            </div>
          </div>
        ))}

        <div className="h-4" />
      </div>

      {selectedAgent && (
        <AgentDetailModal
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
          onChat={() => handleChatWithAgent(selectedAgent)}
        />
      )}
    </div>
  )
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  return (
    <div className="bg-white/[0.02] border border-cyber-border/50 rounded-lg p-2">
      <div className="flex items-center gap-1 text-[10px] font-mono text-gray-500 mb-0.5">
        <Icon className="w-2.5 h-2.5" />
        {label}
      </div>
      <p className="text-sm font-bold text-cyber-accent font-mono">{value.toLocaleString()}</p>
    </div>
  )
}

function formatUptime(seconds: number): string {
  if (seconds < 60) return `${Math.floor(seconds)}秒`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}分`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}小时`
  return `${Math.floor(seconds / 86400)}天`
}

function AgentRow({
  agent,
  onClick,
  onChat,
}: {
  agent: Agent
  onClick: () => void
  onChat: () => void
}) {
  return (
    <div
      onClick={onClick}
      className="relative flex items-center gap-2.5 p-2.5 rounded-xl border border-cyber-border bg-cyber-panel/50 hover:border-cyber-accent/30 hover:bg-white/5 transition-all cursor-pointer"
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
        style={{
          background: `linear-gradient(135deg, ${agent.color}20, ${agent.color}10)`,
          border: `1px solid ${agent.color}30`,
        }}
      >
        {agent.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-medium text-cyber-text truncate">{agent.name}</h3>
          <span className="text-[9px] font-mono text-gray-600">{agent.role}</span>
        </div>
        <p className="text-[11px] text-gray-500 truncate">{agent.specialty}</p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onChat() }}
        className="p-1.5 rounded-lg text-gray-500 hover:text-cyber-accent hover:bg-cyber-accent/10 transition-all flex-shrink-0"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

function AgentDetailModal({ agent, onClose, onChat }: {
  agent: Agent
  onClose: () => void
  onChat: () => void
}) {
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-cyber-panel border border-cyber-border rounded-t-2xl sm:rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5">
          <div className="flex items-start gap-3 mb-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${agent.color}30, ${agent.color}10)`,
                border: `1px solid ${agent.color}40`,
              }}
            >
              {agent.avatar}
            </div>
            <div className="flex-1">
              <h2 className="text-base font-bold text-cyber-text">{agent.name}</h2>
              <p className="text-xs font-mono text-gray-500">{agent.role}</p>
              <p className="text-xs text-cyber-accent mt-1">{agent.specialty}</p>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-xs font-medium text-gray-400 mb-2 font-mono">擅长技能</h3>
            <div className="flex flex-wrap gap-1.5">
              {agent.skills.map(skill => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded-full text-[11px] bg-white/5 text-gray-400 border border-cyber-border font-mono"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-xs font-medium text-gray-400 mb-2 font-mono">Agent简介</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              {agent.description}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onChat}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-cyber-accent text-black rounded-xl font-mono text-sm hover:bg-cyber-accent/90 transition-colors"
              style={{ boxShadow: '0 0 20px rgba(0,255,136,0.3)' }}
            >
              <Zap className="w-4 h-4" />
              开始对话
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-white/5 text-gray-400 rounded-xl font-mono text-sm hover:bg-white/10 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
