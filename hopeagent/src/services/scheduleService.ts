/**
 * HopeAgent 定时任务服务
 * 对接后端 /api/cron/* 接口，提供定时任务管理、Cron 表达式解析与人类可读描述
 */

import { getApiBase } from './apiClient'
import { authHeaders } from './authService'

// ============ 类型定义 ============
export type CronActionType = 'message' | 'webhook' | 'tool' | 'export'

export type CronJobStatus = 'running' | 'paused' | 'failed'

export interface CronJob {
  id: string
  name: string
  expression: string
  action: CronActionType
  payload?: Record<string, any>
  status: CronJobStatus
  createdAt: string
  updatedAt: string
  lastRunAt?: string
  nextRunAt?: string
  runCount: number
  failCount: number
  description?: string
}

export interface CronLogEntry {
  id: string
  jobId: string
  status: 'success' | 'failed'
  startedAt: string
  finishedAt?: string
  result?: string
  error?: string
}

export interface CronParsedResult {
  expression: string
  nextRuns: Date[]
  humanReadable: string
  fields: {
    minute: string
    hour: string
    dayOfMonth: string
    month: string
    dayOfWeek: string
  }
  isValid: boolean
}

// ============ 后端接口封装 ============
async function cronRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
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

// ============ 本地模拟数据 ============
const MOCK_CRON_JOBS: CronJob[] = [
  {
    id: 'cron_1',
    name: '每日晨间报告',
    expression: '0 8 * * *',
    action: 'message',
    payload: { content: '请生成今日工作计划' },
    status: 'running',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
    lastRunAt: '2024-01-15T08:00:00Z',
    nextRunAt: '2024-01-16T08:00:00Z',
    runCount: 15,
    failCount: 0,
    description: '每天早上8点发送晨间消息',
  },
  {
    id: 'cron_2',
    name: '每周数据备份',
    expression: '0 2 * * 0',
    action: 'export',
    payload: { format: 'json', include: ['conversations', 'knowledge'] },
    status: 'running',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-14T02:00:00Z',
    lastRunAt: '2024-01-14T02:00:00Z',
    nextRunAt: '2024-01-21T02:00:00Z',
    runCount: 2,
    failCount: 0,
    description: '每周日凌晨2点自动备份数据',
  },
  {
    id: 'cron_3',
    name: '知识库同步',
    expression: '0 */6 * * *',
    action: 'tool',
    payload: { tool: 'knowledge-sync', args: { direction: 'pull' } },
    status: 'running',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-15T06:00:00Z',
    lastRunAt: '2024-01-15T06:00:00Z',
    nextRunAt: '2024-01-15T12:00:00Z',
    runCount: 20,
    failCount: 1,
    description: '每6小时同步一次知识库',
  },
  {
    id: 'cron_4',
    name: '周报 Webhook',
    expression: '0 18 * * 5',
    action: 'webhook',
    payload: { url: 'https://example.com/webhook', event: 'weekly-report' },
    status: 'paused',
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-12T18:00:00Z',
    lastRunAt: '2024-01-12T18:00:00Z',
    nextRunAt: '2024-01-19T18:00:00Z',
    runCount: 1,
    failCount: 0,
    description: '每周五下午6点发送周报到 Webhook',
  },
]

const LOCAL_JOBS_KEY = 'hopeagent-cron-jobs'

function getLocalJobs(): CronJob[] {
  try {
    const raw = localStorage.getItem(LOCAL_JOBS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalJobs(jobs: CronJob[]): void {
  try {
    localStorage.setItem(LOCAL_JOBS_KEY, JSON.stringify(jobs))
  } catch {}
}

// ============ 任务列表与详情 ============

/**
 * 获取定时任务列表
 */
export async function listCronJobs(): Promise<CronJob[]> {
  try {
    const data = await cronRequest<{ jobs: CronJob[] }>('/api/cron')
    return data.jobs || []
  } catch {
    const local = getLocalJobs()
    return local.length > 0 ? local : MOCK_CRON_JOBS
  }
}

/**
 * 获取定时任务详情
 */
export async function getCronJob(id: string): Promise<CronJob | null> {
  try {
    const data = await cronRequest<{ job: CronJob }>(`/api/cron/${id}`)
    return data.job || null
  } catch {
    const all = [...MOCK_CRON_JOBS, ...getLocalJobs()]
    return all.find(j => j.id === id) || null
  }
}

// ============ 创建 / 删除 ============

/**
 * 创建定时任务
 */
export async function createCronJob(
  expression: string,
  action: CronActionType,
  payload?: Record<string, any>,
  name?: string
): Promise<CronJob> {
  const jobData = {
    expression,
    action,
    payload,
    name: name || `任务 ${Date.now()}`,
  }

  try {
    const data = await cronRequest<{ job: CronJob }>('/api/cron', {
      method: 'POST',
      body: JSON.stringify(jobData),
    })
    return data.job
  } catch {
    // 本地模拟创建
    const now = new Date().toISOString()
    const newJob: CronJob = {
      id: 'cron_local_' + Date.now(),
      name: jobData.name,
      expression,
      action,
      payload,
      status: 'running',
      createdAt: now,
      updatedAt: now,
      runCount: 0,
      failCount: 0,
      nextRunAt: parseCron(expression).nextRuns[0]?.toISOString(),
    }
    const jobs = getLocalJobs()
    jobs.push(newJob)
    saveLocalJobs(jobs)
    return newJob
  }
}

/**
 * 删除定时任务
 */
export async function deleteCronJob(id: string): Promise<boolean> {
  try {
    await cronRequest(`/api/cron/${id}`, { method: 'DELETE' })
    return true
  } catch {
    // 本地模拟删除
    const jobs = getLocalJobs()
    const filtered = jobs.filter(j => j.id !== id)
    saveLocalJobs(filtered)
    return true
  }
}

// ============ 任务状态管理 ============

/**
 * 暂停定时任务
 */
export async function pauseCronJob(id: string): Promise<boolean> {
  try {
    await cronRequest(`/api/cron/${id}/pause`, { method: 'POST' })
    return true
  } catch {
    const jobs = getLocalJobs()
    const job = jobs.find(j => j.id === id)
    if (job) {
      job.status = 'paused'
      job.updatedAt = new Date().toISOString()
      saveLocalJobs(jobs)
    }
    return true
  }
}

/**
 * 恢复定时任务
 */
export async function resumeCronJob(id: string): Promise<boolean> {
  try {
    await cronRequest(`/api/cron/${id}/resume`, { method: 'POST' })
    return true
  } catch {
    const jobs = getLocalJobs()
    const job = jobs.find(j => j.id === id)
    if (job) {
      job.status = 'running'
      job.updatedAt = new Date().toISOString()
      job.nextRunAt = parseCron(job.expression).nextRuns[0]?.toISOString()
      saveLocalJobs(jobs)
    }
    return true
  }
}

/**
 * 立即执行一次任务
 */
export async function triggerCronJob(id: string): Promise<boolean> {
  try {
    await cronRequest(`/api/cron/${id}/trigger`, { method: 'POST' })
    return true
  } catch {
    // 本地模拟触发
    const jobs = getLocalJobs()
    const job = jobs.find(j => j.id === id)
    if (job) {
      job.runCount++
      job.lastRunAt = new Date().toISOString()
      job.updatedAt = job.lastRunAt
      saveLocalJobs(jobs)
    }
    return true
  }
}

// ============ Cron 表达式解析 ============

/**
 * 解析 Cron 表达式，返回下次执行时间和人类可读描述
 * 支持标准 5 段格式：分 时 日 月 周
 */
export function parseCron(expression: string): CronParsedResult {
  const parts = expression.trim().split(/\s+/)
  const defaultFields = { minute: '*', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' }

  if (parts.length !== 5) {
    return {
      expression,
      nextRuns: [],
      humanReadable: '无效的 Cron 表达式',
      fields: defaultFields,
      isValid: false,
    }
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts
  const fields = { minute, hour, dayOfMonth, month, dayOfWeek }

  // 简单验证
  if (!isValidCronField(minute, 0, 59) ||
      !isValidCronField(hour, 0, 23) ||
      !isValidCronField(dayOfMonth, 1, 31) ||
      !isValidCronField(month, 1, 12) ||
      !isValidCronField(dayOfWeek, 0, 7)) {
    return {
      expression,
      nextRuns: [],
      humanReadable: '无效的 Cron 表达式',
      fields,
      isValid: false,
    }
  }

  const nextRuns = getNextRuns(fields, 5)
  const humanReadable = cronToHuman(expression)

  return {
    expression,
    nextRuns,
    humanReadable,
    fields,
    isValid: true,
  }
}

function isValidCronField(field: string, min: number, max: number): boolean {
  if (field === '*') return true
  const parts = field.split(',')
  for (const part of parts) {
    if (part.includes('/')) {
      const [range, step] = part.split('/')
      if (isNaN(Number(step))) return false
      if (range !== '*' && !isValidRange(range, min, max)) return false
    } else if (part.includes('-')) {
      if (!isValidRange(part, min, max)) return false
    } else {
      const num = Number(part)
      if (isNaN(num) || num < min || num > max) return false
    }
  }
  return true
}

function isValidRange(range: string, min: number, max: number): boolean {
  const [start, end] = range.split('-').map(Number)
  return !isNaN(start) && !isNaN(end) && start >= min && end <= max && start <= end
}

/**
 * 计算接下来 N 次执行时间
 */
function getNextRuns(
  fields: { minute: string; hour: string; dayOfMonth: string; month: string; dayOfWeek: string },
  count: number
): Date[] {
  const runs: Date[] = []
  let current = new Date()
  current.setSeconds(0, 0)
  current.setMinutes(current.getMinutes() + 1)

  const maxIterations = 366 * 24 * 60 // 最多计算一年
  let iterations = 0

  while (runs.length < count && iterations < maxIterations) {
    iterations++
    const minute = current.getMinutes()
    const hour = current.getHours()
    const dayOfMonth = current.getDate()
    const month = current.getMonth() + 1
    const dayOfWeek = current.getDay()

    if (
      matchCronField(fields.minute, minute) &&
      matchCronField(fields.hour, hour) &&
      matchCronField(fields.dayOfMonth, dayOfMonth) &&
      matchCronField(fields.month, month) &&
      matchCronField(fields.dayOfWeek, dayOfWeek)
    ) {
      runs.push(new Date(current))
    }

    current.setMinutes(current.getMinutes() + 1)
  }

  return runs
}

function matchCronField(field: string, value: number): boolean {
  const parts = field.split(',')
  for (const part of parts) {
    if (part === '*') return true

    let rangePart = part
    let step = 1

    if (part.includes('/')) {
      const [r, s] = part.split('/')
      rangePart = r
      step = Number(s)
    }

    let start: number
    let end: number

    if (rangePart === '*') {
      start = 0
      end = 59
    } else if (rangePart.includes('-')) {
      const [s, e] = rangePart.split('-').map(Number)
      start = s
      end = e
    } else {
      const num = Number(rangePart)
      if (step > 1) {
        start = num
        end = 59
      } else {
        return value === num
      }
    }

    if (value >= start && value <= end && (value - start) % step === 0) {
      return true
    }
  }
  return false
}

// ============ Cron 人类可读描述 ============

/**
 * 将 Cron 表达式转换为中文人类可读描述
 */
export function cronToHuman(expression: string): string {
  const parts = expression.trim().split(/\s+/)
  if (parts.length !== 5) return '无效的 Cron 表达式'

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts

  const minuteDesc = describeField(minute, '分钟', 0, 59)
  const hourDesc = describeField(hour, '小时', 0, 23)
  const dayDesc = describeField(dayOfMonth, '日', 1, 31)
  const monthDesc = describeField(month, '月', 1, 12)
  const weekDesc = describeWeek(dayOfWeek)

  // 常见模式的简化描述
  if (minute === '0' && hour !== '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    const hours = hour.split(',').map(h => {
      if (h.includes('/')) {
        const [, step] = h.split('/')
        return `每${step}小时`
      }
      return `${h}点`
    }).join('、')
    return `每天 ${hours}`
  }

  if (minute === '0' && hour === '0' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    return '每天凌晨'
  }

  if (minute === '0' && hour !== '*' && dayOfMonth === '*' && month === '*' && dayOfWeek !== '*') {
    return `每周${weekDesc} ${hourDesc}`
  }

  if (minute !== '*' && hour !== '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    return `每天 ${hourDesc}${minuteDesc}`
  }

  if (dayOfMonth !== '*' && month === '*' && dayOfWeek === '*') {
    return `每月${dayDesc} ${hourDesc}${minuteDesc}`
  }

  if (month !== '*') {
    return `${monthDesc}${dayDesc} ${hourDesc}${minuteDesc}`
  }

  const partsDesc: string[] = []
  if (minute !== '*') partsDesc.push(minuteDesc)
  if (hour !== '*') partsDesc.push(hourDesc)
  if (dayOfMonth !== '*') partsDesc.push(dayDesc)
  if (month !== '*') partsDesc.push(monthDesc)
  if (dayOfWeek !== '*') partsDesc.push(weekDesc)

  return partsDesc.length > 0 ? partsDesc.join(' ') : '每分钟'
}

function describeField(field: string, unit: string, min: number, max: number): string {
  if (field === '*') return ''
  if (field.includes('/')) {
    const [range, step] = field.split('/')
    if (range === '*') {
      return `每${step}${unit}`
    }
    return `${range} 范围内每${step}${unit}`
  }
  if (field.includes('-')) {
    return `${field}${unit}`
  }
  if (field.includes(',')) {
    return `${field}${unit}`
  }
  return `第${field}${unit}`
}

function describeWeek(field: string): string {
  if (field === '*') return ''
  const weekMap: Record<string, string> = {
    '0': '日', '1': '一', '2': '二', '3': '三',
    '4': '四', '5': '五', '6': '六', '7': '日',
  }

  if (field.includes(',')) {
    return field.split(',').map(d => weekMap[d] || d).join('、')
  }
  if (field.includes('-')) {
    const [start, end] = field.split('-')
    return `${weekMap[start] || start}到${weekMap[end] || end}`
  }
  return weekMap[field] || field
}

// ============ 执行历史 ============

/**
 * 获取任务执行历史记录
 */
export async function getCronJobLogs(jobId: string, limit = 20): Promise<CronLogEntry[]> {
  try {
    const data = await cronRequest<{ logs: CronLogEntry[] }>(`/api/cron/${jobId}/logs?limit=${limit}`)
    return data.logs || []
  } catch {
    // 返回模拟数据
    const mockLogs: CronLogEntry[] = []
    const baseTime = Date.now()
    for (let i = 0; i < limit; i++) {
      const isSuccess = Math.random() > 0.1
      mockLogs.push({
        id: `log_${jobId}_${i}`,
        jobId,
        status: isSuccess ? 'success' : 'failed',
        startedAt: new Date(baseTime - i * 86400000).toISOString(),
        finishedAt: new Date(baseTime - i * 86400000 + 5000).toISOString(),
        result: isSuccess ? '执行成功' : undefined,
        error: isSuccess ? undefined : '连接超时',
      })
    }
    return mockLogs
  }
}

// ============ 支持的动作类型 ============

/**
 * 获取支持的动作类型列表
 */
export function getCronActionTypes(): { value: CronActionType; label: string; icon: string; description: string }[] {
  return [
    { value: 'message', label: '发送消息', icon: '💬', description: '定时发送一条消息到对话' },
    { value: 'webhook', label: 'Webhook 调用', icon: '🔔', description: '定时调用指定的 Webhook URL' },
    { value: 'tool', label: '执行工具', icon: '🔧', description: '定时执行指定的工具' },
    { value: 'export', label: '导出数据', icon: '📦', description: '定时导出数据备份' },
  ]
}

/**
 * 常用 Cron 表达式预设
 */
export function getCronPresets(): { label: string; expression: string; description: string }[] {
  return [
    { label: '每分钟', expression: '* * * * *', description: '每分钟执行一次' },
    { label: '每小时', expression: '0 * * * *', description: '每小时第 0 分执行' },
    { label: '每天凌晨', expression: '0 0 * * *', description: '每天 00:00 执行' },
    { label: '每天早上', expression: '0 8 * * *', description: '每天 08:00 执行' },
    { label: '每天中午', expression: '0 12 * * *', description: '每天 12:00 执行' },
    { label: '每天晚上', expression: '0 20 * * *', description: '每天 20:00 执行' },
    { label: '每周一', expression: '0 9 * * 1', description: '每周一 09:00 执行' },
    { label: '每周五', expression: '0 18 * * 5', description: '每周五 18:00 执行' },
    { label: '每月第一天', expression: '0 0 1 * *', description: '每月 1 号 00:00 执行' },
    { label: '每 6 小时', expression: '0 */6 * * *', description: '每 6 小时执行一次' },
    { label: '每 30 分钟', expression: '*/30 * * * *', description: '每 30 分钟执行一次' },
    { label: '工作日', expression: '0 9 * * 1-5', description: '周一到周五 09:00 执行' },
  ]
}
