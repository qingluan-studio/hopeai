import { useState } from 'react'
import { Sparkles, Copy, Check, Star, BookmarkPlus, Search, Trash2, Edit3, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PromptTemplate {
  id: string
  name: string
  category: string
  content: string
  tags: string[]
  isFavorite: boolean
  createdAt: string
}

const initialPrompts: PromptTemplate[] = [
  {
    id: '1',
    name: '代码审查助手',
    category: '开发',
    content: '请帮我审查以下代码，找出潜在的bug、性能问题和代码风格问题，并给出具体的优化建议。\n\n代码：\n```\n[粘贴代码]\n```\n\n请从以下几个方面进行分析：\n1. 潜在bug和错误\n2. 性能优化建议\n3. 代码可读性改进\n4. 最佳实践建议',
    tags: ['代码', '审查', '优化'],
    isFavorite: true,
    createdAt: '2026-07-01'
  },
  {
    id: '2',
    name: '产品文案生成',
    category: '营销',
    content: '请帮我为以下产品撰写吸引人的产品文案和宣传语。\n\n产品信息：\n- 产品名称：[产品名]\n- 核心卖点：[卖点]\n- 目标用户：[用户群]\n- 独特优势：[优势]\n\n请生成：\n1. 产品简介（50字以内）\n2. 核心卖点文案\n3. 社交媒体宣传语\n4. 产品描述（详细版）',
    tags: ['文案', '营销', '产品'],
    isFavorite: true,
    createdAt: '2026-07-02'
  },
  {
    id: '3',
    name: '面试问题生成器',
    category: '求职',
    content: '请帮我生成针对以下职位的面试问题。\n\n职位信息：\n- 职位名称：[职位名]\n- 技术栈：[技术栈]\n- 经验要求：[经验]\n\n请生成：\n1. 技术问题（5-10个）\n2. 行为问题（3-5个）\n3. 系统设计问题（2-3个）\n4. 开放性问题（2-3个）\n\n每个问题请附带参考答案要点。',
    tags: ['面试', '求职', '问题'],
    isFavorite: false,
    createdAt: '2026-07-03'
  },
  {
    id: '4',
    name: 'SQL查询优化',
    category: '数据库',
    content: '请帮我优化以下SQL查询语句。\n\n原始查询：\n```sql\n[粘贴SQL]\n```\n\n表结构：\n```\n[表结构信息]\n```\n\n请提供：\n1. 性能分析\n2. 优化后的查询\n3. 索引建议\n4. 执行计划分析',
    tags: ['SQL', '数据库', '优化'],
    isFavorite: false,
    createdAt: '2026-07-04'
  },
  {
    id: '5',
    name: '创意写作助手',
    category: '写作',
    content: '请帮我创作一个故事/文章。\n\n主题：[主题]\n风格：[风格，如科幻/悬疑/浪漫/幽默]\n字数要求：[字数]\n主要角色：[角色描述]\n情节要点：[情节]\n\n请开始创作，并保持情节紧凑、语言生动。',
    tags: ['写作', '创意', '故事'],
    isFavorite: true,
    createdAt: '2026-07-05'
  },
  {
    id: '6',
    name: 'API设计规范',
    category: '开发',
    content: '请帮我设计一个RESTful API接口。\n\n需求描述：\n[详细描述需求]\n\n请设计：\n1. API端点列表\n2. 请求/响应格式\n3. 状态码规范\n4. 错误处理\n5. 认证授权方案\n6. 版本控制策略\n\n请遵循RESTful最佳实践。',
    tags: ['API', '设计', '规范'],
    isFavorite: false,
    createdAt: '2026-07-06'
  }
]

const categories = ['全部', '开发', '营销', '求职', '数据库', '写作', '其他']

export default function PromptLibrary() {
  const [prompts, setPrompts] = useState<PromptTemplate[]>(initialPrompts)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState<PromptTemplate | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === '全部' || prompt.category === selectedCategory
    const matchesFavorite = !showFavoritesOnly || prompt.isFavorite
    return matchesSearch && matchesCategory && matchesFavorite
  })

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const toggleFavorite = (id: string) => {
    setPrompts(prompts.map(p => 
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
    ))
  }

  const handleDelete = (id: string) => {
    setPrompts(prompts.filter(p => p.id !== id))
    if (selectedPrompt?.id === id) {
      setSelectedPrompt(null)
    }
  }

  const handleSaveEdit = () => {
    if (selectedPrompt) {
      setPrompts(prompts.map(p => 
        p.id === selectedPrompt.id ? selectedPrompt : p
      ))
      setIsEditing(false)
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-950">
      <div className="flex-shrink-0 bg-gray-950/90 backdrop-blur-md border-b border-violet-900/30 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-400" style={{ filter: 'drop-shadow(0 0 6px rgba(139,92,246,0.5))' }} />
          <h1 className="text-base font-mono font-bold text-violet-400" style={{ textShadow: '0 0 8px rgba(139,92,246,0.5)' }}>
            Prompt 模板库
          </h1>
        </div>
      </div>

      <div className="flex-shrink-0 px-3 py-2 border-b border-gray-800/50">
        <div className="max-w-md mx-auto space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜索模板..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-900/60 border border-gray-700/50 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-violet-700/50"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-1 overflow-x-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'px-2 py-1 rounded-lg text-[10px] font-mono whitespace-nowrap transition-all',
                    selectedCategory === cat
                      ? 'bg-violet-900/30 text-violet-400 border border-violet-700/50'
                      : 'bg-gray-800/50 text-gray-400 border border-gray-700/50'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono transition-all',
                showFavoritesOnly
                  ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/50'
                  : 'bg-gray-800/50 text-gray-400 border border-gray-700/50'
              )}
            >
              <Star className="w-3 h-3" />
              收藏
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 safe-area-bottom">
        <div className="max-w-md mx-auto space-y-2">
          {filteredPrompts.length === 0 ? (
            <div className="p-8 text-center">
              <Sparkles className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-sm text-gray-500">暂无匹配的模板</p>
              <p className="text-xs text-gray-600 mt-1">尝试更换搜索关键词或分类</p>
            </div>
          ) : (
            filteredPrompts.map(prompt => (
              <div
                key={prompt.id}
                onClick={() => {
                  setSelectedPrompt(prompt)
                  setIsEditing(false)
                }}
                className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 hover:border-violet-700/30 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-900/30 text-violet-400 border border-violet-700/30">
                      {prompt.category}
                    </span>
                    <h3 className="text-sm font-mono text-gray-300">{prompt.name}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(prompt.id)
                      }}
                      className={cn(
                        'p-1 rounded transition-all',
                        prompt.isFavorite ? 'text-yellow-400' : 'text-gray-600 hover:text-gray-400'
                      )}
                    >
                      <Star className={cn('w-4 h-4', prompt.isFavorite ? 'fill-current' : '')} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCopy(prompt.content, prompt.id)
                      }}
                      className={cn(
                        'p-1 rounded transition-all',
                        copiedId === prompt.id ? 'text-green-400' : 'text-gray-600 hover:text-gray-400'
                      )}
                    >
                      {copiedId === prompt.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mb-2">{prompt.content}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {prompt.tags.map(tag => (
                      <span key={tag} className="text-[9px] px-1 py-0.5 rounded bg-gray-800/50 text-gray-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-gray-600">{prompt.createdAt}</span>
                </div>
              </div>
            ))
          )}

          <button className="w-full p-3 rounded-xl border border-dashed border-gray-700/50 text-gray-500 hover:border-violet-700/50 hover:text-violet-400 transition-all flex items-center justify-center gap-2">
            <BookmarkPlus className="w-4 h-4" />
            <span className="text-sm font-mono">添加新模板</span>
          </button>
        </div>
      </div>

      {selectedPrompt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="w-full max-w-md bg-gray-950 rounded-t-2xl border-t border-gray-800 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-900/30 text-violet-400 border border-violet-700/30">
                  {selectedPrompt.category}
                </span>
                <h3 className="text-sm font-mono text-gray-300">{selectedPrompt.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-gray-300"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(selectedPrompt.id)}
                  className="p-1.5 rounded-lg hover:bg-red-900/30 text-gray-400 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedPrompt(null)}
                  className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {isEditing ? (
                <textarea
                  value={selectedPrompt.content}
                  onChange={e => setSelectedPrompt({ ...selectedPrompt, content: e.target.value })}
                  className="w-full h-full min-h-[300px] px-3 py-2 rounded-lg bg-gray-900/60 border border-gray-700/50 text-sm text-gray-300 resize-none focus:outline-none focus:border-violet-700/50 font-mono"
                />
              ) : (
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">{selectedPrompt.content}</pre>
              )}
            </div>
            
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800">
              <div className="flex gap-1">
                {selectedPrompt.tags.map(tag => (
                  <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-gray-800/50 text-gray-500">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                {isEditing && (
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1.5 rounded-lg bg-violet-900/30 text-violet-400 border border-violet-700/50 text-xs font-mono hover:bg-violet-900/50 transition-all"
                  >
                    保存
                  </button>
                )}
                <button
                  onClick={() => handleCopy(selectedPrompt.content, selectedPrompt.id)}
                  className={cn(
                    'flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono transition-all',
                    copiedId === selectedPrompt.id
                      ? 'bg-green-900/30 text-green-400 border border-green-700/50'
                      : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-gray-600'
                  )}
                >
                  {copiedId === selectedPrompt.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedId === selectedPrompt.id ? '已复制' : '复制'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
