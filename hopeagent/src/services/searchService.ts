export interface SearchConfig {
  provider: 'serpapi' | 'tavily' | 'duckduckgo' | 'none'
  apiKey: string
  serpApiKey?: string
  tavilyApiKey?: string
}

export interface SearchResult {
  title: string
  url: string
  snippet: string
  source?: string
}

export function getSearchConfig(): SearchConfig {
  try {
    const stored = localStorage.getItem('hopeagent-search-config')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {}
  return { provider: 'none', apiKey: '' }
}

export function saveSearchConfig(config: SearchConfig) {
  try {
    localStorage.setItem('hopeagent-search-config', JSON.stringify(config))
  } catch {}
}

export function isSearchEnabled(): boolean {
  const config = getSearchConfig()
  return config.provider !== 'none' && config.apiKey.length > 0
}

export async function webSearch(query: string, numResults: number = 5): Promise<SearchResult[]> {
  const config = getSearchConfig()
  
  if (config.provider === 'none' || !config.apiKey) {
    return mockSearchResults(query, numResults)
  }

  try {
    switch (config.provider) {
      case 'serpapi':
        return await serpApiSearch(query, config.apiKey, numResults)
      case 'tavily':
        return await tavilySearch(query, config.apiKey, numResults)
      case 'duckduckgo':
        return await duckDuckGoSearch(query, numResults)
      default:
        return mockSearchResults(query, numResults)
    }
  } catch (err) {
    console.error('Search failed:', err)
    return mockSearchResults(query, numResults)
  }
}

async function serpApiSearch(query: string, apiKey: string, num: number): Promise<SearchResult[]> {
  const url = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&api_key=${apiKey}&num=${num}&hl=zh-cn`
  
  const response = await fetch(url)
  const data = await response.json()
  
  if (data.error) {
    throw new Error(data.error)
  }

  return (data.organic_results || []).slice(0, num).map((r: any) => ({
    title: r.title || '',
    url: r.link || '',
    snippet: r.snippet || '',
    source: 'Google'
  }))
}

async function tavilySearch(query: string, apiKey: string, num: number): Promise<SearchResult[]> {
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      query,
      search_depth: 'basic',
      max_results: num,
      include_answer: false,
      include_images: false,
    }),
  })

  if (!response.ok) {
    throw new Error(`Tavily API error: ${response.status}`)
  }

  const data = await response.json()
  return (data.results || []).slice(0, num).map((r: any) => ({
    title: r.title || '',
    url: r.url || '',
    snippet: r.content || '',
    source: 'Tavily'
  }))
}

async function duckDuckGoSearch(query: string, num: number): Promise<SearchResult[]> {
  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
    const response = await fetch(url)
    const data = await response.json()

    const results: SearchResult[] = []
    
    if (data.AbstractText) {
      results.push({
        title: data.Heading || query,
        url: data.AbstractURL || '',
        snippet: data.AbstractText,
        source: 'DuckDuckGo'
      })
    }

    if (data.RelatedTopics) {
      for (const topic of data.RelatedTopics.slice(0, num)) {
        if (topic.Text && topic.FirstURL) {
          results.push({
            title: topic.Text.slice(0, 80),
            url: topic.FirstURL,
            snippet: topic.Text,
            source: 'DuckDuckGo'
          })
        }
      }
    }

    return results.slice(0, num)
  } catch {
    return mockSearchResults(query, num)
  }
}

function mockSearchResults(query: string, num: number): SearchResult[] {
  return [
    {
      title: `${query} - 百度百科`,
      url: `https://baike.baidu.com/item/${encodeURIComponent(query)}`,
      snippet: `关于${query}的详细介绍，包括定义、发展历史、应用场景等内容。${query}是一个重要的概念，在多个领域都有广泛的应用和研究价值。`,
      source: '模拟'
    },
    {
      title: `${query}最新进展与趋势分析`,
      url: '#',
      snippet: `近年来，${query}领域发展迅速，出现了许多新的技术和应用。本文分析了最新的发展趋势，包括技术突破、市场应用、未来展望等方面。`,
      source: '模拟'
    },
    {
      title: `${query}入门到精通完整教程`,
      url: '#',
      snippet: `从零开始学习${query}，包含基础概念、核心原理、实战案例、高级技巧。适合初学者快速入门，也适合进阶开发者深入理解。`,
      source: '模拟'
    },
  ].slice(0, num)
}

export async function newsSearch(query: string, num: number = 5): Promise<SearchResult[]> {
  const config = getSearchConfig()
  
  if (config.provider === 'serpapi' && config.apiKey) {
    try {
      const url = `https://serpapi.com/search.json?engine=google_news&q=${encodeURIComponent(query)}&api_key=${config.apiKey}&num=${num}&hl=zh-cn`
      const response = await fetch(url)
      const data = await response.json()
      
      if (!data.error && data.news_results) {
        return data.news_results.slice(0, num).map((r: any) => ({
          title: r.title || '',
          url: r.link || '',
          snippet: r.snippet || r.date || '',
          source: r.source || 'News'
        }))
      }
    } catch {}
  }

  return mockSearchResults(`${query}新闻`, num)
}

export async function githubSearch(query: string, num: number = 5): Promise<SearchResult[]> {
  try {
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=${num}`
    const response = await fetch(url, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    })
    const data = await response.json()

    if (data.items) {
      return data.items.slice(0, num).map((r: any) => ({
        title: r.full_name,
        url: r.html_url,
        snippet: `${r.description || '无描述'} ⭐${r.stargazers_count} 🍴${r.forks_count}`,
        source: 'GitHub'
      }))
    }
  } catch {}

  return mockSearchResults(`${query} github`, num)
}

export async function arxivSearch(query: string, num: number = 5): Promise<SearchResult[]> {
  try {
    const url = `http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=0&max_results=${num}&sortBy=relevance&sortOrder=descending`
    const response = await fetch(url)
    const text = await response.text()
    
    const parser = new DOMParser()
    const xml = parser.parseFromString(text, 'text/xml')
    const entries = xml.querySelectorAll('entry')
    
    const results: SearchResult[] = []
    entries.forEach(entry => {
      const title = entry.querySelector('title')?.textContent?.trim() || ''
      const summary = entry.querySelector('summary')?.textContent?.trim() || ''
      const id = entry.querySelector('id')?.textContent || ''
      
      results.push({
        title,
        url: id,
        snippet: summary.slice(0, 300),
        source: 'arXiv'
      })
    })
    
    return results.slice(0, num)
  } catch {}

  return mockSearchResults(`${query} paper`, num)
}
