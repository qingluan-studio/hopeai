import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Send,
  Plus,
  Mic,
  Sparkles,
  Paperclip,
  Slash,
  MessageSquare,
  Bot,
  X,
  Check,
  Loader2,
  CornerDownLeft,
  ArrowUp,
  Search,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useChatStore } from '@/store'
import { agents, getAgent } from '@/engine/agents'
import { filesApi } from '@/services/apiClient'

// ============ Props 定义 ============
interface InputBoxProps {
  onSend: (text: string) => void
  disabled?: boolean
  onCommand?: (command: string, args: string) => void
}

// ============ 命令定义 ============
interface CommandDef {
  cmd: string
  label: string
  desc: string
  icon: typeof Slash
}

const commands: CommandDef[] = [
  { cmd: '/clear', label: '清空对话', desc: '清除当前对话的所有消息', icon: X },
  { cmd: '/export', label: '导出对话', desc: '将当前对话导出为 Markdown', icon: ArrowUp },
  { cmd: '/agent', label: '切换 Agent', desc: '切换到指定的 Agent', icon: Bot },
  { cmd: '/model', label: '切换模型', desc: '切换 LLM 模型', icon: Sparkles },
  { cmd: '/help', label: '帮助', desc: '显示帮助信息', icon: MessageSquare },
  { cmd: '/search', label: '搜索知识库', desc: '搜索知识库内容', icon: Search },
]

// ============ 快捷动作 ============
const quickActions = [
  { label: '写代码', prompt: '帮我写一段' },
  { label: '分析数据', prompt: '帮我分析这组数据' },
  { label: '设计方案', prompt: '帮我设计一个方案' },
  { label: '头脑风暴', prompt: '帮我头脑风暴一下' },
  { label: 'Debug', prompt: '帮我调试这段代码' },
  { label: '翻译', prompt: '帮我翻译这段内容' },
]

// ============ 字数阈值 ============
const WORD_COUNT_THRESHOLD = 200

/**
 * 输入框组件
 * - 多模式：对话模式 / 命令模式（输入 / 触发）
 * - 命令面板：/clear /export /agent /model /help /search
 * - Agent 快切：底部显示当前 Agent，点击弹出选择器
 * - 附件上传：调用后端 /api/files/upload
 * - 字数统计：超长时显示字数
 * - 语音输入：webkitSpeechRecognition（中文 zh-CN）
 * - 拖拽上传：支持拖拽文件到输入框
 * - Enter 发送 / Shift+Enter 换行
 */
export default function InputBox({ onSend, disabled, onCommand }: InputBoxProps) {
  const { activeAgentId, setActiveAgent } = useChatStore()
  const currentAgent = getAgent(activeAgentId) || agents[0]

  const [text, setText] = useState('')
  const [showActions, setShowActions] = useState(false)
  const [showAgentSelector, setShowAgentSelector] = useState(false)
  const [showCommandPanel, setShowCommandPanel] = useState(false)
  const [commandFilter, setCommandFilter] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [attachments, setAttachments] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)

  // 自适应文本框高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }, [text])

  // 检测命令模式：输入以 / 开头时弹出命令面板
  useEffect(() => {
    if (text.startsWith('/')) {
      setShowCommandPanel(true)
      setCommandFilter(text.slice(1).split(' ')[0])
    } else {
      setShowCommandPanel(false)
    }
  }, [text])

  // 监听引用回复事件（来自 ChatMessage 的 onReply）
  useEffect(() => {
    const handleReply = (e: Event) => {
      const detail = (e as CustomEvent).detail as string
      const quote = detail.split('\n').map((l: string) => `> ${l}`).join('\n').slice(0, 200)
      setText(quote + '\n\n')
      textareaRef.current?.focus()
    }
    window.addEventListener('inputbox-reply', handleReply as EventListener)
    return () => window.removeEventListener('inputbox-reply', handleReply as EventListener)
  }, [])

  // 过滤命令列表
  const filteredCommands = commands.filter(
    (c) => !commandFilter || c.cmd.startsWith('/' + commandFilter)
  )

  // 发送消息
  const handleSubmit = useCallback(() => {
    const t = text.trim()
    if (!t || disabled) return
    // 命令模式
    if (t.startsWith('/')) {
      const parts = t.slice(1).split(/\s+/)
      const cmd = parts[0]
      const args = parts.slice(1).join(' ')
      onCommand?.(cmd, args)
      setText('')
      return
    }
    onSend(t)
    setText('')
    setAttachments([])
  }, [text, disabled, onSend, onCommand])

  // 键盘事件：Enter 发送，Shift+Enter 换行
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // 语音输入（webkitSpeechRecognition）
  const toggleVoiceInput = useCallback(() => {
    if (isRecording) {
      recognitionRef.current?.stop()
      setIsRecording(false)
      return
    }
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (!SpeechRecognition) {
      alert('当前浏览器不支持语音输入，请使用 Chrome 浏览器')
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = 'zh-CN'
    recognition.continuous = false
    recognition.interimResults = true
    recognition.onresult = (event: any) => {
      let transcript = ''
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      setText(transcript)
    }
    recognition.onerror = () => {
      setIsRecording(false)
    }
    recognition.onend = () => {
      setIsRecording(false)
    }
    recognition.start()
    recognitionRef.current = recognition
    setIsRecording(true)
  }, [isRecording])

  // 文件上传（调用后端 /api/files/upload）
  const uploadFile = useCallback(async (file: File) => {
    setUploading(true)
    try {
      const result = await filesApi.upload(file)
      setAttachments((prev) => [...prev, result.url || result.path || result.filename || file.name])
    } catch {
      // 上传失败时，本地记录文件名
      setAttachments((prev) => [...prev, file.name])
    } finally {
      setUploading(false)
    }
  }, [])

  // 文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    Array.from(files).forEach(uploadFile)
    e.target.value = ''
  }

  // 拖拽上传
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    if (files) {
      Array.from(files).forEach(uploadFile)
    }
  }

  // 命令选择
  const selectCommand = (cmd: string) => {
    setText(cmd + ' ')
    setShowCommandPanel(false)
    textareaRef.current?.focus()
  }

  // Agent 选择
  const selectAgent = (agentId: string) => {
    setActiveAgent(agentId)
    setShowAgentSelector(false)
  }

  // 移除附件
  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  // 字数统计
  const charCount = text.length
  const showWordCount = charCount > WORD_COUNT_THRESHOLD

  // 建议补全：根据输入内容匹配快捷动作
  const suggestions = text && !text.startsWith('/')
    ? quickActions
        .filter((a) => a.prompt.includes(text) || a.label.includes(text))
        .slice(0, 3)
    : []

  return (
    <div className="border-t border-cyber-border/50 bg-cyber-panel/30 backdrop-blur-sm flex-shrink-0">
      {/* 命令面板 */}
      {showCommandPanel && (
        <div className="px-3 pt-2">
          <div className="rounded-lg border border-cyber-accent/30 bg-cyber-bg overflow-hidden shadow-lg">
            <div className="px-3 py-1.5 bg-cyber-accent/5 border-b border-cyber-border text-[10px] font-mono text-cyber-accent flex items-center gap-1.5">
              <Slash className="w-3 h-3" />
              命令面板
            </div>
            {filteredCommands.length > 0 ? (
              filteredCommands.map((c) => {
                const Icon = c.icon
                return (
                  <button
                    key={c.cmd}
                    onClick={() => selectCommand(c.cmd)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-cyber-accent/5 transition-colors text-left group"
                  >
                    <Icon className="w-4 h-4 text-cyber-accent flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-mono text-gray-300 group-hover:text-cyber-text">
                        {c.cmd}
                        <span className="text-gray-600 ml-2">{c.label}</span>
                      </div>
                      <div className="text-[10px] text-gray-600">{c.desc}</div>
                    </div>
                  </button>
                )
              })
            ) : (
              <div className="px-3 py-3 text-xs text-gray-600 font-mono">无匹配命令</div>
            )}
          </div>
        </div>
      )}

      {/* 建议补全 */}
      {suggestions.length > 0 && !showCommandPanel && (
        <div className="px-3 pt-2 flex flex-wrap gap-1.5">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => {
                setText(s.prompt)
                textareaRef.current?.focus()
              }}
              className="px-2 py-1 rounded-full bg-cyber-accent/5 border border-cyber-accent/20 hover:border-cyber-accent/40 transition-all text-[10px] font-mono text-gray-400 hover:text-cyber-accent flex items-center gap-1"
            >
              <Sparkles className="w-2.5 h-2.5" />
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* 快捷功能 — 展开式 */}
      {showActions && !showCommandPanel && (
        <div className="px-3 pt-2 flex flex-wrap gap-1.5 animate-in fade-in slide-in-from-bottom duration-200">
          {quickActions.map((a, i) => (
            <button
              key={i}
              onClick={() => {
                setText(a.prompt)
                setShowActions(false)
                textareaRef.current?.focus()
              }}
              className="px-3 py-1.5 rounded-full bg-white/[0.03] border border-cyber-border hover:border-cyber-accent/30 hover:bg-cyber-accent/[0.03] transition-all text-xs text-gray-400 hover:text-cyber-text"
            >
              {a.label}
            </button>
          ))}
        </div>
      )}

      {/* 附件列表 */}
      {attachments.length > 0 && (
        <div className="px-3 pt-2 flex flex-wrap gap-1.5">
          {attachments.map((att, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-cyber-accent/5 border border-cyber-accent/20 text-[10px] font-mono text-cyber-accent"
            >
              <Paperclip className="w-2.5 h-2.5" />
              <span className="max-w-[100px] truncate">{att}</span>
              <button
                onClick={() => removeAttachment(i)}
                className="text-gray-600 hover:text-red-400"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Agent 选择器 */}
      {showAgentSelector && (
        <div className="px-3 pt-2">
          <div className="rounded-lg border border-cyber-border bg-cyber-bg overflow-hidden max-h-60 overflow-y-auto">
            <div className="px-3 py-1.5 bg-cyber-accent/5 border-b border-cyber-border text-[10px] font-mono text-cyber-accent flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Bot className="w-3 h-3" />
                选择 Agent
              </span>
              <span className="text-gray-600">{agents.length} 个可用</span>
            </div>
            {agents.map((a) => (
              <button
                key={a.id}
                onClick={() => selectAgent(a.id)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 hover:bg-cyber-accent/5 transition-colors text-left',
                  a.id === activeAgentId && 'bg-cyber-accent/5'
                )}
              >
                <span className="text-lg flex-shrink-0">{a.avatar}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono flex items-center gap-1.5">
                    <span style={{ color: a.color }}>{a.name}</span>
                    <span className="text-[9px] text-gray-600">{a.role}</span>
                  </div>
                  <div className="text-[10px] text-gray-600 truncate">{a.specialty}</div>
                </div>
                {a.id === activeAgentId && <Check className="w-3.5 h-3.5 text-cyber-accent flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 输入区 */}
      <div className="px-3 py-2.5">
        <div
          className={cn(
            'flex items-end gap-2 p-1.5 rounded-2xl bg-cyber-bg border transition-colors',
            dragOver ? 'border-cyber-accent border-dashed' : 'border-cyber-border focus-within:border-cyber-accent/40'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* 快捷动作按钮 */}
          <button
            onClick={() => setShowActions(!showActions)}
            className={cn(
              'flex-shrink-0 p-2 rounded-xl transition-all',
              showActions
                ? 'bg-cyber-accent/10 text-cyber-accent'
                : 'hover:bg-white/5 text-gray-500 hover:text-cyber-accent'
            )}
          >
            <Plus className={cn('w-5 h-5 transition-transform', showActions && 'rotate-45')} />
          </button>

          {/* 附件按钮 */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || disabled}
            className={cn(
              'flex-shrink-0 p-2 rounded-xl transition-all',
              uploading
                ? 'text-cyber-accent animate-pulse'
                : 'hover:bg-white/5 text-gray-500 hover:text-cyber-accent'
            )}
            title="上传文件"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
          </button>

          {/* 文本输入 */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={dragOver ? '拖拽文件到此处上传...' : '输入消息，或输入 / 使用命令...'}
            disabled={disabled}
            rows={1}
            className="flex-1 bg-transparent outline-none resize-none text-sm py-2 px-1 placeholder:text-gray-600 max-h-28 text-cyber-text"
          />

          {/* 字数统计 */}
          {showWordCount && (
            <span className={cn(
              'text-[10px] font-mono flex-shrink-0 pb-2',
              charCount > 1000 ? 'text-red-400' : 'text-gray-600'
            )}>
              {charCount}
            </span>
          )}

          {/* 操作按钮组 */}
          <div className="flex-shrink-0 flex items-center gap-0.5">
            {/* 语音输入 */}
            <button
              onClick={toggleVoiceInput}
              disabled={disabled}
              className={cn(
                'p-2 rounded-xl transition-colors',
                isRecording
                  ? 'bg-red-500/20 text-red-400 animate-pulse'
                  : 'hover:bg-white/5 text-gray-600 hover:text-cyber-accent'
              )}
              title={isRecording ? '停止录音' : '语音输入'}
            >
              <Mic className="w-4 h-4" />
            </button>
            {/* 发送按钮 */}
            <button
              onClick={handleSubmit}
              disabled={!text.trim() || disabled}
              className={cn(
                'p-2 rounded-xl transition-all',
                text.trim() && !disabled
                  ? 'bg-cyber-accent text-black hover:opacity-90'
                  : 'bg-white/5 text-gray-600 cursor-not-allowed'
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 底部状态栏：Agent 显示 + 提示文字 */}
        <div className="flex items-center justify-between mt-1.5 px-1">
          {/* Agent 快切 */}
          <button
            onClick={() => setShowAgentSelector(!showAgentSelector)}
            className="flex items-center gap-1.5 text-[10px] font-mono text-gray-600 hover:text-cyber-accent transition-colors group"
          >
            <span className="text-sm">{currentAgent.avatar}</span>
            <span style={{ color: currentAgent.color }} className="group-hover:opacity-80">
              {currentAgent.name}
            </span>
            <span className="text-gray-700">·</span>
            <span className="text-gray-700 hidden sm:inline">{currentAgent.role}</span>
          </button>

          {/* 提示文字 */}
          <p className="text-[10px] text-gray-700 font-mono flex items-center gap-2">
            <span className="flex items-center gap-0.5">
              <CornerDownLeft className="w-2.5 h-2.5" />
              发送
            </span>
            <span className="text-gray-800">·</span>
            <span className="hidden sm:flex items-center gap-0.5">
              <span className="px-1 py-0.5 rounded bg-white/5 border border-cyber-border text-[8px]">Shift</span>
              +
              <CornerDownLeft className="w-2.5 h-2.5" />
              换行
            </span>
            <span className="text-gray-800 hidden md:inline">·</span>
            <span className="hidden md:flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" />
              AI生成内容仅供参考
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
