import { useState } from 'react'
import { Languages, ArrowRight, Copy, Check, Globe, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const languages = [
  { id: 'zh', name: '中文', flag: 'CN' },
  { id: 'en', name: 'English', flag: 'US' },
  { id: 'ja', name: '日本語', flag: 'JP' },
  { id: 'ko', name: '한국어', flag: 'KR' },
  { id: 'fr', name: 'Français', flag: 'FR' },
  { id: 'de', name: 'Deutsch', flag: 'DE' },
  { id: 'es', name: 'Español', flag: 'ES' },
  { id: 'ru', name: 'Русский', flag: 'RU' },
  { id: 'pt', name: 'Português', flag: 'PT' },
  { id: 'it', name: 'Italiano', flag: 'IT' },
  { id: 'ar', name: 'العربية', flag: 'SA' },
  { id: 'hi', name: 'हिन्दी', flag: 'IN' },
]

interface TranslationResult {
  text: string
  language: string
  confidence: number
}

export default function Translator() {
  const [sourceLang, setSourceLang] = useState('zh')
  const [targetLang, setTargetLang] = useState('en')
  const [text, setText] = useState('')
  const [results, setResults] = useState<TranslationResult[]>([])
  const [isTranslating, setIsTranslating] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleSwap = () => {
    const temp = sourceLang
    setSourceLang(targetLang)
    setTargetLang(temp)
  }

  const handleTranslate = async () => {
    if (!text.trim()) return
    
    setIsTranslating(true)
    setResults([])
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const sourceName = languages.find(l => l.id === sourceLang)?.name || '中文'
    const targetName = languages.find(l => l.id === targetLang)?.name || 'English'
    
    const mockResults: TranslationResult[] = [
      {
        text: targetLang === 'en' ? 'Hello, how are you?' : 
              targetLang === 'ja' ? 'こんにちは、元気ですか？' :
              targetLang === 'ko' ? '안녕하세요, 어떻게 지냅니까?' :
              targetLang === 'fr' ? 'Bonjour, comment ça va?' :
              targetLang === 'de' ? 'Hallo, wie geht es dir?' :
              targetLang === 'es' ? 'Hola, ¿cómo estás?' :
              'Hello, how are you?',
        language: targetName,
        confidence: 98
      },
      {
        text: targetLang === 'en' ? 'Hi there, how have you been?' : 
              targetLang === 'ja' ? 'こんにちは、調子はどうですか？' :
              targetLang === 'ko' ? '안녕, 잘 지냈어?' :
              targetLang === 'fr' ? 'Salut, comment tu vas?' :
              targetLang === 'de' ? 'Hallo, wie war es?' :
              targetLang === 'es' ? '¡Hola!, ¿cómo has estado?' :
              'Hi there, how have you been?',
        language: `${targetName} (变体)`,
        confidence: 92
      },
      {
        text: targetLang === 'en' ? 'Greetings, what is your state?' : 
              targetLang === 'ja' ? '挨拶、あなたの状態は何ですか？' :
              targetLang === 'ko' ? '인사, 어떤 상태입니까?' :
              targetLang === 'fr' ? 'Salutations, quel est votre état?' :
              targetLang === 'de' ? 'Grüße, wie ist dein Zustand?' :
              targetLang === 'es' ? 'Saludos, ¿cuál es tu estado?' :
              'Greetings, what is your state?',
        language: `${targetName} (直译)`,
        confidence: 78
      }
    ]
    
    setResults(mockResults)
    setIsTranslating(false)
  }

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="h-full flex flex-col bg-gray-950">
      <div className="flex-shrink-0 bg-gray-950/90 backdrop-blur-md border-b border-amber-900/30 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <Languages className="w-5 h-5 text-amber-400" style={{ filter: 'drop-shadow(0 0 6px rgba(251,191,36,0.5))' }} />
          <h1 className="text-base font-mono font-bold text-amber-400" style={{ textShadow: '0 0 8px rgba(251,191,36,0.5)' }}>
            翻译助手
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 safe-area-bottom">
        <div className="max-w-md mx-auto space-y-3">
          <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-gray-900/60 border border-gray-800">
            <div className="flex-1">
              <div className="text-[9px] font-mono text-gray-500 mb-1 text-center">源语言</div>
              <select
                value={sourceLang}
                onChange={e => setSourceLang(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-sm text-gray-300 focus:outline-none focus:border-amber-700/50 appearance-none"
              >
                {languages.map(lang => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={handleSwap}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-900/30 border border-amber-700/50 text-amber-400 hover:bg-amber-900/50 transition-all"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <div className="flex-1">
              <div className="text-[9px] font-mono text-gray-500 mb-1 text-center">目标语言</div>
              <select
                value={targetLang}
                onChange={e => setTargetLang(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-sm text-gray-300 focus:outline-none focus:border-amber-700/50 appearance-none"
              >
                {languages.filter(l => l.id !== sourceLang).map(lang => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-gray-500">输入文本</span>
              <button
                onClick={handleTranslate}
                disabled={isTranslating || !text.trim()}
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono transition-all',
                  isTranslating || !text.trim()
                    ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                    : 'bg-amber-900/30 text-amber-400 border border-amber-700/50 hover:bg-amber-900/50'
                )}
              >
                {isTranslating ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    翻译中
                  </>
                ) : (
                  <>
                    <Globe className="w-3 h-3" />
                    翻译
                  </>
                )}
              </button>
            </div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="输入要翻译的文本..."
              className="w-full h-32 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-sm text-gray-300 placeholder-gray-600 resize-none focus:outline-none focus:border-amber-700/50"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[9px] font-mono text-gray-600">{text.length} 字符</span>
              <span className="text-[9px] font-mono text-gray-600">支持多种语言自动检测</span>
            </div>
          </div>

          {results.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono text-amber-400">翻译结果对比</span>
              </div>
              
              {results.map((result, index) => (
                <div
                  key={index}
                  className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 hover:border-amber-700/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-gray-500">{result.language}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-400 rounded-full transition-all"
                            style={{ width: `${result.confidence}%` }}
                          />
                        </div>
                        <span className="text-[9px] font-mono text-gray-500">{result.confidence}%</span>
                      </div>
                      <button
                        onClick={() => handleCopy(result.text, index)}
                        className={cn(
                          'p-1 rounded transition-all',
                          copiedIndex === index
                            ? 'bg-green-900/30 text-green-400'
                            : 'bg-gray-800/50 text-gray-400 hover:text-gray-300'
                        )}
                      >
                        {copiedIndex === index ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">{result.text}</p>
                </div>
              ))}
            </div>
          )}

          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-900/20 via-gray-900/50 to-orange-900/20 border border-amber-800/30">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono text-amber-400">支持语言</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {languages.map(lang => (
                <div key={lang.id} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-800/30">
                  <span className="text-[9px] font-bold text-gray-400">{lang.flag}</span>
                  <span className="text-[10px] text-gray-400 truncate">{lang.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
            <div className="text-[10px] font-mono text-gray-500 mb-2">快捷翻译</div>
            <div className="flex flex-wrap gap-1.5">
              {['中文', 'English', '日本語', '한국어', 'Français', 'Deutsch'].map((lang, index) => (
                <button
                  key={lang}
                  onClick={() => {
                    setTargetLang(['zh', 'en', 'ja', 'ko', 'fr', 'de'][index])
                    handleTranslate()
                  }}
                  disabled={!text.trim()}
                  className={cn(
                    'px-2 py-1 rounded-lg border text-xs font-mono transition-all',
                    text.trim()
                      ? 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-amber-700/50 hover:text-amber-400'
                      : 'bg-gray-800/30 text-gray-600 border-gray-800 cursor-not-allowed'
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
