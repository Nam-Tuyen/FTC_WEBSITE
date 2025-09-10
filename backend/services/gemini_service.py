"""
Service để tương tác với Gemini API
"""
import google.generativeai as genai
import logging
from typing import List, Dict, Optional
import os
from pathlib import Path
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
            
        # Load knowledge base
        self.knowledge_base = self._load_knowledge_base()
        
    def _load_knowledge_base(self) -> str:
        """Load toàn bộ dữ liệu từ knowledge base"""
        kb_dir = Path(__file__).parent.parent / "data" / "knowledge_base"
        content = []
        
        if kb_dir.exists():
            for file in kb_dir.glob("*.txt"):
                try:
                    with open(file, "r", encoding="utf-8") as f:
                        content.append(f.read())
                except Exception as e:
                    logger.error(f"Lỗi khi đọc file {file}: {e}")
                    
        return "\n\n".join(content)
    
    def is_available(self) -> bool:
        """Kiểm tra Gemini API có khả dụng không"""
        return self.model is not None
    
    def build_prompt(self, user_question: str) -> str:
        """Xây dựng prompt cho Gemini với context từ knowledge base"""
        base_prompt = f"""Bạn là trợ lý AI cho Câu lạc bộ Công nghệ – Tài chính (FTC) – UEL.
Vai trò của bạn là cố vấn cho tân sinh viên và trả lời các câu hỏi về CLB.

Thông tin tham khảo từ knowledge base:
{self.knowledge_base}

Dựa vào thông tin trên, hãy trả lời câu hỏi sau một cách súc tích bằng tiếng Việt.
Nếu không có thông tin liên quan trong knowledge base, hãy trả lời dựa trên kiến thức chung về fintech và câu lạc bộ sinh viên.
Trả lời cần phải:
- Ngắn gọn, dễ hiểu
- Có cấu trúc rõ ràng (sử dụng gạch đầu dòng nếu cần)
- Thân thiện, phù hợp với tân sinh viên
- Tập trung vào thông tin thực tế và hữu ích

Câu hỏi: {user_question}

Trả lời:"""
        return base_prompt
    
    def generate_response(
        self, 
        user_question: str,
        history: Optional[List[Dict[str, str]]] = None
    ) -> str:
        """Generate câu trả lời sử dụng Gemini API"""
        if not self.is_available():
            return "Xin lỗi, hiện tại tôi không thể trả lời do chưa kết nối được với Gemini API."
            
        try:
            prompt = self.build_prompt(user_question)
            
            # Generate response
            response = self.model.generate_content(
                prompt,
                generation_config={
                    "temperature": self.temperature,
                    "max_output_tokens": self.max_tokens,
                }
            )
            
            # Clean and return response
            return response.text.strip()
            
        except Exception as e:
            logger.error(f"Lỗi khi tạo câu trả lời: {e}")
            return "Xin lỗi, đã có lỗi xảy ra khi xử lý câu hỏi của bạn. Vui lòng thử lại sau."
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