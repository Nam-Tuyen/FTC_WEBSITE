"""
Service để tương tác với Gemini API
"""
import google.generativeai as genai
import logging
from typing import List, Dict, Optional
from config import Config

logger = logging.getLogger(__name__)

class GeminiService:
    """Service xử lý Gemini API"""
    
    def __init__(self):
        self.api_key = Config.GEMINI_API_KEY
        self.model_name = Config.GEMINI_MODEL
        self.temperature = Config.GEMINI_TEMPERATURE
        self.max_tokens = Config.GEMINI_MAX_TOKENS
        
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel(self.model_name)
        else:
            self.model = None
            logger.warning("Gemini API key không được cấu hình")
    
    def is_available(self) -> bool:
        """Kiểm tra Gemini API có khả dụng không"""
        return self.model is not None
    
    def build_prompt(self, user_question: str, domain: str = "fintech") -> str:
        """Xây dựng prompt cho Gemini"""
        return f"""
Bạn là trợ lý AI cho Câu lạc bộ Công nghệ – Tài chính (FTC) – UEL.

Ngữ cảnh: người hỏi là sinh viên/quan tâm Fintech. 
Trả lời súc tích, tiếng Việt, có cấu trúc gọn (gạch đầu dòng khi phù hợp), 
ưu tiên hướng dẫn thực hành.

Nếu câu hỏi mang tính chuyên môn ({domain}), hãy giải thích khái niệm và 
đưa ví dụ gần gũi, tránh phóng đại rủi ro/lợi ích.

Không bịa đặt thông tin nội bộ. Nếu thiếu dữ liệu, nói rõ và đề xuất cách 
tìm hiểu tiếp.

Câu hỏi người dùng: {user_question}
"""
    
    def generate_response(
        self, 
        prompt: str, 
        history: Optional[List[Dict[str, str]]] = None
    ) -> str:
        """
        Tạo phản hồi từ Gemini API
        
        Args:
            prompt: Câu hỏi/prompt
            history: Lịch sử hội thoại (optional)
            
        Returns:
            Phản hồi từ AI
        """
        if not self.is_available():
            return "Xin lỗi, dịch vụ AI hiện không khả dụng. Vui lòng thử lại sau."
        
        try:
            # Xây dựng nội dung cho API
            contents = []
            
            # Thêm lịch sử hội thoại nếu có
            if history:
                for item in history[-8:]:  # Chỉ lấy 8 tin nhắn gần nhất
                    role = "user" if item.get("role") == "user" else "model"
                    content = item.get("content", "")
                    if content:
                        contents.append({
                            "role": role,
                            "parts": [{"text": content}]
                        })
            
            # Thêm câu hỏi hiện tại
            contents.append({
                "role": "user",
                "parts": [{"text": prompt}]
            })
            
            # Cấu hình generation
            generation_config = {
                "temperature": self.temperature,
                "top_k": 32,
                "top_p": 0.95,
                "max_output_tokens": self.max_tokens,
            }
            
            # Cấu hình an toàn
            safety_settings = [
                {
                    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_HATE_SPEECH", 
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_HARASSMENT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "threshold": "BLOCK_LOW_AND_ABOVE"
                }
            ]
            
            # Gọi API
            response = self.model.generate_content(
                contents,
                generation_config=generation_config,
                safety_settings=safety_settings
            )
            
            if response.text:
                return response.text.strip()
            else:
                logger.warning("Gemini trả về phản hồi trống")
                return "Xin lỗi, tôi không thể trả lời câu hỏi này lúc này."
                
        except Exception as e:
            logger.error(f"Lỗi khi gọi Gemini API: {str(e)}")
            return "Xin lỗi, có lỗi xảy ra khi xử lý câu hỏi. Vui lòng thử lại sau."
    
    def classify_domain(self, question: str) -> str:
        """Phân loại domain của câu hỏi"""
        from data.club_data import FINTECH_KEYWORDS
        
        normalized = question.lower()
        
        if any(kw in normalized for kw in ['blockchain', 'defi', 'smart contract', 'crypto', 'web3']):
            return 'blockchain'
        elif any(kw in normalized for kw in ['ngân hàng', 'bank', 'banking']):
            return 'banking'
        elif any(kw in normalized for kw in ['thanh toán', 'payments']):
            return 'payments'
        elif any(kw in normalized for kw in ['đầu tư', 'investment', 'portfolio']):
            return 'economics'
        else:
            return 'fintech'