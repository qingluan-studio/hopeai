import { useState } from 'react'
import {
  Info,
  Heart,
  Code2,
  Users,
  Calendar,
  Github,
  Star,
  FileText,
  Shield,
  Mail,
  Globe,
  Link2,
  RefreshCw,
  Award,
  Cpu,
  Database,
  Wrench,
  Brain,
  MessageSquare,
  GitBranch,
  Palette,
  Layers,
  Server,
  Cloud,
  Lock,
  Zap,
  Sparkles,
  Target,
  Rocket,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Coffee,
  ThumbsUp,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Terminal,
  Network,
  Activity,
  Boxes,
  Fingerprint,
  Crown,
  AlertTriangle,
  Key,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import BrandAvatar, { BrandWordmark } from '@/components/BrandAvatar'

// 关于页面 Tab
type AboutTab = 'story' | 'tech' | 'team' | 'milestone' | 'stats' | 'license' | 'privacy' | 'terms' | 'contact' | 'links' | 'changelog' | 'thanks'

// 侧边栏导航
const navItems: { id: AboutTab; label: string; icon: LucideIcon; group: string }[] = [
  { id: 'story', label: '品牌故事', icon: Heart, group: '关于' },
  { id: 'tech', label: '技术栈', icon: Code2, group: '关于' },
  { id: 'team', label: '团队介绍', icon: Users, group: '关于' },
  { id: 'milestone', label: '里程碑', icon: Calendar, group: '关于' },
  { id: 'stats', label: '统计数据', icon: Activity, group: '关于' },
  { id: 'changelog', label: '更新日志', icon: RefreshCw, group: '关于' },
  { id: 'license', label: '开源许可', icon: BookOpen, group: '法律' },
  { id: 'privacy', label: '隐私政策', icon: Shield, group: '法律' },
  { id: 'terms', label: '服务条款', icon: FileText, group: '法律' },
  { id: 'contact', label: '联系我们', icon: Mail, group: '连接' },
  { id: 'links', label: '友情链接', icon: Link2, group: '连接' },
  { id: 'thanks', label: '致谢', icon: Award, group: '连接' },
]

// 技术栈分类
const techStack = [
  {
    category: '前端', icon: Layers, color: '#00ff88',
    items: [
      { name: 'React 18', desc: 'UI 框架', version: '18.3.1' },
      { name: 'TypeScript', desc: '类型安全', version: '5.8.3' },
      { name: 'Tailwind CSS', desc: '原子化 CSS', version: '3.4.17' },
      { name: 'Vite', desc: '构建工具', version: '6.3.5' },
      { name: 'Zustand', desc: '状态管理', version: '5.0.3' },
      { name: 'Framer Motion', desc: '动画引擎', version: '12.42.2' },
      { name: 'Lucide React', desc: '图标库', version: '0.511.0' },
      { name: 'React Markdown', desc: 'Markdown 渲染', version: '10.1.0' },
    ],
  },
  {
    category: '后端', icon: Server, color: '#00d4ff',
    items: [
      { name: 'Node.js', desc: '运行时', version: '20 LTS' },
      { name: 'Express', desc: 'Web 框架', version: '4.19' },
      { name: 'SQLite', desc: '本地数据库', version: '3.45' },
      { name: 'Redis', desc: '缓存与队列', version: '7.2' },
      { name: 'WebSocket', desc: '实时通信', version: 'ws 8.x' },
      { name: 'JWT', desc: '身份认证', version: 'jsonwebtoken 9.x' },
    ],
  },
  {
    category: 'AI', icon: Brain, color: '#c084fc',
    items: [
      { name: 'OpenAI API', desc: 'GPT 系列模型', version: 'gpt-4o' },
      { name: 'Anthropic Claude', desc: 'Claude 3.5 Sonnet', version: '3.5' },
      { name: 'Transformers.js', desc: '本地向量嵌入', version: '2.17.2' },
      { name: 'LangChain', desc: 'LLM 编排框架', version: '0.2.x' },
      { name: 'MCP Protocol', desc: '模型上下文协议', version: '1.0' },
    ],
  },
  {
    category: '工具', icon: Wrench, color: '#fbbf24',
    items: [
      { name: 'ESLint', desc: '代码规范', version: '9.x' },
      { name: 'Prettier', desc: '代码格式化', version: '3.x' },
      { name: 'Vitest', desc: '单元测试', version: '1.x' },
      { name: 'Docker', desc: '容器化部署', version: '24.x' },
      { name: 'GitHub Actions', desc: 'CI/CD', version: '-' },
      { name: 'pnpm', desc: '包管理器', version: '9.x' },
    ],
  },
]

// 团队成员
const teamMembers = [
  { name: 'Alex Chen', role: '创始人 & CEO', avatar: '🦸', bio: '前 Google 高级工程师，10 年 AI 与全栈经验。HopeAgent 的最初构想者。', skills: ['架构设计', 'AI 工程', '产品'], color: '#00ff88' },
  { name: 'Lisa Wang', role: 'CTO', avatar: '👩‍💻', bio: '前 Microsoft 技术专家，专注大模型应用与分布式系统。负责技术战略。', skills: ['后端架构', 'LLM', 'DevOps'], color: '#00d4ff' },
  { name: 'Mark Liu', role: '前端负责人', avatar: '🎨', bio: '前字节跳动前端工程师，UI/UX 设计与性能优化专家。打造赛博风格界面。', skills: ['React', 'TypeScript', '设计'], color: '#c084fc' },
  { name: 'Emily Zhang', role: 'AI 算法工程师', avatar: '🧠', bio: 'CMU 博士，研究方向为多 Agent 协作与 RAG。设计 Agent 大脑核心算法。', skills: ['NLP', 'RAG', 'Agent'], color: '#f472b6' },
  { name: 'David Kim', role: '后端工程师', avatar: '⚙️', bio: '前阿里巴巴工程师，高并发与分布式系统专家。负责 API 与工作流引擎。', skills: ['Node.js', '数据库', '架构'], color: '#fbbf24' },
  { name: 'Sarah Lin', role: '产品经理', avatar: '🎯', bio: '前腾讯产品经理，深入理解用户需求。负责产品规划与用户体验。', skills: ['产品规划', '用户研究', '增长'], color: '#34d399' },
  { name: 'Tom Wilson', role: 'DevOps 工程师', avatar: '🚀', bio: '前 AWS 解决方案架构师，云原生与自动化运维专家。保障系统稳定运行。', skills: ['K8s', 'AWS', '监控'], color: '#60a5fa' },
  { name: 'Anna Lee', role: '设计师', avatar: '✨', bio: '前网易设计师，赛博朋克美学爱好者。负责品牌与视觉设计。', skills: ['UI 设计', '动效', '插画'], color: '#fb923c' },
]

// 里程碑事件
const milestones = [
  {
    version: 'v3.0.0', date: '2026-07-01', title: 'Pro 版本发布',
    desc: 'HopeAgent Pro 正式发布，全新赛博风格 UI，新增 Agent 大脑、工作流引擎、思维导图、代码沙箱、插件市场等核心模块。',
    type: 'major', highlights: ['33 个 Agent', '27 个工具', '工作流编排', 'MCP 协议'],
  },
  {
    version: 'v2.5.0', date: '2026-04-15', title: '多 Agent 协作',
    desc: '引入多 Agent 协作模式，支持串行、并行、投票三种协作方式。新增 8 个专业 Agent。',
    type: 'minor', highlights: ['多 Agent 协作', 'Agent 记忆', '语音输入'],
  },
  {
    version: 'v2.0.0', date: '2026-01-10', title: '后端服务上线',
    desc: '可选后端部署，支持数据同步、API 开放、团队协作。数据分析仪表盘上线。',
    type: 'major', highlights: ['后端服务', 'REST API', '数据分析', '模板中心'],
  },
  {
    version: 'v1.5.0', date: '2025-09-20', title: '知识图谱',
    desc: '知识库支持图谱可视化，自动建立知识关联。支持 Markdown 导入与自动学习。',
    type: 'minor', highlights: ['知识图谱', '自动学习', '移动端优化'],
  },
  {
    version: 'v1.0.0', date: '2025-03-01', title: '首次发布',
    desc: 'HopeAgent 首次发布，包含基础对话、5 个内置 Agent、知识库管理与 10 个实用工具。',
    type: 'major', highlights: ['基础对话', '5 个 Agent', '知识库', '10 个工具'],
  },
  {
    version: 'v0.5.0', date: '2024-11-15', title: '内测启动',
    desc: 'HopeAgent 内测版本启动，邀请 100 名种子用户体验，收集反馈持续迭代。',
    type: 'beta', highlights: ['内测启动', '种子用户'],
  },
  {
    version: 'v0.1.0', date: '2024-06-01', title: '项目启动',
    desc: 'HopeAgent 项目正式启动，确立"超级智能助手"的产品愿景与技术路线。',
    type: 'beta', highlights: ['项目立项'],
  },
]

// 统计数据
const statistics = [
  { label: '代码行数', value: 50000, suffix: '+', icon: Code2, color: '#00ff88' },
  { label: 'Agent 数量', value: 33, suffix: ' 个', icon: Brain, color: '#00d4ff' },
  { label: '知识条目', value: 700, suffix: '+', icon: Database, color: '#c084fc' },
  { label: '工具数量', value: 27, suffix: ' 个', icon: Wrench, color: '#fbbf24' },
  { label: '注册用户', value: 12560, suffix: '+', icon: Users, color: '#f472b6' },
  { label: '对话总数', value: 384200, suffix: '+', icon: MessageSquare, color: '#34d399' },
  { label: '工作流模板', value: 156, suffix: ' 个', icon: GitBranch, color: '#60a5fa' },
  { label: '插件数量', value: 89, suffix: ' 个', icon: Boxes, color: '#fb923c' },
  { label: 'Token 处理', value: 284, suffix: 'M+', icon: Zap, color: '#a78bfa' },
  { label: '主题样式', value: 5, suffix: ' 种', icon: Palette, color: '#10b981' },
  { label: 'API 端点', value: 42, suffix: ' 个', icon: Server, color: '#f87171' },
  { label: '运行天数', value: 500, suffix: '+', icon: Calendar, color: '#0ea5e9' },
]

// 开源许可
const licenses = [
  { name: 'React', version: '18.3.1', license: 'MIT', url: 'https://reactjs.org' },
  { name: 'TypeScript', version: '5.8.3', license: 'Apache-2.0', url: 'https://typescriptlang.org' },
  { name: 'Tailwind CSS', version: '3.4.17', license: 'MIT', url: 'https://tailwindcss.com' },
  { name: 'Vite', version: '6.3.5', license: 'MIT', url: 'https://vitejs.dev' },
  { name: 'Zustand', version: '5.0.3', license: 'MIT', url: 'https://github.com/pmndrs/zustand' },
  { name: 'Framer Motion', version: '12.42.2', license: 'MIT', url: 'https://www.framer.com/motion' },
  { name: 'Lucide React', version: '0.511.0', license: 'ISC', url: 'https://lucide.dev' },
  { name: 'React Markdown', version: '10.1.0', license: 'MIT', url: 'https://github.com/remarkjs/react-markdown' },
  { name: 'Transformers.js', version: '2.17.2', license: 'Apache-2.0', url: 'https://huggingface.co/docs/transformers.js' },
  { name: 'clsx', version: '2.1.1', license: 'MIT', url: 'https://github.com/lukeed/clsx' },
  { name: 'tailwind-merge', version: '3.0.2', license: 'MIT', url: 'https://github.com/dcastil/tailwind-merge' },
  { name: 'remark-gfm', version: '4.0.1', license: 'MIT', url: 'https://github.com/remarkjs/remark-gfm' },
]

// 友情链接
const friendLinks = [
  { name: 'OpenAI', desc: 'GPT 模型提供商', url: 'https://openai.com', icon: '🤖' },
  { name: 'Anthropic', desc: 'Claude 模型提供商', url: 'https://anthropic.com', icon: '🧠' },
  { name: 'Hugging Face', desc: 'AI 模型与数据集平台', url: 'https://huggingface.co', icon: '🤗' },
  { name: 'LangChain', desc: 'LLM 应用开发框架', url: 'https://langchain.com', icon: '🔗' },
  { name: 'Vercel', desc: '前端部署平台', url: 'https://vercel.com', icon: '▲' },
  { name: 'GitHub', desc: '代码托管平台', url: 'https://github.com', icon: '🐙' },
  { name: 'MDN Web Docs', desc: 'Web 技术文档', url: 'https://developer.mozilla.org', icon: '📚' },
  { name: 'React 官网', desc: 'React 框架文档', url: 'https://react.dev', icon: '⚛️' },
]

// 致谢名单
const thanksList = [
  { name: '所有内测用户', desc: '感谢 100+ 名种子用户在早期提供的宝贵反馈', icon: Heart },
  { name: '开源社区', desc: '感谢无数开源项目让 HopeAgent 成为可能', icon: Github },
  { name: 'AI 研究者', desc: '感谢 AI 领域研究者的论文与开源工作', icon: Brain },
  { name: '设计与创意', desc: '感谢赛博朋克文化给予的视觉灵感', icon: Palette },
  { name: '家人与朋友', desc: '感谢团队家人的理解与支持', icon: Coffee },
  { name: '每一个你', desc: '感谢使用 HopeAgent，你的信任是我们前进的动力', icon: Sparkles },
]

// 更新日志（精简版）
const aboutChangelog = [
  {
    version: 'v3.0.0', date: '2026-07-01', type: 'major',
    changes: ['Pro 版本发布', '全新赛博风格 UI', 'Agent 大脑模块', '工作流引擎', '思维导图', '代码沙箱', '插件市场', 'MCP 协议支持'],
  },
  {
    version: 'v2.5.0', date: '2026-04-15', type: 'minor',
    changes: ['多 Agent 协作模式', 'Agent 记忆系统', '语音输入与 TTS', '新增 8 个 Agent', '性能优化'],
  },
  {
    version: 'v2.0.0', date: '2026-01-10', type: 'major',
    changes: ['后端服务可选部署', 'REST API 开放', '数据分析仪表盘', '模板中心', '团队协作（企业版）'],
  },
  {
    version: 'v1.5.0', date: '2025-09-20', type: 'minor',
    changes: ['知识图谱可视化', 'Markdown 导入', '移动端适配', '新增 3 种主题'],
  },
  {
    version: 'v1.0.0', date: '2025-03-01', type: 'major',
    changes: ['HopeAgent 首次发布', '基础对话功能', '5 个内置 Agent', '知识库管理', '10 个实用工具'],
  },
]

// 隐私政策要点
const privacyPoints = [
  { title: '数据所有权', desc: '你创建的所有内容（对话、知识、配置）归你所有，我们不会未经授权访问或使用。', icon: Crown },
  { title: '本地优先', desc: '默认情况下，数据存储在浏览器本地（IndexedDB），不会上传服务器，除非你启用后端同步。', icon: Lock },
  { title: '端到端加密', desc: '对话内容采用端到端加密传输，即使经过服务器也无法被读取。', icon: Shield },
  { title: 'API 密钥安全', desc: '你的 LLM API 密钥加密存储在本地，不上传至我们的服务器，仅在你的设备上使用。', icon: Key },
  { title: '匿名分析', desc: '我们收集匿名使用统计（如功能使用频率）以改进产品，不包含任何个人身份信息。', icon: Activity },
  { title: '数据导出与删除', desc: '你可随时导出全部数据或永久删除账号，删除后数据无法恢复。', icon: FileText },
]

// 服务条款要点
const termsPoints = [
  { title: '服务接受', desc: '使用 HopeAgent 即表示你同意本服务条款。如不同意，请停止使用。', icon: CheckCircle2 },
  { title: '使用许可', desc: '我们授予你个人、非独占、可撤销的许可使用 HopeAgent。商业用途需遵守相应版本限制。', icon: FileText },
  { title: '内容责任', desc: '你对使用 HopeAgent 生成的内容负责，应确保不侵犯第三方权益、不违反法律法规。', icon: Shield },
  { title: '禁止行为', desc: '不得用于违法、侵权、滥用、攻击等行为。不得逆向工程、爬取数据或干扰服务。', icon: AlertTriangle },
  { title: '服务变更', desc: '我们保留随时变更、暂停或终止服务的权利。重大变更会提前通知。', icon: RefreshCw },
  { title: '免责声明', desc: '服务按"现状"提供，AI 生成内容可能不准确，你不应完全依赖其做出重要决策。', icon: Info },
]

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<AboutTab>('story')
  const [expandedMilestone, setExpandedMilestone] = useState<string>('v3.0.0')
  const [expandedVersion, setExpandedVersion] = useState<string>('v3.0.0')

  // 渲染品牌故事
  const renderStory = () => (
    <div className="space-y-4">
      {/* Hero */}
      <div className="bg-gradient-to-br from-cyber-accent/10 via-cyber-accent2/5 to-cyber-accent3/10 border border-cyber-accent/30 rounded-xl p-6 text-center">
        <div className="flex justify-center mb-3">
          <BrandAvatar size="lg" animated />
        </div>
        <BrandWordmark className="text-xl justify-center" />
        <p className="text-[10px] text-gray-500 font-mono mt-1 tracking-widest">SUPER INTELLIGENCE</p>
        <p className="text-xs text-gray-400 mt-3 max-w-md mx-auto leading-relaxed">
          一个为创造者打造的超级智能助手，融合 33 个专业 Agent、27 个工具与知识库，让你的工作流如赛博朋克般高效炫酷。
        </p>
      </div>

      {/* 故事正文 */}
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-bold text-cyber-text flex items-center gap-2">
          <Heart className="w-4 h-4 text-cyber-accent" />
          HopeAgent 的诞生
        </h3>
        <div className="space-y-2.5 text-xs text-gray-400 leading-relaxed">
          <p>
            <span className="text-cyber-accent font-bold">2024 年初</span>，一群来自硅谷与国内的工程师、设计师与 AI 研究者聚在一起，
            思考一个问题：<span className="text-cyber-text">为什么 AI 助手总是"通用"而不能"专业"？</span>
          </p>
          <p>
            我们尝试过各种 AI 工具：写代码时切到 Copilot，写文档时切到 ChatGPT，分析数据时切到 Code Interpreter。
            每次切换都打断心流，每次上下文丢失都让人沮丧。我们想要一个 <span className="text-cyber-accent2">能理解上下文、能调用工具、能协作多 Agent</span> 的统一工作台。
          </p>
          <p>
            于是 <span className="text-cyber-accent font-bold">HopeAgent</span> 诞生了——"Hope" 寓意希望，希望 AI 能真正成为创造者的伙伴，
            而非简单的问答机器。我们设计了 <span className="text-cyber-accent2">33 个专业 Agent</span>，
            每个都有独特的角色与技能；引入了 <span className="text-cyber-accent2">多 Agent 协作</span>，
            让不同专长的 Agent 像团队一样配合；构建了 <span className="text-cyber-accent2">知识库与 RAG</span>，
            让 AI 记住你的偏好与积累。
          </p>
          <p>
            视觉上，我们选择了 <span className="text-cyber-accent3">赛博朋克</span> 风格——
            那种霓虹与暗夜交织的科技美学，正是我们对"未来工作方式"的想象：
            <span className="text-cyber-text">高效、酷炫、充满可能性</span>。
          </p>
          <p>
            今天，HopeAgent 已服务 <span className="text-cyber-accent font-bold">12,560+</span> 用户，
            处理超过 <span className="text-cyber-accent font-bold">2.84 亿</span> Token，
            但这只是开始。我们的愿景是：<span className="text-cyber-accent2">让每个人都能拥有自己的超级智能团队</span>。
          </p>
        </div>
      </div>

      {/* 愿景 */}
      <div className="grid grid-cols-1 gap-2">
        {[
          { icon: Target, title: '使命', desc: '让 AI 真正成为创造者的伙伴，而非工具', color: '#00ff88' },
          { icon: Rocket, title: '愿景', desc: '让每个人都能拥有自己的超级智能团队', color: '#00d4ff' },
          { icon: Heart, title: '价值观', desc: '用户至上 · 开放协作 · 持续创新', color: '#c084fc' },
        ].map(item => {
          const Icon = item.icon
          return (
            <div key={item.title} className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-3 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}
              >
                <Icon className="w-5 h-5" style={{ color: item.color }} />
              </div>
              <div>
                <p className="text-sm font-bold text-cyber-text">{item.title}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  // 渲染技术栈
  const renderTech = () => (
    <div className="space-y-3">
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h2 className="text-sm font-bold text-cyber-text flex items-center gap-2 mb-1">
          <Code2 className="w-4 h-4 text-cyber-accent" />
          技术栈
        </h2>
        <p className="text-xs text-gray-400">HopeAgent 采用现代化全栈技术方案</p>
      </div>

      {techStack.map(stack => {
        const Icon = stack.icon
        return (
          <div key={stack.category} className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-3">
            <div className="flex items-center gap-2 mb-3 px-1">
              <Icon className="w-4 h-4" style={{ color: stack.color }} />
              <h3 className="text-sm font-bold text-cyber-text">{stack.category}</h3>
              <span className="text-[10px] text-gray-500 font-mono">{stack.items.length} 项</span>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {stack.items.map(item => (
                <div key={item.name} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02] border border-cyber-border/30 hover:border-cyber-accent/20 transition-colors">
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: stack.color, boxShadow: `0 0 6px ${stack.color}` }}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-cyber-text">{item.name}</span>
                    <span className="text-[10px] text-gray-500 ml-2">{item.desc}</span>
                  </div>
                  <code className="text-[10px] text-cyber-accent2 font-mono">{item.version}</code>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )

  // 渲染团队
  const renderTeam = () => (
    <div className="space-y-3">
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h2 className="text-sm font-bold text-cyber-text flex items-center gap-2 mb-1">
          <Users className="w-4 h-4 text-cyber-accent" />
          团队介绍
        </h2>
        <p className="text-xs text-gray-400">{teamMembers.length} 位核心成员，来自全球顶尖科技公司</p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {teamMembers.map(member => (
          <div key={member.name} className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-3">
            <div className="flex items-start gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: `${member.color}15`, border: `1px solid ${member.color}30` }}
              >
                {member.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-bold text-cyber-text">{member.name}</h3>
                  <span
                    className="px-1.5 py-0.5 rounded text-[9px] font-mono"
                    style={{ background: `${member.color}15`, color: member.color }}
                  >
                    {member.role}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed mb-1.5">{member.bio}</p>
                <div className="flex items-center gap-1 flex-wrap">
                  {member.skills.map(skill => (
                    <span key={skill} className="px-1.5 py-0.5 rounded bg-white/[0.03] text-[9px] font-mono text-gray-500">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // 渲染里程碑
  const renderMilestone = () => (
    <div className="space-y-3">
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h2 className="text-sm font-bold text-cyber-text flex items-center gap-2 mb-1">
          <Calendar className="w-4 h-4 text-cyber-accent" />
          里程碑时间线
        </h2>
        <p className="text-xs text-gray-400">从 v1 到 v3 的发展历程</p>
      </div>

      <div className="space-y-2">
        {milestones.map((m, idx) => {
          const isExpanded = expandedMilestone === m.version
          const typeColor = m.type === 'major' ? '#00ff88' : m.type === 'minor' ? '#00d4ff' : '#6b7280'
          return (
            <div key={m.version} className="relative">
              {/* 时间线 */}
              {idx < milestones.length - 1 && (
                <div className="absolute left-5 top-12 bottom-0 w-px bg-cyber-border" />
              )}
              <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedMilestone(isExpanded ? '' : m.version)}
                  className="w-full flex items-start gap-3 p-3 hover:bg-white/[0.02] transition-colors text-left"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `${typeColor}15`,
                      border: `2px solid ${typeColor}`,
                      boxShadow: `0 0 10px ${typeColor}40`,
                    }}
                  >
                    <span className="text-[10px] font-mono font-bold" style={{ color: typeColor }}>
                      {m.version.replace('v', '')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-bold text-cyber-text">{m.title}</h3>
                      <span
                        className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase"
                        style={{ background: `${typeColor}15`, color: typeColor }}
                      >
                        {m.type}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-mono mb-1">{m.version} · {m.date}</p>
                    <p className="text-xs text-gray-400 leading-relaxed">{m.desc}</p>
                  </div>
                  {isExpanded
                    ? <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0 mt-1" />
                    : <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0 mt-1" />}
                </button>
                {isExpanded && (
                  <div className="px-3 pb-3 pt-1 ml-13 border-t border-cyber-border/30 mt-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {m.highlights.map(h => (
                        <span key={h} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyber-accent/10 border border-cyber-accent/30 text-[10px] text-cyber-accent">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  // 渲染统计数据
  const renderStats = () => (
    <div className="space-y-3">
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h2 className="text-sm font-bold text-cyber-text flex items-center gap-2 mb-1">
          <Activity className="w-4 h-4 text-cyber-accent" />
          统计数据
        </h2>
        <p className="text-xs text-gray-400">HopeAgent 的数字成就</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {statistics.map(stat => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-3 hover:border-cyber-accent/30 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}
                >
                  <Icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-lg font-bold font-mono" style={{ color: stat.color }}>
                {stat.value.toLocaleString()}{stat.suffix}
              </p>
              <p className="text-[10px] text-gray-500 font-mono mt-0.5">{stat.label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )

  // 渲染开源许可
  const renderLicense = () => (
    <div className="space-y-3">
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h2 className="text-sm font-bold text-cyber-text flex items-center gap-2 mb-1">
          <BookOpen className="w-4 h-4 text-cyber-accent" />
          开源许可
        </h2>
        <p className="text-xs text-gray-400">HopeAgent 使用的开源项目与许可协议</p>
      </div>

      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl overflow-hidden">
        {licenses.map((lic, idx) => (
          <div
            key={lic.name}
            className={cn(
              'flex items-center gap-3 p-3 hover:bg-white/[0.02] transition-colors',
              idx !== licenses.length - 1 && 'border-b border-cyber-border/30'
            )}
          >
            <div className="w-8 h-8 rounded-lg bg-cyber-accent/10 border border-cyber-accent/20 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4 h-4 text-cyber-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm text-cyber-text">{lic.name}</span>
                <code className="text-[10px] text-gray-500 font-mono">{lic.version}</code>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-cyber-accent2/10 border border-cyber-accent2/30 text-[10px] font-mono text-cyber-accent2 flex-shrink-0">
              {lic.license}
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
          </div>
        ))}
      </div>

      <div className="bg-cyber-accent/5 border border-cyber-accent/30 rounded-xl p-4">
        <p className="text-xs text-gray-400 leading-relaxed">
          HopeAgent Pro 本身采用 <span className="text-cyber-accent font-bold">专有许可</span>，
          源代码不公开。但上述所有依赖均为开源项目，我们感谢开源社区的贡献。
        </p>
      </div>
    </div>
  )

  // 渲染隐私政策
  const renderPrivacy = () => (
    <div className="space-y-3">
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h2 className="text-sm font-bold text-cyber-text flex items-center gap-2 mb-1">
          <Shield className="w-4 h-4 text-cyber-accent" />
          隐私政策
        </h2>
        <p className="text-xs text-gray-400">最后更新：2026-07-01 · 你的隐私是我们最重视的事</p>
      </div>

      <div className="space-y-2">
        {privacyPoints.map(point => {
          const Icon = point.icon
          return (
            <div key={point.title} className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-3 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyber-accent/10 border border-cyber-accent/20 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-cyber-accent" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-cyber-text mb-1">{point.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{point.desc}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h3 className="text-sm font-bold text-cyber-text mb-2">联系方式</h3>
        <p className="text-xs text-gray-400 leading-relaxed">
          如有隐私相关问题，请联系：<code className="text-cyber-accent font-mono">privacy@hopeagent.pro</code>
        </p>
      </div>
    </div>
  )

  // 渲染服务条款
  const renderTerms = () => (
    <div className="space-y-3">
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h2 className="text-sm font-bold text-cyber-text flex items-center gap-2 mb-1">
          <FileText className="w-4 h-4 text-cyber-accent" />
          服务条款
        </h2>
        <p className="text-xs text-gray-400">最后更新：2026-07-01 · 使用 HopeAgent 即表示同意以下条款</p>
      </div>

      <div className="space-y-2">
        {termsPoints.map(point => {
          const Icon = point.icon
          return (
            <div key={point.title} className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-3 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyber-accent2/10 border border-cyber-accent2/20 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-cyber-accent2" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-cyber-text mb-1">{point.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{point.desc}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h3 className="text-sm font-bold text-cyber-text mb-2">联系方式</h3>
        <p className="text-xs text-gray-400 leading-relaxed">
          如有条款相关问题，请联系：<code className="text-cyber-accent font-mono">legal@hopeagent.pro</code>
        </p>
      </div>
    </div>
  )

  // 渲染联系方式
  const renderContact = () => (
    <div className="space-y-3">
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h2 className="text-sm font-bold text-cyber-text flex items-center gap-2 mb-1">
          <Mail className="w-4 h-4 text-cyber-accent" />
          联系我们
        </h2>
        <p className="text-xs text-gray-400">我们随时为你服务</p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {[
          { icon: Mail, label: '客服邮箱', value: 'support@hopeagent.pro', desc: '产品使用问题', color: '#00ff88' },
          { icon: Github, label: 'GitHub', value: 'github.com/hopeagent', desc: 'Bug 反馈与功能建议', color: '#00d4ff' },
          { icon: Brain, label: '商务合作', value: 'business@hopeagent.pro', desc: '企业版与定制需求', color: '#c084fc' },
          { icon: Shield, label: '安全问题', value: 'security@hopeagent.pro', desc: '安全漏洞报告', color: '#fbbf24' },
          { icon: FileText, label: '媒体联系', value: 'press@hopeagent.pro', desc: '媒体采访与报道', color: '#f472b6' },
          { icon: Coffee, label: '加入团队', value: 'careers@hopeagent.pro', desc: '与我们一起创造未来', color: '#34d399' },
        ].map(item => {
          const Icon = item.icon
          return (
            <div key={item.label} className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-3 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}
              >
                <Icon className="w-5 h-5" style={{ color: item.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-cyber-text">{item.label}</p>
                <code className="text-xs text-cyber-accent2 font-mono">{item.value}</code>
                <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
            </div>
          )
        })}
      </div>

      {/* 办公地点 */}
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h3 className="text-sm font-bold text-cyber-text mb-2 flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyber-accent" />
          办公地点
        </h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <span className="text-cyber-accent">🇨🇳</span>
            <div>
              <p className="text-gray-300">上海总部</p>
              <p className="text-[11px] text-gray-500">上海市浦东新区张江高科技园区</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-cyber-accent2">🇺🇸</span>
            <div>
              <p className="text-gray-300">硅谷分部</p>
              <p className="text-[11px] text-gray-500">San Francisco, CA, USA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // 渲染友情链接
  const renderLinks = () => (
    <div className="space-y-3">
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h2 className="text-sm font-bold text-cyber-text flex items-center gap-2 mb-1">
          <Link2 className="w-4 h-4 text-cyber-accent" />
          友情链接
        </h2>
        <p className="text-xs text-gray-400">我们推荐的项目与平台</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {friendLinks.map(link => (
          <a
            key={link.name}
            className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-3 hover:border-cyber-accent/30 transition-all"
          >
            <div className="flex items-start gap-2">
              <span className="text-2xl">{link.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-cyber-text truncate">{link.name}</p>
                <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2">{link.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-[10px] text-cyber-accent2 font-mono">
              <ExternalLink className="w-3 h-3" />
              {link.url.replace('https://', '')}
            </div>
          </a>
        ))}
      </div>
    </div>
  )

  // 渲染更新日志
  const renderChangelog = () => (
    <div className="space-y-3">
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h2 className="text-sm font-bold text-cyber-text flex items-center gap-2 mb-1">
          <RefreshCw className="w-4 h-4 text-cyber-accent" />
          更新日志
        </h2>
        <p className="text-xs text-gray-400">HopeAgent 版本历史</p>
      </div>

      <div className="space-y-2">
        {aboutChangelog.map(ver => {
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
                      <CheckCircle2 className="w-3 h-3 text-cyber-accent mt-0.5 flex-shrink-0" />
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

  // 渲染致谢
  const renderThanks = () => (
    <div className="space-y-3">
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h2 className="text-sm font-bold text-cyber-text flex items-center gap-2 mb-1">
          <Award className="w-4 h-4 text-yellow-400" />
          致谢
        </h2>
        <p className="text-xs text-gray-400">感谢每一位让 HopeAgent 成为可能的人</p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {thanksList.map(item => {
          const Icon = item.icon
          return (
            <div key={item.name} className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-3 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-cyber-text mb-0.5">{item.name}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* 结尾 */}
      <div className="bg-gradient-to-br from-cyber-accent/10 to-cyber-accent2/10 border border-cyber-accent/30 rounded-xl p-5 text-center">
        <Heart className="w-8 h-8 text-cyber-accent mx-auto mb-2" />
        <p className="text-sm text-cyber-text font-bold mb-1">谢谢你</p>
        <p className="text-xs text-gray-400 leading-relaxed">
          感谢你选择 HopeAgent。<br />
          你的每一次对话、每一条反馈、每一次分享，<br />
          都是我们前进的动力。
        </p>
      </div>
    </div>
  )

  // 渲染当前内容
  const renderContent = () => {
    switch (activeTab) {
      case 'story': return renderStory()
      case 'tech': return renderTech()
      case 'team': return renderTeam()
      case 'milestone': return renderMilestone()
      case 'stats': return renderStats()
      case 'license': return renderLicense()
      case 'privacy': return renderPrivacy()
      case 'terms': return renderTerms()
      case 'contact': return renderContact()
      case 'links': return renderLinks()
      case 'changelog': return renderChangelog()
      case 'thanks': return renderThanks()
      default: return renderStory()
    }
  }

  // 分组导航
  const groupedNav = navItems.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = []
    acc[item.group].push(item)
    return acc
  }, {} as Record<string, typeof navItems>)

  return (
    <div className="h-full flex flex-col">
      {/* 顶部标题栏 */}
      <div className="border-b border-cyber-border bg-cyber-panel/50 px-4 py-3 flex-shrink-0">
        <h1 className="text-base font-bold text-cyber-text flex items-center gap-2">
          <Info className="w-4 h-4 text-cyber-accent" />
          关于 HopeAgent
        </h1>
        <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
          品牌故事 · 技术栈 · 团队 · 法律
        </p>
      </div>

      {/* 主体：左侧导航 + 右侧内容 */}
      <div className="flex-1 flex min-h-0">
        {/* 侧边导航 */}
        <div className="w-32 sm:w-40 border-r border-cyber-border/30 bg-cyber-bg/30 overflow-y-auto flex-shrink-0">
          <div className="p-2 space-y-3">
            {Object.entries(groupedNav).map(([group, items]) => (
              <div key={group}>
                <p className="text-[9px] font-mono text-gray-600 uppercase px-2 mb-1 tracking-wider">{group}</p>
                <div className="space-y-0.5">
                  {items.map(item => {
                    const Icon = item.icon
                    const isActive = activeTab === item.id
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
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
            ))}
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
