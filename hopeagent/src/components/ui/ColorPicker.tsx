import React, { useState, useRef, useEffect } from 'react'
import { Pipette } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============ 类型定义 ============
interface ColorPickerProps {
  /** 当前颜色（受控） */
  value?: string
  /** 默认颜色 */
  defaultValue?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 变化回调 */
  onChange?: (color: string) => void
  /** 自定义类名 */
  className?: string
}

// 预设调色板
const presetColors = [
  '#00ff88', '#00d4ff', '#ff00aa', '#f59e0b', '#ef4444',
  '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316',
  '#e0e6ed', '#6b7280', '#1a2332', '#0a0e14', '#ffffff',
]

// HEX 转 HSV
const hexToHsv = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  const s = max === 0 ? 0 : d / max
  return { h, s, v: max }
}

// HSV 转 HEX
const hsvToHex = (h: number, s: number, v: number) => {
  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c
  let r = 0, g = 0, b = 0
  if (h < 60) { r = c; g = x; b = 0 }
  else if (h < 120) { r = x; g = c; b = 0 }
  else if (h < 180) { r = 0; g = c; b = x }
  else if (h < 240) { r = 0; g = x; b = c }
  else if (h < 300) { r = x; g = 0; b = c }
  else { r = c; g = 0; b = x }
  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * Cyber 终端风格颜色选择器
 * - 调色板
 * - HSV 色相滑块
 */
export function ColorPicker({
  value,
  defaultValue = '#00ff88',
  disabled = false,
  onChange,
  className,
}: ColorPickerProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const [open, setOpen] = useState(false)
  const [hsv, setHsv] = useState(hexToHsv(currentValue))
  const containerRef = useRef<HTMLDivElement>(null)
  const svRef = useRef<HTMLDivElement>(null)

  // 点击外部关闭
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // 同步外部 value
  useEffect(() => {
    if (isControlled) setHsv(hexToHsv(currentValue))
  }, [value]) // eslint-disable-line

  // 处理 SV 区域点击拖动
  const handleSvInteraction = (e: React.MouseEvent | MouseEvent) => {
    if (!svRef.current || disabled) return
    const rect = svRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left))
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top))
    const s = x / rect.width
    const v = 1 - y / rect.height
    const next = { ...hsv, s, v }
    setHsv(next)
    const hex = hsvToHex(next.h, next.s, next.v)
    if (!isControlled) setInternalValue(hex)
    onChange?.(hex)
  }

  // 色相变化
  const handleHueChange = (h: number) => {
    const next = { ...hsv, h }
    setHsv(next)
    const hex = hsvToHex(next.h, next.s, next.v)
    if (!isControlled) setInternalValue(hex)
    onChange?.(hex)
  }

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      {/* 触发器 */}
      <div
        onClick={() => !disabled && setOpen(!open)}
        className={cn(
          'flex items-center gap-2 h-9 px-2 bg-cyber-bg border border-cyber-border rounded-lg cursor-pointer font-mono text-sm transition-all',
          open ? 'border-cyber-accent/60 ring-2 ring-cyber-accent/20' : 'hover:border-cyber-accent/30',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span
          className="w-5 h-5 rounded border border-white/20 flex-shrink-0"
          style={{ backgroundColor: currentValue, boxShadow: `0 0 8px ${currentValue}88` }}
        />
        <span className="text-cyber-text uppercase">{currentValue}</span>
      </div>

      {/* 面板 */}
      {open && (
        <div className="absolute z-50 mt-1 p-3 w-56 bg-cyber-panel border border-cyber-border rounded-lg shadow-[0_0_25px_rgba(0,255,136,0.15)] animate-scaleIn origin-top">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-accent/50 to-transparent" />
          {/* SV 区域 */}
          <div
            ref={svRef}
            onMouseDown={(e) => {
              handleSvInteraction(e)
              const move = (ev: MouseEvent) => handleSvInteraction(ev)
              const up = () => {
                document.removeEventListener('mousemove', move)
                document.removeEventListener('mouseup', up)
              }
              document.addEventListener('mousemove', move)
              document.addEventListener('mouseup', up)
            }}
            className="relative w-full h-32 rounded cursor-crosshair mb-2 overflow-hidden"
            style={{
              backgroundColor: hsvToHex(hsv.h, 1, 1),
              background: `linear-gradient(to right, #fff, ${hsvToHex(hsv.h, 1, 1)}), linear-gradient(to top, #000, transparent)`,
              backgroundBlendMode: 'multiply',
            }}
          >
            <div
              className="absolute w-3 h-3 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%` }}
            />
          </div>
          {/* 色相滑块 */}
          <div className="mb-3">
            <input
              type="range"
              min={0}
              max={360}
              value={hsv.h}
              onChange={(e) => handleHueChange(Number(e.target.value))}
              className="w-full h-2 appearance-none rounded-full cursor-pointer"
              style={{ background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)' }}
            />
          </div>
          {/* 预设色板 */}
          <div className="grid grid-cols-5 gap-1.5 mb-2">
            {presetColors.map((c) => (
              <button
                key={c}
                onClick={() => {
                  const newHsv = hexToHsv(c)
                  setHsv(newHsv)
                  if (!isControlled) setInternalValue(c)
                  onChange?.(c)
                }}
                className={cn(
                  'w-full aspect-square rounded border transition-all hover:scale-110',
                  currentValue === c ? 'border-white' : 'border-white/20'
                )}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          {/* 输入框 */}
          <div className="flex items-center gap-1 px-2 py-1 bg-cyber-bg border border-cyber-border rounded">
            <Pipette className="w-3 h-3 text-gray-500" />
            <input
              type="text"
              value={currentValue}
              onChange={(e) => {
                const v = e.target.value
                if (/^#[0-9a-fA-F]{6}$/.test(v)) {
                  setHsv(hexToHsv(v))
                  if (!isControlled) setInternalValue(v)
                  onChange?.(v)
                } else if (!isControlled) {
                  setInternalValue(v)
                }
              }}
              className="flex-1 bg-transparent outline-none text-xs font-mono text-cyber-text uppercase"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ColorPicker
