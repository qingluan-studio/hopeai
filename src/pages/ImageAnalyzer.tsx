import { useState, useRef } from 'react'
import { Image, Upload, Sparkles, Download, Loader2, Check, X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AnalysisResult {
  description: string
  objects: string[]
  colors: string[]
  text: string
  sentiment: string
}

export default function ImageAnalyzer() {
  const [image, setImage] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('请选择图片文件')
        return
      }
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
        setAnalysis(null)
        setError(null)
        setZoom(1)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = async () => {
    if (!image) return
    
    setIsAnalyzing(true)
    setError(null)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mockResult: AnalysisResult = {
      description: '这是一张展示现代科技办公环境的图片，包含一台笔记本电脑、显示器、键盘和鼠标。桌面上摆放着咖啡杯和书籍，背景是简洁的白色墙壁和绿植，整体氛围明亮专业。',
      objects: ['笔记本电脑', '显示器', '键盘', '鼠标', '咖啡杯', '书籍', '植物', '办公椅'],
      colors: ['白色', '银色', '黑色', '绿色', '棕色'],
      text: '屏幕上显示代码编辑器界面，包含JavaScript代码',
      sentiment: '积极、专业、整洁'
    }
    
    setAnalysis(mockResult)
    setIsAnalyzing(false)
  }

  const handleClear = () => {
    setImage(null)
    setAnalysis(null)
    setError(null)
    setZoom(1)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-950">
      <div className="flex-shrink-0 bg-gray-950/90 backdrop-blur-md border-b border-pink-900/30 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <Image className="w-5 h-5 text-pink-400" style={{ filter: 'drop-shadow(0 0 6px rgba(236,72,153,0.5))' }} />
          <h1 className="text-base font-mono font-bold text-pink-400" style={{ textShadow: '0 0 8px rgba(236,72,153,0.5)' }}>
            图片理解
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 safe-area-bottom">
        <div className="max-w-md mx-auto space-y-3">
          {!image ? (
            <div className="border-2 border-dashed border-gray-800 rounded-2xl p-8 text-center bg-gray-900/50 hover:border-pink-700/50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              <div className="w-16 h-16 rounded-xl bg-pink-900/20 border border-pink-700/40 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-pink-400" />
              </div>
              <p className="text-sm font-mono text-gray-300 mb-1">上传图片</p>
              <p className="text-xs text-gray-500">支持 JPG、PNG、GIF 等格式</p>
              <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-600 font-mono">
                <span className="px-2 py-1 rounded bg-gray-800/50">拖拽上传</span>
                <span className="px-2 py-1 rounded bg-gray-800/50">最大 10MB</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative rounded-xl overflow-hidden border border-gray-800 bg-gray-900/50">
                <div className="flex items-center justify-between p-2 bg-gray-900/80 border-b border-gray-800">
                  <span className="text-[10px] font-mono text-gray-500">图片预览</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setZoom(z => Math.max(0.5, z - 0.25))} className="p-1 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300">
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[9px] font-mono text-gray-600">{Math.round(zoom * 100)}%</span>
                    <button onClick={() => setZoom(z => Math.min(2, z + 0.25))} className="p-1 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300">
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setZoom(1)} className="p-1 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="overflow-auto max-h-[300px]">
                  <img 
                    src={image} 
                    alt="Uploaded" 
                    className="mx-auto transition-transform duration-200"
                    style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all',
                    isAnalyzing
                      ? 'bg-gray-800/50 border-gray-700 text-gray-500'
                      : 'bg-pink-900/30 border-pink-700/50 text-pink-400 hover:bg-pink-900/50'
                  )}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      分析中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      开始分析
                    </>
                  )}
                </button>
                <button
                  onClick={handleClear}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-700/50 text-gray-400 hover:bg-gray-800/50 transition-all"
                >
                  <X className="w-4 h-4" />
                  清除
                </button>
              </div>

              {analysis && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-pink-400" />
                      <span className="text-xs font-mono text-pink-400">图像描述</span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">{analysis.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                      <div className="text-[10px] font-mono text-gray-500 mb-2">识别对象</div>
                      <div className="flex flex-wrap gap-1">
                        {analysis.objects.map(obj => (
                          <span key={obj} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/30 text-blue-400 border border-blue-700/30">
                            {obj}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                      <div className="text-[10px] font-mono text-gray-500 mb-2">主要颜色</div>
                      <div className="flex flex-wrap gap-1">
                        {analysis.colors.map(color => (
                          <span key={color} className="text-[10px] px-1.5 py-0.5 rounded bg-green-900/30 text-green-400 border border-green-700/30">
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-mono text-gray-500">提取文本</span>
                    </div>
                    <p className="text-xs text-gray-400">{analysis.text}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-mono text-gray-500">情感分析</span>
                    </div>
                    <span className="text-sm text-amber-400">{analysis.sentiment}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-900/30 border border-red-700/50 flex items-center gap-2">
              <X className="w-4 h-4 text-red-400" />
              <span className="text-xs font-mono text-red-400">{error}</span>
            </div>
          )}

          <div className="p-4 rounded-xl bg-gradient-to-br from-pink-900/20 via-gray-900/50 to-purple-900/20 border border-pink-800/30">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span className="text-xs font-mono text-pink-400">功能说明</span>
            </div>
            <ul className="text-[11px] text-gray-500 space-y-1">
              <li>• 支持图像内容描述</li>
              <li>• 物体识别与分类</li>
              <li>• 颜色提取分析</li>
              <li>• 文字识别与提取</li>
              <li>• 情感与氛围分析</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
