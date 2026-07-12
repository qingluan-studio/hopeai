/**
 * HopeAgent 多模型路由服务
 * 对接后端 /api/models/* 接口，提供模型列表/切换/测试、按任务推荐、Token 与成本估算
 */

import { getApiBase } from './apiClient'
import { authHeaders } from './authService'

// ============ 类型定义 ============
export type TaskType = 'code' | 'longtext' | 'reasoning' | 'chat' | 'writing' | 'vision'

export interface ModelInfo {
  id: string
  name: string
  provider: 'kimi' | 'openai' | 'anthropic' | 'zhipu' | 'qwen' | 'deepseek' | 'other'
  /** 上下文窗口（token 数） */
  contextWindow: number
  /** 输入价格（美元 / 1M token） */
  inputPricePer1M?: number
  /** 输出价格（美元 / 1M token） */
  outputPricePer1M?: number
  /** 该模型擅长的任务类型 */
  strengths: TaskType[]
  /** 平均响应速度（token/秒），用于快速模型判定 */
  speed?: number
  description: string
  enabled?: boolean
}

export interface ModelConfig {
  currentModelId: string
  /** 用户偏好：特定任务固定使用某模型 */
  taskOverrides?: Partial<Record<TaskType, string>>
}

export interface ModelTestResult {
  ok: boolean
  latencyMs?: number
  sample?: string
  error?: string
}

// ============ 内置模型库 ============
export const BUILTIN_MODELS: ModelInfo[] = [
  {
    id: 'moonshot-v1-8k',
    name: 'Kimi v1 (8K)',
    provider: 'kimi',
    contextWindow: 8000,
    inputPricePer1M: 1.2,
    outputPricePer1M: 1.2,
    strengths: ['chat', 'writing'],
    speed: 60,
    description: 'Moonshot 8K 上下文，适合日常对话与短文写作，性价比高。',
  },
  {
    id: 'moonshot-v1-32k',
    name: 'Kimi v1 (32K)',
    provider: 'kimi',
    contextWindow: 32000,
    inputPricePer1M: 2.4,
    outputPricePer1M: 2.4,
    strengths: ['chat', 'writing', 'longtext'],
    speed: 55,
    description: '32K 中等上下文，适合长文档摘要与多轮对话。',
  },
  {
    id: 'moonshot-v1-128k',
    name: 'Kimi v1 (128K)',
    provider: 'kimi',
    contextWindow: 128000,
    inputPricePer1M: 6.0,
    outputPricePer1M: 6.0,
    strengths: ['longtext', 'reasoning'],
    speed: 45,
    description: '128K 长上下文，适合超长文档分析、代码库级理解。',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    contextWindow: 128000,
    inputPricePer1M: 5.0,
    outputPricePer1M: 15.0,
    strengths: ['code', 'reasoning', 'vision', 'writing'],
    speed: 80,
    description: 'OpenAI 旗舰多模态，推理与代码能力强，支持图像理解。',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o mini',
    provider: 'openai',
    contextWindow: 128000,
    inputPricePer1M: 0.15,
    outputPricePer1M: 0.6,
    strengths: ['chat', 'code'],
    speed: 120,
    description: '轻量快速模型，适合日常对话与简单代码任务，成本极低。',
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    contextWindow: 200000,
    inputPricePer1M: 3.0,
    outputPricePer1M: 15.0,
    strengths: ['writing', 'code', 'reasoning', 'longtext'],
    speed: 75,
    description: 'Anthropic 写作与代码俱佳，长上下文表现稳定。',
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'anthropic',
    contextWindow: 200000,
    inputPricePer1M: 0.25,
    outputPricePer1M: 1.25,
    strengths: ['chat'],
    speed: 130,
    description: '快速响应模型，适合高频轻量对话场景。',
  },
  {
    id: 'deepseek-coder',
    name: 'DeepSeek Coder',
    provider: 'deepseek',
    contextWindow: 64000,
    inputPricePer1M: 0.5,
    outputPricePer1M: 1.0,
    strengths: ['code'],
    speed: 70,
    description: '专为代码任务优化，支持多语言代码生成与补全。',
  },
  {
    id: 'glm-4',
    name: 'GLM-4',
    provider: 'zhipu',
    contextWindow: 128000,
    inputPricePer1M: 1.5,
    outputPricePer1M: 1.5,
    strengths: ['chat', 'writing', 'reasoning'],
    speed: 65,
    description: '智谱 GLM-4，中文理解优秀，适合中文写作与推理。',
  },
  {
    id: 'qwen-max',
    name: 'Qwen Max',
    provider: 'qwen',
    contextWindow: 32000,
    inputPricePer1M: 2.0,
    outputPricePer1M: 6.0,
    strengths: ['chat', 'reasoning', 'writing'],
    speed: 60,
    description: '通义千问旗舰模型，中文场景表现优异。',
  },
]

const CONFIG_KEY = 'hopeagent-model-config'

// ============ 配置管理 ============
export function getModelConfig(): ModelConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY)
    if (raw) return { currentModelId: 'moonshot-v1-8k', ...JSON.parse(raw) }
  } catch {}
  return { currentModelId: 'moonshot-v1-8k' }
}

export function saveModelConfig(config: ModelConfig): void {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
  } catch {}
}

export function getCurrentModel(): ModelInfo {
  const config = getModelConfig()
  return BUILTIN_MODELS.find(m => m.id === config.currentModelId) || BUILTIN_MODELS[0]
}

// ============ 后端接口 ============

/** 拉取后端可用模型列表（失败回退内置库） */
export async function listModels(): Promise<ModelInfo[]> {
  try {
    const res = await fetch(`${getApiBase()}/api/models`, {
      headers: { ...authHeaders() },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    const remote: ModelInfo[] = data.models || data
    if (Array.isArray(remote) && remote.length > 0) return remote
    return BUILTIN_MODELS
  } catch {
    return BUILTIN_MODELS
  }
}

/** 切换当前默认模型（同步本地 + 上报后端） */
export async function switchModel(modelId: string): Promise<ModelConfig> {
  const config = getModelConfig()
  config.currentModelId = modelId
  saveModelConfig(config)
  try {
    await fetch(`${getApiBase()}/api/models/switch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ modelId }),
    })
  } catch {
    // 后端不可用时仅本地生效
  }
  return config
}

/** 测试模型连通性 */
export async function testModel(modelId: string): Promise<ModelTestResult> {
  const start = Date.now()
  try {
    const res = await fetch(`${getApiBase()}/api/models/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ modelId }),
    })
    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}`, latencyMs: Date.now() - start }
    }
    const data = await res.json()
    return {
      ok: true,
      latencyMs: Date.now() - start,
      sample: data.sample || data.reply,
    }
  } catch (err: any) {
    return { ok: false, error: err?.message || '测试失败', latencyMs: Date.now() - start }
  }
}

// ============ 按任务推荐 ============

/**
 * 按任务类型推荐最合适的模型
 * 优先用户显式覆盖，其次按强度匹配 + 成本/速度择优
 */
export function selectModelForTask(taskType: TaskType, models: ModelInfo[] = BUILTIN_MODELS): ModelInfo {
  const config = getModelConfig()
  // 用户指定了该任务的固定模型
  const override = config.taskOverrides?.[taskType]
  if (override) {
    const m = models.find(x => x.id === override)
    if (m) return m
  }

  // 候选：擅长该任务的模型
  const candidates = models.filter(m => m.strengths.includes(taskType) && m.enabled !== false)
  const pool = candidates.length > 0 ? candidates : models

  // 推理/长文 → 优先上下文窗口最大
  if (taskType === 'reasoning' || taskType === 'longtext') {
    return [...pool].sort((a, b) => b.contextWindow - a.contextWindow)[0]
  }
  // 代码 → 优先 strengths 含 code 且上下文足够
  if (taskType === 'code') {
    return [...pool].sort((a, b) => {
      const sa = (a.strengths.includes('code') ? 2 : 0) + a.contextWindow / 100000
      const sb = (b.strengths.includes('code') ? 2 : 0) + b.contextWindow / 100000
      return sb - sa
    })[0]
  }
  // 日常对话 → 优先速度快、成本低
  if (taskType === 'chat') {
    return [...pool].sort((a, b) => (b.speed || 0) - (a.speed || 0))[0]
  }
  // 写作 → 优先 Claude / GLM 等写作强的
  if (taskType === 'writing') {
    return [...pool].sort((a, b) => {
      const sa = (a.strengths.includes('writing') ? 2 : 0) + (a.provider === 'anthropic' ? 1 : 0)
      const sb = (b.strengths.includes('writing') ? 2 : 0) + (b.provider === 'anthropic' ? 1 : 0)
      return sb - sa
    })[0]
  }
  // 默认返回当前模型
  return getCurrentModel()
}

// ============ Token 与成本估算 ============

/**
 * 估算文本 token 数
 * 经验值：1 token ≈ 2 个中文字符 / 4 个英文字符
 */
export function estimateTokens(text: string): number {
  if (!text) return 0
  // 统计中文字符数
  const cjkCount = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  const otherCount = text.length - cjkCount
  return Math.ceil(cjkCount / 2 + otherCount / 4)
}

/**
 * 估算单次调用成本（美元）
 * @param modelId 模型 ID
 * @param inputTokens 输入 token 数
 * @param outputTokens 输出 token 数
 */
export function estimateCost(modelId: string, inputTokens: number, outputTokens: number): number {
  const model = BUILTIN_MODELS.find(m => m.id === modelId) || getCurrentModel()
  const inPrice = model.inputPricePer1M ?? 0
  const outPrice = model.outputPricePer1M ?? 0
  return (inputTokens / 1_000_000) * inPrice + (outputTokens / 1_000_000) * outPrice
}

/** 判断上下文是否超出模型窗口 */
export function isContextExceeded(modelId: string, totalTokens: number): boolean {
  const model = BUILTIN_MODELS.find(m => m.id === modelId)
  if (!model) return false
  return totalTokens > model.contextWindow
}

/** 获取模型能力简述（用于 UI 展示） */
export function getModelCapability(modelId: string): string {
  const model = BUILTIN_MODELS.find(m => m.id === modelId)
  if (!model) return '未知模型'
  const parts: string[] = []
  parts.push(`${(model.contextWindow / 1000).toFixed(0)}K 上下文`)
  if (model.strengths.includes('code')) parts.push('代码强')
  if (model.strengths.includes('reasoning')) parts.push('推理强')
  if (model.strengths.includes('writing')) parts.push('写作好')
  if (model.strengths.includes('longtext')) parts.push('长文擅长')
  if (model.strengths.includes('vision')) parts.push('支持图像')
  if (model.speed && model.speed >= 100) parts.push('快速响应')
  return parts.join(' · ')
}
