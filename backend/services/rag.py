from __future__ import annotations
import os, glob, re
from typing import List, Tuple, Dict
from dataclasses import dataclass
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

KB_DIR = os.getenv("KB_DIR", "knowledge_base")

def _read_text_file(path: str) -> str:
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        return f.read()

def _clean_text(s: str) -> str:
    s = s.replace("\u00a0", " ")
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r"\n{3,}", "\n\n", s)
    return s.strip()

def _chunk(text: str, max_chars: int = 1200, overlap: int = 200) -> List[str]:
    # cắt theo đoạn cho giữ ngữ nghĩa
    paras = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]
    chunks, buf = [], ""
    for p in paras:
        if len(buf) + len(p) + 2 <= max_chars:
            buf = (buf + "\n\n" + p).strip()
        else:
            if buf: chunks.append(buf)
            buf = p
    if buf: chunks.append(buf)

    # nếu đoạn vẫn quá dài → slide cửa sổ
    out = []
    for c in chunks:
        if len(c) <= max_chars:
            out.append(c)
        else:
            i = 0
            while i < len(c):
                out.append(c[i:i+max_chars])
                i += max(1, max_chars - overlap)
    return out

@dataclass
class KBChunk:
    doc_id: str
    text: str

class Retriever:
    def __init__(self, kb_dir: str = KB_DIR):
        paths = sorted(glob.glob(os.path.join(kb_dir, "**/*.*"), recursive=True))
        docs: List[KBChunk] = []
        for p in paths:
            if p.lower().endswith((".md", ".txt")):
                raw = _read_text_file(p)
                for i, ch in enumerate(_chunk(_clean_text(raw))):
                    docs.append(KBChunk(doc_id=f"{os.path.basename(p)}#{i}", text=ch))
        self.docs = docs
        self.vectorizer = TfidfVectorizer(
            strip_accents="unicode",
            ngram_range=(1,2),
            min_df=1,
            max_df=0.95
        )
        self.matrix = self.vectorizer.fit_transform([d.text for d in docs]) if docs else None

    def search(self, query: str, top_k: int = 5) -> List[Tuple[KBChunk, float]]:
        if not self.docs or self.matrix is None:
            return []
        qv = self.vectorizer.transform([query])
        sims = cosine_similarity(qv, self.matrix)[0]
        idx = sims.argsort()[::-1][:top_k]
        results = [(self.docs[i], float(sims[i])) for i in idx]
        return results

def build_context(query: str, retriever: Retriever, k: int = 5, threshold: float = 0.18) -> Dict:
    hits = retriever.search(query, top_k=k)
    strong = [h for h in hits if h[1] >= threshold]
    return {
        "snippets": [h[0].text for h in strong],
        "scores": [h[1] for h in strong],
        "sources": [h[0].doc_id for h in strong]
    }
