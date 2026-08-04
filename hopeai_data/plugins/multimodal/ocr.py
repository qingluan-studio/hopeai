# HopeAI 多模态插件: ocr (图片文字识别)
import base64, urllib.request, json
try: from PIL import Image; HAS_PIL = True
except: HAS_PIL = False

class OCRPlugin:
    name = "ocr"; version = "1.0.0"; author = "HopeAI"
    description = "图片OCR文字识别，支持本地图片"
    category = "multimodal"; requires_network = True

    def on_load(self): pass
    def on_unload(self): pass

    def run(self, image_path, context=None):
        if not HAS_PIL:
            return {"ok": False, "result": "需要安装Pillow: pip install Pillow", "meta": {}}
        try:
            img = Image.open(image_path)
            w, h = img.size
            # 缩放到合理尺寸
            if max(w, h) > 2000:
                ratio = 2000 / max(w, h)
                img = img.resize((int(w*ratio), int(h*ratio)), Image.LANCZOS)
            buf = []
            img.save("/tmp/hopeai_ocr_tmp.png", "PNG")
            with open("/tmp/hopeai_ocr_tmp.png", "rb") as f:
                encoded = base64.b64encode(f.read()).decode()
            # 使用在线OCR API
            api_url = "https://api.ocr.space/parse/image"
            data = urllib.parse.urlencode({
                "apikey": "K81986882788957",
                "base64Image": f"data:image/png;base64,{encoded}",
                "language": "chs",
                "isOverlayRequired": "false"
            }).encode()
            req = urllib.request.Request(api_url, data=data)
            r = json.loads(urllib.request.urlopen(req, timeout=15).read().decode())
            text = r.get("ParsedResults", [{}])[0].get("ParsedText", "").strip()
            return {"ok": True, "result": text or "未识别到文字", "meta": {"path": image_path}}
        except Exception as e:
            return {"ok": False, "result": f"OCR失败: {e}", "meta": {}}

plugin = OCRPlugin()
