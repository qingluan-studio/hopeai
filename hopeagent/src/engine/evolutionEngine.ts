import type { ChatMessage, KnowledgeEntry, Agent } from '@/types'
import { callLLM, isLLMEnabled } from '@/services/llmService'
import { addKnowledgeEntry, getKnowledgeEntries, searchKnowledge } from '@/services/knowledgeService'
import { getAgent, agents, updateAgentPrompt } from '@/engine/agents'

export interface EvolutionResult {
  success: boolean
  messages: string[]
  newKnowledge: KnowledgeEntry[]
  promptUpdates: { agentId: string; updates: string }[]
  skillsLearned: string[]
}

export interface EvolutionOptions {
  userInput: string
  assistantResponse: string
  conversationHistory: ChatMessage[]
  activeAgentId: string
  onProgress?: (step: string, message: string) => void
}

export interface EvolutionStepResult {
  message: string
  knowledge?: KnowledgeEntry[]
  promptUpdates?: { agentId: string; updates: string }[]
  skills?: string[]
}

export async function executeEvolution(options: EvolutionOptions): Promise<EvolutionResult> {
  const results: EvolutionResult = {
    success: false,
    messages: [],
    newKnowledge: [],
    promptUpdates: [],
    skillsLearned: [],
  }

  if (!isLLMEnabled()) {
    results.messages.push('LLM未启用，跳过自我进化')
    return results
  }

  const steps = [
    { name: '自我提问', fn: selfQuestioning },
    { name: '自我导航', fn: selfNavigation },
    { name: '自我归因', fn: selfAttribution },
    { name: '提示词进化', fn: promptEvolution },
    { name: '技能资产化', fn: skillSolidify },
  ]

  for (const { name, fn } of steps) {
    options.onProgress?.(name, `正在${name}...`)
    try {
      const stepResult = await fn(options)
      if (stepResult) {
        results.messages.push(`${name}: ${stepResult.message}`)
        if (stepResult.knowledge) results.newKnowledge.push(...stepResult.knowledge)
        if (stepResult.promptUpdates) results.promptUpdates.push(...stepResult.promptUpdates)
        if (stepResult.skills) results.skillsLearned.push(...stepResult.skills)
      }
    } catch (err) {
      results.messages.push(`${name}: 失败 - ${err instanceof Error ? err.message : String(err)}`)
    }
    await delay(200)
  }

  results.success = true
  return results
}

async function selfQuestioning(options: EvolutionOptions): Promise<EvolutionStepResult | null> {
  const { userInput, assistantResponse, activeAgentId } = options
  const agent = getAgent(activeAgentId)

  try {
    const prompt = `
你是${agent?.name || '系统'}的自我提问模块。
用户问："${userInput}"
回答是："${assistantResponse.slice(0, 300)}${assistantResponse.length > 300 ? '...' : ''}"

请你：
1. 判断这个对话是否有价值学习
2. 如果有价值，生成3个类似的问题（作为训练数据）
3. 每个问题要覆盖不同的角度和难度

格式要求：
- 直接列出3个问题，每个问题一行
- 不要加序号，不要加解释
- 问题要具体、有挑战性
- 覆盖不同的场景和角度`

    const response = await callLLM([{ role: 'system', content: '你是一个AI训练数据生成专家，擅长生成高质量的问题作为训练样本。' }, { role: 'user', content: prompt }], { temperature: 0.8 })

    const questions = response.split('\n').filter(q => q.trim().length > 5).slice(0, 3)
    if (questions.length > 0) {
      const knowledge: KnowledgeEntry[] = []
      for (const q of questions) {
        const entry = addKnowledgeEntry({
          title: `训练样本: ${q.slice(0, 30)}`,
          content: `问题: ${q}\n来源: ${agent?.name}自我提问生成\n难度: 中等\n场景: 与"${userInput.slice(0, 20)}"相关`,
          tags: ['训练数据', '自我提问', agent?.specialty || ''],
          category: '训练',
          source: 'auto',
          importance: 6,
        })
        knowledge.push(entry)
      }
      return { message: `生成了${questions.length}个训练问题`, knowledge }
    }
  } catch {}
  
  return null
}

async function selfNavigation(options: EvolutionOptions): Promise<EvolutionStepResult | null> {
  const { userInput, assistantResponse, conversationHistory } = options

  try {
    const prompt = `
分析以下对话，提取可沉淀的知识：

用户输入：${userInput}
助手回答：${assistantResponse.slice(0, 500)}${assistantResponse.length > 500 ? '...' : ''}

请你：
1. 识别对话中的核心知识点
2. 提炼成结构化的知识条目
3. 每个知识条目包含：标题、内容摘要、标签

格式要求：
- 每个知识条目用"## 标题"开头
- 内容摘要不超过100字
- 标签用逗号分隔
- 最多生成3个知识条目`

    const response = await callLLM([{ role: 'system', content: '你是一个知识提炼专家，擅长从对话中提取有价值的知识。' }, { role: 'user', content: prompt }], { temperature: 0.6 })

    const sections = response.split('##').filter(s => s.trim().length > 0).slice(0, 3)
    const knowledge: KnowledgeEntry[] = []

    for (const section of sections) {
      const lines = section.trim().split('\n')
      const title = lines[0]?.trim().replace(/[#*]/g, '') || '未命名知识'
      const content = lines.slice(1).map(l => l.replace(/^-|\*/, '').trim()).join('\n').slice(0, 500)
      const tagsMatch = content.match(/标签[:：]\s*(.+)/)
      const tags = tagsMatch ? tagsMatch[1].split(/[,，]/).map(t => t.trim()).filter(t => t.length > 0) : ['自我导航']

      if (title.length > 3 && content.length > 10) {
        const entry = addKnowledgeEntry({
          title,
          content,
          tags: [...new Set([...tags, '自我导航'])],
          category: '学习',
          source: 'auto',
          importance: 7,
        })
        knowledge.push(entry)
      }
    }

    if (knowledge.length > 0) {
      return { message: `沉淀了${knowledge.length}条知识`, knowledge }
    }
  } catch {}
  
  return null
}

async function selfAttribution(options: EvolutionOptions): Promise<EvolutionStepResult | null> {
  const { userInput, assistantResponse, activeAgentId } = options
  const agent = getAgent(activeAgentId)

  try {
    const prompt = `
作为${agent?.name || '系统'}的自我归因模块，请分析这次回答的质量：

用户问题：${userInput}
助手回答：${assistantResponse.slice(0, 500)}${assistantResponse.length > 500 ? '...' : ''}
当前Agent专长：${agent?.specialty || '通用'}

请你：
1. 评估回答的准确性、完整性、深度
2. 找出回答中的不足或可以改进的地方
3. 给出具体的改进建议

格式要求：
- 先给出总体评分(1-10分)
- 然后列出具体的改进建议
- 每个建议要具体、可操作
- 最多3条建议`

    const response = await callLLM([{ role: 'system', content: '你是一个严格的AI评估专家，擅长发现回答中的不足并给出改进建议。' }, { role: 'user', content: prompt }], { temperature: 0.5 })

    const scoreMatch = response.match(/评分[:：]\s*(\d+)/)
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 0

    if (score < 8 && agent) {
      const improvements = response.split('\n').filter(l => 
        l.includes('建议') || l.includes('改进') || l.match(/^\d+[\.\uff0e]/)
      ).slice(0, 3).join('\n')

      if (improvements.length > 0) {
        const updates = updateAgentPrompt(agent.id, improvements)
        return { 
          message: `评分${score}/10，已记录改进建议`,
          promptUpdates: [{ agentId: agent.id, updates: improvements }]
        }
      }
    } else if (score >= 8) {
      return { message: `评分${score}/10，回答质量优秀` }
    }
  } catch {}
  
  return null
}

async function promptEvolution(options: EvolutionOptions): Promise<EvolutionStepResult | null> {
  const { userInput, assistantResponse, activeAgentId } = options
  const agent = getAgent(activeAgentId)

  try {
    const prompt = `
作为MetaPrompt优化专家，请优化${agent?.name || '系统'}的提示词：

当前提示词：${agent?.systemPrompt.slice(0, 300)}${agent?.systemPrompt.length > 300 ? '...' : ''}

最近一次对话：
用户：${userInput}
助手：${assistantResponse.slice(0, 200)}${assistantResponse.length > 200 ? '...' : ''}

请你：
1. 分析当前提示词是否有可以改进的地方
2. 给出具体的优化建议
3. 如果有必要，可以重写部分提示词

格式要求：
- 先说明优化方向
- 然后给出优化后的提示词片段（只改动需要改的部分）
- 不要输出完整提示词，只输出改动部分
- 保持简洁，重点突出`

    const response = await callLLM([{ role: 'system', content: '你是一个高级提示词工程师，擅长优化AI系统提示词以提升性能。' }, { role: 'user', content: prompt }], { temperature: 0.5 })

    const updates = response.slice(0, 500)
    if (updates.length > 20 && agent) {
      const result = updateAgentPrompt(agent.id, `【MetaPrompt优化】\n${updates}`)
      return { 
        message: '提示词已优化',
        promptUpdates: [{ agentId: agent.id, updates }]
      }
    }
  } catch {}
  
  return null
}

async function skillSolidify(options: EvolutionOptions): Promise<EvolutionStepResult | null> {
  const { userInput, assistantResponse, activeAgentId } = options
  const agent = getAgent(activeAgentId)

  try {
    const prompt = `
分析以下对话，识别可以固化为技能(SKILL)的经验：

用户：${userInput}
助手：${assistantResponse.slice(0, 500)}${assistantResponse.length > 500 ? '...' : ''}

请你：
1. 判断是否有可复用的解题方法或经验
2. 如果有，将其提炼为结构化的技能条目
3. 技能条目格式：
   - SKILL_NAME: 技能名称
   - DESCRIPTION: 技能描述
   - STEPS: 执行步骤（分点）
   - KEYWORDS: 触发关键词

格式要求：
- 只输出技能条目，不要其他解释
- 最多生成1个技能`

    const response = await callLLM([{ role: 'system', content: '你是一个技能提炼专家，擅长从对话中提取可复用的技能。' }, { role: 'user', content: prompt }], { temperature: 0.6 })

    if (response.includes('SKILL_NAME') || response.includes('技能名称')) {
      const skillNameMatch = response.match(/SKILL_NAME[:：]\s*(.+)/) || response.match(/技能名称[:：]\s*(.+)/)
      const skillName = skillNameMatch ? skillNameMatch[1].trim() : '未命名技能'

      const entry = addKnowledgeEntry({
        title: `SKILL: ${skillName}`,
        content: response,
        tags: ['技能', '固化', agent?.specialty || ''],
        category: '技能',
        source: 'auto',
        importance: 8,
      })

      return { 
        message: `技能【${skillName}】已固化`,
        skills: [skillName],
        knowledge: [entry]
      }
    }
  } catch {}
  
  return null
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function evolveOnSchedule(hours: number = 24): Promise<void> {
  const now = new Date()
  const nextRun = new Date(now.getTime() + hours * 60 * 60 * 1000)
  
  console.log(`[Evolution] 下次进化计划: ${nextRun.toLocaleString()}`)
  
  setTimeout(async () => {
    try {
      await executeScheduledEvolution()
    } catch (err) {
      console.error('[Evolution] 定时进化失败:', err)
    }
    await evolveOnSchedule(hours)
  }, hours * 60 * 60 * 1000)
}

async function executeScheduledEvolution(): Promise<void> {
  const entries = getKnowledgeEntries()
  const recentEntries = entries.filter(e => {
    const age = (Date.now() - new Date(e.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    return age < 7 && e.category === '学习'
  })

  if (recentEntries.length === 0) {
    console.log('[Evolution] 最近7天没有新学习内容，跳过')
    return
  }

  console.log(`[Evolution] 正在分析${recentEntries.length}条最近学习内容...`)

  const summary = recentEntries.map(e => `- ${e.title}`).join('\n')
  
  try {
    const prompt = `
作为进化引擎，请分析最近学习的知识并给出发展方向：

最近学习的知识：
${summary}

请你：
1. 总结学到的核心技能和知识
2. 识别知识缺口和薄弱环节
3. 给出下一步的学习和发展建议
4. 推荐应该重点关注的领域

格式要求：
- 分点说明
- 重点突出
- 可操作性强`

    const response = await callLLM([{ role: 'system', content: '你是一个AI系统进化专家，擅长分析学习数据并规划发展方向。' }, { role: 'user', content: prompt }], { temperature: 0.7 })

    addKnowledgeEntry({
      title: '进化分析报告',
      content: `生成时间: ${new Date().toLocaleString()}\n\n${response}`,
      tags: ['进化', '分析', '规划'],
      category: '战略',
      source: 'auto',
      importance: 9,
    })

    console.log('[Evolution] 进化分析完成')
  } catch (err) {
    console.error('[Evolution] 进化分析失败:', err)
  }
}
