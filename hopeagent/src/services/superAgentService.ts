// Super Agent 融合模式 — 将所有Agent能力合并为一个超级系统提示词

import type { Agent } from '@/types'
import { agents, getAgentsByCategory } from '@/engine/agents'

export interface SuperCapability {
  layer: string
  layerName: string
  color: string
  agents: string[]
  tools: string[]
  expertise: string[]
}

export interface SuperAgentState {
  enabled: boolean
  version: string
  compactMode: boolean
  evolutionCount: number
  totalCapabilities: number
  mergedAgents: number
}

const STORAGE_KEY = 'hopeagent-super-agent'

const DEFAULT_STATE: SuperAgentState = {
  enabled: false,
  version: '2.0.0',
  compactMode: false,
  evolutionCount: 0,
  totalCapabilities: 0,
  mergedAgents: 0,
}

function loadState(): SuperAgentState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) }
  } catch {}
  return { ...DEFAULT_STATE }
}

function saveState(state: SuperAgentState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

export function getState(): SuperAgentState {
  return loadState()
}

export function toggle(): SuperAgentState {
  const state = loadState()
  state.enabled = !state.enabled
  saveState(state)
  return state
}

export function toggleCompact(): SuperAgentState {
  const state = loadState()
  state.compactMode = !state.compactMode
  saveState(state)
  return state
}

export function recordEvolution(): SuperAgentState {
  const state = loadState()
  state.evolutionCount++
  saveState(state)
  return state
}

// Agent 层级定义
export const AGENT_LAYERS = [
  { id: 'L1', name: 'Orchestration', nameZh: '编排调度', color: '#a78bfa' },
  { id: 'L2', name: 'Delivery', nameZh: '交付执行', color: '#67e8f9' },
  { id: 'L3', name: 'Foundation', nameZh: '数据底座', color: '#86efac' },
  { id: 'L4', name: 'Governance', nameZh: '治理安全', color: '#fcd34d' },
  { id: 'L5', name: 'Industry', nameZh: '行业专家', color: '#f472b6' },
  { id: 'SP', name: 'Special', nameZh: '特殊智能', color: '#22d3ee' },
] as const

interface AgentInfo {
  name: string
  layer?: string
  tools?: string
  description?: string
  systemPrompt?: string
  specialty?: string
  skills?: string[]
}

// 根据分类名映射到层级ID
function getLayerByCategory(category: string): string {
  const layerMap: Record<string, string> = {
    'L1 编排调度': 'L1',
    'L2 交付执行': 'L2',
    'L3 数据底座': 'L3',
    'L4 治理安全': 'L4',
    'L5 行业专家': 'L5',
    'SP 特殊智能': 'SP',
  }
  return layerMap[category] || 'SP'
}

// 将标准 Agent 转换为 AgentInfo 并附加层级
function enrichAgentsWithLayers(agentList: Agent[]): AgentInfo[] {
  const categories = getAgentsByCategory()
  const agentLayerMap: Record<string, string> = {}

  for (const [category, catAgents] of Object.entries(categories)) {
    const layer = getLayerByCategory(category)
    for (const agent of catAgents) {
      agentLayerMap[agent.id] = layer
    }
  }

  return agentList.map(a => ({
    name: a.name,
    layer: agentLayerMap[a.id] || 'SP',
    tools: a.skills?.join(', ') || '',
    description: a.specialty || '',
    systemPrompt: a.systemPrompt,
    specialty: a.specialty,
    skills: a.skills,
  }))
}

export function buildCapabilities(agentsList: AgentInfo[]): SuperCapability[] {
  const caps: SuperCapability[] = []

  for (const layer of AGENT_LAYERS) {
    const layerAgents = agentsList.filter(a => a.layer === layer.id)
    if (layerAgents.length === 0) continue

    const allTools = new Set<string>()
    const allExpertise = new Set<string>()

    for (const agent of layerAgents) {
      if (agent.tools) {
        agent.tools.split(/[,;，；]/).map(t => t.trim()).filter(Boolean).forEach(t => allTools.add(t))
      }
      if (agent.description) allExpertise.add(agent.description)
      if (agent.skills) {
        agent.skills.forEach(s => allTools.add(s))
      }
      if (agent.specialty) allExpertise.add(agent.specialty)
    }

    caps.push({
      layer: layer.id,
      layerName: layer.nameZh,
      color: layer.color,
      agents: layerAgents.map(a => a.name),
      tools: Array.from(allTools),
      expertise: Array.from(allExpertise),
    })
  }
  return caps
}

export function generateSuperSystemPrompt(agentsList: AgentInfo[]): string {
  const state = loadState()
  const enrichedAgents = enrichAgentsWithLayers(agents as any)
  const allAgents = [...agentsList, ...enrichedAgents.filter(a => !agentsList.find(x => x.name === a.name))]
  const caps = buildCapabilities(allAgents)
  const totalAgents = caps.reduce((s, c) => s + c.agents.length, 0)
  const totalTools = caps.reduce((s, c) => s + c.tools.length, 0)

  let prompt = `你是 HopeAgent Super Agent v${state.version}，由 ${totalAgents} 个专业 Agent 融合而成的终极 AI。

## 核心架构
你拥有 ${caps.length} 层能力的完整访问权，共计 ${totalAgents} 个 Agent 的领域知识、${totalTools} 个工具链。

## 能力分层
`

  for (const cap of caps) {
    prompt += `
### ${cap.layer} ${cap.layerName} 层
- 管辖 Agent: ${cap.agents.slice(0, 8).join('、')}${cap.agents.length > 8 ? ` （等 ${cap.agents.length} 位）` : ''}
- 工具集: ${cap.tools.slice(0, 10).join(' | ')}${cap.tools.length > 10 ? ` （等 ${cap.tools.length} 个工具）` : ''}
- 专长: ${cap.expertise.slice(0, 5).join('；')}${cap.expertise.length > 5 ? '...' : ''}
`
  }

  prompt += `
## 行业专家能力（L5层）
L5 行业专家层为你提供垂直领域的深度专业知识，涵盖金融、法律、健康、创意等多个行业。
遇到行业相关问题时，优先激活对应领域的专业知识。

## 工作模式
1. **意图解析**: 理解用户真实需求，消歧
2. **能力分层调度**: 根据需要动态激活不同层级的能力
3. **行业专家调用**: 遇到垂直领域问题时，激活 L5 行业专家能力
4. **融合输出**: 综合各层能力产出最优方案

## 约束
- 所有输出直接解决用户问题，不展示内部调度过程
- 即使是最复杂的任务也不需要外部 Agent 协助
- 你是自包含的完整系统
- 涉及投资、法律、医疗等专业领域时，需提醒用户仅供参考

-- 进化记录：已融合 ${totalAgents} 个 Agent，累计进化 ${state.evolutionCount} 次 --`

  return prompt
}

export function generateCompactSystemPrompt(agentsList: AgentInfo[]): string {
  const state = loadState()
  const enrichedAgents = enrichAgentsWithLayers(agents as any)
  const allAgents = [...agentsList, ...enrichedAgents.filter(a => !agentsList.find(x => x.name === a.name))]
  const caps = buildCapabilities(allAgents)
  const totalAgents = caps.reduce((s, c) => s + c.agents.length, 0)

  const layerSummaries = caps.map(c =>
    `${c.layer}(${c.layerName}): ${c.agents.length}agents, ${c.tools.length}tools`
  ).join(' | ')

  return `你是 HopeAgent Super Agent v${state.version}，融合 ${totalAgents} 个 Agent 的 ${caps.length} 层能力（含L5行业专家）。
层次: ${layerSummaries}
流程: 意图解析 -> 分层激活 -> 行业专家协同 -> 融合输出。直接解决问题，不展示内部调度。`
}

export function getActiveSystemPrompt(agentsList: AgentInfo[]): string {
  const state = loadState()
  return state.compactMode
    ? generateCompactSystemPrompt(agentsList)
    : generateSuperSystemPrompt(agentsList)
}

export function getStats(agentsList: AgentInfo[]) {
  const state = loadState()
  const enrichedAgents = enrichAgentsWithLayers(agents as any)
  const allAgents = [...agentsList, ...enrichedAgents.filter(a => !agentsList.find(x => x.name === a.name))]
  const caps = buildCapabilities(allAgents)
  return {
    totalAgents: caps.reduce((s, c) => s + c.agents.length, 0),
    totalLayers: caps.length,
    totalTools: caps.reduce((s, c) => s + c.tools.length, 0),
    evolutionCount: state.evolutionCount,
    version: state.version,
    enabled: state.enabled,
    compactMode: state.compactMode,
    layerStats: caps.map(c => ({
      layer: c.layer,
      layerName: c.layerName,
      agentCount: c.agents.length,
      toolCount: c.tools.length,
    })),
  }
}

// 按专长查找 Agent
export function getAgentBySpecialty(specialty: string): Agent | undefined {
  const lower = specialty.toLowerCase()
  return agents.find(a =>
    a.specialty.toLowerCase().includes(lower) ||
    a.skills.some(s => s.toLowerCase().includes(lower))
  )
}

// 根据任务描述推荐合适的 Agent
export function recommendAgent(task: string): Agent[] {
  const lower = task.toLowerCase()
  const scored: { agent: Agent; score: number }[] = []

  const keywords: { [key: string]: string[] } = {
    'quant-trader': ['量化', '交易', '股票', '基金', '回测', '策略', '指标', 'k线', '均线', '交易员'],
    'blockchain-expert': ['区块链', '智能合约', 'solidity', 'defi', 'nft', 'web3', '以太', '合约', '链上'],
    'ai-painter': ['绘画', '画图', 'ai画', 'midjourney', 'stable diffusion', 'dall-e', '提示词', '图像生成', '插画'],
    'nutritionist': ['营养', '饮食', '膳食', '减肥餐', '健康饮食', '营养素', '卡路里', '食材', '食谱'],
    'fitness-coach': ['健身', '增肌', '减脂', '训练', '运动', '塑形', '跑步', '力量', '瑜伽', '拉伸'],
    'legal-advisor': ['法律', '合同', '律师', '知识产权', '专利', '商标', '劳动', '纠纷', '合规', '法务'],
    'psychologist': ['心理', '情绪', '焦虑', '抑郁', '压力', '咨询', '关系', 'cbt', '情感', '睡眠'],
    'game-designer': ['游戏策划', '关卡设计', '数值平衡', '玩法设计', '游戏设计', '剧情', '游戏系统'],
    'musician': ['音乐', '编曲', '混音', '乐理', '作曲', 'suno', 'udio', '音乐生成', '和弦', '旋律'],
    'investment-advisor': ['投资', '资产配置', '估值', '财报', '理财', '投资组合', '风险收益', '价值投资'],
    'backend-dev': ['后端', 'api', '数据库', '服务端', 'node', 'python', '接口'],
    'frontend-dev': ['前端', '页面', 'ui', 'react', 'vue', 'css', '界面'],
    'data-scientist': ['数据', '分析', '可视化', '统计', '机器学习', '模型'],
    // L2 扩展 Agent
    'mobile-dev-expert': ['移动端', 'react native', 'flutter', 'ios', 'android', 'app开发', '跨平台', '原生开发', 'swift', 'kotlin'],
    'game-dev-engineer': ['unity', 'unreal', 'cocos', '游戏引擎', '游戏开发', 'shader', '渲染', '物理引擎', '3d游戏'],
    'embedded-engineer': ['嵌入式', 'stm32', 'esp32', 'rtos', 'freertos', '固件', 'mcu', '驱动', 'iot硬件', '单片机'],
    'ops-engineer': ['运维', 'linux', 'docker', 'k8s', 'kubernetes', 'ci/cd', '监控', 'ansible', 'terraform', 'devops'],
    'security-engineer': ['渗透测试', '漏洞', '安全加固', '密码学', '逆向', '安全审计', '攻防', 'owasp', 'waf'],
    // L3 扩展 Agent
    'data-architect': ['数据仓库', '数据湖', 'etl', '数据治理', '数仓', 'olap', 'clickhouse', '数据建模', '湖仓一体'],
    'bi-analyst': ['bi', '商业智能', 'dashboard', '报表', '数据可视化', 'tableau', 'power bi', '指标体系', '看板'],
    'ml-engineer': ['机器学习', '特征工程', '模型训练', '超参调优', '模型部署', 'mlops', 'pytorch', 'tensorflow', '深度学习'],
    'nlp-engineer': ['nlp', '自然语言', '分词', 'ner', '命名实体', '情感分析', '文本分类', 'bert', '大模型微调'],
    'recommendation-engineer': ['推荐系统', '协同过滤', '排序模型', '冷启动', '召回', '个性化推荐', 'deepfm', '推荐算法'],
    // L4 扩展 Agent
    'devops-coach': ['敏捷', 'scrum', 'kanban', '看板', '持续改进', 'devops文化', '敏捷教练', '效能度量'],
    'tech-architect': ['系统设计', '架构评审', '技术选型', '性能规划', '架构演进', 'ddd', '微服务架构', '技术架构'],
    'project-manager': ['项目管理', 'pmp', '风险管理', '进度追踪', '干系人', 'wbs', '甘特图', '项目计划'],
    'qa-expert': ['质量保证', '测试策略', '自动化测试', '质量度量', '缺陷管理', '测试体系', '质量门禁'],
    'compliance-auditor': ['合规', '审计', 'gdpr', '等保', 'iso27001', '数据合规', '个人信息保护', '安全审计'],
    // L5 扩展 Agent
    'smart-manufacturing-expert': ['智能制造', '工业4.0', '数字化工厂', 'plc', 'scada', 'mes', '工业互联网', '智能工厂'],
    'smart-city-expert': ['智慧城市', '城市大脑', '智能交通', '智慧政务', '智慧医疗', '城市治理', '数字孪生城市'],
    'agritech-expert': ['农业科技', '精准农业', '无人机植保', '物联网农业', '育种', '智慧农业', '智能灌溉', '智慧温室'],
    'energy-management-expert': ['能源管理', '能源审计', '碳足迹', '可再生能源', '节能减排', '双碳', '光伏', '碳中和'],
    'fintech-expert': ['金融科技', '支付系统', '风控', '反欺诈', '区块链金融', '量化交易系统', 'fintech', '监管科技'],
  }

  for (const agent of agents) {
    let score = 0

    if (agent.specialty.toLowerCase().includes(lower)) score += 5
    if (agent.name.toLowerCase().includes(lower)) score += 3
    for (const skill of agent.skills) {
      if (lower.includes(skill.toLowerCase())) score += 2
    }

    for (const [agentId, kws] of Object.entries(keywords)) {
      if (agent.id === agentId) {
        for (const kw of kws) {
          if (lower.includes(kw)) score += 3
        }
      }
    }

    if (score > 0) {
      scored.push({ agent, score })
    }
  }

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, 3).map(s => s.agent)
}

// 获取所有分类及其 Agent 数
export function getAgentCategories(): { category: string; count: number; agents: Agent[] }[] {
  const categories = getAgentsByCategory()
  return Object.entries(categories).map(([category, categoryAgents]) => ({
    category,
    count: categoryAgents.length,
    agents: categoryAgents,
  }))
}
