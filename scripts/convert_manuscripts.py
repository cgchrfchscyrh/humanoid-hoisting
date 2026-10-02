"""Convert the supplied RCIM sources to semantic HTML. Requires Pandoc.

Run from the project root; source materials are never modified.
"""
from pathlib import Path
import json
import re
import subprocess
import shutil
import os

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "2026_Hoist_CES/rcim_submission"
OUT = ROOT / "src/content"


def group(text, start):
    while text[start].isspace():
        start += 1
    assert text[start] == "{", text[start:start + 60]
    depth = 1
    pos = start + 1
    while depth:
        if text[pos] == "{" and text[pos - 1] != "\\":
            depth += 1
        if text[pos] == "}" and text[pos - 1] != "\\":
            depth -= 1
        pos += 1
    return text[start + 1:pos - 1], pos


def unwrap(text, command, count, keep):
    token = "\\" + command
    while token in text:
        start = text.index(token)
        pos = start + len(token)
        groups = []
        for _ in range(count):
            value, pos = group(text, pos)
            groups.append(value)
        text = text[:start] + groups[keep] + text[pos:]
    return text


def prepare(text, supplementary):
    text = re.sub(r"(?<!\\)%[^\n]*", "", text)
    abstract = re.search(r"\\begin\{abstract\}(.*?)\\end\{abstract\}", text, re.S).group(1)
    text = re.sub(r"\\begin\{frontmatter\}.*?\\end\{frontmatter\}", "\\\\section*{Abstract}\n" + abstract.replace("\\", "\\\\"), text, flags=re.S)
    text = unwrap(text, "resizebox", 3, 2)
    # Preserve algorithm instructions and loops as actual lists.
    text = re.sub(r"\\begin\{algorithmic\}(?:\[\d+\])?", r"\\begin{enumerate}", text)
    text = text.replace(r"\end{algorithmic}", r"\end{enumerate}")
    text = text.replace(r"\Require", r"\item \textbf{Inputs:}")
    text = text.replace(r"\Ensure", r"\item \textbf{Output:}")
    text = text.replace(r"\State", r"\item")
    text = text.replace(r"\Return", r"\textbf{Return}")
    text = re.sub(r"\\For\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}", r"\\item \\textbf{For \\(\1\\):} \\begin{enumerate}", text)
    text = text.replace(r"\EndFor", r"\end{enumerate}")
    # The loop content already contains math delimiters.
    text = text.replace(r"\textbf{For \(", r"\textbf{For ").replace(r"\):} \begin{enumerate}", r":} \begin{enumerate}")
    # Assign stable targets and numbers before Pandoc drops LaTeX counters.
    refs = {}
    counts = {"figure": 0, "table": 0, "equation": 0}
    for env in counts:
        def number(match):
            counts[env] += 1
            block = match.group(0)
            for label in re.findall(r"\\label\{([^}]+)\}", block):
                refs[label] = ("S" if supplementary and env != "equation" else "") + str(counts[env])
                if env == "equation":
                    block = block.replace("\\label{" + label + "}", "")
                    block = "\\hypertarget{" + label + "}{}\n" + block
            return block
        text = re.sub(r"\\begin\{" + env + r"\}.*?\\end\{" + env + r"\}", number, text, flags=re.S)
    refs["alg:hoist"] = "S1" if supplementary else "1"
    # Resolve numbered section references without relying on raw LaTeX labels.
    counters = [0, 0, 0]
    for match in re.finditer(r"\\(section|subsection|subsubsection)(\*)?\{[^}]+\}\s*(?:\\label\{([^}]+)\})?", text):
        level = ["section", "subsection", "subsubsection"].index(match.group(1))
        if not match.group(2):
            counters[level] += 1
            for i in range(level + 1, 3):
                counters[i] = 0
        if match.group(3):
            refs[match.group(3)] = ".".join(map(str, counters[:level + 1]))
    text = re.sub(r"\\(?:eqref|ref)\{([^}]+)\}", lambda m: "\\hyperlink{" + m.group(1) + "}{" + refs.get(m.group(1), m.group(1)) + "}", text)
    text = text.replace(r"Algorithm~\thealgorithm", "Algorithm " + ("S1" if supplementary else "1"))
    return text, refs, counts


def main():
    pandoc = os.environ.get("PANDOC") or shutil.which("pandoc")
    if not pandoc:
        import pypandoc
        pandoc = pypandoc.get_pandoc_path()
    OUT.mkdir(exist_ok=True)
    report = {}
    for name in ["main", "supplementary"]:
        text, refs, counts = prepare((SOURCE / (name + ".tex")).read_text(), name == "supplementary")
        temp = Path("/tmp") / ("hoist-accessible-" + name + ".tex")
        temp.write_text(text)
        subprocess.run([pandoc, str(temp), "--from=latex", "--to=html5", "--mathml", "--citeproc", "--bibliography=" + str(SOURCE / "references.bib"), "--shift-heading-level-by=1", "--metadata=link-citations:true", "-o", str(OUT / (name + ".html"))], check=True)
        report[name] = {"references": refs, "counts": counts}
    (OUT / "conversion-manifest.json").write_text(json.dumps(report, indent=2))
    print(json.dumps({k: v["counts"] for k, v in report.items()}, indent=2))


if __name__ == "__main__":
    main()
