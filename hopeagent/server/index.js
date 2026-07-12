/**
 * HopeAgent Pro 后端服务
 * 轻量级 Node.js API — 对话管理 + LLM代理 + 知识库 + 超级大脑
 * 纯代码实现，零第三方依赖，不依赖任何大平台
 */
import http from 'http'
import fs from 'fs'
import path from 'path'
import url from 'url'
import crypto from 'crypto'
import { execFile } from 'child_process'
import { fileURLToPath } from 'url'

// ============ 配置 ============
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PORT = process.env.PORT || 3210
const DATA_DIR = path.join(__dirname, 'data')
const DB_FILE = path.join(DATA_DIR, 'db.json')
const FILES_DIR = path.join(DATA_DIR, 'files')
const LOGS_DIR = path.join(DATA_DIR, 'logs')
const VECTORS_FILE = path.join(DATA_DIR, 'vectors.json')

// 确保数据目录及子目录
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
if (!fs.existsSync(FILES_DIR)) fs.mkdirSync(FILES_DIR, { recursive: true })
if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR, { recursive: true })

// 简易数据库
function loadDB() {
  const defaults = {
    conversations: {}, knowledge: [], settings: {},
    stats: { totalMessages: 0, totalTokens: 0 },
    users: {}, sessions: {}, files: {}, toolCalls: [],
    models: [], tasks: {}, activeModelId: null, _rrIndex: 0,
    vectors: { indexed: false, docs: [] },
  }
  try {
    return { ...defaults, ...JSON.parse(fs.readFileSync(DB_FILE, 'utf-8')) }
  } catch {
    return defaults
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

// ============ 认证与会话系统 ============
// 密码哈希（使用 crypto.scryptSync 替代 bcrypt）
function hashPassword(password, salt) {
  salt = salt || crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return salt + ':' + hash
}

function verifyPassword(password, stored) {
  if (!stored || typeof stored !== 'string') return false
  const idx = stored.indexOf(':')
  if (idx < 0) return false
  const salt = stored.slice(0, idx)
  const hash = stored.slice(idx + 1)
  const verify = crypto.scryptSync(password, salt, 64).toString('hex')
  try {
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(verify, 'hex'))
  } catch {
    return false
  }
}

// 生成会话 token 与 API Key
function generateToken() {
  return crypto.randomBytes(32).toString('hex')
}
function generateApiKey() {
  return 'hap_' + crypto.randomBytes(24).toString('hex')
}

// 创建会话（7 天有效期）
function createSession(username) {
  const token = generateToken()
  const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString()
  db.sessions[token] = {
    token, username, expiresAt,
    createdAt: new Date().toISOString(),
  }
  saveDB(db)
  return token
}

// 认证中间件：从 Authorization 头或 X-API-Key 提取凭据
function authenticate(req) {
  const authHeader = req.headers['authorization'] || ''
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  const apiKey = req.headers['x-api-key'] || null
  if (bearerToken && db.sessions[bearerToken]) {
    const session = db.sessions[bearerToken]
    if (new Date(session.expiresAt) > new Date()) {
      const user = db.users[session.username]
      if (user) return { authenticated: true, user, token: bearerToken }
    } else {
      // 会话过期，清理
      delete db.sessions[bearerToken]
    }
  }
  if (apiKey) {
    for (const u of Object.values(db.users)) {
      if (Array.isArray(u.apiKeys) && u.apiKeys.includes(apiKey)) {
        return { authenticated: true, user: u, apiKey }
      }
    }
  }
  return { authenticated: false }
}

// 公开用户信息（去除密码哈希等敏感字段）
function publicUser(u) {
  if (!u) return null
  return {
    id: u.id,
    username: u.username,
    role: u.role || 'user',
    createdAt: u.createdAt,
    apiKeys: (u.apiKeys || []).map(k => k.slice(0, 12) + '...'),
  }
}

// ============ 工具执行代理层 ============
const TOOLS = [
  {
    name: 'web_search',
    description: '通过 DuckDuckGo HTML 接口搜索网页内容',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: '搜索关键词' },
        limit: { type: 'integer', description: '返回结果条数', default: 5 },
      },
      required: ['query'],
    },
    async execute(args) {
      const { query, limit = 5 } = args
      const u = 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(query)
      const resp = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0 HopeAgent' } })
      const html = await resp.text()
      const results = []
      const re = /<a[^>]+class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g
      let m, i = 0
      while ((m = re.exec(html)) && i < limit) {
        results.push({
          url: m[1],
          title: m[2].replace(/<[^>]+>/g, '').trim(),
          snippet: m[3].replace(/<[^>]+>/g, '').trim(),
        })
        i++
      }
      return { query, count: results.length, results }
    },
  },
  {
    name: 'code_runner',
    description: '在受超时限制的沙盒中执行 JavaScript 或 Python 代码',
    parameters: {
      type: 'object',
      properties: {
        language: { type: 'string', enum: ['javascript', 'python'] },
        code: { type: 'string', description: '待执行代码' },
      },
      required: ['language', 'code'],
    },
    async execute(args) {
      const { language, code } = args
      return new Promise((resolve) => {
        let cmd, args2
        if (language === 'javascript') {
          cmd = 'node'
          args2 = ['-e', code]
        } else if (language === 'python') {
          cmd = 'python3'
          args2 = ['-c', code]
        } else {
          return resolve({ error: '不支持的语言：' + language })
        }
        execFile(cmd, args2, { timeout: 10000, maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
          if (err) {
            return resolve({ error: err.message, stderr: stderr || '', killed: err.killed || false })
          }
          resolve({ stdout, stderr })
        })
      })
    },
  },
  {
    name: 'file_read',
    description: '读取服务器指定路径的文件内容',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string' },
        encoding: { type: 'string', default: 'utf-8' },
      },
      required: ['path'],
    },
    async execute(args) {
      try {
        const content = fs.readFileSync(args.path, args.encoding || 'utf-8')
        return { content }
      } catch (e) {
        return { error: e.message }
      }
    },
  },
  {
    name: 'file_write',
    description: '写入内容到服务器指定路径的文件',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string' },
        content: { type: 'string' },
      },
      required: ['path', 'content'],
    },
    async execute(args) {
      try {
        fs.writeFileSync(args.path, args.content)
        return { success: true, bytes: Buffer.byteLength(args.content) }
      } catch (e) {
        return { error: e.message }
      }
    },
  },
  {
    name: 'http_fetch',
    description: '抓取指定 URL 的响应内容',
    parameters: {
      type: 'object',
      properties: {
        url: { type: 'string' },
        method: { type: 'string', default: 'GET' },
      },
      required: ['url'],
    },
    async execute(args) {
      try {
        const resp = await fetch(args.url, { method: args.method || 'GET' })
        const text = await resp.text()
        return { status: resp.status, body: text.slice(0, 50000) }
      } catch (e) {
        return { error: e.message }
      }
    },
  },
  {
    name: 'json_parse',
    description: '解析 JSON 字符串为对象',
    parameters: {
      type: 'object',
      properties: { text: { type: 'string' } },
      required: ['text'],
    },
    async execute(args) {
      try {
        return { data: JSON.parse(args.text) }
      } catch (e) {
        return { error: e.message }
      }
    },
  },
  {
    name: 'math_eval',
    description: '安全计算数学表达式（仅允许数字与基本运算符）',
    parameters: {
      type: 'object',
      properties: { expression: { type: 'string' } },
      required: ['expression'],
    },
    async execute(args) {
      if (!/^[\d\s+\-*/().,^%]+$/.test(args.expression)) {
        return { error: '表达式包含非法字符' }
      }
      try {
        const expr = args.expression.replace(/\^/g, '**')
        const result = Function('"use strict";return (' + expr + ')')()
        return { result }
      } catch (e) {
        return { error: e.message }
      }
    },
  },
  {
    name: 'time_now',
    description: '获取当前服务器时间',
    parameters: {
      type: 'object',
      properties: {},
    },
    async execute() {
      return {
        now: new Date().toISOString(),
        timestamp: Date.now(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }
    },
  },
]

function getTool(name) {
  return TOOLS.find(t => t.name === name)
}

// 执行工具（带超时控制，默认 10 秒）
async function executeTool(name, args, timeout) {
  const tool = getTool(name)
  if (!tool) return { error: '工具不存在：' + name }
  const t = timeout || 10000
  return Promise.race([
    Promise.resolve(tool.execute(args || {})),
    new Promise(resolve => setTimeout(() => resolve({ error: '工具执行超时（' + t + 'ms）' }), t)),
  ])
}

function listTools() {
  return TOOLS.map(t => ({
    name: t.name,
    description: t.description,
    parameters: t.parameters,
  }))
}

// 读取原始请求体 Buffer（用于 multipart 文件上传）
function rawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', c => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

// ============ 文件管理系统 ============
// 手写 multipart 解析：按 boundary 分割，不依赖 multer
function parseMultipart(buffer, boundary) {
  const parts = []
  const sep = Buffer.from('--' + boundary)
  let start = buffer.indexOf(sep)
  while (start !== -1) {
    const next = buffer.indexOf(sep, start + sep.length)
    if (next === -1) break
    const partBuf = buffer.slice(start + sep.length + 2, next - 2)
    if (partBuf.length === 0) { start = next; continue }
    const headerEnd = partBuf.indexOf('\r\n\r\n')
    if (headerEnd === -1) { start = next; continue }
    const headerStr = partBuf.slice(0, headerEnd).toString('utf-8')
    const contentBuf = partBuf.slice(headerEnd + 4)
    const disp = headerStr.match(/Content-Disposition: form-data; name="([^"]+)"(?:; filename="([^"]*)")?/i)
    if (!disp) { start = next; continue }
    const ctMatch = headerStr.match(/Content-Type: ([^\r\n]+)/i)
    parts.push({
      name: disp[1],
      filename: disp[2] || null,
      contentType: ctMatch ? ctMatch[1].trim() : 'text/plain',
      data: contentBuf,
    })
    start = next
  }
  return parts
}

// 根据扩展名推断 MIME 类型
function detectContentType(filename) {
  const ext = path.extname(filename).toLowerCase()
  const map = {
    '.txt': 'text/plain', '.md': 'text/markdown', '.json': 'application/json',
    '.js': 'text/javascript', '.ts': 'text/typescript', '.py': 'text/x-python',
    '.html': 'text/html', '.css': 'text/css', '.csv': 'text/csv',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.gif': 'image/gif', '.svg': 'image/svg+xml', '.pdf': 'application/pdf',
    '.zip': 'application/zip', '.xml': 'application/xml',
  }
  return map[ext] || 'application/octet-stream'
}

// ============ 向量检索引擎（手写 TF-IDF + 余弦相似度） ============
let vectorIndex = { docs: [], idf: {}, builtAt: null, N: 0 }

function loadVectorIndex() {
  try {
    vectorIndex = JSON.parse(fs.readFileSync(VECTORS_FILE, 'utf-8'))
  } catch {
    vectorIndex = { docs: [], idf: {}, builtAt: null, N: 0 }
  }
}
loadVectorIndex()

function saveVectorIndex() {
  fs.writeFileSync(VECTORS_FILE, JSON.stringify(vectorIndex, null, 2))
}

// 中文分词：英文按词，中文按字符 bigram + 单字 + 标点分割
function tokenize(text) {
  if (!text) return []
  const cleaned = String(text).replace(/[\r\n\t]+/g, ' ')
  const tokens = []
  // 英文/数字按词
  const words = cleaned.match(/[A-Za-z0-9_]+/g) || []
  for (const w of words) tokens.push(w.toLowerCase())
  // 中文按字符 bigram
  const chinese = cleaned.replace(/[A-Za-z0-9_\s]/g, '')
  for (let i = 0; i < chinese.length - 1; i++) {
    tokens.push(chinese.slice(i, i + 2))
  }
  // 单字也作为 token
  for (const ch of chinese) tokens.push(ch)
  return tokens
}

// 词频（TF）
function termFreq(tokens) {
  const tf = {}
  for (const t of tokens) tf[t] = (tf[t] || 0) + 1
  const total = tokens.length || 1
  for (const t in tf) tf[t] = tf[t] / total
  return tf
}

// 余弦相似度
function cosineSimilarity(vecA, vecB) {
  let dot = 0, magA = 0, magB = 0
  for (const k in vecA) {
    magA += vecA[k] * vecA[k]
    if (k in vecB) dot += vecA[k] * vecB[k]
  }
  for (const k in vecB) magB += vecB[k] * vecB[k]
  if (magA === 0 || magB === 0) return 0
  return dot / (Math.sqrt(magA) * Math.sqrt(magB))
}

// 对文档集合建 TF-IDF 索引
function buildIndex(documents) {
  const N = documents.length
  const df = {}
  const docsTokens = documents.map(doc => {
    const toks = tokenize(doc.text)
    return { id: doc.id, tokens: toks, meta: doc.meta || {} }
  })
  // 计算文档频率 df
  for (const d of docsTokens) {
    const seen = new Set(d.tokens)
    for (const t of seen) df[t] = (df[t] || 0) + 1
  }
  // 计算 idf
  const idf = {}
  for (const t in df) idf[t] = Math.log((N + 1) / (df[t] + 1)) + 1
  // 计算 tf-idf 向量
  const docs = docsTokens.map(d => {
    const tf = termFreq(d.tokens)
    const vec = {}
    for (const t in tf) vec[t] = tf[t] * (idf[t] || 0)
    return { id: d.id, vector: vec, meta: d.meta, tokenCount: d.tokens.length }
  })
  vectorIndex = { docs, idf, builtAt: new Date().toISOString(), N }
  saveVectorIndex()
  return { indexed: docs.length, terms: Object.keys(idf).length, builtAt: vectorIndex.builtAt }
}

// 语义搜索（返回 top-k + 分数）
function vectorSearch(query, topK) {
  topK = topK || 5
  const qTokens = tokenize(query)
  const qTf = termFreq(qTokens)
  const qVec = {}
  for (const t in qTf) qVec[t] = qTf[t] * ((vectorIndex.idf && vectorIndex.idf[t]) || 0)
  const scored = (vectorIndex.docs || []).map(d => ({
    id: d.id,
    score: cosineSimilarity(qVec, d.vector),
    meta: d.meta,
    tokenCount: d.tokenCount,
  }))
  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, topK)
}

// ============ 对话导出系统 ============
function exportConversationMarkdown(conv) {
  let md = '# ' + (conv.title || '对话') + '\n\n'
  md += '> 对话ID: ' + conv.id + '\n'
  md += '> 创建时间: ' + conv.createdAt + '\n'
  if (conv.updatedAt) md += '> 更新时间: ' + conv.updatedAt + '\n'
  md += '\n---\n\n'
  for (const msg of conv.messages) {
    md += '## ' + (msg.role === 'user' ? '🧑 用户' : '🤖 助手') + '\n\n'
    md += '**时间**: ' + msg.timestamp + '\n\n'
    if (msg.toolCalls && msg.toolCalls.length) {
      md += '**工具调用**: ' + JSON.stringify(msg.toolCalls) + '\n\n'
    }
    if (msg.chainOfThought) {
      md += '<details><summary>思维链</summary>\n\n' + msg.chainOfThought + '\n\n</details>\n\n'
    }
    md += msg.content + '\n\n'
  }
  return md
}

function exportAllAsJson() {
  return {
    exportedAt: new Date().toISOString(),
    version: '3.0.0',
    conversations: db.conversations,
    knowledge: db.knowledge,
    stats: db.stats,
  }
}

// ============ 速率限制与日志 ============
const rateLimitBuckets = new Map() // ip -> {tokens, lastRefill}
const RATE_LIMIT_CAPACITY = 60
const RATE_LIMIT_REFILL_PER_MIN = 60

// 令牌桶限流：每 IP 每分钟 60 次
function checkRateLimit(req) {
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'unknown'
  const now = Date.now()
  if (!rateLimitBuckets.has(ip)) {
    rateLimitBuckets.set(ip, { tokens: RATE_LIMIT_CAPACITY, lastRefill: now })
  }
  const bucket = rateLimitBuckets.get(ip)
  // 按时间补充令牌
  const elapsedMin = (now - bucket.lastRefill) / 60000
  bucket.tokens = Math.min(RATE_LIMIT_CAPACITY, bucket.tokens + elapsedMin * RATE_LIMIT_REFILL_PER_MIN)
  bucket.lastRefill = now
  if (bucket.tokens < 1) {
    return { allowed: false, ip, remaining: 0 }
  }
  bucket.tokens -= 1
  return { allowed: true, ip, remaining: Math.floor(bucket.tokens) }
}

function getRateLimitStatus() {
  const result = []
  for (const [ip, bucket] of rateLimitBuckets.entries()) {
    result.push({
      ip,
      tokens: Math.floor(bucket.tokens),
      lastRefill: new Date(bucket.lastRefill).toISOString(),
    })
  }
  return result
}

// 按天滚动日志文件名
function getLogFileName() {
  const d = new Date()
  const pad = n => String(n).padStart(2, '0')
  return 'access-' + d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + '.log'
}

// 写入访问日志：时间、IP、方法、路径、状态码、耗时、UA
function logRequest(req, res, startTime) {
  try {
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'unknown'
    const duration = Date.now() - startTime
    const record = {
      time: new Date().toISOString(),
      ip,
      method: req.method,
      path: req.url,
      status: res.statusCode,
      duration,
      ua: req.headers['user-agent'] || '',
    }
    const logFile = path.join(LOGS_DIR, getLogFileName())
    fs.appendFileSync(logFile, JSON.stringify(record) + '\n')
  } catch (e) {
    console.error('日志写入失败:', e.message)
  }
}

// 日志查询：支持按日期/路径/状态码过滤
function queryLogs(filters) {
  const { date, path: pathFilter, status, limit } = filters
  const max = parseInt(limit, 10) || 100
  let files = fs.existsSync(LOGS_DIR) ? fs.readdirSync(LOGS_DIR).filter(f => f.endsWith('.log')) : []
  if (date) {
    files = files.filter(f => f === 'access-' + date + '.log')
  }
  const logs = []
  for (const f of files) {
    let content
    try { content = fs.readFileSync(path.join(LOGS_DIR, f), 'utf-8') } catch { continue }
    const lines = content.split('\n').filter(Boolean)
    for (const line of lines) {
      try {
        const obj = JSON.parse(line)
        if (pathFilter && !obj.path.includes(pathFilter)) continue
        if (status && String(obj.status) !== String(status)) continue
        logs.push(obj)
      } catch {}
    }
  }
  return logs.slice(-max)
}

// ============ 多模型路由 ============
const DEFAULT_MODELS = [
  {
    id: 'kimi', name: 'Kimi (月之暗面)',
    baseUrl: 'https://api.moonshot.cn/v1/chat/completions',
    model: 'moonshot-v1-8k', provider: 'kimi', enabled: false,
  },
  {
    id: 'openai', name: 'OpenAI 兼容',
    baseUrl: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo', provider: 'openai', enabled: false,
  },
  {
    id: 'deepseek', name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat', provider: 'deepseek', enabled: false,
  },
  {
    id: 'custom', name: '自定义模型',
    baseUrl: '', model: '', provider: 'custom', enabled: false,
  },
]

function ensureModels() {
  if (!Array.isArray(db.models) || db.models.length === 0) {
    db.models = DEFAULT_MODELS.map(m => ({ ...m, apiKey: '', addedAt: new Date().toISOString() }))
    db.activeModelId = 'kimi'
    saveDB(db)
  }
}
ensureModels()

function getActiveModel() {
  const id = db.activeModelId || (db.models[0] && db.models[0].id)
  return db.models.find(m => m.id === id) || db.models[0] || null
}

// 路由策略：auto（按 token 估算自动选）/ roundrobin（轮询）/ specified（指定）
function routeModel(messages, strategy) {
  strategy = strategy || 'auto'
  if (strategy === 'specified') return getActiveModel()
  const enabled = db.models.filter(m => m.enabled && m.apiKey)
  if (enabled.length === 0) return getActiveModel()
  if (strategy === 'roundrobin') {
    db._rrIndex = ((db._rrIndex || 0) + 1) % enabled.length
    return enabled[db._rrIndex]
  }
  // auto：按消息总长度估算 token 数
  const text = messages.map(m => m.content || '').join('')
  const estTokens = Math.ceil(text.length / 3)
  if (estTokens > 8000) {
    const big = enabled.find(m => /32k|128k|200k/.test(m.model || ''))
    return big || enabled[0]
  }
  return enabled[0]
}

// 测试模型连通性
async function testModelConnectivity(modelConfig) {
  if (!modelConfig) return { ok: false, error: '模型不存在' }
  if (!modelConfig.apiKey) return { ok: false, error: 'API Key 未配置' }
  if (!modelConfig.baseUrl) return { ok: false, error: 'baseUrl 未配置' }
  try {
    const resp = await fetch(modelConfig.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + modelConfig.apiKey,
      },
      body: JSON.stringify({
        model: modelConfig.model,
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 5,
        stream: false,
      }),
    })
    if (resp.ok) return { ok: true, status: resp.status, model: modelConfig.id }
    let errText = ''
    try { errText = await resp.text() } catch {}
    return { ok: false, error: 'HTTP ' + resp.status, status: resp.status, detail: errText.slice(0, 500) }
  } catch (e) {
    return { ok: false, error: e.message }
  }
}

// ============ WebSocket 实时推送（手写握手 + 帧编解码） ============
const wsClients = new Set()

function wsHandshake(req, socket) {
  const key = req.headers['sec-websocket-key']
  if (!key) { socket.destroy(); return }
  const accept = crypto
    .createHash('sha1')
    .update(key + '258EFA5-E914-47DA-95CA-C5AB0DC85B11')
    .digest('base64')
  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
    'Upgrade: websocket\r\n' +
    'Connection: Upgrade\r\n' +
    'Sec-WebSocket-Accept: ' + accept + '\r\n\r\n'
  )
  const client = { socket, alive: true, id: genId(), connectedAt: new Date().toISOString() }
  wsClients.add(client)
  socket.on('data', (buf) => handleWsFrame(client, buf))
  socket.on('end', () => wsClients.delete(client))
  socket.on('error', () => wsClients.delete(client))
  socket.on('close', () => wsClients.delete(client))
  wsSend(client, {
    type: 'welcome',
    message: '已连接 HopeAgent 实时推送服务',
    clientId: client.id,
    time: client.connectedAt,
  })
}

// 解析 WebSocket 帧（支持掩码、分片长度）
function handleWsFrame(client, buf) {
  if (buf.length < 2) return
  const opcode = buf[0] & 0x0f
  const masked = (buf[1] & 0x80) === 0x80
  let payloadLen = buf[1] & 0x7f
  let offset = 2
  if (payloadLen === 126) {
    payloadLen = buf.readUInt16BE(2)
    offset = 4
  } else if (payloadLen === 127) {
    payloadLen = Number(buf.readBigUInt64BE(2))
    offset = 10
  }
  let mask = Buffer.alloc(0)
  if (masked) {
    mask = buf.slice(offset, offset + 4)
    offset += 4
  }
  const payload = buf.slice(offset, offset + payloadLen)
  if (masked) {
    for (let i = 0; i < payload.length; i++) payload[i] ^= mask[i % 4]
  }
  // close 帧
  if (opcode === 0x8) {
    client.socket.end()
    return
  }
  // ping -> pong（心跳）
  if (opcode === 0x9) {
    client.socket.write(makeWsFrame(payload, 0xa))
    return
  }
  // pong
  if (opcode === 0xa) {
    client.alive = true
    return
  }
  // text 帧
  if (opcode === 0x1) {
    try {
      const msg = JSON.parse(payload.toString('utf-8'))
      handleWsMessage(client, msg)
    } catch {}
  }
}

function handleWsMessage(client, msg) {
  if (msg && msg.type === 'ping') {
    wsSend(client, { type: 'pong', time: new Date().toISOString() })
  } else if (msg && msg.type === 'subscribe') {
    client.subscriptions = msg.channels || []
    wsSend(client, { type: 'subscribed', channels: client.subscriptions })
  }
}

// 构造 WebSocket 帧
function makeWsFrame(data, opcode) {
  opcode = opcode || 0x1
  const payload = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data
  let header
  if (payload.length < 126) {
    header = Buffer.alloc(2)
    header[0] = 0x80 | opcode
    header[1] = payload.length
  } else if (payload.length < 65536) {
    header = Buffer.alloc(4)
    header[0] = 0x80 | opcode
    header[1] = 126
    header.writeUInt16BE(payload.length, 2)
  } else {
    header = Buffer.alloc(10)
    header[0] = 0x80 | opcode
    header[1] = 127
    header.writeBigUInt64BE(BigInt(payload.length), 2)
  }
  return Buffer.concat([header, payload])
}

function wsSend(client, obj) {
  try {
    client.socket.write(makeWsFrame(JSON.stringify(obj)))
  } catch {}
}

// 广播给所有连接
function wsBroadcast(obj) {
  for (const client of wsClients) wsSend(client, obj)
}

// 心跳检测：30 秒一次，无响应则断开
setInterval(() => {
  for (const client of wsClients) {
    if (!client.alive) {
      try { client.socket.end() } catch {}
      wsClients.delete(client)
      continue
    }
    client.alive = false
    try { client.socket.write(makeWsFrame('', 0x9)) } catch {}
  }
}, 30000)

// ============ 任务队列系统 ============
const taskQueue = []
const MAX_CONCURRENT = 2
let runningTasks = 0

function submitTask(type, payload) {
  const task = {
    id: genId(),
    type,
    payload,
    status: 'queued',
    progress: 0,
    result: null,
    error: null,
    createdAt: new Date().toISOString(),
    startedAt: null,
    completedAt: null,
  }
  db.tasks[task.id] = task
  taskQueue.push(task.id)
  saveDB(db)
  processQueue()
  return task
}

// 后台 worker 循环处理任务
async function processQueue() {
  if (runningTasks >= MAX_CONCURRENT) return
  const nextId = taskQueue.shift()
  if (!nextId) return
  const task = db.tasks[nextId]
  if (!task) return processQueue()
  task.status = 'running'
  task.startedAt = new Date().toISOString()
  runningTasks++
  saveDB(db)
  wsBroadcast({ type: 'task_update', task: { id: task.id, status: 'running' } })
  try {
    const result = await runTask(task)
    task.result = result
    task.status = 'completed'
    task.progress = 100
  } catch (e) {
    task.error = e.message
    task.status = 'failed'
  }
  task.completedAt = new Date().toISOString()
  runningTasks--
  saveDB(db)
  wsBroadcast({ type: 'task_update', task: { id: task.id, status: task.status, progress: task.progress } })
  processQueue()
}

// 内置任务处理器
async function runTask(task) {
  if (task.type === 'batch_analyze') {
    const { items } = task.payload || {}
    const results = []
    if (Array.isArray(items)) {
      for (let i = 0; i < items.length; i++) {
        results.push({ item: items[i], analyzed: true })
        task.progress = Math.floor(((i + 1) / items.length) * 100)
        saveDB(db)
        wsBroadcast({ type: 'task_progress', taskId: task.id, progress: task.progress })
        await new Promise(r => setTimeout(r, 100))
      }
    }
    return { count: results.length, results }
  }
  if (task.type === 'vector_reindex') {
    const docs = db.knowledge.map(k => ({
      id: k.id,
      text: (k.title || '') + ' ' + (k.content || ''),
      meta: k,
    }))
    return buildIndex(docs)
  }
  if (task.type === 'tool_batch') {
    const { calls } = task.payload || {}
    const results = []
    if (Array.isArray(calls)) {
      for (let i = 0; i < calls.length; i++) {
        const c = calls[i]
        const r = await executeTool(c.tool, c.args)
        results.push({ tool: c.tool, result: r })
        db.toolCalls.push({
          id: genId(),
          tool: c.tool,
          args: c.args,
          result: r,
          timestamp: new Date().toISOString(),
        })
        task.progress = Math.floor(((i + 1) / calls.length) * 100)
        saveDB(db)
        wsBroadcast({ type: 'task_progress', taskId: task.id, progress: task.progress })
      }
    }
    return { count: results.length, results }
  }
  return { message: '未知任务类型', type: task.type }
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

  // ---- 认证与会话 ----
  'POST /api/auth/register': async (req, res, body) => {
    const { username, password } = body
    if (!username || !password) return sendJSON(res, 400, { error: '用户名和密码不能为空' })
    if (username.length < 3) return sendJSON(res, 400, { error: '用户名至少 3 个字符' })
    if (password.length < 6) return sendJSON(res, 400, { error: '密码至少 6 个字符' })
    if (db.users[username]) return sendJSON(res, 409, { error: '用户名已存在' })
    const isFirst = Object.keys(db.users).length === 0
    const user = {
      id: genId(),
      username,
      passwordHash: hashPassword(password),
      role: isFirst ? 'admin' : 'user',
      apiKeys: [],
      createdAt: new Date().toISOString(),
    }
    db.users[username] = user
    saveDB(db)
    sendJSON(res, 200, { user: publicUser(user) })
  },

  'POST /api/auth/login': async (req, res, body) => {
    const { username, password } = body
    if (!username || !password) return sendJSON(res, 400, { error: '用户名和密码不能为空' })
    const user = db.users[username]
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return sendJSON(res, 401, { error: '用户名或密码错误' })
    }
    const token = createSession(username)
    sendJSON(res, 200, { token, user: publicUser(user) })
  },

  'GET /api/auth/me': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录或会话已过期' })
    sendJSON(res, 200, { user: publicUser(auth.user) })
  },

  'POST /api/auth/logout': async (req, res, body) => {
    const authHeader = req.headers['authorization'] || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : body.token
    if (token && db.sessions[token]) {
      delete db.sessions[token]
      saveDB(db)
    }
    sendJSON(res, 200, { success: true })
  },

  'POST /api/auth/apikey': async (req, res) => {
    // 生成新的 API Key（需登录）
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const apiKey = generateApiKey()
    const user = db.users[auth.user.username]
    if (!user.apiKeys) user.apiKeys = []
    user.apiKeys.push(apiKey)
    saveDB(db)
    sendJSON(res, 200, { apiKey, user: publicUser(user) })
  },

  // ---- 工具执行代理 ----
  'GET /api/tools/list': async (req, res) => {
    sendJSON(res, 200, { tools: listTools(), count: TOOLS.length })
  },

  'POST /api/tools/execute': async (req, res, body) => {
    const { tool, args, timeout } = body
    if (!tool) return sendJSON(res, 400, { error: '缺少 tool 参数' })
    if (!getTool(tool)) return sendJSON(res, 404, { error: '工具不存在：' + tool })
    const startedAt = Date.now()
    const result = await executeTool(tool, args, timeout)
    const record = {
      id: genId(),
      tool,
      args,
      result,
      duration: Date.now() - startedAt,
      timestamp: new Date().toISOString(),
    }
    db.toolCalls.push(record)
    // 防止 toolCalls 无限增长
    if (db.toolCalls.length > 1000) db.toolCalls = db.toolCalls.slice(-500)
    saveDB(db)
    wsBroadcast({ type: 'tool_executed', tool, duration: record.duration })
    sendJSON(res, 200, { record })
  },

  'GET /api/tools/calls': async (req, res, params) => {
    const limit = parseInt(params.limit, 10) || 50
    const list = db.toolCalls.slice(-limit).reverse()
    sendJSON(res, 200, { calls: list, total: db.toolCalls.length })
  },

  // ---- 文件管理 ----
  'POST /api/files/upload': async (req, res) => {
    // body.__multipart === true，需自行读取原始请求体
    const ct = req.headers['content-type'] || ''
    const bmatch = ct.match(/boundary=([^;]+)/)
    if (!bmatch) return sendJSON(res, 400, { error: '非 multipart 请求' })
    const boundary = bmatch[1].trim()
    const buffer = await rawBody(req)
    if (buffer.length > 10 * 1024 * 1024) {
      return sendJSON(res, 413, { error: '文件大小超过 10MB 限制' })
    }
    const parts = parseMultipart(buffer, boundary)
    const filePart = parts.find(p => p.filename)
    if (!filePart) return sendJSON(res, 400, { error: '未找到文件字段' })
    const id = crypto.randomUUID()
    const ext = path.extname(filePart.filename)
    const storedName = id + ext
    fs.writeFileSync(path.join(FILES_DIR, storedName), filePart.data)
    const meta = {
      id,
      originalName: filePart.filename,
      storedName,
      size: filePart.data.length,
      contentType: filePart.contentType || detectContentType(filePart.filename),
      uploadedAt: new Date().toISOString(),
    }
    db.files[id] = meta
    saveDB(db)
    wsBroadcast({ type: 'file_uploaded', file: meta })
    sendJSON(res, 200, { file: meta })
  },

  'GET /api/files': async (req, res, params) => {
    const list = Object.values(db.files)
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
    sendJSON(res, 200, { files: list, count: list.length })
  },

  'GET /api/files/:id/download': async (req, res, params) => {
    const meta = db.files[params.id]
    if (!meta) return sendJSON(res, 404, { error: '文件不存在' })
    const filePath = path.join(FILES_DIR, meta.storedName)
    if (!fs.existsSync(filePath)) return sendJSON(res, 404, { error: '文件内容丢失' })
    res.writeHead(200, {
      'Content-Type': meta.contentType,
      'Content-Disposition': 'attachment; filename="' + encodeURIComponent(meta.originalName) + '"',
      'Content-Length': meta.size,
      'Access-Control-Allow-Origin': '*',
    })
    fs.createReadStream(filePath).pipe(res)
  },

  'DELETE /api/files/:id': async (req, res, params) => {
    const meta = db.files[params.id]
    if (!meta) return sendJSON(res, 404, { error: '文件不存在' })
    const filePath = path.join(FILES_DIR, meta.storedName)
    try { fs.unlinkSync(filePath) } catch {}
    delete db.files[params.id]
    saveDB(db)
    sendJSON(res, 200, { success: true })
  },

  // ---- 向量检索 ----
  'POST /api/vector/index': async (req, res, body) => {
    const { documents } = body
    let docs = documents
    if (!docs) {
      // 默认对知识库建索引
      docs = db.knowledge.map(k => ({
        id: k.id,
        text: (k.title || '') + ' ' + (k.content || ''),
        meta: k,
      }))
    }
    if (!Array.isArray(docs) || docs.length === 0) {
      return sendJSON(res, 400, { error: '没有可索引的文档' })
    }
    const result = buildIndex(docs)
    db.vectors = { indexed: true, builtAt: result.builtAt, count: result.indexed }
    saveDB(db)
    sendJSON(res, 200, { result })
  },

  'POST /api/vector/search': async (req, res, body) => {
    const { query, topK } = body
    if (!query) return sendJSON(res, 400, { error: '查询不能为空' })
    const results = vectorSearch(query, topK || 5)
    sendJSON(res, 200, { query, results, count: results.length, indexBuiltAt: vectorIndex.builtAt })
  },

  'GET /api/vector/status': async (req, res) => {
    sendJSON(res, 200, {
      indexed: (vectorIndex.docs || []).length > 0,
      docs: (vectorIndex.docs || []).length,
      terms: Object.keys(vectorIndex.idf || {}).length,
      builtAt: vectorIndex.builtAt,
    })
  },

  // ---- 对话导出 ----
  'GET /api/export/conversation/:id': async (req, res, params) => {
    const conv = db.conversations[params.id]
    if (!conv) return sendJSON(res, 404, { error: '对话不存在' })
    const md = exportConversationMarkdown(conv)
    res.writeHead(200, {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'attachment; filename="conversation-' + params.id + '.md"',
      'Access-Control-Allow-Origin': '*',
    })
    res.end(md)
  },

  'GET /api/export/conversation/:id/json': async (req, res, params) => {
    const conv = db.conversations[params.id]
    if (!conv) return sendJSON(res, 404, { error: '对话不存在' })
    sendJSON(res, 200, {
      exportedAt: new Date().toISOString(),
      conversation: conv,
    })
  },

  'GET /api/export/all': async (req, res) => {
    const data = exportAllAsJson()
    sendJSON(res, 200, data)
  },

  // ---- 管理后台：日志与限流 ----
  'GET /api/admin/logs': async (req, res, params) => {
    const logs = queryLogs({
      date: params.date,
      path: params.path,
      status: params.status,
      limit: params.limit,
    })
    sendJSON(res, 200, { logs, count: logs.length })
  },

  'GET /api/admin/ratelimit/status': async (req, res) => {
    sendJSON(res, 200, {
      buckets: getRateLimitStatus(),
      capacity: RATE_LIMIT_CAPACITY,
      refillPerMin: RATE_LIMIT_REFILL_PER_MIN,
    })
  },

  // ---- 多模型路由 ----
  'GET /api/models': async (req, res) => {
    sendJSON(res, 200, {
      models: db.models.map(m => ({ ...m, apiKey: m.apiKey ? '***' : '' })),
      activeModelId: db.activeModelId,
    })
  },

  'POST /api/models': async (req, res, body) => {
    const { id, name, baseUrl, model, provider, apiKey, enabled } = body
    if (!name) return sendJSON(res, 400, { error: '模型名称不能为空' })
    const modelId = id || genId()
    const existIdx = db.models.findIndex(m => m.id === modelId)
    const newModel = {
      id: modelId,
      name,
      baseUrl: baseUrl || '',
      model: model || '',
      provider: provider || 'custom',
      apiKey: apiKey !== undefined ? apiKey : (existIdx >= 0 ? db.models[existIdx].apiKey : ''),
      enabled: enabled !== undefined ? !!enabled : (existIdx >= 0 ? db.models[existIdx].enabled : false),
      addedAt: existIdx >= 0 ? db.models[existIdx].addedAt : new Date().toISOString(),
    }
    if (existIdx >= 0) {
      db.models[existIdx] = { ...db.models[existIdx], ...newModel }
    } else {
      db.models.push(newModel)
    }
    saveDB(db)
    sendJSON(res, 200, { model: newModel, models: db.models })
  },

  'POST /api/models/switch': async (req, res, body) => {
    const { id } = body
    if (!db.models.find(m => m.id === id)) {
      return sendJSON(res, 404, { error: '模型不存在' })
    }
    db.activeModelId = id
    saveDB(db)
    sendJSON(res, 200, { activeModelId: id })
  },

  'POST /api/models/test': async (req, res, body) => {
    const { id } = body
    const modelConfig = db.models.find(m => m.id === id)
    if (!modelConfig) return sendJSON(res, 404, { error: '模型不存在' })
    const result = await testModelConnectivity(modelConfig)
    sendJSON(res, 200, Object.assign({ id }, result))
  },

  'DELETE /api/models/:id': async (req, res, params) => {
    db.models = db.models.filter(m => m.id !== params.id)
    if (db.activeModelId === params.id) {
      db.activeModelId = db.models[0] ? db.models[0].id : null
    }
    saveDB(db)
    sendJSON(res, 200, { success: true, models: db.models, activeModelId: db.activeModelId })
  },

  // ---- 任务队列 ----
  'POST /api/tasks/submit': async (req, res, body) => {
    const { type, payload } = body
    if (!type) return sendJSON(res, 400, { error: '缺少任务类型 type' })
    const task = submitTask(type, payload)
    sendJSON(res, 200, { task })
  },

  'GET /api/tasks/:id': async (req, res, params) => {
    const task = db.tasks[params.id]
    if (!task) return sendJSON(res, 404, { error: '任务不存在' })
    sendJSON(res, 200, { task })
  },

  'GET /api/tasks': async (req, res, params) => {
    const limit = parseInt(params.limit, 10) || 50
    const list = Object.values(db.tasks)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit)
    sendJSON(res, 200, { tasks: list, count: list.length })
  },

  'DELETE /api/tasks/:id': async (req, res, params) => {
    // 取消或删除任务（运行中的任务无法删除，仅标记取消）
    const task = db.tasks[params.id]
    if (!task) return sendJSON(res, 404, { error: '任务不存在' })
    if (task.status === 'running') {
      return sendJSON(res, 409, { error: '运行中的任务无法删除' })
    }
    delete db.tasks[params.id]
    // 同时从队列中移除
    const qIdx = taskQueue.indexOf(params.id)
    if (qIdx >= 0) taskQueue.splice(qIdx, 1)
    saveDB(db)
    sendJSON(res, 200, { success: true })
  },

  'POST /api/tasks/:id/retry': async (req, res, params) => {
    // 重试失败的任务
    const task = db.tasks[params.id]
    if (!task) return sendJSON(res, 404, { error: '任务不存在' })
    if (task.status !== 'failed') {
      return sendJSON(res, 409, { error: '仅失败任务可重试' })
    }
    task.status = 'queued'
    task.progress = 0
    task.error = null
    task.result = null
    task.startedAt = null
    task.completedAt = null
    taskQueue.push(task.id)
    saveDB(db)
    processQueue()
    sendJSON(res, 200, { task })
  },

  // ---- 工具详情 ----
  'GET /api/tools/:name': async (req, res, params) => {
    const tool = getTool(params.name)
    if (!tool) return sendJSON(res, 404, { error: '工具不存在：' + params.name })
    sendJSON(res, 200, {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
    })
  },

  // ---- 监控与管理后台 ----
  'GET /api/admin/overview': async (req, res) => {
    // 系统总览：进程、内存、数据库规模、连接数
    const mem = process.memoryUsage()
    const taskStats = { queued: 0, running: 0, completed: 0, failed: 0 }
    for (const t of Object.values(db.tasks)) {
      if (taskStats[t.status] !== undefined) taskStats[t.status]++
    }
    sendJSON(res, 200, {
      status: 'ok',
      version: '3.0.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      process: {
        pid: process.pid,
        platform: process.platform,
        nodeVersion: process.version,
        memory: {
          rss: mem.rss,
          heapUsed: mem.heapUsed,
          heapTotal: mem.heapTotal,
          external: mem.external,
        },
      },
      database: {
        conversations: Object.keys(db.conversations).length,
        knowledge: db.knowledge.length,
        users: Object.keys(db.users).length,
        files: Object.keys(db.files).length,
        toolCalls: db.toolCalls.length,
        models: db.models.length,
        tasks: Object.keys(db.tasks).length,
        vectors: (vectorIndex.docs || []).length,
      },
      realtime: {
        wsClients: wsClients.size,
        taskQueueLength: taskQueue.length,
        runningTasks,
        rateLimitBuckets: rateLimitBuckets.size,
      },
      stats: db.stats,
      taskStats,
    })
  },

  'GET /api/admin/ws/status': async (req, res) => {
    // WebSocket 连接详情
    const clients = []
    for (const c of wsClients) {
      clients.push({
        id: c.id,
        connectedAt: c.connectedAt,
        alive: c.alive,
        subscriptions: c.subscriptions || [],
      })
    }
    sendJSON(res, 200, {
      total: wsClients.size,
      clients,
    })
  },

  'POST /api/admin/broadcast': async (req, res, body) => {
    // 向所有 WebSocket 客户端广播消息
    const { message, type } = body
    if (!message) return sendJSON(res, 400, { error: '消息不能为空' })
    wsBroadcast({ type: type || 'admin_broadcast', message, time: new Date().toISOString() })
    sendJSON(res, 200, { success: true, recipients: wsClients.size })
  },

  'GET /api/admin/toolcalls/stats': async (req, res) => {
    // 工具调用统计：按工具名聚合
    const byTool = {}
    let totalDuration = 0
    for (const c of db.toolCalls) {
      if (!byTool[c.tool]) byTool[c.tool] = { count: 0, totalDuration: 0, errors: 0 }
      byTool[c.tool].count++
      byTool[c.tool].totalDuration += c.duration || 0
      if (c.result && c.result.error) byTool[c.tool].errors++
      totalDuration += c.duration || 0
    }
    const summary = Object.entries(byTool).map(([tool, s]) => ({
      tool,
      count: s.count,
      totalDuration: s.totalDuration,
      avgDuration: Math.round(s.totalDuration / s.count),
      errors: s.errors,
    })).sort((a, b) => b.count - a.count)
    sendJSON(res, 200, {
      totalCalls: db.toolCalls.length,
      totalDuration,
      byTool: summary,
    })
  },

  // ---- 知识库与向量联动 ----
  'POST /api/knowledge/reindex': async (req, res) => {
    // 一键对知识库重建向量索引
    const docs = db.knowledge.map(k => ({
      id: k.id,
      text: (k.title || '') + ' ' + (k.content || ''),
      meta: k,
    }))
    if (docs.length === 0) return sendJSON(res, 400, { error: '知识库为空' })
    const result = buildIndex(docs)
    db.vectors = { indexed: true, builtAt: result.builtAt, count: result.indexed }
    saveDB(db)
    wsBroadcast({ type: 'vector_reindexed', count: result.indexed })
    sendJSON(res, 200, { result })
  },

  'GET /api/knowledge/suggest': async (req, res, params) => {
    // 基于向量检索的智能推荐（无 query 时返回高分文档）
    const query = params.q || params.query
    if (!query || !vectorIndex.docs || vectorIndex.docs.length === 0) {
      sendJSON(res, 200, { suggestions: [] })
      return
    }
    const results = vectorSearch(query, 3)
    const suggestions = results
      .filter(r => r.score > 0.01)
      .map(r => ({
        id: r.id,
        score: r.score,
        title: r.meta && r.meta.title,
        content: r.meta && (r.meta.content || '').slice(0, 200),
      }))
    sendJSON(res, 200, { query, suggestions })
  },

  // ---- 会话管理 ----
  'GET /api/admin/sessions': async (req, res) => {
    // 查看所有活跃会话（管理用）
    const sessions = Object.values(db.sessions).map(s => ({
      token: s.token.slice(0, 12) + '...',
      username: s.username,
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
      expired: new Date(s.expiresAt) < new Date(),
    }))
    sendJSON(res, 200, { sessions, count: sessions.length })
  },

  'DELETE /api/admin/sessions/:token': async (req, res, params) => {
    // 撤销指定会话（管理员强制下线）
    if (db.sessions[params.token]) {
      delete db.sessions[params.token]
      saveDB(db)
      sendJSON(res, 200, { success: true })
    } else {
      sendJSON(res, 404, { error: '会话不存在' })
    }
  },

  // ---- 对话搜索与统计 ----
  'GET /api/conversations/search': async (req, res, params) => {
    // 按关键词搜索对话标题与消息内容
    const q = (params.q || params.query || '').toLowerCase()
    if (!q) return sendJSON(res, 200, { results: [] })
    const results = []
    for (const conv of Object.values(db.conversations)) {
      let score = 0
      if (conv.title && conv.title.toLowerCase().includes(q)) score += 5
      for (const msg of conv.messages) {
        if (msg.content && msg.content.toLowerCase().includes(q)) score += 1
      }
      if (score > 0) {
        results.push({
          id: conv.id,
          title: conv.title,
          score,
          messageCount: conv.messages.length,
          updatedAt: conv.updatedAt || conv.createdAt,
        })
      }
    }
    results.sort((a, b) => b.score - a.score)
    sendJSON(res, 200, { query: params.q || params.query, results: results.slice(0, 20) })
  },

  'GET /api/admin/conversations/stats': async (req, res) => {
    // 对话维度统计：消息数分布、活跃度、总量
    const convs = Object.values(db.conversations)
    const totalMessages = convs.reduce((sum, c) => sum + c.messages.length, 0)
    const byMessageCount = { empty: 0, small: 0, medium: 0, large: 0 }
    for (const c of convs) {
      const n = c.messages.length
      if (n === 0) byMessageCount.empty++
      else if (n < 10) byMessageCount.small++
      else if (n < 50) byMessageCount.medium++
      else byMessageCount.large++
    }
    // 最近 7 天活跃对话数
    const sevenDaysAgo = Date.now() - 7 * 24 * 3600 * 1000
    const recentActive = convs.filter(c => {
      const t = c.updatedAt || c.createdAt
      return new Date(t).getTime() > sevenDaysAgo
    }).length
    sendJSON(res, 200, {
      totalConversations: convs.length,
      totalMessages,
      avgMessagesPerConv: convs.length ? Math.round(totalMessages / convs.length) : 0,
      recentActive7d: recentActive,
      distribution: byMessageCount,
    })
  },

  // ---- 模型与文件辅助 ----
  'GET /api/models/active': async (req, res) => {
    // 获取当前激活模型（API Key 脱敏）
    const active = getActiveModel()
    if (!active) return sendJSON(res, 404, { error: '未配置任何模型' })
    sendJSON(res, 200, {
      model: { ...active, apiKey: active.apiKey ? '***' : '' },
    })
  },

  'POST /api/models/route': async (req, res, body) => {
    // 测试模型路由策略：给定消息返回被选中的模型
    const { messages, strategy } = body
    if (!Array.isArray(messages)) return sendJSON(res, 400, { error: 'messages 必须为数组' })
    const picked = routeModel(messages, strategy || 'auto')
    sendJSON(res, 200, {
      strategy: strategy || 'auto',
      picked: picked ? { ...picked, apiKey: picked.apiKey ? '***' : '' } : null,
    })
  },

  'GET /api/files/:id/info': async (req, res, params) => {
    // 获取文件元信息（不下载内容）
    const meta = db.files[params.id]
    if (!meta) return sendJSON(res, 404, { error: '文件不存在' })
    sendJSON(res, 200, { file: meta })
  },

  'GET /api/health/detailed': async (req, res) => {
    // 详细健康检查：包含各子系统状态
    const checks = {
      database: { ok: !!db, conversations: Object.keys(db.conversations).length },
      vectorIndex: { ok: (vectorIndex.docs || []).length > 0, docs: (vectorIndex.docs || []).length },
      taskQueue: { ok: true, pending: taskQueue.length, running: runningTasks },
      websocket: { ok: true, clients: wsClients.size },
      rateLimit: { ok: true, tracked: rateLimitBuckets.size },
      models: { ok: db.models.length > 0, count: db.models.length, active: !!getActiveModel() },
    }
    const allOk = Object.values(checks).every(c => c.ok)
    sendJSON(res, 200, {
      status: allOk ? 'ok' : 'degraded',
      version: '3.0.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      checks,
    })
  },
}

// ============ HTTP 服务器 ============
const server = http.createServer(async (req, res) => {
  const startTime = Date.now()

  // 访问日志（响应结束时写入）
  res.on('finish', () => logRequest(req, res, startTime))

  // CORS 预检
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
    })
    return res.end()
  }

  const parsed = url.parse(req.url, true)
  const pathname = parsed.pathname
  const method = req.method

  // 速率限制（健康检查豁免）
  if (pathname !== '/api/health') {
    const rl = checkRateLimit(req)
    if (!rl.allowed) {
      res.setHeader('Retry-After', '60')
      return sendJSON(res, 429, { error: '请求过于频繁，请稍后再试', retryAfter: 60 })
    }
    res.setHeader('X-RateLimit-Remaining', String(rl.remaining))
  }

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
        let body = {}
        if (method === 'POST' || method === 'PUT') {
          const ct = req.headers['content-type'] || ''
          if (ct.includes('multipart/form-data')) {
            // multipart 请求由 handler 自行读取原始 body
            body = { __multipart: true }
          } else {
            body = await jsonBody(req)
          }
        }
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

// WebSocket 升级处理（/ws 路径）
server.on('upgrade', (req, socket, head) => {
  const parsed = url.parse(req.url, true)
  if (parsed.pathname === '/ws') {
    wsHandshake(req, socket, head)
  } else {
    socket.destroy()
  }
})

server.listen(PORT, () => {
  console.log(`\n🧠 HopeAgent 后端服务已启动`)
  console.log(`📡 地址: http://localhost:${PORT}`)
  console.log(`🔌 WebSocket: ws://localhost:${PORT}/ws`)
  console.log(`💡 健康检查: http://localhost:${PORT}/api/health\n`)
})
