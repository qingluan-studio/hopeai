import { useState, useRef } from 'react'
import { Play, Copy, Download, RefreshCw, Eye, Code, Smartphone, Sparkles } from 'lucide-react'
import { callLLM, isLLMEnabled } from '@/services/llmService'
import { cn } from '@/lib/utils'

interface HistoryItem {
  id: string
  title: string
  code: string
  timestamp: string
}

const templates: Record<string, string> = {
  landing: '创建一个产品落地页，顶部导航栏（Logo、功能、定价、登录），英雄区域（大标题"重新定义效率"、副标题、邮箱输入框+开始按钮），信任标志（5个公司Logo），功能区域（6个图标+标题+描述），用户评价（3个卡片），CTA区域（立即开始），页脚。使用绿色和白色主题，简洁现代。',
  dashboard: '创建一个数据分析仪表盘，左侧边栏导航（概览、分析、报告、设置），顶部搜索栏+通知+用户头像，主要内容区域：4个统计卡片（总收入、用户数、转化率、活跃度），中间是折线图（近30天趋势），右侧是饼图（用户分布），下面是最近活动表格。深色主题，数据可视化风格。',
  portfolio: '创建设计师个人作品集网站，全屏英雄区域（姓名+职业+简介+社交链接），作品展示区（网格布局，6个项目，悬停显示项目信息），关于我区域（头像+技能标签+经历时间线），联系区域（表单+邮箱+社交媒体）。黑白极简风格，大量留白，优雅排版。',
  ecommerce: '创建一个电商产品页面，顶部导航（分类、搜索、购物车、用户），面包屑导航，产品展示区（左侧大图+缩略图，右侧标题、价格、评分、颜色选择、尺码选择、数量、加入购物车按钮），产品详情（标签页：描述、规格、评价），推荐商品（横向滚动）。白色背景，橙色强调色。',
  blog: '创建一个技术博客首页，顶部导航（Logo、分类、搜索、关于），英雄文章（大图+标题+摘要+阅读更多），文章列表（3列网格，每篇有封面图、分类、标题、摘要、作者、日期、阅读时间），侧边栏（热门标签、关于作者、订阅表单），页脚。浅色主题，阅读友好排版。',
  saas: '创建一个SaaS产品首页，顶部导航（产品、解决方案、定价、资源、登录），英雄区域（动画标题+描述+视频占位+CTA），Logo墙（客户信任），功能区域（3个大卡片，每个有图标、标题、描述、截图），集成展示（支持的第三方工具Logo），定价（3个方案，中间高亮），FAQ手风琴，CTA，页脚。紫色渐变主题。',
}

export default function BuilderPage() {
  const [prompt, setPrompt] = useState(templates.saas)
  const [currentCode, setCurrentCode] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'mobile'>('preview')
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [stepText, setStepText] = useState('')
  const [showExport, setShowExport] = useState(false)
  const [framework, setFramework] = useState('html')
  const [theme, setTheme] = useState('dark')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const stepTexts = [
    '分析需求...',
    '设计布局结构...',
    '生成 HTML 代码...',
    '添加 CSS 样式...',
    '编写 JavaScript 交互...',
    '优化响应式适配...',
    '完成！',
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setCurrentCode('')

    const useLLM = isLLMEnabled()
    let stepIndex = 0
    
    const stepInterval = setInterval(() => {
      if (stepIndex < stepTexts.length) {
        setStepText(stepTexts[stepIndex])
        stepIndex++
      }
    }, 400)

    try {
      let code = ''

      if (useLLM) {
        const systemPrompt = `你是一个资深前端开发专家，专门根据用户描述生成高质量、可直接运行的完整HTML网站代码。

要求：
1. 生成完整的单文件HTML（包含HTML、CSS、JS）
2. 使用现代CSS（Flex/Grid布局、渐变、动画）
3. 响应式设计，移动端适配
4. 代码整洁、结构清晰、有注释
5. 视觉效果精美，有设计感
6. 加入交互动效（hover、滚动动画等）
7. 使用Tailwind CSS风格的类名，内嵌style标签

直接输出HTML代码，不要任何解释或markdown格式。`

        const userPrompt = `框架: ${framework}
主题: ${theme}
描述: ${prompt}

请生成完整的HTML代码。`

        const result = await callLLM([
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ], { temperature: 0.7, maxTokens: 8000 })

        code = extractHTML(result)
      } else {
        code = generateMockCode(prompt, theme === 'dark')
        await new Promise(r => setTimeout(r, 2800))
      }

      setCurrentCode(code)
      renderPreview(code)

      const newItem: HistoryItem = {
        id: Date.now().toString(),
        title: prompt.slice(0, 25) + (prompt.length > 25 ? '...' : ''),
        code,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      }
      setHistory(prev => [newItem, ...prev].slice(0, 20))
    } catch (err) {
      console.error('生成失败:', err)
      const fallback = generateMockCode(prompt, theme === 'dark')
      setCurrentCode(fallback)
      renderPreview(fallback)
    } finally {
      clearInterval(stepInterval)
      setIsGenerating(false)
    }
  }

  const extractHTML = (text: string): string => {
    const match = text.match(/<!DOCTYPE html>[\s\S]*?<\/html>/i)
    if (match) return match[0]
    const codeMatch = text.match(/```html\s*([\s\S]*?)\s*```/i)
    if (codeMatch) return codeMatch[1]
    return text
  }

  const renderPreview = (code: string) => {
    if (iframeRef.current) {
      const blob = new Blob([code], { type: 'text/html' })
      iframeRef.current.src = URL.createObjectURL(blob)
    }
  }

  const handleCopy = () => {
    if (currentCode) {
      navigator.clipboard.writeText(currentCode)
    }
  }

  const handleExport = (type: string) => {
    if (!currentCode) return
    
    if (type === 'html') {
      const blob = new Blob([currentCode], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'index.html'
      a.click()
      URL.revokeObjectURL(url)
    } else if (type === 'zip') {
      alert('ZIP 导出需要后端支持，当前演示版本仅支持 HTML 导出')
    } else {
      alert(type + ' 部署需要配置 API Token，当前为演示版本')
    }
    setShowExport(false)
  }

  const loadHistory = (item: HistoryItem) => {
    setCurrentCode(item.code)
    renderPreview(item.code)
  }

  return (
    <div className="flex flex-col md:flex-row h-full min-h-0">
      {/* 左侧输入面板 */}
      <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-cyber-border bg-cyber-panel/50 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-cyber-border">
          <h2 className="text-sm font-bold text-cyber-accent font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            HopeBuilder
          </h2>
          <p className="text-xs text-gray-500 mt-1">AI 网站生成器 · 类似 v0.app</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="text-xs text-gray-400 font-mono mb-2 block">📝 描述你想要的网站</label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="描述你想要的网站..."
              className="w-full h-28 p-3 rounded-xl bg-cyber-bg border border-cyber-border text-sm text-cyber-text resize-none outline-none focus:border-cyber-accent/50 transition-colors font-sans"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 font-mono mb-2 block">⚡ 快捷模板</label>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries({
                landing: '🚀 落地页',
                dashboard: '📊 数据面板',
                portfolio: '🎨 作品集',
                ecommerce: '🛒 电商页面',
                blog: '📝 博客',
                saas: '💼 SaaS',
              }).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setPrompt(templates[key])}
                  className="px-2.5 py-1.5 text-xs rounded-full bg-cyber-bg border border-cyber-border text-gray-400 hover:border-cyber-accent/50 hover:text-cyber-accent transition-all"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-400 font-mono block">⚙️ 设置</label>
            
            <div className="flex items-center justify-between py-2 border-b border-cyber-border/50">
              <span className="text-xs text-gray-300">框架</span>
              <select
                value={framework}
                onChange={e => setFramework(e.target.value)}
                className="bg-cyber-bg border border-cyber-border text-xs text-cyber-text px-2 py-1 rounded-md outline-none"
              >
                <option value="html">HTML + CSS + JS</option>
                <option value="react">React + Tailwind</option>
                <option value="vue">Vue 3</option>
              </select>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-cyber-border/50">
              <span className="text-xs text-gray-300">主题色</span>
              <select
                value={theme}
                onChange={e => setTheme(e.target.value)}
                className="bg-cyber-bg border border-cyber-border text-xs text-cyber-text px-2 py-1 rounded-md outline-none"
              >
                <option value="dark">🌙 深色</option>
                <option value="light">☀️ 浅色</option>
                <option value="auto">🔄 自动</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className={cn(
              'w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2',
              isGenerating
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.98]'
            )}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                生成网站
              </>
            )}
          </button>

          {history.length > 0 && (
            <div>
              <label className="text-xs text-gray-400 font-mono mb-2 block">📜 历史记录</label>
              <div className="space-y-1.5">
                {history.map(item => (
                  <div
                    key={item.id}
                    onClick={() => loadHistory(item)}
                    className="p-2.5 rounded-lg bg-cyber-bg border border-cyber-border/50 hover:border-cyber-accent/30 cursor-pointer transition-all group"
                  >
                    <div className="text-xs text-cyber-text truncate">{item.title}</div>
                    <div className="text-[10px] text-gray-600 mt-0.5">{item.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 右侧预览区 */}
      <div className="flex-1 flex flex-col min-h-0 bg-cyber-bg">
        {/* 工具栏 */}
        <div className="h-12 flex items-center justify-between px-3 border-b border-cyber-border bg-cyber-panel/30 flex-shrink-0">
          <div className="flex items-center gap-1">
            {[
              { id: 'preview', icon: Eye, label: '预览' },
              { id: 'code', icon: Code, label: '代码' },
              { id: 'mobile', icon: Smartphone, label: '手机' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-mono transition-all flex items-center gap-1.5',
                  activeTab === tab.id
                    ? 'bg-cyber-accent/10 text-cyber-accent'
                    : 'text-gray-500 hover:text-gray-300'
                )}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            {currentCode && (
              <>
                <button
                  onClick={() => renderPreview(currentCode)}
                  className="p-1.5 rounded-md hover:bg-white/5 text-gray-500 hover:text-cyber-text transition-colors"
                  title="刷新"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-md hover:bg-white/5 text-gray-500 hover:text-cyber-text transition-colors"
                  title="复制代码"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowExport(true)}
                  className="p-1.5 rounded-md hover:bg-white/5 text-gray-500 hover:text-cyber-text transition-colors"
                  title="导出"
                >
                  <Download className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* 内容区 */}
        <div className="flex-1 relative overflow-hidden">
          {/* 加载状态 */}
          {isGenerating && (
            <div className="absolute inset-0 bg-cyber-bg/90 flex flex-col items-center justify-center z-10 gap-4">
              <div className="w-10 h-10 border-3 border-cyber-border border-t-amber-500 rounded-full animate-spin" style={{ borderWidth: 3 }} />
              <div className="text-sm text-gray-400">AI 正在生成代码...</div>
              <div className="text-xs text-gray-600 text-center font-mono leading-relaxed">
                {stepText}
              </div>
            </div>
          )}

          {/* 空状态 */}
          {!currentCode && !isGenerating && (
            <div className="h-full flex flex-col items-center justify-center text-gray-600">
              <div className="text-5xl mb-4 opacity-50">🏗️</div>
              <h3 className="text-base mb-2">开始构建你的网站</h3>
              <p className="text-xs text-center leading-relaxed">
                在左侧输入描述，点击"生成"即可创建<br />
                支持 HTML、React、Vue 多种格式
              </p>
            </div>
          )}

          {/* 预览 */}
          {currentCode && activeTab === 'preview' && (
            <iframe
              ref={iframeRef}
              className="w-full h-full border-0 bg-white"
              title="preview"
              sandbox="allow-scripts allow-modals"
            />
          )}

          {/* 手机预览 */}
          {currentCode && activeTab === 'mobile' && (
            <div className="w-full h-full flex items-start justify-center pt-4 overflow-auto">
              <div className="w-[375px] h-[680px] border-2 border-cyber-border rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/50">
                <div className="h-7 bg-black flex items-center justify-center">
                  <div className="w-16 h-1.5 bg-gray-800 rounded-full" />
                </div>
                <iframe
                  ref={el => {
                    if (el) {
                      const blob = new Blob([currentCode], { type: 'text/html' })
                      el.src = URL.createObjectURL(blob)
                    }
                  }}
                  className="w-full h-[calc(100%-28px)] border-0 bg-white"
                  title="mobile preview"
                  sandbox="allow-scripts allow-modals"
                />
              </div>
            </div>
          )}

          {/* 代码视图 */}
          {currentCode && activeTab === 'code' && (
            <pre className="w-full h-full overflow-auto p-4 text-xs font-mono text-gray-300 leading-relaxed bg-[#0d1117]">
              <code>{highlightCode(currentCode)}</code>
            </pre>
          )}
        </div>
      </div>

      {/* 导出弹窗 */}
      {showExport && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowExport(false)}
        >
          <div 
            className="bg-cyber-panel border border-cyber-border rounded-2xl w-full max-w-md overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-cyber-border flex items-center justify-between">
              <h3 className="text-sm font-bold">📤 导出代码</h3>
              <button
                onClick={() => setShowExport(false)}
                className="text-gray-500 hover:text-cyber-text text-xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-4 space-y-2">
              {[
                { type: 'html', icon: '📄', title: '导出 HTML 文件', desc: '单个 .html 文件，可直接在浏览器打开' },
                { type: 'zip', icon: '📦', title: '导出 ZIP 包', desc: '包含 HTML、CSS、JS 分离文件' },
                { type: 'github', icon: '🐙', title: '推送到 GitHub', desc: '一键部署到 GitHub Pages（需配置 Token）' },
                { type: 'vercel', icon: '▲', title: '部署到 Vercel', desc: '一键部署，获得在线链接（需配置 Token）' },
              ].map(opt => (
                <div
                  key={opt.type}
                  onClick={() => handleExport(opt.type)}
                  className="p-3.5 rounded-xl bg-cyber-bg border border-cyber-border/50 hover:border-amber-500/30 cursor-pointer transition-all"
                >
                  <div className="text-sm font-semibold text-cyber-text flex items-center gap-2">
                    <span>{opt.icon}</span>
                    {opt.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 ml-6">{opt.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function highlightCode(code: string): string {
  return code
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/(&lt;\/?)([\w-]+)/g, '<span style="color:#7ee787">$1$2</span>')
    .replace(/([\w-]+)=/g, '<span style="color:#79c0ff">$1</span>=')
    .replace(/"([^"]*)"/g, '<span style="color:#a5d6ff">"$1"</span>')
    .replace(/(\/\/.*$)/gm, '<span style="color:#8b949e">$1</span>')
    .replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color:#8b949e">$1</span>')
}

function generateMockCode(prompt: string, isDark: boolean): string {
  const p = prompt.toLowerCase()
  
  if (p.includes('仪表盘') || p.includes('dashboard') || p.includes('数据')) {
    return generateDashboard(isDark)
  } else if (p.includes('作品') || p.includes('portfolio')) {
    return generatePortfolio(isDark)
  } else if (p.includes('电商') || p.includes('产品页') || p.includes('购物')) {
    return generateEcommerce(isDark)
  } else if (p.includes('博客') || p.includes('blog')) {
    return generateBlog(isDark)
  } else if (p.includes('落地') || p.includes('landing')) {
    return generateLanding(isDark)
  } else {
    return generateTechCompany(isDark)
  }
}

function generateTechCompany(isDark: boolean) {
  const bg = isDark ? '#0a0f1c' : '#ffffff'
  const text = isDark ? '#e2e8f0' : '#1e293b'
  const card = isDark ? '#1e293b' : '#f8fafc'
  const border = isDark ? '#334155' : '#e2e8f0'

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>未来科技 - 官网</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', sans-serif;
  background: ${bg};
  color: ${text};
  line-height: 1.6;
}
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
.nav {
  position: fixed; top: 0; left: 0; right: 0;
  background: ${isDark ? 'rgba(10,15,28,0.9)' : 'rgba(255,255,255,0.9)'};
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${border};
  z-index: 100;
}
.nav-inner {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; max-width: 1200px; margin: 0 auto;
}
.logo { font-size: 22px; font-weight: 700; background: linear-gradient(135deg, #0ea5e9, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.nav-links { display: flex; gap: 32px; }
.nav-links a { color: ${text}; text-decoration: none; font-size: 14px; opacity: 0.7; transition: opacity 0.2s; }
.nav-links a:hover { opacity: 1; }
.nav-cta {
  padding: 8px 20px; border-radius: 8px;
  background: linear-gradient(135deg, #0ea5e9, #8b5cf6);
  color: white; text-decoration: none; font-size: 14px; font-weight: 600;
}
.hero {
  padding: 160px 20px 100px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.hero::before {
  content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
  background: radial-gradient(circle at 30% 50%, rgba(14,165,233,0.08) 0%, transparent 50%),
              radial-gradient(circle at 70% 50%, rgba(139,92,246,0.08) 0%, transparent 50%);
  pointer-events: none;
}
.hero h1 {
  font-size: clamp(36px, 6vw, 64px);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #0ea5e9, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient 8s ease infinite;
  background-size: 200% 200%;
}
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.hero p { font-size: 18px; opacity: 0.7; max-width: 600px; margin: 0 auto 32px; }
.hero-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
.btn-primary {
  padding: 14px 32px; border-radius: 12px;
  background: linear-gradient(135deg, #0ea5e9, #8b5cf6);
  color: white; text-decoration: none; font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 40px rgba(14,165,233,0.3); }
.btn-secondary {
  padding: 14px 32px; border-radius: 12px;
  border: 1px solid ${border}; color: ${text}; text-decoration: none; font-weight: 600;
  transition: all 0.2s;
}
.btn-secondary:hover { background: ${card}; }
.features { padding: 80px 20px; }
.features h2 { text-align: center; font-size: 36px; margin-bottom: 16px; }
.features-sub { text-align: center; opacity: 0.6; margin-bottom: 60px; }
.feature-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px; max-width: 1000px; margin: 0 auto;
}
.feature-card {
  background: ${card}; border: 1px solid ${border}; border-radius: 16px;
  padding: 32px; transition: all 0.3s;
}
.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(14,165,233,0.1);
  border-color: rgba(14,165,233,0.3);
}
.feature-icon {
  width: 48px; height: 48px; border-radius: 12px;
  background: linear-gradient(135deg, #0ea5e9, #8b5cf6);
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; margin-bottom: 20px;
}
.feature-card h3 { font-size: 20px; margin-bottom: 10px; }
.feature-card p { opacity: 0.6; font-size: 14px; }
.pricing { padding: 80px 20px; background: ${isDark ? '#0f172a' : '#f8fafc'}; }
.pricing h2 { text-align: center; font-size: 36px; margin-bottom: 16px; }
.pricing-sub { text-align: center; opacity: 0.6; margin-bottom: 60px; }
.pricing-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px; max-width: 900px; margin: 0 auto;
}
.pricing-card {
  background: ${card}; border: 1px solid ${border}; border-radius: 20px;
  padding: 40px 32px; text-align: center; transition: all 0.3s;
}
.pricing-card.popular {
  border-color: #0ea5e9;
  box-shadow: 0 0 40px rgba(14,165,233,0.1);
  transform: scale(1.02);
}
.popular-badge {
  display: inline-block; padding: 4px 16px; border-radius: 20px;
  background: linear-gradient(135deg, #0ea5e9, #8b5cf6);
  color: white; font-size: 12px; font-weight: 600; margin-bottom: 20px;
}
.pricing-card h3 { font-size: 20px; margin-bottom: 8px; }
.price { font-size: 48px; font-weight: 800; margin: 20px 0; }
.price span { font-size: 16px; opacity: 0.5; font-weight: 400; }
.pricing-card ul { list-style: none; text-align: left; margin: 24px 0; }
.pricing-card ul li { padding: 8px 0; font-size: 14px; opacity: 0.7; }
.pricing-card ul li::before { content: '✓ '; color: #10b981; font-weight: 700; }
.pricing-btn {
  display: block; width: 100%; padding: 14px; border-radius: 10px;
  background: ${card}; border: 1px solid ${border}; color: ${text};
  text-decoration: none; font-weight: 600; transition: all 0.2s;
}
.pricing-card.popular .pricing-btn {
  background: linear-gradient(135deg, #0ea5e9, #8b5cf6);
  color: white; border: none;
}
.footer {
  padding: 60px 20px 30px;
  border-top: 1px solid ${border};
  text-align: center;
}
.footer p { opacity: 0.4; font-size: 13px; }
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
@media (max-width: 768px) {
  .nav-links { display: none; }
  .hero { padding: 120px 20px 60px; }
  .feature-grid, .pricing-grid { grid-template-columns: 1fr; }
}
</style>
</head>
<body>
<nav class="nav">
  <div class="nav-inner">
    <div class="logo">◆ FutureTech</div>
    <div class="nav-links">
      <a href="#">首页</a><a href="#">产品</a><a href="#">解决方案</a><a href="#">关于我们</a>
    </div>
    <a href="#" class="nav-cta">开始使用</a>
  </div>
</nav>
<section class="hero">
  <h1>未来已来</h1>
  <p>用 AI 驱动的智能解决方案，重新定义企业效率。让技术成为您的核心竞争力。</p>
  <div class="hero-btns">
    <a href="#" class="btn-primary">免费开始 →</a>
    <a href="#" class="btn-secondary">观看演示</a>
  </div>
</section>
<section class="features">
  <h2>为什么选择我们</h2>
  <p class="features-sub">三大核心优势，助力您的业务腾飞</p>
  <div class="feature-grid">
    <div class="feature-card">
      <div class="feature-icon">🤖</div>
      <h3>AI 驱动</h3>
      <p>基于最先进的深度学习模型，自动理解您的需求并提供精准解决方案，持续学习优化。</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon">🔒</div>
      <h3>安全可靠</h3>
      <p>企业级安全架构，端到端加密，符合 GDPR、SOC2 等国际安全标准，数据安全有保障。</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon">⚡</div>
      <h3>极速响应</h3>
      <p>毫秒级响应速度，99.99% 服务可用性，全球 CDN 加速，让体验流畅无阻。</p>
    </div>
  </div>
</section>
<section class="pricing">
  <h2>简单透明的定价</h2>
  <p class="pricing-sub">选择适合您的方案，随时升级或降级</p>
  <div class="pricing-grid">
    <div class="pricing-card">
      <h3>基础版</h3>
      <div class="price">¥0<span>/月</span></div>
      <ul><li>每月 1000 次 API 调用</li><li>基础数据分析</li><li>社区支持</li><li>标准响应速度</li></ul>
      <a href="#" class="pricing-btn">免费开始</a>
    </div>
    <div class="pricing-card popular">
      <div class="popular-badge">最受欢迎</div>
      <h3>专业版</h3>
      <div class="price">¥99<span>/月</span></div>
      <ul><li>每月 10 万次 API 调用</li><li>高级数据分析 + 可视化</li><li>优先技术支持</li><li>极速响应 + SLA 保障</li><li>自定义模型训练</li></ul>
      <a href="#" class="pricing-btn">立即升级</a>
    </div>
    <div class="pricing-card">
      <h3>企业版</h3>
      <div class="price">定制<span></span></div>
      <ul><li>无限 API 调用</li><li>私有化部署</li><li>专属客户经理</li><li>7×24 技术支持</li><li>SSO + 审计日志</li></ul>
      <a href="#" class="pricing-btn">联系销售</a>
    </div>
  </div>
</section>
<footer class="footer">
  <p>© 2026 FutureTech. 保留所有权利。由 HopeBuilder AI 生成。</p>
</footer>
</body>
</html>`
}

function generateDashboard(isDark: boolean) {
  const bg = isDark ? '#0a0f1c' : '#f1f5f9'
  const card = isDark ? '#1e293b' : '#ffffff'
  const text = isDark ? '#e2e8f0' : '#1e293b'
  const border = isDark ? '#334155' : '#e2e8f0'

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>数据仪表盘</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, sans-serif; background: ${bg}; color: ${text}; }
.dashboard { display: flex; min-height: 100vh; }
.sidebar { width: 240px; background: ${card}; border-right: 1px solid ${border}; padding: 24px 16px; }
.sidebar-logo { font-size: 20px; font-weight: 700; margin-bottom: 32px; padding: 0 8px; }
.nav-item { padding: 12px 16px; border-radius: 8px; margin-bottom: 4px; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 10px; }
.nav-item:hover, .nav-item.active { background: ${isDark ? 'rgba(14,165,233,0.1)' : '#e0f2fe'}; color: #0ea5e9; }
.main { flex: 1; padding: 24px; overflow: auto; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.header h1 { font-size: 24px; }
.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
.stat-card { background: ${card}; border: 1px solid ${border}; border-radius: 12px; padding: 20px; }
.stat-label { font-size: 12px; opacity: 0.5; margin-bottom: 8px; }
.stat-value { font-size: 28px; font-weight: 700; }
.stat-change { font-size: 12px; margin-top: 8px; }
.stat-change.up { color: #10b981; }
.stat-change.down { color: #ef4444; }
.charts { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-bottom: 24px; }
.chart-card { background: ${card}; border: 1px solid ${border}; border-radius: 12px; padding: 20px; }
.chart-card h3 { font-size: 14px; margin-bottom: 16px; opacity: 0.7; }
.chart-placeholder { height: 200px; background: ${isDark ? '#0f172a' : '#f8fafc'}; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #64748b; font-size: 13px; }
.table-card { background: ${card}; border: 1px solid ${border}; border-radius: 12px; padding: 20px; }
table { width: 100%; border-collapse: collapse; font-size: 13px; }
th, td { padding: 12px; text-align: left; border-bottom: 1px solid ${border}; }
th { opacity: 0.5; font-weight: 500; }
.status { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
.status.success { background: rgba(16,185,129,0.1); color: #10b981; }
.status.pending { background: rgba(245,158,11,0.1); color: #f59e0b; }
@media (max-width: 768px) { .sidebar { display: none; } .charts { grid-template-columns: 1fr; } }
</style>
</head>
<body>
<div class="dashboard">
  <aside class="sidebar">
    <div class="sidebar-logo">📊 DataView</div>
    <div class="nav-item active">🏠 概览</div>
    <div class="nav-item">📈 分析</div>
    <div class="nav-item">📄 报告</div>
    <div class="nav-item">⚙️ 设置</div>
  </aside>
  <main class="main">
    <div class="header"><h1>仪表盘</h1><span style="opacity:0.5;font-size:13px;">2026年7月6日</span></div>
    <div class="stats">
      <div class="stat-card"><div class="stat-label">总收入</div><div class="stat-value">¥128,450</div><div class="stat-change up">↑ 12.5% 较上月</div></div>
      <div class="stat-card"><div class="stat-label">活跃用户</div><div class="stat-value">8,234</div><div class="stat-change up">↑ 8.2% 较上月</div></div>
      <div class="stat-card"><div class="stat-label">转化率</div><div class="stat-value">3.24%</div><div class="stat-change down">↓ 0.5% 较上月</div></div>
      <div class="stat-card"><div class="stat-label">活跃度</div><div class="stat-value">94.2%</div><div class="stat-change up">↑ 2.1% 较上月</div></div>
    </div>
    <div class="charts">
      <div class="chart-card"><h3>近30天趋势</h3><div class="chart-placeholder">📈 折线图占位</div></div>
      <div class="chart-card"><h3>用户分布</h3><div class="chart-placeholder">🥧 饼图占位</div></div>
    </div>
    <div class="table-card">
      <h3 style="font-size:14px;margin-bottom:16px;opacity:0.7;">最近活动</h3>
      <table>
        <tr><th>用户</th><th>操作</th><th>时间</th><th>状态</th></tr>
        <tr><td>张三</td><td>升级专业版</td><td>2分钟前</td><td><span class="status success">成功</span></td></tr>
        <tr><td>李四</td><td>提交工单</td><td>15分钟前</td><td><span class="status pending">处理中</span></td></tr>
        <tr><td>王五</td><td>导出报告</td><td>1小时前</td><td><span class="status success">成功</span></td></tr>
      </table>
    </div>
  </main>
</div>
</body>
</html>`
}

function generatePortfolio(isDark: boolean) {
  return generateTechCompany(isDark).replace(/FutureTech/g, 'Designer').replace(/未来已来/g, '创意无限').replace(/科技公司/g, '设计师')
}

function generateEcommerce(isDark: boolean) {
  return generateTechCompany(isDark).replace(/FutureTech/g, 'ShopMall').replace(/未来已来/g, '精选好物').replace(/科技公司/g, '电商平台')
}

function generateBlog(isDark: boolean) {
  return generateTechCompany(isDark).replace(/FutureTech/g, 'TechBlog').replace(/未来已来/g, '探索技术的边界').replace(/科技公司/g, '技术博客')
}

function generateLanding(isDark: boolean) {
  return generateTechCompany(isDark).replace(/未来已来/g, '重新定义效率').replace(/科技公司/g, '产品落地页')
}
