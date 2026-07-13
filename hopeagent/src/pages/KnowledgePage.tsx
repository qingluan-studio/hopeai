import { useState, useEffect, useCallback } from 'react'
import { Search, Plus, Trash2, BookOpen, Tag, Clock, Star, Download, X, Layers } from 'lucide-react'
import { useKnowledgeStore, useAppStore } from '@/store'
import type { KnowledgeEntry } from '@/types'
import { knowledgeApi } from '@/services/apiClient'
import { batchImportKnowledge, getKnowledgeCount } from '@/services/knowledgeService'
import { allExpandedKnowledge } from '@/data/knowledgeSeed'
import { cn } from '@/lib/utils'

const allKnowledgeTyped = allExpandedKnowledge as unknown as Omit<KnowledgeEntry, 'id' | 'createdAt'>[]

export default function KnowledgePage() {
  const { entries, setEntries, addEntry, deleteEntry, searchEntries } = useKnowledgeStore()
  const { backendOnline, useBackend } = useAppStore()
  const [query, setQuery] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newTags, setNewTags] = useState('')
  const [newCategory, setNewCategory] = useState('自定义')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState('')
  const [loading, setLoading] = useState(false)

  /** 从后端拉取知识列表 */
  const refreshFromBackend = useCallback(async () => {
    if (!useBackend || !backendOnline) return
    setLoading(true)
    try {
      const list = await knowledgeApi.list()
      // 转换为本地格式
      const mapped: KnowledgeEntry[] = list.map(k => ({
        id: k.id,
        title: k.title,
        content: k.content,
        tags: k.tags || [],
        category: k.category || '其他',
        source: (k.source as any) || 'imported',
        createdAt: k.createdAt,
        importance: k.importance ?? 5,
      }))
      setEntries(mapped)
    } catch (err) {
      console.error('拉取知识库失败:', err)
    } finally {
      setLoading(false)
    }
  }, [useBackend, backendOnline, setEntries])

  useEffect(() => {
    refreshFromBackend()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backendOnline, useBackend])

  const displayed = query ? searchEntries(query) : entries
  const categories = Array.from(new Set(entries.map(e => e.category)))
  const filteredByCategory = selectedCategory
    ? displayed.filter(e => e.category === selectedCategory)
    : displayed

  const handleAdd = async () => {
    if (!newTitle.trim()) return
    const entry = {
      title: newTitle.trim(),
      content: newContent.trim(),
      tags: newTags.split(/[,，\s]+/).filter(t => t.length > 0),
      category: newCategory || '自定义',
      source: 'manual' as const,
      importance: 5,
    }

    // 后端模式：先存后端
    if (useBackend && backendOnline) {
      try {
        await knowledgeApi.add(entry)
        await refreshFromBackend()
      } catch (err) {
        console.error('后端添加失败，回退本地:', err)
        await addEntry(entry)
      }
    } else {
      await addEntry(entry)
    }

    setNewTitle('')
    setNewContent('')
    setNewTags('')
    setNewCategory('自定义')
    setShowAdd(false)
  }

  const handleDelete = async (id: string) => {
    if (useBackend && backendOnline) {
      try {
        await knowledgeApi.delete(id)
        await refreshFromBackend()
        return
      } catch (err) {
        console.error('后端删除失败，回退本地:', err)
      }
    }
    await deleteEntry(id)
  }

  const handleImport = async () => {
    setImporting(true)
    setImportResult('')
    try {
      const count = batchImportKnowledge(allKnowledgeTyped)
      // 后端模式：批量推送到后端
      if (useBackend && backendOnline) {
        for (const item of allKnowledgeTyped) {
          try {
            await knowledgeApi.add({
              title: item.title,
              content: item.content,
              tags: item.tags || [],
              category: item.category || 'AI编程',
              source: 'imported' as const,
              importance: item.importance ?? 5,
            })
          } catch {}
        }
        await refreshFromBackend()
      }
      setImportResult(`✅ 成功导入 ${count} 条知识，当前共 ${getKnowledgeCount() + (useBackend && backendOnline ? entries.length : 0)} 条`)
    } catch (err) {
      setImportResult('❌ 导入失败')
    } finally {
      setImporting(false)
      setTimeout(() => setImportResult(''), 5000)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* 顶部标题栏 — 手机端紧凑 */}
      <div className="border-b border-cyber-border bg-cyber-panel/50 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-base font-bold text-cyber-text flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyber-accent" />
              知识库
            </h1>
            <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
              {entries.length} 条 · {useBackend && backendOnline ? '后端同步' : '本地存储'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent hover:bg-cyber-accent/20 transition-all font-mono text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              添加
            </button>
            <button
              onClick={handleImport}
              disabled={importing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500/20 transition-all font-mono text-xs disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              {importing ? '导入中' : '导入'}
            </button>
          </div>
        </div>

        {importResult && (
          <p className="text-xs mb-2 font-mono text-green-400">{importResult}</p>
        )}

        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索知识..."
            className="w-full pl-10 pr-4 py-2 bg-cyber-bg/80 border border-cyber-border rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyber-accent/50 transition-colors"
          />
        </div>

        {/* 分类标签 — 横向滚动 */}
        {categories.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                'flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-mono transition-all',
                !selectedCategory
                  ? 'bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/30'
                  : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10'
              )}
            >
              全部
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-mono transition-all',
                  selectedCategory === cat
                    ? 'bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/30'
                    : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 添加表单 — 抽屉式 */}
      {showAdd && (
        <div className="border-b border-cyber-border bg-gradient-to-b from-cyber-accent/5 to-transparent p-4">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono text-cyber-accent">新增知识</h3>
              <button onClick={() => setShowAdd(false)} className="p-1 text-gray-500 hover:text-gray-300">
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="知识标题"
              className="w-full px-3 py-2 bg-cyber-bg/80 border border-cyber-border rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyber-accent/50"
            />
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="知识内容..."
              rows={4}
              className="w-full px-3 py-2 bg-cyber-bg/80 border border-cyber-border rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyber-accent/50 resize-none"
            />
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="分类"
                className="w-24 px-3 py-2 bg-cyber-bg/80 border border-cyber-border rounded-lg text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyber-accent/50"
              />
              <input
                type="text"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                placeholder="标签（逗号分隔）"
                className="flex-1 px-3 py-2 bg-cyber-bg/80 border border-cyber-border rounded-lg text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyber-accent/50"
              />
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-cyber-accent text-black rounded-lg font-mono text-xs hover:bg-cyber-accent/90 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 知识列表 — 手机端垂直 */}
      <div className="flex-1 overflow-y-auto p-3">
        {loading && (
          <div className="text-center py-8 text-xs text-gray-500 font-mono">
            <Layers className="w-6 h-6 mx-auto mb-2 animate-pulse" />
            正在从后端加载...
          </div>
        )}
        {!loading && filteredByCategory.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-sm text-gray-500">暂无知识条目</p>
            <p className="text-xs text-gray-600 mt-1">点击右上角"添加"或"导入"开始</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredByCategory.map((entry: KnowledgeEntry) => (
              <KnowledgeCard key={entry.id} entry={entry} onDelete={() => handleDelete(entry.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function KnowledgeCard({ entry, onDelete }: { entry: KnowledgeEntry; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false)

  const sourceLabels: Record<string, string> = {
    manual: '手动',
    auto: '自动',
    imported: '导入',
  }

  const sourceColors: Record<string, string> = {
    manual: 'text-blue-400 bg-blue-400/10',
    auto: 'text-green-400 bg-green-400/10',
    imported: 'text-purple-400 bg-purple-400/10',
  }

  return (
    <div className="group bg-cyber-panel/50 border border-cyber-border rounded-xl overflow-hidden hover:border-cyber-accent/30 transition-all">
      <div
        className="p-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <h3 className="font-medium text-cyber-text text-sm truncate">{entry.title}</h3>
              <span className={cn('px-1.5 py-0.5 rounded text-[9px] font-mono', sourceColors[entry.source])}>
                {sourceLabels[entry.source] || entry.source}
              </span>
              <span className="text-yellow-400 text-[10px] flex items-center gap-0.5">
                <Star className="w-2.5 h-2.5" />
                {entry.importance}
              </span>
            </div>
            <p className="text-xs text-gray-400 line-clamp-2">
              {entry.content}
            </p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <div className="flex items-center gap-1">
                <Tag className="w-2.5 h-2.5 text-gray-600" />
                <div className="flex gap-1 flex-wrap">
                  {entry.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-1.5 py-0.5 text-[9px] bg-white/5 rounded text-gray-500 font-mono">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-gray-600 font-mono ml-auto">
                <Clock className="w-2.5 h-2.5" />
                {new Date(entry.createdAt).toLocaleDateString('zh-CN')}
              </div>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            className="p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-all flex-shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 pt-0 border-t border-cyber-border/50">
          <div className="pt-2 text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">
            {entry.content}
          </div>
        </div>
      )}
    </div>
  )
}
