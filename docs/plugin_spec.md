# HopeAI 插件开发规范 v2.0

## 插件是什么

一个 `.py` 文件，放在 `hopeai_data/plugins/` 下，实现 `HopePlugin` 协议类。框架通过 `importlib` 热加载，零重启即可生效。

## 协议

```python
class HopePlugin:
    """插件最低协议——只需要实现 name + run"""
    name: str            # 唯一标识，如 "weather" / "translator"
    version: str         # 语义化版本 "1.0.0"
    author: str          # 作者名
    description: str     # 一句话说明
    category: str        # 分类: tool / knowledge / multimodal / workflow

    def run(self, input_text: str, context: dict) -> dict:
        """
        输入: 用户文本 + 框架上下文（kb/retriever/session等）
        输出: {"ok": bool, "result": str, "meta": dict}
        """
        ...

    # 可选钩子
    def on_load(self): ...       # 加载时调用
    def on_unload(self): ...     # 卸载时调用
    def get_schema(self) -> dict:  # JSON Schema 描述输入输出
        ...
```

## 分类

| 分类 | 说明 | 示例 |
|---|---|---|
| `tool` | 工具类：计算器、翻译、天气查询 | calculator, translator |
| `knowledge` | 知识类：注入专业知识库 | medical_kb, legal_reference |
| `multimodal` | 多模态：图片识别、音频处理 | ocr_reader, audio_transcriber |
| `workflow` | 工作流：多步编排、外部API串联 | report_generator, data_pipeline |

## 多模态插件接口 (v2.0 新增)

对于 `multimodal` 类插件，额外支持：

```python
class MultimodalPlugin(HopePlugin):
    """多模态插件扩展协议"""
    category = "multimodal"

    def handle_image(self, image_path: str, prompt: str) -> dict:
        """处理图片输入，返回识别/分析结果"""
        ...

    def handle_audio(self, audio_path: str, task: str) -> dict:
        """处理音频输入，task: transcribe/analyze/classify"""
        ...
```

## 目录结构

```
hopeai_data/plugins/
├── __init__.py          # 空文件
├── official/            # 官方插件
│   ├── calculator.py
│   ├── web_search.py
│   └── translator.py
├── multimodal/          # 多模态插件
│   ├── ocr_basic.py
│   └── audio_classify.py
└── community/           # 社区插件（用户自行放入）
```

## 发布与分发

- 单个 `.py` 文件即插即用，无额外依赖
- 推荐在 GitHub 创建 `hopeai-plugin-xxx` 仓库
- 通过 PluginMarketplace 搜索/安装/卸载
- 支持从 URL 直接安装：`plugin install https://xxx/plugin.py`

## 安全

- 插件运行在受限命名空间，无法直接访问系统 IO
- 网络请求需声明（`requires_network = True`）
- 文件系统只读（通过 context 传入路径）
