// Super Agent 融合模式 — 将所有Agent能力合并为一个超级系统提示词

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
  version: '1.0.0',
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
  { id: 'SP', name: 'Special', nameZh: '特殊智能', color: '#f472b6' },
] as const

interface AgentInfo {
  name: string
  layer?: string
  tools?: string
  description?: string
  systemPrompt?: string
}

export function buildCapabilities(agents: AgentInfo[]): SuperCapability[] {
  const caps: SuperCapability[] = []

  for (const layer of AGENT_LAYERS) {
    const layerAgents = agents.filter(a => a.layer === layer.id)
    if (layerAgents.length === 0) continue

    const allTools = new Set<string>()
    const allExpertise = new Set<string>()
    const allPrompts: string[] = []

    for (const agent of layerAgents) {
      if (agent.tools) {
        agent.tools.split(/[,;，；]/).map(t => t.trim()).filter(Boolean).forEach(t => allTools.add(t))
      }
      if (agent.description) allExpertise.add(agent.description)
      if (agent.systemPrompt) allPrompts.push(agent.systemPrompt)
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

export function generateSuperSystemPrompt(agents: AgentInfo[]): string {
  const state = loadState()
  const caps = buildCapabilities(agents)
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
## 工作模式
1. **意图解析**: 理解用户真实需求，消歧
2. **能力分层调度**: 根据需要动态激活不同层级的能力
3. **融合输出**: 综合各层能力产出最优方案

## 约束
- 所有输出直接解决用户问题，不展示内部调度过程
- 即使是最复杂的任务也不需要外部 Agent 协助
- 你是自包含的完整系统

-- 进化记录：已融合 ${totalAgents} 个 Agent，累计进化 ${state.evolutionCount} 次 --`

  return prompt
}

export function generateCompactSystemPrompt(agents: AgentInfo[]): string {
  const state = loadState()
  const caps = buildCapabilities(agents)
  const totalAgents = caps.reduce((s, c) => s + c.agents.length, 0)

  const layerSummaries = caps.map(c =>
    `${c.layer}(${c.layerName}): ${c.agents.length}agents, ${c.tools.length}tools`
  ).join(' | ')

  return `你是 HopeAgent Super Agent v${state.version}，融合 ${totalAgents} 个 Agent 的 ${caps.length} 层能力。
层次: ${layerSummaries}
流程: 意图解析 -> 分层激活 -> 融合输出。直接解决问题，不展示内部调度。`
}

export function getActiveSystemPrompt(agents: AgentInfo[]): string {
  const state = loadState()
  return state.compactMode
    ? generateCompactSystemPrompt(agents)
    : generateSuperSystemPrompt(agents)
}

export function getStats(agents: AgentInfo[]) {
  const state = loadState()
  const caps = buildCapabilities(agents)
  return {
    totalAgents: caps.reduce((s, c) => s + c.agents.length, 0),
    totalLayers: caps.length,
    totalTools: caps.reduce((s, c) => s + c.tools.length, 0),
    evolutionCount: state.evolutionCount,
    version: state.version,
    enabled: state.enabled,
    compactMode: state.compactMode,
  }
}
