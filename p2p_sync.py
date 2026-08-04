# HopeAI P2P同步模块 (v3.0)
# 基于SQLite差分同步，轻量去中心化

import sqlite3, json, hashlib, os, time
from datetime import datetime, timezone

class P2PSyncEngine:
    """P2P同步引擎: 导出差分包 / 导入合并 / 冲突解决"""

    def __init__(self, db_path):
        self.db_path = db_path
        self._init_sync_table()

    def _init_sync_table(self):
        """初始化同步元数据表"""
        conn = sqlite3.connect(self.db_path)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS _sync_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                table_name TEXT, row_id TEXT, operation TEXT,
                ts REAL, hash TEXT, peer_id TEXT,
                merged INTEGER DEFAULT 0
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS _sync_peers (
                peer_id TEXT PRIMARY KEY,
                last_seen REAL, endpoint TEXT, trust INTEGER DEFAULT 1
            )
        """)
        conn.execute("CREATE INDEX IF NOT EXISTS idx_sync_ts ON _sync_log(ts)")
        conn.commit()
        conn.close()

    def export_sync_package(self, since_ts=None):
        """导出差分包: 从指定时间戳以来的所有变更"""
        conn = sqlite3.connect(self.db_path)
        if since_ts is None:
            cursor = conn.execute("SELECT MAX(ts) FROM _sync_log WHERE merged=1")
            row = cursor.fetchone()
            since_ts = row[0] if row and row[0] else 0

        rows = conn.execute(
            "SELECT table_name, row_id, operation, ts, hash FROM _sync_log WHERE ts > ? AND merged=1 ORDER BY ts",
            (since_ts,)
        ).fetchall()

        changes = []
        seen = set()
        for table, rid, op, ts, h in rows:
            # 同一row_id取最新操作
            key = (table, rid)
            if key in seen: continue
            seen.add(key)
            if op in ("INSERT", "UPDATE"):
                cols = [c[1] for c in conn.execute(f"PRAGMA table_info({table})").fetchall()]
                row_data = conn.execute(f"SELECT * FROM {table} WHERE rowid=?", (rid,)).fetchone()
                if row_data:
                    changes.append({"table": table, "row_id": rid, "operation": op,
                        "data": dict(zip(cols, row_data)), "ts": ts, "hash": h})
            elif op == "DELETE":
                changes.append({"table": table, "row_id": rid, "operation": "DELETE", "ts": ts, "hash": h})

        conn.close()
        package = {
            "format": "hopeai-sync-v1", "from_ts": since_ts,
            "to_ts": time.time(), "peer_id": self._get_peer_id(),
            "changes": changes, "checksum": ""
        }
        package["checksum"] = hashlib.sha256(json.dumps(changes, default=str).encode()).hexdigest()
        return package

    def import_sync_package(self, package, peer_id="remote"):
        """导入差分包并合并"""
        if not package.get("changes"):
            return {"ok": True, "merged": 0, "conflicts": 0}

        conn = sqlite3.connect(self.db_path)
        merged = conflicts = 0
        for change in package["changes"]:
            table = change["table"]
            data = change.get("data", {})
            row_id = change["row_id"]
            op = change["operation"]

            existing = conn.execute(f"SELECT * FROM {table} WHERE rowid=?", (row_id,)).fetchone()

            if op == "DELETE":
                if existing:
                    conn.execute(f"DELETE FROM {table} WHERE rowid=?", (row_id,))
                    merged += 1
            elif op in ("INSERT", "UPDATE"):
                if existing:
                    # 冲突: 基于时间戳LWW策略，更新者胜
                    existing_ts = conn.execute(
                        "SELECT ts FROM _sync_log WHERE table_name=? AND row_id=? ORDER BY ts DESC LIMIT 1",
                        (table, str(row_id))
                    ).fetchone()
                    if existing_ts and existing_ts[0] < change["ts"]:
                        self._upsert(conn, table, data, row_id)
                        merged += 1
                    else:
                        conflicts += 1
                else:
                    self._upsert(conn, table, data, row_id)
                    merged += 1

            # 记录同步
            conn.execute("INSERT INTO _sync_log(table_name,row_id,operation,ts,hash,peer_id,merged) VALUES(?,?,?,?,?,?,1)",
                (table, str(row_id), op, change.get("ts", time.time()), change.get("hash", ""), peer_id))

        conn.execute("INSERT OR REPLACE INTO _sync_peers(peer_id,last_seen) VALUES(?,?)",
            (peer_id, time.time()))
        conn.commit(); conn.close()
        return {"ok": True, "merged": merged, "conflicts": conflicts}

    def _upsert(self, conn, table, data, row_id=None):
        cols = [c[1] for c in conn.execute(f"PRAGMA table_info({table})").fetchall() if c[1] != "rowid"]
        vals = [data.get(c) for c in cols]
        placeholders = ",".join(["?"] * len(cols))
        cols_str = ",".join(cols)
        if row_id:
            updates = ",".join([f"{c}=excluded.{c}" for c in cols])
            conn.execute(f"INSERT INTO {table}(rowid,{cols_str}) VALUES(?{',' if cols_str else ''}{placeholders}) "
                f"ON CONFLICT(rowid) DO UPDATE SET {updates}", (row_id, *vals))
        else:
            conn.execute(f"INSERT INTO {table}({cols_str}) VALUES({placeholders})", vals)

    def _get_peer_id(self):
        h = hashlib.md5(self.db_path.encode()).hexdigest()[:8]
        return f"peer-{h}"

    def get_peers(self):
        conn = sqlite3.connect(self.db_path)
        peers = [dict(zip(["peer_id","last_seen","endpoint","trust"], r))
            for r in conn.execute("SELECT * FROM _sync_peers").fetchall()]
        conn.close()
        return peers

    def get_sync_status(self):
        conn = sqlite3.connect(self.db_path)
        total = conn.execute("SELECT COUNT(*) FROM _sync_log").fetchone()[0]
        merged = conn.execute("SELECT COUNT(*) FROM _sync_log WHERE merged=1").fetchone()[0]
        peers = conn.execute("SELECT COUNT(*) FROM _sync_peers").fetchone()[0]
        conn.close()
        return {"total_ops": total, "merged_ops": merged, "pending": total - merged, "known_peers": peers}
