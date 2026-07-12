export interface KnowledgeItem {
  id: string
  title: string
  content: string
  tags: string[]
  category: string
}

const rag: KnowledgeItem[] = [
  {
    id: 'rag-simple',
    title: 'SimpleRAG',
    content: '基础 RAG 范式：检索相关文档后拼接至 Prompt 上下文，由 LLM 直接生成回答。优点是实现简单、延迟低；缺点是检索质量不可靠时容易产生幻觉，且缺乏自纠错能力。',
    tags: ['RAG', '基础', '入门'],
    category: 'RAG范式演变',
  },
  {
    id: 'rag-corrective',
    title: 'CorrectiveRAG',
    content: '纠错型 RAG：在 SimpleRAG 基础上引入检索结果质量评估步骤，对低质量文档进行改写或替换后再送入 LLM。通过 self-verify 机制减少幻觉，但引入额外延迟。',
    tags: ['RAG', '纠错', '质量评估'],
    category: 'RAG范式演变',
  },
  {
    id: 'rag-self',
    title: 'Self-RAG',
    content: '自反思 RAG：LLM 在生成过程中自我判断是否需要检索、检索结果是否相关，并自行决定是否引用。通过特殊 token 标记检索与引用决策，提升生成可靠性。代表论文: Self-RAG (2023)。',
    tags: ['RAG', '自反思', 'Self-RAG'],
    category: 'RAG范式演变',
  },
  {
    id: 'rag-agentic',
    title: 'AgenticRAG',
    content: '智能体 RAG：将 RAG 流程拆分为多个 Agent 协作完成，包括查询重写、多源检索、文档排序、答案合成等步骤。每个步骤由独立 Agent 负责，具备动态路由和工具调用能力。',
    tags: ['RAG', 'Agent', '多智能体'],
    category: 'RAG范式演变',
  },
  {
    id: 'rag-graph',
    title: 'GraphRAG',
    content: '图增强 RAG：利用知识图谱结构化存储实体关系，检索时同时获取文档片段和图谱中的关联信息。微软 GraphRAG 通过社区摘要(Community Summarization)实现全局理解，适合处理需要多跳推理的复杂查询。',
    tags: ['RAG', '知识图谱', 'GraphRAG', '微软'],
    category: 'RAG范式演变',
  },
  {
    id: 'rag-speculative',
    title: 'SpeculativeRAG',
    content: '推测型 RAG：使用小模型(如 7B)快速生成多个候选答案草稿，再由大模型(如 GPT-4o)进行验证和精炼。通过分离起草和审核阶段，在保持质量的同时显著降低延迟和成本。',
    tags: ['RAG', '推测', '小模型'],
    category: 'RAG范式演变',
  },
  {
    id: 'rag-fusion',
    title: 'FusionRAG',
    content: '融合型 RAG：结合多种检索策略(关键词、向量、图谱、SQL)和多种生成策略(摘要、提取、推理)的统一框架。通过混合路由将不同查询类型分配到最优检索管线，实现端到端的自适应检索增强生成。',
    tags: ['RAG', '融合', '多模态检索'],
    category: 'RAG范式演变',
  },
]

const agentFrameworks: KnowledgeItem[] = [
  {
    id: 'agent-react',
    title: 'ReAct 模式',
    content: 'Reason + Act 模式：LLM 交替进行推理(Thought)和行动(Action)，通过观察(Observation)反馈循环迭代解决问题。核心公式: Thought → Action → Observation → Thought → ...。适用于需要多步推理的复杂任务，是多数 Agent 框架的基础范式。',
    tags: ['Agent', 'ReAct', '推理'],
    category: 'Agent框架',
  },
  {
    id: 'agent-autogen',
    title: 'AutoGen / CrewAI',
    content: '多智能体协作框架：AutoGen(Microsoft)支持多 Agent 对话协作，CrewAI 通过角色定义(Role/Goal/Backstory)组织 Agent 团队。适合分解复杂任务为子任务，由不同专业 Agent 并行或串行完成。',
    tags: ['Agent', 'AutoGen', 'CrewAI', '多智能体'],
    category: 'Agent框架',
  },
  {
    id: 'agent-mcp',
    title: 'MCP 协议',
    content: 'Model Context Protocol：Anthropic 提出的开放标准，定义 AI 模型与外部工具/数据源的标准接口。通过 Client-Server 架构，模型(Client)通过 MCP 发现和调用各类工具(Server)，实现模型与外部世界的标准化交互。',
    tags: ['Agent', 'MCP', '协议', 'Anthropic'],
    category: 'Agent框架',
  },
  {
    id: 'agent-function-calling',
    title: 'Function Calling',
    content: '函数调用：LLM 根据用户意图输出结构化 JSON，由宿主应用执行对应函数并返回结果。主流模型 (GPT-4/GPT-3.5/Claude/Gemini) 均支持。是实现 Tool-Use Agent 的核心机制，适合将 AI 能力嵌入现有业务系统。',
    tags: ['Agent', 'Function Calling', '工具调用'],
    category: 'Agent框架',
  },
  {
    id: 'agent-computer-use',
    title: 'Computer Use',
    content: 'Computer Use：AI 直接操控计算机的能力，包括鼠标移动、点击、键盘输入、屏幕截图分析等。Anthropic Claude 3.5 率先推出 beta 版本，通过截图 + 坐标指令实现跨应用自动化操作，是目前 Agent 交互的最高自由度形式。',
    tags: ['Agent', 'Computer Use', 'Claude', '自动化'],
    category: 'Agent框架',
  },
]

const aiArchitecture: KnowledgeItem[] = [
  {
    id: 'arch-l1',
    title: 'L1 编排层',
    content: '编排层(Orchestration Layer)：负责 AI 工作流的设计、调度与执行。包括意图识别、任务分解、Agent 路由、流程编排(BPMN/DAG)、人机协同中断点等。是 AI 应用的"大脑"，决定什么时候调用什么能力。',
    tags: ['AI架构', '编排', 'L1'],
    category: 'AI架构',
  },
  {
    id: 'arch-l2',
    title: 'L2 交付层',
    content: '交付层(Delivery Layer)：面向最终用户和业务场景的 AI 应用形态。包括 Chat UI、API Gateway、SSE/WebSocket 流式推送、多模态交互(文本/语音/图像/视频)等。是 AI 能力的"界面"，直接与用户交互。',
    tags: ['AI架构', '交付', 'L2'],
    category: 'AI架构',
  },
  {
    id: 'arch-l3',
    title: 'L3 底座层',
    content: '底座层(Foundation Layer)：AI 基础设施和核心能力。包括模型服务(Embedding/LLM/Tokenizer)、向量数据库(Milvus/Qdrant/Pinecone)、知识库/RAG 引擎、插件和工具生态(MCP 协议)等。是 AI 应用的"引擎"，提供算力与智能。',
    tags: ['AI架构', '底座', 'L3'],
    category: 'AI架构',
  },
  {
    id: 'arch-l4',
    title: 'L4 治理层',
    content: '治理层(Governance Layer)：AI 应用的质量控制与风险管理体系。包括安全护栏(Guardrails)、内容审核、成本追踪、用量监控、效果评估(BLEU/ROUGE/人工反馈)、Prompt 版本管理和 A/B 测试等。确保 AI 应用的安全合规和持续优化。',
    tags: ['AI架构', '治理', 'L4'],
    category: 'AI架构',
  },
]

const a2a: KnowledgeItem[] = [
  {
    id: 'a2a-protocol',
    title: 'Google A2A Protocol',
    content: 'Agent-to-Agent Protocol：Google 提出的 Agent 间通信开放标准，定义 Agent 如何发现、交互和协作。通过 Agent Card 注册能力，Task 对象追踪任务状态，支持 SSE 实时流式通信。目标是实现异厂商 Agent 间的互操作。',
    tags: ['A2A', 'Google', '协议'],
    category: 'A2A协议',
  },
  {
    id: 'a2a-agent-card',
    title: 'Agent Card',
    content: 'Agent Card：JSON 格式的能力声明文件，位于 /.well-known/agent.json。包含 Agent 名称、描述、支持的 Skills、端点 URL、认证方式等属性。其他 Agent 通过读取 Agent Card 来发现和评估合作方能力，实现去中心化的 Agent 服务发现。',
    tags: ['A2A', 'Agent Card', '服务发现'],
    category: 'A2A协议',
  },
  {
    id: 'a2a-task',
    title: 'Task 对象',
    content: 'Task 对象是 A2A 协议中的核心抽象，表示一个异步执行任务。包含 id、status(pending/in-progress/completed/failed)、input/output artifacts、进度报告等字段。支持 SSE 推送状态变更，允许长时间运行的 Agent 任务进行实时状态同步。',
    tags: ['A2A', 'Task', '异步'],
    category: 'A2A协议',
  },
  {
    id: 'a2a-sse',
    title: 'SSE 流式通信',
    content: 'Server-Sent Events 流式传输是 A2A 协议推荐的通信方式。Agent 通过 SSE 通道向请求方推送任务状态变化、中间结果和最终输出。相比 WebSocket，SSE 更轻量，单向推送，天然支持断线重连，适合 Agent 长时间任务的实时反馈场景。',
    tags: ['A2A', 'SSE', '流式'],
    category: 'A2A协议',
  },
]

const mcp: KnowledgeItem[] = [
  {
    id: 'mcp-architecture',
    title: 'Client-Server 架构',
    content: 'MCP 采用经典的 Client-Server 架构。MCP Client(如 Claude Desktop、IDE 插件)发起连接，MCP Server(工具/数据提供方)响应请求。支持标准 I/O 和 HTTP+SSE 两种传输模式：stdio 适合本地进程间通信，HTTP+SSE 适合远程服务调用。',
    tags: ['MCP', '架构', 'Client-Server'],
    category: 'MCP协议',
  },
  {
    id: 'mcp-json-rpc',
    title: 'JSON-RPC 2.0',
    content: 'MCP 基于 JSON-RPC 2.0 协议进行消息交换。每个请求包含 jsonrpc/ method/params/id 字段，响应包含 jsonrpc/result 或 error/id。支持 request、response、notification 三种消息类型，其中 notification 不期待响应，适合状态广播。',
    tags: ['MCP', 'JSON-RPC', '协议'],
    category: 'MCP协议',
  },
  {
    id: 'mcp-tools',
    title: 'Tools / Resources / Prompts',
    content: 'MCP Server 通过三个核心原语暴露能力：Tools(可调用的函数，如读写文件、查询数据库)、Resources(可供读取的数据，如文档内容、配置文件)、Prompts(预定义的 Prompt 模板，可参数化复用)。三者共同构成 Agent 与外部世界交互的标准化接口。',
    tags: ['MCP', 'Tools', 'Resources', 'Prompts'],
    category: 'MCP协议',
  },
]

const evolution: KnowledgeItem[] = [
  {
    id: 'evo-scale',
    title: '规模进化',
    content: '规模进化关注模型参数量的指数增长和训练数据的持续扩充。从 GPT-2(1.5B)到 GPT-3(175B)再到 GPT-4(约1.8T)，遵循 Scaling Law 的发现：更大的模型、更多的数据带来可预测的性能提升。但边际收益递减和成本问题推动行业向更高效的模型架构发展。',
    tags: ['进化', '规模', 'Scaling Law'],
    category: '进化方向',
  },
  {
    id: 'evo-intelligence',
    title: '智能进化',
    content: '智能进化关注模型认知能力的质的飞跃。从单一文本理解到多模态感知，从静态知识到动态推理，从被动回答到主动规划。体现为 chain-of-thought、self-reflection、tool-use 等能力涌现，以及 MoE(混合专家)架构的提升。',
    tags: ['进化', '智能', '认知'],
    category: '进化方向',
  },
  {
    id: 'evo-architecture',
    title: '架构进化',
    content: '架构进化关注 AI 系统拓扑结构的变化。从单体模型调用到 Agent 编排，从中心化服务到去中心化协作，从封闭系统到插件生态。MCP 协议实现了工具的标准化接入，A2A 协议实现了 Agent 间的互联互通，推动了"AI 生态系统"的形成。',
    tags: ['进化', '架构', '系统设计'],
    category: '进化方向',
  },
  {
    id: 'evo-economics',
    title: '经济进化',
    content: '经济进化关注 AI 的成本结构和商业模型的演进。从按 Token 计费到按任务定价，从闭源 API 到开源本地部署，从一次性调用到持续订阅。MoE 架构和量化技术大幅降低推理成本(DeepSeek-V3 的推理成本仅为 GPT-4 的约 10%)，使 AI 民主化成为可能。',
    tags: ['进化', '经济', '成本'],
    category: '进化方向',
  },
  {
    id: 'evo-interaction',
    title: '交互进化',
    content: '交互进化关注人机交互范式的变迁。从命令行到对话式 UI，从短上下文到超长上下文(100万+ Token)，从异步问答到实时语音对话(GPT-4o 实时模式)，从文本输入到多模态输入(屏幕共享、摄像头、文件上传)。正在向"环境式 AI(Ambient AI)"演进。',
    tags: ['进化', '交互', '多模态'],
    category: '进化方向',
  },
  {
    id: 'evo-life',
    title: '生命进化',
    content: '生命进化探讨 AI 自主性和社会角色的演变。从工具到助手，从助手到伙伴，从伙伴到具备自主目标的智能体。涉及 AI 安全性、对齐(Alignment)、可控性等关键挑战，以及人机共生社会的伦理框架构建。',
    tags: ['进化', '社会', '安全'],
    category: '进化方向',
  },
]

const sopSkills: KnowledgeItem[] = [
  {
    id: 'sop-fullstack',
    title: 'Full-Stack Web App',
    content: '全栈 Web 应用开发 SOP：需求分析 → 技术选型(前后端框架/数据库) → 项目脚手架搭建 → 数据库 Schema 设计 → API 接口定义 → 前端页面实现 → 联调测试 → 部署上线。适合从零构建全栈应用的项目，覆盖从产品构思到生产环境的完整链路。',
    tags: ['SOP', '全栈', 'Web'],
    category: 'SOP技能包',
  },
  {
    id: 'sop-api-migration',
    title: 'API Migration',
    content: 'API 迁移 SOP：源 API 接口文档收集 → 接口映射表编制 → 兼容层设计 → 批量代码转换 → 单元测试覆盖 → 集成测试 → 灰度发布 → 全量切换 → 旧接口下线。适合将遗留系统迁移到新 API 体系的项目，减少迁移风险。',
    tags: ['SOP', 'API', '迁移'],
    category: 'SOP技能包',
  },
  {
    id: 'sop-security',
    title: 'Security Audit',
    content: '安全审计 SOP：资产测绘 → 威胁建模(STRIDE) → 代码静态分析(SAST) → 依赖漏洞扫描(SCA) → 动态测试(DAST) → 渗透测试 → 风险评级 → 修复方案 → 回归验证。适合需要系统性安全评估和加固的项目。',
    tags: ['SOP', '安全', '审计'],
    category: 'SOP技能包',
  },
  {
    id: 'sop-data-pipeline',
    title: 'Data Pipeline',
    content: '数据管道 SOP：数据源接入 → Schema 检测 → ETL/ELT 设计 → 数据质量校验 → 管道调度编排 → 监控告警 → 数据血缘追踪。适合构建数据处理与分析管道的项目，支持批处理和流处理两种模式。',
    tags: ['SOP', '数据', '管道'],
    category: 'SOP技能包',
  },
  {
    id: 'sop-mobile',
    title: 'Mobile App Launch',
    content: '移动应用发布 SOP：原型设计 → UI/UX 评审 → 多端框架选型(React Native/Flutter/UniApp) → 核心功能开发 → 多屏幕适配 → 性能优化(启动速度/内存/包体积) → 测试(单元/UI/真机) → 打包签名 → 商店上架(App Store/Google Play) → 版本迭代。',
    tags: ['SOP', '移动端', '发布'],
    category: 'SOP技能包',
  },
  {
    id: 'sop-rag-engine',
    title: 'RAG Knowledge Engine',
    content: 'RAG 知识引擎 SOP：知识库规划 → 文档预处理(TXT/MD/PDF/HTML) → 分块策略设计(Chunk Size/Overlap) → Embedding 模型选型 → 向量数据库搭建 → 检索策略配置(关键词+语义+重排序) → Prompt 模板设计 → 效果评测 → 反馈闭环。适合构建企业级知识检索增强系统的项目。',
    tags: ['SOP', 'RAG', '知识引擎'],
    category: 'SOP技能包',
  },
  {
    id: 'sop-devops',
    title: 'DevOps Greenfield',
    content: 'DevOps 绿地部署 SOP：基础设施选型(云/自建) → CI/CD 流水线搭建(GitLab CI/GitHub Actions) → 容器化(Docker/K8s) → 配置管理 → 日志收集(ELK/Loki) → 监控体系(Prometheus/Grafana) → 告警策略配置 → 灾备方案。适合从零搭建 DevOps 基础架构的团队。',
    tags: ['SOP', 'DevOps', '基础设施'],
    category: 'SOP技能包',
  },
]

const tokenRates: KnowledgeItem[] = [
  {
    id: 'rate-gpt35',
    title: 'GPT-3.5 Turbo',
    content: '输入: $0.50/1M tokens | 输出: $1.50/1M tokens | 上下文: 16K | 适用场景: 轻量对话、文本分类、简单总结。性价比最高的 OpenAI 模型，适合高吞吐量、对推理深度要求不高的场景。',
    tags: ['Token费率', 'GPT-3.5', 'OpenAI'],
    category: 'Token费率',
  },
  {
    id: 'rate-gpt4o-mini',
    title: 'GPT-4o Mini',
    content: '输入: $0.15/1M tokens | 输出: $0.60/1M tokens | 上下文: 128K | 适用场景: 日常编程辅助、内容改写、中等复杂度推理。在同等档次模型中推理能力优秀，是 GPT-3.5 的替代升级方案。',
    tags: ['Token费率', 'GPT-4o', 'OpenAI'],
    category: 'Token费率',
  },
  {
    id: 'rate-gpt4o',
    title: 'GPT-4o',
    content: '输入: $2.50/1M tokens | 输出: $10.00/1M tokens | 上下文: 128K | 多模态: 文本+图像+音频 | 适用场景: 复杂推理、代码生成、多模态分析。OpenAI 当前全能旗舰模型，综合能力最强。',
    tags: ['Token费率', 'GPT-4o', 'OpenAI', '多模态'],
    category: 'Token费率',
  },
  {
    id: 'rate-deepseek',
    title: 'DeepSeek Chat',
    content: '输入: $0.14/1M tokens(缓存命中) / $0.27/1M tokens(未命中) | 输出: $1.10/1M tokens | 上下文: 128K | MoE 架构 | 适用场景: 编程、长文本理解、高性价比推理。国产最强开源模型，推理成本仅为 GPT-4o 的约 10% 但性能接近。',
    tags: ['Token费率', 'DeepSeek', '国产'],
    category: 'Token费率',
  },
  {
    id: 'rate-claude',
    title: 'Claude 3.5 Sonnet',
    content: '输入: $3.00/1M tokens | 输出: $15.00/1M tokens | 上下文: 200K | 适用场景: 长文本分析、代码审查、创意写作、安全合规审核。在编程和长文本任务中表现优异，200K 上下文窗口尤为突出。',
    tags: ['Token费率', 'Claude', 'Anthropic'],
    category: 'Token费率',
  },
  {
    id: 'rate-qwen',
    title: 'Qwen Turbo',
    content: '输入: $0.30/1M tokens | 输出: $0.60/1M tokens | 上下文: 32K | 适用场景: 中文优化、通用对话、文本分析。阿里云通义千问系列，中文理解能力优秀，性价比在中文场景中极高。',
    tags: ['Token费率', 'Qwen', '国产', '中文优化'],
    category: 'Token费率',
  },
]

export const hopeaiKnowledge: KnowledgeItem[] = [
  ...rag,
  ...agentFrameworks,
  ...aiArchitecture,
  ...a2a,
  ...mcp,
  ...evolution,
  ...sopSkills,
  ...tokenRates,
]

export const knowledgeCategories = [
  'RAG范式演变',
  'Agent框架',
  'AI架构',
  'A2A协议',
  'MCP协议',
  '进化方向',
  'SOP技能包',
  'Token费率',
] as const

export function getByCategory(category: string): KnowledgeItem[] {
  return hopeaiKnowledge.filter(item => item.category === category)
}

export function getByTag(tag: string): KnowledgeItem[] {
  return hopeaiKnowledge.filter(item => item.tags.includes(tag))
}

export function searchKnowledge(query: string): KnowledgeItem[] {
  const lower = query.toLowerCase()
  return hopeaiKnowledge.filter(item =>
    item.title.toLowerCase().includes(lower) ||
    item.content.toLowerCase().includes(lower) ||
    item.tags.some(t => t.toLowerCase().includes(lower)),
  )
}
