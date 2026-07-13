import React from 'react'

interface BrandAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  animated?: boolean
  glow?: boolean
  className?: string
}

const sizeMap = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-20 h-20',
  '2xl': 'w-32 h-32',
}

const innerSizeMap = {
  xs: 'w-4 h-4',
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-11 h-11',
  xl: 'w-16 h-16',
  '2xl': 'w-28 h-28',
}

export default function BrandAvatar({ size = 'md', animated = false, glow = false, className = '' }: BrandAvatarProps) {
  return (
    <div
      className={`relative rounded-full flex items-center justify-center ${sizeMap[size]} ${className}`}
      style={{
        background: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 50%, #a855f7 100%)',
        padding: '2px',
        animation: animated ? 'spin 8s linear infinite' : undefined,
        boxShadow: glow ? '0 0 20px rgba(0,255,136,0.4)' : undefined,
      }}
    >
      <div className="w-full h-full rounded-full bg-[#0a0e14] flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 100 100" className={innerSizeMap[size]}>
          {/* 大脑轮廓 */}
          <path
            d="M50 15 C30 15, 18 30, 18 50 C18 70, 30 85, 50 85 C70 85, 82 70, 82 50 C82 30, 70 15, 50 15 Z"
            fill="none"
            stroke="#00ff88"
            strokeWidth="2.5"
            opacity="0.85"
          />

          {/* 神经网络节点 */}
          <circle cx="35" cy="35" r="4.5" fill="#00ff88" opacity="0.9">
            {animated && (
              <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
            )}
          </circle>
          <circle cx="65" cy="35" r="4.5" fill="#00d4ff" opacity="0.9">
            {animated && (
              <animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite" />
            )}
          </circle>
          <circle cx="50" cy="50" r="6" fill="#a855f7" opacity="0.9">
            {animated && (
              <animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" repeatCount="indefinite" />
            )}
          </circle>
          <circle cx="35" cy="65" r="3.5" fill="#00d4ff" opacity="0.7">
            {animated && (
              <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.2s" repeatCount="indefinite" />
            )}
          </circle>
          <circle cx="65" cy="65" r="3.5" fill="#00ff88" opacity="0.7">
            {animated && (
              <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.8s" repeatCount="indefinite" />
            )}
          </circle>
          <circle cx="28" cy="50" r="3" fill="#00ff88" opacity="0.5" />
          <circle cx="72" cy="50" r="3" fill="#00d4ff" opacity="0.5" />

          {/* 连接线 */}
          <line x1="35" y1="35" x2="50" y2="50" stroke="#00ff88" strokeWidth="1.2" opacity="0.6" />
          <line x1="65" y1="35" x2="50" y2="50" stroke="#00d4ff" strokeWidth="1.2" opacity="0.6" />
          <line x1="35" y1="65" x2="50" y2="50" stroke="#00d4ff" strokeWidth="1.2" opacity="0.5" />
          <line x1="65" y1="65" x2="50" y2="50" stroke="#00ff88" strokeWidth="1.2" opacity="0.5" />
          <line x1="35" y1="35" x2="28" y2="50" stroke="#00ff88" strokeWidth="0.8" opacity="0.3" />
          <line x1="65" y1="35" x2="72" y2="50" stroke="#00d4ff" strokeWidth="0.8" opacity="0.3" />
          <line x1="28" y1="50" x2="35" y2="65" stroke="#00ff88" strokeWidth="0.8" opacity="0.3" />
          <line x1="72" y1="50" x2="65" y2="65" stroke="#00d4ff" strokeWidth="0.8" opacity="0.3" />

          {/* 中心脉冲 */}
          {animated && (
            <circle cx="50" cy="50" r="10" fill="none" stroke="#a855f7" strokeWidth="1" opacity="0.5">
              <animate attributeName="r" values="6;14;6" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
            </circle>
          )}
        </svg>
      </div>

      {/* 在线状态点 */}
      {glow && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-[#0a0e14] animate-pulse" />
      )}
    </div>
  )
}

export function BrandWordmark({ className = '' }: { className?: string }) {
  return (
    <span
      className={`font-mono font-bold tracking-wider ${className}`}
      style={{
        background: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 50%, #a855f7 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      HopeAgent
    </span>
  )
}
