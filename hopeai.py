#!/usr/bin/env python3
# HopeAI v7.0.2 - 五图融合 + 门控动态加权：双流|时空|分形|体素|注意环 → GatedFusion → 统一基座
# 基于用户手绘五图融合架构实现

import json, re, time, os, hashlib, sqlite3, random, math, shutil, itertools, sys, threading, queue, struct, io
import urllib.request, urllib.parse, urllib.error, base64
from datetime import datetime, timezone
from collections import OrderedDict, defaultdict, deque, Counter

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "hopeai_data")
ALL_DIRS = ["backups","training","workflows","logs","deploy","graphs","models",
            "conversations","api_cache","plugins","users","eval","abtest",
            "multimodal","collab","xuni","sync","evolution"]
for d in ALL_DIRS: os.makedirs(os.path.join(DATA_DIR, d), exist_ok=True)

VERSION = "7.0.2"

# ============================================================
# 五图融合架构核心
# ============================================================

class DualStreamEncoder:
    """a. 双流融合：字符n-gram流 + 词级语义流 → 交叉对齐"""

    def __init__(self):
        self.char_n = 3
        self.fusion_alpha = 0.6

    def encode(self, q, kb_rows):
        """双流编码：字符流打分 + 语义流打分 → 加权融合"""
        if not kb_rows: return {}

        # 流1: 字符n-gram重叠度
        q_grams = set()
        qc = q.lower()
        for i in range(len(qc) - self.char_n + 1):
            q_grams.add(qc[i:i+self.char_n])

        # 流2: 词级TF加权
        q_words = set(re.findall(r'[\u4e00-\u9fff\w]+', q))

        scores = {}
        for i, row in enumerate(kb_rows):
            question = (row[0] or "").lower()
            answer = row[1] or ""
            conf = row[2] or 0.5

            # 流1分数
            row_grams = set()
            for j in range(len(question) - self.char_n + 1):
                row_grams.add(question[j:j+self.char_n])
            gram_overlap = len(q_grams & row_grams) / max(1, len(q_grams | row_grams))

            # 流2分数
            row_words = set(re.findall(r'[\u4e00-\u9fff\w]+', question))
            word_overlap = len(q_words & row_words) / max(1, len(q_words | row_words))

            # 双流融合
            scores[i] = self.fusion_alpha * gram_overlap + (1-self.fusion_alpha) * word_overlap + conf * 0.3
        return scores

    def _cn_tokenize(self, text):
        tokens = []
        for i in range(len(text)-1):
            tokens.append(text[i:i+2])
        for i in range(len(text)-2):
            tokens.append(text[i:i+3])
        return tokens


class SpatiotemporalEncoder:
    """b. 时空流场：对话历史时序建模 → 上下文加权"""

    def __init__(self, max_history=50):
        self.history = deque(maxlen=max_history)
        self.time_decay = 0.92

    def record(self, q, answer, intent):
        self.history.append({"q": q, "answer": answer, "intent": intent, "ts": time.time()})

    def encode(self, q):
        """时空场编码：历史问题与当前问题的关联权重。短问句自动挂靠最近历史。"""
        if not self.history: return {"context_weight": 1.0, "related_history": [], "temporal_decay": 1.0}

        q_grams = set(self._ngrams(q))
        related = []
        now = time.time()
        is_short = len(q.strip()) <= 10  # 短跟问句：如"那GIL呢"、"异步编程怎么搞"

        for h in reversed(self.history):
            h_grams = set(self._ngrams(h["q"]))
            overlap = len(q_grams & h_grams) / max(1, len(q_grams | h_grams))
            age = (now - h["ts"]) / 3600
            decay = self.time_decay ** age
            score = overlap * decay
            # 短句兜底：最近3条历史自动挂靠(衰减后得分最低0.3→0.2→0.1)
            if is_short and len(related) < 3:
                floor = max(0.1, 0.3 - len(related) * 0.1)
                score = max(score, floor * decay)
            if score > 0.05:
                related.append({"q": h["q"][:80], "score": round(score, 3), "age_min": round(age*60)})

        if not related:
            return {"context_weight": 1.0, "related_history": [], "temporal_decay": self.time_decay}

        # 时空场总权重：短问句放大上下文贡献
        boost = 1.2 if is_short else 0.5
        context_weight = 1.0 + sum(r["score"] for r in related[:5]) * boost
        return {
            "context_weight": min(context_weight, 3.0),
            "related_history": related[:5],
            "temporal_decay": self.time_decay
        }

    def _ngrams(self, text, n=2):
        for i in range(len(text)-n+1):
            yield text[i:i+n]


class RecursiveFractalEncoder:
    """c. 递归分形：自相似子问题分解 → 层级聚合"""

    def __init__(self, max_depth=3):
        self.max_depth = max_depth
        self.split_patterns = [
            (r'[和与及、，,]', '并列拆分'),
            (r'[?？!！]', '问句拆分'),
            (r'(先|再|然后|接着|最后)', '时序拆分'),
        ]

    def encode(self, q, search_fn, depth=0):
        """递归分形编码：问题分解 → 逐层检索 → 自相似聚合"""
        if depth >= self.max_depth or len(q) < 6:
            results = search_fn(q)
            return {"fractal_level": depth, "sub_questions": [], "results": results, "merged": False}

        # 尝试拆分
        sub_qs = self._split(q)
        if len(sub_qs) <= 1:
            results = search_fn(q)
            return {"fractal_level": depth, "sub_questions": [], "results": results, "merged": False}

        # 递归处理子问题
        children = []
        for sq in sub_qs:
            child = self.encode(sq, search_fn, depth+1)
            children.append(child)

        # 自相似聚合：上层结果 = 合并子层结果
        all_results = []
        for ch in children:
            all_results.extend(ch.get("results", []))

        # 去重排序
        seen = set()
        unique = []
        for r in sorted(all_results, key=lambda x: x[2] if len(x)>2 else 0, reverse=True):
            key = r[0][:30] if r[0] else str(random.random())
            if key not in seen:
                seen.add(key)
                unique.append(r)

        return {"fractal_level": depth, "sub_questions": sub_qs, "results": unique[:5], "merged": True, "depth": depth}

    def _split(self, q):
        for pattern, name in self.split_patterns:
            parts = re.split(pattern, q)
            parts = [p.strip() for p in parts if p.strip() and len(p.strip()) > 2]
            if len(parts) > 1:
                return parts
        return [q]


class VoxelEncoder:
    """d. 三维体素：知识空间离散化 → 语义体素定位"""

    def __init__(self, grid_dim=16):
        self.grid_dim = grid_dim
        self.voxel_centers = {}
        self._initialized = False

    def build_voxels(self, kb_rows):
        """从知识库构建体素空间：TF-IDF → PCA降维到3D → 体素化"""
        if len(kb_rows) < 3: return

        # 收集所有词的TF
        docs = [r[0] or "" for r in kb_rows]
        vocab = {}
        for doc in docs:
            words = re.findall(r'[\u4e00-\u9fff\w]+', doc.lower())
            for w in words:
                vocab[w] = vocab.get(w, 0) + 1

        # 取高频词做维度
        top_words = sorted(vocab.items(), key=lambda x: -x[1])[:self.grid_dim]
        if len(top_words) < 3:
            top_words = list(vocab.items())[:self.grid_dim]

        word_list = [w for w, _ in top_words]
        self.word_list = word_list

        # 为每个文档生成体素坐标
        for i, row in enumerate(kb_rows):
            doc = (row[0] or "").lower()
            vec = []
            for w in word_list:
                vec.append(doc.count(w) / max(1, len(doc)))
            # 映射到体素网格
            x = min(self.grid_dim-1, int(sum(vec[:len(vec)//3]) / max(1, len(vec)//3) * self.grid_dim))
            y = min(self.grid_dim-1, int(sum(vec[len(vec)//3:2*len(vec)//3]) / max(1, len(vec)//3 or 1) * self.grid_dim))
            z = min(self.grid_dim-1, int(sum(vec[2*len(vec)//3:]) / max(1, len(vec)//3 or 1) * self.grid_dim))
            key = f"{x},{y},{z}"
            if key not in self.voxel_centers:
                self.voxel_centers[key] = []
            self.voxel_centers[key].append(i)

        self._initialized = True

    def encode(self, q, kb_rows):
        """体素编码：将问题映射到语义体素，返回体素内的知识"""
        if not self._initialized or not self.word_list:
            return {"voxel_key": None, "voxel_results": kb_rows[:3], "voxel_size": 0}

        doc = q.lower()
        vec = []
        for w in self.word_list:
            vec.append(doc.count(w) / max(1, len(doc)))

        n = len(vec)
        x = min(self.grid_dim-1, int(sum(vec[:n//3]) / max(1, n//3) * self.grid_dim)) if n >= 3 else 0
        y = min(self.grid_dim-1, int(sum(vec[n//3:2*n//3]) / max(1, n//3 or 1) * self.grid_dim)) if n >= 3 else 0
        z = min(self.grid_dim-1, int(sum(vec[2*n//3:]) / max(1, n//3 or 1) * self.grid_dim)) if n >= 3 else 0
        key = f"{x},{y},{z}"

        # 搜索邻近体素
        candidates = set()
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                for dz in (-1, 0, 1):
                    nk = f"{min(self.grid_dim-1,max(0,x+dx))},{min(self.grid_dim-1,max(0,y+dy))},{min(self.grid_dim-1,max(0,z+dz))}"
                    if nk in self.voxel_centers:
                        candidates.update(self.voxel_centers[nk])

        voxel_results = [kb_rows[i] for i in candidates if i < len(kb_rows)]
        return {"voxel_key": key, "voxel_results": voxel_results[:5] if voxel_results else kb_rows[:3],
                "voxel_size": len(self.voxel_centers), "neighbor_voxels": len(candidates)}


class AttentionRing:
    """e. 注意力环：环形多头注意力 → 意图路由聚焦"""

    def __init__(self, num_heads=5):
        self.num_heads = num_heads
        self.head_names = ["知识检索", "外部搜索", "插件路由", "代码解析", "对话生成"]
        self.head_weights = [1.0] * num_heads
        self.attention_history = []

    def encode(self, q):
        """环形注意力编码：多头上环 → 旋转加权 → 输出注意力分布"""
        # 为每个注意力头计算相关性分数
        scores = []
        q_lower = q.lower()

        # 头0: 知识检索 - 匹配问句模式
        s0 = float(bool(re.search(r'什么|怎么|如何|为什么|定义|介绍|谁|哪|多少', q_lower)))
        # 头1: 外部搜索 - 匹配实时性需求
        s1 = float(bool(re.search(r'最新|今天|现在|天气|新闻|当前|实时|刚刚|热搜', q_lower)))
        # 头2: 插件路由 - 匹配插件关键词
        s2 = float(bool(re.search(r'翻译|天气|新闻|审查|识别|语音|工作流|插件|ocr|代码', q_lower)))
        # 头3: 代码解析 - 匹配代码模式
        s3 = float(bool(re.search(r'代码|编程|函数|python|java|bug|debug|语法|import|def|class|错误|报错', q_lower)))
        # 头4: 对话生成 - 兜底
        s4 = float(bool(re.search(r'你好|聊天|对话|讲个|说个|聊聊|请问|帮我', q_lower)))

        # 无明确信号时平分注意力
        raw = [s0, s1, s2, s3, s4]
        if sum(raw) == 0:
            raw = [0.2] * 5
        else:
            total = sum(raw)
            raw = [s/total for s in raw]

        # 环形旋转：每次查询后旋转注意力权重，避免模式坍缩
        shift = len(self.attention_history) % self.num_heads
        rotated = raw[-shift:] + raw[:-shift] if shift else raw

        self.attention_history.append({"q": q[:40], "attention": rotated})
        if len(self.attention_history) > 20:
            self.attention_history.pop(0)

        return {"heads": dict(zip(self.head_names, [round(w, 3) for w in rotated])),
                "primary_head": self.head_names[rotated.index(max(rotated))],
                "shift": shift}


class GatedFusion:
    """门控加权融合层 — 借鉴 paralle12 的 Gated Fusion 思想，动态学习五路权重"""

    def __init__(self, path_names):
        self.path_names = list(path_names)
        self.n = len(self.path_names)
        # 可学习的门控参数：每个路径的 scale + bias
        self.gate_w = [1.0] * self.n
        self.gate_bias = [0.0] * self.n
        self.eps = 1e-8
        self.call_count = 0

    def _extract_quality(self, encoder_outputs, path):
        """从编码器输出中提取质量信号，作为门控的输入特征"""
        out = encoder_outputs.get(path, {})
        if path == "dual_stream":
            scores = [v for v in out.values() if isinstance(v, (int, float))]
            return sum(scores) / max(len(scores), 1)
        elif path == "spatiotemporal":
            return out.get("context_weight", 0.5)
        elif path == "fractal":
            results = out.get("results", [])
            depth = out.get("fractal_level", 0)
            return len(results) * 0.3 + depth * 0.2
        elif path == "voxel":
            results = out.get("voxel_results", [])
            return min(len(results) * 0.15, 2.0)
        elif path == "attention_ring":
            heads = out.get("heads", {})
            vals = [v for v in heads.values() if isinstance(v, (int, float))]
            return sum(vals) / max(len(vals), 1) if vals else 0.2
        return 0.1

    def compute_weights(self, encoder_outputs):
        """输入五路编码器输出，返回 softmax 归一化的动态权重"""
        raw = []
        for i, name in enumerate(self.path_names):
            quality = self._extract_quality(encoder_outputs, name)
            s = quality * self.gate_w[i] + self.gate_bias[i]
            raw.append(max(s, 0.01))  # 最低权重保底

        # softmax
        exp_raw = [math.exp(r) for r in raw]
        total = sum(exp_raw) + self.eps
        self.call_count += 1
        return {self.path_names[i]: exp_raw[i] / total for i in range(self.n)}

    def update_gate(self, path, feedback_delta):
        """根据反馈微调门控参数（在线学习）"""
        if path in self.path_names:
            idx = self.path_names.index(path)
            self.gate_w[idx] = max(0.1, min(3.0, self.gate_w[idx] + feedback_delta * 0.1))
            self.gate_bias[idx] += feedback_delta * 0.05


class FusionBase:
    """统一多模态基座：五路特征深度融合 + 门控动态加权 → 全模态对齐输出"""

    def __init__(self):
        self.path_names = ["dual_stream", "spatiotemporal", "fractal", "voxel", "attention_ring"]
        self.base_weights = {
            "dual_stream": 1.0,
            "spatiotemporal": 0.8,
            "fractal": 1.2,
            "voxel": 1.0,
            "attention_ring": 0.9,
        }
        self.gated_fusion = GatedFusion(self.path_names)
        self.fusion_stats = {"calls": 0, "dominant_paths": Counter()}

    def fuse(self, encoder_outputs, kb_results, ext_result):
        """五路融合：门控动态加权投票 + 一致性检查 → 最终输出"""
        self.fusion_stats["calls"] += 1

        # 计算门控动态权重，与基础权重融合
        dynamic_weights = self.gated_fusion.compute_weights(encoder_outputs)
        effective_weights = {}
        for name in self.path_names:
            effective_weights[name] = self.base_weights[name] * dynamic_weights[name]

        # 提取各路结果
        dual_scores = encoder_outputs.get("dual_stream", {})
        spatiotemporal = encoder_outputs.get("spatiotemporal", {})
        fractal = encoder_outputs.get("fractal", {})
        voxel = encoder_outputs.get("voxel", {})
        attention = encoder_outputs.get("attention_ring", {})

        context_weight = spatiotemporal.get("context_weight", 1.0)
        voxel_results = voxel.get("voxel_results", [])
        fractal_results = fractal.get("results", [])
        primary_head = attention.get("primary_head", "对话生成")

        # 融合策略：收集所有来源的候选答案，加权投票
        candidates = {}

        # 双流打分加权（使用门控动态权重）
        for idx, score in dual_scores.items():
            if idx < len(kb_results):
                candidates[idx] = candidates.get(idx, 0) + score * effective_weights["dual_stream"]

        # 分形结果加分
        for row in fractal_results:
            for i, kb_row in enumerate(kb_results):
                if kb_row[0] == row[0]:
                    candidates[i] = candidates.get(i, 0) + effective_weights["fractal"] * 0.5
                    break

        # 体素结果加分
        for row in voxel_results:
            for i, kb_row in enumerate(kb_results):
                if kb_row[0] == row[0]:
                    candidates[i] = candidates.get(i, 0) + effective_weights["voxel"] * 0.4
                    break

        # 注意力环调制
        attention_mod = 1.0 + effective_weights["attention_ring"] * 0.25

        # 时空场上下文加权
        for i in candidates:
            candidates[i] *= context_weight * attention_mod

        # 对外部结果也做融合
        fused_kb = sorted(candidates.items(), key=lambda x: -x[1])

        # 选择最优路径
        if fused_kb and fused_kb[0][1] > 0.3:
            best_idx = fused_kb[0][0]
            if best_idx < len(kb_results):
                best_row = kb_results[best_idx]
                # 用各路编码器元信息丰富答案
                dominant = max(effective_weights, key=effective_weights.get)
                source_info = f"▸{primary_head} ▸gate={dynamic_weights[dominant]:.2f} ▸ctx={context_weight:.1f}"
                return best_row[1], source_info, fused_kb[:3]

        # 降级：用外部搜索结果
        if ext_result:
            return ext_result, "▸外部搜索", []

        return None, "▸无结果", []

    def update_weights(self, path, delta):
        if path in self.base_weights:
            self.base_weights[path] = max(0.1, min(3.0, self.base_weights[path] + delta))
        self.gated_fusion.update_gate(path, delta)

    def record_dominant(self, path):
        self.fusion_stats["dominant_paths"][path] += 1

    def stats(self):
        # 获取当前门控权重快照
        dummy = {p: 0.5 for p in self.path_names}
        gate = self.gated_fusion.compute_weights(dummy) if self.fusion_stats["calls"] == 0 else {}
        return {
            "calls": self.fusion_stats["calls"],
            "dominant_paths": dict(self.fusion_stats["dominant_paths"].most_common(5)),
            "base_weights": self.base_weights,
            "gate_w": self.gated_fusion.gate_w,
            "gate_calls": self.gated_fusion.call_count,
        }


# ============================================================
# P2P同步引擎 (v3.0 保留)
# ============================================================

class P2PSyncEngine:
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
            table, data = change["table"], change.get("data",{})
            row_id, op, ts = change["row_id"], change["operation"], change.get("ts",time.time())
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
# 自进化闭环引擎 (v3.0 保留，增强五图反馈)
# ============================================================

class SelfEvolutionLoop:
    def __init__(self, db_path):
        self.db_path = db_path
        self.feedback_queue = queue.Queue()
        self.running = False
        self.stats = {"processed":0,"improved":0,"last_run":None}
        conn = sqlite3.connect(db_path)
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS _feedback (id INTEGER PRIMARY KEY AUTOINCREMENT, ts REAL, query TEXT,
                plugin TEXT, result TEXT, rating INTEGER, error_type TEXT, fusion_path TEXT, resolved INTEGER DEFAULT 0);
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

    def feedback(self, query, plugin, result, rating=3, error_type=None, fusion_path=None):
        conn = sqlite3.connect(self.db_path)
        conn.execute("INSERT INTO _feedback(ts,query,plugin,result,rating,error_type,fusion_path) VALUES(?,?,?,?,?,?,?)",
            (time.time(), query, plugin, str(result)[:200], rating, error_type, fusion_path))
        conn.commit(); conn.close()
        self.feedback_queue.put((query, plugin, result, rating, error_type, fusion_path))

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
        for query, plugin, result, rating, error_type, fusion_path in batch:
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
# 插件热加载引擎 (v3.0 保留)
# ============================================================

class PluginEngine:
    def __init__(self): self._plugins = {}; self._plugin_info = {}
    def load_all(self, plugin_dir=None):
        if plugin_dir is None: plugin_dir = os.path.join(DATA_DIR, "plugins")
        os.makedirs(plugin_dir, exist_ok=True)
        loaded = 0
        for cat in ["official","multimodal","community"]:
            cat_dir = os.path.join(plugin_dir, cat)
            if not os.path.isdir(cat_dir): continue
            for fname in sorted(os.listdir(cat_dir)):
                if fname.endswith(".py") and not fname.startswith("_"):
                    path = os.path.join(cat_dir, fname)
                    try:
                        ns = {}; exec(open(path).read(), ns)
                        if "plugin" in ns:
                            p = ns["plugin"]
                            self._plugins[p.name] = p
                            self._plugin_info[p.name] = {"name":p.name,"version":p.version,"author":p.author,
                                "description":p.description,"category":p.category,"network":getattr(p,"requires_network",False)}
                            if hasattr(p, "on_load"): p.on_load()
                            loaded += 1
                    except Exception as e: print(f"  [Plugin] {fname} 加载失败: {e}")
        return loaded
    def list_plugins(self): return list(self._plugin_info.values())
    def has(self, name): return name in self._plugins
    def get(self, name): return self._plugins.get(name)
    def run(self, name, input_data, context=None):
        p = self._plugins.get(name)
        if not p: return {"ok":False,"result":f"插件 {name} 未找到"}
        try: return p.run(input_data, context)
        except Exception as e: return {"ok":False,"result":str(e)}
    def stats(self):
        return {"total":len(self._plugins),"loaded":len(self._plugins),
                "categories":list(set(p.get("category","") for p in self._plugin_info.values()))}


# ============================================================
# HopeAI v7.0.2 - 五图融合核心 + 门控动态加权
# ============================================================

class HopeAI:
    def __init__(self):
        self.name = "HopeAI - 网元"
        self.version = VERSION

        self.kb_db = os.path.join(DATA_DIR, "training", "kb.db")
        self._init_kb()

        # 五图编码器
        self.dual_stream = DualStreamEncoder()
        self.spatiotemporal = SpatiotemporalEncoder()
        self.fractal = RecursiveFractalEncoder()
        self.voxel = VoxelEncoder()
        self.attention_ring = AttentionRing()

        # 统一基座
        self.fusion = FusionBase()

        # 插件引擎
        self.plugins = PluginEngine()
        self.plugins.load_all()

        # P2P同步
        self.p2p = P2PSyncEngine(self.kb_db)

        # 自进化
        self.evolution = SelfEvolutionLoop(self.kb_db)
        self.evolution.start()

        # 体素空间初始化
        self._warm_up()

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

    def _warm_up(self):
        """初始化体素空间"""
        conn = sqlite3.connect(self.kb_db)
        rows = conn.execute("SELECT question,answer,confidence,source FROM knowledge ORDER BY confidence DESC LIMIT 200").fetchall()
        conn.close()
        if rows:
            self.voxel.build_voxels(rows)

    def _search_kb(self, q):
        conn = sqlite3.connect(self.kb_db)
        # 中文双字符ngram分词 + 英文单词分词
        words = []
        i = 0
        while i < len(q)-1:
            words.append(q[i:i+2])
            i += 1
        eng_words = re.findall(r'[a-zA-Z0-9]+', q)
        words.extend(eng_words)
        words = list(set(words))
        if not words:
            words = [q[:6]]
        clauses = " OR ".join(["question LIKE ?" for _ in words])
        params = [f"%{w}%" for w in words]
        rows = conn.execute(
            f"SELECT question,answer,confidence,source FROM knowledge WHERE {clauses} ORDER BY confidence DESC LIMIT 20",
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
        except: return None

    def _plugin_route(self, q):
        plugin_map = {
            "翻译": "translator", "translate": "translator",
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
                return pname, extra
        return None, q

    def ask(self, q):
        t0 = time.time()

        # 缓存
        cache_key = hashlib.md5(q.encode()).hexdigest()
        if cache_key in self._cache:
            with self._stats_lock: self._perf["cache_hits"] += 1
            return self._cache[cache_key]

        # 插件路由
        plugin_name, plugin_input = self._plugin_route(q)
        plugin_result = None
        if plugin_name:
            plugin_result = self.plugins.run(plugin_name, plugin_input)
            rating = 4 if plugin_result.get("ok") else 2
            self.evolution.feedback(q, plugin_name, plugin_result, rating)

        # KB检索
        kb_rows = self._search_kb(q)

        # === 五图编码 ===
        encoder_outputs = {}

        # a. 双流融合
        encoder_outputs["dual_stream"] = self.dual_stream.encode(q, kb_rows)

        # b. 时空流场
        encoder_outputs["spatiotemporal"] = self.spatiotemporal.encode(q)

        # 上下文补救：短跟问句无结果时，用历史主题扩展 query 重搜
        ctx = encoder_outputs["spatiotemporal"].get("context_weight", 1.0)
        if ctx > 1.25 and (not kb_rows or all(r[2] < 0.5 for r in kb_rows)):
            hist = encoder_outputs["spatiotemporal"].get("related_history", [])
            if hist:
                # 拼接多条历史(最多3条)扩展搜索词
                hist_qs = " ".join(h["q"] for h in hist[:3])
                expanded = q + " " + hist_qs
                kb_rows2 = self._search_kb(expanded)
                if kb_rows2:
                    kb_rows = kb_rows2

        # c. 递归分形
        encoder_outputs["fractal"] = self.fractal.encode(q, lambda qq: self._search_kb(qq))

        # d. 三维体素
        encoder_outputs["voxel"] = self.voxel.encode(q, kb_rows)

        # e. 注意力环
        encoder_outputs["attention_ring"] = self.attention_ring.encode(q)

        # 外部搜索
        ext_result = None
        if not kb_rows or kb_rows[0][2] < 0.6:
            ext_result = self._search_external(q)

        # === 统一基座融合 ===
        answer, source_info, top_fusion = self.fusion.fuse(encoder_outputs, kb_rows, ext_result)

        # 插件结果优先覆盖
        if plugin_result and plugin_result.get("ok"):
            answer = plugin_result["result"]
            source_info = "▸插件路由"

        # 兜底
        if not answer:
            answer = f"抱歉，关于「{q}」暂未收录。请换个问法。"

        # 记录时空历史
        attention = encoder_outputs["attention_ring"]
        self.spatiotemporal.record(q, answer[:100], attention.get("primary_head", "对话生成"))

        # 缓存
        self._cache[cache_key] = answer
        elapsed = int((time.time()-t0)*1000)

        with self._stats_lock:
            self._perf["total_q"] += 1
            self._perf["avg_time"] = (self._perf["avg_time"]*(self._perf["total_q"]-1)+elapsed)/self._perf["total_q"]
            self._perf["qps"] = round(self._perf["total_q"]/(time.time()-self._perf["last_reset"]+1), 1)

        meta = {
            "intent": attention.get("primary_head", "对话生成"),
            "fusion_paths": len(top_fusion),
            "time": f"{elapsed}ms",
            "attention": attention.get("heads", {}),
            "voxel": encoder_outputs["voxel"].get("voxel_key", "N/A"),
            "context_weight": encoder_outputs["spatiotemporal"].get("context_weight", 1.0),
        }

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
            "fusion": self.fusion.stats(),
            "voxel": {"size": len(self.voxel.voxel_centers), "initialized": self.voxel._initialized},
            "cache_size": len(self._cache),
        }


# ============================================================
# Web服务
# ============================================================

WEB_HTML = """<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>HopeAI v7.0.2 - 五图融合 + 门控加权</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0a0e27;color:#e0e0e0;display:flex;flex-direction:column;min-height:100vh}
.header{background:linear-gradient(135deg,#1a1a3e,#0d0d2b);padding:16px 24px;border-bottom:2px solid #7c3aed;display:flex;align-items:center;gap:12px}
.logo{font-size:24px;font-weight:800;background:linear-gradient(90deg,#a78bfa,#7c3aed,#6366f1);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.sub{color:#a78bfa;font-size:12px}
.path-tag{display:inline-block;padding:2px 8px;border-radius:10px;font-size:10px;margin:0 2px}
.path-a{background:#7c3aed22;color:#a78bfa;border:1px solid #7c3aed44}
.path-b{background:#06b6d422;color:#22d3ee;border:1px solid #06b6d444}
.path-c{background:#f59e0b22;color:#fbbf24;border:1px solid #f59e0b44}
.path-d{background:#10b98122;color:#34d399;border:1px solid #10b98144}
.path-e{background:#ec489922;color:#f472b6;border:1px solid #ec489944}
.layout{display:flex;flex:1;overflow:hidden}
.sidebar{width:220px;background:#111133;padding:16px;border-right:1px solid #222;overflow-y:auto}
.sidebar h3{color:#a78bfa;font-size:13px;margin-bottom:8px}
.sidebar .btn{display:block;width:100%;padding:8px 12px;margin:4px 0;background:transparent;color:#ccc;border:1px solid #333;border-radius:6px;cursor:pointer;text-align:left;font-size:13px;transition:all .2s}
.sidebar .btn:hover{background:#1e1e4a;border-color:#7c3aed;color:#fff}
.main{flex:1;display:flex;flex-direction:column}
.chat{flex:1;overflow-y:auto;padding:20px}
.chat .msg{margin:12px 0;padding:12px 16px;border-radius:8px;max-width:85%;line-height:1.6;font-size:14px;white-space:pre-wrap}
.chat .user{background:#1e1e4a;margin-left:auto;border-right:3px solid #7c3aed}
.chat .ai{background:#16162e;border-left:3px solid #6366f1}
.chat .meta{font-size:10px;color:#8b949e;margin-top:6px}
.input-area{display:flex;padding:16px;background:#0d0d2b;border-top:1px solid #222;gap:8px}
.input-area input{flex:1;padding:12px 16px;background:#1a1a3e;border:1px solid #333;border-radius:8px;color:#fff;font-size:15px;outline:none}
.input-area input:focus{border-color:#7c3aed}
.input-area button{padding:12px 24px;background:linear-gradient(135deg,#7c3aed,#6366f1);border:none;border-radius:8px;color:#fff;font-weight:600;cursor:pointer;font-size:15px}
.card{background:#16162e;border-radius:8px;padding:16px;margin:8px 0;border:1px solid #222}
.card h3{color:#a78bfa;font-size:14px;margin-bottom:8px}
</style></head><body>
<div class="header"><div class="logo">◈ HopeAI v7.0.2</div><div class="sub">双流融合 | 时空流场 | 递归分形 | 三维体素 | 注意力环 → 门控加权 → 统一基座</div></div>
<div class="layout">
<div class="sidebar"><h3>导航</h3><button class="btn" onclick="showTab('chat')">对话</button><button class="btn" onclick="showTab('dashboard')">仪表盘</button><h3 style="margin-top:16px">五图通路</h3><button class="btn">a. 双流融合</button><button class="btn">b. 时空流场</button><button class="btn">c. 递归分形</button><button class="btn">d. 三维体素</button><button class="btn">e. 注意力环</button></div>
<div class="main"><div id="tab-chat" style="display:flex;flex-direction:column;flex:1">
<div class="chat" id="msgs"><div class="msg ai">欢迎使用 HopeAI v7.0.2<br><span class="path-tag path-a">a.双流融合</span><span class="path-tag path-b">b.时空流场</span><span class="path-tag path-c">c.递归分形</span><span class="path-tag path-d">d.三维体素</span><span class="path-tag path-e">e.注意力环</span><br>五路并行编码 → 门控动态加权 → 统一基座输出</div></div>
<div class="input-area"><input id="q" placeholder="输入问题..." onkeydown="event.key==='Enter'&&send()"><button onclick="send()">发送</button></div></div>
<div id="tab-dashboard" style="display:none;flex:1;overflow-y:auto;padding:20px"><div id="dash"></div></div></div></div>
<script>
function showTab(t){document.getElementById('tab-chat').style.display=t==='chat'?'flex':'none';document.getElementById('tab-dashboard').style.display=t==='dashboard'?'block':'none';if(t==='dashboard')loadDash()}
function m(role,txt,meta){const d=document.createElement('div');d.className='msg '+role;d.innerHTML=txt+(meta?'<div class="meta">'+meta+'</div>':'');document.getElementById('msgs').appendChild(d);d.scrollIntoView({behavior:'smooth'})}
async function send(){const q=document.getElementById('q').value.trim();if(!q)return;m('user',q);document.getElementById('q').value='';m('ai','…');const r=await fetch('/api/ask',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:q})});const d=await r.json();const meta='意图:'+d.meta.intent+' | '+d.meta.time+' | 体素:'+d.meta.voxel+' | 上下文加权:'+d.meta.context_weight.toFixed(2);document.getElementById('msgs').lastChild.innerHTML=d.answer+'<div class="meta">'+meta+'</div>'}
async function loadDash(){const r=await fetch('/api/dash');const d=await r.json();let h='';h+='<div class="card"><h3>五图融合基座</h3>调用:'+d.fusion.calls+' | '+'</div>';h+='<div class="card"><h3>体素空间</h3>体素:'+d.voxel.size+' | 初始化:'+d.voxel.initialized+'</div>';h+='<div class="card"><h3>性能</h3>查询:'+d.perf.total_q+' | QPS:'+d.perf.qps+' | 缓存命中:'+d.perf.cache_hits+'</div>';h+='<div class="card"><h3>知识库</h3>总数:'+d.kb.total+' | 查阅:'+d.kb.hits+' | 好评率:'+d.kb.helpful_rate+'</div>';h+='<div class="card"><h3>自进化</h3>处理:'+d.evolution.processed+' | 改进:'+d.evolution.improved+'</div>';document.getElementById('dash').innerHTML=h}
</script></body></html>"""


def main():
    ai = HopeAI()
    print("=" * 64)
    print(f"  {ai.name} v{ai.version}")
    print("  五图融合：双流|时空|分形|体素|注意环 → 统一基座")
    print("=" * 64)

    if "--web" in sys.argv:
        from http.server import HTTPServer, BaseHTTPRequestHandler
        class H(BaseHTTPRequestHandler):
            def do_GET(s):
                if s.path == "/": s._r("text/html", WEB_HTML)
                elif s.path == "/api/dash": s._r("application/json", json.dumps(ai.dashboard(),ensure_ascii=False))
                elif s.path == "/api/p2p": s._r("application/json", json.dumps(ai.p2p.get_sync_status(),ensure_ascii=False))
                elif s.path == "/api/evo": s._r("application/json", json.dumps(ai.evolution.get_stats(),ensure_ascii=False))
                elif s.path == "/api/fusion": s._r("application/json", json.dumps(ai.fusion.stats(),ensure_ascii=False))
                else: s._r("text/plain", "404", 404)
            def do_POST(s):
                if s.path == "/api/ask":
                    l = int(s.headers.get("Content-Length",0))
                    b = json.loads(s.rfile.read(l))
                    q = b.get("question","").strip()
                    if not q: s._r("application/json",'{"error":"empty"}',400); return
                    a, m = ai.ask(q)
                    s._r("application/json", json.dumps({"answer":a,"meta":m},ensure_ascii=False))
                else: s._r("text/plain","404",404)
            def _r(s, ct, b, code=200):
                s.send_response(code); s.send_header("Content-Type", ct+"; charset=utf-8")
                s.send_header("Access-Control-Allow-Origin","*"); s.end_headers()
                s.wfile.write(b.encode() if isinstance(b,str) else b)
            def log_message(s,*a): pass
        srv = HTTPServer(("0.0.0.0",8080), H)
        print("  Web: http://localhost:8080")
        srv.serve_forever()
        return

    # CLI模式
    print("  输入问题开始 | dash(仪表盘) | q(退出)")
    while True:
        try: q = input("\n你：").strip()
        except (EOFError,KeyboardInterrupt): print("\n再见"); break
        if q.lower() in ("q","quit","退出"): print("再见"); break
        if not q: continue
        if q == "dash":
            d = ai.dashboard()
            print(f"v{d['version']} | 查询:{d['perf']['total_q']} | KB:{d['kb']['total']}条")
            print(f"融合调用:{d['fusion']['calls']} | 体素:{d['voxel']['size']} | 进化:{d['evolution']['improved']}次")
            continue
        print("…", end="\r")
        a, m = ai.ask(q)
        print(f"\n网元：{a}")
        print(f"      [{m['intent']} | {m['time']} | ctx={m['context_weight']:.2f} | voxel={m['voxel']}]")

if __name__ == "__main__":
    main()
