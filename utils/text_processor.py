"""
Xử lý văn bản và phân loại câu hỏi
"""
import re
import unicodedata
from typing import List, Tuple
from unidecode import unidecode

class TextProcessor:
    """Lớp xử lý văn bản tiếng Việt"""
    
    def __init__(self):
        self.stop_words = {
            'là', 'của', 'và', 'có', 'được', 'trong', 'với', 'để', 'cho', 
            'về', 'từ', 'khi', 'như', 'sẽ', 'đã', 'này', 'đó', 'những',
            'các', 'một', 'hai', 'ba', 'thì', 'hay', 'hoặc', 'nhưng'
        }
    
    def normalize_vietnamese(self, text: str) -> str:
        """
        Chuẩn hóa văn bản tiếng Việt
        - Chuyển về chữ thường
        - Loại bỏ dấu
        - Loại bỏ ký tự đặc biệt
        """
        if not text:
            return ""
        
        # Chuyển về chữ thường
        text = text.lower()
        
        # Loại bỏ dấu tiếng Việt
        text = unidecode(text)
        
        # Loại bỏ ký tự đặc biệt, chỉ giữ chữ cái, số và khoảng trắng
        text = re.sub(r'[^a-z0-9\s]', ' ', text)
        
        # Loại bỏ khoảng trắng thừa
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def extract_keywords(self, text: str) -> List[str]:
        """Trích xuất từ khóa từ văn bản"""
        normalized = self.normalize_vietnamese(text)
        words = normalized.split()
        
        # Loại bỏ stop words
        keywords = [word for word in words if word not in self.stop_words and len(word) > 2]
        
        return keywords
    
    def calculate_similarity(self, text1: str, text2: str) -> float:
        """Tính độ tương đồng giữa hai văn bản"""
        keywords1 = set(self.extract_keywords(text1))
        keywords2 = set(self.extract_keywords(text2))
        
        if not keywords1 or not keywords2:
            return 0.0
        
        intersection = keywords1.intersection(keywords2)
        union = keywords1.union(keywords2)
        
        return len(intersection) / len(union) if union else 0.0
    
    def contains_keywords(self, text: str, keywords: List[str]) -> Tuple[bool, float]:
        """
        Kiểm tra văn bản có chứa từ khóa không
        Trả về: (có_chứa, điểm_số)
        """
        normalized_text = self.normalize_vietnamese(text)
        normalized_keywords = [self.normalize_vietnamese(kw) for kw in keywords]
        
        matches = 0
        total_keywords = len(normalized_keywords)
        
        for keyword in normalized_keywords:
            if keyword in normalized_text:
                matches += 1
        
        score = matches / total_keywords if total_keywords > 0 else 0.0
        has_keywords = score > 0
        
        return has_keywords, score