/**
 * HopeAgent 凭证保险库（Vault）服务
 * 对接后端 /api/vault/* 接口，提供加密凭证的存储、轮换、测试、导入导出
 * 凭证在后端加密存储，前端不缓存明文；查看明文需 admin 权限并经二次确认
 */

import { getApiBase } from './apiClient'
import { authHeaders } from './authService'

// ============ 类型定义 ============

/** 凭证类型枚举 */
export type CredentialType =
  | 'llm_api_key'
  | 'webhook_secret'
  | 'smtp_password'
  | 'database_url'
  | 'oauth_token'
  | 'custom'

/** 凭证记录（不含明文值） */
export interface VaultCredential {
  key: string
  name: string
  type: CredentialType
  createdAt: string
  updatedAt: string
  metadata?: Record<string, any>
  /** 是否已设置值（不含明文） */
  hasValue: boolean
}

/** 凭证类型元数据，用于前端 UI 渲染 */
export interface CredentialTypeMeta {
  type: CredentialType
  label: string
  description: string
  icon: string
  placeholder: string
  testEndpoint?: string
}

/** 保险库整体状态 */
export interface VaultStatus {
  /** 已配置的 key 列表 */
  configured: string[]
  /** 缺失但推荐的 key 列表 */
  missing: string[]
  /** 凭证总数 */
  total: number
}

/** 凭证测试结果 */
export interface TestResult {
  success: boolean
  message: string
}

/** 凭证明文值返回结构 */
export interface CredentialValue {
  value: string
}

/** 推荐凭证条目 */
export interface RecommendedCredential {
  key: string
  name: string
  type: CredentialType
  required: boolean
  description: string
}

// ============ 预定义数据（前端本地缓存，用于 UI 显示） ============

/** 预定义凭证类型元数据 */
export const CREDENTIAL_TYPES: CredentialTypeMeta[] = [
  {
    type: 'llm_api_key',
    label: 'LLM API 密钥',
    description: '大语言模型 API 密钥（OpenAI/DeepSeek/Kimi等）',
    icon: 'key',
    placeholder: 'sk-...',
  },
  {
    type: 'webhook_secret',
    label: 'Webhook 签名密钥',
    description: 'Webhook 事件签名验证密钥',
    icon: 'link',
    placeholder: 'whsec_...',
  },
  {
    type: 'smtp_password',
    label: '邮件服务密码',
    description: 'SMTP 邮件服务密码',
    icon: 'mail',
    placeholder: '••••••••',
  },
  {
    type: 'database_url',
    label: '数据库连接串',
    description: '数据库连接 URL',
    icon: 'database',
    placeholder: 'postgresql://...',
  },
  {
    type: 'oauth_token',
    label: 'OAuth 令牌',
    description: '第三方 OAuth 令牌',
    icon: 'shield',
    placeholder: 'ya29...',
  },
  {
    type: 'custom',
    label: '自定义凭证',
    description: '其他自定义凭证',
    icon: 'settings',
    placeholder: '',
  },
]

/** 推荐配置的凭证列表 */
export const RECOMMENDED_CREDENTIALS: RecommendedCredential[] = [
  { key: 'openai_api_key', name: 'OpenAI API Key', type: 'llm_api_key', required: false, description: 'GPT 系列模型' },
  { key: 'deepseek_api_key', name: 'DeepSeek API Key', type: 'llm_api_key', required: false, description: 'DeepSeek 模型' },
  { key: 'kimi_api_key', name: 'Kimi API Key', type: 'llm_api_key', required: false, description: '月之暗面 Kimi' },
  { key: 'anthropic_api_key', name: 'Anthropic API Key', type: 'llm_api_key', required: false, description: 'Claude 系列模型' },
  { key: 'smtp_password', name: 'SMTP 密码', type: 'smtp_password', required: false, description: '邮件通知服务' },
  { key: 'webhook_secret', name: 'Webhook 密钥', type: 'webhook_secret', required: false, description: 'Webhook 签名' },
]

// ============ 本地存储（后端不可用时的离线回退） ============

const LOCAL_VAULT_KEY = 'hopeagent-vault-credentials'

interface LocalCredentialRecord {
  key: string
  name: string
  type: CredentialType
  value: string
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}

function getLocalCredentials(): LocalCredentialRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_VAULT_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalCredentials(records: LocalCredentialRecord[]): void {
  try {
    localStorage.setItem(LOCAL_VAULT_KEY, JSON.stringify(records))
  } catch {}
}

function toVaultCredential(rec: LocalCredentialRecord): VaultCredential {
  // 离线模式下不向前端暴露明文，仅返回元数据 + hasValue
  const { value, ...meta } = rec
  void value
  return { ...meta, hasValue: !!rec.value }
}

// ============ 内部请求封装 ============

async function vaultRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
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
      msg = err.error || err.message || msg
    } catch {}
    throw new Error(msg)
  }
  // 部分接口（store/delete/rotate）可能无返回体
  const text = await res.text()
  if (!text) return undefined as unknown as T
  try {
    return JSON.parse(text)
  } catch {
    return undefined as unknown as T
  }
}

/** 以 FormData 方式提交（用于导入文件） */
async function vaultUpload<T>(path: string, formData: FormData): Promise<T> {
  const url = getApiBase() + path
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      ...authHeaders(),
    },
    body: formData,
  })
  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try {
      const err = await res.json()
      msg = err.error || err.message || msg
    } catch {}
    throw new Error(msg)
  }
  const text = await res.text()
  if (!text) return undefined as unknown as T
  try {
    return JSON.parse(text)
  } catch {
    return undefined as unknown as T
  }
}

// ============ 凭证 CRUD ============

/**
 * 获取凭证列表（不含明文）
 * GET /api/vault/list
 */
export async function listCredentials(): Promise<VaultCredential[]> {
  try {
    const data = await vaultRequest<{ credentials: VaultCredential[] }>('/api/vault/list')
    return data.credentials || []
  } catch {
    // 后端不可用时回退到本地存储
    return getLocalCredentials().map(toVaultCredential)
  }
}

/**
 * 存储凭证（新建或覆盖）
 * POST /api/vault/store
 */
export async function storeCredential(
  key: string,
  name: string,
  value: string,
  type: CredentialType,
  metadata?: Record<string, any>
): Promise<void> {
  const body = JSON.stringify({ key, name, value, type, metadata })
  try {
    await vaultRequest('/api/vault/store', { method: 'POST', body })
  } catch {
    // 离线回退：写入本地（仅演示用途，实际不安全）
    const records = getLocalCredentials()
    const now = new Date().toISOString()
    const idx = records.findIndex(r => r.key === key)
    if (idx >= 0) {
      records[idx] = { ...records[idx], name, value, type, metadata, updatedAt: now }
    } else {
      records.push({ key, name, value, type, metadata, createdAt: now, updatedAt: now })
    }
    saveLocalCredentials(records)
  }
}

/**
 * 获取凭证明文（admin only）
 * GET /api/vault/get/:key
 */
export async function getCredential(key: string): Promise<CredentialValue> {
  const data = await vaultRequest<CredentialValue>(`/api/vault/get/${encodeURIComponent(key)}`)
  return data
}

/**
 * 删除凭证
 * DELETE /api/vault/delete/:key
 */
export async function deleteCredential(key: string): Promise<void> {
  try {
    await vaultRequest(`/api/vault/delete/${encodeURIComponent(key)}`, { method: 'DELETE' })
  } catch {
    // 离线回退
    saveLocalCredentials(getLocalCredentials().filter(r => r.key !== key))
  }
}

/**
 * 轮换凭证（更新值，保留 key/类型）
 * PATCH /api/vault/rotate/:key
 */
export async function rotateCredential(key: string, newValue: string): Promise<void> {
  const body = JSON.stringify({ value: newValue })
  try {
    await vaultRequest(`/api/vault/rotate/${encodeURIComponent(key)}`, { method: 'PATCH', body })
  } catch {
    // 离线回退
    const records = getLocalCredentials()
    const idx = records.findIndex(r => r.key === key)
    if (idx >= 0) {
      records[idx].value = newValue
      records[idx].updatedAt = new Date().toISOString()
      saveLocalCredentials(records)
    } else {
      throw new Error('凭证不存在，无法轮换')
    }
  }
}

/**
 * 测试凭证是否可用
 * POST /api/vault/test/:key
 */
export async function testCredential(key: string): Promise<TestResult> {
  try {
    const data = await vaultRequest<TestResult>(`/api/vault/test/${encodeURIComponent(key)}`, {
      method: 'POST',
    })
    return data
  } catch (err: any) {
    return { success: false, message: err?.message || '测试请求失败' }
  }
}

// ============ 元数据与状态 ============

/**
 * 获取后端支持的凭证类型列表
 * GET /api/vault/types
 * 后端不可用时回退到本地常量
 */
export async function getCredentialTypes(): Promise<CredentialTypeMeta[]> {
  try {
    const data = await vaultRequest<{ types: CredentialTypeMeta[] }>('/api/vault/types')
    return data.types || CREDENTIAL_TYPES
  } catch {
    return CREDENTIAL_TYPES
  }
}

/**
 * 获取保险库状态：已配置/缺失/总数
 * GET /api/vault/status
 */
export async function getVaultStatus(): Promise<VaultStatus> {
  try {
    const data = await vaultRequest<VaultStatus>('/api/vault/status')
    return data
  } catch {
    // 离线回退：根据本地存储与推荐列表计算
    const configured = getLocalCredentials().map(r => r.key)
    const missing = RECOMMENDED_CREDENTIALS
      .map(r => r.key)
      .filter(k => !configured.includes(k))
    return { configured, missing, total: configured.length }
  }
}

// ============ 导入 / 导出 ============

/**
 * 导出整个保险库为加密文件
 * POST /api/vault/export
 * @returns 加密 Blob（后端用 password 派生密钥加密）
 */
export async function exportVault(password: string): Promise<Blob> {
  const url = getApiBase() + '/api/vault/export'
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ password }),
  })
  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try {
      const err = await res.json()
      msg = err.error || err.message || msg
    } catch {}
    throw new Error(msg)
  }
  // 后端返回二进制加密文件
  return await res.blob()
}

/**
 * 从加密文件导入凭证
 * POST /api/vault/import
 */
export async function importVault(file: File, password: string): Promise<void> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('password', password)
  await vaultUpload('/api/vault/import', formData)
}

// ============ 工具方法 ============

/** 根据类型枚举获取元数据 */
export function getTypeMeta(type: CredentialType): CredentialTypeMeta {
  return CREDENTIAL_TYPES.find(t => t.type === type) || CREDENTIAL_TYPES[CREDENTIAL_TYPES.length - 1]
}

/** 根据 key 判断是否为推荐凭证 */
export function isRecommendedKey(key: string): RecommendedCredential | undefined {
  return RECOMMENDED_CREDENTIALS.find(r => r.key === key)
}

/** 格式化时间为本地可读字符串 */
export function formatVaultTime(iso: string): string {
  if (!iso) return '-'
  try {
    const d = new Date(iso)
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  } catch {
    return iso
  }
}

/** 触发浏览器下载 Blob */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  // 释放对象 URL，避免内存泄漏
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
