export interface ToolResult {
  success: boolean;
  output: string;
  error?: string;
  type: 'text' | 'code' | 'json' | 'file';
}

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: 'code' | 'filesystem' | 'calculator' | 'web' | 'other' | 'aci';
  parameters: ToolParameter[];
  execute: (args: Record<string, string>) => Promise<ToolResult>;
}

export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'file';
  required: boolean;
  description: string;
  defaultValue?: string;
}

interface VirtualFile {
  path: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

class VirtualFileSystem {
  private files: Map<string, VirtualFile> = new Map();
  private STORAGE_KEY = 'hopeai_vfs';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        Object.entries(data).forEach(([path, file]) => {
          this.files.set(path, file as VirtualFile);
        });
      }
    } catch {}
  }

  private saveToStorage(): void {
    try {
      const data: Record<string, VirtualFile> = {};
      this.files.forEach((file, path) => {
        data[path] = file;
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }

  readFile(path: string): string | null {
    const file = this.files.get(this.normalizePath(path));
    return file ? file.content : null;
  }

  writeFile(path: string, content: string): void {
    const normalized = this.normalizePath(path);
    const now = Date.now();
    const existing = this.files.get(normalized);
    this.files.set(normalized, {
      path: normalized,
      content,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    });
    this.saveToStorage();
  }

  fileExists(path: string): boolean {
    return this.files.has(this.normalizePath(path));
  }

  listFiles(dirPath: string = '/'): { name: string; type: 'file' | 'directory'; size: number }[] {
    const normalized = this.normalizePath(dirPath);
    const prefix = normalized === '/' ? '/' : normalized + '/';
    const result = new Map<string, { type: 'file' | 'directory'; size: number }>();

    this.files.forEach((file, filePath) => {
      if (filePath.startsWith(prefix) && filePath !== normalized) {
        const relative = filePath.slice(prefix.length);
        const parts = relative.split('/');
        const name = parts[0];
        
        if (parts.length === 1) {
          result.set(name, { type: 'file', size: file.content.length });
        } else {
          if (!result.has(name)) {
            result.set(name, { type: 'directory', size: 0 });
          }
        }
      }
    });

    return Array.from(result.entries())
      .map(([name, info]) => ({ name, ...info }))
      .sort((a, b) => {
        if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
  }

  deleteFile(path: string): boolean {
    const normalized = this.normalizePath(path);
    const result = this.files.delete(normalized);
    if (result) this.saveToStorage();
    return result;
  }

  searchFiles(
    basePath: string,
    pattern: string,
    filePattern?: string
  ): { file: string; line: number; match: string }[] {
    const normalizedBase = this.normalizePath(basePath);
    const results: { file: string; line: number; match: string }[] = [];
    let regex: RegExp;

    try {
      regex = new RegExp(pattern);
    } catch {
      return results;
    }

    const fileRegex = filePattern ? this.globToRegex(filePattern) : null;

    this.files.forEach((file, filePath) => {
      if (!filePath.startsWith(normalizedBase === '/' ? '/' : normalizedBase + '/')) return;
      if (fileRegex && !fileRegex.test(filePath.split('/').pop() || '')) return;

      const lines = file.content.split('\n');
      lines.forEach((line, idx) => {
        if (regex.test(line)) {
          results.push({
            file: filePath,
            line: idx + 1,
            match: line.trim(),
          });
        }
      });
    });

    return results.slice(0, 100);
  }

  private normalizePath(path: string): string {
    if (!path.startsWith('/')) path = '/' + path;
    path = path.replace(/\/+/g, '/');
    if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
    return path;
  }

  private globToRegex(glob: string): RegExp {
    const escaped = glob
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');
    return new RegExp('^' + escaped + '$');
  }

  getAllFilesCount(): number {
    return this.files.size;
  }

  clear(): void {
    this.files.clear();
    this.saveToStorage();
  }
}

export const vfs = new VirtualFileSystem();

const DANGEROUS_COMMANDS = [
  /^rm\s+-rf\s+(\/|\*|\.\.)/i,
  /^rm\s+-r\s+\/$/i,
  /^dd\s+if=/,
  /^mkfs/,
  /^shutdown/,
  /^reboot/,
  /^halt/,
  /^passwd/,
  /^su\s/,
  /^sudo\s/,
  /^chmod\s+.*\/etc/i,
  /^chown\s+.*\/etc/i,
  /^wget\s+.*\|.*sh/i,
  /^curl\s+.*\|.*sh/i,
  /> \s*\/etc\//i,
  />> \s*\/etc\//i,
];

const MAX_OUTPUT_LINES = 200;
const MAX_OUTPUT_CHARS = 10000;

function truncateOutput(output: string): string {
  const lines = output.split('\n');
  if (lines.length > MAX_OUTPUT_LINES) {
    const truncated = lines.slice(0, MAX_OUTPUT_LINES).join('\n');
    return truncated + `\n\n... (输出已截断，共 ${lines.length} 行，仅显示前 ${MAX_OUTPUT_LINES} 行)`;
  }
  if (output.length > MAX_OUTPUT_CHARS) {
    return output.slice(0, MAX_OUTPUT_CHARS) + `\n\n... (输出已截断，总长度 ${output.length} 字符)`;
  }
  return output;
}

function formatWithLineNumbers(content: string, startLine: number = 1): string {
  const lines = content.split('\n');
  const maxLineNumWidth = String(startLine + lines.length - 1).length;
  return lines.map((line, idx) => {
    const lineNum = String(startLine + idx).padStart(maxLineNumWidth, ' ');
    return `${lineNum}│ ${line}`;
  }).join('\n');
}

function checkSyntax(content: string, filePath: string): { valid: boolean; error?: string } {
  const ext = filePath.split('.').pop()?.toLowerCase();
  
  if (ext === 'json') {
    try {
      JSON.parse(content);
      return { valid: true };
    } catch (e) {
      return { valid: false, error: `JSON 语法错误: ${e instanceof Error ? e.message : '未知错误'}` };
    }
  }

  if (ext === 'js' || ext === 'ts' || ext === 'jsx' || ext === 'tsx' || ext === 'mjs' || ext === 'cjs') {
    try {
      new Function(content);
      return { valid: true };
    } catch (e) {
      const msg = e instanceof Error ? e.message : '未知错误';
      if (msg.includes('Unexpected') || msg.includes('SyntaxError')) {
        return { valid: false, error: `JavaScript 语法错误: ${msg}` };
      }
      return { valid: true };
    }
  }

  if (ext === 'html') {
    const openTags = content.match(/<[a-z][^>]*>/gi) || [];
    const closeTags = content.match(/<\/[a-z][^>]*>/gi) || [];
    if (openTags.length - closeTags.length > 5) {
      return { valid: false, error: 'HTML 标签不匹配，可能存在未闭合标签' };
    }
    return { valid: true };
  }

  if (ext === 'css') {
    const openBraces = (content.match(/\{/g) || []).length;
    const closeBraces = (content.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
      return { valid: false, error: `CSS 大括号不匹配: { ${openBraces} 个, } ${closeBraces} 个` };
    }
    return { valid: true };
  }

  return { valid: true };
}

export class ToolEngine {
  private tools: Map<string, ToolDefinition> = new Map();

  constructor() {
    this.registerBuiltinTools();
  }

  private registerBuiltinTools(): void {
    this.registerTool({
      id: 'aci_view',
      name: 'ACI 文件查看',
      description: '查看文件内容，自动带行号，支持范围读取',
      category: 'aci',
      parameters: [
        { name: 'path', type: 'string', required: true, description: '文件路径' },
        { name: 'start_line', type: 'number', required: false, description: '起始行号', defaultValue: '1' },
        { name: 'end_line', type: 'number', required: false, description: '结束行号' },
      ],
      execute: async (args) => {
        return await aciView(args.path, parseInt(args.start_line || '1'), args.end_line ? parseInt(args.end_line) : undefined);
      }
    });

    this.registerTool({
      id: 'aci_edit',
      name: 'ACI 精确编辑',
      description: '通过 old/new 字符串匹配精确替换代码，自动语法检查',
      category: 'aci',
      parameters: [
        { name: 'path', type: 'string', required: true, description: '文件路径' },
        { name: 'old_str', type: 'string', required: true, description: '要替换的原始字符串' },
        { name: 'new_str', type: 'string', required: true, description: '新的字符串' },
      ],
      execute: async (args) => {
        return await aciEdit(args.path, args.old_str, args.new_str);
      }
    });

    this.registerTool({
      id: 'aci_create',
      name: 'ACI 创建文件',
      description: '创建新文件，自动语法检查',
      category: 'aci',
      parameters: [
        { name: 'path', type: 'string', required: true, description: '文件路径' },
        { name: 'content', type: 'string', required: true, description: '文件内容' },
        { name: 'overwrite', type: 'boolean', required: false, description: '是否覆盖已有文件', defaultValue: 'false' },
      ],
      execute: async (args) => {
        return await aciCreate(args.path, args.content, args.overwrite === 'true');
      }
    });

    this.registerTool({
      id: 'aci_search',
      name: 'ACI 代码搜索',
      description: '在文件系统中搜索代码，支持正则和文件类型过滤',
      category: 'aci',
      parameters: [
        { name: 'path', type: 'string', required: false, description: '搜索起始路径', defaultValue: '/' },
        { name: 'pattern', type: 'string', required: true, description: '搜索模式（正则表达式）' },
        { name: 'file_pattern', type: 'string', required: false, description: '文件名过滤（支持通配符，如 *.ts）' },
      ],
      execute: async (args) => {
        return await aciSearch(args.path || '/', args.pattern, args.file_pattern);
      }
    });

    this.registerTool({
      id: 'aci_list',
      name: 'ACI 目录列表',
      description: '列出目录下的文件和子目录',
      category: 'aci',
      parameters: [
        { name: 'path', type: 'string', required: false, description: '目录路径', defaultValue: '/' },
      ],
      execute: async (args) => {
        return await aciList(args.path || '/');
      }
    });

    this.registerTool({
      id: 'aci_delete',
      name: 'ACI 删除文件',
      description: '删除指定文件（危险操作，需确认）',
      category: 'aci',
      parameters: [
        { name: 'path', type: 'string', required: true, description: '文件路径' },
      ],
      execute: async (args) => {
        return await aciDelete(args.path);
      }
    });

    this.registerTool({
      id: 'code_executor',
      name: '代码执行器',
      description: '执行JavaScript代码片段',
      category: 'code',
      parameters: [
        { name: 'code', type: 'string', required: true, description: '要执行的代码' }
      ],
      execute: async (args) => {
        return await executeCode(args.code);
      }
    });

    this.registerTool({
      id: 'calculator',
      name: '计算器',
      description: '执行数学计算',
      category: 'calculator',
      parameters: [
        { name: 'expression', type: 'string', required: true, description: '数学表达式' }
      ],
      execute: async (args) => {
        return await calculateExpression(args.expression);
      }
    });

    this.registerTool({
      id: 'json_parser',
      name: 'JSON解析器',
      description: '解析和格式化JSON数据',
      category: 'other',
      parameters: [
        { name: 'json_string', type: 'string', required: true, description: 'JSON字符串' }
      ],
      execute: async (args) => {
        return await parseJson(args.json_string);
      }
    });

    this.registerTool({
      id: 'regex_test',
      name: '正则表达式测试',
      description: '测试正则表达式匹配',
      category: 'other',
      parameters: [
        { name: 'pattern', type: 'string', required: true, description: '正则表达式' },
        { name: 'text', type: 'string', required: true, description: '测试文本' }
      ],
      execute: async (args) => {
        return await testRegex(args.pattern, args.text);
      }
    });
  }

  registerTool(tool: ToolDefinition): void {
    this.tools.set(tool.id, tool);
  }

  getTool(id: string): ToolDefinition | undefined {
    return this.tools.get(id);
  }

  getAllTools(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }

  getToolsByCategory(category: ToolDefinition['category']): ToolDefinition[] {
    return Array.from(this.tools.values()).filter(t => t.category === category);
  }

  async executeTool(toolId: string, args: Record<string, string>): Promise<ToolResult> {
    const tool = this.tools.get(toolId);
    if (!tool) {
      return {
        success: false,
        output: `工具 ${toolId} 未找到`,
        error: `工具 ${toolId} 不存在`,
        type: 'text'
      };
    }

    const missingParams = tool.parameters
      .filter(p => p.required && !(p.name in args))
      .map(p => p.name);

    if (missingParams.length > 0) {
      return {
        success: false,
        output: `缺少必需参数: ${missingParams.join(', ')}`,
        error: `缺少参数 ${missingParams.join(', ')}`,
        type: 'text'
      };
    }

    try {
      return await tool.execute(args);
    } catch (error) {
      return {
        success: false,
        output: `执行失败: ${error instanceof Error ? error.message : '未知错误'}`,
        error: error instanceof Error ? error.message : '未知错误',
        type: 'text'
      };
    }
  }
}

async function aciView(path: string, startLine: number, endLine?: number): Promise<ToolResult> {
  const content = vfs.readFile(path);
  if (content === null) {
    return {
      success: false,
      output: `文件不存在: ${path}`,
      error: 'File not found',
      type: 'text'
    };
  }

  const lines = content.split('\n');
  const start = Math.max(1, startLine);
  const end = endLine ? Math.min(lines.length, endLine) : lines.length;
  
  if (start > lines.length) {
    return {
      success: false,
      output: `起始行号 ${start} 超出文件范围（共 ${lines.length} 行）`,
      error: 'Line out of range',
      type: 'text'
    };
  }

  const sliced = lines.slice(start - 1, end).join('\n');
  const numbered = formatWithLineNumbers(sliced, start);

  return {
    success: true,
    output: numbered,
    type: 'code'
  };
}

async function aciEdit(path: string, oldStr: string, newStr: string): Promise<ToolResult> {
  const content = vfs.readFile(path);
  if (content === null) {
    return {
      success: false,
      output: `文件不存在: ${path}`,
      error: 'File not found',
      type: 'text'
    };
  }

  const occurrences = (content.match(new RegExp(oldStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;

  if (occurrences === 0) {
    const preview = content.slice(0, 200);
    return {
      success: false,
      output: `未找到匹配的字符串！\n\n要查找的字符串:\n${oldStr}\n\n文件开头预览:\n${preview}...`,
      error: 'No match found',
      type: 'text'
    };
  }

  if (occurrences > 1) {
    return {
      success: false,
      output: `找到 ${occurrences} 处匹配，无法确定替换哪一处。请提供更精确的字符串（包含更多上下文）。`,
      error: 'Multiple matches',
      type: 'text'
    };
  }

  const newContent = content.replace(oldStr, newStr);

  const syntaxCheck = checkSyntax(newContent, path);
  if (!syntaxCheck.valid) {
    return {
      success: false,
      output: `编辑被拒绝！${syntaxCheck.error}\n\n为了保证代码完整性，本次修改未保存。`,
      error: syntaxCheck.error,
      type: 'text'
    };
  }

  vfs.writeFile(path, newContent);

  const oldLineNum = content.split('\n').findIndex((line, idx) => {
    const before = content.split('\n').slice(0, idx).join('\n');
    return before.length + line.length >= content.indexOf(oldStr);
  }) + 1;

  return {
    success: true,
    output: `✓ 替换成功（约第 ${oldLineNum} 行）\n\n替换前:\n${oldStr}\n\n替换后:\n${newStr}`,
    type: 'code'
  };
}

async function aciCreate(path: string, content: string, overwrite: boolean): Promise<ToolResult> {
  const exists = vfs.fileExists(path);
  
  if (exists && !overwrite) {
    return {
      success: false,
      output: `文件已存在: ${path}\n如需覆盖，请设置 overwrite=true`,
      error: 'File already exists',
      type: 'text'
    };
  }

  const syntaxCheck = checkSyntax(content, path);
  if (!syntaxCheck.valid) {
    return {
      success: false,
      output: `创建被拒绝！${syntaxCheck.error}`,
      error: syntaxCheck.error,
      type: 'text'
    };
  }

  vfs.writeFile(path, content);

  const lineCount = content.split('\n').length;
  return {
    success: true,
    output: `✓ 文件${exists ? '覆盖' : '创建'}成功: ${path}\n文件大小: ${content.length} 字节 / ${lineCount} 行`,
    type: 'text'
  };
}

async function aciSearch(path: string, pattern: string, filePattern?: string): Promise<ToolResult> {
  let regex: RegExp;
  try {
    regex = new RegExp(pattern);
  } catch (e) {
    return {
      success: false,
      output: `正则表达式错误: ${e instanceof Error ? e.message : '未知错误'}`,
      error: 'Invalid regex',
      type: 'text'
    };
  }

  const results = vfs.searchFiles(path, pattern, filePattern);

  if (results.length === 0) {
    return {
      success: true,
      output: `未找到匹配项。\n搜索路径: ${path}\n搜索模式: ${pattern}${filePattern ? `\n文件过滤: ${filePattern}` : ''}`,
      type: 'text'
    };
  }

  const grouped = new Map<string, typeof results>();
  results.forEach(r => {
    if (!grouped.has(r.file)) grouped.set(r.file, []);
    grouped.get(r.file)!.push(r);
  });

  let output = `找到 ${results.length} 处匹配（来自 ${grouped.size} 个文件）:\n\n`;
  grouped.forEach((matches, file) => {
    output += `📄 ${file}\n`;
    matches.forEach(m => {
      const matchPreview = m.match.length > 80 ? m.match.slice(0, 80) + '...' : m.match;
      output += `  ${m.line}: ${matchPreview}\n`;
    });
    output += '\n';
  });

  output = truncateOutput(output);

  return {
    success: true,
    output,
    type: 'text'
  };
}

async function aciList(path: string): Promise<ToolResult> {
  const files = vfs.listFiles(path);

  if (files.length === 0) {
    const exists = vfs.fileExists(path);
    if (!exists && path !== '/') {
      return {
        success: false,
        output: `目录不存在: ${path}`,
        error: 'Directory not found',
        type: 'text'
      };
    }
    return {
      success: true,
      output: `目录为空: ${path}`,
      type: 'text'
    };
  }

  let output = `目录: ${path}\n\n`;
  files.forEach(f => {
    const icon = f.type === 'directory' ? '📁' : '📄';
    const sizeStr = f.type === 'file' ? ` (${f.size} B)` : '';
    output += `${icon} ${f.name}${sizeStr}\n`;
  });

  return {
    success: true,
    output,
    type: 'text'
  };
}

async function aciDelete(path: string): Promise<ToolResult> {
  if (path === '/' || path === '') {
    return {
      success: false,
      output: '🚫 危险操作！不能删除根目录',
      error: 'Dangerous operation blocked',
      type: 'text'
    };
  }

  const exists = vfs.fileExists(path);
  if (!exists) {
    return {
      success: false,
      output: `文件不存在: ${path}`,
      error: 'File not found',
      type: 'text'
    };
  }

  vfs.deleteFile(path);
  return {
    success: true,
    output: `✓ 已删除: ${path}`,
    type: 'text'
  };
}

async function executeCode(code: string): Promise<ToolResult> {
  try {
    const sanitizedCode = sanitizeCode(code);
    let result: unknown;

    if (typeof window !== 'undefined' && window.eval) {
      result = await eval(`(async () => { ${sanitizedCode} })()`);
    } else {
      result = new Function(sanitizedCode)();
    }

    let output = '';
    if (result !== undefined && result !== null) {
      output = typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result);
    }

    return {
      success: true,
      output: output || '代码执行完成，无返回值',
      type: 'code'
    };
  } catch (error) {
    return {
      success: false,
      output: `执行错误: ${error instanceof Error ? error.message : '未知错误'}`,
      error: error instanceof Error ? error.message : '未知错误',
      type: 'text'
    };
  }
}

function sanitizeCode(code: string): string {
  const dangerousPatterns = [
    /(eval|Function)\s*\(/g,
    /(document\.|window\.)/g,
    /(localStorage|sessionStorage)/g,
    /(XMLHttpRequest|fetch)\s*\(/g,
  ];

  return dangerousPatterns.reduce((code, pattern) => 
    code.replace(pattern, '[安全限制]'), 
    code
  );
}

async function calculateExpression(expression: string): Promise<ToolResult> {
  try {
    const sanitized = expression.replace(/[^0-9+\-*/().%^√πe\s]/g, '');
    
    const mathFunctions: Record<string, number | Function> = {
      pi: Math.PI,
      e: Math.E,
      sqrt: Math.sqrt,
      pow: Math.pow,
      abs: Math.abs,
      sin: Math.sin,
      cos: Math.cos,
      tan: Math.tan,
      log: Math.log,
      log10: Math.log10,
      exp: Math.exp
    };

    const result = new Function(
      ...Object.keys(mathFunctions),
      `return ${sanitized};`
    )(...Object.values(mathFunctions));

    return {
      success: true,
      output: `${expression} = ${result}`,
      type: 'text'
    };
  } catch (error) {
    return {
      success: false,
      output: `计算错误: ${error instanceof Error ? error.message : '未知错误'}`,
      error: error instanceof Error ? error.message : '未知错误',
      type: 'text'
    };
  }
}

async function parseJson(jsonString: string): Promise<ToolResult> {
  try {
    const parsed = JSON.parse(jsonString);
    return {
      success: true,
      output: JSON.stringify(parsed, null, 2),
      type: 'json'
    };
  } catch (error) {
    return {
      success: false,
      output: `JSON解析错误: ${error instanceof Error ? error.message : '未知错误'}`,
      error: error instanceof Error ? error.message : '未知错误',
      type: 'text'
    };
  }
}

async function testRegex(pattern: string, text: string): Promise<ToolResult> {
  try {
    const regex = new RegExp(pattern);
    const matches = text.match(regex);
    const found = regex.test(text);

    const result = {
      pattern,
      found,
      matches: matches || [],
      matchCount: matches ? matches.length : 0
    };

    return {
      success: true,
      output: JSON.stringify(result, null, 2),
      type: 'json'
    };
  } catch (error) {
    return {
      success: false,
      output: `正则表达式错误: ${error instanceof Error ? error.message : '未知错误'}`,
      error: error instanceof Error ? error.message : '未知错误',
      type: 'text'
    };
  }
}

export const toolEngine = new ToolEngine();
