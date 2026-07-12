// RAG 文档管道：chunking + embedding + vector store + hybrid search
// 参考 CEE 的 app/engine/rag.py 设计

import { getEmbedding } from './embeddingService'

export interface ChunkInfo {
  id: string
  text: string
  startChar: number
  endChar: number
  metadata: Record<string, any>
  embedding?: number[]
}

export interface RAGConfig {
  chunkSize: number
  chunkOverlap: number
  topK: number
  vectorWeight: number
  bm25Weight: number
  minScore: number
  reRank: boolean
}

const DEFAULT_CONFIG: RAGConfig = {
  chunkSize: 512,
  chunkOverlap: 64,
  topK: 5,
  vectorWeight: 0.6,
  bm25Weight: 0.4,
  minScore: 0.0,
  reRank: true,
}

export function chunkTextFixed(
  text: string,
  chunkSize: number = DEFAULT_CONFIG.chunkSize,
  chunkOverlap: number = DEFAULT_CONFIG.chunkOverlap
): ChunkInfo[] {
  if (!text || text.length === 0) return []

  const chunks: ChunkInfo[] = []
  let start = 0
  let id = 0

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length)
    const chunkText = text.slice(start, end)

    chunks.push({
      id: `chunk_${id}`,
      text: chunkText,
      startChar: start,
      endChar: end,
      metadata: { chunkIndex: id },
    })

    id++
    if (end >= text.length) break
    start = end - chunkOverlap
  }

  return chunks
}

export function chunkTextBySentence(
  text: string,
  targetSize: number = DEFAULT_CONFIG.chunkSize
): ChunkInfo[] {
  if (!text || text.length === 0) return []

  const sentences: { text: string; start: number; end: number }[] = []
  const sentenceRegex = /[^。！？.!?\n]+[。！？.!?\n]*/g
  let match

  while ((match = sentenceRegex.exec(text)) !== null) {
    const s = match[0].trim()
    if (s) {
      sentences.push({
        text: s,
        start: match.index,
        end: match.index + match[0].length,
      })
    }
  }

  if (sentences.length === 0) {
    return chunkTextFixed(text, targetSize)
  }

  const chunks: ChunkInfo[] = []
  let currentChunk = ''
  let chunkStart = 0
  let chunkId = 0

  for (let i = 0; i < sentences.length; i++) {
    const s = sentences[i]
    if (currentChunk.length + s.text.length > targetSize && currentChunk.length > 0) {
      chunks.push({
        id: `chunk_${chunkId}`,
        text: currentChunk,
        startChar: chunkStart,
        endChar: sentences[i - 1].end,
        metadata: { chunkIndex: chunkId, sentenceCount: i },
      })
      chunkId++
      currentChunk = s.text
      chunkStart = s.start
    } else {
      if (currentChunk.length === 0) chunkStart = s.start
      currentChunk += s.text
    }
  }

  if (currentChunk.length > 0) {
    chunks.push({
      id: `chunk_${chunkId}`,
      text: currentChunk,
      startChar: chunkStart,
      endChar: sentences[sentences.length - 1].end,
      metadata: { chunkIndex: chunkId },
    })
  }

  return chunks
}

export function chunkTextSemantic(
  text: string,
  targetSize: number = DEFAULT_CONFIG.chunkSize
): ChunkInfo[] {
  const fixed = chunkTextFixed(text, targetSize, Math.floor(targetSize * 0.1))
  return fixed
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (!a || !b || a.length !== b.length) return 0
  let dot = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  if (normA === 0 || normB === 0) return 0
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 0)
}

class BM25Ranker {
  private k1 = 1.5
  private b = 0.75
  private docFreqs: Map<string, number> = new Map()
  private avgDocLen = 0
  private docs: string[] = []

  index(docs: string[]): void {
    this.docs = docs
    let totalLen = 0

    for (const doc of docs) {
      const tokens = new Set(tokenize(doc))
      totalLen += tokenize(doc).length
      for (const token of tokens) {
        this.docFreqs.set(token, (this.docFreqs.get(token) || 0) + 1)
      }
    }

    this.avgDocLen = docs.length > 0 ? totalLen / docs.length : 0
  }

  score(query: string, docIndex: number): number {
    const queryTokens = tokenize(query)
    const docTokens = tokenize(this.docs[docIndex])
    const docLen = docTokens.length
    const tfMap = new Map<string, number>()

    for (const t of docTokens) {
      tfMap.set(t, (tfMap.get(t) || 0) + 1)
    }

    let score = 0
    const N = this.docs.length

    for (const qt of queryTokens) {
      const tf = tfMap.get(qt) || 0
      const df = this.docFreqs.get(qt) || 0
      if (tf === 0 || df === 0) continue

      const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1)
      const tfNorm = (tf * (this.k1 + 1)) /
        (tf + this.k1 * (1 - this.b + this.b * (docLen / this.avgDocLen || 1)))

      score += idf * tfNorm
    }

    return score
  }
}

export class RAGEngine {
  private config: RAGConfig
  private chunks: ChunkInfo[] = []
  private bm25: BM25Ranker = new BM25Ranker()
  private bm25Indexed = false

  constructor(config: Partial<RAGConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  addDocument(
    text: string,
    metadata: Record<string, any> = {},
    method: 'fixed' | 'sentence' | 'semantic' = 'sentence'
  ): number {
    let newChunks: ChunkInfo[]
    switch (method) {
      case 'sentence':
        newChunks = chunkTextBySentence(text, this.config.chunkSize)
        break
      case 'semantic':
        newChunks = chunkTextSemantic(text, this.config.chunkSize)
        break
      default:
        newChunks = chunkTextFixed(text, this.config.chunkSize, this.config.chunkOverlap)
    }

    const baseOffset = this.chunks.length
    for (let i = 0; i < newChunks.length; i++) {
      newChunks[i].id = `chunk_${baseOffset + i}`
      newChunks[i].metadata = { ...newChunks[i].metadata, ...metadata }
    }

    this.chunks.push(...newChunks)
    this.bm25Indexed = false
    return newChunks.length
  }

  async buildEmbeddings(): Promise<void> {
    try {
      for (const chunk of this.chunks) {
        if (!chunk.embedding) {
          chunk.embedding = await getEmbedding(chunk.text)
        }
      }
    } catch (err) {
      console.warn('RAG buildEmbeddings failed:', err)
    }
  }

  private ensureBM25(): void {
    if (!this.bm25Indexed) {
      this.bm25.index(this.chunks.map(c => c.text))
      this.bm25Indexed = true
    }
  }

  async search(query: string, customConfig?: Partial<RAGConfig>): Promise<{
    chunk: ChunkInfo
    score: number
    vectorScore: number
    bm25Score: number
  }[]> {
    const config = { ...this.config, ...customConfig }
    this.ensureBM25()

    const bm25Scores: number[] = []
    for (let i = 0; i < this.chunks.length; i++) {
      bm25Scores.push(this.bm25.score(query, i))
    }
    const maxBm25 = Math.max(...bm25Scores, 1)

    let vectorScores: number[] = []
    const hasEmbeddings = this.chunks.some(c => c.embedding && c.embedding.length > 0)

    if (hasEmbeddings) {
      try {
        const queryEmb = await getEmbedding(query)
        for (const chunk of this.chunks) {
          if (chunk.embedding) {
            vectorScores.push(cosineSimilarity(queryEmb, chunk.embedding))
          } else {
            vectorScores.push(0)
          }
        }
      } catch {
        vectorScores = this.chunks.map(() => 0)
      }
    } else {
      vectorScores = this.chunks.map(() => 0)
    }

    const maxVec = Math.max(...vectorScores, 0.001)

    const results = this.chunks.map((chunk, i) => {
      const vecNorm = vectorScores[i] / maxVec
      const bm25Norm = bm25Scores[i] / maxBm25
      const combined = config.vectorWeight * vecNorm + config.bm25Weight * bm25Norm
      return {
        chunk,
        score: combined,
        vectorScore: vectorScores[i],
        bm25Score: bm25Scores[i],
      }
    })

    results.sort((a, b) => b.score - a.score)
    const filtered = results.filter(r => r.score >= config.minScore)
    return filtered.slice(0, config.topK)
  }

  async getContext(query: string, customConfig?: Partial<RAGConfig>): Promise<string> {
    const results = await this.search(query, customConfig)
    if (results.length === 0) return ''

    return results
      .map((r, i) => `[片段${i + 1}] ${r.chunk.text}`)
      .join('\n\n---\n\n')
  }

  getStats() {
    const hasEmbeddings = this.chunks.filter(c => c.embedding).length
    return {
      totalChunks: this.chunks.length,
      chunksWithEmbeddings: hasEmbeddings,
      totalChars: this.chunks.reduce((s, c) => s + c.text.length, 0),
      config: this.config,
    }
  }

  clear(): void {
    this.chunks = []
    this.bm25Indexed = false
  }
}

export const globalRAG = new RAGEngine()
