import { useState, useMemo } from 'react'
import {
  Users,
  Search,
  Plus,
  ThumbsUp,
  MessageSquare,
  Eye,
  Bookmark,
  Share2,
  Flag,
  Send,
  X,
  ChevronLeft,
  Reply,
  Flame,
  Clock,
  Star,
  TrendingUp,
  Hash,
  Award,
  PenSquare,
  Filter,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============

// 话题分类
type TopicCategory = 'tech' | 'qa' | 'share' | 'announce' | 'chat'

// 帖子标签类型
type PostTag = '前端' | '后端' | 'AI' | '工具' | '教程' | '讨论' | '求助' | '分享'

// 帖子
interface Post {
  id: string
  author: User
  title: string
  content: string
  summary: string
  category: TopicCategory
  tags: PostTag[]
  isEssence: boolean
  isPinned: boolean
  likes: number
  comments: Comment[]
  views: number
  createdAt: string
  liked?: boolean
  bookmarked?: boolean
}

// 用户
interface User {
  id: string
  name: string
  avatar: string
  level: number
  postCount: number
  title: string
}

// 评论
interface Comment {
  id: string
  author: User
  content: string
  createdAt: string
  likes: number
  liked?: boolean
  replies: Reply[]
}

// 回复
interface Reply {
  id: string
  author: User
  content: string
  createdAt: string
  likes: number
  liked?: boolean
  replyTo?: string
}

// Tab 类型
type TabMode = 'hot' | 'new' | 'essence'

// ============ 常量配置 ============

// 分类配置
const categoryConfig: Record<TopicCategory, { label: string; color: string; bgColor: string; icon: typeof Hash }> = {
  tech: { label: '技术', color: 'text-cyan-400', bgColor: 'bg-cyan-500/10', icon: Hash },
  qa: { label: '问答', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', icon: Hash },
  share: { label: '分享', color: 'text-cyber-accent', bgColor: 'bg-cyber-accent/10', icon: Hash },
  announce: { label: '公告', color: 'text-red-400', bgColor: 'bg-red-500/10', icon: Hash },
  chat: { label: '闲聊', color: 'text-purple-400', bgColor: 'bg-purple-500/10', icon: Hash },
}

// 标签颜色
const tagColors: Record<PostTag, string> = {
  '前端': 'text-cyan-400 bg-cyan-500/10',
  '后端': 'text-blue-400 bg-blue-500/10',
  'AI': 'text-cyber-accent bg-cyber-accent/10',
  '工具': 'text-yellow-400 bg-yellow-500/10',
  '教程': 'text-green-400 bg-green-500/10',
  '讨论': 'text-purple-400 bg-purple-500/10',
  '求助': 'text-orange-400 bg-orange-500/10',
  '分享': 'text-pink-400 bg-pink-500/10',
}

// 所有标签
const allTags: PostTag[] = ['前端', '后端', 'AI', '工具', '教程', '讨论', '求助', '分享']

// ============ Mock 数据生成 ============

// 生成用户
const mockUsers: User[] = [
  { id: 'u_1', name: '赛博极客', avatar: '🦾', level: 12, postCount: 156, title: '高级工程师' },
  { id: 'u_2', name: '代码诗人', avatar: '✍️', level: 10, postCount: 98, title: '技术专家' },
  { id: 'u_3', name: '前端小能手', avatar: '🎨', level: 8, postCount: 76, title: '前端开发' },
  { id: 'u_4', name: '后端架构师', avatar: '⚙️', level: 15, postCount: 203, title: '架构师' },
  { id: 'u_5', name: 'AI研究员', avatar: '🧠', level: 11, postCount: 134, title: 'AI工程师' },
  { id: 'u_6', name: '工具收藏家', avatar: '🧰', level: 7, postCount: 45, title: '效率达人' },
  { id: 'u_7', name: '开源贡献者', avatar: '🌟', level: 13, postCount: 178, title: '开源维护者' },
  { id: 'u_8', name: '深夜程序员', avatar: '🌙', level: 6, postCount: 32, title: '初级开发' },
]

// 生成 mock 帖子
const generateMockPosts = (): Post[] => {
  const postData = [
    { title: 'React 19 新特性深度解析：Actions 与 useOptimistic', category: 'tech' as TopicCategory, tags: ['前端', '分享'] as PostTag[], content: 'React 19 带来了许多激动人心的新特性，其中最值得关注的是 Actions 和 useOptimistic Hook。\n\n## Actions\n\nActions 是一种新的表单处理机制，简化了异步操作的处理流程。\n\n```javascript\nconst [result, submitAction, isPending] = useActionState(async (prev, formData) => {\n  const res = await fetch("/api", { method: "POST", body: formData })\n  return res.json()\n}, null)\n```\n\n## useOptimistic\n\n用于实现乐观更新，提升用户体验。\n\n这个版本还改进了 Suspense、错误处理等方面，建议大家都升级体验。' },
    { title: '求助：TypeScript 泛型推导问题', category: 'qa' as TopicCategory, tags: ['后端', '求助'] as PostTag[], content: '在使用 TypeScript 泛型时遇到了一个推导问题，代码如下：\n\n```typescript\nfunction getProperty<T, K extends keyof T>(obj: T, key: K) {\n  return obj[key]\n}\n```\n\n当传入联合类型时，返回类型变成了联合类型，但我期望的是对应的类型。请问该如何解决？' },
    { title: '分享：我整理的 2026 前端工具链清单', category: 'share' as TopicCategory, tags: ['前端', '工具', '分享'] as PostTag[], content: '经过半年的整理，终于完成了这份前端工具链清单，包含构建工具、测试工具、调试工具等。\n\n## 构建工具\n\n- Vite\n- Turbopack\n- Rspack\n\n## 测试工具\n\n- Vitest\n- Playwright\n\n希望大家喜欢，欢迎补充！' },
    { title: '【公告】社区规则更新与版主招募', category: 'announce' as TopicCategory, tags: ['讨论'] as PostTag[], content: '各位社区成员好，为了提升社区质量，我们更新了社区规则，并开始招募新版主。\n\n## 规则更新\n\n1. 禁止发布广告内容\n2. 技术问题请发到问答区\n3. 鼓励原创内容\n\n## 版主招募\n\n要求：\n- 活跃度高\n- 技术能力强\n- 有责任心\n\n有意者请私信联系。' },
    { title: 'Vue 3.5 发布：响应式系统重大优化', category: 'tech' as TopicCategory, tags: ['前端', '分享'] as PostTag[], content: 'Vue 3.5 正式发布，本次更新主要优化了响应式系统，内存使用减少约 56%，性能提升显著。\n\n## 主要更新\n\n- 响应式系统重写\n- 计算属性优化\n- 内存泄漏修复\n\n强烈推荐升级！' },
    { title: '闲聊：大家平时都用什么编辑器主题？', category: 'chat' as TopicCategory, tags: ['讨论'] as PostTag[], content: '最近想换个编辑器主题，大家有什么推荐吗？\n\n我现在用的是 One Dark Pro，感觉有点审美疲劳了。想试试赛博朋克风格的主题，求推荐！' },
    { title: 'Node.js 22 新特性：内置测试运行器', category: 'tech' as TopicCategory, tags: ['后端', '教程'] as PostTag[], content: 'Node.js 22 内置了测试运行器，无需安装 Jest 或 Mocha 即可运行测试。\n\n```javascript\nimport { test } from "node:test"\nimport assert from "node:assert"\n\ntest("测试用例", () => {\n  assert.equal(1 + 1, 2)\n})\n```\n\n使用 `node --test` 即可运行，非常方便！' },
    { title: 'AI 编程助手对比：Copilot vs Cursor vs Trae', category: 'share' as TopicCategory, tags: ['AI', '工具', '分享'] as PostTag[], content: '作为重度 AI 编程用户，我对比了三款主流 AI 编程助手：\n\n## GitHub Copilot\n- 优点：生态成熟\n- 缺点：上下文理解一般\n\n## Cursor\n- 优点：IDE 集成好\n- 缺点：价格较贵\n\n## Trae\n- 优点：免费、中文友好\n- 缺点：新生态\n\n个人推荐 Trae，性价比最高。' },
    { title: '求助：Webpack 5 模块联邦配置问题', category: 'qa' as TopicCategory, tags: ['前端', '求助'] as PostTag[], content: '在使用 Webpack 5 模块联邦时，远程模块加载失败，报错 "ScriptLoadError"。\n\n配置如下：\n\n```javascript\nnew ModuleFederationPlugin({\n  name: "app1",\n  remotes: {\n    app2: "app2@http://localhost:3001/remoteEntry.js"\n  }\n})\n```\n\n请问是什么原因？' },
    { title: 'CSS 容器查询实战：响应式设计新方式', category: 'tech' as TopicCategory, tags: ['前端', '教程'] as PostTag[], content: '容器查询是 CSS 的新特性，可以根据父容器尺寸而非视口尺寸进行响应式设计。\n\n```css\n.card {\n  container-type: inline-size;\n}\n\n@container (min-width: 400px) {\n  .card-title {\n    font-size: 24px;\n  }\n}\n```\n\n这种方式比媒体查询更灵活！' },
    { title: '分享我开发的 Markdown 笔记应用', category: 'share' as TopicCategory, tags: ['前端', '工具', '分享'] as PostTag[], content: '花了一个月时间开发了这款 Markdown 笔记应用，支持实时预览、版本管理、多端同步。\n\n## 特性\n\n- 所见即所得编辑\n- Git 版本管理\n- 端到端加密\n- 多平台支持\n\n开源免费，欢迎 Star！' },
    { title: '【精华】前端性能优化完全指南', category: 'tech' as TopicCategory, tags: ['前端', '教程', '分享'] as PostTag[], content: '本文总结了前端性能优化的方方面面，从加载到渲染，从代码到资源。\n\n## 加载优化\n\n1. 代码分割\n2. 懒加载\n3. 预加载\n\n## 渲染优化\n\n1. 虚拟列表\n2. 防抖节流\n3. Web Worker\n\n持续更新中...' },
    { title: 'Rust 入门：为什么前端工程师应该学 Rust', category: 'tech' as TopicCategory, tags: ['后端', '讨论'] as PostTag[], content: '随着 WebAssembly 和工具链的发展，Rust 在前端领域越来越重要。\n\n## 应用场景\n\n- 构建工具（Rspack、SWC）\n- WebAssembly 模块\n- 桌面应用（Tauri）\n\n## 学习建议\n\n建议从官方文档开始，配合实践项目学习。' },
    { title: '闲聊：远程办公 vs 办公室办公，你选哪个？', category: 'chat' as TopicCategory, tags: ['讨论'] as PostTag[], content: '最近公司在讨论是否全面恢复线下办公，大家怎么看？\n\n我个人更喜欢远程办公，省去通勤时间，效率更高。但也担心社交减少。\n\n欢迎分享你的看法！' },
    { title: 'Docker Compose 部署 Node.js 全栈项目实战', category: 'tech' as TopicCategory, tags: ['后端', '教程'] as PostTag[], content: '详细讲解如何使用 Docker Compose 部署 Node.js + PostgreSQL + Redis 全栈项目。\n\n```yaml\nversion: "3.8"\nservices:\n  app:\n    build: .\n    ports:\n      - "3000:3000"\n  db:\n    image: postgres:15\n```\n\n包含 Nginx 反向代理、SSL 配置等。' },
    { title: '求助：React useEffect 无限循环问题', category: 'qa' as TopicCategory, tags: ['前端', '求助'] as PostTag[], content: 'useEffect 一直触发无限循环，代码：\n\n```javascript\nuseEffect(() => {\n  setData(fetchData())\n}, [data])\n```\n\n我知道是依赖问题，但不知道怎么改。求助！' },
    { title: 'TypeScript 5.5 新特性：推断类型谓词', category: 'tech' as TopicCategory, tags: ['后端', '分享'] as PostTag[], content: 'TypeScript 5.5 自动推断类型谓词，无需手动写 `is` 断言。\n\n```typescript\nfunction isString(x: unknown) {\n  return typeof x === "string"\n}\n// 自动推断为 (x: unknown) => x is string\n```\n\n非常实用的改进！' },
    { title: '分享：我的 2026 技术学习路线', category: 'share' as TopicCategory, tags: ['讨论', '分享'] as PostTag[], content: '新的一年，制定了如下学习路线：\n\n## Q1: 深入 Rust\n\n## Q2: WebAssembly 实战\n\n## Q3: AI 应用开发\n\n## Q4: 开源项目贡献\n\n欢迎交流！' },
    { title: '【公告】社区积分系统上线', category: 'announce' as TopicCategory, tags: ['讨论'] as PostTag[], content: '社区积分系统正式上线！\n\n## 积分获取\n\n- 发帖：+10\n- 评论：+5\n- 被点赞：+2\n- 精华帖：+50\n\n## 积分用途\n\n- 兑换礼品\n- 解锁特权\n- 提升等级\n\n快去发帖赚积分吧！' },
    { title: 'Tailwind CSS v4 预览：性能大幅提升', category: 'tech' as TopicCategory, tags: ['前端', '分享'] as PostTag[], content: 'Tailwind CSS v4 即将发布，主要改进：\n\n## 性能\n\n- 构建速度提升 10 倍\n- 包体积减少 50%\n\n## 新特性\n\n- CSS 变量配置\n- 原生嵌套\n- 容器查询\n\n期待正式版！' },
    { title: '闲聊：大家第一行代码写的是什么？', category: 'chat' as TopicCategory, tags: ['讨论'] as PostTag[], content: '突然怀旧，想起第一行代码是 `print("Hello World")`，那时候还是用 Python 2。\n\n大家的第一个程序是什么呢？' },
    { title: 'Next.js 15 正式发布：支持 React 19', category: 'tech' as TopicCategory, tags: ['前端', '分享'] as PostTag[], content: 'Next.js 15 正式发布，主要更新：\n\n- 支持 React 19\n- Turbopack 稳定\n- 缓存策略调整\n- 部分预渲染\n\n建议新项目直接使用 Next.js 15！' },
    { title: '求助：Git rebase 冲突解决', category: 'qa' as TopicCategory, tags: ['工具', '求助'] as PostTag[], content: 'rebase 时遇到大量冲突，不知道怎么解决，已经卡了 2 小时了。\n\n有没有什么高效解决冲突的方法？或者能不能取消 rebase？' },
    { title: '分享：我用的效率工具合集', category: 'share' as TopicCategory, tags: ['工具', '分享'] as PostTag[], content: '分享我日常使用的效率工具：\n\n## 开发\n\n- VS Code + Trae\n- iTerm2 + tmux\n- Docker Desktop\n\n## 笔记\n\n- Obsidian\n- Notion\n\n## 时间管理\n\n- Todoist\n- Toggl\n\n欢迎补充！' },
    { title: '【精华】系统设计面试完全指南', category: 'qa' as TopicCategory, tags: ['后端', '教程', '分享'] as PostTag[], content: '本文系统总结了系统设计面试的方法论和案例。\n\n## 方法论\n\n1. 需求分析\n2. 容量估算\n3. 系统架构\n4. 数据模型\n5. 详细设计\n6. 扩展性\n\n## 案例\n\n- 设计短链服务\n- 设计 Twitter\n- 设计打车系统\n\n祝大家面试顺利！' },
    { title: 'WebGPU 时代来临：替代 WebGL 的新标准', category: 'tech' as TopicCategory, tags: ['前端', '讨论'] as PostTag[], content: 'WebGPU 已经在主流浏览器全面支持，相比 WebGL 性能提升 3-5 倍。\n\n## 优势\n\n- 更接近底层 API\n- 计算着色器支持\n- 更好的性能\n\n## 应用\n\n- 3D 渲染\n- 机器学习\n- 科学计算' },
    { title: '闲聊：程序员最讨厌的代码注释', category: 'chat' as TopicCategory, tags: ['讨论'] as PostTag[], content: '盘点那些让人崩溃的代码注释：\n\n1. `// 不要删除这行，否则世界末日`\n2. `// 我也不知道为什么这样写，但能跑`\n3. `// 当我写下这段代码时，只有我和上帝知道\n4. `// 现在只有上帝知道了`\n\n大家还见过哪些？' },
    { title: 'Bun 1.2 发布：包管理器性能再创新高', category: 'tech' as TopicCategory, tags: ['后端', '工具', '分享'] as PostTag[], content: 'Bun 1.2 发布，包安装速度比 npm 快 25 倍。\n\n## 主要更新\n\n- 安装速度提升\n- 兼容性改善\n- API 稳定\n\n虽然生态还不及 Node.js，但前景可观！' },
    { title: '求助：如何学习算法？感觉好难', category: 'qa' as TopicCategory, tags: ['讨论', '求助'] as PostTag[], content: '非科班出身，最近想刷算法题准备面试，但感觉好难。\n\n请问有没有什么好的学习路径推荐？从哪里开始比较合适？' },
    { title: '分享：开源一年的 Trae IDE 使用体验', category: 'share' as TopicCategory, tags: ['工具', 'AI', '分享'] as PostTag[], content: '使用 Trae IDE 一年了，分享下体验：\n\n## 优点\n\n- AI 辅助编程强大\n- 中文友好\n- 免费使用\n- 插件生态完善\n\n## 不足\n\n- 偶尔有 bug\n- 部分功能待完善\n\n总体非常推荐！' },
  ]

  const commentsData = [
    '写得非常详细，学到了很多！',
    '感谢分享，正好遇到这个问题。',
    '这个方案不错，我试试看。',
    '楼主辛苦了，期待更多分享。',
    '说得太好了，完全赞同！',
    '我也有同样的疑问，感谢解答。',
    '这个工具确实好用，推荐！',
    '请问有完整的代码示例吗？',
    '收藏了，回头慢慢研究。',
    '楼主大牛，求带飞！',
  ]

  const posts: Post[] = []
  const now = Date.now()

  for (let i = 0; i < postData.length; i++) {
    const data = postData[i]
    const author = mockUsers[i % mockUsers.length]
    const createdAt = new Date(now - i * 3600000 * 3).toISOString()
    const commentCount = Math.floor(Math.random() * 5) + 1
    const comments: Comment[] = []
    for (let j = 0; j < commentCount; j++) {
      const cmtAuthor = mockUsers[(i + j + 1) % mockUsers.length]
      const replyCount = Math.floor(Math.random() * 3)
      const replies: Reply[] = []
      for (let k = 0; k < replyCount; k++) {
        replies.push({
          id: `reply_${i}_${j}_${k}`,
          author: mockUsers[(i + j + k + 2) % mockUsers.length],
          content: commentsData[(i + j + k + 2) % commentsData.length],
          createdAt: new Date(now - i * 3600000 + (j + 1) * 1800000 + k * 600000).toISOString(),
          likes: Math.floor(Math.random() * 10),
        })
      }
      comments.push({
        id: `cmt_${i}_${j}`,
        author: cmtAuthor,
        content: commentsData[(i + j + 1) % commentsData.length],
        createdAt: new Date(now - i * 3600000 + (j + 1) * 1800000).toISOString(),
        likes: Math.floor(Math.random() * 20),
        replies,
      })
    }
    // 为前 5 个帖子补充评论使其达到 50 条以上
    if (i < 5) {
      for (let j = commentCount; j < 12; j++) {
        const cmtAuthor = mockUsers[(i + j + 1) % mockUsers.length]
        comments.push({
          id: `cmt_${i}_${j}`,
          author: cmtAuthor,
          content: commentsData[(i + j + 1) % commentsData.length],
          createdAt: new Date(now - i * 3600000 + (j + 1) * 1800000).toISOString(),
          likes: Math.floor(Math.random() * 20),
          replies: [],
        })
      }
    }

    posts.push({
      id: `post_${i + 1}`,
      author,
      title: data.title,
      content: data.content,
      summary: data.content.replace(/[#*`>\-\n]/g, ' ').slice(0, 120) + '...',
      category: data.category,
      tags: data.tags,
      isEssence: data.title.includes('精华') || i % 6 === 0,
      isPinned: i < 2,
      likes: Math.floor(Math.random() * 200) + 10,
      comments,
      views: Math.floor(Math.random() * 2000) + 100,
      createdAt,
    })
  }

  return posts
}

const initialPosts = generateMockPosts()

// ============ 主组件 ============

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [activeTab, setActiveTab] = useState<TabMode>('hot')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<TopicCategory | 'all'>('all')
  const [filterTag, setFilterTag] = useState<PostTag | 'all'>('all')
  const [showFilter, setShowFilter] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [showEditor, setShowEditor] = useState(false)

  // 过滤与排序
  const filteredPosts = useMemo(() => {
    let result = posts
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.author.name.toLowerCase().includes(q)
      )
    }
    if (filterCategory !== 'all') result = result.filter(p => p.category === filterCategory)
    if (filterTag !== 'all') result = result.filter(p => p.tags.includes(filterTag))

    // Tab 排序
    if (activeTab === 'hot') {
      result = [...result].sort((a, b) => (b.likes + b.comments.length * 2 + b.views * 0.01) - (a.likes + a.comments.length * 2 + a.views * 0.01))
    } else if (activeTab === 'new') {
      result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (activeTab === 'essence') {
      result = result.filter(p => p.isEssence)
    }

    // 置顶优先
    return [...result].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1
      return 0
    })
  }, [posts, searchQuery, filterCategory, filterTag, activeTab])

  // 统计
  const stats = useMemo(() => {
    const totalComments = posts.reduce((sum, p) => sum + p.comments.length + p.comments.reduce((s, c) => s + c.replies.length, 0), 0)
    const todayPosts = posts.filter(p => {
      const diff = Date.now() - new Date(p.createdAt).getTime()
      return diff < 86400000
    }).length
    return {
      posts: posts.length,
      users: mockUsers.length,
      comments: totalComments,
      todayPosts,
      activeUsers: mockUsers.filter(u => u.postCount > 50).length,
    }
  }, [posts])

  // 点赞
  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      return { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
    }))
    if (selectedPost?.id === postId) {
      setSelectedPostsAfter(postId)
    }
  }

  // 收藏
  const handleBookmark = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, bookmarked: !p.bookmarked } : p))
    if (selectedPost?.id === postId) {
      setSelectedPostsAfter(postId)
    }
  }

  // 同步详情
  const setSelectedPostsAfter = (postId: string) => {
    setTimeout(() => {
      const updated = posts.find(p => p.id === postId)
      if (updated) setSelectedPost(prev => prev ? { ...updated } : null)
    }, 0)
  }

  // 评论点赞
  const handleCommentLike = (postId: string, commentId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      return {
        ...p,
        comments: p.comments.map(c => {
          if (c.id !== commentId) return c
          return { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
        })
      }
    }))
  }

  // 添加评论
  const handleAddComment = (postId: string, content: string) => {
    if (!content.trim()) return
    const newComment: Comment = {
      id: `cmt_${Date.now()}`,
      author: mockUsers[0],
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: [],
    }
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p))
  }

  // 添加回复
  const handleAddReply = (postId: string, commentId: string, content: string) => {
    if (!content.trim()) return
    const newReply: Reply = {
      id: `reply_${Date.now()}`,
      author: mockUsers[0],
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
    }
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      return {
        ...p,
        comments: p.comments.map(c => c.id === commentId ? { ...c, replies: [...c.replies, newReply] } : c)
      }
    }))
  }

  // 发帖
  const handlePublish = (post: Post) => {
    setPosts(prev => [post, ...prev])
    setShowEditor(false)
  }

  const hasActiveFilter = filterCategory !== 'all' || filterTag !== 'all'

  return (
    <div className="h-full flex flex-col bg-cyber-bg">
      {/* 顶部标题栏 */}
      <div className="border-b border-cyber-border/30 bg-cyber-panel/40 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-base font-bold text-cyber-text flex items-center gap-2">
              <Users className="w-4 h-4 text-cyber-accent" />
              社区论坛
            </h1>
            <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
              技术 · 问答 · 分享 · 共 {posts.length} 个帖子
            </p>
          </div>
          <button
            onClick={() => setShowEditor(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-mono bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/30 hover:bg-cyber-accent/20 transition-all flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>发帖</span>
          </button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          <StatCard icon={PenSquare} label="帖子总数" value={`${stats.posts}`} sub={`今日 +${stats.todayPosts}`} color="text-cyber-accent" />
          <StatCard icon={Users} label="社区成员" value={`${stats.users}`} sub={`${stats.activeUsers} 活跃`} color="text-cyan-400" />
          <StatCard icon={MessageSquare} label="评论总数" value={`${stats.comments}`} color="text-purple-400" />
          <StatCard icon={TrendingUp} label="今日新帖" value={`${stats.todayPosts}`} color="text-yellow-400" />
        </div>

        {/* 工具栏 */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[160px] max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜索帖子..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg text-cyber-text placeholder-gray-600 focus:outline-none focus:border-cyber-accent/50"
            />
          </div>

          <button
            onClick={() => setShowFilter(!showFilter)}
            className={cn(
              'px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all flex items-center gap-1',
              hasActiveFilter || showFilter
                ? 'bg-cyber-accent/10 text-cyber-accent border-cyber-accent/30'
                : 'text-gray-400 hover:text-cyber-text border-cyber-border/30 hover:bg-white/5'
            )}
          >
            <Filter className="w-3 h-3" />
            <span>筛选</span>
            {hasActiveFilter && <span className="w-1.5 h-1.5 rounded-full bg-cyber-accent" />}
          </button>
        </div>

        {/* Tab 切换 */}
        <div className="mt-2 flex items-center gap-1">
          {([
            { id: 'hot', label: '热门', icon: Flame },
            { id: 'new', label: '最新', icon: Clock },
            { id: 'essence', label: '精华', icon: Star },
          ] as const).map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-3 py-1.5 text-xs font-mono rounded-lg transition-all flex items-center gap-1',
                  activeTab === tab.id
                    ? 'bg-cyber-accent/15 text-cyber-accent border border-cyber-accent/30'
                    : 'text-gray-400 hover:text-cyber-text hover:bg-white/5'
                )}
              >
                <Icon className="w-3 h-3" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* 筛选面板 */}
        {showFilter && (
          <div className="mt-2 p-3 bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg space-y-2">
            <div>
              <div className="text-[10px] text-gray-500 font-mono mb-1.5">分类</div>
              <div className="flex flex-wrap gap-1.5">
                <FilterChip active={filterCategory === 'all'} onClick={() => setFilterCategory('all')}>全部</FilterChip>
                {(Object.keys(categoryConfig) as TopicCategory[]).map(cat => {
                  const c = categoryConfig[cat]
                  return (
                    <FilterChip key={cat} active={filterCategory === cat} onClick={() => setFilterCategory(cat)}>
                      {c.label}
                    </FilterChip>
                  )
                })}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500 font-mono mb-1.5">标签</div>
              <div className="flex flex-wrap gap-1.5">
                <FilterChip active={filterTag === 'all'} onClick={() => setFilterTag('all')}>全部</FilterChip>
                {allTags.map(tag => (
                  <FilterChip key={tag} active={filterTag === tag} onClick={() => setFilterTag(tag)}>
                    #{tag}
                  </FilterChip>
                ))}
              </div>
            </div>
          </div>
        )}

        {hasActiveFilter && (
          <button
            onClick={() => { setFilterCategory('all'); setFilterTag('all'); setSearchQuery('') }}
            className="mt-2 px-2 py-1 text-[10px] text-gray-500 hover:text-red-400 font-mono"
          >
            清除筛选
          </button>
        )}
      </div>

      {/* 帖子列表 */}
      <div className="flex-1 overflow-auto min-h-0 p-3 space-y-2">
        {filteredPosts.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-600 font-mono">暂无帖子</div>
        ) : (
          filteredPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onClick={() => setSelectedPost(post)}
              onLike={() => handleLike(post.id)}
              onBookmark={() => handleBookmark(post.id)}
            />
          ))
        )}
      </div>

      {/* 帖子详情 */}
      {selectedPost && (
        <PostDetailModal
          post={posts.find(p => p.id === selectedPost.id) || selectedPost}
          onClose={() => setSelectedPost(null)}
          onLike={() => handleLike(selectedPost.id)}
          onBookmark={() => handleBookmark(selectedPost.id)}
          onCommentLike={(cid) => handleCommentLike(selectedPost.id, cid)}
          onAddComment={(content) => handleAddComment(selectedPost.id, content)}
          onAddReply={(cid, content) => handleAddReply(selectedPost.id, cid, content)}
        />
      )}

      {/* 发帖编辑器 */}
      {showEditor && (
        <PostEditorModal onClose={() => setShowEditor(false)} onPublish={handlePublish} />
      )}
    </div>
  )
}

// ============ 统计卡片 ============

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: typeof Users
  label: string
  value: string
  sub?: string
  color: string
}) {
  return (
    <div className="bg-cyber-bg-secondary/60 border border-cyber-border/20 rounded-lg p-2.5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-gray-500 font-mono">{label}</span>
        <Icon className={cn('w-3 h-3', color)} />
      </div>
      <div className={cn('text-lg font-bold font-mono', color)}>{value}</div>
      {sub && <div className="text-[9px] text-gray-600 font-mono">{sub}</div>}
    </div>
  )
}

// ============ 筛选芯片 ============

function FilterChip({ active, onClick, children }: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all',
        active
          ? 'bg-cyber-accent/20 text-cyber-accent border-cyber-accent/40'
          : 'text-gray-400 hover:text-cyber-text border-cyber-border/30 hover:bg-white/5'
      )}
    >
      {children}
    </button>
  )
}

// ============ 帖子卡片 ============

function PostCard({ post, onClick, onLike, onBookmark }: {
  post: Post
  onClick: () => void
  onLike: () => void
  onBookmark: () => void
}) {
  const c = categoryConfig[post.category]
  return (
    <div
      className={cn(
        'bg-cyber-panel/60 border rounded-lg p-3 cursor-pointer hover:border-cyber-accent/40 transition-all',
        post.isPinned ? 'border-cyber-accent/40 bg-cyber-accent/5' : 'border-cyber-border/30'
      )}
      onClick={onClick}
    >
      {/* 作者信息 */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-cyber-accent/10 flex items-center justify-center text-base">
          {post.author.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-cyber-text">{post.author.name}</span>
            <span className="px-1 py-0.5 text-[9px] font-mono bg-cyber-accent/10 text-cyber-accent rounded">Lv.{post.author.level}</span>
            <span className="text-[9px] text-gray-500">{post.author.title}</span>
          </div>
          <div className="text-[10px] text-gray-500 font-mono">{formatTimeAgo(post.createdAt)}</div>
        </div>
        {/* 标记 */}
        <div className="flex items-center gap-1">
          {post.isPinned && (
            <span className="px-1.5 py-0.5 text-[9px] font-mono bg-red-500/10 text-red-400 rounded flex items-center gap-0.5">
              <Flame className="w-2.5 h-2.5" />置顶
            </span>
          )}
          {post.isEssence && (
            <span className="px-1.5 py-0.5 text-[9px] font-mono bg-yellow-500/10 text-yellow-400 rounded flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5" fill="currentColor" />精华
            </span>
          )}
          <span className={cn('px-1.5 py-0.5 text-[9px] font-mono rounded', c.bgColor, c.color)}>{c.label}</span>
        </div>
      </div>

      {/* 标题 */}
      <h3 className="text-sm font-bold text-cyber-text mb-1.5 line-clamp-1">{post.title}</h3>
      {/* 摘要 */}
      <p className="text-[11px] text-gray-400 line-clamp-2 mb-2 leading-relaxed">{post.summary}</p>
      {/* 标签 */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {post.tags.map(tag => (
            <span key={tag} className={cn('px-1.5 py-0.5 text-[9px] font-mono rounded', tagColors[tag])}>#{tag}</span>
          ))}
        </div>
      )}
      {/* 底部统计 */}
      <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); onLike() }}
            className={cn('flex items-center gap-1 hover:text-cyber-accent transition-colors', post.liked && 'text-cyber-accent')}
          >
            <ThumbsUp className="w-3 h-3" fill={post.liked ? 'currentColor' : 'none'} />
            {post.likes}
          </button>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            {post.comments.length}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {post.views}
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onBookmark() }}
          className={cn('flex items-center gap-1 hover:text-cyber-accent transition-colors', post.bookmarked && 'text-cyber-accent')}
        >
          <Bookmark className="w-3 h-3" fill={post.bookmarked ? 'currentColor' : 'none'} />
          {post.bookmarked ? '已收藏' : '收藏'}
        </button>
      </div>
    </div>
  )
}

// ============ 帖子详情弹窗 ============

function PostDetailModal({ post, onClose, onLike, onBookmark, onCommentLike, onAddComment, onAddReply }: {
  post: Post
  onClose: () => void
  onLike: () => void
  onBookmark: () => void
  onCommentLike: (commentId: string) => void
  onAddComment: (content: string) => void
  onAddReply: (commentId: string, content: string) => void
}) {
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const c = categoryConfig[post.category]

  const handleSubmitComment = () => {
    if (!newComment.trim()) return
    onAddComment(newComment)
    setNewComment('')
  }

  const handleSubmitReply = (commentId: string) => {
    if (!replyContent.trim()) return
    onAddReply(commentId, replyContent)
    setReplyContent('')
    setReplyTo(null)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div
        className="bg-cyber-bg border border-cyber-border/40 rounded-t-xl sm:rounded-xl w-full sm:max-w-2xl h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="px-4 py-3 border-b border-cyber-border/30 flex items-center justify-between">
          <button onClick={onClose} className="flex items-center gap-1 text-gray-400 hover:text-cyber-accent font-mono text-xs">
            <ChevronLeft className="w-4 h-4" />
            返回
          </button>
          <div className="flex items-center gap-2">
            {post.isEssence && <span className="px-1.5 py-0.5 text-[9px] font-mono bg-yellow-500/10 text-yellow-400 rounded">精华</span>}
            <span className={cn('px-1.5 py-0.5 text-[9px] font-mono rounded', c.bgColor, c.color)}>{c.label}</span>
          </div>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto">
          {/* 作者信息 */}
          <div className="px-4 py-3 border-b border-cyber-border/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyber-accent/10 flex items-center justify-center text-lg">
              {post.author.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-cyber-text">{post.author.name}</span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono bg-cyber-accent/10 text-cyber-accent rounded">Lv.{post.author.level}</span>
                <span className="text-[10px] text-gray-500">{post.author.title}</span>
              </div>
              <div className="text-[10px] text-gray-500 font-mono">{post.author.postCount} 帖子 · {formatTimeAgo(post.createdAt)}</div>
            </div>
            <button className="px-2 py-1 text-[10px] text-cyber-accent border border-cyber-accent/30 rounded font-mono hover:bg-cyber-accent/10">关注</button>
          </div>

          {/* 帖子正文 */}
          <div className="px-4 py-3">
            <h1 className="text-base font-bold text-cyber-text mb-2">{post.title}</h1>
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {post.tags.map(tag => (
                  <span key={tag} className={cn('px-1.5 py-0.5 text-[9px] font-mono rounded', tagColors[tag])}>#{tag}</span>
                ))}
              </div>
            )}
            <div className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>

          {/* 操作栏 */}
          <div className="px-4 py-2 border-y border-cyber-border/20 flex items-center gap-4">
            <button
              onClick={onLike}
              className={cn('flex items-center gap-1 text-xs font-mono transition-colors', post.liked ? 'text-cyber-accent' : 'text-gray-400 hover:text-cyber-accent')}
            >
              <ThumbsUp className="w-3.5 h-3.5" fill={post.liked ? 'currentColor' : 'none'} />
              {post.likes}
            </button>
            <button
              onClick={onBookmark}
              className={cn('flex items-center gap-1 text-xs font-mono transition-colors', post.bookmarked ? 'text-cyber-accent' : 'text-gray-400 hover:text-cyber-accent')}
            >
              <Bookmark className="w-3.5 h-3.5" fill={post.bookmarked ? 'currentColor' : 'none'} />
              {post.bookmarked ? '已收藏' : '收藏'}
            </button>
            <button className="flex items-center gap-1 text-xs font-mono text-gray-400 hover:text-cyber-accent">
              <Share2 className="w-3.5 h-3.5" />
              分享
            </button>
            <button className="flex items-center gap-1 text-xs font-mono text-gray-400 hover:text-red-400 ml-auto">
              <Flag className="w-3.5 h-3.5" />
              举报
            </button>
          </div>

          {/* 评论区 */}
          <div className="px-4 py-3">
            <h3 className="text-xs font-bold text-cyber-text mb-3 font-mono flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-cyber-accent" />
              评论 ({post.comments.length})
            </h3>

            {/* 评论输入 */}
            <div className="flex gap-2 mb-3">
              <input
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmitComment()}
                placeholder="说点什么..."
                className="flex-1 px-3 py-2 text-xs bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg text-cyber-text placeholder-gray-600 focus:outline-none focus:border-cyber-accent/50"
              />
              <button
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
                className="px-3 py-2 text-xs bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/30 rounded-lg hover:bg-cyber-accent/20 disabled:opacity-40 font-mono flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
              </button>
            </div>

            {/* 评论列表 */}
            <div className="space-y-3">
              {post.comments.map(comment => (
                <div key={comment.id} className="space-y-2">
                  {/* 评论 */}
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-full bg-cyber-accent/10 flex items-center justify-center text-sm flex-shrink-0">
                      {comment.author.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="bg-cyber-bg-secondary/40 rounded-lg p-2">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-xs font-bold text-cyber-text">{comment.author.name}</span>
                          <span className="px-1 py-0.5 text-[8px] font-mono bg-cyber-accent/10 text-cyber-accent rounded">Lv.{comment.author.level}</span>
                          <span className="text-[9px] text-gray-600 font-mono ml-auto">{formatTimeAgo(comment.createdAt)}</span>
                        </div>
                        <p className="text-[11px] text-gray-300">{comment.content}</p>
                      </div>
                      <div className="flex items-center gap-3 mt-1 ml-2">
                        <button
                          onClick={() => onCommentLike(comment.id)}
                          className={cn('flex items-center gap-0.5 text-[10px] font-mono transition-colors', comment.liked ? 'text-cyber-accent' : 'text-gray-500 hover:text-cyber-accent')}
                        >
                          <ThumbsUp className="w-2.5 h-2.5" fill={comment.liked ? 'currentColor' : 'none'} />
                          {comment.likes}
                        </button>
                        <button
                          onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                          className="flex items-center gap-0.5 text-[10px] font-mono text-gray-500 hover:text-cyber-accent"
                        >
                          <Reply className="w-2.5 h-2.5" />
                          回复
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 回复输入框 */}
                  {replyTo === comment.id && (
                    <div className="flex gap-2 ml-9">
                      <input
                        value={replyContent}
                        onChange={e => setReplyContent(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSubmitReply(comment.id)}
                        placeholder={`回复 ${comment.author.name}...`}
                        className="flex-1 px-2 py-1.5 text-xs bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg text-cyber-text placeholder-gray-600 focus:outline-none focus:border-cyber-accent/50"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSubmitReply(comment.id)}
                        disabled={!replyContent.trim()}
                        className="px-2 py-1.5 text-xs bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/30 rounded-lg hover:bg-cyber-accent/20 disabled:opacity-40 font-mono"
                      >
                        <Send className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* 回复列表 */}
                  {comment.replies.length > 0 && (
                    <div className="ml-9 space-y-2">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="flex gap-2">
                          <div className="w-6 h-6 rounded-full bg-cyber-accent/10 flex items-center justify-center text-xs flex-shrink-0">
                            {reply.author.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="bg-cyber-bg-secondary/30 rounded-lg p-1.5">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="text-[11px] font-bold text-cyber-text">{reply.author.name}</span>
                                <span className="px-1 py-0.5 text-[8px] font-mono bg-cyber-accent/10 text-cyber-accent rounded">Lv.{reply.author.level}</span>
                                <span className="text-[9px] text-gray-600 font-mono ml-auto">{formatTimeAgo(reply.createdAt)}</span>
                              </div>
                              <p className="text-[11px] text-gray-300">{reply.content}</p>
                            </div>
                            <button className="flex items-center gap-0.5 mt-1 ml-1 text-[10px] font-mono text-gray-500 hover:text-cyber-accent">
                              <ThumbsUp className="w-2.5 h-2.5" />
                              {reply.likes}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ 发帖编辑器 ============

function PostEditorModal({ onClose, onPublish }: {
  onClose: () => void
  onPublish: (post: Post) => void
}) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<TopicCategory>('tech')
  const [selectedTags, setSelectedTags] = useState<PostTag[]>([])

  const toggleTag = (tag: PostTag) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  const handlePublish = () => {
    if (!title.trim() || !content.trim()) return
    const post: Post = {
      id: `post_${Date.now()}`,
      author: mockUsers[0],
      title,
      content,
      summary: content.replace(/[#*`>\-\n]/g, ' ').slice(0, 120) + '...',
      category,
      tags: selectedTags.length > 0 ? selectedTags : ['分享'],
      isEssence: false,
      isPinned: false,
      likes: 0,
      comments: [],
      views: 0,
      createdAt: new Date().toISOString(),
    }
    onPublish(post)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div
        className="bg-cyber-bg border border-cyber-border/40 rounded-t-xl sm:rounded-xl w-full sm:max-w-xl h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b border-cyber-border/30 flex items-center justify-between">
          <h2 className="text-sm font-bold text-cyber-text font-mono flex items-center gap-2">
            <PenSquare className="w-4 h-4 text-cyber-accent" />
            发布新帖
          </h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-cyber-text rounded hover:bg-white/5">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* 分类 */}
          <div>
            <label className="text-[10px] text-gray-500 font-mono block mb-1">分类</label>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(categoryConfig) as TopicCategory[]).map(cat => {
                const c = categoryConfig[cat]
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      'px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all',
                      category === cat ? cn(c.bgColor, c.color, 'border-current') : 'border-cyber-border/30 text-gray-500 hover:text-cyber-text'
                    )}
                  >
                    {c.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 标题 */}
          <div>
            <label className="text-[10px] text-gray-500 font-mono block mb-1">标题 *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="帖子标题..."
              className="w-full px-3 py-2 text-sm bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg text-cyber-text placeholder-gray-600 focus:outline-none focus:border-cyber-accent/50"
            />
          </div>

          {/* 标签 */}
          <div>
            <label className="text-[10px] text-gray-500 font-mono block mb-1">标签</label>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    'px-2 py-0.5 text-[10px] font-mono rounded border transition-all',
                    selectedTags.includes(tag) ? tagColors[tag] + ' border-current' : 'border-cyber-border/30 text-gray-500 hover:text-cyber-text'
                  )}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* 内容 */}
          <div>
            <label className="text-[10px] text-gray-500 font-mono block mb-1">内容 * <span className="text-gray-600">(支持 Markdown)</span></label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="写下你的想法..."
              rows={10}
              className="w-full px-3 py-2 text-xs bg-cyber-bg-secondary border border-cyber-border/30 rounded-lg text-cyber-text placeholder-gray-600 focus:outline-none focus:border-cyber-accent/50 resize-none font-mono leading-relaxed"
            />
          </div>
        </div>

        <div className="px-4 py-3 border-t border-cyber-border/30 flex items-center justify-between">
          <span className="text-[10px] text-gray-600 font-mono">{content.length} 字符</span>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-3 py-1.5 text-xs text-gray-400 hover:text-cyber-text font-mono">取消</button>
            <button
              onClick={handlePublish}
              disabled={!title.trim() || !content.trim()}
              className="px-4 py-1.5 text-xs bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/30 rounded-lg hover:bg-cyber-accent/20 disabled:opacity-40 disabled:cursor-not-allowed font-mono flex items-center gap-1"
            >
              <Send className="w-3 h-3" />
              发布
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ 工具函数 ============

function formatTimeAgo(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  if (diff < 7 * 86400000) return `${Math.floor(diff / 86400000)}天前`
  return `${d.getMonth() + 1}/${d.getDate()}`
}
