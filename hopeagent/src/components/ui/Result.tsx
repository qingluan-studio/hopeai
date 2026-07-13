import React from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, Search, ServerCrash } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
type ResultStatus = 'success' | 'error' | 'warning' | 'info' | '404' | '500' | '403'

interface ResultProps {
  /** 状态 */
  status?: ResultStatus
  /** 自定义图标 */
  icon?: React.ReactNode
  /** 标题 */
  title?: React.ReactNode
  /** 副标题 */
  subTitle?: React.ReactNode
  /** 额外内容 */
  extra?: React.ReactNode
  /** 自定义类名 */
  className?: string
}

// ============ 状态映射 ============
const statusConfig: Record<ResultStatus, { icon: React.ComponentType<any>; color: string; defaultTitle: string }> = {
  success: { icon: CheckCircle, color: '#10b981', defaultTitle: '操作成功' },
  error: { icon: XCircle, color: '#ef4444', defaultTitle: '操作失败' },
  warning: { icon: AlertTriangle, color: '#f59e0b', defaultTitle: '注意警告' },
  info: { icon: Info, color: '#00d4ff', defaultTitle: '信息提示' },
  '404': { icon: Search, color: '#00ff88', defaultTitle: '404 页面不存在' },
  '500': { icon: ServerCrash, color: '#ef4444', defaultTitle: '500 服务器错误' },
  '403': { icon: ServerCrash, color: '#f59e0b', defaultTitle: '403 拒绝访问' },
}

/**
 * Cyber 终端风格结果页
 * - success / error / warning / info / 404 / 500 / 403
 */
export function Result({
  status = 'info',
  icon,
  title,
  subTitle,
  extra,
  className,
}: ResultProps) {
  const config = statusConfig[status]
  const Icon = config.icon
  const displayTitle = title ?? config.defaultTitle

  // 大号错误码显示
  const isErrorCode = status === '404' || status === '500' || status === '403'

  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-8 px-4', className)}>
      {/* 图标 */}
      <div className="relative mb-4">
        {icon ? (
          icon
        ) : isErrorCode ? (
          <div
            className="text-6xl font-mono font-black"
            style={{
              color: config.color,
              textShadow: `0 0 20px ${config.color}88`,
            }}
          >
            {status}
          </div>
        ) : (
          <div className="relative">
            <Icon
              className="w-16 h-16"
              style={{ color: config.color, filter: `drop-shadow(0 0 8px ${config.color}88)` }}
              strokeWidth={1.5}
            />
            {/* 扫描线 */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute left-0 right-0 h-px"
                style={{ backgroundColor: `${config.color}66`, animation: 'scanMove 3s linear infinite' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 标题 */}
      <div className="text-lg font-mono font-bold text-cyber-text mb-1">
        {displayTitle}
      </div>

      {/* 副标题 */}
      {subTitle && (
        <div className="text-sm text-gray-500 font-mono max-w-md">
          {subTitle}
        </div>
      )}

      {/* 额外内容 */}
      {extra && <div className="mt-4">{extra}</div>}
    </div>
  )
}

export default Result
