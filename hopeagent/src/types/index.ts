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
  // 扩展字段（新增 Agent 体系使用，原有 Agent 保持兼容）
  layer?: 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'SP'
  category?: string
  capabilities?: string[]
  tools?: string[]
  knowledgeTags?: string[]
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

export type AppPage = 'home' | 'chat' | 'knowledge' | 'agents' | 'builder' | 'settings' | 'dashboard' | 'plugins' | 'templates' | 'archive' | 'analytics' | 'workflow' | 'mindmap' | 'codesandbox' | 'profile' | 'notification' | 'help' | 'apidocs' | 'about' | 'taskmanage' | 'schedule' | 'notes' | 'favorites' | 'community'

export interface MCPCall {
  tool: string
  args?: Record<string, any>
}

// 插件相关类型
export type PluginCategory = 'tool' | 'agent' | 'theme' | 'import-export' | 'efficiency'
export type PluginStatus = 'installed' | 'available' | 'recommended' | 'disabled'

export interface Plugin {
  id: string
  name: string
  author: string
  version: string
  description: string
  category: PluginCategory
  rating: number
  installs: number
  icon: string
  features: string[]
  permissions: string[]
  status: PluginStatus
  longDescription?: string
  versionHistory?: { version: string; date: string; changes: string[] }[]
}

// 模板相关类型
export type TemplateCategory = 'all' | 'coding' | 'writing' | 'analysis' | 'creative' | 'learning' | 'office'

export interface Template {
  id: string
  title: string
  description: string
  category: Exclude<TemplateCategory, 'all'>
  systemPrompt: string
  useCases: string[]
  exampleDialog: { role: string; content: string }[]
  params: { name: string; description: string }[]
  usageCount: number
  likes: number
  isFavorite?: boolean
  isMyTemplate?: boolean
}

// 归档对话相关类型
export type ArchiveStatus = 'normal' | 'archived' | 'trash'

export interface ArchivedConversation {
  id: string
  title: string
  lastMessage: string
  agentName: string
  messageCount: number
  timestamp: string
  status: ArchiveStatus
  tags?: string[]
}

// 仪表盘统计数据类型
export interface DashboardStats {
  messages: number
  conversations: number
  tokens: number
  knowledgeEntries: number
  messagesChange: number
  conversationsChange: number
  tokensChange: number
  knowledgeChange: number
}

export interface TimelineActivity {
  id: string
  type: 'message' | 'knowledge' | 'agent' | 'system'
  title: string
  description: string
  timestamp: string
}

// 工具分类类型
export type ToolCategory =
  | '计算转换'
  | '文本处理'
  | '开发工具'
  | '数据处理'
  | '生活实用'
  | '信息检索'
  | '代码执行'
  | '文件操作'
  | '质量评估'
  | '任务规划'

// 工具执行记录
export interface ToolExecutionRecord {
  toolName: string
  success: boolean
  args: Record<string, any>
  output?: any
  error?: string
  durationMs: number
  timestamp: number
}

// 工具使用统计
export interface ToolUsageStats {
  totalCalls: number
  successCount: number
  failureCount: number
  successRate: number
  totalDurationMs: number
  averageDurationMs: number
  topTools: { name: string; count: number; successRate: number }[]
  recentRecords: ToolExecutionRecord[]
}

// 工具收藏项
export interface FavoriteTool {
  name: string
  addedAt: number
}
