import { useState } from 'react'
import {
  User,
  Mail,
  Phone,
  Tag,
  Shield,
  Lock,
  Key,
  Smartphone,
  Globe,
  Clock,
  Bell,
  Palette,
  Eye,
  EyeOff,
  Check,
  X,
  Plus,
  Trash2,
  Download,
  AlertTriangle,
  Award,
  Trophy,
  Zap,
  TrendingUp,
  Star,
  Calendar,
  MapPin,
  Monitor,
  Chrome,
  Apple,
  LogOut,
  Copy,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  Info,
  Settings as SettingsIcon,
  Cpu,
  Activity,
  Target,
  Sparkles,
  Fingerprint,
  FileText,
  CheckCircle2,
  Circle,
  MessageSquare,
  Wrench,
  BookOpen,
  Crown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// 用户信息类型定义
interface UserProfile {
  avatar: string
  nickname: string
  email: string
  phone: string
  bio: string
  tags: string[]
  joinDate: string
  userId: string
}

// 登录设备类型
interface LoginDevice {
  id: string
  device: string
  browser: string
  ip: string
  location: string
  lastActive: string
  current: boolean
  icon: typeof Monitor
}

// 登录历史记录
interface LoginHistory {
  id: string
  time: string
  ip: string
  device: string
  location: string
  status: 'success' | 'failed'
}

// API Key 信息
interface ApiKey {
  id: string
  name: string
  key: string
  createdAt: string
  lastUsed: string
  status: 'active' | 'revoked'
  permissions: string[]
}

// 已授权应用
interface AuthorizedApp {
  id: string
  name: string
  description: string
  icon: string
  authorizedAt: string
  scopes: string[]
}

// 成就徽章
interface Achievement {
  id: string
  name: string
  description: string
  icon: typeof Award
  unlocked: boolean
  unlockedAt?: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  progress?: number
}

// 用户偏好设置
interface UserPreferences {
  language: string
  timezone: string
  theme: string
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
    desktop: boolean
  }
}

// 模拟用户数据
const mockUser: UserProfile = {
  avatar: '👤',
  nickname: 'CyberUser_001',
  email: 'cyberuser@hopeagent.pro',
  phone: '138****8888',
  bio: 'HopeAgent 重度用户 · 全栈开发者 · AI 探索者 · 致力于用智能改变工作流',
  tags: ['开发者', 'AI爱好者', '效率至上', '极客'],
  joinDate: '2024-01-15',
  userId: 'HA-2024-001888',
}

// 登录设备列表
const mockDevices: LoginDevice[] = [
  { id: 'd1', device: 'MacBook Pro', browser: 'Chrome 121', ip: '192.168.1.100', location: '中国·上海', lastActive: '当前会话', current: true, icon: Monitor },
  { id: 'd2', device: 'iPhone 15 Pro', browser: 'Safari Mobile', ip: '10.0.0.55', location: '中国·上海', lastActive: '2小时前', current: false, icon: Smartphone },
  { id: 'd3', device: 'Windows PC', browser: 'Edge 121', ip: '203.0.113.45', location: '中国·北京', lastActive: '昨天 18:32', current: false, icon: Monitor },
  { id: 'd4', device: 'iPad Air', browser: 'Safari', ip: '172.16.0.10', location: '中国·杭州', lastActive: '3天前', current: false, icon: Apple },
]

// 登录历史
const mockLoginHistory: LoginHistory[] = [
  { id: 'h1', time: '2026-07-13 09:15:22', ip: '192.168.1.100', device: 'MacBook Pro / Chrome', location: '上海', status: 'success' },
  { id: 'h2', time: '2026-07-13 07:42:10', ip: '10.0.0.55', device: 'iPhone 15 Pro / Safari', location: '上海', status: 'success' },
  { id: 'h3', time: '2026-07-12 22:18:45', ip: '192.168.1.100', device: 'MacBook Pro / Chrome', location: '上海', status: 'success' },
  { id: 'h4', time: '2026-07-12 14:23:08', ip: '203.0.113.45', device: 'Windows PC / Edge', location: '北京', status: 'success' },
  { id: 'h5', time: '2026-07-11 10:05:33', ip: '198.51.100.22', device: '未知设备 / Firefox', location: '未知', status: 'failed' },
  { id: 'h6', time: '2026-07-11 09:58:21', ip: '192.168.1.100', device: 'MacBook Pro / Chrome', location: '上海', status: 'success' },
  { id: 'h7', time: '2026-07-10 16:45:12', ip: '192.168.1.100', device: 'MacBook Pro / Chrome', location: '上海', status: 'success' },
  { id: 'h8', time: '2026-07-10 08:30:00', ip: '172.16.0.10', device: 'iPad Air / Safari', location: '杭州', status: 'success' },
]

// API Keys
const mockApiKeys: ApiKey[] = [
  { id: 'k1', name: '生产环境密钥', key: 'ha_prod_xxxxxxxxxxxx8888', createdAt: '2024-03-15', lastUsed: '10分钟前', status: 'active', permissions: ['chat', 'knowledge', 'tools'] },
  { id: 'k2', name: '测试环境密钥', key: 'ha_test_xxxxxxxxxxxx6666', createdAt: '2024-05-20', lastUsed: '2小时前', status: 'active', permissions: ['chat', 'knowledge'] },
  { id: 'k3', name: '只读分析密钥', key: 'ha_read_xxxxxxxxxxxx9999', createdAt: '2024-08-10', lastUsed: '昨天', status: 'active', permissions: ['analytics'] },
]

// 已授权应用
const mockApps: AuthorizedApp[] = [
  { id: 'a1', name: 'GitHub集成', description: '同步代码仓库与提交记录', icon: '🔗', authorizedAt: '2024-06-12', scopes: ['读取仓库', '提交评论'] },
  { id: 'a2', name: '飞书机器人', description: '接收 HopeAgent 通知推送', icon: '🤖', authorizedAt: '2024-07-22', scopes: ['发送消息', '读取群组'] },
  { id: 'a3', name: 'Zapier自动化', description: '连接数千种应用与服务', icon: '⚡', authorizedAt: '2024-09-05', scopes: ['触发工作流'] },
  { id: 'a4', name: 'Notion同步', description: '导出知识库到 Notion', icon: '📝', authorizedAt: '2024-11-18', scopes: ['写入页面', '读取数据库'] },
]

// 成就徽章列表
const achievements: Achievement[] = [
  { id: 'ach1', name: '初出茅庐', description: '完成首次对话', icon: Star, unlocked: true, unlockedAt: '2024-01-15', rarity: 'common' },
  { id: 'ach2', name: '好奇宝宝', description: '创建 10 个对话', icon: Sparkles, unlocked: true, unlockedAt: '2024-01-20', rarity: 'common' },
  { id: 'ach3', name: '知识收藏家', description: '添加 50 条知识', icon: BookOpen, unlocked: true, unlockedAt: '2024-03-08', rarity: 'common' },
  { id: 'ach4', name: '工具达人', description: '使用 20 种不同工具', icon: Zap, unlocked: true, unlockedAt: '2024-04-12', rarity: 'rare' },
  { id: 'ach5', name: 'Agent指挥官', description: '调用 Agent 100 次', icon: Cpu, unlocked: true, unlockedAt: '2024-05-30', rarity: 'rare' },
  { id: 'ach6', name: '效率专家', description: '连续 7 天使用', icon: TrendingUp, unlocked: true, unlockedAt: '2024-06-18', rarity: 'rare' },
  { id: 'ach7', name: '工作流大师', description: '创建 5 个工作流', icon: Activity, unlocked: true, unlockedAt: '2024-08-22', rarity: 'epic' },
  { id: 'ach8', name: '插件开发者', description: '发布自定义插件', icon: Award, unlocked: true, unlockedAt: '2024-10-15', rarity: 'epic' },
  { id: 'ach9', name: '社区贡献者', description: '分享 10 个模板', icon: Trophy, unlocked: true, unlockedAt: '2024-12-01', rarity: 'epic' },
  { id: 'ach10', name: '里程碑', description: '累计对话 1000 次', icon: Target, unlocked: true, unlockedAt: '2025-02-14', rarity: 'epic' },
  { id: 'ach11', name: '代码勇士', description: '执行 500 次代码', icon: FileText, unlocked: false, rarity: 'legendary', progress: 78 },
  { id: 'ach12', name: '传奇用户', description: '使用满 365 天', icon: Trophy, unlocked: false, rarity: 'legendary', progress: 92 },
  { id: 'ach13', name: '全能王', description: '解锁所有功能模块', icon: Crown, unlocked: false, rarity: 'legendary', progress: 85 },
]

// 用户等级信息
const userLevel = {
  level: 18,
  title: '高级智能官',
  exp: 8650,
  nextLevelExp: 10000,
  totalExp: 8650,
}

// 使用统计
const usageStats = {
  totalChats: 1284,
  totalMessages: 18456,
  totalTokens: 2847650,
  knowledgeCount: 156,
  agentCalls: 892,
  toolCalls: 3267,
  workflowRuns: 234,
  activeDays: 546,
}

// 语言选项
const languageOptions = [
  { id: 'zh-CN', label: '简体中文' },
  { id: 'zh-TW', label: '繁體中文' },
  { id: 'en', label: 'English' },
  { id: 'ja', label: '日本語' },
  { id: 'ko', label: '한국어' },
  { id: 'fr', label: 'Français' },
]

// 时区选项
const timezoneOptions = [
  { id: 'Asia/Shanghai', label: '亚洲/上海 (UTC+8)' },
  { id: 'Asia/Tokyo', label: '亚洲/东京 (UTC+9)' },
  { id: 'Asia/Singapore', label: '亚洲/新加坡 (UTC+8)' },
  { id: 'America/New_York', label: '美东/纽约 (UTC-5)' },
  { id: 'America/Los_Angeles', label: '美西/洛杉矶 (UTC-8)' },
  { id: 'Europe/London', label: '欧洲/伦敦 (UTC+0)' },
]

// 主题选项
const themeOptions = [
  { id: 'cyber-dark', label: '赛博暗黑', color: '#00ff88' },
  { id: 'cyber-blue', label: '赛博蓝调', color: '#00d4ff' },
  { id: 'neon-purple', label: '霓虹紫', color: '#c084fc' },
  { id: 'matrix-green', label: '矩阵绿', color: '#10b981' },
  { id: 'sunset-orange', label: '日落橙', color: '#fb923c' },
]

// 等级进度计算
const levelProgress = (userLevel.exp / userLevel.nextLevelExp) * 100

// Tab 配置
const profileTabs = [
  { id: 'info', label: '基本信息', icon: User },
  { id: 'security', label: '安全设置', icon: Shield },
  { id: 'preferences', label: '偏好设置', icon: SettingsIcon },
  { id: 'apikey', label: 'API密钥', icon: Key },
  { id: 'history', label: '登录历史', icon: Clock },
  { id: 'permissions', label: '数据权限', icon: Lock },
  { id: 'level', label: '等级成就', icon: Trophy },
  { id: 'actions', label: '账号操作', icon: AlertTriangle },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('info')
  const [editing, setEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [twoFAEnabled, setTwoFAEnabled] = useState(true)
  const [newTag, setNewTag] = useState('')
  const [tags, setTags] = useState(mockUser.tags)
  const [showApiKey, setShowApiKey] = useState<string | null>(null)
  const [showNewKeyModal, setShowNewKeyModal] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [apiKeys, setApiKeys] = useState(mockApiKeys)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [preferences, setPreferences] = useState<UserPreferences>({
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    theme: 'cyber-dark',
    notifications: { email: true, push: true, sms: false, desktop: true },
  })
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  // 复制 API Key 到剪贴板
  const handleCopyKey = (key: string, id: string) => {
    navigator.clipboard?.writeText(key)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // 添加新标签
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 8) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  // 删除标签
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  // 生成新 API Key
  const handleGenerateKey = () => {
    if (!newKeyName.trim()) return
    const newKey: ApiKey = {
      id: `k${Date.now()}`,
      name: newKeyName,
      key: `ha_prod_${Math.random().toString(36).substring(2, 18)}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: '从未使用',
      status: 'active',
      permissions: ['chat'],
    }
    setApiKeys([newKey, ...apiKeys])
    setNewKeyName('')
    setShowNewKeyModal(false)
  }

  // 吊销 API Key
  const handleRevokeKey = (id: string) => {
    setApiKeys(apiKeys.map(k => k.id === id ? { ...k, status: 'revoked' as const } : k))
  }

  // 删除 API Key
  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter(k => k.id !== id))
  }

  // 渲染基本信息
  const renderInfoTab = () => (
    <div className="space-y-3">
      {/* 头像与基本信息卡 */}
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <div className="flex items-start gap-4">
          {/* 头像 */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyber-accent/20 to-cyber-accent2/20 border-2 border-cyber-accent/40 flex items-center justify-center text-4xl">
              {mockUser.avatar}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-cyber-accent text-cyber-bg flex items-center justify-center hover:bg-cyber-accent2 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {/* 信息 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-bold text-cyber-text truncate">{mockUser.nickname}</h3>
              <span className="px-2 py-0.5 rounded-full bg-cyber-accent/10 border border-cyber-accent/30 text-[10px] font-mono text-cyber-accent">
                Lv.{userLevel.level}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-mono mb-2">ID: {mockUser.userId}</p>
            <p className="text-xs text-gray-400 leading-relaxed">{mockUser.bio}</p>
          </div>
          {/* 编辑按钮 */}
          <button
            onClick={() => setEditing(!editing)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex-shrink-0',
              editing
                ? 'bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/30'
                : 'bg-white/[0.03] text-gray-400 border border-cyber-border/50 hover:border-cyber-accent/30'
            )}
          >
            {editing ? '完成' : '编辑'}
          </button>
        </div>
      </div>

      {/* 资料详情 */}
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4 space-y-3">
        {/* 邮箱 */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyber-accent2/10 border border-cyber-accent2/30 flex items-center justify-center flex-shrink-0">
            <Mail className="w-4 h-4 text-cyber-accent2" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-500 font-mono uppercase">邮箱</p>
            {editing ? (
              <input
                defaultValue={mockUser.email}
                className="w-full bg-transparent border-b border-cyber-border focus:border-cyber-accent outline-none text-sm text-cyber-text py-0.5"
              />
            ) : (
              <p className="text-sm text-cyber-text truncate">{mockUser.email}</p>
            )}
          </div>
          <Check className="w-3.5 h-3.5 text-cyber-accent" />
        </div>

        {/* 手机 */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyber-accent3/10 border border-cyber-accent3/30 flex items-center justify-center flex-shrink-0">
            <Phone className="w-4 h-4 text-cyber-accent3" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-500 font-mono uppercase">手机号</p>
            {editing ? (
              <input
                defaultValue={mockUser.phone}
                className="w-full bg-transparent border-b border-cyber-border focus:border-cyber-accent outline-none text-sm text-cyber-text py-0.5"
              />
            ) : (
              <p className="text-sm text-cyber-text truncate">{mockUser.phone}</p>
            )}
          </div>
          <Check className="w-3.5 h-3.5 text-cyber-accent" />
        </div>

        {/* 昵称 */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyber-accent/10 border border-cyber-accent/30 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-cyber-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-500 font-mono uppercase">昵称</p>
            {editing ? (
              <input
                defaultValue={mockUser.nickname}
                className="w-full bg-transparent border-b border-cyber-border focus:border-cyber-accent outline-none text-sm text-cyber-text py-0.5"
              />
            ) : (
              <p className="text-sm text-cyber-text truncate">{mockUser.nickname}</p>
            )}
          </div>
        </div>

        {/* 简介 */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-500 font-mono uppercase">个人简介</p>
            {editing ? (
              <textarea
                defaultValue={mockUser.bio}
                rows={2}
                className="w-full bg-white/[0.02] border border-cyber-border focus:border-cyber-accent outline-none text-sm text-cyber-text p-2 rounded-lg resize-none"
              />
            ) : (
              <p className="text-sm text-gray-300 leading-relaxed">{mockUser.bio}</p>
            )}
          </div>
        </div>

        {/* 标签 */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center flex-shrink-0">
            <Tag className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-500 font-mono uppercase mb-1.5">个性标签</p>
            <div className="flex flex-wrap gap-1.5">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyber-accent/10 border border-cyber-accent/30 text-[11px] text-cyber-accent"
                >
                  {tag}
                  {editing && (
                    <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
              {editing && tags.length < 8 && (
                <div className="inline-flex items-center gap-1">
                  <input
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddTag()}
                    placeholder="添加标签"
                    className="w-20 bg-transparent border-b border-cyber-border focus:border-cyber-accent outline-none text-[11px] text-cyber-text py-0.5"
                  />
                  <button onClick={handleAddTag} className="text-cyber-accent hover:text-cyber-accent2">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 注册日期 */}
        <div className="flex items-center gap-3 pt-2 border-t border-cyber-border/30">
          <div className="w-9 h-9 rounded-lg bg-gray-500/10 border border-gray-500/30 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-gray-500 font-mono uppercase">注册日期</p>
            <p className="text-sm text-gray-300">{mockUser.joinDate} · 已使用 {usageStats.activeDays} 天</p>
          </div>
        </div>
      </div>
    </div>
  )

  // 渲染安全设置
  const renderSecurityTab = () => (
    <div className="space-y-3">
      {/* 修改密码 */}
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h3 className="text-sm font-bold text-cyber-text flex items-center gap-2 mb-3">
          <Lock className="w-4 h-4 text-cyber-accent" />
          修改密码
        </h3>
        <div className="space-y-2.5">
          <div>
            <label className="text-[10px] text-gray-500 font-mono uppercase">当前密码</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="输入当前密码"
                className="w-full bg-white/[0.02] border border-cyber-border focus:border-cyber-accent outline-none rounded-lg px-3 py-2 text-sm text-cyber-text pr-10"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyber-accent"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-mono uppercase">新密码</label>
            <input
              type="password"
              placeholder="至少 8 位，包含大小写字母和数字"
              className="w-full bg-white/[0.02] border border-cyber-border focus:border-cyber-accent outline-none rounded-lg px-3 py-2 text-sm text-cyber-text mt-1"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-mono uppercase">确认新密码</label>
            <input
              type="password"
              placeholder="再次输入新密码"
              className="w-full bg-white/[0.02] border border-cyber-border focus:border-cyber-accent outline-none rounded-lg px-3 py-2 text-sm text-cyber-text mt-1"
            />
          </div>
          {/* 密码强度指示 */}
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[10px] text-gray-500 font-mono">强度:</span>
            <div className="flex gap-1 flex-1">
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className={cn(
                    'h-1 flex-1 rounded-full',
                    i <= 3 ? 'bg-cyber-accent' : 'bg-cyber-border'
                  )}
                />
              ))}
            </div>
            <span className="text-[10px] font-mono text-cyber-accent">强</span>
          </div>
          <button className="w-full mt-2 py-2 rounded-lg bg-cyber-accent/20 border border-cyber-accent/30 text-cyber-accent text-sm font-mono hover:bg-cyber-accent/30 transition-all">
            更新密码
          </button>
        </div>
      </div>

      {/* 二步验证 */}
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-cyber-text flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-cyber-accent2" />
            二步验证 (2FA)
          </h3>
          <button
            onClick={() => setTwoFAEnabled(!twoFAEnabled)}
            className={cn(
              'relative w-11 h-6 rounded-full transition-colors',
              twoFAEnabled ? 'bg-cyber-accent/40' : 'bg-cyber-border'
            )}
          >
            <div className={cn(
              'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform',
              twoFAEnabled ? 'translate-x-5' : 'translate-x-0.5'
            )} />
          </button>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed mb-3">
          开启二步验证后，登录时需要输入手机验证码或使用 Authenticator 应用扫码确认，为账号提供额外保护。
        </p>
        {twoFAEnabled && (
          <div className="space-y-2 pt-2 border-t border-cyber-border/30">
            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2">
                <Smartphone className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs text-gray-300">短信验证码</span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-cyber-accent" />
            </div>
            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs text-gray-300">Authenticator 应用</span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-cyber-accent" />
            </div>
            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2">
                <Key className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs text-gray-300">备用恢复码</span>
              </div>
              <span className="text-[10px] text-yellow-400 font-mono">8/10 剩余</span>
            </div>
          </div>
        )}
      </div>

      {/* 登录设备管理 */}
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h3 className="text-sm font-bold text-cyber-text flex items-center gap-2 mb-3">
          <Monitor className="w-4 h-4 text-cyber-accent" />
          登录设备管理
        </h3>
        <div className="space-y-2">
          {mockDevices.map(device => {
            const Icon = device.icon
            return (
              <div
                key={device.id}
                className={cn(
                  'flex items-center gap-3 p-2.5 rounded-lg border transition-colors',
                  device.current
                    ? 'bg-cyber-accent/5 border-cyber-accent/30'
                    : 'bg-white/[0.02] border-cyber-border/50 hover:border-cyber-accent/20'
                )}
              >
                <div className="w-9 h-9 rounded-lg bg-white/[0.03] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-cyber-text truncate">{device.device}</span>
                    {device.current && (
                      <span className="px-1.5 py-0.5 rounded bg-cyber-accent/20 text-cyber-accent text-[9px] font-mono">
                        当前
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-500 font-mono truncate">
                    {device.browser} · {device.ip}
                  </p>
                  <p className="text-[10px] text-gray-600 mt-0.5">
                    {device.location} · {device.lastActive}
                  </p>
                </div>
                {!device.current && (
                  <button className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors">
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )
          })}
        </div>
        <button className="w-full mt-3 py-2 rounded-lg border border-cyber-border text-gray-400 text-xs font-mono hover:border-red-500/30 hover:text-red-400 transition-all">
          注销所有其他设备
        </button>
      </div>
    </div>
  )

  // 渲染偏好设置
  const renderPreferencesTab = () => (
    <div className="space-y-3">
      {/* 语言 */}
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h3 className="text-sm font-bold text-cyber-text flex items-center gap-2 mb-3">
          <Globe className="w-4 h-4 text-cyber-accent" />
          语言
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {languageOptions.map(lang => (
            <button
              key={lang.id}
              onClick={() => setPreferences({ ...preferences, language: lang.id })}
              className={cn(
                'px-3 py-2 rounded-lg text-xs font-mono transition-all text-left',
                preferences.language === lang.id
                  ? 'bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent'
                  : 'bg-white/[0.02] border border-cyber-border/50 text-gray-400 hover:border-cyber-accent/20'
              )}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* 时区 */}
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h3 className="text-sm font-bold text-cyber-text flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-cyber-accent2" />
          时区
        </h3>
        <div className="space-y-1.5">
          {timezoneOptions.map(tz => (
            <button
              key={tz.id}
              onClick={() => setPreferences({ ...preferences, timezone: tz.id })}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-all',
                preferences.timezone === tz.id
                  ? 'bg-cyber-accent2/10 border border-cyber-accent2/30 text-cyber-accent2'
                  : 'bg-white/[0.02] border border-cyber-border/50 text-gray-400 hover:border-cyber-accent2/20'
              )}
            >
              <span>{tz.label}</span>
              {preferences.timezone === tz.id && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* 主题 */}
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h3 className="text-sm font-bold text-cyber-text flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-cyber-accent3" />
          主题外观
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {themeOptions.map(theme => (
            <button
              key={theme.id}
              onClick={() => setPreferences({ ...preferences, theme: theme.id })}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                preferences.theme === theme.id
                  ? 'bg-white/[0.05] border border-cyber-accent/40'
                  : 'bg-white/[0.02] border border-cyber-border/50 hover:border-cyber-accent/20'
              )}
            >
              <div
                className="w-5 h-5 rounded-full flex-shrink-0"
                style={{ background: theme.color, boxShadow: `0 0 10px ${theme.color}80` }}
              />
              <span className="text-sm text-gray-300 flex-1 text-left">{theme.label}</span>
              {preferences.theme === theme.id && (
                <Check className="w-4 h-4 text-cyber-accent" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 通知偏好 */}
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h3 className="text-sm font-bold text-cyber-text flex items-center gap-2 mb-3">
          <Bell className="w-4 h-4 text-yellow-400" />
          通知偏好
        </h3>
        <div className="space-y-1">
          {([
            { key: 'email', label: '邮件通知', desc: '重要事件通过邮件提醒' },
            { key: 'push', label: '推送通知', desc: '移动端 App 推送' },
            { key: 'sms', label: '短信通知', desc: '紧急安全事件短信提醒' },
            { key: 'desktop', label: '桌面通知', desc: '浏览器桌面通知' },
          ] as const).map(item => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <div className="flex-1 min-w-0 pr-3">
                <p className="text-sm text-gray-300">{item.label}</p>
                <p className="text-[10px] text-gray-500 font-mono">{item.desc}</p>
              </div>
              <button
                onClick={() => setPreferences({
                  ...preferences,
                  notifications: {
                    ...preferences.notifications,
                    [item.key]: !preferences.notifications[item.key],
                  }
                })}
                className={cn(
                  'relative w-11 h-6 rounded-full transition-colors flex-shrink-0',
                  preferences.notifications[item.key] ? 'bg-cyber-accent/40' : 'bg-cyber-border'
                )}
              >
                <div className={cn(
                  'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform',
                  preferences.notifications[item.key] ? 'translate-x-5' : 'translate-x-0.5'
                )} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // 渲染 API Key 管理
  const renderApikeyTab = () => (
    <div className="space-y-3">
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-cyber-text flex items-center gap-2">
            <Key className="w-4 h-4 text-cyber-accent" />
            API 密钥管理
          </h3>
          <button
            onClick={() => setShowNewKeyModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent text-xs font-mono hover:bg-cyber-accent/20 transition-all"
          >
            <Plus className="w-3 h-3" />
            新建密钥
          </button>
        </div>
        <p className="text-[11px] text-gray-500 mb-3 leading-relaxed">
          API 密钥用于访问 HopeAgent REST API。请妥善保管，不要泄露给第三方。已吊销的密钥将立即失效。
        </p>

        {/* 密钥列表 */}
        <div className="space-y-2">
          {apiKeys.length === 0 && (
            <p className="text-xs text-gray-600 text-center py-6">暂无 API 密钥</p>
          )}
          {apiKeys.map(apiKey => (
            <div
              key={apiKey.id}
              className={cn(
                'p-3 rounded-lg border',
                apiKey.status === 'active'
                  ? 'bg-white/[0.02] border-cyber-border/50'
                  : 'bg-red-500/5 border-red-500/20 opacity-60'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm text-cyber-text truncate">{apiKey.name}</span>
                  <span className={cn(
                    'px-1.5 py-0.5 rounded text-[9px] font-mono',
                    apiKey.status === 'active'
                      ? 'bg-cyber-accent/15 text-cyber-accent'
                      : 'bg-red-500/15 text-red-400'
                  )}>
                    {apiKey.status === 'active' ? '活跃' : '已吊销'}
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleCopyKey(apiKey.key, apiKey.id)}
                    className="p-1 rounded hover:bg-white/5 text-gray-500 hover:text-cyber-accent transition-colors"
                    title="复制"
                  >
                    {copiedId === apiKey.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  {apiKey.status === 'active' && (
                    <>
                      <button
                        onClick={() => setShowApiKey(showApiKey === apiKey.id ? null : apiKey.id)}
                        className="p-1 rounded hover:bg-white/5 text-gray-500 hover:text-cyber-accent transition-colors"
                        title={showApiKey === apiKey.id ? '隐藏' : '查看'}
                      >
                        {showApiKey === apiKey.id ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleRevokeKey(apiKey.id)}
                        className="p-1 rounded hover:bg-red-500/10 text-gray-500 hover:text-yellow-400 transition-colors"
                        title="吊销"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDeleteKey(apiKey.id)}
                    className="p-1 rounded hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {/* 密钥值 */}
              <div className="flex items-center gap-2 bg-cyber-bg/50 rounded px-2 py-1.5 mb-2">
                <code className="text-[11px] font-mono text-cyber-accent2 flex-1 truncate">
                  {showApiKey === apiKey.id ? apiKey.key : `${apiKey.key.substring(0, 8)}${'•'.repeat(16)}${apiKey.key.slice(-4)}`}
                </code>
              </div>
              {/* 权限与时间 */}
              <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
                <div className="flex items-center gap-1 flex-wrap">
                  {apiKey.permissions.map(p => (
                    <span key={p} className="px-1.5 py-0.5 rounded bg-white/[0.03] text-gray-400">
                      {p}
                    </span>
                  ))}
                </div>
                <span>创建: {apiKey.createdAt}</span>
              </div>
              <p className="text-[10px] text-gray-600 mt-1">最后使用: {apiKey.lastUsed}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 新建密钥弹窗 */}
      {showNewKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowNewKeyModal(false)}>
          <div className="bg-cyber-panel border border-cyber-accent/30 rounded-xl p-4 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-cyber-text mb-3 flex items-center gap-2">
              <Key className="w-4 h-4 text-cyber-accent" />
              新建 API 密钥
            </h3>
            <input
              value={newKeyName}
              onChange={e => setNewKeyName(e.target.value)}
              placeholder="密钥名称，如：生产环境"
              className="w-full bg-white/[0.02] border border-cyber-border focus:border-cyber-accent outline-none rounded-lg px-3 py-2 text-sm text-cyber-text mb-3"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowNewKeyModal(false)}
                className="flex-1 py-2 rounded-lg border border-cyber-border text-gray-400 text-sm font-mono hover:bg-white/5 transition-all"
              >
                取消
              </button>
              <button
                onClick={handleGenerateKey}
                disabled={!newKeyName.trim()}
                className="flex-1 py-2 rounded-lg bg-cyber-accent/20 border border-cyber-accent/30 text-cyber-accent text-sm font-mono hover:bg-cyber-accent/30 transition-all disabled:opacity-50"
              >
                生成
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // 渲染登录历史
  const renderHistoryTab = () => (
    <div className="space-y-3">
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h3 className="text-sm font-bold text-cyber-text flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-cyber-accent" />
          登录历史
        </h3>
        <p className="text-[11px] text-gray-500 mb-3">最近 30 天的登录记录，如有异常请立即修改密码。</p>
        <div className="space-y-2">
          {mockLoginHistory.map(record => (
            <div
              key={record.id}
              className="flex items-start gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-cyber-border/30 hover:border-cyber-accent/20 transition-colors"
            >
              <div className={cn(
                'w-2 h-2 rounded-full mt-1.5 flex-shrink-0',
                record.status === 'success' ? 'bg-cyber-accent' : 'bg-red-500'
              )} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-cyber-text font-mono truncate">{record.time}</span>
                  <span className={cn(
                    'text-[10px] font-mono flex-shrink-0',
                    record.status === 'success' ? 'text-cyber-accent' : 'text-red-400'
                  )}>
                    {record.status === 'success' ? '成功' : '失败'}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-500 font-mono">
                  <span className="flex items-center gap-1">
                    <Monitor className="w-3 h-3" />
                    {record.device}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {record.location}
                  </span>
                </div>
                <p className="text-[10px] text-gray-600 font-mono mt-0.5">IP: {record.ip}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-3 py-2 rounded-lg border border-cyber-border text-gray-400 text-xs font-mono hover:border-cyber-accent/30 hover:text-cyber-accent transition-all flex items-center justify-center gap-1.5">
          <Download className="w-3.5 h-3.5" />
          导出登录记录
        </button>
      </div>
    </div>
  )

  // 渲染数据权限
  const renderPermissionsTab = () => (
    <div className="space-y-3">
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h3 className="text-sm font-bold text-cyber-text flex items-center gap-2 mb-3">
          <Lock className="w-4 h-4 text-cyber-accent" />
          已授权应用
        </h3>
        <p className="text-[11px] text-gray-500 mb-3">以下应用已获得访问你 HopeAgent 数据的权限。</p>
        <div className="space-y-2">
          {mockApps.map(app => (
            <div
              key={app.id}
              className="p-3 rounded-lg bg-white/[0.02] border border-cyber-border/50 hover:border-cyber-accent/20 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/[0.03] flex items-center justify-center text-xl flex-shrink-0">
                  {app.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-cyber-text">{app.name}</span>
                    <button className="text-[10px] text-red-400 font-mono hover:text-red-300">
                      撤销授权
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">{app.description}</p>
                  <div className="flex items-center gap-1 flex-wrap mt-1.5">
                    {app.scopes.map(scope => (
                      <span key={scope} className="px-1.5 py-0.5 rounded bg-cyber-accent2/10 text-cyber-accent2 text-[9px] font-mono">
                        {scope}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-600 font-mono mt-1">授权于: {app.authorizedAt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 数据使用说明 */}
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h3 className="text-sm font-bold text-cyber-text flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-cyber-accent2" />
          数据使用说明
        </h3>
        <ul className="space-y-2 text-xs text-gray-400">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyber-accent mt-0.5 flex-shrink-0" />
            <span>你的对话内容采用端到端加密，仅你可读</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyber-accent mt-0.5 flex-shrink-0" />
            <span>知识库数据存储在本地浏览器，不会上传服务器</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyber-accent mt-0.5 flex-shrink-0" />
            <span>授权应用仅能访问你明确许可的范围</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyber-accent mt-0.5 flex-shrink-0" />
            <span>可随时撤销授权，撤销后立即停止数据访问</span>
          </li>
        </ul>
      </div>
    </div>
  )

  // 渲染等级与成就
  const renderLevelTab = () => {
    const rarityColors = {
      common: 'text-gray-400 border-gray-500/30 bg-gray-500/5',
      rare: 'text-cyber-accent2 border-cyber-accent2/30 bg-cyber-accent2/5',
      epic: 'text-purple-400 border-purple-500/30 bg-purple-500/5',
      legendary: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/5',
    }
    const rarityLabels = {
      common: '普通',
      rare: '稀有',
      epic: '史诗',
      legendary: '传说',
    }

    return (
      <div className="space-y-3">
        {/* 等级卡片 */}
        <div className="bg-gradient-to-br from-cyber-accent/10 to-cyber-accent2/10 border border-cyber-accent/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold font-mono text-cyber-accent">Lv.{userLevel.level}</span>
                <span className="px-2 py-0.5 rounded-full bg-cyber-accent/20 text-cyber-accent text-[10px] font-mono">
                  {userLevel.title}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-mono mt-1">
                经验值: {userLevel.exp.toLocaleString()} / {userLevel.nextLevelExp.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto" />
              <p className="text-[10px] text-gray-500 mt-1">距下一级</p>
              <p className="text-xs text-cyber-accent font-mono">{userLevel.nextLevelExp - userLevel.exp} EXP</p>
            </div>
          </div>
          {/* 进度条 */}
          <div className="relative h-2.5 bg-cyber-bg/60 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyber-accent to-cyber-accent2 rounded-full transition-all"
              style={{ width: `${levelProgress}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-[9px] font-mono text-white/80">
              {levelProgress.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* 使用统计 */}
        <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
          <h3 className="text-sm font-bold text-cyber-text flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-cyber-accent" />
            使用统计
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: '总对话数', value: usageStats.totalChats, icon: MessageSquare, color: '#00ff88' },
              { label: '总消息数', value: usageStats.totalMessages, icon: Mail, color: '#00d4ff' },
              { label: 'Token 用量', value: usageStats.totalTokens, icon: Zap, color: '#c084fc' },
              { label: '知识条目', value: usageStats.knowledgeCount, icon: BookOpen, color: '#f472b6' },
              { label: 'Agent 调用', value: usageStats.agentCalls, icon: Cpu, color: '#fbbf24' },
              { label: '工具调用', value: usageStats.toolCalls, icon: Wrench, color: '#34d399' },
              { label: '工作流执行', value: usageStats.workflowRuns, icon: Activity, color: '#60a5fa' },
              { label: '活跃天数', value: usageStats.activeDays, icon: Calendar, color: '#fb923c' },
            ].map(stat => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="p-2.5 rounded-lg bg-white/[0.02] border border-cyber-border/40">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className="w-3 h-3" style={{ color: stat.color }} />
                    <span className="text-[10px] text-gray-500 font-mono">{stat.label}</span>
                  </div>
                  <p className="text-sm font-bold font-mono" style={{ color: stat.color }}>
                    {stat.value.toLocaleString()}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* 成就徽章 */}
        <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-cyber-text flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-400" />
              成就徽章
            </h3>
            <span className="text-[10px] font-mono text-gray-500">
              {achievements.filter(a => a.unlocked).length} / {achievements.length}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {achievements.map(ach => {
              const Icon = ach.icon
              return (
                <div
                  key={ach.id}
                  className={cn(
                    'p-2.5 rounded-lg border text-center transition-all',
                    ach.unlocked
                      ? rarityColors[ach.rarity]
                      : 'border-cyber-border/30 bg-white/[0.01] opacity-50'
                  )}
                >
                  <Icon className={cn(
                    'w-6 h-6 mx-auto mb-1',
                    ach.unlocked ? 'text-current' : 'text-gray-600'
                  )} />
                  <p className={cn(
                    'text-[10px] font-bold truncate',
                    ach.unlocked ? 'text-cyber-text' : 'text-gray-600'
                  )}>
                    {ach.name}
                  </p>
                  <p className="text-[8px] text-gray-500 font-mono mt-0.5">
                    {ach.unlocked ? rarityLabels[ach.rarity] : `进度 ${ach.progress || 0}%`}
                  </p>
                  {ach.unlocked && ach.unlockedAt && (
                    <p className="text-[8px] text-gray-600 font-mono mt-0.5">{ach.unlockedAt}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // 渲染账号操作
  const renderActionsTab = () => (
    <div className="space-y-3">
      {/* 导出数据 */}
      <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-4">
        <h3 className="text-sm font-bold text-cyber-text flex items-center gap-2 mb-3">
          <Download className="w-4 h-4 text-cyber-accent" />
          导出我的数据
        </h3>
        <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
          导出你的所有数据，包括对话记录、知识库、设置偏好等。数据将以 JSON 格式打包下载。
        </p>
        <div className="space-y-1.5 mb-3">
          {['对话历史 (1,284 条)', '知识库 (156 条)', 'Agent 配置', '工作流 (12 个)', '设置与偏好', 'API 密钥信息'].map(item => (
            <div key={item} className="flex items-center gap-2 text-xs text-gray-400">
              <Check className="w-3 h-3 text-cyber-accent" />
              {item}
            </div>
          ))}
        </div>
        <button className="w-full py-2.5 rounded-lg bg-cyber-accent/15 border border-cyber-accent/30 text-cyber-accent text-sm font-mono hover:bg-cyber-accent/25 transition-all flex items-center justify-center gap-2">
          <Download className="w-4 h-4" />
          下载完整数据包
        </button>
      </div>

      {/* 注销账号 */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
        <h3 className="text-sm font-bold text-red-400 flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4" />
          注销账号
        </h3>
        <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
          注销后，你的所有数据将被永久删除且无法恢复。此操作不可逆，请谨慎操作。
        </p>
        <ul className="space-y-1.5 mb-3">
          {[
            '所有对话记录将被永久删除',
            '知识库与自定义 Agent 将被清除',
            'API 密钥将立即失效',
            '订阅与会员权益将终止',
            '账号无法恢复，需重新注册',
          ].map(item => (
            <li key={item} className="flex items-start gap-2 text-[11px] text-red-300/80">
              <X className="w-3 h-3 mt-0.5 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        {!deleteConfirm ? (
          <button
            onClick={() => setDeleteConfirm(true)}
            className="w-full py-2.5 rounded-lg border border-red-500/30 text-red-400 text-sm font-mono hover:bg-red-500/10 transition-all"
          >
            申请注销账号
          </button>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="输入 DELETE 确认"
              className="w-full bg-red-500/5 border border-red-500/30 focus:border-red-500 outline-none rounded-lg px-3 py-2 text-sm text-red-300"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="flex-1 py-2 rounded-lg border border-cyber-border text-gray-400 text-xs font-mono hover:bg-white/5 transition-all"
              >
                取消
              </button>
              <button className="flex-1 py-2 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-mono hover:bg-red-500/30 transition-all">
                确认注销
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // 渲染当前 Tab 内容
  const renderTabContent = () => {
    switch (activeTab) {
      case 'info': return renderInfoTab()
      case 'security': return renderSecurityTab()
      case 'preferences': return renderPreferencesTab()
      case 'apikey': return renderApikeyTab()
      case 'history': return renderHistoryTab()
      case 'permissions': return renderPermissionsTab()
      case 'level': return renderLevelTab()
      case 'actions': return renderActionsTab()
      default: return renderInfoTab()
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* 顶部标题栏 */}
      <div className="border-b border-cyber-border bg-cyber-panel/50 px-4 py-3 flex-shrink-0">
        <h1 className="text-base font-bold text-cyber-text flex items-center gap-2">
          <User className="w-4 h-4 text-cyber-accent" />
          个人中心
        </h1>
        <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
          账号管理 · 安全设置 · 偏好配置
        </p>
      </div>

      {/* Tab 切换栏 */}
      <div className="border-b border-cyber-border/30 bg-cyber-bg/30 flex-shrink-0">
        <div className="flex items-center gap-1 px-2 py-2 overflow-x-auto">
          {profileTabs.map(tab => {
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
