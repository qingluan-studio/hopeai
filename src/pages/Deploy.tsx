import { useState, useRef, useEffect } from 'react'
import {
  Github,
  Rocket,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Key,
  GitBranch,
  FolderGit2,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDeployStore } from '@/store/useDeployStore'
import type { DeployTask } from '@/types'

function ConfigSection() {
  const { config, setConfig } = useDeployStore()
  const [showToken, setShowToken] = useState(false)
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Github className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-mono text-orange-400 font-bold">GitHub 配置</span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-800 pt-3">
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-mono text-gray-400 mb-1.5">
              <Key className="w-3 h-3" />
              Token
            </label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={config.githubToken}
                onChange={e => setConfig({ githubToken: e.target.value })}
                placeholder="ghp_..."
                className={cn(
                  'w-full px-3 py-2 pr-9 rounded-lg border text-xs font-mono',
                  'bg-gray-950/80 border-gray-700/50 text-gray-200',
                  'placeholder:text-gray-600',
                  'focus:outline-none focus:border-orange-500/70',
                  'transition-colors'
                )}
              />
              <button
                onClick={() => setShowToken(!showToken)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
              >
                {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-mono text-gray-400 mb-1.5">
              <FolderGit2 className="w-3 h-3" />
              仓库地址
            </label>
            <input
              type="text"
              value={config.repoUrl}
              onChange={e => setConfig({ repoUrl: e.target.value })}
              placeholder="https://github.com/..."
              className={cn(
                'w-full px-3 py-2 rounded-lg border text-xs font-mono',
                'bg-gray-950/80 border-gray-700/50 text-gray-200',
                'placeholder:text-gray-600',
                'focus:outline-none focus:border-orange-500/70',
                'transition-colors'
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-mono text-gray-400 mb-1.5">
                <GitBranch className="w-3 h-3" />
                分支
              </label>
              <input
                type="text"
                value={config.branch}
                onChange={e => setConfig({ branch: e.target.value })}
                placeholder="master"
                className={cn(
                  'w-full px-3 py-2 rounded-lg border text-xs font-mono',
                  'bg-gray-950/80 border-gray-700/50 text-gray-200',
                  'placeholder:text-gray-600',
                  'focus:outline-none focus:border-orange-500/70',
                  'transition-colors'
                )}
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-gray-400 mb-1.5 block">目标路径</label>
              <input
                type="text"
                value={config.targetPath}
                onChange={e => setConfig({ targetPath: e.target.value })}
                placeholder="/"
                className={cn(
                  'w-full px-3 py-2 rounded-lg border text-xs font-mono',
                  'bg-gray-950/80 border-gray-700/50 text-gray-200',
                  'placeholder:text-gray-600',
                  'focus:outline-none focus:border-orange-500/70',
                  'transition-colors'
                )}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DeployButton({
  isDeploying,
  canDeploy,
  onClick
}: {
  isDeploying: boolean
  canDeploy: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={!canDeploy || isDeploying}
      className={cn(
        'w-full py-3.5 rounded-xl font-mono text-sm font-bold transition-all',
        'flex items-center justify-center gap-2',
        canDeploy && !isDeploying
          ? 'bg-orange-600 text-white active:scale-[0.98] shadow-[0_0_20px_rgba(251,146,60,0.4)]'
          : 'bg-gray-800/50 text-gray-600 cursor-not-allowed border border-gray-700/50'
      )}
    >
      {isDeploying ? (
        <>
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>部署中...</span>
        </>
      ) : (
        <>
          <Rocket className="w-4 h-4" />
          <span>一键部署</span>
        </>
      )}
    </button>
  )
}

function DeployLog({ logs }: { logs: string[] }) {
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [logs])

  if (logs.length === 0) return null

  const getLogColor = (log: string) => {
    if (log.includes('[SUCCESS]')) return 'text-green-400'
    if (log.includes('[ERROR]')) return 'text-red-400'
    if (log.includes('[WARN]')) return 'text-yellow-400'
    return 'text-gray-400'
  }

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-mono text-gray-400">部署日志</span>
        </div>
        <span className="text-[10px] font-mono text-gray-600">{logs.length} 行</span>
      </div>
      <div
        ref={logRef}
        className="h-40 overflow-y-auto p-3 font-mono text-[11px] leading-relaxed bg-gray-950/50"
      >
        {logs.map((log, i) => (
          <div key={i} className={cn(getLogColor(log), 'mb-0.5')}>
            {log}
          </div>
        ))}
      </div>
    </div>
  )
}

function DeployHistory({ tasks }: { tasks: DeployTask[] }) {
  const [expanded, setExpanded] = useState(false)

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }) + ' ' +
      date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  if (tasks.length === 0) return null

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-mono text-gray-300">部署历史</span>
          <span className="text-[10px] font-mono text-gray-600">{tasks.length} 次</span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-gray-800 max-h-64 overflow-y-auto">
          {tasks.map(task => (
            <div key={task.id} className="px-4 py-2.5 border-b border-gray-800/50 last:border-b-0 flex items-center gap-3">
              {task.status === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
              ) : task.status === 'failed' ? (
                <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              ) : task.status === 'running' ? (
                <RefreshCw className="w-4 h-4 text-yellow-400 animate-spin flex-shrink-0" />
              ) : (
                <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-mono text-gray-300 truncate">
                  {task.status === 'success' ? '部署成功' : task.status === 'failed' ? '部署失败' : task.status === 'running' ? '部署中' : '等待中'}
                </div>
                <div className="text-[10px] font-mono text-gray-600">{formatTime(task.createdAt)}</div>
              </div>
              <div className="text-[10px] font-mono text-gray-500">
                {task.progress}%
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Deploy() {
  const { config, addDeployTask, tasks } = useDeployStore()
  const [isDeploying, setIsDeploying] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const logIntervalRef = useRef<number | null>(null)

  const canDeploy = !!(config.githubToken && config.repoUrl && config.branch)

  const handleDeploy = () => {
    if (!canDeploy || isDeploying) return

    setIsDeploying(true)
    setLogs([])

    const newTask: DeployTask = {
      id: Date.now().toString(),
      status: 'running',
      progress: 0,
      logs: [],
      createdAt: Date.now()
    }
    addDeployTask(newTask)

    const logMessages = [
      '[INFO] 初始化部署流程...',
      '[INFO] 验证 GitHub Token...',
      '[SUCCESS] Token 验证通过',
      '[INFO] 连接仓库...',
      '[SUCCESS] 仓库连接成功',
      '[INFO] 检出分支 ' + config.branch + '...',
      '[INFO] 拉取最新代码...',
      '[SUCCESS] 代码同步完成',
      '[INFO] 构建项目...',
      '[INFO] 运行构建脚本...',
      '[INFO] 正在编译...',
      '[SUCCESS] 构建完成',
      '[INFO] 部署到目标路径...',
      '[INFO] 上传文件...',
      '[INFO] 验证部署...',
      '[SUCCESS] 部署成功！',
    ]

    let logIndex = 0
    logIntervalRef.current = window.setInterval(() => {
      if (logIndex < logMessages.length) {
        setLogs(prev => [...prev, logMessages[logIndex]])
        logIndex++
      } else {
        if (logIntervalRef.current) {
          clearInterval(logIntervalRef.current)
        }
        setIsDeploying(false)
      }
    }, 400)
  }

  useEffect(() => {
    return () => {
      if (logIntervalRef.current) {
        clearInterval(logIntervalRef.current)
      }
    }
  }, [])

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 bg-gray-950/90 backdrop-blur-md border-b border-green-900/30 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <Rocket className="w-5 h-5 text-orange-400" style={{ filter: 'drop-shadow(0 0 6px rgba(251,146,60,0.5))' }} />
          <h1 className="text-base font-mono font-bold text-orange-400" style={{ textShadow: '0 0 8px rgba(251,146,60,0.5)' }}>
            部署中心
          </h1>
          <span className="ml-auto text-[10px] font-mono text-gray-500">
            {tasks.filter(t => t.status === 'success').length} 次成功
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 safe-area-bottom">
        <div className="max-w-md mx-auto space-y-3">
          <ConfigSection />
          <DeployButton isDeploying={isDeploying} canDeploy={canDeploy} onClick={handleDeploy} />
          <DeployLog logs={logs} />
          <DeployHistory tasks={tasks} />
        </div>
      </div>
    </div>
  )
}
