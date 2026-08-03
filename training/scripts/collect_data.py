#!/usr/bin/env python3
"""HopeAI 训练数据采集器 - 从HuggingFace收集开源中文数据集"""
import json, os, re, urllib.request, sys, random

DATA_DIR = os.path.join(os.path.dirname(__file__), "../data")
os.makedirs(DATA_DIR, exist_ok=True)

DATASETS = {
    "belle_0.5M": "https://huggingface.co/datasets/BelleGroup/train_0.5M_CN/resolve/main/Belle_open_source_0.5M.json",
    "alpaca_zh": "https://huggingface.co/datasets/shibing624/alpaca-zh/resolve/main/alpaca_gpt4_data_zh.json",
}

MAX_PER_SOURCE = 5000

def download_json(url, name):
    path = os.path.join(DATA_DIR, f"{name}.json")
    if os.path.exists(path) and os.path.getsize(path) > 1000:
        print(f"  {name}: 已存在 ({os.path.getsize(path)/1024:.0f}KB)")
        return path
    try:
        print(f"  下载 {name} ...")
        req = urllib.request.Request(url, headers={"User-Agent": "HopeAI-Training/0.1"})
        with urllib.request.urlopen(req, timeout=120) as r:
            data = r.read().decode("utf-8", errors="replace")
        with open(path, "w", encoding="utf-8") as f:
            f.write(data)
        print(f"  {name}: OK ({len(data)/1024:.0f}KB)")
        return path
    except Exception as e:
        print(f"  {name}: 失败 - {e}")
        return None

def unify_item(item, source):
    if not isinstance(item, dict): return None
    inst = item.get("instruction") or item.get("question") or item.get("prompt") or item.get("query") or ""
    inp = item.get("input") or item.get("context") or ""
    out = item.get("output") or item.get("answer") or item.get("response") or item.get("completion") or ""
    if not inst or not out: return None
    if len(inst) < 5 or len(out) < 10: return None
    inst = str(inst)[:1500]
    out = str(out)[:1500]
    inp = str(inp)[:500]
    return {"instruction": inst, "input": inp, "output": out, "source": source}

def process_files(paths):
    all_data = []
    for name, path in paths.items():
        if not path or not os.path.exists(path): continue
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        count = 0
        try:
            data = json.loads(content)
            if isinstance(data, list):
                random.shuffle(data)
                for item in data[:MAX_PER_SOURCE]:
                    u = unify_item(item, name)
                    if u: all_data.append(u); count += 1
            else: print(f"  {name}: 不是列表格式")
        except json.JSONDecodeError:
            lines = content.strip().split("\n")
            random.shuffle(lines)
            for line in lines[:MAX_PER_SOURCE]:
                try:
                    u = unify_item(json.loads(line), name)
                    if u: all_data.append(u); count += 1
                except: pass
        print(f"  {name}: 提取 {count} 条")

    random.shuffle(all_data)
    split = int(len(all_data) * 0.9)
    train, val = all_data[:split], all_data[split:]

    train_path = os.path.join(DATA_DIR, "train.json")
    val_path = os.path.join(DATA_DIR, "val.json")
    with open(train_path, "w", encoding="utf-8") as f:
        json.dump(train, f, ensure_ascii=False, indent=2)
    with open(val_path, "w", encoding="utf-8") as f:
        json.dump(val, f, ensure_ascii=False, indent=2)

    print(f"\n总计: {len(all_data)} (训练{len(train)} / 验证{len(val)})")
    print(f"训练集: {train_path}")
    print(f"验证集: {val_path}")
    return train_path, val_path

def main():
    print("=== HopeAI 训练数据采集 ===\n")
    paths = {}
    for name, url in DATASETS.items():
        p = download_json(url, name)
        if p: paths[name] = p

    if not paths:
        print("无可用数据源，生成模拟训练数据...")
        return generate_synthetic()

    print("\n处理数据...")
    process_files(paths)

def generate_synthetic():
    """生成模拟训练数据"""
    topics = ["人工智能", "机器学习", "深度学习", "神经网络", "自然语言处理",
              "计算机视觉", "强化学习", "大语言模型", "知识图谱", "数据科学",
              "Python编程", "算法", "数据结构", "分布式系统", "云计算"]
    templates = [
        ("{}是什么？请详细解释。", "{}是一种技术/概念，它主要涉及..."),
        ("{}的核心原理是什么？", "{}的核心原理包括几个方面：1) ..."),
        ("如何学习{}？给出步骤。", "学习{}的建议步骤：首先...然后...最后..."),
        ("{}有什么应用场景？", "{}的应用非常广泛，包括：医疗、金融、教育等领域..."),
        ("请对比{}和传统方法。", "{}相比传统方法的优势在于：效率更高、准确率更好..."),
        ("{}的发展历史是怎样的？", "{}的发展经历了几个关键阶段..."),
        ("{}常见的误解有哪些？", "关于{}的常见误解包括：1)...2)...3)..."),
    ]
    data = []
    for topic in topics:
        for tmpl_q, tmpl_a in templates:
            data.append({
                "instruction": tmpl_q.format(topic),
                "input": "",
                "output": tmpl_a.format(topic),
                "source": "synthetic"
            })

    train_path = os.path.join(DATA_DIR, "train.json")
    val_path = os.path.join(DATA_DIR, "val.json")
    split = int(len(data) * 0.9)
    with open(train_path, "w", encoding="utf-8") as f:
        json.dump(data[:split], f, ensure_ascii=False, indent=2)
    with open(val_path, "w", encoding="utf-8") as f:
        json.dump(data[split:], f, ensure_ascii=False, indent=2)
    print(f"生成合成数据 {len(data)} 条")
    print(f"训练集: {train_path}")
    print(f"验证集: {val_path}")

if __name__ == "__main__":
    main()
