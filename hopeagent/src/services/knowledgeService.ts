import type { KnowledgeEntry } from '@/types'
import { semanticSearch, loadStoredEmbeddings, isEmbeddingReady, initEmbeddings } from './embeddingService'

const STORAGE_KEY = 'hopeagent-knowledge'
let useSemantic = false

export function enableSemanticSearch() {
  useSemantic = true
}

export function getKnowledgeEntries(): KnowledgeEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const entries = JSON.parse(stored)
      return loadStoredEmbeddings(entries)
    }
  } catch {}
  return getInitialKnowledge()
}

export function saveKnowledgeEntries(entries: KnowledgeEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export function addKnowledgeEntry(entry: Omit<KnowledgeEntry, 'id' | 'createdAt'>): KnowledgeEntry {
  const entries = getKnowledgeEntries()
  const newEntry: KnowledgeEntry = {
    ...entry,
    id: 'k_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
    createdAt: new Date().toISOString(),
  }
  entries.unshift(newEntry)
  saveKnowledgeEntries(entries)
  return newEntry
}

export function deleteKnowledgeEntry(id: string) {
  const entries = getKnowledgeEntries().filter(e => e.id !== id)
  saveKnowledgeEntries(entries)
}

export async function searchKnowledge(query: string, topK: number = 5): Promise<KnowledgeEntry[]> {
  const entries = getKnowledgeEntries()
  if (!query.trim() || entries.length === 0) return []

  if (useSemantic && isEmbeddingReady()) {
    const results = await semanticSearch(query, entries, topK)
    return results.map(r => r.entry)
  }

  const q = query.toLowerCase()
  const qWords = q.split(/[\s,，。、！？.。；：]+/).filter(w => w.length > 1)

  const scored = entries.map(entry => {
    let score = 0
    const title = entry.title.toLowerCase()
    const content = entry.content.toLowerCase()
    const tags = entry.tags.join(' ').toLowerCase()

    for (const word of qWords) {
      if (title.includes(word)) score += 5
      if (tags.includes(word)) score += 3
      if (content.includes(word)) score += 1
    }

    for (const tag of entry.tags) {
      if (q.includes(tag.toLowerCase()) && tag.length > 1) score += 2
    }

    score += entry.importance * 0.5

    return { entry, score }
  })

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(s => s.entry)
}

export async function getRAGContext(query: string, topK: number = 3): Promise<string> {
  const results = await searchKnowledge(query, topK)
  if (results.length === 0) return ''

  const refs = results.map((e, i) => {
    return `【知识${i + 1}：${e.title}】\n${e.content.slice(0, 1000)}`
  }).join('\n\n')

  return `\n\n以下是从知识库中检索到的相关资料，供你参考：\n${refs}\n\n请结合以上资料回答用户问题，如果资料中有相关内容，请引用。`
}

function getInitialKnowledge(): KnowledgeEntry[] {
  return [
    {
      id: 'k_strat_1',
      title: 'HopeAgent Pro 5年战略蓝图',
      content: '2026-2030年发展路线：2026年开源筑基(1000+Star, 100+贡献者)→2027年生态扩张(100+高校课程, 50+第三方Agent)→2028年标准制定(10万+用户, HopeAI基金会)→2029年平台化(100万+用户, 全球化)→2030年基础设施(1000万+用户, 行业标准)。收入来源：云厂商赞助30%、企业定制25%、基金会捐赠20%、政府资助15%、品牌周边10%。',
      tags: ['战略', '5年计划', '开源', '生态'],
      category: '战略',
      source: 'auto',
      createdAt: new Date().toISOString(),
      importance: 10,
    },
    {
      id: 'k_strat_2',
      title: '免费路线飞轮模型',
      content: '正循环逻辑：免费开源代码→开发者涌入→生态丰富→用户基数庞大→企业愿意付费→品牌势能提升→更多资源投入开源。核心是构建正反馈飞轮，实现指数增长。',
      tags: ['飞轮效应', '商业模式', '指数增长'],
      category: '战略',
      source: 'auto',
      createdAt: new Date().toISOString(),
      importance: 9,
    },
    {
      id: 'k_strat_3',
      title: '开源项目体系',
      content: '编排框架层：AutoGen(微软44K+stars)、CrewAI(角色扮演SOP)、LangGraph(图论DAG)、DeerFlow(字节跳动)、OpenAI Agents SDK。记忆与工具层：Letta(分级记忆)、Agno(工具转化)、Composio(250+工具)、browser-use(浏览器自动化)。应用层：Anything-LLM、MetaGPT、Activepieces、PydanticAI。',
      tags: ['开源', 'AutoGen', 'CrewAI', 'LangGraph'],
      category: '技术',
      source: 'auto',
      createdAt: new Date().toISOString(),
      importance: 8,
    },
    {
      id: 'k_strat_4',
      title: '数据爬取体系',
      content: '公开数据源：Common Crawl(PB级网页快照)、arXiv(200万+论文)、GitHub/GitLab(代码语料)、Wikipedia(600万+词条)、中国裁判文书网(法律语料)。实时数据流：社交媒体(X/Reddit/微博)、新闻资讯(RSS/NewsAPI)、金融数据(Yahoo/东方财富)、电商数据(价格监控)。Agent自产数据：执行轨迹(Trajectory)、对话历史(Dialogue Log)、反馈数据(Feedback Loop)、合成数据(Synthetic Data)。',
      tags: ['数据', '爬取', '语料', '开源数据'],
      category: '数据',
      source: 'auto',
      createdAt: new Date().toISOString(),
      importance: 8,
    },
    {
      id: 'k_strat_5',
      title: '自我进化学习体系',
      content: '自我进化框架：AgentGym(复旦大学)、AgentEvolver(自我提问+导航+归因，样本效率提升55%-67%)、TaskCraft(41K任务数据集)、JiuwenClaw(运行时技能演化)、Hermes Agent(112K+stars)。学习机制：行为克隆(冷启动)、强化学习(PPO/DPO)、提示词进化(MetaPrompt)、技能资产化(Skill Solidify)。评估反馈：自动评分器、A/B测试、沙箱环境、人类反馈(RLHF)。',
      tags: ['自我进化', '学习', 'RLHF', 'AgentEvolver'],
      category: '技术',
      source: 'auto',
      createdAt: new Date().toISOString(),
      importance: 9,
    },
    {
      id: 'k_strat_6',
      title: '基础设施层',
      content: '技术基础设施：MCP协议(统一工具调用标准)、向量数据库(Milvus/Pinecone/Weaviate/Chroma/FAISS)、任务调度器(Celery/RQ+Redis)、可观测性(ELK/Prometheus/Grafana/Jaeger)。治理与社区：HopeAI开源基金会(中立治理)、贡献者协议(CLA)、代码审查(CI/CD)、安全审计(Snyk/CodeQL)。部署与分发：容器化(Docker)、云原生(K8s)、边缘部署(Ollama)、应用商店(Marketplace，零抽成)。',
      tags: ['基础设施', 'MCP', '向量数据库', 'K8s'],
      category: '技术',
      source: 'auto',
      createdAt: new Date().toISOString(),
      importance: 7,
    },
    {
      id: 'k_init_1',
      title: 'HopeAgent Pro 使用指南',
      content: 'HopeAgent Pro 是一个多Agent协作的智能平台，用户是董事长，可以向任何Agent下达指令。平台包含20+专业Agent，涵盖开发、设计、测试、运维、数据、AI等各个领域。',
      tags: ['使用指南', '平台介绍'],
      category: '平台',
      source: 'auto',
      createdAt: new Date().toISOString(),
      importance: 8,
    },
    {
      id: 'k_init_2',
      title: 'ReAct工作模式',
      content: 'ReAct是Reasoning + Acting的结合，Agent通过观察(Observe)→思考(Think)→行动(Act)→反思(Reflect)的循环来完成任务。每一步都有清晰的思考过程展示，用户可以看到Agent是如何一步步解决问题的。',
      tags: ['ReAct', '工作模式', 'Agent'],
      category: '技术',
      source: 'auto',
      createdAt: new Date().toISOString(),
      importance: 7,
    },
    {
      id: 'k_init_3',
      title: '三层架构设计',
      content: '第一层：用户界面层(UI Layer) - 聊天框、输入框、文件上传，负责收集用户意图、展示结果。第二层：Agent大脑层(Orchestration) - 理解意图、拆解任务、调度工具，核心循环是观察→思考→行动(ReAct)。第三层：工具执行层(Tool Layer) - 代码执行、搜索、数据库、API调用，负责落地操作、返回原始数据。',
      tags: ['架构', '三层架构', '设计'],
      category: '技术',
      source: 'auto',
      createdAt: new Date().toISOString(),
      importance: 6,
    },
    {
      id: 'k_init_4',
      title: '多Agent圆桌讨论机制',
      content: '当用户提出复杂问题时，总指挥Agent会根据问题类型自动组建专家团队(3-5人)，每个Agent从自己的专业角度分析问题，然后总指挥整合所有观点形成最终方案。讨论过程在思考面板中展示，聊天框只显示最终结果。',
      tags: ['圆桌讨论', '多Agent', '协作'],
      category: '技术',
      source: 'auto',
      createdAt: new Date().toISOString(),
      importance: 8,
    },
  ]
}

export function autoLearnFromConversation(title: string, content: string, tags: string[]) {
  const entries = getKnowledgeEntries()
  const exists = entries.some(e => 
    e.title === title || (content.length > 50 && e.content.includes(content.slice(0, 50)))
  )
  
  if (exists) return null

  return addKnowledgeEntry({
    title,
    content,
    tags,
    category: '学习',
    source: 'auto',
    importance: 5,
  })
}

export function batchImportKnowledge(entries: Omit<KnowledgeEntry, 'id' | 'createdAt'>[]): number {
  const existing = getKnowledgeEntries()
  const existingTitles = new Set(existing.map(e => e.title))
  let count = 0

  for (const entry of entries) {
    if (!existingTitles.has(entry.title)) {
      addKnowledgeEntry(entry)
      count++
      existingTitles.add(entry.title)
    }
  }

  return count
}

export function getKnowledgeCount(): number {
  return getKnowledgeEntries().length
}
