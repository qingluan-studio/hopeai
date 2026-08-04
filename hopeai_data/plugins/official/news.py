# HopeAI 官方插件: news (新闻摘要)
import urllib.request, json, re

class NewsPlugin:
    name = "news"; version = "1.0.0"; author = "HopeAI"
    description = "新闻摘要，支持热榜和关键词搜索"
    category = "knowledge"; requires_network = True

    def on_load(self): pass
    def on_unload(self): pass

    def run(self, query, context=None):
        query = query.strip()
        try:
            # 热搜榜
            if query in ("热榜", "热搜", "头条", ""):
                url = "https://tenapi.cn/v2/weibohot"
                r = json.loads(urllib.request.urlopen(url, timeout=5).read())
                if r.get("code") == 200:
                    items = r.get("data", [])[:10]
                    result = "微博热搜:\n" + "\n".join([f"{i+1}. {it['name']}" for i, it in enumerate(items)])
                    return {"ok": True, "result": result, "meta": {"count": len(items)}}
            # 关键词搜索
            url = f"https://news.google.com/rss/search?q={urllib.parse.quote(query)}&hl=zh-CN&gl=CN&ceid=CN:zh-Hans"
            req = urllib.request.Request(url, headers={"User-Agent": "HopeAI"})
            text = urllib.request.urlopen(req, timeout=5).read().decode()
            titles = re.findall(r'<title>(.*?)</title>', text)
            items = [t for t in titles[2:12] if t and "Google" not in t]
            result = f"新闻({query}):\n" + "\n".join([f"- {t}" for t in items[:8]])
            return {"ok": True, "result": result, "meta": {"count": len(items)}}
        except Exception as e:
            return {"ok": False, "result": f"获取失败: {e}", "meta": {}}

import urllib.parse
plugin = NewsPlugin()
