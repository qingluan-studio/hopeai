import { Router, type Request, type Response } from 'express'

interface DeployConfig {
  githubToken: string
  repoUrl: string
  branch: string
  targetPath: string
}

interface DeployTask {
  id: string
  status: 'pending' | 'running' | 'success' | 'failed'
  progress: number
  logs: { timestamp: string; message: string; level: 'info' | 'success' | 'error' | 'warning' }[]
  config: DeployConfig
  createdAt: string
  startedAt?: string
  finishedAt?: string
}

const router = Router()

let deployConfig: DeployConfig = {
  githubToken: '',
  repoUrl: '',
  branch: 'main',
  targetPath: '/'
}

const deployTasks = new Map<string, DeployTask>()

const generateTaskId = (): string => {
  return `deploy_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`
}

router.get('/config', (req: Request, res: Response): void => {
  try {
    const safeConfig = {
      ...deployConfig,
      githubToken: deployConfig.githubToken ? 'ghp_********' : ''
    }

    res.status(200).json({
      success: true,
      data: safeConfig,
      message: 'Deploy config retrieved successfully',
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

router.post('/config', (req: Request, res: Response): void => {
  try {
    const { githubToken, repoUrl, branch, targetPath } = req.body

    deployConfig = {
      githubToken: githubToken || deployConfig.githubToken,
      repoUrl: repoUrl || deployConfig.repoUrl,
      branch: branch || deployConfig.branch,
      targetPath: targetPath || deployConfig.targetPath
    }

    const safeConfig = {
      ...deployConfig,
      githubToken: deployConfig.githubToken ? 'ghp_********' : ''
    }

    res.status(200).json({
      success: true,
      data: safeConfig,
      message: 'Deploy config saved successfully',
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

router.post('/run', (req: Request, res: Response): void => {
  try {
    const { config: customConfig } = req.body
    const config = customConfig || deployConfig

    if (!config.repoUrl) {
      res.status(400).json({
        success: false,
        error: 'MISSING_REPO_URL',
        message: 'Repository URL is required for deployment',
        timestamp: new Date().toISOString()
      })
      return
    }

    const taskId = generateTaskId()
    const now = new Date().toISOString()

    const task: DeployTask = {
      id: taskId,
      status: 'pending',
      progress: 0,
      logs: [
        { timestamp: now, message: 'Deployment task initialized', level: 'info' },
        { timestamp: now, message: `Target: ${config.repoUrl}@${config.branch}`, level: 'info' }
      ],
      config,
      createdAt: now
    }

    deployTasks.set(taskId, task)

    setImmediate(() => {
      simulateDeployment(taskId)
    })

    res.status(202).json({
      success: true,
      data: {
        taskId,
        status: 'pending',
        createdAt: now
      },
      message: 'Deployment task accepted. Check status for progress.',
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

router.get('/status/:taskId', (req: Request, res: Response): void => {
  try {
    const { taskId } = req.params
    const task = deployTasks.get(taskId)

    if (!task) {
      res.status(404).json({
        success: false,
        error: 'TASK_NOT_FOUND',
        message: `Deploy task ${taskId} not found`,
        timestamp: new Date().toISOString()
      })
      return
    }

    res.status(200).json({
      success: true,
      data: {
        id: task.id,
        status: task.status,
        progress: task.progress,
        logs: task.logs,
        createdAt: task.createdAt,
        startedAt: task.startedAt,
        finishedAt: task.finishedAt
      },
      message: 'Deploy status retrieved successfully',
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

function simulateDeployment(taskId: string): void {
  const task = deployTasks.get(taskId)
  if (!task) return

  task.status = 'running'
  task.startedAt = new Date().toISOString()

  const steps = [
    { message: 'Cloning repository...', progress: 10, delay: 800 },
    { message: 'Checking out branch: ' + task.config.branch, progress: 20, delay: 600 },
    { message: 'Installing dependencies...', progress: 35, delay: 1200 },
    { message: 'Running build script...', progress: 55, delay: 1500 },
    { message: 'Running tests...', progress: 70, delay: 1000 },
    { message: 'Deploying to target server...', progress: 85, delay: 1200 },
    { message: 'Verifying deployment...', progress: 95, delay: 800 },
    { message: 'Deployment complete!', progress: 100, delay: 500 }
  ]

  let stepIndex = 0

  const runStep = () => {
    if (stepIndex >= steps.length) {
      task.status = 'success'
      task.finishedAt = new Date().toISOString()
      task.logs.push({
        timestamp: new Date().toISOString(),
        message: 'Deployment finished successfully',
        level: 'success'
      })
      return
    }

    const step = steps[stepIndex]
    task.progress = step.progress
    task.logs.push({
      timestamp: new Date().toISOString(),
      message: step.message,
      level: stepIndex === steps.length - 1 ? 'success' : 'info'
    })

    stepIndex++
    setTimeout(runStep, step.delay)
  }

  setTimeout(runStep, 500)
}

export default router
