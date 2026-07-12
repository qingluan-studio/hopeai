/**
 * HopeAgent 任务队列服务
 * 对接后端 /api/tasks/* 接口，提供异步任务提交、轮询、取消与本地状态管理
 */

import { getApiBase } from './apiClient'
import { authHeaders } from './authService'

// ============ 类型定义 ============
export type TaskType = 'batch_analyze' | 'vector_reindex' | 'tool_batch' | 'export' | 'import' | 'custom'
export type TaskStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled'

export interface Task {
  id: string
  type: TaskType
  status: TaskStatus
  /** 0-100 进度百分比 */
  progress: number
  payload: any
  result?: any
  error?: string
  createdAt: string
  updatedAt?: string
  startedAt?: string
  finishedAt?: string
}

export interface SubmitTaskOptions {
  /** 任务优先级，数值越大越优先 */
  priority?: number
  /** 超时时间（毫秒），仅用于本地轮询控制 */
  timeoutMs?: number
}

export interface PollOptions {
  onUpdate?: (task: Task) => void
  interval?: number
  timeoutMs?: number
  signal?: AbortSignal
}

// ============ 后端接口 ============

/** 提交任务到后端队列 */
export async function submitTask(type: TaskType, payload: any, opts: SubmitTaskOptions = {}): Promise<Task> {
  const res = await fetch(`${getApiBase()}/api/tasks/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ type, payload, priority: opts.priority }),
  })
  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try {
      const err = await res.json()
      msg = err.error || msg
    } catch {}
    throw new Error(msg)
  }
  const data = await res.json()
  return normalizeTask(data.task || data)
}

/** 获取单个任务详情 */
export async function getTask(id: string): Promise<Task> {
  const res = await fetch(`${getApiBase()}/api/tasks/${id}`, {
    headers: { ...authHeaders() },
  })
  if (!res.ok) throw new Error(`获取任务失败: HTTP ${res.status}`)
  const data = await res.json()
  return normalizeTask(data.task || data)
}

/** 获取任务列表 */
export async function listTasks(): Promise<Task[]> {
  const res = await fetch(`${getApiBase()}/api/tasks`, {
    headers: { ...authHeaders() },
  })
  if (!res.ok) throw new Error(`获取任务列表失败: HTTP ${res.status}`)
  const data = await res.json()
  const list = data.tasks || data || []
  return list.map(normalizeTask)
}

/** 取消任务 */
export async function cancelTask(id: string): Promise<Task> {
  const res = await fetch(`${getApiBase()}/api/tasks/${id}/cancel`, {
    method: 'POST',
    headers: { ...authHeaders() },
  })
  if (!res.ok) throw new Error(`取消任务失败: HTTP ${res.status}`)
  const data = await res.json()
  return normalizeTask(data.task || data)
}

/** 删除任务记录 */
export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${getApiBase()}/api/tasks/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  })
  if (!res.ok) throw new Error(`删除任务失败: HTTP ${res.status}`)
}

// ============ 轮询 ============

/** 判断任务是否处于终态 */
export function isTerminalStatus(status: TaskStatus): boolean {
  return status === 'completed' || status === 'failed' || status === 'cancelled'
}

/**
 * 轮询任务直到完成或超时
 * @returns 最终的 Task 状态
 */
export async function pollTask(id: string, opts: PollOptions = {}): Promise<Task> {
  const interval = opts.interval ?? 1500
  const timeoutMs = opts.timeoutMs ?? 5 * 60 * 1000
  const start = Date.now()

  while (true) {
    if (opts.signal?.aborted) {
      throw new Error('轮询已取消')
    }
    if (Date.now() - start > timeoutMs) {
      throw new Error('任务轮询超时')
    }

    let task: Task
    try {
      task = await getTask(id)
    } catch (err) {
      // 单次查询失败不致命，等待后重试
      await sleep(interval)
      continue
    }

    opts.onUpdate?.(task)

    if (isTerminalStatus(task.status)) {
      return task
    }

    await sleep(interval)
  }
}

// ============ 本地任务状态管理 ============
// 轻量的内存级任务注册表，供 UI 即时展示正在进行的任务

const localTasks = new Map<string, Task>()
const listeners = new Set<() => void>()

/** 注册一个本地任务（通常在 submitTask 成功后调用） */
export function registerLocalTask(task: Task): void {
  localTasks.set(task.id, task)
  notifyListeners()
}

/** 更新本地任务并通知监听者 */
export function updateLocalTask(id: string, updates: Partial<Task>): Task | null {
  const existing = localTasks.get(id)
  if (!existing) return null
  const merged: Task = { ...existing, ...updates, updatedAt: new Date().toISOString() }
  localTasks.set(id, merged)
  notifyListeners()
  return merged
}

/** 从本地注册表移除 */
export function unregisterLocalTask(id: string): void {
  localTasks.delete(id)
  notifyListeners()
}

/** 获取本地注册表快照 */
export function getLocalTasks(): Task[] {
  return Array.from(localTasks.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

/** 获取正在运行的任务数 */
export function getActiveTaskCount(): number {
  let n = 0
  for (const t of localTasks.values()) {
    if (t.status === 'queued' || t.status === 'running') n++
  }
  return n
}

/** 订阅本地任务变化 */
export function subscribeTasks(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function notifyListeners(): void {
  for (const l of listeners) {
    try {
      l()
    } catch {}
  }
}

// ============ 辅助 ============

function normalizeTask(raw: any): Task {
  return {
    id: raw.id || String(Date.now()),
    type: raw.type || 'custom',
    status: raw.status || 'queued',
    progress: typeof raw.progress === 'number' ? raw.progress : 0,
    payload: raw.payload,
    result: raw.result,
    error: raw.error,
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt,
    startedAt: raw.startedAt,
    finishedAt: raw.finishedAt,
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ============ 任务类型描述 ============
export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  batch_analyze: '批量分析',
  vector_reindex: '向量重建索引',
  tool_batch: '工具批量执行',
  export: '导出任务',
  import: '导入任务',
  custom: '自定义任务',
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  queued: '排队中',
  running: '执行中',
  completed: '已完成',
  failed: '已失败',
  cancelled: '已取消',
}
