import express, { type Request, type Response, Router } from 'express'
import dotenv from 'dotenv'

dotenv.config()

const router = Router()

const PROVIDERS: Record<string, { baseUrl: string; apiKey: string; defaultModel: string }> = {
  deepseek: {
    baseUrl: 'https://api.deepseek.com/v1',
    apiKey: process.env.DEEPSEEK_API_KEY || '',
    defaultModel: 'deepseek-chat',
  },
  kimi: {
    baseUrl: 'https://api.moonshot.cn/v1',
    apiKey: process.env.KIMI_API_KEY || '',
    defaultModel: 'moonshot-v1-8k',
  },
  groq: {
    baseUrl: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY || '',
    defaultModel: 'llama-3.1-8b-instant',
  },
  gemini: {
    baseUrl: 'https://generativelanguage.googleapis.com/v1',
    apiKey: process.env.GEMINI_API_KEY || '',
    defaultModel: 'gemini-pro',
  },
}

function getProviderConfig(provider: string) {
  if (!PROVIDERS[provider]) {
    throw new Error(`不支持的提供商: ${provider}`)
  }
  return PROVIDERS[provider]
}

async function proxyRequest(provider: string, model: string, messages: any[], options: any = {}) {
  const config = getProviderConfig(provider)
  
  if (!config.apiKey) {
    throw new Error(`${provider} API Key 未配置`)
  }

  let url: string
  let headers: Record<string, string>
  let body: any

  switch (provider) {
    case 'deepseek':
    case 'kimi':
      url = `${config.baseUrl}/chat/completions`
      headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      }
      body = {
        model: model || config.defaultModel,
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 2000,
        ...options,
      }
      break

    case 'groq':
      url = `${config.baseUrl}/chat/completions`
      headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      }
      body = {
        model: model || config.defaultModel,
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 2000,
        stream: options.stream || false,
        ...options,
      }
      break

    case 'gemini':
      url = `${config.baseUrl}/models/${model || config.defaultModel}:generateContent?key=${config.apiKey}`
      headers = { 'Content-Type': 'application/json' }
      body = {
        contents: messages.map((msg: any) => ({
          role: msg.role,
          parts: [{ text: msg.content }],
        })),
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.max_tokens || 2000,
        },
      }
      break

    default:
      throw new Error(`不支持的提供商: ${provider}`)
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(`${provider} 请求失败 (${res.status}): ${errText.slice(0, 200)}`)
  }

  return res.json()
}

router.post('/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { provider = 'deepseek', model, messages, options = {} } = req.body

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ success: false, error: '缺少 messages 参数' })
      return
    }

    const result = await proxyRequest(provider, model, messages, options)
    res.status(200).json({
      success: true,
      provider,
      data: result,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : '未知错误',
    })
  }
})

router.post('/chat/stream', async (req: Request, res: Response): Promise<void> => {
  try {
    const { provider = 'deepseek', model, messages, options = {} } = req.body

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ success: false, error: '缺少 messages 参数' })
      return
    }

    const config = getProviderConfig(provider)
    
    if (!config.apiKey) {
      res.status(500).json({ success: false, error: `${provider} API Key 未配置` })
      return
    }

    let url: string
    let headers: Record<string, string>
    let body: any

    switch (provider) {
      case 'deepseek':
      case 'kimi':
        url = `${config.baseUrl}/chat/completions`
        headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
        }
        body = {
          model: model || config.defaultModel,
          messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.max_tokens || 2000,
          stream: true,
          ...options,
        }
        break

      case 'groq':
        url = `${config.baseUrl}/chat/completions`
        headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
        }
        body = {
          model: model || config.defaultModel,
          messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.max_tokens || 2000,
          stream: true,
          ...options,
        }
        break

      default:
        res.status(400).json({ success: false, error: `${provider} 不支持流式输出` })
        return
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errText = await response.text().catch(() => '')
      res.status(response.status).json({ success: false, error: errText })
      return
    }

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const reader = response.body?.getReader()
    if (!reader) {
      res.status(500).json({ success: false, error: '无法读取响应流' })
      return
    }

    const decoder = new TextDecoder('utf-8')
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      res.write(chunk)
    }

    res.end()
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : '未知错误',
    })
  }
})

router.get('/providers', (req: Request, res: Response): void => {
  const providers = Object.entries(PROVIDERS).map(([key, config]) => ({
    id: key,
    name: key.charAt(0).toUpperCase() + key.slice(1),
    hasApiKey: !!config.apiKey,
    defaultModel: config.defaultModel,
  }))
  
  res.status(200).json({
    success: true,
    providers,
  })
})

router.post('/test', async (req: Request, res: Response): Promise<void> => {
  try {
    const { provider } = req.body

    const config = getProviderConfig(provider)
    
    if (!config.apiKey) {
      res.status(400).json({ success: false, error: `${provider} API Key 未配置` })
      return
    }

    await proxyRequest(provider, config.defaultModel, [{ role: 'user', content: '你好，请回复"OK"' }])
    
    res.status(200).json({
      success: true,
      message: `${provider} 连接成功`,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : '未知错误',
    })
  }
})

export default router