export interface KnowledgePlugin {
  id: string
  name: string
  description: string
  category: '学术' | '技术' | '百科' | '代码' | '文档' | '数据'
  enabled: boolean
  baseUrl: string
  searchEndpoint: string
  queryParam: string
  headers?: Record<string, string>
  resultLimit: number
  priority: number
  transformResponse: (data: any, query: string) => PluginResultItem[]
  builtin: boolean
}

export interface PluginResultItem {
  title: string
  snippet: string
  url: string
  source: string
  relevance: number
  timestamp: number
}

export interface PluginQueryResult {
  pluginId: string
  pluginName: string
  results: PluginResultItem[]
  duration: number
  error?: string
  cached: boolean
}

interface CachedResult {
  query: string
  results: PluginResultItem[]
  timestamp: number
}

interface KnowledgePluginState {
  plugins: KnowledgePlugin[]
  queryResults: PluginQueryResult[]
  totalQueries: number
  searchInProgress: boolean
  allCacheEnabled: boolean
}

const STORAGE_KEY = 'hopeagent-knowledge-plugins'
const CACHE_TTL = 30 * 60 * 1000
const MAX_RESULTS = 200

function buildWikipediaResults(data: any, _query: string): PluginResultItem[] {
  try {
    const pages = data?.query?.pages || {}
    return Object.values(pages).map((page: any) => ({
      title: page.title || '',
      snippet: (page.extract || '').slice(0, 300),
      url: `https://zh.wikipedia.org/wiki/${encodeURIComponent(page.title || '')}`,
      source: 'Wikipedia',
      relevance: 0.9,
      timestamp: Date.now(),
    }))
  } catch {
    return []
  }
}

function buildArxivResults(data: any, _query: string): PluginResultItem[] {
  try {
    const entries = data?.feed?.entry || []
    const arr = Array.isArray(entries) ? entries : [entries]
    return arr.slice(0, 5).map((e: any) => ({
      title: e.title?.['#text'] || e.title || '',
      snippet: (e.summary?.['#text'] || e.summary || '').slice(0, 300),
      url: e.id || '',
      source: 'ArXiv',
      relevance: 0.8,
      timestamp: Date.now(),
    }))
  } catch {
    return []
  }
}

function buildGitHubResults(data: any, _query: string): PluginResultItem[] {
  try {
    const items = data?.items || []
    return items.slice(0, 5).map((item: any) => ({
      title: item.full_name || item.name || '',
      snippet: item.description || '',
      url: item.html_url || '',
      source: 'GitHub',
      relevance: 0.7,
      timestamp: Date.now(),
    }))
  } catch {
    return []
  }
}

function buildNpmResults(data: any, _query: string): PluginResultItem[] {
  try {
    const objects = data?.objects || []
    return objects.slice(0, 5).map((obj: any) => {
      const pkg = obj.package || {}
      return {
        title: pkg.name || '',
        snippet: pkg.description || '',
        url: pkg.links?.npm || '',
        source: 'npm',
        relevance: 0.7,
        timestamp: Date.now(),
      }
    })
  } catch {
    return []
  }
}

function buildStackOverflowResults(data: any, _query: string): PluginResultItem[] {
  try {
    const items = data?.items || []
    return items.slice(0, 5).map((item: any) => ({
      title: item.title || '',
      snippet: new DOMParser().parseFromString(item.body || '', 'text/html').body.textContent?.slice(0, 300) || '',
      url: item.link || '',
      source: 'Stack Overflow',
      relevance: 0.8,
      timestamp: Date.now(),
    }))
  } catch {
    return []
  }
}

function buildMDNResults(data: any, _query: string): PluginResultItem[] {
  try {
    const documents = data?.documents || []
    return documents.slice(0, 5).map((doc: any) => ({
      title: doc.title || '',
      snippet: doc.summary || doc.excerpt || '',
      url: `https://developer.mozilla.org${doc.mdn_url || ''}`,
      source: 'MDN',
      relevance: 0.85,
      timestamp: Date.now(),
    }))
  } catch {
    return []
  }
}

const BUILTIN_PLUGINS: KnowledgePlugin[] = [
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    description: '维基百科百科知识检索',
    category: '百科',
    enabled: true,
    baseUrl: 'https://zh.wikipedia.org/w/api.php',
    searchEndpoint: '',
    queryParam: '',
    resultLimit: 3,
    priority: 1,
    transformResponse: buildWikipediaResults,
    builtin: true,
  },
  {
    id: 'arxiv',
    name: 'ArXiv',
    description: '学术论文预印本检索',
    category: '学术',
    enabled: true,
    baseUrl: 'http://export.arxiv.org/api/query',
    searchEndpoint: '',
    queryParam: '',
    resultLimit: 5,
    priority: 3,
    transformResponse: buildArxivResults,
    builtin: true,
  },
  {
    id: 'github',
    name: 'GitHub',
    description: '开源仓库与代码搜索',
    category: '代码',
    enabled: true,
    baseUrl: 'https://api.github.com/search/repositories',
    searchEndpoint: '',
    queryParam: '',
    resultLimit: 5,
    priority: 2,
    headers: { 'Accept': 'application/vnd.github.v3+json' },
    transformResponse: buildGitHubResults,
    builtin: true,
  },
  {
    id: 'npm',
    name: 'npm Registry',
    description: 'npm 包搜索与文档',
    category: '技术',
    enabled: true,
    baseUrl: 'https://registry.npmjs.org/-/v1/search',
    searchEndpoint: '',
    queryParam: '',
    resultLimit: 5,
    priority: 4,
    transformResponse: buildNpmResults,
    builtin: true,
  },
  {
    id: 'stackoverflow',
    name: 'Stack Overflow',
    description: '编程问答与解决方案',
    category: '技术',
    enabled: true,
    baseUrl: 'https://api.stackexchange.com/2.3/search/advanced',
    searchEndpoint: '',
    queryParam: '',
    resultLimit: 5,
    priority: 2,
    transformResponse: buildStackOverflowResults,
    builtin: true,
  },
  {
    id: 'mdn',
    name: 'MDN Web Docs',
    description: 'Web 技术标准文档',
    category: '文档',
    enabled: true,
    baseUrl: 'https://developer.mozilla.org/api/v1/search',
    searchEndpoint: '',
    queryParam: '',
    resultLimit: 5,
    priority: 2,
    transformResponse: buildMDNResults,
    builtin: true,
  },
]

const DEFAULT_STATE: KnowledgePluginState = {
  plugins: [],
  queryResults: [],
  totalQueries: 0,
  searchInProgress: false,
  allCacheEnabled: true,
}

const cacheStore = new Map<string, CachedResult>()

function cacheKey(pluginId: string, query: string): string {
  return `${pluginId}::${query.toLowerCase().trim()}`
}

function getCached(pluginId: string, query: string): PluginResultItem[] | null {
  const entry = cacheStore.get(cacheKey(pluginId, query))
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cacheStore.delete(cacheKey(pluginId, query))
    return null
  }
  return entry.results
}

function setCached(pluginId: string, query: string, results: PluginResultItem[]) {
  if (results.length === 0) return
  cacheStore.set(cacheKey(pluginId, query), { query, results, timestamp: Date.now() })
  if (cacheStore.size > 500) {
    const keys = [...cacheStore.keys()]
    for (let i = 0; i < 100; i++) cacheStore.delete(keys[i])
  }
}

function loadState(): Partial<KnowledgePluginState> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {}
  return {}
}

const state: KnowledgePluginState = {
  ...DEFAULT_STATE,
  ...loadState(),
}

if (state.plugins.length === 0) {
  state.plugins = BUILTIN_PLUGINS.map((p) => ({ ...p }))
} else {
  state.plugins = state.plugins.map((p) => {
    if (p.builtin) {
      const builtin = BUILTIN_PLUGINS.find((b) => b.id === p.id)
      if (builtin) {
        return { ...p, transformResponse: builtin.transformResponse }
      }
    }
    return p
  })
}

export function save() {
  try {
    const { queryResults: _qr, searchInProgress: _s, ...persistable } = state
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...persistable }))
  } catch {}
}

export function getPlugins(): KnowledgePlugin[] {
  return state.plugins
}

export function getEnabledPlugins(): KnowledgePlugin[] {
  return state.plugins.filter((p) => p.enabled)
}

export function getRecentResults(): PluginQueryResult[] {
  return state.queryResults.slice(-10)
}

export function getTotalPluginQueries(): number {
  return state.totalQueries
}

export function getEnabledCount(): number {
  return state.plugins.filter((p) => p.enabled).length
}

export function isAllCacheEnabled(): boolean {
  return state.allCacheEnabled
}

export function setAllCacheEnabled(enabled: boolean) {
  state.allCacheEnabled = enabled
  save()
}

export function togglePlugin(pluginId: string) {
  const p = state.plugins.find((pl) => pl.id === pluginId)
  if (p) {
    p.enabled = !p.enabled
    save()
  }
}

export function addCustomPlugin(plugin: Omit<KnowledgePlugin, 'id' | 'builtin'>): KnowledgePlugin {
  const newPlugin: KnowledgePlugin = {
    ...plugin,
    id: `custom-${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    builtin: false,
  }
  state.plugins.push(newPlugin)
  save()
  return newPlugin
}

export function removePlugin(pluginId: string) {
  const p = state.plugins.find((pl) => pl.id === pluginId)
  if (p?.builtin) return
  const idx = state.plugins.findIndex((pl) => pl.id === pluginId)
  if (idx >= 0) state.plugins.splice(idx, 1)
  save()
}

function buildSearchUrl(plugin: KnowledgePlugin, query: string): string {
  const q = encodeURIComponent(query)
  switch (plugin.id) {
    case 'wikipedia':
      return `${plugin.baseUrl}?action=query&list=search&srsearch=${q}&format=json&origin=*&srlimit=${plugin.resultLimit}&prop=extracts&exintro&explaintext`
    case 'arxiv':
      return `${plugin.baseUrl}?search_query=all:${q}&start=0&max_results=${plugin.resultLimit}`
    case 'github':
      return `${plugin.baseUrl}?q=${q}&per_page=${plugin.resultLimit}&sort=stars&order=desc`
    case 'npm':
      return `${plugin.baseUrl}?text=${q}&size=${plugin.resultLimit}`
    case 'stackoverflow':
      return `${plugin.baseUrl}?order=desc&sort=relevance&q=${q}&site=stackoverflow&filter=withbody&pagesize=${plugin.resultLimit}`
    case 'mdn':
      return `${plugin.baseUrl}?q=${q}&locale=zh-CN&page=1&size=${plugin.resultLimit}`
    default:
      return `${plugin.baseUrl}${plugin.searchEndpoint}?${plugin.queryParam}=${q}`
  }
}

export async function queryPlugin(pluginId: string, query: string): Promise<PluginQueryResult> {
  const plugin = state.plugins.find((p) => p.id === pluginId)
  if (!plugin || !plugin.enabled) {
    return { pluginId, pluginName: plugin?.name || '', results: [], duration: 0, error: '插件未启用', cached: false }
  }

  const cached = state.allCacheEnabled ? getCached(pluginId, query) : null
  if (cached) {
    return { pluginId, pluginName: plugin.name, results: cached, duration: 0, cached: true }
  }

  const startTime = performance.now()

  try {
    const url = buildSearchUrl(plugin, query)
    const res = await fetch(url, {
      headers: plugin.headers || {},
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }
    const data = await res.json()
    const results = plugin.transformResponse(data, query).slice(0, plugin.resultLimit)

    if (state.allCacheEnabled && results.length > 0) {
      setCached(pluginId, query, results)
    }

    const duration = performance.now() - startTime
    const qr: PluginQueryResult = { pluginId, pluginName: plugin.name, results, duration, cached: false }
    state.queryResults.push(qr)
    state.totalQueries++

    if (state.queryResults.length > MAX_RESULTS) {
      state.queryResults = state.queryResults.slice(-MAX_RESULTS)
    }

    return qr
  } catch (e: any) {
    const duration = performance.now() - startTime
    const qr: PluginQueryResult = {
      pluginId, pluginName: plugin.name, results: [], duration,
      error: e?.message || '查询失败', cached: false,
    }
    state.queryResults.push(qr)
    state.totalQueries++
    return qr
  }
}

export async function smartSearch(query: string): Promise<PluginQueryResult[]> {
  if (state.searchInProgress) return []
  state.searchInProgress = true

  try {
    const plugins = state.plugins
      .filter((p) => p.enabled)
      .sort((a, b) => a.priority - b.priority)

    const results = await Promise.allSettled(
      plugins.slice(0, 4).map((p) => queryPlugin(p.id, query))
    )

    return results
      .filter((r): r is PromiseFulfilledResult<PluginQueryResult> => r.status === 'fulfilled')
      .map((r) => r.value)
  } finally {
    state.searchInProgress = false
  }
}

export function clearCache() {
  cacheStore.clear()
}

export function clearResults() {
  state.queryResults = []
  state.totalQueries = 0
}

export function getStats() {
  return {
    totalPlugins: state.plugins.length,
    enabledPlugins: getEnabledCount(),
    totalQueries: state.totalQueries,
    cacheSize: cacheStore.size,
    recentResults: state.queryResults.slice(-10).length,
  }
}
