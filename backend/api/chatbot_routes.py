"""
Routes for chatbot functionality
"""
from flask import Blueprint, request, jsonify
from services.gemini_service import GeminiService
from services.club_knowledge import ClubKnowledgeService
from services.question_classifier import QuestionClassifier

chatbot = Blueprint('chatbot', __name__)
gemini_service = GeminiService()
knowledge_service = ClubKnowledgeService()
classifier = QuestionClassifier()

@chatbot.route('/chat', methods=['POST'])
def chat():
    """Handle chat requests."""
    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({'error': 'No message provided'}), 400

    user_message = data['message']
    
    # Classify the question type
    question_type = classifier.classify(user_message)
    
    # Get relevant context based on question type
    context = knowledge_service.get_context(question_type, user_message)
    
    # Generate response using Gemini
    response = gemini_service.generate_response(user_message, context)
    
    return jsonify({
        'response': response,
        'type': question_type
    })

@chatbot.route('/feedback', methods=['POST'])
def feedback():
    """Handle user feedback for chat responses."""
    data = request.get_json()
    if not data or 'messageId' not in data or 'feedback' not in data:
        return jsonify({'error': 'Invalid feedback data'}), 400

    # TODO: Implement feedback storage and processing
    
    return jsonify({'status': 'success'})
