/**
 * HopeAgent 命令系统服务
 * 解析并执行聊天输入框中以 / 开头的斜杠命令
 */

import type { Conversation } from '@/types'
import { BUILTIN_MODELS, switchModel, getCurrentModel } from './modelRouter'
import { exportConversationMarkdown, exportConversationJSON } from './exportService'
import { success, error, info, warning } from './notificationService'

// ============ 类型定义 ============
export interface Command {
  name: string
  /** 命令别名 */
  aliases?: string[]
  description: string
  /** 用法示例 */
  usage: string
  /** 参数说明 */
  argsHint?: string
  /** 是否需要参数 */
  requiresArgs?: boolean
  /** 分类，用于帮助分组 */
  category: 'conversation' | 'model' | 'knowledge' | 'utility' | 'system'
  /** 执行处理器 */
  execute: (args: string, context: CommandContext) => Promise<CommandResult>
}

export interface CommandContext {
  /** 当前激活的对话 */
  conversation?: Conversation
  /** 切换对话页等导航能力 */
  navigate?: (page: string) => void
  /** 清空当前对话消息 */
  clearConversation?: () => void
  /** 设置当前 Agent */
  setActiveAgent?: (agentId: string) => void
  /** 设置主题 */
  setTheme?: (theme: string) => void
  /** 向聊天框注入一条用户消息（用于 /translate /code 等转换后发送） */
  injectMessage?: (text: string) => void
  /** 触发文件上传 UI */
  triggerUpload?: () => void
  /** 触发知识库搜索 */
  searchKnowledge?: (query: string) => void
  /** 可用 Agent 列表（用于补全建议） */
  agents?: { id: string; name: string }[]
}

export interface CommandResult {
  ok: boolean
  /** 给用户的反馈消息 */
  message?: string
  /** 是否阻止该输入作为普通消息发送 */
  handled?: boolean
}

// ============ 命令注册表 ============
const commands: Command[] = [
  {
    name: 'clear',
    aliases: ['cls', 'reset'],
    description: '清空当前对话的所有消息',
    usage: '/clear',
    category: 'conversation',
    execute: async (_args, ctx) => {
      if (ctx.clearConversation) {
        ctx.clearConversation()
        success('已清空对话', '当前对话消息已清空')
        return { ok: true, handled: true }
      }
      return { ok: false, message: '当前环境不支持清空对话', handled: true }
    },
  },
  {
    name: 'export',
    aliases: ['save'],
    description: '导出当前对话为 Markdown 或 JSON',
    usage: '/export [md|json]',
    argsHint: 'md | json',
    category: 'conversation',
    execute: async (args, ctx) => {
      const format = (args.trim() || 'md').toLowerCase()
      const conv = ctx.conversation
      if (!conv) {
        return { ok: false, message: '当前没有激活的对话', handled: true }
      }
      try {
        if (format === 'json') {
          await exportConversationJSON(conv.id, conv)
          success('导出成功', `已导出为 JSON：${conv.title}`)
        } else {
          await exportConversationMarkdown(conv.id, conv)
          success('导出成功', `已导出为 Markdown：${conv.title}`)
        }
        return { ok: true, handled: true }
      } catch (err: any) {
        error('导出失败', err?.message)
        return { ok: false, message: err?.message, handled: true }
      }
    },
  },
  {
    name: 'agent',
    aliases: ['switch'],
    description: '切换当前对话使用的 Agent',
    usage: '/agent <name>',
    argsHint: 'Agent 名称或 ID',
    requiresArgs: true,
    category: 'model',
    execute: async (args, ctx) => {
      const target = args.trim()
      if (!target) {
        return { ok: false, message: '请指定 Agent 名称，例如 /agent orchestrator', handled: true }
      }
      const agents = ctx.agents || []
      const matched = agents.find(a => a.id === target || a.name === target)
      if (!matched) {
        const available = agents.map(a => a.name).join('、') || '无可用 Agent'
        return { ok: false, message: `未找到 Agent：${target}。可用：${available}`, handled: true }
      }
      if (ctx.setActiveAgent) {
        ctx.setActiveAgent(matched.id)
        success('已切换 Agent', `当前 Agent：${matched.name}`)
        return { ok: true, handled: true }
      }
      return { ok: false, message: '当前环境不支持切换 Agent', handled: true }
    },
  },
  {
    name: 'model',
    description: '切换默认 LLM 模型',
    usage: '/model <modelId>',
    argsHint: '模型 ID',
    requiresArgs: true,
    category: 'model',
    execute: async (args) => {
      const modelId = args.trim()
      if (!modelId) {
        const current = getCurrentModel()
        return { ok: true, message: `当前模型：${current.name}（${current.id}）`, handled: true }
      }
      const found = BUILTIN_MODELS.find(m => m.id === modelId || m.name === modelId)
      if (!found) {
        const available = BUILTIN_MODELS.map(m => m.id).join('、')
        return { ok: false, message: `未找到模型：${modelId}。可用：${available}`, handled: true }
      }
      await switchModel(found.id)
      success('已切换模型', `${found.name}（${found.id}）`)
      return { ok: true, handled: true }
    },
  },
  {
    name: 'search',
    aliases: ['kb'],
    description: '在知识库中搜索',
    usage: '/search <query>',
    argsHint: '搜索关键词',
    requiresArgs: true,
    category: 'knowledge',
    execute: async (args, ctx) => {
      const query = args.trim()
      if (!query) return { ok: false, message: '请输入搜索关键词', handled: true }
      if (ctx.searchKnowledge) {
        ctx.searchKnowledge(query)
        if (ctx.navigate) ctx.navigate('knowledge')
        return { ok: true, handled: true }
      }
      return { ok: false, message: '当前环境不支持知识库搜索', handled: true }
    },
  },
  {
    name: 'help',
    aliases: ['?', 'commands'],
    description: '显示所有可用命令',
    usage: '/help [command]',
    category: 'utility',
    execute: async (args) => {
      const target = args.trim()
      if (target) {
        const help = getCommandHelp(target)
        return { ok: true, message: help, handled: true }
      }
      const list = commands.map(c => `/${c.name}${c.requiresArgs ? ' <args>' : ''} — ${c.description}`).join('\n')
      return { ok: true, message: `可用命令：\n${list}`, handled: true }
    },
  },
  {
    name: 'summary',
    aliases: ['summarize'],
    description: '总结当前对话内容',
    usage: '/summary',
    category: 'conversation',
    execute: async (_args, ctx) => {
      const conv = ctx.conversation
      if (!conv || conv.messages.length === 0) {
        return { ok: false, message: '当前对话为空，无法总结', handled: true }
      }
      const summary = summarizeConversation(conv)
      info('对话总结', summary)
      return { ok: true, message: summary, handled: true }
    },
  },
  {
    name: 'translate',
    aliases: ['tr'],
    description: '翻译文本到指定语言',
    usage: '/translate <lang> <text>',
    argsHint: '语言 文本',
    requiresArgs: true,
    category: 'utility',
    execute: async (args, ctx) => {
      const parts = args.trim().split(/\s+/)
      const lang = parts[0] || 'en'
      const text = parts.slice(1).join(' ')
      if (!text) {
        return { ok: false, message: '请输入要翻译的文本，例如 /translate en 你好', handled: true }
      }
      // 通过注入一条带指令的消息触发 LLM 翻译
      const prompt = `请将以下内容翻译为${langName(lang)}，只输出译文：\n\n${text}`
      if (ctx.injectMessage) {
        ctx.injectMessage(prompt)
        return { ok: true, handled: true }
      }
      return { ok: true, message: prompt, handled: true }
    },
  },
  {
    name: 'code',
    description: '生成指定语言的代码',
    usage: '/code <lang> <description>',
    argsHint: '语言 描述',
    requiresArgs: true,
    category: 'utility',
    execute: async (args, ctx) => {
      const parts = args.trim().split(/\s+/)
      const lang = parts[0] || 'python'
      const desc = parts.slice(1).join(' ')
      if (!desc) {
        return { ok: false, message: '请描述要生成的代码，例如 /code python 快速排序', handled: true }
      }
      const prompt = `请用 ${lang} 编写以下需求的代码，并附简要说明：\n\n${desc}`
      if (ctx.injectMessage) {
        ctx.injectMessage(prompt)
        return { ok: true, handled: true }
      }
      return { ok: true, message: prompt, handled: true }
    },
  },
  {
    name: 'upload',
    aliases: ['file'],
    description: '上传文件',
    usage: '/upload',
    category: 'utility',
    execute: async (_args, ctx) => {
      if (ctx.triggerUpload) {
        ctx.triggerUpload()
        return { ok: true, handled: true }
      }
      return { ok: false, message: '当前环境不支持文件上传', handled: true }
    },
  },
  {
    name: 'stats',
    aliases: ['stat'],
    description: '显示当前对话统计信息',
    usage: '/stats',
    category: 'system',
    execute: async (_args, ctx) => {
      const conv = ctx.conversation
      if (!conv) return { ok: false, message: '当前没有激活的对话', handled: true }
      const stats = computeStats(conv)
      const msg = [
        `对话标题：${conv.title}`,
        `消息总数：${stats.totalMessages}`,
        `用户消息：${stats.userMessages}`,
        `助手消息：${stats.assistantMessages}`,
        `总字符数：${stats.totalChars}`,
        `思考步骤：${stats.thoughtSteps}`,
        `工具调用：${stats.toolCalls}`,
        `创建时间：${new Date(conv.createdAt).toLocaleString('zh-CN')}`,
      ].join('\n')
      info('对话统计', msg)
      return { ok: true, message: msg, handled: true }
    },
  },
  {
    name: 'theme',
    description: '切换应用主题',
    usage: '/theme <cyber|matrix|sunset>',
    argsHint: 'cyber | matrix | sunset',
    requiresArgs: true,
    category: 'system',
    execute: async (args, ctx) => {
      const theme = args.trim().toLowerCase()
      const valid = ['cyber', 'matrix', 'sunset']
      if (!valid.includes(theme)) {
        warning('未知主题', `支持的主题：${valid.join('、')}`)
        return { ok: false, message: `未知主题：${theme}`, handled: true }
      }
      if (ctx.setTheme) {
        ctx.setTheme(theme)
        success('已切换主题', theme)
        return { ok: true, handled: true }
      }
      return { ok: false, message: '当前环境不支持切换主题', handled: true }
    },
  },
]

// ============ 命令解析 ============

export interface ParsedCommand {
  name: string
  args: string
  raw: string
}

/**
 * 解析输入，若以 / 开头则识别为命令
 * @returns 命令对象；非命令返回 null
 */
export function parseCommand(input: string): ParsedCommand | null {
  const trimmed = input.trim()
  if (!trimmed.startsWith('/')) return null
  const spaceIdx = trimmed.indexOf(' ')
  if (spaceIdx < 0) {
    return { name: trimmed.slice(1).toLowerCase(), args: '', raw: trimmed }
  }
  const name = trimmed.slice(1, spaceIdx).toLowerCase()
  const args = trimmed.slice(spaceIdx + 1).trim()
  return { name, args, raw: trimmed }
}

/** 按名称或别名查找命令 */
export function findCommand(name: string): Command | undefined {
  return commands.find(c => c.name === name || c.aliases?.includes(name))
}

// ============ 命令执行 ============

/**
 * 执行已解析的命令
 * 未注册或参数缺失时返回 ok:false 的结果
 */
export async function executeCommand(
  cmd: ParsedCommand,
  context: CommandContext
): Promise<CommandResult> {
  const command = findCommand(cmd.name)
  if (!command) {
    return { ok: false, message: `未知命令：/${cmd.name}，输入 /help 查看可用命令`, handled: true }
  }
  if (command.requiresArgs && !cmd.args) {
    return { ok: false, message: `命令 /${cmd.name} 需要参数。用法：${command.usage}`, handled: true }
  }
  try {
    return await command.execute(cmd.args, context)
  } catch (err: any) {
    error('命令执行失败', `/${cmd.name}: ${err?.message || err}`)
    return { ok: false, message: err?.message || '执行失败', handled: true }
  }
}

// ============ 补全建议 ============

/**
 * 输入 / 时返回补全建议
 * @param input 当前输入（如 /mod）
 * @returns 匹配的命令列表
 */
export function getCommandSuggestions(input: string): Command[] {
  const trimmed = input.trim()
  if (!trimmed.startsWith('/')) return []
  const name = trimmed.slice(1).toLowerCase()
  // 空格之后不再补全命令名
  if (name.includes(' ')) return []
  if (!name) return [...commands]
  return commands.filter(c =>
    c.name.startsWith(name) || c.aliases?.some(a => a.startsWith(name))
  )
}

// ============ 命令帮助 ============

/** 返回某条命令的详细帮助文本 */
export function getCommandHelp(name: string): string {
  const command = findCommand(name)
  if (!command) return `未找到命令：${name}`
  const alias = command.aliases?.length ? `（别名：${command.aliases.map(a => '/' + a).join('、')}）` : ''
  return [
    `/${command.name} ${alias}`,
    `说明：${command.description}`,
    `用法：${command.usage}`,
    command.argsHint ? `参数：${command.argsHint}` : '',
    `分类：${categoryLabel(command.category)}`,
  ].filter(Boolean).join('\n')
}

/** 返回全部命令的分组帮助 */
export function getAllCommands(): Command[] {
  return [...commands]
}

// ============ 辅助函数 ============

function categoryLabel(cat: Command['category']): string {
  const map: Record<Command['category'], string> = {
    conversation: '对话',
    model: '模型/Agent',
    knowledge: '知识库',
    utility: '工具',
    system: '系统',
  }
  return map[cat]
}

function langName(code: string): string {
  const map: Record<string, string> = {
    en: '英文', zh: '中文', ja: '日文', ko: '韩文',
    fr: '法文', de: '德文', es: '西班牙文', ru: '俄文',
  }
  return map[code.toLowerCase()] || code
}

function summarizeConversation(conv: Conversation): string {
  const userMsgs = conv.messages.filter(m => m.role === 'user')
  const topics = userMsgs.map(m => m.content.slice(0, 30)).filter(Boolean)
  return `本对话共 ${conv.messages.length} 条消息，用户提问 ${userMsgs.length} 次。` +
    `主要话题：${topics.slice(0, 3).join('；') || '（无）'}。`
}

function computeStats(conv: Conversation): {
  totalMessages: number
  userMessages: number
  assistantMessages: number
  totalChars: number
  thoughtSteps: number
  toolCalls: number
} {
  let userMessages = 0
  let assistantMessages = 0
  let totalChars = 0
  let thoughtSteps = 0
  let toolCalls = 0
  for (const m of conv.messages) {
    if (m.role === 'user') userMessages++
    if (m.role === 'assistant') assistantMessages++
    totalChars += m.content.length
    thoughtSteps += m.thoughtSteps?.length || 0
    toolCalls += m.toolCalls?.length || 0
  }
  return { totalMessages: conv.messages.length, userMessages, assistantMessages, totalChars, thoughtSteps, toolCalls }
}
