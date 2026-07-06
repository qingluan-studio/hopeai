import React, { useState, useRef, useEffect } from 'react';
import { Send, Play, Square, CheckCircle, Loader2, Check, X, ChevronDown, ChevronRight, Folder, FileText, Download, Sparkles, Cpu, Bot, Zap, Clock, AlertCircle, ListChecks, Package, Wrench } from 'lucide-react';
import { taskEngine, type AgentTask, type TaskStep, type TaskLog } from '@/engine/taskEngine';
import { cn } from '@/lib/utils';

export function AgentConsoleView() {
  const [tasks, setTasks] = useState<AgentTask[]>(() => taskEngine.getAllTasks());
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [useSwarm, setUseSwarm] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const activeTask = activeTaskId ? tasks.find(t => t.id === activeTaskId) : null;

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(taskEngine.getAllTasks());
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeTask?.logs.length]);

  const handleCreateTask = async () => {
    if (!input.trim() || isExecuting) return;

    const title = input.trim().slice(0, 50);
    const description = input.trim();
    setInput('');
    setIsExecuting(true);

    taskEngine.setOptions({ useSwarm });

    const task = taskEngine.createTask(title, description);
    setActiveTaskId(task.id);
    setTasks(taskEngine.getAllTasks());

    taskEngine.executeTask(task.id).finally(() => {
      setIsExecuting(false);
      setTasks(taskEngine.getAllTasks());
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCreateTask();
    }
  };

  const handleCancel = () => {
    if (activeTaskId) {
      taskEngine.cancelTask(activeTaskId);
    }
  };

  const completedSteps = activeTask?.steps.filter(s => s.status === 'completed').length || 0;
  const totalSteps = activeTask?.steps.length || 0;
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className="h-full flex flex-col">
      {/* 顶部标题栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Agent 控制台</h2>
            <p className="text-[10px] text-gray-500">自主规划 · 多Agent协作 · 端到端交付</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUseSwarm(!useSwarm)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-mono border transition-all',
              useSwarm
                ? 'bg-purple-900/30 text-purple-400 border-purple-700/40'
                : 'bg-gray-900/50 text-gray-400 border-gray-700/40 hover:bg-gray-800/50'
            )}
          >
            <Cpu className="w-3 h-3" />
            集群模式
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：任务列表 */}
        <div className="w-56 border-r border-gray-800/50 overflow-y-auto">
          <div className="p-3">
            <div className="text-[10px] font-mono text-gray-500 mb-2">任务历史</div>
            <div className="space-y-1.5">
              {tasks.length === 0 && (
                <div className="text-[10px] text-gray-600 text-center py-6">
                  暂无任务
                </div>
              )}
              {tasks.map(task => (
                <button
                  key={task.id}
                  onClick={() => setActiveTaskId(task.id)}
                  className={cn(
                    'w-full text-left p-2.5 rounded-lg border transition-all',
                    activeTaskId === task.id
                      ? 'bg-gray-800/50 border-gray-700/60'
                      : 'bg-gray-900/30 border-gray-800/40 hover:bg-gray-800/30'
                  )}
                >
                  <div className="text-[11px] text-white font-medium truncate">
                    {task.title}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <StatusBadge status={task.status} />
                    <span className="text-[9px] text-gray-600">
                      {formatTime(task.createdAt)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 中间：主内容区 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTask ? (
            <>
              {/* 任务进度条 */}
              <div className="px-4 py-3 border-b border-gray-800/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{activeTask.title}</h3>
                    <StatusBadge status={activeTask.status} />
                  </div>
                  {activeTask.status === 'running' && (
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-1 px-2 py-1 text-[10px] text-red-400 border border-red-800/40 rounded-lg hover:bg-red-900/20 transition-all"
                    >
                      <Square className="w-3 h-3" />
                      停止
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-cyan-500 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">
                    {completedSteps}/{totalSteps} 步
                  </span>
                </div>
              </div>

              <div className="flex-1 flex overflow-hidden">
                {/* 步骤列表 */}
                <div className="w-64 border-r border-gray-800/50 overflow-y-auto p-3">
                  <div className="text-[10px] font-mono text-gray-500 mb-2 flex items-center gap-1.5">
                    <ListChecks className="w-3 h-3" />
                    任务步骤
                  </div>
                  <div className="space-y-1">
                    {activeTask.steps.map((step, idx) => (
                      <StepItem key={step.id} step={step} index={idx + 1} />
                    ))}
                  </div>

                  {activeTask.deliverables.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-800/50">
                      <div className="text-[10px] font-mono text-gray-500 mb-2 flex items-center gap-1.5">
                        <Package className="w-3 h-3" />
                        交付物
                      </div>
                      <div className="space-y-1">
                        {activeTask.deliverables.map(d => (
                          <button
                            key={d.id}
                            onClick={() => taskEngine.downloadDeliverable(activeTask.id, d.id)}
                            className="w-full flex items-center gap-2 p-2 rounded-lg bg-gray-900/50 border border-gray-800/50 hover:bg-gray-800/50 transition-all text-left"
                          >
                            {d.type === 'file' ? <FileText className="w-3.5 h-3.5 text-cyan-400" /> :
                             d.type === 'archive' ? <Folder className="w-3.5 h-3.5 text-purple-400" /> :
                             <FileText className="w-3.5 h-3.5 text-green-400" />}
                            <div className="flex-1 min-w-0">
                              <div className="text-[10px] text-white truncate">{d.name}</div>
                              <div className="text-[9px] text-gray-500">
                                {d.size ? (d.size / 1024).toFixed(1) + ' KB' : '-'}
                              </div>
                            </div>
                            <Download className="w-3 h-3 text-gray-500" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 日志输出 */}
                <div className="flex-1 overflow-y-auto bg-black/30">
                  <div className="p-3 space-y-2">
                    {activeTask.logs.map((log, idx) => (
                      <LogItem key={idx} log={log} />
                    ))}
                    <div ref={logsEndRef} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/20 to-cyan-500/20 flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Agent 控制台</h3>
              <p className="text-[12px] text-gray-500 text-center max-w-xs mb-6">
                描述你的需求，AI 将自动规划任务、调用工具、多 Agent 协作完成
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-gray-900/50 border border-gray-800/50">
                  <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-1.5" />
                  <div className="text-[10px] text-white">自主规划</div>
                  <div className="text-[9px] text-gray-500">自动拆解任务</div>
                </div>
                <div className="p-3 rounded-xl bg-gray-900/50 border border-gray-800/50">
                  <Cpu className="w-5 h-5 text-purple-400 mx-auto mb-1.5" />
                  <div className="text-[10px] text-white">多Agent协作</div>
                  <div className="text-[9px] text-gray-500">专业分工执行</div>
                </div>
                <div className="p-3 rounded-xl bg-gray-900/50 border border-gray-800/50">
                  <Package className="w-5 h-5 text-cyan-400 mx-auto mb-1.5" />
                  <div className="text-[10px] text-white">端到端交付</div>
                  <div className="text-[9px] text-gray-500">直接产出文件</div>
                </div>
              </div>
            </div>
          )}

          {/* 底部输入框 */}
          <div className="border-t border-gray-800/50 p-3">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="描述你要完成的任务..."
                  rows={2}
                  className="w-full px-3 py-2.5 text-[12px] bg-gray-900/80 border border-gray-700/50 rounded-xl text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-cyan-600/50 focus:ring-1 focus:ring-cyan-600/30 resize-none"
                />
              </div>
              <button
                onClick={handleCreateTask}
                disabled={!input.trim() || isExecuting}
                className={cn(
                  'h-full px-4 py-2.5 rounded-xl font-mono text-[11px] flex items-center gap-1.5 transition-all',
                  input.trim() && !isExecuting
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:opacity-90 active:scale-95'
                    : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                )}
              >
                {isExecuting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {isExecuting ? '执行中' : '开始'}
              </button>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[9px] text-gray-600">
                示例：做一个个人作品集网站 / 分析销售数据 / 写一份产品需求文档
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepItem({ step, index }: { step: TaskStep; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const hasSubtasks = step.subtasks && step.subtasks.length > 0;

  return (
    <div className="rounded-lg border border-gray-800/40 overflow-hidden">
      <button
        onClick={() => hasSubtasks && setExpanded(!expanded)}
        className={cn(
          'w-full flex items-center gap-2 p-2 text-left transition-all',
          step.status === 'running' ? 'bg-gray-800/40' : 'hover:bg-gray-800/20'
        )}
      >
        <StepStatusIcon status={step.status} />
        <div className="flex-1 min-w-0">
          <div className={cn(
            'text-[11px] truncate',
            step.status === 'completed' ? 'text-gray-400 line-through' :
            step.status === 'failed' ? 'text-red-400' :
            step.status === 'running' ? 'text-white' : 'text-gray-500'
          )}>
            {index}. {step.title}
          </div>
          {step.agentRole && (
            <div className="text-[9px] text-gray-600 font-mono">
              {step.agentRole}
            </div>
          )}
        </div>
        {hasSubtasks && (
          expanded ? <ChevronDown className="w-3 h-3 text-gray-600 flex-shrink-0" /> :
          <ChevronRight className="w-3 h-3 text-gray-600 flex-shrink-0" />
        )}
      </button>
      {hasSubtasks && expanded && (
        <div className="px-2 pb-2 space-y-1">
          {step.subtasks!.map((sub, i) => (
            <div key={sub.id} className="flex items-center gap-1.5 pl-4">
              <StepStatusIcon status={sub.status} size="sm" />
              <span className={cn(
                'text-[10px] truncate',
                sub.status === 'completed' ? 'text-gray-500 line-through' :
                sub.status === 'running' ? 'text-gray-300' : 'text-gray-600'
              )}>
                {sub.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StepStatusIcon({ status, size = 'md' }: { status: TaskStep['status']; size?: 'sm' | 'md' }) {
  const iconClass = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  switch (status) {
    case 'completed':
      return <CheckCircle className={`${iconClass} text-green-500 flex-shrink-0`} />;
    case 'running':
      return <Loader2 className={`${iconClass} text-cyan-400 animate-spin flex-shrink-0`} />;
    case 'failed':
      return <X className={`${iconClass} text-red-500 flex-shrink-0`} />;
    case 'skipped':
      return <div className={`${iconClass} rounded-full border border-gray-600 flex-shrink-0`} />;
    default:
      return <div className={`${iconClass} rounded-full border-2 border-gray-700 flex-shrink-0`} />;
  }
}

function StatusBadge({ status }: { status: AgentTask['status'] }) {
  const config: Record<string, { label: string; className: string }> = {
    pending: { label: '等待中', className: 'bg-gray-800 text-gray-500 border-gray-700' },
    planning: { label: '规划中', className: 'bg-yellow-900/30 text-yellow-400 border-yellow-800/40' },
    running: { label: '执行中', className: 'bg-cyan-900/30 text-cyan-400 border-cyan-800/40' },
    completed: { label: '已完成', className: 'bg-green-900/30 text-green-400 border-green-800/40' },
    failed: { label: '失败', className: 'bg-red-900/30 text-red-400 border-red-800/40' },
    cancelled: { label: '已取消', className: 'bg-gray-800 text-gray-500 border-gray-700' },
  };

  const { label, className } = config[status] || config.pending;

  return (
    <span className={cn(
      'text-[9px] px-1.5 py-0.5 rounded border font-mono',
      className
    )}>
      {label}
    </span>
  );
}

function LogItem({ log }: { log: TaskLog }) {
  const icons: Record<string, React.ReactNode> = {
    info: <Clock className="w-3 h-3 text-gray-500" />,
    thinking: <Sparkles className="w-3 h-3 text-purple-400" />,
    tool: <Wrench className="w-3 h-3 text-cyan-400" />,
    agent: <Bot className="w-3 h-3 text-yellow-400" />,
    error: <AlertCircle className="w-3 h-3 text-red-400" />,
    success: <Check className="w-3 h-3 text-green-400" />,
  };

  const colors: Record<string, string> = {
    info: 'text-gray-400',
    thinking: 'text-purple-300',
    tool: 'text-cyan-300',
    agent: 'text-yellow-300',
    error: 'text-red-300',
    success: 'text-green-300',
  };

  return (
    <div className="flex gap-2">
      <div className="mt-0.5">{icons[log.type] || icons.info}</div>
      <div className="flex-1 min-w-0">
        <div className={cn('text-[11px]', colors[log.type] || colors.info)}>
          {log.message}
        </div>
        {log.detail && (
          <pre className="mt-1 p-2 text-[10px] text-gray-500 bg-gray-900/50 rounded-lg p-2 overflow-x-auto whitespace-pre-wrap">
            {log.detail.slice(0, 500)}
          </pre>
        )}
        <div className="text-[9px] text-gray-700 mt-0.5 font-mono">
          {formatTime(log.timestamp)}
        </div>
      </div>
    </div>
  );
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`;
  return date.toLocaleDateString();
}
