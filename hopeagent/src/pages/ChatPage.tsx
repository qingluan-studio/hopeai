import { useRef, useEffect, useState } from 'react'
import { useChatStore, useAppStore, useSettingsStore } from '@/store'
import ChatMessage from '@/components/ChatMessage'
import InputBox from '@/components/InputBox'
import { executeReAct } from '@/engine/reactEngine'
import { chatApi } from '@/services/apiClient'
import type { ChatMessage as ChatMessageType, ThoughtStep, ToolCall } from '@/types'
import { uid } from '@/lib/utils'
import { Code, BarChart3, Shield, Rocket, Terminal, Brain, BookOpen, Zap, Cpu, Wifi, WifiOff } from 'lucide-react'
import { getState as getSuperState } from '@/services/superAgentService'
import { agents } from '@/engine/agents'

export default function ChatPage() {
  const {
    conversations,
    activeConversationId,
    streamingContent,
    isStreaming,
    activeAgentId,
    thoughtSteps,
    toolCalls,
    createConversation,
    addMessage,
    updateMessage,
    deleteMessage,
    setStreamingContent,
    setIsStreaming,
    addThoughtStep,
    addToolCall,
    updateToolCall,
    clearThoughts,
    getActiveConversation,
    getServerConvId,
  } = useChatStore()

  const { backendOnline, useBackend } = useAppStore()
  const { llmConfig } = useSettingsStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const [superOn, setSuperOn] = useState(getSuperState().enabled)

  const conv = getActiveConversation()

  useEffect(() => {
    if (!activeConversationId && conversations.length === 0) {
      createConversation()
    }
  }, [activeConversationId, conversations.length, createConversation])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conv?.messages.length, streamingContent, thoughtSteps.length, toolCalls.length])

  /** 走后端流式 SSE */
  const sendViaBackend = async (text: string, convId: string) => {
    const assistantMsg: ChatMessageType = {
      id: uid(),
      role: 'assistant',
      content: '',
      agentId: activeAgentId,
      thoughtSteps: [],
      toolCalls: [],
      timestamp: new Date().toISOString(),
      isComplete: false,
    }
    addMessage(convId, assistantMsg)
    setIsStreaming(true)
    setStreamingContent('')

    const serverConvId = getServerConvId(convId)

    try {
      const full = await chatApi.stream(text, {
        conversationId: serverConvId,
        config: {
          apiKey: llmConfig.apiKey,
          model: llmConfig.model,
          baseUrl: llmConfig.baseUrl,
          temperature: llmConfig.temperature,
          maxTokens: llmConfig.maxTokens,
          enabled: llmConfig.enabled,
        },
        useSuperBrain: superOn,
        onContent: (_chunk, full) => {
          setStreamingContent(full)
          updateMessage(convId, assistantMsg.id, { content: full })
        },
        onDone: (full) => {
          updateMessage(convId, assistantMsg.id, {
            content: full,
            isComplete: true,
          })
          setIsStreaming(false)
          setStreamingContent('')
        },
        signal: abortRef.current?.signal,
      })

      // 后端返回的对话 ID 记录下来
      // 通过 chatApi.list 同步会更准确，这里简单处理
      if (!serverConvId) {
        // 触发后端对话列表刷新（Sidebar 会处理）
        window.dispatchEvent(new CustomEvent('backend-conversation-created'))
      }
      return full
    } catch (err) {
      const msg = err instanceof Error ? err.message : '后端调用失败'
      updateMessage(convId, assistantMsg.id, {
        content: `⚠️ 后端连接失败：${msg}\n\n正在回退到本地模式...`,
        isComplete: true,
      })
      setIsStreaming(false)
      setStreamingContent('')
      return ''
    }
  }

  /** 走本地 ReAct 引擎 */
  const sendViaLocal = async (text: string, convId: string) => {
    const assistantMsg: ChatMessageType = {
      id: uid(),
      role: 'assistant',
      content: '',
      agentId: activeAgentId,
      thoughtSteps: [],
      toolCalls: [],
      timestamp: new Date().toISOString(),
      isComplete: false,
    }
    addMessage(convId, assistantMsg)

    setIsStreaming(true)
    setStreamingContent('')

    const history = conv?.messages || []

    try {
      await executeReAct(text, history, {
        agentId: activeAgentId,
        signal: abortRef.current?.signal,
        onThought: (step: ThoughtStep) => {
          addThoughtStep(step)
          updateMessage(convId, assistantMsg.id, (prev: any) => ({
            thoughtSteps: [...(prev.thoughtSteps || []), step],
          }))
        },
        onToolCall: (tc: ToolCall) => {
          addToolCall(tc)
          updateMessage(convId, assistantMsg.id, (prev: any) => ({
            toolCalls: [...(prev.toolCalls || []), tc],
          }))
        },
        onContent: (content: string) => {
          setStreamingContent(content)
          updateMessage(convId, assistantMsg.id, { content })
        },
        onComplete: (content: string) => {
          updateMessage(convId, assistantMsg.id, {
            content,
            isComplete: true,
          })
          setIsStreaming(false)
          setStreamingContent('')
          setSuperOn(getSuperState().enabled)
        },
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : '未知错误'
      updateMessage(convId, assistantMsg.id, {
        content: `出错了：${msg}`,
        isComplete: true,
      })
      setIsStreaming(false)
      setStreamingContent('')
    }
  }

  const handleSend = async (text: string) => {
    if (isStreaming || !activeConversationId) return

    clearThoughts()
    abortRef.current = new AbortController()

    const userMsg: ChatMessageType = {
      id: uid(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
      isComplete: true,
    }
    addMessage(activeConversationId, userMsg)

    const useBackendMode = useBackend && backendOnline
    if (useBackendMode) {
      await sendViaBackend(text, activeConversationId)
    } else {
      await sendViaLocal(text, activeConversationId)
    }
  }

  /** 命令处理：/clear /export /help 等 */
  const handleCommand = (cmd: string, _args: string) => {
    switch (cmd) {
      case 'clear':
        // 清空当前对话所有消息
        if (activeConversationId && conv) {
          [...conv.messages].forEach(m => deleteMessage(activeConversationId, m.id))
        }
        break
      case 'export':
        // 导出对话为 Markdown 文件
        if (conv && conv.messages.length > 0) {
          const md = conv.messages.map(m =>
            `## ${m.role === 'user' ? '董事长' : m.agentName || '智能助手'}\n\n${m.content}\n`
          ).join('\n---\n\n')
          const blob = new Blob([md], { type: 'text/markdown' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${conv.title || '对话'}.md`
          a.click()
          URL.revokeObjectURL(url)
        }
        break
      case 'help':
        // 显示帮助信息为系统消息
        if (activeConversationId) {
          addMessage(activeConversationId, {
            id: uid(),
            role: 'system',
            content: '可用命令：/clear 清空对话 · /export 导出为MD · /agent 切换Agent · /model 切换模型 · /search 搜索知识库 · /help 帮助',
            timestamp: new Date().toISOString(),
            isComplete: true,
          })
        }
        break
      default:
        break
    }
  }

  /** 删除消息 */
  const handleDeleteMessage = (msgId: string) => {
    if (activeConversationId) {
      deleteMessage(activeConversationId, msgId)
    }
  }

  /** 重新生成：删除最后的助手回复，重新发送最后的用户消息 */
  const handleRegenerate = async () => {
    if (isStreaming || !activeConversationId || !conv) return
    const msgs = conv.messages
    if (msgs.length === 0) return
    // 找到最后一条用户消息
    const lastUserMsg = [...msgs].reverse().find(m => m.role === 'user')
    if (!lastUserMsg) return
    // 删除最后一条助手消息（如果有）
    const lastMsg = msgs[msgs.length - 1]
    if (lastMsg.role === 'assistant') {
      deleteMessage(activeConversationId, lastMsg.id)
    }
    // 重新发送（不添加新的用户消息）
    clearThoughts()
    abortRef.current = new AbortController()
    const useBackendMode = useBackend && backendOnline
    if (useBackendMode) {
      await sendViaBackend(lastUserMsg.content, activeConversationId)
    } else {
      await sendViaLocal(lastUserMsg.content, activeConversationId)
    }
  }

  /** 引用回复：通过自定义事件设置输入框内容 */
  const handleReply = (content: string) => {
    window.dispatchEvent(new CustomEvent('inputbox-reply', { detail: content }))
  }

  const quickPrompts = [
    { icon: Code, text: '写一个React组件', color: 'text-cyan-400' },
    { icon: BarChart3, text: '分析销售数据趋势', color: 'text-green-400' },
    { icon: Shield, text: '检查代码安全问题', color: 'text-yellow-400' },
    { icon: Rocket, text: '设计微服务架构', color: 'text-purple-400' },
  ]

  const showEmpty = !conv || conv.messages.length === 0
  const useBackendMode = useBackend && backendOnline

  return (
    <div className="h-full flex flex-col">
      {/* 超级大脑状态条 */}
      {superOn && (
        <div className="px-4 py-1.5 bg-purple-500/10 border-b border-purple-500/20 flex items-center gap-2 text-xs font-mono">
          <Brain className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span className="text-purple-300">超级大脑已激活</span>
          <span className="text-gray-600">·</span>
          <span className="text-gray-500">{agents.length}个Agent融合运行中</span>
        </div>
      )}

      {/* 后端连接状态条 */}
      <div className="px-4 py-1 border-b border-cyber-border/30 flex items-center justify-between text-[10px] font-mono">
        <div className="flex items-center gap-1.5">
          {useBackendMode ? (
            <>
              <Wifi className="w-3 h-3 text-cyber-accent" />
              <span className="text-cyber-accent/80">后端已连接</span>
              <span className="text-gray-600">·</span>
              <span className="text-gray-500">流式对话</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-gray-500" />
              <span className="text-gray-500">{backendOnline ? '本地模式' : '后端离线'}</span>
              <span className="text-gray-600">·</span>
              <span className="text-gray-600">ReAct引擎</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <span>模型: {llmConfig.model || '未配置'}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {showEmpty ? (
          <div className="h-full flex flex-col items-center justify-center px-4">
            {/* 极客终端风格Logo */}
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-2xl border border-cyber-accent/30 flex items-center justify-center relative overflow-hidden"
                style={{ boxShadow: '0 0 40px rgba(0,255,136,0.15)' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-cyber-accent/5 to-transparent" />
                <Terminal className="w-8 h-8 text-cyber-accent relative z-10" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyber-accent animate-pulse" />
            </div>

            <h1 className="text-xl font-bold font-mono mb-1">
              <span className="text-cyber-accent">hope</span>
              <span className="text-gray-500">{'>'}</span>
              <span className="text-cyber-text">_</span>
              <span className="typing-cursor" />
            </h1>
            <p className="text-gray-600 text-xs font-mono mb-8">
              {superOn
                ? `${agents.length}个Agent已融合 · 超级大脑模式`
                : `${agents.length}个Agent · ReAct推理 · 自我进化`}
            </p>

            {/* 快捷命令 */}
            <div className="w-full max-w-lg space-y-2">
              <p className="text-[10px] font-mono text-gray-600 uppercase tracking-wider px-1">快捷命令</p>
              {quickPrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(p.text)}
                  disabled={isStreaming}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.02] border border-cyber-border hover:border-cyber-accent/30 hover:bg-cyber-accent/[0.03] transition-all text-left group"
                >
                  <code className="text-[10px] font-mono text-gray-600 group-hover:text-cyber-accent transition-colors">
                    {String(i + 1).padStart(2, '0')}
                  </code>
                  <p.icon className={`w-4 h-4 ${p.color} flex-shrink-0`} />
                  <span className="text-sm text-gray-400 group-hover:text-cyber-text transition-colors">{p.text}</span>
                </button>
              ))}
            </div>

            {/* 底部能力标签 */}
            <div className="flex items-center gap-4 mt-8 text-[10px] font-mono text-gray-700">
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                ReAct推理
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                多工具
              </span>
              <span className="flex items-center gap-1">
                <Brain className="w-3 h-3" />
                {superOn ? '超级大脑' : '自我进化'}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                知识库
              </span>
            </div>
          </div>
        ) : (
          <div className="py-2">
            {conv!.messages.map((msg, i) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                index={i + 1}
                streamingContent={msg.id === conv!.messages[conv!.messages.length - 1]?.id && isStreaming ? streamingContent : undefined}
                onDelete={handleDeleteMessage}
                onRegenerate={msg.role === 'assistant' ? handleRegenerate : undefined}
                onReply={handleReply}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <InputBox onSend={handleSend} disabled={isStreaming} onCommand={handleCommand} />
    </div>
  )
}
