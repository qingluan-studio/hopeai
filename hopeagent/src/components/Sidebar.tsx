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
} from 'lucide-react'
import { useChatStore, useAppStore } from '@/store'
import { chatApi, healthApi } from '@/services/apiClient'
import { cn } from '@/lib/utils'
import type { AppPage } from '@/types'

const navItems: { id: AppPage; icon: typeof MessagesSquare; label: string }[] = [
  { id: 'chat', icon: MessagesSquare, label: '对话' },
  { id: 'knowledge', icon: BookOpen, label: '知识库' },
  { id: 'agents', icon: Brain, label: '大脑' },
  { id: 'settings', icon: SettingsIcon, label: '设置' },
]

export default function Sidebar() {
  const { currentPage, setCurrentPage, sidebarOpen, setSidebarOpen, backendOnline, setBackendOnline, useBackend } = useAppStore()
  const { conversations, activeConversationId, createConversation, selectConversation, deleteConversation, setConversations } = useChatStore()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  /** 从后端拉取对话列表，合并到本地 */
  const refreshConversations = useCallback(async () => {
    if (!useBackend) return
    setRefreshing(true)
    try {
      const list = await chatApi.list()
      // 转换为本地格式，保留已有对话的 messages
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
      // 保留本地有但后端没有的（未同步的）
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

  // 启动时探测后端 + 拉取对话列表
  useEffect(() => {
    let mounted = true
    const probe = async () => {
      const online = await healthApi.isOnline(2000)
      if (!mounted) return
      setBackendOnline(online)
      if (online && useBackend) {
        // 健康检查后再拉取对话列表
        setTimeout(() => refreshConversations(), 100)
      }
    }
    probe()
    const interval = setInterval(probe, 30000) // 每30秒探测一次
    return () => { mounted = false; clearInterval(interval) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 监听后端新对话创建事件
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
      // 后端模式：同时删除后端
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
      {/* 遮罩 */}
      <div
        className={cn(
          'fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 backdrop-blur-sm',
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setSidebarOpen(false)}
      />

      {/* 抽屉 */}
      <div
        className={cn(
          'fixed left-0 top-0 h-full w-[80vw] max-w-xs z-50 flex flex-col bg-cyber-panel border-r border-cyber-border/50 transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* 顶部 */}
        <div className="px-4 py-3 border-b border-cyber-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg border border-cyber-accent/30 flex items-center justify-center"
              style={{ boxShadow: '0 0 15px rgba(0,255,136,0.1)' }}>
              <Terminal className="w-4 h-4 text-cyber-accent" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-cyber-accent font-mono leading-tight">hopeagent</h1>
              <p className="text-[9px] text-gray-600 font-mono">pro v4.0</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-cyber-text"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 后端状态条 */}
        <div className="px-4 py-2 border-b border-cyber-border/30 flex items-center justify-between">
          <div className={cn(
            'flex items-center gap-1.5 text-[10px] font-mono',
            backendOnline ? 'text-cyber-accent' : 'text-gray-500'
          )}>
            {backendOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            <span>{backendOnline ? '后端在线' : '后端离线'}</span>
          </div>
          {useBackend && backendOnline && (
            <button
              onClick={refreshConversations}
              disabled={refreshing}
              className="p-1 rounded hover:bg-white/5 text-gray-500 hover:text-cyber-accent transition-colors"
              title="刷新对话列表"
            >
              <RefreshCw className={cn('w-3 h-3', refreshing && 'animate-spin')} />
            </button>
          )}
        </div>

        {/* 新建对话 */}
        <div className="p-3">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent hover:bg-cyber-accent/20 transition-all font-mono text-sm"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>新建对话</span>
          </button>
        </div>

        {/* 导航 */}
        <div className="px-3 pb-2">
          <div className="grid grid-cols-4 gap-1">
            {navItems.map(item => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    'flex flex-col items-center gap-1 py-2 rounded-lg transition-all',
                    isActive
                      ? 'bg-cyber-accent/10 text-cyber-accent'
                      : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[10px]">{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 对话列表 */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          <p className="text-[10px] font-mono text-gray-600 px-2 py-2 uppercase tracking-wider">最近对话</p>
          <div className="space-y-1">
            {conversations.length === 0 && (
              <p className="text-xs text-gray-600 px-2 py-4 text-center">暂无对话</p>
            )}
            {conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => handleConvClick(conv.id)}
                className={cn(
                  'group relative px-3 py-2.5 rounded-lg cursor-pointer transition-all',
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
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-red-500/20 text-gray-600 hover:text-red-400 transition-all"
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
          </div>
        </div>

        {/* 底部 */}
        <div className="px-3 py-2 border-t border-cyber-border/50">
          <div className="flex items-center justify-between text-[10px] font-mono text-gray-600">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyber-accent" />
              HopeAI
            </span>
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              23 Agents
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
