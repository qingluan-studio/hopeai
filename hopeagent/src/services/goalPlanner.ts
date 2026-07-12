// 目标规划器 — 任务拆分 DAG + 子目标编排
// 参考 CEE 的 agent/task_decomposer.py 和 orchestrator.py

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped'
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dependencies: string[]
  estimatedDuration?: string
  result?: string
  error?: string
  createdAt: number
  updatedAt: number
  progress?: number
  metadata?: Record<string, any>
}

export interface GoalPlan {
  goal: string
  tasks: Task[]
  phases: { name: string; description: string; taskIds: string[] }[]
  totalEstimate?: string
  created: number
}

const STORAGE_KEY = 'hopeagent-goal-plans'

class GoalPlanner {
  private plans: GoalPlan[] = []

  constructor() {
    this.load()
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) this.plans = JSON.parse(raw)
    } catch {}
  }

  private save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.plans.slice(-20)))
    } catch {}
  }

  decomposeGoal(goal: string, context: Record<string, any> = {}): GoalPlan {
    const tasks: Task[] = []
    const phases: { name: string; description: string; taskIds: string[] }[] = []
    const now = Date.now()

    const goalLower = goal.toLowerCase()

    let phaseList: { name: string; desc: string; tasks: { title: string; desc: string }[] }[]

    if (goalLower.includes('项目') || goalLower.includes('开发') || goalLower.includes('构建') || goalLower.includes('代码')) {
      phaseList = [
        {
          name: '需求分析',
          desc: '理解目标，明确范围和约束',
          tasks: [
            { title: '明确目标和范围', desc: '确定项目的核心目标、功能范围和边界' },
            { title: '技术选型', desc: '选择合适的技术栈和框架' },
            { title: '架构设计', desc: '设计整体架构和模块划分' },
          ],
        },
        {
          name: '基础设施',
          desc: '搭建项目骨架和基础环境',
          tasks: [
            { title: '初始化项目', desc: '创建项目目录结构和配置文件' },
            { title: '配置开发环境', desc: '安装依赖，配置构建工具和开发服务器' },
            { title: '搭建基础框架', desc: '搭建路由、状态管理、样式框架等基础' },
          ],
        },
        {
          name: '核心功能',
          desc: '实现主要功能模块',
          tasks: [
            { title: '数据模型设计', desc: '设计数据结构和数据库Schema' },
            { title: '核心逻辑实现', desc: '实现业务逻辑和核心算法' },
            { title: 'UI组件开发', desc: '开发用户界面组件' },
            { title: 'API接口', desc: '实现前后端接口对接' },
          ],
        },
        {
          name: '测试优化',
          desc: '验证和优化',
          tasks: [
            { title: '功能测试', desc: '验证所有功能是否正常工作' },
            { title: 'Bug修复', desc: '修复发现的问题' },
            { title: '性能优化', desc: '优化性能和用户体验' },
            { title: '代码整理', desc: '代码重构和文档补充' },
          ],
        },
        {
          name: '交付部署',
          desc: '上线和交付',
          tasks: [
            { title: '部署准备', desc: '准备部署环境和配置' },
            { title: '上线部署', desc: '将项目部署到生产环境' },
            { title: '交付验收', desc: '最终验证和文档交付' },
          ],
        },
      ]
    } else if (goalLower.includes('学习') || goalLower.includes('研究') || goalLower.includes('掌握')) {
      phaseList = [
        {
          name: '基础认知',
          desc: '建立基础概念框架',
          tasks: [
            { title: '概念梳理', desc: '整理核心概念和术语' },
            { title: '原理理解', desc: '理解底层原理和机制' },
            { title: '架构认知', desc: '了解整体架构和组成部分' },
          ],
        },
        {
          name: '动手实践',
          desc: '通过实践加深理解',
          tasks: [
            { title: '环境搭建', desc: '搭建学习和实验环境' },
            { title: '入门示例', desc: '跟着教程做基础示例' },
            { title: '小项目实践', desc: '做一个小型综合项目' },
          ],
        },
        {
          name: '深入进阶',
          desc: '深入理解和高级应用',
          tasks: [
            { title: '高级特性', desc: '学习高级功能和特性' },
            { title: '最佳实践', desc: '研究最佳实践和设计模式' },
            { title: '性能优化', desc: '学习性能调优和优化技巧' },
          ],
        },
        {
          name: '知识固化',
          desc: '总结和知识沉淀',
          tasks: [
            { title: '知识整理', desc: '整理学习笔记和知识图谱' },
            { title: '输出分享', desc: '写文章或做分享输出' },
            { title: '持续练习', desc: '制定持续学习计划' },
          ],
        },
      ]
    } else {
      phaseList = [
        {
          name: '理解问题',
          desc: '深入理解目标和背景',
          tasks: [
            { title: '明确目标', desc: '搞清楚最终要达成什么' },
            { title: '收集信息', desc: '收集相关信息和资料' },
            { title: '分析约束', desc: '明确限制条件和可用资源' },
          ],
        },
        {
          name: '制定方案',
          desc: '设计解决方案',
          tasks: [
            { title: '头脑风暴', desc: '生成多种可能的方案' },
            { title: '方案评估', desc: '评估各方案的优劣' },
            { title: '确定路线', desc: '选择最佳方案，制定路线图' },
          ],
        },
        {
          name: '执行落地',
          desc: '按计划执行',
          tasks: [
            { title: '第一步', desc: '迈出第一步，快速验证' },
            { title: '核心部分', desc: '完成核心内容' },
            { title: '收尾完善', desc: '补充细节，打磨完善' },
          ],
        },
        {
          name: '回顾总结',
          desc: '复盘和改进',
          tasks: [
            { title: '结果验证', desc: '检查是否达成目标' },
            { title: '经验总结', desc: '总结经验教训' },
            { title: '后续规划', desc: '规划下一步行动' },
          ],
        },
      ]
    }

    let taskIndex = 0
    let prevPhaseLastId = ''

    for (let pi = 0; pi < phaseList.length; pi++) {
      const phase = phaseList[pi]
      const phaseTaskIds: string[] = []

      for (let ti = 0; ti < phase.tasks.length; ti++) {
        const t = phase.tasks[ti]
        const id = `task_${now}_${taskIndex}`
        const deps: string[] = []

        if (ti > 0) {
          deps.push(`task_${now}_${taskIndex - 1}`)
        } else if (pi > 0 && prevPhaseLastId) {
          deps.push(prevPhaseLastId)
        }

        const priority: TaskPriority =
          pi === 0 ? 'high' :
          pi === phaseList.length - 1 ? 'medium' :
          ti === 0 ? 'high' : 'medium'

        tasks.push({
          id,
          title: t.title,
          description: t.desc,
          status: 'pending',
          priority,
          dependencies: deps,
          createdAt: now,
          updatedAt: now,
          progress: 0,
        })

        phaseTaskIds.push(id)
        taskIndex++
        prevPhaseLastId = id
      }

      phases.push({
        name: phase.name,
        description: phase.desc,
        taskIds: phaseTaskIds,
      })
    }

    const plan: GoalPlan = {
      goal,
      tasks,
      phases,
      created: now,
    }

    this.plans.unshift(plan)
    this.save()

    return plan
  }

  updateTaskStatus(planId: number, taskId: string, status: TaskStatus, result?: string, error?: string): void {
    const plan = this.plans[planId]
    if (!plan) return

    const task = plan.tasks.find(t => t.id === taskId)
    if (!task) return

    task.status = status
    task.updatedAt = Date.now()
    if (result) task.result = result
    if (error) task.error = error
    if (status === 'completed') task.progress = 100
    else if (status === 'in_progress') task.progress = 50

    this.save()
  }

  getReadyTasks(planId: number): Task[] {
    const plan = this.plans[planId]
    if (!plan) return []

    return plan.tasks.filter(task => {
      if (task.status !== 'pending') return false
      return task.dependencies.every(depId => {
        const depTask = plan.tasks.find(t => t.id === depId)
        return !depTask || depTask.status === 'completed'
      })
    })
  }

  getProgress(planId: number): {
    total: number
    completed: number
    inProgress: number
    pending: number
    failed: number
    percent: number
  } {
    const plan = this.plans[planId]
    if (!plan) return { total: 0, completed: 0, inProgress: 0, pending: 0, failed: 0, percent: 0 }

    const total = plan.tasks.length
    const completed = plan.tasks.filter(t => t.status === 'completed').length
    const inProgress = plan.tasks.filter(t => t.status === 'in_progress').length
    const pending = plan.tasks.filter(t => t.status === 'pending').length
    const failed = plan.tasks.filter(t => t.status === 'failed').length
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0

    return { total, completed, inProgress, pending, failed, percent }
  }

  getPlans(): GoalPlan[] {
    return [...this.plans]
  }

  getPlan(index: number): GoalPlan | null {
    return this.plans[index] || null
  }

  deletePlan(index: number): void {
    this.plans.splice(index, 1)
    this.save()
  }

  clear(): void {
    this.plans = []
    this.save()
  }
}

export const goalPlanner = new GoalPlanner()
