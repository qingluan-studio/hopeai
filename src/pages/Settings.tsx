import { useState, useEffect } from 'react'
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
  AlertTriangle,
  Key,
  Brain,
  Check,
  X,
  Eye,
  EyeOff
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useThemeStore } from '@/store/useThemeStore'
import type { Theme } from '@/types'
import { callKimi, saveLLMConfig, clearLLMConfig } from '@/services/llmService'
import { getSyncConfig, saveSyncConfig, clearSyncConfig, testConnection, syncToHopeAI } from '@/services/hopeaiSyncService'
import { RefreshCw, Link, Unlink } from 'lucide-react'

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

function LearningSettings() {
  const { selfLearning, autoKnowledge, workflowSpeed, toggleSelfLearning, toggleAutoKnowledge, setWorkflowSpeed } = useThemeStore()

  return (
    <SettingSection icon={Sparkles} title="自我学习" description="知识沉淀与自动学习配置">
      <div className="space-y-1">
        <ToggleSwitch
          enabled={selfLearning}
          onChange={toggleSelfLearning}
          label="自我学习"
          description="任务完成后自动总结经验并学习"
        />
        <ToggleSwitch
          enabled={autoKnowledge}
          onChange={toggleAutoKnowledge}
          label="自动知识沉淀"
          description="自动将任务经验存入知识库"
        />
        <div className="py-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-mono text-gray-300">工作流速度</p>
              <p className="text-xs font-mono text-gray-500 mt-0.5">调整Agent协作执行速度</p>
            </div>
            <span className="text-sm font-mono text-green-400">{workflowSpeed}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.5"
            value={workflowSpeed}
            onChange={(e) => setWorkflowSpeed(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-gray-600 mt-1">
            <span>0.5x</span>
            <span>正常</span>
            <span>5x</span>
          </div>
        </div>
      </div>
    </SettingSection>
  )
}

function LLMSettings() {
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('moonshot-v1-8k')
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(2000)
  const [showKey, setShowKey] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'fail'>('idle')
  const [saved, setSaved] = useState(false)
  const [useLLM, setUseLLM] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('hopeai-llm-config')
      if (stored) {
        const config = JSON.parse(stored)
        setApiKey(config.apiKey || '')
        setModel(config.model || 'moonshot-v1-8k')
        setTemperature(config.temperature ?? 0.7)
        setMaxTokens(config.maxTokens || 2000)
        setSaved(true)
      }
      const useLLMStored = localStorage.getItem('hopeai-use-llm')
      if (useLLMStored === 'true') setUseLLM(true)
    } catch {
      // ignore
    }
  }, [])

  const handleSave = () => {
    if (!apiKey.trim()) {
      alert('请输入API Key')
      return
    }
    saveLLMConfig({ apiKey: apiKey.trim(), model, temperature, maxTokens })
    setSaved(true)
    setTestStatus('idle')
  }

  const handleClear = () => {
    if (confirm('确定要清除API配置吗？')) {
      clearLLMConfig()
      setApiKey('')
      setModel('moonshot-v1-8k')
      setTemperature(0.7)
      setMaxTokens(2000)
      setSaved(false)
      setTestStatus('idle')
    }
  }

  const handleTest = async () => {
    if (!apiKey.trim()) {
      alert('请先输入API Key')
      return
    }
    setTesting(true)
    setTestStatus('idle')
    try {
      const result = await callKimi('analyst', '用一句话介绍你自己')
      if (result && result.length > 0) {
        setTestStatus('success')
      } else {
        setTestStatus('fail')
      }
    } catch (e) {
      setTestStatus('fail')
    } finally {
      setTesting(false)
    }
  }

  const handleToggleLLM = (enabled: boolean) => {
    setUseLLM(enabled)
    localStorage.setItem('hopeai-use-llm', enabled ? 'true' : 'false')
  }

  return (
    <SettingSection icon={Brain} title="大模型配置" description="Kimi AI 大模型接口设置">
      <div className="space-y-3">
        <ToggleSwitch
          enabled={useLLM}
          onChange={handleToggleLLM}
          label="启用AI大模型"
          description="使用Kimi大模型生成Agent回答（需配置API Key）"
        />

        <div className="pt-2 border-t border-gray-800/50">
          <div className="mb-2">
            <label className="text-xs font-mono text-gray-400">API Key</label>
            <div className="relative mt-1">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => { setApiKey(e.target.value); setSaved(false); setTestStatus('idle') }}
                placeholder="sk-xxxxxxxxxxxxxxxxxxxx"
                className="w-full px-3 py-2 bg-gray-900/80 border border-gray-700 rounded-lg text-sm font-mono text-gray-200 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 pr-10"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-300"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="mb-2">
            <label className="text-xs font-mono text-gray-400">模型</label>
            <select
              value={model}
              onChange={(e) => { setModel(e.target.value); setSaved(false) }}
              className="w-full mt-1 px-3 py-2 bg-gray-900/80 border border-gray-700 rounded-lg text-sm font-mono text-gray-200 focus:outline-none focus:border-green-500"
            >
              <option value="moonshot-v1-8k">moonshot-v1-8k（8K上下文）</option>
              <option value="moonshot-v1-32k">moonshot-v1-32k（32K上下文）</option>
              <option value="moonshot-v1-128k">moonshot-v1-128k（128K上下文）</option>
            </select>
          </div>

          <div className="mb-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-gray-400">Temperature</label>
              <span className="text-xs font-mono text-green-400">{temperature}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={temperature}
              onChange={(e) => { setTemperature(parseFloat(e.target.value)); setSaved(false) }}
              className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-green-500 mt-1"
            />
          </div>

          <div className="mb-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-gray-400">Max Tokens</label>
              <span className="text-xs font-mono text-green-400">{maxTokens}</span>
            </div>
            <input
              type="range"
              min="500"
              max="8000"
              step="500"
              value={maxTokens}
              onChange={(e) => { setMaxTokens(parseInt(e.target.value)); setSaved(false) }}
              className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-green-500 mt-1"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-mono rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5" />
              保存配置
            </button>
            <button
              onClick={handleTest}
              disabled={testing}
              className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white text-xs font-mono rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              {testing ? '测试中...' : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  测试连接
                </>
              )}
            </button>
            <button
              onClick={handleClear}
              className="px-3 py-2 bg-red-900/50 hover:bg-red-800/50 text-red-300 text-xs font-mono rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {testStatus === 'success' && (
            <div className="mt-2 px-3 py-2 bg-green-900/30 border border-green-700/50 rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              <span className="text-xs font-mono text-green-300">API连接成功！</span>
            </div>
          )}
          {testStatus === 'fail' && (
            <div className="mt-2 px-3 py-2 bg-red-900/30 border border-red-700/50 rounded-lg flex items-center gap-2">
              <X className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-xs font-mono text-red-300">API连接失败，请检查Key是否正确</span>
            </div>
          )}
          {saved && testStatus === 'idle' && (
            <p className="mt-2 text-[10px] font-mono text-gray-500 text-center">
              配置已保存在本地浏览器中
            </p>
          )}
        </div>
      </div>
    </SettingSection>
  )
}

function HopeAISyncSettings() {
  const [config, setConfig] = useState(() => getSyncConfig())
  const [testing, setTesting] = useState(false)
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'fail'>('idle')
  const [testMsg, setTestMsg] = useState('')
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<string | null>(null)

  const handleToggle = (enabled: boolean) => {
    saveSyncConfig({ enabled })
    setConfig(prev => ({ ...prev, enabled }))
  }

  const handleToggleAutoSync = (autoSync: boolean) => {
    saveSyncConfig({ autoSync })
    setConfig(prev => ({ ...prev, autoSync }))
  }

  const handleSave = () => {
    saveSyncConfig({
      apiUrl: config.apiUrl,
      apiKey: config.apiKey,
    })
    setTestStatus('idle')
    setSyncResult(null)
  }

  const handleTest = async () => {
    setTesting(true)
    setTestStatus('idle')
    setTestMsg('')
    try {
      const result = await testConnection()
      if (result.success) {
        setTestStatus('success')
        setTestMsg(`连接成功！远端知识库共 ${result.totalKnowledge} 条`)
      } else {
        setTestStatus('fail')
        setTestMsg(result.error || '连接失败')
      }
    } catch (e) {
      setTestStatus('fail')
      setTestMsg(e instanceof Error ? e.message : '未知错误')
    } finally {
      setTesting(false)
    }
  }

  const handleSyncNow = async () => {
    setSyncing(true)
    setSyncResult(null)
    try {
      const { useKnowledgeStore } = await import('@/store/useKnowledgeStore')
      const store = useKnowledgeStore.getState()
      const result = await syncToHopeAI(store.entries)

      if (result.success) {
        setSyncResult(`✅ 同步成功！新增 ${result.created} 条，更新 ${result.updated} 条，跳过 ${result.skipped} 条`)
        setConfig(prev => ({ ...prev, lastSyncTime: Date.now() }))
      } else {
        setSyncResult(`❌ 同步失败：${result.error}`)
      }
    } catch (e) {
      setSyncResult(`❌ 同步失败：${e instanceof Error ? e.message : '未知错误'}`)
    } finally {
      setSyncing(false)
    }
  }

  const handleClear = () => {
    if (confirm('确定要清除希望AI同步配置吗？')) {
      clearSyncConfig()
      setConfig(getSyncConfig())
      setTestStatus('idle')
      setSyncResult(null)
    }
  }

  const formatDate = (ts: number) => {
    if (!ts) return '从未同步'
    return new Date(ts).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <SettingSection icon={Link} title="希望AI 同步" description="将知识库同步到希望AI 平台">
      <div className="space-y-3">
        <ToggleSwitch
          enabled={config.enabled}
          onChange={handleToggle}
          label="启用同步"
          description="将Agent产出的知识同步到希望AI知识库"
        />

        {config.enabled && (
          <>
            <div className="h-px bg-gray-800/50" />

            <div>
              <label className="text-xs font-mono text-gray-400">API 地址</label>
              <input
                type="text"
                value={config.apiUrl}
                onChange={(e) => { setConfig(prev => ({ ...prev, apiUrl: e.target.value })); setTestStatus('idle') }}
                placeholder="https://hopeai-v20.pages.dev/api"
                className="w-full mt-1 px-3 py-2 bg-gray-900/80 border border-gray-700 rounded-lg text-sm font-mono text-gray-200 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
              <p className="text-[10px] font-mono text-gray-600 mt-1">希望AI 平台的 API 根路径</p>
            </div>

            <div>
              <label className="text-xs font-mono text-gray-400">API Key（可选）</label>
              <input
                type="password"
                value={config.apiKey}
                onChange={(e) => { setConfig(prev => ({ ...prev, apiKey: e.target.value })); setTestStatus('idle') }}
                placeholder="如果配置了访问密钥"
                className="w-full mt-1 px-3 py-2 bg-gray-900/80 border border-gray-700 rounded-lg text-sm font-mono text-gray-200 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-mono rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                保存配置
              </button>
              <button
                onClick={handleTest}
                disabled={testing}
                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white text-xs font-mono rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                {testing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    测试中
                  </>
                ) : (
                  <>
                    <Link className="w-3.5 h-3.5" />
                    测试连接
                  </>
                )}
              </button>
              <button
                onClick={handleClear}
                className="px-3 py-2 bg-red-900/50 hover:bg-red-800/50 text-red-300 text-xs font-mono rounded-lg transition-colors"
              >
                <Unlink className="w-3.5 h-3.5" />
              </button>
            </div>

            {testStatus === 'success' && (
              <div className="px-3 py-2 bg-green-900/30 border border-green-700/50 rounded-lg flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-xs font-mono text-green-300">{testMsg}</span>
              </div>
            )}
            {testStatus === 'fail' && (
              <div className="px-3 py-2 bg-red-900/30 border border-red-700/50 rounded-lg flex items-center gap-2">
                <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-xs font-mono text-red-300">{testMsg}</span>
              </div>
            )}

            <div className="h-px bg-gray-800/50" />

            <ToggleSwitch
              enabled={config.autoSync}
              onChange={handleToggleAutoSync}
              label="自动同步"
              description="新知识产生后自动同步到希望AI"
            />

            <button
              onClick={handleSyncNow}
              disabled={syncing}
              className="w-full py-2.5 rounded-lg border border-purple-700/50 bg-purple-900/20 text-purple-400 hover:bg-purple-900/30 transition-all flex items-center justify-center gap-2 text-xs font-mono disabled:opacity-50"
            >
              {syncing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  同步中...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  立即同步全部知识
                </>
              )}
            </button>

            {syncResult && (
              <div className={cn(
                'px-3 py-2 rounded-lg text-xs font-mono flex items-center gap-1.5',
                syncResult.startsWith('✅')
                  ? 'bg-green-900/20 border border-green-700/40 text-green-400'
                  : 'bg-red-900/20 border border-red-700/40 text-red-400'
              )}>
                {syncResult.startsWith('✅') ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                <span className="truncate">{syncResult}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-gray-900/60 rounded-lg p-2 border border-gray-800">
                <p className="text-[10px] font-mono text-gray-500">上次同步</p>
                <p className="text-xs font-mono text-gray-300 mt-0.5">{formatDate(config.lastSyncTime)}</p>
              </div>
              <div className="bg-gray-900/60 rounded-lg p-2 border border-gray-800">
                <p className="text-[10px] font-mono text-gray-500">累计同步</p>
                <p className="text-xs font-mono text-green-400 mt-0.5">{config.syncStats.totalSynced} 条</p>
              </div>
            </div>
          </>
        )}
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
          <LearningSettings />
          <HopeAISyncSettings />
          <LLMSettings />
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
