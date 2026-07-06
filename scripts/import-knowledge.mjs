// 批量导入编程知识到希望AI知识库
const HOPEAI_API = 'http://localhost:3000/api/chat/knowledge/batch-import'

const knowledgeItems = [
  // === 前端开发 ===
  { title: 'React Hooks核心知识', content: 'useState状态管理、useEffect副作用处理、useContext跨组件传值、useRef DOM引用、useMemo性能优化缓存、useCallback回调缓存、useReducer复杂状态管理。Hooks规则：只在顶层调用，不在循环/条件/嵌套函数中调用。', category: '前端开发', tags: ['react', 'hooks', '前端', 'javascript'] },
  { title: 'React状态管理方案对比', content: 'Redux Toolkit企业级状态管理、Zustand轻量级方案、Jotai原子化状态、Recoil Facebook出品。趋势：从单一Store向原子化状态转变，TypeScript支持越来越好。', category: '前端开发', tags: ['react', 'redux', 'zustand', '状态管理'] },
  { title: 'Vue 3组合式API', content: 'setup()/<script setup>语法糖、ref/reactive响应式、computed计算属性、watch/watchEffect侦听器。Proxy替代Object.defineProperty实现响应式。Pinia替代Vuex成为官方推荐状态管理。', category: '前端开发', tags: ['vue', 'composition api', 'pinia', '前端'] },
  { title: 'Next.js App Router架构', content: 'React Server Components服务端组件、Server Actions表单处理、文件系统路由、布局嵌套、Loading/Error边界、并行路由和拦截路由。RSC减少客户端JS包体积。', category: '前端开发', tags: ['next.js', 'react', 'ssr', '服务端渲染'] },
  { title: '前端构建工具对比', content: 'Vite基于ESM的极速构建、Rspack Rust实现高性能Webpack兼容、Turbopack Vercel出品、Bun全能运行时。趋势：Rust/Go重写构建工具，ESM成为标准。', category: '前端开发', tags: ['vite', 'webpack', '构建工具', '前端'] },
  { title: 'TypeScript高级类型', content: '泛型约束、条件类型(T extends U ? X : Y)、映射类型、模板字面量类型、infer类型推断、类型体操。utility类型：Partial/Required/Pick/Omit/Record/ReturnType。', category: '前端开发', tags: ['typescript', '类型系统', '前端'] },
  { title: 'CSS方案对比', content: 'Tailwind CSS原子化CSS、CSS Modules局部作用域、CSS-in-JS(emotion/styled-components)运行时方案、Vanilla Extract零运行时CSS-in-JS。趋势：原子化CSS + 零运行时。', category: '前端开发', tags: ['css', 'tailwind', '前端'] },
  { title: '前端性能优化策略', content: 'React.memo组件记忆化、代码分割(lazy/Suspense)、虚拟列表(react-window)、图片懒加载、Tree Shaking、CDN加速、Service Worker缓存、Web Vitals核心指标(LCP/FID/CLS)。', category: '性能优化', tags: ['性能', '优化', '前端', '缓存'] },

  // === 后端开发 ===
  { title: 'Node.js异步编程', content: 'Event Loop事件循环机制、Promise/async-await语法、Stream流式处理大数据、Worker Threads多线程、Cluster模式利用多核CPU。PM2进程管理和负载均衡。', category: '后端开发', tags: ['node.js', '异步', 'event loop', '后端'] },
  { title: 'Express vs Fastify vs NestJS', content: 'Express经典框架生态丰富、Fastify高性能低开销(比Express快2倍)、NestJS企业级TypeScript优先(依赖注入/装饰器/模块化)。Hono适配边缘计算。', category: '后端开发', tags: ['node.js', 'express', 'fastify', 'nestjs'] },
  { title: 'Python Web框架对比', content: 'FastAPI异步高性能自动文档、Django全功能ORM/Admin/认证、Flask轻量灵活。Pydantic v2用Rust重写核心大幅提升性能。ASGI(Uvicorn/Gunicorn)替代WSGI。', category: '后端开发', tags: ['python', 'fastapi', 'django', 'flask'] },
  { title: 'RESTful API设计规范', content: '资源URI: /users/{id}、HTTP方法: GET/POST/PUT/PATCH/DELETE、状态码: 200/201/204/400/401/403/404/409/422/500、版本控制: URL(/v1/)或Header、分页: cursor-based优于offset-based。', category: '后端开发', tags: ['api', 'rest', '接口设计', '后端'] },
  { title: 'GraphQL vs gRPC', content: 'GraphQL: Schema类型系统、Query/Mutation/Subscription、Resolver解析、DataLoader解决N+1。gRPC: Protocol Buffers序列化、HTTP/2多路复用、适合微服务内部通信。tRPC端到端类型安全。', category: '后端开发', tags: ['graphql', 'grpc', 'api', '后端'] },

  // === 数据库 ===
  { title: 'MySQL索引优化', content: 'B+树结构、聚簇索引/非聚簇索引、覆盖索引避免回表、最左前缀原则、索引下推(ICP)。EXPLAIN分析执行计划。MySQL 8.0新特性：窗口函数、CTE、降序索引、不可见索引。', category: '数据库', tags: ['mysql', '索引', '优化', '数据库'] },
  { title: 'MySQL事务与锁机制', content: 'ACID特性、四种隔离级别(RU/RC/RR/Serializable)、MVCC多版本并发控制、间隙锁/临键锁防幻读、死锁检测。InnoDB行锁支持事务。', category: '数据库', tags: ['mysql', '事务', '锁', 'mvcc'] },
  { title: 'PostgreSQL高级特性', content: 'JSONB二进制JSON支持GIN索引、数组类型、PostGIS地理空间、TimescaleDB时序数据、pgVector向量搜索(AI/RAG必备)。CTE递归查询、LATERAL JOIN、并行查询。', category: '数据库', tags: ['postgresql', 'jsonb', 'postgis', 'pgvector'] },
  { title: 'Redis数据结构与应用', content: 'String缓存/计数器/分布式锁、Hash对象存储、List消息队列、Set标签系统、Sorted Set排行榜、Bitmap签到统计、HyperLogLog UV统计、Stream消息队列、Geo地理位置。', category: '数据库', tags: ['redis', '缓存', '消息队列', '数据库'] },
  { title: 'Redis持久化与高可用', content: 'RDB快照fork子进程、AOF日志追加everysec策略、混合模式RDB+AOF。主从复制全量+增量、Sentinel自动故障转移、Cluster 16384槽位分片。大Key拆分、热Key本地缓存。', category: '数据库', tags: ['redis', '持久化', '高可用', '集群'] },

  // === DevOps ===
  { title: 'Docker镜像优化', content: '多阶段构建减小镜像体积、Alpine/Distroless基础镜像、.dockerignore排除无关文件、层缓存优化顺序。非root运行安全、只读文件系统、镜像扫描(Trivy/Snyk)。', category: 'DevOps', tags: ['docker', '镜像', '容器', '安全'] },
  { title: 'Kubernetes核心架构', content: '控制平面: kube-apiserver/etcd/scheduler/controller-manager。工作节点: kubelet/kube-proxy/容器运行时。核心资源: Pod/Deployment/StatefulSet/Service/ConfigMap/Ingress。', category: 'DevOps', tags: ['kubernetes', 'k8s', '容器编排', 'devops'] },
  { title: 'K8s高级运维', content: 'Helm包管理Chart模板、Prometheus+Grafana监控、ELK/Loki日志、Jaeger链路追踪。GitOps: ArgoCD/Flux声明式交付。服务网格Istio/Linkerd mTLS流量管理。', category: 'DevOps', tags: ['kubernetes', 'helm', '监控', 'gitops'] },
  { title: 'CI/CD流水线设计', content: 'GitHub Actions: Workflow/Job/Step、Matrix构建、Reusable Workflows。GitLab CI: .gitlab-ci.yml、Stages/Jobs、Runners。部署策略: 蓝绿部署、金丝雀发布(Flagger/Argo Rollouts)、特性开关。', category: 'DevOps', tags: ['ci/cd', 'github actions', 'gitlab ci', '部署'] },

  // === 架构设计 ===
  { title: '微服务架构设计', content: '服务拆分原则: 单一职责、业务边界。服务通信: 同步(REST/gRPC)、异步(消息队列)。服务发现: Consul/Nacos/K8s Service。API网关: Kong/APISIX/Envoy。分布式事务: Saga/TCC/本地消息表。', category: '架构设计', tags: ['微服务', '架构', '分布式', '网关'] },
  { title: 'DDD领域驱动设计', content: '战略设计: 限界上下文、上下文映射。战术设计: 实体、值对象、聚合、聚合根、领域服务、领域事件。六边形架构(端口与适配器)解耦业务与技术。CQRS读写分离、Event Sourcing事件溯源。', category: '架构设计', tags: ['ddd', '领域驱动', '架构', 'cqrs'] },

  // === 安全 ===
  { title: 'Web安全防护', content: 'XSS: 输入过滤/输出编码/CSP。CSRF: Token验证/SameSite Cookie。SQL注入: 参数化查询/ORM。CORS跨域控制。Helmet安全头。OWASP Top 10防护。Zero Trust零信任架构。', category: '安全', tags: ['安全', 'xss', 'csrf', 'owasp'] },
  { title: '认证授权方案', content: 'JWT无状态Token(Access+Refresh)、OAuth 2.0授权码流程、Session+Cookie有状态认证。SSO单点登录(SAML/OIDC)。RBAC角色权限、ABAC属性权限。多因素认证MFA。', category: '安全', tags: ['认证', '授权', 'jwt', 'oauth', '安全'] },

  // === 测试 ===
  { title: '前端测试体系', content: '单元测试: Vitest/Jest、React Testing Library。E2E测试: Playwright(推荐)/Cypress。组件测试、快照测试。TDD测试驱动开发、BDD行为驱动。覆盖率: Istanbul/c8。', category: '测试', tags: ['测试', 'vitest', 'playwright', '前端'] },
  { title: '后端测试策略', content: '单元测试: pytest/Jest、Mock依赖。集成测试: 测试真实数据库/API。契约测试: Pact。性能测试: k6/Locust/JMeter。测试金字塔: 单元>集成>E2E。', category: '测试', tags: ['测试', 'pytest', '集成测试', '后端'] },

  // === AI/机器学习 ===
  { title: 'Transformer架构详解', content: 'Self-Attention自注意力机制、Multi-Head多头注意力、位置编码(Positional Encoding)、LayerNorm层归一化、Feed-Forward前馈网络。Encoder编码器(BERT)、Decoder解码器(GPT)。', category: 'AI/机器学习', tags: ['transformer', 'attention', 'bert', 'gpt'] },
  { title: 'LLM训练流程', content: 'Pre-training无监督预训练(海量文本)、SFT监督微调(指令数据)、RLHF人类反馈强化学习(DPO直接偏好优化更高效)。对齐人类价值观。MoE混合专家(Mixtral 8x7B)。', category: 'AI/机器学习', tags: ['llm', '训练', 'rlhf', '微调'] },
  { title: 'LoRA/QLoRA高效微调', content: 'LoRA只训练0.1%-1%适配器参数、单个适配器约78MB可插拔切换。QLoRA结合4-bit量化在单张消费级GPU微调70B模型。PEFT库标准实现。LLaMA-Factory一体化训练界面。', category: 'AI/机器学习', tags: ['lora', 'qlora', '微调', 'peft'] },
  { title: 'RAG检索增强生成', content: '基础流程: 文档加载→分块→Embedding→向量存储→相似度检索→LLM生成。高级: 语义分块、混合检索(向量+BM25)、重排序(Rerank)、查询重写。GraphRAG知识图谱增强。', category: 'AI/机器学习', tags: ['rag', 'embedding', '向量', '检索'] },
  { title: '向量数据库对比', content: 'Milvus 46K+ Stars高性能、FAISS Meta出品、Chroma轻量易用、Qdrant Rust实现、pgvector PostgreSQL扩展。EdgeVec浏览器WASM运行。选择: 小规模Chroma、生产Milvus/Qdrant、已有PG用pgvector。', category: 'AI/机器学习', tags: ['向量数据库', 'milvus', 'faiss', 'chroma'] },
  { title: 'AI Agent系统设计', content: 'ReAct模式(推理+行动)、Tool Use工具调用(Function Calling)、多Agent协作(AutoGen/CrewAI/MetaGPT)。记忆管理: 短期对话+长期向量存储。规划: 任务分解、反思修正。', category: 'AI/机器学习', tags: ['agent', 'react', 'function calling', '多agent'] },
  { title: '提示工程Prompt Engineering', content: 'Zero-shot/Few-shot提示、Chain-of-Thought思维链("Let\'s think step by step")、Self-Consistency多路投票、Tree of Thoughts树形思考。DSPy自动化Prompt优化。JSON mode结构化输出。', category: 'AI/机器学习', tags: ['prompt', 'cot', '提示工程', 'ai'] },
  { title: '模型量化技术', content: 'GPTQ基于Hessian矩阵校正、AWQ激活感知量化保护重要权重、GGUF(llama.cpp)支持CPU原生推理。4-bit量化体积缩小4-8倍、推理速度提升2-4倍、精度损失不到1%。Ollama一键部署。', category: 'AI/机器学习', tags: ['量化', 'gptq', 'awq', 'gguf'] },

  // === 云原生 ===
  { title: 'Serverless无服务器架构', content: 'FaaS函数即服务(AWS Lambda/Cloudflare Workers/Vercel Functions)、按需付费自动伸缩。冷启动优化。BFF模式。边缘计算(Cloudflare Workers/Deno Deploy)。', category: '云原生', tags: ['serverless', 'lambda', '边缘计算', '云原生'] },
  { title: '云服务对比', content: 'AWS市场领导者服务最全、Azure企业集成好、GCP AI/ML优势。国内: 阿里云/腾讯云/华为云。Cloudflare全球边缘网络、Vercel前端部署首选。选择: 成本+区域+生态。', category: '云原生', tags: ['aws', 'azure', 'gcp', 'cloudflare', '云原生'] },

  // === 性能优化 ===
  { title: 'Web性能核心指标', content: 'Core Web Vitals: LCP最大内容绘制(<2.5s)、FID首次输入延迟(<100ms)、CLS累计布局偏移(<0.1)。优化: 图片优化(WebP/AVIF/Lazy)、代码分割、预加载、CDN、HTTP/2、Service Worker缓存。', category: '性能优化', tags: ['性能', 'web vitals', 'lcp', '优化'] },

  // === 工具链 ===
  { title: 'Git工作流规范', content: 'Git Flow(主干develop+功能feature+发布release+热修hotfix)、GitHub Flow(简单PR)、Trunk-Based开发。Conventional Commits规范提交。Husky+lint-staged自动化代码检查。', category: '工具链', tags: ['git', '工作流', 'husky', '规范'] },
  { title: 'Monorepo管理工具', content: 'pnpm workspace高效磁盘利用、Turborepo远程缓存加速构建、Nx代码生成+依赖图分析。适合大型前端项目。Bazel超大规模构建。包发布: Changesets。', category: '工具链', tags: ['monorepo', 'pnpm', 'turborepo', 'nx'] },

  // === 移动开发 ===
  { title: '跨平台移动开发', content: 'React Native JS生态、Flutter Dart高性能自绘引擎、原生开发iOS(Swift)/Android(Kotlin)。uni-app国内小程序多端。选择: 性能优先Flutter、生态优先RN、原生体验优先原生。', category: '移动开发', tags: ['react native', 'flutter', 'ios', 'android'] },

  // === 最佳实践 ===
  { title: 'Clean Code原则', content: '有意义命名、单一职责函数、避免深层嵌套、DRY不重复、KISS保持简单。SOLID原则: 单一职责/开闭/里氏替换/接口隔离/依赖倒置。代码审查清单。重构时机。', category: '最佳实践', tags: ['clean code', 'solid', '重构', '代码质量'] },
  { title: '敏捷开发实践', content: 'Scrum: Sprint冲刺/Daily Standup/回顾会议。看板: WIP限制/流动效率。用户故事: 作为XX我想XX以便XX。DoD完成定义。估算: 故事点/Planning Poker。', category: '最佳实践', tags: ['敏捷', 'scrum', '看板', '项目管理'] }
]

console.log(`准备导入 ${knowledgeItems.length} 条知识...`)

async function importKnowledge() {
  const response = await fetch(HOPEAI_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: knowledgeItems,
      source: 'kimi_search_curated'
    })
  })

  const data = await response.json()
  console.log('导入结果：', JSON.stringify(data, null, 2))
}

importKnowledge().catch(console.error)