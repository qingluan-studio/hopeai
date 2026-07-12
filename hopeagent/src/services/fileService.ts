/**
 * HopeAgent 文件管理服务
 * 对接后端 /api/files/* 接口，提供上传/下载/列表/删除以及本地工具方法
 */

import { getApiBase } from './apiClient'
import { authHeaders } from './authService'

// ============ 类型定义 ============
export type FileCategory = 'image' | 'text' | 'code' | 'pdf' | 'audio' | 'video' | 'archive' | 'other'

export interface FileInfo {
  id: string
  name: string
  size: number
  mimeType: string
  url?: string
  path?: string
  uploadedAt?: string
  category?: FileCategory
}

export interface UploadOptions {
  onProgress?: (loaded: number, total: number, percent: number) => void
  signal?: AbortSignal
}

// ============ 扩展名映射 ============
const EXT_TO_ICON: Record<string, string> = {
  // 图片
  png: 'Image', jpg: 'Image', jpeg: 'Image', gif: 'Image', webp: 'Image', svg: 'Image', bmp: 'Image', ico: 'Image',
  // 文本
  txt: 'FileText', md: 'FileText', rtf: 'FileText', log: 'FileText',
  // 代码
  js: 'FileCode', ts: 'FileCode', tsx: 'FileCode', jsx: 'FileCode',
  py: 'FileCode', java: 'FileCode', go: 'FileCode', rs: 'FileCode',
  c: 'FileCode', cpp: 'FileCode', h: 'FileCode', cs: 'FileCode',
  html: 'FileCode', css: 'FileCode', json: 'FileCode', yaml: 'FileCode', yml: 'FileCode',
  sh: 'FileCode', sql: 'FileCode', php: 'FileCode', rb: 'FileCode',
  // 文档
  pdf: 'FileText', doc: 'FileText', docx: 'FileText', xls: 'FileText', xlsx: 'FileText', ppt: 'FileText', pptx: 'FileText',
  // 音视频
  mp3: 'Music', wav: 'Music', flac: 'Music', aac: 'Music',
  mp4: 'Video', avi: 'Video', mov: 'Video', mkv: 'Video',
  // 压缩
  zip: 'FileArchive', rar: 'FileArchive', '7z': 'FileArchive', tar: 'FileArchive', gz: 'FileArchive',
}

const IMAGE_EXTS = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico'])
const TEXT_EXTS = new Set(['txt', 'md', 'rtf', 'log', 'csv'])
const CODE_EXTS = new Set([
  'js', 'ts', 'tsx', 'jsx', 'py', 'java', 'go', 'rs', 'c', 'cpp', 'h', 'cs',
  'html', 'css', 'json', 'yaml', 'yml', 'sh', 'sql', 'php', 'rb', 'vue', 'svelte',
])

/** 从文件名提取小写扩展名（不含点） */
export function getExtension(filename: string): string {
  const idx = filename.lastIndexOf('.')
  return idx >= 0 ? filename.slice(idx + 1).toLowerCase() : ''
}

/** 根据扩展名判定文件类别 */
export function getFileCategory(filename: string, mimeType?: string): FileCategory {
  const ext = getExtension(filename)
  if (mimeType?.startsWith('image/') || IMAGE_EXTS.has(ext)) return 'image'
  if (mimeType?.startsWith('audio/') || ['mp3', 'wav', 'flac', 'aac'].includes(ext)) return 'audio'
  if (mimeType?.startsWith('video/') || ['mp4', 'avi', 'mov', 'mkv'].includes(ext)) return 'video'
  if (ext === 'pdf' || mimeType === 'application/pdf') return 'pdf'
  if (CODE_EXTS.has(ext)) return 'code'
  if (TEXT_EXTS.has(ext) || mimeType?.startsWith('text/')) return 'text'
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'archive'
  return 'other'
}

/** 根据 MIME 类型判定是否为图片 */
export function isImage(filename: string, mimeType?: string): boolean {
  return getFileCategory(filename, mimeType) === 'image'
}

/** 是否为可在线预览的文本/代码文件 */
export function isTextLike(filename: string, mimeType?: string): boolean {
  const cat = getFileCategory(filename, mimeType)
  return cat === 'text' || cat === 'code'
}

/** 根据扩展名返回 lucide 图标名 */
export function getFileIcon(filename: string): string {
  const ext = getExtension(filename)
  return EXT_TO_ICON[ext] || 'File'
}

// ============ 大小格式化 ============
/** 将字节数格式化为人类可读字符串，如 1.5 MB */
export function formatFileSize(bytes: number): string {
  if (!bytes || bytes < 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let idx = 0
  let size = bytes
  while (size >= 1024 && idx < units.length - 1) {
    size /= 1024
    idx++
  }
  return `${size.toFixed(idx === 0 ? 0 : 1)} ${units[idx]}`
}

// ============ URL 拼接 ============
/** 拼接后端下载 URL */
export function getFileUrl(id: string): string {
  return `${getApiBase()}/api/files/${id}`
}

/** 拼接直接访问（图片预览等）URL，带 token 时附加 query */
export function getFileAccessUrl(id: string, withToken = false): string {
  const base = getFileUrl(id)
  if (!withToken) return base
  // token 通过 query 供 <img> 等无法加 header 的场景使用
  try {
    const token = localStorage.getItem('hopeagent-auth-token')
    return token ? `${base}?token=${encodeURIComponent(token)}` : base
  } catch {
    return base
  }
}

// ============ 后端接口 ============

/** 上传文件，支持进度回调（使用 XHR 以拿到上传进度） */
export function uploadFile(file: File, opts: UploadOptions = {}): Promise<FileInfo> {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('file', file)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${getApiBase()}/api/files/upload`)

    // 带上鉴权头
    const headers = authHeaders()
    Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v))

    if (opts.onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100)
          opts.onProgress!(e.loaded, e.total, percent)
        }
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText)
          const info: FileInfo = {
            id: data.id || data.filename || String(Date.now()),
            name: data.filename || data.name || file.name,
            size: data.size || file.size,
            mimeType: data.mimeType || file.type,
            url: data.url,
            path: data.path,
            uploadedAt: new Date().toISOString(),
            category: getFileCategory(file.name, file.type),
          }
          resolve(info)
        } catch (err) {
          reject(new Error('解析上传响应失败'))
        }
      } else {
        reject(new Error(`文件上传失败: HTTP ${xhr.status}`))
      }
    }

    xhr.onerror = () => reject(new Error('网络错误，文件上传失败'))
    if (opts.signal) {
      opts.signal.addEventListener('abort', () => {
        xhr.abort()
        reject(new Error('上传已取消'))
      })
    }

    xhr.send(formData)
  })
}

/** 获取文件列表 */
export async function listFiles(): Promise<FileInfo[]> {
  const res = await fetch(`${getApiBase()}/api/files`, {
    headers: { ...authHeaders() },
  })
  if (!res.ok) throw new Error(`获取文件列表失败: HTTP ${res.status}`)
  const data = await res.json()
  const list: FileInfo[] = data.files || data.entries || data || []
  return list.map((f: FileInfo) => ({
    ...f,
    category: f.category || getFileCategory(f.name, f.mimeType),
  }))
}

/** 下载文件为 Blob */
export async function downloadFile(id: string): Promise<Blob> {
  const res = await fetch(getFileUrl(id), {
    headers: { ...authHeaders() },
  })
  if (!res.ok) throw new Error(`下载失败: HTTP ${res.status}`)
  return res.blob()
}

/** 删除文件 */
export async function deleteFile(id: string): Promise<void> {
  const res = await fetch(`${getApiBase()}/api/files/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  })
  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try {
      const err = await res.json()
      msg = err.error || msg
    } catch {}
    throw new Error(msg)
  }
}

/** 读取文本/代码文件内容（用于代码预览） */
export async function readFileText(id: string): Promise<string> {
  const blob = await downloadFile(id)
  return blob.text()
}

/** 触发浏览器下载（通过 Blob） */
export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
