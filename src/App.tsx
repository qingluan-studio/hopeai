import { useState } from 'react'
import { HashRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { MessageSquare, Users, BookOpen, Rocket, Settings as SettingsIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import MatrixBackground from '@/components/MatrixBackground'
import Dashboard from '@/pages/Dashboard'
import Knowledge from '@/pages/Knowledge'
import Deploy from '@/pages/Deploy'
import Settings from '@/pages/Settings'

const navItems = [
  { path: '/', label: '首页', icon: MessageSquare, color: 'text-green-400', glow: 'rgba(34, 197, 94, 0.5)' },
  { path: '/team', label: '团队', icon: Users, color: 'text-blue-400', glow: 'rgba(59, 130, 246, 0.5)' },
  { path: '/knowledge', label: '知识', icon: BookOpen, color: 'text-purple-400', glow: 'rgba(168, 85, 247, 0.5)' },
  { path: '/deploy', label: '部署', icon: Rocket, color: 'text-orange-400', glow: 'rgba(251, 146, 60, 0.5)' },
  { path: '/settings', label: '我的', icon: SettingsIcon, color: 'text-yellow-400', glow: 'rgba(250, 204, 21, 0.5)' },
]

function BottomNav() {
  const location = useLocation()
  return (
    <nav className="flex-shrink-0 bg-gray-950/95 backdrop-blur-md border-t border-green-900/40 px-1 py-1.5 safe-area-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all duration-200 min-w-[56px]',
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
                'text-[10px] font-mono tracking-wide',
                isActive ? item.color : 'text-gray-600'
              )}>
                {item.label}
              </span>
            </NavLink>
          )
        })}
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
          <Route path="/deploy" element={<Deploy />} />
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
