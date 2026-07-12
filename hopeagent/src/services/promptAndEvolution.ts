// Prompt模板库 + 进化阶段系统
// 参考 momiqi 的 stores/prompts.ts 和 stores/evolution.ts

// ============ Prompt 模板库 ============

export interface PromptTemplate {
  id: string
  title: string
  content: string
  category: string
  isBuiltin: boolean
}

const BUILTIN_TEMPLATES: Omit<PromptTemplate, 'id'>[] = [
  { title: '专家问答', content: '你是一位资深的{{领域}}专家。请用专业但易懂的方式回答以下问题：\n\n{{问题}}', category: '通用', isBuiltin: true },
  { title: '代码生成', content: '请用{{语言}}编写一段代码，实现以下功能：\n\n{{需求}}\n\n要求：代码简洁清晰，包含必要的注释。', category: '编程', isBuiltin: true },
  { title: '代码解释', content: '请逐行解释以下{{语言}}代码的逻辑和用途：\n\n```{{语言}}\n{{代码}}\n```', category: '编程', isBuiltin: true },
  { title: 'Bug 修复', content: '以下{{语言}}代码存在 Bug，请找出问题并给出修复方案：\n\n```{{语言}}\n{{代码}}\n```\n\n错误信息：{{错误信息}}', category: '编程', isBuiltin: true },
  { title: '中英翻译', content: '请将以下内容翻译为{{目标语言}}，保持原意和语气：\n\n{{内容}}', category: '翻译', isBuiltin: true },
  { title: '文章总结', content: '请用3-5个要点总结以下内容的核心观点：\n\n{{内容}}', category: '分析', isBuiltin: true },
  { title: '方案分析', content: '请从以下几个维度分析这个{{方案/问题}}：\n1. 优势\n2. 劣势\n3. 风险\n4. 改进建议\n\n{{描述}}', category: '分析', isBuiltin: true },
  { title: '文案撰写', content: '请为{{产品/场景}}撰写一段吸引人的文案，要求：\n- 字数：{{字数}}字左右\n- 风格：{{风格}}\n- 目标受众：{{受众}}', category: '创作', isBuiltin: true },
  { title: '邮件撰写', content: '请帮我写一封{{场景}}邮件，收件人是{{角色}}，要点如下：\n\n{{要点}}', category: '效率', isBuiltin: true },
  { title: '简历优化', content: '请帮我优化以下简历内容，突出亮点，使表达更专业：\n\n{{简历}}', category: '创作', isBuiltin: true },
  { title: '深度思考', content: '请深度思考以下问题，展示完整推理过程：\n\n{{问题}}\n\n思考框架：\n1. 理解问题核心\n2. 分解子问题\n3. 多角度分析\n4. 综合结论\n5. 自我反思', category: '分析', isBuiltin: true },
  { title: 'CEE质量优化', content: '请优化以下文本的认知质量，确保：\n- 信息结构紧凑(ITC>0.7)\n- 推理路径顺畅(SCS>0.7)\n- 信息量适中(IEC 0.4-0.7)\n- 原创性与忠实度平衡(PFFT>0.7)\n\n原文：\n{{文本}}', category: '效率', isBuiltin: true },
]

const STORAGE_KEY = 'hopeagent-prompt-templates'
const TEMPLATE_CATEGORIES = ['创作', '编程', '翻译', '分析', '效率', '通用'] as const

function loadTemplates(): PromptTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const stored = JSON.parse(raw)
      if (stored && stored.length > 0) return stored
    }
  } catch {}
  return BUILTIN_TEMPLATES.map((t, i) => ({ ...t, id: `tpl_builtin_${i}` }))
}

function saveTemplates(templates: PromptTemplate[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
  } catch {}
}

export const promptTemplates = {
  list(): PromptTemplate[] {
    return loadTemplates()
  },

  categories(): readonly string[] {
    return TEMPLATE_CATEGORIES
  },

  add(template: Omit<PromptTemplate, 'id' | 'isBuiltin'>): PromptTemplate {
    const templates = loadTemplates()
    const newTpl: PromptTemplate = {
      ...template,
      id: 'tpl_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      isBuiltin: false,
    }
    templates.push(newTpl)
    saveTemplates(templates)
    return newTpl
  },

  delete(id: string): void {
    const templates = loadTemplates()
    const idx = templates.findIndex(t => t.id === id)
    if (idx < 0 || templates[idx].isBuiltin) return
    templates.splice(idx, 1)
    saveTemplates(templates)
  },

  update(id: string, data: Partial<Omit<PromptTemplate, 'id' | 'isBuiltin'>>): void {
    const templates = loadTemplates()
    const t = templates.find(t => t.id === id)
    if (!t) return
    Object.assign(t, data)
    saveTemplates(templates)
  },

  fillTemplate(content: string, vars: Record<string, string>): string {
    let result = content
    for (const [key, value] of Object.entries(vars)) {
      result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value)
    }
    return result
  },
}

// ============ 进化阶段系统 ============

export type EvolutionStage = 'tai-awakening' | 'tai-active' | 'cai-horizon' | 'gai-ascent'

export interface StageInfo {
  label: string
  progress: number
  totalTokens: number
  nextLabel: string
  nextTokens: number
  stage: EvolutionStage
}

const STAGE_THRESHOLDS: { stage: EvolutionStage; tokens: number; label: string; icon: string }[] = [
  { stage: 'tai-awakening', tokens: 0, label: 'TAI 觉醒期', icon: '⚡' },
  { stage: 'tai-active', tokens: 10_000, label: 'TAI 活跃期', icon: '🔥' },
  { stage: 'cai-horizon', tokens: 50_000, label: 'CAI 地平线', icon: '🌟' },
  { stage: 'gai-ascent', tokens: 200_000, label: 'GAI 升维期', icon: '🚀' },
]

const EVOLUTION_STORAGE_KEY = 'hopeagent-evolution'

function computeStage(tokens: number): EvolutionStage {
  const thresholds = [...STAGE_THRESHOLDS].reverse()
  for (const t of thresholds) {
    if (tokens >= t.tokens) return t.stage
  }
  return 'tai-awakening'
}

export const evolution = {
  getStage(): EvolutionStage {
    const tokens = this.getTokens()
    return computeStage(tokens)
  },

  getTokens(): number {
    try {
      return parseInt(localStorage.getItem(EVOLUTION_STORAGE_KEY) || '0', 10)
    } catch {
      return 0
    }
  },

  addTokens(count: number): void {
    const current = this.getTokens()
    localStorage.setItem(EVOLUTION_STORAGE_KEY, String(current + count))
  },

  getStageInfo(): StageInfo {
    const totalTokens = this.getTokens()
    const stage = computeStage(totalTokens)
    const current = STAGE_THRESHOLDS.find(t => t.stage === stage)!
    const nextIdx = STAGE_THRESHOLDS.findIndex(t => t.stage === stage) + 1
    const next = nextIdx < STAGE_THRESHOLDS.length ? STAGE_THRESHOLDS[nextIdx] : null
    const progress = next
      ? Math.min(1, (totalTokens - current.tokens) / (next.tokens - current.tokens))
      : 1

    return {
      label: current.label,
      progress: Math.round(progress * 100),
      totalTokens,
      nextLabel: next?.label || '已抵达顶点',
      nextTokens: next?.tokens || 0,
      stage,
    }
  },

  getStageIcon(stage: EvolutionStage): string {
    return STAGE_THRESHOLDS.find(t => t.stage === stage)?.icon || '⚡'
  },

  getThresholds() {
    return STAGE_THRESHOLDS
  },

  reset(): void {
    localStorage.setItem(EVOLUTION_STORAGE_KEY, '0')
  },
}
