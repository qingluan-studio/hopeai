import { vfs, toolEngine, type ToolResult } from '@/tools/toolEngine';

export type TaskStatus = 'pending' | 'planning' | 'running' | 'completed' | 'failed' | 'cancelled';
export type StepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';

export interface TaskStep {
  id: string;
  title: string;
  description: string;
  status: StepStatus;
  agentRole?: string;
  tool?: string;
  output?: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  subtasks?: TaskStep[];
}

export interface AgentTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  steps: TaskStep[];
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  deliverables: Deliverable[];
  logs: TaskLog[];
  currentStepIndex: number;
  maxIterations: number;
  iterationCount: number;
}

export interface Deliverable {
  id: string;
  name: string;
  type: 'file' | 'archive' | 'report' | 'website';
  path?: string;
  size?: number;
  createdAt: string;
  description?: string;
}

export interface TaskLog {
  timestamp: string;
  type: 'info' | 'tool' | 'agent' | 'error' | 'success' | 'thinking';
  message: string;
  detail?: string;
  agentName?: string;
  toolName?: string;
}

export interface TaskEngineOptions {
  maxIterations?: number;
  autoPlan?: boolean;
  useSwarm?: boolean;
  maxSwarmAgents?: number;
  onProgress?: (task: AgentTask) => void;
  onLog?: (log: TaskLog) => void;
}

const MAX_ITERATIONS = 50;
const MAX_SWARM_AGENTS = 6;

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class TaskEngine {
  private tasks: Map<string, AgentTask> = new Map();
  private abortControllers: Map<string, AbortController> = new Map();
  private options: TaskEngineOptions;

  constructor(options: TaskEngineOptions = {}) {
    this.options = {
      maxIterations: MAX_ITERATIONS,
      autoPlan: true,
      useSwarm: false,
      maxSwarmAgents: MAX_SWARM_AGENTS,
      ...options
    };
  }

  setOptions(options: Partial<TaskEngineOptions>): void {
    this.options = { ...this.options, ...options };
  }

  createTask(title: string, description: string): AgentTask {
    const task: AgentTask = {
      id: generateId(),
      title,
      description,
      status: 'pending',
      steps: [],
      createdAt: new Date().toISOString(),
      deliverables: [],
      logs: [],
      currentStepIndex: -1,
      maxIterations: this.options.maxIterations || MAX_ITERATIONS,
      iterationCount: 0,
    };

    this.tasks.set(task.id, task);
    this.addLog(task.id, {
      type: 'info',
      message: `任务已创建: ${title}`,
    });

    return task;
  }

  async planTask(taskId: string): Promise<AgentTask> {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error('任务不存在');

    task.status = 'planning';
    this.notifyProgress(task);

    this.addLog(taskId, {
      type: 'thinking',
      message: '正在分析需求，规划任务步骤...',
    });

    await delay(1200 + Math.random() * 800);

    const steps = this.autoPlanSteps(task.description);
    task.steps = steps;

    this.addLog(taskId, {
      type: 'success',
      message: `规划完成，共 ${steps.length} 个步骤`,
      detail: steps.map((s, i) => `${i + 1}. ${s.title}`).join('\n'),
    });

    task.status = 'pending';
    this.notifyProgress(task);

    return task;
  }

  private autoPlanSteps(description: string): TaskStep[] {
    const desc = description.toLowerCase();
    const steps: TaskStep[] = [];

    steps.push({
      id: generateId(),
      title: '需求分析与技术选型',
      description: '分析任务需求，确定技术方案和实现路径',
      status: 'pending',
      agentRole: 'analyst',
    });

    const isWebsite = desc.includes('网站') || desc.includes('web') || desc.includes('网页') || desc.includes('页面') || desc.includes('前端');
    const isCode = desc.includes('代码') || desc.includes('开发') || desc.includes('程序') || desc.includes('脚本') || desc.includes('软件');
    const isData = desc.includes('数据') || desc.includes('分析') || desc.includes('报表') || desc.includes('统计');
    const isDesign = desc.includes('设计') || desc.includes('ui') || desc.includes('界面') || desc.includes('原型');
    const isDoc = desc.includes('文档') || desc.includes('报告') || desc.includes('方案') || desc.includes('prd');

    if (isDesign || isWebsite) {
      steps.push({
        id: generateId(),
        title: '产品设计与交互规划',
        description: '设计产品结构、用户流程和交互方案',
        status: 'pending',
        agentRole: 'pm',
      });
      steps.push({
        id: generateId(),
        title: 'UI设计与视觉方案',
        description: '设计界面风格、配色方案和视觉元素',
        status: 'pending',
        agentRole: 'designer',
      });
    }

    if (isCode || isWebsite) {
      steps.push({
        id: generateId(),
        title: '架构设计与核心代码',
        description: '搭建项目架构，编写核心功能代码',
        status: 'pending',
        agentRole: 'coder-a',
      });
      steps.push({
        id: generateId(),
        title: '功能实现与细节打磨',
        description: '实现具体功能，打磨交互细节',
        status: 'pending',
        agentRole: 'coder-b',
      });
    }

    if (isData) {
      steps.push({
        id: generateId(),
        title: '数据收集与清洗',
        description: '收集数据源，进行数据清洗和预处理',
        status: 'pending',
        agentRole: 'data-engineer',
      });
      steps.push({
        id: generateId(),
        title: '数据分析与可视化',
        description: '进行深度分析，生成可视化报告',
        status: 'pending',
        agentRole: 'data-scientist',
      });
    }

    if (isDoc) {
      steps.push({
        id: generateId(),
        title: '文档撰写与整理',
        description: '撰写完整文档，整理结构和内容',
        status: 'pending',
        agentRole: 'technical-writer',
      });
    }

    steps.push({
      id: generateId(),
      title: '质量检测与优化',
      description: '检查代码质量，进行优化和修复',
      status: 'pending',
      agentRole: 'qa',
    });

    steps.push({
      id: generateId(),
      title: '交付物整理与输出',
      description: '整理所有产出，打包交付最终成果',
      status: 'pending',
      agentRole: 'devops',
    });

    return steps;
  }

  async executeTask(taskId: string): Promise<AgentTask> {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error('任务不存在');

    const abortController = new AbortController();
    this.abortControllers.set(taskId, abortController);

    try {
      if (task.steps.length === 0 && this.options.autoPlan) {
        await this.planTask(taskId);
      }

      task.status = 'running';
      task.startedAt = new Date().toISOString();
      this.notifyProgress(task);

      this.addLog(taskId, {
        type: 'info',
        message: '任务开始执行',
      });

      for (let i = 0; i < task.steps.length; i++) {
        if (abortController.signal.aborted) break;

        task.currentStepIndex = i;
        const step = task.steps[i];
        step.status = 'running';
        step.startedAt = new Date().toISOString();

        this.addLog(taskId, {
          type: 'agent',
          message: `[${i + 1}/${task.steps.length}] ${step.title}`,
          agentName: step.agentRole,
        });

        this.notifyProgress(task);

        try {
          if (this.options.useSwarm && this.isDecomposableStep(step)) {
            await this.executeSwarmStep(task, step, abortController.signal);
          } else {
            await this.executeStep(task, step, abortController.signal);
          }

          step.status = 'completed';
          step.completedAt = new Date().toISOString();

          this.addLog(taskId, {
            type: 'success',
            message: `✓ ${step.title} 完成`,
            detail: step.output,
          });
        } catch (error) {
          step.status = 'failed';
          step.error = error instanceof Error ? error.message : '未知错误';
          step.completedAt = new Date().toISOString();

          this.addLog(taskId, {
            type: 'error',
            message: `✗ ${step.title} 失败`,
            detail: step.error,
          });

          task.iterationCount++;
          if (task.iterationCount < task.maxIterations) {
            this.addLog(taskId, {
              type: 'thinking',
              message: `尝试自动修复 (${task.iterationCount}/${task.maxIterations})...`,
            });
            i--;
            step.status = 'pending';
            await delay(500);
            continue;
          } else {
            task.status = 'failed';
            this.notifyProgress(task);
            throw error;
          }
        }

        this.notifyProgress(task);
      }

      if (!abortController.signal.aborted) {
        task.status = 'completed';
        task.completedAt = new Date().toISOString();

        await this.generateDeliverables(task);

        this.addLog(taskId, {
          type: 'success',
          message: `🎉 任务全部完成！共 ${task.steps.length} 个步骤`,
        });
      } else {
        task.status = 'cancelled';
        this.addLog(taskId, {
          type: 'info',
          message: '任务已取消',
        });
      }

      this.notifyProgress(task);
      return task;
    } finally {
      this.abortControllers.delete(taskId);
    }
  }

  private isDecomposableStep(step: TaskStep): boolean {
    const decomposableRoles = ['coder-a', 'coder-b', 'data-engineer', 'data-scientist'];
    return decomposableRoles.includes(step.agentRole || '');
  }

  private async executeStep(task: AgentTask, step: TaskStep, signal: AbortSignal): Promise<void> {
    await delay(800 + Math.random() * 1500);

    if (signal.aborted) return;

    const role = step.agentRole || 'coder-a';
    const result = this.generateStepOutput(step, role, task.id);
    step.output = result.output;

    if (result.filePath && result.fileContent) {
      vfs.writeFile(result.filePath, result.fileContent);

      this.addLog(task.id, {
        type: 'tool',
        message: `创建文件: ${result.filePath}`,
        toolName: 'aci_create',
      });
    }

    task.iterationCount++;
  }

  private async executeSwarmStep(task: AgentTask, step: TaskStep, signal: AbortSignal): Promise<void> {
    const subtaskCount = Math.min(
      3 + Math.floor(Math.random() * 3),
      this.options.maxSwarmAgents || MAX_SWARM_AGENTS
    );

    this.addLog(task.id, {
      type: 'thinking',
      message: `启动 Agent 集群模式，拆分 ${subtaskCount} 个子任务并行执行`,
    });

    const subtasks: TaskStep[] = [];
    for (let i = 0; i < subtaskCount; i++) {
      subtasks.push({
        id: generateId(),
        title: `子任务 ${i + 1}: ${this.getSubtaskTitle(step, i)}`,
        description: `并行执行的子任务 ${i + 1}`,
        status: 'pending',
        agentRole: step.agentRole,
      });
    }
    step.subtasks = subtasks;

    this.notifyProgress(task);

    const batchSize = this.options.maxSwarmAgents || MAX_SWARM_AGENTS;
    for (let i = 0; i < subtasks.length; i += batchSize) {
      if (signal.aborted) break;

      const batch = subtasks.slice(i, i + batchSize);
      batch.forEach(sub => {
        sub.status = 'running';
        sub.startedAt = new Date().toISOString();
      });
      this.notifyProgress(task);

      await Promise.all(
        batch.map(async (sub) => {
          await delay(600 + Math.random() * 1200);
          if (signal.aborted) return;

          const result = this.generateStepOutput(sub, sub.agentRole || 'coder-a', task.id);
          sub.output = result.output;
          sub.status = 'completed';
          sub.completedAt = new Date().toISOString();

          if (result.filePath && result.fileContent) {
            vfs.writeFile(result.filePath, result.fileContent);
          }
        })
      );

      this.notifyProgress(task);
    }

    const completedCount = subtasks.filter(s => s.status === 'completed').length;
    step.output = `集群执行完成：${completedCount}/${subtasks.length} 个子任务成功\n\n合并结果：\n` +
      subtasks.map((s, i) => `[子任务${i + 1}] ${s.title}\n${s.output?.slice(0, 200) || ''}...`).join('\n\n');
  }

  private getSubtaskTitle(step: TaskStep, index: number): string {
    const titles = [
      '数据结构定义',
      '核心逻辑实现',
      '工具函数封装',
      '错误处理完善',
      '测试用例编写',
      '代码优化重构',
      '文档注释补充',
    ];
    return titles[index % titles.length];
  }

  private generateStepOutput(step: TaskStep, role: string, taskId: string): { output: string; filePath?: string; fileContent?: string } {
    const roleOutputs: Record<string, string[]> = {
      'analyst': [
        '## 需求分析报告\n\n### 核心需求\n- 功能完整性：支持主要业务场景\n- 用户体验：简洁直观的交互设计\n- 技术可行性：基于现有技术栈可实现\n\n### 技术方案\n- 前端：React + TypeScript + TailwindCSS\n- 状态管理：Zustand\n- 构建工具：Vite\n\n### 风险评估\n- 低风险：UI 组件开发\n- 中风险：复杂交互逻辑\n- 建议：分阶段迭代交付',
      ],
      'pm': [
        '## 产品设计方案\n\n### 目标用户\n- 主要用户群体：开发者和产品经理\n- 使用场景：快速原型开发\n\n### 核心功能\n1. 任务管理\n2. 实时协作\n3. 数据可视化\n\n### 用户流程\n输入需求 → 自动规划 → 执行生成 → 预览调整 → 导出交付',
      ],
      'designer': [
        '## UI设计方案\n\n### 设计风格\n- 暗色主题，科技感\n- 渐变色彩，层次分明\n- 圆角卡片，柔和阴影\n\n### 配色方案\n- 主色：蓝紫渐变\n- 辅助色：青色、粉色\n- 中性色：深灰到浅灰\n\n### 布局结构\n- 左侧导航 + 右侧内容区\n- 卡片式信息展示\n- 流式响应式布局',
      ],
      'coder-a': [
        '## 核心架构代码\n\n项目结构已搭建完成，包含：\n- 组件目录结构\n- 状态管理配置\n- 路由配置\n- 工具函数封装\n\n核心模块：\n1. 布局组件（Sidebar、Header、Main）\n2. 业务组件（Card、Button、Modal）\n3. 数据层（API封装、类型定义）\n\n代码采用 TypeScript 严格模式，确保类型安全。',
      ],
      'coder-b': [
        '## 功能实现代码\n\n已实现功能：\n- 完整的增删改查逻辑\n- 表单验证与错误提示\n- 加载状态与空状态处理\n- 响应式布局适配\n\n交互细节：\n- 悬停效果与点击反馈\n- 过渡动画与缓动曲线\n- 键盘快捷键支持\n- 无障碍访问优化',
      ],
      'qa': [
        '## 质量检测报告\n\n### 代码质量\n- 代码规范：✓ 通过\n- 类型安全：✓ 完整覆盖\n- 错误处理：✓ 完善\n- 性能优化：✓ 良好\n\n### 功能测试\n- 主流程：✓ 通过\n- 边界情况：✓ 覆盖\n- 异常处理：✓ 正常\n\n### 优化建议\n- 可进一步优化首屏加载速度\n- 建议添加更多单元测试',
      ],
      'devops': [
        '## 交付部署方案\n\n### 构建配置\n- 构建工具：Vite\n- 产物优化：代码分割、压缩\n- 资源优化：图片压缩、懒加载\n\n### 部署方式\n- 静态托管：GitHub Pages / Vercel\n- CI/CD：GitHub Actions 自动部署\n- 域名配置：支持自定义域名\n\n### 监控运维\n- 错误监控：Sentry\n- 性能监控：Web Vitals\n- 用户行为：埋点分析',
      ],
      'data-engineer': [
        '## 数据处理方案\n\n数据源已接入，完成以下处理：\n- 数据清洗：去重、补全、格式统一\n- 数据转换：类型转换、单位统一\n- 数据聚合：按维度分组统计\n- 数据质量：完整性、一致性校验\n\n处理后数据质量：✓ 良好，可用于分析',
      ],
      'data-scientist': [
        '## 数据分析报告\n\n### 核心发现\n1. 整体趋势：持续增长态势\n2. 关键指标：主要指标均达标\n3. 异常点：已识别并标注\n\n### 可视化图表\n- 趋势折线图\n- 占比饼图\n- 对比柱状图\n- 分布直方图\n\n### 建议\n- 重点关注增长较快的领域\n- 优化瓶颈环节提升效率',
      ],
      'technical-writer': [
        '## 技术文档\n\n### 项目简介\n这是一个完整的全栈项目，包含前端界面和后端服务...\n\n### 快速开始\n1. 安装依赖：npm install\n2. 启动开发：npm run dev\n3. 构建生产：npm run build\n\n### API 文档\n详细描述了每个接口的参数和返回值...\n\n### 常见问题\n收集了开发过程中常见的问题和解决方案...',
      ],
    };

    const outputs = roleOutputs[role] || roleOutputs['coder-a'];
    const output = outputs[Math.floor(Math.random() * outputs.length)];

    let filePath: string | undefined;
    let fileContent: string | undefined;

    if (role === 'coder-a' || role === 'coder-b') {
      const fileName = step.title.includes('架构') ? 'src/App.tsx' :
                       step.title.includes('功能') ? 'src/components/Main.tsx' :
                       `src/components/${generateId()}.tsx`;
      filePath = `/${taskId}/${fileName}`;
      fileContent = this.generateSampleCode(step.title);
    }

    if (role === 'technical-writer') {
      filePath = `/${taskId}/README.md`;
      fileContent = output;
    }

    return { output, filePath, fileContent };
  }

  private generateSampleCode(title: string): string {
    return `import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  title: string;
  children?: React.ReactNode;
}

export const Component: React.FC<Props> = ({ title, children }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800"
    >
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
      <div className="space-y-4">
        {children}
      </div>
      <button
        onClick={() => setIsActive(!isActive)}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {isActive ? '已激活' : '点击激活'}
      </button>
    </motion.div>
  );
};

export default Component;
`;
  }

  private async generateDeliverables(task: AgentTask): Promise<void> {
    const files = vfs.listFiles(`/${task.id}`);

    if (files.length > 0) {
      task.deliverables.push({
        id: generateId(),
        name: `${task.title}-源码文件`,
        type: 'archive',
        path: `/${task.id}`,
        size: files.reduce((sum, f) => sum + f.size, 0),
        createdAt: new Date().toISOString(),
        description: `包含 ${files.length} 个文件的完整源码`,
      });
    }

    const reportPath = `/${task.id}/任务报告.md`;
    const reportContent = this.generateTaskReport(task);
    vfs.writeFile(reportPath, reportContent);

    task.deliverables.push({
      id: generateId(),
      name: '任务执行报告',
      type: 'report',
      path: reportPath,
      size: reportContent.length,
      createdAt: new Date().toISOString(),
      description: '完整的任务执行过程和结果报告',
    });
  }

  private generateTaskReport(task: AgentTask): string {
    const completedSteps = task.steps.filter(s => s.status === 'completed').length;
    const duration = task.startedAt && task.completedAt
      ? ((new Date(task.completedAt).getTime() - new Date(task.startedAt).getTime()) / 1000).toFixed(1)
      : '未知';

    return `# ${task.title} 执行报告

## 任务信息
- **任务描述**: ${task.description}
- **创建时间**: ${new Date(task.createdAt).toLocaleString()}
- **完成时间**: ${task.completedAt ? new Date(task.completedAt).toLocaleString() : '未完成'}
- **耗时**: ${duration} 秒
- **状态**: ${task.status === 'completed' ? '✓ 成功完成' : task.status}

## 执行步骤
${task.steps.map((step, i) => {
  const statusIcon = step.status === 'completed' ? '✓' : step.status === 'failed' ? '✗' : step.status === 'running' ? '▶' : '○';
  return `\n### ${i + 1}. ${statusIcon} ${step.title}\n- 负责人: ${step.agentRole || '未指定'}\n- 状态: ${step.status}`;
}).join('')}

## 交付物
${task.deliverables.length > 0 
  ? task.deliverables.map(d => `- [${d.type}] ${d.name} (${d.size ? (d.size / 1024).toFixed(1) + ' KB' : '未知大小'})`).join('\n')
  : '无'}

## 统计
- 总步骤数: ${task.steps.length}
- 完成步骤: ${completedSteps}
- 迭代次数: ${task.iterationCount}
- 交付物数量: ${task.deliverables.length}

---
*由 HopeAgent Pro 多 Agent 协作系统生成*
`;
  }

  cancelTask(taskId: string): boolean {
    const controller = this.abortControllers.get(taskId);
    if (controller) {
      controller.abort();
      return true;
    }
    return false;
  }

  getTask(taskId: string): AgentTask | undefined {
    return this.tasks.get(taskId);
  }

  getAllTasks(): AgentTask[] {
    return Array.from(this.tasks.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  private addLog(taskId: string, log: Omit<TaskLog, 'timestamp'>): void {
    const task = this.tasks.get(taskId);
    if (!task) return;

    const fullLog: TaskLog = {
      ...log,
      timestamp: new Date().toISOString(),
    };

    task.logs.push(fullLog);
    this.options.onLog?.(fullLog);
  }

  private notifyProgress(task: AgentTask): void {
    this.options.onProgress?.(task);
  }

  downloadDeliverable(taskId: string, deliverableId: string): void {
    const task = this.tasks.get(taskId);
    if (!task) return;

    const deliverable = task.deliverables.find(d => d.id === deliverableId);
    if (!deliverable || !deliverable.path) return;

    if (deliverable.type === 'archive') {
      this.downloadFolder(deliverable.path, deliverable.name);
    } else {
      const content = vfs.readFile(deliverable.path);
      if (content) {
        this.downloadFile(deliverable.name, content);
      }
    }
  }

  private downloadFolder(path: string, name: string): void {
    const allFiles: { path: string; content: string }[] = [];
    this.collectFiles(path, allFiles);

    const manifest = allFiles.map(f => `${f.path} (${f.content.length} bytes)`).join('\n');
    const combined = `# ${name}\n\n文件列表:\n${manifest}\n\n---\n\n` +
      allFiles.map(f => `\n===== ${f.path} =====\n${f.content}`).join('\n');

    this.downloadFile(`${name}.md`, combined);
  }

  private collectFiles(path: string, result: { path: string; content: string }[]): void {
    const files = vfs.listFiles(path);
    files.forEach(f => {
      const fullPath = path === '/' ? `/${f.name}` : `${path}/${f.name}`;
      if (f.type === 'file') {
        const content = vfs.readFile(fullPath);
        if (content) {
          result.push({ path: fullPath, content });
        }
      } else {
        this.collectFiles(fullPath, result);
      }
    });
  }

  private downloadFile(name: string, content: string): void {
    if (typeof window === 'undefined') return;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const taskEngine = new TaskEngine();
