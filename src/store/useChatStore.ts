import { create } from 'zustand'
import type { Message } from '@/types'

export type ChatStyle = 'professional' | 'warm' | 'humorous' | 'minimal' | 'creative'

export interface ChatStyleConfig {
  id: ChatStyle
  name: string
  emoji: string
  description: string
}

export const chatStyles: ChatStyleConfig[] = [
  { id: 'professional', name: '专业', emoji: '💼', description: '严谨专业的回答风格' },
  { id: 'warm', name: '温暖共情', emoji: '❤️', description: '亲切温暖的沟通方式' },
  { id: 'humorous', name: '幽默', emoji: '😄', description: '轻松幽默的表达方式' },
  { id: 'minimal', name: '极简', emoji: '⚡', description: '简洁高效的回答风格' },
  { id: 'creative', name: '创意', emoji: '🎨', description: '富有创意的思考方式' },
]

interface ChatState {
  messages: Message[]
  isStreaming: boolean
  chatStyle: ChatStyle
  addMessage: (message: Message) => void
  updateMessage: (id: string, updates: Partial<Message>) => void
  clearMessages: () => void
  setStreaming: (isStreaming: boolean) => void
  setChatStyle: (style: ChatStyle) => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isStreaming: false,
  chatStyle: 'professional',
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  updateMessage: (id, updates) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, ...updates } : msg
      ),
    })),
  clearMessages: () => set({ messages: [] }),
  setStreaming: (isStreaming) => set({ isStreaming }),
  setChatStyle: (chatStyle) => set({ chatStyle }),
}))
