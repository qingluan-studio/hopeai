// ============================================================
//  Project Invariant - 认知几何不变量计算引擎 v2.0
//  四大不变量：ITC / SCS / IEC / PFFT
// ============================================================

export interface InvariantsResult {
  itc: number
  scs: number
  iec: number
  pfft: number
  details: {
    itc: { clustering: number; pathLength: number; randomClustering: number; randomPathLength: number }
    scs: { curvatures: number[]; meanDeltaKappa: number }
    iec: { entropy: number; criticalEntropy: number; sigma: number }
    pfft: { fidelity: number; freedom: number }
  }
  graph: { nodes: string[]; edges: [number, number][] }
  sentences: string[]
  diagnosis: string[]
  overallScore: number
  grade: string
}

// ============================================================
//  工具函数
// ============================================================

function splitSentences(text: string): string[] {
  return text
    .split(/[。！？.!?\n]+/)
    .map(s => s.trim())
    .filter(s => s.length > 5)
}

function tokenize(sentence: string): string[] {
  const cleaned = sentence.replace(/[，。、；：""''（）《》【】\s,.!?;:'"()\[\]{}]/g, '')
  const tokens: string[] = []
  const n = 2
  for (let i = 0; i <= cleaned.length - n; i++) {
    tokens.push(cleaned.slice(i, i + n))
  }
  return tokens
}

function cosineSimilarity(vecA: Map<string, number>, vecB: Map<string, number>): number {
  let dotProduct = 0
  let normA = 0
  let normB = 0
  for (const [term, countA] of vecA) {
    const countB = vecB.get(term) || 0
    dotProduct += countA * countB
    normA += countA * countA
  }
  for (const countB of vecB.values()) {
    normB += countB * countB
  }
  if (normA === 0 || normB === 0) return 0
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

function buildTermVector(tokens: string[]): Map<string, number> {
  const vec = new Map<string, number>()
  for (const t of tokens) {
    vec.set(t, (vec.get(t) || 0) + 1)
  }
  return vec
}

// ============================================================
//  不变量一：信息拓扑紧致性 (ITC)
//  Information Topology Compactness
// ============================================================

function buildPropositionGraph(sentences: string[]): { nodes: string[]; edges: [number, number][] } {
  const nodes = sentences
  const edges: [number, number][] = []
  const threshold = 0.25

  const vectors = sentences.map(s => buildTermVector(tokenize(s)))

  for (let i = 0; i < sentences.length; i++) {
    for (let j = i + 1; j < sentences.length; j++) {
      const sim = cosineSimilarity(vectors[i], vectors[j])
      if (sim > threshold) {
        edges.push([i, j])
      }
    }
  }

  return { nodes, edges }
}

function averageClusteringCoefficient(nodes: string[], edges: [number, number][]): number {
  const n = nodes.length
  if (n < 3) return 0

  const adj = new Map<number, Set<number>>()
  for (let i = 0; i < n; i++) adj.set(i, new Set())
  for (const [a, b] of edges) {
    adj.get(a)!.add(b)
    adj.get(b)!.add(a)
  }

  let totalC = 0
  for (let i = 0; i < n; i++) {
    const neighbors = Array.from(adj.get(i)!)
    const k = neighbors.length
    if (k < 2) continue

    let links = 0
    for (let a = 0; a < k; a++) {
      for (let b = a + 1; b < k; b++) {
        if (adj.get(neighbors[a])!.has(neighbors[b])) {
          links++
        }
      }
    }
    totalC += (2 * links) / (k * (k - 1))
  }

  return totalC / n
}

function averageShortestPath(nodes: string[], edges: [number, number][]): number {
  const n = nodes.length
  if (n < 2) return 1

  const adj = new Map<number, number[]>()
  for (let i = 0; i < n; i++) adj.set(i, [])
  for (const [a, b] of edges) {
    adj.get(a)!.push(b)
    adj.get(b)!.push(a)
  }

  let totalDist = 0
  let pairs = 0

  for (let s = 0; s < n; s++) {
    const dist = new Array(n).fill(Infinity)
    dist[s] = 0
    const queue: number[] = [s]
    while (queue.length > 0) {
      const u = queue.shift()!
      for (const v of adj.get(u)!) {
        if (dist[v] === Infinity) {
          dist[v] = dist[u] + 1
          queue.push(v)
        }
      }
    }
    for (let t = s + 1; t < n; t++) {
      if (dist[t] < Infinity) {
        totalDist += dist[t]
        pairs++
      }
    }
  }

  return pairs > 0 ? totalDist / pairs : n
}

function randomGraphStats(n: number, m: number): { C: number; L: number } {
  const p = (2 * m) / (n * (n - 1))
  const C_random = p
  if (n <= 1 || p <= 0) return { C: 0.001, L: 1 }
  const L_random = Math.log(n) / Math.log(n * p)
  return { C: Math.max(C_random, 0.001), L: Math.max(L_random, 1) }
}

function calculateITC(sentences: string[]): {
  score: number
  clustering: number
  pathLength: number
  randomClustering: number
  randomPathLength: number
  graph: { nodes: string[]; edges: [number, number][] }
} {
  const graph = buildPropositionGraph(sentences)
  const C = averageClusteringCoefficient(graph.nodes, graph.edges)
  const L = averageShortestPath(graph.nodes, graph.edges)
  const rand = randomGraphStats(graph.nodes.length, graph.edges.length)
  const itc = (C / rand.C) / (L / rand.L)
  return {
    score: Math.min(itc, 10),
    clustering: C,
    pathLength: L,
    randomClustering: rand.C,
    randomPathLength: rand.L,
    graph,
  }
}

// ============================================================
//  不变量二：语义曲率平滑度 (SCS)
//  Semantic Curvature Smoothness
// ============================================================

function semanticEmbedding(sentence: string, allTokens: string[]): number[] {
  const vec = buildTermVector(tokenize(sentence))
  return allTokens.map(t => vec.get(t) || 0)
}

function vectorNorm(v: number[]): number {
  return Math.sqrt(v.reduce((s, x) => s + x * x, 0))
}

function vectorAdd(a: number[], b: number[]): number[] {
  return a.map((x, i) => x + b[i])
}

function vectorSub(a: number[], b: number[]): number[] {
  return a.map((x, i) => x - b[i])
}

function vectorDot(a: number[], b: number[]): number {
  return a.reduce((s, x, i) => s + x * b[i], 0)
}

function discreteCurvature(p0: number[], p1: number[], p2: number[]): number {
  const a = vectorSub(p1, p0)
  const b = vectorSub(p2, p1)
  const normA = vectorNorm(a)
  const normB = vectorNorm(b)
  if (normA === 0 || normB === 0) return 0
  const cosAngle = vectorDot(a, b) / (normA * normB)
  const angle = Math.acos(Math.max(-1, Math.min(1, cosAngle)))
  const sideLen = (normA + normB) / 2
  if (sideLen === 0) return 0
  return angle / sideLen
}

function calculateSCS(sentences: string[]): {
  score: number
  curvatures: number[]
  meanDeltaKappa: number
} {
  if (sentences.length < 3) {
    return { score: 0, curvatures: [], meanDeltaKappa: 0 }
  }

  const allTokenSet = new Set<string>()
  for (const s of sentences) {
    for (const t of tokenize(s)) allTokenSet.add(t)
  }
  const allTokens = Array.from(allTokenSet)

  const embeddings = sentences.map(s => semanticEmbedding(s, allTokens))

  const curvatures: number[] = []
  for (let i = 1; i < embeddings.length - 1; i++) {
    curvatures.push(discreteCurvature(embeddings[i - 1], embeddings[i], embeddings[i + 1]))
  }

  const deltas: number[] = []
  for (let i = 1; i < curvatures.length; i++) {
    deltas.push(Math.abs(curvatures[i] - curvatures[i - 1]))
  }

  const meanDelta = deltas.length > 0 ? deltas.reduce((s, d) => s + d, 0) / deltas.length : 0.1
  const scs = -Math.log(meanDelta + 0.001)

  return {
    score: Math.max(0, Math.min(scs, 5)),
    curvatures,
    meanDeltaKappa: meanDelta,
  }
}

// ============================================================
//  不变量三：信息熵临界性 (IEC)
//  Information Entropy Criticality
// ============================================================

function calculateEntropy(text: string): number {
  const tokens = tokenize(text)
  if (tokens.length === 0) return 0

  const freq = new Map<string, number>()
  for (const t of tokens) {
    freq.set(t, (freq.get(t) || 0) + 1)
  }

  let entropy = 0
  const total = tokens.length
  for (const count of freq.values()) {
    const p = count / total
    entropy -= p * Math.log2(p)
  }

  return entropy
}

function calculateIEC(text: string, sentences: string[]): {
  score: number
  entropy: number
  criticalEntropy: number
  sigma: number
} {
  const H = calculateEntropy(text)
  const tokenTypes = new Set(tokenize(text)).size
  const H_max = Math.log2(Math.max(tokenTypes, 2))
  const H_crit = H_max * 0.6
  const sigma = H_max * 0.25

  const diff = Math.abs(H - H_crit)
  const iec = Math.exp(-diff / sigma)

  return {
    score: Math.max(0, Math.min(iec, 1)),
    entropy: H,
    criticalEntropy: H_crit,
    sigma,
  }
}

// ============================================================
//  不变量四：投影保真度-自由度权衡 (PFFT)
//  Projection Fidelity-Freedom Tradeoff
// ============================================================

function maxNGramOverlap(textA: string, textB: string, n: number = 4): number {
  const tokensA = tokenize(textA)
  const tokensB = tokenize(textB)

  if (tokensA.length < n || tokensB.length < n) return 0

  const ngramsB = new Set<string>()
  for (let i = 0; i <= tokensB.length - n; i++) {
    ngramsB.add(tokensB.slice(i, i + n).join(''))
  }

  let overlap = 0
  let total = 0
  for (let i = 0; i <= tokensA.length - n; i++) {
    const ng = tokensA.slice(i, i + n).join('')
    if (ngramsB.has(ng)) overlap++
    total++
  }

  return total > 0 ? overlap / total : 0
}

function calculatePFFT(text: string, sentences: string[]): {
  score: number
  fidelity: number
  freedom: number
} {
  if (sentences.length < 3) {
    return { score: 0, fidelity: 0, freedom: 0 }
  }

  const graph = buildPropositionGraph(sentences)
  const C = averageClusteringCoefficient(graph.nodes, graph.edges)
  const L = averageShortestPath(graph.nodes, graph.edges)
  const structureScore = C / (L + 0.1)
  const fidelity = Math.min(1, structureScore / 2)

  const shuffled = [...sentences].sort(() => Math.random() - 0.5).join('')
  const overlap = maxNGramOverlap(text, shuffled, 3)
  const freedom = Math.max(0, 1 - overlap * 2)

  const pfft = fidelity * freedom

  return {
    score: Math.max(0, Math.min(pfft, 1)),
    fidelity,
    freedom,
  }
}

// ============================================================
//  综合评估
// ============================================================

function normalizeITC(itc: number): number {
  return Math.min(1, itc / 5)
}

function normalizeSCS(scs: number): number {
  return Math.min(1, scs / 3.5)
}

function normalizeIEC(iec: number): number {
  return iec
}

function normalizePFFT(pfft: number): number {
  return pfft
}

function generateDiagnosis(
  itcNorm: number,
  scsNorm: number,
  iecNorm: number,
  pfftNorm: number,
  details: InvariantsResult['details']
): string[] {
  const diagnosis: string[] = []

  if (itcNorm < 0.4) {
    diagnosis.push('⚠️ 拓扑紧致性偏低：命题之间关联松散，建议加强论证的内部连接，增加跨段落的逻辑呼应')
  } else if (itcNorm > 0.85) {
    diagnosis.push('🔴 拓扑紧致性过高：可能存在循环论证或过度自指，注意引入外部视角')
  } else {
    diagnosis.push('✅ 拓扑结构健康：小世界网络特征明显，论证既紧密又高效')
  }

  if (scsNorm < 0.4) {
    diagnosis.push('⚠️ 语义曲率波动较大：论证路径存在跳跃，可能缺少过渡环节或隐含前提未明说')
  } else {
    diagnosis.push('✅ 推理路径平滑：论证推进自然流畅，逻辑跳跃较少')
  }

  if (iecNorm < 0.3) {
    if (details.iec.entropy < details.iec.criticalEntropy) {
      diagnosis.push('⚠️ 信息熵偏低：内容过于冗余或常识化，信息量不足，建议增加新视角或深度')
    } else {
      diagnosis.push('⚠️ 信息熵偏高：内容过于发散，结构感弱，建议收束主线，强化核心论证')
    }
  } else {
    diagnosis.push('✅ 信息密度适中：处于混沌边缘，既有信息量又有结构性')
  }

  if (pfftNorm < 0.3) {
    diagnosis.push('⚠️ 投影权衡不足：表达的原创性和忠实度平衡不佳')
  } else {
    diagnosis.push('✅ 表达质量良好：在忠实于思想内核的同时保持了表达独立性')
  }

  return diagnosis
}

function calculateGrade(overallScore: number): string {
  if (overallScore >= 0.85) return 'S · 卓越'
  if (overallScore >= 0.7) return 'A · 优秀'
  if (overallScore >= 0.55) return 'B · 良好'
  if (overallScore >= 0.4) return 'C · 一般'
  return 'D · 待提升'
}

// ============================================================
//  主入口
// ============================================================

export function computeCognitiveInvariants(text: string): InvariantsResult {
  const sentences = splitSentences(text)

  if (sentences.length < 3) {
    return {
      itc: 0,
      scs: 0,
      iec: 0,
      pfft: 0,
      details: {
        itc: { clustering: 0, pathLength: 0, randomClustering: 0, randomPathLength: 0 },
        scs: { curvatures: [], meanDeltaKappa: 0 },
        iec: { entropy: 0, criticalEntropy: 0, sigma: 0 },
        pfft: { fidelity: 0, freedom: 0 },
      },
      graph: { nodes: [], edges: [] },
      sentences: [],
      diagnosis: ['文本太短（少于3个句子），无法计算有效不变量'],
      overallScore: 0,
      grade: '-',
    }
  }

  const itcResult = calculateITC(sentences)
  const scsResult = calculateSCS(sentences)
  const iecResult = calculateIEC(text, sentences)
  const pfftResult = calculatePFFT(text, sentences)

  const itcNorm = normalizeITC(itcResult.score)
  const scsNorm = normalizeSCS(scsResult.score)
  const iecNorm = normalizeIEC(iecResult.score)
  const pfftNorm = normalizePFFT(pfftResult.score)

  const weights = { itc: 0.3, scs: 0.25, iec: 0.25, pfft: 0.2 }
  const overallScore =
    itcNorm * weights.itc +
    scsNorm * weights.scs +
    iecNorm * weights.iec +
    pfftNorm * weights.pfft

  const details = {
    itc: {
      clustering: itcResult.clustering,
      pathLength: itcResult.pathLength,
      randomClustering: itcResult.randomClustering,
      randomPathLength: itcResult.randomPathLength,
    },
    scs: {
      curvatures: scsResult.curvatures,
      meanDeltaKappa: scsResult.meanDeltaKappa,
    },
    iec: {
      entropy: iecResult.entropy,
      criticalEntropy: iecResult.criticalEntropy,
      sigma: iecResult.sigma,
    },
    pfft: {
      fidelity: pfftResult.fidelity,
      freedom: pfftResult.freedom,
    },
  }

  const diagnosis = generateDiagnosis(itcNorm, scsNorm, iecNorm, pfftNorm, details)

  return {
    itc: itcResult.score,
    scs: scsResult.score,
    iec: iecResult.score,
    pfft: pfftResult.score,
    details,
    graph: itcResult.graph,
    sentences,
    diagnosis,
    overallScore,
    grade: calculateGrade(overallScore),
  }
}
