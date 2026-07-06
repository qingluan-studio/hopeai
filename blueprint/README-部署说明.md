# 交付包说明 & 部署到 GitHub Pages

## 这个包里有什么

| 文件 | 用途 |
|---|---|
| `01-角色矩阵.md` | 75 个 AI 角色矩阵的前 10 个核心角色设计（编排层 2 + 交付层 3 + 底座层 3 + 治理层 2） |
| `02-API内容沉淀模板.md` | API 生成内容自动沉淀为可复用模板的全套规范（Markdown 模板 + JSON Schema + 沉淀流程 + 错题本联动） |
| `README-部署说明.md`（本文件） | 如何把这套东西推送到你的 GitHub Pages |

## 三种推送方式（选一种）

### 方式 A：你自己手动 push（最快，0 成本）

```bash
# 在你的本地
git clone https://github.com/qingluan-studio/hopeai.git
cd hopeai
mkdir -p pro/blueprint
# 把以下文件复制进去：
#   01-角色矩阵.md       → pro/blueprint/01-role-matrix.md
#   02-API内容沉淀模板.md → pro/blueprint/02-content-precipitation-template.md
#   README-部署说明.md    → pro/blueprint/README.md

git add pro/blueprint/
git commit -m "feat(blueprint): v1 角色矩阵 + API 沉淀模板"
git push origin main
# GitHub Pages 会自动部署，地址就是 https://qingluan-studio.github.io/hopeai/pro/blueprint/
```

### 方式 B：给我 GitHub 凭证，我直接 push

需要：
- 一个 GitHub Personal Access Token（PAT），勾选 `repo` 权限
- 把 token 通过我这边支持的方式安全传过来（不要直接贴在聊天里）

如果你愿意走这条，把 token 给我就行，下面这一行我就能跑完：
```bash
cd /workspace/hopeai-pro
git remote add origin https://<token>@github.com/qingluan-studio/hopeai.git
git push -u origin main
```

### 方式 C：用 GitHub Actions 自动同步（最长期主义，零交互）

把 `pro/` 目录当作 source of truth，仓库配一个 workflow：
- 监听 push 自动 build & deploy
- 我只需要编辑 `/workspace/hopeai-pro/pro/` 下的文件
- 你配一次 Actions，之后完全无感

需要的话我可以直接给你写好 `.github/workflows/deploy.yml` 文件。

---

## 建议的站点导航（推上去后用户能看到什么）

```
https://qingluan-studio.github.io/hopeai/pro/
├── /blueprint/             ← 本次交付（角色矩阵 + 沉淀模板）
├── /roles/                 ← 未来 75 个角色详情页（自动生成）
├── /templates/             ← 沉淀模板库（按 domain 分类）
├── /changelog/             ← 版本演进日志
└── /index.html             ← 入口页（推荐加上 GEO 友好的结构化数据）
```

---

## 免费额度核对清单（蓝图里所有"重资源"环节，都已对齐免费档）

| 需求 | 免费方案 | 配额 |
|---|---|---|
| 静态网站托管 | GitHub Pages / Cloudflare Pages / Vercel | 无限（合理流量） |
| LLM API | OpenRouter 免费模型 / Gemini Free / Ollama 本地 | 视厂商，有日/月免费层 |
| 向量库 | Chroma / Milvus Lite / Qdrant（本地版） | 无上限（吃本地资源） |
| 嵌入模型 | sentence-transformers / Ollama bge-small | 完全免费 |
| 对象存储 | Cloudflare R2 10GB / 自托管 MinIO | 10GB 免费 |
| 数据库 | SQLite / Supabase Free / Neon Free | 500MB / 0.5GB |
| 调度 | GitHub Actions | 2000 min/月 |
| CI/CD | GitHub Actions | 2000 min/月 |
| 安全审核 | LLM 自审 + 多个审核 API 免费层 | 月度免费调用 |
| GEO 监测 | Bing/Google Search Console + 自研爬虫 | 完全免费 |

**唯一会花钱的地方**：如果你最终选了 OpenAI/Anthropic 付费模型。蓝图本身不强依赖，能纯免费起跑。

---

## 我接下来等你哪个指令

A. **方式 B**：给我 GitHub PAT，我直接 push（我推荐）
B. **方式 A**：你自己 push，我同步给你执行清单
C. **方式 C**：我额外补 `.github/workflows/deploy.yml` 和 `index.html`，你一并 push
D. 蓝图里某个角色想再展开（比如「数据湖仓架构师」要 docker-compose 模板？），告诉我
