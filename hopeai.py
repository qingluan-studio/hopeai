#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
HopeAI 网元模型内核 —— 分散在互联网上的虚拟AI
手机 Termux 上 python hopeai.py 即可运行
不到500行，零依赖（仅用Python标准库）
"""

import json
import re
import urllib.request
import urllib.parse
import urllib.error
from datetime import datetime

class WebNeuronModel:
    """网元模型 —— 把中文互联网当成权重文件"""

    def __init__(self):
        self.name = "HopeAI-网元"
        self.version = "0.1.0"
        self.source_weights = {
            "wikipedia": 0.90,
            "wikipedia_zh": 0.90,
            "ddg_abstract": 0.85,
            "ddg_related": 0.60,
            "unknown": 0.40
        }
        self.timeout = 8

    # ==================== 主入口 ====================

    def ask(self, question):
        """问任何问题，返回答案"""
        intent = self._classify_intent(question)
        fragments = self._retrieve_knowledge(question)
        if not fragments:
            return self._fallback_response(question)
        return self._synthesize(fragments, intent, question)

    # ==================== 意图分类 ====================

    def _classify_intent(self, q):
        patterns = {
            "compare":  ["vs", "对比", "区别", "哪个好", "比较", "优缺点", "选哪个"],
            "howto":    ["怎么", "如何", "怎样", "步骤", "教程", "方法", "做法"],
            "why":      ["为什么", "原因", "为何", "原理", "机制"],
            "code":     ["代码", "编程", "python", "java", "js", "函数", "bug", "报错"],
            "define":   ["是什么", "定义", "含义", "概念", "解释"],
            "history":  ["历史", "起源", "发展", "演变", "由来"],
            "recommend":["推荐", "建议", "哪个", "选择", "方案"],
        }
        ql = q.lower()
        scores = {}
        for intent, keywords in patterns.items():
            scores[intent] = sum(1 for kw in keywords if kw in ql)
        best = max(scores, key=scores.get)
        return best if scores[best] > 0 else "fact"

    # ==================== 知识检索 ====================

    def _retrieve_knowledge(self, q):
        fragments = []
        fragments.extend(self._search_wiki_zh(q))
        fragments.extend(self._search_ddg(q))
        fragments.sort(key=lambda x: x["score"], reverse=True)
        seen = set()
        unique = []
        for f in fragments:
            key = f["snippet"][:80]
            if key not in seen:
                seen.add(key)
                unique.append(f)
        return unique[:6]

    def _search_wiki_zh(self, q):
        """中文维基百科"""
        try:
            params = urllib.parse.urlencode({
                "action": "query", "list": "search",
                "srsearch": q, "format": "json",
                "srlimit": 3, "srprop": "snippet"
            })
            url = f"https://zh.wikipedia.org/w/api.php?{params}"
            req = urllib.request.Request(url, headers={"User-Agent": "HopeAI/0.1"})
            with urllib.request.urlopen(req, timeout=self.timeout) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                results = []
                for r in data.get("query", {}).get("search", []):
                    results.append({
                        "source": "wikipedia_zh",
                        "title": r["title"],
                        "snippet": self._strip_html(r.get("snippet", "")),
                        "score": self.source_weights["wikipedia_zh"]
                    })
                return results
        except Exception:
            return []

    def _search_ddg(self, q):
        """DuckDuckGo Instant Answer"""
        try:
            params = urllib.parse.urlencode({
                "q": q, "format": "json",
                "no_html": 1, "skip_disambig": 1
            })
            url = f"https://api.duckduckgo.com/?{params}"
            req = urllib.request.Request(url, headers={"User-Agent": "HopeAI/0.1"})
            with urllib.request.urlopen(req, timeout=self.timeout) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                results = []
                if data.get("AbstractText"):
                    results.append({
                        "source": "ddg_abstract",
                        "title": data.get("Heading", ""),
                        "snippet": data["AbstractText"],
                        "score": self.source_weights["ddg_abstract"]
                    })
                for r in data.get("RelatedTopics", [])[:3]:
                    if isinstance(r, dict) and "Text" in r:
                        results.append({
                            "source": "ddg_related",
                            "title": "",
                            "snippet": r["Text"],
                            "score": self.source_weights["ddg_related"]
                        })
                return results
        except Exception:
            return []

    # ==================== 答案合成 ====================

    def _synthesize(self, fragments, intent, question):
        if not fragments:
            return self._fallback_response(question)

        templates = {
            "compare":  self._synthesize_compare,
            "howto":    self._synthesize_howto,
            "why":      self._synthesize_why,
            "code":     self._synthesize_code,
            "define":   self._synthesize_define,
            "history":  self._synthesize_history,
            "recommend":self._synthesize_compare,
            "fact":     self._synthesize_fact,
        }
        synthesizer = templates.get(intent, self._synthesize_fact)
        return synthesizer(fragments, question)

    def _synthesize_fact(self, fragments, question):
        lines = []
        best = fragments[0]
        lines.append(best["snippet"])
        if len(fragments) > 1:
            extra = [f["snippet"] for f in fragments[1:] if len(f["snippet"]) > 30]
            if extra:
                lines.append("")
                lines.append("补充信息：")
                for e in extra[:3]:
                    lines.append(f"· {e[:200]}")
        if best.get("title"):
            lines.append(f"\n—— 来源：{best['title']}")
        return "\n".join(lines)

    def _synthesize_compare(self, fragments, question):
        lines = ["从几个方面来看：", ""]
        for i, f in enumerate(fragments[:4]):
            if len(f["snippet"]) > 20:
                lines.append(f"{i+1}. {f['snippet'][:250]}")
                lines.append("")
        lines.append("建议结合自己的实际需求做选择。")
        return "\n".join(lines)

    def _synthesize_howto(self, fragments, question):
        lines = ["根据检索到的信息，可以这样来做：", ""]
        for i, f in enumerate(fragments[:5]):
            snippet = f["snippet"]
            if len(snippet) > 30:
                lines.append(f"第{i+1}步参考：{snippet[:250]}")
        if len(lines) == 2:
            lines.append(fragments[0]["snippet"][:300])
        lines.append("\n建议实际操作前多对比几种方法。")
        return "\n".join(lines)

    def _synthesize_why(self, fragments, question):
        lines = ["原因分析：", ""]
        for i, f in enumerate(fragments[:4]):
            snippet = f["snippet"]
            if len(snippet) > 20:
                lines.append(f"· {snippet[:250]}")
        return "\n".join(lines) if len(lines) > 2 else fragments[0]["snippet"]

    def _synthesize_code(self, fragments, question):
        lines = ["关于这个问题：", ""]
        for f in fragments[:3]:
            if len(f["snippet"]) > 20:
                lines.append(f"· {f['snippet'][:300]}")
        lines.append("\n建议在具体环境中测试后再使用。")
        return "\n".join(lines)

    def _synthesize_define(self, fragments, question):
        best = fragments[0]
        lines = [best["snippet"]]
        if len(fragments) > 1 and len(fragments[1]["snippet"]) > 30:
            lines.append("")
            lines.append(f"更详细的解释：{fragments[1]['snippet'][:250]}")
        return "\n".join(lines)

    def _synthesize_history(self, fragments, question):
        lines = ["发展脉络：", ""]
        for i, f in enumerate(fragments[:4]):
            if len(f["snippet"]) > 20:
                lines.append(f"· {f['snippet'][:250]}")
        return "\n".join(lines) if len(lines) > 2 else fragments[0]["snippet"]

    # ==================== 工具方法 ====================

    def _strip_html(self, text):
        return re.sub(r"<[^>]+>", "", text).replace("&quot;", '"').replace("&amp;", "&")

    def _fallback_response(self, question):
        responses = [
            "这个问题我需要联网查一下，但目前没找到合适的信息源。能换种方式再描述一下吗？",
            "没查到足够的相关信息。可以试试用更具体的关键词？",
            "关于这个，我暂时没有找到可靠的资料。换个角度问也许能有收获。",
        ]
        idx = hash(question) % len(responses)
        return responses[idx]

# ==================== 启动入口 ====================

def main():
    ai = WebNeuronModel()
    print("=" * 50)
    print(f"  {ai.name} v{ai.version}")
    print("  知识就在互联网上，不需要下载模型")
    print("=" * 50)
    print("输入问题开始对话，输入 q 退出\n")

    while True:
        try:
            q = input("你：").strip()
        except (EOFError, KeyboardInterrupt):
            print("\n再见！")
            break

        if q.lower() in ("q", "quit", "退出"):
            print("明天继续，再见！")
            break
        if not q:
            continue

        print("…", end="\r")
        answer = ai.ask(q)
        print(f"\n网元：{answer}\n")

if __name__ == "__main__":
    main()
