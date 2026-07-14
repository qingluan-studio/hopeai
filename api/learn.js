/**
 * AI 自动学习 API - Vercel Edge Function
 * 访问：https://your-vercel-domain/api/learn
 */

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Only POST' }), { status: 405 });
  }

  // 解密API Key
  const encryptedKey = '27,4,93,3,85,11,93,13,73,82,88,11,10,90,71,81,7,13,95,14,73,84,7,15,11,92,65,84,3,81,10,10,66,83,80';
  const secret = 'hopeai';
  const API_KEY = encryptedKey.split(',').map((c, i) => 
    String.fromCharCode(parseInt(c, 10) ^ secret.charCodeAt(i % secret.length))
  ).join('');

  const BASE_URL = 'https://api.deepseek.com';
  const MODEL = 'deepseek-chat';

  const KNOWLEDGE_BASE = [
    { topic: "JavaScript 闭包", answer: "闭包是函数能记住并访问其词法作用域。用途：数据私有化、函数工厂、模块模式。", category: "JavaScript" },
    { topic: "Promise", answer: "异步编程方案。三种状态：pending/fulfilled/rejected。解决回调地狱。", category: "JavaScript" },
    { topic: "Event Loop", answer: "JS单线程，事件循环实现异步。同步→微任务→宏任务。", category: "JavaScript" },
    { topic: "ES6特性", answer: "let/const、箭头函数、模板字符串、解构、展开运算符、class、Promise、模块化。", category: "JavaScript" },
    { topic: "原型链", answer: "对象__proto__指向构造函数prototype。访问属性沿原型链向上查找。", category: "JavaScript" },
    { topic: "React Hooks", answer: "useState状态、useEffect副作用、useContext共享、useRef引用、useMemo缓存。", category: "React" },
    { topic: "虚拟DOM", answer: "JS对象描述DOM。Diff算法：同层比较、key复用。减少DOM操作。", category: "React" },
    { topic: "Vue响应式", answer: "Vue3用Proxy。reactive/ref/computed。get收集依赖，set触发更新。", category: "Vue" },
    { topic: "TypeScript类型", answer: "基础类型、联合/交叉类型、泛型、工具类型Partial/Pick/Omit。", category: "TypeScript" },
    { topic: "快速排序", answer: "分治法。选基准值，小于左边大于右边，递归。O(n log n)。", category: "算法" },
    { topic: "动态规划", answer: "大问题拆小问题，保存子问题解。状态定义+转移方程+初始条件。", category: "算法" },
    { topic: "二分查找", answer: "有序数组，取中间比较，O(log n)。", category: "算法" },
    { topic: "单例模式", answer: "一个类只有一个实例。私有构造函数+静态获取方法。", category: "设计模式" },
    { topic: "观察者模式", answer: "Subject维护Observer列表，状态变化通知所有观察者。", category: "设计模式" },
    { topic: "SOLID原则", answer: "单一职责、开闭、里氏替换、接口隔离、依赖倒置。", category: "设计模式" },
    { topic: "HTTP状态码", answer: "2xx成功、3xx重定向、4xx客户端错误、5xx服务端错误。", category: "网络" },
    { topic: "HTTPS", answer: "HTTP+SSL/TLS。证书+公钥+对称密钥。非对称加密交换密钥，对称加密传输。", category: "网络" },
    { topic: "XSS防护", answer: "跨站脚本。输出转义、CSP、HttpOnly Cookie、输入验证。", category: "安全" },
    { topic: "SQL注入", answer: "参数化查询最重要！ORM、白名单验证、不拼接SQL。", category: "安全" },
    { topic: "Docker", answer: "轻量容器化。镜像/容器/仓库。共享内核，MB级，秒级启动。", category: "DevOps" },
    { topic: "K8s", answer: "Pod/Service/Deployment/ConfigMap。容器编排。", category: "DevOps" },
    { topic: "Git分支策略", answer: "Feature Branch最常用。Git Flow复杂。GitHub Flow简单。", category: "Git" },
    { topic: "大模型原理", answer: "预测下一个词。Tokenizer+Embedding+Transformer+注意力。", category: "AI" },
    { topic: "Transformer", answer: "自注意力+多头注意力+位置编码+前馈网络。并行计算。", category: "AI" },
    { topic: "RAG", answer: "检索增强生成。索引→检索→生成。知识可更新，减少幻觉。", category: "AI" },
    { topic: "Prompt工程", answer: "角色设定、明确指令、Few-shot、CoT思维链、约束条件。", category: "AI" },
    { topic: "AI Agent", answer: "感知→思考→行动→记忆。工具调用+规划+反思。", category: "AI" },
    { topic: "进程vs线程", answer: "进程独立地址空间，线程共享。进程稳定，线程轻量。", category: "基础" },
    { topic: "TCP三次握手", answer: "SYN→SYN+ACK→ACK。确认双方收发能力。", category: "基础" },
    { topic: "Python装饰器", answer: "修改函数行为的函数。@decorator语法。", category: "Python" },
    { topic: "前端性能", answer: "代码分割、懒加载、CDN、虚拟列表、防抖节流。", category: "前端" },
  ];

  const randomIndex = Math.floor(Math.random() * KNOWLEDGE_BASE.length);
  const knowledge = KNOWLEDGE_BASE[randomIndex];

  const prompt = `我现在要学习：${knowledge.topic}\n\n知识点：${knowledge.answer}\n\n请用简洁的语言总结这个知识点的核心内容，3-5句话即可。`;

  try {
    const res = await fetch(`${BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: '你是学习助手，帮助理解和总结编程知识。简洁清晰，用中文回答。' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.5,
        max_tokens: 500,
      }),
    });

    const data = await res.json();
    const summary = data.choices?.[0]?.message?.content || '学习失败';

    return new Response(JSON.stringify({
      success: true,
      topic: knowledge.topic,
      category: knowledge.category,
      summary,
      timestamp: new Date().toISOString(),
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (e) {
    return new Response(JSON.stringify({
      success: false,
      error: e.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
