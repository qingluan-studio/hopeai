export interface KnowledgePoint {
  id: string;
  title: string;
  content: string;
  source: string;
  tags: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
  importance: number;
  references: string[];
  embedding?: number[];
}

export interface ExtractionResult {
  points: KnowledgePoint[];
  keywords: string[];
  categories: string[];
}

export interface SearchOptions {
  limit?: number;
  minScore?: number;
  categories?: string[];
  tags?: string[];
}

export interface SearchResult {
  point: KnowledgePoint;
  score: number;
  matchedTerms: string[];
}

const defaultCategories = [
  '前端开发',
  '后端开发',
  '数据库',
  'DevOps',
  '架构设计',
  '性能优化',
  '安全',
  '测试',
  '工具链',
  '最佳实践'
];

const techKeywords = {
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
};

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function extractKnowledge(text: string, source = 'conversation'): ExtractionResult {
  const points: KnowledgePoint[] = [];
  const keywords: string[] = [];
  const categories: Set<string> = new Set();

  const sentences = text.split(/[。！？.!?\n]/).filter(s => s.trim().length > 10);
  
  sentences.forEach((sentence, index) => {
    const trimmedSentence = sentence.trim();
    const pointTags: string[] = [];
    let pointCategory = '最佳实践';

    for (const [category, words] of Object.entries(techKeywords)) {
      for (const word of words) {
        if (trimmedSentence.toLowerCase().includes(word.toLowerCase())) {
          pointTags.push(word);
          categories.add(category);
          pointCategory = category;
        }
      }
    }

    const hasCode = trimmedSentence.includes('```') || trimmedSentence.includes('function') || trimmedSentence.includes('const');
    const hasImportance = trimmedSentence.includes('重要') || trimmedSentence.includes('关键') || trimmedSentence.includes('必须') || trimmedSentence.includes('注意');
    const isQuestion = trimmedSentence.endsWith('?') || trimmedSentence.endsWith('？');

    if (pointTags.length > 0 || hasCode || hasImportance) {
      const importance = hasImportance ? 9 : (hasCode ? 7 : 5) + pointTags.length;
      
      const titleWords = trimmedSentence.slice(0, 50).replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, '').trim();
      
      const point: KnowledgePoint = {
        id: generateId(),
        title: titleWords + (titleWords.length < 50 ? '' : '...'),
        content: trimmedSentence,
        source,
        tags: [...new Set(pointTags)],
        category: pointCategory,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        importance: Math.min(importance, 10),
        references: []
      };
      
      points.push(point);
      keywords.push(...pointTags);
    }
  });

  const allKeywords = extractKeywords(text);
  const uniqueKeywords = [...new Set([...keywords, ...allKeywords])];

  return {
    points: points.sort((a, b) => b.importance - a.importance).slice(0, 20),
    keywords: uniqueKeywords,
    categories: Array.from(categories)
  };
}

export function extractKeywords(text: string): string[] {
  const keywords: string[] = [];
  const lowerText = text.toLowerCase();

  for (const words of Object.values(techKeywords)) {
    for (const word of words) {
      if (lowerText.includes(word.toLowerCase())) {
        keywords.push(word);
      }
    }
  }

  const codePatterns = [
    /```(\w+)/g,
    /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g,
    /const\s+(\w+)\s*=/g,
    /function\s+(\w+)\s*\(/g
  ];

  for (const pattern of codePatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      if (match[1] && match[1].length > 2) {
        keywords.push(match[1].toLowerCase());
      }
    }
  }

  return [...new Set(keywords)].slice(0, 30);
}

export function classifyContent(text: string): { category: string; confidence: number } {
  const lowerText = text.toLowerCase();
  let bestCategory = '最佳实践';
  let maxMatches = 0;

  for (const [category, words] of Object.entries(techKeywords)) {
    let matches = 0;
    for (const word of words) {
      if (lowerText.includes(word.toLowerCase())) {
        matches++;
      }
    }
    if (matches > maxMatches) {
      maxMatches = matches;
      bestCategory = category;
    }
  }

  const totalWords = text.split(/\s+/).length;
  const confidence = totalWords > 0 ? Math.min(maxMatches / Math.min(techKeywords[bestCategory as keyof typeof techKeywords].length, 10), 1) : 0;

  return {
    category: bestCategory,
    confidence: Math.round(confidence * 100) / 100
  };
}

export function tagContent(text: string): string[] {
  const lowerText = text.toLowerCase();
  const tags: string[] = [];

  for (const words of Object.values(techKeywords)) {
    for (const word of words) {
      if (lowerText.includes(word.toLowerCase())) {
        tags.push(word);
      }
    }
  }

  return [...new Set(tags)];
}

export function searchKnowledge(
  query: string,
  knowledgeBase: KnowledgePoint[],
  options: SearchOptions = {}
): SearchResult[] {
  const { limit = 10, minScore = 0.2, categories, tags } = options;
  const lowerQuery = query.toLowerCase();
  const queryTerms = lowerQuery.split(/\s+/).filter(t => t.length > 0);

  let filtered = knowledgeBase;
  
  if (categories && categories.length > 0) {
    filtered = filtered.filter(p => categories.includes(p.category));
  }
  
  if (tags && tags.length > 0) {
    filtered = filtered.filter(p => p.tags.some(t => tags.includes(t)));
  }

  const results: SearchResult[] = filtered.map(point => {
    let score = 0;
    const matchedTerms: string[] = [];

    const searchFields = [
      point.title.toLowerCase(),
      point.content.toLowerCase(),
      point.tags.join(' ').toLowerCase(),
      point.category.toLowerCase()
    ].join(' ');

    for (const term of queryTerms) {
      if (searchFields.includes(term)) {
        const termMatches = (searchFields.match(new RegExp(term, 'g')) || []).length;
        score += termMatches * 0.1;
        matchedTerms.push(term);
      }
    }

    if (point.title.toLowerCase().includes(lowerQuery)) {
      score += 0.5;
    }

    if (point.tags.some(t => t.toLowerCase() === lowerQuery)) {
      score += 0.4;
    }

    score += point.importance * 0.05;

    return {
      point,
      score: Math.min(score, 1),
      matchedTerms
    };
  });

  return results
    .filter(r => r.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export class KnowledgeEngine {
  private knowledgeBase: Map<string, KnowledgePoint> = new Map();
  private tagIndex: Map<string, Set<string>> = new Map();
  private categoryIndex: Map<string, Set<string>> = new Map();

  constructor(initialKnowledge: KnowledgePoint[] = []) {
    initialKnowledge.forEach(kp => this.addKnowledgePoint(kp));
  }

  addKnowledgePoint(point: Omit<KnowledgePoint, 'id' | 'createdAt' | 'updatedAt'>): KnowledgePoint {
    const id = generateId();
    const now = new Date().toISOString();
    const fullPoint: KnowledgePoint = {
      ...point,
      id,
      createdAt: now,
      updatedAt: now
    };

    this.knowledgeBase.set(id, fullPoint);
    this.updateIndexes(fullPoint);
    return fullPoint;
  }

  updateKnowledgePoint(id: string, updates: Partial<KnowledgePoint>): KnowledgePoint | null {
    const existing = this.knowledgeBase.get(id);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.removeFromIndexes(existing);
    this.knowledgeBase.set(id, updated);
    this.updateIndexes(updated);
    return updated;
  }

  deleteKnowledgePoint(id: string): boolean {
    const point = this.knowledgeBase.get(id);
    if (!point) return false;
    
    this.removeFromIndexes(point);
    return this.knowledgeBase.delete(id);
  }

  getKnowledgePoint(id: string): KnowledgePoint | undefined {
    return this.knowledgeBase.get(id);
  }

  getAllKnowledge(): KnowledgePoint[] {
    return Array.from(this.knowledgeBase.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  search(query: string, options: SearchOptions = {}): SearchResult[] {
    return searchKnowledge(query, this.getAllKnowledge(), options);
  }

  async vectorSearch(
    query: string,
    options: SearchOptions & { useFallback?: boolean } = {}
  ): Promise<SearchResult[]> {
    const { useFallback = true, limit = 10, minScore = 0.3, categories, tags } = options;

    let filtered = this.getAllKnowledge();
    
    if (categories && categories.length > 0) {
      filtered = filtered.filter(p => categories.includes(p.category));
    }
    
    if (tags && tags.length > 0) {
      filtered = filtered.filter(p => p.tags.some(t => tags.includes(t)));
    }

    try {
      const { embeddingService } = await import('@/services/embeddingService');
      
      const queryEmbedding = await embeddingService.embed(query);

      const needEmbedding = filtered.filter(p => !p.embedding);
      if (needEmbedding.length > 0) {
        const texts = needEmbedding.map(p => `${p.title}\n${p.content.slice(0, 1000)}`);
        const embeddings = await embeddingService.embedBatch(texts);
        
        needEmbedding.forEach((point, idx) => {
          point.embedding = embeddings[idx];
          this.knowledgeBase.set(point.id, point);
        });
      }

      const results: SearchResult[] = filtered
        .filter(p => p.embedding)
        .map(point => {
          const score = embeddingService.cosineSimilarity(queryEmbedding, point.embedding!);
          const boostedScore = score + (point.importance * 0.02);
          return {
            point,
            score: Math.min(boostedScore, 1),
            matchedTerms: []
          };
        })
        .filter(r => r.score >= minScore)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      return results;
    } catch (e) {
      if (useFallback) {
        console.warn('向量搜索失败，回退到关键词搜索:', e);
        return this.search(query, options);
      }
      throw e;
    }
  }

  async buildAllEmbeddings(
    onProgress?: (current: number, total: number) => void
  ): Promise<{ success: number; failed: number }> {
    const all = this.getAllKnowledge();
    const needEmbedding = all.filter(p => !p.embedding);
    const total = needEmbedding.length;
    
    if (total === 0) return { success: 0, failed: 0 };

    try {
      const { embeddingService } = await import('@/services/embeddingService');
      let success = 0;
      let failed = 0;
      
      const batchSize = 10;
      for (let i = 0; i < needEmbedding.length; i += batchSize) {
        const batch = needEmbedding.slice(i, i + batchSize);
        const texts = batch.map(p => `${p.title}\n${p.content.slice(0, 1000)}`);
        
        try {
          const embeddings = await embeddingService.embedBatch(texts);
          batch.forEach((point, idx) => {
            point.embedding = embeddings[idx];
            this.knowledgeBase.set(point.id, point);
            success++;
          });
        } catch {
          failed += batch.length;
        }
        
        onProgress?.(Math.min(i + batchSize, total), total);
      }
      
      return { success, failed };
    } catch (e) {
      console.error('构建向量索引失败:', e);
      throw e;
    }
  }

  getEmbeddingStats() {
    const all = this.getAllKnowledge();
    const withEmbedding = all.filter(p => p.embedding).length;
    return {
      total: all.length,
      withEmbedding,
      withoutEmbedding: all.length - withEmbedding,
      progress: all.length > 0 ? withEmbedding / all.length : 0
    };
  }

  extractAndStore(text: string, source = 'conversation'): ExtractionResult {
    const result = extractKnowledge(text, source);
    
    result.points.forEach(point => {
      this.knowledgeBase.set(point.id, point);
      this.updateIndexes(point);
    });

    return result;
  }

  getByCategory(category: string): KnowledgePoint[] {
    const ids = this.categoryIndex.get(category) || new Set();
    return Array.from(ids)
      .map(id => this.knowledgeBase.get(id))
      .filter((kp): kp is KnowledgePoint => !!kp)
      .sort((a, b) => b.importance - a.importance);
  }

  getByTag(tag: string): KnowledgePoint[] {
    const ids = this.tagIndex.get(tag.toLowerCase()) || new Set();
    return Array.from(ids)
      .map(id => this.knowledgeBase.get(id))
      .filter((kp): kp is KnowledgePoint => !!kp)
      .sort((a, b) => b.importance - a.importance);
  }

  getCategories(): string[] {
    return Array.from(this.categoryIndex.keys()).sort();
  }

  getTags(): string[] {
    return Array.from(this.tagIndex.keys()).sort();
  }

  getStats() {
    return {
      total: this.knowledgeBase.size,
      categories: this.categoryIndex.size,
      tags: this.tagIndex.size,
      byCategory: Object.fromEntries(
        Array.from(this.categoryIndex.entries()).map(([cat, ids]) => [cat, ids.size])
      )
    };
  }

  private updateIndexes(point: KnowledgePoint): void {
    if (!this.categoryIndex.has(point.category)) {
      this.categoryIndex.set(point.category, new Set());
    }
    this.categoryIndex.get(point.category)!.add(point.id);

    point.tags.forEach(tag => {
      const lowerTag = tag.toLowerCase();
      if (!this.tagIndex.has(lowerTag)) {
        this.tagIndex.set(lowerTag, new Set());
      }
      this.tagIndex.get(lowerTag)!.add(point.id);
    });
  }

  private removeFromIndexes(point: KnowledgePoint): void {
    this.categoryIndex.get(point.category)?.delete(point.id);
    if (this.categoryIndex.get(point.category)?.size === 0) {
      this.categoryIndex.delete(point.category);
    }

    point.tags.forEach(tag => {
      const lowerTag = tag.toLowerCase();
      this.tagIndex.get(lowerTag)?.delete(point.id);
      if (this.tagIndex.get(lowerTag)?.size === 0) {
        this.tagIndex.delete(lowerTag);
      }
    });
  }

  exportJSON(): string {
    return JSON.stringify(this.getAllKnowledge(), null, 2);
  }

  importJSON(json: string): number {
    try {
      const points = JSON.parse(json) as KnowledgePoint[];
      let imported = 0;
      points.forEach(point => {
        if (point.id && point.title && point.content) {
          this.knowledgeBase.set(point.id, point);
          this.updateIndexes(point);
          imported++;
        }
      });
      return imported;
    } catch (e) {
      console.error('Import failed:', e);
      return 0;
    }
  }
}

import { extendedKnowledge } from './knowledgeData';

export const defaultKnowledgeEngine = new KnowledgeEngine(extendedKnowledge);
