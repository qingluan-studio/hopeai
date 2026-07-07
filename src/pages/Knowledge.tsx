import { useState, useMemo, useEffect } from 'react'
import {
  Search,
  BookOpen,
  Tag,
  Clock,
  Folder,
  ChevronRight,
  X,
  FileText,
  Filter,
  ArrowLeft,
  Download,
  Loader2,
  CheckCircle,
  Github,
  Code2,
  User,
  RefreshCw,
  AlertTriangle,
  Database
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'
import { useKnowledgeStore } from '@/store/useKnowledgeStore'
import { fetchOpenSourceKnowledge, fetchCodeSnippets, fetchMyProjects } from '@/services/knowledgeFetcher'
import { syncToHopeAI, getSyncConfig } from '@/services/hopeaiSyncService'
import type { KnowledgeEntry } from '@/types'

const categories = [
  { id: 'all', name: '全部' },
  { id: '项目规划', name: '规划' },
  { id: '前端开发', name: '前端' },
  { id: '后端开发', name: '后端' },
  { id: '编程语言', name: '语言' },
  { id: '运维部署', name: '运维' },
  { id: '架构设计', name: '架构' },
]

const neonTagColors = [
  'text-green-400 border-green-500/50 bg-green-500/10',
  'text-blue-400 border-blue-500/50 bg-blue-500/10',
  'text-purple-400 border-purple-500/50 bg-purple-500/10',
  'text-yellow-400 border-yellow-500/50 bg-yellow-500/10',
  'text-pink-400 border-pink-500/50 bg-pink-500/10',
  'text-cyan-400 border-cyan-500/50 bg-cyan-500/10',
]

function getTagColor(index: number) {
  return neonTagColors[index % neonTagColors.length]
}

function KnowledgeCard({
  entry,
  onClick
}: {
  entry: KnowledgeEntry
  onClick: () => void
}) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit'
    })
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-3 rounded-xl border bg-gray-900/60 border-gray-800',
        'active:scale-[0.98] transition-transform cursor-pointer'
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-mono text-gray-200 font-medium flex-1 mr-2 line-clamp-1">
          {entry.title}
        </h3>
        <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
      </div>

      <p className="text-xs text-gray-500 mb-2.5 line-clamp-2 font-mono leading-relaxed">
        {entry.content}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {entry.tags.slice(0, 2).map((tag, idx) => (
            <span
              key={tag}
              className={cn(
                'px-1.5 py-0.5 text-[10px] font-mono rounded border',
                getTagColor(idx)
              )}
            >
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-gray-600">
          <Clock className="w-3 h-3" />
          <span>{formatDate(entry.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}

function DetailView({
  entry,
  onBack
}: {
  entry: KnowledgeEntry
  onBack: () => void
}) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col">
      <div className="flex-shrink-0 bg-gray-950/90 backdrop-blur-md border-b border-green-900/30 px-4 py-3">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <button
            onClick={onBack}
            className="p-1.5 -ml-1.5 rounded-lg hover:bg-gray-800/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-green-400" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-mono text-green-400 font-bold line-clamp-1" style={{ textShadow: '0 0 8px rgba(34,197,94,0.5)' }}>
              {entry.title}
            </h1>
            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 mt-0.5">
              <Folder className="w-3 h-3" />
              <span>{entry.category}</span>
              <span>·</span>
              <span>{formatDate(entry.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 px-4 py-2 border-b border-green-900/20 bg-gray-950/50">
        <div className="flex flex-wrap gap-1.5 max-w-md mx-auto">
          {entry.tags.map((tag, idx) => (
            <span
              key={tag}
              className={cn(
                'px-2 py-0.5 text-[10px] font-mono rounded border',
                getTagColor(idx)
              )}
            >
              <Tag className="w-3 h-3 inline mr-1" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 safe-area-bottom">
        <article className="max-w-md mx-auto">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-lg font-mono text-green-400 mb-3 mt-5 first:mt-0" style={{ textShadow: '0 0 8px rgba(34,197,94,0.4)' }}>
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-base font-mono text-green-300 mb-2.5 mt-4" style={{ textShadow: '0 0 6px rgba(34,197,94,0.3)' }}>
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-sm font-mono text-green-300/80 mb-2 mt-3">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-xs text-gray-300 mb-3 leading-relaxed font-mono">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-3 text-xs text-gray-300 font-mono space-y-1">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-3 text-xs text-gray-300 font-mono space-y-1">
                  {children}
                </ol>
              ),
              code: ({ className, children }) => {
                const isInline = !className
                if (isInline) {
                  return (
                    <code className="px-1.5 py-0.5 bg-green-900/30 text-green-400 rounded text-[11px] font-mono border border-green-800/50">
                      {children}
                    </code>
                  )
                }
                return (
                  <code className="block bg-gray-900/80 border border-gray-700 rounded-lg p-3 text-[11px] font-mono text-gray-300 overflow-x-auto mb-3">
                    {children}
                  </code>
                )
              },
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-green-500 pl-3 py-1.5 my-3 bg-green-900/10 text-gray-400 text-xs font-mono italic">
                  {children}
                </blockquote>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
                >
                  {children}
                </a>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto mb-3 -mx-1">
                  <table className="w-full text-xs font-mono border border-gray-700 rounded-lg overflow-hidden">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="px-2 py-1.5 bg-gray-800/80 border-b border-gray-700 text-left text-green-400">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-2 py-1.5 border-b border-gray-800 text-gray-300">
                  {children}
                </td>
              ),
            }}
          >
            {entry.content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  )
}

export default function Knowledge() {
  const { entries, searchQuery, setSearch, selectEntry, selectedEntry, addEntry, loadFromBackend, isLoadingBackend, backendTotal, backendError } = useKnowledgeStore()
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0, name: '' })
  const [importResult, setImportResult] = useState<string | null>(null)
  const [syncConfig, setSyncConfig] = useState(() => getSyncConfig())
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<string | null>(null)

  // 组件挂载时从后端加载知识库
  useEffect(() => {
    loadFromBackend()
  }, [loadFromBackend])

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    entries.forEach(entry => entry.tags.forEach(tag => tags.add(tag)))
    return Array.from(tags)
  }, [entries])

  const filteredEntries = useMemo(() => {
    let result = entries

    if (activeCategory !== 'all') {
      result = result.filter(e => e.category === activeCategory)
    }

    if (activeTag) {
      result = result.filter(e => e.tags.includes(activeTag))
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        e =>
          e.title.toLowerCase().includes(query) ||
          e.content.toLowerCase().includes(query) ||
          e.tags.some(t => t.toLowerCase().includes(query))
      )
    }

    return result
  }, [entries, activeCategory, activeTag, searchQuery])

  const selectedEntryData = entries.find(e => e.id === selectedEntry) || null

  // 自动导入开源知识
  const handleImportFromGitHub = async () => {
    setImporting(true)
    setImportResult(null)
    try {
      const newEntries = await fetchOpenSourceKnowledge(
        (current, total, name) => setImportProgress({ current, total, name }),
        8
      )
      let added = 0
      for (const entry of newEntries) {
        // 避免重复
        if (!entries.some(e => e.id === entry.id)) {
          addEntry(entry)
          added++
        }
      }
      setImportResult(`✅ 成功导入 ${added} 条开源知识`)
    } catch (err) {
      setImportResult(`❌ 导入失败: ${err instanceof Error ? err.message : '未知错误'}`)
    } finally {
      setImporting(false)
      setImportProgress({ current: 0, total: 0, name: '' })
      setTimeout(() => setImportResult(null), 5000)
    }
  }

  // 导入代码片段
  const handleImportCode = async () => {
    setImporting(true)
    setImportResult(null)
    try {
      const newEntries = await fetchCodeSnippets(
        'python',
        (current, total) => setImportProgress({ current, total, name: '代码片段' })
      )
      let added = 0
      for (const entry of newEntries) {
        addEntry(entry)
        added++
      }
      setImportResult(`✅ 成功导入 ${added} 条代码片段`)
    } catch (err) {
      setImportResult(`❌ 导入失败: ${err instanceof Error ? err.message : '未知错误'}`)
    } finally {
      setImporting(false)
      setImportProgress({ current: 0, total: 0, name: '' })
      setTimeout(() => setImportResult(null), 5000)
    }
  }

  // 导入董事长自有项目
  const handleImportMyProjects = async () => {
    setImporting(true)
    setImportResult(null)
    try {
      const newEntries = await fetchMyProjects(
        (current, total, name) => setImportProgress({ current, total, name })
      )
      let added = 0
      for (const entry of newEntries) {
        addEntry(entry)
        added++
      }
      setImportResult(`✅ 成功导入 ${added} 个董事长项目`)
    } catch (err) {
      setImportResult(`❌ 导入失败: ${err instanceof Error ? err.message : '未知错误'}`)
    } finally {
      setImporting(false)
      setImportProgress({ current: 0, total: 0, name: '' })
      setTimeout(() => setImportResult(null), 5000)
    }
  }

  // 同步到希望AI
  const handleSyncToHopeAI = async () => {
    setSyncing(true)
    setSyncResult(null)
    try {
      const result = await syncToHopeAI(entries)
      if (result.success) {
        setSyncResult(`✅ 同步成功！新增 ${result.created} 条，更新 ${result.updated} 条，跳过 ${result.skipped} 条`)
        setSyncConfig(getSyncConfig())
      } else {
        setSyncResult(`❌ 同步失败：${result.error}`)
      }
    } catch (err) {
      setSyncResult(`❌ 同步失败：${err instanceof Error ? err.message : '未知错误'}`)
    } finally {
      setSyncing(false)
      setTimeout(() => setSyncResult(null), 5000)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 bg-gray-950/90 backdrop-blur-md border-b border-green-900/30 px-4 py-3">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-purple-400" style={{ filter: 'drop-shadow(0 0 6px rgba(168,85,247,0.5))' }} />
            <h1 className="text-base font-mono font-bold text-purple-400" style={{ textShadow: '0 0 8px rgba(168,85,247,0.5)' }}>
              知识库
            </h1>
            <span className="ml-auto text-[10px] font-mono text-gray-500">
              共 {filteredEntries.length} 条
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearch(e.target.value)}
                placeholder="搜索知识..."
                className={cn(
                  'w-full pl-9 pr-3 py-2 rounded-xl border text-sm font-mono',
                  'bg-gray-900/80 border-gray-800 text-gray-200',
                  'placeholder:text-gray-600',
                  'focus:outline-none focus:border-purple-500/70',
                  'transition-colors'
                )}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'p-2 rounded-xl border transition-colors',
                showFilters
                  ? 'bg-purple-900/30 border-purple-700/50 text-purple-400'
                  : 'bg-gray-900/80 border-gray-800 text-gray-500 hover:text-gray-400'
              )}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {/* 自动导入按钮 */}
          <div className="grid grid-cols-4 gap-1.5 mt-2">
            <button
              onClick={handleImportFromGitHub}
              disabled={importing}
              className={cn(
                'flex items-center justify-center gap-1 py-1.5 rounded-lg border text-[10px] font-mono transition-all',
                importing
                  ? 'bg-gray-800 border-gray-700 text-gray-500'
                  : 'bg-green-900/20 border-green-700/40 text-green-400 hover:bg-green-900/40 active:scale-95'
              )}
            >
              {importing ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Github className="w-3 h-3" />
              )}
              开源知识
            </button>
            <button
              onClick={handleImportCode}
              disabled={importing}
              className={cn(
                'flex items-center justify-center gap-1 py-1.5 rounded-lg border text-[10px] font-mono transition-all',
                importing
                  ? 'bg-gray-800 border-gray-700 text-gray-500'
                  : 'bg-blue-900/20 border-blue-700/40 text-blue-400 hover:bg-blue-900/40 active:scale-95'
              )}
            >
              {importing ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Code2 className="w-3 h-3" />
              )}
              代码片段
            </button>
            <button
              onClick={handleImportMyProjects}
              disabled={importing}
              className={cn(
                'flex items-center justify-center gap-1 py-1.5 rounded-lg border text-[10px] font-mono transition-all',
                importing
                  ? 'bg-gray-800 border-gray-700 text-gray-500'
                  : 'bg-purple-900/20 border-purple-700/40 text-purple-400 hover:bg-purple-900/40 active:scale-95'
              )}
            >
              {importing ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <User className="w-3 h-3" />
              )}
              我的项目
            </button>
            <button
              onClick={handleSyncToHopeAI}
              disabled={syncing || !syncConfig.enabled}
              className={cn(
                'flex items-center justify-center gap-1 py-1.5 rounded-lg border text-[10px] font-mono transition-all',
                syncing || !syncConfig.enabled
                  ? 'bg-gray-800 border-gray-700 text-gray-500'
                  : 'bg-yellow-900/20 border-yellow-700/40 text-yellow-400 hover:bg-yellow-900/40 active:scale-95'
              )}
            >
              {syncing ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
              同步
            </button>
          </div>

          {/* 导入进度 */}
          {importing && importProgress.total > 0 && (
            <div className="mt-2 p-2 rounded-lg bg-gray-900/80 border border-green-800/30">
              <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 mb-1">
                <span className="truncate flex-1">{importProgress.name}</span>
                <span className="ml-2">{importProgress.current}/{importProgress.total}</span>
              </div>
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all duration-300"
                  style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* 导入结果 */}
          {importResult && (
            <div className={cn(
              'mt-2 p-2 rounded-lg text-[11px] font-mono flex items-center gap-1.5',
              importResult.startsWith('✅')
                ? 'bg-green-900/20 border border-green-700/40 text-green-400'
                : 'bg-red-900/20 border border-red-700/40 text-red-400'
            )}>
              {importResult.startsWith('✅') ? (
                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
              ) : (
                <X className="w-3.5 h-3.5 flex-shrink-0" />
              )}
              <span className="truncate">{importResult}</span>
            </div>
          )}

          {/* 同步结果 */}
          {syncResult && (
            <div className={cn(
              'mt-2 p-2 rounded-lg text-[11px] font-mono flex items-center gap-1.5',
              syncResult.startsWith('✅')
                ? 'bg-yellow-900/20 border border-yellow-700/40 text-yellow-400'
                : 'bg-red-900/20 border border-red-700/40 text-red-400'
            )}>
              {syncResult.startsWith('✅') ? (
                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
              ) : (
                <X className="w-3.5 h-3.5 flex-shrink-0" />
              )}
              <span className="truncate">{syncResult}</span>
            </div>
          )}

          {/* 后端知识库加载状态 */}
          {isLoadingBackend && (
            <div className="mt-2 p-2 rounded-lg bg-blue-900/20 border border-blue-700/40 flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400 flex-shrink-0" />
              <span className="text-[11px] font-mono text-blue-400">正在从后端同步知识库...</span>
            </div>
          )}
          {backendError && !isLoadingBackend && (
            <div className="mt-2 p-2 rounded-lg bg-red-900/20 border border-red-700/40 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
              <span className="text-[11px] font-mono text-red-400">{backendError}</span>
            </div>
          )}
          {backendTotal > 0 && !isLoadingBackend && (
            <div className="mt-2 p-2 rounded-lg bg-green-900/20 border border-green-700/40 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
              <span className="text-[11px] font-mono text-green-400">后端知识库已同步: {backendTotal} 条</span>
            </div>
          )}

          {showFilters && (
            <div className="mt-3 space-y-3 animate-in slide-in-from-top-2">
              <div>
                <div className="text-[10px] font-mono text-gray-600 mb-1.5">分类</div>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map(cat => {
                    const isActive = activeCategory === cat.id
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={cn(
                          'px-2.5 py-1 rounded-lg text-xs font-mono border transition-all',
                          isActive
                            ? 'bg-purple-900/30 text-purple-400 border-purple-700/50'
                            : 'bg-gray-900/60 text-gray-500 border-gray-800 hover:text-gray-400'
                        )}
                      >
                        {cat.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              {allTags.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono text-gray-600 mb-1.5">标签</div>
                  <div className="flex flex-wrap gap-1.5">
                    {allTags.map((tag, idx) => (
                      <button
                        key={tag}
                        onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                        className={cn(
                          'px-2 py-0.5 text-[10px] font-mono rounded border transition-all',
                          activeTag === tag
                            ? getTagColor(idx)
                            : 'text-gray-500 border-gray-700/50 hover:border-gray-600'
                        )}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                  {activeTag && (
                    <button
                      onClick={() => setActiveTag(null)}
                      className="mt-2 text-[10px] font-mono text-purple-400 hover:text-purple-300"
                    >
                      清除标签筛选
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 safe-area-bottom">
        <div className="max-w-md mx-auto space-y-2">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-16 text-gray-600">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-mono text-sm mb-1">未找到相关知识</p>
              <p className="font-mono text-xs opacity-60">更换关键词或筛选条件试试</p>
            </div>
          ) : (
            filteredEntries.map(entry => (
              <KnowledgeCard
                key={entry.id}
                entry={entry}
                onClick={() => selectEntry(entry.id)}
              />
            ))
          )}
        </div>
      </div>

      {selectedEntryData && (
        <DetailView entry={selectedEntryData} onBack={() => selectEntry(null)} />
      )}
    </div>
  )
}
