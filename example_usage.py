"""
Ví dụ sử dụng FTC Chatbot
"""
import logging
from chatbot import FTCChatBot

# Thiết lập logging
logging.basicConfig(level=logging.INFO)

def demo_basic_usage():
    """Demo sử dụng cơ bản"""
    print("🤖 Demo FTC Chatbot - Sử dụng cơ bản")
    print("=" * 50)
    
    # Khởi tạo chatbot
    chatbot = FTCChatBot()
    
    # Danh sách câu hỏi demo
    demo_questions = [
        "Xin chào",
        "CLB có những hoạt động gì?",
        "Làm sao để tham gia FTC?",
        "Blockchain là gì?",
        "Chi phí tham gia là bao nhiêu?",
        "DeFi hoạt động như thế nào?",
        "Các ban trong câu lạc bộ làm gì?",
        "Cảm ơn bạn"
    ]
    
    for i, question in enumerate(demo_questions, 1):
        print(f"\n{i}. Người dùng: {question}")
        response = chatbot.process_question(question)
        print(f"   Bot: {response[:100]}{'...' if len(response) > 100 else ''}")
    
    # Hiển thị thống kê
    print("\n" + "=" * 50)
    stats = chatbot.get_stats()
    print("📊 Thống kê:")
    for key, value in stats.items():
        print(f"   - {key}: {value}")

def demo_classification():
    """Demo phân loại câu hỏi"""
    print("\n🔍 Demo phân loại câu hỏi")
    print("=" * 50)
    
    from services.question_classifier import QuestionClassifier
    classifier = QuestionClassifier()
    
    test_questions = [
        "CLB có những hoạt động gì?",
        "Blockchain là gì?", 
        "Làm sao để ứng tuyển?",
        "Smart contract hoạt động ra sao?",
        "Lịch sinh hoạt như thế nào?",
        "DeFi có rủi ro gì không?",
        "Hôm nay trời đẹp quá"
    ]
    
    for question in test_questions:
        category, confidence, domain = classifier.classify_question(question)
        print(f"❓ '{question}'")
        print(f"   → Category: {category}, Confidence: {confidence:.2f}, Domain: {domain}")

def demo_text_processing():
    """Demo xử lý văn bản"""
    print("\n📝 Demo xử lý văn bản")
    print("=" * 50)
    
    from utils.text_processor import TextProcessor
    processor = TextProcessor()
    
    test_texts = [
        "Xin chào! Tôi muốn hỏi về CLB.",
        "Blockchain là gì??? Nó có an toàn không?",
        "FTC có những hoạt động gì không ạ?",
        "Làm sao để tham gia câu lạc bộ công nghệ tài chính?"
    ]
    
    for text in test_texts:
        normalized = processor.normalize_vietnamese(text)
        keywords = processor.extract_keywords(text)
        print(f"📄 Gốc: '{text}'")
        print(f"   → Chuẩn hóa: '{normalized}'")
        print(f"   → Từ khóa: {keywords}")

if __name__ == "__main__":
    try:
        demo_basic_usage()
        demo_classification()
        demo_text_processing()
        
        print("\n✅ Demo hoàn thành!")
        print("\nĐể chạy chatbot:")
        print("- Web: python app.py")
        print("- CLI: python run_chatbot.py")
        print("- Test: python test_chatbot.py")
        
    except Exception as e:
        print(f"❌ Lỗi: {e}")
        print("\n💡 Kiểm tra:")
        print("- Đã cài đặt dependencies: pip install -r requirements.txt")
        print("- Đã tạo file .env với GEMINI_API_KEY")