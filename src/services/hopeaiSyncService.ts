import type { KnowledgeEntry } from '@/types'

const STORAGE_KEY = 'hopeai-sync-config'

export interface SyncConfig {
  enabled: boolean
  apiUrl: string
  apiKey: string
  autoSync: boolean
  lastSyncTime: number
  syncStats: {
    totalSynced: number
    created: number
    updated: number
    skipped: number
  }
}

export function getSyncConfig(): SyncConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // ignore
  }
  return {
    enabled: false,
    apiUrl: 'https://hopeai-v20.pages.dev/api',
    apiKey: '',
    autoSync: false,
    lastSyncTime: 0,
    syncStats: {
      totalSynced: 0,
      created: 0,
      updated: 0,
      skipped: 0,
    },
  }
}

export function saveSyncConfig(config: Partial<SyncConfig>): void {
  const current = getSyncConfig()
  const merged = { ...current, ...config }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
}

export function clearSyncConfig(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export async function syncToHopeAI(
  entries: KnowledgeEntry[],
  onProgress?: (current: number, total: number, action: string) => void,
): Promise<{ success: boolean; created: number; updated: number; skipped: number; error?: string }> {
  const config = getSyncConfig()

  if (!config.enabled || !config.apiUrl) {
    return { success: false, created: 0, updated: 0, skipped: 0, error: '同步未启用或API地址未配置' }
  }

  try {
    const syncUrl = config.apiUrl.replace(/\/$/, '') + '/knowledge/sync'

    const payload = {
      items: entries.map(e => ({
        id: e.id,
        title: e.title,
        content: e.content,
        category: e.category,
        tags: e.tags,
        source: e.source || 'hopeagent_pro',
        createdAt: new Date(e.createdAt).toISOString(),
        updatedAt: new Date(e.createdAt).toISOString(),
      })),
      since: config.lastSyncTime,
      source: 'hopeagent_pro',
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (config.apiKey) {
      headers['Authorization'] = `Bearer ${config.apiKey}`
    }

    onProgress?.(0, entries.length, '正在同步...')

    const res = await fetch(syncUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!data.success) {
      return {
        success: false,
        created: 0,
        updated: 0,
        skipped: 0,
        error: data.error || '同步失败',
      }
    }

    onProgress?.(entries.length, entries.length, '同步完成')

    const newStats = {
      totalSynced: config.syncStats.totalSynced + entries.length,
      created: config.syncStats.created + (data.created || 0),
      updated: config.syncStats.updated + (data.updated || 0),
      skipped: config.syncStats.skipped + (data.skipped || 0),
    }

    saveSyncConfig({
      lastSyncTime: Date.now(),
      syncStats: newStats,
    })

    return {
      success: true,
      created: data.created || 0,
      updated: data.updated || 0,
      skipped: data.skipped || 0,
    }
  } catch (e) {
    return {
      success: false,
      created: 0,
      updated: 0,
      skipped: 0,
      error: e instanceof Error ? e.message : '网络错误',
    }
  }
}

export async function testConnection(): Promise<{ success: boolean; totalKnowledge?: number; error?: string }> {
  const config = getSyncConfig()

  if (!config.apiUrl) {
    return { success: false, error: '请先配置API地址' }
  }

  try {
    const listUrl = config.apiUrl.replace(/\/$/, '') + '/knowledge/list?limit=1'
    const res = await fetch(listUrl)
    const data = await res.json()

    if (data.success) {
      return {
        success: true,
        totalKnowledge: data.total || 0,
      }
    }

    return {
      success: false,
      error: data.error || '连接失败',
    }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : '网络错误',
    }
  }
}
