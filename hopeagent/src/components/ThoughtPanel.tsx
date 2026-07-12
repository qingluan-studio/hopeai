import { useState, useCallback } from 'react'
import {
  Brain,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Eye,
  Wrench,
  ListChecks,
  Sparkles,
  Clock,
} from 'lucide-react'
import type { ThoughtStep } from '@/types'
import { cn } from '@/lib/utils'

/**
 * 思维类型配置
 * - observe 观察 → 蓝色 🔍
 * - think  思考 → 紫色 💭
 * - plan   规划 → 青色 📋
 * - act    行动 → 橙色 ⚡
 * - reflect 反思 → 绿色 ✨
 */
const thoughtTypeConfig: Record<
  string,
  {
    label: string
    color: string
    bgColor: string
    borderColor: string
    emoji: string
    icon: typeof Brain
    dotColor: string
  }
> = {
  observe: { label: '观察', color: 'text-blue-400', bgColor: 'bg-blue-500/5', borderColor: 'border-blue-500/40', emoji: '🔍', icon: Eye, dotColor: 'bg-blue-500' },
  think: { label: '思考', color: 'text-purple-400', bgColor: 'bg-purple-500/5', borderColor: 'border-purple-500/40', emoji: '💭', icon: Brain, dotColor: 'bg-purple-500' },
  plan: { label: '规划', color: 'text-cyan-400', bgColor: 'bg-cyan-500/5', borderColor: 'border-cyan-500/40', emoji: '📋', icon: ListChecks, dotColor: 'bg-cyan-500' },
  act: { label: '行动', color: 'text-orange-400', bgColor: 'bg-orange-500/5', borderColor: 'border-orange-500/40', emoji: '⚡', icon: Wrench, dotColor: 'bg-orange-500' },
  reflect: { label: '反思', color: 'text-green-400', bgColor: 'bg-green-500/5', borderColor: 'border-green-500/40', emoji: '✨', icon: Sparkles, dotColor: 'bg-green-500' },
}

interface ThoughtPanelProps {
  steps: ThoughtStep[]
  defaultExpanded?: boolean
}

/** 格式化时间戳为 时:分:秒 */
function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  } catch {
    return ''
  }
}

/** 计算思维链总耗时（毫秒） */
function calcDuration(steps: ThoughtStep[]): number {
  if (steps.length < 2) return 0
  const start = new Date(steps[0].timestamp).getTime()
  const end = new Date(steps[steps.length - 1].timestamp).getTime()
  return Math.max(0, end - start)
}

/**
 * 思维链面板
 * - 时间线样式垂直布局
 * - 每步带图标、类型标签、时间、内容
 * - 进度条显示推理进度
 * - 可整体折叠/展开
 * - 复制思维链为文本
 */
export default function ThoughtPanel({ steps, defaultExpanded = false }: ThoughtPanelProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState(false)

  // 切换单步展开/折叠
  const toggleStep = useCallback((id: string) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  // 复制整个思维链为文本
  const copyAll = useCallback(async () => {
    const text = steps
      .map((s, i) => {
        const cfg = thoughtTypeConfig[s.type] || thoughtTypeConfig.think
        return `[${i + 1}] ${cfg.emoji} ${cfg.label} (${formatTimestamp(s.timestamp)})\n${s.content}`
      })
      .join('\n\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // 忽略剪贴板错误
    }
  }, [steps])

  if (!steps.length) return null

  const duration = calcDuration(steps)
  // 按类型统计步数
  const typeCounts = steps.reduce<Record<string, number>>((acc, s) => {
    acc[s.type] = (acc[s.type] || 0) + 1
    return acc
  }, {})

  return (
    <div className="my-2 rounded-lg border border-cyber-border bg-cyber-panel/40 overflow-hidden">
      {/* 头部：折叠按钮 + 步数 + 耗时 + 复制 */}
      <div className="flex items-center justify-between px-3 py-2 bg-cyber-accent/5 border-b border-cyber-border">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-xs font-mono text-cyber-accent hover:text-cyber-accent2 transition-colors"
        >
          <Brain className="w-3.5 h-3.5" />
          <span>思维链 · {steps.length} 步</span>
          {duration > 0 && (
            <span className="text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {(duration / 1000).toFixed(1)}s
            </span>
          )}
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={copyAll}
          className="text-gray-500 hover:text-cyber-accent transition-colors flex items-center gap-1 text-xs"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? '已复制' : '复制'}
        </button>
      </div>

      {/* 进度条：按类型分布色块 */}
      <div className="flex h-1 bg-cyber-bg">
        {steps.map((s, i) => {
          const cfg = thoughtTypeConfig[s.type] || thoughtTypeConfig.think
          return (
            <div
              key={i}
              className={cn('flex-1', cfg.dotColor)}
              title={`${cfg.label}: ${s.content.slice(0, 40)}`}
            />
          )
        })}
      </div>

      {/* 类型统计标签 */}
      <div className="flex flex-wrap gap-1.5 px-3 py-1.5 border-b border-cyber-border/50">
        {Object.entries(typeCounts).map(([type, count]) => {
          const cfg = thoughtTypeConfig[type] || thoughtTypeConfig.think
          const Icon = cfg.icon
          return (
            <span
              key={type}
              className={cn(
                'text-[10px] font-mono px-1.5 py-0.5 rounded flex items-center gap-1 border',
                cfg.color,
                cfg.bgColor,
                cfg.borderColor
              )}
            >
              <Icon className="w-2.5 h-2.5" />
              {cfg.label} ×{count}
            </span>
          )
        })}
      </div>

      {/* 时间线步骤列表 */}
      {expanded && (
        <div className="p-3 space-y-2">
          {steps.map((step, i) => {
            const cfg = thoughtTypeConfig[step.type] || thoughtTypeConfig.think
            const Icon = cfg.icon
            const isStepExpanded = expandedSteps.has(step.id)
            const isLast = i === steps.length - 1
            return (
              <div key={step.id} className="relative flex gap-2.5">
                {/* 时间线节点 + 连接线 */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center border',
                      cfg.borderColor,
                      cfg.bgColor
                    )}
                  >
                    <Icon className={cn('w-3 h-3', cfg.color)} />
                  </div>
                  {!isLast && <div className="w-px flex-1 bg-cyber-border my-1 min-h-[12px]" />}
                </div>

                {/* 步骤内容 */}
                <div className={cn('flex-1 min-w-0 pb-2 rounded-lg border p-2', cfg.bgColor, cfg.borderColor)}>
                  <button
                    onClick={() => toggleStep(step.id)}
                    className="w-full flex items-center justify-between gap-2 text-left"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-wrap">
                      <span className="text-[10px] font-mono text-gray-600">#{i + 1}</span>
                      <span className={cn('text-xs font-mono font-bold', cfg.color)}>
                        {cfg.emoji} {cfg.label}
                      </span>
                      <span className="text-[10px] text-gray-600 font-mono">
                        {formatTimestamp(step.timestamp)}
                      </span>
                    </div>
                    {isStepExpanded ? (
                      <ChevronUp className="w-3 h-3 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-3 h-3 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  <div
                    className={cn(
                      'text-xs text-gray-400 mt-1 whitespace-pre-wrap break-words font-mono leading-relaxed',
                      !isStepExpanded && 'line-clamp-2 overflow-hidden'
                    )}
                  >
                    {step.content}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
