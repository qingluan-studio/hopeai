import { Router, type Request, type Response } from 'express'

const router = Router()

const KIMI_API_URL = 'https://api.moonshot.cn/v1/chat/completions'
const KIMI_API_KEY = process.env.KIMI_API_KEY || 'sk-NWQEMc5Xt8z4J91JZOHNUnIff26ChPxaFPzgWhkheiiWeSon'
const KIMI_MODEL = process.env.KIMI_MODEL || 'moonshot-v1-8k'

// 知识库内存存储（简单实现）
let knowledgeBase: any[] = []

// 技术关键词分类
const TECH_KEYWORDS = {
  '前端开发': ['react', 'vue', 'angular', 'javascript', 'typescript', 'css', 'html', 'webpack', 'vite', '组件', '界面', 'ui', '前端', '浏览器', 'dom', '状态管理', 'redux', 'zustand'],
  '后端开发': ['node.js', 'express', 'nestjs', 'api', '接口', '后端', '服务器', '中间件', '路由', '数据库', 'redis', 'mongodb', 'mysql', 'postgresql'],
  '数据库': ['sql', 'nosql', 'mongodb', 'mysql', 'postgresql', 'redis', '索引', '查询优化', '事务', '数据库', '缓存', 'orm'],
  'DevOps': ['docker', 'kubernetes', 'ci/cd', '部署', '运维', '自动化', 'linux', 'nginx', '监控', '日志', '容器', '微服务'],
  '架构设计': ['架构', '设计模式', '微服务', '单体', '分布式', '高可用', '可扩展', 'ddd', '领域驱动', '分层架构', '依赖注入'],
  '性能优化': ['性能', '优化', '缓存', '懒加载', '预加载', '代码分割', '压缩', '首屏', '加载速度', '内存泄漏', '性能瓶颈'],
  '安全': ['安全', 'xss', 'csrf', 'sql注入', '认证', '授权', 'jwt', 'oauth', '加密', '脱敏', '漏洞', '防护'],
  '测试': ['测试', '单元测试', '集成测试', 'e2e', 'jest', 'vitest', '测试用例', '覆盖率', 'mock', '断言', 'tdd'],
  '工具链': ['git', 'npm', 'yarn', 'pnpm', 'eslint', 'prettier', 'typescript', 'babel', '构建工具', '脚手架', '插件'],
  '最佳实践': ['最佳实践', '规范', '代码质量', '可维护性', '可读性', '重构', 'clean code', 'solid', '设计原则']
}

function classifyContent(text: string): string {
  const lowerText = text.toLowerCase()
  let bestCategory = '最佳实践'
  let maxMatches = 0

  for (const [category, words] of Object.entries(TECH_KEYWORDS)) {
    let matches = 0
    for (const word of words) {
      if (lowerText.includes(word.toLowerCase())) {
        matches++
      }
    }
    if (matches > maxMatches) {
      maxMatches = matches
      bestCategory = category
    }
  }
  return bestCategory
}

function tagContent(text: string): string[] {
  const lowerText = text.toLowerCase()
  const tags: string[] = []
  for (const words of Object.values(TECH_KEYWORDS)) {
    for (const word of words) {
      if (lowerText.includes(word.toLowerCase())) {
        tags.push(word)
      }
    }
  }
  return [...new Set(tags)]
}

function searchKnowledge(query: string, limit = 3): string {
  if (knowledgeBase.length === 0) return ''

  const lowerQuery = query.toLowerCase()
  const queryWords = lowerQuery.split(/[\s,，。、！？]+/).filter(w => w.length > 1)

  const scored = knowledgeBase.map(entry => {
    let score = 0
    const titleLower = entry.title.toLowerCase()
    const contentLower = entry.content.toLowerCase()
    const tagsLower = entry.tags.map((t: string) => t.toLowerCase()).join(' ')

    for (const word of queryWords) {
      if (titleLower.includes(word)) score += 3
      if (tagsLower.includes(word)) score += 2
      if (contentLower.includes(word)) score += 1
    }

    return { entry, score }
  })

  const relevant = scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  if (relevant.length === 0) return ''

  return relevant.map((s, i) =>
    `【参考${i + 1}】${s.entry.title}\n${s.entry.content.slice(0, 500)}...`
  ).join('\n\n')
}

// 希望AI聊天接口（带RAG检索）
router.post('/hopeai', async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages } = req.body

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ success: false, error: '缺少 messages 参数' })
      return
    }

    // RAG检索：从知识库搜索相关内容
    const lastMessage = messages[messages.length - 1]?.content || ''
    let ragContext = ''
    if (lastMessage.length > 5) {
      const refs = searchKnowledge(lastMessage)
      if (refs) {
        ragContext = `\n\n📚 知识库参考（RAG检索）:\n\n${refs}`
      }
    }

    // 构建增强的消息
    const enhancedMessages = [...messages]
    if (ragContext) {
      enhancedMessages[enhancedMessages.length - 1].content += ragContext
    }

    // 调用 Kimi API
    const response = await fetch(KIMI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KIMI_API_KEY}`
      },
      body: JSON.stringify({
        model: KIMI_MODEL,
        messages: enhancedMessages,
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Kimi API error:', errorData)
      res.status(500).json({ success: false, error: 'Kimi API调用失败' })
      return
    }

    const data = await response.json()
    res.json({
      success: true,
      data: data,
      ragUsed: ragContext ? true : false
    })
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ success: false, error: '服务器内部错误' })
  }
})

// 知识库同步接口（供 HopeAgent Pro 调用）
router.post('/knowledge/sync', async (req: Request, res: Response): Promise<void> => {
  try {
    const { items, source = 'hopeagent_pro' } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, error: 'items 必须是非空数组' })
      return
    }

    let created = 0
    let updated = 0
    let skipped = 0

    for (const item of items) {
      if (!item.title || !item.content) {
        skipped++
        continue
      }

      const existingIndex = knowledgeBase.findIndex(k => k.title === item.title)

      const normalizedItem = {
        id: item.id || Date.now().toString(36) + Math.random().toString(36).slice(2, 9),
        title: item.title,
        content: item.content,
        source: item.source || source,
        tags: item.tags || tagContent(item.content),
        category: item.category || classifyContent(item.content),
        importance: item.importance || 5,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      if (existingIndex >= 0) {
        knowledgeBase[existingIndex] = normalizedItem
        updated++
      } else {
        knowledgeBase.push(normalizedItem)
        created++
      }
    }

    res.json({
      success: true,
      created,
      updated,
      skipped,
      total: knowledgeBase.length
    })
  } catch (error) {
    console.error('Sync error:', error)
    res.status(500).json({ success: false, error: '同步失败' })
  }
})

// 知识库列表
router.get('/knowledge', (req: Request, res: Response): void => {
  const limit = parseInt(req.query.limit as string || '20')
  const offset = parseInt(req.query.offset as string || '0')

  res.json({
    success: true,
    data: knowledgeBase.slice(offset, offset + limit),
    total: knowledgeBase.length
  })
})

// 知识库搜索
router.get('/knowledge/search', (req: Request, res: Response): void => {
  const query = req.query.q as string
  if (!query) {
    res.status(400).json({ success: false, error: '缺少查询参数 q' })
    return
  }

  const lowerQuery = query.toLowerCase()
  const results = knowledgeBase
    .map(k => {
      let score = 0
      if (k.title.toLowerCase().includes(lowerQuery)) score += 0.5
      if (k.content.toLowerCase().includes(lowerQuery)) score += 0.3
      if (k.tags.some((t: string) => t.toLowerCase().includes(lowerQuery))) score += 0.2
      return { ...k, score }
    })
    .filter(k => k.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)

  res.json({ success: true, data: results })
})

// 知识库统计
router.get('/knowledge/stats', (req: Request, res: Response): void => {
  const byCategory: Record<string, number> = {}
  const tagCount: Record<string, number> = {}

  knowledgeBase.forEach(k => {
    byCategory[k.category] = (byCategory[k.category] || 0) + 1
    k.tags.forEach((t: string) => {
      tagCount[t] = (tagCount[t] || 0) + 1
    })
  })

  res.json({
    success: true,
    data: {
      total: knowledgeBase.length,
      categories: Object.keys(byCategory).length,
      tags: Object.keys(tagCount).length,
      byCategory,
      topTags: Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 10)
    }
  })
})

// 导入单条知识
router.post('/knowledge', (req: Request, res: Response): void => {
  const { title, content, source = 'manual', tags, category } = req.body

  if (!title || !content) {
    res.status(400).json({ success: false, error: '缺少 title 或 content' })
    return
  }

  const newEntry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 9),
    title,
    content,
    source,
    tags: tags || tagContent(content),
    category: category || classifyContent(content),
    importance: content.includes('重要') || content.includes('关键') ? 9 : 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  knowledgeBase.push(newEntry)

  res.status(201).json({ success: true, data: newEntry })
})

export default router