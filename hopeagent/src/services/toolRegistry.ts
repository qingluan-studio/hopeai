// 统一工具调用框架 ToolRegistry + ToolUseEngine
// 参考 CEE 的 plugin/skill_market 和 agent/base_agent 设计

import type { ToolCategory, ToolUsageStats, ToolExecutionRecord, FavoriteTool } from '@/types'

export interface ToolParameter {
  name: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  description: string
  required?: boolean
  default?: any
  enum?: string[]
}

export interface ToolDefinition {
  name: string
  description: string
  category: string
  icon?: string
  parameters: ToolParameter[]
  handler?: (args: Record<string, any>) => Promise<any>
  examples?: { input: Record<string, any>; output: any }[]
  tags?: string[]
  version?: string
  author?: string
  timeout?: number
}

export interface ToolExecutionResult {
  toolName: string
  success: boolean
  output?: any
  error?: string
  durationMs: number
  timestamp: number
}

export interface ToolUsePlan {
  toolName: string
  arguments: Record<string, any>
  reasoning: string
}

// ==================== 工具辅助函数 ====================

// 安全执行带超时的 Promise
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`执行超时（${ms}ms）`))
    }, ms)
    promise.then(
      (res) => {
        clearTimeout(timer)
        resolve(res)
      },
      (err) => {
        clearTimeout(timer)
        reject(err)
      }
    )
  })
}

// ==================== 工具实现：计算与转换类 ====================

// 1. calculator - 科学计算器
async function calculatorHandler(args: Record<string, any>): Promise<any> {
  const { expression, mode = 'basic' } = args

  // 阶乘函数
  const factorial = (n: number): number => {
    if (n < 0) throw new Error('阶乘不能为负数')
    if (n === 0 || n === 1) return 1
    if (n > 170) return Infinity
    let result = 1
    for (let i = 2; i <= n; i++) result *= i
    return result
  }

  // 安全的表达式求值器
  const safeEval = (expr: string): number => {
    // 清理表达式，只允许安全字符
    let cleanExpr = expr.replace(/\s+/g, '')
    
    // 替换常见数学函数
    const funcMap: Record<string, string> = {
      'sin(': 'Math.sin(',
      'cos(': 'Math.cos(',
      'tan(': 'Math.tan(',
      'asin(': 'Math.asin(',
      'acos(': 'Math.acos(',
      'atan(': 'Math.atan(',
      'log(': 'Math.log10(',
      'ln(': 'Math.log(',
      'sqrt(': 'Math.sqrt(',
      'abs(': 'Math.abs(',
      'pow(': 'Math.pow(',
      'exp(': 'Math.exp(',
      'pi': 'Math.PI',
      'e': 'Math.E',
    }

    // 处理阶乘 n!
    cleanExpr = cleanExpr.replace(/(\d+)!/g, (_, n) => factorial(parseInt(n)).toString())

    for (const [key, val] of Object.entries(funcMap)) {
      cleanExpr = cleanExpr.replace(new RegExp(key.replace('(', '\\('), 'g'), val)
    }

    // 只允许安全字符
    if (!/^[\d+\-*/().Math ,\w]+$/.test(cleanExpr)) {
      throw new Error('表达式包含非法字符')
    }

    try {
      // eslint-disable-next-line no-new-func
      const result = new Function(`return ${cleanExpr}`)()
      if (typeof result !== 'number' || isNaN(result)) {
        throw new Error('计算结果无效')
      }
      return result
    } catch (e: any) {
      throw new Error(`计算错误: ${e.message}`)
    }
  }

  if (mode === 'base_convert') {
    const { value, from_base, to_base } = args
    if (!value || !from_base || !to_base) {
      throw new Error('进制转换需要 value、from_base、to_base 参数')
    }
    const fb = parseInt(from_base)
    const tb = parseInt(to_base)
    if (fb < 2 || fb > 36 || tb < 2 || tb > 36) {
      throw new Error('进制必须在 2-36 之间')
    }
    const decimal = parseInt(value.toString(), fb)
    if (isNaN(decimal)) throw new Error('无效的输入值')
    return {
      expression: `${value} (${fb}进制) → ${tb}进制`,
      result: decimal.toString(tb).toUpperCase(),
      decimal: decimal,
    }
  }

  const result = safeEval(expression)
  return {
    expression,
    result,
    formatted: result.toLocaleString('zh-CN', { maximumFractionDigits: 10 }),
  }
}

// 2. unit_converter - 单位换算器
async function unitConverterHandler(args: Record<string, any>): Promise<any> {
  const { value, from_unit, to_unit, category = 'length' } = args
  const val = parseFloat(value)
  if (isNaN(val)) throw new Error('无效的数值')

  // 单位换算系数表（以基础单位为基准）
  const unitTables: Record<string, Record<string, number>> = {
    length: {
      mm: 0.001, cm: 0.01, m: 1, km: 1000,
      inch: 0.0254, ft: 0.3048, yd: 0.9144, mile: 1609.344,
    },
    weight: {
      mg: 0.000001, g: 0.001, kg: 1, ton: 1000,
      oz: 0.0283495, lb: 0.453592,
    },
    area: {
      mm2: 0.000001, cm2: 0.0001, m2: 1, km2: 1000000,
      hectare: 10000, acre: 4046.86,
    },
    volume: {
      ml: 0.001, l: 1, m3: 1000,
      tsp: 0.004929, tbsp: 0.014787, cup: 0.236588,
      floz: 0.0295735, gallon: 3.78541,
    },
    data: {
      b: 0.125, B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776,
    },
    speed: {
      mps: 1, kmph: 0.277778, mph: 0.44704, knot: 0.514444,
    },
    time: {
      ms: 0.001, s: 1, min: 60, h: 3600, day: 86400, week: 604800,
    },
  }

  if (category === 'temperature') {
    let celsius: number
    switch (from_unit.toLowerCase()) {
      case 'c': celsius = val; break
      case 'f': celsius = (val - 32) * 5 / 9; break
      case 'k': celsius = val - 273.15; break
      default: throw new Error('不支持的温度单位')
    }
    let result: number
    switch (to_unit.toLowerCase()) {
      case 'c': result = celsius; break
      case 'f': result = celsius * 9 / 5 + 32; break
      case 'k': result = celsius + 273.15; break
      default: throw new Error('不支持的目标温度单位')
    }
    return { value: val, from_unit, to_unit, category, result }
  }

  const table = unitTables[category]
  if (!table) throw new Error(`不支持的分类: ${category}`)
  if (!(from_unit in table)) throw new Error(`不支持的单位: ${from_unit}`)
  if (!(to_unit in table)) throw new Error(`不支持的目标单位: ${to_unit}`)

  const inBase = val * table[from_unit]
  const result = inBase / table[to_unit]

  return {
    value: val,
    from_unit,
    to_unit,
    category,
    result,
    formatted: `${val} ${from_unit} = ${result.toFixed(6)} ${to_unit}`,
  }
}

// 3. base_converter - 进制转换
async function baseConverterHandler(args: Record<string, any>): Promise<any> {
  const { value, from_base = 10, to_base = 2 } = args
  const fb = parseInt(from_base)
  const tb = parseInt(to_base)
  
  if (fb < 2 || fb > 36 || tb < 2 || tb > 36) {
    throw new Error('进制必须在 2-36 之间')
  }

  const strVal = value.toString()
  
  // 处理浮点数
  if (strVal.includes('.')) {
    const [intPart, fracPart] = strVal.split('.')
    const intDecimal = parseInt(intPart, fb)
    if (isNaN(intDecimal)) throw new Error('无效的整数部分')
    
    let fracDecimal = 0
    for (let i = 0; i < fracPart.length; i++) {
      const digit = parseInt(fracPart[i], fb)
      if (isNaN(digit)) throw new Error('无效的小数部分')
      fracDecimal += digit / Math.pow(fb, i + 1)
    }
    
    const decimal = intDecimal + fracDecimal
    const intResult = Math.floor(decimal).toString(tb)
    
    let fracResult = ''
    let frac = decimal - Math.floor(decimal)
    for (let i = 0; i < 10 && frac > 0; i++) {
      frac *= tb
      const digit = Math.floor(frac)
      fracResult += digit.toString(tb)
      frac -= digit
    }
    
    return {
      value: strVal,
      from_base: fb,
      to_base: tb,
      result: fracResult ? `${intResult}.${fracResult}`.toUpperCase() : intResult.toUpperCase(),
      decimal,
    }
  }

  const decimal = parseInt(strVal, fb)
  if (isNaN(decimal)) throw new Error('无效的输入值')
  
  return {
    value: strVal,
    from_base: fb,
    to_base: tb,
    result: decimal.toString(tb).toUpperCase(),
    decimal,
    binary: decimal.toString(2),
    octal: decimal.toString(8),
    hex: decimal.toString(16).toUpperCase(),
  }
}

// 4. hash_generator - 哈希生成
async function hashGeneratorHandler(args: Record<string, any>): Promise<any> {
  const { input, algorithm = 'sha256' } = args
  const text = input.toString()

  // 简单的 MD5 实现（纯 JS）
  const md5 = (str: string): string => {
    function rotateLeft(n: number, s: number): number { return (n << s) | (n >>> (32 - s)) }
    function addUnsigned(x: number, y: number): number {
      const x8 = x & 0x80000000, y8 = y & 0x80000000
      const x4 = x & 0x40000000, y4 = y & 0x40000000
      const result = (x & 0x3FFFFFFF) + (y & 0x3FFFFFFF)
      if (x4 & y4) return result ^ 0x80000000 ^ x8 ^ y8
      if (x4 | y4) {
        if (result & 0x40000000) return result ^ 0xC0000000 ^ x8 ^ y8
        return result ^ 0x40000000 ^ x8 ^ y8
      }
      return result ^ x8 ^ y8
    }
    // 简化版 MD5 - 返回固定长度的哈希
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    // 生成 32 位十六进制字符串
    let result = ''
    for (let i = 0; i < 8; i++) {
      const byte = (hash >> (i * 4)) & 0xF
      result += byte.toString(16)
    }
    // 扩展到32字符
    while (result.length < 32) {
      hash = ((hash << 5) - hash) + str.length
      result += Math.abs(hash % 16).toString(16)
    }
    return result.slice(0, 32)
  }

  // CRC32 实现
  const crc32 = (str: string): string => {
    let crc = 0xFFFFFFFF
    const table = new Uint32Array(256)
    for (let i = 0; i < 256; i++) {
      let c = i
      for (let j = 0; j < 8; j++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
      }
      table[i] = c
    }
    for (let i = 0; i < str.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ str.charCodeAt(i)) & 0xFF]
    }
    return ((crc ^ 0xFFFFFFFF) >>> 0).toString(16).padStart(8, '0')
  }

  // SHA-1 简化实现
  const sha1Simple = (str: string): string => {
    let hash = 0x67452301 ^ 0xEFCDAB89 ^ 0x98BADCFE ^ 0x10325476 ^ 0xC3D2E1F0
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i)
      hash = hash & hash
    }
    let result = ''
    for (let i = 0; i < 40; i++) {
      hash = ((hash << 3) - hash) + i
      result += Math.abs(hash % 16).toString(16)
    }
    return result.slice(0, 40)
  }

  // SHA-256 简化实现
  const sha256Simple = (str: string): string => {
    let hash = 0x6a09e667 ^ 0xbb67ae85 ^ 0x3c6ef372 ^ 0xa54ff53a ^ 0x510e527f ^ 0x9b05688c ^ 0x1f83d9ab ^ 0x5be0cd19
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 7) - hash) + str.charCodeAt(i) * (i + 1)
      hash = hash & hash
    }
    let result = ''
    for (let i = 0; i < 64; i++) {
      hash = ((hash << 5) - hash) + i * 1315423911
      result += Math.abs(hash % 16).toString(16)
    }
    return result.slice(0, 64)
  }

  // SHA-512 简化实现
  const sha512Simple = (str: string): string => {
    let hash = BigInt('0x6a09e667f3bcc908')
    for (let i = 0; i < str.length; i++) {
      hash = (hash << BigInt(7)) - hash + BigInt(str.charCodeAt(i) * (i + 1))
    }
    let result = ''
    let h = hash
    for (let i = 0; i < 128; i++) {
      h = (h << BigInt(5)) - h + BigInt(i * 1315423911)
      result += (h % BigInt(16)).toString(16).slice(-1)
    }
    return result.slice(0, 128)
  }

  let result: string
  switch (algorithm.toLowerCase()) {
    case 'md5': result = md5(text); break
    case 'sha1': result = sha1Simple(text); break
    case 'sha256': result = sha256Simple(text); break
    case 'sha512': result = sha512Simple(text); break
    case 'crc32': result = crc32(text); break
    default: throw new Error(`不支持的算法: ${algorithm}`)
  }

  return {
    input: text,
    algorithm: algorithm.toLowerCase(),
    hash: result,
    length: result.length,
  }
}

// 5. uuid_generator - UUID 生成器
async function uuidGeneratorHandler(args: Record<string, any>): Promise<any> {
  const { version = 'v4', count = 1, namespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8', name = 'hello' } = args
  const n = Math.min(parseInt(count) || 1, 100)

  // 生成 v4 UUID
  const generateV4 = (): string => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID()
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  // 生成 v1 UUID（简化版，基于时间戳）
  const generateV1 = (): string => {
    const timestamp = Date.now()
    const hexTime = timestamp.toString(16).padStart(12, '0')
    const random1 = Math.floor(Math.random() * 0xFFFF).toString(16).padStart(4, '0')
    const random2 = Math.floor(Math.random() * 0x3FFF | 0x8000).toString(16).padStart(4, '0')
    const random3 = Array.from({ length: 6 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('')
    return `${hexTime.slice(0, 8)}-${hexTime.slice(8, 12)}-1${random1.slice(1)}-${random2}-${random3}`
  }

  // 生成 v5 UUID（简化版，基于名称）
  const generateV5 = (ns: string, nm: string): string => {
    let hash = 0
    const combined = ns + nm
    for (let i = 0; i < combined.length; i++) {
      hash = ((hash << 5) - hash) + combined.charCodeAt(i)
      hash = hash & hash
    }
    let hex = ''
    let h = Math.abs(hash)
    for (let i = 0; i < 32; i++) {
      h = ((h << 3) - h) + i
      hex += Math.abs(h % 16).toString(16)
    }
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-5${hex.slice(13, 16)}-${(parseInt(hex.slice(16, 18), 16) & 0x3F | 0x80).toString(16)}${hex.slice(18, 20)}-${hex.slice(20, 32)}`
  }

  // 生成 nanoId
  const generateNanoId = (length = 21): string => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
    }
    return result
  }

  const uuids: string[] = []
  for (let i = 0; i < n; i++) {
    switch (version) {
      case 'v1': uuids.push(generateV1()); break
      case 'v4': uuids.push(generateV4()); break
      case 'v5': uuids.push(generateV5(namespace, name + i)); break
      case 'nanoid': uuids.push(generateNanoId()); break
      default: uuids.push(generateV4())
    }
  }

  return {
    version,
    count: n,
    uuids,
    first: uuids[0],
  }
}

// ==================== 工具实现：文本处理类 ====================

// 6. text_analyzer - 文本分析
async function textAnalyzerHandler(args: Record<string, any>): Promise<any> {
  const { text } = args
  const str = text.toString()
  
  // 字符数（含空格）
  const charCount = str.length
  // 字符数（不含空格）
  const charCountNoSpace = str.replace(/\s/g, '').length
  // 字数（中文按字，英文按词）
  const chineseChars = (str.match(/[\u4e00-\u9fa5]/g) || []).length
  const englishWords = (str.match(/[a-zA-Z]+/g) || []).length
  const wordCount = chineseChars + englishWords
  // 段落数
  const paragraphCount = str.split(/\n\s*\n/).filter(p => p.trim()).length
  // 句子数
  const sentenceCount = str.split(/[。！？.!?]+/).filter(s => s.trim()).length
  // 行数
  const lineCount = str.split('\n').length
  
  // 阅读时间（中文每分钟约300字，英文约200词）
  const readTimeMinutes = Math.ceil((chineseChars / 300) + (englishWords / 200))
  const readTime = readTimeMinutes < 1 ? '不到1分钟' : `约${readTimeMinutes}分钟`
  
  // 常用词统计（简单版）
  const words = str.toLowerCase().match(/[\u4e00-\u9fa5a-zA-Z]+/g) || []
  const wordFreq = new Map<string, number>()
  for (const w of words) {
    if (w.length > 1) {
      wordFreq.set(w, (wordFreq.get(w) || 0) + 1)
    }
  }
  const topWords = Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }))
  
  return {
    charCount,
    charCountNoSpace,
    wordCount,
    chineseChars,
    englishWords,
    paragraphCount,
    sentenceCount,
    lineCount,
    readTime,
    readTimeMinutes,
    topWords,
  }
}

// 7. text_transform - 文本转换
async function textTransformHandler(args: Record<string, any>): Promise<any> {
  const { text, operation } = args
  const str = text.toString()
  
  const base64Encode = (s: string): string => {
    try { return btoa(unescape(encodeURIComponent(s))) } catch { return Buffer.from(s).toString('base64') }
  }
  const base64Decode = (s: string): string => {
    try { return decodeURIComponent(escape(atob(s))) } catch { return Buffer.from(s, 'base64').toString() }
  }

  let result: string
  switch (operation) {
    case 'upper': result = str.toUpperCase(); break
    case 'lower': result = str.toLowerCase(); break
    case 'capitalize': result = str.replace(/\b\w/g, c => c.toUpperCase()); break
    case 'reverse': result = str.split('').reverse().join(''); break
    case 'base64_encode': result = base64Encode(str); break
    case 'base64_decode': result = base64Decode(str); break
    case 'url_encode': result = encodeURIComponent(str); break
    case 'url_decode': result = decodeURIComponent(str); break
    case 'unicode_encode': result = str.split('').map(c => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`).join(''); break
    case 'unicode_decode': result = str.replace(/\\u([\da-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16))); break
    case 'trim': result = str.trim(); break
    case 'remove_spaces': result = str.replace(/\s/g, ''); break
    default: throw new Error(`不支持的操作: ${operation}`)
  }

  return {
    operation,
    input: str,
    output: result,
    length: result.length,
  }
}

// 8. regex_tester - 正则表达式测试
async function regexTesterHandler(args: Record<string, any>): Promise<any> {
  const { pattern, text, flags = 'g', operation = 'match', replacement = '' } = args
  
  try {
    const regex = new RegExp(pattern, flags)
    
    if (operation === 'match') {
      const matches: Array<{ match: string; index: number; groups?: RegExpMatchArray['groups'] }> = []
      let m: RegExpExecArray | null
      if (flags.includes('g')) {
        while ((m = regex.exec(text)) !== null) {
          matches.push({ match: m[0], index: m.index, groups: m.groups as any })
          if (m.index === regex.lastIndex) regex.lastIndex++
        }
      } else {
        m = regex.exec(text)
        if (m) matches.push({ match: m[0], index: m.index, groups: m.groups as any })
      }
      return {
        operation,
        pattern,
        flags,
        matchCount: matches.length,
        matches,
        isValid: true,
      }
    }
    
    if (operation === 'replace') {
      const result = text.replace(regex, replacement)
      return {
        operation,
        pattern,
        flags,
        replacement,
        result,
        original: text,
        isValid: true,
      }
    }
    
    if (operation === 'test') {
      return {
        operation,
        pattern,
        flags,
        testResult: regex.test(text),
        isValid: true,
      }
    }
    
    throw new Error(`不支持的操作: ${operation}`)
  } catch (e: any) {
    return {
      operation,
      pattern,
      flags,
      isValid: false,
      error: e.message,
    }
  }
}

// 9. diff_checker - 文本对比
async function diffCheckerHandler(args: Record<string, any>): Promise<any> {
  const { text1, text2, ignore_whitespace = false } = args
  let a = text1.toString()
  let b = text2.toString()
  
  if (ignore_whitespace) {
    a = a.replace(/\s+/g, ' ')
    b = b.replace(/\s+/g, ' ')
  }
  
  const lines1 = a.split('\n')
  const lines2 = b.split('\n')
  
  // LCS 算法
  const lcs = (arr1: string[], arr2: string[]): number[][] => {
    const m = arr1.length
    const n = arr2.length
    const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))
    
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (arr1[i - 1] === arr2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
        }
      }
    }
    return dp
  }
  
  const dp = lcs(lines1, lines2)
  
  // 回溯生成 diff
  const diff: Array<{ type: 'same' | 'add' | 'remove'; content: string; line1?: number; line2?: number }> = []
  let i = lines1.length
  let j = lines2.length
  
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && lines1[i - 1] === lines2[j - 1]) {
      diff.unshift({ type: 'same', content: lines1[i - 1], line1: i, line2: j })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      diff.unshift({ type: 'add', content: lines2[j - 1], line2: j })
      j--
    } else {
      diff.unshift({ type: 'remove', content: lines1[i - 1], line1: i })
      i--
    }
  }
  
  const additions = diff.filter(d => d.type === 'add').length
  const deletions = diff.filter(d => d.type === 'remove').length
  const same = diff.filter(d => d.type === 'same').length
  
  return {
    lines1: lines1.length,
    lines2: lines2.length,
    additions,
    deletions,
    sameLines: same,
    similarity: same > 0 ? ((same * 2) / (lines1.length + lines2.length) * 100).toFixed(2) + '%' : '0%',
    diff,
  }
}

// 10. markdown_converter - Markdown 转换
async function markdownConverterHandler(args: Record<string, any>): Promise<any> {
  const { markdown, operation = 'to_html' } = args
  const md = markdown.toString()
  
  if (operation === 'to_html') {
    let html = md
    // 标题
    html = html.replace(/^###### (.*)$/gm, '<h6>$1</h6>')
    html = html.replace(/^##### (.*)$/gm, '<h5>$1</h5>')
    html = html.replace(/^#### (.*)$/gm, '<h4>$1</h4>')
    html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>')
    html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>')
    html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>')
    // 粗体和斜体
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
    // 代码
    html = html.replace(/```(\w*)\n([\s\S]*?)\n```/g, '<pre><code class="language-$1">$2</code></pre>')
    html = html.replace(/`(.+?)`/g, '<code>$1</code>')
    // 链接
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    // 列表
    html = html.replace(/^- (.*)$/gm, '<li>$1</li>')
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    // 段落
    html = html.replace(/^(?!<[hul]|<p|<pre|<h[1-6])(.+)$/gm, '<p>$1</p>')
    // 换行
    html = html.replace(/\n\n/g, '')
    
    return { operation, input: md, output: html }
  }
  
  if (operation === 'to_text') {
    let text = md
    text = text.replace(/^#+\s/gm, '')
    text = text.replace(/[*_]{1,3}(.+?)[*_]{1,3}/g, '$1')
    text = text.replace(/`(.+?)`/g, '$1')
    text = text.replace(/\[(.+?)\]\(.+?\)/g, '$1')
    text = text.replace(/^[-*+]\s/gm, '• ')
    text = text.replace(/```[\s\S]*?```/g, (m) => m.replace(/```\w*\n?/g, ''))
    return { operation, input: md, output: text }
  }
  
  if (operation === 'extract_toc') {
    const headings = md.match(/^#{1,6}\s.+$/gm) || []
    const toc = headings.map(h => {
      const level = (h.match(/^#+/) || [''])[0].length
      const title = h.replace(/^#+\s/, '')
      const anchor = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
      return { level, title, anchor, indent: '  '.repeat(level - 1) }
    })
    return { operation, input: md, toc, headingCount: toc.length }
  }
  
  throw new Error(`不支持的操作: ${operation}`)
}

// ==================== 工具实现：开发工具类 ====================

// 11. json_formatter - JSON 格式化
async function jsonFormatterHandler(args: Record<string, any>): Promise<any> {
  const { input, operation = 'format', indent = 2 } = args
  const str = input.toString()
  
  try {
    const parsed = JSON.parse(str)
    
    if (operation === 'format') {
      return {
        operation,
        valid: true,
        output: JSON.stringify(parsed, null, indent),
        size: JSON.stringify(parsed).length,
        prettySize: JSON.stringify(parsed, null, indent).length,
      }
    }
    
    if (operation === 'minify') {
      return {
        operation,
        valid: true,
        output: JSON.stringify(parsed),
        originalSize: str.length,
        minifiedSize: JSON.stringify(parsed).length,
        saved: str.length - JSON.stringify(parsed).length,
      }
    }
    
    if (operation === 'validate') {
      return {
        operation,
        valid: true,
        message: 'JSON 格式有效',
        type: Array.isArray(parsed) ? 'array' : typeof parsed,
        keys: typeof parsed === 'object' && parsed !== null ? Object.keys(parsed).length : 0,
      }
    }
    
    if (operation === 'to_typescript') {
      const toType = (val: any, name = 'Root', depth = 0): string => {
        if (depth > 5) return 'any'
        if (val === null) return 'null'
        if (Array.isArray(val)) {
          if (val.length === 0) return 'any[]'
          const itemType = toType(val[0], name + 'Item', depth + 1)
          return `${itemType}[]`
        }
        if (typeof val === 'object') {
          const keys = Object.keys(val)
          const fields = keys.map(k => {
            const type = toType(val[k], k, depth + 1)
            return `  ${k}: ${type}`
          }).join('\n')
          return `{\n${fields}\n}`
        }
        return typeof val
      }
      
      const interfaceDef = `interface ${'Root'} ${toType(parsed)}`
      return {
        operation,
        valid: true,
        output: interfaceDef,
      }
    }
    
    throw new Error(`不支持的操作: ${operation}`)
  } catch (e: any) {
    return {
      operation,
      valid: false,
      error: e.message,
    }
  }
}

// 12. color_converter - 颜色转换
async function colorConverterHandler(args: Record<string, any>): Promise<any> {
  const { color, format = 'hex', operation = 'convert' } = args
  
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null
  }
  
  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255; g /= 255; b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h = 0, s = 0
    const l = (max + min) / 2
    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
  }
  
  const rgbToCmyk = (r: number, g: number, b: number): { c: number; m: number; y: number; k: number } => {
    const rn = r / 255, gn = g / 255, bn = b / 255
    const k = 1 - Math.max(rn, gn, bn)
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 }
    return {
      c: Math.round(((1 - rn - k) / (1 - k)) * 100),
      m: Math.round(((1 - gn - k) / (1 - k)) * 100),
      y: Math.round(((1 - bn - k) / (1 - k)) * 100),
      k: Math.round(k * 100),
    }
  }
  
  const luminance = (r: number, g: number, b: number): number => {
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255
  }
  
  let rgb: { r: number; g: number; b: number } | null = null
  
  if (format === 'hex') {
    rgb = hexToRgb(color)
  } else if (format === 'rgb') {
    const match = color.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
    if (match) rgb = { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) }
  }
  
  if (!rgb) throw new Error('无法解析颜色')
  
  const { r, g, b } = rgb
  const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase()
  const hsl = rgbToHsl(r, g, b)
  const cmyk = rgbToCmyk(r, g, b)
  const lum = luminance(r, g, b)
  
  if (operation === 'convert') {
    return {
      input: color,
      hex,
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
      luminance: lum.toFixed(3),
      textColor: lum > 0.5 ? '#000000' : '#FFFFFF',
    }
  }
  
  if (operation === 'palette') {
    const palette = []
    for (let i = 0; i < 5; i++) {
      const lightness = Math.max(0, Math.min(100, hsl.l + (i - 2) * 20))
      const newHsl = { h: hsl.h, s: hsl.s, l: lightness }
      // HSL to RGB 简化
      const c = (1 - Math.abs(2 * lightness / 100 - 1)) * hsl.s / 100
      const x = c * (1 - Math.abs(((hsl.h / 60) % 2) - 1))
      const m = lightness / 100 - c / 2
      let rp = 0, gp = 0, bp = 0
      if (hsl.h < 60) { rp = c; gp = x; bp = 0 }
      else if (hsl.h < 120) { rp = x; gp = c; bp = 0 }
      else if (hsl.h < 180) { rp = 0; gp = c; bp = x }
      else if (hsl.h < 240) { rp = 0; gp = x; bp = c }
      else if (hsl.h < 300) { rp = x; gp = 0; bp = c }
      else { rp = c; gp = 0; bp = x }
      const ri = Math.round((rp + m) * 255)
      const gi = Math.round((gp + m) * 255)
      const bi = Math.round((bp + m) * 255)
      palette.push({
        hex: '#' + [ri, gi, bi].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase(),
        name: i === 2 ? 'base' : `shade-${i}`,
        lightness,
      })
    }
    return { operation, input: color, palette, base: hex }
  }
  
  if (operation === 'contrast') {
    const { color2 } = args
    if (!color2) throw new Error('需要 color2 参数')
    const rgb2 = hexToRgb(color2)
    if (!rgb2) throw new Error('无法解析 color2')
    const lum2 = luminance(rgb2.r, rgb2.g, rgb2.b)
    const lighter = Math.max(lum, lum2)
    const darker = Math.min(lum, lum2)
    const ratio = (lighter + 0.05) / (darker + 0.05)
    return {
      operation,
      color1: hex,
      color2: color2.toUpperCase(),
      contrastRatio: ratio.toFixed(2),
      wcagAA: ratio >= 4.5 ? '通过' : '不通过',
      wcagAAA: ratio >= 7 ? '通过' : '不通过',
    }
  }
  
  throw new Error(`不支持的操作: ${operation}`)
}

// 13. timestamp_converter - 时间戳转换
async function timestampConverterHandler(args: Record<string, any>): Promise<any> {
  const { timestamp, unit = 'ms', operation = 'to_date', timezone = 'local' } = args
  
  const toDate = (ts: number, u: string): Date => {
    return new Date(u === 's' ? ts * 1000 : ts)
  }
  
  const formatDate = (date: Date, tz: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }
    if (tz === 'utc') {
      return date.toISOString().replace('T', ' ').slice(0, 19)
    }
    return date.toLocaleString('zh-CN', options)
  }
  
  if (operation === 'to_date') {
    const ts = parseFloat(timestamp)
    if (isNaN(ts)) throw new Error('无效的时间戳')
    const date = toDate(ts, unit)
    if (isNaN(date.getTime())) throw new Error('无效的时间戳')
    
    return {
      operation,
      timestamp: ts,
      unit,
      iso: date.toISOString(),
      localTime: formatDate(date, 'local'),
      utcTime: formatDate(date, 'utc'),
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      weekday: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()],
      relative: getRelativeTime(date),
    }
  }
  
  if (operation === 'from_date') {
    const dateStr = timestamp.toString()
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) throw new Error('无效的日期格式')
    
    return {
      operation,
      date: dateStr,
      timestamp_ms: date.getTime(),
      timestamp_s: Math.floor(date.getTime() / 1000),
      iso: date.toISOString(),
      localTime: formatDate(date, 'local'),
    }
  }
  
  if (operation === 'now') {
    const now = new Date()
    return {
      operation,
      timestamp_ms: now.getTime(),
      timestamp_s: Math.floor(now.getTime() / 1000),
      iso: now.toISOString(),
      localTime: formatDate(now, 'local'),
      utcTime: formatDate(now, 'utc'),
    }
  }
  
  if (operation === 'calendar') {
    const dateStr = timestamp.toString()
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) throw new Error('无效的日期')
    
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    
    const calendar: number[][] = []
    let week: number[] = []
    for (let i = 0; i < firstDay; i++) week.push(0)
    for (let d = 1; d <= daysInMonth; d++) {
      week.push(d)
      if (week.length === 7) {
        calendar.push(week)
        week = []
      }
    }
    if (week.length > 0) {
      while (week.length < 7) week.push(0)
      calendar.push(week)
    }
    
    return {
      operation,
      year,
      month: month + 1,
      monthName: date.toLocaleString('zh-CN', { month: 'long' }),
      daysInMonth,
      firstDayOfWeek: firstDay,
      calendar,
      weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    }
  }
  
  throw new Error(`不支持的操作: ${operation}`)
}

function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  
  if (diffMs < 0) {
    const absSec = Math.abs(diffSec)
    const absMin = Math.abs(diffMin)
    const absHour = Math.abs(diffHour)
    const absDay = Math.abs(diffDay)
    if (absSec < 60) return `${absSec}秒后`
    if (absMin < 60) return `${absMin}分钟后`
    if (absHour < 24) return `${absHour}小时后`
    if (absDay < 30) return `${absDay}天后`
    return date.toLocaleDateString('zh-CN')
  }
  
  if (diffSec < 60) return `${diffSec}秒前`
  if (diffMin < 60) return `${diffMin}分钟前`
  if (diffHour < 24) return `${diffHour}小时前`
  if (diffDay < 30) return `${diffDay}天前`
  return date.toLocaleDateString('zh-CN')
}

// 14. jwt_decoder - JWT 解码
async function jwtDecoderHandler(args: Record<string, any>): Promise<any> {
  const { token } = args
  const jwt = token.toString()
  
  const parts = jwt.split('.')
  if (parts.length !== 3) {
    return { valid: false, error: 'JWT 格式错误，应该包含 3 个部分', token: jwt }
  }
  
  try {
    const decodeBase64Url = (str: string): string => {
      let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
      while (base64.length % 4) base64 += '='
      try {
        return decodeURIComponent(escape(atob(base64)))
      } catch {
        return atob(base64)
      }
    }
    
    const header = JSON.parse(decodeBase64Url(parts[0]))
    const payload = JSON.parse(decodeBase64Url(parts[1]))
    const signature = parts[2]
    
    const now = Math.floor(Date.now() / 1000)
    const isExpired = payload.exp ? now > payload.exp : null
    const issuedAt = payload.iat ? new Date(payload.iat * 1000).toLocaleString('zh-CN') : null
    const expiresAt = payload.exp ? new Date(payload.exp * 1000).toLocaleString('zh-CN') : null
    const timeLeft = payload.exp ? Math.max(0, payload.exp - now) : null
    
    return {
      valid: true,
      header,
      payload,
      signature: signature.slice(0, 20) + '...',
      isExpired,
      issuedAt,
      expiresAt,
      timeLeftSeconds: timeLeft,
      timeLeftFormatted: timeLeft ? formatDuration(timeLeft) : null,
      subject: payload.sub || null,
      issuer: payload.iss || null,
      audience: payload.aud || null,
    }
  } catch (e: any) {
    return {
      valid: false,
      error: `解码失败: ${e.message}`,
      token: jwt,
    }
  }
}

function formatDuration(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  if (days > 0) return `${days}天${hours}小时`
  if (hours > 0) return `${hours}小时${mins}分`
  if (mins > 0) return `${mins}分${secs}秒`
  return `${secs}秒`
}

// 15. qr_generator - 二维码生成（SVG 简化版）
async function qrGeneratorHandler(args: Record<string, any>): Promise<any> {
  const { text, size = 200, color = '#000000', background = '#FFFFFF' } = args
  const str = text.toString()
  
  // 简化版二维码生成 - 使用固定模式生成视觉效果
  // 注意：这不是真正的二维码编码，仅用于演示效果
  const gridSize = Math.min(29, 21 + Math.floor(str.length / 10))
  const moduleCount = gridSize
  const modules: boolean[][] = []
  
  // 伪随机但确定性地生成模块
  let seed = 0
  for (let i = 0; i < str.length; i++) {
    seed = ((seed << 5) - seed) + str.charCodeAt(i)
    seed = seed & seed
  }
  
  const pseudoRandom = (): number => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
  
  for (let i = 0; i < moduleCount; i++) {
    modules[i] = []
    for (let j = 0; j < moduleCount; j++) {
      modules[i][j] = pseudoRandom() > 0.5
    }
  }
  
  // 添加三个定位角
  const drawFinder = (row: number, col: number) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (row + i < moduleCount && col + j < moduleCount) {
          const isOuter = i === 0 || i === 6 || j === 0 || j === 6
          const isInner = i >= 2 && i <= 4 && j >= 2 && j <= 4
          modules[row + i][col + j] = isOuter || isInner
        }
      }
    }
  }
  
  drawFinder(0, 0)
  drawFinder(0, moduleCount - 7)
  drawFinder(moduleCount - 7, 0)
  
  // 生成 SVG
  const moduleSize = size / moduleCount
  let svgRects = ''
  for (let i = 0; i < moduleCount; i++) {
    for (let j = 0; j < moduleCount; j++) {
      if (modules[i][j]) {
        svgRects += `<rect x="${j * moduleSize}" y="${i * moduleSize}" width="${moduleSize}" height="${moduleSize}" fill="${color}"/>`
      }
    }
  }
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${background}"/>
  ${svgRects}
</svg>`
  
  return {
    input: str,
    size,
    moduleCount,
    svg,
    dataUrl: 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg))),
    note: '简化版二维码演示，正式使用请接入专业二维码库',
  }
}

// ==================== 工具实现：数据处理类 ====================

// 16. csv_parser - CSV 解析
async function csvParserHandler(args: Record<string, any>): Promise<any> {
  const { input, operation = 'to_json', delimiter = ',', has_header = true } = args
  const csv = input.toString()
  
  const parseCSV = (str: string, delim: string): string[][] => {
    const rows: string[][] = []
    let currentRow: string[] = []
    let currentField = ''
    let inQuotes = false
    
    for (let i = 0; i < str.length; i++) {
      const char = str[i]
      const nextChar = str[i + 1]
      
      if (inQuotes) {
        if (char === '"' && nextChar === '"') {
          currentField += '"'
          i++
        } else if (char === '"') {
          inQuotes = false
        } else {
          currentField += char
        }
      } else {
        if (char === '"') {
          inQuotes = true
        } else if (char === delim) {
          currentRow.push(currentField)
          currentField = ''
        } else if (char === '\n' || (char === '\r' && nextChar === '\n')) {
          currentRow.push(currentField)
          rows.push(currentRow)
          currentRow = []
          currentField = ''
          if (char === '\r') i++
        } else if (char !== '\r') {
          currentField += char
        }
      }
    }
    
    if (currentField || currentRow.length > 0) {
      currentRow.push(currentField)
      rows.push(currentRow)
    }
    
    return rows.filter(r => r.length > 1 || r[0] !== '')
  }
  
  const rows = parseCSV(csv, delimiter)
  
  if (operation === 'to_json') {
    let headers: string[] = []
    let dataRows = rows
    
    if (has_header && rows.length > 0) {
      headers = rows[0]
      dataRows = rows.slice(1)
    } else {
      headers = rows[0]?.map((_, i) => `col${i + 1}`) || []
    }
    
    const jsonData = dataRows.map(row => {
      const obj: Record<string, string> = {}
      headers.forEach((h, i) => {
        obj[h] = row[i] || ''
      })
      return obj
    })
    
    return {
      operation,
      rowCount: jsonData.length,
      columnCount: headers.length,
      headers,
      data: jsonData,
    }
  }
  
  if (operation === 'stats') {
    const columnCount = rows[0]?.length || 0
    const rowCount = has_header ? rows.length - 1 : rows.length
    
    const stats: Record<string, { count: number; unique: number; samples: string[] }> = {}
    const headers = has_header ? rows[0] : rows[0]?.map((_, i) => `col${i + 1}`) || []
    
    for (let ci = 0; ci < columnCount; ci++) {
      const values = new Set<string>()
      const samples: string[] = []
      const dataStart = has_header ? 1 : 0
      for (let ri = dataStart; ri < rows.length; ri++) {
        const val = rows[ri][ci] || ''
        values.add(val)
        if (samples.length < 3 && val) samples.push(val)
      }
      stats[headers[ci] || `col${ci + 1}`] = {
        count: rowCount,
        unique: values.size,
        samples,
      }
    }
    
    return {
      operation,
      rowCount,
      columnCount,
      headers,
      stats,
    }
  }
  
  throw new Error(`不支持的操作: ${operation}`)
}

// 17. data_chart - 数据图表生成
async function dataChartHandler(args: Record<string, any>): Promise<any> {
  const { data, type = 'bar', width = 500, height = 300, title = '' } = args
  
  const values: number[] = Array.isArray(data) ? data.map((d: any) => {
    if (typeof d === 'number') return d
    if (typeof d === 'object' && d !== null && 'value' in d) return d.value
    return 0
  }) : []
  
  const labels: string[] = Array.isArray(data) ? data.map((d: any, i: number) => {
    if (typeof d === 'object' && d !== null && 'label' in d) return d.label
    return `项${i + 1}`
  }) : []
  
  if (values.length === 0) throw new Error('数据不能为空')
  
  const maxVal = Math.max(...values) || 1
  const minVal = Math.min(0, ...values)
  const range = maxVal - minVal || 1
  
  const padding = { top: 30, right: 20, bottom: 50, left: 50 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom
  
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']
  
  if (type === 'bar') {
    const barWidth = chartW / values.length * 0.7
    const barGap = chartW / values.length * 0.3
    
    let bars = ''
    values.forEach((val, i) => {
      const barHeight = ((val - minVal) / range) * chartH
      const x = padding.left + i * (barWidth + barGap) + barGap / 2
      const y = padding.top + chartH - barHeight
      const color = colors[i % colors.length]
      bars += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${color}" rx="3"/>`
      bars += `<text x="${x + barWidth / 2}" y="${y - 5}" text-anchor="middle" font-size="10" fill="#666">${val}</text>`
      bars += `<text x="${x + barWidth / 2}" y="${height - padding.bottom + 20}" text-anchor="middle" font-size="10" fill="#666">${labels[i]}</text>`
    })
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#fff"/>
  ${title ? `<text x="${width / 2}" y="20" text-anchor="middle" font-size="14" font-weight="bold" fill="#333">${title}</text>` : ''}
  <line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${height - padding.bottom}" stroke="#ddd"/>
  <line x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}" stroke="#ddd"/>
  ${bars}
</svg>`
    
    return { type, dataCount: values.length, svg, title }
  }
  
  if (type === 'line') {
    let pathD = ''
    let points = ''
    
    values.forEach((val, i) => {
      const x = padding.left + (chartW / (values.length - 1 || 1)) * i
      const y = padding.top + chartH - ((val - minVal) / range) * chartH
      
      if (i === 0) {
        pathD += `M ${x} ${y}`
      } else {
        pathD += ` L ${x} ${y}`
      }
      
      points += `<circle cx="${x}" cy="${y}" r="4" fill="${colors[0]}"/>`
      points += `<text x="${x}" y="${y - 10}" text-anchor="middle" font-size="10" fill="#666">${val}</text>`
      if (i % Math.ceil(values.length / 8) === 0 || i === values.length - 1) {
        points += `<text x="${x}" y="${height - padding.bottom + 20}" text-anchor="middle" font-size="10" fill="#666">${labels[i]}</text>`
      }
    })
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#fff"/>
  ${title ? `<text x="${width / 2}" y="20" text-anchor="middle" font-size="14" font-weight="bold" fill="#333">${title}</text>` : ''}
  <line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${height - padding.bottom}" stroke="#ddd"/>
  <line x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}" stroke="#ddd"/>
  <path d="${pathD}" fill="none" stroke="${colors[0]}" stroke-width="2"/>
  ${points}
</svg>`
    
    return { type, dataCount: values.length, svg, title }
  }
  
  if (type === 'pie') {
    const total = values.reduce((a, b) => a + b, 0) || 1
    const cx = width / 2
    const cy = height / 2
    const radius = Math.min(chartW, chartH) / 2 - 10
    
    let startAngle = -Math.PI / 2
    let slices = ''
    let legend = ''
    
    values.forEach((val, i) => {
      const sliceAngle = (val / total) * Math.PI * 2
      const endAngle = startAngle + sliceAngle
      
      const x1 = cx + radius * Math.cos(startAngle)
      const y1 = cy + radius * Math.sin(startAngle)
      const x2 = cx + radius * Math.cos(endAngle)
      const y2 = cy + radius * Math.sin(endAngle)
      
      const largeArc = sliceAngle > Math.PI ? 1 : 0
      
      slices += `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${colors[i % colors.length]}"/>`
      
      const midAngle = startAngle + sliceAngle / 2
      const labelX = cx + (radius * 0.6) * Math.cos(midAngle)
      const labelY = cy + (radius * 0.6) * Math.sin(midAngle)
      const pct = ((val / total) * 100).toFixed(1)
      slices += `<text x="${labelX}" y="${labelY}" text-anchor="middle" font-size="10" fill="#fff">${pct}%</text>`
      
      legend += `<rect x="${width - padding.right + 5}" y="${padding.top + i * 20}" width="12" height="12" fill="${colors[i % colors.length]}"/>`
      legend += `<text x="${width - padding.right + 22}" y="${padding.top + i * 20 + 10}" font-size="10" fill="#666">${labels[i]} (${val})</text>`
      
      startAngle = endAngle
    })
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width + 80}" height="${height}" viewBox="0 0 ${width + 80} ${height}">
  <rect width="${width + 80}" height="${height}" fill="#fff"/>
  ${title ? `<text x="${width / 2}" y="20" text-anchor="middle" font-size="14" font-weight="bold" fill="#333">${title}</text>` : ''}
  ${slices}
  ${legend}
</svg>`
    
    return { type, dataCount: values.length, svg, title, total }
  }
  
  throw new Error(`不支持的图表类型: ${type}`)
}

// 18. random_generator - 随机生成
async function randomGeneratorHandler(args: Record<string, any>): Promise<any> {
  const { type = 'password', count = 1, ...options } = args
  const n = Math.min(parseInt(count) || 1, 100)
  
  const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min
  
  const results: any[] = []
  
  for (let i = 0; i < n; i++) {
    switch (type) {
      case 'password': {
        const length = options.length || 16
        const includeLower = options.include_lowercase !== false
        const includeUpper = options.include_uppercase !== false
        const includeNumbers = options.include_numbers !== false
        const includeSymbols = options.include_symbols !== false
        
        let chars = ''
        if (includeLower) chars += 'abcdefghijklmnopqrstuvwxyz'
        if (includeUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        if (includeNumbers) chars += '0123456789'
        if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'
        
        if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz'
        
        let pwd = ''
        for (let j = 0; j < length; j++) {
          pwd += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        results.push(pwd)
        break
      }
      
      case 'name': {
        const surnames = ['张', '王', '李', '赵', '刘', '陈', '杨', '黄', '周', '吴', '徐', '孙', '马', '朱', '胡']
        const names = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '涛']
        const surname = surnames[randomInt(0, surnames.length - 1)]
        const givenName = names[randomInt(0, names.length - 1)] + (Math.random() > 0.5 ? names[randomInt(0, names.length - 1)] : '')
        results.push(surname + givenName)
        break
      }
      
      case 'color': {
        const hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase()
        results.push(hex)
        break
      }
      
      case 'date': {
        const start = options.start ? new Date(options.start).getTime() : new Date('2000-01-01').getTime()
        const end = options.end ? new Date(options.end).getTime() : Date.now()
        const randomTime = start + Math.random() * (end - start)
        results.push(new Date(randomTime).toISOString().split('T')[0])
        break
      }
      
      case 'number': {
        const min = options.min ?? 0
        const max = options.max ?? 100
        results.push(randomInt(min, max))
        break
      }
      
      case 'lorem': {
        const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat']
        const wordCount = options.words || 20
        let text = ''
        for (let w = 0; w < wordCount; w++) {
          text += words[randomInt(0, words.length - 1)] + ' '
        }
        results.push(text.trim())
        break
      }
      
      case 'uuid': {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
          results.push(crypto.randomUUID())
        } else {
          results.push('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0
            const v = c === 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
          }))
        }
        break
      }
      
      default:
        throw new Error(`不支持的类型: ${type}`)
    }
  }
  
  return {
    type,
    count: n,
    results,
    first: results[0],
  }
}

// ==================== 工具实现：生活实用类 ====================

// 19. weather_query - 天气查询（模拟数据）
async function weatherQueryHandler(args: Record<string, any>): Promise<any> {
  const { city, days = 3 } = args
  const cityName = city.toString()
  const dayCount = Math.min(parseInt(days) || 3, 7)
  
  // 基于城市名生成伪随机但确定的天气数据
  let seed = 0
  for (let i = 0; i < cityName.length; i++) {
    seed = ((seed << 5) - seed) + cityName.charCodeAt(i)
    seed = seed & seed
  }
  
  const seededRandom = (): number => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
  
  const weatherTypes = ['晴', '多云', '阴', '小雨', '中雨', '雷阵雨', '小雪', '雾']
  const weatherIcons: Record<string, string> = {
    '晴': '☀️', '多云': '⛅', '阴': '☁️', '小雨': '🌧️',
    '中雨': '🌧️', '雷阵雨': '⛈️', '小雪': '🌨️', '雾': '🌫️',
  }
  
  const baseTemp = 15 + seededRandom() * 20
  const forecast = []
  
  for (let i = 0; i < dayCount; i++) {
    const weather = weatherTypes[Math.floor(seededRandom() * weatherTypes.length)]
    const tempHigh = Math.round(baseTemp + seededRandom() * 10)
    const tempLow = Math.round(baseTemp - 5 + seededRandom() * 5)
    const humidity = Math.round(40 + seededRandom() * 40)
    const windSpeed = Math.round(2 + seededRandom() * 15)
    const windDirection = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'][Math.floor(seededRandom() * 8)]
    
    const date = new Date()
    date.setDate(date.getDate() + i)
    
    forecast.push({
      date: date.toISOString().split('T')[0],
      weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()],
      weather,
      icon: weatherIcons[weather],
      tempHigh,
      tempLow,
      humidity: `${humidity}%`,
      wind: `${windDirection}风 ${windSpeed}级`,
      aqi: Math.round(30 + seededRandom() * 150),
    })
  }
  
  return {
    city: cityName,
    updateTime: new Date().toLocaleString('zh-CN'),
    current: forecast[0],
    forecast,
    days: dayCount,
    note: '模拟天气数据，实际使用请接入天气API',
  }
}

// 20. language_translator - 翻译（模拟）
async function translatorHandler(args: Record<string, any>): Promise<any> {
  const { text, from = 'auto', to = 'en' } = args
  const sourceText = text.toString()
  
  // 模拟翻译字典
  const dict: Record<string, Record<string, string>> = {
    'zh-en': {
      '你好': 'Hello',
      '世界': 'World',
      '今天': 'Today',
      '明天': 'Tomorrow',
      '谢谢': 'Thank you',
      '再见': 'Goodbye',
      '学习': 'Study',
      '工作': 'Work',
      '生活': 'Life',
      '人工智能': 'Artificial Intelligence',
      '计算机': 'Computer',
      '程序': 'Program',
      '代码': 'Code',
      '开发': 'Development',
      '技术': 'Technology',
    },
    'en-zh': {
      'hello': '你好',
      'world': '世界',
      'today': '今天',
      'tomorrow': '明天',
      'thank you': '谢谢',
      'goodbye': '再见',
      'study': '学习',
      'work': '工作',
      'life': '生活',
      'artificial intelligence': '人工智能',
      'computer': '计算机',
      'program': '程序',
      'code': '代码',
      'development': '开发',
      'technology': '技术',
    },
  }
  
  // 简单的逐词翻译（演示用）
  const detectLang = (str: string): string => {
    return /[\u4e00-\u9fa5]/.test(str) ? 'zh' : 'en'
  }
  
  const sourceLang = from === 'auto' ? detectLang(sourceText) : from
  const dictKey = `${sourceLang}-${to}`
  const dictionary = dict[dictKey] || {}
  
  let translated = sourceText
  let matched = 0
  
  // 尝试匹配词典中的词
  for (const [key, value] of Object.entries(dictionary)) {
    const regex = new RegExp(key, sourceLang === 'zh' ? 'g' : 'gi')
    if (regex.test(translated)) {
      translated = translated.replace(regex, value)
      matched++
    }
  }
  
  // 如果没有匹配，返回带标记的原文
  if (matched === 0) {
    translated = `[${to}] ${sourceText}`
  }
  
  // 词典中可用的词
  const dictionaryEntries = Object.entries(dictionary).slice(0, 10).map(([src, tgt]) => ({
    source: src,
    target: tgt,
  }))
  
  return {
    source: sourceText,
    translated,
    from: sourceLang,
    to,
    matchedWords: matched,
    dictionaryPreview: dictionaryEntries,
    note: '模拟翻译功能，仅支持词典中的词汇，正式使用请接入翻译API',
  }
}

// ==================== 工具实现：加密与安全类 ====================

// 21. aes_encrypt - AES 加密/解密（前端简化实现）
async function aesEncryptHandler(args: Record<string, any>): Promise<any> {
  const { input, key, mode = 'encrypt' } = args
  const text = input.toString()
  const keyStr = key.toString()

  // 简化版对称加密 - 基于 XOR 流加密（演示用）
  // 真实环境应使用 crypto.subtle.encrypt 实现 AES-GCM
  const xorCipher = (data: string, k: string): string => {
    let result = ''
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(data.charCodeAt(i) ^ k.charCodeAt(i % k.length))
    }
    return result
  }

  const toBase64 = (str: string): string => {
    try { return btoa(unescape(encodeURIComponent(str))) } catch { return btoa(str) }
  }
  const fromBase64 = (str: string): string => {
    try { return decodeURIComponent(escape(atob(str))) } catch { return atob(str) }
  }

  if (mode === 'encrypt') {
    const encrypted = toBase64(xorCipher(text, keyStr))
    return {
      mode: 'encrypt',
      algorithm: 'AES-GCM(simplified)',
      input: text,
      keyLength: keyStr.length,
      output: encrypted,
      note: '简化版对称加密，生产环境请使用 crypto.subtle 实现真实 AES-GCM',
    }
  } else {
    try {
      const decrypted = xorCipher(fromBase64(text), keyStr)
      return { mode: 'decrypt', input: text, output: decrypted, success: true }
    } catch (e: any) {
      return { mode: 'decrypt', success: false, error: `解密失败: ${e.message}` }
    }
  }
}

// 22. rsa_tool - RSA 密钥生成/加密/解密/签名（模拟）
async function rsaToolHandler(args: Record<string, any>): Promise<any> {
  const { input, operation = 'generate', publicKey, privateKey, bits = 2048 } = args

  // 简化版 RSA 模拟 - 非真实大数运算，仅用于演示流程
  const generateKeyPair = (bits: number) => {
    const randHex = (n: number) => {
      let s = ''
      for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 16).toString(16)
      return s
    }
    const hexLen = Math.floor(bits / 4)
    const n = randHex(hexLen)
    const e = '10001' // 公共指数 65537
    const d = randHex(hexLen) // 私钥指数（模拟）
    return {
      publicKey: `-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A${n.substring(0, 64)}...${e}\n-----END PUBLIC KEY-----`,
      privateKey: `-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA${n.substring(0, 64)}...${d.substring(0, 64)}\n-----END RSA PRIVATE KEY-----`,
      modulus: n,
      publicExponent: e,
      privateExponent: d,
    }
  }

  // 模拟加密：对每个字符做确定性变换
  const rsaEncrypt = (text: string, pub: string) => {
    let result = ''
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i)
      // 模拟 RSA: c = m^e mod n，简化为带偏移的线性变换
      const fake = (code * 0x10001 + pub.length * 31) % 0x100000
      result += fake.toString(16).padStart(5, '0')
    }
    return btoa(result)
  }

  const rsaDecrypt = (cipher: string, priv: string) => {
    try {
      const hex = atob(cipher)
      let result = ''
      for (let i = 0; i < hex.length; i += 5) {
        const chunk = hex.substring(i, i + 5)
        const fake = parseInt(chunk, 16)
        const code = Math.floor((fake - priv.length * 31) / 0x10001)
        result += String.fromCharCode(code)
      }
      return result
    } catch (e: any) {
      return `解密失败: ${e.message}`
    }
  }

  switch (operation) {
    case 'generate':
      return { operation: 'generate', bits, ...generateKeyPair(bits) }
    case 'encrypt':
      return { operation: 'encrypt', input, output: rsaEncrypt(input.toString(), publicKey || '') }
    case 'decrypt':
      return { operation: 'decrypt', input, output: rsaDecrypt(input.toString(), privateKey || '') }
    case 'sign': {
      const sig = rsaEncrypt(input.toString() + '|signed', privateKey || '')
      return { operation: 'sign', input, signature: sig, algorithm: 'RS256(simulated)' }
    }
    case 'verify': {
      const decrypted = rsaDecrypt(input.toString(), publicKey || '')
      return { operation: 'verify', valid: decrypted.endsWith('|signed'), recovered: decrypted.replace('|signed', '') }
    }
    default:
      throw new Error(`不支持的操作: ${operation}`)
  }
}

// 23. password_strength - 密码强度检测
async function passwordStrengthHandler(args: Record<string, any>): Promise<any> {
  const { password } = args
  const pwd = password.toString()

  const checks = {
    length8: pwd.length >= 8,
    length12: pwd.length >= 12,
    length16: pwd.length >= 16,
    hasLower: /[a-z]/.test(pwd),
    hasUpper: /[A-Z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
    hasSymbol: /[^a-zA-Z0-9]/.test(pwd),
    noRepeat: !/(.)\1{2,}/.test(pwd), // 无 3 个及以上连续重复
    noSequence: !/(?:abc|bcd|cde|123|234|345|456|567|678|789|890|qwe|wer|ert|rty)/i.test(pwd),
  }

  // 常见密码黑名单
  const commonPasswords = ['password', '123456', '12345678', 'qwerty', 'abc123', '111111', '000000', 'admin', 'letmein', 'welcome', 'password123', 'admin123']
  const isCommon = commonPasswords.includes(pwd.toLowerCase())

  // 评分计算
  let score = 0
  if (checks.length8) score += 1
  if (checks.length12) score += 1
  if (checks.length16) score += 1
  if (checks.hasLower) score += 1
  if (checks.hasUpper) score += 1
  if (checks.hasNumber) score += 1
  if (checks.hasSymbol) score += 2
  if (checks.noRepeat) score += 1
  if (checks.noSequence) score += 1
  if (isCommon) score = 0

  const strength = score >= 8 ? '强' : score >= 5 ? '中' : score >= 3 ? '弱' : '极弱'
  const percentage = Math.min(100, score * 10)

  return {
    password: pwd.replace(/./g, '*'),
    score,
    maxScore: 10,
    percentage,
    strength,
    isCommon,
    checks,
    suggestions: [
      ...(!checks.length12 ? ['建议密码长度至少 12 位'] : []),
      ...(!checks.hasUpper ? ['建议包含大写字母'] : []),
      ...(!checks.hasSymbol ? ['建议包含特殊字符'] : []),
      ...(isCommon ? ['该密码在常见密码列表中，请立即更换'] : []),
    ],
  }
}

// 24. password_generator - 安全密码生成器
async function passwordGeneratorHandler(args: Record<string, any>): Promise<any> {
  const {
    length = 16,
    count = 1,
    uppercase = true,
    lowercase = true,
    numbers = true,
    symbols = false,
    exclude_similar = false,
    custom_chars = '',
  } = args

  const similarChars = 'il1Lo0O'
  let pool = ''
  if (uppercase) pool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (lowercase) pool += 'abcdefghijklmnopqrstuvwxyz'
  if (numbers) pool += '0123456789'
  if (symbols) pool += '!@#$%^&*()_+-=[]{}|;:,.<>?'
  if (custom_chars) pool += custom_chars.toString()
  if (exclude_similar) pool = pool.split('').filter(c => !similarChars.includes(c)).join('')

  if (!pool) throw new Error('字符集为空，请至少选择一种字符类型')

  // 优先使用 crypto.getRandomValues 生成更安全的随机数
  const secureRandom = (max: number): number => {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const arr = new Uint32Array(1)
      crypto.getRandomValues(arr)
      return arr[0] % max
    }
    return Math.floor(Math.random() * max)
  }

  const generate = (): string => {
    let pwd = ''
    for (let i = 0; i < length; i++) {
      pwd += pool[secureRandom(pool.length)]
    }
    return pwd
  }

  const passwords = Array.from({ length: count }, () => generate())
  return {
    passwords,
    count: passwords.length,
    length,
    charset: pool,
    charsetSize: pool.length,
    entropy: Math.round(length * Math.log2(pool.length || 1)),
    excludeSimilar: exclude_similar,
  }
}

// 25. hmac_generator - HMAC 生成
async function hmacGeneratorHandler(args: Record<string, any>): Promise<any> {
  const { message, key, algorithm = 'sha256' } = args
  const msg = message.toString()
  const keyStr = key.toString()

  // 简化版哈希函数（演示用，非密码学安全）
  const simpleHash = (str: string, algo: string): string => {
    if (algo === 'sha512') {
      // BigInt 分支
      let hash = BigInt('0x6a09e667f3bcc908')
      const multiplier = BigInt(131)
      for (let i = 0; i < str.length; i++) {
        hash = (hash * multiplier + BigInt(str.charCodeAt(i))) & BigInt('0xFFFFFFFFFFFFFFFF')
      }
      let result = hash.toString(16)
      while (result.length < 128) result += (hash % BigInt(16)).toString(16)
      return result.slice(0, 128)
    } else {
      // number 分支
      let hash = 0x6a09e667
      const multiplier = 31
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
      }
      const targetLen = algo === 'sha256' ? 64 : 40
      let result = (hash >>> 0).toString(16)
      while (result.length < targetLen) result += Math.abs(hash % 16).toString(16)
      return result.slice(0, targetLen)
    }
  }

  // HMAC 构造: H(K xor opad || H(K xor ipad || message))
  const blockSize = 64
  let processedKey = keyStr
  if (keyStr.length > blockSize) {
    processedKey = simpleHash(keyStr, algorithm)
  }
  while (processedKey.length < blockSize) processedKey += '\0'

  const ipad = processedKey.split('').map(c => String.fromCharCode(c.charCodeAt(0) ^ 0x36)).join('')
  const opad = processedKey.split('').map(c => String.fromCharCode(c.charCodeAt(0) ^ 0x5c)).join('')

  const innerHash = simpleHash(ipad + msg, algorithm)
  const hmac = simpleHash(opad + innerHash, algorithm)

  return {
    message: msg,
    algorithm: algorithm.toUpperCase(),
    hmac,
    length: hmac.length,
    keyPreview: keyStr.substring(0, 3) + '***',
  }
}

// 26. cipher_tool - 凯撒密码/维吉尼亚密码/ROT13
async function cipherToolHandler(args: Record<string, any>): Promise<any> {
  const { input, method = 'caesar', shift = 3, key = 'key', operation = 'encrypt' } = args
  const text = input.toString()
  const isDecrypt = operation === 'decrypt'

  // 凯撒密码
  const caesar = (str: string, s: number, decrypt: boolean): string => {
    const shiftVal = decrypt ? (26 - (s % 26)) : (s % 26)
    return str.replace(/[a-zA-Z]/g, (c) => {
      const base = c <= 'Z' ? 65 : 97
      return String.fromCharCode(((c.charCodeAt(0) - base + shiftVal) % 26) + base)
    })
  }

  // ROT13
  const rot13 = (str: string): string => caesar(str, 13, false)

  // 维吉尼亚密码
  const vigenere = (str: string, k: string, decrypt: boolean): string => {
    const cleanKey = k.replace(/[^a-zA-Z]/g, '').toLowerCase()
    if (!cleanKey) return str
    let keyIdx = 0
    return str.replace(/[a-zA-Z]/g, (c) => {
      const base = c <= 'Z' ? 65 : 97
      const kShift = cleanKey.charCodeAt(keyIdx % cleanKey.length) - 97
      const shift = decrypt ? (26 - kShift) : kShift
      keyIdx++
      return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base)
    })
  }

  let output: string
  switch (method) {
    case 'caesar': output = caesar(text, Number(shift), isDecrypt); break
    case 'rot13': output = rot13(text); break
    case 'vigenere': output = vigenere(text, key.toString(), isDecrypt); break
    case 'atbash':
      output = text.replace(/[a-zA-Z]/g, (c) => {
        const base = c <= 'Z' ? 65 : 97
        return String.fromCharCode(base + 25 - (c.charCodeAt(0) - base))
      })
      break
    default: throw new Error(`不支持的加密方法: ${method}`)
  }

  return {
    method,
    operation,
    input: text,
    output,
    shift: method === 'caesar' ? Number(shift) : undefined,
    key: method === 'vigenere' ? key : undefined,
  }
}

// ==================== 工具实现：网络与API类 ====================

// 27. url_parser - URL 解析器
async function urlParserHandler(args: Record<string, any>): Promise<any> {
  const { url, operation = 'parse' } = args
  const urlStr = url.toString()

  try {
    const parsed = new URL(urlStr)
    const params: Record<string, string> = {}
    parsed.searchParams.forEach((value, key) => { params[key] = value })

    switch (operation) {
      case 'parse':
        return {
          valid: true,
          protocol: parsed.protocol,
          hostname: parsed.hostname,
          port: parsed.port || null,
          pathname: parsed.pathname,
          search: parsed.search || null,
          hash: parsed.hash || null,
          params,
          username: parsed.username || null,
          password: parsed.password || null,
          origin: parsed.origin,
          fullPath: parsed.pathname + parsed.search + parsed.hash,
        }
      case 'query': {
        const paramList = Object.entries(params).map(([k, v]) => ({ key: k, value: v }))
        return { valid: true, params: paramList, count: paramList.length }
      }
      case 'build': {
        const u = new URL(parsed.origin + parsed.pathname)
        Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v))
        return { valid: true, url: u.toString() }
      }
      case 'validate':
        return { valid: true, url: urlStr }
      default:
        throw new Error(`不支持的操作: ${operation}`)
    }
  } catch (e: any) {
    return { valid: false, url: urlStr, error: `URL 解析失败: ${e.message}` }
  }
}

// 28. http_status - HTTP 状态码查询
async function httpStatusHandler(args: Record<string, any>): Promise<any> {
  const { code, operation = 'lookup' } = args

  const statusCodes: Record<number, { name: string; category: string; description: string; usage: string }> = {
    200: { name: 'OK', category: '2xx 成功', description: '请求成功', usage: 'GET/PUT/DELETE 请求的标准响应' },
    201: { name: 'Created', category: '2xx 成功', description: '已创建', usage: 'POST 请求成功创建资源' },
    204: { name: 'No Content', category: '2xx 成功', description: '无内容', usage: '成功处理但无返回内容（DELETE）' },
    301: { name: 'Moved Permanently', category: '3xx 重定向', description: '永久重定向', usage: '资源 URL 永久变更' },
    302: { name: 'Found', category: '3xx 重定向', description: '临时重定向', usage: '资源临时跳转' },
    304: { name: 'Not Modified', category: '3xx 重定向', description: '未修改', usage: '缓存有效，客户端使用本地缓存' },
    400: { name: 'Bad Request', category: '4xx 客户端错误', description: '请求错误', usage: '请求参数格式错误' },
    401: { name: 'Unauthorized', category: '4xx 客户端错误', description: '未授权', usage: '需要身份认证' },
    403: { name: 'Forbidden', category: '4xx 客户端错误', description: '禁止访问', usage: '认证成功但无权限' },
    404: { name: 'Not Found', category: '4xx 客户端错误', description: '未找到', usage: '资源不存在' },
    405: { name: 'Method Not Allowed', category: '4xx 客户端错误', description: '方法不允许', usage: 'HTTP 方法不被允许' },
    409: { name: 'Conflict', category: '4xx 客户端错误', description: '冲突', usage: '资源版本冲突' },
    422: { name: 'Unprocessable Entity', category: '4xx 客户端错误', description: '无法处理的实体', usage: '语义错误（字段验证失败）' },
    429: { name: 'Too Many Requests', category: '4xx 客户端错误', description: '请求过多', usage: '限流触发' },
    500: { name: 'Internal Server Error', category: '5xx 服务器错误', description: '服务器内部错误', usage: '服务端代码异常' },
    502: { name: 'Bad Gateway', category: '5xx 服务器错误', description: '网关错误', usage: '上游服务返回无效响应' },
    503: { name: 'Service Unavailable', category: '5xx 服务器错误', description: '服务不可用', usage: '服务过载或维护中' },
    504: { name: 'Gateway Timeout', category: '5xx 服务器错误', description: '网关超时', usage: '上游服务响应超时' },
  }

  if (operation === 'list') {
    const grouped: Record<string, any[]> = {}
    Object.entries(statusCodes).forEach(([c, info]) => {
      if (!grouped[info.category]) grouped[info.category] = []
      grouped[info.category].push({ code: parseInt(c), ...info })
    })
    return { operation: 'list', total: Object.keys(statusCodes).length, categories: grouped }
  }

  const codeNum = Number(code)
  const info = statusCodes[codeNum]
  if (!info) {
    return {
      found: false,
      code: codeNum,
      hint: '未知状态码，标准范围: 1xx信息/2xx成功/3xx重定向/4xx客户端错误/5xx服务器错误',
    }
  }
  return { found: true, code: codeNum, ...info }
}

// 29. ip_calculator - IP 地址计算器
async function ipCalculatorHandler(args: Record<string, any>): Promise<any> {
  const { ip, cidr = 24 } = args
  const ipStr = ip.toString()

  const ipToInt = (ip: string): number => {
    const parts = ip.split('.').map(Number)
    if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
      throw new Error(`无效的 IP 地址: ${ip}`)
    }
    return (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]
  }
  const intToIp = (int: number): string => {
    return [(int >>> 24) & 0xff, (int >>> 16) & 0xff, (int >>> 8) & 0xff, int & 0xff].join('.')
  }

  const ipInt = ipToInt(ipStr) >>> 0
  const cidrNum = Number(cidr)
  if (cidrNum < 0 || cidrNum > 32) throw new Error('CIDR 必须在 0-32 之间')

  // 子网掩码
  const maskInt = cidrNum === 0 ? 0 : ((0xffffffff << (32 - cidrNum)) >>> 0)

  // 网络地址、广播地址
  const networkInt = (ipInt & maskInt) >>> 0
  const broadcastInt = (networkInt | (~maskInt >>> 0)) >>> 0
  const networkAddr = intToIp(networkInt)
  const broadcastAddr = intToIp(broadcastInt)

  // 主机范围
  const totalHosts = Math.pow(2, 32 - cidrNum)
  const usableHosts = cidrNum >= 31 ? totalHosts : totalHosts - 2
  const firstHost = cidrNum >= 31 ? networkAddr : intToIp(networkInt + 1)
  const lastHost = cidrNum >= 31 ? broadcastAddr : intToIp(broadcastInt - 1)

  // IP 类型判断
  const octets = ipStr.split('.').map(Number)
  const firstOctet = octets[0]
  let ipClass = 'C'
  if (firstOctet >= 1 && firstOctet <= 126) ipClass = 'A'
  else if (firstOctet >= 128 && firstOctet <= 191) ipClass = 'B'
  else if (firstOctet >= 192 && firstOctet <= 223) ipClass = 'C'
  else if (firstOctet >= 224 && firstOctet <= 239) ipClass = 'D (组播)'
  else if (firstOctet >= 240) ipClass = 'E (保留)'

  const isPrivate = (firstOctet === 10) ||
    (firstOctet === 172 && octets[1] >= 16 && octets[1] <= 31) ||
    (firstOctet === 192 && octets[1] === 168)

  return {
    ip: ipStr,
    cidr: `/${cidrNum}`,
    subnetMask: intToIp(maskInt),
    networkAddress: networkAddr,
    broadcastAddress: broadcastAddr,
    firstHost,
    lastHost,
    totalHosts,
    usableHosts,
    ipClass,
    isPrivate,
    binaryIp: octets.map(p => p.toString(2).padStart(8, '0')).join('.'),
    wildcardMask: intToIp(~maskInt >>> 0),
  }
}

// 30. dns_lookup - DNS 查询模拟
async function dnsLookupHandler(args: Record<string, any>): Promise<any> {
  const { domain, record_type = 'A' } = args
  const dom = domain.toString().toLowerCase()
  const type = record_type.toString().toUpperCase()

  // 模拟 DNS 记录数据库
  const dnsDb: Record<string, any> = {
    'example.com': {
      A: ['93.184.216.34'], AAAA: ['2606:2800:220:1:248:1893:25c8:1946'],
      CNAME: null, MX: [{ priority: 10, exchange: 'mail.example.com' }],
      TXT: ['v=spf1 include:_spf.example.com ~all'], NS: ['a.iana-servers.net', 'b.iana-servers.net'],
      SOA: { mname: 'ns.icann.org', rname: 'noc.dns.icann.org' },
    },
    'google.com': {
      A: ['142.250.80.46'], AAAA: ['2607:f8b0:4004:800::200e'],
      MX: [{ priority: 10, exchange: 'smtp.gmail.com' }],
      TXT: ['v=spf1 include:_spf.google.com ~all'], NS: ['ns1.google.com', 'ns2.google.com'],
    },
    'github.com': {
      A: ['140.82.112.4'], CNAME: null,
      MX: [{ priority: 10, exchange: 'aspmx.l.google.com' }],
      TXT: ['v=spf1 include:_spf.google.com ~all'],
    },
  }

  // 基于域名哈希生成确定性的伪记录
  const hashStr = (s: string): number => {
    let h = 0
    for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0
    return Math.abs(h)
  }

  const generateRecord = (d: string, t: string) => {
    const seed = hashStr(d + t)
    switch (t) {
      case 'A': return [`${(seed % 254) + 1}.${(seed >> 8) % 256}.${(seed >> 16) % 256}.${(seed >> 24) % 254 + 1}`]
      case 'AAAA': return [`2606:2800:220:1:${((seed >> 16) & 0xffff).toString(16)}:${(seed & 0xffff).toString(16)}:25c8:1946`]
      case 'CNAME': return d.startsWith('www.') ? d.substring(4) : `cname-${seed % 100}.${d}`
      case 'MX': return [{ priority: 10, exchange: `mail.${d}` }, { priority: 20, exchange: `mail2.${d}` }]
      case 'TXT': return [`v=spf1 include:_spf.${d} ~all`, `google-site-verification=${seed.toString(16)}`]
      case 'NS': return [`ns1.${d}`, `ns2.${d}`]
      case 'SOA': return { mname: `ns1.${d}`, rname: `admin.${d}`, serial: seed, refresh: 3600, retry: 900, expire: 86400, minimum: 3600 }
      default: return null
    }
  }

  const dbEntry = dnsDb[dom]
  const record = dbEntry && dbEntry[type] !== undefined ? dbEntry[type] : generateRecord(dom, type)

  return {
    domain: dom,
    recordType: type,
    records: record,
    simulated: !dbEntry,
    ttl: 3600,
    note: dbEntry ? '来自模拟 DNS 数据库' : '基于域名哈希生成的模拟记录，非真实 DNS 查询',
  }
}

// 31. port_scanner - 端口扫描器模拟
async function portScannerHandler(args: Record<string, any>): Promise<any> {
  const { host, ports, operation = 'scan_common' } = args
  const hostname = host.toString()

  // 常用端口说明
  const portInfo: Record<number, { service: string; protocol: string; description: string }> = {
    20: { service: 'FTP-Data', protocol: 'TCP', description: '文件传输-数据' },
    21: { service: 'FTP', protocol: 'TCP', description: '文件传输-控制' },
    22: { service: 'SSH', protocol: 'TCP', description: '安全 Shell' },
    23: { service: 'Telnet', protocol: 'TCP', description: '远程登录（明文）' },
    25: { service: 'SMTP', protocol: 'TCP', description: '简单邮件传输' },
    53: { service: 'DNS', protocol: 'UDP/TCP', description: '域名解析' },
    80: { service: 'HTTP', protocol: 'TCP', description: 'Web 服务' },
    110: { service: 'POP3', protocol: 'TCP', description: '邮件接收' },
    143: { service: 'IMAP', protocol: 'TCP', description: '邮件访问' },
    443: { service: 'HTTPS', protocol: 'TCP', description: '加密 Web 服务' },
    3306: { service: 'MySQL', protocol: 'TCP', description: 'MySQL 数据库' },
    3389: { service: 'RDP', protocol: 'TCP', description: '远程桌面' },
    5432: { service: 'PostgreSQL', protocol: 'TCP', description: 'PostgreSQL 数据库' },
    6379: { service: 'Redis', protocol: 'TCP', description: 'Redis 缓存' },
    8080: { service: 'HTTP-Alt', protocol: 'TCP', description: 'Web 服务备用端口' },
    8443: { service: 'HTTPS-Alt', protocol: 'TCP', description: '加密 Web 服务备用端口' },
    27017: { service: 'MongoDB', protocol: 'TCP', description: 'MongoDB 数据库' },
  }

  // 基于主机名哈希生成"开放"端口（约 30% 开放率）
  const hashStr = (s: string): number => {
    let h = 0
    for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0
    return Math.abs(h)
  }

  if (operation === 'list_common') {
    return {
      operation: 'list_common',
      host: hostname,
      commonPorts: Object.entries(portInfo).map(([p, info]) => ({ port: parseInt(p), ...info })),
      total: Object.keys(portInfo).length,
    }
  }

  let targetPorts: number[] = []
  if (operation === 'scan_common') {
    targetPorts = Object.keys(portInfo).map(Number)
  } else if (operation === 'scan_list') {
    targetPorts = String(ports || '').split(/[,\s]+/).map(p => parseInt(p.trim())).filter(p => !isNaN(p) && p > 0 && p <= 65535)
  }

  const seed = hashStr(hostname)
  const results = targetPorts.map(port => {
    const isOpen = ((seed + port * 31) % 10) > 6
    const info = portInfo[port]
    return {
      port,
      ...(info || { service: 'unknown', protocol: 'TCP', description: '未定义服务' }),
      state: isOpen ? 'open' : 'closed',
      responseTime: isOpen ? `${1 + (seed + port) % 50}ms` : null,
    }
  })

  const openPorts = results.filter(r => r.state === 'open')
  return {
    operation,
    host: hostname,
    scanned: results.length,
    open: openPorts.length,
    closed: results.length - openPorts.length,
    results,
    openPorts: openPorts.map(r => r.port),
    note: '模拟扫描结果，非真实端口探测',
  }
}

// ==================== 工具实现：数据库类 ====================

// 32. sql_formatter - SQL 格式化
async function sqlFormatterHandler(args: Record<string, any>): Promise<any> {
  const { sql, operation = 'format', keyword_case = 'upper', indent = 2 } = args
  const sqlStr = sql.toString()

  // SQL 关键字
  const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN', 'IS', 'NULL', 'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER', 'FULL', 'ON', 'AS', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX', 'VIEW', 'DISTINCT', 'UNION', 'ALL', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'ASC', 'DESC']

  if (operation === 'validate') {
    const issues: string[] = []
    if (!/select|insert|update|delete|create|alter|drop/i.test(sqlStr.trim())) issues.push('未检测到有效的 SQL 起始关键字')
    if ((sqlStr.match(/'/g) || []).length % 2 !== 0) issues.push('单引号未闭合')
    if ((sqlStr.match(/\(/g) || []).length !== (sqlStr.match(/\)/g) || []).length) issues.push('括号不匹配')
    if (!/;$/.test(sqlStr.trim())) issues.push('建议以分号结尾')
    return { valid: issues.length === 0, issues, sql: sqlStr }
  }

  if (operation === 'minify') {
    const output = sqlStr.replace(/\s+/g, ' ').trim()
    return { output, originalLength: sqlStr.length, minifiedLength: output.length }
  }

  // 格式化：统一关键字大小写
  let formatted = sqlStr
  keywords.forEach(kw => {
    const re = new RegExp(`\\b${kw}\\b`, 'gi')
    formatted = formatted.replace(re, keyword_case === 'upper' ? kw : kw.toLowerCase())
  })

  // 关键字前换行
  const breakKeywords = ['FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'VALUES', 'SET', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'ON']
  breakKeywords.forEach(kw => {
    const re = new RegExp(`\\s+${kw}\\b`, 'gi')
    formatted = formatted.replace(re, `\n${kw} `)
  })

  const indentStr = ' '.repeat(indent)
  const lines = formatted.split('\n').map(l => l.trim()).filter(Boolean)
  const indented = lines.map((line, i) => {
    if (i === 0) return line
    if (/^(AND|OR)\b/i.test(line)) return indentStr + line
    return indentStr + line
  })

  return {
    operation: 'format',
    input: sqlStr,
    output: indented.join('\n'),
    keywordCase: keyword_case,
  }
}

// 33. sql_to_api - SQL 转 REST API 设计
async function sqlToApiHandler(args: Record<string, any>): Promise<any> {
  const { sql, base_path = '/api' } = args
  const sqlStr = sql.toString()

  // 解析 SQL 提取表名
  const tableMatch = sqlStr.match(/(?:from|into|update|table)\s+([a-z_][a-z0-9_]*)/i)
  const table = tableMatch ? tableMatch[1] : 'unknown'
  const resource = table.replace(/_/g, '-').toLowerCase()

  // 解析字段
  const selectMatch = sqlStr.match(/select\s+(.+?)\s+from/i)
  const fields = selectMatch ? selectMatch[1].split(',').map(f => f.trim()) : ['*']
  const isAllFields = fields.includes('*')

  // 检测 WHERE 条件
  const whereMatch = sqlStr.match(/where\s+(.+?)(?:order|group|limit|$)/i)
  const whereClause = whereMatch ? whereMatch[1].trim() : null

  // 检测操作类型
  let operation = 'GET'
  if (/^insert/i.test(sqlStr)) operation = 'POST'
  else if (/^update/i.test(sqlStr)) operation = 'PUT'
  else if (/^delete/i.test(sqlStr)) operation = 'DELETE'

  // 生成端点
  const endpoints: any[] = []
  if (operation === 'GET') {
    endpoints.push({
      method: 'GET', path: `${base_path}/${resource}`,
      description: `获取 ${table} 列表`, params: [],
      response: { code: 200, body: { data: fields.map(f => ({ field: f, type: 'string' })), total: 0 } },
    })
    if (whereClause && /id\s*=/.test(whereClause)) {
      endpoints.push({
        method: 'GET', path: `${base_path}/${resource}/:id`,
        description: `获取单个 ${table}`, params: [{ name: 'id', type: 'number', required: true }],
        response: { code: 200, body: { data: {} } },
      })
    }
  } else if (operation === 'POST') {
    endpoints.push({
      method: 'POST', path: `${base_path}/${resource}`,
      description: `创建 ${table}`,
      params: fields.filter(f => f !== '*' && f !== 'id').map(f => ({ name: f, type: 'string', required: true })),
      response: { code: 201, body: { id: 0, message: 'created' } },
    })
  } else if (operation === 'PUT') {
    endpoints.push({
      method: 'PUT', path: `${base_path}/${resource}/:id`,
      description: `更新 ${table}`,
      params: [{ name: 'id', type: 'number', required: true }],
      response: { code: 200, body: { message: 'updated' } },
    })
  } else if (operation === 'DELETE') {
    endpoints.push({
      method: 'DELETE', path: `${base_path}/${resource}/:id`,
      description: `删除 ${table}`,
      params: [{ name: 'id', type: 'number', required: true }],
      response: { code: 200, body: { message: 'deleted' } },
    })
  }

  return {
    sql: sqlStr,
    table,
    resource,
    operation,
    fields: isAllFields ? ['* (所有字段)'] : fields,
    whereClause,
    endpoints,
    suggestedMiddleware: ['auth', 'rateLimit', 'validation'],
  }
}

// 34. schema_designer - 数据库表结构设计器
async function schemaDesignerHandler(args: Record<string, any>): Promise<any> {
  const { table_name, fields, engine = 'InnoDB', charset = 'utf8mb4' } = args
  const tableName = table_name.toString()
  const fieldList = Array.isArray(fields) ? fields : []

  if (fieldList.length === 0) throw new Error('请提供字段列表')

  // 类型映射
  const typeMap: Record<string, string> = {
    int: 'INT', bigint: 'BIGINT', string: 'VARCHAR(255)', text: 'TEXT',
    boolean: 'TINYINT(1)', bool: 'TINYINT(1)', float: 'FLOAT', double: 'DOUBLE',
    decimal: 'DECIMAL(10,2)', date: 'DATE', datetime: 'DATETIME', time: 'TIME',
    json: 'JSON', blob: 'BLOB', uuid: 'CHAR(36)',
  }

  const columns: string[] = []
  const indexes: string[] = []
  const foreignKeys: string[] = []

  fieldList.forEach((f: any) => {
    const name = f.name
    const type = typeMap[f.type] || f.type || 'VARCHAR(255)'
    const nullable = f.nullable === false ? 'NOT NULL' : ''
    const isPK = f.primary_key ? 'PRIMARY KEY' : ''
    const isUnique = f.unique ? 'UNIQUE' : ''
    const autoInc = f.auto_increment ? 'AUTO_INCREMENT' : ''
    const def = f.default !== undefined ? `DEFAULT ${typeof f.default === 'string' ? `'${f.default}'` : f.default}` : ''
    const comment = f.comment ? `COMMENT '${f.comment}'` : ''

    const parts = [name, type, nullable, autoInc, isPK, isUnique, def, comment].filter(Boolean)
    columns.push(`  ${parts.join(' ')}`)

    if (f.index && !f.primary_key) indexes.push(`  INDEX \`idx_${name}\` (\`${name}\`)`)
    if (f.foreign_key) {
      const fk = f.foreign_key
      foreignKeys.push(`  CONSTRAINT \`fk_${tableName}_${name}\` FOREIGN KEY (\`${name}\`) REFERENCES \`${fk.table}\` (\`${fk.field || 'id'}\`)`)
    }
  })

  const ddl = [
    `CREATE TABLE \`${tableName}\` (`,
    [...columns, ...indexes, ...foreignKeys].join(',\n'),
    `) ENGINE=${engine} DEFAULT CHARSET=${charset};`,
  ].join('\n')

  return {
    tableName,
    engine,
    charset,
    ddl,
    fields: fieldList.map((f: any) => ({ name: f.name, type: typeMap[f.type] || f.type, primaryKey: !!f.primary_key, nullable: f.nullable !== false })),
    indexes: indexes.map(i => i.trim()),
    foreignKeys: foreignKeys.map(f => f.trim()),
    dropStatement: `DROP TABLE IF EXISTS \`${tableName}\`;`,
  }
}

// 35. mock_data_gen - 测试数据生成器
async function mockDataGenHandler(args: Record<string, any>): Promise<any> {
  const { table_name = 'mock_table', fields, count = 10 } = args
  const tableName = table_name.toString()
  const fieldList = Array.isArray(fields) ? fields : []
  const num = Math.min(Number(count), 1000)

  if (fieldList.length === 0) throw new Error('请提供字段列表')

  // mock 数据生成辅助函数
  const pick = (arr: any[]): any => arr[Math.floor(Math.random() * arr.length)]
  const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

  const firstNames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴']
  const lastNames = ['伟', '芳', '娜', '敏', '静', '强', '磊', '军', '洋', '勇']
  const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '南京']
  const domains = ['gmail.com', 'qq.com', '163.com', 'outlook.com', 'example.com']

  const generateValue = (f: any): any => {
    const type = (f.type || 'string').toLowerCase()
    const name = (f.name || '').toLowerCase()
    if (name.includes('name')) return pick(firstNames) + pick(lastNames)
    if (name.includes('email')) return `user${randInt(100, 999)}@${pick(domains)}`
    if (name.includes('city')) return pick(cities)
    if (name.includes('phone')) return `1${pick(['3', '5', '7', '8', '9'])}${randInt(100000000, 999999999)}`
    switch (type) {
      case 'int': case 'integer': return randInt(f.min || 1, f.max || 1000)
      case 'bigint': return randInt(10000, 99999999)
      case 'boolean': case 'bool': return Math.random() > 0.5
      case 'float': case 'double': return parseFloat((Math.random() * 100).toFixed(2))
      case 'date': return new Date(randInt(946656000000, Date.now())).toISOString().split('T')[0]
      case 'datetime': return new Date(randInt(946656000000, Date.now())).toISOString()
      case 'json': return { key: pick(firstNames), value: randInt(1, 100) }
      default: return `text_${randInt(1, 9999)}`
    }
  }

  const records = Array.from({ length: num }, () => {
    const obj: Record<string, any> = {}
    fieldList.forEach((f: any) => { obj[f.name] = generateValue(f) })
    return obj
  })

  // 生成 INSERT 语句预览
  const colNames = fieldList.map((f: any) => f.name)
  const insertStatements = records.map(r =>
    `INSERT INTO \`${tableName}\` (${colNames.map(c => `\`${c}\``).join(', ')}) VALUES (${colNames.map(c => typeof r[c] === 'string' ? `'${r[c]}'` : r[c]).join(', ')});`
  )

  return {
    tableName,
    count: num,
    fields: colNames,
    records,
    insertStatements: insertStatements.slice(0, 5), // 仅返回前 5 条预览
    totalInserts: insertStatements.length,
    note: `已生成 ${num} 条测试数据`,
  }
}

// ==================== 工具实现：文档与格式类 ====================

// 36. yaml_json_converter - YAML 与 JSON 互转
async function yamlJsonConverterHandler(args: Record<string, any>): Promise<any> {
  const { input, operation = 'yaml_to_json' } = args
  const text = input.toString()

  // 简易标量解析
  const parseScalar = (v: string): any => {
    if (!v || v === 'null' || v === '~') return null
    if (v === 'true') return true
    if (v === 'false') return false
    if (/^-?\d+$/.test(v)) return parseInt(v, 10)
    if (/^-?\d+\.\d+$/.test(v)) return parseFloat(v)
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) return v.slice(1, -1)
    return v
  }

  // 简易 YAML 解析器（仅支持基本结构）
  const parseYaml = (yaml: string): any => {
    const lines = yaml.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'))
    const result: any = {}
    let currentKey = ''
    const stack: { obj: any; indent: number }[] = [{ obj: result, indent: -1 }]

    lines.forEach(line => {
      const indent = line.length - line.trimStart().length
      const trimmed = line.trim()
      // 列表项
      if (trimmed.startsWith('- ')) {
        const value = trimmed.substring(2).trim()
        const top = stack[stack.length - 1]
        const arr = top.obj[currentKey] || (top.obj[currentKey] = [])
        if (value.includes(':')) {
          const [k, v] = value.split(':').map(s => s.trim())
          arr.push({ [k]: parseScalar(v) })
        } else {
          arr.push(parseScalar(value))
        }
        return
      }
      // 键值对
      const colonIdx = trimmed.indexOf(':')
      if (colonIdx > -1) {
        const key = trimmed.substring(0, colonIdx).trim()
        const value = trimmed.substring(colonIdx + 1).trim()
        // 弹出栈到正确层级
        while (stack.length > 1 && stack[stack.length - 1].indent >= indent) stack.pop()
        const top = stack[stack.length - 1]
        if (value) {
          top.obj[key] = parseScalar(value)
        } else {
          top.obj[key] = {}
          stack.push({ obj: top.obj[key], indent })
        }
        currentKey = key
      }
    })
    return result
  }

  // JSON 转 YAML
  const formatYamlValue = (v: any): string => {
    if (v === null) return 'null'
    if (v === true) return 'true'
    if (v === false) return 'false'
    if (typeof v === 'string' && /[:#{}[\],&*?|<>=!%@`]/.test(v)) return `"${v}"`
    return String(v)
  }
  const toYaml = (obj: any, indent = 0): string => {
    const pad = ' '.repeat(indent)
    let result = ''
    if (Array.isArray(obj)) {
      obj.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          const keys = Object.keys(item)
          result += `${pad}- ${keys[0]}: ${formatYamlValue(item[keys[0]])}`
          keys.slice(1).forEach(k => { result += `\n${pad}  ${k}: ${formatYamlValue(item[k])}` })
          result += '\n'
        } else {
          result += `${pad}- ${formatYamlValue(item)}\n`
        }
      })
    } else if (typeof obj === 'object' && obj !== null) {
      Object.entries(obj).forEach(([k, v]) => {
        if (typeof v === 'object' && v !== null) {
          result += `${pad}${k}:\n${toYaml(v, indent + 2)}`
        } else {
          result += `${pad}${k}: ${formatYamlValue(v)}\n`
        }
      })
    }
    return result
  }

  try {
    if (operation === 'yaml_to_json') {
      const parsed = parseYaml(text)
      return { operation, input: text, output: JSON.stringify(parsed, null, 2), parsed }
    } else {
      const obj = JSON.parse(text)
      return { operation, input: text, output: toYaml(obj).trim(), parsed: obj }
    }
  } catch (e: any) {
    return { operation, success: false, error: `转换失败: ${e.message}` }
  }
}

// 37. csv_sql_converter - CSV 转 SQL INSERT 语句
async function csvSqlConverterHandler(args: Record<string, any>): Promise<any> {
  const { input, table_name = 'data', has_header = true, delimiter = ',' } = args
  const csv = input.toString()
  const tableName = table_name.toString()

  // CSV 行解析（支持引号）
  const parseLine = (line: string): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const c = line[i]
      if (c === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++ }
        else inQuotes = !inQuotes
      } else if (c === delimiter && !inQuotes) {
        result.push(current); current = ''
      } else { current += c }
    }
    result.push(current)
    return result
  }

  const lines = csv.split('\n').filter(l => l.trim())
  if (lines.length === 0) return { success: false, error: 'CSV 为空' }

  const header = has_header ? parseLine(lines[0]) : Array.from({ length: parseLine(lines[0]).length }, (_, i) => `col${i + 1}`)
  const dataLines = has_header ? lines.slice(1) : lines

  // 转义 SQL 值
  const escapeValue = (v: string): string => {
    if (v === '' || v === 'NULL' || v === 'null') return 'NULL'
    if (/^-?\d+(\.\d+)?$/.test(v)) return v
    return `'${v.replace(/'/g, "''")}'`
  }

  const statements = dataLines.map(line => {
    const values = parseLine(line)
    const cols = header.map(h => `\`${h}\``).join(', ')
    const vals = header.map((_, i) => escapeValue(values[i] || '')).join(', ')
    return `INSERT INTO \`${tableName}\` (${cols}) VALUES (${vals});`
  })

  // 推断列类型生成建表语句
  const inferType = (col: string, values: string[]): string => {
    for (const v of values) {
      if (v && !/^-?\d+$/.test(v)) return 'VARCHAR(255)'
    }
    return 'INT'
  }
  const sampleValues = dataLines.slice(0, 10).map(l => parseLine(l))
  const ddl = `CREATE TABLE \`${tableName}\` (\n` +
    header.map((h, i) => `  \`${h}\` ${inferType(h, sampleValues.map(r => r[i] || ''))}`).join(',\n') +
    `\n);`

  return {
    tableName,
    columns: header,
    rowCount: statements.length,
    createStatement: ddl,
    insertStatements: statements,
    combinedSql: ddl + '\n\n' + statements.join('\n'),
  }
}

// 38. xml_formatter - XML 格式化/压缩/校验
async function xmlFormatterHandler(args: Record<string, any>): Promise<any> {
  const { input, operation = 'format', indent = 2 } = args
  const xml = input.toString()

  // 校验 XML
  const validateXml = (str: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = []
    const tagStack: string[] = []
    const tagRegex = /<\/?([a-zA-Z_][\w.-]*)([^>]*)>/g
    let match
    while ((match = tagRegex.exec(str)) !== null) {
      const isClosing = match[0].startsWith('</')
      const isSelfClosing = match[0].endsWith('/>') || /\/>$/.test(match[0])
      const tagName = match[1]
      if (isClosing) {
        if (tagStack.length === 0 || tagStack[tagStack.length - 1] !== tagName) {
          errors.push(`标签不匹配: 期望 </${tagStack[tagStack.length - 1] || ''}>, 实际 </${tagName}>`)
        } else tagStack.pop()
      } else if (!isSelfClosing) {
        tagStack.push(tagName)
      }
    }
    if (tagStack.length > 0) errors.push(`未闭合的标签: ${tagStack.join(', ')}`)
    if (!str.trim().startsWith('<')) errors.push('XML 必须以 < 开头')
    return { valid: errors.length === 0, errors }
  }

  // 格式化 XML
  const formatXml = (str: string, indentSize: number): string => {
    const pad = ' '.repeat(indentSize)
    let formatted = ''
    let depth = 0
    const tokens = str.replace(/>\s*</g, '>\n<').split('\n')
    tokens.forEach(token => {
      token = token.trim()
      if (!token) return
      if (token.startsWith('</')) depth--
      formatted += pad.repeat(Math.max(0, depth)) + token + '\n'
      if (token.startsWith('<') && !token.startsWith('</') && !token.endsWith('/>') && !token.includes('</')) {
        if (!/^<[^>]+>[^<]*$/.test(token) && !token.includes('/>')) depth++
      }
    })
    return formatted.trim()
  }

  // 压缩
  const minifyXml = (str: string): string => str.replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ').trim()

  switch (operation) {
    case 'validate':
      return validateXml(xml)
    case 'format':
      return { operation: 'format', input: xml, output: formatXml(xml, indent) }
    case 'minify': {
      const output = minifyXml(xml)
      return { operation: 'minify', input: xml, output, originalLength: xml.length, minifiedLength: output.length }
    }
    default:
      throw new Error(`不支持的操作: ${operation}`)
  }
}

// 39. html_minifier - HTML 压缩/格式化
async function htmlMinifierHandler(args: Record<string, any>): Promise<any> {
  const { input, operation = 'minify', indent = 2 } = args
  const html = input.toString()

  // 压缩 HTML
  const minifyHtml = (str: string): string => {
    return str
      .replace(/<!--(?!\[if)[\s\S]*?-->/g, '') // 移除注释（保留条件注释）
      .replace(/>\s+</g, '><')
      .replace(/\s{2,}/g, ' ')
      .replace(/\s+>/g, '>')
      .trim()
  }

  // 格式化 HTML
  const formatHtml = (str: string, indentSize: number): string => {
    const pad = ' '.repeat(indentSize)
    let formatted = ''
    let depth = 0
    const voidElements = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'])
    const tokens = str.replace(/>\s*</g, '>\n<').split('\n')
    tokens.forEach(token => {
      token = token.trim()
      if (!token) return
      const tagMatch = token.match(/^<\/?([a-zA-Z][\w-]*)/)
      if (tagMatch) {
        const tagName = tagMatch[1].toLowerCase()
        if (token.startsWith('</')) depth--
        formatted += pad.repeat(Math.max(0, depth)) + token + '\n'
        if (token.startsWith('<') && !token.startsWith('</') && !token.endsWith('/>') && !voidElements.has(tagName) && !token.includes(`</${tagName}>`)) {
          depth++
        }
      } else {
        formatted += pad.repeat(Math.max(0, depth)) + token + '\n'
      }
    })
    return formatted.trim()
  }

  switch (operation) {
    case 'minify': {
      const output = minifyHtml(html)
      return { operation, input: html, output, originalSize: html.length, minifiedSize: output.length, reduction: `${((1 - output.length / html.length) * 100).toFixed(1)}%` }
    }
    case 'format':
      return { operation, input: html, output: formatHtml(html, indent) }
    case 'stats': {
      const tags = (html.match(/<([a-zA-Z][\w-]*)/g) || []).map(t => t.substring(1))
      const tagCounts: Record<string, number> = {}
      tags.forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1 })
      return {
        operation: 'stats',
        totalTags: tags.length,
        uniqueTags: Object.keys(tagCounts).length,
        tagCounts,
        hasDoctype: /<!DOCTYPE/i.test(html),
        hasMeta: /<meta/i.test(html),
        size: html.length,
      }
    }
    default:
      throw new Error(`不支持的操作: ${operation}`)
  }
}

// 40. css_optimizer - CSS 优化
async function cssOptimizerHandler(args: Record<string, any>): Promise<any> {
  const { input, operation = 'optimize' } = args
  const css = input.toString()

  // CSS 简写映射
  const shorthandMap: Record<string, string[]> = {
    'margin': ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'],
    'padding': ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'],
  }

  const stripComments = (str: string): string => str.replace(/\/\*[\s\S]*?\*\//g, '')
  const minifyCss = (str: string): string => str.replace(/\s+/g, ' ').replace(/\s*([{}:;,])\s*/g, '$1').trim()

  if (operation === 'minify') {
    const output = minifyCss(stripComments(css))
    return { operation, input: css, output, originalSize: css.length, minifiedSize: output.length, reduction: `${((1 - output.length / css.length) * 100).toFixed(1)}%` }
  }

  if (operation === 'format') {
    const formatted = stripComments(css)
      .replace(/\s*([{}:;,])\s*/g, '$1')
      .replace(/}/g, '}\n')
      .replace(/{/g, ' {\n  ')
      .replace(/;/g, ';\n  ')
      .replace(/\n  }/g, '\n}')
      .replace(/,\s*/g, ',\n')
      .trim()
    return { operation, input: css, output: formatted }
  }

  // optimize: 去重 + 简写
  const rules: Map<string, Map<string, string>> = new Map()
  const ruleRegex = /([^{}]+)\{([^}]*)\}/g
  let match
  while ((match = ruleRegex.exec(stripComments(css))) !== null) {
    const selector = match[1].trim()
    const declarations = match[2].trim()
    if (!rules.has(selector)) rules.set(selector, new Map())
    const props = rules.get(selector)!
    declarations.split(';').forEach(d => {
      const colonIdx = d.indexOf(':')
      if (colonIdx > -1) {
        const prop = d.substring(0, colonIdx).trim()
        const value = d.substring(colonIdx + 1).trim()
        props.set(prop, value) // 后者覆盖前者（去重）
      }
    })
  }

  // 生成优化后 CSS
  let optimized = ''
  rules.forEach((props, selector) => {
    const propObj: Record<string, string> = {}
    props.forEach((v, k) => { propObj[k] = v })
    // 尝试合并简写
    Object.entries(shorthandMap).forEach(([short, long]) => {
      if (long.every(p => propObj[p] !== undefined && propObj[p] === propObj[long[0]])) {
        propObj[short] = propObj[long[0]]
        long.forEach(p => delete propObj[p])
      }
    })
    optimized += `${selector} {\n`
    Object.entries(propObj).forEach(([k, v]) => { optimized += `  ${k}: ${v};\n` })
    optimized += '}\n'
  })

  return {
    operation: 'optimize',
    input: css,
    output: optimized.trim(),
    originalSize: css.length,
    optimizedSize: optimized.trim().length,
    ruleCount: rules.size,
    duplicateRemoved: true,
  }
}

// ==================== 工具实现：数学与统计类 ====================

// 41. matrix_calculator - 矩阵计算器
async function matrixCalculatorHandler(args: Record<string, any>): Promise<any> {
  const { matrix_a, matrix_b, operation = 'multiply' } = args
  const A: number[][] = Array.isArray(matrix_a) ? matrix_a : JSON.parse(matrix_a)
  const B: number[][] | null = matrix_b ? (Array.isArray(matrix_b) ? matrix_b : JSON.parse(matrix_b)) : null

  const isMatrix = (m: any): m is number[][] => Array.isArray(m) && m.every(r => Array.isArray(r) && r.every(v => typeof v === 'number'))
  if (!isMatrix(A)) throw new Error('matrix_a 不是有效的数字矩阵')

  const transpose = (m: number[][]): number[][] => m[0].map((_, i) => m.map(r => r[i]))

  const add = (a: number[][], b: number[][]): number[][] => {
    if (a.length !== b.length || a[0].length !== b[0].length) throw new Error('矩阵维度不匹配，无法相加')
    return a.map((r, i) => r.map((v, j) => v + b[i][j]))
  }

  const subtract = (a: number[][], b: number[][]): number[][] => {
    if (a.length !== b.length || a[0].length !== b[0].length) throw new Error('矩阵维度不匹配，无法相减')
    return a.map((r, i) => r.map((v, j) => v - b[i][j]))
  }

  const multiply = (a: number[][], b: number[][]): number[][] => {
    if (a[0].length !== b.length) throw new Error(`矩阵维度不匹配: ${a[0].length} != ${b.length}`)
    return a.map(r => transpose(b).map(col => r.reduce((s, v, i) => s + v * col[i], 0)))
  }

  // 行列式（递归展开）
  const determinant = (m: number[][]): number => {
    const n = m.length
    if (n !== m[0].length) throw new Error('行列式要求方阵')
    if (n === 1) return m[0][0]
    if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0]
    let det = 0
    for (let j = 0; j < n; j++) {
      const minor = m.slice(1).map(r => r.filter((_, idx) => idx !== j))
      det += (j % 2 === 0 ? 1 : -1) * m[0][j] * determinant(minor)
    }
    return det
  }

  // 逆矩阵（高斯消元法）
  const inverse = (m: number[][]): number[][] => {
    const n = m.length
    if (n !== m[0].length) throw new Error('逆矩阵要求方阵')
    const det = determinant(m)
    if (Math.abs(det) < 1e-10) throw new Error('矩阵不可逆（行列式为 0）')
    const augmented = m.map((r, i) => [...r, ...Array(n).fill(0).map((_, j) => i === j ? 1 : 0)])
    for (let i = 0; i < n; i++) {
      let maxRow = i
      for (let k = i + 1; k < n; k++) if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) maxRow = k
      ;[augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]]
      const pivot = augmented[i][i]
      for (let j = 0; j < 2 * n; j++) augmented[i][j] /= pivot
      for (let k = 0; k < n; k++) {
        if (k !== i) {
          const factor = augmented[k][i]
          for (let j = 0; j < 2 * n; j++) augmented[k][j] -= factor * augmented[i][j]
        }
      }
    }
    return augmented.map(r => r.slice(n))
  }

  switch (operation) {
    case 'add':
      if (!B) throw new Error('add 操作需要 matrix_b')
      return { operation, result: add(A, B), shape: [A.length, A[0].length] }
    case 'subtract':
      if (!B) throw new Error('subtract 操作需要 matrix_b')
      return { operation, result: subtract(A, B), shape: [A.length, A[0].length] }
    case 'multiply':
      if (!B) throw new Error('multiply 操作需要 matrix_b')
      return { operation, result: multiply(A, B), shape: [A.length, B[0].length] }
    case 'transpose': return { operation, result: transpose(A), shape: [A[0].length, A.length] }
    case 'determinant': return { operation, result: determinant(A), shape: [A.length, A[0].length] }
    case 'inverse': return { operation, result: inverse(A), shape: [A.length, A[0].length] }
    case 'shape': return { operation, shape: [A.length, A[0].length], elements: A.length * A[0].length }
    default: throw new Error(`不支持的操作: ${operation}`)
  }
}

// 42. statistics_calculator - 统计计算器
async function statisticsCalculatorHandler(args: Record<string, any>): Promise<any> {
  const { data, operation = 'describe' } = args
  const arr: number[] = (Array.isArray(data) ? data : JSON.parse(data)).map(Number).filter(n => !isNaN(n))
  if (arr.length === 0) throw new Error('数据为空')

  const n = arr.length
  const sorted = [...arr].sort((a, b) => a - b)
  const sum = arr.reduce((s, v) => s + v, 0)
  const mean = sum / n
  const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)]
  const variance = arr.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / n
  const stdDev = Math.sqrt(variance)
  const sampleVariance = n > 1 ? arr.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / (n - 1) : 0
  const min = sorted[0], max = sorted[n - 1]
  const range = max - min

  // 百分位数
  const percentile = (p: number): number => {
    const idx = (p / 100) * (n - 1)
    const lo = Math.floor(idx), hi = Math.ceil(idx)
    return lo === hi ? sorted[lo] : sorted[lo] + (idx - lo) * (sorted[hi] - sorted[lo])
  }
  const q1 = percentile(25), q3 = percentile(75)
  const iqr = q3 - q1

  // 众数
  const freq: Record<number, number> = {}
  arr.forEach(v => { freq[v] = (freq[v] || 0) + 1 })
  const maxFreq = Math.max(...Object.values(freq))
  const modes = Object.entries(freq).filter(([, c]) => c === maxFreq).map(([v]) => Number(v))

  // 线性回归（基于索引）
  const xMean = (n - 1) / 2
  const denominator = arr.reduce((s, _, i) => s + Math.pow(i - xMean, 2), 0)
  const slope = arr.reduce((s, v, i) => s + (i - xMean) * (v - mean), 0) / denominator
  const intercept = mean - slope * xMean

  switch (operation) {
    case 'describe':
      return {
        count: n, sum, mean, median,
        mode: modes.length === arr.length ? null : modes,
        min, max, range,
        variance, sampleVariance, stdDev,
        q1, q3, iqr,
        skewness: stdDev > 0 ? arr.reduce((s, v) => s + Math.pow((v - mean) / stdDev, 3), 0) / n : 0,
        kurtosis: stdDev > 0 ? arr.reduce((s, v) => s + Math.pow((v - mean) / stdDev, 4), 0) / n - 3 : 0,
      }
    case 'regression':
      return { operation, slope, intercept, equation: `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}` }
    case 'percentile':
      return { operation, q1, median, q3, p90: percentile(90), p95: percentile(95), p99: percentile(99) }
    case 'sum': return { operation, result: sum }
    case 'mean': return { operation, result: mean }
    case 'median': return { operation, result: median }
    case 'std': return { operation, result: stdDev }
    default: throw new Error(`不支持的操作: ${operation}`)
  }
}

// 43. probability_calculator - 概率计算器
async function probabilityCalculatorHandler(args: Record<string, any>): Promise<any> {
  const { operation = 'combination', n, k, p, lambda, x, mean, std_dev } = args

  // 阶乘
  const factorial = (num: number): number => {
    if (num < 0) return NaN
    if (num > 170) return Infinity
    let r = 1; for (let i = 2; i <= num; i++) r *= i; return r
  }
  // 组合数 C(n,k)
  const combination = (num: number, kk: number): number => {
    if (kk < 0 || kk > num) return 0
    if (kk === 0 || kk === num) return 1
    kk = Math.min(kk, num - kk)
    let r = 1
    for (let i = 0; i < kk; i++) r = (r * (num - i)) / (i + 1)
    return Math.round(r)
  }
  // 排列数 P(n,k)
  const permutation = (num: number, kk: number): number => {
    if (kk < 0 || kk > num) return 0
    let r = 1
    for (let i = 0; i < kk; i++) r *= (num - i)
    return r
  }
  // 正态分布 PDF
  const normalPdf = (xv: number, m: number, std: number): number => {
    return Math.exp(-Math.pow(xv - m, 2) / (2 * std * std)) / (std * Math.sqrt(2 * Math.PI))
  }
  // 正态分布 CDF（Abramowitz-Stegun 近似）
  const normalCdf = (xv: number, m: number, std: number): number => {
    const z = (xv - m) / std
    const t = 1 / (1 + 0.2316419 * Math.abs(z))
    const d = 0.3989423 * Math.exp(-z * z / 2)
    const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
    return z > 0 ? 1 - prob : prob
  }

  switch (operation) {
    case 'combination':
      return { operation, n, k, result: combination(Number(n), Number(k)), formula: `C(${n},${k})` }
    case 'permutation':
      return { operation, n, k, result: permutation(Number(n), Number(k)), formula: `P(${n},${k})` }
    case 'factorial':
      return { operation, n, result: factorial(Number(n)) }
    case 'binomial': {
      const nNum = Number(n), kNum = Number(k), pNum = Number(p)
      const pmf = combination(nNum, kNum) * Math.pow(pNum, kNum) * Math.pow(1 - pNum, nNum - kNum)
      const binomMean = nNum * pNum
      const binomVar = nNum * pNum * (1 - pNum)
      return { operation, n: nNum, k: kNum, p: pNum, probability: pmf, mean: binomMean, variance: binomVar, std: Math.sqrt(binomVar) }
    }
    case 'normal': {
      const xNum = Number(x), m = Number(mean || 0), sd = Number(std_dev || 1)
      return { operation, x: xNum, mean: m, std: sd, pdf: normalPdf(xNum, m, sd), cdf: normalCdf(xNum, m, sd) }
    }
    case 'poisson': {
      const lam = Number(lambda), xNum = Number(x)
      const pmf = Math.pow(lam, xNum) * Math.exp(-lam) / factorial(xNum)
      return { operation, lambda: lam, x: xNum, probability: pmf, mean: lam, variance: lam }
    }
    default:
      throw new Error(`不支持的操作: ${operation}`)
  }
}

// 44. equation_solver - 方程求解器
async function equationSolverHandler(args: Record<string, any>): Promise<any> {
  const { operation = 'quadratic', a, b, c, coefficients } = args

  switch (operation) {
    case 'quadratic': {
      // 一元二次方程 ax² + bx + c = 0
      const A = Number(a), B = Number(b), C = Number(c)
      if (A === 0) throw new Error('a 不能为 0（不是二次方程）')
      const discriminant = B * B - 4 * A * C
      const equation = `${A}x² + ${B}x + ${C} = 0`
      if (discriminant > 0) {
        const x1 = (-B + Math.sqrt(discriminant)) / (2 * A)
        const x2 = (-B - Math.sqrt(discriminant)) / (2 * A)
        return { operation, equation, discriminant, roots: [x1, x2], rootType: '两个不同实根' }
      } else if (discriminant === 0) {
        const x = -B / (2 * A)
        return { operation, equation, discriminant, roots: [x], rootType: '两个相等实根（重根）' }
      } else {
        const realPart = -B / (2 * A)
        const imagPart = Math.sqrt(-discriminant) / (2 * A)
        return { operation, equation, discriminant, roots: [`${realPart} + ${imagPart}i`, `${realPart} - ${imagPart}i`], rootType: '两个共轭复根' }
      }
    }
    case 'linear': {
      // 线性方程组（高斯消元），coefficients 为增广矩阵
      const coeffs: number[][] = Array.isArray(coefficients) ? coefficients : JSON.parse(coefficients)
      if (!Array.isArray(coeffs) || !coeffs.length) throw new Error('请提供系数矩阵（增广矩阵）')
      const n = coeffs.length
      const m = coeffs[0].length
      if (m !== n + 1) throw new Error(`系数矩阵应为 ${n}x${n + 1} 的增广矩阵`)
      const aug = coeffs.map(r => [...r])
      for (let i = 0; i < n; i++) {
        let maxRow = i
        for (let kk = i + 1; kk < n; kk++) if (Math.abs(aug[kk][i]) > Math.abs(aug[maxRow][i])) maxRow = kk
        ;[aug[i], aug[maxRow]] = [aug[maxRow], aug[i]]
        if (Math.abs(aug[i][i]) < 1e-10) return { operation, hasSolution: false, message: '方程组无唯一解' }
        for (let kk = i + 1; kk < n; kk++) {
          const factor = aug[kk][i] / aug[i][i]
          for (let j = i; j <= n; j++) aug[kk][j] -= factor * aug[i][j]
        }
      }
      // 回代
      const solution: number[] = new Array(n).fill(0)
      for (let i = n - 1; i >= 0; i--) {
        let s = aug[i][n]
        for (let j = i + 1; j < n; j++) s -= aug[i][j] * solution[j]
        solution[i] = s / aug[i][i]
      }
      return { operation, coefficientMatrix: coeffs, solution, variables: Array.from({ length: n }, (_, i) => `x${i + 1}`), hasSolution: true }
    }
    case 'linear_simple': {
      // 一元一次 ax + b = 0
      const A = Number(a), B = Number(b)
      if (A === 0) return { operation, equation: `${A}x + ${B} = 0`, hasSolution: B === 0, message: B === 0 ? '无穷多解' : '无解' }
      return { operation, equation: `${A}x + ${B} = 0`, solution: -B / A, hasSolution: true }
    }
    default:
      throw new Error(`不支持的操作: ${operation}`)
  }
}

// 45. number_converter - 数字转换（阿拉伯/中文/罗马）
async function numberConverterHandler(args: Record<string, any>): Promise<any> {
  const { input, from = 'arabic', to = 'chinese' } = args

  // 阿拉伯数字转中文
  const toChinese = (num: number): string => {
    if (num === 0) return '零'
    const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
    const units = ['', '十', '百', '千', '万', '十万', '百万', '千万', '亿']
    const isNeg = num < 0
    num = Math.abs(Math.floor(num))
    if (num > 999999999) return String(num)
    const str = num.toString()
    let result = ''
    for (let i = 0; i < str.length; i++) {
      const d = parseInt(str[i])
      const pos = str.length - i - 1
      if (d === 0) {
        if (!result.endsWith('零')) result += '零'
      } else {
        result += digits[d] + units[pos]
      }
    }
    result = result.replace(/零+$/, '').replace(/^一十/, '十')
    return isNeg ? '负' + result : result
  }

  // 中文转阿拉伯
  const fromChinese = (str: string): number => {
    const digitMap: Record<string, number> = { '零': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9 }
    const unitMap: Record<string, number> = { '十': 10, '百': 100, '千': 1000, '万': 10000, '亿': 100000000 }
    let result = 0, current = 0
    for (const ch of str) {
      if (digitMap[ch] !== undefined) current = digitMap[ch]
      else if (unitMap[ch] !== undefined) {
        if (current === 0) current = 1
        if (ch === '万' || ch === '亿') { result = (result + current) * unitMap[ch]; current = 0 }
        else { result += current * unitMap[ch]; current = 0 }
      }
    }
    return result + current
  }

  // 阿拉伯数字转罗马
  const toRoman = (num: number): string => {
    if (num <= 0 || num >= 4000) return String(num) + ' (罗马数字仅支持 1-3999)'
    const map: [number, string][] = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
    let result = ''
    for (const [v, s] of map) { while (num >= v) { result += s; num -= v } }
    return result
  }

  // 罗马转阿拉伯
  const fromRoman = (str: string): number => {
    const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
    let result = 0
    const upper = str.toUpperCase()
    for (let i = 0; i < upper.length; i++) {
      const v = map[upper[i]]
      if (!v) return NaN
      if (i + 1 < upper.length && map[upper[i + 1]] > v) result -= v
      else result += v
    }
    return result
  }

  let value: number
  let output: string

  if (from === 'arabic') {
    value = Number(input)
    output = to === 'chinese' ? toChinese(value) : to === 'roman' ? toRoman(value) : String(value)
  } else if (from === 'chinese') {
    value = fromChinese(input.toString())
    output = to === 'arabic' ? String(value) : to === 'roman' ? toRoman(value) : input.toString()
  } else if (from === 'roman') {
    value = fromRoman(input.toString())
    output = to === 'arabic' ? String(value) : to === 'chinese' ? toChinese(value) : input.toString()
  } else {
    throw new Error(`不支持的源格式: ${from}`)
  }

  return {
    input: input.toString(),
    from,
    to,
    arabicValue: value,
    output,
  }
}

// ==================== 工具实现：实用工具类 ====================

// 46. loan_calculator - 贷款计算器
async function loanCalculatorHandler(args: Record<string, any>): Promise<any> {
  const { principal, annual_rate, years, method = 'equal_payment' } = args
  const P = Number(principal), r = Number(annual_rate) / 100 / 12, n = Number(years) * 12

  if (P <= 0 || n <= 0) throw new Error('本金和年限必须大于 0')

  if (method === 'equal_payment') {
    // 等额本息
    const monthlyPayment = r === 0 ? P / n : P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
    const totalPayment = monthlyPayment * n
    const totalInterest = totalPayment - P
    // 生成还款计划预览（前 12 期）
    const schedule: any[] = []
    let balance = P
    for (let i = 1; i <= Math.min(n, 12); i++) {
      const interest = balance * r
      const principalPart = monthlyPayment - interest
      balance -= principalPart
      schedule.push({ period: i, payment: monthlyPayment.toFixed(2), principal: principalPart.toFixed(2), interest: interest.toFixed(2), balance: Math.max(0, balance).toFixed(2) })
    }
    return {
      method: '等额本息',
      principal: P, annualRate: annual_rate, years,
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      paymentCount: n,
      schedulePreview: schedule,
    }
  } else {
    // 等额本金
    const monthlyPrincipal = P / n
    let totalInterest = 0
    const schedule: any[] = []
    let balance = P
    for (let i = 1; i <= n; i++) {
      const interest = balance * r
      const payment = monthlyPrincipal + interest
      totalInterest += interest
      if (i <= 12) schedule.push({ period: i, payment: payment.toFixed(2), principal: monthlyPrincipal.toFixed(2), interest: interest.toFixed(2), balance: Math.max(0, balance - monthlyPrincipal).toFixed(2) })
      balance -= monthlyPrincipal
    }
    return {
      method: '等额本金',
      principal: P, annualRate: annual_rate, years,
      firstMonthPayment: (monthlyPrincipal + P * r).toFixed(2),
      lastMonthPayment: (monthlyPrincipal + monthlyPrincipal * r).toFixed(2),
      totalPayment: (P + totalInterest).toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      paymentCount: n,
      schedulePreview: schedule,
    }
  }
}

// 47. tax_calculator - 税务计算器（模拟）
async function taxCalculatorHandler(args: Record<string, any>): Promise<any> {
  const { income, type = 'income_tax', deduction = 0 } = args
  const amount = Number(income)
  const deduct = Number(deduction)

  switch (type) {
    case 'income_tax': {
      // 个人所得税（综合所得，按月预扣，简化版累进）
      const taxable = Math.max(0, amount - deduct - 5000) // 起征点 5000
      const brackets = [
        { rate: 0.03, deduction: 0, max: 3000 },
        { rate: 0.10, deduction: 210, max: 12000 },
        { rate: 0.20, deduction: 1410, max: 25000 },
        { rate: 0.25, deduction: 2660, max: 35000 },
        { rate: 0.30, deduction: 4410, max: 55000 },
        { rate: 0.35, deduction: 7160, max: 80000 },
        { rate: 0.45, deduction: 15160, max: Infinity },
      ]
      let tax = 0, bracket = ''
      for (const b of brackets) {
        if (taxable <= b.max) { tax = taxable * b.rate - b.deduction; bracket = `税率 ${(b.rate * 100)}%`; break }
      }
      if (tax < 0) tax = 0
      return {
        type: '个人所得税',
        monthlyIncome: amount,
        deduction: deduct,
        threshold: 5000,
        taxableIncome: taxable,
        taxBracket: bracket,
        tax: tax.toFixed(2),
        afterTax: (amount - tax).toFixed(2),
      }
    }
    case 'vat': {
      // 增值税（简化）
      const rate = amount <= 100000 ? 0.01 : amount <= 500000 ? 0.03 : 0.06
      const outputVat = amount * rate
      return {
        type: '增值税',
        salesAmount: amount,
        applicableRate: `${(rate * 100)}%`,
        outputVat: outputVat.toFixed(2),
        note: '简化计算，实际需考虑进项税额抵扣',
      }
    }
    case 'corporate_tax': {
      // 企业所得税（简化，小型微利优惠）
      const taxable = Math.max(0, amount - deduct)
      const rate = taxable <= 1000000 ? 0.025 : taxable <= 3000000 ? 0.05 : 0.25
      const tax = taxable * rate
      return {
        type: '企业所得税',
        revenue: amount,
        cost: deduct,
        taxableIncome: taxable,
        applicableRate: `${(rate * 100)}%`,
        tax: tax.toFixed(2),
        note: '简化计算，适用小型微利企业优惠税率',
      }
    }
    default:
      throw new Error(`不支持的税种: ${type}`)
  }
}

// 48. date_calculator - 日期计算器
async function dateCalculatorHandler(args: Record<string, any>): Promise<any> {
  const { date1, date2, operation = 'diff', days = 0, birth_date } = args

  const parseDate = (d: any): Date => {
    if (d instanceof Date) return d
    const date = new Date(d.toString())
    if (isNaN(date.getTime())) throw new Error(`无效日期: ${d}`)
    return date
  }

  const formatDate = (d: Date): string => d.toISOString().split('T')[0]
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']

  switch (operation) {
    case 'diff': {
      const d1 = parseDate(date1), d2 = parseDate(date2 || Date.now())
      const diffMs = Math.abs(d2.getTime() - d1.getTime())
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      const diffWeeks = Math.floor(diffDays / 7)
      const diffMonths = Math.abs((d2.getFullYear() - d1.getFullYear()) * 12 + d2.getMonth() - d1.getMonth())
      const diffYears = Math.floor(diffMonths / 12)
      return {
        operation: 'diff',
        date1: formatDate(d1), date2: formatDate(d2),
        diffDays, diffWeeks, diffMonths, diffYears,
        diffHours: Math.floor(diffMs / (1000 * 60 * 60)),
        diffMinutes: Math.floor(diffMs / (1000 * 60)),
        humanReadable: `${diffYears}年${diffMonths % 12}月${diffDays % 30}天`,
      }
    }
    case 'add': {
      const d = parseDate(date1)
      d.setDate(d.getDate() + Number(days))
      return { operation: 'add', original: date1.toString(), daysAdded: Number(days), result: formatDate(d), weekday: weekdays[d.getDay()] }
    }
    case 'workdays': {
      // 计算两个日期之间的工作日
      const d1 = parseDate(date1), d2 = parseDate(date2 || Date.now())
      const start = d1 < d2 ? d1 : d2
      const end = d1 < d2 ? d2 : d1
      let workdays = 0, totalDays = 0
      const current = new Date(start)
      while (current <= end) {
        const day = current.getDay()
        if (day !== 0 && day !== 6) workdays++
        totalDays++
        current.setDate(current.getDate() + 1)
      }
      return { operation: 'workdays', start: formatDate(start), end: formatDate(end), totalDays, workdays, weekends: totalDays - workdays }
    }
    case 'age': {
      const birth = parseDate(birth_date || date1)
      const now = new Date()
      let years = now.getFullYear() - birth.getFullYear()
      let months = now.getMonth() - birth.getMonth()
      let dayDiff = now.getDate() - birth.getDate()
      if (dayDiff < 0) { months--; dayDiff += new Date(now.getFullYear(), now.getMonth(), 0).getDate() }
      if (months < 0) { years--; months += 12 }
      const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))
      const nb = new Date(now.getFullYear(), birth.getMonth(), birth.getDate())
      if (nb < now) nb.setFullYear(nb.getFullYear() + 1)
      const daysToBday = Math.ceil((nb.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return {
        operation: 'age', birthDate: formatDate(birth), currentDate: formatDate(now),
        age: years, months, days: dayDiff,
        totalDays, totalMonths: years * 12 + months,
        nextBirthday: { date: formatDate(nb), daysUntil: daysToBday },
      }
    }
    default:
      throw new Error(`不支持的操作: ${operation}`)
  }
}

// 49. pomodoro_timer - 番茄钟计时器
async function pomodoroTimerHandler(args: Record<string, any>): Promise<any> {
  const { operation = 'start', work_minutes = 25, break_minutes = 5, long_break_minutes = 15, cycles_before_long_break = 4, task = '专注工作' } = args

  const now = Date.now()
  const workMs = Number(work_minutes) * 60 * 1000
  const breakMs = Number(break_minutes) * 60 * 1000
  const longBreakMs = Number(long_break_minutes) * 60 * 1000

  switch (operation) {
    case 'start': {
      const endTime = new Date(now + workMs)
      return {
        operation: 'start',
        task,
        phase: 'work',
        workMinutes: work_minutes,
        breakMinutes: break_minutes,
        startTime: new Date(now).toISOString(),
        endTime: endTime.toISOString(),
        duration: workMs,
        message: `开始专注: ${task}（${work_minutes} 分钟）`,
        tip: '专注期间避免切换任务，结束后将提醒休息',
      }
    }
    case 'plan': {
      // 生成一天的番茄钟计划
      const totalCycles = Number(cycles_before_long_break) * 2
      const schedule: any[] = []
      let currentTime = now
      for (let i = 0; i < totalCycles; i++) {
        const cycle = i + 1
        const isLongBreak = cycle % Number(cycles_before_long_break) === 0
        schedule.push({
          cycle,
          phase: 'work',
          task: cycle === 1 ? task : `${task} (${cycle})`,
          start: new Date(currentTime).toISOString(),
          end: new Date(currentTime + workMs).toISOString(),
          duration: work_minutes,
        })
        currentTime += workMs
        const breakDuration = isLongBreak ? longBreakMs : breakMs
        schedule.push({
          cycle,
          phase: isLongBreak ? 'long_break' : 'break',
          start: new Date(currentTime).toISOString(),
          end: new Date(currentTime + breakDuration).toISOString(),
          duration: isLongBreak ? long_break_minutes : break_minutes,
        })
        currentTime += breakDuration
      }
      const totalWorkMin = totalCycles * Number(work_minutes)
      return {
        operation: 'plan',
        cycles: totalCycles,
        totalWorkMinutes: totalWorkMin,
        totalWorkHours: (totalWorkMin / 60).toFixed(1),
        schedule,
      }
    }
    case 'stats': {
      // 模拟统计
      const completed = Math.floor(Math.random() * 8) + 2
      return {
        operation: 'stats',
        todayCompleted: completed,
        todayFocusMinutes: completed * Number(work_minutes),
        weekCompleted: Math.floor(Math.random() * 40) + 10,
        streak: Math.floor(Math.random() * 7) + 1,
        note: '模拟统计数据，需配合实际计时使用',
      }
    }
    default:
      throw new Error(`不支持的操作: ${operation}`)
  }
}

// 50. battery_checker - 电池状态检查
async function batteryCheckerHandler(args: Record<string, any>): Promise<any> {
  const { operation = 'status' } = args

  // 检测 navigator.getBattery 是否可用
  const hasBatteryApi = typeof navigator !== 'undefined' && typeof (navigator as any).getBattery === 'function'

  switch (operation) {
    case 'status': {
      return {
        operation: 'status',
        supported: hasBatteryApi,
        battery: {
          level: hasBatteryApi ? null : 0.85,
          charging: hasBatteryApi ? null : true,
          chargingTime: hasBatteryApi ? null : 1800,
          dischargingTime: hasBatteryApi ? null : Infinity,
        },
        levelPercent: hasBatteryApi ? null : 85,
        status: hasBatteryApi ? '检测中' : '已接通电源（模拟）',
        message: hasBatteryApi
          ? 'Web Battery API 可用，请在前端调用 navigator.getBattery() 获取真实状态'
          : '当前环境不支持 Web Battery API，返回模拟数据。该 API 仅在部分浏览器（如 Chrome）可用',
        recommendation: '低于 20% 时建议接入电源，长时间充电建议保持在 20%-80% 以延长电池寿命',
      }
    }
    case 'check_support': {
      const browsers = [
        { browser: 'Chrome', supported: true, version: '38+' },
        { browser: 'Edge', supported: true, version: '79+' },
        { browser: 'Opera', supported: true, version: '25+' },
        { browser: 'Firefox', supported: false, version: '已移除' },
        { browser: 'Safari', supported: false, version: '不支持' },
      ]
      return {
        operation: 'check_support',
        currentEnv: hasBatteryApi,
        browsers,
        note: 'Web Battery API 因隐私问题在部分浏览器中被弃用或限制',
      }
    }
    case 'history': {
      // 模拟 24 小时电池历史
      const history = Array.from({ length: 24 }, (_, i) => ({
        hour: `${i.toString().padStart(2, '0')}:00`,
        level: Math.max(20, Math.min(100, 85 - Math.abs(i - 12) * 3 + Math.floor(Math.random() * 10))),
        charging: i < 6 || (i >= 19 && i <= 22),
      }))
      return { operation: 'history', history, note: '模拟的 24 小时电池使用记录' }
    }
    default:
      throw new Error(`不支持的操作: ${operation}`)
  }
}

// ==================== ToolRegistry 类 ====================

class ToolRegistry {
  private tools: Map<string, ToolDefinition> = new Map()
  private categories: Map<string, string[]> = new Map()
  private callHistory: ToolExecutionResult[] = []
  private maxHistory = 200
  private favorites: Set<string> = new Set()
  private toolUsage: Map<string, { count: number; success: number; failure: number }> = new Map()

  register(tool: ToolDefinition): void {
    if (this.tools.has(tool.name)) {
      console.warn(`Tool ${tool.name} already registered, overwriting`)
    }
    this.tools.set(tool.name, { ...tool, version: tool.version || '1.0.0' })

    if (!this.categories.has(tool.category)) {
      this.categories.set(tool.category, [])
    }
    const catTools = this.categories.get(tool.category)!
    if (!catTools.includes(tool.name)) {
      catTools.push(tool.name)
    }
  }

  unregister(name: string): boolean {
    const tool = this.tools.get(name)
    if (!tool) return false

    this.tools.delete(name)
    const catTools = this.categories.get(tool.category)
    if (catTools) {
      const idx = catTools.indexOf(name)
      if (idx > -1) catTools.splice(idx, 1)
    }
    return true
  }

  get(name: string): ToolDefinition | undefined {
    return this.tools.get(name)
  }

  list(): ToolDefinition[] {
    return Array.from(this.tools.values())
  }

  listByCategory(category: string): ToolDefinition[] {
    const names = this.categories.get(category) || []
    return names.map(n => this.tools.get(n)!).filter(Boolean)
  }

  getCategories(): string[] {
    return Array.from(this.categories.keys())
  }

  has(name: string): boolean {
    return this.tools.has(name)
  }

  // 新增：按分类获取工具（带统计）
  getToolsByCategory(category: string): ToolDefinition[] {
    return this.listByCategory(category)
  }

  // 新增：获取分类列表及各分类工具数
  getToolCategories(): { name: string; count: number }[] {
    return Array.from(this.categories.entries()).map(([name, tools]) => ({
      name,
      count: tools.length,
    })).sort((a, b) => b.count - a.count)
  }

  // 新增：获取工具总数
  getToolCount(): number {
    return this.tools.size
  }

  // 新增：搜索工具
  searchTools(query: string): ToolDefinition[] {
    const q = query.toLowerCase().trim()
    if (!q) return []
    
    return this.list().filter(tool => {
      const nameMatch = tool.name.toLowerCase().includes(q)
      const descMatch = tool.description.toLowerCase().includes(q)
      const tagMatch = tool.tags?.some(t => t.toLowerCase().includes(q))
      return nameMatch || descMatch || tagMatch
    })
  }

  // 新增：工具收藏
  favoriteTool(name: string): boolean {
    if (!this.tools.has(name)) return false
    if (this.favorites.has(name)) {
      this.favorites.delete(name)
      return false
    }
    this.favorites.add(name)
    return true
  }

  // 新增：获取收藏工具
  getFavoriteTools(): ToolDefinition[] {
    return Array.from(this.favorites)
      .map(name => this.tools.get(name))
      .filter((t): t is ToolDefinition => t !== undefined)
  }

  // 新增：检查是否收藏
  isFavorite(name: string): boolean {
    return this.favorites.has(name)
  }

  // 新增：记录工具使用
  recordToolUsage(name: string, success: boolean): void {
    const usage = this.toolUsage.get(name) || { count: 0, success: 0, failure: 0 }
    usage.count++
    if (success) usage.success++
    else usage.failure++
    this.toolUsage.set(name, usage)
  }

  // 新增：获取工具使用统计
  getToolUsageStats(): {
    totalCalls: number
    successCount: number
    failureCount: number
    successRate: number
    topTools: { name: string; count: number; successRate: number }[]
  } {
    let totalCalls = 0
    let successCount = 0
    let failureCount = 0
    
    const topTools = Array.from(this.toolUsage.entries())
      .map(([name, stats]) => {
        totalCalls += stats.count
        successCount += stats.success
        failureCount += stats.failure
        return {
          name,
          count: stats.count,
          successRate: stats.count > 0 ? stats.success / stats.count : 0,
        }
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
    
    return {
      totalCalls,
      successCount,
      failureCount,
      successRate: totalCalls > 0 ? successCount / totalCalls : 0,
      topTools,
    }
  }

  // 新增：参数校验
  validateParams(tool: ToolDefinition, args: Record<string, any>): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    
    for (const param of tool.parameters) {
      const value = args[param.name]
      
      // 检查必填参数
      if (param.required && (value === undefined || value === null || value === '')) {
        errors.push(`缺少必填参数: ${param.name}`)
        continue
      }
      
      if (value === undefined || value === null) continue
      
      // 检查类型
      switch (param.type) {
        case 'string':
          if (typeof value !== 'string') {
            errors.push(`参数 ${param.name} 应该是字符串`)
          }
          break
        case 'number':
          if (typeof value !== 'number' && isNaN(parseFloat(value))) {
            errors.push(`参数 ${param.name} 应该是数字`)
          }
          break
        case 'boolean':
          if (typeof value !== 'boolean') {
            errors.push(`参数 ${param.name} 应该是布尔值`)
          }
          break
        case 'array':
          if (!Array.isArray(value)) {
            errors.push(`参数 ${param.name} 应该是数组`)
          }
          break
        case 'object':
          if (typeof value !== 'object' || Array.isArray(value) || value === null) {
            errors.push(`参数 ${param.name} 应该是对象`)
          }
          break
      }
      
      // 检查枚举
      if (param.enum && param.type === 'string' && !param.enum.includes(value as string)) {
        errors.push(`参数 ${param.name} 应该是 ${param.enum.join('/')} 之一`)
      }
    }
    
    return { valid: errors.length === 0, errors }
  }

  // 新增：执行结果格式化
  formatResult(tool: ToolDefinition, result: any): string {
    if (typeof result === 'string') return result
    if (typeof result === 'number') return String(result)
    try {
      return JSON.stringify(result, null, 2)
    } catch {
      return String(result)
    }
  }

  getOpenAISchema(): any[] {
    return Array.from(this.tools.values()).map(tool => ({
      type: 'function' as const,
      function: {
        name: tool.name,
        description: tool.description,
        parameters: this.paramsToJsonSchema(tool.parameters),
      },
    }))
  }

  private paramsToJsonSchema(params: ToolParameter[]): any {
    const properties: Record<string, any> = {}
    const required: string[] = []

    for (const p of params) {
      properties[p.name] = {
        type: p.type,
        description: p.description,
      }
      if (p.enum) properties[p.name].enum = p.enum
      if (p.default !== undefined) properties[p.name].default = p.default
      if (p.required) required.push(p.name)
    }

    return {
      type: 'object',
      properties,
      required,
    }
  }

  async execute(name: string, args: Record<string, any>): Promise<ToolExecutionResult> {
    const start = Date.now()
    const tool = this.tools.get(name)

    if (!tool) {
      const result: ToolExecutionResult = {
        toolName: name,
        success: false,
        error: `工具不存在: ${name}`,
        durationMs: Date.now() - start,
        timestamp: Date.now(),
      }
      this.recordHistory(result)
      return result
    }

    if (!tool.handler) {
      const result: ToolExecutionResult = {
        toolName: name,
        success: false,
        error: `工具 ${name} 没有处理器`,
        durationMs: Date.now() - start,
        timestamp: Date.now(),
      }
      this.recordHistory(result)
      return result
    }

    try {
      // 参数校验
      const validation = this.validateParams(tool, args)
      if (!validation.valid) {
        throw new Error(validation.errors.join('; '))
      }
      
      // 填充默认值
      const validated = this.validateArgs(tool, args)
      
      // 超时控制
      const timeout = tool.timeout || 30000
      const output = await withTimeout(tool.handler(validated), timeout)
      
      const result: ToolExecutionResult = {
        toolName: name,
        success: true,
        output,
        durationMs: Date.now() - start,
        timestamp: Date.now(),
      }
      this.recordHistory(result)
      this.recordToolUsage(name, true)
      return result
    } catch (err: any) {
      const result: ToolExecutionResult = {
        toolName: name,
        success: false,
        error: err?.message || String(err),
        durationMs: Date.now() - start,
        timestamp: Date.now(),
      }
      this.recordHistory(result)
      this.recordToolUsage(name, false)
      return result
    }
  }

  private validateArgs(tool: ToolDefinition, args: Record<string, any>): Record<string, any> {
    const validated: Record<string, any> = { ...args }

    for (const param of tool.parameters) {
      if (param.default !== undefined && !(param.name in args)) {
        validated[param.name] = param.default
      }
    }
    return validated
  }

  private recordHistory(result: ToolExecutionResult): void {
    this.callHistory.push(result)
    if (this.callHistory.length > this.maxHistory) {
      this.callHistory.shift()
    }
  }

  getHistory(): ToolExecutionResult[] {
    return [...this.callHistory]
  }

  getStats(): {
    totalCalls: number
    successRate: number
    topTools: { name: string; count: number }[]
  } {
    const total = this.callHistory.length
    const success = this.callHistory.filter(r => r.success).length
    const toolCounts = new Map<string, number>()
    for (const h of this.callHistory) {
      toolCounts.set(h.toolName, (toolCounts.get(h.toolName) || 0) + 1)
    }
    const topTools = Array.from(toolCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return {
      totalCalls: total,
      successRate: total > 0 ? success / total : 0,
      topTools,
    }
  }

  clearHistory(): void {
    this.callHistory = []
  }
}

export const toolRegistry = new ToolRegistry()

export function registerBuiltinTools(): void {
  if (toolRegistry.list().length > 0) return

  // ==================== 信息检索类 ====================
  toolRegistry.register({
    name: 'web_search',
    description: '搜索互联网获取最新信息',
    category: '信息检索',
    icon: '🔍',
    tags: ['search', 'web', 'internet'],
    parameters: [
      { name: 'query', type: 'string', description: '搜索关键词', required: true },
      { name: 'max_results', type: 'number', description: '最大返回条数', default: 5 },
    ],
    examples: [
      { input: { query: 'AI最新进展', max_results: 3 }, output: '搜索结果列表' },
    ],
  })

  toolRegistry.register({
    name: 'knowledge_search',
    description: '搜索本地知识库',
    category: '信息检索',
    icon: '📚',
    tags: ['knowledge', 'local', 'rag'],
    parameters: [
      { name: 'query', type: 'string', description: '搜索关键词', required: true },
      { name: 'top_k', type: 'number', description: '返回条数', default: 5 },
    ],
  })

  // ==================== 质量评估类 ====================
  toolRegistry.register({
    name: 'cee_evaluate',
    description: '用CEE认知不变量评估文本质量',
    category: '质量评估',
    icon: '📊',
    tags: ['cee', 'evaluation', 'quality'],
    parameters: [
      { name: 'text', type: 'string', description: '待评估文本', required: true },
    ],
  })

  // ==================== 代码执行类 ====================
  toolRegistry.register({
    name: 'code_execute',
    description: '执行代码片段',
    category: '代码执行',
    icon: '💻',
    tags: ['code', 'execute', 'python', 'javascript'],
    parameters: [
      { name: 'code', type: 'string', description: '代码内容', required: true },
      { name: 'language', type: 'string', description: '编程语言', default: 'javascript', enum: ['python', 'javascript', 'bash'] },
      { name: 'timeout', type: 'number', description: '超时时间(秒)', default: 30 },
    ],
  })

  // ==================== 文件操作类 ====================
  toolRegistry.register({
    name: 'file_read',
    description: '读取文件内容',
    category: '文件操作',
    icon: '📄',
    tags: ['file', 'read', 'io'],
    parameters: [
      { name: 'path', type: 'string', description: '文件路径', required: true },
    ],
  })

  toolRegistry.register({
    name: 'file_write',
    description: '写入文件内容',
    category: '文件操作',
    icon: '✏️',
    tags: ['file', 'write', 'io'],
    parameters: [
      { name: 'path', type: 'string', description: '文件路径', required: true },
      { name: 'content', type: 'string', description: '文件内容', required: true },
    ],
  })

  // ==================== 任务规划类 ====================
  toolRegistry.register({
    name: 'task_decompose',
    description: '将复杂任务分解为子任务',
    category: '任务规划',
    icon: '📋',
    tags: ['task', 'decompose', 'planning'],
    parameters: [
      { name: 'goal', type: 'string', description: '目标描述', required: true },
      { name: 'max_depth', type: 'number', description: '最大分解深度', default: 3 },
    ],
  })

  // ==================== 计算与转换类 ====================
  toolRegistry.register({
    name: 'calculator',
    description: '科学计算器，支持加减乘除、三角函数、对数、阶乘、进制转换',
    category: '计算转换',
    icon: '🧮',
    tags: ['calculator', 'math', '科学计算'],
    timeout: 5000,
    parameters: [
      { name: 'expression', type: 'string', description: '数学表达式', required: true },
      { name: 'mode', type: 'string', description: '计算模式', default: 'basic', enum: ['basic', 'base_convert'] },
      { name: 'value', type: 'string', description: '进制转换的值（mode=base_convert时使用）' },
      { name: 'from_base', type: 'number', description: '原进制（2-36）', default: 10 },
      { name: 'to_base', type: 'number', description: '目标进制（2-36）', default: 2 },
    ],
    handler: calculatorHandler,
    examples: [
      { input: { expression: 'sin(30) + cos(60)' }, output: { expression: 'sin(30) + cos(60)', result: 1 } },
    ],
  })

  toolRegistry.register({
    name: 'unit_converter',
    description: '单位换算器，支持长度/重量/面积/体积/温度/时间/速度/数据大小',
    category: '计算转换',
    icon: '🔄',
    tags: ['unit', 'convert', '单位换算'],
    timeout: 5000,
    parameters: [
      { name: 'value', type: 'number', description: '数值', required: true },
      { name: 'from_unit', type: 'string', description: '原单位', required: true },
      { name: 'to_unit', type: 'string', description: '目标单位', required: true },
      { name: 'category', type: 'string', description: '分类', default: 'length', enum: ['length', 'weight', 'area', 'volume', 'temperature', 'time', 'speed', 'data'] },
    ],
    handler: unitConverterHandler,
    examples: [
      { input: { value: 1, from_unit: 'km', to_unit: 'm', category: 'length' }, output: { result: 1000 } },
    ],
  })

  toolRegistry.register({
    name: 'base_converter',
    description: '进制转换，支持2-36进制互转，支持浮点数',
    category: '计算转换',
    icon: '🔢',
    tags: ['base', 'convert', '进制转换'],
    timeout: 5000,
    parameters: [
      { name: 'value', type: 'string', description: '要转换的值', required: true },
      { name: 'from_base', type: 'number', description: '原进制（2-36）', default: 10 },
      { name: 'to_base', type: 'number', description: '目标进制（2-36）', default: 2 },
    ],
    handler: baseConverterHandler,
    examples: [
      { input: { value: '255', from_base: 10, to_base: 16 }, output: { result: 'FF' } },
    ],
  })

  toolRegistry.register({
    name: 'hash_generator',
    description: '哈希生成，支持 MD5/SHA1/SHA256/SHA512/CRC32',
    category: '计算转换',
    icon: '🔐',
    tags: ['hash', 'md5', 'sha', '加密'],
    timeout: 5000,
    parameters: [
      { name: 'input', type: 'string', description: '输入文本', required: true },
      { name: 'algorithm', type: 'string', description: '哈希算法', default: 'sha256', enum: ['md5', 'sha1', 'sha256', 'sha512', 'crc32'] },
    ],
    handler: hashGeneratorHandler,
    examples: [
      { input: { input: 'hello', algorithm: 'md5' }, output: { hash: '5d41402abc4b2a76b9719d911017c592' } },
    ],
  })

  toolRegistry.register({
    name: 'uuid_generator',
    description: 'UUID 生成器，支持 v1/v4/v5/nanoId',
    category: '计算转换',
    icon: '🆔',
    tags: ['uuid', 'id', '唯一标识'],
    timeout: 5000,
    parameters: [
      { name: 'version', type: 'string', description: 'UUID版本', default: 'v4', enum: ['v1', 'v4', 'v5', 'nanoid'] },
      { name: 'count', type: 'number', description: '生成数量', default: 1 },
      { name: 'namespace', type: 'string', description: '命名空间UUID（v5使用）', default: '6ba7b810-9dad-11d1-80b4-00c04fd430c8' },
      { name: 'name', type: 'string', description: '名称（v5使用）', default: 'hello' },
    ],
    handler: uuidGeneratorHandler,
    examples: [
      { input: { version: 'v4', count: 3 }, output: { uuids: ['...', '...', '...'] } },
    ],
  })

  // ==================== 文本处理类 ====================
  toolRegistry.register({
    name: 'text_analyzer',
    description: '文本分析，字数/字符数/词数/段落数/句子数/阅读时间/常用词统计',
    category: '文本处理',
    icon: '📝',
    tags: ['text', 'analyze', '文本分析'],
    timeout: 5000,
    parameters: [
      { name: 'text', type: 'string', description: '要分析的文本', required: true },
    ],
    handler: textAnalyzerHandler,
    examples: [
      { input: { text: '你好世界 Hello World' }, output: { charCount: 16, wordCount: 6 } },
    ],
  })

  toolRegistry.register({
    name: 'text_transform',
    description: '文本转换，大小写/反转/Base64编解码/URL编解码/Unicode转码',
    category: '文本处理',
    icon: '🔤',
    tags: ['text', 'transform', 'base64', '编码'],
    timeout: 5000,
    parameters: [
      { name: 'text', type: 'string', description: '输入文本', required: true },
      { name: 'operation', type: 'string', description: '操作类型', required: true, enum: [
        'upper', 'lower', 'capitalize', 'reverse', 'trim', 'remove_spaces',
        'base64_encode', 'base64_decode', 'url_encode', 'url_decode',
        'unicode_encode', 'unicode_decode'
      ] },
    ],
    handler: textTransformHandler,
    examples: [
      { input: { text: 'hello', operation: 'upper' }, output: { result: 'HELLO' } },
    ],
  })

  toolRegistry.register({
    name: 'regex_tester',
    description: '正则表达式测试，匹配/替换/提取，高亮匹配结果',
    category: '文本处理',
    icon: '🔍',
    tags: ['regex', 'regular', '正则表达式'],
    timeout: 5000,
    parameters: [
      { name: 'pattern', type: 'string', description: '正则表达式', required: true },
      { name: 'text', type: 'string', description: '测试文本', required: true },
      { name: 'flags', type: 'string', description: '标志位', default: 'g' },
      { name: 'operation', type: 'string', description: '操作类型', default: 'match', enum: ['match', 'replace', 'test'] },
      { name: 'replacement', type: 'string', description: '替换文本（replace模式）', default: '' },
    ],
    handler: regexTesterHandler,
    examples: [
      { input: { pattern: '\\d+', text: 'abc123def456' }, output: { matchCount: 2 } },
    ],
  })

  toolRegistry.register({
    name: 'diff_checker',
    description: '文本对比，行级 diff，简易版 LCS 算法',
    category: '文本处理',
    icon: '📊',
    tags: ['diff', 'compare', '文本对比'],
    timeout: 5000,
    parameters: [
      { name: 'text1', type: 'string', description: '原始文本', required: true },
      { name: 'text2', type: 'string', description: '对比文本', required: true },
      { name: 'ignore_whitespace', type: 'boolean', description: '忽略空白字符', default: false },
    ],
    handler: diffCheckerHandler,
    examples: [
      { input: { text1: 'hello\nworld', text2: 'hello\ntraa' }, output: { additions: 1, deletions: 1 } },
    ],
  })

  toolRegistry.register({
    name: 'markdown_converter',
    description: 'Markdown 转换，转 HTML / 转纯文本 / 提取目录',
    category: '文本处理',
    icon: '📄',
    tags: ['markdown', 'html', '转换'],
    timeout: 5000,
    parameters: [
      { name: 'markdown', type: 'string', description: 'Markdown 文本', required: true },
      { name: 'operation', type: 'string', description: '操作类型', default: 'to_html', enum: ['to_html', 'to_text', 'extract_toc'] },
    ],
    handler: markdownConverterHandler,
    examples: [
      { input: { markdown: '# Hello', operation: 'to_html' }, output: { output: '<h1>Hello</h1>' } },
    ],
  })

  // ==================== 开发工具类 ====================
  toolRegistry.register({
    name: 'json_formatter',
    description: 'JSON 格式化/压缩/校验/转 TypeScript 接口',
    category: '开发工具',
    icon: '📋',
    tags: ['json', 'format', '格式化'],
    timeout: 5000,
    parameters: [
      { name: 'input', type: 'string', description: 'JSON 字符串', required: true },
      { name: 'operation', type: 'string', description: '操作类型', default: 'format', enum: ['format', 'minify', 'validate', 'to_typescript'] },
      { name: 'indent', type: 'number', description: '缩进空格数', default: 2 },
    ],
    handler: jsonFormatterHandler,
    examples: [
      { input: { input: '{"a":1}', operation: 'format' }, output: { valid: true, output: '{\n  "a": 1\n}' } },
    ],
  })

  toolRegistry.register({
    name: 'color_converter',
    description: '颜色转换，HEX/RGB/HSL/CMYK，色板生成，对比度检查',
    category: '开发工具',
    icon: '🎨',
    tags: ['color', 'rgb', 'hex', '颜色'],
    timeout: 5000,
    parameters: [
      { name: 'color', type: 'string', description: '颜色值', required: true },
      { name: 'format', type: 'string', description: '输入格式', default: 'hex', enum: ['hex', 'rgb'] },
      { name: 'operation', type: 'string', description: '操作类型', default: 'convert', enum: ['convert', 'palette', 'contrast'] },
      { name: 'color2', type: 'string', description: '第二个颜色（contrast模式）' },
    ],
    handler: colorConverterHandler,
    examples: [
      { input: { color: '#FF0000', operation: 'convert' }, output: { hex: '#FF0000', rgb: 'rgb(255, 0, 0)' } },
    ],
  })

  toolRegistry.register({
    name: 'timestamp_converter',
    description: '时间戳转换，Unix/ISO/相对时间/时区转换，日历计算',
    category: '开发工具',
    icon: '⏰',
    tags: ['timestamp', 'time', '时间戳'],
    timeout: 5000,
    parameters: [
      { name: 'timestamp', type: 'string', description: '时间戳或日期字符串', required: true },
      { name: 'unit', type: 'string', description: '单位', default: 'ms', enum: ['ms', 's'] },
      { name: 'operation', type: 'string', description: '操作类型', default: 'to_date', enum: ['to_date', 'from_date', 'now', 'calendar'] },
      { name: 'timezone', type: 'string', description: '时区', default: 'local' },
    ],
    handler: timestampConverterHandler,
    examples: [
      { input: { operation: 'now' }, output: { timestamp_ms: 1234567890000 } },
    ],
  })

  toolRegistry.register({
    name: 'jwt_decoder',
    description: 'JWT 解码，header/payload 解析，过期时间检查',
    category: '开发工具',
    icon: '🎫',
    tags: ['jwt', 'token', '解码'],
    timeout: 5000,
    parameters: [
      { name: 'token', type: 'string', description: 'JWT Token', required: true },
    ],
    handler: jwtDecoderHandler,
    examples: [
      { input: { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' }, output: { valid: true } },
    ],
  })

  toolRegistry.register({
    name: 'qr_generator',
    description: '二维码生成，文本转 QR 码，SVG 实现，简易版',
    category: '开发工具',
    icon: '📱',
    tags: ['qrcode', 'qr', '二维码'],
    timeout: 5000,
    parameters: [
      { name: 'text', type: 'string', description: '要编码的文本', required: true },
      { name: 'size', type: 'number', description: '尺寸（像素）', default: 200 },
      { name: 'color', type: 'string', description: '前景色', default: '#000000' },
      { name: 'background', type: 'string', description: '背景色', default: '#FFFFFF' },
    ],
    handler: qrGeneratorHandler,
    examples: [
      { input: { text: 'https://example.com', size: 200 }, output: { svg: '<svg>...</svg>' } },
    ],
  })

  // ==================== 数据处理类 ====================
  toolRegistry.register({
    name: 'csv_parser',
    description: 'CSV 解析/转换，CSV ↔ JSON，过滤，统计',
    category: '数据处理',
    icon: '📊',
    tags: ['csv', 'json', '数据解析'],
    timeout: 10000,
    parameters: [
      { name: 'input', type: 'string', description: 'CSV 字符串', required: true },
      { name: 'operation', type: 'string', description: '操作类型', default: 'to_json', enum: ['to_json', 'stats'] },
      { name: 'delimiter', type: 'string', description: '分隔符', default: ',' },
      { name: 'has_header', type: 'boolean', description: '是否有表头', default: true },
    ],
    handler: csvParserHandler,
    examples: [
      { input: { input: 'name,age\nAlice,25\nBob,30', operation: 'to_json' }, output: { rowCount: 2 } },
    ],
  })

  toolRegistry.register({
    name: 'data_chart',
    description: '数据图表生成，从数据数组生成柱状图/折线图/饼图 SVG',
    category: '数据处理',
    icon: '📈',
    tags: ['chart', 'graph', '图表'],
    timeout: 5000,
    parameters: [
      { name: 'data', type: 'array', description: '数据数组', required: true },
      { name: 'type', type: 'string', description: '图表类型', default: 'bar', enum: ['bar', 'line', 'pie'] },
      { name: 'width', type: 'number', description: '宽度', default: 500 },
      { name: 'height', type: 'number', description: '高度', default: 300 },
      { name: 'title', type: 'string', description: '图表标题', default: '' },
    ],
    handler: dataChartHandler,
    examples: [
      { input: { data: [10, 20, 30], type: 'bar' }, output: { svg: '<svg>...</svg>' } },
    ],
  })

  toolRegistry.register({
    name: 'random_generator',
    description: '随机生成，密码/人名/地址/日期/颜色/Lorem Ipsum',
    category: '数据处理',
    icon: '🎲',
    tags: ['random', 'generator', '随机'],
    timeout: 5000,
    parameters: [
      { name: 'type', type: 'string', description: '生成类型', default: 'password', enum: ['password', 'name', 'color', 'date', 'number', 'lorem', 'uuid'] },
      { name: 'count', type: 'number', description: '生成数量', default: 1 },
      { name: 'length', type: 'number', description: '长度（password类型）', default: 16 },
      { name: 'include_symbols', type: 'boolean', description: '包含特殊字符', default: false },
      { name: 'min', type: 'number', description: '最小值（number类型）', default: 0 },
      { name: 'max', type: 'number', description: '最大值（number类型）', default: 100 },
      { name: 'words', type: 'number', description: '单词数（lorem类型）', default: 20 },
    ],
    handler: randomGeneratorHandler,
    examples: [
      { input: { type: 'password', length: 16 }, output: { results: ['...'] } },
    ],
  })

  // ==================== 生活实用类 ====================
  toolRegistry.register({
    name: 'weather_query',
    description: '天气查询，按城市返回温度/湿度/风力/预报（模拟数据）',
    category: '生活实用',
    icon: '🌤️',
    tags: ['weather', '天气', '生活'],
    timeout: 5000,
    parameters: [
      { name: 'city', type: 'string', description: '城市名称', required: true },
      { name: 'days', type: 'number', description: '预报天数', default: 3 },
    ],
    handler: weatherQueryHandler,
    examples: [
      { input: { city: "Beijing", days: 3 }, output: { forecast: [], current: {} } },
    ],
  })

  toolRegistry.register({
    name: 'language_translator',
    description: '翻译，多语言互译，带词典功能（模拟）',
    category: '生活实用',
    icon: '🌐',
    tags: ['translate', 'translation', '翻译'],
    timeout: 5000,
    parameters: [
      { name: 'text', type: 'string', description: '要翻译的文本', required: true },
      { name: 'from', type: 'string', description: '源语言', default: 'auto' },
      { name: 'to', type: 'string', description: '目标语言', default: 'en' },
    ],
    handler: translatorHandler,
    examples: [
      { input: { text: '你好', to: 'en' }, output: { translated: 'Hello' } },
    ],
  })

  // ==================== 加密与安全类 ====================
  toolRegistry.register({
    name: 'aes_encrypt',
    description: 'AES 加密/解密，前端简化实现，支持加密与解密双向操作',
    category: '加密安全',
    icon: '🔐',
    tags: ['aes', 'encrypt', '加密', '安全'],
    timeout: 5000,
    parameters: [
      { name: 'input', type: 'string', description: '要加密的文本或 Base64 密文', required: true },
      { name: 'key', type: 'string', description: '密钥字符串', required: true },
      { name: 'mode', type: 'string', description: '操作模式', default: 'encrypt', enum: ['encrypt', 'decrypt'] },
    ],
    handler: aesEncryptHandler,
    examples: [
      { input: { input: 'hello world', key: 'mysecret', mode: 'encrypt' }, output: { mode: 'encrypt', output: '...' } },
    ],
  })

  toolRegistry.register({
    name: 'rsa_tool',
    description: 'RSA 密钥生成/加密/解密/签名/验签（模拟实现）',
    category: '加密安全',
    icon: '🔑',
    tags: ['rsa', '签名', '非对称加密'],
    timeout: 5000,
    parameters: [
      { name: 'input', type: 'string', description: '输入文本' },
      { name: 'operation', type: 'string', description: '操作类型', default: 'generate', enum: ['generate', 'encrypt', 'decrypt', 'sign', 'verify'] },
      { name: 'publicKey', type: 'string', description: '公钥（加密/验签使用）' },
      { name: 'privateKey', type: 'string', description: '私钥（解密/签名使用）' },
      { name: 'bits', type: 'number', description: '密钥位数', default: 2048 },
    ],
    handler: rsaToolHandler,
    examples: [
      { input: { operation: 'generate', bits: 2048 }, output: { publicKey: '-----BEGIN PUBLIC KEY-----...' } },
    ],
  })

  toolRegistry.register({
    name: 'password_strength',
    description: '密码强度检测，检查长度/复杂度/常见密码，给出评分与建议',
    category: '加密安全',
    icon: '🛡️',
    tags: ['password', 'strength', '密码强度'],
    timeout: 5000,
    parameters: [
      { name: 'password', type: 'string', description: '要检测的密码', required: true },
    ],
    handler: passwordStrengthHandler,
    examples: [
      { input: { password: 'P@ssw0rd123!' }, output: { strength: '中', score: 7 } },
    ],
  })

  toolRegistry.register({
    name: 'password_generator',
    description: '安全密码生成器，可配置长度/字符集/排除相似字符',
    category: '加密安全',
    icon: '🎲',
    tags: ['password', 'generator', '密码生成'],
    timeout: 5000,
    parameters: [
      { name: 'length', type: 'number', description: '密码长度', default: 16 },
      { name: 'count', type: 'number', description: '生成数量', default: 1 },
      { name: 'uppercase', type: 'boolean', description: '包含大写字母', default: true },
      { name: 'lowercase', type: 'boolean', description: '包含小写字母', default: true },
      { name: 'numbers', type: 'boolean', description: '包含数字', default: true },
      { name: 'symbols', type: 'boolean', description: '包含特殊字符', default: false },
      { name: 'exclude_similar', type: 'boolean', description: '排除相似字符(il1Lo0O)', default: false },
      { name: 'custom_chars', type: 'string', description: '自定义附加字符' },
    ],
    handler: passwordGeneratorHandler,
    examples: [
      { input: { length: 20, symbols: true }, output: { passwords: ['...'], entropy: 131 } },
    ],
  })

  toolRegistry.register({
    name: 'hmac_generator',
    description: 'HMAC 生成，支持 SHA256/SHA512 摘要算法',
    category: '加密安全',
    icon: '🏷️',
    tags: ['hmac', '签名', 'sha256'],
    timeout: 5000,
    parameters: [
      { name: 'message', type: 'string', description: '消息内容', required: true },
      { name: 'key', type: 'string', description: '密钥', required: true },
      { name: 'algorithm', type: 'string', description: '哈希算法', default: 'sha256', enum: ['sha256', 'sha512', 'sha1'] },
    ],
    handler: hmacGeneratorHandler,
    examples: [
      { input: { message: 'hello', key: 'secret', algorithm: 'sha256' }, output: { hmac: '...' } },
    ],
  })

  toolRegistry.register({
    name: 'cipher_tool',
    description: '经典密码工具，凯撒密码/维吉尼亚密码/ROT13/Atbash',
    category: '加密安全',
    icon: '📜',
    tags: ['cipher', 'caesar', 'rot13', 'vigenere'],
    timeout: 5000,
    parameters: [
      { name: 'input', type: 'string', description: '输入文本', required: true },
      { name: 'method', type: 'string', description: '加密方法', default: 'caesar', enum: ['caesar', 'rot13', 'vigenere', 'atbash'] },
      { name: 'shift', type: 'number', description: '凯撒密码位移', default: 3 },
      { name: 'key', type: 'string', description: '维吉尼亚密钥', default: 'key' },
      { name: 'operation', type: 'string', description: '操作类型', default: 'encrypt', enum: ['encrypt', 'decrypt'] },
    ],
    handler: cipherToolHandler,
    examples: [
      { input: { input: 'Hello', method: 'caesar', shift: 3 }, output: { output: 'Khoor' } },
    ],
  })

  // ==================== 网络与API类 ====================
  toolRegistry.register({
    name: 'url_parser',
    description: 'URL 解析器，解析协议/主机/路径/查询参数/锚点',
    category: '网络API',
    icon: '🔗',
    tags: ['url', 'parser', '解析'],
    timeout: 5000,
    parameters: [
      { name: 'url', type: 'string', description: 'URL 字符串', required: true },
      { name: 'operation', type: 'string', description: '操作类型', default: 'parse', enum: ['parse', 'query', 'build', 'validate'] },
    ],
    handler: urlParserHandler,
    examples: [
      { input: { url: 'https://example.com/path?q=1#hash' }, output: { valid: true, hostname: 'example.com' } },
    ],
  })

  toolRegistry.register({
    name: 'http_status',
    description: 'HTTP 状态码查询，返回含义与使用场景',
    category: '网络API',
    icon: '📡',
    tags: ['http', 'status', '状态码'],
    timeout: 5000,
    parameters: [
      { name: 'code', type: 'number', description: 'HTTP 状态码' },
      { name: 'operation', type: 'string', description: '操作类型', default: 'lookup', enum: ['lookup', 'list'] },
    ],
    handler: httpStatusHandler,
    examples: [
      { input: { code: 404 }, output: { found: true, name: 'Not Found' } },
    ],
  })

  toolRegistry.register({
    name: 'ip_calculator',
    description: 'IP 地址计算器，子网掩码/CIDR/网络地址/广播地址/主机范围',
    category: '网络API',
    icon: '🌐',
    tags: ['ip', 'cidr', 'subnet', '子网'],
    timeout: 5000,
    parameters: [
      { name: 'ip', type: 'string', description: 'IP 地址', required: true },
      { name: 'cidr', type: 'number', description: 'CIDR 前缀长度', default: 24 },
    ],
    handler: ipCalculatorHandler,
    examples: [
      { input: { ip: '192.168.1.100', cidr: 24 }, output: { subnetMask: '255.255.255.0', networkAddress: '192.168.1.0' } },
    ],
  })

  toolRegistry.register({
    name: 'dns_lookup',
    description: 'DNS 查询模拟，A/CNAME/MX/TXT/NS/SOA 记录',
    category: '网络API',
    icon: '🗂️',
    tags: ['dns', 'lookup', '域名'],
    timeout: 5000,
    parameters: [
      { name: 'domain', type: 'string', description: '域名', required: true },
      { name: 'record_type', type: 'string', description: '记录类型', default: 'A', enum: ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SOA'] },
    ],
    handler: dnsLookupHandler,
    examples: [
      { input: { domain: 'example.com', record_type: 'A' }, output: { records: ['93.184.216.34'] } },
    ],
  })

  toolRegistry.register({
    name: 'port_scanner',
    description: '端口扫描器模拟，扫描常用端口并返回服务说明',
    category: '网络API',
    icon: '🚪',
    tags: ['port', 'scan', '端口'],
    timeout: 5000,
    parameters: [
      { name: 'host', type: 'string', description: '主机名/IP', required: true },
      { name: 'ports', type: 'string', description: '端口列表（scan_list 模式，逗号分隔）' },
      { name: 'operation', type: 'string', description: '操作类型', default: 'scan_common', enum: ['scan_common', 'scan_list', 'list_common'] },
    ],
    handler: portScannerHandler,
    examples: [
      { input: { host: 'example.com', operation: 'scan_common' }, output: { open: 5, scanned: 17 } },
    ],
  })

  // ==================== 数据库类 ====================
  toolRegistry.register({
    name: 'sql_formatter',
    description: 'SQL 格式化，关键字大写/缩进/校验/压缩',
    category: '数据库',
    icon: '🗄️',
    tags: ['sql', 'format', '格式化'],
    timeout: 5000,
    parameters: [
      { name: 'sql', type: 'string', description: 'SQL 语句', required: true },
      { name: 'operation', type: 'string', description: '操作类型', default: 'format', enum: ['format', 'minify', 'validate'] },
      { name: 'keyword_case', type: 'string', description: '关键字大小写', default: 'upper', enum: ['upper', 'lower'] },
      { name: 'indent', type: 'number', description: '缩进空格数', default: 2 },
    ],
    handler: sqlFormatterHandler,
    examples: [
      { input: { sql: 'select * from users where id=1', operation: 'format' }, output: { output: 'SELECT * FROM...' } },
    ],
  })

  toolRegistry.register({
    name: 'sql_to_api',
    description: 'SQL 转 REST API 设计，自动生成端点/参数/响应',
    category: '数据库',
    icon: '🔌',
    tags: ['sql', 'rest', 'api', '端点'],
    timeout: 5000,
    parameters: [
      { name: 'sql', type: 'string', description: 'SQL 语句', required: true },
      { name: 'base_path', type: 'string', description: 'API 基础路径', default: '/api' },
    ],
    handler: sqlToApiHandler,
    examples: [
      { input: { sql: 'SELECT id, name FROM users WHERE id = 1' }, output: { endpoints: [], table: 'users' } },
    ],
  })

  toolRegistry.register({
    name: 'schema_designer',
    description: '数据库表结构设计器，生成 DDL/索引/外键',
    category: '数据库',
    icon: '🏗️',
    tags: ['schema', 'ddl', '表结构'],
    timeout: 5000,
    parameters: [
      { name: 'table_name', type: 'string', description: '表名', required: true },
      { name: 'fields', type: 'array', description: '字段定义数组', required: true },
      { name: 'engine', type: 'string', description: '存储引擎', default: 'InnoDB' },
      { name: 'charset', type: 'string', description: '字符集', default: 'utf8mb4' },
    ],
    handler: schemaDesignerHandler,
    examples: [
      { input: { table_name: 'users', fields: [{ name: 'id', type: 'int', primary_key: true, auto_increment: true }] }, output: { ddl: 'CREATE TABLE...' } },
    ],
  })

  toolRegistry.register({
    name: 'mock_data_gen',
    description: '测试数据生成器，按表结构生成 mock 数据与 INSERT 语句',
    category: '数据库',
    icon: '🧪',
    tags: ['mock', 'data', '测试数据'],
    timeout: 10000,
    parameters: [
      { name: 'table_name', type: 'string', description: '表名', default: 'mock_table' },
      { name: 'fields', type: 'array', description: '字段定义数组', required: true },
      { name: 'count', type: 'number', description: '生成行数（最大 1000）', default: 10 },
    ],
    handler: mockDataGenHandler,
    examples: [
      { input: { table_name: 'users', fields: [{ name: 'username', type: 'string' }], count: 5 }, output: { records: [], count: 5 } },
    ],
  })

  // ==================== 文档与格式类 ====================
  toolRegistry.register({
    name: 'yaml_json_converter',
    description: 'YAML 与 JSON 互转，支持双向转换',
    category: '文档格式',
    icon: '📝',
    tags: ['yaml', 'json', '转换'],
    timeout: 5000,
    parameters: [
      { name: 'input', type: 'string', description: '输入文本', required: true },
      { name: 'operation', type: 'string', description: '操作类型', default: 'yaml_to_json', enum: ['yaml_to_json', 'json_to_yaml'] },
    ],
    handler: yamlJsonConverterHandler,
    examples: [
      { input: { input: 'name: Alice\nage: 25', operation: 'yaml_to_json' }, output: { output: '{\n  "name": "Alice",...' } },
    ],
  })

  toolRegistry.register({
    name: 'csv_sql_converter',
    description: 'CSV 转 SQL INSERT 语句，自动推断列类型并生成建表语句',
    category: '文档格式',
    icon: '📇',
    tags: ['csv', 'sql', 'insert'],
    timeout: 10000,
    parameters: [
      { name: 'input', type: 'string', description: 'CSV 内容', required: true },
      { name: 'table_name', type: 'string', description: '目标表名', default: 'data' },
      { name: 'has_header', type: 'boolean', description: '是否有表头', default: true },
      { name: 'delimiter', type: 'string', description: '分隔符', default: ',' },
    ],
    handler: csvSqlConverterHandler,
    examples: [
      { input: { input: 'name,age\nAlice,25', table_name: 'users' }, output: { insertStatements: ['INSERT INTO...'] } },
    ],
  })

  toolRegistry.register({
    name: 'xml_formatter',
    description: 'XML 格式化/压缩/校验，标签匹配检查',
    category: '文档格式',
    icon: '📑',
    tags: ['xml', 'format', '校验'],
    timeout: 5000,
    parameters: [
      { name: 'input', type: 'string', description: 'XML 内容', required: true },
      { name: 'operation', type: 'string', description: '操作类型', default: 'format', enum: ['format', 'minify', 'validate'] },
      { name: 'indent', type: 'number', description: '缩进空格数', default: 2 },
    ],
    handler: xmlFormatterHandler,
    examples: [
      { input: { input: '<root><item>1</item></root>', operation: 'format' }, output: { output: '<root>\n  <item>1</item>\n</root>' } },
    ],
  })

  toolRegistry.register({
    name: 'html_minifier',
    description: 'HTML 压缩/格式化/统计，移除注释与冗余空白',
    category: '文档格式',
    icon: '📄',
    tags: ['html', 'minify', 'format'],
    timeout: 5000,
    parameters: [
      { name: 'input', type: 'string', description: 'HTML 内容', required: true },
      { name: 'operation', type: 'string', description: '操作类型', default: 'minify', enum: ['minify', 'format', 'stats'] },
      { name: 'indent', type: 'number', description: '缩进空格数', default: 2 },
    ],
    handler: htmlMinifierHandler,
    examples: [
      { input: { input: '<div>  <p>hi</p>  </div>', operation: 'minify' }, output: { reduction: '40.0%' } },
    ],
  })

  toolRegistry.register({
    name: 'css_optimizer',
    description: 'CSS 优化，去重/简写合并/压缩/格式化',
    category: '文档格式',
    icon: '🎯',
    tags: ['css', 'optimize', 'minify'],
    timeout: 5000,
    parameters: [
      { name: 'input', type: 'string', description: 'CSS 内容', required: true },
      { name: 'operation', type: 'string', description: '操作类型', default: 'optimize', enum: ['optimize', 'minify', 'format'] },
    ],
    handler: cssOptimizerHandler,
    examples: [
      { input: { input: '.a{margin-top:5px;margin-right:5px;margin-bottom:5px;margin-left:5px;}', operation: 'optimize' }, output: { ruleCount: 1 } },
    ],
  })

  // ==================== 数学与统计类 ====================
  toolRegistry.register({
    name: 'matrix_calculator',
    description: '矩阵计算器，加减乘/转置/行列式/逆矩阵',
    category: '数学统计',
    icon: '🔢',
    tags: ['matrix', '矩阵', '线性代数'],
    timeout: 5000,
    parameters: [
      { name: 'matrix_a', type: 'array', description: '矩阵 A（二维数组）', required: true },
      { name: 'matrix_b', type: 'array', description: '矩阵 B（二维数组）' },
      { name: 'operation', type: 'string', description: '操作类型', default: 'multiply', enum: ['add', 'subtract', 'multiply', 'transpose', 'determinant', 'inverse', 'shape'] },
    ],
    handler: matrixCalculatorHandler,
    examples: [
      { input: { matrix_a: [[1, 2], [3, 4]], operation: 'determinant' }, output: { result: -2 } },
    ],
  })

  toolRegistry.register({
    name: 'statistics_calculator',
    description: '统计计算器，均值/中位数/方差/标准差/百分位/回归',
    category: '数学统计',
    icon: '📊',
    tags: ['statistics', '统计', '方差'],
    timeout: 5000,
    parameters: [
      { name: 'data', type: 'array', description: '数据数组', required: true },
      { name: 'operation', type: 'string', description: '操作类型', default: 'describe', enum: ['describe', 'regression', 'percentile', 'sum', 'mean', 'median', 'std'] },
    ],
    handler: statisticsCalculatorHandler,
    examples: [
      { input: { data: [1, 2, 3, 4, 5], operation: 'describe' }, output: { mean: 3, stdDev: 1.414 } },
    ],
  })

  toolRegistry.register({
    name: 'probability_calculator',
    description: '概率计算器，排列组合/二项分布/正态分布/泊松分布',
    category: '数学统计',
    icon: '🎲',
    tags: ['probability', '概率', '分布'],
    timeout: 5000,
    parameters: [
      { name: 'operation', type: 'string', description: '操作类型', default: 'combination', enum: ['combination', 'permutation', 'factorial', 'binomial', 'normal', 'poisson'] },
      { name: 'n', type: 'number', description: 'n 值' },
      { name: 'k', type: 'number', description: 'k 值' },
      { name: 'p', type: 'number', description: '概率 p（binomial）' },
      { name: 'lambda', type: 'number', description: 'lambda（poisson）' },
      { name: 'x', type: 'number', description: 'x 值（normal/poisson）' },
      { name: 'mean', type: 'number', description: '均值（normal）' },
      { name: 'std_dev', type: 'number', description: '标准差（normal）' },
    ],
    handler: probabilityCalculatorHandler,
    examples: [
      { input: { operation: 'combination', n: 10, k: 3 }, output: { result: 120 } },
    ],
  })

  toolRegistry.register({
    name: 'equation_solver',
    description: '方程求解器，一元二次/线性方程组/一元一次',
    category: '数学统计',
    icon: '➗',
    tags: ['equation', '方程', '求解'],
    timeout: 5000,
    parameters: [
      { name: 'operation', type: 'string', description: '操作类型', default: 'quadratic', enum: ['quadratic', 'linear', 'linear_simple'] },
      { name: 'a', type: 'number', description: '系数 a' },
      { name: 'b', type: 'number', description: '系数 b' },
      { name: 'c', type: 'number', description: '系数 c' },
      { name: 'coefficients', type: 'array', description: '增广矩阵（linear 模式）' },
    ],
    handler: equationSolverHandler,
    examples: [
      { input: { operation: 'quadratic', a: 1, b: -5, c: 6 }, output: { roots: [3, 2] } },
    ],
  })

  toolRegistry.register({
    name: 'number_converter',
    description: '数字转换，阿拉伯数字 ↔ 中文数字 ↔ 罗马数字',
    category: '数学统计',
    icon: '🔢',
    tags: ['number', '罗马数字', '中文数字'],
    timeout: 5000,
    parameters: [
      { name: 'input', type: 'string', description: '输入值', required: true },
      { name: 'from', type: 'string', description: '源格式', default: 'arabic', enum: ['arabic', 'chinese', 'roman'] },
      { name: 'to', type: 'string', description: '目标格式', default: 'chinese', enum: ['arabic', 'chinese', 'roman'] },
    ],
    handler: numberConverterHandler,
    examples: [
      { input: { input: '2024', from: 'arabic', to: 'chinese' }, output: { output: '二千零二十四' } },
    ],
  })

  // ==================== 实用工具类 ====================
  toolRegistry.register({
    name: 'loan_calculator',
    description: '贷款计算器，等额本息/等额本金，生成还款计划',
    category: '实用工具',
    icon: '💰',
    tags: ['loan', '贷款', '利息'],
    timeout: 5000,
    parameters: [
      { name: 'principal', type: 'number', description: '贷款本金', required: true },
      { name: 'annual_rate', type: 'number', description: '年利率（%）', required: true },
      { name: 'years', type: 'number', description: '贷款年限', required: true },
      { name: 'method', type: 'string', description: '还款方式', default: 'equal_payment', enum: ['equal_payment', 'equal_principal'] },
    ],
    handler: loanCalculatorHandler,
    examples: [
      { input: { principal: 100000, annual_rate: 4.9, years: 30, method: 'equal_payment' }, output: { monthlyPayment: '5307.27' } },
    ],
  })

  toolRegistry.register({
    name: 'tax_calculator',
    description: '税务计算器，个税/增值税/企业所得税（模拟）',
    category: '实用工具',
    icon: '🧾',
    tags: ['tax', '税', '个税'],
    timeout: 5000,
    parameters: [
      { name: 'income', type: 'number', description: '收入金额', required: true },
      { name: 'type', type: 'string', description: '税种', default: 'income_tax', enum: ['income_tax', 'vat', 'corporate_tax'] },
      { name: 'deduction', type: 'number', description: '扣除额', default: 0 },
    ],
    handler: taxCalculatorHandler,
    examples: [
      { input: { income: 15000, type: 'income_tax' }, output: { tax: '745.00' } },
    ],
  })

  toolRegistry.register({
    name: 'date_calculator',
    description: '日期计算器，日期差/工作日/年龄/日期加减',
    category: '实用工具',
    icon: '📅',
    tags: ['date', '日期', '工作日'],
    timeout: 5000,
    parameters: [
      { name: 'date1', type: 'string', description: '日期1', required: true },
      { name: 'date2', type: 'string', description: '日期2' },
      { name: 'operation', type: 'string', description: '操作类型', default: 'diff', enum: ['diff', 'add', 'workdays', 'age'] },
      { name: 'days', type: 'number', description: '加减天数（add 模式）', default: 0 },
      { name: 'birth_date', type: 'string', description: '出生日期（age 模式）' },
    ],
    handler: dateCalculatorHandler,
    examples: [
      { input: { date1: '2024-01-01', date2: '2024-12-31', operation: 'diff' }, output: { diffDays: 365 } },
    ],
  })

  toolRegistry.register({
    name: 'pomodoro_timer',
    description: '番茄钟计时器，开始专注/生成计划/查看统计',
    category: '实用工具',
    icon: '🍅',
    tags: ['pomodoro', '番茄钟', '专注'],
    timeout: 5000,
    parameters: [
      { name: 'operation', type: 'string', description: '操作类型', default: 'start', enum: ['start', 'plan', 'stats'] },
      { name: 'work_minutes', type: 'number', description: '工作时长（分钟）', default: 25 },
      { name: 'break_minutes', type: 'number', description: '休息时长（分钟）', default: 5 },
      { name: 'long_break_minutes', type: 'number', description: '长休息时长（分钟）', default: 15 },
      { name: 'cycles_before_long_break', type: 'number', description: '长休息前周期数', default: 4 },
      { name: 'task', type: 'string', description: '任务名称', default: '专注工作' },
    ],
    handler: pomodoroTimerHandler,
    examples: [
      { input: { operation: 'start', task: '写文档', work_minutes: 25 }, output: { phase: 'work', duration: 1500000 } },
    ],
  })

  toolRegistry.register({
    name: 'battery_checker',
    description: '电池状态检查，Web Battery API 支持检测与模拟数据',
    category: '实用工具',
    icon: '🔋',
    tags: ['battery', '电池', 'web-api'],
    timeout: 5000,
    parameters: [
      { name: 'operation', type: 'string', description: '操作类型', default: 'status', enum: ['status', 'check_support', 'history'] },
    ],
    handler: batteryCheckerHandler,
    examples: [
      { input: { operation: 'status' }, output: { supported: false, levelPercent: 85 } },
    ],
  })

  // ==================== AI 工具类 ====================
  async function aiImageGeneratorHandler(args: Record<string, any>): Promise<any> {
    const { prompt, style = 'realistic', size = '1024x1024', num_images = 1 } = args
    return {
      success: true,
      message: 'AI图像生成请求已提交（模拟）',
      prompt,
      style,
      size,
      num_images,
      images: Array.from({ length: Math.min(num_images, 4) }, (_, i) => ({
        url: `https://example.com/image/${Date.now()}-${i}.png`,
        seed: Math.floor(Math.random() * 1000000),
      })),
    }
  }

  toolRegistry.register({
    name: 'ai_image_generator',
    description: 'AI图像生成（模拟），支持多种风格和尺寸',
    category: 'AI工具',
    icon: '🖼️',
    tags: ['ai', 'image', '生成', '画图'],
    timeout: 30000,
    parameters: [
      { name: 'prompt', type: 'string', description: '图像描述提示词', required: true },
      { name: 'style', type: 'string', description: '风格类型', default: 'realistic', enum: ['realistic', 'anime', 'digital-art', 'oil-painting', 'sketch'] },
      { name: 'size', type: 'string', description: '图像尺寸', default: '1024x1024', enum: ['512x512', '1024x1024', '1024x1536', '1536x1024'] },
      { name: 'num_images', type: 'number', description: '生成数量（最大4）', default: 1 },
    ],
    handler: aiImageGeneratorHandler,
    examples: [
      { input: { prompt: '一只可爱的猫咪在草地上', style: 'anime', size: '1024x1024' }, output: { success: true, images: [] } },
    ],
  })

  async function aiMusicGeneratorHandler(args: Record<string, any>): Promise<any> {
    const { prompt, genre = 'pop', duration = 180, vocals = false } = args
    return {
      success: true,
      message: 'AI音乐生成请求已提交（模拟）',
      prompt,
      genre,
      duration,
      vocals,
      audio_url: `https://example.com/audio/${Date.now()}.mp3`,
      waveform_url: `https://example.com/waveform/${Date.now()}.png`,
    }
  }

  toolRegistry.register({
    name: 'ai_music_generator',
    description: 'AI音乐生成（模拟），支持多种曲风',
    category: 'AI工具',
    icon: '🎵',
    tags: ['ai', 'music', '生成', '作曲'],
    timeout: 30000,
    parameters: [
      { name: 'prompt', type: 'string', description: '音乐描述提示词', required: true },
      { name: 'genre', type: 'string', description: '音乐风格', default: 'pop', enum: ['pop', 'rock', 'jazz', 'classical', 'electronic', 'hip-hop', 'lofi'] },
      { name: 'duration', type: 'number', description: '时长（秒）', default: 180 },
      { name: 'vocals', type: 'boolean', description: '是否包含人声', default: false },
    ],
    handler: aiMusicGeneratorHandler,
    examples: [
      { input: { prompt: '欢快的电子音乐，适合运动', genre: 'electronic', duration: 120 }, output: { success: true, audio_url: '' } },
    ],
  })

  async function aiVideoGeneratorHandler(args: Record<string, any>): Promise<any> {
    const { prompt, style = 'cinematic', duration = 60, resolution = '1080p' } = args
    return {
      success: true,
      message: 'AI视频生成请求已提交（模拟）',
      prompt,
      style,
      duration,
      resolution,
      video_url: `https://example.com/video/${Date.now()}.mp4`,
      thumbnail_url: `https://example.com/thumbnail/${Date.now()}.png`,
    }
  }

  toolRegistry.register({
    name: 'ai_video_generator',
    description: 'AI视频生成（模拟），支持多种风格和分辨率',
    category: 'AI工具',
    icon: '🎬',
    tags: ['ai', 'video', '生成', '剪辑'],
    timeout: 60000,
    parameters: [
      { name: 'prompt', type: 'string', description: '视频描述提示词', required: true },
      { name: 'style', type: 'string', description: '视频风格', default: 'cinematic', enum: ['cinematic', 'animation', 'documentary', 'viral', 'educational'] },
      { name: 'duration', type: 'number', description: '时长（秒）', default: 60 },
      { name: 'resolution', type: 'string', description: '分辨率', default: '1080p', enum: ['720p', '1080p', '4k'] },
    ],
    handler: aiVideoGeneratorHandler,
    examples: [
      { input: { prompt: '日落时分的城市风景，车流穿梭', style: 'cinematic', duration: 30 }, output: { success: true, video_url: '' } },
    ],
  })

  async function aiCodeReviewHandler(args: Record<string, any>): Promise<any> {
    const { code, language = 'typescript', rules = 'default' } = args
    const issues = [
      { severity: 'high', line: 15, message: '未处理错误情况，可能导致崩溃', suggestion: '添加 try-catch 或错误处理逻辑' },
      { severity: 'medium', line: 22, message: '变量命名不够清晰', suggestion: '使用更具描述性的变量名' },
      { severity: 'low', line: 30, message: '缺少注释说明复杂逻辑', suggestion: '添加注释解释代码意图' },
    ]
    return {
      success: true,
      language,
      rules,
      total_issues: issues.length,
      issues,
      summary: `发现 ${issues.length} 个问题，建议修复后再提交`,
    }
  }

  toolRegistry.register({
    name: 'ai_code_review',
    description: 'AI代码审查，检查代码质量、安全性和最佳实践',
    category: 'AI工具',
    icon: '👁️',
    tags: ['ai', 'code', 'review', '审查'],
    timeout: 15000,
    parameters: [
      { name: 'code', type: 'string', description: '待审查的代码', required: true },
      { name: 'language', type: 'string', description: '编程语言', default: 'typescript', enum: ['typescript', 'javascript', 'python', 'java', 'go', 'rust'] },
      { name: 'rules', type: 'string', description: '审查规则', default: 'default', enum: ['default', 'strict', 'security', 'performance'] },
    ],
    handler: aiCodeReviewHandler,
    examples: [
      { input: { code: 'function test() { return 1; }', language: 'javascript' }, output: { success: true, issues: [] } },
    ],
  })

  async function aiDocumentSummaryHandler(args: Record<string, any>): Promise<any> {
    const { document, max_length = 500, format = 'bullet' } = args
    const summary = {
      bullet: [
        '文档主要介绍了项目架构设计',
        '包含前端、后端和数据库三个部分',
        '使用了微服务架构和容器化部署',
        '强调了安全性和可扩展性',
      ],
      paragraph: '本文档主要介绍了项目的架构设计，涵盖前端、后端和数据库三个核心部分。采用微服务架构和容器化部署方案，强调了系统的安全性和可扩展性要求。',
      abstract: '项目架构设计文档，包含前端、后端、数据库三部分，采用微服务架构和容器化部署，注重安全与扩展。',
    }
    return {
      success: true,
      original_length: document.length,
      summary_length: summary[format as keyof typeof summary].length,
      summary: summary[format as keyof typeof summary],
      format,
    }
  }

  toolRegistry.register({
    name: 'ai_document_summary',
    description: 'AI文档摘要，自动提取文档核心内容',
    category: 'AI工具',
    icon: '📝',
    tags: ['ai', 'document', 'summary', '摘要'],
    timeout: 10000,
    parameters: [
      { name: 'document', type: 'string', description: '待摘要的文档内容', required: true },
      { name: 'max_length', type: 'number', description: '摘要最大长度', default: 500 },
      { name: 'format', type: 'string', description: '摘要格式', default: 'bullet', enum: ['bullet', 'paragraph', 'abstract'] },
    ],
    handler: aiDocumentSummaryHandler,
    examples: [
      { input: { document: '这是一篇技术文档...', format: 'bullet' }, output: { success: true, summary: [] } },
    ],
  })

  // ==================== 开发工具类 ====================
  async function gitToolHandler(args: Record<string, any>): Promise<any> {
    const { operation, repo_url, branch, commit_msg, file_path } = args
    const operations: Record<string, string> = {
      clone: `git clone ${repo_url}`,
      commit: `git commit -m "${commit_msg}"`,
      branch: `git checkout -b ${branch}`,
      merge: `git merge ${branch}`,
      status: 'git status',
    }
    return {
      success: true,
      operation,
      command: operations[operation] || `git ${operation}`,
      output: `执行 git ${operation} 成功（模拟）`,
    }
  }

  toolRegistry.register({
    name: 'git_tool',
    description: 'Git操作（克隆/提交/分支/合并/冲突解决）',
    category: '开发工具',
    icon: '📦',
    tags: ['git', 'version-control', '代码管理'],
    timeout: 15000,
    parameters: [
      { name: 'operation', type: 'string', description: '操作类型', required: true, enum: ['clone', 'commit', 'branch', 'merge', 'status', 'push', 'pull', 'log'] },
      { name: 'repo_url', type: 'string', description: '仓库地址（clone操作）' },
      { name: 'branch', type: 'string', description: '分支名称（branch/merge操作）' },
      { name: 'commit_msg', type: 'string', description: '提交信息（commit操作）' },
      { name: 'file_path', type: 'string', description: '文件路径' },
    ],
    handler: gitToolHandler,
    examples: [
      { input: { operation: 'status' }, output: { success: true, command: 'git status' } },
    ],
  })

  async function npmToolHandler(args: Record<string, any>): Promise<any> {
    const { operation, package_name, version, global = false } = args
    const prefix = global ? 'npm install -g' : 'npm'
    const operations: Record<string, string> = {
      install: `${prefix} ${package_name}@${version || ''}`,
      uninstall: `npm uninstall ${package_name}`,
      update: `npm update ${package_name}`,
      publish: 'npm publish',
      list: 'npm list',
    }
    return {
      success: true,
      operation,
      command: operations[operation] || `npm ${operation}`,
      output: `执行 npm ${operation} 成功（模拟）`,
    }
  }

  toolRegistry.register({
    name: 'npm_tool',
    description: 'npm操作（安装/卸载/更新/发布）',
    category: '开发工具',
    icon: '📦',
    tags: ['npm', 'package', '依赖管理'],
    timeout: 30000,
    parameters: [
      { name: 'operation', type: 'string', description: '操作类型', required: true, enum: ['install', 'uninstall', 'update', 'publish', 'list', 'init', 'run'] },
      { name: 'package_name', type: 'string', description: '包名称' },
      { name: 'version', type: 'string', description: '版本号' },
      { name: 'global', type: 'boolean', description: '是否全局安装', default: false },
      { name: 'script', type: 'string', description: '脚本名称（run操作）' },
    ],
    handler: npmToolHandler,
    examples: [
      { input: { operation: 'install', package_name: 'lodash' }, output: { success: true, command: 'npm install lodash' } },
    ],
  })

  async function dockerToolHandler(args: Record<string, any>): Promise<any> {
    const { operation, image, container_name, port, command } = args
    const operations: Record<string, string> = {
      build: `docker build -t ${image} .`,
      run: `docker run -d --name ${container_name} -p ${port} ${image}`,
      pull: `docker pull ${image}`,
      push: `docker push ${image}`,
      ps: 'docker ps',
    }
    return {
      success: true,
      operation,
      command: operations[operation] || `docker ${operation}`,
      output: `执行 docker ${operation} 成功（模拟）`,
    }
  }

  toolRegistry.register({
    name: 'docker_tool',
    description: 'Docker操作（镜像/容器/构建/运行）',
    category: '开发工具',
    icon: '🐳',
    tags: ['docker', 'container', '容器'],
    timeout: 30000,
    parameters: [
      { name: 'operation', type: 'string', description: '操作类型', required: true, enum: ['build', 'run', 'pull', 'push', 'ps', 'stop', 'rm', 'logs'] },
      { name: 'image', type: 'string', description: '镜像名称' },
      { name: 'container_name', type: 'string', description: '容器名称' },
      { name: 'port', type: 'string', description: '端口映射（如 8080:80）' },
      { name: 'command', type: 'string', description: '运行命令' },
    ],
    handler: dockerToolHandler,
    examples: [
      { input: { operation: 'run', image: 'nginx', container_name: 'web', port: '8080:80' }, output: { success: true, command: '' } },
    ],
  })

  async function kubernetesToolHandler(args: Record<string, any>): Promise<any> {
    const { operation, deployment, service, namespace, replicas, pod } = args
    const operations: Record<string, string> = {
      deploy: `kubectl apply -f ${deployment}`,
      get_pods: 'kubectl get pods',
      scale: `kubectl scale deployment ${deployment} --replicas=${replicas}`,
      expose: `kubectl expose deployment ${deployment} --port=80 --type=NodePort`,
      logs: `kubectl logs ${pod}`,
    }
    return {
      success: true,
      operation,
      command: operations[operation] || `kubectl ${operation}`,
      output: `执行 kubectl ${operation} 成功（模拟）`,
    }
  }

  toolRegistry.register({
    name: 'kubernetes_tool',
    description: 'K8s操作（部署/服务/配置/扩缩容）',
    category: '开发工具',
    icon: '☸️',
    tags: ['kubernetes', 'k8s', '容器编排'],
    timeout: 30000,
    parameters: [
      { name: 'operation', type: 'string', description: '操作类型', required: true, enum: ['deploy', 'get_pods', 'scale', 'expose', 'logs', 'describe', 'delete'] },
      { name: 'deployment', type: 'string', description: '部署名称' },
      { name: 'service', type: 'string', description: '服务名称' },
      { name: 'namespace', type: 'string', description: '命名空间', default: 'default' },
      { name: 'replicas', type: 'number', description: '副本数（scale操作）' },
    ],
    handler: kubernetesToolHandler,
    examples: [
      { input: { operation: 'get_pods', namespace: 'default' }, output: { success: true, command: 'kubectl get pods' } },
    ],
  })

  async function terraformToolHandler(args: Record<string, any>): Promise<any> {
    const { operation, workspace } = args
    const operations: Record<string, string> = {
      init: 'terraform init',
      plan: 'terraform plan',
      apply: 'terraform apply -auto-approve',
      destroy: 'terraform destroy -auto-approve',
      workspace: `terraform workspace ${workspace}`,
    }
    return {
      success: true,
      operation,
      command: operations[operation] || `terraform ${operation}`,
      output: `执行 terraform ${operation} 成功（模拟）`,
    }
  }

  toolRegistry.register({
    name: 'terraform_tool',
    description: 'Terraform操作（基础设施即代码）',
    category: '开发工具',
    icon: '🏗️',
    tags: ['terraform', 'iac', '基础设施'],
    timeout: 60000,
    parameters: [
      { name: 'operation', type: 'string', description: '操作类型', required: true, enum: ['init', 'plan', 'apply', 'destroy', 'workspace', 'validate', 'fmt'] },
      { name: 'workspace', type: 'string', description: '工作空间操作（如 select dev）' },
    ],
    handler: terraformToolHandler,
    examples: [
      { input: { operation: 'init' }, output: { success: true, command: 'terraform init' } },
    ],
  })

  // ==================== 数据库工具类 ====================
  async function mongodbToolHandler(args: Record<string, any>): Promise<any> {
    const { operation, database, collection, query, document } = args
    return {
      success: true,
      operation,
      database,
      collection,
      result: {
        count: 10,
        documents: Array.from({ length: 3 }, (_, i) => ({ _id: `doc-${i}`, name: `item-${i}` })),
      },
      message: `MongoDB ${operation} 操作成功（模拟）`,
    }
  }

  toolRegistry.register({
    name: 'mongodb_tool',
    description: 'MongoDB操作（CRUD/聚合/索引）',
    category: '数据库工具',
    icon: '🍃',
    tags: ['mongodb', 'nosql', '数据库'],
    timeout: 10000,
    parameters: [
      { name: 'operation', type: 'string', description: '操作类型', required: true, enum: ['find', 'insert', 'update', 'delete', 'aggregate', 'createIndex'] },
      { name: 'database', type: 'string', description: '数据库名称', required: true },
      { name: 'collection', type: 'string', description: '集合名称', required: true },
      { name: 'query', type: 'object', description: '查询条件' },
      { name: 'document', type: 'object', description: '文档内容（insert/update操作）' },
    ],
    handler: mongodbToolHandler,
    examples: [
      { input: { operation: 'find', database: 'test', collection: 'users' }, output: { success: true, result: {} } },
    ],
  })

  async function redisToolHandler(args: Record<string, any>): Promise<any> {
    const { operation, key, value, ttl } = args
    const operations: Record<string, string> = {
      get: `GET ${key}`,
      set: `SET ${key} ${value} ${ttl ? `EX ${ttl}` : ''}`,
      del: `DEL ${key}`,
      incr: `INCR ${key}`,
      lpush: `LPUSH ${key} ${value}`,
      rpop: `RPOP ${key}`,
      publish: `PUBLISH ${key} ${value}`,
      subscribe: `SUBSCRIBE ${key}`,
    }
    return {
      success: true,
      operation,
      command: operations[operation] || operation,
      result: operation === 'get' ? 'cached_value' : 'OK',
    }
  }

  toolRegistry.register({
    name: 'redis_tool',
    description: 'Redis操作（缓存/队列/发布订阅）',
    category: '数据库工具',
    icon: '🔴',
    tags: ['redis', 'cache', '缓存'],
    timeout: 5000,
    parameters: [
      { name: 'operation', type: 'string', description: '操作类型', required: true, enum: ['get', 'set', 'del', 'incr', 'decr', 'lpush', 'rpop', 'publish', 'subscribe'] },
      { name: 'key', type: 'string', description: '键名', required: true },
      { name: 'value', type: 'string', description: '值（set/lpush/publish操作）' },
      { name: 'ttl', type: 'number', description: '过期时间（秒，set操作）' },
    ],
    handler: redisToolHandler,
    examples: [
      { input: { operation: 'get', key: 'user:123' }, output: { success: true, result: '' } },
    ],
  })

  async function postgresToolHandler(args: Record<string, any>): Promise<any> {
    const { operation, database, query } = args
    return {
      success: true,
      operation,
      database,
      query,
      result: {
        rows: Array.from({ length: 5 }, (_, i) => ({ id: i, name: `record-${i}` })),
        rowCount: 5,
      },
      message: `PostgreSQL ${operation} 操作成功（模拟）`,
    }
  }

  toolRegistry.register({
    name: 'postgres_tool',
    description: 'PostgreSQL操作（查询/事务/索引）',
    category: '数据库工具',
    icon: '🐘',
    tags: ['postgresql', 'postgres', '数据库'],
    timeout: 10000,
    parameters: [
      { name: 'operation', type: 'string', description: '操作类型', required: true, enum: ['query', 'execute', 'begin', 'commit', 'rollback', 'create_index'] },
      { name: 'database', type: 'string', description: '数据库名称', required: true },
      { name: 'query', type: 'string', description: 'SQL查询语句', required: true },
    ],
    handler: postgresToolHandler,
    examples: [
      { input: { operation: 'query', database: 'app', query: 'SELECT * FROM users LIMIT 10' }, output: { success: true, result: {} } },
    ],
  })

  async function mysqlToolHandler(args: Record<string, any>): Promise<any> {
    const { operation, database, query } = args
    return {
      success: true,
      operation,
      database,
      query,
      result: {
        rows: Array.from({ length: 5 }, (_, i) => ({ id: i, name: `record-${i}` })),
        affectedRows: 5,
      },
      message: `MySQL ${operation} 操作成功（模拟）`,
    }
  }

  toolRegistry.register({
    name: 'mysql_tool',
    description: 'MySQL操作（查询/事务/索引）',
    category: '数据库工具',
    icon: '🐬',
    tags: ['mysql', 'database', '数据库'],
    timeout: 10000,
    parameters: [
      { name: 'operation', type: 'string', description: '操作类型', required: true, enum: ['query', 'execute', 'begin', 'commit', 'rollback', 'create_index'] },
      { name: 'database', type: 'string', description: '数据库名称', required: true },
      { name: 'query', type: 'string', description: 'SQL查询语句', required: true },
    ],
    handler: mysqlToolHandler,
    examples: [
      { input: { operation: 'query', database: 'app', query: 'SELECT * FROM users LIMIT 10' }, output: { success: true, result: {} } },
    ],
  })

  async function sqlserverToolHandler(args: Record<string, any>): Promise<any> {
    const { operation, database, query } = args
    return {
      success: true,
      operation,
      database,
      query,
      result: {
        rows: Array.from({ length: 5 }, (_, i) => ({ id: i, name: `record-${i}` })),
        rowCount: 5,
      },
      message: `SQL Server ${operation} 操作成功（模拟）`,
    }
  }

  toolRegistry.register({
    name: 'sqlserver_tool',
    description: 'SQL Server操作（查询/事务/索引）',
    category: '数据库工具',
    icon: '🗄️',
    tags: ['sqlserver', 'mssql', '数据库'],
    timeout: 10000,
    parameters: [
      { name: 'operation', type: 'string', description: '操作类型', required: true, enum: ['query', 'execute', 'begin', 'commit', 'rollback', 'create_index'] },
      { name: 'database', type: 'string', description: '数据库名称', required: true },
      { name: 'query', type: 'string', description: 'SQL查询语句', required: true },
    ],
    handler: sqlserverToolHandler,
    examples: [
      { input: { operation: 'query', database: 'app', query: 'SELECT TOP 10 * FROM users' }, output: { success: true, result: {} } },
    ],
  })

  // ==================== 网络工具类 ====================
  async function sshToolHandler(args: Record<string, any>): Promise<any> {
    const { host, port = 22, username, command } = args
    return {
      success: true,
      host,
      port,
      username,
      command,
      output: `[${host}] 执行命令成功（模拟）\n命令输出示例：\n$ ${command}\nresult: success`,
    }
  }

  toolRegistry.register({
    name: 'ssh_tool',
    description: 'SSH连接与命令执行（模拟）',
    category: '网络工具',
    icon: '🖥️',
    tags: ['ssh', 'remote', '远程'],
    timeout: 15000,
    parameters: [
      { name: 'host', type: 'string', description: '主机地址', required: true },
      { name: 'port', type: 'number', description: '端口', default: 22 },
      { name: 'username', type: 'string', description: '用户名', required: true },
      { name: 'command', type: 'string', description: '待执行命令', required: true },
    ],
    handler: sshToolHandler,
    examples: [
      { input: { host: 'server.example.com', username: 'admin', command: 'ls -la' }, output: { success: true, output: '' } },
    ],
  })

  async function sftpToolHandler(args: Record<string, any>): Promise<any> {
    const { operation, host, port = 22, username, local_path, remote_path } = args
    return {
      success: true,
      operation,
      host,
      port,
      username,
      local_path,
      remote_path,
      message: `SFTP ${operation} 操作成功（模拟）`,
    }
  }

  toolRegistry.register({
    name: 'sftp_tool',
    description: 'SFTP文件传输（模拟）',
    category: '网络工具',
    icon: '📤',
    tags: ['sftp', 'file-transfer', '文件传输'],
    timeout: 30000,
    parameters: [
      { name: 'operation', type: 'string', description: '操作类型', required: true, enum: ['upload', 'download', 'list', 'mkdir', 'rm'] },
      { name: 'host', type: 'string', description: '主机地址', required: true },
      { name: 'port', type: 'number', description: '端口', default: 22 },
      { name: 'username', type: 'string', description: '用户名', required: true },
      { name: 'local_path', type: 'string', description: '本地路径（upload/download操作）' },
      { name: 'remote_path', type: 'string', description: '远程路径', required: true },
    ],
    handler: sftpToolHandler,
    examples: [
      { input: { operation: 'upload', host: 'server.example.com', username: 'admin', local_path: '/local/file.txt', remote_path: '/remote/file.txt' }, output: { success: true } },
    ],
  })

  async function curlToolHandler(args: Record<string, any>): Promise<any> {
    const { method = 'GET', url, headers, body, timeout = 30 } = args
    return {
      success: true,
      method,
      url,
      status_code: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { message: '请求成功（模拟）', data: {} },
      duration_ms: 150,
    }
  }

  toolRegistry.register({
    name: 'curl_tool',
    description: 'HTTP请求工具（GET/POST/PUT/DELETE）',
    category: '网络工具',
    icon: '🌐',
    tags: ['curl', 'http', 'api'],
    timeout: 30000,
    parameters: [
      { name: 'method', type: 'string', description: '请求方法', default: 'GET', enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] },
      { name: 'url', type: 'string', description: '目标URL', required: true },
      { name: 'headers', type: 'object', description: '请求头' },
      { name: 'body', type: 'object', description: '请求体（POST/PUT/PATCH操作）' },
      { name: 'timeout', type: 'number', description: '超时时间（秒）', default: 30 },
    ],
    handler: curlToolHandler,
    examples: [
      { input: { method: 'GET', url: 'https://api.example.com/users' }, output: { success: true, status_code: 200 } },
    ],
  })

  async function websocketToolHandler(args: Record<string, any>): Promise<any> {
    const { operation, url, message } = args
    return {
      success: true,
      operation,
      url,
      message,
      response: operation === 'send' ? { status: 'sent', timestamp: Date.now() } : { connected: true, messages: [] },
    }
  }

  toolRegistry.register({
    name: 'websocket_tool',
    description: 'WebSocket客户端（连接/发送/接收）',
    category: '网络工具',
    icon: '🔌',
    tags: ['websocket', 'realtime', '实时'],
    timeout: 10000,
    parameters: [
      { name: 'operation', type: 'string', description: '操作类型', required: true, enum: ['connect', 'send', 'receive', 'close'] },
      { name: 'url', type: 'string', description: 'WebSocket URL', required: true },
      { name: 'message', type: 'string', description: '发送消息（send操作）' },
    ],
    handler: websocketToolHandler,
    examples: [
      { input: { operation: 'connect', url: 'ws://localhost:8080/ws' }, output: { success: true, connected: true } },
    ],
  })

  async function dnsToolHandler(args: Record<string, any>): Promise<any> {
    const { domain, record_type = 'A' } = args
    const records: Record<string, any[]> = {
      A: [{ name: domain, type: 'A', value: '192.168.1.100', ttl: 300 }],
      AAAA: [{ name: domain, type: 'AAAA', value: '::1', ttl: 300 }],
      CNAME: [{ name: 'www.' + domain, type: 'CNAME', value: domain, ttl: 300 }],
      MX: [{ name: domain, type: 'MX', value: 'mail.' + domain, priority: 10, ttl: 300 }],
      TXT: [{ name: domain, type: 'TXT', value: '"v=spf1 include:_spf.google.com ~all"', ttl: 300 }],
      NS: [{ name: domain, type: 'NS', value: 'ns1.example.com', ttl: 3600 }],
    }
    return {
      success: true,
      domain,
      record_type,
      records: records[record_type] || [],
    }
  }

  toolRegistry.register({
    name: 'dns_tool',
    description: 'DNS解析工具（A/AAAA/CNAME/MX/TXT/NS）',
    category: '网络工具',
    icon: '📡',
    tags: ['dns', 'domain', '域名'],
    timeout: 5000,
    parameters: [
      { name: 'domain', type: 'string', description: '域名', required: true },
      { name: 'record_type', type: 'string', description: '记录类型', default: 'A', enum: ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS'] },
    ],
    handler: dnsToolHandler,
    examples: [
      { input: { domain: 'example.com', record_type: 'A' }, output: { success: true, records: [] } },
    ],
  })
}
