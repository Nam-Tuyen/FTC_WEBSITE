from __future__ import annotations
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from services.rag import Retriever, build_context
from services.gemini_client import ask_gemini

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Khởi tạo retriever 1 lần khi app start
retriever = Retriever(kb_dir=os.getenv("KB_DIR", "knowledge_base"))

@app.get("/api/health")
def health():
    return jsonify({"ok": True, "kb_chunks": len(retriever.docs)})

@app.post("/api/chat")
def chat():
    data = request.get_json(force=True, silent=True) or {}
    user_query: str = (data.get("message") or "").strip()
    if not user_query:
        return jsonify({"error": "message is required"}), 400

    # 1) Rút ngữ cảnh từ KB
    ctx = build_context(user_query, retriever, k=5, threshold=0.18)
    snippets: list[str] = ctx["snippets"]

    # 2) Gọi Gemini: luôn TỰ SOẠN câu trả lời (advisor), ưu tiên dữ kiện KB
    answer = ask_gemini(user_query, snippets)

    # 3) Trả về kèm meta để debug (optional)
    return jsonify({
        "answer": answer,
        "meta": {
            "kb_used": len(snippets) > 0,
            "kb_sources": ctx["sources"],
            "kb_scores": [round(s, 3) for s in ctx["scores"]]
        }
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "8000")))
