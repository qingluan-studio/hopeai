# HopeAI - 网元模型

> 模型不在手机上，整个中文互联网就是权重文件。
> 手机只跑调度内核，参数分散在互联网上实时获取。

## 快速开始（Day 1）

### 手机端

```bash
# Termux 中执行
pkg update && pkg upgrade -y
pkg install python git -y
git clone https://github.com/qingluan-studio/hopeai.git
cd hopeai
python hopeai.py
```

输入任意问题，即可与网元模型对话。

## 项目结构

```
hopeai/
├── hopeai.py              # 网元模型内核（<500行）
├── 三年AI构建计划.md       # 三年五阶段路线图
├── 虚拟模型架构设计.md     # 完整架构设计文档
└── README.md              # 本文件
```

## 核心理念

传统大模型把知识压缩进14GB权重文件，网元模型把知识留在互联网上，
用检索策略代替参数矩阵——免费、实时更新、可追溯来源。
