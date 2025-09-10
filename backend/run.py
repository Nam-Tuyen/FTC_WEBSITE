"""
Script để kiểm tra cài đặt và chạy server
"""
import os
import sys
from pathlib import Path

def check_dependencies():
    """Kiểm tra các dependency cần thiết"""
    try:
        import flask
        import flask_cors
        import google.generativeai
        import colorlog
        print("✅ Tất cả dependencies đã được cài đặt")
        return True
    except ImportError as e:
        print(f"❌ Thiếu dependency: {e}")
        print("🔧 Chạy: pip install -r requirements.txt")
        return False

def check_config():
    """Kiểm tra file cấu hình"""
    try:
        from config import Config
        
        if not Config.GEMINI_API_KEY:
            print("❌ GEMINI_API_KEY chưa được cấu hình trong .env")
            return False
            
        print("✅ Cấu hình đã sẵn sàng")
        return True
    except Exception as e:
        print(f"❌ Lỗi cấu hình: {e}")
        return False

def check_knowledge_base():
    """Kiểm tra thư mục knowledge base"""
    kb_dir = Path(__file__).parent / "data" / "knowledge_base"
    if not kb_dir.exists():
        print(f"❌ Thư mục knowledge base không tồn tại: {kb_dir}")
        kb_dir.mkdir(parents=True)
        print(f"✅ Đã tạo thư mục: {kb_dir}")
    else:
        files = list(kb_dir.glob("*.txt"))
        print(f"✅ Tìm thấy {len(files)} file trong knowledge base")
    
    return True

def main():
    """Hàm chính để kiểm tra và chạy server"""
    print("🔍 Đang kiểm tra cài đặt...")
    
    checks = [
        check_dependencies(),
        check_config(),
        check_knowledge_base()
    ]
    
    if all(checks):
        print("\n✨ Tất cả kiểm tra đã pass!")
        print("🚀 Đang khởi động server...")
        
        # Import và chạy app
        from api.app_new import app
        app.run(host='0.0.0.0', port=5000, debug=True)
    else:
        print("\n❌ Một số kiểm tra không pass. Vui lòng fix các lỗi trên trước khi chạy server.")
        sys.exit(1)

if __name__ == "__main__":
    main()
