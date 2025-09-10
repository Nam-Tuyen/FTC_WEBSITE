import fs from "node:fs";
import path from "node:path";

export type KBFile = { filename: string; content: string };

const KB_DIR = path.join(process.cwd(), "knowledge_base");

export function loadKnowledgeBase(): KBFile[] {
  if (!fs.existsSync(KB_DIR)) return [];
  const entries = fs.readdirSync(KB_DIR);
  const files: KBFile[] = [];
  for (const name of entries) {
    const fp = path.join(KB_DIR, name);
    try {
      const stat = fs.statSync(fp);
      if (stat.isFile() && /\.(md|txt|json)$/i.test(name)) {
        const raw = fs.readFileSync(fp, "utf8");
        files.push({ filename: name, content: raw });
      }
    } catch {
      // ignore file read errors
    }
  }
  return files;
}
