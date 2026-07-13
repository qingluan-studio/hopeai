/**
 * HopeAgent Pro 工作流执行引擎
 * 提供完整的工作流定义、节点执行、变量系统、条件评估、模板管理、历史日志与API管理
 *
 * 主要模块：
 * 1. 核心类型定义（WorkflowDef / WorkflowNode / WorkflowEdge / WorkflowContext 等）
 * 2. 变量系统（作用域、引用语法、类型转换、内置变量）
 * 3. 条件评估器（比较 / 逻辑 / 字符串 / 集合操作 + 表达式解析）
 * 4. 节点执行器（trigger / ai / tool / logic / output / wait / code / transform / merge / split）
 * 5. 执行引擎（executeWorkflow / executeNode / 串并行 / 循环 / 超时 / 重试 / 暂停 / 取消）
 * 6. 执行历史与日志（记录 / 节点日志 / 变量快照 / 回放 / 统计）
 * 7. 工作流模板（20+ 预定义模板）
 * 8. 工作流管理 API（CRUD / 运行 / 控制 / 校验 / 导入导出）
 */

// ============================================================
// 第一部分：核心类型定义
// ============================================================

/** 触发类型：手动 / 定时 / Webhook / API / 事件 */
export type TriggerType = 'manual' | 'schedule' | 'webhook' | 'api' | 'event'

/** 节点类型：触发器 / AI / 工具 / 逻辑 / 输出 / 等待 / 代码 / 条件 / 循环 / 并行 / 转换 / 合并 / 拆分 */
export type NodeType =
  | 'trigger'
  | 'ai'
  | 'tool'
  | 'logic'
  | 'output'
  | 'wait'
  | 'code'
  | 'condition'
  | 'loop'
  | 'parallel'
  | 'transform'
  | 'merge'
  | 'split'

/** 工作流执行状态：待执行 / 运行中 / 已暂停 / 已完成 / 已失败 / 已取消 */
export type WorkflowStatus =
  | 'pending'
  | 'running'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled'

/** 节点执行状态：待执行 / 运行中 / 已完成 / 已失败 / 已跳过 / 已取消 */
export type NodeStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'skipped'
  | 'cancelled'

/** 变量类型：字符串 / 数字 / 布尔 / 数组 / 对象 / 空值 */
export type VariableType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'null'

/** 变量作用域：全局 / 工作流 / 节点 */
export type VariableScope = 'global' | 'workflow' | 'node'

/** 日志级别 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

/** 触发器配置 */
export interface TriggerConfig {
  /** 触发类型 */
  type: TriggerType
  /** Cron 表达式，schedule 触发器使用 */
  cron?: string
  /** Webhook 路径，webhook 触发器使用 */
  webhookPath?: string
  /** API 方法 */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  /** 监听的事件名，event 触发器使用 */
  eventName?: string
  /** 触发时传入的数据 */
  payload?: Record<string, any>
  /** 是否启用 */
  enabled?: boolean
}

/** 节点在画布上的位置 */
export interface NodePosition {
  x: number
  y: number
}

/** 节点端口定义 */
export interface NodePort {
  /** 端口ID */
  id: string
  /** 端口名称 */
  name: string
  /** 端口数据类型 */
  type: VariableType
  /** 是否必填 */
  required: boolean
  /** 端口描述 */
  description?: string
  /** 默认值 */
  defaultValue?: any
}

/** 节点重试配置 */
export interface RetryConfig {
  /** 最大重试次数 */
  maxRetries: number
  /** 重试间隔（毫秒） */
  interval: number
  /** 是否指数退避 */
  backoff: boolean
}

/** 节点超时配置 */
export interface TimeoutConfig {
  /** 超时时间（毫秒） */
  duration: number
  /** 超时后行为：失败 / 跳过 / 继续 */
  behavior: 'fail' | 'skip' | 'continue'
}

/** 工作流节点定义 */
export interface WorkflowNode {
  /** 节点唯一ID */
  id: string
  /** 节点类型 */
  type: NodeType
  /** 节点子类型，用于区分具体执行逻辑（如 ai 节点的 subType: llm / agent / rag） */
  subType?: string
  /** 节点名称 */
  name: string
  /** 节点描述 */
  description?: string
  /** 节点配置（键值对，由具体执行器解释） */
  config: Record<string, any>
  /** 输入端口定义 */
  inputs?: NodePort[]
  /** 输出端口定义 */
  outputs?: NodePort[]
  /** 节点在画布上的位置 */
  position?: NodePosition
  /** 重试配置 */
  retry?: RetryConfig
  /** 超时配置 */
  timeout?: TimeoutConfig
  /** 是否启用 */
  enabled: boolean
}

/** 边的条件配置 */
export interface EdgeCondition {
  /** 条件表达式字符串 */
  expression: string
  /** 条件类型：表达式 / 总是 / 从不 */
  type: 'expression' | 'always' | 'never'
  /** 优先级，数值越大越优先 */
  priority?: number
}

/** 工作流连接定义 */
export interface WorkflowEdge {
  /** 边唯一ID */
  id: string
  /** 源节点ID */
  source: string
  /** 源节点输出端口ID */
  sourcePort?: string
  /** 目标节点ID */
  target: string
  /** 目标节点输入端口ID */
  targetPort?: string
  /** 边的条件 */
  condition?: EdgeCondition
  /** 边的标签 */
  label?: string
}

/** 工作流定义 */
export interface WorkflowDef {
  /** 工作流ID */
  id: string
  /** 工作流名称 */
  name: string
  /** 工作流描述 */
  description?: string
  /** 工作流版本 */
  version: string
  /** 节点列表 */
  nodes: WorkflowNode[]
  /** 连接列表 */
  edges: WorkflowEdge[]
  /** 触发器配置 */
  trigger: TriggerConfig
  /** 输入参数定义 */
  inputSchema?: Record<string, VariableType>
  /** 输出参数定义 */
  outputSchema?: Record<string, VariableType>
  /** 全局变量初始值 */
  variables?: Record<string, any>
  /** 标签 */
  tags?: string[]
  /** 创建时间（ISO 字符串） */
  createdAt: string
  /** 更新时间（ISO 字符串） */
  updatedAt: string
  /** 创建者 */
  createdBy?: string
  /** 是否启用 */
  enabled: boolean
}

/** 节点执行结果 */
export interface NodeExecutionResult {
  /** 节点ID */
  nodeId: string
  /** 节点状态 */
  status: NodeStatus
  /** 输出数据 */
  output?: any
  /** 错误信息 */
  error?: string
  /** 开始时间（ISO 字符串） */
  startedAt: string
  /** 结束时间（ISO 字符串） */
  finishedAt?: string
  /** 耗时（毫秒） */
  duration?: number
  /** 重试次数 */
  retryCount?: number
  /** 跳过的下一节点ID列表 */
  skippedPaths?: string[]
  /** 执行日志 */
  logs?: string[]
}

/** 变量快照 */
export interface VariableSnapshot {
  /** 节点ID */
  nodeId: string
  /** 快照时间（ISO 字符串） */
  timestamp: string
  /** 变量值 */
  variables: Record<string, any>
}

/** 节点日志 */
export interface NodeLog {
  /** 日志ID */
  id: string
  /** 执行ID */
  executionId: string
  /** 节点ID */
  nodeId: string
  /** 节点名称 */
  nodeName: string
  /** 节点类型 */
  nodeType: NodeType
  /** 节点子类型 */
  nodeSubType?: string
  /** 输入数据 */
  input?: any
  /** 输出数据 */
  output?: any
  /** 状态 */
  status: NodeStatus
  /** 开始时间 */
  startedAt: string
  /** 结束时间 */
  finishedAt?: string
  /** 耗时（毫秒） */
  duration?: number
  /** 错误信息 */
  error?: string
  /** 重试次数 */
  retryCount?: number
  /** 变量快照 */
  variableSnapshot?: VariableSnapshot
  /** 日志内容列表 */
  logs?: string[]
}

/** 工作流执行回调 */
export interface WorkflowCallbacks {
  /** 节点开始执行 */
  onNodeStart?: (node: WorkflowNode, context: WorkflowContext) => void
  /** 节点执行完成 */
  onNodeComplete?: (node: WorkflowNode, result: NodeExecutionResult, context: WorkflowContext) => void
  /** 工作流状态变更 */
  onStatusChange?: (status: WorkflowStatus, context: WorkflowContext) => void
  /** 变量变更 */
  onVariableChange?: (scope: VariableScope, key: string, value: any, context: WorkflowContext) => void
  /** 错误发生 */
  onError?: (error: Error, node: WorkflowNode, context: WorkflowContext) => void
  /** 日志输出 */
  onLog?: (message: string, level: LogLevel, context: WorkflowContext) => void
}

/** 执行上下文：贯穿整个工作流执行过程 */
export interface WorkflowContext {
  /** 执行ID */
  executionId: string
  /** 工作流ID */
  workflowId: string
  /** 工作流定义 */
  workflow: WorkflowDef
  /** 触发数据 */
  triggerData: any
  /** 当前节点ID */
  currentNodeId?: string
  /** 节点执行结果历史 */
  history: NodeExecutionResult[]
  /** 节点日志 */
  nodeLogs: NodeLog[]
  /** 变量快照列表 */
  variableSnapshots: VariableSnapshot[]
  /** 全局变量 */
  globalVariables: Record<string, any>
  /** 工作流变量 */
  workflowVariables: Record<string, any>
  /** 节点变量（按节点ID索引） */
  nodeVariables: Record<string, Record<string, any>>
  /** 工作流状态 */
  status: WorkflowStatus
  /** 开始时间 */
  startedAt: string
  /** 结束时间 */
  finishedAt?: string
  /** 错误信息 */
  error?: string
  /** 父执行ID（用于子工作流） */
  parentExecutionId?: string
  /** 循环计数器（按节点ID索引） */
  loopCounters: Record<string, number>
  /** 并行分支结果（按并行节点ID索引） */
  parallelResults: Record<string, any[]>
  /** 是否暂停 */
  paused: boolean
  /** 是否取消 */
  cancelled: boolean
  /** 执行回调 */
  callbacks?: WorkflowCallbacks
  /** 执行选项 */
  options?: ExecutionOptions
}

/** 执行历史记录 */
export interface ExecutionRecord {
  /** 执行ID */
  executionId: string
  /** 工作流ID */
  workflowId: string
  /** 工作流名称 */
  workflowName: string
  /** 工作流版本 */
  workflowVersion: string
  /** 触发类型 */
  triggerType: TriggerType
  /** 触发数据 */
  triggerData: any
  /** 状态 */
  status: WorkflowStatus
  /** 开始时间 */
  startedAt: string
  /** 结束时间 */
  finishedAt?: string
  /** 耗时（毫秒） */
  duration?: number
  /** 节点执行结果 */
  nodeResults: NodeExecutionResult[]
  /** 节点日志 */
  nodeLogs: NodeLog[]
  /** 最终输出 */
  output?: any
  /** 错误信息 */
  error?: string
  /** 执行者 */
  executedBy?: string
}

/** 执行统计 */
export interface ExecutionStats {
  /** 总执行次数 */
  totalExecutions: number
  /** 成功次数 */
  successCount: number
  /** 失败次数 */
  failureCount: number
  /** 取消次数 */
  cancelledCount: number
  /** 成功率（0-1） */
  successRate: number
  /** 平均耗时（毫秒） */
  averageDuration: number
  /** 最慢节点ID */
  slowestNodeId?: string
  /** 最慢节点名称 */
  slowestNodeName?: string
  /** 最慢节点耗时（毫秒） */
  slowestNodeDuration?: number
  /** 最近执行时间 */
  lastExecutionAt?: string
}

/** 工作流模板 */
export interface WorkflowTemplate {
  /** 模板ID */
  id: string
  /** 模板名称 */
  name: string
  /** 模板描述 */
  description: string
  /** 模板分类 */
  category: string
  /** 工作流定义 */
  workflow: WorkflowDef
  /** 使用场景 */
  useCases?: string[]
  /** 图标名 */
  icon?: string
  /** 使用次数 */
  usageCount?: number
}

/** 校验错误 */
export interface ValidationError {
  /** 错误级别 */
  level: 'error'
  /** 错误代码 */
  code: string
  /** 错误信息 */
  message: string
  /** 节点ID */
  nodeId?: string
  /** 边ID */
  edgeId?: string
}

/** 校验警告 */
export interface ValidationWarning {
  /** 警告级别 */
  level: 'warning'
  /** 警告代码 */
  code: string
  /** 警告信息 */
  message: string
  /** 节点ID */
  nodeId?: string
}

/** 校验结果 */
export interface ValidationResult {
  /** 是否有效 */
  valid: boolean
  /** 错误列表 */
  errors: ValidationError[]
  /** 警告列表 */
  warnings: ValidationWarning[]
}

/** 执行选项 */
export interface ExecutionOptions {
  /** 超时时间（毫秒） */
  timeout?: number
  /** 最大重试次数 */
  maxRetries?: number
  /** 是否记录详细日志 */
  verbose?: boolean
  /** 是否启用变量快照 */
  snapshotVariables?: boolean
  /** 执行回调 */
  callbacks?: WorkflowCallbacks
  /** 中断信号 */
  signal?: AbortSignal
  /** 是否模拟执行（不实际执行节点逻辑） */
  dryRun?: boolean
  /** 执行者 */
  executedBy?: string
}

// ============================================================
// 第二部分：工具函数与变量系统
// ============================================================

/** 生成唯一ID */
function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

/** 延时函数 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/** 获取当前时间ISO字符串 */
function now(): string {
  return new Date().toISOString()
}

/** 计算耗时（毫秒） */
function computeDuration(start: string, end: string): number {
  return new Date(end).getTime() - new Date(start).getTime()
}

/** 判断变量类型 */
export function getVariableType(value: any): VariableType {
  if (value === null || value === undefined) return 'null'
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'string') return 'string'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'boolean') return 'boolean'
  return 'object'
}

/** 类型转换：将值转换为目标类型 */
export function convertType(value: any, targetType: VariableType): any {
  const currentType = getVariableType(value)
  if (currentType === targetType) return value
  // null / undefined 处理
  if (value === null || value === undefined) {
    if (targetType === 'null') return null
    if (targetType === 'string') return ''
    if (targetType === 'number') return 0
    if (targetType === 'boolean') return false
    if (targetType === 'array') return []
    if (targetType === 'object') return {}
  }
  switch (targetType) {
    case 'string':
      if (currentType === 'object' || currentType === 'array') return JSON.stringify(value)
      return String(value)
    case 'number': {
      const num = Number(value)
      return isNaN(num) ? 0 : num
    }
    case 'boolean':
      if (typeof value === 'string') {
        return value.toLowerCase() === 'true' || value === '1'
      }
      return Boolean(value)
    case 'array':
      if (currentType === 'object') return Object.values(value)
      return [value]
    case 'object':
      if (currentType === 'array') return { ...value }
      if (currentType === 'string') {
        try {
          const parsed = JSON.parse(value)
          return typeof parsed === 'object' && parsed !== null ? parsed : { value }
        } catch {
          return { value }
        }
      }
      return { value }
    case 'null':
      return null
    default:
      return value
  }
}

/**
 * 变量系统：管理全局 / 工作流 / 节点三种作用域的变量
 */
export class VariableSystem {
  private globalVars: Record<string, any> = {}
  private workflowVars: Record<string, any> = {}
  private nodeVars: Record<string, Record<string, any>> = {}

  constructor(initialGlobal: Record<string, any> = {}) {
    this.globalVars = { ...initialGlobal }
  }

  /** 获取变量值 */
  get(key: string, scope: VariableScope = 'workflow', nodeId?: string): any {
    const parts = key.split('.')
    const rootKey = parts[0]
    let value: any
    if (scope === 'global') {
      value = this.globalVars[rootKey]
    } else if (scope === 'node' && nodeId) {
      value = (this.nodeVars[nodeId] || {})[rootKey]
    } else {
      value = this.workflowVars[rootKey]
    }
    if (parts.length > 1 && value !== undefined) {
      return getPathValue(value, parts.slice(1).join('.'))
    }
    return value
  }

  /** 设置变量值 */
  set(key: string, value: any, scope: VariableScope = 'workflow', nodeId?: string): void {
    const parts = key.split('.')
    const rootKey = parts[0]
    if (scope === 'global') {
      if (parts.length > 1) {
        setPathValue(this.globalVars, rootKey, parts.slice(1).join('.'), value)
      } else {
        this.globalVars[rootKey] = value
      }
    } else if (scope === 'node' && nodeId) {
      if (!this.nodeVars[nodeId]) this.nodeVars[nodeId] = {}
      if (parts.length > 1) {
        setPathValue(this.nodeVars[nodeId], rootKey, parts.slice(1).join('.'), value)
      } else {
        this.nodeVars[nodeId][rootKey] = value
      }
    } else {
      if (parts.length > 1) {
        setPathValue(this.workflowVars, rootKey, parts.slice(1).join('.'), value)
      } else {
        this.workflowVars[rootKey] = value
      }
    }
  }

  /** 删除变量 */
  delete(key: string, scope: VariableScope = 'workflow', nodeId?: string): boolean {
    if (scope === 'global') {
      if (key in this.globalVars) {
        delete this.globalVars[key]
        return true
      }
    } else if (scope === 'node' && nodeId) {
      if (this.nodeVars[nodeId] && key in this.nodeVars[nodeId]) {
        delete this.nodeVars[nodeId][key]
        return true
      }
    } else {
      if (key in this.workflowVars) {
        delete this.workflowVars[key]
        return true
      }
    }
    return false
  }

  /** 检查变量是否存在 */
  exists(key: string, scope: VariableScope = 'workflow', nodeId?: string): boolean {
    if (scope === 'global') return key in this.globalVars
    if (scope === 'node' && nodeId) return this.nodeVars[nodeId] ? key in this.nodeVars[nodeId] : false
    return key in this.workflowVars
  }

  /** 获取指定作用域的所有变量 */
  getAll(scope: VariableScope = 'workflow', nodeId?: string): Record<string, any> {
    if (scope === 'global') return { ...this.globalVars }
    if (scope === 'node' && nodeId) return { ...(this.nodeVars[nodeId] || {}) }
    return { ...this.workflowVars }
  }

  /** 获取所有作用域合并后的变量（优先级：节点 > 工作流 > 全局） */
  getAllMerged(nodeId?: string): Record<string, any> {
    return {
      ...this.globalVars,
      ...this.workflowVars,
      ...(nodeId ? this.nodeVars[nodeId] || {} : {}),
    }
  }

  /** 注入工作流变量 */
  setWorkflowVars(vars: Record<string, any>): void {
    this.workflowVars = { ...this.workflowVars, ...vars }
  }

  /** 注入全局变量 */
  setGlobalVars(vars: Record<string, any>): void {
    this.globalVars = { ...this.globalVars, ...vars }
  }

  /** 清空变量 */
  clear(scope?: VariableScope, nodeId?: string): void {
    if (!scope) {
      this.globalVars = {}
      this.workflowVars = {}
      this.nodeVars = {}
      return
    }
    if (scope === 'global') this.globalVars = {}
    else if (scope === 'workflow') this.workflowVars = {}
    else if (scope === 'node' && nodeId) delete this.nodeVars[nodeId]
  }

  /** 创建快照 */
  snapshot(nodeId?: string): Record<string, any> {
    return JSON.parse(JSON.stringify(this.getAllMerged(nodeId)))
  }
}

/** 通过点路径获取对象上的值（支持数组索引：items[0].name） */
export function getPathValue(obj: any, path: string): any {
  if (obj === null || obj === undefined) return undefined
  const parts = path.split('.')
  let current = obj
  for (const part of parts) {
    if (current === null || current === undefined) return undefined
    const arrayMatch = part.match(/^([^\[]+)\[(\d+)\]$/)
    if (arrayMatch) {
      current = current[arrayMatch[1]]
      if (Array.isArray(current)) {
        current = current[parseInt(arrayMatch[2], 10)]
      } else {
        return undefined
      }
    } else {
      current = current[part]
    }
  }
  return current
}

/** 通过点路径设置对象上的值 */
export function setPathValue(obj: Record<string, any>, rootKey: string, path: string, value: any): void {
  if (!obj[rootKey] || typeof obj[rootKey] !== 'object') {
    obj[rootKey] = {}
  }
  const parts = path.split('.')
  let current = obj[rootKey]
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    if (current[part] === undefined || typeof current[part] !== 'object') {
      current[part] = {}
    }
    current = current[part]
  }
  current[parts[parts.length - 1]] = value
}

/** 解析字符串中的变量引用 ${variable.path} */
export function resolveVariable(template: string, variables: Record<string, any>): string {
  if (typeof template !== 'string') return template
  return template.replace(/\$\{([^}]+)\}/g, (match, expr) => {
    const trimmed = expr.trim()
    const value = getPathValue(variables, trimmed)
    if (value === undefined) return match
    if (value === null) return 'null'
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
  })
}

/** 深度解析对象中的所有变量引用 */
export function deepResolveVariables(obj: any, variables: Record<string, any>): any {
  if (obj === null || obj === undefined) return obj
  if (typeof obj === 'string') {
    // 如果整个字符串就是一个变量引用 ${var}，则返回原始类型值
    const fullMatch = obj.match(/^\$\{([^}]+)\}$/)
    if (fullMatch) {
      const value = getPathValue(variables, fullMatch[1].trim())
      return value === undefined ? obj : value
    }
    return resolveVariable(obj, variables)
  }
  if (Array.isArray(obj)) {
    return obj.map(item => deepResolveVariables(item, variables))
  }
  if (typeof obj === 'object') {
    const result: Record<string, any> = {}
    for (const key of Object.keys(obj)) {
      result[key] = deepResolveVariables(obj[key], variables)
    }
    return result
  }
  return obj
}

/** 验证变量值是否符合类型 */
export function validateVariable(value: any, expectedType: VariableType): boolean {
  return getVariableType(value) === expectedType
}

/** 构建内置变量：timestamp / workflowId / triggerData / previousResult */
export function buildBuiltinVariables(
  workflowId: string,
  triggerData: any,
  previousResult?: any
): Record<string, any> {
  return {
    timestamp: now(),
    workflowId,
    triggerData,
    previousResult: previousResult ?? null,
  }
}

// ============================================================
// 第三部分：条件评估器
// ============================================================

/** 比较操作符 */
export type ComparisonOperator = '==' | '!=' | '>' | '<' | '>=' | '<='

/** 逻辑操作符 */
export type LogicalOperator = 'and' | 'or' | 'not'

/** 字符串操作符 */
export type StringOperator = 'contains' | 'startsWith' | 'endsWith' | 'matches' | 'equals'

/** 集合操作符 */
export type SetOperator = 'in' | 'notIn' | 'isEmpty' | 'length'

/** 条件表达式 AST 节点 */
export type ConditionAST =
  | { type: 'comparison'; operator: ComparisonOperator; left: any; right: any }
  | { type: 'logical'; operator: LogicalOperator; operands: ConditionAST[] }
  | { type: 'string'; operator: StringOperator; left: any; right: any }
  | { type: 'set'; operator: SetOperator; operand: any; arg?: any }
  | { type: 'literal'; value: any }

/**
 * 评估条件
 * 支持：布尔值、表达式字符串、AST 对象
 */
export function evaluateCondition(condition: any, context: WorkflowContext): boolean {
  if (typeof condition === 'boolean') return condition
  if (typeof condition === 'string') {
    return evaluateConditionExpression(condition, context)
  }
  if (typeof condition === 'object' && condition !== null) {
    return evaluateConditionAST(condition as ConditionAST, context)
  }
  return Boolean(condition)
}

/** 评估条件表达式字符串 */
export function evaluateConditionExpression(expression: string, context: WorkflowContext): boolean {
  const trimmed = expression.trim()
  if (!trimmed) return true
  // 解析变量引用
  const variables = buildEvaluationVariables(context)
  const resolved = resolveVariable(trimmed, variables)
  // 尝试解析为 AST
  const ast = parseConditionExpression(resolved)
  if (ast) {
    return evaluateConditionAST(ast, context)
  }
  // 退化为布尔判断
  return Boolean(resolved)
}

/** 评估条件 AST */
export function evaluateConditionAST(ast: ConditionAST, context: WorkflowContext): boolean {
  const variables = buildEvaluationVariables(context)
  switch (ast.type) {
    case 'literal':
      return Boolean(ast.value)
    case 'comparison':
      return evaluateComparison(ast.operator, ast.left, ast.right, variables)
    case 'logical':
      return evaluateLogical(ast.operator, ast.operands, context)
    case 'string':
      return evaluateStringOp(ast.operator, ast.left, ast.right, variables)
    case 'set':
      return evaluateSetOp(ast.operator, ast.operand, ast.arg, variables)
    default:
      return false
  }
}

/** 构建评估用的变量集合 */
function buildEvaluationVariables(context: WorkflowContext): Record<string, any> {
  return {
    ...context.globalVariables,
    ...context.workflowVariables,
    ...(context.currentNodeId ? context.nodeVariables[context.currentNodeId] || {} : {}),
    timestamp: now(),
    workflowId: context.workflowId,
    triggerData: context.triggerData,
    previousResult: context.history.length > 0
      ? context.history[context.history.length - 1].output
      : null,
  }
}

/** 评估比较操作 */
function evaluateComparison(
  operator: ComparisonOperator,
  leftRaw: any,
  rightRaw: any,
  variables: Record<string, any>
): boolean {
  const left = resolveValue(leftRaw, variables)
  const right = resolveValue(rightRaw, variables)
  switch (operator) {
    case '==':
      return looseEqual(left, right)
    case '!=':
      return !looseEqual(left, right)
    case '>':
      return toNumber(left) > toNumber(right)
    case '<':
      return toNumber(left) < toNumber(right)
    case '>=':
      return toNumber(left) >= toNumber(right)
    case '<=':
      return toNumber(left) <= toNumber(right)
    default:
      return false
  }
}

/** 评估逻辑操作 */
function evaluateLogical(
  operator: LogicalOperator,
  operands: ConditionAST[],
  context: WorkflowContext
): boolean {
  if (operator === 'not') {
    return !evaluateConditionAST(operands[0], context)
  }
  if (operator === 'and') {
    return operands.every(op => evaluateConditionAST(op, context))
  }
  if (operator === 'or') {
    return operands.some(op => evaluateConditionAST(op, context))
  }
  return false
}

/** 评估字符串操作 */
function evaluateStringOp(
  operator: StringOperator,
  leftRaw: any,
  rightRaw: any,
  variables: Record<string, any>
): boolean {
  const left = String(resolveValue(leftRaw, variables) ?? '')
  const right = String(resolveValue(rightRaw, variables) ?? '')
  switch (operator) {
    case 'contains':
      return left.includes(right)
    case 'startsWith':
      return left.startsWith(right)
    case 'endsWith':
      return left.endsWith(right)
    case 'matches': {
      try {
        const regex = new RegExp(right)
        return regex.test(left)
      } catch {
        return false
      }
    }
    case 'equals':
      return left === right
    default:
      return false
  }
}

/** 评估集合操作 */
function evaluateSetOp(
  operator: SetOperator,
  operandRaw: any,
  argRaw: any,
  variables: Record<string, any>
): boolean {
  const operand = resolveValue(operandRaw, variables)
  switch (operator) {
    case 'in': {
      const arr = resolveValue(argRaw, variables)
      if (!Array.isArray(arr)) return false
      return arr.includes(operand)
    }
    case 'notIn': {
      const arr = resolveValue(argRaw, variables)
      if (!Array.isArray(arr)) return false
      return !arr.includes(operand)
    }
    case 'isEmpty':
      if (operand === null || operand === undefined) return true
      if (Array.isArray(operand)) return operand.length === 0
      if (typeof operand === 'string') return operand.length === 0
      if (typeof operand === 'object') return Object.keys(operand).length === 0
      return false
    case 'length': {
      const expected = toNumber(resolveValue(argRaw, variables))
      if (Array.isArray(operand)) return operand.length === expected
      if (typeof operand === 'string') return operand.length === expected
      if (typeof operand === 'object' && operand !== null) return Object.keys(operand).length === expected
      return false
    }
    default:
      return false
  }
}

/** 解析值：如果是字符串则解析变量引用 */
function resolveValue(raw: any, variables: Record<string, any>): any {
  if (typeof raw === 'string') {
    const fullMatch = raw.match(/^\$\{([^}]+)\}$/)
    if (fullMatch) {
      return getPathValue(variables, fullMatch[1].trim())
    }
    return resolveVariable(raw, variables)
  }
  return raw
}

/** 宽松相等比较 */
function looseEqual(a: any, b: any): boolean {
  if (a === b) return true
  if (a === null || a === undefined) return b === null || b === undefined
  if (b === null || b === undefined) return false
  if (typeof a === 'string' || typeof b === 'string') {
    return String(a) === String(b)
  }
  if (typeof a === 'number' || typeof b === 'number') {
    return Number(a) === Number(b)
  }
  if (typeof a === 'boolean' || typeof b === 'boolean') {
    return Boolean(a) === Boolean(b)
  }
  try {
    return JSON.stringify(a) === JSON.stringify(b)
  } catch {
    return false
  }
}

/** 转换为数字 */
function toNumber(value: any): number {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const n = Number(value)
    return isNaN(n) ? 0 : n
  }
  if (typeof value === 'boolean') return value ? 1 : 0
  return 0
}

/**
 * 解析条件表达式字符串为 AST
 * 支持的语法：
 *   - 比较：${var} == 1, ${var} != "abc", ${var} > 10
 *   - 逻辑：a AND b, a OR b, NOT a
 *   - 字符串：${var} contains "abc", ${var} startsWith "x"
 *   - 集合：${var} in [1,2,3], ${var} isEmpty
 */
export function parseConditionExpression(expression: string): ConditionAST | null {
  const trimmed = expression.trim()
  if (!trimmed) return null
  try {
    return parseOr(trimmed)
  } catch {
    return null
  }
}

/** 解析 OR 表达式 */
function parseOr(expr: string): ConditionAST {
  const parts = splitByOperator(expr, /\s+OR\s+/i)
  if (parts.length === 1) return parseAnd(expr)
  return {
    type: 'logical',
    operator: 'or',
    operands: parts.map(p => parseAnd(p)),
  }
}

/** 解析 AND 表达式 */
function parseAnd(expr: string): ConditionAST {
  const parts = splitByOperator(expr, /\s+AND\s+/i)
  if (parts.length === 1) return parseNot(expr)
  return {
    type: 'logical',
    operator: 'and',
    operands: parts.map(p => parseNot(p)),
  }
}

/** 解析 NOT 表达式 */
function parseNot(expr: string): ConditionAST {
  const trimmed = expr.trim()
  const notMatch = trimmed.match(/^NOT\s+(.+)$/i)
  if (notMatch) {
    return {
      type: 'logical',
      operator: 'not',
      operands: [parseAtom(notMatch[1].trim())],
    }
  }
  return parseAtom(trimmed)
}

/** 解析原子表达式 */
function parseAtom(expr: string): ConditionAST {
  const trimmed = expr.trim()
  // 去掉括号
  if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
    return parseOr(trimmed.slice(1, -1))
  }
  // 字符串操作
  const stringOps: StringOperator[] = ['contains', 'startsWith', 'endsWith', 'matches', 'equals']
  for (const op of stringOps) {
    const re = new RegExp(`^(.+?)\\s+${op}\\s+(.+)$`, 'i')
    const m = trimmed.match(re)
    if (m) {
      return {
        type: 'string',
        operator: op,
        left: parseLiteral(m[1].trim()),
        right: parseLiteral(m[2].trim()),
      }
    }
  }
  // 集合操作
  const isEmptyMatch = trimmed.match(/^(.+?)\s+isEmpty$/i)
  if (isEmptyMatch) {
    return { type: 'set', operator: 'isEmpty', operand: parseLiteral(isEmptyMatch[1].trim()) }
  }
  const lengthMatch = trimmed.match(/^(.+?)\s+length\s+(.+)$/i)
  if (lengthMatch) {
    return {
      type: 'set',
      operator: 'length',
      operand: parseLiteral(lengthMatch[1].trim()),
      arg: parseLiteral(lengthMatch[2].trim()),
    }
  }
  const inMatch = trimmed.match(/^(.+?)\s+(in|notIn)\s+(.+)$/i)
  if (inMatch) {
    const op = inMatch[2].toLowerCase() as SetOperator
    return {
      type: 'set',
      operator: op,
      operand: parseLiteral(inMatch[1].trim()),
      arg: parseLiteral(inMatch[3].trim()),
    }
  }
  // 比较操作
  const compOps: ComparisonOperator[] = ['>=', '<=', '==', '!=', '>', '<']
  for (const op of compOps) {
    const escapedOp = op.replace(/[<>=!]/g, c => `\\${c}`)
    const re = new RegExp(`^(.+?)\\s*${escapedOp}\\s*(.+)$`)
    const m = trimmed.match(re)
    if (m) {
      return {
        type: 'comparison',
        operator: op,
        left: parseLiteral(m[1].trim()),
        right: parseLiteral(m[2].trim()),
      }
    }
  }
  // 字面量
  return { type: 'literal', value: parseLiteral(trimmed) }
}

/** 解析字面量值 */
function parseLiteral(raw: string): any {
  const trimmed = raw.trim()
  // 变量引用 ${var}
  if (/^\$\{[^}]+\}$/.test(trimmed)) return trimmed
  // 字符串 "abc" 或 'abc'
  const strMatch = trimmed.match(/^["'](.*)["']$/)
  if (strMatch) return strMatch[1]
  // 数组 [1,2,3]
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      return JSON.parse(trimmed)
    } catch {
      return trimmed
    }
  }
  // 对象 {"a":1}
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      return JSON.parse(trimmed)
    } catch {
      return trimmed
    }
  }
  // 数字
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed)
  // 布尔
  if (trimmed.toLowerCase() === 'true') return true
  if (trimmed.toLowerCase() === 'false') return false
  if (trimmed.toLowerCase() === 'null') return null
  // 普通标识符或字符串
  return trimmed
}

/** 按操作符分割字符串（不分割引号内、括号内内容） */
function splitByOperator(expr: string, separator: RegExp): string[] {
  const parts: string[] = []
  let current = ''
  let inString: string | null = null
  let parenDepth = 0
  let bracketDepth = 0
  let braceDepth = 0
  let i = 0
  while (i < expr.length) {
    const ch = expr[i]
    if (inString) {
      current += ch
      if (ch === inString && expr[i - 1] !== '\\') inString = null
      i++
      continue
    }
    if (ch === '"' || ch === "'") {
      inString = ch
      current += ch
      i++
      continue
    }
    if (ch === '(') parenDepth++
    if (ch === ')') parenDepth--
    if (ch === '[') bracketDepth++
    if (ch === ']') bracketDepth--
    if (ch === '{') braceDepth++
    if (ch === '}') braceDepth--
    if (parenDepth === 0 && bracketDepth === 0 && braceDepth === 0) {
      // 尝试匹配分隔符
      const rest = expr.slice(i)
      const match = rest.match(separator)
      if (match && match.index === 0) {
        parts.push(current)
        current = ''
        i += match[0].length
        continue
      }
    }
    current += ch
    i++
  }
  if (current.trim()) parts.push(current)
  return parts
}

// ============================================================
// 第四部分：节点执行器
// ============================================================

/** 节点执行器接口 */
export interface NodeExecutor {
  /** 执行节点 */
  execute(node: WorkflowNode, context: WorkflowContext): Promise<NodeExecutionResult>
}

/** 节点执行器注册表 */
const nodeExecutors: Partial<Record<NodeType, NodeExecutor>> = {}

/** 注册节点执行器 */
export function registerNodeExecutor(type: NodeType, executor: NodeExecutor): void {
  nodeExecutors[type] = executor
}

/** 获取节点执行器 */
export function getNodeExecutor(type: NodeType): NodeExecutor | undefined {
  return nodeExecutors[type]
}

/** 创建执行失败的节点结果 */
function createFailedResult(nodeId: string, error: string, startedAt: string): NodeExecutionResult {
  return {
    nodeId,
    status: 'failed',
    error,
    startedAt,
    finishedAt: now(),
    duration: computeDuration(startedAt, now()),
  }
}

/** 创建执行成功的节点结果 */
function createSuccessResult(
  nodeId: string,
  output: any,
  startedAt: string,
  logs?: string[]
): NodeExecutionResult {
  return {
    nodeId,
    status: 'completed',
    output,
    startedAt,
    finishedAt: now(),
    duration: computeDuration(startedAt, now()),
    logs,
  }
}

/** 创建日志列表 */
function createLogger(): { logs: string[]; log: (msg: string) => void } {
  const logs: string[] = []
  return {
    logs,
    log: (msg: string) => {
      logs.push(`[${now()}] ${msg}`)
    },
  }
}

// -------------------- trigger 节点执行器 --------------------

/** trigger 节点执行器：处理手动 / 定时 / Webhook / API / 事件触发 */
class TriggerNodeExecutor implements NodeExecutor {
  async execute(node: WorkflowNode, context: WorkflowContext): Promise<NodeExecutionResult> {
    const startedAt = now()
    const { logs, log } = createLogger()
    const subType = node.subType || context.workflow.trigger.type
    log(`触发器启动，类型：${subType}`)
    try {
      let output: any
      switch (subType) {
        case 'manual':
          output = await this.executeManual(node, context, log)
          break
        case 'schedule':
          output = await this.executeSchedule(node, context, log)
          break
        case 'webhook':
          output = await this.executeWebhook(node, context, log)
          break
        case 'api':
          output = await this.executeApi(node, context, log)
          break
        case 'event':
          output = await this.executeEvent(node, context, log)
          break
        default:
          output = context.triggerData
      }
      log(`触发器执行完成`)
      return createSuccessResult(node.id, output, startedAt, logs)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      log(`触发器执行失败：${msg}`)
      return createFailedResult(node.id, msg, startedAt)
    }
  }

  /** 手动触发 */
  private async executeManual(
    node: WorkflowNode,
    context: WorkflowContext,
    log: (msg: string) => void
  ): Promise<any> {
    log(`手动触发，使用传入的触发数据`)
    return {
      triggerType: 'manual',
      payload: context.triggerData,
      timestamp: now(),
    }
  }

  /** 定时触发 */
  private async executeSchedule(
    node: WorkflowNode,
    context: WorkflowContext,
    log: (msg: string) => void
  ): Promise<any> {
    const cron = node.config.cron || context.workflow.trigger.cron
    log(`定时触发，Cron 表达式：${cron || '未指定'}`)
    return {
      triggerType: 'schedule',
      cron,
      payload: context.triggerData,
      timestamp: now(),
    }
  }

  /** Webhook 触发 */
  private async executeWebhook(
    node: WorkflowNode,
    context: WorkflowContext,
    log: (msg: string) => void
  ): Promise<any> {
    const path = node.config.webhookPath || context.workflow.trigger.webhookPath
    log(`Webhook 触发，路径：${path || '未指定'}`)
    return {
      triggerType: 'webhook',
      path,
      method: node.config.method || 'POST',
      headers: node.config.headers || {},
      body: context.triggerData,
      timestamp: now(),
    }
  }

  /** API 触发 */
  private async executeApi(
    node: WorkflowNode,
    context: WorkflowContext,
    log: (msg: string) => void
  ): Promise<any> {
    const method = node.config.method || context.workflow.trigger.method || 'POST'
    log(`API 触发，方法：${method}`)
    return {
      triggerType: 'api',
      method,
      params: node.config.params || {},
      body: context.triggerData,
      timestamp: now(),
    }
  }

  /** 事件触发 */
  private async executeEvent(
    node: WorkflowNode,
    context: WorkflowContext,
    log: (msg: string) => void
  ): Promise<any> {
    const eventName = node.config.eventName || context.workflow.trigger.eventName
    log(`事件触发，事件名：${eventName || '未指定'}`)
    return {
      triggerType: 'event',
      eventName,
      eventData: context.triggerData,
      timestamp: now(),
    }
  }
}

// -------------------- ai 节点执行器 --------------------

/** ai 节点执行器：LLM 调用 / Agent 执行 / 知识库检索 / 文本生成 / 摘要 / 翻译 */
class AiNodeExecutor implements NodeExecutor {
  async execute(node: WorkflowNode, context: WorkflowContext): Promise<NodeExecutionResult> {
    const startedAt = now()
    const { logs, log } = createLogger()
    const subType = node.subType || 'llm'
    log(`AI 节点启动，子类型：${subType}`)
    try {
      // 解析配置中的变量引用
      const resolvedConfig = deepResolveVariables(node.config, buildEvaluationVariables(context))
      let output: any
      switch (subType) {
        case 'llm':
          output = await this.executeLlm(resolvedConfig, context, log)
          break
        case 'agent':
          output = await this.executeAgent(resolvedConfig, context, log)
          break
        case 'rag':
          output = await this.executeRag(resolvedConfig, context, log)
          break
        case 'generate':
          output = await this.executeGenerate(resolvedConfig, context, log)
          break
        case 'summarize':
          output = await this.executeSummarize(resolvedConfig, context, log)
          break
        case 'translate':
          output = await this.executeTranslate(resolvedConfig, context, log)
          break
        default:
          throw new Error(`未知的 AI 节点子类型：${subType}`)
      }
      log(`AI 节点执行完成`)
      return createSuccessResult(node.id, output, startedAt, logs)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      log(`AI 节点执行失败：${msg}`)
      return createFailedResult(node.id, msg, startedAt)
    }
  }

  /** LLM 调用 */
  private async executeLlm(
    config: any,
    context: WorkflowContext,
    log: (msg: string) => void
  ): Promise<any> {
    const prompt = config.prompt || ''
    const model = config.model || 'default'
    const temperature = config.temperature ?? 0.7
    const maxTokens = config.maxTokens ?? 2000
    log(`调用 LLM，模型：${model}，温度：${temperature}`)
    // 模拟 LLM 调用
    await delay(100)
    return {
      type: 'llm',
      model,
      prompt,
      response: `[LLM 响应] ${prompt.slice(0, 100)}...`,
      usage: {
        promptTokens: Math.ceil(prompt.length / 4),
        completionTokens: 50,
        totalTokens: Math.ceil(prompt.length / 4) + 50,
      },
      timestamp: now(),
    }
  }

  /** Agent 执行 */
  private async executeAgent(
    config: any,
    context: WorkflowContext,
    log: (msg: string) => void
  ): Promise<any> {
    const agentId = config.agentId || 'orchestrator'
    const task = config.task || ''
    log(`执行 Agent：${agentId}，任务：${task.slice(0, 50)}`)
    await delay(150)
    return {
      type: 'agent',
      agentId,
      task,
      result: `[Agent ${agentId} 执行结果]`,
      steps: [
        { type: 'observe', content: '分析任务需求' },
        { type: 'think', content: '制定执行计划' },
        { type: 'act', content: '执行操作' },
      ],
      timestamp: now(),
    }
  }

  /** 知识库检索 */
  private async executeRag(
    config: any,
    context: WorkflowContext,
    log: (msg: string) => void
  ): Promise<any> {
    const query = config.query || ''
    const topK = config.topK ?? 3
    const knowledgeBase = config.knowledgeBase || 'default'
    log(`知识库检索：${knowledgeBase}，查询：${query.slice(0, 50)}，topK=${topK}`)
    await delay(80)
    return {
      type: 'rag',
      query,
      knowledgeBase,
      documents: Array.from({ length: topK }, (_, i) => ({
        id: `doc_${i + 1}`,
        content: `文档 ${i + 1} 的内容片段，与查询 "${query}" 相关`,
        score: 0.9 - i * 0.1,
        source: `kb://${knowledgeBase}/doc_${i + 1}`,
      })),
      timestamp: now(),
    }
  }

  /** 文本生成 */
  private async executeGenerate(
    config: any,
    context: WorkflowContext,
    log: (msg: string) => void
  ): Promise<any> {
    const template = config.template || ''
    const variables = config.variables || {}
    log(`文本生成，模板长度：${template.length}`)
    await delay(60)
    let result = template
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value))
    }
    return {
      type: 'generate',
      template,
      result,
      timestamp: now(),
    }
  }

  /** 摘要 */
  private async executeSummarize(
    config: any,
    context: WorkflowContext,
    log: (msg: string) => void
  ): Promise<any> {
    const text = config.text || ''
    const maxLength = config.maxLength ?? 200
    log(`文本摘要，原文长度：${text.length}，最大长度：${maxLength}`)
    await delay(90)
    const summary = text.length > maxLength
      ? text.slice(0, maxLength) + '...'
      : text
    return {
      type: 'summarize',
      originalLength: text.length,
      summary,
      summaryLength: summary.length,
      timestamp: now(),
    }
  }

  /** 翻译 */
  private async executeTranslate(
    config: any,
    context: WorkflowContext,
    log: (msg: string) => void
  ): Promise<any> {
    const text = config.text || ''
    const from = config.from || 'auto'
    const to = config.to || 'en'
    log(`翻译：${from} -> ${to}，文本长度：${text.length}`)
    await delay(100)
    return {
      type: 'translate',
      from,
      to,
      original: text,
      translated: `[${to} 翻译结果] ${text}`,
      timestamp: now(),
    }
  }
}

// -------------------- tool 节点执行器 --------------------

/** tool 节点执行器：Web 搜索 / 代码执行 / 文件操作 / HTTP 请求 / 发送邮件 */
class ToolNodeExecutor implements NodeExecutor {
  async execute(node: WorkflowNode, context: WorkflowContext): Promise<NodeExecutionResult> {
    const startedAt = now()
    const { logs, log } = createLogger()
    const subType = node.subType || 'search'
    log(`工具节点启动，子类型：${subType}`)
    try {
      const resolvedConfig = deepResolveVariables(node.config, buildEvaluationVariables(context))
      let output: any
      switch (subType) {
        case 'search':
          output = await this.executeSearch(resolvedConfig, log)
          break
        case 'code':
          output = await this.executeCode(resolvedConfig, log)
          break
        case 'file':
          output = await this.executeFile(resolvedConfig, log)
          break
        case 'http':
          output = await this.executeHttp(resolvedConfig, log)
          break
        case 'email':
          output = await this.executeEmail(resolvedConfig, log)
          break
        default:
          throw new Error(`未知的工具节点子类型：${subType}`)
      }
      log(`工具节点执行完成`)
      return createSuccessResult(node.id, output, startedAt, logs)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      log(`工具节点执行失败：${msg}`)
      return createFailedResult(node.id, msg, startedAt)
    }
  }

  /** Web 搜索 */
  private async executeSearch(config: any, log: (msg: string) => void): Promise<any> {
    const query = config.query || ''
    const maxResults = config.maxResults ?? 5
    log(`Web 搜索：${query}，最大结果数：${maxResults}`)
    await delay(120)
    return {
      type: 'search',
      query,
      results: Array.from({ length: maxResults }, (_, i) => ({
        title: `搜索结果 ${i + 1} - ${query}`,
        url: `https://example.com/result/${i + 1}`,
        snippet: `这是与 "${query}" 相关的搜索结果片段 ${i + 1}`,
        score: 1 - i * 0.15,
      })),
      timestamp: now(),
    }
  }

  /** 代码执行（沙箱模拟） */
  private async executeCode(config: any, log: (msg: string) => void): Promise<any> {
    const language = config.language || 'javascript'
    const code = config.code || ''
    log(`代码执行，语言：${language}，代码长度：${code.length}`)
    await delay(100)
    // 模拟代码执行，不实际运行用户代码
    return {
      type: 'code',
      language,
      stdout: `[模拟输出] 代码执行成功`,
      stderr: '',
      exitCode: 0,
      duration: 100,
      timestamp: now(),
    }
  }

  /** 文件操作 */
  private async executeFile(config: any, log: (msg: string) => void): Promise<any> {
    const action = config.action || 'read'
    const path = config.path || ''
    log(`文件操作：${action}，路径：${path}`)
    await delay(50)
    return {
      type: 'file',
      action,
      path,
      success: true,
      content: action === 'read' ? `[文件内容] ${path}` : undefined,
      timestamp: now(),
    }
  }

  /** HTTP 请求 */
  private async executeHttp(config: any, log: (msg: string) => void): Promise<any> {
    const method = config.method || 'GET'
    const url = config.url || ''
    const headers = config.headers || {}
    const body = config.body
    log(`HTTP 请求：${method} ${url}`)
    await delay(150)
    return {
      type: 'http',
      method,
      url,
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      body: { ok: true, data: 'response data' },
      duration: 150,
      timestamp: now(),
    }
  }

  /** 发送邮件 */
  private async executeEmail(config: any, log: (msg: string) => void): Promise<any> {
    const to = config.to || ''
    const subject = config.subject || ''
    const body = config.body || ''
    log(`发送邮件到：${to}，主题：${subject}`)
    await delay(80)
    return {
      type: 'email',
      to,
      subject,
      bodyLength: body.length,
      sent: true,
      messageId: `msg_${Date.now()}`,
      timestamp: now(),
    }
  }
}

// -------------------- logic 节点执行器 --------------------

/** logic 节点执行器：条件分支 / 循环 / 并行 / 开关 */
class LogicNodeExecutor implements NodeExecutor {
  async execute(node: WorkflowNode, context: WorkflowContext): Promise<NodeExecutionResult> {
    const startedAt = now()
    const { logs, log } = createLogger()
    const subType = node.subType || 'if'
    log(`逻辑节点启动，子类型：${subType}`)
    try {
      const resolvedConfig = deepResolveVariables(node.config, buildEvaluationVariables(context))
      let output: any
      switch (subType) {
        case 'if':
          output = await this.executeIf(resolvedConfig, context, log)
          break
        case 'switch':
          output = await this.executeSwitch(resolvedConfig, context, log)
          break
        case 'for':
          output = await this.executeFor(resolvedConfig, context, node, log)
          break
        case 'while':
          output = await this.executeWhile(resolvedConfig, context, node, log)
          break
        case 'forEach':
          output = await this.executeForEach(resolvedConfig, context, node, log)
          break
        case 'fork':
          output = await this.executeFork(resolvedConfig, context, log)
          break
        case 'join':
          output = await this.executeJoin(resolvedConfig, context, log)
          break
        default:
          throw new Error(`未知的逻辑节点子类型：${subType}`)
      }
      log(`逻辑节点执行完成`)
      return createSuccessResult(node.id, output, startedAt, logs)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      log(`逻辑节点执行失败：${msg}`)
      return createFailedResult(node.id, msg, startedAt)
    }
  }

  /** if/else 条件分支 */
  private async executeIf(
    config: any,
    context: WorkflowContext,
    log: (msg: string) => void
  ): Promise<any> {
    const condition = config.condition
    const result = evaluateCondition(condition, context)
    log(`if 条件评估结果：${result}`)
    return {
      type: 'if',
      condition: String(condition),
      result,
      branch: result ? 'then' : 'else',
      timestamp: now(),
    }
  }

  /** switch 开关分支 */
  private async executeSwitch(
    config: any,
    context: WorkflowContext,
    log: (msg: string) => void
  ): Promise<any> {
    const value = config.value
    const cases = config.cases || []
    const defaultCase = config.default
    let matchedCase = null
    for (const c of cases) {
      if (looseEqual(c.value, value)) {
        matchedCase = c
        break
      }
    }
    if (matchedCase) {
      log(`switch 匹配到 case：${matchedCase.label || matchedCase.value}`)
    } else {
      log(`switch 未匹配，使用 default`)
    }
    return {
      type: 'switch',
      value,
      matchedCase: matchedCase?.label || matchedCase?.value || null,
      usedDefault: !matchedCase,
      timestamp: now(),
    }
  }

  /** for 循环 */
  private async executeFor(
    config: any,
    context: WorkflowContext,
    node: WorkflowNode,
    log: (msg: string) => void
  ): Promise<any> {
    const from = Number(config.from) || 0
    const to = Number(config.to) || 0
    const step = Number(config.step) || 1
    const count = Math.max(0, Math.floor((to - from) / step))
    context.loopCounters[node.id] = count
    log(`for 循环：${from} -> ${to}，步长 ${step}，共 ${count} 次`)
    const iterations: any[] = []
    for (let i = from; i < to; i += step) {
      iterations.push({ index: i, value: i })
    }
    return {
      type: 'for',
      from,
      to,
      step,
      count,
      iterations,
      timestamp: now(),
    }
  }

  /** while 循环 */
  private async executeWhile(
    config: any,
    context: WorkflowContext,
    node: WorkflowNode,
    log: (msg: string) => void
  ): Promise<any> {
    const condition = config.condition
    const maxIterations = Number(config.maxIterations) || 100
    let iterations = 0
    const results: any[] = []
    while (iterations < maxIterations) {
      const condResult = evaluateCondition(condition, context)
      if (!condResult) break
      results.push({ iteration: iterations, condition: true })
      iterations++
    }
    context.loopCounters[node.id] = iterations
    log(`while 循环执行 ${iterations} 次`)
    return {
      type: 'while',
      condition: String(condition),
      iterations,
      maxIterations,
      results,
      timestamp: now(),
    }
  }

  /** forEach 循环 */
  private async executeForEach(
    config: any,
    context: WorkflowContext,
    node: WorkflowNode,
    log: (msg: string) => void
  ): Promise<any> {
    const items = Array.isArray(config.items) ? config.items : []
    context.loopCounters[node.id] = items.length
    log(`forEach 循环，遍历 ${items.length} 个元素`)
    return {
      type: 'forEach',
      items,
      count: items.length,
      timestamp: now(),
    }
  }

  /** fork 并行分支 */
  private async executeFork(
    config: any,
    context: WorkflowContext,
    log: (msg: string) => void
  ): Promise<any> {
    const branches = config.branches || []
    log(`fork 并行，分支数：${branches.length}`)
    if (!context.parallelResults[context.currentNodeId!]) {
      context.parallelResults[context.currentNodeId!] = []
    }
    return {
      type: 'fork',
      branchCount: branches.length,
      branches,
      timestamp: now(),
    }
  }

  /** join 汇合 */
  private async executeJoin(
    config: any,
    context: WorkflowContext,
    log: (msg: string) => void
  ): Promise<any> {
    const forkNodeId = config.forkNodeId
    const results = forkNodeId ? context.parallelResults[forkNodeId] || [] : []
    log(`join 汇合，已收到 ${results.length} 个分支结果`)
    return {
      type: 'join',
      forkNodeId,
      results,
      resultCount: results.length,
      timestamp: now(),
    }
  }
}

// -------------------- output 节点执行器 --------------------

/** output 节点执行器：发送消息 / 调用 Webhook / 写文件 / 发邮件 / 存变量 */
class OutputNodeExecutor implements NodeExecutor {
  async execute(node: WorkflowNode, context: WorkflowContext): Promise<NodeExecutionResult> {
    const startedAt = now()
    const { logs, log } = createLogger()
    const subType = node.subType || 'message'
    log(`输出节点启动，子类型：${subType}`)
    try {
      const resolvedConfig = deepResolveVariables(node.config, buildEvaluationVariables(context))
      let output: any
      switch (subType) {
        case 'message':
          output = await this.executeMessage(resolvedConfig, log)
          break
        case 'webhook':
          output = await this.executeWebhook(resolvedConfig, log)
          break
        case 'file':
          output = await this.executeFile(resolvedConfig, log)
          break
        case 'email':
          output = await this.executeEmail(resolvedConfig, log)
          break
        case 'variable':
          output = await this.executeVariable(resolvedConfig, context, log)
          break
        default:
          throw new Error(`未知的输出节点子类型：${subType}`)
      }
      log(`输出节点执行完成`)
      return createSuccessResult(node.id, output, startedAt, logs)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      log(`输出节点执行失败：${msg}`)
      return createFailedResult(node.id, msg, startedAt)
    }
  }

  /** 发送消息 */
  private async executeMessage(config: any, log: (msg: string) => void): Promise<any> {
    const channel = config.channel || 'default'
    const content = config.content || ''
    log(`发送消息到 ${channel}，内容长度：${content.length}`)
    await delay(30)
    return {
      type: 'message',
      channel,
      content,
      sent: true,
      timestamp: now(),
    }
  }

  /** 调用 Webhook */
  private async executeWebhook(config: any, log: (msg: string) => void): Promise<any> {
    const url = config.url || ''
    const method = config.method || 'POST'
    log(`调用 Webhook：${method} ${url}`)
    await delay(100)
    return {
      type: 'webhook',
      url,
      method,
      success: true,
      responseStatus: 200,
      timestamp: now(),
    }
  }

  /** 写文件 */
  private async executeFile(config: any, log: (msg: string) => void): Promise<any> {
    const path = config.path || ''
    const content = config.content || ''
    const mode = config.mode || 'overwrite'
    log(`写文件：${path}，模式：${mode}`)
    await delay(40)
    return {
      type: 'file',
      path,
      mode,
      bytesWritten: content.length,
      success: true,
      timestamp: now(),
    }
  }

  /** 发邮件 */
  private async executeEmail(config: any, log: (msg: string) => void): Promise<any> {
    const to = config.to || ''
    const subject = config.subject || ''
    const body = config.body || ''
    log(`发邮件到：${to}`)
    await delay(60)
    return {
      type: 'email',
      to,
      subject,
      body,
      sent: true,
      messageId: `out_${Date.now()}`,
      timestamp: now(),
    }
  }

  /** 存变量 */
  private async executeVariable(
    config: any,
    context: WorkflowContext,
    log: (msg: string) => void
  ): Promise<any> {
    const name = config.name || ''
    const value = config.value
    const scope = config.scope || 'workflow'
    log(`存储变量：${name}，作用域：${scope}`)
    if (context.currentNodeId && scope === 'node') {
      context.nodeVariables[context.currentNodeId] = context.nodeVariables[context.currentNodeId] || {}
      context.nodeVariables[context.currentNodeId][name] = value
    } else if (scope === 'global') {
      context.globalVariables[name] = value
    } else {
      context.workflowVariables[name] = value
    }
    context.callbacks?.onVariableChange?.(scope as VariableScope, name, value, context)
    return {
      type: 'variable',
      name,
      value,
      scope,
      saved: true,
      timestamp: now(),
    }
  }
}

// -------------------- wait 节点执行器 --------------------

/** wait 节点执行器：延时等待 / 等待事件 / 等待审批 */
class WaitNodeExecutor implements NodeExecutor {
  async execute(node: WorkflowNode, context: WorkflowContext): Promise<NodeExecutionResult> {
    const startedAt = now()
    const { logs, log } = createLogger()
    const subType = node.subType || 'delay'
    log(`等待节点启动，子类型：${subType}`)
    try {
      const resolvedConfig = deepResolveVariables(node.config, buildEvaluationVariables(context))
      let output: any
      switch (subType) {
        case 'delay':
          output = await this.executeDelay(resolvedConfig, log)
          break
        case 'event':
          output = await this.executeEvent(resolvedConfig, log)
          break
        case 'approval':
          output = await this.executeApproval(resolvedConfig, log)
          break
        default:
          throw new Error(`未知的等待节点子类型：${subType}`)
      }
      log(`等待节点执行完成`)
      return createSuccessResult(node.id, output, startedAt, logs)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      log(`等待节点执行失败：${msg}`)
      return createFailedResult(node.id, msg, startedAt)
    }
  }

  /** 延时等待 */
  private async executeDelay(config: any, log: (msg: string) => void): Promise<any> {
    const duration = Math.min(Number(config.duration) || 0, 5000) // 上限 5 秒，避免阻塞
    log(`延时等待：${duration} 毫秒`)
    if (duration > 0) await delay(duration)
    return {
      type: 'delay',
      duration,
      waited: true,
      timestamp: now(),
    }
  }

  /** 等待事件 */
  private async executeEvent(config: any, log: (msg: string) => void): Promise<any> {
    const eventName = config.eventName || ''
    const timeout = Number(config.timeout) || 0
    log(`等待事件：${eventName}，超时：${timeout}`)
    // 模拟事件到达
    await delay(50)
    return {
      type: 'event',
      eventName,
      received: true,
      eventData: { simulated: true },
      timestamp: now(),
    }
  }

  /** 等待审批 */
  private async executeApproval(config: any, log: (msg: string) => void): Promise<any> {
    const approver = config.approver || ''
    const message = config.message || ''
    log(`等待审批，审批人：${approver}`)
    // 模拟审批通过
    await delay(50)
    return {
      type: 'approval',
      approver,
      message,
      approved: true,
      comment: '自动审批通过',
      timestamp: now(),
    }
  }
}

// -------------------- code 节点执行器 --------------------

/** code 节点执行器：执行自定义 JavaScript 代码（沙箱模拟） */
class CodeNodeExecutor implements NodeExecutor {
  async execute(node: WorkflowNode, context: WorkflowContext): Promise<NodeExecutionResult> {
    const startedAt = now()
    const { logs, log } = createLogger()
    log(`代码节点启动`)
    try {
      const code = node.config.code || ''
      const language = node.config.language || 'javascript'
      log(`执行 ${language} 代码，长度：${code.length}`)
      // 安全考虑：不实际执行用户代码，仅模拟
      const vars = buildEvaluationVariables(context)
      const output = this.simulateExecution(code, vars, log)
      log(`代码节点执行完成`)
      return createSuccessResult(node.id, output, startedAt, logs)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      log(`代码节点执行失败：${msg}`)
      return createFailedResult(node.id, msg, startedAt)
    }
  }

  /** 模拟代码执行：提取 return 语句或返回上下文快照 */
  private simulateExecution(code: string, variables: Record<string, any>, log: (msg: string) => void): any {
    // 尝试检测 return 语句
    const returnMatch = code.match(/return\s+([^;]+);?/)
    if (returnMatch) {
      const expr = returnMatch[1].trim()
      log(`检测到 return 语句：${expr}`)
      // 简单模拟：如果是字面量则返回
      if (/^-?\d+(\.\d+)?$/.test(expr)) return Number(expr)
      if (/^["'].*["']$/.test(expr)) return expr.slice(1, -1)
      if (expr === 'true') return true
      if (expr === 'false') return false
      if (expr === 'null') return null
      // 尝试作为变量路径
      const varValue = getPathValue(variables, expr)
      if (varValue !== undefined) return varValue
    }
    // 默认返回执行上下文
    return {
      type: 'code',
      executed: true,
      variables: Object.keys(variables),
      timestamp: now(),
    }
  }
}

// -------------------- condition 节点执行器 --------------------

/** condition 节点执行器：条件判断（与 logic.if 类似但更纯粹） */
class ConditionNodeExecutor implements NodeExecutor {
  async execute(node: WorkflowNode, context: WorkflowContext): Promise<NodeExecutionResult> {
    const startedAt = now()
    const { logs, log } = createLogger()
    log(`条件节点启动`)
    try {
      const condition = node.config.condition
      const result = evaluateCondition(condition, context)
      log(`条件评估结果：${result}`)
      return createSuccessResult(node.id, {
        type: 'condition',
        condition: String(condition),
        result,
        timestamp: now(),
      }, startedAt, logs)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      log(`条件节点执行失败：${msg}`)
      return createFailedResult(node.id, msg, startedAt)
    }
  }
}

// -------------------- loop 节点执行器 --------------------

/** loop 节点执行器：通用循环 */
class LoopNodeExecutor implements NodeExecutor {
  async execute(node: WorkflowNode, context: WorkflowContext): Promise<NodeExecutionResult> {
    const startedAt = now()
    const { logs, log } = createLogger()
    log(`循环节点启动`)
    try {
      const mode = node.config.mode || 'count'
      let count = 0
      const results: any[] = []
      if (mode === 'count') {
        count = Number(node.config.count) || 0
        for (let i = 0; i < count; i++) {
          results.push({ index: i })
        }
      } else if (mode === 'array') {
        const items = Array.isArray(node.config.items) ? node.config.items : []
        count = items.length
        for (let i = 0; i < items.length; i++) {
          results.push({ index: i, item: items[i] })
        }
      } else if (mode === 'condition') {
        const condition = node.config.condition
        const maxIterations = Number(node.config.maxIterations) || 100
        while (count < maxIterations && evaluateCondition(condition, context)) {
          results.push({ iteration: count })
          count++
        }
      }
      context.loopCounters[node.id] = count
      log(`循环执行 ${count} 次`)
      return createSuccessResult(node.id, {
        type: 'loop',
        mode,
        count,
        results,
        timestamp: now(),
      }, startedAt, logs)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      log(`循环节点执行失败：${msg}`)
      return createFailedResult(node.id, msg, startedAt)
    }
  }
}

// -------------------- parallel 节点执行器 --------------------

/** parallel 节点执行器：并行执行多路分支 */
class ParallelNodeExecutor implements NodeExecutor {
  async execute(node: WorkflowNode, context: WorkflowContext): Promise<NodeExecutionResult> {
    const startedAt = now()
    const { logs, log } = createLogger()
    log(`并行节点启动`)
    try {
      const branches = Array.isArray(node.config.branches) ? node.config.branches : []
      const mode = node.config.mode || 'fork'
      log(`并行模式：${mode}，分支数：${branches.length}`)
      // 初始化并行结果存储
      if (!context.parallelResults[node.id]) {
        context.parallelResults[node.id] = []
      }
      return createSuccessResult(node.id, {
        type: 'parallel',
        mode,
        branchCount: branches.length,
        branches,
        timestamp: now(),
      }, startedAt, logs)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      log(`并行节点执行失败：${msg}`)
      return createFailedResult(node.id, msg, startedAt)
    }
  }
}

// -------------------- transform 节点执行器 --------------------

/** transform 节点执行器：数据转换 / 映射 / 过滤 / 排序 */
class TransformNodeExecutor implements NodeExecutor {
  async execute(node: WorkflowNode, context: WorkflowContext): Promise<NodeExecutionResult> {
    const startedAt = now()
    const { logs, log } = createLogger()
    log(`转换节点启动`)
    try {
      const subType = node.subType || 'map'
      const resolvedConfig = deepResolveVariables(node.config, buildEvaluationVariables(context))
      let output: any
      switch (subType) {
        case 'map':
          output = this.executeMap(resolvedConfig, log)
          break
        case 'filter':
          output = this.executeFilter(resolvedConfig, log)
          break
        case 'sort':
          output = this.executeSort(resolvedConfig, log)
          break
        case 'reduce':
          output = this.executeReduce(resolvedConfig, log)
          break
        case 'format':
          output = this.executeFormat(resolvedConfig, log)
          break
        default:
          output = resolvedConfig.data
      }
      log(`转换节点执行完成`)
      return createSuccessResult(node.id, output, startedAt, logs)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      log(`转换节点执行失败：${msg}`)
      return createFailedResult(node.id, msg, startedAt)
    }
  }

  /** 映射 */
  private executeMap(config: any, log: (msg: string) => void): any {
    const data = Array.isArray(config.data) ? config.data : []
    const mapping = config.mapping || {}
    log(`映射数据，输入 ${data.length} 项`)
    const result = data.map((item, idx) => {
      const mapped: Record<string, any> = {}
      for (const [targetKey, sourcePath] of Object.entries(mapping)) {
        mapped[targetKey] = getPathValue(item, sourcePath as string) ?? null
      }
      return mapped
    })
    return { type: 'map', inputCount: data.length, output: result }
  }

  /** 过滤 */
  private executeFilter(config: any, log: (msg: string) => void): any {
    const data = Array.isArray(config.data) ? config.data : []
    const field = config.field
    const operator = config.operator || '=='
    const value = config.value
    log(`过滤数据，输入 ${data.length} 项，字段：${field}`)
    const result = data.filter(item => {
      const itemValue = field ? getPathValue(item, field) : item
      switch (operator) {
        case '==': return looseEqual(itemValue, value)
        case '!=': return !looseEqual(itemValue, value)
        case '>': return toNumber(itemValue) > toNumber(value)
        case '<': return toNumber(itemValue) < toNumber(value)
        case '>=': return toNumber(itemValue) >= toNumber(value)
        case '<=': return toNumber(itemValue) <= toNumber(value)
        case 'contains': return String(itemValue ?? '').includes(String(value))
        case 'in': return Array.isArray(value) && value.includes(itemValue)
        default: return true
      }
    })
    return { type: 'filter', inputCount: data.length, outputCount: result.length, output: result }
  }

  /** 排序 */
  private executeSort(config: any, log: (msg: string) => void): any {
    const data = Array.isArray(config.data) ? [...config.data] : []
    const field = config.field
    const order = config.order || 'asc'
    log(`排序数据，输入 ${data.length} 项，字段：${field}，顺序：${order}`)
    data.sort((a, b) => {
      const av = field ? getPathValue(a, field) : a
      const bv = field ? getPathValue(b, field) : b
      if (typeof av === 'number' && typeof bv === 'number') {
        return order === 'asc' ? av - bv : bv - av
      }
      const as = String(av ?? '')
      const bs = String(bv ?? '')
      if (as < bs) return order === 'asc' ? -1 : 1
      if (as > bs) return order === 'asc' ? 1 : -1
      return 0
    })
    return { type: 'sort', field, order, output: data }
  }

  /** 归约 */
  private executeReduce(config: any, log: (msg: string) => void): any {
    const data = Array.isArray(config.data) ? config.data : []
    const field = config.field
    const operation = config.operation || 'sum'
    log(`归约数据，输入 ${data.length} 项，操作：${operation}`)
    const values = field ? data.map(item => getPathValue(item, field)) : data
    let result: any
    switch (operation) {
      case 'sum':
        result = values.reduce((acc, v) => acc + toNumber(v), 0)
        break
      case 'product':
        result = values.reduce((acc, v) => acc * toNumber(v), 1)
        break
      case 'count':
        result = values.length
        break
      case 'avg':
        result = values.length ? values.reduce((acc, v) => acc + toNumber(v), 0) / values.length : 0
        break
      case 'min':
        result = values.length ? Math.min(...values.map(toNumber)) : 0
        break
      case 'max':
        result = values.length ? Math.max(...values.map(toNumber)) : 0
        break
      case 'concat':
        result = values.map(String).join('')
        break
      default:
        result = values
    }
    return { type: 'reduce', operation, result }
  }

  /** 格式化 */
  private executeFormat(config: any, log: (msg: string) => void): any {
    const data = config.data
    const format = config.format || 'json'
    log(`格式化数据，格式：${format}`)
    let result: string
    switch (format) {
      case 'json':
        result = JSON.stringify(data, null, 2)
        break
      case 'json-compact':
        result = JSON.stringify(data)
        break
      case 'csv': {
        if (!Array.isArray(data) || data.length === 0) {
          result = ''
        } else {
          const keys = Object.keys(data[0])
          const lines = [keys.join(',')]
          for (const item of data) {
            lines.push(keys.map(k => String(item[k] ?? '')).join(','))
          }
          result = lines.join('\n')
        }
        break
      }
      case 'text':
        result = String(data)
        break
      default:
        result = JSON.stringify(data)
    }
    return { type: 'format', format, result }
  }
}

// -------------------- merge 节点执行器 --------------------

/** merge 节点执行器：合并多路数据 */
class MergeNodeExecutor implements NodeExecutor {
  async execute(node: WorkflowNode, context: WorkflowContext): Promise<NodeExecutionResult> {
    const startedAt = now()
    const { logs, log } = createLogger()
    log(`合并节点启动`)
    try {
      const strategy = node.config.strategy || 'concat'
      const sources = Array.isArray(node.config.sources) ? node.config.sources : []
      log(`合并策略：${strategy}，源数：${sources.length}`)
      // 收集所有上游节点结果
      const incomingEdges = context.workflow.edges.filter(e => e.target === node.id)
      const collected: any[] = []
      for (const edge of incomingEdges) {
        const result = context.history.find(r => r.nodeId === edge.source)
        if (result && result.output !== undefined) {
          collected.push(result.output)
        }
      }
      let merged: any
      switch (strategy) {
        case 'concat':
          merged = collected.flat()
          break
        case 'object':
          merged = Object.assign({}, ...collected)
          break
        case 'array':
          merged = collected
          break
        case 'first':
          merged = collected[0]
          break
        case 'last':
          merged = collected[collected.length - 1]
          break
        case 'merge-deep':
          merged = deepMergeObjects(collected)
          break
        default:
          merged = collected
      }
      log(`合并完成，结果类型：${getVariableType(merged)}`)
      return createSuccessResult(node.id, {
        type: 'merge',
        strategy,
        sourceCount: collected.length,
        output: merged,
        timestamp: now(),
      }, startedAt, logs)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      log(`合并节点执行失败：${msg}`)
      return createFailedResult(node.id, msg, startedAt)
    }
  }
}

/** 深度合并多个对象 */
function deepMergeObjects(objects: any[]): any {
  if (!objects.length) return {}
  const result: Record<string, any> = {}
  for (const obj of objects) {
    if (!obj || typeof obj !== 'object') continue
    for (const key of Object.keys(obj)) {
      const value = obj[key]
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        result[key] = deepMergeObjects([result[key], value])
      } else {
        result[key] = value
      }
    }
  }
  return result
}

// -------------------- split 节点执行器 --------------------

/** split 节点执行器：拆分数据流 */
class SplitNodeExecutor implements NodeExecutor {
  async execute(node: WorkflowNode, context: WorkflowContext): Promise<NodeExecutionResult> {
    const startedAt = now()
    const { logs, log } = createLogger()
    log(`拆分节点启动`)
    try {
      const strategy = node.config.strategy || 'array'
      const resolvedConfig = deepResolveVariables(node.config, buildEvaluationVariables(context))
      const data = resolvedConfig.data
      let parts: any[]
      switch (strategy) {
        case 'array':
          parts = Array.isArray(data) ? data : [data]
          break
        case 'object':
          parts = typeof data === 'object' && data !== null
            ? Object.entries(data).map(([k, v]) => ({ key: k, value: v }))
            : []
          break
        case 'string':
          const delimiter = resolvedConfig.delimiter || ','
          parts = typeof data === 'string' ? data.split(delimiter) : []
          break
        case 'chunk': {
          const size = Number(resolvedConfig.size) || 1
          const arr = Array.isArray(data) ? data : [data]
          parts = []
          for (let i = 0; i < arr.length; i += size) {
            parts.push(arr.slice(i, i + size))
          }
          break
        }
        case 'lines':
          parts = typeof data === 'string' ? data.split('\n') : []
          break
        default:
          parts = [data]
      }
      log(`拆分完成，共 ${parts.length} 个部分`)
      return createSuccessResult(node.id, {
        type: 'split',
        strategy,
        partCount: parts.length,
        parts,
        timestamp: now(),
      }, startedAt, logs)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      log(`拆分节点执行失败：${msg}`)
      return createFailedResult(node.id, msg, startedAt)
    }
  }
}

/** 注册所有内置节点执行器 */
function registerBuiltinExecutors(): void {
  registerNodeExecutor('trigger', new TriggerNodeExecutor())
  registerNodeExecutor('ai', new AiNodeExecutor())
  registerNodeExecutor('tool', new ToolNodeExecutor())
  registerNodeExecutor('logic', new LogicNodeExecutor())
  registerNodeExecutor('output', new OutputNodeExecutor())
  registerNodeExecutor('wait', new WaitNodeExecutor())
  registerNodeExecutor('code', new CodeNodeExecutor())
  registerNodeExecutor('condition', new ConditionNodeExecutor())
  registerNodeExecutor('loop', new LoopNodeExecutor())
  registerNodeExecutor('parallel', new ParallelNodeExecutor())
  registerNodeExecutor('transform', new TransformNodeExecutor())
  registerNodeExecutor('merge', new MergeNodeExecutor())
  registerNodeExecutor('split', new SplitNodeExecutor())
}

// 模块加载时注册
registerBuiltinExecutors()

// ============================================================
// 第五部分：执行引擎
// ============================================================

/** 执行中的上下文集合（按执行ID索引） */
const activeContexts = new Map<string, WorkflowContext>()

/**
 * 执行工作流
 * @param workflow 工作流定义
 * @param triggerData 触发数据
 * @param options 执行选项
 */
export async function executeWorkflow(
  workflow: WorkflowDef,
  triggerData: any = {},
  options: ExecutionOptions = {}
): Promise<WorkflowContext> {
  // 创建执行上下文
  const context = createContext(workflow, triggerData, options)
  activeContexts.set(context.executionId, context)
  context.callbacks?.onStatusChange?.('running', context)
  try {
    // 查找起始节点（trigger 类型或入度为 0 的节点）
    const startNode = findStartNode(workflow)
    if (!startNode) {
      throw new Error('工作流中未找到起始节点')
    }
    // 执行超时控制
    const timeoutMs = options.timeout || 60000
    const timeoutPromise = createTimeoutPromise(timeoutMs, context)
    // 执行节点链
    const executionPromise = executeNodeChain(startNode, context)
    await Promise.race([executionPromise, timeoutPromise])
    // 完成状态
    if (!context.cancelled && !context.paused && context.status !== 'failed') {
      context.status = 'completed'
      context.finishedAt = now()
      context.callbacks?.onStatusChange?.('completed', context)
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    context.error = msg
    context.status = 'failed'
    context.finishedAt = now()
    context.callbacks?.onStatusChange?.('failed', context)
    context.callbacks?.onError?.(err instanceof Error ? err : new Error(msg), { id: '', type: 'trigger', name: 'workflow', config: {}, enabled: true }, context)
  } finally {
    // 记录到历史
    recordExecution(context)
    activeContexts.delete(context.executionId)
  }
  return context
}

/** 创建执行上下文 */
function createContext(
  workflow: WorkflowDef,
  triggerData: any,
  options: ExecutionOptions
): WorkflowContext {
  const executionId = generateId('exec')
  const startedAt = now()
  return {
    executionId,
    workflowId: workflow.id,
    workflow,
    triggerData,
    history: [],
    nodeLogs: [],
    variableSnapshots: [],
    globalVariables: { ...(workflow.variables || {}) },
    workflowVariables: {},
    nodeVariables: {},
    status: 'pending',
    startedAt,
    loopCounters: {},
    parallelResults: {},
    paused: false,
    cancelled: false,
    callbacks: options.callbacks,
    options,
  }
}

/** 创建超时 Promise */
function createTimeoutPromise(timeoutMs: number, context: WorkflowContext): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      if (context.status === 'running') {
        reject(new Error(`工作流执行超时（${timeoutMs} 毫秒）`))
      }
    }, timeoutMs)
  })
}

/** 查找起始节点：优先 trigger 类型，否则入度为 0 的节点 */
export function findStartNode(workflow: WorkflowDef): WorkflowNode | null {
  // 优先 trigger 类型节点
  const triggerNode = workflow.nodes.find(n => n.type === 'trigger' && n.enabled)
  if (triggerNode) return triggerNode
  // 入度为 0 的节点
  const targetIds = new Set(workflow.edges.map(e => e.target))
  const noIncoming = workflow.nodes.filter(n => n.enabled && !targetIds.has(n.id))
  if (noIncoming.length > 0) return noIncoming[0]
  // 退化为第一个启用的节点
  return workflow.nodes.find(n => n.enabled) || null
}

/**
 * 执行节点链：从指定节点开始，按边递归执行后续节点
 */
async function executeNodeChain(node: WorkflowNode, context: WorkflowContext): Promise<void> {
  let currentNode: WorkflowNode | null = node
  const executedNodes = new Set<string>()
  const maxSteps = 1000 // 防止无限循环
  let stepCount = 0
  while (currentNode && stepCount < maxSteps) {
    stepCount++
    // 检查暂停 / 取消
    if (context.cancelled) {
      context.status = 'cancelled'
      return
    }
    if (context.paused) {
      await waitForResume(context)
      if (context.cancelled) {
        context.status = 'cancelled'
        return
      }
    }
    if (executedNodes.has(currentNode.id)) {
      // 已执行过，跳出（防止环）
      break
    }
    executedNodes.add(currentNode.id)
    context.currentNodeId = currentNode.id
    // 执行当前节点
    const result = await executeNode(currentNode, context)
    context.history.push(result)
    // 记录节点日志
    logNodeExecution(currentNode, result, context)
    // 失败处理
    if (result.status === 'failed') {
      const retryConfig = currentNode.retry
      if (retryConfig && (result.retryCount || 0) < retryConfig.maxRetries) {
        // 重试
        const retryResult = await retryNodeExecution(currentNode, context, result)
        if (retryResult.status === 'completed') {
          // 重试成功，继续
        } else {
          // 重试失败，终止
          context.error = retryResult.error
          context.status = 'failed'
          return
        }
      } else {
        context.error = result.error
        context.status = 'failed'
        return
      }
    }
    // 查找下一节点
    const nextNodes = findNextNodes(currentNode.id, context.workflow.edges, context)
    if (nextNodes.length === 0) {
      // 没有后续节点，结束
      break
    }
    if (nextNodes.length === 1) {
      // 串行执行
      currentNode = nextNodes[0]
    } else {
      // 并行执行多个后续节点
      await executeParallelNextNodes(nextNodes, context, executedNodes)
      break
    }
  }
  if (stepCount >= maxSteps) {
    context.error = '工作流执行步骤超过上限（1000）'
    context.status = 'failed'
  }
}

/** 等待恢复 */
async function waitForResume(context: WorkflowContext): Promise<void> {
  while (context.paused && !context.cancelled) {
    await delay(100)
  }
}

/** 并行执行多个后续节点 */
async function executeParallelNextNodes(
  nodes: WorkflowNode[],
  context: WorkflowContext,
  executedNodes: Set<string>
): Promise<void> {
  await Promise.all(nodes.map(node => {
    if (!executedNodes.has(node.id)) {
      return executeNodeChain(node, context)
    }
    return Promise.resolve()
  }))
}

/**
 * 执行单个节点
 */
export async function executeNode(
  node: WorkflowNode,
  context: WorkflowContext
): Promise<NodeExecutionResult> {
  const startedAt = now()
  context.callbacks?.onNodeStart?.(node, context)
  // 检查是否启用
  if (!node.enabled) {
    return {
      nodeId: node.id,
      status: 'skipped',
      startedAt,
      finishedAt: now(),
      duration: 0,
    }
  }
  // 模拟执行模式
  if (context.options?.dryRun) {
    const result: NodeExecutionResult = {
      nodeId: node.id,
      status: 'completed',
      output: { dryRun: true, nodeType: node.type, subType: node.subType },
      startedAt,
      finishedAt: now(),
      duration: 0,
    }
    context.callbacks?.onNodeComplete?.(node, result, context)
    return result
  }
  // 获取执行器
  const executor = getNodeExecutor(node.type)
  if (!executor) {
    const result = createFailedResult(node.id, `未找到节点类型 "${node.type}" 的执行器`, startedAt)
    context.callbacks?.onNodeComplete?.(node, result, context)
    return result
  }
  // 节点级超时
  const timeoutConfig = node.timeout
  try {
    let result: NodeExecutionResult
    if (timeoutConfig) {
      const timeoutPromise = new Promise<NodeExecutionResult>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`节点 ${node.name} 执行超时（${timeoutConfig.duration} 毫秒）`))
        }, timeoutConfig.duration)
      })
      result = await Promise.race([executor.execute(node, context), timeoutPromise])
    } else {
      result = await executor.execute(node, context)
    }
    // 变量快照
    if (context.options?.snapshotVariables) {
      context.variableSnapshots.push({
        nodeId: node.id,
        timestamp: now(),
        variables: { ...context.globalVariables, ...context.workflowVariables },
      })
    }
    context.callbacks?.onNodeComplete?.(node, result, context)
    return result
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    // 超时后行为
    if (timeoutConfig) {
      if (timeoutConfig.behavior === 'skip') {
        const result: NodeExecutionResult = {
          nodeId: node.id,
          status: 'skipped',
          error: msg,
          startedAt,
          finishedAt: now(),
          duration: timeoutConfig.duration,
        }
        context.callbacks?.onNodeComplete?.(node, result, context)
        return result
      } else if (timeoutConfig.behavior === 'continue') {
        const result: NodeExecutionResult = {
          nodeId: node.id,
          status: 'completed',
          output: { timedOut: true, continued: true },
          error: msg,
          startedAt,
          finishedAt: now(),
          duration: timeoutConfig.duration,
        }
        context.callbacks?.onNodeComplete?.(node, result, context)
        return result
      }
    }
    const result = createFailedResult(node.id, msg, startedAt)
    context.callbacks?.onNodeComplete?.(node, result, context)
    context.callbacks?.onError?.(err instanceof Error ? err : new Error(msg), node, context)
    return result
  }
}

/** 重试节点执行 */
async function retryNodeExecution(
  node: WorkflowNode,
  context: WorkflowContext,
  previousResult: NodeExecutionResult
): Promise<NodeExecutionResult> {
  const retryConfig = node.retry!
  const retryCount = (previousResult.retryCount || 0) + 1
  if (retryCount > retryConfig.maxRetries) {
    return previousResult
  }
  // 计算等待时间
  let waitMs = retryConfig.interval
  if (retryConfig.backoff) {
    waitMs = waitMs * Math.pow(2, retryCount - 1)
  }
  await delay(waitMs)
  // 重新执行
  const result = await executeNode(node, context)
  result.retryCount = retryCount
  return result
}

/**
 * 查找下一节点：根据边的条件评估决定走哪些分支
 */
export function findNextNodes(
  currentNodeId: string,
  edges: WorkflowEdge[],
  context: WorkflowContext
): WorkflowNode[] {
  // 找到所有从当前节点出发的边
  const outgoingEdges = edges.filter(e => e.source === currentNodeId)
  if (outgoingEdges.length === 0) return []
  // 评估每条边的条件
  const passed: WorkflowEdge[] = []
  for (const edge of outgoingEdges) {
    if (evaluateEdgeCondition(edge, context)) {
      passed.push(edge)
    }
  }
  // 按优先级排序
  passed.sort((a, b) => (b.condition?.priority || 0) - (a.condition?.priority || 0))
  // 找到目标节点
  const nextNodeIds = passed.map(e => e.target)
  const nextNodes = context.workflow.nodes.filter(n => nextNodeIds.includes(n.id))
  return nextNodes
}

/** 评估边的条件 */
function evaluateEdgeCondition(edge: WorkflowEdge, context: WorkflowContext): boolean {
  if (!edge.condition) return true
  switch (edge.condition.type) {
    case 'always':
      return true
    case 'never':
      return false
    case 'expression':
      return evaluateCondition(edge.condition.expression, context)
    default:
      return true
  }
}

/** 记录节点执行日志 */
function logNodeExecution(
  node: WorkflowNode,
  result: NodeExecutionResult,
  context: WorkflowContext
): void {
  const log: NodeLog = {
    id: generateId('log'),
    executionId: context.executionId,
    nodeId: node.id,
    nodeName: node.name,
    nodeType: node.type,
    nodeSubType: node.subType,
    input: deepResolveVariables(node.config, buildEvaluationVariables(context)),
    output: result.output,
    status: result.status,
    startedAt: result.startedAt,
    finishedAt: result.finishedAt,
    duration: result.duration,
    error: result.error,
    retryCount: result.retryCount,
    logs: result.logs,
  }
  if (context.options?.snapshotVariables) {
    log.variableSnapshot = {
      nodeId: node.id,
      timestamp: now(),
      variables: { ...context.globalVariables, ...context.workflowVariables },
    }
  }
  context.nodeLogs.push(log)
}

/**
 * 暂停工作流
 */
export function pauseWorkflow(executionId: string): boolean {
  const context = activeContexts.get(executionId)
  if (!context || context.status !== 'running') return false
  context.paused = true
  context.status = 'paused'
  context.callbacks?.onStatusChange?.('paused', context)
  return true
}

/**
 * 恢复工作流
 */
export function resumeWorkflow(executionId: string): boolean {
  const context = activeContexts.get(executionId)
  if (!context || context.status !== 'paused') return false
  context.paused = false
  context.status = 'running'
  context.callbacks?.onStatusChange?.('running', context)
  return true
}

/**
 * 取消工作流
 */
export function cancelWorkflow(executionId: string): boolean {
  const context = activeContexts.get(executionId)
  if (!context) return false
  context.cancelled = true
  context.paused = false
  context.status = 'cancelled'
  context.finishedAt = now()
  context.callbacks?.onStatusChange?.('cancelled', context)
  return true
}

/** 获取执行中的上下文 */
export function getActiveContext(executionId: string): WorkflowContext | undefined {
  return activeContexts.get(executionId)
}

// ============================================================
// 第六部分：执行历史与日志
// ============================================================

/** 历史记录存储（按工作流ID分组） */
const executionHistory = new Map<string, ExecutionRecord[]>()

/** 历史记录存储上限（每个工作流） */
const MAX_HISTORY_PER_WORKFLOW = 100

/** 记录执行到历史 */
function recordExecution(context: WorkflowContext): void {
  const record: ExecutionRecord = {
    executionId: context.executionId,
    workflowId: context.workflowId,
    workflowName: context.workflow.name,
    workflowVersion: context.workflow.version,
    triggerType: context.workflow.trigger.type,
    triggerData: context.triggerData,
    status: context.status,
    startedAt: context.startedAt,
    finishedAt: context.finishedAt,
    duration: context.finishedAt ? computeDuration(context.startedAt, context.finishedAt) : undefined,
    nodeResults: [...context.history],
    nodeLogs: [...context.nodeLogs],
    output: context.history.length > 0 ? context.history[context.history.length - 1].output : undefined,
    error: context.error,
    executedBy: context.options?.executedBy,
  }
  const list = executionHistory.get(context.workflowId) || []
  list.unshift(record)
  // 限制历史数量
  if (list.length > MAX_HISTORY_PER_WORKFLOW) {
    list.length = MAX_HISTORY_PER_WORKFLOW
  }
  executionHistory.set(context.workflowId, list)
  // 持久化到 localStorage
  persistHistory(context.workflowId, list)
}

/** 持久化历史到 localStorage */
function persistHistory(workflowId: string, records: ExecutionRecord[]): void {
  try {
    const key = `hopeagent-workflow-history-${workflowId}`
    // 只持久化精简信息，避免存储过大
    const slim = records.map(r => ({
      executionId: r.executionId,
      workflowId: r.workflowId,
      workflowName: r.workflowName,
      workflowVersion: r.workflowVersion,
      triggerType: r.triggerType,
      status: r.status,
      startedAt: r.startedAt,
      finishedAt: r.finishedAt,
      duration: r.duration,
      error: r.error,
      executedBy: r.executedBy,
      nodeResultCount: r.nodeResults.length,
      output: r.output,
    }))
    localStorage.setItem(key, JSON.stringify(slim))
  } catch {
    // 忽略存储错误
  }
}

/**
 * 获取执行历史
 */
export function getExecutionHistory(workflowId: string, limit: number = 20): ExecutionRecord[] {
  const list = executionHistory.get(workflowId) || []
  return list.slice(0, limit)
}

/**
 * 获取执行详情
 */
export function getExecutionDetail(executionId: string): ExecutionRecord | undefined {
  for (const records of executionHistory.values()) {
    const found = records.find(r => r.executionId === executionId)
    if (found) return found
  }
  return undefined
}

/**
 * 清除执行历史
 */
export function clearExecutionHistory(workflowId: string): void {
  executionHistory.delete(workflowId)
  try {
    localStorage.removeItem(`hopeagent-workflow-history-${workflowId}`)
  } catch {}
}

/**
 * 获取执行统计
 */
export function getExecutionStats(workflowId: string): ExecutionStats {
  const records = executionHistory.get(workflowId) || []
  const total = records.length
  if (total === 0) {
    return {
      totalExecutions: 0,
      successCount: 0,
      failureCount: 0,
      cancelledCount: 0,
      successRate: 0,
      averageDuration: 0,
    }
  }
  const success = records.filter(r => r.status === 'completed').length
  const failed = records.filter(r => r.status === 'failed').length
  const cancelled = records.filter(r => r.status === 'cancelled').length
  const durations = records.filter(r => r.duration).map(r => r.duration!) as number[]
  const avgDuration = durations.length ? durations.reduce((a, b) => a + b, 0) / durations.length : 0
  // 找最慢节点
  const nodeDurations = new Map<string, { name: string; totalDuration: number; count: number }>()
  for (const record of records) {
    for (const log of record.nodeLogs) {
      if (log.duration) {
        const existing = nodeDurations.get(log.nodeId)
        if (existing) {
          existing.totalDuration += log.duration
          existing.count += 1
        } else {
          nodeDurations.set(log.nodeId, { name: log.nodeName, totalDuration: log.duration, count: 1 })
        }
      }
    }
  }
  let slowestNodeId: string | undefined
  let slowestNodeName: string | undefined
  let slowestNodeDuration = 0
  for (const [nodeId, info] of nodeDurations) {
    if (info.totalDuration > slowestNodeDuration) {
      slowestNodeDuration = info.totalDuration
      slowestNodeId = nodeId
      slowestNodeName = info.name
    }
  }
  return {
    totalExecutions: total,
    successCount: success,
    failureCount: failed,
    cancelledCount: cancelled,
    successRate: success / total,
    averageDuration: avgDuration,
    slowestNodeId,
    slowestNodeName,
    slowestNodeDuration,
    lastExecutionAt: records[0]?.startedAt,
  }
}

/**
 * 回放历史执行：根据历史记录重建上下文（只读）
 */
export function replayExecution(executionId: string): ExecutionRecord | undefined {
  return getExecutionDetail(executionId)
}

/**
 * 导出执行记录为 JSON
 */
export function exportExecution(executionId: string): string | undefined {
  const record = getExecutionDetail(executionId)
  if (!record) return undefined
  return JSON.stringify(record, null, 2)
}

// ============================================================
// 第七部分：工作流模板
// ============================================================

/** 创建基础工作流定义的辅助函数 */
function createBaseWorkflow(
  id: string,
  name: string,
  description: string,
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  trigger: TriggerConfig = { type: 'manual' }
): WorkflowDef {
  return {
    id,
    name,
    description,
    version: '1.0.0',
    nodes,
    edges,
    trigger,
    createdAt: now(),
    updatedAt: now(),
    enabled: true,
  }
}

/** 创建节点辅助函数 */
function createNode(
  id: string,
  type: NodeType,
  name: string,
  config: Record<string, any> = {},
  options: { subType?: string; description?: string; position?: NodePosition } = {}
): WorkflowNode {
  return {
    id,
    type,
    subType: options.subType,
    name,
    description: options.description,
    config,
    position: options.position,
    enabled: true,
  }
}

/** 创建边辅助函数 */
function createEdge(
  source: string,
  target: string,
  options: { id?: string; condition?: EdgeCondition; label?: string } = {}
): WorkflowEdge {
  return {
    id: options.id || `edge_${source}_${target}`,
    source,
    target,
    condition: options.condition,
    label: options.label,
  }
}

/** 预定义工作流模板列表 */
const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  // 1. 日报生成器
  {
    id: 'tpl-daily-report',
    name: '日报生成器',
    description: '自动生成每日工作日报，汇总当日完成的任务与明日计划',
    category: '办公自动化',
    icon: 'FileText',
    useCases: ['日报生成', '工作汇报', '任务汇总'],
    usageCount: 0,
    workflow: createBaseWorkflow(
      'wf-daily-report',
      '日报生成器',
      '自动生成每日工作日报',
      [
        createNode('trigger1', 'trigger', '每日触发', { cron: '0 18 * * *' }, { subType: 'schedule', description: '每天18点触发' }),
        createNode('ai1', 'ai', '生成日报', { prompt: '请根据今日任务数据生成日报', model: 'default' }, { subType: 'generate' }),
        createNode('output1', 'output', '发送日报', { channel: 'email', content: '${ai1.response}' }, { subType: 'message' }),
      ],
      [
        createEdge('trigger1', 'ai1'),
        createEdge('ai1', 'output1'),
      ],
      { type: 'schedule', cron: '0 18 * * *' }
    ),
  },
  // 2. 周报总结
  {
    id: 'tpl-weekly-report',
    name: '周报总结',
    description: '每周五自动汇总本周工作内容并生成周报',
    category: '办公自动化',
    icon: 'Calendar',
    useCases: ['周报生成', '周度总结'],
    usageCount: 0,
    workflow: createBaseWorkflow(
      'wf-weekly-report',
      '周报总结',
      '每周五自动生成周报',
      [
        createNode('trigger1', 'trigger', '每周触发', { cron: '0 17 * * 5' }, { subType: 'schedule' }),
        createNode('tool1', 'tool', '收集本周数据', { action: 'read', path: '/tasks/week' }, { subType: 'file' }),
        createNode('ai1', 'ai', '生成周报', { prompt: '请根据本周数据生成周报', model: 'default' }, { subType: 'summarize' }),
        createNode('output1', 'output', '发送周报', { channel: 'email' }, { subType: 'email' }),
      ],
      [
        createEdge('trigger1', 'tool1'),
        createEdge('tool1', 'ai1'),
        createEdge('ai1', 'output1'),
      ],
      { type: 'schedule', cron: '0 17 * * 5' }
    ),
  },
  // 3. 文档自动翻译
  {
    id: 'tpl-doc-translate',
    name: '文档自动翻译',
    description: '将上传的文档自动翻译为目标语言',
    category: '内容处理',
    icon: 'Languages',
    useCases: ['文档翻译', '多语言处理'],
    usageCount: 0,
    workflow: createBaseWorkflow(
      'wf-doc-translate',
      '文档自动翻译',
      '自动翻译文档到目标语言',
      [
        createNode('trigger1', 'trigger', '文件上传触发', {}, { subType: 'event', description: '文件上传事件' }),
        createNode('tool1', 'tool', '读取文件', { action: 'read', path: '${triggerData.path}' }, { subType: 'file' }),
        createNode('ai1', 'ai', '翻译文档', { text: '${tool1.content}', from: 'auto', to: 'en' }, { subType: 'translate' }),
        createNode('output1', 'output', '保存翻译结果', { path: '${triggerData.path}.translated', content: '${ai1.translated}' }, { subType: 'file' }),
      ],
      [
        createEdge('trigger1', 'tool1'),
        createEdge('tool1', 'ai1'),
        createEdge('ai1', 'output1'),
      ],
      { type: 'event', eventName: 'file.uploaded' }
    ),
  },
  // 4. 代码审查流程
  {
    id: 'tpl-code-review',
    name: '代码审查流程',
    description: '自动对提交的代码进行审查并生成审查报告',
    category: '开发流程',
    icon: 'Code',
    useCases: ['代码审查', '质量检查', 'PR 处理'],
    usageCount: 0,
    workflow: createBaseWorkflow(
      'wf-code-review',
      '代码审查流程',
      '自动代码审查',
      [
        createNode('trigger1', 'trigger', 'PR 触发', {}, { subType: 'webhook' }),
        createNode('tool1', 'tool', '获取代码差异', { url: '${triggerData.diffUrl}', method: 'GET' }, { subType: 'http' }),
        createNode('ai1', 'ai', 'AI 审查代码', { prompt: '请审查以下代码差异：${tool1.body}', model: 'default' }, { subType: 'llm' }),
        createNode('logic1', 'logic', '判断是否通过', { condition: '${ai1.response} contains "通过"' }, { subType: 'if' }),
        createNode('output1', 'output', '提交审查意见', { url: '${triggerData.commentUrl}', method: 'POST' }, { subType: 'webhook' }),
      ],
      [
        createEdge('trigger1', 'tool1'),
        createEdge('tool1', 'ai1'),
        createEdge('ai1', 'logic1'),
        createEdge('logic1', 'output1'),
      ],
      { type: 'webhook', webhookPath: '/webhook/pr' }
    ),
  },
  // 5. 数据清洗管道
  {
    id: 'tpl-data-cleaning',
    name: '数据清洗管道',
    description: '对原始数据进行清洗、转换、去重等处理',
    category: '数据处理',
    icon: 'Database',
    useCases: ['数据清洗', 'ETL', '数据预处理'],
    usageCount: 0,
    workflow: createBaseWorkflow(
      'wf-data-cleaning',
      '数据清洗管道',
      '数据清洗流程',
      [
        createNode('trigger1', 'trigger', '手动触发', {}, { subType: 'manual' }),
        createNode('tool1', 'tool', '读取原始数据', { action: 'read', path: '${triggerData.inputPath}' }, { subType: 'file' }),
        createNode('transform1', 'transform', '过滤无效数据', { data: '${tool1.content}', operator: '!=', value: null }, { subType: 'filter' }),
        createNode('transform2', 'transform', '去重排序', { data: '${transform1.output}', field: 'id', order: 'asc' }, { subType: 'sort' }),
        createNode('output1', 'output', '保存清洗结果', { path: '${triggerData.outputPath}', content: '${transform2.output}' }, { subType: 'file' }),
      ],
      [
        createEdge('trigger1', 'tool1'),
        createEdge('tool1', 'transform1'),
        createEdge('transform1', 'transform2'),
        createEdge('transform2', 'output1'),
      ]
    ),
  },
  // 6. 客户回复模板
  {
    id: 'tpl-customer-reply',
    name: '客户回复模板',
    description: '根据客户咨询内容自动生成回复建议',
    category: '客户服务',
    icon: 'MessageSquare',
    useCases: ['客户回复', '自动应答', '客服辅助'],
    usageCount: 0,
    workflow: createBaseWorkflow(
      'wf-customer-reply',
      '客户回复模板',
      '自动客户回复',
      [
        createNode('trigger1', 'trigger', '客户消息触发', {}, { subType: 'event' }),
        createNode('ai1', 'ai', '理解意图', { prompt: '分析客户咨询意图：${triggerData.message}', model: 'default' }, { subType: 'llm' }),
        createNode('ai2', 'ai', '检索知识库', { query: '${triggerData.message}', topK: 3 }, { subType: 'rag' }),
        createNode('ai3', 'ai', '生成回复', { prompt: '根据以下信息生成回复：${ai1.response} ${ai2.documents}' }, { subType: 'generate' }),
        createNode('output1', 'output', '发送回复', { channel: 'chat', content: '${ai3.result}' }, { subType: 'message' }),
      ],
      [
        createEdge('trigger1', 'ai1'),
        createEdge('ai1', 'ai2'),
        createEdge('ai2', 'ai3'),
        createEdge('ai3', 'output1'),
      ],
      { type: 'event', eventName: 'customer.message' }
    ),
  },
  // 7. 知识库构建
  {
    id: 'tpl-knowledge-build',
    name: '知识库构建',
    description: '从文档中提取知识并构建知识库',
    category: '知识管理',
    icon: 'BookOpen',
    useCases: ['知识库构建', '文档索引', 'RAG 准备'],
    usageCount: 0,
    workflow: createBaseWorkflow(
      'wf-knowledge-build',
      '知识库构建',
      '自动构建知识库',
      [
        createNode('trigger1', 'trigger', '批量文档触发', {}, { subType: 'manual' }),
        createNode('split1', 'split', '拆分文档列表', { data: '${triggerData.documents}', strategy: 'array' }),
        createNode('ai1', 'ai', '提取知识点', { prompt: '从文档中提取关键知识点', text: '${split1.parts}' }, { subType: 'llm' }),
        createNode('merge1', 'merge', '合并知识点', { strategy: 'concat' }),
        createNode('output1', 'output', '写入知识库', { path: '/kb/index', content: '${merge1.output}' }, { subType: 'file' }),
      ],
      [
        createEdge('trigger1', 'split1'),
        createEdge('split1', 'ai1'),
        createEdge('ai1', 'merge1'),
        createEdge('merge1', 'output1'),
      ]
    ),
  },
  // 8. 内容审核流程
  {
    id: 'tpl-content-review',
    name: '内容审核流程',
    description: '对用户生成内容进行自动审核',
    category: '内容处理',
    icon: 'Shield',
    useCases: ['内容审核', '合规检查', '风险识别'],
    usageCount: 0,
    workflow: createBaseWorkflow(
      'wf-content-review',
      '内容审核流程',
      '自动内容审核',
      [
        createNode('trigger1', 'trigger', '内容发布触发', {}, { subType: 'event' }),
        createNode('ai1', 'ai', '审核内容', { prompt: '审核以下内容是否合规：${triggerData.content}', model: 'default' }, { subType: 'llm' }),
        createNode('condition1', 'condition', '判断审核结果', { condition: '${ai1.response} contains "通过"' }),
        createNode('output1', 'output', '发布内容', { channel: 'publish' }, { subType: 'message' }),
        createNode('output2', 'output', '标记违规', { channel: 'flag', content: '内容违规' }, { subType: 'message' }),
      ],
      [
        createEdge('trigger1', 'ai1'),
        createEdge('ai1', 'condition1'),
        createEdge('condition1', 'output1', { condition: { type: 'expression', expression: '${ai1.response} contains "通过"' }, label: '通过' }),
        createEdge('condition1', 'output2', { condition: { type: 'expression', expression: '${ai1.response} contains "违规"' }, label: '违规' }),
      ],
      { type: 'event', eventName: 'content.published' }
    ),
  },
  // 9. 邮件自动分类
  {
    id: 'tpl-email-classify',
    name: '邮件自动分类',
    description: '自动对收到的邮件进行分类和标签化',
    category: '办公自动化',
    icon: 'Mail',
    useCases: ['邮件分类', '自动归档', '标签管理'],
    usageCount: 0,
    workflow: createBaseWorkflow(
      'wf-email-classify',
      '邮件自动分类',
      '自动邮件分类',
      [
        createNode('trigger1', 'trigger', '邮件接收触发', {}, { subType: 'event' }),
        createNode('ai1', 'ai', '分类邮件', { prompt: '将邮件分类为：工作/私人/广告/其他：${triggerData.subject}', model: 'default' }, { subType: 'llm' }),
        createNode('switch1', 'logic', '按类别路由', { value: '${ai1.response}', cases: [{ value: '工作', label: 'work' }, { value: '私人', label: 'personal' }] }, { subType: 'switch' }),
        createNode('output1', 'output', '归档到文件夹', { path: '/mail/work/${triggerData.id}' }, { subType: 'file' }),
      ],
      [
        createEdge('trigger1', 'ai1'),
        createEdge('ai1', 'switch1'),
        createEdge('switch1', 'output1'),
      ],
      { type: 'event', eventName: 'email.received' }
    ),
  },
  // 10. 会议纪要生成
  {
    id: 'tpl-meeting-notes',
    name: '会议纪要生成',
    description: '根据会议录音或文字记录生成会议纪要',
    category: '办公自动化',
    icon: 'Users',
    useCases: ['会议纪要', '会议记录', '行动项提取'],
    usageCount: 0,
    workflow: createBaseWorkflow(
      'wf-meeting-notes',
      '会议纪要生成',
      '自动生成会议纪要',
      [
        createNode('trigger1', 'trigger', '会议结束触发', {}, { subType: 'event' }),
        createNode('tool1', 'tool', '获取会议记录', { action: 'read', path: '${triggerData.transcriptPath}' }, { subType: 'file' }),
        createNode('ai1', 'ai', '生成纪要', { text: '${tool1.content}', maxLength: 500 }, { subType: 'summarize' }),
        createNode('ai2', 'ai', '提取行动项', { prompt: '从以下纪要中提取行动项：${ai1.summary}', model: 'default' }, { subType: 'llm' }),
        createNode('output1', 'output', '发送纪要', { channel: 'email', subject: '会议纪要', body: '${ai1.summary}' }, { subType: 'email' }),
      ],
      [
        createEdge('trigger1', 'tool1'),
        createEdge('tool1', 'ai1'),
        createEdge('ai1', 'ai2'),
        createEdge('ai2', 'output1'),
      ],
      { type: 'event', eventName: 'meeting.ended' }
    ),
  },
  // 11. 项目状态报告
  {
    id: 'tpl-project-status',
    name: '项目状态报告',
    description: '自动汇总项目进度并生成状态报告',
    category: '项目管理',
    icon: 'Trello',
    useCases: ['项目报告', '进度汇总', '风险预警'],
    usageCount: 0,
    workflow: createBaseWorkflow(
      'wf-project-status',
      '项目状态报告',
      '自动项目状态报告',
      [
        createNode('trigger1', 'trigger', '定时触发', {}, { subType: 'schedule' }),
        createNode('tool1', 'tool', '获取项目数据', { url: '${triggerData.apiUrl}', method: 'GET' }, { subType: 'http' }),
        createNode('ai1', 'ai', '生成报告', { prompt: '根据项目数据生成状态报告：${tool1.body}', model: 'default' }, { subType: 'generate' }),
        createNode('output1', 'output', '发送报告', { channel: 'slack', content: '${ai1.result}' }, { subType: 'message' }),
      ],
      [
        createEdge('trigger1', 'tool1'),
        createEdge('tool1', 'ai1'),
        createEdge('ai1', 'output1'),
      ],
      { type: 'schedule', cron: '0 9 * * 1' }
    ),
  },
  // 12. 技术文档生成
  {
    id: 'tpl-tech-doc',
    name: '技术文档生成',
    description: '根据代码自动生成技术文档',
    category: '开发流程',
    icon: 'FileCode',
    useCases: ['文档生成', 'API 文档', '代码注释'],
    usageCount: 0,
    workflow: createBaseWorkflow(
      'wf-tech-doc',
      '技术文档生成',
      '自动技术文档生成',
      [
        createNode('trigger1', 'trigger', '代码提交触发', {}, { subType: 'webhook' }),
        createNode('tool1', 'tool', '获取代码', { url: '${triggerData.repoUrl}', method: 'GET' }, { subType: 'http' }),
        createNode('ai1', 'ai', '生成文档', { prompt: '为以下代码生成技术文档：${tool1.body}', model: 'default' }, { subType: 'generate' }),
        createNode('output1', 'output', '保存文档', { path: '/docs/api.md', content: '${ai1.result}' }, { subType: 'file' }),
      ],
      [
        createEdge('trigger1', 'tool1'),
        createEdge('tool1', 'ai1'),
        createEdge('ai1', 'output1'),
      ],
      { type: 'webhook', webhookPath: '/webhook/code' }
    ),
  },
  // 13. API 测试流程
  {
    id: 'tpl-api-test',
    name: 'API 测试流程',
    description: '自动执行 API 测试并生成测试报告',
    category: '开发流程',
    icon: 'Send',
    useCases: ['API 测试', '接口验证', '自动化测试'],
    usageCount: 0,
    workflow: createBaseWorkflow(
      'wf-api-test',
      'API 测试流程',
      '自动 API 测试',
      [
        createNode('trigger1', 'trigger', '手动触发', {}, { subType: 'manual' }),
        createNode('tool1', 'tool', '执行 GET 测试', { url: '${triggerData.endpoint}', method: 'GET' }, { subType: 'http' }),
        createNode('tool2', 'tool', '执行 POST 测试', { url: '${triggerData.endpoint}', method: 'POST', body: { test: true } }, { subType: 'http' }),
        createNode('merge1', 'merge', '合并测试结果', { strategy: 'array' }),
        createNode('ai1', 'ai', '生成报告', { prompt: '根据测试结果生成报告：${merge1.output}', model: 'default' }, { subType: 'generate' }),
        createNode('output1', 'output', '保存报告', { path: '/reports/api-test.md', content: '${ai1.result}' }, { subType: 'file' }),
      ],
      [
        createEdge('trigger1', 'tool1'),
        createEdge('trigger1', 'tool2'),
        createEdge('tool1', 'merge1'),
        createEdge('tool2', 'merge1'),
        createEdge('merge1', 'ai1'),
        createEdge('ai1', 'output1'),
      ]
    ),
  },
  // 14. 数据备份流程
  {
    id: 'tpl-data-backup',
    name: '数据备份流程',
    description: '定时备份关键数据到指定位置',
    category: '运维',
    icon: 'HardDrive',
    useCases: ['数据备份', '定时任务', '数据安全'],
    usageCount: 0,
    workflow: createBaseWorkflow(
      'wf-data-backup',
      '数据备份流程',
      '自动数据备份',
      [
        createNode('trigger1', 'trigger', '定时触发', {}, { subType: 'schedule' }),
        createNode('tool1', 'tool', '读取源数据', { action: 'read', path: '${triggerData.sourcePath}' }, { subType: 'file' }),
        createNode('transform1', 'transform', '压缩数据', { data: '${tool1.content}', format: 'json' }, { subType: 'format' }),
        createNode('output1', 'output', '写入备份', { path: '${triggerData.backupPath}/${timestamp}.json', content: '${transform1.result}' }, { subType: 'file' }),
        createNode('output2', 'output', '发送通知', { channel: 'email', subject: '备份完成', body: '数据已备份到 ${triggerData.backupPath}' }, { subType: 'email' }),
      ],
      [
        createEdge('trigger1', 'tool1'),
        createEdge('tool1', 'transform1'),
        createEdge('transform1', 'output1'),
        createEdge('output1', 'output2'),
      ],
      { type: 'schedule', cron: '0 2 * * *' }
    ),
  },
  // 15. 监控告警处理
  {
    id: 'tpl-monitor-alert',
    name: '监控告警处理',
    description: '接收监控告警并自动分析、通知相关人员',
    category: '运维',
    icon: 'AlertCircle',
    useCases: ['告警处理', '故障通知', '自动响应'],
    usageCount: 0,
    workflow: createBaseWorkflow(
      'wf-monitor-alert',
      '监控告警处理',
      '自动告警处理',
      [
        createNode('trigger1', 'trigger', '告警触发', {}, { subType: 'webhook' }),
        createNode('ai1', 'ai', '分析告警', { prompt: '分析以下告警的严重程度和建议：${triggerData.alert}', model: 'default' }, { subType: 'llm' }),
        createNode('condition1', 'condition', '判断严重程度', { condition: '${triggerData.severity} == "critical"' }),
        createNode('output1', 'output', '紧急通知', { channel: 'sms', content: '紧急告警：${triggerData.alert}' }, { subType: 'message' }),
        createNode('output2', 'output', '普通通知', { channel: 'email', subject: '告警通知', body: '${ai1.response}' }, { subType: 'email' }),
      ],
      [
        createEdge('trigger1', 'ai1'),
        createEdge('ai1', 'condition1'),
        createEdge('condition1', 'output1', { condition: { type: 'expression', expression: '${triggerData.severity} == "critical"' }, label: '紧急' }),
        createEdge('condition1', 'output2', { condition: { type: 'expression', expression: '${triggerData.severity} != "critical"' }, label: '普通' }),
      ],
      { type: 'webhook', webhookPath: '/webhook/alert' }
    ),
  },
  // 16. 用户反馈分析
  {
    id: 'tpl-feedback-analysis',
    name: '用户反馈分析',
    description: '自动收集并分析用户反馈，提取关键洞察',
    category: '客户服务',
    icon: 'MessageCircle',
    useCases: ['反馈分析', '情感分析', '产品改进'],
    usageCount: 0,
    workflow: createBaseWorkflow(
      'wf-feedback-analysis',
      '用户反馈分析',
      '自动反馈分析',
      [
        createNode('trigger1', 'trigger', '定时触发', {}, { subType: 'schedule' }),
        createNode('tool1', 'tool', '收集反馈', { url: '${triggerData.feedbackApi}', method: 'GET' }, { subType: 'http' }),
        createNode('split1', 'split', '拆分反馈', { data: '${tool1.body}', strategy: 'array' }),
        createNode('ai1', 'ai', '情感分析', { prompt: '分析反馈情感倾向：${split1.parts}', model: 'default' }, { subType: 'llm' }),
        createNode('merge1', 'merge', '合并分析结果', { strategy: 'array' }),
        createNode('ai2', 'ai', '生成洞察报告', { prompt: '根据分析结果生成洞察：${merge1.output}', model: 'default' }, { subType: 'summarize' }),
        createNode('output1', 'output', '保存报告', { path: '/reports/feedback.md', content: '${ai2.summary}' }, { subType: 'file' }),
      ],
      [
        createEdge('trigger1', 'tool1'),
        createEdge('tool1', 'split1'),
        createEdge('split1', 'ai1'),
        createEdge('ai1', 'merge1'),
        createEdge('merge1', 'ai2'),
        createEdge('ai2', 'output1'),
      ],
      { type: 'schedule', cron: '0 0 * * 0' }
    ),
  },
  // 17. 社交媒体发布
  {
    id: 'tpl-social-publish',
    name: '社交媒体发布',
    description: '自动生成并定时发布社交媒体内容',
    category: '营销',
    icon: 'Share2',
    useCases: ['内容发布', '社媒管理', '定时推送'],
    usageCount: 0,
    workflow: createBaseWorkflow(
      'wf-social-publish',
      '社交媒体发布',
      '自动社媒发布',
      [
        createNode('trigger1', 'trigger', '定时触发', {}, { subType: 'schedule' }),
        createNode('ai1', 'ai', '生成内容', { prompt: '生成今日社媒内容，主题：${triggerData.topic}', model: 'default' }, { subType: 'generate' }),
        createNode('wait1', 'wait', '等待审批', { approver: '${triggerData.approver}', message: '${ai1.result}' }, { subType: 'approval' }),
        createNode('condition1', 'condition', '判断审批', { condition: '${wait1.output.approved} == true' }),
        createNode('output1', 'output', '发布内容', { channel: 'social', content: '${ai1.result}' }, { subType: 'message' }),
      ],
      [
        createEdge('trigger1', 'ai1'),
        createEdge('ai1', 'wait1'),
        createEdge('wait1', 'condition1'),
        createEdge('condition1', 'output1', { condition: { type: 'expression', expression: '${wait1.output.approved} == true' } }),
      ],
      { type: 'schedule', cron: '0 10 * * *' }
    ),
  },
  // 18. 搜索优化分析
  {
    id: 'tpl-seo-analysis',
    name: '搜索优化分析',
    description: '分析网站 SEO 表现并生成优化建议',
    category: '营销',
    icon: 'Search',
    useCases: ['SEO 分析', '关键词优化', '排名监控'],
    usageCount: 0,
    workflow: createBaseWorkflow(
      'wf-seo-analysis',
      '搜索优化分析',
      '自动 SEO 分析',
      [
        createNode('trigger1', 'trigger', '手动触发', {}, { subType: 'manual' }),
        createNode('tool1', 'tool', '抓取页面', { url: '${triggerData.url}', method: 'GET' }, { subType: 'http' }),
        createNode('ai1', 'ai', '分析 SEO', { prompt: '分析以下页面的 SEO 情况：${tool1.body}', model: 'default' }, { subType: 'llm' }),
        createNode('ai2', 'ai', '生成建议', { prompt: '根据分析生成优化建议：${ai1.response}', model: 'default' }, { subType: 'generate' }),
        createNode('output1', 'output', '保存报告', { path: '/reports/seo.md', content: '${ai2.result}' }, { subType: 'file' }),
      ],
      [
        createEdge('trigger1', 'tool1'),
        createEdge('tool1', 'ai1'),
        createEdge('ai1', 'ai2'),
        createEdge('ai2', 'output1'),
      ]
    ),
  },
  // 19. 安全扫描流程
  {
    id: 'tpl-security-scan',
    name: '安全扫描流程',
    description: '对代码或系统进行安全扫描并生成报告',
    category: '运维',
    icon: 'Shield',
    useCases: ['安全扫描', '漏洞检测', '合规审计'],
    usageCount: 0,
    workflow: createBaseWorkflow(
      'wf-security-scan',
      '安全扫描流程',
      '自动安全扫描',
      [
        createNode('trigger1', 'trigger', '定时触发', {}, { subType: 'schedule' }),
        createNode('tool1', 'tool', '执行扫描', { url: '${triggerData.scanApi}', method: 'POST' }, { subType: 'http' }),
        createNode('ai1', 'ai', '分析漏洞', { prompt: '分析以下扫描结果中的漏洞：${tool1.body}', model: 'default' }, { subType: 'llm' }),
        createNode('condition1', 'condition', '判断是否有高危', { condition: '${triggerData.severity} == "high"' }),
        createNode('output1', 'output', '紧急通知', { channel: 'email', subject: '安全告警', body: '${ai1.response}' }, { subType: 'email' }),
        createNode('output2', 'output', '保存报告', { path: '/reports/security.md', content: '${ai1.response}' }, { subType: 'file' }),
      ],
      [
        createEdge('trigger1', 'tool1'),
        createEdge('tool1', 'ai1'),
        createEdge('ai1', 'condition1'),
        createEdge('condition1', 'output1', { condition: { type: 'expression', expression: '${triggerData.severity} == "high"' } }),
        createEdge('condition1', 'output2', { condition: { type: 'expression', expression: '${triggerData.severity} != "high"' } }),
      ],
      { type: 'schedule', cron: '0 3 * * 1' }
    ),
  },
  // 20. 性能测试流程
  {
    id: 'tpl-perf-test',
    name: '性能测试流程',
    description: '自动执行性能测试并分析结果',
    category: '开发流程',
    icon: 'Gauge',
    useCases: ['性能测试', '压力测试', '性能优化'],
    usageCount: 0,
    workflow: createBaseWorkflow(
      'wf-perf-test',
      '性能测试流程',
      '自动性能测试',
      [
        createNode('trigger1', 'trigger', '手动触发', {}, { subType: 'manual' }),
        createNode('tool1', 'tool', '执行压测', { url: '${triggerData.testApi}', method: 'POST', body: { duration: 60 } }, { subType: 'http' }),
        createNode('ai1', 'ai', '分析结果', { prompt: '分析以下性能测试结果：${tool1.body}', model: 'default' }, { subType: 'llm' }),
        createNode('ai2', 'ai', '生成优化建议', { prompt: '根据分析生成优化建议：${ai1.response}', model: 'default' }, { subType: 'generate' }),
        createNode('output1', 'output', '保存报告', { path: '/reports/perf.md', content: '${ai2.result}' }, { subType: 'file' }),
      ],
      [
        createEdge('trigger1', 'tool1'),
        createEdge('tool1', 'ai1'),
        createEdge('ai1', 'ai2'),
        createEdge('ai2', 'output1'),
      ]
    ),
  },
  // 21. 部署自动化
  {
    id: 'tpl-deploy-auto',
    name: '部署自动化',
    description: '自动化部署流程，含审批与回滚机制',
    category: '运维',
    icon: 'Rocket',
    useCases: ['自动部署', 'CI/CD', '发布管理'],
    usageCount: 0,
    workflow: createBaseWorkflow(
      'wf-deploy-auto',
      '部署自动化',
      '自动部署流程',
      [
        createNode('trigger1', 'trigger', '代码合并触发', {}, { subType: 'webhook' }),
        createNode('tool1', 'tool', '运行测试', { url: '${triggerData.testApi}', method: 'POST' }, { subType: 'http' }),
        createNode('condition1', 'condition', '判断测试结果', { condition: '${tool1.body.status} == "passed"' }),
        createNode('wait1', 'wait', '等待部署审批', { approver: '${triggerData.approver}', message: '请审批部署' }, { subType: 'approval' }),
        createNode('tool2', 'tool', '执行部署', { url: '${triggerData.deployApi}', method: 'POST' }, { subType: 'http' }),
        createNode('output1', 'output', '通知部署结果', { channel: 'slack', content: '部署完成：${tool2.body}' }, { subType: 'message' }),
      ],
      [
        createEdge('trigger1', 'tool1'),
        createEdge('tool1', 'condition1'),
        createEdge('condition1', 'wait1', { condition: { type: 'expression', expression: '${tool1.body.status} == "passed"' } }),
        createEdge('wait1', 'tool2'),
        createEdge('tool2', 'output1'),
      ],
      { type: 'webhook', webhookPath: '/webhook/merge' }
    ),
  },
]

/**
 * 获取所有工作流模板
 */
export function getWorkflowTemplates(): WorkflowTemplate[] {
  return [...WORKFLOW_TEMPLATES]
}

/**
 * 按 ID 获取工作流模板
 */
export function getWorkflowTemplate(id: string): WorkflowTemplate | undefined {
  return WORKFLOW_TEMPLATES.find(t => t.id === id)
}

/**
 * 按分类获取工作流模板
 */
export function getWorkflowTemplatesByCategory(category: string): WorkflowTemplate[] {
  return WORKFLOW_TEMPLATES.filter(t => t.category === category)
}

/**
 * 从模板创建工作流
 */
export function createWorkflowFromTemplate(templateId: string, customName?: string): WorkflowDef | undefined {
  const template = getWorkflowTemplate(templateId)
  if (!template) return undefined
  const workflow = JSON.parse(JSON.stringify(template.workflow)) as WorkflowDef
  workflow.id = generateId('wf')
  workflow.name = customName || `${template.name} (副本)`
  workflow.createdAt = now()
  workflow.updatedAt = now()
  return workflow
}

// ============================================================
// 第八部分：工作流管理 API
// ============================================================

/** 本地存储键 */
const WORKFLOWS_STORAGE_KEY = 'hopeagent-workflows'

/** 工作流存储接口 */
interface WorkflowStore {
  workflows: Record<string, WorkflowDef>
}

/** 加载本地存储的工作流 */
function loadStoredWorkflows(): Record<string, WorkflowDef> {
  try {
    const raw = localStorage.getItem(WORKFLOWS_STORAGE_KEY)
    if (!raw) return {}
    const store = JSON.parse(raw) as WorkflowStore
    return store.workflows || {}
  } catch {
    return {}
  }
}

/** 保存工作流到本地存储 */
function saveStoredWorkflows(workflows: Record<string, WorkflowDef>): void {
  try {
    const store: WorkflowStore = { workflows }
    localStorage.setItem(WORKFLOWS_STORAGE_KEY, JSON.stringify(store))
  } catch {
    // 忽略存储错误
  }
}

/** 内存中的工作流缓存 */
let workflowCache: Record<string, WorkflowDef> | null = null

/** 获取工作流缓存（懒加载） */
function getWorkflowCache(): Record<string, WorkflowDef> {
  if (!workflowCache) {
    workflowCache = loadStoredWorkflows()
  }
  return workflowCache
}

/** 持久化缓存到存储 */
function persistCache(): void {
  if (workflowCache) {
    saveStoredWorkflows(workflowCache)
  }
}

/**
 * 创建工作流
 */
export function createWorkflow(def: Partial<WorkflowDef> & { name: string }): WorkflowDef {
  const cache = getWorkflowCache()
  const id = def.id || generateId('wf')
  const nowStr = now()
  const workflow: WorkflowDef = {
    id,
    name: def.name,
    description: def.description || '',
    version: def.version || '1.0.0',
    nodes: def.nodes || [],
    edges: def.edges || [],
    trigger: def.trigger || { type: 'manual' },
    inputSchema: def.inputSchema,
    outputSchema: def.outputSchema,
    variables: def.variables,
    tags: def.tags,
    createdAt: nowStr,
    updatedAt: nowStr,
    createdBy: def.createdBy,
    enabled: def.enabled ?? true,
  }
  cache[id] = workflow
  persistCache()
  return workflow
}

/**
 * 更新工作流
 */
export function updateWorkflow(id: string, def: Partial<WorkflowDef>): WorkflowDef | undefined {
  const cache = getWorkflowCache()
  const existing = cache[id]
  if (!existing) return undefined
  const updated: WorkflowDef = {
    ...existing,
    ...def,
    id, // 不允许修改 ID
    updatedAt: now(),
  }
  cache[id] = updated
  persistCache()
  return updated
}

/**
 * 删除工作流
 */
export function deleteWorkflow(id: string): boolean {
  const cache = getWorkflowCache()
  if (!cache[id]) return false
  delete cache[id]
  persistCache()
  // 同时清除该工作流的执行历史
  clearExecutionHistory(id)
  return true
}

/**
 * 获取工作流
 */
export function getWorkflow(id: string): WorkflowDef | undefined {
  const cache = getWorkflowCache()
  return cache[id]
}

/**
 * 列出所有工作流
 */
export function listWorkflows(filter?: {
  category?: string
  tag?: string
  enabledOnly?: boolean
  search?: string
}): WorkflowDef[] {
  const cache = getWorkflowCache()
  let list = Object.values(cache)
  if (filter) {
    if (filter.enabledOnly) {
      list = list.filter(w => w.enabled)
    }
    if (filter.tag) {
      list = list.filter(w => w.tags?.includes(filter.tag!))
    }
    if (filter.search) {
      const q = filter.search.toLowerCase()
      list = list.filter(w =>
        w.name.toLowerCase().includes(q) ||
        (w.description || '').toLowerCase().includes(q)
      )
    }
  }
  // 按更新时间倒序
  list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  return list
}

/**
 * 运行工作流
 */
export async function runWorkflow(
  id: string,
  triggerData: any = {},
  options: ExecutionOptions = {}
): Promise<WorkflowContext> {
  const workflow = getWorkflow(id)
  if (!workflow) {
    throw new Error(`工作流不存在：${id}`)
  }
  if (!workflow.enabled) {
    throw new Error(`工作流已禁用：${id}`)
  }
  return executeWorkflow(workflow, triggerData, options)
}

/**
 * 校验工作流定义
 */
export function validateWorkflow(def: Partial<WorkflowDef>): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []
  // 检查名称
  if (!def.name || !def.name.trim()) {
    errors.push({ level: 'error', code: 'NAME_REQUIRED', message: '工作流名称不能为空' })
  }
  // 检查节点
  if (!def.nodes || def.nodes.length === 0) {
    errors.push({ level: 'error', code: 'NO_NODES', message: '工作流必须至少包含一个节点' })
  } else {
    const nodeIds = new Set<string>()
    for (const node of def.nodes) {
      // 检查节点 ID 唯一性
      if (nodeIds.has(node.id)) {
        errors.push({ level: 'error', code: 'DUPLICATE_NODE_ID', message: `节点 ID 重复：${node.id}`, nodeId: node.id })
      }
      nodeIds.add(node.id)
      // 检查节点名称
      if (!node.name || !node.name.trim()) {
        errors.push({ level: 'error', code: 'NODE_NAME_REQUIRED', message: `节点名称不能为空`, nodeId: node.id })
      }
      // 检查节点类型
      if (!node.type) {
        errors.push({ level: 'error', code: 'NODE_TYPE_REQUIRED', message: `节点类型不能为空：${node.id}`, nodeId: node.id })
      }
      // 检查是否有执行器
      if (node.type && !getNodeExecutor(node.type)) {
        errors.push({ level: 'error', code: 'NO_EXECUTOR', message: `未找到节点类型 "${node.type}" 的执行器`, nodeId: node.id })
      }
    }
    // 检查触发器节点
    const triggerNodes = def.nodes.filter(n => n.type === 'trigger')
    if (triggerNodes.length === 0) {
      warnings.push({ level: 'warning', code: 'NO_TRIGGER', message: '工作流未包含触发器节点' })
    } else if (triggerNodes.length > 1) {
      warnings.push({ level: 'warning', code: 'MULTIPLE_TRIGGERS', message: `工作流包含 ${triggerNodes.length} 个触发器节点` })
    }
  }
  // 检查边
  if (def.edges) {
    const nodeIds = new Set((def.nodes || []).map(n => n.id))
    for (const edge of def.edges) {
      // 检查源节点是否存在
      if (!nodeIds.has(edge.source)) {
        errors.push({ level: 'error', code: 'INVALID_EDGE_SOURCE', message: `边的源节点不存在：${edge.source}`, edgeId: edge.id })
      }
      // 检查目标节点是否存在
      if (!nodeIds.has(edge.target)) {
        errors.push({ level: 'error', code: 'INVALID_EDGE_TARGET', message: `边的目标节点不存在：${edge.target}`, edgeId: edge.id })
      }
    }
  }
  // 检查起始节点
  if (def.nodes && def.nodes.length > 0) {
    const startNode = findStartNode(def as WorkflowDef)
    if (!startNode) {
      errors.push({ level: 'error', code: 'NO_START_NODE', message: '未找到起始节点' })
    }
  }
  // 检查环（简单检测）
  if (def.nodes && def.edges) {
    if (hasCycle(def.nodes, def.edges)) {
      warnings.push({ level: 'warning', code: 'HAS_CYCLE', message: '工作流中存在环，可能导致无限循环' })
    }
  }
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/** 检测图中是否有环（DFS） */
function hasCycle(nodes: WorkflowNode[], edges: WorkflowEdge[]): boolean {
  const adj = new Map<string, string[]>()
  for (const node of nodes) {
    adj.set(node.id, [])
  }
  for (const edge of edges) {
    if (adj.has(edge.source)) {
      adj.get(edge.source)!.push(edge.target)
    }
  }
  const visited = new Set<string>()
  const recursionStack = new Set<string>()
  const dfs = (nodeId: string): boolean => {
    visited.add(nodeId)
    recursionStack.add(nodeId)
    const neighbors = adj.get(nodeId) || []
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true
      } else if (recursionStack.has(neighbor)) {
        return true
      }
    }
    recursionStack.delete(nodeId)
    return false
  }
  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) return true
    }
  }
  return false
}

/**
 * 导入工作流（从 JSON 字符串）
 */
export function importWorkflow(json: string, overwrite: boolean = false): WorkflowDef {
  let data: any
  try {
    data = JSON.parse(json)
  } catch (err) {
    throw new Error(`JSON 解析失败：${err instanceof Error ? err.message : String(err)}`)
  }
  if (!data || typeof data !== 'object') {
    throw new Error('导入数据格式无效')
  }
  if (!data.name) {
    throw new Error('导入的工作流缺少名称')
  }
  const cache = getWorkflowCache()
  // 如果已存在且不覆盖，则生成新 ID
  if (!overwrite && data.id && cache[data.id]) {
    data.id = generateId('wf')
  } else if (!data.id) {
    data.id = generateId('wf')
  }
  data.createdAt = data.createdAt || now()
  data.updatedAt = now()
  data.version = data.version || '1.0.0'
  data.enabled = data.enabled ?? true
  cache[data.id] = data as WorkflowDef
  persistCache()
  return data as WorkflowDef
}

/**
 * 导出工作流（为 JSON 字符串）
 */
export function exportWorkflow(id: string): string | undefined {
  const workflow = getWorkflow(id)
  if (!workflow) return undefined
  return JSON.stringify(workflow, null, 2)
}

/**
 * 复制工作流
 */
export function duplicateWorkflow(id: string, newName?: string): WorkflowDef | undefined {
  const original = getWorkflow(id)
  if (!original) return undefined
  const copy = JSON.parse(JSON.stringify(original)) as WorkflowDef
  copy.id = generateId('wf')
  copy.name = newName || `${original.name} (副本)`
  copy.createdAt = now()
  copy.updatedAt = now()
  const cache = getWorkflowCache()
  cache[copy.id] = copy
  persistCache()
  return copy
}

/**
 * 启用 / 禁用工作流
 */
export function setWorkflowEnabled(id: string, enabled: boolean): WorkflowDef | undefined {
  return updateWorkflow(id, { enabled })
}

/**
 * 获取工作流分类列表
 */
export function getWorkflowCategories(): string[] {
  const templates = getWorkflowTemplates()
  const categories = new Set<string>()
  for (const tpl of templates) {
    categories.add(tpl.category)
  }
  return Array.from(categories).sort()
}

/**
 * 清除所有工作流（用于重置）
 */
export function clearAllWorkflows(): void {
  const cache = getWorkflowCache()
  for (const id of Object.keys(cache)) {
    clearExecutionHistory(id)
  }
  workflowCache = {}
  persistCache()
}

/**
 * 获取工作流数量
 */
export function getWorkflowCount(): number {
  return Object.keys(getWorkflowCache()).length
}

/**
 * 获取工作流摘要信息
 */
export function getWorkflowSummary(id: string): {
  workflow: WorkflowDef
  stats: ExecutionStats
  lastExecution?: ExecutionRecord
} | undefined {
  const workflow = getWorkflow(id)
  if (!workflow) return undefined
  const stats = getExecutionStats(id)
  const history = getExecutionHistory(id, 1)
  return {
    workflow,
    stats,
    lastExecution: history[0],
  }
}

/**
 * 批量导入工作流
 */
export function batchImportWorkflows(jsonArray: string, overwrite: boolean = false): WorkflowDef[] {
  let arr: any[]
  try {
    arr = JSON.parse(jsonArray)
  } catch (err) {
    throw new Error(`JSON 解析失败：${err instanceof Error ? err.message : String(err)}`)
  }
  if (!Array.isArray(arr)) {
    throw new Error('导入数据必须是数组格式')
  }
  const results: WorkflowDef[] = []
  for (const item of arr) {
    try {
      const workflow = importWorkflow(JSON.stringify(item), overwrite)
      results.push(workflow)
    } catch (err) {
      // 跳过失败项
      console.warn(`导入工作流失败：${err}`)
    }
  }
  return results
}

/**
 * 批量导出工作流
 */
export function batchExportWorkflows(ids: string[]): string {
  const cache = getWorkflowCache()
  const workflows = ids.map(id => cache[id]).filter(Boolean)
  return JSON.stringify(workflows, null, 2)
}

/** 默认导出：工作流引擎 API */
const WorkflowEngineAPI = {
  // 执行引擎
  executeWorkflow,
  executeNode,
  evaluateCondition,
  findNextNodes,
  findStartNode,
  pauseWorkflow,
  resumeWorkflow,
  cancelWorkflow,
  getActiveContext,
  // 节点执行器
  registerNodeExecutor,
  getNodeExecutor,
  // 变量系统
  resolveVariable,
  deepResolveVariables,
  getVariableType,
  convertType,
  validateVariable,
  buildBuiltinVariables,
  VariableSystem,
  // 条件评估
  evaluateConditionExpression,
  evaluateConditionAST,
  parseConditionExpression,
  // 历史
  getExecutionHistory,
  getExecutionDetail,
  clearExecutionHistory,
  getExecutionStats,
  replayExecution,
  exportExecution,
  // 模板
  getWorkflowTemplates,
  getWorkflowTemplate,
  getWorkflowTemplatesByCategory,
  createWorkflowFromTemplate,
  // 管理 API
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  getWorkflow,
  listWorkflows,
  runWorkflow,
  validateWorkflow,
  importWorkflow,
  exportWorkflow,
  duplicateWorkflow,
  setWorkflowEnabled,
  getWorkflowCategories,
  clearAllWorkflows,
  getWorkflowCount,
  getWorkflowSummary,
  batchImportWorkflows,
  batchExportWorkflows,
}

export default WorkflowEngineAPI