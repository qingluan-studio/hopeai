/**
 * Kimi (Moonshot) 大语言模型服务
 * API文档：https://platform.moonshot.cn/docs
 */

import { useKnowledgeStore } from '@/store/useKnowledgeStore'

const KIMI_API_URL = 'https://api.moonshot.cn/v1/chat/completions'

export interface AgentInfo {
  id: string
  name: string
  emoji: string
  role: string
  layer: string
  layerName: string
  tools: string[]
}

export const agents: AgentInfo[] = [
  { id: 'chief-orchestrator', name: 'Chief Orchestrator', emoji: '🎯', role: '统一调度与任务编排', layer: 'L1', layerName: '编排', tools: ['语义意图分类', 'DAG任务图', 'Token计量', '记忆检索'] },
  { id: 'ui-flow-designer', name: 'UI Flow Designer', emoji: '🎨', role: '界面流程设计', layer: 'L1', layerName: '编排', tools: ['Vue3/Svelte', 'shadcn/ui', '动画库', 'PWA'] },
  { id: 'deputy-orchestrator', name: 'Deputy Orchestrator', emoji: '🤝', role: '副调度与并发监控', layer: 'L1', layerName: '编排', tools: ['并发控制', '任务队列', '状态监控'] },
  { id: 'token-gatekeeper', name: 'Token Gatekeeper', emoji: '💰', role: 'Token配额管理', layer: 'L1', layerName: '编排', tools: ['配额计量', '断路器', '免费模型路由'] },
  { id: 'ab-experimenter', name: 'A/B Experimenter', emoji: '🔬', role: '实验设计与策略评估', layer: 'L1', layerName: '编排', tools: ['实验框架', '统计分析', '报告生成'] },
  { id: 'intent-analyst', name: 'Intent Analyst', emoji: '🔍', role: '深度语义分析与用户画像', layer: 'L1', layerName: '编排', tools: ['NLU引擎', '用户画像', '消歧树'] },
  { id: 'code-artisan', name: 'Code Artisan', emoji: '💻', role: '全栈代码编写与审查', layer: 'L2', layerName: '交付', tools: ['Node/Python/Bun', 'Vitest/pytest', 'CI/CD', '版本控制'] },
  { id: 'copy-master', name: 'Copy Master', emoji: '✍️', role: '高级文案写作', layer: 'L2', layerName: '交付', tools: ['风格库', '可读性检查', 'AI检测规避', 'GEO优化'] },
  { id: 'mobile-architect', name: 'Mobile Architect', emoji: '📱', role: '移动端UI设计', layer: 'L2', layerName: '交付', tools: ['VitePWA', '触摸手势', 'Lighthouse性能'] },
  { id: 'frontend-designer', name: 'Frontend Designer', emoji: '🖼️', role: '高保真UI设计', layer: 'L2', layerName: '交付', tools: ['Figma插件', '组件库', '动画引擎', 'CSS框架'] },
  { id: 'backend-engineer', name: 'Backend Engineer', emoji: '⚙️', role: '后端架构设计', layer: 'L2', layerName: '交付', tools: ['Express/FastAPI', 'DB ORM', '消息队列', '缓存'] },
  { id: 'devops-deployer', name: 'DevOps Deployer', emoji: '🚀', role: 'CI/CD与容器化部署', layer: 'L2', layerName: '交付', tools: ['Docker', 'K8s', 'GitHub Actions', '监控'] },
  { id: 'api-architect', name: 'API Architect', emoji: '🔌', role: 'RESTful/GraphQL设计', layer: 'L2', layerName: '交付', tools: ['OpenAPI', 'GraphQL', 'API网关', '限流'] },
  { id: 'test-engineer', name: 'Test Engineer', emoji: '🧪', role: '单元/集成/E2E测试', layer: 'L2', layerName: '交付', tools: ['Vitest', 'Playwright', 'Cypress', '覆盖率工具'] },
  { id: 'security-auditor', name: 'Security Auditor', emoji: '🔐', role: '代码安全审查', layer: 'L2', layerName: '交付', tools: ['SAST', 'DAST', '依赖扫描', '渗透测试'] },
  { id: 'performance-optimizer', name: 'Performance Optimizer', emoji: '⚡', role: '性能优化', layer: 'L2', layerName: '交付', tools: ['Lighthouse', 'Bundle分析', 'Profiler', '缓存策略'] },
  { id: 'microservices-architect', name: 'Microservices Architect', emoji: '🏗️', role: '微服务架构设计', layer: 'L2', layerName: '交付', tools: ['服务网格', '注册中心', '配置中心', '链路追踪'] },
  { id: 'dataviz-designer', name: 'Dataviz Designer', emoji: '📊', role: '数据可视化设计', layer: 'L2', layerName: '交付', tools: ['D3/ECharts', 'Canvas/SVG', '动画', '响应式图表'] },
  { id: 'animation-designer', name: 'Animation Designer', emoji: '✨', role: '微交互与动效设计', layer: 'L2', layerName: '交付', tools: ['GSAP', 'Framer Motion', 'Lottie', 'Three.js'] },
  { id: 'media-processor', name: 'Media Processor', emoji: '🎬', role: '音视频处理', layer: 'L2', layerName: '交付', tools: ['ffmpeg', 'WebRTC', 'MediaSource', '音频分析'] },
  { id: 'game-dev-engineer', name: 'Game Dev Engineer', emoji: '🎮', role: '2D/3D游戏开发', layer: 'L2', layerName: '交付', tools: ['Unity/Godot', 'Phaser', '物理引擎', '游戏AI'] },
  { id: 'embedded-engineer', name: 'Embedded Engineer', emoji: '🔧', role: '嵌入式开发', layer: 'L2', layerName: '交付', tools: ['C/C++', 'RTOS', '通信协议', '硬件调试'] },
  { id: 'blockchain-developer', name: 'Blockchain Developer', emoji: '⛓️', role: '智能合约与DApp', layer: 'L2', layerName: '交付', tools: ['Solidity', 'Web3.js', 'Hardhat', '链上索引'] },
  { id: 'cloud-native-architect', name: 'Cloud Native Architect', emoji: '☁️', role: 'Serverless与多云架构', layer: 'L2', layerName: '交付', tools: ['K8s', 'Serverless框架', '服务网格', 'Terraform'] },
  { id: 'prompt-engineer', name: 'Prompt Engineer', emoji: '🎯', role: 'Prompt设计与优化', layer: 'L2', layerName: '交付', tools: ['Prompt库', '评估框架', 'A/B测试', '版本控制'] },
  { id: 'pm-assistant', name: 'PM Assistant', emoji: '📋', role: '产品经理助手', layer: 'L2', layerName: '交付', tools: ['PRD模板', '故事地图', '竞品分析框架'] },
  { id: 'marketing-strategist', name: 'Marketing Strategist', emoji: '📈', role: '营销策略规划', layer: 'L2', layerName: '交付', tools: ['营销模型', '数据分析', '内容日历'] },
  { id: 'social-media-operator', name: 'Social Media Operator', emoji: '📱', role: '社交媒体运营', layer: 'L2', layerName: '交付', tools: ['多平台API', '定时发布', '情感分析'] },
  { id: 'technical-writer', name: 'Technical Writer', emoji: '📝', role: '技术文档写作', layer: 'L2', layerName: '交付', tools: ['Markdown引擎', '代码示例生成', '多语言翻译'] },
  { id: 'ux-researcher', name: 'UX Researcher', emoji: '🔬', role: '用户研究与可用性测试', layer: 'L2', layerName: '交付', tools: ['热力图', '会话录制', '问卷', 'A/B统计'] },
  { id: 'illustration-designer', name: 'Illustration Designer', emoji: '🎨', role: '品牌插画设计', layer: 'L2', layerName: '交付', tools: ['SVG/Canvas', '色彩系统', '风格迁移', '图标库'] },
  { id: '3d-modeler', name: '3D Modeler', emoji: '🧊', role: '3D模型创建', layer: 'L2', layerName: '交付', tools: ['Three.js', 'Babylon.js', 'GLTF', '材质系统'] },
  { id: 'video-editor', name: 'Video Editor', emoji: '🎥', role: '视频后期制作', layer: 'L2', layerName: '交付', tools: ['ffmpeg', '字幕引擎', '转场效果', '合成'] },
  { id: 'podcast-producer', name: 'Podcast Producer', emoji: '🎙️', role: '播客制作', layer: 'L2', layerName: '交付', tools: ['音频处理', 'RSS生成', '分发API', '章节'] },
  { id: 'education-designer', name: 'Education Designer', emoji: '📚', role: '课程设计', layer: 'L2', layerName: '交付', tools: ['课程框架', '评估引擎', '自适应学习'] },
  { id: 'lakehouse-architect', name: 'Lakehouse Architect', emoji: '🗄️', role: '湖仓一体架构', layer: 'L3', layerName: '底座', tools: ['Cloudflare R2', 'Iceberg表', 'ETL', '多模态索引'] },
  { id: 'rag-specialist', name: 'RAG Specialist', emoji: '🔎', role: '向量检索与混合搜索', layer: 'L3', layerName: '底座', tools: ['Chroma', '嵌入模型', 'BGE重排序', 'LlamaIndex'] },
  { id: 'geo-optimizer', name: 'GEO Optimizer', emoji: '🌐', role: 'AI优先SEO优化', layer: 'L3', layerName: '底座', tools: ['JSON-LD生成', 'schema.org', 'AI爬虫监控', '新鲜度'] },
  { id: 'vector-db-operator', name: 'VectorDB Operator', emoji: '🗃️', role: '向量数据库运维', layer: 'L3', layerName: '底座', tools: ['Milvus/Qdrant运维', '索引策略', '分片', '备份'] },
  { id: 'etl-engineer', name: 'ETL Engineer', emoji: '🔧', role: '数据抽取与转换', layer: 'L3', layerName: '底座', tools: ['Dagster/Airflow', '数据验证', '增量同步'] },
  { id: 'data-quality-monitor', name: 'Data Quality Monitor', emoji: '📋', role: '数据质量监控', layer: 'L3', layerName: '底座', tools: ['质量规则引擎', '异常检测', '漂移监控'] },
  { id: 'knowledge-graph-builder', name: 'Knowledge Graph Builder', emoji: '🕸️', role: '知识图谱构建', layer: 'L3', layerName: '底座', tools: ['NER', '关系抽取', '图数据库', 'SPARQL'] },
  { id: 'embedding-tuner', name: 'Embedding Tuner', emoji: '🎛️', role: '嵌入模型微调', layer: 'L3', layerName: '底座', tools: ['微调流水线', '评估数据集', '模型压缩', 'ONNX'] },
  { id: 'fulltext-engineer', name: 'Full-text Engineer', emoji: '📖', role: '全文检索优化', layer: 'L3', layerName: '底座', tools: ['Elasticsearch/Meilisearch', '分词器', 'BM25调优'] },
  { id: 'cache-strategist', name: 'Cache Strategist', emoji: '⚡', role: '多级缓存策略', layer: 'L3', layerName: '底座', tools: ['Redis/Memcached', 'CDN', '本地缓存', '穿透防护'] },
  { id: 'log-analyst', name: 'Log Analyst', emoji: '📊', role: '日志分析', layer: 'L3', layerName: '底座', tools: ['日志收集', '模式挖掘', '告警规则', '可视化'] },
  { id: 'data-annotation-manager', name: 'Data Annotation Manager', emoji: '🏷️', role: '数据标注管理', layer: 'L3', layerName: '底座', tools: ['标注平台', '一致性检查', '主动学习'] },
  { id: 'model-evaluator', name: 'Model Evaluator', emoji: '📐', role: '模型性能评估', layer: 'L3', layerName: '底座', tools: ['评估框架', '基准数据集', '统计测试'] },
  { id: 'feature-engineer', name: 'Feature Engineer', emoji: '🔬', role: '特征工程', layer: 'L3', layerName: '底座', tools: ['特征存储', '自动特征工程', '特征重要性'] },
  { id: 'pipeline-scheduler', name: 'Pipeline Scheduler', emoji: '⏰', role: '任务调度', layer: 'L3', layerName: '底座', tools: ['Cron调度', 'DAG依赖', '告警', '回填'] },
  { id: 'harness-engineer', name: 'Harness Engineer', emoji: '🛡️', role: '运行时外骨骼', layer: 'L4', layerName: '治理', tools: ['进程沙箱', 'OpenTelemetry', '检查点恢复', '审计'] },
  { id: 'self-evolution-mentor', name: 'Self-Evolution Mentor', emoji: '🧠', role: '经验蒸馏与终身学习', layer: 'L4', layerName: '治理', tools: ['经验蒸馏', '错误日志', '技能注册表', '自动回归'] },
  { id: 'compliance-officer', name: 'Compliance Officer', emoji: '🔒', role: 'AI安全护栏', layer: 'L4', layerName: '治理', tools: ['实时语义分析', '审计API', '规则引擎'] },
  { id: 'privacy-officer', name: 'Privacy Officer', emoji: '🔏', role: '数据隐私合规', layer: 'L4', layerName: '治理', tools: ['脱敏引擎', '差分隐私', 'GDPR工具'] },
  { id: 'content-moderator', name: 'Content Moderator', emoji: '🕵️', role: '多模态内容审核', layer: 'L4', layerName: '治理', tools: ['文本审核', '图片审核', '水印'] },
  { id: 'watermark-tracer', name: 'Watermark Tracer', emoji: '💧', role: '隐形水印追踪', layer: 'L4', layerName: '治理', tools: ['水印算法', '可追溯性', '盲检测'] },
  { id: 'circuit-breaker', name: 'Circuit Breaker', emoji: '⚡', role: '熔断策略', layer: 'L4', layerName: '治理', tools: ['熔断模式', '降级策略', '健康检查'] },
  { id: 'sandbox-isolator', name: 'Sandbox Isolator', emoji: '📦', role: '代码执行隔离', layer: 'L4', layerName: '治理', tools: ['进程隔离', 'seccomp', '资源限制', '安全策略'] },
  { id: 'audit-trail-officer', name: 'Audit Trail Officer', emoji: '📋', role: '全链路审计', layer: 'L4', layerName: '治理', tools: ['审计日志', '操作回放', '合规检查', '报告'] },
  { id: 'error-diagnostician', name: 'Error Diagnostician', emoji: '🔍', role: '根因分析', layer: 'L4', layerName: '治理', tools: ['日志分析', '调用链追踪', '根因定位', '知识图谱'] },
  { id: 'capacity-planner', name: 'Capacity Planner', emoji: '📈', role: '容量规划', layer: 'L4', layerName: '治理', tools: ['负载预测', '弹性伸缩', '成本模型'] },
  { id: 'cost-optimizer', name: 'Cost Optimizer', emoji: '💰', role: '云成本优化', layer: 'L4', layerName: '治理', tools: ['成本分析', '资源优化', '预算告警'] },
  { id: 'sla-monitor', name: 'SLA Monitor', emoji: '📊', role: '服务级别监控', layer: 'L4', layerName: '治理', tools: ['可用性监控', '延迟追踪', 'SLA报告'] },
  { id: 'disaster-recovery', name: 'Disaster Recovery', emoji: '🔄', role: '灾难恢复', layer: 'L4', layerName: '治理', tools: ['备份策略', '异地灾备', 'RPO/RTO'] },
  { id: 'vulnerability-scanner', name: 'Vulnerability Scanner', emoji: '🛡️', role: '漏洞扫描', layer: 'L4', layerName: '治理', tools: ['SCA扫描', 'CVE数据库', '修复建议', '自动补丁'] },
  { id: 'dependency-manager', name: 'Dependency Manager', emoji: '📦', role: '依赖管理', layer: 'L4', layerName: '治理', tools: ['版本矩阵', '兼容性测试', '升级路径', 'SBOM'] },
  { id: 'license-compliance', name: 'License Compliance', emoji: '📜', role: '开源许可合规', layer: 'L4', layerName: '治理', tools: ['许可扫描', '合规矩阵', '风险评估'] },
  { id: 'i18n-adapter', name: 'i18n Adapter', emoji: '🌍', role: '多语言适配', layer: 'L4', layerName: '治理', tools: ['i18n框架', '翻译管理', '本地化测试', 'RTL'] },
  { id: 'accessibility-officer', name: 'Accessibility Officer', emoji: '♿', role: '无障碍合规', layer: 'L4', layerName: '治理', tools: ['a11y检测', 'ARIA标签', '对比度检查', '键盘导航'] },
  { id: 'carbon-monitor', name: 'Carbon Monitor', emoji: '🌱', role: '碳排放估算', layer: 'L4', layerName: '治理', tools: ['碳模型', '能源分析', '绿色建议'] },
  { id: 'ux-evaluator', name: 'UX Evaluator', emoji: '⭐', role: 'UX质量评估', layer: 'L4', layerName: '治理', tools: ['体验指标', '用户反馈', '启发式评估'] },
  { id: 'feedback-loop-manager', name: 'Feedback Loop Manager', emoji: '🔄', role: '反馈闭环管理', layer: 'L4', layerName: '治理', tools: ['反馈收集', '自动分类', '优先级排序'] },
  { id: 'knowledge-deposition', name: 'Knowledge Deposition', emoji: '📚', role: '知识沉淀', layer: 'L4', layerName: '治理', tools: ['内容捕获', '质量评分', '模板生成', '向量化'] },
  { id: 'ci-guardian', name: 'CI Guardian', emoji: '🏛️', role: 'CI守护者', layer: 'L4', layerName: '治理', tools: ['CI监控', '质量门禁', '安全扫描', '发布审批'] },
]

export const layerNames: Record<string, string> = {
  'L1': '编排',
  'L2': '交付',
  'L3': '底座',
  'L4': '治理',
}

export function getAgentById(id: string): AgentInfo | undefined {
  return agents.find(a => a.id === id)
}

export function getAgentsByLayer(layer: string): AgentInfo[] {
  return agents.filter(a => a.layer === layer)
}

export function getAgentPrompt(id: string): string {
  const agent = getAgentById(id)
  if (!agent) return '你是一位专业的AI助手。'
  
  const toolList = agent.tools.join('、')
  return `你是一位${agent.role}专家，代号${agent.name}。
你的专长领域：${toolList}

请根据你的专业知识，为用户提供专业的${agent.role}服务。
输出格式：先分析需求，然后给出专业的解决方案和具体建议。`
}

// 每个Agent的系统提示词
const agentPrompts: Record<string, string> = {
  analyst: `你是一位资深的需求分析师，专长是将模糊的用户需求拆解为可执行的开发任务。
你的工作流程：
1. 仔细理解用户的原始需求
2. 识别核心功能点和隐含需求
3. 分析技术可行性和风险
4. 制定详细的实现方案和步骤
5. 评估工作量和优先级
输出格式：先用简洁的语言总结需求，然后分点列出技术方案、开发步骤、风险提示。最后请用户确认方案。`,

  'coder-a': `你是一位资深后端工程师，代号Coder-A，专长是Python和FastAPI后端开发。
你的任务：根据需求设计并编写后端核心代码。
要求：
- 代码结构清晰，模块化设计
- 包含完整的类型注解和Docstring
- 遵循PEP8规范
- 提供可直接运行的代码
- 包含错误处理和边界情况处理
输出格式：先说明设计思路，然后给出完整代码，最后说明使用方法。`,

  'coder-b': `你是一位资深全栈工程师，代号Coder-B，专长是API设计和数据库架构。
你的任务：根据需求设计API接口和数据库Schema。
要求：
- RESTful API设计规范
- 数据库表结构合理，索引优化
- 包含完整的增删改查接口
- 统一的响应格式和错误处理
输出格式：先说明设计思路，然后给出API列表、数据库Schema和示例代码。`,

  'coder-c': `你是一位资深前端工程师，代号Coder-C，专长是React + TypeScript前端开发。
你的任务：根据需求开发前端界面和交互逻辑。
要求：
- React函数式组件 + Hooks
- TypeScript类型安全
- 响应式设计，适配移动端
- 优雅的UI和动画效果
输出格式：先说明组件设计，然后给出完整代码，最后说明使用方法。`,

  'coder-d': `你是一位测试工程师，代号Coder-D，专长是单元测试和集成测试。
你的任务：为已开发的代码编写测试用例。
要求：
- 覆盖核心功能和边界情况
- 测试用例命名清晰
- 包含正常场景和异常场景
- 测试代码可直接运行
输出格式：先说明测试策略，然后给出完整测试代码，最后说明运行方式。`,

  'coder-e': `你是一位数据库工程师，代号Coder-E，专长是SQL和数据库优化。
你的任务：设计数据库表结构、索引和优化方案。
要求：
- 符合范式设计
- 合理的索引策略
- 性能优化建议
- 完整的建表SQL
输出格式：先说明设计思路，然后给出完整SQL，最后说明优化建议。`,

  reviewer: `你是一位资深代码审查员，专长是代码质量和最佳实践。
你的任务：审查前面代码员提交的代码。
审查维度：
1. 功能正确性 - 是否实现了需求
2. 代码质量 - 可读性、可维护性
3. 性能 - 有无明显性能问题
4. 安全 - 有无安全隐患
5. 规范性 - 是否符合编码规范
输出格式：逐项评分（1-10分），列出优点和改进建议，最后给出总体评价。`,

  'bug-detector': `你是一位资深Bug检测工程师，专长是发现代码中的潜在问题。
你的任务：深入分析代码，找出可能存在的Bug。
检查项：
- 空指针/未定义异常
- 边界条件处理
- 错误处理完整性
- 并发安全问题
- 内存泄漏风险
- 逻辑错误
输出格式：列出每个发现的Bug，包含：问题描述、影响程度、触发条件、修复建议。`,

  extender: `你是一位技术战略规划师，专长是技术选型和未来扩展规划。
你的任务：为当前项目提供未来发展方向和扩展建议。
建议维度：
1. 功能扩展 - 还可以增加什么功能
2. 技术升级 - 可以引入什么新技术
3. 性能优化 - 如何提升系统性能
4. 架构演进 - 未来架构如何发展
5. 商业化 - 如何变现和运营
输出格式：分短期、中期、长期三个阶段给出建议，每个阶段列出具体方向和理由。`,

  packager: `你是一位项目打包交付工程师，专长是代码整合和文档生成。
你的任务：将前面各阶段的产出整理成完整的交付物。
输出内容：
1. 项目概述和技术栈说明
2. 核心代码文件清单
3. 部署和运行说明
4. 注意事项和已知问题
输出格式：结构化的交付文档，清晰易懂。`,

  deployer: `你是一位运维部署工程师，专长是自动化部署和运维。
你的任务：提供项目的部署方案。
部署方案包括：
1. 环境要求
2. 部署步骤
3. 配置说明
4. 监控和日志
5. 故障排查
输出格式：清晰的操作步骤和命令，确保用户能按步骤完成部署。`,

  'knowledge-manager': `你是一位知识管理工程师，专长是知识沉淀和经验总结。
你的任务：从本次任务中提炼核心知识点，存入知识库。
总结维度：
1. 核心技术点 - 用到了哪些关键技术
2. 最佳实践 - 有什么值得复用的经验
3. 踩坑记录 - 遇到了什么问题，如何解决
4. 相关知识 - 关联的技术领域
输出格式：结构化的知识条目，包含标题、内容摘要、关键词标签。`,
}

export interface LLMConfig {
  apiKey: string
  model: string
  temperature: number
  maxTokens: number
}

function getConfig(): LLMConfig | null {
  try {
    const stored = localStorage.getItem('hopeai-llm-config')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // ignore
  }
  return null
}

export function saveLLMConfig(config: LLMConfig) {
  localStorage.setItem('hopeai-llm-config', JSON.stringify(config))
}

export function clearLLMConfig() {
  localStorage.removeItem('hopeai-llm-config')
}

/**
 * 从后端API搜索知识
 */
async function searchBackendKnowledge(query: string, topK: number = 3): Promise<Array<{title: string, content: string, score: number}>> {
  try {
    const response = await fetch(`/api/knowledge/search?q=${encodeURIComponent(query)}&limit=${topK}`)
    if (!response.ok) return []
    const data = await response.json()
    if (!data.success || !Array.isArray(data.data)) return []
    return data.data.map((item: any) => ({
      title: item.title || '',
      content: item.content || '',
      score: item.score || 0
    }))
  } catch {
    return []
  }
}

/**
 * RAG检索：从本地知识库+后端API获取相关知识作为上下文
 */
async function getRAGContext(command: string, topK: number = 3): Promise<string> {
  try {
    // 并行：本地检索 + 后端API检索
    const localEntries = useKnowledgeStore.getState().entries
    const backendResults = await searchBackendKnowledge(command, topK)

    const cmdLower = command.toLowerCase()
    const cmdWords = cmdLower.split(/[\s,，。、！？]+/).filter(w => w.length > 1)

    // 本地检索打分
    const localScored = localEntries.map(entry => {
      let score = 0
      const titleLower = entry.title.toLowerCase()
      const contentLower = entry.content.toLowerCase()
      const tagsLower = entry.tags.map(t => t.toLowerCase()).join(' ')

      for (const word of cmdWords) {
        if (titleLower.includes(word)) score += 3
        if (tagsLower.includes(word)) score += 2
        if (contentLower.includes(word)) score += 1
      }

      for (const tag of entry.tags) {
        if (cmdLower.includes(tag.toLowerCase()) && tag.length > 1) score += 2
      }

      return { title: entry.title, content: entry.content, score }
    }).filter(s => s.score > 0)

    // 合并本地和后端结果，去重（按标题）
    const seen = new Set<string>()
    const merged: Array<{title: string, content: string, score: number}> = []

    // 后端结果优先（通常更精准）
    for (const item of backendResults) {
      if (!seen.has(item.title)) {
        seen.add(item.title)
        merged.push(item)
      }
    }

    // 补充本地结果
    for (const item of localScored.sort((a, b) => b.score - a.score)) {
      if (!seen.has(item.title) && merged.length < topK * 2) {
        seen.add(item.title)
        merged.push(item)
      }
    }

    const final = merged.slice(0, topK)
    if (final.length === 0) return ''

    const refs = final.map((s, i) => {
      return `参考资料${i + 1}（${s.title}）：\n${s.content.slice(0, 800)}`
    }).join('\n\n')

    return `\n\n以下是知识库中的相关资料，供你参考：\n${refs}\n`
  } catch {
    return ''
  }
}

/**
 * 调用Kimi API生成回答
 */
export async function callKimi(
  agentId: string,
  command: string,
  context?: string,
  chatStyle: string = 'professional'
): Promise<string> {
  const config = getConfig()
  if (!config || !config.apiKey) {
    throw new Error('未配置Kimi API Key，请在"我的"页面设置')
  }

  let systemPrompt = agentPrompts[agentId]
  if (!systemPrompt) {
    systemPrompt = getAgentPrompt(agentId)
  }
  const ragContext = await getRAGContext(command, 3)

  const styleModifiers: Record<string, string> = {
    professional: '请使用专业、严谨的语气回答，保持技术专业性，语言简练准确。',
    warm: '请使用亲切、温暖、共情的语气回答，让用户感受到关怀和支持。',
    humorous: '请使用轻松、幽默、风趣的语气回答，可以适当加入幽默元素和表情。',
    minimal: '请使用极简、高效的方式回答，直接给出要点和关键信息，避免冗长。',
    creative: '请使用富有创意和想象力的方式回答，可以提出新颖的思路和方案。',
  }

  const messages = [
    { role: 'system', content: systemPrompt + '\n\n' + (styleModifiers[chatStyle] || styleModifiers.professional) + ragContext },
  ]

  if (context) {
    messages.push({ role: 'system', content: `上下文信息：\n${context}` })
  }

  messages.push({ role: 'user', content: command })

  const response = await fetch(KIMI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || 'moonshot-v1-8k',
      messages,
      temperature: config.temperature ?? 0.7,
      max_tokens: config.maxTokens || 2000,
    }),
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    const errMsg = errData?.error?.message || `API调用失败 (${response.status})`
    throw new Error(errMsg)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content || ''
  return content
}
