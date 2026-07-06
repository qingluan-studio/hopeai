# 「API 生成内容自动沉淀」标准模板规范 v1

> 目标：把任意一次 API（LLM/图像/音视频）产出，自动捕获、评估、优选 → 沉淀为可复用的标准化模板，写入知识库。
> 全免费栈：模板本体为 Markdown + YAML front-matter；辅助存一份 JSON Schema 给程序读。

---

## 一、模板文件结构（一份 .md）

```markdown
---
# ===== 标识层 =====
template_id: TPL-2026-0001                 # 唯一编号（年份+流水）
template_slug: customer-reply-apologize     # 人类可读 slug（用于 URL）
version: 1                                  # 版本号，迭代自增
parent_template_id: TPL-2026-0000          # 若衍生自其他模板，填父；否则留空
created_at: 2026-07-06T17:00:00+08:00
updated_at: 2026-07-06T17:00:00+08:00
status: active | draft | deprecated         # 状态机

# ===== 来源层（自动捕获，无需手填） =====
source:
  api_provider: openai | anthropic | google | 自研 | ...
  model: gpt-4o-mini
  api_call_id: chatcmpl-xxxx                # 厂商返回的 id
  prompt_hash: sha256:ab12...                # 入参哈希，方便回放
  full_params:                              # 完整可复现参数
    temperature: 0.7
    top_p: 1.0
    max_tokens: 800
  session_id: sess-xxxx
  user_id_hash: sha256:ef34...              # 脱敏后的用户标识

# ===== 评估层（多角色打分） =====
quality:
  score: 0.92                               # 0~1 综合分
  rubric:                                   # 维度拆解
    relevance: 0.95
    accuracy: 0.90
    reusability: 0.93
    safety: 1.00
  evaluator: self-evolution-mentor          # 由哪个角色评
  human_review: approved | rejected | none
  reviewer_id_hash: sha256:...

# ===== 检索/归类层 =====
taxonomy:
  domain: customer-service                   # 业务域
  scenario: apologetic-reply                 # 应用场景
  tags: [道歉, 客户关系, 高情商, 短文本]
  language: zh-CN
  format: markdown
  estimated_tokens: 320
  audience: B2C 普通用户

# ===== 复用层 =====
reuse:
  triggers:                                 # 什么意图会触发
    - "用户抱怨物流"
    - "用户要求退款未果"
  inputs_schema:                            # 模板的输入变量定义
    - name: complaint_text
      type: string
      required: true
    - name: brand_voice
      type: enum
      values: [warm, neutral, formal]
      default: warm
  outputs_description: |
    给客户的致歉回复，3 段式：共情 → 解释 → 补救。
  example_io:                               # 至少 1 个 示例输入→输出
    - input: {complaint_text: "等了 15 天还没到", brand_voice: warm}
      output: |
        非常抱歉让您久等了……（示例输出）
  related_templates: [TPL-2026-0002, TPL-2026-0003]
---

# {{ template_slug }} · {{ "场景一句话描述" }}

## 使用场景
> 一句话讲清楚什么时候调这个模板。

## 提示词模板（Prompt Template）
```
你是 {{ 角色 }}。
输入变量：
- complaint_text: {{ 用户投诉原文 }}
- brand_voice: {{ warm | neutral | formal }}

要求：
1. 第一段：共情，不超过 2 句
2. 第二段：解释原因，不甩锅
3. 第三段：给出补救方案 + 时间承诺

输出 Markdown，不要 YAML 头。
```

## 注意事项
- 不要出现"作为 AI"等暴露身份的措辞
- 数字与时间必须与输入一致，禁止幻觉
- 若 brand_voice=formal，第二人称改用"您"

## 变更日志
- v1 (2026-07-06): 初版，由「客户回复 · 致歉」场景蒸馏
```

---

## 二、JSON Schema（给程序读）

把上面的 front-matter 抽象成 schema，方便前端/后端统一校验。文件路径建议：`/templates/schema/v1.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://qingluan-studio.github.io/hopeai/pro/templates/schema/v1.json",
  "title": "HopeAI Generated Content Template",
  "type": "object",
  "required": ["template_id", "template_slug", "version", "source", "quality", "taxonomy", "reuse"],
  "properties": {
    "template_id": { "type": "string", "pattern": "^TPL-\\d{4}-\\d{4,}$" },
    "version": { "type": "integer", "minimum": 1 },
    "parent_template_id": { "type": ["string", "null"] },
    "status": { "enum": ["active", "draft", "deprecated"] },
    "source": {
      "type": "object",
      "required": ["api_provider", "model", "prompt_hash"],
      "properties": {
        "api_provider": { "type": "string" },
        "model": { "type": "string" },
        "prompt_hash": { "type": "string" },
        "full_params": { "type": "object" }
      }
    },
    "quality": {
      "type": "object",
      "required": ["score"],
      "properties": {
        "score": { "type": "number", "minimum": 0, "maximum": 1 },
        "evaluator": { "type": "string" }
      }
    },
    "taxonomy": {
      "type": "object",
      "required": ["domain", "scenario"],
      "properties": {
        "domain": { "type": "string" },
        "scenario": { "type": "string" },
        "tags": { "type": "array", "items": { "type": "string" } }
      }
    },
    "reuse": {
      "type": "object",
      "required": ["triggers", "inputs_schema"],
      "properties": {
        "inputs_schema": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["name", "type"],
            "properties": {
              "name": { "type": "string" },
              "type": { "type": "string" },
              "required": { "type": "boolean" }
            }
          }
        }
      }
    }
  }
}
```

---

## 三、沉淀触发流程（何时把一次产出"晋升"为模板）

```
[API 产出]
   ↓
[自动捕获] → 写 raw_output 到 /staging/<hash>.md（含完整 front-matter 但 status=draft）
   ↓
[自动评估] → 由「自进化导师」按 rubric 打 4 维分
   ↓
   ├─ score >= 0.85  → 进入人工抽检队列
   ├─ score 0.6~0.85 → 留在 staging，下次同类产出对账
   └─ score < 0.6   → 进「错题本」（不沉淀）
   ↓
[人工抽检通过] → status=active, 写入 /templates/active/
   ↓
[向量化] → 走 Chroma（走 RAG 角色 7 号位）
   ↓
[可发现] → 下次相似意图进来，自动 top-K 推荐
```

---

## 四、错题本联动（必须配套）

任何 **不进模板** 的高质量失败/边缘案例，必须进错题本：

```markdown
---
case_id: ERR-2026-0007
template_id_attempted: TPL-2026-0001
failure_mode: hallucination-fact
severity: high
input_hash: sha256:...
root_cause: 模型对"15 天"具体天数置信度低，但被温度 0.7 推到输出
fix_proposal: 温度降到 0.3；新增"必须引用输入数字"硬约束
status: open | fixed | wontfix
---
```

错题本每周由「自进化导师」review，触发模板迭代。

---

## 五、与现有角色的接口

| 触发源 | 下游沉淀动作 | 关联角色 |
|---|---|---|
| 全栈代码工匠的代码产出 | 经抽象后进 `code-snippet` 模板库 | 3 → 10 |
| 文案大师的优质文案 | 进对应场景模板 | 4 → 10 |
| RAG 检索专家的高频命中内容 | 提炼为「标准答案」模板 | 7 → 10 → 8 |
| GEO 优化师的引用块 | 进 `ai-citation` 模板 | 8 → 10 |

---

## 六、最小可启动版本（今晚就能跑）

不需要等 75 个角色上线，先把这套模板跑通：

1. **第 1 周**：上线「文案大师 → 沉淀」闭环（角色 4 + 角色 10 的最小切片）
2. **第 2 周**：把评分 rubric 做到 4 维，覆盖 ≥3 个高频场景
3. **第 3 周**：上线错题本 + 模板迭代闭环
4. **第 4 周**：全量上线，向量化层接入

技术栈全免费：
- 模板存储：仓库 `/templates/` 目录（Git 天然版本化，零成本）
- 元数据索引：SQLite 单文件
- 向量：Chroma 本地
- 调度：GitHub Actions（免费 2000 min/月）
- 部署：GitHub Pages（免费）

---

> 这是 v1，欢迎反馈哪条规则要改。我把 schema 和流程都留了扩展点。
