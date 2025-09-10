"""
Flask web application cho FTC Chatbot
"""
import logging
import colorlog
from flask import Flask, request, jsonify
from flask_cors import CORS
from services.gemini_service import GeminiService
from config import Config

# Cấu hình logging
def setup_logging():
    """Thiết lập logging với màu sắc"""
    handler = colorlog.StreamHandler()
    handler.setFormatter(colorlog.ColoredFormatter(
        '%(log_color)s%(levelname)-8s%(reset)s %(blue)s%(name)s%(reset)s: %(message)s'
    ))
    
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, Config.LOG_LEVEL))
    root_logger.addHandler(handler)

setup_logging()
logger = logging.getLogger(__name__)

# Khởi tạo Flask app
app = Flask(__name__)

# Cấu hình CORS để cho phép frontend gọi API
CORS(app, resources={
    r"/api/*": {
        "origins": "*",  # Trong production nên giới hạn origins cụ thể
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Khởi tạo services
try:
    Config.validate()
    gemini_service = GeminiService()
    logger.info("✅ Gemini service đã được khởi tạo thành công")
except Exception as e:
    logger.error(f"❌ Lỗi khởi tạo Gemini service: {e}")
    gemini_service = None

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat requests."""
    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({'error': 'No message provided'}), 400

        user_message = data['message']
        history = data.get('history', [])  # Optional chat history
        
        if not gemini_service:
            return jsonify({
                'error': True,
                'response': 'Chatbot service hiện không khả dụng'
            }), 503
        
        # Generate response using Gemini
        response = gemini_service.generate_response(user_message, history)
        
        return jsonify({
            'response': response,
            'error': False
        })

    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        return jsonify({
            'error': True,
            'response': 'Có lỗi xảy ra khi xử lý yêu cầu'
        }), 500

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'gemini_available': gemini_service is not None and gemini_service.is_available()
    })

if __name__ == '__main__':
    port = int(Config.FLASK_PORT)
    debug = Config.FLASK_DEBUG
    
    logger.info(f"🚀 Khởi động FTC Chatbot API Server trên port {port}")
    logger.info(f"📝 Debug mode: {'✅ Bật' if debug else '❌ Tắt'}")
    logger.info(f"🤖 Gemini API: {'✅ Sẵn sàng' if gemini_service and gemini_service.is_available() else '❌ Không khả dụng'}")
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug
    )
