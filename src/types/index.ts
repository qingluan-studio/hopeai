export type MessageRole = 'user' | 'assistant' | 'system' | 'analyst' | 'coder-1' | 'coder-2' | 'coder-3' | 'coder-4' | 'coder-5' | 'inspector-1' | 'inspector-2' | 'expander' | 'packer' | 'deliverer'

export interface Message {
  id: string
  role: MessageRole | string
  content: string
  timestamp: number
  type: 'text' | 'code' | 'image' | 'file'
  metadata?: Record<string, unknown>
}

export interface Agent {
  id: string
  name: string
  role: string
  status: 'idle' | 'thinking' | 'working' | 'done' | 'error' | 'paused' | 'completed'
  progress: number
  currentTask: string
  lastActive: number
}

export interface KnowledgeEntry {
  id: string
  title: string
  content: string
  tags: string[]
  category: string
  createdAt: number
  source: string
}

export interface DeployConfig {
  githubToken: string
  repoUrl: string
  branch: string
  targetPath: string
}

export interface DeployTask {
  id: string
  status: 'pending' | 'running' | 'success' | 'failed'
  progress: number
  logs: string[]
  createdAt: number
}

export type Theme = 'cyber' | 'matrix' | 'retro'
