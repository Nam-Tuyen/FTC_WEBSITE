import fs from "node:fs";
import path from "node:path";

export type KBFile = { filename: string; content: string };

// Support both a root-level knowledge_base folder and the existing Python KB under backend/data/knowledge_base
const ROOT_KB_DIR = path.join(process.cwd(), "knowledge_base");
const PY_KB_DIR = path.join(process.cwd(), "backend", "data", "knowledge_base");

function extractFromPy(source: string): string {
  // Extract triple-quoted docstrings/paragraphs; fallback to long lines
  const blocks: string[] = [];
  const triple = /"""([\s\S]*?)"""/g;
  let m: RegExpExecArray | null;
  while ((m = triple.exec(source)) !== null) {
    const block = m[1].replace(/\s+/g, " ").trim();
    if (block.length > 30) blocks.push(block);
  }
  if (blocks.length) return blocks.join("\n\n");
  const lines = source
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 40)
    .slice(0, 50) // cap
    .join("\n");
  return lines;
}

export function loadKnowledgeBase(): KBFile[] {
  const dirs = [ROOT_KB_DIR, PY_KB_DIR].filter((p) => fs.existsSync(p));
  const files: KBFile[] = [];

  for (const dir of dirs) {
    let entries: string[] = [];
    try {
      entries = fs.readdirSync(dir);
    } catch {
      continue;
    }

    for (const name of entries) {
      const fp = path.join(dir, name);
      try {
        const stat = fs.statSync(fp);
        if (!stat.isFile()) continue;

        if (/\.(md|txt|json)$/i.test(name)) {
          const raw = fs.readFileSync(fp, "utf8");
          files.push({ filename: path.relative(process.cwd(), fp), content: raw });
        } else if (/\.py$/i.test(name)) {
          const raw = fs.readFileSync(fp, "utf8");
          const extracted = extractFromPy(raw);
          if (extracted) {
            files.push({ filename: path.relative(process.cwd(), fp), content: extracted });
          }
        }
      } catch {
        // ignore file read errors
      }
    }
  }
  return files;
}
