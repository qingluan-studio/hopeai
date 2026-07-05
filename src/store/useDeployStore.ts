import { create } from 'zustand'
import type { DeployConfig, DeployTask } from '@/types'

interface DeployState {
  config: DeployConfig
  tasks: DeployTask[]
  setConfig: (config: Partial<DeployConfig>) => void
  addDeployTask: (task: DeployTask) => void
  updateDeployTask: (id: string, updates: Partial<DeployTask>) => void
}

export const useDeployStore = create<DeployState>((set) => ({
  config: {
    githubToken: '',
    repoUrl: '',
    branch: 'main',
    targetPath: '/',
  },
  tasks: [],
  setConfig: (config) =>
    set((state) => ({ config: { ...state.config, ...config } })),
  addDeployTask: (task) =>
    set((state) => ({ tasks: [task, ...state.tasks] })),
  updateDeployTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
    })),
}))
