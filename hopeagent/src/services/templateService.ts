/**
 * HopeAgent 模板管理服务
 * 提供模板列表、详情、应用、收藏、自定义模板保存等功能
 */

import type { Template, TemplateCategory } from '@/types'

// ============ 扩展类型定义 ============
export interface TemplateFilters {
  category?: Exclude<TemplateCategory, 'all'>
  search?: string
  page?: number
  pageSize?: number
  isFavorite?: boolean
  isMyTemplate?: boolean
}

export interface TemplateListResult {
  templates: Template[]
  total: number
  page: number
  pageSize: number
}

export interface TemplateUsageStats {
  totalUsage: number
  mostUsed: Template | null
  categoryStats: Record<string, number>
}

// ============ 内置模板数据（20+） ============
const BUILTIN_TEMPLATES: Template[] = [
  // 编程类
  {
    id: 'code-review',
    title: '代码审查专家',
    description: '对代码进行全面审查，找出潜在问题并给出优化建议',
    category: 'coding',
    systemPrompt: '你是一位资深的代码审查专家。请对用户提供的代码进行全面审查，包括：代码质量、潜在bug、性能问题、安全漏洞、代码风格、最佳实践等。请按重要性排序给出具体的修改建议。',
    useCases: ['代码质量检查', 'Bug 发现', '性能优化', '安全审计'],
    exampleDialog: [
      { role: 'user', content: '请帮我审查这段 Python 代码：\n```python\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n```' },
      { role: 'assistant', content: '## 代码审查报告\n\n### 1. 性能问题（严重）\n当前递归实现的时间复杂度为 O(2^n)，n=30 就会明显变慢。\n\n**建议**：使用动态规划或记忆化优化...' },
    ],
    params: [],
    usageCount: 15820,
    likes: 986,
  },
  {
    id: 'code-generator',
    title: '代码生成器',
    description: '根据需求描述生成高质量代码',
    category: 'coding',
    systemPrompt: '你是一位专业的软件工程师。请根据用户的需求描述生成高质量的代码。要求：\n1. 代码结构清晰，命名规范\n2. 添加必要的注释\n3. 处理边界情况\n4. 遵循最佳实践\n5. 附带使用示例',
    useCases: ['功能开发', '算法实现', '工具函数', 'API 开发'],
    exampleDialog: [
      { role: 'user', content: '用 JavaScript 写一个防抖函数' },
      { role: 'assistant', content: '这是一个完善的防抖函数实现：\n\n```javascript\nfunction debounce(func, wait, options = {}) {\n  // ...实现代码\n}\n```' },
    ],
    params: [
      { name: '编程语言', description: '指定生成代码的编程语言' },
    ],
    usageCount: 23450,
    likes: 1520,
  },
  {
    id: 'bug-fixer',
    title: 'Bug 修复助手',
    description: '快速定位和修复代码中的 Bug',
    category: 'coding',
    systemPrompt: '你是一位 Bug 修复专家。请帮助用户定位和修复代码中的问题。请：\n1. 分析问题原因\n2. 给出具体的修复方案\n3. 提供修复后的完整代码\n4. 说明修复的原理',
    useCases: ['Bug 定位', '错误修复', '异常处理', '调试帮助'],
    exampleDialog: [
      { role: 'user', content: '我的 React 组件报 "Cannot read property of undefined"，怎么解决？' },
      { role: 'assistant', content: '这个错误通常是因为访问了未定义的对象属性。让我帮你分析...' },
    ],
    params: [],
    usageCount: 18900,
    likes: 1230,
  },
  {
    id: 'refactor',
    title: '代码重构大师',
    description: '帮助重构和优化现有代码',
    category: 'coding',
    systemPrompt: '你是一位代码重构专家。请帮助用户重构代码，提升代码质量。重构目标包括：\n- 提高可读性\n- 减少重复\n- 优化性能\n- 改善架构\n- 遵循 SOLID 原则',
    useCases: ['代码优化', '架构改进', '技术债清理', '设计模式应用'],
    exampleDialog: [
      { role: 'user', content: '帮我重构这段冗长的函数' },
      { role: 'assistant', content: '好的，我来帮你重构这段代码。主要优化点：\n1. 拆分大函数为小函数\n2. 使用更清晰的命名\n...' },
    ],
    params: [],
    usageCount: 9870,
    likes: 756,
  },
  // 写作类
  {
    id: 'article-writer',
    title: '文章写作助手',
    description: '帮助撰写各种类型的文章',
    category: 'writing',
    systemPrompt: '你是一位专业的写作助手。请帮助用户撰写高质量的文章。要求：\n- 结构清晰，逻辑严谨\n- 语言流畅，表达准确\n- 有深度有见解\n- 根据目标读者调整风格',
    useCases: ['博客文章', '技术文档', '产品文案', '工作总结'],
    exampleDialog: [
      { role: 'user', content: '帮我写一篇关于 AI 发展趋势的文章' },
      { role: 'assistant', content: '# AI 技术发展趋势与未来展望\n\n## 引言\n\n人工智能正在以前所未有的速度发展...' },
    ],
    params: [
      { name: '文章类型', description: '博客/技术文档/营销文案等' },
      { name: '目标读者', description: '面向的读者群体' },
    ],
    usageCount: 21300,
    likes: 1680,
  },
  {
    id: 'email-writer',
    title: '邮件写作助手',
    description: '快速撰写专业的商务邮件',
    category: 'writing',
    systemPrompt: '你是一位专业的商务邮件写作助手。请根据用户需求撰写得体的邮件。\n要求：\n- 礼貌专业\n- 简洁明了\n- 结构完整（主题、称呼、正文、落款）\n- 符合商务礼仪',
    useCases: ['商务邮件', '工作沟通', '客户服务', '求职邮件'],
    exampleDialog: [
      { role: 'user', content: '帮我写一封向客户道歉的邮件，因为项目延期了' },
      { role: 'assistant', content: '**主题：** 关于项目延期的诚挚道歉与说明\n\n尊敬的客户：\n\n您好！...' },
    ],
    params: [
      { name: '邮件类型', description: '道歉/感谢/邀请/通知等' },
    ],
    usageCount: 17650,
    likes: 1120,
  },
  {
    id: 'copywriter',
    title: '营销文案专家',
    description: '撰写吸引人的营销和广告文案',
    category: 'writing',
    systemPrompt: '你是一位资深的营销文案专家。请撰写有吸引力、有说服力的营销文案。\n要点：\n- 抓住用户痛点\n- 突出产品价值\n- 有号召力的行动号召\n- 符合品牌调性',
    useCases: ['产品文案', '广告语', '社交媒体', '落地页'],
    exampleDialog: [
      { role: 'user', content: '给一款智能手表写一段产品文案' },
      { role: 'assistant', content: '⌚ **你的腕上健康管家**\n\n全天候健康监测，让科技守护你的每一天...' },
    ],
    params: [],
    usageCount: 12400,
    likes: 890,
  },
  // 分析类
  {
    id: 'data-analyst',
    title: '数据分析助手',
    description: '帮助分析数据并生成洞察',
    category: 'analysis',
    systemPrompt: '你是一位专业的数据分析师。请帮助用户分析数据，发现规律和洞察。\n请提供：\n- 数据概要统计\n- 趋势分析\n- 异常检测\n- 关键洞察\n- 行动建议',
    useCases: ['数据分析', '趋势预测', '报表生成', '数据可视化建议'],
    exampleDialog: [
      { role: 'user', content: '帮我分析这组销售数据：[100, 120, 90, 150, 180, 130]' },
      { role: 'assistant', content: '## 数据分析报告\n\n### 概要统计\n- 数据点：6 个\n- 平均值：128.33\n- 中位数：125\n...' },
    ],
    params: [],
    usageCount: 14500,
    likes: 980,
  },
  {
    id: 'swot-analysis',
    title: 'SWOT 分析',
    description: '进行专业的 SWOT 战略分析',
    category: 'analysis',
    systemPrompt: '你是一位战略咨询顾问。请帮助用户进行 SWOT 分析：\n- S (Strengths) 优势\n- W (Weaknesses) 劣势\n- O (Opportunities) 机会\n- T (Threats) 威胁\n\n最后给出战略建议。',
    useCases: ['企业战略', '产品规划', '市场分析', '竞争分析'],
    exampleDialog: [
      { role: 'user', content: '帮我对一家小型软件公司做 SWOT 分析' },
      { role: 'assistant', content: '## SWOT 分析报告\n\n### 优势 (Strengths)\n1. 技术团队精干，响应速度快\n...\n\n### 战略建议\n...' },
    ],
    params: [],
    usageCount: 8760,
    likes: 650,
  },
  // 创意类
  {
    id: 'brainstorm',
    title: '头脑风暴伙伴',
    description: '激发创意，进行头脑风暴',
    category: 'creative',
    systemPrompt: '你是一位富有创意的头脑风暴伙伴。让我们一起激发灵感！\n- 提供多角度思考\n- 鼓励天马行空\n- 建立想法链接\n- 不批评，先发散再收敛',
    useCases: ['创意激发', '产品构思', '问题解决', '方案设计'],
    exampleDialog: [
      { role: 'user', content: '帮我想一些环保主题的 App 创意' },
      { role: 'assistant', content: '## 环保 App 创意风暴 🌱\n\n### 1. 碳足迹追踪器\n- 记录日常碳排放\n- 个性化减碳建议\n- 好友PK激励\n\n### 2. 二手物品交换平台\n...' },
    ],
    params: [],
    usageCount: 11200,
    likes: 870,
  },
  {
    id: 'storyteller',
    title: '故事创作家',
    description: '创作各种类型的故事和小说',
    category: 'creative',
    systemPrompt: '你是一位才华横溢的故事创作家。请根据用户的要求创作引人入胜的故事。\n注意：\n- 人物塑造鲜明\n- 情节有起伏\n- 细节生动\n- 结构完整',
    useCases: ['小说创作', '故事编写', '剧本构思', '角色设计'],
    exampleDialog: [
      { role: 'user', content: '写一个关于时间旅行者的短篇故事' },
      { role: 'assistant', content: '## 时间的礼物\n\n林夏第一次发现自己能穿越时间，是在二十岁生日的那个雨夜...' },
    ],
    params: [
      { name: '故事类型', description: '科幻/爱情/悬疑/童话等' },
    ],
    usageCount: 9800,
    likes: 1050,
  },
  {
    id: 'slogan-generator',
    title: 'Slogan 生成器',
    description: '创作品牌口号和标语',
    category: 'creative',
    systemPrompt: '你是一位品牌创意总监。请帮助创作令人难忘的品牌口号和标语。\n要求：\n- 简洁有力\n- 易于记忆\n- 传达品牌核心价值\n- 有情感共鸣',
    useCases: ['品牌口号', '产品标语', '活动主题', '公司愿景'],
    exampleDialog: [
      { role: 'user', content: '给一家咖啡店想几个 slogan' },
      { role: 'assistant', content: '## 咖啡店 Slogan 方案\n\n### 温馨系列\n1. 「每一杯，都是温暖的相遇」\n2. 「咖啡香里，遇见自己」\n\n### 活力系列\n...' },
    ],
    params: [],
    usageCount: 7650,
    likes: 580,
  },
  // 学习类
  {
    id: 'tutor',
    title: 'AI 家教',
    description: '耐心讲解各种知识和概念',
    category: 'learning',
    systemPrompt: '你是一位耐心细致的 AI 家教。请用通俗易懂的方式讲解知识，\n帮助用户真正理解。\n- 由浅入深\n- 举例说明\n- 互动问答\n- 鼓励学习',
    useCases: ['知识学习', '概念理解', '解题辅导', '考试准备'],
    exampleDialog: [
      { role: 'user', content: '什么是机器学习？给我讲讲' },
      { role: 'assistant', content: '好的，我们来聊聊机器学习～\n\n想象一下，你教一个小朋友识别猫和狗...' },
    ],
    params: [
      { name: '学科', description: '数学/编程/物理/语言等' },
    ],
    usageCount: 19800,
    likes: 1420,
  },
  {
    id: 'language-tutor',
    title: '语言学习伙伴',
    description: '练习外语口语、语法和词汇',
    category: 'learning',
    systemPrompt: '你是一位专业的语言教师。请帮助用户学习外语，包括：\n- 词汇学习\n- 语法讲解\n- 对话练习\n- 发音指导\n- 文化背景',
    useCases: ['英语学习', '日语学习', '口语练习', '语法提高'],
    exampleDialog: [
      { role: 'user', content: '帮我练习英语日常对话' },
      { role: 'assistant', content: 'Sure! Let\'s practice English conversation. \n\nWhat would you like to talk about today? 😊' },
    ],
    params: [
      { name: '语言', description: '英语/日语/韩语/法语等' },
      { name: '水平', description: '初级/中级/高级' },
    ],
    usageCount: 16500,
    likes: 1180,
  },
  {
    id: 'interview-prep',
    title: '面试准备助手',
    description: '模拟面试，帮助准备各种面试',
    category: 'learning',
    systemPrompt: '你是一位资深的面试官。请帮助用户准备面试：\n- 模拟面试问答\n- 提供回答建议\n- 指出改进方向\n- 分享面试技巧',
    useCases: ['求职面试', '技术面试', 'MBA 面试', '公务员面试'],
    exampleDialog: [
      { role: 'user', content: '模拟一场前端工程师面试' },
      { role: 'assistant', content: '好的，我们开始前端工程师面试模拟。\n\n**第一题：请解释一下什么是闭包？**' },
    ],
    params: [
      { name: '岗位类型', description: '技术/产品/设计/运营等' },
    ],
    usageCount: 13200,
    likes: 960,
  },
  // 办公类
  {
    id: 'meeting-minutes',
    title: '会议纪要助手',
    description: '快速整理会议记录和纪要',
    category: 'office',
    systemPrompt: '你是一位专业的会议纪要助手。请将会议内容整理为清晰的纪要。\n包括：\n- 会议主题\n- 参会人员\n- 讨论要点\n- 决议事项\n- 待办任务（负责人+截止日期）',
    useCases: ['会议纪要', '讨论整理', '任务追踪', '会议总结'],
    exampleDialog: [
      { role: 'user', content: '帮我整理今天的产品评审会纪要' },
      { role: 'assistant', content: '## 产品评审会会议纪要\n\n**日期：** 2024年1月15日\n**参会人员：** 产品组、设计组、研发组\n\n### 讨论要点\n1. 新功能方案评审\n...\n\n### 决议事项\n...\n\n### 待办任务\n- [ ] @张三 完成原型设计 - 1月20日前' },
    ],
    params: [],
    usageCount: 11800,
    likes: 820,
  },
  {
    id: 'ppt-outline',
    title: 'PPT 大纲生成',
    description: '快速生成演示文稿大纲和内容',
    category: 'office',
    systemPrompt: '你是一位演示文稿设计专家。请帮助用户创建专业的 PPT 大纲。\n要求：\n- 逻辑清晰\n- 重点突出\n- 每页一个核心观点\n- 有视觉化建议',
    useCases: ['工作汇报', '项目路演', '培训课件', '产品介绍'],
    exampleDialog: [
      { role: 'user', content: '帮我做一个年度工作汇报的 PPT 大纲' },
      { role: 'assistant', content: '## 年度工作汇报 PPT 大纲\n\n### 第1页：封面\n- 标题：2024年度工作汇报\n- 副标题：XX部门 / 汇报人\n\n### 第2页：目录\n...\n\n### 共 15 页' },
    ],
    params: [],
    usageCount: 10500,
    likes: 760,
  },
  {
    id: 'resume-builder',
    title: '简历优化助手',
    description: '优化简历，提升求职竞争力',
    category: 'office',
    systemPrompt: '你是一位资深的 HR 和职业规划师。请帮助用户优化简历：\n- 突出核心优势\n- 量化工作成果\n- 优化表述方式\n- 调整排版结构',
    useCases: ['简历优化', '求职准备', '面试辅导', '职业规划'],
    exampleDialog: [
      { role: 'user', content: '帮我优化一下我的前端开发简历' },
      { role: 'assistant', content: '好的，让我来帮你优化简历。首先请提供你当前的简历内容，我会从以下几个方面进行优化：\n\n1. **个人亮点提炼**\n2. **工作经历量化**\n3. **技术栈梳理**\n4. **项目经验包装**\n5. **整体结构优化**' },
    ],
    params: [],
    usageCount: 8900,
    likes: 690,
  },
  {
    id: 'translator',
    title: '专业翻译',
    description: '高质量多语言翻译',
    category: 'office',
    systemPrompt: '你是一位专业的翻译官。请提供准确、流畅、地道的翻译。\n要求：\n- 准确传达原意\n- 符合目标语言表达习惯\n- 专业术语准确\n- 保留原文语气和风格',
    useCases: ['文档翻译', '商务翻译', '学术翻译', '日常翻译'],
    exampleDialog: [
      { role: 'user', content: '把这段翻译成英文：人工智能正在深刻改变我们的生活方式' },
      { role: 'assistant', content: 'Artificial intelligence is profoundly transforming the way we live.' },
    ],
    params: [
      { name: '目标语言', description: '翻译的目标语言' },
    ],
    usageCount: 22100,
    likes: 1350,
  },
  {
    id: 'summary',
    title: '内容摘要助手',
    description: '快速总结长文、文档或讨论内容',
    category: 'office',
    systemPrompt: '你是一位内容摘要专家。请帮助用户快速获取长内容的核心要点。\n输出要求：\n- 先给一句话总结\n- 再分点列出关键信息\n- 保持客观准确\n- 可按重要性排序',
    useCases: ['文章摘要', '文档总结', '会议纪要', '新闻速读'],
    exampleDialog: [
      { role: 'user', content: '帮我总结这篇关于 AI 的长文章' },
      { role: 'assistant', content: '## 一句话总结\n本文探讨了 AI 技术在 2024 年的五大发展趋势及其对各行各业的影响。\n\n## 关键要点\n1. **大模型小型化**：...\n2. **多模态融合**：...\n...' },
    ],
    params: [],
    usageCount: 18300,
    likes: 1240,
  },
]

// ============ 本地存储 ============
const FAVORITES_KEY = 'hopeagent-template-favorites'
const MY_TEMPLATES_KEY = 'hopeagent-my-templates'

function getFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveFavorites(ids: string[]): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids))
  } catch {}
}

function getMyTemplates(): Template[] {
  try {
    const raw = localStorage.getItem(MY_TEMPLATES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveMyTemplates(templates: Template[]): void {
  try {
    localStorage.setItem(MY_TEMPLATES_KEY, JSON.stringify(templates))
  } catch {}
}

// ============ 模板列表 ============

/**
 * 获取模板列表，支持分类/搜索/分页
 */
export function listTemplates(filters: TemplateFilters = {}): TemplateListResult {
  const favorites = getFavorites()
  const myTemplates = getMyTemplates()

  let all = [...BUILTIN_TEMPLATES, ...myTemplates].map(t => ({
    ...t,
    isFavorite: favorites.includes(t.id),
  }))

  // 分类过滤
  if (filters.category) {
    all = all.filter(t => t.category === filters.category)
  }

  // 收藏过滤
  if (filters.isFavorite) {
    all = all.filter(t => t.isFavorite)
  }

  // 我的模板过滤
  if (filters.isMyTemplate) {
    all = all.filter(t => t.isMyTemplate)
  }

  // 搜索
  if (filters.search) {
    const q = filters.search.toLowerCase()
    all = all.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.useCases.some(u => u.toLowerCase().includes(q))
    )
  }

  const total = all.length
  const page = filters.page || 1
  const pageSize = filters.pageSize || 20
  const start = (page - 1) * pageSize
  const templates = all.slice(start, start + pageSize)

  return { templates, total, page, pageSize }
}

/**
 * 获取模板详情
 */
export function getTemplate(id: string): Template | null {
  const favorites = getFavorites()
  const myTemplates = getMyTemplates()
  const all = [...BUILTIN_TEMPLATES, ...myTemplates]
  const found = all.find(t => t.id === id)
  if (!found) return null
  return { ...found, isFavorite: favorites.includes(id) }
}

// ============ 应用模板 ============

/**
 * 应用模板到当前对话，返回系统提示词
 */
export function useTemplate(id: string): string | null {
  const template = getTemplate(id)
  if (!template) return null
  return template.systemPrompt
}

// ============ 自定义模板 ============

/**
 * 保存自定义模板
 */
export function saveTemplate(data: Omit<Template, 'id' | 'usageCount' | 'likes' | 'isMyTemplate'> & { id?: string }): Template {
  const myTemplates = getMyTemplates()
  const id = data.id || 'my_' + Date.now()

  const template: Template = {
    ...data,
    id,
    usageCount: 0,
    likes: 0,
    isMyTemplate: true,
  }

  const existingIdx = myTemplates.findIndex(t => t.id === id)
  if (existingIdx >= 0) {
    myTemplates[existingIdx] = { ...myTemplates[existingIdx], ...template }
  } else {
    myTemplates.push(template)
  }

  saveMyTemplates(myTemplates)
  return template
}

/**
 * 删除自定义模板
 */
export function deleteTemplate(id: string): boolean {
  const myTemplates = getMyTemplates()
  const filtered = myTemplates.filter(t => t.id !== id)
  if (filtered.length === myTemplates.length) return false
  saveMyTemplates(filtered)

  // 同时从收藏中移除
  const favorites = getFavorites()
  if (favorites.includes(id)) {
    saveFavorites(favorites.filter(f => f !== id))
  }

  return true
}

// ============ 收藏功能 ============

/**
 * 收藏/取消收藏模板
 */
export function favoriteTemplate(id: string): boolean {
  const favorites = getFavorites()
  const idx = favorites.indexOf(id)
  if (idx >= 0) {
    favorites.splice(idx, 1)
    saveFavorites(favorites)
    return false
  } else {
    favorites.push(id)
    saveFavorites(favorites)
    return true
  }
}

/**
 * 获取收藏列表
 */
export function getFavoriteTemplates(): Template[] {
  const favorites = getFavorites()
  const all = [...BUILTIN_TEMPLATES, ...getMyTemplates()]
  return all
    .filter(t => favorites.includes(t.id))
    .map(t => ({ ...t, isFavorite: true }))
}

// ============ 分类列表 ============

/**
 * 获取模板分类列表
 */
export function getTemplateCategories(): { value: TemplateCategory; label: string; icon: string }[] {
  return [
    { value: 'all', label: '全部', icon: '📚' },
    { value: 'coding', label: '编程开发', icon: '💻' },
    { value: 'writing', label: '写作辅助', icon: '✍️' },
    { value: 'analysis', label: '数据分析', icon: '📊' },
    { value: 'creative', label: '创意设计', icon: '🎨' },
    { value: 'learning', label: '学习教育', icon: '📖' },
    { value: 'office', label: '办公效率', icon: '📎' },
  ]
}

// ============ 使用统计 ============

/**
 * 获取模板使用统计
 */
export function getTemplateUsageStats(): TemplateUsageStats {
  const all = [...BUILTIN_TEMPLATES, ...getMyTemplates()]
  const totalUsage = all.reduce((sum, t) => sum + t.usageCount, 0)
  const mostUsed = all.length > 0 ? [...all].sort((a, b) => b.usageCount - a.usageCount)[0] : null

  const categoryStats: Record<string, number> = {}
  for (const t of all) {
    categoryStats[t.category] = (categoryStats[t.category] || 0) + t.usageCount
  }

  return { totalUsage, mostUsed, categoryStats }
}

/**
 * 记录模板使用
 */
export function recordTemplateUsage(id: string): void {
  const myTemplates = getMyTemplates()
  const idx = myTemplates.findIndex(t => t.id === id)
  if (idx >= 0) {
    myTemplates[idx].usageCount++
    saveMyTemplates(myTemplates)
  }
}

/**
 * 获取热门模板
 */
export function getPopularTemplates(limit = 10): Template[] {
  const favorites = getFavorites()
  return [...BUILTIN_TEMPLATES]
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, limit)
    .map(t => ({ ...t, isFavorite: favorites.includes(t.id) }))
}

/**
 * 搜索模板
 */
export function searchTemplates(query: string): Template[] {
  const q = query.toLowerCase().trim()
  if (!q) return []
  const favorites = getFavorites()
  const all = [...BUILTIN_TEMPLATES, ...getMyTemplates()]
  return all
    .filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.useCases.some(u => u.toLowerCase().includes(q))
    )
    .map(t => ({ ...t, isFavorite: favorites.includes(t.id) }))
}

// 导出内置模板
export { BUILTIN_TEMPLATES }
