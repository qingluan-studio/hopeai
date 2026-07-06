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
  category: 'code' | 'filesystem' | 'calculator' | 'web' | 'other';
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

export class ToolEngine {
  private tools: Map<string, ToolDefinition> = new Map();

  constructor() {
    this.registerBuiltinTools();
  }

  private registerBuiltinTools(): void {
    this.registerTool({
      id: 'code_executor',
      name: '代码执行器',
      description: '执行JavaScript/TypeScript代码片段',
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
      id: 'file_reader',
      name: '文件读取器',
      description: '读取本地文件内容',
      category: 'filesystem',
      parameters: [
        { name: 'path', type: 'string', required: true, description: '文件路径' }
      ],
      execute: async (args) => {
        return await readFile(args.path);
      }
    });

    this.registerTool({
      id: 'file_writer',
      name: '文件写入器',
      description: '写入内容到文件',
      category: 'filesystem',
      parameters: [
        { name: 'path', type: 'string', required: true, description: '文件路径' },
        { name: 'content', type: 'string', required: true, description: '文件内容' },
        { name: 'append', type: 'boolean', required: false, description: '是否追加', defaultValue: 'false' }
      ],
      execute: async (args) => {
        return await writeFile(args.path, args.content, args.append === 'true');
      }
    });

    this.registerTool({
      id: 'file_list',
      name: '文件列表',
      description: '列出目录下的文件',
      category: 'filesystem',
      parameters: [
        { name: 'path', type: 'string', required: false, description: '目录路径', defaultValue: '.' }
      ],
      execute: async (args) => {
        return await listFiles(args.path || '.');
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
    /(new\s+)?(Date|Promise)/g
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

async function readFile(path: string): Promise<ToolResult> {
  try {
    if (typeof window !== 'undefined') {
      return {
        success: false,
        output: '文件读取仅支持Node.js环境',
        error: '浏览器环境不支持文件系统操作',
        type: 'text'
      };
    }

    const fs = await import('fs');
    const content = fs.readFileSync(path, 'utf-8');
    
    return {
      success: true,
      output: content,
      type: 'text'
    };
  } catch (error) {
    return {
      success: false,
      output: `读取文件失败: ${error instanceof Error ? error.message : '未知错误'}`,
      error: error instanceof Error ? error.message : '未知错误',
      type: 'text'
    };
  }
}

async function writeFile(path: string, content: string, append: boolean): Promise<ToolResult> {
  try {
    if (typeof window !== 'undefined') {
      return {
        success: false,
        output: '文件写入仅支持Node.js环境',
        error: '浏览器环境不支持文件系统操作',
        type: 'text'
      };
    }

    const fs = await import('fs');
    if (append) {
      fs.appendFileSync(path, content);
    } else {
      fs.writeFileSync(path, content);
    }

    return {
      success: true,
      output: `文件${append ? '追加' : '写入'}成功: ${path}`,
      type: 'text'
    };
  } catch (error) {
    return {
      success: false,
      output: `写入文件失败: ${error instanceof Error ? error.message : '未知错误'}`,
      error: error instanceof Error ? error.message : '未知错误',
      type: 'text'
    };
  }
}

async function listFiles(path: string): Promise<ToolResult> {
  try {
    if (typeof window !== 'undefined') {
      return {
        success: false,
        output: '文件列表仅支持Node.js环境',
        error: '浏览器环境不支持文件系统操作',
        type: 'text'
      };
    }

    const fs = await import('fs');
    const files = fs.readdirSync(path, { withFileTypes: true });
    
    const result = files.map(file => ({
      name: file.name,
      type: file.isDirectory() ? 'directory' : 'file',
      size: file.isFile() ? fs.statSync(`${path}/${file.name}`).size : 0
    }));

    return {
      success: true,
      output: JSON.stringify(result, null, 2),
      type: 'json'
    };
  } catch (error) {
    return {
      success: false,
      output: `读取目录失败: ${error instanceof Error ? error.message : '未知错误'}`,
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
