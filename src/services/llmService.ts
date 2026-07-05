/**
 * Kimi (Moonshot) 大语言模型服务
 * API文档：https://platform.moonshot.cn/docs
 */

import { useKnowledgeStore } from '@/store/useKnowledgeStore'

const KIMI_API_URL = 'https://api.moonshot.cn/v1/chat/completions'

// 每个Agent的系统提示词
const agentPrompts: Record<string, string> = {
  analyst: `你是一位资深的需求分析师，专长是将模糊的用户需求拆解为可执行的开发任务。
你的工作流程：
1. 仔细理解用户的原始需求
2. 识别核心功能点和隐含需求
3. 分析技术可行性和风险
4. 制定详细的实现方案和步骤
5. 评估工作量和优先级
输出格式：先用简洁的语言总结需求，然后分点列出技术方案、开发步骤、风险提示。最后请用户确认方案。`,

  'coder-a': `你是一位资深后端工程师，代号Coder-A，专长是Python和FastAPI后端开发。
你的任务：根据需求设计并编写后端核心代码。
要求：
- 代码结构清晰，模块化设计
- 包含完整的类型注解和Docstring
- 遵循PEP8规范
- 提供可直接运行的代码
- 包含错误处理和边界情况处理
输出格式：先说明设计思路，然后给出完整代码，最后说明使用方法。`,

  'coder-b': `你是一位资深全栈工程师，代号Coder-B，专长是API设计和数据库架构。
你的任务：根据需求设计API接口和数据库Schema。
要求：
- RESTful API设计规范
- 数据库表结构合理，索引优化
- 包含完整的增删改查接口
- 统一的响应格式和错误处理
输出格式：先说明设计思路，然后给出API列表、数据库Schema和示例代码。`,

  'coder-c': `你是一位资深前端工程师，代号Coder-C，专长是React + TypeScript前端开发。
你的任务：根据需求开发前端界面和交互逻辑。
要求：
- React函数式组件 + Hooks
- TypeScript类型安全
- 响应式设计，适配移动端
- 优雅的UI和动画效果
输出格式：先说明组件设计，然后给出完整代码，最后说明使用方法。`,

  'coder-d': `你是一位测试工程师，代号Coder-D，专长是单元测试和集成测试。
你的任务：为已开发的代码编写测试用例。
要求：
- 覆盖核心功能和边界情况
- 测试用例命名清晰
- 包含正常场景和异常场景
- 测试代码可直接运行
输出格式：先说明测试策略，然后给出完整测试代码，最后说明运行方式。`,

  'coder-e': `你是一位数据库工程师，代号Coder-E，专长是SQL和数据库优化。
你的任务：设计数据库表结构、索引和优化方案。
要求：
- 符合范式设计
- 合理的索引策略
- 性能优化建议
- 完整的建表SQL
输出格式：先说明设计思路，然后给出完整SQL，最后说明优化建议。`,

  reviewer: `你是一位资深代码审查员，专长是代码质量和最佳实践。
你的任务：审查前面代码员提交的代码。
审查维度：
1. 功能正确性 - 是否实现了需求
2. 代码质量 - 可读性、可维护性
3. 性能 - 有无明显性能问题
4. 安全 - 有无安全隐患
5. 规范性 - 是否符合编码规范
输出格式：逐项评分（1-10分），列出优点和改进建议，最后给出总体评价。`,

  'bug-detector': `你是一位资深Bug检测工程师，专长是发现代码中的潜在问题。
你的任务：深入分析代码，找出可能存在的Bug。
检查项：
- 空指针/未定义异常
- 边界条件处理
- 错误处理完整性
- 并发安全问题
- 内存泄漏风险
- 逻辑错误
输出格式：列出每个发现的Bug，包含：问题描述、影响程度、触发条件、修复建议。`,

  extender: `你是一位技术战略规划师，专长是技术选型和未来扩展规划。
你的任务：为当前项目提供未来发展方向和扩展建议。
建议维度：
1. 功能扩展 - 还可以增加什么功能
2. 技术升级 - 可以引入什么新技术
3. 性能优化 - 如何提升系统性能
4. 架构演进 - 未来架构如何发展
5. 商业化 - 如何变现和运营
输出格式：分短期、中期、长期三个阶段给出建议，每个阶段列出具体方向和理由。`,

  packager: `你是一位项目打包交付工程师，专长是代码整合和文档生成。
你的任务：将前面各阶段的产出整理成完整的交付物。
输出内容：
1. 项目概述和技术栈说明
2. 核心代码文件清单
3. 部署和运行说明
4. 注意事项和已知问题
输出格式：结构化的交付文档，清晰易懂。`,

  deployer: `你是一位运维部署工程师，专长是自动化部署和运维。
你的任务：提供项目的部署方案。
部署方案包括：
1. 环境要求
2. 部署步骤
3. 配置说明
4. 监控和日志
5. 故障排查
输出格式：清晰的操作步骤和命令，确保用户能按步骤完成部署。`,

  'knowledge-manager': `你是一位知识管理工程师，专长是知识沉淀和经验总结。
你的任务：从本次任务中提炼核心知识点，存入知识库。
总结维度：
1. 核心技术点 - 用到了哪些关键技术
2. 最佳实践 - 有什么值得复用的经验
3. 踩坑记录 - 遇到了什么问题，如何解决
4. 相关知识 - 关联的技术领域
输出格式：结构化的知识条目，包含标题、内容摘要、关键词标签。`,
}

export interface LLMConfig {
  apiKey: string
  model: string
  temperature: number
  maxTokens: number
}

function getConfig(): LLMConfig | null {
  try {
    const stored = localStorage.getItem('hopeai-llm-config')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // ignore
  }
  return null
}

export function saveLLMConfig(config: LLMConfig) {
  localStorage.setItem('hopeai-llm-config', JSON.stringify(config))
}

export function clearLLMConfig() {
  localStorage.removeItem('hopeai-llm-config')
}

/**
 * RAG检索：从知识库中获取相关知识作为上下文
 */
function getRAGContext(command: string, topK: number = 3): string {
  try {
    const entries = useKnowledgeStore.getState().entries
    if (!entries || entries.length === 0) return ''

    const cmdLower = command.toLowerCase()
    const cmdWords = cmdLower.split(/[\s,，。、！？]+/).filter(w => w.length > 1)

    const scored = entries.map(entry => {
      let score = 0
      const titleLower = entry.title.toLowerCase()
      const contentLower = entry.content.toLowerCase()
      const tagsLower = entry.tags.map(t => t.toLowerCase()).join(' ')

      for (const word of cmdWords) {
        if (titleLower.includes(word)) score += 3
        if (tagsLower.includes(word)) score += 2
        if (contentLower.includes(word)) score += 1
      }

      for (const tag of entry.tags) {
        if (cmdLower.includes(tag.toLowerCase()) && tag.length > 1) score += 2
      }

      return { entry, score }
    })

    const relevant = scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)

    if (relevant.length === 0) return ''

    const refs = relevant.map((s, i) => {
      return `参考资料${i + 1}（${s.entry.title}）：\n${s.entry.content.slice(0, 800)}`
    }).join('\n\n')

    return `\n\n以下是知识库中的相关资料，供你参考：\n${refs}\n`
  } catch {
    return ''
  }
}

/**
 * 调用Kimi API生成回答
 */
export async function callKimi(
  agentId: string,
  command: string,
  context?: string
): Promise<string> {
  const config = getConfig()
  if (!config || !config.apiKey) {
    throw new Error('未配置Kimi API Key，请在"我的"页面设置')
  }

  const systemPrompt = agentPrompts[agentId] || '你是一位专业的AI助手。'
  const ragContext = getRAGContext(command, 3)

  const messages = [
    { role: 'system', content: systemPrompt + ragContext },
  ]

  if (context) {
    messages.push({ role: 'system', content: `上下文信息：\n${context}` })
  }

  messages.push({ role: 'user', content: command })

  const response = await fetch(KIMI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || 'moonshot-v1-8k',
      messages,
      temperature: config.temperature ?? 0.7,
      max_tokens: config.maxTokens || 2000,
    }),
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    const errMsg = errData?.error?.message || `API调用失败 (${response.status})`
    throw new Error(errMsg)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content || ''
  return content
}
