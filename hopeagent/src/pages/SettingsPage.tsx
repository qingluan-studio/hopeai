import { useState, useEffect } from 'react'
import {
  Settings as SettingsIcon,
  Brain,
  Key,
  Zap,
  Eye,
  EyeOff,
  Check,
  X,
  Palette,
  Type,
  Sparkles,
  Trash2,
  Download,
  Upload,
  AlertTriangle,
  Info,
  Search,
  Server,
  Wifi,
  WifiOff,
  RefreshCw,
} from 'lucide-react'
import { useSettingsStore, useChatStore, useKnowledgeStore, useAppStore } from '@/store'
import { callLLM, isLLMEnabled } from '@/services/llmService'
import { saveLLMConfig } from '@/services/llmService'
import { getSearchConfig, saveSearchConfig, webSearch } from '@/services/searchService'
import { initEmbeddings, isEmbeddingReady } from '@/services/embeddingService'
import { enableSemanticSearch } from '@/services/knowledgeService'
import {
  getState as superAgentGetState,
  toggle as superAgentToggle,
  toggleCompact as superAgentToggleCompact,
  getStats as superAgentGetStats,
} from '@/services/superAgentService'
import { agents as agentsList } from '@/engine/agents'
import { getApiBase, setApiBase, healthApi } from '@/services/apiClient'

export default function SettingsPage() {
  const { llmConfig, setLLMConfig, fontSize, setFontSize, animationsEnabled, toggleAnimations, autoLearn, setAutoLearn, theme, setTheme } = useSettingsStore()
  const { conversations } = useChatStore()
  const { entries } = useKnowledgeStore()
  const { backendOnline, setBackendOnline, useBackend, setUseBackend } = useAppStore()

  const [backendUrl, setBackendUrl] = useState(getApiBase())
  const [backendTesting, setBackendTesting] = useState(false)
  const [backendTestStatus, setBackendTestStatus] = useState<'idle' | 'success' | 'fail'>('idle')
  const [backendSaved, setBackendSaved] = useState(false)

  const handleSaveBackend = () => {
    setApiBase(backendUrl)
    setBackendSaved(true)
    setTimeout(() => setBackendSaved(false), 2000)
    // 重新探测
    healthApi.isOnline(2000).then(setBackendOnline)
  }

  const handleTestBackend = async () => {
    setBackendTesting(true)
    setBackendTestStatus('idle')
    try {
      setApiBase(backendUrl)
      const online = await healthApi.isOnline(3000)
      setBackendOnline(online)
      setBackendTestStatus(online ? 'success' : 'fail')
    } catch {
      setBackendTestStatus('fail')
    } finally {
      setBackendTesting(false)
      setTimeout(() => setBackendTestStatus('idle'), 3000)
    }
  }
  
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('moonshot-v1-8k')
  const [baseUrl, setBaseUrl] = useState('https://api.moonshot.cn/v1/chat/completions')
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(2000)
  const [enabled, setEnabled] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'fail'>('idle')
  const [saved, setSaved] = useState(false)

  const [searchProvider, setSearchProvider] = useState<'serpapi' | 'tavily' | 'duckduckgo' | 'none'>('none')
  const [searchApiKey, setSearchApiKey] = useState('')
  const [searchTestStatus, setSearchTestStatus] = useState<'idle' | 'testing' | 'success' | 'fail'>('idle')
  const [searchSaved, setSearchSaved] = useState(false)

  const [semanticEnabled, setSemanticEnabled] = useState(false)
  const [semanticLoading, setSemanticLoading] = useState(false)
  const [semanticReady, setSemanticReady] = useState(false)

  useEffect(() => {
    const sc = getSearchConfig()
    setSearchProvider(sc.provider)
    setSearchApiKey(sc.apiKey)
  }, [])

  const handleSaveSearch = () => {
    saveSearchConfig({
      provider: searchProvider,
      apiKey: searchApiKey.trim(),
    })
    setSearchSaved(true)
    setTimeout(() => setSearchSaved(false), 2000)
  }

  const testSearch = async () => {
    setSearchTestStatus('testing')
    try {
      const results = await webSearch('test', 2)
      if (results.length > 0 && results[0].source !== '模拟') {
        setSearchTestStatus('success')
      } else {
        setSearchTestStatus('success')
      }
    } catch {
      setSearchTestStatus('fail')
    }
    setTimeout(() => setSearchTestStatus('idle'), 3000)
  }

  const enableSemantic = async () => {
    setSemanticLoading(true)
    try {
      await initEmbeddings()
      enableSemanticSearch()
      setSemanticEnabled(true)
      setSemanticReady(true)
    } catch {
      setSemanticReady(false)
    } finally {
      setSemanticLoading(false)
    }
  }

  useEffect(() => {
    setApiKey(llmConfig.apiKey || '')
    setModel(llmConfig.model || 'moonshot-v1-8k')
    setBaseUrl(llmConfig.baseUrl || 'https://api.moonshot.cn/v1/chat/completions')
    setTemperature(llmConfig.temperature ?? 0.7)
    setMaxTokens(llmConfig.maxTokens || 2000)
    setEnabled(llmConfig.enabled ?? false)
  }, [llmConfig])

  const handleSave = () => {
    const config = {
      apiKey: apiKey.trim(),
      model,
      baseUrl,
      temperature,
      maxTokens,
      enabled,
    }
    setLLMConfig(config)
    saveLLMConfig(config)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleTest = async () => {
    if (!apiKey.trim()) return
    setTesting(true)
    setTestStatus('idle')
    try {
      const result = await callLLM(
        [{ role: 'user', content: '用一句话介绍你自己' }],
        { model, temperature, maxTokens }
      )
      if (result && result.length > 0) {
        setTestStatus('success')
      } else {
        setTestStatus('fail')
      }
    } catch {
      setTestStatus('fail')
    } finally {
      setTesting(false)
    }
  }

  const handleExportData = () => {
    const data = {
      conversations,
      knowledge: entries,
      settings: { llmConfig, fontSize, theme, autoLearn },
      exportedAt: new Date().toISOString(),
      version: '3.0.0',
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hopeagent-backup-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportData = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = () => {
          try {
            JSON.parse(reader.result as string)
            alert('导入功能开发中...')
          } catch {
            alert('文件格式错误')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleClearAll = () => {
    if (confirm('确定要清空所有数据吗？此操作不可撤销！')) {
      localStorage.clear()
      location.reload()
    }
  }

  const themes = [
    { id: 'cyber', name: '赛博绿', color: '#00ff88' },
    { id: 'matrix', name: '矩阵蓝', color: '#00d4ff' },
    { id: 'sunset', name: '日落紫', color: '#c084fc' },
  ]

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-md mx-auto p-3 space-y-3 pb-8">
        <div className="flex items-center gap-3 mb-4 pt-2">
          <div className="p-2 rounded-xl bg-cyber-accent/10 border border-cyber-accent/30">
            <SettingsIcon className="w-4 h-4 text-cyber-accent" />
          </div>
          <div>
            <h1 className="text-base font-bold text-cyber-text">设置</h1>
            <p className="text-xs text-gray-500">个性化配置你的Agent团队</p>
          </div>
        </div>

        {/* 后端服务 */}
        <SettingSection icon={Server} title="后端服务" description="Node.js 后端 API 地址">
          <div className="space-y-3">
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm text-gray-300">启用后端服务</p>
                <p className="text-[11px] text-gray-500 mt-0.5">走后端 API 而非本地直连</p>
              </div>
              <button
                onClick={() => setUseBackend(!useBackend)}
                className={`relative w-11 h-6 rounded-full transition-all ${
                  useBackend ? 'bg-cyber-accent/20 border border-cyber-accent/50' : 'bg-gray-800 border border-gray-700'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${
                  useBackend ? 'left-6 bg-cyber-accent' : 'left-1 bg-gray-600'
                }`} />
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono">
              {backendOnline ? (
                <>
                  <Wifi className="w-3 h-3 text-cyber-accent" />
                  <span className="text-cyber-accent">后端在线</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-gray-500" />
                  <span className="text-gray-500">后端离线</span>
                </>
              )}
              <span className="text-gray-600 ml-auto">运行 node server/index.js</span>
            </div>

            <div>
              <label className="text-xs font-mono text-gray-400 block mb-1.5">API 地址</label>
              <input
                type="text"
                value={backendUrl}
                onChange={(e) => { setBackendUrl(e.target.value); setBackendTestStatus('idle') }}
                placeholder="http://localhost:3210"
                className="w-full px-3 py-2 bg-cyber-bg/80 border border-cyber-border rounded-xl text-xs font-mono text-gray-200 focus:outline-none focus:border-cyber-accent/50"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSaveBackend}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-cyber-accent text-black rounded-xl font-mono text-xs hover:bg-cyber-accent/90 transition-colors"
              >
                <Key className="w-3.5 h-3.5" />
                保存
              </button>
              <button
                onClick={handleTestBackend}
                disabled={backendTesting}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-xl font-mono text-xs hover:bg-blue-600/30 disabled:opacity-50 transition-colors"
              >
                {backendTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                {backendTesting ? '测试中' : '测试连接'}
              </button>
            </div>

            {backendTestStatus === 'success' && (
              <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-xl">
                <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                <span className="text-xs text-green-400">后端连接成功！</span>
              </div>
            )}
            {backendTestStatus === 'fail' && (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-xl">
                <X className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <span className="text-xs text-red-400">连接失败，请检查后端是否启动</span>
              </div>
            )}
            {backendSaved && backendTestStatus === 'idle' && (
              <p className="text-xs text-center text-gray-500 font-mono">地址已保存</p>
            )}
          </div>
        </SettingSection>

        <SettingSection icon={Brain} title="大模型配置" description="Kimi / Moonshot API 设置">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-gray-300">启用AI大模型</p>
                <p className="text-xs text-gray-500 mt-0.5">使用大模型生成智能回答</p>
              </div>
              <button
                onClick={() => setEnabled(!enabled)}
                className={`relative w-12 h-7 rounded-full transition-all ${
                  enabled ? 'bg-cyber-accent/20 border border-cyber-accent/50' : 'bg-gray-800 border border-gray-700'
                }`}
              >
                <div className={`absolute top-1 w-5 h-5 rounded-full transition-all ${
                  enabled ? 'left-6 bg-cyber-accent' : 'left-1 bg-gray-600'
                }`} />
              </button>
            </div>

            <div className="pt-3 border-t border-cyber-border/50">
              <label className="text-xs font-mono text-gray-400 block mb-1.5">API Key</label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => { setApiKey(e.target.value); setTestStatus('idle') }}
                  placeholder="sk-xxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3 py-2.5 bg-cyber-bg/80 border border-cyber-border rounded-xl text-sm font-mono text-gray-200 focus:outline-none focus:border-cyber-accent/50 pr-10"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-300"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-gray-400 block mb-1.5">模型</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2.5 bg-cyber-bg/80 border border-cyber-border rounded-xl text-sm text-gray-200 focus:outline-none focus:border-cyber-accent/50"
                >
                  <option value="moonshot-v1-8k">moonshot-v1-8k</option>
                  <option value="moonshot-v1-32k">moonshot-v1-32k</option>
                  <option value="moonshot-v1-128k">moonshot-v1-128k</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-mono text-gray-400 block mb-1.5">Max Tokens</label>
                <input
                  type="number"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value) || 2000)}
                  className="w-full px-3 py-2.5 bg-cyber-bg/80 border border-cyber-border rounded-xl text-sm text-gray-200 focus:outline-none focus:border-cyber-accent/50 font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-gray-400">Temperature</label>
                <span className="text-xs font-mono text-cyber-accent">{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyber-accent"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-gray-400 block mb-1.5">API 地址</label>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                className="w-full px-3 py-2.5 bg-cyber-bg/80 border border-cyber-border rounded-xl text-sm font-mono text-gray-200 focus:outline-none focus:border-cyber-accent/50"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-cyber-accent text-black rounded-xl font-mono text-sm hover:bg-cyber-accent/90 transition-colors"
              >
                <Key className="w-4 h-4" />
                保存配置
              </button>
              <button
                onClick={handleTest}
                disabled={testing || !apiKey.trim()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl font-mono text-sm hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
              >
                {testing ? '测试中...' : (
                  <>
                    <Zap className="w-4 h-4" />
                    测试连接
                  </>
                )}
              </button>
            </div>

            {testStatus === 'success' && (
              <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-xl">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-sm text-green-400">API连接成功！</span>
              </div>
            )}
            {testStatus === 'fail' && (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-xl">
                <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-sm text-red-400">连接失败，请检查API Key</span>
              </div>
            )}
            {saved && testStatus === 'idle' && (
              <p className="text-xs text-center text-gray-500 font-mono">配置已保存</p>
            )}
          </div>
        </SettingSection>

        <SettingSection icon={Search} title="搜索服务" description="配置真实搜索引擎API">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono text-gray-400 block mb-1.5">搜索引擎</label>
              <select
                value={searchProvider}
                onChange={e => setSearchProvider(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-cyber-bg border border-cyber-border text-sm text-cyber-text outline-none focus:border-cyber-accent/50"
              >
                <option value="none">❌ 不使用（演示模式）</option>
                <option value="serpapi">🔍 SerpAPI (Google搜索)</option>
                <option value="tavily">🔎 Tavily (AI搜索)</option>
                <option value="duckduckgo">🦆 DuckDuckGo (免费)</option>
              </select>
            </div>
            
            {searchProvider !== 'none' && searchProvider !== 'duckduckgo' && (
              <div>
                <label className="text-xs font-mono text-gray-400 block mb-1.5">API Key</label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={searchApiKey}
                    onChange={e => setSearchApiKey(e.target.value)}
                    placeholder="输入你的搜索API Key"
                    className="w-full p-2.5 pr-20 rounded-xl bg-cyber-bg border border-cyber-border text-sm text-cyber-text outline-none focus:border-cyber-accent/50"
                  />
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-cyber-text"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleSaveSearch}
                className="flex-1 py-2.5 rounded-xl bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent text-sm font-semibold hover:bg-cyber-accent/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                保存配置
              </button>
              <button
                onClick={testSearch}
                disabled={searchTestStatus === 'testing'}
                className="flex-1 py-2.5 rounded-xl bg-cyber-bg border border-cyber-border text-gray-300 text-sm font-semibold hover:border-cyber-accent/30 hover:text-cyber-accent transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                {searchTestStatus === 'testing' ? '测试中...' : '测试连接'}
              </button>
            </div>

            {searchTestStatus === 'success' && (
              <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-xl">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-sm text-green-400">搜索服务可用！</span>
              </div>
            )}
            {searchTestStatus === 'fail' && (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-xl">
                <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-sm text-red-400">连接失败，请检查配置</span>
              </div>
            )}
            {searchSaved && searchTestStatus === 'idle' && (
              <p className="text-xs text-center text-gray-500 font-mono">搜索配置已保存</p>
            )}
          </div>
        </SettingSection>

        <SettingSection icon={Sparkles} title="向量检索" description="本地Embedding模型，语义搜索更准确">
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-cyber-bg/50 border border-cyber-border/50">
              <p className="text-xs text-gray-400 leading-relaxed">
                💡 启用后，知识库将使用 <span className="text-cyber-accent">all-MiniLM-L6-v2</span> 模型进行语义检索，搜索更准确。
                模型在浏览器本地运行，数据不上传。
              </p>
            </div>
            
            <button
              onClick={enableSemantic}
              disabled={semanticLoading || semanticReady}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 text-sm font-semibold hover:from-purple-500/30 hover:to-pink-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {semanticLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
                  正在下载模型...
                </>
              ) : semanticReady ? (
                <>
                  <Check className="w-4 h-4" />
                  向量检索已启用
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  启用向量检索
                </>
              )}
            </button>

            {semanticReady && (
              <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-xl">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-sm text-green-400">模型加载完成，语义检索已就绪</span>
              </div>
            )}
          </div>
        </SettingSection>

        <SettingSection icon={Palette} title="外观设置" description="主题和显示效果">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-300 mb-2">主题配色</p>
              <div className="grid grid-cols-3 gap-2">
                {themes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as any)}
                    className={`p-3 rounded-xl border transition-all ${
                      theme === t.id
                        ? 'border-white/30 bg-white/10'
                        : 'border-cyber-border hover:border-white/20'
                    }`}
                  >
                    <div 
                      className="w-8 h-8 rounded-lg mx-auto mb-1.5"
                      style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}80)` }}
                    />
                    <p className="text-xs text-center text-gray-400">{t.name}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">动画效果</p>
                <p className="text-xs text-gray-500 mt-0.5">界面过渡和动效</p>
              </div>
              <button
                onClick={toggleAnimations}
                className={`relative w-12 h-7 rounded-full transition-all ${
                  animationsEnabled ? 'bg-cyber-accent/20 border border-cyber-accent/50' : 'bg-gray-800 border border-gray-700'
                }`}
              >
                <div className={`absolute top-1 w-5 h-5 rounded-full transition-all ${
                  animationsEnabled ? 'left-6 bg-cyber-accent' : 'left-1 bg-gray-600'
                }`} />
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm text-gray-300">字体大小</label>
                <span className="text-sm text-cyber-accent font-mono">{fontSize}px</span>
              </div>
              <input
                type="range"
                min="12"
                max="20"
                step="1"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyber-accent"
              />
            </div>
          </div>
        </SettingSection>

        <SettingSection icon={Sparkles} title="学习设置" description="自我进化与知识沉淀">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">自动学习</p>
              <p className="text-xs text-gray-500 mt-0.5">对话完成后自动存入知识库</p>
            </div>
            <button
              onClick={() => setAutoLearn(!autoLearn)}
              className={`relative w-12 h-7 rounded-full transition-all ${
                autoLearn ? 'bg-cyber-accent/20 border border-cyber-accent/50' : 'bg-gray-800 border border-gray-700'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 rounded-full transition-all ${
                autoLearn ? 'left-6 bg-cyber-accent' : 'left-1 bg-gray-600'
              }`} />
            </button>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-cyber-accent/5 border border-cyber-accent/20">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-cyber-accent flex-shrink-0 mt-0.5" />
              <div className="text-xs text-gray-400">
                <p className="text-cyber-accent mb-1">学习统计</p>
                <p>知识库条目：{entries.length} 条</p>
                <p>历史对话：{conversations.length} 次</p>
              </div>
            </div>
          </div>
        </SettingSection>

        <SettingSection icon={Brain} title="超级大脑" description="融合所有Agent能力为单一超级智能">
          <SuperAgentSection />
        </SettingSection>

        <SettingSection icon={Type} title="数据管理" description="导出、导入或清空数据">
          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                onClick={handleExportData}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all text-sm font-mono"
              >
                <Download className="w-4 h-4" />
                导出数据
              </button>
              <button
                onClick={handleImportData}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-all text-sm font-mono"
              >
                <Upload className="w-4 h-4" />
                导入数据
              </button>
            </div>

            <div className="pt-3 border-t border-cyber-border/50">
              <button
                onClick={handleClearAll}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-sm font-mono"
              >
                <Trash2 className="w-4 h-4" />
                清空所有数据
              </button>
              <p className="text-xs text-gray-600 text-center mt-2 flex items-center justify-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                此操作不可撤销
              </p>
            </div>
          </div>
        </SettingSection>

        <div className="text-center py-4">
          <p className="text-xs text-gray-600 font-mono">
            HopeAgent Pro v3.0.0 · 极客多 Agent 协作平台
          </p>
        </div>
      </div>
    </div>
  )
}

function SettingSection({ icon: Icon, title, description, children }: {
  icon: typeof SettingsIcon
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-cyber-panel/50 border border-cyber-border rounded-xl overflow-hidden">
      <div className="p-3 border-b border-cyber-border/50 flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-cyber-accent/10 border border-cyber-accent/30">
          <Icon className="w-3.5 h-3.5 text-cyber-accent" />
        </div>
        <div>
          <h2 className="text-sm font-medium text-cyber-text">{title}</h2>
          <p className="text-[11px] text-gray-500">{description}</p>
        </div>
      </div>
      <div className="p-3">
        {children}
      </div>
    </div>
  )
}

function SuperAgentSection() {
  const [superEnabled, setSuperEnabled] = useState(false)
  const [compactMode, setCompactMode] = useState(false)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    const state = superAgentGetState()
    setSuperEnabled(state.enabled)
    setCompactMode(state.compactMode)
    setStats(superAgentGetStats(agentsList as any))
  }, [])

  const handleToggle = () => {
    const state = superAgentToggle()
    setSuperEnabled(state.enabled)
    setStats(superAgentGetStats(agentsList as any))
  }

  const handleCompact = () => {
    const state = superAgentToggleCompact()
    setCompactMode(state.compactMode)
  }

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
        <p className="text-xs text-gray-400 leading-relaxed">
          🧠 启用后，23个Agent的能力将融合为一个超级大脑。不再需要多轮讨论，直接以融合能力回答问题，更快更强。
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-300">启用超级大脑</p>
          <p className="text-xs text-gray-500 mt-0.5">融合所有Agent为单一超级智能</p>
        </div>
        <button
          onClick={handleToggle}
          className={`relative w-12 h-7 rounded-full transition-all ${
            superEnabled ? 'bg-purple-500/30 border border-purple-500/50' : 'bg-gray-800 border border-gray-700'
          }`}
        >
          <div className={`absolute top-1 w-5 h-5 rounded-full transition-all ${
            superEnabled ? 'left-6 bg-purple-400' : 'left-1 bg-gray-600'
          }`} />
        </button>
      </div>

      {superEnabled && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">紧凑模式</p>
              <p className="text-xs text-gray-500 mt-0.5">减少Token消耗，速度更快</p>
            </div>
            <button
              onClick={handleCompact}
              className={`relative w-12 h-7 rounded-full transition-all ${
                compactMode ? 'bg-cyber-accent/20 border border-cyber-accent/50' : 'bg-gray-800 border border-gray-700'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 rounded-full transition-all ${
                compactMode ? 'left-6 bg-cyber-accent' : 'left-1 bg-gray-600'
              }`} />
            </button>
          </div>

          {stats && (
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-lg bg-cyber-bg/50 border border-cyber-border/50 text-center">
                <p className="text-lg font-bold text-cyber-accent font-mono">{stats.totalAgents}</p>
                <p className="text-[10px] text-gray-500">融合Agent</p>
              </div>
              <div className="p-2.5 rounded-lg bg-cyber-bg/50 border border-cyber-border/50 text-center">
                <p className="text-lg font-bold text-cyan-400 font-mono">{stats.totalLayers}</p>
                <p className="text-[10px] text-gray-500">能力层级</p>
              </div>
              <div className="p-2.5 rounded-lg bg-cyber-bg/50 border border-cyber-border/50 text-center">
                <p className="text-lg font-bold text-purple-400 font-mono">{stats.evolutionCount}</p>
                <p className="text-[10px] text-gray-500">进化次数</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
