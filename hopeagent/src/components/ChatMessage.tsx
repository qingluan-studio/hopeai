import { useState, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { 
  Copy, 
  Download, 
  ChevronDown, 
  ChevronUp,
  Brain,
  Wrench,
  Check,
  Eye,
  EyeOff,
  Bot,
  User
} from 'lucide-react'
import type { ChatMessage, ThoughtStep, ToolCall } from '@/types'
import { cn } from '@/lib/utils'
import { getAgent } from '@/engine/agents'

const thoughtTypeLabels: Record<string, { label: string; color: string; icon: typeof Brain }> = {
  observe: { label: '观察', color: 'text-blue-400', icon: Eye },
  think: { label: '思考', color: 'text-cyan-400', icon: Brain },
  plan: { label: '规划', color: 'text-purple-400', icon: Brain },
  act: { label: '行动', color: 'text-green-400', icon: Wrench },
  reflect: { label: '反思', color: 'text-yellow-400', icon: Brain },
}

interface MessageProps {
  message: ChatMessage
  streamingContent?: string
}

export default function ChatMessage({ message, streamingContent }: MessageProps) {
  const [copied, setCopied] = useState(false)
  const [thoughtsExpanded, setThoughtsExpanded] = useState(true)
  const [toolExpanded, setToolExpanded] = useState<Record<number, boolean>>({})

  const isUser = message.role === 'user'
  const content = streamingContent || message.content
  const agent = message.agentId ? getAgent(message.agentId) : null

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }, [])

  const saveAsFile = useCallback((text: string, language?: string) => {
    const ext = language === 'typescript' || language === 'tsx' ? 'ts' 
      : language === 'javascript' || language === 'jsx' ? 'js'
      : language === 'python' ? 'py'
      : language || 'txt'
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `code_${Date.now()}.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  const toggleTool = (index: number) => {
    setToolExpanded(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const thoughtTypeLabels: Record<string, { label: string; color: string; icon: typeof Brain }> = {
    observe: { label: '观察', color: 'text-blue-400', icon: Eye },
    think: { label: '思考', color: 'text-cyan-400', icon: Brain },
    plan: { label: '规划', color: 'text-purple-400', icon: Brain },
    act: { label: '行动', color: 'text-green-400', icon: Wrench },
    reflect: { label: '反思', color: 'text-yellow-400', icon: Brain },
  }

  return (
    <div className={cn(
      'py-4 message-enter',
      isUser ? 'bg-transparent' : 'bg-white/[0.02]'
    )}>
      <div className="max-w-4xl mx-auto px-4">
        <div className={cn(
          'flex gap-3',
          isUser ? 'flex-row-reverse' : ''
        )}>
          <div className={cn(
            'w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-lg',
            isUser 
              ? 'bg-gradient-to-br from-blue-500 to-cyan-500' 
              : 'bg-gradient-to-br from-cyber-accent/20 to-cyan-500/20 border border-cyber-accent/30'
          )}>
            {isUser ? <User className="w-5 h-5 text-white" /> : (
              agent ? <span>{agent.avatar}</span> : <Bot className="w-5 h-5 text-cyber-accent" />
            )}
          </div>

          <div className={cn(
            'flex-1 min-w-0 max-w-[85%]',
            isUser ? 'text-right' : ''
          )}>
            <div className={cn(
              'text-xs font-mono mb-1.5 flex items-center gap-2',
              isUser ? 'justify-end' : ''
            )}>
              <span className={isUser ? 'text-blue-400' : 'text-cyber-accent'}>
                {isUser ? '董事长' : (agent?.name || '智能助手')}
              </span>
              <span className="text-gray-600">
                {new Date(message.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {!isUser && message.thoughtSteps && message.thoughtSteps.length > 0 && (
              <div className="mb-3">
                <button
                  onClick={() => setThoughtsExpanded(!thoughtsExpanded)}
                  className="flex items-center gap-2 text-xs font-mono text-cyan-500 hover:text-cyan-400 transition-colors"
                >
                  <Brain className="w-3.5 h-3.5" />
                  <span>思考过程 ({message.thoughtSteps.length}步)</span>
                  {thoughtsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                
                {thoughtsExpanded && (
                  <div className="mt-2 space-y-1.5">
                    {message.thoughtSteps.map((step, i) => (
                      <ThoughtBlock key={step.id} step={step} index={i} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {!isUser && message.toolCalls && message.toolCalls.length > 0 && (
              <div className="mb-3 space-y-2">
                {message.toolCalls.map((tc, i) => (
                  <ToolCallBlock 
                    key={i} 
                    toolCall={tc} 
                    expanded={toolExpanded[i] ?? true}
                    onToggle={() => toggleTool(i)}
                  />
                ))}
              </div>
            )}

            <div className={cn(
              'rounded-2xl px-4 py-3 inline-block text-left',
              isUser 
                ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-sm' 
                : 'bg-transparent text-gray-200 rounded-tl-sm'
            )}>
              {content ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '')
                        const isInline = !match
                        const codeString = String(children).replace(/\n$/, '')
                        
                        if (isInline) {
                          return (
                            <code className="px-1.5 py-0.5 rounded bg-white/10 text-cyber-accent text-[0.9em] font-mono" {...props}>
                              {children}
                            </code>
                          )
                        }

                        const language = match[1]
                        return (
                          <div className="code-block-wrapper my-3 border border-cyber-border rounded-lg overflow-hidden">
                            <div className="code-block-header">
                              <span className="text-xs font-mono text-gray-400">{language}</span>
                              <div className="code-block-actions">
                                <button 
                                  className="code-block-btn"
                                  onClick={() => copyToClipboard(codeString)}
                                >
                                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                </button>
                                <button 
                                  className="code-block-btn"
                                  onClick={() => saveAsFile(codeString, language)}
                                >
                                  <Download className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <SyntaxHighlighter
                              language={language}
                              style={oneDark}
                              customStyle={{
                                margin: 0,
                                padding: '12px',
                                fontSize: '12px',
                                background: 'rgba(0,0,0,0.3)',
                              }}
                            >
                              {codeString}
                            </SyntaxHighlighter>
                          </div>
                        )
                      },
                      p({ children }) {
                        return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
                      },
                      h1({ children }) {
                        return <h1 className="text-xl font-bold mb-3 text-cyber-accent glow-text">{children}</h1>
                      },
                      h2({ children }) {
                        return <h2 className="text-lg font-bold mb-2 text-cyan-400">{children}</h2>
                      },
                      h3({ children }) {
                        return <h3 className="text-base font-bold mb-2 text-blue-400">{children}</h3>
                      },
                      ul({ children }) {
                        return <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
                      },
                      ol({ children }) {
                        return <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
                      },
                      blockquote({ children }) {
                        return <blockquote className="border-l-3 border-cyber-accent/50 pl-3 my-2 text-gray-400 italic">{children}</blockquote>
                      },
                      table({ children }) {
                        return <table className="w-full border-collapse my-3 text-sm">{children}</table>
                      },
                      th({ children }) {
                        return <th className="border border-cyber-border px-3 py-1.5 bg-white/5 text-left">{children}</th>
                      },
                      td({ children }) {
                        return <td className="border border-cyber-border px-3 py-1.5">{children}</td>
                      },
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="flex items-center gap-2 py-1">
                  <div className="dot-flashing" />
                </div>
              )}
            </div>

            {!isUser && message.isComplete && (
              <div className="flex items-center gap-3 mt-2 ml-1">
                <button
                  onClick={() => copyToClipboard(content)}
                  className="text-xs text-gray-500 hover:text-cyber-accent transition-colors flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? '已复制' : '复制'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ThoughtBlock({ step, index }: { step: ThoughtStep; index: number }) {
  const info = thoughtTypeLabels[step.type] || thoughtTypeLabels.think
  const Icon = info.icon

  return (
    <div className="thought-block">
      <div className="thought-header">
        <Icon className="w-3.5 h-3.5" />
        <span className="font-mono">{index + 1}. {info.label}</span>
      </div>
      <div className="thought-content whitespace-pre-wrap">
        {step.content}
      </div>
    </div>
  )
}

function ToolCallBlock({ toolCall, expanded, onToggle }: { 
  toolCall: ToolCall
  expanded: boolean
  onToggle: () => void 
}) {
  const statusColors: Record<string, string> = {
    pending: 'text-gray-400',
    running: 'text-yellow-400',
    success: 'text-green-400',
    error: 'text-red-400',
  }

  const statusLabels: Record<string, string> = {
    pending: '等待中',
    running: '执行中',
    success: '完成',
    error: '失败',
  }

  return (
    <div className="tool-call-block">
      <div className="tool-call-header cursor-pointer" onClick={onToggle}>
        <Wrench className="w-3.5 h-3.5" />
        <span className="font-mono">🔧 {toolCall.toolName}</span>
        <span className={cn('ml-auto text-xs font-mono', statusColors[toolCall.status])}>
          {statusLabels[toolCall.status]}
        </span>
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </div>
      {expanded && (
        <div className="tool-call-content">
          <div className="mb-2">
            <span className="text-gray-500 text-xs">输入：</span>
            <div className="mt-1 text-cyan-300">{toolCall.input.slice(0, 300)}</div>
          </div>
          {toolCall.output && (
            <div>
              <span className="text-gray-500 text-xs">输出：</span>
              <div className="mt-1 text-green-300 whitespace-pre-wrap">{toolCall.output.slice(0, 500)}{toolCall.output.length > 500 ? '...' : ''}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
