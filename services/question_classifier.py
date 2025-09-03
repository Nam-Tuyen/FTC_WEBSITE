"""
Service phân loại câu hỏi
"""
import logging
from typing import Tuple, Optional
from utils.text_processor import TextProcessor
from data.club_data import CLUB_KEYWORDS, FINTECH_KEYWORDS
from config import Config

logger = logging.getLogger(__name__)

class QuestionClassifier:
    """Phân loại câu hỏi của người dùng"""
    
    def __init__(self):
        self.text_processor = TextProcessor()
        self.confidence_threshold = Config.CONFIDENCE_THRESHOLD
    
    def classify_question(self, question: str) -> Tuple[str, float, Optional[str]]:
        """
        Phân loại câu hỏi
        
        Args:
            question: Câu hỏi của người dùng
            
        Returns:
            Tuple[category, confidence, domain]
            - category: 'club' hoặc 'general'
            - confidence: Độ tin cậy (0-1)
            - domain: Lĩnh vực cụ thể (nếu có)
        """
        
        # Kiểm tra câu hỏi về câu lạc bộ
        is_club, club_score = self.text_processor.contains_keywords(question, CLUB_KEYWORDS)
        
        # Kiểm tra câu hỏi về fintech/công nghệ
        is_fintech, fintech_score = self.text_processor.contains_keywords(question, FINTECH_KEYWORDS)
        
        # Xác định domain cụ thể
        domain = self._determine_domain(question)
        
        # Quyết định category
        if is_club and club_score >= 0.2:
            return "club", club_score, domain
        elif is_fintech and fintech_score >= 0.1:
            return "general", fintech_score, domain
        else:
            # Câu hỏi chung, không rõ ràng
            return "general", 0.5, domain
    
    def _determine_domain(self, question: str) -> str:
        """Xác định lĩnh vực cụ thể của câu hỏi"""
        normalized = self.text_processor.normalize_vietnamese(question)
        
        # Blockchain/Web3
        if any(kw in normalized for kw in ['blockchain', 'defi', 'smart contract', 'crypto', 'web3', 'nft']):
            return 'blockchain'
        
        # Banking
        elif any(kw in normalized for kw in ['ngan hang', 'bank', 'banking', 'core banking']):
            return 'banking'
        
        # Payments
        elif any(kw in normalized for kw in ['thanh toan', 'payments', 'qr', 'swift']):
            return 'payments'
        
        # Investment/Economics
        elif any(kw in normalized for kw in ['dau tu', 'investment', 'portfolio', 'chung khoan', 'forex']):
            return 'economics'
        
        # AI/ML
        elif any(kw in normalized for kw in ['ai', 'machine learning', 'ml', 'data analysis']):
            return 'ai'
        
        # General fintech
        else:
            return 'fintech'
    
    def is_greeting(self, text: str) -> bool:
        """Kiểm tra có phải lời chào không"""
        normalized = self.text_processor.normalize_vietnamese(text)
        greetings = ['xin chao', 'chao', 'hello', 'hi', 'hey']
        return any(greeting in normalized for greeting in greetings)
    
    def is_thanks(self, text: str) -> bool:
        """Kiểm tra có phải lời cảm ơn không"""
        normalized = self.text_processor.normalize_vietnamese(text)
        thanks = ['cam on', 'thank', 'thanks', 'merci', 'cam on ban']
        return any(thank in normalized for thank in thanks)