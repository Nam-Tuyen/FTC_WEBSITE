const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import services và utilities
const { geminiService } = require('../services/geminiService');
const { ragService } = require('../services/ragService');
const { vectorService } = require('../services/vectorService');
const { logger } = require('../utils/logger');
const { errorHandler } = require('../middleware/errorHandler');

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(morgan('combined'));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const health = await geminiService.healthCheck();
    res.status(200).json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      service: 'RAG Chatbot Backend',
      gemini: health,
      version: '1.0.0'
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(500).json({
      status: 'ERROR',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'RAG Chatbot Backend API',
    version: '1.0.0',
    endpoints: [
      'GET /health - Health check',
      'POST /chat - Chat với RAG system',
      'GET /chat/history/:conversationId - Lấy lịch sử chat',
      'DELETE /chat/history/:conversationId - Xóa lịch sử chat',
      'POST /documents/upload - Upload documents',
      'GET /documents - Lấy danh sách documents',
      'DELETE /documents/:documentId - Xóa document',
      'POST /documents/search - Tìm kiếm trong documents'
    ],
    timestamp: new Date().toISOString()
  });
});

// Chat endpoints
app.post('/chat', async (req, res) => {
  try {
    const { message, conversationId, useRag = true } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required and must be a string'
      });
    }

    logger.info(`Received chat message: ${message.substring(0, 100)}...`);

    const response = await ragService.generateResponse({
      message,
      conversationId,
      useRag
    });

    res.json({
      success: true,
      data: {
        response: response.text,
        conversationId: response.conversationId,
        sources: response.sources,
        timestamp: new Date().toISOString(),
        ragUsed: useRag
      }
    });

  } catch (error) {
    logger.error('Chat endpoint error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

app.get('/chat/history/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const history = await ragService.getConversationHistory(conversationId);
    
    res.json({
      success: true,
      data: {
        conversationId,
        history,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Get history error:', error);
    res.status(500).json({
      error: 'Failed to retrieve conversation history'
    });
  }
});

app.delete('/chat/history/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    await ragService.clearConversationHistory(conversationId);
    
    res.json({
      success: true,
      message: 'Conversation history cleared'
    });
  } catch (error) {
    logger.error('Clear history error:', error);
    res.status(500).json({
      error: 'Failed to clear conversation history'
    });
  }
});

// Documents endpoints
app.get('/documents', async (req, res) => {
  try {
    const documents = await vectorService.getAllDocuments();
    
    res.json({
      success: true,
      data: {
        documents: documents,
        count: documents.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Get documents error:', error);
    res.status(500).json({
      error: 'Failed to retrieve documents'
    });
  }
});

app.delete('/documents/:documentId', async (req, res) => {
  try {
    const { documentId } = req.params;
    await vectorService.deleteDocument(documentId);
    
    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    logger.error('Delete document error:', error);
    res.status(500).json({
      error: 'Failed to delete document'
    });
  }
});

app.post('/documents/search', async (req, res) => {
  try {
    const { query, limit = 5 } = req.body;
    
    if (!query) {
      return res.status(400).json({
        error: 'Search query is required'
      });
    }

    const results = await vectorService.searchSimilar(query, limit);
    
    res.json({
      success: true,
      data: {
        query: query,
        results: results,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Document search error:', error);
    res.status(500).json({
      error: 'Failed to search documents'
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Error handling middleware
app.use(errorHandler);

// Export for Vercel
module.exports = app;