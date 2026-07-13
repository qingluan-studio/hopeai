import { useState, useMemo } from 'react'
import {
  HelpCircle,
  Search,
  BookOpen,
  Rocket,
  MessageSquare,
  Brain,
  Database,
  Wrench,
  GitBranch,
  Palette,
  Keyboard,
  Terminal,
  AlertTriangle,
  Video,
  RefreshCw,
  MessageCircle,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Clock,
  Check,
  X,
  ExternalLink,
  Lightbulb,
  Zap,
  Cpu,
  Settings,
  Home,
  List,
  Star,
  ThumbsUp,
  ThumbsDown,
  Copy,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
  Command,
  Github,
  Mail,
  Send,
  FileText,
  Info,
  ShieldCheck,
  Layers,
  Code2,
  PlayCircle,
  Bookmark,
  Bell,
  Plus,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// 帮助分类类型
type HelpCategory = 'home' | 'quickstart' | 'features' | 'faq' | 'shortcuts' | 'commands' | 'troubleshoot' | 'videos' | 'changelog' | 'feedback'

// 侧边栏导航项
const navItems: { id: HelpCategory; label: string; icon: typeof BookOpen; desc: string }[] = [
  { id: 'home', label: '帮助首页', icon: Home, desc: '搜索与热门主题' },
  { id: 'quickstart', label: '快速入门', icon: Rocket, desc: '5 步上手指南' },
  { id: 'features', label: '功能文档', icon: BookOpen, desc: '各模块详解' },
  { id: 'faq', label: '常见问题', icon: HelpCircle, desc: '30+ FAQ' },
  { id: 'shortcuts', label: '键盘快捷键', icon: Keyboard, desc: '效率操作' },
  { id: 'commands', label: '命令列表', icon: Terminal, desc: '35+ 命令' },
  { id: 'troubleshoot', label: '故障排除', icon: AlertTriangle, desc: '问题解决方案' },
  { id: 'videos', label: '视频教程', icon: Video, desc: '视频教程合集' },
  { id: 'changelog', label: '更新日志', icon: RefreshCw, desc: '版本历史' },
  { id: 'feedback', label: '反馈建议', icon: MessageCircle, desc: '提交反馈' },
]

// 热门主题
const hotTopics = [
  { title: '如何创建自定义 Agent', category: 'Agent', views: '12.3k', icon: Brain },
  { title: '知识库 RAG 检索原理', category: '知识库', views: '9.8k', icon: Database },
  { title: '工作流条件分支配置', category: '工作流', views: '8.5k', icon: GitBranch },
  { title: 'API Key 配置与限流', category: '开发', views: '7.2k', icon: Code2 },
  { title: '主题自定义与配色', category: '主题', views: '6.4k', icon: Palette },
  { title: '插件开发入门', category: '插件', views: '5.9k', icon: Wrench },
]

// 快速入门步骤
const quickstartSteps = [
  {
    step: 1, title: '创建你的第一个对话', icon: MessageSquare, time: '1 分钟',
    desc: '点击左侧「新建对话」按钮，输入你的问题，HopeAgent 会自动选择合适的 Agent 进行回复。',
    tips: ['试试问："帮我写一个 React 组件"', '使用 / 唤起命令菜单', '可上传文件作为上下文'],
  },
  {
    step: 2, title: '配置 LLM API 密钥', icon: Settings, time: '2 分钟',
    desc: '前往「设置 → LLM 配置」，填入你的 OpenAI / Anthropic / 其他兼容服务的 API Key，即可启用智能对话。',
    tips: ['支持多家服务商', '本地部署可填 Base URL', '建议设置 Token 上限'],
  },
  {
    step: 3, title: '探索 33 个内置 Agent', icon: Brain, time: '3 分钟',
    desc: '访问「Agent 大脑」模块，查看每个 Agent 的专长。你也可以指定使用某个 Agent，或在对话中切换。',
    tips: ['代码架构师适合编程问题', '数据工程师擅长数据分析', '创意设计师激发灵感'],
  },
  {
    step: 4, title: '构建你的知识库', icon: Database, time: '5 分钟',
    desc: '在「知识库」中添加条目，HopeAgent 会基于向量检索自动引用。支持手动添加、导入 Markdown、自动学习。',
    tips: ['语义检索需先启用 Embeddings', '标签便于分类管理', '重要度影响检索权重'],
  },
  {
    step: 5, title: '使用工具与工作流', icon: GitBranch, time: '5 分钟',
    desc: '尝试「代码沙箱」执行代码，「工作流」编排多步骤任务，「思维导图」梳理思路。组合使用解锁全部潜能。',
    tips: ['工作流支持条件分支', '代码沙箱隔离运行', '思维导图可 AI 生成'],
  },
]

// 功能模块文档
const featureDocs = [
  {
    id: 'chat', name: '对话系统', icon: MessageSquare, color: '#00ff88',
    desc: '多 Agent 协作的智能对话核心',
    sections: [
      { title: '基础对话', content: '在输入框输入问题，回车发送。支持 Markdown 格式渲染、代码高亮、表格、列表等。长按消息可复制或重新生成。' },
      { title: '多 Agent 协作', content: '默认由「调度官」自动路由到合适的 Agent。也可手动指定 Agent（点击 Agent 头像切换），或在消息中 @某个 Agent。' },
      { title: '思考过程', content: '开启「思维链」可见后，可查看 Agent 的观察、思考、计划、行动、反思 5 个步骤，了解推理过程。' },
      { title: '上下文管理', content: '对话自动保留最近 20 条消息作为上下文。可使用 /clear 清空，或使用 /pin 固定关键消息。' },
    ],
  },
  {
    id: 'agent', name: 'Agent 大脑', icon: Brain, color: '#00d4ff',
    desc: '33 个专业 Agent 与自定义 Agent',
    sections: [
      { title: '内置 Agent', content: '包含代码架构师、产品经理、数据工程师、语言专家、办公助手、创意设计师、测试工程师、运维专家等 33 个专业角色。' },
      { title: '自定义 Agent', content: '前往「Agent 构建器」创建自定义 Agent，配置系统提示词、技能列表、可用工具、温度等参数。可导出分享。' },
      { title: 'Agent 协作模式', content: '支持串行（接力）、并行（多 Agent 同时响应后合并）、投票（多 Agent 投票选择最佳答案）三种模式。' },
      { title: 'Agent 记忆', content: 'Agent 可记忆跨对话的关键信息，存储在知识库中。可在设置中开启或关闭自动学习。' },
    ],
  },
  {
    id: 'knowledge', name: '知识库', icon: Database, color: '#c084fc',
    desc: '基于 RAG 的智能知识管理',
    sections: [
      { title: '知识录入', content: '支持手动添加、Markdown 导入、网页抓取、文件上传（PDF/Word/TXT）。自动提取关键信息并生成摘要。' },
      { title: '语义检索', content: '基于向量嵌入的语义检索，无需精确匹配关键词。需先在设置中启用 Embeddings 模型（本地或 API）。' },
      { title: '自动学习', content: '开启后，对话中的重要信息会自动入库。可设置重要度阈值，低于阈值的不入库。' },
      { title: '知识图谱', content: '可视化展示知识间的关联关系，支持节点点击跳转、关系筛选、图谱导出。' },
    ],
  },
  {
    id: 'tools', name: '工具系统', icon: Wrench, color: '#fbbf24',
    desc: '27 个内置工具与自定义工具',
    sections: [
      { title: '内置工具', content: 'Web 搜索、代码执行、文件操作、数据处理、图片生成、邮件发送、API 调用等 27 种工具，覆盖常见场景。' },
      { title: '工具调用', content: 'Agent 会根据需要自动调用工具。也可在消息中使用 !工具名 参数 显式调用，例如 !search "AI 趋势"。' },
      { title: 'MCP 协议', content: '支持 Model Context Protocol，可接入外部 MCP 服务器扩展工具能力，如数据库查询、企业系统对接等。' },
      { title: '自定义工具', content: '通过 TypeScript / JavaScript 编写自定义工具，定义输入输出 schema，注册后即可被 Agent 调用。' },
    ],
  },
  {
    id: 'workflow', name: '工作流', icon: GitBranch, color: '#34d399',
    desc: '可视化多步骤任务编排',
    sections: [
      { title: '节点类型', content: '支持对话节点、条件分支、循环、并行、工具调用、代码执行、HTTP 请求、人工审批等多种节点。' },
      { title: '触发方式', content: '手动触发、定时触发（Cron）、Webhook 触发、事件触发（如新消息、知识更新）。' },
      { title: '变量传递', content: '节点间通过变量传递数据，使用 {{变量名}} 语法引用。支持 JSON Path 提取嵌套字段。' },
      { title: '调试与日志', content: '单步调试查看每节点输入输出，运行日志保留 30 天，可导出分析。' },
    ],
  },
  {
    id: 'theme', name: '主题与外观', icon: Palette, color: '#f472b6',
    desc: '深度可定制的赛博风格',
    sections: [
      { title: '内置主题', content: '提供赛博暗黑、赛博蓝调、霓虹紫、矩阵绿、日落橙等 5 种主题，一键切换。' },
      { title: '字号与间距', content: '可在设置中调整全局字号（小/中/大/超大），影响所有文本与组件间距。' },
      { title: '动效强度', content: '可调节粒子背景、扫描线、脉冲光效等动效强度，低端设备建议关闭以提升性能。' },
      { title: '自定义 CSS', content: '高级用户可在设置中注入自定义 CSS，覆盖任意样式。支持导出导入主题配置。' },
    ],
  },
]

// FAQ 列表
const faqList = [
  { q: 'HopeAgent 是免费的吗？', a: 'HopeAgent 提供免费版与付费版。免费版包含基础对话、5 个 Agent、有限知识库；付费版解锁全部 33 个 Agent、无限对话、优先支持。', category: '账户' },
  { q: '如何配置 OpenAI API Key？', a: '前往「设置 → LLM 配置」，选择服务商为 OpenAI，填入 API Key（sk-开头），选择模型（如 gpt-4o），点击保存即可。', category: '配置' },
  { q: '支持哪些 LLM 服务商？', a: '支持 OpenAI、Anthropic Claude、Google Gemini、Azure OpenAI、Moonshot Kimi、智谱 GLM、通义千问、DeepSeek，以及任何 OpenAI 兼容接口。', category: '配置' },
  { q: '可以本地部署吗？', a: '可以。前端为静态资源，后端可选 Node.js。LLM 可对接本地 Ollama / vLLM / LM Studio 等。知识库向量模型支持本地 transformers.js。', category: '部署' },
  { q: '对话数据存储在哪里？', a: '默认存储在浏览器 IndexedDB，不上传服务器。如启用后端，则同步到服务器数据库。所有数据均可导出删除。', category: '隐私' },
  { q: '如何启用语义检索？', a: '在「设置 → 知识库」中点击「启用 Embeddings」，首次会下载约 80MB 的本地模型。也可配置远程 Embedding API。', category: '知识库' },
  { q: 'Agent 会记忆我的信息吗？', a: '默认开启自动学习，对话中的重要信息会入库。可在「设置 → Agent」关闭。也可在个人中心管理已记忆的内容。', category: '隐私' },
  { q: '如何创建自定义 Agent？', a: '前往「Agent 构建器」，点击新建，填写名称、角色、系统提示词、技能、可用工具，调整温度等参数，保存即可使用。', category: 'Agent' },
  { q: '工作流支持哪些触发方式？', a: '支持手动触发、定时触发（Cron 表达式）、Webhook 触发、事件触发（新消息、知识更新、文件上传等）。', category: '工作流' },
  { q: '代码沙箱安全吗？', a: '代码在 WebAssembly 沙箱中隔离执行，无法访问文件系统与网络（除非显式授权）。内存与 CPU 限制防止滥用。', category: '安全' },
  { q: '如何分享对话？', a: '在对话页面点击分享按钮，生成只读链接。也可导出为 Markdown / PNG / PDF。分享内容不含敏感配置。', category: '对话' },
  { q: 'API 调用频率限制是多少？', a: '免费版 60 次/分钟，付费版 600 次/分钟，企业版可自定义。超限返回 429 状态码，建议实现指数退避重试。', category: 'API' },
  { q: '支持哪些文件格式？', a: '上传支持 PDF、Word、Excel、PPT、TXT、Markdown、CSV、JSON、图片。代码文件支持语法高亮预览。', category: '文件' },
  { q: '如何使用 MCP 协议？', a: '在「设置 → 工具 → MCP」中添加 MCP 服务器地址，HopeAgent 会自动发现可用工具并接入。', category: '工具' },
  { q: '思维导图如何 AI 生成？', a: '在思维导图模块输入主题，选择「AI 生成」，Agent 会基于知识库与对话生成结构化思维导图，可二次编辑。', category: '功能' },
  { q: '插件如何安装？', a: '前往「插件市场」浏览或搜索插件，点击安装。插件会请求权限，确认后即可使用。可在设置中管理已安装插件。', category: '插件' },
  { q: '如何导出我的数据？', a: '在「个人中心 → 账号操作 → 导出数据」，选择导出内容（对话、知识、配置等），生成 JSON 包下载。', category: '数据' },
  { q: '会员到期后会怎样？', a: '会员到期后降级为免费版，已创建的内容保留，但无法使用付费功能（如高级 Agent、工作流等）。续费后恢复。', category: '账户' },
  { q: '如何反馈问题或建议？', a: '可通过「帮助 → 反馈建议」提交，或发送邮件至 feedback@hopeagent.pro。我们会尽快回复。', category: '支持' },
  { q: '支持团队协作吗？', a: '企业版支持团队协作，包括共享知识库、协同编辑工作流、权限管理、审计日志等。', category: '团队' },
  { q: '移动端有 App 吗？', a: '目前为响应式 Web 应用，适配手机浏览器。原生 App（iOS/Android）正在开发中，预计 2026 Q4 发布。', category: '平台' },
  { q: '如何切换语言？', a: '在「个人中心 → 偏好设置 → 语言」中切换。支持简中、繁中、英语、日语、韩语、法语。', category: '设置' },
  { q: '暗黑模式可以关闭吗？', a: 'HopeAgent 默认为赛博暗黑风格，可在「个人中心 → 偏好 → 主题」选择浅色或跟随系统。', category: '主题' },
  { q: '如何删除账号？', a: '在「个人中心 → 账号操作 → 注销账号」，输入 DELETE 确认。操作不可逆，所有数据将永久删除。', category: '账户' },
  { q: '对话可以搜索吗？', a: '可以。在侧边栏对话列表上方有搜索框，支持按标题与内容搜索。也可使用 /search 命令。', category: '对话' },
  { q: '知识库支持多人协作吗？', a: '企业版支持共享知识库，多人可同时编辑。个人版知识库为私有，可通过导出分享。', category: '知识库' },
  { q: 'Agent 调用工具失败怎么办？', a: '检查工具配置（如 API Key）、网络连接、参数格式。查看「思维链」中的错误信息。可重试或换用其他工具。', category: '故障' },
  { q: '如何备份配置？', a: '在「设置 → 高级 → 导出配置」生成 JSON 文件，包含所有设置但不含密钥。可在新设备导入。', category: '设置' },
  { q: '支持语音输入吗？', a: '支持。点击输入框旁的麦克风图标，使用浏览器 Web Speech API 识别语音。需授予麦克风权限。', category: '功能' },
  { q: '如何举报不当内容？', a: '在对话或消息中点击举报按钮，选择举报理由。我们会人工审核并处理。', category: '社区' },
  { q: '商业使用有什么限制？', a: '免费版可用于商业用途但需保留署名。付费版无限制。企业版提供 SLA 保障与优先支持。', category: '许可' },
]

// 键盘快捷键
const shortcuts = [
  { keys: ['Ctrl', 'K'], desc: '打开命令面板', category: '全局' },
  { keys: ['Ctrl', 'B'], desc: '切换侧边栏', category: '全局' },
  { keys: ['Ctrl', '/'], desc: '显示快捷键', category: '全局' },
  { keys: ['Ctrl', 'N'], desc: '新建对话', category: '对话' },
  { keys: ['Ctrl', 'Enter'], desc: '发送消息', category: '对话' },
  { keys: ['Shift', 'Enter'], desc: '换行输入', category: '对话' },
  { keys: ['Ctrl', 'L'], desc: '清空当前对话', category: '对话' },
  { keys: ['Ctrl', 'F'], desc: '搜索对话', category: '对话' },
  { keys: ['↑'], desc: '编辑上一条消息', category: '对话' },
  { keys: ['↓'], desc: '取消编辑', category: '对话' },
  { keys: ['/'], desc: '唤起命令菜单', category: '命令' },
  { keys: ['@'], desc: '提及 Agent', category: '命令' },
  { keys: ['!'], desc: '调用工具', category: '命令' },
  { keys: ['#'], desc: '引用知识', category: '命令' },
  { keys: ['Esc'], desc: '关闭弹窗 / 取消', category: '全局' },
  { keys: ['Tab'], desc: '自动补全', category: '命令' },
  { keys: ['Ctrl', 'S'], desc: '保存当前编辑', category: '编辑' },
  { keys: ['Ctrl', 'Z'], desc: '撤销', category: '编辑' },
  { keys: ['Ctrl', 'Shift', 'Z'], desc: '重做', category: '编辑' },
  { keys: ['Ctrl', 'D'], desc: '收藏当前对话', category: '对话' },
  { keys: ['Ctrl', 'E'], desc: '导出对话', category: '对话' },
  { keys: ['Ctrl', 'P'], desc: '打印对话', category: '对话' },
  { keys: ['Ctrl', 'M'], desc: '切换 Agent', category: '对话' },
  { keys: ['Ctrl', 'G'], desc: '生成思维导图', category: '功能' },
  { keys: ['Ctrl', 'W'], desc: '关闭当前 Tab', category: '全局' },
  { keys: ['Alt', '1-9'], desc: '切换到第 N 个 Tab', category: '全局' },
  { keys: ['F1'], desc: '打开帮助', category: '全局' },
  { keys: ['F11'], desc: '全屏切换', category: '全局' },
  { keys: ['Ctrl', '+'], desc: '放大字号', category: '视图' },
  { keys: ['Ctrl', '-'], desc: '缩小字号', category: '视图' },
  { keys: ['Ctrl', '0'], desc: '重置字号', category: '视图' },
]

// 命令列表
const commands = [
  { cmd: '/new', desc: '新建对话', args: '[标题]', example: '/new React 项目' },
  { cmd: '/clear', desc: '清空当前对话', args: '', example: '/clear' },
  { cmd: '/agent', desc: '切换或查看 Agent', args: '[Agent名]', example: '/agent 代码架构师' },
  { cmd: '/search', desc: '搜索对话或知识', args: '<关键词>', example: '/search React Hooks' },
  { cmd: '/knowledge', desc: '添加知识条目', args: '<内容>', example: '/knowledge TypeScript 最佳实践' },
  { cmd: '/tool', desc: '调用工具', args: '<工具名> [参数]', example: '/tool web-search "AI 趋势"' },
  { cmd: '/workflow', desc: '运行工作流', args: '<工作流名>', example: '/workflow 日报生成' },
  { cmd: '/export', desc: '导出对话', args: '[格式]', example: '/export markdown' },
  { cmd: '/share', desc: '分享对话', args: '', example: '/share' },
  { cmd: '/summarize', desc: '总结当前对话', args: '', example: '/summarize' },
  { cmd: '/translate', desc: '翻译消息', args: '<语言>', example: '/translate English' },
  { cmd: '/code', desc: '生成并执行代码', args: '<描述>', example: '/code 计算斐波那契数列' },
  { cmd: '/mindmap', desc: '生成思维导图', args: '<主题>', example: '/mindmap React 状态管理' },
  { cmd: '/image', desc: '生成图片', args: '<描述>', example: '/image 赛博朋克城市' },
  { cmd: '/file', desc: '上传文件', args: '', example: '/file' },
  { cmd: '/voice', desc: '语音输入', args: '', example: '/voice' },
  { cmd: '/tts', desc: '文本转语音', args: '', example: '/tts' },
  { cmd: '/pin', desc: '固定消息', args: '', example: '/pin' },
  { cmd: '/copy', desc: '复制最后一条回复', args: '', example: '/copy' },
  { cmd: '/regenerate', desc: '重新生成回复', args: '', example: '/regenerate' },
  { cmd: '/stop', desc: '停止生成', args: '', example: '/stop' },
  { cmd: '/theme', desc: '切换主题', args: '<主题名>', example: '/theme neon-purple' },
  { cmd: '/font', desc: '调整字号', args: '<小|中|大>', example: '/font 大' },
  { cmd: '/settings', desc: '打开设置', args: '', example: '/settings' },
  { cmd: '/help', desc: '打开帮助', args: '', example: '/help' },
  { cmd: '/profile', desc: '打开个人中心', args: '', example: '/profile' },
  { cmd: '/notifications', desc: '查看通知', args: '', example: '/notifications' },
  { cmd: '/about', desc: '关于 HopeAgent', args: '', example: '/about' },
  { cmd: '/feedback', desc: '提交反馈', args: '', example: '/feedback' },
  { cmd: '/shortcuts', desc: '查看快捷键', args: '', example: '/shortcuts' },
  { cmd: '/history', desc: '查看历史记录', args: '[数量]', example: '/history 10' },
  { cmd: '/bookmark', desc: '收藏当前对话', args: '', example: '/bookmark' },
  { cmd: '/archive', desc: '归档对话', args: '', example: '/archive' },
  { cmd: '/tags', desc: '管理标签', args: '[add|remove] [标签]', example: '/tags add 重要' },
  { cmd: '/stats', desc: '查看使用统计', args: '', example: '/stats' },
  { cmd: '/api', desc: '查看 API 文档', args: '', example: '/api' },
  { cmd: '/mcp', desc: '管理 MCP 服务器', args: '[list|add|remove]', example: '/mcp list' },
]

// 故障排除条目
const troubleshootItems = [
  {
    problem: '无法连接到 LLM 服务',
    solutions: [
      '检查 API Key 是否正确（在「设置 → LLM 配置」）',
      '确认 Base URL 是否正确（如使用代理）',
      '检查网络是否能访问服务商域名',
      '查看浏览器控制台是否有 CORS 错误',
      '尝试切换到其他模型或服务商',
    ],
  },
  {
    problem: '语义检索不工作',
    solutions: [
      '确认已在「设置 → 知识库」启用 Embeddings',
      '首次启用需下载约 80MB 模型，请耐心等待',
      '检查浏览器是否支持 WebAssembly',
      '尝试使用远程 Embedding API 替代本地模型',
      '清除浏览器缓存后重新启用',
    ],
  },
  {
    problem: 'Agent 回复质量差',
    solutions: [
      '尝试切换到更强大的模型（如 GPT-4o / Claude 3.5）',
      '调整温度参数（事实性问题用 0.3，创意用 0.9）',
      '提供更清晰的上下文与示例',
      '指定专门的 Agent 而非使用调度官',
      '在系统提示词中明确要求与限制',
    ],
  },
  {
    problem: '页面加载缓慢',
    solutions: [
      '关闭动效（「设置 → 外观 → 动效强度」设为关闭）',
      '清理浏览器缓存与 IndexedDB',
      '禁用不常用的插件',
      '减少知识库条目数量（归档旧条目）',
      '使用 Chrome / Edge 等 Chromium 浏览器',
    ],
  },
  {
    problem: '代码沙箱执行失败',
    solutions: [
      '检查代码语法是否正确',
      '确认代码不依赖外部网络（沙箱默认禁网）',
      '减少内存使用（沙箱限制 256MB）',
      '避免无限循环（沙箱限制 10 秒）',
      '查看「思维链」中的具体错误信息',
    ],
  },
  {
    problem: '工作流执行超时',
    solutions: [
      '检查是否有死循环或长时间等待',
      '优化节点逻辑，减少不必要的调用',
      '增加超时时间设置（默认 5 分钟）',
      '拆分为多个小工作流',
      '查看执行日志定位瓶颈节点',
    ],
  },
  {
    problem: '数据丢失',
    solutions: [
      '检查是否切换了浏览器或设备',
      '查看是否启用了后端同步（本地模式数据不跨设备）',
      '检查浏览器是否清除了站点数据',
      '如有导出备份，可导入恢复',
      '联系客服尝试从服务器恢复（如启用后端）',
    ],
  },
  {
    problem: '插件无法安装',
    solutions: [
      '检查插件版本是否与当前 HopeAgent 兼容',
      '确认网络能访问插件市场',
      '查看浏览器控制台错误信息',
      '尝试禁用其他插件后重装',
      '联系插件作者获取支持',
    ],
  },
]

// 视频教程
const videoTutorials = [
  { id: 'v1', title: '5 分钟快速上手 HopeAgent', duration: '5:12', views: '45.2k', level: '入门', icon: Rocket },
  { id: 'v2', title: 'Agent 大脑完全指南', duration: '12:34', views: '32.1k', level: '进阶', icon: Brain },
  { id: 'v3', title: '知识库与 RAG 实战', duration: '18:45', views: '28.7k', level: '进阶', icon: Database },
  { id: 'v4', title: '工作流编排技巧', duration: '22:10', views: '21.3k', level: '高级', icon: GitBranch },
  { id: 'v5', title: '插件开发从 0 到 1', duration: '15:28', views: '18.9k', level: '高级', icon: Wrench },
  { id: 'v6', title: 'API 集成最佳实践', duration: '10:55', views: '16.4k', level: '进阶', icon: Code2 },
  { id: 'v7', title: '主题定制与美化', duration: '8:20', views: '14.2k', level: '入门', icon: Palette },
  { id: 'v8', title: '团队协作功能详解', duration: '14:42', views: '11.8k', level: '高级', icon: Layers },
]

// 更新日志
const changelog = [
  {
    version: 'v3.0.0', date: '2026-07-01', type: 'major',
    changes: [
      '全新 Agent 大脑模块，支持多 Agent 协作',
      '新增工作流引擎，可视化编排',
      '思维导图功能上线，支持 AI 生成',
      '代码沙箱隔离执行环境',
      '插件市场正式开放',
      'MCP 协议支持',
      'UI 全面升级为赛博风格',
    ],
  },
  {
    version: 'v2.5.0', date: '2026-04-15', type: 'minor',
    changes: [
      '新增 8 个专业 Agent',
      '知识库支持自动学习',
      '对话支持语音输入与 TTS',
      '优化语义检索性能',
      '修复多个已知问题',
    ],
  },
  {
    version: 'v2.0.0', date: '2026-01-10', type: 'major',
    changes: [
      'HopeAgent Pro 正式发布',
      '后端服务可选部署',
      'API 接口对外开放',
      '数据分析仪表盘',
      '模板中心上线',
    ],
  },
  {
    version: 'v1.5.0', date: '2025-09-20', type: 'minor',
    changes: [
      '新增知识图谱可视化',
      '支持 Markdown 导入',
      '优化移动端体验',
      '新增 3 种主题',
    ],
  },
  {
    version: 'v1.0.0', date: '2025-03-01', type: 'major',
    changes: [
      'HopeAgent 首次发布',
      '基础对话功能',
      '5 个内置 Agent',
      '知识库管理',
      '10 个实用工具',
    ],
  },
]

export default function HelpPage() {
  const [activeNav, setActiveNav] = useState<HelpCategory>('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)
  const [expandedFeature, setExpandedFeature] = useState<string>('chat')
  const [expandedTrouble, setExpandedTrouble] = useState<number | null>(0)
  const [expandedVersion, setExpandedVersion] = useState<string>('v3.0.0')
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'other'>('feature')
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackSent, setFeedbackSent] = useState(false)
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, 'up' | 'down' | null>>({})

  // 搜索过滤 FAQ
  const filteredFaqs = useMemo(() => {
    if (!searchQuery) return faqList
    const q = searchQuery.toLowerCase()
    return faqList.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q))
  }, [searchQuery])

  // 搜索过滤命令
  const filteredCommands = useMemo(() => {
    if (!searchQuery) return commands
    const q = searchQuery.toLowerCase()
    return commands.filter(c => c.cmd.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q))
  }, [searchQuery])

  // 渲染帮助首页
  const renderHome = () => (
    <div className="space-y-4">
      {/* 搜索框 */}
      <div className="bg-gradient-to-br from-cyber-accent/10 to-cyber-accent2/10 border border-cyber-accent/30 rounded-xl p-5">
        <h2 className="text-base font-bold text-cyber-text mb-1 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-cyber-accent" />
          需要什么帮助？
        </h2>
        <p className="text-xs text-gray-400 mb-3">搜索文档、FAQ、命令，或浏览下方分类</p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="输入关键词搜索..."
            className="w-full bg-cyber-bg/60 border border-cyber-border focus:border-cyber-accent outline-none rounded-lg pl-10 pr-4 py-3 text-sm text-cyber-text"
          />
        </div>
      </div>

      {/* 搜索结果 */}
      {searchQuery && (
        <div className="space-y-3">
          {filteredFaqs.length > 0 && (
            <div>
              <h3 className="text-xs font-mono text-gray-400 uppercase mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                FAQ ({filteredFaqs.length})
              </h3>
              <div className="space-y-1.5">
                {filteredFaqs.slice(0, 5).map(faq => (
                  <button
                    key={faq.q}
                    onClick={() => { setActiveNav('faq'); setExpandedFaq(faq.q) }}
                    className="w-full text-left p-3 rounded-lg bg-cyber-panel/50 border border-cyber-border/40 hover:border-cyber-accent/30 transition-all"
                  >
                    <p className="text-sm text-cyber-text">{faq.q}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{faq.a}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
          {filteredCommands.length > 0 && filteredCommands.length < commands.length && (
            <div>
              <h3 className="text-xs font-mono text-gray-400 uppercase mb-2 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                命令 ({filteredCommands.length})
              </h3>
              <div className="space-y-1.5">
                {filteredCommands.slice(0, 5).map(cmd => (
                  <div key={cmd.cmd} className="p-3 rounded-lg bg-cyber-panel/50 border border-cyber-border/40">
                    <code className="text-sm text-cyber-accent font-mono">{cmd.cmd}</code>
                    <span className="text-xs text-gray-400 ml-2">{cmd.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 热门主题 */}
      {!searchQuery && (
        <>
          <div>
            <h3 className="text-xs font-mono text-gray-400 uppercase mb-2 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-yellow-400" />
              热门主题
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {hotTopics.map(topic => {
                const Icon = topic.icon
                return (
                  <button
                    key={topic.title}
                    className="flex items-center gap-3 p-3 rounded-lg bg-cyber-panel/50 border border-cyber-border/40 hover:border-cyber-accent/30 transition-all text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-cyber-accent/10 border border-cyber-accent/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-cyber-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-cyber-text truncate">{topic.title}</p>
                      <p className="text-[10px] text-gray-500 font-mono">{topic.category} · {topic.views} 次浏览</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
                  </button>
                )
              })}
            </div>
          </div>

          {/* 分类入口 */}
          <div>
            <h3 className="text-xs font-mono text-gray-400 uppercase mb-2 flex items-center gap-1.5">
              <List className="w-3.5 h-3.5" />
              浏览分类
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {navItems.filter(n => n.id !== 'home').map(item => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveNav(item.id)}
                    className="flex flex-col items-start gap-1 p-3 rounded-lg bg-cyber-panel/50 border border-cyber-border/40 hover:border-cyber-accent/30 transition-all text-left"
                  >
                    <Icon className="w-4 h-4 text-cyber-accent" />
                    <span className="text-xs text-cyber-text font-bold">{item.label}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{item.desc}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )

  // 渲染快速入门
  const renderQuickstart = () => (
    <div className="space-y-3">
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h2 className="text-base font-bold text-cyber-text flex items-center gap-2 mb-1">
          <Rocket className="w-5 h-5 text-cyber-accent" />
          5 步快速上手
        </h2>
        <p className="text-xs text-gray-400">预计耗时 15 分钟，跟随步骤即可掌握 HopeAgent 核心功能</p>
      </div>

      {quickstartSteps.map((step, idx) => {
        const Icon = step.icon
        return (
          <div key={step.step} className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
            <div className="flex items-start gap-3">
              {/* 步骤号 */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyber-accent/30 to-cyber-accent2/30 border-2 border-cyber-accent flex items-center justify-center font-bold text-cyber-accent">
                  {step.step}
                </div>
                {idx < quickstartSteps.length - 1 && (
                  <div className="w-px h-12 bg-cyber-border mt-2" />
                )}
              </div>
              {/* 内容 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4 text-cyber-accent2" />
                  <h3 className="text-sm font-bold text-cyber-text">{step.title}</h3>
                  <span className="ml-auto px-2 py-0.5 rounded-full bg-white/[0.03] text-[10px] font-mono text-gray-400 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {step.time}
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed mb-2">{step.desc}</p>
                <div className="space-y-1">
                  {step.tips.map(tip => (
                    <div key={tip} className="flex items-start gap-1.5 text-[11px] text-gray-500">
                      <Lightbulb className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )

  // 渲染功能文档
  const renderFeatures = () => (
    <div className="space-y-3">
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h2 className="text-base font-bold text-cyber-text flex items-center gap-2 mb-1">
          <BookOpen className="w-5 h-5 text-cyber-accent" />
          功能文档
        </h2>
        <p className="text-xs text-gray-400">各模块详细使用说明</p>
      </div>

      {featureDocs.map(feature => {
        const Icon = feature.icon
        const isExpanded = expandedFeature === feature.id
        return (
          <div key={feature.id} className="bg-cyber-panel/50 border border-cyber-border rounded-xl overflow-hidden">
            <button
              onClick={() => setExpandedFeature(isExpanded ? '' : feature.id)}
              className="w-full flex items-center gap-3 p-4 hover:bg-white/[0.02] transition-colors text-left"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${feature.color}15`, border: `1px solid ${feature.color}30` }}
              >
                <Icon className="w-5 h-5" style={{ color: feature.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-cyber-text">{feature.name}</h3>
                <p className="text-[11px] text-gray-500">{feature.desc}</p>
              </div>
              {isExpanded
                ? <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                : <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />}
            </button>
            {isExpanded && (
              <div className="px-4 pb-4 space-y-3 border-t border-cyber-border/30 pt-3">
                {feature.sections.map(section => (
                  <div key={section.title}>
                    <h4 className="text-xs font-mono text-cyber-accent2 uppercase mb-1">{section.title}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{section.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )

  // 渲染 FAQ
  const renderFaq = () => (
    <div className="space-y-3">
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h2 className="text-base font-bold text-cyber-text flex items-center gap-2 mb-1">
          <HelpCircle className="w-5 h-5 text-cyber-accent" />
          常见问题
        </h2>
        <p className="text-xs text-gray-400 mb-3">共 {faqList.length} 条 FAQ</p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="搜索问题..."
            className="w-full bg-white/[0.02] border border-cyber-border focus:border-cyber-accent outline-none rounded-lg pl-9 pr-3 py-2 text-sm text-cyber-text"
          />
        </div>
      </div>

      <div className="space-y-2">
        {filteredFaqs.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-8">未找到相关问题</p>
        ) : (
          filteredFaqs.map(faq => {
            const isExpanded = expandedFaq === faq.q
            return (
              <div key={faq.q} className="bg-cyber-panel/50 border border-cyber-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : faq.q)}
                  className="w-full flex items-start gap-3 p-3 hover:bg-white/[0.02] transition-colors text-left"
                >
                  {isExpanded
                    ? <ChevronDown className="w-4 h-4 text-cyber-accent mt-0.5 flex-shrink-0" />
                    : <ChevronRight className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm text-cyber-text font-medium">{faq.q}</span>
                      <span className="px-1.5 py-0.5 rounded bg-white/[0.03] text-[9px] font-mono text-gray-500 flex-shrink-0">
                        {faq.category}
                      </span>
                    </div>
                    {isExpanded && (
                      <p className="text-xs text-gray-400 leading-relaxed mt-2">{faq.a}</p>
                    )}
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-3 pb-3 pt-1 flex items-center gap-2 border-t border-cyber-border/20 mt-2 ml-7">
                    <span className="text-[10px] text-gray-600 font-mono">是否有帮助？</span>
                    <button
                      onClick={() => setHelpfulVotes({ ...helpfulVotes, [faq.q]: 'up' })}
                      className={cn(
                        'p-1 rounded transition-colors',
                        helpfulVotes[faq.q] === 'up' ? 'text-cyber-accent bg-cyber-accent/10' : 'text-gray-500 hover:text-cyber-accent'
                      )}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setHelpfulVotes({ ...helpfulVotes, [faq.q]: 'down' })}
                      className={cn(
                        'p-1 rounded transition-colors',
                        helpfulVotes[faq.q] === 'down' ? 'text-red-400 bg-red-500/10' : 'text-gray-500 hover:text-red-400'
                      )}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )

  // 渲染快捷键
  const renderShortcuts = () => {
    // 按类别分组
    const grouped = shortcuts.reduce((acc, s) => {
      if (!acc[s.category]) acc[s.category] = []
      acc[s.category].push(s)
      return acc
    }, {} as Record<string, typeof shortcuts>)

    return (
      <div className="space-y-3">
        <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
          <h2 className="text-base font-bold text-cyber-text flex items-center gap-2 mb-1">
            <Keyboard className="w-5 h-5 text-cyber-accent" />
            键盘快捷键
          </h2>
          <p className="text-xs text-gray-400">提升效率的快捷操作，共 {shortcuts.length} 个</p>
        </div>

        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-3">
            <h3 className="text-xs font-mono text-cyber-accent2 uppercase mb-2 px-1">{category}</h3>
            <div className="space-y-1">
              {items.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-white/[0.02]">
                  <span className="text-xs text-gray-300">{s.desc}</span>
                  <div className="flex items-center gap-1">
                    {s.keys.map((k, j) => (
                      <span key={j} className="flex items-center gap-1">
                        {j > 0 && <Plus className="w-2.5 h-2.5 text-gray-600" />}
                        <kbd className="px-2 py-0.5 rounded bg-white/[0.04] border border-cyber-border/50 text-[10px] font-mono text-cyber-accent">
                          {k}
                        </kbd>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // 渲染命令列表
  const renderCommands = () => (
    <div className="space-y-3">
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h2 className="text-base font-bold text-cyber-text flex items-center gap-2 mb-1">
          <Terminal className="w-5 h-5 text-cyber-accent" />
          命令列表
        </h2>
        <p className="text-xs text-gray-400 mb-3">在输入框输入 / 唤起命令菜单，共 {commands.length} 个命令</p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="搜索命令..."
            className="w-full bg-white/[0.02] border border-cyber-border focus:border-cyber-accent outline-none rounded-lg pl-9 pr-3 py-2 text-sm text-cyber-text"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        {filteredCommands.map(cmd => (
          <div key={cmd.cmd} className="bg-cyber-panel/50 border border-cyber-border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <code className="text-sm text-cyber-accent font-mono font-bold">{cmd.cmd}</code>
              {cmd.args && <code className="text-[11px] text-gray-500 font-mono">{cmd.args}</code>}
            </div>
            <p className="text-xs text-gray-400 mb-1">{cmd.desc}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[10px] text-gray-600 font-mono">示例:</span>
              <code className="text-[11px] text-cyber-accent2 font-mono bg-cyber-bg/50 px-1.5 py-0.5 rounded">
                {cmd.example}
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // 渲染故障排除
  const renderTroubleshoot = () => (
    <div className="space-y-3">
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h2 className="text-base font-bold text-cyber-text flex items-center gap-2 mb-1">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          故障排除
        </h2>
        <p className="text-xs text-gray-400">常见问题与解决方案，如未解决请联系客服</p>
      </div>

      {troubleshootItems.map((item, idx) => {
        const isExpanded = expandedTrouble === idx
        return (
          <div key={idx} className="bg-cyber-panel/50 border border-cyber-border rounded-xl overflow-hidden">
            <button
              onClick={() => setExpandedTrouble(isExpanded ? null : idx)}
              className="w-full flex items-center gap-3 p-3 hover:bg-white/[0.02] transition-colors text-left"
            >
              <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <span className="text-sm text-cyber-text flex-1">{item.problem}</span>
              {isExpanded
                ? <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                : <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />}
            </button>
            {isExpanded && (
              <div className="px-3 pb-3 pt-1 space-y-2">
                <p className="text-[10px] font-mono text-gray-500 uppercase">解决方案</p>
                {item.solutions.map((sol, j) => (
                  <div key={j} className="flex items-start gap-2 text-xs text-gray-400">
                    <span className="w-5 h-5 rounded-full bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent font-mono text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                      {j + 1}
                    </span>
                    <span className="leading-relaxed">{sol}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )

  // 渲染视频教程
  const renderVideos = () => (
    <div className="space-y-3">
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h2 className="text-base font-bold text-cyber-text flex items-center gap-2 mb-1">
          <Video className="w-5 h-5 text-cyber-accent" />
          视频教程
        </h2>
        <p className="text-xs text-gray-400">从入门到精通的视频合集</p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {videoTutorials.map(video => {
          const Icon = video.icon
          const levelColor = video.level === '入门' ? '#10b981' : video.level === '进阶' ? '#fbbf24' : '#ef4444'
          return (
            <button
              key={video.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-cyber-panel/50 border border-cyber-border/40 hover:border-cyber-accent/30 transition-all text-left"
            >
              <div className="relative w-16 h-12 rounded-lg bg-gradient-to-br from-cyber-accent/20 to-cyber-accent2/20 border border-cyber-accent/30 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-cyber-accent" />
                <PlayCircle className="absolute -bottom-1 -right-1 w-5 h-5 text-cyber-accent bg-cyber-bg rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-cyber-text truncate">{video.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="px-1.5 py-0.5 rounded text-[9px] font-mono"
                    style={{ background: `${levelColor}15`, color: levelColor }}
                  >
                    {video.level}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {video.duration}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">{video.views} 次观看</span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-600 flex-shrink-0" />
            </button>
          )
        })}
      </div>
    </div>
  )

  // 渲染更新日志
  const renderChangelog = () => (
    <div className="space-y-3">
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h2 className="text-base font-bold text-cyber-text flex items-center gap-2 mb-1">
          <RefreshCw className="w-5 h-5 text-cyber-accent" />
          更新日志
        </h2>
        <p className="text-xs text-gray-400">HopeAgent 版本历史与变更记录</p>
      </div>

      <div className="space-y-2">
        {changelog.map(ver => {
          const isExpanded = expandedVersion === ver.version
          const typeColor = ver.type === 'major' ? '#00ff88' : '#00d4ff'
          return (
            <div key={ver.version} className="bg-cyber-panel/50 border border-cyber-border rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedVersion(isExpanded ? '' : ver.version)}
                className="w-full flex items-center gap-3 p-3 hover:bg-white/[0.02] transition-colors text-left"
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: typeColor, boxShadow: `0 0 8px ${typeColor}` }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-cyber-text font-mono">{ver.version}</span>
                    <span
                      className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase"
                      style={{ background: `${typeColor}15`, color: typeColor }}
                    >
                      {ver.type}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">{ver.date}</p>
                </div>
                {isExpanded
                  ? <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  : <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />}
              </button>
              {isExpanded && (
                <div className="px-3 pb-3 pt-1 space-y-1.5">
                  {ver.changes.map((change, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-400">
                      <Check className="w-3 h-3 text-cyber-accent mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{change}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )

  // 渲染反馈
  const renderFeedback = () => (
    <div className="space-y-3">
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h2 className="text-base font-bold text-cyber-text flex items-center gap-2 mb-1">
          <MessageCircle className="w-5 h-5 text-cyber-accent" />
          反馈与建议
        </h2>
        <p className="text-xs text-gray-400">你的反馈是我们改进的动力</p>
      </div>

      {feedbackSent ? (
        <div className="bg-cyber-panel/50 border border-cyber-accent/30 rounded-xl p-6 text-center">
          <Check className="w-10 h-10 text-cyber-accent mx-auto mb-2" />
          <p className="text-sm text-cyber-text font-bold mb-1">反馈已提交</p>
          <p className="text-xs text-gray-400">感谢你的反馈，我们会尽快处理</p>
          <button
            onClick={() => { setFeedbackSent(false); setFeedbackText('') }}
            className="mt-3 px-4 py-1.5 rounded-lg bg-cyber-accent/15 border border-cyber-accent/30 text-cyber-accent text-xs font-mono hover:bg-cyber-accent/25 transition-all"
          >
            继续提交
          </button>
        </div>
      ) : (
        <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4 space-y-3">
          {/* 类型选择 */}
          <div>
            <label className="text-[10px] text-gray-500 font-mono uppercase mb-1.5 block">反馈类型</label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { key: 'bug' as const, label: '问题反馈', icon: AlertTriangle },
                { key: 'feature' as const, label: '功能建议', icon: Lightbulb },
                { key: 'other' as const, label: '其他', icon: MessageCircle },
              ]).map(t => {
                const Icon = t.icon
                return (
                  <button
                    key={t.key}
                    onClick={() => setFeedbackType(t.key)}
                    className={cn(
                      'flex flex-col items-center gap-1 py-2.5 rounded-lg text-xs font-mono transition-all',
                      feedbackType === t.key
                        ? 'bg-cyber-accent/15 border border-cyber-accent/30 text-cyber-accent'
                        : 'bg-white/[0.02] border border-cyber-border/50 text-gray-400 hover:border-cyber-accent/20'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {t.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 内容输入 */}
          <div>
            <label className="text-[10px] text-gray-500 font-mono uppercase mb-1.5 block">
              {feedbackType === 'bug' ? '问题描述' : feedbackType === 'feature' ? '建议内容' : '反馈内容'}
            </label>
            <textarea
              value={feedbackText}
              onChange={e => setFeedbackText(e.target.value)}
              rows={5}
              placeholder={
                feedbackType === 'bug'
                  ? '请详细描述问题现象、复现步骤、期望结果...'
                  : feedbackType === 'feature'
                  ? '描述你希望新增或改进的功能...'
                  : '告诉我们任何想法...'
              }
              className="w-full bg-white/[0.02] border border-cyber-border focus:border-cyber-accent outline-none rounded-lg px-3 py-2 text-sm text-cyber-text resize-none"
            />
          </div>

          {/* 联系方式 */}
          <div>
            <label className="text-[10px] text-gray-500 font-mono uppercase mb-1.5 block">联系方式（可选）</label>
            <input
              type="text"
              placeholder="邮箱或用户名，方便我们回复"
              className="w-full bg-white/[0.02] border border-cyber-border focus:border-cyber-accent outline-none rounded-lg px-3 py-2 text-sm text-cyber-text"
            />
          </div>

          {/* 提交 */}
          <button
            onClick={() => feedbackText.trim() && setFeedbackSent(true)}
            disabled={!feedbackText.trim()}
            className="w-full py-2.5 rounded-lg bg-cyber-accent/20 border border-cyber-accent/30 text-cyber-accent text-sm font-mono hover:bg-cyber-accent/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            提交反馈
          </button>

          {/* 其他渠道 */}
          <div className="pt-2 border-t border-cyber-border/30">
            <p className="text-[10px] text-gray-500 font-mono mb-2">其他联系方式</p>
            <div className="flex items-center gap-2">
              <a className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/[0.02] border border-cyber-border/50 text-xs text-gray-400 hover:border-cyber-accent/30 transition-all">
                <Mail className="w-3.5 h-3.5" />
                邮件
              </a>
              <a className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/[0.02] border border-cyber-border/50 text-xs text-gray-400 hover:border-cyber-accent/30 transition-all">
                <Github className="w-3.5 h-3.5" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // 渲染当前内容
  const renderContent = () => {
    switch (activeNav) {
      case 'home': return renderHome()
      case 'quickstart': return renderQuickstart()
      case 'features': return renderFeatures()
      case 'faq': return renderFaq()
      case 'shortcuts': return renderShortcuts()
      case 'commands': return renderCommands()
      case 'troubleshoot': return renderTroubleshoot()
      case 'videos': return renderVideos()
      case 'changelog': return renderChangelog()
      case 'feedback': return renderFeedback()
      default: return renderHome()
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* 顶部标题栏 */}
      <div className="border-b border-cyber-border bg-cyber-panel/50 px-4 py-3 flex-shrink-0">
        <h1 className="text-base font-bold text-cyber-text flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyber-accent" />
          帮助文档
        </h1>
        <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
          使用指南 · 常见问题 · 故障排除
        </p>
      </div>

      {/* 主体：左侧导航 + 右侧内容 */}
      <div className="flex-1 flex min-h-0">
        {/* 侧边导航 */}
        <div className="w-32 sm:w-40 border-r border-cyber-border/30 bg-cyber-bg/30 overflow-y-auto flex-shrink-0">
          <div className="p-2 space-y-0.5">
            {navItems.map(item => {
              const Icon = item.icon
              const isActive = activeNav === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveNav(item.id); setSearchQuery('') }}
                  className={cn(
                    'w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all',
                    isActive
                      ? 'bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/20'
                      : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'
                  )}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="text-xs truncate">{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto p-3">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
