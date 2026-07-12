import { useState, useCallback, useMemo, useEffect } from 'react'
import {
  Copy,
  Check,
  RefreshCw,
  Reply,
  Trash2,
  Bot,
  User,
  AlertCircle,
  Hash,
  Shield,
  Info,
  ThumbsUp,
  ThumbsDown,
  Code2,
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import type { ChatMessage as ChatMessageType } from '@/types'
import { cn } from '@/lib/utils'
import { getAgent } from '@/engine/agents'
import MarkdownRenderer from './MarkdownRenderer'
import ThoughtPanel from './ThoughtPanel'
import ToolCallCard from './ToolCallCard'

// ============ Props 定义 ============
interface MessageProps {
  message: ChatMessageType
  /** 流式内容（仅最后一条流式消息传入） */
  streamingContent?: string
  /** 消息序号（从 1 开始） */
  index?: number
  /** 重新生成回调 */
  onRegenerate?: () => void
  /** 引用回复回调 */
  onReply?: (content: string) => void
  /** 删除消息回调 */
  onDelete?: (id: string) => void
  /** 消息反馈回调（点赞/点踩） */
  onFeedback?: (messageId: string, helpful: boolean) => void
}

// ============ 工具函数 ============

/** 将 ISO 时间戳转为相对时间（刚刚 / 3分钟前 / 2小时前 等） */
function getRelativeTime(iso: string): string {
  const now = Date.now()
  const then = new Date(iso).getTime()
  const diff = Math.max(0, now - then)
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) return '刚刚'
  if (diff < hour) return `${Math.floor(diff / minute)}分钟前`
  if (diff < day) return `${Math.floor(diff / hour)}小时前`
  if (diff < 7 * day) return `${Math.floor(diff / day)}天前`
  try {
    return new Date(iso).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  } catch {
    return ''
  }
}

/** 检测消息内容是否包含错误 */
function detectError(content: string): boolean {
  if (!content) return false
  // 错误标志：以错误符号开头、包含错误关键词
  const errorPatterns = [
    /^⚠️/,
    /^❌/,
    /出错了/,
    /错误[：:]/,
    /Error:/i,
    /失败[：:]/,
    /后端连接失败/,
    /后端调用失败/,
    /Traceback/,
    /Exception/,
  ]
  return errorPatterns.some((p) => p.test(content.trim()))
}

/** 提取内容中的错误提示文本 */
function extractErrorHint(content: string): string {
  const firstLine = content.split('\n')[0]
  if (/⚠️/.test(firstLine)) return firstLine.replace(/^⚠️\s*/, '')
  if (/❌/.test(firstLine)) return firstLine.replace(/^❌\s*/, '')
  if (/出错了/.test(firstLine)) return firstLine
  if (/Error:/i.test(firstLine)) return firstLine
  return '消息包含错误信息'
}

/** 估算内容字数（中文按字，英文按词） */
function estimateWordCount(content: string): number {
  if (!content) return 0
  // 去除 Markdown 语法符号后估算
  const cleaned = content.replace(/[#*`>\-\[\]()!]/g, '').trim()
  const chineseChars = (cleaned.match(/[\u4e00-\u9fa5]/g) || []).length
  const englishWords = (cleaned.match(/[a-zA-Z]+/g) || []).length
  return chineseChars + englishWords
}

// ============ 相对时间 Hook（每分钟自动刷新） ============
function useRelativeTime(iso: string): string {
  const [time, setTime] = useState(() => getRelativeTime(iso))
  useEffect(() => {
    setTime(getRelativeTime(iso))
    const timer = setInterval(() => {
      setTime(getRelativeTime(iso))
    }, 60000) // 每分钟刷新一次
    return () => clearInterval(timer)
  }, [iso])
  return time
}

// ============ 打字指示器组件（三点跳动） ============
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-2">
      <span className="w-2 h-2 rounded-full bg-cyber-accent animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 rounded-full bg-cyber-accent animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 rounded-full bg-cyber-accent animate-bounce" style={{ animationDelay: '300ms' }} />
      <span className="text-xs font-mono text-gray-500 ml-2">思考中...</span>
    </div>
  )
}

// ============ 生成进度条组件（流式输出时显示） ============
function GenerationProgress({ content }: { content: string }) {
  // 根据内容长度估算进度（无上限，使用对数缩放）
  const length = content.length
  const progress = Math.min(95, Math.log10(length + 1) * 25)
  return (
    <div className="mt-2 flex items-center gap-2">
      <div className="flex-1 h-0.5 bg-cyber-border rounded-full overflow-hidden">
        <div
          className="h-full bg-cyber-accent transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-[9px] font-mono text-gray-600">{length} 字符</span>
    </div>
  )
}

// ============ 引用回复块组件 ============
function QuoteBlock({ originalContent, agentName }: { originalContent: string; agentName?: string }) {
  const [expanded, setExpanded] = useState(false)
  const preview = originalContent.slice(0, 100)
  const isTruncated = originalContent.length > 100
  return (
    <div className="mb-2 px-3 py-2 rounded-lg border-l-2 border-purple-500/50 bg-purple-500/5 text-xs">
      <div className="flex items-center gap-1.5 text-purple-400 font-mono mb-1">
        <Reply className="w-3 h-3" />
        <span>{agentName || '引用'}</span>
      </div>
      <div className="text-gray-500 whitespace-pre-wrap break-words">
        {expanded ? originalContent : preview}
        {isTruncated && !expanded && '...'}
      </div>
      {isTruncated && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1 text-purple-400 hover:text-purple-300 text-[10px] font-mono flex items-center gap-1"
        >
          {expanded ? <><ChevronUp className="w-2.5 h-2.5" />收起</> : <><ChevronDown className="w-2.5 h-2.5" />展开原文</>}
        </button>
      )}
    </div>
  )
}

// ============ 消息操作栏组件 ============
interface MessageActionsProps {
  content: string
  isUser: boolean
  onRegenerate?: () => void
  onReply?: (content: string) => void
  onDelete?: (id: string) => void
  messageId: string
}

/** 消息 hover 操作栏：复制全文、重新生成、引用回复、删除 */
function MessageActions({ content, isUser, onRegenerate, onReply, onDelete, messageId }: MessageActionsProps) {
  const [copied, setCopied] = useState(false)

  const copyAll = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // 忽略剪贴板错误
    }
  }, [content])

  const actions: {
    icon: typeof Copy
    label: string
    onClick: () => void
    show: boolean
    color: string
  }[] = [
    { icon: copied ? Check : Copy, label: copied ? '已复制' : '复制', onClick: copyAll, show: true, color: 'text-gray-500 hover:text-cyber-accent' },
    { icon: RefreshCw, label: '重新生成', onClick: () => onRegenerate?.(), show: !isUser && !!onRegenerate, color: 'text-gray-500 hover:text-cyan-400' },
    { icon: Reply, label: '引用回复', onClick: () => onReply?.(content), show: !!onReply, color: 'text-gray-500 hover:text-purple-400' },
    { icon: Trash2, label: '删除', onClick: () => onDelete?.(messageId), show: !!onDelete, color: 'text-gray-500 hover:text-red-400' },
  ]

  return (
    <div className="flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
      {actions.filter((a) => a.show).map((a, i) => {
        const Icon = a.icon
        return (
          <button
            key={i}
            onClick={a.onClick}
            className={cn(
              'flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded transition-colors',
              a.color
            )}
            title={a.label}
          >
            <Icon className="w-3 h-3" />
            <span className="hidden sm:inline">{a.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// ============ 消息反馈组件（点赞/点踩） ============
function MessageFeedback({ messageId, onFeedback }: { messageId: string; onFeedback?: (id: string, helpful: boolean) => void }) {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(feedback === type ? null : type)
    onFeedback?.(messageId, type === 'up')
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => handleFeedback('up')}
        className={cn(
          'p-1 rounded transition-colors',
          feedback === 'up' ? 'text-cyber-accent bg-cyber-accent/10' : 'text-gray-600 hover:text-cyber-accent'
        )}
        title="有帮助"
      >
        <ThumbsUp className="w-3 h-3" />
      </button>
      <button
        onClick={() => handleFeedback('down')}
        className={cn(
          'p-1 rounded transition-colors',
          feedback === 'down' ? 'text-red-400 bg-red-500/10' : 'text-gray-600 hover:text-red-400'
        )}
        title="没帮助"
      >
        <ThumbsDown className="w-3 h-3" />
      </button>
    </div>
  )
}

// ============ Agent 头像组件 ============
function AgentAvatar({ agentId, isUser }: { agentId?: string; isUser: boolean }) {
  const agent = agentId ? getAgent(agentId) : undefined

  if (isUser) {
    return (
      <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500 border border-blue-400/30">
        <User className="w-5 h-5 text-white" />
      </div>
    )
  }

  return (
    <div
      className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-lg border relative"
      style={{
        background: agent ? `${agent.color}20` : 'rgba(0,255,136,0.1)',
        borderColor: agent ? `${agent.color}40` : 'rgba(0,255,136,0.3)',
      }}
    >
      {agent ? <span>{agent.avatar}</span> : <Bot className="w-5 h-5 text-cyber-accent" />}
      {/* 在线状态点 */}
      <span
        className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-cyber-bg"
        style={{ background: agent?.color || '#00ff88' }}
      />
    </div>
  )
}

// ============ 系统消息组件 ============
function SystemMessage({ message, index }: { message: ChatMessageType; index?: number }) {
  return (
    <div className="py-2 message-enter">
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-1">
        <div className="flex items-center gap-2 text-[11px] font-mono text-gray-600">
          {index !== undefined && <span className="text-gray-700">#{index}</span>}
          <Info className="w-3 h-3" />
          <span>系统消息</span>
          <span className="text-gray-700">·</span>
          <span>{new Date(message.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div className="text-xs text-gray-500 bg-white/[0.02] border border-cyber-border/50 rounded-lg px-3 py-1.5 max-w-md text-center">
          {message.content}
        </div>
      </div>
    </div>
  )
}

// ============ 主组件 ============
export default function ChatMessage({
  message,
  streamingContent,
  index,
  onRegenerate,
  onReply,
  onDelete,
  onFeedback,
}: MessageProps) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'
  const isAssistant = message.role === 'assistant'
  // 流式内容优先于消息内容
  const content = streamingContent !== undefined ? streamingContent : message.content
  // 是否正在流式输出
  const isStreaming = streamingContent !== undefined || !message.isComplete
  const agent = message.agentId ? getAgent(message.agentId) : null
  const relativeTime = useRelativeTime(message.timestamp)

  // 检测错误状态
  const hasError = useMemo(() => detectError(content), [content])
  const errorHint = useMemo(() => (hasError ? extractErrorHint(content) : ''), [content, hasError])

  // 内容字数统计
  const wordCount = useMemo(() => estimateWordCount(content), [content])
  // 是否为长消息（超过 500 字可折叠）
  const isLongMessage = wordCount > 500
  const [messageCollapsed, setMessageCollapsed] = useState(false)

  // 查看 Markdown 源码切换
  const [showRaw, setShowRaw] = useState(false)

  // 复制全文
  const [copied, setCopied] = useState(false)
  const copyContent = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // 忽略剪贴板错误
    }
  }, [content])

  // 系统消息单独渲染
  if (isSystem) {
    return <SystemMessage message={message} index={index} />
  }

  // 长消息折叠时显示的内容
  const displayContent = isLongMessage && messageCollapsed
    ? content.slice(0, 300) + '\n\n...(消息已折叠，点击展开查看完整内容)'
    : content

  return (
    <div
      className={cn(
        'py-4 message-enter group',
        isUser ? 'bg-transparent' : 'bg-white/[0.02]',
        hasError && '!bg-red-500/[0.03]'
      )}
    >
      <div className="max-w-4xl mx-auto px-4">
        <div className={cn('flex gap-3', isUser ? 'flex-row-reverse' : '')}>
          {/* 头像 */}
          <AgentAvatar agentId={message.agentId} isUser={isUser} />

          {/* 消息主体 */}
          <div className={cn('flex-1 min-w-0 max-w-[85%]', isUser ? 'text-right' : '')}>
            {/* 头部：Agent 名称 + 角色标签 + 消息编号 + 时间戳 */}
            <div
              className={cn(
                'text-xs font-mono mb-1.5 flex items-center gap-2 flex-wrap',
                isUser ? 'justify-end' : ''
              )}
            >
              {/* 消息编号 */}
              {index !== undefined && (
                <span className="text-gray-700 flex items-center gap-0.5">
                  <Hash className="w-2.5 h-2.5" />
                  {index}
                </span>
              )}

              {/* Agent 名称 + 角色标签 */}
              {isUser ? (
                <span className="text-blue-400 font-bold">董事长</span>
              ) : (
                <>
                  <span
                    className="font-bold"
                    style={{ color: agent?.color || '#00ff88' }}
                  >
                    {agent?.name || message.agentName || '智能助手'}
                  </span>
                  {agent && (
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded border flex items-center gap-0.5"
                      style={{
                        color: agent.color,
                        borderColor: `${agent.color}40`,
                        background: `${agent.color}10`,
                      }}
                    >
                      <Shield className="w-2 h-2" />
                      {agent.role}
                    </span>
                  )}
                </>
              )}

              {/* 相对时间 */}
              <span className="text-gray-600" title={new Date(message.timestamp).toLocaleString('zh-CN')}>
                {relativeTime}
              </span>

              {/* 流式状态指示 */}
              {isStreaming && (
                <span className="text-cyber-accent flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-accent" />
                  生成中
                </span>
              )}

              {/* 字数统计（完成且超过 50 字时显示） */}
              {!isStreaming && wordCount > 50 && (
                <span className="text-gray-700 text-[10px]">
                  · {wordCount} 字
                </span>
              )}
            </div>

            {/* 思维链面板（仅助手消息且有思维步骤） */}
            {!isUser && message.thoughtSteps && message.thoughtSteps.length > 0 && (
              <ThoughtPanel steps={message.thoughtSteps} defaultExpanded={false} />
            )}

            {/* 工具调用卡片（仅助手消息且有工具调用） */}
            {!isUser && message.toolCalls && message.toolCalls.length > 0 && (
              <div className="mb-2 space-y-1">
                {message.toolCalls.map((tc, i) => (
                  <ToolCallCard key={i} toolCall={tc} defaultExpanded={tc.status === 'error'} />
                ))}
              </div>
            )}

            {/* 错误提示横幅 */}
            {hasError && (
              <div className="mb-2 px-3 py-1.5 rounded-lg border border-red-500/40 bg-red-500/10 flex items-center gap-2 text-xs">
                <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <span className="text-red-300 font-mono">{errorHint}</span>
              </div>
            )}

            {/* 消息内容 */}
            <div
              className={cn(
                'inline-block text-left',
                isUser
                  ? 'rounded-2xl rounded-tr-sm px-4 py-3 bg-gradient-to-br from-blue-600 to-blue-700 text-white border border-blue-400/30'
                  : hasError
                  ? 'rounded-2xl rounded-tl-sm px-4 py-3 border border-red-500/30 bg-red-500/5'
                  : ''
              )}
            >
              {content ? (
                <>
                  {/* 查看源码模式 */}
                  {showRaw && !isUser ? (
                    <pre className="text-xs font-mono text-gray-400 whitespace-pre-wrap break-words p-2 bg-cyber-bg/40 rounded border border-cyber-border overflow-x-auto">
                      {content}
                    </pre>
                  ) : (
                    <>
                      {/* 用户消息纯文本展示，助手消息 Markdown 渲染 */}
                      {isUser ? (
                        <div className="whitespace-pre-wrap break-words leading-relaxed">{displayContent}</div>
                      ) : (
                        <MarkdownRenderer content={displayContent} />
                      )}
                    </>
                  )}

                  {/* 流式光标 */}
                  {isStreaming && !isUser && (
                    <>
                      <span className="inline-block ml-0.5 align-middle">
                        <span className="inline-block w-[2px] h-[0.9em] bg-cyber-accent animate-pulse" />
                      </span>
                      <GenerationProgress content={content} />
                    </>
                  )}

                  {/* 长消息折叠/展开按钮 */}
                  {isLongMessage && !isStreaming && (
                    <button
                      onClick={() => setMessageCollapsed(!messageCollapsed)}
                      className="mt-2 text-[10px] font-mono text-cyber-accent hover:text-cyber-accent2 flex items-center gap-1"
                    >
                      {messageCollapsed ? (
                        <><ChevronDown className="w-3 h-3" />展开全文 ({wordCount} 字)</>
                      ) : (
                        <><ChevronUp className="w-3 h-3" />收起</>
                      )}
                    </button>
                  )}
                </>
              ) : (
                // 无内容时的加载动画
                <TypingIndicator />
              )}
            </div>

            {/* 消息操作栏（hover 显示） */}
            {!isStreaming && (
              <div className={cn('flex items-center gap-2 mt-1.5', isUser ? 'justify-end' : 'justify-start')}>
                <MessageActions
                  content={content}
                  isUser={isUser}
                  onRegenerate={onRegenerate}
                  onReply={onReply}
                  onDelete={onDelete}
                  messageId={message.id}
                />
                {/* 助手消息：查看源码切换 + 反馈 */}
                {!isUser && content && (
                  <>
                    <button
                      onClick={() => setShowRaw(!showRaw)}
                      className="p-1 rounded text-gray-600 hover:text-cyber-accent transition-colors opacity-0 group-hover:opacity-100"
                      title={showRaw ? '渲染视图' : '查看源码'}
                    >
                      {showRaw ? <Eye className="w-3 h-3" /> : <Code2 className="w-3 h-3" />}
                    </button>
                    {onFeedback && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MessageFeedback messageId={message.id} onFeedback={onFeedback} />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* 助手消息底部统计栏（始终可见） */}
            {!isUser && message.isComplete && content && (
              <div className="flex items-center gap-3 mt-1.5 ml-1 flex-wrap">
                <button
                  onClick={copyContent}
                  className="text-[10px] text-gray-600 hover:text-cyber-accent transition-colors flex items-center gap-1 font-mono"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? '已复制' : '复制全文'}
                </button>
                {message.thoughtSteps && message.thoughtSteps.length > 0 && (
                  <span className="text-[10px] text-gray-700 font-mono">
                    · {message.thoughtSteps.length} 步思考
                  </span>
                )}
                {message.toolCalls && message.toolCalls.length > 0 && (
                  <span className="text-[10px] text-gray-700 font-mono">
                    · {message.toolCalls.length} 次工具调用
                  </span>
                )}
                {agent && (
                  <span className="text-[10px] text-gray-700 font-mono hidden md:inline">
                    · {agent.specialty}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
