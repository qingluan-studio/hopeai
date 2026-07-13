import { useState, useEffect } from 'react'
import {
  Sparkles,
  MessageSquare,
  Brain,
  Zap,
  ChevronRight,
  Terminal,
  Code2,
  BarChart3,
  BookOpen,
  Palette,
  Cpu,
  Send,
} from 'lucide-react'
import BrandAvatar, { BrandWordmark } from '@/components/BrandAvatar'
import { useAppStore, useChatStore } from '@/store'

const quickPrompts = [
  { icon: Code2, text: '帮我写一段代码', color: 'text-cyan-400' },
  { icon: Brain, text: '深度分析一个问题', color: 'text-purple-400' },
  { icon: BookOpen, text: '解释一个概念', color: 'text-green-400' },
  { icon: BarChart3, text: '做一份数据分析', color: 'text-yellow-400' },
  { icon: Palette, text: '创意头脑风暴', color: 'text-pink-400' },
  { icon: Zap, text: '快速翻译润色', color: 'text-orange-400' },
]

const capabilities = [
  { icon: Brain, title: '超级大脑', desc: '33个专业Agent融合' },
  { icon: Cpu, title: 'ReAct推理', desc: '思考-行动-反思循环' },
  { icon: BookOpen, title: '700+知识库', desc: '16大学科全覆盖' },
  { icon: Terminal, title: '27种工具', desc: '即开即用' },
]

export default function HomePage() {
  const { setCurrentPage, setSidebarOpen } = useAppStore()
  const { createConversation } = useChatStore()
  const [inputValue, setInputValue] = useState('')
  const [typedGreeting, setTypedGreeting] = useState('')
  const fullGreeting = '我是 Hope，你的超级智能助理。'

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      if (i <= fullGreeting.length) {
        setTypedGreeting(fullGreeting.slice(0, i))
        i++
      } else {
        clearInterval(timer)
      }
    }, 60)
    return () => clearInterval(timer)
  }, [])

  const handleStartChat = (text?: string) => {
    createConversation()
    setCurrentPage('chat')
    if (text) {
      setTimeout(() => {
        const input = document.querySelector('[data-quick-prompt]') as HTMLTextAreaElement | null
        if (input) {
          input.value = text
          input.dispatchEvent(new Event('input', { bubbles: true }))
          input.focus()
        }
      }, 100)
    }
  }

  const handleQuickPrompt = (text: string) => {
    handleStartChat(text)
  }

  return (
    <div className="h-full w-full overflow-y-auto scrollbar-hide">
      <div className="min-h-full flex flex-col items-center justify-center px-4 py-8">
        {/* 顶部品牌区 */}
        <div className="flex flex-col items-center mb-8">
          <BrandAvatar size="xl" animated glow />

          <div className="mt-6 text-center">
            <h1 className="text-3xl font-bold">
              <BrandWordmark className="text-3xl" />
              <span className="text-white ml-2">Pro</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1 font-mono tracking-wider">
              SUPER INTELLIGENCE PLATFORM
            </p>
          </div>
        </div>

        {/* 问候语打字机 */}
        <div className="text-center mb-8 h-8">
          <p className="text-lg text-gray-300">
            {typedGreeting}
            <span className="inline-block w-0.5 h-5 bg-cyber-accent ml-0.5 animate-pulse align-middle" />
          </p>
          <p className="text-sm text-gray-500 mt-2">
            有什么可以帮你的？随时向我提问。
          </p>
        </div>

        {/* 快速输入框 */}
        <div className="w-full max-w-xl mb-8">
          <div className="relative">
            <textarea
              data-quick-prompt
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && inputValue.trim()) {
                  e.preventDefault()
                  handleStartChat(inputValue)
                }
              }}
              placeholder="输入你的问题，或选择下方快捷入口..."
              className="w-full px-4 py-3 pr-14 bg-cyber-panel/50 border border-cyber-border rounded-2xl text-cyber-text placeholder-gray-600 focus:outline-none focus:border-cyber-accent/50 transition-colors resize-none text-sm"
              rows={2}
            />
            <button
              onClick={() => inputValue.trim() && handleStartChat(inputValue)}
              disabled={!inputValue.trim()}
              className="absolute right-3 bottom-3 p-2 rounded-xl bg-cyber-accent text-cyber-bg hover:bg-cyber-accent-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex justify-between mt-2 px-1">
            <span className="text-[10px] text-gray-600 font-mono">Enter 发送 · Shift+Enter 换行</span>
            <span className="text-[10px] text-gray-600 font-mono">超级大脑已就绪</span>
          </div>
        </div>

        {/* 快捷提示 */}
        <div className="w-full max-w-xl mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-cyber-accent" />
            <span className="text-xs text-gray-400 font-mono">快速开始</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickPrompt(prompt.text)}
                className="flex items-center gap-2 px-3 py-2.5 bg-cyber-panel/30 hover:bg-cyber-panel/60 border border-cyber-border/50 hover:border-cyber-accent/30 rounded-xl text-left transition-all group"
              >
                <prompt.icon className={`w-4 h-4 flex-shrink-0 ${prompt.color}`} />
                <span className="text-xs text-gray-300 group-hover:text-white transition-colors truncate">
                  {prompt.text}
                </span>
                <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-cyber-accent ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* 能力展示 */}
        <div className="w-full max-w-xl mb-8">
          <div className="grid grid-cols-4 gap-2">
            {capabilities.map((cap, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center p-3 bg-cyber-panel/20 border border-cyber-border/30 rounded-xl text-center"
              >
                <cap.icon className="w-5 h-5 text-cyber-accent mb-1.5" />
                <p className="text-[11px] text-gray-300 font-medium">{cap.title}</p>
                <p className="text-[9px] text-gray-600 mt-0.5">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 隐藏入口：打开侧栏 */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors font-mono flex items-center gap-1"
        >
          <MessageSquare className="w-3 h-3" />
          查看历史对话
        </button>

        {/* 底部装饰线 */}
        <div className="mt-8 flex items-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-cyber-accent/30" />
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-gray-600 font-mono">SYSTEM ONLINE</span>
          </div>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-cyber-accent/30" />
        </div>
      </div>
    </div>
  )
}
