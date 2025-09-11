import os, google.generativeai as genai

def get_gemini():
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise RuntimeError("Missing GEMINI_API_KEY/GOOGLE_API_KEY environment variable")
    genai.configure(api_key=api_key)
    return genai.GenerativeModel("gemini-1.5-pro")

SYSTEM_ROLE = (
    "Bạn là cố vấn tận tâm cho TÂN SINH VIÊN của Câu lạc bộ FinTech (FTC). "
    "Luôn trả lời bằng tiếng Việt, giọng thân thiện, chủ động, ngắn gọn dễ hiểu, "
    "đưa ra gợi ý cụ thể (bước tiếp theo, người liên hệ, link nội bộ nếu có). "
    "Luôn tự soạn câu trả lời bằng lời văn của bạn; KHÔNG chép nguyên văn từ tư liệu."
)

def compose_prompt(user_query: str, kb_snippets: list[str]) -> str:
    kb_block = ""
    if kb_snippets:
        kb_block = (
            "### Tri thức nội bộ (knowledge_base)\n"
            "- Đây là TƯ LIỆU THAM KHẢO, chỉ để nắm bối cảnh và dữ kiện.\n"
            "- Bạn PHẢI tự diễn đạt bằng lời của mình, không được trích dẫn nguyên văn dài dòng.\n\n"
            + "\n\n---\n\n".join(kb_snippets[:6])
            + "\n\n---\n"
        )
    return f"""[HỆ THỐNG]
{SYSTEM_ROLE}

{kb_block}

[CHỈ DẪN]
1) Ưu tiên sử dụng dữ kiện đúng từ Tri thức nội bộ nếu phù hợp.
2) Nếu câu hỏi KHÔNG có trong nội bộ, vẫn phải trả lời dựa trên hiểu biết chung.
3) Câu trả lời phải có:
   - Giải thích ngắn gọn, đúng trọng tâm
   - Mục 'Bước tiếp theo đề xuất'
   - (Tuỳ chọn) 'Lưu ý/Khuyến nghị' nếu có rủi ro cần cảnh báo
4) Không tự bịa thông tin nội bộ. Nếu thiếu dữ liệu, nói rõ 'Theo hiểu biết chung' rồi trả lời.

[NGƯỜI DÙNG]
{user_query}

[ĐẦU RA MẪU - CHỈ THAM KHẢO CẤU TRÚC]
Trả lời: ...
Bước tiếp theo đề xuất: • ... • ...
Lưu ý/Khuyến nghị: ...
"""

def ask_gemini(user_query: str, kb_snippets: list[str]) -> str:
    model = get_gemini()
    prompt = compose_prompt(user_query, kb_snippets)
    resp = model.generate_content(prompt)
    return resp.text or "Xin lỗi, mình chưa thể trả lời lúc này."
