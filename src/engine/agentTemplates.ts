export interface AgentTemplate {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
  generateResponse: (command: string, context?: Record<string, unknown>) => Promise<string>;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const analystTemplate: AgentTemplate = {
  id: 'analyst',
  name: '分析员',
  role: '需求分析师',
  avatar: '🔍',
  description: '接收命令后生成分析报告，拆解需求、提出方案、列出步骤',
  generateResponse: async (command: string) => {
    await delay(800 + Math.random() * 1200);
    return `## 需求分析报告

### 一、需求拆解
**原始需求**：${command}

**核心目标**：
- 目标1：理解并明确用户的核心诉求
- 目标2：识别功能边界与约束条件
- 目标3：制定可执行的实现路径

**功能模块**：
1. 输入处理模块 - 接收并解析用户指令
2. 逻辑处理模块 - 核心业务逻辑实现
3. 输出展示模块 - 结果呈现与交互反馈

### 二、技术方案
**推荐技术栈**：
- 前端：React + TypeScript + TailwindCSS
- 后端：Node.js + Express
- 构建工具：Vite

**架构设计**：
采用分层架构，确保代码的可维护性和可扩展性。

### 三、实施步骤
| 阶段 | 任务 | 预计耗时 |
|------|------|----------|
| 1 | 需求确认与方案设计 | 10min |
| 2 | 核心功能开发 | 30min |
| 3 | 代码审查与优化 | 15min |
| 4 | 测试与部署 | 10min |

### 四、风险评估
- 潜在风险：需求变更可能影响开发进度
- 应对措施：采用迭代开发模式，快速响应变化

---
*请确认以上分析是否符合您的预期，或提出调整意见。*`;
  }
};

export const coderATemplate: AgentTemplate = {
  id: 'coder-a',
  name: '代码员A',
  role: '前端/UI工程师',
  avatar: '🎨',
  description: '专注于前端界面开发、UI组件设计、用户体验优化',
  generateResponse: async (command: string) => {
    await delay(1000 + Math.random() * 1500);
    const hasReact = command.toLowerCase().includes('react') || command.toLowerCase().includes('组件');
    const hasStyle = command.toLowerCase().includes('样式') || command.toLowerCase().includes('ui') || command.toLowerCase().includes('界面');
    
    let codeExample = '';
    if (hasReact) {
      codeExample = `\`\`\`tsx
import { useState } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export const Button = ({ children, variant = 'primary', onClick }: ButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyles = 'px-6 py-3 rounded-lg font-medium transition-all duration-200';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={\`\${baseStyles} \${variants[variant]}\`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </motion.button>
  );
};
\`\`\``;
    } else if (hasStyle) {
      codeExample = `\`\`\`css
.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.card-content {
  color: #6b7280;
  line-height: 1.6;
}
\`\`\``;
    } else {
      codeExample = `\`\`\`html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>前端界面</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, sans-serif; background: #f3f4f6; }
    .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 40px; }
    .header h1 { font-size: 2.5rem; color: #1f2937; margin-bottom: 10px; }
    .header p { color: #6b7280; font-size: 1.1rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
    .card { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
    .card h3 { font-size: 1.25rem; margin-bottom: 12px; color: #1f2937; }
    .card p { color: #6b7280; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>欢迎使用</h1>
      <p>现代化的前端界面设计</p>
    </div>
    <div class="grid">
      <div class="card">
        <h3>功能一</h3>
        <p>描述功能一的详细信息和使用方法。</p>
      </div>
      <div class="card">
        <h3>功能二</h3>
        <p>描述功能二的详细信息和使用方法。</p>
      </div>
      <div class="card">
        <h3>功能三</h3>
        <p>描述功能三的详细信息和使用方法。</p>
      </div>
    </div>
  </div>
</body>
</html>
\`\`\``;
    }

    return `## 前端/UI开发方案

### 设计思路
针对「${command}」的需求，我采用现代化的前端设计理念：

- **响应式设计**：适配从移动端到桌面端的各种屏幕尺寸
- **组件化开发**：将UI拆分为可复用的组件，提高开发效率
- **交互动效**：添加平滑的动画效果，提升用户体验
- **可访问性**：遵循WAI-ARIA规范，确保所有用户都能使用

### 核心组件代码示例

${codeExample}

### 样式规范
- 主色调：蓝色系 (#3b82f6)
- 中性色：灰色调，确保内容可读性
- 间距系统：基于 4px 的间距比例
- 字体层级：清晰的标题与正文层级关系

### 目录结构建议
\`\`\`
src/
├── components/
│   ├── ui/          # 基础UI组件
│   ├── layout/      # 布局组件
│   └── features/    # 业务组件
├── hooks/           # 自定义Hooks
├── styles/          # 全局样式
└── pages/           # 页面组件
\`\`\`

---
*前端界面开发完成，注重用户体验与视觉设计的平衡。*`;
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
    const hasApi = command.toLowerCase().includes('api') || command.toLowerCase().includes('接口');
    const hasData = command.toLowerCase().includes('数据') || command.toLowerCase().includes('数据库');
    
    let codeExample = '';
    if (hasApi) {
      codeExample = `\`\`\`typescript
import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

const users: Map<string, User> = new Map();

router.get('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;
    
    const userList = Array.from(users.values()).slice(startIndex, startIndex + limit);
    
    res.json({
      success: true,
      data: userList,
      pagination: {
        page,
        limit,
        total: users.size
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/users',
  [
    body('name').notEmpty().withMessage('姓名不能为空'),
    body('email').isEmail().withMessage('邮箱格式不正确')
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { name, email } = req.body;
      const id = Date.now().toString();
      const user: User = {
        id,
        name,
        email,
        createdAt: new Date()
      };
      
      users.set(id, user);
      
      res.status(201).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
\`\`\``;
    } else if (hasData) {
      codeExample = `\`\`\`typescript
interface DataProcessor<T> {
  process(data: T[]): T[];
  validate(data: T): boolean;
  transform(data: T): T;
}

abstract class BaseDataProcessor<T> implements DataProcessor<T> {
  process(data: T[]): T[] {
    return data
      .filter(item => this.validate(item))
      .map(item => this.transform(item));
  }

  abstract validate(data: T): boolean;
  abstract transform(data: T): T;
}

class UserDataProcessor extends BaseDataProcessor<User> {
  validate(user: User): boolean {
    return !!user.email && !!user.name;
  }

  transform(user: User): User {
    return {
      ...user,
      name: user.name.trim(),
      email: user.email.toLowerCase(),
      createdAt: user.createdAt || new Date()
    };
  }
}

export { DataProcessor, BaseDataProcessor, UserDataProcessor };
\`\`\``;
    } else {
      codeExample = `\`\`\`javascript
// 工具函数集合
const utils = {
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => utils.deepClone(item));
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = utils.deepClone(obj[key]);
      }
    }
    return cloned;
  },

  debounce(fn, delay = 300) {
    let timer = null;
    return function(...args) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  throttle(fn, interval = 300) {
    let lastTime = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastTime >= interval) {
        lastTime = now;
        fn.apply(this, args);
      }
    };
  },

  formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  },

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
};

export default utils;
\`\`\``;
    }

    return `## 后端/逻辑开发方案

### 架构设计
针对「${command}」的业务需求，后端服务设计如下：

- **RESTful API设计**：遵循REST规范，提供清晰的接口定义
- **分层架构**：Controller → Service → Repository，职责分离
- **错误处理**：统一的错误处理机制，友好的错误提示
- **数据校验**：输入参数验证，确保数据完整性

### 核心代码示例

${codeExample}

### API接口规范
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
*后端逻辑开发完成，注重代码质量与系统稳定性。*`;
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
    return `## 架构设计与优化方案

### 架构分析
针对「${command}」的系统架构进行深入分析与优化：

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

#### 2. 架构优化
\`\`\`typescript
// 依赖注入容器示例
class Container {
  private services = new Map<string, () => unknown>();
  private instances = new Map<string, unknown>();

  register<T>(name: string, factory: () => T): void {
    this.services.set(name, factory);
  }

  resolve<T>(name: string): T {
    if (this.instances.has(name)) {
      return this.instances.get(name) as T;
    }
    
    const factory = this.services.get(name);
    if (!factory) {
      throw new Error(\`Service '\${name}' not found\`);
    }
    
    const instance = factory();
    this.instances.set(name, instance);
    return instance as T;
  }
}

export const container = new Container();
\`\`\`

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
*架构分析与优化建议已完成，系统可扩展性和性能将显著提升。*`;
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
    return `## 测试用例设计方案

### 测试策略
针对「${command}」的功能需求，制定全面的测试策略：

- **单元测试**：覆盖所有核心函数和组件
- **集成测试**：验证模块间协作的正确性
- **端到端测试**：模拟用户操作流程
- **性能测试**：确保系统响应时间达标

### 测试代码示例

\`\`\`typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const mockClick = vi.fn();
    render(<Button onClick={mockClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('should apply correct variant styles', () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-blue');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
\`\`\`

### 测试覆盖率目标
| 模块 | 目标覆盖率 | 优先级 |
|------|-----------|--------|
| 核心业务逻辑 | 95% | 高 |
| 工具函数 | 90% | 高 |
| UI组件 | 80% | 中 |
| API接口 | 85% | 中 |

---
*测试方案设计完成，确保代码质量可靠。*`;
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
    return `## 数据库设计方业

### 数据建模分析
针对「${command}」的数据需求，设计如下数据模型：

#### 核心数据表设计

\`\`\`sql
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
\`\`\`

### 性能优化建议

1. **索引优化**：为高频查询字段建立合适索引
2. **分表策略**：大数据量表采用水平分表
3. **缓存层**：引入Redis缓存热点数据
4. **读写分离**：主从复制，读写分离提升并发能力

### 数据安全
- 敏感字段加密存储（如密码使用bcrypt）
- 定期备份策略（每日全量+实时增量）
- 数据访问审计日志

---
*数据库设计完成，支持高并发与数据安全。*`;
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
    const bugs = [
      { severity: 'low', type: '代码风格', description: '部分行尾存在多余空格', location: 'utils.ts:42' },
      { severity: 'medium', type: '类型安全', description: '函数参数缺少类型定义', location: 'api.ts:128' },
      { severity: 'low', type: '最佳实践', description: '建议使用常量替代魔法数字', location: 'config.ts:15' },
      { severity: 'high', type: '错误处理', description: '异步操作缺少错误捕获', location: 'service.ts:89' }
    ];

    const randomBugs = bugs.filter(() => Math.random() > 0.3);
    
    return `## 代码审查报告

### 审查概要
**审查对象**：${command}
**审查时间**：${new Date().toLocaleString('zh-CN')}
**代码行数**：约 ${Math.floor(Math.random() * 500 + 200)} 行

### 质量评分
| 维度 | 评分 | 说明 |
|------|------|------|
| 代码规范 | ${Math.floor(Math.random() * 15 + 85)}/100 | 整体符合规范，少量细节待改进 |
| 类型安全 | ${Math.floor(Math.random() * 15 + 80)}/100 | TypeScript使用良好，部分类型可完善 |
| 性能表现 | ${Math.floor(Math.random() * 10 + 85)}/100 | 性能良好，无明显瓶颈 |
| 可维护性 | ${Math.floor(Math.random() * 15 + 80)}/100 | 代码结构清晰，命名规范 |
| 安全性 | ${Math.floor(Math.random() * 10 + 88)}/100 | 安全措施到位，无明显漏洞 |

**综合评分**：${Math.floor(Math.random() * 10 + 85)}/100 ⭐

### 发现的问题

${randomBugs.length > 0 ? randomBugs.map((bug, index) => `
**问题 ${index + 1}** - [${bug.severity === 'high' ? '🔴 严重' : bug.severity === 'medium' ? '🟡 中等' : '🟢 轻微'}] ${bug.type}
- 描述：${bug.description}
- 位置：${bug.location}
- 建议：${bug.severity === 'high' ? '请立即修复此问题' : bug.severity === 'medium' ? '建议尽快修复' : '可在下个迭代优化'}
`).join('') : '✅ 未发现明显问题，代码质量优秀！'}

### 改进建议

1. **代码规范**：建议使用 ESLint + Prettier 统一代码风格
2. **类型定义**：完善接口类型定义，避免使用 any
3. **错误处理**：统一错误处理机制，增加边界情况处理
4. **单元测试**：补充核心模块的单元测试用例
5. **代码注释**：为复杂逻辑添加必要的注释说明

### 总结
整体代码质量良好，架构设计合理。${randomBugs.filter(b => b.severity === 'high').length > 0 ? '存在严重问题需要优先修复。' : '少量小问题不影响功能，可逐步优化。'}

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
    return `## Bug检测报告

### 测试概要
**测试对象**：${command}
**测试类型**：功能测试 + 边界测试 + 异常测试
**测试用例数**：${Math.floor(Math.random() * 20 + 30)} 个

### 测试结果
| 测试类型 | 用例数 | 通过 | 失败 | 通过率 |
|----------|--------|------|------|--------|
| 功能测试 | 15 | 15 | 0 | 100% |
| 边界测试 | 10 | 9 | 1 | 90% |
| 异常测试 | 8 | 7 | 1 | 87.5% |
| 性能测试 | 5 | 5 | 0 | 100% |
| **合计** | **38** | **36** | **2** | **94.7%** |

### 发现的Bug

#### 🐛 Bug #1 - [中等] 边界值处理不当
**描述**：当输入为空字符串时，函数返回异常结果
**复现步骤**：
1. 调用处理函数，传入空字符串
2. 观察返回值
**预期行为**：应返回空值或抛出友好错误
**实际行为**：返回 undefined，可能导致后续错误
**影响范围**：单模块
**优先级**：中等

#### 🐛 Bug #2 - [轻微] 异常处理不完善
**描述**：网络请求失败时，错误提示不够友好
**复现步骤**：
1. 断开网络连接
2. 触发数据请求
**预期行为**：显示友好的网络错误提示
**实际行为**：显示技术错误信息
**影响范围**：用户体验
**优先级**：低

### 测试覆盖建议
- 增加空值、null、undefined 等边界情况测试
- 完善异常场景测试用例
- 添加性能基准测试
- 补充安全相关测试

---
*Bug检测完成，2个问题待修复，整体质量良好。*`;
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
    return `## 技术扩展与展望

### 项目扩展分析
针对「${command}」的未来发展方向，提供以下扩展建议：

### 短期扩展（1-2周）

#### 1. 功能增强
- **数据导出**：支持 Excel、PDF 等格式导出
- **批量操作**：支持批量处理，提升效率
- **搜索过滤**：高级搜索与筛选功能
- **收藏夹**：常用内容收藏功能

#### 2. 体验优化
- **快捷键支持**：常用操作快捷键
- **深色模式**：主题切换功能
- **国际化**：多语言支持
- **无障碍**：屏幕阅读器适配

### 中期扩展（1-2月）

#### 1. 架构升级
\`\`\`typescript
// 插件系统设计示例
interface Plugin {
  name: string;
  version: string;
  install(context: PluginContext): void;
  uninstall?(): void;
}

class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private context: PluginContext;

  constructor(context: PluginContext) {
    this.context = context;
  }

  register(plugin: Plugin): void {
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
}
\`\`\`

#### 2. 技术栈扩展
- **状态管理**：引入 Zustand/Redux 管理复杂状态
- **测试框架**：Vitest + Testing Library
- **CI/CD**：自动化构建与部署
- **监控系统**：错误监控与性能监控

### 长期扩展（3-6月）

#### 1. 平台化
- **开放API**：提供第三方接入能力
- **插件市场**：开发者生态建设
- **多端支持**：移动端 App、桌面端
- **微服务**：服务化架构改造

#### 2. 智能化
- **AI辅助**：智能推荐与自动化
- **数据分析**：数据可视化与洞察
- **机器学习**：基于数据的智能决策

### 技术选型建议

| 场景 | 推荐技术 | 优势 |
|------|----------|------|
| 状态管理 | Zustand | 轻量、简单、TypeScript友好 |
| 样式方案 | TailwindCSS | 高效、一致、易维护 |
| 数据请求 | React Query | 缓存、重试、状态管理 |
| 表单处理 | React Hook Form | 高性能、易扩展 |
| 测试框架 | Vitest | 快速、兼容Jest、Vite原生 |

### 风险提示
1. **技术债务**：快速迭代可能积累技术债务
2. **团队学习成本**：新技术引入需要学习时间
3. **兼容性**：扩展功能时需注意向后兼容

---
*扩展分析完成，为项目的长期发展提供了清晰的路线图。*`;
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

#### 预览构建结果
\`\`\`bash
npm run preview
\`\`\`

### 下载说明
📥 **项目源码包**：project-source.zip
📥 **构建产物**：dist.zip
📥 **文档**：documentation.pdf

*所有文件已准备就绪，可立即下载使用。*

---
*项目打包完成，祝您使用愉快！*`;
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

✅ **部署成功！**

**访问地址**：
- 生产环境：https://${command.toLowerCase().replace(/[^a-z0-9]/g, '-')}.example.com
- 预览环境：https://preview-${command.toLowerCase().replace(/[^a-z0-9]/g, '-')}.example.com

**健康检查**：
- 应用状态：运行中
- CPU使用率：${Math.floor(Math.random() * 30 + 10)}%
- 内存使用：${Math.floor(Math.random() * 200 + 100)}MB
- 响应时间：${Math.floor(Math.random() * 50 + 20)}ms

### 回滚方案
如需回滚到上一版本：
\`\`\`bash
# 查看部署历史
vercel list

# 回滚到指定版本
vercel rollback <deployment-id>
\`\`\`

---
🎉 **部署完成！项目已成功上线运行。**`;
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
  deployerTemplate
];

export const getAgentById = (id: string): AgentTemplate | undefined => {
  return agentTemplates.find(agent => agent.id === id);
};

export const getAgentsByRole = (role: string): AgentTemplate[] => {
  return agentTemplates.filter(agent => 
    agent.role.toLowerCase().includes(role.toLowerCase())
  );
};
