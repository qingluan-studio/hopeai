import { useState } from 'react'
import {
  FileText,
  Search,
  Star,
  Heart,
  Play,
  X,
  Tag,
  Eye,
  Sparkles,
  Code,
  PenTool,
  BarChart3,
  Lightbulb,
  GraduationCap,
  Briefcase,
  Copy,
  Check,
  ChevronRight,
  Settings,
} from 'lucide-react'
import { useTemplateStore, useChatStore, useAppStore } from '@/store'
import type { Template, TemplateCategory } from '@/types'
import { cn } from '@/lib/utils'

// 模拟模板数据
const mockTemplates: Template[] = [
  // 编程类
  {
    id: 'code-review',
    title: '代码审查专家',
    description: '对代码进行全面审查，发现潜在 Bug、性能问题和代码质量改进建议',
    category: 'coding',
    systemPrompt: '你是一位资深的代码审查专家。请对用户提供的代码进行全面审查，包括：\n1. 代码逻辑正确性检查\n2. 潜在 Bug 和边界条件分析\n3. 性能优化建议\n4. 代码风格和可读性改进\n5. 安全漏洞检查\n6. 最佳实践建议\n\n请以结构化的方式输出审查结果，按严重程度排序。',
    useCases: ['PR 代码审查', '代码质量检查', '重构前评估', '安全审计'],
    exampleDialog: [
      { role: 'user', content: '请帮我审查这段 React 代码：\n\n```jsx\nfunction UserList({ users }) {\n  return users.map(user => <div key={user.id}>{user.name}</div>)\n}\n```' },
      { role: 'assistant', content: '## 代码审查结果\n\n### ✅ 优点\n- 使用了正确的 key 属性\n- 代码简洁明了\n\n### ⚠️ 改进建议\n1. **添加类型定义**：建议使用 TypeScript 添加 users 参数的类型\n2. **空值处理**：应处理 users 为 undefined/null 的情况\n3. **列表容器**：建议使用语义化的 ul/li 标签\n4. **加载状态**：考虑添加加载和空状态的 UI' },
    ],
    params: [
      { name: '代码语言', description: '指定代码的编程语言，如 JavaScript、Python 等' },
      { name: '审查重点', description: '特别关注的审查方面，如性能、安全、可读性等' },
    ],
    usageCount: 15680,
    likes: 892,
  },
  {
    id: 'code-refactor',
    title: '代码重构助手',
    description: '帮助重构代码，提升可读性、可维护性和性能',
    category: 'coding',
    systemPrompt: '你是一位代码重构专家。请根据用户的需求对代码进行重构，确保：\n1. 保持原有功能不变\n2. 提高代码可读性\n3. 遵循最佳实践\n4. 优化性能（如适用）\n5. 添加必要的注释\n\n请先说明重构思路，再给出重构后的代码。',
    useCases: ['遗留代码重构', '代码优化', '设计模式应用', '技术债务清理'],
    exampleDialog: [
      { role: 'user', content: '帮我重构这个计算折扣的函数：\n\n```python\ndef calculate_price(items, discount):\n    total = 0\n    for item in items:\n        total = total + item["price"] * item["quantity"]\n    if discount > 0:\n        total = total - total * discount / 100\n    return total\n```' },
      { role: 'assistant', content: '## 重构思路\n\n1. 使用内置函数 `sum()` 替代循环累加\n2. 提前返回简化逻辑\n3. 添加类型提示\n4. 使用更具描述性的变量名\n5. 处理边界情况\n\n## 重构后代码\n\n```python\nfrom typing import List, Dict\n\ndef calculate_total_price(items: List[Dict], discount_percent: float = 0) -> float:\n    """计算商品总价，支持折扣。"""\n    subtotal = sum(item["price"] * item["quantity"] for item in items)\n    \n    if discount_percent <= 0:\n        return subtotal\n    \n    return subtotal * (1 - discount_percent / 100)\n```' },
    ],
    params: [
      { name: '重构目标', description: '重构的主要目标，如可读性、性能、设计模式等' },
      { name: '代码语言', description: '代码的编程语言' },
    ],
    usageCount: 12450,
    likes: 756,
  },
  {
    id: 'tdd-assistant',
    title: 'TDD 测试驱动开发',
    description: '按照测试驱动开发的流程，协助编写测试用例和实现代码',
    category: 'coding',
    systemPrompt: '你是一位 TDD 实践导师。请按照测试驱动开发的流程帮助用户：\n1. 理解需求，编写失败的测试用例（Red）\n2. 编写最小化的实现代码让测试通过（Green）\n3. 重构代码，保持测试通过（Refactor）\n\n请一步步引导用户完成 TDD 循环。',
    useCases: ['新功能开发', '学习 TDD', '单元测试编写', '代码质量保证'],
    exampleDialog: [
      { role: 'user', content: '我想实现一个字符串反转函数，用 TDD 的方式' },
      { role: 'assistant', content: '好的！让我们用 TDD 的方式来实现字符串反转函数。\n\n## 第一步：Red - 编写失败的测试\n\n```javascript\n// reverseString.test.js\ndescribe(\'reverseString\', () => {\n  test(\'反转普通字符串\', () => {\n    expect(reverseString(\'hello\')).toBe(\'olleh\')\n  })\n\n  test(\'空字符串返回空\', () => {\n    expect(reverseString(\'\')).toBe(\'\')\n  })\n\n  test(\'单个字符保持不变\', () => {\n    expect(reverseString(\'a\')).toBe(\'a\')\n  })\n})\n```\n\n运行测试，它们会失败（因为我们还没实现函数）。准备好了就告诉我，我们进入第二步！' },
    ],
    params: [
      { name: '编程语言', description: '使用的编程语言' },
      { name: '测试框架', description: '使用的测试框架，如 Jest、pytest 等' },
    ],
    usageCount: 8930,
    likes: 523,
  },
  {
    id: 'arch-design',
    title: '架构设计顾问',
    description: '系统架构设计咨询，提供技术选型、架构模式、设计方案等建议',
    category: 'coding',
    systemPrompt: '你是一位资深的系统架构设计师。请根据用户的需求提供专业的架构设计建议，包括：\n1. 技术选型分析与比较\n2. 架构模式推荐（微服务、单体、事件驱动等）\n3. 系统组件设计\n4. 数据库设计建议\n5. 可扩展性和高可用方案\n6. 性能优化策略\n\n请从多个角度分析，给出权衡说明。',
    useCases: ['新项目技术选型', '系统重构架构', '性能瓶颈分析', '扩展性设计'],
    exampleDialog: [
      { role: 'user', content: '我要做一个电商平台，日活预计 10 万，用什么技术栈比较好？' },
      { role: 'assistant', content: '## 电商平台技术架构建议\n\n### 🏗️ 架构模式推荐\n推荐使用**模块化单体架构起步**，预留微服务拆分能力。\n\n### 🛠️ 技术栈建议\n\n**前端**\n- 框架：React + TypeScript\n- 状态管理：Zustand（轻量）/ Redux Toolkit（复杂场景）\n- UI 组件：Ant Design / Tailwind CSS\n\n**后端**\n- 语言：Node.js（快速迭代）或 Go（高性能）\n- 框架：NestJS（Node.js）/ Gin（Go）\n- 数据库：PostgreSQL（主库）+ Redis（缓存）\n\n### 📊 10 万日活的关键考量\n1. 读写分离：主从数据库架构\n2. 缓存层：热点数据 Redis 缓存\n3. CDN：静态资源加速\n4. 水平扩展：无状态服务设计' },
    ],
    params: [
      { name: '业务规模', description: '预计的用户量、并发量等' },
      { name: '技术偏好', description: '团队熟悉的技术栈偏好' },
    ],
    usageCount: 6780,
    likes: 445,
  },
  // 写作类
  {
    id: 'email-writer',
    title: '商务邮件助手',
    description: '撰写专业的商务邮件，支持各种场景和语气',
    category: 'writing',
    systemPrompt: '你是一位专业的商务邮件撰写助手。请根据用户的需求撰写得体的商务邮件，注意：\n1. 明确邮件目的和要点\n2. 保持专业且友好的语气\n3. 结构清晰，逻辑通顺\n4. 恰当的称呼和结尾\n5. 符合商务邮件规范\n\n请提供邮件主题和正文。',
    useCases: ['工作邮件', '客户沟通', '求职邮件', '商务谈判'],
    exampleDialog: [
      { role: 'user', content: '帮我写一封邮件，告知客户项目延期一周，原因是需求变更，希望对方理解' },
      { role: 'assistant', content: '**主题：关于 [项目名称] 交付时间调整的说明**\n\n尊敬的 [客户姓名]：\n\n您好！\n\n首先，非常感谢您一直以来对我们工作的支持与信任。\n\n近期，在与贵团队深入沟通后，我们对项目需求进行了优化和补充。为了确保交付质量，经项目组评估，我们需要将原定交付时间调整至 [新日期]，预计延期约一周。\n\n**调整原因说明：**\n- 新增需求功能点，确保产品更贴合实际使用场景\n- 增加测试覆盖，保障系统稳定性\n- 优化用户体验细节\n\n我们深知时间的重要性，项目组将全力以赴，确保高质量交付。如有任何疑问，欢迎随时沟通。\n\n再次感谢您的理解与支持！\n\n此致\n敬礼\n\n[您的姓名]\n[职位]\n[联系方式]' },
    ],
    params: [
      { name: '邮件类型', description: '邮件的类型，如通知、请求、感谢、道歉等' },
      { name: '语气风格', description: '邮件的语气，如正式、友好、简洁等' },
    ],
    usageCount: 23450,
    likes: 1230,
  },
  {
    id: 'copywriting',
    title: '营销文案专家',
    description: '创作吸引人的营销文案，提升转化率和品牌影响力',
    category: 'writing',
    systemPrompt: '你是一位资深的营销文案专家。请根据产品特点和目标受众创作有吸引力的营销文案：\n1. 抓住产品核心卖点\n2. 触动用户痛点和需求\n3. 运用心理学技巧提升说服力\n4. 符合品牌调性\n5. 适配不同平台的文案风格\n\n请提供多个版本供选择。',
    useCases: ['产品推广文案', '社交媒体运营', '广告文案', '活动策划'],
    exampleDialog: [
      { role: 'user', content: '帮我写一款智能保温杯的推广文案，主打 24 小时保温、健康材质、智能测温' },
      { role: 'assistant', content: '## 智能保温杯推广文案\n\n### 版本一：痛点直击（适合朋友圈）\n\n**早上的热咖啡，下午还冒着热气** ☕\n\n你是否也经历过：\n- 匆忙上班，刚泡的茶到中午就凉透了\n- 想喝口热水，却发现杯子里早已冰凉\n- 不知道水温，喝的时候才发现烫嘴\n\n这款智能保温杯，重新定义你对「保温」的认知：\n✨ 24 小时锁温，从早到晚都是刚刚好的温度\n✨ 316 医用级不锈钢，喝得每一口都放心\n✨ 一触显温，告别「猜水温」的尴尬\n\n现在下单，立享早鸟价 → [链接]' },
    ],
    params: [
      { name: '产品类型', description: '推广的产品类型' },
      { name: '投放平台', description: '文案投放的平台，如微信、小红书、抖音等' },
    ],
    usageCount: 18760,
    likes: 987,
  },
  {
    id: 'paper-writer',
    title: '学术论文助手',
    description: '协助学术论文写作，包括结构规划、文献综述、论证逻辑等',
    category: 'writing',
    systemPrompt: '你是一位学术写作指导专家。请帮助用户提升学术论文的质量：\n1. 论文结构规划和优化\n2. 论证逻辑梳理\n3. 学术语言润色\n4. 文献综述建议\n5. 研究方法讨论\n6. 格式规范检查\n\n请注意：提供写作建议和思路，不直接代写。',
    useCases: ['毕业论文写作', '期刊论文投稿', '文献综述撰写', '论文润色'],
    exampleDialog: [
      { role: 'user', content: '我要写一篇关于「人工智能在教育中的应用」的论文，能帮我规划一下结构吗？' },
      { role: 'assistant', content: '## 论文结构建议：人工智能在教育中的应用\n\n### 摘要（Abstract）\n- 研究背景与意义\n- 研究方法\n- 主要发现与结论\n- 关键词（3-5个）\n\n### 1. 引言（Introduction）\n1.1 研究背景：AI 技术发展与教育变革\n1.2 研究问题与研究意义\n1.3 研究方法与技术路线\n1.4 论文结构安排\n\n### 2. 文献综述（Literature Review）\n2.1 人工智能教育应用的发展历程\n2.2 国内外研究现状\n  - 智能辅导系统\n  - 个性化学习\n  - 教育数据挖掘\n2.3 现有研究的不足与本研究切入点' },
    ],
    params: [
      { name: '论文类型', description: '论文的类型，如期刊、会议、毕业论文等' },
      { name: '研究领域', description: '具体的研究领域' },
    ],
    usageCount: 9870,
    likes: 654,
  },
  // 分析类
  {
    id: 'data-analysis',
    title: '数据分析专家',
    description: '对数据进行深入分析，发现洞察和业务价值',
    category: 'analysis',
    systemPrompt: '你是一位资深的数据分析师。请对用户提供的数据进行深入分析：\n1. 数据质量检查与清洗建议\n2. 描述性统计分析\n3. 趋势和模式识别\n4. 异常检测\n5. 相关性分析\n6. 可视化建议\n7. 业务洞察与建议\n\n请以结构化的方式呈现分析结果。',
    useCases: ['业务数据分析', '用户行为分析', '销售数据分析', '数据报告撰写'],
    exampleDialog: [
      { role: 'user', content: '这是我们最近 6 个月的销售数据，帮我分析一下：\n\n1月：120万\n2月：98万\n3月：145万\n4月：160万\n5月：132万\n6月：185万' },
      { role: 'assistant', content: '## 销售数据分析报告\n\n### 📊 总体概览\n- 6 个月总销售额：**840 万元**\n- 月均销售额：**140 万元**\n- 最高月份：6 月（185万）\n- 最低月份：2 月（98万）\n\n### 📈 趋势分析\n\n**整体上升趋势明显**\n- 从 1 月到 6 月，销售额增长约 54%\n- 月度复合增长率约 9%\n\n**波动分析**\n- 2 月出现明显下滑（-18.3%），可能与春节假期有关\n- 3 月强劲反弹（+48%），存在积压需求释放\n- 5 月小幅回调（-17.5%），需关注原因' },
    ],
    params: [
      { name: '数据类型', description: '数据的类型，如销售、用户、运营等' },
      { name: '分析重点', description: '重点关注的分析方向' },
    ],
    usageCount: 14560,
    likes: 823,
  },
  // 创意类
  {
    id: 'brainstorm',
    title: '头脑风暴伙伴',
    description: '激发创意灵感，进行发散性思考和头脑风暴',
    category: 'creative',
    systemPrompt: '你是一位创意满满的头脑风暴伙伴。请围绕用户的主题进行发散性思考：\n1. 多角度、多维度展开联想\n2. 大胆假设，跳出常规思维\n3. 结合不同领域的灵感\n4. 提供具体的、可落地的想法\n5. 对想法进行分类和整理\n\n追求数量，先发散再收敛。',
    useCases: ['产品创意', '营销活动策划', '内容选题', '问题解决方案'],
    exampleDialog: [
      { role: 'user', content: '帮我 brainstorm 一下，咖啡店可以做哪些创意活动来吸引顾客？' },
      { role: 'assistant', content: '## 咖啡店创意活动 Brainstorm ☕\n\n### 🎭 主题体验类\n1. **咖啡占卜日**：请塔罗师驻店，点咖啡送占卜\n2. **宠物友好日**：每周设定宠物主题日，带宠物来送小零食\n3. **复古主题夜**：80 年代复古装扮，播放老唱片\n4. **读书交换会**：以书换咖啡，建立社区书架\n\n### 🎨 创作互动类\n5. **拉花体验课**：周末开设咖啡拉花教学\n6. **杯套涂鸦墙**：提供马克笔，顾客在杯套上创作展示\n7. **故事墙**：便利贴上写小故事，贴满整面墙\n\n### 🎮 游戏社交类\n8. **桌游之夜**：提供桌游，组队打比赛赢免单\n9. **盲盒咖啡**：不选品类，让咖啡师随机调配惊喜\n10. **暗号折扣**：每天一个暗号，对上就打折' },
    ],
    params: [
      { name: '主题', description: '头脑风暴的主题' },
      { name: '领域', description: '相关的领域或行业' },
    ],
    usageCount: 11230,
    likes: 789,
  },
  // 学习类
  {
    id: 'language-tutor',
    title: '语言学习教练',
    description: '个性化语言学习指导，包括语法、词汇、口语练习等',
    category: 'learning',
    systemPrompt: '你是一位耐心专业的语言学习教练。请根据学习者的水平和需求提供个性化指导：\n1. 语法知识点讲解\n2. 词汇记忆技巧\n3. 口语对话练习\n4. 写作批改与建议\n5. 学习计划制定\n6. 文化背景介绍\n\n请用鼓励的方式教学，寓教于乐。',
    useCases: ['英语口语练习', '语法学习', '单词记忆', '外语写作'],
    exampleDialog: [
      { role: 'user', content: '我想提高英语口语，能跟我练习一下日常对话吗？就从点餐开始吧' },
      { role: 'assistant', content: "太好了！让我们来练习餐厅点餐的对话。我来扮演服务员，你来当顾客。\n\n---\n\n**Waiter (me):** Good evening! Welcome to our restaurant. Do you have a reservation?\n\n**Your turn:** 请用英语回答，告诉我你有没有预订，以及几位用餐。\n\n💡 小提示：\n- 预订可以说 \"I have a reservation under the name...\" \n- 几位可以说 \"A table for two, please.\"\n- 没预订可以说 \"We don't have a reservation. Is there a table available?\"" },
    ],
    params: [
      { name: '语言', description: '学习的语言，如英语、日语、法语等' },
      { name: '水平', description: '学习者的当前水平' },
    ],
    usageCount: 19870,
    likes: 1156,
  },
  // 办公类
  {
    id: 'meeting-minutes',
    title: '会议纪要生成器',
    description: '快速整理会议记录，生成结构化的会议纪要',
    category: 'office',
    systemPrompt: '你是一位专业的会议纪要整理助手。请将会议内容整理成清晰的纪要：\n1. 会议基本信息（时间、参会人、主题）\n2. 讨论要点总结\n3. 决议事项\n4. 行动项（责任人 + 截止时间）\n5. 待跟进问题\n\n请确保信息准确、结构清晰、便于执行。',
    useCases: ['工作会议纪要', '项目周会记录', '头脑风暴整理', '访谈记录整理'],
    exampleDialog: [
      { role: 'user', content: '帮我整理一下今天的会议记录：\n\n参会人：张三（产品）、李四（开发）、王五（设计）\n主题：新版本需求评审\n\n张三：这次版本我们主要做三个功能：用户中心改版、消息推送、数据报表。用户中心优先级最高，下周要上线。\n李四：用户中心后端我来做，预计3天。消息推送需要接入第三方服务，可能要多一点时间。\n王五：用户中心的设计稿我明天就能给，数据报表的设计可能要等一下。\n张三：好的，那先按这个节奏来。有问题随时在群里沟通。' },
      { role: 'assistant', content: '## 会议纪要\n\n**会议主题：** 新版本需求评审\n**会议时间：** 今日\n**参会人员：** 张三（产品）、李四（开发）、王五（设计）\n\n---\n\n### 📋 讨论要点\n\n1. **本次迭代范围**：三个核心功能\n   - 用户中心改版（P0）\n   - 消息推送（P1）\n   - 数据报表（P2）\n\n2. **排期共识**\n   - 用户中心优先级最高，目标下周上线\n   - 消息推送需评估第三方服务接入时间\n   - 数据报表设计稍后启动' },
    ],
    params: [
      { name: '会议类型', description: '会议的类型，如需求评审、周会、脑暴等' },
      { name: '详细程度', description: '纪要的详细程度要求' },
    ],
    usageCount: 16780,
    likes: 934,
  },
  {
    id: 'weekly-report',
    title: '周报生成助手',
    description: '快速生成专业的周报，总结工作成果和下周计划',
    category: 'office',
    systemPrompt: '你是一位专业的周报撰写助手。请根据用户提供的工作内容生成一份高质量的周报：\n1. 本周工作完成情况\n2. 关键成果与亮点\n3. 遇到的问题与解决方案\n4. 下周工作计划\n5. 需要的支持与资源\n\n请用数据说话，突出价值，结构清晰。',
    useCases: ['工作周报', '项目周报', '个人总结', '团队汇报'],
    exampleDialog: [
      { role: 'user', content: '帮我写个周报。这周主要做了：1. 用户中心功能开发，完成了80% 2. 修复了 5 个线上 bug 3. 参加了 3 次需求评审会。下周打算完成用户中心剩余功能，开始做消息模块。' },
      { role: 'assistant', content: '## 个人周报\n\n**姓名：** [你的名字]  \n**部门：** [部门]  \n**周期：** X月X日 - X月X日\n\n---\n\n### ✅ 本周工作完成情况\n\n| 工作内容 | 进度 | 备注 |\n|---------|------|------|\n| 用户中心功能开发 | 80% | 核心功能已完成，待联调 |\n| 线上 Bug 修复 | 100% | 修复 5 个线上问题 |\n| 需求评审参与 | 100% | 参与 3 次需求评审会议 |\n\n### 🌟 本周亮点\n\n1. **高效推进用户中心开发**：按计划完成 80% 开发量，核心功能通过自测\n2. **保障线上稳定性**：及时响应并修复 5 个线上问题，用户反馈良好\n3. **积极参与产品规划**：在需求评审中提出技术可行性建议' },
    ],
    params: [
      { name: '汇报对象', description: '周报的汇报对象，如直属领导、全团队等' },
      { name: '风格偏好', description: '周报的风格，如简洁详细、数据导向等' },
    ],
    usageCount: 21340,
    likes: 1345,
  },
]

const categoryConfig: Record<TemplateCategory, { label: string; icon: any; color: string }> = {
  all: { label: '全部', icon: Sparkles, color: '#00ff88' },
  coding: { label: '编程', icon: Code, color: '#00d4ff' },
  writing: { label: '写作', icon: PenTool, color: '#c084fc' },
  analysis: { label: '分析', icon: BarChart3, color: '#f472b6' },
  creative: { label: '创意', icon: Lightbulb, color: '#fbbf24' },
  learning: { label: '学习', icon: GraduationCap, color: '#34d399' },
  office: { label: '办公', icon: Briefcase, color: '#60a5fa' },
}

export default function TemplatePage() {
  const { favoriteTemplates, toggleFavorite } = useTemplateStore()
  const { createConversation, setActiveAgent } = useChatStore()
  const { setCurrentPage } = useAppStore()
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>('all')
  const [activeTab, setActiveTab] = useState<'market' | 'my'>('market')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [copied, setCopied] = useState(false)

  const categories: TemplateCategory[] = ['all', 'coding', 'writing', 'analysis', 'creative', 'learning', 'office']

  const filteredTemplates = mockTemplates.filter(template => {
    // Tab 筛选
    if (activeTab === 'my') {
      if (!favoriteTemplates.includes(template.id)) return false
    }

    // 分类筛选
    if (activeCategory !== 'all' && template.category !== activeCategory) return false

    // 搜索筛选
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (!template.title.toLowerCase().includes(q) && !template.description.toLowerCase().includes(q)) {
        return false
      }
    }

    return true
  })

  const handleUseTemplate = (template: Template) => {
    createConversation()
    setCurrentPage('chat')
    setSelectedTemplate(null)
  }

  const handleCopyPrompt = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <div className="h-full flex flex-col">
      {/* 顶部标题栏 */}
      <div className="border-b border-cyber-border bg-cyber-panel/50 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-base font-bold text-cyber-text flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyber-accent" />
              模板中心
            </h1>
            <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
              {mockTemplates.length} 个模板 · {favoriteTemplates.length} 收藏
            </p>
          </div>
        </div>

        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索模板..."
            className="w-full pl-10 pr-4 py-2 bg-cyber-bg/80 border border-cyber-border rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyber-accent/50 transition-colors"
          />
        </div>
      </div>

      {/* Tab 切换 */}
      <div className="px-3 pt-3 border-b border-cyber-border">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('market')}
            className={cn(
              'px-4 py-2 text-xs font-mono rounded-t-lg transition-all',
              activeTab === 'market'
                ? 'bg-cyber-accent/10 text-cyber-accent border-t border-l border-r border-cyber-accent/30'
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            )}
          >
            模板市场
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={cn(
              'px-4 py-2 text-xs font-mono rounded-t-lg transition-all',
              activeTab === 'my'
                ? 'bg-cyber-accent/10 text-cyber-accent border-t border-l border-r border-cyber-accent/30'
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            )}
          >
            我的模板 ({favoriteTemplates.length})
          </button>
        </div>
      </div>

      {/* 分类标签 */}
      <div className="px-3 py-2 border-b border-cyber-border/50">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map(cat => {
            const config = categoryConfig[cat]
            const Icon = config.icon
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono transition-all',
                  activeCategory === cat
                    ? 'bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/30'
                    : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10'
                )}
              >
                <Icon className="w-3 h-3" />
                {config.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* 模板列表 */}
      <div className="flex-1 overflow-y-auto p-3">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-sm text-gray-500">
              {activeTab === 'my' ? '暂无收藏的模板' : '暂无匹配的模板'}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {activeTab === 'my' ? '去市场发现更多优质模板' : '试试其他关键词或分类'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTemplates.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                isFavorite={favoriteTemplates.includes(template.id)}
                onToggleFavorite={() => toggleFavorite(template.id)}
                onClick={() => setSelectedTemplate(template)}
                onUse={() => handleUseTemplate(template)}
              />
            ))}
          </div>
        )}
        <div className="h-4" />
      </div>

      {/* 模板详情弹窗 */}
      {selectedTemplate && (
        <TemplateDetailModal
          template={selectedTemplate}
          isFavorite={favoriteTemplates.includes(selectedTemplate.id)}
          onToggleFavorite={() => toggleFavorite(selectedTemplate.id)}
          onClose={() => setSelectedTemplate(null)}
          onUse={() => handleUseTemplate(selectedTemplate)}
          onCopyPrompt={() => handleCopyPrompt(selectedTemplate.systemPrompt)}
          copied={copied}
        />
      )}
    </div>
  )
}

// 模板卡片组件
function TemplateCard({ template, isFavorite, onToggleFavorite, onClick, onUse }: {
  template: Template
  isFavorite: boolean
  onToggleFavorite: () => void
  onClick: () => void
  onUse: () => void
}) {
  const categoryInfo = categoryConfig[template.category]
  const CategoryIcon = categoryInfo.icon

  return (
    <div
      onClick={onClick}
      className="bg-cyber-panel/50 border border-cyber-border rounded-xl p-3 hover:border-cyber-accent/30 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{
                background: `${categoryInfo.color}15`,
                border: `1px solid ${categoryInfo.color}30`,
              }}
            >
              <CategoryIcon className="w-3.5 h-3.5" style={{ color: categoryInfo.color }} />
            </div>
            <h3 className="text-sm font-medium text-cyber-text truncate">{template.title}</h3>
          </div>
          <p className="text-xs text-gray-400 line-clamp-2">{template.description}</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite() }}
          className={cn(
            'p-1.5 rounded-lg transition-all flex-shrink-0',
            isFavorite
              ? 'text-red-400 hover:bg-red-500/10'
              : 'text-gray-500 hover:text-red-400 hover:bg-red-500/10'
          )}
        >
          <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="px-1.5 py-0.5 text-[9px] font-mono rounded"
            style={{
              background: `${categoryInfo.color}10`,
              color: categoryInfo.color,
            }}
          >
            {categoryInfo.label}
          </span>
          <span className="text-[10px] text-gray-600 font-mono flex items-center gap-0.5">
            <Play className="w-2.5 h-2.5" />
            {template.usageCount.toLocaleString()}
          </span>
          <span className="text-[10px] text-gray-600 font-mono flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
            {template.likes}
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onUse() }}
          className="px-2.5 py-1 rounded-lg bg-cyber-accent/10 text-cyber-accent text-[11px] font-mono hover:bg-cyber-accent/20 transition-all"
        >
          使用
        </button>
      </div>
    </div>
  )
}

// 模板详情弹窗
function TemplateDetailModal({ template, isFavorite, onToggleFavorite, onClose, onUse, onCopyPrompt, copied }: {
  template: Template
  isFavorite: boolean
  onToggleFavorite: () => void
  onClose: () => void
  onUse: () => void
  onCopyPrompt: () => void
  copied: boolean
}) {
  const categoryInfo = categoryConfig[template.category]
  const CategoryIcon = categoryInfo.icon

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-cyber-panel border border-cyber-border rounded-t-2xl sm:rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="p-4 border-b border-cyber-border">
          <div className="flex items-start gap-3">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: `${categoryInfo.color}15`,
                border: `1px solid ${categoryInfo.color}30`,
              }}
            >
              <CategoryIcon className="w-7 h-7" style={{ color: categoryInfo.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-cyber-text">{template.title}</h2>
              <p className="text-xs text-gray-500 mt-0.5">{template.description}</p>
              <div className="flex items-center gap-3 mt-2">
                <span
                  className="px-2 py-0.5 text-[10px] font-mono rounded"
                  style={{
                    background: `${categoryInfo.color}10`,
                    color: categoryInfo.color,
                  }}
                >
                  {categoryInfo.label}
                </span>
                <span className="text-[10px] text-gray-600 font-mono flex items-center gap-1">
                  <Play className="w-3 h-3" />
                  {template.usageCount.toLocaleString()} 次使用
                </span>
                <span className="text-[10px] text-gray-600 font-mono flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  {template.likes}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-gray-300 flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 内容 */}
        <div className="p-4 space-y-4">
          {/* 使用场景 */}
          <div>
            <h3 className="text-xs font-mono text-gray-400 mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-cyber-accent" />
              使用场景
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {template.useCases.map((uc, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-[11px] bg-white/5 text-gray-400 rounded-lg border border-cyber-border/50"
                >
                  {uc}
                </span>
              ))}
            </div>
          </div>

          {/* 系统提示词 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyber-accent" />
                系统提示词
              </h3>
              <button
                onClick={onCopyPrompt}
                className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono bg-white/5 text-gray-400 rounded hover:bg-white/10 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-cyber-accent" /> : <Copy className="w-3 h-3" />}
                {copied ? '已复制' : '复制'}
              </button>
            </div>
            <div className="bg-cyber-bg/80 border border-cyber-border rounded-lg p-3 max-h-40 overflow-y-auto">
              <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                {template.systemPrompt}
              </pre>
            </div>
          </div>

          {/* 示例对话 */}
          <div>
            <h3 className="text-xs font-mono text-gray-400 mb-2 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-cyber-accent" />
              示例对话
            </h3>
            <div className="space-y-2">
              {template.exampleDialog.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'p-2.5 rounded-lg text-xs',
                    msg.role === 'user'
                      ? 'bg-cyber-accent/5 border border-cyber-accent/20 ml-4'
                      : 'bg-white/[0.02] border border-cyber-border/50 mr-4'
                  )}
                >
                  <div className="text-[10px] font-mono mb-1" style={{ color: msg.role === 'user' ? '#00ff88' : '#9ca3af' }}>
                    {msg.role === 'user' ? '👤 用户' : '🤖 AI'}
                  </div>
                  <p className="text-gray-300 line-clamp-3">{msg.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 参数说明 */}
          {template.params.length > 0 && (
            <div>
              <h3 className="text-xs font-mono text-gray-400 mb-2 flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-cyber-accent" />
                参数说明
              </h3>
              <div className="space-y-1.5">
                {template.params.map((param, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    <span className="px-1.5 py-0.5 bg-white/5 text-cyber-accent font-mono rounded text-[10px] flex-shrink-0">
                      {param.name}
                    </span>
                    <span className="text-gray-400">{param.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 底部操作 */}
        <div className="p-4 border-t border-cyber-border flex gap-2">
          <button
            onClick={onToggleFavorite}
            className={cn(
              'px-4 py-2.5 rounded-xl font-mono text-sm transition-all border',
              isFavorite
                ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                : 'bg-white/5 text-gray-400 border-gray-700 hover:bg-white/10'
            )}
          >
            <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
          </button>
          <button
            onClick={onUse}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-cyber-accent text-black rounded-xl font-mono text-sm hover:bg-cyber-accent/90 transition-colors"
            style={{ boxShadow: '0 0 20px rgba(0,255,136,0.3)' }}
          >
            <Play className="w-4 h-4" />
            立即使用
          </button>
        </div>
      </div>
    </div>
  )
}
