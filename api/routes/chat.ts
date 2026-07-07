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
export const INITIAL_KNOWLEDGE = [
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
  { title: '敏捷开发实践', content: 'Scrum: Sprint冲刺/Daily Standup/回顾会议。看板: WIP限制/流动效率。用户故事: 作为XX我想XX以便XX。DoD完成定义。估算: 故事点/Planning Poker。', category: '最佳实践', tags: ['敏捷', 'scrum', '看板', '项目管理'] },
  { title: 'React useState Hook 使用', content: 'useState 是 React 中用于管理组件状态的 Hook。调用 useState 会返回一个状态值和一个更新函数。初始值只在组件首次渲染时生效。', category: '前端开发', tags: ['react', 'hooks', 'usestate', '状态管理'] },
  { title: 'React useEffect 依赖数组', content: 'useEffect 的依赖数组决定了何时执行副作用。空数组 [] 表示只在挂载时执行一次；不传依赖数组表示每次渲染都执行；传入特定值则只在这些值变化时执行。', category: '前端开发', tags: ['react', 'hooks', 'useeffect', '副作用'] },
  { title: 'TypeScript 泛型函数', content: '泛型函数允许在函数参数和返回值之间建立类型关系。使用 <T> 语法定义泛型参数，例如 function identity<T>(arg: T): T { return arg; }', category: '前端开发', tags: ['typescript', '泛型', '函数'] },
  { title: 'Vue3 Composition API ref', content: 'ref 用于创建响应式引用，适用于基本类型。通过 .value 访问和修改值，模板中自动解包。例如 const count = ref(0); count.value++', category: '前端开发', tags: ['vue', 'composition', 'ref', '响应式'] },
  { title: 'Vue3 reactive', content: 'reactive 用于创建响应式对象，适用于复杂类型。直接访问属性无需 .value，但不能重新赋值整个对象。例如 const state = reactive({ count: 0 }); state.count++', category: '前端开发', tags: ['vue', 'composition', 'reactive', '响应式'] },
  { title: 'JavaScript Promise 链式调用', content: 'Promise 链式调用使用 .then() 处理成功结果，.catch() 处理错误，.finally() 无论成功失败都会执行。链式调用会按顺序执行。', category: '前端开发', tags: ['javascript', 'promise', 'async', '异步'] },
  { title: 'async/await 错误处理', content: '使用 try/catch 包裹 await 调用可以捕获异步错误。也可以使用 .catch() 在 await 表达式后直接捕获。避免未处理的 Promise 拒绝。', category: '前端开发', tags: ['javascript', 'async', 'await', '错误处理'] },
  { title: 'CSS Flexbox 主轴与交叉轴', content: 'Flexbox 有主轴(main axis)和交叉轴(cross axis)。flex-direction 决定主轴方向。justify-content 控制主轴对齐，align-items 控制交叉轴对齐。', category: '前端开发', tags: ['css', 'flexbox', '布局'] },
  { title: 'CSS Grid 网格布局', content: 'CSS Grid 使用 grid-template-columns 和 grid-template-rows 定义网格轨道。使用 grid-column 和 grid-row 控制元素位置。fr 单位表示剩余空间的比例。', category: '前端开发', tags: ['css', 'grid', '布局'] },
  { title: 'Git 分支管理策略', content: '常用 Git 分支策略包括 Git Flow 和 Trunk Based Development。Git Flow 使用 develop、feature、release、hotfix 分支；Trunk Based 使用主干分支配合短生命周期特性分支。', category: '工具链', tags: ['git', '分支', '版本控制'] },
  { title: 'Node.js 事件循环', content: 'Node.js 事件循环分为六个阶段：timers、pending callbacks、idle/prepare、poll、check、close callbacks。setTimeout 在 timers 阶段执行，setImmediate 在 check 阶段执行。', category: '后端开发', tags: ['node.js', '事件循环', '异步'] },
  { title: 'Express 中间件顺序', content: 'Express 中间件按定义顺序执行。路由匹配后不再继续执行后续中间件。使用 next() 调用下一个中间件。错误处理中间件需要四个参数 (err, req, res, next)。', category: '后端开发', tags: ['express', '中间件', 'node.js'] },
  { title: 'RESTful API 设计原则', content: 'RESTful API 使用 HTTP 方法表示操作：GET 获取、POST 创建、PUT 更新、DELETE 删除。资源使用名词复数。状态码使用标准 HTTP 状态码。版本化通过 URL 或 Accept 头实现。', category: '后端开发', tags: ['api', 'rest', '设计'] },
  { title: 'JWT 认证流程', content: 'JWT 认证流程：用户登录获取 token，后续请求在 Authorization 头携带 Bearer token。服务端验证签名和过期时间。JWT 包含 header、payload、signature 三部分，使用 base64url 编码。', category: '安全', tags: ['jwt', '认证', '安全'] },
  { title: 'OAuth2.0 授权码流程', content: 'OAuth2.0 授权码流程：用户重定向到授权服务器，获取授权码，交换令牌，使用令牌访问资源。适用于服务端应用，安全性最高。', category: '安全', tags: ['oauth', '认证', '安全'] },
  { title: 'MySQL 索引优化', content: 'MySQL 索引使用 B+Tree 结构。合理创建索引可以大幅提升查询性能。避免在大表上创建过多索引。复合索引遵循最左前缀原则。使用 EXPLAIN 分析查询计划。', category: '数据库', tags: ['mysql', '索引', '性能优化'] },
  { title: 'Redis 缓存策略', content: 'Redis 常用缓存策略：Cache-Aside、Write-Through、Write-Behind。使用 TTL 设置过期时间。设置合理的淘汰策略：LRU、LFU、Random。避免缓存穿透、缓存击穿、缓存雪崩问题。', category: '数据库', tags: ['redis', '缓存', '性能优化'] },
  { title: 'MongoDB 查询优化', content: 'MongoDB 使用索引加速查询。使用 explain() 分析查询性能。复合索引遵循前缀原则。使用投影减少返回字段。避免全集合扫描。适当使用聚合管道。', category: '数据库', tags: ['mongodb', '查询优化', '数据库'] },
  { title: 'Docker 镜像分层', content: 'Docker 镜像采用分层存储。每层只读，容器在顶层添加可写层。使用多阶段构建减小镜像体积。合理使用 .dockerignore 文件排除不必要文件。', category: 'DevOps', tags: ['docker', '镜像', 'devops'] },
  { title: 'Kubernetes Pod 生命周期', content: 'Kubernetes Pod 生命周期包括 Pending、Running、Succeeded、Failed、Unknown 阶段。使用 init containers 在主容器启动前执行初始化。探针包括 liveness、readiness、startup。', category: 'DevOps', tags: ['kubernetes', 'pod', 'devops'] },
  { title: 'CI/CD 流水线设计', content: 'CI/CD 流水线通常包含：构建、测试、代码质量检查、部署阶段。使用并行任务加速构建。设置合适的缓存策略。使用矩阵构建测试多环境。', category: 'DevOps', tags: ['ci/cd', 'github actions', 'devops'] },
  { title: '微服务架构设计原则', content: '微服务架构设计原则：单一职责、自治性、无状态、API 优先、去中心化数据管理。使用服务发现和负载均衡。实现断路器模式处理故障。', category: '架构设计', tags: ['微服务', '架构', '设计模式'] },
  { title: '设计模式：工厂模式', content: '工厂模式通过工厂方法创建对象，隐藏实例化逻辑。简单工厂、工厂方法、抽象工厂三种变体。适用于对象创建复杂或需要解耦的场景。', category: '架构设计', tags: ['设计模式', '工厂模式', 'oop'] },
  { title: '设计模式：观察者模式', content: '观察者模式定义对象间一对多依赖，当主题状态变化时自动通知所有观察者。适用于事件系统、消息通知等场景。', category: '架构设计', tags: ['设计模式', '观察者模式', 'oop'] },
  { title: '设计模式：策略模式', content: '策略模式定义算法家族，封装每个算法，使它们可以互换。运行时动态选择算法。适用于需要多种算法变体的场景。', category: '架构设计', tags: ['设计模式', '策略模式', 'oop'] },
  { title: '前端性能优化：代码分割', content: '代码分割通过动态 import() 实现按需加载，减小首屏体积。Webpack 和 Vite 都支持。React 使用 React.lazy 和 Suspense。Vue 使用 defineAsyncComponent。', category: '性能优化', tags: ['性能优化', '代码分割', '前端'] },
  { title: '前端性能优化：图片优化', content: '图片优化策略：使用现代格式 WebP/AVIF；响应式图片使用 srcset 和 sizes；懒加载使用 loading="lazy"；压缩图片；使用 CDN 加速。', category: '性能优化', tags: ['性能优化', '图片', '前端'] },
  { title: '前端性能优化：缓存策略', content: '浏览器缓存策略：使用 Cache-Control 设置缓存过期；ETag 和 Last-Modified 实现协商缓存；Service Worker 实现离线缓存；HTTP/2 多路复用。', category: '性能优化', tags: ['性能优化', '缓存', '前端'] },
  { title: 'XSS 攻击防护', content: 'XSS 防护措施：对用户输入进行转义；使用安全的 DOM API；设置 CSP 策略；使用 HttpOnly 和 Secure Cookie；避免使用 eval()。', category: '安全', tags: ['安全', 'xss', '防护'] },
  { title: 'CSRF 攻击防护', content: 'CSRF 防护措施：使用 CSRF Token；验证 Referer 头；使用 SameSite Cookie；对敏感操作使用 POST 方法。', category: '安全', tags: ['安全', 'csrf', '防护'] },
  { title: 'SQL 注入防护', content: 'SQL 注入防护措施：使用参数化查询/预编译语句；使用 ORM 框架；对用户输入进行验证和过滤；最小化数据库用户权限。', category: '安全', tags: ['安全', 'sql注入', '防护'] },
  { title: 'Jest Mock 函数', content: 'Jest Mock 函数用于模拟依赖。使用 jest.fn() 创建模拟函数；使用 jest.mock() 模拟模块；使用 .mockReturnValue() 设置返回值；使用 .toHaveBeenCalled() 断言调用。', category: '测试', tags: ['jest', '测试', 'mock'] },
  { title: '测试金字塔', content: '测试金字塔包含三层：单元测试（底层，数量最多）、集成测试（中层）、端到端测试（顶层，数量最少）。合理分配测试类型可以提高效率和可靠性。', category: '测试', tags: ['测试', '单元测试', '集成测试'] },
  { title: 'TDD 测试驱动开发', content: 'TDD 流程：先写失败的测试，再写通过测试的最小代码，最后重构。红-绿-重构循环。优点：更好的测试覆盖率，更清晰的设计。', category: '测试', tags: ['测试', 'tdd', '开发流程'] },
  { title: 'ESLint 配置', content: 'ESLint 使用配置文件（.eslintrc）管理规则。extends 继承预设配置；rules 自定义规则；plugins 添加额外规则。使用 --fix 自动修复问题。', category: '工具链', tags: ['eslint', '工具链', '代码质量'] },
  { title: 'Prettier 配置', content: 'Prettier 使用 .prettierrc 配置格式化规则。printWidth 设置换行宽度；tabWidth 设置缩进；semi 是否加分号；singleQuote 是否使用单引号。', category: '工具链', tags: ['prettier', '工具链', '代码格式化'] },
  { title: 'pnpm 工作区', content: 'pnpm 使用 workspace 管理多包项目。在根目录创建 pnpm-workspace.yaml，定义 packages 路径。使用 pnpm add --workspace 添加依赖。共享依赖提升到根 node_modules。', category: '工具链', tags: ['pnpm', '工具链', 'monorepo'] },
  { title: 'Solid 原则', content: 'SOLID 原则包括：单一职责、开闭原则、里氏替换、接口隔离、依赖倒置。遵循这些原则可以提高代码的可维护性和可扩展性。', category: '最佳实践', tags: ['solid', '设计原则', '最佳实践'] },
  { title: '代码审查检查清单', content: '代码审查要点：逻辑正确性、代码风格、性能考虑、安全隐患、错误处理、文档注释、测试覆盖、命名规范。使用检查清单确保审查质量。', category: '最佳实践', tags: ['代码审查', '最佳实践', '团队协作'] },
  { title: 'React Context 使用', content: 'React Context 用于跨组件传递数据，避免 props 层层传递。创建 Context 使用 createContext()；提供值使用 Provider；消费值使用 useContext() 或 Consumer。', category: '前端开发', tags: ['react', 'context', '状态管理'] },
  { title: 'React useReducer Hook', content: 'useReducer 用于管理复杂状态逻辑。接收 reducer 函数和初始状态，返回状态和 dispatch 函数。reducer 是纯函数，根据 action 更新状态。', category: '前端开发', tags: ['react', 'hooks', 'usereducer', '状态管理'] },
  { title: 'TypeScript 类型守卫', content: '类型守卫用于在运行时缩小类型范围。typeof 检查基本类型；instanceof 检查类实例；in 检查属性存在；自定义类型守卫使用 is 关键字。', category: '前端开发', tags: ['typescript', '类型守卫', '类型'] },
  { title: 'TypeScript 条件类型', content: '条件类型根据类型关系选择类型。语法：T extends U ? X : Y。常用工具类型如 ReturnType、Parameters、Exclude、Extract 都是条件类型实现。', category: '前端开发', tags: ['typescript', '条件类型', '高级类型'] },
  { title: 'Vue3 provide/inject', content: 'provide/inject 用于跨层级组件通信。父组件使用 provide 提供值，子孙组件使用 inject 注入值。适用于深度嵌套场景。', category: '前端开发', tags: ['vue', 'provide', 'inject', '组件通信'] },
  { title: 'Vue3 watch 和 watchEffect', content: 'watch 需要明确指定依赖，只在依赖变化时执行。watchEffect 自动追踪依赖，在初始化时立即执行。watch 可以访问旧值和新值。', category: '前端开发', tags: ['vue', 'watch', '响应式'] },
  { title: 'JavaScript 闭包', content: '闭包是函数能够访问其词法作用域外的变量。创建闭包的方式：返回内部函数、传递函数作为参数。闭包常用于数据封装和函数柯里化。', category: '前端开发', tags: ['javascript', '闭包', '基础'] },
  { title: 'JavaScript 事件委托', content: '事件委托利用事件冒泡，将事件处理程序绑定到父元素而非每个子元素。减少内存占用，支持动态添加元素。使用 event.target 判断触发元素。', category: '前端开发', tags: ['javascript', '事件委托', 'dom'] },
  { title: 'CSS 伪元素 ::before 和 ::after', content: '::before 和 ::after 创建元素的子伪元素。必须设置 content 属性。常用于添加装饰性内容、清除浮动、创建图标。', category: '前端开发', tags: ['css', '伪元素', '样式'] },
  { title: 'CSS 媒体查询', content: '媒体查询用于响应式设计。语法：@media (条件) { 样式 }。常用条件：max-width、min-width、orientation。使用移动优先或桌面优先策略。', category: '前端开发', tags: ['css', '媒体查询', '响应式'] },
  { title: 'Git Rebase 与 Merge', content: 'Merge 保留完整历史，创建合并提交。Rebase 将提交移动到新的基础上，产生线性历史。本地分支使用 rebase，公共分支使用 merge。', category: '工具链', tags: ['git', 'rebase', 'merge'] },
  { title: 'Node.js Stream', content: 'Stream 用于处理大量数据，避免一次性加载到内存。四种类型：Readable、Writable、Duplex、Transform。使用 pipe() 连接流。', category: '后端开发', tags: ['node.js', 'stream', '性能'] },
  { title: 'Express 错误处理', content: 'Express 错误处理中间件需要四个参数 (err, req, res, next)。使用 try/catch 捕获同步错误。异步错误需要调用 next(err)。设置统一的错误响应格式。', category: '后端开发', tags: ['express', '错误处理', 'node.js'] },
  { title: 'GraphQL 与 REST 对比', content: 'REST 使用多个端点获取不同资源，GraphQL 使用单一端点按需获取数据。GraphQL 减少过度获取和多次请求，但需要额外的学习成本和缓存策略。', category: '后端开发', tags: ['graphql', 'api', 'rest'] },
  { title: 'Cookie 安全标志', content: 'Cookie 安全标志：HttpOnly 防止 JS 访问；Secure 只在 HTTPS 传输；SameSite 防止 CSRF；Max-Age 设置过期时间。', category: '安全', tags: ['安全', 'cookie', 'http'] },
  { title: 'HTTPS 证书管理', content: 'HTTPS 使用 TLS/SSL 证书加密通信。使用免费证书。定期更新证书。配置正确的 TLS 版本和加密套件。', category: '安全', tags: ['安全', 'https', 'tls'] },
  { title: 'MySQL 事务隔离级别', content: 'MySQL 事务隔离级别：READ UNCOMMITTED（脏读）、READ COMMITTED（不可重复读）、REPEATABLE READ（幻读）、SERIALIZABLE。InnoDB 默认 REPEATABLE READ。', category: '数据库', tags: ['mysql', '事务', '数据库'] },
  { title: 'Redis 数据类型', content: 'Redis 支持五种基本数据类型：String（字符串）、Hash（哈希）、List（列表）、Set（集合）、ZSet（有序集合）。选择合适的数据类型可以提高效率。', category: '数据库', tags: ['redis', '数据类型', '数据库'] },
  { title: 'MongoDB 副本集', content: 'MongoDB 副本集提供高可用性。包含一个主节点（Primary）和多个从节点（Secondary）。主节点处理写操作，从节点复制数据。故障时自动选举新主节点。', category: '数据库', tags: ['mongodb', '副本集', '高可用'] },
  { title: 'Docker Compose', content: 'Docker Compose 使用 YAML 文件定义多容器应用。services 定义服务；volumes 定义卷；networks 定义网络。使用 docker-compose up 启动应用。', category: 'DevOps', tags: ['docker', 'compose', 'devops'] },
  { title: 'Kubernetes Service', content: 'Kubernetes Service 提供 Pod 的稳定访问地址。ClusterIP 内部访问；NodePort 暴露到节点端口；LoadBalancer 云厂商负载均衡；ExternalName 映射外部服务。', category: 'DevOps', tags: ['kubernetes', 'service', 'devops'] },
  { title: 'Nginx 反向代理', content: 'Nginx 反向代理接收客户端请求，转发到后端服务器。配置 upstream 定义后端服务器组。使用 location 匹配 URL。支持负载均衡和缓存。', category: 'DevOps', tags: ['nginx', '反向代理', 'devops'] },
  { title: '设计模式：单例模式', content: '单例模式确保类只有一个实例。实现方式：私有构造函数、静态获取方法。注意线程安全问题。适用于全局状态管理、日志器等场景。', category: '架构设计', tags: ['设计模式', '单例模式', 'oop'] },
  { title: '设计模式：适配器模式', content: '适配器模式将一个类的接口转换成客户端期望的另一个接口。适用于集成已有代码或第三方库。分为类适配器和对象适配器。', category: '架构设计', tags: ['设计模式', '适配器模式', 'oop'] },
  { title: '设计模式：装饰器模式', content: '装饰器模式动态给对象添加额外功能。使用组合而非继承。适用于需要灵活扩展功能的场景。', category: '架构设计', tags: ['设计模式', '装饰器模式', 'oop'] },
  { title: '前端性能优化：首屏优化', content: '首屏优化策略：减小 HTML 体积；内联关键 CSS；使用 Critical CSS；预加载关键资源；延迟加载非关键资源；使用 CDN。', category: '性能优化', tags: ['性能优化', '首屏', '前端'] },
  { title: '前端性能优化：内存泄漏', content: '常见内存泄漏原因：意外的全局变量、闭包引用、DOM 引用未清理、定时器未清除、事件监听器未移除。使用 Chrome DevTools Memory 面板检测。', category: '性能优化', tags: ['性能优化', '内存泄漏', '前端'] },
  { title: '前端性能优化：Web Worker', content: 'Web Worker 在后台线程执行脚本，不阻塞主线程。适用于计算密集型任务。使用 postMessage 通信。注意不能访问 DOM。', category: '性能优化', tags: ['性能优化', 'web worker', '前端'] },
  { title: '安全：依赖漏洞检测', content: '依赖漏洞检测工具：npm audit、Snyk、Dependabot。定期更新依赖。设置自动化检测。关注安全公告。', category: '安全', tags: ['安全', '依赖', '漏洞'] },
  { title: '安全：输入验证', content: '输入验证策略：服务端验证为主，客户端验证为辅。使用白名单验证。对特殊字符进行转义。使用验证库如 Joi、Zod。', category: '安全', tags: ['安全', '输入验证', '防护'] },
  { title: 'Vitest 测试框架', content: 'Vitest 是新一代测试框架，与 Vite 无缝集成。支持 ESM 原生模块。内置 TypeScript 支持。运行速度快。兼容 Jest API。', category: '测试', tags: ['vitest', '测试', '工具链'] },
  { title: 'Cypress E2E 测试', content: 'Cypress 是端到端测试框架。直接在浏览器中运行。自动等待元素出现。内置网络请求拦截。提供时间旅行调试。', category: '测试', tags: ['cypress', 'e2e', '测试'] },
  { title: 'npm 脚本使用', content: 'npm 脚本定义在 package.json 的 scripts 字段。使用 npm run <script> 执行。支持预/post 钩子（prebuild、postbuild）。可以使用 && 连接多个命令。', category: '工具链', tags: ['npm', '脚本', '工具链'] },
  { title: 'Babel 配置', content: 'Babel 将 ES6+ 代码转译为兼容代码。使用 @babel/preset-env 自动根据目标环境选择转换。使用插件添加特定功能。配置文件可以是 .babelrc 或 babel.config.json。', category: '工具链', tags: ['babel', '工具链', '转译'] },
  { title: '代码重构技巧', content: '重构技巧：提取函数、提取变量、拆分长函数、消除重复代码、简化条件判断、重命名变量和函数。每次小步修改，确保测试通过。', category: '最佳实践', tags: ['重构', '最佳实践', '代码质量'] },
  { title: '代码注释规范', content: '注释规范：函数注释使用 JSDoc/TSDoc；行内注释解释复杂逻辑；避免冗余注释；TODO 标记待完成任务；FIXME 标记需要修复的问题。', category: '最佳实践', tags: ['注释', '最佳实践', '代码质量'] },
  { title: 'React 自定义 Hook', content: '自定义 Hook 以 use 开头，封装可复用逻辑。可以调用其他 Hook。返回值灵活，可以是数组或对象。例如 useFetch、useLocalStorage。', category: '前端开发', tags: ['react', 'hooks', '自定义hook'] },
  { title: 'React 性能优化：React.memo', content: 'React.memo 是高阶组件，对组件的 props 进行浅比较，避免不必要的重渲染。适用于纯展示组件。配合 useMemo 和 useCallback 使用效果更好。', category: '前端开发', tags: ['react', '性能优化', 'memo'] },
  { title: 'TypeScript 接口与类型别名', content: '接口使用 interface 定义，类型别名使用 type 定义。接口可以扩展和合并声明，类型别名可以表示联合类型和交叉类型。推荐优先使用接口。', category: '前端开发', tags: ['typescript', 'interface', 'type'] },
  { title: 'TypeScript 类型断言', content: '类型断言告诉编译器某个值的类型。使用 as 语法：value as Type。使用尖括号语法：<Type>value（JSX 中不适用）。避免过度使用，优先使用类型守卫。', category: '前端开发', tags: ['typescript', '类型断言', '类型'] },
  { title: 'Vue3 组合式函数', content: '组合式函数以 use 开头，封装可复用逻辑。可以调用其他组合式函数和响应式 API。返回响应式状态和方法。例如 useMouse、useFetch。', category: '前端开发', tags: ['vue', 'composition', '组合式函数'] },
  { title: 'Vue3 自定义指令', content: '自定义指令使用 defineDirective 定义。支持 mounted、updated、unmounted 钩子。可以接收参数和修饰符。适用于 DOM 操作场景。', category: '前端开发', tags: ['vue', '指令', '自定义'] },
  { title: 'JavaScript Promise.all 与 Promise.allSettled', content: 'Promise.all 所有 Promise 成功才成功，任一失败则全部失败。Promise.allSettled 等待所有 Promise 完成，返回每个的结果状态（fulfilled/rejected）。', category: '前端开发', tags: ['javascript', 'promise', 'async'] },
  { title: 'JavaScript 可选链和空值合并', content: '可选链 ?. 安全访问嵌套属性，避免空值错误。空值合并 ?? 仅在值为 null 或 undefined 时返回默认值。组合使用：obj?.prop ?? defaultValue。', category: '前端开发', tags: ['javascript', '可选链', '空值合并'] },
  { title: 'CSS 变量', content: 'CSS 变量使用 -- 定义，var() 使用。可以在 :root 中定义全局变量。支持继承和级联。可以通过 JavaScript 动态修改。', category: '前端开发', tags: ['css', '变量', '样式'] },
  { title: 'CSS Flexbox gap 属性', content: 'gap 属性设置 flex 子元素之间的间距。row-gap 设置行间距，column-gap 设置列间距。gap 是简写形式。适用于 Flexbox 和 Grid。', category: '前端开发', tags: ['css', 'flexbox', 'gap'] },
  { title: 'Git 工作流：GitHub Flow', content: 'GitHub Flow 简化的分支策略：从 main 分支创建 feature 分支，提交更改，创建 Pull Request，审查通过后合并回 main。适用于持续部署场景。', category: '工具链', tags: ['git', '工作流', 'github flow'] },
  { title: 'Node.js 模块化', content: 'Node.js 支持 CommonJS 和 ES Modules。使用 require() 和 module.exports 是 CommonJS；使用 import 和 export 是 ES Modules。package.json 中设置 "type": "module" 使用 ES Modules。', category: '后端开发', tags: ['node.js', '模块化', 'commonjs'] },
  { title: 'Express 路由参数', content: 'Express 路由参数使用 :param 定义。通过 req.params 访问。支持正则表达式约束。例如 /users/:id([0-9]+) 只匹配数字 ID。', category: '后端开发', tags: ['express', '路由', 'node.js'] },
  { title: 'REST API 分页设计', content: '分页策略：基于偏移量（offset/limit）或基于游标（cursor）。偏移量简单但大数据量时性能差。游标分页使用唯一标识，性能更好。返回 total、page、perPage 等元数据。', category: '后端开发', tags: ['api', '分页', '设计'] },
  { title: '安全：CORS 配置', content: 'CORS（跨域资源共享）控制浏览器是否允许跨域请求。服务端设置 Access-Control-Allow-Origin、Access-Control-Allow-Methods、Access-Control-Allow-Headers。使用预检请求（OPTIONS）。', category: '安全', tags: ['安全', 'cors', '跨域'] },
  { title: '安全：速率限制', content: '速率限制防止 API 被滥用。使用中间件如 express-rate-limit。限制请求频率（如每分钟 100 次）。使用 Redis 存储跨实例的请求计数。', category: '安全', tags: ['安全', '速率限制', 'api'] },
  { title: 'MySQL 锁机制', content: 'MySQL 锁包括表级锁和行级锁。InnoDB 使用行级锁，MyISAM 使用表级锁。行级锁基于索引。死锁可能发生在交叉更新场景。使用 SHOW PROCESSLIST 查看锁状态。', category: '数据库', tags: ['mysql', '锁', '数据库'] },
  { title: 'Redis 事务', content: 'Redis 事务使用 MULTI、EXEC、DISCARD 命令。MULTI 开始事务，EXEC 执行，DISCARD 取消。Redis 事务保证原子性但不支持回滚。使用 WATCH 监控键变化。', category: '数据库', tags: ['redis', '事务', '数据库'] },
  { title: 'MongoDB 聚合管道', content: 'MongoDB 聚合管道由多个阶段组成：$match（过滤）、$group（分组）、$project（投影）、$sort（排序）、$limit（限制）。阶段按顺序执行，前一阶段的输出作为后一阶段的输入。', category: '数据库', tags: ['mongodb', '聚合', '数据库'] },
  { title: 'Docker 多阶段构建', content: '多阶段构建使用多个 FROM 指令。第一阶段构建应用，第二阶段复制产物。减小最终镜像体积。示例：builder 阶段编译，runtime 阶段运行。', category: 'DevOps', tags: ['docker', '多阶段构建', 'devops'] },
  { title: 'Kubernetes ConfigMap 和 Secret', content: 'ConfigMap 存储非敏感配置，Secret 存储敏感信息（如密码、API Key）。Secret 使用 Base64 编码。通过 volume 或环境变量注入到 Pod。', category: 'DevOps', tags: ['kubernetes', 'configmap', 'secret'] },
  { title: 'Prometheus 监控', content: 'Prometheus 是开源监控系统。使用指标（metrics）收集数据。支持四种指标类型：Counter（计数器）、Gauge（仪表盘）、Histogram（直方图）、Summary（摘要）。使用 Grafana 可视化。', category: 'DevOps', tags: ['prometheus', '监控', 'devops'] },
  { title: '设计模式：模板方法模式', content: '模板方法模式定义算法骨架，子类实现具体步骤。抽象类定义模板方法和抽象方法。适用于框架设计、算法变体场景。', category: '架构设计', tags: ['设计模式', '模板方法', 'oop'] },
  { title: '设计模式：状态模式', content: '状态模式封装对象状态，使对象行为随状态变化而变化。状态类实现状态接口，上下文类委托给当前状态对象。适用于有限状态机场景。', category: '架构设计', tags: ['设计模式', '状态模式', 'oop'] },
  { title: '前端性能优化：Lazy Loading', content: '懒加载延迟加载非关键资源。图片使用 loading="lazy" 属性。组件使用 React.lazy 或 Vue 的 defineAsyncComponent。路由级别的代码分割。', category: '性能优化', tags: ['性能优化', '懒加载', '前端'] },
  { title: '前端性能优化：Code Splitting 实践', content: '代码分割实践：路由级别分割、组件级别分割、按需加载第三方库。使用 React.lazy + Suspense。使用 webpackChunkName 命名 chunks。分析打包体积。', category: '性能优化', tags: ['性能优化', '代码分割', 'webpack'] },
  { title: '测试覆盖率', content: '测试覆盖率指标：语句覆盖率、分支覆盖率、函数覆盖率、行覆盖率。目标不是 100%，而是覆盖关键路径。使用 jest --coverage 或 vitest --coverage 生成报告。', category: '测试', tags: ['测试', '覆盖率', '工具'] },
  { title: 'Mock 与 Stub', content: 'Mock 验证交互行为，Stub 提供预设返回值。Mock 关注"是否调用"，Stub 关注"返回什么"。在测试中合理使用两者。', category: '测试', tags: ['测试', 'mock', 'stub'] },
  { title: 'npm 依赖管理', content: 'npm 依赖管理：使用 ^ 和 ~ 控制版本范围；定期更新依赖（npm update）；使用 npm audit 检测漏洞；使用 pnpm 提升安装速度和节省空间。', category: '工具链', tags: ['npm', '依赖', '工具链'] },
  { title: 'Git Hooks', content: 'Git Hooks 是在特定 Git 事件时执行的脚本。常用钩子：pre-commit（提交前）、commit-msg（提交信息校验）、pre-push（推送前）。使用 Husky 管理钩子。', category: '工具链', tags: ['git', 'hooks', '工具链'] },
  { title: '代码风格指南', content: '代码风格指南：统一缩进（空格/制表符）；代码行长度限制；大括号位置；分号使用；变量命名规范（驼峰/下划线）。使用 ESLint 和 Prettier 强制执行。', category: '最佳实践', tags: ['代码风格', '最佳实践', '规范'] },
  { title: '错误处理最佳实践', content: '错误处理：明确错误类型；提供有用的错误信息；使用 try/catch 捕获异常；不要吞掉异常；使用统一的错误处理中间件；记录错误日志。', category: '最佳实践', tags: ['错误处理', '最佳实践', '调试'] },
  { title: 'React useEffect 清理函数', content: 'useEffect 返回的函数在组件卸载前执行，用于清理副作用。清理定时器、取消订阅、移除事件监听器。避免内存泄漏。', category: '前端开发', tags: ['react', 'hooks', 'useeffect', '清理'] },
  { title: 'React useMemo Hook', content: 'useMemo 缓存计算结果，避免昂贵计算在每次渲染时重复执行。依赖数组变化时重新计算。用于优化渲染性能。', category: '前端开发', tags: ['react', 'hooks', 'usememo', '性能'] },
  { title: 'React useCallback Hook', content: 'useCallback 缓存函数引用，避免子组件不必要的重渲染。与 React.memo 配合使用效果更好。依赖数组变化时重新创建函数。', category: '前端开发', tags: ['react', 'hooks', 'usecallback', '性能'] }
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