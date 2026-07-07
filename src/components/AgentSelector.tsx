import { useState, useMemo } from 'react'
import { Search, ChevronDown, ChevronRight, Sparkles, Scale, GitCompare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { agents, layerNames, type AgentInfo } from '@/services/llmService'

interface AgentSelectorProps {
  selectedAgent: string | null
  onSelectAgent: (agentId: string) => void
}

const layerColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  'L1': { bg: 'bg-blue-900/30', border: 'border-blue-700/50', text: 'text-blue-400', glow: 'shadow-[0_0_12px_rgba(59,130,246,0.3)]' },
  'L2': { bg: 'bg-purple-900/30', border: 'border-purple-700/50', text: 'text-purple-400', glow: 'shadow-[0_0_12px_rgba(168,85,247,0.3)]' },
  'L3': { bg: 'bg-green-900/30', border: 'border-green-700/50', text: 'text-green-400', glow: 'shadow-[0_0_12px_rgba(34,197,94,0.3)]' },
  'L4': { bg: 'bg-amber-900/30', border: 'border-amber-700/50', text: 'text-amber-400', glow: 'shadow-[0_0_12px_rgba(245,158,11,0.3)]' },
}

function AgentItem({ agent, selected, onClick }: { agent: AgentInfo; selected: boolean; onClick: () => void }) {
  const colors = layerColors[agent.layer]
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2.5 p-2 rounded-lg transition-all duration-200 text-left group',
        selected
          ? `${colors.bg} ${colors.border} border ${colors.glow}`
          : 'hover:bg-gray-800/50 border border-transparent'
      )}
    >
      <span className="text-lg">{agent.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className={cn('text-xs font-medium truncate', selected ? colors.text : 'text-gray-300')}>
          {agent.name}
        </div>
        <div className="text-[10px] text-gray-500 truncate">
          {agent.role}
        </div>
      </div>
      {selected && (
        <div className={cn('w-1.5 h-1.5 rounded-full', colors.text.replace('text-', 'bg-'))} />
      )}
    </button>
  )
}

function LayerSection({ layer, layerName, agentsInLayer, selectedAgent, onSelectAgent, defaultOpen = false }: {
  layer: string
  layerName: string
  agentsInLayer: AgentInfo[]
  selectedAgent: string | null
  onSelectAgent: (agentId: string) => void
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const colors = layerColors[layer]
  const hasSelected = agentsInLayer.some(a => a.id === selectedAgent)

  return (
    <div className="border-b border-gray-800/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between p-2.5 hover:bg-gray-800/30 transition-colors',
          hasSelected && `${colors.bg}`
        )}
      >
        <div className="flex items-center gap-2">
          {isOpen ? (
            <ChevronDown className={cn('w-4 h-4', colors.text)} />
          ) : (
            <ChevronRight className={cn('w-4 h-4', colors.text)} />
          )}
          <span className={cn('text-xs font-mono font-semibold', colors.text)}>
            {layerName} ({agentsInLayer.length})
          </span>
        </div>
        <span className={cn('text-[10px] font-mono px-1.5 py-0.5 rounded', colors.bg, colors.text)}>
          {layer}
        </span>
      </button>

      {isOpen && (
        <div className="px-2 pb-2 space-y-0.5 animate-in slide-in-from-top-2 duration-200">
          {agentsInLayer.map(agent => (
            <AgentItem
              key={agent.id}
              agent={agent}
              selected={agent.id === selectedAgent}
              onClick={() => onSelectAgent(agent.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function AgentSelector({ selectedAgent, onSelectAgent }: AgentSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const sortedAgents = useMemo(() => {
    const layers = ['L1', 'L2', 'L3', 'L4']
    const result: Record<string, AgentInfo[]> = {}
    for (const layer of layers) {
      result[layer] = agents.filter(a => a.layer === layer)
    }
    return result
  }, [])

  const filteredAgents = useMemo(() => {
    if (!searchQuery.trim()) return sortedAgents
    
    const query = searchQuery.toLowerCase()
    const result: Record<string, AgentInfo[]> = {}
    for (const layer of ['L1', 'L2', 'L3', 'L4']) {
      result[layer] = agents.filter(a => 
        a.layer === layer && (
          a.name.toLowerCase().includes(query) ||
          a.role.toLowerCase().includes(query) ||
          a.tools.some(t => t.toLowerCase().includes(query))
        )
      )
    }
    return result
  }, [searchQuery, sortedAgents])

  const totalAgents = Object.values(filteredAgents).reduce((sum, arr) => sum + arr.length, 0)

  return (
    <div className="w-72 h-full bg-gray-950/90 border-r border-gray-800/50 flex flex-col backdrop-blur-sm">
      <div className="p-4 border-b border-gray-800/50">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h2 className="text-purple-400 font-mono text-sm tracking-wider" style={{ textShadow: '0 0 8px rgba(168,85,247,0.4)' }}>
            AGENT CENTER
          </h2>
          <span className="ml-auto text-[10px] font-mono text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded">
            {totalAgents} Agents
          </span>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search agents... (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-900/80 border border-gray-700/50 rounded-lg text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-600/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {Object.entries(filteredAgents).map(([layer, agentsInLayer]) => (
          <LayerSection
            key={layer}
            layer={layer}
            layerName={layerNames[layer]}
            agentsInLayer={agentsInLayer}
            selectedAgent={selectedAgent}
            onSelectAgent={onSelectAgent}
            defaultOpen={layer === 'L1'}
          />
        ))}

        {totalAgents === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <div className="text-3xl mb-3">🔍</div>
            <div className="text-xs font-mono">No agents found</div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-800/50 bg-gray-900/50">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-900/30 border border-blue-700/50 text-blue-400 hover:bg-blue-900/50 transition-all text-[10px] font-mono">
            <Scale className="w-3.5 h-3.5" />
            Debate Court
          </button>
          <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-amber-900/30 border border-amber-700/50 text-amber-400 hover:bg-amber-900/50 transition-all text-[10px] font-mono">
            <GitCompare className="w-3.5 h-3.5" />
            A/B Compare
          </button>
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-gray-500">
          <span>LAYERS: 4</span>
          <span>TOTAL: {agents.length}</span>
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
          background: rgba(168, 85, 247, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.5);
        }
      `}</style>
    </div>
  )
}
