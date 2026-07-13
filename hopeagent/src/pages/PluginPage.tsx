import { useState } from 'react'
import {
  Puzzle,
  Search,
  Star,
  Download,
  Check,
  X,
  Settings,
  Shield,
  Clock,
  Code2,
  BarChart3,
  FileText,
  Languages,
  GitBranch,
  Terminal,
  Brain,
  Palette,
  Table2,
  Mic,
  Image,
  Globe,
  Calendar,
  ChevronRight,
  Sparkles,
  Download as DownloadIcon,
} from 'lucide-react'
import { usePluginStore } from '@/store'
import type { Plugin, PluginCategory, PluginStatus } from '@/types'
import { cn } from '@/lib/utils'

// 模拟插件数据
const mockPlugins: Plugin[] = [
  {
    id: 'code-assistant',
    name: '代码助手增强',
    author: 'HopeAI Team',
    version: '2.1.0',
    description: '智能代码补全、重构建议、Bug 检测，支持 20+ 编程语言',
    category: 'tool',
    rating: 4.8,
    installs: 12580,
    icon: '💻',
    features: ['智能代码补全', '代码重构建议', '实时 Bug 检测', '代码风格统一', '性能优化提示'],
    permissions: ['读取代码文件', '访问代码编辑器', '网络请求（API 调用）'],
    status: 'installed',
    longDescription: '代码助手增强插件为您的开发工作流提供全方位的 AI 辅助。从代码补全到重构建议，从 Bug 检测到性能优化，让您的编码效率提升 300%。支持 JavaScript、TypeScript、Python、Java、Go 等 20 多种主流编程语言。',
    versionHistory: [
      { version: '2.1.0', date: '2024-01-15', changes: ['新增 AI 重构引擎', '支持更多语言', '修复已知问题'] },
      { version: '2.0.0', date: '2023-12-20', changes: ['全新架构设计', '性能大幅提升', '新增代码审查功能'] },
    ],
  },
  {
    id: 'data-visualization',
    name: '数据可视化',
    author: 'DataViz Studio',
    version: '1.5.2',
    description: '一键生成精美图表，支持折线图、柱状图、饼图、热力图等',
    category: 'tool',
    rating: 4.6,
    installs: 8920,
    icon: '📊',
    features: ['10+ 图表类型', '数据自动分析', '交互式图表', '导出高清图片', '实时数据更新'],
    permissions: ['读取数据文件', '剪贴板访问'],
    status: 'recommended',
    longDescription: '数据可视化插件让复杂数据变得直观易懂。只需粘贴数据或上传文件，即可自动生成专业级图表。支持多种导出格式，可直接用于报告和演示。',
  },
  {
    id: 'pdf-parser',
    name: 'PDF 解析工具',
    author: 'DocTech',
    version: '3.0.1',
    description: '精准解析 PDF 内容，提取文本、表格、图片，支持 OCR',
    category: 'tool',
    rating: 4.7,
    installs: 15340,
    icon: '📄',
    features: ['文本提取', '表格识别', '图片提取', 'OCR 文字识别', '批量处理'],
    permissions: ['读取本地文件', '文件系统访问'],
    status: 'available',
    longDescription: 'PDF 解析工具采用先进的文档理解技术，能够精准提取 PDF 中的各类内容。无论是扫描件还是电子文档，都能获得高质量的提取结果。',
  },
  {
    id: 'markdown-export',
    name: 'Markdown 导出',
    author: 'HopeAI Team',
    version: '1.2.0',
    description: '将对话内容导出为精美 Markdown、PDF、HTML 格式',
    category: 'import-export',
    rating: 4.9,
    installs: 22100,
    icon: '📝',
    features: ['Markdown 导出', 'PDF 导出', 'HTML 导出', '自定义模板', '批量导出'],
    permissions: ['文件写入权限', '剪贴板访问'],
    status: 'installed',
    longDescription: 'Markdown 导出插件让您轻松保存和分享对话内容。支持多种导出格式，可自定义样式模板，满足不同场景的需求。',
  },
  {
    id: 'translation-enhancer',
    name: '翻译增强',
    author: 'Lingua AI',
    version: '2.3.0',
    description: '多语言互译，支持术语库、风格定制、专业领域翻译',
    category: 'efficiency',
    rating: 4.5,
    installs: 18760,
    icon: '🌐',
    features: ['50+ 语言互译', '专业术语库', '风格定制', '文档翻译', '实时翻译'],
    permissions: ['网络请求', '剪贴板访问'],
    status: 'available',
    longDescription: '翻译增强插件采用先进的神经机器翻译技术，结合专业术语库和风格定制功能，为您提供精准、自然的翻译体验。',
  },
  {
    id: 'grammar-checker',
    name: '语法检查',
    author: 'WriteRight',
    version: '1.8.0',
    description: '中英文语法检查、拼写纠错、文风优化建议',
    category: 'efficiency',
    rating: 4.4,
    installs: 9870,
    icon: '✏️',
    features: ['语法检查', '拼写纠错', '文风优化', '中英文支持', '实时检测'],
    permissions: ['文本读取', '网络请求'],
    status: 'recommended',
    longDescription: '语法检查插件帮助您写出更规范、更专业的文字。支持中英文双语检测，不仅能发现错误，还能提供改进建议。',
  },
  {
    id: 'git-integration',
    name: 'Git 集成',
    author: 'DevTools Inc',
    version: '2.0.0',
    description: 'Git 仓库管理、代码审查、提交信息生成、分支管理',
    category: 'tool',
    rating: 4.7,
    installs: 11250,
    icon: '🔀',
    features: ['仓库管理', '代码审查', '智能提交信息', '分支管理', '冲突解决辅助'],
    permissions: ['访问 Git 仓库', '文件系统访问', '网络请求'],
    status: 'available',
    longDescription: 'Git 集成插件将强大的版本控制功能带入您的 AI 工作流。从代码审查到提交信息生成，让 Git 操作变得更加智能和高效。',
  },
  {
    id: 'terminal-emulator',
    name: '终端模拟器',
    author: 'HopeAI Team',
    version: '1.4.0',
    description: '内置终端模拟器，支持命令执行、脚本运行、文件操作',
    category: 'tool',
    rating: 4.6,
    installs: 14320,
    icon: '⚡',
    features: ['命令执行', '脚本运行', '文件操作', '历史记录', '多标签页'],
    permissions: ['系统命令执行', '文件系统完全访问', '网络访问'],
    status: 'disabled',
    longDescription: '终端模拟器插件提供完整的命令行环境，让您在对话中直接执行系统命令、运行脚本和管理文件。支持主流操作系统的 Shell 环境。',
  },
  {
    id: 'mind-map',
    name: '思维导图',
    author: 'MindFlow',
    version: '1.3.5',
    description: '自动生成思维导图，可视化知识结构，支持多种布局',
    category: 'efficiency',
    rating: 4.5,
    installs: 7680,
    icon: '🧠',
    features: ['自动生成导图', '多种布局样式', '节点编辑', '导出图片', '大纲模式'],
    permissions: ['剪贴板访问', '文件写入'],
    status: 'available',
    longDescription: '思维导图插件帮助您快速梳理思路、整理知识。只需输入主题或内容，即可自动生成结构清晰的思维导图，支持多种风格和导出格式。',
  },
  {
    id: 'flow-chart',
    name: '流程图绘制',
    author: 'DiagramPro',
    version: '1.2.0',
    description: '快速绘制流程图、时序图、架构图，支持 Mermaid 语法',
    category: 'efficiency',
    rating: 4.3,
    installs: 6540,
    icon: '📈',
    features: ['流程图', '时序图', '架构图', 'Mermaid 语法', '实时预览'],
    permissions: ['剪贴板访问', '文件写入'],
    status: 'recommended',
    longDescription: '流程图绘制插件让技术图表创作变得简单高效。支持 Mermaid 语法，可快速绘制各种专业图表，提升文档表达力。',
  },
  {
    id: 'table-processor',
    name: '表格处理',
    author: 'DataTools',
    version: '1.6.0',
    description: 'Excel/CSV 数据处理、公式计算、数据清洗、格式转换',
    category: 'tool',
    rating: 4.4,
    installs: 8930,
    icon: '📋',
    features: ['Excel 读写', 'CSV 处理', '公式计算', '数据清洗', '格式转换'],
    permissions: ['文件系统访问', '剪贴板访问'],
    status: 'available',
    longDescription: '表格处理插件提供强大的数据处理能力，支持 Excel、CSV 等多种格式。从简单计算到复杂数据清洗，都能轻松应对。',
  },
  {
    id: 'audio-transcribe',
    name: '音频转录',
    author: 'VoiceAI',
    version: '2.1.0',
    description: '语音转文字，支持多语言、说话人识别、字幕生成',
    category: 'tool',
    rating: 4.6,
    installs: 10230,
    icon: '🎤',
    features: ['语音转文字', '多语言支持', '说话人识别', '字幕生成', '批量处理'],
    permissions: ['麦克风访问', '文件读取', '网络请求'],
    status: 'available',
    longDescription: '音频转录插件采用先进的语音识别技术，支持多种语言和方言。能够准确识别不同说话人，自动生成带时间戳的转录文本。',
  },
  {
    id: 'image-generator',
    name: '图像生成',
    author: 'ArtAI Studio',
    version: '3.0.0',
    description: 'AI 图像生成，支持多种风格，高清输出，创意无限',
    category: 'tool',
    rating: 4.7,
    installs: 19870,
    icon: '🎨',
    features: ['文本生成图像', '多种艺术风格', '高清输出', '图像编辑', '批量生成'],
    permissions: ['网络请求', '文件写入', '剪贴板访问'],
    status: 'recommended',
    longDescription: '图像生成插件为您的创意提供无限可能。从简单的文字描述到精美的艺术作品，只需几秒钟即可生成高质量图像。',
  },
  {
    id: 'web-scraper',
    name: '网页抓取',
    author: 'WebTools',
    version: '1.4.0',
    description: '智能网页内容提取、结构化数据抓取、批量采集',
    category: 'tool',
    rating: 4.3,
    installs: 7120,
    icon: '🕸️',
    features: ['内容提取', '数据结构化', '批量采集', '定时任务', '导出数据'],
    permissions: ['网络请求', '文件写入', '浏览器访问'],
    status: 'available',
    longDescription: '网页抓取插件能够智能提取网页内容，将非结构化数据转化为结构化信息。支持批量采集和定时任务，是数据收集的得力助手。',
  },
  {
    id: 'schedule-manager',
    name: '日程管理',
    author: 'PlanEase',
    version: '1.2.0',
    description: '智能日程安排、任务管理、时间追踪、提醒通知',
    category: 'efficiency',
    rating: 4.5,
    installs: 8450,
    icon: '📅',
    features: ['日程安排', '任务管理', '时间追踪', '智能提醒', '日历同步'],
    permissions: ['日历访问', '通知权限', '后台运行'],
    status: 'available',
    longDescription: '日程管理插件帮助您高效规划时间。智能日程建议、任务优先级排序、时间追踪分析，让每一天都井井有条。',
  },
  {
    id: 'agent-creator',
    name: 'Agent 创建器',
    author: 'HopeAI Team',
    version: '1.0.0',
    description: '可视化创建自定义 Agent，配置角色、技能、工具链',
    category: 'agent',
    rating: 4.8,
    installs: 5670,
    icon: '🤖',
    features: ['可视化配置', '角色设定', '技能组合', '工具链配置', '测试调试'],
    permissions: ['Agent 系统访问', '配置文件读写'],
    status: 'installed',
    longDescription: 'Agent 创建器让您无需编码即可创建专属 AI Agent。通过可视化界面配置角色、技能和工具链，打造符合您需求的智能助手。',
  },
]

type TabType = 'installed' | 'available' | 'recommended'

const categoryLabels: Record<PluginCategory, string> = {
  tool: '工具类',
  agent: 'Agent 类',
  theme: '主题类',
  'import-export': '导入导出',
  efficiency: '效率工具',
}

export default function PluginPage() {
  const { installedPlugins, enabledPlugins, installPlugin, uninstallPlugin, togglePlugin } = usePluginStore()
  const [activeTab, setActiveTab] = useState<TabType>('available')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<PluginCategory | 'all'>('all')
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null)

  const tabs: { id: TabType; label: string; count: number }[] = [
    { id: 'installed', label: '已安装', count: installedPlugins.length },
    { id: 'available', label: '可用市场', count: mockPlugins.filter(p => p.status !== 'installed' && p.status !== 'disabled').length },
    { id: 'recommended', label: '推荐', count: mockPlugins.filter(p => p.status === 'recommended').length },
  ]

  const categories: (PluginCategory | 'all')[] = ['all', 'tool', 'agent', 'efficiency', 'import-export', 'theme']

  const filteredPlugins = mockPlugins.filter(plugin => {
    // Tab 筛选
    if (activeTab === 'installed') {
      if (!installedPlugins.includes(plugin.id) && plugin.status !== 'installed') return false
    } else if (activeTab === 'recommended') {
      if (plugin.status !== 'recommended') return false
    }

    // 分类筛选
    if (selectedCategory !== 'all' && plugin.category !== selectedCategory) return false

    // 搜索筛选
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (!plugin.name.toLowerCase().includes(q) && !plugin.description.toLowerCase().includes(q)) {
        return false
      }
    }

    return true
  })

  const handleInstall = (pluginId: string) => {
    installPlugin(pluginId)
  }

  const handleUninstall = (pluginId: string) => {
    uninstallPlugin(pluginId)
  }

  const handleToggle = (pluginId: string) => {
    togglePlugin(pluginId)
  }

  const isInstalled = (pluginId: string) =>
    installedPlugins.includes(pluginId) || mockPlugins.find(p => p.id === pluginId)?.status === 'installed'

  const isEnabled = (pluginId: string) =>
    enabledPlugins.includes(pluginId) || (mockPlugins.find(p => p.id === pluginId)?.status === 'installed')

  return (
    <div className="h-full flex flex-col">
      {/* 顶部标题栏 */}
      <div className="border-b border-cyber-border bg-cyber-panel/50 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-base font-bold text-cyber-text flex items-center gap-2">
              <Puzzle className="w-4 h-4 text-cyber-accent" />
              插件市场
            </h1>
            <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
              {mockPlugins.length} 个插件 · {installedPlugins.length} 已安装
            </p>
          </div>
        </div>

        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索插件..."
            className="w-full pl-10 pr-4 py-2 bg-cyber-bg/80 border border-cyber-border rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyber-accent/50 transition-colors"
          />
        </div>
      </div>

      {/* Tab 切换 */}
      <div className="px-3 pt-3 border-b border-cyber-border">
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-2 text-xs font-mono rounded-t-lg transition-all',
                activeTab === tab.id
                  ? 'bg-cyber-accent/10 text-cyber-accent border-t border-l border-r border-cyber-accent/30'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              )}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="px-3 py-2 border-b border-cyber-border/50">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-mono transition-all',
                selectedCategory === cat
                  ? 'bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/30'
                  : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10'
              )}
            >
              {cat === 'all' ? '全部' : categoryLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* 插件列表 */}
      <div className="flex-1 overflow-y-auto p-3">
        {filteredPlugins.length === 0 ? (
          <div className="text-center py-16">
            <Puzzle className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-sm text-gray-500">暂无匹配的插件</p>
            <p className="text-xs text-gray-600 mt-1">试试其他关键词或分类</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredPlugins.map(plugin => (
              <PluginCard
                key={plugin.id}
                plugin={plugin}
                installed={isInstalled(plugin.id)}
                enabled={isEnabled(plugin.id)}
                onInstall={() => handleInstall(plugin.id)}
                onUninstall={() => handleUninstall(plugin.id)}
                onToggle={() => handleToggle(plugin.id)}
                onClick={() => setSelectedPlugin(plugin)}
              />
            ))}
          </div>
        )}
        <div className="h-4" />
      </div>

      {/* 插件详情弹窗 */}
      {selectedPlugin && (
        <PluginDetailModal
          plugin={selectedPlugin}
          installed={isInstalled(selectedPlugin.id)}
          enabled={isEnabled(selectedPlugin.id)}
          onClose={() => setSelectedPlugin(null)}
          onInstall={() => handleInstall(selectedPlugin.id)}
          onUninstall={() => handleUninstall(selectedPlugin.id)}
          onToggle={() => handleToggle(selectedPlugin.id)}
        />
      )}
    </div>
  )
}

// 插件卡片组件
function PluginCard({ plugin, installed, enabled, onInstall, onUninstall, onToggle, onClick }: {
  plugin: Plugin
  installed: boolean
  enabled: boolean
  onInstall: () => void
  onUninstall: () => void
  onToggle: () => void
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-3 hover:border-cyber-accent/30 transition-all cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-cyber-accent/10 border border-cyber-accent/20 flex items-center justify-center text-2xl flex-shrink-0">
          {plugin.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-medium text-cyber-text">{plugin.name}</h3>
              <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                {plugin.author} · v{plugin.version}
              </p>
            </div>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-[11px] text-gray-400 font-mono">{plugin.rating}</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">{plugin.description}</p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 text-[9px] font-mono bg-white/5 text-gray-500 rounded">
                {categoryLabels[plugin.category]}
              </span>
              <span className="text-[10px] text-gray-600 font-mono flex items-center gap-1">
                <Download className="w-2.5 h-2.5" />
                {plugin.installs.toLocaleString()}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (installed) {
                  onToggle()
                } else {
                  onInstall()
                }
              }}
              className={cn(
                'px-3 py-1 rounded-lg text-[11px] font-mono transition-all',
                installed
                  ? enabled
                    ? 'bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/30'
                    : 'bg-white/5 text-gray-400 border border-gray-700'
                  : 'bg-cyber-accent text-black hover:bg-cyber-accent/90'
              )}
            >
              {installed ? (enabled ? '已启用' : '已禁用') : '安装'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 插件详情弹窗
function PluginDetailModal({ plugin, installed, enabled, onClose, onInstall, onUninstall, onToggle }: {
  plugin: Plugin
  installed: boolean
  enabled: boolean
  onClose: () => void
  onInstall: () => void
  onUninstall: () => void
  onToggle: () => void
}) {
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-cyber-panel border border-cyber-border rounded-t-2xl sm:rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="p-4 border-b border-cyber-border">
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 rounded-xl bg-cyber-accent/10 border border-cyber-accent/20 flex items-center justify-center text-3xl flex-shrink-0">
              {plugin.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-cyber-text">{plugin.name}</h2>
              <p className="text-xs text-gray-500 font-mono mt-0.5">
                {plugin.author} · v{plugin.version}
              </p>
              <div className="flex items-center gap-3 mt-1.5">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-gray-400 font-mono">{plugin.rating}</span>
                </div>
                <span className="text-xs text-gray-600 font-mono flex items-center gap-1">
                  <DownloadIcon className="w-3 h-3" />
                  {plugin.installs.toLocaleString()} 次安装
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-gray-300 flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 内容 */}
        <div className="p-4 space-y-4">
          {/* 描述 */}
          <div>
            <h3 className="text-xs font-mono text-gray-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyber-accent" />
              插件介绍
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              {plugin.longDescription || plugin.description}
            </p>
          </div>

          {/* 功能列表 */}
          <div>
            <h3 className="text-xs font-mono text-gray-400 mb-2 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-cyber-accent" />
              主要功能
            </h3>
            <div className="space-y-1.5">
              {plugin.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                  <Check className="w-3.5 h-3.5 text-cyber-accent flex-shrink-0" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* 权限说明 */}
          <div>
            <h3 className="text-xs font-mono text-gray-400 mb-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyber-accent" />
              权限说明
            </h3>
            <div className="space-y-1.5">
              {plugin.permissions.map((perm, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/60 flex-shrink-0" />
                  {perm}
                </div>
              ))}
            </div>
          </div>

          {/* 版本历史 */}
          {plugin.versionHistory && plugin.versionHistory.length > 0 && (
            <div>
              <h3 className="text-xs font-mono text-gray-400 mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyber-accent" />
                版本历史
              </h3>
              <div className="space-y-3">
                {plugin.versionHistory.map((ver, idx) => (
                  <div key={idx} className="pl-3 border-l-2 border-cyber-border">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-cyber-accent">v{ver.version}</span>
                      <span className="text-[10px] text-gray-600 font-mono">{ver.date}</span>
                    </div>
                    <ul className="mt-1 space-y-0.5">
                      {ver.changes.map((change, ci) => (
                        <li key={ci} className="text-[11px] text-gray-400 flex items-start gap-1">
                          <span className="text-cyber-accent/60">•</span>
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 底部操作 */}
        <div className="p-4 border-t border-cyber-border flex gap-2">
          {installed ? (
            <>
              <button
                onClick={onToggle}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-mono text-sm transition-all',
                  enabled
                    ? 'bg-white/5 text-gray-400 hover:bg-white/10 border border-gray-700'
                    : 'bg-cyber-accent text-black hover:bg-cyber-accent/90'
                )}
              >
                <Settings className="w-4 h-4" />
                {enabled ? '禁用插件' : '启用插件'}
              </button>
              <button
                onClick={onUninstall}
                className="px-5 py-2.5 bg-red-500/10 text-red-400 rounded-xl font-mono text-sm hover:bg-red-500/20 transition-all border border-red-500/30"
              >
                卸载
              </button>
            </>
          ) : (
            <button
              onClick={onInstall}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-cyber-accent text-black rounded-xl font-mono text-sm hover:bg-cyber-accent/90 transition-colors"
              style={{ boxShadow: '0 0 20px rgba(0,255,136,0.3)' }}
            >
              <DownloadIcon className="w-4 h-4" />
              安装插件
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
