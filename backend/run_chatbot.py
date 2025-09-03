"""
Script chạy chatbot từ command line
"""
import sys
import logging
from chatbot import FTCChatBot
from config import Config

def setup_logging():
    """Thiết lập logging"""
    logging.basicConfig(
        level=getattr(logging, Config.LOG_LEVEL),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )

def main():
    """Hàm chính"""
    setup_logging()
    logger = logging.getLogger(__name__)
    
    print("🤖 FTC Chatbot - Command Line Interface")
    print("=" * 50)
    
    try:
        # Kiểm tra cấu hình
        Config.validate()
        
        # Khởi tạo chatbot
        chatbot = FTCChatBot()
        logger.info("Chatbot đã được khởi tạo thành công")
        
        # Hiển thị thông tin hệ thống
        stats = chatbot.get_stats()
        print(f"Gemini API: {'✅ Khả dụng' if stats['gemini_available'] else '❌ Không khả dụng'}")
        print()
        
        # Tin nhắn chào mừng
        print("Bot:", chatbot.get_welcome_message())
        print("\nNhập 'quit', 'exit' hoặc 'thoát' để kết thúc")
        print("=" * 50)
        
        # Vòng lặp chat
        while True:
            try:
                user_input = input("\n🧑 Bạn: ").strip()
                
                if user_input.lower() in ['quit', 'exit', 'thoát', 'q']:
                    break
                
                if not user_input:
                    print("⚠️  Vui lòng nhập câu hỏi.")
                    continue
                
                if user_input.lower() in ['clear', 'xóa lịch sử']:
                    chatbot.clear_history()
                    print("✅ Đã xóa lịch sử hội thoại.")
                    continue
                
                if user_input.lower() in ['stats', 'thống kê']:
                    stats = chatbot.get_stats()
                    print(f"📊 Thống kê:")
                    print(f"   - Tổng tin nhắn: {stats['total_messages']}")
                    print(f"   - Tin nhắn người dùng: {stats['user_messages']}")
                    print(f"   - Tin nhắn bot: {stats['bot_messages']}")
                    print(f"   - Gemini API: {'Khả dụng' if stats['gemini_available'] else 'Không khả dụng'}")
                    continue
                
                # Xử lý câu hỏi
                print("🤖 Bot: ", end="", flush=True)
                response = chatbot.process_question(user_input)
                print(response)
                
            except KeyboardInterrupt:
                break
            except Exception as e:
                logger.error(f"Lỗi trong vòng lặp chat: {e}")
                print(f"❌ Lỗi: {e}")
    
    except Exception as e:
        logger.error(f"Lỗi khởi tạo: {e}")
        print(f"❌ Lỗi khởi tạo chatbot: {e}")
        return 1
    
    print("\n👋 Cảm ơn bạn đã sử dụng FTC Chatbot!")
    return 0

if __name__ == "__main__":
    sys.exit(main())