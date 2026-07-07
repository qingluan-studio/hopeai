import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const knowledgeDataPath = path.join(__dirname, '../src/engine/knowledgeData.ts');
const content = fs.readFileSync(knowledgeDataPath, 'utf8');

const items = [];

const lines = content.split('\n');
let currentItem = null;
let inArray = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  if (line === 'export const extendedKnowledge: KnowledgePoint[] = [') {
    inArray = true;
    continue;
  }
  
  if (!inArray) continue;
  
  if (line === '];') break;
  
  if (line === '{') {
    currentItem = {};
    continue;
  }
  
  if (line === '},' || line === '}') {
    if (currentItem && currentItem.title) {
      items.push(currentItem);
    }
    currentItem = null;
    continue;
  }
  
  if (!currentItem) continue;
  
  const titleMatch = line.match(/title:\s*'([^']+)',/);
  if (titleMatch) {
    currentItem.title = titleMatch[1];
    continue;
  }
  
  const contentMatch = line.match(/content:\s*'([^']+)',/);
  if (contentMatch) {
    currentItem.content = contentMatch[1];
    continue;
  }
  
  const categoryMatch = line.match(/category:\s*'([^']+)',/);
  if (categoryMatch) {
    currentItem.category = categoryMatch[1];
    continue;
  }
  
  const tagsMatch = line.match(/tags:\s*\[(.*)\],/);
  if (tagsMatch) {
    const tagsStr = tagsMatch[1];
    currentItem.tags = tagsStr.match(/'([^']+)'/g)?.map(t => t.replace(/'/g, '')) || [];
    continue;
  }
}

console.log(`提取到 ${items.length} 条知识`);

let output = '';
for (const item of items) {
  const tagsStr = item.tags.map(t => `'${t}'`).join(', ');
  output += `  { title: '${item.title}', content: '${item.content}', category: '${item.category}', tags: [${tagsStr}] },\n`;
}

const outputPath = path.join(__dirname, 'knowledge-items.txt');
fs.writeFileSync(outputPath, output, 'utf8');
console.log(`已写入 ${outputPath}`);
