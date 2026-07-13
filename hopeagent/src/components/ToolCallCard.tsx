import { useState, useCallback } from 'react'
import {
  Wrench,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Clock,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Maximize2,
  Minimize2,
  Sparkles,
} from 'lucide-react'
import type { ToolCall } from '@/types'
import { cn } from '@/lib/utils'

// 工具状态配置：图标 + 颜色 + 标签
const toolStatusConfig: Record<
  string,
  {
    label: string
    color: string
    bgColor: string
    borderColor: string
    icon: typeof Wrench
  }
> = {
  pending: { label: '等待中', color: 'text-gray-400', bgColor: 'bg-gray-500/10', borderColor: 'border-gray-500/30', icon: Clock },
  running: { label: '执行中', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/30', icon: Loader2 },
  success: { label: '完成', color: 'text-green-400', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30', icon: CheckCircle2 },
  error: { label: '失败', color: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30', icon: XCircle },
}

// 工具分类图标映射
const toolCategoryIcons: Record<string, string> = {
  '信息检索': '🔍',
  '质量评估': '📊',
  '代码执行': '💻',
  '文件操作': '📁',
  '任务规划': '📋',
  '计算转换': '🧮',
  '文本处理': '📝',
  '开发工具': '🛠️',
  '数据处理': '📈',
  '生活实用': '🌤️',
}

// 输出截断阈值：超过此长度则截断显示"展开"
const OUTPUT_TRUNCATE_LENGTH = 500

interface ToolCallCardProps {
  toolCall: ToolCall
  defaultExpanded?: boolean
  onReExecute?: () => void
  category?: string
}

/** 尝试将字符串格式化为美观的 JSON，失败则原样返回 */
function tryFormatJson(str: string): string {
  try {
    return JSON.stringify(JSON.parse(str), null, 2)
  } catch {
    return str
  }
}

/** 检测输出内容类型 */
function detectOutputType(output: string): 'json' | 'svg' | 'text' {
  const trimmed = output.trim()
  if (trimmed.startsWith('<svg') && trimmed.endsWith('</svg>')) return 'svg'
  try {
    JSON.parse(trimmed)
    return 'json'
  } catch {
    return 'text'
  }
}

/** 计算工具调用耗时 */
function calcToolDuration(tc: ToolCall): string {
  if (!tc.startedAt) return ''
  const start = new Date(tc.startedAt).getTime()
  const end = tc.finishedAt ? new Date(tc.finishedAt).getTime() : Date.now()
  const ms = Math.max(0, end - start)
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

/**
 * 工具调用卡片
 * - 工具名 + 图标 + 状态徽章
 * - 输入参数（JSON 格式化高亮）
 * - 输出结果（可折叠，长输出截断）
 * - 耗时显示
 * - 错误信息红色展示
 * - 复制结果按钮
 * - 重新执行按钮
 * - 执行状态动画
 */
export default function ToolCallCard({ toolCall, defaultExpanded = false, onReExecute, category }: ToolCallCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [outputExpanded, setOutputExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const status = toolStatusConfig[toolCall.status] || toolStatusConfig.pending
  const StatusIcon = status.icon
  const duration = calcToolDuration(toolCall)
  const isError = toolCall.status === 'error'
  const isRunning = toolCall.status === 'running'
  const categoryIcon = category ? (toolCategoryIcons[category] || '🔧') : '🔧'

  // 格式化输入参数
  const formattedInput = tryFormatJson(toolCall.input)
  // 输出截断处理
  const outputLength = toolCall.output?.length || 0
  const isOutputTruncated = outputLength > OUTPUT_TRUNCATE_LENGTH
  const displayOutput =
    isOutputTruncated && !outputExpanded
      ? toolCall.output!.slice(0, OUTPUT_TRUNCATE_LENGTH)
      : toolCall.output || ''
  
  // 检测输出类型
  const outputType = toolCall.output ? detectOutputType(toolCall.output) : 'text'

  // 复制输出到剪贴板
  const copyOutput = useCallback(async () => {
    if (!toolCall.output) return
    try {
      await navigator.clipboard.writeText(toolCall.output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // 忽略剪贴板错误
    }
  }, [toolCall.output])

  // 处理重新执行
  const handleReExecute = useCallback(() => {
    if (onReExecute && !isRunning) {
      onReExecute()
    }
  }, [onReExecute, isRunning])

  // 渲染输出内容
  const renderOutput = () => {
    if (!toolCall.output) return null
    
    if (outputType === 'svg' && outputExpanded) {
      return (
        <div
          className={cn(
            'bg-white rounded p-4 border overflow-x-auto flex items-center justify-center',
            isError ? 'border-red-500/30' : 'border-cyber-border'
          )}
          dangerouslySetInnerHTML={{ __html: displayOutput }}
        />
      )
    }
    
    return (
      <pre
        className={cn(
          'bg-cyber-bg/60 border rounded p-2 overflow-x-auto whitespace-pre-wrap break-all text-[11px] leading-relaxed',
          isError ? 'text-red-300 border-red-500/30' : 'text-green-300 border-cyber-border'
        )}
      >
        {outputType === 'json' ? tryFormatJson(displayOutput) : displayOutput}
        {isOutputTruncated && !outputExpanded && (
          <span className="text-gray-600">
            {' '}
            ... ({outputLength - OUTPUT_TRUNCATE_LENGTH} 字符已截断)
          </span>
        )}
      </pre>
    )
  }

  const cardContent = (
    <div
      className={cn(
        'my-2 rounded-lg border overflow-hidden transition-all duration-300',
        isError ? 'border-red-500/40 bg-red-500/5' : 'border-cyber-border bg-cyber-panel/40',
        isFullscreen && 'fixed inset-4 z-50 m-0 overflow-auto'
      )}
    >
      {/* 头部：工具名 + 状态徽章 + 耗时 + 折叠按钮 */}
      <button
        onClick={() => !isFullscreen && setExpanded(!expanded)}
        className={cn(
          'w-full flex items-center gap-2 px-3 py-2 border-b transition-colors',
          isError ? 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10' : 'bg-cyber-accent3/5 border-cyber-border hover:bg-cyber-accent3/10',
          isFullscreen && 'cursor-default hover:bg-cyber-accent3/5'
        )}
      >
        <span className="text-base flex-shrink-0">{categoryIcon}</span>
        <span className={cn('text-xs font-mono font-bold flex-shrink-0', isError ? 'text-red-400' : 'text-cyber-accent3')}>
          {toolCall.toolName}
        </span>
        {/* 状态徽章 */}
        <span
          className={cn(
            'ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded flex items-center gap-1 border flex-shrink-0',
            status.color,
            status.bgColor,
            status.borderColor
          )}
        >
          <StatusIcon className={cn('w-2.5 h-2.5', isRunning && 'animate-spin')} />
          {status.label}
        </span>
        {/* 执行中动画效果 */}
        {isRunning && (
          <span className="flex items-center gap-0.5 flex-shrink-0">
            <span className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
        )}
        {/* 耗时 */}
        {duration && (
          <span className="text-[10px] text-gray-500 font-mono flex items-center gap-0.5 flex-shrink-0">
            <Clock className="w-2.5 h-2.5" />
            {duration}
          </span>
        )}
        {/* 输出类型标签 */}
        {toolCall.output && toolCall.status === 'success' && outputType !== 'text' && (
          <span className="text-[10px] text-purple-400 font-mono px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 flex-shrink-0">
            {outputType.toUpperCase()}
          </span>
        )}
        <div className="ml-auto flex items-center gap-1 flex-shrink-0">
          {/* 重新执行按钮 */}
          {onReExecute && !isRunning && toolCall.status !== 'pending' && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleReExecute()
              }}
              className="p-1 text-gray-500 hover:text-cyber-accent transition-colors rounded hover:bg-cyber-accent/10"
              title="重新执行"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          )}
          {/* 全屏按钮 */}
          {toolCall.output && toolCall.status === 'success' && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsFullscreen(!isFullscreen)
                if (!isFullscreen) {
                  setExpanded(true)
                  setOutputExpanded(true)
                }
              }}
              className="p-1 text-gray-500 hover:text-cyber-accent transition-colors rounded hover:bg-cyber-accent/10"
              title={isFullscreen ? '退出全屏' : '全屏查看'}
            >
              {isFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </button>
          )}
          {/* 折叠按钮 */}
          {!isFullscreen && (
            expanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            )
          )}
        </div>
      </button>

      {/* 展开内容 */}
      {(expanded || isFullscreen) && (
        <div className="p-3 space-y-2 text-xs font-mono">
          {/* 输入参数 */}
          <div>
            <div className="text-gray-500 mb-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span className="text-cyan-400">输入参数</span>
            </div>
            <pre className="bg-cyber-bg/60 border border-cyber-border rounded p-2 text-cyan-300 overflow-x-auto whitespace-pre-wrap break-all text-[11px] leading-relaxed">
              {formattedInput}
            </pre>
          </div>

          {/* 输出结果 */}
          {toolCall.output && (
            <div>
              <div className="text-gray-500 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span className="text-green-400">◀</span>
                  <span>输出结果</span>
                  {isError && <AlertCircle className="w-3 h-3 text-red-400" />}
                  {isRunning && <Loader2 className="w-3 h-3 text-yellow-400 animate-spin" />}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={copyOutput}
                    className="text-gray-600 hover:text-cyber-accent flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded hover:bg-cyber-accent/10 transition-colors"
                    title="复制结果"
                  >
                    {copied ? (
                      <>
                        <Check className="w-2.5 h-2.5 text-green-400" />
                        <span className="text-green-400">已复制</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-2.5 h-2.5" />
                        <span>复制</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              {renderOutput()}
              {isOutputTruncated && (
                <button
                  onClick={() => setOutputExpanded(!outputExpanded)}
                  className="mt-1 text-[10px] text-cyber-accent hover:text-cyber-accent2 flex items-center gap-1 transition-colors"
                >
                  {outputExpanded ? (
                    <>
                      <ChevronUp className="w-2.5 h-2.5" />收起
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-2.5 h-2.5" />展开全部 ({outputLength} 字符)
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* 错误信息（无输出时） */}
          {isError && !toolCall.output && (
            <div className="text-red-400 text-[11px] flex items-center gap-1.5 p-2 bg-red-500/10 rounded border border-red-500/20">
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
              <span>工具执行失败，请查看日志或重试</span>
            </div>
          )}

          {/* 执行中提示 */}
          {isRunning && !toolCall.output && (
            <div className="text-yellow-400 text-[11px] flex items-center gap-1.5 p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
              <Loader2 className="w-3 h-3 animate-spin flex-shrink-0" />
              <span>正在执行，请稍候...</span>
            </div>
          )}
        </div>
      )}

      {/* 全屏遮罩背景 */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black/50 -z-10"
          onClick={() => setIsFullscreen(false)}
        />
      )}
    </div>
  )

  return cardContent
}
