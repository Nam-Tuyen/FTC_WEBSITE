"""
Chatbot chính cho Câu lạc bộ Công nghệ - Tài chính
"""
import logging
from typing import List, Dict, Optional
from services.gemini_service import GeminiService
from services.club_knowledge import ClubKnowledgeService
from services.question_classifier import QuestionClassifier
from data.club_data import CLUB_INFO

logger = logging.getLogger(__name__)

class FTCChatBot:
    """Chatbot chính của Câu lạc bộ Công nghệ - Tài chính"""
    
    def __init__(self):
        self.gemini_service = GeminiService()
        self.club_knowledge = ClubKnowledgeService()
        self.classifier = QuestionClassifier()
        self.conversation_history: List[Dict[str, str]] = []
        
        logger.info("FTC ChatBot đã được khởi tạo")
    
    def get_welcome_message(self) -> str:
        """Tin nhắn chào mừng"""
        return f"""Xin chào! Tôi là **FTC AI Assistant**.

Tôi có thể giúp bạn:
• Trả lời câu hỏi về câu lạc bộ
• Giải thích khái niệm Fintech
• Hướng dẫn tham gia hoạt động
• Tìm thông tin trên website

📮 Liên hệ: {CLUB_INFO['email']}
📘 Fanpage: {CLUB_INFO['fanpage']}"""
    
    def process_question(self, question: str) -> str:
        """
        Xử lý câu hỏi từ người dùng
        
        Args:
            question: Câu hỏi của người dùng
            
        Returns:
            Câu trả lời
        """
        if not question or not question.strip():
            return "Vui lòng nhập câu hỏi của bạn."
        
        question = question.strip()
        
        # Lưu câu hỏi vào lịch sử
        self.conversation_history.append({
            "role": "user",
            "content": question
        })
        
        try:
            # Xử lý lời chào và cảm ơn
            if self.classifier.is_greeting(question):
                response = "Xin chào! Tôi là trợ lý AI của FTC. Tôi có thể giúp bạn tìm hiểu về câu lạc bộ và các kiến thức Fintech. Bạn muốn hỏi gì?"
            elif self.classifier.is_thanks(question):
                response = "Rất vui được giúp đỡ bạn! Nếu có thêm câu hỏi nào khác, đừng ngần ngại hỏi nhé. Chúc bạn một ngày tốt lành! 😊"
            else:
                # Phân loại câu hỏi
                category, confidence, domain = self.classifier.classify_question(question)
                
                logger.info(f"Phân loại: {category}, Confidence: {confidence:.2f}, Domain: {domain}")
                
                if category == "club":
                    # Câu hỏi về câu lạc bộ
                    response = self._handle_club_question(question)
                else:
                    # Câu hỏi chung về fintech/công nghệ
                    response = self._handle_general_question(question, domain)
            
            # Lưu phản hồi vào lịch sử
            self.conversation_history.append({
                "role": "model", 
                "content": response
            })
            
            # Giới hạn lịch sử hội thoại
            if len(self.conversation_history) > 20:
                self.conversation_history = self.conversation_history[-20:]
            
            return response
            
        except Exception as e:
            logger.error(f"Lỗi khi xử lý câu hỏi: {str(e)}")
            return "Xin lỗi, có lỗi xảy ra khi xử lý câu hỏi. Vui lòng thử lại sau."
    
    def _handle_club_question(self, question: str) -> str:
        """Xử lý câu hỏi về câu lạc bộ"""
        # Tìm trong FAQ trước
        faq_answer = self.club_knowledge.find_best_faq_match(question)
        if faq_answer:
            return faq_answer
        
        # Nếu không tìm thấy trong FAQ, tạo phản hồi từ thông tin chung
        return self.club_knowledge.get_club_info_response(question)
    
    def _handle_general_question(self, question: str, domain: str) -> str:
        """Xử lý câu hỏi chung về fintech/công nghệ"""
        if not self.gemini_service.is_available():
            return self.club_knowledge.get_fallback_response(question)
        
        # Xây dựng prompt cho Gemini
        prompt = self.gemini_service.build_prompt(question, domain)
        
        # Gọi Gemini API với lịch sử hội thoại
        response = self.gemini_service.generate_response(prompt, self.conversation_history)
        
        return response
    
    def clear_history(self):
        """Xóa lịch sử hội thoại"""
        self.conversation_history.clear()
        logger.info("Đã xóa lịch sử hội thoại")
    
    def get_conversation_history(self) -> List[Dict[str, str]]:
        """Lấy lịch sử hội thoại"""
        return self.conversation_history.copy()
    
    def get_stats(self) -> Dict[str, int]:
        """Lấy thống kê sử dụng"""
        return {
            "total_messages": len(self.conversation_history),
            "user_messages": len([msg for msg in self.conversation_history if msg["role"] == "user"]),
            "bot_messages": len([msg for msg in self.conversation_history if msg["role"] == "model"]),
            "gemini_available": 1 if self.gemini_service.is_available() else 0
        }