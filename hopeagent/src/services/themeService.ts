/**
 * HopeAgent 主题系统服务
 * 管理 8 套主题配色，支持 CSS 变量动态切换、持久化存储
 */

// ============ 类型定义 ============

export interface ThemeColors {
  /** 主背景色 */
  bg: string
  /** 次级背景色（侧边栏等） */
  bgSecondary: string
  /** 面板背景色（卡片、弹窗等） */
  bgPanel: string
  /** 主要文字颜色 */
  textPrimary: string
  /** 次级文字颜色 */
  textSecondary: string
  /** 弱化文字颜色 */
  textMuted: string
  /** 主题强调色 */
  accent: string
  /** 强调色悬停态 */
  accentHover: string
  /** 边框颜色 */
  border: string
  /** 浅边框颜色 */
  borderLight: string
  /** 成功色 */
  success: string
  /** 警告色 */
  warning: string
  /** 错误色 */
  error: string
  /** 信息色 */
  info: string
}

export interface ThemeFonts {
  /** 等宽字体 */
  fontMono: string
  /** 无衬线字体 */
  fontSans: string
  /** 基础字号（px） */
  fontSizeBase: number
}

export interface ThemeEffects {
  /** 扫描线效果 */
  scanline: boolean
  /** 发光效果 */
  glow: boolean
  /** 毛玻璃效果 */
  glassmorphism: boolean
  /** 特效强度 0-1 */
  intensity: number
}

export interface ThemeConfig {
  /** 主题唯一标识 */
  id: string
  /** 主题名称 */
  name: string
  /** 主题描述 */
  description: string
  /** 颜色配置 */
  colors: ThemeColors
  /** 字体配置 */
  fonts: ThemeFonts
  /** 特效配置 */
  effects: ThemeEffects
  /** 圆角配置：none / small / medium / large */
  borderRadius: 'none' | 'small' | 'medium' | 'large'
  /** 背景图案：grid / dots / none */
  backgroundPattern: 'grid' | 'dots' | 'none'
}

// ============ 8 套主题定义 ============

const cyberTheme: ThemeConfig = {
  id: 'cyber',
  name: '赛博朋克',
  description: '经典绿色赛博朋克风格，科技感十足',
  colors: {
    bg: '#0a0e14',
    bgSecondary: '#0d1117',
    bgPanel: '#161b22',
    textPrimary: '#e0e6ed',
    textSecondary: '#9ca3af',
    textMuted: '#6b7280',
    accent: '#00ff88',
    accentHover: '#00cc6a',
    border: 'rgba(0, 255, 136, 0.15)',
    borderLight: 'rgba(0, 255, 136, 0.08)',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  fonts: {
    fontMono: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
    fontSans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
    fontSizeBase: 14,
  },
  effects: {
    scanline: false,
    glow: true,
    glassmorphism: false,
    intensity: 0.5,
  },
  borderRadius: 'medium',
  backgroundPattern: 'none',
}

const matrixTheme: ThemeConfig = {
  id: 'matrix',
  name: '黑客帝国',
  description: '黑底绿字，经典 Matrix 字符雨风格',
  colors: {
    bg: '#000000',
    bgSecondary: '#050a05',
    bgPanel: '#0a140a',
    textPrimary: '#00ff00',
    textSecondary: '#00cc00',
    textMuted: '#006600',
    accent: '#00ff00',
    accentHover: '#00cc00',
    border: 'rgba(0, 255, 0, 0.2)',
    borderLight: 'rgba(0, 255, 0, 0.1)',
    success: '#00ff00',
    warning: '#ffff00',
    error: '#ff0000',
    info: '#00ffff',
  },
  fonts: {
    fontMono: "'Courier New', 'Consolas', monospace",
    fontSans: "'Courier New', 'Consolas', monospace",
    fontSizeBase: 14,
  },
  effects: {
    scanline: true,
    glow: true,
    glassmorphism: false,
    intensity: 0.7,
  },
  borderRadius: 'none',
  backgroundPattern: 'none',
}

const retroTheme: ThemeConfig = {
  id: 'retro',
  name: '复古终端',
  description: '琥珀色复古 CRT 终端风格，带扫描线',
  colors: {
    bg: '#1a1a00',
    bgSecondary: '#1f1f00',
    bgPanel: '#252500',
    textPrimary: '#ffb000',
    textSecondary: '#cc8c00',
    textMuted: '#996600',
    accent: '#ffb000',
    accentHover: '#ffc933',
    border: 'rgba(255, 176, 0, 0.2)',
    borderLight: 'rgba(255, 176, 0, 0.1)',
    success: '#00ff00',
    warning: '#ffff00',
    error: '#ff4444',
    info: '#00aaff',
  },
  fonts: {
    fontMono: "'VT323', 'Courier New', monospace",
    fontSans: "'VT323', 'Courier New', monospace",
    fontSizeBase: 16,
  },
  effects: {
    scanline: true,
    glow: true,
    glassmorphism: false,
    intensity: 0.8,
  },
  borderRadius: 'none',
  backgroundPattern: 'none',
}

const draculaTheme: ThemeConfig = {
  id: 'dracula',
  name: '德古拉',
  description: '经典 Dracula 深紫配色，优雅神秘',
  colors: {
    bg: '#282a36',
    bgSecondary: '#21222c',
    bgPanel: '#343746',
    textPrimary: '#f8f8f2',
    textSecondary: '#bd93f9',
    textMuted: '#6272a4',
    accent: '#bd93f9',
    accentHover: '#a77bf5',
    border: 'rgba(189, 147, 249, 0.2)',
    borderLight: 'rgba(189, 147, 249, 0.1)',
    success: '#50fa7b',
    warning: '#f1fa8c',
    error: '#ff5555',
    info: '#8be9fd',
  },
  fonts: {
    fontMono: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
    fontSans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
    fontSizeBase: 14,
  },
  effects: {
    scanline: false,
    glow: false,
    glassmorphism: false,
    intensity: 0.3,
  },
  borderRadius: 'medium',
  backgroundPattern: 'none',
}

const nordTheme: ThemeConfig = {
  id: 'nord',
  name: '北极光',
  description: 'Nord 北欧风格，深蓝冷色调',
  colors: {
    bg: '#2e3440',
    bgSecondary: '#3b4252',
    bgPanel: '#434c5e',
    textPrimary: '#eceff4',
    textSecondary: '#d8dee9',
    textMuted: '#8fbcbb',
    accent: '#88c0d0',
    accentHover: '#81a1c1',
    border: 'rgba(136, 192, 208, 0.2)',
    borderLight: 'rgba(136, 192, 208, 0.1)',
    success: '#a3be8c',
    warning: '#ebcb8b',
    error: '#bf616a',
    info: '#88c0d0',
  },
  fonts: {
    fontMono: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
    fontSans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
    fontSizeBase: 14,
  },
  effects: {
    scanline: false,
    glow: false,
    glassmorphism: false,
    intensity: 0.2,
  },
  borderRadius: 'small',
  backgroundPattern: 'none',
}

const solarizedDarkTheme: ThemeConfig = {
  id: 'solarized-dark',
  name: '太阳化深色',
  description: 'Solarized 经典配色，护眼舒适',
  colors: {
    bg: '#002b36',
    bgSecondary: '#073642',
    bgPanel: '#094050',
    textPrimary: '#eee8d5',
    textSecondary: '#93a1a1',
    textMuted: '#657b83',
    accent: '#b58900',
    accentHover: '#cb9b00',
    border: 'rgba(181, 137, 0, 0.2)',
    borderLight: 'rgba(181, 137, 0, 0.1)',
    success: '#859900',
    warning: '#b58900',
    error: '#dc322f',
    info: '#268bd2',
  },
  fonts: {
    fontMono: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
    fontSans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
    fontSizeBase: 14,
  },
  effects: {
    scanline: false,
    glow: false,
    glassmorphism: false,
    intensity: 0.1,
  },
  borderRadius: 'medium',
  backgroundPattern: 'none',
}

const lightCleanTheme: ThemeConfig = {
  id: 'light-clean',
  name: '浅色简洁',
  description: '干净明亮的浅色主题，清爽简约',
  colors: {
    bg: '#ffffff',
    bgSecondary: '#f8fafc',
    bgPanel: '#ffffff',
    textPrimary: '#1e293b',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    accent: '#3b82f6',
    accentHover: '#2563eb',
    border: 'rgba(59, 130, 246, 0.15)',
    borderLight: 'rgba(59, 130, 246, 0.08)',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  fonts: {
    fontMono: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
    fontSans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
    fontSizeBase: 14,
  },
  effects: {
    scanline: false,
    glow: false,
    glassmorphism: true,
    intensity: 0.3,
  },
  borderRadius: 'large',
  backgroundPattern: 'none',
}

const oceanTheme: ThemeConfig = {
  id: 'ocean',
  name: '深海蓝',
  description: '深海蓝渐变风格，宁静深邃',
  colors: {
    bg: '#0c1929',
    bgSecondary: '#0f2137',
    bgPanel: '#132a47',
    textPrimary: '#e0f2fe',
    textSecondary: '#7dd3fc',
    textMuted: '#38bdf8',
    accent: '#38bdf8',
    accentHover: '#0ea5e9',
    border: 'rgba(56, 189, 248, 0.2)',
    borderLight: 'rgba(56, 189, 248, 0.1)',
    success: '#22d3ee',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#38bdf8',
  },
  fonts: {
    fontMono: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
    fontSans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
    fontSizeBase: 14,
  },
  effects: {
    scanline: false,
    glow: true,
    glassmorphism: true,
    intensity: 0.5,
  },
  borderRadius: 'medium',
  backgroundPattern: 'grid',
}

// ============ 主题注册表 ============

const themes: ThemeConfig[] = [
  cyberTheme,
  matrixTheme,
  retroTheme,
  draculaTheme,
  nordTheme,
  solarizedDarkTheme,
  lightCleanTheme,
  oceanTheme,
]

// ============ 内部状态 ============

const STORAGE_KEY = 'hopeagent-theme'
let currentThemeId: string = 'cyber'

// ============ 工具函数 ============

/** 圆角配置映射为 CSS 值 */
function borderRadiusToCss(level: ThemeConfig['borderRadius']): string {
  const map: Record<ThemeConfig['borderRadius'], string> = {
    none: '0px',
    small: '4px',
    medium: '12px',
    large: '16px',
  }
  return map[level]
}

// ============ 主题服务 API ============

/**
 * 获取所有主题列表
 */
export function getThemes(): ThemeConfig[] {
  return [...themes]
}

/**
 * 根据 ID 获取主题配置
 * @param id 主题 ID
 * @returns 主题配置；未找到时返回默认 cyber 主题
 */
export function getTheme(id: string): ThemeConfig {
  const found = themes.find(t => t.id === id)
  return found || cyberTheme
}

/**
 * 获取当前主题
 */
export function getCurrentTheme(): ThemeConfig {
  return getTheme(currentThemeId)
}

/**
 * 获取当前主题 ID
 */
export function getCurrentThemeId(): string {
  return currentThemeId
}

/**
 * 应用主题到 :root CSS 变量
 * @param theme 主题配置
 */
export function applyTheme(theme: ThemeConfig): void {
  const root = document.documentElement

  // 设置 data-theme 属性，便于 CSS 选择器匹配
  root.setAttribute('data-theme', theme.id)

  const { colors, fonts, effects } = theme

  // 颜色变量
  root.style.setProperty('--color-bg', colors.bg)
  root.style.setProperty('--color-bg-secondary', colors.bgSecondary)
  root.style.setProperty('--color-bg-panel', colors.bgPanel)
  root.style.setProperty('--color-text-primary', colors.textPrimary)
  root.style.setProperty('--color-text-secondary', colors.textSecondary)
  root.style.setProperty('--color-text-muted', colors.textMuted)
  root.style.setProperty('--color-accent', colors.accent)
  root.style.setProperty('--color-accent-hover', colors.accentHover)
  root.style.setProperty('--color-border', colors.border)
  root.style.setProperty('--color-border-light', colors.borderLight)
  root.style.setProperty('--color-success', colors.success)
  root.style.setProperty('--color-warning', colors.warning)
  root.style.setProperty('--color-error', colors.error)
  root.style.setProperty('--color-info', colors.info)

  // 字体变量
  root.style.setProperty('--font-mono', fonts.fontMono)
  root.style.setProperty('--font-sans', fonts.fontSans)
  root.style.setProperty('--font-size-base', `${fonts.fontSizeBase}px`)

  // 圆角变量
  root.style.setProperty('--radius-base', borderRadiusToCss(theme.borderRadius))

  // 特效变量
  root.style.setProperty('--effect-intensity', String(effects.intensity))
  root.style.setProperty('--effect-scanline', effects.scanline ? '1' : '0')
  root.style.setProperty('--effect-glow', effects.glow ? '1' : '0')
  root.style.setProperty('--effect-glass', effects.glassmorphism ? '1' : '0')

  // 背景图案
  root.setAttribute('data-bg-pattern', theme.backgroundPattern)
}

/**
 * 切换主题
 * @param id 主题 ID
 * @returns 是否切换成功
 */
export function setTheme(id: string): boolean {
  const theme = getTheme(id)
  if (!theme) return false

  currentThemeId = theme.id
  applyTheme(theme)

  // 持久化
  try {
    localStorage.setItem(STORAGE_KEY, theme.id)
  } catch {
    // 忽略存储错误
  }

  return true
}

/**
 * 重置为默认主题
 */
export function resetTheme(): void {
  setTheme('cyber')
}

/**
 * 从 localStorage 加载已保存的主题并应用
 * 在应用启动时调用
 */
export function initTheme(): void {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && themes.some(t => t.id === saved)) {
      currentThemeId = saved
    }
  } catch {
    // 忽略读取错误
  }
  applyTheme(getCurrentTheme())
}

/**
 * 动态调整字号（不改变主题，只覆盖 CSS 变量）
 * @param size 字号（px）
 */
export function setFontSize(size: number): void {
  const clamped = Math.max(12, Math.min(24, size))
  document.documentElement.style.setProperty('--font-size-base', `${clamped}px`)
}

/**
 * 动态调整特效强度
 * @param intensity 强度 0-1
 */
export function setEffectIntensity(intensity: number): void {
  const clamped = Math.max(0, Math.min(1, intensity))
  document.documentElement.style.setProperty('--effect-intensity', String(clamped))
}

/**
 * 按分类获取主题（用于设置页展示）
 */
export function getThemesByCategory(): {
  dark: ThemeConfig[]
  light: ThemeConfig[]
} {
  const darkIds = ['cyber', 'matrix', 'retro', 'dracula', 'nord', 'solarized-dark', 'ocean']
  return {
    dark: themes.filter(t => darkIds.includes(t.id)),
    light: themes.filter(t => !darkIds.includes(t.id)),
  }
}
