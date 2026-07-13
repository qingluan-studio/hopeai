/**
 * HopeAgent 国际化服务
 * 支持多语言切换、翻译函数、浏览器语言检测与语言持久化
 */

import { create } from 'zustand'
import { useEffect } from 'react'

// ============ 类型定义 ============
export type Language = 'zh-CN' | 'en-US' | 'ja-JP'

export type I18nNamespace =
  | 'nav'
  | 'button'
  | 'hint'
  | 'error'
  | 'settings'
  | 'chat'
  | 'knowledge'
  | 'agent'
  | 'stats'
  | 'common'

export interface LanguageInfo {
  code: Language
  name: string
  nativeName: string
  flag: string
}

// ============ 语言列表 ============
export const LANGUAGES: LanguageInfo[] = [
  { code: 'zh-CN', name: 'Chinese', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'en-US', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ja-JP', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
]

// ============ 翻译资源（每个语言 50+ 条） ============
const translations: Record<Language, Record<string, string>> = {
  'zh-CN': {
    // 导航
    'nav.chat': '聊天',
    'nav.knowledge': '知识库',
    'nav.agents': 'Agent',
    'nav.builder': '构建器',
    'nav.settings': '设置',
    'nav.dashboard': '仪表盘',
    'nav.plugins': '插件',
    'nav.templates': '模板',
    'nav.archive': '归档',
    'nav.search': '搜索',

    // 按钮
    'button.save': '保存',
    'button.cancel': '取消',
    'button.delete': '删除',
    'button.confirm': '确认',
    'button.submit': '提交',
    'button.edit': '编辑',
    'button.create': '创建',
    'button.export': '导出',
    'button.import': '导入',
    'button.refresh': '刷新',
    'button.send': '发送',
    'button.clear': '清空',
    'button.copy': '复制',
    'button.download': '下载',
    'button.upload': '上传',
    'button.close': '关闭',
    'button.ok': '确定',

    // 提示
    'hint.success': '操作成功',
    'hint.error': '操作失败',
    'hint.loading': '加载中...',
    'hint.saving': '保存中...',
    'hint.deleting': '删除中...',
    'hint.noData': '暂无数据',
    'hint.searchPlaceholder': '搜索...',
    'hint.inputPlaceholder': '请输入...',
    'hint.copied': '已复制到剪贴板',
    'hint.networkError': '网络错误，请检查连接',

    // 错误
    'error.network': '网络连接失败，请重试',
    'error.timeout': '请求超时',
    'error.unauthorized': '请先登录',
    'error.forbidden': '没有权限',
    'error.notFound': '资源不存在',
    'error.server': '服务器错误',
    'error.unknown': '未知错误',
    'error.validation': '输入验证失败',
    'error.fileTooLarge': '文件过大',
    'error.unsupportedFormat': '不支持的格式',

    // 设置
    'settings.general': '通用设置',
    'settings.appearance': '外观设置',
    'settings.language': '语言',
    'settings.theme': '主题',
    'settings.model': '模型设置',
    'settings.api': 'API 设置',
    'settings.notification': '通知设置',
    'settings.privacy': '隐私设置',
    'settings.about': '关于',
    'settings.autoSave': '自动保存',
    'settings.fontSize': '字体大小',

    // 聊天
    'chat.newConversation': '新对话',
    'chat.inputPlaceholder': '输入消息，按 Enter 发送，Shift+Enter 换行',
    'chat.thinking': '思考中...',
    'chat.generating': '生成中...',
    'chat.stop': '停止生成',
    'chat.regenerate': '重新生成',
    'chat.copy': '复制回复',
    'chat.like': '点赞',
    'chat.dislike': '点踩',
    'chat.share': '分享对话',
    'chat.export': '导出对话',
    'chat.delete': '删除对话',
    'chat.rename': '重命名',

    // 知识库
    'knowledge.title': '知识库',
    'knowledge.newEntry': '新建条目',
    'knowledge.search': '搜索知识',
    'knowledge.category': '分类',
    'knowledge.tags': '标签',
    'knowledge.import': '导入知识',
    'knowledge.export': '导出知识',
    'knowledge.source': '来源',
    'knowledge.createdAt': '创建时间',
    'knowledge.importance': '重要度',

    // Agent
    'agent.title': 'Agent 管理',
    'agent.newAgent': '新建 Agent',
    'agent.name': 'Agent 名称',
    'agent.role': '角色',
    'agent.description': '描述',
    'agent.skills': '技能',
    'agent.systemPrompt': '系统提示词',
    'agent.avatar': '头像',
    'agent.color': '主题色',
    'agent.switch': '切换 Agent',

    // 统计
    'stats.title': '数据统计',
    'stats.messages': '消息数',
    'stats.conversations': '对话数',
    'stats.tokens': 'Token 数',
    'stats.knowledge': '知识条目',
    'stats.trend': '趋势',
    'stats.today': '今日',
    'stats.week': '本周',
    'stats.month': '本月',
    'stats.total': '总计',

    // 通用
    'common.confirm': '确认',
    'common.cancel': '取消',
    'common.save': '保存',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.search': '搜索',
    'common.loading': '加载中',
    'common.error': '错误',
    'common.success': '成功',
    'common.warning': '警告',
    'common.info': '提示',
    'common.unknown': '未知',
    'common.all': '全部',
    'common.more': '更多',
    'common.less': '收起',
  },

  'en-US': {
    // Navigation
    'nav.chat': 'Chat',
    'nav.knowledge': 'Knowledge',
    'nav.agents': 'Agents',
    'nav.builder': 'Builder',
    'nav.settings': 'Settings',
    'nav.dashboard': 'Dashboard',
    'nav.plugins': 'Plugins',
    'nav.templates': 'Templates',
    'nav.archive': 'Archive',
    'nav.search': 'Search',

    // Buttons
    'button.save': 'Save',
    'button.cancel': 'Cancel',
    'button.delete': 'Delete',
    'button.confirm': 'Confirm',
    'button.submit': 'Submit',
    'button.edit': 'Edit',
    'button.create': 'Create',
    'button.export': 'Export',
    'button.import': 'Import',
    'button.refresh': 'Refresh',
    'button.send': 'Send',
    'button.clear': 'Clear',
    'button.copy': 'Copy',
    'button.download': 'Download',
    'button.upload': 'Upload',
    'button.close': 'Close',
    'button.ok': 'OK',

    // Hints
    'hint.success': 'Operation successful',
    'hint.error': 'Operation failed',
    'hint.loading': 'Loading...',
    'hint.saving': 'Saving...',
    'hint.deleting': 'Deleting...',
    'hint.noData': 'No data',
    'hint.searchPlaceholder': 'Search...',
    'hint.inputPlaceholder': 'Please input...',
    'hint.copied': 'Copied to clipboard',
    'hint.networkError': 'Network error, please check connection',

    // Errors
    'error.network': 'Network connection failed, please retry',
    'error.timeout': 'Request timeout',
    'error.unauthorized': 'Please login first',
    'error.forbidden': 'No permission',
    'error.notFound': 'Resource not found',
    'error.server': 'Server error',
    'error.unknown': 'Unknown error',
    'error.validation': 'Input validation failed',
    'error.fileTooLarge': 'File too large',
    'error.unsupportedFormat': 'Unsupported format',

    // Settings
    'settings.general': 'General',
    'settings.appearance': 'Appearance',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.model': 'Model Settings',
    'settings.api': 'API Settings',
    'settings.notification': 'Notifications',
    'settings.privacy': 'Privacy',
    'settings.about': 'About',
    'settings.autoSave': 'Auto Save',
    'settings.fontSize': 'Font Size',

    // Chat
    'chat.newConversation': 'New Chat',
    'chat.inputPlaceholder': 'Type a message, Enter to send, Shift+Enter for newline',
    'chat.thinking': 'Thinking...',
    'chat.generating': 'Generating...',
    'chat.stop': 'Stop',
    'chat.regenerate': 'Regenerate',
    'chat.copy': 'Copy reply',
    'chat.like': 'Like',
    'chat.dislike': 'Dislike',
    'chat.share': 'Share',
    'chat.export': 'Export',
    'chat.delete': 'Delete',
    'chat.rename': 'Rename',

    // Knowledge
    'knowledge.title': 'Knowledge Base',
    'knowledge.newEntry': 'New Entry',
    'knowledge.search': 'Search Knowledge',
    'knowledge.category': 'Category',
    'knowledge.tags': 'Tags',
    'knowledge.import': 'Import',
    'knowledge.export': 'Export',
    'knowledge.source': 'Source',
    'knowledge.createdAt': 'Created At',
    'knowledge.importance': 'Importance',

    // Agent
    'agent.title': 'Agent Management',
    'agent.newAgent': 'New Agent',
    'agent.name': 'Agent Name',
    'agent.role': 'Role',
    'agent.description': 'Description',
    'agent.skills': 'Skills',
    'agent.systemPrompt': 'System Prompt',
    'agent.avatar': 'Avatar',
    'agent.color': 'Theme Color',
    'agent.switch': 'Switch Agent',

    // Stats
    'stats.title': 'Statistics',
    'stats.messages': 'Messages',
    'stats.conversations': 'Conversations',
    'stats.tokens': 'Tokens',
    'stats.knowledge': 'Knowledge Entries',
    'stats.trend': 'Trend',
    'stats.today': 'Today',
    'stats.week': 'This Week',
    'stats.month': 'This Month',
    'stats.total': 'Total',

    // Common
    'common.confirm': 'Confirm',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.search': 'Search',
    'common.loading': 'Loading',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.warning': 'Warning',
    'common.info': 'Info',
    'common.unknown': 'Unknown',
    'common.all': 'All',
    'common.more': 'More',
    'common.less': 'Less',
  },

  'ja-JP': {
    // ナビゲーション
    'nav.chat': 'チャット',
    'nav.knowledge': 'ナレッジ',
    'nav.agents': 'エージェント',
    'nav.builder': 'ビルダー',
    'nav.settings': '設定',
    'nav.dashboard': 'ダッシュボード',
    'nav.plugins': 'プラグイン',
    'nav.templates': 'テンプレート',
    'nav.archive': 'アーカイブ',
    'nav.search': '検索',

    // ボタン
    'button.save': '保存',
    'button.cancel': 'キャンセル',
    'button.delete': '削除',
    'button.confirm': '確認',
    'button.submit': '送信',
    'button.edit': '編集',
    'button.create': '作成',
    'button.export': 'エクスポート',
    'button.import': 'インポート',
    'button.refresh': '更新',
    'button.send': '送信',
    'button.clear': 'クリア',
    'button.copy': 'コピー',
    'button.download': 'ダウンロード',
    'button.upload': 'アップロード',
    'button.close': '閉じる',
    'button.ok': 'OK',

    // ヒント
    'hint.success': '操作成功',
    'hint.error': '操作失敗',
    'hint.loading': '読み込み中...',
    'hint.saving': '保存中...',
    'hint.deleting': '削除中...',
    'hint.noData': 'データなし',
    'hint.searchPlaceholder': '検索...',
    'hint.inputPlaceholder': '入力してください...',
    'hint.copied': 'クリップボードにコピーしました',
    'hint.networkError': 'ネットワークエラー、接続を確認してください',

    // エラー
    'error.network': 'ネットワーク接続に失敗しました。再試行してください',
    'error.timeout': 'リクエストタイムアウト',
    'error.unauthorized': 'ログインしてください',
    'error.forbidden': '権限がありません',
    'error.notFound': 'リソースが見つかりません',
    'error.server': 'サーバーエラー',
    'error.unknown': '不明なエラー',
    'error.validation': '入力検証に失敗しました',
    'error.fileTooLarge': 'ファイルが大きすぎます',
    'error.unsupportedFormat': 'サポートされていない形式です',

    // 設定
    'settings.general': '一般設定',
    'settings.appearance': '外観',
    'settings.language': '言語',
    'settings.theme': 'テーマ',
    'settings.model': 'モデル設定',
    'settings.api': 'API設定',
    'settings.notification': '通知設定',
    'settings.privacy': 'プライバシー',
    'settings.about': 'バージョン情報',
    'settings.autoSave': '自動保存',
    'settings.fontSize': 'フォントサイズ',

    // チャット
    'chat.newConversation': '新規チャット',
    'chat.inputPlaceholder': 'メッセージを入力、Enterで送信、Shift+Enterで改行',
    'chat.thinking': '考え中...',
    'chat.generating': '生成中...',
    'chat.stop': '停止',
    'chat.regenerate': '再生成',
    'chat.copy': '返信をコピー',
    'chat.like': 'いいね',
    'chat.dislike': 'よくない',
    'chat.share': '共有',
    'chat.export': 'エクスポート',
    'chat.delete': '削除',
    'chat.rename': '名前変更',

    // ナレッジ
    'knowledge.title': 'ナレッジベース',
    'knowledge.newEntry': '新規エントリー',
    'knowledge.search': 'ナレッジを検索',
    'knowledge.category': 'カテゴリ',
    'knowledge.tags': 'タグ',
    'knowledge.import': 'インポート',
    'knowledge.export': 'エクスポート',
    'knowledge.source': 'ソース',
    'knowledge.createdAt': '作成日時',
    'knowledge.importance': '重要度',

    // エージェント
    'agent.title': 'エージェント管理',
    'agent.newAgent': '新規エージェント',
    'agent.name': 'エージェント名',
    'agent.role': '役割',
    'agent.description': '説明',
    'agent.skills': 'スキル',
    'agent.systemPrompt': 'システムプロンプト',
    'agent.avatar': 'アバター',
    'agent.color': 'テーマカラー',
    'agent.switch': 'エージェント切替',

    // 統計
    'stats.title': '統計',
    'stats.messages': 'メッセージ数',
    'stats.conversations': '会話数',
    'stats.tokens': 'トークン数',
    'stats.knowledge': 'ナレッジ数',
    'stats.trend': 'トレンド',
    'stats.today': '今日',
    'stats.week': '今週',
    'stats.month': '今月',
    'stats.total': '合計',

    // 共通
    'common.confirm': '確認',
    'common.cancel': 'キャンセル',
    'common.save': '保存',
    'common.delete': '削除',
    'common.edit': '編集',
    'common.search': '検索',
    'common.loading': '読み込み中',
    'common.error': 'エラー',
    'common.success': '成功',
    'common.warning': '警告',
    'common.info': 'お知らせ',
    'common.unknown': '不明',
    'common.all': 'すべて',
    'common.more': 'もっと見る',
    'common.less': '折りたたむ',
  },
}

// ============ 本地存储 ============
const LANGUAGE_KEY = 'hopeagent-language'

function getStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem(LANGUAGE_KEY) as Language | null
    if (stored && translations[stored]) {
      return stored
    }
  } catch {}
  return detectBrowserLanguage()
}

function setStoredLanguage(lang: Language): void {
  try {
    localStorage.setItem(LANGUAGE_KEY, lang)
  } catch {}
}

// ============ 浏览器语言检测 ============

/**
 * 自动检测浏览器语言
 */
export function detectBrowserLanguage(): Language {
  try {
    const browserLang = navigator.language || (navigator as any).userLanguage || 'zh-CN'

    // 精确匹配
    if (translations[browserLang as Language]) {
      return browserLang as Language
    }

    // 前缀匹配
    if (browserLang.startsWith('zh')) return 'zh-CN'
    if (browserLang.startsWith('en')) return 'en-US'
    if (browserLang.startsWith('ja')) return 'ja-JP'
  } catch {}

  return 'zh-CN' // 默认中文
}

// ============ Zustand Store ============
interface I18nState {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const useI18nStore = create<I18nState>((set, get) => ({
  language: getStoredLanguage(),

  setLanguage: (lang: Language) => {
    setStoredLanguage(lang)
    set({ language: lang })
    // 触发页面刷新或事件
    try {
      document.documentElement.lang = lang
      window.dispatchEvent(new CustomEvent('hopeagent:language-change', { detail: { language: lang } }))
    } catch {}
  },

  t: (key: string, params?: Record<string, string | number>) => {
    const { language } = get()
    return translate(key, params, language)
  },
}))

// ============ 翻译函数 ============

/**
 * 翻译函数，支持参数插值
 */
export function t(key: string, params?: Record<string, string | number>, lang?: Language): string {
  const language = lang || useI18nStore.getState().language
  return translate(key, params, language)
}

function translate(key: string, params: Record<string, string | number> | undefined, lang: Language): string {
  const dict = translations[lang] || translations['zh-CN']
  let result = dict[key]

  // 找不到时返回 key 本身，便于开发时发现
  if (result === undefined) {
    return key
  }

  // 参数插值
  if (params && result) {
    for (const [paramKey, paramValue] of Object.entries(params)) {
      const regex = new RegExp(`\\{${paramKey}\\}`, 'g')
      result = result.replace(regex, String(paramValue))
    }
  }

  return result
}

/**
 * 检查翻译 key 是否存在
 */
export function tExists(key: string, lang?: Language): boolean {
  const language = lang || useI18nStore.getState().language
  const dict = translations[language] || translations['zh-CN']
  return dict[key] !== undefined
}

// ============ 语言管理 ============

/**
 * 设置当前语言
 */
export function setLanguage(lang: Language): void {
  useI18nStore.getState().setLanguage(lang)
}

/**
 * 获取当前语言
 */
export function getLanguage(): Language {
  return useI18nStore.getState().language
}

/**
 * 获取支持的语言列表
 */
export function getLanguages(): LanguageInfo[] {
  return LANGUAGES
}

// ============ React Hook ============

/**
 * useTranslation hook
 */
export function useTranslation() {
  const language = useI18nStore(s => s.language)
  const setLang = useI18nStore(s => s.setLanguage)

  const translate = (key: string, params?: Record<string, string | number>) => {
    return t(key, params, language)
  }

  return {
    t: translate,
    language,
    setLanguage: setLang,
    tExists: (key: string) => tExists(key, language),
  }
}

/**
 * 监听语言变化
 */
export function onLanguageChange(handler: (lang: Language) => void): () => void {
  const listener = (e: Event) => {
    const customEvent = e as CustomEvent<{ language: Language }>
    handler(customEvent.detail.language)
  }
  try {
    window.addEventListener('hopeagent:language-change', listener)
  } catch {}
  return () => {
    try {
      window.removeEventListener('hopeagent:language-change', listener)
    } catch {}
  }
}

// 导出 store
export { useI18nStore }

// 默认导出（便于 import i18n from ...）
export default {
  t,
  setLanguage,
  getLanguage,
  getLanguages,
  detectBrowserLanguage,
  tExists,
  useTranslation,
  onLanguageChange,
}
