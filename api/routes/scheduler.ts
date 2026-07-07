import { Router } from 'express'

const router = Router()

interface ScheduledTask {
  id: string
  name: string
  agentId: string
  cron: string
  params: Record<string, unknown>
  status: 'active' | 'paused' | 'completed' | 'failed'
  lastRun: string | null
  nextRun: string | null
  createdAt: string
  updatedAt: string
}

let tasks: ScheduledTask[] = []

router.get('/tasks', (req, res) => {
  res.json({ success: true, data: tasks })
})

router.post('/tasks', (req, res) => {
  const { name, agentId, cron, params } = req.body
  
  if (!name || !agentId || !cron) {
    return res.status(400).json({ success: false, error: '缺少必要参数' })
  }
  
  const newTask: ScheduledTask = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 9),
    name,
    agentId,
    cron,
    params: params || {},
    status: 'active',
    lastRun: null,
    nextRun: calculateNextRun(cron),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  tasks.push(newTask)
  res.json({ success: true, data: newTask })
})

router.get('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id)
  if (!task) {
    return res.status(404).json({ success: false, error: '任务不存在' })
  }
  res.json({ success: true, data: task })
})

router.put('/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === req.params.id)
  if (index === -1) {
    return res.status(404).json({ success: false, error: '任务不存在' })
  }
  
  const updates = req.body
  tasks[index] = { 
    ...tasks[index], 
    ...updates, 
    updatedAt: new Date().toISOString(),
    nextRun: updates.cron ? calculateNextRun(updates.cron) : tasks[index].nextRun
  }
  
  res.json({ success: true, data: tasks[index] })
})

router.delete('/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === req.params.id)
  if (index === -1) {
    return res.status(404).json({ success: false, error: '任务不存在' })
  }
  
  const deleted = tasks.splice(index, 1)[0]
  res.json({ success: true, data: deleted })
})

router.post('/tasks/:id/run', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id)
  if (!task) {
    return res.status(404).json({ success: false, error: '任务不存在' })
  }
  
  task.lastRun = new Date().toISOString()
  task.nextRun = calculateNextRun(task.cron)
  
  res.json({ success: true, data: { message: '任务已触发', task } })
})

router.post('/tasks/:id/toggle', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id)
  if (!task) {
    return res.status(404).json({ success: false, error: '任务不存在' })
  }
  
  task.status = task.status === 'active' ? 'paused' : 'active'
  task.updatedAt = new Date().toISOString()
  
  res.json({ success: true, data: task })
})

function calculateNextRun(cron: string): string | null {
  const now = new Date()
  const next = new Date(now.getTime() + 60000)
  return next.toISOString()
}

export default router
