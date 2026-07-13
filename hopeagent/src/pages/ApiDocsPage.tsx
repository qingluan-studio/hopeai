import { useState, useMemo } from 'react'
import {
  Code2,
  Search,
  Terminal,
  Webhook,
  Shield,
  Zap,
  AlertTriangle,
  Check,
  X,
  Copy,
  ChevronDown,
  ChevronRight,
  Play,
  Loader2,
  BookOpen,
  Key,
  Server,
  Database,
  Wrench,
  FileText,
  Settings,
  Activity,
  GitBranch,
  Cpu,
  Send,
  RefreshCw,
  Layers,
  Globe,
  Lock,
  Clock,
  Hash,
  List,
  ExternalLink,
  Info,
  ArrowRight,
  Wifi,
  Code,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// HTTP 方法类型
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'WS'

// API 端点类型
interface ApiEndpoint {
  id: string
  method: HttpMethod
  path: string
  summary: string
  description: string
  category: string
  params?: { name: string; type: string; required: boolean; desc: string }[]
  body?: string
  requestExample: string
  responseExample: string
  tags?: string[]
}

// 端点分组
interface ApiGroup {
  id: string
  name: string
  icon: typeof Code2
  color: string
  desc: string
  endpoints: ApiEndpoint[]
}

// HTTP 方法颜色
const methodColors: Record<HttpMethod, string> = {
  GET: '#10b981',
  POST: '#00ff88',
  PUT: '#fbbf24',
  DELETE: '#ef4444',
  PATCH: '#c084fc',
  WS: '#00d4ff',
}

// API 分组数据
const apiGroups: ApiGroup[] = [
  {
    id: 'auth', name: '认证', icon: Key, color: '#00ff88',
    desc: '身份认证与令牌管理',
    endpoints: [
      {
        id: 'auth-login', method: 'POST', path: '/api/v1/auth/login',
        summary: '用户登录', description: '使用邮箱密码登录，获取访问令牌与刷新令牌。',
        category: 'auth',
        body: JSON.stringify({ email: 'user@example.com', password: 'your-password' }, null, 2),
        requestExample: `curl -X POST https://api.hopeagent.pro/api/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"user@example.com","password":"your-password"}'`,
        responseExample: JSON.stringify({
          code: 0, message: 'success',
          data: {
            accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            refreshToken: 'rt_xxxxxxxxxxxxxxxxxxxx',
            expiresIn: 7200,
            user: { id: 'u_001', nickname: 'CyberUser', level: 18 },
          }
        }, null, 2),
      },
      {
        id: 'auth-register', method: 'POST', path: '/api/v1/auth/register',
        summary: '用户注册', description: '注册新用户账号，需邮箱验证。',
        category: 'auth',
        body: JSON.stringify({ email: 'new@example.com', password: 'StrongPass1!', nickname: 'NewUser' }, null, 2),
        requestExample: `curl -X POST https://api.hopeagent.pro/api/v1/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"email":"new@example.com","password":"StrongPass1!","nickname":"NewUser"}'`,
        responseExample: JSON.stringify({
          code: 0, message: '注册成功，请查收邮件激活',
          data: { userId: 'u_002', needVerify: true }
        }, null, 2),
      },
      {
        id: 'auth-refresh', method: 'POST', path: '/api/v1/auth/refresh',
        summary: '刷新令牌', description: '使用刷新令牌获取新的访问令牌。',
        category: 'auth',
        body: JSON.stringify({ refreshToken: 'rt_xxxxxxxxxxxxxxxxxxxx' }, null, 2),
        requestExample: `curl -X POST https://api.hopeagent.pro/api/v1/auth/refresh \\
  -H "Content-Type: application/json" \\
  -d '{"refreshToken":"rt_xxxxxxxxxxxxxxxxxxxx"}'`,
        responseExample: JSON.stringify({
          code: 0, data: { accessToken: 'eyJ...', expiresIn: 7200 }
        }, null, 2),
      },
      {
        id: 'auth-logout', method: 'POST', path: '/api/v1/auth/logout',
        summary: '退出登录', description: '注销当前会话，使令牌失效。',
        category: 'auth',
        requestExample: `curl -X POST https://api.hopeagent.pro/api/v1/auth/logout \\
  -H "Authorization: Bearer <token>"`,
        responseExample: JSON.stringify({ code: 0, message: '已退出' }, null, 2),
      },
    ],
  },
  {
    id: 'chat', name: '对话', icon: Send, color: '#00d4ff',
    desc: '对话管理与消息收发',
    endpoints: [
      {
        id: 'chat-list', method: 'GET', path: '/api/v1/chat/conversations',
        summary: '获取对话列表', description: '分页获取当前用户的对话列表，按更新时间倒序。',
        category: 'chat',
        params: [
          { name: 'page', type: 'integer', required: false, desc: '页码，默认 1' },
          { name: 'pageSize', type: 'integer', required: false, desc: '每页数量，默认 20，最大 100' },
          { name: 'keyword', type: 'string', required: false, desc: '搜索关键词' },
        ],
        requestExample: `curl https://api.hopeagent.pro/api/v1/chat/conversations?page=1&pageSize=20 \\
  -H "Authorization: Bearer <token>"`,
        responseExample: JSON.stringify({
          code: 0,
          data: {
            total: 1284, page: 1, pageSize: 20,
            list: [
              { id: 'c_001', title: 'React 性能优化', messageCount: 12, updatedAt: '2026-07-13T09:00:00Z' },
              { id: 'c_002', title: 'TypeScript 类型推导', messageCount: 8, updatedAt: '2026-07-12T15:00:00Z' },
            ]
          }
        }, null, 2),
      },
      {
        id: 'chat-create', method: 'POST', path: '/api/v1/chat/conversations',
        summary: '创建对话', description: '创建新对话，可指定初始 Agent。',
        category: 'chat',
        body: JSON.stringify({ title: '新对话', agentId: 'orchestrator' }, null, 2),
        requestExample: `curl -X POST https://api.hopeagent.pro/api/v1/chat/conversations \\
  -H "Authorization: Bearer <token>" \\
  -H "Content-Type: application/json" \\
  -d '{"title":"新对话","agentId":"orchestrator"}'`,
        responseExample: JSON.stringify({
          code: 0, data: { id: 'c_003', title: '新对话', createdAt: '2026-07-13T10:00:00Z' }
        }, null, 2),
      },
      {
        id: 'chat-send', method: 'POST', path: '/api/v1/chat/conversations/{conversationId}/messages',
        summary: '发送消息', description: '向指定对话发送消息，返回 AI 回复。支持流式响应。',
        category: 'chat',
        params: [
          { name: 'conversationId', type: 'string', required: true, desc: '对话 ID' },
        ],
        body: JSON.stringify({
          content: '帮我写一个 React 组件',
          agentId: 'code-architect',
          stream: true,
          attachments: ['file_xxx'],
        }, null, 2),
        requestExample: `curl -X POST https://api.hopeagent.pro/api/v1/chat/conversations/c_001/messages \\
  -H "Authorization: Bearer <token>" \\
  -H "Content-Type: application/json" \\
  -d '{"content":"帮我写一个 React 组件","agentId":"code-architect","stream":true}'`,
        responseExample: JSON.stringify({
          code: 0,
          data: {
            messageId: 'm_001', role: 'assistant',
            content: '好的，我来帮你写一个...',
            agentId: 'code-architect',
            thoughtSteps: [{ type: 'think', content: '用户需要 React 组件...' }],
            usage: { promptTokens: 56, completionTokens: 234, totalTokens: 290 }
          }
        }, null, 2),
      },
      {
        id: 'chat-delete', method: 'DELETE', path: '/api/v1/chat/conversations/{conversationId}',
        summary: '删除对话', description: '删除指定对话及其所有消息，不可恢复。',
        category: 'chat',
        params: [{ name: 'conversationId', type: 'string', required: true, desc: '对话 ID' }],
        requestExample: `curl -X DELETE https://api.hopeagent.pro/api/v1/chat/conversations/c_001 \\
  -H "Authorization: Bearer <token>"`,
        responseExample: JSON.stringify({ code: 0, message: '已删除' }, null, 2),
      },
    ],
  },
  {
    id: 'knowledge', name: '知识库', icon: Database, color: '#c084fc',
    desc: '知识条目管理与检索',
    endpoints: [
      {
        id: 'kb-list', method: 'GET', path: '/api/v1/knowledge/entries',
        summary: '获取知识列表', description: '分页获取知识库条目，支持按分类、标签过滤。',
        category: 'knowledge',
        params: [
          { name: 'category', type: 'string', required: false, desc: '分类筛选' },
          { name: 'tag', type: 'string', required: false, desc: '标签筛选' },
          { name: 'page', type: 'integer', required: false, desc: '页码' },
        ],
        requestExample: `curl https://api.hopeagent.pro/api/v1/knowledge/entries?category=tech&page=1 \\
  -H "Authorization: Bearer <token>"`,
        responseExample: JSON.stringify({
          code: 0, data: {
            total: 156,
            list: [{ id: 'k_001', title: 'React Hooks 最佳实践', category: 'tech', tags: ['react', 'hooks'], importance: 0.9 }]
          }
        }, null, 2),
      },
      {
        id: 'kb-create', method: 'POST', path: '/api/v1/knowledge/entries',
        summary: '添加知识', description: '添加知识库条目，自动生成向量嵌入。',
        category: 'knowledge',
        body: JSON.stringify({
          title: 'TypeScript 泛型',
          content: '泛型是创建可复用组件的核心工具...',
          category: 'tech', tags: ['typescript', 'generic'], importance: 0.8,
        }, null, 2),
        requestExample: `curl -X POST https://api.hopeagent.pro/api/v1/knowledge/entries \\
  -H "Authorization: Bearer <token>" \\
  -H "Content-Type: application/json" \\
  -d '{"title":"TypeScript 泛型","content":"...","category":"tech","tags":["typescript"]}'`,
        responseExample: JSON.stringify({
          code: 0, data: { id: 'k_002', embedded: true }
        }, null, 2),
      },
      {
        id: 'kb-search', method: 'POST', path: '/api/v1/knowledge/search',
        summary: '语义检索', description: '基于向量嵌入的语义检索，返回最相关的知识条目。',
        category: 'knowledge',
        body: JSON.stringify({ query: '如何优化 React 渲染性能', topK: 5, threshold: 0.7 }, null, 2),
        requestExample: `curl -X POST https://api.hopeagent.pro/api/v1/knowledge/search \\
  -H "Authorization: Bearer <token>" \\
  -H "Content-Type: application/json" \\
  -d '{"query":"如何优化 React 渲染性能","topK":5}'`,
        responseExample: JSON.stringify({
          code: 0, data: {
            results: [
              { id: 'k_001', title: 'React 性能优化', score: 0.94, snippet: '使用 memo、useMemo...' },
              { id: 'k_045', title: '虚拟列表实现', score: 0.87, snippet: '...' },
            ]
          }
        }, null, 2),
      },
      {
        id: 'kb-delete', method: 'DELETE', path: '/api/v1/knowledge/entries/{entryId}',
        summary: '删除知识', description: '删除指定知识条目及其向量索引。',
        category: 'knowledge',
        params: [{ name: 'entryId', type: 'string', required: true, desc: '知识条目 ID' }],
        requestExample: `curl -X DELETE https://api.hopeagent.pro/api/v1/knowledge/entries/k_001 \\
  -H "Authorization: Bearer <token>"`,
        responseExample: JSON.stringify({ code: 0, message: '已删除' }, null, 2),
      },
    ],
  },
  {
    id: 'tools', name: '工具', icon: Wrench, color: '#fbbf24',
    desc: '工具调用与 MCP 管理',
    endpoints: [
      {
        id: 'tool-list', method: 'GET', path: '/api/v1/tools',
        summary: '获取工具列表', description: '获取所有可用工具及其 schema。',
        category: 'tools',
        requestExample: `curl https://api.hopeagent.pro/api/v1/tools \\
  -H "Authorization: Bearer <token>"`,
        responseExample: JSON.stringify({
          code: 0, data: {
            tools: [
              { name: 'web-search', description: '网络搜索', category: 'search' },
              { name: 'code-execute', description: '代码执行', category: 'code' },
            ]
          }
        }, null, 2),
      },
      {
        id: 'tool-call', method: 'POST', path: '/api/v1/tools/{toolName}/invoke',
        summary: '调用工具', description: '直接调用指定工具，传入参数，返回执行结果。',
        category: 'tools',
        params: [{ name: 'toolName', type: 'string', required: true, desc: '工具名称' }],
        body: JSON.stringify({ args: { query: '2026 AI 趋势', limit: 5 } }, null, 2),
        requestExample: `curl -X POST https://api.hopeagent.pro/api/v1/tools/web-search/invoke \\
  -H "Authorization: Bearer <token>" \\
  -H "Content-Type: application/json" \\
  -d '{"args":{"query":"2026 AI 趋势","limit":5}}'`,
        responseExample: JSON.stringify({
          code: 0, data: {
            result: [{ title: '...', url: '...', snippet: '...' }],
            duration: 1234,
          }
        }, null, 2),
      },
    ],
  },
  {
    id: 'files', name: '文件', icon: FileText, color: '#34d399',
    desc: '文件上传与管理',
    endpoints: [
      {
        id: 'file-upload', method: 'POST', path: '/api/v1/files/upload',
        summary: '上传文件', description: '上传文件，支持 PDF/Word/TXT/图片等。返回文件 ID。',
        category: 'files',
        requestExample: `curl -X POST https://api.hopeagent.pro/api/v1/files/upload \\
  -H "Authorization: Bearer <token>" \\
  -F "file=@/path/to/document.pdf"`,
        responseExample: JSON.stringify({
          code: 0, data: {
            fileId: 'f_001', name: 'document.pdf', size: 1024000, type: 'application/pdf',
            url: 'https://cdn.hopeagent.pro/files/f_001.pdf',
          }
        }, null, 2),
      },
      {
        id: 'file-list', method: 'GET', path: '/api/v1/files',
        summary: '获取文件列表', description: '分页获取已上传的文件列表。',
        category: 'files',
        requestExample: `curl https://api.hopeagent.pro/api/v1/files \\
  -H "Authorization: Bearer <token>"`,
        responseExample: JSON.stringify({
          code: 0, data: { total: 45, list: [{ fileId: 'f_001', name: 'doc.pdf', size: 1024000 }] }
        }, null, 2),
      },
    ],
  },
  {
    id: 'admin', name: '管理', icon: Settings, color: '#60a5fa',
    desc: '用户与系统管理',
    endpoints: [
      {
        id: 'admin-stats', method: 'GET', path: '/api/v1/admin/stats',
        summary: '系统统计', description: '获取系统全局统计数据，需管理员权限。',
        category: 'admin',
        requestExample: `curl https://api.hopeagent.pro/api/v1/admin/stats \\
  -H "Authorization: Bearer <admin-token>"`,
        responseExample: JSON.stringify({
          code: 0, data: {
            users: 12560, conversations: 384200, messages: 1284500,
            tokens: 284765000, agents: 33, tools: 27,
          }
        }, null, 2),
      },
      {
        id: 'admin-users', method: 'GET', path: '/api/v1/admin/users',
        summary: '用户列表', description: '分页获取用户列表，需管理员权限。',
        category: 'admin',
        params: [
          { name: 'page', type: 'integer', required: false, desc: '页码' },
          { name: 'status', type: 'string', required: false, desc: '用户状态筛选' },
        ],
        requestExample: `curl https://api.hopeagent.pro/api/v1/admin/users?page=1 \\
  -H "Authorization: Bearer <admin-token>"`,
        responseExample: JSON.stringify({
          code: 0, data: { total: 12560, list: [{ id: 'u_001', nickname: '...', level: 18 }] }
        }, null, 2),
      },
    ],
  },
]

// 错误码列表
const errorCodes = [
  { code: 0, name: 'SUCCESS', desc: '请求成功', httpStatus: 200 },
  { code: 1001, name: 'INVALID_PARAMS', desc: '参数错误', httpStatus: 400 },
  { code: 1002, name: 'VALIDATION_FAILED', desc: '参数校验失败', httpStatus: 422 },
  { code: 2001, name: 'UNAUTHORIZED', desc: '未授权，缺少令牌', httpStatus: 401 },
  { code: 2002, name: 'TOKEN_EXPIRED', desc: '令牌已过期', httpStatus: 401 },
  { code: 2003, name: 'TOKEN_INVALID', desc: '令牌无效', httpStatus: 401 },
  { code: 2004, name: 'PERMISSION_DENIED', desc: '权限不足', httpStatus: 403 },
  { code: 3001, name: 'RESOURCE_NOT_FOUND', desc: '资源不存在', httpStatus: 404 },
  { code: 3002, name: 'CONVERSATION_NOT_FOUND', desc: '对话不存在', httpStatus: 404 },
  { code: 3003, name: 'AGENT_NOT_FOUND', desc: 'Agent 不存在', httpStatus: 404 },
  { code: 4001, name: 'RATE_LIMITED', desc: '请求频率超限', httpStatus: 429 },
  { code: 4002, name: 'QUOTA_EXCEEDED', desc: '配额已用尽', httpStatus: 429 },
  { code: 5001, name: 'INTERNAL_ERROR', desc: '服务器内部错误', httpStatus: 500 },
  { code: 5002, name: 'LLM_UNAVAILABLE', desc: 'LLM 服务不可用', httpStatus: 503 },
  { code: 5003, name: 'EMBEDDING_FAILED', desc: '向量嵌入失败', httpStatus: 500 },
  { code: 6001, name: 'TOOL_EXECUTION_FAILED', desc: '工具执行失败', httpStatus: 500 },
  { code: 6002, name: 'CODE_SANDBOX_ERROR', desc: '代码沙箱错误', httpStatus: 500 },
]

// SDK 示例
const sdkExamples = {
  curl: `# 创建对话并发送消息
curl -X POST https://api.hopeagent.pro/api/v1/chat/conversations \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"title":"API 测试","agentId":"orchestrator"}'

# 获取对话 ID 后发送消息
curl -X POST https://api.hopeagent.pro/api/v1/chat/conversations/$CONV_ID/messages \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"content":"你好，请介绍一下自己","stream":false}'`,
  nodejs: `import { HopeAgent } from '@hopeagent/sdk'

const client = new HopeAgent({
  apiKey: process.env.HOPEAGENT_API_KEY,
  baseUrl: 'https://api.hopeagent.pro'
})

// 创建对话
const conv = await client.chat.createConversation({
  title: 'API 测试',
  agentId: 'orchestrator'
})

// 发送消息
const reply = await client.chat.sendMessage(conv.id, {
  content: '你好，请介绍一下自己',
  stream: false
})

console.log(reply.content)
console.log(reply.usage)`,
  python: `from hopeagent import HopeAgent

client = HopeAgent(
    api_key=os.environ['HOPEAGENT_API_KEY'],
    base_url='https://api.hopeagent.pro'
)

# 创建对话
conv = client.chat.create_conversation(
    title='API 测试',
    agent_id='orchestrator'
)

# 发送消息
reply = client.chat.send_message(
    conv.id,
    content='你好，请介绍一下自己',
    stream=False
)

print(reply.content)
print(reply.usage)`,
}

// WebSocket 事件
const wsEvents = [
  { event: 'chat.message', direction: 'client→server', desc: '发送消息', payload: '{ "type": "chat.message", "conversationId": "c_001", "content": "你好" }' },
  { event: 'chat.stream', direction: 'server→client', desc: '流式回复', payload: '{ "type": "chat.stream", "delta": "你好", "messageId": "m_001" }' },
  { event: 'chat.complete', direction: 'server→client', desc: '回复完成', payload: '{ "type": "chat.complete", "messageId": "m_001", "usage": {...} }' },
  { event: 'tool.call', direction: 'server→client', desc: '工具调用通知', payload: '{ "type": "tool.call", "tool": "web-search", "args": {...} }' },
  { event: 'tool.result', direction: 'server→client', desc: '工具结果', payload: '{ "type": "tool.result", "tool": "web-search", "result": [...] }' },
  { event: 'thought.step', direction: 'server→client', desc: '思考步骤', payload: '{ "type": "thought.step", "step": "think", "content": "..." }' },
  { event: 'error', direction: 'server→client', desc: '错误事件', payload: '{ "type": "error", "code": 5001, "message": "..." }' },
  { event: 'ping', direction: 'both', desc: '心跳', payload: '{ "type": "ping" } / { "type": "pong" }' },
]

// API 版本对比
const versionCompare = [
  { feature: '认证方式', v1: 'Session Cookie', v2: 'JWT + Refresh Token', v3: 'JWT + OAuth2' },
  { feature: '响应格式', v1: '{ success, data }', v2: '{ code, message, data }', v3: '{ code, message, data, meta }' },
  { feature: '分页方式', v1: 'offset/limit', v2: 'page/pageSize', v3: 'cursor-based' },
  { feature: '错误码', v1: 'HTTP 状态码', v2: '业务码 + HTTP', v3: '业务码 + HTTP + 子码' },
  { feature: '流式响应', v1: '不支持', v2: 'SSE', v3: 'SSE + WebSocket' },
  { feature: '限流策略', v1: '无', v2: '固定窗口', v3: '滑动窗口 + 令牌桶' },
  { feature: '版本管理', v1: 'URL 无版本', v2: '/api/v2/', v3: '/api/v3/ + Header' },
]

export default function ApiDocsPage() {
  const [activeGroup, setActiveGroup] = useState('auth')
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>('auth-login')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'docs' | 'try' | 'errors' | 'sdk' | 'websocket' | 'versions'>('docs')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [sdkLang, setSdkLang] = useState<'curl' | 'nodejs' | 'python'>('curl')
  // 试用构造器状态
  const [tryMethod, setTryMethod] = useState<HttpMethod>('POST')
  const [tryPath, setTryPath] = useState('/api/v1/auth/login')
  const [tryBody, setTryBody] = useState('{\n  "email": "user@example.com",\n  "password": "your-password"\n}')
  const [tryToken, setTryToken] = useState('')
  const [tryLoading, setTryLoading] = useState(false)
  const [tryResponse, setTryResponse] = useState('')

  // 搜索过滤端点
  const filteredGroups = useMemo(() => {
    if (!searchQuery) return apiGroups
    const q = searchQuery.toLowerCase()
    return apiGroups.map(g => ({
      ...g,
      endpoints: g.endpoints.filter(e =>
        e.path.toLowerCase().includes(q) ||
        e.summary.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
      )
    })).filter(g => g.endpoints.length > 0)
  }, [searchQuery])

  // 当前活跃分组
  const currentGroup = apiGroups.find(g => g.id === activeGroup) || apiGroups[0]

  // 复制文本
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // 发送试用请求
  const handleTryRequest = () => {
    setTryLoading(true)
    setTryResponse('')
    // 模拟请求
    setTimeout(() => {
      setTryLoading(false)
      setTryResponse(JSON.stringify({
        code: 0,
        message: 'success (模拟响应)',
        data: {
          method: tryMethod,
          path: tryPath,
          receivedBody: tryBody,
          timestamp: new Date().toISOString(),
          note: '这是模拟响应，实际调用需配置后端',
        }
      }, null, 2))
    }, 1200)
  }

  // 渲染端点卡片
  const renderEndpoint = (endpoint: ApiEndpoint) => {
    const isExpanded = expandedEndpoint === endpoint.id
    const methodColor = methodColors[endpoint.method]

    return (
      <div key={endpoint.id} className="bg-cyber-panel/50 border border-cyber-border rounded-xl overflow-hidden">
        {/* 端点头部 */}
        <button
          onClick={() => setExpandedEndpoint(isExpanded ? null : endpoint.id)}
          className="w-full flex items-center gap-2 p-3 hover:bg-white/[0.02] transition-colors text-left"
        >
          <span
            className="px-2 py-0.5 rounded text-[10px] font-mono font-bold flex-shrink-0"
            style={{ background: `${methodColor}15`, color: methodColor, border: `1px solid ${methodColor}30` }}
          >
            {endpoint.method}
          </span>
          <code className="text-xs text-cyber-text font-mono flex-1 truncate">{endpoint.path}</code>
          <span className="text-xs text-gray-400 hidden sm:block truncate">{endpoint.summary}</span>
          {isExpanded
            ? <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
            : <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />}
        </button>

        {/* 展开内容 */}
        {isExpanded && (
          <div className="px-3 pb-3 space-y-3 border-t border-cyber-border/30 pt-3">
            <p className="text-xs text-gray-400 leading-relaxed">{endpoint.description}</p>

            {/* 路径参数 */}
            {endpoint.params && endpoint.params.length > 0 && (
              <div>
                <h4 className="text-[10px] font-mono text-gray-500 uppercase mb-1.5">参数</h4>
                <div className="space-y-1">
                  {endpoint.params.map(p => (
                    <div key={p.name} className="flex items-center gap-2 text-xs">
                      <code className="text-cyber-accent font-mono">{p.name}</code>
                      <span className="text-[10px] text-gray-500 font-mono">{p.type}</span>
                      {p.required
                        ? <span className="px-1 py-0.5 rounded bg-red-500/15 text-red-400 text-[9px] font-mono">必填</span>
                        : <span className="px-1 py-0.5 rounded bg-white/[0.03] text-gray-500 text-[9px] font-mono">可选</span>}
                      <span className="text-gray-400 flex-1">{p.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 请求体 */}
            {endpoint.body && (
              <div>
                <h4 className="text-[10px] font-mono text-gray-500 uppercase mb-1.5">请求体</h4>
                <div className="relative">
                  <pre className="bg-cyber-bg/60 border border-cyber-border/40 rounded-lg p-3 text-[11px] font-mono text-cyber-accent2 overflow-x-auto">
                    {endpoint.body}
                  </pre>
                  <button
                    onClick={() => handleCopy(endpoint.body!, `body-${endpoint.id}`)}
                    className="absolute top-2 right-2 p-1 rounded hover:bg-white/5 text-gray-500 hover:text-cyber-accent"
                  >
                    {copiedId === `body-${endpoint.id}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            )}

            {/* 请求示例 */}
            <div>
              <h4 className="text-[10px] font-mono text-gray-500 uppercase mb-1.5">请求示例</h4>
              <div className="relative">
                <pre className="bg-cyber-bg/60 border border-cyber-border/40 rounded-lg p-3 text-[11px] font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap">
                  {endpoint.requestExample}
                </pre>
                <button
                  onClick={() => handleCopy(endpoint.requestExample, `req-${endpoint.id}`)}
                  className="absolute top-2 right-2 p-1 rounded hover:bg-white/5 text-gray-500 hover:text-cyber-accent"
                >
                  {copiedId === `req-${endpoint.id}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* 响应示例 */}
            <div>
              <h4 className="text-[10px] font-mono text-gray-500 uppercase mb-1.5">响应示例</h4>
              <div className="relative">
                <pre className="bg-cyber-bg/60 border border-cyber-border/40 rounded-lg p-3 text-[11px] font-mono text-cyber-accent overflow-x-auto whitespace-pre-wrap">
                  {endpoint.responseExample}
                </pre>
                <button
                  onClick={() => handleCopy(endpoint.responseExample, `res-${endpoint.id}`)}
                  className="absolute top-2 right-2 p-1 rounded hover:bg-white/5 text-gray-500 hover:text-cyber-accent"
                >
                  {copiedId === `res-${endpoint.id}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* 试用按钮 */}
            <button
              onClick={() => {
                setActiveTab('try')
                setTryMethod(endpoint.method)
                setTryPath(endpoint.path)
                if (endpoint.body) setTryBody(endpoint.body)
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-accent/15 border border-cyber-accent/30 text-cyber-accent text-xs font-mono hover:bg-cyber-accent/25 transition-all"
            >
              <Play className="w-3 h-3" />
              在线试用
            </button>
          </div>
        )}
      </div>
    )
  }

  // 渲染文档 Tab
  const renderDocsTab = () => (
    <div className="space-y-3">
      {/* 概览 */}
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h2 className="text-sm font-bold text-cyber-text mb-2 flex items-center gap-2">
          <Info className="w-4 h-4 text-cyber-accent" />
          API 概览
        </h2>
        <div className="grid grid-cols-1 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-cyber-accent2 flex-shrink-0" />
            <span className="text-gray-500 font-mono">基础 URL:</span>
            <code className="text-cyber-accent font-mono">https://api.hopeagent.pro</code>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-cyber-accent2 flex-shrink-0" />
            <span className="text-gray-500 font-mono">认证方式:</span>
            <code className="text-cyber-accent font-mono">Bearer Token (JWT)</code>
          </div>
          <div className="flex items-center gap-2">
            <Hash className="w-3.5 h-3.5 text-cyber-accent2 flex-shrink-0" />
            <span className="text-gray-500 font-mono">当前版本:</span>
            <code className="text-cyber-accent font-mono">v1</code>
            <span className="text-[10px] text-gray-600">(URL: /api/v1/)</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyber-accent2 flex-shrink-0" />
            <span className="text-gray-500 font-mono">响应格式:</span>
            <code className="text-cyber-accent font-mono">JSON</code>
          </div>
        </div>
      </div>

      {/* 认证说明 */}
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h3 className="text-sm font-bold text-cyber-text mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyber-accent" />
          认证方式
        </h3>
        <p className="text-xs text-gray-400 mb-2 leading-relaxed">
          所有 API 请求需在 Header 中携带访问令牌：
        </p>
        <pre className="bg-cyber-bg/60 border border-cyber-border/40 rounded-lg p-3 text-[11px] font-mono text-cyber-accent overflow-x-auto">
{`Authorization: Bearer <your-access-token>`}
        </pre>
        <p className="text-xs text-gray-400 mt-2 leading-relaxed">
          访问令牌有效期为 2 小时，过期后使用刷新令牌获取新令牌。令牌请妥善保管，不要泄露。
        </p>
      </div>

      {/* 响应格式 */}
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h3 className="text-sm font-bold text-cyber-text mb-2 flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyber-accent" />
          响应格式
        </h3>
        <p className="text-xs text-gray-400 mb-2">所有响应均为统一 JSON 结构：</p>
        <pre className="bg-cyber-bg/60 border border-cyber-border/40 rounded-lg p-3 text-[11px] font-mono text-cyber-accent overflow-x-auto">
{`{
  "code": 0,           // 业务状态码，0 为成功
  "message": "success", // 提示信息
  "data": { ... },      // 业务数据
  "meta": {             // 元信息（分页等）
    "page": 1,
    "pageSize": 20,
    "total": 100
  }
}`}
        </pre>
      </div>

      {/* 端点列表 */}
      <div>
        <h3 className="text-xs font-mono text-gray-500 uppercase mb-2 flex items-center gap-1.5">
          <List className="w-3.5 h-3.5" />
          端点列表 ({filteredGroups.reduce((s, g) => s + g.endpoints.length, 0)})
        </h3>
        <div className="space-y-3">
          {filteredGroups.map(group => {
            const Icon = group.icon
            return (
              <div key={group.id}>
                <div className="flex items-center gap-2 mb-2 px-1">
                  <Icon className="w-4 h-4" style={{ color: group.color }} />
                  <h4 className="text-sm font-bold text-cyber-text">{group.name}</h4>
                  <span className="text-[10px] text-gray-500 font-mono">{group.desc}</span>
                </div>
                <div className="space-y-2">
                  {group.endpoints.map(renderEndpoint)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  // 渲染在线试用
  const renderTryTab = () => (
    <div className="space-y-3">
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h2 className="text-sm font-bold text-cyber-text mb-1 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyber-accent" />
          在线试用
        </h2>
        <p className="text-xs text-gray-400">构造并发送 API 请求，查看响应结果</p>
      </div>

      {/* 请求构造器 */}
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-3 space-y-3">
        {/* 方法 + 路径 */}
        <div className="flex items-center gap-2">
          <select
            value={tryMethod}
            onChange={e => setTryMethod(e.target.value as HttpMethod)}
            className="bg-cyber-bg/60 border border-cyber-border rounded-lg px-2 py-2 text-xs font-mono font-bold outline-none"
            style={{ color: methodColors[tryMethod] }}
          >
            {(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as HttpMethod[]).map(m => (
              <option key={m} value={m} className="bg-cyber-panel">{m}</option>
            ))}
          </select>
          <input
            value={tryPath}
            onChange={e => setTryPath(e.target.value)}
            className="flex-1 bg-cyber-bg/60 border border-cyber-border focus:border-cyber-accent outline-none rounded-lg px-3 py-2 text-xs font-mono text-cyber-text"
          />
        </div>

        {/* Token */}
        <div>
          <label className="text-[10px] text-gray-500 font-mono uppercase mb-1 block">Authorization Token</label>
          <input
            value={tryToken}
            onChange={e => setTryToken(e.target.value)}
            type="password"
            placeholder="Bearer token (可选)"
            className="w-full bg-cyber-bg/60 border border-cyber-border focus:border-cyber-accent outline-none rounded-lg px-3 py-2 text-xs font-mono text-cyber-text"
          />
        </div>

        {/* 请求体 */}
        <div>
          <label className="text-[10px] text-gray-500 font-mono uppercase mb-1 block">请求体 (JSON)</label>
          <textarea
            value={tryBody}
            onChange={e => setTryBody(e.target.value)}
            rows={8}
            className="w-full bg-cyber-bg/60 border border-cyber-border focus:border-cyber-accent outline-none rounded-lg px-3 py-2 text-xs font-mono text-cyber-accent2 resize-y"
          />
        </div>

        {/* 发送按钮 */}
        <button
          onClick={handleTryRequest}
          disabled={tryLoading}
          className="w-full py-2.5 rounded-lg bg-cyber-accent/20 border border-cyber-accent/30 text-cyber-accent text-sm font-mono hover:bg-cyber-accent/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {tryLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              请求中...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              发送请求
            </>
          )}
        </button>
      </div>

      {/* 响应结果 */}
      {tryResponse && (
        <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-mono text-gray-400 uppercase flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-cyber-accent" />
              响应结果
            </h3>
            <button
              onClick={() => handleCopy(tryResponse, 'try-res')}
              className="p-1 rounded hover:bg-white/5 text-gray-500 hover:text-cyber-accent"
            >
              {copiedId === 'try-res' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <pre className="bg-cyber-bg/60 border border-cyber-border/40 rounded-lg p-3 text-[11px] font-mono text-cyber-accent overflow-x-auto whitespace-pre-wrap">
            {tryResponse}
          </pre>
        </div>
      )}
    </div>
  )

  // 渲染错误码
  const renderErrorsTab = () => (
    <div className="space-y-3">
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h2 className="text-sm font-bold text-cyber-text mb-1 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400" />
          错误码列表
        </h2>
        <p className="text-xs text-gray-400">共 {errorCodes.length} 个错误码，包含业务码与对应 HTTP 状态</p>
      </div>

      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl overflow-hidden">
        {/* 表头 */}
        <div className="grid grid-cols-12 gap-2 px-3 py-2 border-b border-cyber-border bg-cyber-bg/40 text-[10px] font-mono text-gray-500 uppercase">
          <div className="col-span-2">业务码</div>
          <div className="col-span-3">名称</div>
          <div className="col-span-2">HTTP</div>
          <div className="col-span-5">描述</div>
        </div>
        {/* 表内容 */}
        {errorCodes.map(err => (
          <div key={err.code} className="grid grid-cols-12 gap-2 px-3 py-2 border-b border-cyber-border/30 text-xs hover:bg-white/[0.02]">
            <div className="col-span-2">
              <code className="font-mono text-cyber-accent">{err.code}</code>
            </div>
            <div className="col-span-3">
              <code className="font-mono text-cyber-accent2 text-[11px]">{err.name}</code>
            </div>
            <div className="col-span-2">
              <span className={cn(
                'px-1.5 py-0.5 rounded text-[10px] font-mono',
                err.httpStatus < 300 ? 'bg-green-500/15 text-green-400' :
                err.httpStatus < 400 ? 'bg-yellow-500/15 text-yellow-400' :
                err.httpStatus < 500 ? 'bg-orange-500/15 text-orange-400' :
                'bg-red-500/15 text-red-400'
              )}>
                {err.httpStatus}
              </span>
            </div>
            <div className="col-span-5 text-gray-400">{err.desc}</div>
          </div>
        ))}
      </div>

      {/* 限流说明 */}
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h3 className="text-sm font-bold text-cyber-text mb-2 flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyber-accent" />
          限流说明
        </h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-1.5 px-2 rounded bg-white/[0.02]">
            <span className="text-gray-400">免费版</span>
            <code className="text-cyber-accent font-mono">60 次/分钟</code>
          </div>
          <div className="flex items-center justify-between py-1.5 px-2 rounded bg-white/[0.02]">
            <span className="text-gray-400">付费版</span>
            <code className="text-cyber-accent font-mono">600 次/分钟</code>
          </div>
          <div className="flex items-center justify-between py-1.5 px-2 rounded bg-white/[0.02]">
            <span className="text-gray-400">企业版</span>
            <code className="text-cyber-accent font-mono">自定义</code>
          </div>
        </div>
        <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
          超出限流返回 429 状态码，响应头包含 X-RateLimit-Remaining 与 X-RateLimit-Reset。建议实现指数退避重试。
        </p>
      </div>
    </div>
  )

  // 渲染 SDK 示例
  const renderSdkTab = () => (
    <div className="space-y-3">
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h2 className="text-sm font-bold text-cyber-text mb-1 flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyber-accent" />
          SDK 示例
        </h2>
        <p className="text-xs text-gray-400">使用不同语言快速接入 HopeAgent API</p>
      </div>

      {/* 语言切换 */}
      <div className="flex items-center gap-1">
        {([
          { id: 'curl' as const, label: 'curl' },
          { id: 'nodejs' as const, label: 'Node.js' },
          { id: 'python' as const, label: 'Python' },
        ]).map(lang => (
          <button
            key={lang.id}
            onClick={() => setSdkLang(lang.id)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-mono transition-all',
              sdkLang === lang.id
                ? 'bg-cyber-accent/15 text-cyber-accent border border-cyber-accent/30'
                : 'bg-white/[0.02] text-gray-400 border border-cyber-border/50 hover:border-cyber-accent/20'
            )}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* 代码示例 */}
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-3">
        <div className="relative">
          <pre className="bg-cyber-bg/60 border border-cyber-border/40 rounded-lg p-3 text-[11px] font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap">
            {sdkExamples[sdkLang]}
          </pre>
          <button
            onClick={() => handleCopy(sdkExamples[sdkLang], `sdk-${sdkLang}`)}
            className="absolute top-2 right-2 p-1.5 rounded hover:bg-white/5 text-gray-500 hover:text-cyber-accent"
          >
            {copiedId === `sdk-${sdkLang}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 安装说明 */}
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h3 className="text-xs font-mono text-gray-500 uppercase mb-2">安装 SDK</h3>
        <div className="space-y-2">
          <div className="relative">
            <pre className="bg-cyber-bg/60 border border-cyber-border/40 rounded-lg p-3 text-[11px] font-mono text-cyber-accent overflow-x-auto">
              npm install @hopeagent/sdk
            </pre>
            <button
              onClick={() => handleCopy('npm install @hopeagent/sdk', 'npm')}
              className="absolute top-2 right-2 p-1 rounded hover:bg-white/5 text-gray-500 hover:text-cyber-accent"
            >
              {copiedId === 'npm' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <div className="relative">
            <pre className="bg-cyber-bg/60 border border-cyber-border/40 rounded-lg p-3 text-[11px] font-mono text-cyber-accent overflow-x-auto">
              pip install hopeagent
            </pre>
            <button
              onClick={() => handleCopy('pip install hopeagent', 'pip')}
              className="absolute top-2 right-2 p-1 rounded hover:bg-white/5 text-gray-500 hover:text-cyber-accent"
            >
              {copiedId === 'pip' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // 渲染 WebSocket 文档
  const renderWebsocketTab = () => (
    <div className="space-y-3">
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h2 className="text-sm font-bold text-cyber-text mb-1 flex items-center gap-2">
          <Webhook className="w-4 h-4 text-cyber-accent2" />
          WebSocket 文档
        </h2>
        <p className="text-xs text-gray-400">实时双向通信，用于流式对话与事件推送</p>
      </div>

      {/* 连接说明 */}
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h3 className="text-sm font-bold text-cyber-text mb-2 flex items-center gap-2">
          <Wifi className="w-4 h-4 text-cyber-accent" />
          连接方式
        </h3>
        <pre className="bg-cyber-bg/60 border border-cyber-border/40 rounded-lg p-3 text-[11px] font-mono text-cyber-accent overflow-x-auto">
{`wss://api.hopeagent.pro/ws/v1?token=<your-access-token>`}
        </pre>
        <p className="text-xs text-gray-400 mt-2 leading-relaxed">
          连接后每 30 秒发送 ping 保持心跳，60 秒未收到 pong 将断开连接。支持一个连接同时管理多个对话。
        </p>
      </div>

      {/* 事件列表 */}
      <div>
        <h3 className="text-xs font-mono text-gray-500 uppercase mb-2 flex items-center gap-1.5">
          <GitBranch className="w-3.5 h-3.5" />
          事件列表 ({wsEvents.length})
        </h3>
        <div className="space-y-2">
          {wsEvents.map(evt => (
            <div key={evt.event} className="bg-cyber-panel/50 border border-cyber-border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <code className="text-xs text-cyber-accent font-mono font-bold">{evt.event}</code>
                <span className={cn(
                  'px-1.5 py-0.5 rounded text-[9px] font-mono',
                  evt.direction === 'client→server' ? 'bg-cyber-accent2/15 text-cyber-accent2' :
                  evt.direction === 'server→client' ? 'bg-purple-500/15 text-purple-400' :
                  'bg-gray-500/15 text-gray-400'
                )}>
                  {evt.direction}
                </span>
                <span className="text-xs text-gray-400 ml-auto">{evt.desc}</span>
              </div>
              <pre className="bg-cyber-bg/60 border border-cyber-border/40 rounded p-2 text-[10px] font-mono text-gray-300 overflow-x-auto">
                {evt.payload}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // 渲染版本对比
  const renderVersionsTab = () => (
    <div className="space-y-3">
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h2 className="text-sm font-bold text-cyber-text mb-1 flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-cyber-accent" />
          API 版本对比
        </h2>
        <p className="text-xs text-gray-400">v1 / v2 / v3 主要差异对比</p>
      </div>

      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl overflow-hidden">
        {/* 表头 */}
        <div className="grid grid-cols-12 gap-2 px-3 py-2 border-b border-cyber-border bg-cyber-bg/40 text-[10px] font-mono text-gray-500 uppercase">
          <div className="col-span-3">特性</div>
          <div className="col-span-3">v1</div>
          <div className="col-span-3">v2</div>
          <div className="col-span-3">v3 (推荐)</div>
        </div>
        {versionCompare.map(row => (
          <div key={row.feature} className="grid grid-cols-12 gap-2 px-3 py-2.5 border-b border-cyber-border/30 text-xs hover:bg-white/[0.02]">
            <div className="col-span-3 text-gray-300 font-medium">{row.feature}</div>
            <div className="col-span-3">
              <code className="text-[10px] font-mono text-gray-500">{row.v1}</code>
            </div>
            <div className="col-span-3">
              <code className="text-[10px] font-mono text-cyber-accent2">{row.v2}</code>
            </div>
            <div className="col-span-3">
              <code className="text-[10px] font-mono text-cyber-accent">{row.v3}</code>
            </div>
          </div>
        ))}
      </div>

      {/* 迁移建议 */}
      <div className="bg-cyber-accent/5 border border-cyber-accent/30 rounded-xl p-4">
        <h3 className="text-sm font-bold text-cyber-accent mb-2 flex items-center gap-2">
          <Info className="w-4 h-4" />
          迁移建议
        </h3>
        <ul className="space-y-1.5 text-xs text-gray-400">
          <li className="flex items-start gap-2">
            <Check className="w-3 h-3 text-cyber-accent mt-0.5 flex-shrink-0" />
            <span>新项目直接使用 v3，获得最佳实践与全部新特性</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-3 h-3 text-cyber-accent mt-0.5 flex-shrink-0" />
            <span>v1 已废弃，建议尽快迁移到 v2 或 v3</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-3 h-3 text-cyber-accent mt-0.5 flex-shrink-0" />
            <span>v2 仍受支持但不再新增功能，仅修复严重 bug</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-3 h-3 text-cyber-accent mt-0.5 flex-shrink-0" />
            <span>迁移指南详见 <a className="text-cyber-accent2 underline">迁移文档</a></span>
          </li>
        </ul>
      </div>
    </div>
  )

  // 渲染当前 Tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'docs': return renderDocsTab()
      case 'try': return renderTryTab()
      case 'errors': return renderErrorsTab()
      case 'sdk': return renderSdkTab()
      case 'websocket': return renderWebsocketTab()
      case 'versions': return renderVersionsTab()
      default: return renderDocsTab()
    }
  }

  // 顶层 Tab 配置
  const topTabs = [
    { id: 'docs' as const, label: '端点文档', icon: BookOpen },
    { id: 'try' as const, label: '在线试用', icon: Terminal },
    { id: 'errors' as const, label: '错误码', icon: AlertTriangle },
    { id: 'sdk' as const, label: 'SDK', icon: Code2 },
    { id: 'websocket' as const, label: 'WebSocket', icon: Webhook },
    { id: 'versions' as const, label: '版本对比', icon: RefreshCw },
  ]

  return (
    <div className="h-full flex flex-col">
      {/* 顶部标题栏 */}
      <div className="border-b border-cyber-border bg-cyber-panel/50 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-cyber-text flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyber-accent" />
              API 文档
            </h1>
            <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
              REST API · WebSocket · SDK
            </p>
          </div>
          <a className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-cyber-border/50 text-xs text-gray-400 hover:text-cyber-accent hover:border-cyber-accent/30 transition-all font-mono">
            <ExternalLink className="w-3.5 h-3.5" />
            Postman
          </a>
        </div>

        {/* 搜索框 */}
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="搜索端点路径或描述..."
            className="w-full bg-white/[0.02] border border-cyber-border focus:border-cyber-accent outline-none rounded-lg pl-9 pr-3 py-2 text-sm text-cyber-text"
          />
        </div>
      </div>

      {/* 顶层 Tab */}
      <div className="border-b border-cyber-border/30 bg-cyber-bg/30 flex-shrink-0">
        <div className="flex items-center gap-1 px-2 py-2 overflow-x-auto">
          {topTabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex-shrink-0',
                  activeTab === tab.id
                    ? 'bg-cyber-accent/15 text-cyber-accent border border-cyber-accent/30'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-y-auto p-3">
        {renderTabContent()}
      </div>
    </div>
  )
}
