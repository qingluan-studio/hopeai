import { useState, useEffect, useCallback } from 'react'
import {
  MessageSquarePlus,
  MessagesSquare,
  Settings as SettingsIcon,
  X,
  Trash2,
  Brain,
  BookOpen,
  Terminal,
  Cpu,
  Sparkles,
  Wifi,
  WifiOff,
  RefreshCw,
  Puzzle,
  FileText,
  Archive,
  BarChart3,
  GitBranch,
  Network,
  Code2,
  LayoutDashboard,
  ChevronDown,
  ChevronUp,
  Home,
  Palette,
  User,
  Bell,
  HelpCircle,
  FileCode,
  Info,
  CheckSquare,
  Calendar,
  NotebookPen,
  Star,
  Users,
} from 'lucide-react'
import { useChatStore, useAppStore } from '@/store'
import { chatApi, healthApi } from '@/services/apiClient'
import { cn } from '@/lib/utils'
import type { AppPage } from '@/types'
import BrandAvatar, { BrandWordmark } from '@/components/BrandAvatar'

const primaryNav: { id: AppPage; icon: typeof MessagesSquare; label: string }[] = [
  { id: 'home', icon: Home, label: '首页' },
  { id: 'chat', icon: MessagesSquare, label: '对话' },
  { id: 'knowledge', icon: BookOpen, label: '知识库' },
]

const hiddenTools: { id: AppPage; icon: typeof MessagesSquare; label: string }[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: '工作台' },
  { id: 'agents', icon: Brain, label: 'Agent大脑' },
  { id: 'analytics', icon: BarChart3, label: '数据分析' },
  { id: 'workflow', icon: GitBranch, label: '工作流' },
  { id: 'mindmap', icon: Network, label: '思维导图' },
  { id: 'codesandbox', icon: Code2, label: '代码沙箱' },
  { id: 'plugins', icon: Puzzle, label: '插件市场' },
  { id: 'templates', icon: FileText, label: '模板中心' },
  { id: 'archive', icon: Archive, label: '历史归档' },
  { id: 'taskmanage', icon: CheckSquare, label: '任务管理' },
  { id: 'schedule', icon: Calendar, label: '日程管理' },
  { id: 'notes', icon: NotebookPen, label: '笔记' },
  { id: 'favorites', icon: Star, label: '收藏夹' },
  { id: 'community', icon: Users, label: '社区' },
  { id: 'profile', icon: User, label: '个人中心' },
  { id: 'notification', icon: Bell, label: '消息通知' },
  { id: 'help', icon: HelpCircle, label: '帮助文档' },
  { id: 'apidocs', icon: FileCode, label: 'API文档' },
  { id: 'about', icon: Info, label: '关于' },
]

export default function Sidebar() {
  const { currentPage, setCurrentPage, sidebarOpen, setSidebarOpen, backendOnline, setBackendOnline, useBackend } = useAppStore()
  const { conversations, activeConversationId, createConversation, selectConversation, deleteConversation, setConversations } = useChatStore()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [showMore, setShowMore] = useState(false)

  const refreshConversations = useCallback(async () => {
    if (!useBackend) return
    setRefreshing(true)
    try {
      const list = await chatApi.list()
      const existing = new Map(conversations.map(c => [c.id, c]))
      const merged = list.map(summary => {
        const exist = existing.get(summary.id)
        return exist || {
          id: summary.id,
          title: summary.title,
          messages: [],
          createdAt: summary.updatedAt || new Date().toISOString(),
          updatedAt: summary.updatedAt,
          activeAgentId: 'orchestrator',
        }
      })
      const serverIds = new Set(list.map(s => s.id))
      for (const c of conversations) {
        if (!serverIds.has(c.id) && c.messages.length > 0) {
          merged.push(c)
        }
      }
      setConversations(merged.sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()))
    } catch (err) {
      console.error('刷新对话列表失败:', err)
    } finally {
      setRefreshing(false)
    }
  }, [useBackend, conversations, setConversations])

  useEffect(() => {
    let mounted = true
    const probe = async () => {
      const online = await healthApi.isOnline(2000)
      if (!mounted) return
      setBackendOnline(online)
      if (online && useBackend) {
        setTimeout(() => refreshConversations(), 100)
      }
    }
    probe()
    const interval = setInterval(probe, 30000)
    return () => { mounted = false; clearInterval(interval) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const handler = () => refreshConversations()
    window.addEventListener('backend-conversation-created', handler)
    return () => window.removeEventListener('backend-conversation-created', handler)
  }, [refreshConversations])

  const handleNewChat = () => {
    createConversation()
    setCurrentPage('chat')
    setSidebarOpen(false)
  }

  const handleNavClick = (page: AppPage) => {
    setCurrentPage(page)
    setSidebarOpen(false)
  }

  const handleConvClick = (id: string) => {
    selectConversation(id)
    setCurrentPage('chat')
    setSidebarOpen(false)
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (deletingId === id) {
      if (useBackend && backendOnline) {
        try { await chatApi.delete(id) } catch {}
      }
      deleteConversation(id)
      setDeletingId(null)
      refreshConversations()
    } else {
      setDeletingId(id)
      setTimeout(() => setDeletingId(null), 3000)
    }
  }

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 backdrop-blur-sm',
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setSidebarOpen(false)}
      />

      <div
        className={cn(
          'fixed left-0 top-0 h-full w-[82vw] max-w-[320px] z-50 flex flex-col bg-cyber-bg border-r border-cyber-border/30 transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* 顶部品牌区 */}
        <div className="px-4 py-4 border-b border-cyber-border/30 flex items-center gap-3">
          <BrandAvatar size="md" animated />
          <div className="flex-1 min-w-0">
            <BrandWordmark className="text-base" />
            <p className="text-[9px] text-gray-600 font-mono mt-0.5">SUPER INTELLIGENCE</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-cyber-text"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 状态条 */}
        <div className="px-4 py-2 border-b border-cyber-border/20 flex items-center justify-between">
          <div className={cn(
            'flex items-center gap-1.5 text-[10px] font-mono',
            backendOnline ? 'text-cyber-accent' : 'text-gray-500'
          )}>
            {backendOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            <span>{backendOnline ? '后端在线' : '本地模式'}</span>
          </div>
          {useBackend && backendOnline && (
            <button
              onClick={refreshConversations}
              disabled={refreshing}
              className="p-1 rounded hover:bg-white/5 text-gray-500 hover:text-cyber-accent transition-colors"
            >
              <RefreshCw className={cn('w-3 h-3', refreshing && 'animate-spin')} />
            </button>
          )}
        </div>

        {/* 新建对话按钮 */}
        <div className="p-3">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-gradient-to-r from-cyber-accent/20 to-cyan-500/20 border border-cyber-accent/30 text-cyber-accent hover:from-cyber-accent/30 hover:to-cyan-500/30 transition-all font-mono text-sm"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>新建对话</span>
          </button>
        </div>

        {/* 主导航 */}
        <div className="px-3 pb-2">
          <div className="space-y-0.5">
            {primaryNav.map(item => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left',
                    isActive
                      ? 'bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/20'
                      : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 对话列表 */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          <p className="text-[10px] font-mono text-gray-600 px-2 py-2 uppercase tracking-wider flex items-center justify-between">
            <span>对话历史</span>
            <span className="text-gray-700">{conversations.length}</span>
          </p>
          <div className="space-y-0.5">
            {conversations.length === 0 && (
              <p className="text-xs text-gray-600 px-2 py-4 text-center">暂无对话</p>
            )}
            {conversations.slice(0, 20).map(conv => (
              <div
                key={conv.id}
                onClick={() => handleConvClick(conv.id)}
                className={cn(
                  'group relative px-3 py-2 rounded-lg cursor-pointer transition-all',
                  activeConversationId === conv.id
                    ? 'bg-cyber-accent/10 border border-cyber-accent/20'
                    : 'hover:bg-white/5 border border-transparent'
                )}
              >
                <div className="flex items-center gap-2 pr-6">
                  <div className={cn(
                    'w-1.5 h-1.5 rounded-full flex-shrink-0',
                    activeConversationId === conv.id ? 'bg-cyber-accent' : 'bg-gray-700'
                  )} />
                  <span className={cn(
                    'text-sm truncate flex-1',
                    activeConversationId === conv.id ? 'text-cyber-text' : 'text-gray-400'
                  )}>
                    {conv.title}
                  </span>
                </div>
                <button
                  onClick={(e) => handleDelete(e, conv.id)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-red-500/20 text-gray-600 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                {deletingId === conv.id && (
                  <div className="absolute inset-0 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center justify-center">
                    <span className="text-[10px] text-red-400 font-mono">再次点击确认</span>
                  </div>
                )}
              </div>
            ))}
            {conversations.length > 20 && (
              <p className="text-[10px] text-gray-600 text-center py-2">
                还有 {conversations.length - 20} 条对话...
              </p>
            )}
          </div>
        </div>

        {/* 更多工具 - 折叠 */}
        <div className="border-t border-cyber-border/20">
          <button
            onClick={() => setShowMore(!showMore)}
            className="w-full flex items-center justify-between px-4 py-2.5 text-gray-500 hover:text-gray-300 transition-colors"
          >
            <span className="text-xs font-mono flex items-center gap-2">
              <Palette className="w-3.5 h-3.5" />
              更多工具
            </span>
            {showMore ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showMore && (
            <div className="px-3 pb-3">
              <div className="grid grid-cols-3 gap-1">
                {hiddenTools.map(item => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className="flex flex-col items-center gap-1 py-2.5 rounded-lg text-gray-500 hover:bg-white/5 hover:text-gray-300 transition-all"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[9px]">{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* 底部设置 */}
        <div className="px-3 py-2 border-t border-cyber-border/20">
          <button
            onClick={() => handleNavClick('settings')}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left',
              currentPage === 'settings'
                ? 'bg-cyber-accent/10 text-cyber-accent'
                : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
            )}
          >
            <SettingsIcon className="w-4 h-4" />
            <span className="text-sm">设置</span>
          </button>
          <div className="flex items-center justify-between mt-2 px-3 text-[9px] font-mono text-gray-700">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              33 Agents
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyber-accent/60" />
              v2.0
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
