import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const knowledgeDataPath = path.join(__dirname, '../src/engine/knowledgeData.ts');
const chatTsPath = path.join(__dirname, '../api/routes/chat.ts');

const knowledgeDataContent = fs.readFileSync(knowledgeDataPath, 'utf8');
const chatTsContent = fs.readFileSync(chatTsPath, 'utf8');

const items = [];
const regex = /\{\s*id:\s*generateId\(\),\s*title:\s*'([^']+)',\s*content:\s*'([^']+)',\s*source:\s*'([^']*)',\s*tags:\s*\[([^\]]+)\],\s*category:\s*'([^']+)',[^}]*importance:\s*(\d+),/g;

let match;
while ((match = regex.exec(knowledgeDataContent)) !== null) {
  const title = match[1];
  const content = match[2];
  const source = match[3];
  const tagsStr = match[4];
  const category = match[5];
  const importance = parseInt(match[6]);
  
  const tags = tagsStr.match(/'([^']+)'/g)?.map(t => t.replace(/'/g, '')) || [];
  
  items.push({
    title,
    content,
    category,
    tags,
    source,
    importance
  });
}

console.log(`从 knowledgeData.ts 提取到 ${items.length} 条知识`);

const initialKnowledgeMatch = chatTsContent.match(/const INITIAL_KNOWLEDGE = \[([\s\S]*?)\n\];/);
if (!initialKnowledgeMatch) {
  console.error('未找到 INITIAL_KNOWLEDGE 数组');
  process.exit(1);
}

const existingItems = [];
const existingRegex = /\{\s*title:\s*'([^']+)',\s*content:\s*'([^']+)',\s*category:\s*'([^']+)',\s*tags:\s*\[([^\]]+)\][^}]*\}/g;
let existingMatch;
while ((existingMatch = existingRegex.exec(initialKnowledgeMatch[1])) !== null) {
  existingItems.push({
    title: existingMatch[1],
    content: existingMatch[2],
    category: existingMatch[3],
    tags: existingMatch[4].match(/'([^']+)'/g)?.map(t => t.replace(/'/g, '')) || []
  });
}

console.log(`现有 INITIAL_KNOWLEDGE 有 ${existingItems.length} 条知识`);

const existingTitles = new Set(existingItems.map(item => item.title));
const newItems = items.filter(item => !existingTitles.has(item.title));

console.log(`新增 ${newItems.length} 条知识（去重后）`);

let newItemsStr = '';
for (const item of newItems) {
  const tagsStr = item.tags.map(t => `'${t}'`).join(', ');
  newItemsStr += `  { title: '${item.title}', content: '${item.content}', category: '${item.category}', tags: [${tagsStr}] },\n`;
}

const updatedChatTsContent = chatTsContent.replace(
  /const INITIAL_KNOWLEDGE = \[\n([\s\S]*?)\n\];/,
  `const INITIAL_KNOWLEDGE = [\n$1${newItemsStr}];`
);

fs.writeFileSync(chatTsPath, updatedChatTsContent, 'utf8');

console.log('已更新 chat.ts');
console.log(`最终知识库总数: ${existingItems.length + newItems.length} 条`);
