# HopeAI 官方插件: workflow_orchestrator (工作流编排)
import json, os, time, threading, queue

class WorkflowOrchestrator:
    name = "workflow_orchestrator"; version = "1.0.0"; author = "HopeAI"
    description = "多插件串联编排：定义步骤→依次执行→返回汇总"
    category = "system"; requires_network = False

    def __init__(self):
        self._engine = None  # 运行时注入
        self._results = {}

    def on_load(self): pass
    def on_unload(self): pass

    def inject_engine(self, engine):
        self._engine = engine

    def run(self, workflow_json, context=None):
        """
        workflow_json: JSON字符串，定义工作流步骤
        格式: {"name": "xxx", "steps": [
            {"plugin": "translator", "input": "你好世界"},
            {"plugin": "weather", "input": "北京"}
        ]}
        """
        try:
            wf = json.loads(workflow_json) if isinstance(workflow_json, str) else workflow_json
        except:
            return {"ok": False, "result": "工作流JSON格式错误", "meta": {}}

        steps = wf.get("steps", [])
        results = []
        total_start = time.time()

        for i, step in enumerate(steps):
            plugin_name = step.get("plugin", "")
            plugin_input = step.get("input", "")
            step_name = step.get("name", f"step_{i+1}")

            if not self._engine:
                results.append({"step": step_name, "ok": False, "result": "引擎未注入"})
                continue

            plugin = self._engine.plugin_engine._plugins.get(plugin_name)
            if not plugin:
                results.append({"step": step_name, "ok": False, "result": f"插件 {plugin_name} 未加载"})
                continue

            try:
                t0 = time.time()
                res = plugin.run(plugin_input, context)
                elapsed = round((time.time() - t0) * 1000)
                results.append({"step": step_name, "plugin": plugin_name, "ok": res.get("ok", False),
                    "result": res.get("result", ""), "elapsed_ms": elapsed, "meta": res.get("meta", {})})
            except Exception as e:
                results.append({"step": step_name, "plugin": plugin_name, "ok": False,
                    "result": str(e), "elapsed_ms": 0})

        total_elapsed = round((time.time() - total_start) * 1000)
        summary = f"工作流'{wf.get('name', '未命名')}'完成: {len(results)}步, {total_elapsed}ms\n"
        for r in results:
            status = "OK" if r["ok"] else "FAIL"
            summary += f"  [{status}] {r['step']}: {r['result'][:80]}\n"

        return {"ok": True, "result": summary.strip(), "meta": {"steps": results, "total_ms": total_elapsed}}

plugin = WorkflowOrchestrator()
