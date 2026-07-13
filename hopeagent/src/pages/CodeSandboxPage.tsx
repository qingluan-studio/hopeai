import { useState, useRef, useEffect } from 'react'
import {
  Code2,
  Play,
  Copy,
  Download,
  Upload,
  Trash2,
  Save,
  Settings,
  Plus,
  FolderOpen,
  Sun,
  Moon,
  Terminal,
  Sparkles,
  ChevronDown,
  FileJson,
  FileText,
  RotateCcw,
  Type,
  AlignLeft,
  Check,
  Folder,
  FileCode,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// 支持的语言
const languages = [
  { id: 'javascript', label: 'JavaScript', ext: '.js' },
  { id: 'typescript', label: 'TypeScript', ext: '.ts' },
  { id: 'python', label: 'Python', ext: '.py' },
  { id: 'html', label: 'HTML', ext: '.html' },
  { id: 'css', label: 'CSS', ext: '.css' },
  { id: 'json', label: 'JSON', ext: '.json' },
  { id: 'markdown', label: 'Markdown', ext: '.md' },
]

// 代码模板
const codeTemplates: Record<string, { name: string; code: string; lang: string }[]> = {
  javascript: [
    {
      name: 'Hello World',
      lang: 'javascript',
      code: `// Hello World 示例
console.log('Hello, World!');

function greet(name) {
  return \`Hello, \${name}!\`;
}

const message = greet('HopeAgent');
console.log(message);
console.log('欢迎使用代码沙箱！');`,
    },
    {
      name: '排序算法',
      lang: 'javascript',
      code: `// 快速排序算法
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  
  return [...quickSort(left), ...middle, ...quickSort(right)];
}

// 测试
const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log('原始数组:', numbers);
console.log('排序后:', quickSort(numbers));`,
    },
    {
      name: 'HTTP 请求',
      lang: 'javascript',
      code: `// HTTP 请求示例 (fetch)
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('请求失败:', error.message);
    throw error;
  }
}

// 使用示例
// fetchData('https://api.example.com/data')
//   .then(data => console.log(data))
//   .catch(err => console.error(err));

console.log('HTTP 请求工具已就绪');`,
    },
    {
      name: '数据处理',
      lang: 'javascript',
      code: `// 数据处理示例
const data = [
  { name: 'Alice', age: 25, score: 90 },
  { name: 'Bob', age: 30, score: 85 },
  { name: 'Charlie', age: 35, score: 95 },
  { name: 'Diana', age: 28, score: 88 },
];

// 计算平均分
const avgScore = data.reduce((sum, item) => sum + item.score, 0) / data.length;
console.log('平均分:', avgScore.toFixed(1));

// 筛选高分
const topStudents = data.filter(item => item.score >= 90);
console.log('高分学生:', topStudents.map(s => s.name).join(', '));

// 按年龄排序
const sortedByAge = [...data].sort((a, b) => a.age - b.age);
console.log('按年龄排序:', sortedByAge.map(s => \`\${s.name}(\${s.age})\`).join(', '));`,
    },
  ],
  python: [
    {
      name: 'Hello World',
      lang: 'python',
      code: `# Python Hello World
print("Hello, World!")

def greet(name):
    return f"Hello, {name}!"

message = greet("HopeAgent")
print(message)
print("欢迎使用代码沙箱！")`,
    },
    {
      name: '排序算法',
      lang: 'python',
      code: `# 快速排序算法
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quick_sort(left) + middle + quick_sort(right)

# 测试
numbers = [64, 34, 25, 12, 22, 11, 90]
print("原始数组:", numbers)
print("排序后:", quick_sort(numbers))`,
    },
  ],
  html: [
    {
      name: '基础页面',
      lang: 'html',
      code: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World</title>
    <style>
        body {
            font-family: -apple-system, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <h1>👋 Hello, World!</h1>
    <p>欢迎使用 HopeAgent 代码沙箱</p>
</body>
</html>`,
    },
  ],
  json: [
    {
      name: '配置示例',
      lang: 'json',
      code: `{
  "app": "HopeAgent Pro",
  "version": "4.0.0",
  "features": {
    "chat": true,
    "knowledge": true,
    "agents": true,
    "workflow": true,
    "analytics": true
  },
  "theme": {
    "primary": "#00ff88",
    "secondary": "#00d4ff",
    "background": "#0a0e14"
  },
  "limits": {
    "maxTokens": 8192,
    "temperature": 0.7,
    "maxConversations": 50
  },
  "modules": [
    "dashboard",
    "chat",
    "knowledge",
    "agents",
    "workflow",
    "analytics"
  ]
}`,
    },
  ],
}

// 代码片段库
const codeSnippets = [
  { id: '1', name: '数组去重', lang: 'javascript', code: 'const unique = arr => [...new Set(arr)];' },
  { id: '2', name: '防抖函数', lang: 'javascript', code: 'function debounce(fn, delay) { let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); }; }' },
  { id: '3', name: '节流函数', lang: 'javascript', code: 'function throttle(fn, delay) { let last = 0; return (...args) => { const now = Date.now(); if (now - last >= delay) { last = now; fn(...args); } }; }' },
  { id: '4', name: '深拷贝', lang: 'javascript', code: 'const deepClone = obj => JSON.parse(JSON.stringify(obj));' },
  { id: '5', name: '随机字符串', lang: 'javascript', code: 'const randomStr = len => Math.random().toString(36).substring(2, len + 2);' },
  { id: '6', name: '时间格式化', lang: 'javascript', code: "const formatDate = (date, fmt = 'YYYY-MM-DD HH:mm:ss') => { /* 实现 */ };" },
  { id: '7', name: 'URL 参数解析', lang: 'javascript', code: "const parseQuery = url => Object.fromEntries(new URLSearchParams(url.split('?')[1] || ''));" },
  { id: '8', name: 'Cookie 操作', lang: 'javascript', code: "const setCookie = (k, v, days) => { /* 实现 */ }; const getCookie = k => document.cookie.match('(^|;)\\\\s*' + k + '\\\\s*=\\\\s*([^;]*)')?.[2];" },
  { id: '9', name: '类型判断', lang: 'javascript', code: "const getType = val => Object.prototype.toString.call(val).slice(8, -1).toLowerCase();" },
  { id: '10', name: '金额格式化', lang: 'javascript', code: "const formatMoney = num => num.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' });" },
  { id: '11', name: '文件大小格式化', lang: 'javascript', code: "const formatSize = bytes => { const units = ['B', 'KB', 'MB', 'GB']; let i = 0; while (bytes >= 1024 && i < units.length - 1) { bytes /= 1024; i++; } return bytes.toFixed(1) + units[i]; };" },
  { id: '12', name: '颜色 Hex 转 RGB', lang: 'javascript', code: "const hexToRgb = hex => { const r = parseInt(hex.slice(1, 3), 16); const g = parseInt(hex.slice(3, 5), 16); const b = parseInt(hex.slice(5, 7), 16); return { r, g, b }; };" },
  { id: '13', name: '生成 UUID', lang: 'javascript', code: "const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16); });" },
  { id: '14', name: '对象属性过滤', lang: 'javascript', code: "const pick = (obj, keys) => Object.fromEntries(Object.entries(obj).filter(([k]) => keys.includes(k)));" },
  { id: '15', name: '列表转树形', lang: 'javascript', code: "const listToTree = (list, idKey = 'id', parentKey = 'parentId') => { /* 实现 */ };" },
  { id: '16', name: '数组分组', lang: 'javascript', code: "const groupBy = (arr, key) => arr.reduce((acc, item) => { (acc[item[key]] = acc[item[key]] || []).push(item); return acc; }, {});" },
  { id: '17', name: '数字补零', lang: 'javascript', code: "const padZero = (num, len = 2) => String(num).padStart(len, '0');" },
  { id: '18', name: '数组交集', lang: 'javascript', code: "const intersection = (a, b) => a.filter(x => b.includes(x));" },
  { id: '19', name: '数组并集', lang: 'javascript', code: "const union = (a, b) => [...new Set([...a, ...b])];" },
  { id: '20', name: '数组差集', lang: 'javascript', code: "const difference = (a, b) => a.filter(x => !b.includes(x));" },
]

// 主题配置
const themes = {
  cyber: {
    name: 'Cyber',
    bg: '#0a0e14',
    text: '#e6edf3',
    comment: '#8b949e',
    keyword: '#ff7b72',
    string: '#a5d6ff',
    number: '#79c0ff',
    function: '#d2a8ff',
    variable: '#ffa657',
  },
  dark: {
    name: '深色',
    bg: '#1e1e1e',
    text: '#d4d4d4',
    comment: '#6a9955',
    keyword: '#569cd6',
    string: '#ce9178',
    number: '#b5cea8',
    function: '#dcdcaa',
    variable: '#9cdcfe',
  },
  light: {
    name: '浅色',
    bg: '#ffffff',
    text: '#24292f',
    comment: '#6e7781',
    keyword: '#cf222e',
    string: '#0a3069',
    number: '#0550ae',
    function: '#8250df',
    variable: '#953800',
  },
}

export default function CodeSandboxPage() {
  const [code, setCode] = useState(codeTemplates.javascript[0].code)
  const [language, setLanguage] = useState('javascript')
  const [theme, setTheme] = useState<keyof typeof themes>('cyber')
  const [fontSize, setFontSize] = useState(14)
  const [wordWrap, setWordWrap] = useState(true)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [showTemplateMenu, setShowTemplateMenu] = useState(false)
  const [showSnippets, setShowSnippets] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'editor' | 'snippets'>('editor')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const currentTheme = themes[theme]

  // 运行代码
  const runCode = () => {
    setIsRunning(true)
    setOutput('')

    if (language === 'javascript' || language === 'typescript') {
      const logs: string[] = []
      const originalLog = console.log
      const originalError = console.error
      const originalWarn = console.warn

      console.log = (...args) => {
        logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '))
        originalLog.apply(console, args)
      }
      console.error = (...args) => {
        logs.push('[ERROR] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '))
        originalError.apply(console, args)
      }
      console.warn = (...args) => {
        logs.push('[WARN] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '))
        originalWarn.apply(console, args)
      }

      try {
        // 使用 eval 执行 JS 代码
        const result = eval(code)
        if (result !== undefined) {
          logs.push('返回值: ' + (typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)))
        }
        setOutput(logs.join('\n'))
      } catch (err: any) {
        setOutput(logs.join('\n') + '\n\n[错误] ' + err.message)
      } finally {
        console.log = originalLog
        console.error = originalError
        console.warn = originalWarn
        setIsRunning(false)
      }
    } else if (language === 'json') {
      try {
        const parsed = JSON.parse(code)
        setOutput('✓ JSON 格式正确\n\n格式化后的 JSON:\n' + JSON.stringify(parsed, null, 2))
      } catch (err: any) {
        setOutput('✗ JSON 格式错误\n\n' + err.message)
      }
      setIsRunning(false)
    } else if (language === 'html') {
      setOutput('HTML 代码预览功能需要在新窗口打开\n\n（演示版本）')
      setIsRunning(false)
    } else {
      setOutput(`当前语言: ${languages.find(l => l.id === language)?.label}\n\n代码运行需要后端支持（演示版本）\n\n提示: JavaScript 代码可直接在浏览器中运行`)
      setIsRunning(false)
    }
  }

  // 复制代码
  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 清空输出
  const clearOutput = () => {
    setOutput('')
  }

  // 代码格式化
  const formatCode = () => {
    if (language === 'json') {
      try {
        const parsed = JSON.parse(code)
        setCode(JSON.stringify(parsed, null, 2))
      } catch (err: any) {
        setOutput('格式化失败: ' + err.message)
      }
    } else {
      // 简易格式化：调整缩进
      setOutput('代码格式化功能需要后端支持（演示版本）')
    }
  }

  // 保存代码片段
  const saveSnippet = () => {
    alert('保存代码片段（演示功能）')
  }

  // 导出代码
  const exportCode = () => {
    const ext = languages.find(l => l.id === language)?.ext || '.txt'
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `code${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  // 加载模板
  const loadTemplate = (template: { name: string; code: string; lang: string }) => {
    setCode(template.code)
    setLanguage(template.lang)
    setShowTemplateMenu(false)
  }

  // 插入代码片段
  const insertSnippet = (snippet: typeof codeSnippets[0]) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart
      const end = textareaRef.current.selectionEnd
      const newCode = code.slice(0, start) + snippet.code + code.slice(end)
      setCode(newCode)
    } else {
      setCode(code + '\n' + snippet.code)
    }
    setShowSnippets(false)
  }

  // Tab 键支持
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newCode = code.slice(0, start) + '  ' + code.slice(end)
      setCode(newCode)
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      }, 0)
    }
  }

  // 行数
  const lineCount = code.split('\n').length

  return (
    <div className="h-full flex flex-col">
      {/* 顶部标题栏 */}
      <div className="border-b border-cyber-border bg-cyber-panel/50 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-cyber-text flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyber-accent" />
              代码沙箱
            </h1>
            <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
              在线编辑 · 即时运行 · 代码片段
            </p>
          </div>

          <div className="flex items-center gap-1">
            {/* 语言选择 */}
            <div className="relative">
              <button
                onClick={() => setShowTemplateMenu(!showTemplateMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-cyber-border/50 text-gray-300 text-xs font-mono hover:border-cyber-accent/30 transition-all"
              >
                <FileCode className="w-3.5 h-3.5 text-cyber-accent" />
                {languages.find(l => l.id === language)?.label}
                <ChevronDown className="w-3 h-3" />
              </button>
              {showTemplateMenu && (
                <div className="absolute right-0 top-full mt-1 bg-cyber-panel border border-cyber-border rounded-lg shadow-xl z-20 overflow-hidden min-w-[180px]">
                  <div className="p-2 border-b border-cyber-border/50">
                    <span className="text-[10px] text-gray-500 font-mono">选择语言</span>
                  </div>
                  {languages.map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => {
                        setLanguage(lang.id)
                        setShowTemplateMenu(false)
                      }}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors',
                        language === lang.id ? 'bg-cyber-accent/10 text-cyber-accent' : 'text-gray-300 hover:bg-white/5'
                      )}
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      {lang.label}
                    </button>
                  ))}
                  <div className="p-2 border-t border-cyber-border/50">
                    <span className="text-[10px] text-gray-500 font-mono">代码模板</span>
                  </div>
                  {Object.entries(codeTemplates).map(([lang, templates]) =>
                    templates.map((tpl, idx) => (
                      <button
                        key={`${lang}-${idx}`}
                        onClick={() => loadTemplate(tpl)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:bg-white/5 hover:text-gray-200 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                        {tpl.name}
                        <span className="text-[10px] text-gray-600 ml-auto">{lang}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* 设置 */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={cn(
                'p-1.5 rounded-lg transition-all',
                showSettings ? 'bg-cyber-accent/20 text-cyber-accent' : 'hover:bg-white/5 text-gray-400 hover:text-cyber-text'
              )}
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* 运行按钮 */}
            <button
              onClick={runCode}
              disabled={isRunning}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all',
                isRunning
                  ? 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400'
                  : 'bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent hover:bg-cyber-accent/20'
              )}
            >
              <Play className="w-3.5 h-3.5" />
              {isRunning ? '运行中' : '运行'}
            </button>
          </div>
        </div>

        {/* 设置面板 */}
        {showSettings && (
          <div className="mt-3 p-3 rounded-xl bg-white/[0.02] border border-cyber-border/50 space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* 主题切换 */}
              <div>
                <label className="text-[11px] text-gray-400 font-mono block mb-1.5">主题</label>
                <div className="flex gap-1">
                  {Object.entries(themes).map(([key, t]) => (
                    <button
                      key={key}
                      onClick={() => setTheme(key as keyof typeof themes)}
                      className={cn(
                        'flex-1 py-1.5 rounded-md text-[10px] font-mono transition-all',
                        theme === key
                          ? 'bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/30'
                          : 'bg-white/[0.02] text-gray-500 border border-transparent hover:border-cyber-border/50'
                      )}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 字号调整 */}
              <div>
                <label className="text-[11px] text-gray-400 font-mono block mb-1.5">字号: {fontSize}px</label>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setFontSize(s => Math.max(s - 1, 10))}
                    className="flex-1 py-1 rounded-md bg-white/[0.02] text-gray-400 hover:text-gray-200 border border-cyber-border/50"
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setFontSize(s => Math.min(s + 1, 24))}
                    className="flex-1 py-1 rounded-md bg-white/[0.02] text-gray-400 hover:text-gray-200 border border-cyber-border/50"
                  >
                    A+
                  </button>
                </div>
              </div>

              {/* 自动换行 */}
              <div>
                <label className="text-[11px] text-gray-400 font-mono block mb-1.5">自动换行</label>
                <button
                  onClick={() => setWordWrap(!wordWrap)}
                  className={cn(
                    'w-full py-1.5 rounded-md text-[10px] font-mono transition-all flex items-center justify-center gap-1.5',
                    wordWrap
                      ? 'bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/30'
                      : 'bg-white/[0.02] text-gray-500 border border-transparent hover:border-cyber-border/50'
                  )}
                >
                  <AlignLeft className="w-3 h-3" />
                  {wordWrap ? '开启' : '关闭'}
                </button>
              </div>

              {/* 格式化 */}
              <div>
                <label className="text-[11px] text-gray-400 font-mono block mb-1.5">代码操作</label>
                <div className="flex gap-1">
                  <button
                    onClick={formatCode}
                    className="flex-1 py-1 rounded-md bg-white/[0.02] text-gray-400 hover:text-gray-200 border border-cyber-border/50 text-[10px] font-mono"
                  >
                    格式化
                  </button>
                  <button
                    onClick={copyCode}
                    className="flex-1 py-1 rounded-md bg-white/[0.02] text-gray-400 hover:text-gray-200 border border-cyber-border/50 text-[10px] font-mono"
                  >
                    {copied ? '已复制' : '复制'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 移动端标签页 */}
      <div className="md:hidden flex border-b border-cyber-border bg-cyber-panel/30">
        <button
          onClick={() => setActiveTab('editor')}
          className={cn(
            'flex-1 py-2 text-xs font-mono transition-all flex items-center justify-center gap-1.5',
            activeTab === 'editor' ? 'text-cyber-accent border-b-2 border-cyber-accent' : 'text-gray-500'
          )}
        >
          <Code2 className="w-3.5 h-3.5" />
          编辑器
        </button>
        <button
          onClick={() => setActiveTab('snippets')}
          className={cn(
            'flex-1 py-2 text-xs font-mono transition-all flex items-center justify-center gap-1.5',
            activeTab === 'snippets' ? 'text-cyber-accent border-b-2 border-cyber-accent' : 'text-gray-500'
          )}
        >
          <FileText className="w-3.5 h-3.5" />
          代码片段
        </button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* 编辑器区域 */}
        <div className={cn(
          'flex-1 flex flex-col min-h-0 overflow-hidden',
          activeTab !== 'editor' && 'hidden md:flex'
        )}>
          {/* 编辑器工具栏 */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-cyber-border/50 bg-cyber-bg/50 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-[10px] text-gray-500 font-mono">
                code.{languages.find(l => l.id === language)?.ext || 'txt'}
              </span>
              <span className="text-[10px] text-gray-600 font-mono">
                {lineCount} 行
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={saveSnippet}
                className="p-1 rounded hover:bg-white/5 text-gray-500 hover:text-gray-300"
                title="保存片段"
              >
                <Save className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={exportCode}
                className="p-1 rounded hover:bg-white/5 text-gray-500 hover:text-gray-300"
                title="导出"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 代码编辑器 */}
          <div className="flex-1 overflow-auto" style={{ background: currentTheme.bg }}>
            <div className="flex min-h-full">
              {/* 行号 */}
              <div
                className="flex-shrink-0 py-3 pr-2 pl-3 text-right select-none border-r border-gray-800/50"
                style={{ fontSize: `${fontSize}px`, fontFamily: 'monospace', color: currentTheme.comment }}
              >
                {Array.from({ length: lineCount }, (_, i) => (
                  <div key={i} className="leading-6">{i + 1}</div>
                ))}
              </div>

              {/* 代码区域 */}
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                className="flex-1 w-full p-3 outline-none resize-none font-mono leading-6"
                style={{
                  fontSize: `${fontSize}px`,
                  background: currentTheme.bg,
                  color: currentTheme.text,
                  whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
                  caretColor: '#00ff88',
                }}
              />
            </div>
          </div>
        </div>

        {/* 代码片段面板（桌面端） */}
        <div className="hidden md:flex w-56 border-l border-cyber-border bg-cyber-panel/30 flex-col overflow-hidden flex-shrink-0">
          <div className="p-3 border-b border-cyber-border">
            <h3 className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              代码片段库
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {codeSnippets.map(snippet => (
              <button
                key={snippet.id}
                onClick={() => insertSnippet(snippet)}
                className="w-full p-2 rounded-lg bg-white/[0.02] border border-transparent hover:border-cyber-accent/30 hover:bg-cyber-accent/5 text-left transition-all group"
              >
                <div className="text-xs text-gray-300 font-medium">{snippet.name}</div>
                <div className="text-[10px] text-gray-600 font-mono mt-1 truncate">
                  {snippet.code.slice(0, 40)}...
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 代码片段面板（移动端） */}
        <div className={cn(
          'md:hidden flex-1 flex flex-col min-h-0 overflow-hidden',
          activeTab !== 'snippets' && 'hidden'
        )}>
          <div className="p-3 border-b border-cyber-border bg-cyber-panel/30">
            <h3 className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              代码片段库 ({codeSnippets.length})
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {codeSnippets.map(snippet => (
              <button
                key={snippet.id}
                onClick={() => insertSnippet(snippet)}
                className="w-full p-3 rounded-lg bg-white/[0.02] border border-cyber-border/50 hover:border-cyber-accent/30 text-left transition-all"
              >
                <div className="text-xs text-gray-300 font-medium">{snippet.name}</div>
                <div className="text-[10px] text-gray-500 font-mono mt-1">
                  {snippet.lang}
                </div>
                <div className="text-[10px] text-gray-600 font-mono mt-1 truncate">
                  {snippet.code.slice(0, 50)}...
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 输出面板 */}
      <div className="border-t border-cyber-border bg-cyber-panel/30 flex flex-col flex-shrink-0" style={{ height: '35%' }}>
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-cyber-border/50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-cyber-accent" />
            <span className="text-[11px] text-gray-400 font-mono">输出</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={clearOutput}
              className="p-1 rounded hover:bg-white/5 text-gray-500 hover:text-gray-300"
              title="清空输出"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-3">
          {output ? (
            <pre
              className="text-xs font-mono whitespace-pre-wrap leading-relaxed"
              style={{ color: currentTheme.text }}
            >
              {output}
            </pre>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-600 text-xs font-mono">
              点击「运行」按钮执行代码
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
