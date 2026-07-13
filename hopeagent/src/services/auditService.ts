/**
 * HopeAgent 审计日志服务
 * 对接后端 /api/admin/audit 接口，提供审计日志查询、统计、导出与本地操作记录
 */

import { getApiBase } from './apiClient'
import { authHeaders } from './authService'

// ============ 类型定义 ============
export type AuditActionType =
  | 'login'
  | 'logout'
  | 'password_change'
  | 'data_delete'
  | 'permission_change'
  | 'settings_change'
  | 'api_key_regenerate'
  | 'user_create'
  | 'user_delete'
  | 'user_update'
  | 'knowledge_create'
  | 'knowledge_update'
  | 'knowledge_delete'
  | 'backup_create'
  | 'backup_restore'
  | 'plugin_install'
  | 'plugin_uninstall'
  | 'agent_create'
  | 'agent_update'
  | 'agent_delete'
  | 'export_data'
  | 'import_data'

export interface AuditLogEntry {
  id: string
  action: AuditActionType
  userId: string
  username: string
  ip?: string
  userAgent?: string
  details?: Record<string, any>
  createdAt: string
  result: 'success' | 'failed'
  errorMessage?: string
}

export interface AuditLogFilters {
  userId?: string
  action?: AuditActionType
  startTime?: string
  endTime?: string
  ip?: string
  result?: 'success' | 'failed'
  page?: number
  pageSize?: number
}

export interface AuditStats {
  total: number
  successCount: number
  failedCount: number
  actionDistribution: Record<AuditActionType, number>
  dailyTrend: { date: string; count: number }[]
  topUsers: { userId: string; username: string; count: number }[]
}

// ============ 常量：审计事件类型中文映射 ============
const ACTION_LABELS: Record<AuditActionType, string> = {
  login: '用户登录',
  logout: '用户登出',
  password_change: '密码修改',
  data_delete: '数据删除',
  permission_change: '权限变更',
  settings_change: '设置修改',
  api_key_regenerate: 'API Key 重置',
  user_create: '用户创建',
  user_delete: '用户删除',
  user_update: '用户更新',
  knowledge_create: '知识创建',
  knowledge_update: '知识更新',
  knowledge_delete: '知识删除',
  backup_create: '备份创建',
  backup_restore: '备份恢复',
  plugin_install: '插件安装',
  plugin_uninstall: '插件卸载',
  agent_create: 'Agent 创建',
  agent_update: 'Agent 更新',
  agent_delete: 'Agent 删除',
  export_data: '数据导出',
  import_data: '数据导入',
}

// ============ 后端接口封装 ============
async function auditRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
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
function generateMockAuditLogs(count = 50): AuditLogEntry[] {
  const actions: AuditActionType[] = [
    'login', 'logout', 'settings_change', 'knowledge_create',
    'knowledge_update', 'backup_create', 'plugin_install',
    'agent_create', 'export_data', 'password_change',
  ]
  const usernames = ['admin', 'zhangsan', 'lisi', 'wangwu', 'zhaoliu']
  const ips = ['192.168.1.100', '10.0.0.50', '172.16.0.25', '192.168.31.88', '10.10.10.5']

  const logs: AuditLogEntry[] = []
  const now = Date.now()

  for (let i = 0; i < count; i++) {
    const action = actions[Math.floor(Math.random() * actions.length)]
    const username = usernames[Math.floor(Math.random() * usernames.length)]
    const isSuccess = Math.random() > 0.1

    logs.push({
      id: 'audit_' + (now - i * 3600000).toString(36),
      action,
      userId: 'user_' + username,
      username,
      ip: ips[Math.floor(Math.random() * ips.length)],
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      createdAt: new Date(now - i * 3600000 * Math.random() * 24).toISOString(),
      result: isSuccess ? 'success' : 'failed',
      errorMessage: isSuccess ? undefined : '操作失败，请重试',
      details: action === 'login' ? { method: 'password' } : undefined,
    })
  }

  return logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

const LOCAL_AUDIT_KEY = 'hopeagent-local-audit'

function getLocalAuditLogs(): AuditLogEntry[] {
  try {
    const raw = localStorage.getItem(LOCAL_AUDIT_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalAuditLogs(logs: AuditLogEntry[]): void {
  try {
    // 最多保留 200 条
    localStorage.setItem(LOCAL_AUDIT_KEY, JSON.stringify(logs.slice(0, 200)))
  } catch {}
}

// ============ 审计日志查询 ============

/**
 * 获取审计日志列表，支持按用户/操作/时间/IP 过滤
 */
export async function getAuditLogs(
  filters: AuditLogFilters = {}
): Promise<{ logs: AuditLogEntry[]; total: number }> {
  try {
    const params = new URLSearchParams()
    if (filters.userId) params.set('userId', filters.userId)
    if (filters.action) params.set('action', filters.action)
    if (filters.startTime) params.set('startTime', filters.startTime)
    if (filters.endTime) params.set('endTime', filters.endTime)
    if (filters.ip) params.set('ip', filters.ip)
    if (filters.result) params.set('result', filters.result)
    if (filters.page) params.set('page', String(filters.page))
    if (filters.pageSize) params.set('pageSize', String(filters.pageSize))

    const data = await auditRequest<{ logs: AuditLogEntry[]; total: number }>(
      `/api/admin/audit?${params.toString()}`
    )
    return { logs: data.logs || [], total: data.total || 0 }
  } catch {
    // 返回模拟数据
    let logs = generateMockAuditLogs(100)

    if (filters.action) {
      logs = logs.filter(l => l.action === filters.action)
    }
    if (filters.userId) {
      logs = logs.filter(l => l.userId === filters.userId)
    }
    if (filters.result) {
      logs = logs.filter(l => l.result === filters.result)
    }
    if (filters.ip) {
      logs = logs.filter(l => l.ip === filters.ip)
    }

    const total = logs.length
    const page = filters.page || 1
    const pageSize = filters.pageSize || 20
    const start = (page - 1) * pageSize

    return {
      logs: logs.slice(start, start + pageSize),
      total,
    }
  }
}

// ============ 审计统计 ============

/**
 * 获取审计统计数据
 */
export async function getAuditStats(): Promise<AuditStats> {
  try {
    const data = await auditRequest<{ stats: AuditStats }>('/api/admin/audit/stats')
    return data.stats
  } catch {
    // 生成模拟统计数据
    const logs = generateMockAuditLogs(200)
    const actionDistribution = {} as Record<AuditActionType, number>

    for (const log of logs) {
      actionDistribution[log.action] = (actionDistribution[log.action] || 0) + 1
    }

    // 最近 7 天趋势
    const dailyTrend: { date: string; count: number }[] = []
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      dailyTrend.push({
        date: dateStr,
        count: Math.floor(Math.random() * 50) + 10,
      })
    }

    // Top 用户
    const userCounts: Record<string, { username: string; count: number }> = {}
    for (const log of logs) {
      if (!userCounts[log.userId]) {
        userCounts[log.userId] = { username: log.username, count: 0 }
      }
      userCounts[log.userId].count++
    }
    const topUsers = Object.entries(userCounts)
      .map(([userId, v]) => ({ userId, ...v }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    const successCount = logs.filter(l => l.result === 'success').length

    return {
      total: logs.length,
      successCount,
      failedCount: logs.length - successCount,
      actionDistribution,
      dailyTrend,
      topUsers,
    }
  }
}

// ============ 导出 ============

/**
 * 导出审计日志
 */
export async function exportAuditLogs(format: 'csv' | 'json' = 'json'): Promise<string> {
  try {
    const data = await auditRequest<{ url: string; content?: string }>(
      `/api/admin/audit/export?format=${format}`
    )
    return data.content || data.url || ''
  } catch {
    const { logs } = await getAuditLogs({ pageSize: 1000 })

    if (format === 'json') {
      return JSON.stringify(logs, null, 2)
    }

    // CSV 格式
    const headers = ['ID', '操作', '用户', 'IP', '结果', '时间', '错误信息']
    const rows = logs.map(log => [
      log.id,
      getActionLabel(log.action),
      log.username,
      log.ip || '',
      log.result === 'success' ? '成功' : '失败',
      log.createdAt,
      log.errorMessage || '',
    ])

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n')

    return csv
  }
}

/**
 * 下载审计日志文件
 */
export function downloadAuditLogs(format: 'csv' | 'json' = 'json'): void {
  exportAuditLogs(format).then(content => {
    const blob = new Blob([content], {
      type: format === 'csv' ? 'text/csv;charset=utf-8' : 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  })
}

// ============ 人类可读描述 ============

/**
 * 获取操作类型中文名称
 */
export function getActionLabel(action: AuditActionType): string {
  return ACTION_LABELS[action] || action
}

/**
 * 格式化审计日志条目为人类可读描述
 */
export function formatAuditEntry(entry: AuditLogEntry): string {
  const actionLabel = getActionLabel(entry.action)
  const time = new Date(entry.createdAt).toLocaleString('zh-CN')
  const result = entry.result === 'success' ? '成功' : '失败'

  let desc = `[${time}] ${entry.username} 执行了「${actionLabel}」操作，结果：${result}`

  if (entry.ip) {
    desc += `，IP：${entry.ip}`
  }

  if (entry.errorMessage) {
    desc += `，错误：${entry.errorMessage}`
  }

  return desc
}

// ============ 本地审计日志（前端操作记录） ============

/**
 * 记录本地审计日志
 */
export function recordLocalAudit(
  action: AuditActionType,
  details?: Record<string, any>,
  result: 'success' | 'failed' = 'success'
): void {
  const entry: AuditLogEntry = {
    id: 'audit_local_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    action,
    userId: 'local',
    username: '当前用户',
    details,
    createdAt: new Date().toISOString(),
    result,
  }

  const logs = getLocalAuditLogs()
  logs.unshift(entry)
  saveLocalAuditLogs(logs)
}

/**
 * 获取本地审计日志
 */
export function getLocalAuditLogsList(): AuditLogEntry[] {
  return getLocalAuditLogs()
}

/**
 * 清空本地审计日志
 */
export function clearLocalAuditLogs(): void {
  try {
    localStorage.removeItem(LOCAL_AUDIT_KEY)
  } catch {}
}

// ============ 操作类型列表 ============

/**
 * 获取所有审计操作类型列表
 */
export function getAuditActionTypes(): { value: AuditActionType; label: string; category: string }[] {
  return [
    { value: 'login', label: '用户登录', category: '账户' },
    { value: 'logout', label: '用户登出', category: '账户' },
    { value: 'password_change', label: '密码修改', category: '账户' },
    { value: 'api_key_regenerate', label: 'API Key 重置', category: '账户' },
    { value: 'permission_change', label: '权限变更', category: '账户' },
    { value: 'user_create', label: '用户创建', category: '用户管理' },
    { value: 'user_update', label: '用户更新', category: '用户管理' },
    { value: 'user_delete', label: '用户删除', category: '用户管理' },
    { value: 'settings_change', label: '设置修改', category: '系统' },
    { value: 'data_delete', label: '数据删除', category: '系统' },
    { value: 'export_data', label: '数据导出', category: '数据' },
    { value: 'import_data', label: '数据导入', category: '数据' },
    { value: 'backup_create', label: '备份创建', category: '备份' },
    { value: 'backup_restore', label: '备份恢复', category: '备份' },
    { value: 'knowledge_create', label: '知识创建', category: '知识库' },
    { value: 'knowledge_update', label: '知识更新', category: '知识库' },
    { value: 'knowledge_delete', label: '知识删除', category: '知识库' },
    { value: 'plugin_install', label: '插件安装', category: '插件' },
    { value: 'plugin_uninstall', label: '插件卸载', category: '插件' },
    { value: 'agent_create', label: 'Agent 创建', category: 'Agent' },
    { value: 'agent_update', label: 'Agent 更新', category: 'Agent' },
    { value: 'agent_delete', label: 'Agent 删除', category: 'Agent' },
  ]
}

// 导出常量
export { ACTION_LABELS }
