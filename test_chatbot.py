"""
Test script cho FTC Chatbot
"""
import pytest
import logging
from chatbot import FTCChatBot
from services.question_classifier import QuestionClassifier
from utils.text_processor import TextProcessor

# Thiết lập logging cho test
logging.basicConfig(level=logging.INFO)

class TestFTCChatBot:
    """Test cases cho FTC Chatbot"""
    
    def setup_method(self):
        """Thiết lập trước mỗi test"""
        self.chatbot = FTCChatBot()
        self.classifier = QuestionClassifier()
        self.text_processor = TextProcessor()
    
    def test_welcome_message(self):
        """Test tin nhắn chào mừng"""
        welcome = self.chatbot.get_welcome_message()
        assert "FTC AI Assistant" in welcome
        assert "clbcongnghetaichinh@st.uel.edu.vn" in welcome
    
    def test_greeting_detection(self):
        """Test nhận diện lời chào"""
        greetings = ["xin chào", "hello", "hi", "chào bạn"]
        for greeting in greetings:
            assert self.classifier.is_greeting(greeting)
    
    def test_thanks_detection(self):
        """Test nhận diện lời cảm ơn"""
        thanks = ["cảm ơn", "thank you", "thanks", "cảm ơn bạn"]
        for thank in thanks:
            assert self.classifier.is_thanks(thank)
    
    def test_club_question_classification(self):
        """Test phân loại câu hỏi về câu lạc bộ"""
        club_questions = [
            "CLB có những hoạt động gì?",
            "Làm sao để tham gia FTC?",
            "Các ban trong câu lạc bộ làm gì?",
            "Lịch sinh hoạt như thế nào?"
        ]
        
        for question in club_questions:
            category, confidence, domain = self.classifier.classify_question(question)
            assert category == "club"
            assert confidence > 0.2
    
    def test_fintech_question_classification(self):
        """Test phân loại câu hỏi về fintech"""
        fintech_questions = [
            "Blockchain là gì?",
            "DeFi hoạt động như thế nào?",
            "Smart contract có an toàn không?",
            "Bitcoin khác Ethereum ở điểm nào?"
        ]
        
        for question in fintech_questions:
            category, confidence, domain = self.classifier.classify_question(question)
            # Có thể là 'general' hoặc 'club' tùy thuộc vào từ khóa
            assert category in ["general", "club"]
    
    def test_text_normalization(self):
        """Test chuẩn hóa văn bản"""
        test_cases = [
            ("Xin chào! Tôi muốn hỏi về CLB.", "xin chao toi muon hoi ve clb"),
            ("Blockchain là gì???", "blockchain la gi"),
            ("FTC có những hoạt động gì không?", "ftc co nhung hoat dong gi khong")
        ]
        
        for input_text, expected in test_cases:
            result = self.text_processor.normalize_vietnamese(input_text)
            assert result == expected
    
    def test_chatbot_responses(self):
        """Test phản hồi của chatbot"""
        test_questions = [
            "Xin chào",
            "CLB có những hoạt động gì?",
            "Làm sao để tham gia?",
            "Cảm ơn bạn"
        ]
        
        for question in test_questions:
            response = self.chatbot.process_question(question)
            assert isinstance(response, str)
            assert len(response) > 0
            assert "lỗi" not in response.lower() or "xin lỗi" in response.lower()

def run_interactive_test():
    """Chạy test tương tác"""
    print("🤖 FTC Chatbot - Interactive Test")
    print("Nhập 'quit' để thoát\n")
    
    chatbot = FTCChatBot()
    print("Bot:", chatbot.get_welcome_message())
    print()
    
    while True:
        try:
            user_input = input("Bạn: ").strip()
            if user_input.lower() in ['quit', 'exit', 'thoát']:
                break
            
            if not user_input:
                continue
            
            response = chatbot.process_question(user_input)
            print(f"Bot: {response}")
            print()
            
        except KeyboardInterrupt:
            break
        except Exception as e:
            print(f"Lỗi: {e}")
    
    print("\n👋 Cảm ơn bạn đã test chatbot!")

if __name__ == "__main__":
    # Chạy test tương tác
    run_interactive_test()