import { useState } from 'react'
import { 
  Settings as SettingsIcon, 
  Palette, 
  Type, 
  Sparkles, 
  Bot, 
  Database,
  Download,
  Upload,
  Trash2,
  Moon,
  Sun,
  Zap,
  Gauge,
  FileText,
  ChevronRight,
  AlertTriangle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import MatrixBackground from '@/components/MatrixBackground'
import { useThemeStore } from '@/store/useThemeStore'
import type { Theme } from '@/types'

const themeConfigs: { id: Theme; name: string; icon: typeof Moon; color: string; glow: string }[] = [
  { 
    id: 'cyber', 
    name: '赛博朋克', 
    icon: Zap, 
    color: 'text-green-400 border-green-500/50 bg-green-500/10',
    glow: 'shadow-[0_0_20px_rgba(34,197,94,0.4)]'
  },
  { 
    id: 'matrix', 
    name: '矩阵雨', 
    icon: Moon, 
    color: 'text-cyan-400 border-cyan-500/50 bg-cyan-500/10',
    glow: 'shadow-[0_0_20px_rgba(34,211,238,0.4)]'
  },
  { 
    id: 'retro', 
    name: '复古像素', 
    icon: Sun, 
    color: 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10',
    glow: 'shadow-[0_0_20px_rgba(234,179,8,0.4)]'
  },
]

const agentConfigs = [
  { id: 'analyst', name: '分析员', role: 'ANALYST', defaultSpeed: 50, defaultDetail: 70 },
  { id: 'coder1', name: '代码员1', role: 'CODER-01', defaultSpeed: 60, defaultDetail: 80 },
  { id: 'coder2', name: '代码员2', role: 'CODER-02', defaultSpeed: 55, defaultDetail: 75 },
  { id: 'inspector', name: '检查员', role: 'INSPECTOR', defaultSpeed: 40, defaultDetail: 90 },
  { id: 'deployer', name: '部署员', role: 'DEPLOYER', defaultSpeed: 70, defaultDetail: 60 },
]

interface SettingSectionProps {
  icon: typeof SettingsIcon
  title: string
  description: string
  children: React.ReactNode
}

function SettingSection({ icon: Icon, title, description, children }: SettingSectionProps) {
  return (
    <div className="bg-gray-950/80 border border-green-900/30 rounded-lg backdrop-blur-sm overflow-hidden">
      <div className="p-4 border-b border-green-900/30 flex items-center gap-3">
        <div className="p-2 bg-green-900/30 rounded-lg border border-green-700/50">
          <Icon className="w-5 h-5 text-green-400" style={{ filter: 'drop-shadow(0 0 6px rgba(34, 197, 94, 0.5))' }} />
        </div>
        <div>
          <h2 
            className="text-green-400 font-mono text-sm tracking-widest"
            style={{ textShadow: '0 0 10px rgba(34, 197, 94, 0.5)' }}
          >
            {title}
          </h2>
          <p className="text-xs text-gray-500 font-mono">{description}</p>
        </div>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}

interface ToggleSwitchProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  label: string
  description?: string
}

function ToggleSwitch({ enabled, onChange, label, description }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-mono text-gray-300">{label}</p>
        {description && (
          <p className="text-xs font-mono text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={cn(
          'relative w-14 h-7 rounded-full transition-all duration-300',
          'border',
          enabled 
            ? 'bg-green-500/20 border-green-500/70' 
            : 'bg-gray-800/50 border-gray-700/50'
        )}
        style={enabled ? { boxShadow: '0 0 15px rgba(34, 197, 94, 0.3)' } : undefined}
      >
        <div className={cn(
          'absolute top-1 w-5 h-5 rounded-full transition-all duration-300',
          enabled 
            ? 'left-8 bg-green-400' 
            : 'left-1 bg-gray-600'
        )}
        style={enabled ? { boxShadow: '0 0 10px rgba(34, 197, 94, 0.8)' } : undefined}
        />
      </button>
    </div>
  )
}

interface SliderProps {
  value: number
  onChange: (value: number) => void
  label: string
  min?: number
  max?: number
  step?: number
  unit?: string
  ticks?: number[]
}

function Slider({ value, onChange, label, min = 0, max = 100, step = 1, unit = '%', ticks }: SliderProps) {
  return (
    <div className="py-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-mono text-gray-300">{label}</p>
        <span className="text-sm font-mono text-green-400" style={{ textShadow: '0 0 5px rgba(34, 197, 94, 0.5)' }}>
          {value}{unit}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer slider-green"
        />
        {ticks && (
          <div className="flex justify-between px-1 mt-1">
            {ticks.map(tick => (
              <div key={tick} className="flex flex-col items-center">
                <div className="w-px h-1.5 bg-gray-700" />
                <span className="text-[9px] font-mono text-gray-600 mt-0.5">{tick}{unit}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ThemeSettings() {
  const { theme, setTheme } = useThemeStore()

  return (
    <SettingSection icon={Palette} title="主题设置" description="选择你喜欢的界面主题风格">
      <div className="grid grid-cols-3 gap-3">
        {themeConfigs.map(config => {
          const Icon = config.icon
          const isActive = theme === config.id
          return (
            <button
              key={config.id}
              onClick={() => setTheme(config.id)}
              className={cn(
                'relative p-4 rounded-lg border transition-all duration-300 flex flex-col items-center gap-2',
                isActive
                  ? config.color + ' ' + config.glow
                  : 'bg-gray-900/60 border-gray-800 text-gray-500 hover:border-gray-700 hover:text-gray-400'
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-mono">{config.name}</span>
              {isActive && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full shadow-[0_0_8px_#22c55e]" />
              )}
            </button>
          )
        })}
      </div>
    </SettingSection>
  )
}

function AppearanceSettings() {
  const { fontSize, setFontSize, animationsEnabled, toggleAnimations } = useThemeStore()

  return (
    <SettingSection icon={Type} title="外观设置" description="调整字体大小和动画效果">
      <Slider 
        value={fontSize} 
        onChange={setFontSize} 
        label="字体大小"
        min={12}
        max={20}
        step={1}
        unit="px"
        ticks={[12, 14, 16, 18, 20]}
      />
      
      <div className="h-px bg-gray-800 my-2" />
      
      <ToggleSwitch 
        enabled={animationsEnabled}
        onChange={toggleAnimations}
        label="动画效果"
        description="启用/禁用界面动画和过渡效果"
      />
    </SettingSection>
  )
}

function AgentSettings() {
  const [agentSpeeds, setAgentSpeeds] = useState<Record<string, number>>(
    Object.fromEntries(agentConfigs.map(a => [a.id, a.defaultSpeed]))
  )
  const [agentDetails, setAgentDetails] = useState<Record<string, number>>(
    Object.fromEntries(agentConfigs.map(a => [a.id, a.defaultDetail]))
  )
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null)

  return (
    <SettingSection icon={Bot} title="Agent 配置" description="调整各 Agent 的行为参数">
      <div className="space-y-2">
        {agentConfigs.map(agent => {
          const isExpanded = expandedAgent === agent.id
          return (
            <div 
              key={agent.id}
              className={cn(
                'rounded-lg border transition-all duration-300 overflow-hidden',
                isExpanded 
                  ? 'border-green-700/50 bg-green-900/10' 
                  : 'border-gray-800 bg-gray-900/40 hover:border-gray-700'
              )}
            >
              <button
                onClick={() => setExpandedAgent(isExpanded ? null : agent.id)}
                className="w-full p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-gray-800 rounded border border-gray-700">
                    <Bot className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-mono text-gray-300">{agent.name}</p>
                    <p className="text-[10px] font-mono text-gray-600">{agent.role}</p>
                  </div>
                </div>
                <ChevronRight className={cn(
                  'w-4 h-4 text-gray-500 transition-transform duration-300',
                  isExpanded && 'rotate-90 text-green-400'
                )} />
              </button>
              
              {isExpanded && (
                <div className="px-3 pb-3 border-t border-green-900/20">
                  <Slider 
                    value={agentSpeeds[agent.id]} 
                    onChange={v => setAgentSpeeds(prev => ({ ...prev, [agent.id]: v }))}
                    label="响应速度"
                    ticks={[0, 25, 50, 75, 100]}
                  />
                  <Slider 
                    value={agentDetails[agent.id]} 
                    onChange={v => setAgentDetails(prev => ({ ...prev, [agent.id]: v }))}
                    label="详细程度"
                    ticks={[0, 25, 50, 75, 100]}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </SettingSection>
  )
}

function DataSettings() {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `settings-backup-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            JSON.parse(e.target?.result as string)
            alert('导入成功！')
          } catch {
            alert('文件格式错误')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleClear = () => {
    setShowConfirm(false)
    alert('数据已清空')
  }

  return (
    <SettingSection icon={Database} title="数据管理" description="导出、导入或清空应用数据">
      <div className="space-y-3">
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-blue-700/50 bg-blue-900/20 text-blue-400 hover:bg-blue-900/30 transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            <span className="text-xs font-mono">导出数据</span>
          </button>
          <button
            onClick={handleImport}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-purple-700/50 bg-purple-900/20 text-purple-400 hover:bg-purple-900/30 transition-all duration-200"
          >
            <Upload className="w-4 h-4" />
            <span className="text-xs font-mono">导入数据</span>
          </button>
        </div>

        <div className="h-px bg-gray-800" />

        {showConfirm ? (
          <div className="p-3 rounded-lg border border-red-700/50 bg-red-900/20">
            <div className="flex items-start gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-mono text-red-400">确认清空所有数据？</p>
                <p className="text-xs font-mono text-red-300/60 mt-1">此操作不可撤销，所有配置和数据将被永久删除。</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleClear}
                className="flex-1 py-2 rounded-lg bg-red-500/30 border border-red-500/70 text-red-400 text-xs font-mono hover:bg-red-500/40 transition-colors"
              >
                确认清空
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-400 text-xs font-mono hover:bg-gray-800 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-red-700/50 bg-red-900/10 text-red-400 hover:bg-red-900/20 transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-xs font-mono">清空数据</span>
          </button>
        )}
      </div>
    </SettingSection>
  )
}

export default function Settings() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 bg-gray-950/90 backdrop-blur-md border-b border-green-900/30 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-yellow-400" style={{ filter: 'drop-shadow(0 0 6px rgba(250,204,21,0.5))' }} />
          <h1 className="text-base font-mono font-bold text-yellow-400" style={{ textShadow: '0 0 8px rgba(250,204,21,0.5)' }}>
            我的设置
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 safe-area-bottom custom-scrollbar">
        <div className="max-w-md mx-auto space-y-3">
          <ThemeSettings />
          <AppearanceSettings />
          <AgentSettings />
          <DataSettings />

          <div className="pt-4 pb-2 text-center">
            <p className="text-[10px] font-mono text-gray-600">
              v2.4.1 · 极客风格多 Agent 协作开发系统
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 197, 94, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 197, 94, 0.5);
        }

        .slider-green::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #22c55e;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.8);
          border: 2px solid #166534;
          transition: all 0.2s ease;
        }

        .slider-green::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 0 15px rgba(34, 197, 94, 1);
        }

        .slider-green::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #22c55e;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.8);
          border: 2px solid #166534;
        }
      `}</style>
    </div>
  )
}
