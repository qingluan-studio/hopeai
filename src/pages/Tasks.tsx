import { useState } from 'react'
import { Plus, CheckCircle2, Clock, AlertTriangle, X, ChevronRight, MessageSquare, ListTodo, Flag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTaskStore, type Task } from '@/store/useTaskStore'
import { useAgentStore } from '@/store/useAgentStore'

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: any }> = {
  'all': { label: '全部', color: 'text-gray-400', bg: 'bg-gray-900/40', border: 'border-gray-700/50', icon: ListTodo },
  'todo': { label: '待办', color: 'text-gray-400', bg: 'bg-gray-900/40', border: 'border-gray-700/50', icon: Clock },
  'in-progress': { label: '进行中', color: 'text-blue-400', bg: 'bg-blue-900/30', border: 'border-blue-700/50', icon: Clock },
  'review': { label: '审查中', color: 'text-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-700/50', icon: AlertTriangle },
  'done': { label: '已完成', color: 'text-green-400', bg: 'bg-green-900/30', border: 'border-green-700/50', icon: CheckCircle2 },
}

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: '低', color: 'text-gray-500' },
  medium: { label: '中', color: 'text-blue-400' },
  high: { label: '高', color: 'text-orange-400' },
  urgent: { label: '紧急', color: 'text-red-400' },
}

function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const status = statusConfig[task.status] || statusConfig.todo
  const priority = priorityConfig[task.priority] || priorityConfig.medium
  const { agents } = useAgentStore()
  const assignee = agents.find(a => a.id === task.assignee)
  const doneSubtasks = task.subtasks.filter(s => s.done).length
  const totalSubtasks = task.subtasks.length
  const progress = totalSubtasks > 0 ? Math.round((doneSubtasks / totalSubtasks) * 100) : 0

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-3.5 rounded-xl border transition-all active:scale-[0.98] cursor-pointer',
        status.bg, status.border
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('p-1.5 rounded-lg flex-shrink-0', status.bg, status.border)}>
          <Flag className={cn('w-4 h-4', status.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-[13px] font-mono text-gray-100 font-medium truncate">{task.title}</h3>
            <span className={cn('text-[10px] font-mono flex-shrink-0', priority.color)}>
              {priority.label}
            </span>
          </div>
          <p className="text-[11px] text-gray-500 line-clamp-2 mb-2">{task.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500">{task.department}</span>
              {assignee && (
                <span className="text-[10px] text-gray-400">· {assignee.name}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              <span className="text-[10px] text-gray-500 font-mono">{doneSubtasks}/{totalSubtasks}</span>
            </div>
          </div>
          {totalSubtasks > 0 && (
            <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={cn('h-full transition-all', task.status === 'done' ? 'bg-green-500' : 'bg-blue-500')}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
        <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
      </div>
    </div>
  )
}

function TaskDetailModal({ task, onClose }: { task: Task; onClose: () => void }) {
  const { toggleSubtask, addComment } = useTaskStore()
  const { agents } = useAgentStore()
  const [comment, setComment] = useState('')
  const assignee = agents.find(a => a.id === task.assignee)
  const status = statusConfig[task.status] || statusConfig.todo
  const priority = priorityConfig[task.priority] || priorityConfig.medium
  const doneSubtasks = task.subtasks.filter(s => s.done).length
  const progress = task.subtasks.length > 0 ? Math.round((doneSubtasks / task.subtasks.length) * 100) : 0

  const handleAddComment = () => {
    if (!comment.trim()) return
    addComment(task.id, 'chairman', comment.trim())
    setComment('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md bg-gray-950 border-t border-green-900/40 rounded-t-2xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 顶部把手 */}
        <div className="flex-shrink-0 flex justify-center py-2">
          <div className="w-10 h-1 bg-gray-700 rounded-full" />
        </div>

        {/* 头部 */}
        <div className="flex-shrink-0 px-4 pb-3 border-b border-gray-800">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-base font-mono text-green-400 font-bold flex-1 pr-2">{task.title}</h2>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-800">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className={cn('px-2 py-0.5 rounded-md text-[10px] font-mono', status.bg, status.border, status.color)}>
              {status.label}
            </span>
            <span className={cn('text-[10px] font-mono flex items-center gap-1', priority.color)}>
              <Flag className="w-3 h-3" />
              {priority.label}优先级
            </span>
          </div>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 描述 */}
          <div>
            <h4 className="text-[11px] font-mono text-gray-500 mb-1.5">任务描述</h4>
            <p className="text-[12px] text-gray-300 leading-relaxed">{task.description}</p>
          </div>

          {/* 信息 */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-gray-900/50 border border-gray-800">
              <div className="text-[10px] text-gray-500 mb-1">负责部门</div>
              <div className="text-[12px] text-gray-300">{task.department}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-900/50 border border-gray-800">
              <div className="text-[10px] text-gray-500 mb-1">负责人</div>
              <div className="text-[12px] text-gray-300">{assignee?.name || '未分配'}</div>
            </div>
          </div>

          {/* 子任务 */}
          {task.subtasks.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[11px] font-mono text-gray-500">子任务</h4>
                <span className="text-[10px] text-gray-500 font-mono">{progress}%</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden mb-2">
                <div
                  className={cn('h-full transition-all', task.status === 'done' ? 'bg-green-500' : 'bg-blue-500')}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="space-y-1.5">
                {task.subtasks.map((subtask) => (
                  <button
                    key={subtask.id}
                    onClick={() => toggleSubtask(task.id, subtask.id)}
                    className={cn(
                      'w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all',
                      subtask.done ? 'bg-green-900/20 border border-green-800/30' : 'bg-gray-900/50 border border-gray-800'
                    )}
                  >
                    <div className={cn(
                      'w-4 h-4 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all',
                      subtask.done ? 'bg-green-500 border-green-500' : 'border-gray-600'
                    )}>
                      {subtask.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <span className={cn(
                      'text-[12px] flex-1',
                      subtask.done ? 'text-gray-500 line-through' : 'text-gray-300'
                    )}>
                      {subtask.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 标签 */}
          {task.tags.length > 0 && (
            <div>
              <h4 className="text-[11px] font-mono text-gray-500 mb-2">标签</h4>
              <div className="flex flex-wrap gap-1.5">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-gray-800/60 border border-gray-700/50 text-[10px] text-gray-400 font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 评论 */}
          <div>
            <h4 className="text-[11px] font-mono text-gray-500 mb-2 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              评论 ({task.comments.length})
            </h4>
            {task.comments.length > 0 ? (
              <div className="space-y-2 mb-3">
                {task.comments.map((c) => {
                  const commentAuthor = agents.find(a => a.id === c.author)
                  return (
                    <div key={c.id} className="p-2.5 rounded-xl bg-gray-900/50 border border-gray-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-mono text-green-400">
                          {commentAuthor?.name || c.author}
                        </span>
                        <span className="text-[9px] text-gray-600 font-mono">
                          {new Date(c.time).toLocaleString('zh-CN')}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-300">{c.content}</p>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-[11px] text-gray-600 mb-3">暂无评论</p>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder="添加评论..."
                className="flex-1 px-3 py-2 rounded-xl bg-gray-900/80 border border-gray-800 text-[12px] text-gray-200 placeholder-gray-600 outline-none focus:border-green-700/50 transition-colors"
              />
              <button
                onClick={handleAddComment}
                disabled={!comment.trim()}
                className={cn(
                  'px-3 py-2 rounded-xl text-[11px] font-mono transition-all',
                  comment.trim()
                    ? 'bg-green-600 text-white hover:bg-green-500'
                    : 'bg-gray-800 text-gray-600'
                )}
              >
                发送
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Tasks() {
  const { tasks, selectedTask, selectTask, filterStatus, setFilterStatus } = useTaskStore()
  const [showNewTask, setShowNewTask] = useState(false)

  const filteredTasks = tasks.filter(t => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false
    return true
  })

  const selected = tasks.find(t => t.id === selectedTask)

  const statusTabs = ['all', 'todo', 'in-progress', 'review', 'done']

  return (
    <div className="min-h-full flex flex-col pb-20">
      {/* 顶部标题栏 */}
      <div className="sticky top-0 z-20 bg-gray-950/90 backdrop-blur-md border-b border-green-900/30 px-4 pt-3 pb-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-900/30 border border-orange-700/50 flex items-center justify-center">
              <ListTodo className="w-4.5 h-4.5 text-orange-400" />
            </div>
            <div>
              <h1 className="text-sm font-mono font-bold text-orange-400" style={{ textShadow: '0 0 8px rgba(251,146,60,0.5)' }}>
                任务中心
              </h1>
              <p className="text-[9px] font-mono text-gray-500 -mt-0.5">项目管理 · 进度追踪</p>
            </div>
          </div>
          <button
            onClick={() => setShowNewTask(true)}
            className="p-2 rounded-lg bg-orange-900/30 border border-orange-700/50 hover:bg-orange-900/50 transition-all"
          >
            <Plus className="w-4 h-4 text-orange-400" />
          </button>
        </div>

        {/* 状态筛选 */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1">
          {statusTabs.map((s) => {
            const cfg = statusConfig[s]
            const count = s === 'all' ? tasks.length : tasks.filter(t => t.status === s).length
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={cn(
                  'flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-mono transition-all flex items-center gap-1.5',
                  filterStatus === s
                    ? cn(cfg.bg, cfg.border, cfg.color, 'border')
                    : 'text-gray-500 hover:text-gray-300'
                )}
              >
                {cfg.label}
                <span className={cn(
                  'px-1.5 py-0.5 rounded text-[9px]',
                  filterStatus === s ? 'bg-black/20' : 'bg-gray-800/60'
                )}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 任务列表 */}
      <div className="flex-1 p-3 space-y-2.5 max-w-md mx-auto w-full">
        {filteredTasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-20 text-center">
            <ListTodo className="w-12 h-12 text-gray-700 mb-3" />
            <p className="text-[13px] text-gray-500">暂无任务</p>
            <p className="text-[11px] text-gray-600 mt-1">点击右上角 + 创建新任务</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => selectTask(task.id)}
            />
          ))
        )}
      </div>

      {/* 任务详情弹窗 */}
      {selected && (
        <TaskDetailModal task={selected} onClose={() => selectTask(null)} />
      )}
    </div>
  )
}
