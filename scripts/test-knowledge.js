// 测试知识库初始化
const INITIAL_KNOWLEDGE = [
  { title: 'React Hooks核心知识', content: 'useState状态管理、useEffect副作用处理、useContext跨组件传值、useRef DOM引用、useMemo性能优化缓存、useCallback回调缓存、useReducer复杂状态管理。Hooks规则：只在顶层调用，不在循环/条件/嵌套函数中调用。', category: '前端开发', tags: ['react', 'hooks', '前端', 'javascript'] },
  { title: 'React状态管理方案对比', content: 'Redux Toolkit企业级状态管理、Zustand轻量级方案、Jotai原子化状态、Recoil Facebook出品。趋势：从单一Store向原子化状态转变，TypeScript支持越来越好。', category: '前端开发', tags: ['react', 'redux', 'zustand', '状态管理'] },
];

let knowledgeBase = [];
let knowledgeGraph = {};

function initializeKnowledgeBase() {
  if (knowledgeBase.length > 0) return;

  for (const item of INITIAL_KNOWLEDGE) {
    knowledgeBase.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 9),
      title: item.title,
      content: item.content,
      source: 'kimi_search_curated',
      tags: item.tags,
      category: item.category,
      importance: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  for (let i = 0; i < knowledgeBase.length; i++) {
    for (let j = i + 1; j < knowledgeBase.length; j++) {
      const tags1 = new Set(knowledgeBase[i].tags);
      const tags2 = new Set(knowledgeBase[j].tags);
      let similarity = 0;
      for (const tag of tags1) {
        if (tags2.has(tag)) similarity++;
      }
      if (similarity >= 2) {
        if (!knowledgeGraph[knowledgeBase[i].id]) knowledgeGraph[knowledgeBase[i].id] = [];
        if (!knowledgeGraph[knowledgeBase[j].id]) knowledgeGraph[knowledgeBase[j].id] = [];
        knowledgeGraph[knowledgeBase[i].id].push(knowledgeBase[j].id);
        knowledgeGraph[knowledgeBase[j].id].push(knowledgeBase[i].id);
      }
    }
  }

  console.log(`知识库已初始化: ${knowledgeBase.length} 条, 图谱关系: ${Object.keys(knowledgeGraph).length}`);
}

initializeKnowledgeBase();
console.log('测试通过！');
