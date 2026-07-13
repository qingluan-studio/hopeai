import React, { useState, useRef, useCallback } from 'react'
import { UploadCloud, File, X, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
interface UploadFile {
  /** 唯一 id */
  uid: string
  /** 文件名 */
  name: string
  /** 文件大小 */
  size?: number
  /** 状态 */
  status?: 'uploading' | 'done' | 'error' | 'removed'
  /** 进度（0-100） */
  percent?: number
  /** 预览 URL */
  url?: string
  /** 原始文件 */
  originFileObj?: File
}

interface UploadProps {
  /** 是否支持多选 */
  multiple?: boolean
  /** 接受的文件类型 */
  accept?: string
  /** 是否支持拖拽 */
  draggable?: boolean
  /** 是否显示列表 */
  showList?: boolean
  /** 最大文件数 */
  maxCount?: number
  /** 上传方法 */
  customRequest?: (file: UploadFile) => void | Promise<void>
  /** 变化回调 */
  onChange?: (fileList: UploadFile[]) => void
  /** 自定义类名 */
  className?: string
}

// 格式化文件大小
const formatSize = (bytes?: number): string => {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

/**
 * Cyber 终端风格文件上传
 * - 拖拽上传
 * - 文件预览
 * - 上传进度
 */
export function Upload({
  multiple = false,
  accept,
  draggable = false,
  showList = true,
  maxCount,
  customRequest,
  onChange,
  className,
}: UploadProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // 更新文件列表
  const updateList = useCallback(
    (next: UploadFile[]) => {
      setFileList(next)
      onChange?.(next)
    },
    [onChange]
  )

  // 处理文件
  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return
      let newFiles = Array.from(files)
      if (!multiple) newFiles = [newFiles[0]]
      if (maxCount) {
        const remain = maxCount - fileList.length
        newFiles = newFiles.slice(0, Math.max(0, remain))
      }

      const uploadItems: UploadFile[] = newFiles.map((file) => ({
        uid: `file_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        size: file.size,
        status: 'uploading',
        percent: 0,
        originFileObj: file,
      }))

      const nextList = [...fileList, ...uploadItems]
      updateList(nextList)

      // 模拟上传或调用自定义请求
      uploadItems.forEach((item) => {
        if (customRequest) {
          customRequest(item)
        } else {
          // 模拟进度
          let percent = 0
          const timer = setInterval(() => {
            percent += Math.random() * 30
            if (percent >= 100) {
              percent = 100
              clearInterval(timer)
              updateList(
                nextList.map((f) =>
                  f.uid === item.uid ? { ...f, percent: 100, status: 'done' } : f
                )
              )
            } else {
              updateList(
                nextList.map((f) =>
                  f.uid === item.uid ? { ...f, percent } : f
                )
              )
            }
          }, 200)
        }
      })
    },
    [multiple, maxCount, fileList, customRequest, updateList]
  )

  // 移除文件
  const removeFile = (uid: string) => {
    updateList(fileList.filter((f) => f.uid !== uid))
  }

  // 点击触发
  const handleClick = () => inputRef.current?.click()

  // 拖拽事件
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  // 隐藏 input
  const hiddenInput = (
    <input
      ref={inputRef}
      type="file"
      className="hidden"
      multiple={multiple}
      accept={accept}
      onChange={(e) => {
        handleFiles(e.target.files)
        e.target.value = ''
      }}
    />
  )

  return (
    <div className={cn('w-full', className)}>
      {hiddenInput}

      {/* 触发区 */}
      {draggable ? (
        <div
          onClick={handleClick}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            'flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed rounded-lg cursor-pointer transition-all',
            dragOver
              ? 'border-cyber-accent bg-cyber-accent/10 shadow-[0_0_20px_rgba(0,255,136,0.2)]'
              : 'border-cyber-border hover:border-cyber-accent/50 hover:bg-cyber-accent/5'
          )}
        >
          <UploadCloud className={cn('w-8 h-8', dragOver ? 'text-cyber-accent' : 'text-gray-500')} />
          <div className="text-sm font-mono text-gray-400">
            点击或拖拽文件到此处上传
          </div>
          {accept && <div className="text-xs text-gray-600 font-mono">支持: {accept}</div>}
        </div>
      ) : (
        <button
          onClick={handleClick}
          className="inline-flex items-center gap-2 h-9 px-4 bg-cyber-panel border border-cyber-border rounded-lg text-sm font-mono text-cyber-text hover:border-cyber-accent/50 hover:bg-cyber-accent/5 transition-all"
        >
          <UploadCloud className="w-4 h-4 text-cyber-accent" />
          上传文件
        </button>
      )}

      {/* 文件列表 */}
      {showList && fileList.length > 0 && (
        <div className="mt-3 flex flex-col gap-1.5">
          {fileList.map((file) => (
            <div
              key={file.uid}
              className="flex items-center gap-2 px-3 py-2 bg-cyber-panel/40 border border-cyber-border rounded-lg animate-fadeIn"
            >
              <File className="w-4 h-4 text-cyber-accent flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-mono text-cyber-text truncate">{file.name}</span>
                  <span className="text-xs text-gray-500 font-mono flex-shrink-0">
                    {formatSize(file.size)}
                  </span>
                </div>
                {/* 进度条 */}
                {file.status === 'uploading' && (
                  <div className="mt-1 h-1 bg-cyber-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyber-accent transition-all duration-200"
                      style={{ width: `${file.percent}%`, boxShadow: '0 0 6px #00ff88' }}
                    />
                  </div>
                )}
              </div>
              {/* 状态图标 */}
              {file.status === 'done' && <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
              {file.status === 'error' && <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
              <button
                onClick={() => removeFile(file.uid)}
                className="text-gray-500 hover:text-red-400 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Upload
