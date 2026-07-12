import { useState, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check, Download, ChevronDown, ChevronUp, Link2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MarkdownRendererProps {
  content: string
  className?: string
}

// 代码块折叠阈值：超过此行数则可折叠
const CODE_COLLAPSE_THRESHOLD = 30

/** 代码块组件：语法高亮 + 复制 + 下载 + 长代码折叠 */
function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const lineCount = code.split('\n').length
  const canCollapse = lineCount > CODE_COLLAPSE_THRESHOLD
  // 折叠时只展示前 30 行
  const displayCode = canCollapse && collapsed
    ? code.split('\n').slice(0, CODE_COLLAPSE_THRESHOLD).join('\n')
    : code

  // 复制代码到剪贴板
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // 忽略剪贴板权限错误
    }
  }, [code])

  // 下载代码为文件
  const saveAsFile = useCallback(() => {
    const ext =
      language === 'typescript' || language === 'tsx' ? 'ts'
      : language === 'javascript' || language === 'jsx' ? 'js'
      : language === 'python' ? 'py'
      : language === 'rust' ? 'rs'
      : language === 'go' ? 'go'
      : language === 'java' ? 'java'
      : language === 'shell' || language === 'bash' ? 'sh'
      : language === 'json' ? 'json'
      : language === 'css' ? 'css'
      : language === 'html' ? 'html'
      : language || 'txt'
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `code_${Date.now()}.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }, [code, language])

  return (
    <div className="code-block-wrapper my-3 border border-cyber-border rounded-lg overflow-hidden">
      {/* 代码块头部：语言标签 + 操作按钮 */}
      <div className="code-block-header">
        <span className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyber-accent/60" />
          {language || 'text'}
          <span className="text-gray-600 ml-1">{lineCount} 行</span>
        </span>
        <div className="code-block-actions">
          <button className="code-block-btn flex items-center gap-1" onClick={copyToClipboard} title="复制代码">
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          </button>
          <button className="code-block-btn flex items-center gap-1" onClick={saveAsFile} title="下载文件">
            <Download className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 代码内容区 */}
      <div className="relative">
        <SyntaxHighlighter
          language={language || 'text'}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: '12px',
            fontSize: '12px',
            background: 'rgba(0,0,0,0.3)',
          }}
          codeTagProps={{ style: { fontFamily: 'JetBrains Mono, Fira Code, monospace' } }}
        >
          {displayCode}
        </SyntaxHighlighter>
        {/* 折叠时的渐变遮罩 + 展开按钮 */}
        {canCollapse && collapsed && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/90 to-transparent flex items-end justify-center pb-2">
            <button
              onClick={() => setCollapsed(false)}
              className="text-xs font-mono text-cyber-accent hover:text-cyber-accent2 flex items-center gap-1 px-2 py-1 rounded bg-black/60 border border-cyber-accent/30"
            >
              <ChevronDown className="w-3 h-3" />
              展开剩余 {lineCount - CODE_COLLAPSE_THRESHOLD} 行
            </button>
          </div>
        )}
      </div>

      {/* 收起按钮（展开状态下显示） */}
      {canCollapse && !collapsed && (
        <button
          onClick={() => setCollapsed(true)}
          className="w-full py-1 text-xs font-mono text-gray-500 hover:text-cyber-accent border-t border-cyber-border bg-black/20 flex items-center justify-center gap-1 transition-colors"
        >
          <ChevronUp className="w-3 h-3" />
          收起代码（共 {lineCount} 行）
        </button>
      )}
    </div>
  )
}

/**
 * 自定义 Markdown 渲染器
 * - 代码块用 react-syntax-highlighter（Prism + oneDark）
 * - 支持 GFM：表格、任务列表、删除线、自动链接
 * - 链接新窗口打开
 * - 图片自适应
 */
export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn('prose prose-invert prose-sm max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 代码块与行内代码
          code({ className: cls, children, ...props }) {
            const match = /language-(\w+)/.exec(cls || '')
            const codeString = String(children).replace(/\n$/, '')
            // 无 language- 前缀则视为行内代码
            if (!match) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded bg-cyber-accent/10 text-cyber-accent text-[0.9em] font-mono border border-cyber-accent/20"
                  {...props}
                >
                  {children}
                </code>
              )
            }
            return <CodeBlock code={codeString} language={match[1]} />
          },
          p({ children }) {
            return <p className="mb-2 last:mb-0 leading-relaxed text-gray-200">{children}</p>
          },
          h1({ children }) {
            return <h1 className="text-xl font-bold mb-3 text-cyber-accent glow-text">{children}</h1>
          },
          h2({ children }) {
            return <h2 className="text-lg font-bold mb-2 text-cyan-400 border-b border-cyber-border pb-1">{children}</h2>
          },
          h3({ children }) {
            return <h3 className="text-base font-bold mb-2 text-blue-400">{children}</h3>
          },
          h4({ children }) {
            return <h4 className="text-sm font-bold mb-1.5 text-purple-400">{children}</h4>
          },
          ul({ children }) {
            return <ul className="list-disc list-inside mb-2 space-y-1 text-gray-200 marker:text-cyber-accent">{children}</ul>
          },
          ol({ children }) {
            return <ol className="list-decimal list-inside mb-2 space-y-1 text-gray-200 marker:text-cyber-accent">{children}</ol>
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-2 border-cyber-accent/50 pl-3 my-2 text-gray-400 italic bg-cyber-accent/5 py-1 rounded-r">
                {children}
              </blockquote>
            )
          },
          // 表格美化：横向滚动 + cyber 风格表头
          table({ children }) {
            return (
              <div className="overflow-x-auto my-3 border border-cyber-border rounded-lg">
                <table className="w-full border-collapse text-sm">{children}</table>
              </div>
            )
          },
          thead({ children }) {
            return <thead className="bg-cyber-accent/5">{children}</thead>
          },
          th({ children }) {
            return <th className="border border-cyber-border px-3 py-1.5 text-left text-cyber-accent font-mono text-xs uppercase tracking-wider">{children}</th>
          },
          td({ children }) {
            return <td className="border border-cyber-border px-3 py-1.5 text-gray-300">{children}</td>
          },
          // 链接：新窗口打开 + 外链图标
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyber-accent2 hover:text-cyber-accent underline decoration-dotted inline-flex items-center gap-0.5"
              >
                {children}
                <Link2 className="w-3 h-3 inline flex-shrink-0" />
              </a>
            )
          },
          // 图片自适应
          img({ src, alt }) {
            return <img src={src} alt={alt} className="max-w-full h-auto rounded-lg border border-cyber-border my-2" loading="lazy" />
          },
          hr() {
            return <hr className="my-4 border-cyber-border" />
          },
          strong({ children }) {
            return <strong className="font-bold text-white">{children}</strong>
          },
          em({ children }) {
            return <em className="text-cyan-300 not-italic font-medium">{children}</em>
          },
          // 删除线（GFM）
          del({ children }) {
            return <del className="text-gray-500 line-through">{children}</del>
          },
          // 任务列表复选框
          input({ checked, ...props }) {
            return (
              <input
                type="checkbox"
                checked={checked}
                readOnly
                className="mr-1.5 accent-cyber-accent align-middle"
                {...props}
              />
            )
          },
          // 任务列表项
          li({ checked, children, ...props }: any) {
            // 带有 checked 属性的是任务列表项
            if (checked !== undefined && checked !== null) {
              return (
                <li className="flex items-start gap-1 list-none" {...props}>
                  <input type="checkbox" checked={checked} readOnly className="mt-1 accent-cyber-accent" />
                  <span className={checked ? 'line-through text-gray-500' : 'text-gray-200'}>{children}</span>
                </li>
              )
            }
            return <li className="leading-relaxed" {...props}>{children}</li>
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
