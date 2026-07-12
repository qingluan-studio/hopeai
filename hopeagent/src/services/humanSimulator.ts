// 人类行为模拟器 — 录制与回放用户操作脚本
// 移植自 Vue3 Composition API（src/stores/human-simulator.ts），适配 React 项目
// 使用 localStorage 直接持久化，键名前缀 hopeagent-，导出纯函数与对象

const STORAGE_KEY = 'hopeagent-human-simulator'
const MAX_RESULTS = 100

export interface ClickAction {
  type: 'click'
  selector: string
  x?: number
  y?: number
  description: string
}

export interface InputAction {
  type: 'input'
  selector: string
  value: string
  description: string
}

export interface ScrollAction {
  type: 'scroll'
  selector: string
  x?: number
  y?: number
  behavior: 'smooth' | 'auto'
  description: string
}

export interface WaitAction {
  type: 'wait'
  selector?: string
  duration: number
  description: string
}

export interface NavigateAction {
  type: 'navigate'
  url: string
  description: string
}

export interface EvalAction {
  type: 'eval'
  code: string
  description: string
}

export type HumanAction = ClickAction | InputAction | ScrollAction | WaitAction | NavigateAction | EvalAction

export interface HumanScript {
  id: string
  name: string
  description: string
  actions: HumanAction[]
  createdAt: number
  lastRunAt: number
  runCount: number
  averageDuration: number
  category: 'form_fill' | 'data_collect' | 'navigation' | 'testing' | 'custom'
  tags: string[]
}

export interface HumanScriptResult {
  scriptId: string
  scriptName: string
  success: boolean
  actionsExecuted: number
  actionsTotal: number
  failedAt: number
  error: string
  duration: number
  screenshot: string
}

interface HumanSimulatorState {
  scripts: HumanScript[]
  results: HumanScriptResult[]
  isRecording: boolean
  recordedActions: HumanAction[]
  allowDangerousEval: boolean
  runHistory: number
  stealthMode: boolean
  antiDetection: boolean
}

const BUILTIN_SCRIPTS: Omit<HumanScript, 'id' | 'createdAt' | 'lastRunAt' | 'runCount' | 'averageDuration'>[] = [
  {
    name: '自动滚动到底部',
    description: '模拟用户滚动页面到底部加载更多内容',
    actions: [
      { type: 'wait', duration: 500, description: '等待页面稳定' },
      { type: 'scroll', selector: 'window', y: 99999, behavior: 'smooth', description: '滚动到底部' },
      { type: 'wait', duration: 1000, description: '等待新内容加载' },
    ],
    category: 'navigation',
    tags: ['滚动', '加载', '底部'],
  },
  {
    name: '点击所有展开按钮',
    description: '模拟用户逐个点击页面上的展开/折叠按钮',
    actions: [
      { type: 'wait', duration: 500, description: '等待页面就绪' },
      { type: 'eval', code: `document.querySelectorAll('[aria-expanded="false"], .collapsed, .folded, details:not([open]) > summary').forEach(el => el.click())`, description: '展开所有折叠区域' },
      { type: 'wait', duration: 800, description: '等待动画完成' },
    ],
    category: 'data_collect',
    tags: ['展开', '折叠', '内容'],
  },
  {
    name: '提取当前页面文本',
    description: '模拟用户选中并复制页面文本内容',
    actions: [
      { type: 'eval', code: `
const title = document.title
const meta = document.querySelector('meta[name="description"]')?.content || ''
const body = document.body.innerText.substring(0, 5000)
const links = Array.from(document.querySelectorAll('a[href]')).map(a => ({ text: a.innerText.trim(), href: a.href })).filter(l => l.text && l.href)
JSON.stringify({ title, meta, body, links: links.slice(0, 50) })
      `.trim(), description: '提取页面文本、元数据和链接' },
    ],
    category: 'data_collect',
    tags: ['提取', '文本', '页面'],
  },
  {
    name: '表单自动填充',
    description: '模拟用户在表单中填写常见字段',
    actions: [
      { type: 'eval', code: `
const fields = {
  'name': '测试用户',
  'email': 'test@example.com',
  'phone': '13800138000',
  'address': '北京市朝阳区',
  'company': '科技公司',
  'username': 'testuser',
  'password': 'Test123456',
  'comment': '这是一个测试评论，用于验证表单功能是否正常。',
  'message': '您好，这是一条测试消息。'
}
Object.entries(fields).forEach(([key, value]) => {
  const el = document.querySelector(\`[name*="\${key}" i], [id*="\${key}" i], [placeholder*="\${key}" i]\`)
  if (el && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) {
    el.value = value
    el.dispatchEvent(new Event('input', { bubbles: true }))
    el.dispatchEvent(new Event('change', { bubbles: true }))
  }
})
      `.trim(), description: '智能填充表单字段' },
    ],
    category: 'form_fill',
    tags: ['表单', '填充', '自动化'],
  },
  {
    name: '截图当前页面',
    description: '捕获当前页面可视区域截图',
    actions: [
      { type: 'wait', duration: 300, description: '等待页面渲染' },
      { type: 'eval', code: `document.title + ' | ' + window.innerWidth + 'x' + window.innerHeight`, description: '获取页面信息' },
    ],
    category: 'testing',
    tags: ['截图', '捕获', '页面'],
  },
]

const DEFAULT_STATE: HumanSimulatorState = {
  scripts: [],
  results: [],
  isRecording: false,
  recordedActions: [],
  allowDangerousEval: false,
  runHistory: 0,
  stealthMode: false,
  antiDetection: false,
}

function generateId(): string {
  return 'hs_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8)
}

function loadState(): HumanSimulatorState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { ...DEFAULT_STATE, ...parsed }
    }
  } catch {}
  return { ...DEFAULT_STATE }
}

function save(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

export const state: HumanSimulatorState = loadState()

export function getScripts(): HumanScript[] {
  return state.scripts
}

export function getRecentResults(): HumanScriptResult[] {
  return [...state.results].reverse().slice(0, 20)
}

export function initBuiltinScripts(): void {
  if (state.scripts.length > 0) return
  for (const tpl of BUILTIN_SCRIPTS) {
    const script: HumanScript = {
      ...tpl,
      id: generateId(),
      createdAt: Date.now(),
      lastRunAt: 0,
      runCount: 0,
      averageDuration: 0,
    }
    state.scripts.push(script)
  }
  save()
}

export function createScript(
  name: string,
  description: string,
  category: HumanScript['category'],
  tags: string[] = [],
): HumanScript {
  const script: HumanScript = {
    id: generateId(),
    name,
    description,
    actions: [],
    createdAt: Date.now(),
    lastRunAt: 0,
    runCount: 0,
    averageDuration: 0,
    category,
    tags,
  }
  state.scripts.push(script)
  save()
  return script
}

export function deleteScript(id: string): void {
  state.scripts = state.scripts.filter((s) => s.id !== id)
  save()
}

export function addAction(scriptId: string, action: HumanAction): void {
  const script = state.scripts.find((s) => s.id === scriptId)
  if (!script) return
  script.actions.push(action)
  save()
}

export function removeAction(scriptId: string, index: number): void {
  const script = state.scripts.find((s) => s.id === scriptId)
  if (!script || index < 0 || index >= script.actions.length) return
  script.actions.splice(index, 1)
  save()
}

export function moveAction(scriptId: string, fromIndex: number, toIndex: number): void {
  const script = state.scripts.find((s) => s.id === scriptId)
  if (!script) return
  const item = script.actions.splice(fromIndex, 1)[0]
  script.actions.splice(toIndex, 0, item)
  save()
}

export function startRecording(): void {
  state.isRecording = true
  state.recordedActions = []
  save()
}

export function recordAction(action: HumanAction): void {
  if (!state.isRecording) return
  state.recordedActions.push(action)
  save()
}

export function stopRecording(scriptId?: string): void {
  state.isRecording = false
  if (scriptId && state.recordedActions.length > 0) {
    const script = state.scripts.find((s) => s.id === scriptId)
    if (script) {
      script.actions.push(...state.recordedActions)
    }
  }
  state.recordedActions = []
  save()
}

function applyStealth(doc: Document): void {
  try {
    // Override navigator.webdriver
    const navProto = Object.getPrototypeOf(navigator)
    Object.defineProperty(navProto, 'webdriver', {
      get: () => false,
      configurable: true,
    })

    // Suppress PhantomJS detection
    const win = doc.defaultView as any
    if (win) {
      delete win.callPhantom
      delete win._phantom
      delete win.__phantomas
      delete win.Buffer
      delete win.emit
      delete win.spawn
    }

    // Override Chrome automation flag
    Object.defineProperty(navProto, 'plugins', {
      get: () => [1, 2, 3, 4, 5],
      configurable: true,
    })

    // Randomize screen dimensions slightly
    Object.defineProperty(navProto, 'languages', {
      get: () => ['zh-CN', 'zh', 'en-US', 'en'],
      configurable: true,
    })

    // Override permissions query for notifications
    const origQuery = (navigator as any).permissions?.query
    if (origQuery && (navigator as any).permissions) {
      ;(navigator as any).permissions.query = (params: any) => {
        if (params.name === 'notifications') {
          return Promise.resolve({ state: 'prompt', onchange: null } as PermissionStatus)
        }
        return origQuery.call(navigator.permissions, params)
      }
    }

    // Hide automation extension detection
    if (win) {
      win.chrome = { runtime: {} }
    }
  } catch {
    // Stealth injection failed silently
  }
}

function simulateHumanInput(el: HTMLInputElement | HTMLTextAreaElement, value: string): void {
  const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set

  if (state.stealthMode) {
    // Type character by character with random delays
    let pos = 0
    const typeNext = () => {
      if (pos >= value.length) {
        el.dispatchEvent(new Event('input', { bubbles: true }))
        el.dispatchEvent(new Event('change', { bubbles: true }))
        return
      }
      const snippet = value.slice(0, pos + 1)
      nativeSetter?.call(el, snippet)
      el.dispatchEvent(new Event('input', { bubbles: true }))
      el.dispatchEvent(new KeyboardEvent('keydown', { key: value[pos], bubbles: true }))
      el.dispatchEvent(new KeyboardEvent('keypress', { key: value[pos], bubbles: true }))
      el.dispatchEvent(new KeyboardEvent('keyup', { key: value[pos], bubbles: true }))
      pos++
      const delay = 30 + Math.random() * 80
      setTimeout(typeNext, delay)
    }
    typeNext()
  } else {
    nativeSetter?.call(el, value)
    el.dispatchEvent(new Event('input', { bubbles: true }))
    el.dispatchEvent(new Event('change', { bubbles: true }))
  }
}

function simulateHumanClick(el: HTMLElement): void {
  const rect = el.getBoundingClientRect()
  const x = rect.left + rect.width * (0.3 + Math.random() * 0.4)
  const y = rect.top + rect.height * (0.3 + Math.random() * 0.4)

  if (state.stealthMode) {
    // Simulate mouse movement to target
    const moveEvent = new MouseEvent('mousemove', {
      clientX: x, clientY: y, bubbles: true,
    })
    document.elementFromPoint(x, y)?.dispatchEvent(moveEvent)

    // Small random hover delay
    const delay = 50 + Math.random() * 150
    const then = Date.now()
    while (Date.now() - then < delay) { /* spin */ }
  }

  el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
  el.dispatchEvent(new MouseEvent('mousedown', { clientX: x, clientY: y, bubbles: true }))
  el.dispatchEvent(new MouseEvent('mouseup', { clientX: x, clientY: y, bubbles: true }))
  el.dispatchEvent(new MouseEvent('click', { clientX: x, clientY: y, bubbles: true, cancelable: true }))

  if (!state.stealthMode) {
    el.click()
  }
}

export function executeAction(action: HumanAction, doc: Document): void {
  switch (action.type) {
    case 'wait':
      break

    case 'navigate':
      if (action.url.startsWith('#')) {
        const el = doc.querySelector(action.url)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }
      break

    case 'click': {
      const el = action.selector.startsWith('window') ? null : doc.querySelector(action.selector)
      if (el instanceof HTMLElement) {
        simulateHumanClick(el)
      } else if (action.x !== undefined && action.y !== undefined) {
        const clickEvent = new MouseEvent('click', { clientX: action.x, clientY: action.y, bubbles: true })
        doc.elementFromPoint(action.x, action.y)?.dispatchEvent(clickEvent)
      }
      break
    }

    case 'input': {
      const el = doc.querySelector(action.selector)
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
        simulateHumanInput(el, action.value)
      }
      break
    }

    case 'scroll': {
      const el = action.selector === 'window' ? doc.documentElement : doc.querySelector(action.selector)
      if (el) {
        el.scrollTo({
          left: action.x ?? (el as Element).scrollLeft,
          top: action.y ?? (el as Element).scrollTop,
          behavior: action.behavior || 'auto',
        })
      }
      break
    }

    case 'eval':
      if (!state.allowDangerousEval) return
      const safeFn = new Function('document', 'window', action.code)
      safeFn(doc, doc.defaultView)
      break
  }
}

export function runScript(
  scriptId: string,
  context: { iframe?: HTMLIFrameElement; doc?: Document } = {},
): HumanScriptResult {
  const script = state.scripts.find((s) => s.id === scriptId)
  if (!script) {
    return {
      scriptId,
      scriptName: '',
      success: false,
      actionsExecuted: 0,
      actionsTotal: 0,
      failedAt: 0,
      error: '脚本不存在',
      duration: 0,
      screenshot: '',
    }
  }

  const start = performance.now()
  let actionsExecuted = 0

  try {
    const targetDoc = context.doc || context.iframe?.contentDocument || document
    if (state.antiDetection && typeof targetDoc !== 'undefined') {
      applyStealth(targetDoc)
    }

    for (let i = 0; i < script.actions.length; i++) {
      const action = script.actions[i]

      // Human-like delay between actions
      if (state.stealthMode && i > 0) {
        const delay = 200 + Math.random() * 600
        const now = Date.now()
        while (Date.now() - now < delay) { /* spin */ }
      }

      try {
        executeAction(action, targetDoc)
        actionsExecuted++
      } catch (e: any) {
        return {
          scriptId: script.id,
          scriptName: script.name,
          success: false,
          actionsExecuted,
          actionsTotal: script.actions.length,
          failedAt: i,
          error: e?.message || '执行失败',
          duration: performance.now() - start,
          screenshot: '',
        }
      }
    }

    const duration = performance.now() - start
    script.lastRunAt = Date.now()
    script.runCount++
    script.averageDuration = Math.round(
      (script.averageDuration * (script.runCount - 1) + duration) / script.runCount,
    )

    state.runHistory++
    if (state.runHistory > 1000) state.runHistory = 0

    const result: HumanScriptResult = {
      scriptId: script.id,
      scriptName: script.name,
      success: true,
      actionsExecuted,
      actionsTotal: script.actions.length,
      failedAt: -1,
      error: '',
      duration,
      screenshot: '',
    }
    state.results.push(result)

    if (state.results.length > MAX_RESULTS) {
      state.results = state.results.slice(-MAX_RESULTS)
    }

    save()
    return result
  } catch (e: any) {
    return {
      scriptId: script.id,
      scriptName: script.name,
      success: false,
      actionsExecuted,
      actionsTotal: script.actions.length,
      failedAt: actionsExecuted,
      error: e?.message || '脚本执行异常',
      duration: performance.now() - start,
      screenshot: '',
    }
  }
}

export function executeScript(
  scriptId: string,
  context: { iframe?: HTMLIFrameElement; doc?: Document } = {},
): HumanScriptResult {
  return runScript(scriptId, context)
}

export function toggleStealthMode(): void {
  state.stealthMode = !state.stealthMode
  if (state.stealthMode) state.antiDetection = true
  save()
}

export function toggleAntiDetection(): void {
  state.antiDetection = !state.antiDetection
  save()
}

export function createQuickAction(
  type: HumanAction['type'],
  desc: string,
  detail: Partial<HumanAction> = {},
): HumanAction {
  const base = { description: desc }
  switch (type) {
    case 'click':
      return { type, selector: (detail as Partial<ClickAction>).selector || 'body', description: desc } as ClickAction
    case 'input':
      return { type, selector: (detail as Partial<InputAction>).selector || 'input', value: (detail as Partial<InputAction>).value || '', description: desc } as InputAction
    case 'scroll':
      return { type, selector: 'window', behavior: 'smooth', ...base, ...detail } as ScrollAction
    case 'wait':
      return { type, selector: undefined, duration: 500, ...base, ...detail } as WaitAction
    case 'navigate':
      return { type, url: '', ...base, ...detail } as NavigateAction
    case 'eval':
      return { type, code: '', ...base, ...detail } as EvalAction
  }
  return { type, selector: '', description: desc } as HumanAction
}

export function suggestScripts(task: string): HumanScript[] {
  const keywords = task.toLowerCase().split(/[\s,，]+/).filter(Boolean)
  const scored = state.scripts.map((s) => {
    let score = 0
    const nameLow = s.name.toLowerCase()
    const descLow = s.description.toLowerCase()
    const tagsLow = s.tags.map((t) => t.toLowerCase())
    for (const kw of keywords) {
      if (kw.length < 2) continue
      if (nameLow.includes(kw)) score += 5
      if (descLow.includes(kw)) score += 3
      if (tagsLow.some((t) => t.includes(kw))) score += 2
    }
    return { script: s, score }
  })
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.script)
    .slice(0, 5)
}
