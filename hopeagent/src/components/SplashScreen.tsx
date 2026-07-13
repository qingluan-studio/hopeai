import { useState, useEffect } from 'react'
import { Sparkles, Cpu, Brain, Zap } from 'lucide-react'

interface SplashScreenProps {
  onComplete: () => void
  minDuration?: number
}

export default function SplashScreen({ onComplete, minDuration = 2500 }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(0)
  const [fadingOut, setFadingOut] = useState(false)

  const phases = [
    '正在初始化核心模块...',
    '正在加载超级大脑...',
    '正在连接神经突触...',
    '准备就绪',
  ]

  useEffect(() => {
    const startTime = Date.now()
    const totalSteps = 100
    const stepInterval = minDuration / totalSteps

    let currentProgress = 0
    const timer = setInterval(() => {
      currentProgress += Math.random() * 3 + 1
      if (currentProgress >= 100) {
        currentProgress = 100
        clearInterval(timer)
      }
      setProgress(Math.floor(currentProgress))

      if (currentProgress > 25 && phase < 1) setPhase(1)
      if (currentProgress > 55 && phase < 2) setPhase(2)
      if (currentProgress >= 100 && phase < 3) {
        setPhase(3)
        setTimeout(() => {
          setFadingOut(true)
          setTimeout(() => {
            onComplete()
          }, 600)
        }, 400)
      }
    }, stepInterval)

    return () => clearInterval(timer)
  }, [onComplete, minDuration, phase])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0e14] transition-opacity duration-500 ${
        fadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* 背景网格效果 */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* 径向光晕 */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(0,255,136,0.08) 0%, transparent 60%)',
        }}
      />

      {/* Logo 区域 */}
      <div className="relative z-10 flex flex-col items-center">
        {/* 主 Logo - Hope 头像 */}
        <div className="relative mb-8">
          {/* 外圈光环 */}
          <div
            className="absolute inset-0 rounded-full animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(0,255,136,0.3) 0%, transparent 70%)',
              transform: 'scale(1.5)',
            }}
          />

          {/* 旋转光环 */}
          <div
            className="relative w-28 h-28 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 50%, #a855f7 100%)',
              padding: '3px',
              animation: 'spin 8s linear infinite',
            }}
          >
            <div className="w-full h-full rounded-full bg-[#0a0e14] flex items-center justify-center">
              {/* 核心头像 - Hope */}
              <svg viewBox="0 0 100 100" className="w-20 h-20">
                {/* 大脑轮廓 */}
                <path
                  d="M50 15 C30 15, 18 30, 18 50 C18 70, 30 85, 50 85 C70 85, 82 70, 82 50 C82 30, 70 15, 50 15 Z"
                  fill="none"
                  stroke="#00ff88"
                  strokeWidth="2"
                  opacity="0.8"
                />
                {/* 神经网络节点 */}
                <circle cx="35" cy="35" r="4" fill="#00ff88" opacity="0.9">
                  <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="65" cy="35" r="4" fill="#00d4ff" opacity="0.9">
                  <animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="50" cy="50" r="5" fill="#a855f7" opacity="0.9">
                  <animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" repeatCount="indefinite" />
                </circle>
                <circle cx="35" cy="65" r="3" fill="#00d4ff" opacity="0.7">
                  <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.2s" repeatCount="indefinite" />
                </circle>
                <circle cx="65" cy="65" r="3" fill="#00ff88" opacity="0.7">
                  <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.8s" repeatCount="indefinite" />
                </circle>
                {/* 连接线 */}
                <line x1="35" y1="35" x2="50" y2="50" stroke="#00ff88" strokeWidth="1" opacity="0.5" />
                <line x1="65" y1="35" x2="50" y2="50" stroke="#00d4ff" strokeWidth="1" opacity="0.5" />
                <line x1="35" y1="65" x2="50" y2="50" stroke="#00d4ff" strokeWidth="1" opacity="0.4" />
                <line x1="65" y1="65" x2="50" y2="50" stroke="#00ff88" strokeWidth="1" opacity="0.4" />
                <line x1="35" y1="35" x2="65" y2="35" stroke="#00ff88" strokeWidth="0.5" opacity="0.3" />
                <line x1="35" y1="65" x2="65" y2="65" stroke="#00ff88" strokeWidth="0.5" opacity="0.3" />
              </svg>
            </div>
          </div>
        </div>

        {/* 品牌名 */}
        <div className="relative z-10 text-center mb-2">
          <h1
            className="text-4xl font-bold tracking-wider"
            style={{
              fontFamily: 'var(--font-mono)',
              background: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 50%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            HopeAgent
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-mono tracking-widest">
            SUPER · INTELLIGENCE · ENGINE
          </p>
        </div>

        {/* 标语 */}
        <div className="h-5 mb-6 flex items-center justify-center">
          <p
            className="text-sm text-cyber-text/60 font-mono transition-all duration-300"
            style={{ opacity: progress > 10 ? 1 : 0 }}
          >
            {phases[phase]}
          </p>
        </div>

        {/* 进度条 */}
        <div className="w-64 relative">
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #00ff88, #00d4ff, #a855f7)',
                boxShadow: '0 0 10px rgba(0,255,136,0.5)',
              }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-mono text-gray-600">
            <span>{progress}%</span>
            <span>v2.0</span>
          </div>
        </div>

        {/* 底部装饰 */}
        <div className="mt-10 flex items-center gap-4 text-gray-700">
          <Cpu className="w-4 h-4" style={{ opacity: progress > 20 ? 1 : 0.2 }} />
          <Brain className="w-4 h-4" style={{ opacity: progress > 50 ? 1 : 0.2 }} />
          <Zap className="w-4 h-4" style={{ opacity: progress > 75 ? 1 : 0.2 }} />
          <Sparkles className="w-4 h-4" style={{ opacity: progress >= 100 ? 1 : 0.2 }} />
        </div>
      </div>

      {/* 底部版权 */}
      <div className="absolute bottom-6 text-center">
        <p className="text-[10px] text-gray-700 font-mono">
          © 2025 HopeAgent Studio · All Rights Reserved
        </p>
      </div>
    </div>
  )
}
