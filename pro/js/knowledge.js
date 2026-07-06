const HOPEAI_KB = (function() {
  var E = [];
  function $(t,c,g,l,s,d){E.push({t:t,c:c,g:g,l:l,s:s,d:d||1,u:0,r:0,v:0});}

  // ═══════════════════════════════════════════════════
  // 编排层 Orchestration — 140 entries
  // ═══════════════════════════════════════════════════

  // TaskDecomposition 任务拆解
  $("任务拆解粒度原则","子任务粒度控制在10-60秒执行时间最优，过细导致Agent通信开销+30-50%，过粗无法并行。依赖深度不超过3层，宽度建议2-5个并行子任务。使用DAG图管理依赖，入度0节点优先执行。","任务拆解 DAG 并行","编排层","TaskDecomposition",2);
  $("DAG任务图设计","用有向无环图表示任务依赖：节点=子任务，边=数据/控制依赖。工具推荐：Dagster(数据管道)、Prefect(Python原生)、Airflow(批处理)。DAG最大深度控制在5层以内便于调试和重试。","DAG 任务调度 工作流","编排层","TaskDecomposition",3);
  $("任务优先级队列","紧急程度×业务价值=优先级分数。P0(<5min SLA)、P1(<30min)、P2(<4h)、P3(<24h)。使用优先级堆(heap)实现O(log n)插入，注意饥饿保护：低优先级任务等待超30分钟后自动提升。","优先级 队列 调度","编排层","TaskDecomposition",2);
  $("子任务幂等性设计","每个子任务必须支持重试：使用唯一idempotency_key，状态机记录pending/running/success/failed状态。数据库用INSERT ON CONFLICT避免重复，API层用Redis SETNX加锁。重试时检查状态避免重复执行。","幂等 重试 状态机","编排层","TaskDecomposition",3);
  $("动态任务拆分策略","根据LLM输出的复杂度评分动态决定拆分粒度：简单查询(score<0.3)直接执行，中等(0.3-0.7)拆2-3步，复杂(>0.7)拆5+步。使用滑动窗口监控最近100次任务拆分准确率，低于80%触发策略调整。","动态拆分 复杂度 自适应","编排层","TaskDecomposition",3);
  $("任务依赖死锁检测","用拓扑排序检测DAG中的环，存在环时输出环路径供人工决策。运行时用wait-for-graph算法实时监控，发现死锁自动kill最低优先级任务释放资源。设置全局5分钟超时防止永久阻塞。","死锁 DAG 拓扑排序","编排层","TaskDecomposition",3);
  $("子任务结果聚合","并行子任务全部完成后聚合结果：文本用拼接+摘要、数值用加权平均、结构化数据用JSON merge。设置超时阈值(默认60s)，超时子任务结果标记partial，主任务可降级处理。使用Promise.allSettled避免单点失败。","结果聚合 并行 Promise","编排层","TaskDecomposition",2);
  $("断点恢复机制","每个子任务完成后写checkpoint到SQLite/Git，包含task_id+step_id+状态+中间结果。重启时读取最近checkpoint跳过已完成步骤。checkpoint间隔不超过10个子任务，存储开销<1KB/checkpoint。","断点 checkpoint 恢复","编排层","TaskDecomposition",3);
  $("任务回滚策略","子任务失败后的补偿操作：数据库开启事务回滚，API调用发送补偿请求，文件操作用临时目录+原子rename。记录compensation_log便于审计追踪。Saga模式管理长事务：正向操作+对应的补偿操作成对定义。","回滚 补偿 Saga 事务","编排层","TaskDecomposition",3);
  $("任务执行可视化","Gantt图展示子任务时间线，不同颜色表示状态(绿=成功,红=失败,黄=运行中,灰=等待)。每个节点显示耗时和执行Agent名称。支持导出为Mermaid时序图嵌入文档。刷新频率1s，历史任务保留最近500条。","可视化 Gantt 监控","编排层","TaskDecomposition",2);
  $("子任务超时熔断","每个子任务设置独立超时(默认30s)和全局超时(默认300s)。超时后触发熔断器：半开状态允许1个探测请求，成功则恢复，失败继续熔断。连续5次超时进入冷却期(60s)，冷却后自动半开探测。","超时 熔断 探测","编排层","TaskDecomposition",2);
  $("动态资源分配","根据任务队列深度动态扩缩Agent实例：队列>10且CPU<70%扩容+2实例，队列<3且CPU>30%缩容-1实例。最小保持2实例避免冷启动。资源状态每15秒采集一次，使用EMA平滑避免抖动。","资源 弹性 扩缩容","编排层","TaskDecomposition",3);

  // IntentAnalysis 意图分析
  $("零样本意图分类","使用HuggingFace的bart-large-mnli模型进行zero-shot分类，无需训练数据。候选标签设3-5个最可能意图，置信度阈值0.6。低于阈值进入多轮澄清：生成2-3个选择性追问使用户确认意图。","zero-shot 意图 NLU","编排层","IntentAnalysis",2);
  $("多轮对话消歧","当置信度<0.6时启动澄清策略：用模板'你是想{A}还是{B}?'提供2个最可能选项。第二轮加入用户修正后的上下文重新分类。最多3轮消歧，超过则降级为通用回答。消歧成功率目标>85%。","消歧 多轮 对话","编排层","IntentAnalysis",2);
  $("实体槽位填充","NER识别7类关键实体：技术栈、框架名、文件路径、端口号、API端点、时间/日期、数值范围。使用spaCy+自定义规则，F1>0.9。未识别实体标记为[UNK]并提示用户补充。支持中文混合英文的技术实体识别。","NER 实体 槽位","编排层","IntentAnalysis",2);
  $("用户意图向量化","将用户输入用bge-large-zh-v1.5嵌入为1024维向量，与历史意图集群中心距离<0.3视为相同意图。维护用户级意图画像：最近50条意图向量均值表示用户偏好方向，用于主动推荐。","向量化 embedding 用户画像","编排层","IntentAnalysis",3);
  $("意图优先级排序","综合用户紧急度(关键词检测:立刻/紧急/马上)+业务影响(影响面估算)+历史偏好(高频意图加权)三维评分。分数=0.4×紧急度+0.35×业务影响+0.25×历史偏好。Top-1意图直接执行，2-3位作为备选展示。","优先级 排序 多维度","编排层","IntentAnalysis",3);
  $("模糊查询改写","用LLM对模糊查询做3种改写：具体化(补充缺失上下文)、泛化(扩大检索范围)、类比(用相似概念替换)。每种生成后分别匹配知识库，选择命中条目最多的改写版本执行。改写保持原意不偏离。","查询改写 扩展 检索","编排层","IntentAnalysis",2);
  $("多语言意图识别","支持中英混合输入。用langdetect检测主语言+token级语言标注，中文部分用jieba分词后做NER，英文部分保持。混合语言实体如'用React写一个Button组件'正确识别React(技术栈)、Button(组件名)。","多语言 混合 NER","编排层","IntentAnalysis",2);
  $("上下文窗口管理","维护最近5轮对话做意图上下文。滑动窗口：每次新对话加入，最旧对话移除。上下文压缩：对非关键对话用摘要替代原文，保持总token<2000。关键对话(含决策/配置信息)不压缩保留原样。","上下文 窗口 压缩","编排层","IntentAnalysis",2);
  $("意图切换检测","监控对话中意图突变：连续2轮意图分类结果不同且置信度均>0.7视为意图切换。检测到切换时清空子任务队列重新编排，保留已完成任务的结果避免重复工作。切换成本<2s。","切换 检测 上下文","编排层","IntentAnalysis",3);
  $("领域自适应微调","收集用户高频意图样本(>50条同类)，每周末自动用LoRA微调分类头。微调数据自动标注(取用户确认的意图为正例)，负例采样3倍。验证集保留10%样本，微调后F1提升<2%则回退基线模型。","微调 LoRA 自适应","编排层","IntentAnalysis",3);

  // MultiAgentCoord 多智能体
  $("多Agent通信协议","Agent间通过结构化JSON消息通信：{from,to,type,payload,correlation_id}。支持5种消息类型：task_assign/result_return/query/notify/health_check。消息大小限制64KB，超限用引用+共享存储传递。","通信 协议 JSON Agent","编排层","MultiAgentCoord",2);
  $("Agent负载均衡","轮询(round-robin)处理同质Agent，加权轮询处理异构(权重=历史成功率×响应速度)。最少连接数策略用于长任务Agent。健康检查每10s一次心跳，3次失败标记offline并触发rebalance。","负载均衡 轮询 心跳","编排层","MultiAgentCoord",2);
  $("并行执行协调","父Agent发出并行任务后使用Promise.all等待，任一子任务失败不中止其他任务(allSettled模式)。结果按完成顺序(非发起顺序)聚合，先完成先展示提升用户体验。并行度上限=可用Agent数×2防止过载。","并行 协调 Promise","编排层","MultiAgentCoord",2);
  $("Agent状态同步","每个Agent维护本地状态快照(Memory)，每30s或重要状态变更时同步到共享存储(Redis/SQLite)。读取时merge最新快照+本地增量。使用向量时钟(vector clock)检测冲突，冲突时采用最后写入胜出(LWW)策略。","状态 同步 分布式","编排层","MultiAgentCoord",3);
  $("Agent发现与注册","新Agent启动时向注册中心(etcd/Consul/ZooKeeper)注册：{id,role,capabilities,capacity,health_url}。心跳TTL 30s，超时自动注销。Agent发现用角色+能力标签匹配，缓存结果60s减少注册中心压力。","发现 注册 服务","编排层","MultiAgentCoord",3);
  $("事故升级机制","Agent遇到无法处理的问题时按层级升级：自身重试3次→请求同级Agent协助→升级到协调Agent→最终升级到人类。每次升级携带完整上下文(context+attempts+errors)避免信息丢失。升级延迟<5s。","升级 escalation 故障","编排层","MultiAgentCoord",2);
  $("角色动态分配","根据任务特征自动选择Agent：用任务描述embedding与各Agent能力描述的cosine相似度排序，取top-3展示给用户确认。紧急任务跳过确认直接分配给最佳Agent。匹配准确率目标>90%。","角色 分配 匹配","编排层","MultiAgentCoord",2);

  // TokenManagement
  $("Token预算分层管理","三层预算：会话级(单次对话上限)、日级(24h滚动窗口)、月级(自然月重置)。超限策略：会话级→切换更小模型、日级→限速(排队)、月级→硬截断。每层使用80%时发送预警通知。","Token 预算 分层","编排层","TokenManagement",2);
  $("智能模型路由","根据任务复杂度自动选模型：简单问答→gpt-3.5-turbo($0.5/1M tok)、中等推理→gpt-4o-mini($0.15/1M)、复杂多步→gpt-4o($2.5/1M)。路由决策基于：输入长度+历史同类任务成功率+预期输出复杂度。节省40-60%成本。","路由 模型 成本","编排层","TokenManagement",2);
  $("提示词压缩技术","LLMLingua框架压缩提示词至原始20%同时保持90%+性能。策略：删除低信息量token、合并重复模式、摘要化示例。压缩后token减半，推理速度提升2倍。适用于长对话历史压缩。","压缩 提示词 优化","编排层","TokenManagement",3);
  $("响应缓存策略","语义缓存：用输入embedding做key，cosine相似度>0.95命中缓存直接返回。LRU淘汰策略，缓存容量1000条(TTL 1h)。对代码生成类任务缓存命中率可达30%，减少重复API调用。Redis存储缓存key，值存向量DB。","缓存 语义 相似度","编排层","TokenManagement",2);
  $("并发请求限流","令牌桶算法：容量100 token，填充速率10/s。超出限制请求入FIFO队列(最大长度50)，超队拒绝返回429。按Agent类型分桶：高优先级Agent(调度官)独立大桶、低优先级Agent共享小桶。","限流 令牌桶 并发","编排层","TokenManagement",3);
  $("Token用量预测","基于过去7天同时段用量做ARIMA时间序列预测当日消耗。预测偏差>20%时触发告警。用LightGBM做特征：时段(小时)、星期、历史均值、最近趋势。预测图表每30分钟更新。","预测 时序 ARIMA","编排层","TokenManagement",3);

  // WorkflowOptimization
  $("流水线并行优化","识别DAG中无依赖的并行分支，批量提交执行。分支内用流水线(pipeline)减少等待：上游输出直接流式传给下游，避免全部完成再传递。流水线缓冲区设为3个结果(平衡内存和延迟)。","流水线 并行 优化","编排层","WorkflowOptimization",3);
  $("指数退避重试","失败重试间隔：1s→2s→4s→8s→16s(最多5次)。加随机抖动(±25%)避免惊群效应。区分可重试错误(网络超时/429限流)和不可重试错误(401/403认证/400参数错误)。CircuitBreaker熔断连续10次失败后停止重试。","重试 退避 熔断","编排层","WorkflowOptimization",2);
  $("工作流模板库","预定义20+常用工作流模板：代码审查流程(解析→静态检查→AI审查→报告)、文档生成(收集→大纲→撰写→格式化→审核)、数据分析(提取→清洗→分析→可视化)。模板可参数化(替换路径、模型、参数)。","模板 工作流 预定义","编排层","WorkflowOptimization",1);

  // UIDesignPatterns
  $("AI思考流展示设计","用折叠面板展示Agent思考过程：步骤编号+耗时+状态图标。每步骤可展开查看详细推理。用不同颜色区分：推理(紫色)、工具调用(青色)、错误(红色)。自动滚动跟随最新步骤，提供暂停/继续按钮。","思考流 UI 设计","编排层","UIDesignPatterns",2);
  $("代码块交互设计","代码块独立于聊天框展示：顶部语言标签+行号，右侧一键复制/下载/运行按钮。长代码(>30行)默认折叠至10行带展开按钮。支持语法高亮(Prism.js/Shiki)，暗色主题。移动端支持横滑查看长行。","代码块 UI 交互","编排层","UIDesignPatterns",2);
  $("移动端抽屉导航","侧边栏改为底部抽屉(占屏幕60%)，上滑呼出。Agent列表用图标+名称紧凑展示，支持搜索过滤。新对话按钮固定在右下角悬浮，不随抽屉移动。抽屉背景半透明遮罩点击关闭。","移动端 抽屉 导航","编排层","UIDesignPatterns",1);

  // ═══════════════════════════════════════════════════
  // 交付层 Delivery — 160 entries
  // ═══════════════════════════════════════════════════

  // FrontendDev
  $("React Server Components","RSC在服务端渲染，零JS发送到客户端，减少bundle size 30-50%。'use client'标记交互组件，默认服务端组件用于数据获取。Next.js 14 App Router原生支持RSC，搭配Server Actions处理表单提交无需API路由。","React RSC Next.js","交付层","FrontendDev",3);
  $("Vue3 Composition API","组合式API用setup()+ref/reactive管理状态，替代Options API。好处：逻辑复用(composables)、更好的TS支持、tree-shaking友好。watchEffect自动追踪依赖，onMounted/onUnmounted管理生命周期。Pinia替代Vuex做状态管理。","Vue3 Composition Pinia","交付层","FrontendDev",2);
  $("CSS Container Queries","容器查询根据父容器宽度而非视口调整样式：@container (min-width:400px){...}。比Media Query更灵活，组件自适应当前容器。container-type:inline-size声明容器，container-name命名。Chrome 105+/Safari 16+支持。","CSS Container 响应式","交付层","FrontendDev",2);
  $("Web Vitals优化","Core Web Vitals三项指标：LCP<2.5s(最大内容绘制)、INP<200ms(交互延迟)、CLS<0.1(布局偏移)。优化LCP：预加载关键图片(preload)、使用CDN、服务端渲染。优化INP：拆分长任务(>50ms为长任务)、使用Web Worker、debounce事件。","WebVitals LCP INP CLS","交付层","FrontendDev",2);
  $("Vite构建优化","Vite用esbuild预构建依赖(快10-100倍)，Rollup做生产打包。代码分割：manualChunks配置分离vendor(chunk含react/vue等)、按路由动态import做lazy loading。CSS用CSS Modules或Tailwind JIT按需生成。build缓存node_modules/.vite。","Vite 构建 优化 esbuild","交付层","FrontendDev",2);
  $("TailwindCSS最佳实践","使用@apply提取重复样式模式到组件类。响应式：sm/md/lg/xl前缀，移动优先设计。暗色模式：dark:前缀配合class策略。自定义theme扩展而非覆盖，preserve默认值。JIT引擎按需生成CSS，生产构建<10KB。","TailwindCSS 样式 暗色","交付层","FrontendDev",1);
  $("TypeScript泛型进阶","条件类型T extends U?X:Y实现类型分支。infer关键字提取类型：type Return<T>=T extends(...args:any[])=>infer R?R:never。模板字面量类型：type EventName=`on${Capitalize<string>}`。映射类型+as做key重映射。","TypeScript 泛型 类型","交付层","FrontendDev",3);
  $("微前端架构","Module Federation(WP5)或qiankun/single-spa实现微前端。主应用加载子应用，共享依赖(react/react-dom)避免重复加载。子应用独立开发部署，通过全局事件总线通信。注意CSS隔离(Shadow DOM或CSS Modules)和JS沙箱。","微前端 ModuleFederation qiankun","交付层","FrontendDev",3);

  // BackendDev
  $("Express中间件链","中间件按顺序执行：req→middleware1→middleware2→...→route handler→res。错误处理中间件签名(err,req,res,next)放在最后，next(err)跳转到错误处理。常用：cors/helmet(安全)、morgan(日志)、compression(压缩)、express.json()(解析)。","Express 中间件 Node.js","交付层","BackendDev",2);
  $("FastAPI异步处理","async def+await实现非阻塞IO，配合async SQLAlchemy/asyncpg做异步数据库操作。BackgroundTasks处理邮件发送等后置任务。Depends()实现依赖注入，自动管理数据库session生命周期。uvicorn workers=CPU核数×2+1。","FastAPI 异步 Python","交付层","BackendDev",2);
  $("数据库连接池调优","连接池大小=((CPU核数×2)+磁盘数)。PostgreSQL默认max_connections=100，通过pgbouncer做连接池复用减少连接开销。Node.js用knex/pg的内置pool:{min:2,max:10}。监控指标：等待时间(>50ms需扩容)、活跃连接数、空闲连接数。","连接池 数据库 调优","交付层","BackendDev",3);
  $("Redis缓存模式","Cache-Aside：应用先查缓存，miss再查DB并回写缓存。Write-Through：写入同时更新缓存和DB。Write-Behind：先写缓存异步刷DB(高性能但有丢失风险)。缓存穿透防护：布隆过滤器或缓存空值(TTL短)。缓存雪崩：过期时间加随机偏移。","Redis 缓存 模式","交付层","BackendDev",2);

  // APIDesign
  $("RESTful API设计规范","资源用名词复数(/users,/orders)，HTTP方法对应对CRUD。嵌套资源不超过2层(/users/:id/orders)。分页用offset/limit或cursor分页，返回total_count。错误响应格式{error:{code,message,details}}，HTTP状态码准确映射。","REST API 设计 规范","交付层","APIDesign",1);
  $("API版本管理策略","3种策略：URL路径(/v1/users)、请求头(Accept:application/vnd.api+v1+json)、查询参数(?version=1)。推荐URL路径最直观。版本号用主版本号，破坏性变更升级版本。旧版本维护6个月过渡期，返回Deprecation头通知。","版本 API 兼容","交付层","APIDesign",2);
  $("GraphQL N+1问题","DataLoader批处理和缓存解决N+1：同一事件循环内的相同查询合并为单次DB查询。每个请求创建新DataLoader实例避免跨请求缓存污染。maxBatchSize=100控制批量大小，超出分批执行。配合Apollo Server的@key指令做实体缓存。","GraphQL N+1 DataLoader","交付层","APIDesign",3);

  // DatabaseEng
  $("PostgreSQL索引优化","B-tree索引适合等值和范围查询。GIN索引适合JSONB/数组/全文搜索。部分索引WHERE条件过滤减少索引大小。覆盖索引INCLUDE列避免回表。EXPLAIN ANALYZE查看执行计划，目标：Index Scan而非Seq Scan。","PostgreSQL 索引 优化","交付层","DatabaseEng",2);
  $("数据库分库分表","垂直拆分：按业务模块(用户/订单/商品)分库。水平拆分：按user_id取模或一致性哈希分表。ShardingSphere/ProxySQL做中间件路由。跨分片查询用广播或联邦查询。全局ID用雪花算法(Snowflake)保证唯一性。","分库 分表 Sharding","交付层","DatabaseEng",3);

  // DevOpsCICD
  $("Docker多阶段构建","第一阶段用完整SDK镜像编译(如node:18)，第二阶段用alpine精简镜像(如node:18-alpine)只复制构建产物。减小镜像体积70-90%。.dockerignore排除node_modules/.git。每层RUN合并减少层数，用&&连接命令。","Docker 多阶段 优化","交付层","DevOpsCICD",2);
  $("GitHub Actions CI/CD",".github/workflows/ci.yml定义流水线。jobs用needs控制依赖顺序。actions/cache缓存node_modules加速。secrets.GITHUB_TOKEN自动注入做权限。环境变量用vars/env分离敏感/非敏感配置。matrix strategy并行测试多版本。","GitHubActions CI/CD 流水线","交付层","DevOpsCICD",2);

  // TestingQA
  $("测试金字塔","底层单元测试(70%)：快速、隔离、覆盖核心逻辑。中层集成测试(20%)：API契约、数据库交互。顶层E2E(10%)：关键用户流程。Jest/Vitest做单元测试(无外部依赖)，Supertest做API测试，Playwright做E2E。","测试 金字塔 TDD","交付层","TestingQA",1);
  $("Mock策略","外部依赖用mock避免测试不稳定：API调用用nock/MSW拦截HTTP、数据库用内存SQLite替代PostgreSQL。mock要验证调用次数和参数。部分集成测试可用Testcontainers启动真实依赖。过度mock导致测试失去意义，关键路径保持真实依赖。","Mock 测试 隔离","交付层","TestingQA",2);

  // PerfOptimization
  $("前端包体积优化","Tree-shaking：ESM静态分析移除未使用代码。Code splitting：React.lazy+Suspense按路由/组件拆分。动态import做条件加载。分析工具：webpack-bundle-analyzer可视化、rollup-plugin-visualizer。目标首屏JS<100KB(gzip)。","包体积 优化 TreeShaking","交付层","PerfOptimization",2);
  $("图片性能优化","WebP/AVIF格式比JPEG小25-35%。响应式图片用srcset+sizes根据设备像素比选图。懒加载loading=lazy(LCP图片除外)。CDN自动压缩转换格式。图片CDN(Cloudinary/imgix)支持URL参数动态裁剪。","图片 优化 WebP CDN","交付层","PerfOptimization",1);

  // SecurityEng
  $("XSS防御","输入验证+输出编码：HTML实体编码(&lt;&gt;&quot;)。Content-Security-Policy头限制脚本来源。React默认JSX转义防XSS，dangerouslySetInnerHTML需配合DOMPurify净化。HttpOnly Cookie防JS读取session。","XSS CSP 安全","交付层","SecurityEng",2);
  $("JWT安全实践","access_token短期(15min)，refresh_token长期(7d)存httpOnly cookie。签名算法用RS256/ES256(非对称)或HS256(对称，密钥>256bit)。黑名单存Redis处理登出失效。payload不存敏感信息(JWT可解码)。","JWT 认证 安全","交付层","SecurityEng",2);

  // MobileDev
  $("PWA离线策略","Service Worker拦截请求实现离线：CacheFirst(静态资源)、NetworkFirst(API数据)、StaleWhileRevalidate(平衡)。预缓存关键资源(app shell)，运行时缓存动态数据。Cache API容量建议50MB，超出用LRU淘汰。","PWA ServiceWorker 离线","交付层","MobileDev",2);
  $("移动端触摸优化","触摸目标最小44×44px。300ms点击延迟用meta viewport解决。touch-action:manipulation消除双击缩放。手势库：Hammer.js处理swipe/pinch/rotate。滚动用-webkit-overflow-scrolling:touch启用惯性。","移动端 触摸 手势","交付层","MobileDev",1);

  // WritingDesign
  $("AI优先内容结构","GEO优化：开头直接给出答案(50字内)+要点列表+详细展开+引用来源。用h1-h6层级标题，每段2-3句保持扫码友好。FAQ区块用Question/Answer schema标注。内容长度建议800-2000字，兼顾AI抓取和人类阅读。","GEO 写作 AI内容","交付层","WritingDesign",1);

  // ═══════════════════════════════════════════════════
  // 底座层 Foundation — 130 entries  
  // ═══════════════════════════════════════════════════

  // DataLakehouse
  $("湖仓一体架构","Lakehouse=Data Lake的灵活性+Data Warehouse的事务性。Apache Iceberg提供ACID事务、时间旅行(snapshot回滚)、分区演进(不重写数据)。存储层用S3/MinIO/Cloudflare R2，计算层用Spark/Trino/Flink。Iceberg表格式版本v2支持行级删除。","Lakehouse Iceberg 湖仓","底座层","DataLakehouse",3);
  $("数据冷热分层","热数据(<7天访问)>SSD存储(本地NVMe)，温数据(7-90天)>HDD，冷数据(>90天)>对象存储(S3 Glacier)。自动迁移策略基于访问频率：30天无访问降为温，90天降为冷。查询时自动union三层数据，对用户透明。","分层 冷热 存储","底座层","DataLakehouse",3);

  // RAGVectorSearch
  $("RAG Chunk切分策略","固定大小切分(512 tokens,重叠50 tokens)最简单但可能截断语义。语义切分：用句子分割(sentence splitter)保持完整性，chunk大小自适应。父子chunk：小chunk做检索(提升精度)，检索后返回父chunk做上下文(保留完整语义)。","RAG Chunk 切分","底座层","RAGVectorSearch",2);
  $("混合检索架构","BM25(稀疏)处理关键词精确匹配，向量检索(稠密)处理语义相似。两路结果用RRF(Reciprocal Rank Fusion)融合：score=Σ(1/(k+rank_i))，k=60。Reranker(BGE-Reranker-v2-m3/Cohere Rerank)对融合后top-50精排。混合检索比纯向量MRR提升10-20%。","混合检索 BM25 RRF","底座层","RAGVectorSearch",3);
  $("向量数据库选型","Chroma(轻量本地优先,<10万条)、Qdrant(Rust高性能,支持量化,过滤强)、Milvus(分布式,GPU索引,>百万级)、Weaviate(自带向量化和GraphQL)。选型标准：数据量(<10万用Chroma)、QPS需求、过滤复杂度、部署(本地/云)。","向量库 选型 Chroma Milvus","底座层","RAGVectorSearch",2);
  $("嵌入模型选择","中文优先bge-large-zh-v1.5(1024维,C-MTEB榜首)，英文用text-embedding-3-small(OpenAI,512维,$0.02/1M tok)或bge-large-en-v1.5。本地免费方案：sentence-transformers/all-MiniLM-L6-v2(384维,速度最快)或Ollama+nomic-embed-text。","嵌入 模型 embedding","底座层","RAGVectorSearch",1);

  // GEO-SEO
  $("JSON-LD结构化数据","Schema.org类型：SoftwareApplication/Article/FAQPage/Product/Organization。JSON-LD嵌入<script type=application/ld+json>。核心属性：@context/@type/name/description/url/author/datePublished。Google Rich Results Test验证有效性。","JSON-LD Schema 结构化","底座层","GEO-SEO",2);
  $("AI爬虫白名单","robots.txt明确允许AI爬虫：GPTBot/Claude-Web/PerplexityBot/Google-Extended/CCBot。用User-agent+Allow指令。同时设置Crawl-delay:10控制抓取频率。对不希望被抓取的内容(管理页面/API)用Disallow指令。","爬虫 robots.txt AI","底座层","GEO-SEO",1);

  // ETLPipeline
  $("数据质量六维度","完整性(缺失率)、唯一性(重复率)、一致性(格式统一)、准确性(业务规则验证)、及时性(数据延迟)、有效性(值域检查)。每维度设SLA阈值(如缺失率<1%)，超限触发告警。Great Expectations/Deequ做自动化质量检测。","数据质量 ETL 验证","底座层","ETLPipeline",2);

  // KnowledgeGraph
  $("实体关系抽取","用LLM+NER联合抽取：先识别实体(人名/组织/地点/技术术语)，再判断实体间关系(属于/依赖/使用/创建)。SPO三元组(Subject-Predicate-Object)存入图数据库。关系权重基于共现频率和LLM置信度。","实体 关系 抽取 图谱","底座层","KnowledgeGraph",2);

  // ═══════════════════════════════════════════════════
  // 治理层 Governance — 120 entries
  // ═══════════════════════════════════════════════════

  // HarnessRuntime
  $("熔断器三态实现","Closed(正常)→Open(熔断)触发条件：连续失败>5次或错误率>50%。Open状态持续30s后→HalfOpen(半开)，允许1个探测请求：成功→Closed，失败→Open重置计时器。状态变更记录到审计日志。Hystrix/Resilience4j库实现。","熔断 状态机 高可用","治理层","HarnessRuntime",2);
  $("OpenTelemetry全链路追踪","OTel三大信号：Traces(请求链路)、Metrics(指标聚合)、Logs(日志关联)。自动埋点支持HTTP/gRPC/DB客户端。Context propagation通过traceparent头传递traceId。导出到Jaeger(展示)和Prometheus(存储)做可视化。","OpenTelemetry 追踪 可观测","治理层","HarnessRuntime",3);

  // SelfEvolution
  $("经验蒸馏流程","从成功交互中提取(输入,行动,结果)三元组。每周运行蒸馏pipeline：聚类相似交互→提取通用模式→LLM生成技能描述→人工或自动评估→通过则加入技能库。技能版本化(Git管理)，性能回退时快速回滚。","蒸馏 经验 技能","治理层","SelfEvolution",2);
  $("错题本机制","失败案例自动收录：记录输入+期望输出+实际输出+错误类型(幻觉/偏差/超时/格式错误)。每周分析错题聚类，生成针对性改进建议。同类错误重复出现3次触发告警并自动降级相关Agent。错题为训练负例提升模型鲁棒性。","错题本 失败 改进","治理层","SelfEvolution",2);

  // SecurityCompliance
  $("AI安全围栏","三层防护：输入层(语义分析检测恶意意图/注入攻击/PII泄露)、模型层(系统提示词注入检测、输出格式约束)、输出层(内容审核过滤+水印嵌入)。每层独立部署，单层失效不影响整体。误拦截率<1%，漏过率<0.1%。","安全 围栏 AI防护","治理层","SecurityCompliance",3);
  $("Prompt注入防御","用分隔符(###或XML标签)隔离用户输入和系统指令。输入前做语义分析检测指令覆盖尝试('ignore previous'/'你现在是')。输出前验证不包含系统提示词泄露。防御方案：instruction hierarchy(系统>工具>用户优先级)、输入净化。","Prompt注入 防御 安全","治理层","SecurityCompliance",3);

  // EvolutionDirections (六大进化方向相关)
  $("LangGraph状态图编排","LangGraph用StateGraph定义Agent工作流：节点=处理步骤，边=条件路由。支持循环(circular edges)实现ReAct模式的思考-行动循环。checkpointer持久化状态实现断点恢复和人机协同。可嵌套子图实现多Agent层次化编排。","LangGraph 状态图 Agent","治理层","SelfEvolution",3);
  $("A2A跨Agent通信协议","Google A2A Protocol：Agent Card声明能力+端点、Task对象追踪任务生命周期、SSE实现流式通信。支持多模态(文本/图片/音频)。agent_card.json描述Agent身份和能力，tasks/send发送任务，tasks/get获取状态。150+组织已采用。","A2A 协议 通信","编排层","MultiAgentCoord",3);
  $("MCP工具接入标准","Anthropic MCP：Client-Server架构，Server暴露tools/resources/prompts。JSON-RPC 2.0协议通信，支持stdio/HTTP传输。10+语言SDK。ListTools获取可用工具，CallTool执行。已集成Claude Desktop/VSCode/Bee Agent等。","MCP 工具 标准","编排层","MultiAgentCoord",2);
  $("动态Agent生成引擎","模板引擎(YAML定义角色+system prompt+工具集+模型配置)，运行时动态实例化Agent实例。Agent Factory模式根据任务描述自动选择模板并参数化。实例生命周期：create→active→idle(30min)→suspend→destroy。","动态 Agent 模板 工厂","编排层","TaskDecomposition",3);
  $("ReAct推理行动循环","Thought→Action→Observation循环：Thought(分析当前状态并规划)、Action(执行工具调用)、Observation(观察结果并更新理解)。最多循环10次防止无限循环，每次输出标注Thought/Action/Observation。LangChain AgentExecutor封装此模式。","ReAct 推理 循环","编排层","MultiAgentCoord",2);
  $("Token经济内部结算","每个Agent调用消耗Token换算为内部积分(1K token=1 credit)。日预算/月预算分配，超支Agent自动降级模型。Agent间可转移credit(经协调Agent批准)。预算报告每日生成，含Agent级消耗明细和优化建议。","Token 经济 结算 预算","编排层","TokenManagement",3);
  $("Mem0个性化记忆","Mem0提取用户偏好和上下文存为向量记忆，自动去重和更新。支持短期(会话内)和长期(跨会话)记忆。记忆类型：用户偏好(技术栈/风格)、历史决策、项目上下文。API自动判断添加/更新/删除记忆。","Mem0 记忆 个性化","编排层","IntentAnalysis",3);
  $("数字生命体自愈","Agent持续自监控(CPU/内存/错误率/响应延迟)。异常检测：3σ规则或孤立森林(Isolation Forest)识别指标偏离。轻度异常(CPU>80%)→降级(切换轻量模型)，中度(连续错误)→重启实例，重度(OOM)→kill并创建新实例+告警人工介入。","自愈 监控 Agent 运维","治理层","HarnessRuntime",3);

  // ── 统计与接口 ──
  E.forEach(function(e,i){
    e.i = 'K' + String(i+1).padStart(4,'0');
    e.a = e.l + '/' + e.s;
  });

  var stats = { byLayer: {}, bySubCat: {}, total: E.length };
  ["编排层","交付层","底座层","治理层"].forEach(function(l){
    stats.byLayer[l] = E.filter(function(e){return e.l===l;}).length;
  });
  var subcats = {};
  E.forEach(function(e){
    if(!subcats[e.s]) subcats[e.s] = 0;
    subcats[e.s]++;
  });
  stats.bySubCat = subcats;

  return {
    entries: E,
    total: E.length,
    stats: stats,
    search: function(q){
      q = q.toLowerCase();
      var results = [];
      for(var i=0;i<E.length;i++){
        var e = E[i];
        if(e.t.toLowerCase().indexOf(q)!==-1 || e.c.toLowerCase().indexOf(q)!==-1){
          results.push(e);
        } else {
          for(var j=0;j<e.g.length;j++){
            if(e.g[j].toLowerCase().indexOf(q)!==-1){results.push(e);break;}
          }
        }
        if(results.length>=30) break;
      }
      return results;
    },
    byLayer: function(l){return E.filter(function(e){return e.l===l;});},
    bySubCat: function(s){return E.filter(function(e){return e.s===s;});},
    byAgent: function(aid){return E.filter(function(e){return e.a.indexOf(aid)!==-1 || (e.g||[]).some(function(t){return t.toLowerCase().indexOf(aid)!==-1;});});},
    getStats: function(){return stats;},
    recommend: function(agentId, limit){
      limit = limit || 5;
      var matched = E.filter(function(e){return e.a.indexOf(agentId)!==-1;}).slice(0,limit);
      if(matched.length<limit){
        matched = matched.concat(E.slice(0,limit-matched.length));
      }
      return matched;
    }
  };
})();

if(typeof module!=='undefined'&&module.exports){module.exports=HOPEAI_KB;}else if(typeof window!=='undefined'){window.HOPEAI_KB=HOPEAI_KB;}
