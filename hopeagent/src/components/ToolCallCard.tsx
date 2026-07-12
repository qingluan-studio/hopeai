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

// 输出截断阈值：超过此长度则截断显示"展开"
const OUTPUT_TRUNCATE_LENGTH = 500

interface ToolCallCardProps {
  toolCall: ToolCall
  defaultExpanded?: boolean
}

/** 尝试将字符串格式化为美观的 JSON，失败则原样返回 */
function tryFormatJson(str: string): string {
  try {
    return JSON.stringify(JSON.parse(str), null, 2)
  } catch {
    return str
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
 */
export default function ToolCallCard({ toolCall, defaultExpanded = false }: ToolCallCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [outputExpanded, setOutputExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const status = toolStatusConfig[toolCall.status] || toolStatusConfig.pending
  const StatusIcon = status.icon
  const duration = calcToolDuration(toolCall)
  const isError = toolCall.status === 'error'

  // 格式化输入参数
  const formattedInput = tryFormatJson(toolCall.input)
  // 输出截断处理
  const outputLength = toolCall.output?.length || 0
  const isOutputTruncated = outputLength > OUTPUT_TRUNCATE_LENGTH
  const displayOutput =
    isOutputTruncated && !outputExpanded
      ? toolCall.output!.slice(0, OUTPUT_TRUNCATE_LENGTH)
      : toolCall.output || ''

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

  return (
    <div
      className={cn(
        'my-2 rounded-lg border overflow-hidden',
        isError ? 'border-red-500/40 bg-red-500/5' : 'border-cyber-border bg-cyber-panel/40'
      )}
    >
      {/* 头部：工具名 + 状态徽章 + 耗时 + 折叠按钮 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          'w-full flex items-center gap-2 px-3 py-2 border-b transition-colors',
          isError ? 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10' : 'bg-cyber-accent3/5 border-cyber-border hover:bg-cyber-accent3/10'
        )}
      >
        <Wrench className={cn('w-3.5 h-3.5 flex-shrink-0', isError ? 'text-red-400' : 'text-cyber-accent3')} />
        <span className={cn('text-xs font-mono font-bold flex-shrink-0', isError ? 'text-red-400' : 'text-cyber-accent3')}>
          🔧 {toolCall.toolName}
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
          <StatusIcon className={cn('w-2.5 h-2.5', toolCall.status === 'running' && 'animate-spin')} />
          {status.label}
        </span>
        {/* 耗时 */}
        {duration && (
          <span className="text-[10px] text-gray-500 font-mono flex items-center gap-0.5 flex-shrink-0">
            <Clock className="w-2.5 h-2.5" />
            {duration}
          </span>
        )}
        <span className="ml-auto flex-shrink-0">
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          )}
        </span>
      </button>

      {/* 展开内容 */}
      {expanded && (
        <div className="p-3 space-y-2 text-xs font-mono">
          {/* 输入参数 */}
          <div>
            <div className="text-gray-500 mb-1 flex items-center gap-1">
              <span className="text-cyan-400">▶</span> 输入参数
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
                  <span className="text-green-400">◀</span> 输出结果
                  {isError && <AlertCircle className="w-3 h-3 text-red-400" />}
                </span>
                <button
                  onClick={copyOutput}
                  className="text-gray-600 hover:text-cyber-accent flex items-center gap-1 text-[10px]"
                >
                  {copied ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                </button>
              </div>
              <pre
                className={cn(
                  'bg-cyber-bg/60 border rounded p-2 overflow-x-auto whitespace-pre-wrap break-all text-[11px] leading-relaxed',
                  isError ? 'text-red-300 border-red-500/30' : 'text-green-300 border-cyber-border'
                )}
              >
                {displayOutput}
                {isOutputTruncated && !outputExpanded && (
                  <span className="text-gray-600">
                    {' '}
                    ... ({outputLength - OUTPUT_TRUNCATE_LENGTH} 字符已截断)
                  </span>
                )}
              </pre>
              {isOutputTruncated && (
                <button
                  onClick={() => setOutputExpanded(!outputExpanded)}
                  className="mt-1 text-[10px] text-cyber-accent hover:text-cyber-accent2 flex items-center gap-1"
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
            <div className="text-red-400 text-[11px] flex items-center gap-1.5">
              <AlertCircle className="w-3 h-3" />
              工具执行失败，请查看日志或重试
            </div>
          )}
        </div>
      )}
    </div>
  )
}
