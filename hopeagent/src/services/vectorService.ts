/**
 * HopeAgent 向量检索服务
 * 对接后端 /api/vector/* 接口，同时提供本地 TF-IDF 兜底实现与混合检索
 */

import { getApiBase } from './apiClient'
import { authHeaders } from './authService'

// ============ 类型定义 ============
export interface VectorDoc {
  id: string
  title: string
  content: string
  tags?: string[]
}

export interface VectorIndex {
  docs: VectorDoc[]
  /** 每篇文档的词项权重向量（按词表索引对齐） */
  vectors: number[][]
  /** 词表：词 → 列索引 */
  vocabulary: Map<string, number>
  /** 每个词的逆文档频率 */
  idf: number[]
  builtAt: string
}

export interface SearchResult {
  doc: VectorDoc
  score: number
  /** 命中的关键词，便于高亮展示 */
  matchedTerms?: string[]
}

export interface SearchOptions {
  topK?: number
  /** 是否启用本地关键词兜底混合 */
  hybrid?: boolean
}

const INDEX_CACHE_KEY = 'hopeagent-vector-index'

// ============ 本地分词 ============

/**
 * 中文 bigram 分词 + 英文单词切分
 * 与后端算法保持一致：中文按 2 字滑窗，英文按 \w+ 切分
 */
export function localTokenize(text: string): string[] {
  if (!text) return []
  const tokens: string[] = []
  const lower = text.toLowerCase()

  // 提取所有中英文片段分别处理
  const segments = lower.match(/[\u4e00-\u9fa5]+|[a-z0-9_]+/g) || []
  for (const seg of segments) {
    if (/^[\u4e00-\u9fa5]+$/.test(seg)) {
      // 中文 bigram
      for (let i = 0; i < seg.length - 1; i++) {
        tokens.push(seg.slice(i, i + 2))
      }
      // 单字也保留（短查询场景）
      if (seg.length === 1) tokens.push(seg)
    } else {
      // 英文/数字：直接作为一个 token，再按驼峰/下划线拆分
      tokens.push(seg)
      const parts = seg.split(/[_\-\s]+/).filter(p => p.length > 1)
      tokens.push(...parts)
    }
  }
  return tokens
}

/** 统计词频 */
function termFrequency(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>()
  for (const t of tokens) {
    tf.set(t, (tf.get(t) || 0) + 1)
  }
  return tf
}

// ============ 本地 TF-IDF ============

/**
 * 基于文档集构建 TF-IDF 向量索引
 * 算法：tf = 词频 / 文档总词数；idf = log(1 + N / (1 + df))
 */
export function localTfidf(docs: VectorDoc[]): VectorIndex {
  const vocabulary = new Map<string, number>()
  const docTokens: string[][] = []

  // 第一遍：收集词表
  for (const doc of docs) {
    const text = `${doc.title} ${doc.title} ${doc.content} ${(doc.tags || []).join(' ')}`
    const tokens = localTokenize(text)
    docTokens.push(tokens)
    for (const t of new Set(tokens)) {
      if (!vocabulary.has(t)) {
        vocabulary.set(t, vocabulary.size)
      }
    }
  }

  const N = docs.length
  const vocabSize = vocabulary.size

  // 计算文档频率 df
  const df = new Array(vocabSize).fill(0)
  for (const tokens of docTokens) {
    const seen = new Set(tokens)
    for (const t of seen) {
      const idx = vocabulary.get(t)
      if (idx !== undefined) df[idx]++
    }
  }

  // 计算 idf
  const idf = df.map(d => Math.log(1 + N / (1 + d)))

  // 计算每篇文档的 TF-IDF 向量
  const vectors: number[][] = []
  for (const tokens of docTokens) {
    const vec = new Array(vocabSize).fill(0)
    const tf = termFrequency(tokens)
    const total = tokens.length || 1
    for (const [term, count] of tf) {
      const idx = vocabulary.get(term)
      if (idx !== undefined) {
        vec[idx] = (count / total) * idf[idx]
      }
    }
    // L2 归一化，便于余弦相似度退化为点积
    const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1
    for (let i = 0; i < vocabSize; i++) vec[i] /= norm
    vectors.push(vec)
  }

  return {
    docs,
    vectors,
    vocabulary,
    idf,
    builtAt: new Date().toISOString(),
  }
}

/** 计算查询的 TF-IDF 向量 */
export function queryVector(query: string, index: VectorIndex): number[] {
  const vec = new Array(index.vocabulary.size).fill(0)
  const tokens = localTokenize(query)
  const tf = termFrequency(tokens)
  const total = tokens.length || 1
  for (const [term, count] of tf) {
    const idx = index.vocabulary.get(term)
    if (idx !== undefined) {
      vec[idx] = (count / total) * index.idf[idx]
    }
  }
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1
  for (let i = 0; i < vec.length; i++) vec[i] /= norm
  return vec
}

/** 余弦相似度（向量已 L2 归一化时等价于点积） */
export function localCosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0
  let dot = 0
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i]
  return dot
}

// ============ 索引缓存 ============

/** 序列化索引到 localStorage（Map 需转为数组） */
export function saveIndexCache(index: VectorIndex): void {
  try {
    const serializable = {
      docs: index.docs,
      vectors: index.vectors,
      idf: index.idf,
      vocabulary: Array.from(index.vocabulary.entries()),
      builtAt: index.builtAt,
    }
    localStorage.setItem(INDEX_CACHE_KEY, JSON.stringify(serializable))
  } catch {
    // 容量超限时静默失败
  }
}

/** 从 localStorage 读取索引缓存 */
export function loadIndexCache(): VectorIndex | null {
  try {
    const raw = localStorage.getItem(INDEX_CACHE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    return {
      docs: data.docs || [],
      vectors: data.vectors || [],
      idf: data.idf || [],
      vocabulary: new Map(data.vocabulary || []),
      builtAt: data.builtAt || '',
    }
  } catch {
    return null
  }
}

// ============ 后端接口 ============

/** 触发后端构建向量索引 */
export async function buildIndex(docs?: VectorDoc[]): Promise<{ indexed: number }> {
  const res = await fetch(`${getApiBase()}/api/vector/index`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ docs }),
  })
  if (!res.ok) throw new Error(`构建索引失败: HTTP ${res.status}`)
  return res.json()
}

/** 调用后端语义检索 */
export async function semanticSearch(query: string, topK = 5): Promise<SearchResult[]> {
  const res = await fetch(`${getApiBase()}/api/vector/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ query, topK }),
  })
  if (!res.ok) throw new Error(`向量检索失败: HTTP ${res.status}`)
  const data = await res.json()
  return (data.results || []).map((r: any) => ({
    doc: r.doc || r,
    score: r.score ?? 0,
    matchedTerms: r.matchedTerms,
  }))
}

// ============ 本地检索 + 混合检索 ============

/** 纯本地 TF-IDF 检索 */
export function localSearch(query: string, index: VectorIndex, topK = 5): SearchResult[] {
  if (index.docs.length === 0) return []
  const qv = queryVector(query, index)
  const results: SearchResult[] = []
  for (let i = 0; i < index.docs.length; i++) {
    const score = localCosineSimilarity(qv, index.vectors[i])
    if (score > 0) {
      const matchedTerms = localTokenize(query).filter(t => index.vocabulary.has(t))
      results.push({ doc: index.docs[i], score, matchedTerms: Array.from(new Set(matchedTerms)) })
    }
  }
  results.sort((a, b) => b.score - a.score)
  return results.slice(0, topK)
}

/**
 * 混合检索：后端向量检索 + 本地关键词检索，按权重融合
 * 后端不可用时自动回退为纯本地检索
 */
export async function hybridSearch(
  query: string,
  index: VectorIndex | null,
  opts: SearchOptions = {}
): Promise<SearchResult[]> {
  const topK = opts.topK ?? 5
  const enableHybrid = opts.hybrid ?? true
  const merged = new Map<string, SearchResult>()

  // 1. 后端向量检索
  try {
    const remote = await semanticSearch(query, topK * 2)
    for (const r of remote) {
      merged.set(r.doc.id, { ...r, score: r.score * 0.7 })
    }
  } catch {
    // 后端不可用，后续靠本地
  }

  // 2. 本地关键词检索
  if (enableHybrid && index && index.docs.length > 0) {
    const local = localSearch(query, index, topK * 2)
    for (const r of local) {
      const existing = merged.get(r.doc.id)
      if (existing) {
        // 融合分数
        existing.score = existing.score * 0.7 + r.score * 0.3
        existing.matchedTerms = Array.from(new Set([...(existing.matchedTerms || []), ...(r.matchedTerms || [])]))
      } else {
        merged.set(r.doc.id, { ...r, score: r.score * 0.3 })
      }
    }
  }

  // 3. 排序截断
  const results = Array.from(merged.values())
  results.sort((a, b) => b.score - a.score)

  if (results.length > 0) return results.slice(0, topK)

  // 4. 全部失败时的最终本地兜底
  if (index) return localSearch(query, index, topK)
  return []
}
