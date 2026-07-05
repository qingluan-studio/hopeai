import { useEffect, useRef, useState } from 'react'
import { MessageSquare, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useChatStore } from '@/store/useChatStore'
import MessageBubble from './MessageBubble'

function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 p-4 bg-gray-900/60 border border-green-900/40 rounded-lg backdrop-blur-sm"
      style={{
        boxShadow: '0 0 20px rgba(34, 197, 94, 0.1), inset 0 0 20px rgba(34, 197, 94, 0.03)',
      }}
    >
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-green-900/30 border border-green-700/50 flex items-center justify-center"
          style={{ boxShadow: '0 0 10px rgba(34, 197, 94, 0.3)' }}
        >
          <Activity className="w-4 h-4 text-green-400 animate-pulse" />
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
      </div>
      <div className="flex-1">
        <div className="text-green-400 text-sm font-mono font-bold mb-1"
          style={{ textShadow: '0 0 8px rgba(34, 197, 94, 0.5)' }}
        >
          正在输入...
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
      <div className="px-2 py-0.5 rounded text-[9px] font-mono tracking-widest border border-green-700/50 text-green-400">
        TYPING
      </div>
    </div>
  )
}

export default function ChatArea() {
  const { messages, isStreaming } = useChatStore()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(true)

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isStreaming, autoScroll])

  const handleScroll = () => {
    if (!scrollRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
    setAutoScroll(isNearBottom)
  }

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      })
      setAutoScroll(true)
    }
  }

  return (
    <div className="relative flex flex-col h-full bg-gray-950/80 border-l border-green-900/30 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-green-900/30 bg-gray-900/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-green-900/30 border border-green-700/50"
            style={{ boxShadow: '0 0 10px rgba(34, 197, 94, 0.2)' }}
          >
            <MessageSquare className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <h2 
              className="text-green-400 font-mono text-sm tracking-widest"
              style={{ textShadow: '0 0 10px rgba(34, 197, 94, 0.5)' }}
            >
              CHAT CONSOLE
            </h2>
            <div className="text-[10px] text-gray-500 font-mono">
              {messages.length} MESSAGES
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn(
            'flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-mono border',
            isStreaming 
              ? 'bg-green-900/30 border-green-700/50 text-green-400' 
              : 'bg-gray-800/50 border-gray-700/50 text-gray-500'
          )}>
            <div className={cn(
              'w-1.5 h-1.5 rounded-full',
              isStreaming ? 'bg-green-500 animate-pulse' : 'bg-gray-600'
            )} />
            {isStreaming ? 'LIVE' : 'IDLE'}
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-gray-900/50 border border-gray-800 flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-gray-700" />
            </div>
            <div className="text-gray-500 font-mono text-sm mb-2">NO MESSAGES YET</div>
            <div className="text-gray-600 font-mono text-xs">输入命令开始对话...</div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div key={message.id}>
                {index > 0 && (
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-800/50 to-transparent my-3" />
                )}
                <MessageBubble message={message} />
              </div>
            ))}
            {isStreaming && (
              <>
                <div className="h-px bg-gradient-to-r from-transparent via-gray-800/50 to-transparent my-3" />
                <TypingIndicator />
              </>
            )}
          </>
        )}
      </div>

      {!autoScroll && messages.length > 0 && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-gray-900/90 border border-green-700/50 rounded-lg text-green-400 text-xs font-mono hover:bg-gray-800/90 transition-all duration-300 backdrop-blur-sm z-10"
          style={{ boxShadow: '0 0 15px rgba(34, 197, 94, 0.2)' }}
        >
          ↓ 滚动到底部
        </button>
      )}

      <style>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(34, 197, 94, 0.3);
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 197, 94, 0.5);
        }
      `}</style>
    </div>
  )
}
