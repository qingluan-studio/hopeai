# 技术架构文档 - 多Agent协作系统

## 1. 架构设计

```mermaid
graph TD
    subgraph "前端层 (React + TypeScript)"
        A["主控台页面"] --> B["Agent状态面板"]
        A --> C["对话系统组件"]
        A --> D["代码预览组件"]
        E["知识库页面"] --> F["知识列表组件"]
        E --> G["搜索过滤组件"]
        H["部署中心页面"] --> I["部署队列组件"]
        H --> J["GitHub配置组件"]
        K["设置页面"] --> L["主题配置"]
        K --> M["Agent参数配置"]
    end

    subgraph "状态管理层 (Zustand)"
        N["对话Store"]
        O["Agent Store"]
        P["知识库Store"]
        Q["部署Store"]
        R["主题Store"]
    end

    subgraph "后端服务层 (Express)"
        S["Agent模拟API"]
        T["知识库管理API"]
        U["GitHub部署API"]
        V["文件管理API"]
    end

    subgraph "数据层"
        W["LocalStorage (前端持久化)"]
        X["内存数据存储"]
        Y["文件系统 (后端)"]
    end

    subgraph "外部服务"
        Z["GitHub API"]
        AA["Markdown渲染库"]
        AB["代码高亮库"]
    end

    B & C & D & F & G & I & J & L & M --> N & O & P & Q & R
    N & O & P & Q & R --> S & T & U & V
    S & T & U & V --> W & X & Y
    U --> Z
    D --> AA & AB
```

## 2. 技术描述

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **样式方案**: TailwindCSS 3 + CSS变量主题系统
- **状态管理**: Zustand
- **路由管理**: React Router DOM 6
- **后端框架**: Express 4 + TypeScript
- **图标库**: Lucide React
- **Markdown渲染**: react-markdown + remark-gfm
- **代码高亮**: prismjs / react-syntax-highlighter
- **动画效果**: CSS动画 + Framer Motion (轻量使用)
- **HTTP客户端**: fetch API (原生)
- **部署目标**: GitHub Pages

## 3. 路由定义

| 路由 | 页面 | 用途 |
|------|------|------|
| `/` | 主控台 | 主要工作区，Agent协作对话 |
| `/knowledge` | 知识库 | 知识条目浏览与管理 |
| `/deploy` | 部署中心 | GitHub部署配置与执行 |
| `/settings` | 设置 | 主题、Agent参数配置 |

## 4. API 定义

### 4.1 Agent 对话 API

```typescript
// 消息类型
interface Message {
  id: string;
  role: 'chairman' | 'analyst' | 'coder1' | 'coder2' | 'coder3' | 'inspector1' | 'inspector2' | 'expander' | 'packager' | 'delivery';
  content: string;
  timestamp: number;
  type: 'text' | 'code' | 'file' | 'status';
  metadata?: Record<string, any>;
}

// Agent 状态
interface AgentState {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'thinking' | 'working' | 'done' | 'error';
  currentTask?: string;
  progress: number;
  lastActive: number;
}

// POST /api/agent/command
// 下达命令，启动Agent工作流
interface CommandRequest {
  command: string;
  context?: string[];
}
interface CommandResponse {
  taskId: string;
  status: 'started';
}

// GET /api/agent/stream/:taskId (SSE)
// 流式获取Agent输出
interface StreamEvent {
  type: 'message' | 'status' | 'progress' | 'complete';
  agentId: string;
  data: any;
}
```

### 4.2 知识库 API

```typescript
interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  createdAt: number;
  updatedAt: number;
  source: 'conversation' | 'manual' | 'deployment';
}

// GET /api/knowledge?category=&tag=&search=
interface KnowledgeListResponse {
  entries: KnowledgeEntry[];
  total: number;
}

// POST /api/knowledge
interface CreateKnowledgeRequest {
  title: string;
  content: string;
  tags: string[];
  category: string;
}

// DELETE /api/knowledge/:id
```

### 4.3 部署 API

```typescript
interface DeployConfig {
  githubToken: string;
  repoUrl: string;
  branch: string;
  targetPath: string;
}

interface DeployTask {
  id: string;
  status: 'pending' | 'building' | 'uploading' | 'done' | 'error';
  progress: number;
  logs: string[];
  createdAt: number;
  completedAt?: number;
}

// POST /api/deploy/run
interface DeployRequest {
  files: Record<string, string>;
  message: string;
  config: DeployConfig;
}
interface DeployResponse {
  taskId: string;
}

// GET /api/deploy/status/:taskId
```

## 5. 前端架构

```mermaid
graph TD
    subgraph "Pages"
        A["Dashboard.tsx 主控台"]
        B["Knowledge.tsx 知识库"]
        C["Deploy.tsx 部署中心"]
        D["Settings.tsx 设置"]
    end

    subgraph "Components"
        E["StatusBar.tsx 状态栏"]
        F["AgentPanel.tsx Agent面板"]
        G["ChatArea.tsx 对话区"]
        H["CommandInput.tsx 命令输入"]
        I["CodePreview.tsx 代码预览"]
        J["KnowledgeList.tsx 知识列表"]
        K["DeployQueue.tsx 部署队列"]
        L["ThemeToggle.tsx 主题切换"]
    end

    subgraph "Stores"
        M["useChatStore 对话状态"]
        N["useAgentStore Agent状态"]
        O["useKnowledgeStore 知识库"]
        P["useDeployStore 部署状态"]
        Q["useThemeStore 主题状态"]
    end

    subgraph "Hooks"
        R["useAgentStream 流式对话"]
        S["useTypewriter 打字机效果"]
        T["useLocalStorage 本地存储"]
    end

    A --> E & F & G & H & I
    B --> J
    C --> K
    G --> M
    F --> N
    J --> O
    K --> P
    A --> Q
    G --> R & S
    O --> T
```

## 6. 数据模型

### 6.1 ER 图

```mermaid
erDiagram
    MESSAGE ||--o{ AGENT : "sent_by"
    KNOWLEDGE_ENTRY }o--o{ TAG : "has"
    DEPLOY_TASK ||--|| MESSAGE : "produces"
    TASK ||--|{ MESSAGE : "contains"

    MESSAGE {
        string id PK
        string agentId FK
        string role
        string content
        string type
        number timestamp
        json metadata
    }

    AGENT {
        string id PK
        string name
        string role
        string status
        number progress
        string currentTask
    }

    KNOWLEDGE_ENTRY {
        string id PK
        string title
        string content
        string category
        string source
        number createdAt
    }

    TAG {
        string id PK
        string name
        string color
    }

    DEPLOY_TASK {
        string id PK
        string status
        number progress
        json logs
        number createdAt
    }

    TASK {
        string id PK
        string command
        string status
        number createdAt
    }
```

### 6.2 前端数据持久化
- 使用 LocalStorage 存储：主题设置、GitHub配置、对话历史、知识库条目
- 数据加密：敏感信息（如GitHub Token）使用 base64 简单编码存储
- 容量限制：单条消息不超过10KB，总存储不超过5MB

## 7. Agent 模拟引擎设计

由于不依赖外部AI服务，系统采用**规则引擎 + 模板生成**的方式模拟Agent行为：

- **分析员Agent**: 解析用户命令，提取关键词，生成结构化分析报告模板
- **代码员Agent**: 根据分析结果，从代码模板库中匹配并生成代码片段
- **检查员Agent**: 基于规则检查代码格式、变量命名、常见错误模式
- **扩展员Agent**: 基于关键词生成扩展性建议模板
- **打包员Agent**: 将生成的代码文件整理为可下载格式
- **输送员Agent**: 调用GitHub API完成部署

所有Agent输出均使用**打字机效果**流式呈现，模拟真实思考过程。
