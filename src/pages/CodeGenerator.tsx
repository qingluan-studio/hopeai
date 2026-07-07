import { useState } from 'react'
import { Code2, Sparkles, Copy, Check, Download, Loader2, Terminal, FileCode } from 'lucide-react'
import { cn } from '@/lib/utils'

const languages = [
  { id: 'javascript', name: 'JavaScript', icon: 'JS', color: 'text-yellow-400', bg: 'bg-yellow-900/30' },
  { id: 'typescript', name: 'TypeScript', icon: 'TS', color: 'text-blue-400', bg: 'bg-blue-900/30' },
  { id: 'python', name: 'Python', icon: 'PY', color: 'text-green-400', bg: 'bg-green-900/30' },
  { id: 'java', name: 'Java', icon: 'JV', color: 'text-orange-400', bg: 'bg-orange-900/30' },
  { id: 'rust', name: 'Rust', icon: 'RS', color: 'text-red-400', bg: 'bg-red-900/30' },
  { id: 'go', name: 'Go', icon: 'GO', color: 'text-cyan-400', bg: 'bg-cyan-900/30' },
  { id: 'cpp', name: 'C++', icon: 'C++', color: 'text-purple-400', bg: 'bg-purple-900/30' },
  { id: 'html', name: 'HTML', icon: 'HT', color: 'text-amber-400', bg: 'bg-amber-900/30' },
  { id: 'css', name: 'CSS', icon: 'CS', color: 'text-blue-400', bg: 'bg-blue-900/30' },
  { id: 'react', name: 'React', icon: 'RE', color: 'text-cyan-400', bg: 'bg-cyan-900/30' },
  { id: 'vue', name: 'Vue', icon: 'VU', color: 'text-green-400', bg: 'bg-green-900/30' },
  { id: 'node', name: 'Node.js', icon: 'ND', color: 'text-green-400', bg: 'bg-green-900/30' },
]

const templates = [
  { id: 'api', name: 'REST API', desc: '创建 RESTful API 服务' },
  { id: 'crud', name: 'CRUD', desc: '创建增删改查功能' },
  { id: 'auth', name: '认证', desc: '用户认证与权限' },
  { id: 'ui', name: 'UI组件', desc: 'React/Vue 组件' },
  { id: 'db', name: '数据库', desc: '数据库操作代码' },
  { id: 'algo', name: '算法', desc: '数据结构与算法' },
]

function generateCode(language: string, prompt: string): string {
  const langName = languages.find(l => l.id === language)?.name || 'JavaScript'
  const funcName = prompt.replace(/[^a-zA-Z]/g, '') || 'generate'
  
  if (language === 'javascript') {
    return `// ${langName} 代码生成结果
// 基于需求: ${prompt}

function ${funcName}() {
  const config = {
    version: '1.0.0',
    debug: true,
    timeout: 5000
  };

  async function processData(input) {
    try {
      const result = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      return result.json();
    } catch (error) {
      console.error('处理失败:', error);
      throw error;
    }
  }

  export { config, processData };
}`
  }
  
  if (language === 'python') {
    return `# ${langName} 代码生成结果
# 基于需求: ${prompt}

def ${funcName}():
    """${prompt}"""
    config = {
        'version': '1.0.0',
        'debug': True,
        'timeout': 5000
    }

    async def process_data(input_data):
        try:
            response = await fetch('/api/data', {
                'method': 'POST',
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps(input_data)
            })
            return response.json()
        except Exception as error:
            print(f'处理失败: {error}')
            raise error

    __all__ = ['config', 'process_data']`
  }
  
  return `// ${langName} 代码生成结果
// 基于需求: ${prompt}

public class ${funcName.charAt(0).toUpperCase() + funcName.slice(1)} {
    private static final String VERSION = "1.0.0";
    private static final boolean DEBUG = true;
    private static final int TIMEOUT = 5000;

    public static String processData(String input) {
        try {
            return "处理结果: " + input;
        } catch (Exception e) {
            System.err.println("处理失败: " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public static void main(String[] args) {
        String result = processData("测试输入");
        System.out.println(result);
    }
}`
}

export default function CodeGenerator() {
  const [language, setLanguage] = useState('javascript')
  const [template, setTemplate] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [output, setOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    setOutput('')
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setOutput(generateCode(language, prompt))
    setIsGenerating(false)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const extMap: Record<string, string> = {
      javascript: '.js',
      typescript: '.ts',
      python: '.py',
      java: '.java',
      rust: '.rs',
      go: '.go',
      cpp: '.cpp',
      html: '.html',
      css: '.css',
      react: '.tsx',
      vue: '.vue',
      node: '.js',
    }
    const ext = extMap[language] || '.js'
    
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `generated${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-full flex flex-col bg-gray-950">
      <div className="flex-shrink-0 bg-gray-950/90 backdrop-blur-md border-b border-cyan-900/30 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <Code2 className="w-5 h-5 text-cyan-400" style={{ filter: 'drop-shadow(0 0 6px rgba(34,211,238,0.5))' }} />
          <h1 className="text-base font-mono font-bold text-cyan-400" style={{ textShadow: '0 0 8px rgba(34,211,238,0.5)' }}>
            代码生成器
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 safe-area-bottom">
        <div className="max-w-md mx-auto space-y-3">
          <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
            <div className="text-[10px] font-mono text-gray-500 mb-2">选择语言</div>
            <div className="flex flex-wrap gap-1.5">
              {languages.map(lang => (
                <button
                  key={lang.id}
                  onClick={() => setLanguage(lang.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-mono transition-all',
                    language === lang.id
                      ? `${lang.bg} ${lang.color} border-current`
                      : 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-gray-600'
                  )}
                >
                  <span className="text-[9px] font-bold">{lang.icon}</span>
                  <span className="truncate max-w-[60px]">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
            <div className="text-[10px] font-mono text-gray-500 mb-2">模板选择</div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setTemplate(null)}
                className={cn(
                  'px-2 py-1 rounded-lg border text-xs font-mono transition-all',
                  !template
                    ? 'bg-cyan-900/30 text-cyan-400 border-cyan-700/50'
                    : 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-gray-600'
                )}
              >
                自定义
              </button>
              {templates.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={cn(
                    'px-2 py-1 rounded-lg border text-xs font-mono transition-all',
                    template === t.id
                      ? 'bg-cyan-900/30 text-cyan-400 border-cyan-700/50'
                      : 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-gray-600'
                  )}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-gray-500">需求描述</span>
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono transition-all',
                  isGenerating || !prompt.trim()
                    ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                    : 'bg-cyan-900/30 text-cyan-400 border border-cyan-700/50 hover:bg-cyan-900/50'
                )}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    生成中
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3" />
                    生成
                  </>
                )}
              </button>
            </div>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="描述你想要生成的代码..."
              className="w-full h-24 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-sm text-gray-300 placeholder-gray-600 resize-none focus:outline-none focus:border-cyan-700/50 font-mono"
            />
          </div>

          {output && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono text-cyan-400">生成结果</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleCopy}
                    className={cn(
                      'flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono transition-all',
                      copied
                        ? 'bg-green-900/30 text-green-400 border border-green-700/50'
                        : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-gray-600'
                    )}
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? '已复制' : '复制'}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-gray-600 text-[10px] font-mono transition-all"
                  >
                    <Download className="w-3 h-3" />
                    下载
                  </button>
                </div>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-gray-800 bg-gray-900/60">
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-900/80 border-b border-gray-800">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/80" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
                    <div className="w-2 h-2 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-[10px] font-mono text-gray-500 ml-2">
                    generated.{language === 'python' ? 'py' : language === 'java' ? 'java' : 'js'}
                  </span>
                </div>
                <pre className="p-3 text-xs font-mono text-gray-300 overflow-x-auto max-h-[300px]">
                  <code>{output}</code>
                </pre>
              </div>
            </div>
          )}

          <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-900/20 via-gray-900/50 to-blue-900/20 border border-cyan-800/30">
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono text-cyan-400">支持语言</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {languages.map(lang => (
                <span key={lang.id} className={cn('text-[9px] px-1.5 py-0.5 rounded', lang.bg, lang.color, 'border border-gray-700/30')}>
                  {lang.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
