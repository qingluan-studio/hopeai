import type { Tool, MCPCall } from '@/types'
import { webSearch, newsSearch, githubSearch, arxivSearch, isSearchEnabled } from '@/services/searchService'

export const tools: Tool[] = [
  {
    id: 'code-executor',
    name: '代码执行器',
    icon: '⌨️',
    description: '执行Python/JavaScript代码，支持数据分析、绘图、计算等',
    category: 'code'
  },
  {
    id: 'web-search',
    name: '网页搜索',
    icon: '🔍',
    description: '搜索互联网获取最新信息',
    category: 'search'
  },
  {
    id: 'news-search',
    name: '新闻搜索',
    icon: '📰',
    description: '获取最新新闻资讯，实时事件感知',
    category: 'search'
  },
  {
    id: 'finance-data',
    name: '金融数据',
    icon: '💰',
    description: '获取股票行情、财报数据、宏观经济指标',
    category: 'data'
  },
  {
    id: 'github-search',
    name: 'GitHub搜索',
    icon: '💻',
    description: '搜索GitHub公开仓库代码',
    category: 'code'
  },
  {
    id: 'arxiv-search',
    name: '论文搜索',
    icon: '📚',
    description: '搜索arXiv学术论文',
    category: 'search'
  },
  {
    id: 'file-reader',
    name: '文件读取',
    icon: '📄',
    description: '读取和解析上传的文件内容',
    category: 'file'
  },
  {
    id: 'file-writer',
    name: '文件生成',
    icon: '📝',
    description: '生成文件并提供下载',
    category: 'file'
  },
  {
    id: 'data-analyzer',
    name: '数据分析',
    icon: '📊',
    description: '分析数据、统计计算、生成图表',
    category: 'data'
  },
  {
    id: 'chart-generator',
    name: '图表生成',
    icon: '📈',
    description: '生成各类数据可视化图表',
    category: 'data'
  },
  {
    id: 'knowledge-base',
    name: '知识库检索',
    icon: '🧠',
    description: '从用户知识库中检索相关知识',
    category: 'utility'
  },
  {
    id: 'calculator',
    name: '计算器',
    icon: '🧮',
    description: '高精度数学计算',
    category: 'utility'
  },
  {
    id: 'translator',
    name: '翻译器',
    icon: '🌐',
    description: '多语言翻译',
    category: 'utility'
  },
  {
    id: 'code-formatter',
    name: '代码格式化',
    icon: '🎨',
    description: '格式化代码，优化代码风格',
    category: 'code'
  },
  {
    id: 'regex-tester',
    name: '正则测试器',
    icon: '🔤',
    description: '测试和调试正则表达式',
    category: 'code'
  },
  {
    id: 'json-formatter',
    name: 'JSON格式化',
    icon: '📋',
    description: 'JSON格式化、校验、转换',
    category: 'utility'
  },
  {
    id: 'color-picker',
    name: '配色助手',
    icon: '🎨',
    description: '生成配色方案、颜色转换',
    category: 'design'
  },
  {
    id: 'timestamp-converter',
    name: '时间转换',
    icon: '⏰',
    description: '时间戳与日期格式转换',
    category: 'utility'
  },
  {
    id: 'password-generator',
    name: '密码生成器',
    icon: '🔐',
    description: '生成安全的随机密码',
    category: 'utility'
  },
  {
    id: 'deploy-helper',
    name: '部署助手',
    icon: '🚀',
    description: '生成部署脚本和配置',
    category: 'deploy'
  },
  {
    id: 'docker-generator',
    name: 'Docker生成器',
    icon: '🐳',
    description: '生成Dockerfile和docker-compose配置',
    category: 'deploy'
  },
  {
    id: 'kubernetes-generator',
    name: 'K8s配置生成',
    icon: '☸️',
    description: '生成Kubernetes部署配置',
    category: 'deploy'
  },
]

export function getTool(id: string): Tool | undefined {
  return tools.find(t => t.id === id)
}

export function getToolsByCategory(): Record<string, Tool[]> {
  const categories: Record<string, Tool[]> = {}
  for (const tool of tools) {
    if (!categories[tool.category]) {
      categories[tool.category] = []
    }
    categories[tool.category].push(tool)
  }
  return categories
}

export interface MCPTool {
  name: string
  description: string
  parameters: Record<string, { type: string; description: string; required?: boolean }>
  execute: (args: Record<string, any>) => Promise<string>
}

export const mcpTools: Record<string, MCPTool> = {
  search_web: {
    name: 'search_web',
    description: '搜索互联网获取最新信息',
    parameters: {
      query: { type: 'string', description: '搜索关键词', required: true },
      max_results: { type: 'number', description: '最大返回条数', required: false },
    },
    execute: async (args) => {
      const query = args.query
      const max = args.max_results || 5
      const results = await webSearch(query, max)
      const hasReal = isSearchEnabled()
      return `【网页搜索结果${hasReal ? '' : '（演示模式）'}】关键词: ${query}\n\n${results.map((r, i) => 
        `${i + 1}. ${r.title}\n   🔗 ${r.url}\n   ${r.snippet.slice(0, 150)}`
      ).join('\n\n')}${hasReal ? '' : '\n\n💡 提示：在设置中配置搜索API Key可获得真实结果'}`
    }
  },
  get_news: {
    name: 'get_news',
    description: '获取最新新闻资讯',
    parameters: {
      category: { type: 'string', description: '新闻类别：科技/财经/政治/体育/娱乐', required: false },
      count: { type: 'number', description: '返回条数', required: false },
    },
    execute: async (args) => {
      const category = args.category || '科技'
      const count = args.count || 5
      const results = await newsSearch(category, count)
      const hasReal = isSearchEnabled()
      return `【${category}新闻${hasReal ? '' : '（演示模式）'}】共${results.length}条\n\n${results.map((n, i) => 
        `${i + 1}. ${n.title}\n   📰 ${n.source || ''} | ${n.snippet.slice(0, 80)}`
      ).join('\n\n')}${hasReal ? '' : '\n\n💡 提示：配置搜索API可获得真实新闻'}`
    }
  },
  get_stock_price: {
    name: 'get_stock_price',
    description: '获取股票实时行情',
    parameters: {
      symbol: { type: 'string', description: '股票代码或符号，如AAPL、GOOGL', required: true },
      period: { type: 'string', description: '时间段：1d/1w/1m/1y', required: false },
    },
    execute: async (args) => {
      const symbol = args.symbol.toUpperCase()
      const period = args.period || '1d'
      const mockPrices: Record<string, { price: string; change: string; changePercent: string }> = {
        AAPL: { price: '$198.50', change: '+$2.30', changePercent: '+1.18%' },
        GOOGL: { price: '$141.20', change: '-$1.50', changePercent: '-1.05%' },
        MSFT: { price: '$378.90', change: '+$4.10', changePercent: '+1.10%' },
        NVDA: { price: '$875.30', change: '+$15.80', changePercent: '+1.84%' },
      }
      const data = mockPrices[symbol] || { price: '--', change: '--', changePercent: '--' }
      return `【${symbol} 行情】\n当前价格: ${data.price}\n涨跌额: ${data.change}\n涨跌幅: ${data.changePercent}\n时间段: ${period}\n\n(注：完整行情功能需要接入Yahoo Finance等API)`
    }
  },
  search_github: {
    name: 'search_github',
    description: '搜索GitHub公开仓库',
    parameters: {
      query: { type: 'string', description: '搜索关键词', required: true },
      language: { type: 'string', description: '编程语言筛选', required: false },
      max_results: { type: 'number', description: '最大返回条数', required: false },
    },
    execute: async (args) => {
      const query = args.query + (args.language ? ` language:${args.language}` : '')
      const max = args.max_results || 5
      const results = await githubSearch(query, max)
      return `【GitHub搜索】"${args.query}"${args.language ? ` (${args.language})` : ''}\n\n${results.map((r, i) => 
        `${i + 1}. ${r.title}\n   🔗 ${r.url}\n   ${r.snippet}`
      ).join('\n\n')}`
    }
  },
  search_arxiv: {
    name: 'search_arxiv',
    description: '搜索arXiv学术论文',
    parameters: {
      query: { type: 'string', description: '搜索关键词', required: true },
      max_results: { type: 'number', description: '最大返回条数', required: false },
    },
    execute: async (args) => {
      const query = args.query
      const max = args.max_results || 5
      const results = await arxivSearch(query, max)
      return `【arXiv论文搜索】"${query}"\n\n${results.map((r, i) => 
        `${i + 1}. ${r.title}\n   📄 ${r.source || 'arXiv'}\n   ${r.snippet.slice(0, 200)}`
      ).join('\n\n')}`
    }
  },
  calculate: {
    name: 'calculate',
    description: '数学计算',
    parameters: {
      expression: { type: 'string', description: '数学表达式', required: true },
    },
    execute: async (args) => {
      try {
        const expr = args.expression.replace(/[^0-9+\-*/().\s]/g, '')
        const result = eval(expr)
        return `计算结果: ${args.expression} = ${result}`
      } catch {
        return `计算失败，请检查表达式格式`
      }
    }
  },
  format_code: {
    name: 'format_code',
    description: '代码格式化',
    parameters: {
      code: { type: 'string', description: '代码内容', required: true },
      language: { type: 'string', description: '编程语言', required: false },
    },
    execute: async (args) => {
      return `【代码格式化结果】\n语言: ${args.language || 'auto'}\n\n\`\`\`${args.language || ''}\n${args.code}\n\`\`\``
    }
  },
  generate_password: {
    name: 'generate_password',
    description: '生成安全密码',
    parameters: {
      length: { type: 'number', description: '密码长度', required: false },
      include_symbols: { type: 'boolean', description: '包含特殊字符', required: false },
    },
    execute: async (args) => {
      const length = args.length || 16
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' + (args.include_symbols ? '!@#$%^&*()_+-=[]{}|;:,.<>?' : '')
      let password = ''
      for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return `生成密码: ${password}`
    }
  },
}

export async function executeMCP(call: MCPCall): Promise<string> {
  const tool = mcpTools[call.tool]
  if (!tool) {
    return `错误：工具 "${call.tool}" 不存在`
  }

  try {
    const result = await tool.execute(call.args || {})
    return result
  } catch (err) {
    return `工具执行错误: ${err instanceof Error ? err.message : String(err)}`
  }
}

export function getMCPToolDescriptions(): string {
  return Object.values(mcpTools).map(t => {
    const params = Object.entries(t.parameters).map(([name, p]) => 
      `${name}(${p.type})${p.required ? '*' : ''}: ${p.description}`
    ).join('; ')
    return `- ${t.name}: ${t.description} | 参数: ${params}`
  }).join('\n')
}
