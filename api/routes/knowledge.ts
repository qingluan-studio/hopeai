import { Router, type Request, type Response } from 'express'

interface KnowledgeEntry {
  id: string
  title: string
  content: string
  tags: string[]
  category: string
  createdAt: number
  source: string
}

const router = Router()

let knowledgeBase: KnowledgeEntry[] = [
  {
    id: 'kb_001',
    title: 'React最佳实践',
    content: 'React开发中的性能优化、组件设计模式、状态管理等最佳实践。包括使用React.memo、useMemo、useCallback进行性能优化，采用组合而非继承的组件设计模式，以及使用Zustand/Redux等状态管理方案。',
    tags: ['react', 'frontend', 'performance', 'best-practices'],
    category: '前端开发',
    createdAt: Date.now() - 86400000 * 7,
    source: 'manual'
  },
  {
    id: 'kb_002',
    title: 'TypeScript高级类型',
    content: '条件类型、映射类型、模板字面量类型等高级TypeScript特性。深入理解infer关键字、分布式条件类型、键重映射等高级用法，提升类型安全性和代码可维护性。',
    tags: ['typescript', 'typing', 'advanced', 'tutorial'],
    category: '编程语言',
    createdAt: Date.now() - 86400000 * 5,
    source: 'manual'
  },
  {
    id: 'kb_003',
    title: 'Node.js部署指南',
    content: 'PM2进程管理、Nginx反向代理、Docker容器化部署。涵盖生产环境部署的完整流程，包括日志管理、监控告警、滚动更新等最佳实践。',
    tags: ['nodejs', 'deployment', 'devops', 'docker'],
    category: '后端开发',
    createdAt: Date.now() - 86400000 * 3,
    source: 'auto'
  },
  {
    id: 'kb_004',
    title: '数据库优化策略',
    content: '索引优化、查询优化、分库分表策略。讲解SQL和NoSQL数据库的性能调优技巧，包括执行计划分析、连接池配置、缓存策略等内容。',
    tags: ['database', 'performance', 'optimization', 'sql'],
    category: '数据库',
    createdAt: Date.now() - 86400000 * 1,
    source: 'manual'
  },
]

const generateId = (): string => {
  return `kb_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`
}

router.get('/', (req: Request, res: Response): void => {
  try {
    const { search, category, tag, sort = 'createdAt', order = 'desc' } = req.query

    let results = [...knowledgeBase]

    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase()
      results = results.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.content.toLowerCase().includes(searchLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    if (category && typeof category === 'string') {
      results = results.filter(item => item.category === category)
    }

    if (tag && typeof tag === 'string') {
      results = results.filter(item => item.tags.includes(tag))
    }

    const sortKey = sort as keyof KnowledgeEntry
    const sortOrder = order === 'asc' ? 1 : -1
    results.sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * sortOrder
      }
      return String(aVal).localeCompare(String(bVal)) * sortOrder
    })

    const categories = [...new Set(knowledgeBase.map(k => k.category))]
    const allTags = [...new Set(knowledgeBase.flatMap(k => k.tags))]

    res.status(200).json({
      success: true,
      data: {
        entries: results,
        total: results.length,
        categories,
        tags: allTags
      },
      message: 'Knowledge base retrieved successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
})

router.post('/', (req: Request, res: Response): void => {
  try {
    const { title, content, tags = [], category = '未分类', source = 'manual' } = req.body

    if (!title || typeof title !== 'string') {
      res.status(400).json({
        success: false,
        error: 'INVALID_TITLE',
        message: 'Title is required and must be a string',
        timestamp: new Date().toISOString()
      })
      return
    }

    if (!content || typeof content !== 'string') {
      res.status(400).json({
        success: false,
        error: 'INVALID_CONTENT',
        message: 'Content is required and must be a string',
        timestamp: new Date().toISOString()
      })
      return
    }

    const newEntry: KnowledgeEntry = {
      id: generateId(),
      title,
      content,
      tags: Array.isArray(tags) ? tags : [],
      category,
      createdAt: Date.now(),
      source
    }

    knowledgeBase.unshift(newEntry)

    res.status(201).json({
      success: true,
      data: newEntry,
      message: 'Knowledge entry created successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
})

router.delete('/:id', (req: Request, res: Response): void => {
  try {
    const { id } = req.params
    const index = knowledgeBase.findIndex(item => item.id === id)

    if (index === -1) {
      res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: `Knowledge entry ${id} not found`,
        timestamp: new Date().toISOString()
      })
      return
    }

    const deletedEntry = knowledgeBase[index]
    knowledgeBase.splice(index, 1)

    res.status(200).json({
      success: true,
      data: deletedEntry,
      message: 'Knowledge entry deleted successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
})

export default router
