# HopeAI 官方插件: weather
import urllib.request, json

class WeatherPlugin:
    name = "weather"; version = "1.0.0"; author = "HopeAI"
    description = "天气查询，支持城市名"
    category = "tool"; requires_network = True

    def on_load(self): pass
    def on_unload(self): pass

    def run(self, city, context=None):
        city = city.strip()
        try:
            url = f"https://wttr.in/{urllib.parse.quote(city)}?format=j1&lang=zh"
            r = json.loads(urllib.request.urlopen(url, timeout=8).read())
            c = r["current_condition"][0]
            w = r["weather"][0]
            result = f"{city}: {c['temp_C']}°C, {c['weatherDesc'][0]['value']}, 湿度{c['humidity']}%, 风速{c['windspeedKmph']}km/h\n今: {w['mintempC']}~{w['maxtempC']}°C"
            return {"ok": True, "result": result, "meta": {"city": city, "temp": c['temp_C']}}
        except Exception as e:
            return {"ok": False, "result": f"查询失败: {e}", "meta": {}}

import urllib.parse
plugin = WeatherPlugin()
