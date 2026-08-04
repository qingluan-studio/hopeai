# HopeAI 自进化闭环引擎 (v3.0)
# online_trainer + 失败信号回灌 + xuni虚拟闭环

import json, time, sqlite3, hashlib, threading, queue
from datetime import datetime, timezone

class OnlineTrainer:
    """在线学习引擎: 监听feedback → 虚拟训练 → 权重更新"""

    def __init__(self, knowledge_db_path):
        self.db_path = knowledge_db_path
        self.feedback_queue = queue.Queue()
        self.running = False
        self.stats = {"processed": 0, "improved": 0, "last_run": None}
        self._init_feedback_table()

    def _init_feedback_table(self):
        conn = sqlite3.connect(self.db_path)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS _feedback (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ts REAL, query TEXT, plugin TEXT, result TEXT,
                rating INTEGER, error_type TEXT, resolved INTEGER DEFAULT 0
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS _corrections (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                pattern TEXT UNIQUE, correction TEXT,
                weight REAL DEFAULT 1.0, added_ts REAL, hit_count INTEGER DEFAULT 0
            )
        """)
        conn.commit(); conn.close()

    def log_feedback(self, query, plugin, result, rating, error_type=None):
        """记录用户反馈信号 (rating: 1-5)"""
        conn = sqlite3.connect(self.db_path)
        conn.execute("INSERT INTO _feedback(ts,query,plugin,result,rating,error_type) VALUES(?,?,?,?,?,?)",
            (time.time(), query, plugin, str(result)[:200], rating, error_type))
        conn.commit(); conn.close()
        self.feedback_queue.put((query, plugin, result, rating, error_type))

    def start(self):
        """启动在线学习线程"""
        if self.running: return
        self.running = True
        self._thread = threading.Thread(target=self._learn_loop, daemon=True)
        self._thread.start()

    def stop(self):
        self.running = False

    def _learn_loop(self):
        """持续监听反馈队列，批量学习"""
        batch = []
        batch_size = 10
        batch_interval = 30  # 30秒或满10条触发一次

        while self.running:
            try:
                item = self.feedback_queue.get(timeout=1)
                batch.append(item)
                if len(batch) >= batch_size:
                    self._process_batch(batch)
                    batch = []
            except queue.Empty:
                if batch and time.time() - self.stats.get("last_run", 0) > batch_interval:
                    self._process_batch(batch)
                    batch = []

    def _process_batch(self, batch):
        """批量处理反馈，提取模式"""
        improvements = 0
        for query, plugin, result, rating, error_type in batch:
            if rating is None: continue

            if rating <= 2:
                # 失败信号 → 记录错误模式
                conn = sqlite3.connect(self.db_path)
                pattern = self._extract_pattern(query, plugin, error_type)
                existing = conn.execute("SELECT hit_count, weight FROM _corrections WHERE pattern=?",
                    (pattern,)).fetchone()
                if existing:
                    conn.execute("UPDATE _corrections SET hit_count=hit_count+1, weight=weight*1.1 WHERE pattern=?",
                        (pattern,))
                else:
                    conn.execute("INSERT INTO _corrections(pattern,correction,weight,added_ts) VALUES(?,?,?,?)",
                        (pattern, f"pattern_correction_{len(pattern)}", 1.0, time.time()))
                improvements += 1
                conn.commit(); conn.close()

            elif rating >= 4:
                # 成功信号 → 强化模式权重
                conn = sqlite3.connect(self.db_path)
                pattern = self._extract_pattern(query, plugin, None)
                conn.execute("UPDATE _corrections SET weight=weight*1.05 WHERE pattern=?", (pattern,))
                conn.commit(); conn.close()

        self.stats["processed"] += len(batch)
        self.stats["improved"] += improvements
        self.stats["last_run"] = time.time()

    def _extract_pattern(self, query, plugin, error_type):
        """从查询中提取模式特征"""
        key = f"{plugin}|{error_type or 'ok'}|{hashlib.md5(query.encode()).hexdigest()[:6]}"
        return key

    def get_corrections(self, query=None, limit=20):
        """获取修正知识（可注入到推理链路）"""
        conn = sqlite3.connect(self.db_path)
        rows = conn.execute("SELECT pattern, correction, weight, hit_count FROM _corrections ORDER BY weight DESC LIMIT ?",
            (limit,)).fetchall()
        conn.close()
        return [{"pattern": r[0], "correction": r[1], "weight": r[2], "hits": r[3]} for r in rows]

    def get_stats(self):
        return {**self.stats, "queue_size": self.feedback_queue.qsize()}


class FailureTrigger:
    """失败触发器: 监听错误→自动回灌训练信号"""

    def __init__(self, trainer):
        self.trainer = trainer
        self.threshold = 3  # 同一模式连续失败3次触发自动回灌

    def on_plugin_result(self, query, plugin, result):
        """插件执行后回调"""
        if isinstance(result, dict) and not result.get("ok"):
            error_type = result.get("meta", {}).get("error_type", "general_error")
            self.trainer.log_feedback(query, plugin, result, rating=1, error_type=error_type)
            return True  # 触发自进化
        return False


class SelfEvolutionLoop:
    """自进化闭环: OnlineTrainer + FailureTrigger + xuni虚拟闭环"""

    def __init__(self, knowledge_db_path):
        self.trainer = OnlineTrainer(knowledge_db_path)
        self.trigger = FailureTrigger(self.trainer)
        self.active = False

    def start(self):
        self.active = True
        self.trainer.start()

    def stop(self):
        self.active = False
        self.trainer.stop()

    def feedback(self, query, plugin, result, rating=3):
        """外部反馈入口"""
        self.trainer.log_feedback(query, plugin, result, rating)

    def intercept(self, query, plugin, result):
        """拦截插件结果，自动触发学习"""
        self.trigger.on_plugin_result(query, plugin, result)
        return result

    def get_knowledge(self):
        """获取累积的修正知识"""
        return self.trainer.get_corrections()

    def status(self):
        return {
            "active": self.active,
            "trainer": self.trainer.get_stats()
        }
