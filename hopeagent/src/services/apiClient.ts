/**
 * HopeAgent 后端 API 客户端
 * 封装所有对 Node.js 后端服务的调用
 * 后端默认运行在 localhost:3210，纯代码实现无第三方依赖
 */

const API_BASE_KEY = 'hopeagent-api-base'

export function getApiBase(): string {
  try {
    return localStorage.getItem(API_BASE_KEY) || 'http://localhost:3210'
  } catch {
    return 'http://localhost:3210'
  }
}

export function setApiBase(base: string) {
  localStorage.setItem(API_BASE_KEY, base.replace(/\/$/, ''))
}

// ============ 类型定义 ============
export interface ServerMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  agentId?: string
  agentName?: string
  thoughtSteps?: any[]
  toolCalls?: any[]
}

export interface ServerConversation {
  id: string
  title: string
  messages: ServerMessage[]
  createdAt: string
  updatedAt?: string
}

export interface ServerConversationSummary {
  id: string
  title: string
  messageCount: number
  lastMessage: string
  updatedAt: string
}

export interface ServerKnowledgeEntry {
  id: string
  title: string
  content: string
  tags: string[]
  category: string
  source?: string
  createdAt: string
  importance?: number
}

export interface ServerStats {
  totalMessages: number
  totalTokens: number
  totalConversations: number
  totalKnowledge: number
}

export interface LLMConfigDTO {
  apiKey: string
  model: string
  baseUrl: string
  temperature: number
  maxTokens: number
  enabled: boolean
}

// ============ 基础请求 ============
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = getApiBase() + path
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })
  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try {
      const err = await res.json()
      msg = err.error || msg
    } catch {}
    throw new Error(msg)
  }
  return res.json()
}

// ============ 对话 API ============
export const chatApi = {
  /** 发送消息（非流式） */
  async send(message: string, opts: {
    conversationId?: string
    config?: Partial<LLMConfigDTO>
    useSuperBrain?: boolean
  } = {}): Promise<{ conversationId: string; message: ServerMessage; usage?: any }> {
    return request('/api/chat/send', {
      method: 'POST',
      body: JSON.stringify({
        message,
        conversationId: opts.conversationId,
        config: opts.config,
        useSuperBrain: opts.useSuperBrain ?? true,
      }),
    })
  },

  /** 流式发送消息（SSE） */
  async stream(
    message: string,
    opts: {
      conversationId?: string
      config?: Partial<LLMConfigDTO>
      useSuperBrain?: boolean
      onContent?: (chunk: string, full: string) => void
      onDone?: (full: string) => void
      onError?: (err: Error) => void
      signal?: AbortSignal
    } = {}
  ): Promise<string> {
    const url = getApiBase() + '/api/chat/stream'
    let full = ''
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          conversationId: opts.conversationId,
          config: opts.config,
          useSuperBrain: opts.useSuperBrain ?? true,
        }),
        signal: opts.signal,
      })

      if (!res.ok || !res.body) {
        throw new Error(`流式请求失败: ${res.status}`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const data = JSON.parse(line.slice(6))
            if (data.type === 'content' && typeof data.content === 'string') {
              full += data.content
              opts.onContent?.(data.content, full)
            } else if (data.type === 'done') {
              opts.onDone?.(full)
              return full
            }
          } catch {}
        }
      }
      opts.onDone?.(full)
      return full
    } catch (err: any) {
      if (err.name === 'AbortError') {
        opts.onDone?.(full)
        return full
      }
      opts.onError?.(err)
      throw err
    }
  },

  /** 获取对话列表 */
  async list(): Promise<ServerConversationSummary[]> {
    const r = await request<{ conversations: ServerConversationSummary[] }>('/api/conversations')
    return r.conversations
  },

  /** 获取对话详情 */
  async get(id: string): Promise<ServerConversation> {
    const r = await request<{ conversation: ServerConversation }>(`/api/conversation/${id}`)
    return r.conversation
  },

  /** 删除对话 */
  async delete(id: string): Promise<void> {
    await request(`/api/conversation/${id}`, { method: 'DELETE' })
  },
}

// ============ 知识库 API ============
export const knowledgeApi = {
  async list(): Promise<ServerKnowledgeEntry[]> {
    const r = await request<{ entries: ServerKnowledgeEntry[] }>('/api/knowledge')
    return r.entries
  },

  async add(entry: Omit<ServerKnowledgeEntry, 'id' | 'createdAt'>): Promise<ServerKnowledgeEntry> {
    const r = await request<{ entry: ServerKnowledgeEntry }>('/api/knowledge', {
      method: 'POST',
      body: JSON.stringify(entry),
    })
    return r.entry
  },

  async delete(id: string): Promise<void> {
    await request(`/api/knowledge/${id}`, { method: 'DELETE' })
  },

  async search(query: string): Promise<ServerKnowledgeEntry[]> {
    const r = await request<{ results: ServerKnowledgeEntry[] }>('/api/knowledge/search', {
      method: 'POST',
      body: JSON.stringify({ query }),
    })
    return r.results
  },
}

// ============ 设置 API ============
export const settingsApi = {
  async get(): Promise<Record<string, any>> {
    const r = await request<{ settings: Record<string, any> }>('/api/settings')
    return r.settings
  },

  async update(settings: Record<string, any>): Promise<Record<string, any>> {
    const r = await request<{ settings: Record<string, any> }>('/api/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    })
    return r.settings
  },
}

// ============ 统计 API ============
export const statsApi = {
  async get(): Promise<ServerStats> {
    const r = await request<{ stats: ServerStats }>('/api/stats')
    return r.stats
  },
}

// ============ 健康检查 ============
export const healthApi = {
  async check(): Promise<{ status: string; version: string; uptime: number }> {
    return request('/api/health')
  },

  /** 探测后端是否在线 */
  async isOnline(timeoutMs = 2000): Promise<boolean> {
    try {
      const ctrl = new AbortController()
      const t = setTimeout(() => ctrl.abort(), timeoutMs)
      await fetch(getApiBase() + '/api/health', { signal: ctrl.signal })
      clearTimeout(t)
      return true
    } catch {
      return false
    }
  },
}

// ============ 文件上传 API ============
export interface FileUploadResult {
  url?: string
  path?: string
  filename?: string
  size?: number
  mimeType?: string
}

export const filesApi = {
  /** 上传文件到后端 */
  async upload(file: File): Promise<FileUploadResult> {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch(getApiBase() + '/api/files/upload', {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) {
      throw new Error(`文件上传失败: HTTP ${res.status}`)
    }
    return res.json()
  },
}
