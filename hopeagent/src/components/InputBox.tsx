import { useState, useRef, useEffect } from 'react'
import { Send, Plus, Mic, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InputBoxProps {
  onSend: (text: string) => void
  disabled?: boolean
}

export default function InputBox({ onSend, disabled }: InputBoxProps) {
  const [text, setText] = useState('')
  const [showActions, setShowActions] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }, [text])

  const handleSubmit = () => {
    const t = text.trim()
    if (!t || disabled) return
    onSend(t)
    setText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const quickActions = [
    { label: '写代码', prompt: '帮我写一段' },
    { label: '分析数据', prompt: '帮我分析这组数据' },
    { label: '设计方案', prompt: '帮我设计一个方案' },
    { label: '头脑风暴', prompt: '帮我头脑风暴一下' },
    { label: 'Debug', prompt: '帮我调试这段代码' },
    { label: '翻译', prompt: '帮我翻译这段内容' },
  ]

  return (
    <div className="border-t border-cyber-border/50 bg-cyber-panel/30 backdrop-blur-sm flex-shrink-0">
      {/* 快捷功能 — 展开式 */}
      {showActions && (
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

      {/* 输入区 */}
      <div className="px-3 py-2.5">
        <div className="flex items-end gap-2 p-1.5 rounded-2xl bg-cyber-bg border border-cyber-border focus-within:border-cyber-accent/40 transition-colors">
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

          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息..."
            disabled={disabled}
            rows={1}
            className="flex-1 bg-transparent outline-none resize-none text-sm py-2 px-1 placeholder:text-gray-600 max-h-28 text-cyber-text"
          />

          <div className="flex-shrink-0 flex items-center gap-0.5">
            <button className="p-2 rounded-xl hover:bg-white/5 text-gray-600 hover:text-cyber-accent transition-colors">
              <Mic className="w-4 h-4" />
            </button>
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
        <p className="text-center text-[10px] text-gray-700 mt-1.5 font-mono flex items-center justify-center gap-1">
          <Sparkles className="w-2.5 h-2.5" />
          AI生成内容仅供参考
        </p>
      </div>
    </div>
  )
}
