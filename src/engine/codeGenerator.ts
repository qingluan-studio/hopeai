export type CodeType = 'html' | 'css' | 'js' | 'react' | 'utils' | 'api' | 'types';

export interface GenerateOptions {
  type?: CodeType;
  keywords?: string[];
  complexity?: 'simple' | 'medium' | 'complex';
}

export interface CodeSnippet {
  language: string;
  filename: string;
  content: string;
  description: string;
}

const generateHTML = (keywords: string[]): CodeSnippet => {
  const title = keywords.join(' ') || '页面标题';
  return {
    language: 'html',
    filename: 'index.html',
    description: 'HTML页面结构',
    content: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${title}">
  <title>${title}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="header">
    <nav class="nav">
      <div class="logo">${title}</div>
      <ul class="nav-links">
        <li><a href="#home">首页</a></li>
        <li><a href="#about">关于</a></li>
        <li><a href="#features">功能</a></li>
        <li><a href="#contact">联系</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section id="home" class="hero">
      <div class="hero-content">
        <h1>欢迎来到${title}</h1>
        <p>现代化的网页设计，提供卓越的用户体验</p>
        <button class="btn btn-primary">立即开始</button>
      </div>
    </section>

    <section id="features" class="features">
      <h2>核心功能</h2>
      <div class="feature-grid">
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3>快速高效</h3>
          <p>优化的性能，快速加载，流畅体验</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3>精美设计</h3>
          <p>现代化UI设计，美观实用并重</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🔒</div>
          <h3>安全可靠</h3>
          <p>严格的安全措施，保障数据安全</p>
        </div>
      </div>
    </section>

    <section id="about" class="about">
      <h2>关于我们</h2>
      <p>我们致力于提供优质的产品和服务，不断创新，追求卓越。</p>
    </section>
  </main>

  <footer class="footer">
    <p>&copy; ${new Date().getFullYear()} ${title}. 保留所有权利。</p>
  </footer>

  <script src="main.js"></script>
</body>
</html>`
  };
};

const generateCSS = (keywords: string[]): CodeSnippet => {
  const primaryColor = keywords.some(k => k.includes('蓝')) ? '#3b82f6' : 
                       keywords.some(k => k.includes('绿')) ? '#10b981' : '#6366f1';
  return {
    language: 'css',
    filename: 'styles.css',
    description: '样式文件',
    content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #1f2937;
  background-color: #f9fafb;
}

.header {
  background: white;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.25rem;
  font-weight: 700;
  color: ${primaryColor};
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-links a {
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: ${primaryColor};
}

.hero {
  background: linear-gradient(135deg, ${primaryColor} 0%, #8b5cf6 100%);
  color: white;
  padding: 5rem 1.5rem;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 800;
}

.hero p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: white;
  color: ${primaryColor};
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

.features {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
}

.features h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 3rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
}

.feature-card p {
  color: #6b7280;
}

.about {
  background: #f3f4f6;
  padding: 4rem 1.5rem;
  text-align: center;
}

.about h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.about p {
  max-width: 600px;
  margin: 0 auto;
  color: #4b5563;
}

.footer {
  background: #1f2937;
  color: #9ca3af;
  text-align: center;
  padding: 2rem 1.5rem;
  margin-top: auto;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .hero h1 {
    font-size: 2rem;
  }

  .hero p {
    font-size: 1rem;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }
}`
  };
};

const generateJS = (keywords: string[]): CodeSnippet => {
  return {
    language: 'javascript',
    filename: 'main.js',
    description: 'JavaScript逻辑',
    content: `// 主应用逻辑
class App {
  constructor() {
    this.state = {
      theme: 'light',
      data: [],
      loading: false
    };
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadData();
    this.initializeAnimations();
    console.log('应用已初始化');
  }

  bindEvents() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    const primaryBtn = document.querySelector('.btn-primary');
    if (primaryBtn) {
      primaryBtn.addEventListener('click', () => this.handlePrimaryAction());
    }
  }

  async loadData() {
    this.setLoading(true);
    try {
      await this.delay(500);
      this.state.data = [
        { id: 1, name: '项目一', status: 'active' },
        { id: 2, name: '项目二', status: 'active' },
        { id: 3, name: '项目三', status: 'inactive' }
      ];
      console.log('数据加载完成:', this.state.data);
    } catch (error) {
      console.error('数据加载失败:', error);
    } finally {
      this.setLoading(false);
    }
  }

  setLoading(loading) {
    this.state.loading = loading;
    const event = new CustomEvent('loadingChange', { detail: { loading } });
    document.dispatchEvent(event);
  }

  handlePrimaryAction() {
    console.log('执行主要操作');
    this.showNotification('操作成功！', 'success');
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = \`notification notification-\${type}\`;
    notification.textContent = message;
    notification.style.cssText = \`
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 24px;
      background: \${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    \`;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  initializeAnimations() {
    const style = document.createElement('style');
    style.textContent = \`
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    \`;
    document.head.appendChild(style);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 工具函数
const utils = {
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

  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => utils.deepClone(item));
    const cloned = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = utils.deepClone(obj[key]);
      }
    }
    return cloned;
  },

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
};

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
  window.utils = utils;
});`
  };
};

const generateReact = (keywords: string[]): CodeSnippet => {
  const componentName = keywords.length > 0 
    ? keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1) + 'Component'
    : 'FeatureComponent';
  
  return {
    language: 'tsx',
    filename: `${componentName}.tsx`,
    description: 'React组件',
    content: `import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ${componentName}Props {
  title?: string;
  items?: Array<{ id: string; name: string; description?: string }>;
  onItemClick?: (item: { id: string; name: string }) => void;
  className?: string;
}

export const ${componentName} = ({
  title = '功能列表',
  items = [],
  onItemClick,
  className = ''
}: ${componentName}Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredItems = useMemo(() => {
    if (!filterText) return items;
    const lowerFilter = filterText.toLowerCase();
    return items.filter(item =>
      item.name.toLowerCase().includes(lowerFilter) ||
      item.description?.toLowerCase().includes(lowerFilter)
    );
  }, [items, filterText]);

  const handleItemClick = useCallback((item: { id: string; name: string }) => {
    setSelectedId(item.id);
    onItemClick?.(item);
  }, [onItemClick]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className={\`flex items-center justify-center p-8 \${className}\`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">加载中...</span>
      </div>
    );
  }

  return (
    <div className={\`bg-white rounded-xl shadow-sm border border-gray-100 p-6 \${className}\`}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
        <input
          type="text"
          placeholder="搜索..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => handleItemClick(item)}
                className={\`
                  p-4 rounded-lg cursor-pointer transition-all
                  border-2 hover:border-blue-300
                  \${selectedId === item.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-100 hover:bg-gray-50'}
                \`}
              >
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                {item.description && (
                  <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                )}
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-gray-500"
            >
              暂无数据
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
        共 {filteredItems.length} 项
      </div>
    </div>
  );
};

export default ${componentName};`
  };
};

const generateUtils = (keywords: string[]): CodeSnippet => {
  return {
    language: 'typescript',
    filename: 'utils.ts',
    description: '工具函数集合',
    content: `// 格式化工具
export const format = {
  date(date: Date | string | number, format = 'YYYY-MM-DD HH:mm:ss'): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  },

  currency(amount: number, currency = 'CNY'): string {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency
    }).format(amount);
  },

  number(num: number, decimals = 0): string {
    return new Intl.NumberFormat('zh-CN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  },

  bytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
};

// 验证工具
export const validate = {
  email(email: string): boolean {
    const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return regex.test(email);
  },

  phone(phone: string): boolean {
    const regex = /^1[3-9]\\d{9}$/;
    return regex.test(phone);
  },

  url(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  isEmpty(value: unknown): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value as object).length === 0;
    return false;
  }
};

// 防抖与节流
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay = 300
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function(this: unknown, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  interval = 300
): (...args: Parameters<T>) => void {
  let lastTime = 0;
  return function(this: unknown, ...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

// 存储工具
export const storage = {
  get<T = unknown>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },

  remove(key: string): void {
    localStorage.removeItem(key);
  },

  clear(): void {
    localStorage.clear();
  }
};

// 深拷贝
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  if (obj instanceof Map) return new Map(Array.from(obj, ([k, v]) => [k, deepClone(v)])) as unknown as T;
  if (obj instanceof Set) return new Set(Array.from(obj, v => deepClone(v))) as unknown as T;
  
  const cloned = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

// 生成唯一ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// 随机工具
export const random = {
  int(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  choice<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  string(length = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
};`
  };
};

const generateAPI = (keywords: string[]): CodeSnippet => {
  return {
    language: 'typescript',
    filename: 'api.ts',
    description: 'API接口封装',
    content: `import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message: string;
  error?: {
    code: string;
    details?: unknown;
  };
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

class ApiClient {
  private instance: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL = '/api') {
    this.instance = axios.create({
      baseURL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.instance.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = \`Bearer \${this.token}\`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          this.token = null;
          window.dispatchEvent(new CustomEvent('auth:expired'));
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string): void {
    this.token = token;
  }

  clearToken(): void {
    this.token = null;
  }

  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.get(url, config);
  }

  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.post(url, data, config);
  }

  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.put(url, data, config);
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.delete(url, config);
  }

  async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.patch(url, data, config);
  }
}

export const apiClient = new ApiClient();

// 用户相关API
export const userApi = {
  async login(data: { email: string; password: string }): Promise<ApiResponse<{ token: string; user: User }>> {
    return apiClient.post('/auth/login', data);
  },

  async register(data: { name: string; email: string; password: string }): Promise<ApiResponse<{ token: string; user: User }>> {
    return apiClient.post('/auth/register', data);
  },

  async getProfile(): Promise<ApiResponse<User>> {
    return apiClient.get('/users/profile');
  },

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put('/users/profile', data);
  },

  async getList(params?: PaginationParams & { keyword?: string }): Promise<ApiResponse<PaginatedResponse<User>>> {
    return apiClient.get('/users', { params });
  }
};

// 通用CRUD API工厂
export function createCrudApi<T>(resource: string) {
  return {
    async list(params?: PaginationParams & Record<string, unknown>): Promise<ApiResponse<PaginatedResponse<T>>> {
      return apiClient.get(\`/\${resource}\`, { params });
    },

    async get(id: string): Promise<ApiResponse<T>> {
      return apiClient.get(\`/\${resource}/\${id}\`);
    },

    async create(data: Partial<T>): Promise<ApiResponse<T>> {
      return apiClient.post(\`/\${resource}\`, data);
    },

    async update(id: string, data: Partial<T>): Promise<ApiResponse<T>> {
      return apiClient.put(\`/\${resource}/\${id}\`, data);
    },

    async delete(id: string): Promise<ApiResponse<void>> {
      return apiClient.delete(\`/\${resource}/\${id}\`);
    },

    async batchDelete(ids: string[]): Promise<ApiResponse<void>> {
      return apiClient.post(\`/\${resource}/batch-delete\`, { ids });
    }
  };
}

// 示例：创建文章API
export const articleApi = createCrudApi<Article>('articles');

// 类型定义
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  authorId: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export default apiClient;`
  };
};

const generateTypes = (keywords: string[]): CodeSnippet => {
  return {
    language: 'typescript',
    filename: 'types.ts',
    description: '类型定义',
    content: `// 通用类型定义
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResult<T = unknown> {
  success: boolean;
  data?: T;
  message: string;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  field: string;
  order: SortOrder;
}

// 用户相关类型
export interface User extends BaseEntity {
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  profile?: UserProfile;
}

export type UserRole = 'admin' | 'editor' | 'viewer';

export type UserStatus = 'active' | 'inactive' | 'banned';

export interface UserProfile {
  bio?: string;
  website?: string;
  location?: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserInput extends Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>> {
  id: string;
}

// 表单相关类型
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  options?: Array<{ label: string; value: string | number }>;
  validation?: ValidationRule[];
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: unknown;
  message: string;
  validator?: (value: unknown) => boolean;
}

export interface FormErrors {
  [key: string]: string;
}

// 表格相关类型
export interface ColumnConfig<T> {
  key: keyof T | string;
  title: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
}

// 状态管理相关类型
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

// 通知类型
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

// 主题类型
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
}

// 路由类型
export interface RouteConfig {
  path: string;
  name: string;
  component?: React.ComponentType;
  children?: RouteConfig[];
  meta?: {
    title?: string;
    requiresAuth?: boolean;
    roles?: UserRole[];
    icon?: React.ReactNode;
  };
}

// 筛选条件类型
export interface FilterConfig {
  key: string;
  label: string;
  type: 'input' | 'select' | 'date' | 'dateRange' | 'number';
  placeholder?: string;
  options?: Array<{ label: string; value: string | number }>;
}

// 操作按钮类型
export interface ActionButton<T> {
  key: string;
  label: string;
  icon?: React.ReactNode;
  type?: 'primary' | 'default' | 'danger';
  onClick: (record: T) => void;
  visible?: (record: T) => boolean;
  disabled?: (record: T) => boolean;
}

// 导出配置类型
export interface ExportConfig {
  filename: string;
  format: 'xlsx' | 'csv' | 'pdf' | 'json';
  columns?: string[];
  data?: Record<string, unknown>[];
}

// 导入配置类型
export interface ImportConfig {
  accept: string;
  maxSize?: number;
  onSuccess?: (data: unknown[]) => void;
  onError?: (error: string) => void;
}`
  };
};

const codeGenerators: Record<CodeType, (keywords: string[]) => CodeSnippet> = {
  html: generateHTML,
  css: generateCSS,
  js: generateJS,
  react: generateReact,
  utils: generateUtils,
  api: generateAPI,
  types: generateTypes
};

export function generateCode(options: GenerateOptions = {}): CodeSnippet {
  const { type = 'react', keywords = [] } = options;
  const generator = codeGenerators[type] || codeGenerators.react;
  return generator(keywords);
}

export function generateMultiple(types: CodeType[], keywords: string[] = []): CodeSnippet[] {
  return types.map(type => generateCode({ type, keywords }));
}

export function detectCodeType(command: string): CodeType {
  const lowerCommand = command.toLowerCase();
  
  if (lowerCommand.includes('html') || lowerCommand.includes('页面')) return 'html';
  if (lowerCommand.includes('css') || lowerCommand.includes('样式')) return 'css';
  if (lowerCommand.includes('javascript') || lowerCommand.includes('js ')) return 'js';
  if (lowerCommand.includes('react') || lowerCommand.includes('组件')) return 'react';
  if (lowerCommand.includes('api') || lowerCommand.includes('接口')) return 'api';
  if (lowerCommand.includes('类型') || lowerCommand.includes('types')) return 'types';
  if (lowerCommand.includes('工具') || lowerCommand.includes('utils')) return 'utils';
  
  return 'react';
}

export function getSupportedTypes(): CodeType[] {
  return Object.keys(codeGenerators) as CodeType[];
}
