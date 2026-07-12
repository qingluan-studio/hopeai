// 思维链推理引擎 — Chain-of-Thought 多步逻辑展开
// 参考 CEE 的 app/engine/think.py 和 app/engine/reasoning.py

export type ThinkingPhase =
  | 'problem_understanding'
  | 'decomposition'
  | 'hypothesis_generation'
  | 'hypothesis_testing'
  | 'multi_angle'
  | 'synthesis'
  | 'reflection'

export interface SubQuestion {
  id: string
  text: string
  answer?: string
  status: 'pending' | 'thinking' | 'done'
  dependsOn: string[]
}

export interface ThinkStep {
  id: string
  phase: ThinkingPhase
  content: string
  timestamp: number
  confidence: number
}

export interface ThinkResult {
  steps: ThinkStep[]
  conclusion: string
  confidence: number
  subQuestions: SubQuestion[]
  totalTimeMs: number
}

const PHASE_LABELS: Record<ThinkingPhase, string> = {
  problem_understanding: '理解问题',
  decomposition: '问题分解',
  hypothesis_generation: '生成假设',
  hypothesis_testing: '验证假设',
  multi_angle: '多角度分析',
  synthesis: '综合结论',
  reflection: '自我反思',
}

export class ChainOfThoughtEngine {
  private maxSteps = 15
  private maxSubQuestions = 5

  constructor(options?: { maxSteps?: number; maxSubQuestions?: number }) {
    if (options?.maxSteps) this.maxSteps = options.maxSteps
    if (options?.maxSubQuestions) this.maxSubQuestions = options.maxSubQuestions
  }

  decomposeQuestion(question: string): SubQuestion[] {
    const subQuestions: SubQuestion[] = []
    const q = question.trim()

    if (q.includes('怎么') || q.includes('如何') || q.includes('how to')) {
      subQuestions.push(
        { id: 'sq1', text: `这个问题的核心目标是什么？`, status: 'pending', dependsOn: [] },
        { id: 'sq2', text: `实现目标需要哪些步骤？`, status: 'pending', dependsOn: ['sq1'] },
        { id: 'sq3', text: `每一步的具体操作是什么？`, status: 'pending', dependsOn: ['sq2'] },
        { id: 'sq4', text: `有哪些需要注意的坑？`, status: 'pending', dependsOn: ['sq3'] },
        { id: 'sq5', text: `有没有更优的方案？`, status: 'pending', dependsOn: ['sq4'] },
      )
    } else if (q.includes('为什么') || q.includes('why') || q.includes('原因')) {
      subQuestions.push(
        { id: 'sq1', text: `现象是什么？`, status: 'pending', dependsOn: [] },
        { id: 'sq2', text: `直接原因有哪些？`, status: 'pending', dependsOn: ['sq1'] },
        { id: 'sq3', text: `根本原因是什么？`, status: 'pending', dependsOn: ['sq2'] },
        { id: 'sq4', text: `各因素之间的关系？`, status: 'pending', dependsOn: ['sq3'] },
        { id: 'sq5', text: `如何验证这个分析？`, status: 'pending', dependsOn: ['sq4'] },
      )
    } else if (q.includes('对比') || q.includes('区别') || q.includes('哪个好')) {
      subQuestions.push(
        { id: 'sq1', text: `对比的维度有哪些？`, status: 'pending', dependsOn: [] },
        { id: 'sq2', text: `方案A的优缺点？`, status: 'pending', dependsOn: ['sq1'] },
        { id: 'sq3', text: `方案B的优缺点？`, status: 'pending', dependsOn: ['sq1'] },
        { id: 'sq4', text: `适用场景分别是什么？`, status: 'pending', dependsOn: ['sq2', 'sq3'] },
        { id: 'sq5', text: `综合推荐哪个？`, status: 'pending', dependsOn: ['sq4'] },
      )
    } else {
      subQuestions.push(
        { id: 'sq1', text: `问题的关键是什么？`, status: 'pending', dependsOn: [] },
        { id: 'sq2', text: `已知条件有哪些？`, status: 'pending', dependsOn: ['sq1'] },
        { id: 'sq3', text: `可能的解决方案？`, status: 'pending', dependsOn: ['sq2'] },
        { id: 'sq4', text: `最佳方案是什么？`, status: 'pending', dependsOn: ['sq3'] },
        { id: 'sq5', text: `如何验证结论？`, status: 'pending', dependsOn: ['sq4'] },
      )
    }

    return subQuestions.slice(0, this.maxSubQuestions)
  }

  generateAngles(question: string): string[] {
    const angles: string[] = [
      '从技术实现角度分析',
      '从用户体验角度分析',
      '从成本/效率角度分析',
    ]

    if (question.includes('代码') || question.includes('编程') || question.includes('开发')) {
      angles.push('从代码质量角度分析')
      angles.push('从可维护性角度分析')
    }
    if (question.includes('产品') || question.includes('设计')) {
      angles.push('从产品价值角度分析')
      angles.push('从用户需求角度分析')
    }
    if (question.includes('学习') || question.includes('研究')) {
      angles.push('从学习路径角度分析')
      angles.push('从实践应用角度分析')
    }

    return angles.slice(0, 5)
  }

  buildThinkPrompt(question: string, style: 'detailed' | 'concise' | 'creative' = 'detailed'): string {
    const subQuestions = this.decomposeQuestion(question)
    const angles = this.generateAngles(question)

    let prompt = ''

    if (style === 'detailed') {
      prompt = `请深度思考以下问题，并展示你的完整推理过程。

【问题】${question}

【思考框架】
请按以下步骤逐步思考：

1. 理解问题：先明确问题的核心和边界
2. 问题分解：将复杂问题拆分为以下子问题
${subQuestions.map((sq, i) => `   ${i + 1}. ${sq.text}`).join('\n')}

3. 多角度分析：从以下视角分别审视
${angles.map((a, i) => `   ${i + 1}. ${a}`).join('\n')}

4. 综合结论：整合所有分析，给出最终答案
5. 自我反思：检查推理是否有漏洞，结论是否可靠

【输出格式】
请用"思考："标记你的推理过程，用"结论："标记最终答案。
思考过程要详细，展示你是如何一步步得出结论的。`
    } else if (style === 'concise') {
      prompt = `请简洁高效地思考并回答：${question}

简要说明你的推理路径（2-3步即可），然后给出清晰的结论。`
    } else {
      prompt = `请用发散性思维思考这个问题：${question}

不要局限于常规答案，尝试从不同角度、甚至反直觉的方向探索。
先列出3-5个不同的思路，再评估哪个最有价值。`
    }

    return prompt
  }

  parseThinkSteps(text: string): ThinkStep[] {
    const steps: ThinkStep[] = []
    const lines = text.split('\n')
    let currentPhase: ThinkingPhase = 'problem_understanding'
    let currentContent = ''

    const phaseKeywords: { pattern: RegExp; phase: ThinkingPhase }[] = [
      { pattern: /(理解|问题|背景|核心)/, phase: 'problem_understanding' },
      { pattern: /(分解|子问题|拆分|步骤)/, phase: 'decomposition' },
      { pattern: /(假设|猜想|可能|或许)/, phase: 'hypothesis_generation' },
      { pattern: /(验证|检查|测试|是否)/, phase: 'hypothesis_testing' },
      { pattern: /(角度|视角|方面|另一方面)/, phase: 'multi_angle' },
      { pattern: /(综合|结论|总结|因此|所以)/, phase: 'synthesis' },
      { pattern: /(反思|检查|漏洞|不足|改进)/, phase: 'reflection' },
    ]

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue

      let matched = false
      for (const { pattern, phase } of phaseKeywords) {
        if (pattern.test(trimmed)) {
          if (currentContent) {
            steps.push({
              id: `step_${steps.length}`,
              phase: currentPhase,
              content: currentContent.trim(),
              timestamp: Date.now() + steps.length * 100,
              confidence: 0.6 + Math.random() * 0.3,
            })
          }
          currentPhase = phase
          currentContent = trimmed
          matched = true
          break
        }
      }
      if (!matched) {
        currentContent += '\n' + trimmed
      }
    }

    if (currentContent) {
      steps.push({
        id: `step_${steps.length}`,
        phase: currentPhase,
        content: currentContent.trim(),
        timestamp: Date.now() + steps.length * 100,
        confidence: 0.6 + Math.random() * 0.3,
      })
    }

    return steps.slice(0, this.maxSteps)
  }

  estimateConfidence(steps: ThinkStep[]): number {
    if (steps.length === 0) return 0.5

    const phaseCoverage = new Set(steps.map(s => s.phase)).size
    const avgConfidence = steps.reduce((s, st) => s + st.confidence, 0) / steps.length
    const stepBonus = Math.min(steps.length / 8, 1) * 0.1

    return Math.min(0.95, (phaseCoverage / 7) * 0.5 + avgConfidence * 0.3 + stepBonus + 0.2)
  }

  formatThinkDisplay(result: ThinkResult): string {
    let output = ''
    output += `🤔 思考过程（${result.steps.length}步，置信度 ${(result.confidence * 100).toFixed(0)}%）\n\n`

    for (const step of result.steps) {
      const icon = this.getPhaseIcon(step.phase)
      const label = PHASE_LABELS[step.phase]
      output += `${icon} **${label}**\n${step.content}\n\n`
    }

    output += `---\n✅ **结论**\n${result.conclusion}`
    return output
  }

  private getPhaseIcon(phase: ThinkingPhase): string {
    const icons: Record<ThinkingPhase, string> = {
      problem_understanding: '🎯',
      decomposition: '📋',
      hypothesis_generation: '💡',
      hypothesis_testing: '🔍',
      multi_angle: '🔄',
      synthesis: '🎯',
      reflection: '🤖',
    }
    return icons[phase] || '•'
  }
}

export const cotEngine = new ChainOfThoughtEngine()
