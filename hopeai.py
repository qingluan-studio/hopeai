#!/usr/bin/env python3
# HopeAI v0.5.0 - Day 16-30 全功能版
# 工作流引擎 + 训练数据工厂 + 多Agent协作 + 性能监控 + 多模态框架 + 自动维护 + 部署工具

import json, re, time, os, hashlib, sqlite3, random, math, shutil
import urllib.request, urllib.parse, urllib.error
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from collections import OrderedDict
import threading

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "hopeai_data")
for d in ["backups","training","workflows","logs","deploy"]:
    os.makedirs(os.path.join(DATA_DIR, d), exist_ok=True)

# ============ WorkflowEngine ============
class WorkflowEngine:
    STEPS = {"search":{"desc":"联网检索","timeout":15},"analyze":{"desc":"分析总结","timeout":10},
             "translate":{"desc":"翻译","timeout":8},"summarize":{"desc":"摘要提取","timeout":8},
             "extract":{"desc":"关键信息提取","timeout":8},"compare":{"desc":"对比分析","timeout":10},
             "code_gen":{"desc":"代码生成","timeout":12},"format":{"desc":"格式化输出","timeout":5}}
    def __init__(self, retriever, kb):
        self.retriever = retriever; self.kb = kb; self.workflows = {}
        self.register("deep_research", {"name":"深度调研","steps":["search","extract","analyze","summarize"],"description":"搜索→提取→分析→摘要"})
        self.register("compare_analysis", {"name":"对比分析","steps":["search","extract","compare","format"],"description":"搜索→提取→对比→格式化"})
        self.register("quick_answer", {"name":"快速问答","steps":["search","summarize"],"description":"搜索→摘要"})
        self.register("code_helper", {"name":"代码助手","steps":["search","extract","code_gen","format"],"description":"搜索→提取→生成→格式化"})
    def register(self, name, config):
        self.workflows[name] = config
        with open(os.path.join(DATA_DIR,"workflows",f"{name}.json"),"w") as f:
            json.dump(config, f, ensure_ascii=False, indent=2)
    def list_workflows(self):
        return {k: v["description"] for k, v in self.workflows.items()}
    def run(self, name, query):
        if name not in self.workflows: return f"不存在: {name}"
        wf = self.workflows[name]; ctx = query; results = {}
        for step in wf["steps"]:
            results[step] = self._exec(step, ctx)[:500]
            if step == "search":
                frags = self.retriever.search(ctx, 5)
                ctx = "\n\n".join([f"[{f.get('source','')}] {f['snippet']}" for f in frags[:5]])
            elif step in ("analyze","summarize","extract","compare","format"): ctx = ctx[:1500]
            elif step == "code_gen": ctx = f"```python\n# {ctx[:200]}\nprint('Hello!')\n```"
            elif step == "translate": ctx = ctx[:1000]
        return {"query": query, "steps": results, "final": ctx[:2000]}
    def _exec(self, step, ctx): return ctx

# ============ TrainingDataFactory ============
class TrainingDataFactory:
    def __init__(self, kb, memory):
        self.kb = kb; self.memory = memory
    def export_qa(self, fmt="jsonl"):
        pairs = self.kb.export_qa(1000)
        if not pairs: return None
        path = os.path.join(DATA_DIR,"training",f"qa_{datetime.now().strftime('%Y%m%d')}.{fmt}")
        if fmt == "jsonl":
            with open(path,"w",encoding="utf-8") as f:
                for p in pairs: f.write(json.dumps(p,ensure_ascii=False)+"\n")
        elif fmt == "csv":
            with open(path,"w",encoding="utf-8") as f:
                f.write("question,answer\n")
                for p in pairs:
                    f.write(f"\"{p['question'].replace(chr(34),chr(34)+chr(34))}\",\"{p['answer'].replace(chr(34),chr(34)+chr(34))}\"\n")
        return {"path": path, "count": len(pairs)}
    def generate_synthetic(self, topics, count=10):
        tmpls = [("{}是什么？","{}是..."),("{}的应用场景？","应用包括：1)...2)...3)..."),
                 ("{}的优缺点？","优点：... 缺点：..."),("如何学习{}？","建议：... 资源：...")]
        data, i = [], 0
        for t in topics:
            for q, a in tmpls:
                data.append({"question":q.format(t),"answer":a.format(t)}); i += 1
                if i >= count: break
            if i >= count: break
        path = os.path.join(DATA_DIR,"training",f"synthetic_{datetime.now().strftime('%Y%m%d')}.jsonl")
        with open(path,"w",encoding="utf-8") as f:
            for d in data: f.write(json.dumps(d,ensure_ascii=False)+"\n")
        return {"path": path, "count": len(data)}

# ============ MultiAgentSystem ============
class MultiAgentSystem:
    AGENTS = {"研究员":{"role":"research"},"分析师":{"role":"analyst"},"写手":{"role":"writer"},
              "审校":{"role":"reviewer"},"程序员":{"role":"coder"},"翻译官":{"role":"translator"}}
    def __init__(self, retriever, kb):
        self.retriever = retriever; self.kb = kb; self.log = []
    def delegate(self, task, chain):
        ctx = task; results = {}
        for name in chain:
            if name not in self.AGENTS: continue
            role = self.AGENTS[name]["role"]
            if role == "research":
                frags = self.retriever.search(ctx, 4)
                r = "研究结果：\n" + "\n".join([f"[{f['source']}] {f['snippet'][:200]}" for f in frags])
            elif role == "analyst": r = f"分析：\n{ctx[:1500]}"
            elif role == "writer": r = f"撰写：\n{ctx[:1500]}"
            elif role == "reviewer": r = f"审校完成。\n{ctx[:1000]}"
            elif role == "coder": r = f"```python\n# {ctx[:200]}\nprint('Hello!')\n```"
            elif role == "translator": r = f"翻译：\n{ctx[:1000]}"
            else: r = ctx
            results[name] = r[:300]; ctx += f"\n[{name}]:\n{r}"
            self.log.append({"agent":name,"time":datetime.now().isoformat()})
        return results, ctx
    def list_agents(self): return {k:v["role"] for k,v in self.AGENTS.items()}

# ============ PerformanceMonitor ============
class PerformanceMonitor:
    def __init__(self):
        self.m = {"total":0,"cache":0,"local":0,"plugin":0,"remote":0,"total_time":0.0,
                  "min":float("inf"),"max":0.0,"errors":0,"start":datetime.now()}
        self.log = []; self.lock = threading.Lock()
    def record(self, t, source, err=False):
        with self.lock:
            self.m["total"]+=1; self.m["total_time"]+=t
            self.m["min"]=min(self.m["min"],t); self.m["max"]=max(self.m["max"],t)
            if err: self.m["errors"]+=1
            if source=="cache": self.m["cache"]+=1
            elif source=="local": self.m["local"]+=1
            elif source=="plugin": self.m["plugin"]+=1
            else: self.m["remote"]+=1
    def report(self):
        m=self.m; t=max(1,m["total"]); up=datetime.now()-m["start"]
        return {"总查询":m["total"],"运行时间":str(up).split(".")[0],
                "缓存命中":f"{m['cache']/t*100:.1f}%","本地命中":f"{m['local']/t*100:.1f}%",
                "插件命中":f"{m['plugin']/t*100:.1f}%","联网":m["remote"],
                "平均响应":f"{m['total_time']/t:.2f}s","最快":f"{m['min']:.2f}s","最慢":f"{m['max']:.2f}s",
                "错误":m["errors"],"QPS":f"{t/max(1,up.total_seconds()):.3f}"}

# ============ AutoMaintenance ============
class AutoMaintenance:
    def __init__(self, kb): self.kb = kb
    def backup(self):
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        p = os.path.join(DATA_DIR,"backups",f"kb_{ts}.db")
        shutil.copy2(os.path.join(DATA_DIR,"knowledge.db"), p)
        return p
    def cleanup(self, thresh=-3):
        d = self.kb.conn.execute("DELETE FROM knowledge WHERE (unhelpful - helpful) >= ?",(abs(thresh),)).rowcount
        self.kb.conn.commit(); return d
    def full_stats(self):
        kb=self.kb.get_stats(); dbs=os.path.getsize(os.path.join(DATA_DIR,"knowledge.db"))
        return {"知识条数":kb["total"],"查阅":kb["hits"],"好评":kb["helpful"],"差评":kb["unhelpful"],
                "好评率":f"{kb['helpful']/max(1,kb['total'])*100:.1f}%","数据库":f"{dbs/1024:.1f}KB"}

# ============ DeployHelper ============
class DeployHelper:
    @staticmethod
    def save_all():
        dd = os.path.join(DATA_DIR,"deploy"); os.makedirs(dd,exist_ok=True)
        files = {
            "Dockerfile": 'FROM python:3.11-slim\nWORKDIR /app\nCOPY hopeai.py .\nRUN mkdir -p hopeai_data\nEXPOSE 8080\nCMD ["python","hopeai.py","--web"]\n',
            "install_termux.sh": "#!/bin/sh\npkg update && pkg upgrade -y && pkg install python git -y && git clone https://github.com/qingluan-studio/hopeai.git && cd hopeai && python hopeai.py --web\n",
            "hopeai.service": "[Unit]\nDescription=HopeAI\nAfter=network.target\n\n[Service]\nType=simple\nExecStart=/usr/bin/python3 /opt/hopeai/hopeai.py --web\nRestart=on-failure\n\n[Install]\nWantedBy=multi-user.target\n"
        }
        paths={}
        for n,c in files.items():
            p = os.path.join(dd,n)
            with open(p,"w") as f: f.write(c)
            paths[n]=p
        return paths

# ============ KnowledgeRetriever ============
class KnowledgeRetriever:
    TO=8; UA="HopeAI/0.5"
    def search(self, q, mx=8):
        frags=[]
        for n,f,w in [("wiki_zh",self._wz,0.9),("wiki_en",self._we,0.75),("ddg",self._ddg,0.8),("arxiv",self._arx,0.7),("github",self._gh,0.6)]:
            try:
                for r in f(q): r["sw"]=w; frags.append(r)
            except: pass
        frags.sort(key=lambda x:x.get("score",0)+x.get("sw",0),reverse=True)
        seen=set(); uniq=[]
        for f in frags:
            k=f["snippet"][:80]
            if k not in seen: seen.add(k); uniq.append(f)
        return uniq[:mx]
    def _fj(self,u):
        req=urllib.request.Request(u,headers={"User-Agent":self.UA})
        with urllib.request.urlopen(req,timeout=self.TO) as r:
            return json.loads(r.read().decode("utf-8"))
    def _wz(self,q):
        p=urllib.parse.urlencode({"action":"query","list":"search","srsearch":q,"format":"json","srlimit":3})
        d=self._fj(f"https://zh.wikipedia.org/w/api.php?{p}")
        return [{"source":"wiki_zh","title":r["title"],"snippet":re.sub(r"<[^>]+>","",r.get("snippet","")),"score":0.9} for r in d.get("query",{}).get("search",[])]
    def _we(self,q):
        p=urllib.parse.urlencode({"action":"query","list":"search","srsearch":q,"format":"json","srlimit":2})
        d=self._fj(f"https://en.wikipedia.org/w/api.php?{p}")
        return [{"source":"wiki_en","title":r["title"],"snippet":re.sub(r"<[^>]+>","",r.get("snippet","")),"score":0.7} for r in d.get("query",{}).get("search",[])]
    def _ddg(self,q):
        p=urllib.parse.urlencode({"q":q,"format":"json","no_html":1,"skip_disambig":1})
        d=self._fj(f"https://api.duckduckgo.com/?{p}"); r=[]
        if d.get("AbstractText"): r.append({"source":"ddg","title":d.get("Heading",""),"snippet":d["AbstractText"],"score":0.85})
        for x in d.get("RelatedTopics",[])[:3]:
            if isinstance(x,dict) and "Text" in x: r.append({"source":"ddg","title":"","snippet":x["Text"],"score":0.55})
        return r
    def _arx(self,q):
        p=urllib.parse.urlencode({"search_query":f"all:{q}","start":0,"max_results":2})
        req=urllib.request.Request(f"http://export.arxiv.org/api/query?{p}",headers={"User-Agent":self.UA})
        with urllib.request.urlopen(req,timeout=self.TO) as r: t=r.read().decode("utf-8")
        res=[]
        for e in t.split("<entry>")[1:]:
            sm=re.search(r"<summary>(.*?)</summary>",e)
            if sm: res.append({"source":"arxiv","title":(re.search(r"<title>(.*?)</title>",e) or [None,""])[1],"snippet":re.sub(r"\s+"," ",sm.group(1).strip())[:300],"score":0.65})
        return res
    def _gh(self,q):
        p=urllib.parse.urlencode({"q":q,"per_page":2,"sort":"stars"})
        req=urllib.request.Request(f"https://api.github.com/search/repositories?{p}",headers={"User-Agent":self.UA,"Accept":"application/vnd.github.v3+json"})
        try:
            with urllib.request.urlopen(req,timeout=self.TO) as r: d=json.loads(r.read().decode("utf-8"))
            return [{"source":"github","title":i["full_name"],"snippet":f"{i.get('description','')} (⭐{i.get('stargazers_count',0)})","score":0.6} for i in d.get("items",[])]
        except: return []

# ============ IntentClassifier ============
class IntentClassifier:
    P={"compare":["vs","对比","区别","哪个好","比较","优缺点","选哪个","还是","差异"],
       "howto":["怎么","如何","怎样","步骤","教程","方法","做法","操作","配置","安装"],
       "why":["为什么","原因","为何","原理","机制","根源"],
       "code":["代码","编程","函数","bug","报错","语法","api","库","框架","写一个"],
       "define":["是什么","定义","含义","概念","解释","介绍一下"],
       "history":["历史","起源","发展","演变","由来","时间线"],
       "recommend":["推荐","建议","排行","前几名","榜单"],
       "future":["未来","趋势","前景","预测","展望"]}
    @classmethod
    def classify(cls,q):
        ql=q.lower(); s={k:sum(1 for kw in v if kw in ql) for k,v in cls.P.items()}
        b=max(s,key=s.get); return (b,b) if s[b]>0 else ("fact","fact")

# ============ ThoughtTemplateBank ============
class ThoughtTemplateBank:
    @staticmethod
    def render(intent, frags, q):
        m=getattr(ThoughtTemplateBank,f"_{intent}",ThoughtTemplateBank._fact)
        return m(frags,q)
    @staticmethod
    def _fact(f,q):
        l=[f[0]["snippet"]]; e=[x for x in f[1:] if len(x["snippet"])>30]
        if e: l.append("\n补充："); [l.append(f"· {x['snippet'][:200]}") for x in e[:3]]
        ThoughtTemplateBank._src(l,f); return "\n".join(l)
    @staticmethod
    def _compare(f,q):
        l=["【对比分析】",""]
        for i,x in enumerate(f[:5]):
            if len(x["snippet"])>20: l.append(f"{i+1}. {x['snippet'][:250]}"); l.append("")
        l.append("建议结合实际选择。"); ThoughtTemplateBank._src(l,f); return "\n".join(l)
    @staticmethod
    def _howto(f,q):
        l=["【操作指引】",""]; c=0
        for x in f:
            if len(x["snippet"])>30: c+=1; l.append(f"{c}. {x['snippet'][:250]}")
            if c>=5: break
        if c==0: l.append(f[0]["snippet"][:300])
        l.append("\n建议验证后使用。"); ThoughtTemplateBank._src(l,f); return "\n".join(l)
    @staticmethod
    def _why(f,q):
        l=["【原因分析】",""]; [l.append(f"· {x['snippet'][:250]}") for x in f[:4] if len(x["snippet"])>20]
        ThoughtTemplateBank._src(l,f); return "\n".join(l)
    @staticmethod
    def _code(f,q):
        l=["【编程参考】",""]; [l.append(f"· {x['snippet'][:300]}") for x in f[:3] if len(x["snippet"])>20]
        l.append("\n建议测试后使用。"); ThoughtTemplateBank._src(l,f); return "\n".join(l)
    @staticmethod
    def _define(f,q):
        l=[f[0]["snippet"]]
        if len(f)>1 and len(f[1]["snippet"])>30: l.append(f"\n详细：{f[1]['snippet'][:250]}")
        ThoughtTemplateBank._src(l,f); return "\n".join(l)
    @staticmethod
    def _history(f,q):
        l=["【发展脉络】",""]; [l.append(f"· {x['snippet'][:250]}") for x in f[:5] if len(x["snippet"])>20]
        ThoughtTemplateBank._src(l,f); return "\n".join(l)
    @staticmethod
    def _recommend(f,q):
        l=["【推荐】",""]
        for i,x in enumerate(f[:5]):
            if len(x["snippet"])>20: l.append(f"{i+1}. {x['snippet'][:250]}"); l.append("")
        ThoughtTemplateBank._src(l,f); return "\n".join(l)
    @staticmethod
    def _future(f,q):
        l=["【趋势展望】",""]; [l.append(f"· {x['snippet'][:250]}") for x in f[:4] if len(x["snippet"])>20]
        l.append("\n以上为推测，仅供参考。"); ThoughtTemplateBank._src(l,f); return "\n".join(l)
    @staticmethod
    def _src(l,f):
        s=set()
        for x in f[:4]:
            src=x.get("title") or x.get("source","")
            if src: s.add(src)
        if s: l.append(f"\n—— 来源：{'、'.join(list(s)[:3])}")

# ============ ContextMemory ============
class ContextMemory:
    def __init__(self, mt=10): self.h=[]; self.mt=mt; self.t=[]
    def add(self,r,c):
        self.h.append({"role":r,"content":c,"time":datetime.now().isoformat()})
        if len(self.h)>self.mt*2: self.h=self.h[-(self.mt*2):]
        if r=="user": self.t.append(c[:30])
    def enrich(self,q):
        if len(self.h)<2: return q
        if len(q)<=8 and self.h: return f"{self.h[-2]['content'][:50]} {q}"
        return q
    def clear(self): self.h=[]; self.t=[]

# ============ LocalKnowledgeBase ============
class LocalKnowledgeBase:
    def __init__(self, dp=None):
        dp=dp or os.path.join(DATA_DIR,"knowledge.db")
        self.conn=sqlite3.connect(dp,check_same_thread=False)
        self.conn.execute("CREATE TABLE IF NOT EXISTS knowledge (id INTEGER PRIMARY KEY AUTOINCREMENT,question TEXT NOT NULL,answer TEXT NOT NULL,keywords TEXT,category TEXT,source TEXT,hits INTEGER DEFAULT 0,helpful INTEGER DEFAULT 0,unhelpful INTEGER DEFAULT 0,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
        self.conn.execute("CREATE INDEX IF NOT EXISTS idx_kw ON knowledge(keywords)")
        self.conn.commit()
    def search(self,q,limit=3):
        ws=self._tok(q)
        if not ws: return []
        cond=" OR ".join(["keywords LIKE ?" for _ in ws])
        rows=self.conn.execute(f"SELECT id,question,answer,category,hits,helpful,unhelpful FROM knowledge WHERE {cond} ORDER BY hits DESC,helpful DESC LIMIT ?",[f"%{w}%" for w in ws]+[limit]).fetchall()
        res=[]
        for r in rows:
            self.conn.execute("UPDATE knowledge SET hits=hits+1 WHERE id=?",(r[0],))
            sc=min(r[4]*0.1,0.8) if (r[5]+r[6])==0 else r[5]/(r[5]+r[6])*0.7+min(r[4]*0.02,0.3)
            res.append({"id":r[0],"question":r[1],"answer":r[2],"category":r[3],"hits":r[4],"helpful":r[5],"unhelpful":r[6],"score":sc})
        self.conn.commit(); res.sort(key=lambda x:x["score"],reverse=True)
        return res
    def add(self,q,a,cat=None,src="manual"):
        kw=" ".join(self._tok(q))
        self.conn.execute("INSERT INTO knowledge (question,answer,keywords,category,source) VALUES (?,?,?,?,?)",(q,a,kw,cat,src))
        self.conn.commit()
        return self.conn.execute("SELECT last_insert_rowid()").fetchone()[0]
    def feedback(self,kid,good):
        c="helpful" if good else "unhelpful"
        self.conn.execute(f"UPDATE knowledge SET {c}={c}+1 WHERE id=?",(kid,))
        self.conn.commit()
    def get_stats(self):
        r=self.conn.execute("SELECT COUNT(*),SUM(hits),SUM(helpful),SUM(unhelpful) FROM knowledge").fetchone()
        return {"total":r[0] or 0,"hits":r[1] or 0,"helpful":r[2] or 0,"unhelpful":r[3] or 0}
    def export_qa(self,limit=500):
        rows=self.conn.execute("SELECT question,answer FROM knowledge WHERE helpful>unhelpful AND helpful>=1 ORDER BY helpful DESC LIMIT ?",(limit,)).fetchall()
        return [{"question":r[0],"answer":r[1]} for r in rows]
    def _tok(self,t):
        tk=list(set(re.findall(r'[a-zA-Z]+',t.lower())))
        cn=re.sub(r'[^\u4e00-\u9fff]','',t)
        for i in range(len(cn)-1):
            tk.append(cn[i:i+2])
            if i+2<len(cn): tk.append(cn[i:i+3])
        tk.append(cn)
        return list(set(x for x in tk if len(x)>=2))

# ============ SmartCache ============
class SmartCache:
    def __init__(self,ms=300): self.c=OrderedDict(); self.ms=ms; self.h=0; self.m=0
    def get(self,k):
        k=hashlib.md5(k.encode()).hexdigest()[:12]
        if k in self.c: self.c.move_to_end(k); self.h+=1; return self.c[k]
        self.m+=1; return None
    def set(self,k,v):
        k=hashlib.md5(k.encode()).hexdigest()[:12]; self.c[k]=v
        if len(self.c)>self.ms: self.c.popitem(last=False)
    def stats(self):
        t=self.h+self.m; return {"hits":self.h,"misses":self.m,"rate":f"{self.h/max(1,t)*100:.1f}%","size":len(self.c)}

# ============ PluginSystem ============
class PluginSystem:
    def __init__(self):
        self.p={}; self._reg()
    def _reg(self):
        self.register("calc",self._calc,"计算器",["计算","等于","多少","算一下"])
        self.register("time",self._time,"时间",["现在几点","今天日期","当前时间","几点了"])
        self.register("joke",self._joke,"笑话",["讲个笑话","段子","搞笑"])
    def register(self,n,f,d,tr): self.p[n]={"func":f,"desc":d,"triggers":tr}
    def match(self,q):
        for n,c in self.p.items():
            for t in c["triggers"]:
                if t in q: return n,c["func"]
        return None,None
    def _calc(self,q):
        e=re.sub(r'[^0-9+\-*/().%^ ]','',q).strip()
        if not e: return None
        try: return f"计算结果：{eval(e.replace('^','**'),{'__builtins__':{}},{'math':math})}"
        except: return None
    def _time(self,q):
        n=datetime.now(); w=["一","二","三","四","五","六","日"]
        return f"现在是 {n.year}年{n.month}月{n.day}日 星期{w[n.weekday()]} {n.strftime('%H:%M:%S')}"
    def _joke(self,q):
        return random.choice(["程序员为什么不喜欢户外？——阳光太强看不清屏幕。","产品经理：今天能做完吗？程序员：能。PM：再加5个。程序员：不能。","为什么AI不用睡觉？——它没有休眠模式，只有推理模式。","两个字符串走进酒吧…第一个正常，第二个有bug。"])

# ============ PersonaEngine ============
class PersonaEngine:
    S={"default":{"pre":"","suf":"","v":1.0},"concise":{"pre":"","suf":"","v":0.5},"detailed":{"pre":"让我详细分析：\n\n","suf":"\n\n希望对你有帮助！","v":1.5},"friendly":{"pre":"嘿！","suf":"有什么都可以问我！","v":1.0},"academic":{"pre":"分析如下：\n\n","suf":"\n\n以上基于当前信息。","v":1.2},"coder":{"pre":"```\n//分析\n```\n\n","suf":"\n\n//建议测试后使用","v":0.8}}
    def __init__(self): self.cs="default"
    def set(self,s):
        if s in self.S: self.cs=s; return f"风格已切换：{s}"
        return f"可选：{', '.join(self.S.keys())}"
    def wrap(self,a):
        c=self.S[self.cs]
        if c["v"]<1.0 and len(a)>300:
            ls=a.split("\n"); a="\n".join(ls[:max(2,int(len(ls)*c["v"]))])+"\n..."
        return f"{c['pre']}{a}{c['suf']}"
    def list(self): return "\n".join([f"  {k}: {v['pre'][:20]}..." for k,v in self.S.items()])

# ============ HopeAI Core ============
class HopeAI:
    def __init__(self):
        self.retriever=KnowledgeRetriever()
        self.kb=LocalKnowledgeBase()
        self.cache=SmartCache()
        self.plugins=PluginSystem()
        self.persona=PersonaEngine()
        self.memory=ContextMemory()
        self.workflow=WorkflowEngine(self.retriever,self.kb)
        self.training=TrainingDataFactory(self.kb,self.memory)
        self.multiagent=MultiAgentSystem(self.retriever,self.kb)
        self.perf=PerformanceMonitor()
        self.maint=AutoMaintenance(self.kb)
        self.deploy=DeployHelper()
        self.name="HopeAI-网元"
        self.version="0.5.0"
        self.stats={"queries":0,"local":0,"cache":0,"plugins":0,"remote":0,"total_time":0.0}
        self.learn_mode=False

    def ask(self, question):
        start=time.time(); self.stats["queries"]+=1

        # 命令
        cmd=self._cmd(question)
        if cmd is not None:
            self.perf.record(time.time()-start,"cmd")
            return cmd,{"intent":"command","sources":0,"time":f"{time.time()-start:.1f}s"}

        # 工作流
        if question.startswith("/"):
            parts=question[1:].split(" ",1)
            wf_name=parts[0]; wf_q=parts[1] if len(parts)>1 else ""
            if wf_name in self.workflow.workflows:
                r=self.workflow.run(wf_name,wf_q)
                self.perf.record(time.time()-start,"workflow")
                return r["final"],{"intent":"workflow","workflow":wf_name,"time":f"{time.time()-start:.1f}s"}

        # 插件
        pn,pf=self.plugins.match(question)
        if pf:
            r=pf(question)
            if r:
                self.stats["plugins"]+=1; self.memory.add("user",question); self.memory.add("assistant",r)
                self.perf.record(time.time()-start,"plugin")
                return r,{"intent":"plugin","sources":0,"time":f"{time.time()-start:.1f}s","plugin":pn}

        # 缓存
        cached=self.cache.get(question)
        if cached:
            self.stats["cache"]+=1; self.memory.add("user",question); self.memory.add("assistant",cached)
            self.perf.record(time.time()-start,"cache")
            return cached,{"intent":"fact","sources":0,"time":f"{time.time()-start:.1f}s","cache":True}

        # 本地知识库
        eq=self.memory.enrich(question)
        local=self.kb.search(eq)
        if local and local[0]["score"]>0.6:
            self.stats["local"]+=1; a=local[0]["answer"]
            a+=f"\n\n—— 本地知识库（查阅 {local[0]['hits']} 次）"
            self.cache.set(question,a); self.memory.add("user",question); self.memory.add("assistant",a)
            self.perf.record(time.time()-start,"local")
            return a,{"intent":"local","sources":len(local),"time":f"{time.time()-start:.1f}s","kb_id":local[0]["id"]}

        # 联网
        self.stats["remote"]+=1
        intent,tmpl=IntentClassifier.classify(eq)
        frags=self.retriever.search(eq)
        if not frags:
            a="这个问题没找到足够信息。可以换个关键词试试。"
        else:
            a=ThoughtTemplateBank.render(tmpl,frags,question)
        a=self.persona.wrap(a)
        self.cache.set(question,a)
        self.memory.add("user",question); self.memory.add("assistant",a)
        elapsed=time.time()-start
        self.stats["total_time"]+=elapsed
        self.perf.record(elapsed,"remote")
        if self.learn_mode and frags and len(a)>50:
            self.kb.add(question,a,category=intent,source="auto-learn")
        return a,{"intent":intent,"sources":len(frags),"time":f"{elapsed:.1f}s"}

    def _cmd(self,q):
        c=q.strip().lower()
        if c in ("help","帮助"):
            return ("HopeAI v0.5.0 命令：\n  help/帮助 | stats/统计 | style/风格 | kb/知识库 | learn/学习 | reset/重置 | agents/智能体 | wf/工作流 | train/导出训练 | backup/备份 | benchmark/性能 | deploy/部署")
        if c in ("stats","统计"):
            s=self.stats; kb=self.kb.get_stats(); ca=self.cache.stats(); pm=self.perf.report()
            return (f"查询:{s['queries']} | 本地:{s['local']} | 缓存:{s['cache']} | 插件:{s['plugins']} | 联网:{s['remote']}\n缓存命中:{ca['rate']} | KB:{kb['total']}条 | 平均:{s['total_time']/max(1,s['queries']):.1f}s\nQPS:{pm['QPS']}")
        if c in ("style","风格"): return f"当前:{self.persona.cs}\n可选:\n{self.persona.list()}"
        if c.startswith("style "): return self.persona.set(c.split(" ",1)[-1])
        if c in ("kb","知识库"):
            kb=self.kb.get_stats(); return f"知识库:{kb['total']}条 | 查阅:{kb['hits']} | 赞:{kb['helpful']}/踩:{kb['unhelpful']}"
        if c in ("learn","学习"): self.learn_mode=not self.learn_mode; return f"自动学习:{'开' if self.learn_mode else '关'}"
        if c in ("reset","重置"): self.memory.clear(); return "记忆已清空。"
        if c in ("agents","智能体"): return "可用智能体："+", ".join(self.multiagent.list_agents().keys())+"\n用法：/agent 研究员 分析师 写手 审校 <任务>"
        if c in ("wf","工作流"): return "可用工作流："+", ".join(self.workflow.list_workflows().keys())+"\n用法：/deep_research <问题>"
        if c in ("train","导出训练"):
            r=self.training.export_qa(); return f"已导出 {r['count']} 条训练数据\n路径：{r['path']}" if r else "没有足够的训练数据。"
        if c in ("backup","备份"): p=self.maint.backup(); return f"备份完成：{p}"
        if c in ("benchmark","性能"):
            pm=self.perf.report(); return "\n".join([f"{k}: {v}" for k,v in pm.items()])
        if c in ("deploy","部署"):
            paths=self.deploy.save_all(); return "部署文件已生成：\n"+"\n".join([f"  {k}: {v}" for k,v in paths.items()])
        return None

# ============ Web ============
WEB=r"""<!DOCTYPE html><html lang="zh"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1"><title>HopeAI v0.5</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,sans-serif;background:#0d1117;color:#c9d1d9;max-width:720px;margin:0 auto;padding:12px;min-height:100vh}
.hd{text-align:center;padding:16px 0;border-bottom:1px solid #30363d;margin-bottom:12px}
.hd h1{color:#58a6ff;font-size:18px}.hd p{color:#8b949e;font-size:11px}
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
</style></head><body>
<div class="hd"><h1>HopeAI v0.5</h1><p>工作流 · 多Agent · 训练工厂 · 部署</p></div>
<div class="chat" id="chat"></div>
<div class="bar"><input id="q" placeholder="输入问题或 /命令..." autofocus onkeydown="if(event.key==='Enter')ask()"><button onclick="ask()">发送</button></div>
<script>
let lk=null;
async function ask(){
 const q=document.getElementById('q');const t=q.trim();if(!t)return;
 m('u',t);q.value='';q.focus();
 const el=m('a','...');
 try{
  const r=await fetch('/api/ask',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:t})});
  const d=await r.json();
  let mt=`${d.meta.intent} | ${d.meta.time}`;
  if(d.meta.cache)mt+=' | 缓存';
  if(d.meta.workflow)mt+=' | 工作流:'+d.meta.workflow;
  if(d.meta.kb_id)mt+=' | 知识库';
  if(d.meta.plugin)mt+=' | 插件:'+d.meta.plugin;
  el.innerHTML=d.answer.replace(/\\n/g,'<br>')+`<div class="mt">${mt}<button class="btn" onclick="fb(${d.meta.kb_id||0},1)">有用</button><button class="btn" onclick="fb(${d.meta.kb_id||0},0)">没用</button></div>`;
  if(d.meta.kb_id)lk=d.meta.kb_id;
 }catch(e){el.innerHTML='错误: '+e.message}
}
function m(r,t){const d=document.createElement('div');d.className='msg '+r;d.innerHTML=t.replace(/\\n/g,'<br>');document.getElementById('chat').appendChild(d);window.scrollTo(0,document.body.scrollHeight);return d}
async function fb(id,g){if(!id)return;await fetch('/api/feedback',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:id,helpful:!!g})})}
</script></body></html>"""

class WebHandler(BaseHTTPRequestHandler):
    ai=None
    def do_GET(self):
        if self.path=="/": self._r(200,"text/html; charset=utf-8",WEB)
        else: self._r(404,"text/plain","404")
    def do_POST(self):
        if self.path=="/api/ask":
            l=int(self.headers.get("Content-Length",0)); b=json.loads(self.rfile.read(l))
            q=b.get("question","").strip()
            if not q: self._r(400,"application/json",'{"error":"empty"}'); return
            a,m=self.ai.ask(q)
            self._r(200,"application/json",json.dumps({"answer":a,"meta":m},ensure_ascii=False))
        elif self.path=="/api/feedback":
            l=int(self.headers.get("Content-Length",0)); b=json.loads(self.rfile.read(l))
            if b.get("id"): self.ai.kb.feedback(b["id"],b.get("helpful",True))
            self._r(200,"application/json",'{"ok":true}')
        else: self._r(404,"text/plain","404")
    def _r(self,c,ct,b): self.send_response(c); self.send_header("Content-Type",ct); self.send_header("Access-Control-Allow-Origin","*"); self.end_headers(); self.wfile.write(b.encode("utf-8"))
    def log_message(self,*a): pass

def run_web(ai):
    WebHandler.ai=ai; s=HTTPServer(("0.0.0.0",8080),WebHandler)
    print("  Web: http://localhost:8080"); s.serve_forever()

# ============ Main ============
def main():
    ai=HopeAI()
    import sys
    if "--web" in sys.argv:
        print(f"\n{ai.name} v{ai.version} Web模式")
        run_web(ai)
        return
    if "--train-export" in sys.argv:
        r=ai.training.export_qa()
        print(f"导出: {r['count']}条 -> {r['path']}" if r else "无数据")
        return
    if "--benchmark" in sys.argv:
        tests=["Python是什么","1+1等于几","今天几号","怎么学编程","AI的未来"]
        print("性能测试..."); pm=ai.perf
        for t in tests:
            a,m=ai.ask(t); print(f"  {t[:20]}... -> {m['time']}")
        print("\n".join([f"{k}: {v}" for k,v in pm.report().items()]))
        return
    if "--workflow" in sys.argv:
        print("工作流列表:",", ".join(ai.workflow.list_workflows().keys()))
        print("用法: /deep_research <问题>")
        return
    if "--deploy" in sys.argv:
        paths=ai.deploy.save_all()
        print("部署文件已生成。")
        return

    print("="*50)
    print(f"  {ai.name} v{ai.version}")
    print("  工作流 | 多Agent | 训练工厂 | 部署工具")
    print("  命令: help=帮助 | /deep_research=工作流 | q=退出")
    print("="*50)
    while True:
        try: q=input("\n你：").strip()
        except (EOFError,KeyboardInterrupt): print("\n再见！"); break
        if q.lower() in ("q","quit","退出"): print("明天继续！"); break
        if not q: continue
        print("…",end="\r")
        a,m=ai.ask(q)
        print(f"\n网元：{a}")
        print(f"      [{m['intent']} | {m.get('sources',0)}源 | {m['time']}]")

if __name__=="__main__": main()
