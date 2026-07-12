export interface Agent {
  id: string
  name: string
  role: string
  avatar: string
  color: string
  specialty: string
  skills: string[]
  description: string
  systemPrompt: string
}

export interface Tool {
  id: string
  name: string
  icon: string
  description: string
  category: 'code' | 'search' | 'file' | 'data' | 'design' | 'deploy' | 'utility'
}

export interface ToolCall {
  toolId: string
  toolName: string
  input: string
  output?: string
  status: 'pending' | 'running' | 'success' | 'error'
  startedAt?: string
  finishedAt?: string
}

export interface ThoughtStep {
  id: string
  type: 'observe' | 'think' | 'plan' | 'act' | 'reflect'
  content: string
  timestamp: string
  toolCall?: ToolCall
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  agentId?: string
  agentName?: string
  thoughtSteps?: ThoughtStep[]
  toolCalls?: ToolCall[]
  timestamp: string
  isComplete: boolean
}

export interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
  activeAgentId?: string
}

export interface KnowledgeEntry {
  id: string
  title: string
  content: string
  tags: string[]
  category: string
  source: 'manual' | 'auto' | 'imported'
  createdAt: string
  importance: number
}

export interface LLMConfig {
  apiKey: string
  model: string
  baseUrl: string
  temperature: number
  maxTokens: number
  enabled: boolean
}

export type AppPage = 'chat' | 'knowledge' | 'agents' | 'builder' | 'settings'

export interface MCPCall {
  tool: string
  args?: Record<string, any>
}
