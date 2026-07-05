import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { 
  Crown, 
  BarChart3, 
  Code2, 
  Search, 
  GitBranch, 
  Package, 
  Send,
  User
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Message } from '@/types'

export type AgentRole = 
  | 'user'
  | 'system'
  | 'chairman' 
  | 'analyst' 
  | 'coder1' | 'coder2' | 'coder3' 
  | 'inspector1' | 'inspector2' 
  | 'extender' 
  | 'packer' 
  | 'deliverer'

interface AgentConfig {
  name: string
  icon: typeof Crown
  color: string
  borderColor: string
  bgColor: string
  glowColor: string
}

const agentConfigs: Record<AgentRole, AgentConfig> = {
  user: {
    name: '用户',
    icon: User,
    color: 'text-cyan-400',
    borderColor: 'border-cyan-700/50',
    bgColor: 'bg-cyan-950/30',
    glowColor: 'rgba(34, 211, 238, 0.3)',
  },
  system: {
    name: '系统',
    icon: Send,
    color: 'text-gray-400',
    borderColor: 'border-gray-700/50',
    bgColor: 'bg-gray-900/50',
    glowColor: 'rgba(156, 163, 175, 0.2)',
  },
  chairman: {
    name: '董事长',
    icon: Crown,
    color: 'text-yellow-400',
    borderColor: 'border-yellow-600/50',
    bgColor: 'bg-yellow-950/30',
    glowColor: 'rgba(250, 204, 21, 0.3)',
  },
  analyst: {
    name: '分析员',
    icon: BarChart3,
    color: 'text-blue-400',
    borderColor: 'border-blue-600/50',
    bgColor: 'bg-blue-950/30',
    glowColor: 'rgba(96, 165, 250, 0.3)',
  },
  coder1: {
    name: '代码员A',
    icon: Code2,
    color: 'text-green-400',
    borderColor: 'border-green-600/50',
    bgColor: 'bg-green-950/30',
    glowColor: 'rgba(74, 222, 128, 0.3)',
  },
  coder2: {
    name: '代码员B',
    icon: Code2,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-600/50',
    bgColor: 'bg-emerald-950/30',
    glowColor: 'rgba(52, 211, 153, 0.3)',
  },
  coder3: {
    name: '代码员C',
    icon: Code2,
    color: 'text-teal-400',
    borderColor: 'border-teal-600/50',
    bgColor: 'bg-teal-950/30',
    glowColor: 'rgba(45, 212, 191, 0.3)',
  },
  inspector1: {
    name: '检查员A',
    icon: Search,
    color: 'text-purple-400',
    borderColor: 'border-purple-600/50',
    bgColor: 'bg-purple-950/30',
    glowColor: 'rgba(192, 132, 252, 0.3)',
  },
  inspector2: {
    name: '检查员B',
    icon: Search,
    color: 'text-violet-400',
    borderColor: 'border-violet-600/50',
    bgColor: 'bg-violet-950/30',
    glowColor: 'rgba(167, 139, 250, 0.3)',
  },
  extender: {
    name: '扩展员',
    icon: GitBranch,
    color: 'text-cyan-400',
    borderColor: 'border-cyan-600/50',
    bgColor: 'bg-cyan-950/30',
    glowColor: 'rgba(34, 211, 238, 0.3)',
  },
  packer: {
    name: '打包员',
    icon: Package,
    color: 'text-orange-400',
    borderColor: 'border-orange-600/50',
    bgColor: 'bg-orange-950/30',
    glowColor: 'rgba(251, 146, 60, 0.3)',
  },
  deliverer: {
    name: '输送员',
    icon: Send,
    color: 'text-pink-400',
    borderColor: 'border-pink-600/50',
    bgColor: 'bg-pink-950/30',
    glowColor: 'rgba(244, 114, 182, 0.3)',
  },
}

interface MessageBubbleProps {
  message: Message
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const agentRole = useMemo<AgentRole>(() => {
    if (message.role === 'user') return 'user'
    if (message.role === 'system') return 'system'
    const metadataRole = message.metadata?.agentRole as AgentRole | undefined
    return metadataRole || 'system'
  }, [message])

  const config = agentConfigs[agentRole]
  const Icon = config.icon

  return (
    <div className={cn(
      'group relative p-4 rounded-lg border backdrop-blur-sm transition-all duration-300',
      config.bgColor,
      config.borderColor,
    )}
    style={{
      boxShadow: `0 0 20px ${config.glowColor}, inset 0 0 20px ${config.glowColor}20`,
    }}
    >
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div 
          className="absolute inset-0 blur-sm"
          style={{ background: `linear-gradient(90deg, transparent, ${config.glowColor}30, transparent)` }}
        />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className={cn(
            'p-2 rounded border',
            config.borderColor,
            config.bgColor,
          )}
          style={{
            boxShadow: `0 0 10px ${config.glowColor}`,
          }}
          >
            <Icon 
              className={cn('w-4 h-4', config.color)}
              style={{ filter: `drop-shadow(0 0 4px currentColor)` }}
            />
          </div>
          <div className="flex-1">
            <div 
              className={cn('text-sm font-bold font-mono tracking-wide', config.color)}
              style={{ textShadow: `0 0 8px ${config.glowColor}` }}
            >
              {config.name}
            </div>
            <div className="text-[10px] text-gray-500 font-mono">
              {formatTime(message.timestamp)}
            </div>
          </div>
          <div className={cn(
            'px-2 py-0.5 rounded text-[9px] font-mono tracking-widest border',
            config.color,
            config.borderColor,
          )}>
            {message.type.toUpperCase()}
          </div>
        </div>

        <div className="border-t border-gray-800/50 pt-3">
          {message.type === 'code' ? (
            <div className="rounded overflow-hidden border border-gray-800">
              <SyntaxHighlighter
                style={tomorrow}
                language="typescript"
                showLineNumbers
                customStyle={{
                  margin: 0,
                  borderRadius: '0',
                  fontSize: '13px',
                  background: 'rgba(0, 0, 0, 0.5)',
                }}
              >
                {message.content}
              </SyntaxHighlighter>
            </div>
          ) : (
            <div className={cn(
              'text-sm font-mono leading-relaxed',
              agentRole === 'user' ? 'text-gray-200' : 'text-gray-300'
            )}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    const isInline = !match
                    return !isInline && match ? (
                      <div className="my-3 rounded overflow-hidden border border-gray-700/50">
                        <SyntaxHighlighter
                          style={tomorrow}
                          language={match[1]}
                          showLineNumbers
                          customStyle={{
                            margin: 0,
                            fontSize: '12px',
                            background: 'rgba(0, 0, 0, 0.3)',
                          }}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code 
                        className={cn(
                          'px-1.5 py-0.5 rounded text-xs bg-gray-800/80 border border-gray-700/50',
                          config.color
                        )}
                        {...props}
                      >
                        {children}
                      </code>
                    )
                  },
                  p({ children }) {
                    return <p className="mb-2 last:mb-0">{children}</p>
                  },
                  ul({ children }) {
                    return <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
                  },
                  ol({ children }) {
                    return <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
                  },
                  li({ children }) {
                    return <li className="text-gray-400">{children}</li>
                  },
                  blockquote({ children }) {
                    return (
                      <blockquote className={cn(
                        'border-l-2 pl-3 my-2 italic',
                        config.borderColor,
                        config.color,
                      )}>
                        {children}
                      </blockquote>
                    )
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
