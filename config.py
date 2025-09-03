"""
Cấu hình hệ thống chatbot
"""
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Cấu hình chính của ứng dụng"""
    
    # API Keys
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
    
    # Flask Configuration
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    FLASK_DEBUG = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    FLASK_PORT = int(os.getenv('FLASK_PORT', 5000))
    
    # Logging
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    
    # Chatbot Settings
    CONFIDENCE_THRESHOLD = 0.7  # Ngưỡng tin cậy để phân loại câu hỏi
    MAX_RESPONSE_LENGTH = 1000  # Độ dài tối đa của phản hồi
    
    # Gemini Settings
    GEMINI_MODEL = "gemini-1.5-flash"
    GEMINI_TEMPERATURE = 0.4
    GEMINI_MAX_TOKENS = 1024
    
    @classmethod
    def validate(cls):
        """Kiểm tra cấu hình có hợp lệ không"""
        if not cls.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY không được để trống")
        return True