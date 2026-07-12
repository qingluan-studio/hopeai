import type { ThoughtStep, ToolCall, ChatMessage, Agent } from '@/types'
import { callLLM, isLLMEnabled, isSimpleQuery } from '@/services/llmService'
import { getRAGContext, autoLearnFromConversation } from '@/services/knowledgeService'
import { getAgent, agents } from '@/engine/agents'
import { getTool } from '@/engine/tools'
import { executeEvolution } from '@/engine/evolutionEngine'
import * as superAgent from '@/services/superAgentService'

function uid(): string {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10)
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export interface ReActOptions {
  agentId: string
  onThought?: (step: ThoughtStep) => void
  onToolCall?: (toolCall: ToolCall) => void
  onContent?: (content: string) => void
  onComplete?: (content: string) => void
  signal?: AbortSignal
}

export async function executeReAct(
  userInput: string,
  history: ChatMessage[],
  options: ReActOptions
): Promise<string> {
  const agent = getAgent(options.agentId) || getAgent('orchestrator')!
  const useLLM = isLLMEnabled()
  const simple = isSimpleQuery(userInput)
  const superState = superAgent.getState()

  // 超级大脑模式：跳过多Agent讨论，用融合提示词直接回答
  if (superState.enabled && useLLM && !simple) {
    return superAgentResponse(userInput, history, agent, options)
  }

  if (simple || !useLLM) {
    return simpleResponse(userInput, agent, options, history)
  }

  return multiAgentDiscussion(userInput, history, agent, options)
}

async function superAgentResponse(
  userInput: string,
  history: ChatMessage[],
  agent: Agent,
  options: ReActOptions
): Promise<string> {
  const superPrompt = superAgent.getActiveSystemPrompt(agents as any)

  const observeStep: ThoughtStep = {
    id: uid(),
    type: 'observe',
    content: `🧠 超级大脑已激活\n融合 ${agents.length} 个Agent能力，直接处理问题。`,
    timestamp: new Date().toISOString(),
  }
  options.onThought?.(observeStep)
  await delay(200)

  const thinkStep: ThoughtStep = {
    id: uid(),
    type: 'think',
    content: `超级大脑正在综合各层能力分析问题...`,
    timestamp: new Date().toISOString(),
  }
  options.onThought?.(thinkStep)

  let content = ''
  try {
    const rag = await getRAGContext(userInput, 3)
    const messages = [
      { role: 'system', content: superPrompt + '\n\n' + rag },
      { role: 'user', content: userInput },
    ]
    content = await callLLM(messages, { temperature: 0.7, maxTokens: 2000 })
  } catch {
    content = fallbackResponse(userInput)
  }

  const actStep: ThoughtStep = {
    id: uid(),
    type: 'act',
    content: '超级大脑回答完成',
    timestamp: new Date().toISOString(),
  }
  options.onThought?.(actStep)

  await streamContent(content, options.onContent)
  options.onComplete?.(content)

  autoLearnFromConversation(userInput.slice(0, 30), content, extractTags(userInput + content))
  superAgent.recordEvolution()
  triggerEvolution(userInput, content, history, options.agentId)

  return content
}

async function simpleResponse(
  userInput: string,
  agent: Agent,
  options: ReActOptions,
  history: ChatMessage[] = []
): Promise<string> {
  const useLLM = isLLMEnabled()

  const observeStep: ThoughtStep = {
    id: uid(),
    type: 'observe',
    content: `收到用户输入："${userInput}"\n判断：这是一个简单问题，直接回答即可。`,
    timestamp: new Date().toISOString(),
  }
  options.onThought?.(observeStep)
  await delay(200)

  let content = ''

  if (useLLM) {
    const thinkStep: ThoughtStep = {
      id: uid(),
      type: 'think',
      content: `用户问题比较简单，我直接调用大模型回答，带上${agent.name}的专业视角。`,
      timestamp: new Date().toISOString(),
    }
    options.onThought?.(thinkStep)

    try {
      const rag = await getRAGContext(userInput, 2)
      const messages = [
        { role: 'system', content: agent.systemPrompt + '\n\n' + rag },
        { role: 'user', content: userInput },
      ]
      content = await callLLM(messages)
    } catch {
      content = fallbackResponse(userInput)
    }
  } else {
    content = fallbackResponse(userInput)
  }

  const actStep: ThoughtStep = {
    id: uid(),
    type: 'act',
    content: '生成回答完成',
    timestamp: new Date().toISOString(),
  }
  options.onThought?.(actStep)

  await streamContent(content, options.onContent)
  options.onComplete?.(content)

  autoLearnFromConversation(userInput.slice(0, 30), content, extractTags(userInput + content))

  triggerEvolution(userInput, content, history, options.agentId)

  return content
}

async function multiAgentDiscussion(
  userInput: string,
  history: ChatMessage[],
  leadAgent: Agent,
  options: ReActOptions
): Promise<string> {
  const useLLM = isLLMEnabled()

  const observeStep: ThoughtStep = {
    id: uid(),
    type: 'observe',
    content: `【用户指令】${userInput}\n\n【任务分析】正在分析需求复杂度，判断是否需要多Agent协作...`,
    timestamp: new Date().toISOString(),
  }
  options.onThought?.(observeStep)
  await delay(400)

  const panelAgents = selectPanelAgents(userInput, leadAgent)

  const planStep: ThoughtStep = {
    id: uid(),
    type: 'plan',
    content: `【圆桌讨论方案】

📋 参与Agent（${panelAgents.length}位）：
${panelAgents.map(a => `  ${a.avatar} ${a.name} - ${a.specialty}`).join('\n')}

🎯 讨论流程：
1. 各Agent分别从专业角度分析问题
2. Agent之间互相交流观点
3. 总指挥整合所有观点形成最终方案

预计讨论轮次：${panelAgents.length + 1}轮`,
    timestamp: new Date().toISOString(),
  }
  options.onThought?.(planStep)
  await delay(600)

  const discussionLog: { agent: string; role: string; content: string }[] = []

  for (let i = 0; i < panelAgents.length; i++) {
    if (options.signal?.aborted) break

    const panelAgent = panelAgents[i]
    const round = i + 1

    const thinkStep: ThoughtStep = {
      id: uid(),
      type: 'think',
      content: `【第${round}轮】${panelAgent.avatar} ${panelAgent.name} 正在思考...\n正在从${panelAgent.specialty}角度分析问题...`,
      timestamp: new Date().toISOString(),
    }
    options.onThought?.(thinkStep)
    await delay(400 + Math.random() * 400)

    let response = ''
    if (useLLM) {
      try {
        const context = buildDiscussionContext(userInput, discussionLog, panelAgent)
        response = await callLLM([
          { role: 'system', content: panelAgent.systemPrompt },
          { role: 'user', content: context },
        ], { temperature: 0.8, maxTokens: 500 })
      } catch {
        response = generateAgentOpinion(panelAgent, userInput, i)
      }
    } else {
      response = generateAgentOpinion(panelAgent, userInput, i)
    }

    discussionLog.push({
      agent: panelAgent.name,
      role: panelAgent.role,
      content: response,
    })

    const actStep: ThoughtStep = {
      id: uid(),
      type: 'act',
      content: `${panelAgent.avatar} **${panelAgent.name}** 发言：

${response.slice(0, 600)}${response.length > 600 ? '...' : ''}`,
      timestamp: new Date().toISOString(),
    }
    options.onThought?.(actStep)
    await delay(300)
  }

  if (options.signal?.aborted) {
    const finalContent = '任务已取消。'
    options.onComplete?.(finalContent)
    return finalContent
  }

  const synthesisStep: ThoughtStep = {
    id: uid(),
    type: 'reflect',
    content: `【汇总阶段】${leadAgent.avatar} ${leadAgent.name} 正在整合所有Agent的观点，形成最终方案...`,
    timestamp: new Date().toISOString(),
  }
  options.onThought?.(synthesisStep)
  await delay(500)

  let finalContent = ''
  if (useLLM) {
    try {
      const rag = await getRAGContext(userInput, 3)
      const discussionSummary = discussionLog.map(d =>
        `【${d.agent}】\n${d.content}`
      ).join('\n\n---\n\n')

      const synthesisPrompt = `
你是${leadAgent.name}，负责整合团队讨论结果。

以下是团队各成员的讨论观点：
${discussionSummary}

参考知识：
${rag}

用户的原始问题是：${userInput}

请你：
1. 整合所有Agent的核心观点
2. 形成一个结构清晰、可执行的最终方案
3. 用专业但易懂的语言输出
4. 分点说明，重点突出
5. 给出明确的下一步建议

直接输出最终回答，不要再说"经过讨论"之类的套话。`

      finalContent = await callLLM([
        { role: 'system', content: leadAgent.systemPrompt },
        { role: 'user', content: synthesisPrompt },
      ], { temperature: 0.7, maxTokens: 2000 })
    } catch {
      finalContent = generateSynthesis(userInput, discussionLog, leadAgent)
    }
  } else {
    finalContent = generateSynthesis(userInput, discussionLog, leadAgent)
  }

  await streamContent(finalContent, options.onContent)
  options.onComplete?.(finalContent)

  autoLearnFromConversation(
    userInput.slice(0, 30),
    finalContent.slice(0, 500),
    extractTags(userInput + finalContent)
  )

  triggerEvolution(userInput, finalContent, history, options.agentId)

  return finalContent
}

function selectPanelAgents(userInput: string, lead: Agent): Agent[] {
  const lower = userInput.toLowerCase()
  const selected: Agent[] = []

  const categories: { keywords: string[]; agentIds: string[] }[] = [
    {
      keywords: ['代码', '开发', '实现', '编程', '函数', 'bug', '错误', '修复', 'debug', '前端', '后端', '全栈', '网站', 'app', '应用', '接口', 'api', '数据库', '算法'],
      agentIds: ['analyst', 'architect', 'frontend-dev', 'backend-dev', 'tester', 'codereviewer'],
    },
    {
      keywords: ['数据', '分析', '图表', '统计', '趋势', '报表', '可视化', 'ai', '机器学习', '模型', '训练'],
      agentIds: ['analyst', 'data-scientist', 'ai-engineer', 'dba'],
    },
    {
      keywords: ['设计', 'ui', 'ux', '界面', '用户体验', '产品', '原型', '交互'],
      agentIds: ['analyst', 'ui-designer', 'product-manager', 'frontend-dev'],
    },
    {
      keywords: ['部署', '运维', '服务器', 'docker', '云', '性能', '优化', '安全'],
      agentIds: ['devops', 'security-expert', 'performance-engineer', 'architect'],
    },
    {
      keywords: ['测试', '质量', 'qa', 'bug', '缺陷'],
      agentIds: ['tester', 'qa-engineer', 'bug-hunter', 'codereviewer'],
    },
  ]

  for (const cat of categories) {
    for (const kw of cat.keywords) {
      if (lower.includes(kw)) {
        for (const id of cat.agentIds) {
          if (!selected.find(a => a.id === id) && id !== lead.id) {
            const a = getAgent(id)
            if (a) selected.push(a)
          }
        }
        break
      }
    }
  }

  if (selected.length === 0) {
    const defaults = ['analyst', 'researcher', 'product-manager']
    for (const id of defaults) {
      if (id !== lead.id) {
        const a = getAgent(id)
        if (a) selected.push(a)
      }
    }
  }

  return selected.slice(0, 5)
}

function buildDiscussionContext(
  userInput: string,
  discussionLog: { agent: string; role: string; content: string }[],
  currentAgent: Agent
): string {
  let context = `用户提出了一个问题：${userInput}\n\n`
  context += `你是${currentAgent.name}（${currentAgent.role}），你的专长是${currentAgent.specialty}。\n\n`

  if (discussionLog.length > 0) {
    context += `以下是其他Agent的发言，请参考他们的观点，然后从你的专业角度给出补充或不同的看法：\n\n`
    for (const entry of discussionLog) {
      context += `【${entry.agent}】：${entry.content.slice(0, 300)}\n\n`
    }
    context += `\n请你从你的专业角度出发，发表你的看法。可以同意、补充、或提出不同意见。\n`
    context += `要求：150-300字，分点说明，言之有物。`
  } else {
    context += `你是第一个发言的，请从你的专业角度分析这个问题。\n`
    context += `要求：150-300字，分点说明，言之有物。`
  }

  return context
}

function generateAgentOpinion(agent: Agent, userInput: string, index: number): string {
  const opinions = [
    `从${agent.specialty}的角度来看，这个问题需要从以下几个方面考虑：\n\n1. **核心需求识别**：首先要明确用户的真实意图，避免方向性错误\n2. **技术可行性**：评估现有技术栈能否满足需求\n3. **风险评估**：识别潜在的技术风险和业务风险\n4. **实施路径**：给出分阶段的执行建议\n\n我建议先做需求澄清，然后制定详细的技术方案。`,
    `关于"${userInput.slice(0, 20)}..."这个问题，我的分析如下：\n\n1. **现状分析**：当前面临的主要挑战是什么\n2. **可选方案**：至少有3种实现路径\n3. **推荐方案**：综合评估后，我倾向于第二种方案，因为它在成本和效果之间取得了平衡\n4. **注意事项**：实施过程中要特别注意性能和可扩展性\n\n以上是我的专业判断，供团队参考。`,
    `我来补充几点${agent.specialty}方面的考虑：\n\n1. **架构层面**：需要考虑模块化设计，便于后续扩展\n2. **数据层面**：数据流转和存储方案需要仔细设计\n3. **安全层面**：不能忽视安全风险，要提前规划\n4. **运维层面**：部署和监控方案要同步考虑\n\n我觉得可以先做一个MVP验证核心假设，然后再迭代优化。`,
  ]
  return opinions[index % opinions.length]
}

function generateSynthesis(
  userInput: string,
  discussion: { agent: string; role: string; content: string }[],
  lead: Agent
): string {
  return `经过团队讨论，我来整合一下最终方案。

## 📋 问题分析
关于「${userInput.slice(0, 30)}${userInput.length > 30 ? '...' : ''}」，团队从多个角度进行了深入分析。

## 🎯 核心观点汇总

${discussion.map((d, i) => `${i + 1}. **${d.agent}**：${d.content.slice(0, 80)}...`).join('\n')}

## ✅ 最终建议

1. **明确目标**：先把需求和目标定义清楚，避免返工
2. **分阶段实施**：不要追求一步到位，先做MVP再迭代
3. **技术选型**：选择成熟稳定的方案，平衡成本和效果
4. **质量保障**：测试和评审环节不能省
5. **持续优化**：上线后持续收集反馈，不断改进

## 🚀 下一步行动

- 第一步：确认需求和技术方案
- 第二步：制定详细开发计划
- 第三步：按计划执行，定期评审

如果需要深入讨论某个环节，随时告诉我！`
}

async function streamContent(content: string, onContent?: (c: string) => void) {
  if (!onContent) return
  
  let current = ''
  const chunkSize = Math.max(1, Math.floor(content.length / 30))
  
  for (let i = 0; i < content.length; i += chunkSize) {
    current = content.slice(0, Math.min(i + chunkSize, content.length))
    onContent(current)
    await delay(15)
  }
  
  onContent(content)
}

function fallbackResponse(input: string): string {
  if (/^\d+\s*[+\-*/]\s*\d+/.test(input)) {
    try {
      const result = eval(input.replace(/[^0-9+\-*/().]/g, ''))
      return `计算结果：**${result}**\n\n这是 ${input} 的答案 😊`
    } catch {}
  }

  if (/你好|hi|hello|在吗|在不/i.test(input)) {
    return `你好董事长！👋\n\n我是HopeAgent Pro，有23个专业Agent随时听候差遣。\n\n我可以帮你：\n- 💻 写代码、Debug、架构设计\n- 📊 数据分析、可视化\n- 🎨 产品设计、UI方案\n- 📚 知识问答、学习指导\n- 🚀 部署运维、性能优化\n\n有什么吩咐？`
  }

  if (/谢谢|感谢/.test(input)) {
    return `不客气董事长！🤝\n\n能帮到你是我的荣幸，有任何问题随时找我！`
  }

  if (/再见|拜拜/.test(input)) {
    return `再见董事长！👋\n\n期待下次为你服务，保重身体！`
  }

  return `我收到你的问题了：**${input}**\n\n目前我正在学习中，对于复杂问题建议配置 Kimi API Key 后使用（设置页可配置），这样每个Agent都会用大模型真实思考。\n\n你也可以试试这些功能：\n- 📚 知识库 - 管理你的知识\n- 👥 Agent团队 - 查看所有可用Agent\n- ⚙️ 设置 - 配置大模型等参数`
}

function extractTags(text: string): string[] {
  const keywords = ['代码', '开发', '数据', '分析', '设计', '部署', '测试', 'AI', '架构', '前端', '后端', '算法', '数据库', '安全', '性能', '产品', 'UI', '运维']
  const tags: string[] = []
  for (const kw of keywords) {
    if (text.toLowerCase().includes(kw.toLowerCase())) {
      tags.push(kw)
    }
  }
  return tags.slice(0, 5)
}

// 保留旧的工具模拟函数（兼容模式，无LLM时使用）
function generatePlan(input: string): string {
  return `任务执行计划：
1. 需求理解 — 深入分析用户意图
2. 方案设计 — 制定解决方案
3. 工具执行 — 调用相关工具完成任务
4. 结果整合 — 汇总输出最终答案`
}

async function triggerEvolution(
  userInput: string,
  response: string,
  history: ChatMessage[],
  agentId: string
): Promise<void> {
  setTimeout(async () => {
    try {
      await executeEvolution({
        userInput,
        assistantResponse: response,
        conversationHistory: history,
        activeAgentId: agentId,
        onProgress: (step, message) => {
          console.log(`[Evolution] ${step}: ${message}`)
        },
      })
    } catch (err) {
      console.error('[Evolution] 触发失败:', err)
    }
  }, 1000)
}
