import { create } from 'zustand'
import type { Agent } from '@/types'

const initialAgents: Agent[] = [
  {
    id: 'chairman',
    name: '董事长',
    role: 'CEO',
    status: 'idle',
    progress: 0,
    currentTask: '',
    lastActive: Date.now(),
  },
  {
    id: 'analyst',
    name: '分析员',
    role: 'Analyst',
    status: 'idle',
    progress: 0,
    currentTask: '',
    lastActive: Date.now(),
  },
  {
    id: 'coder-1',
    name: '代码员小绿',
    role: 'Coder',
    status: 'idle',
    progress: 0,
    currentTask: '',
    lastActive: Date.now(),
  },
  {
    id: 'coder-2',
    name: '代码员小蓝',
    role: 'Coder',
    status: 'idle',
    progress: 0,
    currentTask: '',
    lastActive: Date.now(),
  },
  {
    id: 'coder-3',
    name: '代码员小紫',
    role: 'Coder',
    status: 'idle',
    progress: 0,
    currentTask: '',
    lastActive: Date.now(),
  },
  {
    id: 'coder-4',
    name: '代码员小青',
    role: 'Coder',
    status: 'idle',
    progress: 0,
    currentTask: '',
    lastActive: Date.now(),
  },
  {
    id: 'coder-5',
    name: '代码员小橙',
    role: 'Coder',
    status: 'idle',
    progress: 0,
    currentTask: '',
    lastActive: Date.now(),
  },
  {
    id: 'inspector-1',
    name: '检查员甲',
    role: 'Inspector',
    status: 'idle',
    progress: 0,
    currentTask: '',
    lastActive: Date.now(),
  },
  {
    id: 'inspector-2',
    name: '检查员乙',
    role: 'Inspector',
    status: 'idle',
    progress: 0,
    currentTask: '',
    lastActive: Date.now(),
  },
  {
    id: 'expander',
    name: '扩展员',
    role: 'Expander',
    status: 'idle',
    progress: 0,
    currentTask: '',
    lastActive: Date.now(),
  },
  {
    id: 'packer',
    name: '打包员',
    role: 'Packer',
    status: 'idle',
    progress: 0,
    currentTask: '',
    lastActive: Date.now(),
  },
  {
    id: 'deliverer',
    name: '输送员',
    role: 'Deliverer',
    status: 'idle',
    progress: 0,
    currentTask: '',
    lastActive: Date.now(),
  },
]

interface AgentState {
  agents: Agent[]
  updateAgentStatus: (id: string, status: Agent['status']) => void
  setAgentProgress: (id: string, progress: number, currentTask?: string) => void
  resetAllAgents: () => void
}

export const useAgentStore = create<AgentState>((set) => ({
  agents: initialAgents,
  updateAgentStatus: (id, status) =>
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === id ? { ...agent, status, lastActive: Date.now() } : agent
      ),
    })),
  setAgentProgress: (id, progress, currentTask) =>
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === id
          ? {
              ...agent,
              progress,
              currentTask: currentTask ?? agent.currentTask,
              lastActive: Date.now(),
            }
          : agent
      ),
    })),
  resetAllAgents: () =>
    set({
      agents: initialAgents.map((agent) => ({
        ...agent,
        status: 'idle',
        progress: 0,
        currentTask: '',
        lastActive: Date.now(),
      })),
    }),
}))
