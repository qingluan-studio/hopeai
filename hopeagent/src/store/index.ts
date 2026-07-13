import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Conversation, ChatMessage, AppPage, LLMConfig, KnowledgeEntry, ThoughtStep, ToolCall, Plugin, Template, ArchivedConversation } from '@/types'
import { getDefaultAgent } from '@/engine/agents'

interface AppState {
  currentPage: AppPage
  setCurrentPage: (page: AppPage) => void
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  backendOnline: boolean
  setBackendOnline: (online: boolean) => void
  useBackend: boolean
  setUseBackend: (use: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentPage: 'home',
      setCurrentPage: (page) => set({ currentPage: page }),
      sidebarOpen: true,
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      backendOnline: false,
      setBackendOnline: (online) => set({ backendOnline: online }),
      useBackend: true,
      setUseBackend: (use) => set({ useBackend: use }),
    }),
    {
      name: 'hopeagent-app',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentPage: state.currentPage,
        useBackend: state.useBackend,
      }),
    }
  )
)

interface ChatState {
  conversations: Conversation[]
  activeConversationId: string | null
  streamingContent: string
  isStreaming: boolean
  activeAgentId: string
  thoughtSteps: ThoughtStep[]
  toolCalls: ToolCall[]
  showThoughts: boolean
  serverConvMap: Record<string, string> // 本地 convId → 后端 convId

  createConversation: () => string
  selectConversation: (id: string) => void
  deleteConversation: (id: string) => void
  addMessage: (convId: string, message: ChatMessage) => void
  updateMessage: (convId: string, msgId: string, updates: Partial<ChatMessage> | ((prev: ChatMessage) => Partial<ChatMessage>)) => void
  deleteMessage: (convId: string, msgId: string) => void
  setStreamingContent: (content: string) => void
  setIsStreaming: (streaming: boolean) => void
  setActiveAgent: (agentId: string) => void
  addThoughtStep: (step: ThoughtStep) => void
  addToolCall: (toolCall: ToolCall) => void
  updateToolCall: (index: number, updates: Partial<ToolCall>) => void
  toggleShowThoughts: () => void
  clearThoughts: () => void
  getActiveConversation: () => Conversation | undefined
  setServerConvId: (localId: string, serverId: string) => void
  getServerConvId: (localId: string) => string | undefined
  setConversations: (convs: Conversation[]) => void
}

function newConversation(): Conversation {
  const now = new Date().toISOString()
  return {
    id: 'conv_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
    title: '新对话',
    messages: [],
    createdAt: now,
    updatedAt: now,
    activeAgentId: getDefaultAgent().id,
  }
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      streamingContent: '',
      isStreaming: false,
      activeAgentId: 'orchestrator',
      thoughtSteps: [],
      toolCalls: [],
      showThoughts: true,
      serverConvMap: {},

      createConversation: () => {
        const conv = newConversation()
        set((s) => ({
          conversations: [conv, ...s.conversations].slice(0, 50),
          activeConversationId: conv.id,
          thoughtSteps: [],
          toolCalls: [],
          streamingContent: '',
        }))
        return conv.id
      },

      selectConversation: (id) => set({ 
        activeConversationId: id,
        thoughtSteps: [],
        toolCalls: [],
        streamingContent: '',
      }),

      deleteConversation: (id) => set((s) => ({
        conversations: s.conversations.filter(c => c.id !== id),
        activeConversationId: s.activeConversationId === id ? null : s.activeConversationId,
      })),

      addMessage: (convId, message) => set((s) => {
        const convs = s.conversations.map(c => {
          if (c.id !== convId) return c
          const updated = {
            ...c,
            messages: [...c.messages, message],
            updatedAt: new Date().toISOString(),
            title: c.messages.length === 0 && message.role === 'user' 
              ? message.content.slice(0, 20) + (message.content.length > 20 ? '...' : '')
              : c.title,
          }
          return updated
        })
        return { conversations: convs }
      }),

      updateMessage: (convId, msgId, updates) => set((s) => ({
        conversations: s.conversations.map(c => {
          if (c.id !== convId) return c
          return {
            ...c,
            messages: c.messages.map(m => {
              if (m.id !== msgId) return m
              const newUpdates = typeof updates === 'function' ? updates(m) : updates
              return { ...m, ...newUpdates }
            }),
            updatedAt: new Date().toISOString(),
          }
        }),
      })),

      setStreamingContent: (content) => set({ streamingContent: content }),
      setIsStreaming: (streaming) => set({ isStreaming: streaming }),
      setActiveAgent: (agentId) => set({ activeAgentId: agentId }),

      deleteMessage: (convId, msgId) => set((s) => ({
        conversations: s.conversations.map(c => {
          if (c.id !== convId) return c
          return {
            ...c,
            messages: c.messages.filter(m => m.id !== msgId),
            updatedAt: new Date().toISOString(),
          }
        }),
      })),
      
      addThoughtStep: (step) => set((s) => ({
        thoughtSteps: [...s.thoughtSteps, step],
      })),

      addToolCall: (toolCall) => set((s) => ({
        toolCalls: [...s.toolCalls, toolCall],
      })),

      updateToolCall: (index, updates) => set((s) => ({
        toolCalls: s.toolCalls.map((tc, i) => i === index ? { ...tc, ...updates } : tc),
      })),

      toggleShowThoughts: () => set((s) => ({ showThoughts: !s.showThoughts })),
      clearThoughts: () => set({ thoughtSteps: [], toolCalls: [] }),

      getActiveConversation: () => {
        const { conversations, activeConversationId } = get()
        return conversations.find(c => c.id === activeConversationId)
      },

      setServerConvId: (localId, serverId) => set((s) => ({
        serverConvMap: { ...s.serverConvMap, [localId]: serverId },
      })),

      getServerConvId: (localId) => get().serverConvMap[localId],

      setConversations: (convs) => set({ conversations: convs }),
    }),
    {
      name: 'hopeagent-chat',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        conversations: state.conversations,
        activeConversationId: state.activeConversationId,
        activeAgentId: state.activeAgentId,
        showThoughts: state.showThoughts,
      }),
    }
  )
)

interface SettingsState {
  llmConfig: LLMConfig
  setLLMConfig: (config: LLMConfig) => void
  fontSize: number
  setFontSize: (size: number) => void
  animationsEnabled: boolean
  toggleAnimations: () => void
  autoLearn: boolean
  setAutoLearn: (enabled: boolean) => void
  theme: string
  setTheme: (theme: string) => void
  effectIntensity: number
  setEffectIntensity: (intensity: number) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      llmConfig: {
        apiKey: '',
        model: 'moonshot-v1-8k',
        baseUrl: 'https://api.moonshot.cn/v1/chat/completions',
        temperature: 0.7,
        maxTokens: 2000,
        enabled: false,
      },
      setLLMConfig: (config) => set({ llmConfig: config }),
      fontSize: 14,
      setFontSize: (size) => set({ fontSize: size }),
      animationsEnabled: true,
      toggleAnimations: () => set((s) => ({ animationsEnabled: !s.animationsEnabled })),
      autoLearn: true,
      setAutoLearn: (enabled: boolean) => set({ autoLearn: enabled }),
      theme: 'cyber',
      setTheme: (theme) => set({ theme }),
      effectIntensity: 0.5,
      setEffectIntensity: (intensity) => set({ effectIntensity: intensity }),
    }),
    {
      name: 'hopeagent-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

interface KnowledgeState {
  entries: KnowledgeEntry[]
  loadEntries: () => void
  addEntry: (entry: Omit<KnowledgeEntry, 'id' | 'createdAt'>) => Promise<void>
  deleteEntry: (id: string) => Promise<void>
  searchEntries: (query: string) => KnowledgeEntry[]
  setEntries: (entries: KnowledgeEntry[]) => void
}

export const useKnowledgeStore = create<KnowledgeState>((set, get) => ({
  entries: [],

  loadEntries: () => {
    import('@/services/knowledgeService').then(m => {
      set({ entries: m.getKnowledgeEntries() })
    })
  },

  addEntry: async (entry) => {
    // 本地
    import('@/services/knowledgeService').then(m => {
      const newEntry = m.addKnowledgeEntry(entry)
      set((s) => ({ entries: [newEntry, ...s.entries] }))
    })
  },

  deleteEntry: async (id) => {
    import('@/services/knowledgeService').then(m => {
      m.deleteKnowledgeEntry(id)
      set((s) => ({ entries: s.entries.filter(e => e.id !== id) }))
    })
  },

  setEntries: (entries) => set({ entries }),

  searchEntries: (query) => {
    const { entries } = get()
    if (!query.trim()) return entries

    const q = query.toLowerCase()
    return entries
      .map(e => ({
        entry: e,
        score: (e.title.toLowerCase().includes(q) ? 5 : 0) +
               (e.tags.some(t => t.toLowerCase().includes(q)) ? 3 : 0) +
               (e.content.toLowerCase().includes(q) ? 1 : 0)
      }))
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(s => s.entry)
  },
}))

// 插件状态管理
interface PluginState {
  plugins: Plugin[]
  installedPlugins: string[]
  enabledPlugins: string[]
  setPlugins: (plugins: Plugin[]) => void
  installPlugin: (pluginId: string) => void
  uninstallPlugin: (pluginId: string) => void
  enablePlugin: (pluginId: string) => void
  disablePlugin: (pluginId: string) => void
  togglePlugin: (pluginId: string) => void
}

export const usePluginStore = create<PluginState>()(
  persist(
    (set, get) => ({
      plugins: [],
      installedPlugins: [],
      enabledPlugins: [],

      setPlugins: (plugins) => set({ plugins }),

      installPlugin: (pluginId) => set((state) => ({
        installedPlugins: [...state.installedPlugins, pluginId],
        enabledPlugins: [...state.enabledPlugins, pluginId],
      })),

      uninstallPlugin: (pluginId) => set((state) => ({
        installedPlugins: state.installedPlugins.filter(id => id !== pluginId),
        enabledPlugins: state.enabledPlugins.filter(id => id !== pluginId),
      })),

      enablePlugin: (pluginId) => set((state) => ({
        enabledPlugins: state.enabledPlugins.includes(pluginId)
          ? state.enabledPlugins
          : [...state.enabledPlugins, pluginId],
      })),

      disablePlugin: (pluginId) => set((state) => ({
        enabledPlugins: state.enabledPlugins.filter(id => id !== pluginId),
      })),

      togglePlugin: (pluginId) => set((state) => ({
        enabledPlugins: state.enabledPlugins.includes(pluginId)
          ? state.enabledPlugins.filter(id => id !== pluginId)
          : [...state.enabledPlugins, pluginId],
      })),
    }),
    {
      name: 'hopeagent-plugins',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// 模板状态管理
interface TemplateState {
  templates: Template[]
  favoriteTemplates: string[]
  myTemplates: Template[]
  setTemplates: (templates: Template[]) => void
  toggleFavorite: (templateId: string) => void
  addMyTemplate: (template: Template) => void
  removeMyTemplate: (templateId: string) => void
}

export const useTemplateStore = create<TemplateState>()(
  persist(
    (set, get) => ({
      templates: [],
      favoriteTemplates: [],
      myTemplates: [],

      setTemplates: (templates) => set({ templates }),

      toggleFavorite: (templateId) => set((state) => ({
        favoriteTemplates: state.favoriteTemplates.includes(templateId)
          ? state.favoriteTemplates.filter(id => id !== templateId)
          : [...state.favoriteTemplates, templateId],
      })),

      addMyTemplate: (template) => set((state) => ({
        myTemplates: [template, ...state.myTemplates],
      })),

      removeMyTemplate: (templateId) => set((state) => ({
        myTemplates: state.myTemplates.filter(t => t.id !== templateId),
      })),
    }),
    {
      name: 'hopeagent-templates',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// 归档状态管理
interface ArchiveState {
  archivedConversations: ArchivedConversation[]
  trashedConversations: ArchivedConversation[]
  selectedIds: string[]
  setArchivedConversations: (convs: ArchivedConversation[]) => void
  archiveConversation: (convId: string) => void
  unarchiveConversation: (convId: string) => void
  moveToTrash: (convId: string) => void
  restoreFromTrash: (convId: string) => void
  permanentlyDelete: (convId: string) => void
  toggleSelect: (convId: string) => void
  selectAll: (ids: string[]) => void
  clearSelection: () => void
  batchArchive: (ids: string[]) => void
  batchDelete: (ids: string[]) => void
  batchExport: (ids: string[]) => void
}

export const useArchiveStore = create<ArchiveState>()(
  persist(
    (set, get) => ({
      archivedConversations: [],
      trashedConversations: [],
      selectedIds: [],

      setArchivedConversations: (convs) => set({ archivedConversations: convs }),

      archiveConversation: (convId) => {
        // 实际使用时应从对话列表中移动
      },

      unarchiveConversation: (convId) => {
        set((state) => ({
          archivedConversations: state.archivedConversations.filter(c => c.id !== convId),
        }))
      },

      moveToTrash: (convId) => {
        set((state) => {
          const conv = state.archivedConversations.find(c => c.id === convId)
          return {
            archivedConversations: state.archivedConversations.filter(c => c.id !== convId),
            trashedConversations: conv
              ? [...state.trashedConversations, { ...conv, status: 'trash' }]
              : state.trashedConversations,
          }
        })
      },

      restoreFromTrash: (convId) => {
        set((state) => {
          const conv = state.trashedConversations.find(c => c.id === convId)
          return {
            trashedConversations: state.trashedConversations.filter(c => c.id !== convId),
            archivedConversations: conv
              ? [...state.archivedConversations, { ...conv, status: 'archived' }]
              : state.archivedConversations,
          }
        })
      },

      permanentlyDelete: (convId) => {
        set((state) => ({
          trashedConversations: state.trashedConversations.filter(c => c.id !== convId),
        }))
      },

      toggleSelect: (convId) => set((state) => ({
        selectedIds: state.selectedIds.includes(convId)
          ? state.selectedIds.filter(id => id !== convId)
          : [...state.selectedIds, convId],
      })),

      selectAll: (ids) => set({ selectedIds: ids }),

      clearSelection: () => set({ selectedIds: [] }),

      batchArchive: (ids) => {
        // 批量归档
      },

      batchDelete: (ids) => {
        set((state) => ({
          trashedConversations: state.trashedConversations.filter(c => !ids.includes(c.id)),
          selectedIds: [],
        }))
      },

      batchExport: (ids) => {
        // 批量导出
      },
    }),
    {
      name: 'hopeagent-archive',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        archivedConversations: state.archivedConversations,
        trashedConversations: state.trashedConversations,
      }),
    }
  )
)
