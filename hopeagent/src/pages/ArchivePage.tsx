import { useState, useMemo } from 'react'
import {
  Archive,
  Search,
  Trash2,
  Download,
  Upload,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Calendar,
  Filter,
  Layers,
  Clock,
  X,
  RotateCcw,
  Trash,
  MoreHorizontal,
} from 'lucide-react'
import { useChatStore, useArchiveStore, useAppStore } from '@/store'
import type { ArchivedConversation, ArchiveStatus } from '@/types'
import { cn } from '@/lib/utils'

// 生成模拟归档数据
const generateMockArchivedConversations = (): ArchivedConversation[] => {
  const agents = ['代码架构师', '产品经理', '数据工程师', '语言专家', '办公助手', '创意设计师']
  const titles = [
    'React 性能优化方案讨论',
    '产品需求文档撰写',
    '数据库表结构设计',
    '英语翻译辅助',
    '周报生成',
    '项目架构评审',
    '用户调研报告',
    '竞品分析报告',
    '技术方案选型',
    '年终总结',
    '面试准备',
    '学习计划制定',
    '营销文案创作',
    '代码审查记录',
    '会议纪要整理',
    '故障排查记录',
    '需求评审会议',
    '技术分享准备',
    '客户沟通记录',
    '工作计划安排',
  ]

  const now = Date.now()
  const conversations: ArchivedConversation[] = []

  for (let i = 0; i < 30; i++) {
    const daysAgo = Math.floor(Math.random() * 60)
    const hoursAgo = Math.floor(Math.random() * 24)
    const timestamp = new Date(now - daysAgo * 86400000 - hoursAgo * 3600000).toISOString()

    conversations.push({
      id: `archived_${i}`,
      title: titles[i % titles.length],
      lastMessage: '这是最后一条消息的预览内容，显示对话的最后状态...',
      agentName: agents[i % agents.length],
      messageCount: Math.floor(Math.random() * 50) + 5,
      timestamp,
      status: i < 5 ? 'archived' : 'normal',
      tags: ['工作', '重要', '待跟进'].slice(0, Math.floor(Math.random() * 3)),
    })
  }

  // 按时间倒序
  return conversations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

const mockArchived = generateMockArchivedConversations()

type TimeGroup = 'today' | 'yesterday' | 'thisWeek' | 'thisMonth' | 'earlier'

const groupLabels: Record<TimeGroup, string> = {
  today: '今天',
  yesterday: '昨天',
  thisWeek: '本周',
  thisMonth: '本月',
  earlier: '更早',
}

export default function ArchivePage() {
  const { conversations } = useChatStore()
  const { setCurrentPage } = useAppStore()
  const { selectedIds, toggleSelect, selectAll, clearSelection, batchDelete, batchExport } = useArchiveStore()
  const [activeTab, setActiveTab] = useState<'normal' | 'archived' | 'trash'>('normal')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedGroups, setExpandedGroups] = useState<Record<TimeGroup, boolean>>({
    today: true,
    yesterday: true,
    thisWeek: true,
    thisMonth: true,
    earlier: false,
  })
  const [showFilter, setShowFilter] = useState(false)
  const [trashConversations, setTrashConversations] = useState<ArchivedConversation[]>([])
  const [archivedConversations, setArchivedConversations] = useState<ArchivedConversation[]>(
    mockArchived.filter(c => c.status === 'archived')
  )

  const normalConversations = useMemo(() => {
    return conversations.map(c => ({
      id: c.id,
      title: c.title,
      lastMessage: c.messages[c.messages.length - 1]?.content || '暂无消息',
      agentName: '智能助手',
      messageCount: c.messages.length,
      timestamp: c.updatedAt,
      status: 'normal' as ArchiveStatus,
      tags: [],
    }))
  }, [conversations])

  const allConversations = useMemo(() => {
    if (activeTab === 'normal') return normalConversations
    if (activeTab === 'archived') return archivedConversations
    return trashConversations
  }, [activeTab, normalConversations, archivedConversations, trashConversations])

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return allConversations
    const q = searchQuery.toLowerCase()
    return allConversations.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.lastMessage.toLowerCase().includes(q) ||
      c.agentName.toLowerCase().includes(q)
    )
  }, [allConversations, searchQuery])

  const groupedConversations = useMemo(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 86400000)
    const weekAgo = new Date(today.getTime() - 7 * 86400000)
    const monthAgo = new Date(today.getTime() - 30 * 86400000)

    const groups: Record<TimeGroup, ArchivedConversation[]> = {
      today: [],
      yesterday: [],
      thisWeek: [],
      thisMonth: [],
      earlier: [],
    }

    filteredConversations.forEach(conv => {
      const date = new Date(conv.timestamp)
      if (date >= today) {
        groups.today.push(conv)
      } else if (date >= yesterday) {
        groups.yesterday.push(conv)
      } else if (date >= weekAgo) {
        groups.thisWeek.push(conv)
      } else if (date >= monthAgo) {
        groups.thisMonth.push(conv)
      } else {
        groups.earlier.push(conv)
      }
    })

    return groups
  }, [filteredConversations])

  const totalMessages = useMemo(() => {
    return allConversations.reduce((sum, c) => sum + c.messageCount, 0)
  }, [allConversations])

  const stats = {
    total: conversations.length + archivedConversations.length,
    archived: archivedConversations.length,
    thisMonth: allConversations.filter(c => {
      const date = new Date(c.timestamp)
      const monthAgo = new Date(Date.now() - 30 * 86400000)
      return date >= monthAgo
    }).length,
    totalMessages,
  }

  const allVisibleIds = filteredConversations.map(c => c.id)
  const allSelected = allVisibleIds.length > 0 && allVisibleIds.every(id => selectedIds.includes(id))
  const someSelected = allVisibleIds.some(id => selectedIds.includes(id))

  const toggleGroup = (group: TimeGroup) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }))
  }

  const handleSelectAll = () => {
    if (allSelected) {
      clearSelection()
    } else {
      selectAll(allVisibleIds)
    }
  }

  const handleArchive = (conv: ArchivedConversation) => {
    if (activeTab === 'normal') {
      setArchivedConversations(prev => [{ ...conv, status: 'archived' }, ...prev])
    } else if (activeTab === 'archived') {
      setArchivedConversations(prev => prev.filter(c => c.id !== conv.id))
    }
  }

  const handleDelete = (conv: ArchivedConversation) => {
    if (activeTab === 'trash') {
      setTrashConversations(prev => prev.filter(c => c.id !== conv.id))
    } else {
      setTrashConversations(prev => [{ ...conv, status: 'trash' }, ...prev])
      if (activeTab === 'archived') {
        setArchivedConversations(prev => prev.filter(c => c.id !== conv.id))
      }
    }
  }

  const handleRestore = (conv: ArchivedConversation) => {
    setTrashConversations(prev => prev.filter(c => c.id !== conv.id))
    setArchivedConversations(prev => [{ ...conv, status: 'archived' }, ...prev])
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()

    if (isToday) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }

    const isThisYear = date.getFullYear() === now.getFullYear()
    if (isThisYear) {
      return `${date.getMonth() + 1}/${date.getDate()}`
    }

    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
  }

  const handleBatchArchive = () => {
    if (activeTab === 'normal') {
      const toArchive = filteredConversations.filter(c => selectedIds.includes(c.id))
      setArchivedConversations(prev => [...toArchive.map(c => ({ ...c, status: 'archived' as const })), ...prev])
    }
    clearSelection()
  }

  const handleBatchExport = () => {
    batchExport(selectedIds)
  }

  const handleBatchDelete = () => {
    if (activeTab === 'trash') {
      setTrashConversations(prev => prev.filter(c => !selectedIds.includes(c.id)))
    } else {
      const toTrash = filteredConversations.filter(c => selectedIds.includes(c.id))
      setTrashConversations(prev => [...toTrash.map(c => ({ ...c, status: 'trash' as const })), ...prev])
      if (activeTab === 'archived') {
        setArchivedConversations(prev => prev.filter(c => !selectedIds.includes(c.id)))
      }
    }
    clearSelection()
  }

  return (
    <div className="h-full flex flex-col">
      {/* 顶部标题栏 */}
      <div className="border-b border-cyber-border bg-cyber-panel/50 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-base font-bold text-cyber-text flex items-center gap-2">
              <Archive className="w-4 h-4 text-cyber-accent" />
              历史归档
            </h1>
            <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
              管理对话历史 · 归档与回收站
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {}}
              className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-colors"
              title="导入对话"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              onClick={() => {}}
              className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-colors"
              title="导出对话"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索对话..."
            className="w-full pl-10 pr-10 py-2 bg-cyber-bg/80 border border-cyber-border rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyber-accent/50 transition-colors"
          />
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors',
              showFilter ? 'bg-cyber-accent/20 text-cyber-accent' : 'text-gray-500 hover:text-gray-300'
            )}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="px-3 py-2 border-b border-cyber-border/50">
        <div className="grid grid-cols-4 gap-2">
          <MiniStat label="全部对话" value={stats.total} icon={Layers} />
          <MiniStat label="已归档" value={stats.archived} icon={Archive} />
          <MiniStat label="本月对话" value={stats.thisMonth} icon={Calendar} />
          <MiniStat label="总消息" value={stats.totalMessages} icon={MessageSquare} />
        </div>
      </div>

      {/* Tab 切换 */}
      <div className="px-3 pt-2 border-b border-cyber-border">
        <div className="flex gap-1">
          {[
            { id: 'normal' as const, label: '全部', count: conversations.length },
            { id: 'archived' as const, label: '已归档', count: archivedConversations.length },
            { id: 'trash' as const, label: '回收站', count: trashConversations.length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); clearSelection() }}
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

      {/* 批量操作栏 */}
      {someSelected && (
        <div className="px-3 py-2 border-b border-cyber-border/50 bg-cyber-accent/5 flex items-center justify-between">
          <button
            onClick={handleSelectAll}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-cyber-accent"
          >
            {allSelected ? <CheckSquare className="w-4 h-4 text-cyber-accent" /> : <Square className="w-4 h-4" />}
            全选 ({selectedIds.length})
          </button>
          <div className="flex items-center gap-1">
            {activeTab !== 'trash' && (
              <button
                onClick={handleBatchArchive}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 text-xs text-gray-400 hover:bg-white/10 transition-colors"
              >
                <Archive className="w-3.5 h-3.5" />
                {activeTab === 'archived' ? '取消归档' : '归档'}
              </button>
            )}
            <button
              onClick={handleBatchExport}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 text-xs text-gray-400 hover:bg-white/10 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              导出
            </button>
            <button
              onClick={handleBatchDelete}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 text-xs text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/30"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {activeTab === 'trash' ? '永久删除' : '删除'}
            </button>
          </div>
        </div>
      )}

      {/* 对话列表 */}
      <div className="flex-1 overflow-y-auto p-3">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-16">
            {activeTab === 'trash' ? (
              <>
                <Trash className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                <p className="text-sm text-gray-500">回收站为空</p>
                <p className="text-xs text-gray-600 mt-1">删除的对话会在这里保留 30 天</p>
              </>
            ) : (
              <>
                <Archive className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                <p className="text-sm text-gray-500">暂无对话记录</p>
                <p className="text-xs text-gray-600 mt-1">开始新对话后会显示在这里</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {(Object.keys(groupedConversations) as TimeGroup[]).map(group => {
              const items = groupedConversations[group]
              if (items.length === 0) return null

              return (
                <div key={group}>
                  <button
                    onClick={() => toggleGroup(group)}
                    className="flex items-center gap-1.5 mb-2 px-1 text-[11px] font-mono text-gray-500 hover:text-gray-400 transition-colors"
                  >
                    {expandedGroups[group] ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                    {groupLabels[group]}
                    <span className="text-gray-600">({items.length})</span>
                  </button>

                  {expandedGroups[group] && (
                    <div className="space-y-1.5">
                      {items.map(conv => (
                        <ConversationCard
                          key={conv.id}
                          conversation={conv}
                          selected={selectedIds.includes(conv.id)}
                          onToggleSelect={() => toggleSelect(conv.id)}
                          onArchive={() => handleArchive(conv)}
                          onDelete={() => handleDelete(conv)}
                          onRestore={() => handleRestore(conv)}
                          formatTime={formatTime}
                          tab={activeTab}
                          onClick={() => setCurrentPage('chat')}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
        <div className="h-4" />
      </div>
    </div>
  )
}

// 迷你统计卡片
function MiniStat({ label, value, icon: Icon }: { label: string; value: number; icon: any }) {
  return (
    <div className="bg-white/[0.02] border border-cyber-border/50 rounded-lg p-2 text-center">
      <Icon className="w-3.5 h-3.5 text-cyber-accent mx-auto mb-1" />
      <p className="text-sm font-bold text-cyber-text font-mono">{value}</p>
      <p className="text-[9px] text-gray-500 font-mono">{label}</p>
    </div>
  )
}

// 对话卡片组件
function ConversationCard({
  conversation,
  selected,
  onToggleSelect,
  onArchive,
  onDelete,
  onRestore,
  formatTime,
  tab,
  onClick,
}: {
  conversation: ArchivedConversation
  selected: boolean
  onToggleSelect: () => void
  onArchive: () => void
  onDelete: () => void
  onRestore: () => void
  formatTime: (ts: string) => string
  tab: 'normal' | 'archived' | 'trash'
  onClick: () => void
}) {
  return (
    <div
      className={cn(
        'bg-cyber-panel/50 border rounded-xl overflow-hidden transition-all',
        selected
          ? 'border-cyber-accent/50 bg-cyber-accent/5'
          : 'border-cyber-border hover:border-cyber-accent/30'
      )}
    >
      <div className="flex items-start gap-2.5 p-3">
        {/* 选择框 */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleSelect() }}
          className="mt-0.5 flex-shrink-0"
        >
          {selected ? (
            <CheckSquare className="w-4 h-4 text-cyber-accent" />
          ) : (
            <Square className="w-4 h-4 text-gray-600" />
          )}
        </button>

        {/* 内容 */}
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={tab !== 'trash' ? onClick : undefined}
        >
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="text-sm font-medium text-cyber-text truncate">{conversation.title}</h4>
            <span className="text-[10px] text-gray-600 font-mono flex-shrink-0 flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {formatTime(conversation.timestamp)}
            </span>
          </div>
          <p className="text-xs text-gray-500 line-clamp-1 mb-1.5">{conversation.lastMessage}</p>
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 text-[9px] font-mono bg-cyber-accent/10 text-cyber-accent rounded">
              {conversation.agentName}
            </span>
            <span className="text-[10px] text-gray-600 font-mono">
              {conversation.messageCount} 条消息
            </span>
            {conversation.tags && conversation.tags.length > 0 && (
              <div className="flex gap-1">
                {conversation.tags.slice(0, 2).map(tag => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 text-[9px] font-mono bg-white/5 text-gray-500 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 操作栏 */}
      <div className="px-3 py-1.5 border-t border-cyber-border/50 flex items-center justify-end gap-1">
        {tab === 'trash' ? (
          <>
            <button
              onClick={onRestore}
              className="flex items-center gap-1 px-2 py-1 text-[10px] font-mono text-cyber-accent hover:bg-cyber-accent/10 rounded transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              恢复
            </button>
            <button
              onClick={onDelete}
              className="flex items-center gap-1 px-2 py-1 text-[10px] font-mono text-red-400 hover:bg-red-500/10 rounded transition-colors"
            >
              <Trash className="w-3 h-3" />
              永久删除
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onArchive}
              className="flex items-center gap-1 px-2 py-1 text-[10px] font-mono text-gray-400 hover:bg-white/5 rounded transition-colors"
            >
              <Archive className="w-3 h-3" />
              {tab === 'archived' ? '取消归档' : '归档'}
            </button>
            <button
              onClick={onDelete}
              className="flex items-center gap-1 px-2 py-1 text-[10px] font-mono text-red-400 hover:bg-red-500/10 rounded transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              删除
            </button>
          </>
        )}
      </div>
    </div>
  )
}
