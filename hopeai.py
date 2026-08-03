#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
HopeAI 网元模型 v0.3.0 —— 进化版
Day 2-7 迭代整合：多源检索 + 深度意图 + 思维模板 + 上下文记忆 + 来源追溯 + Web界面

手机 Termux: python hopeai.py          # 命令行
手机 Termux: python hopeai.py --web     # Web服务（浏览器访问 http://localhost:8080）
"""

import json
import re
import time
import hashlib
import urllib.request
import urllib.parse
import urllib.error
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
import threading

# ============================================================
# 知识检索器
# ============================================================

class KnowledgeRetriever:
    """多源知识检索（Day 2: 扩展知识源）"""

    TIMEOUT = 8
    UA = "HopeAI/0.3"

    def __init__(self):
        self.sources = [
            ("wikipedia_zh", self._wiki_zh, 0.90),
            ("wikipedia_en", self._wiki_en, 0.75),
            ("ddg",         self._ddg,      0.80),
            ("arxiv",       self._arxiv,    0.70),
        ]

    def search(self, query, max_results=8):
        fragments = []
        for name, func, weight in self.sources:
            try:
                results = func(query)
                for r in results:
                    r["source_weight"] = weight
                fragments.extend(results)
            except Exception:
                pass

        fragments.sort(key=lambda x: x.get("score", 0) + x.get("source_weight", 0), reverse=True)

        seen = set()
        unique = []
        for f in fragments:
            key = f["snippet"][:80]
            if key not in seen:
                seen.add(key)
                unique.append(f)
        return unique[:max_results]

    def _fetch_json(self, url):
        req = urllib.request.Request(url, headers={"User-Agent": self.UA})
        with urllib.request.urlopen(req, timeout=self.TIMEOUT) as resp:
            return json.loads(resp.read().decode("utf-8"))

    def _wiki_zh(self, q):
        params = urllib.parse.urlencode({
            "action": "query", "list": "search",
            "srsearch": q, "format": "json", "srlimit": 3
        })
        data = self._fetch_json(f"https://zh.wikipedia.org/w/api.php?{params}")
        return [{
            "source": "wiki_zh", "title": r["title"],
            "snippet": re.sub(r"<[^>]+>", "", r.get("snippet", "")),
            "score": 0.9
        } for r in data.get("query", {}).get("search", [])]

    def _wiki_en(self, q):
        params = urllib.parse.urlencode({
            "action": "query", "list": "search",
            "srsearch": q, "format": "json", "srlimit": 2
        })
        data = self._fetch_json(f"https://en.wikipedia.org/w/api.php?{params}")
        return [{
            "source": "wiki_en", "title": r["title"],
            "snippet": re.sub(r"<[^>]+>", "", r.get("snippet", "")),
            "score": 0.7
        } for r in data.get("query", {}).get("search", [])]

    def _ddg(self, q):
        params = urllib.parse.urlencode({
            "q": q, "format": "json", "no_html": 1, "skip_disambig": 1
        })
        data = self._fetch_json(f"https://api.duckduckgo.com/?{params}")
        results = []
        if data.get("AbstractText"):
            results.append({
                "source": "ddg", "title": data.get("Heading", ""),
                "snippet": data["AbstractText"], "score": 0.85
            })
        for r in data.get("RelatedTopics", [])[:3]:
            if isinstance(r, dict) and "Text" in r:
                results.append({
                    "source": "ddg", "title": "",
                    "snippet": r["Text"], "score": 0.55
                })
        return results

    def _arxiv(self, q):
        """arXiv学术搜索"""
        params = urllib.parse.urlencode({
            "search_query": f"all:{q}", "start": 0, "max_results": 2
        })
        url = f"http://export.arxiv.org/api/query?{params}"
        req = urllib.request.Request(url, headers={"User-Agent": self.UA})
        with urllib.request.urlopen(req, timeout=self.TIMEOUT) as resp:
            text = resp.read().decode("utf-8")
        results = []
        for entry in text.split("<entry>")[1:]:
            title_m = re.search(r"<title>(.*?)</title>", entry)
            summary_m = re.search(r"<summary>(.*?)</summary>", entry)
            if summary_m:
                snippet = re.sub(r"\s+", " ", summary_m.group(1).strip())[:300]
                results.append({
                    "source": "arxiv", "title": title_m.group(1).strip() if title_m else "",
                    "snippet": snippet, "score": 0.65
                })
        return results


# ============================================================
# 意图分类器（Day 3: 强化版）
# ============================================================

class IntentClassifier:
    """多层意图分类"""

    PATTERNS = {
        "compare": {
            "keywords": ["vs", "对比", "区别", "哪个好", "比较", "优缺点", "选哪个", "还是", "差异"],
            "template": "compare"
        },
        "howto": {
            "keywords": ["怎么", "如何", "怎样", "步骤", "教程", "方法", "做法", "操作", "配置", "安装"],
            "template": "howto"
        },
        "why": {
            "keywords": ["为什么", "原因", "为何", "原理", "机制", "根源", "导致"],
            "template": "why"
        },
        "code": {
            "keywords": ["代码", "编程", "函数", "bug", "报错", "语法", "api", "库", "框架", "写一个"],
            "template": "code"
        },
        "define": {
            "keywords": ["是什么", "定义", "含义", "概念", "解释", "介绍一下", "说说"],
            "template": "define"
        },
        "history": {
            "keywords": ["历史", "起源", "发展", "演变", "由来", "时间线", "大事记"],
            "template": "history"
        },
        "recommend": {
            "keywords": ["推荐", "建议", "哪个", "选择", "方案", "排行", "前几名", "榜单"],
            "template": "recommend"
        },
        "future": {
            "keywords": ["未来", "趋势", "前景", "预测", "展望", "会怎样"],
            "template": "future"
        },
    }

    @classmethod
    def classify(cls, question):
        ql = question.lower()
        scores = {}
        for intent, cfg in cls.PATTERNS.items():
            scores[intent] = sum(1 for kw in cfg["keywords"] if kw in ql)
        best = max(scores, key=scores.get)
        if scores[best] == 0:
            return "fact", "fact"
        return best, cls.PATTERNS[best]["template"]


# ============================================================
# 思维模板库（Day 4）
# ============================================================

class ThoughtTemplateBank:
    """答案合成模板库"""

    @staticmethod
    def render(intent, fragments, question):
        method = getattr(ThoughtTemplateBank, f"_{intent}", ThoughtTemplateBank._fact)
        return method(fragments, question)

    @staticmethod
    def _fact(fragments, question):
        lines = [fragments[0]["snippet"]]
        extras = [f for f in fragments[1:] if len(f["snippet"]) > 30]
        if extras:
            lines.append("\n补充信息：")
            for e in extras[:3]:
                lines.append(f"· {e['snippet'][:200]}")
        ThoughtTemplateBank._add_source(lines, fragments)
        return "\n".join(lines)

    @staticmethod
    def _compare(fragments, question):
        lines = ["【多角度对比】", ""]
        for i, f in enumerate(fragments[:5]):
            if len(f["snippet"]) > 20:
                lines.append(f"{i+1}. {f['snippet'][:250]}")
                lines.append("")
        lines.append("建议结合实际场景选择。")
        ThoughtTemplateBank._add_source(lines, fragments)
        return "\n".join(lines)

    @staticmethod
    def _howto(fragments, question):
        lines = ["【操作指引】", ""]
        count = 0
        for f in fragments:
            if len(f["snippet"]) > 30:
                count += 1
                lines.append(f"{count}. {f['snippet'][:250]}")
                if count >= 5:
                    break
        if count == 0:
            lines.append(fragments[0]["snippet"][:300])
        lines.append("\n建议验证后再应用到生产环境。")
        ThoughtTemplateBank._add_source(lines, fragments)
        return "\n".join(lines)

    @staticmethod
    def _why(fragments, question):
        lines = ["【原因分析】", ""]
        for f in fragments[:4]:
            snippet = f["snippet"]
            if len(snippet) > 20:
                lines.append(f"· {snippet[:250]}")
        ThoughtTemplateBank._add_source(lines, fragments)
        return "\n".join(lines)

    @staticmethod
    def _code(fragments, question):
        lines = ["【编程参考】", ""]
        for f in fragments[:3]:
            if len(f["snippet"]) > 20:
                lines.append(f"· {f['snippet'][:300]}")
        lines.append("\n建议阅读官方文档并自行测试。")
        ThoughtTemplateBank._add_source(lines, fragments)
        return "\n".join(lines)

    @staticmethod
    def _define(fragments, question):
        lines = [fragments[0]["snippet"]]
        if len(fragments) > 1 and len(fragments[1]["snippet"]) > 30:
            lines.append(f"\n详细解释：{fragments[1]['snippet'][:250]}")
        ThoughtTemplateBank._add_source(lines, fragments)
        return "\n".join(lines)

    @staticmethod
    def _history(fragments, question):
        lines = ["【发展脉络】", ""]
        for f in fragments[:5]:
            if len(f["snippet"]) > 20:
                lines.append(f"· {f['snippet'][:250]}")
        ThoughtTemplateBank._add_source(lines, fragments)
        return "\n".join(lines)

    @staticmethod
    def _recommend(fragments, question):
        lines = ["【推荐分析】", ""]
        for i, f in enumerate(fragments[:5]):
            if len(f["snippet"]) > 20:
                lines.append(f"{i+1}. {f['snippet'][:250]}")
                lines.append("")
        ThoughtTemplateBank._add_source(lines, fragments)
        return "\n".join(lines)

    @staticmethod
    def _future(fragments, question):
        lines = ["【趋势展望】", ""]
        for i, f in enumerate(fragments[:4]):
            if len(f["snippet"]) > 20:
                lines.append(f"· {f['snippet'][:250]}")
        lines.append("\n以上为基于现有信息的推测，仅供参考。")
        ThoughtTemplateBank._add_source(lines, fragments)
        return "\n".join(lines)

    @staticmethod
    def _add_source(lines, fragments):
        """Day 6: 来源追溯"""
        sources = set()
        for f in fragments[:4]:
            src = f.get("title", "") or f.get("source", "")
            if src:
                sources.add(src)
        if sources:
            lines.append(f"\n—— 来源：{'、'.join(list(sources)[:3])}")


# ============================================================
# 上下文记忆（Day 5）
# ============================================================

class ContextMemory:
    """对话上下文管理"""

    def __init__(self, max_turns=8):
        self.history = []
        self.max_turns = max_turns

    def add(self, role, content):
        self.history.append({
            "role": role, "content": content,
            "time": datetime.now().isoformat()
        })
        if len(self.history) > self.max_turns * 2:
            self.history = self.history[-(self.max_turns * 2):]

    def get_context(self):
        return self.history[-6:] if len(self.history) > 6 else self.history

    def summarize(self):
        if not self.history:
            return ""
        topics = [h["content"][:50] for h in self.history if h["role"] == "user"]
        return "、".join(topics[-3:])

    def clear(self):
        self.history = []


# ============================================================
# 网元模型核心
# ============================================================

class HopeAI:
    """网元模型 v0.3.0"""

    def __init__(self):
        self.retriever = KnowledgeRetriever()
        self.classifier = IntentClassifier
        self.templates = ThoughtTemplateBank
        self.memory = ContextMemory()
        self.name = "HopeAI-网元"
        self.version = "0.3.0"
        self.stats = {"queries": 0, "total_time": 0.0}

    def ask(self, question):
        start = time.time()
        self.stats["queries"] += 1

        # 检查是否追问上下文
        context_q = self._enrich_with_context(question)

        # 意图分类
        intent, template = self.classifier.classify(context_q)

        # 知识检索
        fragments = self.retriever.search(context_q)

        # 合成答案
        if not fragments:
            answer = self._fallback(question)
        else:
            answer = self.templates.render(template, fragments, question)

        # 更新记忆
        self.memory.add("user", question)
        self.memory.add("assistant", answer)

        elapsed = time.time() - start
        self.stats["total_time"] += elapsed

        return answer, {
            "intent": intent, "sources": len(fragments),
            "time": f"{elapsed:.1f}s"
        }

    def _enrich_with_context(self, question):
        """用历史上下文增强问题"""
        ctx = self.memory.get_context()
        if not ctx:
            return question
        # 检查是否是省略追问（太短的问题可能是延续上文）
        if len(question) <= 8 and len(ctx) >= 2:
            last_topic = ctx[-2]["content"][:50]
            return f"{last_topic} {question}"
        return question

    def _fallback(self, question):
        responses = [
            "这个问题我需要更具体的关键词才能查到有效信息，可以换种方式描述吗？",
            "目前没找到足够的相关资料。可以试试用更精准的词？",
            "关于这个我暂时检索不到可靠信息。换个角度问也许有收获。",
        ]
        return responses[hash(question) % len(responses)]


# ============================================================
# Web 服务（Day 7）
# ============================================================

WEB_HTML = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>HopeAI 网元模型</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,sans-serif;background:#0d1117;color:#c9d1d9;max-width:720px;margin:0 auto;padding:16px;min-height:100vh}
.header{text-align:center;padding:20px 0;border-bottom:1px solid #30363d;margin-bottom:16px}
.header h1{color:#58a6ff;font-size:20px}
.header p{color:#8b949e;font-size:12px;margin-top:4px}
.chat{display:flex;flex-direction:column;gap:12px;margin-bottom:80px}
.msg{max-width:90%;padding:10px 14px;border-radius:12px;font-size:14px;line-height:1.6;white-space:pre-wrap;word-break:break-word}
.msg.user{align-self:flex-end;background:#238636;color:#fff}
.msg.ai{align-self:flex-start;background:#161b22;border:1px solid #30363d}
.msg .meta{font-size:10px;color:#8b949e;margin-top:6px}
.input-bar{position:fixed;bottom:0;left:0;right:0;max-width:720px;margin:0 auto;padding:12px 16px;background:#0d1117;border-top:1px solid #30363d;display:flex;gap:8px}
.input-bar input{flex:1;padding:10px 14px;border:1px solid #30363d;border-radius:20px;background:#161b22;color:#c9d1d9;font-size:14px;outline:none}
.input-bar input:focus{border-color:#58a6ff}
.input-bar button{padding:10px 20px;border:none;border-radius:20px;background:#238636;color:#fff;font-size:14px;cursor:pointer}
.input-bar button:active{opacity:.8}
.typing{color:#8b949e;font-size:12px;padding:4px 14px}
</style>
</head>
<body>
<div class="header"><h1>HopeAI 网元模型</h1><p>知识分散在互联网上 | v0.3.0</p></div>
<div class="chat" id="chat"></div>
<div class="input-bar">
<input id="q" placeholder="输入问题..." autofocus onkeydown="if(event.key==='Enter')ask()">
<button onclick="ask()">发送</button>
</div>
<script>
async function ask(){
 const q=document.getElementById('q');const t=q.value.trim();if(!t)return;
 addMsg('user',t);q.value='';
 const typing=addMsg('ai','…');
 try{
  const r=await fetch('/api/ask',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:t})});
  const d=await r.json();
  typing.innerHTML=d.answer.replace(/\\n/g,'<br>')+'<div class="meta">意图:'+d.meta.intent+' | 来源:'+d.meta.sources+'个 | '+d.meta.time+'</div>';
 }catch(e){typing.innerHTML='网络错误: '+e.message}
}
function addMsg(role,text){
 const d=document.createElement('div');d.className='msg '+role;
 d.innerHTML=text.replace(/\\n/g,'<br>');
 document.getElementById('chat').appendChild(d);
 window.scrollTo(0,document.body.scrollHeight);
 return d;
}
</script>
</body>
</html>"""

class WebHandler(BaseHTTPRequestHandler):
    ai = None

    def do_GET(self):
        if self.path == "/":
            self._respond(200, "text/html; charset=utf-8", WEB_HTML)
        elif self.path == "/api/stats":
            stats = self.ai.stats.copy()
            stats["avg_time"] = f"{stats['total_time']/max(1,stats['queries']):.1f}s"
            self._respond(200, "application/json", json.dumps(stats, ensure_ascii=False))
        else:
            self._respond(404, "text/plain", "404")

    def do_POST(self):
        if self.path == "/api/ask":
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length))
            q = body.get("question", "").strip()
            if not q:
                self._respond(400, "application/json", '{"error":"问题不能为空"}')
                return
            answer, meta = self.ai.ask(q)
            self._respond(200, "application/json",
                         json.dumps({"answer": answer, "meta": meta}, ensure_ascii=False))
        else:
            self._respond(404, "text/plain", "404")

    def _respond(self, code, content_type, body):
        self.send_response(code)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body.encode("utf-8"))

    def log_message(self, format, *args):
        pass


def run_web(ai):
    WebHandler.ai = ai
    server = HTTPServer(("0.0.0.0", 8080), WebHandler)
    print(f"\n  Web服务已启动: http://localhost:8080")
    print("  手机浏览器打开上面地址即可使用\n")
    server.serve_forever()


# ============================================================
# 启动入口
# ============================================================

def main():
    ai = HopeAI()

    import sys
    if "--web" in sys.argv:
        threading.Thread(target=run_web, args=(ai,), daemon=True).start()
        # 保持主线程
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n再见！")
            return

    # 命令行模式
    print("=" * 50)
    print(f"  {ai.name} v{ai.version}")
    print("  知识在互联网上，不需要下载模型")
    print("  命令: q=退出 | c=清空记忆 | s=统计 | --web=启动Web")
    print("=" * 50)

    while True:
        try:
            q = input("\n你：").strip()
        except (EOFError, KeyboardInterrupt):
            print("\n明天继续，再见！")
            break

        if q.lower() in ("q", "quit", "退出"):
            print("明天继续！")
            break
        if q.lower() in ("c", "clear", "清空"):
            ai.memory.clear()
            print("记忆已清空")
            continue
        if q.lower() in ("s", "stats", "统计"):
            s = ai.stats
            print(f"查询次数: {s['queries']} | 总耗时: {s['total_time']:.1f}s | "
                  f"平均: {s['total_time']/max(1,s['queries']):.1f}s/次")
            continue
        if q.lower() == "--web":
            print("启动Web服务...")
            threading.Thread(target=run_web, args=(ai,), daemon=True).start()
            try:
                while True:
                    time.sleep(1)
            except KeyboardInterrupt:
                print("\n再见！")
                break
        if not q:
            continue

        print("…", end="\r")
        answer, meta = ai.ask(q)
        print(f"\n网元：{answer}")
        print(f"      [{meta['intent']} | {meta['sources']}源 | {meta['time']}]")

if __name__ == "__main__":
    main()
