---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 535e6cf2ea35338f2f8ee920767f5b27_160fbf27908211f1a102525400826444
    ReservedCode1: /eNtz3lVatnFoaGznch7Wm8wkshiM6PKxix7bUvj4yrmdWzJPY0XRSH7ar+4gL7HmzU6rEDNe0yzpDxqELomyW+NGAQkvFE6Z0pnxLfTr9Q2pb8BVKGnQYyjm1+V6Npk4KkYDgGAxz/GDJOpjgs7V3Tw1o4jznml40vwxYMRYyPtVe86/noOQBY8O0E=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 535e6cf2ea35338f2f8ee920767f5b27_160fbf27908211f1a102525400826444
    ReservedCode2: /eNtz3lVatnFoaGznch7Wm8wkshiM6PKxix7bUvj4yrmdWzJPY0XRSH7ar+4gL7HmzU6rEDNe0yzpDxqELomyW+NGAQkvFE6Z0pnxLfTr9Q2pb8BVKGnQYyjm1+V6Npk4KkYDgGAxz/GDJOpjgs7V3Tw1o4jznml40vwxYMRYyPtVe86/noOQBY8O0E=
---

# HopeAI - 网元智能

> 模型不在手机上，整个中文互联网就是权重文件。
> 前端 React + TypeScript，后端双引擎：Python 网元模型 + Vercel Serverless API。

## 在线体验

[![Deploy to GitHub Pages](https://img.shields.io/github/actions/workflow/status/qingluan-studio/hopeai/deploy.yml?label=GitHub%20Pages)](https://qingluan-studio.github.io/hopeai)

## 项目结构

```
hopeai/
├── src/                    # React 前端源码
│   ├── components/         # UI 组件
│   ├── engine/             # 前端推理引擎
│   ├── hooks/              # React Hooks
│   ├── lib/                # 工具库
│   ├── pages/              # 页面组件
│   ├── services/           # API 服务层
│   ├── store/              # Zustand 状态管理
│   └── types/              # TypeScript 类型定义
├── hopeai.py               # Python 网元模型引擎（独立部署）
├── api/                    # Vercel Serverless API（Node/TypeScript）
│   ├── app.ts              # Express 应用入口
│   ├── server.ts           # 本地开发服务器
│   └── routes/             # API 路由
│       ├── auth.ts         # 认证
│       ├── agent.ts        # Agent 管理
│       ├── chat.ts         # 对话接口
│       ├── deploy.ts       # 部署管理
│       ├── knowledge.ts    # 知识库
│       └── scheduler.ts    # 定时任务
├── public/                 # 静态资源
├── index.html              # 入口 HTML
├── package.json            # 前端依赖与脚本
├── vite.config.ts          # Vite 构建配置
├── vercel.json             # Vercel 部署配置
├── .github/workflows/      # CI/CD
│   └── deploy.yml          # GitHub Pages 自动部署
└── README.md               # 本文件
```

## 双引擎架构

| 引擎 | 语言 | 用途 | 部署方式 |
|------|------|------|----------|
| `hopeai.py` | Python 3 | 网元模型内核：互联网实时检索 + 图谱 + 蒸馏 + 插件系统 | 本地 / 任意 VPS |
| `api/` | TypeScript | Web API：认证、对话、知识库、Agent 管理、定时任务 | Vercel Serverless |

## 快速开始

### 前端开发

```bash
git clone https://github.com/qingluan-studio/hopeai.git
cd hopeai
pnpm install
pnpm dev          # 同时启动前端(5173) + API(3001)
```

### Python 引擎

```bash
python hopeai.py
```

### 仅 API 服务器

```bash
cd api
npx tsx server.ts
```

## 构建部署

```bash
pnpm build        # 输出到 dist/
```

- **GitHub Pages**：推送后自动通过 Actions 部署（见 `.github/workflows/deploy.yml`）
- **Vercel**：`vercel.json` 已配置，连接仓库即可一键部署

## 核心理念

传统大模型把知识压缩进 14GB 权重文件，网元模型把知识留在互联网上，用检索策略代替参数矩阵——免费、实时更新、可追溯来源。
*（内容由AI生成，仅供参考）*
