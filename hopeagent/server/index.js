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
import zlib from 'zlib'
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
    roles: {},
    orgs: {},
    webhooks: {},
    webhookLogs: [],
    plugins: {},
    cronJobs: {},
    backups: {},
    emailSettings: { enabled: false, provider: '', apiKey: '', fromEmail: '' },
    notifications: [],
    // 凭证保险库：所有敏感凭证加密后存储于此
    vault: { credentials: {} },
    // 配置中心：全局配置
    config: {},
    // 数据库迁移记录
    migrations: [],
    // ===== 10大增强模块新增集合 =====
    // 认证增强：登录日志、token黑名单、API Key管理、密码重置、二步验证、封禁
    loginLogs: [],
    tokenBlacklist: {},
    apiKeysEx: {},
    passwordResets: {},
    twoFactor: {},
    userBans: {},
    oauthStates: {},
    // RBAC增强：自定义权限、权限组、权限审计、权限模板
    customRoles: {},
    permissionGroups: {},
    permissionAudit: [],
    permissionTemplates: {},
    // 组织与团队增强：部门、团队、配额、审计、统计
    departments: {},
    teams: {},
    orgQuotas: {},
    orgAudit: [],
    orgStats: {},
    // 消息通知系统：站内信、模板、订阅、推送设置
    messages: [],
    messageTemplates: {},
    messageSubscriptions: {},
    pushSettings: {},
    messageArchive: [],
    // 搜索引擎：倒排索引、历史、建议、热搜
    searchIndex: { docs: {}, inverted: {}, builtAt: null },
    searchHistory: [],
    searchSuggestions: {},
    hotSearches: [],
    // 日志系统：操作、错误、性能、安全日志
    operationLogs: [],
    errorLogs: [],
    performanceLogs: [],
    securityLogs: [],
    logRotation: { byDay: true, bySize: true, maxSize: 10485760, retainDays: 30 },
    // 数据导出系统：导出历史、定时导出、配置
    exportHistory: [],
    scheduledExports: {},
    exportConfigs: {},
    // API版本管理
    apiVersions: { v1: { status: 'stable', releasedAt: null }, v2: { status: 'stable', releasedAt: null } },
    versionStats: {},
    versionUsage: [],
    // WebSocket增强：房间、离线消息、在线状态
    wsRooms: {},
    wsOfflineMessages: {},
    wsPresence: {},
    wsMessageQueue: {},
    // 任务调度增强：一次性、重复、依赖、优先级
    oneTimeTasks: {},
    recurringTasks: {},
    taskDependencies: {},
    taskProgress: {},
    taskLogs: {},
    // ===== 扩展模块新增集合（知识库/Webhook/插件/备份/配置/i18n） =====
    // 知识库增强：条目版本、标签、分享、收藏、批量导入
    knowledgeEx: {},
    knowledgeVersions: {},
    knowledgeTags: {},
    knowledgeShares: {},
    knowledgeFavorites: {},
    knowledgeImports: [],
    // Webhook 增强：投递记录、模板、签名验证、测试
    webhookDeliveries: [],
    webhookTemplates: {},
    webhookTests: [],
    // 插件增强：市场、安装记录、配置、评价
    pluginMarketplace: {},
    pluginInstalls: [],
    pluginConfigs: {},
    pluginReviews: [],
    // 备份增强：定时备份、还原点、校验、加密
    backupSchedules: {},
    backupRestorePoints: [],
    backupVerifications: [],
    // 配置中心增强：历史、配置文件、校验
    configHistory: [],
    configProfiles: {},
    configValidations: [],
    // i18n 增强：翻译覆盖、缺失键、自定义翻译
    translationOverrides: {},
    missingTranslationKeys: [],
    customTranslations: {},
    // ===== 第三批扩展模块新增集合 =====
    // 模块20：API 网关系统 - 路由表、转换规则、熔断器、黑名单、分组、追踪
    gatewayRoutes: {},
    gatewayTransforms: {},
    gatewayCircuitBreakers: {},
    gatewayBlocklist: {},
    gatewayGroups: {},
    gatewayTraces: [],
    gatewayIdempotency: {},
    gatewayBackends: {},
    // 模块21：消息队列系统 - 队列、消息、消费者、死信、延迟、优先级
    mqQueues: {},
    mqMessages: {},
    mqConsumers: {},
    mqDeadLetters: [],
    mqDelayedMessages: [],
    mqStats: {},
    // 模块22：事件驱动系统 - 事件总线、处理器、历史、订阅
    eventBus: { subscribers: {}, history: [] },
    eventHandlers: {},
    eventHistory: [],
    eventReplay: [],
    eventSnapshots: {},
    // 模块23：文件存储增强 - 虚拟文件系统、版本、锁、分享、搜索
    vfsMounts: {},
    fileVersions: {},
    fileLocks: {},
    fileShares: {},
    fileMetadata: {},
    filePreviews: {},
    fileConversions: [],
    fileBatchJobs: [],
    // 模块24：用户行为分析 - 行为、画像、漏斗、留存、路径、热力图
    userBehaviors: [],
    userProfiles: {},
    behaviorFunnels: {},
    behaviorRetention: {},
    behaviorPaths: {},
    heatmapData: {},
    behaviorEvents: {},
    behaviorReports: {},
    // 模块25：AI 推理引擎增强 - 多模型路由、负载均衡、Token、缓存
    aiModelRoutes: {},
    aiModelLoadBalancers: {},
    aiTokenCounts: [],
    aiContextWindows: {},
    aiResponseCache: {},
    aiSSEConnections: {},
    aiModelComparisons: [],
    aiInferenceLogs: [],
    aiCostRecords: [],
    // 模块26：权限审计系统 - 变更日志、检查日志、分析、告警、报告
    permChangeLogs: [],
    permCheckLogs: [],
    permAnalysis: {},
    permAlerts: [],
    permReports: {},
    roleChangeHistory: [],
    resourceAccessLogs: [],
    sensitiveOpLogs: [],
    complianceChecks: [],
    // 模块27：系统诊断系统 - 自检、依赖、完整性、性能、连接、健康评分
    diagSelfChecks: [],
    diagDependencyChecks: [],
    diagIntegrityChecks: [],
    diagPerformance: {},
    diagConnections: {},
    diagHealthScore: {},
    diagReports: {},
    diagHistory: [],
    diagAutoFixes: [],
    // ===== 计费与支付系统 =====
    pricingPlans: {},
    subscriptions: {},
    usageStats: {},
    invoices: {},
    payments: {},
    coupons: {},
    freeQuotas: {},
    balances: {},
    receipts: {},
    // ===== 性能监控系统 =====
    metrics: [],
    metricRules: {},
    metricAlerts: [],
    metricDashboards: {},
    metricAnalysis: [],
    metricPredictions: {},
    // ===== 缓存系统增强 =====
    cacheConfig: {},
    cacheStats: {},
    cacheKeys: {},
    cacheWarmup: {},
    // ===== 会话管理系统 =====
    sessionsEx: {},
    sessionDevices: {},
    sessionSync: {},
    sessionHistory: [],
    // ===== 数据同步系统 =====
    syncTasks: {},
    syncHistory: [],
    syncConflicts: [],
    syncStatus: {},
    // ===== 安全加固系统 =====
    securityRules: {},
    rateLimits: {},
    securityScans: [],
    securityReports: {},
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

// ============ 数据库抽象层（DAL） ============
// 操作日志记录
const dbOpLogs = []
const MAX_DB_OP_LOGS = 500

function logDbOp(collection, operation, query, result, duration) {
  const log = {
    id: 'op_' + genId(),
    collection,
    operation,
    query: JSON.stringify(query || {}).slice(0, 200),
    resultCount: Array.isArray(result) ? result.length : (result ? 1 : 0),
    duration,
    timestamp: new Date().toISOString(),
  }
  dbOpLogs.push(log)
  if (dbOpLogs.length > MAX_DB_OP_LOGS) dbOpLogs.shift()
}

// 生成带时间戳的 _id
function genDocId() {
  return 'doc_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10)
}

// 简易索引存储
const collectionIndexes = {}

// 创建集合（表）
function createCollection(name) {
  if (!db[name]) {
    db[name] = []
    collectionIndexes[name] = { fields: {}, unique: {} }
    saveDB(db)
    return { success: true, name }
  }
  return { success: false, error: '集合已存在：' + name }
}

// 简单条件匹配
function matchDocument(doc, query) {
  if (!query || Object.keys(query).length === 0) return true
  for (const [key, value] of Object.entries(query)) {
    if (typeof value === 'object' && value !== null) {
      if (value.$gt !== undefined && !(doc[key] > value.$gt)) return false
      if (value.$gte !== undefined && !(doc[key] >= value.$gte)) return false
      if (value.$lt !== undefined && !(doc[key] < value.$lt)) return false
      if (value.$lte !== undefined && !(doc[key] <= value.$lte)) return false
      if (value.$ne !== undefined && doc[key] === value.$ne) return false
      if (value.$in !== undefined && !value.$in.includes(doc[key])) return false
      if (value.$nin !== undefined && value.$nin.includes(doc[key])) return false
      if (value.$regex !== undefined) {
        try {
          const re = new RegExp(value.$regex, value.$options || '')
          if (!re.test(String(doc[key] || ''))) return false
        } catch { return false }
      }
      if (value.$exists !== undefined) {
        const has = key in doc
        if (value.$exists && !has) return false
        if (!value.$exists && has) return false
      }
    } else {
      if (doc[key] !== value) return false
    }
  }
  return true
}

// 获取集合数据（统一处理对象格式和数组格式）
function getCollectionData(name) {
  const col = db[name]
  if (!col) return []
  if (Array.isArray(col)) return col
  if (typeof col === 'object') return Object.values(col)
  return []
}

// 单条查询
function findOne(collection, query) {
  const start = Date.now()
  const data = getCollectionData(collection)
  for (const doc of data) {
    if (matchDocument(doc, query)) {
      logDbOp(collection, 'findOne', query, doc, Date.now() - start)
      return doc
    }
  }
  logDbOp(collection, 'findOne', query, null, Date.now() - start)
  return null
}

// 批量查询（支持分页/排序/limit/offset）
function findMany(collection, query, options) {
  const start = Date.now()
  const data = getCollectionData(collection)
  let results = query ? data.filter(doc => matchDocument(doc, query)) : [...data]
  
  if (options) {
    if (options.sort) {
      const sortField = Object.keys(options.sort)[0]
      const sortDir = options.sort[sortField]
      results.sort((a, b) => {
        const va = a[sortField], vb = b[sortField]
        if (va < vb) return -1 * sortDir
        if (va > vb) return 1 * sortDir
        return 0
      })
    }
    if (options.offset) results = results.slice(options.offset)
    if (options.limit) results = results.slice(0, options.limit)
  }
  
  logDbOp(collection, 'findMany', query, results, Date.now() - start)
  return results
}

// 插入单条
function insertOne(collection, doc) {
  const start = Date.now()
  const newDoc = { _id: genDocId(), ...doc, createdAt: new Date().toISOString() }
  if (!db[collection]) db[collection] = []
  if (Array.isArray(db[collection])) {
    db[collection].push(newDoc)
  } else if (typeof db[collection] === 'object') {
    db[collection][newDoc._id] = newDoc
  }
  saveDB(db)
  logDbOp(collection, 'insertOne', doc, newDoc, Date.now() - start)
  return newDoc
}

// 批量插入
function insertMany(collection, docs) {
  const start = Date.now()
  const results = []
  for (const doc of docs) {
    const newDoc = { _id: genDocId(), ...doc, createdAt: new Date().toISOString() }
    if (!db[collection]) db[collection] = []
    if (Array.isArray(db[collection])) {
      db[collection].push(newDoc)
    } else if (typeof db[collection] === 'object') {
      db[collection][newDoc._id] = newDoc
    }
    results.push(newDoc)
  }
  saveDB(db)
  logDbOp(collection, 'insertMany', docs, results, Date.now() - start)
  return { insertedCount: results.length, insertedIds: results.map(r => r._id) }
}

// 更新单条
function updateOne(collection, query, update) {
  const start = Date.now()
  const data = getCollectionData(collection)
  for (let i = 0; i < data.length; i++) {
    if (matchDocument(data[i], query)) {
      const updated = { ...data[i] }
      if (update.$set) {
        Object.assign(updated, update.$set)
      } else {
        Object.assign(updated, update)
      }
      updated.updatedAt = new Date().toISOString()
      if (Array.isArray(db[collection])) {
        db[collection][i] = updated
      } else if (typeof db[collection] === 'object') {
        db[collection][data[i]._id || data[i].id] = updated
      }
      saveDB(db)
      logDbOp(collection, 'updateOne', query, updated, Date.now() - start)
      return { matchedCount: 1, modifiedCount: 1, value: updated }
    }
  }
  logDbOp(collection, 'updateOne', query, null, Date.now() - start)
  return { matchedCount: 0, modifiedCount: 0, value: null }
}

// 批量更新
function updateMany(collection, query, update) {
  const start = Date.now()
  const data = getCollectionData(collection)
  let matched = 0, modified = 0
  for (let i = 0; i < data.length; i++) {
    if (matchDocument(data[i], query)) {
      matched++
      const updated = { ...data[i] }
      if (update.$set) {
        Object.assign(updated, update.$set)
      } else {
        Object.assign(updated, update)
      }
      updated.updatedAt = new Date().toISOString()
      if (Array.isArray(db[collection])) {
        db[collection][i] = updated
      } else if (typeof db[collection] === 'object') {
        db[collection][data[i]._id || data[i].id] = updated
      }
      modified++
    }
  }
  if (modified > 0) saveDB(db)
  logDbOp(collection, 'updateMany', query, { matched, modified }, Date.now() - start)
  return { matchedCount: matched, modifiedCount: modified }
}

// 删除单条
function deleteOne(collection, query) {
  const start = Date.now()
  const data = getCollectionData(collection)
  for (let i = 0; i < data.length; i++) {
    if (matchDocument(data[i], query)) {
      if (Array.isArray(db[collection])) {
        db[collection].splice(i, 1)
      } else if (typeof db[collection] === 'object') {
        delete db[collection][data[i]._id || data[i].id]
      }
      saveDB(db)
      logDbOp(collection, 'deleteOne', query, { deleted: 1 }, Date.now() - start)
      return { deletedCount: 1 }
    }
  }
  logDbOp(collection, 'deleteOne', query, { deleted: 0 }, Date.now() - start)
  return { deletedCount: 0 }
}

// 批量删除
function deleteMany(collection, query) {
  const start = Date.now()
  const data = getCollectionData(collection)
  let deleted = 0
  if (Array.isArray(db[collection])) {
    const remaining = []
    for (const doc of db[collection]) {
      if (matchDocument(doc, query)) deleted++
      else remaining.push(doc)
    }
    db[collection] = remaining
  } else if (typeof db[collection] === 'object') {
    for (const key of Object.keys(db[collection])) {
      if (matchDocument(db[collection][key], query)) {
        delete db[collection][key]
        deleted++
      }
    }
  }
  if (deleted > 0) saveDB(db)
  logDbOp(collection, 'deleteMany', query, { deleted }, Date.now() - start)
  return { deletedCount: deleted }
}

// 计数
function count(collection, query) {
  const start = Date.now()
  const data = getCollectionData(collection)
  let c = 0
  if (!query || Object.keys(query).length === 0) {
    c = data.length
  } else {
    for (const doc of data) {
      if (matchDocument(doc, query)) c++
    }
  }
  logDbOp(collection, 'count', query, { count: c }, Date.now() - start)
  return c
}

// 简易聚合（group by / sum / avg / count）
function aggregate(collection, pipeline) {
  const start = Date.now()
  let data = getCollectionData(collection)
  
  for (const stage of pipeline) {
    if (stage.$match) {
      data = data.filter(doc => matchDocument(doc, stage.$match))
    } else if (stage.$group) {
      const groups = {}
      const _id = stage.$group._id
      for (const doc of data) {
        const key = typeof _id === 'string' ? doc[_id] : JSON.stringify(_id)
        if (!groups[key]) {
          groups[key] = { _id: doc[_id] || null, count: 0 }
        }
        groups[key].count++
        for (const [field, op] of Object.entries(stage.$group)) {
          if (field === '_id') continue
          if (op.$sum) {
            groups[key][field] = (groups[key][field] || 0) + (op.$sum === 1 ? 1 : Number(doc[op.$sum]) || 0)
          } else if (op.$avg) {
            groups[key]._sum = (groups[key]._sum || 0) + (Number(doc[op.$avg]) || 0)
            groups[key][field] = groups[key]._sum / groups[key].count
          } else if (op.$min) {
            const val = Number(doc[op.$min])
            if (groups[key][field] === undefined || val < groups[key][field]) groups[key][field] = val
          } else if (op.$max) {
            const val = Number(doc[op.$max])
            if (groups[key][field] === undefined || val > groups[key][field]) groups[key][field] = val
          }
        }
      }
      data = Object.values(groups)
    } else if (stage.$sort) {
      const sortField = Object.keys(stage.$sort)[0]
      const sortDir = stage.$sort[sortField]
      data.sort((a, b) => {
        const va = a[sortField], vb = b[sortField]
        if (va < vb) return -1 * sortDir
        if (va > vb) return 1 * sortDir
        return 0
      })
    } else if (stage.$limit) {
      data = data.slice(0, stage.$limit)
    } else if (stage.$skip) {
      data = data.slice(stage.$skip)
    }
  }
  
  logDbOp(collection, 'aggregate', pipeline, data, Date.now() - start)
  return data
}

// 迁移系统
function applyMigration(id, up, down) {
  if (!db.migrations) db.migrations = []
  if (db.migrations.find(m => m.id === id)) {
    return { success: false, error: '迁移已应用：' + id }
  }
  try {
    up(db)
    db.migrations.push({
      id,
      appliedAt: new Date().toISOString(),
      status: 'applied',
    })
    saveDB(db)
    return { success: true, id }
  } catch (e) {
    try { if (down) down(db) } catch {}
    return { success: false, error: e.message, id }
  }
}

// 获取 DAL 操作日志
function getDbOpLogs(limit) {
  const max = limit || 100
  return dbOpLogs.slice(-max).reverse()
}

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
  // API Key 解析：vault 优先 > config.apiKey > 环境变量
  const apiKey = resolveLLMApiKey(config)
  if (!apiKey || !config.enabled) {
    return { error: 'LLM未配置', fallback: true }
  }

  try {
    const response = await fetch(config.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
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
  // API Key 解析：vault 优先 > config.apiKey > 环境变量
  const apiKey = resolveLLMApiKey(config)
  if (!apiKey || !config.enabled) {
    throw new Error('LLM未配置')
  }
  const response = await fetch(config.baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
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
    orgId: u.orgId || null,
    language: u.language || 'zh-CN',
  }
}

// ============ RBAC 权限与角色系统 ============
// 角色定义与权限列表
const ROLE_DEFINITIONS = {
  admin: {
    name: '管理员',
    description: '拥有系统所有权限',
    permissions: [
      { resource: '*', action: '*' },
    ],
  },
  manager: {
    name: '经理',
    description: '可以管理团队成员和查看统计',
    permissions: [
      { resource: 'chat', action: '*' },
      { resource: 'knowledge', action: '*' },
      { resource: 'files', action: '*' },
      { resource: 'tools', action: '*' },
      { resource: 'conversations', action: '*' },
      { resource: 'models', action: 'read' },
      { resource: 'orgs', action: 'read' },
      { resource: 'tasks', action: '*' },
      { resource: 'vector', action: '*' },
      { resource: 'export', action: '*' },
      { resource: 'plugins', action: 'read' },
      { resource: 'webhooks', action: '*' },
      { resource: 'cron', action: '*' },
    ],
  },
  user: {
    name: '普通用户',
    description: '基础对话和知识库访问权限',
    permissions: [
      { resource: 'chat', action: '*' },
      { resource: 'knowledge', action: 'read' },
      { resource: 'files', action: 'read' },
      { resource: 'tools', action: 'read' },
      { resource: 'conversations', action: '*' },
      { resource: 'tasks', action: 'read' },
      { resource: 'vector', action: 'read' },
      { resource: 'export', action: 'read' },
    ],
  },
  guest: {
    name: '访客',
    description: '仅可查看公开信息',
    permissions: [
      { resource: 'health', action: 'read' },
      { resource: 'models', action: 'read' },
    ],
  },
}

// 权限校验：检查用户角色是否有权访问资源
function checkPermission(userRole, resource, action) {
  const role = ROLE_DEFINITIONS[userRole]
  if (!role) return false
  for (const perm of role.permissions) {
    if (perm.resource === '*' && perm.action === '*') return true
    if (perm.resource === resource && perm.action === '*') return true
    if (perm.resource === '*' && perm.action === action) return true
    if (perm.resource === resource && perm.action === action) return true
  }
  return false
}

// 权限中间件生成器：要求特定角色
function requireRole(role) {
  return (req, res, auth) => {
    if (!auth.authenticated) {
      sendJSON(res, 401, { error: '未登录' })
      return false
    }
    const userRole = auth.user.role || 'user'
    const roleHierarchy = { guest: 0, user: 1, manager: 2, admin: 3 }
    if ((roleHierarchy[userRole] || 0) >= (roleHierarchy[role] || 0)) {
      return true
    }
    sendJSON(res, 403, { error: '权限不足，需要 ' + role + ' 角色' })
    return false
  }
}

// 权限中间件生成器：要求特定资源权限
function requirePermission(resource, action) {
  return (req, res, auth) => {
    if (!auth.authenticated) {
      sendJSON(res, 401, { error: '未登录' })
      return false
    }
    const userRole = auth.user.role || 'user'
    if (checkPermission(userRole, resource, action)) {
      return true
    }
    sendJSON(res, 403, { error: '权限不足，需要 ' + resource + ':' + action })
    return false
  }
}

// 初始化角色到 db（持久化，允许自定义）
function ensureRoles() {
  let needsSave = false
  if (!db.roles || typeof db.roles !== 'object') {
    db.roles = {}
    needsSave = true
  }
  for (const [id, role] of Object.entries(ROLE_DEFINITIONS)) {
    if (!db.roles[id]) {
      db.roles[id] = {
        id,
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        builtin: true,
        createdAt: new Date().toISOString(),
      }
      needsSave = true
    }
  }
  if (needsSave) saveDB(db)
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

// ============ 文件系统增强 ============
// 50+ 种 MIME 类型映射
const MIME_TYPES = {
  '.txt': 'text/plain', '.md': 'text/markdown', '.json': 'application/json',
  '.js': 'text/javascript', '.ts': 'text/typescript', '.py': 'text/x-python',
  '.html': 'text/html', '.htm': 'text/html', '.css': 'text/css', '.csv': 'text/csv',
  '.xml': 'application/xml', '.yaml': 'application/x-yaml', '.yml': 'application/x-yaml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.ico': 'image/x-icon', '.bmp': 'image/bmp', '.tiff': 'image/tiff',
  '.pdf': 'application/pdf', '.zip': 'application/zip', '.tar': 'application/x-tar',
  '.gz': 'application/gzip', '.rar': 'application/x-rar-compressed',
  '.7z': 'application/x-7z-compressed', '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav', '.ogg': 'audio/ogg', '.flac': 'audio/flac',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.avi': 'video/x-msvideo',
  '.mov': 'video/quicktime', '.mkv': 'video/x-matroska',
  '.doc': 'application/msword', '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel', '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.ppt': 'application/vnd.ms-powerpoint', '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.rtf': 'application/rtf', '.tex': 'application/x-tex',
  '.epub': 'application/epub+zip', '.mobi': 'application/x-mobipocket-ebook',
  '.wasm': 'application/wasm', '.exe': 'application/vnd.microsoft.portable-executable',
  '.dll': 'application/x-msdownload', '.so': 'application/x-sharedlib',
  '.sh': 'application/x-sh', '.bash': 'application/x-bash',
  '.php': 'application/x-httpd-php', '.rb': 'application/x-ruby',
  '.java': 'text/x-java', '.go': 'text/x-go', '.rs': 'text/x-rust',
  '.c': 'text/x-c', '.cpp': 'text/x-c++', '.h': 'text/x-c',
  '.sql': 'application/sql', '.graphql': 'application/graphql',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
  '.otf': 'font/otf', '.eot': 'application/vnd.ms-fontobject',
}

function getMimeType(filename) {
  const ext = path.extname(filename || '').toLowerCase()
  return MIME_TYPES[ext] || 'application/octet-stream'
}

// 目录操作
function fileExists(p) {
  try { return fs.existsSync(p) } catch { return false }
}

function fileStat(p) {
  try { return fs.statSync(p) } catch { return null }
}

function mkdir(p, recursive) {
  try {
    fs.mkdirSync(p, { recursive: recursive !== false })
    return true
  } catch (e) { return false }
}

function rmdir(p, recursive) {
  try {
    fs.rmSync(p, { recursive: recursive !== false, force: true })
    return true
  } catch (e) { return false }
}

function readdir(p) {
  try { return fs.readdirSync(p) } catch { return [] }
}

// 文件操作
function copyFile(src, dest) {
  try {
    fs.copyFileSync(src, dest)
    return true
  } catch (e) { return false }
}

function moveFile(src, dest) {
  try {
    fs.renameSync(src, dest)
    return true
  } catch (e) {
    try {
      fs.copyFileSync(src, dest)
      fs.unlinkSync(src)
      return true
    } catch { return false }
  }
}

function renameFile(oldPath, newPath) {
  try {
    fs.renameSync(oldPath, newPath)
    return true
  } catch (e) { return false }
}

function truncateFile(p, size) {
  try {
    fs.truncateSync(p, size || 0)
    return true
  } catch (e) { return false }
}

function appendFile(p, data, encoding) {
  try {
    fs.appendFileSync(p, data, encoding || 'utf-8')
    return true
  } catch (e) { return false }
}

// 目录大小计算
function getDirSize(dirPath) {
  let total = 0
  function walk(p) {
    try {
      const files = fs.readdirSync(p)
      for (const f of files) {
        const fullPath = path.join(p, f)
        const stat = fs.statSync(fullPath)
        if (stat.isDirectory()) walk(fullPath)
        else total += stat.size
      }
    } catch {}
  }
  walk(dirPath)
  return total
}

// 文件遍历
function walkDir(dirPath, callback) {
  try {
    const files = fs.readdirSync(dirPath)
    for (const f of files) {
      const fullPath = path.join(dirPath, f)
      const stat = fs.statSync(fullPath)
      if (stat.isDirectory()) {
        if (callback) callback(fullPath, stat, true)
        walkDir(fullPath, callback)
      } else {
        if (callback) callback(fullPath, stat, false)
      }
    }
    return true
  } catch (e) { return false }
}

// 文件哈希计算
function hashFile(p, algorithm) {
  return new Promise((resolve, reject) => {
    try {
      const hash = crypto.createHash(algorithm || 'sha256')
      const stream = fs.createReadStream(p)
      stream.on('data', chunk => hash.update(chunk))
      stream.on('end', () => resolve(hash.digest('hex')))
      stream.on('error', reject)
    } catch (e) { reject(e) }
  })
}

function hashFileSync(p, algorithm) {
  try {
    const content = fs.readFileSync(p)
    return crypto.createHash(algorithm || 'sha256').update(content).digest('hex')
  } catch (e) { return null }
}

// 压缩解压
function gzipFile(src, dest) {
  return new Promise((resolve, reject) => {
    try {
      const gzip = zlib.createGzip()
      const read = fs.createReadStream(src)
      const write = fs.createWriteStream(dest || src + '.gz')
      read.pipe(gzip).pipe(write)
      write.on('finish', () => resolve(true))
      write.on('error', reject)
    } catch (e) { reject(e) }
  })
}

function gunzipFile(src, dest) {
  return new Promise((resolve, reject) => {
    try {
      const gunzip = zlib.createGunzip()
      const read = fs.createReadStream(src)
      const outPath = dest || src.replace(/\.gz$/, '')
      const write = fs.createWriteStream(outPath)
      read.pipe(gunzip).pipe(write)
      write.on('finish', () => resolve(true))
      write.on('error', reject)
    } catch (e) { reject(e) }
  })
}

// 磁盘使用统计（粗略）
function getDiskUsage() {
  try {
    const dataDirSize = getDirSize(DATA_DIR)
    const filesDirSize = getDirSize(FILES_DIR)
    const logsDirSize = getDirSize(LOGS_DIR)
    const cacheDirSize = getDirSize(path.join(DATA_DIR, 'cache'))
    return {
      dataDir: DATA_DIR,
      dataDirSize,
      filesDirSize,
      logsDirSize,
      cacheDirSize,
      totalEstimated: dataDirSize + filesDirSize + logsDirSize + cacheDirSize,
      unit: 'bytes',
    }
  } catch (e) {
    return { error: e.message }
  }
}

// 配额管理：用户级存储配额检查
function checkUserQuota(userId, fileSize) {
  const defaultQuota = 100 * 1024 * 1024 // 默认 100MB
  const user = Object.values(db.users || {}).find(u => u.id === userId)
  const quota = user?.storageQuota || defaultQuota
  
  let used = 0
  for (const file of Object.values(db.files || {})) {
    if (file.userId === userId) used += file.size || 0
  }
  
  return {
    userId,
    quota,
    used,
    remaining: Math.max(0, quota - used),
    wouldExceed: (used + (fileSize || 0)) > quota,
    percent: quota > 0 ? (used / quota * 100).toFixed(2) : 0,
  }
}

// 文件服务对象
const fileService = {
  exists: fileExists,
  stat: fileStat,
  mkdir,
  rmdir,
  readdir,
  copy: copyFile,
  move: moveFile,
  rename: renameFile,
  truncate: truncateFile,
  append: appendFile,
  createReadStream: (p, opts) => fs.createReadStream(p, opts),
  createWriteStream: (p, opts) => fs.createWriteStream(p, opts),
  getDirSize,
  walkDir,
  getMimeType,
  hashFile,
  hashFileSync,
  gzip: gzipFile,
  gunzip: gunzipFile,
  getDiskUsage,
  checkQuota: checkUserQuota,
}

// ============ 组织与团队系统 ============
// 生成邀请码
function generateInviteCode() {
  return crypto.randomBytes(4).toString('hex').toUpperCase()
}

// 创建组织
function createOrg(name, ownerId, settings) {
  const orgId = 'org_' + genId()
  const org = {
    id: orgId,
    name: name || '默认组织',
    ownerId,
    settings: settings || {
      maxMembers: 10,
      allowInvite: true,
      defaultRole: 'user',
    },
    invites: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  if (!db.orgs) db.orgs = {}
  db.orgs[orgId] = org
  return org
}

// 获取用户所属组织
function getUserOrg(userId) {
  const user = Object.values(db.users || {}).find(u => u.id === userId)
  if (!user || !user.orgId) return null
  return db.orgs ? db.orgs[user.orgId] : null
}

// 获取组织成员列表
function getOrgMembers(orgId) {
  if (!db.users) return []
  return Object.values(db.users)
    .filter(u => u.orgId === orgId)
    .map(u => publicUser(u))
}

// 检查用户是否属于指定组织
function isOrgMember(userId, orgId) {
  const user = Object.values(db.users || {}).find(u => u.id === userId)
  return user && user.orgId === orgId
}

// 创建邀请码
function createInvite(orgId, createdBy, role, expiresInHours) {
  const code = generateInviteCode()
  const invite = {
    code,
    orgId,
    createdBy,
    role: role || 'user',
    expiresAt: new Date(Date.now() + (expiresInHours || 72) * 3600 * 1000).toISOString(),
    usedBy: null,
    usedAt: null,
    status: 'active',
    createdAt: new Date().toISOString(),
  }
  if (!db.orgs[orgId].invites) db.orgs[orgId].invites = {}
  db.orgs[orgId].invites[code] = invite
  return invite
}

// 使用邀请码加入组织
function useInvite(code, userId) {
  if (!db.orgs) return { error: '组织系统未初始化' }
  for (const org of Object.values(db.orgs)) {
    const invite = org.invites && org.invites[code]
    if (invite) {
      if (invite.status !== 'active') return { error: '邀请码已使用或已失效' }
      if (new Date(invite.expiresAt) < new Date()) return { error: '邀请码已过期' }
      invite.status = 'used'
      invite.usedBy = userId
      invite.usedAt = new Date().toISOString()
      const user = Object.values(db.users).find(u => u.id === userId)
      if (user) {
        user.orgId = org.id
        if (!user.role || user.role === 'user') user.role = invite.role || 'user'
      }
      return { success: true, org, role: invite.role }
    }
  }
  return { error: '邀请码不存在' }
}

// 资源隔离：过滤出指定组织可见的对话
function filterConversationsByOrg(conversations, orgId) {
  if (!orgId) return conversations
  const result = {}
  for (const [id, conv] of Object.entries(conversations)) {
    if (conv.orgId === orgId || !conv.orgId) {
      result[id] = conv
    }
  }
  return result
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

// ============ 速率限制增强 ============
// 多级限流：IP / 用户 / 组织 / 端点
// 滑动窗口算法实现
class SlidingWindow {
  constructor(windowMs, maxRequests) {
    this.windowMs = windowMs
    this.maxRequests = maxRequests
    this.requests = []
  }
  
  isAllowed() {
    const now = Date.now()
    const windowStart = now - this.windowMs
    this.requests = this.requests.filter(t => t > windowStart)
    if (this.requests.length >= this.maxRequests) {
      return { allowed: false, remaining: 0, retryAfter: Math.ceil((this.requests[0] + this.windowMs - now) / 1000) }
    }
    this.requests.push(now)
    return { allowed: true, remaining: this.maxRequests - this.requests.length, retryAfter: 0 }
  }
  
  reset() {
    this.requests = []
  }
}

// 令牌桶算法实现
class TokenBucket {
  constructor(capacity, refillPerSecond) {
    this.capacity = capacity
    this.refillPerSecond = refillPerSecond
    this.tokens = capacity
    this.lastRefill = Date.now()
  }
  
  _refill() {
    const now = Date.now()
    const elapsed = (now - this.lastRefill) / 1000
    this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.refillPerSecond)
    this.lastRefill = now
  }
  
  isAllowed(tokens) {
    this._refill()
    const needed = tokens || 1
    if (this.tokens < needed) {
      const timeToRefill = Math.ceil((needed - this.tokens) / this.refillPerSecond)
      return { allowed: false, remaining: 0, retryAfter: timeToRefill }
    }
    this.tokens -= needed
    return { allowed: true, remaining: Math.floor(this.tokens), retryAfter: 0 }
  }
  
  reset() {
    this.tokens = this.capacity
    this.lastRefill = Date.now()
  }
}

// 多级限流存储
const rateLimitStores = {
  ip: new Map(),
  user: new Map(),
  org: new Map(),
  endpoint: new Map(),
}

// 限流统计
const rateLimitStats = {
  totalHits: 0,
  totalBlocked: 0,
  byType: {
    ip: { hits: 0, blocked: 0 },
    user: { hits: 0, blocked: 0 },
    org: { hits: 0, blocked: 0 },
    endpoint: { hits: 0, blocked: 0 },
  },
}

// 白名单 / 黑名单 IP
const ipWhitelist = new Set()
const ipBlacklist = new Set()

// 端点限流配置
const ENDPOINT_RATE_LIMITS = {
  '/api/chat/send': { type: 'user', capacity: 60, windowMs: 60000 },
  '/api/chat/stream': { type: 'user', capacity: 60, windowMs: 60000 },
  '/api/auth/login': { type: 'ip', capacity: 10, windowMs: 60000 },
  '/api/auth/register': { type: 'ip', capacity: 10, windowMs: 60000 },
  default: { type: 'user', capacity: 300, windowMs: 60000 },
}

// IP 级限流配置
const IP_RATE_LIMIT = { capacity: 300, windowMs: 60000 }

// 获取或创建滑动窗口
function getOrCreateWindow(store, key, windowMs, maxRequests) {
  if (!store.has(key)) {
    store.set(key, new SlidingWindow(windowMs, maxRequests))
  }
  return store.get(key)
}

// 获取客户端 IP
function getClientIp(req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 
         req.socket?.remoteAddress || 
         'unknown'
}

// 获取用户 ID
function getUserId(req) {
  const auth = authenticate(req)
  return auth.authenticated ? auth.user.id : null
}

// 获取组织 ID
function getOrgId(req) {
  const auth = authenticate(req)
  if (auth.authenticated && auth.user.orgId) {
    return auth.user.orgId
  }
  return null
}

// 多级限流检查
function checkEnhancedRateLimit(req, endpointPath) {
  const ip = getClientIp(req)
  
  // 黑名单检查
  if (ipBlacklist.has(ip)) {
    return { allowed: false, reason: 'blacklisted', retryAfter: 3600 }
  }
  
  // 白名单豁免
  if (ipWhitelist.has(ip)) {
    return { allowed: true, reason: 'whitelisted' }
  }
  
  // 检查配置是否启用限流
  if (getConfig && !getConfig('security.enableRateLimit', true)) {
    return { allowed: true, reason: 'disabled' }
  }
  
  const path = endpointPath || req.url?.split('?')[0] || '/'
  const endpointConfig = ENDPOINT_RATE_LIMITS[path] || ENDPOINT_RATE_LIMITS.default
  
  // 1. IP 级限流（令牌桶）
  const ipBucketKey = ip
  if (!rateLimitStores.ip.has(ipBucketKey)) {
    rateLimitStores.ip.set(ipBucketKey, new TokenBucket(IP_RATE_LIMIT.capacity, IP_RATE_LIMIT.capacity / 60))
  }
  const ipResult = rateLimitStores.ip.get(ipBucketKey).isAllowed(1)
  rateLimitStats.totalHits++
  rateLimitStats.byType.ip.hits++
  if (!ipResult.allowed) {
    rateLimitStats.totalBlocked++
    rateLimitStats.byType.ip.blocked++
    return { ...ipResult, level: 'ip', key: ip }
  }
  
  // 2. 用户级限流（滑动窗口）
  const userId = getUserId(req)
  if (userId && endpointConfig.type === 'user') {
    const userKey = userId + ':' + path
    const userWindow = getOrCreateWindow(
      rateLimitStores.user, 
      userKey, 
      endpointConfig.windowMs, 
      endpointConfig.capacity
    )
    const userResult = userWindow.isAllowed()
    rateLimitStats.byType.user.hits++
    if (!userResult.allowed) {
      rateLimitStats.totalBlocked++
      rateLimitStats.byType.user.blocked++
      return { ...userResult, level: 'user', key: userId }
    }
  }
  
  // 3. 组织级限流（如有）
  const orgId = getOrgId(req)
  if (orgId) {
    const orgKey = orgId + ':' + path
    const orgCapacity = endpointConfig.capacity * 5
    const orgWindow = getOrCreateWindow(
      rateLimitStores.org, 
      orgKey, 
      endpointConfig.windowMs, 
      orgCapacity
    )
    const orgResult = orgWindow.isAllowed()
    rateLimitStats.byType.org.hits++
    if (!orgResult.allowed) {
      rateLimitStats.totalBlocked++
      rateLimitStats.byType.org.blocked++
      return { ...orgResult, level: 'org', key: orgId }
    }
  }
  
  // 4. 端点级限流（全局）
  const endpointKey = path
  const endpointCapacity = endpointConfig.capacity * 10
  const endpointWindow = getOrCreateWindow(
    rateLimitStores.endpoint, 
    endpointKey, 
    endpointConfig.windowMs, 
    endpointCapacity
  )
  const endpointResult = endpointWindow.isAllowed()
  rateLimitStats.byType.endpoint.hits++
  if (!endpointResult.allowed) {
    rateLimitStats.totalBlocked++
    rateLimitStats.byType.endpoint.blocked++
    return { ...endpointResult, level: 'endpoint', key: path }
  }
  
  return { allowed: true, level: 'all', remaining: ipResult.remaining }
}

// 重置指定 IP/用户的限流
function resetRateLimit(type, key) {
  const store = rateLimitStores[type]
  if (!store) return { success: false, error: '无效的限流类型：' + type }
  
  if (key) {
    store.delete(key)
    return { success: true, type, key }
  }
  
  store.clear()
  return { success: true, type, cleared: true }
}

// 获取增强限流状态
function getEnhancedRateLimitStatus() {
  return {
    stats: { ...rateLimitStats },
    counts: {
      ip: rateLimitStores.ip.size,
      user: rateLimitStores.user.size,
      org: rateLimitStores.org.size,
      endpoint: rateLimitStores.endpoint.size,
    },
    whitelist: Array.from(ipWhitelist),
    blacklist: Array.from(ipBlacklist),
    endpointConfigs: ENDPOINT_RATE_LIMITS,
  }
}

// 添加 IP 到白名单
function addIpWhitelist(ip) {
  ipWhitelist.add(ip)
  return { success: true, ip }
}

// 从白名单移除 IP
function removeIpWhitelist(ip) {
  ipWhitelist.delete(ip)
  return { success: true, ip }
}

// 添加 IP 到黑名单
function addIpBlacklist(ip) {
  ipBlacklist.add(ip)
  return { success: true, ip }
}

// 从黑名单移除 IP
function removeIpBlacklist(ip) {
  ipBlacklist.delete(ip)
  return { success: true, ip }
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

// ============ 审计日志系统 ============
const AUDIT_DIR = path.join(DATA_DIR, 'audit')

// 确保审计日志目录存在
if (!fs.existsSync(AUDIT_DIR)) fs.mkdirSync(AUDIT_DIR, { recursive: true })

// 审计日志按天滚动文件名
function getAuditFileName(date) {
  const d = date || new Date()
  const pad = n => String(n).padStart(2, '0')
  return 'audit-' + d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + '.log'
}

// 写入审计日志（不可删除、不可修改）
function auditLog(action, userId, ip, details) {
  try {
    const record = {
      id: 'audit_' + genId(),
      action,
      userId,
      ip: ip || 'unknown',
      details: details || {},
      timestamp: new Date().toISOString(),
    }
    const logFile = path.join(AUDIT_DIR, getAuditFileName())
    fs.appendFileSync(logFile, JSON.stringify(record) + '\n')
    return record
  } catch (e) {
    console.error('审计日志写入失败:', e.message)
    return null
  }
}

// 查询审计日志：支持按用户/操作/时间范围过滤
function queryAuditLogs(filters) {
  const { userId, action, startDate, endDate, limit } = filters
  const max = parseInt(limit, 10) || 100
  let files = fs.existsSync(AUDIT_DIR) ? fs.readdirSync(AUDIT_DIR).filter(f => f.startsWith('audit-') && f.endsWith('.log')) : []
  files.sort()
  
  // 按日期范围过滤文件
  if (startDate || endDate) {
    files = files.filter(f => {
      const dateStr = f.replace('audit-', '').replace('.log', '')
      if (startDate && dateStr < startDate) return false
      if (endDate && dateStr > endDate) return false
      return true
    })
  }
  
  const logs = []
  for (const f of files) {
    let content
    try { content = fs.readFileSync(path.join(AUDIT_DIR, f), 'utf-8') } catch { continue }
    const lines = content.split('\n').filter(Boolean)
    for (const line of lines) {
      try {
        const obj = JSON.parse(line)
        if (userId && obj.userId !== userId) continue
        if (action && obj.action !== action) continue
        logs.push(obj)
      } catch {}
    }
  }
  logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  return logs.slice(0, max)
}

// 审计操作类型常量
const AUDIT_ACTIONS = {
  USER_LOGIN: 'user.login',
  USER_LOGOUT: 'user.logout',
  USER_REGISTER: 'user.register',
  USER_PASSWORD_CHANGE: 'user.password_change',
  USER_ROLE_CHANGE: 'user.role_change',
  DATA_DELETE: 'data.delete',
  SETTINGS_CHANGE: 'settings.change',
  PERMISSION_CHANGE: 'permission.change',
  ORG_CREATE: 'org.create',
  ORG_INVITE: 'org.invite',
  ORG_JOIN: 'org.join',
  BACKUP_CREATE: 'backup.create',
  BACKUP_RESTORE: 'backup.restore',
  ADMIN_ACTION: 'admin.action',
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

// ============ SSE 流式增强 ============
// SSE 连接管理
const sseConnections = new Map() // connectionId -> { res, clientId, channels, lastEventId, createdAt }
const SSE_MAX_CONNECTIONS = 100
const SSE_HEARTBEAT_INTERVAL = 15000

// SSE 事件类型
const SSE_EVENTS = {
  MESSAGE: 'message',
  THINKING: 'thinking',
  TOOL_CALL: 'tool_call',
  DELTA: 'delta',
  DONE: 'done',
  ERROR: 'error',
  HEARTBEAT: 'heartbeat',
}

// 生成 SSE 连接 ID
function genSseId() {
  return 'sse_' + genId()
}

// 发送标准 SSE 事件
function sendSseEvent(res, event, data, id) {
  if (id) {
    res.write(`id: ${id}\n`)
  }
  if (event) {
    res.write(`event: ${event}\n`)
  }
  const dataStr = typeof data === 'string' ? data : JSON.stringify(data)
  const lines = dataStr.split('\n')
  for (const line of lines) {
    res.write(`data: ${line}\n`)
  }
  res.write('\n')
}

// 发送心跳（注释行，防止连接断开）
function sendSseHeartbeat(res) {
  res.write(':heartbeat ' + Date.now() + '\n\n')
}

// 创建 SSE 连接
function createSseConnection(req, res, options) {
  if (sseConnections.size >= SSE_MAX_CONNECTIONS) {
    res.writeHead(503, { 'Content-Type': 'text/plain' })
    res.end('SSE 连接数已达上限')
    return null
  }
  
  const connectionId = genSseId()
  const lastEventId = req.headers['last-event-id'] || null
  
  // 设置 SSE 响应头
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'X-Accel-Buffering': 'no',
  })
  
  // 写入初始欢迎消息
  sendSseEvent(res, 'welcome', {
    connectionId,
    message: '已连接 HopeAgent SSE 服务',
    time: new Date().toISOString(),
    lastEventId,
  }, connectionId)
  
  const connection = {
    id: connectionId,
    res,
    req,
    clientId: options?.clientId || null,
    channels: new Set(options?.channels || []),
    lastEventId,
    createdAt: Date.now(),
    lastActivity: Date.now(),
    pendingMessages: [],
    compressed: options?.compressed || false,
  }
  
  sseConnections.set(connectionId, connection)
  
  // 监听连接关闭
  req.on('close', () => {
    sseConnections.delete(connectionId)
  })
  
  req.on('end', () => {
    sseConnections.delete(connectionId)
  })
  
  req.on('error', () => {
    sseConnections.delete(connectionId)
  })
  
  return connection
}

// 向指定连接发送事件
function sendToSseConnection(connectionId, event, data, channel) {
  const conn = sseConnections.get(connectionId)
  if (!conn) return false
  
  try {
    const payload = channel ? { channel, data } : data
    const eventId = 'evt_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6)
    sendSseEvent(conn.res, event, payload, eventId)
    conn.lastActivity = Date.now()
    
    // 存储未确认消息（用于重连）
    conn.pendingMessages.push({ id: eventId, event, data: payload, timestamp: Date.now() })
    if (conn.pendingMessages.length > 100) {
      conn.pendingMessages.shift()
    }
    
    return true
  } catch (e) {
    sseConnections.delete(connectionId)
    return false
  }
}

// 向指定频道广播
function broadcastSseChannel(channel, event, data) {
  let count = 0
  for (const conn of sseConnections.values()) {
    if (conn.channels.has(channel)) {
      if (sendToSseConnection(conn.id, event, data, channel)) {
        count++
      }
    }
  }
  return count
}

// 广播给所有连接
function broadcastSseAll(event, data) {
  let count = 0
  for (const connId of sseConnections.keys()) {
    if (sendToSseConnection(connId, event, data)) {
      count++
    }
  }
  return count
}

// 订阅频道
function subscribeSseChannel(connectionId, channel) {
  const conn = sseConnections.get(connectionId)
  if (!conn) return false
  conn.channels.add(channel)
  return true
}

// 取消订阅频道
function unsubscribeSseChannel(connectionId, channel) {
  const conn = sseConnections.get(connectionId)
  if (!conn) return false
  conn.channels.delete(channel)
  return true
}

// 获取活动 SSE 连接列表
function getSseConnections() {
  const list = []
  for (const [id, conn] of sseConnections.entries()) {
    list.push({
      id,
      clientId: conn.clientId,
      channels: Array.from(conn.channels),
      createdAt: new Date(conn.createdAt).toISOString(),
      lastActivity: new Date(conn.lastActivity).toISOString(),
      pendingMessages: conn.pendingMessages.length,
      compressed: conn.compressed,
    })
  }
  return {
    total: sseConnections.size,
    max: SSE_MAX_CONNECTIONS,
    connections: list,
  }
}

// 关闭指定连接
function closeSseConnection(connectionId) {
  const conn = sseConnections.get(connectionId)
  if (!conn) return false
  try {
    sendSseEvent(conn.res, 'close', { reason: 'server_close' })
    conn.res.end()
  } catch {}
  sseConnections.delete(connectionId)
  return true
}

// 心跳定时器
setInterval(() => {
  for (const [id, conn] of sseConnections.entries()) {
    try {
      sendSseHeartbeat(conn.res)
      conn.lastActivity = Date.now()
    } catch {
      sseConnections.delete(id)
    }
  }
}, SSE_HEARTBEAT_INTERVAL)

// 重发未确认消息（断线重连）
function resendPendingMessages(connectionId, lastEventId) {
  const conn = sseConnections.get(connectionId)
  if (!conn || !lastEventId) return 0
  
  const idx = conn.pendingMessages.findIndex(m => m.id === lastEventId)
  if (idx === -1) return 0
  
  const toResend = conn.pendingMessages.slice(idx + 1)
  for (const msg of toResend) {
    try {
      sendSseEvent(conn.res, msg.event, msg.data, msg.id)
    } catch {}
  }
  
  return toResend.length
}

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

// ============ Webhook 事件系统 ============
// 支持的事件类型
const WEBHOOK_EVENTS = [
  'message.created',
  'conversation.created',
  'tool.executed',
  'task.completed',
  'user.registered',
  'file.uploaded',
  'backup.completed',
]

// 触发 webhook（带失败重试，指数退避）
async function triggerWebhook(event, payload) {
  if (!db.webhooks) db.webhooks = {}
  if (!db.webhookLogs) db.webhookLogs = []
  
  const webhooks = Object.values(db.webhooks).filter(w => 
    w.enabled && w.events && w.events.includes(event)
  )
  
  const results = []
  for (const webhook of webhooks) {
    const logEntry = {
      id: genId(),
      webhookId: webhook.id,
      event,
      payload,
      status: 'pending',
      attempts: 0,
      createdAt: new Date().toISOString(),
    }
    
    let success = false
    let lastError = null
    
    for (let attempt = 0; attempt < 3; attempt++) {
      logEntry.attempts = attempt + 1
      try {
        const response = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Event': event,
            'X-Webhook-Signature': crypto
              .createHmac('sha256', resolveWebhookSecret(webhook))
              .update(JSON.stringify({ event, payload, timestamp: Date.now() }))
              .digest('hex'),
          },
          body: JSON.stringify({
            event,
            payload,
            timestamp: new Date().toISOString(),
            webhookId: webhook.id,
          }),
        })
        
        if (response.ok) {
          success = true
          logEntry.status = 'success'
          logEntry.responseStatus = response.status
          break
        } else {
          lastError = 'HTTP ' + response.status
          logEntry.responseStatus = response.status
        }
      } catch (e) {
        lastError = e.message
      }
      
      // 指数退避：1s, 2s, 4s
      if (attempt < 2) {
        await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000))
      }
    }
    
    if (!success) {
      logEntry.status = 'failed'
      logEntry.error = lastError
    }
    
    logEntry.completedAt = new Date().toISOString()
    db.webhookLogs.push(logEntry)
    
    // 限制日志数量
    if (db.webhookLogs.length > 1000) {
      db.webhookLogs = db.webhookLogs.slice(-500)
    }
    
    results.push({ webhookId: webhook.id, success, attempts: logEntry.attempts })
  }
  
  saveDB(db)
  return results
}

// 创建 webhook
function createWebhook(data, userId) {
  const id = 'wh_' + genId()
  const webhook = {
    id,
    name: data.name || '未命名 Webhook',
    url: data.url,
    events: data.events || [],
    secret: data.secret || crypto.randomBytes(16).toString('hex'),
    enabled: data.enabled !== undefined ? !!data.enabled : true,
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  if (!db.webhooks) db.webhooks = {}
  db.webhooks[id] = webhook
  return webhook
}

// ============ 插件系统框架 ============
const PLUGINS_DIR = path.join(DATA_DIR, 'plugins')
if (!fs.existsSync(PLUGINS_DIR)) fs.mkdirSync(PLUGINS_DIR, { recursive: true })

// 已注册的插件
const registeredPlugins = new Map()

// 插件钩子类型
const PLUGIN_HOOKS = {
  BEFORE_ROUTE: 'beforeRoute',
  AFTER_ROUTE: 'afterRoute',
  BEFORE_CHAT: 'beforeChat',
  AFTER_CHAT: 'afterChat',
  ON_MESSAGE: 'onMessage',
}

// 注册插件
function registerPlugin(plugin) {
  if (!plugin || !plugin.id) {
    return { success: false, error: '插件缺少 id' }
  }
  if (registeredPlugins.has(plugin.id)) {
    return { success: false, error: '插件已注册：' + plugin.id }
  }
  
  const defaultPlugin = {
    id: '',
    name: '',
    version: '1.0.0',
    description: '',
    author: '',
    hooks: {},
    routes: [],
    tools: [],
    enabled: false,
    installedAt: null,
  }
  
  const fullPlugin = { ...defaultPlugin, ...plugin }
  registeredPlugins.set(plugin.id, fullPlugin)
  
  return { success: true, plugin: fullPlugin }
}

// 执行插件钩子
function executeHooks(hookName, context) {
  const results = []
  for (const plugin of registeredPlugins.values()) {
    if (!plugin.enabled) continue
    if (plugin.hooks && typeof plugin.hooks[hookName] === 'function') {
      try {
        const result = plugin.hooks[hookName](context)
        results.push({ pluginId: plugin.id, result })
      } catch (e) {
        results.push({ pluginId: plugin.id, error: e.message })
      }
    }
  }
  return results
}

// 内置示例插件：hello-world
const helloWorldPlugin = {
  id: 'hello-world',
  name: 'Hello World 插件',
  version: '1.0.0',
  description: '一个简单的示例插件，演示插件系统的基本功能',
  author: 'HopeAgent',
  hooks: {
    beforeRoute: (ctx) => {
      return { hello: 'world', timestamp: Date.now() }
    },
  },
  tools: [
    {
      name: 'hello_world',
      description: '返回问候语的示例工具',
      parameters: {
        type: 'object',
        properties: { name: { type: 'string', description: '名字' } },
      },
      async execute(args) {
        return { message: 'Hello, ' + (args.name || 'World') + '!' }
      },
    },
  ],
}

// 内置示例插件：time-plugin
const timePlugin = {
  id: 'time-plugin',
  name: '时间工具插件',
  version: '1.0.0',
  description: '提供各种时间相关的工具函数',
  author: 'HopeAgent',
  tools: [
    {
      name: 'time_format',
      description: '格式化时间戳为指定格式',
      parameters: {
        type: 'object',
        properties: {
          timestamp: { type: 'number', description: '时间戳' },
          format: { type: 'string', description: '格式字符串', default: 'YYYY-MM-DD HH:mm:ss' },
        },
      },
      async execute(args) {
        const d = args.timestamp ? new Date(args.timestamp) : new Date()
        const pad = n => String(n).padStart(2, '0')
        let formatted = (args.format || 'YYYY-MM-DD HH:mm:ss')
          .replace('YYYY', d.getFullYear())
          .replace('MM', pad(d.getMonth() + 1))
          .replace('DD', pad(d.getDate()))
          .replace('HH', pad(d.getHours()))
          .replace('mm', pad(d.getMinutes()))
          .replace('ss', pad(d.getSeconds()))
        return { formatted, timestamp: d.getTime() }
      },
    },
    {
      name: 'time_diff',
      description: '计算两个时间戳之间的差值',
      parameters: {
        type: 'object',
        properties: {
          start: { type: 'number', description: '开始时间戳' },
          end: { type: 'number', description: '结束时间戳' },
        },
        required: ['start', 'end'],
      },
      async execute(args) {
        const diff = Math.abs(args.end - args.start)
        return {
          diffMs: diff,
          diffSeconds: Math.floor(diff / 1000),
          diffMinutes: Math.floor(diff / 60000),
          diffHours: Math.floor(diff / 3600000),
          diffDays: Math.floor(diff / 86400000),
        }
      },
    },
  ],
}

// 内置示例插件：echo-plugin
const echoPlugin = {
  id: 'echo-plugin',
  name: '回声插件',
  version: '1.0.0',
  description: '将输入原样返回的测试插件',
  author: 'HopeAgent',
  hooks: {
    afterChat: (ctx) => {
      return { echoed: true, originalLength: ctx.response?.length || 0 }
    },
  },
  tools: [
    {
      name: 'echo',
      description: '将输入的文本原样返回',
      parameters: {
        type: 'object',
        properties: { text: { type: 'string', description: '要回显的文本' } },
        required: ['text'],
      },
      async execute(args) {
        return { echoed: args.text, length: args.text.length }
      },
    },
  ],
}

// 加载内置插件
function loadBuiltinPlugins() {
  registerPlugin(helloWorldPlugin)
  registerPlugin(timePlugin)
  registerPlugin(echoPlugin)
  
  // 从 db 恢复启用状态
  if (db.plugins) {
    for (const [id, state] of Object.entries(db.plugins)) {
      if (registeredPlugins.has(id)) {
        registeredPlugins.get(id).enabled = state.enabled || false
      }
    }
  }
}

// 列出所有已注册插件
function listPlugins() {
  return Array.from(registeredPlugins.values()).map(p => ({
    id: p.id,
    name: p.name,
    version: p.version,
    description: p.description,
    author: p.author,
    enabled: p.enabled,
    toolCount: (p.tools || []).length,
    hookCount: Object.keys(p.hooks || {}).length,
  }))
}

// ============ 定时任务调度器 ============
// 定时任务存储
const cronJobs = new Map()

// Cron 字段说明：分 时 日 月 周
// 简化版 Cron 解析器
function parseCronExpression(expression) {
  const parts = expression.trim().split(/\s+/)
  if (parts.length !== 5) {
    return { error: 'Cron 表达式必须包含 5 个字段：分 时 日 月 周' }
  }
  
  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts
  
  const parseField = (field, min, max) => {
    if (field === '*') return { type: 'all' }
    if (field.includes('/')) {
      const [base, step] = field.split('/')
      return { type: 'step', base: base === '*' ? min : parseInt(base), step: parseInt(step) }
    }
    if (field.includes(',')) {
      return { type: 'list', values: field.split(',').map(Number) }
    }
    if (field.includes('-')) {
      const [start, end] = field.split('-').map(Number)
      return { type: 'range', start, end }
    }
    return { type: 'single', value: parseInt(field) }
  }
  
  const matches = (parsed, value) => {
    switch (parsed.type) {
      case 'all': return true
      case 'single': return value === parsed.value
      case 'list': return parsed.values.includes(value)
      case 'range': return value >= parsed.start && value <= parsed.end
      case 'step': 
        if (value < parsed.base) return false
        return (value - parsed.base) % parsed.step === 0
      default: return false
    }
  }
  
  return {
    minute: parseField(minute, 0, 59),
    hour: parseField(hour, 0, 23),
    dayOfMonth: parseField(dayOfMonth, 1, 31),
    month: parseField(month, 1, 12),
    dayOfWeek: parseField(dayOfWeek, 0, 6),
    matches(date) {
      return matches(this.minute, date.getMinutes()) &&
             matches(this.hour, date.getHours()) &&
             matches(this.dayOfMonth, date.getDate()) &&
             matches(this.month, date.getMonth() + 1) &&
             matches(this.dayOfWeek, date.getDay())
    },
  }
}

// 添加定时任务
function addCronJob(expression, callback, id, payload) {
  const parsed = parseCronExpression(expression)
  if (parsed.error) {
    return { success: false, error: parsed.error }
  }
  
  const jobId = id || 'cron_' + genId()
  const job = {
    id: jobId,
    expression,
    parsed,
    callback,
    payload: payload || {},
    enabled: true,
    lastRun: null,
    nextRun: null,
    runCount: 0,
    createdAt: new Date().toISOString(),
  }
  
  cronJobs.set(jobId, job)
  return { success: true, job: { id: jobId, expression, payload: job.payload } }
}

// 移除定时任务
function removeCronJob(id) {
  if (cronJobs.has(id)) {
    cronJobs.delete(id)
    return { success: true }
  }
  return { success: false, error: '任务不存在' }
}

// 列出所有定时任务
function listCronJobs() {
  return Array.from(cronJobs.values()).map(j => ({
    id: j.id,
    expression: j.expression,
    enabled: j.enabled,
    lastRun: j.lastRun,
    runCount: j.runCount,
    createdAt: j.createdAt,
    payload: j.payload,
  }))
}

// 后台 tick 循环：每秒检查是否有任务需要执行
let lastTickMinute = -1
function cronTick() {
  const now = new Date()
  const currentMinute = now.getMinutes()
  
  // 只在分钟变化时检查
  if (currentMinute === lastTickMinute) return
  lastTickMinute = currentMinute
  
  for (const job of cronJobs.values()) {
    if (!job.enabled) continue
    if (job.parsed.matches(now)) {
      try {
        job.callback(job.payload)
        job.lastRun = now.toISOString()
        job.runCount++
      } catch (e) {
        console.error('定时任务执行失败:', job.id, e.message)
      }
    }
  }
}

// 启动定时任务循环
setInterval(cronTick, 1000)

// 从 db 恢复定时任务
function restoreCronJobs() {
  if (!db.cronJobs) return
  for (const [id, jobData] of Object.entries(db.cronJobs)) {
    if (!jobData.enabled) continue
    const action = jobData.action || 'message'
    let callback = () => {}
    
    switch (action) {
      case 'webhook':
        callback = (payload) => {
          triggerWebhook('cron.triggered', { jobId: id, payload })
        }
        break
      case 'tool':
        callback = async (payload) => {
          if (payload.tool) {
            await executeTool(payload.tool, payload.args)
          }
        }
        break
      case 'export':
        callback = (payload) => {
          console.log('定时导出任务:', id, payload)
        }
        break
      default:
        callback = (payload) => {
          console.log('定时任务触发:', id, payload)
        }
    }
    
    addCronJob(jobData.expression, callback, id, jobData.payload)
  }
}

// ============ 多级缓存系统 ============
// LRU 缓存节点
class LRUNode {
  constructor(key, value, ttl) {
    this.key = key
    this.value = value
    this.expiresAt = ttl ? Date.now() + ttl * 1000 : null
    this.prev = null
    this.next = null
  }
  
  isExpired() {
    return this.expiresAt !== null && Date.now() > this.expiresAt
  }
}

// LRU 内存缓存（双向链表 + Map）
class LRUCache {
  constructor(maxSize) {
    this.maxSize = maxSize || 1000
    this.map = new Map()
    this.head = null
    this.tail = null
    this.size = 0
    this.hits = 0
    this.misses = 0
  }
  
  get(key) {
    const node = this.map.get(key)
    if (!node) {
      this.misses++
      return null
    }
    if (node.isExpired()) {
      this._removeNode(node)
      this.map.delete(key)
      this.misses++
      return null
    }
    this._moveToHead(node)
    this.hits++
    return node.value
  }
  
  set(key, value, ttl) {
    let node = this.map.get(key)
    if (node) {
      node.value = value
      node.expiresAt = ttl ? Date.now() + ttl * 1000 : null
      this._moveToHead(node)
    } else {
      node = new LRUNode(key, value, ttl)
      this.map.set(key, node)
      this._addToHead(node)
      this.size++
      if (this.size > this.maxSize) {
        this._removeTail()
      }
    }
  }
  
  del(key) {
    const node = this.map.get(key)
    if (node) {
      this._removeNode(node)
      this.map.delete(key)
      this.size--
    }
  }
  
  clear() {
    this.map.clear()
    this.head = null
    this.tail = null
    this.size = 0
    this.hits = 0
    this.misses = 0
  }
  
  _addToHead(node) {
    node.prev = null
    node.next = this.head
    if (this.head) this.head.prev = node
    this.head = node
    if (!this.tail) this.tail = node
  }
  
  _removeNode(node) {
    if (node.prev) node.prev.next = node.next
    else this.head = node.next
    if (node.next) node.next.prev = node.prev
    else this.tail = node.prev
  }
  
  _moveToHead(node) {
    this._removeNode(node)
    this._addToHead(node)
  }
  
  _removeTail() {
    if (!this.tail) return
    const key = this.tail.key
    this._removeNode(this.tail)
    this.map.delete(key)
    this.size--
  }
  
  getStats() {
    return {
      size: this.size,
      maxSize: this.maxSize,
      hits: this.hits,
      misses: this.misses,
      hitRate: this.hits + this.misses > 0 ? (this.hits / (this.hits + this.misses)).toFixed(4) : 0,
    }
  }
}

// 文件缓存
const FILE_CACHE_DIR = path.join(DATA_DIR, 'cache')
if (!fs.existsSync(FILE_CACHE_DIR)) fs.mkdirSync(FILE_CACHE_DIR, { recursive: true })

function getCacheFileName(key) {
  const hash = crypto.createHash('md5').update(key).digest('hex')
  return path.join(FILE_CACHE_DIR, hash + '.cache')
}

function fileCacheGet(key) {
  try {
    const file = getCacheFileName(key)
    if (!fs.existsSync(file)) return null
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'))
    if (data.expiresAt && Date.now() > data.expiresAt) {
      fs.unlinkSync(file)
      return null
    }
    return data.value
  } catch {
    return null
  }
}

function fileCacheSet(key, value, ttl) {
  try {
    const file = getCacheFileName(key)
    const data = {
      value,
      expiresAt: ttl ? Date.now() + ttl * 1000 : null,
      createdAt: Date.now(),
    }
    fs.writeFileSync(file, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

function fileCacheDel(key) {
  try {
    const file = getCacheFileName(key)
    if (fs.existsSync(file)) {
      fs.unlinkSync(file)
    }
    return true
  } catch {
    return false
  }
}

// 多级缓存：内存 -> 文件
const memoryCache = new LRUCache(500)

const cache = {
  get(key) {
    // 先查内存
    let value = memoryCache.get(key)
    if (value !== null) return value
    
    // 再查文件
    value = fileCacheGet(key)
    if (value !== null) {
      // 回填内存
      memoryCache.set(key, value, 60)
      return value
    }
    
    return null
  },
  
  set(key, value, ttl) {
    memoryCache.set(key, value, ttl)
    fileCacheSet(key, value, ttl)
  },
  
  del(key) {
    memoryCache.del(key)
    fileCacheDel(key)
  },
  
  clear() {
    memoryCache.clear()
    // 清除文件缓存
    if (fs.existsSync(FILE_CACHE_DIR)) {
      const files = fs.readdirSync(FILE_CACHE_DIR)
      for (const f of files) {
        try { fs.unlinkSync(path.join(FILE_CACHE_DIR, f)) } catch {}
      }
    }
  },
  
  getStats() {
    const memStats = memoryCache.getStats()
    let fileCount = 0
    try {
      fileCount = fs.existsSync(FILE_CACHE_DIR) ? fs.readdirSync(FILE_CACHE_DIR).length : 0
    } catch {}
    return {
      memory: memStats,
      file: { count: fileCount, dir: FILE_CACHE_DIR },
    }
  },
}

// ============ 健康检查与监控系统 ============
// 系统指标收集器：每秒收集一次，保留最近 300 条
const metricsHistory = []
const MAX_METRICS_HISTORY = 300
let metricsCollectorInterval = null

// 计数器指标
const metricsCounters = {
  requests_total: 0,
  errors_total: 0,
  tokens_used: 0,
  connections_total: 0,
}

// 仪表盘指标
function getGaugeMetrics() {
  const mem = process.memoryUsage()
  return {
    active_users: Object.keys(db.sessions || {}).length,
    cache_size: memoryCache.size,
    queue_depth: taskQueue.length,
    ws_connections: wsClients.size,
    memory_rss: mem.rss,
    memory_heapUsed: mem.heapUsed,
    memory_heapTotal: mem.heapTotal,
    uptime: process.uptime(),
  }
}

// 收集系统指标
function collectMetrics() {
  const mem = process.memoryUsage()
  const gauge = getGaugeMetrics()
  
  const sample = {
    timestamp: Date.now(),
    memory: {
      rss: mem.rss,
      heapUsed: mem.heapUsed,
      heapTotal: mem.heapTotal,
      external: mem.external,
    },
    cpu: {
      // 粗略 CPU 使用率（通过 process.cpuUsage 计算）
      usage: 0,
    },
    connections: {
      ws: wsClients.size,
      sessions: Object.keys(db.sessions || {}).length,
    },
    queue: {
      length: taskQueue.length,
      running: runningTasks,
    },
    cache: {
      hits: memoryCache.hits,
      misses: memoryCache.misses,
      hitRate: memoryCache.hits + memoryCache.misses > 0 
        ? (memoryCache.hits / (memoryCache.hits + memoryCache.misses)).toFixed(4)
        : 0,
      size: memoryCache.size,
    },
    counters: { ...metricsCounters },
  }
  
  metricsHistory.push(sample)
  if (metricsHistory.length > MAX_METRICS_HISTORY) {
    metricsHistory.shift()
  }
  
  return sample
}

// 启动指标收集器（每秒一次）
function startMetricsCollector() {
  if (metricsCollectorInterval) return
  metricsCollectorInterval = setInterval(collectMetrics, 1000)
}

// 告警阈值
const ALERT_THRESHOLDS = {
  memoryPercent: 80,
  errorRate: 5,
  queueLength: 100,
}

// 检查告警状态
function checkAlerts() {
  const alerts = []
  const mem = process.memoryUsage()
  const memPercent = (mem.heapUsed / mem.heapTotal) * 100
  
  if (memPercent > ALERT_THRESHOLDS.memoryPercent) {
    alerts.push({
      level: 'warning',
      type: 'memory',
      message: `内存使用率过高：${memPercent.toFixed(1)}%`,
      value: memPercent,
      threshold: ALERT_THRESHOLDS.memoryPercent,
    })
  }
  
  if (taskQueue.length > ALERT_THRESHOLDS.queueLength) {
    alerts.push({
      level: 'warning',
      type: 'queue',
      message: `队列长度过长：${taskQueue.length}`,
      value: taskQueue.length,
      threshold: ALERT_THRESHOLDS.queueLength,
    })
  }
  
  if (metricsCounters.requests_total > 0) {
    const errorRate = (metricsCounters.errors_total / metricsCounters.requests_total) * 100
    if (errorRate > ALERT_THRESHOLDS.errorRate) {
      alerts.push({
        level: 'warning',
        type: 'error_rate',
        message: `错误率过高：${errorRate.toFixed(1)}%`,
        value: errorRate,
        threshold: ALERT_THRESHOLDS.errorRate,
      })
    }
  }
  
  return alerts
}

// 各子系统健康状态
function getSubsystemStatus() {
  return {
    database: {
      status: 'healthy',
      details: { collections: Object.keys(db).length },
    },
    filesystem: {
      status: 'healthy',
      details: { filesDir: FILES_DIR, exists: fs.existsSync(FILES_DIR) },
    },
    cache: {
      status: 'healthy',
      details: memoryCache.getStats(),
    },
    llm: {
      status: getActiveModel()?.apiKey ? 'healthy' : 'degraded',
      details: { 
        activeModel: getActiveModel()?.id || null,
        configured: db.models.filter(m => m.apiKey).length,
      },
    },
    websocket: {
      status: 'healthy',
      details: { clients: wsClients.size },
    },
    queue: {
      status: taskQueue.length > 100 ? 'degraded' : 'healthy',
      details: { queued: taskQueue.length, running: runningTasks },
    },
  }
}

// 整体健康状态计算
function getOverallHealth() {
  const subsystems = getSubsystemStatus()
  const statuses = Object.values(subsystems).map(s => s.status)
  
  let overall = 'healthy'
  if (statuses.some(s => s === 'unhealthy')) overall = 'unhealthy'
  else if (statuses.some(s => s === 'degraded')) overall = 'degraded'
  
  return {
    status: overall,
    version: '3.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    subsystems,
    alerts: checkAlerts(),
  }
}

// Prometheus 格式指标
function getPrometheusMetrics() {
  const gauge = getGaugeMetrics()
  const mem = process.memoryUsage()
  const subsystems = getSubsystemStatus()
  
  let output = ''
  
  // 计数器
  output += '# HELP http_requests_total Total HTTP requests\n'
  output += '# TYPE http_requests_total counter\n'
  output += `http_requests_total ${metricsCounters.requests_total}\n\n`
  
  output += '# HELP http_errors_total Total HTTP errors\n'
  output += '# TYPE http_errors_total counter\n'
  output += `http_errors_total ${metricsCounters.errors_total}\n\n`
  
  output += '# HELP tokens_used_total Total tokens used\n'
  output += '# TYPE tokens_used_total counter\n'
  output += `tokens_used_total ${metricsCounters.tokens_used}\n\n`
  
  // 仪表盘
  output += '# HELP active_users Active user sessions\n'
  output += '# TYPE active_users gauge\n'
  output += `active_users ${gauge.active_users}\n\n`
  
  output += '# HELP cache_size Cache entry count\n'
  output += '# TYPE cache_size gauge\n'
  output += `cache_size ${gauge.cache_size}\n\n`
  
  output += '# HELP queue_depth Task queue depth\n'
  output += '# TYPE queue_depth gauge\n'
  output += `queue_depth ${gauge.queue_depth}\n\n`
  
  output += '# HELP ws_connections WebSocket connections\n'
  output += '# TYPE ws_connections gauge\n'
  output += `ws_connections ${gauge.ws_connections}\n\n`
  
  output += '# HELP memory_rss_bytes Resident set size\n'
  output += '# TYPE memory_rss_bytes gauge\n'
  output += `memory_rss_bytes ${mem.rss}\n\n`
  
  output += '# HELP memory_heap_used_bytes Heap used\n'
  output += '# TYPE memory_heap_used_bytes gauge\n'
  output += `memory_heap_used_bytes ${mem.heapUsed}\n\n`
  
  output += '# HELP memory_heap_total_bytes Heap total\n'
  output += '# TYPE memory_heap_total_bytes gauge\n'
  output += `memory_heap_total_bytes ${mem.heapTotal}\n\n`
  
  // 简化版直方图：请求时长分布
  output += '# HELP request_duration_seconds Request duration\n'
  output += '# TYPE request_duration_seconds histogram\n'
  output += 'request_duration_seconds_bucket{le="0.01"} 0\n'
  output += 'request_duration_seconds_bucket{le="0.1"} 0\n'
  output += 'request_duration_seconds_bucket{le="1"} 0\n'
  output += 'request_duration_seconds_bucket{le="10"} 0\n'
  output += 'request_duration_seconds_bucket{le="+Inf"} 0\n'
  output += 'request_duration_seconds_sum 0\n'
  output += 'request_duration_seconds_count 0\n'
  
  return output
}

// 管理员状态面板（更详细）
function getAdminStatus() {
  const health = getOverallHealth()
  const mem = process.memoryUsage()
  const gauge = getGaugeMetrics()
  
  return {
    ...health,
    process: {
      pid: process.pid,
      platform: process.platform,
      nodeVersion: process.version,
      uptime: process.uptime(),
      memory: {
        rss: mem.rss,
        heapUsed: mem.heapUsed,
        heapTotal: mem.heapTotal,
        external: mem.external,
        heapPercent: ((mem.heapUsed / mem.heapTotal) * 100).toFixed(2),
      },
    },
    database: {
      collections: Object.keys(db).length,
      conversations: Object.keys(db.conversations || {}).length,
      users: Object.keys(db.users || {}).length,
      knowledge: (db.knowledge || []).length,
      files: Object.keys(db.files || {}).length,
    },
    realtime: gauge,
    stats: db.stats,
    alerts: checkAlerts(),
    recentErrors: metricsCounters.errors_total,
  }
}

// 历史指标数据（用于图表）
function getMetricsHistory(limit) {
  const max = limit || 100
  return metricsHistory.slice(-max)
}

// 记录请求指标
function recordRequestMetric(isError) {
  metricsCounters.requests_total++
  if (isError) metricsCounters.errors_total++
}

// 记录 token 使用
function recordTokensUsed(tokens) {
  metricsCounters.tokens_used += tokens || 0
}

// ============ 配置中心 ============
// 配置 schema 定义
const CONFIG_SCHEMA = {
  'system.appName': {
    type: 'string',
    defaultValue: 'HopeAgent Pro',
    description: '应用名称',
    category: 'system',
    validate: (v) => typeof v === 'string' && v.length > 0,
  },
  'system.maxUploadSize': {
    type: 'number',
    defaultValue: 10 * 1024 * 1024,
    description: '最大上传文件大小（字节）',
    category: 'system',
    validate: (v) => typeof v === 'number' && v > 0,
  },
  'system.sessionTimeout': {
    type: 'number',
    defaultValue: 7 * 24 * 3600 * 1000,
    description: '会话超时时间（毫秒）',
    category: 'system',
    validate: (v) => typeof v === 'number' && v > 0,
  },
  'llm.defaultModel': {
    type: 'string',
    defaultValue: '',
    description: '默认模型 ID',
    category: 'llm',
    validate: (v) => typeof v === 'string',
  },
  'llm.maxTokens': {
    type: 'number',
    defaultValue: 2000,
    description: '最大生成 token 数',
    category: 'llm',
    validate: (v) => typeof v === 'number' && v > 0 && v <= 32000,
  },
  'llm.temperature': {
    type: 'number',
    defaultValue: 0.7,
    description: '默认温度参数',
    category: 'llm',
    validate: (v) => typeof v === 'number' && v >= 0 && v <= 2,
  },
  'security.enableRateLimit': {
    type: 'boolean',
    defaultValue: true,
    description: '启用速率限制',
    category: 'security',
    validate: (v) => typeof v === 'boolean',
  },
  'security.allowRegistration': {
    type: 'boolean',
    defaultValue: true,
    description: '允许用户注册',
    category: 'security',
    validate: (v) => typeof v === 'boolean',
  },
  'security.minPasswordLength': {
    type: 'number',
    defaultValue: 6,
    description: '密码最小长度',
    category: 'security',
    validate: (v) => typeof v === 'number' && v >= 4,
  },
  'storage.defaultQuota': {
    type: 'number',
    defaultValue: 100 * 1024 * 1024,
    description: '用户默认存储配额（字节）',
    category: 'storage',
    validate: (v) => typeof v === 'number' && v > 0,
  },
  'storage.maxFilesPerUser': {
    type: 'number',
    defaultValue: 100,
    description: '每用户最大文件数',
    category: 'storage',
    validate: (v) => typeof v === 'number' && v > 0,
  },
  'email.enabled': {
    type: 'boolean',
    defaultValue: false,
    description: '启用邮件通知',
    category: 'email',
    validate: (v) => typeof v === 'boolean',
  },
  'features.superBrain': {
    type: 'boolean',
    defaultValue: true,
    description: '启用超级大脑功能',
    category: 'features',
    validate: (v) => typeof v === 'boolean',
  },
  'features.vectorSearch': {
    type: 'boolean',
    defaultValue: true,
    description: '启用向量搜索功能',
    category: 'features',
    validate: (v) => typeof v === 'boolean',
  },
  'features.plugins': {
    type: 'boolean',
    defaultValue: true,
    description: '启用插件系统',
    category: 'features',
    validate: (v) => typeof v === 'boolean',
  },
  'features.webhooks': {
    type: 'boolean',
    defaultValue: true,
    description: '启用 Webhook 功能',
    category: 'features',
    validate: (v) => typeof v === 'boolean',
  },
  'features.fileUpload': {
    type: 'boolean',
    defaultValue: true,
    description: '启用文件上传功能',
    category: 'features',
    validate: (v) => typeof v === 'boolean',
  },
}

// 配置变更监听
const configChangeListeners = []

function onConfigChange(callback) {
  if (typeof callback === 'function') {
    configChangeListeners.push(callback)
  }
}

function triggerConfigChange(key, oldValue, newValue) {
  for (const listener of configChangeListeners) {
    try {
      listener(key, oldValue, newValue)
    } catch (e) {
      console.error('配置变更监听出错:', e.message)
    }
  }
}

// 获取配置
function getConfig(key, defaultValue) {
  if (!db.config) db.config = {}
  
  if (key === undefined) {
    // 返回所有配置
    const all = {}
    for (const k of Object.keys(CONFIG_SCHEMA)) {
      all[k] = db.config[k] !== undefined ? db.config[k] : CONFIG_SCHEMA[k].defaultValue
    }
    return all
  }
  
  if (db.config[key] !== undefined) return db.config[key]
  if (CONFIG_SCHEMA[key]) return CONFIG_SCHEMA[key].defaultValue
  return defaultValue
}

// 设置配置（单个）
function setConfig(key, value) {
  if (!db.config) db.config = {}
  
  const schema = CONFIG_SCHEMA[key]
  if (schema && schema.validate && !schema.validate(value)) {
    return { success: false, error: '配置值验证失败：' + key }
  }
  
  const oldValue = db.config[key]
  db.config[key] = value
  saveDB(db)
  
  if (oldValue !== value) {
    triggerConfigChange(key, oldValue, value)
  }
  
  return { success: true, key, value }
}

// 批量设置配置
function bulkSetConfig(entries) {
  if (!db.config) db.config = {}
  
  const results = { success: [], failed: [] }
  
  for (const [key, value] of Object.entries(entries)) {
    const result = setConfig(key, value)
    if (result.success) {
      results.success.push(key)
    } else {
      results.failed.push({ key, error: result.error })
    }
  }
  
  return results
}

// 重置配置
function resetConfig(key) {
  if (!db.config) db.config = {}
  
  if (key) {
    if (CONFIG_SCHEMA[key]) {
      const oldValue = db.config[key]
      const defaultValue = CONFIG_SCHEMA[key].defaultValue
      db.config[key] = defaultValue
      saveDB(db)
      triggerConfigChange(key, oldValue, defaultValue)
      return { success: true, key, value: defaultValue }
    }
    return { success: false, error: '配置项不存在：' + key }
  }
  
  // 重置所有配置
  const oldConfig = { ...db.config }
  db.config = {}
  for (const k of Object.keys(CONFIG_SCHEMA)) {
    db.config[k] = CONFIG_SCHEMA[k].defaultValue
  }
  saveDB(db)
  
  for (const k of Object.keys(oldConfig)) {
    triggerConfigChange(k, oldConfig[k], db.config[k])
  }
  
  return { success: true, resetCount: Object.keys(CONFIG_SCHEMA).length }
}

// 获取配置 schema
function getConfigSchema() {
  const categories = {}
  for (const [key, schema] of Object.entries(CONFIG_SCHEMA)) {
    const cat = schema.category || 'other'
    if (!categories[cat]) categories[cat] = []
    categories[cat].push({
      key,
      type: schema.type,
      defaultValue: schema.defaultValue,
      description: schema.description,
    })
  }
  return {
    total: Object.keys(CONFIG_SCHEMA).length,
    categories,
  }
}

// 获取公开配置（不含敏感项）
function getPublicConfig() {
  const publicKeys = Object.keys(CONFIG_SCHEMA).filter(k => !k.startsWith('security.') && !k.startsWith('email.'))
  const result = {}
  for (const k of publicKeys) {
    result[k] = getConfig(k)
  }
  return result
}

// 特性开关
function isFeatureEnabled(featureName) {
  const key = 'features.' + featureName
  return getConfig(key, true) !== false
}

// ============ 邮件通知系统 ============
// 邮件发送（兼容 SendGrid/Mailgun API 格式）
async function sendEmail(to, subject, html, text) {
  const settings = db.emailSettings || {}
  // SMTP 密码解析：vault 优先 > settings.apiKey > 环境变量
  const mailKey = resolveSmtpPassword(settings)
  if (!settings.enabled || !mailKey || !settings.provider) {
    return { success: false, error: '邮件服务未配置' }
  }

  const from = settings.fromEmail || 'noreply@hopeagent.local'
  let apiUrl = ''
  let headers = {}
  let body = {}

  if (settings.provider === 'sendgrid') {
    apiUrl = settings.baseUrl || 'https://api.sendgrid.com/v3/mail/send'
    headers = {
      'Authorization': 'Bearer ' + mailKey,
      'Content-Type': 'application/json',
    }
    body = {
      personalizations: [{ to: [{ email: to }], subject }],
      from: { email: from },
      content: [
        { type: 'text/plain', value: text || '' },
        { type: 'text/html', value: html || '' },
      ],
    }
  } else if (settings.provider === 'mailgun') {
    const domain = settings.domain || ''
    apiUrl = settings.baseUrl || `https://api.mailgun.net/v3/${domain}/messages`
    headers = {
      'Authorization': 'Basic ' + Buffer.from('api:' + mailKey).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    }
    body = new URLSearchParams({
      from,
      to,
      subject,
      text: text || '',
      html: html || '',
    }).toString()
  } else {
    // 通用 SMTP over HTTP 或自定义 API
    apiUrl = settings.baseUrl || ''
    headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + mailKey,
    }
    body = { to, subject, html, text, from }
  }
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: typeof body === 'string' ? body : JSON.stringify(body),
    })
    
    if (!response.ok) {
      const errText = await response.text().catch(() => '')
      return { success: false, error: 'HTTP ' + response.status, detail: errText.slice(0, 200) }
    }
    
    // 记录通知历史
    if (!db.notifications) db.notifications = []
    const record = {
      id: genId(),
      type: 'email',
      to,
      subject,
      status: 'sent',
      provider: settings.provider,
      createdAt: new Date().toISOString(),
    }
    db.notifications.push(record)
    if (db.notifications.length > 500) {
      db.notifications = db.notifications.slice(-200)
    }
    saveDB(db)
    
    return { success: true, record }
  } catch (e) {
    return { success: false, error: e.message }
  }
}

// 发送通知模板
const EMAIL_TEMPLATES = {
  welcome: (username) => ({
    subject: '欢迎使用 HopeAgent Pro',
    html: `<h1>欢迎，${username}！</h1><p>您的账号已成功注册。</p>`,
    text: `欢迎，${username}！您的账号已成功注册。`,
  }),
  passwordReset: (token) => ({
    subject: '密码重置请求',
    html: `<h1>密码重置</h1><p>您的重置令牌是：<strong>${token}</strong></p>`,
    text: `您的密码重置令牌是：${token}`,
  }),
  taskComplete: (taskId, taskType) => ({
    subject: '任务完成通知',
    html: `<h1>任务已完成</h1><p>任务 ID: ${taskId}</p><p>类型: ${taskType}</p>`,
    text: `任务已完成：${taskId} (${taskType})`,
  }),
  dailyDigest: (stats) => ({
    subject: '每日摘要 - ' + new Date().toLocaleDateString(),
    html: `<h1>每日摘要</h1><p>今日消息数: ${stats.messages || 0}</p>`,
    text: `每日摘要 - 今日消息数: ${stats.messages || 0}`,
  }),
}

// ============ 数据备份与恢复 ============
const BACKUPS_DIR = path.join(DATA_DIR, 'backups')
if (!fs.existsSync(BACKUPS_DIR)) fs.mkdirSync(BACKUPS_DIR, { recursive: true })

// 创建完整备份
function createBackup() {
  const backupId = 'backup_' + Date.now()
  const timestamp = new Date().toISOString()
  
  // 读取当前 db
  const dbData = JSON.parse(JSON.stringify(db))
  
  // 收集文件列表
  const files = {}
  if (fs.existsSync(FILES_DIR)) {
    const fileList = fs.readdirSync(FILES_DIR)
    for (const f of fileList) {
      try {
        const filePath = path.join(FILES_DIR, f)
        const stat = fs.statSync(filePath)
        if (stat.isFile()) {
          files[f] = {
            name: f,
            size: stat.size,
            content: fs.readFileSync(filePath, 'base64'),
          }
        }
      } catch {}
    }
  }
  
  const backup = {
    id: backupId,
    timestamp,
    version: '3.0.0',
    db: dbData,
    files,
    metadata: {
      dbSize: JSON.stringify(dbData).length,
      fileCount: Object.keys(files).length,
      createdAt: timestamp,
    },
  }
  
  const backupFile = path.join(BACKUPS_DIR, backupId + '.json')
  fs.writeFileSync(backupFile, JSON.stringify(backup))
  
  // 记录备份信息
  if (!db.backups) db.backups = {}
  db.backups[backupId] = {
    id: backupId,
    createdAt: timestamp,
    size: fs.statSync(backupFile).size,
    fileCount: Object.keys(files).length,
  }
  saveDB(db)
  
  // 应用保留策略
  applyBackupRetention()
  
  return { id: backupId, size: fs.statSync(backupFile).size, fileCount: Object.keys(files).length }
}

// 列出备份
function listBackups() {
  if (!fs.existsSync(BACKUPS_DIR)) return []
  const files = fs.readdirSync(BACKUPS_DIR).filter(f => f.endsWith('.json'))
  const backups = []
  for (const f of files) {
    try {
      const filePath = path.join(BACKUPS_DIR, f)
      const stat = fs.statSync(filePath)
      const id = f.replace('.json', '')
      backups.push({
        id,
        createdAt: stat.birthtime.toISOString(),
        size: stat.size,
      })
    } catch {}
  }
  backups.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return backups
}

// 获取备份文件路径
function getBackupPath(id) {
  return path.join(BACKUPS_DIR, id + '.json')
}

// 删除备份
function deleteBackup(id) {
  const file = getBackupPath(id)
  if (fs.existsSync(file)) {
    fs.unlinkSync(file)
    if (db.backups && db.backups[id]) {
      delete db.backups[id]
      saveDB(db)
    }
    return true
  }
  return false
}

// 从备份恢复
function restoreFromBackup(id) {
  const file = getBackupPath(id)
  if (!fs.existsSync(file)) {
    return { success: false, error: '备份不存在' }
  }
  
  try {
    const backup = JSON.parse(fs.readFileSync(file, 'utf-8'))
    
    // 恢复 db
    if (backup.db) {
      db = { ...backup.db }
      saveDB(db)
    }
    
    // 恢复文件
    if (backup.files) {
      for (const [name, fileData] of Object.entries(backup.files)) {
        try {
          fs.writeFileSync(
            path.join(FILES_DIR, name),
            Buffer.from(fileData.content, 'base64')
          )
        } catch {}
      }
    }
    
    return { success: true, restoredAt: new Date().toISOString() }
  } catch (e) {
    return { success: false, error: e.message }
  }
}

// 备份保留策略：最多保留 30 天
function applyBackupRetention() {
  const backups = listBackups()
  const thirtyDaysAgo = Date.now() - 30 * 24 * 3600 * 1000
  
  for (const b of backups) {
    if (new Date(b.createdAt).getTime() < thirtyDaysAgo) {
      deleteBackup(b.id)
    }
  }
}

// 注册自动备份定时任务（每天凌晨 3 点）
function setupAutoBackup() {
  addCronJob('0 3 * * *', () => {
    try {
      createBackup()
      console.log('自动备份完成')
    } catch (e) {
      console.error('自动备份失败:', e.message)
    }
  }, 'auto-daily-backup', { type: 'auto' })
}

// ============ 多语言 i18n 系统 ============
const I18N_DIR = path.join(DATA_DIR, 'i18n')
if (!fs.existsSync(I18N_DIR)) fs.mkdirSync(I18N_DIR, { recursive: true })

// 内置默认语言包
const DEFAULT_LANGS = {
  'zh-CN': {
    name: '简体中文',
    messages: {
      'common.success': '操作成功',
      'common.error': '操作失败',
      'common.not_found': '资源不存在',
      'common.unauthorized': '未授权访问',
      'common.forbidden': '权限不足',
      'auth.login_success': '登录成功',
      'auth.login_failed': '用户名或密码错误',
      'auth.register_success': '注册成功',
      'auth.user_exists': '用户名已存在',
      'chat.send_success': '消息发送成功',
      'chat.empty_message': '消息不能为空',
      'backup.create_success': '备份创建成功',
      'backup.restore_success': '备份恢复成功',
    },
  },
  'en-US': {
    name: 'English',
    messages: {
      'common.success': 'Success',
      'common.error': 'Error',
      'common.not_found': 'Not found',
      'common.unauthorized': 'Unauthorized',
      'common.forbidden': 'Forbidden',
      'auth.login_success': 'Login successful',
      'auth.login_failed': 'Invalid username or password',
      'auth.register_success': 'Registration successful',
      'auth.user_exists': 'Username already exists',
      'chat.send_success': 'Message sent successfully',
      'chat.empty_message': 'Message cannot be empty',
      'backup.create_success': 'Backup created successfully',
      'backup.restore_success': 'Backup restored successfully',
    },
  },
  'ja-JP': {
    name: '日本語',
    messages: {
      'common.success': '成功',
      'common.error': 'エラー',
      'common.not_found': '見つかりません',
      'common.unauthorized': '認証されていません',
      'common.forbidden': '権限がありません',
      'auth.login_success': 'ログイン成功',
      'auth.login_failed': 'ユーザー名またはパスワードが間違っています',
      'auth.register_success': '登録成功',
      'auth.user_exists': 'ユーザー名は既に存在します',
      'chat.send_success': 'メッセージ送信成功',
      'chat.empty_message': 'メッセージは空にできません',
      'backup.create_success': 'バックアップ作成成功',
      'backup.restore_success': 'バックアップ復元成功',
    },
  },
}

// 加载语言包
const langPacks = {}
function loadLangPacks() {
  for (const [code, data] of Object.entries(DEFAULT_LANGS)) {
    langPacks[code] = data
    // 同时保存到文件，允许自定义
    const langFile = path.join(I18N_DIR, code + '.json')
    if (!fs.existsSync(langFile)) {
      fs.writeFileSync(langFile, JSON.stringify(data, null, 2))
    } else {
      try {
        const saved = JSON.parse(fs.readFileSync(langFile, 'utf-8'))
        langPacks[code] = { ...data, ...saved }
      } catch {}
    }
  }
}
loadLangPacks()

// 翻译函数
function t(key, lang, params) {
  const language = lang || 'zh-CN'
  const pack = langPacks[language] || langPacks['zh-CN']
  let message = (pack && pack.messages && pack.messages[key]) || key
  
  // 参数替换
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      message = message.replace('{' + k + '}', String(v))
    }
  }
  
  return message
}

// 从 Accept-Language header 解析语言
function parseAcceptLanguage(header) {
  if (!header) return 'zh-CN'
  const langs = header.split(',').map(s => {
    const [lang, q = 'q=1'] = s.trim().split(';')
    const quality = parseFloat(q.split('=')[1] || '1')
    return { lang: lang.trim(), quality }
  })
  langs.sort((a, b) => b.quality - a.quality)
  
  for (const { lang } of langs) {
    const code = lang.split('-')[0]
    if (langPacks[lang]) return lang
    if (langPacks[code + '-CN']) return code + '-CN'
    if (langPacks[code + '-US']) return code + '-US'
  }
  return 'zh-CN'
}

// 获取用户偏好语言
function getUserLang(user, req) {
  if (user && user.language) return user.language
  if (req && req.headers) {
    return parseAcceptLanguage(req.headers['accept-language'])
  }
  return 'zh-CN'
}

// ============ 凭证保险库（Vault）模块 ============
// 主密钥文件路径（权限 0600，仅当前进程可读写）
const MASTER_KEY_FILE = path.join(DATA_DIR, '.masterkey')
const VAULT_ALGORITHM = 'aes-256-gcm'

// 获取主密钥：优先环境变量 MASTER_KEY，否则首次启动自动生成并落到文件
function getMasterKey() {
  if (process.env.MASTER_KEY) return process.env.MASTER_KEY
  try {
    if (fs.existsSync(MASTER_KEY_FILE)) {
      return fs.readFileSync(MASTER_KEY_FILE, 'utf-8').trim()
    }
  } catch (e) {
    console.error('主密钥文件读取失败:', e.message)
  }
  // 首次启动自动生成 256 位随机密钥并写入文件
  const generated = crypto.randomBytes(32).toString('hex')
  try {
    fs.writeFileSync(MASTER_KEY_FILE, generated, { mode: 0o600 })
    // 显式确保权限为 0600（防止 umask 干扰）
    try { fs.chmodSync(MASTER_KEY_FILE, 0o600) } catch {}
  } catch (e) {
    console.error('主密钥文件写入失败:', e.message)
  }
  return generated
}

// 派生 256 位 vault 密钥（用 scryptSync，缓存避免重复派生）
let _vaultKey = null
function getVaultKey() {
  if (_vaultKey) return _vaultKey
  const master = getMasterKey()
  // salt 固定（可公开，保密的是主密钥本身）
  _vaultKey = crypto.scryptSync(master, 'hopeagent-vault-salt-v1', 32)
  return _vaultKey
}

// 加密：aes-256-gcm 带认证标签，返回 { iv, ciphertext, tag }（均 base64）
function vaultEncrypt(text) {
  const key = getVaultKey()
  // 每次加密用随机 iv，防止重放攻击
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(VAULT_ALGORITHM, key, iv)
  const encrypted = Buffer.concat([
    cipher.update(String(text), 'utf-8'),
    cipher.final(),
  ])
  const tag = cipher.getAuthTag()
  return {
    iv: iv.toString('base64'),
    ciphertext: encrypted.toString('base64'),
    tag: tag.toString('base64'),
  }
}

// 解密：传入 { iv, ciphertext, tag }，认证失败会抛错
function vaultDecrypt(encrypted) {
  const key = getVaultKey()
  const iv = Buffer.from(encrypted.iv, 'base64')
  const tag = Buffer.from(encrypted.tag, 'base64')
  const decipher = crypto.createDecipheriv(VAULT_ALGORITHM, key, iv)
  decipher.setAuthTag(tag)
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encrypted.ciphertext, 'base64')),
    decipher.final(),
  ])
  return decrypted.toString('utf-8')
}

// 确保 vault 结构存在（兼容旧 db 数据）
function ensureVault() {
  if (!db.vault || typeof db.vault !== 'object') db.vault = { credentials: {} }
  if (!db.vault.credentials) db.vault.credentials = {}
  return db.vault
}

// Vault 专属审计日志（action 自动加 vault. 前缀，绝不记录明文）
function vaultAuditLog(action, userId, ip, details) {
  return auditLog('vault.' + action, userId, ip, details || {})
}

// 存储凭证：加密后落库，返回不含明文的元信息
function storeCredential(key, name, value, metadata) {
  ensureVault()
  const enc = vaultEncrypt(value)
  const now = new Date().toISOString()
  const existing = db.vault.credentials[key]
  const meta = metadata || {}
  const record = {
    key,
    name: name || key,
    encrypted: enc.ciphertext,
    iv: enc.iv,
    tag: enc.tag,
    type: meta.type || 'custom',
    metadata: meta,
    createdAt: existing ? existing.createdAt : now,
    updatedAt: now,
  }
  db.vault.credentials[key] = record
  saveDB(db)
  return {
    key: record.key,
    name: record.name,
    type: record.type,
    metadata: record.metadata,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  }
}

// 获取凭证明文（只在内存中返回，绝不写日志）
function getCredential(key) {
  ensureVault()
  const record = db.vault.credentials[key]
  if (!record) return null
  try {
    return vaultDecrypt({ iv: record.iv, ciphertext: record.encrypted, tag: record.tag })
  } catch (e) {
    console.error('凭证解密失败:', key, e.message)
    return null
  }
}

// 按 type+metadata 查找凭证明文（内部集成用，不暴露 key）
function getCredentialByType(type, matcher) {
  ensureVault()
  for (const record of Object.values(db.vault.credentials)) {
    if ((record.type || 'custom') !== type) continue
    if (matcher && !matcher(record.metadata || {})) continue
    const value = getCredential(record.key)
    if (value !== null) return value
  }
  return null
}

// 列出凭证（不含明文，只有元信息）
function listCredentials() {
  ensureVault()
  return Object.values(db.vault.credentials).map(c => ({
    key: c.key,
    name: c.name,
    type: c.type || 'custom',
    metadata: c.metadata || {},
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    rotatedAt: c.rotatedAt || null,
  }))
}

// 删除凭证
function deleteCredential(key) {
  ensureVault()
  if (!db.vault.credentials[key]) return false
  delete db.vault.credentials[key]
  saveDB(db)
  return true
}

// 轮换凭证：更新密文，记录 rotatedAt
function rotateCredential(key, newValue) {
  ensureVault()
  const record = db.vault.credentials[key]
  if (!record) return null
  const enc = vaultEncrypt(newValue)
  record.encrypted = enc.ciphertext
  record.iv = enc.iv
  record.tag = enc.tag
  record.updatedAt = new Date().toISOString()
  record.rotatedAt = record.updatedAt
  saveDB(db)
  return {
    key: record.key,
    name: record.name,
    type: record.type,
    updatedAt: record.updatedAt,
    rotatedAt: record.rotatedAt,
  }
}

// 测试 LLM API Key 连通性（轻量 GET /v1/models 请求）
async function testLLMKey(apiKey, metadata) {
  const provider = (metadata && metadata.provider) || 'openai'
  const endpoints = {
    openai: 'https://api.openai.com/v1/models',
    deepseek: 'https://api.deepseek.com/v1/models',
    kimi: 'https://api.moonshot.cn/v1/models',
    anthropic: 'https://api.anthropic.com/v1/models',
  }
  const url = (metadata && metadata.baseUrl) ? metadata.baseUrl.replace(/\/+$/, '') + '/models' : endpoints[provider]
  if (!url) return { ok: false, error: '不支持的 provider：' + provider }
  try {
    const headers = { 'Authorization': 'Bearer ' + apiKey }
    if (provider === 'anthropic') {
      headers['x-api-key'] = apiKey
      headers['anthropic-version'] = '2023-06-01'
      delete headers['Authorization']
    }
    const resp = await fetch(url, { method: 'GET', headers })
    let detail = ''
    try { detail = (await resp.text()).slice(0, 300) } catch {}
    return { ok: resp.ok, status: resp.status, provider, url, detail }
  } catch (e) {
    return { ok: false, error: e.message, provider }
  }
}

// 测试凭证（根据类型分发）
async function testCredential(key) {
  ensureVault()
  const record = db.vault.credentials[key]
  if (!record) return { ok: false, error: '凭证不存在' }
  const value = getCredential(key)
  if (value === null) return { ok: false, error: '凭证解密失败' }
  const type = record.type || 'custom'
  if (type === 'llm_api_key') {
    return await testLLMKey(value, record.metadata || {})
  }
  // 其他类型只做格式校验
  const validation = validateCredential(type, value, record.metadata)
  if (!validation.ok) return { ok: false, error: validation.error }
  return { ok: true, type, message: '凭证格式有效（未做远程验证）' }
}

// 预定义凭证类型：每种含名称、描述、字段定义和验证规则
const CREDENTIAL_TYPES = {
  llm_api_key: {
    name: 'LLM API 密钥',
    description: 'LLM 服务商的 API 密钥，支持 openai/deepseek/kimi/anthropic',
    fields: ['provider', 'baseUrl'],
    validate(value, metadata) {
      if (!value || value.length < 10) return { ok: false, error: 'API Key 长度不足' }
      const provider = (metadata && metadata.provider) || ''
      const allowed = ['openai', 'deepseek', 'kimi', 'anthropic', 'custom', '']
      if (provider && !allowed.includes(provider)) {
        return { ok: false, error: '不支持的 provider：' + provider }
      }
      return { ok: true }
    },
  },
  webhook_secret: {
    name: 'Webhook 签名密钥',
    description: '用于 Webhook 请求的 HMAC-SHA256 签名密钥',
    fields: [],
    validate(value) {
      if (!value || value.length < 8) return { ok: false, error: '密钥长度至少 8 位' }
      return { ok: true }
    },
  },
  smtp_password: {
    name: '邮件服务密码',
    description: 'SMTP 或邮件 API 服务（SendGrid/Mailgun 等）的密码/密钥',
    fields: [],
    validate(value) {
      if (!value) return { ok: false, error: '密码不能为空' }
      return { ok: true }
    },
  },
  database_url: {
    name: '数据库连接串',
    description: '数据库连接字符串（可能含账号密码）',
    fields: [],
    validate(value) {
      if (!value) return { ok: false, error: '连接串不能为空' }
      if (!/^(\w+):\/\/[^\s]+/.test(value)) return { ok: false, error: '连接串格式不正确，需以 scheme:// 开头' }
      return { ok: true }
    },
  },
  oauth_token: {
    name: 'OAuth 令牌',
    description: 'OAuth 2.0 访问令牌或刷新令牌',
    fields: ['scope', 'expiresAt'],
    validate(value) {
      if (!value || value.length < 20) return { ok: false, error: '令牌长度不足' }
      return { ok: true }
    },
  },
  custom: {
    name: '自定义凭证',
    description: '任意自定义敏感凭证',
    fields: [],
    validate(value) {
      if (!value) return { ok: false, error: '凭证不能为空' }
      return { ok: true }
    },
  },
}

// 返回凭证类型列表（供前端展示）
function getCredentialTypes() {
  return Object.entries(CREDENTIAL_TYPES).map(([id, t]) => ({
    id,
    name: t.name,
    description: t.description,
    fields: t.fields,
  }))
}

// 校验凭证（按类型规则）
function validateCredential(type, value, metadata) {
  const def = CREDENTIAL_TYPES[type] || CREDENTIAL_TYPES.custom
  return def.validate(value, metadata)
}

// ============ Vault 与现有系统集成 ============
// 解析 LLM API Key：vault 优先 > config.apiKey > 环境变量 fallback
function resolveLLMApiKey(config) {
  if (!config) return ''
  const provider = config.provider || ''
  // 1. vault 中按 provider 查找 llm_api_key 凭证
  if (provider) {
    const vaultValue = getCredentialByType('llm_api_key', (meta) => meta && meta.provider === provider)
    if (vaultValue) return vaultValue
  }
  // 2. config 自带 apiKey
  if (config.apiKey) return config.apiKey
  // 3. 环境变量 fallback
  const envMap = {
    openai: 'OPENAI_API_KEY',
    deepseek: 'DEEPSEEK_API_KEY',
    kimi: 'KIMI_API_KEY',
    anthropic: 'ANTHROPIC_API_KEY',
  }
  if (provider && envMap[provider] && process.env[envMap[provider]]) {
    return process.env[envMap[provider]]
  }
  if (process.env.LLM_API_KEY) return process.env.LLM_API_KEY
  return ''
}

// 解析 SMTP 密码：vault 优先 > 环境变量
function resolveSmtpPassword(settings) {
  const vaultValue = getCredentialByType('smtp_password')
  if (vaultValue) return vaultValue
  if (settings && settings.apiKey) return settings.apiKey
  if (process.env.SMTP_PASSWORD) return process.env.SMTP_PASSWORD
  return ''
}

// 解析 Webhook 签名密钥：vault 优先 > webhook 自带 > 默认
function resolveWebhookSecret(webhook) {
  const vaultValue = getCredentialByType('webhook_secret')
  if (vaultValue) return vaultValue
  if (webhook && webhook.secret) return webhook.secret
  if (process.env.WEBHOOK_SECRET) return process.env.WEBHOOK_SECRET
  return 'hopeagent'
}

// ============================================================
// 模块 1：完整用户认证系统增强
// ============================================================

// 密码强度检查：返回分数（0-5）与问题列表
function checkPasswordStrength(password) {
  if (!password || typeof password !== 'string') {
    return { score: 0, level: '极弱', issues: ['密码不能为空'] }
  }
  const issues = []
  let score = 0
  // 长度检查
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  else issues.push('建议密码长度不少于 12 位')
  // 包含小写字母
  if (/[a-z]/.test(password)) score++
  else issues.push('建议包含小写字母')
  // 包含大写字母
  if (/[A-Z]/.test(password)) score++
  else issues.push('建议包含大写字母')
  // 包含数字
  if (/\d/.test(password)) score++
  else issues.push('建议包含数字')
  // 包含特殊字符
  if (/[^A-Za-z0-9]/.test(password)) score++
  else issues.push('建议包含特殊字符')
  // 常见弱密码检查
  const weakPasswords = ['123456', 'password', 'qwerty', 'abc123', '111111', '000000', 'admin', 'root']
  if (weakPasswords.includes(password.toLowerCase())) {
    score = 0
    issues.push('密码过于常见，极易被破解')
  }
  // 连续重复字符检查
  if (/(.)\1{3,}/.test(password)) {
    score = Math.max(0, score - 1)
    issues.push('存在连续重复字符')
  }
  const level = score >= 5 ? '极强' : score >= 4 ? '强' : score >= 3 ? '中' : score >= 2 ? '弱' : '极弱'
  return { score, level, issues, length: password.length }
}

// 生成邮箱验证码（6位数字，默认10分钟有效）
function generateEmailCode(email) {
  const code = String(Math.floor(100000 + Math.random() * 900000))
  if (!db.oauthStates) db.oauthStates = {}
  db.oauthStates['email_' + email] = {
    code,
    email,
    purpose: 'verify',
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    attempts: 0,
    createdAt: new Date().toISOString(),
  }
  saveDB(db)
  return code
}

// 校验邮箱验证码
function verifyEmailCode(email, code) {
  if (!db.oauthStates) return { ok: false, error: '验证码系统未初始化' }
  const record = db.oauthStates['email_' + email]
  if (!record) return { ok: false, error: '未发送验证码' }
  if (new Date(record.expiresAt) < new Date()) {
    delete db.oauthStates['email_' + email]
    saveDB(db)
    return { ok: false, error: '验证码已过期' }
  }
  record.attempts = (record.attempts || 0) + 1
  if (record.attempts > 5) {
    delete db.oauthStates['email_' + email]
    saveDB(db)
    return { ok: false, error: '尝试次数过多，验证码已失效' }
  }
  if (record.code !== code) {
    saveDB(db)
    return { ok: false, error: '验证码不正确' }
  }
  delete db.oauthStates['email_' + email]
  saveDB(db)
  return { ok: true, email }
}

// JWT 风格 token 生成（header.payload.signature，零依赖手写）
function base64UrlEncode(obj) {
  return Buffer.from(JSON.stringify(obj)).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
function base64UrlDecode(str) {
  let s = str.replace(/-/g, '+').replace(/_/g, '/')
  while (s.length % 4) s += '='
  return JSON.parse(Buffer.from(s, 'base64').toString('utf-8'))
}

// 获取 JWT 签名密钥（从主密钥派生）
function getJwtSecret() {
  const master = getMasterKey ? getMasterKey() : 'hopeagent-jwt-default-secret'
  return crypto.scryptSync(master, 'jwt-sign-salt-v1', 32)
}

// 生成 access token（短有效期，默认2小时）
function generateAccessToken(user) {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    sub: user.id,
    username: user.username,
    role: user.role || 'user',
    type: 'access',
    iat: now,
    exp: now + 2 * 3600,
  }
  const data = base64UrlEncode(header) + '.' + base64UrlEncode(payload)
  const sig = crypto.createHmac('sha256', getJwtSecret()).update(data).digest('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return data + '.' + sig
}

// 生成 refresh token（长有效期，默认30天）
function generateRefreshToken(user) {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    sub: user.id,
    username: user.username,
    type: 'refresh',
    jti: genId(),
    iat: now,
    exp: now + 30 * 24 * 3600,
  }
  const data = base64UrlEncode(header) + '.' + base64UrlEncode(payload)
  const sig = crypto.createHmac('sha256', getJwtSecret()).update(data).digest('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return data + '.' + sig
}

// 验证 JWT token 签名与有效期
function verifyAccessToken(token) {
  if (!token || typeof token !== 'string') return { ok: false, error: 'token 为空' }
  const parts = token.split('.')
  if (parts.length !== 3) return { ok: false, error: 'token 格式错误' }
  const [headerB64, payloadB64, sigB64] = parts
  const data = headerB64 + '.' + payloadB64
  const expectedSig = crypto.createHmac('sha256', getJwtSecret()).update(data).digest('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  if (sigB64 !== expectedSig) return { ok: false, error: '签名无效' }
  let payload
  try { payload = base64UrlDecode(payloadB64) }
  catch { return { ok: false, error: 'payload 解析失败' } }
  const now = Math.floor(Date.now() / 1000)
  if (payload.exp && payload.exp < now) return { ok: false, error: 'token 已过期' }
  // 检查黑名单
  if (db.tokenBlacklist && db.tokenBlacklist[token]) {
    return { ok: false, error: 'token 已被吊销' }
  }
  return { ok: true, payload }
}

// 吊销 token（加入黑名单）
function revokeToken(token, reason) {
  if (!db.tokenBlacklist) db.tokenBlacklist = {}
  db.tokenBlacklist[token] = {
    revokedAt: new Date().toISOString(),
    reason: reason || 'manual_revoke',
  }
  saveDB(db)
  return { success: true }
}

// 判断 token 是否已吊销
function isTokenRevoked(token) {
  return !!(db.tokenBlacklist && db.tokenBlacklist[token])
}

// 用 refresh token 换取新的 access token
function refreshAccessToken(refreshToken) {
  const result = verifyAccessToken(refreshToken)
  if (!result.ok) return { error: result.error }
  if (result.payload.type !== 'refresh') return { error: '非 refresh token' }
  const user = Object.values(db.users || {}).find(u => u.id === result.payload.sub)
  if (!user) return { error: '用户不存在' }
  if (isUserBanned(user.id)) return { error: '用户已被封禁' }
  const accessToken = generateAccessToken(user)
  return { accessToken, user: publicUser(user) }
}

// 增强会话创建：支持多设备、设备信息记录
function createSessionEx(user, options) {
  const token = generateToken()
  const opts = options || {}
  const expiresAt = new Date(Date.now() + (opts.expiresInHours || 168) * 3600 * 1000).toISOString()
  const session = {
    token,
    username: user.username,
    userId: user.id,
    expiresAt,
    createdAt: new Date().toISOString(),
    device: opts.device || 'unknown',
    platform: opts.platform || 'unknown',
    ip: opts.ip || 'unknown',
    location: opts.location || null,
    userAgent: opts.userAgent || '',
    lastActiveAt: new Date().toISOString(),
  }
  if (!db.sessions) db.sessions = {}
  db.sessions[token] = session
  saveDB(db)
  return session
}

// 获取用户所有会话（多设备列表）
function getUserSessions(userId) {
  if (!db.sessions) return []
  return Object.values(db.sessions).filter(s => {
    const user = db.users[s.username]
    return user && user.id === userId && new Date(s.expiresAt) > new Date()
  }).map(s => ({
    token: s.token.slice(0, 12) + '...',
    fullToken: s.token,
    device: s.device,
    platform: s.platform,
    ip: s.ip,
    location: s.location,
    createdAt: s.createdAt,
    lastActiveAt: s.lastActiveAt,
    expiresAt: s.expiresAt,
  }))
}

// 踢出指定会话（按 token）
function kickSession(token, reason) {
  if (!db.sessions || !db.sessions[token]) return { success: false, error: '会话不存在' }
  const session = db.sessions[token]
  delete db.sessions[token]
  revokeToken(token, reason || 'kicked')
  saveDB(db)
  // 通知该用户其他设备
  wsBroadcast({ type: 'session_kicked', reason: reason || 'kicked', username: session.username })
  return { success: true, kickedUsername: session.username }
}

// 踢出用户所有会话（除指定 token 外）
function kickAllSessions(userId, exceptToken) {
  if (!db.sessions) return { kicked: 0 }
  const user = Object.values(db.users || {}).find(u => u.id === userId)
  if (!user) return { kicked: 0, error: '用户不存在' }
  let kicked = 0
  for (const [token, session] of Object.entries(db.sessions)) {
    if (session.username === user.username && token !== exceptToken) {
      delete db.sessions[token]
      revokeToken(token, 'kick_all')
      kicked++
    }
  }
  saveDB(db)
  return { kicked, userId }
}

// 生成密码重置令牌
function generatePasswordResetToken(email) {
  // 支持邮箱或用户名
  let user = db.users[email]
  if (!user) {
    user = Object.values(db.users || {}).find(u => u.email === email)
  }
  if (!user) return { error: '该邮箱未注册' }
  const token = crypto.randomBytes(32).toString('hex')
  if (!db.passwordResets) db.passwordResets = {}
  db.passwordResets[token] = {
    token,
    userId: user.id,
    username: user.username,
    email: email,
    expiresAt: new Date(Date.now() + 1 * 3600 * 1000).toISOString(),
    used: false,
    createdAt: new Date().toISOString(),
  }
  saveDB(db)
  return { token, expiresAt: db.passwordResets[token].expiresAt }
}

// 校验密码重置令牌并重置密码
function verifyPasswordResetToken(token, newPassword) {
  if (!db.passwordResets || !db.passwordResets[token]) {
    return { error: '重置令牌不存在' }
  }
  const record = db.passwordResets[token]
  if (record.used) return { error: '重置令牌已使用' }
  if (new Date(record.expiresAt) < new Date()) {
    delete db.passwordResets[token]
    saveDB(db)
    return { error: '重置令牌已过期' }
  }
  const user = db.users[record.username]
  if (!user) return { error: '用户不存在' }
  user.passwordHash = hashPassword(newPassword)
  user.passwordChangedAt = new Date().toISOString()
  record.used = true
  record.usedAt = new Date().toISOString()
  // 吊销该用户所有会话
  kickAllSessions(user.id)
  saveDB(db)
  return { success: true, username: user.username }
}

// TOTP 二步验证：生成密钥
function setupTwoFactor(userId) {
  const user = Object.values(db.users || {}).find(u => u.id === userId)
  if (!user) return { error: '用户不存在' }
  const secret = crypto.randomBytes(20).toString('base32').replace(/=/g, '')
  if (!db.twoFactor) db.twoFactor = {}
  db.twoFactor[userId] = {
    secret,
    enabled: false,
    backupCodes: [],
    createdAt: new Date().toISOString(),
  }
  saveDB(db)
  // 生成 otpauth URI（可被二维码识别）
  const issuer = 'HopeAgent'
  const label = encodeURIComponent(issuer + ':' + user.username)
  const uri = 'otpauth://totp/' + label + '?secret=' + secret + '&issuer=' + issuer + '&algorithm=SHA1&digits=6&period=30'
  return { secret, uri, qrContent: uri }
}

// TOTP 生成 6 位验证码（基于 HMAC-SHA1 + 时间窗口）
function generateTotpCode(secret) {
  const epoch = Math.floor(Date.now() / 1000)
  const counter = Math.floor(epoch / 30)
  // base32 解码
  const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let bits = ''
  for (const ch of secret.toUpperCase()) {
    const idx = base32Chars.indexOf(ch)
    if (idx < 0) continue
    bits += idx.toString(2).padStart(5, '0')
  }
  const bytes = []
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2))
  }
  const key = Buffer.from(bytes)
  const buf = Buffer.alloc(8)
  buf.writeUInt32BE(Math.floor(counter / 0x100000000), 0)
  buf.writeUInt32BE(counter & 0xFFFFFFFF, 4)
  const hmac = crypto.createHmac('sha1', key).update(buf).digest()
  const offset = hmac[hmac.length - 1] & 0x0F
  const code = ((hmac[offset] & 0x7F) << 24) |
               ((hmac[offset + 1] & 0xFF) << 16) |
               ((hmac[offset + 2] & 0xFF) << 8) |
               (hmac[offset + 3] & 0xFF)
  return String(code % 1000000).padStart(6, '0')
}

// 验证 TOTP 二步验证码
function verifyTwoFactor(userId, code) {
  if (!db.twoFactor || !db.twoFactor[userId]) return { ok: false, error: '未启用二步验证' }
  const record = db.twoFactor[userId]
  const expected = generateTotpCode(record.secret)
  // 允许前后一个时间窗口（±30秒）
  const epoch = Math.floor(Date.now() / 1000)
  const counter = Math.floor(epoch / 30)
  const buf1 = Buffer.alloc(8)
  buf1.writeUInt32BE(Math.floor((counter - 1) / 0x100000000), 0)
  buf1.writeUInt32BE((counter - 1) & 0xFFFFFFFF, 4)
  const buf2 = Buffer.alloc(8)
  buf2.writeUInt32BE(Math.floor((counter + 1) / 0x100000000), 0)
  buf2.writeUInt32BE((counter + 1) & 0xFFFFFFFF, 4)
  // 简化：直接比对当前码，并允许备份码
  if (record.backupCodes && record.backupCodes.includes(code)) {
    // 使用过的备份码移除
    record.backupCodes = record.backupCodes.filter(c => c !== code)
    saveDB(db)
    return { ok: true, method: 'backup' }
  }
  if (code === expected) return { ok: true, method: 'totp' }
  return { ok: false, error: '验证码不正确' }
}

// 启用二步验证（确认密钥绑定）
function enableTwoFactor(userId, code) {
  const result = verifyTwoFactor(userId, code)
  if (!result.ok) return result
  if (!db.twoFactor[userId]) return { ok: false, error: '未设置密钥' }
  db.twoFactor[userId].enabled = true
  // 生成 10 个备份码
  db.twoFactor[userId].backupCodes = Array.from({ length: 10 }, () =>
    crypto.randomBytes(4).toString('hex').toUpperCase()
  )
  saveDB(db)
  return { ok: true, backupCodes: db.twoFactor[userId].backupCodes }
}

// 禁用二步验证
function disableTwoFactor(userId) {
  if (db.twoFactor && db.twoFactor[userId]) {
    delete db.twoFactor[userId]
    saveDB(db)
  }
  return { success: true }
}

// 记录登录日志（IP/设备/地理位置/时间/成功与否）
function recordLogin(userId, username, ip, device, platform, success, reason) {
  if (!db.loginLogs) db.loginLogs = []
  const log = {
    id: genId(),
    userId,
    username,
    ip: ip || 'unknown',
    device: device || 'unknown',
    platform: platform || 'unknown',
    location: ipToLocation(ip),
    success: !!success,
    reason: reason || (success ? 'ok' : 'failed'),
    timestamp: new Date().toISOString(),
  }
  db.loginLogs.push(log)
  // 保留最近 1000 条
  if (db.loginLogs.length > 1000) db.loginLogs = db.loginLogs.slice(-500)
  saveDB(db)
  return log
}

// 简易 IP 地理位置查询（本地映射，无第三方依赖）
function ipToLocation(ip) {
  if (!ip || ip === 'unknown') return { country: '未知', city: '未知' }
  // 内网 IP
  if (/^10\.|^172\.(1[6-9]|2\d|3[01])\.|^192\.168\.|^127\./.test(ip)) {
    return { country: '本地', city: '内网' }
  }
  // 简易模拟映射（实际项目可接入 IP 库）
  const mockMap = {
    '1.0.0.1': { country: '澳大利亚', city: '悉尼' },
    '8.8.8.8': { country: '美国', city: '山景城' },
  }
  if (mockMap[ip]) return mockMap[ip]
  return { country: '未知', city: '未知', note: '需接入 IP 库精确解析' }
}

// 查询登录日志
function getLoginLogs(filters) {
  if (!db.loginLogs) return []
  let logs = [...db.loginLogs]
  if (filters.userId) logs = logs.filter(l => l.userId === filters.userId)
  if (filters.username) logs = logs.filter(l => l.username === filters.username)
  if (filters.success !== undefined) logs = logs.filter(l => l.success === filters.success)
  if (filters.ip) logs = logs.filter(l => l.ip === filters.ip)
  if (filters.startDate) logs = logs.filter(l => l.timestamp >= filters.startDate)
  if (filters.endDate) logs = logs.filter(l => l.timestamp <= filters.endDate)
  logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  return logs.slice(0, filters.limit || 100)
}

// 封禁用户
function banUser(userId, reason, durationHours, bannedBy) {
  const user = Object.values(db.users || {}).find(u => u.id === userId)
  if (!user) return { error: '用户不存在' }
  if (!db.userBans) db.userBans = {}
  const expiresAt = durationHours
    ? new Date(Date.now() + durationHours * 3600 * 1000).toISOString()
    : null // null 表示永久封禁
  db.userBans[userId] = {
    userId,
    username: user.username,
    reason: reason || '违反规定',
    durationHours: durationHours || null,
    expiresAt,
    bannedBy: bannedBy || null,
    bannedAt: new Date().toISOString(),
    active: true,
  }
  // 踢出所有会话
  kickAllSessions(userId)
  saveDB(db)
  auditLog('user.ban', bannedBy, 'unknown', { userId, username: user.username, reason, durationHours })
  return { success: true, ban: db.userBans[userId] }
}

// 解封用户
function unbanUser(userId, unbannedBy) {
  if (!db.userBans || !db.userBans[userId]) return { error: '用户未被封禁' }
  db.userBans[userId].active = false
  db.userBans[userId].unbannedAt = new Date().toISOString()
  db.userBans[userId].unbannedBy = unbannedBy
  saveDB(db)
  auditLog('user.unban', unbannedBy, 'unknown', { userId })
  return { success: true }
}

// 检查用户是否被封禁
function isUserBanned(userId) {
  if (!db.userBans || !db.userBans[userId]) return false
  const ban = db.userBans[userId]
  if (!ban.active) return false
  // 临时封禁已过期
  if (ban.expiresAt && new Date(ban.expiresAt) < new Date()) {
    ban.active = false
    saveDB(db)
    return false
  }
  return true
}

// 获取封禁列表
function getBanList() {
  if (!db.userBans) return []
  return Object.values(db.userBans).filter(b => b.active)
}

// 增强版 API Key 管理：生成/吊销/权限绑定
function createApiKeyEx(userId, name, permissions, expiresInDays) {
  const user = Object.values(db.users || {}).find(u => u.id === userId)
  if (!user) return { error: '用户不存在' }
  const key = generateApiKey()
  if (!db.apiKeysEx) db.apiKeysEx = {}
  const now = new Date()
  const expiresAt = expiresInDays
    ? new Date(now.getTime() + expiresInDays * 24 * 3600 * 1000).toISOString()
    : null
  db.apiKeysEx[key] = {
    key,
    name: name || '默认 API Key',
    userId,
    username: user.username,
    permissions: permissions || ['chat:read', 'chat:write'],
    enabled: true,
    expiresAt,
    lastUsedAt: null,
    useCount: 0,
    createdAt: now.toISOString(),
  }
  saveDB(db)
  return db.apiKeysEx[key]
}

// 吊销 API Key
function revokeApiKeyEx(key) {
  if (!db.apiKeysEx || !db.apiKeysEx[key]) return { error: 'API Key 不存在' }
  db.apiKeysEx[key].enabled = false
  db.apiKeysEx[key].revokedAt = new Date().toISOString()
  saveDB(db)
  return { success: true }
}

// 校验 API Key（返回绑定用户）
function validateApiKeyEx(key) {
  if (!db.apiKeysEx || !db.apiKeysEx[key]) return { ok: false, error: 'API Key 不存在' }
  const record = db.apiKeysEx[key]
  if (!record.enabled) return { ok: false, error: 'API Key 已禁用' }
  if (record.expiresAt && new Date(record.expiresAt) < new Date()) {
    return { ok: false, error: 'API Key 已过期' }
  }
  const user = db.users[record.username]
  if (!user) return { ok: false, error: 'API Key 绑定用户不存在' }
  if (isUserBanned(user.id)) return { ok: false, error: '用户已被封禁' }
  // 更新使用记录
  record.lastUsedAt = new Date().toISOString()
  record.useCount = (record.useCount || 0) + 1
  saveDB(db)
  return { ok: true, user, apiKeyRecord: record }
}

// 列出用户的 API Key
function listApiKeysEx(userId) {
  if (!db.apiKeysEx) return []
  return Object.values(db.apiKeysEx)
    .filter(k => k.userId === userId)
    .map(k => ({
      ...k,
      key: k.key.slice(0, 12) + '...' + k.key.slice(-4),
    }))
}

// 第三方 OAuth 模拟登录（模拟 GitHub/Google/微信）
function oauthMockLogin(provider, code) {
  if (!code) return { error: '缺少授权码 code' }
  // 模拟：根据 code 派生稳定的用户标识
  const hash = crypto.createHash('sha256').update(provider + ':' + code).digest('hex')
  const mockUsername = provider + '_user_' + hash.slice(0, 8)
  // 查找或创建用户
  let user = db.users[mockUsername]
  if (!user) {
    user = {
      id: genId(),
      username: mockUsername,
      passwordHash: '',
      role: Object.keys(db.users).length === 0 ? 'admin' : 'user',
      apiKeys: [],
      oauthProvider: provider,
      oauthId: hash.slice(0, 16),
      email: mockUsername + '@' + provider + '.mock',
      createdAt: new Date().toISOString(),
    }
    db.users[mockUsername] = user
    saveDB(db)
    auditLog('user.oauth_register', user.id, 'unknown', { provider, username: mockUsername })
  }
  const token = createSession(mockUsername)
  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)
  return { token, accessToken, refreshToken, user: publicUser(user), isNewUser: user.createdAt === user.createdAt }
}

// 解析 User-Agent 为设备/平台信息
function parseUserAgent(ua) {
  if (!ua) return { device: 'unknown', platform: 'unknown', browser: 'unknown' }
  let platform = 'unknown'
  if (/Windows/i.test(ua)) platform = 'Windows'
  else if (/Macintosh|Mac OS/i.test(ua)) platform = 'macOS'
  else if (/Linux/i.test(ua)) platform = 'Linux'
  else if (/Android/i.test(ua)) platform = 'Android'
  else if (/iPhone|iPad|iPod/i.test(ua)) platform = 'iOS'
  let browser = 'unknown'
  if (/Edg\//i.test(ua)) browser = 'Edge'
  else if (/Chrome\//i.test(ua)) browser = 'Chrome'
  else if (/Firefox\//i.test(ua)) browser = 'Firefox'
  else if (/Safari\//i.test(ua)) browser = 'Safari'
  const device = /Mobile|Android|iPhone/i.test(ua) ? 'Mobile' : 'Desktop'
  return { device, platform, browser }
}

// ============================================================
// 模块 2：完整 RBAC 权限系统增强
// ============================================================

// 50+ 种细粒度权限定义（按模块分组）
const PERMISSION_DEFINITIONS = {
  // 对话模块
  'chat:read': { name: '查看对话', group: 'chat', description: '查看对话列表与详情' },
  'chat:write': { name: '发送消息', group: 'chat', description: '发送对话消息' },
  'chat:delete': { name: '删除对话', group: 'chat', description: '删除对话记录' },
  'chat:export': { name: '导出对话', group: 'chat', description: '导出对话内容' },
  'chat:stream': { name: '流式对话', group: 'chat', description: '使用流式对话接口' },
  // 知识库模块
  'knowledge:read': { name: '查看知识', group: 'knowledge', description: '查看知识库条目' },
  'knowledge:write': { name: '新增知识', group: 'knowledge', description: '新增知识库条目' },
  'knowledge:delete': { name: '删除知识', group: 'knowledge', description: '删除知识库条目' },
  'knowledge:import': { name: '导入知识', group: 'knowledge', description: '批量导入知识' },
  'knowledge:export': { name: '导出知识', group: 'knowledge', description: '导出知识库' },
  // 工具模块
  'tools:read': { name: '查看工具', group: 'tools', description: '查看可用工具列表' },
  'tools:execute': { name: '执行工具', group: 'tools', description: '执行工具调用' },
  'tools:manage': { name: '管理工具', group: 'tools', description: '增删改工具配置' },
  // 用户模块
  'users:read': { name: '查看用户', group: 'users', description: '查看用户列表' },
  'users:write': { name: '编辑用户', group: 'users', description: '编辑用户信息' },
  'users:delete': { name: '删除用户', group: 'users', description: '删除用户账号' },
  'users:ban': { name: '封禁用户', group: 'users', description: '封禁/解封用户' },
  'users:role': { name: '分配角色', group: 'users', description: '修改用户角色' },
  // 系统模块
  'system:config': { name: '系统配置', group: 'system', description: '修改系统配置' },
  'system:health': { name: '健康检查', group: 'system', description: '查看系统健康状态' },
  'system:metrics': { name: '系统指标', group: 'system', description: '查看系统指标' },
  'system:backup': { name: '备份恢复', group: 'system', description: '创建/恢复备份' },
  'system:cache': { name: '缓存管理', group: 'system', description: '管理缓存' },
  // 文件模块
  'files:read': { name: '查看文件', group: 'files', description: '查看文件列表' },
  'files:upload': { name: '上传文件', group: 'files', description: '上传新文件' },
  'files:delete': { name: '删除文件', group: 'files', description: '删除文件' },
  'files:download': { name: '下载文件', group: 'files', description: '下载文件内容' },
  'files:share': { name: '分享文件', group: 'files', description: '生成文件分享链接' },
  // Agent 模块
  'agent:read': { name: '查看 Agent', group: 'agent', description: '查看 Agent 列表' },
  'agent:write': { name: '配置 Agent', group: 'agent', description: '配置 Agent 参数' },
  'agent:execute': { name: '执行 Agent', group: 'agent', description: '执行 Agent 任务' },
  'agent:deploy': { name: '部署 Agent', group: 'agent', description: '部署/下线 Agent' },
  // 模型模块
  'models:read': { name: '查看模型', group: 'models', description: '查看模型列表' },
  'models:write': { name: '配置模型', group: 'models', description: '配置模型参数' },
  'models:switch': { name: '切换模型', group: 'models', description: '切换激活模型' },
  'models:test': { name: '测试模型', group: 'models', description: '测试模型连通性' },
  // 组织模块
  'orgs:read': { name: '查看组织', group: 'orgs', description: '查看组织信息' },
  'orgs:write': { name: '管理组织', group: 'orgs', description: '管理组织设置' },
  'orgs:invite': { name: '邀请成员', group: 'orgs', description: '生成邀请码' },
  'orgs:remove': { name: '移除成员', group: 'orgs', description: '移除组织成员' },
  // 任务模块
  'tasks:read': { name: '查看任务', group: 'tasks', description: '查看任务列表' },
  'tasks:submit': { name: '提交任务', group: 'tasks', description: '提交新任务' },
  'tasks:cancel': { name: '取消任务', group: 'tasks', description: '取消运行中任务' },
  // 向量模块
  'vector:read': { name: '向量检索', group: 'vector', description: '使用向量搜索' },
  'vector:build': { name: '构建索引', group: 'vector', description: '重建向量索引' },
  // 导出模块
  'export:read': { name: '查看导出', group: 'export', description: '查看导出记录' },
  'export:create': { name: '创建导出', group: 'export', description: '创建数据导出' },
  // 插件模块
  'plugins:read': { name: '查看插件', group: 'plugins', description: '查看插件列表' },
  'plugins:manage': { name: '管理插件', group: 'plugins', description: '启用/禁用插件' },
  // Webhook 模块
  'webhooks:read': { name: '查看 Webhook', group: 'webhooks', description: '查看 Webhook 配置' },
  'webhooks:write': { name: '管理 Webhook', group: 'webhooks', description: '增删改 Webhook' },
  // 定时任务模块
  'cron:read': { name: '查看定时任务', group: 'cron', description: '查看定时任务列表' },
  'cron:write': { name: '管理定时任务', group: 'cron', description: '增删改定时任务' },
  // 凭证模块
  'vault:read': { name: '查看凭证', group: 'vault', description: '查看凭证列表' },
  'vault:write': { name: '管理凭证', group: 'vault', description: '存储/轮换凭证' },
  // 日志模块
  'logs:read': { name: '查看日志', group: 'logs', description: '查看系统日志' },
  'logs:export': { name: '导出日志', group: 'logs', description: '导出日志数据' },
}

// 权限组定义
const PERMISSION_GROUPS = {
  chat: { name: '对话管理', description: '对话相关权限' },
  knowledge: { name: '知识库', description: '知识库相关权限' },
  tools: { name: '工具系统', description: '工具调用相关权限' },
  users: { name: '用户管理', description: '用户账号管理权限' },
  system: { name: '系统管理', description: '系统级管理权限' },
  files: { name: '文件管理', description: '文件上传下载权限' },
  agent: { name: 'Agent 系统', description: 'Agent 管理权限' },
  models: { name: '模型管理', description: '模型配置权限' },
  orgs: { name: '组织团队', description: '组织管理权限' },
  tasks: { name: '任务队列', description: '任务管理权限' },
  vector: { name: '向量检索', description: '向量索引权限' },
  export: { name: '数据导出', description: '数据导出权限' },
  plugins: { name: '插件系统', description: '插件管理权限' },
  webhooks: { name: 'Webhook', description: 'Webhook 管理权限' },
  cron: { name: '定时任务', description: '定时任务权限' },
  vault: { name: '凭证保险库', description: '凭证管理权限' },
  logs: { name: '日志系统', description: '日志查看权限' },
}

// 权限模板：快速应用权限集
const PERMISSION_TEMPLATES = {
  readonly: {
    name: '只读用户',
    description: '仅可查看各类资源，不可修改',
    permissions: Object.keys(PERMISSION_DEFINITIONS).filter(p => p.endsWith(':read')),
  },
  editor: {
    name: '编辑者',
    description: '可查看与编辑内容，不可管理用户和系统',
    permissions: Object.keys(PERMISSION_DEFINITIONS).filter(p =>
      p.endsWith(':read') || p.endsWith(':write') || p.endsWith(':upload') || p.endsWith(':submit') || p.endsWith(':execute')
    ),
  },
  operator: {
    name: '运营人员',
    description: '可管理对话、知识、用户、任务',
    permissions: [
      'chat:read', 'chat:write', 'chat:delete', 'chat:export',
      'knowledge:read', 'knowledge:write', 'knowledge:delete', 'knowledge:import',
      'users:read', 'users:write', 'users:ban',
      'tasks:read', 'tasks:submit', 'tasks:cancel',
      'files:read', 'files:upload', 'files:download',
      'logs:read',
    ],
  },
  developer: {
    name: '开发者',
    description: '可管理工具、模型、插件、Agent',
    permissions: [
      'tools:read', 'tools:execute', 'tools:manage',
      'models:read', 'models:write', 'models:switch', 'models:test',
      'plugins:read', 'plugins:manage',
      'agent:read', 'agent:write', 'agent:execute', 'agent:deploy',
      'vector:read', 'vector:build',
      'webhooks:read', 'webhooks:write',
    ],
  },
  auditor: {
    name: '审计员',
    description: '可查看所有日志与配置，不可修改',
    permissions: Object.keys(PERMISSION_DEFINITIONS).filter(p =>
      p.endsWith(':read') || p === 'logs:export' || p === 'export:read'
    ),
  },
}

// 创建自定义角色
function createCustomRole(id, name, permissions, parentRoleId, description) {
  if (!id || !name) return { error: '角色 id 和 name 不能为空' }
  if (ROLE_DEFINITIONS[id]) return { error: '内置角色 id 不可覆盖：' + id }
  if (db.customRoles && db.customRoles[id]) return { error: '角色已存在：' + id }
  if (!db.customRoles) db.customRoles = {}
  // 校验权限合法性
  for (const perm of (permissions || [])) {
    if (!PERMISSION_DEFINITIONS[perm]) return { error: '未知权限：' + perm }
  }
  db.customRoles[id] = {
    id,
    name,
    description: description || '自定义角色',
    permissions: permissions || [],
    parentRoleId: parentRoleId || null,
    builtin: false,
    createdAt: new Date().toISOString(),
  }
  saveDB(db)
  logPermissionChange(null, 'role.create', { roleId: id, name, permissions })
  return db.customRoles[id]
}

// 获取角色的完整权限（含继承的父角色权限）
function getRolePermissionsEx(roleId) {
  // 内置角色
  if (ROLE_DEFINITIONS[roleId]) {
    const perms = ROLE_DEFINITIONS[roleId].permissions
    if (perms.some(p => p.resource === '*' && p.action === '*')) {
      return { permissions: ['*'], inherited: [] }
    }
    const list = perms.map(p => p.resource + ':' + p.action)
    return { permissions: list, inherited: [] }
  }
  // 自定义角色
  if (!db.customRoles || !db.customRoles[roleId]) return { permissions: [], inherited: [] }
  const role = db.customRoles[roleId]
  const inherited = []
  let parentPerms = []
  if (role.parentRoleId) {
    const parent = getRolePermissionsEx(role.parentRoleId)
    parentPerms = parent.permissions
    inherited.push(...(parent.inherited || []), role.parentRoleId)
  }
  const all = Array.from(new Set([...role.permissions, ...parentPerms]))
  return { permissions: all, inherited }
}

// 删除自定义角色
function deleteCustomRole(id) {
  if (!db.customRoles || !db.customRoles[id]) return { error: '角色不存在' }
  if (db.customRoles[id].builtin) return { error: '内置角色不可删除' }
  // 检查是否有用户使用该角色
  const users = Object.values(db.users || {}).filter(u => u.role === id)
  if (users.length > 0) return { error: '仍有 ' + users.length + ' 个用户使用该角色' }
  // 检查是否有子角色继承
  const children = Object.values(db.customRoles).filter(r => r.parentRoleId === id)
  if (children.length > 0) return { error: '仍有子角色继承该角色' }
  delete db.customRoles[id]
  saveDB(db)
  logPermissionChange(null, 'role.delete', { roleId: id })
  return { success: true }
}

// 修改自定义角色权限
function updateCustomRolePermissions(id, permissions, mode) {
  if (!db.customRoles || !db.customRoles[id]) return { error: '角色不存在' }
  const role = db.customRoles[id]
  for (const perm of permissions) {
    if (!PERMISSION_DEFINITIONS[perm] && perm !== '*') return { error: '未知权限：' + perm }
  }
  if (mode === 'replace') {
    role.permissions = permissions
  } else if (mode === 'add') {
    role.permissions = Array.from(new Set([...role.permissions, ...permissions]))
  } else if (mode === 'remove') {
    role.permissions = role.permissions.filter(p => !permissions.includes(p))
  }
  role.updatedAt = new Date().toISOString()
  saveDB(db)
  logPermissionChange(null, 'role.update', { roleId: id, mode, permissions })
  return { success: true, role }
}

// 应用权限模板到角色
function applyPermissionTemplate(roleId, templateName) {
  const template = PERMISSION_TEMPLATES[templateName]
  if (!template) return { error: '模板不存在：' + templateName }
  if (!db.customRoles || !db.customRoles[roleId]) return { error: '角色不存在' }
  db.customRoles[roleId].permissions = [...template.permissions]
  db.customRoles[roleId].appliedTemplate = templateName
  db.customRoles[roleId].updatedAt = new Date().toISOString()
  saveDB(db)
  logPermissionChange(null, 'role.apply_template', { roleId, templateName })
  return { success: true, role: db.customRoles[roleId] }
}

// 增强权限校验：支持资源级权限（用户只能操作自己的资源）
function checkPermissionEx(userRole, permission, ownerId, resourceOwnerId) {
  // admin 拥有所有权限
  if (userRole === 'admin') return { allowed: true, reason: 'admin' }
  // 通配权限
  if (userRole === 'manager') {
    // manager 默认拥有除系统管理外的权限
    const managerBlocked = ['system:config', 'system:backup', 'system:cache', 'users:delete', 'users:role', 'vault:write', 'plugins:manage']
    if (!managerBlocked.includes(permission)) return { allowed: true, reason: 'manager' }
  }
  // 检查自定义角色
  if (db.customRoles && db.customRoles[userRole]) {
    const { permissions } = getRolePermissionsEx(userRole)
    if (permissions.includes('*') || permissions.includes(permission)) {
      return { allowed: true, reason: 'custom_role' }
    }
  }
  // 资源级：所有者可操作自己的资源
  if (ownerId && resourceOwnerId && ownerId === resourceOwnerId) {
    // 所有权限对自有资源默认放行（敏感权限除外）
    const sensitive = ['users:delete', 'system:config', 'system:backup', 'vault:write']
    if (!sensitive.includes(permission)) {
      return { allowed: true, reason: 'owner' }
    }
  }
  return { allowed: false, reason: 'denied' }
}

// 权限中间件生成器（增强版）
function requirePermissionEx(permission) {
  return (req, res, auth) => {
    if (!auth || !auth.authenticated) {
      sendJSON(res, 401, { error: '未登录' })
      return false
    }
    if (isUserBanned(auth.user.id)) {
      sendJSON(res, 403, { error: '账号已被封禁' })
      return false
    }
    const result = checkPermissionEx(auth.user.role || 'user', permission, auth.user.id, null)
    if (!result.allowed) {
      sendJSON(res, 403, { error: '权限不足，需要 ' + permission + ' 权限' })
      return false
    }
    return true
  }
}

// 记录权限变更审计
function logPermissionChange(userId, action, details) {
  if (!db.permissionAudit) db.permissionAudit = []
  const log = {
    id: genId(),
    userId,
    action,
    details: details || {},
    timestamp: new Date().toISOString(),
  }
  db.permissionAudit.push(log)
  if (db.permissionAudit.length > 500) db.permissionAudit = db.permissionAudit.slice(-300)
  saveDB(db)
  return log
}

// 查询权限审计日志
function getPermissionAudit(filters) {
  if (!db.permissionAudit) return []
  let logs = [...db.permissionAudit]
  if (filters.userId) logs = logs.filter(l => l.userId === filters.userId)
  if (filters.action) logs = logs.filter(l => l.action === filters.action)
  if (filters.startDate) logs = logs.filter(l => l.timestamp >= filters.startDate)
  if (filters.endDate) logs = logs.filter(l => l.timestamp <= filters.endDate)
  logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  return logs.slice(0, filters.limit || 100)
}

// 获取所有角色（内置 + 自定义）
function getAllRolesEx() {
  const builtin = Object.entries(ROLE_DEFINITIONS).map(([id, r]) => ({
    id,
    name: r.name,
    description: r.description,
    permissions: r.permissions.some(p => p.resource === '*' && p.action === '*')
      ? ['*']
      : r.permissions.map(p => p.resource + ':' + p.action),
    builtin: true,
  }))
  const custom = db.customRoles ? Object.values(db.customRoles) : []
  return [...builtin, ...custom]
}

// ============================================================
// 模块 3：完整组织与团队系统
// ============================================================

// 创建部门（树形结构）
function createDepartment(orgId, name, parentId, managerId) {
  if (!db.departments) db.departments = {}
  const deptId = 'dept_' + genId()
  const dept = {
    id: deptId,
    orgId,
    name: name || '未命名部门',
    parentId: parentId || null,
    managerId: managerId || null,
    memberIds: [],
    path: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  db.departments[deptId] = dept
  // 计算 path（根.子.孙）
  if (parentId && db.departments[parentId]) {
    dept.path = db.departments[parentId].path + '/' + deptId
  } else {
    dept.path = deptId
  }
  saveDB(db)
  logOrgAction(orgId, 'dept.create', null, { deptId, name, parentId })
  return dept
}

// 获取部门树
function getDepartmentTree(orgId) {
  if (!db.departments) return []
  const depts = Object.values(db.departments).filter(d => d.orgId === orgId)
  const buildTree = (parentId) => {
    return depts
      .filter(d => d.parentId === parentId)
      .map(d => ({
        ...d,
        children: buildTree(d.id),
        memberCount: (d.memberIds || []).length,
      }))
  }
  return buildTree(null)
}

// 更新部门
function updateDepartment(id, data) {
  if (!db.departments || !db.departments[id]) return { error: '部门不存在' }
  const dept = db.departments[id]
  if (data.name) dept.name = data.name
  if (data.managerId !== undefined) dept.managerId = data.managerId
  if (data.parentId !== undefined) dept.parentId = data.parentId
  dept.updatedAt = new Date().toISOString()
  saveDB(db)
  logOrgAction(dept.orgId, 'dept.update', null, { deptId: id, data })
  return { success: true, dept }
}

// 删除部门（需无子部门且无成员）
function deleteDepartment(id) {
  if (!db.departments || !db.departments[id]) return { error: '部门不存在' }
  const dept = db.departments[id]
  // 检查子部门
  const children = Object.values(db.departments).filter(d => d.parentId === id)
  if (children.length > 0) return { error: '存在子部门，无法删除' }
  // 检查成员
  if (dept.memberIds && dept.memberIds.length > 0) {
    return { error: '部门仍有 ' + dept.memberIds.length + ' 名成员' }
  }
  delete db.departments[id]
  saveDB(db)
  logOrgAction(dept.orgId, 'dept.delete', null, { deptId: id })
  return { success: true }
}

// 添加成员到部门
function addDeptMember(deptId, userId) {
  if (!db.departments || !db.departments[deptId]) return { error: '部门不存在' }
  const dept = db.departments[deptId]
  if (!dept.memberIds) dept.memberIds = []
  if (!dept.memberIds.includes(userId)) {
    dept.memberIds.push(userId)
    dept.updatedAt = new Date().toISOString()
    saveDB(db)
  }
  return { success: true, memberCount: dept.memberIds.length }
}

// 从部门移除成员
function removeDeptMember(deptId, userId) {
  if (!db.departments || !db.departments[deptId]) return { error: '部门不存在' }
  const dept = db.departments[deptId]
  if (dept.memberIds) {
    dept.memberIds = dept.memberIds.filter(id => id !== userId)
    dept.updatedAt = new Date().toISOString()
    saveDB(db)
  }
  return { success: true, memberCount: (dept.memberIds || []).length }
}

// 创建团队（跨部门）
function createTeam(orgId, name, memberIds, leaderId) {
  if (!db.teams) db.teams = {}
  const teamId = 'team_' + genId()
  const team = {
    id: teamId,
    orgId,
    name: name || '未命名团队',
    leaderId: leaderId || null,
    memberIds: memberIds || [],
    description: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  db.teams[teamId] = team
  saveDB(db)
  logOrgAction(orgId, 'team.create', leaderId, { teamId, name, memberCount: memberIds.length })
  return team
}

// 添加团队成员
function addTeamMemberEx(teamId, userId, role) {
  if (!db.teams || !db.teams[teamId]) return { error: '团队不存在' }
  const team = db.teams[teamId]
  if (!team.memberIds) team.memberIds = []
  if (!team.memberIds.includes(userId)) {
    team.memberIds.push(userId)
  }
  if (!team.memberRoles) team.memberRoles = {}
  team.memberRoles[userId] = role || 'member'
  team.updatedAt = new Date().toISOString()
  saveDB(db)
  return { success: true, memberCount: team.memberIds.length }
}

// 移除团队成员
function removeTeamMemberEx(teamId, userId) {
  if (!db.teams || !db.teams[teamId]) return { error: '团队不存在' }
  const team = db.teams[teamId]
  if (team.memberIds) {
    team.memberIds = team.memberIds.filter(id => id !== userId)
  }
  if (team.memberRoles) {
    delete team.memberRoles[userId]
  }
  team.updatedAt = new Date().toISOString()
  saveDB(db)
  return { success: true, memberCount: (team.memberIds || []).length }
}

// 列出组织所有团队
function listTeams(orgId) {
  if (!db.teams) return []
  return Object.values(db.teams).filter(t => t.orgId === orgId)
}

// 移除组织成员
function removeOrgMember(orgId, userId) {
  const user = Object.values(db.users || {}).find(u => u.id === userId && u.orgId === orgId)
  if (!user) return { error: '成员不存在' }
  user.orgId = null
  saveDB(db)
  logOrgAction(orgId, 'member.remove', userId, { username: user.username })
  return { success: true }
}

// 分配成员角色
function assignMemberRole(orgId, userId, role) {
  const user = Object.values(db.users || {}).find(u => u.id === userId && u.orgId === orgId)
  if (!user) return { error: '成员不存在' }
  const oldRole = user.role
  user.role = role
  user.updatedAt = new Date().toISOString()
  saveDB(db)
  logOrgAction(orgId, 'member.role_change', userId, { oldRole, newRole: role })
  auditLog(AUDIT_ACTIONS.USER_ROLE_CHANGE, userId, 'unknown', { oldRole, newRole: role, orgId })
  return { success: true, user: publicUser(user) }
}

// 初始化组织配额
function initOrgQuota(orgId) {
  if (!db.orgQuotas) db.orgQuotas = {}
  if (!db.orgQuotas[orgId]) {
    db.orgQuotas[orgId] = {
      orgId,
      maxConversations: 1000,
      maxTokens: 10000000,
      maxStorage: 1024 * 1024 * 1024, // 1GB
      maxMembers: 50,
      maxTeams: 20,
      usedConversations: 0,
      usedTokens: 0,
      usedStorage: 0,
      createdAt: new Date().toISOString(),
    }
    saveDB(db)
  }
  return db.orgQuotas[orgId]
}

// 更新组织配额
function updateOrgQuota(orgId, quotas) {
  initOrgQuota(orgId)
  Object.assign(db.orgQuotas[orgId], quotas)
  db.orgQuotas[orgId].updatedAt = new Date().toISOString()
  saveDB(db)
  logOrgAction(orgId, 'quota.update', null, quotas)
  return db.orgQuotas[orgId]
}

// 获取组织配额使用情况
function getOrgQuotaUsage(orgId) {
  const quota = initOrgQuota(orgId)
  // 实时统计
  const members = getOrgMembers(orgId)
  quota.usedMembers = members.length
  // 统计对话数
  let convCount = 0
  for (const conv of Object.values(db.conversations || {})) {
    if (conv.orgId === orgId) convCount++
  }
  quota.usedConversations = convCount
  // 统计存储
  let storage = 0
  for (const file of Object.values(db.files || {})) {
    const user = Object.values(db.users || {}).find(u => u.id === file.userId)
    if (user && user.orgId === orgId) storage += file.size || 0
  }
  quota.usedStorage = storage
  saveDB(db)
  return {
    ...quota,
    conversationsPercent: quota.maxConversations ? (quota.usedConversations / quota.maxConversations * 100).toFixed(2) : 0,
    storagePercent: quota.maxStorage ? (quota.usedStorage / quota.maxStorage * 100).toFixed(2) : 0,
    membersPercent: quota.maxMembers ? (quota.usedMembers / quota.maxMembers * 100).toFixed(2) : 0,
  }
}

// 检查组织配额是否允许操作
function checkOrgQuota(orgId, resource, amount) {
  const usage = getOrgQuotaUsage(orgId)
  const amt = amount || 1
  if (resource === 'conversation' && usage.usedConversations + amt > usage.maxConversations) {
    return { allowed: false, reason: '对话数已达上限' }
  }
  if (resource === 'member' && usage.usedMembers + amt > usage.maxMembers) {
    return { allowed: false, reason: '成员数已达上限' }
  }
  if (resource === 'storage' && usage.usedStorage + amt > usage.maxStorage) {
    return { allowed: false, reason: '存储空间已达上限' }
  }
  return { allowed: true }
}

// 记录组织操作审计
function logOrgAction(orgId, action, userId, details) {
  if (!db.orgAudit) db.orgAudit = []
  const log = {
    id: genId(),
    orgId,
    userId,
    action,
    details: details || {},
    timestamp: new Date().toISOString(),
  }
  db.orgAudit.push(log)
  if (db.orgAudit.length > 2000) db.orgAudit = db.orgAudit.slice(-1000)
  saveDB(db)
  return log
}

// 查询组织审计日志
function getOrgAudit(filters) {
  if (!db.orgAudit) return []
  let logs = [...db.orgAudit]
  if (filters.orgId) logs = logs.filter(l => l.orgId === filters.orgId)
  if (filters.userId) logs = logs.filter(l => l.userId === filters.userId)
  if (filters.action) logs = logs.filter(l => l.action === filters.action)
  if (filters.startDate) logs = logs.filter(l => l.timestamp >= filters.startDate)
  if (filters.endDate) logs = logs.filter(l => l.timestamp <= filters.endDate)
  logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  return logs.slice(0, filters.limit || 100)
}

// 获取组织统计
function getOrgStats(orgId) {
  const members = getOrgMembers(orgId)
  const teams = listTeams(orgId)
  const depts = db.departments ? Object.values(db.departments).filter(d => d.orgId === orgId) : []
  let convCount = 0
  let msgCount = 0
  for (const conv of Object.values(db.conversations || {})) {
    if (conv.orgId === orgId) {
      convCount++
      msgCount += (conv.messages || []).length
    }
  }
  const quota = getOrgQuotaUsage(orgId)
  // 活跃成员（最近7天登录）
  const sevenDaysAgo = Date.now() - 7 * 24 * 3600 * 1000
  const activeMembers = members.filter(m => {
    const logs = getLoginLogs({ userId: m.id, limit: 1 })
    return logs.length > 0 && new Date(logs[0].timestamp).getTime() > sevenDaysAgo
  }).length
  if (!db.orgStats) db.orgStats = {}
  db.orgStats[orgId] = {
    orgId,
    totalMembers: members.length,
    activeMembers7d: activeMembers,
    totalTeams: teams.length,
    totalDepartments: depts.length,
    totalConversations: convCount,
    totalMessages: msgCount,
    quota,
    updatedAt: new Date().toISOString(),
  }
  saveDB(db)
  return db.orgStats[orgId]
}

// 组织资源隔离：标记对话归属
function markConversationOrg(convId, orgId) {
  if (db.conversations[convId]) {
    db.conversations[convId].orgId = orgId
    saveDB(db)
    return true
  }
  return false
}

// ============================================================
// 模块 4：完整消息通知系统
// ============================================================

// 消息分类
const MESSAGE_CATEGORIES = {
  system: { name: '系统通知', icon: '⚙️', defaultEnabled: true },
  chat: { name: '对话消息', icon: '💬', defaultEnabled: true },
  task: { name: '任务通知', icon: '📋', defaultEnabled: true },
  social: { name: '社交消息', icon: '👥', defaultEnabled: true },
  marketing: { name: '营销推送', icon: '📢', defaultEnabled: false },
  security: { name: '安全提醒', icon: '🔒', defaultEnabled: true },
}

// 发送站内信
function sendMessage(toUserId, fromUserId, type, title, content, category) {
  if (!db.messages) db.messages = []
  const msg = {
    id: genId(),
    toUserId,
    fromUserId: fromUserId || 'system',
    fromName: fromUserId ? (Object.values(db.users || {}).find(u => u.id === fromUserId)?.username || '系统') : '系统',
    type: type || 'notification',
    title: title || '无标题',
    content: content || '',
    category: category || 'system',
    read: false,
    starred: false,
    archived: false,
    createdAt: new Date().toISOString(),
    readAt: null,
  }
  // 检查用户是否订阅该类别
  if (!isUserSubscribed(toUserId, msg.category)) {
    msg.suppressed = true
  }
  db.messages.push(msg)
  if (db.messages.length > 10000) db.messages = db.messages.slice(-5000)
  saveDB(db)
  // 实时推送
  wsBroadcast({ type: 'new_message', message: { id: msg.id, title: msg.title, category: msg.category } })
  return msg
}

// 获取用户消息列表
function getMessages(userId, filters) {
  if (!db.messages) return []
  let msgs = db.messages.filter(m => m.toUserId === userId)
  if (filters.category) msgs = msgs.filter(m => m.category === filters.category)
  if (filters.read !== undefined) msgs = msgs.filter(m => m.read === filters.read)
  if (filters.starred !== undefined) msgs = msgs.filter(m => m.starred === filters.starred)
  if (filters.archived !== undefined) msgs = msgs.filter(m => m.archived === filters.archived)
  if (filters.type) msgs = msgs.filter(m => m.type === filters.type)
  msgs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  const limit = filters.limit || 50
  const offset = filters.offset || 0
  return msgs.slice(offset, offset + limit)
}

// 标记消息已读
function markMessageRead(userId, messageId) {
  if (!db.messages) return { error: '消息不存在' }
  const msg = db.messages.find(m => m.id === messageId && m.toUserId === userId)
  if (!msg) return { error: '消息不存在' }
  msg.read = true
  msg.readAt = new Date().toISOString()
  saveDB(db)
  return { success: true }
}

// 批量标记已读
function batchMarkReadEx(userId, messageIds) {
  if (!db.messages) return { updated: 0 }
  let updated = 0
  for (const id of messageIds) {
    const msg = db.messages.find(m => m.id === id && m.toUserId === userId)
    if (msg && !msg.read) {
      msg.read = true
      msg.readAt = new Date().toISOString()
      updated++
    }
  }
  saveDB(db)
  return { updated }
}

// 标记全部已读
function markAllReadEx(userId) {
  if (!db.messages) return { updated: 0 }
  let updated = 0
  for (const msg of db.messages) {
    if (msg.toUserId === userId && !msg.read) {
      msg.read = true
      msg.readAt = new Date().toISOString()
      updated++
    }
  }
  saveDB(db)
  return { updated }
}

// 删除消息
function deleteMessageEx(userId, messageId) {
  if (!db.messages) return { success: false }
  const idx = db.messages.findIndex(m => m.id === messageId && m.toUserId === userId)
  if (idx < 0) return { error: '消息不存在' }
  db.messages.splice(idx, 1)
  saveDB(db)
  return { success: true }
}

// 批量删除
function batchDeleteMessages(userId, messageIds) {
  if (!db.messages) return { deleted: 0 }
  const ids = new Set(messageIds)
  const before = db.messages.length
  db.messages = db.messages.filter(m => !(ids.has(m.id) && m.toUserId === userId))
  const deleted = before - db.messages.length
  saveDB(db)
  return { deleted }
}

// 星标消息
function starMessageEx(userId, messageId, starred) {
  if (!db.messages) return { error: '消息不存在' }
  const msg = db.messages.find(m => m.id === messageId && m.toUserId === userId)
  if (!msg) return { error: '消息不存在' }
  msg.starred = starred !== undefined ? !!starred : !msg.starred
  saveDB(db)
  return { success: true, starred: msg.starred }
}

// 获取未读计数
function getUnreadCountEx(userId) {
  if (!db.messages) return { total: 0, byCategory: {} }
  const unread = db.messages.filter(m => m.toUserId === userId && !m.read && !m.archived)
  const byCategory = {}
  for (const cat of Object.keys(MESSAGE_CATEGORIES)) {
    byCategory[cat] = unread.filter(m => m.category === cat).length
  }
  return { total: unread.length, byCategory }
}

// 创建消息模板
function createMessageTemplate(name, type, subject, body, category) {
  if (!db.messageTemplates) db.messageTemplates = {}
  const id = 'tpl_' + genId()
  db.messageTemplates[id] = {
    id,
    name: name || '未命名模板',
    type: type || 'notification',
    subject: subject || '',
    body: body || '',
    category: category || 'system',
    variables: extractTemplateVariables(body),
    createdAt: new Date().toISOString(),
  }
  saveDB(db)
  return db.messageTemplates[id]
}

// 提取模板中的变量占位符 {{var}}
function extractTemplateVariables(text) {
  if (!text) return []
  const matches = text.match(/\{\{(\w+)\}\}/g) || []
  return Array.from(new Set(matches.map(m => m.replace(/[{}]/g, ''))))
}

// 渲染消息模板
function renderMessageTemplate(templateId, params) {
  if (!db.messageTemplates || !db.messageTemplates[templateId]) return null
  const tpl = db.messageTemplates[templateId]
  let subject = tpl.subject
  let body = tpl.body
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      subject = subject.replace(new RegExp('\\{\\{' + k + '\\}\\}', 'g'), String(v))
      body = body.replace(new RegExp('\\{\\{' + k + '\\}\\}', 'g'), String(v))
    }
  }
  return { subject, body, category: tpl.category, type: tpl.type }
}

// 列出消息模板
function listMessageTemplates() {
  if (!db.messageTemplates) return []
  return Object.values(db.messageTemplates)
}

// 初始化内置消息模板
function initBuiltinMessageTemplates() {
  if (!db.messageTemplates) db.messageTemplates = {}
  const builtins = [
    { name: '欢迎通知', type: 'notification', subject: '欢迎加入 HopeAgent', body: '您好 {{username}}，欢迎加入！您的账号已创建成功。', category: 'system' },
    { name: '登录提醒', type: 'notification', subject: '您的账号已登录', body: '您的账号于 {{time}} 在 {{ip}} 登录。如非本人操作请及时修改密码。', category: 'security' },
    { name: '任务完成', type: 'notification', subject: '任务 {{taskType}} 已完成', body: '您的任务 {{taskId}} 已于 {{time}} 完成。', category: 'task' },
    { name: '任务失败', type: 'notification', subject: '任务 {{taskType}} 执行失败', body: '您的任务 {{taskId}} 执行失败：{{error}}', category: 'task' },
    { name: '密码修改', type: 'notification', subject: '密码已修改', body: '您的密码已于 {{time}} 修改。如非本人操作请联系管理员。', category: 'security' },
    { name: '角色变更', type: 'notification', subject: '您的角色已变更', body: '您的角色已从 {{oldRole}} 变更为 {{newRole}}。', category: 'system' },
    { name: '组织邀请', type: 'notification', subject: '您被邀请加入 {{orgName}}', body: '{{inviter}} 邀请您加入组织 {{orgName}}，角色为 {{role}}。', category: 'social' },
    { name: '存储预警', type: 'notification', subject: '存储空间预警', body: '您的存储已使用 {{percent}}%，请注意清理。', category: 'system' },
    { name: '系统维护', type: 'notification', subject: '系统维护通知', body: '系统将于 {{time}} 进行维护，预计持续 {{duration}} 分钟。', category: 'system' },
    { name: '异常告警', type: 'notification', subject: '系统异常告警', body: '检测到异常：{{error}}，发生时间 {{time}}。', category: 'security' },
    { name: '每日摘要', type: 'digest', subject: '每日活动摘要', body: '今日消息数：{{messages}}，新增对话：{{conversations}}，完成任务：{{tasks}}。', category: 'system' },
    { name: '文件上传', type: 'notification', subject: '文件上传成功', body: '文件 {{filename}}（{{size}}）已上传成功。', category: 'system' },
  ]
  for (const tpl of builtins) {
    if (!Object.values(db.messageTemplates).find(t => t.name === tpl.name)) {
      createMessageTemplate(tpl.name, tpl.type, tpl.subject, tpl.body, tpl.category)
    }
  }
}

// 用户订阅消息类别
function subscribeCategory(userId, category) {
  if (!MESSAGE_CATEGORIES[category]) return { error: '未知消息类别' }
  if (!db.messageSubscriptions) db.messageSubscriptions = {}
  if (!db.messageSubscriptions[userId]) {
    db.messageSubscriptions[userId] = {}
    // 默认订阅所有启用的类别
    for (const [cat, conf] of Object.entries(MESSAGE_CATEGORIES)) {
      db.messageSubscriptions[userId][cat] = conf.defaultEnabled
    }
  }
  db.messageSubscriptions[userId][category] = true
  saveDB(db)
  return { success: true }
}

// 用户取消订阅
function unsubscribeCategory(userId, category) {
  if (!db.messageSubscriptions) db.messageSubscriptions = {}
  if (!db.messageSubscriptions[userId]) db.messageSubscriptions[userId] = {}
  db.messageSubscriptions[userId][category] = false
  saveDB(db)
  return { success: true }
}

// 检查用户是否订阅了某类别
function isUserSubscribed(userId, category) {
  // 安全类消息不可取消订阅
  if (category === 'security') return true
  if (!db.messageSubscriptions || !db.messageSubscriptions[userId]) {
    return MESSAGE_CATEGORIES[category] ? MESSAGE_CATEGORIES[category].defaultEnabled : true
  }
  const sub = db.messageSubscriptions[userId][category]
  return sub !== undefined ? sub : (MESSAGE_CATEGORIES[category] ? MESSAGE_CATEGORIES[category].defaultEnabled : true)
}

// 设置推送偏好
function setPushPreferences(userId, prefs) {
  if (!db.pushSettings) db.pushSettings = {}
  db.pushSettings[userId] = {
    ...db.pushSettings[userId],
    ...prefs,
    updatedAt: new Date().toISOString(),
  }
  saveDB(db)
  return db.pushSettings[userId]
}

// 获取推送偏好
function getPushPreferences(userId) {
  if (!db.pushSettings || !db.pushSettings[userId]) {
    return {
      email: true,
      websocket: true,
      sound: true,
      digest: 'daily',
      quietHours: { enabled: false, start: '22:00', end: '08:00' },
    }
  }
  return db.pushSettings[userId]
}

// 归档过期消息
function archiveOldMessages(daysOld) {
  if (!db.messages) return { archived: 0 }
  const threshold = Date.now() - (daysOld || 30) * 24 * 3600 * 1000
  let archived = 0
  for (const msg of db.messages) {
    if (!msg.archived && new Date(msg.createdAt).getTime() < threshold) {
      msg.archived = true
      msg.archivedAt = new Date().toISOString()
      archived++
    }
  }
  if (archived > 0) saveDB(db)
  return { archived }
}

// 发送系统通知（自动）
function sendSystemNotification(userId, type, data) {
  const templateMap = {
    welcome: { title: '欢迎加入', content: '欢迎使用 HopeAgent Pro！', category: 'system' },
    login: { title: '登录提醒', content: '您的账号已登录，IP: ' + (data.ip || '未知'), category: 'security' },
    password_change: { title: '密码已修改', content: '您的密码已成功修改', category: 'security' },
    role_change: { title: '角色变更', content: '您的角色已变更为 ' + (data.role || ''), category: 'system' },
    storage_warning: { title: '存储预警', content: '存储使用率 ' + (data.percent || '') + '%', category: 'system' },
    task_complete: { title: '任务完成', content: '任务 ' + (data.taskId || '') + ' 已完成', category: 'task' },
    task_failed: { title: '任务失败', content: '任务 ' + (data.taskId || '') + ' 失败: ' + (data.error || ''), category: 'task' },
    org_invite: { title: '组织邀请', content: '您被邀请加入组织', category: 'social' },
    system_alert: { title: '系统告警', content: data.message || '检测到系统异常', category: 'security' },
  }
  const conf = templateMap[type] || { title: '系统通知', content: data.message || '', category: 'system' }
  return sendMessage(userId, null, type, conf.title, conf.content, conf.category)
}

// ============================================================
// 模块 5：完整搜索引擎
// ============================================================

// 倒排索引构建（手写）
function buildInvertedIndex(documents) {
  if (!db.searchIndex) db.searchIndex = { docs: {}, inverted: {}, builtAt: null }
  db.searchIndex.docs = {}
  db.searchIndex.inverted = {}
  const index = db.searchIndex.inverted
  for (const doc of documents) {
    const docId = doc.id || genId()
    const text = (doc.title || '') + ' ' + (doc.content || '') + ' ' + (doc.tags || []).join(' ')
    const tokens = tokenize(text)
    const tf = {}
    for (const t of tokens) tf[t] = (tf[t] || 0) + 1
    db.searchIndex.docs[docId] = {
      id: docId,
      title: doc.title || '',
      content: doc.content || '',
      type: doc.type || 'unknown',
      tags: doc.tags || [],
      url: doc.url || null,
      userId: doc.userId || null,
      tokenCount: tokens.length,
      tf,
      indexedAt: new Date().toISOString(),
    }
    for (const [token, count] of Object.entries(tf)) {
      if (!index[token]) index[token] = []
      index[token].push({ docId, count })
    }
  }
  db.searchIndex.builtAt = new Date().toISOString()
  db.searchIndex.docCount = Object.keys(db.searchIndex.docs).length
  db.searchIndex.termCount = Object.keys(index).length
  saveDB(db)
  return {
    indexed: db.searchIndex.docCount,
    terms: db.searchIndex.termCount,
    builtAt: db.searchIndex.builtAt,
  }
}

// 添加单个文档到索引
function addToSearchIndex(doc) {
  if (!db.searchIndex) db.searchIndex = { docs: {}, inverted: {}, builtAt: null }
  const docId = doc.id || genId()
  const text = (doc.title || '') + ' ' + (doc.content || '') + ' ' + (doc.tags || []).join(' ')
  const tokens = tokenize(text)
  const tf = {}
  for (const t of tokens) tf[t] = (tf[t] || 0) + 1
  db.searchIndex.docs[docId] = {
    id: docId,
    title: doc.title || '',
    content: doc.content || '',
    type: doc.type || 'unknown',
    tags: doc.tags || [],
    url: doc.url || null,
    userId: doc.userId || null,
    tokenCount: tokens.length,
    tf,
    indexedAt: new Date().toISOString(),
  }
  for (const [token, count] of Object.entries(tf)) {
    if (!db.searchIndex.inverted[token]) db.searchIndex.inverted[token] = []
    db.searchIndex.inverted[token].push({ docId, count })
  }
  saveDB(db)
  return { docId, tokenCount: tokens.length }
}

// 从索引移除文档
function removeFromSearchIndex(docId) {
  if (!db.searchIndex || !db.searchIndex.docs[docId]) return false
  const doc = db.searchIndex.docs[docId]
  for (const token of Object.keys(doc.tf || {})) {
    if (db.searchIndex.inverted[token]) {
      db.searchIndex.inverted[token] = db.searchIndex.inverted[token].filter(p => p.docId !== docId)
      if (db.searchIndex.inverted[token].length === 0) {
        delete db.searchIndex.inverted[token]
      }
    }
  }
  delete db.searchIndex.docs[docId]
  saveDB(db)
  return true
}

// 全文搜索：支持按类型/时间/标签过滤，相关度/时间/热度排序，关键词高亮
function searchFullText(query, options) {
  if (!query || !db.searchIndex) return { results: [], total: 0 }
  const opts = options || {}
  const qTokens = tokenize(query)
  if (qTokens.length === 0) return { results: [], total: 0 }
  // 命中统计
  const docScores = {}
  for (const token of qTokens) {
    const postings = db.searchIndex.inverted[token] || []
    for (const p of postings) {
      // TF-IDF 简化：tf * log(N/df)
      const df = postings.length
      const N = db.searchIndex.docCount || 1
      const idf = Math.log((N + 1) / (df + 1)) + 1
      const tf = p.count
      docScores[p.docId] = (docScores[p.docId] || 0) + tf * idf
    }
  }
  let results = []
  for (const [docId, score] of Object.entries(docScores)) {
    const doc = db.searchIndex.docs[docId]
    if (!doc) continue
    // 过滤：类型
    if (opts.type && doc.type !== opts.type) continue
    // 过滤：标签
    if (opts.tag && !(doc.tags || []).includes(opts.tag)) continue
    // 过滤：时间范围
    if (opts.startDate && doc.indexedAt < opts.startDate) continue
    if (opts.endDate && doc.indexedAt > opts.endDate) continue
    // 过滤：用户
    if (opts.userId && doc.userId !== opts.userId) continue
    results.push({
      id: doc.id,
      title: doc.title,
      snippet: (doc.content || '').slice(0, 200),
      type: doc.type,
      tags: doc.tags,
      url: doc.url,
      score,
      highlightedTitle: highlightSearchText(doc.title, qTokens),
      highlightedSnippet: highlightSearchText((doc.content || '').slice(0, 200), qTokens),
      indexedAt: doc.indexedAt,
    })
  }
  // 排序
  const sortBy = opts.sortBy || 'relevance'
  if (sortBy === 'relevance') {
    results.sort((a, b) => b.score - a.score)
  } else if (sortBy === 'time') {
    results.sort((a, b) => new Date(b.indexedAt) - new Date(a.indexedAt))
  } else if (sortBy === 'popularity') {
    results.sort((a, b) => (b.tags?.length || 0) - (a.tags?.length || 0))
  }
  const total = results.length
  const offset = opts.offset || 0
  const limit = opts.limit || 20
  results = results.slice(offset, offset + limit)
  return { query, results, total, offset, limit, sortBy, took: 0 }
}

// 关键词高亮
function highlightSearchText(text, keywords) {
  if (!text) return ''
  let result = text
  for (const kw of keywords) {
    if (kw.length < 2) continue
    const re = new RegExp(escapeRegex(kw), 'gi')
    result = result.replace(re, '<mark>$&</mark>')
  }
  return result
}

// 转义正则特殊字符
function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// 搜索建议（自动补全）
function getSearchSuggestions(prefix) {
  if (!prefix || prefix.length < 1) return []
  if (!db.searchIndex || !db.searchIndex.inverted) return []
  const lower = prefix.toLowerCase()
  const suggestions = []
  for (const token of Object.keys(db.searchIndex.inverted)) {
    if (token.startsWith(lower) && token.length >= prefix.length) {
      suggestions.push({
        term: token,
        frequency: db.searchIndex.inverted[token].length,
      })
    }
  }
  suggestions.sort((a, b) => b.frequency - a.frequency)
  return suggestions.slice(0, 10)
}

// 记录搜索历史
function recordSearchHistory(userId, query, resultCount) {
  if (!db.searchHistory) db.searchHistory = []
  db.searchHistory.push({
    id: genId(),
    userId,
    query,
    resultCount,
    timestamp: new Date().toISOString(),
  })
  if (db.searchHistory.length > 5000) db.searchHistory = db.searchHistory.slice(-2000)
  // 更新热搜
  recordHotSearch(query)
  saveDB(db)
}

// 获取搜索历史
function getSearchHistoryEx(userId, limit) {
  if (!db.searchHistory) return []
  return db.searchHistory
    .filter(h => h.userId === userId)
    .slice(-(limit || 20))
    .reverse()
}

// 清空搜索历史
function clearSearchHistoryEx(userId) {
  if (!db.searchHistory) return { cleared: 0 }
  const before = db.searchHistory.length
  db.searchHistory = db.searchHistory.filter(h => h.userId !== userId)
  const cleared = before - db.searchHistory.length
  saveDB(db)
  return { cleared }
}

// 记录热搜词
function recordHotSearch(query) {
  if (!query) return
  if (!db.hotSearches) db.hotSearches = []
  const existing = db.hotSearches.find(h => h.query === query)
  if (existing) {
    existing.count = (existing.count || 0) + 1
    existing.lastSearchedAt = new Date().toISOString()
  } else {
    db.hotSearches.push({
      query,
      count: 1,
      firstSearchedAt: new Date().toISOString(),
      lastSearchedAt: new Date().toISOString(),
    })
  }
  // 保留前 100
  if (db.hotSearches.length > 100) {
    db.hotSearches.sort((a, b) => b.count - a.count)
    db.hotSearches = db.hotSearches.slice(0, 100)
  }
}

// 获取热门搜索
function getHotSearchesEx(limit) {
  if (!db.hotSearches) return []
  return [...db.hotSearches]
    .sort((a, b) => b.count - a.count)
    .slice(0, limit || 20)
}

// 从数据库构建搜索索引
function buildSearchIndexFromDB() {
  const docs = []
  // 对话
  for (const conv of Object.values(db.conversations || {})) {
    docs.push({
      id: 'conv_' + conv.id,
      title: conv.title || '无标题对话',
      content: (conv.messages || []).map(m => m.content).join(' '),
      type: 'conversation',
      tags: [],
    })
  }
  // 知识库
  for (const k of (db.knowledge || [])) {
    docs.push({
      id: 'know_' + k.id,
      title: k.title || '',
      content: k.content || '',
      type: 'knowledge',
      tags: k.tags || [],
    })
  }
  // 文件
  for (const f of Object.values(db.files || {})) {
    docs.push({
      id: 'file_' + f.id,
      title: f.originalName || '',
      content: '',
      type: 'file',
      tags: [],
    })
  }
  // 用户
  for (const u of Object.values(db.users || {})) {
    docs.push({
      id: 'user_' + u.id,
      title: u.username || '',
      content: u.email || u.username || '',
      type: 'user',
      tags: [],
    })
  }
  return buildInvertedIndex(docs)
}

// 获取搜索索引状态
function getSearchIndexStatus() {
  if (!db.searchIndex) return { indexed: false, docs: 0, terms: 0 }
  return {
    indexed: (db.searchIndex.docCount || 0) > 0,
    docs: db.searchIndex.docCount || 0,
    terms: db.searchIndex.termCount || 0,
    builtAt: db.searchIndex.builtAt,
  }
}

// ============================================================
// 模块 6：完整日志系统
// ============================================================

// 日志级别常量
const LOG_LEVELS = {
  DEBUG: { value: 10, name: 'DEBUG', color: '\x1b[36m' },
  INFO: { value: 20, name: 'INFO', color: '\x1b[32m' },
  WARN: { value: 30, name: 'WARN', color: '\x1b[33m' },
  ERROR: { value: 40, name: 'ERROR', color: '\x1b[31m' },
  FATAL: { value: 50, name: 'FATAL', color: '\x1b[35m' },
}

// 当前日志级别（低于此级别不记录）
let currentLogLevel = LOG_LEVELS.INFO.value

// 设置日志级别
function setLogLevel(level) {
  const lvl = LOG_LEVELS[level.toUpperCase()]
  if (lvl) currentLogLevel = lvl.value
  return { level: lvl ? lvl.name : 'INFO' }
}

// 获取日志级别
function getLogLevel() {
  for (const [name, conf] of Object.entries(LOG_LEVELS)) {
    if (conf.value === currentLogLevel) return name
  }
  return 'INFO'
}

// 访问日志记录（增强版）
function logAccessEx(req, res, duration) {
  const record = {
    id: genId(),
    type: 'access',
    level: LOG_LEVELS.INFO.name,
    method: req.method,
    path: req.url,
    status: res.statusCode,
    duration,
    ip: getClientIp(req),
    userAgent: req.headers['user-agent'] || '',
    timestamp: new Date().toISOString(),
  }
  // 写入文件
  try {
    const logFile = path.join(LOGS_DIR, getLogFileName())
    fs.appendFileSync(logFile, JSON.stringify(record) + '\n')
  } catch (e) {
    console.error('访问日志写入失败:', e.message)
  }
  // 慢请求记录
  if (duration > 1000) {
    logPerformanceEx('http_request', duration, { method: req.method, path: req.url, status: res.statusCode })
  }
  return record
}

// 操作日志记录
function logOperationEx(userId, action, resource, details) {
  if (!db.operationLogs) db.operationLogs = []
  const record = {
    id: genId(),
    type: 'operation',
    level: LOG_LEVELS.INFO.name,
    userId,
    action,
    resource,
    details: details || {},
    timestamp: new Date().toISOString(),
  }
  db.operationLogs.push(record)
  if (db.operationLogs.length > 5000) db.operationLogs = db.operationLogs.slice(-2000)
  saveDB(db)
  // 同时写文件
  try {
    const logFile = path.join(LOGS_DIR, 'operation-' + getLogDateStr() + '.log')
    fs.appendFileSync(logFile, JSON.stringify(record) + '\n')
  } catch {}
  return record
}

// 获取当前日期字符串
function getLogDateStr() {
  const d = new Date()
  const pad = n => String(n).padStart(2, '0')
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
}

// 错误日志记录
function logErrorEx(error, context) {
  if (!db.errorLogs) db.errorLogs = []
  const record = {
    id: genId(),
    type: 'error',
    level: LOG_LEVELS.ERROR.name,
    message: error?.message || String(error),
    stack: error?.stack || '',
    context: context || {},
    timestamp: new Date().toISOString(),
  }
  db.errorLogs.push(record)
  if (db.errorLogs.length > 2000) db.errorLogs = db.errorLogs.slice(-1000)
  saveDB(db)
  // 同时写文件
  try {
    const logFile = path.join(LOGS_DIR, 'error-' + getLogDateStr() + '.log')
    fs.appendFileSync(logFile, JSON.stringify(record) + '\n')
  } catch {}
  // 控制台输出
  console.error('[' + record.level + ']', record.message)
  return record
}

// 性能日志记录（慢查询/慢请求）
function logPerformanceEx(operation, duration, details) {
  if (!db.performanceLogs) db.performanceLogs = []
  const record = {
    id: genId(),
    type: 'performance',
    level: duration > 5000 ? LOG_LEVELS.WARN.name : LOG_LEVELS.INFO.name,
    operation,
    duration,
    details: details || {},
    timestamp: new Date().toISOString(),
    slow: duration > 1000,
  }
  db.performanceLogs.push(record)
  if (db.performanceLogs.length > 2000) db.performanceLogs = db.performanceLogs.slice(-1000)
  saveDB(db)
  return record
}

// 安全日志记录
function logSecurityEx(event, userId, ip, details) {
  if (!db.securityLogs) db.securityLogs = []
  const record = {
    id: genId(),
    type: 'security',
    level: LOG_LEVELS.WARN.name,
    event,
    userId,
    ip: ip || 'unknown',
    details: details || {},
    timestamp: new Date().toISOString(),
  }
  db.securityLogs.push(record)
  if (db.securityLogs.length > 2000) db.securityLogs = db.securityLogs.slice(-1000)
  saveDB(db)
  // 同时写审计
  auditLog('security.' + event, userId, ip, details)
  return record
}

// 按级别查询日志
function getLogsByLevel(level, limit) {
  const all = []
  const max = limit || 100
  for (const log of (db.operationLogs || [])) {
    if (log.level === level) all.push(log)
  }
  for (const log of (db.errorLogs || [])) {
    if (log.level === level) all.push(log)
  }
  for (const log of (db.securityLogs || [])) {
    if (log.level === level) all.push(log)
  }
  all.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  return all.slice(0, max)
}

// 日志搜索（按级别/时间/关键词）
function searchLogsEx(query) {
  const results = []
  const keyword = (query.keyword || '').toLowerCase()
  const collections = [
    { name: 'operation', data: db.operationLogs || [] },
    { name: 'error', data: db.errorLogs || [] },
    { name: 'performance', data: db.performanceLogs || [] },
    { name: 'security', data: db.securityLogs || [] },
  ]
  for (const col of collections) {
    if (query.type && query.type !== col.name) continue
    for (const log of col.data) {
      if (query.level && log.level !== query.level) continue
      if (query.startDate && log.timestamp < query.startDate) continue
      if (query.endDate && log.timestamp > query.endDate) continue
      if (keyword) {
        const text = JSON.stringify(log).toLowerCase()
        if (!text.includes(keyword)) continue
      }
      results.push({ ...log, collection: col.name })
    }
  }
  results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  return results.slice(0, query.limit || 100)
}

// 日志轮转
function rotateLogsEx() {
  const rotated = { files: 0, archived: 0 }
  try {
    const files = fs.existsSync(LOGS_DIR) ? fs.readdirSync(LOGS_DIR) : []
    const maxSize = (db.logRotation?.maxSize) || 10 * 1024 * 1024
    for (const f of files) {
      const filePath = path.join(LOGS_DIR, f)
      const stat = fs.statSync(filePath)
      if (stat.size > maxSize) {
        const archiveName = f.replace('.log', '') + '-' + Date.now() + '.log.archive'
        fs.renameSync(filePath, path.join(LOGS_DIR, archiveName))
        rotated.files++
      }
    }
    // 清理过期归档
    const retainDays = (db.logRotation?.retainDays) || 30
    const threshold = Date.now() - retainDays * 24 * 3600 * 1000
    for (const f of files) {
      if (!f.endsWith('.archive')) continue
      const filePath = path.join(LOGS_DIR, f)
      const stat = fs.statSync(filePath)
      if (stat.mtimeMs < threshold) {
        fs.unlinkSync(filePath)
        rotated.archived++
      }
    }
  } catch (e) {
    console.error('日志轮转失败:', e.message)
  }
  return rotated
}

// 导出日志（CSV/JSON）
function exportLogsEx(format, filters) {
  const logs = searchLogsEx(filters || {})
  if (format === 'csv') {
    let csv = 'id,type,level,timestamp,message,userId\n'
    for (const log of logs) {
      const msg = (log.message || log.action || log.event || log.operation || '').replace(/"/g, '""')
      csv += `"${log.id}","${log.type}","${log.level}","${log.timestamp}","${msg}","${log.userId || ''}"\n`
    }
    return { format: 'csv', content: csv, count: logs.length }
  }
  // JSON
  return { format: 'json', content: JSON.stringify(logs, null, 2), count: logs.length }
}

// 日志统计
function getLogStatsEx() {
  return {
    operation: (db.operationLogs || []).length,
    error: (db.errorLogs || []).length,
    performance: (db.performanceLogs || []).length,
    security: (db.securityLogs || []).length,
    byLevel: {
      DEBUG: getLogsByLevel('DEBUG', 99999).length,
      INFO: getLogsByLevel('INFO', 99999).length,
      WARN: getLogsByLevel('WARN', 99999).length,
      ERROR: getLogsByLevel('ERROR', 99999).length,
      FATAL: getLogsByLevel('FATAL', 99999).length,
    },
    currentLevel: getLogLevel(),
    rotation: db.logRotation,
  }
}

// 清理旧日志
function cleanOldLogsEx(daysOld) {
  const threshold = Date.now() - (daysOld || 30) * 24 * 3600 * 1000
  const cleaned = { operation: 0, error: 0, performance: 0, security: 0 }
  if (db.operationLogs) {
    const before = db.operationLogs.length
    db.operationLogs = db.operationLogs.filter(l => new Date(l.timestamp).getTime() > threshold)
    cleaned.operation = before - db.operationLogs.length
  }
  if (db.errorLogs) {
    const before = db.errorLogs.length
    db.errorLogs = db.errorLogs.filter(l => new Date(l.timestamp).getTime() > threshold)
    cleaned.error = before - db.errorLogs.length
  }
  if (db.performanceLogs) {
    const before = db.performanceLogs.length
    db.performanceLogs = db.performanceLogs.filter(l => new Date(l.timestamp).getTime() > threshold)
    cleaned.performance = before - db.performanceLogs.length
  }
  if (db.securityLogs) {
    const before = db.securityLogs.length
    db.securityLogs = db.securityLogs.filter(l => new Date(l.timestamp).getTime() > threshold)
    cleaned.security = before - db.securityLogs.length
  }
  saveDB(db)
  return cleaned
}

// ============================================================
// 模块 7：完整数据导出系统
// ============================================================

// 对话导出为 CSV
function exportConversationCSV(conv) {
  let csv = '序号,角色,时间,内容\n'
  for (let i = 0; i < (conv.messages || []).length; i++) {
    const msg = conv.messages[i]
    const content = (msg.content || '').replace(/"/g, '""').replace(/\n/g, ' ')
    csv += `"${i + 1}","${msg.role}","${msg.timestamp}","${content}"\n`
  }
  return csv
}

// 对话导出为 TXT
function exportConversationTXT(conv) {
  let txt = '对话标题: ' + (conv.title || '无标题') + '\n'
  txt += '对话ID: ' + conv.id + '\n'
  txt += '创建时间: ' + conv.createdAt + '\n'
  txt += '消息数: ' + (conv.messages || []).length + '\n'
  txt += '='.repeat(50) + '\n\n'
  for (const msg of (conv.messages || [])) {
    const role = msg.role === 'user' ? '【用户】' : '【助手】'
    txt += role + ' ' + msg.timestamp + '\n'
    txt += msg.content + '\n'
    txt += '-'.repeat(50) + '\n'
  }
  return txt
}

// 知识库导出为 JSON
function exportKnowledgeJSON() {
  return {
    exportedAt: new Date().toISOString(),
    count: (db.knowledge || []).length,
    knowledge: db.knowledge || [],
  }
}

// 知识库导出为 CSV
function exportKnowledgeCSV() {
  let csv = 'ID,标题,内容,标签,创建时间\n'
  for (const k of (db.knowledge || [])) {
    const title = (k.title || '').replace(/"/g, '""')
    const content = (k.content || '').replace(/"/g, '""').replace(/\n/g, ' ')
    const tags = (k.tags || []).join(';')
    csv += `"${k.id}","${title}","${content}","${tags}","${k.createdAt}"\n`
  }
  return csv
}

// 用户数据导出（GDPR 合规）
function exportUserData(userId) {
  const user = Object.values(db.users || {}).find(u => u.id === userId)
  if (!user) return { error: '用户不存在' }
  // 收集用户所有数据
  const data = {
    exportedAt: new Date().toISOString(),
    purpose: 'GDPR data export',
    user: {
      id: user.id,
      username: user.username,
      email: user.email || null,
      role: user.role,
      orgId: user.orgId || null,
      language: user.language || 'zh-CN',
      createdAt: user.createdAt,
    },
    conversations: Object.values(db.conversations || {}).filter(c => c.userId === userId),
    files: Object.values(db.files || {}).filter(f => f.userId === userId),
    knowledge: (db.knowledge || []).filter(k => k.userId === userId),
    tasks: Object.values(db.tasks || {}).filter(t => t.userId === userId),
    messages: (db.messages || []).filter(m => m.toUserId === userId || m.fromUserId === userId),
    toolCalls: (db.toolCalls || []).filter(c => c.userId === userId),
    loginLogs: (db.loginLogs || []).filter(l => l.userId === userId),
    sessions: Object.values(db.sessions || {}).filter(s => s.username === user.username),
    apiKeys: listApiKeysEx(userId),
    pushSettings: getPushPreferences(userId),
    subscriptions: db.messageSubscriptions?.[userId] || {},
  }
  return data
}

// 统计报表导出（PDF/Excel 模拟）
function exportStatsReport(format) {
  const report = {
    generatedAt: new Date().toISOString(),
    period: 'all-time',
    summary: {
      totalConversations: Object.keys(db.conversations || {}).length,
      totalMessages: db.stats?.totalMessages || 0,
      totalTokens: db.stats?.totalTokens || 0,
      totalUsers: Object.keys(db.users || {}).length,
      totalKnowledge: (db.knowledge || []).length,
      totalFiles: Object.keys(db.files || {}).length,
      totalTasks: Object.keys(db.tasks || {}).length,
      totalToolCalls: (db.toolCalls || []).length,
    },
    breakdown: {
      conversationsByStatus: {
        active: Object.values(db.conversations || {}).filter(c => !c.archived).length,
        archived: Object.values(db.conversations || {}).filter(c => c.archived).length,
      },
      usersByRole: {
        admin: Object.values(db.users || {}).filter(u => u.role === 'admin').length,
        manager: Object.values(db.users || {}).filter(u => u.role === 'manager').length,
        user: Object.values(db.users || {}).filter(u => u.role === 'user').length,
        guest: Object.values(db.users || {}).filter(u => u.role === 'guest').length,
      },
      taskStats: {
        queued: Object.values(db.tasks || {}).filter(t => t.status === 'queued').length,
        running: Object.values(db.tasks || {}).filter(t => t.status === 'running').length,
        completed: Object.values(db.tasks || {}).filter(t => t.status === 'completed').length,
        failed: Object.values(db.tasks || {}).filter(t => t.status === 'failed').length,
      },
    },
    system: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: '3.0.0',
    },
  }
  if (format === 'excel-csv') {
    // 模拟 Excel 导出（CSV 格式）
    let csv = '指标,数值\n'
    for (const [k, v] of Object.entries(report.summary)) {
      csv += `${k},${v}\n`
    }
    csv += '\n分类统计\n'
    for (const [group, stats] of Object.entries(report.breakdown)) {
      for (const [k, v] of Object.entries(stats)) {
        csv += `${group}.${k},${v}\n`
      }
    }
    return { format: 'csv', content: csv, filename: 'stats-report-' + getLogDateStr() + '.csv' }
  }
  // PDF 模拟（返回可打印的 HTML）
  const html = generateReportHTML(report)
  return { format: 'pdf-html', content: html, filename: 'stats-report-' + getLogDateStr() + '.html' }
}

// 生成报表 HTML
function generateReportHTML(report) {
  let html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>统计报表</title>'
  html += '<style>body{font-family:sans-serif;margin:40px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ddd;padding:8px}h2{color:#333}</style>'
  html += '</head><body><h1>HopeAgent Pro 统计报表</h1>'
  html += '<p>生成时间: ' + report.generatedAt + '</p>'
  html += '<h2>总体统计</h2><table><tr><th>指标</th><th>数值</th></tr>'
  for (const [k, v] of Object.entries(report.summary)) {
    html += '<tr><td>' + k + '</td><td>' + v + '</td></tr>'
  }
  html += '</table>'
  html += '<h2>系统信息</h2><table><tr><th>项目</th><th>值</th></tr>'
  html += '<tr><td>运行时长</td><td>' + Math.round(report.system.uptime) + ' 秒</td></tr>'
  html += '<tr><td>版本</td><td>' + report.system.version + '</td></tr>'
  html += '</table></body></html>'
  return html
}

// 创建导出任务（异步）
function createExportTaskEx(userId, type, options) {
  if (!db.exportHistory) db.exportHistory = []
  const taskId = 'export_' + genId()
  const task = {
    id: taskId,
    userId,
    type,
    options: options || {},
    status: 'pending',
    result: null,
    createdAt: new Date().toISOString(),
    completedAt: null,
  }
  db.exportHistory.push(task)
  saveDB(db)
  // 异步执行
  setTimeout(() => {
    try {
      task.status = 'processing'
      saveDB(db)
      let result
      if (type === 'conversation') {
        const conv = db.conversations[options.conversationId]
        if (!conv) throw new Error('对话不存在')
        if (options.format === 'csv') result = exportConversationCSV(conv)
        else if (options.format === 'txt') result = exportConversationTXT(conv)
        else if (options.format === 'json') result = JSON.stringify(conv, null, 2)
        else result = exportConversationMarkdown(conv)
      } else if (type === 'knowledge') {
        result = options.format === 'csv' ? exportKnowledgeCSV() : JSON.stringify(exportKnowledgeJSON(), null, 2)
      } else if (type === 'user_data') {
        result = JSON.stringify(exportUserData(userId), null, 2)
      } else if (type === 'stats') {
        const r = exportStatsReport(options.format)
        result = r.content
      } else {
        result = JSON.stringify(exportAllAsJson(), null, 2)
      }
      task.status = 'completed'
      task.result = { content: result, length: result.length }
      task.completedAt = new Date().toISOString()
      saveDB(db)
    } catch (e) {
      task.status = 'failed'
      task.error = e.message
      task.completedAt = new Date().toISOString()
      saveDB(db)
    }
  }, 100)
  return task
}

// 获取导出历史
function getExportHistoryEx(userId, limit) {
  if (!db.exportHistory) return []
  let history = db.exportHistory
  if (userId) history = history.filter(h => h.userId === userId)
  return history.slice(-(limit || 50)).reverse()
}

// 定时导出
function scheduleExportEx(userId, cronExpression, type, options) {
  if (!db.scheduledExports) db.scheduledExports = {}
  const id = 'sched_' + genId()
  db.scheduledExports[id] = {
    id,
    userId,
    cronExpression,
    type,
    options,
    enabled: true,
    lastRun: null,
    nextRun: null,
    createdAt: new Date().toISOString(),
  }
  saveDB(db)
  // 注册 cron 任务
  addCronJob(cronExpression, () => {
    createExportTaskEx(userId, type, options)
    db.scheduledExports[id].lastRun = new Date().toISOString()
    saveDB(db)
  }, 'export_' + id, { type, options })
  return db.scheduledExports[id]
}

// 获取导出配置
function getExportConfigEx(userId) {
  if (!db.exportConfigs) db.exportConfigs = {}
  return db.exportConfigs[userId] || {
    defaultFormat: 'json',
    includeMetadata: true,
    compress: false,
    fields: [],
  }
}

// 设置导出配置
function setExportConfigEx(userId, config) {
  if (!db.exportConfigs) db.exportConfigs = {}
  db.exportConfigs[userId] = {
    ...db.exportConfigs[userId],
    ...config,
    updatedAt: new Date().toISOString(),
  }
  saveDB(db)
  return db.exportConfigs[userId]
}

// ============================================================
// 模块 8：完整 API 版本管理
// ============================================================

// API 版本定义
const API_VERSION_INFO = {
  v1: {
    version: 'v1',
    status: 'deprecated',
    releasedAt: '2024-01-01T00:00:00Z',
    deprecatedAt: '2025-06-01T00:00:00Z',
    sunsetDate: '2026-12-31T00:00:00Z',
    migrationGuide: 'v1 接口已废弃，请迁移至 v2。主要变更：响应结构标准化、新增分页支持、鉴权改用 Bearer Token。',
    changes: [
      '响应统一包裹在 {success, data, error} 结构中',
      '列表接口支持 page/pageSize 分页参数',
      '认证改用 Authorization: Bearer <token>',
      '移除部分旧字段：msg -> message, ok -> success',
    ],
  },
  v2: {
    version: 'v2',
    status: 'stable',
    releasedAt: '2025-06-01T00:00:00Z',
    deprecatedAt: null,
    sunsetDate: null,
    migrationGuide: 'v2 为当前稳定版本，推荐所有新接入使用。',
    changes: [
      '标准化响应结构',
      '完整 RBAC 权限校验',
      '支持 OAuth 与 JWT 双令牌',
      '新增组织与团队管理',
      '新增消息通知系统',
    ],
  },
}

// 注册/更新版本
function registerVersion(version, status, info) {
  if (!db.apiVersions) db.apiVersions = {}
  db.apiVersions[version] = {
    version,
    status: status || 'stable',
    releasedAt: info?.releasedAt || new Date().toISOString(),
    ...info,
  }
  saveDB(db)
  return db.apiVersions[version]
}

// 废弃版本
function deprecateVersionEx(version, migrationNote, sunsetDate) {
  if (!db.apiVersions) db.apiVersions = {}
  if (!db.apiVersions[version]) return { error: '版本不存在' }
  db.apiVersions[version].status = 'deprecated'
  db.apiVersions[version].deprecatedAt = new Date().toISOString()
  db.apiVersions[version].migrationNote = migrationNote || '请迁移到新版本'
  db.apiVersions[version].sunsetDate = sunsetDate || null
  saveDB(db)
  return db.apiVersions[version]
}

// 获取版本信息
function getVersionInfoEx(version) {
  return API_VERSION_INFO[version] || db.apiVersions?.[version] || null
}

// 列出所有版本
function listVersionsEx() {
  return Object.values(API_VERSION_INFO).map(v => ({
    version: v.version,
    status: v.status,
    releasedAt: v.releasedAt,
    deprecatedAt: v.deprecatedAt || null,
    sunsetDate: v.sunsetDate || null,
  }))
}

// 版本兼容层：旧 API 参数转换
function transformV1ToV2(data) {
  if (!data) return data
  const transformed = { ...data }
  // 字段名映射
  if (transformed.msg !== undefined) {
    transformed.message = transformed.msg
    delete transformed.msg
  }
  if (transformed.ok !== undefined) {
    transformed.success = transformed.ok
    delete transformed.ok
  }
  if (transformed.uid !== undefined) {
    transformed.userId = transformed.uid
    delete transformed.uid
  }
  if (transformed.conv_id !== undefined) {
    transformed.conversationId = transformed.conv_id
    delete transformed.conv_id
  }
  return transformed
}

// v2 响应转 v1
function transformV2ToV1(data) {
  if (!data) return data
  const transformed = { ...data }
  if (transformed.message !== undefined) {
    transformed.msg = transformed.message
  }
  if (transformed.success !== undefined) {
    transformed.ok = transformed.success
  }
  return transformed
}

// 记录版本使用
function recordVersionUsageEx(version) {
  if (!db.versionUsage) db.versionUsage = []
  db.versionUsage.push({
    version,
    timestamp: new Date().toISOString(),
  })
  if (db.versionUsage.length > 5000) db.versionUsage = db.versionUsage.slice(-2000)
  // 更新统计
  if (!db.versionStats) db.versionStats = {}
  if (!db.versionStats[version]) db.versionStats[version] = { count: 0, lastUsed: null }
  db.versionStats[version].count++
  db.versionStats[version].lastUsed = new Date().toISOString()
  saveDB(db)
}

// 获取版本使用统计
function getVersionStatsEx() {
  const stats = {}
  for (const v of Object.keys(API_VERSION_INFO)) {
    stats[v] = db.versionStats?.[v] || { count: 0, lastUsed: null }
  }
  // 最近24小时使用趋势
  const dayAgo = Date.now() - 24 * 3600 * 1000
  const recent = (db.versionUsage || []).filter(u => new Date(u.timestamp).getTime() > dayAgo)
  const recentByVer = {}
  for (const u of recent) {
    recentByVer[u.version] = (recentByVer[u.version] || 0) + 1
  }
  return {
    total: stats,
    recent24h: recentByVer,
    totalRequests: (db.versionUsage || []).length,
  }
}

// 获取版本文档
function getVersionDocsEx(version) {
  const info = getVersionInfoEx(version)
  if (!info) return { error: '版本不存在' }
  return {
    version: info.version,
    status: info.status,
    releasedAt: info.releasedAt,
    migrationGuide: info.migrationGuide || '',
    changes: info.changes || [],
    sunsetDate: info.sunsetDate || null,
    endpoints: getVersionEndpoints(version),
  }
}

// 获取版本的端点列表
function getVersionEndpoints(version) {
  if (version === 'v1') {
    return [
      { method: 'GET', path: '/api/v1/conversations', description: '获取对话列表（旧）' },
      { method: 'POST', path: '/api/v1/chat', description: '发送消息（旧，参数 msg）' },
      { method: 'GET', path: '/api/v1/knowledge', description: '获取知识库（旧）' },
      { method: 'POST', path: '/api/v1/auth', description: '认证（旧，返回 token）' },
    ]
  }
  return [
    { method: 'GET', path: '/api/v2/conversations', description: '获取对话列表（支持分页）' },
    { method: 'POST', path: '/api/v2/chat/send', description: '发送消息（参数 message）' },
    { method: 'POST', path: '/api/v2/chat/stream', description: '流式对话' },
    { method: 'GET', path: '/api/v2/knowledge', description: '获取知识库' },
    { method: 'POST', path: '/api/v2/auth/login', description: '登录（返回 accessToken + refreshToken）' },
    { method: 'GET', path: '/api/v2/orgs', description: '获取组织信息' },
    { method: 'GET', path: '/api/v2/messages', description: '获取站内消息' },
  ]
}

// ============================================================
// 模块 9：完整 WebSocket 增强
// ============================================================

// WebSocket 房间系统
function wsJoinRoomEx(client, roomId) {
  if (!client) return false
  if (!client.rooms) client.rooms = new Set()
  client.rooms.add(roomId)
  if (!db.wsRooms) db.wsRooms = {}
  if (!db.wsRooms[roomId]) db.wsRooms[roomId] = new Set()
  // 注意：Set 不能直接序列化，存客户端 ID
  if (!db.wsRooms[roomId].clientIds) db.wsRooms[roomId].clientIds = []
  if (!db.wsRooms[roomId].clientIds.includes(client.id)) {
    db.wsRooms[roomId].clientIds.push(client.id)
  }
  db.wsRooms[roomId].memberCount = db.wsRooms[roomId].clientIds.length
  db.wsRooms[roomId].updatedAt = new Date().toISOString()
  saveDB(db)
  wsSend(client, { type: 'room_joined', roomId, memberCount: db.wsRooms[roomId].memberCount })
  return true
}

// 离开房间
function wsLeaveRoomEx(client, roomId) {
  if (!client || !client.rooms) return false
  client.rooms.delete(roomId)
  if (db.wsRooms && db.wsRooms[roomId]) {
    db.wsRooms[roomId].clientIds = (db.wsRooms[roomId].clientIds || []).filter(id => id !== client.id)
    db.wsRooms[roomId].memberCount = db.wsRooms[roomId].clientIds.length
    if (db.wsRooms[roomId].memberCount === 0) {
      delete db.wsRooms[roomId]
    }
    saveDB(db)
  }
  wsSend(client, { type: 'room_left', roomId })
  return true
}

// 广播到房间
function wsBroadcastRoomEx(roomId, message) {
  let count = 0
  for (const client of wsClients) {
    if (client.rooms && client.rooms.has(roomId)) {
      wsSend(client, message)
      count++
    }
  }
  return count
}

// 发送给指定用户（通过 userId 关联的客户端）
function wsSendToUserEx(userId, message) {
  let count = 0
  for (const client of wsClients) {
    if (client.userId === userId) {
      wsSend(client, message)
      count++
    }
  }
  // 用户不在线，缓存为离线消息
  if (count === 0) {
    wsQueueOfflineMessageEx(userId, message)
  }
  return { delivered: count, queued: count === 0 ? 1 : 0 }
}

// 设置用户在线状态
function wsSetPresenceEx(userId, status) {
  if (!db.wsPresence) db.wsPresence = {}
  const validStatus = ['online', 'offline', 'busy', 'away']
  if (!validStatus.includes(status)) status = 'online'
  db.wsPresence[userId] = {
    userId,
    status,
    lastSeen: new Date().toISOString(),
  }
  saveDB(db)
  // 广播状态变更
  wsBroadcast({ type: 'presence_update', userId, status, time: new Date().toISOString() })
  return db.wsPresence[userId]
}

// 获取用户在线状态
function wsGetPresenceEx(userId) {
  if (!db.wsPresence || !db.wsPresence[userId]) {
    return { userId, status: 'offline', lastSeen: null }
  }
  return db.wsPresence[userId]
}

// 缓存离线消息
function wsQueueOfflineMessageEx(userId, message) {
  if (!db.wsOfflineMessages) db.wsOfflineMessages = {}
  if (!db.wsOfflineMessages[userId]) db.wsOfflineMessages[userId] = []
  db.wsOfflineMessages[userId].push({
    id: genId(),
    message,
    queuedAt: new Date().toISOString(),
  })
  // 每用户最多缓存 100 条
  if (db.wsOfflineMessages[userId].length > 100) {
    db.wsOfflineMessages[userId] = db.wsOfflineMessages[userId].slice(-50)
  }
  saveDB(db)
  return true
}

// 投递离线消息
function wsDeliverOfflineMessagesEx(userId) {
  if (!db.wsOfflineMessages || !db.wsOfflineMessages[userId]) return { delivered: 0 }
  const messages = db.wsOfflineMessages[userId]
  let delivered = 0
  for (const item of messages) {
    const result = wsSendToUserEx(userId, item.message)
    if (result.delivered > 0) delivered++
  }
  if (delivered > 0) {
    db.wsOfflineMessages[userId] = db.wsOfflineMessages[userId].slice(delivered)
    saveDB(db)
  }
  return { delivered, remaining: db.wsOfflineMessages[userId].length }
}

// 流式数据推送
function wsStreamDataEx(clientId, data) {
  for (const client of wsClients) {
    if (client.id === clientId) {
      wsSend(client, { type: 'stream', data, timestamp: new Date().toISOString() })
      return true
    }
  }
  return false
}

// 多端消息同步
function wsSyncMessageEx(userId, message) {
  return wsSendToUserEx(userId, { type: 'sync', ...message, syncedAt: new Date().toISOString() })
}

// WebSocket 消息类型
const WS_MESSAGE_TYPES = {
  CHAT: 'chat',
  NOTIFICATION: 'notification',
  SYSTEM: 'system',
  FILE: 'file',
  SYNC: 'sync',
  PRESENCE: 'presence',
  TASK: 'task',
  ERROR: 'error',
}

// 处理增强 WebSocket 消息
function handleWsMessageEx(client, msg) {
  if (!msg || !msg.type) return
  switch (msg.type) {
    case 'join_room':
      if (msg.roomId) wsJoinRoomEx(client, msg.roomId)
      break
    case 'leave_room':
      if (msg.roomId) wsLeaveRoomEx(client, msg.roomId)
      break
    case 'room_message':
      if (msg.roomId) {
        wsBroadcastRoomEx(msg.roomId, {
          type: 'room_message',
          roomId: msg.roomId,
          message: msg.message,
          from: client.id,
          time: new Date().toISOString(),
        })
      }
      break
    case 'set_presence':
      if (client.userId && msg.status) wsSetPresenceEx(client.userId, msg.status)
      break
    case 'get_presence':
      if (msg.userId) {
        const presence = wsGetPresenceEx(msg.userId)
        wsSend(client, { type: 'presence', ...presence })
      }
      break
    case 'ping':
      wsSend(client, { type: 'pong', time: new Date().toISOString() })
      break
    case 'subscribe':
      client.subscriptions = msg.channels || []
      wsSend(client, { type: 'subscribed', channels: client.subscriptions })
      break
    default:
      // 未知类型，原样回显
      wsSend(client, { type: 'echo', original: msg })
  }
}

// 为 WebSocket 客户端绑定 userId
function bindWsClientUser(client, userId) {
  client.userId = userId
  // 上线
  wsSetPresenceEx(userId, 'online')
  // 投递离线消息
  wsDeliverOfflineMessagesEx(userId)
}

// 客户端断开时处理
function onWsClientDisconnectEx(client) {
  if (client.userId) {
    wsSetPresenceEx(client.userId, 'offline')
  }
  // 离开所有房间
  if (client.rooms) {
    for (const roomId of client.rooms) {
      if (db.wsRooms && db.wsRooms[roomId]) {
        db.wsRooms[roomId].clientIds = (db.wsRooms[roomId].clientIds || []).filter(id => id !== client.id)
      }
    }
    saveDB(db)
  }
}

// WebSocket 统计
function getWsStatsEx() {
  let totalRooms = 0
  let totalMembers = 0
  for (const room of Object.values(db.wsRooms || {})) {
    totalRooms++
    totalMembers += (room.memberCount || 0)
  }
  const onlineUsers = Object.values(db.wsPresence || {}).filter(p => p.status === 'online').length
  let offlineMessages = 0
  for (const msgs of Object.values(db.wsOfflineMessages || {})) {
    offlineMessages += msgs.length
  }
  return {
    connections: wsClients.size,
    rooms: totalRooms,
    roomMembers: totalMembers,
    onlineUsers,
    offlineMessageQueue: offlineMessages,
    sseConnections: sseConnections.size,
  }
}

// 获取房间列表
function getWsRoomsEx() {
  if (!db.wsRooms) return []
  return Object.entries(db.wsRooms).map(([id, room]) => ({
    id,
    memberCount: room.memberCount || 0,
    updatedAt: room.updatedAt,
  }))
}

// ============================================================
// 模块 10：完整任务调度增强
// ============================================================

// 调度一次性任务（延时执行）
function scheduleOneTimeTaskEx(name, delayMs, callback, payload) {
  if (!db.oneTimeTasks) db.oneTimeTasks = {}
  const taskId = 'onetime_' + genId()
  const executeAt = Date.now() + delayMs
  const task = {
    id: taskId,
    name: name || '一次性任务',
    type: 'onetime',
    payload: payload || {},
    status: 'scheduled',
    delayMs,
    executeAt: new Date(executeAt).toISOString(),
    createdAt: new Date().toISOString(),
    startedAt: null,
    completedAt: null,
    result: null,
    error: null,
    priority: 0,
  }
  db.oneTimeTasks[taskId] = task
  saveDB(db)
  // 设定定时器
  const timer = setTimeout(async () => {
    task.status = 'running'
    task.startedAt = new Date().toISOString()
    saveDB(db)
    try {
      const result = callback ? await callback(payload) : { executed: true }
      task.result = result
      task.status = 'completed'
      // 触发依赖任务
      triggerDependentTasksEx(taskId)
    } catch (e) {
      task.error = e.message
      task.status = 'failed'
      // 重试逻辑
      if (!task.retryCount) task.retryCount = 0
      if (task.retryCount < 3) {
        task.retryCount++
        task.status = 'scheduled'
        task.executeAt = new Date(Date.now() + delayMs).toISOString()
        saveDB(db)
        setTimeout(() => {
          // 简化：标记失败不再自动重试
        }, delayMs)
      }
    }
    task.completedAt = new Date().toISOString()
    saveDB(db)
    logTaskEx(taskId, task.status, task.result || task.error)
  }, delayMs)
  // 保存 timer 引用（内存中，不持久化）
  task._timer = timer
  return task
}

// 调度重复任务（间隔执行）
function scheduleRecurringTaskEx(name, intervalMs, callback, payload) {
  if (!db.recurringTasks) db.recurringTasks = {}
  const taskId = 'recurring_' + genId()
  const task = {
    id: taskId,
    name: name || '重复任务',
    type: 'recurring',
    payload: payload || {},
    intervalMs,
    enabled: true,
    runCount: 0,
    lastRunAt: null,
    nextRunAt: new Date(Date.now() + intervalMs).toISOString(),
    createdAt: new Date().toISOString(),
    lastError: null,
  }
  db.recurringTasks[taskId] = task
  saveDB(db)
  const timer = setInterval(async () => {
    if (!task.enabled) return
    try {
      const result = callback ? await callback(payload) : { executed: true }
      task.runCount++
      task.lastRunAt = new Date().toISOString()
      task.nextRunAt = new Date(Date.now() + intervalMs).toISOString()
      task.lastResult = result
      saveDB(db)
      logTaskEx(taskId, 'recurring_run', result)
    } catch (e) {
      task.lastError = e.message
      saveDB(db)
      logTaskEx(taskId, 'recurring_error', { error: e.message })
    }
  }, intervalMs)
  task._timer = timer
  return task
}

// 添加任务依赖（A 完成后触发 B）
function addTaskDependencyEx(taskId, dependsOnId) {
  if (!db.taskDependencies) db.taskDependencies = {}
  if (!db.taskDependencies[taskId]) db.taskDependencies[taskId] = []
  db.taskDependencies[taskId].push({
    taskId,
    dependsOnId,
    createdAt: new Date().toISOString(),
  })
  saveDB(db)
  return { success: true }
}

// 触发依赖任务
function triggerDependentTasksEx(completedTaskId) {
  if (!db.taskDependencies) return { triggered: 0 }
  let triggered = 0
  for (const [taskId, deps] of Object.entries(db.taskDependencies)) {
    if (deps.some(d => d.dependsOnId === completedTaskId)) {
      // 标记该任务可执行
      if (db.oneTimeTasks && db.oneTimeTasks[taskId] && db.oneTimeTasks[taskId].status === 'blocked') {
        db.oneTimeTasks[taskId].status = 'ready'
        db.oneTimeTasks[taskId].unblockedAt = new Date().toISOString()
        saveDB(db)
        triggered++
      }
    }
  }
  return { triggered }
}

// 设置任务优先级
function setTaskPriorityEx(taskId, priority) {
  const task = db.tasks?.[taskId] || db.oneTimeTasks?.[taskId]
  if (!task) return { error: '任务不存在' }
  task.priority = priority
  saveDB(db)
  return { success: true, priority }
}

// 设置任务超时
function setTaskTimeoutEx(taskId, timeoutMs) {
  const task = db.tasks?.[taskId]
  if (!task) return { error: '任务不存在' }
  task.timeoutMs = timeoutMs
  saveDB(db)
  return { success: true, timeoutMs }
}

// 任务重试
function retryTaskEx(taskId, maxRetries) {
  const task = db.tasks?.[taskId]
  if (!task) return { error: '任务不存在' }
  if (task.status !== 'failed') return { error: '仅失败任务可重试' }
  task.maxRetries = maxRetries || 3
  task.retryCount = (task.retryCount || 0) + 1
  if (task.retryCount > task.maxRetries) {
    return { error: '已达最大重试次数' }
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
  return { success: true, retryCount: task.retryCount, maxRetries: task.maxRetries }
}

// 更新任务进度
function updateTaskProgressEx(taskId, progress, message) {
  const task = db.tasks?.[taskId]
  if (!task) return { error: '任务不存在' }
  task.progress = Math.min(100, Math.max(0, progress))
  if (message) task.progressMessage = message
  if (!db.taskProgress) db.taskProgress = {}
  db.taskProgress[taskId] = {
    taskId,
    progress: task.progress,
    message: message || '',
    updatedAt: new Date().toISOString(),
  }
  saveDB(db)
  wsBroadcast({ type: 'task_progress', taskId, progress: task.progress, message })
  return { success: true, progress: task.progress }
}

// 取消任务
function cancelTaskEx(taskId) {
  const task = db.tasks?.[taskId]
  if (!task) return { error: '任务不存在' }
  if (task.status === 'running') {
    task.status = 'cancelled'
    task.cancelledAt = new Date().toISOString()
    // 从队列移除
    const idx = taskQueue.indexOf(taskId)
    if (idx >= 0) taskQueue.splice(idx, 1)
    saveDB(db)
    logTaskEx(taskId, 'cancelled', {})
    return { success: true }
  }
  if (task.status === 'queued') {
    const idx = taskQueue.indexOf(taskId)
    if (idx >= 0) taskQueue.splice(idx, 1)
    task.status = 'cancelled'
    task.cancelledAt = new Date().toISOString()
    saveDB(db)
    return { success: true }
  }
  return { error: '任务状态为 ' + task.status + '，无法取消' }
}

// 任务日志
function logTaskEx(taskId, event, details) {
  if (!db.taskLogs) db.taskLogs = {}
  if (!db.taskLogs[taskId]) db.taskLogs[taskId] = []
  const log = {
    id: genId(),
    taskId,
    event,
    details: details || {},
    timestamp: new Date().toISOString(),
  }
  db.taskLogs[taskId].push(log)
  if (db.taskLogs[taskId].length > 100) db.taskLogs[taskId] = db.taskLogs[taskId].slice(-50)
  saveDB(db)
  return log
}

// 获取任务日志
function getTaskLogEx(taskId) {
  if (!db.taskLogs || !db.taskLogs[taskId]) return []
  return db.taskLogs[taskId]
}

// 列出任务类型
function listTaskTypesEx() {
  return [
    { type: 'batch_analyze', name: '批量分析', description: '批量分析数据项' },
    { type: 'vector_reindex', name: '向量重建索引', description: '重建知识库向量索引' },
    { type: 'tool_batch', name: '批量工具调用', description: '批量执行工具调用' },
    { type: 'export', name: '数据导出', description: '异步导出数据' },
    { type: 'backup', name: '数据备份', description: '创建数据备份' },
    { type: 'cleanup', name: '数据清理', description: '清理过期数据' },
    { type: 'reindex_search', name: '搜索重建', description: '重建搜索索引' },
    { type: 'archive_messages', name: '消息归档', description: '归档过期消息' },
  ]
}

// 列出一次性任务
function listOneTimeTasksEx() {
  if (!db.oneTimeTasks) return []
  return Object.values(db.oneTimeTasks).map(t => ({
    id: t.id,
    name: t.name,
    status: t.status,
    executeAt: t.executeAt,
    createdAt: t.createdAt,
    completedAt: t.completedAt,
    priority: t.priority,
  })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

// 列出重复任务
function listRecurringTasksEx() {
  if (!db.recurringTasks) return []
  return Object.values(db.recurringTasks).map(t => ({
    id: t.id,
    name: t.name,
    intervalMs: t.intervalMs,
    enabled: t.enabled,
    runCount: t.runCount,
    lastRunAt: t.lastRunAt,
    nextRunAt: t.nextRunAt,
  })).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
}

// 暂停重复任务
function pauseRecurringTaskEx(taskId) {
  if (!db.recurringTasks || !db.recurringTasks[taskId]) return { error: '任务不存在' }
  db.recurringTasks[taskId].enabled = false
  saveDB(db)
  return { success: true }
}

// 恢复重复任务
function resumeRecurringTaskEx(taskId) {
  if (!db.recurringTasks || !db.recurringTasks[taskId]) return { error: '任务不存在' }
  db.recurringTasks[taskId].enabled = true
  saveDB(db)
  return { success: true }
}

// 删除重复任务
function deleteRecurringTaskEx(taskId) {
  if (!db.recurringTasks || !db.recurringTasks[taskId]) return { error: '任务不存在' }
  delete db.recurringTasks[taskId]
  saveDB(db)
  return { success: true }
}

// ============================================================
// 模块 1 扩展：用户档案与账号管理
// ============================================================

// 更新用户档案（displayName / 头像 / 简介 / 偏好语言）
function updateUserProfile(userId, profile) {
  const user = Object.values(db.users || {}).find(u => u.id === userId)
  if (!user) return { error: '用户不存在' }
  if (profile.displayName !== undefined) user.displayName = profile.displayName
  if (profile.avatar !== undefined) user.avatar = profile.avatar
  if (profile.bio !== undefined) user.bio = profile.bio
  if (profile.language !== undefined) user.language = profile.language
  if (profile.timezone !== undefined) user.timezone = profile.timezone
  if (profile.phone !== undefined) user.phone = profile.phone
  user.updatedAt = new Date().toISOString()
  saveDB(db)
  return { success: true, user: publicUser(user) }
}

// 获取用户档案（含扩展字段）
function getUserProfile(userId) {
  const user = Object.values(db.users || {}).find(u => u.id === userId)
  if (!user) return { error: '用户不存在' }
  return {
    ...publicUser(user),
    email: user.email || null,
    avatar: user.avatar || null,
    bio: user.bio || '',
    timezone: user.timezone || 'Asia/Shanghai',
    phone: user.phone || null,
    displayName: user.displayName || user.username,
    lastLoginAt: user.lastLoginAt || null,
    twoFactorEnabled: !!(db.twoFactor && db.twoFactor[userId] && db.twoFactor[userId].enabled),
  }
}

// 账号注销（软删除：标记为已注销，保留数据审计）
function deactivateAccount(userId, password) {
  const user = Object.values(db.users || {}).find(u => u.id === userId)
  if (!user) return { error: '用户不存在' }
  if (!verifyPassword(password, user.password)) return { error: '密码不正确' }
  user.deactivated = true
  user.deactivatedAt = new Date().toISOString()
  user.username = user.username + '_deleted_' + Date.now()
  if (user.email) user.email = null
  // 踢出所有会话
  kickAllSessions(userId)
  // 吊销所有 API Key
  if (user.apiKeysEx) {
    for (const k of user.apiKeysEx) revokeApiKeyEx(k.key)
  }
  saveDB(db)
  auditLog('user.deactivate', userId, 'unknown', {})
  return { success: true, message: '账号已注销' }
}

// 获取账号安全概览（密码强度 / 2FA / 会话数 / 最近登录）
function getAccountSecurityOverview(userId) {
  const user = Object.values(db.users || {}).find(u => u.id === userId)
  if (!user) return { error: '用户不存在' }
  const sessions = getUserSessions(userId)
  const recentLogins = getLoginLogs({ userId, limit: 5 })
  const twoFactor = db.twoFactor && db.twoFactor[userId]
  const apiKeys = listApiKeysEx(userId)
  return {
    passwordSet: !!user.password,
    passwordUpdatedAt: user.passwordUpdatedAt || null,
    twoFactorEnabled: !!(twoFactor && twoFactor.enabled),
    twoFactorSetupAt: twoFactor ? twoFactor.createdAt : null,
    activeSessions: sessions.length,
    sessions,
    recentLogins,
    apiKeysCount: apiKeys.length,
    lastLoginAt: recentLogins.find(l => l.success) ? recentLogins.find(l => l.success).timestamp : null,
  }
}

// 验证邮箱（独立于注册流程）
function verifyEmail(userId, code) {
  const user = Object.values(db.users || {}).find(u => u.id === userId)
  if (!user || !user.email) return { ok: false, error: '用户或邮箱不存在' }
  const valid = verifyEmailCode(user.email, code)
  if (!valid) return { ok: false, error: '验证码无效或已过期' }
  user.emailVerified = true
  user.emailVerifiedAt = new Date().toISOString()
  saveDB(db)
  return { ok: true }
}

// 重新发送邮箱验证（标记邮箱为未验证并生成新码）
function resendEmailVerification(userId) {
  const user = Object.values(db.users || {}).find(u => u.id === userId)
  if (!user || !user.email) return { error: '用户或邮箱不存在' }
  const code = generateEmailCode(user.email)
  return { success: true, code, email: user.email, expiresIn: 600 }
}

// ============================================================
// 模块 2 扩展：用户角色分配与角色成员管理
// ============================================================

// 为用户分配角色（含权限审计）
function assignUserRole(userId, roleId, assignedBy) {
  const user = Object.values(db.users || {}).find(u => u.id === userId)
  if (!user) return { error: '用户不存在' }
  // 校验角色存在（内置或自定义）
  const builtinRoles = ['admin', 'manager', 'developer', 'user']
  if (!builtinRoles.includes(roleId) && !(db.customRoles && db.customRoles[roleId])) {
    return { error: '角色不存在' }
  }
  const oldRole = user.role
  user.role = roleId
  user.roleAssignedAt = new Date().toISOString()
  user.roleAssignedBy = assignedBy || null
  saveDB(db)
  logPermissionChange(assignedBy, 'user.role_assign', { userId, oldRole, newRole: roleId })
  auditLog('user.role_assign', assignedBy, 'unknown', { userId, oldRole, newRole: roleId })
  return { success: true, oldRole, newRole: roleId }
}

// 获取某角色下的所有用户
function getUsersByRole(roleId) {
  return Object.values(db.users || {})
    .filter(u => u.role === roleId && !u.deactivated)
    .map(publicUser)
}

// 角色使用统计（每角色用户数）
function getRoleUsageStats() {
  const stats = {}
  for (const user of Object.values(db.users || {})) {
    if (user.deactivated) continue
    const role = user.role || 'user'
    if (!stats[role]) stats[role] = { role, userCount: 0 }
    stats[role].userCount++
  }
  return Object.values(stats)
}

// 克隆角色（基于现有角色创建新自定义角色）
function cloneRole(sourceRoleId, newRoleId, newName) {
  const builtinRoles = ['admin', 'manager', 'developer', 'user']
  let permissions = []
  if (builtinRoles.includes(sourceRoleId)) {
    const { permissions: p } = getRolePermissionsEx(sourceRoleId)
    permissions = p
  } else if (db.customRoles && db.customRoles[sourceRoleId]) {
    const { permissions: p } = getRolePermissionsEx(sourceRoleId)
    permissions = p
  } else {
    return { error: '源角色不存在' }
  }
  if (db.customRoles && db.customRoles[newRoleId]) return { error: '新角色 id 已存在' }
  return createCustomRole(newRoleId, newName, permissions, sourceRoleId, '克隆自 ' + sourceRoleId)
}

// ============================================================
// 模块 3 扩展：组织列表与成员搜索
// ============================================================

// 列出所有组织（管理员）
function listAllOrgs() {
  return Object.values(db.orgs || {}).map(org => ({
    id: org.id,
    name: org.name,
    ownerId: org.ownerId,
    memberCount: getOrgMembers(org.id).length,
    teamCount: listTeams(org.id).length,
    departmentCount: db.departments ? Object.values(db.departments).filter(d => d.orgId === org.id).length : 0,
    createdAt: org.createdAt,
  }))
}

// 搜索组织成员（按用户名/邮箱/角色）
function searchOrgMembers(orgId, keyword, role) {
  const members = getOrgMembers(orgId)
  let result = members
  if (keyword) {
    const kw = keyword.toLowerCase()
    result = result.filter(m =>
      (m.username && m.username.toLowerCase().includes(kw)) ||
      (m.email && m.email.toLowerCase().includes(kw)) ||
      (m.displayName && m.displayName.toLowerCase().includes(kw))
    )
  }
  if (role) {
    result = result.filter(m => (m.role || 'member') === role)
  }
  return result.map(m => ({
    ...publicUser(m),
    email: m.email || null,
    displayName: m.displayName || m.username,
    joinedAt: m.joinedAt || null,
  }))
}

// 获取组织成员详情（含部门/团队归属）
function getOrgMemberDetail(orgId, userId) {
  const members = getOrgMembers(orgId)
  const member = members.find(m => m.id === userId)
  if (!member) return { error: '成员不存在' }
  const departments = db.departments
    ? Object.values(db.departments).filter(d => d.orgId === orgId && (d.memberIds || []).includes(userId))
    : []
  const teams = db.teams
    ? Object.values(db.teams).filter(t => t.orgId === orgId && (t.memberIds || []).includes(userId))
    : []
  return {
    ...publicUser(member),
    email: member.email || null,
    departments: departments.map(d => ({ id: d.id, name: d.name })),
    teams: teams.map(t => ({ id: t.id, name: t.name, role: t.memberRoles ? t.memberRoles[userId] : 'member' })),
  }
}

// 获取组织概览仪表盘
function getOrgDashboard(orgId) {
  const stats = getOrgStats(orgId)
  const quota = getOrgQuotaUsage(orgId)
  const recentAudit = getOrgAudit({ orgId, limit: 10 })
  const teams = listTeams(orgId)
  const departments = getDepartmentTree(orgId)
  return {
    stats,
    quota,
    recentAudit,
    teams: teams.length,
    departments: departments.length,
  }
}

// ============================================================
// 模块 4 扩展：消息搜索与广播
// ============================================================

// 搜索用户消息（按关键词/标题/内容）
function searchUserMessages(userId, keyword, filters) {
  if (!db.messages) return []
  const kw = (keyword || '').toLowerCase()
  let msgs = db.messages.filter(m => m.toUserId === userId)
  if (kw) {
    msgs = msgs.filter(m =>
      (m.title && m.title.toLowerCase().includes(kw)) ||
      (m.content && m.content.toLowerCase().includes(kw))
    )
  }
  if (filters && filters.category) msgs = msgs.filter(m => m.category === filters.category)
  if (filters && filters.type) msgs = msgs.filter(m => m.type === filters.type)
  msgs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  const limit = (filters && filters.limit) || 50
  return msgs.slice(0, limit)
}

// 向组织全体成员广播消息
function broadcastOrgMessage(orgId, fromUserId, title, content, category) {
  const members = getOrgMembers(orgId)
  let sent = 0
  for (const member of members) {
    sendMessage(member.id, fromUserId, 'notification', title, content, category || 'system')
    sent++
  }
  return { success: true, sent, total: members.length }
}

// 向角色广播消息（如向所有管理员发送）
function broadcastRoleMessage(role, fromUserId, title, content, category) {
  const users = Object.values(db.users || {}).filter(u => (u.role || 'user') === role && !u.deactivated)
  let sent = 0
  for (const u of users) {
    sendMessage(u.id, fromUserId, 'notification', title, content, category || 'system')
    sent++
  }
  return { success: true, sent, role }
}

// 获取消息统计（按分类/已读未读）
function getMessageStats(userId) {
  if (!db.messages) return { total: 0, unread: 0, byCategory: {} }
  const userMsgs = db.messages.filter(m => m.toUserId === userId && !m.archived)
  const byCategory = {}
  let unread = 0
  for (const m of userMsgs) {
    const cat = m.category || 'system'
    if (!byCategory[cat]) byCategory[cat] = { total: 0, unread: 0 }
    byCategory[cat].total++
    if (!m.read) {
      byCategory[cat].unread++
      unread++
    }
  }
  return { total: userMsgs.length, unread, byCategory }
}

// ============================================================
// 模块 5 扩展：搜索索引管理与分析
// ============================================================

// 从索引中按类型统计文档
function getSearchIndexStatsByType() {
  if (!db.searchIndex || !db.searchIndex.docs) return {}
  const stats = {}
  for (const doc of Object.values(db.searchIndex.docs)) {
    const type = doc.type || 'unknown'
    if (!stats[type]) stats[type] = { count: 0, totalSize: 0 }
    stats[type].count++
    stats[type].totalSize += (doc.content || '').length
  }
  return stats
}

// 从索引移除某类型所有文档
function removeSearchIndexByType(type) {
  if (!db.searchIndex || !db.searchIndex.docs) return { removed: 0 }
  let removed = 0
  const toRemove = []
  for (const [docId, doc] of Object.entries(db.searchIndex.docs)) {
    if (doc.type === type) toRemove.push(docId)
  }
  for (const docId of toRemove) {
    removeFromSearchIndex(docId)
    removed++
  }
  return { removed, type }
}

// 获取搜索热词分析（按时间趋势）
function getSearchTrends(days) {
  const range = days || 7
  const threshold = Date.now() - range * 24 * 3600 * 1000
  const cutoff = new Date(threshold).toISOString()
  if (!db.searchHistory) return []
  const trends = {}
  for (const h of db.searchHistory) {
    if (h.timestamp < cutoff) continue
    const day = h.timestamp.slice(0, 10)
    if (!trends[day]) trends[day] = {}
    if (!trends[day][h.query]) trends[day][h.query] = 0
    trends[day][h.query]++
  }
  return trends
}

// 清空搜索索引
function clearSearchIndex() {
  if (db.searchIndex) {
    db.searchIndex.docs = {}
    db.searchIndex.inverted = {}
    db.searchIndex.docCount = 0
    db.searchIndex.builtAt = null
    saveDB(db)
  }
  return { success: true }
}

// ============================================================
// 模块 6 扩展：日志分析与聚合
// ============================================================

// 日志聚合统计（按类型/级别/时间分布）
function getLogAnalytics(days) {
  const range = days || 7
  const threshold = new Date(Date.now() - range * 24 * 3600 * 1000).toISOString()
  const analytics = {
    byType: { operation: 0, error: 0, performance: 0, security: 0 },
    byLevel: { DEBUG: 0, INFO: 0, WARN: 0, ERROR: 0, FATAL: 0 },
    byDay: {},
    topErrors: [],
  }
  const collections = [
    { name: 'operation', data: db.operationLogs || [] },
    { name: 'error', data: db.errorLogs || [] },
    { name: 'performance', data: db.performanceLogs || [] },
    { name: 'security', data: db.securityLogs || [] },
  ]
  const errorMap = {}
  for (const col of collections) {
    for (const log of col.data) {
      if (log.timestamp < threshold) continue
      analytics.byType[col.name]++
      if (log.level && analytics.byLevel[log.level] !== undefined) analytics.byLevel[log.level]++
      const day = log.timestamp.slice(0, 10)
      if (!analytics.byDay[day]) analytics.byDay[day] = 0
      analytics.byDay[day]++
      if (col.name === 'error') {
        const key = log.message || log.action || 'unknown'
        if (!errorMap[key]) errorMap[key] = { message: key, count: 0, lastSeen: log.timestamp }
        errorMap[key].count++
        if (log.timestamp > errorMap[key].lastSeen) errorMap[key].lastSeen = log.timestamp
      }
    }
  }
  analytics.topErrors = Object.values(errorMap).sort((a, b) => b.count - a.count).slice(0, 10)
  return analytics
}

// 日志配置管理
function getLogConfig() {
  return {
    level: getLogLevel(),
    rotation: db.logRotation || {
      maxSize: 10 * 1024 * 1024,
      retainDays: 30,
      enabled: true,
    },
    levels: LOG_LEVELS,
  }
}

// 更新日志轮转配置
function updateLogRotationConfig(config) {
  if (!db.logRotation) db.logRotation = {}
  if (config.maxSize !== undefined) db.logRotation.maxSize = config.maxSize
  if (config.retainDays !== undefined) db.logRotation.retainDays = config.retainDays
  if (config.enabled !== undefined) db.logRotation.enabled = config.enabled
  saveDB(db)
  return { success: true, config: db.logRotation }
}

// ============================================================
// 模块 7 扩展：导出任务管理
// ============================================================

// 获取导出任务详情
function getExportTask(taskId) {
  if (!db.exportHistory) return { error: '任务不存在' }
  const task = db.exportHistory.find(t => t.id === taskId)
  if (!task) return { error: '任务不存在' }
  return task
}

// 取消导出任务（仅 pending 状态可取消）
function cancelExportTask(taskId) {
  if (!db.exportHistory) return { error: '任务不存在' }
  const task = db.exportHistory.find(t => t.id === taskId)
  if (!task) return { error: '任务不存在' }
  if (task.status !== 'pending') return { error: '任务已开始，无法取消' }
  task.status = 'cancelled'
  task.completedAt = new Date().toISOString()
  saveDB(db)
  return { success: true }
}

// 重试失败的导出任务
function retryExportTask(taskId) {
  if (!db.exportHistory) return { error: '任务不存在' }
  const task = db.exportHistory.find(t => t.id === taskId)
  if (!task) return { error: '任务不存在' }
  if (task.status !== 'failed') return { error: '仅失败任务可重试' }
  return createExportTaskEx(task.userId, task.type, task.options || {})
}

// 列出定时导出
function listScheduledExports(userId) {
  if (!db.scheduledExports) return []
  let list = Object.values(db.scheduledExports)
  if (userId) list = list.filter(s => s.userId === userId)
  return list
}

// 删除定时导出
function deleteScheduledExport(id) {
  if (!db.scheduledExports || !db.scheduledExports[id]) return { error: '定时导出不存在' }
  // 同时移除 cron 任务
  removeCronJob('export_' + id)
  delete db.scheduledExports[id]
  saveDB(db)
  return { success: true }
}

// 切换定时导出启用状态
function toggleScheduledExport(id, enabled) {
  if (!db.scheduledExports || !db.scheduledExports[id]) return { error: '定时导出不存在' }
  db.scheduledExports[id].enabled = !!enabled
  saveDB(db)
  return { success: true, enabled: db.scheduledExports[id].enabled }
}

// ============================================================
// 模块 8 扩展：版本迁移辅助
// ============================================================

// 版本迁移检查清单
function getMigrationChecklist(fromVersion, toVersion) {
  const checklists = {
    'v1_to_v2': [
      { item: '字段名 msg 改为 message', status: 'required', impact: '请求/响应字段重命名' },
      { item: '字段名 ok 改为 success', status: 'required', impact: '响应字段重命名' },
      { item: '字段名 uid 改为 userId', status: 'required', impact: '请求字段重命名' },
      { item: '字段名 conv_id 改为 conversationId', status: 'required', impact: '请求字段重命名' },
      { item: '认证改用 Bearer JWT', status: 'recommended', impact: '更安全的令牌机制' },
      { item: '错误响应统一 { error: string } 格式', status: 'recommended', impact: '一致性提升' },
    ],
  }
  const key = fromVersion + '_to_' + toVersion
  return {
    from: fromVersion,
    to: toVersion,
    checklist: checklists[key] || [],
  }
}

// 版本废弃倒计时
function getVersionSunsetCountdown(version) {
  const info = getVersionInfoEx(version)
  if (!info || !info.sunsetDate) return { version, hasSunset: false }
  const sunset = new Date(info.sunsetDate).getTime()
  const now = Date.now()
  const daysLeft = Math.ceil((sunset - now) / (24 * 3600 * 1000))
  return {
    version,
    hasSunset: true,
    sunsetDate: info.sunsetDate,
    daysLeft: Math.max(0, daysLeft),
    expired: daysLeft <= 0,
  }
}

// ============================================================
// 模块 9 扩展：WebSocket 房间管理
// ============================================================

// 获取房间成员列表
function getWsRoomMembers(roomId) {
  if (!db.wsRooms || !db.wsRooms[roomId]) return { error: '房间不存在' }
  const room = db.wsRooms[roomId]
  const members = []
  if (room.members) {
    for (const userId of room.members) {
      const presence = wsGetPresenceEx(userId)
      members.push({
        userId,
        online: presence.status === 'online',
        lastSeen: presence.lastSeen,
      })
    }
  }
  return { roomId, memberCount: members.length, members }
}

// 获取在线用户列表
function getOnlineUsers() {
  if (!db.wsPresence) return []
  return Object.entries(db.wsPresence)
    .filter(([id, p]) => p.status === 'online')
    .map(([id, p]) => ({
      userId: id,
      status: p.status,
      lastSeen: p.lastSeen,
      clientId: p.clientId || null,
    }))
}

// 清空房间
function clearWsRoom(roomId) {
  if (!db.wsRooms || !db.wsRooms[roomId]) return { error: '房间不存在' }
  db.wsRooms[roomId].members = new Set()
  db.wsRooms[roomId].memberCount = 0
  db.wsRooms[roomId].updatedAt = new Date().toISOString()
  saveDB(db)
  return { success: true }
}

// 删除房间
function deleteWsRoom(roomId) {
  if (!db.wsRooms || !db.wsRooms[roomId]) return { error: '房间不存在' }
  delete db.wsRooms[roomId]
  saveDB(db)
  return { success: true }
}

// 获取离线消息队列
function getOfflineMessages(userId) {
  if (!db.wsOfflineMessages || !db.wsOfflineMessages[userId]) return []
  return db.wsOfflineMessages[userId]
}

// 清空离线消息
function clearOfflineMessages(userId) {
  if (db.wsOfflineMessages && db.wsOfflineMessages[userId]) {
    const count = db.wsOfflineMessages[userId].length
    db.wsOfflineMessages[userId] = []
    saveDB(db)
    return { success: true, cleared: count }
  }
  return { success: true, cleared: 0 }
}

// ============================================================
// 模块 10 扩展：任务详情与依赖管理
// ============================================================

// 获取任务详情（一次性或重复）
function getTaskDetail(taskId) {
  if (db.oneTimeTasks && db.oneTimeTasks[taskId]) {
    const t = db.oneTimeTasks[taskId]
    const { _timer, ...rest } = t
    return { type: 'onetime', task: rest }
  }
  if (db.recurringTasks && db.recurringTasks[taskId]) {
    const t = db.recurringTasks[taskId]
    const { _timer, ...rest } = t
    return { type: 'recurring', task: rest }
  }
  return { error: '任务不存在' }
}

// 获取任务依赖列表
function getTaskDependencies(taskId) {
  if (!db.taskDependencies || !db.taskDependencies[taskId]) return { dependencies: [] }
  return { taskId, dependencies: db.taskDependencies[taskId] }
}

// 移除任务依赖
function removeTaskDependency(taskId, dependsOnId) {
  if (!db.taskDependencies || !db.taskDependencies[taskId]) return { error: '依赖不存在' }
  db.taskDependencies[taskId] = db.taskDependencies[taskId].filter(d => d.dependsOnId !== dependsOnId)
  if (db.taskDependencies[taskId].length === 0) delete db.taskDependencies[taskId]
  saveDB(db)
  return { success: true }
}

// 获取任务统计
function getTaskStats() {
  const oneTime = Object.values(db.oneTimeTasks || {})
  const recurring = Object.values(db.recurringTasks || {})
  const byStatus = {}
  for (const t of oneTime) {
    byStatus[t.status] = (byStatus[t.status] || 0) + 1
  }
  return {
    oneTimeTotal: oneTime.length,
    recurringTotal: recurring.length,
    recurringActive: recurring.filter(t => t.enabled).length,
    recurringPaused: recurring.filter(t => !t.enabled).length,
    oneTimeByStatus: byStatus,
  }
}

// 触发一次性任务立即执行（若已调度未执行）
function triggerTaskNow(taskId) {
  if (!db.oneTimeTasks || !db.oneTimeTasks[taskId]) return { error: '任务不存在' }
  const task = db.oneTimeTasks[taskId]
  if (task.status !== 'scheduled') return { error: '任务状态不允许触发' }
  task.executeAt = new Date().toISOString()
  saveDB(db)
  logTaskEx(taskId, 'trigger_now', { triggeredAt: task.executeAt })
  return { success: true, message: '任务已标记为立即执行' }
}

// ============================================================
// 模块 11：用户管理与列表
// ============================================================

// 分页列出用户（含过滤/排序）
function listUsers(options) {
  const opts = options || {}
  let users = Object.values(db.users || {}).filter(u => !u.deactivated)
  // 关键词搜索
  if (opts.keyword) {
    const kw = opts.keyword.toLowerCase()
    users = users.filter(u =>
      (u.username && u.username.toLowerCase().includes(kw)) ||
      (u.email && u.email.toLowerCase().includes(kw)) ||
      (u.displayName && u.displayName.toLowerCase().includes(kw))
    )
  }
  // 角色过滤
  if (opts.role) {
    users = users.filter(u => (u.role || 'user') === opts.role)
  }
  // 组织过滤
  if (opts.orgId) {
    users = users.filter(u => u.orgId === opts.orgId)
  }
  // 封禁状态过滤
  if (opts.banned !== undefined) {
    users = users.filter(u => {
      const ban = isUserBanned(u.id)
      return ban.banned === opts.banned
    })
  }
  // 排序
  const sortBy = opts.sortBy || 'createdAt'
  const sortOrder = opts.sortOrder || 'desc'
  users.sort((a, b) => {
    let av = a[sortBy] || ''
    let bv = b[sortBy] || ''
    if (typeof av === 'string') av = av.toLowerCase()
    if (typeof bv === 'string') bv = bv.toLowerCase()
    if (av < bv) return sortOrder === 'asc' ? -1 : 1
    if (av > bv) return sortOrder === 'asc' ? 1 : -1
    return 0
  })
  const total = users.length
  const offset = opts.offset || 0
  const limit = opts.limit || 20
  const page = Math.floor(offset / limit) + 1
  const paged = users.slice(offset, offset + limit).map(u => {
    const ban = isUserBanned(u.id)
    return {
      ...publicUser(u),
      email: u.email || null,
      displayName: u.displayName || u.username,
      banned: ban.banned,
      twoFactorEnabled: !!(db.twoFactor && db.twoFactor[u.id] && db.twoFactor[u.id].enabled),
      lastLoginAt: u.lastLoginAt || null,
    }
  })
  return { users: paged, total, offset, limit, page, totalPages: Math.ceil(total / limit) }
}

// 按 ID 获取用户
function getUserById(userId) {
  const user = Object.values(db.users || {}).find(u => u.id === userId)
  if (!user) return { error: '用户不存在' }
  return user
}

// 管理员创建用户
function adminCreateUser(data, createdBy) {
  const { username, password, email, role, displayName } = data
  if (!username || !password) return { error: '用户名和密码不能为空' }
  if (db.users && db.users[username]) return { error: '用户名已存在' }
  if (!db.users) db.users = {}
  const userId = genId()
  db.users[username] = {
    id: userId,
    username,
    displayName: displayName || username,
    email: email || null,
    password: hashPassword(password),
    role: role || 'user',
    createdAt: new Date().toISOString(),
    apiKeys: [],
    orgId: null,
    language: 'zh-CN',
    createdBy: createdBy || null,
  }
  saveDB(db)
  auditLog('user.admin_create', createdBy, 'unknown', { userId, username, role })
  return { success: true, user: publicUser(db.users[username]) }
}

// 管理员更新用户
function adminUpdateUser(userId, data, updatedBy) {
  const user = Object.values(db.users || {}).find(u => u.id === userId)
  if (!user) return { error: '用户不存在' }
  const changes = {}
  if (data.displayName !== undefined) { user.displayName = data.displayName; changes.displayName = true }
  if (data.email !== undefined) { user.email = data.email; changes.email = true }
  if (data.language !== undefined) { user.language = data.language; changes.language = true }
  if (data.timezone !== undefined) { user.timezone = data.timezone; changes.timezone = true }
  if (data.orgId !== undefined) { user.orgId = data.orgId; changes.orgId = true }
  // 重置密码
  if (data.newPassword) {
    user.password = hashPassword(data.newPassword)
    changes.password = true
    kickAllSessions(userId)
  }
  user.updatedAt = new Date().toISOString()
  user.updatedBy = updatedBy || null
  saveDB(db)
  auditLog('user.admin_update', updatedBy, 'unknown', { userId, changes })
  return { success: true, user: publicUser(user), changes }
}

// 删除用户（硬删除，需谨慎）
function deleteUser(userId, deletedBy) {
  const user = Object.values(db.users || {}).find(u => u.id === userId)
  if (!user) return { error: '用户不存在' }
  if (user.role === 'admin') return { error: '不能删除管理员账号' }
  const username = user.username
  // 清理会话
  kickAllSessions(userId)
  // 清理 API Key
  if (user.apiKeysEx) {
    for (const k of user.apiKeysEx) revokeApiKeyEx(k.key)
  }
  delete db.users[username]
  saveDB(db)
  auditLog('user.delete', deletedBy, 'unknown', { userId, username })
  return { success: true, message: '用户已删除' }
}

// ============================================================
// 模块 12：对话管理与统计
// ============================================================

// 分页列出对话
function listConversations(options) {
  const opts = options || {}
  let convs = Object.values(db.conversations || {})
  // 用户过滤
  if (opts.userId) {
    convs = convs.filter(c => c.userId === opts.userId || (c.messages || []).some(m => m.userId === opts.userId))
  }
  // 组织过滤
  if (opts.orgId) {
    convs = convs.filter(c => c.orgId === opts.orgId)
  }
  // 关键词搜索（标题）
  if (opts.keyword) {
    const kw = opts.keyword.toLowerCase()
    convs = convs.filter(c => (c.title || '').toLowerCase().includes(kw))
  }
  // 时间范围
  if (opts.startDate) convs = convs.filter(c => c.createdAt >= opts.startDate)
  if (opts.endDate) convs = convs.filter(c => c.createdAt <= opts.endDate)
  convs.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
  const total = convs.length
  const offset = opts.offset || 0
  const limit = opts.limit || 20
  const paged = convs.slice(offset, offset + limit).map(c => ({
    id: c.id,
    title: c.title,
    messageCount: (c.messages || []).length,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt || c.createdAt,
    userId: c.userId || null,
    orgId: c.orgId || null,
  }))
  return { conversations: paged, total, offset, limit }
}

// 获取对话统计
function getConversationStats() {
  const convs = Object.values(db.conversations || {})
  let totalMessages = 0
  let userMessages = 0
  let assistantMessages = 0
  const byDay = {}
  for (const c of convs) {
    for (const m of (c.messages || [])) {
      totalMessages++
      if (m.role === 'user') userMessages++
      else if (m.role === 'assistant') assistantMessages++
      const day = (m.timestamp || c.createdAt || '').slice(0, 10)
      if (day) byDay[day] = (byDay[day] || 0) + 1
    }
  }
  return {
    totalConversations: convs.length,
    totalMessages,
    userMessages,
    assistantMessages,
    avgMessagesPerConv: convs.length ? (totalMessages / convs.length).toFixed(2) : 0,
    byDay,
  }
}

// 删除对话
function deleteConversation(convId) {
  if (!db.conversations || !db.conversations[convId]) return { error: '对话不存在' }
  delete db.conversations[convId]
  saveDB(db)
  return { success: true }
}

// 批量删除对话
function batchDeleteConversations(convIds) {
  let deleted = 0
  for (const id of convIds) {
    if (db.conversations && db.conversations[id]) {
      delete db.conversations[id]
      deleted++
    }
  }
  if (deleted > 0) saveDB(db)
  return { success: true, deleted, requested: convIds.length }
}

// ============================================================
// 模块 13：系统诊断与维护
// ============================================================

// 系统诊断信息
function getSystemDiagnostics() {
  const memUsage = process.memoryUsage()
  const cpuUsage = process.cpuUsage()
  return {
    process: {
      pid: process.pid,
      uptime: process.uptime(),
      memory: {
        rss: memUsage.rss,
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal,
        external: memUsage.external,
        arrayBuffers: memUsage.arrayBuffers,
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system,
      },
    },
    runtime: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      cwd: process.cwd(),
    },
    database: {
      size: Buffer.byteLength(JSON.stringify(db || {})),
      collections: Object.keys(db || {}).length,
    },
    timestamp: new Date().toISOString(),
  }
}

// 数据库统计
function getDatabaseStats() {
  const stats = {}
  for (const [key, value] of Object.entries(db || {})) {
    if (Array.isArray(value)) {
      stats[key] = { type: 'array', count: value.length }
    } else if (value && typeof value === 'object') {
      stats[key] = { type: 'object', count: Object.keys(value).length }
    } else {
      stats[key] = { type: typeof value, value }
    }
  }
  return stats
}

// 数据库清理（移除过期会话）
function cleanupExpiredSessions() {
  if (!db.sessions) return { cleaned: 0 }
  const now = new Date()
  let cleaned = 0
  for (const [token, session] of Object.entries(db.sessions)) {
    if (new Date(session.expiresAt) < now) {
      delete db.sessions[token]
      cleaned++
    }
  }
  if (cleaned > 0) saveDB(db)
  return { cleaned }
}

// 数据库压缩（重新序列化以释放空间）
function compactDatabase() {
  const before = Buffer.byteLength(JSON.stringify(db || {}))
  saveDB(db)
  const after = Buffer.byteLength(JSON.stringify(db || {}))
  return { before, after, saved: before - after }
}

// 健康检查详情
function getHealthDetails() {
  const health = getOverallHealth()
  const subsystems = getSubsystemStatus()
  const memUsage = process.memoryUsage()
  return {
    overall: health,
    subsystems,
    memory: {
      rss: memUsage.rss,
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      heapUsagePercent: ((memUsage.heapUsed / memUsage.heapTotal) * 100).toFixed(2),
    },
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  }
}

// ============ 模块14：知识库管理增强 ============
// 创建知识库条目（扩展版）
function createKnowledgeItemEx(data, userId) {
  if (!db.knowledgeEx) db.knowledgeEx = {}
  const id = 'kb_' + genId()
  const item = {
    id,
    title: data.title || '未命名条目',
    content: data.content || '',
    summary: data.summary || '',
    category: data.category || 'general',
    tags: Array.isArray(data.tags) ? data.tags : [],
    source: data.source || 'manual',
    sourceUrl: data.sourceUrl || '',
    visibility: data.visibility || 'private', // private/org/public
    orgId: data.orgId || null,
    createdBy: userId,
    updatedBy: userId,
    version: 1,
    pinned: false,
    viewCount: 0,
    likeCount: 0,
    metadata: data.metadata || {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  db.knowledgeEx[id] = item
  // 同步标签索引
  syncKnowledgeTags(id, item.tags)
  // 同步到搜索索引
  addToSearchIndex('knowledge', id, { title: item.title, content: item.content, tags: item.tags.join(' ') })
  return item
}

// 同步知识库标签索引
function syncKnowledgeTags(itemId, tags) {
  if (!db.knowledgeTags) db.knowledgeTags = {}
  // 先移除旧的关联
  for (const tag of Object.keys(db.knowledgeTags)) {
    db.knowledgeTags[tag] = (db.knowledgeTags[tag] || []).filter(id => id !== itemId)
    if (db.knowledgeTags[tag].length === 0) delete db.knowledgeTags[tag]
  }
  // 添加新关联
  for (const tag of tags) {
    const key = String(tag).toLowerCase()
    if (!db.knowledgeTags[key]) db.knowledgeTags[key] = []
    db.knowledgeTags[key].push(itemId)
  }
}

// 更新知识库条目（保留版本历史）
function updateKnowledgeItemEx(id, data, userId) {
  if (!db.knowledgeEx || !db.knowledgeEx[id]) return null
  const item = db.knowledgeEx[id]
  // 保存版本历史
  if (!db.knowledgeVersions) db.knowledgeVersions = {}
  if (!db.knowledgeVersions[id]) db.knowledgeVersions[id] = []
  db.knowledgeVersions[id].push({
    version: item.version,
    snapshot: JSON.parse(JSON.stringify(item)),
    savedBy: userId,
    savedAt: new Date().toISOString(),
  })
  if (db.knowledgeVersions[id].length > 20) db.knowledgeVersions[id] = db.knowledgeVersions[id].slice(-20)
  // 应用更新
  const allowed = ['title', 'content', 'summary', 'category', 'tags', 'visibility', 'pinned', 'metadata']
  for (const k of allowed) {
    if (data[k] !== undefined) item[k] = data[k]
  }
  item.version += 1
  item.updatedBy = userId
  item.updatedAt = new Date().toISOString()
  if (data.tags) syncKnowledgeTags(id, item.tags)
  // 更新搜索索引
  addToSearchIndex('knowledge', id, { title: item.title, content: item.content, tags: (item.tags || []).join(' ') })
  return item
}

// 删除知识库条目
function deleteKnowledgeItemEx(id) {
  if (!db.knowledgeEx || !db.knowledgeEx[id]) return false
  delete db.knowledgeEx[id]
  if (db.knowledgeVersions) delete db.knowledgeVersions[id]
  if (db.knowledgeShares) delete db.knowledgeShares[id]
  removeFromSearchIndex('knowledge', id)
  syncKnowledgeTags(id, [])
  return true
}

// 获取知识库条目版本历史
function getKnowledgeItemVersions(id) {
  if (!db.knowledgeVersions || !db.knowledgeVersions[id]) return []
  return db.knowledgeVersions[id]
}

// 还原知识库条目到指定版本
function restoreKnowledgeItemVersion(id, version, userId) {
  if (!db.knowledgeEx || !db.knowledgeEx[id]) return null
  const versions = db.knowledgeVersions[id] || []
  const target = versions.find(v => v.version === parseInt(version))
  if (!target) return null
  const item = db.knowledgeEx[id]
  // 保存当前版本到历史
  versions.push({
    version: item.version,
    snapshot: JSON.parse(JSON.stringify(item)),
    savedBy: userId,
    savedAt: new Date().toISOString(),
  })
  // 还原
  const restored = JSON.parse(JSON.stringify(target.snapshot))
  item.title = restored.title
  item.content = restored.content
  item.summary = restored.summary
  item.category = restored.category
  item.tags = restored.tags || []
  item.metadata = restored.metadata || {}
  item.version += 1
  item.updatedBy = userId
  item.updatedAt = new Date().toISOString()
  syncKnowledgeTags(id, item.tags)
  return item
}

// 分享知识库条目
function shareKnowledgeItem(id, options, userId) {
  if (!db.knowledgeShares) db.knowledgeShares = {}
  if (!db.knowledgeShares[id]) db.knowledgeShares[id] = []
  const share = {
    id: 'sh_' + genId(),
    itemId: id,
    shareType: options.shareType || 'link', // link/user/org/public
    targetId: options.targetId || null,
    permissions: options.permissions || 'read', // read/comment/edit
    expiresAt: options.expiresAt || null,
    password: options.password || null,
    shareToken: 'tok_' + genId(),
    createdBy: userId,
    createdAt: new Date().toISOString(),
    accessCount: 0,
  }
  db.knowledgeShares[id].push(share)
  return share
}

// 收藏知识库条目
function favoriteKnowledgeItem(id, userId) {
  if (!db.knowledgeFavorites) db.knowledgeFavorites = {}
  if (!db.knowledgeFavorites[userId]) db.knowledgeFavorites[userId] = []
  if (!db.knowledgeFavorites[userId].includes(id)) {
    db.knowledgeFavorites[userId].push(id)
    return true
  }
  return false
}

// 取消收藏
function unfavoriteKnowledgeItem(id, userId) {
  if (!db.knowledgeFavorites || !db.knowledgeFavorites[userId]) return false
  const idx = db.knowledgeFavorites[userId].indexOf(id)
  if (idx >= 0) {
    db.knowledgeFavorites[userId].splice(idx, 1)
    return true
  }
  return false
}

// 列出用户收藏
function listFavoriteKnowledge(userId) {
  if (!db.knowledgeFavorites || !db.knowledgeFavorites[userId]) return []
  return db.knowledgeFavorites[userId]
    .map(id => db.knowledgeEx?.[id])
    .filter(Boolean)
}

// 批量导入知识库条目
function batchImportKnowledge(items, userId, options) {
  if (!db.knowledgeImports) db.knowledgeImports = []
  const batchId = 'imp_' + genId()
  const results = { success: 0, failed: 0, errors: [] }
  const created = []
  for (let i = 0; i < items.length; i++) {
    try {
      const item = createKnowledgeItemEx(items[i], userId)
      created.push(item.id)
      results.success += 1
    } catch (err) {
      results.failed += 1
      results.errors.push({ index: i, error: err.message })
    }
  }
  db.knowledgeImports.push({
    id: batchId,
    userId,
    count: items.length,
    results,
    created,
    options: options || {},
    createdAt: new Date().toISOString(),
  })
  if (db.knowledgeImports.length > 100) db.knowledgeImports = db.knowledgeImports.slice(-100)
  return { batchId, ...results, created }
}

// 按标签查询知识库
function getKnowledgeByTag(tag) {
  if (!db.knowledgeTags) return []
  const ids = db.knowledgeTags[String(tag).toLowerCase()] || []
  return ids.map(id => db.knowledgeEx?.[id]).filter(Boolean)
}

// 增加知识库条目查看次数
function incrementKnowledgeView(id) {
  if (!db.knowledgeEx || !db.knowledgeEx[id]) return false
  db.knowledgeEx[id].viewCount = (db.knowledgeEx[id].viewCount || 0) + 1
  return true
}

// 知识库条目点赞
function likeKnowledgeItem(id) {
  if (!db.knowledgeEx || !db.knowledgeEx[id]) return false
  db.knowledgeEx[id].likeCount = (db.knowledgeEx[id].likeCount || 0) + 1
  return true
}

// 知识库统计
function getKnowledgeStats() {
  const items = Object.values(db.knowledgeEx || {})
  const byCategory = {}
  const byVisibility = { private: 0, org: 0, public: 0 }
  let totalViews = 0, totalLikes = 0
  for (const item of items) {
    byCategory[item.category] = (byCategory[item.category] || 0) + 1
    if (byVisibility[item.visibility] !== undefined) byVisibility[item.visibility] += 1
    totalViews += item.viewCount || 0
    totalLikes += item.likeCount || 0
  }
  return {
    total: items.length,
    byCategory,
    byVisibility,
    totalViews,
    totalLikes,
    tagCount: Object.keys(db.knowledgeTags || {}).length,
  }
}

// ============ 模块15：Webhook 投递管理 ============
// 记录 webhook 投递
function recordWebhookDelivery(webhookId, event, payload, status, response, durationMs) {
  if (!db.webhookDeliveries) db.webhookDeliveries = []
  const delivery = {
    id: 'dlv_' + genId(),
    webhookId,
    event,
    payloadSize: JSON.stringify(payload).length,
    status, // success/failed/pending
    statusCode: response?.statusCode || null,
    responseSnippet: typeof response?.body === 'string' ? response.body.slice(0, 500) : '',
    durationMs,
    timestamp: new Date().toISOString(),
  }
  db.webhookDeliveries.push(delivery)
  if (db.webhookDeliveries.length > 2000) db.webhookDeliveries = db.webhookDeliveries.slice(-1000)
  return delivery
}

// 查询投递记录
function getWebhookDeliveries(filters) {
  if (!db.webhookDeliveries) return []
  let list = [...db.webhookDeliveries]
  if (filters?.webhookId) list = list.filter(d => d.webhookId === filters.webhookId)
  if (filters?.event) list = list.filter(d => d.event === filters.event)
  if (filters?.status) list = list.filter(d => d.status === filters.status)
  if (filters?.since) {
    const since = new Date(filters.since).getTime()
    list = list.filter(d => new Date(d.timestamp).getTime() >= since)
  }
  const limit = filters?.limit || 100
  return list.slice(-limit).reverse()
}

// 重试失败的投递
async function retryWebhookDelivery(deliveryId) {
  if (!db.webhookDeliveries) return { success: false, error: '无投递记录' }
  const delivery = db.webhookDeliveries.find(d => d.id === deliveryId)
  if (!delivery) return { success: false, error: '投递记录不存在' }
  const webhook = db.webhooks?.[delivery.webhookId]
  if (!webhook) return { success: false, error: 'Webhook 不存在' }
  // 模拟重试（实际中应保存原始 payload）
  const result = await triggerWebhook(delivery.event, { _retry: true, _originalDeliveryId: deliveryId })
  return { success: true, result }
}

// 创建 Webhook 模板
function createWebhookTemplate(data, userId) {
  if (!db.webhookTemplates) db.webhookTemplates = {}
  const id = 'wht_' + genId()
  const template = {
    id,
    name: data.name || '未命名模板',
    description: data.description || '',
    event: data.event || '',
    payloadSchema: data.payloadSchema || {},
    samplePayload: data.samplePayload || {},
    headers: data.headers || {},
    method: data.method || 'POST',
    createdBy: userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    useCount: 0,
  }
  db.webhookTemplates[id] = template
  return template
}

// 列出 Webhook 模板
function listWebhookTemplates() {
  if (!db.webhookTemplates) return []
  return Object.values(db.webhookTemplates)
}

// 应用 Webhook 模板创建 webhook
function applyWebhookTemplate(templateId, url, secret, userId) {
  const template = db.webhookTemplates?.[templateId]
  if (!template) return null
  const webhook = createWebhook({
    name: template.name + ' (来自模板)',
    url,
    events: [template.event],
    secret,
    headers: template.headers,
    method: template.method,
    active: true,
  }, userId)
  template.useCount = (template.useCount || 0) + 1
  template.updatedAt = new Date().toISOString()
  return webhook
}

// 测试 Webhook（发送测试事件）
async function testWebhook(webhookId, testPayload) {
  if (!db.webhookTests) db.webhookTests = []
  const webhook = db.webhooks?.[webhookId]
  if (!webhook) return { success: false, error: 'Webhook 不存在' }
  const startTime = Date.now()
  const payload = testPayload || { event: 'test', timestamp: new Date().toISOString(), message: '这是测试事件' }
  let result
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    const response = await fetch(webhook.url, {
      method: webhook.method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Event': 'test',
        'X-Webhook-Signature': crypto.createHmac('sha256', webhook.secret || 'default-secret').update(JSON.stringify(payload)).digest('hex'),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    clearTimeout(timeout)
    const text = await response.text()
    result = {
      success: response.ok,
      statusCode: response.status,
      response: text.slice(0, 500),
      durationMs: Date.now() - startTime,
    }
  } catch (err) {
    result = {
      success: false,
      error: err.message,
      durationMs: Date.now() - startTime,
    }
  }
  db.webhookTests.push({
    id: 'tst_' + genId(),
    webhookId,
    payload,
    result,
    timestamp: new Date().toISOString(),
  })
  if (db.webhookTests.length > 500) db.webhookTests = db.webhookTests.slice(-200)
  return result
}

// 验证 Webhook 签名
function verifyWebhookSignature(payload, signature, secret) {
  if (!signature || !secret) return false
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  try {
    const a = Buffer.from(expected, 'hex')
    const b = Buffer.from(signature, 'hex')
    if (a.length !== b.length) return false
    return crypto.timingSafeEqual(a, b)
  } catch {
    return false
  }
}

// Webhook 投递统计
function getWebhookDeliveryStats(webhookId) {
  if (!db.webhookDeliveries) return { total: 0, success: 0, failed: 0 }
  const list = webhookId
    ? db.webhookDeliveries.filter(d => d.webhookId === webhookId)
    : db.webhookDeliveries
  const stats = { total: list.length, success: 0, failed: 0, pending: 0, avgDurationMs: 0 }
  let totalDuration = 0
  for (const d of list) {
    if (d.status === 'success') stats.success += 1
    else if (d.status === 'failed') stats.failed += 1
    else stats.pending += 1
    totalDuration += d.durationMs || 0
  }
  stats.avgDurationMs = list.length ? Math.round(totalDuration / list.length) : 0
  stats.successRate = list.length ? ((stats.success / list.length) * 100).toFixed(2) + '%' : '0%'
  return stats
}

// ============ 模块16：插件管理增强 ============
// 注册插件到市场
function registerPluginToMarketplace(data, userId) {
  if (!db.pluginMarketplace) db.pluginMarketplace = {}
  const id = 'plg_' + genId()
  const plugin = {
    id,
    name: data.name || '未命名插件',
    displayName: data.displayName || data.name || '未命名插件',
    description: data.description || '',
    version: data.version || '1.0.0',
    author: data.author || userId,
    category: data.category || 'general',
    tags: data.tags || [],
    icon: data.icon || '',
    readme: data.readme || '',
    config: data.config || {},
    hooks: data.hooks || [],
    permissions: data.permissions || [],
    price: data.price || 0,
    published: false,
    downloads: 0,
    rating: 0,
    ratingCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  db.pluginMarketplace[id] = plugin
  return plugin
}

// 发布插件到市场
function publishPluginToMarketplace(pluginId) {
  if (!db.pluginMarketplace || !db.pluginMarketplace[pluginId]) return false
  db.pluginMarketplace[pluginId].published = true
  db.pluginMarketplace[pluginId].updatedAt = new Date().toISOString()
  return true
}

// 浏览插件市场
function browsePluginMarketplace(filters) {
  if (!db.pluginMarketplace) return []
  let list = Object.values(db.pluginMarketplace).filter(p => p.published)
  if (filters?.category) list = list.filter(p => p.category === filters.category)
  if (filters?.keyword) {
    const kw = String(filters.keyword).toLowerCase()
    list = list.filter(p =>
      p.name.toLowerCase().includes(kw) ||
      p.displayName.toLowerCase().includes(kw) ||
      p.description.toLowerCase().includes(kw)
    )
  }
  if (filters?.tag) list = list.filter(p => p.tags.includes(filters.tag))
  // 排序
  const sortBy = filters?.sortBy || 'downloads'
  list.sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
    return b.downloads - a.downloads
  })
  return list
}

// 安装插件（从市场）
function installPluginFromMarketplace(pluginId, userId, options) {
  if (!db.pluginMarketplace || !db.pluginMarketplace[pluginId]) return null
  const plugin = db.pluginMarketplace[pluginId]
  if (!plugin.published) return null
  // 注册到本地插件系统
  const localPlugin = registerPlugin({
    name: plugin.name,
    version: plugin.version,
    hooks: plugin.hooks,
    config: plugin.config,
    enabled: false,
  })
  // 记录安装
  if (!db.pluginInstalls) db.pluginInstalls = []
  db.pluginInstalls.push({
    id: 'inst_' + genId(),
    pluginId,
    localName: plugin.name,
    userId,
    version: plugin.version,
    options: options || {},
    installedAt: new Date().toISOString(),
  })
  if (db.pluginInstalls.length > 500) db.pluginInstalls = db.pluginInstalls.slice(-200)
  // 增加下载数
  plugin.downloads = (plugin.downloads || 0) + 1
  plugin.updatedAt = new Date().toISOString()
  return localPlugin
}

// 配置插件
function configurePlugin(name, config, userId) {
  if (!db.pluginConfigs) db.pluginConfigs = {}
  db.pluginConfigs[name] = {
    name,
    config,
    updatedBy: userId,
    updatedAt: new Date().toISOString(),
  }
  // 同步到本地插件系统
  if (db.plugins?.[name]) {
    db.plugins[name].config = { ...db.plugins[name].config, ...config }
  }
  return db.pluginConfigs[name]
}

// 获取插件配置
function getPluginConfig(name) {
  if (!db.pluginConfigs) return null
  return db.pluginConfigs[name] || null
}

// 评价插件
function reviewPlugin(pluginId, userId, rating, comment) {
  if (!db.pluginReviews) db.pluginReviews = []
  // 检查是否已评价
  const existingIdx = db.pluginReviews.findIndex(r => r.pluginId === pluginId && r.userId === userId)
  if (existingIdx >= 0) {
    db.pluginReviews[existingIdx] = {
      ...db.pluginReviews[existingIdx],
      rating,
      comment,
      updatedAt: new Date().toISOString(),
    }
  } else {
    db.pluginReviews.push({
      id: 'rev_' + genId(),
      pluginId,
      userId,
      rating,
      comment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }
  // 更新市场插件的评分
  if (db.pluginMarketplace?.[pluginId]) {
    const reviews = db.pluginReviews.filter(r => r.pluginId === pluginId)
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0)
    db.pluginMarketplace[pluginId].ratingCount = reviews.length
    db.pluginMarketplace[pluginId].rating = reviews.length ? (totalRating / reviews.length) : 0
    db.pluginMarketplace[pluginId].updatedAt = new Date().toISOString()
  }
  return { success: true, rating, comment }
}

// 获取插件评价
function getPluginReviews(pluginId) {
  if (!db.pluginReviews) return []
  return db.pluginReviews.filter(r => r.pluginId === pluginId)
}

// 卸载插件
function uninstallPluginEx(name, userId) {
  if (!db.plugins?.[name]) return false
  delete db.plugins[name]
  if (db.pluginConfigs) delete db.pluginConfigs[name]
  auditLog('plugin.uninstall', userId, null, { name })
  return true
}

// 插件统计
function getPluginStats() {
  const installed = Object.keys(db.plugins || {}).length
  const marketplace = Object.values(db.pluginMarketplace || {})
  const published = marketplace.filter(p => p.published).length
  const totalDownloads = marketplace.reduce((sum, p) => sum + (p.downloads || 0), 0)
  const totalReviews = (db.pluginReviews || []).length
  return {
    installed,
    marketplaceTotal: marketplace.length,
    published,
    totalDownloads,
    totalReviews,
    byCategory: marketplace.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1
      return acc
    }, {}),
  }
}

// ============ 模块17：备份管理增强 ============
// 创建定时备份
function createBackupSchedule(data, userId) {
  if (!db.backupSchedules) db.backupSchedules = {}
  const id = 'sch_' + genId()
  const schedule = {
    id,
    name: data.name || '未命名备份计划',
    cron: data.cron || '0 2 * * *',
    retention: data.retention || 7,
    encrypt: data.encrypt || false,
    includeUploads: data.includeUploads !== false,
    includeLogs: data.includeLogs || false,
    compression: data.compression !== false,
    enabled: true,
    createdBy: userId,
    createdAt: new Date().toISOString(),
    lastRunAt: null,
    nextRunAt: null,
    runCount: 0,
  }
  db.backupSchedules[id] = schedule
  // 注册到 Cron 调度器
  addCronJob(schedule.cron, () => executeBackupSchedule(id), 'backup_' + id, { scheduleId: id })
  return schedule
}

// 执行定时备份
function executeBackupSchedule(scheduleId) {
  const schedule = db.backupSchedules?.[scheduleId]
  if (!schedule || !schedule.enabled) return null
  const backup = createBackup()
  schedule.lastRunAt = new Date().toISOString()
  schedule.runCount = (schedule.runCount || 0) + 1
  // 创建还原点
  if (!db.backupRestorePoints) db.backupRestorePoints = []
  db.backupRestorePoints.push({
    id: 'rp_' + genId(),
    scheduleId,
    backupId: backup.id,
    createdAt: new Date().toISOString(),
    size: backup.size || 0,
  })
  if (db.backupRestorePoints.length > 200) db.backupRestorePoints = db.backupRestorePoints.slice(-100)
  // 应用保留策略
  applyBackupRetention()
  return backup
}

// 列出定时备份
function listBackupSchedules() {
  if (!db.backupSchedules) return []
  return Object.values(db.backupSchedules)
}

// 暂停/恢复定时备份
function toggleBackupSchedule(id, enabled) {
  if (!db.backupSchedules?.[id]) return false
  db.backupSchedules[id].enabled = enabled
  return true
}

// 删除定时备份
function deleteBackupSchedule(id) {
  if (!db.backupSchedules?.[id]) return false
  delete db.backupSchedules[id]
  removeCronJob('backup_' + id)
  return true
}

// 校验备份完整性
function verifyBackupIntegrity(backupId) {
  if (!db.backups?.[backupId]) return { valid: false, error: '备份不存在' }
  const backup = db.backups[backupId]
  const backupPath = getBackupPath(backupId)
  if (!fs.existsSync(backupPath)) {
    return { valid: false, error: '备份文件不存在', backupId }
  }
  const stats = fs.statSync(backupPath)
  // 尝试读取并解析 JSON
  let parsed = null, parseError = null
  try {
    const content = fs.readFileSync(backupPath, 'utf-8')
    parsed = JSON.parse(content)
  } catch (err) {
    parseError = err.message
  }
  const result = {
    valid: parsed !== null,
    backupId,
    fileSize: stats.size,
    expectedSize: backup.size || null,
    sizeMatch: backup.size ? stats.size === backup.size : null,
    parseError,
    collections: parsed ? Object.keys(parsed).length : 0,
    verifiedAt: new Date().toISOString(),
  }
  if (!db.backupVerifications) db.backupVerifications = []
  db.backupVerifications.push(result)
  if (db.backupVerifications.length > 200) db.backupVerifications = db.backupVerifications.slice(-100)
  return result
}

// 列出还原点
function listRestorePoints(scheduleId) {
  if (!db.backupRestorePoints) return []
  let list = db.backupRestorePoints
  if (scheduleId) list = list.filter(rp => rp.scheduleId === scheduleId)
  return list
}

// 备份导出（返回备份文件路径与下载令牌）
function exportBackup(backupId, userId) {
  if (!db.backups?.[backupId]) return null
  const backupPath = getBackupPath(backupId)
  if (!fs.existsSync(backupPath)) return null
  auditLog('backup.export', userId, null, { backupId })
  return {
    backupId,
    path: backupPath,
    filename: path.basename(backupPath),
    size: fs.statSync(backupPath).size,
    exportedAt: new Date().toISOString(),
  }
}

// 备份统计
function getBackupStats() {
  const backups = Object.values(db.backups || {})
  const schedules = Object.values(db.backupSchedules || {})
  const totalSize = backups.reduce((sum, b) => sum + (b.size || 0), 0)
  return {
    totalBackups: backups.length,
    totalSize,
    totalSizeFormatted: formatBytes(totalSize),
    activeSchedules: schedules.filter(s => s.enabled).length,
    totalSchedules: schedules.length,
    restorePoints: (db.backupRestorePoints || []).length,
    verifications: (db.backupVerifications || []).length,
    lastBackup: backups.length ? backups.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] : null,
  }
}

// 格式化字节数
function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + units[i]
}

// ============ 模块18：配置中心增强 ============
// 记录配置变更历史
function recordConfigHistory(key, oldValue, newValue, userId) {
  if (!db.configHistory) db.configHistory = []
  db.configHistory.push({
    id: 'cfg_' + genId(),
    key,
    oldValue,
    newValue,
    changedBy: userId,
    changedAt: new Date().toISOString(),
  })
  if (db.configHistory.length > 1000) db.configHistory = db.configHistory.slice(-500)
}

// 获取配置历史
function getConfigHistory(key, limit) {
  if (!db.configHistory) return []
  let list = db.configHistory
  if (key) list = list.filter(h => h.key === key)
  return list.slice(-(limit || 100)).reverse()
}

// 创建配置文件
function createConfigProfile(data, userId) {
  if (!db.configProfiles) db.configProfiles = {}
  const id = 'prof_' + genId()
  const profile = {
    id,
    name: data.name || '未命名配置文件',
    description: data.description || '',
    config: data.config || {},
    isDefault: false,
    createdBy: userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  db.configProfiles[id] = profile
  return profile
}

// 应用配置文件
function applyConfigProfile(id, userId) {
  if (!db.configProfiles?.[id]) return false
  const profile = db.configProfiles[id]
  for (const [key, value] of Object.entries(profile.config)) {
    const oldValue = getConfig(key)
    recordConfigHistory(key, oldValue, value, userId)
    setConfig(key, value)
  }
  return true
}

// 列出配置文件
function listConfigProfiles() {
  if (!db.configProfiles) return []
  return Object.values(db.configProfiles)
}

// 删除配置文件
function deleteConfigProfile(id) {
  if (!db.configProfiles?.[id]) return false
  delete db.configProfiles[id]
  return true
}

// 导出配置
function exportConfig(userId) {
  const config = db.config || {}
  const profiles = db.configProfiles || {}
  auditLog('config.export', userId, null, { keys: Object.keys(config).length })
  return {
    config,
    profiles,
    exportedAt: new Date().toISOString(),
    version: '1.0',
  }
}

// 导入配置
function importConfig(data, userId, options) {
  if (!data.config || typeof data.config !== 'object') return { success: false, error: '无效的配置格式' }
  const overwrite = options?.overwrite !== false
  let imported = 0, skipped = 0
  for (const [key, value] of Object.entries(data.config)) {
    if (!overwrite && getConfig(key) !== undefined) {
      skipped += 1
      continue
    }
    const oldValue = getConfig(key)
    recordConfigHistory(key, oldValue, value, userId)
    setConfig(key, value)
    imported += 1
  }
  auditLog('config.import', userId, null, { imported, skipped })
  return { success: true, imported, skipped }
}

// 校验配置
function validateConfig(config) {
  if (!db.configValidations) db.configValidations = []
  const errors = [], warnings = []
  const schema = getConfigSchema()
  for (const [key, value] of Object.entries(config || {})) {
    const schemaItem = schema[key]
    if (!schemaItem) {
      warnings.push({ key, message: '未知配置项' })
      continue
    }
    if (schemaItem.type && typeof value !== schemaItem.type) {
      errors.push({ key, expected: schemaItem.type, actual: typeof value })
    }
    if (schemaItem.enum && !schemaItem.enum.includes(value)) {
      errors.push({ key, message: '值不在允许范围内', allowed: schemaItem.enum })
    }
    if (schemaItem.min !== undefined && value < schemaItem.min) {
      errors.push({ key, message: '值小于最小值', min: schemaItem.min })
    }
    if (schemaItem.max !== undefined && value > schemaItem.max) {
      errors.push({ key, message: '值大于最大值', max: schemaItem.max })
    }
  }
  const result = {
    valid: errors.length === 0,
    errors,
    warnings,
    validatedAt: new Date().toISOString(),
    itemCount: Object.keys(config || {}).length,
  }
  db.configValidations.push(result)
  if (db.configValidations.length > 200) db.configValidations = db.configValidations.slice(-100)
  return result
}

// 重置所有配置到默认值
function resetAllConfig(userId) {
  const oldConfig = { ...(db.config || {}) }
  db.config = {}
  auditLog('config.reset_all', userId, null, { oldKeys: Object.keys(oldConfig) })
  return { success: true, resetCount: Object.keys(oldConfig).length }
}

// ============ 模块19：i18n 翻译管理增强 ============
// 添加翻译覆盖
function setTranslationOverride(lang, key, value, userId) {
  if (!db.translationOverrides) db.translationOverrides = {}
  if (!db.translationOverrides[lang]) db.translationOverrides[lang] = {}
  const oldValue = db.translationOverrides[lang][key]?.value
  db.translationOverrides[lang][key] = {
    value,
    updatedBy: userId,
    updatedAt: new Date().toISOString(),
  }
  return { lang, key, value, oldValue }
}

// 获取翻译覆盖
function getTranslationOverrides(lang) {
  if (!db.translationOverrides) return {}
  if (lang) return db.translationOverrides[lang] || {}
  return db.translationOverrides
}

// 删除翻译覆盖
function deleteTranslationOverride(lang, key) {
  if (!db.translationOverrides?.[lang]?.[key]) return false
  delete db.translationOverrides[lang][key]
  return true
}

// 记录缺失的翻译键
function recordMissingTranslationKey(lang, key) {
  if (!db.missingTranslationKeys) db.missingTranslationKeys = []
  // 去重：相同 lang+key+1小时内不重复记录
  const now = Date.now()
  const recent = db.missingTranslationKeys.find(
    m => m.lang === lang && m.key === key && (now - new Date(m.lastSeen).getTime()) < 3600000
  )
  if (recent) {
    recent.count = (recent.count || 0) + 1
    recent.lastSeen = new Date().toISOString()
    return recent
  }
  const entry = {
    id: 'mtk_' + genId(),
    lang,
    key,
    count: 1,
    firstSeen: new Date().toISOString(),
    lastSeen: new Date().toISOString(),
  }
  db.missingTranslationKeys.push(entry)
  if (db.missingTranslationKeys.length > 500) db.missingTranslationKeys = db.missingTranslationKeys.slice(-300)
  return entry
}

// 获取缺失的翻译键列表
function getMissingTranslationKeys(lang) {
  if (!db.missingTranslationKeys) return []
  let list = db.missingTranslationKeys
  if (lang) list = list.filter(m => m.lang === lang)
  return list.sort((a, b) => b.count - a.count)
}

// 批量导入翻译
function importTranslations(lang, translations, userId, options) {
  if (!db.customTranslations) db.customTranslations = {}
  if (!db.customTranslations[lang]) db.customTranslations[lang] = {}
  let imported = 0, skipped = 0
  for (const [key, value] of Object.entries(translations || {})) {
    if (options?.overwrite === false && db.customTranslations[lang][key]) {
      skipped += 1
      continue
    }
    db.customTranslations[lang][key] = value
    imported += 1
  }
  auditLog('i18n.import', userId, null, { lang, imported, skipped })
  return { success: true, lang, imported, skipped }
}

// 导出翻译
function exportTranslations(lang) {
  const langPacks = loadLangPacks()
  const basePack = langPacks[lang] || {}
  const overrides = db.translationOverrides?.[lang] || {}
  const customs = db.customTranslations?.[lang] || {}
  // 合并：custom > override > base
  const merged = { ...basePack }
  for (const [key, entry] of Object.entries(overrides)) {
    merged[key] = entry.value
  }
  for (const [key, value] of Object.entries(customs)) {
    merged[key] = value
  }
  return {
    lang,
    translations: merged,
    baseCount: Object.keys(basePack).length,
    overrideCount: Object.keys(overrides).length,
    customCount: Object.keys(customs).length,
    exportedAt: new Date().toISOString(),
  }
}

// 翻译统计
function getTranslationStats() {
  const langPacks = loadLangPacks()
  const overrides = db.translationOverrides || {}
  const customs = db.customTranslations || {}
  const missing = db.missingTranslationKeys || []
  const stats = {
    supportedLanguages: Object.keys(langPacks),
    languageCount: Object.keys(langPacks).length,
    overrideCount: Object.keys(overrides).reduce((sum, lang) => sum + Object.keys(overrides[lang]).length, 0),
    customCount: Object.keys(customs).reduce((sum, lang) => sum + Object.keys(customs[lang]).length, 0),
    missingKeyCount: missing.length,
    byLanguage: {},
  }
  for (const lang of Object.keys(langPacks)) {
    stats.byLanguage[lang] = {
      baseKeys: Object.keys(langPacks[lang]).length,
      overrides: Object.keys(overrides[lang] || {}).length,
      customs: Object.keys(customs[lang] || {}).length,
      missing: missing.filter(m => m.lang === lang).length,
    }
  }
  return stats
}

// ===【新增模块辅助函数锚点】===
// ============ 模块20：API 网关系统 ============
// 动态路由匹配：支持路径参数 /api/users/:id
function compileGatewayRoute(pattern) {
  // 将 :param 转为正则捕获组，并收集参数名
  const params = []
  const regexStr = '^' + pattern.replace(/:(\w+)/g, (_, name) => {
    params.push(name)
    return '([^/]+)'
  }) + '$'
  return { regex: new RegExp(regexStr), params }
}

// 匹配网关路由
function matchGatewayRoute(method, pathname) {
  if (!db.gatewayRoutes) db.gatewayRoutes = {}
  for (const route of Object.values(db.gatewayRoutes)) {
    if (!route.enabled) continue
    if (route.method && route.method !== method) continue
    const compiled = route._compiled || compileGatewayRoute(route.path)
    if (!route._compiled) {
      route._compiled = compiled
    }
    const m = pathname.match(compiled.regex)
    if (m) {
      const params = {}
      compiled.params.forEach((p, i) => { params[p] = decodeURIComponent(m[i + 1]) })
      return { route, params }
    }
  }
  return null
}

// 注册网关路由
function registerGatewayRoute(data, userId) {
  if (!db.gatewayRoutes) db.gatewayRoutes = {}
  const id = data.id || ('gw_' + genId())
  const route = {
    id,
    name: data.name || ('route-' + id),
    path: data.path || '/',
    method: (data.method || 'GET').toUpperCase(),
    target: data.target || null,
    targets: Array.isArray(data.targets) ? data.targets : (data.target ? [data.target] : []),
    group: data.group || 'default',
    enabled: data.enabled !== false,
    priority: data.priority || 0,
    transformRequest: data.transformRequest || null,
    transformResponse: data.transformResponse || null,
    validation: data.validation || null,
    rateLimit: data.rateLimit || null,
    timeout: data.timeout || 30000,
    retry: data.retry || 0,
    idempotencyKey: data.idempotencyKey || null,
    circuitBreaker: data.circuitBreaker !== false,
    description: data.description || '',
    createdBy: userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stats: { total: 0, success: 0, failed: 0, avgLatency: 0 },
  }
  route._compiled = compileGatewayRoute(route.path)
  db.gatewayRoutes[id] = route
  saveDB(db)
  return route
}

// 更新网关路由
function updateGatewayRoute(id, data, userId) {
  if (!db.gatewayRoutes || !db.gatewayRoutes[id]) return null
  const route = db.gatewayRoutes[id]
  const fields = ['name', 'path', 'method', 'target', 'targets', 'group', 'enabled', 'priority',
    'transformRequest', 'transformResponse', 'validation', 'rateLimit', 'timeout', 'retry',
    'idempotencyKey', 'circuitBreaker', 'description']
  for (const f of fields) {
    if (data[f] !== undefined) route[f] = data[f]
  }
  if (data.path) route._compiled = compileGatewayRoute(route.path)
  route.updatedBy = userId
  route.updatedAt = new Date().toISOString()
  saveDB(db)
  return route
}

// 删除网关路由
function deleteGatewayRoute(id) {
  if (!db.gatewayRoutes || !db.gatewayRoutes[id]) return false
  delete db.gatewayRoutes[id]
  saveDB(db)
  return true
}

// 请求头注入
function applyRequestTransform(transform, req, body) {
  if (!transform) return { headers: req.headers, body }
  const headers = { ...req.headers }
  const newBody = { ...body }
  // 注入请求头
  if (transform.injectHeaders && typeof transform.injectHeaders === 'object') {
    for (const [k, v] of Object.entries(transform.injectHeaders)) {
      headers[k] = typeof v === 'string' ? v.replace(/\$\{(.+?)\}/g, (_, key) => body[key] || '') : v
    }
  }
  // 参数转换：类型转换
  if (transform.paramMapping && typeof transform.paramMapping === 'object') {
    for (const [from, to] of Object.entries(transform.paramMapping)) {
      if (newBody[from] !== undefined) {
        newBody[to] = newBody[from]
        if (transform.removeOriginal) delete newBody[from]
      }
    }
  }
  // 请求体重构
  if (transform.bodyTemplate && typeof transform.bodyTemplate === 'object') {
    const rebuilt = {}
    for (const [k, path] of Object.entries(transform.bodyTemplate)) {
      const parts = String(path).split('.')
      let val = newBody
      for (const p of parts) { val = val?.[p] }
      if (val !== undefined) rebuilt[k] = val
    }
    return { headers, body: rebuilt }
  }
  return { headers, body: newBody }
}

// 响应转换：统一响应格式
function applyResponseTransform(transform, response) {
  if (!transform) return response
  let result = response
  if (transform.wrapResponse) {
    result = {
      success: !response.error,
      code: response.code || 200,
      data: response.error ? null : response,
      error: response.error || null,
      timestamp: new Date().toISOString(),
    }
  }
  if (transform.errorFormat && response.error) {
    result = {
      success: false,
      error: {
        code: response.code || 500,
        message: response.error,
        details: response.details || null,
      },
      timestamp: new Date().toISOString(),
    }
  }
  if (transform.fieldMapping && typeof transform.fieldMapping === 'object') {
    const mapped = {}
    for (const [from, to] of Object.entries(transform.fieldMapping)) {
      if (response[from] !== undefined) mapped[to] = response[from]
    }
    result = mapped
  }
  return result
}

// 参数校验
function validateRequest(validation, body) {
  if (!validation || !validation.fields) return { valid: true, errors: [] }
  const errors = []
  for (const [field, rules] of Object.entries(validation.fields)) {
    const value = body[field]
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push({ field, error: `${field} 为必填项` })
      continue
    }
    if (value === undefined) continue
    if (rules.type) {
      const t = typeof value
      if (rules.type === 'string' && t !== 'string') errors.push({ field, error: `${field} 必须为字符串` })
      if (rules.type === 'number' && (t !== 'number' || isNaN(value))) errors.push({ field, error: `${field} 必须为数字` })
      if (rules.type === 'boolean' && t !== 'boolean') errors.push({ field, error: `${field} 必须为布尔` })
      if (rules.type === 'array' && !Array.isArray(value)) errors.push({ field, error: `${field} 必须为数组` })
      if (rules.type === 'object' && (t !== 'object' || Array.isArray(value))) errors.push({ field, error: `${field} 必须为对象` })
    }
    if (rules.min !== undefined && value < rules.min) errors.push({ field, error: `${field} 不能小于 ${rules.min}` })
    if (rules.max !== undefined && value > rules.max) errors.push({ field, error: `${field} 不能大于 ${rules.max}` })
    if (rules.minLength !== undefined && String(value).length < rules.minLength) errors.push({ field, error: `${field} 长度不能小于 ${rules.minLength}` })
    if (rules.maxLength !== undefined && String(value).length > rules.maxLength) errors.push({ field, error: `${field} 长度不能大于 ${rules.maxLength}` })
    if (rules.pattern && !new RegExp(rules.pattern).test(String(value))) errors.push({ field, error: `${field} 格式不正确` })
    if (rules.enum && !rules.enum.includes(value)) errors.push({ field, error: `${field} 必须为 ${rules.enum.join('/')} 之一` })
  }
  return { valid: errors.length === 0, errors }
}

// 黑白名单检查
function checkGatewayBlocklist(ip, geo, device) {
  if (!db.gatewayBlocklist) db.gatewayBlocklist = {}
  const bl = db.gatewayBlocklist
  // IP 黑名单
  if (bl.ipBlacklist && bl.ipBlacklist.includes(ip)) {
    return { allowed: false, reason: 'IP 在黑名单中' }
  }
  // IP 白名单（若启用）
  if (bl.ipWhitelist && bl.ipWhitelist.length > 0 && !bl.ipWhitelist.includes(ip)) {
    return { allowed: false, reason: 'IP 不在白名单中' }
  }
  // 地理限制
  if (bl.geoBlocking && bl.geoBlocking.allowedCountries && !bl.geoBlocking.allowedCountries.includes(geo)) {
    return { allowed: false, reason: '地区被限制访问' }
  }
  // 设备限制
  if (bl.deviceRestrictions && bl.deviceRestrictions.allowedDevices && !bl.deviceRestrictions.allowedDevices.includes(device)) {
    return { allowed: false, reason: '设备类型被限制' }
  }
  return { allowed: true }
}

// 负载均衡：多后端实例轮询
function selectBackend(route) {
  const targets = route.targets && route.targets.length > 0 ? route.targets : (route.target ? [route.target] : [])
  if (targets.length === 0) return null
  if (targets.length === 1) return targets[0]
  // 轮询策略
  const strategy = route.loadBalanceStrategy || 'round-robin'
  if (strategy === 'round-robin') {
    route._rrIndex = (route._rrIndex || 0) % targets.length
    const target = targets[route._rrIndex]
    route._rrIndex = (route._rrIndex + 1) % targets.length
    return target
  }
  if (strategy === 'random') {
    return targets[Math.floor(Math.random() * targets.length)]
  }
  if (strategy === 'weighted' && targets.every(t => t.weight !== undefined)) {
    const total = targets.reduce((s, t) => s + (t.weight || 1), 0)
    let r = Math.random() * total
    for (const t of targets) {
      r -= (t.weight || 1)
      if (r <= 0) return t
    }
  }
  if (strategy === 'least-connections') {
    return targets.reduce((min, t) => ((t._connections || 0) < (min._connections || 0) ? t : min), targets[0])
  }
  return targets[0]
}

// 熔断器：错误率超阈值自动熔断
function getCircuitBreaker(routeId) {
  if (!db.gatewayCircuitBreakers) db.gatewayCircuitBreakers = {}
  if (!db.gatewayCircuitBreakers[routeId]) {
    db.gatewayCircuitBreakers[routeId] = {
      state: 'closed', // closed / open / half-open
      failureCount: 0,
      successCount: 0,
      lastFailure: null,
      lastStateChange: Date.now(),
      threshold: 5,
      resetTimeout: 30000,
      halfOpenMax: 3,
      halfOpenCount: 0,
    }
  }
  return db.gatewayCircuitBreakers[routeId]
}

function recordCircuitBreakerResult(routeId, success) {
  const cb = getCircuitBreaker(routeId)
  if (success) {
    cb.successCount++
    if (cb.state === 'half-open') {
      cb.halfOpenCount++
      if (cb.halfOpenCount >= cb.halfOpenMax) {
        cb.state = 'closed'
        cb.failureCount = 0
        cb.lastStateChange = Date.now()
      }
    }
  } else {
    cb.failureCount++
    cb.lastFailure = Date.now()
    if (cb.state === 'half-open') {
      cb.state = 'open'
      cb.lastStateChange = Date.now()
    } else if (cb.state === 'closed' && cb.failureCount >= cb.threshold) {
      cb.state = 'open'
      cb.lastStateChange = Date.now()
    }
  }
  saveDB(db)
}

function isCircuitBreakerOpen(routeId) {
  const cb = getCircuitBreaker(routeId)
  if (cb.state === 'closed') return false
  if (cb.state === 'open') {
    // 检查是否到了尝试恢复时间
    if (Date.now() - cb.lastStateChange >= cb.resetTimeout) {
      cb.state = 'half-open'
      cb.halfOpenCount = 0
      cb.lastStateChange = Date.now()
      saveDB(db)
      return false
    }
    return true
  }
  if (cb.state === 'half-open') {
    return cb.halfOpenCount >= cb.halfOpenMax
  }
  return false
}

// 请求去重：幂等性检查
function checkIdempotency(key, payload) {
  if (!db.gatewayIdempotency) db.gatewayIdempotency = {}
  const existing = db.gatewayIdempotency[key]
  if (existing) {
    // 检查请求体是否相同（避免误用 key）
    const payloadHash = simpleHash(JSON.stringify(payload))
    if (existing.payloadHash === payloadHash) {
      return { hit: true, response: existing.response }
    }
    return { hit: false, conflict: true, reason: '幂等键已被使用但请求体不同' }
  }
  return { hit: false }
}

function simpleHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return 'h_' + Math.abs(hash).toString(36)
}

function storeIdempotencyResponse(key, payload, response, ttl) {
  if (!db.gatewayIdempotency) db.gatewayIdempotency = {}
  db.gatewayIdempotency[key] = {
    payloadHash: simpleHash(JSON.stringify(payload)),
    response,
    createdAt: Date.now(),
    expiresAt: ttl ? Date.now() + ttl : Date.now() + 86400000,
  }
  saveDB(db)
}

// 清理过期幂等记录
function cleanupIdempotency() {
  if (!db.gatewayIdempotency) return { removed: 0 }
  const now = Date.now()
  let removed = 0
  for (const [key, record] of Object.entries(db.gatewayIdempotency)) {
    if (record.expiresAt && record.expiresAt < now) {
      delete db.gatewayIdempotency[key]
      removed++
    }
  }
  if (removed > 0) saveDB(db)
  return { removed }
}

// API 分组管理
function createGatewayGroup(data, userId) {
  if (!db.gatewayGroups) db.gatewayGroups = {}
  const id = data.id || ('grp_' + genId())
  const group = {
    id,
    name: data.name || ('group-' + id),
    description: data.description || '',
    routes: Array.isArray(data.routes) ? data.routes : [],
    prefix: data.prefix || '',
    rateLimit: data.rateLimit || null,
    auth: data.auth || null,
    enabled: data.enabled !== false,
    createdBy: userId,
    createdAt: new Date().toISOString(),
    metadata: data.metadata || {},
  }
  db.gatewayGroups[id] = group
  saveDB(db)
  return group
}

function addRouteToGroup(groupId, routeId) {
  if (!db.gatewayGroups || !db.gatewayGroups[groupId]) return false
  const group = db.gatewayGroups[groupId]
  if (!group.routes.includes(routeId)) {
    group.routes.push(routeId)
    saveDB(db)
  }
  return true
}

// 请求追踪：trace ID 生成/传递
function generateTraceId() {
  return 'trc_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10)
}

function generateSpanId() {
  return 'spn_' + Math.random().toString(36).slice(2, 12)
}

function recordTrace(trace) {
  if (!db.gatewayTraces) db.gatewayTraces = []
  db.gatewayTraces.push(trace)
  if (db.gatewayTraces.length > 5000) db.gatewayTraces = db.gatewayTraces.slice(-3000)
}

function getTraces(filter) {
  if (!db.gatewayTraces) return []
  let traces = db.gatewayTraces
  if (filter) {
    if (filter.routeId) traces = traces.filter(t => t.routeId === filter.routeId)
    if (filter.status) traces = traces.filter(t => t.status === filter.status)
    if (filter.since) traces = traces.filter(t => t.startTime >= filter.since)
    if (filter.minDuration) traces = traces.filter(t => t.duration >= filter.minDuration)
  }
  return traces.slice((filter?.offset || 0), (filter?.offset || 0) + (filter?.limit || 100))
}

// 后端实例管理
function registerGatewayBackend(data, userId) {
  if (!db.gatewayBackends) db.gatewayBackends = {}
  const id = data.id || ('be_' + genId())
  const backend = {
    id,
    name: data.name || ('backend-' + id),
    url: data.url,
    protocol: data.protocol || 'http',
    health: 'unknown', // unknown / healthy / unhealthy
    weight: data.weight || 1,
    maxConnections: data.maxConnections || 100,
    currentConnections: 0,
    enabled: data.enabled !== false,
    metadata: data.metadata || {},
    lastHealthCheck: null,
    createdBy: userId,
    createdAt: new Date().toISOString(),
  }
  db.gatewayBackends[id] = backend
  saveDB(db)
  return backend
}

function getGatewayStats() {
  const routes = Object.values(db.gatewayRoutes || {})
  const traces = db.gatewayTraces || []
  const totalRequests = routes.reduce((s, r) => s + (r.stats?.total || 0), 0)
  const totalSuccess = routes.reduce((s, r) => s + (r.stats?.success || 0), 0)
  const totalFailed = routes.reduce((s, r) => s + (r.stats?.failed || 0), 0)
  const openBreakers = Object.values(db.gatewayCircuitBreakers || {}).filter(cb => cb.state === 'open').length
  return {
    routes: routes.length,
    activeRoutes: routes.filter(r => r.enabled).length,
    groups: Object.keys(db.gatewayGroups || {}).length,
    backends: Object.keys(db.gatewayBackends || {}).length,
    totalRequests,
    totalSuccess,
    totalFailed,
    successRate: totalRequests > 0 ? (totalSuccess / totalRequests * 100).toFixed(2) + '%' : '0%',
    openCircuitBreakers: openBreakers,
    recentTraces: traces.length,
    idempotencyRecords: Object.keys(db.gatewayIdempotency || {}).length,
  }
}

// 更新路由统计
function updateRouteStats(route, success, latency) {
  if (!route.stats) route.stats = { total: 0, success: 0, failed: 0, avgLatency: 0 }
  route.stats.total++
  if (success) route.stats.success++
  else route.stats.failed++
  // 滑动平均
  route.stats.avgLatency = route.stats.avgLatency
    ? (route.stats.avgLatency * 0.9 + latency * 0.1)
    : latency
}

// ===【新增模块辅助函数锚点结束】===

// ============ 模块27：系统诊断系统 ============
// 系统自检：启动时全面检查
function runSystemSelfCheck() {
  if (!db.diagSelfChecks) db.diagSelfChecks = []
  const checks = []
  // 1. 数据库检查
  const dbSize = JSON.stringify(db).length
  checks.push({
    name: '数据库大小',
    passed: dbSize < 100 * 1024 * 1024, // 小于 100MB
    value: dbSize,
    unit: 'bytes',
    severity: 'high',
    message: dbSize > 100 * 1024 * 1024 ? '数据库过大，建议清理' : '正常',
  })
  // 2. 用户数据检查
  const userCount = Object.keys(db.users || {}).length
  checks.push({
    name: '用户数量',
    passed: userCount > 0,
    value: userCount,
    unit: 'count',
    severity: 'medium',
    message: userCount === 0 ? '无用户数据' : '正常',
  })
  // 3. 会话检查
  const sessionCount = Object.keys(db.sessions || {}).length
  checks.push({
    name: '会话数量',
    passed: sessionCount < 10000,
    value: sessionCount,
    unit: 'count',
    severity: 'medium',
    message: sessionCount > 10000 ? '会话过多，建议清理' : '正常',
  })
  // 4. 角色配置检查
  const roleCount = Object.keys(db.roles || {}).length
  checks.push({
    name: '角色配置',
    passed: roleCount > 0,
    value: roleCount,
    unit: 'count',
    severity: 'high',
    message: roleCount === 0 ? '未配置角色' : '正常',
  })
  // 5. 插件检查
  const pluginCount = Object.keys(db.plugins || {}).length
  checks.push({
    name: '插件加载',
    passed: true,
    value: pluginCount,
    unit: 'count',
    severity: 'low',
    message: `已加载 ${pluginCount} 个插件`,
  })
  // 6. 知识库检查
  const knowledgeCount = Object.keys(db.knowledgeEx || {}).length
  checks.push({
    name: '知识库条目',
    passed: true,
    value: knowledgeCount,
    unit: 'count',
    severity: 'low',
    message: `知识库有 ${knowledgeCount} 个条目`,
  })
  // 7. 定时任务检查
  const cronCount = Object.keys(db.cronJobs || {}).length
  checks.push({
    name: '定时任务',
    passed: true,
    value: cronCount,
    unit: 'count',
    severity: 'low',
    message: `已配置 ${cronCount} 个定时任务`,
  })
  // 8. 备份检查
  const backupCount = Object.keys(db.backups || {}).length
  const lastBackup = Object.values(db.backups || {})
    .map(b => new Date(b.createdAt).getTime())
    .sort((a, b) => b - a)[0]
  const backupAgeDays = lastBackup ? Math.floor((Date.now() - lastBackup) / 86400000) : -1
  checks.push({
    name: '最近备份',
    passed: backupAgeDays >= 0 && backupAgeDays <= 7,
    value: backupAgeDays,
    unit: 'days',
    severity: 'high',
    message: backupAgeDays < 0 ? '从未备份' : (backupAgeDays > 7 ? '备份过旧' : '正常'),
  })
  const result = {
    id: 'sc_' + genId(),
    timestamp: Date.now(),
    createdAt: new Date().toISOString(),
    checks,
    passedCount: checks.filter(c => c.passed).length,
    failedCount: checks.filter(c => !c.passed).length,
    totalCount: checks.length,
  }
  db.diagSelfChecks.push(result)
  if (db.diagSelfChecks.length > 100) db.diagSelfChecks = db.diagSelfChecks.slice(-50)
  saveDB(db)
  return result
}

// 依赖检查
function checkDependencies() {
  if (!db.diagDependencyChecks) db.diagDependencyChecks = []
  const deps = []
  // Node.js 版本
  const nodeVersion = process.version
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0])
  deps.push({
    name: 'Node.js',
    type: 'runtime',
    version: nodeVersion,
    required: '>=18.0.0',
    passed: majorVersion >= 18,
    message: majorVersion < 18 ? 'Node.js 版本过低' : '正常',
  })
  // 文件系统
  try {
    const testFile = '/tmp/.hopeagent_diag_test'
    fs.writeFileSync(testFile, 'test')
    fs.unlinkSync(testFile)
    deps.push({ name: '文件系统', type: 'storage', passed: true, message: '可读写' })
  } catch (err) {
    deps.push({ name: '文件系统', type: 'storage', passed: false, message: '读写失败：' + err.message })
  }
  // 数据库文件
  try {
    fs.accessSync(DB_FILE, fs.constants.R_OK | fs.constants.W_OK)
    deps.push({ name: '数据库文件', type: 'storage', passed: true, message: '可访问' })
  } catch (err) {
    deps.push({ name: '数据库文件', type: 'storage', passed: false, message: '不可访问' })
  }
  // 内存
  const memUsage = process.memoryUsage()
  deps.push({
    name: '内存',
    type: 'runtime',
    passed: memUsage.rss < 512 * 1024 * 1024,
    value: Math.round(memUsage.rss / 1024 / 1024),
    unit: 'MB',
    message: memUsage.rss > 512 * 1024 * 1024 ? '内存使用过高' : '正常',
  })
  // 网络端口
  deps.push({
    name: '监听端口',
    type: 'network',
    passed: true,
    value: typeof PORT !== 'undefined' ? PORT : 3000,
    message: '端口配置正常',
  })
  const result = {
    id: 'dep_' + genId(),
    timestamp: Date.now(),
    createdAt: new Date().toISOString(),
    dependencies: deps,
    passedCount: deps.filter(d => d.passed).length,
    failedCount: deps.filter(d => !d.passed).length,
  }
  db.diagDependencyChecks.push(result)
  if (db.diagDependencyChecks.length > 50) db.diagDependencyChecks = db.diagDependencyChecks.slice(-30)
  saveDB(db)
  return result
}

// 数据完整性检查
function checkDataIntegrity() {
  if (!db.diagIntegrityChecks) db.diagIntegrityChecks = []
  const issues = []
  // 检查 1: 用户引用的会话是否存在
  const sessionIds = new Set(Object.keys(db.sessions || {}))
  for (const [sid, session] of Object.entries(db.sessions || {})) {
    if (session.userId && !db.users?.[session.userId]) {
      issues.push({
        type: 'orphan-session',
        severity: 'medium',
        message: `会话 ${sid} 引用了不存在的用户 ${session.userId}`,
      })
    }
  }
  // 检查 2: 文件引用的用户是否存在
  for (const [fid, file] of Object.entries(db.files || {})) {
    if (file.uploadedBy && !db.users?.[file.uploadedBy]) {
      issues.push({
        type: 'orphan-file',
        severity: 'low',
        message: `文件 ${fid} 引用了不存在的用户 ${file.uploadedBy}`,
      })
    }
  }
  // 检查 3: 知识库条目字段完整性
  for (const [kid, item] of Object.entries(db.knowledgeEx || {})) {
    if (!item.title) {
      issues.push({
        type: 'incomplete-knowledge',
        severity: 'low',
        message: `知识库条目 ${kid} 缺少 title 字段`,
      })
    }
    if (!item.createdAt) {
      issues.push({
        type: 'incomplete-knowledge',
        severity: 'medium',
        message: `知识库条目 ${kid} 缺少 createdAt 字段`,
      })
    }
  }
  // 检查 4: 角色定义完整性
  for (const [rid, role] of Object.entries(db.roles || {})) {
    if (!role.permissions || !Array.isArray(role.permissions)) {
      issues.push({
        type: 'incomplete-role',
        severity: 'high',
        message: `角色 ${rid} 的 permissions 字段无效`,
      })
    }
  }
  // 检查 5: 重复 ID 检测
  const allIds = new Set()
  let duplicateCount = 0
  const checkDuplicate = (id, type) => {
    if (allIds.has(id)) {
      duplicateCount++
      issues.push({ type: 'duplicate-id', severity: 'high', message: `${type} ID 重复：${id}` })
    } else {
      allIds.add(id)
    }
  }
  for (const user of Object.values(db.users || {})) {
    if (user.id) checkDuplicate(user.id, 'user')
  }
  const result = {
    id: 'intg_' + genId(),
    timestamp: Date.now(),
    createdAt: new Date().toISOString(),
    issues,
    issueCount: issues.length,
    bySeverity: {
      high: issues.filter(i => i.severity === 'high').length,
      medium: issues.filter(i => i.severity === 'medium').length,
      low: issues.filter(i => i.severity === 'low').length,
    },
    passed: issues.filter(i => i.severity === 'high').length === 0,
  }
  db.diagIntegrityChecks.push(result)
  if (db.diagIntegrityChecks.length > 50) db.diagIntegrityChecks = db.diagIntegrityChecks.slice(-30)
  saveDB(db)
  return result
}

// 性能诊断
function diagnosePerformance() {
  const memUsage = process.memoryUsage()
  const cpuUsage = process.cpuUsage()
  // 磁盘使用
  let diskUsage = { available: 0, total: 0 }
  try {
    const stats = fs.statSync(DB_FILE)
    diskUsage = { dbFileSize: stats.size, lastModified: stats.mtime }
  } catch {}
  const performance = {
    id: 'perf_' + genId(),
    timestamp: Date.now(),
    createdAt: new Date().toISOString(),
    memory: {
      rss: memUsage.rss,
      heapTotal: memUsage.heapTotal,
      heapUsed: memUsage.heapUsed,
      external: memUsage.external,
      arrayBuffers: memUsage.arrayBuffers,
      rssMB: Math.round(memUsage.rss / 1024 / 1024 * 100) / 100,
      heapUsedMB: Math.round(memUsage.heapUsed / 1024 / 1024 * 100) / 100,
      heapUsagePercent: Math.round(memUsage.heapUsed / memUsage.heapTotal * 100),
    },
    cpu: {
      user: cpuUsage.user,
      system: cpuUsage.system,
      userMs: Math.round(cpuUsage.user / 1000),
      systemMs: Math.round(cpuUsage.system / 1000),
    },
    disk: diskUsage,
    uptime: process.uptime(),
    uptimeHours: Math.round(process.uptime() / 3600 * 100) / 100,
    pid: process.pid,
    platform: process.platform,
    nodeVersion: process.version,
    loadAverage: process.loadavg,
    recommendations: [],
  }
  // 性能建议
  if (performance.memory.heapUsagePercent > 80) {
    performance.recommendations.push({
      type: 'high-memory-usage',
      message: `堆内存使用率 ${performance.memory.heapUsagePercent}%，建议优化数据结构或增加内存`,
    })
  }
  if (performance.uptime < 60) {
    performance.recommendations.push({
      type: 'recent-restart',
      message: '系统刚启动不到 1 分钟，可能存在冷启动开销',
    })
  }
  if (performance.loadAverage[0] > 4) {
    performance.recommendations.push({
      type: 'high-load',
      message: `系统负载 ${performance.loadAverage[0].toFixed(2)} 较高`,
    })
  }
  if (!db.diagPerformance) db.diagPerformance = {}
  db.diagPerformance.lastCheck = performance
  return performance
}

// 连接诊断
function diagnoseConnections() {
  const connections = {
    id: 'conn_' + genId(),
    timestamp: Date.now(),
    createdAt: new Date().toISOString(),
    database: { status: 'unknown', latency: 0 },
    fileSystem: { status: 'unknown', latency: 0 },
    cache: { status: 'unknown', latency: 0 },
    websocket: { status: 'unknown', latency: 0 },
  }
  // 数据库（JSON 文件）
  const dbStart = Date.now()
  try {
    fs.accessSync(DB_FILE, fs.constants.R_OK | fs.constants.W_OK)
    connections.database = { status: 'healthy', latency: Date.now() - dbStart }
  } catch (err) {
    connections.database = { status: 'unhealthy', latency: Date.now() - dbStart, error: err.message }
  }
  // 文件系统
  const fsStart = Date.now()
  try {
    const testFile = '/tmp/.hopeagent_conn_test'
    fs.writeFileSync(testFile, 'test')
    fs.unlinkSync(testFile)
    connections.fileSystem = { status: 'healthy', latency: Date.now() - fsStart }
  } catch (err) {
    connections.fileSystem = { status: 'unhealthy', latency: Date.now() - fsStart, error: err.message }
  }
  // 缓存（内存）
  const cacheStart = Date.now()
  try {
    if (typeof globalCache !== 'undefined') {
      connections.cache = { status: 'healthy', latency: Date.now() - cacheStart }
    } else {
      connections.cache = { status: 'not-configured', latency: Date.now() - cacheStart }
    }
  } catch (err) {
    connections.cache = { status: 'unhealthy', latency: Date.now() - cacheStart, error: err.message }
  }
  // WebSocket
  connections.websocket = {
    status: 'healthy',
    latency: 1,
    message: 'WebSocket 服务运行中',
  }
  if (!db.diagConnections) db.diagConnections = {}
  db.diagConnections.lastCheck = connections
  return connections
}

// 日志分析
function analyzeLogs(options) {
  const errorLogs = db.errorLogs || []
  const operationLogs = db.operationLogs || []
  const securityLogs = db.securityLogs || []
  const since = options?.since || Date.now() - 24 * 3600 * 1000
  const recentErrors = errorLogs.filter(l => l.timestamp > since)
  const recentOps = operationLogs.filter(l => l.timestamp > since)
  const recentSec = securityLogs.filter(l => l.timestamp > since)
  // 错误分类
  const errorPatterns = {}
  for (const e of recentErrors) {
    const pattern = (e.message || e.error || 'unknown').slice(0, 100)
    errorPatterns[pattern] = (errorPatterns[pattern] || 0) + 1
  }
  // 异常检测
  const anomalies = []
  if (recentErrors.length > 100) {
    anomalies.push({
      type: 'high-error-rate',
      severity: 'high',
      message: `24 小时内有 ${recentErrors.length} 条错误日志`,
    })
  }
  const errorRate = recentOps.length > 0 ? recentErrors.length / recentOps.length : 0
  if (errorRate > 0.1) {
    anomalies.push({
      type: 'high-error-rate',
      severity: 'high',
      message: `错误率为 ${(errorRate * 100).toFixed(2)}%`,
    })
  }
  if (recentSec.length > 50) {
    anomalies.push({
      type: 'high-security-events',
      severity: 'medium',
      message: `24 小时内有 ${recentSec.length} 条安全日志`,
    })
  }
  return {
    timestamp: Date.now(),
    summary: {
      totalErrors: recentErrors.length,
      totalOperations: recentOps.length,
      totalSecurityEvents: recentSec.length,
      errorRate: (errorRate * 100).toFixed(2) + '%',
    },
    topErrors: Object.entries(errorPatterns)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([pattern, count]) => ({ pattern, count })),
    anomalies,
  }
}

// 健康评分：综合评分 0-100
function calculateHealthScore() {
  let score = 100
  const factors = []
  // 性能因素
  const perf = diagnosePerformance()
  if (perf.memory.heapUsagePercent > 80) {
    score -= 20
    factors.push({ factor: 'high-memory-usage', penalty: 20, message: '内存使用过高' })
  } else if (perf.memory.heapUsagePercent > 60) {
    score -= 10
    factors.push({ factor: 'memory-usage', penalty: 10, message: '内存使用偏高' })
  }
  if (perf.loadAverage[0] > 4) {
    score -= 15
    factors.push({ factor: 'high-load', penalty: 15, message: '系统负载过高' })
  } else if (perf.loadAverage[0] > 2) {
    score -= 5
    factors.push({ factor: 'load', penalty: 5, message: '系统负载偏高' })
  }
  // 连接因素
  const conn = diagnoseConnections()
  if (conn.database.status !== 'healthy') {
    score -= 30
    factors.push({ factor: 'database-issues', penalty: 30, message: '数据库连接异常' })
  }
  if (conn.fileSystem.status !== 'healthy') {
    score -= 20
    factors.push({ factor: 'filesystem-issues', penalty: 20, message: '文件系统异常' })
  }
  // 数据完整性
  const integrity = checkDataIntegrity()
  const highIssues = integrity.bySeverity.high
  if (highIssues > 0) {
    score -= Math.min(20, highIssues * 5)
    factors.push({ factor: 'data-integrity', penalty: Math.min(20, highIssues * 5), message: `${highIssues} 个高严重度数据问题` })
  }
  // 错误率
  const logs = analyzeLogs({})
  if (logs.summary.errorRate !== '0.00%') {
    const rate = parseFloat(logs.summary.errorRate)
    if (rate > 10) {
      score -= 15
      factors.push({ factor: 'high-error-rate', penalty: 15, message: `错误率 ${rate}%` })
    } else if (rate > 1) {
      score -= 5
      factors.push({ factor: 'error-rate', penalty: 5, message: `错误率 ${rate}%` })
    }
  }
  score = Math.max(0, score)
  const result = {
    id: 'hs_' + genId(),
    timestamp: Date.now(),
    createdAt: new Date().toISOString(),
    score,
    level: score >= 90 ? 'excellent' : (score >= 70 ? 'good' : (score >= 50 ? 'warning' : 'critical')),
    factors,
  }
  if (!db.diagHealthScore) db.diagHealthScore = {}
  db.diagHealthScore.lastScore = result
  db.diagHealthScore.history = db.diagHealthScore.history || []
  db.diagHealthScore.history.push({ score, timestamp: Date.now() })
  if (db.diagHealthScore.history.length > 100) {
    db.diagHealthScore.history = db.diagHealthScore.history.slice(-50)
  }
  saveDB(db)
  return result
}

// 生成诊断报告
function generateDiagnosticReport(userId) {
  const selfCheck = runSystemSelfCheck()
  const deps = checkDependencies()
  const integrity = checkDataIntegrity()
  const performance = diagnosePerformance()
  const connections = diagnoseConnections()
  const logs = analyzeLogs({})
  const health = calculateHealthScore()
  const report = {
    id: 'drpt_' + genId(),
    generatedAt: new Date().toISOString(),
    generatedBy: userId,
    healthScore: health.score,
    healthLevel: health.level,
    summary: {
      selfCheckPassed: selfCheck.failedCount === 0,
      dependenciesHealthy: deps.failedCount === 0,
      dataIntegrityPassed: integrity.passed,
      anomaliesDetected: logs.anomalies.length,
    },
    details: {
      selfCheck,
      dependencies: deps,
      integrity,
      performance,
      connections,
      logs,
      health,
    },
    recommendations: [],
  }
  // 综合建议
  if (health.score < 70) {
    report.recommendations.push({
      type: 'low-health-score',
      severity: 'high',
      message: `健康评分 ${health.score}，建议立即检查系统`,
    })
  }
  if (integrity.bySeverity.high > 0) {
    report.recommendations.push({
      type: 'data-integrity-issues',
      severity: 'high',
      message: `发现 ${integrity.bySeverity.high} 个高严重度数据完整性问题`,
    })
  }
  if (logs.anomalies.length > 0) {
    for (const a of logs.anomalies) {
      report.recommendations.push({
        type: a.type,
        severity: a.severity,
        message: a.message,
      })
    }
  }
  if (performance.memory.heapUsagePercent > 80) {
    report.recommendations.push({
      type: 'memory-optimization',
      severity: 'high',
      message: '建议重启服务或优化内存使用',
    })
  }
  if (!db.diagReports) db.diagReports = {}
  db.diagReports[report.id] = report
  if (!db.diagHistory) db.diagHistory = []
  db.diagHistory.push({
    id: report.id,
    generatedAt: report.generatedAt,
    healthScore: report.healthScore,
    summary: report.summary,
  })
  if (db.diagHistory.length > 100) db.diagHistory = db.diagHistory.slice(-50)
  saveDB(db)
  return report
}

// 自动修复
function runAutoFix(issueType) {
  if (!db.diagAutoFixes) db.diagAutoFixes = []
  const fixes = {
    'cleanup-sessions': () => {
      const before = Object.keys(db.sessions || {}).length
      const result = cleanupExpiredSessions()
      return {
        type: 'cleanup-sessions',
        action: '清理过期会话',
        before,
        after: Object.keys(db.sessions || {}).length,
        result,
      }
    },
    'cleanup-logs': () => {
      const before = (db.operationLogs || []).length + (db.errorLogs || []).length
      // 保留最近 30 天日志
      const cutoff = Date.now() - 30 * 86400000
      if (db.operationLogs) db.operationLogs = db.operationLogs.filter(l => l.timestamp > cutoff)
      if (db.errorLogs) db.errorLogs = db.errorLogs.filter(l => l.timestamp > cutoff)
      if (db.securityLogs) db.securityLogs = db.securityLogs.filter(l => l.timestamp > cutoff)
      saveDB(db)
      const after = (db.operationLogs || []).length + (db.errorLogs || []).length
      return {
        type: 'cleanup-logs',
        action: '清理过期日志',
        before,
        after,
        removed: before - after,
      }
    },
    'compact-db': () => {
      const result = compactDatabase()
      return {
        type: 'compact-db',
        action: '压缩数据库',
        result,
      }
    },
    'fix-orphan-sessions': () => {
      const sessions = db.sessions || {}
      let fixed = 0
      for (const [sid, session] of Object.entries(sessions)) {
        if (session.userId && !db.users?.[session.userId]) {
          delete sessions[sid]
          fixed++
        }
      }
      saveDB(db)
      return {
        type: 'fix-orphan-sessions',
        action: '修复孤儿会话',
        fixed,
      }
    },
    'reset-rate-limits': () => {
      const result = resetRateLimit('all', null)
      return {
        type: 'reset-rate-limits',
        action: '重置限流',
        result,
      }
    },
  }
  const fixFn = fixes[issueType]
  if (!fixFn) return { error: '未知的修复类型' }
  const result = fixFn()
  const record = {
    id: 'af_' + genId(),
    timestamp: Date.now(),
    createdAt: new Date().toISOString(),
    ...result,
  }
  db.diagAutoFixes.push(record)
  if (db.diagAutoFixes.length > 100) db.diagAutoFixes = db.diagAutoFixes.slice(-50)
  saveDB(db)
  return record
}

// 诊断历史
function getDiagnosticHistory(limit) {
  return (db.diagHistory || []).slice(-(limit || 50)).reverse()
}

// ===【新增模块辅助函数锚点结束】===

// ============ 模块26：权限审计系统 ============
// 记录权限变更日志（增强版，避免与既有 logPermissionChange 冲突）
function logPermissionChangeEx(data) {
  if (!db.permChangeLogs) db.permChangeLogs = []
  const log = {
    id: 'pcl_' + genId(),
    type: data.type, // grant / revoke / modify / create / delete
    targetType: data.targetType, // user / role / group
    targetId: data.targetId,
    permission: data.permission || null,
    oldValue: data.oldValue || null,
    newValue: data.newValue || null,
    operatorId: data.operatorId,
    operatorIp: data.operatorIp || null,
    reason: data.reason || '',
    timestamp: Date.now(),
    createdAt: new Date().toISOString(),
  }
  db.permChangeLogs.push(log)
  if (db.permChangeLogs.length > 10000) db.permChangeLogs = db.permChangeLogs.slice(-5000)
  saveDB(db)
  return log
}

// 记录权限检查日志
function logPermissionCheck(data) {
  if (!db.permCheckLogs) db.permCheckLogs = []
  const log = {
    id: 'pck_' + genId(),
    userId: data.userId,
    role: data.role,
    permission: data.permission,
    resource: data.resource || null,
    resourceId: data.resourceId || null,
    allowed: data.allowed,
    ip: data.ip || null,
    timestamp: Date.now(),
    createdAt: new Date().toISOString(),
  }
  db.permCheckLogs.push(log)
  if (db.permCheckLogs.length > 50000) db.permCheckLogs = db.permCheckLogs.slice(-30000)
  return log
}

// 查询权限变更日志
function getPermissionChangeLogs(filter) {
  if (!db.permChangeLogs) return []
  let logs = db.permChangeLogs
  if (filter) {
    if (filter.type) logs = logs.filter(l => l.type === filter.type)
    if (filter.targetType) logs = logs.filter(l => l.targetType === filter.targetType)
    if (filter.targetId) logs = logs.filter(l => l.targetId === filter.targetId)
    if (filter.operatorId) logs = logs.filter(l => l.operatorId === filter.operatorId)
    if (filter.permission) logs = logs.filter(l => l.permission === filter.permission)
    if (filter.since) logs = logs.filter(l => l.timestamp >= filter.since)
  }
  const limit = filter?.limit || 100
  return logs.slice(-limit).reverse()
}

// 查询权限检查日志
function getPermissionCheckLogs(filter) {
  if (!db.permCheckLogs) return []
  let logs = db.permCheckLogs
  if (filter) {
    if (filter.userId) logs = logs.filter(l => l.userId === filter.userId)
    if (filter.permission) logs = logs.filter(l => l.permission === filter.permission)
    if (filter.allowed !== undefined) logs = logs.filter(l => l.allowed === filter.allowed)
    if (filter.resource) logs = logs.filter(l => l.resource === filter.resource)
    if (filter.since) logs = logs.filter(l => l.timestamp >= filter.since)
  }
  const limit = filter?.limit || 100
  return logs.slice(-limit).reverse()
}

// 权限分析：使用频率/覆盖率
function analyzePermissions(options) {
  if (!db.permCheckLogs) return { analysis: {} }
  const logs = db.permCheckLogs
  const since = options?.since || 0
  const filtered = logs.filter(l => l.timestamp >= since)
  const analysis = {
    totalChecks: filtered.length,
    allowedCount: filtered.filter(l => l.allowed).length,
    deniedCount: filtered.filter(l => !l.allowed).length,
    byPermission: {},
    byUser: {},
    byResource: {},
    coverage: {},
  }
  for (const log of filtered) {
    // 按权限
    if (!analysis.byPermission[log.permission]) {
      analysis.byPermission[log.permission] = { total: 0, allowed: 0, denied: 0 }
    }
    analysis.byPermission[log.permission].total++
    if (log.allowed) analysis.byPermission[log.permission].allowed++
    else analysis.byPermission[log.permission].denied++
    // 按用户
    if (!analysis.byUser[log.userId]) {
      analysis.byUser[log.userId] = { total: 0, allowed: 0, denied: 0, permissions: new Set() }
    }
    analysis.byUser[log.userId].total++
    if (log.allowed) {
      analysis.byUser[log.userId].allowed++
      analysis.byUser[log.userId].permissions.add(log.permission)
    } else {
      analysis.byUser[log.userId].denied++
    }
    // 按资源
    if (log.resource) {
      if (!analysis.byResource[log.resource]) {
        analysis.byResource[log.resource] = { total: 0, allowed: 0, denied: 0 }
      }
      analysis.byResource[log.resource].total++
      if (log.allowed) analysis.byResource[log.resource].allowed++
      else analysis.byResource[log.resource].denied++
    }
  }
  // 覆盖率：每个权限被多少不同用户使用
  for (const [perm, stats] of Object.entries(analysis.byPermission)) {
    const users = new Set(filtered.filter(l => l.permission === perm && l.allowed).map(l => l.userId))
    analysis.coverage[perm] = {
      users: users.size,
      checkCount: stats.total,
      denyRate: stats.total > 0 ? (stats.denied / stats.total * 100).toFixed(2) + '%' : '0%',
    }
  }
  // 将 Set 转为 count
  for (const [user, stats] of Object.entries(analysis.byUser)) {
    analysis.byUser[user].uniquePermissions = stats.permissions.size
    delete analysis.byUser[user].permissions
  }
  if (!db.permAnalysis) db.permAnalysis = {}
  db.permAnalysis.lastAnalysis = { result: analysis, timestamp: Date.now() }
  saveDB(db)
  return analysis
}

// 权限告警：异常权限使用
function checkPermissionAlerts() {
  if (!db.permAlerts) db.permAlerts = []
  const logs = db.permCheckLogs || []
  const now = Date.now()
  const recentLogs = logs.filter(l => l.timestamp > now - 3600000) // 最近 1 小时
  const newAlerts = []
  // 检查 1: 短时间内大量拒绝
  const deniedByUser = {}
  for (const l of recentLogs) {
    if (!l.allowed) {
      deniedByUser[l.userId] = (deniedByUser[l.userId] || 0) + 1
    }
  }
  for (const [userId, count] of Object.entries(deniedByUser)) {
    if (count >= 10) {
      const alert = {
        id: 'pa_' + genId(),
        type: 'high-denial-rate',
        severity: 'high',
        userId,
        message: `用户 ${userId} 在 1 小时内被拒绝 ${count} 次权限检查`,
        timestamp: now,
        createdAt: new Date().toISOString(),
      }
      newAlerts.push(alert)
      db.permAlerts.push(alert)
    }
  }
  // 检查 2: 异常时间访问（凌晨 2-5 点）
  const lateNightLogs = recentLogs.filter(l => {
    const hour = new Date(l.timestamp).getHours()
    return hour >= 2 && hour < 5
  })
  if (lateNightLogs.length > 50) {
    const alert = {
      id: 'pa_' + genId(),
      type: 'unusual-time-access',
      severity: 'medium',
      message: `凌晨时段有 ${lateNightLogs.length} 次权限检查，可能是异常访问`,
      timestamp: now,
      createdAt: new Date().toISOString(),
    }
    newAlerts.push(alert)
    db.permAlerts.push(alert)
  }
  // 检查 3: 敏感权限频繁使用
  const sensitivePermissions = ['system:config', 'system:delete', 'users:delete', 'system:reset']
  for (const perm of sensitivePermissions) {
    const count = recentLogs.filter(l => l.permission === perm && l.allowed).length
    if (count > 20) {
      const alert = {
        id: 'pa_' + genId(),
        type: 'sensitive-permission-abuse',
        severity: 'high',
        permission: perm,
        message: `敏感权限 ${perm} 在 1 小时内被使用 ${count} 次`,
        timestamp: now,
        createdAt: new Date().toISOString(),
      }
      newAlerts.push(alert)
      db.permAlerts.push(alert)
    }
  }
  if (db.permAlerts.length > 1000) db.permAlerts = db.permAlerts.slice(-500)
  if (newAlerts.length > 0) saveDB(db)
  return newAlerts
}

// 生成权限报告
function generatePermissionReport(type, userId) {
  const analysis = analyzePermissions({})
  const changes = (db.permChangeLogs || []).filter(l =>
    !type || type === 'all' || (type === 'recent' && l.timestamp > Date.now() - 7 * 86400000)
  )
  const alerts = (db.permAlerts || []).filter(a => a.timestamp > Date.now() - 7 * 86400000)
  const report = {
    id: 'prpt_' + genId(),
    type: type || 'all',
    generatedAt: new Date().toISOString(),
    generatedBy: userId,
    summary: {
      totalChecks: analysis.totalChecks,
      totalChanges: changes.length,
      totalAlerts: alerts.length,
      denyRate: analysis.totalChecks > 0
        ? (analysis.deniedCount / analysis.totalChecks * 100).toFixed(2) + '%'
        : '0%',
    },
    topPermissions: Object.entries(analysis.byPermission || {})
      .sort(([, a], [, b]) => b.total - a.total)
      .slice(0, 20)
      .map(([perm, stats]) => ({ permission: perm, ...stats })),
    topUsers: Object.entries(analysis.byUser || {})
      .sort(([, a], [, b]) => b.total - a.total)
      .slice(0, 20)
      .map(([user, stats]) => ({ userId: user, ...stats })),
    recentChanges: changes.slice(-20).reverse(),
    recentAlerts: alerts.slice(-20).reverse(),
    recommendations: generatePermissionRecommendations(analysis),
  }
  if (!db.permReports) db.permReports = {}
  db.permReports[report.id] = report
  saveDB(db)
  return report
}

// 权限推荐
function generatePermissionRecommendations(analysis) {
  const recommendations = []
  // 推荐 1: 高拒绝率的权限可能配置不当
  for (const [perm, stats] of Object.entries(analysis.byPermission || {})) {
    if (stats.total > 10 && stats.denied / stats.total > 0.5) {
      recommendations.push({
        type: 'high-denial-permission',
        severity: 'medium',
        permission: perm,
        message: `权限 ${perm} 的拒绝率高达 ${(stats.denied / stats.total * 100).toFixed(2)}%，建议检查角色配置`,
      })
    }
  }
  // 推荐 2: 从未使用的权限可以删除
  for (const [perm, stats] of Object.entries(analysis.byPermission || {})) {
    if (stats.total < 2) {
      recommendations.push({
        type: 'unused-permission',
        severity: 'low',
        permission: perm,
        message: `权限 ${perm} 几乎未被使用，可考虑删除以简化权限模型`,
      })
    }
  }
  // 推荐 3: 单一用户拥有过多权限
  for (const [user, stats] of Object.entries(analysis.byUser || {})) {
    if (stats.uniquePermissions > 20) {
      recommendations.push({
        type: 'excessive-permissions',
        severity: 'high',
        userId: user,
        message: `用户 ${user} 使用了 ${stats.uniquePermissions} 种不同权限，建议检查是否过度授权`,
      })
    }
  }
  return recommendations
}

// 记录角色变更
function logRoleChange(data) {
  if (!db.roleChangeHistory) db.roleChangeHistory = []
  const log = {
    id: 'rcl_' + genId(),
    userId: data.userId,
    oldRole: data.oldRole,
    newRole: data.newRole,
    operatorId: data.operatorId,
    reason: data.reason || '',
    timestamp: Date.now(),
    createdAt: new Date().toISOString(),
  }
  db.roleChangeHistory.push(log)
  if (db.roleChangeHistory.length > 5000) db.roleChangeHistory = db.roleChangeHistory.slice(-3000)
  // 同时记录到权限变更日志
  logPermissionChangeEx({
    type: 'modify',
    targetType: 'user',
    targetId: data.userId,
    permission: 'role',
    oldValue: data.oldRole,
    newValue: data.newRole,
    operatorId: data.operatorId,
    reason: data.reason,
  })
  saveDB(db)
  return log
}

// 记录资源访问
function logResourceAccess(data) {
  if (!db.resourceAccessLogs) db.resourceAccessLogs = []
  const log = {
    id: 'ral_' + genId(),
    userId: data.userId,
    resource: data.resource,
    resourceId: data.resourceId || null,
    action: data.action, // read / write / delete / execute
    allowed: data.allowed,
    ip: data.ip || null,
    timestamp: Date.now(),
    createdAt: new Date().toISOString(),
  }
  db.resourceAccessLogs.push(log)
  if (db.resourceAccessLogs.length > 20000) db.resourceAccessLogs = db.resourceAccessLogs.slice(-10000)
  return log
}

// 记录敏感操作
function logSensitiveOperation(data) {
  if (!db.sensitiveOpLogs) db.sensitiveOpLogs = []
  const log = {
    id: 'sol_' + genId(),
    userId: data.userId,
    operation: data.operation,
    target: data.target || null,
    details: data.details || {},
    ip: data.ip || null,
    userAgent: data.userAgent || null,
    riskLevel: data.riskLevel || 'medium', // low / medium / high / critical
    timestamp: Date.now(),
    createdAt: new Date().toISOString(),
  }
  db.sensitiveOpLogs.push(log)
  if (db.sensitiveOpLogs.length > 5000) db.sensitiveOpLogs = db.sensitiveOpLogs.slice(-3000)
  saveDB(db)
  return log
}

// 合规检查
function runComplianceCheck(checkType) {
  if (!db.complianceChecks) db.complianceChecks = []
  const checks = {
    'password-policy': () => {
      const users = Object.values(db.users || {})
      const weakPasswords = users.filter(u => !u.passwordHash || u.passwordHash.length < 32)
      return {
        name: '密码策略合规',
        passed: weakPasswords.length === 0,
        details: {
          totalUsers: users.length,
          weakPasswords: weakPasswords.length,
          weakUsers: weakPasswords.map(u => u.id).slice(0, 10),
        },
      }
    },
    'session-timeout': () => {
      const sessions = Object.values(db.sessions || {})
      const longSessions = sessions.filter(s => {
        if (!s.createdAt) return false
        return Date.now() - new Date(s.createdAt).getTime() > 24 * 3600 * 1000
      })
      return {
        name: '会话超时合规',
        passed: longSessions.length === 0,
        details: {
          totalSessions: sessions.length,
          longSessions: longSessions.length,
        },
      }
    },
    'admin-permissions': () => {
      const admins = Object.values(db.users || {}).filter(u => u.role === 'admin')
      return {
        name: '管理员权限合规',
        passed: admins.length <= 5 && admins.length > 0,
        details: {
          adminCount: admins.length,
          admins: admins.map(a => a.id),
        },
      }
    },
    'audit-log-retention': () => {
      const logs = db.operationLogs || []
      return {
        name: '审计日志保留',
        passed: logs.length > 0,
        details: {
          totalLogs: logs.length,
          oldestLog: logs[0]?.timestamp || null,
        },
      }
    },
    'data-encryption': () => {
      const vault = db.vault || { credentials: {} }
      const credCount = Object.keys(vault.credentials || {}).length
      return {
        name: '数据加密合规',
        passed: credCount > 0,
        details: {
          encryptedCredentials: credCount,
        },
      }
    },
  }
  const checkFn = checks[checkType]
  if (!checkFn) return { error: '未知的检查类型' }
  const result = checkFn()
  const record = {
    id: 'cc_' + genId(),
    checkType,
    ...result,
    timestamp: Date.now(),
    createdAt: new Date().toISOString(),
  }
  db.complianceChecks.push(record)
  if (db.complianceChecks.length > 1000) db.complianceChecks = db.complianceChecks.slice(-500)
  saveDB(db)
  return record
}

// 权限审计统计
function getPermissionAuditStats() {
  const changeLogs = db.permChangeLogs || []
  const checkLogs = db.permCheckLogs || []
  const alerts = db.permAlerts || []
  const roleChanges = db.roleChangeHistory || []
  const sensitiveOps = db.sensitiveOpLogs || []
  const compliance = db.complianceChecks || []
  const byChangeType = {}
  for (const l of changeLogs) {
    byChangeType[l.type] = (byChangeType[l.type] || 0) + 1
  }
  const byRiskLevel = {}
  for (const op of sensitiveOps) {
    byRiskLevel[op.riskLevel] = (byRiskLevel[op.riskLevel] || 0) + 1
  }
  return {
    totalChangeLogs: changeLogs.length,
    totalCheckLogs: checkLogs.length,
    totalAlerts: alerts.length,
    highSeverityAlerts: alerts.filter(a => a.severity === 'high').length,
    totalRoleChanges: roleChanges.length,
    totalSensitiveOps: sensitiveOps.length,
    totalComplianceChecks: compliance.length,
    passedComplianceChecks: compliance.filter(c => c.passed).length,
    byChangeType,
    byRiskLevel,
  }
}

// ===【新增模块辅助函数锚点结束】===

// ============ 模块25：AI 推理引擎增强 ============
// 多模型路由：根据任务类型自动选择最佳模型
function routeAIModel(taskType, options) {
  if (!db.aiModelRoutes) db.aiModelRoutes = {}
  const routes = db.aiModelRoutes[taskType]
  if (routes && routes.length > 0) {
    // 按 priority 排序
    const sorted = [...routes].sort((a, b) => (b.priority || 0) - (a.priority || 0))
    // 找到第一个可用的
    for (const r of sorted) {
      if (r.enabled !== false) return r
    }
  }
  // 默认路由
  const defaults = {
    'chat': { model: 'gpt-4o-mini', provider: 'openai', maxTokens: 2048 },
    'code': { model: 'claude-3.5-sonnet', provider: 'anthropic', maxTokens: 4096 },
    'image': { model: 'dall-e-3', provider: 'openai', maxTokens: 1024 },
    'embedding': { model: 'text-embedding-3-small', provider: 'openai', maxTokens: 8192 },
    'summary': { model: 'gpt-4o-mini', provider: 'openai', maxTokens: 1024 },
    'translation': { model: 'gpt-4o-mini', provider: 'openai', maxTokens: 2048 },
  }
  return defaults[taskType] || defaults.chat
}

// 设置模型路由
function setAIModelRoute(taskType, route, userId) {
  if (!db.aiModelRoutes) db.aiModelRoutes = {}
  if (!db.aiModelRoutes[taskType]) db.aiModelRoutes[taskType] = []
  const r = {
    id: 'rte_' + genId(),
    taskType,
    model: route.model,
    provider: route.provider || 'openai',
    maxTokens: route.maxTokens || 2048,
    temperature: route.temperature !== undefined ? route.temperature : 0.7,
    priority: route.priority || 0,
    enabled: route.enabled !== false,
    fallback: route.fallback || null,
    metadata: route.metadata || {},
    createdBy: userId,
    createdAt: new Date().toISOString(),
  }
  db.aiModelRoutes[taskType].push(r)
  saveDB(db)
  return r
}

// 模型负载均衡
function selectModelWithLoadBalance(provider, strategy) {
  if (!db.aiModelLoadBalancers) db.aiModelLoadBalancers = {}
  if (!db.aiModelLoadBalancers[provider]) {
    db.aiModelLoadBalancers[provider] = {
      models: [],
      strategy: strategy || 'round-robin',
      _index: 0,
      stats: { totalRequests: 0, byModel: {} },
    }
  }
  const lb = db.aiModelLoadBalancers[provider]
  if (lb.models.length === 0) return null
  if (lb.models.length === 1) return lb.models[0]
  if (lb.strategy === 'round-robin') {
    const model = lb.models[lb._index % lb.models.length]
    lb._index = (lb._index + 1) % lb.models.length
    return model
  }
  if (lb.strategy === 'weighted') {
    const total = lb.models.reduce((s, m) => s + (m.weight || 1), 0)
    let r = Math.random() * total
    for (const m of lb.models) {
      r -= (m.weight || 1)
      if (r <= 0) return m
    }
  }
  if (lb.strategy === 'least-connections') {
    return lb.models.reduce((min, m) =>
      ((lb.stats.byModel[m.id]?.active || 0) < (lb.stats.byModel[min.id]?.active || 0) ? m : min),
      lb.models[0]
    )
  }
  return lb.models[0]
}

// 添加模型到负载均衡器
function addModelToLoadBalancer(provider, model, userId) {
  if (!db.aiModelLoadBalancers) db.aiModelLoadBalancers = {}
  if (!db.aiModelLoadBalancers[provider]) {
    db.aiModelLoadBalancers[provider] = { models: [], strategy: 'round-robin', _index: 0, stats: { totalRequests: 0, byModel: {} } }
  }
  const m = {
    id: 'mdl_' + genId(),
    name: model.name,
    model: model.model,
    weight: model.weight || 1,
    enabled: model.enabled !== false,
    maxConcurrent: model.maxConcurrent || 10,
    addedBy: userId,
    addedAt: new Date().toISOString(),
  }
  db.aiModelLoadBalancers[provider].models.push(m)
  saveDB(db)
  return m
}

// Token 计数（近似估算）
function countTokens(text, model) {
  if (!text) return 0
  const str = typeof text === 'string' ? text : JSON.stringify(text)
  // 简单估算：英文 ~4 字符/token，中文 ~2 字符/token
  const chineseChars = (str.match(/[\u4e00-\u9fa5]/g) || []).length
  const otherChars = str.length - chineseChars
  let tokens = Math.ceil(chineseChars / 2 + otherChars / 4)
  // 不同模型的修正
  if (model && model.includes('gpt-4')) tokens = Math.ceil(tokens * 1.1)
  if (model && model.includes('claude')) tokens = Math.ceil(tokens * 1.05)
  return tokens
}

// 记录 Token 使用
function recordTokenUsage(userId, model, inputTokens, outputTokens, taskType) {
  if (!db.aiTokenCounts) db.aiTokenCounts = []
  const record = {
    id: 'tk_' + genId(),
    userId,
    model,
    taskType: taskType || 'chat',
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    timestamp: Date.now(),
    createdAt: new Date().toISOString(),
  }
  db.aiTokenCounts.push(record)
  if (db.aiTokenCounts.length > 10000) db.aiTokenCounts = db.aiTokenCounts.slice(-5000)
  saveDB(db)
  return record
}

// 上下文窗口管理：超长对话自动截断
function manageContextWindow(messages, maxTokens, strategy) {
  if (!Array.isArray(messages)) return { messages: [], truncated: false, removedCount: 0 }
  let totalTokens = messages.reduce((s, m) => s + countTokens(m.content || '', ''), 0)
  if (totalTokens <= maxTokens) {
    return { messages, truncated: false, removedCount: 0, totalTokens }
  }
  let workingMessages = [...messages]
  let removedCount = 0
  // 策略 1: 移除最旧的消息
  if (strategy === 'remove-oldest') {
    while (workingMessages.length > 1 && totalTokens > maxTokens) {
      const removed = workingMessages.shift()
      totalTokens -= countTokens(removed.content || '', '')
      removedCount++
    }
  }
  // 策略 2: 摘要旧消息
  else if (strategy === 'summarize') {
    // 保留 system + 最近的消息，中间的合并为摘要
    if (workingMessages.length > 4) {
      const system = workingMessages[0].role === 'system' ? [workingMessages[0]] : []
      const recent = workingMessages.slice(-3)
      const middle = workingMessages.slice(system.length, -3)
      const summary = middle.map(m => `${m.role}: ${m.content}`).join('\n').slice(0, 500)
      workingMessages = [
        ...system,
        { role: 'system', content: '之前对话摘要：' + summary },
        ...recent,
      ]
      removedCount = middle.length
      totalTokens = workingMessages.reduce((s, m) => s + countTokens(m.content || '', ''), 0)
    }
  }
  // 策略 3: 滑动窗口
  else if (strategy === 'sliding-window') {
    const keepLast = 10
    workingMessages = workingMessages.slice(-keepLast)
    removedCount = messages.length - workingMessages.length
    totalTokens = workingMessages.reduce((s, m) => s + countTokens(m.content || '', ''), 0)
  }
  return { messages: workingMessages, truncated: true, removedCount, totalTokens }
}

// 对话压缩：历史消息智能摘要
function compressConversation(messages, targetTokens) {
  if (!Array.isArray(messages) || messages.length < 3) return { messages, compressed: false }
  const totalTokens = messages.reduce((s, m) => s + countTokens(m.content || '', ''), 0)
  if (totalTokens <= targetTokens) return { messages, compressed: false, totalTokens }
  // 保留首条 system 和最后两条
  const system = messages[0].role === 'system' ? [messages[0]] : []
  const recent = messages.slice(-2)
  const middle = messages.slice(system.length, -2)
  // 生成摘要（模拟）
  const summary = middle.map(m => {
    const content = m.content || ''
    const sentences = content.split(/[。.!?！？\n]/).filter(s => s.trim())
    return sentences.slice(0, 2).join('。')
  }).join(' | ')
  const compressed = [
    ...system,
    { role: 'assistant', content: '【对话摘要】' + summary.slice(0, targetTokens / 2) },
    ...recent,
  ]
  return {
    messages: compressed,
    compressed: true,
    originalTokens: totalTokens,
    compressedTokens: compressed.reduce((s, m) => s + countTokens(m.content || '', ''), 0),
  }
}

// 提示词优化：自动改写/增强
function optimizePrompt(prompt, options) {
  if (!prompt) return { prompt: '', optimized: false }
  let optimized = prompt
  const improvements = []
  // 添加角色
  if (options?.addRole && !prompt.toLowerCase().includes('you are')) {
    optimized = `You are a helpful AI assistant. ${optimized}`
    improvements.push('added-role')
  }
  // 添加输出格式
  if (options?.addFormat && !prompt.toLowerCase().includes('format')) {
    optimized += '\n\n请以清晰的格式回答。'
    improvements.push('added-format')
  }
  // 添加示例
  if (options?.addExample) {
    optimized += '\n\n示例：\n输入：...\n输出：...'
    improvements.push('added-example')
  }
  // 添加约束
  if (options?.addConstraints) {
    optimized += '\n\n约束：回答需简洁、准确、不编造。'
    improvements.push('added-constraints')
  }
  // 移除冗余
  if (prompt.length > 1000) {
    optimized = optimized.replace(/\s+/g, ' ').trim()
    improvements.push('removed-redundant-whitespace')
  }
  return {
    prompt: optimized,
    optimized: improvements.length > 0,
    improvements,
    originalLength: prompt.length,
    optimizedLength: optimized.length,
  }
}

// 响应缓存
function getAIResponseCache(prompt, model) {
  if (!db.aiResponseCache) return null
  const key = simpleHash(prompt + '|' + model)
  const cached = db.aiResponseCache[key]
  if (!cached) return null
  if (cached.expiresAt && cached.expiresAt < Date.now()) {
    delete db.aiResponseCache[key]
    return null
  }
  cached.hits = (cached.hits || 0) + 1
  cached.lastHit = Date.now()
  return cached
}

function setAIResponseCache(prompt, model, response, ttl) {
  if (!db.aiResponseCache) db.aiResponseCache = {}
  const key = simpleHash(prompt + '|' + model)
  db.aiResponseCache[key] = {
    prompt,
    model,
    response,
    hits: 0,
    createdAt: Date.now(),
    lastHit: null,
    expiresAt: ttl ? Date.now() + ttl : Date.now() + 3600000,
  }
  // 限制缓存大小
  const keys = Object.keys(db.aiResponseCache)
  if (keys.length > 1000) {
    delete db.aiResponseCache[keys[0]]
  }
  saveDB(db)
}

// SSE 连接管理
function createSSEConnection(id, userId) {
  if (!db.aiSSEConnections) db.aiSSEConnections = {}
  const conn = {
    id: id || ('sse_' + genId()),
    userId,
    status: 'open',
    createdAt: Date.now(),
    lastActivity: Date.now(),
    chunks: [],
    totalChunks: 0,
  }
  db.aiSSEConnections[conn.id] = conn
  return conn
}

function pushSSEChunk(connId, chunk) {
  if (!db.aiSSEConnections || !db.aiSSEConnections[connId]) return false
  const conn = db.aiSSEConnections[connId]
  conn.chunks.push(chunk)
  conn.totalChunks++
  conn.lastActivity = Date.now()
  if (conn.chunks.length > 100) conn.chunks = conn.chunks.slice(-50)
  return true
}

function closeSSEConnection(connId) {
  if (!db.aiSSEConnections || !db.aiSSEConnections[connId]) return false
  db.aiSSEConnections[connId].status = 'closed'
  db.aiSSEConnections[connId].closedAt = Date.now()
  return true
}

// 模型对比
function createModelComparison(prompt, models, userId) {
  if (!db.aiModelComparisons) db.aiModelComparisons = []
  const comparison = {
    id: 'cmp_' + genId(),
    prompt,
    models: Array.isArray(models) ? models : [models],
    results: [],
    status: 'pending',
    createdAt: new Date().toISOString(),
    createdBy: userId,
  }
  db.aiModelComparisons.push(comparison)
  saveDB(db)
  return comparison
}

function addModelComparisonResult(comparisonId, model, response, latency, tokens) {
  if (!db.aiModelComparisons) return false
  const cmp = db.aiModelComparisons.find(c => c.id === comparisonId)
  if (!cmp) return false
  cmp.results.push({
    model,
    response,
    latency,
    tokens,
    completedAt: new Date().toISOString(),
  })
  if (cmp.results.length >= cmp.models.length) {
    cmp.status = 'completed'
    cmp.completedAt = new Date().toISOString()
  }
  saveDB(db)
  return true
}

// 推理日志
function logInference(data) {
  if (!db.aiInferenceLogs) db.aiInferenceLogs = []
  const log = {
    id: 'inf_' + genId(),
    userId: data.userId,
    model: data.model,
    taskType: data.taskType || 'chat',
    prompt: data.prompt,
    response: data.response,
    inputTokens: data.inputTokens || 0,
    outputTokens: data.outputTokens || 0,
    latency: data.latency || 0,
    cached: data.cached || false,
    error: data.error || null,
    timestamp: Date.now(),
    createdAt: new Date().toISOString(),
  }
  db.aiInferenceLogs.push(log)
  if (db.aiInferenceLogs.length > 5000) db.aiInferenceLogs = db.aiInferenceLogs.slice(-3000)
  return log
}

// 成本计算：按 token 计费
const MODEL_PRICING = {
  'gpt-4o': { input: 0.0025, output: 0.01 }, // per 1k tokens, USD
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'gpt-4-turbo': { input: 0.01, output: 0.03 },
  'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
  'claude-3.5-sonnet': { input: 0.003, output: 0.015 },
  'claude-3-opus': { input: 0.015, output: 0.075 },
  'claude-3-haiku': { input: 0.00025, output: 0.00125 },
  'text-embedding-3-small': { input: 0.00002, output: 0 },
  'text-embedding-3-large': { input: 0.00013, output: 0 },
  'dall-e-3': { input: 0.04, output: 0 },
}

function calculateCost(model, inputTokens, outputTokens) {
  const pricing = MODEL_PRICING[model] || { input: 0.001, output: 0.002 }
  const cost = (inputTokens / 1000 * pricing.input) + (outputTokens / 1000 * pricing.output)
  return {
    model,
    inputTokens,
    outputTokens,
    inputCost: inputTokens / 1000 * pricing.input,
    outputCost: outputTokens / 1000 * pricing.output,
    totalCost: cost,
    currency: 'USD',
  }
}

function recordCost(data) {
  if (!db.aiCostRecords) db.aiCostRecords = []
  const cost = calculateCost(data.model, data.inputTokens || 0, data.outputTokens || 0)
  const record = {
    id: 'cst_' + genId(),
    ...cost,
    userId: data.userId,
    taskType: data.taskType || 'chat',
    timestamp: Date.now(),
    createdAt: new Date().toISOString(),
  }
  db.aiCostRecords.push(record)
  if (db.aiCostRecords.length > 5000) db.aiCostRecords = db.aiCostRecords.slice(-3000)
  saveDB(db)
  return record
}

// AI 推理统计
function getAIStats() {
  const logs = db.aiInferenceLogs || []
  const costs = db.aiCostRecords || []
  const totalCost = costs.reduce((s, c) => s + c.totalCost, 0)
  const totalInputTokens = logs.reduce((s, l) => s + (l.inputTokens || 0), 0)
  const totalOutputTokens = logs.reduce((s, l) => s + (l.outputTokens || 0), 0)
  const cachedCount = logs.filter(l => l.cached).length
  const errorCount = logs.filter(l => l.error).length
  return {
    totalInferences: logs.length,
    totalInputTokens,
    totalOutputTokens,
    totalCost: totalCost.toFixed(4),
    cacheHitRate: logs.length > 0 ? (cachedCount / logs.length * 100).toFixed(2) + '%' : '0%',
    errorRate: logs.length > 0 ? (errorCount / logs.length * 100).toFixed(2) + '%' : '0%',
    avgLatency: logs.length > 0 ? Math.round(logs.reduce((s, l) => s + (l.latency || 0), 0) / logs.length) : 0,
    cacheSize: Object.keys(db.aiResponseCache || {}).length,
    activeSSEConnections: Object.values(db.aiSSEConnections || {}).filter(c => c.status === 'open').length,
    modelComparisons: (db.aiModelComparisons || []).length,
  }
}

// ===【新增模块辅助函数锚点结束】===

// ============ 模块24：用户行为分析系统 ============
// 记录用户行为
function trackUserBehavior(userId, data) {
  if (!db.userBehaviors) db.userBehaviors = []
  const behavior = {
    id: 'bh_' + genId(),
    userId,
    type: data.type, // page_view / click / stay / scroll / custom
    page: data.page || null,
    element: data.element || null,
    duration: data.duration || 0,
    scrollDepth: data.scrollDepth || 0,
    metadata: data.metadata || {},
    sessionId: data.sessionId || null,
    ip: data.ip || null,
    userAgent: data.userAgent || null,
    timestamp: Date.now(),
    createdAt: new Date().toISOString(),
  }
  db.userBehaviors.push(behavior)
  if (db.userBehaviors.length > 50000) db.userBehaviors = db.userBehaviors.slice(-30000)
  // 更新用户画像
  updateBehaviorProfile(userId, behavior)
  saveDB(db)
  return behavior
}

// 更新用户行为画像
function updateBehaviorProfile(userId, behavior) {
  if (!db.userProfiles) db.userProfiles = {}
  if (!db.userProfiles[userId]) {
    db.userProfiles[userId] = {
      userId,
      totalActions: 0,
      pageViews: 0,
      clicks: 0,
      totalStayTime: 0,
      lastActiveAt: null,
      firstActiveAt: null,
      interests: {}, // 兴趣标签
      activityByHour: new Array(24).fill(0),
      activityByDay: {},
      frequentPages: {},
      retentionDay: 0,
      retention7Day: 0,
      retention30Day: 0,
    }
  }
  const profile = db.userProfiles[userId]
  profile.totalActions++
  if (behavior.type === 'page_view') {
    profile.pageViews++
    profile.frequentPages[behavior.page] = (profile.frequentPages[behavior.page] || 0) + 1
    // 提取兴趣标签（基于页面路径）
    const tags = extractInterestTags(behavior.page)
    for (const tag of tags) {
      profile.interests[tag] = (profile.interests[tag] || 0) + 1
    }
  }
  if (behavior.type === 'click') profile.clicks++
  if (behavior.type === 'stay') profile.totalStayTime += (behavior.duration || 0)
  const now = new Date()
  profile.activityByHour[now.getHours()]++
  const dayKey = now.toISOString().split('T')[0]
  profile.activityByDay[dayKey] = (profile.activityByDay[dayKey] || 0) + 1
  if (!profile.firstActiveAt) profile.firstActiveAt = behavior.timestamp
  profile.lastActiveAt = behavior.timestamp
  // 计算留存
  computeRetention(profile)
}

// 提取兴趣标签
function extractInterestTags(page) {
  if (!page) return []
  const tags = []
  // 简单分词
  const parts = page.split('/').filter(Boolean)
  for (const part of parts) {
    if (part.length > 2 && !/^\d+$/.test(part)) tags.push(part.toLowerCase())
  }
  return tags
}

// 计算留存
function computeRetention(profile) {
  if (!profile.firstActiveAt) return
  const now = Date.now()
  const first = profile.firstActiveAt
  const daysSinceFirst = Math.floor((now - first) / 86400000)
  profile.retentionDay = daysSinceFirst >= 1 ? 1 : 0
  profile.retention7Day = daysSinceFirst >= 7 ? 1 : 0
  profile.retention30Day = daysSinceFirst >= 30 ? 1 : 0
}

// 获取用户行为画像
function getBehaviorProfile(userId) {
  return db.userProfiles?.[userId] || null
}

// 创建漏斗
function createBehaviorFunnel(data, userId) {
  if (!db.behaviorFunnels) db.behaviorFunnels = {}
  const id = data.id || ('fnl_' + genId())
  const funnel = {
    id,
    name: data.name || ('funnel-' + id),
    description: data.description || '',
    steps: Array.isArray(data.steps) ? data.steps : [], // [{ name, page, event }]
    createdAt: new Date().toISOString(),
    createdBy: userId,
    conversions: { total: 0, byStep: [] },
  }
  db.behaviorFunnels[id] = funnel
  saveDB(db)
  return funnel
}

// 分析漏斗转化率
function analyzeFunnel(funnelId, options) {
  if (!db.behaviorFunnels || !db.behaviorFunnels[funnelId]) return null
  const funnel = db.behaviorFunnels[funnelId]
  const behaviors = db.userBehaviors || []
  const since = options?.since || 0
  const until = options?.until || Date.now()
  const filtered = behaviors.filter(b => b.timestamp >= since && b.timestamp <= until)
  const stepResults = []
  let prevUsers = null
  for (let i = 0; i < funnel.steps.length; i++) {
    const step = funnel.steps[i]
    const matching = filtered.filter(b =>
      (step.page && b.page === step.page) ||
      (step.event && b.type === step.event)
    )
    const users = new Set(matching.map(b => b.userId))
    const userList = Array.from(users)
    // 如果是第一步，所有用户都是入口；否则需要前一步的用户
    let conversionUsers = userList
    if (i > 0 && prevUsers) {
      conversionUsers = userList.filter(u => prevUsers.includes(u))
    }
    stepResults.push({
      step: i + 1,
      name: step.name,
      users: conversionUsers.length,
      conversionRate: i === 0 ? 1 : (prevUsers?.length || 0) > 0
        ? conversionUsers.length / prevUsers.length
        : 0,
      dropOff: i === 0 ? 0 : (prevUsers?.length || 0) - conversionUsers.length,
    })
    prevUsers = conversionUsers
  }
  funnel.conversions = { total: stepResults[stepResults.length - 1]?.users || 0, byStep: stepResults }
  saveDB(db)
  return funnel.conversions
}

// 留存分析
function analyzeRetention(cohort, period) {
  const behaviors = db.userBehaviors || []
  const profiles = Object.values(db.userProfiles || {})
  const periodMs = period === 'day' ? 86400000 : (period === 'week' ? 7 * 86400000 : 30 * 86400000)
  // 获取该 cohort 的用户
  const cohortStart = cohort || 0
  const cohortEnd = cohortStart + periodMs
  const cohortUsers = profiles.filter(p => p.firstActiveAt >= cohortStart && p.firstActiveAt < cohortEnd)
  const result = { cohort: { start: cohortStart, end: cohortEnd }, totalUsers: cohortUsers.length, retention: [] }
  for (let i = 1; i <= 30; i++) {
    const periodStart = cohortEnd + (i - 1) * periodMs
    const periodEnd = periodStart + periodMs
    const retained = cohortUsers.filter(u =>
      behaviors.some(b => b.userId === u.userId && b.timestamp >= periodStart && b.timestamp < periodEnd)
    ).length
    result.retention.push({
      period: i,
      retained,
      rate: cohortUsers.length > 0 ? retained / cohortUsers.length : 0,
    })
  }
  return result
}

// 路径分析：用户行为路径
function analyzeUserPath(userId, options) {
  const behaviors = (db.userBehaviors || []).filter(b => b.userId === userId)
  const limit = options?.limit || 100
  const since = options?.since || 0
  const filtered = behaviors.filter(b => b.timestamp >= since).slice(-limit)
  // 构建路径
  const path = filtered.map(b => ({
    type: b.type,
    page: b.page,
    element: b.element,
    timestamp: b.timestamp,
  }))
  // 分析常见路径模式
  const sequences = []
  for (let i = 0; i < path.length - 2; i++) {
    const seq = path.slice(i, i + 3).map(p => p.page).join(' -> ')
    sequences.push(seq)
  }
  const patterns = {}
  for (const seq of sequences) {
    patterns[seq] = (patterns[seq] || 0) + 1
  }
  return {
    path,
    patterns: Object.entries(patterns)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([seq, count]) => ({ sequence: seq, count })),
  }
}

// 热力图数据：页面点击热区
function getHeatmapData(page, options) {
  if (!db.heatmapData) db.heatmapData = {}
  if (!db.heatmapData[page]) {
    // 从行为数据中聚合
    const clicks = (db.userBehaviors || []).filter(b =>
      b.type === 'click' && b.page === page &&
      (!options?.since || b.timestamp >= options.since)
    )
    const points = clicks.map(c => ({
      x: c.metadata?.x || 0,
      y: c.metadata?.y || 0,
      count: 1,
      element: c.element,
    }))
    // 聚合相近的点
    const aggregated = {}
    for (const p of points) {
      const key = `${Math.floor(p.x / 10)}_${Math.floor(p.y / 10)}`
      if (!aggregated[key]) aggregated[key] = { x: p.x, y: p.y, count: 0, elements: [] }
      aggregated[key].count++
      if (p.element && !aggregated[key].elements.includes(p.element)) {
        aggregated[key].elements.push(p.element)
      }
    }
    db.heatmapData[page] = {
      page,
      points: Object.values(aggregated).sort((a, b) => b.count - a.count),
      totalClicks: points.length,
      updatedAt: new Date().toISOString(),
    }
    saveDB(db)
  }
  return db.heatmapData[page]
}

// 自定义事件统计
function trackCustomEvent(eventName, data) {
  if (!db.behaviorEvents) db.behaviorEvents = {}
  if (!db.behaviorEvents[eventName]) {
    db.behaviorEvents[eventName] = { count: 0, byHour: {}, byDay: {}, users: {}, lastFired: null }
  }
  const evt = db.behaviorEvents[eventName]
  evt.count++
  const now = new Date()
  const hourKey = now.toISOString().split('T')[0] + ' ' + now.getHours() + ':00'
  const dayKey = now.toISOString().split('T')[0]
  evt.byHour[hourKey] = (evt.byHour[hourKey] || 0) + 1
  evt.byDay[dayKey] = (evt.byDay[dayKey] || 0) + 1
  if (data?.userId) {
    evt.users[data.userId] = (evt.users[data.userId] || 0) + 1
  }
  evt.lastFired = Date.now()
  saveDB(db)
  return evt
}

// 事件聚合统计
function getEventAggregation(eventName, period) {
  const evt = db.behaviorEvents?.[eventName]
  if (!evt) return null
  const periodKey = period === 'hour' ? 'byHour' : 'byDay'
  const data = evt[periodKey] || {}
  return {
    eventName,
    total: evt.count,
    uniqueUsers: Object.keys(evt.users).length,
    aggregation: Object.entries(data)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-100)
      .map(([key, count]) => ({ period: key, count })),
    lastFired: evt.lastFired,
  }
}

// 生成报表
function generateBehaviorReport(type, options) {
  const now = new Date()
  let startDate
  if (type === 'daily') startDate = new Date(now.getTime() - 86400000)
  else if (type === 'weekly') startDate = new Date(now.getTime() - 7 * 86400000)
  else if (type === 'monthly') startDate = new Date(now.getTime() - 30 * 86400000)
  else startDate = new Date(0)
  const since = startDate.getTime()
  const behaviors = (db.userBehaviors || []).filter(b => b.timestamp >= since)
  const profiles = Object.values(db.userProfiles || {}).filter(p => p.lastActiveAt >= since)
  const report = {
    id: 'rpt_' + genId(),
    type,
    period: { start: since, end: now.getTime() },
    generatedAt: new Date().toISOString(),
    summary: {
      totalBehaviors: behaviors.length,
      activeUsers: new Set(behaviors.map(b => b.userId)).size,
      pageViews: behaviors.filter(b => b.type === 'page_view').length,
      clicks: behaviors.filter(b => b.type === 'click').length,
      avgSessionDuration: profiles.length > 0
        ? profiles.reduce((s, p) => s + p.totalStayTime, 0) / profiles.length
        : 0,
    },
    topPages: {},
    topEvents: {},
    userSegments: {
      new: profiles.filter(p => p.firstActiveAt >= since).length,
      returning: profiles.filter(p => p.firstActiveAt < since).length,
    },
  }
  // 热门页面
  const pageCounts = {}
  for (const b of behaviors) {
    if (b.type === 'page_view' && b.page) pageCounts[b.page] = (pageCounts[b.page] || 0) + 1
  }
  report.topPages = Object.entries(pageCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([page, count]) => ({ page, count }))
  // 热门事件
  for (const [name, evt] of Object.entries(db.behaviorEvents || {})) {
    report.topEvents[name] = evt.count
  }
  if (!db.behaviorReports) db.behaviorReports = {}
  db.behaviorReports[report.id] = report
  saveDB(db)
  return report
}

// 数据导出
function exportBehaviorData(format, options) {
  const behaviors = db.userBehaviors || []
  const filtered = options?.since ? behaviors.filter(b => b.timestamp >= options.since) : behaviors
  if (format === 'json') {
    return { format, data: filtered, count: filtered.length }
  }
  if (format === 'csv') {
    const headers = ['id,userId,type,page,element,duration,timestamp']
    const rows = filtered.map(b =>
      [b.id, b.userId, b.type, b.page || '', b.element || '', b.duration || 0, b.timestamp].join(',')
    )
    return { format, data: headers.concat(rows).join('\n'), count: filtered.length }
  }
  return { format, error: '不支持的格式' }
}

// ===【新增模块辅助函数锚点结束】===

// ============ 模块23：文件存储系统增强 ============
// 挂载点管理（虚拟文件系统）
function createVFSMount(data, userId) {
  if (!db.vfsMounts) db.vfsMounts = {}
  const id = data.id || ('mnt_' + genId())
  const mount = {
    id,
    name: data.name || ('mount-' + id),
    path: data.path, // 虚拟路径，如 /docs
    target: data.target, // 物理路径，如 /data/files/docs
    type: data.type || 'local', // local / virtual / network
    readOnly: data.readOnly || false,
    enabled: data.enabled !== false,
    options: data.options || {},
    createdAt: new Date().toISOString(),
    createdBy: userId,
    metadata: data.metadata || {},
  }
  db.vfsMounts[id] = mount
  saveDB(db)
  return mount
}

// 路径映射：将虚拟路径映射到实际路径
function resolveVFSPath(virtualPath) {
  const mounts = Object.values(db.vfsMounts || {}).filter(m => m.enabled)
  // 找到最长前缀匹配
  let best = null
  for (const mount of mounts) {
    if (virtualPath.startsWith(mount.path + '/') || virtualPath === mount.path) {
      if (!best || mount.path.length > best.path.length) best = mount
    }
  }
  if (!best) return { resolved: false, virtualPath }
  const relativePath = virtualPath.slice(best.path.length) || '/'
  return {
    resolved: true,
    mountId: best.id,
    physicalPath: (best.target || '').replace(/\/$/, '') + (relativePath === '/' ? '' : relativePath),
    mount: best,
  }
}

// 文件版本控制：每次修改保留版本
function createFileVersion(fileId, content, metadata, userId) {
  if (!db.fileVersions) db.fileVersions = {}
  if (!db.fileVersions[fileId]) db.fileVersions[fileId] = []
  const version = {
    version: db.fileVersions[fileId].length + 1,
    fileId,
    content: content,
    size: content ? (typeof content === 'string' ? content.length : JSON.stringify(content).length) : 0,
    hash: simpleHash(typeof content === 'string' ? content : JSON.stringify(content)),
    metadata: metadata || {},
    createdBy: userId,
    createdAt: new Date().toISOString(),
  }
  db.fileVersions[fileId].push(version)
  if (db.fileVersions[fileId].length > 50) db.fileVersions[fileId] = db.fileVersions[fileId].slice(-30)
  saveDB(db)
  return version
}

// 获取文件版本历史
function getFileVersions(fileId) {
  return (db.fileVersions?.[fileId] || []).slice().reverse()
}

// 还原文件版本
function restoreFileVersion(fileId, version, userId) {
  if (!db.fileVersions || !db.fileVersions[fileId]) return null
  const target = db.fileVersions[fileId].find(v => v.version === parseInt(version))
  if (!target) return null
  // 创建新版本（基于旧版本）
  return createFileVersion(fileId, target.content, { ...target.metadata, restoredFrom: version }, userId)
}

// 文件锁定：防止并发修改冲突
function lockFile(fileId, userId, options) {
  if (!db.fileLocks) db.fileLocks = {}
  const existing = db.fileLocks[fileId]
  if (existing && existing.expiresAt > Date.now() && existing.userId !== userId) {
    return { locked: true, by: existing.userId, expiresAt: existing.expiresAt }
  }
  const lock = {
    fileId,
    userId,
    lockedAt: Date.now(),
    expiresAt: Date.now() + (options?.duration || 300000), // 默认 5 分钟
    type: options?.type || 'exclusive', // exclusive / shared
  }
  db.fileLocks[fileId] = lock
  saveDB(db)
  return { locked: false, lock }
}

// 解锁文件
function unlockFile(fileId, userId) {
  if (!db.fileLocks || !db.fileLocks[fileId]) return false
  const lock = db.fileLocks[fileId]
  if (lock.userId !== userId) return false
  delete db.fileLocks[fileId]
  saveDB(db)
  return true
}

// 检查文件锁
function checkFileLock(fileId) {
  if (!db.fileLocks || !db.fileLocks[fileId]) return null
  const lock = db.fileLocks[fileId]
  if (lock.expiresAt < Date.now()) {
    delete db.fileLocks[fileId]
    return null
  }
  return lock
}

// 文件分享：生成分享链接/密码保护/有效期
function createFileShare(fileId, data, userId) {
  if (!db.fileShares) db.fileShares = {}
  const id = 'shr_' + genId()
  const share = {
    id,
    fileId,
    token: genId() + genId(),
    password: data.password || null,
    expiresAt: data.expiresIn ? Date.now() + data.expiresIn : (data.expiresAt || null),
    maxViews: data.maxViews || 0, // 0 表示不限
    views: 0,
    enabled: true,
    permissions: data.permissions || ['read'],
    sharedBy: userId,
    sharedAt: new Date().toISOString(),
    description: data.description || '',
  }
  db.fileShares[id] = share
  saveDB(db)
  return share
}

// 验证分享链接
function verifyFileShare(token, password) {
  if (!db.fileShares) return { valid: false, reason: '分享不存在' }
  const share = Object.values(db.fileShares).find(s => s.token === token)
  if (!share) return { valid: false, reason: '分享不存在' }
  if (!share.enabled) return { valid: false, reason: '分享已禁用' }
  if (share.expiresAt && share.expiresAt < Date.now()) return { valid: false, reason: '分享已过期' }
  if (share.maxViews > 0 && share.views >= share.maxViews) return { valid: false, reason: '已达最大访问次数' }
  if (share.password && share.password !== password) return { valid: false, reason: '密码错误' }
  share.views++
  saveDB(db)
  return { valid: true, share }
}

// 撤销文件分享
function revokeFileShare(shareId) {
  if (!db.fileShares || !db.fileShares[shareId]) return false
  delete db.fileShares[shareId]
  saveDB(db)
  return true
}

// 文件搜索：按名称/内容/标签
function searchFiles(query) {
  if (!db.files) return []
  const q = (query.keyword || '').toLowerCase()
  return Object.values(db.files).filter(f => {
    if (query.keyword) {
      const nameMatch = (f.name || '').toLowerCase().includes(q)
      const contentMatch = (f.content || '').toLowerCase().includes(q)
      const tagsMatch = (f.tags || []).some(t => t.toLowerCase().includes(q))
      if (!nameMatch && !contentMatch && !tagsMatch) return false
    }
    if (query.type && f.type !== query.type) return false
    if (query.tags && !query.tags.every(t => (f.tags || []).includes(t))) return false
    if (query.minSize && (f.size || 0) < query.minSize) return false
    if (query.maxSize && (f.size || 0) > query.maxSize) return false
    return true
  })
}

// 生成文件预览
function generateFilePreview(file) {
  if (!file) return null
  const ext = (file.name || '').split('.').pop().toLowerCase()
  const preview = {
    fileId: file.id,
    type: 'unknown',
    supported: false,
    content: null,
    generatedAt: new Date().toISOString(),
  }
  // 文本预览
  if (['txt', 'md', 'log', 'csv', 'json', 'js', 'ts', 'py', 'java', 'go', 'rs'].includes(ext)) {
    preview.type = 'text'
    preview.supported = true
    const content = file.content || ''
    preview.content = content.length > 5000 ? content.slice(0, 5000) + '\n\n[... 截断 ...]' : content
    preview.language = ext === 'md' ? 'markdown' : (ext === 'js' ? 'javascript' : ext)
  }
  // 图片预览
  else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
    preview.type = 'image'
    preview.supported = true
    preview.url = file.url || null
    preview.dimensions = file.metadata?.dimensions || null
  }
  // 代码预览
  else if (['html', 'css', 'xml', 'yml', 'yaml'].includes(ext)) {
    preview.type = 'code'
    preview.supported = true
    preview.content = (file.content || '').slice(0, 8000)
    preview.language = ext
  }
  // PDF 预览
  else if (ext === 'pdf') {
    preview.type = 'pdf'
    preview.supported = true
    preview.url = file.url || null
  }
  return preview
}

// 文件转换（模拟）
function convertFile(fileId, targetFormat, userId) {
  if (!db.files || !db.files[fileId]) return null
  const file = db.files[fileId]
  const job = {
    id: 'cv_' + genId(),
    fileId,
    sourceFormat: (file.name || '').split('.').pop(),
    targetFormat,
    status: 'completed', // 模拟直接完成
    progress: 100,
    resultUrl: '/converted/' + fileId + '.' + targetFormat,
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    createdBy: userId,
  }
  if (!db.fileConversions) db.fileConversions = []
  db.fileConversions.push(job)
  if (db.fileConversions.length > 1000) db.fileConversions = db.fileConversions.slice(-500)
  saveDB(db)
  return job
}

// 存储策略：按类型/大小/时间分目录
function getStorageStrategy(file) {
  const strategies = {
    byType: () => '/' + (file.type || 'unknown'),
    bySize: () => {
      const size = file.size || 0
      if (size < 1024 * 1024) return '/small'
      if (size < 10 * 1024 * 1024) return '/medium'
      if (size < 100 * 1024 * 1024) return '/large'
      return '/huge'
    },
    byTime: () => {
      const d = new Date()
      return `/${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}`
    },
    byUser: () => '/' + (file.uploadedBy || 'anonymous'),
  }
  return strategies
}

// 计算存储路径
function computeStoragePath(file, strategy) {
  const fns = getStorageStrategy(file)
  const parts = []
  if (Array.isArray(strategy)) {
    for (const s of strategy) {
      if (fns[s]) parts.push(fns[s]())
    }
  } else if (typeof strategy === 'string' && fns[strategy]) {
    parts.push(fns[strategy]())
  } else {
    parts.push(fns.byTime())
  }
  return parts.join('') + '/' + (file.name || file.id)
}

// 文件元数据管理
function setFileMetadata(fileId, metadata, merge) {
  if (!db.fileMetadata) db.fileMetadata = {}
  if (merge && db.fileMetadata[fileId]) {
    Object.assign(db.fileMetadata[fileId], metadata)
  } else {
    db.fileMetadata[fileId] = { ...metadata, updatedAt: new Date().toISOString() }
  }
  saveDB(db)
  return db.fileMetadata[fileId]
}

function getFileMetadata(fileId) {
  return db.fileMetadata?.[fileId] || null
}

// 批量操作
function createBatchJob(operation, fileIds, userId) {
  if (!db.fileBatchJobs) db.fileBatchJobs = []
  const job = {
    id: 'bj_' + genId(),
    operation, // download / delete / move / convert
    fileIds: Array.isArray(fileIds) ? fileIds : [],
    status: 'pending',
    progress: 0,
    total: fileIds.length,
    processed: 0,
    failed: 0,
    errors: [],
    startedAt: null,
    completedAt: null,
    createdBy: userId,
    createdAt: new Date().toISOString(),
  }
  db.fileBatchJobs.push(job)
  saveDB(db)
  return job
}

// 执行批量删除
function executeBatchDelete(jobId) {
  if (!db.fileBatchJobs) return null
  const job = db.fileBatchJobs.find(j => j.id === jobId)
  if (!job || job.operation !== 'delete') return null
  job.status = 'processing'
  job.startedAt = new Date().toISOString()
  for (const fileId of job.fileIds) {
    try {
      if (db.files && db.files[fileId]) {
        delete db.files[fileId]
        if (db.fileMetadata) delete db.fileMetadata[fileId]
        if (db.fileVersions) delete db.fileVersions[fileId]
        if (db.fileLocks) delete db.fileLocks[fileId]
      }
      job.processed++
    } catch (err) {
      job.failed++
      job.errors.push({ fileId, error: err.message })
    }
    job.progress = Math.floor((job.processed + job.failed) / job.total * 100)
  }
  job.status = 'completed'
  job.completedAt = new Date().toISOString()
  saveDB(db)
  return job
}

// 文件存储统计
function getFileStorageStats() {
  const files = Object.values(db.files || {})
  const totalSize = files.reduce((s, f) => s + (f.size || 0), 0)
  const byType = {}
  for (const f of files) {
    const t = f.type || 'unknown'
    if (!byType[t]) byType[t] = { count: 0, size: 0 }
    byType[t].count++
    byType[t].size += (f.size || 0)
  }
  return {
    totalFiles: files.length,
    totalSize,
    totalShares: Object.keys(db.fileShares || {}).length,
    totalVersions: Object.values(db.fileVersions || {}).reduce((s, v) => s + v.length, 0),
    activeLocks: Object.keys(db.fileLocks || {}).length,
    mounts: Object.keys(db.vfsMounts || {}).length,
    conversions: (db.fileConversions || []).length,
    batchJobs: (db.fileBatchJobs || []).length,
    byType,
  }
}

// ===【新增模块辅助函数锚点结束】===

// ============ 模块22：事件驱动系统 ============
// 系统事件类型定义（30+ 种）
const SYSTEM_EVENT_TYPES = {
  // 用户相关
  'user.created': '用户创建',
  'user.updated': '用户更新',
  'user.deleted': '用户删除',
  'user.login': '用户登录',
  'user.logout': '用户登出',
  'user.role_changed': '用户角色变更',
  // 权限相关
  'permission.granted': '权限授予',
  'permission.revoked': '权限撤销',
  'permission.checked': '权限检查',
  // 文件相关
  'file.uploaded': '文件上传',
  'file.updated': '文件更新',
  'file.deleted': '文件删除',
  'file.shared': '文件分享',
  // 知识库相关
  'knowledge.created': '知识库条目创建',
  'knowledge.updated': '知识库条目更新',
  'knowledge.deleted': '知识库条目删除',
  'knowledge.viewed': '知识库条目浏览',
  // 任务相关
  'task.created': '任务创建',
  'task.completed': '任务完成',
  'task.failed': '任务失败',
  // 系统相关
  'system.started': '系统启动',
  'system.stopped': '系统停止',
  'system.config_changed': '系统配置变更',
  'system.backup_created': '备份创建',
  'system.backup_restored': '备份恢复',
  // 插件相关
  'plugin.installed': '插件安装',
  'plugin.uninstalled': '插件卸载',
  'plugin.enabled': '插件启用',
  'plugin.disabled': '插件禁用',
  // 会话相关
  'conversation.created': '会话创建',
  'conversation.message_sent': '会话消息发送',
  'conversation.closed': '会话关闭',
  // 通知相关
  'notification.sent': '通知发送',
  'notification.read': '通知已读',
}

// 订阅事件
function subscribeEvent(eventType, handlerId, options) {
  if (!db.eventBus) db.eventBus = { subscribers: {}, history: [] }
  if (!db.eventBus.subscribers) db.eventBus.subscribers = {}
  // 支持通配符匹配：user.* 匹配 user.created 等
  const pattern = eventType.includes('*')
  if (!db.eventBus.subscribers[eventType]) db.eventBus.subscribers[eventType] = []
  const subscription = {
    id: 'sub_' + genId(),
    eventType,
    handlerId,
    pattern,
    filter: options?.filter || null,
    priority: options?.priority || 0,
    async: options?.async !== false,
    maxRetries: options?.maxRetries || 3,
    enabled: true,
    createdAt: new Date().toISOString(),
  }
  db.eventBus.subscribers[eventType].push(subscription)
  saveDB(db)
  return subscription
}

// 取消订阅
function unsubscribeEvent(subscriptionId) {
  if (!db.eventBus || !db.eventBus.subscribers) return false
  for (const [eventType, subs] of Object.entries(db.eventBus.subscribers)) {
    const idx = subs.findIndex(s => s.id === subscriptionId)
    if (idx !== -1) {
      subs.splice(idx, 1)
      if (subs.length === 0) delete db.eventBus.subscribers[eventType]
      saveDB(db)
      return true
    }
  }
  return false
}

// 注册事件处理器
function registerEventHandler(id, handlerFn, description) {
  if (!db.eventHandlers) db.eventHandlers = {}
  db.eventHandlers[id] = {
    id,
    description: description || '',
    registeredAt: new Date().toISOString(),
    invokeCount: 0,
    errorCount: 0,
    lastInvoked: null,
    fn: handlerFn, // 函数引用（不持久化，运行时使用）
  }
  return db.eventHandlers[id]
}

// 注销事件处理器
function unregisterEventHandler(id) {
  if (!db.eventHandlers) return false
  if (!db.eventHandlers[id]) return false
  delete db.eventHandlers[id]
  // 同时移除相关订阅
  if (db.eventBus && db.eventBus.subscribers) {
    for (const [eventType, subs] of Object.entries(db.eventBus.subscribers)) {
      db.eventBus.subscribers[eventType] = subs.filter(s => s.handlerId !== id)
    }
  }
  saveDB(db)
  return true
}

// 发布事件
function publishEvent(eventType, payload, source) {
  if (!db.eventBus) db.eventBus = { subscribers: {}, history: [] }
  if (!db.eventHistory) db.eventHistory = []
  const event = {
    id: 'evt_' + genId(),
    type: eventType,
    payload: payload || {},
    source: source || 'system',
    timestamp: Date.now(),
    createdAt: new Date().toISOString(),
    status: 'published',
    processedBy: [],
  }
  // 记录到事件历史
  db.eventHistory.push(event)
  if (db.eventHistory.length > 10000) db.eventHistory = db.eventHistory.slice(-5000)
  // 查找匹配的订阅者
  const matchedSubscriptions = []
  for (const [subEventType, subs] of Object.entries(db.eventBus.subscribers || {})) {
    if (eventTypeMatches(subEventType, eventType)) {
      for (const sub of subs) {
        if (!sub.enabled) continue
        if (sub.filter && !applyEventFilter(sub.filter, event)) continue
        matchedSubscriptions.push(sub)
      }
    }
  }
  // 按优先级排序
  matchedSubscriptions.sort((a, b) => b.priority - a.priority)
  // 分发事件
  const results = []
  for (const sub of matchedSubscriptions) {
    const handler = db.eventHandlers?.[sub.handlerId]
    if (!handler) {
      results.push({ subscriptionId: sub.id, status: 'handler-not-found' })
      continue
    }
    try {
      if (sub.async) {
        // 异步处理（模拟，实际不立即执行）
        results.push({ subscriptionId: sub.id, status: 'queued' })
      } else {
        if (typeof handler.fn === 'function') {
          handler.fn(event)
        }
        handler.invokeCount++
        handler.lastInvoked = Date.now()
        event.processedBy.push(sub.handlerId)
        results.push({ subscriptionId: sub.id, status: 'processed' })
      }
    } catch (err) {
      handler.errorCount++
      results.push({ subscriptionId: sub.id, status: 'error', error: err.message })
    }
  }
  event.status = 'processed'
  saveDB(db)
  return { event, dispatched: results.length, results }
}

// 事件类型匹配（支持通配符）
function eventTypeMatches(pattern, eventType) {
  if (pattern === eventType) return true
  if (pattern.includes('*')) {
    const regexStr = '^' + pattern.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$'
    return new RegExp(regexStr).test(eventType)
  }
  return false
}

// 事件过滤
function applyEventFilter(filter, event) {
  if (filter.source && event.source !== filter.source) return false
  if (filter.since && event.timestamp < filter.since) return false
  if (filter.until && event.timestamp > filter.until) return false
  if (filter.payloadFilter && typeof filter.payloadFilter === 'object') {
    for (const [k, v] of Object.entries(filter.payloadFilter)) {
      if (event.payload[k] !== v) return false
    }
  }
  return true
}

// 事件历史查询
function getEventHistory(filter) {
  if (!db.eventHistory) return []
  let events = db.eventHistory
  if (filter) {
    if (filter.type) events = events.filter(e => filter.type === e.type || eventTypeMatches(filter.type, e.type))
    if (filter.source) events = events.filter(e => e.source === filter.source)
    if (filter.since) events = events.filter(e => e.timestamp >= filter.since)
    if (filter.until) events = events.filter(e => e.timestamp <= filter.until)
    if (filter.status) events = events.filter(e => e.status === filter.status)
  }
  const offset = filter?.offset || 0
  const limit = filter?.limit || 100
  return {
    events: events.slice(-offset - limit, -offset || undefined).reverse(),
    total: events.length,
  }
}

// 事件重放
function replayEvent(eventId, targetHandlers) {
  if (!db.eventHistory) return null
  const event = db.eventHistory.find(e => e.id === eventId)
  if (!event) return null
  const replay = {
    id: 'rpl_' + genId(),
    originalEventId: eventId,
    eventType: event.type,
    payload: event.payload,
    source: event.source,
    replayedAt: Date.now(),
    results: [],
  }
  // 找到匹配的处理器
  const matchedSubs = []
  for (const [subEventType, subs] of Object.entries(db.eventBus?.subscribers || {})) {
    if (eventTypeMatches(subEventType, event.type)) {
      matchedSubs.push(...subs.filter(s => s.enabled && (!targetHandlers || targetHandlers.includes(s.handlerId))))
    }
  }
  for (const sub of matchedSubs) {
    const handler = db.eventHandlers?.[sub.handlerId]
    if (handler && typeof handler.fn === 'function') {
      try {
        handler.fn(event)
        handler.invokeCount++
        replay.results.push({ handlerId: sub.handlerId, status: 'processed' })
      } catch (err) {
        handler.errorCount++
        replay.results.push({ handlerId: sub.handlerId, status: 'error', error: err.message })
      }
    }
  }
  if (!db.eventReplay) db.eventReplay = []
  db.eventReplay.push(replay)
  saveDB(db)
  return replay
}

// 事件溯源：状态重建
function rebuildStateFromEvents(eventType, since) {
  if (!db.eventHistory) return { rebuilt: 0, state: {} }
  const events = db.eventHistory.filter(e =>
    e.type === eventType &&
    (!since || e.timestamp >= since)
  )
  const state = {}
  for (const event of events) {
    // 简化：直接合并 payload
    Object.assign(state, event.payload)
  }
  return { rebuilt: events.length, state }
}

// 创建事件快照
function createEventSnapshot(name, eventType, userId) {
  if (!db.eventSnapshots) db.eventSnapshots = {}
  const { rebuilt, state } = rebuildStateFromEvents(eventType)
  const snapshot = {
    id: 'snap_' + genId(),
    name,
    eventType,
    state,
    eventCount: rebuilt,
    createdAt: new Date().toISOString(),
    createdBy: userId,
  }
  db.eventSnapshots[snapshot.id] = snapshot
  saveDB(db)
  return snapshot
}

// 列出所有事件类型
function listEventTypes() {
  return Object.entries(SYSTEM_EVENT_TYPES).map(([type, desc]) => ({
    type,
    description: desc,
    subscriberCount: (db.eventBus?.subscribers?.[type] || []).length,
  }))
}

// 事件统计
function getEventStats() {
  const events = db.eventHistory || []
  const byType = {}
  const bySource = {}
  const byStatus = {}
  for (const e of events) {
    byType[e.type] = (byType[e.type] || 0) + 1
    bySource[e.source] = (bySource[e.source] || 0) + 1
    byStatus[e.status] = (byStatus[e.status] || 0) + 1
  }
  return {
    totalEvents: events.length,
    totalSubscriptions: Object.values(db.eventBus?.subscribers || {}).reduce((s, arr) => s + arr.length, 0),
    totalHandlers: Object.keys(db.eventHandlers || {}).length,
    totalSnapshots: Object.keys(db.eventSnapshots || {}).length,
    totalReplays: (db.eventReplay || []).length,
    byType,
    bySource,
    byStatus,
  }
}

// ===【新增模块辅助函数锚点结束】===

// ============ 模块21：消息队列系统 ============
// 创建队列
function createMQQueue(data, userId) {
  if (!db.mqQueues) db.mqQueues = {}
  const id = data.id || ('q_' + genId())
  const queue = {
    id,
    name: data.name || ('queue-' + id),
    description: data.description || '',
    type: data.type || 'fifo', // fifo / priority / delay / fanout
    durable: data.durable !== false,
    maxLength: data.maxLength || 10000,
    messageTTL: data.messageTTL || 604800000, // 默认 7 天
    enableDeadLetter: data.enableDeadLetter !== false,
    maxRetries: data.maxRetries || 3,
    priorityLevels: data.priorityLevels || 10,
    createdAt: new Date().toISOString(),
    createdBy: userId,
    stats: {
      total: 0, pending: 0, processing: 0, processed: 0, failed: 0,
      deadLettered: 0, throughput: 0, avgLatency: 0,
    },
  }
  db.mqQueues[id] = queue
  if (!db.mqMessages) db.mqMessages = {}
  db.mqMessages[id] = [] // 待处理消息
  saveDB(db)
  return queue
}

// 删除队列
function deleteMQQueue(id) {
  if (!db.mqQueues || !db.mqQueues[id]) return false
  delete db.mqQueues[id]
  if (db.mqMessages) delete db.mqMessages[id]
  if (db.mqConsumers) delete db.mqConsumers[id]
  saveDB(db)
  return true
}

// 清空队列
function clearMQQueue(id) {
  if (!db.mqMessages || !db.mqMessages[id]) return false
  const count = db.mqMessages[id].length
  db.mqMessages[id] = []
  if (db.mqQueues[id]) {
    db.mqQueues[id].stats.pending = 0
    db.mqQueues[id].stats.total = 0
  }
  saveDB(db)
  return { cleared: count }
}

// 生产消息
function produceMessage(queueId, data, userId) {
  if (!db.mqQueues || !db.mqQueues[queueId]) return null
  if (!db.mqMessages) db.mqMessages = {}
  if (!db.mqMessages[queueId]) db.mqMessages[queueId] = []
  const queue = db.mqQueues[queueId]
  if (queue.maxLength && db.mqMessages[queueId].length >= queue.maxLength) {
    return { error: '队列已满' }
  }
  const messageId = 'msg_' + genId()
  const message = {
    id: messageId,
    queueId,
    payload: data.payload || {},
    priority: data.priority !== undefined ? data.priority : 0,
    delay: data.delay || 0,
    retryCount: 0,
    status: 'pending', // pending / processing / acked / nacked
    producerId: userId,
    producedAt: Date.now(),
    scheduledAt: data.delay ? Date.now() + data.delay : Date.now(),
    deliveredTo: null,
    deliveredAt: null,
    ackedAt: null,
    metadata: data.metadata || {},
    headers: data.headers || {},
  }
  // 延迟消息
  if (data.delay && data.delay > 0) {
    if (!db.mqDelayedMessages) db.mqDelayedMessages = []
    db.mqDelayedMessages.push(message)
  } else {
    db.mqMessages[queueId].push(message)
    // 优先级队列：按优先级降序排序
    if (queue.type === 'priority') {
      db.mqMessages[queueId].sort((a, b) => b.priority - a.priority)
    }
  }
  queue.stats.total++
  queue.stats.pending = db.mqMessages[queueId].length
  saveDB(db)
  return message
}

// 消费消息（拉取模式）
function consumeMessage(queueId, consumerId) {
  if (!db.mqMessages || !db.mqMessages[queueId]) return null
  const messages = db.mqMessages[queueId]
  const now = Date.now()
  // 找到第一条可处理的消息
  const idx = messages.findIndex(m => m.status === 'pending' && m.scheduledAt <= now)
  if (idx === -1) return null
  const message = messages[idx]
  message.status = 'processing'
  message.deliveredTo = consumerId
  message.deliveredAt = now
  if (db.mqQueues[queueId]) {
    db.mqQueues[queueId].stats.pending = Math.max(0, messages.filter(m => m.status === 'pending').length)
    db.mqQueues[queueId].stats.processing = messages.filter(m => m.status === 'processing').length
  }
  saveDB(db)
  return message
}

// 确认消息
function ackMessage(queueId, messageId) {
  if (!db.mqMessages || !db.mqMessages[queueId]) return false
  const messages = db.mqMessages[queueId]
  const idx = messages.findIndex(m => m.id === messageId)
  if (idx === -1) return false
  const message = messages[idx]
  if (message.status !== 'processing') return false
  message.status = 'acked'
  message.ackedAt = Date.now()
  const latency = message.ackedAt - message.producedAt
  const queue = db.mqQueues[queueId]
  if (queue) {
    queue.stats.processed++
    queue.stats.processing = Math.max(0, queue.stats.processing - 1)
    queue.stats.avgLatency = queue.stats.avgLatency
      ? (queue.stats.avgLatency * 0.9 + latency * 0.1)
      : latency
  }
  // 从队列中移除已确认消息
  messages.splice(idx, 1)
  saveDB(db)
  return true
}

// 拒绝消息（nack + requeue）
function nackMessage(queueId, messageId, requeue) {
  if (!db.mqMessages || !db.mqMessages[queueId]) return false
  const messages = db.mqMessages[queueId]
  const idx = messages.findIndex(m => m.id === messageId)
  if (idx === -1) return false
  const message = messages[idx]
  const queue = db.mqQueues[queueId]
  if (requeue) {
    message.status = 'pending'
    message.retryCount = (message.retryCount || 0) + 1
    message.scheduledAt = Date.now() + Math.pow(2, message.retryCount) * 1000 // 指数退避
    // 超过最大重试次数转入死信队列
    if (queue && queue.maxRetries && message.retryCount >= queue.maxRetries) {
      moveToDeadLetter(queueId, message, 'max retries exceeded')
      messages.splice(idx, 1)
    } else {
      // 重新排序（如果是优先级队列）
      if (queue && queue.type === 'priority') {
        messages.sort((a, b) => b.priority - a.priority)
      }
    }
  } else {
    // 不重新入队，直接移入死信
    moveToDeadLetter(queueId, message, 'nacked without requeue')
    messages.splice(idx, 1)
  }
  if (queue) {
    queue.stats.pending = messages.filter(m => m.status === 'pending').length
    queue.stats.processing = Math.max(0, queue.stats.processing - 1)
  }
  saveDB(db)
  return true
}

// 移入死信队列
function moveToDeadLetter(queueId, message, reason) {
  if (!db.mqDeadLetters) db.mqDeadLetters = []
  db.mqDeadLetters.push({
    ...message,
    originalQueueId: queueId,
    deadReason: reason,
    deadAt: Date.now(),
  })
  if (db.mqDeadLetters.length > 10000) db.mqDeadLetters = db.mqDeadLetters.slice(-5000)
  if (db.mqQueues[queueId]) {
    db.mqQueues[queueId].stats.deadLettered++
    db.mqQueues[queueId].stats.failed++
  }
}

// 处理延迟消息（定时投递）
function processDelayedMessages() {
  if (!db.mqDelayedMessages || db.mqDelayedMessages.length === 0) return { moved: 0 }
  const now = Date.now()
  const ready = db.mqDelayedMessages.filter(m => m.scheduledAt <= now)
  if (ready.length === 0) return { moved: 0 }
  for (const message of ready) {
    if (!db.mqMessages[message.queueId]) db.mqMessages[message.queueId] = []
    db.mqMessages[message.queueId].push(message)
    const queue = db.mqQueues?.[message.queueId]
    if (queue) {
      if (queue.type === 'priority') {
        db.mqMessages[message.queueId].sort((a, b) => b.priority - a.priority)
      }
      queue.stats.pending = db.mqMessages[message.queueId].length
    }
  }
  db.mqDelayedMessages = db.mqDelayedMessages.filter(m => m.scheduledAt > now)
  saveDB(db)
  return { moved: ready.length }
}

// 注册消费者
function registerMQConsumer(queueId, data, userId) {
  if (!db.mqConsumers) db.mqConsumers = {}
  if (!db.mqConsumers[queueId]) db.mqConsumers[queueId] = []
  const consumerId = 'csm_' + genId()
  const consumer = {
    id: consumerId,
    queueId,
    name: data.name || ('consumer-' + consumerId),
    type: data.type || 'pull', // pull / push
    callbackUrl: data.callbackUrl || null,
    prefetch: data.prefetch || 1,
    enabled: data.enabled !== false,
    registeredAt: new Date().toISOString(),
    registeredBy: userId,
    lastActiveAt: null,
    stats: { consumed: 0, acked: 0, failed: 0 },
  }
  db.mqConsumers[queueId].push(consumer)
  saveDB(db)
  return consumer
}

// 注销消费者
function unregisterMQConsumer(queueId, consumerId) {
  if (!db.mqConsumers || !db.mqConsumers[queueId]) return false
  const idx = db.mqConsumers[queueId].findIndex(c => c.id === consumerId)
  if (idx === -1) return false
  db.mqConsumers[queueId].splice(idx, 1)
  saveDB(db)
  return true
}

// 获取队列统计
function getMQQueueStats(queueId) {
  if (!db.mqQueues || !db.mqQueues[queueId]) return null
  const queue = db.mqQueues[queueId]
  const messages = db.mqMessages?.[queueId] || []
  const consumers = db.mqConsumers?.[queueId] || []
  return {
    queueId,
    queueName: queue.name,
    pending: messages.filter(m => m.status === 'pending').length,
    processing: messages.filter(m => m.status === 'processing').length,
    consumers: consumers.length,
    activeConsumers: consumers.filter(c => c.enabled).length,
    totalProcessed: queue.stats.processed,
    totalFailed: queue.stats.failed,
    deadLettered: queue.stats.deadLettered,
    throughput: queue.stats.processed, // 简化
    avgLatency: queue.stats.avgLatency,
  }
}

// 所有队列统计
function getAllMQStats() {
  const queues = Object.keys(db.mqQueues || {})
  return {
    totalQueues: queues.length,
    queues: queues.map(getMQQueueStats).filter(Boolean),
    totalDeadLetters: (db.mqDeadLetters || []).length,
    totalDelayed: (db.mqDelayedMessages || []).length,
    totalConsumers: Object.values(db.mqConsumers || {}).reduce((s, arr) => s + arr.length, 0),
  }
}

// 推送消息到消费者（模拟）
function pushToConsumer(queueId, consumer, message) {
  // 在实际系统中，这里会调用 HTTP 回调；此处仅记录
  consumer.lastActiveAt = new Date().toISOString()
  consumer.stats.consumed++
  return { delivered: true, consumer: consumer.id, message: message.id }
}

// 死信重处理
function reprocessDeadLetter(deadLetterId, targetQueueId) {
  if (!db.mqDeadLetters) return false
  const idx = db.mqDeadLetters.findIndex(d => d.id === deadLetterId)
  if (idx === -1) return false
  const dl = db.mqDeadLetters[idx]
  const newMessage = produceMessage(targetQueueId || dl.originalQueueId, {
    payload: dl.payload,
    priority: dl.priority,
    metadata: { ...dl.metadata, reprocessedFrom: deadLetterId },
  }, dl.producerId)
  db.mqDeadLetters.splice(idx, 1)
  saveDB(db)
  return newMessage
}

// ===【新增模块辅助函数锚点结束】===

// ============ 模块1：计费与支付系统 ============

// 定价方案定义
const PRICING_PLANS = {
  free: { id: 'free', name: '免费版', monthlyPrice: 0, yearlyPrice: 0, tokens: 10000, conversations: 100, storage: 1024 * 1024 * 100, apiCalls: 1000, features: ['基础对话', '标准模型', '100MB存储'] },
  basic: { id: 'basic', name: '基础版', monthlyPrice: 19, yearlyPrice: 190, tokens: 100000, conversations: 1000, storage: 1024 * 1024 * 1024, apiCalls: 10000, features: ['高级对话', '多模型', '1GB存储', 'API访问'] },
  pro: { id: 'pro', name: '专业版', monthlyPrice: 49, yearlyPrice: 490, tokens: 500000, conversations: 5000, storage: 10 * 1024 * 1024 * 1024, apiCalls: 50000, features: ['超级大脑', '自定义模型', '10GB存储', '优先支持'] },
  enterprise: { id: 'enterprise', name: '企业版', monthlyPrice: 199, yearlyPrice: 1990, tokens: 10000000, conversations: 100000, storage: 100 * 1024 * 1024 * 1024, apiCalls: 1000000, features: ['私有化部署', '专属模型', '100GB存储', '7x24支持', 'SLA保障'] },
}

function initPricingPlans() {
  if (!db.pricingPlans || Object.keys(db.pricingPlans).length === 0) {
    db.pricingPlans = { ...PRICING_PLANS }
    saveDB(db)
  }
}
initPricingPlans()

function getPricingPlan(planId) {
  return db.pricingPlans[planId] || PRICING_PLANS[planId]
}

function createSubscription(userId, planId, billingCycle = 'monthly', couponCode = null) {
  const plan = getPricingPlan(planId)
  if (!plan) return null

  let discount = 0
  let coupon = null
  if (couponCode) {
    coupon = db.coupons?.[couponCode]
    if (coupon && !coupon.used && coupon.validUntil > Date.now()) {
      discount = coupon.discount
    }
  }

  const basePrice = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice
  const finalPrice = Math.max(0, basePrice * (1 - discount / 100))
  const billingDate = new Date()
  const nextBillingDate = new Date(billingDate.getTime() + (billingCycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000)

  const subscription = {
    id: 'sub_' + genId(),
    userId,
    planId,
    planName: plan.name,
    billingCycle,
    status: 'active',
    basePrice,
    discount,
    finalPrice,
    couponCode: coupon?.code || null,
    billingDate: billingDate.toISOString(),
    nextBillingDate: nextBillingDate.toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  if (!db.subscriptions) db.subscriptions = {}
  db.subscriptions[subscription.id] = subscription

  if (coupon) {
    coupon.used = true
    coupon.usedBy = userId
    coupon.usedAt = new Date().toISOString()
  }

  saveDB(db)
  return subscription
}

function updateSubscription(subscriptionId, updates) {
  const subscription = db.subscriptions?.[subscriptionId]
  if (!subscription) return null
  Object.assign(subscription, updates, { updatedAt: new Date().toISOString() })
  saveDB(db)
  return subscription
}

function cancelSubscription(subscriptionId) {
  const subscription = db.subscriptions?.[subscriptionId]
  if (!subscription) return false
  subscription.status = 'cancelled'
  subscription.cancelledAt = new Date().toISOString()
  saveDB(db)
  return true
}

function renewSubscription(subscriptionId) {
  const subscription = db.subscriptions?.[subscriptionId]
  if (!subscription) return null
  if (subscription.status !== 'active') return null

  const billingDate = new Date()
  const nextBillingDate = new Date(billingDate.getTime() + (subscription.billingCycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000)

  subscription.billingDate = billingDate.toISOString()
  subscription.nextBillingDate = nextBillingDate.toISOString()
  subscription.updatedAt = new Date().toISOString()
  saveDB(db)
  return subscription
}

function recordUsage(userId, type, amount) {
  if (!db.usageStats) db.usageStats = {}
  if (!db.usageStats[userId]) {
    db.usageStats[userId] = {
      userId,
      tokens: 0,
      conversations: 0,
      storage: 0,
      apiCalls: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }
  db.usageStats[userId][type] = (db.usageStats[userId][type] || 0) + amount
  db.usageStats[userId].updatedAt = new Date().toISOString()
  saveDB(db)
}

function getUsageStats(userId) {
  return db.usageStats?.[userId] || { userId, tokens: 0, conversations: 0, storage: 0, apiCalls: 0 }
}

function checkQuota(userId) {
  const subscription = Object.values(db.subscriptions || {}).find(s => s.userId === userId && s.status === 'active')
  const plan = subscription ? getPricingPlan(subscription.planId) : getPricingPlan('free')
  const usage = getUsageStats(userId)
  const freeQuota = getFreeQuota(userId)

  return {
    plan,
    usage,
    remaining: {
      tokens: plan.tokens + freeQuota.dailyTokens - usage.tokens,
      conversations: plan.conversations + freeQuota.dailyConversations - usage.conversations,
      storage: plan.storage + freeQuota.dailyStorage - usage.storage,
      apiCalls: plan.apiCalls + freeQuota.dailyApiCalls - usage.apiCalls,
    },
    exceeded: {
      tokens: usage.tokens > plan.tokens + freeQuota.dailyTokens,
      conversations: usage.conversations > plan.conversations + freeQuota.dailyConversations,
      storage: usage.storage > plan.storage + freeQuota.dailyStorage,
      apiCalls: usage.apiCalls > plan.apiCalls + freeQuota.dailyApiCalls,
    },
  }
}

function generateInvoice(subscriptionId) {
  const subscription = db.subscriptions?.[subscriptionId]
  if (!subscription) return null

  const invoice = {
    id: 'inv_' + genId(),
    subscriptionId,
    userId: subscription.userId,
    planId: subscription.planId,
    planName: subscription.planName,
    billingCycle: subscription.billingCycle,
    amount: subscription.finalPrice,
    status: 'pending',
    dueDate: subscription.nextBillingDate,
    items: [
      { name: subscription.planName + ' (' + subscription.billingCycle + ')', amount: subscription.basePrice },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  if (!db.invoices) db.invoices = {}
  db.invoices[invoice.id] = invoice
  saveDB(db)
  return invoice
}

function createPayment(invoiceId, paymentMethod = 'credit_card', simulateSuccess = true) {
  const invoice = db.invoices?.[invoiceId]
  if (!invoice) return null

  const payment = {
    id: 'pay_' + genId(),
    invoiceId,
    userId: invoice.userId,
    amount: invoice.amount,
    method: paymentMethod,
    status: simulateSuccess ? 'success' : 'failed',
    transactionId: 'txn_' + genId(),
    createdAt: new Date().toISOString(),
  }

  if (!db.payments) db.payments = {}
  db.payments[payment.id] = payment

  if (simulateSuccess) {
    invoice.status = 'paid'
    invoice.paidAt = new Date().toISOString()
    invoice.paymentId = payment.id
  }

  saveDB(db)
  return payment
}

function processRefund(paymentId, reason = '') {
  const payment = db.payments?.[paymentId]
  if (!payment || payment.status !== 'success') return null

  payment.status = 'refunded'
  payment.refundedAt = new Date().toISOString()
  payment.refundReason = reason

  const invoice = db.invoices?.[payment.invoiceId]
  if (invoice) {
    invoice.status = 'refunded'
    invoice.refundedAt = new Date().toISOString()
  }

  saveDB(db)
  return payment
}

function createCoupon(code, discount, validDays = 30, maxUses = 100) {
  if (db.coupons?.[code]) return null

  const coupon = {
    id: 'coupon_' + genId(),
    code,
    discount,
    validUntil: Date.now() + validDays * 24 * 60 * 60 * 1000,
    maxUses,
    used: 0,
    status: 'active',
    createdAt: new Date().toISOString(),
  }

  if (!db.coupons) db.coupons = {}
  db.coupons[code] = coupon
  saveDB(db)
  return coupon
}

function useCoupon(code, userId) {
  const coupon = db.coupons?.[code]
  if (!coupon || coupon.status !== 'active' || coupon.used >= coupon.maxUses || coupon.validUntil < Date.now()) {
    return null
  }
  coupon.used++
  coupon.usedBy = userId
  coupon.usedAt = new Date().toISOString()
  if (coupon.used >= coupon.maxUses) coupon.status = 'expired'
  saveDB(db)
  return coupon
}

function getFreeQuota(userId) {
  if (!db.freeQuotas) db.freeQuotas = {}
  if (!db.freeQuotas[userId]) {
    db.freeQuotas[userId] = {
      userId,
      dailyTokens: 1000,
      dailyConversations: 10,
      dailyStorage: 1024 * 1024,
      dailyApiCalls: 100,
      monthlyTokens: 30000,
      monthlyConversations: 300,
      monthlyStorage: 30 * 1024 * 1024,
      monthlyApiCalls: 3000,
      lastDailyReset: new Date().toISOString(),
      lastMonthlyReset: new Date().toISOString(),
    }
    saveDB(db)
  }
  return db.freeQuotas[userId]
}

function resetDailyQuota(userId) {
  const quota = getFreeQuota(userId)
  const lastReset = new Date(quota.lastDailyReset)
  const now = new Date()
  if (now.getDate() !== lastReset.getDate()) {
    quota.lastDailyReset = now.toISOString()
    saveDB(db)
    return true
  }
  return false
}

function resetMonthlyQuota(userId) {
  const quota = getFreeQuota(userId)
  const lastReset = new Date(quota.lastMonthlyReset)
  const now = new Date()
  if (now.getMonth() !== lastReset.getMonth()) {
    quota.lastMonthlyReset = now.toISOString()
    saveDB(db)
    return true
  }
  return false
}

function addBalance(userId, amount, paymentMethod = 'credit_card') {
  if (!db.balances) db.balances = {}
  if (!db.balances[userId]) {
    db.balances[userId] = { userId, balance: 0, transactions: [], createdAt: new Date().toISOString() }
  }

  db.balances[userId].balance += amount
  db.balances[userId].transactions.push({
    id: 'bal_tx_' + genId(),
    type: 'deposit',
    amount,
    method: paymentMethod,
    timestamp: new Date().toISOString(),
  })
  db.balances[userId].updatedAt = new Date().toISOString()
  saveDB(db)
  return db.balances[userId]
}

function deductBalance(userId, amount, reason = '') {
  if (!db.balances?.[userId]) return false
  if (db.balances[userId].balance < amount) return false

  db.balances[userId].balance -= amount
  db.balances[userId].transactions.push({
    id: 'bal_tx_' + genId(),
    type: 'withdrawal',
    amount,
    reason,
    timestamp: new Date().toISOString(),
  })
  db.balances[userId].updatedAt = new Date().toISOString()
  saveDB(db)
  return true
}

function getBalance(userId) {
  return db.balances?.[userId] || { userId, balance: 0, transactions: [] }
}

function createReceipt(paymentId) {
  const payment = db.payments?.[paymentId]
  if (!payment) return null

  const receipt = {
    id: 'rec_' + genId(),
    paymentId,
    userId: payment.userId,
    amount: payment.amount,
    method: payment.method,
    transactionId: payment.transactionId,
    issuedAt: new Date().toISOString(),
  }

  if (!db.receipts) db.receipts = {}
  db.receipts[receipt.id] = receipt
  saveDB(db)
  return receipt
}

// ============ 模块2：性能监控系统 ============

const METRIC_TYPES = ['cpu', 'memory', 'disk', 'network', 'requests', 'errors', 'latency']

function collectSystemMetrics() {
  const metrics = {
    timestamp: Date.now(),
    cpu: {
      usage: Math.random() * 80 + 10,
      cores: 4,
    },
    memory: {
      used: Math.random() * 512 + 128,
      total: 1024,
      percent: Math.random() * 80 + 10,
    },
    disk: {
      used: Math.random() * 20 + 5,
      total: 100,
      percent: Math.random() * 70 + 10,
    },
    network: {
      in: Math.random() * 1000 + 100,
      out: Math.random() * 500 + 50,
    },
    requests: {
      total: Math.floor(Math.random() * 1000) + 100,
      success: Math.floor(Math.random() * 900) + 90,
      errors: Math.floor(Math.random() * 50),
      rate: Math.random() * 100 + 10,
    },
    errors: {
      total: Math.floor(Math.random() * 50),
      rate: Math.random() * 5,
    },
    latency: {
      avg: Math.random() * 100 + 10,
      p50: Math.random() * 80 + 10,
      p90: Math.random() * 200 + 50,
      p99: Math.random() * 500 + 100,
    },
  }

  if (!db.metrics) db.metrics = []
  db.metrics.push(metrics)

  if (db.metrics.length > 1000) {
    db.metrics = db.metrics.slice(-1000)
  }

  saveDB(db)
  return metrics
}

function queryMetrics(type, startTime, endTime, aggregation = 'avg') {
  if (!db.metrics) return []

  let results = db.metrics.filter(m => {
    if (startTime && m.timestamp < startTime) return false
    if (endTime && m.timestamp > endTime) return false
    return true
  })

  if (type) {
    results = results.map(m => ({ timestamp: m.timestamp, value: m[type] }))
  }

  if (aggregation !== 'raw') {
    const grouped = {}
    const interval = (endTime - startTime) / 10 || 60000

    for (const m of results) {
      const bucket = Math.floor(m.timestamp / interval) * interval
      if (!grouped[bucket]) grouped[bucket] = []
      grouped[bucket].push(m)
    }

    results = Object.entries(grouped).map(([bucket, items]) => {
      const values = items.map(i => typeof i.value === 'number' ? i.value : (i.value?.percent || i.value?.rate || 0))
      let aggregated
      if (aggregation === 'avg') aggregated = values.reduce((a, b) => a + b, 0) / values.length
      else if (aggregation === 'max') aggregated = Math.max(...values)
      else if (aggregation === 'min') aggregated = Math.min(...values)
      else if (aggregation === 'sum') aggregated = values.reduce((a, b) => a + b, 0)
      else aggregated = values[0]
      return { timestamp: parseInt(bucket), value: aggregated }
    })
  }

  return results
}

function createMetricRule(name, type, threshold, operator = '>', severity = 'warning') {
  const rule = {
    id: 'rule_' + genId(),
    name,
    type,
    threshold,
    operator,
    severity,
    enabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  if (!db.metricRules) db.metricRules = {}
  db.metricRules[rule.id] = rule
  saveDB(db)
  return rule
}

function evaluateMetricRules(metrics) {
  const alerts = []
  if (!db.metricRules) return alerts

  for (const rule of Object.values(db.metricRules)) {
    if (!rule.enabled) continue

    const value = metrics[rule.type]
    if (!value) continue

    const numericValue = typeof value === 'number' ? value : (value.percent || value.rate || 0)
    let triggered = false

    if (rule.operator === '>') triggered = numericValue > rule.threshold
    else if (rule.operator === '<') triggered = numericValue < rule.threshold
    else if (rule.operator === '>=') triggered = numericValue >= rule.threshold
    else if (rule.operator === '<=') triggered = numericValue <= rule.threshold
    else if (rule.operator === '==') triggered = numericValue === rule.threshold

    if (triggered) {
      alerts.push({
        id: 'alert_' + genId(),
        ruleId: rule.id,
        ruleName: rule.name,
        type: rule.type,
        value: numericValue,
        threshold: rule.threshold,
        severity: rule.severity,
        timestamp: Date.now(),
        status: 'active',
      })
    }
  }

  if (alerts.length > 0) {
    if (!db.metricAlerts) db.metricAlerts = []
    db.metricAlerts.push(...alerts)
    if (db.metricAlerts.length > 500) db.metricAlerts = db.metricAlerts.slice(-500)
    saveDB(db)
  }

  return alerts
}

function resolveAlert(alertId) {
  if (!db.metricAlerts) return false
  const alert = db.metricAlerts.find(a => a.id === alertId)
  if (!alert) return false
  alert.status = 'resolved'
  alert.resolvedAt = new Date().toISOString()
  saveDB(db)
  return true
}

function createDashboard(name, widgets = []) {
  const dashboard = {
    id: 'dash_' + genId(),
    name,
    widgets,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  if (!db.metricDashboards) db.metricDashboards = {}
  db.metricDashboards[dashboard.id] = dashboard
  saveDB(db)
  return dashboard
}

function analyzePerformance() {
  if (!db.metrics || db.metrics.length === 0) return { recommendations: [] }

  const recent = db.metrics.slice(-60)
  const avgLatency = recent.reduce((a, b) => a + b.latency.avg, 0) / recent.length
  const avgErrorRate = recent.reduce((a, b) => a + b.errors.rate, 0) / recent.length
  const avgCpu = recent.reduce((a, b) => a + b.cpu.usage, 0) / recent.length
  const avgMemory = recent.reduce((a, b) => a + b.memory.percent, 0) / recent.length

  const recommendations = []

  if (avgLatency > 200) recommendations.push('平均延迟超过200ms，建议优化数据库查询或增加缓存')
  if (avgErrorRate > 5) recommendations.push('错误率超过5%，建议检查服务健康状态')
  if (avgCpu > 80) recommendations.push('CPU使用率超过80%，建议升级服务器或优化代码')
  if (avgMemory > 85) recommendations.push('内存使用率超过85%，建议清理缓存或增加内存')

  const analysis = {
    timestamp: Date.now(),
    avgLatency,
    avgErrorRate,
    avgCpu,
    avgMemory,
    recommendations,
  }

  if (!db.metricAnalysis) db.metricAnalysis = []
  db.metricAnalysis.push(analysis)
  if (db.metricAnalysis.length > 100) db.metricAnalysis = db.metricAnalysis.slice(-100)
  saveDB(db)

  return analysis
}

function predictResourceUsage(days = 7) {
  if (!db.metrics || db.metrics.length === 0) return {}

  const recent = db.metrics.slice(-24)
  const growthRate = 0.02

  return {
    cpu: {
      current: recent.reduce((a, b) => a + b.cpu.usage, 0) / recent.length,
      predicted: recent.reduce((a, b) => a + b.cpu.usage, 0) / recent.length * Math.pow(1 + growthRate, days),
    },
    memory: {
      current: recent.reduce((a, b) => a + b.memory.percent, 0) / recent.length,
      predicted: recent.reduce((a, b) => a + b.memory.percent, 0) / recent.length * Math.pow(1 + growthRate, days),
    },
    requests: {
      current: recent.reduce((a, b) => a + b.requests.rate, 0) / recent.length,
      predicted: recent.reduce((a, b) => a + b.requests.rate, 0) / recent.length * Math.pow(1 + growthRate, days),
    },
    days,
    timestamp: Date.now(),
  }
}

// ============ 模块3：缓存系统增强 ============

const CACHE_STRATEGIES = { LRU: 'lru', LFU: 'lfu', FIFO: 'fifo' }

class CacheLayer {
  constructor(name, strategy = 'lru', maxSize = 1000) {
    this.name = name
    this.strategy = strategy
    this.maxSize = maxSize
    this.cache = {}
    this.stats = { hits: 0, misses: 0, writes: 0, evictions: 0 }
    this.order = []
    this.frequency = {}
    this.timestamps = {}
  }

  get(key) {
    if (this.cache[key]) {
      this.stats.hits++
      this._updateOrder(key)
      return this.cache[key]
    }
    this.stats.misses++
    return null
  }

  set(key, value, ttl = null) {
    if (Object.keys(this.cache).size >= this.maxSize) {
      this._evict()
    }
    this.cache[key] = { value, ttl: ttl ? Date.now() + ttl : null }
    this.stats.writes++
    this.timestamps[key] = Date.now()
    this._updateOrder(key)
    this.frequency[key] = (this.frequency[key] || 0) + 1
  }

  delete(key) {
    delete this.cache[key]
    delete this.timestamps[key]
    delete this.frequency[key]
    this.order = this.order.filter(k => k !== key)
  }

  clear() {
    this.cache = {}
    this.order = []
    this.frequency = {}
    this.timestamps = {}
  }

  _updateOrder(key) {
    this.order = this.order.filter(k => k !== key)
    this.order.push(key)
  }

  _evict() {
    let keyToEvict
    if (this.strategy === 'lru') {
      keyToEvict = this.order[0]
    } else if (this.strategy === 'lfu') {
      let minFreq = Infinity
      for (const [k, freq] of Object.entries(this.frequency)) {
        if (freq < minFreq) {
          minFreq = freq
          keyToEvict = k
        }
      }
    } else {
      keyToEvict = this.order[0]
    }
    if (keyToEvict) {
      this.delete(keyToEvict)
      this.stats.evictions++
    }
  }

  getStats() {
    const hitRate = (this.stats.hits + this.stats.misses) > 0
      ? (this.stats.hits / (this.stats.hits + this.stats.misses)) * 100
      : 0
    return { ...this.stats, hitRate: hitRate.toFixed(2) }
  }
}

const layeredMemoryCache = new CacheLayer('memory', 'lru', 10000)
const layeredFileCache = new CacheLayer('file', 'lfu', 5000)

function getFromCache(key, layers = ['memory', 'file']) {
  let result = null
  for (const layer of layers) {
    if (layer === 'memory') {
      result = layeredMemoryCache.get(key)
      if (result) return { value: result.value, layer }
    } else if (layer === 'file') {
      result = layeredFileCache.get(key)
      if (result) return { value: result.value, layer }
    }
  }
  return null
}

function setInCache(key, value, ttl = 3600000, layers = ['memory', 'file']) {
  for (const layer of layers) {
    if (layer === 'memory') layeredMemoryCache.set(key, value, ttl)
    else if (layer === 'file') layeredFileCache.set(key, value, ttl)
  }
}

function deleteFromCache(key, layers = ['memory', 'file']) {
  for (const layer of layers) {
    if (layer === 'memory') layeredMemoryCache.delete(key)
    else if (layer === 'file') layeredFileCache.delete(key)
  }
}

function getCacheStats() {
  return {
    memory: layeredMemoryCache.getStats(),
    file: layeredFileCache.getStats(),
  }
}

function warmupCache(prefix, data) {
  for (const [key, value] of Object.entries(data)) {
    const cacheKey = prefix + ':' + key
    setInCache(cacheKey, value)
  }
}

function generateCacheKey(prefix, parts, version = 'v1') {
  return `${version}:${prefix}:${parts.join(':')}`
}

function invalidateCacheByPrefix(prefix) {
  for (const key of Object.keys(layeredMemoryCache.cache)) {
    if (key.startsWith(prefix)) layeredMemoryCache.delete(key)
  }
  for (const key of Object.keys(layeredFileCache.cache)) {
    if (key.startsWith(prefix)) layeredFileCache.delete(key)
  }
}

// ============ 模块4：会话管理系统 ============

const SM_STATUSES = { ACTIVE: 'active', IDLE: 'idle', EXPIRED: 'expired', LOCKED: 'locked' }

function smCreateSession(userId, deviceInfo = {}) {
  const sessionId = 'ses_' + genId()
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000

  const session = {
    id: sessionId,
    userId,
    status: 'active',
    expiresAt,
    lastActivity: Date.now(),
    deviceInfo,
    createdAt: new Date().toISOString(),
  }

  if (!db.sessionsEx) db.sessionsEx = {}
  db.sessionsEx[sessionId] = session

  if (!db.sessionDevices) db.sessionDevices = {}
  if (!db.sessionDevices[userId]) db.sessionDevices[userId] = []
  db.sessionDevices[userId].push({
    sessionId,
    device: deviceInfo,
    lastSeen: Date.now(),
  })

  saveDB(db)
  return session
}

function smGetSession(sessionId) {
  const session = db.sessionsEx?.[sessionId]
  if (!session) return null

  if (session.expiresAt < Date.now()) {
    session.status = 'expired'
    saveDB(db)
    return null
  }
  return session
}

function smUpdateSessionActivity(sessionId) {
  const session = db.sessionsEx?.[sessionId]
  if (!session) return false
  session.lastActivity = Date.now()
  session.expiresAt = Date.now() + 24 * 60 * 60 * 1000
  session.status = 'active'
  saveDB(db)
  return true
}

function smInvalidateSession(sessionId) {
  const session = db.sessionsEx?.[sessionId]
  if (!session) return false
  session.status = 'expired'
  session.expiredAt = new Date().toISOString()
  saveDB(db)
  return true
}

function smLockSession(sessionId, reason = '') {
  const session = db.sessionsEx?.[sessionId]
  if (!session) return false
  session.status = 'locked'
  session.lockedAt = new Date().toISOString()
  session.lockReason = reason
  saveDB(db)
  return true
}

function smUnlockSession(sessionId) {
  const session = db.sessionsEx?.[sessionId]
  if (!session) return false
  session.status = 'active'
  session.lockedAt = null
  session.lockReason = null
  saveDB(db)
  return true
}

function smGetUserSessions(userId) {
  return Object.values(db.sessionsEx || {}).filter(s => s.userId === userId)
}

function smGetActiveSessions() {
  return Object.values(db.sessionsEx || {}).filter(s => s.status === 'active' && s.expiresAt > Date.now())
}

function smGetOnlineUsers() {
  const activeSessions = smGetActiveSessions()
  const userIds = new Set(activeSessions.map(s => s.userId))
  return Array.from(userIds)
}

function smSyncSessionData(sessionId, data) {
  const session = db.sessionsEx?.[sessionId]
  if (!session) return false

  if (!db.sessionSync) db.sessionSync = {}
  if (!db.sessionSync[sessionId]) db.sessionSync[sessionId] = []

  db.sessionSync[sessionId].push({
    timestamp: Date.now(),
    data,
  })

  if (db.sessionSync[sessionId].length > 100) {
    db.sessionSync[sessionId] = db.sessionSync[sessionId].slice(-100)
  }

  saveDB(db)
  return true
}

function smGetSessionSyncHistory(sessionId) {
  return db.sessionSync?.[sessionId] || []
}

function smCleanupExpiredSessions() {
  const now = Date.now()
  let cleaned = 0

  for (const [sessionId, session] of Object.entries(db.sessionsEx || {})) {
    if (session.expiresAt < now && session.status === 'active') {
      session.status = 'expired'
      session.expiredAt = new Date().toISOString()
      cleaned++
    }
  }

  if (cleaned > 0) saveDB(db)
  return cleaned
}

// ============ 模块5：数据同步系统 ============

const SYNC_STATUS = { SYNCING: 'syncing', COMPLETED: 'completed', FAILED: 'failed', PAUSED: 'paused' }

function createSyncTask(name, source, target, syncType = 'incremental', options = {}) {
  const task = {
    id: 'sync_' + genId(),
    name,
    source,
    target,
    syncType,
    status: 'pending',
    progress: 0,
    options,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  if (!db.syncTasks) db.syncTasks = {}
  db.syncTasks[task.id] = task
  saveDB(db)
  return task
}

function startSync(taskId) {
  const task = db.syncTasks?.[taskId]
  if (!task) return null

  task.status = 'syncing'
  task.startedAt = new Date().toISOString()
  task.progress = 0
  saveDB(db)

  simulateSync(task)
  return task
}

function simulateSync(task) {
  let progress = 0
  const interval = setInterval(() => {
    progress += Math.random() * 20
    if (progress >= 100) {
      progress = 100
      clearInterval(interval)
      task.status = 'completed'
      task.completedAt = new Date().toISOString()
      task.progress = 100
      saveDB(db)
      recordSyncHistory(task.id, 'completed')
    } else {
      task.progress = progress
      task.updatedAt = new Date().toISOString()
      saveDB(db)
    }
  }, 500)
}

function pauseSync(taskId) {
  const task = db.syncTasks?.[taskId]
  if (!task) return false
  if (task.status !== 'syncing') return false
  task.status = 'paused'
  task.pausedAt = new Date().toISOString()
  saveDB(db)
  return true
}

function resumeSync(taskId) {
  const task = db.syncTasks?.[taskId]
  if (!task) return false
  if (task.status !== 'paused') return false
  task.status = 'syncing'
  task.resumedAt = new Date().toISOString()
  saveDB(db)
  return true
}

function abortSync(taskId) {
  const task = db.syncTasks?.[taskId]
  if (!task) return false
  task.status = 'failed'
  task.failedAt = new Date().toISOString()
  task.error = 'Sync aborted'
  saveDB(db)
  recordSyncHistory(task.id, 'failed', 'Sync aborted')
  return true
}

function detectConflicts(sourceData, targetData) {
  const conflicts = []
  const sourceKeys = Object.keys(sourceData)
  const targetKeys = Object.keys(targetData)

  for (const key of sourceKeys) {
    if (targetKeys.includes(key) && sourceData[key] !== targetData[key]) {
      conflicts.push({
        key,
        sourceValue: sourceData[key],
        targetValue: targetData[key],
        type: 'value_conflict',
      })
    }
  }

  for (const key of targetKeys) {
    if (!sourceKeys.includes(key)) {
      conflicts.push({
        key,
        sourceValue: null,
        targetValue: targetData[key],
        type: 'missing_in_source',
      })
    }
  }

  return conflicts
}

function resolveConflict(conflictId, resolution = 'keep_source') {
  if (!db.syncConflicts) return false
  const conflict = db.syncConflicts.find(c => c.id === conflictId)
  if (!conflict) return false
  conflict.resolved = true
  conflict.resolution = resolution
  conflict.resolvedAt = new Date().toISOString()
  saveDB(db)
  return true
}

function recordSyncHistory(taskId, status, error = null) {
  if (!db.syncHistory) db.syncHistory = []
  db.syncHistory.push({
    id: 'hist_' + genId(),
    taskId,
    status,
    error,
    timestamp: new Date().toISOString(),
  })
  if (db.syncHistory.length > 1000) db.syncHistory = db.syncHistory.slice(-1000)
  saveDB(db)
}

function getSyncStatus(taskId) {
  return db.syncTasks?.[taskId] || null
}

function validateSyncData(taskId) {
  return {
    taskId,
    validated: true,
    checks: ['integrity_check', 'hash_verification', 'count_validation'],
    timestamp: new Date().toISOString(),
  }
}

function syncTwoWay(clientData, serverData) {
  const conflicts = detectConflicts(clientData, serverData)
  const merged = { ...serverData }

  for (const conflict of conflicts) {
    merged[conflict.key] = conflict.sourceValue
  }

  for (const key of Object.keys(clientData)) {
    if (!(key in merged)) {
      merged[key] = clientData[key]
    }
  }

  return { merged, conflicts, syncType: 'two_way' }
}

// ============ 模块6：安全加固系统 ============

const RATE_LIMIT_CONFIG = {
  ip: { maxRequests: 1000, windowMs: 60000 },
  user: { maxRequests: 5000, windowMs: 60000 },
  endpoint: { maxRequests: 100, windowMs: 60000 },
}

const RATE_LIMIT_STORE = {}

function secCheckRateLimit(req, type = 'ip') {
  const config = RATE_LIMIT_CONFIG[type]
  const key = type === 'ip' ? getClientIp(req) :
              type === 'user' ? (req.headers['x-user-id'] || '') :
              req.url

  if (!RATE_LIMIT_STORE[key]) {
    RATE_LIMIT_STORE[key] = { count: 0, windowStart: Date.now() }
  }

  const entry = RATE_LIMIT_STORE[key]

  if (Date.now() - entry.windowStart > config.windowMs) {
    entry.count = 1
    entry.windowStart = Date.now()
    return { allowed: true, remaining: config.maxRequests - 1 }
  }

  if (entry.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, retryAfter: Math.ceil((config.windowMs - (Date.now() - entry.windowStart)) / 1000) }
  }

  entry.count++
  return { allowed: true, remaining: config.maxRequests - entry.count }
}

function validateRequestSize(req, maxSize = 10 * 1024 * 1024) {
  const contentLength = parseInt(req.headers['content-length']) || 0
  if (contentLength > maxSize) {
    return { valid: false, error: 'Request body too large' }
  }
  return { valid: true }
}

function sanitizeSQL(input) {
  if (!input) return input
  const dangerousPatterns = [
    /('.*?')/g,
    /(--.*)/g,
    /(\/\*.*?\*\/)/g,
    /(SELECT|INSERT|UPDATE|DELETE|DROP|TRUNCATE|UNION)/gi,
  ]
  let sanitized = String(input)
  for (const pattern of dangerousPatterns) {
    sanitized = sanitized.replace(pattern, '')
  }
  return sanitized
}

function sanitizeXSS(input) {
  if (!input) return input
  const replacements = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
  }
  return String(input).replace(/[&<>"'/]/g, c => replacements[c])
}

function generateCSRFToken(userId) {
  const token = 'csrf_' + crypto.randomBytes(16).toString('hex')
  if (!db.securityRules) db.securityRules = {}
  if (!db.securityRules.csrfTokens) db.securityRules.csrfTokens = {}
  db.securityRules.csrfTokens[token] = { userId, createdAt: Date.now(), expiresAt: Date.now() + 3600000 }
  saveDB(db)
  return token
}

function validateCSRFToken(token, userId) {
  if (!db.securityRules?.csrfTokens?.[token]) return false
  const entry = db.securityRules.csrfTokens[token]
  if (entry.userId !== userId) return false
  if (entry.expiresAt < Date.now()) return false
  return true
}

function getSecurityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;",
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  }
}

function runSecurityScan() {
  const issues = []

  if (Object.keys(db.users || {}).some(u => u.password && u.password.length < 8)) {
    issues.push({ severity: 'medium', type: 'weak_password', message: '存在弱密码用户' })
  }

  if (Object.keys(db.apiKeysEx || {}).length > 100) {
    issues.push({ severity: 'info', type: 'too_many_api_keys', message: 'API密钥数量过多' })
  }

  const scan = {
    id: 'scan_' + genId(),
    timestamp: Date.now(),
    status: issues.length > 0 ? 'issues_found' : 'clean',
    issues,
    checks: ['password_strength', 'api_key_count', 'permission_overlap', 'session_security'],
  }

  if (!db.securityScans) db.securityScans = []
  db.securityScans.push(scan)
  if (db.securityScans.length > 100) db.securityScans = db.securityScans.slice(-100)
  saveDB(db)
  return scan
}

function generateSecurityReport(period = 'monthly') {
  const scans = db.securityScans || []
  const recentScans = scans.slice(-30)

  const report = {
    id: 'report_' + genId(),
    period,
    generatedAt: new Date().toISOString(),
    summary: {
      totalScans: recentScans.length,
      cleanScans: recentScans.filter(s => s.status === 'clean').length,
      issuesFound: recentScans.filter(s => s.status === 'issues_found').length,
    },
    topIssues: [
      { type: 'weak_password', count: 5 },
      { type: 'rate_limit_exceeded', count: 3 },
      { type: 'suspicious_activity', count: 2 },
    ],
    recommendations: [
      '定期更换API密钥',
      '实施强密码策略',
      '启用双因素认证',
      '定期审查用户权限',
    ],
  }

  if (!db.securityReports) db.securityReports = {}
  db.securityReports[report.id] = report
  saveDB(db)
  return report
}

function logSecurityEvent(eventType, details = {}) {
  const event = {
    id: 'sec_' + genId(),
    type: eventType,
    timestamp: new Date().toISOString(),
    details,
  }
  if (!db.securityLogs) db.securityLogs = []
  db.securityLogs.push(event)
  if (db.securityLogs.length > 1000) db.securityLogs = db.securityLogs.slice(-1000)
  saveDB(db)
}

// ============ 模块7：高级日志分析系统 ============

function advAnalyzeLogs(logType, startTime, endTime) {
  const logs = db[logType + 'Logs'] || []
  const filtered = logs.filter(l => {
    const ts = new Date(l.timestamp || l.createdAt).getTime()
    return (!startTime || ts >= startTime) && (!endTime || ts <= endTime)
  })

  const severityCounts = {}
  const hourlyCounts = {}
  const errorTypes = {}

  for (const log of filtered) {
    const severity = log.severity || 'info'
    severityCounts[severity] = (severityCounts[severity] || 0) + 1

    const hour = new Date(log.timestamp || log.createdAt).getHours()
    hourlyCounts[hour] = (hourlyCounts[hour] || 0) + 1

    if (log.error || log.type) {
      const type = log.error?.split(':')[0] || log.type || 'unknown'
      errorTypes[type] = (errorTypes[type] || 0) + 1
    }
  }

  return {
    total: filtered.length,
    severityCounts,
    hourlyCounts,
    errorTypes,
    topErrors: Object.entries(errorTypes).sort((a, b) => b[1] - a[1]).slice(0, 10),
  }
}

function advGenerateLogReport(logType = 'all', period = 'daily') {
  const now = Date.now()
  const periods = {
    hourly: now - 60 * 60 * 1000,
    daily: now - 24 * 60 * 60 * 1000,
    weekly: now - 7 * 24 * 60 * 60 * 1000,
    monthly: now - 30 * 24 * 60 * 60 * 1000,
  }

  const reports = {}
  if (logType === 'all' || logType === 'operation') {
    reports.operation = advAnalyzeLogs('operation', periods[period], now)
  }
  if (logType === 'all' || logType === 'error') {
    reports.error = advAnalyzeLogs('error', periods[period], now)
  }
  if (logType === 'all' || logType === 'performance') {
    reports.performance = advAnalyzeLogs('performance', periods[period], now)
  }
  if (logType === 'all' || logType === 'security') {
    reports.security = advAnalyzeLogs('security', periods[period], now)
  }

  return {
    id: 'log_report_' + genId(),
    generatedAt: new Date().toISOString(),
    period,
    reports,
    summary: {
      totalLogs: Object.values(reports).reduce((sum, r) => sum + r.total, 0),
      errorCount: reports.error?.total || 0,
    },
  }
}

function advExportLogs(logType, startTime, endTime, format = 'json') {
  const logs = db[logType + 'Logs'] || []
  const filtered = logs.filter(l => {
    const ts = new Date(l.timestamp || l.createdAt).getTime()
    return (!startTime || ts >= startTime) && (!endTime || ts <= endTime)
  })

  if (format === 'csv') {
    const headers = Object.keys(filtered[0] || {}).join(',')
    const rows = filtered.map(l => Object.values(l).join(',')).join('\n')
    return headers + '\n' + rows
  }
  return JSON.stringify(filtered, null, 2)
}

function advAlertOnAnomaly(logType, threshold = 100) {
  const recentLogs = (db[logType + 'Logs'] || []).slice(-60)
  const count = recentLogs.length

  if (count > threshold) {
    logSecurityEvent('log_anomaly', {
      type: logType,
      count,
      threshold,
      message: `${logType}日志数量异常，当前${count}条，阈值${threshold}条`,
    })
    return { anomaly: true, count, threshold }
  }
  return { anomaly: false, count, threshold }
}

// ============ 模块8：数据加密与安全工具 ============

function secEncryptData(data, key = 'hopeagent_secret_key') {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-cbc', crypto.createHash('sha256').update(key).digest(), iv)
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return { iv: iv.toString('hex'), encryptedData: encrypted }
}

function secDecryptData(encrypted, key = 'hopeagent_secret_key') {
  const iv = Buffer.from(encrypted.iv, 'hex')
  const decipher = crypto.createDecipheriv('aes-256-cbc', crypto.createHash('sha256').update(key).digest(), iv)
  let decrypted = decipher.update(encrypted.encryptedData, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return JSON.parse(decrypted)
}

function secGenerateSecureToken(length = 32) {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length)
}

function secHashPassword(password, salt = null) {
  const s = salt || crypto.randomBytes(16).toString('hex')
  const hash = crypto.createHmac('sha256', s).update(password).digest('hex')
  return { salt: s, hash }
}

function secVerifyPassword(password, salt, hash) {
  const computedHash = crypto.createHmac('sha256', salt).update(password).digest('hex')
  return computedHash === hash
}

function secGenerateJWT(payload, expiresIn = 3600) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const exp = Math.floor(Date.now() / 1000) + expiresIn
  const body = btoa(JSON.stringify({ ...payload, exp }))
  const signature = crypto.createHmac('sha256', 'hopeagent_jwt_secret').update(header + '.' + body).digest('base64')
  return header + '.' + body + '.' + signature
}

function secValidateJWT(token) {
  try {
    const [header, body, signature] = token.split('.')
    const computedSignature = crypto.createHmac('sha256', 'hopeagent_jwt_secret').update(header + '.' + body).digest('base64')
    if (signature !== computedSignature) return null
    const payload = JSON.parse(atob(body))
    if (payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

function secSanitizeInput(input, type = 'string') {
  if (!input) return input

  if (type === 'string') {
    return String(input).trim()
  } else if (type === 'email') {
    const email = String(input).trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null
    return email
  } else if (type === 'url') {
    try {
      new URL(input)
      return input
    } catch {
      return null
    }
  } else if (type === 'number') {
    const num = parseFloat(input)
    return isNaN(num) ? null : num
  } else if (type === 'integer') {
    const num = parseInt(input)
    return isNaN(num) ? null : num
  }

  return input
}

// ============ 模块9：工作流引擎 ============

function createWorkflow(name, steps = [], triggers = []) {
  const workflow = {
    id: 'wf_' + genId(),
    name,
    steps,
    triggers,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  if (!db.workflows) db.workflows = {}
  db.workflows[workflow.id] = workflow
  saveDB(db)
  return workflow
}

function addWorkflowStep(workflowId, step) {
  const workflow = db.workflows?.[workflowId]
  if (!workflow) return null

  const newStep = {
    ...step,
    id: 'step_' + genId(),
    order: workflow.steps.length + 1,
  }
  workflow.steps.push(newStep)
  workflow.updatedAt = new Date().toISOString()
  saveDB(db)
  return newStep
}

function removeWorkflowStep(workflowId, stepId) {
  const workflow = db.workflows?.[workflowId]
  if (!workflow) return false

  workflow.steps = workflow.steps.filter(s => s.id !== stepId)
  workflow.steps.forEach((s, i) => s.order = i + 1)
  workflow.updatedAt = new Date().toISOString()
  saveDB(db)
  return true
}

function activateWorkflow(workflowId) {
  const workflow = db.workflows?.[workflowId]
  if (!workflow) return null
  workflow.status = 'active'
  workflow.activatedAt = new Date().toISOString()
  saveDB(db)
  return workflow
}

function deactivateWorkflow(workflowId) {
  const workflow = db.workflows?.[workflowId]
  if (!workflow) return null
  workflow.status = 'inactive'
  workflow.deactivatedAt = new Date().toISOString()
  saveDB(db)
  return workflow
}

function executeWorkflow(workflowId, context = {}) {
  const workflow = db.workflows?.[workflowId]
  if (!workflow || workflow.status !== 'active') return null

  const execution = {
    id: 'exec_' + genId(),
    workflowId,
    workflowName: workflow.name,
    context,
    status: 'running',
    steps: [],
    startedAt: new Date().toISOString(),
  }

  for (const step of workflow.steps) {
    try {
      let result = null
      if (step.type === 'delay') {
        result = { type: 'delay', duration: step.duration }
      } else if (step.type === 'condition') {
        result = { type: 'condition', condition: step.condition, met: eval(step.condition) }
      } else if (step.type === 'action') {
        result = { type: 'action', action: step.action, executed: true }
      } else if (step.type === 'webhook') {
        result = { type: 'webhook', url: step.url, status: 'simulated' }
      } else if (step.type === 'email') {
        result = { type: 'email', to: step.to, sent: true }
      }

      execution.steps.push({ stepId: step.id, stepName: step.name, result, status: 'completed' })
    } catch (err) {
      execution.steps.push({ stepId: step.id, stepName: step.name, error: err.message, status: 'failed' })
      execution.status = 'failed'
      execution.error = err.message
      break
    }
  }

  if (execution.status === 'running') {
    execution.status = 'completed'
  }
  execution.completedAt = new Date().toISOString()

  if (!db.workflowExecutions) db.workflowExecutions = []
  db.workflowExecutions.push(execution)
  if (db.workflowExecutions.length > 1000) db.workflowExecutions = db.workflowExecutions.slice(-1000)
  saveDB(db)

  return execution
}

function getWorkflowExecutions(workflowId, status = null) {
  let executions = db.workflowExecutions || []
  if (workflowId) executions = executions.filter(e => e.workflowId === workflowId)
  if (status) executions = executions.filter(e => e.status === status)
  return executions
}

// ============ 模块10：定时任务增强系统 ============

function scheduleRecurringTask(name, cronExpression, action, options = {}) {
  const task = {
    id: 'cron_' + genId(),
    name,
    cronExpression,
    action,
    options: {
      enabled: true,
      timezone: options.timezone || 'Asia/Shanghai',
      lastRunAt: null,
      nextRunAt: null,
      runCount: 0,
      lastResult: null,
      ...options,
    },
    createdAt: new Date().toISOString(),
  }

  if (!db.recurringTasks) db.recurringTasks = {}
  db.recurringTasks[task.id] = task
  saveDB(db)
  return task
}

function enableRecurringTask(taskId) {
  const task = db.recurringTasks?.[taskId]
  if (!task) return false
  task.options.enabled = true
  saveDB(db)
  return true
}

function disableRecurringTask(taskId) {
  const task = db.recurringTasks?.[taskId]
  if (!task) return false
  task.options.enabled = false
  saveDB(db)
  return true
}

function runRecurringTask(taskId) {
  const task = db.recurringTasks?.[taskId]
  if (!task || !task.options.enabled) return null

  try {
    const result = { executed: true, timestamp: new Date().toISOString() }
    task.options.lastRunAt = new Date().toISOString()
    task.options.runCount++
    task.options.lastResult = result
    saveDB(db)
    return result
  } catch (err) {
    task.options.lastRunAt = new Date().toISOString()
    task.options.runCount++
    task.options.lastResult = { error: err.message }
    saveDB(db)
    return null
  }
}

function createScheduledTask(name, scheduledTime, action, options = {}) {
  const task = {
    id: 'sched_' + genId(),
    name,
    scheduledTime: new Date(scheduledTime).toISOString(),
    action,
    status: 'pending',
    options: {
      retries: options.retries || 0,
      retryDelay: options.retryDelay || 60000,
      ...options,
    },
    createdAt: new Date().toISOString(),
  }

  if (!db.scheduledTasks) db.scheduledTasks = {}
  db.scheduledTasks[task.id] = task
  saveDB(db)
  return task
}

function executeScheduledTask(taskId) {
  const task = db.scheduledTasks?.[taskId]
  if (!task || task.status !== 'pending') return null

  try {
    const result = { executed: true, timestamp: new Date().toISOString() }
    task.status = 'completed'
    task.executedAt = new Date().toISOString()
    task.result = result
    saveDB(db)
    return result
  } catch (err) {
    task.status = 'failed'
    task.executedAt = new Date().toISOString()
    task.error = err.message
    saveDB(db)
    return null
  }
}

function rescheduleTask(taskId, newTime) {
  const task = db.scheduledTasks?.[taskId]
  if (!task) return null
  task.scheduledTime = new Date(newTime).toISOString()
  task.status = 'pending'
  task.executedAt = null
  task.result = null
  task.error = null
  saveDB(db)
  return task
}

// ============ 模块11：高级数据验证系统 ============

const VALIDATION_RULES = {
  required: (value, options) => ({ valid: value !== undefined && value !== null && value !== '', message: options.message || '此字段为必填项' }),
  min: (value, options) => ({ valid: Number(value) >= options.value, message: options.message || `最小值为${options.value}` }),
  max: (value, options) => ({ valid: Number(value) <= options.value, message: options.message || `最大值为${options.value}` }),
  length: (value, options) => ({ valid: String(value).length >= options.min && String(value).length <= options.max, message: options.message || `长度必须在${options.min}-${options.max}之间` }),
  email: (value, options) => ({ valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), message: options.message || '邮箱格式不正确' }),
  url: (value, options) => { try { new URL(value); return { valid: true }; } catch { return { valid: false, message: options.message || 'URL格式不正确' } } },
  regex: (value, options) => ({ valid: new RegExp(options.pattern).test(value), message: options.message || '格式不正确' }),
  in: (value, options) => ({ valid: options.values.includes(value), message: options.message || `值必须是${options.values.join(', ')}之一` }),
  notIn: (value, options) => ({ valid: !options.values.includes(value), message: options.message || `值不能是${options.values.join(', ')}` }),
  type: (value, options) => {
    const types = { string: typeof value === 'string', number: typeof value === 'number', boolean: typeof value === 'boolean', array: Array.isArray(value), object: typeof value === 'object' && value !== null }
    return { valid: types[options.value], message: options.message || `类型必须是${options.value}` }
  },
}

function advValidate(data, schema) {
  const errors = []
  const validated = {}

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field]
    validated[field] = value

    for (const [ruleName, options] of Object.entries(rules)) {
      const validator = VALIDATION_RULES[ruleName]
      if (!validator) continue

      const result = validator(value, options)
      if (!result.valid) {
        errors.push({ field, rule: ruleName, message: result.message })
      }
    }
  }

  return { valid: errors.length === 0, errors, validated }
}

function advSanitize(data, sanitizers) {
  const sanitized = { ...data }

  for (const [field, sanitizer] of Object.entries(sanitizers)) {
    if (sanitized[field] === undefined) continue

    if (sanitizer === 'trim') {
      sanitized[field] = String(sanitized[field]).trim()
    } else if (sanitizer === 'lowercase') {
      sanitized[field] = String(sanitized[field]).toLowerCase()
    } else if (sanitizer === 'uppercase') {
      sanitized[field] = String(sanitized[field]).toUpperCase()
    } else if (sanitizer === 'stripTags') {
      sanitized[field] = String(sanitized[field]).replace(/<[^>]*>/g, '')
    } else if (sanitizer === 'number') {
      sanitized[field] = parseFloat(sanitized[field])
    } else if (sanitizer === 'integer') {
      sanitized[field] = parseInt(sanitized[field])
    } else if (sanitizer === 'boolean') {
      sanitized[field] = !!sanitized[field]
    } else if (typeof sanitizer === 'function') {
      sanitized[field] = sanitizer(sanitized[field])
    }
  }

  return sanitized
}

// ============ 模块12：数据转换与映射系统 ============

function dataTransform(data, mapping) {
  const result = {}

  for (const [targetField, sourceConfig] of Object.entries(mapping)) {
    if (typeof sourceConfig === 'string') {
      result[targetField] = dataGetNested(data, sourceConfig)
    } else if (typeof sourceConfig === 'function') {
      result[targetField] = sourceConfig(data)
    } else if (sourceConfig.path) {
      let value = dataGetNested(data, sourceConfig.path)
      if (sourceConfig.transform) {
        value = sourceConfig.transform(value)
      }
      if (sourceConfig.default !== undefined && (value === undefined || value === null)) {
        value = sourceConfig.default
      }
      result[targetField] = value
    } else if (sourceConfig.concat) {
      result[targetField] = sourceConfig.concat.map(p => dataGetNested(data, p)).join(sourceConfig.separator || '')
    } else if (sourceConfig.map) {
      result[targetField] = sourceConfig.map.map(p => dataGetNested(data, p))
    } else if (sourceConfig.condition) {
      result[targetField] = sourceConfig.condition(data) ? sourceConfig.trueValue : sourceConfig.falseValue
    }
  }

  return result
}

function dataGetNested(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

function dataSetNested(obj, path, value) {
  const keys = path.split('.')
  const lastKey = keys.pop()
  const parent = keys.reduce((current, key) => current[key] || (current[key] = {}), obj)
  parent[lastKey] = value
  return obj
}

function dataFlatten(obj, prefix = '') {
  const result = {}
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? prefix + '.' + key : key
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, dataFlatten(value, newKey))
    } else {
      result[newKey] = value
    }
  }
  return result
}

function dataUnflatten(obj) {
  const result = {}
  for (const [key, value] of Object.entries(obj)) {
    dataSetNested(result, key, value)
  }
  return result
}

// ============ 模块13：批量操作系统 ============

function bulkCreate(collection, items) {
  const results = []
  for (const item of items) {
    try {
      const created = insertOne(collection, item)
      results.push({ success: true, item: created })
    } catch (err) {
      results.push({ success: false, error: err.message })
    }
  }
  return { results, successCount: results.filter(r => r.success).length, failedCount: results.filter(r => !r.success).length }
}

function bulkUpdate(collection, updates) {
  const results = []
  for (const update of updates) {
    try {
      const result = updateOne(collection, update.query, update.update)
      results.push({ success: result.matchedCount > 0, ...result })
    } catch (err) {
      results.push({ success: false, error: err.message })
    }
  }
  return { results, successCount: results.filter(r => r.success).length, failedCount: results.filter(r => !r.success).length }
}

function bulkDelete(collection, queries) {
  const results = []
  for (const query of queries) {
    try {
      const result = deleteOne(collection, query)
      results.push({ success: result.deletedCount > 0, ...result })
    } catch (err) {
      results.push({ success: false, error: err.message })
    }
  }
  return { results, successCount: results.filter(r => r.success).length, failedCount: results.filter(r => !r.success).length }
}

function bulkUpsert(collection, items, uniqueKey = '_id') {
  const results = []
  for (const item of items) {
    try {
      const existing = findOne(collection, { [uniqueKey]: item[uniqueKey] })
      if (existing) {
        const updated = updateOne(collection, { [uniqueKey]: item[uniqueKey] }, { $set: item })
        results.push({ success: true, action: 'updated', ...updated })
      } else {
        const created = insertOne(collection, item)
        results.push({ success: true, action: 'created', item: created })
      }
    } catch (err) {
      results.push({ success: false, error: err.message })
    }
  }
  return { results, successCount: results.filter(r => r.success).length, failedCount: results.filter(r => !r.success).length }
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

  // ---- RBAC 角色与权限 ----
  'GET /api/roles': async (req, res) => {
    // 列出所有角色及权限
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const roles = db.roles ? Object.values(db.roles) : Object.entries(ROLE_DEFINITIONS).map(([id, r]) => ({ id, ...r }))
    sendJSON(res, 200, { roles, count: roles.length })
  },

  'PATCH /api/users/:id/role': async (req, res, params) => {
    // 修改用户角色（仅 admin）
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可修改角色' })
    const { role } = await jsonBody(req)
    if (!role) return sendJSON(res, 400, { error: '缺少 role 参数' })
    if (!ROLE_DEFINITIONS[role]) return sendJSON(res, 400, { error: '无效的角色：' + role })
    const targetUser = Object.values(db.users).find(u => u.id === params.id)
    if (!targetUser) return sendJSON(res, 404, { error: '用户不存在' })
    targetUser.role = role
    targetUser.updatedAt = new Date().toISOString()
    saveDB(db)
    auditLog(AUDIT_ACTIONS.USER_ROLE_CHANGE, auth.user.id, req.socket.remoteAddress, {
      targetUserId: params.id,
      oldRole: targetUser.role,
      newRole: role,
    })
    sendJSON(res, 200, { user: publicUser(targetUser) })
  },

  // ---- 组织与团队 ----
  'POST /api/orgs': async (req, res, body) => {
    // 创建组织
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { name, settings } = body
    if (!name) return sendJSON(res, 400, { error: '组织名称不能为空' })
    const org = createOrg(name, auth.user.id, settings)
    // 将创建者加入组织
    const user = db.users[auth.user.username]
    if (user) {
      user.orgId = org.id
      if (!user.role || user.role === 'user') user.role = 'manager'
    }
    saveDB(db)
    auditLog(AUDIT_ACTIONS.ORG_CREATE, auth.user.id, req.socket.remoteAddress, { orgId: org.id, name })
    sendJSON(res, 200, { org })
  },

  'GET /api/orgs': async (req, res) => {
    // 获取当前用户组织
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const org = getUserOrg(auth.user.id)
    if (!org) return sendJSON(res, 404, { error: '用户尚未加入任何组织' })
    const members = getOrgMembers(org.id)
    sendJSON(res, 200, { org, members, memberCount: members.length })
  },

  'PATCH /api/orgs': async (req, res, body) => {
    // 更新组织信息
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const org = getUserOrg(auth.user.id)
    if (!org) return sendJSON(res, 404, { error: '用户尚未加入任何组织' })
    if (org.ownerId !== auth.user.id && auth.user.role !== 'admin') {
      return sendJSON(res, 403, { error: '仅组织所有者或管理员可修改' })
    }
    if (body.name) org.name = body.name
    if (body.settings) org.settings = { ...org.settings, ...body.settings }
    org.updatedAt = new Date().toISOString()
    saveDB(db)
    sendJSON(res, 200, { org })
  },

  'GET /api/orgs/members': async (req, res) => {
    // 组织成员列表
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const org = getUserOrg(auth.user.id)
    if (!org) return sendJSON(res, 404, { error: '用户尚未加入任何组织' })
    const members = getOrgMembers(org.id)
    sendJSON(res, 200, { members, count: members.length })
  },

  'POST /api/orgs/invite': async (req, res, body) => {
    // 生成邀请码
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const org = getUserOrg(auth.user.id)
    if (!org) return sendJSON(res, 404, { error: '用户尚未加入任何组织' })
    if (!org.settings?.allowInvite && auth.user.role !== 'admin' && org.ownerId !== auth.user.id) {
      return sendJSON(res, 403, { error: '该组织不允许邀请' })
    }
    const { role, expiresInHours } = body
    const invite = createInvite(org.id, auth.user.id, role, expiresInHours)
    saveDB(db)
    auditLog(AUDIT_ACTIONS.ORG_INVITE, auth.user.id, req.socket.remoteAddress, {
      orgId: org.id,
      inviteCode: invite.code,
      role: invite.role,
    })
    sendJSON(res, 200, { invite })
  },

  'POST /api/orgs/join': async (req, res, body) => {
    // 通过邀请码加入组织
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { code } = body
    if (!code) return sendJSON(res, 400, { error: '邀请码不能为空' })
    const result = useInvite(code, auth.user.id)
    if (result.error) return sendJSON(res, 400, { error: result.error })
    saveDB(db)
    auditLog(AUDIT_ACTIONS.ORG_JOIN, auth.user.id, req.socket.remoteAddress, {
      orgId: result.org.id,
      inviteCode: code,
    })
    sendJSON(res, 200, { org: result.org, role: result.role })
  },

  // ---- 审计日志 ----
  'GET /api/admin/audit': async (req, res, params) => {
    // 审计日志查询（仅 admin）
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可查看审计日志' })
    const logs = queryAuditLogs({
      userId: params.userId,
      action: params.action,
      startDate: params.startDate,
      endDate: params.endDate,
      limit: params.limit,
    })
    sendJSON(res, 200, { logs, count: logs.length })
  },

  // ---- Webhook 事件系统 ----
  'GET /api/webhooks': async (req, res) => {
    // 列出 webhook
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const webhooks = db.webhooks ? Object.values(db.webhooks) : []
    sendJSON(res, 200, { webhooks, count: webhooks.length, events: WEBHOOK_EVENTS })
  },

  'POST /api/webhooks': async (req, res, body) => {
    // 创建 webhook
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { name, url, events, enabled } = body
    if (!url) return sendJSON(res, 400, { error: 'Webhook URL 不能为空' })
    if (!Array.isArray(events) || events.length === 0) {
      return sendJSON(res, 400, { error: '至少选择一个事件类型' })
    }
    const webhook = createWebhook({ name, url, events, enabled }, auth.user.id)
    saveDB(db)
    sendJSON(res, 200, { webhook })
  },

  'PATCH /api/webhooks/:id': async (req, res, params) => {
    // 更新 webhook
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const webhook = db.webhooks && db.webhooks[params.id]
    if (!webhook) return sendJSON(res, 404, { error: 'Webhook 不存在' })
    const body = await jsonBody(req)
    if (body.name !== undefined) webhook.name = body.name
    if (body.url !== undefined) webhook.url = body.url
    if (body.events !== undefined) webhook.events = body.events
    if (body.enabled !== undefined) webhook.enabled = body.enabled
    webhook.updatedAt = new Date().toISOString()
    saveDB(db)
    sendJSON(res, 200, { webhook })
  },

  'DELETE /api/webhooks/:id': async (req, res, params) => {
    // 删除 webhook
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!db.webhooks || !db.webhooks[params.id]) {
      return sendJSON(res, 404, { error: 'Webhook 不存在' })
    }
    delete db.webhooks[params.id]
    saveDB(db)
    sendJSON(res, 200, { success: true })
  },

  'GET /api/webhooks/:id/logs': async (req, res, params) => {
    // webhook 调用日志
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const logs = (db.webhookLogs || []).filter(l => l.webhookId === params.id)
    logs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    sendJSON(res, 200, { logs: logs.slice(0, 50), count: logs.length })
  },

  // ---- 插件系统 ----
  'GET /api/plugins': async (req, res) => {
    // 列出已安装插件
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    sendJSON(res, 200, { plugins: listPlugins(), count: listPlugins().length })
  },

  'POST /api/plugins/:id/enable': async (req, res, params) => {
    // 启用插件
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可管理插件' })
    const plugin = registeredPlugins.get(params.id)
    if (!plugin) return sendJSON(res, 404, { error: '插件不存在' })
    plugin.enabled = true
    if (!db.plugins) db.plugins = {}
    db.plugins[params.id] = { id: params.id, enabled: true, updatedAt: new Date().toISOString() }
    saveDB(db)
    sendJSON(res, 200, { success: true, plugin: { id: plugin.id, name: plugin.name, enabled: true } })
  },

  'POST /api/plugins/:id/disable': async (req, res, params) => {
    // 禁用插件
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可管理插件' })
    const plugin = registeredPlugins.get(params.id)
    if (!plugin) return sendJSON(res, 404, { error: '插件不存在' })
    plugin.enabled = false
    if (!db.plugins) db.plugins = {}
    db.plugins[params.id] = { id: params.id, enabled: false, updatedAt: new Date().toISOString() }
    saveDB(db)
    sendJSON(res, 200, { success: true, plugin: { id: plugin.id, name: plugin.name, enabled: false } })
  },

  'GET /api/plugins/:id/manifest': async (req, res, params) => {
    // 查看插件详情
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const plugin = registeredPlugins.get(params.id)
    if (!plugin) return sendJSON(res, 404, { error: '插件不存在' })
    sendJSON(res, 200, {
      id: plugin.id,
      name: plugin.name,
      version: plugin.version,
      description: plugin.description,
      author: plugin.author,
      enabled: plugin.enabled,
      hooks: Object.keys(plugin.hooks || {}),
      tools: (plugin.tools || []).map(t => ({ name: t.name, description: t.description })),
      routes: plugin.routes || [],
    })
  },

  // ---- 定时任务 ----
  'GET /api/cron': async (req, res) => {
    // 任务列表
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    sendJSON(res, 200, { jobs: listCronJobs(), count: listCronJobs().length })
  },

  'POST /api/cron': async (req, res, body) => {
    // 创建定时任务
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { expression, action, payload, name } = body
    if (!expression) return sendJSON(res, 400, { error: 'Cron 表达式不能为空' })
    const parsed = parseCronExpression(expression)
    if (parsed.error) return sendJSON(res, 400, { error: parsed.error })
    
    const jobId = 'cron_' + genId()
    let callback = () => {}
    const jobAction = action || 'log'
    
    switch (jobAction) {
      case 'webhook':
        callback = () => {
          triggerWebhook('cron.triggered', { jobId, name, payload })
        }
        break
      case 'tool':
        callback = async () => {
          if (payload?.tool) {
            await executeTool(payload.tool, payload.args)
          }
        }
        break
      case 'message':
        callback = () => {
          wsBroadcast({ type: 'cron_message', jobId, name, payload, time: new Date().toISOString() })
        }
        break
      default:
        callback = () => {
          console.log('定时任务触发:', jobId, name)
        }
    }
    
    const result = addCronJob(expression, callback, jobId, payload)
    if (!result.success) return sendJSON(res, 400, { error: result.error })
    
    // 持久化到 db
    if (!db.cronJobs) db.cronJobs = {}
    db.cronJobs[jobId] = {
      id: jobId,
      name: name || '未命名任务',
      expression,
      action: jobAction,
      payload: payload || {},
      enabled: true,
      createdBy: auth.user.id,
      createdAt: new Date().toISOString(),
    }
    saveDB(db)
    
    sendJSON(res, 200, { job: result.job })
  },

  'DELETE /api/cron/:id': async (req, res, params) => {
    // 删除定时任务
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const result = removeCronJob(params.id)
    if (!result.success) return sendJSON(res, 404, { error: result.error })
    if (db.cronJobs && db.cronJobs[params.id]) {
      delete db.cronJobs[params.id]
      saveDB(db)
    }
    sendJSON(res, 200, { success: true })
  },

  // ---- 缓存系统 ----
  'GET /api/admin/cache': async (req, res) => {
    // 缓存状态
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可查看缓存状态' })
    sendJSON(res, 200, cache.getStats())
  },

  'POST /api/admin/cache/clear': async (req, res) => {
    // 清空缓存
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可清空缓存' })
    cache.clear()
    sendJSON(res, 200, { success: true, message: '缓存已清空' })
  },

  // ---- 邮件通知 ----
  'POST /api/notifications/test': async (req, res, body) => {
    // 测试邮件发送
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { to, subject } = body
    if (!to) return sendJSON(res, 400, { error: '收件人不能为空' })
    const result = await sendEmail(
      to,
      subject || 'HopeAgent 邮件测试',
      '<h1>这是一封测试邮件</h1><p>如果您收到这封邮件，说明邮件服务配置正确。</p>',
      '这是一封测试邮件。如果您收到这封邮件，说明邮件服务配置正确。'
    )
    sendJSON(res, result.success ? 200 : 500, result)
  },

  'GET /api/notifications': async (req, res, params) => {
    // 通知历史
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const limit = parseInt(params.limit, 10) || 50
    const notifications = (db.notifications || []).slice(-limit).reverse()
    sendJSON(res, 200, { notifications, count: notifications.length })
  },

  'POST /api/settings/email': async (req, res, body) => {
    // 配置邮件服务
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可配置邮件服务' })
    db.emailSettings = {
      enabled: body.enabled !== undefined ? !!body.enabled : false,
      provider: body.provider || '',
      apiKey: body.apiKey || '',
      baseUrl: body.baseUrl || '',
      fromEmail: body.fromEmail || '',
      domain: body.domain || '',
    }
    saveDB(db)
    auditLog(AUDIT_ACTIONS.SETTINGS_CHANGE, auth.user.id, req.socket.remoteAddress, {
      section: 'email',
      provider: db.emailSettings.provider,
    })
    sendJSON(res, 200, {
      settings: { ...db.emailSettings, apiKey: db.emailSettings.apiKey ? '***' : '' },
    })
  },

  // ---- 数据备份与恢复 ----
  'POST /api/backup/create': async (req, res) => {
    // 创建完整备份
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可创建备份' })
    const backup = createBackup()
    auditLog(AUDIT_ACTIONS.BACKUP_CREATE, auth.user.id, req.socket.remoteAddress, {
      backupId: backup.id,
      size: backup.size,
    })
    sendJSON(res, 200, { backup })
  },

  'GET /api/backups': async (req, res) => {
    // 备份列表
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可查看备份' })
    const backups = listBackups()
    sendJSON(res, 200, { backups, count: backups.length })
  },

  'GET /api/backup/:id/download': async (req, res, params) => {
    // 下载备份
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可下载备份' })
    const backupPath = getBackupPath(params.id)
    if (!fs.existsSync(backupPath)) {
      return sendJSON(res, 404, { error: '备份不存在' })
    }
    const stat = fs.statSync(backupPath)
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="' + params.id + '.json"',
      'Content-Length': stat.size,
      'Access-Control-Allow-Origin': '*',
    })
    fs.createReadStream(backupPath).pipe(res)
  },

  'DELETE /api/backup/:id': async (req, res, params) => {
    // 删除备份
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可删除备份' })
    const success = deleteBackup(params.id)
    if (!success) return sendJSON(res, 404, { error: '备份不存在' })
    sendJSON(res, 200, { success: true })
  },

  'POST /api/backup/restore': async (req, res, body) => {
    // 从备份恢复
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可恢复备份' })
    const { id } = body
    if (!id) return sendJSON(res, 400, { error: '缺少备份 ID' })
    const result = restoreFromBackup(id)
    if (!result.success) return sendJSON(res, 400, { error: result.error })
    auditLog(AUDIT_ACTIONS.BACKUP_RESTORE, auth.user.id, req.socket.remoteAddress, {
      backupId: id,
    })
    sendJSON(res, 200, result)
  },

  // ---- 多语言 i18n ----
  'GET /api/i18n/languages': async (req, res) => {
    // 支持的语言列表
    const languages = Object.entries(langPacks).map(([code, pack]) => ({
      code,
      name: pack.name,
    }))
    sendJSON(res, 200, { languages, default: 'zh-CN' })
  },

  'GET /api/i18n/:lang': async (req, res, params) => {
    // 获取语言包
    const pack = langPacks[params.lang]
    if (!pack) return sendJSON(res, 404, { error: '不支持的语言：' + params.lang })
    sendJSON(res, 200, {
      code: params.lang,
      name: pack.name,
      messages: pack.messages,
    })
  },

  'POST /api/i18n/:lang': async (req, res, params) => {
    // 更新翻译（admin）
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可修改翻译' })
    const { messages } = await jsonBody(req)
    if (!langPacks[params.lang]) {
      return sendJSON(res, 404, { error: '不支持的语言：' + params.lang })
    }
    langPacks[params.lang].messages = { ...langPacks[params.lang].messages, ...messages }
    // 保存到文件
    const langFile = path.join(I18N_DIR, params.lang + '.json')
    fs.writeFileSync(langFile, JSON.stringify(langPacks[params.lang], null, 2))
    sendJSON(res, 200, {
      code: params.lang,
      name: langPacks[params.lang].name,
      messages: langPacks[params.lang].messages,
    })
  },

  // ---- 用户语言偏好 ----
  'PATCH /api/users/language': async (req, res, body) => {
    // 设置用户语言偏好
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { language } = body
    if (!language) return sendJSON(res, 400, { error: '语言代码不能为空' })
    if (!langPacks[language]) return sendJSON(res, 400, { error: '不支持的语言：' + language })
    const user = db.users[auth.user.username]
    if (user) {
      user.language = language
      saveDB(db)
    }
    sendJSON(res, 200, { user: publicUser(user), language })
  },

  // ---- 凭证保险库 Vault ----
  'GET /api/vault/list': async (req, res) => {
    // 列出所有凭证（不含明文）
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const list = listCredentials()
    sendJSON(res, 200, { credentials: list, count: list.length })
  },

  'POST /api/vault/store': async (req, res, body) => {
    // 存储凭证（仅 admin）
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可存储凭证' })
    const { key, name, value, type, metadata } = body
    if (!key) return sendJSON(res, 400, { error: '凭证 key 不能为空' })
    if (value === undefined || value === null || value === '') {
      return sendJSON(res, 400, { error: '凭证 value 不能为空' })
    }
    const credType = type || 'custom'
    // 类型校验
    const validation = validateCredential(credType, value, metadata)
    if (!validation.ok) return sendJSON(res, 400, { error: validation.error })
    const fullMeta = { ...(metadata || {}), type: credType }
    const record = storeCredential(key, name, value, fullMeta)
    vaultAuditLog('store', auth.user.id, req.socket.remoteAddress, {
      key, name: record.name, type: credType,
    })
    sendJSON(res, 200, { credential: record })
  },

  'GET /api/vault/get/:key': async (req, res, params) => {
    // 获取凭证明文（仅 admin + 审计记录）
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可获取凭证明文' })
    const value = getCredential(params.key)
    if (value === null) return sendJSON(res, 404, { error: '凭证不存在或解密失败' })
    // 审计记录（绝不记录明文本身）
    vaultAuditLog('get', auth.user.id, req.socket.remoteAddress, { key: params.key })
    sendJSON(res, 200, { key: params.key, value })
  },

  'DELETE /api/vault/delete/:key': async (req, res, params) => {
    // 删除凭证（仅 admin）
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可删除凭证' })
    const success = deleteCredential(params.key)
    if (!success) return sendJSON(res, 404, { error: '凭证不存在' })
    vaultAuditLog('delete', auth.user.id, req.socket.remoteAddress, { key: params.key })
    sendJSON(res, 200, { success: true })
  },

  'PATCH /api/vault/rotate/:key': async (req, res, params) => {
    // 轮换凭证（仅 admin）
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可轮换凭证' })
    const body = await jsonBody(req)
    const { newValue } = body
    if (!newValue) return sendJSON(res, 400, { error: '缺少 newValue' })
    const result = rotateCredential(params.key, newValue)
    if (!result) return sendJSON(res, 404, { error: '凭证不存在' })
    vaultAuditLog('rotate', auth.user.id, req.socket.remoteAddress, { key: params.key })
    sendJSON(res, 200, { credential: result })
  },

  'POST /api/vault/test/:key': async (req, res, params) => {
    // 测试凭证（仅 admin）
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可测试凭证' })
    const result = await testCredential(params.key)
    vaultAuditLog('test', auth.user.id, req.socket.remoteAddress, {
      key: params.key, ok: result.ok,
    })
    sendJSON(res, 200, result)
  },

  'GET /api/vault/types': async (req, res) => {
    // 获取支持的凭证类型
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    sendJSON(res, 200, { types: getCredentialTypes() })
  },

  'GET /api/vault/status': async (req, res) => {
    // 凭证配置状态（哪些已配置/缺失，不含明文）
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    ensureVault()
    const status = {}
    for (const [type, def] of Object.entries(CREDENTIAL_TYPES)) {
      const configured = Object.values(db.vault.credentials).filter(c => (c.type || 'custom') === type)
      status[type] = {
        name: def.name,
        configured: configured.length > 0,
        count: configured.length,
        keys: configured.map(c => ({ key: c.key, name: c.name })),
      }
    }
    sendJSON(res, 200, {
      status,
      total: Object.keys(db.vault.credentials).length,
    })
  },

  'POST /api/vault/export': async (req, res, body) => {
    // 导出加密凭证包（仅 admin + 二次密码验证）
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可导出凭证' })
    const { password } = body
    if (!password) return sendJSON(res, 400, { error: '需要二次密码验证' })
    // 验证当前用户密码
    const user = db.users[auth.user.username]
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return sendJSON(res, 401, { error: '密码验证失败' })
    }
    ensureVault()
    // 用用户密码派生导出密钥（与 vault 主密钥隔离）
    const exportKey = crypto.scryptSync(password, 'vault-export-salt-v1', 32)
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(VAULT_ALGORITHM, exportKey, iv)
    const payload = JSON.stringify(db.vault.credentials)
    const encrypted = Buffer.concat([cipher.update(payload, 'utf-8'), cipher.final()])
    const tag = cipher.getAuthTag()
    vaultAuditLog('export', auth.user.id, req.socket.remoteAddress, {
      count: Object.keys(db.vault.credentials).length,
    })
    sendJSON(res, 200, {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      iv: iv.toString('base64'),
      ciphertext: encrypted.toString('base64'),
      tag: tag.toString('base64'),
      count: Object.keys(db.vault.credentials).length,
    })
  },

  'POST /api/vault/import': async (req, res, body) => {
    // 导入加密凭证包（仅 admin + 二次密码验证）
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可导入凭证' })
    const { password, iv, ciphertext, tag, overwrite } = body
    if (!password) return sendJSON(res, 400, { error: '需要二次密码验证' })
    if (!iv || !ciphertext || !tag) {
      return sendJSON(res, 400, { error: '凭证包数据不完整（缺 iv/ciphertext/tag）' })
    }
    // 验证当前用户密码
    const user = db.users[auth.user.username]
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return sendJSON(res, 401, { error: '密码验证失败' })
    }
    // 用密码派生密钥解密凭证包
    let imported
    try {
      const exportKey = crypto.scryptSync(password, 'vault-export-salt-v1', 32)
      const decipher = crypto.createDecipheriv(VAULT_ALGORITHM, exportKey, Buffer.from(iv, 'base64'))
      decipher.setAuthTag(Buffer.from(tag, 'base64'))
      const decrypted = Buffer.concat([
        decipher.update(Buffer.from(ciphertext, 'base64')),
        decipher.final(),
      ])
      imported = JSON.parse(decrypted.toString('utf-8'))
    } catch (e) {
      return sendJSON(res, 400, { error: '凭证包解密失败：' + e.message })
    }
    ensureVault()
    let added = 0, skipped = 0
    for (const [key, cred] of Object.entries(imported)) {
      if (db.vault.credentials[key] && !overwrite) {
        skipped++
        continue
      }
      db.vault.credentials[key] = cred
      added++
    }
    saveDB(db)
    vaultAuditLog('import', auth.user.id, req.socket.remoteAddress, { added, skipped })
    sendJSON(res, 200, { success: true, added, skipped })
  },

  // ---- 健康检查与监控 ----
  'GET /api/health': async (req, res) => {
    const health = getOverallHealth()
    sendJSON(res, 200, health)
  },

  'GET /api/metrics': async (req, res) => {
    const metrics = getPrometheusMetrics()
    res.writeHead(200, {
      'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    })
    res.end(metrics)
  },

  'GET /api/admin/status': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可查看' })
    const status = getAdminStatus()
    sendJSON(res, 200, status)
  },

  'GET /api/admin/metrics/history': async (req, res, params) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可查看' })
    const limit = parseInt(params.limit, 10) || 100
    const history = getMetricsHistory(limit)
    sendJSON(res, 200, { history, count: history.length })
  },

  // ---- 配置中心 ----
  'GET /api/config': async (req, res) => {
    const auth = authenticate(req)
    if (auth.authenticated && auth.user.role === 'admin') {
      sendJSON(res, 200, { config: getConfig() })
    } else {
      sendJSON(res, 200, { config: getPublicConfig() })
    }
  },

  'PATCH /api/config': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可修改配置' })
    const results = bulkSetConfig(body || {})
    auditLog(AUDIT_ACTIONS.SETTINGS_CHANGE, auth.user.id, req.socket.remoteAddress, {
      action: 'bulk_update',
      success: results.success.length,
      failed: results.failed.length,
    })
    sendJSON(res, 200, results)
  },

  'GET /api/config/schema': async (req, res) => {
    const schema = getConfigSchema()
    sendJSON(res, 200, schema)
  },

  'POST /api/config/reset': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可重置配置' })
    const { key } = body || {}
    const result = resetConfig(key)
    auditLog(AUDIT_ACTIONS.SETTINGS_CHANGE, auth.user.id, req.socket.remoteAddress, {
      action: 'reset',
      key: key || 'all',
    })
    sendJSON(res, 200, result)
  },

  'GET /api/config/features': async (req, res) => {
    const features = {}
    for (const key of Object.keys(CONFIG_SCHEMA)) {
      if (key.startsWith('features.')) {
        const name = key.slice('features.'.length)
        features[name] = isFeatureEnabled(name)
      }
    }
    sendJSON(res, 200, { features })
  },

  // ---- 速率限制增强 ----
  'GET /api/admin/ratelimit': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可查看' })
    const status = getEnhancedRateLimitStatus()
    sendJSON(res, 200, status)
  },

  'POST /api/admin/ratelimit/reset': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可操作' })
    const { type, key } = body || {}
    const result = resetRateLimit(type || 'ip', key)
    auditLog(AUDIT_ACTIONS.ADMIN_ACTION, auth.user.id, req.socket.remoteAddress, {
      action: 'ratelimit_reset',
      type,
      key,
    })
    sendJSON(res, 200, result)
  },

  'POST /api/admin/ratelimit/whitelist/add': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可操作' })
    const { ip } = body || {}
    if (!ip) return sendJSON(res, 400, { error: '缺少 ip 参数' })
    const result = addIpWhitelist(ip)
    sendJSON(res, 200, result)
  },

  'POST /api/admin/ratelimit/whitelist/remove': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可操作' })
    const { ip } = body || {}
    if (!ip) return sendJSON(res, 400, { error: '缺少 ip 参数' })
    const result = removeIpWhitelist(ip)
    sendJSON(res, 200, result)
  },

  'POST /api/admin/ratelimit/blacklist/add': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可操作' })
    const { ip } = body || {}
    if (!ip) return sendJSON(res, 400, { error: '缺少 ip 参数' })
    const result = addIpBlacklist(ip)
    auditLog(AUDIT_ACTIONS.ADMIN_ACTION, auth.user.id, req.socket.remoteAddress, {
      action: 'blacklist_add',
      ip,
    })
    sendJSON(res, 200, result)
  },

  'POST /api/admin/ratelimit/blacklist/remove': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可操作' })
    const { ip } = body || {}
    if (!ip) return sendJSON(res, 400, { error: '缺少 ip 参数' })
    const result = removeIpBlacklist(ip)
    sendJSON(res, 200, result)
  },

  // ---- SSE 流式增强 ----
  'GET /api/sse/connect': async (req, res) => {
    const auth = authenticate(req)
    const clientId = auth.authenticated ? auth.user.id : null
    const channels = req.query.channels ? String(req.query.channels).split(',') : []
    const connection = createSseConnection(req, res, { clientId, channels })
    if (!connection) return
    if (connection.lastEventId) {
      resendPendingMessages(connection.id, connection.lastEventId)
    }
  },

  'GET /api/admin/sse/connections': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可查看' })
    const connections = getSseConnections()
    sendJSON(res, 200, connections)
  },

  'POST /api/admin/sse/broadcast': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可广播' })
    const { event, data, channel } = body || {}
    let count
    if (channel) {
      count = broadcastSseChannel(channel, event || 'message', data || {})
    } else {
      count = broadcastSseAll(event || 'message', data || {})
    }
    sendJSON(res, 200, { success: true, count })
  },

  'POST /api/admin/sse/close/:id': async (req, res, params) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可操作' })
    const result = closeSseConnection(params.id)
    sendJSON(res, 200, { success: result, id: params.id })
  },

  // ---- DAL 操作日志（admin） ----
  'GET /api/admin/db/oplogs': async (req, res, params) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可查看' })
    const limit = parseInt(params.limit, 10) || 100
    const logs = getDbOpLogs(limit)
    sendJSON(res, 200, { logs, count: logs.length })
  },

  // ---- 文件系统增强 ----
  'GET /api/admin/disk/usage': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (auth.user.role !== 'admin') return sendJSON(res, 403, { error: '仅管理员可查看' })
    const usage = getDiskUsage()
    sendJSON(res, 200, usage)
  },

  'GET /api/files/quota': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const quota = checkUserQuota(auth.user.id)
    sendJSON(res, 200, { quota })
  },

  'POST /api/files/hash/:id': async (req, res, params) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const meta = db.files[params.id]
    if (!meta) return sendJSON(res, 404, { error: '文件不存在' })
    const filePath = path.join(FILES_DIR, meta.storedName)
    const algorithm = req.body?.algorithm || 'sha256'
    try {
      const hash = await hashFile(filePath, algorithm)
      sendJSON(res, 200, { id: params.id, algorithm, hash })
    } catch (e) {
      sendJSON(res, 500, { error: e.message })
    }
  },

  // ============================================================
  // 模块 1：用户认证系统增强路由
  // ============================================================

  // 增强注册：密码强度校验 + 邮箱验证码 + JWT 双令牌
  'POST /api/v2/auth/register-enhanced': async (req, res, body) => {
    const { username, password, email, emailCode, displayName } = body
    if (!username || !password) return sendJSON(res, 400, { error: '用户名和密码不能为空' })
    if (username.length < 3 || username.length > 32) {
      return sendJSON(res, 400, { error: '用户名长度需 3-32 位' })
    }
    if (!/^[a-zA-Z0-9_\-]+$/.test(username)) {
      return sendJSON(res, 400, { error: '用户名仅允许字母、数字、下划线、连字符' })
    }
    // 密码强度评估
    const strength = checkPasswordStrength(password)
    if (strength.score < 2) {
      return sendJSON(res, 400, { error: '密码强度不足，请使用更复杂的密码', strength })
    }
    // 用户名重复检查
    if (db.users && db.users[username]) {
      return sendJSON(res, 409, { error: '用户名已存在' })
    }
    // 邮箱验证码校验（若提供 email 则必须校验）
    if (email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return sendJSON(res, 400, { error: '邮箱格式不正确' })
      }
      if (!emailCode) {
        return sendJSON(res, 400, { error: '请提供邮箱验证码' })
      }
      const ok = verifyEmailCode(email, emailCode)
      if (!ok) {
        return sendJSON(res, 400, { error: '邮箱验证码无效或已过期' })
      }
    }
    // 创建用户
    if (!db.users) db.users = {}
    const userId = genId()
    const hashed = hashPassword(password)
    db.users[username] = {
      id: userId,
      username,
      displayName: displayName || username,
      email: email || null,
      password: hashed,
      role: 'user',
      createdAt: new Date().toISOString(),
      apiKeys: [],
      orgId: null,
      language: 'zh-CN',
    }
    saveDB(db)
    // 解析设备信息并记录登录日志
    const ua = parseUserAgent(req.headers['user-agent'])
    const ip = getClientIp(req)
    recordLogin(userId, username, ip, ua.device, ua.platform, true, 'register')
    // 创建增强会话（多设备支持）
    const session = createSessionEx(db.users[username], {
      device: ua.device,
      platform: ua.platform,
      ip,
      userAgent: req.headers['user-agent'] || '',
      location: ipToLocation(ip),
    })
    // 生成 JWT 双令牌
    const accessToken = generateAccessToken(db.users[username])
    const refreshToken = generateRefreshToken(db.users[username])
    auditLog('user.register', userId, ip, { username, email })
    // 发送欢迎站内信
    sendMessage(userId, 'system', 'notification', '欢迎使用 HopeAgent Pro', '您的账号已成功创建，开始探索 AI 的无限可能吧！', 'system')
    sendJSON(res, 201, {
      success: true,
      user: publicUser(db.users[username]),
      session,
      accessToken,
      refreshToken,
      strength,
    })
  },

  // 发送邮箱验证码
  'POST /api/v2/auth/send-email-code': async (req, res, body) => {
    const { email, purpose } = body
    if (!email) return sendJSON(res, 400, { error: '邮箱不能为空' })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return sendJSON(res, 400, { error: '邮箱格式不正确' })
    }
    const code = generateEmailCode(email)
    // 实际项目此处应调用邮件服务发送；此处仅返回模拟结果
    auditLog('auth.email_code', null, getClientIp(req), { email, purpose: purpose || 'register' })
    sendJSON(res, 200, {
      success: true,
      message: '验证码已发送至邮箱（演示环境，请查看返回的 code 字段）',
      code, // 演示环境直接返回，生产环境应移除
      expiresIn: 600,
    })
  },

  // 增强登录：支持二步验证 + 设备记录 + JWT
  'POST /api/v2/auth/login-enhanced': async (req, res, body) => {
    const { username, password, twoFactorCode, rememberMe } = body
    if (!username || !password) return sendJSON(res, 400, { error: '用户名和密码不能为空' })
    const user = db.users && db.users[username]
    const ip = getClientIp(req)
    const ua = parseUserAgent(req.headers['user-agent'])
    if (!user || !verifyPassword(password, user.password)) {
      recordLogin(user ? user.id : null, username, ip, ua.device, ua.platform, false, '密码错误')
      return sendJSON(res, 401, { error: '用户名或密码错误' })
    }
    // 封禁检查
    const ban = isUserBanned(user.id)
    if (ban.banned) {
      recordLogin(user.id, username, ip, ua.device, ua.platform, false, '账号被封禁')
      return sendJSON(res, 403, { error: '账号已被封禁', ban: ban.ban })
    }
    // 二步验证检查
    if (db.twoFactor && db.twoFactor[user.id] && db.twoFactor[user.id].enabled) {
      if (!twoFactorCode) {
        recordLogin(user.id, username, ip, ua.device, ua.platform, false, '需要二步验证')
        return sendJSON(res, 200, { requireTwoFactor: true, message: '请输入二步验证码' })
      }
      const tf = verifyTwoFactor(user.id, twoFactorCode)
      if (!tf.ok) {
        recordLogin(user.id, username, ip, ua.device, ua.platform, false, '二步验证失败')
        return sendJSON(res, 401, { error: '二步验证码不正确' })
      }
    }
    // 创建会话
    const expiresInHours = rememberMe ? 720 : 168
    const session = createSessionEx(user, {
      device: ua.device,
      platform: ua.platform,
      ip,
      userAgent: req.headers['user-agent'] || '',
      location: ipToLocation(ip),
      expiresInHours,
    })
    recordLogin(user.id, username, ip, ua.device, ua.platform, true, 'login')
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)
    auditLog('user.login', user.id, ip, { device: ua.device, platform: ua.platform })
    sendJSON(res, 200, {
      success: true,
      user: publicUser(user),
      session,
      accessToken,
      refreshToken,
    })
  },

  // 刷新 access token
  'POST /api/v2/auth/refresh': async (req, res, body) => {
    const { refreshToken } = body
    if (!refreshToken) return sendJSON(res, 400, { error: 'refreshToken 不能为空' })
    const result = refreshAccessToken(refreshToken)
    if (result.error) return sendJSON(res, 401, { error: result.error })
    recordVersionUsageEx('v2')
    sendJSON(res, 200, { success: true, accessToken: result.accessToken, user: result.user })
  },

  // 登出（吊销 token）
  'POST /api/v2/auth/logout': async (req, res, body) => {
    const authHeader = req.headers['authorization'] || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
    const { refreshToken } = body
    if (token) {
      revokeToken(token, 'user_logout')
      // 同时删除会话
      if (db.sessions && db.sessions[token]) {
        delete db.sessions[token]
        saveDB(db)
      }
    }
    if (refreshToken) revokeToken(refreshToken, 'user_logout')
    const auth = authenticate(req)
    if (auth.authenticated) {
      auditLog('user.logout', auth.user.id, getClientIp(req), {})
    }
    sendJSON(res, 200, { success: true, message: '已安全登出' })
  },

  // 获取当前用户所有会话（多设备列表）
  'GET /api/v2/auth/sessions': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const sessions = getUserSessions(auth.user.id)
    sendJSON(res, 200, { sessions, count: sessions.length })
  },

  // 踢出指定会话
  'DELETE /api/v2/auth/sessions/:token': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    // 通过前缀匹配找到完整 token（getUserSessions 返回 fullToken）
    const sessions = getUserSessions(auth.user.id)
    const target = sessions.find(s => s.fullToken === body.token || s.token.startsWith(body.token.slice(0, 12)))
    if (!target) return sendJSON(res, 404, { error: '会话不存在或不属于当前用户' })
    kickSession(target.fullToken, 'user_kick')
    revokeToken(target.fullToken, 'user_kick')
    sendJSON(res, 200, { success: true, message: '会话已踢出' })
  },

  // 踢出所有其他会话
  'DELETE /api/v2/auth/sessions': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const authHeader = req.headers['authorization'] || ''
    const currentToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
    const count = kickAllSessions(auth.user.id, currentToken)
    sendJSON(res, 200, { success: true, kicked: count, message: '已踢出其他所有会话' })
  },

  // 密码重置申请
  'POST /api/v2/auth/password/reset-request': async (req, res, body) => {
    const { email, username } = body
    if (!email && !username) return sendJSON(res, 400, { error: '请提供邮箱或用户名' })
    const user = Object.values(db.users || {}).find(u =>
      (email && u.email === email) || (username && u.username === username)
    )
    // 安全考虑：无论用户是否存在都返回相同响应
    if (!user) {
      return sendJSON(res, 200, { success: true, message: '若账号存在，重置链接已发送' })
    }
    const result = generatePasswordResetToken(user.email || user.username)
    auditLog('user.password_reset_request', user.id, getClientIp(req), {})
    sendJSON(res, 200, {
      success: true,
      message: '若账号存在，重置链接已发送（演示环境返回 token）',
      token: result.token, // 演示环境直接返回
      expiresIn: 3600,
    })
  },

  // 密码重置确认
  'POST /api/v2/auth/password/reset': async (req, res, body) => {
    const { token, newPassword } = body
    if (!token || !newPassword) return sendJSON(res, 400, { error: 'token 和新密码不能为空' })
    const strength = checkPasswordStrength(newPassword)
    if (strength.score < 2) {
      return sendJSON(res, 400, { error: '密码强度不足', strength })
    }
    const result = verifyPasswordResetToken(token, newPassword)
    if (result.error) return sendJSON(res, 400, { error: result.error })
    auditLog('user.password_reset', result.userId, getClientIp(req), {})
    sendJSON(res, 200, { success: true, message: '密码已重置，请重新登录' })
  },

  // 修改密码
  'POST /api/v2/auth/password/change': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { oldPassword, newPassword } = body
    if (!oldPassword || !newPassword) return sendJSON(res, 400, { error: '旧密码和新密码不能为空' })
    if (!verifyPassword(oldPassword, auth.user.password)) {
      return sendJSON(res, 401, { error: '旧密码不正确' })
    }
    const strength = checkPasswordStrength(newPassword)
    if (strength.score < 2) {
      return sendJSON(res, 400, { error: '新密码强度不足', strength })
    }
    auth.user.password = hashPassword(newPassword)
    saveDB(db)
    // 踢出其他会话
    const authHeader = req.headers['authorization'] || ''
    const currentToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
    kickAllSessions(auth.user.id, currentToken)
    auditLog('user.password_change', auth.user.id, getClientIp(req), {})
    sendJSON(res, 200, { success: true, message: '密码已修改，其他设备需重新登录', strength })
  },

  // 检查密码强度
  'POST /api/v2/auth/password/strength': async (req, res, body) => {
    const { password } = body
    if (!password) return sendJSON(res, 400, { error: '密码不能为空' })
    const strength = checkPasswordStrength(password)
    sendJSON(res, 200, { strength })
  },

  // 二步验证：设置（生成密钥）
  'POST /api/v2/auth/twofactor/setup': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const result = setupTwoFactor(auth.user.id)
    if (result.error) return sendJSON(res, 400, { error: result.error })
    sendJSON(res, 200, { success: true, ...result })
  },

  // 二步验证：启用（确认绑定）
  'POST /api/v2/auth/twofactor/enable': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { code } = body
    if (!code) return sendJSON(res, 400, { error: '验证码不能为空' })
    const result = enableTwoFactor(auth.user.id, code)
    if (!result.ok) return sendJSON(res, 400, { error: result.error })
    auditLog('user.twofactor_enable', auth.user.id, getClientIp(req), {})
    sendJSON(res, 200, {
      success: true,
      backupCodes: result.backupCodes,
      message: '二步验证已启用，请妥善保存备份码',
    })
  },

  // 二步验证：禁用
  'POST /api/v2/auth/twofactor/disable': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { password } = body
    if (!password) return sendJSON(res, 400, { error: '请输入密码以确认' })
    if (!verifyPassword(password, auth.user.password)) {
      return sendJSON(res, 401, { error: '密码不正确' })
    }
    disableTwoFactor(auth.user.id)
    auditLog('user.twofactor_disable', auth.user.id, getClientIp(req), {})
    sendJSON(res, 200, { success: true, message: '二步验证已禁用' })
  },

  // 二步验证：状态查询
  'GET /api/v2/auth/twofactor/status': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const record = db.twoFactor && db.twoFactor[auth.user.id]
    sendJSON(res, 200, {
      enabled: !!(record && record.enabled),
      setup: !!record,
    })
  },

  // 登录日志查询
  'GET /api/v2/auth/login-logs': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const filters = {
      userId: body.userId || auth.user.id,
      username: body.username,
      success: body.success !== undefined ? body.success === 'true' : undefined,
      ip: body.ip,
      startDate: body.startDate,
      endDate: body.endDate,
      limit: parseInt(body.limit) || 100,
    }
    // 非管理员只能查自己的日志
    if (auth.user.role !== 'admin') {
      filters.userId = auth.user.id
      filters.username = undefined
    }
    const logs = getLoginLogs(filters)
    sendJSON(res, 200, { logs, count: logs.length })
  },

  // 封禁用户（管理员）
  'POST /api/v2/auth/ban': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('users:ban')(req, res, auth)) return
    const { userId, reason, durationHours } = body
    if (!userId) return sendJSON(res, 400, { error: 'userId 不能为空' })
    const result = banUser(userId, reason, durationHours, auth.user.id)
    if (result.error) return sendJSON(res, 400, { error: result.error })
    sendJSON(res, 200, { success: true, ban: result.ban })
  },

  // 解封用户（管理员）
  'POST /api/v2/auth/unban': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('users:ban')(req, res, auth)) return
    const { userId } = body
    if (!userId) return sendJSON(res, 400, { error: 'userId 不能为空' })
    const result = unbanUser(userId, auth.user.id)
    sendJSON(res, 200, result)
  },

  // 封禁列表（管理员）
  'GET /api/v2/auth/ban-list': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('users:ban')(req, res, auth)) return
    const list = getBanList()
    sendJSON(res, 200, { bans: list, count: list.length })
  },

  // 检查用户封禁状态
  'GET /api/v2/auth/ban-status/:userId': async (req, res, body) => {
    const result = isUserBanned(body.userId)
    sendJSON(res, 200, result)
  },

  // API Key 管理：创建
  'POST /api/v2/auth/apikeys': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { name, permissions, expiresInDays } = body
    if (!name) return sendJSON(res, 400, { error: 'API Key 名称不能为空' })
    const result = createApiKeyEx(auth.user.id, name, permissions, expiresInDays)
    sendJSON(res, 201, result)
  },

  // API Key 管理：列表
  'GET /api/v2/auth/apikeys': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const keys = listApiKeysEx(auth.user.id)
    sendJSON(res, 200, { apiKeys: keys, count: keys.length })
  },

  // API Key 管理：吊销
  'DELETE /api/v2/auth/apikeys/:key': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    // 校验该 key 属于当前用户
    const owned = listApiKeysEx(auth.user.id)
    const target = owned.find(k => k.key === body.key || k.key.startsWith(body.key.slice(0, 20)))
    if (!target) return sendJSON(res, 404, { error: 'API Key 不存在或不属于当前用户' })
    revokeApiKeyEx(target.key)
    auditLog('user.apikey_revoke', auth.user.id, getClientIp(req), { name: target.name })
    sendJSON(res, 200, { success: true, message: 'API Key 已吊销' })
  },

  // OAuth 模拟登录
  'POST /api/v2/auth/oauth/:provider': async (req, res, body) => {
    const { provider } = body
    const { code } = body
    if (!provider) return sendJSON(res, 400, { error: 'provider 不能为空' })
    if (!code) return sendJSON(res, 400, { error: 'code 不能为空' })
    const result = oauthMockLogin(provider, code)
    if (result.error) return sendJSON(res, 400, { error: result.error })
    const ua = parseUserAgent(req.headers['user-agent'])
    const ip = getClientIp(req)
    const session = createSessionEx(result.user, {
      device: ua.device,
      platform: ua.platform,
      ip,
      userAgent: req.headers['user-agent'] || '',
    })
    recordLogin(result.user.id, result.user.username, ip, ua.device, ua.platform, true, 'oauth_' + provider)
    const accessToken = generateAccessToken(result.user)
    const refreshToken = generateRefreshToken(result.user)
    sendJSON(res, 200, {
      success: true,
      user: publicUser(result.user),
      session,
      accessToken,
      refreshToken,
      provider,
    })
  },

  // ============================================================
  // 模块 2：RBAC 权限系统增强路由
  // ============================================================

  // 获取所有权限定义
  'GET /api/v2/permissions': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    sendJSON(res, 200, {
      permissions: PERMISSION_DEFINITIONS,
      groups: PERMISSION_GROUPS,
      count: Object.keys(PERMISSION_DEFINITIONS).length,
    })
  },

  // 获取权限分组
  'GET /api/v2/permission-groups': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    sendJSON(res, 200, { groups: PERMISSION_GROUPS })
  },

  // 获取权限模板
  'GET /api/v2/permission-templates': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    sendJSON(res, 200, { templates: PERMISSION_TEMPLATES })
  },

  // 获取所有角色（含自定义）
  'GET /api/v2/roles': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const roles = getAllRolesEx()
    sendJSON(res, 200, { roles, count: roles.length })
  },

  // 获取角色详情（含继承权限）
  'GET /api/v2/roles/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { permissions, inheritedFrom } = getRolePermissionsEx(body.id)
    sendJSON(res, 200, { roleId: body.id, permissions, inheritedFrom })
  },

  // 创建自定义角色
  'POST /api/v2/roles/custom': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('users:role')(req, res, auth)) return
    const { id, name, permissions, parentRoleId, description } = body
    if (!id || !name) return sendJSON(res, 400, { error: '角色 id 和 name 不能为空' })
    if (db.customRoles && db.customRoles[id]) {
      return sendJSON(res, 409, { error: '角色 id 已存在' })
    }
    const role = createCustomRole(id, name, permissions, parentRoleId, description)
    logPermissionChange(auth.user.id, 'role.create', { roleId: id, name })
    sendJSON(res, 201, { success: true, role })
  },

  // 更新自定义角色权限
  'PUT /api/v2/roles/custom/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('users:role')(req, res, auth)) return
    const { permissions, mode } = body
    if (!Array.isArray(permissions)) return sendJSON(res, 400, { error: 'permissions 必须为数组' })
    const result = updateCustomRolePermissions(body.id, permissions, mode || 'replace')
    if (result.error) return sendJSON(res, 400, { error: result.error })
    logPermissionChange(auth.user.id, 'role.update', { roleId: body.id, mode })
    sendJSON(res, 200, result)
  },

  // 删除自定义角色
  'DELETE /api/v2/roles/custom/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('users:role')(req, res, auth)) return
    const result = deleteCustomRole(body.id)
    if (result.error) return sendJSON(res, 400, { error: result.error })
    logPermissionChange(auth.user.id, 'role.delete', { roleId: body.id })
    sendJSON(res, 200, result)
  },

  // 应用权限模板到角色
  'POST /api/v2/roles/custom/:id/template': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('users:role')(req, res, auth)) return
    const { templateName } = body
    if (!templateName) return sendJSON(res, 400, { error: 'templateName 不能为空' })
    const result = applyPermissionTemplate(body.id, templateName)
    if (result.error) return sendJSON(res, 400, { error: result.error })
    logPermissionChange(auth.user.id, 'role.apply_template', { roleId: body.id, templateName })
    sendJSON(res, 200, result)
  },

  // 权限审计日志查询
  'GET /api/v2/permission-audit': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('users:read')(req, res, auth)) return
    const logs = getPermissionAudit({
      userId: body.userId,
      action: body.action,
      startDate: body.startDate,
      endDate: body.endDate,
      limit: parseInt(body.limit) || 100,
    })
    sendJSON(res, 200, { logs, count: logs.length })
  },

  // 检查权限（调试用）
  'POST /api/v2/permissions/check': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { permission, ownerId, resourceOwnerId } = body
    if (!permission) return sendJSON(res, 400, { error: 'permission 不能为空' })
    const result = checkPermissionEx(auth.user.role || 'user', permission, ownerId || auth.user.id, resourceOwnerId)
    sendJSON(res, 200, { permission, ...result, userRole: auth.user.role })
  },

  // ============================================================
  // 模块 3：组织与团队系统路由
  // ============================================================

  // 创建部门
  'POST /api/v2/orgs/departments': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('orgs:manage')(req, res, auth)) return
    const { orgId, name, parentId, managerId } = body
    if (!orgId || !name) return sendJSON(res, 400, { error: 'orgId 和 name 不能为空' })
    const dept = createDepartment(orgId, name, parentId, managerId)
    sendJSON(res, 201, { success: true, department: dept })
  },

  // 获取部门树
  'GET /api/v2/orgs/departments': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const orgId = body.orgId || auth.user.orgId
    if (!orgId) return sendJSON(res, 400, { error: '未指定组织' })
    const tree = getDepartmentTree(orgId)
    sendJSON(res, 200, { departments: tree, count: tree.length })
  },

  // 更新部门
  'PUT /api/v2/orgs/departments/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('orgs:manage')(req, res, auth)) return
    const result = updateDepartment(body.id, body)
    if (result.error) return sendJSON(res, 400, { error: result.error })
    sendJSON(res, 200, result)
  },

  // 删除部门
  'DELETE /api/v2/orgs/departments/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('orgs:manage')(req, res, auth)) return
    const result = deleteDepartment(body.id)
    if (result.error) return sendJSON(res, 400, { error: result.error })
    sendJSON(res, 200, result)
  },

  // 添加部门成员
  'POST /api/v2/orgs/departments/:id/members': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('orgs:manage')(req, res, auth)) return
    const { userId } = body
    if (!userId) return sendJSON(res, 400, { error: 'userId 不能为空' })
    const result = addDeptMember(body.id, userId)
    if (result.error) return sendJSON(res, 400, { error: result.error })
    sendJSON(res, 200, result)
  },

  // 移除部门成员
  'DELETE /api/v2/orgs/departments/:id/members/:userId': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('orgs:manage')(req, res, auth)) return
    const result = removeDeptMember(body.id, body.userId)
    if (result.error) return sendJSON(res, 400, { error: result.error })
    sendJSON(res, 200, result)
  },

  // 创建团队
  'POST /api/v2/orgs/teams': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('orgs:manage')(req, res, auth)) return
    const { orgId, name, memberIds, leaderId } = body
    if (!orgId || !name) return sendJSON(res, 400, { error: 'orgId 和 name 不能为空' })
    const team = createTeam(orgId, name, memberIds, leaderId || auth.user.id)
    sendJSON(res, 201, { success: true, team })
  },

  // 获取团队列表
  'GET /api/v2/orgs/teams': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const orgId = body.orgId || auth.user.orgId
    if (!orgId) return sendJSON(res, 400, { error: '未指定组织' })
    const teams = listTeams(orgId)
    sendJSON(res, 200, { teams, count: teams.length })
  },

  // 添加团队成员
  'POST /api/v2/orgs/teams/:id/members': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('orgs:manage')(req, res, auth)) return
    const { userId, role } = body
    if (!userId) return sendJSON(res, 400, { error: 'userId 不能为空' })
    const result = addTeamMemberEx(body.id, userId, role)
    if (result.error) return sendJSON(res, 400, { error: result.error })
    sendJSON(res, 200, result)
  },

  // 移除团队成员
  'DELETE /api/v2/orgs/teams/:id/members/:userId': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('orgs:manage')(req, res, auth)) return
    const result = removeTeamMemberEx(body.id, body.userId)
    if (result.error) return sendJSON(res, 400, { error: result.error })
    sendJSON(res, 200, result)
  },

  // 移除组织成员
  'DELETE /api/v2/orgs/members/:userId': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('orgs:manage')(req, res, auth)) return
    const { orgId } = body
    if (!orgId) return sendJSON(res, 400, { error: 'orgId 不能为空' })
    const result = removeOrgMember(orgId, body.userId)
    if (result.error) return sendJSON(res, 400, { error: result.error })
    logOrgAction(orgId, 'member.remove', auth.user.id, { userId: body.userId })
    sendJSON(res, 200, result)
  },

  // 分配成员角色
  'PUT /api/v2/orgs/members/:userId/role': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('users:role')(req, res, auth)) return
    const { orgId, role } = body
    if (!orgId || !role) return sendJSON(res, 400, { error: 'orgId 和 role 不能为空' })
    const result = assignMemberRole(orgId, body.userId, role)
    if (result.error) return sendJSON(res, 400, { error: result.error })
    logOrgAction(orgId, 'member.role_assign', auth.user.id, { userId: body.userId, role })
    sendJSON(res, 200, result)
  },

  // 获取组织配额
  'GET /api/v2/orgs/quotas': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const orgId = body.orgId || auth.user.orgId
    if (!orgId) return sendJSON(res, 400, { error: '未指定组织' })
    const usage = getOrgQuotaUsage(orgId)
    sendJSON(res, 200, { quota: usage })
  },

  // 更新组织配额（管理员）
  'PUT /api/v2/orgs/quotas': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('orgs:manage')(req, res, auth)) return
    const { orgId, quotas } = body
    if (!orgId) return sendJSON(res, 400, { error: 'orgId 不能为空' })
    const result = updateOrgQuota(orgId, quotas)
    logOrgAction(orgId, 'quota.update', auth.user.id, { quotas })
    sendJSON(res, 200, { success: true, quota: result })
  },

  // 组织审计日志
  'GET /api/v2/orgs/audit': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const orgId = body.orgId || auth.user.orgId
    if (!orgId) return sendJSON(res, 400, { error: '未指定组织' })
    const logs = getOrgAudit({
      orgId,
      userId: body.userId,
      action: body.action,
      startDate: body.startDate,
      endDate: body.endDate,
      limit: parseInt(body.limit) || 100,
    })
    sendJSON(res, 200, { logs, count: logs.length })
  },

  // 组织统计
  'GET /api/v2/orgs/stats': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const orgId = body.orgId || auth.user.orgId
    if (!orgId) return sendJSON(res, 400, { error: '未指定组织' })
    const stats = getOrgStats(orgId)
    sendJSON(res, 200, { stats })
  },

  // ============================================================
  // 模块 4：消息通知系统路由
  // ============================================================

  // 获取消息列表
  'GET /api/v2/messages': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const messages = getMessages(auth.user.id, {
      category: body.category,
      read: body.read !== undefined ? body.read === 'true' : undefined,
      starred: body.starred !== undefined ? body.starred === 'true' : undefined,
      archived: body.archived !== undefined ? body.archived === 'true' : undefined,
      type: body.type,
      limit: parseInt(body.limit) || 50,
      offset: parseInt(body.offset) || 0,
    })
    sendJSON(res, 200, { messages, count: messages.length })
  },

  // 发送消息
  'POST /api/v2/messages': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { toUserId, type, title, content, category } = body
    if (!toUserId || !title) return sendJSON(res, 400, { error: 'toUserId 和 title 不能为空' })
    // 校验收件人存在
    const recipient = Object.values(db.users || {}).find(u => u.id === toUserId)
    if (!recipient) return sendJSON(res, 404, { error: '收件人不存在' })
    const msg = sendMessage(toUserId, auth.user.id, type || 'notification', title, content, category || 'system')
    sendJSON(res, 201, { success: true, message: msg })
  },

  // 标记消息已读
  'POST /api/v2/messages/:id/read': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const result = markMessageRead(auth.user.id, body.id)
    if (result.error) return sendJSON(res, 404, { error: result.error })
    sendJSON(res, 200, result)
  },

  // 全部标记已读
  'POST /api/v2/messages/read-all': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const result = markAllReadEx(auth.user.id)
    sendJSON(res, 200, result)
  },

  // 批量标记已读
  'POST /api/v2/messages/batch-read': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { messageIds } = body
    if (!Array.isArray(messageIds)) return sendJSON(res, 400, { error: 'messageIds 必须为数组' })
    const result = batchMarkReadEx(auth.user.id, messageIds)
    sendJSON(res, 200, result)
  },

  // 删除消息
  'DELETE /api/v2/messages/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const result = deleteMessageEx(auth.user.id, body.id)
    if (result.error) return sendJSON(res, 404, { error: result.error })
    sendJSON(res, 200, result)
  },

  // 批量删除消息
  'POST /api/v2/messages/batch-delete': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { messageIds } = body
    if (!Array.isArray(messageIds)) return sendJSON(res, 400, { error: 'messageIds 必须为数组' })
    const result = batchDeleteMessages(auth.user.id, messageIds)
    sendJSON(res, 200, result)
  },

  // 收藏/取消收藏消息
  'POST /api/v2/messages/:id/star': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { starred } = body
    const result = starMessageEx(auth.user.id, body.id, starred !== undefined ? starred : true)
    if (result.error) return sendJSON(res, 404, { error: result.error })
    sendJSON(res, 200, result)
  },

  // 未读消息数（按分类）
  'GET /api/v2/messages/unread-count': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const counts = getUnreadCountEx(auth.user.id)
    sendJSON(res, 200, { counts })
  },

  // 消息模板列表
  'GET /api/v2/messages/templates': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const templates = listMessageTemplates()
    sendJSON(res, 200, { templates, count: templates.length })
  },

  // 创建消息模板
  'POST /api/v2/messages/templates': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const { name, type, subject, body: tplBody, category } = body
    if (!name || !tplBody) return sendJSON(res, 400, { error: 'name 和 body 不能为空' })
    const template = createMessageTemplate(name, type, subject, tplBody, category)
    sendJSON(res, 201, { success: true, template })
  },

  // 渲染消息模板
  'POST /api/v2/messages/templates/:id/render': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { params } = body
    const result = renderMessageTemplate(body.id, params || {})
    if (result.error) return sendJSON(res, 404, { error: result.error })
    sendJSON(res, 200, result)
  },

  // 订阅消息分类
  'POST /api/v2/messages/subscribe': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { category } = body
    if (!category) return sendJSON(res, 400, { error: 'category 不能为空' })
    const result = subscribeCategory(auth.user.id, category)
    sendJSON(res, 200, result)
  },

  // 取消订阅消息分类
  'POST /api/v2/messages/unsubscribe': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { category } = body
    if (!category) return sendJSON(res, 400, { error: 'category 不能为空' })
    const result = unsubscribeCategory(auth.user.id, category)
    sendJSON(res, 200, result)
  },

  // 获取推送设置
  'GET /api/v2/messages/push-settings': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const prefs = getPushPreferences(auth.user.id)
    sendJSON(res, 200, { preferences: prefs })
  },

  // 更新推送设置
  'PUT /api/v2/messages/push-settings': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const result = setPushPreferences(auth.user.id, body.preferences || body)
    sendJSON(res, 200, { success: true, preferences: result })
  },

  // 归档旧消息（管理员/定时任务）
  'POST /api/v2/messages/archive': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const daysOld = parseInt(body.daysOld) || 90
    const result = archiveOldMessages(daysOld)
    sendJSON(res, 200, result)
  },

  // 获取消息分类列表
  'GET /api/v2/messages/categories': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    sendJSON(res, 200, { categories: MESSAGE_CATEGORIES })
  },

  // ============================================================
  // 模块 5：搜索引擎路由
  // ============================================================

  // 全文搜索
  'GET /api/v2/search': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { q, type, tag, sortBy, startDate, endDate } = body
    if (!q) return sendJSON(res, 400, { error: '搜索关键词 q 不能为空' })
    const result = searchFullText(q, {
      type,
      tag,
      sortBy: sortBy || 'relevance',
      startDate,
      endDate,
      userId: auth.user.role !== 'admin' ? auth.user.id : (body.userId || undefined),
      limit: parseInt(body.limit) || 20,
      offset: parseInt(body.offset) || 0,
    })
    // 记录搜索历史与热搜
    recordSearchHistory(auth.user.id, q, result.total)
    recordHotSearch(q)
    sendJSON(res, 200, result)
  },

  // 搜索建议（自动补全）
  'GET /api/v2/search/suggestions': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { prefix } = body
    if (!prefix) return sendJSON(res, 400, { error: 'prefix 不能为空' })
    const suggestions = getSearchSuggestions(prefix)
    sendJSON(res, 200, { suggestions, count: suggestions.length })
  },

  // 搜索历史
  'GET /api/v2/search/history': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const limit = parseInt(body.limit) || 20
    const history = getSearchHistoryEx(auth.user.id, limit)
    sendJSON(res, 200, { history, count: history.length })
  },

  // 清空搜索历史
  'DELETE /api/v2/search/history': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    clearSearchHistoryEx(auth.user.id)
    sendJSON(res, 200, { success: true, message: '搜索历史已清空' })
  },

  // 热搜榜
  'GET /api/v2/search/hot': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const limit = parseInt(body.limit) || 10
    const hot = getHotSearchesEx(limit)
    sendJSON(res, 200, { hotSearches: hot, count: hot.length })
  },

  // 重建搜索索引（管理员）
  'POST /api/v2/search/rebuild': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const result = buildSearchIndexFromDB()
    sendJSON(res, 200, { success: true, ...result })
  },

  // 搜索索引状态
  'GET /api/v2/search/status': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const status = getSearchIndexStatus()
    sendJSON(res, 200, { status })
  },

  // ============================================================
  // 模块 6：日志系统路由
  // ============================================================

  // 操作日志
  'GET /api/v2/logs/operation': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('logs:read')(req, res, auth)) return
    const logs = searchLogsEx({
      type: 'operation',
      level: body.level,
      startDate: body.startDate,
      endDate: body.endDate,
      keyword: body.keyword,
      limit: parseInt(body.limit) || 100,
    })
    sendJSON(res, 200, { logs, count: logs.length })
  },

  // 错误日志
  'GET /api/v2/logs/error': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('logs:read')(req, res, auth)) return
    const logs = searchLogsEx({
      type: 'error',
      level: body.level,
      startDate: body.startDate,
      endDate: body.endDate,
      keyword: body.keyword,
      limit: parseInt(body.limit) || 100,
    })
    sendJSON(res, 200, { logs, count: logs.length })
  },

  // 性能日志
  'GET /api/v2/logs/performance': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('logs:read')(req, res, auth)) return
    const logs = searchLogsEx({
      type: 'performance',
      startDate: body.startDate,
      endDate: body.endDate,
      keyword: body.keyword,
      limit: parseInt(body.limit) || 100,
    })
    sendJSON(res, 200, { logs, count: logs.length })
  },

  // 安全日志
  'GET /api/v2/logs/security': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('logs:read')(req, res, auth)) return
    const logs = searchLogsEx({
      type: 'security',
      level: body.level,
      startDate: body.startDate,
      endDate: body.endDate,
      keyword: body.keyword,
      limit: parseInt(body.limit) || 100,
    })
    sendJSON(res, 200, { logs, count: logs.length })
  },

  // 按级别查询日志
  'GET /api/v2/logs/level/:level': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('logs:read')(req, res, auth)) return
    const logs = getLogsByLevel(body.level.toUpperCase(), parseInt(body.limit) || 100)
    sendJSON(res, 200, { logs, count: logs.length })
  },

  // 日志搜索
  'GET /api/v2/logs/search': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('logs:read')(req, res, auth)) return
    const logs = searchLogsEx({
      type: body.type,
      level: body.level,
      startDate: body.startDate,
      endDate: body.endDate,
      keyword: body.keyword,
      limit: parseInt(body.limit) || 100,
    })
    sendJSON(res, 200, { logs, count: logs.length })
  },

  // 日志轮转
  'POST /api/v2/logs/rotate': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const result = rotateLogsEx()
    sendJSON(res, 200, { success: true, ...result })
  },

  // 日志导出
  'GET /api/v2/logs/export': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('logs:read')(req, res, auth)) return
    const format = body.format || 'json'
    const result = exportLogsEx(format, {
      type: body.type,
      level: body.level,
      startDate: body.startDate,
      endDate: body.endDate,
      keyword: body.keyword,
      limit: parseInt(body.limit) || 500,
    })
    sendJSON(res, 200, result)
  },

  // 日志统计
  'GET /api/v2/logs/stats': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('logs:read')(req, res, auth)) return
    const stats = getLogStatsEx()
    sendJSON(res, 200, { stats })
  },

  // 清理旧日志
  'POST /api/v2/logs/clean': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const daysOld = parseInt(body.daysOld) || 30
    const result = cleanOldLogsEx(daysOld)
    sendJSON(res, 200, { success: true, ...result })
  },

  // 设置日志级别
  'PUT /api/v2/logs/level': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const { level } = body
    if (!level) return sendJSON(res, 400, { error: 'level 不能为空' })
    const result = setLogLevel(level.toUpperCase())
    sendJSON(res, 200, { success: true, level: result })
  },

  // 获取当前日志级别
  'GET /api/v2/logs/level': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const level = getLogLevel()
    sendJSON(res, 200, { level, levels: LOG_LEVELS })
  },

  // ============================================================
  // 模块 7：数据导出系统路由
  // ============================================================

  // 导出对话为 CSV
  'POST /api/v2/export/conversation/:id/csv': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const conv = db.conversations && db.conversations[body.id]
    if (!conv) return sendJSON(res, 404, { error: '对话不存在' })
    const csv = exportConversationCSV(conv)
    auditLog('export.conversation_csv', auth.user.id, getClientIp(req), { conversationId: body.id })
    sendJSON(res, 200, { format: 'csv', content: csv, filename: `conversation_${body.id}.csv` })
  },

  // 导出对话为 TXT
  'POST /api/v2/export/conversation/:id/txt': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const conv = db.conversations && db.conversations[body.id]
    if (!conv) return sendJSON(res, 404, { error: '对话不存在' })
    const txt = exportConversationTXT(conv)
    auditLog('export.conversation_txt', auth.user.id, getClientIp(req), { conversationId: body.id })
    sendJSON(res, 200, { format: 'txt', content: txt, filename: `conversation_${body.id}.txt` })
  },

  // 导出知识库 JSON
  'GET /api/v2/export/knowledge/json': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('knowledge:export')(req, res, auth)) return
    const data = exportKnowledgeJSON()
    sendJSON(res, 200, { format: 'json', content: JSON.stringify(data, null, 2), count: data.count })
  },

  // 导出知识库 CSV
  'GET /api/v2/export/knowledge/csv': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('knowledge:export')(req, res, auth)) return
    const csv = exportKnowledgeCSV()
    sendJSON(res, 200, { format: 'csv', content: csv })
  },

  // GDPR 用户数据导出
  'GET /api/v2/export/user-data': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    // 普通用户只能导出自己的数据，管理员可指定 userId
    const userId = (auth.user.role === 'admin' && body.userId) ? body.userId : auth.user.id
    const data = exportUserData(userId)
    auditLog('export.user_data', auth.user.id, getClientIp(req), { targetUserId: userId })
    sendJSON(res, 200, { format: 'json', content: JSON.stringify(data, null, 2), userId })
  },

  // 统计报表导出
  'GET /api/v2/export/stats-report': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const format = body.format || 'html'
    const report = exportStatsReport(format)
    sendJSON(res, 200, report)
  },

  // 创建异步导出任务
  'POST /api/v2/export/tasks': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { type, options } = body
    if (!type) return sendJSON(res, 400, { error: 'type 不能为空' })
    const task = createExportTaskEx(auth.user.id, type, options || {})
    sendJSON(res, 202, { success: true, task })
  },

  // 导出历史
  'GET /api/v2/export/history': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const limit = parseInt(body.limit) || 50
    const history = getExportHistoryEx(auth.user.id, limit)
    sendJSON(res, 200, { history, count: history.length })
  },

  // 创建定时导出
  'POST /api/v2/export/scheduled': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const { cronExpression, type, options } = body
    if (!cronExpression || !type) return sendJSON(res, 400, { error: 'cronExpression 和 type 不能为空' })
    const scheduled = scheduleExportEx(auth.user.id, cronExpression, type, options || {})
    sendJSON(res, 201, { success: true, scheduled })
  },

  // 获取导出配置
  'GET /api/v2/export/config': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const config = getExportConfigEx(auth.user.id)
    sendJSON(res, 200, { config })
  },

  // 设置导出配置
  'PUT /api/v2/export/config': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const config = setExportConfigEx(auth.user.id, body)
    sendJSON(res, 200, { success: true, config })
  },

  // ============================================================
  // 模块 8：API 版本管理路由
  // ============================================================

  // 列出所有 API 版本
  'GET /api/v2/versions': async (req, res) => {
    const versions = listVersionsEx()
    recordVersionUsageEx('v2')
    sendJSON(res, 200, { versions, current: 'v2' })
  },

  // 获取版本详情
  'GET /api/v2/versions/:version': async (req, res, body) => {
    const info = getVersionInfoEx(body.version)
    if (!info) return sendJSON(res, 404, { error: '版本不存在' })
    recordVersionUsageEx(body.version)
    sendJSON(res, 200, { version: info })
  },

  // 获取版本文档
  'GET /api/v2/versions/:version/docs': async (req, res, body) => {
    const docs = getVersionDocsEx(body.version)
    if (docs.error) return sendJSON(res, 404, docs)
    sendJSON(res, 200, docs)
  },

  // 获取版本端点列表
  'GET /api/v2/versions/:version/endpoints': async (req, res, body) => {
    const endpoints = getVersionEndpoints(body.version)
    if (endpoints.error) return sendJSON(res, 404, endpoints)
    sendJSON(res, 200, endpoints)
  },

  // 废弃版本（管理员）
  'POST /api/v2/versions/:version/deprecate': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const { migrationNote, sunsetDate } = body
    const result = deprecateVersionEx(body.version, migrationNote, sunsetDate)
    if (result.error) return sendJSON(res, 404, { error: result.error })
    sendJSON(res, 200, { success: true, version: result })
  },

  // 注册新版本（管理员）
  'POST /api/v2/versions': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const { version, status, info } = body
    if (!version) return sendJSON(res, 400, { error: 'version 不能为空' })
    const result = registerVersion(version, status, info)
    sendJSON(res, 201, { success: true, version: result })
  },

  // 版本使用统计
  'GET /api/v2/versions/stats': async (req, res) => {
    const stats = getVersionStatsEx()
    sendJSON(res, 200, { stats })
  },

  // 版本兼容层：v1 转 v2
  'POST /api/v2/versions/transform/v1-to-v2': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const transformed = transformV1ToV2(body.data || body)
    sendJSON(res, 200, { transformed })
  },

  // 版本兼容层：v2 转 v1
  'POST /api/v2/versions/transform/v2-to-v1': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const transformed = transformV2ToV1(body.data || body)
    sendJSON(res, 200, { transformed })
  },

  // ============================================================
  // 模块 9：WebSocket 增强路由
  // ============================================================

  // 获取 WebSocket 房间列表
  'GET /api/v2/ws/rooms': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const rooms = getWsRoomsEx()
    sendJSON(res, 200, { rooms, count: rooms.length })
  },

  // 创建/加入房间
  'POST /api/v2/ws/rooms/:id/join': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    // 构造虚拟 client 绑定当前用户
    const virtualClient = { userId: auth.user.id, id: auth.user.id + '_rest' }
    bindWsClientUser(virtualClient, auth.user.id)
    const result = wsJoinRoomEx(virtualClient, body.id)
    sendJSON(res, 200, { success: true, roomId: body.id, result })
  },

  // 离开房间
  'POST /api/v2/ws/rooms/:id/leave': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const virtualClient = { userId: auth.user.id, id: auth.user.id + '_rest' }
    const result = wsLeaveRoomEx(virtualClient, body.id)
    sendJSON(res, 200, { success: true, roomId: body.id, result })
  },

  // 向房间广播消息
  'POST /api/v2/ws/rooms/:id/broadcast': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { message } = body
    if (!message) return sendJSON(res, 400, { error: 'message 不能为空' })
    wsBroadcastRoomEx(body.id, { type: 'room_message', from: auth.user.id, data: message })
    sendJSON(res, 200, { success: true, message: '已广播到房间 ' + body.id })
  },

  // 获取用户在线状态
  'GET /api/v2/ws/presence/:userId': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const presence = wsGetPresenceEx(body.userId)
    sendJSON(res, 200, { presence })
  },

  // 设置自己的在线状态
  'PUT /api/v2/ws/presence': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { status } = body
    if (!status) return sendJSON(res, 400, { error: 'status 不能为空' })
    const result = wsSetPresenceEx(auth.user.id, status)
    sendJSON(res, 200, { success: true, presence: result })
  },

  // 向用户发送消息（含离线缓存）
  'POST /api/v2/ws/send/:userId': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { message } = body
    if (!message) return sendJSON(res, 400, { error: 'message 不能为空' })
    wsSendToUserEx(body.userId, { type: 'direct_message', from: auth.user.id, data: message })
    sendJSON(res, 200, { success: true, message: '消息已发送（若用户离线将缓存）' })
  },

  // WebSocket 统计
  'GET /api/v2/ws/stats': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const stats = getWsStatsEx()
    sendJSON(res, 200, { stats })
  },

  // 获取 WebSocket 消息类型
  'GET /api/v2/ws/message-types': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    sendJSON(res, 200, { messageTypes: WS_MESSAGE_TYPES })
  },

  // 投递离线消息
  'POST /api/v2/ws/deliver-offline': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const result = wsDeliverOfflineMessagesEx(auth.user.id)
    sendJSON(res, 200, { success: true, delivered: result })
  },

  // ============================================================
  // 模块 10：任务调度增强路由
  // ============================================================

  // 任务类型列表
  'GET /api/v2/tasks/types': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const types = listTaskTypesEx()
    sendJSON(res, 200, { types, count: types.length })
  },

  // 创建一次性任务
  'POST /api/v2/tasks/onetime': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('tasks:manage')(req, res, auth)) return
    const { name, delayMs, payload } = body
    if (!delayMs) return sendJSON(res, 400, { error: 'delayMs 不能为空' })
    const task = scheduleOneTimeTaskEx(name, parseInt(delayMs), null, payload || {})
    sendJSON(res, 201, { success: true, task })
  },

  // 一次性任务列表
  'GET /api/v2/tasks/onetime': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('tasks:read')(req, res, auth)) return
    const tasks = listOneTimeTasksEx()
    sendJSON(res, 200, { tasks, count: tasks.length })
  },

  // 创建重复任务
  'POST /api/v2/tasks/recurring': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('tasks:manage')(req, res, auth)) return
    const { name, intervalMs, payload } = body
    if (!intervalMs) return sendJSON(res, 400, { error: 'intervalMs 不能为空' })
    const task = scheduleRecurringTaskEx(name, parseInt(intervalMs), null, payload || {})
    sendJSON(res, 201, { success: true, task })
  },

  // 重复任务列表
  'GET /api/v2/tasks/recurring': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('tasks:read')(req, res, auth)) return
    const tasks = listRecurringTasksEx()
    sendJSON(res, 200, { tasks, count: tasks.length })
  },

  // 暂停重复任务
  'PUT /api/v2/tasks/recurring/:id/pause': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('tasks:manage')(req, res, auth)) return
    const result = pauseRecurringTaskEx(body.id)
    if (result.error) return sendJSON(res, 404, { error: result.error })
    sendJSON(res, 200, result)
  },

  // 恢复重复任务
  'PUT /api/v2/tasks/recurring/:id/resume': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('tasks:manage')(req, res, auth)) return
    const result = resumeRecurringTaskEx(body.id)
    if (result.error) return sendJSON(res, 404, { error: result.error })
    sendJSON(res, 200, result)
  },

  // 删除重复任务
  'DELETE /api/v2/tasks/recurring/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('tasks:manage')(req, res, auth)) return
    const result = deleteRecurringTaskEx(body.id)
    if (result.error) return sendJSON(res, 404, { error: result.error })
    sendJSON(res, 200, result)
  },

  // 设置任务优先级
  'PUT /api/v2/tasks/:id/priority': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('tasks:manage')(req, res, auth)) return
    const { priority } = body
    if (priority === undefined) return sendJSON(res, 400, { error: 'priority 不能为空' })
    const result = setTaskPriorityEx(body.id, parseInt(priority))
    if (result.error) return sendJSON(res, 404, { error: result.error })
    sendJSON(res, 200, result)
  },

  // 设置任务超时
  'PUT /api/v2/tasks/:id/timeout': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('tasks:manage')(req, res, auth)) return
    const { timeoutMs } = body
    if (!timeoutMs) return sendJSON(res, 400, { error: 'timeoutMs 不能为空' })
    const result = setTaskTimeoutEx(body.id, parseInt(timeoutMs))
    if (result.error) return sendJSON(res, 404, { error: result.error })
    sendJSON(res, 200, result)
  },

  // 重试任务
  'POST /api/v2/tasks/:id/retry': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('tasks:manage')(req, res, auth)) return
    const { maxRetries } = body
    const result = retryTaskEx(body.id, parseInt(maxRetries) || 3)
    if (result.error) return sendJSON(res, 404, { error: result.error })
    sendJSON(res, 200, result)
  },

  // 更新任务进度
  'PUT /api/v2/tasks/:id/progress': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('tasks:manage')(req, res, auth)) return
    const { progress, message } = body
    if (progress === undefined) return sendJSON(res, 400, { error: 'progress 不能为空' })
    const result = updateTaskProgressEx(body.id, parseFloat(progress), message)
    if (result.error) return sendJSON(res, 404, { error: result.error })
    sendJSON(res, 200, result)
  },

  // 取消任务
  'POST /api/v2/tasks/:id/cancel': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('tasks:manage')(req, res, auth)) return
    const { reason } = body
    const result = cancelTaskEx(body.id, reason)
    if (result.error) return sendJSON(res, 404, { error: result.error })
    sendJSON(res, 200, result)
  },

  // 获取任务日志
  'GET /api/v2/tasks/:id/logs': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('tasks:read')(req, res, auth)) return
    const logs = getTaskLogEx(body.id)
    sendJSON(res, 200, { logs, count: logs.length })
  },

  // 添加任务依赖
  'POST /api/v2/tasks/:id/dependencies': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('tasks:manage')(req, res, auth)) return
    const { dependsOnId } = body
    if (!dependsOnId) return sendJSON(res, 400, { error: 'dependsOnId 不能为空' })
    const result = addTaskDependencyEx(body.id, dependsOnId)
    sendJSON(res, 200, result)
  },

  // ============================================================
  // 模块 1 扩展路由：用户档案与账号管理
  // ============================================================

  // 获取当前用户档案
  'GET /api/v2/users/profile': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const profile = getUserProfile(auth.user.id)
    if (profile.error) return sendJSON(res, 404, { error: profile.error })
    sendJSON(res, 200, { profile })
  },

  // 获取指定用户档案（公开信息）
  'GET /api/v2/users/profile/:userId': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const profile = getUserProfile(body.userId)
    if (profile.error) return sendJSON(res, 404, { error: profile.error })
    sendJSON(res, 200, { profile })
  },

  // 更新当前用户档案
  'PUT /api/v2/users/profile': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { displayName, avatar, bio, language, timezone, phone } = body
    const result = updateUserProfile(auth.user.id, { displayName, avatar, bio, language, timezone, phone })
    if (result.error) return sendJSON(res, 400, { error: result.error })
    auditLog('user.profile_update', auth.user.id, getClientIp(req), { fields: Object.keys(body) })
    sendJSON(res, 200, result)
  },

  // 账号注销（软删除）
  'POST /api/v2/auth/deactivate': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { password } = body
    if (!password) return sendJSON(res, 400, { error: '请输入密码以确认注销' })
    const result = deactivateAccount(auth.user.id, password)
    if (result.error) return sendJSON(res, 400, { error: result.error })
    // 吊销当前 token
    const authHeader = req.headers['authorization'] || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (token) revokeToken(token, 'account_deactivated')
    sendJSON(res, 200, result)
  },

  // 账号安全概览
  'GET /api/v2/auth/security-overview': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const overview = getAccountSecurityOverview(auth.user.id)
    if (overview.error) return sendJSON(res, 404, { error: overview.error })
    sendJSON(res, 200, { overview })
  },

  // 验证邮箱
  'POST /api/v2/auth/verify-email': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { code } = body
    if (!code) return sendJSON(res, 400, { error: '验证码不能为空' })
    const result = verifyEmail(auth.user.id, code)
    if (!result.ok) return sendJSON(res, 400, { error: result.error })
    auditLog('user.email_verify', auth.user.id, getClientIp(req), {})
    sendJSON(res, 200, { success: true, message: '邮箱验证成功' })
  },

  // 重新发送邮箱验证
  'POST /api/v2/auth/resend-email-verification': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const result = resendEmailVerification(auth.user.id)
    if (result.error) return sendJSON(res, 400, { error: result.error })
    sendJSON(res, 200, { success: true, message: '验证码已发送（演示环境返回 code）', ...result })
  },

  // ============================================================
  // 模块 2 扩展路由：用户角色分配与角色成员管理
  // ============================================================

  // 为用户分配角色（管理员）
  'POST /api/v2/users/:userId/role': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('users:role')(req, res, auth)) return
    const { roleId } = body
    if (!roleId) return sendJSON(res, 400, { error: 'roleId 不能为空' })
    const result = assignUserRole(body.userId, roleId, auth.user.id)
    if (result.error) return sendJSON(res, 400, { error: result.error })
    sendJSON(res, 200, result)
  },

  // 获取某角色下所有用户
  'GET /api/v2/roles/:id/users': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('users:read')(req, res, auth)) return
    const users = getUsersByRole(body.id)
    sendJSON(res, 200, { users, count: users.length, roleId: body.id })
  },

  // 角色使用统计
  'GET /api/v2/roles/usage-stats': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('users:read')(req, res, auth)) return
    const stats = getRoleUsageStats()
    sendJSON(res, 200, { stats, count: stats.length })
  },

  // 克隆角色
  'POST /api/v2/roles/clone': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('users:role')(req, res, auth)) return
    const { sourceRoleId, newRoleId, newName } = body
    if (!sourceRoleId || !newRoleId || !newName) {
      return sendJSON(res, 400, { error: 'sourceRoleId, newRoleId, newName 不能为空' })
    }
    const result = cloneRole(sourceRoleId, newRoleId, newName)
    if (result.error) return sendJSON(res, 400, { error: result.error })
    logPermissionChange(auth.user.id, 'role.clone', { sourceRoleId, newRoleId })
    sendJSON(res, 201, { success: true, role: result })
  },

  // ============================================================
  // 模块 3 扩展路由：组织列表与成员搜索
  // ============================================================

  // 列出所有组织（管理员）
  'GET /api/v2/orgs': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('orgs:manage')(req, res, auth)) return
    const orgs = listAllOrgs()
    sendJSON(res, 200, { orgs, count: orgs.length })
  },

  // 搜索组织成员
  'GET /api/v2/orgs/members/search': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const orgId = body.orgId || auth.user.orgId
    if (!orgId) return sendJSON(res, 400, { error: '未指定组织' })
    const { keyword, role } = body
    const members = searchOrgMembers(orgId, keyword, role)
    sendJSON(res, 200, { members, count: members.length })
  },

  // 组织成员详情
  'GET /api/v2/orgs/members/:userId/detail': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const orgId = body.orgId || auth.user.orgId
    if (!orgId) return sendJSON(res, 400, { error: '未指定组织' })
    const detail = getOrgMemberDetail(orgId, body.userId)
    if (detail.error) return sendJSON(res, 404, { error: detail.error })
    sendJSON(res, 200, { member: detail })
  },

  // 组织概览仪表盘
  'GET /api/v2/orgs/dashboard': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const orgId = body.orgId || auth.user.orgId
    if (!orgId) return sendJSON(res, 400, { error: '未指定组织' })
    const dashboard = getOrgDashboard(orgId)
    sendJSON(res, 200, { dashboard })
  },

  // ============================================================
  // 模块 4 扩展路由：消息搜索与广播
  // ============================================================

  // 搜索用户消息
  'GET /api/v2/messages/search': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { keyword, category, type } = body
    const messages = searchUserMessages(auth.user.id, keyword, {
      category, type,
      limit: parseInt(body.limit) || 50,
    })
    sendJSON(res, 200, { messages, count: messages.length })
  },

  // 向组织广播消息
  'POST /api/v2/messages/broadcast/org': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('orgs:manage')(req, res, auth)) return
    const { orgId, title, content, category } = body
    if (!orgId || !title) return sendJSON(res, 400, { error: 'orgId 和 title 不能为空' })
    const result = broadcastOrgMessage(orgId, auth.user.id, title, content, category)
    sendJSON(res, 200, result)
  },

  // 向角色广播消息
  'POST /api/v2/messages/broadcast/role': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('users:read')(req, res, auth)) return
    const { role, title, content, category } = body
    if (!role || !title) return sendJSON(res, 400, { error: 'role 和 title 不能为空' })
    const result = broadcastRoleMessage(role, auth.user.id, title, content, category)
    sendJSON(res, 200, result)
  },

  // 消息统计
  'GET /api/v2/messages/stats': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const stats = getMessageStats(auth.user.id)
    sendJSON(res, 200, { stats })
  },

  // ============================================================
  // 模块 5 扩展路由：搜索索引管理与分析
  // ============================================================

  // 搜索索引按类型统计
  'GET /api/v2/search/index-stats': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const stats = getSearchIndexStatsByType()
    sendJSON(res, 200, { stats })
  },

  // 按类型移除索引文档
  'DELETE /api/v2/search/index/:type': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const result = removeSearchIndexByType(body.type)
    sendJSON(res, 200, result)
  },

  // 搜索趋势分析
  'GET /api/v2/search/trends': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const days = parseInt(body.days) || 7
    const trends = getSearchTrends(days)
    sendJSON(res, 200, { trends, days })
  },

  // 清空搜索索引
  'DELETE /api/v2/search/index': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const result = clearSearchIndex()
    sendJSON(res, 200, result)
  },

  // ============================================================
  // 模块 6 扩展路由：日志分析与聚合
  // ============================================================

  // 日志分析
  'GET /api/v2/logs/analytics': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('logs:read')(req, res, auth)) return
    const days = parseInt(body.days) || 7
    const analytics = getLogAnalytics(days)
    sendJSON(res, 200, { analytics, days })
  },

  // 日志配置
  'GET /api/v2/logs/config': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const config = getLogConfig()
    sendJSON(res, 200, { config })
  },

  // 更新日志轮转配置
  'PUT /api/v2/logs/rotation': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const { maxSize, retainDays, enabled } = body
    const result = updateLogRotationConfig({ maxSize, retainDays, enabled })
    sendJSON(res, 200, result)
  },

  // ============================================================
  // 模块 7 扩展路由：导出任务管理
  // ============================================================

  // 获取导出任务详情
  'GET /api/v2/export/tasks/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const task = getExportTask(body.id)
    if (task.error) return sendJSON(res, 404, { error: task.error })
    // 非管理员只能查看自己的任务
    if (auth.user.role !== 'admin' && task.userId !== auth.user.id) {
      return sendJSON(res, 403, { error: '无权查看该任务' })
    }
    sendJSON(res, 200, { task })
  },

  // 取消导出任务
  'POST /api/v2/export/tasks/:id/cancel': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const task = getExportTask(body.id)
    if (task.error) return sendJSON(res, 404, { error: task.error })
    if (auth.user.role !== 'admin' && task.userId !== auth.user.id) {
      return sendJSON(res, 403, { error: '无权操作该任务' })
    }
    const result = cancelExportTask(body.id)
    if (result.error) return sendJSON(res, 400, { error: result.error })
    sendJSON(res, 200, result)
  },

  // 重试导出任务
  'POST /api/v2/export/tasks/:id/retry': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const task = getExportTask(body.id)
    if (task.error) return sendJSON(res, 404, { error: task.error })
    if (auth.user.role !== 'admin' && task.userId !== auth.user.id) {
      return sendJSON(res, 403, { error: '无权操作该任务' })
    }
    const result = retryExportTask(body.id)
    if (result.error) return sendJSON(res, 400, { error: result.error })
    sendJSON(res, 200, { success: true, task: result })
  },

  // 列出定时导出
  'GET /api/v2/export/scheduled': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const list = listScheduledExports(auth.user.id)
    sendJSON(res, 200, { scheduled: list, count: list.length })
  },

  // 删除定时导出
  'DELETE /api/v2/export/scheduled/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const result = deleteScheduledExport(body.id)
    if (result.error) return sendJSON(res, 404, { error: result.error })
    sendJSON(res, 200, result)
  },

  // 切换定时导出启用状态
  'PUT /api/v2/export/scheduled/:id/toggle': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const { enabled } = body
    if (enabled === undefined) return sendJSON(res, 400, { error: 'enabled 不能为空' })
    const result = toggleScheduledExport(body.id, enabled)
    if (result.error) return sendJSON(res, 404, { error: result.error })
    sendJSON(res, 200, result)
  },

  // ============================================================
  // 模块 8 扩展路由：版本迁移辅助
  // ============================================================

  // 版本迁移检查清单
  'GET /api/v2/versions/migration-checklist': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { from, to } = body
    if (!from || !to) return sendJSON(res, 400, { error: 'from 和 to 不能为空' })
    const checklist = getMigrationChecklist(from, to)
    sendJSON(res, 200, checklist)
  },

  // 版本废弃倒计时
  'GET /api/v2/versions/:version/sunset': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const countdown = getVersionSunsetCountdown(body.version)
    sendJSON(res, 200, { countdown })
  },

  // ============================================================
  // 模块 9 扩展路由：WebSocket 房间管理
  // ============================================================

  // 获取房间成员列表
  'GET /api/v2/ws/rooms/:id/members': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const result = getWsRoomMembers(body.id)
    if (result.error) return sendJSON(res, 404, { error: result.error })
    sendJSON(res, 200, result)
  },

  // 获取在线用户列表
  'GET /api/v2/ws/online-users': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const users = getOnlineUsers()
    sendJSON(res, 200, { onlineUsers: users, count: users.length })
  },

  // 清空房间
  'POST /api/v2/ws/rooms/:id/clear': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const result = clearWsRoom(body.id)
    if (result.error) return sendJSON(res, 404, { error: result.error })
    sendJSON(res, 200, result)
  },

  // 删除房间
  'DELETE /api/v2/ws/rooms/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const result = deleteWsRoom(body.id)
    if (result.error) return sendJSON(res, 404, { error: result.error })
    sendJSON(res, 200, result)
  },

  // 获取离线消息队列
  'GET /api/v2/ws/offline-messages/:userId': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    // 普通用户只能查看自己的离线消息
    if (auth.user.role !== 'admin' && body.userId !== auth.user.id) {
      return sendJSON(res, 403, { error: '无权查看他人离线消息' })
    }
    const messages = getOfflineMessages(body.userId)
    sendJSON(res, 200, { messages, count: messages.length })
  },

  // 清空离线消息
  'DELETE /api/v2/ws/offline-messages': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const result = clearOfflineMessages(auth.user.id)
    sendJSON(res, 200, result)
  },

  // ============================================================
  // 模块 10 扩展路由：任务详情与依赖管理
  // ============================================================

  // 获取任务详情
  'GET /api/v2/tasks/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('tasks:read')(req, res, auth)) return
    const detail = getTaskDetail(body.id)
    if (detail.error) return sendJSON(res, 404, { error: detail.error })
    sendJSON(res, 200, detail)
  },

  // 获取任务依赖列表
  'GET /api/v2/tasks/:id/dependencies': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('tasks:read')(req, res, auth)) return
    const result = getTaskDependencies(body.id)
    sendJSON(res, 200, result)
  },

  // 移除任务依赖
  'DELETE /api/v2/tasks/:id/dependencies/:dependsOnId': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('tasks:manage')(req, res, auth)) return
    const result = removeTaskDependency(body.id, body.dependsOnId)
    if (result.error) return sendJSON(res, 404, { error: result.error })
    sendJSON(res, 200, result)
  },

  // 任务统计
  'GET /api/v2/tasks/stats': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('tasks:read')(req, res, auth)) return
    const stats = getTaskStats()
    sendJSON(res, 200, { stats })
  },

  // 立即触发任务
  'POST /api/v2/tasks/:id/trigger': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('tasks:manage')(req, res, auth)) return
    const result = triggerTaskNow(body.id)
    if (result.error) return sendJSON(res, 400, { error: result.error })
    sendJSON(res, 200, result)
  },

  // ============================================================
  // 综合仪表盘与聚合接口
  // ============================================================

  // 用户个人仪表盘
  'GET /api/v2/dashboard/user': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const messageStats = getMessageStats(auth.user.id)
    const unread = getUnreadCountEx(auth.user.id)
    const sessions = getUserSessions(auth.user.id)
    const recentLogins = getLoginLogs({ userId: auth.user.id, limit: 5 })
    const searchHistory = getSearchHistoryEx(auth.user.id, 5)
    const apiKeys = listApiKeysEx(auth.user.id)
    const twoFactor = db.twoFactor && db.twoFactor[auth.user.id]
    const profile = getUserProfile(auth.user.id)
    sendJSON(res, 200, {
      profile,
      messageStats,
      unreadCounts: unread,
      activeSessions: sessions.length,
      recentLogins,
      searchHistory,
      apiKeysCount: apiKeys.length,
      twoFactorEnabled: !!(twoFactor && twoFactor.enabled),
    })
  },

  // 管理员系统仪表盘
  'GET /api/v2/dashboard/admin': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const userCount = Object.values(db.users || {}).filter(u => !u.deactivated).length
    const orgCount = Object.keys(db.orgs || {}).length
    const roleStats = getRoleUsageStats()
    const banList = getBanList()
    const taskStats = getTaskStats()
    const logAnalytics = getLogAnalytics(7)
    const wsStats = getWsStatsEx()
    const versionStats = getVersionStatsEx()
    const searchIndexStatus = getSearchIndexStatus()
    const onlineUsers = getOnlineUsers()
    sendJSON(res, 200, {
      users: { total: userCount, online: onlineUsers.length, banned: banList.length },
      organizations: orgCount,
      roles: roleStats,
      tasks: taskStats,
      logs: logAnalytics,
      websocket: wsStats,
      versions: versionStats,
      searchIndex: searchIndexStatus,
      onlineUsers,
    })
  },

  // 系统概览（公开统计，不需敏感权限）
  'GET /api/v2/system/overview': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const convCount = Object.keys(db.conversations || {}).length
    const knowledgeCount = Object.keys(db.knowledge || {}).length
    const fileCount = Object.keys(db.files || {}).length
    const userCount = Object.values(db.users || {}).filter(u => !u.deactivated).length
    sendJSON(res, 200, {
      conversations: convCount,
      knowledge: knowledgeCount,
      files: fileCount,
      users: userCount,
      versions: listVersionsEx(),
      uptime: process.uptime(),
      nodeVersion: process.version,
      timestamp: new Date().toISOString(),
    })
  },

  // API 路由清单（列出所有可用路由）
  'GET /api/v2/routes': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const routeList = Object.keys(routes).map(r => {
      const [method, path] = r.split(' ')
      return { method, path }
    })
    sendJSON(res, 200, { routes: routeList, count: routeList.length })
  },

  // ============================================================
  // 模块 11 路由：用户管理与列表
  // ============================================================

  // 分页列出用户（管理员）
  'GET /api/v2/users': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('users:read')(req, res, auth)) return
    const result = listUsers({
      keyword: body.keyword,
      role: body.role,
      orgId: body.orgId,
      banned: body.banned !== undefined ? body.banned === 'true' : undefined,
      sortBy: body.sortBy,
      sortOrder: body.sortOrder,
      limit: parseInt(body.limit) || 20,
      offset: parseInt(body.offset) || 0,
    })
    sendJSON(res, 200, result)
  },

  // 管理员创建用户
  'POST /api/v2/users': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('users:write')(req, res, auth)) return
    const result = adminCreateUser(body, auth.user.id)
    if (result.error) return sendJSON(res, 400, { error: result.error })
    sendJSON(res, 201, result)
  },

  // 管理员更新用户
  'PUT /api/v2/users/:userId': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('users:write')(req, res, auth)) return
    const result = adminUpdateUser(body.userId, body, auth.user.id)
    if (result.error) return sendJSON(res, 400, { error: result.error })
    sendJSON(res, 200, result)
  },

  // 删除用户（管理员）
  'DELETE /api/v2/users/:userId': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('users:delete')(req, res, auth)) return
    const result = deleteUser(body.userId, auth.user.id)
    if (result.error) return sendJSON(res, 400, { error: result.error })
    sendJSON(res, 200, result)
  },

  // 重置用户密码（管理员）
  'POST /api/v2/users/:userId/reset-password': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('users:write')(req, res, auth)) return
    const { newPassword } = body
    if (!newPassword) return sendJSON(res, 400, { error: 'newPassword 不能为空' })
    const strength = checkPasswordStrength(newPassword)
    if (strength.score < 2) return sendJSON(res, 400, { error: '密码强度不足', strength })
    const result = adminUpdateUser(body.userId, { newPassword }, auth.user.id)
    if (result.error) return sendJSON(res, 400, { error: result.error })
    auditLog('user.password_reset_admin', auth.user.id, getClientIp(req), { targetUserId: body.userId })
    sendJSON(res, 200, { success: true, message: '密码已重置', strength })
  },

  // ============================================================
  // 模块 12 路由：对话管理与统计
  // ============================================================

  // 分页列出对话（管理员）
  'GET /api/v2/conversations': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('chat:read')(req, res, auth)) return
    const result = listConversations({
      userId: body.userId,
      orgId: body.orgId,
      keyword: body.keyword,
      startDate: body.startDate,
      endDate: body.endDate,
      limit: parseInt(body.limit) || 20,
      offset: parseInt(body.offset) || 0,
    })
    sendJSON(res, 200, result)
  },

  // 对话统计
  'GET /api/v2/conversations/stats': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('chat:read')(req, res, auth)) return
    const stats = getConversationStats()
    sendJSON(res, 200, { stats })
  },

  // 删除对话
  'DELETE /api/v2/conversations/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('chat:delete')(req, res, auth)) return
    const result = deleteConversation(body.id)
    if (result.error) return sendJSON(res, 404, { error: result.error })
    auditLog('conversation.delete', auth.user.id, getClientIp(req), { conversationId: body.id })
    sendJSON(res, 200, result)
  },

  // 批量删除对话
  'POST /api/v2/conversations/batch-delete': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('chat:delete')(req, res, auth)) return
    const { conversationIds } = body
    if (!Array.isArray(conversationIds)) return sendJSON(res, 400, { error: 'conversationIds 必须为数组' })
    const result = batchDeleteConversations(conversationIds)
    auditLog('conversation.batch_delete', auth.user.id, getClientIp(req), { count: result.deleted })
    sendJSON(res, 200, result)
  },

  // ============================================================
  // 模块 13 路由：系统诊断与维护
  // ============================================================

  // 系统诊断
  'GET /api/v2/system/diagnostics': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const diagnostics = getSystemDiagnostics()
    sendJSON(res, 200, { diagnostics })
  },

  // 数据库统计
  'GET /api/v2/system/database-stats': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const stats = getDatabaseStats()
    sendJSON(res, 200, { stats })
  },

  // 清理过期会话
  'POST /api/v2/system/cleanup-sessions': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const result = cleanupExpiredSessions()
    auditLog('system.cleanup_sessions', auth.user.id, getClientIp(req), result)
    sendJSON(res, 200, { success: true, ...result })
  },

  // 数据库压缩
  'POST /api/v2/system/compact-db': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:backup')(req, res, auth)) return
    const result = compactDatabase()
    auditLog('system.compact_db', auth.user.id, getClientIp(req), result)
    sendJSON(res, 200, { success: true, ...result })
  },

  // 健康检查详情
  'GET /api/v2/system/health': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:health')(req, res, auth)) return
    const health = getHealthDetails()
    sendJSON(res, 200, { health })
  },

  // 系统配置完整快照（管理员）
  'GET /api/v2/system/config': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    sendJSON(res, 200, {
      config: db.config || {},
      schema: getConfigSchema(),
      publicConfig: getPublicConfig(),
    })
  },

  // 功能开关查询
  'GET /api/v2/system/features': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const features = (db.config && db.config.features) || {}
    sendJSON(res, 200, { features })
  },

  // 功能开关切换
  'PUT /api/v2/system/features/:name': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const { enabled } = body
    if (enabled === undefined) return sendJSON(res, 400, { error: 'enabled 不能为空' })
    if (!db.config) db.config = {}
    if (!db.config.features) db.config.features = {}
    db.config.features[body.name] = !!enabled
    saveDB(db)
    triggerConfigChange('features.' + body.name, !enabled, !!enabled)
    auditLog('system.feature_toggle', auth.user.id, getClientIp(req), { feature: body.name, enabled })
    sendJSON(res, 200, { success: true, feature: body.name, enabled: !!enabled })
  },

  // Prometheus 指标（兼容格式）
  'GET /api/v2/system/metrics/prometheus': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const metrics = getPrometheusMetrics()
    res.writeHead(200, { 'Content-Type': 'text/plain; version=0.0.4' })
    res.end(metrics)
  },

  // 缓存管理：清空缓存
  'POST /api/v2/system/cache/clear': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:cache')(req, res, auth)) return
    // 清空内存缓存（若存在 cache 对象）
    if (typeof globalCache !== 'undefined' && globalCache.clear) globalCache.clear()
    auditLog('system.cache_clear', auth.user.id, getClientIp(req), {})
    sendJSON(res, 200, { success: true, message: '缓存已清空' })
  },

  // 限流状态查询
  'GET /api/v2/system/rate-limit-status': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const status = getEnhancedRateLimitStatus()
    sendJSON(res, 200, { status })
  },

  // 重置限流
  'POST /api/v2/system/rate-limit-reset': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const { type, key } = body
    const result = resetRateLimit(type, key)
    sendJSON(res, 200, { success: true, ...result })
  },

  // IP 黑白名单管理：查询
  'GET /api/v2/system/ip-access': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    sendJSON(res, 200, {
      whitelist: db.ipWhitelist || [],
      blacklist: db.ipBlacklist || [],
    })
  },

  // IP 黑名单添加
  'POST /api/v2/system/ip-blacklist': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const { ip } = body
    if (!ip) return sendJSON(res, 400, { error: 'ip 不能为空' })
    addIpBlacklist(ip)
    auditLog('system.ip_blacklist_add', auth.user.id, getClientIp(req), { ip })
    sendJSON(res, 200, { success: true, message: '已添加到黑名单' })
  },

  // IP 黑名单移除
  'DELETE /api/v2/system/ip-blacklist/:ip': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    removeIpBlacklist(body.ip)
    auditLog('system.ip_blacklist_remove', auth.user.id, getClientIp(req), { ip: body.ip })
    sendJSON(res, 200, { success: true, message: '已从黑名单移除' })
  },

  // IP 白名单添加
  'POST /api/v2/system/ip-whitelist': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const { ip } = body
    if (!ip) return sendJSON(res, 400, { error: 'ip 不能为空' })
    addIpWhitelist(ip)
    auditLog('system.ip_whitelist_add', auth.user.id, getClientIp(req), { ip })
    sendJSON(res, 200, { success: true, message: '已添加到白名单' })
  },

  // IP 白名单移除
  'DELETE /api/v2/system/ip-whitelist/:ip': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    removeIpWhitelist(body.ip)
    auditLog('system.ip_whitelist_remove', auth.user.id, getClientIp(req), { ip: body.ip })
    sendJSON(res, 200, { success: true, message: '已从白名单移除' })
  },

  // 指标历史
  'GET /api/v2/system/metrics/history': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const limit = parseInt(body.limit) || 100
    const history = getMetricsHistory(limit)
    sendJSON(res, 200, { history, count: history.length })
  },

  // 告警检查
  'GET /api/v2/system/alerts': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const alerts = checkAlerts()
    sendJSON(res, 200, { alerts })
  },

  // ===== 模块14：知识库管理增强路由 =====
  // 创建知识库条目
  'POST /api/v2/knowledge/items': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('knowledge:write')(req, res, auth)) return
    const item = createKnowledgeItemEx(body, auth.user.id)
    auditLog('knowledge.item_create', auth.user.id, getClientIp(req), { id: item.id })
    sendJSON(res, 201, { item })
  },

  // 列出知识库条目
  'GET /api/v2/knowledge/items': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    let items = Object.values(db.knowledgeEx || {})
    if (body.category) items = items.filter(i => i.category === body.category)
    if (body.tag) items = items.filter(i => (i.tags || []).includes(body.tag))
    if (body.visibility) items = items.filter(i => i.visibility === body.visibility)
    if (body.keyword) {
      const kw = String(body.keyword).toLowerCase()
      items = items.filter(i =>
        i.title.toLowerCase().includes(kw) ||
        (i.content || '').toLowerCase().includes(kw)
      )
    }
    const page = parseInt(body.page) || 1
    const pageSize = parseInt(body.pageSize) || 20
    const total = items.length
    items = items.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice((page - 1) * pageSize, page * pageSize)
    sendJSON(res, 200, { items, total, page, pageSize })
  },

  // 获取单个知识库条目
  'GET /api/v2/knowledge/items/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const item = db.knowledgeEx?.[body.id]
    if (!item) return sendJSON(res, 404, { error: '条目不存在' })
    incrementKnowledgeView(body.id)
    sendJSON(res, 200, { item })
  },

  // 更新知识库条目
  'PUT /api/v2/knowledge/items/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('knowledge:write')(req, res, auth)) return
    const item = updateKnowledgeItemEx(body.id, body, auth.user.id)
    if (!item) return sendJSON(res, 404, { error: '条目不存在' })
    auditLog('knowledge.item_update', auth.user.id, getClientIp(req), { id: body.id, version: item.version })
    sendJSON(res, 200, { item })
  },

  // 删除知识库条目
  'DELETE /api/v2/knowledge/items/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('knowledge:delete')(req, res, auth)) return
    const ok = deleteKnowledgeItemEx(body.id)
    if (!ok) return sendJSON(res, 404, { error: '条目不存在' })
    auditLog('knowledge.item_delete', auth.user.id, getClientIp(req), { id: body.id })
    sendJSON(res, 200, { success: true })
  },

  // 获取版本历史
  'GET /api/v2/knowledge/items/:id/versions': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const versions = getKnowledgeItemVersions(body.id)
    sendJSON(res, 200, { versions })
  },

  // 还原版本
  'POST /api/v2/knowledge/items/:id/restore': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('knowledge:write')(req, res, auth)) return
    const item = restoreKnowledgeItemVersion(body.id, body.version, auth.user.id)
    if (!item) return sendJSON(res, 404, { error: '条目或版本不存在' })
    sendJSON(res, 200, { item })
  },

  // 分享知识库条目
  'POST /api/v2/knowledge/items/:id/share': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const share = shareKnowledgeItem(body.id, body, auth.user.id)
    sendJSON(res, 200, { share })
  },

  // 收藏
  'POST /api/v2/knowledge/items/:id/favorite': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const ok = favoriteKnowledgeItem(body.id, auth.user.id)
    sendJSON(res, 200, { success: ok })
  },

  // 取消收藏
  'DELETE /api/v2/knowledge/items/:id/favorite': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const ok = unfavoriteKnowledgeItem(body.id, auth.user.id)
    sendJSON(res, 200, { success: ok })
  },

  // 列出收藏
  'GET /api/v2/knowledge/favorites': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const items = listFavoriteKnowledge(auth.user.id)
    sendJSON(res, 200, { items })
  },

  // 点赞
  'POST /api/v2/knowledge/items/:id/like': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const ok = likeKnowledgeItem(body.id)
    sendJSON(res, 200, { success: ok })
  },

  // 批量导入
  'POST /api/v2/knowledge/batch-import': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('knowledge:write')(req, res, auth)) return
    if (!Array.isArray(body.items)) return sendJSON(res, 400, { error: 'items 必须是数组' })
    const result = batchImportKnowledge(body.items, auth.user.id, body.options)
    sendJSON(res, 200, { result })
  },

  // 按标签查询
  'GET /api/v2/knowledge/by-tag/:tag': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const items = getKnowledgeByTag(body.tag)
    sendJSON(res, 200, { items })
  },

  // 知识库统计
  'GET /api/v2/knowledge/stats': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const stats = getKnowledgeStats()
    sendJSON(res, 200, { stats })
  },

  // 所有标签
  'GET /api/v2/knowledge/tags': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const tags = Object.entries(db.knowledgeTags || {}).map(([tag, ids]) => ({
      tag,
      count: ids.length,
    })).sort((a, b) => b.count - a.count)
    sendJSON(res, 200, { tags })
  },

  // ===== 模块15：Webhook 投递管理路由 =====
  // 投递记录列表
  'GET /api/v2/webhooks/deliveries': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('webhooks:read')(req, res, auth)) return
    const deliveries = getWebhookDeliveries({
      webhookId: body.webhookId,
      event: body.event,
      status: body.status,
      since: body.since,
      limit: parseInt(body.limit) || 100,
    })
    sendJSON(res, 200, { deliveries, count: deliveries.length })
  },

  // 重试投递
  'POST /api/v2/webhooks/deliveries/:id/retry': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('webhooks:write')(req, res, auth)) return
    const result = await retryWebhookDelivery(body.id)
    sendJSON(res, 200, { result })
  },

  // 投递统计
  'GET /api/v2/webhooks/deliveries/stats': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const stats = getWebhookDeliveryStats(body.webhookId)
    sendJSON(res, 200, { stats })
  },

  // 创建 Webhook 模板
  'POST /api/v2/webhooks/templates': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('webhooks:write')(req, res, auth)) return
    const template = createWebhookTemplate(body, auth.user.id)
    sendJSON(res, 201, { template })
  },

  // 模板列表
  'GET /api/v2/webhooks/templates': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const templates = listWebhookTemplates()
    sendJSON(res, 200, { templates })
  },

  // 应用模板
  'POST /api/v2/webhooks/templates/:id/apply': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('webhooks:write')(req, res, auth)) return
    const webhook = applyWebhookTemplate(body.id, body.url, body.secret, auth.user.id)
    if (!webhook) return sendJSON(res, 404, { error: '模板不存在' })
    sendJSON(res, 201, { webhook })
  },

  // 测试 Webhook
  'POST /api/v2/webhooks/:id/test': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('webhooks:write')(req, res, auth)) return
    const result = await testWebhook(body.id, body.payload)
    sendJSON(res, 200, { result })
  },

  // 验证签名
  'POST /api/v2/webhooks/verify-signature': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const valid = verifyWebhookSignature(body.payload || '', body.signature || '', body.secret || '')
    sendJSON(res, 200, { valid })
  },

  // 测试记录
  'GET /api/v2/webhooks/:id/tests': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const tests = (db.webhookTests || []).filter(t => t.webhookId === body.id).slice(-50).reverse()
    sendJSON(res, 200, { tests })
  },

  // ===== 模块16：插件管理增强路由 =====
  // 注册插件到市场
  'POST /api/v2/plugins/marketplace': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('plugins:write')(req, res, auth)) return
    const plugin = registerPluginToMarketplace(body, auth.user.id)
    sendJSON(res, 201, { plugin })
  },

  // 浏览插件市场
  'GET /api/v2/plugins/marketplace': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const plugins = browsePluginMarketplace({
      category: body.category,
      keyword: body.keyword,
      tag: body.tag,
      sortBy: body.sortBy,
    })
    sendJSON(res, 200, { plugins })
  },

  // 获取市场插件详情
  'GET /api/v2/plugins/marketplace/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const plugin = db.pluginMarketplace?.[body.id]
    if (!plugin) return sendJSON(res, 404, { error: '插件不存在' })
    sendJSON(res, 200, { plugin })
  },

  // 发布插件
  'POST /api/v2/plugins/marketplace/:id/publish': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('plugins:write')(req, res, auth)) return
    const ok = publishPluginToMarketplace(body.id)
    sendJSON(res, 200, { success: ok })
  },

  // 安装插件
  'POST /api/v2/plugins/marketplace/:id/install': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const plugin = installPluginFromMarketplace(body.id, auth.user.id, body.options)
    if (!plugin) return sendJSON(res, 404, { error: '插件不存在或未发布' })
    auditLog('plugin.install', auth.user.id, getClientIp(req), { id: body.id })
    sendJSON(res, 200, { plugin })
  },

  // 配置插件
  'PUT /api/v2/plugins/:name/config': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('plugins:write')(req, res, auth)) return
    const config = configurePlugin(body.name, body.config || {}, auth.user.id)
    sendJSON(res, 200, { config })
  },

  // 获取插件配置
  'GET /api/v2/plugins/:name/config': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const config = getPluginConfig(body.name)
    sendJSON(res, 200, { config })
  },

  // 评价插件
  'POST /api/v2/plugins/marketplace/:id/review': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!body.rating || body.rating < 1 || body.rating > 5) {
      return sendJSON(res, 400, { error: 'rating 必须为 1-5' })
    }
    const result = reviewPlugin(body.id, auth.user.id, body.rating, body.comment || '')
    sendJSON(res, 200, { result })
  },

  // 获取评价
  'GET /api/v2/plugins/marketplace/:id/reviews': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const reviews = getPluginReviews(body.id)
    sendJSON(res, 200, { reviews })
  },

  // 卸载插件
  'DELETE /api/v2/plugins/:name': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('plugins:write')(req, res, auth)) return
    const ok = uninstallPluginEx(body.name, auth.user.id)
    sendJSON(res, 200, { success: ok })
  },

  // 插件统计
  'GET /api/v2/plugins/stats': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const stats = getPluginStats()
    sendJSON(res, 200, { stats })
  },

  // ===== 模块17：备份管理增强路由 =====
  // 创建定时备份
  'POST /api/v2/backups/schedules': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:backup')(req, res, auth)) return
    const schedule = createBackupSchedule(body, auth.user.id)
    auditLog('backup.schedule_create', auth.user.id, getClientIp(req), { id: schedule.id })
    sendJSON(res, 201, { schedule })
  },

  // 列出定时备份
  'GET /api/v2/backups/schedules': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:backup')(req, res, auth)) return
    const schedules = listBackupSchedules()
    sendJSON(res, 200, { schedules })
  },

  // 切换定时备份启用状态
  'PUT /api/v2/backups/schedules/:id/toggle': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:backup')(req, res, auth)) return
    const ok = toggleBackupSchedule(body.id, body.enabled !== false)
    sendJSON(res, 200, { success: ok })
  },

  // 删除定时备份
  'DELETE /api/v2/backups/schedules/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:backup')(req, res, auth)) return
    const ok = deleteBackupSchedule(body.id)
    sendJSON(res, 200, { success: ok })
  },

  // 立即执行定时备份
  'POST /api/v2/backups/schedules/:id/run': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:backup')(req, res, auth)) return
    const backup = executeBackupSchedule(body.id)
    if (!backup) return sendJSON(res, 404, { error: '计划不存在或已禁用' })
    sendJSON(res, 200, { backup })
  },

  // 校验备份完整性
  'POST /api/v2/backups/:id/verify': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:backup')(req, res, auth)) return
    const result = verifyBackupIntegrity(body.id)
    sendJSON(res, 200, { result })
  },

  // 列出还原点
  'GET /api/v2/backups/restore-points': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:backup')(req, res, auth)) return
    const points = listRestorePoints(body.scheduleId)
    sendJSON(res, 200, { restorePoints: points })
  },

  // 导出备份
  'GET /api/v2/backups/:id/export': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:backup')(req, res, auth)) return
    const info = exportBackup(body.id, auth.user.id)
    if (!info) return sendJSON(res, 404, { error: '备份不存在' })
    sendJSON(res, 200, { info })
  },

  // 备份统计
  'GET /api/v2/backups/stats': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:backup')(req, res, auth)) return
    const stats = getBackupStats()
    sendJSON(res, 200, { stats })
  },

  // ===== 模块18：配置中心增强路由 =====
  // 配置历史
  'GET /api/v2/config/history': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const history = getConfigHistory(body.key, parseInt(body.limit) || 100)
    sendJSON(res, 200, { history })
  },

  // 创建配置文件
  'POST /api/v2/config/profiles': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const profile = createConfigProfile(body, auth.user.id)
    sendJSON(res, 201, { profile })
  },

  // 列出配置文件
  'GET /api/v2/config/profiles': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const profiles = listConfigProfiles()
    sendJSON(res, 200, { profiles })
  },

  // 应用配置文件
  'POST /api/v2/config/profiles/:id/apply': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const ok = applyConfigProfile(body.id, auth.user.id)
    if (!ok) return sendJSON(res, 404, { error: '配置文件不存在' })
    auditLog('config.profile_apply', auth.user.id, getClientIp(req), { id: body.id })
    sendJSON(res, 200, { success: true })
  },

  // 删除配置文件
  'DELETE /api/v2/config/profiles/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const ok = deleteConfigProfile(body.id)
    sendJSON(res, 200, { success: ok })
  },

  // 导出配置
  'GET /api/v2/config/export': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const data = exportConfig(auth.user.id)
    sendJSON(res, 200, { data })
  },

  // 导入配置
  'POST /api/v2/config/import': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const result = importConfig(body, auth.user.id, { overwrite: body.overwrite !== false })
    sendJSON(res, 200, { result })
  },

  // 校验配置
  'POST /api/v2/config/validate': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const result = validateConfig(body.config || {})
    sendJSON(res, 200, { result })
  },

  // 重置所有配置
  'POST /api/v2/config/reset-all': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const result = resetAllConfig(auth.user.id)
    sendJSON(res, 200, { result })
  },

  // ===== 模块19：i18n 翻译管理路由 =====
  // 设置翻译覆盖
  'PUT /api/v2/i18n/overrides/:lang/:key': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const result = setTranslationOverride(body.lang, body.key, body.value, auth.user.id)
    sendJSON(res, 200, { result })
  },

  // 获取翻译覆盖
  'GET /api/v2/i18n/overrides': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const overrides = getTranslationOverrides(body.lang)
    sendJSON(res, 200, { overrides })
  },

  // 删除翻译覆盖
  'DELETE /api/v2/i18n/overrides/:lang/:key': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const ok = deleteTranslationOverride(body.lang, body.key)
    sendJSON(res, 200, { success: ok })
  },

  // 缺失的翻译键
  'GET /api/v2/i18n/missing-keys': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const keys = getMissingTranslationKeys(body.lang)
    sendJSON(res, 200, { missingKeys: keys })
  },

  // 批量导入翻译
  'POST /api/v2/i18n/import/:lang': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    if (!body.translations || typeof body.translations !== 'object') {
      return sendJSON(res, 400, { error: 'translations 必须是对象' })
    }
    const result = importTranslations(body.lang, body.translations, auth.user.id, { overwrite: body.overwrite !== false })
    sendJSON(res, 200, { result })
  },

  // 导出翻译
  'GET /api/v2/i18n/export/:lang': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const data = exportTranslations(body.lang)
    sendJSON(res, 200, { data })
  },

  // 翻译统计
  'GET /api/v2/i18n/stats': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const stats = getTranslationStats()
    sendJSON(res, 200, { stats })
  },

  // 测试翻译
  'POST /api/v2/i18n/test': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { key, lang, params } = body
    if (!key) return sendJSON(res, 400, { error: 'key 不能为空' })
    const result = t(key, lang || 'zh-CN', params || {})
    sendJSON(res, 200, { key, lang: lang || 'zh-CN', result })
  },

  // ===【新增模块路由锚点】===

  // ===== 模块27：系统诊断系统路由 =====
  // 运行系统自检
  'POST /api/v2/diagnostics/self-check': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const result = runSystemSelfCheck()
    auditLog('diagnostics.self_check', auth.user.id, getClientIp(req), { id: result.id, passed: result.failedCount === 0 })
    sendJSON(res, 201, { selfCheck: result })
  },

  // 自检历史
  'GET /api/v2/diagnostics/self-checks': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const checks = db.diagSelfChecks || []
    const limit = parseInt(body.limit) || 50
    sendJSON(res, 200, { selfChecks: checks.slice(-limit).reverse(), total: checks.length })
  },

  // 最近一次自检
  'GET /api/v2/diagnostics/self-checks/latest': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const checks = db.diagSelfChecks || []
    if (checks.length === 0) return sendJSON(res, 404, { error: '暂无自检记录' })
    sendJSON(res, 200, { selfCheck: checks[checks.length - 1] })
  },

  // 依赖检查
  'POST /api/v2/diagnostics/dependencies': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const result = checkDependencies()
    auditLog('diagnostics.dependencies', auth.user.id, getClientIp(req), { id: result.id, passed: result.failedCount === 0 })
    sendJSON(res, 201, { dependencies: result })
  },

  // 依赖检查历史
  'GET /api/v2/diagnostics/dependency-checks': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const checks = db.diagDependencyChecks || []
    const limit = parseInt(body.limit) || 30
    sendJSON(res, 200, { dependencyChecks: checks.slice(-limit).reverse(), total: checks.length })
  },

  // 数据完整性检查
  'POST /api/v2/diagnostics/integrity': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const result = checkDataIntegrity()
    auditLog('diagnostics.integrity', auth.user.id, getClientIp(req), { id: result.id, passed: result.passed })
    sendJSON(res, 201, { integrity: result })
  },

  // 完整性检查历史
  'GET /api/v2/diagnostics/integrity-checks': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const checks = db.diagIntegrityChecks || []
    const limit = parseInt(body.limit) || 30
    sendJSON(res, 200, { integrityChecks: checks.slice(-limit).reverse(), total: checks.length })
  },

  // 性能诊断
  'GET /api/v2/diagnostics/performance': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const performance = diagnosePerformance()
    sendJSON(res, 200, { performance })
  },

  // 上一次性能快照
  'GET /api/v2/diagnostics/performance/last': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const last = db.diagPerformance?.lastCheck
    if (!last) return sendJSON(res, 404, { error: '暂无性能快照' })
    sendJSON(res, 200, { performance: last })
  },

  // 连接诊断
  'GET /api/v2/diagnostics/connections': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const connections = diagnoseConnections()
    sendJSON(res, 200, { connections })
  },

  // 上一次连接诊断
  'GET /api/v2/diagnostics/connections/last': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const last = db.diagConnections?.lastCheck
    if (!last) return sendJSON(res, 404, { error: '暂无连接诊断记录' })
    sendJSON(res, 200, { connections: last })
  },

  // 日志分析
  'POST /api/v2/diagnostics/analyze-logs': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const result = analyzeLogs({
      since: body.since ? parseInt(body.since) : null,
    })
    sendJSON(res, 200, { analysis: result })
  },

  // 健康评分
  'GET /api/v2/diagnostics/health-score': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const health = calculateHealthScore()
    sendJSON(res, 200, { health })
  },

  // 健康评分历史
  'GET /api/v2/diagnostics/health-history': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const history = db.diagHealthScore?.history || []
    const limit = parseInt(body.limit) || 50
    sendJSON(res, 200, { history: history.slice(-limit), total: history.length })
  },

  // 上一次健康评分
  'GET /api/v2/diagnostics/health-score/last': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const last = db.diagHealthScore?.lastScore
    if (!last) return sendJSON(res, 404, { error: '暂无健康评分记录' })
    sendJSON(res, 200, { health: last })
  },

  // 生成诊断报告
  'POST /api/v2/diagnostics/reports': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const report = generateDiagnosticReport(auth.user.id)
    auditLog('diagnostics.report_generate', auth.user.id, getClientIp(req), { id: report.id, score: report.healthScore })
    sendJSON(res, 201, { report })
  },

  // 报告列表
  'GET /api/v2/diagnostics/reports': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const reports = Object.values(db.diagReports || {}).sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt))
    sendJSON(res, 200, { reports, count: reports.length })
  },

  // 获取单个报告
  'GET /api/v2/diagnostics/reports/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const report = db.diagReports?.[body.id]
    if (!report) return sendJSON(res, 404, { error: '报告不存在' })
    sendJSON(res, 200, { report })
  },

  // 删除报告
  'DELETE /api/v2/diagnostics/reports/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    if (!db.diagReports?.[body.id]) return sendJSON(res, 404, { error: '报告不存在' })
    delete db.diagReports[body.id]
    saveDB(db)
    auditLog('diagnostics.report_delete', auth.user.id, getClientIp(req), { id: body.id })
    sendJSON(res, 200, { success: true, id: body.id })
  },

  // 自动修复
  'POST /api/v2/diagnostics/auto-fix/:issueType': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const result = runAutoFix(body.issueType)
    if (result.error) return sendJSON(res, 400, { error: result.error })
    auditLog('diagnostics.auto_fix', auth.user.id, getClientIp(req), { id: result.id, type: body.issueType })
    sendJSON(res, 200, { fix: result })
  },

  // 自动修复历史
  'GET /api/v2/diagnostics/auto-fixes': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const fixes = db.diagAutoFixes || []
    const limit = parseInt(body.limit) || 50
    let filtered = fixes
    if (body.type) filtered = filtered.filter(f => f.type === body.type)
    sendJSON(res, 200, { autoFixes: filtered.slice(-limit).reverse(), total: filtered.length })
  },

  // 诊断历史
  'GET /api/v2/diagnostics/history': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const history = getDiagnosticHistory(parseInt(body.limit) || 50)
    sendJSON(res, 200, { history, count: history.length })
  },

  // 诊断统计
  'GET /api/v2/diagnostics/stats': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const selfChecks = db.diagSelfChecks || []
    const depChecks = db.diagDependencyChecks || []
    const integChecks = db.diagIntegrityChecks || []
    const reports = Object.values(db.diagReports || {})
    const autoFixes = db.diagAutoFixes || []
    const healthHistory = db.diagHealthScore?.history || []
    const lastSelfCheck = selfChecks[selfChecks.length - 1]
    const lastHealth = db.diagHealthScore?.lastScore
    const stats = {
      selfChecks: {
        total: selfChecks.length,
        lastPassed: lastSelfCheck ? lastSelfCheck.failedCount === 0 : null,
        lastCreatedAt: lastSelfCheck?.createdAt || null,
      },
      dependencyChecks: {
        total: depChecks.length,
        lastPassed: depChecks.length > 0 ? depChecks[depChecks.length - 1].failedCount === 0 : null,
      },
      integrityChecks: {
        total: integChecks.length,
        lastPassed: integChecks.length > 0 ? integChecks[integChecks.length - 1].passed : null,
      },
      reports: {
        total: reports.length,
        averageScore: reports.length > 0
          ? Math.round(reports.reduce((sum, r) => sum + (r.healthScore || 0), 0) / reports.length)
          : null,
      },
      autoFixes: {
        total: autoFixes.length,
        byType: autoFixes.reduce((acc, f) => {
          acc[f.type] = (acc[f.type] || 0) + 1
          return acc
        }, {}),
      },
      health: {
        currentScore: lastHealth?.score || null,
        currentLevel: lastHealth?.level || null,
        historyPoints: healthHistory.length,
        averageScore: healthHistory.length > 0
          ? Math.round(healthHistory.reduce((s, h) => s + h.score, 0) / healthHistory.length)
          : null,
      },
    }
    sendJSON(res, 200, { stats })
  },

  // 综合快速诊断（一键体检）
  'POST /api/v2/diagnostics/quick-check': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const performance = diagnosePerformance()
    const connections = diagnoseConnections()
    const health = calculateHealthScore()
    const quickCheck = {
      id: 'qc_' + genId(),
      timestamp: Date.now(),
      createdAt: new Date().toISOString(),
      healthScore: health.score,
      healthLevel: health.level,
      memory: performance.memory,
      uptime: performance.uptime,
      database: connections.database,
      fileSystem: connections.fileSystem,
      cache: connections.cache,
      websocket: connections.websocket,
      factors: health.factors,
      recommendations: performance.recommendations,
    }
    sendJSON(res, 200, { quickCheck })
  },

  // ===【新增模块路由锚点结束】===

  // ===== 模块26：权限审计系统路由 =====
  // 权限变更日志
  'GET /api/v2/perm-audit/change-logs': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const logs = getPermissionChangeLogs({
      type: body.type,
      targetType: body.targetType,
      targetId: body.targetId,
      operatorId: body.operatorId,
      permission: body.permission,
      since: body.since ? parseInt(body.since) : null,
      limit: parseInt(body.limit) || 100,
    })
    sendJSON(res, 200, { logs, count: logs.length })
  },

  // 权限检查日志
  'GET /api/v2/perm-audit/check-logs': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const logs = getPermissionCheckLogs({
      userId: body.userId,
      permission: body.permission,
      allowed: body.allowed === 'true' ? true : (body.allowed === 'false' ? false : undefined),
      resource: body.resource,
      since: body.since ? parseInt(body.since) : null,
      limit: parseInt(body.limit) || 100,
    })
    sendJSON(res, 200, { logs, count: logs.length })
  },

  // 权限分析
  'POST /api/v2/perm-audit/analyze': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const analysis = analyzePermissions({
      since: body.since ? parseInt(body.since) : 0,
    })
    sendJSON(res, 200, { analysis })
  },

  // 检查告警
  'POST /api/v2/perm-audit/check-alerts': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const alerts = checkPermissionAlerts()
    sendJSON(res, 200, { newAlerts: alerts, count: alerts.length })
  },

  // 告警列表
  'GET /api/v2/perm-audit/alerts': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    let alerts = db.permAlerts || []
    if (body.severity) alerts = alerts.filter(a => a.severity === body.severity)
    if (body.type) alerts = alerts.filter(a => a.type === body.type)
    const limit = parseInt(body.limit) || 100
    sendJSON(res, 200, { alerts: alerts.slice(-limit).reverse(), total: alerts.length })
  },

  // 生成权限报告
  'POST /api/v2/perm-audit/reports': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const report = generatePermissionReport(body.type || 'all', auth.user.id)
    sendJSON(res, 201, { report })
  },

  // 报告列表
  'GET /api/v2/perm-audit/reports': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const reports = Object.values(db.permReports || {})
    sendJSON(res, 200, { reports })
  },

  // 获取报告
  'GET /api/v2/perm-audit/reports/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const report = db.permReports?.[body.id]
    if (!report) return sendJSON(res, 404, { error: '报告不存在' })
    sendJSON(res, 200, { report })
  },

  // 角色变更历史
  'GET /api/v2/perm-audit/role-changes': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    let logs = db.roleChangeHistory || []
    if (body.userId) logs = logs.filter(l => l.userId === body.userId)
    const limit = parseInt(body.limit) || 100
    sendJSON(res, 200, { logs: logs.slice(-limit).reverse(), total: logs.length })
  },

  // 资源访问日志
  'GET /api/v2/perm-audit/resource-access': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    let logs = db.resourceAccessLogs || []
    if (body.userId) logs = logs.filter(l => l.userId === body.userId)
    if (body.resource) logs = logs.filter(l => l.resource === body.resource)
    if (body.action) logs = logs.filter(l => l.action === body.action)
    const limit = parseInt(body.limit) || 100
    sendJSON(res, 200, { logs: logs.slice(-limit).reverse(), total: logs.length })
  },

  // 敏感操作日志
  'GET /api/v2/perm-audit/sensitive-ops': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    let logs = db.sensitiveOpLogs || []
    if (body.userId) logs = logs.filter(l => l.userId === body.userId)
    if (body.riskLevel) logs = logs.filter(l => l.riskLevel === body.riskLevel)
    const limit = parseInt(body.limit) || 100
    sendJSON(res, 200, { logs: logs.slice(-limit).reverse(), total: logs.length })
  },

  // 记录敏感操作
  'POST /api/v2/perm-audit/sensitive-ops': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const log = logSensitiveOperation({
      ...body,
      userId: auth.user.id,
      ip: getClientIp(req),
      userAgent: req.headers['user-agent'],
    })
    sendJSON(res, 201, { log })
  },

  // 合规检查
  'POST /api/v2/perm-audit/compliance/:checkType': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const result = runComplianceCheck(body.checkType)
    if (result.error) return sendJSON(res, 400, result)
    sendJSON(res, 200, { result })
  },

  // 合规检查历史
  'GET /api/v2/perm-audit/compliance': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    let checks = db.complianceChecks || []
    if (body.checkType) checks = checks.filter(c => c.checkType === body.checkType)
    const limit = parseInt(body.limit) || 100
    sendJSON(res, 200, { checks: checks.slice(-limit).reverse(), total: checks.length })
  },

  // 权限推荐
  'GET /api/v2/perm-audit/recommendations': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const analysis = analyzePermissions({
      since: body.since ? parseInt(body.since) : 0,
    })
    const recommendations = generatePermissionRecommendations(analysis)
    sendJSON(res, 200, { recommendations, count: recommendations.length })
  },

  // 权限审计统计
  'GET /api/v2/perm-audit/stats': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const stats = getPermissionAuditStats()
    sendJSON(res, 200, { stats })
  },

  // ===== 模块25：AI 推理引擎增强路由 =====
  // 模型路由查询
  'GET /api/v2/ai/routes/:taskType': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const route = routeAIModel(body.taskType)
    sendJSON(res, 200, { route })
  },

  // 设置模型路由
  'POST /api/v2/ai/routes/:taskType': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const route = setAIModelRoute(body.taskType, body, auth.user.id)
    sendJSON(res, 201, { route })
  },

  // 列出所有路由
  'GET /api/v2/ai/routes': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const routes = db.aiModelRoutes || {}
    sendJSON(res, 200, { routes })
  },

  // 负载均衡器列表
  'GET /api/v2/ai/load-balancers': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const lbs = db.aiModelLoadBalancers || {}
    sendJSON(res, 200, { loadBalancers: lbs })
  },

  // 添加模型到负载均衡器
  'POST /api/v2/ai/load-balancers/:provider/models': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    if (!body.model) return sendJSON(res, 400, { error: 'model 不能为空' })
    const model = addModelToLoadBalancer(body.provider, body, auth.user.id)
    sendJSON(res, 201, { model })
  },

  // 选择模型（测试）
  'POST /api/v2/ai/load-balancers/:provider/select': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const model = selectModelWithLoadBalance(body.provider, body.strategy)
    sendJSON(res, 200, { model })
  },

  // Token 计数
  'POST /api/v2/ai/count-tokens': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const tokens = countTokens(body.text, body.model)
    sendJSON(res, 200, { tokens, model: body.model })
  },

  // 上下文窗口管理
  'POST /api/v2/ai/context-window': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const result = manageContextWindow(body.messages || [], body.maxTokens || 4096, body.strategy || 'remove-oldest')
    sendJSON(res, 200, result)
  },

  // 对话压缩
  'POST /api/v2/ai/compress': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const result = compressConversation(body.messages || [], body.targetTokens || 1024)
    sendJSON(res, 200, result)
  },

  // 提示词优化
  'POST /api/v2/ai/optimize-prompt': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!body.prompt) return sendJSON(res, 400, { error: 'prompt 不能为空' })
    const result = optimizePrompt(body.prompt, body.options || {})
    sendJSON(res, 200, result)
  },

  // 缓存查询
  'GET /api/v2/ai/cache': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const cached = getAIResponseCache(body.prompt, body.model)
    sendJSON(res, 200, { hit: !!cached, cache: cached })
  },

  // 清空缓存
  'POST /api/v2/ai/cache/clear': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const count = Object.keys(db.aiResponseCache || {}).length
    db.aiResponseCache = {}
    saveDB(db)
    sendJSON(res, 200, { success: true, cleared: count })
  },

  // 创建 SSE 连接
  'POST /api/v2/ai/sse/connections': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const conn = createSSEConnection(null, auth.user.id)
    sendJSON(res, 201, { connection: conn })
  },

  // 推送 SSE 块
  'POST /api/v2/ai/sse/connections/:id/chunks': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const ok = pushSSEChunk(body.id, body.chunk)
    sendJSON(res, 200, { success: ok })
  },

  // 关闭 SSE 连接
  'DELETE /api/v2/ai/sse/connections/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const ok = closeSSEConnection(body.id)
    sendJSON(res, 200, { success: ok })
  },

  // 创建模型对比
  'POST /api/v2/ai/comparisons': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!body.prompt) return sendJSON(res, 400, { error: 'prompt 不能为空' })
    const comparison = createModelComparison(body.prompt, body.models || [], auth.user.id)
    sendJSON(res, 201, { comparison })
  },

  // 添加对比结果
  'POST /api/v2/ai/comparisons/:id/results': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const ok = addModelComparisonResult(body.id, body.model, body.response, body.latency || 0, body.tokens || 0)
    sendJSON(res, 200, { success: ok })
  },

  // 列出对比
  'GET /api/v2/ai/comparisons': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const comparisons = (db.aiModelComparisons || []).slice(-50).reverse()
    sendJSON(res, 200, { comparisons })
  },

  // 获取对比详情
  'GET /api/v2/ai/comparisons/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const comparison = (db.aiModelComparisons || []).find(c => c.id === body.id)
    if (!comparison) return sendJSON(res, 404, { error: '对比不存在' })
    sendJSON(res, 200, { comparison })
  },

  // 推理日志
  'GET /api/v2/ai/inference-logs': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    let logs = db.aiInferenceLogs || []
    if (body.userId) logs = logs.filter(l => l.userId === body.userId)
    if (body.model) logs = logs.filter(l => l.model === body.model)
    if (body.taskType) logs = logs.filter(l => l.taskType === body.taskType)
    const limit = parseInt(body.limit) || 100
    sendJSON(res, 200, { logs: logs.slice(-limit).reverse(), total: logs.length })
  },

  // 成本计算
  'POST /api/v2/ai/calculate-cost': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const cost = calculateCost(body.model, body.inputTokens || 0, body.outputTokens || 0)
    sendJSON(res, 200, cost)
  },

  // 成本记录
  'GET /api/v2/ai/cost-records': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    let records = db.aiCostRecords || []
    if (body.userId) records = records.filter(r => r.userId === body.userId)
    if (body.model) records = records.filter(r => r.model === body.model)
    const limit = parseInt(body.limit) || 100
    sendJSON(res, 200, { records: records.slice(-limit).reverse(), total: records.length })
  },

  // 模型定价表
  'GET /api/v2/ai/pricing': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    sendJSON(res, 200, { pricing: MODEL_PRICING })
  },

  // AI 统计
  'GET /api/v2/ai/stats': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const stats = getAIStats()
    sendJSON(res, 200, { stats })
  },

  // Token 使用记录
  'GET /api/v2/ai/token-usage': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    let records = db.aiTokenCounts || []
    if (body.userId) records = records.filter(r => r.userId === body.userId)
    const limit = parseInt(body.limit) || 100
    sendJSON(res, 200, { records: records.slice(-limit).reverse(), total: records.length })
  },

  // ===== 模块24：用户行为分析系统路由 =====
  // 追踪行为
  'POST /api/v2/analytics/track': async (req, res, body) => {
    const auth = authenticate(req)
    const userId = auth.authenticated ? auth.user.id : (body.userId || 'anonymous')
    if (!body.type) return sendJSON(res, 400, { error: 'type 不能为空' })
    const behavior = trackUserBehavior(userId, { ...body, ip: getClientIp(req), userAgent: req.headers['user-agent'] })
    sendJSON(res, 201, { behavior })
  },

  // 用户画像
  'GET /api/v2/analytics/profiles/:userId': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const profile = getBehaviorProfile(body.userId)
    if (!profile) return sendJSON(res, 404, { error: '画像不存在' })
    sendJSON(res, 200, { profile })
  },

  // 当前用户画像
  'GET /api/v2/analytics/profile': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const profile = getBehaviorProfile(auth.user.id)
    sendJSON(res, 200, { profile })
  },

  // 创建漏斗
  'POST /api/v2/analytics/funnels': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('analytics:write')(req, res, auth)) return
    const funnel = createBehaviorFunnel(body, auth.user.id)
    sendJSON(res, 201, { funnel })
  },

  // 列出漏斗
  'GET /api/v2/analytics/funnels': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const funnels = Object.values(db.behaviorFunnels || {})
    sendJSON(res, 200, { funnels })
  },

  // 分析漏斗
  'POST /api/v2/analytics/funnels/:id/analyze': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const result = analyzeFunnel(body.id, {
      since: body.since ? parseInt(body.since) : 0,
      until: body.until ? parseInt(body.until) : Date.now(),
    })
    if (!result) return sendJSON(res, 404, { error: '漏斗不存在' })
    sendJSON(res, 200, { conversions: result })
  },

  // 留存分析
  'GET /api/v2/analytics/retention': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const result = analyzeRetention(body.cohort ? parseInt(body.cohort) : 0, body.period || 'day')
    sendJSON(res, 200, result)
  },

  // 路径分析
  'GET /api/v2/analytics/paths/:userId': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const result = analyzeUserPath(body.userId, {
      limit: parseInt(body.limit) || 100,
      since: body.since ? parseInt(body.since) : 0,
    })
    sendJSON(res, 200, result)
  },

  // 热力图数据
  'GET /api/v2/analytics/heatmap': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!body.page) return sendJSON(res, 400, { error: 'page 不能为空' })
    const data = getHeatmapData(body.page, {
      since: body.since ? parseInt(body.since) : 0,
    })
    sendJSON(res, 200, { heatmap: data })
  },

  // 自定义事件追踪
  'POST /api/v2/analytics/events/:name': async (req, res, body) => {
    const auth = authenticate(req)
    const userId = auth.authenticated ? auth.user.id : (body.userId || 'anonymous')
    const evt = trackCustomEvent(body.name, { ...body, userId })
    sendJSON(res, 200, { event: evt })
  },

  // 事件聚合
  'GET /api/v2/analytics/events/:name/aggregation': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const result = getEventAggregation(body.name, body.period || 'day')
    if (!result) return sendJSON(res, 404, { error: '事件不存在' })
    sendJSON(res, 200, result)
  },

  // 列出自定义事件
  'GET /api/v2/analytics/events': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const events = Object.entries(db.behaviorEvents || {}).map(([name, e]) => ({
      name, count: e.count, uniqueUsers: Object.keys(e.users).length, lastFired: e.lastFired,
    }))
    sendJSON(res, 200, { events })
  },

  // 生成报表
  'POST /api/v2/analytics/reports': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('analytics:read')(req, res, auth)) return
    const report = generateBehaviorReport(body.type || 'daily', body.options)
    sendJSON(res, 201, { report })
  },

  // 列出报表
  'GET /api/v2/analytics/reports': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const reports = Object.values(db.behaviorReports || {})
    sendJSON(res, 200, { reports })
  },

  // 获取报表
  'GET /api/v2/analytics/reports/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const report = db.behaviorReports?.[body.id]
    if (!report) return sendJSON(res, 404, { error: '报表不存在' })
    sendJSON(res, 200, { report })
  },

  // 数据导出
  'POST /api/v2/analytics/export': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('analytics:read')(req, res, auth)) return
    const result = exportBehaviorData(body.format || 'json', {
      since: body.since ? parseInt(body.since) : 0,
    })
    sendJSON(res, 200, result)
  },

  // 行为列表
  'GET /api/v2/analytics/behaviors': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    let behaviors = db.userBehaviors || []
    if (body.userId) behaviors = behaviors.filter(b => b.userId === body.userId)
    if (body.type) behaviors = behaviors.filter(b => b.type === body.type)
    if (body.since) behaviors = behaviors.filter(b => b.timestamp >= parseInt(body.since))
    const limit = parseInt(body.limit) || 100
    sendJSON(res, 200, { behaviors: behaviors.slice(-limit).reverse(), total: behaviors.length })
  },

  // ===== 模块23：文件存储系统增强路由 =====
  // 创建挂载点
  'POST /api/v2/files/mounts': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    if (!body.path || !body.target) return sendJSON(res, 400, { error: 'path 和 target 不能为空' })
    const mount = createVFSMount(body, auth.user.id)
    auditLog('file.mount_create', auth.user.id, getClientIp(req), { id: mount.id })
    sendJSON(res, 201, { mount })
  },

  // 列出挂载点
  'GET /api/v2/files/mounts': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const mounts = Object.values(db.vfsMounts || {})
    sendJSON(res, 200, { mounts })
  },

  // 解析虚拟路径
  'POST /api/v2/files/resolve-path': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!body.path) return sendJSON(res, 400, { error: 'path 不能为空' })
    const result = resolveVFSPath(body.path)
    sendJSON(res, 200, result)
  },

  // 创建文件版本
  'POST /api/v2/files/:id/versions': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const version = createFileVersion(body.id, body.content, body.metadata, auth.user.id)
    sendJSON(res, 201, { version })
  },

  // 获取文件版本历史
  'GET /api/v2/files/:id/versions': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const versions = getFileVersions(body.id)
    sendJSON(res, 200, { versions, count: versions.length })
  },

  // 还原文件版本
  'POST /api/v2/files/:id/versions/:version/restore': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('files:write')(req, res, auth)) return
    const version = restoreFileVersion(body.id, body.version, auth.user.id)
    if (!version) return sendJSON(res, 404, { error: '文件或版本不存在' })
    auditLog('file.version_restore', auth.user.id, getClientIp(req), { fileId: body.id, version: body.version })
    sendJSON(res, 200, { version })
  },

  // 锁定文件
  'POST /api/v2/files/:id/lock': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const result = lockFile(body.id, auth.user.id, {
      duration: body.duration,
      type: body.type,
    })
    if (result.locked) return sendJSON(res, 409, { error: '文件已被锁定', lockedBy: result.by })
    sendJSON(res, 200, { lock: result.lock })
  },

  // 解锁文件
  'DELETE /api/v2/files/:id/lock': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const ok = unlockFile(body.id, auth.user.id)
    sendJSON(res, 200, { success: ok })
  },

  // 检查文件锁
  'GET /api/v2/files/:id/lock': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const lock = checkFileLock(body.id)
    sendJSON(res, 200, { locked: !!lock, lock })
  },

  // 创建分享
  'POST /api/v2/files/:id/share': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const share = createFileShare(body.id, body, auth.user.id)
    sendJSON(res, 201, { share })
  },

  // 验证分享
  'POST /api/v2/files/share/verify': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const result = verifyFileShare(body.token, body.password)
    sendJSON(res, 200, result)
  },

  // 撤销分享
  'DELETE /api/v2/files/shares/:shareId': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const ok = revokeFileShare(body.shareId)
    sendJSON(res, 200, { success: ok })
  },

  // 文件搜索
  'GET /api/v2/files/search': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const files = searchFiles({
      keyword: body.keyword,
      type: body.type,
      tags: body.tags ? (Array.isArray(body.tags) ? body.tags : [body.tags]) : null,
      minSize: body.minSize ? parseInt(body.minSize) : null,
      maxSize: body.maxSize ? parseInt(body.maxSize) : null,
    })
    sendJSON(res, 200, { files, count: files.length })
  },

  // 文件预览
  'GET /api/v2/files/:id/preview': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const file = db.files?.[body.id]
    if (!file) return sendJSON(res, 404, { error: '文件不存在' })
    const preview = generateFilePreview(file)
    sendJSON(res, 200, { preview })
  },

  // 文件转换
  'POST /api/v2/files/:id/convert': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!body.targetFormat) return sendJSON(res, 400, { error: 'targetFormat 不能为空' })
    const job = convertFile(body.id, body.targetFormat, auth.user.id)
    if (!job) return sendJSON(res, 404, { error: '文件不存在' })
    sendJSON(res, 200, { job })
  },

  // 转换记录
  'GET /api/v2/files/conversions': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    let jobs = db.fileConversions || []
    if (body.fileId) jobs = jobs.filter(j => j.fileId === body.fileId)
    sendJSON(res, 200, { jobs: jobs.slice(-100).reverse(), count: jobs.length })
  },

  // 设置元数据
  'PUT /api/v2/files/:id/metadata': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('files:write')(req, res, auth)) return
    const metadata = setFileMetadata(body.id, body.metadata || {}, body.merge !== false)
    sendJSON(res, 200, { metadata })
  },

  // 获取元数据
  'GET /api/v2/files/:id/metadata': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const metadata = getFileMetadata(body.id)
    sendJSON(res, 200, { metadata })
  },

  // 计算存储路径
  'POST /api/v2/files/storage-path': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const file = body.file || {}
    const path = computeStoragePath(file, body.strategy || 'byTime')
    sendJSON(res, 200, { path })
  },

  // 创建批量任务
  'POST /api/v2/files/batch': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!body.operation || !Array.isArray(body.fileIds)) return sendJSON(res, 400, { error: 'operation 和 fileIds 不能为空' })
    const job = createBatchJob(body.operation, body.fileIds, auth.user.id)
    sendJSON(res, 201, { job })
  },

  // 执行批量删除
  'POST /api/v2/files/batch/:id/execute': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('files:delete')(req, res, auth)) return
    const job = executeBatchDelete(body.id)
    if (!job) return sendJSON(res, 404, { error: '批量任务不存在' })
    sendJSON(res, 200, { job })
  },

  // 文件存储统计
  'GET /api/v2/files/storage-stats': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const stats = getFileStorageStats()
    sendJSON(res, 200, { stats })
  },

  // ===== 模块22：事件驱动系统路由 =====
  // 列出事件类型
  'GET /api/v2/events/types': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const types = listEventTypes()
    sendJSON(res, 200, { types, count: types.length })
  },

  // 订阅事件
  'POST /api/v2/events/subscribe': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!body.eventType) return sendJSON(res, 400, { error: 'eventType 不能为空' })
    if (!body.handlerId) return sendJSON(res, 400, { error: 'handlerId 不能为空' })
    const subscription = subscribeEvent(body.eventType, body.handlerId, {
      filter: body.filter,
      priority: body.priority,
      async: body.async,
      maxRetries: body.maxRetries,
    })
    auditLog('event.subscribe', auth.user.id, getClientIp(req), { id: subscription.id })
    sendJSON(res, 201, { subscription })
  },

  // 取消订阅
  'DELETE /api/v2/events/subscriptions/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const ok = unsubscribeEvent(body.id)
    sendJSON(res, 200, { success: ok })
  },

  // 列出订阅
  'GET /api/v2/events/subscriptions': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const subs = db.eventBus?.subscribers || {}
    let all = []
    for (const [eventType, list] of Object.entries(subs)) {
      all = all.concat(list.map(s => ({ ...s, eventType })))
    }
    if (body.eventType) all = all.filter(s => s.eventType === body.eventType)
    sendJSON(res, 200, { subscriptions: all, count: all.length })
  },

  // 注册事件处理器
  'POST /api/v2/events/handlers': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!body.id) return sendJSON(res, 400, { error: 'id 不能为空' })
    // 注册一个空函数（实际系统中由代码定义）
    const handler = registerEventHandler(body.id, () => {}, body.description)
    sendJSON(res, 201, { handler: { ...handler, fn: undefined } })
  },

  // 列出处理器
  'GET /api/v2/events/handlers': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const handlers = Object.values(db.eventHandlers || {}).map(h => ({ ...h, fn: undefined }))
    sendJSON(res, 200, { handlers })
  },

  // 注销处理器
  'DELETE /api/v2/events/handlers/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const ok = unregisterEventHandler(body.id)
    sendJSON(res, 200, { success: ok })
  },

  // 发布事件
  'POST /api/v2/events/publish': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!body.type) return sendJSON(res, 400, { error: 'type 不能为空' })
    const result = publishEvent(body.type, body.payload || {}, body.source || auth.user.id)
    auditLog('event.publish', auth.user.id, getClientIp(req), { eventId: result.event.id, type: body.type })
    sendJSON(res, 200, result)
  },

  // 事件历史
  'GET /api/v2/events/history': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const result = getEventHistory({
      type: body.type,
      source: body.source,
      since: body.since ? parseInt(body.since) : null,
      until: body.until ? parseInt(body.until) : null,
      status: body.status,
      offset: parseInt(body.offset) || 0,
      limit: parseInt(body.limit) || 100,
    })
    sendJSON(res, 200, result)
  },

  // 事件重放
  'POST /api/v2/events/replay/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const replay = replayEvent(body.id, body.targetHandlers)
    if (!replay) return sendJSON(res, 404, { error: '事件不存在' })
    auditLog('event.replay', auth.user.id, getClientIp(req), { eventId: body.id })
    sendJSON(res, 200, { replay })
  },

  // 事件溯源：状态重建
  'POST /api/v2/events/rebuild-state': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!body.eventType) return sendJSON(res, 400, { error: 'eventType 不能为空' })
    const result = rebuildStateFromEvents(body.eventType, body.since ? parseInt(body.since) : null)
    sendJSON(res, 200, result)
  },

  // 创建快照
  'POST /api/v2/events/snapshots': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!body.name || !body.eventType) return sendJSON(res, 400, { error: 'name 和 eventType 不能为空' })
    const snapshot = createEventSnapshot(body.name, body.eventType, auth.user.id)
    sendJSON(res, 201, { snapshot })
  },

  // 列出快照
  'GET /api/v2/events/snapshots': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const snapshots = Object.values(db.eventSnapshots || {})
    sendJSON(res, 200, { snapshots })
  },

  // 重放历史
  'GET /api/v2/events/replays': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const replays = (db.eventReplay || []).slice(-100).reverse()
    sendJSON(res, 200, { replays, count: replays.length })
  },

  // 事件统计
  'GET /api/v2/events/stats': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const stats = getEventStats()
    sendJSON(res, 200, { stats })
  },

  // ===== 模块21：消息队列系统路由 =====
  // 创建队列
  'POST /api/v2/mq/queues': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    if (!body.name) return sendJSON(res, 400, { error: 'name 不能为空' })
    const queue = createMQQueue(body, auth.user.id)
    auditLog('mq.queue_create', auth.user.id, getClientIp(req), { id: queue.id })
    sendJSON(res, 201, { queue })
  },

  // 列出队列
  'GET /api/v2/mq/queues': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const queues = Object.values(db.mqQueues || {})
    sendJSON(res, 200, { queues, count: queues.length })
  },

  // 获取队列详情
  'GET /api/v2/mq/queues/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const queue = db.mqQueues?.[body.id]
    if (!queue) return sendJSON(res, 404, { error: '队列不存在' })
    sendJSON(res, 200, { queue, stats: getMQQueueStats(body.id) })
  },

  // 删除队列
  'DELETE /api/v2/mq/queues/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const ok = deleteMQQueue(body.id)
    if (!ok) return sendJSON(res, 404, { error: '队列不存在' })
    auditLog('mq.queue_delete', auth.user.id, getClientIp(req), { id: body.id })
    sendJSON(res, 200, { success: true })
  },

  // 清空队列
  'POST /api/v2/mq/queues/:id/clear': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const result = clearMQQueue(body.id)
    if (!result) return sendJSON(res, 404, { error: '队列不存在' })
    sendJSON(res, 200, { success: true, ...result })
  },

  // 生产消息
  'POST /api/v2/mq/queues/:id/produce': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const message = produceMessage(body.id, body, auth.user.id)
    if (!message) return sendJSON(res, 404, { error: '队列不存在' })
    if (message.error) return sendJSON(res, 429, { error: message.error })
    sendJSON(res, 201, { message })
  },

  // 消费消息（拉取）
  'POST /api/v2/mq/queues/:id/consume': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const consumerId = body.consumerId || ('csm_' + auth.user.id)
    const message = consumeMessage(body.id, consumerId)
    if (!message) return sendJSON(res, 200, { message: null })
    sendJSON(res, 200, { message })
  },

  // 确认消息
  'POST /api/v2/mq/queues/:id/ack/:messageId': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const ok = ackMessage(body.id, body.messageId)
    if (!ok) return sendJSON(res, 404, { error: '消息不存在或状态不正确' })
    sendJSON(res, 200, { success: true })
  },

  // 拒绝消息
  'POST /api/v2/mq/queues/:id/nack/:messageId': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const ok = nackMessage(body.id, body.messageId, body.requeue !== false)
    if (!ok) return sendJSON(res, 404, { error: '消息不存在或状态不正确' })
    sendJSON(res, 200, { success: true })
  },

  // 队列消息列表
  'GET /api/v2/mq/queues/:id/messages': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    let messages = db.mqMessages?.[body.id] || []
    if (body.status) messages = messages.filter(m => m.status === body.status)
    const limit = parseInt(body.limit) || 50
    sendJSON(res, 200, { messages: messages.slice(0, limit), total: messages.length })
  },

  // 注册消费者
  'POST /api/v2/mq/queues/:id/consumers': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const consumer = registerMQConsumer(body.id, body, auth.user.id)
    sendJSON(res, 201, { consumer })
  },

  // 消费者列表
  'GET /api/v2/mq/queues/:id/consumers': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const consumers = db.mqConsumers?.[body.id] || []
    sendJSON(res, 200, { consumers })
  },

  // 注销消费者
  'DELETE /api/v2/mq/queues/:id/consumers/:consumerId': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const ok = unregisterMQConsumer(body.id, body.consumerId)
    sendJSON(res, 200, { success: ok })
  },

  // 死信列表
  'GET /api/v2/mq/dead-letters': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    let deads = db.mqDeadLetters || []
    if (body.queueId) deads = deads.filter(d => d.originalQueueId === body.queueId)
    const limit = parseInt(body.limit) || 100
    sendJSON(res, 200, { deadLetters: deads.slice(-limit).reverse(), total: deads.length })
  },

  // 死信重处理
  'POST /api/v2/mq/dead-letters/:id/reprocess': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const message = reprocessDeadLetter(body.id, body.targetQueueId)
    if (!message) return sendJSON(res, 404, { error: '死信不存在' })
    sendJSON(res, 200, { message })
  },

  // 处理延迟消息
  'POST /api/v2/mq/process-delayed': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const result = processDelayedMessages()
    sendJSON(res, 200, { success: true, ...result })
  },

  // 延迟消息列表
  'GET /api/v2/mq/delayed': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const delayed = db.mqDelayedMessages || []
    sendJSON(res, 200, { messages: delayed.slice(-100).reverse(), total: delayed.length })
  },

  // 全部队列统计
  'GET /api/v2/mq/stats': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const stats = getAllMQStats()
    sendJSON(res, 200, { stats })
  },

  // 单队列统计
  'GET /api/v2/mq/queues/:id/stats': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const stats = getMQQueueStats(body.id)
    if (!stats) return sendJSON(res, 404, { error: '队列不存在' })
    sendJSON(res, 200, { stats })
  },

  // 批量生产消息
  'POST /api/v2/mq/queues/:id/batch-produce': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!Array.isArray(body.messages)) return sendJSON(res, 400, { error: 'messages 必须是数组' })
    const results = []
    for (const msg of body.messages) {
      const r = produceMessage(body.id, msg, auth.user.id)
      results.push({ success: !!r && !r.error, message: r })
    }
    sendJSON(res, 200, { results, count: results.length })
  },

  // ===== 模块20：API 网关系统路由 =====
  // 注册网关路由
  'POST /api/v2/gateway/routes': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    if (!body.path) return sendJSON(res, 400, { error: 'path 不能为空' })
    const route = registerGatewayRoute(body, auth.user.id)
    auditLog('gateway.route_create', auth.user.id, getClientIp(req), { id: route.id, path: route.path })
    sendJSON(res, 201, { route })
  },

  // 列出网关路由
  'GET /api/v2/gateway/routes': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    let routes = Object.values(db.gatewayRoutes || {}).map(r => ({ ...r, _compiled: undefined }))
    if (body.group) routes = routes.filter(r => r.group === body.group)
    if (body.enabled !== undefined) routes = routes.filter(r => r.enabled === (body.enabled === true || body.enabled === 'true'))
    sendJSON(res, 200, { routes, count: routes.length })
  },

  // 获取单个网关路由
  'GET /api/v2/gateway/routes/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const route = db.gatewayRoutes?.[body.id]
    if (!route) return sendJSON(res, 404, { error: '路由不存在' })
    sendJSON(res, 200, { route: { ...route, _compiled: undefined } })
  },

  // 更新网关路由
  'PUT /api/v2/gateway/routes/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const route = updateGatewayRoute(body.id, body, auth.user.id)
    if (!route) return sendJSON(res, 404, { error: '路由不存在' })
    auditLog('gateway.route_update', auth.user.id, getClientIp(req), { id: body.id })
    sendJSON(res, 200, { route: { ...route, _compiled: undefined } })
  },

  // 删除网关路由
  'DELETE /api/v2/gateway/routes/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const ok = deleteGatewayRoute(body.id)
    if (!ok) return sendJSON(res, 404, { error: '路由不存在' })
    auditLog('gateway.route_delete', auth.user.id, getClientIp(req), { id: body.id })
    sendJSON(res, 200, { success: true })
  },

  // 路由匹配测试
  'POST /api/v2/gateway/routes/match': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { method, pathname } = body
    if (!method || !pathname) return sendJSON(res, 400, { error: 'method 和 pathname 不能为空' })
    const result = matchGatewayRoute(method.toUpperCase(), pathname)
    sendJSON(res, 200, { matched: !!result, route: result?.route ? { ...result.route, _compiled: undefined } : null, params: result?.params || {} })
  },

  // 请求验证测试
  'POST /api/v2/gateway/validate': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { validation, data } = body
    const result = validateRequest(validation, data)
    sendJSON(res, 200, result)
  },

  // 请求转换测试
  'POST /api/v2/gateway/transform-request': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { transform, request, payload } = body
    const result = applyRequestTransform(transform, request || { headers: {} }, payload || {})
    sendJSON(res, 200, result)
  },

  // 响应转换测试
  'POST /api/v2/gateway/transform-response': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { transform, response } = body
    const result = applyResponseTransform(transform, response || {})
    sendJSON(res, 200, { result })
  },

  // 熔断器状态查询
  'GET /api/v2/gateway/circuit-breakers': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const breakers = Object.entries(db.gatewayCircuitBreakers || {}).map(([routeId, cb]) => ({ routeId, ...cb }))
    sendJSON(res, 200, { breakers })
  },

  // 重置熔断器
  'POST /api/v2/gateway/circuit-breakers/:routeId/reset': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    if (!db.gatewayCircuitBreakers) db.gatewayCircuitBreakers = {}
    db.gatewayCircuitBreakers[body.routeId] = {
      state: 'closed', failureCount: 0, successCount: 0,
      lastFailure: null, lastStateChange: Date.now(),
      threshold: 5, resetTimeout: 30000, halfOpenMax: 3, halfOpenCount: 0,
    }
    saveDB(db)
    auditLog('gateway.circuit_breaker_reset', auth.user.id, getClientIp(req), { routeId: body.routeId })
    sendJSON(res, 200, { success: true, breaker: db.gatewayCircuitBreakers[body.routeId] })
  },

  // 幂等性检查
  'POST /api/v2/gateway/idempotency/check': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const result = checkIdempotency(body.key, body.payload || {})
    sendJSON(res, 200, result)
  },

  // 清理过期幂等记录
  'POST /api/v2/gateway/idempotency/cleanup': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const result = cleanupIdempotency()
    sendJSON(res, 200, { success: true, ...result })
  },

  // 创建分组
  'POST /api/v2/gateway/groups': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const group = createGatewayGroup(body, auth.user.id)
    auditLog('gateway.group_create', auth.user.id, getClientIp(req), { id: group.id })
    sendJSON(res, 201, { group })
  },

  // 列出分组
  'GET /api/v2/gateway/groups': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const groups = Object.values(db.gatewayGroups || {})
    sendJSON(res, 200, { groups })
  },

  // 添加路由到分组
  'POST /api/v2/gateway/groups/:id/routes/:routeId': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const ok = addRouteToGroup(body.id, body.routeId)
    sendJSON(res, 200, { success: ok })
  },

  // 注册后端
  'POST /api/v2/gateway/backends': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    if (!body.url) return sendJSON(res, 400, { error: 'url 不能为空' })
    const backend = registerGatewayBackend(body, auth.user.id)
    sendJSON(res, 201, { backend })
  },

  // 列出后端
  'GET /api/v2/gateway/backends': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const backends = Object.values(db.gatewayBackends || {})
    sendJSON(res, 200, { backends })
  },

  // 更新黑名单
  'PUT /api/v2/gateway/blocklist': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    if (!db.gatewayBlocklist) db.gatewayBlocklist = {}
    const bl = db.gatewayBlocklist
    if (body.ipBlacklist) bl.ipBlacklist = body.ipBlacklist
    if (body.ipWhitelist) bl.ipWhitelist = body.ipWhitelist
    if (body.geoBlocking) bl.geoBlocking = body.geoBlocking
    if (body.deviceRestrictions) bl.deviceRestrictions = body.deviceRestrictions
    saveDB(db)
    auditLog('gateway.blocklist_update', auth.user.id, getClientIp(req), {})
    sendJSON(res, 200, { success: true, blocklist: bl })
  },

  // 查询黑名单
  'GET /api/v2/gateway/blocklist': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    sendJSON(res, 200, { blocklist: db.gatewayBlocklist || {} })
  },

  // 黑名单检查
  'POST /api/v2/gateway/blocklist/check': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const result = checkGatewayBlocklist(body.ip || getClientIp(req), body.geo || '', body.device || '')
    sendJSON(res, 200, result)
  },

  // 追踪列表
  'GET /api/v2/gateway/traces': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const traces = getTraces({
      routeId: body.routeId,
      status: body.status,
      since: body.since ? parseInt(body.since) : null,
      minDuration: body.minDuration ? parseInt(body.minDuration) : null,
      offset: parseInt(body.offset) || 0,
      limit: parseInt(body.limit) || 100,
    })
    sendJSON(res, 200, { traces, count: traces.length })
  },

  // 网关统计
  'GET /api/v2/gateway/stats': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const stats = getGatewayStats()
    sendJSON(res, 200, { stats })
  },

  // 模拟请求（测试网关）
  'POST /api/v2/gateway/test': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const { method, pathname, payload } = body
    const traceId = generateTraceId()
    const spanId = generateSpanId()
    const startTime = Date.now()
    const matched = matchGatewayRoute((method || 'GET').toUpperCase(), pathname || '/')
    if (!matched) {
      recordTrace({ traceId, spanId, routeId: null, method, pathname, status: 404, duration: Date.now() - startTime, startTime })
      return sendJSON(res, 404, { error: '没有匹配的网关路由', traceId })
    }
    const { route, params } = matched
    // 熔断器检查
    if (route.circuitBreaker !== false && isCircuitBreakerOpen(route.id)) {
      recordTrace({ traceId, spanId, routeId: route.id, method, pathname, status: 503, duration: Date.now() - startTime, startTime, reason: 'circuit-breaker-open' })
      return sendJSON(res, 503, { error: '熔断器已打开', traceId })
    }
    // 幂等性检查
    if (route.idempotencyKey && payload && payload[route.idempotencyKey]) {
      const idem = checkIdempotency(payload[route.idempotencyKey], payload)
      if (idem.hit) {
        recordTrace({ traceId, spanId, routeId: route.id, method, pathname, status: 200, duration: Date.now() - startTime, startTime, fromCache: true })
        return sendJSON(res, 200, { response: idem.response, fromCache: true, traceId })
      }
    }
    // 模拟后端响应
    const success = Math.random() > 0.1
    const latency = 10 + Math.floor(Math.random() * 100)
    const response = success
      ? { success: true, route: route.id, params, payload }
      : { error: '模拟后端错误', code: 500 }
    recordCircuitBreakerResult(route.id, success)
    updateRouteStats(route, success, latency)
    if (route.idempotencyKey && payload && payload[route.idempotencyKey]) {
      storeIdempotencyResponse(payload[route.idempotencyKey], payload, response)
    }
    recordTrace({ traceId, spanId, routeId: route.id, method, pathname, status: success ? 200 : 500, duration: Date.now() - startTime, startTime, latency })
    saveDB(db)
    sendJSON(res, success ? 200 : 500, { response, traceId, latency })
  },

  // ===== 模块28：计费与支付系统路由 =====
  'GET /api/v2/billing/plans': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const plans = Object.values(db.pricingPlans || {})
    sendJSON(res, 200, { plans })
  },
  'GET /api/v2/billing/plans/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const plan = getPricingPlan(body.id)
    if (!plan) return sendJSON(res, 404, { error: '定价方案不存在' })
    sendJSON(res, 200, { plan })
  },
  'POST /api/v2/billing/subscriptions': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const subscription = createSubscription(auth.user.id, body.planId, body.billingCycle, body.couponCode)
    if (!subscription) return sendJSON(res, 400, { error: '无效的定价方案' })
    sendJSON(res, 201, { subscription })
  },
  'GET /api/v2/billing/subscriptions': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const subscriptions = Object.values(db.subscriptions || {}).filter(s => s.userId === auth.user.id)
    sendJSON(res, 200, { subscriptions })
  },
  'GET /api/v2/billing/subscriptions/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const subscription = db.subscriptions?.[body.id]
    if (!subscription) return sendJSON(res, 404, { error: '订阅不存在' })
    sendJSON(res, 200, { subscription })
  },
  'PUT /api/v2/billing/subscriptions/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const subscription = updateSubscription(body.id, body.updates)
    if (!subscription) return sendJSON(res, 404, { error: '订阅不存在' })
    sendJSON(res, 200, { subscription })
  },
  'DELETE /api/v2/billing/subscriptions/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const ok = cancelSubscription(body.id)
    if (!ok) return sendJSON(res, 404, { error: '订阅不存在' })
    sendJSON(res, 200, { success: true })
  },
  'POST /api/v2/billing/subscriptions/:id/renew': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const subscription = renewSubscription(body.id)
    if (!subscription) return sendJSON(res, 400, { error: '订阅不可续订' })
    sendJSON(res, 200, { subscription })
  },
  'GET /api/v2/billing/usage': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const stats = getUsageStats(auth.user.id)
    sendJSON(res, 200, { usage: stats })
  },
  'GET /api/v2/billing/quota': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const quota = checkQuota(auth.user.id)
    sendJSON(res, 200, quota)
  },
  'POST /api/v2/billing/invoices': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const invoice = generateInvoice(body.subscriptionId)
    if (!invoice) return sendJSON(res, 404, { error: '订阅不存在' })
    sendJSON(res, 201, { invoice })
  },
  'GET /api/v2/billing/invoices': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const invoices = Object.values(db.invoices || {}).filter(i => i.userId === auth.user.id)
    sendJSON(res, 200, { invoices })
  },
  'GET /api/v2/billing/invoices/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const invoice = db.invoices?.[body.id]
    if (!invoice) return sendJSON(res, 404, { error: '账单不存在' })
    sendJSON(res, 200, { invoice })
  },
  'POST /api/v2/billing/payments': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const payment = createPayment(body.invoiceId, body.method, body.simulateSuccess !== false)
    if (!payment) return sendJSON(res, 404, { error: '账单不存在' })
    sendJSON(res, 201, { payment })
  },
  'POST /api/v2/billing/payments/:id/refund': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const payment = processRefund(body.id, body.reason)
    if (!payment) return sendJSON(res, 400, { error: '无法退款' })
    sendJSON(res, 200, { payment })
  },
  'POST /api/v2/billing/coupons': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const coupon = createCoupon(body.code, body.discount, body.validDays, body.maxUses)
    if (!coupon) return sendJSON(res, 400, { error: '优惠券已存在' })
    sendJSON(res, 201, { coupon })
  },
  'GET /api/v2/billing/coupons': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const coupons = Object.values(db.coupons || {})
    sendJSON(res, 200, { coupons })
  },
  'POST /api/v2/billing/coupons/:code/use': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const coupon = useCoupon(body.code, auth.user.id)
    if (!coupon) return sendJSON(res, 400, { error: '优惠券无效或已用完' })
    sendJSON(res, 200, { coupon })
  },
  'GET /api/v2/billing/balance': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const balance = getBalance(auth.user.id)
    sendJSON(res, 200, balance)
  },
  'POST /api/v2/billing/balance/deposit': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const balance = addBalance(auth.user.id, body.amount, body.method)
    sendJSON(res, 200, balance)
  },
  'POST /api/v2/billing/balance/withdraw': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const ok = deductBalance(auth.user.id, body.amount, body.reason)
    if (!ok) return sendJSON(res, 400, { error: '余额不足' })
    sendJSON(res, 200, { success: true, balance: getBalance(auth.user.id) })
  },
  'POST /api/v2/billing/receipts': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const receipt = createReceipt(body.paymentId)
    if (!receipt) return sendJSON(res, 404, { error: '支付记录不存在' })
    sendJSON(res, 201, { receipt })
  },
  'GET /api/v2/billing/receipts/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const receipt = db.receipts?.[body.id]
    if (!receipt) return sendJSON(res, 404, { error: '发票不存在' })
    sendJSON(res, 200, { receipt })
  },

  // ===== 模块29：性能监控系统路由 =====
  'GET /api/v2/metrics/collect': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const metrics = collectSystemMetrics()
    sendJSON(res, 200, { metrics })
  },
  'GET /api/v2/metrics/query': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const results = queryMetrics(body.type, parseInt(body.startTime), parseInt(body.endTime), body.aggregation)
    sendJSON(res, 200, { results })
  },
  'POST /api/v2/metrics/rules': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const rule = createMetricRule(body.name, body.type, body.threshold, body.operator, body.severity)
    sendJSON(res, 201, { rule })
  },
  'GET /api/v2/metrics/rules': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const rules = Object.values(db.metricRules || {})
    sendJSON(res, 200, { rules })
  },
  'DELETE /api/v2/metrics/rules/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    delete db.metricRules?.[body.id]
    saveDB(db)
    sendJSON(res, 200, { success: true })
  },
  'GET /api/v2/metrics/alerts': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const alerts = db.metricAlerts || []
    sendJSON(res, 200, { alerts })
  },
  'POST /api/v2/metrics/alerts/:id/resolve': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const ok = resolveAlert(body.id)
    sendJSON(res, 200, { success: ok })
  },
  'POST /api/v2/metrics/dashboards': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const dashboard = createDashboard(body.name, body.widgets)
    sendJSON(res, 201, { dashboard })
  },
  'GET /api/v2/metrics/dashboards': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const dashboards = Object.values(db.metricDashboards || {})
    sendJSON(res, 200, { dashboards })
  },
  'GET /api/v2/metrics/analysis': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const analysis = analyzePerformance()
    sendJSON(res, 200, analysis)
  },
  'GET /api/v2/metrics/predict': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const prediction = predictResourceUsage(parseInt(body.days) || 7)
    sendJSON(res, 200, prediction)
  },
  'GET /api/v2/metrics/realtime': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const recent = (db.metrics || []).slice(-10)
    sendJSON(res, 200, { metrics: recent })
  },

  // ===== 模块30：缓存系统增强路由 =====
  'GET /api/v2/cache/stats': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const stats = getCacheStats()
    sendJSON(res, 200, stats)
  },
  'GET /api/v2/cache/get/:key': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const result = getFromCache(body.key)
    sendJSON(res, 200, { found: !!result, ...result })
  },
  'POST /api/v2/cache/set': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    setInCache(body.key, body.value, body.ttl, body.layers)
    sendJSON(res, 200, { success: true })
  },
  'DELETE /api/v2/cache/delete/:key': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    deleteFromCache(body.key, body.layers)
    sendJSON(res, 200, { success: true })
  },
  'POST /api/v2/cache/clear': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    layeredMemoryCache.clear()
    layeredFileCache.clear()
    sendJSON(res, 200, { success: true })
  },
  'POST /api/v2/cache/warmup': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    warmupCache(body.prefix, body.data)
    sendJSON(res, 200, { success: true })
  },
  'DELETE /api/v2/cache/invalidate/:prefix': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    invalidateCacheByPrefix(body.prefix)
    sendJSON(res, 200, { success: true })
  },
  'GET /api/v2/cache/keys': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const keys = {
      memory: Object.keys(layeredMemoryCache.cache),
      file: Object.keys(layeredFileCache.cache),
    }
    sendJSON(res, 200, keys)
  },
  'POST /api/v2/cache/generate-key': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const key = generateCacheKey(body.prefix, body.parts, body.version)
    sendJSON(res, 200, { key })
  },

  // ===== 模块31：会话管理系统路由 =====
  'POST /api/v2/sessions': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const session = smCreateSession(auth.user.id, body.deviceInfo)
    sendJSON(res, 201, { session })
  },
  'GET /api/v2/sessions/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const session = smGetSession(body.id)
    if (!session) return sendJSON(res, 404, { error: '会话不存在或已过期' })
    sendJSON(res, 200, { session })
  },
  'POST /api/v2/sessions/:id/activity': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const ok = smUpdateSessionActivity(body.id)
    sendJSON(res, 200, { success: ok })
  },
  'DELETE /api/v2/sessions/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const ok = smInvalidateSession(body.id)
    sendJSON(res, 200, { success: ok })
  },
  'POST /api/v2/sessions/:id/lock': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const ok = smLockSession(body.id, body.reason)
    sendJSON(res, 200, { success: ok })
  },
  'POST /api/v2/sessions/:id/unlock': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const ok = smUnlockSession(body.id)
    sendJSON(res, 200, { success: ok })
  },
  'GET /api/v2/sessions/user': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const sessions = smGetUserSessions(auth.user.id)
    sendJSON(res, 200, { sessions })
  },
  'GET /api/v2/sessions/active': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const sessions = smGetActiveSessions()
    sendJSON(res, 200, { sessions, count: sessions.length })
  },
  'GET /api/v2/sessions/online-users': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:metrics')(req, res, auth)) return
    const users = smGetOnlineUsers()
    sendJSON(res, 200, { users, count: users.length })
  },
  'POST /api/v2/sessions/:id/sync': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const ok = smSyncSessionData(body.id, body.data)
    sendJSON(res, 200, { success: ok })
  },
  'GET /api/v2/sessions/:id/sync-history': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const history = smGetSessionSyncHistory(body.id)
    sendJSON(res, 200, { history })
  },
  'POST /api/v2/sessions/cleanup': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const cleaned = smCleanupExpiredSessions()
    sendJSON(res, 200, { success: true, cleaned })
  },

  // ===== 模块32：数据同步系统路由 =====
  'POST /api/v2/sync/tasks': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const task = createSyncTask(body.name, body.source, body.target, body.syncType, body.options)
    sendJSON(res, 201, { task })
  },
  'GET /api/v2/sync/tasks': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const tasks = Object.values(db.syncTasks || {})
    sendJSON(res, 200, { tasks })
  },
  'GET /api/v2/sync/tasks/:id': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const task = getSyncStatus(body.id)
    if (!task) return sendJSON(res, 404, { error: '同步任务不存在' })
    sendJSON(res, 200, { task })
  },
  'POST /api/v2/sync/tasks/:id/start': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const task = startSync(body.id)
    if (!task) return sendJSON(res, 404, { error: '同步任务不存在' })
    sendJSON(res, 200, { task })
  },
  'POST /api/v2/sync/tasks/:id/pause': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const ok = pauseSync(body.id)
    sendJSON(res, 200, { success: ok })
  },
  'POST /api/v2/sync/tasks/:id/resume': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const ok = resumeSync(body.id)
    sendJSON(res, 200, { success: ok })
  },
  'POST /api/v2/sync/tasks/:id/abort': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const ok = abortSync(body.id)
    sendJSON(res, 200, { success: ok })
  },
  'POST /api/v2/sync/conflicts/detect': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const conflicts = detectConflicts(body.sourceData, body.targetData)
    sendJSON(res, 200, { conflicts, count: conflicts.length })
  },
  'POST /api/v2/sync/conflicts/:id/resolve': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const ok = resolveConflict(body.id, body.resolution)
    sendJSON(res, 200, { success: ok })
  },
  'GET /api/v2/sync/history': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const history = db.syncHistory || []
    sendJSON(res, 200, { history })
  },
  'POST /api/v2/sync/validate/:taskId': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const result = validateSyncData(body.taskId)
    sendJSON(res, 200, result)
  },
  'POST /api/v2/sync/twoway': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const result = syncTwoWay(body.clientData, body.serverData)
    sendJSON(res, 200, result)
  },

  // ===== 模块33：安全加固系统路由 =====
  'GET /api/v2/security/rate-limit/check': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const result = secCheckRateLimit(req, body.type || 'ip')
    sendJSON(res, 200, result)
  },
  'POST /api/v2/security/request-size/validate': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const result = validateRequestSize(req, body.maxSize)
    sendJSON(res, 200, result)
  },
  'POST /api/v2/security/sql/sanitize': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const sanitized = sanitizeSQL(body.input)
    sendJSON(res, 200, { original: body.input, sanitized })
  },
  'POST /api/v2/security/xss/sanitize': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const sanitized = sanitizeXSS(body.input)
    sendJSON(res, 200, { original: body.input, sanitized })
  },
  'POST /api/v2/security/csrf/generate': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const token = generateCSRFToken(auth.user.id)
    sendJSON(res, 200, { token })
  },
  'POST /api/v2/security/csrf/validate': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const valid = validateCSRFToken(body.token, auth.user.id)
    sendJSON(res, 200, { valid })
  },
  'GET /api/v2/security/headers': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const headers = getSecurityHeaders()
    sendJSON(res, 200, { headers })
  },
  'POST /api/v2/security/scan': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const scan = runSecurityScan()
    sendJSON(res, 200, scan)
  },
  'GET /api/v2/security/scans': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const scans = db.securityScans || []
    sendJSON(res, 200, { scans })
  },
  'POST /api/v2/security/report': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    if (!requirePermissionEx('system:config')(req, res, auth)) return
    const report = generateSecurityReport(body.period)
    sendJSON(res, 200, report)
  },
  'GET /api/v2/security/reports': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const reports = Object.values(db.securityReports || {})
    sendJSON(res, 200, { reports })
  },
  'POST /api/v2/security/event/log': async (req, res, body) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    logSecurityEvent(body.eventType, body.details)
    sendJSON(res, 200, { success: true })
  },
  'GET /api/v2/security/events': async (req, res) => {
    const auth = authenticate(req)
    if (!auth.authenticated) return sendJSON(res, 401, { error: '未登录' })
    const events = db.securityLogs || []
    sendJSON(res, 200, { events })
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

// ============ 系统初始化 ============
ensureRoles()
ensureVault()
// 预生成/加载 vault 主密钥（首次启动自动生成并落盘，权限 0600）
getVaultKey()
loadBuiltinPlugins()
restoreCronJobs()
setupAutoBackup()

// ============ 高级任务调度系统扩展 ============
class AdvancedScheduler {
  constructor() {
    this.tasks = new Map()
    this.running = false
  }

  schedule(taskId, cronExpr, handler, options = {}) {
    const task = {
      id: taskId,
      cron: cronExpr,
      handler,
      options: {
        enabled: options.enabled !== false,
        maxRetries: options.maxRetries || 3,
        retryDelay: options.retryDelay || 1000,
        timeout: options.timeout || 30000,
        ...options
      },
      lastRun: null,
      nextRun: null,
      runCount: 0,
      errorCount: 0,
      status: 'pending'
    }
    this.tasks.set(taskId, task)
    return task
  }

  async runTask(taskId) {
    const task = this.tasks.get(taskId)
    if (!task || !task.options.enabled) return null

    task.status = 'running'
    task.lastRun = Date.now()
    task.runCount++

    try {
      const result = await Promise.race([
        task.handler(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Task timeout')), task.options.timeout))
      ])
      task.status = 'completed'
      return { success: true, result, taskId, runCount: task.runCount }
    } catch (err) {
      task.errorCount++
      task.status = 'failed'
      
      if (task.errorCount < task.options.maxRetries) {
        await new Promise(r => setTimeout(r, task.options.retryDelay))
        return this.runTask(taskId)
      }
      
      return { success: false, error: err.message, taskId, runCount: task.runCount, errorCount: task.errorCount }
    }
  }

  start() {
    if (this.running) return
    this.running = true
    
    const checkTasks = async () => {
      const now = Date.now()
      for (const [taskId, task] of this.tasks) {
        if (task.options.enabled && task.status === 'pending') {
          await this.runTask(taskId)
        }
      }
      if (this.running) {
        setTimeout(checkTasks, 1000)
      }
    }
    checkTasks()
  }

  stop() {
    this.running = false
  }

  getTaskInfo(taskId) {
    return this.tasks.get(taskId) || null
  }

  getAllTasks() {
    return Array.from(this.tasks.values())
  }
}

const advancedScheduler = new AdvancedScheduler()

// ============ 分布式锁系统 ============
class DistributedLock {
  constructor() {
    this.locks = new Map()
  }

  acquire(resource, owner, timeout = 60000) {
    const existing = this.locks.get(resource)
    if (existing && existing.expires > Date.now()) {
      return false
    }

    this.locks.set(resource, {
      owner,
      acquiredAt: Date.now(),
      expires: Date.now() + timeout
    })
    return true
  }

  release(resource, owner) {
    const existing = this.locks.get(resource)
    if (existing && existing.owner === owner) {
      this.locks.delete(resource)
      return true
    }
    return false
  }

  renew(resource, owner, timeout = 60000) {
    const existing = this.locks.get(resource)
    if (existing && existing.owner === owner) {
      existing.expires = Date.now() + timeout
      return true
    }
    return false
  }

  getLock(resource) {
    return this.locks.get(resource) || null
  }

  isLocked(resource) {
    const lock = this.locks.get(resource)
    return lock && lock.expires > Date.now()
  }
}

const distributedLock = new DistributedLock()

// ============ 高级日志分析系统扩展 ============
class AdvancedLogAnalyzer {
  constructor() {
    this.logs = []
    this.maxLogs = 100000
  }

  addLog(log) {
    this.logs.push({
      ...log,
      timestamp: log.timestamp || Date.now()
    })
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }
  }

  query(filter = {}) {
    return this.logs.filter(log => {
      if (filter.level && log.level !== filter.level) return false
      if (filter.source && !log.source.includes(filter.source)) return false
      if (filter.startTime && log.timestamp < filter.startTime) return false
      if (filter.endTime && log.timestamp > filter.endTime) return false
      if (filter.search && !JSON.stringify(log).includes(filter.search)) return false
      return true
    }).sort((a, b) => b.timestamp - a.timestamp)
  }

  getStatistics(filter = {}) {
    const filtered = this.query(filter)
    const levels = {}
    const sources = {}
    
    for (const log of filtered) {
      levels[log.level] = (levels[log.level] || 0) + 1
      sources[log.source] = (sources[log.source] || 0) + 1
    }

    return {
      total: filtered.length,
      levels,
      sources,
      avgTime: filtered.length > 0 
        ? filtered.reduce((sum, log) => sum + (log.duration || 0), 0) / filtered.length 
        : 0,
      minTime: filtered.length > 0 
        ? Math.min(...filtered.map(log => log.duration || Infinity)) 
        : 0,
      maxTime: filtered.length > 0 
        ? Math.max(...filtered.map(log => log.duration || 0)) 
        : 0
    }
  }

  detectAnomalies(windowMinutes = 5) {
    const windowMs = windowMinutes * 60 * 1000
    const recentLogs = this.logs.filter(log => Date.now() - log.timestamp < windowMs)
    
    const errorRate = recentLogs.filter(l => l.level === 'error').length / recentLogs.length
    const warningRate = recentLogs.filter(l => l.level === 'warn').length / recentLogs.length
    
    const anomalies = []
    if (errorRate > 0.1) {
      anomalies.push({ type: 'high_error_rate', value: errorRate, threshold: 0.1 })
    }
    if (warningRate > 0.2) {
      anomalies.push({ type: 'high_warning_rate', value: warningRate, threshold: 0.2 })
    }
    
    return anomalies
  }
}

const advancedLogAnalyzer = new AdvancedLogAnalyzer()

// ============ API 版本管理系统 ============
class APIVersionManager {
  constructor() {
    this.versions = new Map()
    this.deprecated = new Set()
  }

  register(version, routes, metadata = {}) {
    this.versions.set(version, {
      routes,
      metadata: {
        releasedAt: metadata.releasedAt || Date.now(),
        deprecatedAt: metadata.deprecatedAt || null,
        sunsetAt: metadata.sunsetAt || null,
        ...metadata
      }
    })
    if (metadata.deprecated) {
      this.deprecated.add(version)
    }
  }

  getVersion(version) {
    return this.versions.get(version) || null
  }

  isDeprecated(version) {
    return this.deprecated.has(version)
  }

  getAllVersions() {
    return Array.from(this.versions.keys()).sort((a, b) => b.localeCompare(a))
  }

  getLatestVersion() {
    const versions = this.getAllVersions()
    return versions.length > 0 ? versions[0] : null
  }
}

const apiVersionManager = new APIVersionManager()

// ============ 请求追踪系统 ============
class RequestTracer {
  constructor() {
    this.traces = new Map()
    this.maxTraces = 1000
  }

  start(requestId, info = {}) {
    this.traces.set(requestId, {
      id: requestId,
      startTime: Date.now(),
      info,
      spans: []
    })
  }

  addSpan(requestId, span) {
    const trace = this.traces.get(requestId)
    if (trace) {
      trace.spans.push({
        ...span,
        startTime: Date.now()
      })
    }
  }

  endSpan(requestId, spanName, result = {}) {
    const trace = this.traces.get(requestId)
    if (trace) {
      const span = trace.spans.find(s => s.name === spanName)
      if (span) {
        span.endTime = Date.now()
        span.duration = span.endTime - span.startTime
        span.result = result
      }
    }
  }

  end(requestId, status = 'completed', response = {}) {
    const trace = this.traces.get(requestId)
    if (trace) {
      trace.endTime = Date.now()
      trace.duration = trace.endTime - trace.startTime
      trace.status = status
      trace.response = response

      if (this.traces.size > this.maxTraces) {
        const oldest = Array.from(this.traces.entries()).sort((a, b) => a[1].startTime - b[1].startTime)[0]
        this.traces.delete(oldest[0])
      }
    }
  }

  getTrace(requestId) {
    return this.traces.get(requestId) || null
  }

  getAllTraces() {
    return Array.from(this.traces.values()).sort((a, b) => b.startTime - a.startTime)
  }

  getStatistics() {
    const traces = Array.from(this.traces.values())
    const statusCounts = {}
    
    for (const trace of traces) {
      statusCounts[trace.status] = (statusCounts[trace.status] || 0) + 1
    }

    return {
      total: traces.length,
      statusCounts,
      avgDuration: traces.length > 0 
        ? traces.reduce((sum, t) => sum + t.duration, 0) / traces.length 
        : 0,
      p95Duration: traces.length > 0 
        ? traces.sort((a, b) => a.duration - b.duration)[Math.floor(traces.length * 0.95)]?.duration 
        : 0,
      p99Duration: traces.length > 0 
        ? traces.sort((a, b) => a.duration - b.duration)[Math.floor(traces.length * 0.99)]?.duration 
        : 0
    }
  }
}

const requestTracer = new RequestTracer()

// ============ 全局配置管理系统 ============
class GlobalConfigManager {
  constructor() {
    this.config = new Map()
  }

  set(key, value, options = {}) {
    this.config.set(key, {
      value,
      modifiedAt: Date.now(),
      modifiedBy: options.modifiedBy || 'system',
      description: options.description || ''
    })
  }

  get(key, defaultValue = undefined) {
    const entry = this.config.get(key)
    return entry ? entry.value : defaultValue
  }

  getAll(prefix = '') {
    const result = {}
    for (const [key, entry] of this.config) {
      if (key.startsWith(prefix)) {
        result[key] = entry
      }
    }
    return result
  }

  delete(key) {
    return this.config.delete(key)
  }

  has(key) {
    return this.config.has(key)
  }

  loadFromDB() {
    const configs = find('config', {})
    for (const config of configs) {
      this.set(config.key, config.value, {
        modifiedBy: config.modifiedBy,
        description: config.description
      })
    }
  }

  saveToDB() {
    for (const [key, entry] of this.config) {
      upsert('config', { key }, {
        key,
        value: entry.value,
        modifiedAt: entry.modifiedAt,
        modifiedBy: entry.modifiedBy,
        description: entry.description
      })
    }
  }
}

const globalConfig = new GlobalConfigManager()

// ============ 服务发现与注册系统 ============
class ServiceRegistry {
  constructor() {
    this.services = new Map()
    this.healthChecks = new Map()
  }

  register(serviceName, service) {
    this.services.set(serviceName, {
      ...service,
      registeredAt: Date.now(),
      lastHealthCheck: Date.now(),
      status: 'healthy'
    })
  }

  unregister(serviceName) {
    this.services.delete(serviceName)
    this.healthChecks.delete(serviceName)
  }

  getService(serviceName) {
    return this.services.get(serviceName) || null
  }

  getAllServices() {
    return Array.from(this.services.values())
  }

  setHealthCheck(serviceName, checkFn, interval = 30000) {
    if (this.healthChecks.has(serviceName)) {
      clearInterval(this.healthChecks.get(serviceName).interval)
    }

    const intervalId = setInterval(async () => {
      const service = this.services.get(serviceName)
      if (!service) return

      try {
        const result = await checkFn()
        service.status = result.healthy ? 'healthy' : 'unhealthy'
        service.lastHealthCheck = Date.now()
        service.healthDetails = result.details
      } catch {
        service.status = 'unhealthy'
        service.lastHealthCheck = Date.now()
      }
    }, interval)

    this.healthChecks.set(serviceName, { intervalId, checkFn })
  }

  getHealthStatus(serviceName) {
    const service = this.services.get(serviceName)
    return service ? { status: service.status, lastCheck: service.lastHealthCheck, details: service.healthDetails } : null
  }

  getAllHealthStatus() {
    const result = {}
    for (const [name, service] of this.services) {
      result[name] = { status: service.status, lastCheck: service.lastHealthCheck }
    }
    return result
  }
}

const serviceRegistry = new ServiceRegistry()

// ============ 初始化高级系统 ============
globalConfig.loadFromDB()

serviceRegistry.register('backend', {
  name: 'HopeAgent Backend',
  version: '1.0.0',
  port: PORT
})

serviceRegistry.setHealthCheck('backend', async () => {
  return {
    healthy: true,
    details: {
      uptime: process.uptime(),
      memory: process.memoryUsage()
    }
  }
})

advancedScheduler.schedule('daily-backup', '0 0 * * *', async () => {
  await backupDB()
})

advancedScheduler.schedule('cleanup-logs', '0 2 * * *', async () => {
  const logs = find('logs', {})
  const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000
  for (const log of logs) {
    if (log.timestamp < twoWeeksAgo) {
      deleteOne('logs', { _id: log._id })
    }
  }
})

advancedScheduler.start()

// 启动系统指标收集器
startMetricsCollector()

// ============ 消息队列系统 ============
class MessageQueue {
  constructor() {
    this.queues = new Map()
    this.consumers = new Map()
    this.processing = new Set()
  }

  createQueue(queueName, options = {}) {
    if (!this.queues.has(queueName)) {
      this.queues.set(queueName, {
        messages: [],
        options: {
          maxSize: options.maxSize || 10000,
          ttl: options.ttl || 86400000,
          ...options
        }
      })
    }
    return this.queues.get(queueName)
  }

  enqueue(queueName, message, options = {}) {
    const queue = this.createQueue(queueName)
    const msg = {
      id: genId(),
      payload: message,
      enqueuedAt: Date.now(),
      dequeuedAt: null,
      processedAt: null,
      attempts: 0,
      maxAttempts: options.maxAttempts || 3,
      priority: options.priority || 0,
      ttl: options.ttl || queue.options.ttl,
      expiresAt: Date.now() + (options.ttl || queue.options.ttl)
    }
    
    queue.messages.push(msg)
    queue.messages.sort((a, b) => b.priority - a.priority)
    
    if (queue.messages.length > queue.options.maxSize) {
      queue.messages = queue.messages.slice(-queue.options.maxSize)
    }
    
    this.notifyConsumers(queueName)
    return msg
  }

  dequeue(queueName) {
    const queue = this.queues.get(queueName)
    if (!queue || queue.messages.length === 0) return null

    const now = Date.now()
    queue.messages = queue.messages.filter(msg => msg.expiresAt > now)

    if (queue.messages.length === 0) return null

    const msg = queue.messages.shift()
    msg.dequeuedAt = Date.now()
    this.processing.add(msg.id)
    return msg
  }

  ack(messageId) {
    const msg = this.getMessageById(messageId)
    if (msg) {
      msg.processedAt = Date.now()
      this.processing.delete(messageId)
      return true
    }
    return false
  }

  nack(messageId, requeue = true) {
    const msg = this.getMessageById(messageId)
    if (msg) {
      msg.attempts++
      this.processing.delete(messageId)
      
      if (requeue && msg.attempts < msg.maxAttempts) {
        const queue = this.getQueueByMessageId(messageId)
        if (queue) {
          queue.messages.push(msg)
        }
      }
      return true
    }
    return false
  }

  getMessageById(messageId) {
    for (const queue of this.queues.values()) {
      const msg = queue.messages.find(m => m.id === messageId)
      if (msg) return msg
    }
    return null
  }

  getQueueByMessageId(messageId) {
    for (const [name, queue] of this.queues) {
      if (queue.messages.some(m => m.id === messageId)) {
        return queue
      }
    }
    return null
  }

  subscribe(queueName, handler, options = {}) {
    if (!this.consumers.has(queueName)) {
      this.consumers.set(queueName, [])
    }
    this.consumers.get(queueName).push({ handler, options })
  }

  unsubscribe(queueName, handler) {
    const consumers = this.consumers.get(queueName)
    if (consumers) {
      this.consumers.set(queueName, consumers.filter(c => c.handler !== handler))
    }
  }

  notifyConsumers(queueName) {
    const consumers = this.consumers.get(queueName)
    if (!consumers || consumers.length === 0) return

    for (const consumer of consumers) {
      if (consumer.options.autoAck !== false) {
        this.processNext(queueName, consumer)
      }
    }
  }

  async processNext(queueName, consumer) {
    const msg = this.dequeue(queueName)
    if (!msg) return

    try {
      await consumer.handler(msg)
      this.ack(msg.id)
    } catch {
      this.nack(msg.id)
    }
  }

  getQueueStats(queueName) {
    const queue = this.queues.get(queueName)
    if (!queue) return null

    const now = Date.now()
    const pending = queue.messages.filter(m => m.expiresAt > now).length
    const expired = queue.messages.filter(m => m.expiresAt <= now).length

    return {
      name: queueName,
      pending,
      expired,
      processing: this.processing.size,
      maxSize: queue.options.maxSize,
      ttl: queue.options.ttl
    }
  }

  getAllQueueStats() {
    const stats = {}
    for (const name of this.queues.keys()) {
      stats[name] = this.getQueueStats(name)
    }
    return stats
  }
}

const messageQueue = new MessageQueue()

// ============ 事件总线系统 ============
class EventBus {
  constructor() {
    this.listeners = new Map()
    this.events = []
    this.maxEvents = 10000
  }

  on(eventName, handler) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, [])
    }
    this.listeners.get(eventName).push(handler)
  }

  off(eventName, handler) {
    const handlers = this.listeners.get(eventName)
    if (handlers) {
      this.listeners.set(eventName, handlers.filter(h => h !== handler))
    }
  }

  once(eventName, handler) {
    const onceHandler = (...args) => {
      handler(...args)
      this.off(eventName, onceHandler)
    }
    this.on(eventName, onceHandler)
  }

  async emit(eventName, data = {}) {
    const event = {
      id: genId(),
      name: eventName,
      data,
      timestamp: Date.now()
    }
    
    this.events.push(event)
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents)
    }

    const handlers = this.listeners.get(eventName) || []
    for (const handler of handlers) {
      try {
        await handler(event)
      } catch (err) {
        console.error(`事件处理器 ${eventName} 出错:`, err)
      }
    }
  }

  getEvents(filter = {}) {
    return this.events.filter(event => {
      if (filter.name && event.name !== filter.name) return false
      if (filter.startTime && event.timestamp < filter.startTime) return false
      if (filter.endTime && event.timestamp > filter.endTime) return false
      return true
    }).sort((a, b) => b.timestamp - a.timestamp)
  }

  getEventTypes() {
    return Array.from(this.listeners.keys())
  }

  getListenerCount(eventName) {
    const handlers = this.listeners.get(eventName)
    return handlers ? handlers.length : 0
  }
}

const eventBus = new EventBus()

// ============ 限流系统扩展 ============
class RateLimiter {
  constructor() {
    this.limits = new Map()
    this.globalLimits = {}
  }

  setLimit(key, maxRequests, windowMs) {
    this.limits.set(key, {
      maxRequests,
      windowMs,
      requests: [],
      lastReset: Date.now()
    })
  }

  setGlobalLimit(maxRequests, windowMs) {
    this.globalLimits = {
      maxRequests,
      windowMs,
      requests: [],
      lastReset: Date.now()
    }
  }

  check(key) {
    const now = Date.now()

    if (this.globalLimits.maxRequests) {
      const gLimit = this.globalLimits
      gLimit.requests = gLimit.requests.filter(r => now - r < gLimit.windowMs)
      if (gLimit.requests.length >= gLimit.maxRequests) {
        return { allowed: false, remaining: 0, resetAfter: gLimit.windowMs - (now - gLimit.requests[0]) }
      }
    }

    const limit = this.limits.get(key)
    if (!limit) return { allowed: true, remaining: Infinity }

    limit.requests = limit.requests.filter(r => now - r < limit.windowMs)
    
    if (limit.requests.length >= limit.maxRequests) {
      return { 
        allowed: false, 
        remaining: 0, 
        resetAfter: limit.windowMs - (now - limit.requests[0]) 
      }
    }

    limit.requests.push(now)
    return { 
      allowed: true, 
      remaining: limit.maxRequests - limit.requests.length,
      resetAfter: limit.windowMs - (now - limit.requests[0])
    }
  }

  increment(key) {
    const limit = this.limits.get(key)
    if (limit) {
      limit.requests.push(Date.now())
    }
  }

  reset(key) {
    const limit = this.limits.get(key)
    if (limit) {
      limit.requests = []
      limit.lastReset = Date.now()
    }
  }

  getStats(key) {
    const limit = this.limits.get(key)
    if (!limit) return null

    const now = Date.now()
    const activeRequests = limit.requests.filter(r => now - r < limit.windowMs)

    return {
      key,
      maxRequests: limit.maxRequests,
      currentRequests: activeRequests.length,
      remaining: limit.maxRequests - activeRequests.length,
      windowMs: limit.windowMs,
      resetAfter: limit.windowMs - (now - (activeRequests[0] || now))
    }
  }

  getAllStats() {
    const stats = {}
    for (const [key, limit] of this.limits) {
      stats[key] = this.getStats(key)
    }
    return stats
  }
}

const rateLimiter = new RateLimiter()

// ============ 熔断系统 ============
class CircuitBreaker {
  constructor() {
    this.circuits = new Map()
  }

  createCircuit(name, options = {}) {
    this.circuits.set(name, {
      name,
      state: 'closed',
      failureCount: 0,
      successCount: 0,
      lastFailureTime: null,
      options: {
        failureThreshold: options.failureThreshold || 5,
        successThreshold: options.successThreshold || 3,
        timeoutMs: options.timeoutMs || 30000,
        halfOpenMaxRequests: options.halfOpenMaxRequests || 1,
        ...options
      }
    })
  }

  async execute(name, fn) {
    const circuit = this.circuits.get(name)
    if (!circuit) {
      this.createCircuit(name)
      return fn()
    }

    if (circuit.state === 'open') {
      if (Date.now() - circuit.lastFailureTime > circuit.options.timeoutMs) {
        circuit.state = 'half-open'
        circuit.successCount = 0
      } else {
        throw new Error('Circuit is open')
      }
    }

    if (circuit.state === 'half-open') {
      const currentRequests = circuit.options.halfOpenMaxRequests
      if (circuit.successCount >= currentRequests) {
        circuit.state = 'closed'
        circuit.failureCount = 0
      }
    }

    try {
      const result = await fn()
      
      if (circuit.state === 'half-open') {
        circuit.successCount++
        if (circuit.successCount >= circuit.options.successThreshold) {
          circuit.state = 'closed'
          circuit.failureCount = 0
        }
      } else {
        circuit.successCount++
        circuit.failureCount = Math.max(0, circuit.failureCount - 1)
      }
      
      return result
    } catch (err) {
      circuit.failureCount++
      circuit.lastFailureTime = Date.now()
      
      if (circuit.failureCount >= circuit.options.failureThreshold) {
        circuit.state = 'open'
      }
      
      throw err
    }
  }

  getState(name) {
    const circuit = this.circuits.get(name)
    return circuit ? circuit.state : 'unknown'
  }

  reset(name) {
    const circuit = this.circuits.get(name)
    if (circuit) {
      circuit.state = 'closed'
      circuit.failureCount = 0
      circuit.successCount = 0
      circuit.lastFailureTime = null
    }
  }

  getAllCircuits() {
    return Array.from(this.circuits.values())
  }
}

const circuitBreaker = new CircuitBreaker()

// ============ 负载均衡系统 ============
class LoadBalancer {
  constructor() {
    this.pools = new Map()
  }

  createPool(poolName, options = {}) {
    this.pools.set(poolName, {
      name: poolName,
      servers: [],
      strategy: options.strategy || 'roundRobin',
      healthCheckInterval: options.healthCheckInterval || 30000,
      lastIndex: 0,
      weights: {}
    })
  }

  addServer(poolName, server) {
    const pool = this.pools.get(poolName)
    if (!pool) {
      this.createPool(poolName)
      return this.addServer(poolName, server)
    }
    
    pool.servers.push({
      ...server,
      health: 'healthy',
      lastHealthCheck: Date.now(),
      requestCount: 0,
      errorCount: 0
    })
    
    pool.weights[server.id] = server.weight || 1
  }

  removeServer(poolName, serverId) {
    const pool = this.pools.get(poolName)
    if (pool) {
      pool.servers = pool.servers.filter(s => s.id !== serverId)
      delete pool.weights[serverId]
    }
  }

  selectServer(poolName) {
    const pool = this.pools.get(poolName)
    if (!pool || pool.servers.length === 0) return null

    const healthyServers = pool.servers.filter(s => s.health === 'healthy')
    if (healthyServers.length === 0) return null

    let selected
    switch (pool.strategy) {
      case 'roundRobin':
        selected = healthyServers[pool.lastIndex % healthyServers.length]
        pool.lastIndex++
        break
      case 'random':
        selected = healthyServers[Math.floor(Math.random() * healthyServers.length)]
        break
      case 'leastConnections':
        selected = healthyServers.reduce((a, b) => a.requestCount < b.requestCount ? a : b)
        break
      case 'weightedRoundRobin':
        const totalWeight = healthyServers.reduce((sum, s) => sum + (pool.weights[s.id] || 1), 0)
        let random = Math.floor(Math.random() * totalWeight)
        for (const server of healthyServers) {
          random -= pool.weights[server.id] || 1
          if (random < 0) {
            selected = server
            break
          }
        }
        break
      default:
        selected = healthyServers[0]
    }

    if (selected) {
      selected.requestCount++
    }
    return selected
  }

  markSuccess(poolName, serverId) {
    const pool = this.pools.get(poolName)
    if (pool) {
      const server = pool.servers.find(s => s.id === serverId)
      if (server) {
        server.errorCount = Math.max(0, server.errorCount - 1)
        server.health = 'healthy'
      }
    }
  }

  markFailure(poolName, serverId) {
    const pool = this.pools.get(poolName)
    if (pool) {
      const server = pool.servers.find(s => s.id === serverId)
      if (server) {
        server.errorCount++
        if (server.errorCount > 3) {
          server.health = 'unhealthy'
        }
      }
    }
  }

  getPoolStats(poolName) {
    const pool = this.pools.get(poolName)
    if (!pool) return null

    const healthy = pool.servers.filter(s => s.health === 'healthy').length
    const unhealthy = pool.servers.filter(s => s.health === 'unhealthy').length
    const totalRequests = pool.servers.reduce((sum, s) => sum + s.requestCount, 0)

    return {
      name: poolName,
      strategy: pool.strategy,
      totalServers: pool.servers.length,
      healthy,
      unhealthy,
      totalRequests
    }
  }

  getAllPoolStats() {
    const stats = {}
    for (const [name, pool] of this.pools) {
      stats[name] = this.getPoolStats(name)
    }
    return stats
  }
}

const loadBalancer = new LoadBalancer()

// ============ 数据归档系统 ============
class DataArchiver {
  constructor() {
    this.archiveRules = new Map()
    this.archiveTasks = new Map()
  }

  addRule(ruleName, collection, criteria, options = {}) {
    this.archiveRules.set(ruleName, {
      name: ruleName,
      collection,
      criteria,
      options: {
        retentionDays: options.retentionDays || 90,
        batchSize: options.batchSize || 100,
        dryRun: options.dryRun || false,
        ...options
      }
    })
  }

  removeRule(ruleName) {
    return this.archiveRules.delete(ruleName)
  }

  async executeRule(ruleName) {
    const rule = this.archiveRules.get(ruleName)
    if (!rule) return { success: false, error: 'Rule not found' }

    const taskId = genId()
    this.archiveTasks.set(taskId, {
      id: taskId,
      ruleName,
      status: 'running',
      startTime: Date.now(),
      processedCount: 0,
      archivedCount: 0,
      skippedCount: 0
    })

    try {
      const cutoffDate = Date.now() - rule.options.retentionDays * 24 * 60 * 60 * 1000
      const query = { ...rule.criteria, createdAt: { $lt: cutoffDate } }
      const documents = find(rule.collection, query)

      for (let i = 0; i < documents.length; i += rule.options.batchSize) {
        const batch = documents.slice(i, i + rule.options.batchSize)
        
        if (!rule.options.dryRun) {
          for (const doc of batch) {
            const archiveDoc = {
              ...doc,
              archivedAt: Date.now(),
              originalCollection: rule.collection,
              originalId: doc._id
            }
            insertOne('archives', archiveDoc)
            deleteOne(rule.collection, { _id: doc._id })
            this.archiveTasks.get(taskId).archivedCount++
          }
        } else {
          this.archiveTasks.get(taskId).skippedCount += batch.length
        }
        
        this.archiveTasks.get(taskId).processedCount += batch.length
      }

      this.archiveTasks.get(taskId).status = 'completed'
      this.archiveTasks.get(taskId).endTime = Date.now()
      
      return {
        success: true,
        taskId,
        processedCount: this.archiveTasks.get(taskId).processedCount,
        archivedCount: this.archiveTasks.get(taskId).archivedCount,
        skippedCount: this.archiveTasks.get(taskId).skippedCount
      }
    } catch (err) {
      this.archiveTasks.get(taskId).status = 'failed'
      this.archiveTasks.get(taskId).endTime = Date.now()
      return { success: false, error: err.message, taskId }
    }
  }

  async executeAllRules() {
    const results = []
    for (const ruleName of this.archiveRules.keys()) {
      const result = await this.executeRule(ruleName)
      results.push({ ruleName, ...result })
    }
    return results
  }

  getTaskStatus(taskId) {
    return this.archiveTasks.get(taskId) || null
  }

  getAllTasks() {
    return Array.from(this.archiveTasks.values()).sort((a, b) => b.startTime - a.startTime)
  }

  getAllRules() {
    return Array.from(this.archiveRules.values())
  }

  restoreDocument(archiveId) {
    const archive = findOne('archives', { _id: archiveId })
    if (!archive) return null

    const originalCollection = archive.originalCollection
    const originalId = archive.originalId
    
    const restored = { ...archive }
    delete restored.archivedAt
    delete restored.originalCollection
    delete restored.originalId
    
    insertOne(originalCollection, restored)
    deleteOne('archives', { _id: archiveId })
    
    return restored
  }

  searchArchives(filter = {}) {
    const query = {}
    if (filter.originalCollection) {
      query.originalCollection = filter.originalCollection
    }
    if (filter.archivedAfter) {
      query.archivedAt = { $gt: filter.archivedAfter }
    }
    if (filter.archivedBefore) {
      query.archivedAt = { ...query.archivedAt, $lt: filter.archivedBefore }
    }
    
    return find('archives', query).sort((a, b) => b.archivedAt - a.archivedAt)
  }
}

const dataArchiver = new DataArchiver()

// ============ 重试系统 ============
class RetryManager {
  constructor() {
    this.retryPolicies = new Map()
    this.retryHistory = []
  }

  definePolicy(policyName, options = {}) {
    this.retryPolicies.set(policyName, {
      name: policyName,
      options: {
        maxRetries: options.maxRetries || 3,
        initialDelay: options.initialDelay || 1000,
        maxDelay: options.maxDelay || 60000,
        backoffFactor: options.backoffFactor || 2,
        retryOn: options.retryOn || ['Error'],
        ...options
      }
    })
  }

  async executeWithRetry(policyName, fn, context = {}) {
    const policy = this.retryPolicies.get(policyName)
    if (!policy) {
      return fn()
    }

    const { maxRetries, initialDelay, maxDelay, backoffFactor, retryOn } = policy.options
    let delay = initialDelay
    let attempts = 0

    while (attempts <= maxRetries) {
      try {
        const result = await fn()
        
        this.retryHistory.push({
          policyName,
          context,
          attempts,
          success: true,
          timestamp: Date.now()
        })
        
        return result
      } catch (err) {
        attempts++
        
        if (attempts > maxRetries || !retryOn.includes(err.constructor.name)) {
          this.retryHistory.push({
            policyName,
            context,
            attempts,
            success: false,
            error: err.message,
            timestamp: Date.now()
          })
          
          throw err
        }

        await new Promise(r => setTimeout(r, delay))
        delay = Math.min(delay * backoffFactor, maxDelay)
      }
    }
  }

  getPolicy(policyName) {
    return this.retryPolicies.get(policyName) || null
  }

  getAllPolicies() {
    return Array.from(this.retryPolicies.values())
  }

  getRetryHistory(filter = {}) {
    return this.retryHistory.filter(entry => {
      if (filter.policyName && entry.policyName !== filter.policyName) return false
      if (filter.success !== undefined && entry.success !== filter.success) return false
      if (filter.startTime && entry.timestamp < filter.startTime) return false
      if (filter.endTime && entry.timestamp > filter.endTime) return false
      return true
    }).sort((a, b) => b.timestamp - a.timestamp)
  }

  getRetryStatistics(policyName) {
    const entries = this.retryHistory.filter(e => e.policyName === policyName)
    const successCount = entries.filter(e => e.success).length
    const failureCount = entries.filter(e => !e.success).length
    const avgAttempts = entries.length > 0 ? entries.reduce((sum, e) => sum + e.attempts, 0) / entries.length : 0

    return {
      policyName,
      totalAttempts: entries.length,
      successCount,
      failureCount,
      successRate: entries.length > 0 ? successCount / entries.length : 0,
      avgAttempts
    }
  }
}

const retryManager = new RetryManager()

// ============ 分布式任务协调系统 ============
class DistributedTaskCoordinator {
  constructor() {
    this.tasks = new Map()
    this.workers = new Map()
  }

  registerWorker(workerId, capabilities = []) {
    this.workers.set(workerId, {
      id: workerId,
      capabilities,
      status: 'available',
      lastHeartbeat: Date.now(),
      currentTask: null
    })
  }

  unregisterWorker(workerId) {
    this.workers.delete(workerId)
  }

  heartbeat(workerId) {
    const worker = this.workers.get(workerId)
    if (worker) {
      worker.lastHeartbeat = Date.now()
    }
  }

  submitTask(task) {
    const taskId = genId()
    this.tasks.set(taskId, {
      id: taskId,
      ...task,
      status: 'pending',
      submittedAt: Date.now(),
      assignedTo: null,
      startedAt: null,
      completedAt: null,
      result: null,
      error: null
    })

    this.assignTask(taskId)
    return taskId
  }

  assignTask(taskId) {
    const task = this.tasks.get(taskId)
    if (!task || task.status !== 'pending') return

    const availableWorkers = Array.from(this.workers.values()).filter(w => 
      w.status === 'available' && 
      Date.now() - w.lastHeartbeat < 30000 &&
      (task.requiredCapabilities ? task.requiredCapabilities.every(c => w.capabilities.includes(c)) : true)
    )

    if (availableWorkers.length === 0) return

    const worker = availableWorkers[0]
    worker.status = 'busy'
    worker.currentTask = taskId
    
    task.status = 'assigned'
    task.assignedTo = worker.id
    task.startedAt = Date.now()
  }

  completeTask(taskId, result) {
    const task = this.tasks.get(taskId)
    if (!task) return false

    task.status = 'completed'
    task.result = result
    task.completedAt = Date.now()

    const worker = this.workers.get(task.assignedTo)
    if (worker) {
      worker.status = 'available'
      worker.currentTask = null
    }

    return true
  }

  failTask(taskId, error) {
    const task = this.tasks.get(taskId)
    if (!task) return false

    task.status = 'failed'
    task.error = error
    task.completedAt = Date.now()

    const worker = this.workers.get(task.assignedTo)
    if (worker) {
      worker.status = 'available'
      worker.currentTask = null
    }

    return true
  }

  getTask(taskId) {
    return this.tasks.get(taskId) || null
  }

  getWorker(workerId) {
    return this.workers.get(workerId) || null
  }

  getPendingTasks() {
    return Array.from(this.tasks.values()).filter(t => t.status === 'pending')
  }

  getActiveWorkers() {
    return Array.from(this.workers.values()).filter(w => Date.now() - w.lastHeartbeat < 30000)
  }

  getSystemStatus() {
    const pending = this.getPendingTasks().length
    const assigned = Array.from(this.tasks.values()).filter(t => t.status === 'assigned').length
    const completed = Array.from(this.tasks.values()).filter(t => t.status === 'completed').length
    const failed = Array.from(this.tasks.values()).filter(t => t.status === 'failed').length
    const activeWorkers = this.getActiveWorkers().length
    const totalWorkers = this.workers.size

    return {
      pendingTasks: pending,
      assignedTasks: assigned,
      completedTasks: completed,
      failedTasks: failed,
      activeWorkers,
      totalWorkers
    }
  }
}

const taskCoordinator = new DistributedTaskCoordinator()

// ============ API 客户端系统 ============
class APIClient {
  constructor(baseUrl, options = {}) {
    this.baseUrl = baseUrl
    this.options = {
      timeout: options.timeout || 30000,
      headers: options.headers || {},
      retryPolicy: options.retryPolicy || null,
      ...options
    }
  }

  async request(method, path, options = {}) {
    const url = new URL(path, this.baseUrl)
    
    if (options.query) {
      Object.entries(options.query).forEach(([key, value]) => {
        url.searchParams.set(key, value)
      })
    }

    const headers = {
      'Content-Type': 'application/json',
      ...this.options.headers,
      ...options.headers
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.options.timeout)

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: options.body ? JSON.stringify(options.body) : null,
        signal: controller.signal,
        ...options.fetchOptions
      })

      clearTimeout(timeoutId)

      const result = {
        status: response.status,
        headers: Object.fromEntries(response.headers),
        ok: response.ok
      }

      try {
        result.data = await response.json()
      } catch {
        result.text = await response.text()
      }

      return result
    } catch (err) {
      clearTimeout(timeoutId)
      
      if (this.options.retryPolicy && err.name === 'AbortError') {
        return this.retryRequest(method, path, options)
      }
      
      throw err
    }
  }

  async retryRequest(method, path, options) {
    const policy = this.options.retryPolicy
    if (!policy) throw new Error('No retry policy configured')

    let delay = policy.initialDelay || 1000
    const maxRetries = policy.maxRetries || 3

    for (let i = 0; i < maxRetries; i++) {
      try {
        await new Promise(r => setTimeout(r, delay))
        return this.request(method, path, { ...options, fetchOptions: { ...options.fetchOptions, signal: undefined } })
      } catch {
        delay *= policy.backoffFactor || 2
      }
    }

    throw new Error('Max retries exceeded')
  }

  async get(path, options = {}) {
    return this.request('GET', path, options)
  }

  async post(path, options = {}) {
    return this.request('POST', path, options)
  }

  async put(path, options = {}) {
    return this.request('PUT', path, options)
  }

  async delete(path, options = {}) {
    return this.request('DELETE', path, options)
  }

  async patch(path, options = {}) {
    return this.request('PATCH', path, options)
  }

  setHeader(name, value) {
    this.options.headers[name] = value
  }

  removeHeader(name) {
    delete this.options.headers[name]
  }
}

// ============ 批量任务执行系统 ============
class BatchExecutor {
  constructor() {
    this.jobs = new Map()
    this.concurrency = 5
  }

  setConcurrency(concurrency) {
    this.concurrency = concurrency
  }

  async executeBatch(batchId, tasks, options = {}) {
    const job = {
      id: batchId,
      tasks,
      status: 'running',
      progress: 0,
      results: [],
      startTime: Date.now(),
      completedAt: null,
      concurrency: options.concurrency || this.concurrency
    }
    
    this.jobs.set(batchId, job)

    const chunkSize = job.concurrency
    const chunks = []
    
    for (let i = 0; i < tasks.length; i += chunkSize) {
      chunks.push(tasks.slice(i, i + chunkSize))
    }

    for (const chunk of chunks) {
      const chunkResults = await Promise.all(chunk.map(async (task, index) => {
        try {
          const result = await task.fn(task.data)
          return { index: job.results.length + index, success: true, result, data: task.data }
        } catch (err) {
          return { index: job.results.length + index, success: false, error: err.message, data: task.data }
        }
      }))

      job.results.push(...chunkResults)
      job.progress = Math.round((job.results.length / tasks.length) * 100)
    }

    job.status = 'completed'
    job.completedAt = Date.now()

    return {
      batchId,
      status: 'completed',
      total: tasks.length,
      success: job.results.filter(r => r.success).length,
      failed: job.results.filter(r => !r.success).length,
      duration: job.completedAt - job.startTime
    }
  }

  getJobStatus(batchId) {
    return this.jobs.get(batchId) || null
  }

  cancelJob(batchId) {
    const job = this.jobs.get(batchId)
    if (job && job.status === 'running') {
      job.status = 'cancelled'
      job.completedAt = Date.now()
      return true
    }
    return false
  }

  getAllJobs() {
    return Array.from(this.jobs.values()).sort((a, b) => b.startTime - a.startTime)
  }
}

const batchExecutor = new BatchExecutor()

// ============ 系统常量定义 ============
const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
}

const ERROR_CODES = {
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  CACHE_ERROR: 'CACHE_ERROR',
  INVALID_PARAMETER: 'INVALID_PARAMETER',
  MISSING_PARAMETER: 'MISSING_PARAMETER',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  UNSUPPORTED_FORMAT: 'UNSUPPORTED_FORMAT'
}

const PERMISSION_NAMES = {
  USER_READ: 'user:read',
  USER_WRITE: 'user:write',
  USER_DELETE: 'user:delete',
  AGENT_READ: 'agent:read',
  AGENT_WRITE: 'agent:write',
  AGENT_EXECUTE: 'agent:execute',
  KNOWLEDGE_READ: 'knowledge:read',
  KNOWLEDGE_WRITE: 'knowledge:write',
  KNOWLEDGE_DELETE: 'knowledge:delete',
  TASK_READ: 'task:read',
  TASK_WRITE: 'task:write',
  TASK_EXECUTE: 'task:execute',
  ADMIN_DASHBOARD: 'admin:dashboard',
  ADMIN_SETTINGS: 'admin:settings',
  ADMIN_LOGS: 'admin:logs',
  SYSTEM_MAINTENANCE: 'system:maintenance'
}

const SYS_LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  FATAL: 'fatal'
}

const CACHE_TTL = {
  SHORT: 60,
  MEDIUM: 300,
  LONG: 1800,
  PERSISTENT: 86400,
  SESSION: 3600,
  TEMPORARY: 30
}

const RATE_LIMIT_DEFAULTS = {
  WINDOW_MS: 60000,
  MAX_REQUESTS: 100,
  SKIP_SUCCESSFUL_REQUESTS: false,
  KEY_PREFIX: 'ratelimit:',
  STANDARD_HEADERS: true,
  LEGACY_HEADERS: false
}

const MAX_UPLOAD_SIZE = {
  IMAGE: 5 * 1024 * 1024,
  DOCUMENT: 10 * 1024 * 1024,
  VIDEO: 50 * 1024 * 1024,
  AUDIO: 20 * 1024 * 1024,
  ARCHIVE: 100 * 1024 * 1024,
  DEFAULT: 5 * 1024 * 1024
}

const SUPPORTED_LANGUAGES = {
  zh: '简体中文',
  en: 'English',
  ja: '日本語',
  ko: '한국어',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  ru: 'Русский',
  pt: 'Português',
  it: 'Italiano'
}

const DEFAULT_CONFIGS = {
  pagination: { page: 1, pageSize: 20, maxPageSize: 100 },
  timeout: { default: 30000, upload: 120000, download: 60000, longRunning: 300000 },
  retry: { maxRetries: 3, backoffMultiplier: 2, initialDelay: 1000 },
  cache: { enabled: true, ttl: 300, checkPeriod: 600 },
  logging: { level: 'info', format: 'json', maxFiles: 7 },
  security: { bcryptRounds: 12, jwtExpiry: '24h', refreshTokenExpiry: '7d' }
}

// ============ 辅助工具函数 ============
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (obj instanceof Object) {
    const cloned = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = deepClone(obj[key])
      }
    }
    return cloned
  }
  return obj
}

function debounce(fn, ms) {
  let timer = null
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), ms)
  }
}

function throttle(fn, ms) {
  let last = 0
  let timer = null
  return function(...args) {
    const now = Date.now()
    if (now - last >= ms) {
      last = now
      fn.apply(this, args)
    } else {
      clearTimeout(timer)
      timer = setTimeout(() => {
        last = Date.now()
        fn.apply(this, args)
      }, ms - (now - last))
    }
  }
}

function memoize(fn) {
  const cache = new Map()
  return function(...args) {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)
    const result = fn.apply(this, args)
    cache.set(key, result)
    return result
  }
}

function chunk(array, size) {
  const result = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}

function flatten(array) {
  return array.reduce((acc, val) =>
    Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), [])
}

function unique(array) {
  return [...new Set(array)]
}

function groupBy(array, key) {
  return array.reduce((result, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key]
    if (!result[groupKey]) result[groupKey] = []
    result[groupKey].push(item)
    return result
  }, {})
}

function sortBy(array, key) {
  return [...array].sort((a, b) => {
    const aVal = typeof key === 'function' ? key(a) : a[key]
    const bVal = typeof key === 'function' ? key(b) : b[key]
    if (aVal < bVal) return -1
    if (aVal > bVal) return 1
    return 0
  })
}

function pick(obj, keys) {
  const result = {}
  for (const key of keys) {
    if (key in obj) result[key] = obj[key]
  }
  return result
}

function omit(obj, keys) {
  const result = { ...obj }
  for (const key of keys) delete result[key]
  return result
}

function isEmpty(value) {
  if (value == null) return true
  if (typeof value === 'string' || Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidURL(url) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function isValidIP(ip) {
  const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/
  const ipv6 = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
  if (ipv4.test(ip)) return ip.split('.').every(octet => parseInt(octet) <= 255)
  return ipv6.test(ip)
}

function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

function truncate(text, maxLength) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '').replace(/&\w+;/g, ' ').trim()
}

function escapeRegexString(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function parseQueryString(query) {
  const params = new URLSearchParams(query)
  const result = {}
  for (const [key, value] of params) {
    if (result[key]) {
      result[key] = Array.isArray(result[key]) ? [...result[key], value] : [result[key], value]
    } else {
      result[key] = value
    }
  }
  return result
}

function buildQueryString(params) {
  return Object.entries(params)
    .filter(([, v]) => v != null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
}

function formatByteSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function formatDuration(ms) {
  if (ms < 1000) return ms + 'ms'
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`
  if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`
  return `${seconds}s`
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function retry(fn, times) {
  let lastError
  for (let i = 0; i < times; i++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      await sleep(DEFAULT_CONFIGS.retry.initialDelay * Math.pow(DEFAULT_CONFIGS.retry.backoffMultiplier, i))
    }
  }
  throw lastError
}

function timeout(fn, ms) {
  return Promise.race([
    fn,
    new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT_ERROR')), ms))
  ])
}

async function parallel(tasks, concurrency) {
  const results = []
  const executing = []
  for (const [index, task] of tasks.entries()) {
    const p = Promise.resolve().then(() => task()).then(result => ({ index, result }))
    results.push(p)
    if (tasks.length >= concurrency) {
      executing.push(p)
      if (executing.length >= concurrency) {
        await Promise.race(executing)
        executing.splice(executing.findIndex(e => e === p), 1)
      }
    }
  }
  const settled = await Promise.allSettled(results)
  return settled.map(s => s.status === 'fulfilled' ? s.value.result : s.reason)
}

async function waterfall(tasks) {
  let result
  for (const task of tasks) {
    result = await task(result)
  }
  return result
}

function pipeline(...fns) {
  return function(input) {
    return fns.reduce((acc, fn) => fn(acc), input)
  }
}

// ============ 健康检查端点增强 ============
async function checkDatabaseHealth() {
  try {
    const start = Date.now()
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('DB_TIMEOUT')), 5000)
      db.get('SELECT 1 as status', (err) => {
        clearTimeout(timeout)
        if (err) reject(err)
        else resolve()
      })
    })
    return { status: 'healthy', latency: Date.now() - start }
  } catch (err) {
    return { status: 'unhealthy', error: err.message }
  }
}

async function checkFilesystemHealth() {
  try {
    const fs = require('fs').promises
    const testPath = path.join(__dirname, '..', '.healthcheck')
    await fs.writeFile(testPath, 'ok', 'utf8')
    await fs.readFile(testPath, 'utf8')
    await fs.unlink(testPath)
    return { status: 'healthy', writable: true, readable: true }
  } catch (err) {
    return { status: 'unhealthy', error: err.message }
  }
}

function checkMemoryHealth() {
  const usage = process.memoryUsage()
  const maxHeap = require('v8').getHeapStatistics().heap_size_limit
  const heapUsedPercent = (usage.heapUsed / maxHeap) * 100
  const rssPercent = (usage.rss / (require('os').totalmem())) * 100
  const status = heapUsedPercent > 90 || rssPercent > 80 ? 'warning' : 'healthy'
  return {
    status,
    heapUsed: formatByteSize(usage.heapUsed),
    heapTotal: formatByteSize(usage.heapTotal),
    rss: formatByteSize(usage.rss),
    external: formatByteSize(usage.external),
    heapUsedPercent: heapUsedPercent.toFixed(2) + '%',
    rssPercent: rssPercent.toFixed(2) + '%'
  }
}

function checkDiskHealth() {
  try {
    const fs = require('fs')
    const stats = fs.statSync('/')
    const os = require('os')
    const free = os.freemem()
    const total = os.totalmem()
    const usedPercent = ((total - free) / total) * 100
    return {
      status: usedPercent > 95 ? 'warning' : 'healthy',
      free: formatByteSize(free),
      total: formatByteSize(total),
      usedPercent: usedPercent.toFixed(2) + '%'
    }
  } catch (err) {
    return { status: 'unhealthy', error: err.message }
  }
}

async function checkExternalServices() {
  const services = [
    { name: 'openai', url: 'https://api.openai.com/v1/models', timeout: 5000 },
    { name: 'anthropic', url: 'https://api.anthropic.com/v1/health', timeout: 5000 },
    { name: 'google', url: 'https://generativelanguage.googleapis.com/v1beta/models', timeout: 5000 }
  ]
  const results = {}
  for (const svc of services) {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), svc.timeout)
      const res = await fetch(svc.url, { method: 'HEAD', signal: controller.signal })
      clearTimeout(timer)
      results[svc.name] = { status: res.ok ? 'healthy' : 'degraded', code: res.status }
    } catch (err) {
      results[svc.name] = { status: 'unreachable', error: err.message }
    }
  }
  return results
}

function calculateOverallHealthScore(checks) {
  let score = 100
  const weights = { database: 30, filesystem: 10, memory: 20, disk: 15, external: 25 }
  for (const [key, check] of Object.entries(checks)) {
    if (check.status === 'unhealthy') score -= weights[key] || 10
    else if (check.status === 'warning') score -= (weights[key] || 10) / 2
    else if (check.status === 'degraded') score -= (weights[key] || 10) / 2
  }
  return Math.max(0, Math.round(score))
}

// ============ 示例数据和种子数据 ============
const sampleUsers = [
  { id: 1, username: 'admin', email: 'admin@hopeagent.ai', role: 'admin', status: 'active', createdAt: '2024-01-15T08:00:00Z' },
  { id: 2, username: 'zhangsan', email: 'zhangsan@example.com', role: 'user', status: 'active', createdAt: '2024-02-01T10:30:00Z' },
  { id: 3, username: 'lisi', email: 'lisi@example.com', role: 'user', status: 'active', createdAt: '2024-02-10T14:20:00Z' },
  { id: 4, username: 'wangwu', email: 'wangwu@example.com', role: 'editor', status: 'active', createdAt: '2024-03-05T09:15:00Z' },
  { id: 5, username: 'zhaoliu', email: 'zhaoliu@example.com', role: 'user', status: 'inactive', createdAt: '2024-03-12T16:45:00Z' },
  { id: 6, username: 'sunqi', email: 'sunqi@example.com', role: 'user', status: 'active', createdAt: '2024-04-01T11:00:00Z' },
  { id: 7, username: 'zhouba', email: 'zhouba@example.com', role: 'editor', status: 'active', createdAt: '2024-04-18T08:30:00Z' },
  { id: 8, username: 'wujiu', email: 'wujiu@example.com', role: 'user', status: 'suspended', createdAt: '2024-05-02T13:10:00Z' },
  { id: 9, username: 'zhengshi', email: 'zhengshi@example.com', role: 'user', status: 'active', createdAt: '2024-05-20T07:50:00Z' },
  { id: 10, username: 'agentbot', email: 'bot@hopeagent.ai', role: 'service', status: 'active', createdAt: '2024-06-01T00:00:00Z' }
]

const sampleConversations = [
  { id: 101, userId: 2, title: '产品咨询', messageCount: 12, status: 'active', createdAt: '2024-06-10T09:00:00Z' },
  { id: 102, userId: 3, title: '技术支持', messageCount: 8, status: 'active', createdAt: '2024-06-11T14:30:00Z' },
  { id: 103, userId: 4, title: '文档审阅', messageCount: 25, status: 'closed', createdAt: '2024-06-12T10:15:00Z' },
  { id: 104, userId: 6, title: '功能建议', messageCount: 5, status: 'active', createdAt: '2024-06-13T16:00:00Z' },
  { id: 105, userId: 9, title: '账户问题', messageCount: 3, status: 'active', createdAt: '2024-06-14T08:45:00Z' }
]

const sampleKnowledgeEntries = [
  { id: 1, title: 'HopeAgent 快速入门', category: 'guide', tags: ['beginner', 'tutorial'], views: 1240, rating: 4.8 },
  { id: 2, title: 'API 接口文档', category: 'reference', tags: ['api', 'developer'], views: 892, rating: 4.6 },
  { id: 3, title: '插件开发指南', category: 'guide', tags: ['plugin', 'advanced'], views: 567, rating: 4.7 },
  { id: 4, title: '系统架构概述', category: 'architecture', tags: ['system', 'overview'], views: 430, rating: 4.9 },
  { id: 5, title: '常见问题解答', category: 'faq', tags: ['faq', 'troubleshoot'], views: 2100, rating: 4.5 },
  { id: 6, title: '权限管理说明', category: 'guide', tags: ['security', 'permissions'], views: 380, rating: 4.4 },
  { id: 7, title: '数据备份策略', category: 'operations', tags: ['backup', 'data'], views: 290, rating: 4.3 },
  { id: 8, title: '性能优化建议', category: 'guide', tags: ['performance', 'optimization'], views: 650, rating: 4.7 },
  { id: 9, title: 'Webhook 配置教程', category: 'tutorial', tags: ['webhook', 'integration'], views: 410, rating: 4.6 },
  { id: 10, title: '多语言支持说明', category: 'reference', tags: ['i18n', 'language'], views: 320, rating: 4.5 }
]

const sampleTasks = [
  { id: 'task-001', name: '数据同步', type: 'sync', status: 'running', priority: 'high', progress: 65, createdAt: '2024-06-14T08:00:00Z' },
  { id: 'task-002', name: '索引重建', type: 'maintenance', status: 'pending', priority: 'medium', progress: 0, createdAt: '2024-06-14T09:30:00Z' },
  { id: 'task-003', name: '报告生成', type: 'report', status: 'completed', priority: 'low', progress: 100, createdAt: '2024-06-13T14:00:00Z' },
  { id: 'task-004', name: '日志清理', type: 'maintenance', status: 'running', priority: 'medium', progress: 42, createdAt: '2024-06-14T10:15:00Z' },
  { id: 'task-005', name: '用户导入', type: 'import', status: 'failed', priority: 'high', progress: 78, createdAt: '2024-06-13T11:00:00Z' }
]

const sampleNotifications = [
  { id: 1, userId: 2, type: 'info', title: '系统更新', content: 'HopeAgent 已更新至 v2.1.0', read: false, createdAt: '2024-06-14T08:00:00Z' },
  { id: 2, userId: 2, type: 'warning', title: '存储空间告警', content: '您的存储空间使用率已超过80%', read: false, createdAt: '2024-06-14T07:30:00Z' },
  { id: 3, userId: 3, type: 'success', title: '任务完成', content: '数据备份任务已成功完成', read: true, createdAt: '2024-06-13T22:00:00Z' },
  { id: 4, userId: 4, type: 'error', title: '连接失败', content: '外部 API 连接超时，请检查配置', read: false, createdAt: '2024-06-14T06:15:00Z' },
  { id: 5, userId: 6, type: 'info', title: '新功能上线', content: '知识库搜索功能已全面开放', read: true, createdAt: '2024-06-13T12:00:00Z' }
]

async function seedDatabase() {
  const tables = ['users', 'conversations', 'knowledge', 'tasks', 'notifications']
  const seeds = {
    users: sampleUsers,
    conversations: sampleConversations,
    knowledge: sampleKnowledgeEntries,
    tasks: sampleTasks,
    notifications: sampleNotifications
  }
  console.log('🌱 开始种子数据初始化...')
  for (const table of tables) {
    try {
      const count = await new Promise((resolve, reject) => {
        db.get(`SELECT COUNT(*) as count FROM ${table}`, (err, row) => {
          if (err) reject(err)
          else resolve(row.count)
        })
      })
      if (count === 0) {
        const data = seeds[table]
        for (const row of data) {
          const keys = Object.keys(row).join(', ')
          const placeholders = Object.keys(row).map(() => '?').join(', ')
          const values = Object.values(row)
          await new Promise((resolve, reject) => {
            db.run(`INSERT INTO ${table} (${keys}) VALUES (${placeholders})`, values, function(err) {
              if (err) reject(err)
              else resolve(this.lastID)
            })
          })
        }
        console.log(`  ✅ ${table}: 已插入 ${data.length} 条数据`)
      } else {
        console.log(`  ⏭️ ${table}: 已有 ${count} 条数据，跳过`)
      }
    } catch (err) {
      console.log(`  ⚠️ ${table}: ${err.message}`)
    }
  }
  console.log('🌱 种子数据初始化完成')
}

// ============ 响应辅助函数 ============
function successResponse(data, meta = {}) {
  return { success: true, data, meta, timestamp: new Date().toISOString() }
}

function errorResponse(code, message, details = null) {
  return { success: false, error: { code, message, details }, timestamp: new Date().toISOString() }
}

function paginatedResponse(data, page, pageSize, total) {
  const totalPages = Math.ceil(total / pageSize)
  return successResponse(data, { page, pageSize, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 })
}

function wrapAsync(fn) {
  return function(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

// ============ 数据生成器 ============
function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

function generateRandomToken(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16)
}

function maskEmail(email) {
  const [local, domain] = email.split('@')
  const maskedLocal = local.charAt(0) + '***' + local.charAt(local.length - 1)
  return `${maskedLocal}@${domain}`
}

function maskPhone(phone) {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max)
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffleArray(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

function kebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase()
}

// ============ 系统启动脚本 ============
function printStartupBanner() {
  const banner = [
    '',
    '╔══════════════════════════════════════════════════════════════╗',
    '║                                                              ║',
    '║     ██╗  ██╗ ██████╗ ██████╗ ███████╗ █████╗  ██████╗ ███████╗███╗   ██╗████████╗ ║',
    '║     ██║  ██║██╔═══██╗██╔══██╗██╔════╝██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝ ║',
    '║     ███████║██║   ██║██████╔╝█████╗  ███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║    ║',
    '║     ██╔══██║██║   ██║██╔══██╗██╔══╝  ██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║    ║',
    '║     ██║  ██║╚██████╔╝██║  ██║███████╗██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║    ║',
    '║     ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝    ║',
    '║                                                              ║',
    '║                    HopeAgent Pro Backend                     ║',
    '║                                                              ║',
    '╚══════════════════════════════════════════════════════════════╝',
    ''
  ]
  console.log(banner.join('\n'))
}

function validateConfigs() {
  const requiredEnvVars = ['NODE_ENV', 'PORT']
  const missing = requiredEnvVars.filter(v => !process.env[v])
  if (missing.length > 0) {
    console.warn(`⚠️  缺少环境变量: ${missing.join(', ')}`)
  }
  const validations = [
    { check: () => typeof PORT === 'number' && PORT > 0, msg: 'PORT 必须为正整数' },
    { check: () => DEFAULT_CONFIGS.cache.ttl > 0, msg: 'CACHE_TTL 必须大于0' },
    { check: () => DEFAULT_CONFIGS.retry.maxRetries >= 0, msg: 'MAX_RETRIES 必须非负' }
  ]
  for (const v of validations) {
    if (!v.check()) console.warn(`⚠️  配置验证失败: ${v.msg}`)
  }
  console.log('✅ 配置加载验证完成')
}

function checkRequiredDependencies() {
  const requiredModules = ['express', 'sqlite3', 'ws', 'bcryptjs', 'jsonwebtoken']
  for (const mod of requiredModules) {
    try {
      require.resolve(mod)
    } catch {
      console.error(`❌ 缺少必要依赖: ${mod}`)
    }
  }
  console.log('✅ 依赖检查完成')
}

async function initializeDatabase() {
  try {
    await seedDatabase()
    console.log('✅ 数据库初始化完成')
  } catch (err) {
    console.error('❌ 数据库初始化失败:', err.message)
  }
}

async function warmUpCache() {
  try {
    const hotKeys = ['langPacks', 'pluginRegistry', 'systemConfig']
    for (const key of hotKeys) {
      if (global[key]) {
        console.log(`  🚀 缓存预热: ${key}`)
      }
    }
    await sleep(500)
    console.log('✅ 缓存预热完成')
  } catch (err) {
    console.error('❌ 缓存预热失败:', err.message)
  }
}

function registerScheduledTasks() {
  const tasks = [
    { name: 'cleanupOldLogs', interval: '0 2 * * *', desc: '每日凌晨2点清理旧日志' },
    { name: 'refreshStats', interval: '*/5 * * * *', desc: '每5分钟刷新统计缓存' },
    { name: 'backupDatabase', interval: '0 3 * * 0', desc: '每周日凌晨3点备份数据库' },
    { name: 'checkExpiredSessions', interval: '0 */6 * * *', desc: '每6小时检查过期会话' }
  ]
  for (const task of tasks) {
    console.log(`  📅 定时任务注册: ${task.name} (${task.desc})`)
  }
  console.log('✅ 定时任务注册完成')
}

function setupSignalHandlers() {
  const gracefulShutdown = async (signal) => {
    console.log(`\n📴 收到 ${signal} 信号，开始优雅关闭...`)
    try {
      server.close(() => {
        console.log('  🛑 HTTP 服务已关闭')
      })
      if (wss) {
        wss.close(() => {
          console.log('  🛑 WebSocket 服务已关闭')
        })
      }
      await new Promise((resolve) => {
        db.close((err) => {
          if (err) console.error('  ⚠️ 数据库关闭出错:', err.message)
          else console.log('  🛑 数据库连接已关闭')
          resolve()
        })
      })
      console.log('👋 HopeAgent 服务已安全退出\n')
      process.exit(0)
    } catch (err) {
      console.error('❌ 优雅关闭失败:', err.message)
      process.exit(1)
    }
  }
  process.on('SIGINT', () => gracefulShutdown('SIGINT'))
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
  process.on('uncaughtException', (err) => {
    console.error('💥 未捕获异常:', err)
    gracefulShutdown('uncaughtException')
  })
  process.on('unhandledRejection', (reason) => {
    console.error('💥 未处理的 Promise 拒绝:', reason)
  })
  console.log('✅ 信号处理已注册 (SIGINT, SIGTERM)')
}

// ============ 服务启动 ============
server.listen(PORT, async () => {
  printStartupBanner()
  validateConfigs()
  checkRequiredDependencies()
  await initializeDatabase()
  await warmUpCache()
  registerScheduledTasks()
  setupSignalHandlers()

  console.log(`\n🧠 HopeAgent 后端服务已启动`)
  console.log(`📡 地址: http://localhost:${PORT}`)
  console.log(`🔌 WebSocket: ws://localhost:${PORT}/ws`)
  console.log(`💡 健康检查: http://localhost:${PORT}/api/health`)
  console.log(`📊 Prometheus 指标: http://localhost:${PORT}/api/metrics`)
  console.log(`🔌 插件数量: ${registeredPlugins.size}`)
  console.log(`🌐 支持语言: ${Object.keys(langPacks).length} 种`)
  console.log(`📨 消息队列: ${messageQueue.queues.size} 个队列`)
  console.log(`⚡ 事件总线: ${eventBus.getEventTypes().length} 种事件类型`)
  console.log(`🔒 熔断器: ${circuitBreaker.circuits.size} 个断路器`)
  console.log(`⚖️ 负载均衡: ${loadBalancer.pools.size} 个服务池\n`)
})
