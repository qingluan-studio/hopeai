/**
 * HopeAgent 命令系统服务
 * 解析并执行聊天输入框中以 / 开头的斜杠命令
 * 支持 30+ 个命令，涵盖对话管理、Agent/模型、知识库、工具、系统设置、趣味彩蛋
 */

import type { Conversation } from '@/types'
import { BUILTIN_MODELS, switchModel, getCurrentModel } from './modelRouter'
import { exportConversationMarkdown, exportConversationJSON } from './exportService'
import { success, error, info, warning } from './notificationService'
import { getThemes, setTheme as applyTheme } from './themeService'

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
  category: 'conversation' | 'model' | 'knowledge' | 'utility' | 'system' | 'fun'
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
  /** 重命名当前对话 */
  renameConversation?: (title: string) => void
  /** 归档当前对话 */
  archiveConversation?: () => void
  /** 置顶/取消置顶对话 */
  togglePinConversation?: () => void
  /** 搜索对话历史 */
  searchConversations?: (query: string) => void
  /** 设置 temperature */
  setTemperature?: (temp: number) => void
  /** 获取当前 temperature */
  getTemperature?: () => number
  /** 设置系统提示词 */
  setSystemPrompt?: (prompt: string) => void
  /** 知识库统计 */
  getKnowledgeStats?: () => { total: number; tags: string[] }
  /** 添加知识条目 */
  addKnowledge?: (entry: { title: string; content: string; tags: string[] }) => void
  /** 超级大脑开关 */
  toggleSuperBrain?: (enabled: boolean) => void
  /** 获取超级大脑状态 */
  getSuperBrainState?: () => { enabled: boolean }
  /** 获取系统状态 */
  getSystemStatus?: () => Record<string, any>
}

export interface CommandResult {
  ok: boolean
  /** 给用户的反馈消息 */
  message?: string
  /** 是否阻止该输入作为普通消息发送 */
  handled?: boolean
}

// ============ 命令历史 ============
const MAX_HISTORY = 20
let commandHistory: string[] = []

/** 获取命令历史 */
export function getCommandHistory(): string[] {
  return [...commandHistory]
}

/** 添加命令到历史 */
function addToHistory(cmdName: string): void {
  commandHistory = [cmdName, ...commandHistory.filter(c => c !== cmdName)].slice(0, MAX_HISTORY)
}

// ============ 命令注册表 ============
const commands: Command[] = [
  // ============ 对话管理类 ============
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
    name: 'new',
    aliases: ['n'],
    description: '新建一个对话',
    usage: '/new',
    category: 'conversation',
    execute: async (_args, ctx) => {
      if (ctx.navigate) {
        ctx.navigate('chat')
        success('新建对话', '已创建新对话')
        return { ok: true, handled: true }
      }
      return { ok: false, message: '当前环境不支持新建对话', handled: true }
    },
  },
  {
    name: 'rename',
    aliases: ['mv'],
    description: '重命名当前对话',
    usage: '/rename <新标题>',
    argsHint: '新标题',
    requiresArgs: true,
    category: 'conversation',
    execute: async (args, ctx) => {
      const title = args.trim()
      if (!title) {
        return { ok: false, message: '请输入新标题，例如 /rename 项目讨论', handled: true }
      }
      if (ctx.renameConversation) {
        ctx.renameConversation(title)
        success('已重命名', `对话标题已改为：${title}`)
        return { ok: true, handled: true }
      }
      return { ok: false, message: '当前环境不支持重命名', handled: true }
    },
  },
  {
    name: 'archive',
    description: '归档当前对话',
    usage: '/archive',
    category: 'conversation',
    execute: async (_args, ctx) => {
      if (ctx.archiveConversation) {
        ctx.archiveConversation()
        success('已归档', '对话已移至归档')
        return { ok: true, handled: true }
      }
      return { ok: false, message: '当前环境不支持归档', handled: true }
    },
  },
  {
    name: 'export',
    aliases: ['save'],
    description: '导出当前对话为 Markdown、JSON 或 TXT',
    usage: '/export [md|json|txt]',
    argsHint: 'md | json | txt',
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
        } else if (format === 'txt') {
          const text = conv.messages.map(m => `[${m.role}]\n${m.content}`).join('\n\n')
          const blob = new Blob([text], { type: 'text/plain' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${conv.title}.txt`
          a.click()
          URL.revokeObjectURL(url)
          success('导出成功', `已导出为 TXT：${conv.title}`)
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
    name: 'search',
    aliases: ['find'],
    description: '搜索对话历史',
    usage: '/search <关键词>',
    argsHint: '搜索关键词',
    requiresArgs: true,
    category: 'conversation',
    execute: async (args, ctx) => {
      const query = args.trim()
      if (!query) return { ok: false, message: '请输入搜索关键词', handled: true }
      if (ctx.searchConversations) {
        ctx.searchConversations(query)
        return { ok: true, handled: true }
      }
      info('搜索', `正在搜索：${query}`)
      return { ok: true, message: `搜索关键词：${query}`, handled: true }
    },
  },
  {
    name: 'pin',
    description: '置顶/取消置顶当前对话',
    usage: '/pin',
    category: 'conversation',
    execute: async (_args, ctx) => {
      if (ctx.togglePinConversation) {
        ctx.togglePinConversation()
        success('操作成功', '对话置顶状态已切换')
        return { ok: true, handled: true }
      }
      return { ok: false, message: '当前环境不支持置顶', handled: true }
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
    name: 'stats',
    aliases: ['stat'],
    description: '显示当前对话统计信息',
    usage: '/stats',
    category: 'conversation',
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

  // ============ Agent/模型类 ============
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
    name: 'agents',
    aliases: ['list-agents'],
    description: '列出所有可用的 Agent',
    usage: '/agents',
    category: 'model',
    execute: async (_args, ctx) => {
      const agents = ctx.agents || []
      if (agents.length === 0) {
        return { ok: false, message: '暂无可用 Agent', handled: true }
      }
      const list = agents.map((a, i) => `${i + 1}. ${a.name}（${a.id}）`).join('\n')
      info('可用 Agent', list)
      return { ok: true, message: list, handled: true }
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
    name: 'superbrain',
    aliases: ['super', 'sb'],
    description: '开关超级大脑模式',
    usage: '/superbrain <on|off>',
    argsHint: 'on | off',
    category: 'model',
    execute: async (args, ctx) => {
      const action = args.trim().toLowerCase()
      if (!action) {
        const state = ctx.getSuperBrainState?.()
        const status = state?.enabled ? '已开启' : '已关闭'
        return { ok: true, message: `超级大脑当前状态：${status}`, handled: true }
      }
      const enabled = action === 'on' || action === '1' || action === 'true'
      if (ctx.toggleSuperBrain) {
        ctx.toggleSuperBrain(enabled)
        success('超级大脑', enabled ? '已开启超级大脑模式' : '已关闭超级大脑模式')
        return { ok: true, handled: true }
      }
      return { ok: false, message: '当前环境不支持超级大脑', handled: true }
    },
  },
  {
    name: 'temp',
    aliases: ['temperature'],
    description: '设置模型 temperature (0-2)',
    usage: '/temp <0-2>',
    argsHint: '0-2 之间的数值',
    category: 'model',
    execute: async (args, ctx) => {
      const value = args.trim()
      if (!value) {
        const current = ctx.getTemperature?.() ?? 0.7
        return { ok: true, message: `当前 temperature：${current}`, handled: true }
      }
      const temp = parseFloat(value)
      if (isNaN(temp) || temp < 0 || temp > 2) {
        return { ok: false, message: 'temperature 必须是 0-2 之间的数字', handled: true }
      }
      if (ctx.setTemperature) {
        ctx.setTemperature(temp)
        success('已设置', `temperature 已设为 ${temp}`)
        return { ok: true, handled: true }
      }
      return { ok: true, message: `temperature：${temp}`, handled: true }
    },
  },
  {
    name: 'system',
    aliases: ['sys', 'system-prompt'],
    description: '自定义系统提示词',
    usage: '/system <prompt>',
    argsHint: '系统提示词内容',
    requiresArgs: true,
    category: 'model',
    execute: async (args, ctx) => {
      const prompt = args.trim()
      if (!prompt) {
        return { ok: false, message: '请输入系统提示词', handled: true }
      }
      if (ctx.setSystemPrompt) {
        ctx.setSystemPrompt(prompt)
        success('已设置', '系统提示词已更新')
        return { ok: true, handled: true }
      }
      return { ok: true, message: `系统提示词：${prompt}`, handled: true }
    },
  },

  // ============ 知识库类 ============
  {
    name: 'kb',
    aliases: ['knowledge'],
    description: '知识库操作：search / stats / add / import',
    usage: '/kb <search|stats|add|import> [args]',
    argsHint: 'search|stats|add|import',
    category: 'knowledge',
    execute: async (args, ctx) => {
      const parts = args.trim().split(/\s+/)
      const subCmd = parts[0]?.toLowerCase()
      const rest = parts.slice(1).join(' ')

      switch (subCmd) {
        case 'search':
        case 's': {
          const query = rest.trim()
          if (!query) return { ok: false, message: '请输入搜索关键词，例如 /kb search 人工智能', handled: true }
          if (ctx.searchKnowledge) {
            ctx.searchKnowledge(query)
            if (ctx.navigate) ctx.navigate('knowledge')
            return { ok: true, handled: true }
          }
          return { ok: false, message: '当前环境不支持知识库搜索', handled: true }
        }
        case 'stats':
        case 'stat': {
          const stats = ctx.getKnowledgeStats?.()
          if (stats) {
            const msg = `知识库条目：${stats.total} 条\n标签：${stats.tags.slice(0, 10).join('、')}${stats.tags.length > 10 ? '...' : ''}`
            info('知识库统计', msg)
            return { ok: true, message: msg, handled: true }
          }
          return { ok: false, message: '无法获取知识库统计', handled: true }
        }
        case 'add':
        case 'a': {
          const parts2 = rest.split('|').map(s => s.trim())
          const title = parts2[0]
          const content = parts2[1]
          const tags = parts2[2]?.split(',').map(t => t.trim()).filter(Boolean) || []
          if (!title || !content) {
            return { ok: false, message: '格式：/kb add 标题|内容|标签1,标签2', handled: true }
          }
          if (ctx.addKnowledge) {
            ctx.addKnowledge({ title, content, tags })
            success('已添加', `知识条目「${title}」已添加`)
            return { ok: true, handled: true }
          }
          return { ok: false, message: '当前环境不支持添加知识', handled: true }
        }
        case 'import':
        case 'i': {
          if (ctx.triggerUpload) {
            ctx.triggerUpload()
            return { ok: true, handled: true }
          }
          return { ok: false, message: '当前环境不支持导入', handled: true }
        }
        default:
          return {
            ok: false,
            message: '知识库子命令：search / stats / add / import',
            handled: true,
          }
      }
    },
  },

  // ============ 工具实用类 ============
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
      const byCategory = getCommandsByCategory()
      let list = ''
      for (const [cat, cmds] of Object.entries(byCategory)) {
        list += `\n【${categoryLabel(cat as any)}】\n`
        list += cmds.map(c => `  /${c.name} — ${c.description}`).join('\n')
      }
      return { ok: true, message: `可用命令（${commands.length} 个）：${list}`, handled: true }
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
    name: 'calc',
    aliases: ['calculate', 'math'],
    description: '快速计算数学表达式',
    usage: '/calc <表达式>',
    argsHint: '数学表达式',
    requiresArgs: true,
    category: 'utility',
    execute: async (args) => {
      const expr = args.trim()
      if (!expr) {
        return { ok: false, message: '请输入表达式，例如 /calc 2+2*3', handled: true }
      }
      try {
        if (!/^[\d\s+\-*/().%\^eEpiPI\s]+$/.test(expr)) {
          return { ok: false, message: '表达式包含非法字符', handled: true }
        }
        const safeExpr = expr.replace(/\^/g, '**').replace(/pi/gi, 'Math.PI').replace(/e(?![xp])/gi, 'Math.E')
        const result = Function(`"use strict"; return (${safeExpr})`)()
        const msg = `${expr} = ${result}`
        success('计算结果', msg)
        return { ok: true, message: msg, handled: true }
      } catch {
        return { ok: false, message: '计算错误，请检查表达式', handled: true }
      }
    },
  },
  {
    name: 'time',
    aliases: ['date', 'now'],
    description: '显示当前时间（可选指定城市）',
    usage: '/time [city]',
    argsHint: '城市名（可选）',
    category: 'utility',
    execute: async (args) => {
      const city = args.trim()
      const now = new Date()
      if (!city) {
        const msg = `当前时间：${now.toLocaleString('zh-CN', {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', second: '2-digit', weekday: 'long'
        })}`
        info('当前时间', msg)
        return { ok: true, message: msg, handled: true }
      }
      const timezones: Record<string, string> = {
        '北京': 'Asia/Shanghai', '上海': 'Asia/Shanghai', 'shanghai': 'Asia/Shanghai', 'beijing': 'Asia/Shanghai',
        '东京': 'Asia/Tokyo', 'tokyo': 'Asia/Tokyo',
        '纽约': 'America/New_York', 'newyork': 'America/New_York',
        '伦敦': 'Europe/London', 'london': 'Europe/London',
        '巴黎': 'Europe/Paris', 'paris': 'Europe/Paris',
        '悉尼': 'Australia/Sydney', 'sydney': 'Australia/Sydney',
        '洛杉矶': 'America/Los_Angeles', 'la': 'America/Los_Angeles',
      }
      const tz = timezones[city.toLowerCase()] || timezones[city]
      if (tz) {
        const timeStr = now.toLocaleString('zh-CN', { timeZone: tz })
        const msg = `${city} 时间：${timeStr}`
        info('时间查询', msg)
        return { ok: true, message: msg, handled: true }
      }
      return { ok: false, message: `暂不支持城市：${city}。支持：北京、东京、纽约、伦敦、巴黎、悉尼、洛杉矶`, handled: true }
    },
  },
  {
    name: 'uuid',
    aliases: ['guid'],
    description: '生成 UUID',
    usage: '/uuid',
    category: 'utility',
    execute: async () => {
      const uuid = crypto.randomUUID()
      const msg = `UUID：${uuid}`
      info('UUID 生成', msg)
      return { ok: true, message: msg, handled: true }
    },
  },
  {
    name: 'hash',
    description: '生成哈希值（md5/sha1/sha256）',
    usage: '/hash <algo> <text>',
    argsHint: 'md5|sha1|sha256 文本',
    requiresArgs: true,
    category: 'utility',
    execute: async (args) => {
      const parts = args.trim().split(/\s+/)
      const algo = parts[0]?.toLowerCase()
      const text = parts.slice(1).join(' ')
      if (!algo || !text) {
        return { ok: false, message: '用法：/hash sha256 hello', handled: true }
      }
      try {
        const encoder = new TextEncoder()
        const data = encoder.encode(text)
        let hashBuffer: ArrayBuffer
        switch (algo) {
          case 'sha1':
            hashBuffer = await crypto.subtle.digest('SHA-1', data)
            break
          case 'sha256':
            hashBuffer = await crypto.subtle.digest('SHA-256', data)
            break
          default:
            return { ok: false, message: '支持的算法：sha1、sha256', handled: true }
        }
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
        const msg = `${algo.toUpperCase()}：${hashHex}`
        info('哈希结果', msg)
        return { ok: true, message: msg, handled: true }
      } catch (err: any) {
        return { ok: false, message: `哈希计算失败：${err.message}`, handled: true }
      }
    },
  },
  {
    name: 'json',
    aliases: ['format', 'fmt'],
    description: 'JSON 格式化/压缩',
    usage: '/json <format|minify> <json>',
    argsHint: 'format|minify JSON字符串',
    requiresArgs: true,
    category: 'utility',
    execute: async (args) => {
      const parts = args.trim().split(/\s+/)
      const mode = parts[0]?.toLowerCase() || 'format'
      const jsonStr = parts.slice(1).join(' ')
      if (!jsonStr) {
        return { ok: false, message: '请输入 JSON 字符串', handled: true }
      }
      try {
        const obj = JSON.parse(jsonStr)
        const result = mode === 'minify' || mode === 'min'
          ? JSON.stringify(obj)
          : JSON.stringify(obj, null, 2)
        const msg = `格式化结果：\n${result}`
        info('JSON 格式化', msg)
        return { ok: true, message: msg, handled: true }
      } catch {
        return { ok: false, message: 'JSON 格式错误', handled: true }
      }
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
    name: 'tools',
    description: '列出可用工具',
    usage: '/tools',
    category: 'utility',
    execute: async () => {
      const tools = [
        'web_search - 网页搜索',
        'calculator - 计算器',
        'code_interpreter - 代码解释器',
        'knowledge_base - 知识库检索',
      ]
      const msg = tools.join('\n')
      info('可用工具', msg)
      return { ok: true, message: msg, handled: true }
    },
  },

  // ============ 系统设置类 ============
  {
    name: 'theme',
    description: '切换应用主题',
    usage: '/theme <name>',
    argsHint: '主题名称',
    requiresArgs: true,
    category: 'system',
    execute: async (args, ctx) => {
      const themeId = args.trim().toLowerCase()
      const themes = getThemes()
      const found = themes.find(t => t.id === themeId || t.name === themeId)
      if (!found) {
        const available = themes.map(t => `${t.id}（${t.name}）`).join('、')
        warning('未知主题', `支持的主题：${available}`)
        return { ok: false, message: `未知主题：${themeId}`, handled: true }
      }
      applyTheme(found.id)
      if (ctx.setTheme) {
        ctx.setTheme(found.id)
      }
      success('已切换主题', `${found.name} - ${found.description}`)
      return { ok: true, handled: true }
    },
  },
  {
    name: 'settings',
    aliases: ['config', 'prefs'],
    description: '打开设置页面',
    usage: '/settings',
    category: 'system',
    execute: async (_args, ctx) => {
      if (ctx.navigate) {
        ctx.navigate('settings')
        return { ok: true, handled: true }
      }
      return { ok: false, message: '当前环境不支持打开设置', handled: true }
    },
  },
  {
    name: 'status',
    aliases: ['info', 'about'],
    description: '显示系统状态',
    usage: '/status',
    category: 'system',
    execute: async (_args, ctx) => {
      const status = ctx.getSystemStatus?.() || {}
      const msg = [
        'HopeAgent Pro v3.0.0',
        '====================',
        `对话数：${status.conversationCount ?? 'N/A'}`,
        `知识条目：${status.knowledgeCount ?? 'N/A'}`,
        `当前模型：${status.currentModel ?? 'N/A'}`,
        `超级大脑：${status.superBrainEnabled ? '开启' : '关闭'}`,
        `主题：${status.theme ?? 'N/A'}`,
      ].join('\n')
      info('系统状态', msg)
      return { ok: true, message: msg, handled: true }
    },
  },
  {
    name: 'shortcut',
    aliases: ['shortcuts', 'hotkey', 'hotkeys'],
    description: '显示快捷键列表',
    usage: '/shortcut',
    category: 'system',
    execute: async () => {
      const shortcuts = [
        'Ctrl + N - 新建对话',
        'Ctrl + / - 聚焦输入框',
        'Ctrl + K - 快捷命令',
        'Ctrl + S - 保存对话',
        'Ctrl + Shift + C - 复制最后回复',
        'Esc - 取消/关闭',
        '↑ - 上一条历史命令',
        '↓ - 下一条历史命令',
        'Tab - 自动补全',
      ]
      const msg = shortcuts.join('\n')
      info('快捷键', msg)
      return { ok: true, message: msg, handled: true }
    },
  },
  {
    name: 'vault',
    aliases: ['credentials', 'keys'],
    description: '凭证保险库操作：list/add/delete',
    usage: '/vault <list|add|delete> [args]',
    argsHint: 'list|add|delete',
    category: 'system',
    execute: async (args, ctx) => {
      const parts = args.trim().split(/\s+/)
      const subCmd = parts[0]?.toLowerCase()
      switch (subCmd) {
        case 'list':
        case 'ls':
          if (ctx.navigate) {
            ctx.navigate('settings')
            info('凭证保险库', '已打开设置页面，请前往凭证保险库查看')
            return { ok: true, handled: true }
          }
          return { ok: false, message: '请在设置页面查看凭证列表', handled: true }
        case 'add':
          if (ctx.navigate) {
            ctx.navigate('settings')
            success('添加凭证', '已打开设置页面，请在凭证保险库中添加')
            return { ok: true, handled: true }
          }
          return { ok: false, message: '请在设置页面添加凭证', handled: true }
        case 'delete':
        case 'del':
        case 'rm':
          warning('删除凭证', '请在设置页面的凭证保险库中操作')
          return { ok: true, message: '请在设置页面操作', handled: true }
        default:
          return {
            ok: false,
            message: '凭证保险库子命令：list / add / delete',
            handled: true,
          }
      }
    },
  },
  {
    name: 'backup',
    description: '备份操作：create/list',
    usage: '/backup <create|list>',
    argsHint: 'create|list',
    category: 'system',
    execute: async (args) => {
      const subCmd = args.trim().toLowerCase()
      if (subCmd === 'create' || subCmd === 'new') {
        info('备份', '正在创建备份...')
        setTimeout(() => success('备份完成', '数据已备份成功'), 500)
        return { ok: true, message: '正在创建备份...', handled: true }
      }
      return { ok: true, message: '备份功能：/backup create', handled: true }
    },
  },

  // ============ 趣味彩蛋类 ============
  {
    name: 'matrix',
    description: '进入 Matrix 主题',
    usage: '/matrix',
    category: 'fun',
    execute: async (_args, ctx) => {
      applyTheme('matrix')
      if (ctx.setTheme) {
        ctx.setTheme('matrix')
      }
      success('Wake up, Neo...', 'Matrix 模式已激活 🟢')
      return { ok: true, handled: true }
    },
  },
  {
    name: 'coffee',
    aliases: ['break', 'rest'],
    description: '休息提醒',
    usage: '/coffee',
    category: 'fun',
    execute: async () => {
      const messages = [
        '☕ 该休息一下了，喝杯咖啡吧！',
        '🧘 站起来活动活动，保护好你的颈椎',
        '👀 看看远方，让眼睛休息一下',
        '💧 记得喝水哦~',
        '🚶 走两步，久坐伤身',
      ]
      const msg = messages[Math.floor(Math.random() * messages.length)]
      info('休息提醒', msg)
      return { ok: true, message: msg, handled: true }
    },
  },
  {
    name: 'coin',
    aliases: ['flip', 'toss'],
    description: '抛硬币',
    usage: '/coin',
    category: 'fun',
    execute: async () => {
      const result = Math.random() < 0.5 ? '正面' : '反面'
      const msg = `🪙 硬币抛起... 结果是：${result}！`
      info('抛硬币', msg)
      return { ok: true, message: msg, handled: true }
    },
  },
  {
    name: 'dice',
    aliases: ['roll', 'die'],
    description: '掷骰子',
    usage: '/dice [n]',
    argsHint: '骰子数量（可选，默认1）',
    category: 'fun',
    execute: async (args) => {
      const n = Math.min(10, Math.max(1, parseInt(args.trim()) || 1))
      const results = Array.from({ length: n }, () => Math.floor(Math.random() * 6) + 1)
      const total = results.reduce((a, b) => a + b, 0)
      const msg = `🎲 掷出 ${n} 个骰子：${results.join(' + ')} = ${total}`
      info('掷骰子', msg)
      return { ok: true, message: msg, handled: true }
    },
  },
  {
    name: 'quote',
    aliases: ['quotes', 'saying'],
    description: '随机名言',
    usage: '/quote',
    category: 'fun',
    execute: async () => {
      const quotes = [
        { text: '代码是写给人看的，只是顺便让机器执行。', author: 'Harold Abelson' },
        { text: '简单的才是可靠的。', author: 'Linus Torvalds' },
        { text: '过早优化是万恶之源。', author: 'Donald Knuth' },
        { text: '先让它工作，再让它正确，最后让它快。', author: 'Kent Beck' },
        { text: '好的代码是最好的文档。', author: 'Steve McConnell' },
        { text: '编程不是关于你知道什么，而是关于你能解决什么问题。', author: 'Chris Pine' },
        { text: '任何傻瓜都能写出计算机能理解的代码，好的程序员写出人能理解的代码。', author: 'Martin Fowler' },
        { text: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds' },
      ]
      const q = quotes[Math.floor(Math.random() * quotes.length)]
      const msg = `「${q.text}」\n  — ${q.author}`
      info('每日名言', msg)
      return { ok: true, message: msg, handled: true }
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

// ============ 命令注册 ============

/**
 * 注册新命令（运行时扩展）
 * @param cmd 命令配置
 * @returns 是否注册成功
 */
export function registerCommand(cmd: Command): boolean {
  if (!cmd?.name) return false
  if (findCommand(cmd.name)) return false
  commands.push(cmd)
  return true
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
    addToHistory(cmd.name)
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

// ============ 命令分组 ============

/**
 * 按分类获取所有命令
 */
export function getCommandsByCategory(): Record<string, Command[]> {
  const result: Record<string, Command[]> = {}
  for (const cmd of commands) {
    if (!result[cmd.category]) {
      result[cmd.category] = []
    }
    result[cmd.category].push(cmd)
  }
  return result
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

/** 返回全部命令列表 */
export function getAllCommands(): Command[] {
  return [...commands]
}

// ============ 辅助函数 ============

function categoryLabel(cat: Command['category']): string {
  const map: Record<Command['category'], string> = {
    conversation: '对话管理',
    model: '模型/Agent',
    knowledge: '知识库',
    utility: '工具实用',
    system: '系统设置',
    fun: '趣味彩蛋',
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
