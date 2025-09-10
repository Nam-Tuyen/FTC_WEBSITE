import { KBFile, loadKnowledgeBase } from "@/lib/knowledge";

export type Chunk = { source: string; text: string };

function chunkContent(text: string, source: string, size = 800): Chunk[] {
  const parts: Chunk[] = [];
  let i = 0;
  while (i < text.length) {
    parts.push({ source, text: text.slice(i, i + size) });
    i += size;
  }
  return parts;
}

export function buildKBChunks(): Chunk[] {
  const files: KBFile[] = loadKnowledgeBase();
  const chunks: Chunk[] = [];
  for (const f of files) {
    const clean = f.content.replace(/```[\s\S]*?```/g, "");
    chunks.push(...chunkContent(clean, f.filename));
  }
  return chunks;
}

function score(query: string, text: string) {
  const q = query.toLowerCase().split(/\W+/).filter(Boolean);
  const t = text.toLowerCase();
  let s = 0;
  for (const token of q) {
    if (t.includes(token)) s += 1;
  }
  return s;
}

export function retrieveTopN(query: string, N = 6): Chunk[] {
  const chunks = buildKBChunks();
  const scored = chunks.map((c) => ({ c, s: score(query, c.text) }));
  scored.sort((a, b) => b.s - a.s);
  const top = scored.filter((x) => x.s > 0).slice(0, N).map((x) => x.c);
  return top;
}
