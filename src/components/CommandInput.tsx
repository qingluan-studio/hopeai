import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { Send, Terminal, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuickCommand {
  label: string
  command: string
  icon: typeof Terminal
}

const quickCommands: QuickCommand[] = [
  { label: '/分析', command: '/analyze ', icon: Sparkles },
  { label: '/编码', command: '/code ', icon: Terminal },
  { label: '/部署', command: '/deploy ', icon: Terminal },
  { label: '/帮助', command: '/help ', icon: Terminal },
]

interface CommandInputProps {
  onSend?: (command: string) => void
  placeholder?: string
}

export default function CommandInput({ onSend, placeholder = '输入命令或描述你的需求...' }: CommandInputProps) {
  const [value, setValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onSend?.(trimmed)
    setValue('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuickCommand = (command: string) => {
    setValue(command)
    inputRef.current?.focus()
  }

  useEffect(() => {
    const handleGlobalKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        inputRef.current?.focus()
        setValue('/')
      }
    }
    window.addEventListener('keydown', handleGlobalKey)
    return () => window.removeEventListener('keydown', handleGlobalKey)
  }, [])

  return (
    <div className="w-full bg-gray-950/90 border-t border-green-900/40 p-4 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-3">
          {quickCommands.map(cmd => (
            <button
              key={cmd.command}
              onClick={() => handleQuickCommand(cmd.command)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded border transition-all duration-200',
                'bg-gray-900/60 border-gray-700/50 text-gray-400',
                'hover:bg-green-900/20 hover:border-green-700/50 hover:text-green-400',
                'active:scale-95'
              )}
            >
              <cmd.icon className="w-3 h-3" />
              <span>{cmd.label}</span>
            </button>
          ))}
        </div>

        <div 
          className={cn(
            'relative flex items-center gap-2 px-4 py-3 rounded-lg border transition-all duration-300',
            'bg-gray-900/80',
            isFocused 
              ? 'border-green-500/70 shadow-[0_0_20px_rgba(34,197,94,0.2),inset_0_0_20px_rgba(34,197,94,0.05)]' 
              : 'border-gray-700/50 hover:border-gray-600/50'
          )}
        >
          <span 
            className={cn(
              'font-mono text-lg select-none transition-colors duration-300',
              isFocused ? 'text-green-400' : 'text-gray-600'
            )}
            style={{ textShadow: isFocused ? '0 0 10px rgba(34, 197, 94, 0.5)' : undefined }}
          >
            {'>'}
          </span>

          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={cn(
              'flex-1 bg-transparent outline-none text-sm font-mono',
              'text-green-300 placeholder:text-gray-600 placeholder:font-mono',
              'caret-green-400'
            )}
            style={{
              caretColor: 'transparent',
            } as React.CSSProperties}
          />

          {isFocused && !value && (
            <span className="absolute left-10 top-1/2 -translate-y-1/2 w-2 h-5 bg-green-400 animate-pulse" style={{ boxShadow: '0 0 10px rgba(34, 197, 94, 0.8)' }} />
          )}

          {value && (
            <button
              onClick={handleSend}
              className={cn(
                'flex items-center gap-2 px-4 py-1.5 rounded font-mono text-sm font-medium',
                'bg-green-500/20 text-green-400 border border-green-500/50',
                'hover:bg-green-500/30 hover:border-green-400',
                'active:scale-95 transition-all duration-200',
                'shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)]'
              )}
              style={{ textShadow: '0 0 8px rgba(34, 197, 94, 0.5)' }}
            >
              <Send className="w-4 h-4" />
              <span>发送</span>
            </button>
          )}
        </div>

        <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-gray-600">
          <div className="flex items-center gap-3">
            <span>按 <kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700">/</kbd> 快速输入命令</span>
            <span>按 <kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700">Enter</kbd> 发送</span>
          </div>
          <span>{value.length} 字符</span>
        </div>
      </div>
    </div>
  )
}
