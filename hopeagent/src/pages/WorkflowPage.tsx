import { useState } from 'react'
import {
  GitBranch,
  Play,
  Pause,
  Save,
  Trash2,
  Plus,
  Settings,
  Clock,
  Zap,
  Search,
  Code,
  FileText,
  Mail,
  Webhook,
  Timer,
  Brain,
  BookOpen,
  GitMerge,
  Repeat,
  Layers,
  Send,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  History,
  Copy,
  Download,
  GripVertical,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock3,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// 节点类型定义
type NodeType = 'trigger' | 'ai' | 'tool' | 'logic' | 'output'

interface WorkflowNode {
  id: string
  type: NodeType
  subType: string
  name: string
  description: string
  icon: string
  color: string
  config?: Record<string, any>
}

interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  icon: string
  nodes: WorkflowNode[]
  isMy?: boolean
}

interface WorkflowRun {
  id: string
  workflowId: string
  workflowName: string
  status: 'success' | 'running' | 'failed' | 'pending'
  startTime: string
  duration: string
  steps: number
}

// 节点类型配置
const nodeTypeConfig: Record<NodeType, { label: string; color: string; subTypes: { id: string; name: string; icon: string; desc: string }[] }> = {
  trigger: {
    label: '触发节点',
    color: '#00ff88',
    subTypes: [
      { id: 'schedule', name: '定时触发', icon: '⏰', desc: '按设定时间自动执行' },
      { id: 'api', name: 'API 调用', icon: '🔌', desc: '通过 API 请求触发' },
      { id: 'webhook', name: 'Webhook', icon: '🎯', desc: '接收外部 Webhook 触发' },
      { id: 'manual', name: '手动触发', icon: '👆', desc: '点击按钮手动执行' },
    ],
  },
  ai: {
    label: 'AI 节点',
    color: '#00d4ff',
    subTypes: [
      { id: 'llm', name: 'LLM 调用', icon: '🤖', desc: '调用大语言模型' },
      { id: 'agent', name: 'Agent 执行', icon: '🧠', desc: '执行指定 Agent 任务' },
      { id: 'knowledge', name: '知识库检索', icon: '📚', desc: '从知识库中检索信息' },
    ],
  },
  tool: {
    label: '工具节点',
    color: '#c084fc',
    subTypes: [
      { id: 'websearch', name: 'Web 搜索', icon: '🔍', desc: '在互联网上搜索信息' },
      { id: 'code', name: '代码执行', icon: '💻', desc: '运行代码片段' },
      { id: 'file', name: '文件操作', icon: '📁', desc: '读写文件操作' },
    ],
  },
  logic: {
    label: '逻辑节点',
    color: '#fbbf24',
    subTypes: [
      { id: 'condition', name: '条件分支', icon: '🔀', desc: '根据条件选择分支' },
      { id: 'loop', name: '循环', icon: '🔄', desc: '循环执行直到满足条件' },
      { id: 'parallel', name: '并行', icon: '🔗', desc: '同时执行多个分支' },
      { id: 'wait', name: '等待', icon: '⏳', desc: '等待一段时间或事件' },
    ],
  },
  output: {
    label: '输出节点',
    color: '#f472b6',
    subTypes: [
      { id: 'message', name: '发送消息', icon: '💬', desc: '发送消息到指定渠道' },
      { id: 'webhook', name: '调用 Webhook', icon: '📡', desc: '调用外部 Webhook' },
      { id: 'file', name: '写文件', icon: '📝', desc: '将结果写入文件' },
      { id: 'email', name: '发邮件', icon: '📧', desc: '发送电子邮件' },
    ],
  },
}

// 工作流模板
const workflowTemplates: WorkflowTemplate[] = [
  {
    id: '1',
    name: '日报生成器',
    description: '自动收集每日工作内容，生成结构化日报',
    category: '办公',
    icon: '📊',
    nodes: [
      { id: 'n1', type: 'trigger', subType: 'schedule', name: '每日定时', description: '每天 18:00 触发', icon: '⏰', color: '#00ff88' },
      { id: 'n2', type: 'ai', subType: 'llm', name: '内容整理', description: '整理今日对话记录', icon: '🤖', color: '#00d4ff' },
      { id: 'n3', type: 'output', subType: 'email', name: '发送邮件', description: '发送到指定邮箱', icon: '📧', color: '#f472b6' },
    ],
    isMy: true,
  },
  {
    id: '2',
    name: '内容审核工作流',
    description: '自动审核用户提交的内容，过滤违规信息',
    category: '内容',
    icon: '🛡️',
    nodes: [
      { id: 'n1', type: 'trigger', subType: 'webhook', name: '内容提交', description: '用户提交内容时触发', icon: '🎯', color: '#00ff88' },
      { id: 'n2', type: 'ai', subType: 'llm', name: '内容审核', description: 'AI 检测违规内容', icon: '🤖', color: '#00d4ff' },
      { id: 'n3', type: 'logic', subType: 'condition', name: '结果判断', description: '是否通过审核', icon: '🔀', color: '#fbbf24' },
      { id: 'n4', type: 'output', subType: 'message', name: '通知结果', description: '通知用户审核结果', icon: '💬', color: '#f472b6' },
    ],
    isMy: true,
  },
  {
    id: '3',
    name: '数据清洗管道',
    description: '自动收集、清洗、结构化数据',
    category: '数据',
    icon: '🧹',
    nodes: [
      { id: 'n1', type: 'trigger', subType: 'manual', name: '手动触发', description: '点击开始执行', icon: '👆', color: '#00ff88' },
      { id: 'n2', type: 'tool', subType: 'websearch', name: '数据采集', description: '从多源采集数据', icon: '🔍', color: '#c084fc' },
      { id: 'n3', type: 'tool', subType: 'code', name: '数据清洗', description: '执行清洗脚本', icon: '💻', color: '#c084fc' },
      { id: 'n4', type: 'output', subType: 'file', name: '保存结果', description: '保存为结构化文件', icon: '📝', color: '#f472b6' },
    ],
    isMy: true,
  },
  {
    id: '4',
    name: '客户自动回复',
    description: '智能客服自动回复常见问题',
    category: '客服',
    icon: '💁',
    nodes: [
      { id: 'n1', type: 'trigger', subType: 'webhook', name: '收到消息', description: '客户发送消息时触发', icon: '🎯', color: '#00ff88' },
      { id: 'n2', type: 'ai', subType: 'knowledge', name: '知识库检索', description: '匹配相关知识条目', icon: '📚', color: '#00d4ff' },
      { id: 'n3', type: 'ai', subType: 'llm', name: '生成回复', description: '基于检索结果生成回答', icon: '🤖', color: '#00d4ff' },
      { id: 'n4', type: 'output', subType: 'message', name: '发送回复', description: '回复客户消息', icon: '💬', color: '#f472b6' },
    ],
  },
  {
    id: '5',
    name: '知识库构建',
    description: '自动从文档中提取知识并入库',
    category: '知识',
    icon: '📚',
    nodes: [
      { id: 'n1', type: 'trigger', subType: 'file', name: '文件上传', description: '上传文档时触发', icon: '📁', color: '#00ff88' },
      { id: 'n2', type: 'tool', subType: 'file', name: '文档解析', description: '解析文档内容', icon: '📁', color: '#c084fc' },
      { id: 'n3', type: 'ai', subType: 'llm', name: '知识提取', description: '提取结构化知识', icon: '🤖', color: '#00d4ff' },
      { id: 'n4', type: 'output', subType: 'file', name: '存入知识库', description: '保存到知识库', icon: '📝', color: '#f472b6' },
    ],
  },
  {
    id: '6',
    name: '代码审查工作流',
    description: '自动审查代码质量和安全问题',
    category: '开发',
    icon: '🔍',
    nodes: [
      { id: 'n1', type: 'trigger', subType: 'webhook', name: '代码提交', description: 'Git 提交时触发', icon: '🎯', color: '#00ff88' },
      { id: 'n2', type: 'tool', subType: 'code', name: '静态分析', description: '运行静态代码检查', icon: '💻', color: '#c084fc' },
      { id: 'n3', type: 'ai', subType: 'llm', name: 'AI 审查', description: 'AI 深度代码审查', icon: '🤖', color: '#00d4ff' },
      { id: 'n4', type: 'output', subType: 'message', name: '生成报告', description: '发送审查报告', icon: '💬', color: '#f472b6' },
    ],
  },
  {
    id: '7',
    name: '社媒内容发布',
    description: '自动生成并发布社交媒体内容',
    category: '营销',
    icon: '📱',
    nodes: [
      { id: 'n1', type: 'trigger', subType: 'schedule', name: '定时发布', description: '按计划时间触发', icon: '⏰', color: '#00ff88' },
      { id: 'n2', type: 'ai', subType: 'llm', name: '内容生成', description: '生成社媒文案', icon: '🤖', color: '#00d4ff' },
      { id: 'n3', type: 'logic', subType: 'condition', name: '人工审核', description: '是否需要人工确认', icon: '🔀', color: '#fbbf24' },
      { id: 'n4', type: 'output', subType: 'webhook', name: '发布内容', description: '发布到各平台', icon: '📡', color: '#f472b6' },
    ],
  },
  {
    id: '8',
    name: '周报汇总',
    description: '自动收集一周工作，生成周报',
    category: '办公',
    icon: '📋',
    nodes: [
      { id: 'n1', type: 'trigger', subType: 'schedule', name: '每周五', description: '每周五 17:00 触发', icon: '⏰', color: '#00ff88' },
      { id: 'n2', type: 'tool', subType: 'file', name: '数据收集', description: '收集本周所有记录', icon: '📁', color: '#c084fc' },
      { id: 'n3', type: 'ai', subType: 'llm', name: '内容总结', description: 'AI 总结本周工作', icon: '🤖', color: '#00d4ff' },
      { id: 'n4', type: 'output', subType: 'email', name: '发送周报', description: '发送周报邮件', icon: '📧', color: '#f472b6' },
    ],
  },
  {
    id: '9',
    name: '翻译工作流',
    description: '多语言文档自动翻译与排版',
    category: '内容',
    icon: '🌐',
    nodes: [
      { id: 'n1', type: 'trigger', subType: 'manual', name: '上传文档', description: '手动上传待翻译文档', icon: '👆', color: '#00ff88' },
      { id: 'n2', type: 'ai', subType: 'llm', name: 'AI 翻译', description: '调用 AI 进行翻译', icon: '🤖', color: '#00d4ff' },
      { id: 'n3', type: 'logic', subType: 'parallel', name: '多语言并行', description: '同时翻译多种语言', icon: '🔗', color: '#fbbf24' },
      { id: 'n4', type: 'output', subType: 'file', name: '导出文件', description: '导出多语言版本', icon: '📝', color: '#f472b6' },
    ],
  },
  {
    id: '10',
    name: '工单自动处理',
    description: '自动分类、分配和处理客服工单',
    category: '客服',
    icon: '🎫',
    nodes: [
      { id: 'n1', type: 'trigger', subType: 'webhook', name: '工单创建', description: '新工单创建时触发', icon: '🎯', color: '#00ff88' },
      { id: 'n2', type: 'ai', subType: 'llm', name: '工单分类', description: 'AI 自动分类工单', icon: '🤖', color: '#00d4ff' },
      { id: 'n3', type: 'logic', subType: 'condition', name: '优先级判断', description: '根据优先级处理', icon: '🔀', color: '#fbbf24' },
      { id: 'n4', type: 'output', subType: 'message', name: '分配通知', description: '通知处理人员', icon: '💬', color: '#f472b6' },
    ],
  },
]

// 运行历史
const runHistory: WorkflowRun[] = [
  { id: 'r1', workflowId: '1', workflowName: '日报生成器', status: 'success', startTime: '今天 18:00', duration: '45s', steps: 3 },
  { id: 'r2', workflowId: '2', workflowName: '内容审核工作流', status: 'running', startTime: '刚刚', duration: '-', steps: 2 },
  { id: 'r3', workflowId: '3', workflowName: '数据清洗管道', status: 'success', startTime: '今天 14:30', duration: '2m 30s', steps: 4 },
  { id: 'r4', workflowId: '1', workflowName: '日报生成器', status: 'failed', startTime: '昨天 18:00', duration: '15s', steps: 1 },
  { id: 'r5', workflowId: '5', workflowName: '知识库构建', status: 'success', startTime: '昨天 10:20', duration: '5m 12s', steps: 4 },
]

export default function WorkflowPage() {
  const [activeTab, setActiveTab] = useState<'my' | 'templates' | 'history'>('my')
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowTemplate | null>(workflowTemplates[0])
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [expandedTypes, setExpandedTypes] = useState<Record<NodeType, boolean>>({
    trigger: true,
    ai: true,
    tool: false,
    logic: false,
    output: false,
  })
  const [nodes, setNodes] = useState<WorkflowNode[]>(workflowTemplates[0]?.nodes || [])

  const toggleType = (type: NodeType) => {
    setExpandedTypes(prev => ({ ...prev, [type]: !prev[type] }))
  }

  const handleRun = () => {
    setIsRunning(true)
    setTimeout(() => setIsRunning(false), 3000)
  }

  const addNode = (type: NodeType, subType: { id: string; name: string; icon: string; desc: string }) => {
    const newNode: WorkflowNode = {
      id: `n_${Date.now()}`,
      type,
      subType: subType.id,
      name: subType.name,
      description: subType.desc,
      icon: subType.icon,
      color: nodeTypeConfig[type].color,
    }
    setNodes(prev => [...prev, newNode])
  }

  const deleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId))
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null)
    }
  }

  const moveNode = (index: number, direction: 'up' | 'down') => {
    const newNodes = [...nodes]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= nodes.length) return
    ;[newNodes[index], newNodes[newIndex]] = [newNodes[newIndex], newNodes[index]]
    setNodes(newNodes)
  }

  const getStatusIcon = (status: WorkflowRun['status']) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-green-400" />
      case 'running': return <Clock3 className="w-4 h-4 text-blue-400 animate-spin" />
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />
    }
  }

  const getStatusText = (status: WorkflowRun['status']) => {
    switch (status) {
      case 'success': return '成功'
      case 'running': return '运行中'
      case 'failed': return '失败'
      case 'pending': return '等待中'
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* 顶部标题栏 */}
      <div className="border-b border-cyber-border bg-cyber-panel/50 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-cyber-text flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-cyber-accent" />
              工作流编排
            </h1>
            <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
              可视化编排 · 自动化流程 · 高效执行
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {}}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-cyber-border/50 text-gray-400 text-xs font-mono hover:border-cyber-accent/30 hover:text-gray-300 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              保存
            </button>
            <button
              onClick={handleRun}
              disabled={isRunning}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all',
                isRunning
                  ? 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400'
                  : 'bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent hover:bg-cyber-accent/20'
              )}
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isRunning ? '运行中' : '运行'}
            </button>
          </div>
        </div>

        {/* 标签页 */}
        <div className="flex items-center gap-1 mt-3">
          {[
            { id: 'my', label: '我的工作流', icon: FolderOpen },
            { id: 'templates', label: '模板库', icon: Sparkles },
            { id: 'history', label: '运行历史', icon: History },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all',
                activeTab === tab.id
                  ? 'bg-cyber-accent/10 text-cyber-accent'
                  : 'text-gray-500 hover:text-gray-300'
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* 左侧节点面板 */}
        {activeTab !== 'history' && (
          <div className="w-56 border-r border-cyber-border bg-cyber-panel/30 flex flex-col overflow-hidden hidden md:flex">
            <div className="p-3 border-b border-cyber-border">
              <h3 className="text-xs font-mono text-gray-400">节点库</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {(Object.keys(nodeTypeConfig) as NodeType[]).map(type => (
                <div key={type}>
                  <button
                    onClick={() => toggleType(type)}
                    className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-mono text-gray-400 hover:bg-white/5 transition-colors"
                  >
                    {expandedTypes[type] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    <span style={{ color: nodeTypeConfig[type].color }}>●</span>
                    {nodeTypeConfig[type].label}
                  </button>
                  {expandedTypes[type] && (
                    <div className="ml-3 mt-1 space-y-1">
                      {nodeTypeConfig[type].subTypes.map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => addNode(type, sub)}
                          className="w-full flex items-start gap-2 px-2 py-2 rounded-md text-left hover:bg-white/[0.03] transition-colors group"
                        >
                          <span className="text-base">{sub.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-gray-300">{sub.name}</div>
                            <div className="text-[10px] text-gray-600 mt-0.5 line-clamp-2">{sub.desc}</div>
                          </div>
                          <Plus className="w-3 h-3 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 中间主区域 */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* 我的工作流 / 模板列表 */}
          {(activeTab === 'my' || activeTab === 'templates') && (
            <div className="flex-1 overflow-y-auto p-3">
              {activeTab === 'my' ? (
                <div className="space-y-3">
                  {/* 当前编辑的工作流 */}
                  {selectedWorkflow && (
                    <div className="rounded-xl border border-cyber-accent/30 bg-cyber-accent/5 p-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{selectedWorkflow.icon}</span>
                          <div>
                            <h3 className="text-sm font-bold text-cyber-text">{selectedWorkflow.name}</h3>
                            <p className="text-[10px] text-gray-500 font-mono">{selectedWorkflow.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded-md hover:bg-white/5 text-gray-500 hover:text-gray-300">
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 rounded-md hover:bg-red-500/10 text-gray-500 hover:text-red-400">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* 节点列表（手机端）/ 画布（桌面端） */}
                      <div className="space-y-2">
                        {nodes.map((node, idx) => (
                          <div
                            key={node.id}
                            onClick={() => setSelectedNode(node)}
                            className={cn(
                              'flex items-center gap-2 p-2.5 rounded-lg border transition-all cursor-pointer',
                              selectedNode?.id === node.id
                                ? 'border-cyber-accent/50 bg-cyber-accent/10'
                                : 'border-cyber-border/50 bg-white/[0.02] hover:border-cyber-accent/30'
                            )}
                          >
                            <GripVertical className="w-4 h-4 text-gray-600 cursor-grab" />
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                              style={{
                                background: `${node.color}15`,
                                border: `1px solid ${node.color}30`,
                              }}
                            >
                              {node.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-cyber-text font-medium">{node.name}</div>
                              <div className="text-[10px] text-gray-500 truncate">{node.description}</div>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <button
                                onClick={(e) => { e.stopPropagation(); moveNode(idx, 'up') }}
                                className="p-1 rounded hover:bg-white/5 text-gray-600 hover:text-gray-400"
                                disabled={idx === 0}
                              >
                                <ChevronRight className="w-3 h-3 rotate-[-90deg]" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); moveNode(idx, 'down') }}
                                className="p-1 rounded hover:bg-white/5 text-gray-600 hover:text-gray-400"
                                disabled={idx === nodes.length - 1}
                              >
                                <ChevronRight className="w-3 h-3 rotate-90" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); deleteNode(node.id) }}
                                className="p-1 rounded hover:bg-red-500/10 text-gray-600 hover:text-red-400"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 其他工作流 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {workflowTemplates.filter(w => w.isMy && w.id !== selectedWorkflow?.id).map(wf => (
                      <div
                        key={wf.id}
                        onClick={() => {
                          setSelectedWorkflow(wf)
                          setNodes(wf.nodes)
                          setSelectedNode(null)
                        }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-cyber-border/50 hover:border-cyber-accent/30 hover:bg-cyber-accent/5 cursor-pointer transition-all"
                      >
                        <span className="text-2xl">{wf.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-medium text-cyber-text">{wf.name}</h4>
                          <p className="text-[10px] text-gray-500 truncate mt-0.5">{wf.description}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {workflowTemplates.map(wf => (
                    <div
                      key={wf.id}
                      className="p-3 rounded-xl bg-white/[0.02] border border-cyber-border/50 hover:border-cyber-accent/30 hover:bg-cyber-accent/5 cursor-pointer transition-all group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-2xl">{wf.icon}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyber-accent/10 text-cyber-accent">
                          {wf.category}
                        </span>
                      </div>
                      <h4 className="text-sm font-medium text-cyber-text">{wf.name}</h4>
                      <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{wf.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-[10px] text-gray-600 font-mono">{wf.nodes.length} 个节点</span>
                        <button className="text-[10px] text-cyber-accent font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                          使用模板 →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 运行历史 */}
          {activeTab === 'history' && (
            <div className="flex-1 overflow-y-auto p-3">
              <div className="space-y-2">
                {runHistory.map(run => (
                  <div
                    key={run.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-cyber-border/50 hover:border-cyber-accent/30 transition-all"
                  >
                    {getStatusIcon(run.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm text-cyber-text font-medium">{run.workflowName}</h4>
                        <span className={cn(
                          'text-[10px] font-mono px-1.5 py-0.5 rounded',
                          run.status === 'success' && 'bg-green-500/10 text-green-400',
                          run.status === 'running' && 'bg-blue-500/10 text-blue-400',
                          run.status === 'failed' && 'bg-red-500/10 text-red-400',
                          run.status === 'pending' && 'bg-yellow-500/10 text-yellow-400',
                        )}>
                          {getStatusText(run.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {run.startTime}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                          <Timer className="w-3 h-3" />
                          {run.duration}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                          <Layers className="w-3 h-3" />
                          {run.steps} 步
                        </span>
                      </div>
                    </div>
                    <button className="p-1.5 rounded-md hover:bg-white/5 text-gray-500 hover:text-gray-300">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 右侧属性面板 */}
        {selectedNode && activeTab === 'my' && (
          <div className="w-64 border-l border-cyber-border bg-cyber-panel/30 flex flex-col overflow-hidden hidden lg:flex">
            <div className="p-3 border-b border-cyber-border flex items-center justify-between">
              <h3 className="text-xs font-mono text-gray-400">节点属性</h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-500 hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{
                    background: `${selectedNode.color}15`,
                    border: `1px solid ${selectedNode.color}30`,
                  }}
                >
                  {selectedNode.icon}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-cyber-text">{selectedNode.name}</h4>
                  <p className="text-[10px] text-gray-500 font-mono">
                    {nodeTypeConfig[selectedNode.type].label}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] text-gray-400 font-mono block mb-1.5">节点名称</label>
                  <input
                    type="text"
                    defaultValue={selectedNode.name}
                    className="w-full px-3 py-2 rounded-lg bg-cyber-bg border border-cyber-border text-xs text-cyber-text outline-none focus:border-cyber-accent/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-gray-400 font-mono block mb-1.5">节点描述</label>
                  <textarea
                    defaultValue={selectedNode.description}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg bg-cyber-bg border border-cyber-border text-xs text-cyber-text outline-none focus:border-cyber-accent/50 transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-gray-400 font-mono block mb-1.5">超时时间 (秒)</label>
                  <input
                    type="number"
                    defaultValue={30}
                    className="w-full px-3 py-2 rounded-lg bg-cyber-bg border border-cyber-border text-xs text-cyber-text outline-none focus:border-cyber-accent/50 transition-colors"
                  />
                </div>

                <div className="flex items-center justify-between py-2 border-b border-cyber-border/30">
                  <span className="text-xs text-gray-400">启用节点</span>
                  <div className="w-10 h-5 rounded-full bg-cyber-accent/30 relative cursor-pointer">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-cyber-accent" />
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-cyber-border/30">
                  <span className="text-xs text-gray-400">失败重试</span>
                  <div className="w-10 h-5 rounded-full bg-gray-700 relative cursor-pointer">
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-gray-500" />
                  </div>
                </div>
              </div>

              <button className="w-full py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono hover:bg-red-500/20 transition-all flex items-center justify-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5" />
                删除节点
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
