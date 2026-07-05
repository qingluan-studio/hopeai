/**
 * 开源知识自动导入服务
 * 通过 GitHub API 获取公开开源项目的 README 和代码片段
 * 所有数据均为公开可商用的开源项目
 */

import type { KnowledgeEntry } from '@/types'

// 热门开源项目列表（按技术分类，公开可商用）
const FEATURED_REPOS = [
  // 前端
  { owner: 'facebook', repo: 'react', category: '前端开发', tags: ['react', '前端', 'facebook'] },
  { owner: 'vuejs', repo: 'vue', category: '前端开发', tags: ['vue', '前端', '渐进式'] },
  { owner: 'vitejs', repo: 'vite', category: '前端开发', tags: ['vite', '构建工具', 'esbuild'] },
  { owner: 'tailwindlabs', repo: 'tailwindcss', category: '前端开发', tags: ['tailwindcss', 'css', '原子化'] },
  { owner: 'pmndrs', repo: 'zustand', category: '前端开发', tags: ['zustand', '状态管理', 'react'] },
  { owner: 'remix-run', repo: 'react-router', category: '前端开发', tags: ['react-router', '路由', 'spa'] },
  { owner: 'framer', repo: 'motion', category: '前端开发', tags: ['framer-motion', '动画', 'react'] },

  // 后端
  { owner: 'tiangolo', repo: 'fastapi', category: '后端开发', tags: ['fastapi', 'python', 'api'] },
  { owner: 'encode', repo: 'starlette', category: '后端开发', tags: ['starlette', 'asgi', 'python'] },
  { owner: 'pydantic', repo: 'pydantic', category: '后端开发', tags: ['pydantic', '数据验证', 'python'] },
  { owner: 'sqlalchemy', repo: 'sqlalchemy', category: '后端开发', tags: ['sqlalchemy', 'orm', 'python'] },
  { owner: 'encode', repo: 'uvicorn', category: '后端开发', tags: ['uvicorn', 'asgi', '服务器'] },

  // AI / 智能体
  { owner: 'langchain-ai', repo: 'langchain', category: 'AI/智能体', tags: ['langchain', 'ai', 'agent'] },
  { owner: 'chroma-core', repo: 'chroma', category: 'AI/智能体', tags: ['chromadb', '向量数据库', 'ai'] },
  { owner: 'microsoft', repo: 'autogen', category: 'AI/智能体', tags: ['autogen', 'multi-agent', 'microsoft'] },
  { owner: 'openai', repo: 'openai-python', category: 'AI/智能体', tags: ['openai', 'api', 'python'] },
  { owner: 'huggingface', repo: 'transformers', category: 'AI/智能体', tags: ['transformers', 'nlp', 'huggingface'] },
  { owner: 'sentence-transformers', repo: 'sentence-transformers', category: 'AI/智能体', tags: ['embedding', '向量化', 'nlp'] },

  // 数据库
  { owner: 'prisma', repo: 'prisma', category: '数据库', tags: ['prisma', 'orm', 'typescript'] },
  { owner: 'redis', repo: 'redis', category: '数据库', tags: ['redis', '缓存', 'nosql'] },
  { owner: 'postgres', repo: 'postgres', category: '数据库', tags: ['postgresql', '数据库', 'sql'] },

  // DevOps
  { owner: 'nginx', repo: 'nginx', category: 'DevOps', tags: ['nginx', '反向代理', '负载均衡'] },
  { owner: 'docker', repo: 'compose', category: 'DevOps', tags: ['docker', 'compose', '容器'] },
  { owner: 'actions', repo: 'actions', category: 'DevOps', tags: ['github-actions', 'ci-cd', '自动化'] },

  // 工具
  { owner: 'microsoft', repo: 'TypeScript', category: '编程语言', tags: ['typescript', '类型系统', 'microsoft'] },
  { owner: 'microsoft', repo: 'vscode', category: '工具', tags: ['vscode', '编辑器', 'ide'] },
  { owner: 'electron', repo: 'electron', category: '工具', tags: ['electron', '桌面应用', '跨平台'] },

  // === 董事长自有开源项目 ===
  { owner: 'qingluan-studio', repo: 'hopeai', category: '项目规划', tags: ['hopeai', '希望AI', 'AI助手', '董事长项目'] },
  { owner: 'qingluan-studio', repo: 'hopeai-v20', category: '项目规划', tags: ['hopeai-v20', '希望AI', '极简助手', '董事长项目'] },
  { owner: 'qingluan-studio', repo: 'Mingyuan-Assistant', category: 'AI/智能体', tags: ['mingyuan', '助手', 'AI', '董事长项目'] },
]

const GITHUB_API = 'https://api.github.com'

/**
 * 获取单个仓库的README
 */
async function fetchRepoReadme(owner: string, repo: string): Promise<string | null> {
  try {
    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/readme`, {
      headers: {
        'Accept': 'application/vnd.github.v3.raw',
      },
    })
    if (!res.ok) return null
    const text = await res.text()
    // 限制长度，避免太长
    return text.slice(0, 8000)
  } catch {
    return null
  }
}

/**
 * 获取仓库信息
 */
async function fetchRepoInfo(owner: string, repo: string) {
  try {
    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`)
    if (!res.ok) return null
    const data = await res.json()
    return {
      description: data.description || '',
      stars: data.stargazers_count || 0,
      language: data.language || '',
      topics: data.topics || [],
      license: data.license?.spdx_id || '',
    }
  } catch {
    return null
  }
}

/**
 * 从README中提取代码片段
 */
function extractCodeSnippets(readme: string): { language: string; code: string }[] {
  const snippets: { language: string; code: string }[] = []
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
  let match

  while ((match = codeBlockRegex.exec(readme)) !== null) {
    const language = match[1] || 'text'
    const code = match[2].trim()
    // 只保留有意义的代码片段（10-500行）
    if (code.length > 50 && code.length < 5000) {
      snippets.push({ language, code })
    }
  }

  // 最多保留3个代码片段
  return snippets.slice(0, 3)
}

/**
 * 获取一个开源项目的知识
 */
async function fetchRepoKnowledge(
  repoInfo: { owner: string; repo: string; category: string; tags: string[] }
): Promise<KnowledgeEntry | null> {
  const [readme, info] = await Promise.all([
    fetchRepoReadme(repoInfo.owner, repoInfo.repo),
    fetchRepoInfo(repoInfo.owner, repoInfo.repo),
  ])

  if (!readme) return null

  const snippets = extractCodeSnippets(readme)
  const codeSection = snippets.length > 0
    ? `\n\n### 代码示例\n\n${snippets.map((s, i) => 
      `\`\`\`${s.language}\n${s.code}\n\`\`\``
    ).join('\n\n')}`
    : ''

  const licenseNote = info?.license ? `\n- 许可证: ${info.license}` : ''
  const starsNote = info?.stars ? `\n- Stars: ${info.stars.toLocaleString()}` : ''

  return {
    id: `gh-${repoInfo.owner}-${repoInfo.repo}`,
    title: `${repoInfo.owner}/${repoInfo.repo} - 开源项目文档`,
    content: `## ${repoInfo.owner}/${repoInfo.repo}

${info?.description || ''}

### 项目信息
- 语言: ${info?.language || '未知'}${starsNote}${licenseNote}
- GitHub: https://github.com/${repoInfo.owner}/${repoInfo.repo}

### README 摘要

${readme.slice(0, 3000)}
${codeSection}

---
*来源: GitHub 开源项目 (公开可商用)*`,
    tags: [...repoInfo.tags, '开源', 'github', repoInfo.owner],
    category: repoInfo.category,
    createdAt: Date.now(),
    source: 'GitHub开源导入',
  }
}

/**
 * 批量获取开源项目知识
 * @param onProgress 进度回调
 * @param limit 最多获取几个（默认10个，避免API限频）
 */
export async function fetchOpenSourceKnowledge(
  onProgress?: (current: number, total: number, name: string) => void,
  limit: number = 10
): Promise<KnowledgeEntry[]> {
  // 随机选择 limit 个项目
  const shuffled = [...FEATURED_REPOS].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, limit)

  const results: KnowledgeEntry[] = []

  for (let i = 0; i < selected.length; i++) {
    const repo = selected[i]
    onProgress?.(i + 1, selected.length, `${repo.owner}/${repo.repo}`)

    const entry = await fetchRepoKnowledge(repo)
    if (entry) {
      results.push(entry)
    }

    // 避免API限频，每次请求间隔200ms
    if (i < selected.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }

  return results
}

/**
 * 获取更多代码片段（从热门代码文件）
 */
export async function fetchCodeSnippets(
  language: string = 'python',
  onProgress?: (current: number, total: number) => void
): Promise<KnowledgeEntry[]> {
  // 搜索热门代码文件
  const repos = FEATURED_REPOS.filter(r => {
    if (language === 'python') return r.tags.includes('python') || r.tags.includes('fastapi')
    if (language === 'typescript' || language === 'react') return r.tags.includes('react') || r.tags.includes('typescript')
    return true
  }).slice(0, 5)

  const results: KnowledgeEntry[] = []

  for (let i = 0; i < repos.length; i++) {
    onProgress?.(i + 1, repos.length)
    const entry = await fetchRepoKnowledge(repos[i])
    if (entry) {
      entry.id = `code-${repos[i].owner}-${repos[i].repo}-${Date.now()}`
      entry.title = `[代码片段] ${repos[i].owner}/${repos[i].repo}`
      entry.category = '代码示例'
      results.push(entry)
    }
    await new Promise(resolve => setTimeout(resolve, 200))
  }

  return results
}

/**
 * 导入董事长自有开源项目
 * 从 qingluan-studio 的所有公开仓库获取知识
 */
export async function fetchMyProjects(
  onProgress?: (current: number, total: number, name: string) => void
): Promise<KnowledgeEntry[]> {
  // 董事长的GitHub账号
  const MY_GITHUB = 'qingluan-studio'
  const results: KnowledgeEntry[] = []

  // 先获取所有公开仓库列表
  let repos: string[] = []
  try {
    const res = await fetch(`${GITHUB_API}/users/${MY_GITHUB}/repos?per_page=50&sort=updated&type=public`)
    if (res.ok) {
      const data = await res.json()
      repos = data
        .filter((r: { name: string; fork: boolean }) => !r.fork)
        .map((r: { name: string }) => r.name)
    }
  } catch {
    // 如果API失败，用预设列表
    repos = ['hopeai', 'hopeai-v20', 'Mingyuan-Assistant']
  }

  if (repos.length === 0) {
    repos = ['hopeai', 'hopeai-v20', 'Mingyuan-Assistant']
  }

  for (let i = 0; i < repos.length; i++) {
    const repoName = repos[i]
    onProgress?.(i + 1, repos.length, `${MY_GITHUB}/${repoName}`)

    const entry = await fetchRepoKnowledge({
      owner: MY_GITHUB,
      repo: repoName,
      category: '董事长项目',
      tags: ['自有项目', '董事长', MY_GITHUB, repoName],
    })

    if (entry) {
      entry.id = `my-${MY_GITHUB}-${repoName}-${Date.now()}`
      entry.title = `[董事长项目] ${repoName}`
      entry.source = '董事长GitHub仓库'
      results.push(entry)
    }

    if (i < repos.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }

  return results
}
