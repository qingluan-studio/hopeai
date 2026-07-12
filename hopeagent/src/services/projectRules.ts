// .cursorrules 项目规则系统 — 每个项目自定义AI行为规则
// 参考 Roo-Code 的 .clinerules 和 Cursor 的 .cursorrules 设计

export interface ProjectRule {
  id: string
  name: string
  description: string
  rules: RuleItem[]
  enabled: boolean
  createdAt: number
  updatedAt: number
}

export interface RuleItem {
  id: string
  type: 'instruction' | 'pattern' | 'forbidden' | 'preferred' | 'context'
  content: string
  priority: 'low' | 'medium' | 'high' | 'critical'
}

export interface RuleContext {
  projectName?: string
  techStack?: string[]
  codeStyle?: string
  language?: string
  framework?: string
  customRules?: string
}

const STORAGE_KEY = 'hopeagent-project-rules'

const DEFAULT_RULES: ProjectRule[] = [
  {
    id: 'default-web',
    name: 'Web前端项目默认规则',
    description: '适用于React/Vue/Next.js等前端项目',
    enabled: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    rules: [
      { id: 'r1', type: 'instruction', content: '使用TypeScript而非JavaScript', priority: 'high' },
      { id: 'r2', type: 'instruction', content: '组件使用函数式组件+Hooks', priority: 'high' },
      { id: 'r3', type: 'preferred', content: '样式优先使用Tailwind CSS', priority: 'medium' },
      { id: 'r4', type: 'forbidden', content: '不要使用any类型，用unknown代替', priority: 'high' },
      { id: 'r5', type: 'pattern', content: '文件命名使用kebab-case，组件命名使用PascalCase', priority: 'medium' },
      { id: 'r6', type: 'context', content: '项目使用Vite构建，部署到GitHub Pages', priority: 'low' },
    ],
  },
  {
    id: 'default-python',
    name: 'Python项目默认规则',
    description: '适用于Python后端/数据科学项目',
    enabled: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    rules: [
      { id: 'r1', type: 'instruction', content: '使用Python 3.10+语法', priority: 'medium' },
      { id: 'r2', type: 'instruction', content: '类型注解必写', priority: 'high' },
      { id: 'r3', type: 'preferred', content: '使用FastAPI而非Flask', priority: 'medium' },
      { id: 'r4', type: 'forbidden', content: '不要使用print调试，用logging', priority: 'high' },
      { id: 'r5', type: 'pattern', content: '使用black格式化，ruff检查', priority: 'medium' },
    ],
  },
]

class ProjectRulesManager {
  private rules: ProjectRule[] = []
  private activeRuleId: string | null = null

  constructor() {
    this.load()
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const data = JSON.parse(raw)
        this.rules = data.rules || DEFAULT_RULES
        this.activeRuleId = data.activeRuleId || null
      } else {
        this.rules = DEFAULT_RULES
      }
    } catch {
      this.rules = DEFAULT_RULES
    }
  }

  private save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        rules: this.rules,
        activeRuleId: this.activeRuleId,
      }))
    } catch {}
  }

  getRules(): ProjectRule[] {
    return [...this.rules]
  }

  getActiveRule(): ProjectRule | null {
    if (!this.activeRuleId) return null
    return this.rules.find(r => r.id === this.activeRuleId) || null
  }

  setActiveRule(id: string | null): void {
    this.activeRuleId = id
    this.save()
  }

  addRule(name: string, description: string, rules: Omit<RuleItem, 'id'>[]): ProjectRule {
    const newRule: ProjectRule = {
      id: 'rule_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      name,
      description,
      enabled: true,
      rules: rules.map((r, i) => ({ ...r, id: `r${i}` })),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    this.rules.push(newRule)
    this.save()
    return newRule
  }

  updateRule(id: string, updates: Partial<ProjectRule>): void {
    const rule = this.rules.find(r => r.id === id)
    if (rule) {
      Object.assign(rule, updates, { updatedAt: Date.now() })
      this.save()
    }
  }

  deleteRule(id: string): void {
    this.rules = this.rules.filter(r => r.id !== id)
    if (this.activeRuleId === id) this.activeRuleId = null
    this.save()
  }

  toggleRule(id: string): void {
    const rule = this.rules.find(r => r.id === id)
    if (rule) {
      rule.enabled = !rule.enabled
      this.save()
    }
  }

  buildSystemPrompt(): string {
    const active = this.getActiveRule()
    if (!active || !active.enabled) return ''

    let prompt = `## 项目规则（.cursorrules）

项目：${active.name}
描述：${active.description}

### 规则
`

    const sorted = [...active.rules].sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })

    for (const rule of sorted) {
      const icon = {
        instruction: '📌',
        pattern: '📐',
        forbidden: '🚫',
        preferred: '✅',
        context: '💡',
      }[rule.type] || '•'

      prompt += `${icon} [${rule.priority}] ${rule.content}\n`
    }

    prompt += `\n请在回答中严格遵守以上规则。`

    return prompt
  }

  generateCursorRulesFile(): string {
    const active = this.getActiveRule()
    if (!active) return ''

    let content = `# ${active.name}\n\n`
    content += `${active.description}\n\n`

    for (const rule of active.rules) {
      const prefix = {
        instruction: '',
        pattern: 'Pattern: ',
        forbidden: 'NEVER ',
        preferred: 'ALWAYS prefer ',
        context: 'Context: ',
      }[rule.type] || ''

      content += `- ${prefix}${rule.content}\n`
    }

    return content
  }

  importFromText(text: string): ProjectRule | null {
    const lines = text.split('\n').filter(l => l.trim())
    if (lines.length === 0) return null

    const name = lines[0].replace(/^#\s*/, '').trim() || '导入的规则'
    const rules: Omit<RuleItem, 'id'>[] = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].replace(/^[-*]\s*/, '').trim()
      if (!line) continue

      let type: RuleItem['type'] = 'instruction'
      let content = line
      let priority: RuleItem['priority'] = 'medium'

      if (line.toLowerCase().startsWith('never ')) {
        type = 'forbidden'
        content = line.slice(6).trim()
        priority = 'high'
      } else if (line.toLowerCase().startsWith('always prefer ')) {
        type = 'preferred'
        content = line.slice(14).trim()
      } else if (line.toLowerCase().startsWith('pattern: ')) {
        type = 'pattern'
        content = line.slice(9).trim()
      } else if (line.toLowerCase().startsWith('context: ')) {
        type = 'context'
        content = line.slice(9).trim()
        priority = 'low'
      }

      rules.push({ type, content, priority })
    }

    return this.addRule(name, '从文本导入', rules)
  }

  getStats() {
    const total = this.rules.length
    const enabled = this.rules.filter(r => r.enabled).length
    const active = this.getActiveRule()
    const totalRuleItems = this.rules.reduce((s, r) => s + r.rules.length, 0)

    return {
      totalRules: total,
      enabledRules: enabled,
      hasActiveRule: !!active,
      activeRuleName: active?.name || null,
      totalRuleItems,
    }
  }
}

export const projectRules = new ProjectRulesManager()
