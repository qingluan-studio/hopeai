/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0a0e14',
          panel: '#0f1419',
          border: '#1a2332',
          accent: '#00ff88',
          accent2: '#00d4ff',
          accent3: '#ff00aa',
          text: '#e0e6ed',
          muted: '#6b7280',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'scan': 'scan 2s linear infinite',
        'typing': 'typing 0.8s steps(2) infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0,255,136,0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(0,255,136,0.6)' },
        },
        'scan': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'typing': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      }
    },
  },
  plugins: [],
}
