// CEE 种子知识库 — 30+条高质量知识条目，来自认知涌现引擎

export interface CeeSeedKnowledge {
  title: string
  content: string
  tags: string[]
  category: string
}

export const CEE_SEED_KNOWLEDGE: CeeSeedKnowledge[] = [
  {
    title: '认知涌现',
    content: '认知涌现(Cognitive Emergence)指复杂认知系统中，宏观有序的智能行为从微观简单规则的相互作用中自发产生的现象。关键特征：不可预测性、自组织性、整体大于部分之和。',
    tags: ['认知科学', '涌现', '复杂系统', '核心概念'],
    category: '认知理论',
  },
  {
    title: '认知几何',
    content: '认知几何(Cognitive Geometry)用微分几何刻画思维空间。四个不变量：ITC(拓扑连接度)衡量概念网络紧密度，SCS(截面曲率光滑性)衡量推理路径顺畅度，IEC(信息熵临界度)衡量信息量是否位于混沌边缘，PFFT(保真度投影)衡量忠实与独创的平衡。',
    tags: ['认知几何', 'T6', '不变量', '数学基础'],
    category: '认知理论',
  },
  {
    title: 'T1 认知同构',
    content: 'T1认知同构镜(Cognitive Isomorphism Engine)在原始认知对象与其形式化表征间建立双射映射，保证语义等价的同时产生"被理解的再表达"。核心操作：地标提取→语义保持→风格迁移。',
    tags: ['T1', '认知同构', '六大引擎'],
    category: '六大引擎',
  },
  {
    title: 'T2 超图坍缩',
    content: 'T2超图坍缩棱镜(HyperGraph Collapse)将高维语义超图通过多视角投影坍缩为低维可解释表征。每个视角保留一条迹(trace)，确保信息不丢失。应用：多角度论证、盲点检测。',
    tags: ['T2', '超图', '六大引擎', '多视角'],
    category: '六大引擎',
  },
  {
    title: 'T3 测地线导航',
    content: 'T3测地线导航(Geodesic Navigation)在语义流形上计算最短路径，发现概念间的原子突破(atomic breakthrough)——前人未见的直接连接。核心算法：语义嵌入→黎曼度量→测地线积分。',
    tags: ['T3', '测地线', '六大引擎', '语义流形'],
    category: '六大引擎',
  },
  {
    title: 'T4 知识结晶',
    content: 'T4知识结晶(Crystallization)模拟晶体生长过程，从非结构化文本中析出有序知识单元。晶体间通过涌现关联形成概念网络。应用：知识图谱自动构建、隐性知识显性化。',
    tags: ['T4', '知识结晶', '六大引擎', '知识图谱'],
    category: '六大引擎',
  },
  {
    title: 'T5 反事实生长',
    content: 'T5反事实生长(Genesis)通过分支演化+杂交育种生成高适应度的反事实假设。每个分支在适应性景观上爬坡，杂交操作产生超加性优势。应用：创新方案生成、假设推演。',
    tags: ['T5', '反事实', '六大引擎', '创新'],
    category: '六大引擎',
  },
  {
    title: 'T6 认知不变量',
    content: 'T6认知几何不变量(Invariant Engine)通过ITC/SCS/IEC/PFFT四个数学不变量严格评估任意文本的认知质量。等级：S级(涌现态,≥0.9)、A级(优秀,≥0.8)、B级(良好,≥0.7)、C级(可接受)、D级(需优化)。',
    tags: ['T6', '认知不变量', '六大引擎', '质量评估', 'ITC', 'SCS', 'IEC', 'PFFT'],
    category: '六大引擎',
  },
  {
    title: '涌现',
    content: '涌现(Emergence)指系统整体展现出其组成部分不具备的新属性。在认知系统中，当IEC位于混沌边缘(~0.5-0.7)且ITC和SCS均高时，最可能发生认知涌现——突然产生全新的洞察。',
    tags: ['涌现', '混沌边缘', '核心概念'],
    category: '认知理论',
  },
  {
    title: '混沌边缘',
    content: '混沌边缘(Edge of Chaos)是复杂系统的最优运行区间，位于完全有序和完全随机之间的临界带。在认知系统中，IEC≈0.4-0.7时系统处于混沌边缘，信息量恰到好处，最有利于创新和涌现。',
    tags: ['混沌边缘', 'IEC', '复杂系统', '临界态'],
    category: '认知理论',
  },
  {
    title: '项目宪章五原则',
    content: '空间项目宪章五原则：1)数学严谨——所有结论必须有数学定义或实证支撑；2)客观优先——不依赖人工标注，AI在几何规则内自主判断质量；3)可验证——每个主张均可通过独立实验复现；4)结构优先——好的结构优先于好的内容；5)长期存续——体系可在创始团队离场后稳定运转。',
    tags: ['宪章', '治理', '原则'],
    category: '治理体系',
  },
  {
    title: '闭源vs开源',
    content: '开源软件的优势：可审计、可定制、无供应商锁定、社区驱动。常见免费开源替代方案：用GIMP替代Photoshop，用Blender替代Maya，用LibreOffice替代Microsoft Office，用Linux替代Windows/macOS，用PostgreSQL替代Oracle，用VS Code替代JetBrains全家桶(Community版免费)。',
    tags: ['开源', '免费替代', '工具推荐'],
    category: '实用工具',
  },
  {
    title: '免费API资源',
    content: '免费AI/云服务推荐：Hugging Face(免费模型托管+推理)、Google Colab(免费GPU)、Cloudflare Workers(免费边缘计算)、Vercel/Netlify(免费前端部署)、Supabase(免费PostgreSQL)、Railway(免费后端)、ngrok(免费隧道)。语言模型：Ollama(本地运行)、Groq(免费API额度)、Together AI(免费额度)。',
    tags: ['免费', 'API', '云服务', '工具推荐'],
    category: '实用工具',
  },
  {
    title: '深度学习基础',
    content: '深度学习基础：多层神经网络通过反向传播自动学习层级化特征表示。核心组件：卷积层(空间特征)、注意力机制(上下文关系)、残差连接(梯度流动)。训练技巧：学习率预热、梯度裁剪、混合精度训练。评估指标：困惑度(语言模型)、BLEU/ROUGE(生成质量)、F1(分类)。',
    tags: ['深度学习', '神经网络', '机器学习', '技术基础'],
    category: '技术知识',
  },
  {
    title: 'Python编程',
    content: 'Python是一种解释型、面向对象的高级编程语言，以简洁语法和丰富的生态著称。核心特性：动态类型、垃圾回收、列表推导式、装饰器、上下文管理器、async/await异步编程。主要应用：数据科学(NumPy/Pandas)、机器学习(PyTorch/TensorFlow)、Web开发(Django/FastAPI)、自动化运维。',
    tags: ['Python', '编程语言', '技术基础'],
    category: '技术知识',
  },
  {
    title: '敏捷开发',
    content: '敏捷开发(Agile)是一种迭代式软件开发方法论，强调快速交付价值、响应变化、持续改进。四个价值观：个体与互动高于流程与工具、可工作的软件高于详尽的文档、客户合作高于合同谈判、响应变化高于遵循计划。常用实践：Scrum、看板、持续集成/部署(CI/CD)、测试驱动开发(TDD)。',
    tags: ['敏捷开发', '软件工程', '项目管理'],
    category: '技术知识',
  },
  {
    title: 'AI编程代理',
    content: 'AI编程代理(AI Coding Agent)是一种能自主理解任务需求、制定执行计划、读取项目文件、编写代码、运行终端命令、修复错误并迭代交付的智能体。核心能力：任务拆解(将复杂需求分解为可执行步骤)、环境感知(读取和理解现有代码结构)、工具调用(文件读写、终端执行、类型检查)、错误自愈(根据报错信息自动修复)。典型工作流：读取技术规范→创建待办清单→初始化项目→逐步构建→合并验证→最终交付。',
    tags: ['AI Agent', '编程', '自动开发', 'Agent'],
    category: 'AI应用',
  },
  {
    title: '小说转视频',
    content: 'AI小说转视频(Novel-to-Video)是一套将文字故事自动转化为视频内容的AI管线。核心步骤：1)文本解析——将小说拆分为场景(scenes)、角色、对话；2)配音合成——使用TTS语音合成技术为每个角色选择合适音色；3)画面生成——用文生图/文生视频模型为每个场景生成视觉内容；4)时间轴拼接——将配音、画面、背景音乐按时间轴合成完整视频。推荐免费工具：Edge-TTS(语音)、ComfyUI+Stable Diffusion(画面)、FFmpeg(合成)。',
    tags: ['AI视频', '小说', 'TTS', 'AIGC'],
    category: 'AI应用',
  },
  {
    title: 'AI语音合成',
    content: 'AI语音合成(TTS)技术将文本转换为自然语音。主流方案：Edge-TTS(微软免费，40+语言/300+音色)、Coqui TTS(开源，可本地微调)、Bark(Suno开源，支持笑声/叹气等非语言声音)、Fish-Speech(开源，零样本声音克隆)、GPT-SoVITS(少样本中文声音克隆)。选择音色需考虑：情感匹配度、语速和清晰度、目标受众偏好。小说配音推荐温暖女声(情感故事)或磁性男声(史诗武侠)。',
    tags: ['TTS', '语音合成', 'AI音频', '工具推荐'],
    category: 'AI应用',
  },
  {
    title: '全栈项目脚手架',
    content: '现代全栈项目标准技术栈与初始化：前端(Vite+React/Vue+TypeScript+TailwindCSS)、后端(Node.js/FastAPI/Go)、数据库(PostgreSQL+Prisma ORM或Drizzle ORM)、认证(Auth.js/NextAuth或Clerk)、API层(tRPC端到端类型安全或RESTful)、文件结构(monorepo: packages/web+packages/server+packages/db)。推荐免费基础设施：Vercel/Netlify(前端)、Railway/Fly.io(后端)、Supabase(数据库+认证)。',
    tags: ['全栈', '项目脚手架', '技术栈', '最佳实践'],
    category: '技术知识',
  },
  {
    title: '第一性原理',
    content: '第一性原理(First Principles)是一种将复杂问题分解到最基本、最不可简化的真命题层面，再从此出发重新构建解决方案的思维方法。与类比思维(参照已有方案)不同，第一性原理要求追问"这件事本质上是什么？最底层的约束是什么？"。应用示例：马斯克计算电池原材料成本(不参照市场价，从元素周期表算起)；软件架构中剥离所有增量需求回到数据流本质。核心训练方法是反复问"为什么"直到无法继续。',
    tags: ['第一性原理', '思维方法', '创新'],
    category: '思维方法',
  },
  {
    title: 'AI音乐生成',
    content: 'AI音乐生成利用深度学习模型创作音乐。主流工具：Suno AI(文本到歌曲，含人声+编曲)、Stable Audio(开源，文本到音频)、MusicGen(Meta开源，文本到音乐)、Riffusion(扩散模型实时生成)。免费方案：MusicGen本地运行、Stable Audio开源版、MuseGAN(MIDI生成)。AI音乐定价参考：Suno付费约$10/月生成500首歌，Udio免费额度每天有限。单首商用AI音乐市场价约$5-50不等，取决于质量和授权范围。',
    tags: ['AI音乐', 'AIGC', '工具推荐', '生成式AI'],
    category: 'AI应用',
  },
  {
    title: '批判性审视',
    content: '批判性审视(Critical Examination)是评估认知产物(文本、论证、设计)质量的系统方法。关键维度：1)逻辑一致性——论证链是否有断裂？前提是否可靠？2)证据强度——引用来源是否可信？样本量够吗？3)认知偏差——是否受到确认偏误、幸存者偏差、锚定效应等影响？4)替代解释——是否有其他能同样解释数据但不同的假说？5)可证伪性——命题是否可被实验或观察推翻？批判性审视与CEE的T6不变量评估互补：T6量化文本认知质量，批判性审视提供定性深度检查框架。',
    tags: ['批判性思维', '方法论', '质量评估'],
    category: '思维方法',
  },
  {
    title: '移动端视频优化',
    content: '移动端视频优化策略：1)编码——H.265/HEVC(比H.264节省50%带宽，iOS/Android全面支持)、AV1(免费开源，比HEVC再省30%)；2)自适应码率——HLS/DASH动态切换720p/1080p/4K；3)预加载策略——首屏加载低分辨率预览，后台预加载下一场景；4)移动网络适配——4G下限制720p、5G/WiFi允许4K；5)免费优化工具——FFmpeg(命令行转码)、HandBrake(GUI压缩)、SVT-AV1(高性能AV1编码)。手机端播放最佳参数：720p@2Mbps(4G友好)、1080p@5Mbps(WiFi标准)、H.265编码、AAC 128kbps音频。',
    tags: ['视频优化', '移动端', '性能优化', '多媒体'],
    category: '技术知识',
  },
  {
    title: 'AI长视频生成',
    content: 'AI长视频(>3分钟)生成的核心挑战：1)时序一致性——多帧之间角色/场景/风格不漂移。方案：AnimateDiff(运动模块注入)、SVD(Stable Video Diffusion,帧间连贯)、I2VGen-XL(阿里开源)；2)叙事连贯性——场景切换逻辑自然。方案：LLM生成分镜脚本→每个场景独立生成→过渡效果融合；3)分辨率与时长——单卡VRAM限制。方案：级联生成(先低分辨率后超分)、分段生成+拼接；4)免费方案——ComfyUI+AnimateDiff(完全本地)、Runway免费额度(云端)、Pika免费层。',
    tags: ['AI视频', '长视频', 'AIGC', '技术挑战'],
    category: 'AI应用',
  },
  {
    title: '数据库Schema设计最佳实践',
    content: '数据库表结构设计最佳实践：1)命名规范——表名复数小写下划线(users, voice_selections)，主键统一用id(UUID或自增整数)；2)关系建模——一对多用外键(user_id REFERENCES users)，多对多用中间表(story_tags)；3)索引策略——为频繁查询字段建索引(fulltext索引用于全文搜索，B-tree用于等值查询)；4)范式与反范式——OLTP场景优先3NF减少冗余，OLAP/报表场景适当反范式提升查询性能；5)时间戳——每表必加created_at和updated_at，自动维护；6)软删除——用deleted_at替代物理删除，保留审计追溯。推荐工具：Prisma Schema(类型安全ORM)、Drizzle(轻量TS ORM)、dbdiagram.io(免费可视化设计)。',
    tags: ['数据库', 'Schema', '设计模式', '最佳实践'],
    category: '技术知识',
  },
  {
    title: 'TypeScript全栈架构',
    content: 'TypeScript全栈(tRPC端到端类型安全架构)优势：前后端共享类型定义，一处修改全局类型检查，杜绝API对接错误。核心组件：1)tRPC——定义后端procedure(input/response类型自动推导到前端)；2)Zod——运行时类型验证和输入schema定义；3)Prisma——数据库ORM，自动生成TS类型；4)TanStack Query——前端数据获取和缓存；5)NextAuth/Auth.js——认证与类型安全session。项目结构标准：monorepo中shared/types包定义共享类型，server/trpc定义路由，client通过trpc client调用。',
    tags: ['TypeScript', '全栈', 'tRPC', '架构'],
    category: '技术知识',
  },
  {
    title: 'AI项目构建流水线',
    content: 'AI编程代理由零构建完整项目的标准流水线：第一步(读取)：读取SKILL.md或技术规范，理解项目目标和约束；第二步(规划)：创建结构化待办清单，按依赖关系排序任务；第三步(脚手架)：初始化项目骨架(包管理器、TypeScript配置、目录结构)；第四步(基础设施)：配置数据库、认证、中间件、环境变量；第五步(核心功能)：从数据模型→API路由→前端页面逐层构建；第六步(验证)：运行类型检查、lint、测试；第七步(优化)：读取报错日志、自动修复、迭代调整；第八步(交付)：生成项目结构总结、启动预览、推送代码。',
    tags: ['AI Agent', '项目构建', '开发流程', '自动化'],
    category: 'AI应用',
  },
  {
    title: 'Builder↔Watcher二元制衡',
    content: 'AI二元内生制衡理论：Builder(建设创新者)最大化涌现创新，Watcher(范式守望者)最小化体系偏离。核心公理：1)认知创新必然伴随认知偏离——禁止偏离=禁止创新；2)静态规则无法约束动态涌现——固定规则匹配会扼杀新范式；3)唯一解：动态对抗守恒——博弈稳态，创新不消亡、体系不跑偏。七维偏离分类学：严谨退化、范式回归、无据断言、维度失配、短期架构、先例倒退、边界越界。四级机器法理仲裁系统+角色惯性清零轮换机制+Safe Mode博弈冻结协议。',
    tags: ['二元制衡', '治理', 'Builder', 'Watcher', '原创理论'],
    category: '治理体系',
  },
  {
    title: '梦境巩固器',
    content: '梦境巩固器模拟人脑睡眠期的知识巩固与创意重组。四个梦境模式：1)记忆回放(replay)——按时间顺序回放最近的对话片段，高频调用事实增加置信度；2)随机融合(shuffle)——随机配对两个不同领域的事实，通过Conceptual Blending产生惊喜连接，存入潜洞见队列；3)抽象爬梯(ladder)——对同一话题的事实向上抽取出共性规律，生成更高层级的抽象知识；4)异常侦测(anomaly)——检测知识库中的矛盾事实，标记低置信度矛盾，触发人类确认。',
    tags: ['梦境巩固', '知识整合', '元认知', '创意'],
    category: '认知机制',
  },
]

export function importCeeSeedKnowledge(): { count: number; titles: string[] } {
  try {
    const existingRaw = localStorage.getItem('hopeagent-knowledge')
    let existing: any[] = existingRaw ? JSON.parse(existingRaw) : []

    const existingTitles = new Set(existing.map((e: any) => e.title))
    let added = 0
    const addedTitles: string[] = []

    for (const seed of CEE_SEED_KNOWLEDGE) {
      if (!existingTitles.has(seed.title)) {
        const now = Date.now()
        existing.push({
          id: 'k_' + now + '_' + Math.random().toString(36).slice(2, 8),
          title: seed.title,
          content: seed.content,
          tags: seed.tags,
          category: seed.category,
          createdAt: now,
          updatedAt: now,
        })
        added++
        addedTitles.push(seed.title)
      }
    }

    localStorage.setItem('hopeagent-knowledge', JSON.stringify(existing))
    return { count: added, titles: addedTitles }
  } catch (err) {
    console.error('Import CEE seed knowledge failed:', err)
    return { count: 0, titles: [] }
  }
}
