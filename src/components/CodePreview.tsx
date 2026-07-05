import { useState, useCallback } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { 
  FileCode, 
  Folder, 
  FolderOpen, 
  Copy, 
  Download, 
  ChevronRight,
  FileText,
  Code2,
  Check
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  language?: string
  content?: string
  children?: FileNode[]
}

const sampleFiles: FileNode[] = [
  {
    id: 'src',
    name: 'src',
    type: 'folder',
    children: [
      {
        id: 'components',
        name: 'components',
        type: 'folder',
        children: [
          {
            id: 'chat-area',
            name: 'ChatArea.tsx',
            type: 'file',
            language: 'typescript',
            content: `import { useEffect, useRef, useState } from 'react'
import { MessageSquare, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useChatStore } from '@/store/useChatStore'
import MessageBubble from './MessageBubble'

export default function ChatArea() {
  const { messages, isStreaming } = useChatStore()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(true)

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isStreaming, autoScroll])

  return (
    <div className="flex flex-col h-full bg-gray-950 border border-green-900/30">
      <div className="px-4 py-3 border-b border-green-900/30">
        <h2 className="text-green-400 font-mono text-sm tracking-widest">
          CHAT CONSOLE
        </h2>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>
    </div>
  )
}`,
          },
          {
            id: 'message-bubble',
            name: 'MessageBubble.tsx',
            type: 'file',
            language: 'typescript',
            content: `import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'
import type { Message } from '@/types'

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const agentRole = useMemo(() => {
    if (message.role === 'user') return 'user'
    return message.metadata?.agentRole || 'system'
  }, [message])

  return (
    <div className="p-4 rounded-lg border border-gray-800 bg-gray-900/60">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-sm font-mono font-bold text-green-400">
          {agentRole}
        </div>
        <div className="text-[10px] text-gray-500 font-mono">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
      <div className="text-sm font-mono text-gray-300">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  )
}`,
          },
        ],
      },
      {
        id: 'types',
        name: 'types',
        type: 'folder',
        children: [
          {
            id: 'index-types',
            name: 'index.ts',
            type: 'file',
            language: 'typescript',
            content: `export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  type: 'text' | 'code' | 'image' | 'file'
  metadata?: Record<string, unknown>
}

export interface Agent {
  id: string
  name: string
  role: string
  status: 'idle' | 'working' | 'paused' | 'completed' | 'error'
  progress: number
  currentTask: string
  lastActive: number
}

export type Theme = 'cyber' | 'matrix' | 'retro'`,
          },
        ],
      },
      {
        id: 'utils',
        name: 'lib',
        type: 'folder',
        children: [
          {
            id: 'utils-file',
            name: 'utils.ts',
            type: 'file',
            language: 'typescript',
            content: `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}`,
          },
        ],
      },
      {
        id: 'app',
        name: 'App.tsx',
        type: 'file',
        language: 'typescript',
        content: `import { useState } from 'react'
import AgentPanel from './components/AgentPanel'
import ChatArea from './components/ChatArea'
import CodePreview from './components/CodePreview'
import MatrixBackground from './components/MatrixBackground'
import StatusBar from './components/StatusBar'
import CommandInput from './components/CommandInput'

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'code'>('chat')

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-950">
      <MatrixBackground />
      <div className="relative z-10 flex h-full">
        <AgentPanel />
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex">
            <div className="flex-1">
              {activeTab === 'chat' ? <ChatArea /> : <CodePreview />}
            </div>
          </div>
          <CommandInput />
          <StatusBar />
        </div>
      </div>
    </div>
  )
}`,
      },
    ],
  },
  {
    id: 'config',
    name: 'package.json',
    type: 'file',
    language: 'json',
    content: `{
  "name": "ai-agent-system",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint ."
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "zustand": "^5.0.3",
    "react-markdown": "^10.1.0",
    "react-syntax-highlighter": "^16.1.1",
    "lucide-react": "^0.511.0",
    "tailwindcss": "^3.4.17"
  },
  "devDependencies": {
    "typescript": "~5.8.3",
    "vite": "^6.3.5"
  }
}`,
  },
  {
    id: 'readme',
    name: 'README.md',
    type: 'file',
    language: 'markdown',
    content: `# AI Agent System

一个基于多智能体协作的代码生成系统。

## 功能特性

- 多智能体协作架构
- 实时代码预览
- Markdown 消息支持
- 语法高亮显示
- 极客风格终端界面

## 智能体角色

| 角色 | 职责 |
|------|------|
| 董事长 | 任务分配与协调 |
| 分析员 | 需求分析与设计 |
| 代码员A/B/C | 代码编写 |
| 检查员A/B | 代码审查 |
| 扩展员 | 功能扩展 |
| 打包员 | 项目构建 |
| 输送员 | 部署交付 |

## 快速开始

\`\`\`bash
npm install
npm run dev
\`\`\`

## 技术栈

- React 18
- TypeScript
- Tailwind CSS
- Zustand
- Vite
`,
  },
]

interface FileTreeItemProps {
  node: FileNode
  level: number
  expandedFolders: Set<string>
  selectedFileId: string | null
  onToggleFolder: (id: string) => void
  onSelectFile: (file: FileNode) => void
}

function FileTreeItem({ 
  node, 
  level, 
  expandedFolders, 
  selectedFileId,
  onToggleFolder, 
  onSelectFile 
}: FileTreeItemProps) {
  const isExpanded = expandedFolders.has(node.id)
  const isSelected = selectedFileId === node.id

  const handleClick = () => {
    if (node.type === 'folder') {
      onToggleFolder(node.id)
    } else {
      onSelectFile(node)
    }
  }

  return (
    <div>
      <div
        onClick={handleClick}
        className={cn(
          'flex items-center gap-1.5 px-2 py-1.5 cursor-pointer transition-all duration-200 rounded font-mono text-xs',
          isSelected 
            ? 'bg-green-900/30 text-green-400 border border-green-700/50' 
            : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300 border border-transparent'
        )}
        style={{ 
          paddingLeft: `${level * 12 + 8}px`,
          boxShadow: isSelected ? '0 0 10px rgba(34, 197, 94, 0.2)' : undefined,
        }}
      >
        {node.type === 'folder' ? (
          <>
            <ChevronRight 
              className={cn(
                'w-3 h-3 flex-shrink-0 transition-transform duration-200',
                isExpanded && 'rotate-90'
              )} 
            />
            {isExpanded ? (
              <FolderOpen className="w-3.5 h-3.5 flex-shrink-0 text-yellow-500" />
            ) : (
              <Folder className="w-3.5 h-3.5 flex-shrink-0 text-yellow-600" />
            )}
          </>
        ) : (
          <>
            <span className="w-3 flex-shrink-0" />
            {node.language === 'typescript' || node.language === 'javascript' ? (
              <FileCode className="w-3.5 h-3.5 flex-shrink-0 text-blue-400" />
            ) : node.language === 'json' ? (
              <Code2 className="w-3.5 h-3.5 flex-shrink-0 text-yellow-400" />
            ) : node.language === 'markdown' ? (
              <FileText className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
            ) : (
              <FileText className="w-3.5 h-3.5 flex-shrink-0 text-gray-500" />
            )}
          </>
        )}
        <span className="truncate">{node.name}</span>
      </div>
      {node.type === 'folder' && isExpanded && node.children && (
        <div className="border-l border-gray-800/50 ml-4">
          {node.children.map((child) => (
            <FileTreeItem
              key={child.id}
              node={child}
              level={level + 1}
              expandedFolders={expandedFolders}
              selectedFileId={selectedFileId}
              onToggleFolder={onToggleFolder}
              onSelectFile={onSelectFile}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function CodePreview() {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    () => new Set(['src', 'components', 'types', 'utils'])
  )
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(
    sampleFiles[0].children?.find(c => c.id === 'components')?.children?.[0] || null
  )
  const [copied, setCopied] = useState(false)

  const toggleFolder = useCallback((id: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const handleSelectFile = useCallback((file: FileNode) => {
    setSelectedFile(file)
    setCopied(false)
  }, [])

  const handleCopy = useCallback(() => {
    if (selectedFile?.content) {
      navigator.clipboard.writeText(selectedFile.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [selectedFile])

  const handleDownload = useCallback(() => {
    if (selectedFile?.content && selectedFile.name) {
      const blob = new Blob([selectedFile.content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = selectedFile.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }, [selectedFile])

  return (
    <div className="flex h-full bg-gray-950/80 border-l border-green-900/30 backdrop-blur-sm">
      <div className="w-56 border-r border-green-900/30 flex flex-col bg-gray-900/30">
        <div className="px-3 py-2.5 border-b border-green-900/30">
          <div className="text-green-400 font-mono text-xs tracking-widest"
            style={{ textShadow: '0 0 8px rgba(34, 197, 94, 0.4)' }}
          >
            FILE EXPLORER
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {sampleFiles.map((node) => (
            <FileTreeItem
              key={node.id}
              node={node}
              level={0}
              expandedFolders={expandedFolders}
              selectedFileId={selectedFile?.id || null}
              onToggleFolder={toggleFolder}
              onSelectFile={handleSelectFile}
            />
          ))}
        </div>
        <div className="px-3 py-2 border-t border-green-900/30">
          <div className="text-[10px] text-gray-500 font-mono">
            {selectedFile ? '1 FILE SELECTED' : 'NO FILE'}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {selectedFile ? (
          <>
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-green-900/30 bg-gray-900/50">
              <div className="flex items-center gap-3 min-w-0">
                <FileCode className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-gray-200 font-mono text-sm truncate">
                  {selectedFile.name}
                </span>
                <span className={cn(
                  'px-2 py-0.5 rounded text-[9px] font-mono tracking-wider border flex-shrink-0',
                  selectedFile.language === 'typescript' ? 'text-blue-400 border-blue-700/50 bg-blue-950/30' :
                  selectedFile.language === 'json' ? 'text-yellow-400 border-yellow-700/50 bg-yellow-950/30' :
                  selectedFile.language === 'markdown' ? 'text-gray-400 border-gray-700/50 bg-gray-800/30' :
                  'text-gray-400 border-gray-700/50 bg-gray-800/30'
                )}>
                  {selectedFile.language?.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border transition-all duration-200',
                    copied 
                      ? 'bg-green-900/30 border-green-700/50 text-green-400' 
                      : 'bg-gray-800/50 border-gray-700/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300'
                  )}
                  style={{
                    boxShadow: copied ? '0 0 10px rgba(34, 197, 94, 0.2)' : undefined,
                  }}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      COPIED
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      COPY
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border bg-gray-800/50 border-gray-700/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300 transition-all duration-200"
                >
                  <Download className="w-3.5 h-3.5" />
                  DOWNLOAD
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto border-t border-gray-800/50">
              <SyntaxHighlighter
                style={tomorrow}
                language={selectedFile.language || 'text'}
                showLineNumbers
                customStyle={{
                  margin: 0,
                  borderRadius: 0,
                  fontSize: '13px',
                  lineHeight: '1.6',
                  background: 'rgba(0, 0, 0, 0.3)',
                  minHeight: '100%',
                }}
                lineNumberStyle={{
                  minWidth: '3em',
                  paddingRight: '1em',
                  color: '#4b5563',
                  textAlign: 'right',
                  userSelect: 'none',
                }}
              >
                {selectedFile.content || ''}
              </SyntaxHighlighter>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <FileCode className="w-16 h-16 text-gray-700 mb-4" />
            <div className="text-gray-500 font-mono text-sm">NO FILE SELECTED</div>
            <div className="text-gray-600 font-mono text-xs mt-2">从左侧选择一个文件查看</div>
          </div>
        )}
      </div>

      <style>{`
        .overflow-y-auto::-webkit-scrollbar,
        .overflow-auto::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track,
        .overflow-auto::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .overflow-y-auto::-webkit-scrollbar-thumb,
        .overflow-auto::-webkit-scrollbar-thumb {
          background: rgba(34, 197, 94, 0.3);
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover,
        .overflow-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 197, 94, 0.5);
        }
      `}</style>
    </div>
  )
}
