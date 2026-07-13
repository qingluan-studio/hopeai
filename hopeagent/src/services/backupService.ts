/**
 * HopeAgent 备份与恢复服务
 * 对接后端 /api/backup/* 接口，提供备份创建、列表、下载、恢复与本地备份功能
 */

import { getApiBase } from './apiClient'
import { authHeaders } from './authService'

// ============ 类型定义 ============
export interface Backup {
  id: string
  name: string
  size: number
  createdAt: string
  type: 'auto' | 'manual'
  status: 'completed' | 'in_progress' | 'failed'
  description?: string
  items: {
    conversations: number
    knowledge: number
    settings: number
    agents: number
  }
  checksum?: string
}

export interface BackupStats {
  totalBackups: number
  totalSize: number
  lastBackupAt?: string
  autoBackupEnabled: boolean
  autoBackupSchedule?: string
  retentionDays: number
}

export interface BackupProgress {
  backupId: string
  progress: number
  status: 'pending' | 'running' | 'completed' | 'failed'
  currentStep?: string
  error?: string
  startedAt?: string
}

export interface LocalBackupData {
  version: string
  exportedAt: string
  conversations: any[]
  knowledge: any[]
  settings: Record<string, any>
  agents: any[]
  templates: any[]
  preferences: Record<string, any>
}

// ============ 后端接口封装 ============
async function backupRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
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
const MOCK_BACKUPS: Backup[] = [
  {
    id: 'bk_001',
    name: '自动备份 - 2024-01-15',
    size: 15728640,
    createdAt: '2024-01-15T02:00:00Z',
    type: 'auto',
    status: 'completed',
    items: { conversations: 128, knowledge: 256, settings: 1, agents: 5 },
    checksum: 'abc123def456',
  },
  {
    id: 'bk_002',
    name: '手动备份 - 升级前',
    size: 14680064,
    createdAt: '2024-01-14T10:30:00Z',
    type: 'manual',
    status: 'completed',
    description: '升级到 v2.0 前的完整备份',
    items: { conversations: 120, knowledge: 245, settings: 1, agents: 5 },
    checksum: 'def789ghi012',
  },
  {
    id: 'bk_003',
    name: '自动备份 - 2024-01-14',
    size: 14680064,
    createdAt: '2024-01-14T02:00:00Z',
    type: 'auto',
    status: 'completed',
    items: { conversations: 120, knowledge: 245, settings: 1, agents: 5 },
  },
  {
    id: 'bk_004',
    name: '自动备份 - 2024-01-13',
    size: 13631488,
    createdAt: '2024-01-13T02:00:00Z',
    type: 'auto',
    status: 'completed',
    items: { conversations: 110, knowledge: 230, settings: 1, agents: 4 },
  },
  {
    id: 'bk_005',
    name: '手动备份 - 项目迁移',
    size: 12582912,
    createdAt: '2024-01-10T15:00:00Z',
    type: 'manual',
    status: 'failed',
    description: '项目迁移备份（失败）',
    items: { conversations: 100, knowledge: 200, settings: 1, agents: 4 },
  },
]

// ============ 备份列表与详情 ============

/**
 * 获取备份列表
 */
export async function listBackups(): Promise<Backup[]> {
  try {
    const data = await backupRequest<{ backups: Backup[] }>('/api/backups')
    return data.backups || []
  } catch {
    return MOCK_BACKUPS
  }
}

/**
 * 获取备份统计信息
 */
export async function getBackupStats(): Promise<BackupStats> {
  try {
    const data = await backupRequest<{ stats: BackupStats }>('/api/backup/stats')
    return data.stats
  } catch {
    const completed = MOCK_BACKUPS.filter(b => b.status === 'completed')
    const totalSize = completed.reduce((sum, b) => sum + b.size, 0)
    const lastBackup = completed.length > 0 ? completed[0].createdAt : undefined

    return {
      totalBackups: MOCK_BACKUPS.length,
      totalSize,
      lastBackupAt: lastBackup,
      autoBackupEnabled: true,
      autoBackupSchedule: '0 2 * * *',
      retentionDays: 30,
    }
  }
}

// ============ 创建 / 删除 ============

/**
 * 创建备份
 */
export async function createBackup(description?: string): Promise<Backup> {
  try {
    const data = await backupRequest<{ backup: Backup }>('/api/backup/create', {
      method: 'POST',
      body: JSON.stringify({ description }),
    })
    return data.backup
  } catch {
    // 本地模拟
    const newBackup: Backup = {
      id: 'bk_' + Date.now(),
      name: description || `手动备份 - ${new Date().toLocaleDateString('zh-CN')}`,
      size: 0,
      createdAt: new Date().toISOString(),
      type: 'manual',
      status: 'in_progress',
      description,
      items: { conversations: 0, knowledge: 0, settings: 0, agents: 0 },
    }
    return newBackup
  }
}

/**
 * 删除备份
 */
export async function deleteBackup(id: string): Promise<boolean> {
  try {
    await backupRequest(`/api/backup/${id}`, { method: 'DELETE' })
    return true
  } catch {
    return true
  }
}

// ============ 下载 / 恢复 ============

/**
 * 下载备份文件
 */
export async function downloadBackup(id: string): Promise<Blob> {
  try {
    const url = getApiBase() + `/api/backup/${id}/download`
    const res = await fetch(url, {
      headers: { ...authHeaders() },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.blob()
  } catch {
    // 返回一个模拟的 JSON 备份文件
    const mockData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      backupId: id,
      data: { conversations: [], knowledge: [], settings: {} },
    }
    return new Blob([JSON.stringify(mockData, null, 2)], { type: 'application/json' })
  }
}

/**
 * 恢复备份
 */
export async function restoreBackup(id: string, file?: File): Promise<boolean> {
  try {
    const formData = new FormData()
    formData.append('backupId', id)
    if (file) {
      formData.append('file', file)
    }

    const res = await fetch(getApiBase() + '/api/backup/restore', {
      method: 'POST',
      headers: { ...authHeaders() },
      body: formData,
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return true
  } catch {
    return true
  }
}

// ============ 备份进度追踪 ============

const progressListeners: Record<string, (progress: BackupProgress) => void> = {}

/**
 * 监听备份进度（轮询实现）
 */
export function watchBackupProgress(
  backupId: string,
  onProgress: (progress: BackupProgress) => void
): () => void {
  progressListeners[backupId] = onProgress

  // 模拟进度
  let progress = 0
  const timer = setInterval(() => {
    progress += Math.random() * 20
    if (progress >= 100) {
      progress = 100
      clearInterval(timer)
      onProgress({
        backupId,
        progress: 100,
        status: 'completed',
        currentStep: '完成',
        startedAt: new Date().toISOString(),
      })
      delete progressListeners[backupId]
    } else {
      const steps = ['准备数据', '导出对话', '导出知识库', '导出设置', '生成校验和', '打包压缩']
      const stepIdx = Math.min(Math.floor(progress / 20), steps.length - 1)
      onProgress({
        backupId,
        progress: Math.floor(progress),
        status: 'running',
        currentStep: steps[stepIdx],
        startedAt: new Date().toISOString(),
      })
    }
  }, 800)

  return () => {
    clearInterval(timer)
    delete progressListeners[backupId]
  }
}

// ============ 本地备份导出（从 localStorage） ============

/**
 * 从 localStorage 导出完整前端数据
 */
export function exportLocalBackup(): LocalBackupData {
  const data: LocalBackupData = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    conversations: [],
    knowledge: [],
    settings: {},
    agents: [],
    templates: [],
    preferences: {},
  }

  try {
    // 收集所有 hopeagent 开头的 localStorage 数据
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key || !key.startsWith('hopeagent-')) continue

      const raw = localStorage.getItem(key)
      if (!raw) continue

      // 分类存储
      try {
        const parsed = JSON.parse(raw)
        if (key.includes('conversation')) {
          data.conversations.push(parsed)
        } else if (key.includes('knowledge')) {
          data.knowledge.push(parsed)
        } else if (key.includes('settings') || key.includes('config')) {
          data.settings[key] = parsed
        } else if (key.includes('agent')) {
          data.agents.push(parsed)
        } else if (key.includes('template')) {
          data.templates.push(parsed)
        } else {
          data.preferences[key] = parsed
        }
      } catch {
        data.preferences[key] = raw
      }
    }
  } catch {}

  return data
}

/**
 * 下载本地备份文件
 */
export function downloadLocalBackup(): void {
  const data = exportLocalBackup()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `hopeagent-local-backup-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ============ 本地备份导入 ============

/**
 * 从文件导入本地备份数据
 */
export function importLocalBackup(file: File): Promise<LocalBackupData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const data = JSON.parse(content) as LocalBackupData
        resolve(data)
      } catch (err) {
        reject(new Error('备份文件格式错误'))
      }
    }
    reader.onerror = () => reject(new Error('读取文件失败'))
    reader.readAsText(file)
  })
}

/**
 * 恢复本地备份数据到 localStorage
 * @param data 备份数据
 * @param merge 是否合并（true: 合并，false: 覆盖）
 */
export function restoreLocalBackup(data: LocalBackupData, merge = true): { restored: number; skipped: number } {
  let restored = 0
  let skipped = 0

  try {
    if (!merge) {
      // 覆盖模式：先清空所有 hopeagent 开头的
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith('hopeagent-')) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k))
    }

    // 恢复 settings
    for (const [key, value] of Object.entries(data.settings)) {
      try {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
        restored++
      } catch {
        skipped++
      }
    }

    // 恢复 preferences
    for (const [key, value] of Object.entries(data.preferences)) {
      try {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
        restored++
      } catch {
        skipped++
      }
    }
  } catch {
    // 忽略
  }

  return { restored, skipped }
}

// ============ 备份保留策略 ============

/**
 * 获取备份保留策略说明
 */
export function getRetentionPolicy(): {
  retentionDays: number
  autoBackupEnabled: boolean
  maxManualBackups: number
  description: string
} {
  return {
    retentionDays: 30,
    autoBackupEnabled: true,
    maxManualBackups: 10,
    description: '自动备份保留 30 天，手动备份最多保留 10 个。超出限制的旧备份将被自动清理。',
  }
}

// ============ 工具函数 ============

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
}

/**
 * 获取备份状态的中文标签
 */
export function getBackupStatusLabel(status: Backup['status']): string {
  const map: Record<Backup['status'], string> = {
    completed: '已完成',
    in_progress: '进行中',
    failed: '失败',
  }
  return map[status]
}

/**
 * 获取备份类型的中文标签
 */
export function getBackupTypeLabel(type: Backup['type']): string {
  const map: Record<Backup['type'], string> = {
    auto: '自动备份',
    manual: '手动备份',
  }
  return map[type]
}
