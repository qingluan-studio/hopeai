/**
 * HopeAgent Pro 后端服务
 * 轻量级 Node.js API — 对话管理 + LLM代理 + 知识库 + 超级大脑
 */
const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')

// ============ 配置 ============
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

// ============ 超级大脑系统提示词 ============
function buildSuperPrompt() {
  return `你是 HopeAgent 超级大脑，融合23个专业Agent的能力。

## 能力分层
- L1 编排调度：任务拆解、Agent调度、全局协调
- L2 交付执行：前端/后端/全栈开发、代码生成
- L3 数据底座：数据分析、数据库设计、AI工程
- L4 治理安全：安全审计、性能优化、测试质量
- SP 特殊智能：创意设计、文档撰写、翻译

## 工作模式
1. 意图解析：理解用户真实需求
2. 分层激活：根据需要调用不同层级能力
3. 融合输出：综合各层能力产出最优方案

## 约束
- 直接解决问题，不展示内部调度过程
- 你是自包含的完整系统
- 输出结构清晰，重点突出
- 使用中文回答`
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

  // 流式对话
  'POST /api/chat/stream': async (req, res, body) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    })

    const { message, conversationId, config, useSuperBrain } = body
    const systemPrompt = useSuperBrain
      ? buildSuperPrompt()
      : '你是HopeAgent Pro，一个专业的AI助手。使用中文回答。'

    // 模拟流式输出（真实场景可接SSE）
    const llmResult = await callLLM(
      [{ role: 'system', content: systemPrompt }, { role: 'user', content: message }],
      config || { enabled: false }
    )

    const content = llmResult.content || llmResult.fallback
      ? `收到：「${message}」\n\n请在设置中配置API Key。`
      : '调用失败'

    // 分块发送
    const chunks = content.match(/.{1,20}/g) || [content]
    for (const chunk of chunks) {
      sendSSE(res, { type: 'content', content: chunk })
      await new Promise(r => setTimeout(r, 30))
    }
    sendSSE(res, { type: 'done' })
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
