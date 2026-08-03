#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
HopeAI 网元模型 v0.4.0
Day 8-15 迭代：本地知识库 + 自学习 + 缓存 + 插件 + 个性化 + 语音

手机 Termux:
  python hopeai.py              # 命令行
  python hopeai.py --web        # Web界面 http://localhost:8080
  python hopeai.py --learn      # 启动夜间学习模式
"""

import json, re, time, os, hashlib, sqlite3, random
import urllib.request, urllib.parse, urllib.error
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from collections import OrderedDict
import threading
import math

# ============================================================
# 配置
# ============================================================

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "hopeai_data")
os.makedirs(DATA_DIR, exist_ok=True)

# ============================================================
# Day 8: 本地知识库（SQLite）
# ============================================================

class LocalKnowledgeBase:
    """本地知识库 —— 高频问答秒回，无需联网"""

    def __init__(self, db_path=None):
        db_path = db_path or os.path.join(DATA_DIR, "knowledge.db")
        self.conn = sqlite3.connect(db_path, check_same_thread=False)
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS knowledge (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                keywords TEXT,
                category TEXT,
                source TEXT,
                hits INTEGER DEFAULT 0,
                helpful INTEGER DEFAULT 0,
                unhelpful INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS embeddings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                knowledge_id INTEGER,
                keyword TEXT,
                weight REAL DEFAULT 1.0,
                FOREIGN KEY (knowledge_id) REFERENCES knowledge(id)
            )
        """)
        self.conn.execute("CREATE INDEX IF NOT EXISTS idx_knowledge_keywords ON knowledge(keywords)")
        self.conn.execute("CREATE INDEX IF NOT EXISTS idx_embeddings_keyword ON embeddings(keyword)")
        self.conn.commit()

    def search(self, query, limit=3):
        """关键词搜索"""
        words = self._tokenize(query)
        if not words:
            return []
        # 构建OR查询
        conditions = " OR ".join(["keywords LIKE ?" for _ in words])
        params = [f"%{w}%" for w in words]
        sql = f"""
            SELECT id, question, answer, category, hits, helpful, unhelpful
            FROM knowledge WHERE {conditions}
            ORDER BY hits DESC, helpful DESC LIMIT ?
        """
        rows = self.conn.execute(sql, params + [limit]).fetchall()
        results = []
        for r in rows:
            results.append({
                "id": r[0], "question": r[1], "answer": r[2],
                "category": r[3], "hits": r[4],
                "helpful": r[5], "unhelpful": r[6],
                "score": self._calc_score(r[4], r[5], r[6])
            })
            self.conn.execute("UPDATE knowledge SET hits = hits + 1 WHERE id = ?", (r[0],))
        self.conn.commit()
        results.sort(key=lambda x: x["score"], reverse=True)
        return results

    def add(self, question, answer, category=None, source="manual"):
        """添加知识"""
        keywords = " ".join(self._tokenize(question))
        self.conn.execute(
            "INSERT INTO knowledge (question, answer, keywords, category, source) VALUES (?,?,?,?,?)",
            (question, answer, keywords, category, source)
        )
        self.conn.commit()
        return self.conn.execute("SELECT last_insert_rowid()").fetchone()[0]

    def feedback(self, knowledge_id, is_helpful):
        """Day 9: 反馈学习"""
        col = "helpful" if is_helpful else "unhelpful"
        self.conn.execute(f"UPDATE knowledge SET {col} = {col} + 1 WHERE id = ?", (knowledge_id,))
        self.conn.commit()

    def get_stats(self):
        rows = self.conn.execute("SELECT COUNT(*), SUM(hits), SUM(helpful), SUM(unhelpful) FROM knowledge").fetchone()
        return {"total": rows[0] or 0, "hits": rows[1] or 0, "helpful": rows[2] or 0, "unhelpful": rows[3] or 0}

    def export_qa(self, limit=500):
        """导出高质量问答对用于训练"""
        rows = self.conn.execute(
            "SELECT question, answer FROM knowledge WHERE helpful > unhelpful AND helpful >= 1 ORDER BY helpful DESC LIMIT ?",
            (limit,)
        ).fetchall()
        return [{"question": r[0], "answer": r[1]} for r in rows]

    def _tokenize(self, text):
        """中文分词（简化：按字+词分割）"""
        # 提取有意义的词元
        tokens = []
        # 英文单词
        tokens.extend(re.findall(r'[a-zA-Z]+', text.lower()))
        # 中文2-3字词组
        chinese = re.sub(r'[^\u4e00-\u9fff]', '', text)
        for i in range(len(chinese)):
            if i + 1 < len(chinese):
                tokens.append(chinese[i:i+2])
            if i + 2 < len(chinese):
                tokens.append(chinese[i:i+3])
        tokens.append(chinese)  # 全字串
        return list(set(t for t in tokens if len(t) >= 2))

    def _calc_score(self, hits, helpful, unhelpful):
        """质量评分"""
        total_feedback = helpful + unhelpful
        if total_feedback == 0:
            return min(hits * 0.1, 0.8)
        ratio = helpful / total_feedback
        return ratio * 0.7 + min(hits * 0.02, 0.3)


# ============================================================
# Day 10: 智能缓存
# ============================================================

class SmartCache:
    """LRU缓存 + 热度淘汰"""

    def __init__(self, max_size=200):
        self.cache = OrderedDict()
        self.max_size = max_size
        self.hits = 0
        self.misses = 0

    def get(self, key):
        key = self._hash_key(key)
        if key in self.cache:
            self.cache.move_to_end(key)
            self.hits += 1
            return self.cache[key]
        self.misses += 1
        return None

    def set(self, key, value):
        key = self._hash_key(key)
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.max_size:
            self.cache.popitem(last=False)

    def _hash_key(self, key):
        return hashlib.md5(key.encode()).hexdigest()[:12]

    def stats(self):
        total = self.hits + self.misses
        rate = self.hits / max(1, total) * 100
        return {"hits": self.hits, "misses": self.misses, "rate": f"{rate:.1f}%", "size": len(self.cache)}


# ============================================================
# Day 11-12: 插件系统
# ============================================================

class PluginSystem:
    """可扩展插件框架"""

    def __init__(self):
        self.plugins = {}
        self._register_builtins()

    def _register_builtins(self):
        self.register("calc", self._calc, "数学计算", ["计算", "等于", "多少", "算一下"])
        self.register("time", self._time_now, "当前时间", ["现在几点", "今天日期", "当前时间", "几点了"])
        self.register("translate", self._translate_basic, "简单翻译", ["翻译", "英文怎么说", "中文怎么说"])
        self.register("weather_hint", self._weather_hint, "天气提示", ["天气", "温度", "下雨", "热不热"])
        self.register("joke", self._joke, "笑话", ["讲个笑话", "段子", "搞笑", "幽默"])

    def register(self, name, func, description, triggers):
        self.plugins[name] = {"func": func, "desc": description, "triggers": triggers}

    def match(self, question):
        for name, cfg in self.plugins.items():
            for t in cfg["triggers"]:
                if t in question:
                    return name, cfg["func"]
        return None, None

    def _calc(self, question):
        """安全数学计算"""
        # 提取数学表达式
        expr = re.sub(r'[^0-9+\-*/().%^ ]', '', question)
        expr = expr.strip()
        if not expr:
            return None
        try:
            expr = expr.replace('^', '**')
            result = eval(expr, {"__builtins__": {}}, {"math": math})
            return f"计算结果：{result}"
        except:
            return None

    def _time_now(self, question):
        now = datetime.now()
        weekdays = ["一", "二", "三", "四", "五", "六", "日"]
        return f"现在是 {now.year}年{now.month}月{now.day}日 星期{weekdays[now.weekday()]} {now.strftime('%H:%M:%S')}"

    def _translate_basic(self, question):
        """基础翻译（关键词触发）"""
        # 简化：提取中文词返回英文提示
        cn = re.findall(r'[\u4e00-\u9fff]+', question)
        if cn:
            word = cn[-1]
            return f"'{word}' 的英文翻译建议使用翻译工具查看更准确的结果。如果你有具体词汇想翻译，请直接告诉我。"
        return None

    def _weather_hint(self, question):
        return "天气查询需要获取您的位置授权。请在手机设置中允许位置权限后重试。也可以直接搜索'城市名+天气'获取最新信息。"

    def _joke(self, question):
        jokes = [
            "程序员的冷笑话：为什么程序员不喜欢户外活动？——因为太阳光太强，看不清屏幕的黑色背景。",
            "AI的笑话：一个AI走进酒吧，酒保问要喝什么，AI说：'正在分析中……检测到357种饮品，推荐概率最高的是——一杯温水。'",
            "为什么数学书总是很忧郁？——因为它有太多问题。",
            "两个字符串走进酒吧，第一个说：'你好，我是"你好"'。第二个说：'等一下，你好像有点问题……'",
            "产品经理问程序员：'这个功能今天能做完吗？'程序员：'能。'产品经理：'那我再加五个功能。'程序员：'不能。'",
        ]
        return random.choice(jokes)


# ============================================================
# Day 13-14: 个性化引擎
# ============================================================

class PersonaEngine:
    """用户个性化风格调整"""

    STYLES = {
        "default":  {"prefix": "", "suffix": "", "verbose": 1.0},
        "concise":  {"prefix": "", "suffix": "", "verbose": 0.5},
        "detailed": {"prefix": "让我详细分析一下：\n\n", "suffix": "\n\n希望这个详细的解答对你有帮助！", "verbose": 1.5},
        "friendly": {"prefix": "嘿！", "suffix": "😊 有什么都可以问我！", "verbose": 1.0},
        "academic": {"prefix": "根据检索结果，分析如下：\n\n", "suffix": "\n\n以上分析基于当前检索到的信息。", "verbose": 1.2},
        "coder":    {"prefix": "```\n// 代码分析\n```\n\n", "suffix": "\n\n// 建议测试后使用", "verbose": 0.8},
    }

    def __init__(self):
        self.current_style = "default"
        self.user_name = ""

    def set_style(self, style):
        if style in self.STYLES:
            self.current_style = style
            return f"风格已切换为：{style}"
        return f"可选风格：{', '.join(self.STYLES.keys())}"

    def wrap(self, answer):
        cfg = self.STYLES[self.current_style]
        # 根据verbose系数截断
        if cfg["verbose"] < 1.0 and len(answer) > 300:
            lines = answer.split("\n")
            keep = max(2, int(len(lines) * cfg["verbose"]))
            answer = "\n".join(lines[:keep]) + "\n..."
        return f"{cfg['prefix']}{answer}{cfg['suffix']}"

    def list_styles(self):
        return "\n".join([f"  {k}: {v['prefix'][:20]}..." for k, v in self.STYLES.items()])


# ============================================================
# Day 15: 语音支持（框架）
# ============================================================

class VoiceSupport:
    """语音输入输出框架"""

    @staticmethod
    def speech_to_text_hint():
        return (
            "语音输入需要安装依赖：\n"
            "  pkg install sox\n"
            "  pip install SpeechRecognition\n"
            "目前请使用文本输入。"
        )

    @staticmethod
    def text_to_speech_hint():
        return "语音输出功能开发中，目前请阅读文本回复。"


# ============================================================
# 知识检索器（扩展版）
# ============================================================

class KnowledgeRetriever:
    TIMEOUT = 8
    UA = "HopeAI/0.4"

    def __init__(self):
        self.sources = [
            ("wiki_zh", self._wiki_zh, 0.90),
            ("wiki_en", self._wiki_en, 0.75),
            ("ddg",     self._ddg,     0.80),
            ("arxiv",   self._arxiv,   0.70),
            ("github",  self._github,  0.60),
        ]

    def search(self, query, max_results=8):
        fragments = []
        for name, func, weight in self.sources:
            try:
                results = func(query)
                for r in results:
                    r["source_weight"] = weight
                fragments.extend(results)
            except:
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
        params = urllib.parse.urlencode({"action": "query", "list": "search", "srsearch": q, "format": "json", "srlimit": 3})
        data = self._fetch_json(f"https://zh.wikipedia.org/w/api.php?{params}")
        return [{"source": "wiki_zh", "title": r["title"], "snippet": re.sub(r"<[^>]+>", "", r.get("snippet", "")), "score": 0.9}
                for r in data.get("query", {}).get("search", [])]

    def _wiki_en(self, q):
        params = urllib.parse.urlencode({"action": "query", "list": "search", "srsearch": q, "format": "json", "srlimit": 2})
        data = self._fetch_json(f"https://en.wikipedia.org/w/api.php?{params}")
        return [{"source": "wiki_en", "title": r["title"], "snippet": re.sub(r"<[^>]+>", "", r.get("snippet", "")), "score": 0.7}
                for r in data.get("query", {}).get("search", [])]

    def _ddg(self, q):
        params = urllib.parse.urlencode({"q": q, "format": "json", "no_html": 1, "skip_disambig": 1})
        data = self._fetch_json(f"https://api.duckduckgo.com/?{params}")
        results = []
        if data.get("AbstractText"):
            results.append({"source": "ddg", "title": data.get("Heading", ""), "snippet": data["AbstractText"], "score": 0.85})
        for r in data.get("RelatedTopics", [])[:3]:
            if isinstance(r, dict) and "Text" in r:
                results.append({"source": "ddg", "title": "", "snippet": r["Text"], "score": 0.55})
        return results

    def _arxiv(self, q):
        params = urllib.parse.urlencode({"search_query": f"all:{q}", "start": 0, "max_results": 2})
        url = f"http://export.arxiv.org/api/query?{params}"
        req = urllib.request.Request(url, headers={"User-Agent": self.UA})
        with urllib.request.urlopen(req, timeout=self.TIMEOUT) as resp:
            text = resp.read().decode("utf-8")
        results = []
        for entry in text.split("<entry>")[1:]:
            title_m = re.search(r"<title>(.*?)</title>", entry)
            summary_m = re.search(r"<summary>(.*?)</summary>", entry)
            if summary_m:
                results.append({"source": "arxiv", "title": title_m.group(1).strip() if title_m else "",
                                "snippet": re.sub(r"\s+", " ", summary_m.group(1).strip())[:300], "score": 0.65})
        return results

    def _github(self, q):
        """GitHub仓库搜索"""
        params = urllib.parse.urlencode({"q": q, "per_page": 2, "sort": "stars"})
        url = f"https://api.github.com/search/repositories?{params}"
        req = urllib.request.Request(url, headers={"User-Agent": self.UA, "Accept": "application/vnd.github.v3+json"})
        try:
            with urllib.request.urlopen(req, timeout=self.TIMEOUT) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            results = []
            for item in data.get("items", []):
                results.append({"source": "github", "title": item["full_name"],
                                "snippet": f"{item.get('description','')} (⭐{item.get('stargazers_count',0)})",
                                "score": 0.6})
            return results
        except:
            return []


# ============================================================
# 意图分类
# ============================================================

class IntentClassifier:
    PATTERNS = {
        "compare":    ["vs", "对比", "区别", "哪个好", "比较", "优缺点", "选哪个", "还是", "差异"],
        "howto":      ["怎么", "如何", "怎样", "步骤", "教程", "方法", "做法", "操作", "配置", "安装"],
        "why":        ["为什么", "原因", "为何", "原理", "机制", "根源"],
        "code":       ["代码", "编程", "函数", "bug", "报错", "语法", "api", "库", "框架", "写一个"],
        "define":     ["是什么", "定义", "含义", "概念", "解释", "介绍一下"],
        "history":    ["历史", "起源", "发展", "演变", "由来", "时间线"],
        "recommend":  ["推荐", "建议", "排行", "前几名", "榜单"],
        "future":     ["未来", "趋势", "前景", "预测", "展望"],
        "relation":   ["关系", "联系", "影响", "相互作用", "关联"],
    }

    @classmethod
    def classify(cls, question):
        ql = question.lower()
        scores = {}
        for intent, keywords in cls.PATTERNS.items():
            scores[intent] = sum(1 for kw in keywords if kw in ql)
        best = max(scores, key=scores.get)
        return (best, best) if scores[best] > 0 else ("fact", "fact")


# ============================================================
# 思维模板
# ============================================================

class ThoughtTemplateBank:
    @staticmethod
    def render(intent, fragments, question):
        method = getattr(ThoughtTemplateBank, f"_{intent}", ThoughtTemplateBank._fact)
        return method(fragments, question)

    @staticmethod
    def _fact(fragments, question):
        lines = [fragments[0]["snippet"]]
        extras = [f for f in fragments[1:] if len(f["snippet"]) > 30]
        if extras:
            lines.append("\n补充：")
            for e in extras[:3]:
                lines.append(f"· {e['snippet'][:200]}")
        ThoughtTemplateBank._source(lines, fragments)
        return "\n".join(lines)

    @staticmethod
    def _compare(fragments, question):
        lines = ["【对比分析】", ""]
        for i, f in enumerate(fragments[:5]):
            if len(f["snippet"]) > 20:
                lines.append(f"{i+1}. {f['snippet'][:250]}")
                lines.append("")
        lines.append("建议结合实际场景选择。")
        ThoughtTemplateBank._source(lines, fragments)
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
        lines.append("\n建议验证后再使用。")
        ThoughtTemplateBank._source(lines, fragments)
        return "\n".join(lines)

    @staticmethod
    def _why(fragments, question):
        lines = ["【原因分析】", ""]
        for f in fragments[:4]:
            if len(f["snippet"]) > 20:
                lines.append(f"· {f['snippet'][:250]}")
        ThoughtTemplateBank._source(lines, fragments)
        return "\n".join(lines)

    @staticmethod
    def _code(fragments, question):
        lines = ["【编程参考】", ""]
        for f in fragments[:3]:
            if len(f["snippet"]) > 20:
                lines.append(f"· {f['snippet'][:300]}")
        lines.append("\n建议阅读官方文档并测试。")
        ThoughtTemplateBank._source(lines, fragments)
        return "\n".join(lines)

    @staticmethod
    def _define(fragments, question):
        lines = [fragments[0]["snippet"]]
        if len(fragments) > 1 and len(fragments[1]["snippet"]) > 30:
            lines.append(f"\n详细：{fragments[1]['snippet'][:250]}")
        ThoughtTemplateBank._source(lines, fragments)
        return "\n".join(lines)

    @staticmethod
    def _history(fragments, question):
        lines = ["【发展脉络】", ""]
        for f in fragments[:5]:
            if len(f["snippet"]) > 20:
                lines.append(f"· {f['snippet'][:250]}")
        ThoughtTemplateBank._source(lines, fragments)
        return "\n".join(lines)

    @staticmethod
    def _recommend(fragments, question):
        lines = ["【推荐】", ""]
        for i, f in enumerate(fragments[:5]):
            if len(f["snippet"]) > 20:
                lines.append(f"{i+1}. {f['snippet'][:250]}")
                lines.append("")
        ThoughtTemplateBank._source(lines, fragments)
        return "\n".join(lines)

    @staticmethod
    def _future(fragments, question):
        lines = ["【趋势展望】", ""]
        for i, f in enumerate(fragments[:4]):
            if len(f["snippet"]) > 20:
                lines.append(f"· {f['snippet'][:250]}")
        lines.append("\n以上为基于现有信息的推测，仅供参考。")
        ThoughtTemplateBank._source(lines, fragments)
        return "\n".join(lines)

    @staticmethod
    def _relation(fragments, question):
        lines = ["【关联分析】", ""]
        for f in fragments[:4]:
            if len(f["snippet"]) > 20:
                lines.append(f"· {f['snippet'][:250]}")
        ThoughtTemplateBank._source(lines, fragments)
        return "\n".join(lines)

    @staticmethod
    def _source(lines, fragments):
        sources = set()
        for f in fragments[:4]:
            src = f.get("title") or f.get("source", "")
            if src:
                sources.add(src)
        if sources:
            lines.append(f"\n—— 来源：{'、'.join(list(sources)[:3])}")


# ============================================================
# 上下文记忆
# ============================================================

class ContextMemory:
    def __init__(self, max_turns=10):
        self.history = []
        self.max_turns = max_turns
        self.topics = []

    def add(self, role, content):
        self.history.append({"role": role, "content": content, "time": datetime.now().isoformat()})
        if len(self.history) > self.max_turns * 2:
            self.history = self.history[-(self.max_turns * 2):]
        if role == "user":
            self.topics.append(content[:30])
            if len(self.topics) > 5:
                self.topics = self.topics[-5:]

    def enrich(self, question):
        """用上下文增强问题"""
        if len(self.history) < 2:
            return question
        if len(question) <= 8 and self.history:
            last = self.history[-2]["content"][:50]
            return f"{last} {question}"
        return question

    def clear(self):
        self.history = []
        self.topics = []

    def summary(self):
        return " → ".join(self.topics[-5:]) if self.topics else ""


# ============================================================
# HopeAI 核心
# ============================================================

class HopeAI:
    def __init__(self):
        self.retriever = KnowledgeRetriever()
        self.knowledge_base = LocalKnowledgeBase()
        self.cache = SmartCache()
        self.plugins = PluginSystem()
        self.persona = PersonaEngine()
        self.memory = ContextMemory()
        self.name = "HopeAI-网元"
        self.version = "0.4.0"
        self.stats = {"queries": 0, "local": 0, "cache": 0, "plugins": 0, "remote": 0, "total_time": 0.0}
        self.learning_mode = False

    def ask(self, question):
        start = time.time()
        self.stats["queries"] += 1

        # 1. 检查特殊命令
        cmd_result = self._check_commands(question)
        if cmd_result is not None:
            return cmd_result, {"intent": "command", "sources": 0, "time": f"{time.time()-start:.1f}s"}

        # 2. 检查插件
        plugin_name, plugin_func = self.plugins.match(question)
        if plugin_func:
            result = plugin_func(question)
            if result:
                self.stats["plugins"] += 1
                self.memory.add("user", question)
                self.memory.add("assistant", result)
                return result, {"intent": "plugin", "sources": 0, "time": f"{time.time()-start:.1f}s", "plugin": plugin_name}

        # 3. 缓存检查
        cached = self.cache.get(question)
        if cached:
            self.stats["cache"] += 1
            self.memory.add("user", question)
            self.memory.add("assistant", cached)
            return cached, {"intent": "fact", "sources": 0, "time": f"{time.time()-start:.1f}s", "cache": True}

        # 4. 本地知识库
        enriched_q = self.memory.enrich(question)
        local_results = self.knowledge_base.search(enriched_q)
        if local_results and local_results[0]["score"] > 0.6:
            self.stats["local"] += 1
            answer = local_results[0]["answer"]
            answer += f"\n\n—— 来自本地知识库（已收藏 {local_results[0]['hits']} 次）"
            self.cache.set(question, answer)
            self.memory.add("user", question)
            self.memory.add("assistant", answer)
            return answer, {"intent": "local", "sources": len(local_results), "time": f"{time.time()-start:.1f}s", "kb_id": local_results[0]["id"]}

        # 5. 联网检索
        self.stats["remote"] += 1
        intent, template = IntentClassifier.classify(enriched_q)
        fragments = self.retriever.search(enriched_q)

        if not fragments:
            answer = "这个问题我需要联网查一下，但目前没找到足够的信息。可以换个关键词试试。"
        else:
            answer = ThoughtTemplateBank.render(template, fragments, question)

        # 个性化包装
        answer = self.persona.wrap(answer)

        # 缓存
        self.cache.set(question, answer)

        # 记忆
        self.memory.add("user", question)
        self.memory.add("assistant", answer)

        elapsed = time.time() - start
        self.stats["total_time"] += elapsed

        # 学习模式：自动记录高质量问答
        if self.learning_mode and fragments and len(answer) > 50:
            self.knowledge_base.add(question, answer, category=intent, source="auto-learn")

        return answer, {"intent": intent, "sources": len(fragments), "time": f"{elapsed:.1f}s"}

    def _check_commands(self, q):
        """内置命令"""
        cmd = q.strip().lower()
        if cmd in ("help", "帮助"):
            return (
                "HopeAI 网元模型 v0.4.0 命令：\n"
                "  help/帮助     - 显示本帮助\n"
                "  stats/统计    - 查看运行统计\n"
                "  style/风格    - 切换回答风格\n"
                "  kb/知识库     - 查看知识库状态\n"
                "  learn/学习    - 开启/关闭自动学习\n"
                "  reset/重置    - 清空对话记忆\n"
                "  joke/笑话     - 讲个笑话\n"
            )
        if cmd in ("stats", "统计"):
            s = self.stats
            kb = self.knowledge_base.get_stats()
            cache = self.cache.stats()
            return (
                f"查询次数: {s['queries']}\n"
                f"  本地知识库: {s['local']} | 缓存命中: {s['cache']} | 插件: {s['plugins']} | 联网: {s['remote']}\n"
                f"  缓存命中率: {cache['rate']} ({cache['size']}条)\n"
                f"  知识库: {kb['total']}条 (赞{ kb['helpful']}/踩{ kb['unhelpful']})\n"
                f"  平均耗时: {s['total_time']/max(1,s['queries']):.1f}s"
            )
        if cmd in ("style", "风格"):
            return f"当前风格：{self.persona.current_style}\n可选风格：\n{self.persona.list_styles()}"
        if cmd.startswith("style ") or cmd.startswith("风格 "):
            style = cmd.split(" ", 1)[-1]
            return self.persona.set_style(style)
        if cmd in ("kb", "知识库"):
            kb = self.knowledge_base.get_stats()
            return f"知识库状态：共 {kb['total']} 条 | 被查阅 {kb['hits']} 次 | 赞 {kb['helpful']} / 踩 {kb['unhelpful']}"
        if cmd in ("learn", "学习"):
            self.learning_mode = not self.learning_mode
            return f"自动学习模式：{'已开启' if self.learning_mode else '已关闭'}"
        if cmd in ("reset", "重置"):
            self.memory.clear()
            return "对话记忆已清空。"
        return None

    def learn_from_good_answers(self):
        """批量学习：复盘优质回答"""
        count = 0
        for h in self.memory.history:
            if h["role"] == "user":
                last_q = h["content"]
            elif len(last_q) > 5 and len(h["content"]) > 30:
                self.knowledge_base.add(last_q, h["content"], source="batch-learn")
                count += 1
        return count


# ============================================================
# Web界面
# ============================================================

WEB_HTML = r"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<title>HopeAI v0.4</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,sans-serif;background:#0d1117;color:#c9d1d9;max-width:720px;margin:0 auto;padding:12px;min-height:100vh}
.header{text-align:center;padding:16px 0;border-bottom:1px solid #30363d;margin-bottom:12px}
.header h1{color:#58a6ff;font-size:18px}
.header p{color:#8b949e;font-size:11px;margin-top:2px}
.stats{display:flex;gap:8px;justify-content:center;margin:8px 0;flex-wrap:wrap}
.stat{background:#161b22;border:1px solid #30363d;border-radius:8px;padding:6px 12px;font-size:11px;color:#8b949e}
.stat b{color:#58a6ff}
.chat{display:flex;flex-direction:column;gap:10px;margin-bottom:90px}
.msg{max-width:90%;padding:10px 14px;border-radius:12px;font-size:14px;line-height:1.6;white-space:pre-wrap;word-break:break-word}
.msg.user{align-self:flex-end;background:#238636;color:#fff}
.msg.ai{align-self:flex-start;background:#161b22;border:1px solid #30363d}
.msg .meta{font-size:10px;color:#8b949e;margin-top:4px;display:flex;gap:6px;align-items:center}
.msg .btn{font-size:10px;padding:2px 8px;border-radius:10px;border:1px solid #30363d;background:transparent;color:#8b949e;cursor:pointer}
.input-bar{position:fixed;bottom:0;left:0;right:0;max-width:720px;margin:0 auto;padding:10px 12px;background:#0d1117;border-top:1px solid #30363d;display:flex;gap:8px;align-items:center}
.input-bar input{flex:1;padding:10px 14px;border:1px solid #30363d;border-radius:20px;background:#161b22;color:#c9d1d9;font-size:14px;outline:none}
.input-bar input:focus{border-color:#58a6ff}
.input-bar button{padding:10px 18px;border:none;border-radius:20px;background:#238636;color:#fff;font-size:14px;cursor:pointer;white-space:nowrap}
.input-bar button:active{opacity:.8}
.log{font-size:10px;color:#484f58;text-align:center;padding:8px}
</style>
</head>
<body>
<div class="header"><h1>HopeAI 网元模型 v0.4</h1><p>本地知识库 · 自学习 · 插件 · 个性化</p></div>
<div class="stats" id="stats">
<span class="stat">本地<b id="s_local">0</b></span>
<span class="stat">缓存<b id="s_cache">0</b></span>
<span class="stat">插件<b id="s_plugins">0</b></span>
<span class="stat">联网<b id="s_remote">0</b></span>
<span class="stat">KB<b id="s_kb">0</b>条</span>
</div>
<div class="chat" id="chat"></div>
<div class="input-bar">
<input id="q" placeholder="输入问题..." autofocus onkeydown="if(event.key==='Enter')ask()">
<button onclick="ask()">发送</button>
</div>
<script>
let lastKbId=null;
async function ask(){
 const q=document.getElementById('q');const t=q.value.trim();if(!t)return;
 addMsg('user',t);q.value='';q.focus();
 const typing=addMsg('ai','…');
 try{
  const r=await fetch('/api/ask',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:t})});
  const d=await r.json();
  let meta=`${d.meta.intent} | ${d.meta.time}`;
  if(d.meta.cache)meta+=' | 缓存命中';
  if(d.meta.kb_id)meta+=' | 本地知识库';
  if(d.meta.plugin)meta+=' | 插件:'+d.meta.plugin;
  typing.innerHTML=d.answer.replace(/\\n/g,'<br>')+`<div class="meta">${meta}<button class="btn" onclick="feedback('${d.meta.kb_id||'last'}',1)">有用</button><button class="btn" onclick="feedback('${d.meta.kb_id||'last'}',0)">没用</button></div>`;
  if(d.meta.kb_id)lastKbId=d.meta.kb_id;
 }catch(e){typing.innerHTML='错误: '+e.message}
}
function addMsg(role,text){
 const d=document.createElement('div');d.className='msg '+role;
 d.innerHTML=text.replace(/\\n/g,'<br>');
 document.getElementById('chat').appendChild(d);
 window.scrollTo(0,document.body.scrollHeight);
 return d;
}
async function feedback(id,good){
 if(id==='last')id=lastKbId;
 if(!id)return;
 await fetch('/api/feedback',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:id,helpful:!!good})});
}
setInterval(async()=>{
 try{
  const r=await fetch('/api/stats');const d=await r.json();
  document.getElementById('s_local').innerText=d.local;
  document.getElementById('s_cache').innerText=d.cache;
  document.getElementById('s_plugins').innerText=d.plugins;
  document.getElementById('s_remote').innerText=d.remote;
  document.getElementById('s_kb').innerText=d.kb_total;
 }catch(e){}
},5000);
</script>
</body>
</html>"""

class WebHandler(BaseHTTPRequestHandler):
    ai = None

    def do_GET(self):
        if self.path == "/":
            self._respond(200, "text/html; charset=utf-8", WEB_HTML)
        elif self.path == "/api/stats":
            s = self.ai.stats
            kb = self.ai.knowledge_base.get_stats()
            self._respond(200, "application/json", json.dumps({
                "queries": s["queries"], "local": s["local"], "cache": s["cache"],
                "plugins": s["plugins"], "remote": s["remote"], "kb_total": kb["total"]
            }))
        else:
            self._respond(404, "text/plain", "404")

    def do_POST(self):
        if self.path == "/api/ask":
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length))
            q = body.get("question", "").strip()
            if not q:
                self._respond(400, "application/json", '{"error":"empty"}')
                return
            answer, meta = self.ai.ask(q)
            self._respond(200, "application/json", json.dumps({"answer": answer, "meta": meta}, ensure_ascii=False))
        elif self.path == "/api/feedback":
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length))
            kb_id = body.get("id")
            helpful = body.get("helpful", True)
            if kb_id and isinstance(kb_id, int):
                self.ai.knowledge_base.feedback(kb_id, helpful)
            self._respond(200, "application/json", '{"ok":true}')
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
    print(f"  Web: http://localhost:8080")
    server.serve_forever()


# ============================================================
# 启动
# ============================================================

def main():
    ai = HopeAI()
    import sys

    if "--learn" in sys.argv:
        print(f"{ai.name} v{ai.version} 夜间学习模式")
        print("正在复盘对话并存入知识库...")
        count = ai.learn_from_good_answers()
        print(f"已学习 {count} 条新知识")
        kb = ai.knowledge_base.get_stats()
        print(f"知识库状态：{kb['total']}条 | 赞{ kb['helpful']}/踩{ kb['unhelpful']}")
        return

    if "--web" in sys.argv:
        threading.Thread(target=run_web, args=(ai,), daemon=True).start()
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n再见！")
        return

    print("=" * 50)
    print(f"  {ai.name} v{ai.version}")
    print("  本地知识库 | 自学习 | 缓存 | 插件 | 个性化")
    print("  命令: help=帮助 | q=退出 | --web=Web界面")
    print("=" * 50)
    print(f"  知识库: {ai.knowledge_base.get_stats()['total']}条 | 缓存命中: {ai.cache.stats()['rate']}")
    print()

    while True:
        try:
            q = input("你：").strip()
        except (EOFError, KeyboardInterrupt):
            print("\n明天继续！")
            break
        if q.lower() in ("q", "quit", "退出"):
            print("明天继续！")
            break
        if not q:
            continue
        print("…", end="\r")
        answer, meta = ai.ask(q)
        print(f"\n网元：{answer}")
        info = f"      [{meta['intent']}"
        if meta.get("cache"): info += " | 缓存"
        if meta.get("plugin"): info += f" | 插件:{meta['plugin']}"
        info += f" | {meta['time']}]"
        print(info)

if __name__ == "__main__":
    main()
