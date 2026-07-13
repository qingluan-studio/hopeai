import { createServer, IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const PORT = process.env.MIDEND_PORT || 3001;

const db = {
  profiles: {},
  alarms: {},
  tasks: {},
  queue: { retry: [], dead: [], pending: [] },
  tokens: {},
  plans: {},
  userStats: {},
  waterState: { phase: 'flowing', level: 100, lastTick: Date.now() },
  geometry: { triangle: [], segment: [], parallel: [] },
};

function loadDB() {
  const dbPath = path.join(__dirname, 'db.midend.json');
  try {
    const data = fs.readFileSync(dbPath, 'utf-8');
    Object.assign(db, JSON.parse(data));
  } catch {
    db.profiles = {
      'user-001': { id: 'user-001', name: '用户A', tags: ['前端', 'React', 'TypeScript'], hotScore: 95, coldScore: 70, lastActive: Date.now() },
      'user-002': { id: 'user-002', name: '用户B', tags: ['后端', 'Node.js', 'Python'], hotScore: 80, coldScore: 85, lastActive: Date.now() },
    };
    db.alarms = {
      'alarm-001': { id: 'alarm-001', userId: 'user-001', cron: '0 9 * * *', action: 'daily_report', enabled: true },
      'alarm-002': { id: 'alarm-002', userId: 'user-002', cron: '0 18 * * *', action: 'work_summary', enabled: true },
    };
    db.plans = {
      'free': { id: 'free', name: '基础版', dailyLimit: 100, features: ['基础对话', '知识库查询', '常用工具'] },
      'pro': { id: 'pro', name: '进阶版', dailyLimit: 1000, features: ['高级工具', '工作流引擎', '优先队列'] },
      'enterprise': { id: 'enterprise', name: '企业版', dailyLimit: 10000, features: ['全部功能', '私有化部署', '专属支持'] },
    };
  }
}

function saveDB() {
  const dbPath = path.join(__dirname, 'db.midend.json');
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

loadDB();
setInterval(saveDB, 30000);

function genId() {
  return Math.random().toString(36).substring(2, 15);
}

function sendJSON(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function authenticate(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  return db.tokens[token] || null;
}

// ==================== 核心组件：双引擎路由 ====================

const engines = {
  multiAgent: {
    id: 'multiAgent',
    name: '多Agent引擎',
    description: '自动分类器，根据任务类型调度最佳Agent',
    route: (task) => {
      const keywords = task.content.toLowerCase();
      if (keywords.includes('代码') || keywords.includes('编程') || keywords.includes('开发')) {
        return { agent: 'code-engineer', confidence: 0.95 };
      }
      if (keywords.includes('分析') || keywords.includes('数据') || keywords.includes('统计')) {
        return { agent: 'data-scientist', confidence: 0.90 };
      }
      if (keywords.includes('设计') || keywords.includes('UI') || keywords.includes('样式')) {
        return { agent: 'creative-designer', confidence: 0.88 };
      }
      if (keywords.includes('翻译') || keywords.includes('语言')) {
        return { agent: 'translator', confidence: 0.92 };
      }
      if (keywords.includes('写作') || keywords.includes('文档') || keywords.includes('报告')) {
        return { agent: 'tech-writer', confidence: 0.85 };
      }
      return { agent: 'super-brain', confidence: 0.98 };
    },
  },
  efficientDialog: {
    id: 'efficientDialog',
    name: '高效对话引擎',
    description: '上下文感知，智能压缩历史，保持对话连贯性',
    compress: (history, maxTokens = 4000) => {
      if (!history || history.length === 0) return [];
      let total = 0;
      const compressed = [];
      for (let i = history.length - 1; i >= 0; i--) {
        const tokens = Math.ceil(history[i].content.length / 4);
        if (total + tokens <= maxTokens) {
          compressed.unshift(history[i]);
          total += tokens;
        } else {
          if (i === 0) {
            compressed.unshift({
              ...history[i],
              content: history[i].content.substring(0, (maxTokens - total) * 4) + '...[省略部分内容]',
            });
          }
        }
      }
      return compressed;
    },
    summarize: (history) => {
      if (!history || history.length === 0) return '';
      const recent = history.slice(-5);
      return recent.map(m => `${m.role}: ${m.content.substring(0, 50)}`).join('\n');
    },
  },
};

function dualEngineRoute(task, history) {
  const routing = engines.multiAgent.route(task);
  const compressedHistory = engines.efficientDialog.compress(history);
  const summary = engines.efficientDialog.summarize(history);
  return {
    ...routing,
    compressedHistory,
    summary,
    engine: routing.confidence > 0.9 ? 'specialized' : 'general',
  };
}

// ==================== 核心组件：模拟人手（免Token搜索） ====================

const simulatedHand = {
  search: (query, options = {}) => {
    const results = [];
    const knowledgeBase = [
      { title: 'React Hooks 入门', content: 'useState, useEffect, useContext 等核心Hook的使用方法', category: '前端' },
      { title: 'Node.js 性能优化', content: '事件循环机制、内存管理、集群模式', category: '后端' },
      { title: 'TypeScript 类型体操', content: '泛型、条件类型、映射类型的高级用法', category: '前端' },
      { title: '机器学习入门', content: '监督学习、无监督学习、强化学习的基本概念', category: 'AI' },
      { title: 'Docker 容器化', content: 'Dockerfile编写、镜像构建、容器编排', category: 'DevOps' },
    ];
    const keywords = query.toLowerCase().split(' ');
    knowledgeBase.forEach(item => {
      let score = 0;
      keywords.forEach(kw => {
        if (item.title.includes(kw)) score += 3;
        if (item.content.includes(kw)) score += 2;
        if (item.category.includes(kw)) score += 1;
      });
      if (score > 0) {
        results.push({ ...item, score, relevance: (score / (keywords.length * 6) * 100).toFixed(0) + '%' });
      }
    });
    return results.sort((a, b) => b.score - a.score).slice(0, options.limit || 5);
  },
  browse: (url, options = {}) => {
    return {
      url,
      title: `模拟浏览: ${url}`,
      content: `这是对 ${url} 的模拟浏览结果。在实际实现中，这里会调用Playwright或类似工具进行真实网页浏览。`,
      status: 'success',
      timestamp: Date.now(),
    };
  },
  execute: (action, params) => {
    const actions = {
      click: () => ({ result: '点击成功', element: params.element }),
      type: () => ({ result: '输入成功', text: params.text }),
      scroll: () => ({ result: '滚动成功', position: params.position }),
      extract: () => ({ result: '提取成功', data: params.selector }),
    };
    return actions[action] ? actions[action]() : { result: '未知操作', error: 'Action not found' };
  },
};

// ==================== 核心组件：用户画像（冷热分层存储） ====================

const profileEngine = {
  get: (userId) => {
    return db.profiles[userId] || null;
  },
  create: (userId, data) => {
    const profile = {
      id: userId,
      name: data.name || '用户',
      tags: data.tags || [],
      hotScore: 50,
      coldScore: 50,
      lastActive: Date.now(),
      usageHistory: [],
      preferences: {},
    };
    db.profiles[userId] = profile;
    return profile;
  },
  update: (userId, updates) => {
    const profile = db.profiles[userId];
    if (!profile) return null;
    Object.assign(profile, updates);
    profile.lastActive = Date.now();
    return profile;
  },
  trackUsage: (userId, taskType, duration, success) => {
    const profile = db.profiles[userId];
    if (!profile) return;
    if (!profile.usageHistory) profile.usageHistory = [];
    profile.usageHistory.push({
      timestamp: Date.now(),
      taskType,
      duration,
      success,
    });
    if (profile.usageHistory.length > 100) {
      profile.usageHistory = profile.usageHistory.slice(-100);
    }
    profile.hotScore = Math.min(100, profile.hotScore + (success ? 2 : -1));
    profile.coldScore = profile.hotScore < 30 ? Math.min(100, profile.coldScore + 1) : Math.max(0, profile.coldScore - 1);
  },
  classify: (userId) => {
    const profile = db.profiles[userId];
    if (!profile) return 'unknown';
    if (profile.hotScore >= 80) return 'hot';
    if (profile.hotScore >= 40) return 'warm';
    return 'cold';
  },
  recommend: (userId) => {
    const profile = db.profiles[userId];
    if (!profile) return [];
    const recommendations = [];
    if (profile.tags.includes('前端')) {
      recommendations.push('前端开发Agent', 'UI设计工具', 'TypeScript教程');
    }
    if (profile.tags.includes('后端')) {
      recommendations.push('后端开发Agent', '数据库设计', 'API设计工具');
    }
    if (profile.tags.includes('AI')) {
      recommendations.push('机器学习工具', 'AI绘画工具', '数据分析Agent');
    }
    return recommendations;
  },
};

// ==================== 核心组件：独立闹钟（定时唤醒） ====================

const alarmClock = {
  alarms: new Map(),
  start: () => {
    setInterval(() => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const dayOfWeek = now.getDay();
      
      Object.values(db.alarms).forEach(alarm => {
        if (!alarm.enabled) return;
        const [min, hr, dom, mon, dow] = alarm.cron.split(' ').map(v => v === '*' ? null : parseInt(v));
        
        if ((min === null || min === minute) &&
            (hr === null || hr === hour) &&
            (dow === null || dow === dayOfWeek)) {
          alarmClock.trigger(alarm);
        }
      });
    }, 60000);
  },
  trigger: (alarm) => {
    const actions = {
      daily_report: () => ({ type: 'daily_report', message: '生成每日报告', userId: alarm.userId }),
      work_summary: () => ({ type: 'work_summary', message: '生成工作摘要', userId: alarm.userId }),
      reminder: () => ({ type: 'reminder', message: '定时提醒', userId: alarm.userId }),
    };
    const action = actions[alarm.action] || actions.reminder;
    const task = action();
    db.tasks[genId()] = {
      ...task,
      alarmId: alarm.id,
      timestamp: Date.now(),
      status: 'pending',
    };
    return task;
  },
  add: (userId, cron, action) => {
    const alarm = {
      id: genId(),
      userId,
      cron,
      action,
      enabled: true,
      createdAt: Date.now(),
    };
    db.alarms[alarm.id] = alarm;
    return alarm;
  },
  remove: (alarmId) => {
    delete db.alarms[alarmId];
  },
  toggle: (alarmId) => {
    const alarm = db.alarms[alarmId];
    if (alarm) alarm.enabled = !alarm.enabled;
    return alarm;
  },
  list: (userId) => {
    return Object.values(db.alarms).filter(a => a.userId === userId);
  },
};

alarmClock.start();

// ==================== 水哲学：闭环机制 ====================

const waterPhilosophy = {
  tick: () => {
    const now = Date.now();
    const elapsed = now - db.waterState.lastTick;
    db.waterState.lastTick = now;
    
    const pendingCount = db.queue.pending.length;
    const retryCount = db.queue.retry.length;
    const deadCount = db.queue.dead.length;
    
    if (pendingCount > 100) {
      db.waterState.level -= 2;
    } else if (pendingCount > 50) {
      db.waterState.level -= 1;
    } else if (pendingCount < 10) {
      db.waterState.level = Math.min(100, db.waterState.level + 1);
    }
    
    if (db.waterState.level <= 10) {
      db.waterState.phase = 'drying';
    } else if (db.waterState.level <= 30) {
      db.waterState.phase = 'hibernation';
    } else if (db.waterState.level <= 60) {
      db.waterState.phase = 'refilling';
    } else {
      db.waterState.phase = 'flowing';
    }
  },
  addToQueue: (task, priority = 'normal') => {
    if (db.waterState.phase === 'drying') {
      db.queue.dead.push({ ...task, reason: 'system overload', timestamp: Date.now() });
      return { status: 'rejected', reason: '系统负载过高，请稍后重试' };
    }
    if (db.waterState.phase === 'hibernation') {
      db.queue.retry.push({ ...task, attempt: 1, timestamp: Date.now() });
      return { status: 'delayed', reason: '系统休眠中，任务将稍后执行' };
    }
    db.queue.pending.push({ ...task, priority, timestamp: Date.now() });
    return { status: 'accepted', position: db.queue.pending.length };
  },
  processQueue: () => {
    if (db.waterState.phase !== 'flowing' && db.waterState.phase !== 'refilling') {
      return { processed: 0, skipped: db.queue.pending.length };
    }
    
    const limit = db.waterState.level > 80 ? 10 : db.waterState.level > 50 ? 5 : 2;
    let processed = 0;
    
    for (let i = 0; i < limit && db.queue.pending.length > 0; i++) {
      const task = db.queue.pending.shift();
      try {
        db.tasks[task.id] = { ...task, status: 'completed', completedAt: Date.now() };
        processed++;
      } catch {
        db.queue.retry.push({ ...task, attempt: (task.attempt || 0) + 1 });
      }
    }
    
    const maxRetries = 3;
    db.queue.retry = db.queue.retry.filter(task => {
      if (task.attempt >= maxRetries) {
        db.queue.dead.push({ ...task, reason: 'max retries exceeded', timestamp: Date.now() });
        return false;
      }
      return true;
    });
    
    return { processed, skipped: db.queue.pending.length };
  },
  getState: () => {
    return {
      phase: db.waterState.phase,
      level: db.waterState.level,
      queue: {
        pending: db.queue.pending.length,
        retry: db.queue.retry.length,
        dead: db.queue.dead.length,
      },
    };
  },
};

setInterval(waterPhilosophy.tick, 10000);
setInterval(waterPhilosophy.processQueue, 5000);

// ==================== 几何变形架构 ====================

const geometry = {
  triangle: {
    add: (task) => {
      const id = genId();
      db.geometry.triangle.push({ id, ...task, type: 'triangle', stability: 'high' });
      if (db.geometry.triangle.length > 50) {
        db.geometry.triangle = db.geometry.triangle.slice(-50);
      }
      return id;
    },
    process: () => {
      const result = [];
      db.geometry.triangle.forEach(task => {
        result.push({ ...task, processed: true, timestamp: Date.now() });
      });
      return result;
    },
    get: () => db.geometry.triangle,
  },
  segment: {
    add: (task) => {
      const id = genId();
      db.geometry.segment.push({ id, ...task, type: 'segment', flow: 'streaming' });
      return id;
    },
    process: () => {
      const result = [];
      while (db.geometry.segment.length > 0) {
        const task = db.geometry.segment.shift();
        result.push({ ...task, processed: true, timestamp: Date.now() });
        if (result.length >= 5) break;
      }
      return result;
    },
    get: () => db.geometry.segment,
  },
  parallel: {
    add: (task) => {
      const id = genId();
      db.geometry.parallel.push({ id, ...task, type: 'parallel', concurrency: 'high' });
      return id;
    },
    process: () => {
      const tasks = db.geometry.parallel.splice(0, 8);
      return Promise.all(tasks.map(task => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({ ...task, processed: true, timestamp: Date.now() });
          }, Math.random() * 1000);
        });
      }));
    },
    get: () => db.geometry.parallel,
  },
};

// ==================== 正方体加密（API密钥分片） ====================

const cubeEncryption = {
  splitKey: (apiKey, pieces = 4) => {
    const hash = crypto.createHash('sha256').update(apiKey).digest('hex');
    const sliceSize = Math.ceil(hash.length / pieces);
    const piecesArray = [];
    for (let i = 0; i < pieces; i++) {
      piecesArray.push({
        id: `${i + 1}/${pieces}`,
        data: hash.slice(i * sliceSize, (i + 1) * sliceSize),
        salt: crypto.randomBytes(8).toString('hex'),
      });
    }
    return piecesArray;
  },
  reconstruct: (pieces) => {
    if (!pieces || pieces.length < 3) {
      throw new Error('至少需要3片密钥才能重构');
    }
    const sorted = [...pieces].sort((a, b) => parseInt(a.id) - parseInt(b.id));
    return sorted.map(p => p.data).join('');
  },
  encrypt: (data, keyPieces) => {
    const masterKey = cubeEncryption.reconstruct(keyPieces);
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(masterKey.substring(0, 32), 'hex'), iv);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
      iv: iv.toString('hex'),
      tag: cipher.getAuthTag().toString('hex'),
      data: encrypted,
    };
  },
  decrypt: (encrypted, keyPieces) => {
    const masterKey = cubeEncryption.reconstruct(keyPieces);
    const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(masterKey.substring(0, 32), 'hex'), Buffer.from(encrypted.iv, 'hex'));
    decipher.setAuthTag(Buffer.from(encrypted.tag, 'hex'));
    let decrypted = decipher.update(encrypted.data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  },
};

// ==================== 商业理念 ====================

const businessModel = {
  checkLimit: (userId) => {
    const profile = db.profiles[userId];
    const plan = db.plans[profile?.plan || 'free'];
    const today = new Date().toISOString().split('T')[0];
    if (!db.userStats[userId]) db.userStats[userId] = {};
    if (!db.userStats[userId][today]) db.userStats[userId][today] = 0;
    
    return {
      used: db.userStats[userId][today],
      limit: plan.dailyLimit,
      remaining: plan.dailyLimit - db.userStats[userId][today],
      plan: plan.name,
      isOverLimit: db.userStats[userId][today] >= plan.dailyLimit,
    };
  },
  incrementUsage: (userId) => {
    const today = new Date().toISOString().split('T')[0];
    if (!db.userStats[userId]) db.userStats[userId] = {};
    if (!db.userStats[userId][today]) db.userStats[userId][today] = 0;
    db.userStats[userId][today]++;
    return db.userStats[userId][today];
  },
  upgradePlan: (userId, planId) => {
    if (!db.plans[planId]) return { success: false, error: '套餐不存在' };
    const profile = db.profiles[userId];
    if (!profile) return { success: false, error: '用户不存在' };
    profile.plan = planId;
    return { success: true, plan: db.plans[planId].name };
  },
  getFeatures: (userId) => {
    const profile = db.profiles[userId];
    const plan = db.plans[profile?.plan || 'free'];
    return plan.features;
  },
};

// ==================== API 路由 ====================

const routes = {
  'GET /api/midend/health': async () => ({ status: 'ok', service: 'midend', timestamp: Date.now() }),
  
  'POST /api/midend/route': async (req, body) => {
    const { task, history } = body;
    return dualEngineRoute(task, history);
  },
  
  'POST /api/midend/search': async (req, body) => {
    const { query, options } = body;
    return simulatedHand.search(query, options);
  },
  
  'POST /api/midend/browse': async (req, body) => {
    const { url, options } = body;
    return simulatedHand.browse(url, options);
  },
  
  'GET /api/midend/profile/:userId': async (req) => {
    return profileEngine.get(req.params.userId);
  },
  
  'POST /api/midend/profile': async (req, body) => {
    return profileEngine.create(body.userId, body);
  },
  
  'PUT /api/midend/profile/:userId': async (req, body) => {
    return profileEngine.update(req.params.userId, body);
  },
  
  'POST /api/midend/profile/:userId/track': async (req, body) => {
    profileEngine.trackUsage(req.params.userId, body.taskType, body.duration, body.success);
    return { success: true };
  },
  
  'GET /api/midend/profile/:userId/classify': async (req) => {
    return { classification: profileEngine.classify(req.params.userId) };
  },
  
  'GET /api/midend/profile/:userId/recommend': async (req) => {
    return { recommendations: profileEngine.recommend(req.params.userId) };
  },
  
  'POST /api/midend/alarm': async (req, body) => {
    return alarmClock.add(body.userId, body.cron, body.action);
  },
  
  'GET /api/midend/alarm/:userId': async (req) => {
    return alarmClock.list(req.params.userId);
  },
  
  'PUT /api/midend/alarm/:alarmId': async (req) => {
    return alarmClock.toggle(req.params.alarmId);
  },
  
  'DELETE /api/midend/alarm/:alarmId': async (req) => {
    alarmClock.remove(req.params.alarmId);
    return { success: true };
  },
  
  'GET /api/midend/water': async () => {
    return waterPhilosophy.getState();
  },
  
  'POST /api/midend/queue': async (req, body) => {
    return waterPhilosophy.addToQueue(body.task, body.priority);
  },
  
  'GET /api/midend/queue/process': async () => {
    return waterPhilosophy.processQueue();
  },
  
  'POST /api/midend/geometry/triangle': async (req, body) => {
    return { id: geometry.triangle.add(body) };
  },
  
  'POST /api/midend/geometry/segment': async (req, body) => {
    return { id: geometry.segment.add(body) };
  },
  
  'POST /api/midend/geometry/parallel': async (req, body) => {
    return { id: geometry.parallel.add(body) };
  },
  
  'GET /api/midend/geometry/process': async () => {
    return {
      triangle: geometry.triangle.process(),
      segment: geometry.segment.process(),
      parallel: await geometry.parallel.process(),
    };
  },
  
  'POST /api/midend/encrypt/split': async (req, body) => {
    return cubeEncryption.splitKey(body.apiKey, body.pieces);
  },
  
  'POST /api/midend/encrypt/reconstruct': async (req, body) => {
    return cubeEncryption.reconstruct(body.pieces);
  },
  
  'POST /api/midend/encrypt/encrypt': async (req, body) => {
    return cubeEncryption.encrypt(body.data, body.keyPieces);
  },
  
  'POST /api/midend/encrypt/decrypt': async (req, body) => {
    return cubeEncryption.decrypt(body.encrypted, body.keyPieces);
  },
  
  'GET /api/midend/business/limit/:userId': async (req) => {
    return businessModel.checkLimit(req.params.userId);
  },
  
  'POST /api/midend/business/usage/:userId': async (req) => {
    return { count: businessModel.incrementUsage(req.params.userId) };
  },
  
  'POST /api/midend/business/upgrade/:userId': async (req, body) => {
    return businessModel.upgradePlan(req.params.userId, body.planId);
  },
  
  'GET /api/midend/business/features/:userId': async (req) => {
    return { features: businessModel.getFeatures(req.params.userId) };
  },
  
  'GET /api/midend/engines': async () => {
    return {
      multiAgent: { name: engines.multiAgent.name, description: engines.multiAgent.description },
      efficientDialog: { name: engines.efficientDialog.name, description: engines.efficientDialog.description },
    };
  },
  
  'GET /api/midend/stats': async () => {
    return {
      profiles: Object.keys(db.profiles).length,
      alarms: Object.keys(db.alarms).length,
      tasks: Object.keys(db.tasks).length,
      queue: {
        pending: db.queue.pending.length,
        retry: db.queue.retry.length,
        dead: db.queue.dead.length,
      },
      water: waterPhilosophy.getState(),
      geometry: {
        triangle: db.geometry.triangle.length,
        segment: db.geometry.segment.length,
        parallel: db.geometry.parallel.length,
      },
    };
  },
};

async function handleRequest(req, res) {
  try {
    const parsedUrl = parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;
    
    let body = {};
    if (method === 'POST' || method === 'PUT') {
      body = await new Promise((resolve) => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => {
          try {
            resolve(data ? JSON.parse(data) : {});
          } catch {
            resolve({});
          }
        });
      });
    }
    
    for (const [route, handler] of Object.entries(routes)) {
      const [routeMethod, routePath] = route.split(' ');
      if (method !== routeMethod) continue;
      
      const routeParts = routePath.split('/');
      const pathParts = pathname.split('/');
      if (routeParts.length !== pathParts.length) continue;
      
      const params = {};
      let match = true;
      for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith(':')) {
          params[routeParts[i].slice(1)] = pathParts[i];
        } else if (routeParts[i] !== pathParts[i]) {
          match = false;
          break;
        }
      }
      
      if (match) {
        req.params = params;
        const result = await handler(req, body);
        sendJSON(res, 200, result);
        return;
      }
    }
    
    sendJSON(res, 404, { error: 'Not Found' });
  } catch (error) {
    sendJSON(res, 500, { error: error.message });
  }
}

const server = createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`\n┌─────────────────────────────────────────────────────┐`);
  console.log(`│         HopeAgent 中端流体架构服务启动成功            │`);
  console.log(`│                   端口: ${PORT}                     │`);
  console.log(`├─────────────────────────────────────────────────────┤`);
  console.log(`│  核心组件:                                          │`);
  console.log(`│    • 双引擎路由 (MultiAgent + EfficientDialog)      │`);
  console.log(`│    • 模拟人手 (SimulatedHand)                       │`);
  console.log(`│    • 用户画像 (ProfileEngine)                       │`);
  console.log(`│    • 独立闹钟 (AlarmClock)                          │`);
  console.log(`│    • 水哲学闭环 (WaterPhilosophy)                   │`);
  console.log(`│    • 几何变形 (Geometry)                            │`);
  console.log(`│    • 正方体加密 (CubeEncryption)                    │`);
  console.log(`│    • 商业理念 (BusinessModel)                       │`);
  console.log(`└─────────────────────────────────────────────────────┘`);
});

process.on('SIGINT', () => {
  console.log('\n中端流体架构服务正在优雅关闭...');
  saveDB();
  server.close(() => {
    console.log('服务已关闭');
    process.exit(0);
  });
});
