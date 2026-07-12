import { useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import ChatPage from '@/pages/ChatPage'
import KnowledgePage from '@/pages/KnowledgePage'
import AgentsPage from '@/pages/AgentsPage'
import SettingsPage from '@/pages/SettingsPage'
import { useAppStore, useSettingsStore, useKnowledgeStore, useChatStore } from '@/store'
import { getAgent } from '@/engine/agents'
import { Menu, MessageSquarePlus, Terminal, Brain } from 'lucide-react'
import { getState as getSuperState } from '@/services/superAgentService'

export default function App() {
  const { currentPage, setCurrentPage, sidebarOpen, setSidebarOpen } = useAppStore()
  const { fontSize, theme } = useSettingsStore()
  const { loadEntries } = useKnowledgeStore()
  const { createConversation, activeAgentId } = useChatStore()

  useEffect(() => {
    loadEntries()
  }, [loadEntries])

  useEffect(() => {
    document.documentElement.style.fontSize = fontSize + 'px'
  }, [fontSize])

  const renderPage = () => {
    switch (currentPage) {
      case 'chat': return <ChatPage />
      case 'knowledge': return <KnowledgePage />
      case 'agents': return <AgentsPage />
      case 'settings': return <SettingsPage />
      default: return <ChatPage />
    }
  }

  const themeColors: Record<string, { accent: string; accent2: string }> = {
    cyber: { accent: '#00ff88', accent2: '#00d4ff' },
    matrix: { accent: '#00d4ff', accent2: '#00ff88' },
    sunset: { accent: '#c084fc', accent2: '#f472b6' },
  }

  const colors = themeColors[theme] || themeColors.cyber
  const superOn = getSuperState().enabled

  const pageTitles: Record<string, string> = {
    chat: '对话',
    knowledge: '知识库',
    agents: superOn ? '超级大脑' : 'Agent团队',
    settings: '设置',
  }

  const handleNewChat = () => {
    createConversation()
    setCurrentPage('chat')
  }

  return (
    <div
      className="h-screen w-screen flex flex-col bg-cyber-bg text-cyber-text overflow-hidden"
      style={{
        ['--accent-color' as any]: colors.accent,
        ['--accent-color-2' as any]: colors.accent2,
      }}
    >
      <Sidebar />

      {/* 顶部栏 — 极简 */}
      <header className="h-12 flex items-center justify-between px-2 border-b border-cyber-border/50 bg-cyber-panel/50 backdrop-blur-sm flex-shrink-0 z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-cyber-text transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5">
            {currentPage === 'chat' ? (
              <>
                {superOn ? (
                  <Brain className="w-4 h-4 text-purple-400" />
                ) : (
                  <Terminal className="w-4 h-4 text-cyber-accent" />
                )}
                <span className="font-mono text-sm text-cyber-accent">
                  {superOn ? '超级大脑' : 'hope'}
                  <span className="text-gray-600">{'>'}</span>
                  <span className="typing-cursor" />
                </span>
              </>
            ) : (
              <span className="font-mono text-sm text-cyber-accent">
                {pageTitles[currentPage] || 'hopeagent'}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {currentPage === 'chat' && (
            <button
              onClick={handleNewChat}
              className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-cyber-accent transition-colors"
              title="新建对话"
            >
              <MessageSquarePlus className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {renderPage()}
      </main>
    </div>
  )
}
