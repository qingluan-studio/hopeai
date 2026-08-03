#!/usr/bin/env python3
"""
HopeAI 网元在线训练引擎 v1.0
理念：模型不下载，让模型去网上学。
- 自动爬取指定领域知识
- 增量构建知识图谱
- 反馈驱动权重调整
- 检索策略自动优化
"""

import json, re, time, os, hashlib, sqlite3, urllib.request, urllib.parse, threading
from datetime import datetime
from collections import defaultdict

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "hopeai_data")
for d in ["crawl", "index", "models", "feedback"]:
    os.makedirs(os.path.join(DATA_DIR, d), exist_ok=True)

# ========== 在线学习引擎核心 ==========
class OnlineTrainer:
    """网元模型在线训练 - 让模型去网上自学"""

    def __init__(self):
        self.db = sqlite3.connect(os.path.join(DATA_DIR, "online_train.db"), check_same_thread=False)
        self.db.execute("PRAGMA journal_mode=WAL")
        self._init_tables()
        self.topics = self._load_topics()
        self.learning_stats = {"pages_crawled": 0, "facts_learned": 0, "graphs_built": 0,
                               "sessions": 0, "start_time": datetime.now().isoformat()}

    def _init_tables(self):
        self.db.executescript("""
        CREATE TABLE IF NOT EXISTS learned_facts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fact TEXT, source_url TEXT, topic TEXT,
            confidence REAL DEFAULT 0.5, verified INTEGER DEFAULT 0,
            times_used INTEGER DEFAULT 0, times_helpful INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS topic_index (
            topic TEXT PRIMARY KEY,
            keywords TEXT, last_crawled TIMESTAMP,
            fact_count INTEGER DEFAULT 0, priority REAL DEFAULT 0.5
        );
        CREATE TABLE IF NOT EXISTS learning_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            action TEXT, detail TEXT, result TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS source_reputation (
            domain TEXT PRIMARY KEY,
            facts_contributed INTEGER DEFAULT 0,
            accuracy REAL DEFAULT 0.5,
            last_used TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_facts_topic ON learned_facts(topic);
        CREATE INDEX IF NOT EXISTS idx_facts_confidence ON learned_facts(confidence);
        """)
        self.db.commit()

    def _load_topics(self):
        return {
            "ai": {"keywords": ["人工智能", "机器学习", "深度学习", "AI", "大模型", "LLM", "GPT", "神经网络"],
                   "seeds": ["https://zh.wikipedia.org/wiki/人工智能", "https://zh.wikipedia.org/wiki/机器学习"]},
            "programming": {"keywords": ["编程", "Python", "代码", "算法", "数据结构", "Git", "Docker"],
                          "seeds": ["https://zh.wikipedia.org/wiki/Python"]},
            "science": {"keywords": ["物理", "数学", "化学", "生物", "量子", "相对论"],
                       "seeds": []},
        }

    # ===== 核心：让模型去网上学 =====
    def go_learn(self, topic=None, max_pages=5):
        """让模型主动去网上学习指定主题"""
        topics = [topic] if topic else list(self.topics.keys())
        results = []

        for t in topics[:3]:
            if t not in self.topics: continue
            self._log("learn_start", f"开始学习: {t}")

            # 1. 从种子URL开始爬
            seeds = self.topics[t]["seeds"]
            if seeds:
                for url in seeds[:2]:
                    facts = self._extract_facts_from_url(url, t)
                    self._save_facts(facts, url, t)
                    results.append({"topic": t, "source": url, "facts": len(facts)})

            # 2. 搜索更多来源
            keywords = self.topics[t]["keywords"]
            for kw in keywords[:3]:
                try:
                    search_url = f"https://api.duckduckgo.com/?q={urllib.parse.quote(kw+t)}&format=json&no_html=1"
                    req = urllib.request.Request(search_url, headers={"User-Agent": "HopeAI-Learner/1.0"})
                    with urllib.request.urlopen(req, timeout=10) as r:
                        data = json.loads(r.read().decode())
                    if data.get("AbstractText"):
                        facts = self._extract_facts_from_text(data["AbstractText"], kw)
                        self._save_facts(facts, f"search:{kw}", t)
                        results.append({"topic": t, "source": f"search:{kw}", "facts": len(facts)})
                except Exception as e:
                    self._log("search_fail", f"{t}/{kw}: {e}")

            # 3. 更新主题索引
            self.db.execute(
                "INSERT OR REPLACE INTO topic_index (topic,keywords,last_crawled,fact_count) VALUES (?,?,CURRENT_TIMESTAMP,(SELECT COUNT(*) FROM learned_facts WHERE topic=?))",
                (t, ",".join(self.topics[t]["keywords"]), t))
            self.db.commit()

        self.learning_stats["pages_crawled"] += len(results)
        self.learning_stats["facts_learned"] = sum(r["facts"] for r in results)
        self._log("learn_done", f"学习完成，{len(results)}个来源，{self.learning_stats['facts_learned']}条新知")
        return results

    def _extract_facts_from_url(self, url, topic):
        """从URL提取知识点"""
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "HopeAI-Learner/1.0"})
            with urllib.request.urlopen(req, timeout=15) as r:
                text = r.read().decode("utf-8", errors="replace")
            return self._extract_facts_from_text(text, topic)
        except:
            return []

    def _extract_facts_from_text(self, text, topic):
        """从文本提取结构化知识点"""
        facts = []
        # 清理HTML
        text = re.sub(r'<[^>]+>', ' ', text)
        text = re.sub(r'\s+', ' ', text)

        # 按句子拆分
        sentences = re.split(r'[。！？\n]', text)
        for s in sentences:
            s = s.strip()
            if len(s) < 15 or len(s) > 300: continue
            # 检查是否包含中文内容
            if not re.search(r'[\u4e00-\u9fff]', s): continue
            # 归一化
            s = s.strip('，。；：、""''（）()[]')
            if len(s) >= 10:
                facts.append(s[:300])

        return facts[:20]

    def _save_facts(self, facts, source, topic):
        """保存学到的知识点"""
        for fact in facts:
            # 去重
            key = hashlib.md5(fact[:100].encode()).hexdigest()[:12]
            existing = self.db.execute(
                "SELECT id FROM learned_facts WHERE fact LIKE ?", (f"{fact[:50]}%",)).fetchone()
            if existing: continue

            self.db.execute(
                "INSERT INTO learned_facts (fact,source_url,topic,confidence) VALUES (?,?,?,0.5)",
                (fact, source, topic))
        self.db.commit()

    # ===== 反馈驱动优化 =====
    def feedback_learn(self, fact_id, was_helpful):
        """用户反馈驱动权重调整"""
        if was_helpful:
            self.db.execute("UPDATE learned_facts SET times_helpful=times_helpful+1, confidence=MIN(1.0, confidence+0.05) WHERE id=?", (fact_id,))
        else:
            self.db.execute("UPDATE learned_facts SET confidence=MAX(0.1, confidence-0.1) WHERE id=?", (fact_id,))
        self.db.execute("UPDATE learned_facts SET times_used=times_used+1 WHERE id=?", (fact_id,))
        self.db.commit()
        self._log("feedback", f"fact_{fact_id}: {'有用' if was_helpful else '无用'}")

    # ===== 智能检索 =====
    def recall(self, query, limit=5):
        """基于在线学习知识的智能召回"""
        # 话题检测
        matched_topics = []
        for t, info in self.topics.items():
            score = sum(1 for kw in info["keywords"] if kw in query)
            if score > 0:
                matched_topics.append((t, score))

        if not matched_topics:
            # 全库搜索
            facts = self.db.execute(
                "SELECT id, fact, source_url, confidence FROM learned_facts ORDER BY confidence DESC, times_helpful DESC LIMIT ?",
                (limit,)).fetchall()
        else:
            # 按话题搜索
            topic = max(matched_topics, key=lambda x: x[1])[0]
            facts = self.db.execute(
                "SELECT id, fact, source_url, confidence FROM learned_facts WHERE topic=? ORDER BY confidence DESC LIMIT ?",
                (topic, limit)).fetchall()

        return [{"id": f[0], "fact": f[1], "source": f[2], "confidence": f[3]} for f in facts]

    # ===== 持续学习 =====
    def auto_learn_loop(self, interval_hours=6):
        """后台自主学习循环"""
        self._log("auto_learn", f"启动自动学习，间隔{interval_hours}小时")
        def loop():
            while True:
                try:
                    topics = [t for t in self.topics if self._needs_update(t)]
                    if topics:
                        self.go_learn(topics[0], max_pages=3)
                    time.sleep(interval_hours * 3600)
                except Exception as e:
                    self._log("auto_learn_err", str(e))
                    time.sleep(600)
        t = threading.Thread(target=loop, daemon=True)
        t.start()
        return "自主学习已启动"

    def _needs_update(self, topic):
        row = self.db.execute("SELECT last_crawled FROM topic_index WHERE topic=?", (topic,)).fetchone()
        if not row: return True
        if not row[0]: return True
        try:
            last = datetime.fromisoformat(row[0].replace("Z", "+00:00"))
            return (datetime.now() - last.replace(tzinfo=None)).total_seconds() > 86400
        except:
            return True

    def _log(self, action, detail):
        self.db.execute("INSERT INTO learning_log (action,detail) VALUES (?,?)", (action, detail[:500]))
        self.db.commit()

    def stats(self):
        facts = self.db.execute("SELECT COUNT(*), AVG(confidence) FROM learned_facts").fetchone()
        topics = self.db.execute("SELECT COUNT(*) FROM topic_index").fetchone()
        logs = self.db.execute("SELECT COUNT(*) FROM learning_log").fetchone()
        return {
            "学到的知识点": facts[0] or 0,
            "平均置信度": f"{(facts[1] or 0):.2%}",
            "覆盖主题": topics[0] or 0,
            "学习记录": logs[0] or 0,
            "已爬页面": self.learning_stats["pages_crawled"],
        }

    def export_knowledge(self):
        """导出学到的知识"""
        path = os.path.join(DATA_DIR, "models", f"learned_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
        facts = self.db.execute(
            "SELECT fact, topic, confidence, source_url FROM learned_facts WHERE confidence > 0.3 ORDER BY confidence DESC LIMIT 500").fetchall()
        with open(path, "w", encoding="utf-8") as f:
            json.dump([{"fact": f[0], "topic": f[1], "confidence": f[2], "source": f[3]} for f in facts],
                      f, ensure_ascii=False, indent=2)
        return {"path": path, "facts": len(facts)}

# ===== 测试 =====
if __name__ == "__main__":
    print("=== 网元在线训练引擎 ===\n")
    trainer = OnlineTrainer()

    # 让模型去学
    print("让模型去网上学...")
    results = trainer.go_learn("ai", max_pages=3)
    for r in results:
        print(f"  {r['topic']}: {r['source'][:40]} -> {r['facts']}条")

    stats = trainer.stats()
    print(f"\n学习统计:")
    for k, v in stats.items():
        print(f"  {k}: {v}")

    # 测试召回
    print("\n知识召回测试:")
    for q in ["人工智能是什么", "Python怎么学"]:
        facts = trainer.recall(q, 3)
        print(f"  Q: {q}")
        for f in facts:
            print(f"    [{f['confidence']:.0%}] {f['fact'][:80]}...")
