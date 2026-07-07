// 从浏览器提取的720条知识数据（分段保存）
// 这个文件用于生成完整的知识库

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 知识数据将分段添加
const knowledgeItems = [];

// 第一段：JavaScript (0-99)
const chunk1 = [
  { title: '箭头函数', content: '箭头函数是ES6引入的简洁函数语法，使用 => 定义。它不绑定自己的this，而是捕获定义时所在上下文的this值，因此不能用作构造函数，也没有arguments对象和prototype属性。适合用于回调函数和需要保持this上下文的场景。\n\n代码示例：\nconst add = (a, b) => a + b;', category: 'JavaScript', tags: ['ES6', '函数', '箭头函数'], source: 'MDN' },
];

console.log('知识条目生成中...');
console.log('当前数量:', knowledgeItems.length);
