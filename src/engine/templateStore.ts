export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  keywords: string[];
  content: string;
  language?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  lastUsedAt?: string;
}

export interface TemplateMatch {
  template: Template;
  score: number;
  matchedKeywords: string[];
}

export class TemplateStore {
  private templates: Map<string, Template> = new Map();
  private keywordIndex: Map<string, Set<string>> = new Map();
  private categoryIndex: Map<string, Set<string>> = new Map();
  private STORAGE_KEY = 'hopeai_templates';

  constructor() {
    this.loadFromStorage();
    this.initBuiltinTemplates();
  }

  private initBuiltinTemplates(): void {
    const builtinTemplates: Omit<Template, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>[] = [
      {
        name: 'React组件模板',
        description: 'React函数组件基础模板',
        category: 'react',
        keywords: ['react', 'component', 'function', '组件'],
        language: 'tsx',
        tags: ['react', 'typescript', 'frontend'],
        content: `import React from 'react';

interface Props {
  title: string;
}

const ComponentName: React.FC<Props> = ({ title }) => {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <h1>{title}</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
};

export default ComponentName;`
      },
      {
        name: 'Vue组件模板',
        description: 'Vue3组合式API组件模板',
        category: 'vue',
        keywords: ['vue', 'component', 'composition', '组件'],
        language: 'vue',
        tags: ['vue', 'frontend'],
        content: `<template>
  <div>
    <h1>{{ title }}</h1>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  title: string;
}>();

const count = ref(0);

const increment = () => {
  count.value++;
};
</script>`
      },
      {
        name: 'Express路由模板',
        description: 'Express.js路由处理模板',
        category: 'backend',
        keywords: ['express', 'route', 'api', '路由'],
        language: 'ts',
        tags: ['express', 'nodejs', 'backend', 'api'],
        content: `import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await fetchData();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const result = await createData(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;`
      },
      {
        name: 'TypeScript类模板',
        description: 'TypeScript类定义模板',
        category: 'typescript',
        keywords: ['typescript', 'class', 'oop', '类'],
        language: 'ts',
        tags: ['typescript', 'oop'],
        content: `class ClassName {
  private property: string;
  public readonly id: number;

  constructor(id: number, property: string) {
    this.id = id;
    this.property = property;
  }

  public getProperty(): string {
    return this.property;
  }

  public setProperty(value: string): void {
    this.property = value;
  }

  public async process(): Promise<void> {
    // 处理逻辑
  }
}

export default ClassName;`
      },
      {
        name: 'Dockerfile模板',
        description: 'Node.js项目Dockerfile模板',
        category: 'devops',
        keywords: ['docker', 'dockerfile', 'container', '容器'],
        language: 'dockerfile',
        tags: ['docker', 'devops'],
        content: `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "dist/index.js"]`
      },
      {
        name: 'GitHub Action CI模板',
        description: 'GitHub Actions持续集成工作流模板',
        category: 'devops',
        keywords: ['github', 'action', 'ci', 'workflow'],
        language: 'yaml',
        tags: ['github', 'ci', 'devops'],
        content: `name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'

      - run: npm ci
      - run: npm run build
      - run: npm test`
      },
      {
        name: 'Jest测试模板',
        description: 'Jest单元测试模板',
        category: 'testing',
        keywords: ['jest', 'test', 'unit', '测试'],
        language: 'ts',
        tags: ['jest', 'testing'],
        content: `import { describe, it, expect } from '@jest/globals';
import functionToTest from '../src/function';

describe('Function Name', () => {
  it('should return correct result', () => {
    const result = functionToTest('input');
    expect(result).toBe('expected');
  });

  it('should handle edge cases', () => {
    const result = functionToTest('');
    expect(result).toBe('');
  });

  it('should throw error for invalid input', () => {
    expect(() => functionToTest(null as any)).toThrow();
  });
});`
      },
      {
        name: 'HTTP请求封装',
        description: '基于fetch的HTTP请求封装',
        category: 'frontend',
        keywords: ['http', 'fetch', 'api', 'request'],
        language: 'ts',
        tags: ['http', 'api', 'frontend'],
        content: `const BASE_URL = process.env.API_URL || 'http://localhost:3000';

export async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(\`\${BASE_URL}\${url}\`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: '请求失败' }));
    throw new Error(error.message || '请求失败');
  }

  return response.json();
}

export const get = <T>(url: string) => request<T>(url);
export const post = <T>(url: string, data: unknown) => 
  request<T>(url, { method: 'POST', body: JSON.stringify(data) });
export const put = <T>(url: string, data: unknown) => 
  request<T>(url, { method: 'PUT', body: JSON.stringify(data) });
export const del = <T>(url: string) => request<T>(url, { method: 'DELETE' });`
      },
      {
        name: 'CSS动画模板',
        description: 'CSS关键帧动画模板',
        category: 'css',
        keywords: ['css', 'animation', 'keyframes', '动画'],
        language: 'css',
        tags: ['css', 'animation'],
        content: `.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}`
      },
      {
        name: 'WebSocket连接模板',
        description: 'WebSocket客户端连接模板',
        category: 'websocket',
        keywords: ['websocket', 'ws', 'realtime', '实时'],
        language: 'ts',
        tags: ['websocket', 'realtime'],
        content: `class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  connect(): void {
    this.ws = new WebSocket(this.url);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected, reconnecting...');
      setTimeout(() => this.connect(), 5000);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  send(message: unknown): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  private handleMessage(data: unknown): void {
    console.log('Received message:', data);
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}`
      }
    ];

    builtinTemplates.forEach(template => {
      const existing = this.templates.get(template.name);
      if (!existing) {
        this.addTemplate(template);
      }
    });
  }

  addTemplate(template: Omit<Template, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>): Template {
    const now = new Date().toISOString();
    const id = `${template.category}-${template.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    
    const newTemplate: Template = {
      ...template,
      id,
      createdAt: now,
      updatedAt: now,
      usageCount: 0
    };

    this.templates.set(id, newTemplate);
    this.updateIndexes(newTemplate);
    this.saveToStorage();
    
    return newTemplate;
  }

  private updateIndexes(template: Template): void {
    template.keywords.forEach(keyword => {
      const normalized = keyword.toLowerCase();
      if (!this.keywordIndex.has(normalized)) {
        this.keywordIndex.set(normalized, new Set());
      }
      this.keywordIndex.get(normalized)!.add(template.id);
    });

    if (!this.categoryIndex.has(template.category)) {
      this.categoryIndex.set(template.category, new Set());
    }
    this.categoryIndex.get(template.category)!.add(template.id);
  }

  search(query: string, options: {
    topK?: number;
    category?: string;
    minScore?: number;
  } = {}): TemplateMatch[] {
    const { topK = 5, category, minScore = 0.3 } = options;
    const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);
    
    if (queryTerms.length === 0) return [];

    const scores = new Map<string, { score: number; matchedKeywords: string[] }>();

    queryTerms.forEach(term => {
      const matchedIds = new Set<string>();
      
      this.keywordIndex.forEach((ids, keyword) => {
        if (keyword.includes(term) || term.includes(keyword)) {
          ids.forEach(id => matchedIds.add(id));
        }
      });

      matchedIds.forEach(id => {
        const current = scores.get(id) || { score: 0, matchedKeywords: [] };
        current.score += 1 / queryTerms.length;
        
        const template = this.templates.get(id);
        if (template) {
          const exactMatch = template.keywords.find(k => 
            k.toLowerCase() === term || term === k.toLowerCase()
          );
          if (exactMatch) {
            current.score += 0.5;
            if (!current.matchedKeywords.includes(exactMatch)) {
              current.matchedKeywords.push(exactMatch);
            }
          }
        }
        
        scores.set(id, current);
      });
    });

    const filtered = Array.from(scores.entries())
      .map(([id, { score, matchedKeywords }]) => ({
        template: this.templates.get(id)!,
        score,
        matchedKeywords
      }))
      .filter(match => match.score >= minScore)
      .sort((a, b) => b.score - a.score);

    const categoryFiltered = category 
      ? filtered.filter(m => m.template.category === category)
      : filtered;

    return categoryFiltered.slice(0, topK);
  }

  getById(id: string): Template | undefined {
    return this.templates.get(id);
  }

  getByCategory(category: string): Template[] {
    const ids = this.categoryIndex.get(category);
    if (!ids) return [];
    return Array.from(ids).map(id => this.templates.get(id)!).filter(Boolean);
  }

  getAll(): Template[] {
    return Array.from(this.templates.values());
  }

  updateTemplate(id: string, updates: Partial<Omit<Template, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>>): Template | undefined {
    const template = this.templates.get(id);
    if (!template) return undefined;

    const updated: Template = {
      ...template,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.templates.set(id, updated);
    this.saveToStorage();
    
    return updated;
  }

  deleteTemplate(id: string): boolean {
    const template = this.templates.get(id);
    if (!template) return false;

    template.keywords.forEach(keyword => {
      const ids = this.keywordIndex.get(keyword.toLowerCase());
      if (ids) {
        ids.delete(id);
      }
    });

    const catIds = this.categoryIndex.get(template.category);
    if (catIds) {
      catIds.delete(id);
    }

    this.templates.delete(id);
    this.saveToStorage();
    
    return true;
  }

  useTemplate(id: string): Template | undefined {
    const template = this.templates.get(id);
    if (!template) return undefined;

    const updated: Template = {
      ...template,
      usageCount: template.usageCount + 1,
      lastUsedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.templates.set(id, updated);
    this.saveToStorage();
    
    return updated;
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(Array.from(this.templates.values())));
      } catch (e) {
        console.warn('Failed to save templates to localStorage:', e);
      }
    }
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          const templates = JSON.parse(stored) as Template[];
          templates.forEach(template => {
            this.templates.set(template.id, template);
            this.updateIndexes(template);
          });
        }
      } catch (e) {
        console.warn('Failed to load templates from localStorage:', e);
      }
    }
  }

  importTemplates(templates: Omit<Template, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>[]): number {
    let count = 0;
    templates.forEach(template => {
      const existing = Array.from(this.templates.values()).find(
        t => t.name === template.name && t.category === template.category
      );
      if (!existing) {
        this.addTemplate(template);
        count++;
      }
    });
    return count;
  }

  exportTemplates(): Template[] {
    return this.getAll();
  }
}

export const templateStore = new TemplateStore();
