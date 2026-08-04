# HopeAI 官方插件: code_review (代码审查)
import re

class CodeReviewPlugin:
    name = "code_review"; version = "1.0.0"; author = "HopeAI"
    description = "代码审查：检查常见问题、风格、潜在bug"
    category = "tool"; requires_network = False

    PATTERNS = [
        (r"except\s*:", "缺少具体异常类型", "warning"),
        (r"except\s+Exception\s*:", "捕获过于宽泛", "warning"),
        (r"password\s*=\s*['\"]\w+['\"]", "硬编码密码", "error"),
        (r"TODO|FIXME|HACK", "未完成注释", "info"),
        (r"eval\s*\(|exec\s*\(", "使用eval/exec，安全风险", "error"),
        (r"from\s+.*\s+import\s+\*", "通配符导入，命名空间污染", "warning"),
        (r"print\s*\(", "残留调试print", "info"),
        (r"os\.system\s*\(|subprocess\.call\s*\(", "shell命令注入风险", "error"),
        (r"open\([^)]*,\s*['\"]w", "文件写入操作确认", "info"),
        (r"\.read\(\)\s*\n", "一次性读取大文件可能OOM", "warning"),
    ]

    def on_load(self): pass
    def on_unload(self): pass

    def run(self, code, context=None):
        if not code or len(code) < 10:
            return {"ok": False, "result": "代码太短", "meta": {}}

        issues = []
        for line_no, line in enumerate(code.split("\n"), 1):
            for pattern, msg, level in self.PATTERNS:
                if re.search(pattern, line):
                    issues.append((line_no, msg, level, line.strip()[:60]))
                    break

        stats = {"error": sum(1 for _, _, l, _ in issues if l=="error"),
                 "warning": sum(1 for _, _, l, _ in issues if l=="warning"),
                 "info": sum(1 for _, _, l, _ in issues if l=="info")}

        if not issues:
            return {"ok": True, "result": "未发现明显问题", "meta": stats}

        result = f"代码审查: {len(issues)}个问题\n"
        for ln, msg, level, snippet in issues:
            result += f"  L{ln}: [{level}] {msg} — {snippet}\n"
        return {"ok": True, "result": result.strip(), "meta": stats}

plugin = CodeReviewPlugin()
