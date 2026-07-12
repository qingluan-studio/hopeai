export function getLLMConfig() {
  try {
    const stored = localStorage.getItem('hopeagent-llm-config')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {}
  return null
}

export function saveLLMConfig(config: any) {
  localStorage.setItem('hopeagent-llm-config', JSON.stringify(config))
}

export function isLLMEnabled(): boolean {
  const config = getLLMConfig()
  return config?.enabled && config?.apiKey?.length > 0
}

const KIMI_BASE_URL = 'https://api.moonshot.cn/v1/chat/completions'

export async function callLLM(
  messages: { role: string; content: string }[],
  options?: {
    model?: string
    temperature?: number
    maxTokens?: number
  }
): Promise<string> {
  const config = getLLMConfig()
  if (!config || !config.apiKey) {
    throw new Error('未配置API Key，请在设置中配置')
  }

  const model = options?.model || config.model || 'moonshot-v1-8k'
  const temperature = options?.temperature ?? config.temperature ?? 0.7
  const maxTokens = options?.maxTokens || config.maxTokens || 2000
  const baseUrl = config.baseUrl || KIMI_BASE_URL

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    const errMsg = errData?.error?.message || `API调用失败 (${response.status})`
    throw new Error(errMsg)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

export function isSimpleQuery(input: string): boolean {
  const text = input.trim()
  
  if (text.length <= 20) return true
  
  const simplePatterns = [
    /^你好/,
    /^hi/i,
    /^hello/i,
    /^在吗/,
    /^在不/,
    /^谢谢/,
    /^感谢/,
    /^再见/,
    /^拜拜/,
    /^\d+\s*[+\-*/]\s*\d+/,
    /^几点了/,
    /^今天/,
    /^翻译/,
    /^解释/,
    /^什么是/,
    /^怎么读/,
    /^意思/,
  ]
  
  for (const pattern of simplePatterns) {
    if (pattern.test(text)) return true
  }
  
  const complexKeywords = [
    '开发', '写代码', '实现', '项目', '系统', '架构',
    '分析', '优化', '部署', '设计', '测试', 'bug',
    '错误', '问题', '数据', '图表', '报表',
    '网站', 'app', '应用', '功能', '接口',
    '数据库', '算法', '模型', '学习',
  ]
  
  for (const keyword of complexKeywords) {
    if (text.toLowerCase().includes(keyword)) return false
  }
  
  return text.length <= 50
}
