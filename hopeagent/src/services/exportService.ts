/**
 * HopeAgent 导出服务
 * 对接后端 /api/export/* 接口，提供对话导出能力，并带本地兜底实现
 */

import { getApiBase } from './apiClient'
import { authHeaders } from './authService'
import { triggerDownload } from './fileService'
import type { Conversation, ChatMessage } from '@/types'

// ============ 通用下载工具 ============

/** 通过 Blob 触发浏览器下载 */
export function downloadBlob(blob: Blob, filename: string): void {
  triggerDownload(blob, filename)
}

/** 将文本以指定 MIME 下载 */
export function downloadText(text: string, filename: string, mime = 'text/plain'): void {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` })
  downloadBlob(blob, filename)
}

/** 生成带时间戳的文件名 */
export function timestampedName(base: string, ext: string): string {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const ts = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  return `${base}_${ts}.${ext}`
}

// ============ 后端导出接口 ============

/** 调用后端导出接口，返回 Blob */
async function fetchExportBlob(path: string): Promise<Blob> {
  const res = await fetch(`${getApiBase()}${path}`, {
    headers: { ...authHeaders() },
  })
  if (!res.ok) throw new Error(`导出失败: HTTP ${res.status}`)
  return res.blob()
}

/** 导出对话为 Markdown（优先后端，失败回退本地） */
export async function exportConversationMarkdown(id: string, conv?: Conversation): Promise<void> {
  let blob: Blob
  let filename: string
  try {
    blob = await fetchExportBlob(`/api/export/conversation/${id}.md`)
    filename = timestampedName(`conversation_${id}`, 'md')
  } catch {
    if (!conv) throw new Error('后端不可用且未提供本地对话数据')
    const text = formatConversationAsMarkdown(conv)
    blob = new Blob([text], { type: 'text/markdown;charset=utf-8' })
    filename = timestampedName(safeName(conv.title), 'md')
  }
  downloadBlob(blob, filename)
}

/** 导出对话为 JSON（优先后端，失败回退本地） */
export async function exportConversationJSON(id: string, conv?: Conversation): Promise<void> {
  let blob: Blob
  let filename: string
  try {
    blob = await fetchExportBlob(`/api/export/conversation/${id}.json`)
    filename = timestampedName(`conversation_${id}`, 'json')
  } catch {
    if (!conv) throw new Error('后端不可用且未提供本地对话数据')
    const text = JSON.stringify(conv, null, 2)
    blob = new Blob([text], { type: 'application/json;charset=utf-8' })
    filename = timestampedName(safeName(conv.title), 'json')
  }
  downloadBlob(blob, filename)
}

/** 全量备份导出（后端不可用时聚合本地数据） */
export async function exportAll(localData?: { conversations?: Conversation[] }): Promise<void> {
  let blob: Blob
  try {
    blob = await fetchExportBlob('/api/export/all')
  } catch {
    const payload = {
      exportedAt: new Date().toISOString(),
      conversations: localData?.conversations || [],
    }
    const text = JSON.stringify(payload, null, 2)
    blob = new Blob([text], { type: 'application/json;charset=utf-8' })
  }
  downloadBlob(blob, timestampedName('hopeagent_backup', 'json'))
}

// ============ 本地格式化 ============

/** 将对话对象格式化为 Markdown 文本 */
export function formatConversationAsMarkdown(conv: Conversation): string {
  const lines: string[] = []
  lines.push(`# ${conv.title || '未命名对话'}`)
  lines.push('')
  lines.push(`> 导出时间：${new Date().toLocaleString('zh-CN')}`)
  lines.push(`> 对话 ID：${conv.id}`)
  lines.push(`> 创建时间：${formatTime(conv.createdAt)}`)
  lines.push(`> 消息数量：${conv.messages.length}`)
  lines.push('')
  lines.push('---')
  lines.push('')

  for (const msg of conv.messages) {
    lines.push(formatMessageMarkdown(msg))
    lines.push('')
  }

  return lines.join('\n')
}

/** 格式化单条消息为 Markdown */
function formatMessageMarkdown(msg: ChatMessage): string {
  const roleLabel = msg.role === 'user' ? '🧑 用户' : msg.role === 'assistant' ? '🤖 助手' : '⚙️ 系统'
  const agentTag = msg.agentName ? `（${msg.agentName}）` : ''
  const time = formatTime(msg.timestamp)

  const parts: string[] = []
  parts.push(`## ${roleLabel}${agentTag}`)
  parts.push(`*${time}*`)
  parts.push('')
  parts.push(msg.content || '_(空消息)_')

  if (msg.thoughtSteps && msg.thoughtSteps.length > 0) {
    parts.push('')
    parts.push('<details><summary>思考过程</summary>')
    parts.push('')
    for (const step of msg.thoughtSteps) {
      parts.push(`- **[${step.type}]** ${step.content}`)
    }
    parts.push('')
    parts.push('</details>')
  }

  if (msg.toolCalls && msg.toolCalls.length > 0) {
    parts.push('')
    parts.push('<details><summary>工具调用</summary>')
    parts.push('')
    for (const tc of msg.toolCalls) {
      parts.push(`- \`${tc.toolName}\` → ${tc.status}`)
    }
    parts.push('')
    parts.push('</details>')
  }

  return parts.join('\n')
}

/** 导出为纯文本（无 Markdown 语法） */
export function formatConversationAsText(conv: Conversation): string {
  const lines: string[] = []
  lines.push(`对话：${conv.title}`)
  lines.push(`时间：${formatTime(conv.createdAt)}`)
  lines.push('='.repeat(40))
  lines.push('')
  for (const msg of conv.messages) {
    const label = msg.role === 'user' ? '用户' : msg.role === 'assistant' ? '助手' : '系统'
    lines.push(`[${label}] ${formatTime(msg.timestamp)}`)
    lines.push(msg.content || '')
    lines.push('-'.repeat(40))
    lines.push('')
  }
  return lines.join('\n')
}

// ============ 辅助 ============

function formatTime(ts: string): string {
  try {
    return new Date(ts).toLocaleString('zh-CN')
  } catch {
    return ts
  }
}

/** 生成文件名安全字符串 */
function safeName(title: string): string {
  return (title || 'conversation')
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\s+/g, '_')
    .slice(0, 40) || 'conversation'
}
