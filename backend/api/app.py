"""
Flask web application cho FTC Chatbot
"""
import logging
import colorlog
from flask import Fla@app.route('/api/health', methods=['GET'])
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
    ) jsonify
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
            border-top: 1px solid #e9ecef;
            display: flex;
            gap: 10px;
        }
        .input-field {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid #ddd;
            border-radius: 25px;
            outline: none;
            font-size: 14px;
        }
        .send-btn {
            padding: 12px 24px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
        }
        .send-btn:hover { background: #0056b3; }
        .send-btn:disabled { background: #ccc; cursor: not-allowed; }
        .typing { opacity: 0.7; font-style: italic; }
        .stats {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(255,255,255,0.9);
            padding: 10px;
            border-radius: 10px;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 FTC AI Assistant</h1>
            <p>Trợ lý AI của Câu lạc bộ Công nghệ - Tài chính</p>
        </div>
        
        <div class="stats" id="stats">
            <div>Gemini: <span id="gemini-status">Checking...</span></div>
            <div>Messages: <span id="message-count">0</span></div>
        </div>
        
        <div class="chat-area" id="chatArea">
            <div class="message bot-message">
                Xin chào! Tôi là FTC AI Assistant. Tôi có thể giúp bạn về Câu lạc bộ Công nghệ Tài chính và các chủ đề Fintech. Bạn muốn hỏi gì?
            </div>
        </div>
        
        <div class="input-area">
            <input type="text" class="input-field" id="messageInput" 
                   placeholder="Nhập câu hỏi của bạn..." maxlength="500">
            <button class="send-btn" id="sendBtn" onclick="sendMessage()">Gửi</button>
        </div>
    </div>

    <script>
        let messageCount = 0;
        
        // Cập nhật stats
        async function updateStats() {
            try {
                const response = await fetch('/api/stats');
                const stats = await response.json();
                document.getElementById('gemini-status').textContent = 
                    stats.gemini_available ? '✅ Online' : '❌ Offline';
                document.getElementById('message-count').textContent = stats.total_messages;
            } catch (e) {
                document.getElementById('gemini-status').textContent = '❌ Error';
            }
        }
        
        // Gửi tin nhắn
        async function sendMessage() {
            const input = document.getElementById('messageInput');
            const message = input.value.trim();
            
            if (!message) return;
            
            // Hiển thị tin nhắn người dùng
            addMessage(message, 'user');
            input.value = '';
            
            // Hiển thị trạng thái đang gõ
            const typingDiv = addMessage('Đang suy nghĩ...', 'bot', true);
            
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: message })
                });
                
                const data = await response.json();
                
                // Xóa tin nhắn đang gõ
                typingDiv.remove();
                
                // Hiển thị phản hồi
                addMessage(data.response || 'Xin lỗi, có lỗi xảy ra.', 'bot');
                
            } catch (error) {
                typingDiv.remove();
                addMessage('Xin lỗi, không thể kết nối tới server.', 'bot');
            }
            
            updateStats();
        }
        
        // Thêm tin nhắn vào chat
        function addMessage(text, sender, isTyping = false) {
            const chatArea = document.getElementById('chatArea');
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}-message ${isTyping ? 'typing' : ''}`;
            messageDiv.innerHTML = text.replace(/\n/g, '<br>');
            chatArea.appendChild(messageDiv);
            chatArea.scrollTop = chatArea.scrollHeight;
            return messageDiv;
        }
        
        // Enter để gửi tin nhắn
        document.getElementById('messageInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        // Cập nhật stats khi load trang
        updateStats();
        setInterval(updateStats, 30000); // Cập nhật mỗi 30 giây
    </script>
</body>
</html>
"""

@app.route('/')
def index():
    """Trang chủ với giao diện chat"""
    return render_template_string(HTML_TEMPLATE)

@app.route('/api/chat', methods=['POST'])
def chat():
    """API endpoint xử lý chat"""
    if not chatbot:
        return jsonify({
            'error': 'Chatbot chưa được khởi tạo',
            'response': 'Xin lỗi, hệ thống chatbot hiện không khả dụng.'
        }), 500
    
    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({'error': 'Thiếu tin nhắn'}), 400
        
        message = data['message']
        response = chatbot.process_question(message)
        
        return jsonify({
            'response': response,
            'status': 'success'
        })
        
    except Exception as e:
        logger.error(f"Lỗi API chat: {str(e)}")
        return jsonify({
            'error': str(e),
            'response': 'Xin lỗi, có lỗi xảy ra khi xử lý câu hỏi.'
        }), 500

@app.route('/api/stats', methods=['GET'])
def stats():
    """API lấy thống kê"""
    if not chatbot:
        return jsonify({'error': 'Chatbot không khả dụng'}), 500
    
    try:
        stats = chatbot.get_stats()
        return jsonify(stats)
    except Exception as e:
        logger.error(f"Lỗi API stats: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/clear', methods=['POST'])
def clear_history():
    """API xóa lịch sử hội thoại"""
    if not chatbot:
        return jsonify({'error': 'Chatbot không khả dụng'}), 500
    
    try:
        chatbot.clear_history()
        return jsonify({'status': 'success', 'message': 'Đã xóa lịch sử hội thoại'})
    except Exception as e:
        logger.error(f"Lỗi API clear: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'chatbot_available': chatbot is not None,
        'gemini_available': chatbot.gemini_service.is_available() if chatbot else False
    })

if __name__ == '__main__':
    logger.info("Khởi động FTC Chatbot Server...")
    logger.info(f"Gemini API: {'✅ Có' if Config.GEMINI_API_KEY else '❌ Không'}")
    
    app.run(
        host='0.0.0.0',
        port=Config.FLASK_PORT,
        debug=Config.FLASK_DEBUG
    )