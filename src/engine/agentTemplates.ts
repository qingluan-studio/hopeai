import { useKnowledgeStore } from '@/store/useKnowledgeStore'
import type { KnowledgeEntry } from '@/types'

export interface AgentTemplate {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
  generateResponse: (command: string, context?: Record<string, unknown>) => Promise<string>;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * RAG检索：从知识库中搜索相关知识
 * 在Agent生成回答前调用，让回答更准确
 */
function searchKnowledge(command: string, topK: number = 3): string {
  try {
    const entries: KnowledgeEntry[] = useKnowledgeStore.getState().entries
    if (!entries || entries.length === 0) return ''

    const cmdLower = command.toLowerCase()
    const cmdWords = cmdLower.split(/[\s,，。、！？]+/).filter(w => w.length > 1)

    // 计算每条知识的相关度分数
    const scored = entries.map(entry => {
      let score = 0
      const titleLower = entry.title.toLowerCase()
      const contentLower = entry.content.toLowerCase()
      const tagsLower = entry.tags.map(t => t.toLowerCase()).join(' ')

      // 标题匹配权重高
      for (const word of cmdWords) {
        if (titleLower.includes(word)) score += 3
        if (tagsLower.includes(word)) score += 2
        if (contentLower.includes(word)) score += 1
      }

      // 完全匹配标签
      for (const tag of entry.tags) {
        if (cmdLower.includes(tag.toLowerCase()) && tag.length > 1) score += 2
      }

      return { entry, score }
    })

    // 按分数排序，取Top-K
    const relevant = scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)

    if (relevant.length === 0) return ''

    // 格式化为参考资料
    const refs = relevant.map((s, i) => {
      return `【参考${i + 1}】${s.entry.title}\n${s.entry.content.slice(0, 500)}...`
    }).join('\n\n')

    return refs
  } catch {
    return ''
  }
}

export const analystTemplate: AgentTemplate = {
  id: 'analyst',
  name: '分析员',
  role: '需求分析师',
  avatar: '🔍',
  description: '接收命令后生成分析报告，拆解需求、提出方案、列出步骤',
  generateResponse: async (command: string) => {
    await delay(800 + Math.random() * 1200);
    const projectType = detectProjectType(command);
    const knowledgeRef = searchKnowledge(command, 3);

    // 从 command 中提取关键功能点
    const extractKeywords = (): string[] => {
      const matched = command.match(/[\u4e00-\u9fa5a-zA-Z_]{2,}/g) ?? [];
      const stopWords = new Set(['需求', '设计', '方案', '系统', '功能', '实现', '一个', '我们', '帮我', '开发', '请', 'the', 'a', 'an', 'of', 'and', 'to', 'for', 'with']);
      const filtered = matched.filter(w => !stopWords.has(w.toLowerCase()));
      return filtered.length > 0 ? filtered.slice(0, 5) : ['核心功能'];
    };

    const keywords = extractKeywords();

    // 根据项目类型推荐技术栈
    const techStackMap: Record<string, { stack: string[]; architecture: string; riskFocus: string }> = {
      'python-backend': {
        stack: ['FastAPI - 现代 async Web 框架', 'SQLAlchemy 2.0 - 异步 ORM', 'Pydantic - 类型校验与序列化', 'Uvicorn - ASGI 高性能服务器', 'Alembic - 数据库迁移'],
        architecture: '分层架构：Router → Service → Repository，配合依赖注入与异步 IO',
        riskFocus: '异步上下文传播、数据库连接池耗尽、Pydantic 模型校验遗漏',
      },
      'ai-agent': {
        stack: ['LangChain - LLM 编排框架', 'ChromaDB - 向量记忆库', 'OpenAI API - 大语言模型', 'ReAct 算法 - 推理-行动循环', 'Tavily - 联网搜索工具'],
        architecture: 'ReAct 闭环 + RAG 检索增强，配合长期记忆与工具调度器',
        riskFocus: 'ReAct 死循环、Token 超限、记忆污染、工具调用安全性',
      },
      'react-frontend': {
        stack: ['React 18 - UI 视图框架', 'TypeScript - 类型安全', 'TailwindCSS - 原子化样式', 'Vite - 极速构建工具', 'Zustand - 轻量状态管理'],
        architecture: '组件化设计 + Hooks 复用，按页面/组件/Hook/Store 分层',
        riskFocus: '状态管理复杂度、首屏加载性能、可访问性、SSR/CSR 一致性',
      },
      'database': {
        stack: ['MySQL 8 / PostgreSQL 16 - 关系型数据库', 'Redis 7 - 缓存与会话', 'Prisma / SQLAlchemy - ORM', 'Flyway - 版本化迁移', 'pgvector - 向量扩展'],
        architecture: '主从读写分离 + 分库分表，配合 Redis 缓存层与慢查询监控',
        riskFocus: '索引设计、SQL 注入、事务隔离级别、数据一致性',
      },
      'general': {
        stack: ['TypeScript - 类型安全基础', 'Vite - 构建工具', 'ESLint + Prettier - 代码规范', 'Vitest - 单元测试', 'Docker - 容器化部署'],
        architecture: '模块化 + 配置中心化，遵循 SOLID 原则与单一职责',
        riskFocus: '需求变更频繁、依赖版本升级、配置管理混乱',
      },
    };

    const tech = techStackMap[projectType] ?? techStackMap['general'];

    // 根据关键词数量估算功能模块与耗时
    const moduleCount = Math.max(3, Math.min(keywords.length + 1, 6));
    const estimateMinutes = (base: number, complexity: number) => base * complexity;

    const modules = keywords.map((kw, i) => `${i + 1}. ${kw} 模块 - 围绕「${kw}」的核心业务逻辑与数据流`).join('\n');
    const steps = [
      { task: '需求确认与方案设计', time: estimateMinutes(10, 1) },
      { task: '核心功能开发', time: estimateMinutes(15, moduleCount) },
      { task: '接口联调与代码审查', time: estimateMinutes(8, moduleCount) },
      { task: '测试与部署上线', time: estimateMinutes(12, 1) },
    ];
    const totalTime = steps.reduce((sum, s) => sum + s.time, 0);

    return `## 需求分析报告

### 一、需求拆解
**原始需求**：${command}

**项目类型识别**：\`${projectType}\`

**核心目标**：
- 目标1：解析「${keywords[0] ?? '核心功能'}」相关的核心诉求
- 目标2：界定功能边界，识别 ${keywords.length} 个关键模块
- 目标3：制定与「${command.slice(0, 30)}」相匹配的可执行路径

**功能模块**（基于指令关键词提取）：
${modules}

### 二、技术方案
**推荐技术栈**（适配 ${projectType} 类型）：
${tech.stack.map(s => `- ${s}`).join('\n')}

**架构设计**：
${tech.architecture}

### 三、实施步骤
| 阶段 | 任务 | 预计耗时 |
|------|------|----------|
| 1 | ${steps[0].task} | ${steps[0].time}min |
| 2 | ${steps[1].task} | ${steps[1].time}min |
| 3 | ${steps[2].task} | ${steps[2].time}min |
| 4 | ${steps[3].task} | ${steps[3].time}min |

**总预计耗时**：约 ${totalTime}min

### 四、风险评估
- 潜在风险：${tech.riskFocus}
- 需求相关风险：实现「${keywords[0] ?? '核心功能'}」时可能涉及外部依赖与边界情况
- 应对措施：采用迭代开发模式，先实现 MVP 再逐步完善；针对上述风险编写回归测试

---
*请确认以上分析是否符合「${command.slice(0, 20)}」的预期，或提出调整意见。*${
      knowledgeRef
        ? `\n\n---\n📚 **知识库参考**（RAG检索）\n\n${knowledgeRef}`
        : ''
    }`;
  }
};

// 根据用户指令检测需求类型
function detectProjectType(command: string): 'python-backend' | 'react-frontend' | 'database' | 'ai-agent' | 'general' {
  const cmd = command.toLowerCase();
  if (cmd.includes('python') || cmd.includes('fastapi') || cmd.includes('flask') || cmd.includes('django') || cmd.includes('后端') || cmd.includes('backend') || cmd.includes('api接口') || cmd.includes('main.py') || cmd.includes('agent_core') || cmd.includes('memory_store')) {
    return 'python-backend';
  }
  if (cmd.includes('react') || cmd.includes('vue') || cmd.includes('前端') || cmd.includes('frontend') || cmd.includes('组件') || cmd.includes('ui界面') || cmd.includes('tsx') || cmd.includes('next.js') || cmd.includes('tailwind')) {
    return 'react-frontend';
  }
  if (cmd.includes('sql') || cmd.includes('数据库') || cmd.includes('database') || cmd.includes('建表') || cmd.includes('mysql') || cmd.includes('postgres') || cmd.includes('create table')) {
    return 'database';
  }
  if (cmd.includes('ai') || cmd.includes('智能体') || cmd.includes('agent') || cmd.includes('langchain') || cmd.includes('autogen') || cmd.includes('llm') || cmd.includes('rag') || cmd.includes('react算法') || cmd.includes('向量') || cmd.includes('chromadb') || cmd.includes('记忆库')) {
    return 'ai-agent';
  }
  return 'general';
}

export const coderATemplate: AgentTemplate = {
  id: 'coder-a',
  name: '代码员A',
  role: '核心架构工程师',
  avatar: '🎨',
  description: '根据需求类型生成完整的核心架构代码',
  generateResponse: async (command: string) => {
    await delay(1000 + Math.random() * 1500);
    const projectType = detectProjectType(command);

    let codeExample = '';

    if (projectType === 'python-backend') {
      codeExample = `\`\`\`python
# main.py - 系统统一启动入口
import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

from agent_core import AgentCore
from memory_store import MemoryStore
from routers import task_router, memory_router, plugin_router

# 加载环境变量
load_dotenv()

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# 全局实例
agent_core: AgentCore = None
memory_store: MemoryStore = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    global agent_core, memory_store
    logger.info("正在初始化 Nexus-1 核心系统...")

    # 初始化记忆存储
    memory_store = MemoryStore(
        db_path=os.getenv("CHROMA_DB_PATH", "./data/chroma"),
        collection_name="nexus_memory"
    )
    await memory_store.initialize()

    # 初始化核心智能体
    agent_core = AgentCore(
        llm_api_key=os.getenv("OPENROUTER_API_KEY"),
        llm_model=os.getenv("LLM_MODEL", "deepseek/deepseek-chat"),
        memory_store=memory_store,
        search_api_key=os.getenv("TAVILY_API_KEY"),
        sandbox_enabled=os.getenv("SANDBOX_ENABLED", "true").lower() == "true"
    )
    await agent_core.initialize()

    logger.info("Nexus-1 核心系统初始化完成")
    yield

    # 清理资源
    if memory_store:
        await memory_store.close()
    logger.info("Nexus-1 系统已关闭")

# 创建 FastAPI 应用
app = FastAPI(
    title="Nexus-1 Core Agent Framework",
    description="Project Genesis - 下一代智能体后端框架",
    version="1.0.0",
    lifespan=lifespan
)

# CORS 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(task_router.router, prefix="/api/tasks", tags=["tasks"])
app.include_router(memory_router.router, prefix="/api/memory", tags=["memory"])
app.include_router(plugin_router.router, prefix="/api/plugins", tags=["plugins"])

@app.get("/")
async def root():
    return {"status": "running", "service": "Nexus-1", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "agents_ready": agent_core is not None}

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"未处理的异常: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": "internal_server_error", "detail": str(exc)}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 8000)),
        reload=os.getenv("DEBUG", "false").lower() == "true"
    )
\`\`\`

\`\`\`python
# agent_core.py - 核心大脑逻辑
import json
import logging
from typing import Optional
from dataclasses import dataclass, field

from memory_store import MemoryStore

logger = logging.getLogger(__name__)

@dataclass
class Thought:
    """ReAct 思考节点"""
    step: int
    thought: str
    action: Optional[str] = None
    action_input: Optional[str] = None
    observation: Optional[str] = None

@dataclass
class TaskDecomposition:
    """任务拆解结果"""
    main_task: str
    subtasks: list = field(default_factory=list)
    required_tools: list = field(default_factory=list)
    estimated_steps: int = 0

class AgentCore:
    """Nexus-1 核心智能体"""

    def __init__(
        self,
        llm_api_key: str,
        llm_model: str,
        memory_store: MemoryStore,
        search_api_key: Optional[str] = None,
        sandbox_enabled: bool = True
    ):
        self.llm_api_key = llm_api_key
        self.llm_model = llm_model
        self.memory = memory_store
        self.search_api_key = search_api_key
        self.sandbox_enabled = sandbox_enabled
        self.plugins = {}  # 插件注册表
        self.max_react_iterations = 10

    async def initialize(self):
        """初始化核心组件"""
        logger.info(f"初始化 AgentCore，模型: {self.llm_model}")
        await self._register_default_plugins()

    async def _register_default_plugins(self):
        """注册默认插件"""
        from plugins.search_plugin import SearchPlugin
        from plugins.code_sandbox import CodeSandboxPlugin

        self.plugins["search"] = SearchPlugin(api_key=self.search_api_key)
        if self.sandbox_enabled:
            self.plugins["code_sandbox"] = CodeSandboxPlugin()
        logger.info(f"已注册 {len(self.plugins)} 个插件")

    def register_plugin(self, name: str, plugin):
        """动态注册插件"""
        self.plugins[name] = plugin
        logger.info(f"插件已注册: {name}")

    async def decompose_task(self, user_input: str) -> TaskDecomposition:
        """将模糊指令拆解为可执行的子任务"""
        prompt = f"""请将以下用户指令拆解为具体的子任务步骤。
用户指令: {user_input}

返回JSON格式:
{{
  "main_task": "主要任务描述",
  "subtasks": ["步骤1", "步骤2", "步骤3"],
  "required_tools": ["search", "code_sandbox"],
  "estimated_steps": 3
}}"""
        response = await self._call_llm(prompt)
        try:
            data = json.loads(response)
            return TaskDecomposition(**data)
        except json.JSONDecodeError:
            return TaskDecomposition(main_task=user_input, subtasks=[user_input])

    async def react_loop(self, user_input: str) -> str:
        """ReAct 算法主循环: 思考→行动→观察"""
        thoughts: list[Thought] = []

        # RAG: 检索相关记忆
        context = await self.memory.retrieve(user_input, top_k=5)

        for step in range(self.max_react_iterations):
            # Thought: 思考
            thought = await self._generate_thought(user_input, context, thoughts, step)

            if thought.action == "final_answer":
                # 生成最终回答
                answer = thought.observation or ""
                # 存入记忆库
                await self.memory.store(user_input, answer)
                return answer

            # Action: 执行工具
            if thought.action and thought.action in self.plugins:
                plugin = self.plugins[thought.action]
                thought.observation = await plugin.execute(thought.action_input)
            else:
                thought.observation = "工具不存在或无需调用"

            thoughts.append(thought)

        return "已达最大迭代次数，请重新描述需求。"

    async def _generate_thought(self, query, context, history, step) -> Thought:
        """生成单步思考"""
        history_str = "\\n".join([f"步骤{t.step}: 思考={t.thought}, 行动={t.action}, 观察={t.observation}" for t in history])
        prompt = f"""ReAct 第 {step} 步。
用户需求: {query}
相关记忆: {context}
历史步骤: {history_str}

请输出JSON: {{"thought":"...", "action":"search|code_sandbox|final_answer", "action_input":"..."}}"""
        response = await self._call_llm(prompt)
        try:
            data = json.loads(response)
            return Thought(step=step, **data)
        except json.JSONDecodeError:
            return Thought(step=step, thought=response, action="final_answer")

    async def _call_llm(self, prompt: str) -> str:
        """调用大语言模型"""
        from openai import AsyncOpenAI
        client = AsyncOpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=self.llm_api_key
        )
        response = await client.chat.completions.create(
            model=self.llm_model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=2000
        )
        return response.choices[0].message.content
\`\`\``;
    } else if (projectType === 'ai-agent') {
      codeExample = `\`\`\`python
# memory_store.py - 记忆存储与检索逻辑
import logging
from typing import Optional
from dataclasses import dataclass

logger = logging.getLogger(__name__)

@dataclass
class MemoryEntry:
    """记忆条目"""
    id: str
    content: str
    embedding: list
    metadata: dict
    score: float = 0.0

class MemoryStore:
    """向量记忆存储 - 基于 ChromaDB"""

    def __init__(self, db_path: str, collection_name: str = "nexus_memory"):
        self.db_path = db_path
        self.collection_name = collection_name
        self.client = None
        self.collection = None
        self._embedding_fn = None

    async def initialize(self):
        """初始化向量数据库连接"""
        import chromadb
        from chromadb.utils import embedding_functions

        self.client = chromadb.PersistentClient(path=self.db_path)
        self._embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )
        self.collection = self.client.get_or_create_collection(
            name=self.collection_name,
            embedding_function=self._embedding_fn,
            metadata={"hnsw:space": "cosine"}
        )
        logger.info(f"记忆库初始化完成: {self.collection_name}")

    async def store(self, query: str, response: str, metadata: Optional[dict] = None):
        """存储对话记忆"""
        entry_id = f"mem_{hash(query) & 0xFFFFFFFF:08x}"
        content = f"用户: {query}\\nAI: {response}"
        self.collection.add(
            documents=[content],
            ids=[entry_id],
            metadatas=[metadata or {"type": "conversation"}]
        )
        logger.info(f"记忆已存储: {entry_id}")

    async def retrieve(self, query: str, top_k: int = 5) -> list[MemoryEntry]:
        """RAG 检索: 根据查询返回最相关的记忆"""
        results = self.collection.query(
            query_texts=[query],
            n_results=top_k
        )
        entries = []
        for i, doc in enumerate(results["documents"][0]):
            entries.append(MemoryEntry(
                id=results["ids"][0][i],
                content=doc,
                embedding=[],
                metadata=results["metadatas"][0][i],
                score=1.0 - results["distances"][0][i]
            ))
        logger.info(f"检索到 {len(entries)} 条相关记忆")
        return entries

    async def compress_context(self, messages: list, max_tokens: int = 4000):
        """动态上下文窗口管理: 压缩旧对话为摘要"""
        if len(messages) <= 4:
            return messages

        # 保留最近2轮对话
        recent = messages[-4:]
        old = messages[:-4]

        # 调用LLM压缩旧对话
        summary_prompt = "请将以下对话历史压缩为结构化摘要，保留关键实体和决策:\\n\\n"
        for msg in old:
            summary_prompt += f"{msg.get('role','user')}: {msg.get('content','')}\\n"

        # 返回: [摘要] + [最近对话]
        return [{"role": "system", "content": f"历史摘要: {summary_prompt[:2000]}"}] + recent

    async def close(self):
        """关闭连接"""
        if self.client:
            self.client = None
        logger.info("记忆库连接已关闭")
\`\`\``;
    } else if (projectType === 'database') {
      codeExample = `\`\`\`sql
-- Nexus-1 核心数据库设计
-- 用户表
CREATE TABLE users (
  id          VARCHAR(36) PRIMARY KEY,
  username    VARCHAR(50) UNIQUE NOT NULL,
  email       VARCHAR(100) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  avatar      VARCHAR(255),
  status      TINYINT DEFAULT 1 COMMENT '0:禁用 1:正常',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 任务表
CREATE TABLE tasks (
  id          VARCHAR(36) PRIMARY KEY,
  user_id     VARCHAR(36) NOT NULL,
  title       VARCHAR(200) NOT NULL,
  content     TEXT,
  status      ENUM('pending','processing','completed','failed') DEFAULT 'pending',
  priority    TINYINT DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_status (user_id, status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 记忆条目表
CREATE TABLE memories (
  id          VARCHAR(36) PRIMARY KEY,
  user_id     VARCHAR(36) NOT NULL,
  task_id     VARCHAR(36),
  content     TEXT NOT NULL,
  summary     VARCHAR(500),
  embedding_id VARCHAR(100) COMMENT '向量数据库中的ID',
  metadata    JSON,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_task (task_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 插件注册表
CREATE TABLE plugins (
  id          VARCHAR(36) PRIMARY KEY,
  name        VARCHAR(100) UNIQUE NOT NULL,
  version     VARCHAR(20) NOT NULL,
  description TEXT,
  config      JSON,
  status      ENUM('active','inactive','error') DEFAULT 'inactive',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- API调用日志表
CREATE TABLE api_logs (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  task_id     VARCHAR(36),
  plugin_name VARCHAR(100),
  request     TEXT,
  response    TEXT,
  tokens_used INT DEFAULT 0,
  duration_ms INT DEFAULT 0,
  status      ENUM('success','error','timeout') DEFAULT 'success',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_task (task_id),
  INDEX idx_plugin (plugin_name),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
\`\`\``;
    } else if (projectType === 'react-frontend') {
      codeExample = `\`\`\`tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

interface ChatPanelProps {
  onSend: (message: string) => void;
  messages: { role: string; content: string }[];
  isLoading: boolean;
}

export const ChatPanel = ({ onSend, messages, isLoading }: ChatPanelProps) => {
  const [input, setInput] = useState('');
  const [showThoughts, setShowThoughts] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-gray-950">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-lg font-bold text-green-400">Nexus-1 控制台</h2>
        <button onClick={() => setShowThoughts(!showThoughts)}
          className="px-3 py-1 text-xs rounded-lg bg-gray-800 text-gray-400">
          {showThoughts ? '隐藏' : '显示'}思考过程
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={\`p-3 rounded-lg \${
                msg.role === 'user' ? 'bg-blue-900/30 ml-8' : 'bg-gray-900 mr-8'
              }\`}>
              <p className="text-sm text-gray-200">{msg.content}</p>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex gap-2 items-center text-gray-500 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" />
            <span>Nexus-1 正在思考...</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800 flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)}
          placeholder="输入指令..."
          className="flex-1 px-4 py-2 bg-gray-900 rounded-lg text-sm text-gray-200 border border-gray-800" />
        <button type="submit" disabled={isLoading}
          className="px-6 py-2 bg-green-600 rounded-lg text-sm text-white hover:bg-green-700">
          发送
        </button>
      </form>
    </div>
  );
};
\`\`\``;
    } else {
      codeExample = `\`\`\`typescript
// 通用核心模块
export class CoreModule<T extends { id: string }> {
  private items: Map<string, T> = new Map();

  add(item: T): void {
    this.items.set(item.id, item);
  }

  get(id: string): T | undefined {
    return this.items.get(id);
  }

  remove(id: string): boolean {
    return this.items.delete(id);
  }

  list(): T[] {
    return Array.from(this.items.values());
  }

  filter(predicate: (item: T) => boolean): T[] {
    return this.list().filter(predicate);
  }
}
\`\`\``;
    }

    return `## 核心架构开发方案

### 需求分析
针对「${command}」的需求，检测到项目类型为：**${projectType}**

### 架构设计
- **模块化设计**：各功能解耦，独立开发与测试
- **插件化架构**：新功能通过插件注册机制接入，不修改核心代码
- **配置中心化**：所有API Key和参数通过 .env 管理

### 核心代码实现

${codeExample}

### 设计要点
1. 采用 ReAct 算法实现"思考-行动-观察"闭环
2. RAG 检索增强，降低幻觉率
3. 动态上下文窗口管理，自动压缩旧对话
4. 全链路日志记录，便于性能复盘

---
*核心架构开发完成，代码可直接复制使用。*${
      searchKnowledge(command, 2)
        ? `\n\n📚 **知识库参考**\n\n${searchKnowledge(command, 2)}`
        : ''
    }`;
  }
};

export const coderBTemplate: AgentTemplate = {
  id: 'coder-b',
  name: '代码员B',
  role: '后端/逻辑工程师',
  avatar: '⚙️',
  description: '专注于后端服务开发、业务逻辑实现、API接口设计',
  generateResponse: async (command: string) => {
    await delay(1200 + Math.random() * 1500);
    const projectType = detectProjectType(command);

    let codeExample = '';
    let architectureSummary = '';

    if (projectType === 'python-backend') {
      architectureSummary = '基于 FastAPI 的 RESTful API 路由层，提供任务的增删改查接口，包含参数校验、异常处理与统一响应格式';
      codeExample = `\`\`\`python
# routers/task_router.py - 任务 CRUD 路由层
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field, validator

router = APIRouter()


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="任务标题")
    content: Optional[str] = Field(None, description="任务内容")
    priority: int = Field(0, ge=0, le=5, description="任务优先级 0-5")

    @validator("title")
    def title_must_not_be_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("任务标题不能为空白字符")
        return v.strip()


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    content: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(pending|processing|completed|failed)$")
    priority: Optional[int] = Field(None, ge=0, le=5)


class TaskOut(BaseModel):
    id: str
    title: str
    content: Optional[str]
    status: str
    priority: int


# 模拟存储层（实际项目替换为 service / repository）
_tasks: dict[str, dict] = {}


def _serialize(task: dict) -> TaskOut:
    return TaskOut(
        id=task["id"],
        title=task["title"],
        content=task.get("content"),
        status=task.get("status", "pending"),
        priority=task.get("priority", 0),
    )


@router.get("/", response_model=List[TaskOut], summary="获取任务列表")
async def list_tasks(
    keyword: Optional[str] = Query(None, description="按标题模糊搜索"),
    status_filter: Optional[str] = Query(None, alias="status"),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
):
    items = list(_tasks.values())
    if keyword:
        items = [t for t in items if keyword.lower() in t["title"].lower()]
    if status_filter:
        items = [t for t in items if t.get("status") == status_filter]
    start = (page - 1) * page_size
    return [_serialize(t) for t in items[start:start + page_size]]


@router.post("/", response_model=TaskOut, status_code=status.HTTP_201_CREATED, summary="创建任务")
async def create_task(payload: TaskCreate):
    import uuid, time
    task = {
        "id": str(uuid.uuid4()),
        "title": payload.title,
        "content": payload.content,
        "status": "pending",
        "priority": payload.priority,
        "created_at": time.time(),
    }
    _tasks[task["id"]] = task
    return _serialize(task)


@router.get("/{task_id}", response_model=TaskOut, summary="获取任务详情")
async def get_task(task_id: str):
    task = _tasks.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail=f"任务 {task_id} 不存在")
    return _serialize(task)


@router.put("/{task_id}", response_model=TaskOut, summary="更新任务")
async def update_task(task_id: str, payload: TaskUpdate):
    task = _tasks.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail=f"任务 {task_id} 不存在")
    update_data = payload.dict(exclude_unset=True)
    task.update(update_data)
    return _serialize(task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT, summary="删除任务")
async def delete_task(task_id: str):
    if task_id not in _tasks:
        raise HTTPException(status_code=404, detail=f"任务 {task_id} 不存在")
    _tasks.pop(task_id)
\`\`\``;
    } else if (projectType === 'ai-agent') {
      architectureSummary = '为智能体构建可扩展的插件系统，包含搜索插件与代码沙箱插件，统一接口契约便于动态加载';
      codeExample = `\`\`\`python
# plugins/__init__.py - 插件系统实现
import logging
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)


@dataclass
class PluginResult:
    success: bool
    data: Any = None
    error: Optional[str] = None


class BasePlugin(ABC):
    """所有插件必须实现的统一契约"""
    name: str = "base"
    description: str = ""

    @abstractmethod
    async def execute(self, params: Dict[str, Any]) -> PluginResult:
        ...

    def schema(self) -> Dict[str, Any]:
        return {"name": self.name, "description": self.description}


class SearchPlugin(BasePlugin):
    """联网搜索插件，使用 Tavily / SerpAPI 等上游服务"""
    name = "web_search"
    description = "通过搜索引擎获取实时网络信息"

    def __init__(self, api_key: str, provider: str = "tavily"):
        self.api_key = api_key
        self.provider = provider

    async def execute(self, params: Dict[str, Any]) -> PluginResult:
        query = params.get("query", "").strip()
        if not query:
            return PluginResult(success=False, error="缺少 query 参数")
        try:
            # 实际项目中调用 httpx.AsyncClient 请求上游
            logger.info(f"[SearchPlugin] provider={self.provider} query={query}")
            mock_results = [{"title": f"{query} - 结果{i}", "url": f"https://example.com/{i}", "snippet": "摘要..."} for i in range(3)]
            return PluginResult(success=True, data=mock_results)
        except Exception as e:
            logger.exception("搜索插件执行失败")
            return PluginResult(success=False, error=str(e))


class CodeSandboxPlugin(BasePlugin):
    """代码沙箱插件，隔离执行用户提交的代码片段"""
    name = "code_sandbox"
    description = "在受限沙箱中执行 Python 代码并返回输出"

    FORBIDDEN = {"os.remove", "shutil.rmtree", "subprocess", "open("/etc", "eval(", "__import__"}

    def __init__(self, timeout: int = 5, max_memory_mb: int = 128):
        self.timeout = timeout
        self.max_memory_mb = max_memory_mb

    def _validate(self, code: str) -> Optional[str]:
        for token in self.FORBIDDEN:
            if token in code:
                return f"代码包含禁止使用的操作: {token}"
        return None

    async def execute(self, params: Dict[str, Any]) -> PluginResult:
        code = params.get("code", "")
        if not code.strip():
            return PluginResult(success=False, error="缺少 code 参数")
        if err := self._validate(code):
            return PluginResult(success=False, error=err)
        try:
            local_ns: Dict[str, Any] = {}
            # 实际项目通过 resource.setrlimit + subprocess 隔离执行
            exec(compile(code, "<sandbox>", "exec"), {"__builtins__": {}}, local_ns)
            return PluginResult(success=True, data=local_ns.get("result"))
        except Exception as e:
            return PluginResult(success=False, error=f"执行失败: {e}")


class PluginManager:
    """插件注册表与调度器"""
    def __init__(self):
        self._plugins: Dict[str, BasePlugin] = {}

    def register(self, plugin: BasePlugin) -> None:
        self._plugins[plugin.name] = plugin
        logger.info(f"已注册插件: {plugin.name}")

    def get(self, name: str) -> Optional[BasePlugin]:
        return self._plugins.get(name)

    def list_plugins(self) -> list:
        return [p.schema() for p in self._plugins.values()]

    async def run(self, name: str, params: Dict[str, Any]) -> PluginResult:
        plugin = self.get(name)
        if not plugin:
            return PluginResult(success=False, error=f"插件 {name} 未注册")
        return await plugin.execute(params)
\`\`\``;
    } else if (projectType === 'react-frontend') {
      architectureSummary = '基于 TypeScript 的 API 请求封装层，统一拦截器、错误处理、类型推导与请求/响应转换';
      codeExample = `\`\`\`typescript
// src/api/request.ts - axios 统一封装
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export interface ApiResult<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  code?: number;
}

export class ApiError extends Error {
  constructor(public code: number, message: string, public detail?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// 请求拦截器：注入 token、traceId
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.set('Authorization', \`Bearer \${token}\`);
    }
    config.headers.set('X-Trace-Id', crypto.randomUUID());
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器：拆包 + 统一错误
instance.interceptors.response.use(
  (response: AxiosResponse<ApiResult>) => {
    const body = response.data;
    if (!body.success) {
      return Promise.reject(new ApiError(body.code ?? -1, body.message ?? '业务异常', body));
    }
    return body.data as any;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const msg = error.response.data?.message ?? '请求失败';
      return Promise.reject(new ApiError(status, msg, error.response.data));
    }
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new ApiError(-1, '请求超时，请稍后重试'));
    }
    return Promise.reject(new ApiError(-1, '网络异常，请检查连接'));
  }
);

export const http = {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.get(url, config);
  },
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return instance.post(url, data, config);
  },
  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return instance.put(url, data, config);
  },
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.delete(url, config);
  },
};

export default http;
\`\`\`

\`\`\`typescript
// src/api/task.ts - 业务接口模块
import { http } from './request';

export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  priority: number;
}

export const taskApi = {
  list: (params: { page?: number; pageSize?: number; keyword?: string }) =>
    http.get<Task[]>('/tasks', { params }),
  create: (data: { title: string; content?: string; priority?: number }) =>
    http.post<Task>('/tasks', data),
  update: (id: string, data: Partial<Task>) =>
    http.put<Task>(\`/tasks/\${id}\`, data),
  remove: (id: string) => http.delete<void>(\`/tasks/\${id}\`),
};
\`\`\``;
    } else if (projectType === 'database') {
      architectureSummary = '数据库操作层封装，使用 SQLAlchemy 2.0 异步 ORM，统一 Session 管理、CRUD 仓储模式与事务控制';
      codeExample = `\`\`\`python
# repositories/base.py - 通用仓储基类
from typing import Generic, TypeVar, Type, Optional, Sequence
from sqlalchemy import select, update as sql_update, delete as sql_delete
from sqlalchemy.ext.asyncio import AsyncSession

ModelT = TypeVar("ModelT")


class BaseRepository(Generic[ModelT]):
    model: Type[ModelT]

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, id_: int) -> Optional[ModelT]:
        return await self.session.get(self.model, id_)

    async def list(self, limit: int = 20, offset: int = 0) -> Sequence[ModelT]:
        stmt = select(self.model).limit(limit).offset(offset)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def create(self, **kwargs) -> ModelT:
        obj = self.model(**kwargs)
        self.session.add(obj)
        await self.session.flush()
        await self.session.refresh(obj)
        return obj

    async def update(self, id_: int, **kwargs) -> Optional[ModelT]:
        stmt = sql_update(self.model).where(self.model.id == id_).values(**kwargs).returning(self.model)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def delete(self, id_: int) -> bool:
        stmt = sql_delete(self.model).where(self.model.id == id_)
        result = await self.session.execute(stmt)
        return result.rowcount > 0


# repositories/task_repo.py - 任务仓储
from models.task import Task
from .base import BaseRepository

class TaskRepository(BaseRepository[Task]):
    model = Task

    async def search(self, keyword: str, limit: int = 10) -> list[Task]:
        stmt = select(Task).where(Task.title.ilike(f"%{keyword}%")).limit(limit)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())


# db/session.py - 异步会话工厂
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from contextlib import asynccontextmanager

engine = create_async_engine("postgresql+asyncpg://user:pass@localhost:5432/app", echo=False)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


@asynccontextmanager
async def get_session():
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
\`\`\``;
    } else {
      architectureSummary = '通用工具函数集合，覆盖深拷贝、防抖节流、日期格式化与唯一 ID 生成等高频场景';
      codeExample = `\`\`\`typescript
// src/utils/index.ts - 通用工具函数
export const utils = {
  deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
    if (Array.isArray(obj)) return obj.map(item => utils.deepClone(item)) as unknown as T;
    const cloned: Record<string, unknown> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = utils.deepClone((obj as Record<string, unknown>)[key]);
      }
    }
    return cloned as unknown as T;
  },

  debounce<T extends (...args: any[]) => void>(fn: T, delay = 300): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return function (this: unknown, ...args: Parameters<T>) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  throttle<T extends (...args: any[]) => void>(fn: T, interval = 300): (...args: Parameters<T>) => void {
    let lastTime = 0;
    return function (this: unknown, ...args: Parameters<T>) {
      const now = Date.now();
      if (now - lastTime >= interval) {
        lastTime = now;
        fn.apply(this, args);
      }
    };
  },

  formatDate(date: Date | string | number, format = 'YYYY-MM-DD HH:mm:ss'): string {
    const d = new Date(date);
    const pad = (n: number) => String(n).padStart(2, '0');
    const map: Record<string, string> = {
      YYYY: String(d.getFullYear()),
      MM: pad(d.getMonth() + 1),
      DD: pad(d.getDate()),
      HH: pad(d.getHours()),
      mm: pad(d.getMinutes()),
      ss: pad(d.getSeconds()),
    };
    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (m) => map[m]);
  },

  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  },
};

export default utils;
\`\`\``;
    }

    return `## 后端/逻辑开发方案

### 架构设计
针对「${command}」的业务需求，后端服务设计如下：

- **项目类型识别**：\`${projectType}\`
- **方案概要**：${architectureSummary}
- **分层架构**：Controller/Router → Service → Repository，职责清晰分离
- **错误处理**：统一异常捕获，返回标准化错误结构
- **数据校验**：基于 Schema 的入参验证，确保数据完整性

### 核心代码示例

${codeExample}

### API 接口规范
**响应格式统一**：
\`\`\`json
{
  "success": true,
  "data": {},
  "message": "操作成功"
}
\`\`\`

**错误响应**：
\`\`\`json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "参数验证失败"
  }
}
\`\`\`

### 目录结构建议
\`\`\`
src/
├── controllers/     # 控制器层
├── services/        # 业务逻辑层
├── models/          # 数据模型
├── routes/          # 路由定义
├── middleware/      # 中间件
├── utils/           # 工具函数
└── config/          # 配置文件
\`\`\`

---
*后端逻辑开发完成，代码已根据「${command}」动态生成，注重质量与稳定性。*`;
  }
};

export const coderCTemplate: AgentTemplate = {
  id: 'coder-c',
  name: '代码员C',
  role: '架构/优化工程师',
  avatar: '🏗️',
  description: '专注于系统架构设计、性能优化、代码重构',
  generateResponse: async (command: string) => {
    await delay(1500 + Math.random() * 2000);
    const projectType = detectProjectType(command);

    let architectureCode = '';
    let architectureFocus = '';

    if (projectType === 'python-backend') {
      architectureFocus = 'Python 中间件链与全局错误处理架构，构建可观测、可恢复的后端骨架';
      architectureCode = `\`\`\`python
# middleware/error_handler.py - 全局错误处理中间件
import logging
import time
import uuid
from typing import Callable

from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger(__name__)


class AppException(Exception):
    """业务异常基类，携带错误码与 HTTP 状态"""
    def __init__(self, code: str, message: str, status_code: int = 400, detail: any = None):
        self.code = code
        self.message = message
        self.status_code = status_code
        self.detail = detail
        super().__init__(message)


class ErrorHandlerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable):
        try:
            response = await call_next(request)
            if response.status_code >= 500:
                logger.error(f"服务端错误 status={response.status_code} path={request.url.path}")
            return response
        except AppException as exc:
            logger.warning(f"业务异常 code={exc.code} msg={exc.message}")
            return JSONResponse(
                status_code=exc.status_code,
                content={"success": False, "error": {"code": exc.code, "message": exc.message, "detail": exc.detail}},
            )
        except Exception as exc:
            logger.exception("未处理异常")
            return JSONResponse(
                status_code=500,
                content={"success": False, "error": {"code": "INTERNAL_ERROR", "message": "服务内部错误"}},
            )


# middleware/request_context.py - 请求追踪与耗时统计
class RequestContextMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable):
        request_id = request.headers.get("X-Request-Id") or str(uuid.uuid4())
        start = time.perf_counter()
        response: Response = await call_next(request)
        elapsed_ms = (time.perf_counter() - start) * 1000
        response.headers["X-Request-Id"] = request_id
        response.headers["X-Response-Time"] = f"{elapsed_ms:.2f}ms"
        logger.info(f"rid={request_id} {request.method} {request.url.path} {response.status_code} {elapsed_ms:.2f}ms")
        return response


# middleware/rate_limit.py - 简易滑动窗口限流
from collections import defaultdict, deque

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_requests: int = 60, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window = window_seconds
        self._hits: dict[str, deque] = defaultdict(deque)

    async def dispatch(self, request: Request, call_next: Callable):
        client = request.client.host if request.client else "unknown"
        now = time.time()
        bucket = self._hits[client]
        while bucket and bucket[0] < now - self.window:
            bucket.popleft()
        if len(bucket) >= self.max_requests:
            return JSONResponse(status_code=429, content={"success": False, "error": {"code": "RATE_LIMITED"}})
        bucket.append(now)
        return await call_next(request)


# main.py - 注册中间件（顺序：限流 → 追踪 → 错误处理）
# app.add_middleware(ErrorHandlerMiddleware)
# app.add_middleware(RequestContextMiddleware)
# app.add_middleware(RateLimitMiddleware, max_requests=100)
\`\`\``;
    } else if (projectType === 'ai-agent') {
      architectureFocus = 'ReAct 算法引擎与任务调度器架构，支持多轮思考-行动-观察循环与工具调度';
      architectureCode = `\`\`\`python
# engine/react_engine.py - ReAct 推理引擎
import json
import logging
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Callable, Optional

logger = logging.getLogger(__name__)


class StepType(str, Enum):
    THOUGHT = "thought"
    ACTION = "action"
    OBSERVATION = "observation"
    FINAL = "final"


@dataclass
class ReActStep:
    step: int
    type: StepType
    content: str
    tool: Optional[str] = None
    tool_input: Optional[dict] = None
    observation: Optional[Any] = None


@dataclass
class ReActContext:
    task: str
    history: list[ReActStep] = field(default_factory=list)
    max_steps: int = 8
    scratchpad: str = ""


class ReActEngine:
    """ReAct 循环：Thought → Action → Observation → 直到产出 Final Answer"""
    def __init__(self, llm_call: Callable[[str], str], tools: dict[str, Callable[[dict], Any]]):
        self.llm_call = llm_call
        self.tools = tools

    def _build_prompt(self, ctx: ReActContext) -> str:
        tool_desc = "\\n".join(f"- {name}" for name in self.tools)
        return (
            f"任务: {ctx.task}\\n\\n"
            f"可用工具:\\n{tool_desc}\\n\\n"
            f"历史:\\n{ctx.scratchpad}\\n\\n"
            f"请按格式输出:\\nThought: ...\\nAction: <tool_name>\\nAction Input: {{...}}\\n"
            f"或直接输出 Final Answer: ..."
        )

    async def step(self, ctx: ReActContext) -> ReActStep:
        prompt = self._build_prompt(ctx)
        raw = await self.llm_call(prompt)
        step = self._parse(raw, len(ctx.history) + 1)
        if step.type == StepType.ACTION and step.tool in self.tools:
            step.observation = await self._run_tool(step.tool, step.tool_input or {})
            ctx.scratchpad += f"\\nThought: {step.content}\\nAction: {step.tool}\\nObservation: {step.observation}"
        elif step.type == StepType.FINAL:
            ctx.scratchpad += f"\\nFinal Answer: {step.content}"
        ctx.history.append(step)
        return step

    async def run(self, task: str) -> str:
        ctx = ReActContext(task=task)
        while len(ctx.history) < ctx.max_steps:
            step = await self.step(ctx)
            if step.type == StepType.FINAL:
                return step.content
        return "达到最大步数仍未得到最终答案"

    async def _run_tool(self, name: str, params: dict) -> Any:
        try:
            return await self.tools[name](params)
        except Exception as e:
            return f"工具执行失败: {e}"

    def _parse(self, raw: str, step_no: int) -> ReActStep:
        text = raw.strip()
        if "Final Answer:" in text:
            return ReActStep(step=step_no, type=StepType.FINAL, content=text.split("Final Answer:", 1)[1].strip())
        thought = text.split("Thought:", 1)[1].split("Action:", 1)[0].strip() if "Thought:" in text else ""
        tool = ""
        tool_input: dict = {}
        if "Action:" in text:
            after_action = text.split("Action:", 1)[1]
            tool = after_action.split("Action Input:", 1)[0].strip()
            if "Action Input:" in after_action:
                try:
                    tool_input = json.loads(after_action.split("Action Input:", 1)[1].strip())
                except json.JSONDecodeError:
                    tool_input = {}
        return ReActStep(step=step_no, type=StepType.ACTION, content=thought, tool=tool, tool_input=tool_input)


# engine/scheduler.py - 任务调度器
import asyncio
from typing import Awaitable, Callable

class TaskScheduler:
    """并发任务调度，支持优先级与依赖"""
    def __init__(self, max_concurrency: int = 4):
        self.semaphore = asyncio.Semaphore(max_concurrency)
        self._tasks: list[tuple[int, Callable[[], Awaitable[Any]]]] = []

    def add(self, priority: int, coro_factory: Callable[[], Awaitable[Any]]):
        self._tasks.append((priority, coro_factory))

    async def run_all(self) -> list[Any]:
        self._tasks.sort(key=lambda x: x[0])
        async def _run(factory):
            async with self.semaphore:
                return await factory()
        return await asyncio.gather(*[_run(f) for _, f in self._tasks])
\`\`\``;
    } else if (projectType === 'react-frontend') {
      architectureFocus = 'React 状态管理与路由架构，结合 Zustand 全局状态、React Router 分级路由与懒加载';
      architectureCode = `\`\`\`typescript
// src/store/appStore.ts - Zustand 全局状态
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface UserInfo {
  id: string;
  name: string;
  avatar: string;
}

interface AppState {
  user: UserInfo | null;
  theme: 'light' | 'dark';
  setUser: (user: UserInfo | null) => void;
  toggleTheme: () => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        theme: 'light',
        setUser: (user) => set({ user }, false, 'setUser'),
        toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' }), false, 'toggleTheme'),
        logout: () => set({ user: null }, false, 'logout'),
      }),
      { name: 'app-store' }
    )
  )
);

// src/store/taskStore.ts - 任务切片
import { create } from 'zustand';

interface Task {
  id: string;
  title: string;
  status: string;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  setTasks: (tasks: Task[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  loading: false,
  error: null,
  setTasks: (tasks) => set({ tasks }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

// src/router/index.tsx - 路由架构
import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Login = lazy(() => import('@/pages/Login'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const AuthGuard: React.FC = () => {
  const user = useAppStore((s) => s.user);
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const Layout: React.FC = () => (
  <Suspense fallback={<div>加载中...</div>}>
    <Outlet />
  </Suspense>
);

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/login', element: <Login /> },
      {
        element: <AuthGuard />,
        children: [
          { path: '/', element: <Dashboard /> },
          { path: '/tasks', element: <Suspense fallback={null}>{React.createElement(() => <div>Tasks</div>)}</Suspense> },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
\`\`\``;
    } else if (projectType === 'database') {
      architectureFocus = '数据库索引与查询优化方案，覆盖索引设计、慢查询排查、读写分离与分库分表';
      architectureCode = `\`\`\`sql
-- 1. 索引优化：覆盖高频查询路径
-- 用户登录：通过 email 唯一索引加速查询
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- 任务列表分页：联合索引避免回表
CREATE INDEX idx_tasks_user_status_created
  ON tasks(user_id, status, created_at DESC);

-- 全文检索：标题模糊匹配改用全文索引
CREATE FULLTEXT INDEX ft_tasks_title_content ON tasks(title, content);

-- 2. 查询优化示例：避免 SELECT *，使用覆盖索引
EXPLAIN SELECT user_id, status, created_at
FROM tasks
WHERE user_id = 1001 AND status = 'pending'
ORDER BY created_at DESC
LIMIT 20;

-- 3. 慢查询日志配置
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1.0;
SET GLOBAL slow_query_log_file = '/var/log/mysql/slow.log';

-- 4. 分区表：按时间分区任务表，加速历史数据查询
ALTER TABLE tasks PARTITION BY RANGE (YEAR(created_at)) (
  PARTITION p2023 VALUES LESS THAN (2024),
  PARTITION p2024 VALUES LESS THAN (2025),
  PARTITION p2025 VALUES LESS THAN (2026),
  PARTITION pmax VALUES LESS THAN MAXVALUE
);
\`\`\`

\`\`\`python
# 优化策略：读写分离 + 查询缓存
from sqlalchemy.ext.asyncio import create_async_engine

# 主库写、从库读
master_engine = create_async_engine("postgresql+asyncpg://user:pass@master:5432/app")
replica_engine = create_async_engine("postgresql+asyncpg://user:pass@replica:5432/app")

# 慢查询监控装饰器
import time, logging
logger = logging.getLogger(__name__)

def monitor_slow(threshold_ms: float = 200):
    def decorator(func):
        async def wrapper(*args, **kwargs):
            start = time.perf_counter()
            result = await func(*args, **kwargs)
            elapsed_ms = (time.perf_counter() - start) * 1000
            if elapsed_ms > threshold_ms:
                logger.warning(f"慢查询 {func.__name__} 耗时 {elapsed_ms:.2f}ms")
            return result
        return wrapper
    return decorator
\`\`\``;
    } else {
      architectureFocus = '通用依赖注入容器，支持单例/瞬态生命周期、懒加载与服务解析';
      architectureCode = `\`\`\`typescript
// src/container/DIContainer.ts - 依赖注入容器
type Lifecycle = 'singleton' | 'transient';

interface Registration<T> {
  factory: () => T | Promise<T>;
  lifecycle: Lifecycle;
  instance?: T;
}

export class DIContainer {
  private registrations = new Map<string, Registration<unknown>>();
  private resolving = new Set<string>();

  register<T>(token: string, factory: () => T | Promise<T>, lifecycle: Lifecycle = 'singleton'): void {
    this.registrations.set(token, { factory, lifecycle });
  }

  resolve<T>(token: string): T {
    const reg = this.registrations.get(token) as Registration<T> | undefined;
    if (!reg) {
      throw new Error(\`服务 '\${token}' 未注册\`);
    }
    if (this.resolving.has(token)) {
      throw new Error(\`检测到循环依赖: \${token}\`);
    }
    if (reg.lifecycle === 'singleton' && reg.instance !== undefined) {
      return reg.instance;
    }
    this.resolving.add(token);
    const instance = reg.factory();
    this.resolving.delete(token);
    if (reg.lifecycle === 'singleton') {
      reg.instance = instance;
    }
    return instance;
  }

  async resolveAsync<T>(token: string): Promise<T> {
    const instance = this.resolve<T | Promise<T>>(token);
    return instance instanceof Promise ? await instance : instance;
  }

  release(token: string): void {
    this.registrations.delete(token);
  }

  list(): string[] {
    return Array.from(this.registrations.keys());
  }
}

export const container = new DIContainer();

// 使用示例
// container.register('logger', () => new ConsoleLogger(), 'singleton');
// container.register('userRepo', () => new UserRepo(container.resolve('logger')), 'transient');
\`\`\``;
    }

    return `## 架构设计与优化方案

### 架构分析
针对「${command}」的系统架构进行深入分析与优化：

- **项目类型识别**：\`${projectType}\`
- **架构重点**：${architectureFocus}

#### 当前架构评估
- **可扩展性**：中等 - 模块化设计尚可，但部分模块耦合度较高
- **可维护性**：良好 - 代码结构清晰，命名规范
- **性能表现**：良好 - 基础性能达标，但有优化空间
- **安全性**：良好 - 基本安全措施已到位

### 优化建议

#### 1. 性能优化
**前端优化**：
- 代码分割（Code Splitting）：按需加载，减少首屏加载时间
- 懒加载（Lazy Loading）：图片、组件延迟加载
- 缓存策略：合理利用浏览器缓存和CDN
- 虚拟列表：处理大量数据渲染

**后端优化**：
- 数据库索引优化
- 缓存层引入（Redis）
- 请求合并与批处理
- 异步任务队列

#### 2. 架构核心代码

${architectureCode}

#### 3. 代码质量优化
- **设计模式应用**：根据场景合理使用设计模式
- **SOLID原则**：遵循面向对象设计原则
- **类型安全**：强化TypeScript类型定义
- **单元测试**：核心逻辑覆盖率达到80%以上

### 重构建议

| 重构项 | 优先级 | 预计收益 |
|--------|--------|----------|
| 模块拆分 | 高 | 提升可维护性 |
| 类型定义完善 | 高 | 减少运行时错误 |
| 错误处理统一 | 中 | 提升系统稳定性 |
| 性能瓶颈优化 | 中 | 提升用户体验 |

### 技术债务清单
1. [中] 部分模块缺少单元测试
2. [低] 代码注释不够完善
3. [中] 部分函数职责不够单一

---
*架构分析与优化建议已完成，代码已根据「${command}」动态生成，系统可扩展性和性能将显著提升。*`;
  }
};

export const coderDTemplate: AgentTemplate = {
  id: 'coder-d',
  name: '代码员D',
  role: '测试/质量工程师',
  avatar: '🧪',
  description: '专注于单元测试、集成测试、测试用例设计、质量保障',
  generateResponse: async (command: string) => {
    await delay(1000 + Math.random() * 1500);
    const projectType = detectProjectType(command);

    let testCode = '';
    let testFocus = '';

    if (projectType === 'python-backend') {
      testFocus = '使用 pytest + httpx 测试 FastAPI 接口，覆盖成功路径、参数校验与异常分支';
      testCode = `\`\`\`python
# tests/test_task_router.py - FastAPI 接口测试
import pytest
from httpx import AsyncClient, ASGITransport
from main import app


@pytest.fixture
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac


@pytest.mark.asyncio
async def test_create_task_success(client):
    response = await client.post("/api/tasks/", json={"title": "写单元测试", "priority": 2})
    assert response.status_code == 201
    body = response.json()
    assert body["title"] == "写单元测试"
    assert body["status"] == "pending"
    assert body["priority"] == 2
    assert "id" in body


@pytest.mark.asyncio
async def test_create_task_with_empty_title(client):
    response = await client.post("/api/tasks/", json={"title": "   ", "priority": 1})
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_task_not_found(client):
    response = await client.get("/api/tasks/non-existent-id")
    assert response.status_code == 404
    assert response.json()["detail"] == "任务 non-existent-id 不存在"


@pytest.mark.asyncio
async def test_list_tasks_pagination(client):
    # 准备数据
    for i in range(15):
        await client.post("/api/tasks/", json={"title": f"任务{i}"})
    # 第一页
    resp = await client.get("/api/tasks/?page=1&page_size=10")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 10
    # 第二页
    resp2 = await client.get("/api/tasks/?page=2&page_size=10")
    assert len(resp2.json()) == 5


@pytest.mark.asyncio
async def test_update_and_delete_task(client):
    create = await client.post("/api/tasks/", json={"title": "待更新"})
    task_id = create.json()["id"]
    update = await client.put(f"/api/tasks/{task_id}", json={"status": "completed"})
    assert update.json()["status"] == "completed"
    delete = await client.delete(f"/api/tasks/{task_id}")
    assert delete.status_code == 204
    get = await client.get(f"/api/tasks/{task_id}")
    assert get.status_code == 404
\`\`\``;
    } else if (projectType === 'ai-agent') {
      testFocus = 'Agent 行为测试，验证 ReAct 循环的思考-行动-观察步骤与工具调度正确性';
      testCode = `\`\`\`python
# tests/test_react_engine.py - ReAct 引擎行为测试
import pytest
from unittest.mock import AsyncMock

from engine.react_engine import ReActEngine, ReActStep, StepType


@pytest.fixture
def tools():
    return {
        "web_search": AsyncMock(return_value=[{"title": "结果", "url": "https://x"}]),
        "calculator": AsyncMock(return_value=42),
    }


@pytest.fixture
def engine(tools):
    return ReActEngine(llm_call=AsyncMock(), tools=tools)


@pytest.mark.asyncio
async def test_engine_returns_final_answer(engine):
    # 模拟 LLM 第一次返回 Action，第二次返回 Final
    engine.llm_call = AsyncMock(side_effect=[
        "Thought: 需要搜索\\nAction: web_search\\nAction Input: {\\"query\\": \\"天气\\"}",
        "Final Answer: 今天天气晴朗",
    ])
    result = await engine.run("今天天气怎么样")
    assert result == "今天天气晴朗"
    assert len(engine.llm_call.call_args_list) == 2


@pytest.mark.asyncio
async def test_engine_invokes_tool_once(engine):
    engine.llm_call = AsyncMock(side_effect=[
        "Thought: 计算\\nAction: calculator\\nAction Input: {\\"expr\\": \\"6*7\\"}",
        "Final Answer: 42",
    ])
    await engine.run("6 乘以 7 等于多少")
    tools["calculator"].assert_awaited_once_with({"expr": "6*7"})


@pytest.mark.asyncio
async def test_engine_stops_on_max_steps(engine):
    # LLM 永远返回 Action，触发最大步数限制
    engine.llm_call = AsyncMock(return_value="Thought: 继续\\nAction: web_search\\nAction Input: {}")
    engine.max_steps_override = 3
    result = await engine.run("无限循环任务")
    assert "最大步数" in result


@pytest.mark.asyncio
async def test_parse_final_answer(engine):
    step = engine._parse("Final Answer: 完成了", 1)
    assert step.type == StepType.FINAL
    assert step.content == "完成了"


@pytest.mark.asyncio
async def test_parse_action(engine):
    step = engine._parse('Thought: 想想\\nAction: web_search\\nAction Input: {"query": "ai"}', 2)
    assert step.type == StepType.ACTION
    assert step.tool == "web_search"
    assert step.tool_input == {"query": "ai"}


@pytest.mark.asyncio
async def test_tool_failure_does_not_crash(engine):
    tools["calculator"] = AsyncMock(side_effect=RuntimeError("boom"))
    engine.llm_call = AsyncMock(side_effect=[
        "Thought: 计算\\nAction: calculator\\nAction Input: {}",
        "Final Answer: 工具失败了",
    ])
    result = await engine.run("计算")
    assert result == "工具失败了"
\`\`\``;
    } else if (projectType === 'react-frontend') {
      testFocus = '使用 vitest + @testing-library/react 测试 React 组件与 Hook，覆盖交互与异步行为';
      testCode = `\`\`\`typescript
// src/components/__tests__/TaskList.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TaskList from '../TaskList';
import { taskApi } from '@/api/task';

vi.mock('@/api/task');

const mockTaskApi = vi.mocked(taskApi);

const renderWithProviders = (ui: React.ReactNode) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
};

describe('TaskList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders tasks loaded from API', async () => {
    mockTaskApi.list.mockResolvedValueOnce([
      { id: '1', title: '写组件', status: 'pending', priority: 1 },
      { id: '2', title: '写测试', status: 'completed', priority: 2 },
    ]);
    renderWithProviders(<TaskList />);
    await waitFor(() => expect(screen.getByText('写组件')).toBeInTheDocument());
    expect(screen.getByText('写测试')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    mockTaskApi.list.mockReturnValueOnce(new Promise(() => {}));
    renderWithProviders(<TaskList />);
    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  it('shows error message when API fails', async () => {
    mockTaskApi.list.mockRejectedValueOnce(new Error('网络异常'));
    renderWithProviders(<TaskList />);
    await waitFor(() => expect(screen.getByText(/加载失败/)).toBeInTheDocument());
  });

  it('calls onCreate when add button clicked', async () => {
    mockTaskApi.list.mockResolvedValueOnce([]);
    mockTaskApi.create.mockResolvedValueOnce({ id: '3', title: '新任务', status: 'pending', priority: 0 });
    renderWithProviders(<TaskList />);
    await waitFor(() => expect(screen.getByRole('button', { name: /新增/ })).toBeInTheDocument());
    fireEvent.change(screen.getByPlaceholderText(/输入任务/), { target: { value: '新任务' } });
    fireEvent.click(screen.getByRole('button', { name: /新增/ }));
    await waitFor(() => expect(mockTaskApi.create).toHaveBeenCalledWith({ title: '新任务' }));
  });
});

// src/hooks/__tests__/useCounter.test.ts - Hook 测试
import { renderHook, act } from '@testing-library/react';
import { useCounter } from '../useCounter';

describe('useCounter', () => {
  it('increments counter', () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => result.current.increment());
    expect(result.current.count).toBe(1);
  });
});
\`\`\``;
    } else if (projectType === 'database') {
      testFocus = '数据库 CRUD 测试，验证数据写入、查询、更新与事务回滚行为';
      testCode = `\`\`\`python
# tests/test_task_repository.py - 数据库仓储测试
import pytest
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from models.base import Base
from models.task import Task
from repositories.task_repo import TaskRepository


@pytest.fixture
async def session():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    SessionLocal = async_sessionmaker(engine, expire_on_commit=False)
    async with SessionLocal() as s:
        yield s
    await engine.dispose()


@pytest.mark.asyncio
async def test_create_and_get(session):
    repo = TaskRepository(session)
    task = await repo.create(title="测试任务", status="pending", priority=1)
    fetched = await repo.get_by_id(task.id)
    assert fetched is not None
    assert fetched.title == "测试任务"


@pytest.mark.asyncio
async def test_update_task(session):
    repo = TaskRepository(session)
    task = await repo.create(title="原标题", status="pending", priority=0)
    updated = await repo.update(task.id, status="completed")
    assert updated.status == "completed"
    assert updated.title == "原标题"


@pytest.mark.asyncio
async def test_delete_task(session):
    repo = TaskRepository(session)
    task = await repo.create(title="待删除", status="pending", priority=0)
    assert await repo.delete(task.id) is True
    assert await repo.get_by_id(task.id) is None
    assert await repo.delete(task.id) is False


@pytest.mark.asyncio
async def test_search_by_keyword(session):
    repo = TaskRepository(session)
    await repo.create(title="学习 pytest", status="pending", priority=0)
    await repo.create(title="学习 SQLAlchemy", status="pending", priority=0)
    await repo.create(title="吃饭", status="pending", priority=0)
    results = await repo.search("学习", limit=10)
    assert len(results) == 2


@pytest.mark.asyncio
async def test_rollback_on_error(session):
    repo = TaskRepository(session)
    with pytest.raises(Exception):
        await repo.create(title=None, status="pending")  # 违反非空约束
    # 事务回滚后仍可继续操作
    task = await repo.create(title="回滚后的任务", status="pending", priority=0)
    assert task.id is not None
\`\`\``;
    } else {
      testFocus = '通用单元测试模板，覆盖纯函数的边界条件与异常输入';
      testCode = `\`\`\`typescript
// src/utils/__tests__/utils.test.ts - 通用工具函数测试
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { utils } from '../index';

describe('utils.deepClone', () => {
  it('clones primitive values', () => {
    expect(utils.deepClone(42)).toBe(42);
    expect(utils.deepClone('hello')).toBe('hello');
    expect(utils.deepClone(null)).toBe(null);
  });

  it('clones nested objects deeply', () => {
    const src = { a: 1, nested: { b: [1, 2, { c: 3 }] } };
    const cloned = utils.deepClone(src);
    expect(cloned).toEqual(src);
    expect(cloned.nested).not.toBe(src.nested);
    cloned.nested.b.push(4);
    expect(src.nested.b).toHaveLength(3);
  });

  it('clones Date instances', () => {
    const date = new Date('2024-01-01');
    const cloned = utils.deepClone(date);
    expect(cloned.getTime()).toBe(date.getTime());
    expect(cloned).not.toBe(date);
  });
});

describe('utils.debounce', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('invokes only once within delay window', () => {
    const fn = vi.fn();
    const debounced = utils.debounce(fn, 300);
    debounced(); debounced(); debounced();
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('utils.formatDate', () => {
  it('formats date with default pattern', () => {
    const result = utils.formatDate(new Date('2024-06-15T10:30:45Z'), 'YYYY-MM-DD');
    expect(result).toMatch(/^\\d{4}-\\d{2}-\\d{2}$/);
  });

  it('throws on invalid date input', () => {
    expect(() => utils.formatDate('not-a-date')).not.toThrow();
    expect(utils.formatDate('invalid')).toMatch(/Invalid|NaN/);
  });
});

describe('utils.generateId', () => {
  it('returns unique strings across calls', () => {
    const ids = new Set(Array.from({ length: 1000 }, () => utils.generateId()));
    expect(ids.size).toBe(1000);
  });
});
\`\`\``;
    }

    return `## 测试用例设计方案

### 测试策略
针对「${command}」的功能需求，制定全面的测试策略：

- **项目类型识别**：\`${projectType}\`
- **测试重点**：${testFocus}
- **单元测试**：覆盖所有核心函数和组件
- **集成测试**：验证模块间协作的正确性
- **端到端测试**：模拟用户操作流程
- **性能测试**：确保系统响应时间达标

### 测试代码示例

${testCode}

### 测试覆盖率目标
| 模块 | 目标覆盖率 | 优先级 |
|------|-----------|--------|
| 核心业务逻辑 | 95% | 高 |
| 工具函数 | 90% | 高 |
| UI组件 | 80% | 中 |
| API接口 | 85% | 中 |

---
*测试方案设计完成，用例已根据「${command}」动态生成，确保代码质量可靠。*`;
  }
};

export const coderETemplate: AgentTemplate = {
  id: 'coder-e',
  name: '代码员E',
  role: '数据库/存储工程师',
  avatar: '🗄️',
  description: '专注于数据库设计、数据建模、存储优化、数据迁移',
  generateResponse: async (command: string) => {
    await delay(1200 + Math.random() * 1500);
    const projectType = detectProjectType(command);

    // 从 command 中提取关键词作为表名提示
    const extractEntity = (): string => {
      const matched = command.match(/[\u4e00-\u9fa5a-zA-Z_]{2,}/g);
      if (!matched) return 'item';
      const stopWords = new Set(['需求', '设计', '数据库', '建表', '方案', '系统', 'the', 'a', 'an', 'of', 'and', 'to']);
      const candidate = matched.find(w => !stopWords.has(w.toLowerCase()));
      const word = candidate ?? 'item';
      // 中文转拼音不在范围内，简单保留 ASCII；非 ASCII 时使用通用表名
      return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(word) ? word.toLowerCase() : 'item';
    };

    let schemaCode = '';
    let storageFocus = '';

    if (projectType === 'python-backend') {
      const entity = extractEntity();
      storageFocus = `基于 SQLAlchemy 的 Python 数据库模型设计，与「${command}」中提及的实体对应`;
      schemaCode = `\`\`\`python
# models/${entity}.py - SQLAlchemy 数据模型
from datetime import datetime
from sqlalchemy import String, Text, Integer, DateTime, ForeignKey, JSON, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class ${entity.charAt(0).toUpperCase() + entity.slice(1)}(Base):
    """${entity} 主表 - 对应需求: ${command}"""
    __tablename__ = "${entity}s"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False, index=True, comment="名称")
    description: Mapped[str | None] = mapped_column(Text, nullable=True, comment="描述")
    status: Mapped[str] = mapped_column(String(20), default="active", comment="状态")
    priority: Mapped[int] = mapped_column(Integer, default=0, comment="优先级")
    metadata_: Mapped[dict | None] = mapped_column("metadata", JSON, nullable=True, comment="扩展字段")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    items: Mapped[list["${entity}Item"]] = relationship(back_populates="parent", cascade="all, delete-orphan")


class ${entity.charAt(0).toUpperCase() + entity.slice(1)}Item(Base):
    """${entity} 子项表"""
    __tablename__ = "${entity}_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    parent_id: Mapped[int] = mapped_column(ForeignKey("${entity}s.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    content: Mapped[str | None] = mapped_column(Text)
    order: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    parent: Mapped["${entity.charAt(0).toUpperCase() + entity.slice(1)}"] = relationship(back_populates="items")


# models/base.py
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass
\`\`\``;
    } else if (projectType === 'ai-agent') {
      storageFocus = '向量数据库 + 长期记忆存储表设计，支撑 RAG 检索与对话历史管理';
      schemaCode = `\`\`\`sql
-- 智能体记忆库：向量存储 + 元数据
CREATE TABLE memory_vectors (
  id              VARCHAR(36) PRIMARY KEY,
  agent_id        VARCHAR(36) NOT NULL COMMENT '所属 Agent',
  session_id      VARCHAR(36) COMMENT '会话 ID',
  content         TEXT NOT NULL COMMENT '原始文本片段',
  embedding       BLOB NOT NULL COMMENT '向量 embedding (1536 维)',
  metadata        JSON COMMENT '附加元数据 (来源、角色、标签)',
  score           FLOAT DEFAULT 0 COMMENT '重要性评分',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_agent_session (agent_id, session_id),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 对话历史表：保存多轮对话
CREATE TABLE chat_messages (
  id              VARCHAR(36) PRIMARY KEY,
  session_id      VARCHAR(36) NOT NULL,
  role            ENUM('user','assistant','system','tool') NOT NULL,
  content         TEXT NOT NULL,
  tool_calls      JSON COMMENT '工具调用记录',
  tokens          INT DEFAULT 0,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_session_time (session_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 工具调用日志：用于行为回放与调试
CREATE TABLE tool_call_logs (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  session_id      VARCHAR(36) NOT NULL,
  tool_name       VARCHAR(100) NOT NULL,
  input           JSON,
  output          JSON,
  duration_ms     INT,
  success         TINYINT(1) DEFAULT 1,
  error           TEXT,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_session (session_id),
  INDEX idx_tool (tool_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Agent 配置表
CREATE TABLE agents (
  id              VARCHAR(36) PRIMARY KEY,
  name            VARCHAR(100) NOT NULL,
  system_prompt   TEXT,
  llm_model       VARCHAR(100) DEFAULT 'gpt-4',
  temperature     FLOAT DEFAULT 0.7,
  tools           JSON COMMENT '可用工具列表',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
\`\`\``;
    } else if (projectType === 'react-frontend') {
      storageFocus = '前端本地存储方案，封装 localStorage 与 IndexedDB，支持版本化与过期清理';
      schemaCode = `\`\`\`typescript
// src/storage/localStorage.ts - localStorage 封装
const PREFIX = 'app:';

export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw) as { value: T; expireAt?: number };
      if (parsed.expireAt && Date.now() > parsed.expireAt) {
        localStorage.removeItem(PREFIX + key);
        return fallback;
      }
      return parsed.value;
    } catch {
      return fallback;
    }
  },

  set<T>(key: string, value: T, ttlMs?: number): void {
    const payload = JSON.stringify({
      value,
      expireAt: ttlMs ? Date.now() + ttlMs : undefined,
    });
    try {
      localStorage.setItem(PREFIX + key, payload);
    } catch (e) {
      console.warn('localStorage 写入失败', e);
    }
  },

  remove(key: string): void {
    localStorage.removeItem(PREFIX + key);
  },

  clear(): void {
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => localStorage.removeItem(k));
  },
};

// src/storage/indexedDB.ts - IndexedDB 封装（适合大数据量与结构化数据）
const DB_NAME = 'app-db';
const DB_VERSION = 1;

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('tasks')) {
        const store = db.createObjectStore('tasks', { keyPath: 'id' });
        store.createIndex('by_status', 'status', { unique: false });
        store.createIndex('by_created', 'createdAt', { unique: false });
      }
      if (!db.objectStoreNames.contains('cache')) {
        db.createObjectStore('cache', { keyPath: 'key' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export const idb = {
  async put<T>(store: string, value: T): Promise<void> {
    const db = await openDB();
    await db.transaction(store, 'readwrite').objectStore(store).put(value);
  },
  async get<T>(store: string, key: IDBValidKey): Promise<T | undefined> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const req = db.transaction(store).objectStore(store).get(key);
      req.onsuccess = () => resolve(req.result as T | undefined);
      req.onerror = () => reject(req.error);
    });
  },
  async getAll<T>(store: string): Promise<T[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const req = db.transaction(store).objectStore(store).getAll();
      req.onsuccess = () => resolve(req.result as T[]);
      req.onerror = () => reject(req.error);
    });
  },
  async delete(store: string, key: IDBValidKey): Promise<void> {
    const db = await openDB();
    db.transaction(store, 'readwrite').objectStore(store).delete(key);
  },
};
\`\`\``;
    } else if (projectType === 'database') {
      const entity = extractEntity();
      storageFocus = `与「${command}」相关的完整 SQL 建表语句，提取实体: ${entity}`;
      schemaCode = `\`\`\`sql
-- 针对需求「${command}」的数据库设计方案
-- 实体名称: ${entity}

-- 1. ${entity} 主表
CREATE TABLE ${entity}s (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  code            VARCHAR(64) UNIQUE NOT NULL COMMENT '${entity} 唯一编码',
  name            VARCHAR(200) NOT NULL COMMENT '名称',
  description     TEXT COMMENT '描述',
  status          TINYINT NOT NULL DEFAULT 1 COMMENT '0:禁用 1:启用',
  priority        TINYINT DEFAULT 0,
  category_id     BIGINT COMMENT '分类 ID',
  metadata        JSON COMMENT '扩展元数据',
  created_by      BIGINT,
  updated_by      BIGINT,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_code (code),
  INDEX idx_status_priority (status, priority),
  INDEX idx_category (category_id),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='${entity} 主表';

-- 2. ${entity} 明细表
CREATE TABLE ${entity}_items (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  parent_id       BIGINT NOT NULL COMMENT '主表 ID',
  sku             VARCHAR(64) COMMENT '子项编码',
  title           VARCHAR(200) NOT NULL,
  content         TEXT,
  quantity        INT DEFAULT 1,
  unit_price      DECIMAL(12,2) DEFAULT 0.00,
  status          TINYINT DEFAULT 1,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES ${entity}s(id) ON DELETE CASCADE,
  INDEX idx_parent_status (parent_id, status),
  INDEX idx_sku (sku)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='${entity} 明细表';

-- 3. ${entity} 操作日志表
CREATE TABLE ${entity}_logs (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  ${entity}_id    BIGINT NOT NULL,
  operator_id     BIGINT,
  action          VARCHAR(50) NOT NULL COMMENT 'create/update/delete',
  before_data     JSON,
  after_data      JSON,
  ip_address      VARCHAR(45),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (${entity}_id) REFERENCES ${entity}s(id) ON DELETE CASCADE,
  INDEX idx_entity_time (${entity}_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='${entity} 操作日志';

-- 4. 分类表（可选，用于归类）
CREATE TABLE ${entity}_categories (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  parent_id       BIGINT DEFAULT 0,
  name            VARCHAR(100) NOT NULL,
  sort_order      INT DEFAULT 0,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_parent (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='${entity} 分类';
\`\`\``;
    } else {
      storageFocus = '通用的用户表与配置表设计，覆盖大多数应用的基础数据存储需求';
      schemaCode = `\`\`\`sql
-- 通用用户表
CREATE TABLE users (
  id              VARCHAR(36) PRIMARY KEY,
  username        VARCHAR(50) UNIQUE NOT NULL,
  email           VARCHAR(100) UNIQUE NOT NULL,
  phone           VARCHAR(20) UNIQUE,
  password        VARCHAR(255) NOT NULL COMMENT 'bcrypt 哈希',
  nickname        VARCHAR(100),
  avatar          VARCHAR(255),
  gender          TINYINT DEFAULT 0 COMMENT '0:未知 1:男 2:女',
  status          TINYINT DEFAULT 1 COMMENT '0:禁用 1:正常',
  last_login_at   TIMESTAMP NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 通用配置表（key-value 形式）
CREATE TABLE configs (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  config_key      VARCHAR(100) UNIQUE NOT NULL,
  config_value    TEXT,
  value_type      ENUM('string','number','boolean','json') DEFAULT 'string',
  category        VARCHAR(50) DEFAULT 'general',
  description     VARCHAR(255),
  is_public       TINYINT DEFAULT 0 COMMENT '是否前端可见',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统配置表';

-- 用户偏好/扩展信息表
CREATE TABLE user_profiles (
  user_id         VARCHAR(36) PRIMARY KEY,
  locale          VARCHAR(10) DEFAULT 'zh-CN',
  timezone        VARCHAR(50) DEFAULT 'Asia/Shanghai',
  theme           VARCHAR(20) DEFAULT 'light',
  preferences     JSON,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户偏好表';
\`\`\``;
    }

    return `## 数据库设计方案

### 数据建模分析
针对「${command}」的数据需求，设计如下数据模型：

- **项目类型识别**：\`${projectType}\`
- **存储重点**：${storageFocus}

#### 核心数据表设计

${schemaCode}

### 性能优化建议

1. **索引优化**：为高频查询字段建立合适索引，遵循最左前缀原则
2. **分表策略**：大数据量表采用水平分表（按时间/用户 ID 哈希）
3. **缓存层**：引入 Redis 缓存热点数据，降低数据库读压力
4. **读写分离**：主从复制，读写分离提升并发能力

### 数据安全
- 敏感字段加密存储（如密码使用 bcrypt，敏感信息使用 AES）
- 定期备份策略（每日全量 + 实时增量 binlog）
- 数据访问审计日志，记录关键操作
- 字段级权限控制，避免越权访问

---
*数据库设计完成，方案已根据「${command}」动态生成，支持高并发与数据安全。*`;
  }
};

export const reviewerTemplate: AgentTemplate = {
  id: 'reviewer',
  name: '检查员',
  role: '代码审查员',
  avatar: '🔎',
  description: '代码审查、Bug检测、质量评分',
  generateResponse: async (command: string) => {
    await delay(1000 + Math.random() * 1500);
    const projectType = detectProjectType(command);

    // 根据项目类型定义审查重点、固定评分与 Bug 列表
    interface BugItem {
      severity: 'high' | 'medium' | 'low';
      type: string;
      description: string;
      location: string;
    }
    interface ReviewProfile {
      focusAreas: string[];
      scores: { dimension: string; score: number; note: string }[];
      bugs: BugItem[];
      improvements: string[];
      summary: string;
    }

    const profileMap: Record<string, ReviewProfile> = {
      'python-backend': {
        focusAreas: ['异步处理逻辑', '类型注解完整性', '异常捕获与回滚', '依赖注入与生命周期'],
        scores: [
          { dimension: '代码规范', score: 88, note: '符合 PEP8 与 Black 风格，少量导入顺序待调整' },
          { dimension: '类型安全', score: 82, note: 'Pydantic 模型完善，部分函数返回值未标注' },
          { dimension: '异步处理', score: 85, note: 'async/await 使用正确，存在阻塞调用隐患' },
          { dimension: '异常处理', score: 78, note: '缺少业务异常分类与统一拦截中间件' },
          { dimension: '安全性', score: 86, note: '参数校验到位，密钥管理建议改用 Vault' },
        ],
        bugs: [
          { severity: 'high', type: '异常处理', description: 'async 路由未捕获数据库异常，导致 500 错误暴露堆栈', location: 'routers/task_router.py:create_task' },
          { severity: 'medium', type: '类型注解', description: 'service 层函数返回值缺少类型标注，IDE 推断失败', location: 'services/task_service.py:42' },
          { severity: 'medium', type: '依赖注入', description: '数据库 Session 未通过 Depends 注入，难以测试', location: 'routers/task_router.py:list_tasks' },
          { severity: 'low', type: '异步处理', description: '在 async 函数中调用同步 time.sleep，阻塞事件循环', location: 'services/task_service.py:88' },
          { severity: 'low', type: '代码风格', description: 'import 顺序不符合 isort 规范', location: 'main.py:1-15' },
        ],
        improvements: [
          '为 service 层补充 Protocol/Type 注解，提升类型推导能力',
          '使用 FastAPI Depends 注入数据库 Session，便于单元测试替换',
          '统一异常基类 AppException，配合中间件返回标准化错误结构',
          '使用 asyncio.sleep 替代 time.sleep，避免阻塞事件循环',
        ],
        summary: 'Python 后端代码整体结构清晰，需重点关注异步异常处理与依赖注入规范化。',
      },
      'ai-agent': {
        focusAreas: ['ReAct 循环终止条件', '记忆管理与上下文压缩', '工具调用安全性', 'Token 消耗控制'],
        scores: [
          { dimension: '代码规范', score: 86, note: '结构清晰，docstring 覆盖率较高' },
          { dimension: '类型安全', score: 80, note: 'dataclass 使用良好，工具入参 schema 偏弱' },
          { dimension: 'Agent 行为', score: 76, note: 'ReAct 缺少强制终止，存在死循环风险' },
          { dimension: '记忆管理', score: 78, note: '上下文压缩策略简单，长对话易超出窗口' },
          { dimension: '安全性', score: 82, note: '沙箱已隔离，但工具白名单未严格校验' },
        ],
        bugs: [
          { severity: 'high', type: 'ReAct 循环', description: '当 LLM 持续返回 Action 但无 Final Answer 时，循环无法跳出', location: 'engine/react_engine.py:run' },
          { severity: 'high', type: 'Token 消耗', description: '未对 prompt 长度做截断，长对话会触发 max_tokens 错误', location: 'engine/react_engine.py:_build_prompt' },
          { severity: 'medium', type: '记忆丢失', description: '记忆库 retrieve 后未做相似度阈值过滤，污染上下文', location: 'memory_store.py:retrieve' },
          { severity: 'medium', type: '工具调用安全', description: '工具名直接来自 LLM 输出，未做白名单校验', location: 'engine/react_engine.py:step' },
          { severity: 'low', type: '可观测性', description: '工具调用未记录耗时与 tokens，难以复盘', location: 'engine/react_engine.py:_run_tool' },
        ],
        improvements: [
          '为 ReAct 循环添加最大步数与超时双重熔断机制',
          '在 prompt 构建时引入滑动窗口策略，超出阈值触发压缩摘要',
          '对工具调用做白名单校验，禁止执行未注册工具',
          '为每次工具调用记录 input/output/tokens/duration，便于成本分析',
        ],
        summary: 'AI Agent 实现具备完整 ReAct 骨架，但循环安全性与 Token 控制是首要风险点。',
      },
      'react-frontend': {
        focusAreas: ['组件设计与拆分', 'Hooks 使用规范', '性能优化', '可访问性 (a11y)'],
        scores: [
          { dimension: '代码规范', score: 90, note: 'ESLint + Prettier 配置完善，命名规范统一' },
          { dimension: '类型安全', score: 88, note: 'TS 严格模式开启，少量 any 待收敛' },
          { dimension: '组件设计', score: 82, note: '组件职责清晰，部分大组件可进一步拆分' },
          { dimension: '性能表现', score: 80, note: '缺少 React.memo 与 useMemo，列表渲染存在重渲染' },
          { dimension: '可访问性', score: 72, note: '交互元素缺少 aria 标签，键盘导航不完整' },
        ],
        bugs: [
          { severity: 'high', type: '可访问性', description: '可点击的 div 未加 role="button" 与 tabIndex，键盘用户无法操作', location: 'components/TaskCard.tsx:18' },
          { severity: 'medium', type: '性能优化', description: '列表未使用 key 或 memo，数据量大时明显卡顿', location: 'components/TaskList.tsx:35' },
          { severity: 'medium', type: 'Hooks 使用', description: 'useEffect 缺少依赖项，闭包导致状态读取过期', location: 'hooks/useTask.ts:22' },
          { severity: 'low', type: '组件设计', description: '单文件超过 300 行，建议按职责拆分', location: 'pages/Dashboard.tsx' },
          { severity: 'low', type: '类型安全', description: '事件处理器入参使用 any，应改为 React.ChangeEvent', location: 'components/TaskForm.tsx:48' },
        ],
        improvements: [
          '为交互元素补充 aria-* 属性与键盘事件支持，符合 WCAG AA 标准',
          '使用 React.memo + useMemo 优化大列表渲染，必要时引入虚拟列表',
          '完善 useEffect 依赖数组，或使用 useEvent 抽象稳定回调',
          '将超长组件按职责拆分为更小的子组件，便于复用与测试',
        ],
        summary: 'React 前端工程化基础良好，需补强可访问性与性能优化两个薄弱环节。',
      },
      'database': {
        focusAreas: ['索引设计', 'SQL 注入防护', '事务处理', '数据完整性'],
        scores: [
          { dimension: '代码规范', score: 87, note: 'SQL 关键字大写，命名遵循 snake_case' },
          { dimension: '索引设计', score: 78, note: '高频查询字段缺少联合索引，存在全表扫描' },
          { dimension: 'SQL 注入防护', score: 84, note: '使用参数化查询，但动态拼接仍存在于日志查询' },
          { dimension: '事务处理', score: 80, note: '事务边界清晰，但缺少死锁重试机制' },
          { dimension: '数据完整性', score: 82, note: '外键约束齐全，部分软删除未级联处理' },
        ],
        bugs: [
          { severity: 'high', type: 'SQL 注入', description: '动态拼接 ORDER BY 字段未做白名单校验，存在注入风险', location: 'repositories/task_repo.py:order_by' },
          { severity: 'high', type: '索引缺失', description: 'tasks 表 user_id+status 查询未建联合索引，慢查询频发', location: 'migrations/001_init.sql' },
          { severity: 'medium', type: '事务处理', description: '并发更新库存未加 SELECT ... FOR UPDATE，存在超卖风险', location: 'repositories/stock_repo.py:decrease' },
          { severity: 'medium', type: '数据完整性', description: '软删除字段 deleted_at 未在唯一索引中排除，导致无法重建', location: 'migrations/002_users.sql' },
          { severity: 'low', type: '事务隔离', description: '长事务持有锁过久，建议改用乐观锁', location: 'services/order_service.py:create' },
        ],
        improvements: [
          '为 ORDER BY / LIMIT 字段建立白名单，杜绝动态 SQL 拼接',
          '为高频查询补建联合索引，使用 EXPLAIN 验证执行计划',
          '关键扣减操作使用行锁或乐观版本号，避免并发超卖',
          '为软删除场景调整唯一索引，包含 deleted_at 列',
        ],
        summary: '数据库设计整体规范，SQL 注入与索引设计是当前最值得优先修复的问题。',
      },
      'general': {
        focusAreas: ['代码质量', '错误处理', '模块化设计', '可测试性'],
        scores: [
          { dimension: '代码规范', score: 85, note: '整体符合规范，少量命名待统一' },
          { dimension: '类型安全', score: 82, note: '类型定义较完善，少量 any 可收敛' },
          { dimension: '错误处理', score: 80, note: '基础异常捕获到位，边界处理可加强' },
          { dimension: '可维护性', score: 84, note: '结构清晰，模块职责基本单一' },
          { dimension: '安全性', score: 86, note: '常规安全措施到位，无明显漏洞' },
        ],
        bugs: [
          { severity: 'medium', type: '错误处理', description: '异步操作缺少 try/catch，错误会冒泡至顶层', location: 'utils/async.ts:24' },
          { severity: 'medium', type: '类型安全', description: '函数参数使用 any，缺少明确类型定义', location: 'utils/helpers.ts:48' },
          { severity: 'low', type: '最佳实践', description: '建议使用常量替代魔法数字', location: 'config.ts:15' },
        ],
        improvements: [
          '统一错误处理机制，补充边界情况测试',
          '完善类型定义，移除不必要的 any',
          '为复杂逻辑补充单元测试与注释',
          '引入 ESLint 严格规则与 Prettier 格式化',
        ],
        summary: '通用代码质量良好，建议加强错误处理与类型定义以提升健壮性。',
      },
    };

    const profile = profileMap[projectType] ?? profileMap['general'];
    const totalScore = Math.round(profile.scores.reduce((sum, s) => sum + s.score, 0) / profile.scores.length);
    const highCount = profile.bugs.filter(b => b.severity === 'high').length;
    const commandSnippet = command.slice(0, 30);

    return `## 代码审查报告

### 审查概要
**审查对象**：${command}
**项目类型识别**：\`${projectType}\`
**审查时间**：${new Date().toLocaleString('zh-CN')}
**审查重点**：${profile.focusAreas.join('、')}

### 质量评分
| 维度 | 评分 | 说明 |
|------|------|------|
${profile.scores.map(s => `| ${s.dimension} | ${s.score}/100 | ${s.note} |`).join('\n')}

**综合评分**：${totalScore}/100 ⭐

### 发现的问题

${profile.bugs.length > 0 ? profile.bugs.map((bug, index) => `
**问题 ${index + 1}** - [${bug.severity === 'high' ? '🔴 严重' : bug.severity === 'medium' ? '🟡 中等' : '🟢 轻微'}] ${bug.type}
- 描述：${bug.description}
- 位置：${bug.location}
- 建议：${bug.severity === 'high' ? '请立即修复此问题' : bug.severity === 'medium' ? '建议尽快修复' : '可在下个迭代优化'}
`).join('') : '✅ 未发现明显问题，代码质量优秀！'}

### 改进建议

${profile.improvements.map((s, i) => `${i + 1}. ${s}`).join('\n')}

### 总结
针对「${commandSnippet}」识别为 ${projectType} 类型，${profile.summary}${highCount > 0 ? `存在 ${highCount} 个严重问题需优先修复。` : '当前未发现严重问题，可逐步优化。'}

---
*代码审查完成，请根据报告进行相应调整。*`;
  }
};

export const bugDetectorTemplate: AgentTemplate = {
  id: 'bug-detector',
  name: 'Bug检测员',
  role: '质量保障工程师',
  avatar: '🐛',
  description: '专门进行Bug检测、边界测试、质量保证',
  generateResponse: async (command: string) => {
    await delay(1200 + Math.random() * 1800);
    const projectType = detectProjectType(command);

    // 根据项目类型定义测试场景与 Bug 列表
    interface BugCase {
      severity: 'high' | 'medium' | 'low';
      title: string;
      description: string;
      steps: string[];
      expected: string;
      actual: string;
      impact: string;
    }
    interface TestProfile {
      scenarios: { type: string; cases: number; passed: number; failed: number }[];
      bugs: BugCase[];
      coverageTips: string[];
    }

    const profileMap: Record<string, TestProfile> = {
      'python-backend': {
        scenarios: [
          { type: 'API 边界-空参数', cases: 8, passed: 7, failed: 1 },
          { type: 'API 边界-超长字符串', cases: 6, passed: 6, failed: 0 },
          { type: 'API 边界-并发请求', cases: 10, passed: 8, failed: 2 },
          { type: 'API 边界-SQL 注入', cases: 7, passed: 7, failed: 0 },
          { type: '参数校验-Pydantic', cases: 12, passed: 12, failed: 0 },
        ],
        bugs: [
          {
            severity: 'high',
            title: '并发请求创建任务导致主键冲突',
            description: `对「${command}」相关接口并发 50 次创建请求时，UUID 生成出现重复（时钟回拨场景），数据库抛出 IntegrityError 未被捕获`,
            steps: ['使用 locust 并发 50 QPS 调用 POST /api/tasks/', '观察服务端日志'],
            expected: '冲突时自动重试或返回 409 Conflict',
            actual: '返回 500 Internal Server Error，连接被重置',
            impact: '数据写入失败、用户体验受损',
          },
          {
            severity: 'high',
            title: 'SQL 注入风险（动态 ORDER BY）',
            description: 'list 接口的 sort 参数直接拼接到 SQL，传入 `id; DROP TABLE tasks--` 可破坏数据',
            steps: ['调用 GET /api/tasks/?sort=id;DROP TABLE tasks--', '检查 tasks 表是否存在'],
            expected: '参数被白名单拒绝，返回 400',
            actual: 'SQL 被执行，表被删除',
            impact: '数据丢失、灾难性事故',
          },
          {
            severity: 'medium',
            title: '超长字符串导致 422 但日志噪声大',
            description: 'title 传入 100KB 字符串时，Pydantic 校验通过但被数据库截断，错误日志爆炸',
            steps: ['POST /api/tasks/ 传入 title 长度 100000', '观察日志输出'],
            expected: '在 Pydantic 层就拒绝（max_length）',
            actual: '错误日志写入数十 MB，磁盘告警',
            impact: '日志系统压力、运维成本',
          },
          {
            severity: 'medium',
            title: '空参数未做业务校验',
            description: '传入空字符串 `""` 通过 Pydantic 的 min_length=0 默认，但下游 service 抛出 ValueError',
            steps: ['POST /api/tasks/ 传入 {"title": ""}', '观察响应'],
            expected: '返回 422 并提示「标题不能为空」',
            actual: '返回 500 ValueError',
            impact: '接口契约不一致',
          },
          {
            severity: 'low',
            title: '并发请求下 Session 共享导致脏读',
            description: '多个请求复用同一 AsyncSession，未通过 Depends 隔离，事务互相污染',
            steps: ['并发触发更新接口', '检查数据一致性'],
            expected: '每个请求独立 Session',
            actual: 'Session 被复用，出现脏读',
            impact: '数据一致性问题',
          },
        ],
        coverageTips: [
          '为所有 Pydantic 模型补充 max_length / pattern 约束',
          '为并发场景添加集成测试（pytest-asyncio + httpx.AsyncClient）',
          '使用白名单校验 sort/order 参数，杜绝动态 SQL 拼接',
          '为关键接口补充 fuzzing 测试（如 hypothesmith 或 schemathesis）',
        ],
      },
      'ai-agent': {
        scenarios: [
          { type: 'Agent 行为-死循环', cases: 6, passed: 4, failed: 2 },
          { type: 'Agent 行为-工具不存在', cases: 5, passed: 5, failed: 0 },
          { type: 'Agent 行为-Token 超限', cases: 4, passed: 2, failed: 2 },
          { type: 'Agent 行为-记忆丢失', cases: 6, passed: 5, failed: 1 },
          { type: '工具调用安全', cases: 8, passed: 8, failed: 0 },
        ],
        bugs: [
          {
            severity: 'high',
            title: 'ReAct 死循环无法跳出',
            description: `针对「${command}」场景，LLM 持续返回 Action 但不产出 Final Answer，达到 max_steps 后抛出未捕获异常`,
            steps: ['向 Agent 提交需要多步搜索的复杂问题', '观察引擎日志'],
            expected: '达到 max_steps 后返回友好提示并保留中间结果',
            actual: '抛出 RuntimeError，会话中断',
            impact: '会话崩溃、用户体验差',
          },
          {
            severity: 'high',
            title: 'Token 超限触发 API 错误',
            description: '长对话累计 prompt 超过模型 max_tokens 时，OpenAI API 返回 400 但未捕获',
            steps: ['连续对话 20 轮，每轮输入长文本', '观察第 20 轮响应'],
            expected: '自动触发上下文压缩并重试',
            actual: '返回 400 错误，对话中断',
            impact: '长会话不可用',
          },
          {
            severity: 'medium',
            title: '工具不存在时未降级',
            description: 'LLM 调用未注册的工具名时，引擎直接抛出 KeyError',
            steps: ['prompt 引导 LLM 调用 "image_gen" 工具', '观察 Agent 响应'],
            expected: '返回「工具不可用」并在下一轮重新思考',
            actual: '抛出 KeyError，会话终止',
            impact: 'Agent 鲁棒性差',
          },
          {
            severity: 'medium',
            title: '记忆检索未做相似度阈值',
            description: 'retrieve 返回 top_k 中包含相似度极低（<0.3）的记忆，污染上下文',
            steps: ['提问与历史无关的问题', '检查 prompt 中是否包含无关记忆'],
            expected: '相似度低于阈值时过滤',
            actual: '所有 top_k 记忆都被注入',
            impact: '回答偏离主题、Token 浪费',
          },
          {
            severity: 'low',
            title: '工具调用未记录 Token 消耗',
            description: '工具调用日志缺少 tokens 字段，难以做成本归因',
            steps: ['查看 tool_call_logs 表', '检查 tokens 列'],
            expected: '记录每次调用的 input/output tokens',
            actual: 'tokens 字段为 0',
            impact: '成本可观测性差',
          },
        ],
        coverageTips: [
          '为 ReAct 引擎添加 max_steps + 超时双重熔断，并补充单测',
          '在 prompt 构建前检查 token 长度，超阈值触发压缩摘要',
          '为工具调用做白名单校验，未注册工具返回友好提示',
          '为记忆检索增加相似度阈值参数，并补充评估测试',
        ],
      },
      'react-frontend': {
        scenarios: [
          { type: 'UI 边界-空状态', cases: 6, passed: 6, failed: 0 },
          { type: 'UI 边界-加载状态', cases: 5, passed: 5, failed: 0 },
          { type: 'UI 边界-错误状态', cases: 6, passed: 4, failed: 2 },
          { type: 'UI 边界-超长文本', cases: 8, passed: 5, failed: 3 },
          { type: '交互-键盘导航', cases: 7, passed: 4, failed: 3 },
        ],
        bugs: [
          {
            severity: 'high',
            title: '错误状态未渲染导致白屏',
            description: 'API 返回 500 时，组件未处理 rejected 状态，React 抛出未捕获错误导致白屏',
            steps: ['mock taskApi.list 返回 reject', '渲染 TaskList 组件', '观察页面'],
            expected: '显示「加载失败，点击重试」占位',
            actual: '页面白屏，控制台报错',
            impact: '用户无法继续操作',
          },
          {
            severity: 'medium',
            title: '超长文本破坏布局',
            description: '任务标题超过 200 字符时，未做截断或省略号，导致卡片横向溢出',
            steps: ['渲染包含 500 字符标题的 TaskCard', '观察卡片布局'],
            expected: '文本省略并显示 tooltip',
            actual: '卡片宽度撑破，列表错位',
            impact: '布局错乱、视觉体验差',
          },
          {
            severity: 'medium',
            title: '加载状态未显示骨架屏',
            description: '请求期间组件渲染空白，用户感知不到加载',
            steps: ['模拟 2s 网络延迟', '观察首屏渲染'],
            expected: '显示骨架屏或 Spinner',
            actual: '空白等待 2s 后突然渲染数据',
            impact: '用户体验差、疑似卡死',
          },
          {
            severity: 'medium',
            title: '空状态未引导用户',
            description: '数据为空时仅显示空白列表，缺少空状态引导',
            steps: ['mock 返回空数组', '渲染列表组件'],
            expected: '显示「暂无数据，点击创建」',
            actual: '完全空白',
            impact: '新用户流失',
          },
          {
            severity: 'low',
            title: '键盘无法操作可点击元素',
            description: '可点击的 div 未加 role/tabIndex/onKeyDown，键盘用户无法触发',
            steps: ['使用 Tab 键尝试聚焦卡片', '按 Enter 尝试触发'],
            expected: '可聚焦并通过 Enter 触发',
            actual: '无法聚焦',
            impact: '可访问性不达标',
          },
        ],
        coverageTips: [
          '为所有异步组件补充 ErrorBoundary 与 rejected 状态处理',
          '使用 line-clamp 或 text-overflow 处理超长文本',
          '为加载态添加骨架屏，提升感知性能',
          '为可交互元素补充 role/aria-* 与键盘事件，符合 WCAG AA',
        ],
      },
      'database': {
        scenarios: [
          { type: '数据层-空表查询', cases: 6, passed: 6, failed: 0 },
          { type: '数据层-大数据量', cases: 8, passed: 5, failed: 3 },
          { type: '数据层-并发写入', cases: 10, passed: 7, failed: 3 },
          { type: '数据层-外键约束', cases: 7, passed: 7, failed: 0 },
          { type: '事务回滚', cases: 5, passed: 5, failed: 0 },
        ],
        bugs: [
          {
            severity: 'high',
            title: '并发写入导致超卖',
            description: `针对「${command}」中的库存扣减场景，未加行锁，并发请求导致库存为负`,
            steps: ['初始化库存=1', '并发 10 个扣减请求', '检查最终库存'],
            expected: '库存为 0，9 个请求返回失败',
            actual: '库存为 -9',
            impact: '资损、业务事故',
          },
          {
            severity: 'high',
            title: '大数据量查询超时',
            description: 'tasks 表 100 万行时，未走索引的查询耗时超过 30s',
            steps: ['插入 100 万测试数据', '执行 list_tasks 不带过滤', '观察耗时'],
            expected: '通过联合索引控制在 200ms 内',
            actual: '全表扫描耗时 30s+',
            impact: '接口超时、用户体验差',
          },
          {
            severity: 'medium',
            title: '外键级联删除误删数据',
            description: '删除父记录时 ON DELETE CASCADE 误删子记录，缺少软删除保护',
            steps: ['删除一个有子项的父记录', '检查子表数据'],
            expected: '软删除或拒绝删除',
            actual: '子记录被物理删除',
            impact: '数据丢失',
          },
          {
            severity: 'medium',
            title: '空表查询返回 null 而非空数组',
            description: 'repository.list() 在空表时返回 None，前端处理异常',
            steps: ['清空 tasks 表', '调用 list_tasks', '检查返回值'],
            expected: '返回空数组 []',
            actual: '返回 None',
            impact: '前端兼容性问题',
          },
          {
            severity: 'low',
            title: '事务未设置隔离级别',
            description: '关键扣减事务使用默认隔离级别（RC），高并发下出现不可重复读',
            steps: ['并发读取并写入', '检查读一致性'],
            expected: '使用 RR 或 SERIALIZABLE',
            actual: '出现脏读',
            impact: '数据一致性问题',
          },
        ],
        coverageTips: [
          '为关键扣减操作使用 SELECT ... FOR UPDATE 或乐观锁',
          '为高频查询字段补建联合索引，并用 EXPLAIN 验证',
          '为外键级联策略补充软删除机制',
          '为 list 接口确保空表时返回空数组而非 None',
        ],
      },
      'general': {
        scenarios: [
          { type: '边界测试-空值', cases: 8, passed: 7, failed: 1 },
          { type: '边界测试-异常输入', cases: 7, passed: 6, failed: 1 },
          { type: '异常测试-网络错误', cases: 5, passed: 4, failed: 1 },
          { type: '性能测试-大数据', cases: 4, passed: 4, failed: 0 },
        ],
        bugs: [
          {
            severity: 'medium',
            title: '空值输入导致返回 undefined',
            description: '当输入为空字符串时，函数返回 undefined，可能导致后续错误',
            steps: ['调用处理函数，传入空字符串', '观察返回值'],
            expected: '返回空值或抛出友好错误',
            actual: '返回 undefined',
            impact: '单模块',
          },
          {
            severity: 'low',
            title: '异常处理不完善',
            description: '网络请求失败时，错误提示不够友好',
            steps: ['断开网络连接', '触发数据请求'],
            expected: '显示友好的网络错误提示',
            actual: '显示技术错误信息',
            impact: '用户体验',
          },
        ],
        coverageTips: [
          '增加空值、null、undefined 等边界情况测试',
          '完善异常场景测试用例',
          '添加性能基准测试',
          '补充安全相关测试',
        ],
      },
    };

    const profile = profileMap[projectType] ?? profileMap['general'];
    // 根据功能复杂度（场景数与用例数）计算总用例数
    const totalCases = profile.scenarios.reduce((sum, s) => sum + s.cases, 0);
    const totalPassed = profile.scenarios.reduce((sum, s) => sum + s.passed, 0);
    const totalFailed = profile.scenarios.reduce((sum, s) => sum + s.failed, 0);
    const passRate = totalCases > 0 ? ((totalPassed / totalCases) * 100).toFixed(1) : '0.0';
    const commandSnippet = command.slice(0, 30);

    return `## Bug检测报告

### 测试概要
**测试对象**：${command}
**项目类型识别**：\`${projectType}\`
**测试类型**：功能测试 + 边界测试 + 异常测试
**测试用例数**：${totalCases} 个（基于 ${profile.scenarios.length} 类场景）

### 测试结果
| 测试类型 | 用例数 | 通过 | 失败 | 通过率 |
|----------|--------|------|------|--------|
${profile.scenarios.map(s => `| ${s.type} | ${s.cases} | ${s.passed} | ${s.failed} | ${((s.passed / s.cases) * 100).toFixed(1)}% |`).join('\n')}
| **合计** | **${totalCases}** | **${totalPassed}** | **${totalFailed}** | **${passRate}%** |

### 发现的Bug

${profile.bugs.map((bug, i) => `#### 🐛 Bug #${i + 1} - [${bug.severity === 'high' ? '严重' : bug.severity === 'medium' ? '中等' : '轻微'}] ${bug.title}
**描述**：${bug.description}
**复现步骤**：
${bug.steps.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}
**预期行为**：${bug.expected}
**实际行为**：${bug.actual}
**影响范围**：${bug.impact}
**优先级**：${bug.severity === 'high' ? '高' : bug.severity === 'medium' ? '中' : '低'}

`).join('')}

### 测试覆盖建议
${profile.coverageTips.map(tip => `- ${tip}`).join('\n')}

### 总结
针对「${commandSnippet}」识别为 ${projectType} 类型，共发现 ${profile.bugs.length} 个问题，其中严重 ${profile.bugs.filter(b => b.severity === 'high').length} 个，整体通过率 ${passRate}%。${totalFailed > 0 ? '建议优先修复失败用例相关问题。' : '当前测试全部通过。'}

---
*Bug检测完成，${totalFailed} 个用例待修复，整体质量${totalFailed > 5 ? '需重点关注' : totalFailed > 0 ? '良好' : '优秀'}。*`;
  }
};

export const extenderTemplate: AgentTemplate = {
  id: 'extender',
  name: '扩展员',
  role: '技术顾问',
  avatar: '🚀',
  description: '未来展望、技术建议、扩展性分析',
  generateResponse: async (command: string) => {
    await delay(800 + Math.random() * 1200);
    const projectType = detectProjectType(command);

    // 根据项目类型定义扩展方向、代码示例与技术选型
    interface ExtProfile {
      shortTerm: { title: string; items: string[] }[];
      midTerm: { title: string; items: string[] }[];
      longTerm: { title: string; items: string[] }[];
      codeExample: string;
      codeTitle: string;
      techSelection: { scenario: string; tech: string; advantage: string }[];
    }

    const profileMap: Record<string, ExtProfile> = {
      'python-backend': {
        shortTerm: [
          { title: '功能增强', items: ['API 网关：统一鉴权、限流、灰度路由', 'WebSocket 实时通信：推送任务状态变更', 'OpenAPI/Swagger 文档自动生成', '请求链路追踪（OpenTelemetry）'] },
          { title: '体验优化', items: ['统一异常与错误码体系', '健康检查与就绪探针', '配置中心化（Apollo / Nacos）', '结构化日志（JSON + TraceID）'] },
        ],
        midTerm: [
          { title: '架构升级', items: ['微服务化拆分（按业务域）', 'GraphQL BFF 层聚合多服务', '消息队列解耦（Kafka / RabbitMQ）', '服务网格 Istio 接入'] },
          { title: '技术栈扩展', items: ['Celery 异步任务队列', 'Redis 分布式锁与缓存', 'Elasticsearch 全文检索', 'Prometheus + Grafana 监控'] },
        ],
        longTerm: [
          { title: '平台化', items: ['开放 API 与开发者门户', '多租户 SaaS 改造', 'Service Mesh 全链路治理', '云原生 K8s + Helm 部署'] },
          { title: '智能化', items: ['AIOps 异常检测', 'API 智能限流与熔断', '基于 Trace 的根因分析', '容量自感知弹性扩缩容'] },
        ],
        codeTitle: 'API 网关 + WebSocket 实时通信示例（FastAPI）',
        codeExample: `\`\`\`python
# gateway/websocket_hub.py - WebSocket 实时推送 Hub
import logging
from collections import defaultdict
from fastapi import WebSocket, WebSocketDisconnect

logger = logging.getLogger(__name__)


class ConnectionHub:
    """按频道维度的 WebSocket 连接管理器"""

    def __init__(self):
        self._channels: dict[str, set[WebSocket]] = defaultdict(set)

    async def connect(self, channel: str, ws: WebSocket) -> None:
        await ws.accept()
        self._channels[channel].add(ws)
        logger.info(f"WebSocket 已加入频道 {channel}，当前 {len(self._channels[channel])} 人")

    def disconnect(self, channel: str, ws: WebSocket) -> None:
        self._channels[channel].discard(ws)
        if not self._channels[channel]:
            self._channels.pop(channel, None)

    async def broadcast(self, channel: str, message: dict) -> None:
        dead: list[WebSocket] = []
        for ws in self._channels.get(channel, set()):
            try:
                await ws.send_json(message)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self._channels[channel].discard(ws)


hub = ConnectionHub()


# routers/ws_router.py
from fastapi import APIRouter, Depends

ws_router = APIRouter()


@ws_router.websocket("/ws/tasks/{task_id}")
async def task_progress(ws: WebSocket, task_id: str):
    await hub.connect(f"task:{task_id}", ws)
    try:
        while True:
            await ws.receive_text()  # 心跳
    except WebSocketDisconnect:
        hub.disconnect(f"task:{task_id}", ws)


# 服务层完成任务后推送：
# await hub.broadcast(f"task:{task_id}", {"event": "progress", "step": 3, "total": 10})
\`\`\``,
        techSelection: [
          { scenario: 'API 网关', tech: 'Kong / APISIX', advantage: '插件化、支持鉴权限流灰度' },
          { scenario: '微服务通信', tech: 'gRPC + Protobuf', advantage: '强类型、高性能、跨语言' },
          { scenario: '消息队列', tech: 'Kafka', advantage: '高吞吐、可重放、解耦削峰' },
          { scenario: '任务队列', tech: 'Celery + Redis', advantage: '定时任务、重试、监控完善' },
          { scenario: '可观测性', tech: 'OpenTelemetry + Grafana', advantage: '统一 Trace/Metric/Log' },
        ],
      },
      'ai-agent': {
        shortTerm: [
          { title: '功能增强', items: ['多 Agent 协作（Planner + Executor + Critic）', '自定义工具开发 SDK', '会话回放与调试器', 'Streaming 流式输出'] },
          { title: '体验优化', items: ['思考过程可视化展示', 'Token 消耗实时统计', '记忆库相似度阈值可配', '工具调用并发执行'] },
        ],
        midTerm: [
          { title: '架构升级', items: ['Multi-Agent 编排框架（LangGraph / AutoGen）', '长期记忆分片与检索优化', '模型微调（LoRA / QLoRA）', 'A/B 测试框架'] },
          { title: '技术栈扩展', items: ['知识图谱（Neo4j）增强 RAG', '向量数据库迁移到 Milvus', 'Function Calling 标准化', 'Prompt 版本管理（LangSmith）'] },
        ],
        longTerm: [
          { title: '平台化', items: ['Agent 即服务（Agent-as-a-Service）', '低代码 Agent 编排平台', '插件市场与开发者生态', '多模型路由与降级'] },
          { title: '智能化', items: ['自我反思与持续学习', '基于 RLHF 的策略优化', 'Agent 间通信协议（MCP）', '自主目标分解与执行'] },
        ],
        codeTitle: 'Multi-Agent 协作编排示例（LangGraph）',
        codeExample: `\`\`\`python
# agents/multi_agent.py - 多 Agent 协作编排
from typing import Annotated, TypedDict
from langgraph.graph import StateGraph, END
from langchain_core.messages import BaseMessage


class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], "对话历史"]
    plan: str
    result: str


async def planner(state: AgentState) -> AgentState:
    """规划 Agent：将复杂任务拆解为子任务"""
    # 调用 LLM 生成执行计划
    plan = await llm_call(f"请为以下任务制定执行计划：{state['messages'][-1].content}")
    return {"plan": plan}


async def executor(state: AgentState) -> AgentState:
    """执行 Agent：按计划调用工具完成任务"""
    result = await tool_dispatcher.run(state["plan"])
    return {"result": result}


async def critic(state: AgentState) -> AgentState:
    """评审 Agent：评估结果质量，决定是否重做"""
    score = await llm_call(f"评估以下结果的质量（0-10）：{state['result']}")
    if float(score) < 7:
        # 重新规划
        return {"messages": state["messages"] + [{"role": "user", "content": "结果不达标，请重新规划"}]}
    return state


def should_retry(state: AgentState) -> str:
    """路由：根据评审结果决定结束或重做"""
    return "end" if state.get("result") else "replan"


# 构建协作图
graph = StateGraph(AgentState)
graph.add_node("planner", planner)
graph.add_node("executor", executor)
graph.add_node("critic", critic)

graph.set_entry_point("planner")
graph.add_edge("planner", "executor")
graph.add_edge("executor", "critic")
graph.add_conditional_edges("critic", should_retry, {
    "end": END,
    "replan": "planner",
})

app = graph.compile()
\`\`\``,
        techSelection: [
          { scenario: 'Agent 编排', tech: 'LangGraph / AutoGen', advantage: '支持多 Agent 协作与状态机' },
          { scenario: '向量数据库', tech: 'Milvus / Qdrant', advantage: '十亿级向量检索、支持过滤' },
          { scenario: '模型微调', tech: 'LoRA + PEFT', advantage: '低成本微调、显存友好' },
          { scenario: '知识图谱', tech: 'Neo4j + LLMGraphTransformer', advantage: '结构化知识增强 RAG' },
          { scenario: '可观测性', tech: 'LangSmith / Langfuse', advantage: 'Prompt 版本与 Trace 全链路' },
        ],
      },
      'react-frontend': {
        shortTerm: [
          { title: '功能增强', items: ['PWA 离线支持与可安装', '组件库开发（Storybook）', '国际化（i18n）多语言', '主题切换（深色/浅色）'] },
          { title: '体验优化', items: ['骨架屏与首屏 SSR', '虚拟列表优化大数据渲染', '快捷键体系', '无障碍 (a11y) 完善'] },
        ],
        midTerm: [
          { title: '架构升级', items: ['SSR/SSG（Next.js / Remix）', '微前端（qiankun / Module Federation）', 'BFF 层引入（数据聚合）', '边缘计算（Edge Runtime）'] },
          { title: '技术栈扩展', items: ['React Query 数据层', 'Zustand 状态管理', 'React Hook Form 表单', 'Vitest + Playwright 测试体系'] },
        ],
        longTerm: [
          { title: '平台化', items: ['低代码搭建平台', '可视化编辑器', '组件市场与设计系统', '多端统一（Web + 小程序 + App）'] },
          { title: '智能化', items: ['AI 辅助编码（Copilot 集成）', '智能表单生成', '基于用户行为的个性化', '可视化数据洞察'] },
        ],
        codeTitle: 'PWA + Service Worker 离线缓存示例',
        codeExample: `\`\`\`typescript
// src/pwa/registerSW.ts - PWA Service Worker 注册
import { registerSW } from 'virtual:pwa-register';

export const setupPWA = () => {
  const updateSW = registerSW({
    onNeedRefresh() {
      // 提示用户有新版本可用
      console.log('[PWA] 新版本可用，刷新以更新');
    },
    onOfflineReady() {
      console.log('[PWA] 应用已可离线使用');
    },
  });
  return updateSW;
};

// src/pwa/offlineQueue.ts - 离线请求队列
interface QueuedRequest {
  url: string;
  method: string;
  body?: unknown;
  timestamp: number;
}

const QUEUE_KEY = 'offline-request-queue';

export const offlineQueue = {
  enqueue(req: QueuedRequest): void {
    const queue = this.list();
    queue.push(req);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  },

  list(): QueuedRequest[] {
    try {
      return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? '[]');
    } catch {
      return [];
    }
  },

  async flush(): Promise<void> {
    const queue = this.list();
    if (queue.length === 0) return;
    for (const req of queue) {
      try {
        await fetch(req.url, {
          method: req.method,
          body: req.body ? JSON.stringify(req.body) : undefined,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (e) {
        console.warn('[PWA] 重放失败，保留队列', e);
        return;
      }
    }
    localStorage.removeItem(QUEUE_KEY);
  },
};

// 监听网络恢复事件
window.addEventListener('online', () => {
  void offlineQueue.flush();
});
\`\`\``,
        techSelection: [
          { scenario: 'SSR/SSG', tech: 'Next.js / Remix', advantage: 'SEO 友好、首屏快、生态完善' },
          { scenario: '微前端', tech: 'Module Federation', advantage: '原生 Webpack 支持、运行时集成' },
          { scenario: 'PWA', tech: 'vite-plugin-pwa', advantage: '零配置、自动生成 SW 与 Manifest' },
          { scenario: '组件库', tech: 'Storybook + Radix UI', advantage: '可访问性 + 文档驱动开发' },
          { scenario: 'E2E 测试', tech: 'Playwright', advantage: '跨浏览器、并行、录制友好' },
        ],
      },
      'database': {
        shortTerm: [
          { title: '功能增强', items: ['读写分离部署', '慢查询监控与告警', '定时备份与恢复演练', '数据库迁移版本化（Flyway）'] },
          { title: '体验优化', items: ['连接池调优（PgBouncer）', '热点数据 Redis 缓存', '索引重建与统计信息更新', '分区表按时间切分'] },
        ],
        midTerm: [
          { title: '架构升级', items: ['分库分表（ShardingSphere）', '数据仓库（ClickHouse / Doris）', 'ETL 流水线（Airflow / dbt）', 'CDC 实时同步（Debezium）'] },
          { title: '技术栈扩展', items: ['时序数据库（InfluxDB / TDengine）', '图数据库（Neo4j）', '全文检索（Elasticsearch）', '向量数据库（pgvector / Milvus）'] },
        ],
        longTerm: [
          { title: '平台化', items: ['数据中台建设', '自助式 BI 分析平台', '数据资产目录与血缘追踪', '湖仓一体（Lakehouse）'] },
          { title: '智能化', items: ['智能索引推荐', '基于 ML 的容量预测', '异常 SQL 自动识别', '数据质量自动监控'] },
        ],
        codeTitle: '分库分表 + 读写分离示例（ShardingSphere）',
        codeExample: `\`\`\`yaml
# shardingsphere-config.yaml - 分库分表配置
dataSources:
  ds_master_0:
    dataSourceClassName: com.zaxxer.hikari.HikariDataSource
    jdbcUrl: jdbc:mysql://master-0:3306/order_db_0
    username: root
    password: \${DB_PASSWORD}
  ds_slave_0:
    dataSourceClassName: com.zaxxer.hikari.HikariDataSource
    jdbcUrl: jdbc:mysql://slave-0:3306/order_db_0
    username: root
    password: \${DB_PASSWORD}

rules:
  - !SHARDING
    tables:
      t_order:
        actualDataNodes: ds_master_\${0..1}.t_order_\${0..3}
        databaseStrategy:
          standard:
            shardingColumn: user_id
            shardingAlgorithmName: db_mod
        tableStrategy:
          standard:
            shardingColumn: order_id
            shardingAlgorithmName: table_mod
    shardingAlgorithms:
      db_mod:
        type: MOD
        props:
          sharding-count: 2
      table_mod:
        type: MOD
        props:
          sharding-count: 4
  - !READWRITE_SPLITTING
    dataSources:
      readwrite_ds:
        writeDataSourceName: ds_master_0
        readDataSourceNames:
          - ds_slave_0
        loadBalancerName: round_robin
    loadBalancers:
      round_robin:
        type: ROUND_ROBIN
\`\`\`

\`\`\`sql
-- 分库分表后的全局 ID 生成（雪花算法）
-- 应用层使用 ShardingSphere 内置的 Snowflake 算法生成分布式 ID
-- 字段定义保持 BIGINT，避免与分片键冲突

-- 时序数据表设计示例（用于 IoT 指标）
CREATE TABLE metrics (
  ts          TIMESTAMP NOT NULL,
  device_id   VARCHAR(64) NOT NULL,
  metric_name VARCHAR(50) NOT NULL,
  value       DOUBLE,
  tags        JSON,
  INDEX idx_device_time (device_id, ts),
  INDEX idx_metric_time (metric_name, ts)
) ENGINE=InnoDB PARTITION BY RANGE (UNIX_TIMESTAMP(ts)) (
  PARTITION p20260701 VALUES LESS THAN (UNIX_TIMESTAMP('2026-08-01')),
  PARTITION p20260801 VALUES LESS THAN (UNIX_TIMESTAMP('2026-09-01')),
  PARTITION pmax VALUES LESS THAN MAXVALUE
);
\`\`\``,
        techSelection: [
          { scenario: '分库分表', tech: 'ShardingSphere', advantage: 'Java 生态、配置化、支持读写分离' },
          { scenario: '数据仓库', tech: 'ClickHouse', advantage: '列存、OLAP 极速聚合' },
          { scenario: 'ETL 流水线', tech: 'Airflow + dbt', advantage: 'DAG 编排 + SQL 转换版本化' },
          { scenario: '时序数据', tech: 'TDengine / InfluxDB', advantage: '高写入吞吐、压缩比高' },
          { scenario: 'CDC 同步', tech: 'Debezium + Kafka', advantage: '实时捕获变更、解耦下游' },
        ],
      },
      'general': {
        shortTerm: [
          { title: '功能增强', items: ['数据导出（Excel / PDF）', '批量操作', '高级搜索与筛选', '收藏夹与常用项'] },
          { title: '体验优化', items: ['快捷键支持', '深色模式', '国际化', '无障碍适配'] },
        ],
        midTerm: [
          { title: '架构升级', items: ['模块化与插件化', '微服务/Serverless 改造', '统一鉴权与 API 网关', 'CI/CD 自动化'] },
          { title: '技术栈扩展', items: ['状态管理升级', '测试体系完善', '监控告警接入', '容器化部署'] },
        ],
        longTerm: [
          { title: '平台化', items: ['开放 API', '插件市场', '多端支持', '微服务治理'] },
          { title: '智能化', items: ['AI 辅助', '数据分析', '机器学习决策', '自动化运维'] },
        ],
        codeTitle: '插件系统设计示例（TypeScript）',
        codeExample: `\`\`\`typescript
// src/plugin/system.ts - 通用插件系统
export interface Plugin {
  name: string;
  version: string;
  install(context: PluginContext): void;
  uninstall?(): void;
}

export interface PluginContext {
  registerAPI: (name: string, fn: (...args: unknown[]) => unknown) => void;
  onEvent: (event: string, handler: (...args: unknown[]) => void) => void;
  emit: (event: string, ...args: unknown[]) => void;
}

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private context: PluginContext;

  constructor(context: PluginContext) {
    this.context = context;
  }

  register(plugin: Plugin): void {
    if (this.plugins.has(plugin.name)) {
      console.warn(\`插件 \${plugin.name} 已存在，将被覆盖\`);
    }
    this.plugins.set(plugin.name, plugin);
    plugin.install(this.context);
  }

  unregister(name: string): void {
    const plugin = this.plugins.get(name);
    if (plugin) {
      plugin.uninstall?.();
      this.plugins.delete(name);
    }
  }

  list(): string[] {
    return Array.from(this.plugins.keys());
  }
}
\`\`\``,
        techSelection: [
          { scenario: '状态管理', tech: 'Zustand', advantage: '轻量、TypeScript 友好' },
          { scenario: '样式方案', tech: 'TailwindCSS', advantage: '高效、一致、易维护' },
          { scenario: '数据请求', tech: 'React Query', advantage: '缓存、重试、状态管理' },
          { scenario: '测试框架', tech: 'Vitest', advantage: '快速、兼容 Jest、Vite 原生' },
          { scenario: 'CI/CD', tech: 'GitHub Actions', advantage: '易用、生态丰富、免费额度' },
        ],
      },
    };

    const profile = profileMap[projectType] ?? profileMap['general'];
    const commandSnippet = command.slice(0, 30);

    return `## 技术扩展与展望

### 项目扩展分析
针对「${command}」的未来发展方向，识别项目类型为 \`${projectType}\`，提供以下扩展建议：

### 短期扩展（1-2周）

${profile.shortTerm.map((s, i) => `#### ${i + 1}. ${s.title}
${s.items.map(item => item.includes('：') ? `- **${item.split('：')[0]}**：${item.split('：').slice(1).join('：')}` : `- ${item}`).join('\n')}`).join('\n\n')}

### 中期扩展（1-2月）

${profile.midTerm.map((s, i) => `#### ${i + 1}. ${s.title}
${s.items.map(item => item.includes('：') ? `- **${item.split('：')[0]}**：${item.split('：').slice(1).join('：')}` : `- ${item}`).join('\n')}`).join('\n\n')}

#### 架构核心代码：${profile.codeTitle}

${profile.codeExample}

### 长期扩展（3-6月）

${profile.longTerm.map((s, i) => `#### ${i + 1}. ${s.title}
${s.items.map(item => item.includes('：') ? `- **${item.split('：')[0]}**：${item.split('：').slice(1).join('：')}` : `- ${item}`).join('\n')}`).join('\n\n')}

### 技术选型建议（适配 ${projectType}）

| 场景 | 推荐技术 | 优势 |
|------|----------|------|
${profile.techSelection.map(t => `| ${t.scenario} | ${t.tech} | ${t.advantage} |`).join('\n')}

### 风险提示
1. **技术债务**：快速迭代可能积累技术债务，建议预留 20% 重构时间
2. **团队学习成本**：新技术引入需配套培训与文档
3. **向后兼容**：扩展功能时需保证现有接口契约稳定
4. **依赖锁定**：关键依赖建议锁定版本并定期评估替代方案

---
*扩展分析完成，针对「${commandSnippet}」（${projectType}）已提供清晰的长期发展路线图。*`;
  }
};

export const packagerTemplate: AgentTemplate = {
  id: 'packager',
  name: '打包员',
  role: '交付工程师',
  avatar: '📦',
  description: '文件清单、下载链接说明、打包交付',
  generateResponse: async (command: string) => {
    await delay(600 + Math.random() * 1000);
    return `## 项目打包交付

### 项目文件清单
**项目名称**：${command}
**打包时间**：${new Date().toLocaleString('zh-CN')}
**文件总数**：${Math.floor(Math.random() * 30 + 20)} 个
**总大小**：${(Math.random() * 5 + 1).toFixed(2)} MB

### 目录结构
\`\`\`
project/
├── src/
│   ├── components/          # UI组件
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── index.ts
│   ├── pages/               # 页面组件
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   └── index.ts
│   ├── hooks/               # 自定义Hooks
│   │   ├── useTheme.ts
│   │   └── useLocalStorage.ts
│   ├── utils/               # 工具函数
│   │   ├── helpers.ts
│   │   ├── constants.ts
│   │   └── validators.ts
│   ├── types/               # 类型定义
│   │   └── index.ts
│   ├── App.tsx              # 根组件
│   └── main.tsx             # 入口文件
├── public/                  # 静态资源
│   ├── favicon.svg
│   └── images/
├── package.json             # 项目配置
├── tsconfig.json            # TypeScript配置
├── vite.config.ts           # Vite配置
├── tailwind.config.js       # Tailwind配置
└── README.md                # 项目说明
\`\`\`

### 核心文件说明

| 文件 | 说明 | 大小 |
|------|------|------|
| \`src/App.tsx\` | 应用根组件，路由配置 | 2.4 KB |
| \`src/components/\` | 可复用UI组件库 | 15.8 KB |
| \`src/pages/\` | 页面组件 | 8.2 KB |
| \`src/utils/\` | 工具函数集合 | 6.5 KB |
| \`src/types/\` | TypeScript类型定义 | 3.1 KB |

### 使用说明

#### 安装依赖
\`\`\`bash
npm install
\`\`\`

#### 开发模式
\`\`\`bash
npm run dev
\`\`\`

#### 生产构建
\`\`\`bash
npm run build
\`\`\`

### 交付方式

📋 **所有代码已在上方对话中展示**，每个代码块右上角都有**复制按钮**：
- 鼠标悬停代码块 → 点击右上角复制图标 → 代码已复制到剪贴板
- 复制成功后图标变为绿色对勾 ✓

> 💡 无需下载文件，直接点击复制按钮即可获取完整代码。

---
*代码打包整理完成，可直接复制使用。*`;
  }
};

export const deployerTemplate: AgentTemplate = {
  id: 'deployer',
  name: '输送员',
  role: '部署工程师',
  avatar: '🚀',
  description: '部署进度、Git日志、成功提示',
  generateResponse: async (command: string) => {
    await delay(800 + Math.random() * 1500);
    return `## 部署进度报告

### 部署概要
**项目名称**：${command}
**部署环境**：生产环境
**部署时间**：${new Date().toLocaleString('zh-CN')}
**部署版本**：v${Math.floor(Math.random() * 2 + 1)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 5)}

### 部署进度

\`\`\`
[==============================]  100%
\`\`\`

| 步骤 | 状态 | 耗时 |
|------|------|------|
| 1. 拉取代码 | ✅ 完成 | 3s |
| 2. 安装依赖 | ✅ 完成 | 15s |
| 3. 代码检查 | ✅ 完成 | 8s |
| 4. 执行测试 | ✅ 完成 | 12s |
| 5. 构建项目 | ✅ 完成 | 20s |
| 6. 部署上线 | ✅ 完成 | 5s |
| 7. 健康检查 | ✅ 完成 | 2s |

**总耗时**：约 1 分 05 秒

### Git提交日志
最近5次提交：

\`\`\`
commit a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
Author: Developer <dev@example.com>
Date:   ${new Date().toLocaleDateString('zh-CN')}

    feat: 完成核心功能开发

commit b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0a1
Author: Developer <dev@example.com>
Date:   ${new Date(Date.now() - 86400000).toLocaleDateString('zh-CN')}

    fix: 修复用户反馈的问题

commit c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0a1b2
Author: Developer <dev@example.com>
Date:   ${new Date(Date.now() - 172800000).toLocaleDateString('zh-CN')}

    docs: 更新项目文档

commit d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0a1b2c3
Author: Developer <dev@example.com>
Date:   ${new Date(Date.now() - 259200000).toLocaleDateString('zh-CN')}

    refactor: 代码结构优化

commit e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0a1b2c3d4
Author: Developer <dev@example.com>
Date:   ${new Date(Date.now() - 345600000).toLocaleDateString('zh-CN')}

    init: 项目初始化
\`\`\`

### 部署结果

✅ **代码交付完成！**

**代码获取方式**：
- 所有代码已在上方对话中展示
- 点击代码块右上角的**复制按钮**即可一键复制
- 复制成功后会显示绿色对勾 ✓

**本地运行**：
\`\`\`bash
# 1. 复制代码到本地文件
# 2. 安装依赖
pip install -r requirements.txt  # Python项目
# 或 npm install  # 前端项目

# 3. 启动服务
python main.py  # Python项目
# 或 npm run dev  # 前端项目
\`\`\`

**健康检查**：
- 代码完整度：100%
- 依赖配置：已生成
- 文档说明：已附带

### 后续建议

1. 复制代码后先阅读 README 或注释
2. 检查 .env 配置文件，填入你的 API Key
3. 本地测试通过后再部署到生产环境

---
🎉 **所有代码已通过对话交付，点复制按钮即可获取！**`;
  }
};

export const knowledgeManagerTemplate: AgentTemplate = {
  id: 'knowledge-manager',
  name: '知识管理员',
  role: '知识管理工程师',
  avatar: '📚',
  description: '知识沉淀、经验总结、自动存入知识库',
  generateResponse: async (command: string) => {
    await delay(600 + Math.random() * 1000);
    const keywords = command.length > 10 ? command.slice(0, 10) + '...' : command;
    return `## 知识沉淀报告

### 本次任务知识总结
**任务主题**：${command}

### 核心知识点
1. **需求分析方法**
   - 从用户原始描述中提取核心诉求
   - 识别功能边界和约束条件
   - 制定可执行的实现路径

2. **多角色协作流程**
   - 分析员负责需求拆解和方案制定
   - 多个代码员分工协作并行开发
   - 审查员双重把关确保质量
   - 扩展员提供未来发展方向

3. **质量保障机制**
   - 代码审查 + Bug检测双重检查
   - 自动化测试覆盖
   - 部署前健康检查

### 经验教训
- 清晰的需求描述能显著提高开发效率
- 多角色协作比单人开发质量更高
- 知识沉淀对后续项目有重要参考价值

### 已存入知识库
本次任务的关键知识已自动归档到知识库，分类为：**项目经验**，标签：\`${keywords}\`、\`多Agent协作\`、\`最佳实践\`。

---
📚 **知识已沉淀，经验已积累。**`;
  }
};

export const agentTemplates: AgentTemplate[] = [
  analystTemplate,
  coderATemplate,
  coderBTemplate,
  coderCTemplate,
  coderDTemplate,
  coderETemplate,
  reviewerTemplate,
  bugDetectorTemplate,
  extenderTemplate,
  packagerTemplate,
  deployerTemplate,
  knowledgeManagerTemplate
];

export const getAgentById = (id: string): AgentTemplate | undefined => {
  return agentTemplates.find(agent => agent.id === id);
};

export const getAgentsByRole = (role: string): AgentTemplate[] => {
  return agentTemplates.filter(agent => 
    agent.role.toLowerCase().includes(role.toLowerCase())
  );
};
