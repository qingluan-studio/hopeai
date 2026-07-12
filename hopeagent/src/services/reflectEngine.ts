// 自反思元认知引擎 ReflectEngine + 输出评分
// 参考 CEE 的 local_llm/metacognition.py 和 reflection_engine.py

import { computeCognitiveInvariants, InvariantsResult } from '../utils/cognitive-invariants'

export interface ReflectionEntry {
  id: string
  timestamp: number
  input: string
  output: string
  scores: InvariantsResult | null
  tier: string
  improvements: string[]
  action: string
  insight: string
  retries: number
  optimized: boolean
}

export interface ReflectConfig {
  qualityThreshold: number
  maxRetries: number
  autoOptimize: boolean
  trackHistory: boolean
}

const DEFAULT_CONFIG: ReflectConfig = {
  qualityThreshold: 0.7,
  maxRetries: 3,
  autoOptimize: true,
  trackHistory: true,
}

const STORAGE_KEY = 'hopeagent-reflection-history'

class ReflectEngine {
  private config: ReflectConfig
  private history: ReflectionEntry[] = []

  constructor(config: Partial<ReflectConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.loadHistory()
  }

  private loadHistory(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) this.history = JSON.parse(raw)
    } catch {}
  }

  private saveHistory(): void {
    try {
      const toSave = this.history.slice(-100)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    } catch {}
  }

  evaluateOutput(input: string, output: string): {
    scores: InvariantsResult | null
    tier: string
    passed: boolean
    suggestions: string[]
  } {
    let scores: InvariantsResult | null = null
    let tier = 'unknown'
    let passed = true
    const suggestions: string[] = []

    try {
      scores = computeCognitiveInvariants(output)
      tier = scores.tier || 'C'
      passed = scores.composite >= this.config.qualityThreshold

      if (scores.itc < 0.6) suggestions.push('信息结构不够紧凑，建议加强逻辑关联')
      if (scores.scs < 0.6) suggestions.push('推理路径不够顺畅，建议优化论证顺序')
      if (scores.iec < 0.4) suggestions.push('信息量偏低，建议补充更多细节')
      if (scores.iec > 0.8) suggestions.push('信息过于分散，建议聚焦核心观点')
      if (scores.pfft < 0.6) suggestions.push('内容原创性或忠实度有待提升')
    } catch (err) {
      console.warn('CEE evaluation failed:', err)
    }

    const lengthScore = Math.min(output.length / 500, 1)
    if (lengthScore < 0.3) suggestions.push('回答过于简短，建议展开说明')

    const structureScore = output.includes('\n') ? 1 : 0.3
    if (structureScore < 0.5) suggestions.push('建议使用分段或列表提升可读性')

    return { scores, tier, passed, suggestions }
  }

  async reflectAndOptimize(
    input: string,
    output: string,
    optimizeFn?: (prompt: string) => Promise<string>
  ): Promise<{
    finalOutput: string
    scores: InvariantsResult | null
    tier: string
    retries: number
    optimized: boolean
    improvements: string[]
    insight: string
  }> {
    const allImprovements: string[] = []
    let currentOutput = output
    let retries = 0
    let optimized = false
    let finalScores: InvariantsResult | null = null
    let finalTier = 'unknown'

    const initialEval = this.evaluateOutput(input, currentOutput)
    finalScores = initialEval.scores
    finalTier = initialEval.tier

    if (initialEval.passed || !this.config.autoOptimize || !optimizeFn) {
      this.recordHistory(input, currentOutput, finalScores, finalTier, [], initialEval.suggestions.join('; '), retries, optimized)
      return {
        finalOutput: currentOutput,
        scores: finalScores,
        tier: finalTier,
        retries,
        optimized,
        improvements: initialEval.suggestions,
        insight: initialEval.passed ? '质量达标' : '未启用自动优化',
      }
    }

    for (let i = 0; i < this.config.maxRetries; i++) {
      const evalResult = this.evaluateOutput(input, currentOutput)
      if (evalResult.passed) break

      allImprovements.push(...evalResult.suggestions)
      const improvePrompt = this.buildImprovePrompt(input, currentOutput, evalResult.suggestions)

      try {
        currentOutput = await optimizeFn(improvePrompt)
        retries++
        optimized = true

        const newEval = this.evaluateOutput(input, currentOutput)
        finalScores = newEval.scores
        finalTier = newEval.tier

        if (newEval.passed) break
      } catch (err) {
        console.warn('Optimization iteration failed:', err)
        break
      }
    }

    const finalEval = this.evaluateOutput(input, currentOutput)
    const insight = this.generateInsight(initialEval.scores, finalEval.scores, retries)

    this.recordHistory(input, currentOutput, finalScores, finalTier, allImprovements, insight, retries, optimized)

    return {
      finalOutput: currentOutput,
      scores: finalScores,
      tier: finalTier,
      retries,
      optimized,
      improvements: allImprovements,
      insight,
    }
  }

  private buildImprovePrompt(input: string, output: string, suggestions: string[]): string {
    return `请根据以下反馈优化你的回答：

【原始问题】
${input}

【当前回答】
${output}

【优化建议】
${suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

请生成一个更好的版本，注意：
1. 保持核心观点不变
2. 提升结构紧凑性和逻辑性
3. 确保信息充分且不过载
4. 语言自然流畅，有自己的风格
5. 直接输出优化后的完整回答`
  }

  private generateInsight(
    initial: InvariantsResult | null,
    final: InvariantsResult | null,
    retries: number
  ): string {
    if (!initial || !final) return '无法生成洞察'

    const delta = final.composite - initial.composite
    if (delta > 0.1) return `经过 ${retries} 轮优化，质量提升 ${(delta * 100).toFixed(1)}%，效果显著`
    if (delta > 0.05) return `经过 ${retries} 轮优化，质量有一定提升`
    if (delta > 0) return `优化后质量略有提升，已接近上限`
    if (delta === 0) return `质量已达稳定状态`
    return `优化后质量略有波动，可能是风格调整导致`
  }

  private recordHistory(
    input: string,
    output: string,
    scores: InvariantsResult | null,
    tier: string,
    improvements: string[],
    insight: string,
    retries: number,
    optimized: boolean
  ): void {
    if (!this.config.trackHistory) return

    const entry: ReflectionEntry = {
      id: 'ref_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      timestamp: Date.now(),
      input: input.slice(0, 200),
      output: output.slice(0, 500),
      scores,
      tier,
      improvements,
      action: optimized ? 'optimized' : 'accepted',
      insight,
      retries,
      optimized,
    }

    this.history.push(entry)
    if (this.history.length > 200) this.history = this.history.slice(-200)
    this.saveHistory()
  }

  getHistory(): ReflectionEntry[] {
    return [...this.history].reverse()
  }

  getStats() {
    const total = this.history.length
    const optimized = this.history.filter(h => h.optimized).length
    const avgScore = total > 0
      ? this.history.reduce((s, h) => s + (h.scores?.composite || 0), 0) / total
      : 0
    const tierCounts: Record<string, number> = {}
    for (const h of this.history) {
      tierCounts[h.tier] = (tierCounts[h.tier] || 0) + 1
    }

    return {
      totalReflections: total,
      optimizedCount: optimized,
      optimizationRate: total > 0 ? optimized / total : 0,
      averageScore: avgScore,
      tierDistribution: tierCounts,
    }
  }

  clearHistory(): void {
    this.history = []
    this.saveHistory()
  }

  updateConfig(config: Partial<ReflectConfig>): void {
    this.config = { ...this.config, ...config }
  }

  getConfig(): ReflectConfig {
    return { ...this.config }
  }
}

export const reflectEngine = new ReflectEngine()
