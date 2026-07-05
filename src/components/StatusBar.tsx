import { useState, useEffect } from 'react'
import { Wifi, Settings, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function StatusBar() {
  const [time, setTime] = useState(new Date())
  const [systemStatus, setSystemStatus] = useState<'online' | 'syncing' | 'error'>('online')

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const statusTimer = setInterval(() => {
      setSystemStatus(prev => 
        prev === 'online' ? (Math.random() > 0.9 ? 'syncing' : 'online') : 'online'
      )
    }, 3000)
    return () => clearInterval(statusTimer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short'
    })
  }

  const statusColors = {
    online: 'bg-green-500 shadow-[0_0_10px_#22c55e]',
    syncing: 'bg-yellow-500 shadow-[0_0_10px_#eab308] animate-pulse',
    error: 'bg-red-500 shadow-[0_0_10px_#ef4444]'
  }

  const statusText = {
    online: 'SYSTEM ONLINE',
    syncing: 'SYNCING...',
    error: 'ERROR'
  }

  return (
    <div className="relative h-12 bg-gray-950 border-b border-green-900/50 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-green-500/30 to-transparent animate-[scan_3s_linear_infinite]"
          style={{ 
            animation: 'scan 3s linear infinite',
          }}
        />
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34, 197, 94, 0.3) 2px, rgba(34, 197, 94, 0.3) 4px)'
          }}
        />
      </div>

      <div className="relative z-10 h-full flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <pre className="text-green-400 text-xs font-mono leading-none select-none" style={{ textShadow: '0 0 10px rgba(34, 197, 94, 0.5)' }}>
{`██╗  ██╗ ██████╗ ██████╗ ███████╗ █████╗ ██╗
██║  ██║██╔═══██╗██╔══██╗██╔════╝██╔══██╗██║
███████║██║   ██║██████╔╝█████╗  ███████║██║
██╔══██║██║   ██║██╔═══╝ ██╔══╝  ██╔══██║╚═╝
██║  ██║╚██████╔╝██║     ███████╗██║  ██║██╗
╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝`}
          </pre>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className={cn('w-2 h-2 rounded-full', statusColors[systemStatus])} />
            <span className="text-green-400 font-mono text-xs tracking-wider" style={{ textShadow: '0 0 5px rgba(34, 197, 94, 0.5)' }}>
              {statusText[systemStatus]}
            </span>
          </div>

          <div className="h-4 w-px bg-green-900/50" />

          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-500" style={{ filter: 'drop-shadow(0 0 4px rgba(34, 197, 94, 0.5))' }} />
            <span className="text-green-400 font-mono text-sm tabular-nums" style={{ textShadow: '0 0 5px rgba(34, 197, 94, 0.5)' }}>
              {formatTime(time)}
            </span>
            <span className="text-green-600 font-mono text-xs">
              {formatDate(time)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-900/50 border border-green-900/50 rounded">
            <Wifi className="w-4 h-4 text-green-500" style={{ filter: 'drop-shadow(0 0 4px rgba(34, 197, 94, 0.5))' }} />
            <span className="text-green-400 font-mono text-xs">ONLINE</span>
          </div>
          
          <button className="p-2 hover:bg-green-900/20 border border-transparent hover:border-green-700/50 rounded transition-all duration-300 group">
            <Settings className="w-4 h-4 text-green-600 group-hover:text-green-400 group-hover:rotate-90 transition-all duration-500" style={{ filter: 'drop-shadow(0 0 4px rgba(34, 197, 94, 0.3))' }} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  )
}
