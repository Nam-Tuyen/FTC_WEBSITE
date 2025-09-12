const { geminiService } = require('./geminiService');
const { vectorService } = require('./vectorService');
const { logger } = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

class RAGService {
  constructor() {
    this.conversations = new Map(); // In-memory storage
    this.maxContextLength = parseInt(process.env.MAX_CONTEXT_LENGTH) || 4000;
    this.similarityThreshold = parseFloat(process.env.SIMILARITY_THRESHOLD) || 0.7;
    
    logger.info('RAGService initialized');
    logger.info(`Max context length: ${this.maxContextLength}`);
    logger.info(`Similarity threshold: ${this.similarityThreshold}`);
  }

  async generateResponse({ message, conversationId, useRag = true }) {
    try {
      // Tạo conversation ID mới nếu chưa có
      if (!conversationId) {
        conversationId = uuidv4();
      }

      // Lấy conversation history
      const conversation = this.conversations.get(conversationId) || {
        id: conversationId,
        messages: [],
        createdAt: new Date().toISOString()
      };

      let context = '';
      let sources = [];

      if (useRag) {
        try {
          // Tìm kiếm documents liên quan
          const relevantDocs = await vectorService.searchSimilar(message, 5);
          
          if (relevantDocs.length > 0) {
            // Lọc documents theo similarity threshold
            const filteredDocs = relevantDocs.filter(doc => 
              doc.similarity >= this.similarityThreshold
            );

            if (filteredDocs.length > 0) {
              context = filteredDocs
                .map(doc => `Source: ${doc.filename}\nContent: ${doc.content}`)
                .join('\n\n');

              sources = filteredDocs.map(doc => ({
                filename: doc.filename,
                similarity: doc.similarity,
                documentId: doc.documentId
              }));

              // Cắt context nếu quá dài
              if (context.length > this.maxContextLength) {
                context = context.substring(0, this.maxContextLength) + '...';
              }

              logger.info(`Found ${filteredDocs.length} relevant documents for RAG`);
            }
          }
        } catch (error) {
          logger.error('RAG search error:', error);
          // Continue without RAG if search fails
        }
      }

      // Tạo prompt với conversation history
      let prompt = message;
      if (conversation.messages.length > 0) {
        const recentMessages = conversation.messages.slice(-4); // Lấy 4 tin nhắn gần nhất
        const historyContext = recentMessages
          .map(msg => `${msg.role}: ${msg.content}`)
          .join('\n');
        
        prompt = `Previous conversation:\n${historyContext}\n\nUser: ${message}`;
      }

      // Generate response từ Gemini
      const response = await geminiService.generateContent(prompt, context);

      // Lưu vào conversation history
      conversation.messages.push(
        { role: 'user', content: message, timestamp: new Date().toISOString() },
        { role: 'assistant', content: response, timestamp: new Date().toISOString(), sources }
      );

      // Giới hạn số lượng messages trong memory (giữ 10 messages gần nhất)
      if (conversation.messages.length > 10) {
        conversation.messages = conversation.messages.slice(-10);
      }

      this.conversations.set(conversationId, conversation);

      logger.info(`Generated response for conversation ${conversationId}`);

      return {
        text: response,
        conversationId,
        sources,
        contextUsed: context.length > 0
      };

    } catch (error) {
      logger.error('RAG service error:', error);
      throw error;
    }
  }

  async getConversationHistory(conversationId) {
    const conversation = this.conversations.get(conversationId);
    return conversation ? conversation.messages : [];
  }

  async clearConversationHistory(conversationId) {
    this.conversations.delete(conversationId);
    logger.info(`Cleared conversation history for ${conversationId}`);
  }

  // Cleanup old conversations (gọi định kỳ)
  cleanupOldConversations(maxAgeHours = 24) {
    const cutoffTime = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
    let cleanedCount = 0;
    
    for (const [id, conversation] of this.conversations.entries()) {
      const createdAt = new Date(conversation.createdAt);
      if (createdAt < cutoffTime) {
        this.conversations.delete(id);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      logger.info(`Cleaned up ${cleanedCount} old conversations`);
    }
  }

  getStats() {
    return {
      totalConversations: this.conversations.size,
      maxContextLength: this.maxContextLength,
      similarityThreshold: this.similarityThreshold
    };
  }
}

module.exports = { ragService: new RAGService() };