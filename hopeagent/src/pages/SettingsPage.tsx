import { useState, useEffect, useRef } from 'react'
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
  Shield,
  Plus,
  TestTube,
  Lock,
} from 'lucide-react'
import { useSettingsStore, useChatStore, useKnowledgeStore, useAppStore } from '@/store'
import { getThemes, type ThemeConfig } from '@/services/themeService'
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
import {
  listCredentials,
  storeCredential,
  getCredential,
  deleteCredential,
  rotateCredential,
  testCredential,
  getVaultStatus,
  exportVault,
  importVault,
  CREDENTIAL_TYPES,
  RECOMMENDED_CREDENTIALS,
  getTypeMeta,
  isRecommendedKey,
  formatVaultTime,
  downloadBlob,
  type VaultCredential,
  type VaultStatus,
  type CredentialType,
  type TestResult,
} from '@/services/vaultService'

export default function SettingsPage() {
  const { llmConfig, setLLMConfig, fontSize, setFontSize, animationsEnabled, toggleAnimations, autoLearn, setAutoLearn, theme, setTheme, effectIntensity, setEffectIntensity } = useSettingsStore()
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

  const allThemes = getThemes()

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

        {/* 凭证保险库 */}
        <SettingSection icon={Shield} title="凭证保险库" description="加密存储 API Key / 密码等敏感凭证">
          <VaultSection />
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

        <SettingSection icon={Palette} title="主题设置" description="8 套精美主题，打造专属终端风格">
          <div className="space-y-5">
            {/* 主题卡片网格 */}
            <div>
              <p className="text-sm text-gray-300 mb-2">选择主题</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {allThemes.map((t: ThemeConfig) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`relative p-2 rounded-xl border transition-all ${
                      theme === t.id
                        ? 'border-white/40 bg-white/5 scale-[1.02]'
                        : 'border-cyber-border hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div
                      className="w-full h-12 rounded-lg mb-1.5 overflow-hidden relative"
                      style={{
                        background: `linear-gradient(135deg, ${t.colors.bg} 0%, ${t.colors.bgPanel} 50%, ${t.colors.accent}20 100%)`,
                        border: `1px solid ${t.colors.border}`,
                      }}
                    >
                      <div
                        className="absolute bottom-1 left-1 right-1 h-1 rounded-full"
                        style={{ background: t.colors.accent, opacity: 0.6 }}
                      />
                      <div
                        className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full"
                        style={{ background: t.colors.accent }}
                      />
                    </div>
                    <p className="text-[11px] text-center font-medium" style={{ color: t.colors.textPrimary }}>
                      {t.name}
                    </p>
                    {theme === t.id && (
                      <div className="absolute top-1 right-1">
                        <Check className="w-3 h-3 text-cyber-accent" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 当前主题描述 */}
            <div className="p-3 rounded-xl bg-cyber-accent/5 border border-cyber-accent/20">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-cyber-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-cyber-accent font-medium mb-0.5">
                    {allThemes.find(t => t.id === theme)?.name || '赛博朋克'}
                  </p>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    {allThemes.find(t => t.id === theme)?.description || '经典绿色赛博朋克风格'}
                  </p>
                </div>
              </div>
            </div>

            {/* 字体大小 */}
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

            {/* 特效强度 */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm text-gray-300">特效强度</label>
                <span className="text-sm text-cyber-accent font-mono">{Math.round(effectIntensity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={effectIntensity}
                onChange={(e) => setEffectIntensity(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyber-accent"
              />
            </div>

            {/* 动画开关 */}
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

            {/* 主题特效标签 */}
            <div>
              <p className="text-sm text-gray-300 mb-2">主题特效</p>
              <div className="flex flex-wrap gap-2">
                {allThemes.find(t => t.id === theme)?.effects.scanline && (
                  <span className="px-2 py-1 text-[11px] rounded-lg bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent font-mono">
                    扫描线
                  </span>
                )}
                {allThemes.find(t => t.id === theme)?.effects.glow && (
                  <span className="px-2 py-1 text-[11px] rounded-lg bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent font-mono">
                    发光
                  </span>
                )}
                {allThemes.find(t => t.id === theme)?.effects.glassmorphism && (
                  <span className="px-2 py-1 text-[11px] rounded-lg bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent font-mono">
                    毛玻璃
                  </span>
                )}
                {allThemes.find(t => t.id === theme)?.backgroundPattern === 'grid' && (
                  <span className="px-2 py-1 text-[11px] rounded-lg bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent font-mono">
                    网格背景
                  </span>
                )}
                {!allThemes.find(t => t.id === theme)?.effects.scanline &&
                 !allThemes.find(t => t.id === theme)?.effects.glow &&
                 !allThemes.find(t => t.id === theme)?.effects.glassmorphism &&
                 allThemes.find(t => t.id === theme)?.backgroundPattern === 'none' && (
                  <span className="px-2 py-1 text-[11px] rounded-lg bg-gray-800 border border-gray-700 text-gray-500 font-mono">
                    简洁无特效
                  </span>
                )}
              </div>
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

// ============ 凭证保险库分区 ============

/** 凭证状态灯颜色映射 */
function statusDotClass(hasValue: boolean, isMissing: boolean): string {
  if (isMissing) return 'bg-red-500'
  return hasValue ? 'bg-cyber-accent' : 'bg-gray-600'
}

function VaultSection() {
  const [credentials, setCredentials] = useState<VaultCredential[]>([])
  const [status, setStatus] = useState<VaultStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // 添加凭证表单状态
  const [showAddForm, setShowAddForm] = useState(false)
  const [formKey, setFormKey] = useState('')
  const [formKeyCustom, setFormKeyCustom] = useState(false)
  const [formName, setFormName] = useState('')
  const [formType, setFormType] = useState<CredentialType>('llm_api_key')
  const [formValue, setFormValue] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [showFormValue, setShowFormValue] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  // 查看明文弹窗：先二次确认，再显示明文，3 秒后自动隐藏
  const [viewModal, setViewModal] = useState<{
    open: boolean
    key: string
    name: string
    loading: boolean
    confirmed: boolean
    value: string
    remaining: number
  }>({ open: false, key: '', name: '', loading: false, confirmed: false, value: '', remaining: 0 })
  const viewTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // 轮换弹窗
  const [rotateModal, setRotateModal] = useState<{ open: boolean; key: string; name: string; value: string; show: boolean; saving: boolean }>(
    { open: false, key: '', name: '', value: '', show: false, saving: false }
  )

  // 每个凭证的测试结果
  const [testResults, setTestResults] = useState<Record<string, TestResult | 'testing'>>({})

  // 导出 / 导入
  const [exportPassword, setExportPassword] = useState('')
  const [exporting, setExporting] = useState(false)
  const [importPassword, setImportPassword] = useState('')
  const [importing, setImporting] = useState(false)
  const importFileRef = useRef<HTMLInputElement>(null)
  const importFileRef2 = useRef<File | null>(null)

  // 全局提示
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; msg: string } | null>(null)

  const showToast = (type: 'success' | 'error' | 'info', msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3000)
  }

  /** 拉取凭证列表与状态 */
  const refresh = async () => {
    setLoading(true)
    setError('')
    try {
      const [list, st] = await Promise.all([listCredentials(), getVaultStatus()])
      setCredentials(list)
      setStatus(st)
    } catch (err: any) {
      setError(err?.message || '加载失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    return () => {
      if (viewTimerRef.current) clearInterval(viewTimerRef.current)
    }
  }, [])

  /** 判断某个 key 是否在推荐缺失列表中 */
  const isMissingKey = (key: string): boolean => !!status?.missing?.includes(key)

  // ============ 添加 / 保存凭证 ============

  const resetForm = () => {
    setFormKey('')
    setFormKeyCustom(false)
    setFormName('')
    setFormType('llm_api_key')
    setFormValue('')
    setFormDesc('')
    setShowFormValue(false)
    setFormError('')
  }

  const handleSelectRecommended = (key: string) => {
    const rec = RECOMMENDED_CREDENTIALS.find(r => r.key === key)
    if (rec) {
      setFormKey(rec.key)
      setFormName(rec.name)
      setFormType(rec.type)
    }
  }

  const handleSaveCredential = async () => {
    setFormError('')
    if (!formKey.trim()) {
      setFormError('请填写凭证 Key')
      return
    }
    if (!/^[a-zA-Z0-9_\-\.]+$/.test(formKey.trim())) {
      setFormError('Key 仅允许字母、数字、下划线、连字符、点')
      return
    }
    if (!formName.trim()) {
      setFormError('请填写凭证名称')
      return
    }
    if (!formValue.trim()) {
      setFormError('请填写凭证值')
      return
    }
    setSaving(true)
    try {
      const metadata = formDesc.trim() ? { description: formDesc.trim() } : undefined
      await storeCredential(formKey.trim(), formName.trim(), formValue, formType, metadata)
      showToast('success', '凭证已保存')
      resetForm()
      setShowAddForm(false)
      await refresh()
    } catch (err: any) {
      setFormError(err?.message || '保存失败')
    } finally {
      setSaving(false)
    }
  }

  // ============ 查看明文 ============

  const openViewModal = (cred: VaultCredential) => {
    if (viewTimerRef.current) {
      clearInterval(viewTimerRef.current)
      viewTimerRef.current = null
    }
    setViewModal({ open: true, key: cred.key, name: cred.name, loading: false, confirmed: false, value: '', remaining: 0 })
  }

  const closeViewModal = () => {
    if (viewTimerRef.current) {
      clearInterval(viewTimerRef.current)
      viewTimerRef.current = null
    }
    setViewModal({ open: false, key: '', name: '', loading: false, confirmed: false, value: '', remaining: 0 })
  }

  /** 二次确认后拉取明文，并启动 3 秒倒计时自动隐藏 */
  const confirmViewPlaintext = async () => {
    setViewModal(m => ({ ...m, loading: true, confirmed: true }))
    try {
      const data = await getCredential(viewModal.key)
      const value = data?.value || ''
      setViewModal(m => ({ ...m, value, loading: false, remaining: 3 }))
      viewTimerRef.current = setInterval(() => {
        setViewModal(m => {
          const next = m.remaining - 1
          if (next <= 0) {
            if (viewTimerRef.current) {
              clearInterval(viewTimerRef.current)
              viewTimerRef.current = null
            }
            return { ...m, value: '', remaining: 0 }
          }
          return { ...m, remaining: next }
        })
      }, 1000)
    } catch (err: any) {
      setViewModal(m => ({ ...m, loading: false, value: '', remaining: 0 }))
      showToast('error', err?.message || '获取明文失败（可能需要管理员权限）')
    }
  }

  // ============ 删除 ============

  const handleDelete = async (cred: VaultCredential) => {
    if (!confirm(`确定删除凭证「${cred.name}」吗？此操作不可撤销。`)) return
    try {
      await deleteCredential(cred.key)
      showToast('success', '凭证已删除')
      await refresh()
    } catch (err: any) {
      showToast('error', err?.message || '删除失败')
    }
  }

  // ============ 轮换 ============

  const openRotateModal = (cred: VaultCredential) => {
    setRotateModal({ open: true, key: cred.key, name: cred.name, value: '', show: false, saving: false })
  }

  const handleRotate = async () => {
    if (!rotateModal.value.trim()) {
      showToast('error', '请输入新值')
      return
    }
    setRotateModal(m => ({ ...m, saving: true }))
    try {
      await rotateCredential(rotateModal.key, rotateModal.value)
      showToast('success', '凭证已轮换')
      setRotateModal({ open: false, key: '', name: '', value: '', show: false, saving: false })
      await refresh()
    } catch (err: any) {
      showToast('error', err?.message || '轮换失败')
    } finally {
      setRotateModal(m => ({ ...m, saving: false }))
    }
  }

  // ============ 测试 ============

  const handleTest = async (cred: VaultCredential) => {
    setTestResults(r => ({ ...r, [cred.key]: 'testing' }))
    try {
      const result = await testCredential(cred.key)
      setTestResults(r => ({ ...r, [cred.key]: result }))
      if (!result.success) {
        showToast('error', result.message || '测试失败')
      } else {
        showToast('success', result.message || '测试通过')
      }
    } catch (err: any) {
      setTestResults(r => ({ ...r, [cred.key]: { success: false, message: err?.message || '测试失败' } }))
      showToast('error', err?.message || '测试失败')
    }
  }

  // ============ 导出 / 导入 ============

  const handleExport = async () => {
    if (!exportPassword.trim()) {
      showToast('error', '请输入导出密码')
      return
    }
    setExporting(true)
    try {
      const blob = await exportVault(exportPassword)
      downloadBlob(blob, `hopeagent-vault-${Date.now()}.enc`)
      showToast('success', '保险库已导出（加密）')
      setExportPassword('')
    } catch (err: any) {
      showToast('error', err?.message || '导出失败')
    } finally {
      setExporting(false)
    }
  }

  const handleImportClick = () => {
    importFileRef.current?.click()
  }

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      importFileRef2.current = file
      setImportPassword('')
      showToast('info', `已选择文件：${file.name}，请输入密码后导入`)
    }
    // 重置 input 以便重复选择同一文件
    if (importFileRef.current) importFileRef.current.value = ''
  }

  const handleImport = async () => {
    const file = importFileRef2.current
    if (!file) {
      showToast('error', '请先选择导出文件')
      return
    }
    if (!importPassword.trim()) {
      showToast('error', '请输入导入密码')
      return
    }
    setImporting(true)
    try {
      await importVault(file, importPassword)
      showToast('success', '保险库已导入')
      importFileRef2.current = null
      setImportPassword('')
      await refresh()
    } catch (err: any) {
      showToast('error', err?.message || '导入失败，密码可能错误')
    } finally {
      setImporting(false)
    }
  }

  // ============ 渲染 ============

  const configuredCount = status?.configured?.length ?? credentials.filter(c => c.hasValue).length
  const missingCount = status?.missing?.length ?? 0
  const totalCount = configuredCount + missingCount
  const progress = totalCount > 0 ? Math.round((configuredCount / totalCount) * 100) : 0

  return (
    <div className="space-y-4">
      {/* 安全提示 */}
      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-cyber-accent/5 border border-cyber-accent/20">
        <Lock className="w-3.5 h-3.5 text-cyber-accent flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-gray-400 leading-relaxed">
          凭证在后端加密存储，前端不缓存明文。查看明文需管理员权限并经二次确认，3 秒后自动隐藏。
        </p>
      </div>

      {/* 状态总览卡片 */}
      <div className="p-3 rounded-xl bg-cyber-bg/60 border border-cyber-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-gray-400">配置进度</span>
          <span className="text-xs font-mono text-cyber-accent">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-cyber-accent/60 to-cyber-accent rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 rounded-lg bg-cyber-accent/5 border border-cyber-accent/20 text-center">
            <p className="text-base font-bold text-cyber-accent font-mono leading-tight">{configuredCount}</p>
            <p className="text-[10px] text-gray-500">已配置</p>
          </div>
          <div className="p-2 rounded-lg bg-red-500/5 border border-red-500/20 text-center">
            <p className="text-base font-bold text-red-400 font-mono leading-tight">{missingCount}</p>
            <p className="text-[10px] text-gray-500">缺失</p>
          </div>
          <div className="p-2 rounded-lg bg-gray-500/5 border border-gray-500/20 text-center">
            <p className="text-base font-bold text-gray-300 font-mono leading-tight">{totalCount}</p>
            <p className="text-[10px] text-gray-500">推荐总数</p>
          </div>
        </div>
      </div>

      {/* 添加凭证按钮 */}
      <button
        onClick={() => { resetForm(); setShowAddForm(s => !s) }}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent text-sm font-mono hover:bg-cyber-accent/20 transition-all"
      >
        <Plus className="w-4 h-4" />
        {showAddForm ? '收起表单' : '添加凭证'}
      </button>

      {/* 添加凭证表单 */}
      {showAddForm && (
        <div className="p-3 rounded-xl bg-cyber-bg/50 border border-cyber-border space-y-3">
          {/* Key 选择 / 自定义 */}
          <div>
            <label className="text-xs font-mono text-gray-400 block mb-1.5">凭证 Key</label>
            {!formKeyCustom ? (
              <select
                value={formKey}
                onChange={e => {
                  if (e.target.value === '__custom__') {
                    setFormKeyCustom(true)
                    setFormKey('')
                  } else {
                    handleSelectRecommended(e.target.value)
                  }
                }}
                className="w-full px-3 py-2 bg-cyber-bg/80 border border-cyber-border rounded-xl text-xs font-mono text-gray-200 focus:outline-none focus:border-cyber-accent/50"
              >
                <option value="">— 选择推荐凭证 —</option>
                {RECOMMENDED_CREDENTIALS.map(r => (
                  <option key={r.key} value={r.key}>{r.name}（{r.key}）</option>
                ))}
                <option value="__custom__">✏️ 自定义 Key…</option>
              </select>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formKey}
                  onChange={e => setFormKey(e.target.value)}
                  placeholder="my_custom_key"
                  className="flex-1 px-3 py-2 bg-cyber-bg/80 border border-cyber-border rounded-xl text-xs font-mono text-gray-200 focus:outline-none focus:border-cyber-accent/50"
                />
                <button
                  onClick={() => { setFormKeyCustom(false); setFormKey('') }}
                  className="px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-gray-400 text-xs hover:text-gray-200"
                >
                  返回
                </button>
              </div>
            )}
          </div>

          {/* 名称 */}
          <div>
            <label className="text-xs font-mono text-gray-400 block mb-1.5">名称</label>
            <input
              type="text"
              value={formName}
              onChange={e => setFormName(e.target.value)}
              placeholder="OpenAI API Key"
              className="w-full px-3 py-2 bg-cyber-bg/80 border border-cyber-border rounded-xl text-xs font-mono text-gray-200 focus:outline-none focus:border-cyber-accent/50"
            />
          </div>

          {/* 类型 */}
          <div>
            <label className="text-xs font-mono text-gray-400 block mb-1.5">类型</label>
            <select
              value={formType}
              onChange={e => setFormType(e.target.value as CredentialType)}
              className="w-full px-3 py-2 bg-cyber-bg/80 border border-cyber-border rounded-xl text-xs font-mono text-gray-200 focus:outline-none focus:border-cyber-accent/50"
            >
              {CREDENTIAL_TYPES.map(t => (
                <option key={t.type} value={t.type}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* 值 */}
          <div>
            <label className="text-xs font-mono text-gray-400 block mb-1.5">凭证值</label>
            <div className="relative">
              <input
                type={showFormValue ? 'text' : 'password'}
                value={formValue}
                onChange={e => setFormValue(e.target.value)}
                placeholder={getTypeMeta(formType).placeholder || '输入凭证值'}
                className="w-full px-3 py-2 bg-cyber-bg/80 border border-cyber-border rounded-xl text-xs font-mono text-gray-200 focus:outline-none focus:border-cyber-accent/50 pr-10"
              />
              <button
                onClick={() => setShowFormValue(s => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-300"
              >
                {showFormValue ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* 描述 */}
          <div>
            <label className="text-xs font-mono text-gray-400 block mb-1.5">备注（可选）</label>
            <input
              type="text"
              value={formDesc}
              onChange={e => setFormDesc(e.target.value)}
              placeholder="用途说明…"
              className="w-full px-3 py-2 bg-cyber-bg/80 border border-cyber-border rounded-xl text-xs font-mono text-gray-200 focus:outline-none focus:border-cyber-accent/50"
            />
          </div>

          {formError && (
            <p className="text-xs text-red-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {formError}
            </p>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleSaveCredential}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-cyber-accent text-black text-xs font-mono hover:bg-cyber-accent/90 disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              {saving ? '保存中' : '保存'}
            </button>
            <button
              onClick={() => { resetForm(); setShowAddForm(false) }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-gray-400 text-xs font-mono hover:text-gray-200"
            >
              <X className="w-3.5 h-3.5" />
              取消
            </button>
          </div>
        </div>
      )}

      {/* 凭证列表 */}
      {loading ? (
        <div className="flex items-center justify-center py-6 text-xs text-gray-500 font-mono">
          <RefreshCw className="w-3.5 h-3.5 animate-spin mr-2" />
          加载中…
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30">
          <X className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
          <span className="text-xs text-red-400">{error}</span>
        </div>
      ) : credentials.length === 0 ? (
        <div className="text-center py-6 text-xs text-gray-500 font-mono">
          暂无凭证，点击「添加凭证」开始配置
        </div>
      ) : (
        <div className="space-y-2">
          {credentials.map(cred => {
            const meta = getTypeMeta(cred.type)
            const missing = isMissingKey(cred.key)
            const testRes = testResults[cred.key]
            const rec = isRecommendedKey(cred.key)
            return (
              <div key={cred.key} className="p-2.5 rounded-xl bg-cyber-bg/50 border border-cyber-border">
                {/* 顶部：状态灯 + 名称 + 类型标签 */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDotClass(cred.hasValue, missing)}`} />
                  <span className="text-sm text-gray-200 font-medium truncate flex-1">{cred.name}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyber-accent/10 border border-cyber-accent/20 text-cyber-accent flex-shrink-0">
                    {meta.label}
                  </span>
                </div>
                {/* Key + 时间 */}
                <div className="text-[11px] font-mono text-gray-500 mb-1 truncate">key: {cred.key}</div>
                <div className="flex items-center justify-between text-[10px] font-mono text-gray-600 mb-2">
                  <span>创建: {formatVaultTime(cred.createdAt)}</span>
                  <span>更新: {formatVaultTime(cred.updatedAt)}</span>
                </div>
                {rec && (
                  <div className="text-[10px] text-gray-500 mb-2">推荐：{rec.description}</div>
                )}
                {/* 测试结果 */}
                {testRes && testRes !== 'testing' && (
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg mb-2 text-[11px] ${
                    testRes.success
                      ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                      : 'bg-red-500/10 border border-red-500/30 text-red-400'
                  }`}>
                    {testRes.success ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    <span className="truncate">{testRes.message}</span>
                  </div>
                )}
                {/* 操作按钮 */}
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    onClick={() => openViewModal(cred)}
                    disabled={!cred.hasValue}
                    title="查看明文"
                    className="flex items-center justify-center py-1.5 rounded-lg bg-cyber-bg border border-cyber-border text-gray-400 hover:text-cyber-accent hover:border-cyber-accent/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openRotateModal(cred)}
                    title="轮换"
                    className="flex items-center justify-center py-1.5 rounded-lg bg-cyber-bg border border-cyber-border text-gray-400 hover:text-cyber-accent2 hover:border-cyber-accent2/30 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleTest(cred)}
                    disabled={!cred.hasValue || testRes === 'testing'}
                    title="测试"
                    className="flex items-center justify-center py-1.5 rounded-lg bg-cyber-bg border border-cyber-border text-gray-400 hover:text-purple-400 hover:border-purple-400/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    {testRes === 'testing' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <TestTube className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleDelete(cred)}
                    title="删除"
                    className="flex items-center justify-center py-1.5 rounded-lg bg-cyber-bg border border-cyber-border text-gray-400 hover:text-red-400 hover:border-red-400/30 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 导出 / 导入区 */}
      <div className="pt-3 border-t border-cyber-border/50 space-y-3">
        <p className="text-xs font-mono text-gray-400">备份与迁移</p>

        {/* 导出 */}
        <div className="space-y-1.5">
          <div className="flex gap-2">
            <input
              type="password"
              value={exportPassword}
              onChange={e => setExportPassword(e.target.value)}
              placeholder="导出加密密码"
              className="flex-1 px-3 py-2 bg-cyber-bg/80 border border-cyber-border rounded-xl text-xs font-mono text-gray-200 focus:outline-none focus:border-cyber-accent/50"
            />
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-mono hover:bg-blue-600/30 disabled:opacity-50"
            >
              {exporting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              导出
            </button>
          </div>
        </div>

        {/* 导入 */}
        <div className="space-y-1.5">
          <div className="flex gap-2">
            <input
              type="password"
              value={importPassword}
              onChange={e => setImportPassword(e.target.value)}
              placeholder="导入解密密码"
              className="flex-1 px-3 py-2 bg-cyber-bg/80 border border-cyber-border rounded-xl text-xs font-mono text-gray-200 focus:outline-none focus:border-cyber-accent/50"
            />
            <button
              onClick={handleImportClick}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 text-xs font-mono hover:bg-purple-600/30"
            >
              <Upload className="w-3.5 h-3.5" />
              选文件
            </button>
            <button
              onClick={handleImport}
              disabled={importing}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent text-xs font-mono hover:bg-cyber-accent/20 disabled:opacity-50"
            >
              {importing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              导入
            </button>
          </div>
          <input
            ref={importFileRef}
            type="file"
            accept=".enc,.json,.bin"
            onChange={handleImportFile}
            className="hidden"
          />
        </div>
      </div>

      {/* Toast 提示 */}
      {toast && (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs ${
          toast.type === 'success'
            ? 'bg-green-500/10 border border-green-500/30 text-green-400'
            : toast.type === 'error'
            ? 'bg-red-500/10 border border-red-500/30 text-red-400'
            : 'bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent'
        }`}>
          {toast.type === 'success' ? <Check className="w-3.5 h-3.5" /> : toast.type === 'error' ? <X className="w-3.5 h-3.5" /> : <Info className="w-3.5 h-3.5" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* 查看明文弹窗 */}
      {viewModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={closeViewModal}>
          <div
            className="w-full max-w-sm bg-cyber-panel border border-cyber-accent/30 rounded-2xl p-4 space-y-3"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyber-accent/10 border border-cyber-accent/30">
                <Key className="w-4 h-4 text-cyber-accent" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-cyber-text">查看凭证明文</h3>
                <p className="text-[11px] text-gray-500">{viewModal.name}</p>
              </div>
              <button onClick={closeViewModal} className="text-gray-500 hover:text-gray-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            {!viewModal.confirmed ? (
              <>
                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30">
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-300 leading-relaxed">
                    明文仅在屏幕上显示 3 秒后自动隐藏。请确保周围无人且无屏幕录制。继续？
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={confirmViewPlaintext}
                    disabled={viewModal.loading}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-mono hover:bg-red-500/30 disabled:opacity-50"
                  >
                    {viewModal.loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
                    确认查看
                  </button>
                  <button
                    onClick={closeViewModal}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-gray-400 text-xs font-mono hover:text-gray-200"
                  >
                    <X className="w-3.5 h-3.5" />
                    取消
                  </button>
                </div>
              </>
            ) : viewModal.loading ? (
              <div className="flex items-center justify-center py-4 text-xs text-gray-500 font-mono">
                <RefreshCw className="w-3.5 h-3.5 animate-spin mr-2" />
                正在获取明文…
              </div>
            ) : (
              <>
                <div className="p-2.5 rounded-xl bg-cyber-bg border border-cyber-border">
                  <p className="text-[10px] font-mono text-gray-500 mb-1">明文值</p>
                  <p className="text-xs font-mono text-cyber-accent break-all min-h-[1.5em]">
                    {viewModal.value || '（空）'}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-gray-500">将在 {viewModal.remaining} 秒后自动隐藏</span>
                  <button
                    onClick={closeViewModal}
                    className="text-cyber-accent hover:underline"
                  >
                    立即关闭
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 轮换弹窗 */}
      {rotateModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => !rotateModal.saving && setRotateModal({ open: false, key: '', name: '', value: '', show: false, saving: false })}>
          <div
            className="w-full max-w-sm bg-cyber-panel border border-cyber-accent2/30 rounded-2xl p-4 space-y-3"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyber-accent2/10 border border-cyber-accent2/30">
                <RefreshCw className="w-4 h-4 text-cyber-accent2" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-cyber-text">轮换凭证</h3>
                <p className="text-[11px] text-gray-500">{rotateModal.name}</p>
              </div>
              <button
                onClick={() => !rotateModal.saving && setRotateModal({ open: false, key: '', name: '', value: '', show: false, saving: false })}
                className="text-gray-500 hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="text-xs font-mono text-gray-400 block mb-1.5">新凭证值</label>
              <div className="relative">
                <input
                  type={rotateModal.show ? 'text' : 'password'}
                  value={rotateModal.value}
                  onChange={e => setRotateModal(m => ({ ...m, value: e.target.value }))}
                  placeholder="输入新的凭证值"
                  className="w-full px-3 py-2 bg-cyber-bg/80 border border-cyber-border rounded-xl text-xs font-mono text-gray-200 focus:outline-none focus:border-cyber-accent2/50 pr-10"
                />
                <button
                  onClick={() => setRotateModal(m => ({ ...m, show: !m.show }))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-300"
                >
                  {rotateModal.show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRotate}
                disabled={rotateModal.saving}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-cyber-accent2/20 border border-cyber-accent2/40 text-cyber-accent2 text-xs font-mono hover:bg-cyber-accent2/30 disabled:opacity-50"
              >
                {rotateModal.saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                {rotateModal.saving ? '轮换中' : '确认轮换'}
              </button>
              <button
                onClick={() => setRotateModal({ open: false, key: '', name: '', value: '', show: false, saving: false })}
                disabled={rotateModal.saving}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-gray-400 text-xs font-mono hover:text-gray-200 disabled:opacity-50"
              >
                <X className="w-3.5 h-3.5" />
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
