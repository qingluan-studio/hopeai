#!/usr/bin/env python3
"""HopeAI 训练流水线 - 数据采集/训练/转换/部署自动化"""
import json, os, sys, subprocess
from datetime import datetime

STAGES = ["collect", "eval", "convert", "deploy"]

class Pipeline:
    def __init__(self):
        self.base = os.path.dirname(os.path.abspath(__file__))
        self.log = {}
        os.makedirs(os.path.join(self.base, "../logs"), exist_ok=True)

    def run(self, stages=None):
        for stage in (stages or STAGES):
            fn = getattr(self, f"stage_{stage}", None)
            if not fn: continue
            print(f"\n[{stage}] ...")
            try:
                r = fn()
                self.log[stage] = {"status": "ok", "result": str(r)[:200]}
                print(f"[{stage}] OK: {r}")
            except Exception as e:
                self.log[stage] = {"status": "fail", "error": str(e)}
                print(f"[{stage}] FAIL: {e}")

        log_path = os.path.join(self.base, "../logs", f"pipeline_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
        with open(log_path, "w") as f:
            json.dump({"log": self.log, "time": datetime.now().isoformat()}, f, indent=2)
        print(f"\n日志: {log_path}")

    def stage_collect(self):
        r = subprocess.run([sys.executable, "collect_data.py"], capture_output=True, text=True, cwd=self.base)
        return r.stdout[-300:] if r.stdout else "完成"

    def stage_eval(self):
        train_path = os.path.join(self.base, "../data/train.json")
        if os.path.exists(train_path):
            with open(train_path) as f: d = json.load(f)
            return {"samples": len(d), "avg_instr": sum(len(x.get("instruction","")) for x in d)//max(1,len(d))}
        return "无训练数据"

    def stage_convert(self):
        return "需手动: python convert_to_gguf.py <lora_dir> <output.gguf>"

    def stage_deploy(self):
        return "需手动: python deploy_mobile.py"

if __name__ == "__main__":
    Pipeline().run(sys.argv[1:] if len(sys.argv) > 1 else None)
