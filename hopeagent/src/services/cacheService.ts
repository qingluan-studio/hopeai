/**
 * HopeAgent 前端缓存服务
 * 分级缓存：内存(LRU) + localStorage + 后端缓存，支持 TTL、命名空间、缓存预热
 */

// ============ 类型定义 ============
export interface CacheStats {
  hits: number
  misses: number
  hitRate: number
  size: number
  memorySize: number
  localStorageSize: number
}

export interface CacheOptions {
  /** 过期时间（毫秒），默认 5 分钟 */
  ttl?: number
  /** 缓存命名空间 */
  namespace?: CacheNamespace
  /** 是否持久化到 localStorage */
  persistent?: boolean
}

export type CacheNamespace = 'chat' | 'search' | 'settings' | 'knowledge' | 'agent' | 'common'

interface CacheEntry<T = any> {
  value: T
  expireAt: number
  createdAt: number
}

// ============ LRU 双向链表实现 ============
interface LRUNode<K, V> {
  key: K
  value: V
  prev: LRUNode<K, V> | null
  next: LRUNode<K, V> | null
}

class LRUCache<K, V> {
  private capacity: number
  private map: Map<K, LRUNode<K, V>>
  private head: LRUNode<K, V> | null
  private tail: LRUNode<K, V> | null
  private count: number

  constructor(capacity = 500) {
    this.capacity = capacity
    this.map = new Map()
    this.head = null
    this.tail = null
    this.count = 0
  }

  get(key: K): V | undefined {
    const node = this.map.get(key)
    if (!node) return undefined
    this.moveToHead(node)
    return node.value
  }

  set(key: K, value: V): void {
    const existing = this.map.get(key)
    if (existing) {
      existing.value = value
      this.moveToHead(existing)
      return
    }

    const node: LRUNode<K, V> = { key, value, prev: null, next: null }
    this.map.set(key, node)
    this.addToHead(node)
    this.count++

    if (this.count > this.capacity) {
      this.removeTail()
    }
  }

  delete(key: K): boolean {
    const node = this.map.get(key)
    if (!node) return false
    this.removeNode(node)
    this.map.delete(key)
    this.count--
    return true
  }

  has(key: K): boolean {
    return this.map.has(key)
  }

  clear(): void {
    this.map.clear()
    this.head = null
    this.tail = null
    this.count = 0
  }

  keys(): K[] {
    const keys: K[] = []
    let node = this.head
    while (node) {
      keys.push(node.key)
      node = node.next
    }
    return keys
  }

  size(): number {
    return this.count
  }

  private addToHead(node: LRUNode<K, V>): void {
    node.prev = null
    node.next = this.head
    if (this.head) {
      this.head.prev = node
    }
    this.head = node
    if (!this.tail) {
      this.tail = node
    }
  }

  private removeNode(node: LRUNode<K, V>): void {
    if (node.prev) {
      node.prev.next = node.next
    } else {
      this.head = node.next
    }
    if (node.next) {
      node.next.prev = node.prev
    } else {
      this.tail = node.prev
    }
  }

  private moveToHead(node: LRUNode<K, V>): void {
    this.removeNode(node)
    this.addToHead(node)
  }

  private removeTail(): void {
    if (!this.tail) return
    const key = this.tail.key
    this.removeNode(this.tail)
    this.map.delete(key)
    this.count--
  }
}

// ============ 缓存服务实现 ============
const LOCAL_STORAGE_PREFIX = 'hopeagent:cache:'
const DEFAULT_TTL = 5 * 60 * 1000 // 5 分钟
const MAX_MEMORY_ENTRIES = 500
const MAX_LOCAL_STORAGE_SIZE = 5 * 1024 * 1024 // 5MB

class CacheService {
  private memoryCache: LRUCache<string, CacheEntry>
  private hits = 0
  private misses = 0
  private cleanupTimer: ReturnType<typeof setInterval> | null = null

  constructor() {
    this.memoryCache = new LRUCache<string, CacheEntry>(MAX_MEMORY_ENTRIES)
    this.startCleanupTimer()
  }

  // ============ 核心方法 ============

  /**
   * 获取缓存值
   * 按优先级：内存 → localStorage
   */
  get<T = any>(key: string, namespace: CacheNamespace = 'common'): T | null {
    const fullKey = this.makeKey(key, namespace)

    // 1. 内存缓存
    const memEntry = this.memoryCache.get(fullKey)
    if (memEntry) {
      if (this.isExpired(memEntry)) {
        this.memoryCache.delete(fullKey)
      } else {
        this.hits++
        return memEntry.value as T
      }
    }

    // 2. localStorage
    const lsEntry = this.getFromLocalStorage<T>(fullKey)
    if (lsEntry) {
      if (this.isExpired(lsEntry)) {
        this.deleteFromLocalStorage(fullKey)
      } else {
        this.hits++
        // 回填到内存缓存
        this.memoryCache.set(fullKey, lsEntry)
        return lsEntry.value as T
      }
    }

    this.misses++
    return null
  }

  /**
   * 设置缓存值
   * 同时写入内存和 localStorage（如果启用持久化）
   */
  set<T = any>(
    key: string,
    value: T,
    options: CacheOptions = {}
  ): void {
    const { ttl = DEFAULT_TTL, namespace = 'common', persistent = true } = options
    const fullKey = this.makeKey(key, namespace)

    const entry: CacheEntry<T> = {
      value,
      expireAt: Date.now() + ttl,
      createdAt: Date.now(),
    }

    // 写入内存
    this.memoryCache.set(fullKey, entry as CacheEntry)

    // 写入 localStorage
    if (persistent) {
      this.setToLocalStorage(fullKey, entry)
    }
  }

  /**
   * 删除缓存
   */
  del(key: string, namespace: CacheNamespace = 'common'): boolean {
    const fullKey = this.makeKey(key, namespace)
    const memDeleted = this.memoryCache.delete(fullKey)
    const lsDeleted = this.deleteFromLocalStorage(fullKey)
    return memDeleted || lsDeleted
  }

  /**
   * 清空缓存
   * 支持模式匹配（前缀匹配）
   */
  clear(pattern?: string, namespace: CacheNamespace = 'common'): number {
    let count = 0
    const prefix = pattern
      ? this.makeKey(pattern, namespace)
      : this.makeKey('', namespace)

    // 清理内存
    const memKeys = this.memoryCache.keys()
    for (const key of memKeys) {
      if (key.startsWith(prefix)) {
        this.memoryCache.delete(key)
        count++
      }
    }

    // 清理 localStorage
    try {
      const lsKeys: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)
        if (k && k.startsWith(LOCAL_STORAGE_PREFIX + prefix)) {
          lsKeys.push(k)
        }
      }
      for (const k of lsKeys) {
        localStorage.removeItem(k)
        count++
      }
    } catch {}

    return count
  }

  /**
   * 检查缓存是否存在且未过期
   */
  has(key: string, namespace: CacheNamespace = 'common'): boolean {
    return this.get(key, namespace) !== null
  }

  // ============ 高阶函数 ============

  /**
   * 带缓存的函数包装
   * 有缓存直接返回，无缓存则调用函数并缓存结果
   */
  async withCache<T>(
    key: string,
    fn: () => Promise<T> | T,
    options: CacheOptions = {}
  ): Promise<T> {
    const { namespace = 'common' } = options
    const cached = this.get<T>(key, namespace)
    if (cached !== null) {
      return cached
    }

    const result = await fn()
    this.set(key, result, options)
    return result
  }

  // ============ 缓存预热 ============

  /**
   * 预热缓存，批量加载 keys
   */
  warmup(keys: string[], namespace: CacheNamespace = 'common'): number {
    let loaded = 0
    for (const key of keys) {
      const fullKey = this.makeKey(key, namespace)
      const entry = this.getFromLocalStorage(fullKey)
      if (entry && !this.isExpired(entry)) {
        this.memoryCache.set(fullKey, entry)
        loaded++
      }
    }
    return loaded
  }

  // ============ 统计 ============

  /**
   * 获取缓存统计
   */
  stats(): CacheStats {
    const total = this.hits + this.misses
    return {
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? this.hits / total : 0,
      size: this.memoryCache.size(),
      memorySize: this.memoryCache.size(),
      localStorageSize: this.getLocalStorageCacheCount(),
    }
  }

  /**
   * 重置统计数据
   */
  resetStats(): void {
    this.hits = 0
    this.misses = 0
  }

  // ============ 私有方法 ============

  private makeKey(key: string, namespace: CacheNamespace): string {
    return `${namespace}:${key}`
  }

  private isExpired(entry: CacheEntry): boolean {
    return entry.expireAt > 0 && Date.now() > entry.expireAt
  }

  private getFromLocalStorage<T>(fullKey: string): CacheEntry<T> | null {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_PREFIX + fullKey)
      if (!raw) return null
      return JSON.parse(raw) as CacheEntry<T>
    } catch {
      return null
    }
  }

  private setToLocalStorage(fullKey: string, entry: CacheEntry): void {
    try {
      const raw = JSON.stringify(entry)
      // 简单的容量检查
      if (this.estimateLocalStorageSize() + raw.length > MAX_LOCAL_STORAGE_SIZE) {
        this.evictLocalStorage()
      }
      localStorage.setItem(LOCAL_STORAGE_PREFIX + fullKey, raw)
    } catch {
      // 存储失败时忽略（如隐私模式等）
    }
  }

  private deleteFromLocalStorage(fullKey: string): boolean {
    try {
      localStorage.removeItem(LOCAL_STORAGE_PREFIX + fullKey)
      return true
    } catch {
      return false
    }
  }

  private getLocalStorageCacheCount(): number {
    try {
      let count = 0
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(LOCAL_STORAGE_PREFIX)) {
          count++
        }
      }
      return count
    } catch {
      return 0
    }
  }

  private estimateLocalStorageSize(): number {
    try {
      let size = 0
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(LOCAL_STORAGE_PREFIX)) {
          const value = localStorage.getItem(key)
          size += key.length + (value?.length || 0)
        }
      }
      return size
    } catch {
      return 0
    }
  }

  /**
   * 淘汰最旧的 localStorage 缓存（按过期时间或创建时间）
   */
  private evictLocalStorage(): void {
    try {
      const entries: { key: string; entry: CacheEntry }[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(LOCAL_STORAGE_PREFIX)) {
          try {
            const raw = localStorage.getItem(key)
            if (raw) {
              const entry = JSON.parse(raw) as CacheEntry
              entries.push({ key, entry })
            }
          } catch {}
        }
      }

      // 按过期时间排序，先淘汰已过期的，再淘汰最旧的
      entries.sort((a, b) => {
        const aExpired = this.isExpired(a.entry)
        const bExpired = this.isExpired(b.entry)
        if (aExpired && !bExpired) return -1
        if (!aExpired && bExpired) return 1
        return a.entry.createdAt - b.entry.createdAt
      })

      // 淘汰 20%
      const toRemove = Math.max(1, Math.floor(entries.length * 0.2))
      for (let i = 0; i < toRemove; i++) {
        localStorage.removeItem(entries[i].key)
      }
    } catch {}
  }

  /**
   * 启动定时清理
   */
  private startCleanupTimer(): void {
    // 每分钟清理一次过期缓存
    this.cleanupTimer = setInterval(() => {
      this.cleanupExpired()
    }, 60 * 1000)
  }

  /**
   * 清理过期缓存
   */
  private cleanupExpired(): void {
    // 清理内存（LRU 会自动淘汰，但过期的需要主动清理）
    const memKeys = this.memoryCache.keys()
    for (const key of memKeys) {
      const entry = this.memoryCache.get(key)
      if (entry && this.isExpired(entry)) {
        this.memoryCache.delete(key)
      }
    }

    // 清理 localStorage
    try {
      const toRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(LOCAL_STORAGE_PREFIX)) {
          try {
            const raw = localStorage.getItem(key)
            if (raw) {
              const entry = JSON.parse(raw) as CacheEntry
              if (this.isExpired(entry)) {
                toRemove.push(key)
              }
            }
          } catch {
            toRemove.push(key) // 解析失败直接删除
          }
        }
      }
      for (const k of toRemove) {
        localStorage.removeItem(k)
      }
    } catch {}
  }

  /**
   * 停止清理定时器（页面卸载时调用）
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
      this.cleanupTimer = null
    }
  }
}

// ============ 单例导出 ============
export const cache = new CacheService()

// 便捷方法：直接使用默认命名空间
export const cacheService = cache

// 命名空间快捷对象
export const chatCache = {
  get: <T = any>(key: string) => cache.get<T>(key, 'chat'),
  set: <T = any>(key: string, value: T, ttl?: number) =>
    cache.set(key, value, { namespace: 'chat', ttl }),
  del: (key: string) => cache.del(key, 'chat'),
  has: (key: string) => cache.has(key, 'chat'),
  withCache: <T = any>(key: string, fn: () => Promise<T> | T, ttl?: number) =>
    cache.withCache(key, fn, { namespace: 'chat', ttl }),
}

export const searchCache = {
  get: <T = any>(key: string) => cache.get<T>(key, 'search'),
  set: <T = any>(key: string, value: T, ttl?: number) =>
    cache.set(key, value, { namespace: 'search', ttl }),
  del: (key: string) => cache.del(key, 'search'),
  has: (key: string) => cache.has(key, 'search'),
  withCache: <T = any>(key: string, fn: () => Promise<T> | T, ttl?: number) =>
    cache.withCache(key, fn, { namespace: 'search', ttl }),
}

export const knowledgeCache = {
  get: <T = any>(key: string) => cache.get<T>(key, 'knowledge'),
  set: <T = any>(key: string, value: T, ttl?: number) =>
    cache.set(key, value, { namespace: 'knowledge', ttl }),
  del: (key: string) => cache.del(key, 'knowledge'),
  has: (key: string) => cache.has(key, 'knowledge'),
  withCache: <T = any>(key: string, fn: () => Promise<T> | T, ttl?: number) =>
    cache.withCache(key, fn, { namespace: 'knowledge', ttl }),
}

// 导出类型和常量
export { DEFAULT_TTL, MAX_MEMORY_ENTRIES }
