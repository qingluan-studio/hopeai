import { Router, type Request, type Response } from 'express'
import { INITIAL_KNOWLEDGE } from './chat'

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

let knowledgeBase: KnowledgeEntry[] = []

// 从 chat.ts 的 INITIAL_KNOWLEDGE 初始化
function initializeKnowledgeBase() {
  if (knowledgeBase.length > 0) return
  for (const item of INITIAL_KNOWLEDGE) {
    knowledgeBase.push({
      id: `kb_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`,
      title: item.title,
      content: item.content,
      tags: item.tags,
      category: item.category,
      createdAt: Date.now(),
      source: 'kimi_search_curated'
    })
  }
  console.log(`[knowledge.ts] 知识库已初始化: ${knowledgeBase.length} 条`)
}
initializeKnowledgeBase()

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
