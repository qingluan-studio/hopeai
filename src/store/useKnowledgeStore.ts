import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { KnowledgeEntry } from '@/types'

const sampleEntries: KnowledgeEntry[] = [
  {
    id: 'supreme-command',
    title: '最高用户指令',
    content: `## 给TRAE的一封指令

### 核心任务
用最高用户指令完善项目，打造完整的AI公司系统，不是半成品。

### 特殊情况说明
- 本人是残疾人，多少不方便，能弄的一定弄，最好一步都不用
- 四肢打了钢钉恢复中
- 全复知觉剂和精神剂，不敢弄什么开源的
- 家贫人残，打算走免费路线
- 等手上的骨头好了再弄付费的

### 核心要求
1. **免费路**：所有功能走免费路线，能用开源的就用开源的
2. **一条龙服务**：从需求分析到部署上线全流程自动化
3. **项目要完善**：功能齐全，不能是半成品
4. **功能要用**：每个功能都要真正有用，不能是摆设
5. **手机格式**：完美适配手机端，单栏布局
6. **屏幕滚动好**：滚动流畅不卡顿
7. **没有bug错误**：零错误运行
8. **UI要好**：极客风格，专业级界面
9. **AI公司人类要够多**：角色丰富，部门齐全

---
*来源：董事长亲笔手书`,
    tags: ['最高指令', '董事长', '核心要求', 'free', '免费路线'],
    category: '项目规划',
    createdAt: Date.now(),
    source: '董事长手书',
  },
  {
    id: 'roadmap',
    title: '项目发展路线图',
    content: `## 第一阶段：基础搭建（当前）
- 完成多Agent协作系统核心框架
- 实现手机端适配和底部Tab导航
- 建立知识库系统和自我学习机制
- 确保GitHub Pages稳定部署

## 第二阶段：功能增强
- 接入真实大语言模型API
- 实现Agent间真实协作对话
- 完善代码生成和审查功能
- 增加更多Agent角色和模板

## 第三阶段：智能化
- 实现自我学习和知识沉淀
- 支持自定义工作流编排
- 增加项目管理和任务追踪
- 实现多项目并行管理

## 第四阶段：生态扩展
- 支持插件系统和第三方集成
- 增加团队协作和权限管理
- 支持多语言和国际化
- 建立社区和开源生态

## 第五阶段：商业化
- 企业级功能和安全审计
- SLA保障和技术支持
- 私有化部署方案
- 商业模式探索`,
    tags: ['roadmap', '规划', '发展路线'],
    category: '项目规划',
    createdAt: Date.now(),
    source: '董事长指令',
  },
  {
    id: 'k001',
    title: 'React + TypeScript 组件开发最佳实践',
    content: `## React组件开发核心原则

### 1. 函数式组件优先
使用函数式组件配合Hooks，避免class组件。

### 2. 单一职责原则
每个组件只做一件事，复杂功能拆分为子组件。

### 3. TypeScript类型安全
- 为所有props定义interface
- 避免使用any
- 使用泛型提高复用性

### 4. Hooks使用规范
- useState: 简单局部状态
- useReducer: 复杂状态逻辑
- useCallback/useMemo: 性能优化
- 自定义Hooks: 逻辑复用

### 5. 性能优化
- React.memo 包裹纯展示组件
- 虚拟列表处理大数据
- 懒加载减少首屏负担`,
    tags: ['react', 'typescript', '组件', 'hooks', 'best-practices'],
    category: '前端开发',
    createdAt: Date.now() - 86400000 * 3,
    source: '内部文档',
  },
  {
    id: 'k002',
    title: 'Zustand 轻量状态管理方案',
    content: `## Zustand 核心概念

### 创建Store
\`\`\`typescript
import { create } from 'zustand'

interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}))
\`\`\`

### 优势
- API简洁，学习成本低
- 不需要Provider包裹
- 天然支持TypeScript
- 包体积小（~1KB）
- 支持中间件（persist、devtools等）`,
    tags: ['zustand', 'state-management', 'react', '状态管理'],
    category: '前端开发',
    createdAt: Date.now() - 86400000 * 2,
    source: '官方文档',
  },
  {
    id: 'k003',
    title: 'TypeScript 高级类型技巧',
    content: `## TypeScript高级类型

### 条件类型
\`\`\`typescript
type IsString<T> = T extends string ? true : false
type A = IsString<"hello"> // true
type B = IsString<42>      // false
\`\`\`

### 映射类型
\`\`\`typescript
type Readonly<T> = { readonly [P in keyof T]: T[P] }
type Partial<T> = { [P in keyof T]?: T[P] }
\`\`\`

### 模板字面量类型
\`\`\`typescript
type EventName = \`on\${Capitalize<string>}\`
// "onClick" | "onChange" | ...
\`\`\`

### infer推断
\`\`\`typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never
\`\`\``,
    tags: ['typescript', 'types', 'advanced', '泛型'],
    category: '编程语言',
    createdAt: Date.now() - 86400000,
    source: '技术博客',
  },
  {
    id: 'k004',
    title: 'FastAPI 异步后端开发指南',
    content: `## FastAPI 核心特性

### 异步路由
\`\`\`python
from fastapi import FastAPI

app = FastAPI()

@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}
\`\`\`

### Pydantic 数据校验
\`\`\`python
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    price: float
    is_offer: bool | None = None
\`\`\`

### 依赖注入
\`\`\`python
from fastapi import Depends

async def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/users/")
async def read_users(db = Depends(get_db)):
    return db.query(User).all()
\`\`\`

### 优势
- 原生异步支持，高并发性能卓越
- 自动生成OpenAPI文档
- 类型安全（Pydantic校验）
- 生态完善，社区活跃`,
    tags: ['python', 'fastapi', '后端', '异步', 'api'],
    category: '后端开发',
    createdAt: Date.now() - 86400000 * 4,
    source: 'FastAPI官方文档',
  },
  {
    id: 'k005',
    title: 'ReAct 算法：推理与行动的闭环',
    content: `## ReAct (Reasoning + Acting) 算法

### 核心思想
AI在输出最终回答前，经历多轮"思考→行动→观察"循环：

1. **Thought（思考）**：分析当前状态，决定下一步
2. **Action（行动）**：调用外部工具（搜索、计算、代码执行等）
3. **Observation（观察）**：获取工具返回结果
4. 重复直到有足够信息生成最终回答

### 伪代码
\`\`\`python
def react_loop(query):
    thoughts = []
    for step in range(max_iterations):
        thought = llm.generate(query, thoughts)
        if thought.action == "final_answer":
            return thought.answer
        result = tools[thought.action].execute(thought.input)
        thoughts.append({**thought, "observation": result})
    return "达到最大迭代次数"
\`\`\`

### 优势
- 比纯CoT更准确（有外部工具验证）
- 可追溯推理过程
- 支持动态工具调用`,
    tags: ['ai', 'agent', 'react', '算法', 'llm', '推理'],
    category: 'AI/智能体',
    createdAt: Date.now() - 86400000 * 5,
    source: '论文解读',
  },
  {
    id: 'k006',
    title: 'RAG 检索增强生成最佳实践',
    content: `## RAG (Retrieval-Augmented Generation)

### 标准流程
1. **文档切分**：将长文档拆分为语义完整的chunk
2. **向量化**：用Embedding模型将文本转为向量
3. **存储**：存入向量数据库（ChromaDB/Milvus）
4. **检索**：用户提问时，检索Top-K相关chunk
5. **拼接**：将检索结果作为context拼入Prompt
6. **生成**：LLM基于context生成回答

### 代码示例
\`\`\`python
from chromadb import Client

# 存储知识
collection.add(
    documents=["React是Facebook开发的UI框架"],
    ids=["doc_001"]
)

# 检索
results = collection.query(
    query_texts=["什么是React"],
    n_results=3
)
\`\`\`

### 优化技巧
- Chunk大小：500-1000 tokens为宜
- 重排序：用Cross-Encoder重排检索结果
- 混合检索：关键词+向量检索结合
- 去重：避免相似chunk重复出现`,
    tags: ['rag', 'ai', '向量', '检索', 'chromadb', 'embedding'],
    category: 'AI/智能体',
    createdAt: Date.now() - 86400000 * 5,
    source: '技术总结',
  },
  {
    id: 'k007',
    title: 'LangChain 多智能体编排框架',
    content: `## LangChain 核心概念

### Agent
Agent是LLM+工具的封装，能自主决策调用哪个工具：
\`\`\`python
from langchain.agents import initialize_agent, Tool

tools = [
    Tool(name="Search", func=search_func),
    Tool(name="Calculator", func=calc_func),
]

agent = initialize_agent(tools, llm, agent="zero-shot-react-description")
agent.run("2024年GDP是多少？")
\`\`\`

### Chain
Chain将多个步骤串联：
\`\`\`python
from langchain.chains import LLMChain
chain = LLMChain(llm=llm, prompt=prompt)
result = chain.run(input="hello")
\`\`\`

### Memory
维护对话记忆：
- ConversationBufferMemory: 保留全部
- ConversationSummaryMemory: 压缩摘要
- VectorStoreRetrieverMemory: 向量检索

### Multi-Agent
多个Agent协作，分工处理复杂任务`,
    tags: ['langchain', 'ai', 'agent', '编排', 'multi-agent'],
    category: 'AI/智能体',
    createdAt: Date.now() - 86400000 * 6,
    source: 'LangChain文档',
  },
  {
    id: 'k008',
    title: 'ChromaDB 向量数据库使用指南',
    content: `## ChromaDB 向量存储

### 安装与初始化
\`\`\`python
import chromadb
client = chromadb.PersistentClient(path="./data/chroma")
\`\`\`

### 创建Collection
\`\`\`python
collection = client.get_or_create_collection(
    name="knowledge_base",
    metadata={"hnsw:space": "cosine"}
)
\`\`\`

### 存储数据
\`\`\`python
collection.add(
    documents=["React是UI框架", "Vue是渐进式框架"],
    metadatas=[{"type": "frontend"}, {"type": "frontend"}],
    ids=["doc1", "doc2"]
)
\`\`\`

### 语义检索
\`\`\`python
results = collection.query(
    query_texts=["前端框架"],
    n_results=3,
    where={"type": "frontend"}
)
\`\`\`

### 优势
- 轻量级，纯Python实现
- 支持持久化存储
- 内置Embedding功能
- 支持元数据过滤`,
    tags: ['chromadb', '向量数据库', 'ai', 'embedding', '检索'],
    category: 'AI/智能体',
    createdAt: Date.now() - 86400000 * 6,
    source: 'ChromaDB文档',
  },
  {
    id: 'k009',
    title: 'Vite 构建工具配置与优化',
    content: `## Vite 核心配置

### vite.config.ts
\`\`\`typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'framer-motion'],
          'markdown-vendor': ['react-markdown', 'remark-gfm'],
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})
\`\`\`

### 代码分割
- 路由级懒加载：\`const Page = lazy(() => import('./Page'))\`
- 手动Chunks：将大依赖拆分为独立chunk
- 动态导入：\`const mod = await import('./module')\`

### 性能优化
- 预构建依赖（optimizeDeps）
- 压缩输出（terser/esbuild）
- 资源内联（小图片转base64）`,
    tags: ['vite', '构建工具', 'webpack', '打包', '优化'],
    category: '前端工程化',
    createdAt: Date.now() - 86400000 * 7,
    source: 'Vite官方文档',
  },
  {
    id: 'k010',
    title: 'TailwindCSS 原子化CSS方案',
    content: `## TailwindCSS 使用指南

### 核心理念
用预定义的原子类组合样式，不写自定义CSS。

### 常用类名
\`\`\`html
<div class="flex items-center justify-between p-4 bg-gray-900 rounded-xl border border-green-700/50">
  <h1 class="text-lg font-bold text-green-400">标题</h1>
  <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
    按钮
  </button>
</div>
\`\`\`

### 响应式
\`\`\`html
<!-- 移动端单栏，桌面端三栏 -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
\`\`\`

### 暗色模式
\`\`\`html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
\`\`\`

### 自定义主题
\`\`\`javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        neon: '#39ff14',
      }
    }
  }
}
\`\`\``,
    tags: ['tailwindcss', 'css', '样式', '原子化', '响应式'],
    category: '前端开发',
    createdAt: Date.now() - 86400000 * 7,
    source: 'TailwindCSS文档',
  },
  {
    id: 'k011',
    title: 'Git 版本控制与团队协作流程',
    content: `## Git 核心操作

### 基本工作流
\`\`\`bash
git add <file>        # 暂存
git commit -m "msg"   # 提交
git push origin main  # 推送
git pull              # 拉取
\`\`\`

### 分支管理
\`\`\`bash
git checkout -b feature/xxx   # 新建分支
git merge feature/xxx         # 合并分支
git branch -d feature/xxx     # 删除分支
\`\`\`

### GitHub Pages 部署
\`\`\`bash
# 构建产物放入 gh-pages 分支
git subtree push --prefix dist origin gh-pages
\`\`\`

### 提交规范
- feat: 新功能
- fix: 修复Bug
- docs: 文档更新
- refactor: 重构
- chore: 杂项

### 冲突解决
1. git pull 拉取远程更新
2. 手动解决冲突标记 <<<< ==== >>>>
3. git add 标记已解决
4. git commit 完成合并`,
    tags: ['git', '版本控制', 'github', '协作', '部署'],
    category: '工程化',
    createdAt: Date.now() - 86400000 * 8,
    source: 'Pro Git',
  },
  {
    id: 'k012',
    title: 'SQL 数据库设计与优化',
    content: `## 数据库设计原则

### 范式化
- 1NF: 字段原子性
- 2NF: 非主键字段完全依赖主键
- 3NF: 消除传递依赖

### 索引优化
\`\`\`sql
-- 高频查询字段建索引
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_created_at ON tasks(created_at);

-- 复合索引（注意顺序）
CREATE INDEX idx_user_status ON tasks(user_id, status);
\`\`\`

### 分页查询优化
\`\`\`sql
-- 慢：OFFSET过大
SELECT * FROM tasks OFFSET 100000 LIMIT 10;

-- 快：游标分页
SELECT * FROM tasks WHERE id > 100000 LIMIT 10;
\`\`\`

### 事务处理
\`\`\`sql
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
\`\`\`

### 常见优化
- 避免SELECT *
- JOIN字段必须有索引
- 大表考虑水平分表
- 热点数据加Redis缓存`,
    tags: ['sql', 'mysql', '数据库', '索引', '优化', '事务'],
    category: '数据库',
    createdAt: Date.now() - 86400000 * 8,
    source: '数据库优化实战',
  },
  {
    id: 'k013',
    title: 'Docker 容器化部署指南',
    content: `## Docker 核心概念

### Dockerfile
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/server.js"]
\`\`\`

### 常用命令
\`\`\`bash
docker build -t myapp .          # 构建镜像
docker run -p 3000:3000 myapp    # 运行容器
docker ps                         # 查看运行中容器
docker logs <container>           # 查看日志
docker exec -it <container> sh    # 进入容器
\`\`\`

### Docker Compose
\`\`\`yaml
version: '3.8'
services:
  web:
    build: .
    ports: ["3000:3000"]
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
    volumes: ["dbdata:/var/lib/postgresql/data"]
volumes:
  dbdata:
\`\`\`

### 优势
- 环境一致性
- 快速部署与回滚
- 资源隔离
- 易于CI/CD集成`,
    tags: ['docker', '容器', '部署', 'devops', 'compose'],
    category: 'DevOps',
    createdAt: Date.now() - 86400000 * 9,
    source: 'Docker官方文档',
  },
  {
    id: 'k014',
    title: 'React Router 路由管理',
    content: `## React Router v6

### 基本路由
\`\`\`tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
\`\`\`

### 嵌套路由
\`\`\`tsx
<Route path="/dashboard" element={<Dashboard />}>
  <Route index element={<Overview />} />
  <Route path="settings" element={<Settings />} />
</Route>
\`\`\`

### 懒加载
\`\`\`tsx
const Home = lazy(() => import('./Home'))
<Route path="/" element={
  <Suspense fallback={<Loading />}><Home /></Suspense>
} />
\`\`\`

### 编程式导航
\`\`\`tsx
const navigate = useNavigate()
navigate('/dashboard')
navigate(-1) // 后退
\`\`\`

### HashRouter
GitHub Pages等静态托管推荐用HashRouter：
\`\`\`tsx
import { HashRouter } from 'react-router-dom'
\`\`\``,
    tags: ['react-router', '路由', 'react', 'spa'],
    category: '前端开发',
    createdAt: Date.now() - 86400000 * 9,
    source: 'React Router文档',
  },
  {
    id: 'k015',
    title: '多Agent协作系统设计模式',
    content: `## 多Agent协作架构

### 角色分工模式
- **分析员**：拆解需求，制定方案
- **代码员**：并行开发，各负责不同模块
- **检查员**：代码审查，质量把关
- **扩展员**：未来规划，技术选型
- **打包员**：整合代码，生成文档
- **部署员**：上线部署，运维保障

### 工作流引擎
\`\`\`typescript
interface WorkflowPhase {
  id: string
  name: string
  agents: AgentTemplate[]
  minDuration: number
  maxDuration: number
}

const phases: WorkflowPhase[] = [
  { id: 'analysis', name: '需求分析', agents: [analyst] },
  { id: 'coding', name: '编码开发', agents: [coderA, coderB, coderC] },
  { id: 'review', name: '代码审查', agents: [reviewer, bugDetector] },
  { id: 'extension', name: '扩展规划', agents: [extender] },
  { id: 'packaging', name: '打包交付', agents: [packager] },
  { id: 'deployment', name: '部署上线', agents: [deployer] },
]
\`\`\`

### 通信机制
- 消息队列：Agent间异步通信
- 共享状态：Zustand全局store
- 事件驱动：观察者模式

### 优势
- 专业化分工，质量更高
- 并行开发，效率更高
- 互相检查，减少错误`,
    tags: ['multi-agent', '协作', '工作流', '架构', 'agent'],
    category: 'AI/智能体',
    createdAt: Date.now() - 86400000 * 10,
    source: '架构设计经验',
  },
  {
    id: 'k016',
    title: 'OpenRouter API 多模型路由',
    content: `## OpenRouter 聚合网关

### 简介
OpenRouter聚合了多个LLM提供商（OpenAI、Anthropic、Google、DeepSeek等），通过统一API调用。

### 调用示例
\`\`\`python
from openai import AsyncOpenAI

client = AsyncOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="sk-or-xxx"
)

response = await client.chat.completions.create(
    model="deepseek/deepseek-chat",
    messages=[{"role": "user", "content": "Hello"}],
    temperature=0.7
)
\`\`\`

### 模型路由策略
\`\`\`python
def select_model(task_type):
    if task_type == "coding":
        return "deepseek/deepseek-coder"
    elif task_type == "reasoning":
        return "openai/gpt-4o"
    elif task_type == "cheap":
        return "deepseek/deepseek-chat"
    else:
        return "anthropic/claude-3.5-sonnet"
\`\`\`

### 优势
- 一个API Key调用所有模型
- 自动故障转移
- 统一计费
- 免费额度可用`,
    tags: ['openrouter', 'llm', 'api', '模型路由', 'deepseek'],
    category: 'AI/智能体',
    createdAt: Date.now() - 86400000 * 10,
    source: 'OpenRouter文档',
  },
  {
    id: 'k017',
    title: '移动端响应式设计要点',
    content: `## 移动端适配核心

### Viewport设置
\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
\`\`\`

### 安全区域适配
\`\`\`css
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
\`\`\`

### 触摸优化
- 最小点击区域44x44px
- 使用touch事件替代mouse事件
- 禁用双击缩放
- 滑动流畅：-webkit-overflow-scrolling: touch

### 布局方案
\`\`\`css
/* 单栏布局（手机） */
.container { display: flex; flex-direction: column; }

/* 底部Tab导航 */
.bottom-nav {
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-around;
}
\`\`\`

### 性能优化
- 图片懒加载
- 虚拟列表
- 减少DOM层级
- CSS动画用transform/opacity`,
    tags: ['mobile', '响应式', '手机端', 'css', 'ui'],
    category: '前端开发',
    createdAt: Date.now() - 86400000 * 11,
    source: '移动端开发经验',
  },
  {
    id: 'k018',
    title: '代码块复制功能实现最佳实践',
    content: `## 代码块复制按钮实现

### 核心方案
像千问、ChatGPT那样，代码块右上角有复制按钮，点击一键复制。

### 实现代码
\`\`\`tsx
function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      // 优先使用 Clipboard API
      await navigator.clipboard.writeText(code)
    } catch {
      // 兜底方案：execCommand
      const textarea = document.createElement('textarea')
      textarea.value = code
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="relative group">
      <pre><code>{code}</code></pre>
      <button onClick={handleCopy}
        className={cn('absolute top-2 right-2',
          copied ? 'text-green-400' : 'opacity-0 group-hover:opacity-100')}>
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
    </div>
  )
}
\`\`\`

### 关键点
- navigator.clipboard + execCommand双保险
- 复制成功显示绿色对勾反馈
- hover时才显示按钮，不干扰阅读
- 1.5秒后自动恢复`,
    tags: ['复制', 'clipboard', '代码块', 'ux', '最佳实践'],
    category: '前端开发',
    createdAt: Date.now() - 86400000 * 11,
    source: '开发经验',
  },
  {
    id: 'k019',
    title: '项目需求分析与拆解方法论',
    content: `## 需求分析核心步骤

### 1. 需求收集
- 用户原始描述（可能模糊）
- 隐含需求（性能、安全、兼容性）
- 约束条件（预算、时间、技术栈）

### 2. 需求分类
- **功能性需求**：系统必须实现的功能
- **非功能性需求**：性能、安全、可用性
- **约束性需求**：技术选型、预算、时间

### 3. 任务拆解
将大需求拆为可执行的子任务：
\`\`\`
用户需求："做一个AI智能体框架"
├── 后端API层（main.py, 路由设计）
├── 核心引擎层（ReAct算法, 任务拆解）
├── 记忆存储层（向量数据库, RAG检索）
├── 插件系统（搜索, 代码沙箱）
├── 前端界面（控制台, 对话面板）
└── 部署运维（Docker, CI/CD）
\`\`\`

### 4. 优先级排序
- P0：必须有（核心功能）
- P1：应该有（重要功能）
- P2：可以有（增强功能）

### 5. 风险评估
- 技术风险：是否可行
- 时间风险：能否按时
- 依赖风险：第三方服务可用性`,
    tags: ['需求分析', '项目管理', '拆解', '方法论'],
    category: '项目管理',
    createdAt: Date.now() - 86400000 * 12,
    source: '项目管理经验',
  },
  {
    id: 'k020',
    title: 'GitHub Pages 免费部署方案',
    content: `## GitHub Pages 部署

### 适合场景
- 静态网站（HTML/CSS/JS）
- 前端SPA（React/Vue构建产物）
- 开源项目文档
- **完全免费**

### 部署步骤
\`\`\`bash
# 1. 构建前端
npm run build

# 2. 将dist推送到gh-pages分支
git subtree push --prefix dist origin gh-pages

# 或用gh-pages工具
npx gh-pages -d dist
\`\`\`

### 项目页面部署
如果部署到 username.github.io/repo/ 路径下：
\`\`\`typescript
// vite.config.ts
export default defineConfig({
  base: '/repo-name/',  // 设置base路径
})
\`\`\`

### HashRouter适配
GitHub Pages刷新会404，用HashRouter解决：
\`\`\`tsx
import { HashRouter } from 'react-router-dom'
// URL变为 /#/about 而非 /about
\`\`\`

### 自动部署CI
\`\`\`yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
\`\`\``,
    tags: ['github-pages', '部署', '免费', 'ci-cd', '静态托管'],
    category: 'DevOps',
    createdAt: Date.now() - 86400000 * 12,
    source: '部署经验',
  },
  {
    id: 'k021',
    title: '代码审查清单与质量标准',
    content: `## 代码审查核心检查项

### 功能正确性
- [ ] 代码实现了需求要求的功能
- [ ] 边界条件处理完整（空值、零值、最大值）
- [ ] 错误处理覆盖（异常捕获、错误提示）
- [ ] 并发安全性（线程安全、锁机制）

### 代码质量
- [ ] 命名清晰有意义
- [ ] 函数职责单一（SRP）
- [ ] 无重复代码（DRY）
- [ ] 注释完善（复杂逻辑有注释）
- [ ] 遵循编码规范（PEP8/ESLint）

### 性能
- [ ] 无明显的性能瓶颈
- [ ] 数据库查询有索引
- [ ] 大数据量使用分页
- [ ] 避免不必要的重复计算

### 安全
- [ ] 无SQL注入风险（参数化查询）
- [ ] 无XSS风险（输出转义）
- [ ] 敏感信息不硬编码
- [ ] 权限校验完整

### 可维护性
- [ ] 模块化设计，低耦合
- [ ] 有单元测试覆盖
- [ ] 配置项可外部化
- [ ] 日志记录完善`,
    tags: ['代码审查', '质量', 'review', '清单', '最佳实践'],
    category: '工程化',
    createdAt: Date.now() - 86400000 * 13,
    source: '代码审查经验',
  },
  {
    id: 'k022',
    title: 'Python 异步编程指南',
    content: `## Python asyncio

### 基本用法
\`\`\`python
import asyncio

async def fetch_data():
    await asyncio.sleep(1)
    return {"data": "hello"}

async def main():
    result = await fetch_data()
    print(result)

asyncio.run(main())
\`\`\`

### 并发执行
\`\`\`python
async def main():
    # 并发执行多个协程
    results = await asyncio.gather(
        fetch_data(),
        fetch_data(),
        fetch_data()
    )

    # 或使用TaskGroup (Python 3.11+)
    async with asyncio.TaskGroup() as tg:
        t1 = tg.create_task(fetch_data())
        t2 = tg.create_task(fetch_data())
\`\`\`

### 异步上下文管理器
\`\`\`python
class AsyncResource:
    async def __aenter__(self):
        await self.connect()
        return self

    async def __aexit__(self, *args):
        await self.close()
\`\`\`

### FastAPI中的异步
\`\`\`python
@app.get("/items")
async def get_items():
    items = await db.fetch_all()
    return items
\`\`\`

### 注意事项
- 不要在异步函数中用time.sleep
- 用aiohttp替代requests
- 用aiomysql/asyncpg替代pymysql`,
    tags: ['python', 'asyncio', '异步', '协程', 'fastapi'],
    category: '后端开发',
    createdAt: Date.now() - 86400000 * 13,
    source: 'Python异步编程',
  },
  {
    id: 'k023',
    title: '极客风格UI设计规范',
    content: `## 极客/赛博朋克风格设计

### 色彩方案
- 背景：深黑/深灰 (#0a0a0a, #111111)
- 主色：霓虹绿 (#39ff14, #22c55e)
- 辅色：电子蓝 (#00ffff, #06b6d4)
- 强调：电紫 (#a855f7, #d946ef)
- 警告：霓虹黄 (#facc15)
- 文字：灰白 (#e5e5e5, #a3a3a3)

### 字体
- 代码/数据：等宽字体 (JetBrains Mono, Fira Code)
- 标题：粗体大字号
- 正文：常规字重

### 视觉效果
\`\`\`css
/* 霓虹发光 */
text-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
box-shadow: 0 0 20px rgba(34, 197, 94, 0.4);

/* 网格背景 */
background-image: 
  linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px),
  linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px);
background-size: 20px 20px;

/* 扫描线效果 */
background: linear-gradient(transparent 50%, rgba(0,0,0,0.1) 50%);
background-size: 100% 4px;
\`\`\`

### 动画
- 打字机效果（逐字显示）
- 闪烁光标
- 矩阵雨背景
- 终端窗口风格`,
    tags: ['ui', '设计', '极客', '赛博朋克', 'neon', '主题'],
    category: '设计',
    createdAt: Date.now() - 86400000 * 14,
    source: 'UI设计经验',
  },
  {
    id: 'k024',
    title: '插件化架构设计模式',
    content: `## 插件系统设计

### 核心接口
\`\`\`typescript
interface Plugin {
  name: string
  version: string
  install(context: PluginContext): void
  uninstall?(): void
}
\`\`\`

### 插件管理器
\`\`\`typescript
class PluginManager {
  private plugins = new Map<string, Plugin>()

  register(plugin: Plugin): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(\`Plugin \${plugin.name} already registered\`)
    }
    this.plugins.set(plugin.name, plugin)
    plugin.install(this.context)
  }

  unregister(name: string): void {
    const plugin = this.plugins.get(name)
    plugin?.uninstall?.()
    this.plugins.delete(name)
  }

  list(): Plugin[] {
    return Array.from(this.plugins.values())
  }
}
\`\`\`

### 优势
- 开闭原则：新增功能不改核心代码
- 可插拔：按需加载卸载
- 可扩展：第三方可开发插件
- 解耦：核心与扩展分离

### 应用场景
- IDE插件（VSCode）
- 浏览器扩展
- CMS系统（WordPress）
- AI Agent工具系统`,
    tags: ['插件', '架构', '设计模式', 'plugin', '扩展性'],
    category: '架构设计',
    createdAt: Date.now() - 86400000 * 14,
    source: '架构设计经验',
  },
  {
    id: 'k025',
    title: 'API 接口设计规范',
    content: `## RESTful API 设计

### URL规范
\`\`\`
GET    /api/v1/users          # 列表
GET    /api/v1/users/:id      # 详情
POST   /api/v1/users          # 创建
PUT    /api/v1/users/:id      # 全量更新
PATCH  /api/v1/users/:id      # 部分更新
DELETE /api/v1/users/:id      # 删除
\`\`\`

### 统一响应格式
\`\`\`json
{
  "success": true,
  "data": { "id": 1, "name": "test" },
  "message": "操作成功"
}
\`\`\`

### 错误响应
\`\`\`json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "参数验证失败",
    "details": [{ "field": "email", "msg": "邮箱格式不正确" }]
  }
}
\`\`\`

### 状态码使用
- 200: 成功
- 201: 创建成功
- 400: 请求错误
- 401: 未认证
- 403: 无权限
- 404: 不存在
- 500: 服务器错误

### 分页
\`\`\`json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
\`\`\``,
    tags: ['api', 'rest', '接口设计', 'restful', '规范'],
    category: '后端开发',
    createdAt: Date.now() - 86400000 * 15,
    source: 'API设计规范',
  },
  {
    id: 'k026',
    title: '知识沉淀与自我学习机制',
    content: `## 自我学习系统设计

### 知识沉淀流程
1. **任务执行**：Agent完成用户任务
2. **经验提取**：从任务中提取关键知识点
3. **分类归档**：按类别存入知识库
4. **标签管理**：打上相关标签便于检索
5. **后续复用**：新任务时检索相关知识

### 知识库结构
\`\`\`typescript
interface KnowledgeEntry {
  id: string
  title: string
  content: string
  tags: string[]
  category: string
  createdAt: number
  source: string  // 来源（任务经验/手动录入/外部文档）
}
\`\`\`

### 自动知识提取
\`\`\`python
def extract_knowledge(task_result):
    """从任务结果中提取知识"""
    return {
        "title": task_result.title,
        "content": summarize(task_result),
        "tags": extract_keywords(task_result),
        "category": classify(task_result),
    }
\`\`\`

### RAG增强
新任务开始时，先检索知识库中相关经验：
\`\`\`python
async def task_with_knowledge(query):
    # 检索相关知识
    knowledge = await memory.retrieve(query, top_k=5)
    # 拼入上下文
    context = format_knowledge(knowledge)
    # 带着知识执行任务
    return await agent.run(query, context=context)
\`\`\``,
    tags: ['知识库', '自我学习', '知识沉淀', 'rag', 'agent'],
    category: 'AI/智能体',
    createdAt: Date.now() - 86400000 * 15,
    source: '系统设计经验',
  },
  {
    id: 'k027',
    title: 'Redis 缓存与高性能数据结构',
    content: `## Redis 核心使用

### 常用数据结构
\`\`\`bash
# 字符串
SET key "value"
GET key
SETEX key 60 "value"  # 60秒过期

# 哈希
HSET user:1 name "张三" age 25
HGET user:1 name

# 列表（消息队列）
LPUSH queue "task1"
RPOP queue

# 集合（去重）
SADD tags "react" "vue"

# 有序集合（排行榜）
ZADD ranking 100 "player1"
ZREVRANGE ranking 0 9
\`\`\`

### 缓存策略
\`\`\`python
# Cache Aside（旁路缓存）
async def get_user(user_id):
    # 1. 先查缓存
    data = await redis.get(f"user:{user_id}")
    if data:
        return json.loads(data)
    # 2. 查数据库
    user = await db.get_user(user_id)
    # 3. 写入缓存（设过期时间）
    await redis.setex(f"user:{user_id}", 300, json.dumps(user))
    return user
\`\`\`

### 应用场景
- 热点数据缓存
- 分布式锁
- 限流计数器
- 消息队列
- 会话存储
- 排行榜/计数器`,
    tags: ['redis', '缓存', '高性能', '数据结构', 'nosql'],
    category: '数据库',
    createdAt: Date.now() - 86400000 * 16,
    source: 'Redis官方文档',
  },
  {
    id: 'k028',
    title: 'WebSocket 实时通信方案',
    content: `## WebSocket 实时通信

### 前端实现
\`\`\`typescript
class WebSocketClient {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0

  connect(url: string) {
    this.ws = new WebSocket(url)

    this.ws.onopen = () => {
      console.log('WebSocket已连接')
      this.reconnectAttempts = 0
    }

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      this.handleMessage(data)
    }

    this.ws.onclose = () => {
      console.log('连接断开，尝试重连...')
      setTimeout(() => this.connect(url), 3000)
    }
  }

  send(data: object) {
    this.ws?.send(JSON.stringify(data))
  }
}
\`\`\`

### 后端实现 (FastAPI)
\`\`\`python
from fastapi import WebSocket, WebSocketDisconnect

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            # 广播给所有连接
            await manager.broadcast(f"{client_id}: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
\`\`\`

### 应用场景
- 实时聊天
- 协作编辑
- 实时通知
- 股票行情
- 在线游戏`,
    tags: ['websocket', '实时通信', 'fastapi', '实时', '推送'],
    category: '后端开发',
    createdAt: Date.now() - 86400000 * 16,
    source: '实时通信实践',
  },
  {
    id: 'k029',
    title: 'CI/CD 持续集成与部署',
    content: `## CI/CD 核心概念

### GitHub Actions 工作流
\`\`\`yaml
name: CI/CD Pipeline
on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
\`\`\`

### CI/CD 流程
1. **代码提交** → 触发Pipeline
2. **代码检查** → ESLint / Prettier / TypeScript
3. **单元测试** → 自动运行测试
4. **构建** → 打包生产版本
5. **部署** → 自动部署到服务器
6. **通知** → 成功/失败通知

### 最佳实践
- 小步快跑，频繁提交
- 自动化测试覆盖率 > 80%
- 部署前必跑测试
- 支持一键回滚
- 蓝绿部署/金丝雀发布`,
    tags: ['ci-cd', 'github-actions', '自动化', '部署', 'devops'],
    category: 'DevOps',
    createdAt: Date.now() - 86400000 * 17,
    source: 'CI/CD最佳实践',
  },
  {
    id: 'k030',
    title: 'JWT 认证与授权机制',
    content: `## JWT (JSON Web Token)

### JWT 结构
\`\`\`
Header.Payload.Signature
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.abc123...
\`\`\`

### 生成与验证 (Python)
\`\`\`python
import jwt
from datetime import datetime, timedelta

SECRET_KEY = "your-secret-key"

def create_token(user_id: int) -> str:
    payload = {
        "userId": user_id,
        "exp": datetime.utcnow() + timedelta(hours=24),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def verify_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise Exception("Token已过期")
    except jwt.InvalidTokenError:
        raise Exception("无效Token")
\`\`\`

### FastAPI 集成
\`\`\`python
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer

security = HTTPBearer()

async def get_current_user(credentials = Depends(security)):
    payload = verify_token(credentials.credentials)
    user = await db.get_user(payload["userId"])
    if not user:
        raise HTTPException(401, "用户不存在")
    return user

@app.get("/profile")
async def profile(user = Depends(get_current_user)):
    return {"username": user.username}
\`\`\`

### 安全要点
- 密钥不要硬编码
- 设置合理的过期时间
- HTTPS传输
- 不存敏感信息在payload
- 刷新Token机制`,
    tags: ['jwt', '认证', '授权', '安全', 'token', 'fastapi'],
    category: '后端开发',
    createdAt: Date.now() - 86400000 * 17,
    source: '认证授权实践',
  },
  {
    id: 'k031',
    title: 'Linux 常用命令与运维技巧',
    content: `## Linux 实用命令

### 文件操作
\`\`\`bash
# 查找文件
find / -name "*.log" -mtime +7  # 7天前的日志
locate filename

# 查看大文件
du -sh /var/log/* | sort -rh | head -10

# 压缩解压
tar -czf archive.tar.gz dir/
tar -xzf archive.tar.gz
zip -r archive.zip dir/
\`\`\`

### 进程管理
\`\`\`bash
# 查看进程
ps aux | grep nginx
top  # 实时监控
htop  # 增强版top

# 后台运行
nohup node server.js &
systemctl start nginx
systemctl enable nginx  # 开机启动
\`\`\`

### 网络工具
\`\`\`bash
# 查看端口
netstat -tlnp
ss -tlnp
lsof -i :8080

# 网络诊断
ping example.com
curl -I https://example.com
traceroute example.com
dig example.com
\`\`\`

### 日志查看
\`\`\`bash
# 实时日志
tail -f /var/log/syslog
journalctl -u nginx -f

# 搜索日志
grep "ERROR" /var/log/app.log
grep -rn "keyword" /var/log/
\`\`\`

### 性能分析
\`\`\`bash
# 磁盘
df -h
iostat -x 1

# 内存
free -h
vmstat 1

# 网络
iftop
nethogs
\`\`\``,
    tags: ['linux', '运维', '命令行', 'shell', 'devops'],
    category: 'DevOps',
    createdAt: Date.now() - 86400000 * 18,
    source: 'Linux运维手册',
  },
  {
    id: 'k032',
    title: 'Nginx 反向代理与负载均衡',
    content: `## Nginx 配置

### 反向代理
\`\`\`nginx
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # WebSocket支持
    location /ws {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # 静态文件
    location /static/ {
        root /var/www/app;
        expires 30d;
    }
}
\`\`\`

### 负载均衡
\`\`\`nginx
upstream backend {
    # 轮询（默认）
    server 127.0.0.1:8001;
    server 127.0.0.1:8002;
    server 127.0.0.1:8003;

    # 权重
    server 127.0.0.1:8001 weight=3;
    server 127.0.0.1:8002 weight=1;

    # IP哈希（会话保持）
    ip_hash;

    # 健康检查
    server 127.0.0.1:8001 max_fails=3 fail_timeout=30s;
}

server {
    location / {
        proxy_pass http://backend;
    }
}
\`\`\`

### HTTPS配置
\`\`\`nginx
server {
    listen 443 ssl;
    server_name example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    # HTTP跳转HTTPS
    if ($scheme != "https") {
        return 301 https://$host$request_uri;
    }
}
\`\`\``,
    tags: ['nginx', '反向代理', '负载均衡', 'https', '运维'],
    category: 'DevOps',
    createdAt: Date.now() - 86400000 * 18,
    source: 'Nginx配置手册',
  },
  {
    id: 'k033',
    title: 'Pydantic 数据验证与序列化',
    content: `## Pydantic v2 使用

### 基本模型
\`\`\`python
from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: str = Field(..., pattern=r'^[^@]+@[^@]+\\.[^@]+$')
    password: str = Field(..., min_length=8)
    age: Optional[int] = Field(None, ge=0, le=150)

    @validator('username')
    def username_must_be_alphanumeric(cls, v):
        if not v.isalnum():
            raise ValueError('用户名只能包含字母和数字')
        return v

# 自动验证
user = UserCreate(
    username="test123",
    email="test@example.com",
    password="securepass123"
)
print(user.model_dump())  # 转dict
print(user.model_dump_json())  # 转JSON
\`\`\`

### 嵌套模型
\`\`\`python
class Address(BaseModel):
    city: str
    street: str
    zip_code: str

class User(BaseModel):
    name: str
    address: Address  # 嵌套

user = User(name="张三", address={"city": "北京", "street": "长安街", "zip_code": "100000"})
\`\`\`

### FastAPI集成
\`\`\`python
@app.post("/users")
async def create_user(user: UserCreate):
    # user已自动验证
    db_user = await db.create_user(user)
    return {"id": db_user.id, "username": db_user.username}
\`\`\`

### 优势
- 类型安全
- 自动文档生成
- 性能优异（Rust内核）
- 支持复杂数据结构`,
    tags: ['pydantic', 'python', '数据验证', 'fastapi', '序列化'],
    category: '后端开发',
    createdAt: Date.now() - 86400000 * 19,
    source: 'Pydantic文档',
  },
  {
    id: 'k034',
    title: 'SQLAlchemy ORM 完整指南',
    content: `## SQLAlchemy 2.0 异步ORM

### 模型定义
\`\`\`python
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import DeclarativeBase, relationship
from sqlalchemy.ext.asyncio import AsyncSession

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True)
    posts = relationship("Post", back_populates="author")

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    content = Column(Text)
    author_id = Column(Integer, ForeignKey("users.id"))
    author = relationship("User", back_populates="posts")
\`\`\`

### 异步查询
\`\`\`python
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

engine = create_async_engine("sqlite+aiosqlite:///./app.db")
async_session = async_sessionmaker(engine)

async def get_users():
    async with async_session() as session:
        result = await session.execute(select(User))
        return result.scalars().all()

async def create_user(username: str, email: str):
    async with async_session() as session:
        user = User(username=username, email=email)
        session.add(user)
        await session.commit()
        return user

async def get_user_with_posts(user_id: int):
    async with async_session() as session:
        stmt = select(User).where(User.id == user_id).options(
            selectinload(User.posts)
        )
        result = await session.execute(stmt)
        return result.scalar_one_or_none()
\`\`\`

### 迁移管理 (Alembic)
\`\`\`bash
alembic init migrations
alembic revision --autogenerate -m "create users table"
alembic upgrade head
\`\`\``,
    tags: ['sqlalchemy', 'orm', 'python', '数据库', '异步'],
    category: '数据库',
    createdAt: Date.now() - 86400000 * 19,
    source: 'SQLAlchemy文档',
  },
  {
    id: 'k035',
    title: 'Next.js 全栈框架指南',
    content: `## Next.js 14 App Router

### 文件路由系统
\`\`\`
app/
├── layout.tsx          # 根布局
├── page.tsx            # 首页 /
├── about/page.tsx      # /about
├── blog/
│   ├── page.tsx        # /blog
│   └── [slug]/page.tsx # /blog/:slug (动态路由)
├── api/
│   └── users/route.ts  # API路由 /api/users
└── dashboard/
    ├── layout.tsx      # 嵌套布局
    └── page.tsx        # /dashboard
\`\`\`

### Server Component
\`\`\`tsx
// 默认就是Server Component，直接访问数据库
export default async function BlogPage() {
  const posts = await db.post.findMany()
  return (
    <main>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </main>
  )
}
\`\`\`

### Client Component
\`\`\`tsx
'use client'
import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
\`\`\`

### API路由
\`\`\`typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const users = await db.user.findMany()
  return NextResponse.json(users)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const user = await db.user.create({ data: body })
  return NextResponse.json(user, { status: 201 })
}
\`\`\`

### 优势
- SSR/SSG/ISR多种渲染模式
- 文件系统路由
- 内置API路由
- 图片优化
- 内置字体优化`,
    tags: ['nextjs', 'react', '全栈', 'ssr', 'ssg', '框架'],
    category: '前端开发',
    createdAt: Date.now() - 86400000 * 20,
    source: 'Next.js文档',
  },
  {
    id: 'k036',
    title: 'Prisma 现代数据库ORM',
    content: `## Prisma 使用指南

### Schema定义
\`\`\`prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  content  String?
  author   User   @relation(fields: [authorId], references: [id])
  authorId Int
}
\`\`\`

### 查询操作
\`\`\`typescript
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// 创建
const user = await prisma.user.create({
  data: { email: 'test@test.com', name: '张三' }
})

// 查询
const users = await prisma.user.findMany({
  where: { name: { contains: '张' } },
  include: { posts: true },
  orderBy: { createdAt: 'desc' },
  take: 10
})

// 更新
await prisma.user.update({
  where: { id: 1 },
  data: { name: '李四' }
})

// 删除
await prisma.user.delete({ where: { id: 1 } })

// 事务
await prisma.$transaction([
  prisma.user.create({ data: { email: 'a@test.com' } }),
  prisma.user.create({ data: { email: 'b@test.com' } }),
])
\`\`\`

### 迁移
\`\`\`bash
npx prisma migrate dev --name init
npx prisma generate
npx prisma studio  # 可视化数据库
\`\`\``,
    tags: ['prisma', 'orm', 'typescript', '数据库', 'nodejs'],
    category: '数据库',
    createdAt: Date.now() - 86400000 * 20,
    source: 'Prisma文档',
  },
  {
    id: 'k037',
    title: 'Web安全防护大全',
    content: `## Web安全核心防护

### XSS 防护（跨站脚本）
\`\`\`typescript
// React自动转义（默认安全）
<div>{userInput}</div>

// 危险：直接插入HTML
<div dangerouslySetInnerHTML={{__html: userInput}} /> // 危险！

// 解决：使用DOMPurify
import DOMPurify from 'dompurify'
<div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(userInput)}} />
\`\`\`

### CSRF 防护（跨站请求伪造）
\`\`\`python
# FastAPI中间件
@app.middleware("http")
async def csrf_check(request: Request):
    if request.method in ["POST", "PUT", "DELETE"]:
        token = request.headers.get("X-CSRF-Token")
        if token != expected_token:
            return JSONResponse(403, {"error": "CSRF token invalid"})
    return await call_next(request)
\`\`\`

### SQL注入防护
\`\`\`python
# 危险：字符串拼接
cursor.execute(f"SELECT * FROM users WHERE name = '{name}'")

# 安全：参数化查询
cursor.execute("SELECT * FROM users WHERE name = %s", (name,))

# 安全：ORM
session.query(User).filter(User.name == name).all()
\`\`\`

### 其他安全措施
- **HTTPS**：全站强制HTTPS
- **CORS**：限制跨域来源
- **CSP**：内容安全策略
- **Rate Limit**：限流防暴力破解
- **密码加密**：bcrypt/scrypt
- **敏感信息**：环境变量管理
- **依赖安全**：定期npm audit
- **日志脱敏**：不记录密码/Token`,
    tags: ['安全', 'xss', 'csrf', 'sql注入', 'web安全', '防护'],
    category: '安全',
    createdAt: Date.now() - 86400000 * 21,
    source: 'Web安全实践',
  },
  {
    id: 'k038',
    title: 'Prompt Engineering 提示词工程',
    content: `## 提示词工程技巧

### 基本原则
1. **明确角色**：让AI扮演特定角色
2. **具体描述**：避免模糊指令
3. **提供示例**：用few-shot引导
4. **分步骤**：复杂任务拆解
5. **设定约束**：格式、长度、风格

### 角色提示
\`\`\`
你是一位资深Python后端工程师，精通FastAPI。
请帮我设计一个RESTful API，要求：
1. 遵循REST规范
2. 包含错误处理
3. 添加类型注解
4. 编写完整Docstring
\`\`\`

### Few-Shot 示例
\`\`\`
请将以下句子分类为"正面"或"负面"：

示例：
"这个产品很好用" → 正面
"服务态度太差了" → 负面
"质量一般般吧" → 中性

分类：
"超出预期的体验" →
\`\`\`

### Chain of Thought (思维链)
\`\`\`
请一步步分析以下问题：
1. 首先理解需求
2. 然后设计方案
3. 接着实现代码
4. 最后验证结果

问题：实现一个用户注册API
\`\`\`

### 结构化输出
\`\`\`
请以JSON格式输出，包含以下字段：
{
  "title": "功能标题",
  "description": "功能描述",
  "code": "代码实现",
  "tests": "测试用例"
}
\`\`\`

### 常用技巧
- Temperature: 0=确定性, 0.7=创造性, 1=随机
- Top-P: 控制多样性
- 最大Token: 控制输出长度
- 系统提示: 设定全局行为`,
    tags: ['prompt', '提示词', 'ai', 'llm', '工程', '技巧'],
    category: 'AI/智能体',
    createdAt: Date.now() - 86400000 * 21,
    source: 'Prompt工程指南',
  },
  {
    id: 'k039',
    title: 'PostgreSQL 高级特性',
    content: `## PostgreSQL 进阶

### JSONB操作
\`\`\`sql
-- 存储JSON
INSERT INTO events (data) VALUES ('{"type":"click","page":"home"}');

-- 查询JSON字段
SELECT data->>'type' FROM events WHERE data->>'page' = 'home';

-- JSON索引
CREATE INDEX idx_events_data ON events USING gin(data);

-- 更新JSON
UPDATE events SET data = jsonb_set(data, '{time}', 'now()');
\`\`\`

### 窗口函数
\`\`\`sql
-- 排名
SELECT name, score,
  RANK() OVER (ORDER BY score DESC) as rank,
  DENSE_RANK() OVER (ORDER BY score DESC) as dense_rank,
  ROW_NUMBER() OVER (ORDER BY score DESC) as row_num
FROM students;

-- 分组排名
SELECT name, class, score,
  RANK() OVER (PARTITION BY class ORDER BY score DESC) as class_rank
FROM students;

-- 累计求和
SELECT date, revenue,
  SUM(revenue) OVER (ORDER BY date) as cumulative
FROM daily_sales;
\`\`\`

### CTE递归查询
\`\`\`sql
-- 组织架构树
WITH RECURSIVE org_tree AS (
  -- 基础查询：顶层
  SELECT id, name, parent_id, 0 as level
  FROM departments WHERE parent_id IS NULL

  UNION ALL

  -- 递归：子节点
  SELECT d.id, d.name, d.parent_id, ot.level + 1
  FROM departments d
  JOIN org_tree ot ON d.parent_id = ot.id
)
SELECT * FROM org_tree ORDER BY level;
\`\`\`

### 全文搜索
\`\`\`sql
-- 创建全文索引
CREATE INDEX idx_articles_fts ON articles USING gin(to_tsvector('chinese', content));

-- 搜索
SELECT * FROM articles
WHERE to_tsvector('chinese', content) @@ to_tsquery('chinese', '关键词');
\`\`\``,
    tags: ['postgresql', 'postgres', '数据库', 'sql', 'jsonb', '窗口函数'],
    category: '数据库',
    createdAt: Date.now() - 86400000 * 22,
    source: 'PostgreSQL文档',
  },
  {
    id: 'k040',
    title: 'React 性能优化全攻略',
    content: `## React 性能优化

### 1. 组件优化
\`\`\`tsx
// React.memo 避免不必要重渲染
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{data.map(item => <Item key={item.id} {...item} />)}</div>
})

// useMemo 缓存计算结果
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.id - b.id)
}, [data])

// useCallback 缓存函数
const handleClick = useCallback((id) => {
  setSelected(id)
}, [])
\`\`\`

### 2. 虚拟列表
\`\`\`tsx
import { FixedSizeList } from 'react-window'

// 渲染10000条数据不卡
<FixedSizeList height={600} itemCount={10000} itemSize={50} width="100%">
  {({ index, style }) => (
    <div style={style}>Item {index}</div>
  )}
</FixedSizeList>
\`\`\`

### 3. 代码分割
\`\`\`tsx
// 路由级懒加载
const Dashboard = lazy(() => import('./Dashboard'))
const Settings = lazy(() => import('./Settings'))

<Suspense fallback={<Spinner />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/settings" element={<Settings />} />
  </Routes>
</Suspense>
\`\`\`

### 4. 状态优化
\`\`\`tsx
// Zustand选择器：只订阅需要的字段
const userName = useUserStore(state => state.name)
// 不是：const user = useUserStore(state => state) // 订阅整个store

// 拆分store：避免大store导致重渲染
\`\`\`

### 5. 其他技巧
- 图片懒加载: loading="lazy"
- 防抖/节流: lodash.debounce
- Web Worker: 耗时计算放后台
- requestIdleCallback: 空闲时执行
- CSS containment: contain属性`,
    tags: ['react', '性能优化', '虚拟列表', '懒加载', 'memo'],
    category: '前端开发',
    createdAt: Date.now() - 86400000 * 22,
    source: 'React性能优化',
  },
  {
    id: 'k041',
    title: 'GraphQL API 设计与实现',
    content: `## GraphQL 核心

### Schema定义
\`\`\`graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  content: String
  author: User!
}

type Query {
  user(id: ID!): User
  users(limit: Int = 10): [User!]!
  posts(authorId: ID): [Post!]!
}

type Mutation {
  createUser(name: String!, email: String!): User!
  updateUser(id: ID!, name: String): User!
  deleteUser(id: ID!): Boolean!
}
\`\`\`

### 查询示例
\`\`\`graphql
# 精确获取需要的字段
query {
  user(id: 1) {
    name
    email
    posts {
      title
    }
  }
}

# 批量查询
query {
  users(limit: 5) {
    name
  }
  posts {
    title
    author {
      name
    }
  }
}
\`\`\`

### Python实现 (Strawberry)
\`\`\`python
import strawberry

@strawberry.type
class User:
    id: strawberry.ID
    name: str
    email: str

@strawberry.type
class Query:
    @strawberry.field
    def user(self, id: strawberry.ID) -> User:
        return db.get_user(id)

schema = strawberry.Schema(query=Query)
\`\`\`

### vs REST
- GraphQL: 客户端精确获取所需字段，一次请求多个资源
- REST: 固定字段，可能过度获取或不足
- GraphQL适合复杂数据关系，REST适合简单CRUD`,
    tags: ['graphql', 'api', '查询语言', 'schema', 'strawberry'],
    category: '后端开发',
    createdAt: Date.now() - 86400000 * 23,
    source: 'GraphQL文档',
  },
  {
    id: 'k042',
    title: '微服务架构设计模式',
    content: `## 微服务架构

### 核心模式

#### 1. 服务拆分
\`\`\`
单体应用 → 按业务领域拆分
├── 用户服务 (User Service)
├── 订单服务 (Order Service)
├── 商品服务 (Product Service)
├── 支付服务 (Payment Service)
└── 通知服务 (Notification Service)
\`\`\`

#### 2. API网关
\`\`\`python
# API网关统一入口
@app.route("/api/users/<user_id>")
async def get_user(user_id):
    return await user_service.get(user_id)

@app.route("/api/orders")
async def create_order():
    # 调用多个服务
    order = await order_service.create()
    await notification_service.send(order)
    return order
\`\`\`

#### 3. 服务发现
\`\`\`yaml
# Consul / Eureka 注册中心
services:
  user-service:
    instances:
      - host: 10.0.0.1
        port: 8001
      - host: 10.0.0.2
        port: 8001
\`\`\`

#### 4. 消息队列 (异步通信)
\`\`\`python
# 发布事件
await redis.publish("order_created", order_data)

# 订阅处理
@redis.subscribe("order_created")
async def handle_order(order_data):
    await send_email(order_data)
    await update_inventory(order_data)
\`\`\`

#### 5. 熔断器模式
\`\`\`python
from circuitbreaker import circuit

@circuit(failure_threshold=5, recovery_timeout=30)
async def call_payment_service():
    # 连续失败5次后熔断30秒
    return await payment_api.charge()
\`\`\`

### 优势
- 独立部署和扩展
- 技术栈灵活
- 故障隔离
- 团队自治

### 挑战
- 分布式事务复杂
- 运维成本高
- 网络延迟
- 数据一致性`,
    tags: ['微服务', '架构', '分布式', 'api网关', '服务发现'],
    category: '架构设计',
    createdAt: Date.now() - 86400000 * 23,
    source: '微服务架构',
  },
  {
    id: 'k043',
    title: 'Framer Motion 动画库使用',
    content: `## Framer Motion 动画

### 基础动画
\`\`\`tsx
import { motion } from 'framer-motion'

// 淡入
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  淡入内容
</motion.div>

// 弹性
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  点击我
</motion.button>
\`\`\`

### 列表动画
\`\`\`tsx
import { AnimatePresence } from 'framer-motion'

const list = items.map((item, i) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ delay: i * 0.1 }}
  >
    {item.name}
  </motion.div>
))

<AnimatePresence>
  {list}
</AnimatePresence>
\`\`\`

### 拖拽
\`\`\`tsx
<motion.div
  drag
  dragConstraints={{ left: 0, right: 300, top: 0, bottom: 300 }}
  whileDrag={{ scale: 1.1 }}
>
  拖拽我
</motion.div>
\`\`\`

### 手势识别
\`\`\`tsx
<motion.div
  onPan={(e, info) => console.log(info.offset.x, info.offset.y)}
  onHoverStart={() => console.log('hover')}
  onTap={() => console.log('tap')}
>
  手势区域
</motion.div>
\`\`\`

### 滚动动画
\`\`\`tsx
import { useScroll, useTransform } from 'framer-motion'

const { scrollY } = useScroll()
const opacity = useTransform(scrollY, [0, 200], [1, 0])

<motion.div style={{ opacity }}>
  随滚动淡出
</motion.div>
\`\`\``,
    tags: ['framer-motion', '动画', 'react', '交互', 'ui'],
    category: '前端开发',
    createdAt: Date.now() - 86400000 * 24,
    source: 'Framer Motion文档',
  },
  {
    id: 'k044',
    title: 'Electron 桌面应用开发',
    content: `## Electron 桌面应用

### 项目结构
\`\`\`
my-app/
├── main.js          # 主进程
├── preload.js       # 预加载脚本
├── renderer/        # 渲染进程（前端）
│   ├── index.html
│   └── app.tsx
└── package.json
\`\`\`

### 主进程
\`\`\`javascript
const { app, BrowserWindow, ipcMain } = require('electron')

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  win.loadFile('renderer/index.html')
  // 或加载开发服务器
  // win.loadURL('http://localhost:5173')
}

app.whenReady().then(createWindow)
\`\`\`

### IPC通信
\`\`\`javascript
// preload.js - 桥接
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  saveFile: (data) => ipcRenderer.invoke('save-file', data),
  readFile: () => ipcRenderer.invoke('read-file')
})

// main.js - 处理
ipcMain.handle('save-file', async (event, data) => {
  await fs.writeFile('data.json', JSON.stringify(data))
  return true
})
\`\`\`

### 打包发布
\`\`\`bash
# 使用electron-builder
npx electron-builder --mac --win --linux

# 或使用electron-forge
npx electron-forge make
\`\`\`

### 知名应用
- VS Code
- Discord
- Slack
- Figma (桌面版)`,
    tags: ['electron', '桌面应用', 'nodejs', '跨平台', 'native'],
    category: '前端开发',
    createdAt: Date.now() - 86400000 * 24,
    source: 'Electron文档',
  },
  {
    id: 'k045',
    title: 'Embedding 向量化与语义搜索',
    content: `## 文本向量化

### 什么是Embedding
将文本转为高维向量，使语义相近的文本在向量空间中距离更近。

### OpenAI Embedding
\`\`\`python
from openai import OpenAI
client = OpenAI()

# 生成向量
response = client.embeddings.create(
    model="text-embedding-3-small",
    input="React是一个UI框架"
)
vector = response.data[0].embedding  # 1536维向量
\`\`\`

### 开源Embedding模型
\`\`\`python
# 使用 sentence-transformers (本地运行)
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')
vectors = model.encode([
    "React是UI框架",
    "Vue是渐进式框架",
    "Python是编程语言"
])
# vectors[0] 和 vectors[1] 距离近，和 vectors[2] 距离远
\`\`\`

### 相似度计算
\`\`\`python
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# 余弦相似度
sim = cosine_similarity([vec1], [vec2])[0][0]
# 0-1之间，越接近1越相似

# 点积（归一化后等价于余弦）
dot = np.dot(vec1, vec2)
\`\`\`

### 语义搜索实现
\`\`\`python
class SemanticSearch:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.documents = []
        self.vectors = []

    def add(self, doc: str):
        vec = self.model.encode(doc)
        self.documents.append(doc)
        self.vectors.append(vec)

    def search(self, query: str, top_k: int = 3):
        q_vec = self.model.encode(query)
        sims = cosine_similarity([q_vec], self.vectors)[0]
        top_idx = np.argsort(sims)[-top_k:][::-1]
        return [(self.documents[i], sims[i]) for i in top_idx]
\`\`\`

### 应用场景
- 语义搜索（比关键词更智能）
- 推荐系统
- 去重
- 聚类分析
- RAG检索增强`,
    tags: ['embedding', '向量化', '语义搜索', 'ai', 'nlp', '相似度'],
    category: 'AI/智能体',
    createdAt: Date.now() - 86400000 * 25,
    source: '向量化技术',
  },
  {
    id: 'k046',
    title: '测试驱动开发TDD实践',
    content: `## TDD (Test-Driven Development)

### 核心循环：红-绿-重构
1. **红**：先写测试（会失败，因为功能还没实现）
2. **绿**：写最少代码让测试通过
3. **重构**：优化代码，保持测试通过

### 示例：开发一个计算器
\`\`\`python
# 第1步：红 - 写测试
def test_add():
    assert add(1, 2) == 3
    assert add(-1, 1) == 0
    assert add(0, 0) == 0

# 第2步：绿 - 实现
def add(a, b):
    return a + b

# 第3步：重构 - 已是最简，无需重构
\`\`\`

### pytest 完整示例
\`\`\`python
import pytest

class TestBankAccount:
    def setup_method(self):
        self.account = BankAccount(100)

    def test_deposit(self):
        self.account.deposit(50)
        assert self.account.balance == 150

    def test_withdraw(self):
        self.account.withdraw(30)
        assert self.account.balance == 70

    def test_insufficient_funds(self):
        with pytest.raises(InsufficientFundsError):
            self.account.withdraw(200)

    @pytest.mark.parametrize("amount,expected", [
        (10, 90), (50, 50), (100, 0)
    ])
    def test_withdraw_amounts(self, amount, expected):
        self.account.withdraw(amount)
        assert self.account.balance == expected
\`\`\`

### Vitest (前端)
\`\`\`typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('Counter', () => {
  it('should increment', () => {
    render(<Counter />)
    const button = screen.getByText('Click')
    fireEvent.click(button)
    expect(screen.getByText('1')).toBeInTheDocument()
  })
})
\`\`\`

### 测试金字塔
\`\`\`
      /  E2E  \\      少量（端到端测试）
     /--------\\
    /Integration\\    适量（集成测试）
   /------------\\
  /    Unit     \\   大量（单元测试）
 /----------------\\
\`\`\``,
    tags: ['tdd', '测试', 'pytest', 'vitest', '最佳实践'],
    category: '工程化',
    createdAt: Date.now() - 86400000 * 25,
    source: 'TDD实践',
  },
  {
    id: 'k047',
    title: 'RESTful API vs GraphQL vs gRPC',
    content: `## 三种API风格对比

### RESTful API
\`\`\`
GET    /api/users          # 列表
GET    /api/users/1        # 详情
POST   /api/users          # 创建
PUT    /api/users/1        # 更新
DELETE /api/users/1        # 删除

# 优点：简单、缓存友好、成熟
# 缺点：过度获取/不足获取、多请求
\`\`\`

### GraphQL
\`\`\`graphql
# 客户端精确指定字段
query {
  user(id: 1) {
    name
    email
    posts(limit: 3) {
      title
    }
  }
}

# 优点：精确获取、一次请求
# 缺点：复杂、缓存难、N+1问题
\`\`\`

### gRPC
\`\`\`protobuf
// 定义服务
service UserService {
  rpc GetUser (UserRequest) returns (UserResponse);
  rpc ListUsers (ListRequest) returns (stream UserResponse);
}

// 优点：高性能、强类型、流式
// 缺点：浏览器不支持（需gRPC-Web）、学习曲线
\`\`\`

### 选择建议

| 场景 | 推荐 |
|------|------|
| 公开API | REST |
| 内部微服务 | gRPC |
| 复杂查询 | GraphQL |
| 实时通信 | WebSocket |
| 简单CRUD | REST |
| 移动端 | REST + BFF |

### 混合架构
\`\`\`
客户端 → GraphQL BFF → REST/gRPC 微服务
\`\`\`
- BFF层聚合多个微服务
- 内部用gRPC高性能通信
- 对外暴露GraphQL灵活查询`,
    tags: ['rest', 'graphql', 'grpc', 'api', '对比', '架构'],
    category: '架构设计',
    createdAt: Date.now() - 86400000 * 26,
    source: 'API设计对比',
  },
  {
    id: 'k048',
    title: '开源免费AI服务汇总',
    content: `## 免费AI服务资源

### 大语言模型 (免费额度)
1. **Google Gemini** - 免费API
   - gemini-1.5-flash: 免费
   - 注册：https://aistudio.google.com/

2. **Groq** - 超快推理
   - Llama 3 / Mixtral 免费
   - 注册：https://console.groq.com/

3. **Cohere** - 免费额度
   - Command R / Command R+
   - 注册：https://dashboard.cohere.com/

4. **Together AI** - 开源模型
   - 每月$1免费额度
   - 注册：https://api.together.xyz/

5. **OpenRouter** - 聚合平台
   - 部分模型免费
   - 注册：https://openrouter.ai/

### Embedding模型 (开源免费)
\`\`\`python
# 本地运行，完全免费
from sentence_transformers import SentenceTransformer

# 轻量级模型
model = SentenceTransformer('all-MiniLM-L6-v2')  # 384维, 80MB

# 多语言模型
model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

# 高质量模型
model = SentenceTransformer('bge-large-en-v1.5')  # 1024维
\`\`\`

### 向量数据库 (开源免费)
1. **ChromaDB** - 轻量级，本地部署
   \`\`\`bash
   pip install chromadb
   \`\`\`

2. **Qdrant** - 高性能，Docker部署
   \`\`\`bash
   docker run -p 6333:6333 qdrant/qdrant
   \`\`\`

3. **Milvus** - 大规模，Docker部署
   \`\`\`bash
   docker compose up milvus-standalone
   \`\`\`

4. **FAISS** - Facebook开源向量搜索库
   \`\`\`bash
   pip install faiss-cpu
   \`\`\`

### 搜索API
1. **Tavily** - AI搜索API，免费1000次/月
2. **Serper.dev** - Google搜索API，免费2500次/月
3. **DuckDuckGo** - 完全免费
   \`\`\`python
   from duckduckgo_search import DDGS
   results = DDGS().text("query", max_results=5)
   \`\`\`

### 代码执行沙箱
1. **E2B** - 免费沙箱，每月100小时
2. **Judge0** - 开源代码执行引擎
3. **Docker** - 自建沙箱`,
    tags: ['免费', '开源', 'ai', 'api', 'gemini', 'groq', '资源'],
    category: 'AI/智能体',
    createdAt: Date.now() - 86400000 * 26,
    source: '开源社区汇总',
  },
  {
    id: 'k049',
    title: 'Project Genesis - Nexus-1 智能体框架',
    content: `## Nexus-1 核心智能体后端框架

### 项目定位
Nexus-1 是高度模块化的"任务路由与记忆中枢"，解决LLM两大痛点：
1. 长对话记忆丢失
2. 无法自主执行复杂多步操作

### 技术栈
- **后端**: Python + FastAPI
- **AI编排**: LangChain / AutoGen
- **向量数据库**: ChromaDB / Milvus
- **前端**: Streamlit → Next.js

### 核心算法
1. **ReAct算法**：思考→行动→观察闭环
2. **RAG检索**：向量化存储+语义检索
3. **动态上下文管理**：自动压缩旧对话

### API接入
- LLM: OpenRouter / DeepSeek
- 搜索: Tavily / Serper.dev
- 沙箱: E2B / Docker

### 核心交付文件
- main.py: 启动入口
- agent_core.py: ReAct引擎 + 任务拆解
- memory_store.py: 向量记忆存储

### 设计规范
- 配置中心化（.env）
- 插件化架构
- 全链路日志监控`,
    tags: ['nexus-1', 'project-genesis', '智能体', 'fastapi', 'react', 'rag'],
    category: 'AI/智能体',
    createdAt: Date.now() - 86400000 * 27,
    source: '项目需求文档',
  },
]

interface KnowledgeState {
  entries: KnowledgeEntry[]
  selectedEntry: string | null
  searchQuery: string
  addEntry: (entry: KnowledgeEntry) => void
  deleteEntry: (id: string) => void
  selectEntry: (id: string | null) => void
  setSearch: (query: string) => void
  resetToDefault: () => void
}

export const useKnowledgeStore = create<KnowledgeState>()(
  persist(
    (set) => ({
      entries: sampleEntries,
      selectedEntry: null,
      searchQuery: '',
      addEntry: (entry) =>
        set((state) => {
          // 避免重复ID
          if (state.entries.some(e => e.id === entry.id)) {
            return state
          }
          return { entries: [entry, ...state.entries] }
        }),
      deleteEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        })),
      selectEntry: (id) => set({ selectedEntry: id }),
      setSearch: (query) => set({ searchQuery: query }),
      // 重置为默认知识（清空导入的数据）
      resetToDefault: () => set({ entries: sampleEntries }),
    }),
    {
      name: 'hopeai-knowledge-store',
      storage: createJSONStorage(() => localStorage),
      version: 2,
      // 只持久化entries，不持久化UI状态（selectedEntry/searchQuery）
      partialize: (state) => ({ entries: state.entries }),
      // 合并策略：保留用户导入的数据 + 确保内置知识存在
      merge: (persisted, current) => {
        const persistedState = persisted as { entries?: KnowledgeEntry[] }
        const persistedEntries = persistedState?.entries || []
        const defaultIds = new Set(sampleEntries.map(e => e.id))
        const userImported = persistedEntries.filter(e => !defaultIds.has(e.id))
        // 合并：内置知识 + 用户导入的知识
        return {
          ...current,
          entries: [...userImported, ...sampleEntries],
        }
      },
    }
  )
)
