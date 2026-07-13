import { useEffect, useRef, useState } from 'react'

// ============ 颜色生成器 ============

/** Cyber 终端风格色板 - 主色系 */
export const CYBER_PALETTE: string[] = [
  '#00ff88', // 主绿
  '#00d4ff', // 青蓝
  '#ff00aa', // 品红
  '#ffaa00', // 琥珀
  '#a855f7', // 紫
  '#10b981', // 翠绿
  '#3b82f6', // 蓝
  '#ef4444', // 红
]

/** Cyber 暗色板 - 用于次要数据 */
export const CYBER_PALETTE_DARK: string[] = [
  '#00cc6a', '#00a8d4', '#cc0088', '#cc8800',
  '#8540c5', '#0d9668', '#2563eb', '#c53030',
]

/**
 * hex 转 rgba 字符串
 * @param hex 十六进制色值（如 #00ff88 或 #0f8）
 * @param alpha 透明度 0-1
 */
export function hexToRgba(hex: string, alpha: number = 1): string {
  let h = hex.replace('#', '')
  if (h.length === 3) {
    h = h.split('').map((c) => c + c).join('')
  }
  const r = parseInt(h.slice(0, 2), 16) || 0
  const g = parseInt(h.slice(2, 4), 16) || 0
  const b = parseInt(h.slice(4, 6), 16) || 0
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * 根据索引获取 cyber 色板颜色（循环取色）
 * @param index 索引
 * @param palette 可选自定义色板
 */
export function getColor(index: number, palette: string[] = CYBER_PALETTE): string {
  return palette[index % palette.length]
}

/**
 * 生成两色之间的渐变色数组
 * @param start 起始色（hex）
 * @param end 结束色（hex）
 * @param steps 步数
 */
export function gradientColor(start: string, end: string, steps: number): string[] {
  if (steps <= 1) return [start]
  let s = start.replace('#', '')
  let e = end.replace('#', '')
  if (s.length === 3) s = s.split('').map((c) => c + c).join('')
  if (e.length === 3) e = e.split('').map((c) => c + c).join('')
  const sr = parseInt(s.slice(0, 2), 16) || 0
  const sg = parseInt(s.slice(2, 4), 16) || 0
  const sb = parseInt(s.slice(4, 6), 16) || 0
  const er = parseInt(e.slice(0, 2), 16) || 0
  const eg = parseInt(e.slice(2, 4), 16) || 0
  const eb = parseInt(e.slice(4, 6), 16) || 0
  const result: string[] = []
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1)
    const r = Math.round(sr + (er - sr) * t)
    const g = Math.round(sg + (eg - sg) * t)
    const b = Math.round(sb + (eb - sb) * t)
    result.push(`#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`)
  }
  return result
}

/**
 * 随机生成 hex 色值
 * @param saturation 饱和度偏好（0-100，默认 70）
 */
export function randomColor(saturation: number = 70): string {
  const hue = Math.floor(Math.random() * 360)
  return hslToHex(hue, saturation, 55)
}

/** hsl 转 hex */
export function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const v = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    return Math.round(v * 255).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

// ============ 数据格式化 ============

/**
 * 数字千分位格式化
 * @param n 数值
 * @param digits 小数位
 */
export function formatNumber(n: number, digits: number = 0): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '-'
  const fixed = Number(n.toFixed(digits))
  return fixed.toLocaleString('zh-CN', { maximumFractionDigits: digits })
}

/**
 * 数值缩写（K/W/M）
 * @param n 数值
 */
export function formatCompact(n: number): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '-'
  const abs = Math.abs(n)
  if (abs >= 1e8) return (n / 1e8).toFixed(1) + '亿'
  if (abs >= 1e4) return (n / 1e4).toFixed(1) + '万'
  if (abs >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return String(n)
}

/**
 * 百分比格式化
 * @param n 0-1 之间的小数或 0-100 的数值
 * @param digits 小数位
 * @param fromPercent 是否传入的就是百分比
 */
export function formatPercent(n: number, digits: number = 1, fromPercent: boolean = false): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '-'
  const v = fromPercent ? n : n * 100
  return v.toFixed(digits) + '%'
}

/**
 * 日期格式化
 * @param date 日期/时间戳/字符串
 * @param fmt 格式 YYYY-MM-DD HH:mm:ss
 */
export function formatDate(date: Date | number | string, fmt: string = 'MM-DD'): string {
  const d = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(d.getTime())) return '-'
  const pad = (v: number) => String(v).padStart(2, '0')
  return fmt
    .replace('YYYY', String(d.getFullYear()))
    .replace('MM', pad(d.getMonth() + 1))
    .replace('DD', pad(d.getDate()))
    .replace('HH', pad(d.getHours()))
    .replace('mm', pad(d.getMinutes()))
    .replace('ss', pad(d.getSeconds()))
}

// ============ 坐标计算（比例尺） ============

export interface Scale {
  (value: number): number
  /** 取值域 */
  domain: [number, number]
  /** 取映射区间 */
  range: [number, number]
  /** 反向求值 */
  invert?: (value: number) => number
}

/**
 * 线性比例尺
 * @param domain 定义域 [min, max]
 * @param range 值域 [start, end]
 */
export function linearScale(domain: [number, number], range: [number, number]): Scale {
  const [d0, d1] = domain
  const [r0, r1] = range
  const fn = ((value: number) => {
    if (d1 === d0) return (r0 + r1) / 2
    const t = (value - d0) / (d1 - d0)
    return r0 + t * (r1 - r0)
  }) as Scale
  fn.domain = domain
  fn.range = range
  fn.invert = (value: number) => {
    if (r1 === r0) return (d0 + d1) / 2
    const t = (value - r0) / (r1 - r0)
    return d0 + t * (d1 - d0)
  }
  return fn
}

/**
 * 对数比例尺
 * @param domain 定义域 [min, max]，要求 min > 0
 * @param range 值域
 * @param base 对数底
 */
export function logScale(domain: [number, number], range: [number, number], base: number = 10): Scale {
  const [d0, d1] = domain
  const [r0, r1] = range
  const lb = Math.log(base)
  const ld0 = Math.log(Math.max(d0, 1e-9)) / lb
  const ld1 = Math.log(Math.max(d1, 1e-9)) / lb
  const fn = ((value: number) => {
    const lv = Math.log(Math.max(value, 1e-9)) / lb
    if (ld1 === ld0) return (r0 + r1) / 2
    const t = (lv - ld0) / (ld1 - ld0)
    return r0 + t * (r1 - r0)
  }) as Scale
  fn.domain = domain
  fn.range = range
  fn.invert = (value: number) => {
    if (r1 === r0) return (d0 + d1) / 2
    const t = (value - r0) / (r1 - r0)
    return Math.pow(base, ld0 + t * (ld1 - ld0))
  }
  return fn
}

/**
 * 分类（序数）比例尺
 * @param domain 分类数组 ['A','B','C']
 * @param range 像素区间 [0, width]
 */
export function ordinalScale(domain: string[], range: [number, number]): (value: string, index?: number) => number {
  const [r0, r1] = range
  const step = domain.length > 1 ? (r1 - r0) / domain.length : (r1 - r0)
  return (value: string, index?: number) => {
    const i = index ?? domain.indexOf(value)
    return r0 + (i + 0.5) * step
  }
}

/**
 * 计算 nice 的刻度区间（向上取整到 5/10 的倍数）
 * @param domain 原始区间
 * @param count 刻度数量
 */
export function niceDomain(domain: [number, number], count: number = 5): [number, number] {
  let [min, max] = domain
  if (min === max) {
    min -= 1
    max += 1
  }
  const range = max - min
  const step = niceStep(range / count)
  const niceMin = Math.floor(min / step) * step
  const niceMax = Math.ceil(max / step) * step
  return [niceMin, niceMax]
}

/** 计算 nice 的步长 */
function niceStep(rawStep: number): number {
  if (rawStep <= 0) return 1
  const exp = Math.floor(Math.log10(rawStep))
  const fraction = rawStep / Math.pow(10, exp)
  let nice: number
  if (fraction < 1.5) nice = 1
  else if (fraction < 3) nice = 2
  else if (fraction < 7) nice = 5
  else nice = 10
  return nice * Math.pow(10, exp)
}

/**
 * 生成刻度值数组
 * @param domain 区间
 * @param count 数量
 */
export function ticks(domain: [number, number], count: number = 5): number[] {
  const [niceMin, niceMax] = niceDomain(domain, count)
  const step = (niceMax - niceMin) / count
  const result: number[] = []
  for (let i = 0; i <= count; i++) {
    result.push(niceMin + step * i)
  }
  return result
}

// ============ 动画工具 ============

/** 缓动函数集合 */
export const easing = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  easeOutElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
  },
  easeOutBounce: (t: number) => {
    const n1 = 7.5625
    const d1 = 2.75
    if (t < 1 / d1) return n1 * t * t
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375
    return n1 * (t -= 2.625 / d1) * t + 0.984375
  },
}

export type EasingFn = (t: number) => number

/**
 * 动画 Hook：从 0 缓动到 1
 * @param duration 持续时间 ms
 * @param easingFn 缓动函数
 * @param delay 延迟 ms
 * @param enabled 是否启用动画
 */
export function useAnimation(
  duration: number = 600,
  easingFn: EasingFn = easing.easeOutCubic,
  delay: number = 0,
  enabled: boolean = true
): number {
  const [progress, setProgress] = useState(enabled ? 0 : 1)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled) {
      setProgress(1)
      return
    }
    startRef.current = null
    setProgress(0)
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now
      const elapsed = now - startRef.current - delay
      if (elapsed < 0) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }
      const t = Math.min(elapsed / duration, 1)
      setProgress(easingFn(t))
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, delay, enabled])

  return progress
}

/**
 * 路径动画：根据进度截取 path 的某段（用于折线从左到右绘制）
 * 简化实现：用 strokeDasharray + strokeDashoffset
 * @param pathLength 路径总长度
 * @param progress 进度 0-1
 */
export function dashForProgress(pathLength: number, progress: number): { dasharray: string; dashoffset: number } {
  return {
    dasharray: `${pathLength}`,
    dashoffset: pathLength * (1 - progress),
  }
}

/** 计算贝塞尔控制点（用于平滑曲线） */
export function smoothPath(
  points: Array<{ x: number; y: number }>,
  tension: number = 0.5
): string {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`

  let path = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] || p2

    const cp1x = p1.x + (p2.x - p0.x) / 6 * tension
    const cp1y = p1.y + (p2.y - p0.y) / 6 * tension
    const cp2x = p2.x - (p3.x - p1.x) / 6 * tension
    const cp2y = p2.y - (p3.y - p1.y) / 6 * tension

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }
  return path
}