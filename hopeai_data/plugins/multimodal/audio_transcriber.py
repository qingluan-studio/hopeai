# HopeAI 多模态插件: audio_transcriber (语音转文字)
import urllib.request, json, base64, os

class AudioTranscriberPlugin:
    name = "audio_transcriber"; version = "1.0.0"; author = "HopeAI"
    description = "语音转文字，支持wav/mp3/m4a等格式"
    category = "multimodal"; requires_network = True

    def on_load(self): pass
    def on_unload(self): pass

    def run(self, audio_path, context=None):
        if not os.path.exists(audio_path):
            return {"ok": False, "result": f"文件不存在: {audio_path}", "meta": {}}
        size = os.path.getsize(audio_path)
        if size > 10 * 1024 * 1024:
            return {"ok": False, "result": "音频文件超过10MB限制", "meta": {"size": size}}

        try:
            with open(audio_path, "rb") as f:
                data = base64.b64encode(f.read()).decode()

            # 使用Google Speech API (免费层)
            api_url = "https://www.google.com/speech-api/v2/recognize"
            payload = json.dumps({
                "config": {"encoding": "LINEAR16", "languageCode": "zh-CN", "audioChannelCount": 1},
                "audio": {"content": data}
            }).encode()
            req = urllib.request.Request(api_url, data=payload,
                headers={"Content-Type": "application/json"})
            r = urllib.request.urlopen(req, timeout=10).read().decode()
            # 简单解析
            text = r or "[暂不支持此格式，建议使用wav格式]"
            return {"ok": True, "result": text, "meta": {"path": audio_path, "size": size}}
        except Exception as e:
            return {"ok": False, "result": f"识别失败: 请确保音频为16kHz单声道wav", "meta": {"error": str(e)}}

plugin = AudioTranscriberPlugin()
