// 临时脚本：用 Kimi $web_search 搜索知识库网站
const KIMI_API_URL = 'https://api.moonshot.cn/v1/chat/completions'
const KIMI_API_KEY = 'sk-NWQEMc5Xt8z4J91JZOHNUnIff26ChPxaFPzgWhkheiiWeSon'

async function searchWithKimi(query) {
  const response = await fetch(KIMI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${KIMI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'kimi-k2.6',
      messages: [
        { role: 'system', content: '你是搜索助手。' },
        { role: 'user', content: query }
      ],
      temperature: 0.6,
      max_tokens: 4096,
      tools: [
        {
          type: 'builtin_function',
          function: { name: '$web_search' }
        }
      ],
      thinking: { type: 'disabled' }
    })
  })

  const data = await response.json()
  const choice = data.choices?.[0]

  // 处理 tool_calls
  if (choice?.message?.tool_calls && choice.finish_reason === 'tool_calls') {
    const toolMessages = [
      { role: 'system', content: '你是搜索助手。' },
      { role: 'user', content: query },
      choice.message
    ]

    for (const toolCall of choice.message.tool_calls) {
      toolMessages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: toolCall.function.arguments
      })
    }

    const followUp = await fetch(KIMI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KIMI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'kimi-k2.6',
        messages: toolMessages,
        temperature: 0.6,
        max_tokens: 4096,
        tools: [{ type: 'builtin_function', function: { name: '$web_search' } }],
        thinking: { type: 'disabled' }
      })
    })

    const followData = await followUp.json()
    return followData.choices?.[0]?.message?.content || ''
  }

  return choice?.message?.content || ''
}

// 搜索知识库网站
const query = `请搜索以下关键词，获取编程知识库内容：
1. "编程知识库 前端开发 React Vue"
2. "后端开发 Node.js Python API设计"
3. "数据库 MySQL PostgreSQL Redis"
4. "DevOps Docker Kubernetes CI/CD"
5. "AI 机器学习 深度学习 LLM RAG"

请搜索并告诉我每个领域最核心的知识点。`

console.log('正在用 Kimi 搜索...')
searchWithKimi(query).then(result => {
  console.log('搜索结果：')
  console.log(result)
}).catch(err => {
  console.error('错误：', err)
})