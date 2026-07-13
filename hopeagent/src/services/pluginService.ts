/**
 * HopeAgent 插件管理服务
 * 对接后端 /api/plugins/* 接口，提供插件列表、安装卸载、启用禁用、权限检查等能力
 */

import { getApiBase } from './apiClient'
import { authHeaders } from './authService'
import type { Plugin, PluginCategory, PluginStatus } from '@/types'

// ============ 扩展类型定义 ============
export type PluginPermission =
  | 'read:chat'
  | 'write:chat'
  | 'read:knowledge'
  | 'write:knowledge'
  | 'read:settings'
  | 'write:settings'
  | 'execute:tool'
  | 'network:request'
  | 'file:read'
  | 'file:write'
  | 'notification:send'
  | 'clipboard:read'
  | 'clipboard:write'

export interface PluginManifest {
  id: string
  name: string
  author: string
  version: string
  description: string
  category: PluginCategory
  icon: string
  features: string[]
  permissions: PluginPermission[]
  entry?: string
  settingsSchema?: Record<string, any>
  hooks?: {
    onLoad?: string
    onUnload?: string
    onMessage?: string
    onToolCall?: string
  }
}

export interface PluginLifecycleHooks {
  onLoad?: (plugin: Plugin) => void
  onUnload?: (pluginId: string) => void
  onMessage?: (pluginId: string, message: any) => any
  onToolCall?: (pluginId: string, toolName: string, args: any) => any
}

// ============ 内置插件注册表（15+ 插件） ============
const BUILTIN_PLUGINS: Plugin[] = [
  {
    id: 'code-formatter',
    name: '代码格式化',
    author: 'HopeAgent',
    version: '1.2.0',
    description: '自动格式化对话中的代码块，支持 20+ 编程语言',
    category: 'tool',
    rating: 4.8,
    installs: 12580,
    icon: '💻',
    features: ['自动格式化', '语法高亮', '复制代码', '多语言支持'],
    permissions: ['read:chat', 'clipboard:write'],
    status: 'available',
    longDescription: '代码格式化插件可以自动识别对话中的代码块，一键格式化为标准风格。支持 Python、JavaScript、TypeScript、Java、Go、Rust 等 20 多种编程语言。',
    versionHistory: [
      { version: '1.2.0', date: '2024-01-15', changes: ['新增 Rust 支持', '优化格式化速度', '修复缩进问题'] },
      { version: '1.1.0', date: '2023-12-20', changes: ['新增 Go 语言支持', '新增自定义风格'] },
    ],
  },
  {
    id: 'translation',
    name: '实时翻译',
    author: 'HopeAgent',
    version: '2.0.1',
    description: '多语言实时翻译，支持 100+ 语言互译',
    category: 'efficiency',
    rating: 4.9,
    installs: 28900,
    icon: '🌐',
    features: ['实时翻译', '100+ 语言', '翻译记忆', '术语库'],
    permissions: ['read:chat', 'write:chat', 'network:request'],
    status: 'recommended',
    longDescription: '实时翻译插件提供高质量的多语言翻译服务，支持中英日韩法德西等 100 多种语言互译。内置翻译记忆和术语库功能，专业术语翻译更准确。',
  },
  {
    id: 'mermaid-diagram',
    name: 'Mermaid 图表',
    author: 'HopeAgent',
    version: '1.5.0',
    description: '在对话中渲染 Mermaid 流程图、时序图、甘特图等',
    category: 'tool',
    rating: 4.7,
    installs: 15600,
    icon: '📊',
    features: ['流程图', '时序图', '甘特图', '类图', '饼图'],
    permissions: ['read:chat'],
    status: 'available',
    longDescription: 'Mermaid 图表插件可以自动识别对话中的 Mermaid 代码块，实时渲染为精美的图表。支持流程图、时序图、甘特图、类图、状态图、饼图等多种图表类型。',
  },
  {
    id: 'markdown-export',
    name: 'Markdown 导出',
    author: 'HopeAgent',
    version: '1.3.2',
    description: '将对话导出为精美的 Markdown、PDF、HTML 格式',
    category: 'import-export',
    rating: 4.6,
    installs: 18200,
    icon: '📝',
    features: ['Markdown 导出', 'PDF 导出', 'HTML 导出', '自定义模板'],
    permissions: ['read:chat', 'file:write'],
    status: 'available',
    longDescription: 'Markdown 导出插件可以将完整的对话历史导出为各种格式，支持自定义模板和样式。导出的文件可以直接用于文档、报告或分享。',
  },
  {
    id: 'voice-input',
    name: '语音输入',
    author: 'HopeAgent',
    version: '1.1.0',
    description: '语音转文字输入，支持多种语言识别',
    category: 'efficiency',
    rating: 4.5,
    installs: 9800,
    icon: '🎤',
    features: ['语音识别', '多语言支持', '实时转写', '标点自动添加'],
    permissions: ['write:chat'],
    status: 'available',
    longDescription: '语音输入插件让你可以通过语音与 AI 对话，支持中文、英文、日文等多种语言的实时语音识别，自动添加标点符号。',
  },
  {
    id: 'dark-theme',
    name: '深色主题增强',
    author: 'HopeAgent',
    version: '2.1.0',
    description: '提供多种精美的深色主题，护眼且美观',
    category: 'theme',
    rating: 4.8,
    installs: 22300,
    icon: '🌙',
    features: ['多款深色主题', '护眼模式', '自定义配色', '自动切换'],
    permissions: ['read:settings', 'write:settings'],
    status: 'recommended',
    longDescription: '深色主题增强插件提供多款精心设计的深色主题，包括赛博朋克、黑客帝国、夕阳等风格。支持根据时间自动切换主题，保护你的眼睛。',
  },
  {
    id: 'code-explainer',
    name: '代码解释器',
    author: 'HopeAgent',
    version: '1.4.0',
    description: '逐行解释代码，支持添加注释、重构建议',
    category: 'tool',
    rating: 4.7,
    installs: 16700,
    icon: '🔍',
    features: ['逐行解释', '添加注释', '重构建议', '复杂度分析'],
    permissions: ['read:chat', 'execute:tool'],
    status: 'available',
    longDescription: '代码解释器插件可以帮助你理解复杂的代码，提供逐行解释、自动添加注释、代码重构建议和复杂度分析等功能。',
  },
  {
    id: 'pomodoro',
    name: '番茄钟助手',
    author: 'HopeAgent',
    version: '1.0.5',
    description: '内置番茄钟工作法，提升专注效率',
    category: 'efficiency',
    rating: 4.6,
    installs: 7500,
    icon: '🍅',
    features: ['番茄钟计时', '专注统计', '休息提醒', '自定义时长'],
    permissions: ['notification:send'],
    status: 'available',
    longDescription: '番茄钟助手插件帮助你使用番茄工作法提高专注力，支持自定义工作和休息时长，统计专注时长，发送休息提醒。',
  },
  {
    id: 'agent-builder',
    name: 'Agent 构建器',
    author: 'HopeAgent',
    version: '1.8.0',
    description: '可视化构建自定义 Agent，拖拽式编排工作流',
    category: 'agent',
    rating: 4.9,
    installs: 31200,
    icon: '🤖',
    features: ['可视化编排', '拖拽设计', '工作流模板', '测试调试'],
    permissions: ['read:settings', 'write:settings', 'execute:tool'],
    status: 'recommended',
    longDescription: 'Agent 构建器插件提供可视化的 Agent 开发环境，支持拖拽式工作流编排，内置多种节点类型和模板，让你轻松创建专属 AI Agent。',
  },
  {
    id: 'knowledge-sync',
    name: '知识库同步',
    author: 'HopeAgent',
    version: '1.2.3',
    description: '与 Notion、Obsidian、飞书等知识库双向同步',
    category: 'import-export',
    rating: 4.5,
    installs: 8900,
    icon: '📚',
    features: ['Notion 同步', 'Obsidian 同步', '飞书同步', '增量更新'],
    permissions: ['read:knowledge', 'write:knowledge', 'network:request'],
    status: 'available',
    longDescription: '知识库同步插件可以将 HopeAgent 知识库与主流笔记工具双向同步，支持 Notion、Obsidian、飞书文档等，保持知识内容一致。',
  },
  {
    id: 'api-test',
    name: 'API 测试工具',
    author: 'HopeAgent',
    version: '1.3.0',
    description: '在对话中直接测试 REST API，支持导入 Postman 集合',
    category: 'tool',
    rating: 4.6,
    installs: 11200,
    icon: '⚡',
    features: ['REST 测试', 'Postman 导入', '环境变量', '历史记录'],
    permissions: ['network:request', 'file:read'],
    status: 'available',
    longDescription: 'API 测试工具插件让你可以在对话中直接发送 HTTP 请求测试 API，支持 GET/POST/PUT/DELETE 等方法，可导入 Postman 集合。',
  },
  {
    id: 'regex-helper',
    name: '正则表达式助手',
    author: 'HopeAgent',
    version: '1.1.2',
    description: '正则表达式生成、测试、可视化解释',
    category: 'tool',
    rating: 4.7,
    installs: 14300,
    icon: '🔤',
    features: ['正则生成', '实时测试', '可视化解释', '常用模板'],
    permissions: ['read:chat'],
    status: 'available',
    longDescription: '正则表达式助手插件可以帮助你生成、测试和理解正则表达式，提供可视化的解释和常用正则模板，让正则不再难。',
  },
  {
    id: 'git-integration',
    name: 'Git 集成',
    author: 'HopeAgent',
    version: '1.6.0',
    description: '与 Git 仓库集成，支持代码审查、提交信息生成',
    category: 'efficiency',
    rating: 4.8,
    installs: 19500,
    icon: '📦',
    features: ['代码审查', '提交信息生成', 'Diff 分析', '分支管理'],
    permissions: ['execute:tool', 'file:read', 'network:request'],
    status: 'recommended',
    longDescription: 'Git 集成插件让 AI 直接参与你的开发工作流，自动生成规范的提交信息，进行代码审查，分析代码变更，提升开发效率。',
  },
  {
    id: 'data-visualizer',
    name: '数据可视化',
    author: 'HopeAgent',
    version: '1.2.0',
    description: '将数据自动转换为图表，支持多种图表类型',
    category: 'tool',
    rating: 4.6,
    installs: 10800,
    icon: '📈',
    features: ['折线图', '柱状图', '饼图', '热力图', '3D 图表'],
    permissions: ['read:chat'],
    status: 'available',
    longDescription: '数据可视化插件可以自动识别对话中的数据，生成精美的图表。支持折线图、柱状图、饼图、散点图、热力图等多种图表类型。',
  },
  {
    id: 'screen-capture',
    name: '截图工具',
    author: 'HopeAgent',
    version: '1.0.3',
    description: '屏幕截图并自动识别内容，支持 OCR 文字提取',
    category: 'tool',
    rating: 4.4,
    installs: 6700,
    icon: '📸',
    features: ['区域截图', '全屏截图', 'OCR 识别', '图片标注'],
    permissions: ['write:chat', 'clipboard:read'],
    status: 'available',
    longDescription: '截图工具插件提供便捷的截图功能，支持区域截图和全屏截图，内置 OCR 文字识别，可以快速提取图片中的文字内容。',
  },
  {
    id: 'cheatsheet',
    name: '速查手册',
    author: 'HopeAgent',
    version: '1.4.1',
    description: '常用命令、语法、快捷键速查，支持自定义',
    category: 'efficiency',
    rating: 4.7,
    installs: 13400,
    icon: '📋',
    features: ['命令速查', '语法参考', '快捷键', '自定义内容'],
    permissions: ['read:settings', 'write:settings'],
    status: 'available',
    longDescription: '速查手册插件内置了常用的编程命令、语法参考、快捷键等内容，支持自定义添加你自己的速查内容，随时快速查阅。',
  },
]

// ============ 本地状态 ============
const INSTALLED_KEY = 'hopeagent-installed-plugins'
const ENABLED_KEY = 'hopeagent-enabled-plugins'
const lifecycleHooks: PluginLifecycleHooks = {}

function getInstalledIds(): string[] {
  try {
    const raw = localStorage.getItem(INSTALLED_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveInstalledIds(ids: string[]): void {
  try {
    localStorage.setItem(INSTALLED_KEY, JSON.stringify(ids))
  } catch {}
}

function getEnabledIds(): string[] {
  try {
    const raw = localStorage.getItem(ENABLED_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveEnabledIds(ids: string[]): void {
  try {
    localStorage.setItem(ENABLED_KEY, JSON.stringify(ids))
  } catch {}
}

// ============ 后端接口封装 ============
async function pluginRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
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

// ============ 插件列表与详情 ============

/**
 * 获取插件列表
 * 优先从后端获取，失败则回退到内置插件库
 */
export async function listPlugins(): Promise<Plugin[]> {
  const installed = getInstalledIds()
  const enabled = getEnabledIds()

  try {
    const data = await pluginRequest<{ plugins: Plugin[] }>('/api/plugins')
    const remote = data.plugins || []
    if (Array.isArray(remote) && remote.length > 0) {
      return remote.map(p => ({
        ...p,
        status: installed.includes(p.id)
          ? (enabled.includes(p.id) ? 'installed' : 'disabled')
          : p.status || 'available',
      }))
    }
  } catch {
    // 后端不可用，使用内置数据
  }

  return BUILTIN_PLUGINS.map(p => ({
    ...p,
    status: installed.includes(p.id)
      ? (enabled.includes(p.id) ? 'installed' : 'disabled')
      : p.status,
  }))
}

/**
 * 获取插件详情与清单
 */
export async function getPlugin(id: string): Promise<Plugin | null> {
  try {
    const data = await pluginRequest<{ plugin: Plugin }>(`/api/plugins/${id}/manifest`)
    return data.plugin || null
  } catch {
    const plugin = BUILTIN_PLUGINS.find(p => p.id === id)
    return plugin || null
  }
}

// ============ 启用 / 禁用 ============

/**
 * 启用插件
 */
export async function enablePlugin(id: string): Promise<boolean> {
  const enabled = getEnabledIds()
  if (enabled.includes(id)) return true

  try {
    await pluginRequest(`/api/plugins/${id}/enable`, { method: 'POST' })
  } catch {
    // 后端不可用时仅本地生效
  }

  enabled.push(id)
  saveEnabledIds(enabled)

  // 触发 onLoad 钩子
  const plugin = BUILTIN_PLUGINS.find(p => p.id === id)
  if (plugin && lifecycleHooks.onLoad) {
    lifecycleHooks.onLoad(plugin)
  }

  return true
}

/**
 * 禁用插件
 */
export async function disablePlugin(id: string): Promise<boolean> {
  const enabled = getEnabledIds()
  if (!enabled.includes(id)) return true

  try {
    await pluginRequest(`/api/plugins/${id}/disable`, { method: 'POST' })
  } catch {
    // 后端不可用时仅本地生效
  }

  const newEnabled = enabled.filter(x => x !== id)
  saveEnabledIds(newEnabled)

  // 触发 onUnload 钩子
  if (lifecycleHooks.onUnload) {
    lifecycleHooks.onUnload(id)
  }

  return true
}

// ============ 安装 / 卸载 ============

/**
 * 安装插件
 */
export async function installPlugin(id: string, version?: string): Promise<boolean> {
  const installed = getInstalledIds()
  if (installed.includes(id)) return true

  try {
    await pluginRequest('/api/plugins/install', {
      method: 'POST',
      body: JSON.stringify({ id, version }),
    })
  } catch {
    // 后端不可用时仅本地模拟
  }

  installed.push(id)
  saveInstalledIds(installed)

  // 默认启用
  const enabled = getEnabledIds()
  if (!enabled.includes(id)) {
    enabled.push(id)
    saveEnabledIds(enabled)
    const plugin = BUILTIN_PLUGINS.find(p => p.id === id)
    if (plugin && lifecycleHooks.onLoad) {
      lifecycleHooks.onLoad(plugin)
    }
  }

  return true
}

/**
 * 卸载插件
 */
export async function uninstallPlugin(id: string): Promise<boolean> {
  const installed = getInstalledIds()
  if (!installed.includes(id)) return true

  try {
    await pluginRequest(`/api/plugins/${id}`, { method: 'DELETE' })
  } catch {
    // 后端不可用时仅本地模拟
  }

  // 先禁用
  const enabled = getEnabledIds()
  if (enabled.includes(id)) {
    saveEnabledIds(enabled.filter(x => x !== id))
    if (lifecycleHooks.onUnload) {
      lifecycleHooks.onUnload(id)
    }
  }

  saveInstalledIds(installed.filter(x => x !== id))
  return true
}

// ============ 插件生命周期钩子 ============

/**
 * 注册插件生命周期钩子
 */
export function registerPluginHooks(hooks: PluginLifecycleHooks): void {
  Object.assign(lifecycleHooks, hooks)
}

/**
 * 触发插件消息钩子
 */
export function sendPluginMessage(pluginId: string, message: any): any {
  if (lifecycleHooks.onMessage) {
    return lifecycleHooks.onMessage(pluginId, message)
  }
  return null
}

/**
 * 触发插件工具调用钩子
 */
export function callPluginTool(pluginId: string, toolName: string, args: any): any {
  if (lifecycleHooks.onToolCall) {
    return lifecycleHooks.onToolCall(pluginId, toolName, args)
  }
  return null
}

// ============ 权限检查 ============

/**
 * 检查插件是否拥有指定权限
 */
export function checkPluginPermission(pluginId: string, permission: PluginPermission): boolean {
  const plugin = BUILTIN_PLUGINS.find(p => p.id === pluginId)
  if (!plugin) return false
  return plugin.permissions.includes(permission as string)
}

/**
 * 获取插件权限列表
 */
export function getPluginPermissions(pluginId: string): PluginPermission[] {
  const plugin = BUILTIN_PLUGINS.find(p => p.id === pluginId)
  if (!plugin) return []
  return plugin.permissions as PluginPermission[]
}

// ============ 分类与搜索 ============

/**
 * 按分类获取插件
 */
export function getPluginsByCategory(
  category: PluginCategory,
  plugins: Plugin[] = BUILTIN_PLUGINS
): Plugin[] {
  return plugins.filter(p => p.category === category)
}

/**
 * 搜索插件
 */
export function searchPlugins(query: string, plugins: Plugin[] = BUILTIN_PLUGINS): Plugin[] {
  const q = query.toLowerCase().trim()
  if (!q) return plugins
  return plugins.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.author.toLowerCase().includes(q) ||
    p.features.some(f => f.toLowerCase().includes(q))
  )
}

/**
 * 获取所有插件分类
 */
export function getPluginCategories(): { value: PluginCategory; label: string; icon: string }[] {
  return [
    { value: 'tool', label: '工具', icon: '🔧' },
    { value: 'agent', label: 'Agent', icon: '🤖' },
    { value: 'theme', label: '主题', icon: '🎨' },
    { value: 'import-export', label: '导入导出', icon: '📦' },
    { value: 'efficiency', label: '效率提升', icon: '⚡' },
  ]
}

// ============ 推荐与热门 ============

/**
 * 获取推荐插件
 */
export function getRecommendedPlugins(plugins: Plugin[] = BUILTIN_PLUGINS): Plugin[] {
  return plugins.filter(p => p.status === 'recommended')
}

/**
 * 获取热门插件（按安装量排序）
 */
export function getPopularPlugins(limit = 10, plugins: Plugin[] = BUILTIN_PLUGINS): Plugin[] {
  return [...plugins].sort((a, b) => b.installs - a.installs).slice(0, limit)
}

/**
 * 获取高评分插件
 */
export function getTopRatedPlugins(limit = 10, plugins: Plugin[] = BUILTIN_PLUGINS): Plugin[] {
  return [...plugins].sort((a, b) => b.rating - a.rating).slice(0, limit)
}

// ============ 已安装 / 已启用状态 ============

/**
 * 获取已安装插件 ID 列表
 */
export function getInstalledPluginIds(): string[] {
  return getInstalledIds()
}

/**
 * 获取已启用插件 ID 列表
 */
export function getEnabledPluginIds(): string[] {
  return getEnabledIds()
}

/**
 * 检查插件是否已安装
 */
export function isPluginInstalled(id: string): boolean {
  return getInstalledIds().includes(id)
}

/**
 * 检查插件是否已启用
 */
export function isPluginEnabled(id: string): boolean {
  return getEnabledIds().includes(id)
}

// 导出内置插件供外部使用
export { BUILTIN_PLUGINS }
