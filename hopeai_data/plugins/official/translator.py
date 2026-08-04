# HopeAI 官方插件: translator
# 多语言翻译，基于规则+联网兜底

import re, urllib.request, json

class TranslatorPlugin:
    name = "translator"; version = "1.0.0"; author = "HopeAI"
    description = "多语言翻译，支持中英日韩法德西俄等"
    category = "tool"; requires_network = True

    # 内置词典
    _DICT = {
        "你好": "Hello", "谢谢": "Thank you", "再见": "Goodbye",
        "是": "Yes", "否": "No", "请": "Please", "帮助": "Help",
        "错误": "Error", "成功": "Success", "开始": "Start", "停止": "Stop",
        "文件": "File", "数据": "Data", "网络": "Network", "系统": "System",
        "你好世界": "Hello World", "我爱你": "I love you",
    }

    def on_load(self): pass
    def on_unload(self): pass

    def run(self, text, context=None):
        text = text.strip()
        # 格式: "zh->en 你好" 或 "翻译成英文 你好" 或直接 "你好"
        lang_map = {"中文": "zh", "英文": "en", "日文": "ja", "韩文": "ko", "法文": "fr", "德文": "de", "西班牙文": "es", "俄文": "ru"}
        target = "en"

        # 解析目标语言
        for kw, code in lang_map.items():
            if f"翻译成{kw}" in text or f"译成{kw}" in text:
                target = code
                text = text.replace(f"翻译成{kw}", "").replace(f"译成{kw}", "").strip()
                break
        m = re.match(r'(\w+)->(\w+)\s+(.+)', text)
        if m:
            target = m.group(2)
            text = m.group(3).strip()

        # 先查内置词典
        if text in self._DICT:
            return {"ok": True, "result": self._DICT[text], "meta": {"source": "builtin", "target": target}}

        # 联网兜底
        try:
            url = f"https://api.mymemory.translated.net/get?q={urllib.parse.quote(text)}&langpair=zh|{target}"
            r = json.loads(urllib.request.urlopen(url, timeout=5).read())
            result = r.get("responseData", {}).get("translatedText", text)
            return {"ok": True, "result": result, "meta": {"source": "api", "target": target}}
        except:
            return {"ok": True, "result": f"[{target}] {text}", "meta": {"source": "passthrough", "target": target}}

plugin = TranslatorPlugin()
