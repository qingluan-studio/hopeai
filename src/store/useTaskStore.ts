import { create } from 'zustand'

export interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignee: string
  department: string
  createdAt: number
  dueDate?: number
  tags: string[]
  subtasks: { id: string; title: string; done: boolean }[]
  comments: { id: string; author: string; content: string; time: number }[]
}

interface TaskState {
  tasks: Task[]
  selectedTask: string | null
  filterStatus: string
  filterPriority: string
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  selectTask: (id: string | null) => void
  setFilterStatus: (status: string) => void
  setFilterPriority: (priority: string) => void
  toggleSubtask: (taskId: string, subtaskId: string) => void
  addComment: (taskId: string, author: string, content: string) => void
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: '完善多Agent协作系统',
    description: '继续优化多Agent协作流程，增加更多角色和部门，完善工作流引擎。',
    status: 'in-progress',
    priority: 'high',
    assignee: 'tech-lead',
    department: '技术部',
    createdAt: Date.now() - 86400000 * 2,
    dueDate: Date.now() + 86400000 * 5,
    tags: ['核心功能', 'Agent'],
    subtasks: [
      { id: 's1', title: '扩充角色到30人', done: true },
      { id: 's2', title: '按部门分组展示', done: true },
      { id: 's3', title: '完善工作流引擎', done: false },
      { id: 's4', title: '增加任务管理系统', done: true },
    ],
    comments: [
      { id: 'c1', author: 'chairman', content: '这个是核心，一定要做好。', time: Date.now() - 86400000 },
    ],
  },
  {
    id: '2',
    title: '知识库系统建设',
    description: '建立完善的知识库系统，支持分类、搜索、标签、自我学习沉淀。',
    status: 'in-progress',
    priority: 'high',
    assignee: 'researcher',
    department: '研发部',
    createdAt: Date.now() - 86400000 * 3,
    dueDate: Date.now() + 86400000 * 7,
    tags: ['知识库', '学习'],
    subtasks: [
      { id: 's1', title: '知识库基础功能', done: true },
      { id: 's2', title: '分类和标签系统', done: true },
      { id: 's3', title: '搜索功能', done: true },
      { id: 's4', title: '自我学习机制', done: false },
    ],
    comments: [],
  },
  {
    id: '3',
    title: '手机端UI优化',
    description: '优化手机端界面体验，确保滚动流畅、操作便捷、无bug。',
    status: 'review',
    priority: 'medium',
    assignee: 'ux-designer',
    department: '设计部',
    createdAt: Date.now() - 86400000,
    dueDate: Date.now() + 86400000 * 3,
    tags: ['UI', '手机端'],
    subtasks: [
      { id: 's1', title: '底部Tab导航', done: true },
      { id: 's2', title: '单栏布局', done: true },
      { id: 's3', title: '滚动优化', done: true },
      { id: 's4', title: '极客主题细节', done: false },
    ],
    comments: [],
  },
  {
    id: '4',
    title: 'GitHub Pages部署自动化',
    description: '实现一键部署到GitHub Pages，支持历史记录和日志查看。',
    status: 'done',
    priority: 'medium',
    assignee: 'devops',
    department: '运维部',
    createdAt: Date.now() - 86400000 * 5,
    dueDate: Date.now() - 86400000,
    tags: ['部署', '自动化'],
    subtasks: [
      { id: 's1', title: '部署配置界面', done: true },
      { id: 's2', title: '一键部署功能', done: true },
      { id: 's3', title: '部署日志', done: true },
      { id: 's4', title: '历史记录', done: true },
    ],
    comments: [],
  },
  {
    id: '5',
    title: '项目发展路线图',
    description: '制定公司长期发展规划，分阶段实现目标。',
    status: 'todo',
    priority: 'low',
    assignee: 'expander',
    department: '战略部',
    createdAt: Date.now(),
    dueDate: Date.now() + 86400000 * 30,
    tags: ['规划', '战略'],
    subtasks: [
      { id: 's1', title: '第一阶段：基础搭建', done: false },
      { id: 's2', title: '第二阶段：功能增强', done: false },
      { id: 's3', title: '第三阶段：智能化', done: false },
      { id: 's4', title: '第四阶段：生态扩展', done: false },
      { id: 's5', title: '第五阶段：商业化', done: false },
    ],
    comments: [],
  },
]

export const useTaskStore = create<TaskState>((set) => ({
  tasks: initialTasks,
  selectedTask: null,
  filterStatus: 'all',
  filterPriority: 'all',

  addTask: (task) =>
    set((state) => ({
      tasks: [
        {
          ...task,
          id: Date.now().toString(),
          createdAt: Date.now(),
        },
        ...state.tasks,
      ],
    })),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),

  selectTask: (id) => set({ selectedTask: id }),

  setFilterStatus: (status) => set({ filterStatus: status }),

  setFilterPriority: (priority) => set({ filterPriority: priority }),

  toggleSubtask: (taskId, subtaskId) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.map((st) =>
                st.id === subtaskId ? { ...st, done: !st.done } : st
              ),
            }
          : t
      ),
    })),

  addComment: (taskId, author, content) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              comments: [
                ...t.comments,
                { id: Date.now().toString(), author, content, time: Date.now() },
              ],
            }
          : t
      ),
    })),
}))
