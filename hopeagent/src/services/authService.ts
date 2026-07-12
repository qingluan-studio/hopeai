/**
 * HopeAgent 认证服务
 * 对接后端 /api/auth/* 接口，管理用户登录态、token 持久化与 401 自动登出
 */

import { getApiBase } from './apiClient'

// ============ 类型定义 ============
export interface User {
  id: string
  username: string
  email?: string
  avatar?: string
  role?: 'admin' | 'user' | 'guest'
  createdAt?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isLoggedIn: boolean
}

export interface LoginResponse {
  token: string
  user: User
}

// ============ 常量 ============
const TOKEN_KEY = 'hopeagent-auth-token'
const USER_KEY = 'hopeagent-auth-user'

/** token 过期事件名，外部可监听做跳转登录页等处理 */
export const AUTH_EXPIRED_EVENT = 'hopeagent:auth-expired'

// ============ 本地存储 ============
export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  } catch {}
}

function setLocalUser(user: User | null): void {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(USER_KEY)
    }
  } catch {}
}

function getLocalUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function isLoggedIn(): boolean {
  return !!getToken()
}

/** 返回带 Authorization 的请求头对象，便于合并到 fetch headers */
export function authHeaders(): Record<string, string> {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ============ 内部请求封装 ============
async function authRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = getApiBase() + path
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(options.headers || {}),
    },
  })

  // 401 触发自动登出
  if (res.status === 401) {
    handleUnauthorized()
    throw new Error('登录已过期，请重新登录')
  }

  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try {
      const err = await res.json()
      msg = err.error || err.message || msg
    } catch {}
    throw new Error(msg)
  }

  // 部分接口（如 logout）可能无返回体
  const text = await res.text()
  if (!text) return undefined as unknown as T
  try {
    return JSON.parse(text)
  } catch {
    return undefined as unknown as T
  }
}

/** 处理 token 过期：清除本地态并派发事件 */
function handleUnauthorized(): void {
  setToken(null)
  setLocalUser(null)
  try {
    window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT))
  } catch {}
}

// ============ 对外接口 ============

/** 登录，成功后写入 token 与用户信息 */
export async function login(username: string, password: string): Promise<LoginResponse> {
  const r = await authRequest<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  setToken(r.token)
  setLocalUser(r.user)
  return r
}

/** 注册 */
export async function register(username: string, password: string, email?: string): Promise<LoginResponse> {
  const r = await authRequest<LoginResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password, email }),
  })
  // 注册成功直接返回 token 时也保存登录态
  if (r?.token) {
    setToken(r.token)
    setLocalUser(r.user)
  }
  return r
}

/** 登出，通知后端失效并清理本地态 */
export async function logout(): Promise<void> {
  try {
    await authRequest('/api/auth/logout', { method: 'POST' })
  } catch {
    // 后端不可用也允许本地登出
  } finally {
    setToken(null)
    setLocalUser(null)
  }
}

/** 获取当前登录用户（优先本地缓存，可强制刷新） */
export async function getCurrentUser(refresh = false): Promise<User | null> {
  if (!isLoggedIn()) return null
  if (!refresh) {
    const local = getLocalUser()
    if (local) return local
  }
  try {
    const r = await authRequest<{ user: User }>('/api/auth/me')
    if (r?.user) {
      setLocalUser(r.user)
      return r.user
    }
  } catch {
    // 失败则回落本地
  }
  return getLocalUser()
}

/** 同步获取当前用户（仅本地缓存） */
export function getCachedUser(): User | null {
  return getLocalUser()
}

/** 派生当前认证状态快照 */
export function getAuthState(): AuthState {
  const token = getToken()
  return {
    token,
    user: getLocalUser(),
    isLoggedIn: !!token,
  }
}

/**
 * 监听 token 过期事件
 * @returns 取消监听函数
 */
export function onAuthExpired(handler: () => void): () => void {
  const listener = () => handler()
  window.addEventListener(AUTH_EXPIRED_EVENT, listener)
  return () => window.removeEventListener(AUTH_EXPIRED_EVENT, listener)
}

/**
 * 检查 token 是否临近过期（简单基于 JWT exp 字段）
 * 返回剩余秒数；无 exp 时返回 Infinity
 */
export function getTokenTTL(): number {
  const token = getToken()
  if (!token) return 0
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload?.exp && typeof payload.exp === 'number') {
      return payload.exp - Math.floor(Date.now() / 1000)
    }
  } catch {}
  return Infinity
}
