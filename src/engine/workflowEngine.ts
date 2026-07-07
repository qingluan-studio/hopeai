import {
  AgentTemplate,
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
} from './agentTemplates';
import { callKimi } from '@/services/llmService';

function isLLMEnabled(): boolean {
  try {
    return localStorage.getItem('hopeai-use-llm') === 'true'
  } catch {
    return false
  }
}

function buildContext(prevOutputs: string[], maxChars: number = 3000): string {
  if (prevOutputs.length === 0) return ''
  const all = prevOutputs.join('\n\n---\n\n')
  if (all.length <= maxChars) return all
  return all.slice(0, maxChars) + '\n...（内容已截断）'
}

export type WorkflowPhase = 
  | 'analysis' 
  | 'confirmation' 
  | 'coding' 
  | 'review' 
  | 'extension' 
  | 'packaging' 
  | 'deployment'
  | 'knowledge';

export interface PhaseConfig {
  id: WorkflowPhase;
  name: string;
  description: string;
  icon: string;
  agents: AgentTemplate[];
  minDuration: number;
  maxDuration: number;
}

export interface WorkflowProgress {
  phase: WorkflowPhase;
  phaseIndex: number;
  totalPhases: number;
  message: string;
  agent?: AgentTemplate;
  content?: string;
  isComplete: boolean;
  timestamp: string;
}

export interface WorkflowResult {
  command: string;
  phases: WorkflowPhaseResult[];
  totalDuration: number;
  isSuccess: boolean;
  startedAt: string;
  finishedAt: string;
}

export interface WorkflowPhaseResult {
  phase: WorkflowPhase;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  outputs: string[];
  agents: string[];
  startedAt?: string;
  finishedAt?: string;
  duration?: number;
}

export interface WorkflowOptions {
  onProgress?: (progress: WorkflowProgress) => void;
  autoConfirm?: boolean;
  speedFactor?: number;
  enabledPhases?: WorkflowPhase[];
  executionMode?: ExecutionMode;
  maxParallelAgents?: number;
  chatStyle?: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export type ExecutionMode = 'sequential' | 'parallel' | 'mixed';

export interface AgentExecutionResult {
  agent: AgentTemplate;
  content: string;
  duration: number;
  success: boolean;
  error?: string;
}

const defaultPhases: PhaseConfig[] = [
  {
    id: 'analysis',
    name: '分析阶段',
    description: '分析需求，拆解功能，制定方案',
    icon: '🔍',
    agents: [analystTemplate],
    minDuration: 1500,
    maxDuration: 3000
  },
  {
    id: 'confirmation',
    name: '确认阶段',
    description: '确认方案，等待用户反馈',
    icon: '✅',
    agents: [],
    minDuration: 500,
    maxDuration: 1000
  },
  {
    id: 'coding',
    name: '编码阶段',
    description: '多角色协作开发，生成代码',
    icon: '💻',
    agents: [coderATemplate, coderBTemplate, coderCTemplate, coderDTemplate, coderETemplate],
    minDuration: 3000,
    maxDuration: 6000
  },
  {
    id: 'review',
    name: '审查阶段',
    description: '代码审查，Bug检测，质量评估',
    icon: '🔎',
    agents: [reviewerTemplate, bugDetectorTemplate],
    minDuration: 2000,
    maxDuration: 4000
  },
  {
    id: 'extension',
    name: '扩展阶段',
    description: '未来展望，技术建议，扩展性分析',
    icon: '🚀',
    agents: [extenderTemplate],
    minDuration: 1500,
    maxDuration: 2500
  },
  {
    id: 'packaging',
    name: '打包阶段',
    description: '整理文件清单，准备交付物',
    icon: '📦',
    agents: [packagerTemplate],
    minDuration: 1000,
    maxDuration: 2000
  },
  {
    id: 'deployment',
    name: '部署阶段',
    description: '部署上线，输出Git日志',
    icon: '🎉',
    agents: [deployerTemplate],
    minDuration: 1500,
    maxDuration: 3000
  },
  {
    id: 'knowledge',
    name: '知识沉淀',
    description: '总结经验，存入知识库',
    icon: '📚',
    agents: [knowledgeManagerTemplate],
    minDuration: 1000,
    maxDuration: 2000
  }
];

export class WorkflowEngine {
  private phases: PhaseConfig[];
  private options: WorkflowOptions;
  private isRunning: boolean = false;
  private currentPhaseIndex: number = -1;
  private results: WorkflowPhaseResult[] = [];
  private abortController: AbortController | null = null;

  constructor(options: WorkflowOptions = {}) {
    this.options = {
      autoConfirm: true,
      speedFactor: 1,
      executionMode: 'mixed',
      maxParallelAgents: 4,
      chatStyle: 'professional',
      ...options
    };

    if (options.enabledPhases && options.enabledPhases.length > 0) {
      this.phases = defaultPhases.filter(p => options.enabledPhases!.includes(p.id));
    } else {
      this.phases = [...defaultPhases];
    }
  }

  getPhases(): PhaseConfig[] {
    return [...this.phases];
  }

  isWorkflowRunning(): boolean {
    return this.isRunning;
  }

  getCurrentPhaseIndex(): number {
    return this.currentPhaseIndex;
  }

  getResults(): WorkflowPhaseResult[] {
    return [...this.results];
  }

  async executeWorkflow(command: string): Promise<WorkflowResult> {
    if (this.isRunning) {
      throw new Error('工作流正在运行中，请等待完成或中止当前任务');
    }

    this.isRunning = true;
    this.currentPhaseIndex = -1;
    this.results = [];
    this.abortController = new AbortController();

    const startedAt = new Date().toISOString();
    let totalDuration = 0;

    try {
      for (let i = 0; i < this.phases.length; i++) {
        if (this.abortController.signal.aborted) {
          throw new Error('工作流已被中止');
        }

        this.currentPhaseIndex = i;
        const phase = this.phases[i];
        const phaseStart = Date.now();

        const phaseResult: WorkflowPhaseResult = {
          phase: phase.id,
          name: phase.name,
          status: 'running',
          outputs: [],
          agents: phase.agents.map(a => a.id),
          startedAt: new Date().toISOString()
        };

        this.results.push(phaseResult);

        this.reportProgress({
          phase: phase.id,
          phaseIndex: i,
          totalPhases: this.phases.length,
          message: `开始${phase.name}...`,
          isComplete: false,
          timestamp: new Date().toISOString()
        });

        if (phase.agents.length > 0) {
          const prevOutputs: string[] = [];
          for (let p = 0; p < i; p++) {
            if (this.results[p]?.outputs) {
              prevOutputs.push(...this.results[p].outputs);
            }
          }

          const mode = this.options.executionMode;
          const shouldParallel = 
            mode === 'parallel' || 
            (mode === 'mixed' && phase.agents.length > 1);

          if (shouldParallel) {
            await this.executeAgentsParallel(phase, command, prevOutputs, phaseResult);
          } else {
            await this.executeAgentsSequential(phase, command, prevOutputs, phaseResult);
          }
        } else {
          if (phase.id === 'confirmation') {
            if (this.options.autoConfirm) {
              this.reportProgress({
                phase: phase.id,
                phaseIndex: i,
                totalPhases: this.phases.length,
                message: '方案已自动确认',
                isComplete: false,
                timestamp: new Date().toISOString()
              });
              await delay((phase.minDuration + Math.random() * (phase.maxDuration - phase.minDuration)) / (this.options.speedFactor || 1));
            } else {
              phaseResult.outputs.push('等待用户确认中...');
            }
          } else {
            const phaseDelay = phase.minDuration + Math.random() * (phase.maxDuration - phase.minDuration);
            await delay(phaseDelay / (this.options.speedFactor || 1));
          }
        }

        const phaseDuration = Date.now() - phaseStart;
        totalDuration += phaseDuration;

        phaseResult.status = 'completed';
        phaseResult.finishedAt = new Date().toISOString();
        phaseResult.duration = phaseDuration;

        this.reportProgress({
          phase: phase.id,
          phaseIndex: i,
          totalPhases: this.phases.length,
          message: `${phase.name}完成`,
          isComplete: i === this.phases.length - 1,
          timestamp: new Date().toISOString()
        });
      }

      const finishedAt = new Date().toISOString();
      this.isRunning = false;

      return {
        command,
        phases: this.results,
        totalDuration,
        isSuccess: true,
        startedAt,
        finishedAt
      };
    } catch (error) {
      const finishedAt = new Date().toISOString();
      this.isRunning = false;

      if (this.currentPhaseIndex >= 0 && this.currentPhaseIndex < this.results.length) {
        this.results[this.currentPhaseIndex].status = 'failed';
        this.results[this.currentPhaseIndex].finishedAt = finishedAt;
      }

      return {
        command,
        phases: this.results,
        totalDuration,
        isSuccess: false,
        startedAt,
        finishedAt
      };
    }
  }

  async executeSinglePhase(
    command: string,
    phaseId: WorkflowPhase
  ): Promise<WorkflowPhaseResult | null> {
    const phase = this.phases.find(p => p.id === phaseId);
    if (!phase) return null;

    const phaseStart = Date.now();
    const phaseResult: WorkflowPhaseResult = {
      phase: phase.id,
      name: phase.name,
      status: 'running',
      outputs: [],
      agents: phase.agents.map(a => a.id),
      startedAt: new Date().toISOString()
    };

    for (const agent of phase.agents) {
      const content = await agent.generateResponse(command);
      phaseResult.outputs.push(content);
    }

    phaseResult.status = 'completed';
    phaseResult.finishedAt = new Date().toISOString();
    phaseResult.duration = Date.now() - phaseStart;

    return phaseResult;
  }

  abortWorkflow(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.isRunning = false;
  }

  setSpeedFactor(factor: number): void {
    this.options.speedFactor = Math.max(0.1, Math.min(10, factor));
  }

  setOnProgress(callback: (progress: WorkflowProgress) => void): void {
    this.options.onProgress = callback;
  }

  private reportProgress(progress: WorkflowProgress): void {
    if (this.options.onProgress) {
      this.options.onProgress(progress);
    }
  }

  private async executeAgent(
    agent: AgentTemplate,
    command: string,
    context: string,
    phase: PhaseConfig
  ): Promise<AgentExecutionResult> {
    const startTime = Date.now();
    
    this.reportProgress({
      phase: phase.id,
      phaseIndex: this.currentPhaseIndex,
      totalPhases: this.phases.length,
      message: `${agent.name} 正在思考...`,
      agent,
      isComplete: false,
      timestamp: new Date().toISOString()
    });

    const agentDelay = (phase.minDuration + Math.random() * (phase.maxDuration - phase.minDuration)) / phase.agents.length;
    const adjustedDelay = agentDelay / (this.options.speedFactor || 1);

    let content: string;
    const useLLM = isLLMEnabled();

    try {
      if (useLLM) {
        try {
          content = await callKimi(agent.id, command, context, this.options.chatStyle);
          await delay(Math.min(adjustedDelay, 800));
        } catch (err) {
          const fallbackContent = await agent.generateResponse(command);
          const errMsg = err instanceof Error ? err.message : '未知错误';
          content = `⚠️ AI模型调用失败，使用本地模板生成\n\n原因：${errMsg}\n\n---\n\n${fallbackContent}`;
        }
      } else {
        await delay(adjustedDelay);
        content = await agent.generateResponse(command);
      }

      return {
        agent,
        content,
        duration: Date.now() - startTime,
        success: true
      };
    } catch (err) {
      return {
        agent,
        content: `❌ ${agent.name} 执行失败: ${err instanceof Error ? err.message : '未知错误'}`,
        duration: Date.now() - startTime,
        success: false,
        error: err instanceof Error ? err.message : '未知错误'
      };
    }
  }

  private async executeAgentsSequential(
    phase: PhaseConfig,
    command: string,
    prevOutputs: string[],
    phaseResult: WorkflowPhaseResult
  ): Promise<void> {
    for (const agent of phase.agents) {
      if (this.abortController.signal.aborted) break;

      const context = buildContext(prevOutputs);
      const result = await this.executeAgent(agent, command, context, phase);

      phaseResult.outputs.push(result.content);
      prevOutputs.push(result.content);

      this.reportProgress({
        phase: phase.id,
        phaseIndex: this.currentPhaseIndex,
        totalPhases: this.phases.length,
        message: `${agent.name} 完成工作`,
        agent,
        content: result.content,
        isComplete: false,
        timestamp: new Date().toISOString()
      });
    }
  }

  private async executeAgentsParallel(
    phase: PhaseConfig,
    command: string,
    prevOutputs: string[],
    phaseResult: WorkflowPhaseResult
  ): Promise<void> {
    const context = buildContext(prevOutputs);
    const maxParallel = this.options.maxParallelAgents || 4;
    const batches: AgentTemplate[][] = [];
    
    for (let i = 0; i < phase.agents.length; i += maxParallel) {
      batches.push(phase.agents.slice(i, i + maxParallel));
    }

    for (const batch of batches) {
      if (this.abortController.signal.aborted) break;

      const tasks = batch.map(agent => 
        this.executeAgent(agent, command, context, phase)
      );

      const results = await Promise.all(tasks);

      results.forEach(result => {
        phaseResult.outputs.push(result.content);
        prevOutputs.push(result.content);

        this.reportProgress({
          phase: phase.id,
          phaseIndex: this.currentPhaseIndex,
          totalPhases: this.phases.length,
          message: `${result.agent.name} 完成工作`,
          agent: result.agent,
          content: result.content,
          isComplete: false,
          timestamp: new Date().toISOString()
        });
      });
    }
  }

  static create(options?: WorkflowOptions): WorkflowEngine {
    return new WorkflowEngine(options);
  }
}

export async function executeWorkflow(
  command: string,
  options?: WorkflowOptions
): Promise<WorkflowResult> {
  const engine = new WorkflowEngine(options);
  return engine.executeWorkflow(command);
}

export function getPhaseInfo(phaseId: WorkflowPhase): PhaseConfig | undefined {
  return defaultPhases.find(p => p.id === phaseId);
}

export function getAllPhases(): PhaseConfig[] {
  return [...defaultPhases];
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}分${seconds}秒`;
}

export function calculateOverallProgress(results: WorkflowPhaseResult[]): number {
  if (results.length === 0) return 0;
  const completed = results.filter(r => r.status === 'completed').length;
  return Math.round((completed / defaultPhases.length) * 100);
}

export default WorkflowEngine;
