import { Router, type Request, type Response } from 'express'

const router = Router()

const KIMI_API_URL = 'https://api.moonshot.cn/v1/chat/completions'
const KIMI_API_KEY = process.env.KIMI_API_KEY || 'sk-NWQEMc5Xt8z4J91JZOHNUnIff26ChPxaFPzgWhkheiiWeSon'
const KIMI_MODEL = process.env.KIMI_MODEL || 'moonshot-v1-8k'

// 知识库内存存储（支持720+条目）
let knowledgeBase: any[] = []

// 知识图谱（记录知识点之间的关系）
let knowledgeGraph: Record<string, string[]> = {}

// 技术分类扩展（覆盖更多领域）
const TECH_KEYWORDS = {
  '前端开发': ['react', 'vue', 'angular', 'javascript', 'typescript', 'css', 'html', 'webpack', 'vite', '组件', '界面', 'ui', '前端', '浏览器', 'dom', '状态管理', 'redux', 'zustand', 'svelte', 'next.js', 'nuxt', 'tailwind', 'sass', 'less'],
  '后端开发': ['node.js', 'express', 'nestjs', 'api', '接口', '后端', '服务器', '中间件', '路由', '数据库', 'redis', 'mongodb', 'mysql', 'postgresql', 'python', 'django', 'flask', 'spring', 'go', 'gin', 'grpc'],
  '数据库': ['sql', 'nosql', 'mongodb', 'mysql', 'postgresql', 'redis', '索引', '查询优化', '事务', '数据库', '缓存', 'orm', 'elastic', 'solr', 'clickhouse', 'tidb', 'cockroach'],
  'DevOps': ['docker', 'kubernetes', 'ci/cd', '部署', '运维', '自动化', 'linux', 'nginx', '监控', '日志', '容器', '微服务', 'jenkins', 'github actions', 'gitlab ci', 'terraform', 'ansible'],
  '架构设计': ['架构', '设计模式', '微服务', '单体', '分布式', '高可用', '可扩展', 'ddd', '领域驱动', '分层架构', '依赖注入', 'cqrs', 'event sourcing', '六边形架构', 'adapter'],
  '性能优化': ['性能', '优化', '缓存', '懒加载', '预加载', '代码分割', '压缩', '首屏', '加载速度', '内存泄漏', '性能瓶颈', 'jank', 'fps', 'web vitals'],
  '安全': ['安全', 'xss', 'csrf', 'sql注入', '认证', '授权', 'jwt', 'oauth', '加密', '脱敏', '漏洞', '防护', 'cors', 'helmet', 'owasp', 'zero trust'],
  '测试': ['测试', '单元测试', '集成测试', 'e2e', 'jest', 'vitest', '测试用例', '覆盖率', 'mock', '断言', 'tdd', 'bdd', 'pytest', 'cypress', 'playwright'],
  '工具链': ['git', 'npm', 'yarn', 'pnpm', 'eslint', 'prettier', 'typescript', 'babel', '构建工具', '脚手架', '插件', 'husky', 'lint-staged', 'commitlint'],
  'AI/机器学习': ['ai', '机器学习', '深度学习', '神经网络', 'transformer', 'bert', 'gpt', 'llm', 'prompt', 'embedding', 'rag', '向量', 'tensorflow', 'pytorch'],
  '云原生': ['云原生', 'serverless', 'faas', 'paas', 'iaas', 'aws', 'azure', 'gcp', '阿里云', '腾讯云', 'cloudflare', 'vercel', 'lambda'],
  '移动开发': ['移动开发', 'ios', 'android', 'react native', 'flutter', 'swift', 'kotlin', 'uniapp', '小程序'],
  '最佳实践': ['最佳实践', '规范', '代码质量', '可维护性', '可读性', '重构', 'clean code', 'solid', '设计原则', '代码审查', '敏捷', 'scrum']
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
  return [...new Set(tags)].slice(0, 10)
}

// 语义分块（按意义切分文档）
function semanticChunk(content: string, chunkSize = 300): string[] {
  const paragraphs = content.split(/[\n\n]+/)
  const chunks: string[] = []
  let currentChunk = ''

  for (const para of paragraphs) {
    if (currentChunk.length + para.length < chunkSize) {
      currentChunk += (currentChunk ? '\n\n' : '') + para
    } else {
      if (currentChunk) chunks.push(currentChunk)
      currentChunk = para
    }
  }
  if (currentChunk) chunks.push(currentChunk)

  return chunks
}

// 增强搜索（多级检索）
function enhancedSearch(query: string, limit = 5): any[] {
  if (knowledgeBase.length === 0) return []

  const lowerQuery = query.toLowerCase()
  const queryWords = lowerQuery.split(/[\s,，。、！？]+/).filter(w => w.length > 1)

  const scored = knowledgeBase.map(entry => {
    let score = 0
    const titleLower = entry.title.toLowerCase()
    const contentLower = entry.content.toLowerCase()
    const tagsLower = entry.tags.map((t: string) => t.toLowerCase()).join(' ')

    for (const word of queryWords) {
      if (titleLower.includes(word)) score += 5
      if (tagsLower.includes(word)) score += 3
      if (contentLower.includes(word)) score += 2
    }

    // 基于类别匹配的额外加分
    const queryCategory = classifyContent(query)
    if (entry.category === queryCategory) score += 4

    return { entry, score }
  })

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.entry)
}

// 知识图谱扩展搜索
function graphExpandSearch(query: string, results: any[]): any[] {
  const expanded: any[] = [...results]
  const visited = new Set(results.map(r => r.id))

  for (const result of results) {
    const relatedIds = knowledgeGraph[result.id] || []
    for (const relatedId of relatedIds) {
      if (!visited.has(relatedId)) {
        const related = knowledgeBase.find(k => k.id === relatedId)
        if (related) {
          expanded.push(related)
          visited.add(relatedId)
        }
      }
    }
  }

  return expanded.slice(0, 8)
}

// 构建知识图谱关系
function buildKnowledgeGraph(entry: any) {
  const relatedIds: string[] = []

  for (const existing of knowledgeBase) {
    if (existing.id === entry.id) continue

    let similarity = 0
    const entryTags = new Set(entry.tags)
    const existingTags = new Set(existing.tags)

    for (const tag of entryTags) {
      if (existingTags.has(tag)) similarity++
    }

    if (similarity >= 2) {
      relatedIds.push(existing.id)
    }
  }

  if (relatedIds.length > 0) {
    knowledgeGraph[entry.id] = relatedIds
  }
}

// 构建RAG上下文
function buildRagContext(query: string): { context: string; sources: any[] } {
  const initialResults = enhancedSearch(query, 4)
  const expandedResults = graphExpandSearch(query, initialResults)

  const sources = [...new Set(expandedResults)]

  const contextParts = sources.map((source, i) => {
    const chunks = semanticChunk(source.content, 400)
    const relevantChunk = chunks.find(ch =>
      ch.toLowerCase().includes(query.toLowerCase())
    ) || chunks[0]

    return `【知识${i + 1}】${source.title} [${source.category}]
${relevantChunk.slice(0, 600)}...`
  })

  return {
    context: contextParts.join('\n\n'),
    sources
  }
}

// 希望AI聊天接口（增强版：思维链推理 + RAG + 自我反思）
router.post('/hopeai', async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages, useChainOfThought = true, useReflection = true } = req.body

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ success: false, error: '缺少 messages 参数' })
      return
    }

    const lastMessage = messages[messages.length - 1]?.content || ''

    // RAG检索
    let ragContext = ''
    let sources: any[] = []
    if (lastMessage.length > 5) {
      const ragResult = buildRagContext(lastMessage)
      if (ragResult.context) {
        ragContext = `\n\n📚 知识库参考（${ragResult.sources.length}条）:\n\n${ragResult.context}`
        sources = ragResult.sources
      }
    }

    // 构建系统提示词（加入思维链推理指令）
    const systemPrompt = {
      role: 'system' as const,
      content: `你是希望AI（HopeAI），一个智能对话助手。

${useChainOfThought ? `
🎯 思维链推理：
对于复杂问题，请遵循以下步骤：
1. 理解问题：明确用户的核心需求和背景
2. 分析问题：将问题分解为子问题
3. 检索知识：从提供的知识库中查找相关信息
4. 推理过程：逐步推导解决方案
5. 验证答案：检查答案是否合理、完整

使用"思考："标记你的推理过程，最终答案前使用"答案："标记。
` : ''}

${useReflection ? `
🔍 自我反思：
在给出答案后，反思以下问题：
- 答案是否准确？是否有遗漏？
- 是否引用了正确的知识来源？
- 是否存在逻辑漏洞？
- 是否需要进一步解释？

如果发现问题，请进行修正。
` : ''}

📖 知识库使用规则：
- 优先使用知识库中的信息回答问题
- 如果知识库中有多个相关条目，综合所有信息给出完整答案
- 如果知识库中没有相关信息，明确说明并给出通用建议
- 引用知识库内容时，请标注来源标题

回答风格：专业、清晰、有深度，代码示例使用markdown格式。`
    }

    // 构建增强的消息
    const enhancedMessages = [systemPrompt, ...messages]
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
        temperature: useChainOfThought ? 0.8 : 0.7,
        max_tokens: 3000
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Kimi API error:', errorData)
      res.status(500).json({ success: false, error: 'Kimi API调用失败' })
      return
    }

    const data = await response.json()

    // 提取引用来源
    const citedSources = sources.filter(s =>
      (data.choices?.[0]?.message?.content || '').includes(s.title)
    )

    res.json({
      success: true,
      data: data,
      ragUsed: ragContext ? true : false,
      sources: citedSources.length > 0 ? citedSources : sources.slice(0, 3),
      chainOfThought: useChainOfThought,
      reflection: useReflection
    })
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ success: false, error: '服务器内部错误' })
  }
})

// 知识库同步接口
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
        importance: item.importance || (item.content.includes('重要') || item.content.includes('关键') ? 9 : 5),
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      if (existingIndex >= 0) {
        knowledgeBase[existingIndex] = normalizedItem
        updated++
      } else {
        knowledgeBase.push(normalizedItem)
        buildKnowledgeGraph(normalizedItem)
        created++
      }
    }

    res.json({
      success: true,
      created,
      updated,
      skipped,
      total: knowledgeBase.length,
      graphEdges: Object.keys(knowledgeGraph).length
    })
  } catch (error) {
    console.error('Sync error:', error)
    res.status(500).json({ success: false, error: '同步失败' })
  }
})

// 批量导入知识（支持720+条目）
router.post('/knowledge/batch-import', async (req: Request, res: Response): Promise<void> => {
  try {
    const { items, source = 'batch_import' } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, error: 'items 必须是非空数组' })
      return
    }

    const startTime = Date.now()
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
        importance: item.importance || (item.content.includes('重要') || item.content.includes('关键') ? 9 : 5),
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

    // 批量构建知识图谱（优化性能）
    for (let i = 0; i < knowledgeBase.length; i++) {
      for (let j = i + 1; j < knowledgeBase.length; j++) {
        const entry1 = knowledgeBase[i]
        const entry2 = knowledgeBase[j]

        let similarity = 0
        const tags1 = new Set(entry1.tags)
        const tags2 = new Set(entry2.tags)

        for (const tag of tags1) {
          if (tags2.has(tag)) similarity++
        }

        if (similarity >= 2) {
          if (!knowledgeGraph[entry1.id]) knowledgeGraph[entry1.id] = []
          if (!knowledgeGraph[entry2.id]) knowledgeGraph[entry2.id] = []
          if (!knowledgeGraph[entry1.id].includes(entry2.id)) knowledgeGraph[entry1.id].push(entry2.id)
          if (!knowledgeGraph[entry2.id].includes(entry1.id)) knowledgeGraph[entry2.id].push(entry1.id)
        }
      }
    }

    const duration = Date.now() - startTime

    res.json({
      success: true,
      created,
      updated,
      skipped,
      total: knowledgeBase.length,
      graphEdges: Object.keys(knowledgeGraph).length,
      durationMs: duration,
      rate: (items.length / (duration / 1000)).toFixed(1) + ' items/sec'
    })
  } catch (error) {
    console.error('Batch import error:', error)
    res.status(500).json({ success: false, error: '批量导入失败' })
  }
})

// 知识库列表（支持分类筛选）
router.get('/knowledge', (req: Request, res: Response): void => {
  const limit = parseInt(req.query.limit as string || '20')
  const offset = parseInt(req.query.offset as string || '0')
  const category = req.query.category as string
  const sort = req.query.sort as string || 'updatedAt'

  let filtered = [...knowledgeBase]

  if (category) {
    filtered = filtered.filter(k => k.category === category)
  }

  filtered.sort((a, b) => {
    if (sort === 'importance') return b.importance - a.importance
    if (sort === 'createdAt') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })

  res.json({
    success: true,
    data: filtered.slice(offset, offset + limit),
    total: filtered.length
  })
})

// 知识库搜索（增强版）
router.get('/knowledge/search', (req: Request, res: Response): void => {
  const query = req.query.q as string
  const category = req.query.category as string
  if (!query) {
    res.status(400).json({ success: false, error: '缺少查询参数 q' })
    return
  }

  const results = enhancedSearch(query, 20)
  const filtered = category
    ? results.filter(r => r.category === category)
    : results

  res.json({ success: true, data: filtered.slice(0, 15), total: filtered.length })
})

// 知识库统计（增强版）
router.get('/knowledge/stats', (req: Request, res: Response): void => {
  const byCategory: Record<string, number> = {}
  const tagCount: Record<string, number> = {}
  const bySource: Record<string, number> = {}

  knowledgeBase.forEach(k => {
    byCategory[k.category] = (byCategory[k.category] || 0) + 1
    bySource[k.source] = (bySource[k.source] || 0) + 1
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
      graphEdges: Object.keys(knowledgeGraph).length,
      byCategory,
      bySource,
      topTags: Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 15),
      categoriesList: Object.keys(TECH_KEYWORDS)
    }
  })
})

// 分类列表
router.get('/knowledge/categories', (req: Request, res: Response): void => {
  const stats: Record<string, number> = {}
  knowledgeBase.forEach(k => {
    stats[k.category] = (stats[k.category] || 0) + 1
  })

  res.json({
    success: true,
    data: Object.entries(stats).map(([name, count]) => ({
      name,
      count
    })).sort((a, b) => b.count - a.count)
  })
})

// 导入单条知识
router.post('/knowledge', (req: Request, res: Response): void => {
  const { title, content, source = 'manual', tags, category, importance } = req.body

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
    importance: importance || (content.includes('重要') || content.includes('关键') ? 9 : 5),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  knowledgeBase.push(newEntry)
  buildKnowledgeGraph(newEntry)

  res.status(201).json({ success: true, data: newEntry })
})

// 删除知识
router.delete('/knowledge/:id', (req: Request, res: Response): void => {
  const id = req.params.id
  const index = knowledgeBase.findIndex(k => k.id === id)

  if (index === -1) {
    res.status(404).json({ success: false, error: '知识不存在' })
    return
  }

  knowledgeBase.splice(index, 1)
  delete knowledgeGraph[id]

  res.json({ success: true, message: '删除成功' })
})

export default router