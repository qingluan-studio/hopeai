import { useState } from 'react'
import { HashRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { MessageSquare, Users, BookOpen, ListTodo, Settings as SettingsIcon, Image, Code2, Languages, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import MatrixBackground from '@/components/MatrixBackground'
import Dashboard from '@/pages/Dashboard'
import Knowledge from '@/pages/Knowledge'
import Tasks from '@/pages/Tasks'
import Settings from '@/pages/Settings'
import ImageAnalyzer from '@/pages/ImageAnalyzer'
import CodeGenerator from '@/pages/CodeGenerator'
import Translator from '@/pages/Translator'
import PromptLibrary from '@/pages/PromptLibrary'

const navItems = [
  { path: '/', label: '首页', icon: MessageSquare, color: 'text-green-400', glow: 'rgba(34, 197, 94, 0.5)' },
  { path: '/team', label: '团队', icon: Users, color: 'text-blue-400', glow: 'rgba(59, 130, 246, 0.5)' },
  { path: '/knowledge', label: '知识', icon: BookOpen, color: 'text-purple-400', glow: 'rgba(168, 85, 247, 0.5)' },
  { path: '/tasks', label: '任务', icon: ListTodo, color: 'text-orange-400', glow: 'rgba(251, 146, 60, 0.5)' },
  { path: '/image', label: '图片', icon: Image, color: 'text-pink-400', glow: 'rgba(236, 72, 153, 0.5)' },
  { path: '/code', label: '代码', icon: Code2, color: 'text-cyan-400', glow: 'rgba(34, 211, 238, 0.5)' },
  { path: '/translate', label: '翻译', icon: Languages, color: 'text-amber-400', glow: 'rgba(251, 191, 36, 0.5)' },
  { path: '/prompts', label: 'Prompt', icon: Sparkles, color: 'text-violet-400', glow: 'rgba(139, 92, 246, 0.5)' },
  { path: '/settings', label: '我的', icon: SettingsIcon, color: 'text-yellow-400', glow: 'rgba(250, 204, 21, 0.5)' },
]

function BottomNav() {
  const location = useLocation()
  const [showMore, setShowMore] = useState(false)

  const mainItems = navItems.slice(0, 5)
  const moreItems = navItems.slice(5, -1)
  const settingsItem = navItems[navItems.length - 1]

  return (
    <nav className="flex-shrink-0 bg-gray-950/95 backdrop-blur-md border-t border-green-900/40 px-1 py-1.5 safe-area-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {mainItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all duration-200 min-w-[48px]',
                isActive ? 'scale-105' : 'opacity-60 hover:opacity-100'
              )}
            >
              <div
                className={cn('p-1 rounded-lg transition-all', isActive ? 'bg-gray-800/80' : '')}
                style={isActive ? { boxShadow: `0 0 12px ${item.glow}` } : {}}
              >
                <Icon
                  className={cn('w-5 h-5', isActive ? item.color : 'text-gray-500')}
                  style={isActive ? { filter: `drop-shadow(0 0 4px ${item.glow})` } : {}}
                />
              </div>
              <span className={cn(
                'text-[9px] font-mono tracking-wide',
                isActive ? item.color : 'text-gray-600'
              )}>
                {item.label}
              </span>
            </NavLink>
          )
        })}

        <div className="relative">
          <button
            onClick={() => setShowMore(!showMore)}
            className={cn(
              'flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all duration-200 min-w-[48px]',
              showMore ? 'scale-105 opacity-100' : 'opacity-60 hover:opacity-100'
            )}
          >
            <div className="p-1 rounded-lg bg-gray-800/80">
              <span className="text-lg">+</span>
            </div>
            <span className="text-[9px] font-mono text-gray-500">更多</span>
          </button>

          {showMore && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900/95 border border-gray-800 rounded-xl p-2 shadow-xl z-50">
              <div className="grid grid-cols-2 gap-1">
                {moreItems.map((item) => {
                  const isActive = location.pathname === item.path
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setShowMore(false)}
                      className={cn(
                        'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all',
                        isActive ? `${item.color} bg-gray-800/80` : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px] font-mono">{item.label}</span>
                    </NavLink>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <NavLink
          key={settingsItem.path}
          to={settingsItem.path}
          className={cn(
            'flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all duration-200 min-w-[48px]',
            location.pathname === settingsItem.path ? 'scale-105' : 'opacity-60 hover:opacity-100'
          )}
        >
          <div
            className={cn('p-1 rounded-lg transition-all', location.pathname === settingsItem.path ? 'bg-gray-800/80' : '')}
            style={location.pathname === settingsItem.path ? { boxShadow: `0 0 12px ${settingsItem.glow}` } : {}}
          >
            <SettingsIcon
              className={cn('w-5 h-5', location.pathname === settingsItem.path ? settingsItem.color : 'text-gray-500')}
              style={location.pathname === settingsItem.path ? { filter: `drop-shadow(0 0 4px ${settingsItem.glow})` } : {}}
            />
          </div>
          <span className={cn(
            'text-[9px] font-mono tracking-wide',
            location.pathname === settingsItem.path ? settingsItem.color : 'text-gray-600'
          )}>
            {settingsItem.label}
          </span>
        </NavLink>
      </div>
    </nav>
  )
}

function TeamPage() {
  return <Dashboard initialView="team" />
}

function AppLayout() {
  return (
    <div className="relative h-screen w-screen overflow-hidden flex flex-col bg-gray-950">
      <MatrixBackground opacity={0.06} speed={80} />

      <main className="flex-1 overflow-y-auto relative z-10 overscroll-contain">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/image" element={<ImageAnalyzer />} />
          <Route path="/code" element={<CodeGenerator />} />
          <Route path="/translate" element={<Translator />} />
          <Route path="/prompts" element={<PromptLibrary />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>

      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  )
}
