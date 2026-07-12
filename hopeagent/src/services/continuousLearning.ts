// 持续学习避坑引擎 — ErrorPattern + 反馈回路增强
// 参考 CEE 的 learning/auto_learner.py 和 explore_exploit.py

export interface ErrorPattern {
  id: string
  pattern: string
  category: string
  description: string
  solution: string
  examples: string[]
  occurrenceCount: number
  lastOccurrence: number
  resolvedCount: number
  confidence: number
  tags: string[]
  autoApply: boolean
}

export interface FeedbackEntry {
  id: string
  timestamp: number
  type: 'positive' | 'negative' | 'neutral' | 'correction'
  context: string
  response: string
  feedback: string
  learnedInsights: string[]
  resolved: boolean
}

export interface LearningStats {
  totalErrors: number
  patternsLearned: number
  feedbackCount: number
  positiveRate: number
  autoFixRate: number
  topErrors: { pattern: string; count: number }[]
}

const STORAGE_KEY_ERRORS = 'hopeagent-error-patterns'
const STORAGE_KEY_FEEDBACK = 'hopeagent-feedback'

class ContinuousLearning {
  private errorPatterns: ErrorPattern[] = []
  private feedback: FeedbackEntry[] = []

  constructor() {
    this.load()
  }

  private load(): void {
    try {
      const e = localStorage.getItem(STORAGE_KEY_ERRORS)
      if (e) this.errorPatterns = JSON.parse(e)
      const f = localStorage.getItem(STORAGE_KEY_FEEDBACK)
      if (f) this.feedback = JSON.parse(f)
    } catch {}
  }

  private save(): void {
    try {
      localStorage.setItem(STORAGE_KEY_ERRORS, JSON.stringify(this.errorPatterns.slice(-100)))
      localStorage.setItem(STORAGE_KEY_FEEDBACK, JSON.stringify(this.feedback.slice(-100)))
    } catch {}
  }

  detectError(response: string, context?: string): ErrorPattern | null {
    const lower = response.toLowerCase()

    for (const pattern of this.errorPatterns) {
      const p = pattern.pattern.toLowerCase()
      if (lower.includes(p) || (context && context.toLowerCase().includes(p))) {
        pattern.occurrenceCount++
        pattern.lastOccurrence = Date.now()
        this.save()
        return pattern
      }
    }

    return null
  }

  recordError(
    errorText: string,
    category: string,
    solution: string,
    context?: string
  ): ErrorPattern {
    const existing = this.errorPatterns.find(
      p => p.pattern.toLowerCase() === errorText.toLowerCase()
    )

    if (existing) {
      existing.occurrenceCount++
      existing.lastOccurrence = Date.now()
      if (solution && !existing.solution.includes(solution)) {
        existing.solution += '\n' + solution
      }
      this.save()
      return existing
    }

    const pattern: ErrorPattern = {
      id: 'err_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      pattern: errorText,
      category,
      description: `自动识别的错误模式：${errorText.slice(0, 50)}`,
      solution,
      examples: context ? [context.slice(0, 200)] : [],
      occurrenceCount: 1,
      lastOccurrence: Date.now(),
      resolvedCount: 0,
      confidence: 0.5,
      tags: [category],
      autoApply: false,
    }

    this.errorPatterns.push(pattern)
    this.save()
    return pattern
  }

  recordFeedback(
    type: 'positive' | 'negative' | 'neutral' | 'correction',
    context: string,
    response: string,
    feedback: string,
    learnedInsights: string[] = []
  ): FeedbackEntry {
    const entry: FeedbackEntry = {
      id: 'fb_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      timestamp: Date.now(),
      type,
      context: context.slice(0, 300),
      response: response.slice(0, 500),
      feedback: feedback.slice(0, 500),
      learnedInsights,
      resolved: false,
    }

    this.feedback.unshift(entry)

    if (type === 'negative' || type === 'correction') {
      this.recordError(
        feedback.slice(0, 30),
        'user_feedback',
        feedback,
        response
      )
    }

    if (learnedInsights.length > 0) {
      this.extractAndStoreKnowledge(learnedInsights)
    }

    this.save()
    return entry
  }

  private extractAndStoreKnowledge(insights: string[]): void {
    try {
      const raw = localStorage.getItem('hopeagent-knowledge')
      let knowledge: any[] = raw ? JSON.parse(raw) : []

      for (const insight of insights) {
        const exists = knowledge.some(
          (k: any) => k.title === insight.slice(0, 30)
        )
        if (!exists && insight.length > 10) {
          const now = Date.now()
          knowledge.push({
            id: 'k_fb_' + now + '_' + Math.random().toString(36).slice(2, 6),
            title: insight.slice(0, 30) + (insight.length > 30 ? '...' : ''),
            content: insight,
            tags: ['feedback', 'learned'],
            category: '反馈学习',
            createdAt: now,
            updatedAt: now,
          })
        }
      }

      localStorage.setItem('hopeagent-knowledge', JSON.stringify(knowledge))
    } catch {}
  }

  getCommonErrors(limit: number = 10): ErrorPattern[] {
    return [...this.errorPatterns]
      .sort((a, b) => b.occurrenceCount - a.occurrenceCount)
      .slice(0, limit)
  }

  getSolutionForError(errorText: string): string | null {
    const pattern = this.detectError(errorText)
    return pattern?.solution || null
  }

  applyAutoFix(response: string): string {
    let fixed = response
    let applied = 0

    for (const pattern of this.errorPatterns) {
      if (pattern.autoApply && pattern.confidence >= 0.8) {
        const regex = new RegExp(pattern.pattern, 'gi')
        if (regex.test(fixed)) {
          fixed = fixed.replace(regex, pattern.solution)
          applied++
        }
      }
    }

    if (applied > 0) {
      this.errorPatterns.forEach(p => {
        if (p.autoApply && p.confidence >= 0.8) {
          p.resolvedCount++
        }
      })
      this.save()
    }

    return fixed
  }

  markPatternResolved(patternId: string): void {
    const p = this.errorPatterns.find(p => p.id === patternId)
    if (p) {
      p.resolvedCount++
      p.confidence = Math.min(1.0, p.confidence + 0.1)
      this.save()
    }
  }

  setAutoApply(patternId: string, auto: boolean): void {
    const p = this.errorPatterns.find(p => p.id === patternId)
    if (p) {
      p.autoApply = auto
      this.save()
    }
  }

  getStats(): LearningStats {
    const totalErrors = this.errorPatterns.reduce((s, p) => s + p.occurrenceCount, 0)
    const feedbackCount = this.feedback.length
    const positiveCount = this.feedback.filter(f => f.type === 'positive').length
    const autoFixCount = this.errorPatterns.reduce((s, p) => s + (p.autoApply ? p.resolvedCount : 0), 0)

    const topErrors = [...this.errorPatterns]
      .sort((a, b) => b.occurrenceCount - a.occurrenceCount)
      .slice(0, 5)
      .map(p => ({ pattern: p.pattern.slice(0, 30), count: p.occurrenceCount }))

    return {
      totalErrors,
      patternsLearned: this.errorPatterns.length,
      feedbackCount,
      positiveRate: feedbackCount > 0 ? positiveCount / feedbackCount : 0,
      autoFixRate: totalErrors > 0 ? autoFixCount / totalErrors : 0,
      topErrors,
    }
  }

  getFeedbackHistory(limit: number = 20): FeedbackEntry[] {
    return this.feedback.slice(0, limit)
  }

  clearPatterns(): void {
    this.errorPatterns = []
    this.save()
  }

  clearFeedback(): void {
    this.feedback = []
    this.save()
  }

  exportData(): { errorPatterns: ErrorPattern[]; feedback: FeedbackEntry[] } {
    return {
      errorPatterns: [...this.errorPatterns],
      feedback: [...this.feedback],
    }
  }

  importData(data: { errorPatterns?: ErrorPattern[]; feedback?: FeedbackEntry[] }): void {
    if (data.errorPatterns) {
      for (const p of data.errorPatterns) {
        const existing = this.errorPatterns.find(ep => ep.pattern === p.pattern)
        if (existing) {
          existing.occurrenceCount += p.occurrenceCount
          existing.resolvedCount += p.resolvedCount
        } else {
          this.errorPatterns.push({ ...p })
        }
      }
    }
    if (data.feedback) {
      this.feedback.push(...data.feedback)
    }
    this.save()
  }
}

export const continuousLearning = new ContinuousLearning()
