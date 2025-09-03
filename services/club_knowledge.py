"""
Service xử lý kiến thức về câu lạc bộ
"""
import logging
from typing import Optional, List, Dict
from utils.text_processor import TextProcessor
from data.club_data import CLUB_FAQ, CLUB_KEYWORDS, CLUB_INFO, DEPARTMENTS, ACTIVITIES

logger = logging.getLogger(__name__)

class ClubKnowledgeService:
    """Service quản lý kiến thức về câu lạc bộ"""
    
    def __init__(self):
        self.text_processor = TextProcessor()
        self.faq_data = CLUB_FAQ
        self.club_keywords = CLUB_KEYWORDS
        
    def is_club_related(self, question: str) -> bool:
        """Kiểm tra câu hỏi có liên quan đến câu lạc bộ không"""
        has_keywords, score = self.text_processor.contains_keywords(question, self.club_keywords)
        return has_keywords and score > 0.1
    
    def find_best_faq_match(self, question: str) -> Optional[str]:
        """
        Tìm câu trả lời phù hợp nhất từ FAQ
        
        Args:
            question: Câu hỏi của người dùng
            
        Returns:
            Câu trả lời hoặc None nếu không tìm thấy
        """
        best_score = 0.0
        best_answer = None
        
        for faq_item in self.faq_data:
            # Tính điểm tương đồng với từng keyword
            for keyword in faq_item["keywords"]:
                similarity = self.text_processor.calculate_similarity(question, keyword)
                if similarity > best_score:
                    best_score = similarity
                    best_answer = faq_item["answer"]
        
        # Chỉ trả về nếu độ tương đồng đủ cao
        if best_score >= 0.3:
            return best_answer
        
        return None
    
    def get_club_info_response(self, question: str) -> str:
        """Tạo phản hồi dựa trên thông tin câu lạc bộ"""
        normalized_q = self.text_processor.normalize_vietnamese(question)
        
        # Kiểm tra câu hỏi về các ban
        if any(word in normalized_q for word in ['ban', 'phong ban', 'co cau']):
            response = "🏷️ **Cơ cấu các ban trong FTC:**\n\n"
            for dept_key, dept_info in DEPARTMENTS.items():
                response += f"• **{dept_info['name']}**: {dept_info['description']}\n"
            return response
        
        # Kiểm tra câu hỏi về hoạt động
        if any(word in normalized_q for word in ['hoat dong', 'su kien', 'chuong trinh']):
            response = "🎯 **Hoạt động tiêu biểu của FTC:**\n\n"
            for activity in ACTIVITIES:
                response += f"• **{activity['name']}**: {activity['description']} ({activity['frequency']})\n"
            return response
        
        # Thông tin liên hệ
        if any(word in normalized_q for word in ['lien he', 'email', 'fanpage']):
            return f"""📮 **Thông tin liên hệ:**
• Email: {CLUB_INFO['email']}
• Fanpage: {CLUB_INFO['fanpage']}
• Cố vấn: {CLUB_INFO['advisor']}"""
        
        # Thông tin chung về CLB
        return f"""👋 **Về Câu lạc bộ Công nghệ – Tài chính (FTC):**

{CLUB_INFO['name']} là cộng đồng sinh viên {CLUB_INFO['university']} yêu thích công nghệ tài chính.

📅 Thành lập: {CLUB_INFO['established']}
🏫 Trực thuộc: {CLUB_INFO['faculty']}
👨‍🏫 Cố vấn: {CLUB_INFO['advisor']}

Chúng tôi tổ chức hội thảo, thực hành, dự án thực tế để bạn **học sâu – làm thật – kết nối rộng**.

📮 Liên hệ: {CLUB_INFO['email']}"""
    
    def get_fallback_response(self, question: str) -> str:
        """Phản hồi dự phòng khi không tìm thấy thông tin"""
        return f"""Mình đã nhận câu hỏi: "{question}". Hiện chưa có thông tin chi tiết trong FAQ.

Bạn có thể:
• Gửi mail: {CLUB_INFO['email']}
• Nhắn fanpage: {CLUB_INFO['fanpage']}
• Thử đặt câu hỏi khác về thành viên, lịch sinh hoạt, học thuật, sự kiện, truyền thông, tài chính cá nhân, nhân sự…"""