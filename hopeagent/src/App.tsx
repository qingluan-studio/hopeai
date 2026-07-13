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
import KnowledgePage from '@/pages/KnowledgePage'
import AgentsPage from '@/pages/AgentsPage'
import BuilderPage from '@/pages/BuilderPage'
import DashboardPage from '@/pages/DashboardPage'
import PluginPage from '@/pages/PluginPage'
import TemplatePage from '@/pages/TemplatePage'
import ArchivePage from '@/pages/ArchivePage'
import AnalyticsPage from '@/pages/AnalyticsPage'
import WorkflowPage from '@/pages/WorkflowPage'
import MindMapPage from '@/pages/MindMapPage'
import CodeSandboxPage from '@/pages/CodeSandboxPage'
import { useAppStore, useSettingsStore, useKnowledgeStore, useChatStore } from '@/store'
import { initTheme, setTheme as applyThemeService, setFontSize as applyFontSize, setEffectIntensity as applyEffectIntensity } from '@/services/themeService'
import { initVersion, checkForUpdate, VersionInfo } from '@/services/versionService'
import BrandAvatar, { BrandWordmark } from '@/components/BrandAvatar'
import { Menu, MessageSquarePlus, Home, ArrowLeft, RefreshCw, X } from 'lucide-react'

export default function App() {
  const { currentPage, setCurrentPage, sidebarOpen, setSidebarOpen } = useAppStore()
  const { fontSize, theme, effectIntensity } = useSettingsStore()
  const { loadEntries } = useKnowledgeStore()
  const { createConversation } = useChatStore()
  const [showSplash, setShowSplash] = useState(true)
  const [showHeader, setShowHeader] = useState(true)
  const [updateAvailable, setUpdateAvailable] = useState<VersionInfo | null>(null)
  const [updateChecking, setUpdateChecking] = useState(true)

  useEffect(() => {
    initTheme()
    loadEntries()
  }, [loadEntries])

  useEffect(() => {
    let mounted = true
    const check = async () => {
      try {
        await initVersion()
        const result = await checkForUpdate()
        if (mounted && result.hasUpdate && result.newVersion) {
          setUpdateAvailable(result.newVersion)
        }
      } catch (err) {
        console.error('版本检测失败:', err)
      } finally {
        if (mounted) {
          setUpdateChecking(false)
        }
      }
    }
    check()
    return () => { mounted = false }
  }, [])

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
  const isKnowledge = currentPage === 'knowledge'
  const isAgents = currentPage === 'agents'
  const isBuilder = currentPage === 'builder'
  const isDashboard = currentPage === 'dashboard'
  const isPlugins = currentPage === 'plugins'
  const isTemplates = currentPage === 'templates'
  const isArchive = currentPage === 'archive'
  const isAnalytics = currentPage === 'analytics'
  const isWorkflow = currentPage === 'workflow'
  const isMindMap = currentPage === 'mindmap'
  const isCodeSandbox = currentPage === 'codesandbox'

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
    if (isKnowledge) return <KnowledgePage />
    if (isAgents) return <AgentsPage />
    if (isBuilder) return <BuilderPage />
    if (isDashboard) return <DashboardPage />
    if (isPlugins) return <PluginPage />
    if (isTemplates) return <TemplatePage />
    if (isArchive) return <ArchivePage />
    if (isAnalytics) return <AnalyticsPage />
    if (isWorkflow) return <WorkflowPage />
    if (isMindMap) return <MindMapPage />
    if (isCodeSandbox) return <CodeSandboxPage />
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
    if (isKnowledge) return '知识库'
    if (isAgents) return 'Agent大脑'
    if (isBuilder) return '构建器'
    if (isDashboard) return '工作台'
    if (isPlugins) return '插件市场'
    if (isTemplates) return '模板中心'
    if (isArchive) return '历史归档'
    if (isAnalytics) return '数据分析'
    if (isWorkflow) return '工作流'
    if (isMindMap) return '思维导图'
    if (isCodeSandbox) return '代码沙箱'
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

            {(isProfile || isNotification || isHelp || isApiDocs || isAbout || isTaskManage || isSchedule || isNotes || isFavorites || isCommunity || isKnowledge || isAgents || isBuilder || isDashboard || isPlugins || isTemplates || isArchive || isAnalytics || isWorkflow || isMindMap || isCodeSandbox) && (
              <button
                onClick={handleBackToHome}
                className="flex items-center gap-1 text-gray-400 hover:text-cyber-accent transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="text-xs font-mono">{getPageTitle()}</span>
              </button>
            )}

            {!isHome && !isChat && !isSettings && !isProfile && !isNotification && !isHelp && !isApiDocs && !isAbout && !isTaskManage && !isSchedule && !isNotes && !isFavorites && !isCommunity && !isKnowledge && !isAgents && !isBuilder && !isDashboard && !isPlugins && !isTemplates && !isArchive && !isAnalytics && !isWorkflow && !isMindMap && !isCodeSandbox && (
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
        {updateAvailable && (
          <div className="flex-shrink-0 bg-cyber-accent/10 border-b border-cyber-accent/30 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-cyber-accent animate-spin" />
              <div className="flex flex-col">
                <span className="text-xs font-mono text-cyber-accent">发现新版本 v{updateAvailable.version}</span>
                <span className="text-[10px] text-gray-500">点击刷新获取最新功能</span>
              </div>
            </div>
            <button
              onClick={() => {
                window.location.reload()
              }}
              className="px-3 py-1.5 bg-cyber-accent text-cyber-bg rounded-lg text-xs font-mono hover:bg-cyber-accent-hover transition-colors"
            >
              立即更新
            </button>
          </div>
        )}
        {renderPage()}
      </main>
    </div>
  )
}
