import { Router, type Request, type Response } from 'express'

const router = Router()

const KIMI_API_URL = 'https://api.moonshot.cn/v1/chat/completions'
const KIMI_API_KEY = process.env.KIMI_API_KEY || 'sk-NWQEMc5Xt8z4J91JZOHNUnIff26ChPxaFPzgWhkheiiWeSon'
const KIMI_MODEL = process.env.KIMI_MODEL || 'moonshot-v1-8k'

// 知识库内存存储（支持720+条目）
let knowledgeBase: any[] = []

// 知识图谱（记录知识点之间的关系）
let knowledgeGraph: Record<string, string[]> = {}

// 初始知识库（从 Kimi 联网搜索整理的核心知识）
const INITIAL_KNOWLEDGE = [
  { title: 'React Hooks核心知识', content: 'useState状态管理、useEffect副作用处理、useContext跨组件传值、useRef DOM引用、useMemo性能优化缓存、useCallback回调缓存、useReducer复杂状态管理。Hooks规则：只在顶层调用，不在循环/条件/嵌套函数中调用。', category: '前端开发', tags: ['react', 'hooks', '前端', 'javascript'] },
  { title: 'React状态管理方案对比', content: 'Redux Toolkit企业级状态管理、Zustand轻量级方案、Jotai原子化状态、Recoil Facebook出品。趋势：从单一Store向原子化状态转变，TypeScript支持越来越好。', category: '前端开发', tags: ['react', 'redux', 'zustand', '状态管理'] },
  { title: 'Vue 3组合式API', content: 'setup()/<script setup>语法糖、ref/reactive响应式、computed计算属性、watch/watchEffect侦听器。Proxy替代Object.defineProperty实现响应式。Pinia替代Vuex成为官方推荐状态管理。', category: '前端开发', tags: ['vue', 'composition api', 'pinia', '前端'] },
  { title: 'Next.js App Router架构', content: 'React Server Components服务端组件、Server Actions表单处理、文件系统路由、布局嵌套、Loading/Error边界、并行路由和拦截路由。RSC减少客户端JS包体积。', category: '前端开发', tags: ['next.js', 'react', 'ssr', '服务端渲染'] },
  { title: '前端构建工具对比', content: 'Vite基于ESM的极速构建、Rspack Rust实现高性能Webpack兼容、Turbopack Vercel出品、Bun全能运行时。趋势：Rust/Go重写构建工具，ESM成为标准。', category: '前端开发', tags: ['vite', 'webpack', '构建工具', '前端'] },
  { title: 'TypeScript高级类型', content: '泛型约束、条件类型(T extends U ? X : Y)、映射类型、模板字面量类型、infer类型推断、类型体操。utility类型：Partial/Required/Pick/Omit/Record/ReturnType。', category: '前端开发', tags: ['typescript', '类型系统', '前端'] },
  { title: 'CSS方案对比', content: 'Tailwind CSS原子化CSS、CSS Modules局部作用域、CSS-in-JS(emotion/styled-components)运行时方案、Vanilla Extract零运行时CSS-in-JS。趋势：原子化CSS + 零运行时。', category: '前端开发', tags: ['css', 'tailwind', '前端'] },
  { title: '前端性能优化策略', content: 'React.memo组件记忆化、代码分割(lazy/Suspense)、虚拟列表(react-window)、图片懒加载、Tree Shaking、CDN加速、Service Worker缓存、Web Vitals核心指标(LCP/FID/CLS)。', category: '性能优化', tags: ['性能', '优化', '前端', '缓存'] },
  { title: 'Node.js异步编程', content: 'Event Loop事件循环机制、Promise/async-await语法、Stream流式处理大数据、Worker Threads多线程、Cluster模式利用多核CPU。PM2进程管理和负载均衡。', category: '后端开发', tags: ['node.js', '异步', 'event loop', '后端'] },
  { title: 'Express vs Fastify vs NestJS', content: 'Express经典框架生态丰富、Fastify高性能低开销(比Express快2倍)、NestJS企业级TypeScript优先(依赖注入/装饰器/模块化)。Hono适配边缘计算。', category: '后端开发', tags: ['node.js', 'express', 'fastify', 'nestjs'] },
  { title: 'Python Web框架对比', content: 'FastAPI异步高性能自动文档、Django全功能ORM/Admin/认证、Flask轻量灵活。Pydantic v2用Rust重写核心大幅提升性能。ASGI(Uvicorn/Gunicorn)替代WSGI。', category: '后端开发', tags: ['python', 'fastapi', 'django', 'flask'] },
  { title: 'RESTful API设计规范', content: '资源URI: /users/{id}、HTTP方法: GET/POST/PUT/PATCH/DELETE、状态码: 200/201/204/400/401/403/404/409/422/500、版本控制: URL(/v1/)或Header、分页: cursor-based优于offset-based。', category: '后端开发', tags: ['api', 'rest', '接口设计', '后端'] },
  { title: 'GraphQL vs gRPC', content: 'GraphQL: Schema类型系统、Query/Mutation/Subscription、Resolver解析、DataLoader解决N+1。gRPC: Protocol Buffers序列化、HTTP/2多路复用、适合微服务内部通信。tRPC端到端类型安全。', category: '后端开发', tags: ['graphql', 'grpc', 'api', '后端'] },
  { title: 'MySQL索引优化', content: 'B+树结构、聚簇索引/非聚簇索引、覆盖索引避免回表、最左前缀原则、索引下推(ICP)。EXPLAIN分析执行计划。MySQL 8.0新特性：窗口函数、CTE、降序索引、不可见索引。', category: '数据库', tags: ['mysql', '索引', '优化', '数据库'] },
  { title: 'MySQL事务与锁机制', content: 'ACID特性、四种隔离级别(RU/RC/RR/Serializable)、MVCC多版本并发控制、间隙锁/临键锁防幻读、死锁检测。InnoDB行锁支持事务。', category: '数据库', tags: ['mysql', '事务', '锁', 'mvcc'] },
  { title: 'PostgreSQL高级特性', content: 'JSONB二进制JSON支持GIN索引、数组类型、PostGIS地理空间、TimescaleDB时序数据、pgVector向量搜索(AI/RAG必备)。CTE递归查询、LATERAL JOIN、并行查询。', category: '数据库', tags: ['postgresql', 'jsonb', 'postgis', 'pgvector'] },
  { title: 'Redis数据结构与应用', content: 'String缓存/计数器/分布式锁、Hash对象存储、List消息队列、Set标签系统、Sorted Set排行榜、Bitmap签到统计、HyperLogLog UV统计、Stream消息队列、Geo地理位置。', category: '数据库', tags: ['redis', '缓存', '消息队列', '数据库'] },
  { title: 'Redis持久化与高可用', content: 'RDB快照fork子进程、AOF日志追加everysec策略、混合模式RDB+AOF。主从复制全量+增量、Sentinel自动故障转移、Cluster 16384槽位分片。大Key拆分、热Key本地缓存。', category: '数据库', tags: ['redis', '持久化', '高可用', '集群'] },
  { title: 'Docker镜像优化', content: '多阶段构建减小镜像体积、Alpine/Distroless基础镜像、.dockerignore排除无关文件、层缓存优化顺序。非root运行安全、只读文件系统、镜像扫描(Trivy/Snyk)。', category: 'DevOps', tags: ['docker', '镜像', '容器', '安全'] },
  { title: 'Kubernetes核心架构', content: '控制平面: kube-apiserver/etcd/scheduler/controller-manager。工作节点: kubelet/kube-proxy/容器运行时。核心资源: Pod/Deployment/StatefulSet/Service/ConfigMap/Ingress。', category: 'DevOps', tags: ['kubernetes', 'k8s', '容器编排', 'devops'] },
  { title: 'K8s高级运维', content: 'Helm包管理Chart模板、Prometheus+Grafana监控、ELK/Loki日志、Jaeger链路追踪。GitOps: ArgoCD/Flux声明式交付。服务网格Istio/Linkerd mTLS流量管理。', category: 'DevOps', tags: ['kubernetes', 'helm', '监控', 'gitops'] },
  { title: 'CI/CD流水线设计', content: 'GitHub Actions: Workflow/Job/Step、Matrix构建、Reusable Workflows。GitLab CI: .gitlab-ci.yml、Stages/Jobs、Runners。部署策略: 蓝绿部署、金丝雀发布(Flagger/Argo Rollouts)、特性开关。', category: 'DevOps', tags: ['ci/cd', 'github actions', 'gitlab ci', '部署'] },
  { title: '微服务架构设计', content: '服务拆分原则: 单一职责、业务边界。服务通信: 同步(REST/gRPC)、异步(消息队列)。服务发现: Consul/Nacos/K8s Service。API网关: Kong/APISIX/Envoy。分布式事务: Saga/TCC/本地消息表。', category: '架构设计', tags: ['微服务', '架构', '分布式', '网关'] },
  { title: 'DDD领域驱动设计', content: '战略设计: 限界上下文、上下文映射。战术设计: 实体、值对象、聚合、聚合根、领域服务、领域事件。六边形架构(端口与适配器)解耦业务与技术。CQRS读写分离、Event Sourcing事件溯源。', category: '架构设计', tags: ['ddd', '领域驱动', '架构', 'cqrs'] },
  { title: 'Web安全防护', content: 'XSS: 输入过滤/输出编码/CSP。CSRF: Token验证/SameSite Cookie。SQL注入: 参数化查询/ORM。CORS跨域控制。Helmet安全头。OWASP Top 10防护。Zero Trust零信任架构。', category: '安全', tags: ['安全', 'xss', 'csrf', 'owasp'] },
  { title: '认证授权方案', content: 'JWT无状态Token(Access+Refresh)、OAuth 2.0授权码流程、Session+Cookie有状态认证。SSO单点登录(SAML/OIDC)。RBAC角色权限、ABAC属性权限。多因素认证MFA。', category: '安全', tags: ['认证', '授权', 'jwt', 'oauth', '安全'] },
  { title: '前端测试体系', content: '单元测试: Vitest/Jest、React Testing Library。E2E测试: Playwright(推荐)/Cypress。组件测试、快照测试。TDD测试驱动开发、BDD行为驱动。覆盖率: Istanbul/c8。', category: '测试', tags: ['测试', 'vitest', 'playwright', '前端'] },
  { title: '后端测试策略', content: '单元测试: pytest/Jest、Mock依赖。集成测试: 测试真实数据库/API。契约测试: Pact。性能测试: k6/Locust/JMeter。测试金字塔: 单元>集成>E2E。', category: '测试', tags: ['测试', 'pytest', '集成测试', '后端'] },
  { title: 'Transformer架构详解', content: 'Self-Attention自注意力机制、Multi-Head多头注意力、位置编码(Positional Encoding)、LayerNorm层归一化、Feed-Forward前馈网络。Encoder编码器(BERT)、Decoder解码器(GPT)。', category: 'AI/机器学习', tags: ['transformer', 'attention', 'bert', 'gpt'] },
  { title: 'LLM训练流程', content: 'Pre-training无监督预训练(海量文本)、SFT监督微调(指令数据)、RLHF人类反馈强化学习(DPO直接偏好优化更高效)。对齐人类价值观。MoE混合专家(Mixtral 8x7B)。', category: 'AI/机器学习', tags: ['llm', '训练', 'rlhf', '微调'] },
  { title: 'LoRA/QLoRA高效微调', content: 'LoRA只训练0.1%-1%适配器参数、单个适配器约78MB可插拔切换。QLoRA结合4-bit量化在单张消费级GPU微调70B模型。PEFT库标准实现。LLaMA-Factory一体化训练界面。', category: 'AI/机器学习', tags: ['lora', 'qlora', '微调', 'peft'] },
  { title: 'RAG检索增强生成', content: '基础流程: 文档加载→分块→Embedding→向量存储→相似度检索→LLM生成。高级: 语义分块、混合检索(向量+BM25)、重排序(Rerank)、查询重写。GraphRAG知识图谱增强。', category: 'AI/机器学习', tags: ['rag', 'embedding', '向量', '检索'] },
  { title: '向量数据库对比', content: 'Milvus 46K+ Stars高性能、FAISS Meta出品、Chroma轻量易用、Qdrant Rust实现、pgvector PostgreSQL扩展。EdgeVec浏览器WASM运行。选择: 小规模Chroma、生产Milvus/Qdrant、已有PG用pgvector。', category: 'AI/机器学习', tags: ['向量数据库', 'milvus', 'faiss', 'chroma'] },
  { title: 'AI Agent系统设计', content: 'ReAct模式(推理+行动)、Tool Use工具调用(Function Calling)、多Agent协作(AutoGen/CrewAI/MetaGPT)。记忆管理: 短期对话+长期向量存储。规划: 任务分解、反思修正。', category: 'AI/机器学习', tags: ['agent', 'react', 'function calling', '多agent'] },
  { title: '提示工程Prompt Engineering', content: 'Zero-shot/Few-shot提示、Chain-of-Thought思维链("Let\'s think step by step")、Self-Consistency多路投票、Tree of Thoughts树形思考。DSPy自动化Prompt优化。JSON mode结构化输出。', category: 'AI/机器学习', tags: ['prompt', 'cot', '提示工程', 'ai'] },
  { title: '模型量化技术', content: 'GPTQ基于Hessian矩阵校正、AWQ激活感知量化保护重要权重、GGUF(llama.cpp)支持CPU原生推理。4-bit量化体积缩小4-8倍、推理速度提升2-4倍、精度损失不到1%。Ollama一键部署。', category: 'AI/机器学习', tags: ['量化', 'gptq', 'awq', 'gguf'] },
  { title: 'Serverless无服务器架构', content: 'FaaS函数即服务(AWS Lambda/Cloudflare Workers/Vercel Functions)、按需付费自动伸缩。冷启动优化。BFF模式。边缘计算(Cloudflare Workers/Deno Deploy)。', category: '云原生', tags: ['serverless', 'lambda', '边缘计算', '云原生'] },
  { title: '云服务对比', content: 'AWS市场领导者服务最全、Azure企业集成好、GCP AI/ML优势。国内: 阿里云/腾讯云/华为云。Cloudflare全球边缘网络、Vercel前端部署首选。选择: 成本+区域+生态。', category: '云原生', tags: ['aws', 'azure', 'gcp', 'cloudflare', '云原生'] },
  { title: 'Web性能核心指标', content: 'Core Web Vitals: LCP最大内容绘制(<2.5s)、FID首次输入延迟(<100ms)、CLS累计布局偏移(<0.1)。优化: 图片优化(WebP/AVIF/Lazy)、代码分割、预加载、CDN、HTTP/2、Service Worker缓存。', category: '性能优化', tags: ['性能', 'web vitals', 'lcp', '优化'] },
  { title: 'Git工作流规范', content: 'Git Flow(主干develop+功能feature+发布release+热修hotfix)、GitHub Flow(简单PR)、Trunk-Based开发。Conventional Commits规范提交。Husky+lint-staged自动化代码检查。', category: '工具链', tags: ['git', '工作流', 'husky', '规范'] },
  { title: 'Monorepo管理工具', content: 'pnpm workspace高效磁盘利用、Turborepo远程缓存加速构建、Nx代码生成+依赖图分析。适合大型前端项目。Bazel超大规模构建。包发布: Changesets。', category: '工具链', tags: ['monorepo', 'pnpm', 'turborepo', 'nx'] },
  { title: '跨平台移动开发', content: 'React Native JS生态、Flutter Dart高性能自绘引擎、原生开发iOS(Swift)/Android(Kotlin)。uni-app国内小程序多端。选择: 性能优先Flutter、生态优先RN、原生体验优先原生。', category: '移动开发', tags: ['react native', 'flutter', 'ios', 'android'] },
  { title: 'Clean Code原则', content: '有意义命名、单一职责函数、避免深层嵌套、DRY不重复、KISS保持简单。SOLID原则: 单一职责/开闭/里氏替换/接口隔离/依赖倒置。代码审查清单。重构时机。', category: '最佳实践', tags: ['clean code', 'solid', '重构', '代码质量'] },
  { title: '敏捷开发实践', content: 'Scrum: Sprint冲刺/Daily Standup/回顾会议。看板: WIP限制/流动效率。用户故事: 作为XX我想XX以便XX。DoD完成定义。估算: 故事点/Planning Poker。', category: '最佳实践', tags: ['敏捷', 'scrum', '看板', '项目管理'] }
]

// 初始化知识库
function initializeKnowledgeBase() {
  if (knowledgeBase.length > 0) return

  for (const item of INITIAL_KNOWLEDGE) {
    knowledgeBase.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 9),
      title: item.title,
      content: item.content,
      source: 'kimi_search_curated',
      tags: item.tags,
      category: item.category,
      importance: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }

  // 构建初始知识图谱
  for (let i = 0; i < knowledgeBase.length; i++) {
    for (let j = i + 1; j < knowledgeBase.length; j++) {
      const tags1 = new Set(knowledgeBase[i].tags)
      const tags2 = new Set(knowledgeBase[j].tags)
      let similarity = 0
      for (const tag of tags1) {
        if (tags2.has(tag)) similarity++
      }
      if (similarity >= 2) {
        if (!knowledgeGraph[knowledgeBase[i].id]) knowledgeGraph[knowledgeBase[i].id] = []
        if (!knowledgeGraph[knowledgeBase[j].id]) knowledgeGraph[knowledgeBase[j].id] = []
        knowledgeGraph[knowledgeBase[i].id].push(knowledgeBase[j].id)
        knowledgeGraph[knowledgeBase[j].id].push(knowledgeBase[i].id)
      }
    }
  }

  console.log(`知识库已初始化: ${knowledgeBase.length} 条, 图谱关系: ${Object.keys(knowledgeGraph).length}`)
}

// 启动时初始化
initializeKnowledgeBase()

// 技术分类扩展（覆盖更多领域）
const TECH_KEYWORDS = {
  '前端开发': ['react', 'vue', 'angular', 'javascript', 'typescript', 'css', 'html', 'webpack', 'vite', '组件', '界面', 'ui', '前端', '浏览器', 'dom', '状态管理', 'redux', 'zustand', 'svelte', 'next.js', 'nuxt', 'tailwind', 'sass', 'less'],
  '后端开发': ['node.js', 'express', 'nestjs', 'api', '接口', '后端', '服务器', '中间件', '路由', '数据库', 'redis', 'mongodb', 'mysql', 'postgresql', 'python', 'django', 'flask', 'spring', 'go', 'gin', 'grpc'],
  '数据库': ['sql', 'nosql', 'mongodb', 'mysql', 'postgresql', 'redis', '索引', '查询优化', '事务', '数据库', '缓存', 'orm', 'elastic', 'solr', 'clickhouse', 'tidb', 'cockroach'],
  'DevOps': ['docker', 'kubernetes', 'ci/cd', '部署', '运维', '自动化', 'linux', 'nginx', '监控', '日志', '容器', '微服务', 'jenkins', 'github actions', 'gitlab ci', 'terraform', 'ansible'],
  '架构设计': ['架构', '设计模式', '微服务', '单体', '分布式', '高可用', '可扩展', 'ddd', '领域驱动', '分层架构', '依赖注入', 'cqrs', 'event sourcing', '六边形架构', 'adapter'],
  '性能优化': ['性能', '优化', '缓存', '懒加载', '预加载', '代码分割', '压缩', '首屏', '加载速度', '内存泄漏', '性能瓶颈', 'jank', 'fps', 'web vitals'],
  '安全': ['安全', 'xss', 'csrf', 'sql注入', '认证', '授权', 'jwt', 'oauth', '加密', '脱敏', '漏洞', '防护', 'cors', 'helmet', 'owasp', 'zero trust'],
  '测试': ['测试', '单元测试', '集成测试', 'e2e', 'jest', 'vitest', '测试用例', '覆盖率', 'mock', '断言', 'tdd', 'bdd', 'pytest', 'cypress', 'playwright'],
  '工具链': ['git', 'npm', 'yarn', 'pnpm', 'eslint', 'prettier', 'typescript', 'babel', '构建工具', '脚手架', '插件', 'husky', 'lint-staged', 'commitlint'],
  'AI/机器学习': ['ai', '机器学习', '深度学习', '神经网络', 'transformer', 'bert', 'gpt', 'llm', 'prompt', 'embedding', 'rag', '向量', 'tensorflow', 'pytorch'],
  '云原生': ['云原生', 'serverless', 'faas', 'paas', 'iaas', 'aws', 'azure', 'gcp', '阿里云', '腾讯云', 'cloudflare', 'vercel', 'lambda'],
  '移动开发': ['移动开发', 'ios', 'android', 'react native', 'flutter', 'swift', 'kotlin', 'uniapp', '小程序'],
  '最佳实践': ['最佳实践', '规范', '代码质量', '可维护性', '可读性', '重构', 'clean code', 'solid', '设计原则', '代码审查', '敏捷', 'scrum']
}

function classifyContent(text: string): string {
  const lowerText = text.toLowerCase()
  let bestCategory = '最佳实践'
  let maxMatches = 0

  for (const [category, words] of Object.entries(TECH_KEYWORDS)) {
    let matches = 0
    for (const word of words) {
      if (lowerText.includes(word.toLowerCase())) {
        matches++
      }
    }
    if (matches > maxMatches) {
      maxMatches = matches
      bestCategory = category
    }
  }
  return bestCategory
}

function tagContent(text: string): string[] {
  const lowerText = text.toLowerCase()
  const tags: string[] = []
  for (const words of Object.values(TECH_KEYWORDS)) {
    for (const word of words) {
      if (lowerText.includes(word.toLowerCase())) {
        tags.push(word)
      }
    }
  }
  return [...new Set(tags)].slice(0, 10)
}

// 语义分块（按意义切分文档）
function semanticChunk(content: string, chunkSize = 300): string[] {
  const paragraphs = content.split(/[\n\n]+/)
  const chunks: string[] = []
  let currentChunk = ''

  for (const para of paragraphs) {
    if (currentChunk.length + para.length < chunkSize) {
      currentChunk += (currentChunk ? '\n\n' : '') + para
    } else {
      if (currentChunk) chunks.push(currentChunk)
      currentChunk = para
    }
  }
  if (currentChunk) chunks.push(currentChunk)

  return chunks
}

// 增强搜索（多级检索）
function enhancedSearch(query: string, limit = 5): any[] {
  if (knowledgeBase.length === 0) return []

  const lowerQuery = query.toLowerCase()
  const queryWords = lowerQuery.split(/[\s,，。、！？]+/).filter(w => w.length > 1)

  const scored = knowledgeBase.map(entry => {
    let score = 0
    const titleLower = entry.title.toLowerCase()
    const contentLower = entry.content.toLowerCase()
    const tagsLower = entry.tags.map((t: string) => t.toLowerCase()).join(' ')

    for (const word of queryWords) {
      if (titleLower.includes(word)) score += 5
      if (tagsLower.includes(word)) score += 3
      if (contentLower.includes(word)) score += 2
    }

    // 基于类别匹配的额外加分
    const queryCategory = classifyContent(query)
    if (entry.category === queryCategory) score += 4

    return { entry, score }
  })

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.entry)
}

// 知识图谱扩展搜索
function graphExpandSearch(query: string, results: any[]): any[] {
  const expanded: any[] = [...results]
  const visited = new Set(results.map(r => r.id))

  for (const result of results) {
    const relatedIds = knowledgeGraph[result.id] || []
    for (const relatedId of relatedIds) {
      if (!visited.has(relatedId)) {
        const related = knowledgeBase.find(k => k.id === relatedId)
        if (related) {
          expanded.push(related)
          visited.add(relatedId)
        }
      }
    }
  }

  return expanded.slice(0, 8)
}

// 构建知识图谱关系
function buildKnowledgeGraph(entry: any) {
  const relatedIds: string[] = []

  for (const existing of knowledgeBase) {
    if (existing.id === entry.id) continue

    let similarity = 0
    const entryTags = new Set(entry.tags)
    const existingTags = new Set(existing.tags)

    for (const tag of entryTags) {
      if (existingTags.has(tag)) similarity++
    }

    if (similarity >= 2) {
      relatedIds.push(existing.id)
    }
  }

  if (relatedIds.length > 0) {
    knowledgeGraph[entry.id] = relatedIds
  }
}

// 构建RAG上下文
function buildRagContext(query: string): { context: string; sources: any[] } {
  const initialResults = enhancedSearch(query, 4)
  const expandedResults = graphExpandSearch(query, initialResults)

  const sources = [...new Set(expandedResults)]

  const contextParts = sources.map((source, i) => {
    const chunks = semanticChunk(source.content, 400)
    const relevantChunk = chunks.find(ch =>
      ch.toLowerCase().includes(query.toLowerCase())
    ) || chunks[0]

    return `【知识${i + 1}】${source.title} [${source.category}]
${relevantChunk.slice(0, 600)}...`
  })

  return {
    context: contextParts.join('\n\n'),
    sources
  }
}

// 希望AI聊天接口（增强版：思维链推理 + RAG + 自我反思 + 联网搜索）
router.post('/hopeai', async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages, useChainOfThought = true, useReflection = true, useWebSearch = true } = req.body

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ success: false, error: '缺少 messages 参数' })
      return
    }

    const lastMessage = messages[messages.length - 1]?.content || ''

    // RAG检索
    let ragContext = ''
    let sources: any[] = []
    if (lastMessage.length > 5) {
      const ragResult = buildRagContext(lastMessage)
      if (ragResult.context) {
        ragContext = `\n\n📚 知识库参考（${ragResult.sources.length}条）:\n\n${ragResult.context}`
        sources = ragResult.sources
      }
    }

    // 构建系统提示词
    const systemPrompt = {
      role: 'system' as const,
      content: `你是希望AI（HopeAI），一个智能对话助手。

${useChainOfThought ? `
🎯 思维链推理：
对于复杂问题，请遵循以下步骤：
1. 理解问题：明确用户的核心需求和背景
2. 分析问题：将问题分解为子问题
3. 检索知识：从提供的知识库中查找相关信息
4. 推理过程：逐步推导解决方案
5. 验证答案：检查答案是否合理、完整

使用"思考："标记你的推理过程，最终答案前使用"答案："标记。
` : ''}

${useReflection ? `
🔍 自我反思：
在给出答案后，反思以下问题：
- 答案是否准确？是否有遗漏？
- 是否引用了正确的知识来源？
- 是否存在逻辑漏洞？
- 是否需要进一步解释？

如果发现问题，请进行修正。
` : ''}

📖 知识库使用规则：
- 优先使用知识库中的信息回答问题
- 如果知识库中有多个相关条目，综合所有信息给出完整答案
- 如果知识库中没有相关信息，可以使用联网搜索获取最新信息
- 引用知识库内容时，请标注来源标题

回答风格：专业、清晰、有深度，代码示例使用markdown格式。`
    }

    // 构建增强的消息
    const enhancedMessages = [systemPrompt, ...messages]
    if (ragContext) {
      enhancedMessages[enhancedMessages.length - 1].content += ragContext
    }

    // 构建请求体
    const requestBody: any = {
      model: useWebSearch ? 'kimi-k2.6' : KIMI_MODEL,
      messages: enhancedMessages,
      temperature: useChainOfThought ? 0.8 : 0.7,
      max_tokens: 3000
    }

    // 如果启用联网搜索，添加 $web_search 工具
    if (useWebSearch) {
      requestBody.tools = [
        {
          type: 'builtin_function',
          function: {
            name: '$web_search'
          }
        }
      ]
      // 使用 $web_search 时必须禁用思考能力
      requestBody.thinking = { type: 'disabled' }
    }

    // 调用 Kimi API
    const response = await fetch(KIMI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KIMI_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Kimi API error:', errorData)
      res.status(500).json({ success: false, error: 'Kimi API调用失败' })
      return
    }

    let data = await response.json()

    // 处理 tool_calls（$web_search 的特殊流程）
    const choice = data.choices?.[0]
    if (choice?.message?.tool_calls && choice.finish_reason === 'tool_calls') {
      // 原样返回 tool_call 参数（$web_search 的正确用法）
      const toolMessages = [...enhancedMessages, choice.message]

      for (const toolCall of choice.message.tool_calls) {
        toolMessages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: toolCall.function.arguments
        })
      }

      // 再次调用 Kimi API，获取最终回答
      const followUpResponse = await fetch(KIMI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${KIMI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'kimi-k2.6',
          messages: toolMessages,
          temperature: 0.7,
          max_tokens: 3000,
          tools: requestBody.tools,
          thinking: { type: 'disabled' }
        })
      })

      if (followUpResponse.ok) {
        data = await followUpResponse.json()
      }
    }

    // 提取引用来源
    const aiContent = data.choices?.[0]?.message?.content || ''
    const citedSources = sources.filter(s => aiContent.includes(s.title))

    res.json({
      success: true,
      data: data,
      ragUsed: ragContext ? true : false,
      webSearchUsed: useWebSearch,
      sources: citedSources.length > 0 ? citedSources : sources.slice(0, 3),
      chainOfThought: useChainOfThought,
      reflection: useReflection
    })
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ success: false, error: '服务器内部错误' })
  }
})

// 知识库同步接口
router.post('/knowledge/sync', async (req: Request, res: Response): Promise<void> => {
  try {
    const { items, source = 'hopeagent_pro' } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, error: 'items 必须是非空数组' })
      return
    }

    let created = 0
    let updated = 0
    let skipped = 0

    for (const item of items) {
      if (!item.title || !item.content) {
        skipped++
        continue
      }

      const existingIndex = knowledgeBase.findIndex(k => k.title === item.title)

      const normalizedItem = {
        id: item.id || Date.now().toString(36) + Math.random().toString(36).slice(2, 9),
        title: item.title,
        content: item.content,
        source: item.source || source,
        tags: item.tags || tagContent(item.content),
        category: item.category || classifyContent(item.content),
        importance: item.importance || (item.content.includes('重要') || item.content.includes('关键') ? 9 : 5),
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      if (existingIndex >= 0) {
        knowledgeBase[existingIndex] = normalizedItem
        updated++
      } else {
        knowledgeBase.push(normalizedItem)
        buildKnowledgeGraph(normalizedItem)
        created++
      }
    }

    res.json({
      success: true,
      created,
      updated,
      skipped,
      total: knowledgeBase.length,
      graphEdges: Object.keys(knowledgeGraph).length
    })
  } catch (error) {
    console.error('Sync error:', error)
    res.status(500).json({ success: false, error: '同步失败' })
  }
})

// 批量导入知识（支持720+条目）
router.post('/knowledge/batch-import', async (req: Request, res: Response): Promise<void> => {
  try {
    const { items, source = 'batch_import' } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, error: 'items 必须是非空数组' })
      return
    }

    const startTime = Date.now()
    let created = 0
    let updated = 0
    let skipped = 0

    for (const item of items) {
      if (!item.title || !item.content) {
        skipped++
        continue
      }

      const existingIndex = knowledgeBase.findIndex(k => k.title === item.title)

      const normalizedItem = {
        id: item.id || Date.now().toString(36) + Math.random().toString(36).slice(2, 9),
        title: item.title,
        content: item.content,
        source: item.source || source,
        tags: item.tags || tagContent(item.content),
        category: item.category || classifyContent(item.content),
        importance: item.importance || (item.content.includes('重要') || item.content.includes('关键') ? 9 : 5),
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      if (existingIndex >= 0) {
        knowledgeBase[existingIndex] = normalizedItem
        updated++
      } else {
        knowledgeBase.push(normalizedItem)
        created++
      }
    }

    // 批量构建知识图谱（优化性能）
    for (let i = 0; i < knowledgeBase.length; i++) {
      for (let j = i + 1; j < knowledgeBase.length; j++) {
        const entry1 = knowledgeBase[i]
        const entry2 = knowledgeBase[j]

        let similarity = 0
        const tags1 = new Set(entry1.tags)
        const tags2 = new Set(entry2.tags)

        for (const tag of tags1) {
          if (tags2.has(tag)) similarity++
        }

        if (similarity >= 2) {
          if (!knowledgeGraph[entry1.id]) knowledgeGraph[entry1.id] = []
          if (!knowledgeGraph[entry2.id]) knowledgeGraph[entry2.id] = []
          if (!knowledgeGraph[entry1.id].includes(entry2.id)) knowledgeGraph[entry1.id].push(entry2.id)
          if (!knowledgeGraph[entry2.id].includes(entry1.id)) knowledgeGraph[entry2.id].push(entry1.id)
        }
      }
    }

    const duration = Date.now() - startTime

    res.json({
      success: true,
      created,
      updated,
      skipped,
      total: knowledgeBase.length,
      graphEdges: Object.keys(knowledgeGraph).length,
      durationMs: duration,
      rate: (items.length / (duration / 1000)).toFixed(1) + ' items/sec'
    })
  } catch (error) {
    console.error('Batch import error:', error)
    res.status(500).json({ success: false, error: '批量导入失败' })
  }
})

// 知识库列表（支持分类筛选）
router.get('/knowledge', (req: Request, res: Response): void => {
  const limit = parseInt(req.query.limit as string || '20')
  const offset = parseInt(req.query.offset as string || '0')
  const category = req.query.category as string
  const sort = req.query.sort as string || 'updatedAt'

  let filtered = [...knowledgeBase]

  if (category) {
    filtered = filtered.filter(k => k.category === category)
  }

  filtered.sort((a, b) => {
    if (sort === 'importance') return b.importance - a.importance
    if (sort === 'createdAt') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })

  res.json({
    success: true,
    data: filtered.slice(offset, offset + limit),
    total: filtered.length
  })
})

// 知识库搜索（增强版）
router.get('/knowledge/search', (req: Request, res: Response): void => {
  const query = req.query.q as string
  const category = req.query.category as string
  if (!query) {
    res.status(400).json({ success: false, error: '缺少查询参数 q' })
    return
  }

  const results = enhancedSearch(query, 20)
  const filtered = category
    ? results.filter(r => r.category === category)
    : results

  res.json({ success: true, data: filtered.slice(0, 15), total: filtered.length })
})

// 知识库统计（增强版）
router.get('/knowledge/stats', (req: Request, res: Response): void => {
  const byCategory: Record<string, number> = {}
  const tagCount: Record<string, number> = {}
  const bySource: Record<string, number> = {}

  knowledgeBase.forEach(k => {
    byCategory[k.category] = (byCategory[k.category] || 0) + 1
    bySource[k.source] = (bySource[k.source] || 0) + 1
    k.tags.forEach((t: string) => {
      tagCount[t] = (tagCount[t] || 0) + 1
    })
  })

  res.json({
    success: true,
    data: {
      total: knowledgeBase.length,
      categories: Object.keys(byCategory).length,
      tags: Object.keys(tagCount).length,
      graphEdges: Object.keys(knowledgeGraph).length,
      byCategory,
      bySource,
      topTags: Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 15),
      categoriesList: Object.keys(TECH_KEYWORDS)
    }
  })
})

// 分类列表
router.get('/knowledge/categories', (req: Request, res: Response): void => {
  const stats: Record<string, number> = {}
  knowledgeBase.forEach(k => {
    stats[k.category] = (stats[k.category] || 0) + 1
  })

  res.json({
    success: true,
    data: Object.entries(stats).map(([name, count]) => ({
      name,
      count
    })).sort((a, b) => b.count - a.count)
  })
})

// 导入单条知识
router.post('/knowledge', (req: Request, res: Response): void => {
  const { title, content, source = 'manual', tags, category, importance } = req.body

  if (!title || !content) {
    res.status(400).json({ success: false, error: '缺少 title 或 content' })
    return
  }

  const newEntry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 9),
    title,
    content,
    source,
    tags: tags || tagContent(content),
    category: category || classifyContent(content),
    importance: importance || (content.includes('重要') || content.includes('关键') ? 9 : 5),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  knowledgeBase.push(newEntry)
  buildKnowledgeGraph(newEntry)

  res.status(201).json({ success: true, data: newEntry })
})

// 删除知识
router.delete('/knowledge/:id', (req: Request, res: Response): void => {
  const id = req.params.id
  const index = knowledgeBase.findIndex(k => k.id === id)

  if (index === -1) {
    res.status(404).json({ success: false, error: '知识不存在' })
    return
  }

  knowledgeBase.splice(index, 1)
  delete knowledgeGraph[id]

  res.json({ success: true, message: '删除成功' })
})

export default router