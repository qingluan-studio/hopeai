#!/usr/bin/env python3
# HopeAI v3.0.0 - P2P同步 + 自进化闭环 + 完整插件库
# 八年架构：图谱 | 蒸馏 | 联邦 | 训练 | 多模态 | xuni | 插件 | P2P | 自进化

import json, re, time, os, hashlib, sqlite3, random, math, shutil, itertools, sys
import urllib.request, urllib.parse, urllib.error, base64, struct, io, threading, queue
from datetime import datetime, timezone
from http.server import HTTPServer, BaseHTTPRequestHandler
from collections import OrderedDict, defaultdict, deque

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "hopeai_data")
ALL_DIRS = ["backups","training","workflows","logs","deploy","graphs","models",
            "conversations","api_cache","plugins","users","eval","abtest",
            "multimodal","collab","xuni","sync","evolution"]
for d in ALL_DIRS: os.makedirs(os.path.join(DATA_DIR, d), exist_ok=True)

# ============================================================
# v3.0: P2P同步引擎
# ============================================================

class P2PSyncEngine:
    """去中心化SQLite差分同步"""

    def __init__(self, db_path):
        self.db_path = db_path
        conn = sqlite3.connect(self.db_path)
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS _sync_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT, table_name TEXT, row_id TEXT,
                operation TEXT, ts REAL, hash TEXT, peer_id TEXT, merged INTEGER DEFAULT 0);
            CREATE TABLE IF NOT EXISTS _sync_peers (
                peer_id TEXT PRIMARY KEY, last_seen REAL, endpoint TEXT, trust INTEGER DEFAULT 1);
            CREATE INDEX IF NOT EXISTS idx_sync_ts ON _sync_log(ts);
        """)
        conn.commit(); conn.close()

    @property
    def peer_id(self):
        return f"peer-{hashlib.md5(self.db_path.encode()).hexdigest()[:8]}"

    def export_sync_package(self, since_ts=None):
        conn = sqlite3.connect(self.db_path)
        if since_ts is None:
            since_ts = conn.execute("SELECT MAX(ts) FROM _sync_log WHERE merged=1").fetchone()[0] or 0
        rows = conn.execute(
            "SELECT table_name,row_id,operation,ts,hash FROM _sync_log WHERE ts>? AND merged=1 ORDER BY ts",
            (since_ts,)).fetchall()

        changes, seen = [], set()
        for table, rid, op, ts, h in rows:
            key = (table, rid)
            if key in seen: continue
            seen.add(key)
            if op in ("INSERT","UPDATE"):
                cols = [c[1] for c in conn.execute(f"PRAGMA table_info({table})").fetchall()]
                row_data = conn.execute(f"SELECT * FROM {table} WHERE rowid=?", (rid,)).fetchone()
                if row_data:
                    changes.append({"table":table,"row_id":rid,"operation":op,
                        "data":dict(zip(cols,row_data)),"ts":ts,"hash":h})
            elif op == "DELETE":
                changes.append({"table":table,"row_id":rid,"operation":"DELETE","ts":ts,"hash":h})
        conn.close()
        pkg = {"format":"hopeai-sync-v1","from_ts":since_ts,"to_ts":time.time(),
               "peer_id":self.peer_id,"changes":changes}
        pkg["checksum"] = hashlib.sha256(json.dumps(changes,default=str).encode()).hexdigest()
        return pkg

    def import_sync_package(self, package, peer_id="remote"):
        if not package.get("changes"): return {"ok":True,"merged":0,"conflicts":0}
        conn = sqlite3.connect(self.db_path)
        merged = conflicts = 0
        for change in package["changes"]:
            table, data, row_id, op, ts = change["table"], change.get("data",{}), change["row_id"], change["operation"], change.get("ts",time.time())
            existing = conn.execute(f"SELECT * FROM {table} WHERE rowid=?",(row_id,)).fetchone()
            if op == "DELETE" and existing:
                conn.execute(f"DELETE FROM {table} WHERE rowid=?",(row_id,)); merged += 1
            elif op in ("INSERT","UPDATE"):
                if existing:
                    ext = conn.execute("SELECT ts FROM _sync_log WHERE table_name=? AND row_id=? ORDER BY ts DESC LIMIT 1",
                        (table,str(row_id))).fetchone()
                    if ext and ext[0] < ts:
                        self._upsert(conn,table,data,row_id); merged += 1
                    else: conflicts += 1
                else:
                    self._upsert(conn,table,data,row_id); merged += 1
            conn.execute("INSERT INTO _sync_log(table_name,row_id,operation,ts,hash,peer_id,merged) VALUES(?,?,?,?,?,?,1)",
                (table,str(row_id),op,ts,change.get("hash",""),peer_id))
        conn.execute("INSERT OR REPLACE INTO _sync_peers(peer_id,last_seen) VALUES(?,?)",(peer_id,time.time()))
        conn.commit(); conn.close()
        return {"ok":True,"merged":merged,"conflicts":conflicts}

    def _upsert(self, conn, table, data, row_id=None):
        cols = [c[1] for c in conn.execute(f"PRAGMA table_info({table})").fetchall() if c[1]!="rowid"]
        vals = [data.get(c) for c in cols]
        ph = ",".join(["?"]*len(cols)); cs = ",".join(cols)
        if row_id:
            up = ",".join([f"{c}=excluded.{c}" for c in cols])
            conn.execute(f"INSERT INTO {table}(rowid,{cs}) VALUES(?{',' if cs else ''}{ph}) ON CONFLICT(rowid) DO UPDATE SET {up}",(row_id,*vals))
        else:
            conn.execute(f"INSERT INTO {table}({cs}) VALUES({ph})",vals)

    def get_peers(self):
        conn = sqlite3.connect(self.db_path)
        peers = [dict(zip(["peer_id","last_seen","endpoint","trust"],r)) for r in conn.execute("SELECT * FROM _sync_peers").fetchall()]
        conn.close(); return peers

    def get_sync_status(self):
        conn = sqlite3.connect(self.db_path)
        total = conn.execute("SELECT COUNT(*) FROM _sync_log").fetchone()[0]
        merged = conn.execute("SELECT COUNT(*) FROM _sync_log WHERE merged=1").fetchone()[0]
        peers = conn.execute("SELECT COUNT(*) FROM _sync_peers").fetchone()[0]
        conn.close()
        return {"total_ops":total,"merged_ops":merged,"pending":total-merged,"known_peers":peers}


# ============================================================
# v3.0: 自进化闭环引擎
# ============================================================

class SelfEvolutionLoop:
    """在线学习 + 失败信号回灌 + xuni虚拟闭环"""

    def __init__(self, db_path):
        self.db_path = db_path
        self.feedback_queue = queue.Queue()
        self.running = False
        self.stats = {"processed":0,"improved":0,"last_run":None}
        conn = sqlite3.connect(db_path)
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS _feedback (id INTEGER PRIMARY KEY AUTOINCREMENT, ts REAL, query TEXT,
                plugin TEXT, result TEXT, rating INTEGER, error_type TEXT, resolved INTEGER DEFAULT 0);
            CREATE TABLE IF NOT EXISTS _corrections (id INTEGER PRIMARY KEY AUTOINCREMENT, pattern TEXT UNIQUE,
                correction TEXT, weight REAL DEFAULT 1.0, added_ts REAL, hit_count INTEGER DEFAULT 0);
        """)
        conn.commit(); conn.close()

    def start(self):
        if self.running: return
        self.running = True
        self._thread = threading.Thread(target=self._learn_loop, daemon=True)
        self._thread.start()

    def stop(self):
        self.running = False

    def feedback(self, query, plugin, result, rating=3, error_type=None):
        conn = sqlite3.connect(self.db_path)
        conn.execute("INSERT INTO _feedback(ts,query,plugin,result,rating,error_type) VALUES(?,?,?,?,?,?)",
            (time.time(), query, plugin, str(result)[:200], rating, error_type))
        conn.commit(); conn.close()
        self.feedback_queue.put((query, plugin, result, rating, error_type))

    def _learn_loop(self):
        batch = []
        while self.running:
            try:
                item = self.feedback_queue.get(timeout=5)
                batch.append(item)
                if len(batch) >= 10:
                    self._process_batch(batch); batch = []
            except queue.Empty:
                if batch: self._process_batch(batch); batch = []

    def _process_batch(self, batch):
        improvements = 0
        for query, plugin, result, rating, error_type in batch:
            if rating is None: continue
            pattern = f"{plugin}|{error_type or 'ok'}|{hashlib.md5(query.encode()).hexdigest()[:6]}"
            conn = sqlite3.connect(self.db_path)
            if rating <= 2:
                existing = conn.execute("SELECT hit_count FROM _corrections WHERE pattern=?",(pattern,)).fetchone()
                if existing:
                    conn.execute("UPDATE _corrections SET hit_count=hit_count+1,weight=weight*1.1 WHERE pattern=?",(pattern,))
                else:
                    conn.execute("INSERT INTO _corrections(pattern,correction,weight,added_ts) VALUES(?,?,?,?)",
                        (pattern,f"auto_fix_{len(pattern)}",1.0,time.time()))
                improvements += 1
            elif rating >= 4:
                conn.execute("UPDATE _corrections SET weight=weight*1.05 WHERE pattern=?",(pattern,))
            conn.commit(); conn.close()
        self.stats["processed"] += len(batch)
        self.stats["improved"] += improvements
        self.stats["last_run"] = time.time()

    def get_corrections(self, limit=20):
        conn = sqlite3.connect(self.db_path)
        rows = conn.execute("SELECT pattern,correction,weight,hit_count FROM _corrections ORDER BY weight DESC LIMIT ?",(limit,)).fetchall()
        conn.close()
        return [{"pattern":r[0],"correction":r[1],"weight":r[2],"hits":r[3]} for r in rows]

    def get_stats(self):
        return {**self.stats,"queue_size":self.feedback_queue.qsize()}


# ============================================================
# v3.0: 插件热加载引擎 (增强版)
# ============================================================

class PluginEngine:
    """插件热加载：支持 tool/multimodal/community 三类"""

    def __init__(self):
        self._plugins = {}
        self._plugin_info = {}

    def load_all(self, plugin_dir=None):
        if plugin_dir is None:
            plugin_dir = os.path.join(DATA_DIR, "plugins")
        os.makedirs(plugin_dir, exist_ok=True)
        loaded = 0
        for cat in ["official","multimodal","community"]:
            cat_dir = os.path.join(plugin_dir, cat)
            if not os.path.isdir(cat_dir): continue
            for fname in sorted(os.listdir(cat_dir)):
                if fname.endswith(".py") and not fname.startswith("_"):
                    path = os.path.join(cat_dir, fname)
                    try:
                        ns = {}
                        exec(open(path).read(), ns)
                        if "plugin" in ns:
                            p = ns["plugin"]
                            self._plugins[p.name] = p
                            self._plugin_info[p.name] = {
                                "name":p.name,"version":p.version,"author":p.author,
                                "description":p.description,"category":p.category,
                                "network":getattr(p,"requires_network",False)
                            }
                            if hasattr(p, "on_load"): p.on_load()
                            loaded += 1
                    except Exception as e:
                        print(f"  [Plugin] {fname} 加载失败: {e}")
        return loaded

    def list_plugins(self):
        return list(self._plugin_info.values())

    def has(self, name):
        return name in self._plugins

    def get(self, name):
        return self._plugins.get(name)

    def run(self, name, input_data, context=None):
        p = self._plugins.get(name)
        if not p:
            return {"ok":False,"result":f"插件 {name} 未找到"}
        try:
            return p.run(input_data, context)
        except Exception as e:
            return {"ok":False,"result":str(e)}

    def stats(self):
        return {"total":len(self._plugins),"loaded":len(self._plugins),
                "categories":list(set(p.category for p in self._plugin_info.values()))}


# ============================================================
# 精简核心: HopeAI v3.0
# ============================================================

class HopeAI:
    def __init__(self):
        self.name = "HopeAI - 网元"
        self.version = "3.0.0"

        # 知识库
        self.kb_db = os.path.join(DATA_DIR, "training", "kb.db")
        self._init_kb()

        # 插件引擎
        self.plugins = PluginEngine()
        self.plugins.load_all()

        # P2P同步
        self.p2p = P2PSyncEngine(self.kb_db)

        # 自进化
        self.evolution = SelfEvolutionLoop(self.kb_db)
        self.evolution.start()

        # 性能统计
        self._perf = {"total_q":0,"qps":0,"avg_time":0,"cache_hits":0,"errors":0,"last_reset":time.time()}
        self._cache = {}
        self._stats_lock = threading.Lock()

    def _init_kb(self):
        os.makedirs(os.path.dirname(self.kb_db), exist_ok=True)
        conn = sqlite3.connect(self.kb_db)
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS knowledge (id INTEGER PRIMARY KEY AUTOINCREMENT, question TEXT,
                answer TEXT, tags TEXT, source TEXT, confidence REAL DEFAULT 1.0, hits INTEGER DEFAULT 0,
                helpful INTEGER DEFAULT 0, created REAL, updated REAL);
            CREATE INDEX IF NOT EXISTS idx_kb_q ON knowledge(question);
            CREATE INDEX IF NOT EXISTS idx_kb_src ON knowledge(source);
            CREATE INDEX IF NOT EXISTS idx_kb_conf ON knowledge(confidence);
        """)
        conn.commit(); conn.close()

    # ---- 意图分类 ----
    INTENTS = {
        "plugin": [r"插件|plugin",r"翻译|translate",r"天气|weather",r"新闻|news",
                   r"审查|review",r"ocr|识别图片",r"语音|音频|转录",r"工作流|orchestrat"],
        "knowledge": [r"什么|怎么|如何|为什么|定义|解释|介绍"],
        "sync": [r"同步|p2p|节点|peer"],
        "evolve": [r"进化|学习|反馈|训练"],
        "chat": [r".*"],
    }

    def _classify_intent(self, q):
        for intent, patterns in self.INTENTS.items():
            for p in patterns:
                if re.search(p, q):
                    return intent
        return "chat"

    # ---- 多源检索 ----
    def _search_kb(self, q):
        conn = sqlite3.connect(self.kb_db)
        words = q.replace("？","").replace("?","").split()
        clauses = " OR ".join(["question LIKE ?" for _ in words])
        params = [f"%{w}%" for w in words if len(w)>=2]
        if not params:
            params = [f"%{q[:6]}%"]
            clauses = "question LIKE ?"
        rows = conn.execute(
            f"SELECT question,answer,confidence,source FROM knowledge WHERE {clauses} ORDER BY confidence DESC LIMIT 5",
            params).fetchall()
        conn.close()
        return rows

    def _search_external(self, q):
        try:
            url = f"https://api.duckduckgo.com/?q={urllib.parse.quote(q)}&format=json&no_html=1"
            r = json.loads(urllib.request.urlopen(url, timeout=5).read())
            abstract = r.get("AbstractText","")
            if abstract: return abstract
            topics = r.get("RelatedTopics",[])
            return " | ".join([t.get("Text","") for t in topics[:3] if t.get("Text")])
        except:
            return None

    # ---- 知识合成 ----
    def _synthesize(self, intent, q, kb_results, ext_result, plugin_result):
        parts = []

        # 插件结果优先
        if plugin_result and plugin_result.get("ok"):
            parts.append(plugin_result["result"])

        # 知识库结果
        if kb_results:
            best = kb_results[0]
            if best[2] > 0.5:
                parts.append(best[1])
            else:
                parts.extend([r[1] for r in kb_results[:2]])

        # 外部兜底
        if ext_result and not parts:
            parts.append(ext_result)

        if not parts:
            parts.append(f"抱歉，关于「{q}」暂未收录。请换个问法或等待知识库更新。")

        return "\n\n".join(parts[:3])

    def ask(self, q):
        t0 = time.time()
        intent = self._classify_intent(q)

        # 缓存检查
        cache_key = hashlib.md5(q.encode()).hexdigest()
        if cache_key in self._cache:
            with self._stats_lock:
                self._perf["cache_hits"] += 1
            return self._cache[cache_key], {"intent":intent,"sources":0,"time":"0ms(cache)"}

        # 插件路由
        plugin_result = None
        if intent == "plugin":
            plugin_map = {
                "译": "translator", "翻译": "translator", "translate": "translator",
                "天气": "weather", "weather": "weather",
                "新闻": "news", "news": "news", "热搜": "news",
                "审查": "code_review", "review": "code_review",
                "ocr": "ocr", "识别": "ocr",
                "语音": "audio_transcriber", "音频": "audio_transcriber",
                "工作流": "workflow_orchestrator",
            }
            for kw, pname in plugin_map.items():
                if kw in q:
                    extra = q.replace(kw,"").strip().replace("：","").replace(":","") or q
                    plugin_result = self.plugins.run(pname, extra)
                    # 自进化反馈
                    rating = 4 if plugin_result.get("ok") else 2
                    self.evolution.feedback(q, pname, plugin_result, rating)
                    break

        # 多源检索
        kb_results = self._search_kb(q)
        ext_result = None
        if not kb_results or kb_results[0][2] < 0.6:
            ext_result = self._search_external(q)

        # 合成
        answer = self._synthesize(intent, q, kb_results, ext_result, plugin_result)

        # 缓存
        self._cache[cache_key] = answer
        elapsed = int((time.time()-t0)*1000)

        with self._stats_lock:
            self._perf["total_q"] += 1
            self._perf["avg_time"] = (self._perf["avg_time"]*(self._perf["total_q"]-1)+elapsed)/self._perf["total_q"]
            self._perf["qps"] = round(self._perf["total_q"]/(time.time()-self._perf["last_reset"]+1), 1)

        meta = {"intent":intent,"sources":len(kb_results)+(1 if ext_result else 0),"time":f"{elapsed}ms",
                "plugin":plugin_result.get("meta",{}) if plugin_result else None}
        return answer, meta

    def dashboard(self):
        conn = sqlite3.connect(self.kb_db)
        kb_total = conn.execute("SELECT COUNT(*) FROM knowledge").fetchone()[0]
        kb_hits = conn.execute("SELECT SUM(hits) FROM knowledge").fetchone()[0] or 0
        kb_help = conn.execute("SELECT SUM(helpful) FROM knowledge").fetchone()[0] or 0
        conn.close()
        return {
            "version": self.version,
            "perf": self._perf,
            "kb": {"total":kb_total,"hits":kb_hits,"helpful_rate":f"{kb_help/max(1,kb_total)*100:.1f}%"},
            "plugins": self.plugins.stats(),
            "p2p": self.p2p.get_sync_status(),
            "evolution": self.evolution.get_stats(),
            "cache_size": len(self._cache),
        }


# ============================================================
# Web服务 (紧凑版)
# ============================================================

WEB_HTML = """<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>HopeAI v3.0 - 网元</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0a0e27;color:#e0e0e0;display:flex;flex-direction:column;min-height:100vh}
.header{background:linear-gradient(135deg,#1a1a3e,#0d0d2b);padding:16px 24px;border-bottom:2px solid #7c3aed;display:flex;align-items:center;gap:12px}
.logo{font-size:24px;font-weight:800;background:linear-gradient(90deg,#a78bfa,#7c3aed,#6366f1);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.sub{color:#a78bfa;font-size:12px}
.layout{display:flex;flex:1;overflow:hidden}
.sidebar{width:220px;background:#111133;padding:16px;border-right:1px solid #222;overflow-y:auto}
.sidebar h3{color:#a78bfa;font-size:13px;margin-bottom:8px;text-transform:uppercase}
.sidebar .btn{display:block;width:100%;padding:8px 12px;margin:4px 0;background:transparent;color:#ccc;border:1px solid #333;border-radius:6px;cursor:pointer;text-align:left;font-size:13px;transition:all .2s}
.sidebar .btn:hover{background:#1e1e4a;border-color:#7c3aed;color:#fff}
.main{flex:1;display:flex;flex-direction:column}
.chat{flex:1;overflow-y:auto;padding:20px}
.chat .msg{margin:12px 0;padding:12px 16px;border-radius:8px;max-width:85%;line-height:1.6;font-size:14px;white-space:pre-wrap}
.chat .user{background:#1e1e4a;margin-left:auto;border-right:3px solid #7c3aed}
.chat .ai{background:#16162e;border-left:3px solid #6366f1}
.input-area{display:flex;padding:16px;background:#0d0d2b;border-top:1px solid #222;gap:8px}
.input-area input{flex:1;padding:12px 16px;background:#1a1a3e;border:1px solid #333;border-radius:8px;color:#fff;font-size:15px;outline:none}
.input-area input:focus{border-color:#7c3aed}
.input-area button{padding:12px 24px;background:linear-gradient(135deg,#7c3aed,#6366f1);border:none;border-radius:8px;color:#fff;font-weight:600;cursor:pointer;font-size:15px}
.card{background:#16162e;border-radius:8px;padding:16px;margin:8px 0;border:1px solid #222}
.card h3{color:#a78bfa;font-size:14px;margin-bottom:8px}
.card table{width:100%;font-size:13px}
.card td{padding:4px 8px}
</style></head><body>
<div class="header"><div class="logo">◈ HopeAI v3.0</div><div class="sub">P2P同步 | 自进化 | 8插件 | 网元模型</div></div>
<div class="layout">
<div class="sidebar">
<h3>导航</h3><button class="btn" onclick="showTab('chat')">对话</button><button class="btn" onclick="showTab('dashboard')">仪表盘</button>
<h3 style="margin-top:16px">插件</h3><button class="btn" onclick="askPlugin('translator')">翻译</button><button class="btn" onclick="askPlugin('weather')">天气</button><button class="btn" onclick="askPlugin('news')">新闻</button><button class="btn" onclick="askPlugin('ocr')">OCR</button><button class="btn" onclick="askPlugin('code_review')">代码审查</button><button class="btn" onclick="askPlugin('audio_transcriber')">语音转文字</button>
<h3 style="margin-top:16px">v3.0</h3><button class="btn" onclick="loadP2P()">P2P同步</button><button class="btn" onclick="loadEvo()">自进化</button>
</div>
<div class="main">
<div id="tab-chat" style="display:flex;flex-direction:column;flex:1">
<div class="chat" id="msgs"><div class="msg ai">你好！我是网元 HopeAI v3.0<br>支持 8 个插件 / P2P去中心化同步 / 自进化闭环<br>输入问题开始对话</div></div>
<div class="input-area"><input id="q" placeholder="输入问题..." onkeydown="event.key==='Enter'&&send()"><button onclick="send()">发送</button></div>
</div>
<div id="tab-dashboard" style="display:none;flex:1;overflow-y:auto;padding:20px"><div id="dash"></div></div>
</div></div>
<script>
function showTab(t){document.getElementById('tab-chat').style.display=t==='chat'?'flex':'none';document.getElementById('tab-dashboard').style.display=t==='dashboard'?'block':'none';if(t==='dashboard')loadDash()}
function m(role,txt){const d=document.createElement('div');d.className='msg '+role;d.textContent=txt;document.getElementById('msgs').appendChild(d);d.scrollIntoView({behavior:'smooth'})}
async function send(){const q=document.getElementById('q').value.trim();if(!q)return;m('user',q);document.getElementById('q').value='';m('ai','…');const r=await fetch('/api/ask',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:q})});const d=await r.json();document.getElementById('msgs').lastChild.textContent=d.answer}
function askPlugin(name){const q={translator:'翻译：你好世界',weather:'天气北京',news:'新闻热榜',ocr:'OCR识别 [图片]',code_review:'审查代码：print("hello")',audio_transcriber:'语音转文字 [音频]'}[name];if(q){document.getElementById('q').value=q;send()}}
async function loadDash(){const r=await fetch('/api/dash');const d=await r.json();document.getElementById('dash').innerHTML=`
<div class="card"><h3>性能</h3><table>${Object.entries(d.perf||{}).map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table></div>
<div class="card"><h3>知识库</h3><table>${Object.entries(d.kb||{}).map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table></div>
<div class="card"><h3>插件</h3><table>${Object.entries(d.plugins||{}).map(([k,v])=>`<tr><td>${k}</td><td>${JSON.stringify(v)}</td></tr>`).join('')}</table></div>
<div class="card"><h3>P2P同步</h3><table>${Object.entries(d.p2p||{}).map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table></div>
<div class="card"><h3>自进化</h3><table>${Object.entries(d.evolution||{}).map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table></div>`}
async function loadP2P(){const r=await fetch('/api/p2p');const d=await r.json();document.getElementById('dash').innerHTML=`<div class="card"><h3>P2P同步状态</h3><table>${Object.entries(d).map(([k,v])=>`<tr><td>${k}</td><td>${JSON.stringify(v)}</td></tr>`).join('')}</table></div>`;showTab('dashboard')}
async function loadEvo(){const r=await fetch('/api/evo');const d=await r.json();document.getElementById('dash').innerHTML=`<div class="card"><h3>自进化状态</h3><table>${Object.entries(d).map(([k,v])=>`<tr><td>${k}</td><td>${JSON.stringify(v)}</td></tr>`).join('')}</table></div>`;showTab('dashboard')}
</script></body></html>"""

class WebHandler(BaseHTTPRequestHandler):
    ai = None

    def do_GET(self):
        routes = {
            "/": ("text/html; charset=utf-8", WEB_HTML),
            "/api/dash": ("application/json", lambda: json.dumps(self.ai.dashboard(),ensure_ascii=False)),
            "/api/p2p": ("application/json", lambda: json.dumps(self.ai.p2p.get_sync_status(),ensure_ascii=False)),
            "/api/evo": ("application/json", lambda: json.dumps(self.ai.evolution.get_stats(),ensure_ascii=False)),
            "/api/plugins": ("application/json", lambda: json.dumps(self.ai.plugins.list_plugins(),ensure_ascii=False)),
        }
        if self.path in routes:
            self._r(200, routes[self.path][0], routes[self.path][1]() if callable(routes[self.path][1]) else routes[self.path][1])
        else:
            self._r(404, "text/plain", "404")

    def do_POST(self):
        if self.path == "/api/ask":
            l = int(self.headers.get("Content-Length",0))
            b = json.loads(self.rfile.read(l))
            q = b.get("question","").strip()
            if not q: self._r(400,"application/json",'{"error":"empty"}'); return
            a, m = self.ai.ask(q)
            self._r(200,"application/json",json.dumps({"answer":a,"meta":m},ensure_ascii=False))
        elif self.path == "/api/feedback":
            l = int(self.headers.get("Content-Length",0))
            b = json.loads(self.rfile.read(l))
            self.ai.evolution.feedback(b.get("query",""),b.get("plugin","core"),b.get("result",""),b.get("rating",3))
            self._r(200,"application/json",'{"ok":true}')
        else:
            self._r(404,"text/plain","404")

    def _r(self,c,ct,b):
        self.send_response(c);self.send_header("Content-Type",ct)
        self.send_header("Access-Control-Allow-Origin","*")
        self.end_headers();self.wfile.write(b.encode("utf-8") if isinstance(b,str) else b)

    def log_message(self,*a): pass


def run_web(ai):
    WebHandler.ai = ai
    s = HTTPServer(("0.0.0.0",8080), WebHandler)
    print("  Web: http://localhost:8080")
    s.serve_forever()


# ============================================================
# Main
# ============================================================

def main():
    ai = HopeAI()
    print("=" * 56)
    print(f"  {ai.name} v{ai.version}")
    print("  P2P同步 | 自进化闭环 | 8插件 | 网元模型")
    print("=" * 56)

    if "--web" in sys.argv:
        run_web(ai)
        return

    if "--sync-export" in sys.argv:
        pkg = ai.p2p.export_sync_package()
        path = os.path.join(DATA_DIR,"sync",f"export_{int(time.time())}.json")
        json.dump(pkg,open(path,"w"),ensure_ascii=False,indent=2)
        print(f"同步包导出: {path}\n变更: {len(pkg.get('changes',[]))}条")
        return

    if "--sync-status" in sys.argv:
        s = ai.p2p.get_sync_status()
        for k,v in s.items(): print(f"  {k}: {v}")
        return

    if "--evo-status" in sys.argv:
        s = ai.evolution.get_stats()
        for k,v in s.items(): print(f"  {k}: {v}")
        return

    if "--plugins" in sys.argv:
        for p in ai.plugins.list_plugins():
            net = "网" if p["network"] else "本地"
            print(f"  [{p['category']}] {p['name']} v{p['version']} ({net}): {p['description']}")
        return

    if "--dash" in sys.argv:
        d = ai.dashboard()
        print(json.dumps(d,ensure_ascii=False,indent=2))
        return

    # 交互模式
    print("  输入 help 查看命令 | q 退出")
    commands = {"help":"显示此帮助","dash":"仪表盘","kb":"知识库统计",
        "plugins":"插件列表","p2p":"P2P同步状态","evo":"自进化状态",
        "sync-export":"导出差分包","q/quit/退出":"退出"}
    while True:
        try: q = input("\n你：").strip()
        except (EOFError,KeyboardInterrupt): print("\n明天继续！"); break
        if q.lower() in ("q","quit","退出"): print("明天继续！"); break
        if not q: continue
        if q == "help":
            for k,v in commands.items(): print(f"  {k}: {v}")
            continue
        if q == "dash":
            d = ai.dashboard()
            print(f"版本: {d['version']} | 查询: {d['perf']['total_q']} | 插件: {d['plugins']['total']}")
            print(f"P2P节点: {d['p2p']['known_peers']} | 进化: {d['evolution']['improved']}次改进")
            continue
        if q == "kb":
            s = ai.dashboard()["kb"]
            print(f"知识库: {s['total']}条 | 查阅: {s['hits']} | 好评率: {s['helpful_rate']}")
            continue
        if q == "plugins":
            for p in ai.plugins.list_plugins():
                print(f"  [{p['category']}] {p['name']} v{p['version']}: {p['description']}")
            continue
        if q == "p2p":
            s = ai.p2p.get_sync_status()
            for k,v in s.items(): print(f"  {k}: {v}")
            continue
        if q == "evo":
            s = ai.evolution.get_stats()
            for k,v in s.items(): print(f"  {k}: {v}")
            continue
        if q == "sync-export":
            pkg = ai.p2p.export_sync_package()
            print(f"差分包: {len(pkg.get('changes',[]))}条变更")
            continue

        print("…", end="\r")
        a, m = ai.ask(q)
        print(f"\n网元：{a}")
        print(f"      [{m['intent']} | {m.get('sources',0)}源 | {m['time']}]")

if __name__ == "__main__":
    main()
