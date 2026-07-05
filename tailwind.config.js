/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        "cyber-bg": "#0a0a0f",
        "cyber-panel": "#0f0f1a",
        "cyber-border": "#1a1a2e",
        "neon-green": "#00ff88",
        "neon-blue": "#00d4ff",
        "neon-red": "#ff3366",
        "neon-yellow": "#ffaa00",
        "neon-purple": "#aa00ff",
        "text-primary": "#e0e0e0",
        "text-secondary": "#888899",
        "text-muted": "#555566",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      animation: {
        scanline: "scanline 6s linear infinite",
        flicker: "flicker 0.15s infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        typing: "typing 3.5s steps(40, end)",
        blink: "blink 1s step-end infinite",
        "matrix-rain": "matrix-rain 10s linear infinite",
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        glow: {
          "0%": { textShadow: "0 0 5px currentColor, 0 0 10px currentColor" },
          "100%": { textShadow: "0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor" },
        },
        typing: {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "matrix-rain": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
    },
  },
  plugins: [],
};
