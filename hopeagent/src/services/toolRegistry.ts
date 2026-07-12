// 统一工具调用框架 ToolRegistry + ToolUseEngine
// 参考 CEE 的 plugin/skill_market 和 agent/base_agent 设计

export interface ToolParameter {
  name: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  description: string
  required?: boolean
  default?: any
  enum?: string[]
}

export interface ToolDefinition {
  name: string
  description: string
  category: string
  parameters: ToolParameter[]
  handler?: (args: Record<string, any>) => Promise<any>
  examples?: { input: Record<string, any>; output: any }[]
  tags?: string[]
  version?: string
  author?: string
}

export interface ToolExecutionResult {
  toolName: string
  success: boolean
  output?: any
  error?: string
  durationMs: number
  timestamp: number
}

export interface ToolUsePlan {
  toolName: string
  arguments: Record<string, any>
  reasoning: string
}

class ToolRegistry {
  private tools: Map<string, ToolDefinition> = new Map()
  private categories: Map<string, string[]> = new Map()
  private callHistory: ToolExecutionResult[] = []
  private maxHistory = 100

  register(tool: ToolDefinition): void {
    if (this.tools.has(tool.name)) {
      console.warn(`Tool ${tool.name} already registered, overwriting`)
    }
    this.tools.set(tool.name, { ...tool, version: tool.version || '1.0.0' })

    if (!this.categories.has(tool.category)) {
      this.categories.set(tool.category, [])
    }
    const catTools = this.categories.get(tool.category)!
    if (!catTools.includes(tool.name)) {
      catTools.push(tool.name)
    }
  }

  unregister(name: string): boolean {
    const tool = this.tools.get(name)
    if (!tool) return false

    this.tools.delete(name)
    const catTools = this.categories.get(tool.category)
    if (catTools) {
      const idx = catTools.indexOf(name)
      if (idx > -1) catTools.splice(idx, 1)
    }
    return true
  }

  get(name: string): ToolDefinition | undefined {
    return this.tools.get(name)
  }

  list(): ToolDefinition[] {
    return Array.from(this.tools.values())
  }

  listByCategory(category: string): ToolDefinition[] {
    const names = this.categories.get(category) || []
    return names.map(n => this.tools.get(n)!).filter(Boolean)
  }

  getCategories(): string[] {
    return Array.from(this.categories.keys())
  }

  has(name: string): boolean {
    return this.tools.has(name)
  }

  getOpenAISchema(): any[] {
    return Array.from(this.tools.values()).map(tool => ({
      type: 'function' as const,
      function: {
        name: tool.name,
        description: tool.description,
        parameters: this.paramsToJsonSchema(tool.parameters),
      },
    }))
  }

  private paramsToJsonSchema(params: ToolParameter[]): any {
    const properties: Record<string, any> = {}
    const required: string[] = []

    for (const p of params) {
      properties[p.name] = {
        type: p.type,
        description: p.description,
      }
      if (p.enum) properties[p.name].enum = p.enum
      if (p.default !== undefined) properties[p.name].default = p.default
      if (p.required) required.push(p.name)
    }

    return {
      type: 'object',
      properties,
      required,
    }
  }

  async execute(name: string, args: Record<string, any>): Promise<ToolExecutionResult> {
    const start = Date.now()
    const tool = this.tools.get(name)

    if (!tool) {
      return {
        toolName: name,
        success: false,
        error: `Tool not found: ${name}`,
        durationMs: Date.now() - start,
        timestamp: Date.now(),
      }
    }

    if (!tool.handler) {
      return {
        toolName: name,
        success: false,
        error: `Tool ${name} has no handler`,
        durationMs: Date.now() - start,
        timestamp: Date.now(),
      }
    }

    try {
      const validated = this.validateArgs(tool, args)
      const output = await tool.handler(validated)
      const result: ToolExecutionResult = {
        toolName: name,
        success: true,
        output,
        durationMs: Date.now() - start,
        timestamp: Date.now(),
      }
      this.recordHistory(result)
      return result
    } catch (err: any) {
      const result: ToolExecutionResult = {
        toolName: name,
        success: false,
        error: err?.message || String(err),
        durationMs: Date.now() - start,
        timestamp: Date.now(),
      }
      this.recordHistory(result)
      return result
    }
  }

  private validateArgs(tool: ToolDefinition, args: Record<string, any>): Record<string, any> {
    const validated: Record<string, any> = { ...args }

    for (const param of tool.parameters) {
      if (param.required && !(param.name in args)) {
        throw new Error(`Missing required parameter: ${param.name}`)
      }
      if (param.default !== undefined && !(param.name in args)) {
        validated[param.name] = param.default
      }
    }
    return validated
  }

  private recordHistory(result: ToolExecutionResult): void {
    this.callHistory.push(result)
    if (this.callHistory.length > this.maxHistory) {
      this.callHistory.shift()
    }
  }

  getHistory(): ToolExecutionResult[] {
    return [...this.callHistory]
  }

  getStats(): {
    totalCalls: number
    successRate: number
    topTools: { name: string; count: number }[]
  } {
    const total = this.callHistory.length
    const success = this.callHistory.filter(r => r.success).length
    const toolCounts = new Map<string, number>()
    for (const h of this.callHistory) {
      toolCounts.set(h.toolName, (toolCounts.get(h.toolName) || 0) + 1)
    }
    const topTools = Array.from(toolCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return {
      totalCalls: total,
      successRate: total > 0 ? success / total : 0,
      topTools,
    }
  }

  clearHistory(): void {
    this.callHistory = []
  }
}

export const toolRegistry = new ToolRegistry()

export function registerBuiltinTools(): void {
  if (toolRegistry.list().length > 0) return

  toolRegistry.register({
    name: 'web_search',
    description: '搜索互联网获取最新信息',
    category: '信息检索',
    tags: ['search', 'web', 'internet'],
    parameters: [
      { name: 'query', type: 'string', description: '搜索关键词', required: true },
      { name: 'max_results', type: 'number', description: '最大返回条数', default: 5 },
    ],
    examples: [
      { input: { query: 'AI最新进展', max_results: 3 }, output: '搜索结果列表' },
    ],
  })

  toolRegistry.register({
    name: 'knowledge_search',
    description: '搜索本地知识库',
    category: '信息检索',
    tags: ['knowledge', 'local', 'rag'],
    parameters: [
      { name: 'query', type: 'string', description: '搜索关键词', required: true },
      { name: 'top_k', type: 'number', description: '返回条数', default: 5 },
    ],
  })

  toolRegistry.register({
    name: 'cee_evaluate',
    description: '用CEE认知不变量评估文本质量',
    category: '质量评估',
    tags: ['cee', 'evaluation', 'quality'],
    parameters: [
      { name: 'text', type: 'string', description: '待评估文本', required: true },
    ],
  })

  toolRegistry.register({
    name: 'code_execute',
    description: '执行代码片段',
    category: '代码执行',
    tags: ['code', 'execute', 'python', 'javascript'],
    parameters: [
      { name: 'code', type: 'string', description: '代码内容', required: true },
      { name: 'language', type: 'string', description: '编程语言', default: 'javascript', enum: ['python', 'javascript', 'bash'] },
      { name: 'timeout', type: 'number', description: '超时时间(秒)', default: 30 },
    ],
  })

  toolRegistry.register({
    name: 'file_read',
    description: '读取文件内容',
    category: '文件操作',
    tags: ['file', 'read', 'io'],
    parameters: [
      { name: 'path', type: 'string', description: '文件路径', required: true },
    ],
  })

  toolRegistry.register({
    name: 'file_write',
    description: '写入文件内容',
    category: '文件操作',
    tags: ['file', 'write', 'io'],
    parameters: [
      { name: 'path', type: 'string', description: '文件路径', required: true },
      { name: 'content', type: 'string', description: '文件内容', required: true },
    ],
  })

  toolRegistry.register({
    name: 'task_decompose',
    description: '将复杂任务分解为子任务',
    category: '任务规划',
    tags: ['task', 'decompose', 'planning'],
    parameters: [
      { name: 'goal', type: 'string', description: '目标描述', required: true },
      { name: 'max_depth', type: 'number', description: '最大分解深度', default: 3 },
    ],
  })
}
