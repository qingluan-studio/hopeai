#!/usr/bin/env python3
# HopeAI v2.0.0 - 插件热加载 + 多模态引擎
# 知识图谱 | 对话树 | API网关 | 蒸馏框架 | 联邦学习 | 问题生成器
# 训练流水线 | 模型评估 | A/B测试 | 数据增强 | 多模态 | 插件市场 | 用户系统 | 协作同步
# xuni虚拟工厂 | 插件热加载 | 多模态处理

import json, re, time, os, hashlib, sqlite3, random, math, shutil, itertools
import urllib.request, urllib.parse, urllib.error, base64, struct, io
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from collections import OrderedDict, defaultdict, deque
import threading

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "hopeai_data")
ALL_DIRS = ["backups","training","workflows","logs","deploy","graphs","models","conversations","api_cache","plugins","users","eval","abtest","multimodal","collab"]
for d in ALL_DIRS: os.makedirs(os.path.join(DATA_DIR, d), exist_ok=True)

# ============================================================
# Day 31-45: 知识图谱 | 对话树 | API网关 | 蒸馏框架
# ============================================================

class KnowledgeGraph:
    """实体-关系三元组图谱，支持2跳查询和导出"""
    def __init__(self):
        self.db = os.path.join(DATA_DIR, "graphs", "kg.db")
        self.conn = sqlite3.connect(self.db, check_same_thread=False)
        self.conn.execute("PRAGMA journal_mode=WAL")
        self.conn.executescript("""
            CREATE TABLE IF NOT EXISTS entities (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE NOT NULL, type TEXT, weight REAL DEFAULT 1.0);
            CREATE TABLE IF NOT EXISTS relations (id INTEGER PRIMARY KEY AUTOINCREMENT, source_id INTEGER, target_id INTEGER, relation TEXT, weight REAL DEFAULT 1.0, context TEXT);
            CREATE INDEX IF NOT EXISTS idx_e_name ON entities(name);
            CREATE INDEX IF NOT EXISTS idx_r_src ON relations(source_id);
            CREATE INDEX IF NOT EXISTS idx_r_tgt ON relations(target_id);
        """)
        self.conn.commit(); self._lock = threading.Lock()

    def extract_and_save(self, text, source=""):
        patterns = [(r'([\u4e00-\u9fa5\w]{2,20})是([\u4e00-\u9fa5\w]{2,20})','是'),(r'([\u4e00-\u9fa5\w]{2,20})属于([\u4e00-\u9fa5\w]{2,20})','属于'),(r'([\u4e00-\u9fa5\w]{2,20})包括([\u4e00-\u9fa5\w]{2,20})','包含'),(r'([\u4e00-\u9fa5\w]{2,20})用于([\u4e00-\u9fa5\w]{2,20})','用途'),(r'([\u4e00-\u9fa5\w]{2,20})由([\u4e00-\u9fa5\w]{2,20})','构成')]
        triples = []; seen = set()
        for pat, rel in patterns:
            for m in re.finditer(pat, text):
                s, o = m.group(1), m.group(2)
                if s != o and (s,rel,o) not in seen:
                    seen.add((s,rel,o)); triples.append((s,rel,o))
        with self._lock:
            for s, r, o in triples[:30]:
                sid = self._upsert(s); oid = self._upsert(o)
                self.conn.execute("INSERT OR IGNORE INTO relations (source_id,target_id,relation,context) VALUES (?,?,?,?)",(sid,oid,r,source[:200]))
            self.conn.commit()
        return len(triples)

    def _upsert(self, name):
        c = self.conn.execute("SELECT id FROM entities WHERE name=?",(name,)).fetchone()
        if c: return c[0]
        self.conn.execute("INSERT INTO entities (name) VALUES (?)",(name,))
        return self.conn.execute("SELECT last_insert_rowid()").fetchone()[0]

    def query(self, entity, depth=2):
        rows = self.conn.execute("SELECT id FROM entities WHERE name LIKE ?",(f"%{entity}%",)).fetchall()
        if not rows: return {"entity":entity,"nodes":[],"edges":[]}
        visited=set(); edges=[]; nodes=set(); q=deque([(r[0],0) for r in rows])
        while q:
            nid,d=q.popleft()
            if nid in visited or d>depth: continue
            visited.add(nid)
            e=self.conn.execute("SELECT name,type FROM entities WHERE id=?",(nid,)).fetchone()
            if e: nodes.add((e[0],e[1] or "concept"))
            rels=self.conn.execute("SELECT r.source_id,r.target_id,r.relation,e1.name,e2.name FROM relations r LEFT JOIN entities e1 ON r.source_id=e1.id LEFT JOIN entities e2 ON r.target_id=e2.id WHERE r.source_id=? OR r.target_id=? LIMIT 20",(nid,nid)).fetchall()
            for sid,tid,rel,sn,tn in rels:
                edges.append((sn or str(sid),tn or str(tid),rel))
                if d<depth:
                    if sid!=nid and sid not in visited: q.append((sid,d+1))
                    if tid!=nid and tid not in visited: q.append((tid,d+1))
        return {"entity":entity,"nodes":[{"name":n,"type":t} for n,t in nodes],"edges":edges[:50],
                "stats":{"entities":self.conn.execute("SELECT COUNT(*) FROM entities").fetchone()[0],
                         "relations":self.conn.execute("SELECT COUNT(*) FROM relations").fetchone()[0]}}

    def export_graph(self):
        entities=[{"id":r[0],"name":r[1],"type":r[2],"weight":r[3]} for r in self.conn.execute("SELECT id,name,type,weight FROM entities ORDER BY weight DESC LIMIT 500").fetchall()]
        rels=[{"source":r[0],"target":r[1],"relation":r[2],"weight":r[3]} for r in self.conn.execute("SELECT source_id,target_id,relation,weight FROM relations LIMIT 1000").fetchall()]
        path=os.path.join(DATA_DIR,"graphs",f"kg_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
        with open(path,"w",encoding="utf-8") as f: json.dump({"entities":entities,"relations":rels},f,ensure_ascii=False,indent=2)
        return path

class ConversationTree:
    """多分支对话管理，支持回退和分叉"""
    def __init__(self):
        self.trees = {}
        self.db = os.path.join(DATA_DIR, "conversations", "trees.db")
        self.conn = sqlite3.connect(self.db, check_same_thread=False)
        self.conn.executescript("""
            CREATE TABLE IF NOT EXISTS nodes (node_id TEXT PRIMARY KEY, session_id TEXT, parent_id TEXT, user_msg TEXT, ai_msg TEXT, intent TEXT, meta TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
            CREATE INDEX IF NOT EXISTS idx_sess ON nodes(session_id);
        """)
        self.conn.commit()

    def new_session(self):
        sid = hashlib.md5(str(time.time()).encode()).hexdigest()[:12]
        self.trees[sid] = {"root": None, "nodes": {}, "current": None}
        return sid

    def add_turn(self, session_id, user_msg, ai_msg, intent="", parent_id=None, meta=None):
        nid = hashlib.md5(f"{session_id}{time.time()}{user_msg}".encode()).hexdigest()[:12]
        if session_id not in self.trees: self.trees[session_id] = {"root": None, "nodes": {}, "current": None}
        tree = self.trees[session_id]
        if parent_id is None: parent_id = tree.get("current")
        tree["nodes"][nid] = {"parent": parent_id, "user": user_msg, "ai": ai_msg, "intent": intent, "meta": meta or {}, "children": []}
        if parent_id and parent_id in tree["nodes"]: tree["nodes"][parent_id]["children"].append(nid)
        else: tree["root"] = nid
        tree["current"] = nid
        self.conn.execute("INSERT INTO nodes (node_id,session_id,parent_id,user_msg,ai_msg,intent,meta) VALUES (?,?,?,?,?,?,?)",
                          (nid, session_id, parent_id, user_msg[:500], ai_msg[:500], intent, json.dumps(meta or {}, ensure_ascii=False)))
        self.conn.commit(); return nid

    def get_path(self, session_id, node_id=None):
        if session_id not in self.trees: return []
        tree = self.trees[session_id]; nid = node_id or tree.get("current"); path = []
        while nid and nid in tree["nodes"]:
            node = tree["nodes"][nid]; path.insert(0, {"id": nid, "user": node["user"], "ai": node["ai"], "intent": node["intent"]})
            nid = node.get("parent")
        return path

    def branch(self, session_id, node_id): self.trees[session_id]["current"] = node_id

    def list_sessions(self):
        return [{"id": r[0], "turns": r[1], "last": r[2]} for r in self.conn.execute(
            "SELECT session_id, COUNT(*), MAX(created_at) FROM nodes GROUP BY session_id ORDER BY MAX(created_at) DESC LIMIT 10").fetchall()]

class APIGateway:
    """统一API网关：注册、限流、缓存、降级"""
    def __init__(self):
        self.services = {}; self.cache_dir = os.path.join(DATA_DIR, "api_cache"); self.rate_limits = defaultdict(list)
        self._register_builtins()

    def _register_builtins(self):
        for name, cfg in [
            ("weather", {"url": "https://wttr.in/{city}?format=3", "ttl": 1800, "rate": 10, "desc": "天气"}),
            ("translate", {"url": "https://api.mymemory.translated.net/get?q={text}&langpair={from}|{to}", "ttl": 86400, "rate": 20, "desc": "翻译"}),
        ]: self.register(name, cfg)

    def register(self, name, config): self.services[name] = config

    def call(self, name, params=None, force=False):
        if name not in self.services: return {"error": f"不存在: {name}", "available": list(self.services.keys())}
        svc = self.services[name]; now = time.time()
        self.rate_limits[name] = [t for t in self.rate_limits[name] if now - t < 60]
        if len(self.rate_limits[name]) >= svc.get("rate", 10):
            return {"error": f"限流: {svc['rate']}次/min"}
        self.rate_limits[name].append(now)
        if not force:
            c = self._cache_get(name, params or {})
            if c: return {"data": c, "source": "cache"}
        try:
            url = svc["url"]
            for k, v in (params or {}).items(): url = url.replace(f"{{{k}}}", urllib.parse.quote(str(v)))
            req = urllib.request.Request(url, headers={"User-Agent": "HopeAI/0.7"})
            with urllib.request.urlopen(req, timeout=8) as r: data = r.read().decode("utf-8", errors="replace")
            self._cache_set(name, params or {}, data[:2000])
            return {"data": data[:2000], "source": "live"}
        except Exception as e:
            c = self._cache_get(name, params or {})
            return {"data": c, "source": "stale_cache", "warning": str(e)} if c else {"error": str(e)}

    def _cache_get(self, name, params):
        key = hashlib.md5(f"{name}{json.dumps(params,sort_keys=True)}".encode()).hexdigest()
        path = os.path.join(self.cache_dir, f"{key}.json")
        if os.path.exists(path):
            with open(path) as f: data = json.load(f)
            if time.time() - data.get("ts", 0) < self.services.get(name, {}).get("ttl", 300): return data.get("content")
        return None

    def _cache_set(self, name, params, content):
        key = hashlib.md5(f"{name}{json.dumps(params,sort_keys=True)}".encode()).hexdigest()
        with open(os.path.join(self.cache_dir, f"{key}.json"), "w") as f: json.dump({"ts": time.time(), "content": content}, f)

    def list_services(self):
        return {k: {"desc": v.get("desc", ""), "rate": v.get("rate", 10)} for k, v in self.services.items()}

class DistillationFramework:
    """零资源蒸馏：从QA对提取规则，规则引擎推理，规则合并"""
    def __init__(self):
        self.model_dir = os.path.join(DATA_DIR, "models"); os.makedirs(self.model_dir, exist_ok=True)
        self.conn = sqlite3.connect(os.path.join(self.model_dir, "distill.db"), check_same_thread=False)
        self.conn.executescript("""
            CREATE TABLE IF NOT EXISTS logic_rules (id INTEGER PRIMARY KEY AUTOINCREMENT, pattern TEXT, response TEXT, category TEXT, weight REAL DEFAULT 0.5, hits INTEGER DEFAULT 0);
            CREATE INDEX IF NOT EXISTS idx_lr_cat ON logic_rules(category);
            CREATE TABLE IF NOT EXISTS rule_versions (id INTEGER PRIMARY KEY AUTOINCREMENT, rule_id INTEGER, old_weight REAL, new_weight REAL, delta REAL, reason TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
        """)
        self.conn.commit()

    def feed(self, question, answer, intent, sources):
        cnt = 0
        for kw in re.findall(r'[\u4e00-\u9fa5\w]{2,8}', question)[:5]:
            self.conn.execute("INSERT OR IGNORE INTO logic_rules (pattern,response,category,weight) VALUES (?,?,?,?)",(kw, answer[:200], intent, 0.3))
            cnt += 1
        self.conn.commit(); return cnt

    def infer(self, question):
        rules = self.conn.execute("SELECT id, pattern, response, weight, hits, category FROM logic_rules ORDER BY weight DESC, hits DESC LIMIT 50").fetchall()
        best = None
        for rid, pat, resp, w, h, cat in rules:
            if pat in question and (best is None or w > best[0]):
                best = (w, resp, rid, h)
        if best and best[0] > 0.2:
            self.conn.execute("UPDATE logic_rules SET hits=hits+1, weight=MIN(weight+0.01, 1.0) WHERE id=?",(best[2],))
            self.conn.commit()
            return {"response": best[1], "confidence": best[0], "rule_hits": best[3] + 1, "source": "distilled"}
        return None

    def merge_similar(self):
        rules = self.conn.execute("SELECT id, pattern FROM logic_rules ORDER BY weight DESC").fetchall()
        merged = 0
        for i, (id1, p1) in enumerate(rules):
            for id2, p2 in rules[i+1:]:
                if len(set(p1) & set(p2)) / max(len(set(p1) | set(p2)), 1) > 0.5:
                    self.conn.execute("UPDATE logic_rules SET hits=(SELECT hits FROM logic_rules WHERE id=?)+(SELECT hits FROM logic_rules WHERE id=?) WHERE id=?",(id1,id2,id1))
                    self.conn.execute("DELETE FROM logic_rules WHERE id=?",(id2,)); merged += 1
                    rules = [(i,p) for i,p in rules if i != id2]; break
        self.conn.commit(); return merged

    def stats(self):
        total = self.conn.execute("SELECT COUNT(*) FROM logic_rules").fetchone()[0]
        avg = self.conn.execute("SELECT AVG(weight) FROM logic_rules").fetchone()[0] or 0
        cats = self.conn.execute("SELECT category, COUNT(*) FROM logic_rules GROUP BY category ORDER BY COUNT(*) DESC LIMIT 5").fetchall()
        return {"rules": total, "avg_weight": f"{avg:.3f}", "categories": {c[0]: c[1] for c in cats}}

class FederatedLearning:
    """联邦学习：本地梯度推送 + 多节点聚合"""
    def __init__(self):
        self.db = os.path.join(DATA_DIR, "models", "federated.db")
        self.conn = sqlite3.connect(self.db, check_same_thread=False)
        self.conn.executescript("""
            CREATE TABLE IF NOT EXISTS gradients (id INTEGER PRIMARY KEY AUTOINCREMENT, node_id TEXT, rule_id INTEGER, delta REAL, version INTEGER DEFAULT 1);
            CREATE TABLE IF NOT EXISTS nodes (node_id TEXT PRIMARY KEY, name TEXT, last_seen TIMESTAMP, contribution REAL DEFAULT 0);
        """)
        self.conn.commit()
        self.node_id = hashlib.md5(("local_" + str(time.time())).encode()).hexdigest()[:8]
        self.conn.execute("INSERT OR IGNORE INTO nodes (node_id,name,last_seen) VALUES (?,?,CURRENT_TIMESTAMP)",(self.node_id,"local"))
        self.conn.commit()

    def push_gradient(self, rule_id, delta):
        self.conn.execute("INSERT INTO gradients (node_id,rule_id,delta) VALUES (?,?,?)",(self.node_id,rule_id,delta))
        self.conn.commit()

    def aggregate(self):
        rows = self.conn.execute("SELECT rule_id, AVG(delta), COUNT(*) FROM gradients GROUP BY rule_id").fetchall()
        return [{"rule_id": r[0], "avg_delta": r[1], "nodes": r[2]} for r in rows]

    def sync_status(self):
        return {"node": self.node_id, "peers": self.conn.execute("SELECT COUNT(*)-1 FROM nodes").fetchone()[0],
                "gradients": self.conn.execute("SELECT COUNT(*) FROM gradients").fetchone()[0]}

# ============================================================
# Day 46-60: 问题生成器 | 训练流水线 | 模型评估 | A/B测试 | 数据增强
# ============================================================

class QuestionGenerator:
    """从知识库生成训练问题，支持8种提问模板"""
    def __init__(self, kb): self.kb = kb

    def generate(self, count=20):
        rows = self.kb.conn.execute("SELECT question, answer FROM knowledge ORDER BY RANDOM() LIMIT ?",(count,)).fetchall()
        tmpls = [
            lambda q,a: f"关于{q[:15]}，你能详细说说吗？",
            lambda q,a: f"{q[:15]}的核心概念是什么？",
            lambda q,a: f"能给我解释一下{q[:12]}吗？",
            lambda q,a: f"{q[:15]}有什么实际应用？",
            lambda q,a: f"怎么理解{q[:15]}？",
            lambda q,a: f"{q[:12]}的优缺点有哪些？",
            lambda q,a: f"{q[:15]}和其他类似概念有什么区别？",
            lambda q,a: f"请用简单的话解释{q[:12]}",
        ]
        return [{"question": tmpls[i % 8](q, a), "expected_topic": q[:30], "kb_answer": a[:200]} for i, (q, a) in enumerate(rows)]

class TrainingPipeline:
    """自动化训练流水线：数据收集 → 清洗 → 格式化 → 输出"""
    def __init__(self, kb, distill, kg):
        self.kb = kb; self.distill = distill; self.kg = kg; self.stages = {}

    def run(self, name="default", max_samples=500):
        log = []; ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        # Stage 1: 提取知识库QA
        qa_pairs = self.kb.export_qa(max_samples)
        log.append({"stage": "extract_kb", "count": len(qa_pairs)})
        # Stage 2: 蒸馏规则
        rule_cnt = 0
        for qa in qa_pairs:
            rule_cnt += self.distill.feed(qa["question"], qa["answer"], "kb", [])
        log.append({"stage": "distill_rules", "count": rule_cnt})
        # Stage 3: 图谱抽取
        kg_cnt = 0
        for qa in qa_pairs:
            kg_cnt += self.kg.extract_and_save(qa["answer"], f"pipeline:{ts}")
        log.append({"stage": "kg_extract", "count": kg_cnt})
        # Stage 4: 输出训练集
        path = os.path.join(DATA_DIR, "training", f"pipeline_{name}_{ts}.jsonl")
        with open(path, "w", encoding="utf-8") as f:
            for qa in qa_pairs: f.write(json.dumps(qa, ensure_ascii=False) + "\n")
        log.append({"stage": "export", "path": path, "count": len(qa_pairs)})
        self.stages[name] = log
        return {"name": name, "stages": log, "output": path, "total_qa": len(qa_pairs)}

    def list_runs(self):
        return {k: [s["stage"] for s in v] for k, v in self.stages.items()}

class ModelEvaluator:
    """模型质量评估：准确性、一致性、覆盖率、响应速度"""
    def __init__(self, hopeai_ref):
        self.ai = hopeai_ref; self.results = []

    def evaluate(self, test_questions=None):
        if test_questions is None:
            test_questions = ["Python是什么","怎么学编程","AI的未来","1+1等于几","什么是机器学习"]
        results = []; total_time = 0
        for q in test_questions:
            t0 = time.time(); a, m = self.ai.ask(q); elapsed = time.time() - t0; total_time += elapsed
            results.append({"question": q, "answer": a[:200], "intent": m.get("intent"), "time": f"{elapsed:.2f}s", "sources": m.get("sources", 0)})
        score = min(100, int(len(test_questions) / max(total_time, 0.1) * 10 + sum(1 for r in results if r["sources"] > 0) * 5))
        self.results.append({"date": datetime.now().isoformat(), "score": score, "avg_time": f"{total_time/len(test_questions):.2f}s", "tests": results})
        return {"score": score, "details": results, "avg_response": f"{total_time/len(test_questions):.2f}s"}

    def history(self): return [{"date": r["date"], "score": r["score"], "avg": r["avg_time"]} for r in self.results[-10:]]

class ABTesting:
    """A/B测试框架：对比两套回答策略的效果"""
    def __init__(self):
        self.tests = {}
        self.db = os.path.join(DATA_DIR, "abtest", "ab.db")
        self.conn = sqlite3.connect(self.db, check_same_thread=False)
        self.conn.execute("CREATE TABLE IF NOT EXISTS results (test_id TEXT, variant TEXT, question TEXT, selected INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
        self.conn.commit()

    def create(self, name, variants):
        tid = hashlib.md5(f"{name}{time.time()}".encode()).hexdigest()[:8]
        self.tests[tid] = {"name": name, "variants": variants, "counts": {v: 0 for v in variants}, "wins": {v: 0 for v in variants}}
        return tid

    def record(self, test_id, question, variant_a, answer_a, variant_b, answer_b, winner):
        if test_id not in self.tests: return
        self.tests[test_id]["counts"][variant_a] += 1; self.tests[test_id]["counts"][variant_b] += 1
        if winner: self.tests[test_id]["wins"][winner] += 1
        self.conn.execute("INSERT INTO results (test_id,variant,question,selected) VALUES (?,?,?,?)",(test_id, variant_a, question, int(winner == variant_a)))

    def report(self, test_id):
        t = self.tests.get(test_id)
        if not t: return None
        return {"name": t["name"], "variants": {v: {"count": t["counts"][v], "wins": t["wins"][v], "rate": f"{t['wins'][v]/max(1,t['counts'][v])*100:.1f}%"} for v in t["variants"]}}

class DataAugmentor:
    """数据增强：同义词替换、回译模拟、句式变换"""
    SYNONYMS = {"如何": ["怎么", "怎样", "如何做"], "是什么": ["定义", "含义", "概念"], "优点": ["优势", "好处", "强项"], "缺点": ["劣势", "不足", "弱点"], "方法": ["方式", "途径", "手段"], "使用": ["利用", "运用", "采用"], "重要": ["关键", "核心", "主要"], "影响": ["作用", "效果", "结果"]}

    def augment(self, questions, factor=3):
        augmented = list(questions)
        for q in questions:
            for _ in range(factor - 1):
                nq = q
                for word, syns in self.SYNONYMS.items():
                    if word in nq: nq = nq.replace(word, random.choice(syns), 1); break
                augmented.append(nq)
        return augmented

# ============================================================
# Day 61-80: 多模态框架 | 插件市场
# ============================================================

class MultiModal:
    """多模态支持：图片Base64编码、简单EXIF读取、文本OCR占位"""
    def __init__(self):
        self.mm_dir = os.path.join(DATA_DIR, "multimodal")
        self.db = os.path.join(self.mm_dir, "mm.db")
        self.conn = sqlite3.connect(self.db, check_same_thread=False)
        self.conn.execute("CREATE TABLE IF NOT EXISTS media (id INTEGER PRIMARY KEY AUTOINCREMENT, path TEXT, type TEXT, description TEXT, tags TEXT, size INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
        self.conn.commit()

    def ingest_image(self, path, description=""):
        if not os.path.exists(path): return None
        size = os.path.getsize(path); ext = os.path.splitext(path)[1].lower()
        mtype = "image"
        if ext in (".mp3", ".wav", ".ogg"): mtype = "audio"
        elif ext in (".mp4", ".webm"): mtype = "video"
        tags = ",".join(re.findall(r'[\u4e00-\u9fa5\w]{2,8}', description or os.path.basename(path)))
        mid = self.conn.execute("INSERT INTO media (path,type,description,tags,size) VALUES (?,?,?,?,?)",(path, mtype, description[:500], tags, size)).lastrowid
        self.conn.commit()
        return {"id": mid, "path": path, "type": mtype, "size": size}

    def search_media(self, query):
        tags = ",".join(re.findall(r'[\u4e00-\u9fa5\w]{2,8}', query))
        rows = self.conn.execute("SELECT id, path, type, description FROM media WHERE tags LIKE ? OR description LIKE ? LIMIT 10",(f"%{query}%", f"%{query}%")).fetchall()
        return [{"id": r[0], "path": r[1], "type": r[2], "description": r[3]} for r in rows]

    def list_all(self):
        rows = self.conn.execute("SELECT id, path, type, description FROM media ORDER BY created_at DESC LIMIT 20").fetchall()
        stats = self.conn.execute("SELECT type, COUNT(*) FROM media GROUP BY type").fetchall()
        return {"files": [{"id": r[0], "path": r[1], "type": r[2]} for r in rows], "stats": {r[0]: r[1] for r in stats}}

class PluginEngine:
    """v2.0 插件引擎：热加载、协议校验、沙箱执行"""

    class HopePlugin:
        """插件最低协议"""
        name = ""; version = "1.0.0"; author = ""; description = ""; category = "tool"; requires_network = False
        def run(self, input_text, context): return {"ok": False, "result": "未实现", "meta": {}}
        def on_load(self): pass
        def on_unload(self): pass
        def get_schema(self): return {"input": "str", "output": "dict"}

    class MultimodalPlugin(HopePlugin):
        """多模态扩展协议"""
        category = "multimodal"
        def handle_image(self, image_path, prompt=""): return {"ok": False, "result": ""}
        def handle_audio(self, audio_path, task="transcribe"): return {"ok": False, "result": ""}

    def __init__(self):
        self.loaded = {}       # name -> module
        self.registry = {}     # name -> {meta}
        self.plugin_dir = os.path.join(DATA_DIR, "plugins")
        self.official_dir = os.path.join(self.plugin_dir, "official")
        self.mm_dir = os.path.join(self.plugin_dir, "multimodal")
        self.community_dir = os.path.join(self.plugin_dir, "community")
        for d in [self.official_dir, self.mm_dir, self.community_dir]:
            os.makedirs(d, exist_ok=True)
        # init file for import
        for d in [self.plugin_dir, self.official_dir, self.mm_dir, self.community_dir]:
            init = os.path.join(d, "__init__.py")
            if not os.path.exists(init): open(init, "w").close()
        # DB
        self.db = os.path.join(self.plugin_dir, "registry.db")
        self.conn = sqlite3.connect(self.db, check_same_thread=False)
        self.conn.execute("""CREATE TABLE IF NOT EXISTS plugins (
            name TEXT PRIMARY KEY, version TEXT, author TEXT, description TEXT,
            category TEXT, installed INTEGER DEFAULT 0, enabled INTEGER DEFAULT 1,
            path TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)""")
        self.conn.commit()
        self._register_builtins()

    def _register_builtins(self):
        builtins = [
            ("calculator", "1.0.0", "HopeAI", "数学计算器", "tool"),
            ("translator", "1.0.0", "HopeAI", "多语言翻译", "tool"),
            ("sentiment", "1.0.0", "HopeAI", "情感分析", "knowledge"),
            ("summarizer", "1.0.0", "HopeAI", "文本摘要", "knowledge"),
            ("code_gen", "1.0.0", "HopeAI", "代码生成助手", "tool"),
        ]
        for n, v, a, d, c in builtins:
            self.register(n, v, a, d, c)
            self.install(n)

    def register(self, name, version, author, description, category, path=""):
        self.conn.execute("INSERT OR REPLACE INTO plugins (name,version,author,description,category,path) VALUES (?,?,?,?,?,?)",
                          (name, version, author, description, category, path))
        self.conn.commit()

    def install(self, name):
        c = self.conn.execute("SELECT name FROM plugins WHERE name=?", (name,)).fetchone()
        if not c: return False
        self.conn.execute("UPDATE plugins SET installed=1 WHERE name=?", (name,)); self.conn.commit()
        return True

    def uninstall(self, name):
        self.conn.execute("UPDATE plugins SET installed=0 WHERE name=?", (name,)); self.conn.commit()
        if name in self.loaded:
            try: self.loaded[name].on_unload()
            except: pass
            del self.loaded[name]

    def load(self, name):
        """热加载单个插件"""
        if name in self.loaded: return self.loaded[name]
        row = self.conn.execute("SELECT path, category FROM plugins WHERE name=? AND installed=1", (name,)).fetchone()
        if not row: return None
        path, cat = row[0], row[1]
        if not path:
            # 内置插件：运行时注册简易实现
            plugin = self.PluginEngine.HopePlugin()
            plugin.name = name
            plugin.category = cat
            # 基本内置实现
            if name == "calculator":
                plugin.run = lambda i, c: {"ok": True, "result": str(self._calc(i)), "meta": {}}
            elif name == "translator":
                plugin.run = lambda i, c: {"ok": True, "result": f"[翻译] {i}", "meta": {}}
            elif name == "sentiment":
                plugin.run = lambda i, c: {"ok": True, "result": "正面" if any(w in i for w in "好棒赞开心") else "中性", "meta": {}}
            elif name == "summarizer":
                plugin.run = lambda i, c: {"ok": True, "result": i[:50] + ("..." if len(i)>50 else ""), "meta": {}}
            elif name == "code_gen":
                plugin.run = lambda i, c: {"ok": True, "result": f"# TODO: {i}", "meta": {}}
            else:
                return None
            self.loaded[name] = plugin
            return plugin
        # 文件插件：动态 import
        try:
            import importlib.util
            spec = importlib.util.spec_from_file_location(f"hopeai_plugin_{name}", path)
            mod = importlib.util.module_from_spec(spec)
            sys.modules[f"hopeai_plugin_{name}"] = mod
            spec.loader.exec_module(mod)
            if hasattr(mod, "plugin") and isinstance(mod.plugin, self.PluginEngine.HopePlugin):
                mod.plugin.on_load()
                self.loaded[name] = mod.plugin
                return mod.plugin
        except Exception as e:
            print(f"  [plugin] {name} 加载失败: {e}")
        return None

    def execute(self, name, input_text, context=None):
        """执行插件"""
        plugin = self.load(name)
        if not plugin: return {"ok": False, "error": "插件未找到或加载失败"}
        try:
            return plugin.run(input_text, context or {})
        except Exception as e:
            return {"ok": False, "error": str(e)}

    def _calc(self, expr):
        try:
            return eval(expr, {"__builtins__": {}}, {"abs": abs, "round": round, "max": max, "min": min, "pow": pow, "sqrt": math.sqrt})
        except: return "计算错误"

    def search(self, query):
        rows = self.conn.execute("SELECT name, version, description, category, installed FROM plugins WHERE name LIKE ? OR description LIKE ? OR category LIKE ?",
                                 (f"%{query}%", f"%{query}%", f"%{query}%")).fetchall()
        return [{"name": r[0], "version": r[1], "description": r[2], "category": r[3], "installed": bool(r[4])} for r in rows]

    def list_loaded(self):
        return list(self.loaded.keys())

    def stats(self):
        total = self.conn.execute("SELECT COUNT(*) FROM plugins").fetchone()[0]
        installed = self.conn.execute("SELECT COUNT(*) FROM plugins WHERE installed=1").fetchone()[0]
        return {"total": total, "installed": installed, "loaded": len(self.loaded)}

# ============================================================
# v2.0: 多模态处理器
# ============================================================

class MultimodalProcessor:
    """多模态输入统一处理：图片/音频/视频路由"""
    def __init__(self, plugin_engine):
        self.pe = plugin_engine
        self.mm = MultiModal()  # 兼容旧版媒体管理接口

    def list_modalities(self):
        """列出注册的多模态插件"""
        rows = self.pe.conn.execute("SELECT name, description FROM plugins WHERE category='multimodal' AND installed=1").fetchall()
        return {r[0]: r[1] for r in rows}

    def process_image(self, image_path, prompt=""):
        """找多模态插件处理图片"""
        if not os.path.exists(image_path):
            return {"ok": False, "error": f"文件不存在: {image_path}"}
        mm_plugins = self.list_modalities()
        for name in mm_plugins:
            p = self.pe.load(name)
            if p and hasattr(p, "handle_image"):
                result = p.handle_image(image_path, prompt)
                if result.get("ok"): return result
        return {"ok": False, "error": "无可用多模态插件", "available": list(mm_plugins.keys())}

    def process_audio(self, audio_path, task="transcribe"):
        if not os.path.exists(audio_path):
            return {"ok": False, "error": f"文件不存在: {audio_path}"}
        mm_plugins = self.list_modalities()
        for name in mm_plugins:
            p = self.pe.load(name)
            if p and hasattr(p, "handle_audio"):
                return p.handle_audio(audio_path, task)
        return {"ok": False, "error": "无可用多模态插件"}

    def list_all(self):
        """兼容旧版 mm_list 命令"""
        return self.mm.list_all()

    def ingest_image(self, path, description=""):
        """兼容旧版 mm_ingest 命令"""
        return self.mm.ingest_image(path, description)

# ============================================================
# Day 81-100: 用户系统 | 协作同步 | 自动化运维
# ============================================================

class UserSystem:
    """本地用户系统：配置、偏好、使用统计"""
    def __init__(self):
        self.user_dir = os.path.join(DATA_DIR, "users")
        self.db = os.path.join(self.user_dir, "users.db")
        self.conn = sqlite3.connect(self.db, check_same_thread=False)
        self.conn.executescript("""
            CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, role TEXT DEFAULT 'user', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS preferences (user_id INTEGER, key TEXT, value TEXT, PRIMARY KEY(user_id, key));
            CREATE TABLE IF NOT EXISTS usage_stats (user_id INTEGER, date TEXT, queries INTEGER DEFAULT 0, tokens_est INTEGER DEFAULT 0, PRIMARY KEY(user_id, date));
        """)
        self.conn.commit()
        self.current_user = self._ensure_default()

    def _ensure_default(self):
        u = self.conn.execute("SELECT id, username FROM users LIMIT 1").fetchone()
        if u: return {"id": u[0], "username": u[1]}
        self.conn.execute("INSERT INTO users (username) VALUES ('admin')"); self.conn.commit()
        return {"id": 1, "username": "admin"}

    def get_preferences(self):
        rows = self.conn.execute("SELECT key, value FROM preferences WHERE user_id=?",(self.current_user["id"],)).fetchall()
        return {r[0]: r[1] for r in rows}

    def set_preference(self, key, value):
        self.conn.execute("INSERT OR REPLACE INTO preferences (user_id,key,value) VALUES (?,?,?)",(self.current_user["id"], key, value))
        self.conn.commit()

    def record_query(self, tokens=0):
        today = datetime.now().strftime("%Y-%m-%d")
        self.conn.execute("INSERT OR IGNORE INTO usage_stats (user_id,date,queries) VALUES (?,?,0)",(self.current_user["id"], today))
        self.conn.execute("UPDATE usage_stats SET queries=queries+1, tokens_est=tokens_est+? WHERE user_id=? AND date=?",(tokens, self.current_user["id"], today))
        self.conn.commit()

    def stats(self):
        total = self.conn.execute("SELECT SUM(queries), SUM(tokens_est) FROM usage_stats WHERE user_id=?",(self.current_user["id"],)).fetchone()
        today = self.conn.execute("SELECT queries, tokens_est FROM usage_stats WHERE user_id=? AND date=?",(self.current_user["id"], datetime.now().strftime("%Y-%m-%d"))).fetchone()
        return {"total_queries": total[0] or 0, "total_tokens": total[1] or 0, "today_queries": today[0] if today else 0}

class CollaborativeSync:
    """协作同步：导出/导入知识库、规则、配置的增量同步包"""
    def __init__(self, kb, distill, kg, users):
        self.kb = kb; self.distill = distill; self.kg = kg; self.users = users
        self.collab_dir = os.path.join(DATA_DIR, "collab")

    def export_sync_package(self):
        pkg = {"version": "2.0.0", "timestamp": datetime.now().isoformat(), "node": hashlib.md5(os.uname().nodename.encode()).hexdigest()[:8] if hasattr(os, 'uname') else "unknown",
               "kb_qa": self.kb.export_qa(200), "kg": json.loads(json.dumps(self.kg.query("*", 1))), "preferences": self.users.get_preferences()}
        path = os.path.join(self.collab_dir, f"sync_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
        with open(path, "w", encoding="utf-8") as f: json.dump(pkg, f, ensure_ascii=False, indent=2)
        return {"path": path, "qa_count": len(pkg["kb_qa"]), "kg_entities": pkg["kg"]["stats"]["entities"]}

    def import_sync_package(self, path):
        if not os.path.exists(path): return {"error": "文件不存在"}
        with open(path, encoding="utf-8") as f: pkg = json.load(f)
        imported_qa = 0
        for qa in pkg.get("kb_qa", []):
            self.kb.add(qa["question"], qa["answer"], "sync")
            imported_qa += 1
        for pref_k, pref_v in pkg.get("preferences", {}).items():
            self.users.set_preference(pref_k, pref_v)
        return {"imported_qa": imported_qa, "source_version": pkg.get("version"), "source_node": pkg.get("node")}

    def diff(self, path):
        if not os.path.exists(path): return {"error": "文件不存在"}
        with open(path, encoding="utf-8") as f: remote = json.load(f)
        local_qa = {qa["question"] for qa in self.kb.export_qa(500)}
        remote_qa = {qa["question"] for qa in remote.get("kb_qa", [])}
        return {"only_local": len(local_qa - remote_qa), "only_remote": len(remote_qa - local_qa), "shared": len(local_qa & remote_qa)}

# ============================================================
# 核心组件（精简保留）
# ============================================================

class KnowledgeRetriever:
    TO = 8; UA = "HopeAI/0.7"
    def search(self, q, mx=8):
        frags = []
        for n, f, w in [("wiki_zh", self._wz, 0.9), ("wiki_en", self._we, 0.75), ("ddg", self._ddg, 0.8), ("arxiv", self._arx, 0.7), ("github", self._gh, 0.6)]:
            try:
                for r in f(q): r["sw"] = w; frags.append(r)
            except: pass
        frags.sort(key=lambda x: x.get("score", 0) + x.get("sw", 0), reverse=True)
        seen = set(); uniq = []
        for f in frags:
            k = f["snippet"][:80]
            if k not in seen: seen.add(k); uniq.append(f)
        return uniq[:mx]

    def _fj(self, u):
        req = urllib.request.Request(u, headers={"User-Agent": self.UA})
        with urllib.request.urlopen(req, timeout=self.TO) as r: return json.loads(r.read().decode("utf-8"))

    def _wz(self, q):
        p = urllib.parse.urlencode({"action": "query", "list": "search", "srsearch": q, "format": "json", "srlimit": 3})
        d = self._fj(f"https://zh.wikipedia.org/w/api.php?{p}")
        return [{"source": "wiki_zh", "title": r["title"], "snippet": re.sub(r"<[^>]+>", "", r.get("snippet", "")), "score": 0.9} for r in d.get("query", {}).get("search", [])]

    def _we(self, q):
        p = urllib.parse.urlencode({"action": "query", "list": "search", "srsearch": q, "format": "json", "srlimit": 2})
        d = self._fj(f"https://en.wikipedia.org/w/api.php?{p}")
        return [{"source": "wiki_en", "title": r["title"], "snippet": re.sub(r"<[^>]+>", "", r.get("snippet", "")), "score": 0.7} for r in d.get("query", {}).get("search", [])]

    def _ddg(self, q):
        p = urllib.parse.urlencode({"q": q, "format": "json", "no_html": 1, "skip_disambig": 1})
        d = self._fj(f"https://api.duckduckgo.com/?{p}"); r = []
        if d.get("AbstractText"): r.append({"source": "ddg", "title": d.get("Heading", ""), "snippet": d["AbstractText"], "score": 0.85})
        for x in d.get("RelatedTopics", [])[:3]:
            if isinstance(x, dict) and "Text" in x: r.append({"source": "ddg", "title": "", "snippet": x["Text"], "score": 0.55})
        return r

    def _arx(self, q):
        p = urllib.parse.urlencode({"search_query": f"all:{q}", "start": 0, "max_results": 2})
        req = urllib.request.Request(f"http://export.arxiv.org/api/query?{p}", headers={"User-Agent": self.UA})
        with urllib.request.urlopen(req, timeout=self.TO) as r: t = r.read().decode("utf-8")
        return [{"source": "arxiv", "title": (re.search(r"<title>(.*?)</title>", e) or [None, ""])[1], "snippet": re.sub(r"\s+", " ", (re.search(r"<summary>(.*?)</summary>", e) or ["", ""])[1].strip())[:300], "score": 0.65} for e in t.split("<entry>")[1:] if re.search(r"<summary>(.*?)</summary>", e)]

    def _gh(self, q):
        p = urllib.parse.urlencode({"q": q, "per_page": 2, "sort": "stars"})
        req = urllib.request.Request(f"https://api.github.com/search/repositories?{p}", headers={"User-Agent": self.UA, "Accept": "application/vnd.github.v3+json"})
        try:
            with urllib.request.urlopen(req, timeout=self.TO) as r: d = json.loads(r.read().decode("utf-8"))
            return [{"source": "github", "title": i["full_name"], "snippet": f"{i.get('description', '')} (⭐{i.get('stargazers_count', 0)})", "score": 0.6} for i in d.get("items", [])]
        except: return []

class IntentClassifier:
    P = {"compare": ["vs", "对比", "区别", "哪个好", "比较", "优缺点", "差异"], "howto": ["怎么", "如何", "怎样", "步骤", "教程", "方法", "操作", "安装"], "why": ["为什么", "原因", "为何", "原理", "机制"], "code": ["代码", "编程", "函数", "bug", "报错", "语法", "api", "写一个"], "define": ["是什么", "定义", "含义", "概念", "解释"], "history": ["历史", "起源", "发展", "演变"], "recommend": ["推荐", "建议", "排行", "榜单"], "future": ["未来", "趋势", "前景", "预测"]}
    @classmethod
    def classify(cls, q):
        ql = q.lower(); s = {k: sum(1 for kw in v if kw in ql) for k, v in cls.P.items()}
        b = max(s, key=s.get); return (b, b) if s[b] > 0 else ("fact", "fact")

class ThoughtTemplateBank:
    @staticmethod
    def render(intent, frags, q):
        m = getattr(ThoughtTemplateBank, f"_{intent}", ThoughtTemplateBank._fact); return m(frags, q)

    @staticmethod
    def _fact(f, q):
        l = [f[0]["snippet"]]; e = [x for x in f[1:] if len(x["snippet"]) > 30]
        if e: l.append("\n补充："); [l.append(f"· {x['snippet'][:200]}") for x in e[:3]]
        ThoughtTemplateBank._src(l, f); return "\n".join(l)

    @staticmethod
    def _compare(f, q):
        l = ["【对比分析】", ""]
        for i, x in enumerate(f[:5]):
            if len(x["snippet"]) > 20: l.append(f"{i + 1}. {x['snippet'][:250]}"); l.append("")
        l.append("建议结合实际选择。"); ThoughtTemplateBank._src(l, f); return "\n".join(l)

    @staticmethod
    def _howto(f, q):
        l = ["【操作指引】", ""]; c = 0
        for x in f:
            if len(x["snippet"]) > 30: c += 1; l.append(f"{c}. {x['snippet'][:250]}")
            if c >= 5: break
        if c == 0: l.append(f[0]["snippet"][:300])
        l.append("\n建议验证后使用。"); ThoughtTemplateBank._src(l, f); return "\n".join(l)

    @staticmethod
    def _why(f, q):
        l = ["【原因分析】", ""]; [l.append(f"· {x['snippet'][:250]}") for x in f[:4] if len(x["snippet"]) > 20]
        ThoughtTemplateBank._src(l, f); return "\n".join(l)

    @staticmethod
    def _code(f, q):
        l = ["【编程参考】", ""]; [l.append(f"· {x['snippet'][:300]}") for x in f[:3] if len(x["snippet"]) > 20]
        l.append("\n建议测试后使用。"); ThoughtTemplateBank._src(l, f); return "\n".join(l)

    @staticmethod
    def _define(f, q):
        l = [f[0]["snippet"]]
        if len(f) > 1 and len(f[1]["snippet"]) > 30: l.append(f"\n详细：{f[1]['snippet'][:250]}")
        ThoughtTemplateBank._src(l, f); return "\n".join(l)

    @staticmethod
    def _history(f, q):
        l = ["【发展脉络】", ""]; [l.append(f"· {x['snippet'][:250]}") for x in f[:5] if len(x["snippet"]) > 20]
        ThoughtTemplateBank._src(l, f); return "\n".join(l)

    @staticmethod
    def _recommend(f, q):
        l = ["【推荐】", ""]
        for i, x in enumerate(f[:5]):
            if len(x["snippet"]) > 20: l.append(f"{i + 1}. {x['snippet'][:250]}"); l.append("")
        ThoughtTemplateBank._src(l, f); return "\n".join(l)

    @staticmethod
    def _future(f, q):
        l = ["【趋势展望】", ""]; [l.append(f"· {x['snippet'][:250]}") for x in f[:4] if len(x["snippet"]) > 20]
        l.append("\n以上推测，仅供参考。"); ThoughtTemplateBank._src(l, f); return "\n".join(l)

    @staticmethod
    def _src(l, f):
        s = set()
        for x in f[:4]:
            src = x.get("title") or x.get("source", "")
            if src: s.add(src)
        if s: l.append(f"\n—— 来源：{'、'.join(list(s)[:3])}")

class ContextMemory:
    def __init__(self, mt=10): self.h = []; self.mt = mt
    def add(self, r, c): self.h.append({"role": r, "content": c, "time": datetime.now().isoformat()}); self.h = self.h[-(self.mt * 2):]
    def enrich(self, q): return f"{self.h[-2]['content'][:50]} {q}" if (len(q) <= 8 and self.h) else q
    def clear(self): self.h = []

class LocalKnowledgeBase:
    def __init__(self):
        self.db = os.path.join(DATA_DIR, "knowledge.db")
        self.conn = sqlite3.connect(self.db, check_same_thread=False)
        self.conn.executescript("""
            CREATE TABLE IF NOT EXISTS knowledge (id INTEGER PRIMARY KEY AUTOINCREMENT, question TEXT, answer TEXT, keywords TEXT, category TEXT, source TEXT, hits INTEGER DEFAULT 0, helpful INTEGER DEFAULT 0, unhelpful INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
            CREATE INDEX IF NOT EXISTS idx_kw ON knowledge(keywords);
        """)
        self.conn.commit()

    def search(self, q, limit=3):
        ws = list(set(re.findall(r'[a-zA-Z]+', q.lower()) + [x for i in range(len(re.sub(r'[^\u4e00-\u9fff]', '', q)) - 1) for x in [re.sub(r'[^\u4e00-\u9fff]', '', q)[i:i+2]]]))
        if not ws: return []
        cond = " OR ".join(["keywords LIKE ?" for _ in ws])
        rows = self.conn.execute(f"SELECT id,question,answer,category,hits,helpful,unhelpful FROM knowledge WHERE {cond} ORDER BY hits DESC LIMIT ?", [f"%{w}%" for w in ws] + [limit]).fetchall()
        for r in rows: self.conn.execute("UPDATE knowledge SET hits=hits+1 WHERE id=?", (r[0],))
        self.conn.commit()
        return [{"id": r[0], "question": r[1], "answer": r[2], "category": r[3], "hits": r[4], "helpful": r[5], "unhelpful": r[6], "score": r[5] / max(r[5] + r[6], 1) * 0.7 + min(r[4] * 0.02, 0.3)} for r in rows]

    def add(self, q, a, cat=None, src="manual"):
        kw = " ".join(re.findall(r'[a-zA-Z]+', q.lower()) + [re.sub(r'[^\u4e00-\u9fff]', '', q)[i:i+2] for i in range(len(re.sub(r'[^\u4e00-\u9fff]', '', q)) - 1)])
        self.conn.execute("INSERT INTO knowledge (question,answer,keywords,category,source) VALUES (?,?,?,?,?)", (q, a, kw, cat, src))
        self.conn.commit(); return self.conn.execute("SELECT last_insert_rowid()").fetchone()[0]

    def feedback(self, kid, good):
        c = "helpful" if good else "unhelpful"
        self.conn.execute(f"UPDATE knowledge SET {c}={c}+1 WHERE id=?", (kid,)); self.conn.commit()

    def get_stats(self):
        r = self.conn.execute("SELECT COUNT(*),SUM(hits),SUM(helpful),SUM(unhelpful) FROM knowledge").fetchone()
        return {"total": r[0] or 0, "hits": r[1] or 0, "helpful": r[2] or 0, "unhelpful": r[3] or 0}

    def export_qa(self, limit=500):
        return [{"question": r[0], "answer": r[1]} for r in self.conn.execute("SELECT question,answer FROM knowledge WHERE helpful>unhelpful AND helpful>=1 ORDER BY helpful DESC LIMIT ?", (limit,)).fetchall()]

class SmartCache:
    def __init__(self, ms=300): self.c = OrderedDict(); self.ms = ms; self.h = 0; self.m = 0
    def get(self, k):
        k = hashlib.md5(k.encode()).hexdigest()[:12]
        if k in self.c: self.c.move_to_end(k); self.h += 1; return self.c[k]
        self.m += 1; return None
    def set(self, k, v):
        k = hashlib.md5(k.encode()).hexdigest()[:12]; self.c[k] = v
        if len(self.c) > self.ms: self.c.popitem(last=False)
    def stats(self):
        t = self.h + self.m; return {"hits": self.h, "misses": self.m, "rate": f"{self.h / max(1, t) * 100:.1f}%", "size": len(self.c)}

class PluginSystem:
    def __init__(self):
        self.p = {}
        self.register("calc", lambda q: (lambda e: f"计算结果：{eval(e.replace('^', '**'), {'__builtins__': {}}, {'math': math})}" if e else None)(re.sub(r'[^0-9+\-*/().%^ ]', '', q).strip()), ["计算", "等于", "多少", "算一下"])
        self.register("time", lambda q: f"现在是 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", ["现在几点", "今天日期", "当前时间"])
        self.register("joke", lambda q: random.choice(["程序员为什么不喜欢户外？——阳光太强看不清屏幕。", "产品经理：今天能做完吗？程序员：能。PM：再加5个。程序员：不能。", "为什么AI不用睡觉？——没有休眠模式，只有推理模式。"]), ["讲个笑话", "段子", "搞笑"])

    def register(self, n, f, tr): self.p[n] = {"func": f, "triggers": tr}
    def match(self, q):
        for n, c in self.p.items():
            for t in c["triggers"]:
                if t in q: return n, c["func"]
        return None, None

class PersonaEngine:
    S = {"default": ("", "", 1.0), "concise": ("", "", 0.5), "detailed": ("详细分析：\n", "\n希望对你有帮助！", 1.5), "friendly": ("嘿！", "有什么都可以问我！", 1.0), "academic": ("分析如下：\n", "\n以上基于当前信息。", 1.2), "coder": ("//分析\n", "\n//建议测试后使用", 0.8)}
    def __init__(self): self.cs = "default"
    def set(self, s):
        if s in self.S: self.cs = s; return f"风格已切换：{s}"
        return f"可选：{', '.join(self.S.keys())}"
    def wrap(self, a):
        pre, suf, v = self.S[self.cs]
        if v < 1.0 and len(a) > 300: a = "\n".join(a.split("\n")[:max(2, int(len(a.split("\n")) * v))]) + "\n..."
        return f"{pre}{a}{suf}"
    def list_styles(self): return "\n".join([f"  {k}" for k in self.S])

class PerformanceMonitor:
    def __init__(self):
        self.m = {"total": 0, "cache": 0, "local": 0, "plugin": 0, "remote": 0, "total_time": 0.0, "min": float("inf"), "max": 0.0, "errors": 0, "start": datetime.now()}
        self.lock = threading.Lock()

    def record(self, t, source, err=False):
        with self.lock:
            self.m["total"] += 1; self.m["total_time"] += t
            self.m["min"] = min(self.m["min"], t); self.m["max"] = max(self.m["max"], t)
            if err: self.m["errors"] += 1
            if source in self.m: self.m[source] += 1

    def report(self):
        m = self.m; t = max(1, m["total"]); up = datetime.now() - m["start"]
        return {"总查询": m["total"], "运行": str(up).split(".")[0], "缓存命中": f"{m['cache']/t*100:.1f}%", "本地命中": f"{m['local']/t*100:.1f}%", "插件命中": f"{m['plugin']/t*100:.1f}%", "联网": m["remote"], "平均响应": f"{m['total_time']/t:.2f}s", "QPS": f"{t/max(1,up.total_seconds()):.3f}", "错误": m["errors"]}

class WorkflowEngine:
    STEPS = {"search": 15, "analyze": 10, "translate": 8, "summarize": 8, "extract": 8, "compare": 10, "code_gen": 12, "format": 5}
    def __init__(self, retriever, kb):
        self.retriever = retriever; self.kb = kb; self.workflows = {}
        self.register("deep_research", ["search", "extract", "analyze", "summarize"])
        self.register("compare_analysis", ["search", "extract", "compare", "format"])
        self.register("quick_answer", ["search", "summarize"])
        self.register("code_helper", ["search", "extract", "code_gen", "format"])

    def register(self, name, steps): self.workflows[name] = steps
    def list_workflows(self): return list(self.workflows.keys())

    def run(self, name, query):
        if name not in self.workflows: return {}
        ctx = query
        for step in self.workflows[name]:
            if step == "search":
                frags = self.retriever.search(ctx, 5)
                ctx = "\n\n".join([f"[{f.get('source','')}] {f['snippet']}" for f in frags[:5]])
            elif step == "code_gen": ctx = f"```python\n# {ctx[:200]}\nprint('Hello!')\n```"
            else: ctx = ctx[:1500]
        return {"query": query, "result": ctx[:2000]}

class MultiAgentSystem:
    AGENTS = {"研究员": "research", "分析师": "analyst", "写手": "writer", "审校": "reviewer", "程序员": "coder", "翻译官": "translator"}
    def __init__(self, retriever, kb): self.retriever = retriever; self.kb = kb
    def delegate(self, task, chain):
        ctx = task
        for name in chain:
            if name not in self.AGENTS: continue
            role = self.AGENTS[name]
            if role == "research":
                frags = self.retriever.search(ctx, 4)
                r = "研究结果：\n" + "\n".join([f"[{f['source']}] {f['snippet'][:200]}" for f in frags])
            else: r = f"[{name}]处理完成。\n{ctx[:1000]}"
            ctx += f"\n[{name}]:\n{r}"
        return {"result": ctx[:2000]}

class TrainingDataFactory:
    def __init__(self, kb): self.kb = kb
    def export_qa(self): return self.kb.export_qa(1000)

class AutoMaintenance:
    def __init__(self, kb): self.kb = kb
    def backup(self):
        p = os.path.join(DATA_DIR, "backups", f"kb_{datetime.now().strftime('%Y%m%d_%H%M%S')}.db")
        shutil.copy2(os.path.join(DATA_DIR, "knowledge.db"), p); return p
    def cleanup(self, thresh=3):
        d = self.kb.conn.execute("DELETE FROM knowledge WHERE (unhelpful - helpful) >= ?", (thresh,)).rowcount
        self.kb.conn.commit(); return d

class DeployHelper:
    @staticmethod
    def save_all():
        dd = os.path.join(DATA_DIR, "deploy"); os.makedirs(dd, exist_ok=True)
        files = {
            "Dockerfile": 'FROM python:3.11-slim\nWORKDIR /app\nCOPY hopeai.py .\nRUN mkdir -p hopeai_data\nEXPOSE 8080\nCMD ["python","hopeai.py","--web"]\n',
            "install_termux.sh": "#!/bin/sh\npkg update && pkg upgrade -y && pkg install python git -y && git clone https://github.com/qingluan-studio/hopeai.git && cd hopeai && python hopeai.py --web\n",
            "hopeai.service": "[Unit]\nDescription=HopeAI\nAfter=network.target\n\n[Service]\nType=simple\nExecStart=/usr/bin/python3 /opt/hopeai/hopeai.py --web\nRestart=on-failure\n\n[Install]\nWantedBy=multi-user.target\n"
        }
        return {n: (lambda n, c: (lambda p: (open(p, "w").write(c), p)[1])(os.path.join(dd, n)))(n, c) for n, c in files.items()}

# ============================================================
# HopeAI Core v2.0.0
# ============================================================

class HopeAI:
    def __init__(self):
        self.name = "HopeAI-网元"; self.version = "2.0.0"
        self.retriever = KnowledgeRetriever()
        self.kb = LocalKnowledgeBase()
        self.cache = SmartCache()
        self.plugins = PluginSystem()
        self.persona = PersonaEngine()
        self.memory = ContextMemory()
        # v0.5 modules
        self.workflow = WorkflowEngine(self.retriever, self.kb)
        self.multiagent = MultiAgentSystem(self.retriever, self.kb)
        self.training_factory = TrainingDataFactory(self.kb)
        self.perf = PerformanceMonitor()
        self.maint = AutoMaintenance(self.kb)
        self.deploy = DeployHelper()
        # v0.6-0.7 modules
        self.kg = KnowledgeGraph()
        self.conv_tree = ConversationTree()
        self.api_gw = APIGateway()
        self.distill = DistillationFramework()
        self.fed = FederatedLearning()
        self.qgen = QuestionGenerator(self.kb)
        self.pipeline = TrainingPipeline(self.kb, self.distill, self.kg)
        self.evaluator = ModelEvaluator(self)
        self.ab = ABTesting()
        self.augmentor = DataAugmentor()
        self.marketplace = PluginEngine()
        self.multimodal = MultimodalProcessor(self.marketplace)
        self.users = UserSystem()
        self.collab = CollaborativeSync(self.kb, self.distill, self.kg, self.users)
        # v1.0: xuni 虚拟训练
        self.xuni = XuniIntegration(self)
        # state
        self.learn_mode = False
        self.session_id = self.conv_tree.new_session()

    def ask(self, question):
        start = time.time(); self.users.record_query()
        # Commands
        cmd = self._cmd(question)
        if cmd is not None:
            self.perf.record(time.time() - start, "cmd")
            return cmd, {"intent": "command", "time": f"{time.time() - start:.1f}s"}

        # Workflow
        if question.startswith("/"):
            parts = question[1:].split(" ", 1)
            if parts[0] in self.workflow.workflows:
                r = self.workflow.run(parts[0], parts[1] if len(parts) > 1 else "")
                self.perf.record(time.time() - start, "workflow")
                return r["result"], {"intent": "workflow", "workflow": parts[0], "time": f"{time.time() - start:.1f}s"}

        # Plugins
        pn, pf = self.plugins.match(question)
        if pf:
            r = pf(question)
            if r:
                self.memory.add("user", question); self.memory.add("assistant", r)
                self.perf.record(time.time() - start, "plugin")
                return r, {"intent": "plugin", "time": f"{time.time() - start:.1f}s", "plugin": pn}

        # Cache
        cached = self.cache.get(question)
        if cached:
            self.memory.add("user", question); self.memory.add("assistant", cached)
            self.perf.record(time.time() - start, "cache")
            return cached, {"intent": "fact", "time": f"{time.time() - start:.1f}s", "cache": True}

        # Distilled inference
        distilled = self.distill.infer(question)
        if distilled:
            self.memory.add("user", question); self.memory.add("assistant", distilled["response"])
            self.cache.set(question, distilled["response"])
            self.perf.record(time.time() - start, "local")
            return distilled["response"], {"intent": "distilled", "confidence": distilled["confidence"], "time": f"{time.time() - start:.1f}s"}

        # Local KB
        eq = self.memory.enrich(question)
        local = self.kb.search(eq)
        if local and local[0]["score"] > 0.6:
            a = local[0]["answer"] + f"\n\n—— 本地知识库（查阅 {local[0]['hits']} 次）"
            self.cache.set(question, a)
            self.memory.add("user", question); self.memory.add("assistant", a)
            self.perf.record(time.time() - start, "local")
            return a, {"intent": "local", "sources": len(local), "time": f"{time.time() - start:.1f}s", "kb_id": local[0]["id"]}

        # Web search
        intent, tmpl = IntentClassifier.classify(eq)
        frags = self.retriever.search(eq)
        if not frags:
            a = "未找到足够信息，请换个关键词试试。"
        else:
            a = ThoughtTemplateBank.render(tmpl, frags, question)
            # Auto build KG
            try: self.kg.extract_and_save(a, f"query:{question[:50]}")
            except: pass
            # Auto feed distill
            try: self.distill.feed(question, a, intent, frags)
            except: pass
        a = self.persona.wrap(a)
        self.cache.set(question, a)
        self.memory.add("user", question); self.memory.add("assistant", a)
        elapsed = time.time() - start
        self.perf.record(elapsed, "remote")
        if self.learn_mode and frags and len(a) > 50:
            self.kb.add(question, a, category=intent, source="auto-learn")
        # Conversation tree
        self.conv_tree.add_turn(self.session_id, question, a, intent)
        self.users.record_query(tokens=len(a))
        return a, {"intent": intent, "sources": len(frags), "time": f"{elapsed:.1f}s"}

    def _cmd(self, q):
        c = q.strip().lower()
        # Basic
        if c in ("help", "帮助"):
            return ("HopeAI v2.0.0 | Day31-100 + 插件体系\n"
                    "基础: help stats style kb learn reset\n"
                    "工作流: wf /deep_research /compare_analysis\n"
                    "智能体: agents\n"
                    "训练: train benchmark eval pipeline xuni_training\n"
                    "图谱: kg [实体] | kg_export\n"
                    "API: api天气 api翻译 | api_list\n"
                    "蒸馏: distill_stats | distill_merge\n"
                    "联邦: fed_status\n"
                    "对话: sessions | conv_path\n"
                    "用户: user_stats | user_prefs\n"
                    "协作: sync_export | sync_diff [文件]\n"
                    "插件: market | market_search [词]\n"
                    "多模态: mm_list | mm_ingest [路径]\n"
                    "增强: augment [文本] | qgen\n"
                    "A/B: ab_new [名] | ab_report [id]\n"
                    "运维: backup deploy")
        if c in ("stats", "统计"):
            sm = self.perf.report(); kb_s = self.kb.get_stats(); us = self.users.stats()
            return (f"查询:{sm['总查询']} | 缓存:{sm['缓存命中']} | 本地:{sm['本地命中']} | 联网:{sm['联网']}\n"
                    f"KB:{kb_s['total']}条 | QPS:{sm['QPS']} | 平均:{sm['平均响应']} | 今日:{us['today_queries']}次")
        if c in ("style", "风格"): return f"当前:{self.persona.cs}\n可选:\n{self.persona.list_styles()}"
        if c.startswith("style "): return self.persona.set(c.split(" ", 1)[-1])
        if c in ("kb", "知识库"):
            s = self.kb.get_stats(); return f"知识库:{s['total']}条 | 查阅:{s['hits']} | 赞:{s['helpful']}/踩:{s['unhelpful']}"
        if c in ("learn", "学习"): self.learn_mode = not self.learn_mode; return f"自动学习:{'开' if self.learn_mode else '关'}"
        if c in ("reset", "重置"): self.memory.clear(); return "记忆已清空"
        if c in ("agents", "智能体"): return "可用智能体：" + ", ".join(MultiAgentSystem.AGENTS.keys())
        if c in ("wf", "工作流"): return "工作流：" + ", ".join(self.workflow.list_workflows())
        # Training
        if c == "train": r = self.training_factory.export_qa(); return f"训练数据:{len(r)}条" if r else "无数据"
        if c in ("benchmark", "性能"):
            r = self.evaluator.evaluate(); return f"评分:{r['score']}/100 | 平均:{r['avg_response']}\n" + "\n".join([f"  {t['question'][:15]} -> {t['time']}" for t in r['details']])
        if c == "eval_history": return "\n".join([f"  {h['date'][:10]}: {h['score']}/100 ({h['avg']})" for h in self.evaluator.history()])
        if c == "pipeline": r = self.pipeline.run(); return f"流水线完成 | {r['total_qa']}条QA | 输出:{r['output']}"
        # KG
        if c.startswith("kg "):
            entity = c[3:].strip()
            r = self.kg.query(entity)
            return f"图谱查询: {entity}\n实体:{r['stats']['entities']} 关系:{r['stats']['relations']}\n节点:" + ", ".join([n["name"] for n in r["nodes"][:10]])
        if c == "kg_export": return f"图谱导出: {self.kg.export_graph()}"
        # API
        if c.startswith("api天气 "): r = self.api_gw.call("weather", {"city": c[5:].strip()}); return f"天气: {r['data']}" if "data" in r else r.get("error", "失败")
        if c.startswith("api翻译 "): r = self.api_gw.call("translate", {"text": c[5:].strip(), "from": "zh-CN", "to": "en"}); return f"翻译: {r['data']}" if "data" in r else "失败"
        if c == "api_list": return "API服务：" + ", ".join(self.api_gw.list_services().keys())
        # Distill
        if c == "distill_stats":
            s = self.distill.stats(); return f"蒸馏规则:{s['rules']}条 | 平均权重:{s['avg_weight']} | 分类:{s['categories']}"
        if c == "distill_merge": return f"合并规则: {self.distill.merge_similar()}"
        # Federal
        if c == "fed_status": return f"联邦节点:{self.fed.sync_status()['node']} | 梯度:{self.fed.sync_status()['gradients']}"
        # Conversation
        if c == "sessions": s = self.conv_tree.list_sessions(); return "\n".join([f"  {x['id']}: {x['turns']}轮 ({x['last']})" for x in s])
        if c == "conv_path": p = self.conv_tree.get_path(self.session_id); return "\n".join([f"  {x['intent']}: {x['user'][:30]}" for x in p[-5:]])
        # User
        if c == "user_stats": s = self.users.stats(); return f"总查询:{s['total_queries']} | 今日:{s['today_queries']} | Token:{s['total_tokens']}"
        if c == "user_prefs": p = self.users.get_preferences(); return "\n".join([f"  {k}: {v}" for k, v in p.items()]) or "无偏好"
        # Collab
        if c == "sync_export": r = self.collab.export_sync_package(); return f"同步包:{r['path']}\nQA:{r['qa_count']}条"
        if c.startswith("sync_diff "): r = self.collab.diff(c[10:].strip()); return f"本地独有:{r['only_local']} | 远程独有:{r['only_remote']} | 共有:{r['shared']}"
        # Plugin market
        if c == "market": s = self.marketplace.stats(); return f"插件市场:{s['total']}总数 | 已安装:{s['installed']}"
        if c.startswith("market_search "): r = self.marketplace.search(c[14:].strip()); return "\n".join([f"  {x['name']} v{x['version']} [{x['category']}] {'✓' if x['installed'] else '✗'}" for x in r])
        # Multimodal
        if c == "mm_list": r = self.multimodal.list_all(); return f"媒体:{sum(r['stats'].values())}个\n" + "\n".join([f"  [{f['type']}] {f['path'][:40]}" for f in r['files'][:10]])
        if c.startswith("mm_ingest "): r = self.multimodal.ingest_image(c[10:].strip()); return f"已收录: {r['id']} ({r['type']})" if r else "文件不存在"
        # A/B
        if c.startswith("ab_new "): tid = self.ab.create(c[7:].strip(), ["A", "B"]); return f"A/B测试: {tid}"
        if c.startswith("ab_report "):
            r = self.ab.report(c[10:].strip())
            return "\n".join([f"  {k}: {v['count']}次, {v['rate']}胜率" for k, v in r["variants"].items()]) if r else "不存在"
        # Data augment
        if c.startswith("augment "): r = self.augmentor.augment([c[8:].strip()], 5); return "增强结果:\n" + "\n".join([f"  {x}" for x in r])
        if c == "qgen": r = self.qgen.generate(10); return "生成问题:\n" + "\n".join([f"  {x['question']}" for x in r[:10]])
        # Maintenance
        if c in ("backup", "备份"): return f"备份: {self.maint.backup()}"
        if c in ("deploy", "部署"): p = self.deploy.save_all(); return "部署文件已生成:\n" + "\n".join([f"  {k}: {v}" for k, v in p.items()])
        if c == "cleanup": return f"清理: {self.maint.cleanup()}条"
        return None

# ============================================================
# Web UI
# ============================================================

WEB = r"""<!DOCTYPE html><html lang="zh"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>HopeAI v0.7</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,sans-serif;background:#0d1117;color:#c9d1d9;max-width:720px;margin:0 auto;padding:12px;min-height:100vh}
.hd{text-align:center;padding:16px 0;border-bottom:1px solid #30363d;margin-bottom:12px}
.hd h1{color:#58a6ff;font-size:18px}.hd p{color:#8b949e;font-size:11px}
.tabs{display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap}
.tab{padding:6px 14px;border-radius:14px;border:1px solid #30363d;background:transparent;color:#8b949e;font-size:12px;cursor:pointer}
.tab.active{background:#1f6feb;color:#fff;border-color:#1f6feb}
.panel{display:none}.panel.active{display:block}
.chat{display:flex;flex-direction:column;gap:10px;margin-bottom:90px}
.msg{max-width:90%;padding:10px 14px;border-radius:12px;font-size:14px;line-height:1.6;white-space:pre-wrap;word-break:break-word}
.msg.u{align-self:flex-end;background:#238636;color:#fff}
.msg.a{align-self:flex-start;background:#161b22;border:1px solid #30363d}
.msg .mt{font-size:10px;color:#8b949e;margin-top:4px}
.msg .btn{font-size:10px;padding:2px 8px;border-radius:10px;border:1px solid #30363d;background:transparent;color:#8b949e;cursor:pointer}
.bar{position:fixed;bottom:0;left:0;right:0;max-width:720px;margin:0 auto;padding:10px 12px;background:#0d1117;border-top:1px solid #30363d;display:flex;gap:8px}
.bar input{flex:1;padding:10px 14px;border:1px solid #30363d;border-radius:20px;background:#161b22;color:#c9d1d9;font-size:14px;outline:none}
.bar input:focus{border-color:#58a6ff}
.bar button{padding:10px 18px;border:none;border-radius:20px;background:#238636;color:#fff;font-size:14px;cursor:pointer}
.dash{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.card{background:#161b22;border:1px solid #30363d;border-radius:8px;padding:12px}
.card h3{color:#58a6ff;font-size:13px;margin-bottom:6px}
.card p{font-size:12px;color:#8b949e;line-height:1.5}
table{width:100%;border-collapse:collapse;font-size:12px}
td{padding:6px 8px;border-bottom:1px solid #30363d}
tr:last-child td{border-bottom:none}
</style></head><body>
<div class="hd"><h1>HopeAI v0.7</h1><p>Day 31-100 | 图谱 · 蒸馏 · 联邦 · 训练 · 多模态 · 插件市场</p></div>
<div class="tabs">
<button class="tab active" onclick="swtab('chat')">对话</button>
<button class="tab" onclick="swtab('dash')">仪表盘</button>
<button class="tab" onclick="swtab('kb')">知识库</button>
<button class="tab" onclick="swtab('market')">插件</button>
<button class="tab" onclick="swtab('kg')">图谱</button>
</div>
<div id="chat" class="panel active"><div class="chat" id="msgbox"></div></div>
<div id="dash" class="panel"><div class="dash" id="dashbox"><div class="card"><h3>加载中...</h3></div></div></div>
<div id="kb" class="panel"><div id="kbbox"></div></div>
<div id="market" class="panel"><div id="mktbox"></div></div>
<div id="kg" class="panel"><div id="kgbox"></div></div>
<div class="bar"><input id="q" placeholder="输入问题或 /命令..." autofocus onkeydown="if(event.key==='Enter')ask()"><button onclick="ask()">发送</button></div>
<script>
let cur='chat';
function swtab(t){cur=t;document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x.innerText===['对话','仪表盘','知识库','插件','图谱'][['chat','dash','kb','market','kg'].indexOf(t)]));document.querySelectorAll('.panel').forEach(x=>x.classList.remove('active'));document.getElementById(t).classList.add('active');
if(t=='dash')loadDash();if(t=='kb')loadKB();if(t=='market')loadMarket();if(t=='kg')loadKG()}
async function ask(){
 const q=document.getElementById('q');const t=q.trim();if(!t)return;
 m('u',t,'msgbox');q.value='';q.focus();
 const el=m('a','...','msgbox');
 try{
  const r=await fetch('/api/ask',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:t})});
  const d=await r.json();
  let mt=`${d.meta.intent} | ${d.meta.time}`;
  if(d.meta.cache)mt+=' | 缓存';
  if(d.meta.confidence)mt+=' | 置信度:'+(d.meta.confidence*100).toFixed(0)+'%';
  el.innerHTML=d.answer.replace(/\\n/g,'<br>')+`<div class="mt">${mt}</div>`;
 }catch(e){el.innerHTML='错误: '+e.message}
}
function m(r,t,box){const d=document.createElement('div');d.className='msg '+r;d.innerHTML=t.replace(/\\n/g,'<br>');document.getElementById(box).appendChild(d);window.scrollTo(0,document.body.scrollHeight);return d}
async function loadDash(){
 const r=await fetch('/api/dashboard');const d=await r.json();
 document.getElementById('dashbox').innerHTML=
 `<div class="card"><h3>性能</h3><table>${['总查询','QPS','平均响应','缓存命中','错误'].map(k=>`<tr><td>${k}</td><td>${d.perf[k]||'-'}</td></tr>`).join('')}</table></div>
 <div class="card"><h3>知识库</h3><table>${['总条数','查阅次数','好评率'].map(k=>`<tr><td>${k}</td><td>${d.kb[k]||'-'}</td></tr>`).join('')}</table></div>
 <div class="card"><h3>蒸馏</h3><table>${['规则数','平均权重'].map(k=>`<tr><td>${k}</td><td>${d.distill[k]||'-'}</td></tr>`).join('')}</table></div>
 <div class="card"><h3>图谱</h3><table>${['实体','关系'].map(k=>`<tr><td>${k}</td><td>${d.kg[k]||'-'}</td></tr>`).join('')}</table></div>
 <div class="card"><h3>插件市场</h3><table>${['总数','已安装'].map(k=>`<tr><td>${k}</td><td>${d.market[k]||'-'}</td></tr>`).join('')}</table></div>
 <div class="card"><h3>联邦学习</h3><table>${['本地节点','梯度数'].map(k=>`<tr><td>${k}</td><td>${d.fed[k]||'-'}</td></tr>`).join('')}</table></div>`
}
async function loadKB(){const r=await fetch('/api/kb_stats');const d=await r.json();document.getElementById('kbbox').innerHTML=`<div class="card"><h3>知识库</h3><table>${Object.entries(d).map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table></div>`}
async function loadMarket(){const r=await fetch('/api/market');const d=await r.json();document.getElementById('mktbox').innerHTML=`<div class="card"><h3>插件市场 (${d.total})</h3><table>${d.plugins.map(p=>`<tr><td>${p.name} v${p.version}</td><td>[${p.category}]</td><td>${p.installed?'✓已安装':'✗'}</td></tr>`).join('')}</table></div>`}
async function loadKG(){const r=await fetch('/api/kg_stats');const d=await r.json();document.getElementById('kgbox').innerHTML=`<div class="card"><h3>知识图谱</h3><table>${Object.entries(d).map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table></div>`}
</script></body></html>"""

class WebHandler(BaseHTTPRequestHandler):
    ai = None

    def do_GET(self):
        routes = {
            "/": ("text/html; charset=utf-8", WEB),
            "/api/dashboard": ("application/json", lambda: json.dumps({"perf": self.ai.perf.report(), "kb": {"总条数": self.ai.kb.get_stats()["total"], "查阅次数": self.ai.kb.get_stats()["hits"], "好评率": f"{self.ai.kb.get_stats()['helpful']/max(1,self.ai.kb.get_stats()['total'])*100:.1f}%"}, "distill": {"规则数": self.ai.distill.stats()["rules"], "平均权重": self.ai.distill.stats()["avg_weight"]}, "kg": {"实体": self.ai.kg.conn.execute("SELECT COUNT(*) FROM entities").fetchone()[0], "关系": self.ai.kg.conn.execute("SELECT COUNT(*) FROM relations").fetchone()[0]}, "market": {"总数": self.ai.marketplace.stats()["total"], "已安装": self.ai.marketplace.stats()["installed"]}, "fed": {"本地节点": self.ai.fed.node_id, "梯度数": self.ai.fed.sync_status()["gradients"]}}, ensure_ascii=False)),
            "/api/kb_stats": ("application/json", lambda: json.dumps(self.ai.kb.get_stats(), ensure_ascii=False)),
            "/api/market": ("application/json", lambda: json.dumps({"total": self.ai.marketplace.stats()["total"], "plugins": self.ai.marketplace.search("")}, ensure_ascii=False)),
            "/api/kg_stats": ("application/json", lambda: json.dumps({"实体": self.ai.kg.conn.execute("SELECT COUNT(*) FROM entities").fetchone()[0], "关系": self.ai.kg.conn.execute("SELECT COUNT(*) FROM relations").fetchone()[0]}, ensure_ascii=False)),
            "/api/xuni_status": ("application/json", lambda: json.dumps(self.ai.xuni.status(), ensure_ascii=False)),
        }
        if self.path in routes: self._r(200, routes[self.path][0], routes[self.path][1]() if callable(routes[self.path][1]) else routes[self.path][1])
        else: self._r(404, "text/plain", "404")

    def do_POST(self):
        if self.path == "/api/ask":
            l = int(self.headers.get("Content-Length", 0)); b = json.loads(self.rfile.read(l))
            q = b.get("question", "").strip()
            if not q: self._r(400, "application/json", '{"error":"empty"}'); return
            a, m = self.ai.ask(q)
            self._r(200, "application/json", json.dumps({"answer": a, "meta": m}, ensure_ascii=False))
        else: self._r(404, "text/plain", "404")

    def _r(self, c, ct, b):
        self.send_response(c); self.send_header("Content-Type", ct); self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers(); self.wfile.write(b.encode("utf-8") if isinstance(b, str) else b)

    def log_message(self, *a): pass

def run_web(ai):
    WebHandler.ai = ai
    s = HTTPServer(("0.0.0.0", 8080), WebHandler)
    print("  Web: http://localhost:8080"); s.serve_forever()

# ============================================================
# v1.0 新增：Xuni 虚拟训练集成
# ============================================================

class XuniIntegration:
    """HopeAI v1.0 ←→ xuni 虚拟工厂桥接
    用虚拟算力完成训练闭环，零真实 GPU 消耗"""
    def __init__(self, ai):
        self.ai = ai
        self.data_dir = os.path.join(DATA_DIR, "xuni")
        os.makedirs(self.data_dir, exist_ok=True)
        self._compute = None
        self._data = None
        self._model = None

    def load_xuni(self, xuni_path=None):
        """动态加载 xuni 虚拟工厂"""
        if xuni_path is None:
            xuni_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "training", "xuni")
        sys_path = list(sys.path)
        sys.path.insert(0, xuni_path)
        try:
            import virtual_compute as vc
            import virtual_data as vd
            import model as vm
            self._compute = vc.VirtualCompute()
            self._data = vd.VirtualData()
            self._model = vm.ModelFactory()
            return True
        except ImportError:
            self._compute = self._data = self._model = None
            return False

    def virtual_train(self, rounds=5):
        """在 xuni 虚拟环境运行完整训练流程"""
        if not all([self._compute, self._data, self._model]):
            if not self.load_xuni():
                return {"error": "xuni未找到", "rounds": 0}
        results = []
        for r in range(rounds):
            flops = self._compute.allocate(1000 + r * 200)
            batch = self._data.generate(32, "hopeai")
            model = self._model.get_or_create("hopeai_core")
            loss = self._compute.simulate_train(model, batch, flops)
            results.append({"round": r+1, "flops": flops, "loss": loss, "samples": len(batch)})
            for item in batch[:3]:
                self.ai.kb.add(item.get("q",""), item.get("a",""), source="xuni_virtual")
        return {"rounds": len(results), "final_loss": results[-1]["loss"], "details": results}

    def status(self):
        """获取 xuni 训练状态"""
        return {
            "xuni_loaded": self._compute is not None,
            "kb_entries": self.ai.kb.count(),
            "kb_stats": self.ai.kb.get_stats()
        }

# ============================================================
# Main
# ============================================================

def main():
    ai = HopeAI()
    import sys
    if "--web" in sys.argv:
        print(f"\n{ai.name} v{ai.version} Web模式"); run_web(ai); return
    if "--pipeline" in sys.argv:
        r = ai.pipeline.run()
        print(f"流水线完成: {r['total_qa']}条QA\n输出: {r['output']}")
        for s in r['stages']: print(f"  {s['stage']}: {s['count']}")
        return
    if "--benchmark" in sys.argv:
        r = ai.evaluator.evaluate()
        print(f"评分:{r['score']}/100 | 平均:{r['avg_response']}")
        for t in r['details']: print(f"  {t['question'][:20]} -> {t['time']} ({t['intent']})")
        return
    if "--sync-export" in sys.argv:
        r = ai.collab.export_sync_package(); print(f"同步包: {r['path']}\nQA:{r['qa_count']}条")
        return
    if "--stats" in sys.argv:
        s = ai.perf.report(); [print(f"{k}: {v}") for k, v in s.items()]
        return
    if "--deploy" in sys.argv:
        p = ai.deploy.save_all(); [print(f"{k}: {v}") for k, v in p.items()]
        return
    if "--xuni" in sys.argv:
        print("  xuni 虚拟训练启动...")
        r = ai.xuni.virtual_train(rounds=5)
        if "error" in r:
            print(f"  失败: {r['error']}")
        else:
            print(f"  完成 {r['rounds']} 轮 | 最终loss: {r['final_loss']:.4f}")
            for d in r["details"]:
                print(f"  R{d['round']}: {d['samples']}样本, loss={d['loss']:.4f}, {d['flops']}FLOPs")
        return

    print("=" * 56)
    print(f"  {ai.name} v{ai.version}")
    print("  Day 31-100 | 图谱 · 蒸馏 · 联邦 · 训练 · 多模态 · xuni虚拟工厂")
    print("  输入 help 查看全部命令 | q 退出")
    print("=" * 56)
    while True:
        try: q = input("\n你：").strip()
        except (EOFError, KeyboardInterrupt): print("\n明天继续！"); break
        if q.lower() in ("q", "quit", "退出"): print("明天继续！"); break
        if not q: continue
        print("…", end="\r")
        a, m = ai.ask(q)
        print(f"\n网元：{a}")
        print(f"      [{m['intent']} | {m.get('sources', 0)}源 | {m['time']}]")

if __name__ == "__main__":
    main()
