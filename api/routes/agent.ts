import { Router, type Request, type Response } from 'express'
import { WorkflowEngine, type WorkflowProgress } from '../../src/engine/workflowEngine.js'

const router = Router()

interface Task {
  id: string
  command: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  engine: WorkflowEngine | null
  progress: WorkflowProgress[]
  result: unknown
  createdAt: Date
}

const tasks = new Map<string, Task>()

const generateTaskId = (): string => {
  return `task_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
}

router.post('/command', async (req: Request, res: Response): Promise<void> => {
  try {
    const { command } = req.body

    if (!command || typeof command !== 'string') {
      res.status(400).json({
        success: false,
        error: 'INVALID_COMMAND',
        message: 'Command is required and must be a string',
        timestamp: new Date().toISOString()
      })
      return
    }

    const taskId = generateTaskId()
    const engine = new WorkflowEngine({
      autoConfirm: true,
      speedFactor: 1.5,
    })

    const task: Task = {
      id: taskId,
      command,
      status: 'pending',
      engine,
      progress: [],
      result: null,
      createdAt: new Date()
    }

    tasks.set(taskId, task)

    setImmediate(async () => {
      task.status = 'running'
      
      engine.setOnProgress((progress: WorkflowProgress) => {
        task.progress.push(progress)
      })

      try {
        const result = await engine.executeWorkflow(command)
        task.result = result
        task.status = 'completed'
      } catch (error) {
        task.status = 'failed'
        task.result = { error: error instanceof Error ? error.message : 'Unknown error' }
      }
    })

    res.status(202).json({
      success: true,
      data: {
        taskId,
        command,
        status: 'pending',
        createdAt: task.createdAt.toISOString()
      },
      message: 'Task accepted. Stream output via SSE.',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
})

router.get('/stream/:taskId', (req: Request, res: Response): void => {
  const { taskId } = req.params
  const task = tasks.get(taskId)

  if (!task) {
    res.status(404).json({
      success: false,
      error: 'TASK_NOT_FOUND',
      message: `Task ${taskId} not found`,
      timestamp: new Date().toISOString()
    })
    return
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')

  const sendEvent = (event: string, data: unknown) => {
    res.write(`event: ${event}\n`)
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  sendEvent('task_init', {
    taskId: task.id,
    command: task.command,
    status: task.status,
    createdAt: task.createdAt.toISOString()
  })

  for (const progress of task.progress) {
    sendEvent('progress', progress)
  }

  let lastIndex = task.progress.length

  const interval = setInterval(() => {
    const currentTask = tasks.get(taskId)
    if (!currentTask) {
      clearInterval(interval)
      res.end()
      return
    }

    while (lastIndex < currentTask.progress.length) {
      sendEvent('progress', currentTask.progress[lastIndex])
      lastIndex++
    }

    if (currentTask.status === 'completed' || currentTask.status === 'failed') {
      sendEvent(currentTask.status, {
        taskId: currentTask.id,
        status: currentTask.status,
        result: currentTask.result,
        timestamp: new Date().toISOString()
      })
      sendEvent('end', { taskId: currentTask.id })
      clearInterval(interval)
      res.end()
    }
  }, 100)

  req.on('close', () => {
    clearInterval(interval)
  })
})

export default router
