import { create } from 'zustand'
import type { KnowledgeEntry } from '@/types'

const sampleEntries: KnowledgeEntry[] = [
  {
    id: 'roadmap',
    title: '项目发展路线图',
    content: `## 第一阶段：基础搭建（当前）
- 完成多Agent协作系统核心框架
- 实现手机端适配和底部Tab导航
- 建立知识库系统和自我学习机制
- 确保GitHub Pages稳定部署

## 第二阶段：功能增强
- 接入真实大语言模型API
- 实现Agent间真实协作对话
- 完善代码生成和审查功能
- 增加更多Agent角色和模板

## 第三阶段：智能化
- 实现自我学习和知识沉淀
- 支持自定义工作流编排
- 增加项目管理和任务追踪
- 实现多项目并行管理

## 第四阶段：生态扩展
- 支持插件系统和第三方集成
- 增加团队协作和权限管理
- 支持多语言和国际化
- 建立社区和开源生态

## 第五阶段：商业化
- 企业级功能和安全审计
- SLA保障和技术支持
- 私有化部署方案
- 商业模式探索`,
    tags: ['roadmap', '规划', '发展路线'],
    category: '项目规划',
    createdAt: Date.now(),
    source: '董事长指令',
  },
  {
    id: '1',
    title: 'React最佳实践',
    content: 'React组件开发的最佳实践包括：使用函数式组件、合理使用Hooks、保持组件单一职责、使用TypeScript进行类型安全开发等。',
    tags: ['react', 'frontend', 'best-practices'],
    category: '前端开发',
    createdAt: Date.now() - 86400000 * 3,
    source: '内部文档',
  },
  {
    id: '2',
    title: 'Zustand状态管理',
    content: 'Zustand是一个轻量级的React状态管理库，使用简单、API简洁、支持TypeScript、性能优秀。核心概念是create函数创建store。',
    tags: ['zustand', 'state-management', 'react'],
    category: '前端开发',
    createdAt: Date.now() - 86400000 * 2,
    source: '官方文档',
  },
  {
    id: '3',
    title: 'TypeScript高级类型',
    content: 'TypeScript高级类型包括：条件类型、映射类型、模板字面量类型、推断类型等。这些特性可以帮助我们编写更类型安全的代码。',
    tags: ['typescript', 'types', 'advanced'],
    category: '编程语言',
    createdAt: Date.now() - 86400000,
    source: '技术博客',
  },
]

interface KnowledgeState {
  entries: KnowledgeEntry[]
  selectedEntry: string | null
  searchQuery: string
  addEntry: (entry: KnowledgeEntry) => void
  deleteEntry: (id: string) => void
  selectEntry: (id: string | null) => void
  setSearch: (query: string) => void
}

export const useKnowledgeStore = create<KnowledgeState>((set) => ({
  entries: sampleEntries,
  selectedEntry: null,
  searchQuery: '',
  addEntry: (entry) =>
    set((state) => ({ entries: [entry, ...state.entries] })),
  deleteEntry: (id) =>
    set((state) => ({
      entries: state.entries.filter((entry) => entry.id !== id),
    })),
  selectEntry: (id) => set({ selectedEntry: id }),
  setSearch: (query) => set({ searchQuery: query }),
}))
