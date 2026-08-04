# HopeAI 官方插件: calculator
# 分类: tool | 版本: 1.0.0 | 作者: HopeAI

import math

class CalculatorPlugin:
    name = "calculator"
    version = "1.0.0"
    author = "HopeAI"
    description = "数学计算器，支持四则运算、三角函数、对数、幂运算"
    category = "tool"
    requires_network = False

    def on_load(self): pass
    def on_unload(self): pass

    def get_schema(self):
        return {"input": "数学表达式", "output": "计算结果", "example": "sqrt(3**2 + 4**2)"}

    def run(self, expr, context=None):
        safe = {"__builtins__": {}}
        allowed = {
            "abs": abs, "round": round, "max": max, "min": min, "pow": pow,
            "sqrt": math.sqrt, "sin": math.sin, "cos": math.cos, "tan": math.tan,
            "log": math.log, "log10": math.log10, "log2": math.log2,
            "pi": math.pi, "e": math.e, "ceil": math.ceil, "floor": math.floor,
            "radians": math.radians, "degrees": math.degrees,
            "factorial": math.factorial, "gcd": math.gcd,
            "sinh": math.sinh, "cosh": math.cosh, "tanh": math.tanh,
            "exp": math.exp
        }
        try:
            result = eval(expr, safe, allowed)
            return {"ok": True, "result": str(result), "meta": {"type": type(result).__name__}}
        except Exception as e:
            return {"ok": False, "result": f"计算错误: {e}", "meta": {}}

plugin = CalculatorPlugin()
