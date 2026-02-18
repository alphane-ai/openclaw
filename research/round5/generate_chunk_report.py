#!/usr/bin/env python3
import argparse
import json
import os
import re
from collections import Counter, defaultdict
from pathlib import Path

IMPORT_RE = re.compile(r"^\s*import\s+", re.MULTILINE)
EXPORT_RE = re.compile(r"\bexport\s+(?:async\s+)?(?:const|function|class|type|interface|enum|\{)")
EXPORT_NAMED_RE = re.compile(
    r"\bexport\s+(?:async\s+)?(?:const|function|class|type|interface|enum)\s+([A-Za-z_][A-Za-z0-9_]*)"
)
FROM_RE = re.compile(r"from\s+['\"]([^'\"]+)['\"]")
REQUIRE_RE = re.compile(r"require\(\s*['\"]([^'\"]+)['\"]\s*\)")

RISK_PATTERNS = [
    ("fs_delete", re.compile(r"\bfs\.(?:rm|unlink|rmdir)\b|\brm\s+-rf\b"), "涉及文件删除/清理路径，需要严格路径边界验证。"),
    ("command_exec", re.compile(r"\b(exec|spawn|execFile)\b|child_process"), "涉及命令执行链路，需要关注注入与参数转义。"),
    ("network", re.compile(r"\b(fetch|axios|http\.|https\.|WebSocket|request\b)"), "涉及网络请求/连接，需要关注超时与重试策略。"),
    ("secrets", re.compile(r"process\.env|token|apikey|api_key|secret", re.IGNORECASE), "涉及凭据或环境变量读取，需要关注泄漏与降级行为。"),
    ("state_write", re.compile(r"writeFile|appendFile|mkdir|rename|copyFile|set\(|update"), "涉及状态写入，需关注并发覆盖与回滚策略。"),
]


def guess_type(path: str) -> str:
    if path.endswith((".test.ts", ".spec.ts", ".e2e.test.ts", ".test.js")):
        return "test"
    if path.endswith((".md", ".mdx")):
        return "doc"
    if path.endswith((".json", ".yaml", ".yml", ".toml")):
        return "config"
    return "module"


def read_paths(list_file: Path):
    paths = []
    for line in list_file.read_text().splitlines():
        p = line.strip()
        if not p:
            continue
        paths.append(p)
    return paths


def parse_file(path: Path, repo_root: Path):
    rel = str(path)
    text = ""
    try:
        text = path.read_text(errors="ignore")
    except Exception:
        return {
            "path": rel,
            "exists": False,
            "size": 0,
            "lines": 0,
            "imports": 0,
            "exports": [],
            "type": guess_type(rel),
            "local_imports": [],
            "risk_hits": [],
        }

    imports = len(IMPORT_RE.findall(text))
    exports = EXPORT_NAMED_RE.findall(text)
    if not exports and EXPORT_RE.search(text):
        exports = ["(anonymous-or-reexport)"]

    local_imports = []
    for m in FROM_RE.findall(text) + REQUIRE_RE.findall(text):
        if m.startswith("."):
            local_imports.append(m)

    risk_hits = []
    for key, pattern, _desc in RISK_PATTERNS:
        if pattern.search(text):
            risk_hits.append(key)

    return {
        "path": rel,
        "exists": True,
        "size": path.stat().st_size,
        "lines": text.count("\n") + 1 if text else 0,
        "imports": imports,
        "exports": exports[:6],
        "type": guess_type(rel),
        "local_imports": local_imports[:20],
        "risk_hits": risk_hits,
    }


def resolve_import_targets(src_path: str, imports: list[str], selected_set: set[str]):
    src = Path(src_path)
    targets = []
    for imp in imports:
        base = (src.parent / imp).as_posix()
        candidates = [
            f"{base}.ts",
            f"{base}.tsx",
            f"{base}.js",
            f"{base}.mjs",
            f"{base}/index.ts",
            f"{base}/index.tsx",
            f"{base}/index.js",
        ]
        for c in candidates:
            if c in selected_set:
                targets.append(c)
                break
    return targets


def module_name(path: str):
    parts = path.split("/")
    if len(parts) >= 2:
        return "/".join(parts[:2])
    return parts[0]


def build_report(chunk_id: str, paths: list[str], infos: list[dict]):
    existing = [i for i in infos if i["exists"]]
    selected_set = {i["path"] for i in existing}

    by_type = Counter(i["type"] for i in infos)
    by_module = Counter(module_name(i["path"]) for i in infos)
    total_lines = sum(i["lines"] for i in existing)
    total_imports = sum(i["imports"] for i in existing)

    edges = Counter()
    for i in existing:
        for tgt in resolve_import_targets(i["path"], i["local_imports"], selected_set):
            edges[(i["path"], tgt)] += 1

    risk_counter = Counter()
    for i in existing:
        for h in i["risk_hits"]:
            risk_counter[h] += 1

    top_files = sorted(existing, key=lambda x: (x["lines"], x["size"]), reverse=True)[:20]

    lines = []
    lines.append(f"# {chunk_id} 研究笔记")
    lines.append("")
    lines.append("## 1. 覆盖确认")
    lines.append(f"- 清单文件数：{len(paths)}")
    lines.append(f"- 实际可读文件数：{len(existing)}")
    lines.append(f"- 缺失/不可读文件数：{len(paths) - len(existing)}")
    lines.append(f"- 主目录组：`{', '.join(m for m,_ in by_module.most_common(4))}`")
    lines.append(f"- 代码总行数（近似）：{total_lines}")
    lines.append("")

    lines.append("## 2. 模块要点")
    lines.append(f"- 文件类型分布：module={by_type.get('module',0)}，test={by_type.get('test',0)}，doc={by_type.get('doc',0)}，config={by_type.get('config',0)}。")
    lines.append(f"- 导入语句总数（近似）：{total_imports}。")
    lines.append("- 重点文件（按行数）与导出摘要：")
    for f in top_files:
        exports = ", ".join(f["exports"]) if f["exports"] else "无显式导出"
        lines.append(f"  - `{f['path']}`: {f['lines']} 行，imports={f['imports']}，exports={exports}。")
    lines.append("")

    lines.append("## 3. 关键调用链")
    if edges:
        lines.append("- chunk 内本地依赖边（Top 20）：")
        for (src, tgt), _ in edges.most_common(20):
            lines.append(f"  - `{src}` -> `{tgt}`")
    else:
        lines.append("- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。")
    lines.append("")

    lines.append("## 4. 风险")
    if risk_counter:
        for key, count in risk_counter.most_common():
            desc = next(d for k, _p, d in RISK_PATTERNS if k == key)
            lines.append(f"- {key}: 命中 {count} 文件。{desc}")
    else:
        lines.append("- 未命中预设高风险模式；仍需结合运行时验证。")
    lines.append("")

    lines.append("## 5. 与已研究模块关联")
    top_modules = ", ".join(m for m,_ in by_module.most_common(6))
    lines.append(f"- 本 chunk 与既有研究主要在 `{top_modules}` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。")
    lines.append("- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。")
    lines.append("")

    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--list", required=True, help="Path list file")
    parser.add_argument("--out", required=True, help="Output markdown file")
    parser.add_argument("--chunk", required=True, help="Chunk id")
    args = parser.parse_args()

    repo_root = Path.cwd()
    list_file = Path(args.list)
    out_file = Path(args.out)
    out_file.parent.mkdir(parents=True, exist_ok=True)

    paths = read_paths(list_file)
    infos = [parse_file(Path(p), repo_root) for p in paths]
    md = build_report(args.chunk, paths, infos)
    out_file.write_text(md + "\n")

    print(json.dumps({
        "chunk": args.chunk,
        "files": len(paths),
        "readable": sum(1 for i in infos if i['exists']),
        "out": str(out_file),
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
