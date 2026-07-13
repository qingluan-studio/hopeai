/**
 * HopeAgent Webhook 服务
 * 对接后端 /api/webhooks/* 接口，提供 Webhook 管理、签名验证与事件类型定义
 */

import { getApiBase } from './apiClient'
import { authHeaders } from './authService'

// ============ 类型定义 ============
export type WebhookEvent =
  | 'message.created'
  | 'conversation.created'
  | 'tool.executed'
  | 'task.completed'
  | 'user.registered'
  | 'backup.completed'
  | 'knowledge.created'
  | 'knowledge.updated'
  | 'knowledge.deleted'
  | 'agent.created'
  | 'agent.updated'
  | 'plugin.installed'
  | 'settings.updated'

export interface Webhook {
  id: string
  url: string
  name?: string
  events: WebhookEvent[]
  secret?: string
  active: boolean
  createdAt: string
  updatedAt: string
  lastTriggeredAt?: string
  triggerCount: number
  failureCount: number
  description?: string
}

export interface WebhookLog {
  id: string
  webhookId: string
  event: WebhookEvent
  url: string
  statusCode?: number
  success: boolean
  requestBody?: string
  responseBody?: string
  errorMessage?: string
  durationMs?: number
  timestamp: string
  eventId: string
}

export interface WebhookPayload<T = any> {
  eventId: string
  event: WebhookEvent
  timestamp: string
  data: T
}

// ============ 后端接口封装 ============
async function webhookRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = getApiBase() + path
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
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

// ============ 模拟数据 ============
const MOCK_WEBHOOKS: Webhook[] = [
  {
    id: 'wh_1',
    url: 'https://example.com/api/hopeagent/webhook',
    name: '主业务系统回调',
    events: ['message.created', 'conversation.created', 'task.completed'],
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    lastTriggeredAt: '2024-01-15T10:30:00Z',
    triggerCount: 128,
    failureCount: 3,
    description: '与主业务系统同步数据',
  },
  {
    id: 'wh_2',
    url: 'https://hooks.slack.com/services/[your-workspace]/[your-channel]/[your-token]',
    name: 'Slack 通知',
    events: ['backup.completed', 'user.registered'],
    active: true,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-14T02:00:00Z',
    lastTriggeredAt: '2024-01-14T02:00:00Z',
    triggerCount: 12,
    failureCount: 0,
    description: '备份完成和新用户注册时发 Slack 通知',
  },
  {
    id: 'wh_3',
    url: 'https://api.feishu.cn/open-apis/bot/v2/hook/xxxxx',
    name: '飞书机器人',
    events: ['task.completed'],
    active: false,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
    triggerCount: 5,
    failureCount: 2,
    description: '任务完成时推送到飞书群',
  },
]

const LOCAL_WEBHOOKS_KEY = 'hopeagent-webhooks'

function getLocalWebhooks(): Webhook[] {
  try {
    const raw = localStorage.getItem(LOCAL_WEBHOOKS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalWebhooks(hooks: Webhook[]): void {
  try {
    localStorage.setItem(LOCAL_WEBHOOKS_KEY, JSON.stringify(hooks))
  } catch {}
}

// ============ Webhook 列表与详情 ============

/**
 * 获取 Webhook 列表
 */
export async function listWebhooks(): Promise<Webhook[]> {
  try {
    const data = await webhookRequest<{ webhooks: Webhook[] }>('/api/webhooks')
    return data.webhooks || []
  } catch {
    const local = getLocalWebhooks()
    return local.length > 0 ? local : MOCK_WEBHOOKS
  }
}

/**
 * 获取 Webhook 详情
 */
export async function getWebhook(id: string): Promise<Webhook | null> {
  try {
    const data = await webhookRequest<{ webhook: Webhook }>(`/api/webhooks/${id}`)
    return data.webhook || null
  } catch {
    const all = [...MOCK_WEBHOOKS, ...getLocalWebhooks()]
    return all.find(w => w.id === id) || null
  }
}

// ============ 创建 / 更新 / 删除 ============

/**
 * 创建 Webhook
 */
export async function createWebhook(
  url: string,
  events: WebhookEvent[],
  options: { secret?: string; name?: string; description?: string } = {}
): Promise<Webhook> {
  const body = {
    url,
    events,
    secret: options.secret,
    name: options.name,
    description: options.description,
  }

  try {
    const data = await webhookRequest<{ webhook: Webhook }>('/api/webhooks', {
      method: 'POST',
      body: JSON.stringify(body),
    })
    return data.webhook
  } catch {
    // 本地模拟
    const now = new Date().toISOString()
    const newHook: Webhook = {
      id: 'wh_local_' + Date.now(),
      url,
      name: options.name,
      events,
      secret: options.secret,
      active: true,
      createdAt: now,
      updatedAt: now,
      triggerCount: 0,
      failureCount: 0,
      description: options.description,
    }
    const hooks = getLocalWebhooks()
    hooks.push(newHook)
    saveLocalWebhooks(hooks)
    return newHook
  }
}

/**
 * 更新 Webhook
 */
export async function updateWebhook(
  id: string,
  data: Partial<Pick<Webhook, 'url' | 'events' | 'active' | 'name' | 'description' | 'secret'>>
): Promise<Webhook> {
  try {
    const result = await webhookRequest<{ webhook: Webhook }>(`/api/webhooks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
    return result.webhook
  } catch {
    // 本地模拟
    const hooks = getLocalWebhooks()
    const idx = hooks.findIndex(w => w.id === id)
    if (idx >= 0) {
      hooks[idx] = { ...hooks[idx], ...data, updatedAt: new Date().toISOString() }
      saveLocalWebhooks(hooks)
      return hooks[idx]
    }
    throw new Error('Webhook 不存在')
  }
}

/**
 * 删除 Webhook
 */
export async function deleteWebhook(id: string): Promise<boolean> {
  try {
    await webhookRequest(`/api/webhooks/${id}`, { method: 'DELETE' })
    return true
  } catch {
    // 本地模拟
    const hooks = getLocalWebhooks()
    saveLocalWebhooks(hooks.filter(w => w.id !== id))
    return true
  }
}

// ============ 日志 ============

/**
 * 获取 Webhook 触发日志
 */
export async function getWebhookLogs(id: string, limit = 20): Promise<WebhookLog[]> {
  try {
    const data = await webhookRequest<{ logs: WebhookLog[] }>(`/api/webhooks/${id}/logs?limit=${limit}`)
    return data.logs || []
  } catch {
    // 返回模拟日志
    const events: WebhookEvent[] = ['message.created', 'conversation.created', 'task.completed']
    const logs: WebhookLog[] = []
    const baseTime = Date.now()

    for (let i = 0; i < limit; i++) {
      const success = Math.random() > 0.1
      const duration = Math.floor(Math.random() * 500) + 50
      logs.push({
        id: `log_${id}_${i}`,
        webhookId: id,
        event: events[Math.floor(Math.random() * events.length)],
        url: MOCK_WEBHOOKS[0]?.url || '',
        statusCode: success ? 200 : (Math.random() > 0.5 ? 500 : 404),
        success,
        requestBody: '{"event":"...","data":{...}}',
        responseBody: success ? '{"ok":true}' : '{"error":"Internal Server Error"}',
        errorMessage: success ? undefined : '服务器内部错误',
        durationMs: duration,
        timestamp: new Date(baseTime - i * 3600000).toISOString(),
        eventId: `evt_${Date.now() - i * 3600000}_${Math.random().toString(36).slice(2, 8)}`,
      })
    }
    return logs
  }
}

// ============ 测试 ============

/**
 * 测试 Webhook 发送
 */
export async function testWebhook(id: string): Promise<{ success: boolean; durationMs: number; error?: string }> {
  const startTime = Date.now()
  try {
    const data = await webhookRequest<{ success: boolean; durationMs: number }>(
      `/api/webhooks/${id}/test`,
      { method: 'POST' }
    )
    return { ...data, durationMs: data.durationMs || Date.now() - startTime }
  } catch (err: any) {
    return {
      success: false,
      durationMs: Date.now() - startTime,
      error: err?.message || '测试失败',
    }
  }
}

// ============ HMAC 签名验证 ============

/**
 * 生成 HMAC-SHA256 签名
 */
export async function generateSignature(
  payload: string,
  secret: string
): Promise<string> {
  try {
    const encoder = new TextEncoder()
    const keyData = encoder.encode(secret)
    const messageData = encoder.encode(payload)

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData)
    const signatureArray = Array.from(new Uint8Array(signature))
    const hexSignature = signatureArray
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    return `sha256=${hexSignature}`
  } catch {
    // 回退到简单的哈希（不推荐，但作为降级方案）
    return `sha256=${simpleHash(payload + secret)}`
  }
}

/**
 * 验证 Webhook 签名
 */
export async function verifySignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const expected = await generateSignature(payload, secret)
    // 恒定时间比较，防止时序攻击
    return timingSafeEqual(signature, expected)
  } catch {
    return false
  }
}

/**
 * 恒定时间字符串比较
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

/**
 * 简单哈希函数（降级用，不保证安全）
 */
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16).padStart(8, '0')
}

// ============ Webhook 请求构造 ============

/**
 * 构造 Webhook 请求 payload
 */
export function buildWebhookPayload<T>(
  event: WebhookEvent,
  data: T
): WebhookPayload<T> {
  return {
    eventId: 'evt_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10),
    event,
    timestamp: new Date().toISOString(),
    data,
  }
}

/**
 * 构造 Webhook 请求头
 */
export async function buildWebhookHeaders(
  payload: WebhookPayload,
  secret?: string
): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Event-Id': payload.eventId,
    'X-Event-Type': payload.event,
    'X-Timestamp': payload.timestamp,
  }

  if (secret) {
    const signature = await generateSignature(JSON.stringify(payload), secret)
    headers['X-Signature'] = signature
  }

  return headers
}

// ============ 事件类型 ============

/**
 * 获取所有支持的事件类型
 */
export function getWebhookEvents(): { value: WebhookEvent; label: string; description: string; category: string }[] {
  return [
    { value: 'message.created', label: '消息创建', description: '当有新消息创建时触发', category: '消息' },
    { value: 'conversation.created', label: '对话创建', description: '当创建新对话时触发', category: '对话' },
    { value: 'tool.executed', label: '工具执行', description: '当工具执行完成时触发', category: '工具' },
    { value: 'task.completed', label: '任务完成', description: '当定时任务完成时触发', category: '任务' },
    { value: 'user.registered', label: '用户注册', description: '当有新用户注册时触发', category: '用户' },
    { value: 'backup.completed', label: '备份完成', description: '当数据备份完成时触发', category: '备份' },
    { value: 'knowledge.created', label: '知识创建', description: '当知识库条目创建时触发', category: '知识库' },
    { value: 'knowledge.updated', label: '知识更新', description: '当知识库条目更新时触发', category: '知识库' },
    { value: 'knowledge.deleted', label: '知识删除', description: '当知识库条目删除时触发', category: '知识库' },
    { value: 'agent.created', label: 'Agent 创建', description: '当 Agent 创建时触发', category: 'Agent' },
    { value: 'agent.updated', label: 'Agent 更新', description: '当 Agent 更新时触发', category: 'Agent' },
    { value: 'plugin.installed', label: '插件安装', description: '当插件安装时触发', category: '插件' },
    { value: 'settings.updated', label: '设置更新', description: '当系统设置更新时触发', category: '设置' },
  ]
}

// ============ 失败重试策略 ============

/**
 * 获取失败重试策略说明
 */
export function getRetryPolicy(): {
  maxRetries: number
  backoff: string
  retryableStatusCodes: number[]
  timeoutMs: number
} {
  return {
    maxRetries: 3,
    backoff: '指数退避（1s, 2s, 4s）',
    retryableStatusCodes: [408, 429, 500, 502, 503, 504],
    timeoutMs: 10000,
  }
}

/**
 * 计算重试延迟（指数退避）
 */
export function calculateRetryDelay(retryCount: number, baseDelayMs = 1000): number {
  return Math.min(baseDelayMs * Math.pow(2, retryCount), 30000) // 最大 30 秒
}
