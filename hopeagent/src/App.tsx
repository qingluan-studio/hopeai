import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import SplashScreen from '@/components/SplashScreen'
import ChatPage from '@/pages/ChatPage'
import HomePage from '@/pages/HomePage'
import SettingsPage from '@/pages/SettingsPage'
import ProfilePage from '@/pages/ProfilePage'
import NotificationPage from '@/pages/NotificationPage'
import HelpPage from '@/pages/HelpPage'
import ApiDocsPage from '@/pages/ApiDocsPage'
import AboutPage from '@/pages/AboutPage'
import TaskManagePage from '@/pages/TaskManagePage'
import SchedulePage from '@/pages/SchedulePage'
import NotesPage from '@/pages/NotesPage'
import FavoritesPage from '@/pages/FavoritesPage'
import CommunityPage from '@/pages/CommunityPage'
import { useAppStore, useSettingsStore, useKnowledgeStore, useChatStore } from '@/store'
import { initTheme, setTheme as applyThemeService, setFontSize as applyFontSize, setEffectIntensity as applyEffectIntensity } from '@/services/themeService'
import BrandAvatar, { BrandWordmark } from '@/components/BrandAvatar'
import { Menu, MessageSquarePlus, Home, ArrowLeft } from 'lucide-react'

export default function App() {
  const { currentPage, setCurrentPage, sidebarOpen, setSidebarOpen } = useAppStore()
  const { fontSize, theme, effectIntensity } = useSettingsStore()
  const { loadEntries } = useKnowledgeStore()
  const { createConversation } = useChatStore()
  const [showSplash, setShowSplash] = useState(true)
  const [showHeader, setShowHeader] = useState(true)

  useEffect(() => {
    initTheme()
    loadEntries()
  }, [loadEntries])

  useEffect(() => {
    applyThemeService(theme)
  }, [theme])

  useEffect(() => {
    applyFontSize(fontSize)
  }, [fontSize])

  useEffect(() => {
    applyEffectIntensity(effectIntensity)
  }, [effectIntensity])

  const isHome = currentPage === 'home' || !currentPage
  const isChat = currentPage === 'chat'
  const isSettings = currentPage === 'settings'
  const isProfile = currentPage === 'profile'
  const isNotification = currentPage === 'notification'
  const isHelp = currentPage === 'help'
  const isApiDocs = currentPage === 'apidocs'
  const isAbout = currentPage === 'about'
  const isTaskManage = currentPage === 'taskmanage'
  const isSchedule = currentPage === 'schedule'
  const isNotes = currentPage === 'notes'
  const isFavorites = currentPage === 'favorites'
  const isCommunity = currentPage === 'community'

  const handleNewChat = () => {
    createConversation()
    setCurrentPage('chat')
  }

  const handleBackToHome = () => {
    setCurrentPage('home')
  }

  const renderPage = () => {
    if (isHome) return <HomePage />
    if (isChat) return <ChatPage />
    if (isSettings) return <SettingsPage />
    if (isProfile) return <ProfilePage />
    if (isNotification) return <NotificationPage />
    if (isHelp) return <HelpPage />
    if (isApiDocs) return <ApiDocsPage />
    if (isAbout) return <AboutPage />
    if (isTaskManage) return <TaskManagePage />
    if (isSchedule) return <SchedulePage />
    if (isNotes) return <NotesPage />
    if (isFavorites) return <FavoritesPage />
    if (isCommunity) return <CommunityPage />
    return <HomePage />
  }

  const getPageTitle = () => {
    if (isHome) return '首页'
    if (isChat) return '对话'
    if (isSettings) return '设置'
    if (isProfile) return '个人中心'
    if (isNotification) return '消息通知'
    if (isHelp) return '帮助文档'
    if (isApiDocs) return 'API文档'
    if (isAbout) return '关于'
    if (isTaskManage) return '任务管理'
    if (isSchedule) return '日程管理'
    if (isNotes) return '笔记'
    if (isFavorites) return '收藏夹'
    if (isCommunity) return '社区'
    return 'HopeAgent'
  }

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} minDuration={2200} />
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-cyber-bg text-cyber-text overflow-hidden">
      <Sidebar />

      {/* 顶部栏 - 极简 */}
      {showHeader && (
        <header className="h-12 flex items-center justify-between px-3 border-b border-cyber-border/30 bg-cyber-panel/40 backdrop-blur-sm flex-shrink-0 z-30">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-cyber-text transition-colors"
            >
              <Menu className="w-4 h-4" />
            </button>

            {isHome && (
              <div className="flex items-center gap-1.5">
                <BrandAvatar size="xs" />
                <BrandWordmark className="text-sm" />
              </div>
            )}

            {isChat && (
              <button
                onClick={handleBackToHome}
                className="flex items-center gap-1 text-gray-400 hover:text-cyber-accent transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="text-xs font-mono">返回</span>
              </button>
            )}

            {isSettings && (
              <button
                onClick={handleBackToHome}
                className="flex items-center gap-1 text-gray-400 hover:text-cyber-accent transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="text-xs font-mono">返回首页</span>
              </button>
            )}

            {(isProfile || isNotification || isHelp || isApiDocs || isAbout || isTaskManage || isSchedule || isNotes || isFavorites || isCommunity) && (
              <button
                onClick={handleBackToHome}
                className="flex items-center gap-1 text-gray-400 hover:text-cyber-accent transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="text-xs font-mono">{getPageTitle()}</span>
              </button>
            )}

            {!isHome && !isChat && !isSettings && !isProfile && !isNotification && !isHelp && !isApiDocs && !isAbout && !isTaskManage && !isSchedule && !isNotes && !isFavorites && !isCommunity && (
              <span className="font-mono text-xs text-cyber-accent">
                {getPageTitle()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-0.5">
            {isChat && (
              <button
                onClick={handleNewChat}
                className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-cyber-accent transition-colors"
                title="新建对话"
              >
                <MessageSquarePlus className="w-4 h-4" />
              </button>
            )}
            {isHome && (
              <button
                onClick={handleNewChat}
                className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-cyber-accent transition-colors"
                title="新建对话"
              >
                <MessageSquarePlus className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>
      )}

      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {renderPage()}
      </main>
    </div>
  )
}
