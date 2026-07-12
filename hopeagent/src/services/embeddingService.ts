import { pipeline, env } from '@xenova/transformers'
import type { KnowledgeEntry } from '@/types'

env.allowLocalModels = false
env.allowRemoteModels = true

let extractor: any = null
let isLoading = false
let loadPromise: Promise<void> | null = null

const MODEL_NAME = 'Xenova/all-MiniLM-L6-v2'

export async function initEmbeddings(): Promise<void> {
  if (extractor) return
  if (isLoading && loadPromise) return loadPromise

  isLoading = true
  loadPromise = (async () => {
    try {
      extractor = await pipeline('feature-extraction', MODEL_NAME, {
        quantized: true,
      })
    } catch (err) {
      console.error('Embedding model load failed:', err)
      throw err
    } finally {
      isLoading = false
    }
  })()

  return loadPromise
}

export function isEmbeddingReady(): boolean {
  return extractor !== null
}

export async function getEmbedding(text: string): Promise<number[]> {
  if (!extractor) {
    await initEmbeddings()
  }

  const output = await extractor(text, {
    pooling: 'mean',
    normalize: true,
  })

  return Array.from(output.data)
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0
  let dot = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

export interface SearchResult {
  entry: KnowledgeEntry
  score: number
}

export async function semanticSearch(
  query: string,
  entries: (KnowledgeEntry & { embedding?: number[] })[],
  topK: number = 5
): Promise<SearchResult[]> {
  if (entries.length === 0) return []

  try {
    await initEmbeddings()

    const queryEmbedding = await getEmbedding(query)

    const results: SearchResult[] = []
    for (const entry of entries) {
      if (entry.embedding && entry.embedding.length > 0) {
        const score = cosineSimilarity(queryEmbedding, entry.embedding)
        results.push({ entry, score })
      } else {
        const text = `${entry.title} ${entry.content} ${entry.tags?.join(' ') || ''}`
        const entryEmbedding = await getEmbedding(text)
        ;(entry as any).embedding = entryEmbedding
        try {
          localStorage.setItem(`hopeagent-emb-${entry.id}`, JSON.stringify(entryEmbedding))
        } catch {}
        const score = cosineSimilarity(queryEmbedding, entryEmbedding)
        results.push({ entry, score })
      }
    }

    results.sort((a, b) => b.score - a.score)
    return results.slice(0, topK)
  } catch (err) {
    console.error('Semantic search failed:', err)
    return fallbackKeywordSearch(query, entries as KnowledgeEntry[], topK)
  }
}

function fallbackKeywordSearch(
  query: string,
  entries: KnowledgeEntry[],
  topK: number
): SearchResult[] {
  const keywords = query.toLowerCase().split(/\s+/).filter(k => k.length > 1)
  
  const results = entries.map(entry => {
    const text = `${entry.title} ${entry.content} ${entry.tags?.join(' ') || ''}`.toLowerCase()
    let score = 0
    
    for (const kw of keywords) {
      if (entry.title.toLowerCase().includes(kw)) score += 5
      if (entry.tags?.some(t => t.toLowerCase().includes(kw))) score += 3
      if (text.includes(kw)) score += 1
    }
    
    return { entry, score: score / 10 }
  })

  results.sort((a, b) => b.score - a.score)
  return results.slice(0, topK)
}

export async function computeEntryEmbedding(entry: KnowledgeEntry): Promise<number[] | null> {
  try {
    await initEmbeddings()
    const text = `${entry.title} ${entry.content} ${entry.tags?.join(' ') || ''}`
    return await getEmbedding(text)
  } catch {
    return null
  }
}

export function loadStoredEmbeddings(entries: KnowledgeEntry[]): KnowledgeEntry[] {
  return entries.map(entry => {
    try {
      const stored = localStorage.getItem(`hopeagent-emb-${entry.id}`)
      if (stored) {
        return { ...entry, embedding: JSON.parse(stored) }
      }
    } catch {}
    return entry
  })
}
