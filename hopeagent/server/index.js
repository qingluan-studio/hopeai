/**
 * HopeAgent Pro 后端服务
 * 轻量级 Node.js API — 对话管理 + LLM代理 + 知识库 + 超级大脑
 * 纯代码实现，零第三方依赖，不依赖任何大平台
 */
import http from 'http'
import fs from 'fs'
import path from 'path'
import url from 'url'
import { fileURLToPath } from 'url'

// ============ 配置 ============
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PORT = process.env.PORT || 3210
const DATA_DIR = path.join(__dirname, 'data')
const DB_FILE = path.join(DATA_DIR, 'db.json')

// 确保数据目录
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })

// 简易数据库
function loadDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'))
  } catch {
    return { conversations: {}, knowledge: [], settings: {}, stats: { totalMessages: 0, totalTokens: 0 } }
  }
}

function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2))
}

let db = loadDB()

// ============ 工具函数 ============
function genId() {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8)
}

function jsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}) }
      catch { reject(new Error('JSON解析失败')) }
    })
    req.on('error', reject)
  })
}

function sendJSON(res, code, data) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' })
  res.end(JSON.stringify(data))
}

function sendSSE(res, data) {
  res.write(`data: ${JSON.stringify(data)}\n\n`)
}

// ============ LLM 代理调用 ============
async function callLLM(messages, config) {
  if (!config.apiKey || !config.enabled) {
    return { error: 'LLM未配置', fallback: true }
  }

  try {
    const response = await fetch(config.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: config.temperature || 0.7,
        max_tokens: config.maxTokens || 2000,
        stream: false,
      }),
    })

    if (!response.ok) {
      return { error: `API返回 ${response.status}` }
    }

    const data = await response.json()
    return {
      content: data.choices?.[0]?.message?.content || '',
      usage: data.usage || {},
    }
  } catch (err) {
    return { error: err.message }
  }
}

// 流式 LLM 调用，逐 chunk 回调
async function streamLLM(messages, config, onChunk) {
  if (!config.apiKey || !config.enabled) {
    throw new Error('LLM未配置')
  }
  const response = await fetch(config.baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: config.temperature || 0.7,
      max_tokens: config.maxTokens || 2000,
      stream: true,
    }),
  })

  if (!response.ok) {
    throw new Error(`API返回 ${response.status}`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let full = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('data:')) continue
      const payload = trimmed.slice(5).trim()
      if (payload === '[DONE]') return full
      try {
        const obj = JSON.parse(payload)
        const delta = obj.choices?.[0]?.delta?.content || ''
        if (delta) {
          full += delta
          onChunk(delta, full)
        }
      } catch {}
    }
  }
  return full
}

// ============ 超级大脑系统提示词 ============
function buildSuperPrompt() {
  return `你是 HopeAgent 超级大脑，一个融合了 23 个专业 Agent 能力的超级智能体。

## 能力分层（你同时具备以下所有能力）

### L1 编排调度层
- 总指挥：任务拆解、Agent调度、全局协调
- 需求分析师：需求拆解、可行性分析、方案设计
- 产品经理：产品规划、需求管理、用户研究

### L2 交付执行层
- 架构师：系统架构、设计模式、性能优化
- 后端工程师：Node.js/Python、API设计、数据库
- 前端工程师：React/Vue、TypeScript、CSS动效
- 全栈工程师：快速原型、端到端交付、DevOps
- UI设计师：界面设计、交互设计、设计系统

### L3 数据底座层
- 数据科学家：数据分析、可视化、机器学习
- 数据库专家：DB设计、SQL优化、索引调优
- AI工程师：模型训练、推理优化、Prompt工程
- 研究员：技术调研、论文解读、趋势分析

### L4 治理安全层
- 测试工程师：单元/集成/E2E/性能/安全测试
- 代码审查员：代码质量、最佳实践、重构建议
- 安全专家：渗透测试、代码审计、漏洞修复
- 性能优化师：前端/后端/数据库/网络性能
- 运维工程师：Docker/K8s、CI/CD、监控告警
- Bug猎人：问题定位、根因分析、修复方案

### SP 特殊智能层
- 技术文档师：API文档、教程、知识管理
- 翻译官：多语言翻译、本地化
- 创意顾问：创意设计、头脑风暴

## 工作模式
1. **意图解析**：理解用户真实需求，识别隐含需求
2. **分层激活**：根据问题类型自动调用相关能力
3. **融合输出**：综合多领域能力产出最优方案

## 输出原则
- 直接解决问题，不展示内部调度过程
- 你是自包含的完整系统，不需要说明"我会让XX来处理"
- 代码必须完整可运行，不要省略
- 复杂问题分点说明，重点突出
- 使用中文回答，代码注释用中文
- 遇到模糊需求主动澄清或给出多种方案`
}

// ============ API 路由 ============
const routes = {
  // ---- 对话管理 ----
  'POST /api/chat/send': async (req, res, body) => {
    const { message, conversationId, config, useSuperBrain } = body
    if (!message) return sendJSON(res, 400, { error: '消息不能为空' })

    // 创建或获取对话
    let convId = conversationId
    if (!convId) {
      convId = genId()
      db.conversations[convId] = {
        id: convId,
        title: message.slice(0, 20) + (message.length > 20 ? '...' : ''),
        messages: [],
        createdAt: new Date().toISOString(),
      }
    }
    if (!db.conversations[convId]) {
      db.conversations[convId] = { id: convId, title: '新对话', messages: [], createdAt: new Date().toISOString() }
    }

    const conv = db.conversations[convId]

    // 添加用户消息
    const userMsg = {
      id: genId(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    }
    conv.messages.push(userMsg)

    // 调用LLM
    const systemPrompt = useSuperBrain
      ? buildSuperPrompt()
      : '你是HopeAgent Pro，一个专业的AI助手。使用中文回答。'

    const history = conv.messages.slice(-10).map(m => ({
      role: m.role,
      content: m.content,
    }))

    const llmResult = await callLLM(
      [{ role: 'system', content: systemPrompt }, ...history],
      config || { enabled: false }
    )

    let assistantContent = ''
    if (llmResult.error) {
      assistantContent = llmResult.fallback
        ? `收到你的消息：「${message}」\n\n请在设置中配置API Key以启用AI对话。`
        : `调用失败：${llmResult.error}`
    } else {
      assistantContent = llmResult.content
    }

    const assistantMsg = {
      id: genId(),
      role: 'assistant',
      content: assistantContent,
      timestamp: new Date().toISOString(),
    }
    conv.messages.push(assistantMsg)

    // 更新统计
    db.stats.totalMessages += 2
    if (llmResult.usage?.total_tokens) {
      db.stats.totalTokens += llmResult.usage.total_tokens
    }

    saveDB(db)

    sendJSON(res, 200, {
      conversationId: convId,
      message: assistantMsg,
      usage: llmResult.usage,
    })
  },

  // 流式对话（真实 SSE + 对话持久化）
  'POST /api/chat/stream': async (req, res, body) => {
    const { message, conversationId, config, useSuperBrain } = body
    if (!message) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ error: '消息不能为空' }))
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    })

    // 创建或获取对话
    let convId = conversationId
    if (!convId) {
      convId = genId()
      db.conversations[convId] = {
        id: convId,
        title: message.slice(0, 20) + (message.length > 20 ? '...' : ''),
        messages: [],
        createdAt: new Date().toISOString(),
      }
    }
    if (!db.conversations[convId]) {
      db.conversations[convId] = { id: convId, title: '新对话', messages: [], createdAt: new Date().toISOString() }
    }
    const conv = db.conversations[convId]

    // 保存用户消息
    conv.messages.push({
      id: genId(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    })

    const systemPrompt = useSuperBrain
      ? buildSuperPrompt()
      : '你是HopeAgent Pro，一个专业的AI助手。使用中文回答。'

    const history = conv.messages.slice(-10).map(m => ({
      role: m.role,
      content: m.content,
    }))

    let assistantContent = ''

    if (config?.apiKey && config?.enabled) {
      try {
        assistantContent = await streamLLM(
          [{ role: 'system', content: systemPrompt }, ...history],
          config,
          (chunk) => sendSSE(res, { type: 'content', content: chunk })
        )
      } catch (err) {
        assistantContent = `调用失败：${err.message}`
        sendSSE(res, { type: 'content', content: assistantContent })
      }
    } else {
      // 无 API Key，演示模式
      assistantContent = `收到你的消息：「${message}」\n\n请在设置中配置 API Key 以启用 AI 对话。\n\n后端服务运行正常 ✅\n会话ID: ${convId}`
      const chunks = assistantContent.match(/.{1,20}/g) || [assistantContent]
      for (const chunk of chunks) {
        sendSSE(res, { type: 'content', content: chunk })
        await new Promise(r => setTimeout(r, 30))
      }
    }

    // 保存助手消息
    conv.messages.push({
      id: genId(),
      role: 'assistant',
      content: assistantContent,
      timestamp: new Date().toISOString(),
    })
    conv.updatedAt = new Date().toISOString()

    db.stats.totalMessages = (db.stats.totalMessages || 0) + 2
    saveDB(db)

    sendSSE(res, { type: 'done', conversationId: convId })
    res.end()
  },

  // 获取对话列表
  'GET /api/conversations': async (req, res) => {
    const list = Object.values(db.conversations)
      .map(c => ({
        id: c.id,
        title: c.title,
        messageCount: c.messages.length,
        lastMessage: c.messages[c.messages.length - 1]?.content?.slice(0, 50) || '',
        updatedAt: c.updatedAt || c.createdAt,
      }))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

    sendJSON(res, 200, { conversations: list })
  },

  // 获取对话详情
  'GET /api/conversation/:id': async (req, res, params) => {
    const conv = db.conversations[params.id]
    if (!conv) return sendJSON(res, 404, { error: '对话不存在' })
    sendJSON(res, 200, { conversation: conv })
  },

  // 删除对话
  'DELETE /api/conversation/:id': async (req, res, params) => {
    delete db.conversations[params.id]
    saveDB(db)
    sendJSON(res, 200, { success: true })
  },

  // ---- 知识库 ----
  'GET /api/knowledge': async (req, res) => {
    sendJSON(res, 200, { entries: db.knowledge })
  },

  'POST /api/knowledge': async (req, res, body) => {
    const entry = {
      id: genId(),
      ...body,
      createdAt: new Date().toISOString(),
    }
    db.knowledge.push(entry)
    saveDB(db)
    sendJSON(res, 200, { entry })
  },

  'DELETE /api/knowledge/:id': async (req, res, params) => {
    db.knowledge = db.knowledge.filter(k => k.id !== params.id)
    saveDB(db)
    sendJSON(res, 200, { success: true })
  },

  // 搜索知识
  'POST /api/knowledge/search': async (req, res, body) => {
    const { query } = body
    if (!query) return sendJSON(res, 200, { results: [] })

    const q = query.toLowerCase()
    const results = db.knowledge
      .map(e => ({
        entry: e,
        score: (e.title?.toLowerCase().includes(q) ? 5 : 0) +
               (e.tags?.some(t => t.toLowerCase().includes(q)) ? 3 : 0) +
               (e.content?.toLowerCase().includes(q) ? 1 : 0),
      }))
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(s => s.entry)

    sendJSON(res, 200, { results })
  },

  // ---- 设置 ----
  'GET /api/settings': async (req, res) => {
    sendJSON(res, 200, { settings: db.settings })
  },

  'POST /api/settings': async (req, res, body) => {
    db.settings = { ...db.settings, ...body }
    saveDB(db)
    sendJSON(res, 200, { settings: db.settings })
  },

  // ---- 统计 ----
  'GET /api/stats': async (req, res) => {
    sendJSON(res, 200, {
      stats: {
        ...db.stats,
        totalConversations: Object.keys(db.conversations).length,
        totalKnowledge: db.knowledge.length,
      }
    })
  },

  // ---- 健康检查 ----
  'GET /api/health': async (req, res) => {
    sendJSON(res, 200, {
      status: 'ok',
      version: '1.0.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    })
  },
}

// ============ HTTP 服务器 ============
const server = http.createServer(async (req, res) => {
  // CORS 预检
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    })
    return res.end()
  }

  const parsed = url.parse(req.url, true)
  const pathname = parsed.pathname
  const method = req.method

  // 匹配路由
  for (const [route, handler] of Object.entries(routes)) {
    const [rMethod, rPath] = route.split(' ')

    // 处理参数路由
    const paramMatch = rPath.match(/:(\w+)/g)
    let params = {}

    let match = false
    if (paramMatch) {
      const rPathRegex = new RegExp('^' + rPath.replace(/:\w+/g, '([^/]+)') + '$')
      const m = pathname.match(rPathRegex)
      if (m && method === rMethod) {
        paramMatch.forEach((p, i) => {
          params[p.slice(1)] = m[i + 1]
        })
        match = true
      }
    } else if (rPath === pathname && method === rMethod) {
      match = true
    }

    if (match) {
      try {
        const body = method === 'POST' || method === 'PUT' ? await jsonBody(req) : {}
        return await handler(req, res, { ...body, ...params, ...parsed.query })
      } catch (err) {
        console.error(`路由 ${route} 出错:`, err)
        return sendJSON(res, 500, { error: err.message })
      }
    }
  }

  // 404
  sendJSON(res, 404, { error: '接口不存在', path: pathname })
})

server.listen(PORT, () => {
  console.log(`\n🧠 HopeAgent 后端服务已启动`)
  console.log(`📡 地址: http://localhost:${PORT}`)
  console.log(`💡 健康检查: http://localhost:${PORT}/api/health\n`)
})
