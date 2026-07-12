/**
 * HopeAgent 通知服务
 * 基于 Zustand 的前端通知系统，支持队列管理、自动消失、手动关闭与历史记录
 */

import { useEffect } from 'react'
import { create } from 'zustand'

// ============ 类型定义 ============
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  /** 自动消失时长（毫秒），0 表示不自动消失 */
  duration: number
  createdAt: string
}

export interface NotificationOptions {
  duration?: number
  /** 是否记入历史（默认 true） */
  recordHistory?: boolean
}

// ============ 常量 ============
const MAX_VISIBLE = 5
const MAX_HISTORY = 50
const DEFAULT_DURATION: Record<NotificationType, number> = {
  success: 3000,
  info: 3000,
  warning: 4000,
  error: 5000,
}

// ============ Store ============
interface NotificationState {
  /** 当前可见的通知队列 */
  visible: Notification[]
  /** 历史记录（最近 MAX_HISTORY 条） */
  history: Notification[]
  /** 定时器引用 */
  timers: Record<string, ReturnType<typeof setTimeout>>

  push: (n: Notification) => void
  dismiss: (id: string) => void
  clear: () => void
  clearHistory: () => void
}

const useNotificationStore = create<NotificationState>((set, get) => ({
  visible: [],
  history: [],
  timers: {},

  push: (n) => {
    // 加入历史
    set((s) => ({
      history: [n, ...s.history].slice(0, MAX_HISTORY),
    }))

    // 加入可见队列，超过上限则移除最早的
    set((s) => {
      let visible = [...s.visible, n]
      // 移除最早的（数组头部），并清理其定时器
      while (visible.length > MAX_VISIBLE) {
        const removed = visible.shift()
        if (removed && s.timers[removed.id]) {
          clearTimeout(s.timers[removed.id])
        }
      }
      return { visible }
    })

    // 设置自动消失
    if (n.duration > 0) {
      const timer = setTimeout(() => {
        get().dismiss(n.id)
      }, n.duration)
      set((s) => ({ timers: { ...s.timers, [n.id]: timer } }))
    }
  },

  dismiss: (id) => {
    set((s) => {
      const timer = s.timers[id]
      if (timer) clearTimeout(timer)
      const { [id]: _, ...rest } = s.timers
      return {
        visible: s.visible.filter(n => n.id !== id),
        timers: rest,
      }
    })
  },

  clear: () => {
    set((s) => {
      Object.values(s.timers).forEach(t => clearTimeout(t))
      return { visible: [], timers: {} }
    })
  },

  clearHistory: () => set({ history: [] }),
}))

// ============ 对外 API ============

function genId(): string {
  return 'n_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6)
}

/** 显示一条通知 */
export function notify(
  title: string,
  message: string | undefined,
  type: NotificationType = 'info',
  options: NotificationOptions = {}
): string {
  const duration = options.duration ?? DEFAULT_DURATION[type]
  const n: Notification = {
    id: genId(),
    type,
    title,
    message,
    duration,
    createdAt: new Date().toISOString(),
  }
  useNotificationStore.getState().push(n)
  return n.id
}

/** 成功通知 */
export function success(title: string, message?: string, options?: NotificationOptions): string {
  return notify(title, message, 'success', options)
}

/** 错误通知 */
export function error(title: string, message?: string, options?: NotificationOptions): string {
  return notify(title, message, 'error', options)
}

/** 警告通知 */
export function warning(title: string, message?: string, options?: NotificationOptions): string {
  return notify(title, message, 'warning', options)
}

/** 信息通知 */
export function info(title: string, message?: string, options?: NotificationOptions): string {
  return notify(title, message, 'info', options)
}

/** 手动关闭某条通知 */
export function dismissNotification(id: string): void {
  useNotificationStore.getState().dismiss(id)
}

/** 清空所有可见通知 */
export function clearNotifications(): void {
  useNotificationStore.getState().clear()
}

/** 清空历史记录 */
export function clearNotificationHistory(): void {
  useNotificationStore.getState().clearHistory()
}

/** 获取历史记录快照 */
export function getNotificationHistory(): Notification[] {
  return useNotificationStore.getState().history
}

// ============ React Hook ============

/**
 * 在组件中订阅通知状态
 * @returns 当前可见通知数组与操作方法
 */
export function useNotifications(): {
  notifications: Notification[]
  history: Notification[]
  dismiss: (id: string) => void
  clear: () => void
} {
  const notifications = useNotificationStore(s => s.visible)
  const history = useNotificationStore(s => s.history)
  const dismiss = useNotificationStore(s => s.dismiss)
  const clear = useNotificationStore(s => s.clear)

  // 组件卸载时清理自身触发的定时器（全局 store 不清空可见列表）
  useEffect(() => {
    return () => {
      // 不在此清理，避免组件切换导致通知消失
    }
  }, [])

  return { notifications, history, dismiss, clear }
}

/** 仅订阅可见通知（轻量版 hook） */
export function useVisibleNotifications(): Notification[] {
  return useNotificationStore(s => s.visible)
}

/** 仅订阅历史记录 */
export function useNotificationHistory(): Notification[] {
  return useNotificationStore(s => s.history)
}

// 导出 store 便于高级用法
export { useNotificationStore }
