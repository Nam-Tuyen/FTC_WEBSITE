"""
Routes for chatbot functionality
"""
from flask import Blueprint, request, jsonify
from services.gemini_service import GeminiService

chatbot = Blueprint('chatbot', __name__)
gemini_service = GeminiService()

@chatbot.route('/chat', methods=['POST'])
def chat():
    """Handle chat requests."""
    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({'error': 'No message provided'}), 400

    user_message = data['message']
    
    # Generate response using Gemini with knowledge base
    response = gemini_service.generate_response(user_message)
    
    return jsonify({
        'response': response,
        'type': 'general'  # Type is always general since we removed mode selection
    })

@chatbot.route('/feedback', methods=['POST'])
def feedback():
    """Handle user feedback for chat responses."""
    data = request.get_json()
    if not data or 'messageId' not in data or 'feedback' not in data:
        return jsonify({'error': 'Invalid feedback data'}), 400

    # TODO: Implement feedback storage and processing
    
    return jsonify({'status': 'success'})
