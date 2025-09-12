const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Validate environment variables trước khi khởi tạo services
const { envValidator } = require('./utils/envValidator');
envValidator.validateEnvironment();

const chatRoutes = require('./routes/chat');
const documentRoutes = require('./routes/documents');
const { logger } = require('./utils/logger');
const { errorHandler } = require('./middleware/errorHandler');
const { geminiService } = require('./services/geminiService');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
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
    const geminiHealth = await geminiService.healthCheck();
    const envSummary = envValidator.getEnvironmentSummary();
    
    res.status(200).json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      service: 'RAG Chatbot Backend',
      environment: envSummary,
      geminiService: geminiHealth,
      version: '1.0.0'
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      service: 'RAG Chatbot Backend',
      error: error.message
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
      'POST /api/chat - Chat với RAG system',
      'GET /api/chat/history/:conversationId - Lấy lịch sử chat',
      'DELETE /api/chat/history/:conversationId - Xóa lịch sử chat',
      'POST /api/documents/upload - Upload documents',
      'GET /api/documents - Lấy danh sách documents',
      'DELETE /api/documents/:documentId - Xóa document',
      'POST /api/documents/search - Tìm kiếm trong documents'
    ],
    timestamp: new Date().toISOString()
  });
});

// Environment info endpoint (chỉ trong development)
app.get('/env-info', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Endpoint not available in production' });
  }
  
  res.json({
    environment: envValidator.getEnvironmentSummary(),
    apiKeyMasked: envValidator.getApiKeyMasked(),
    isVercel: envValidator.isVercel(),
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/chat', chatRoutes);
app.use('/api/documents', documentRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.originalUrl,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'POST /api/chat',
      'GET /api/chat/history/:conversationId',
      'DELETE /api/chat/history/:conversationId',
      'POST /api/documents/upload',
      'GET /api/documents',
      'DELETE /api/documents/:documentId',
      'POST /api/documents/search'
    ]
  });
});

// Error handling middleware
app.use(errorHandler);

// Export cho Vercel
module.exports = app;

// Start server chỉ khi không chạy trên Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    logger.info(`RAG Chatbot Backend server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`API Key configured: ${envValidator.getApiKeyMasked()}`);
    logger.info(`Running on Vercel: ${envValidator.isVercel()}`);
  });
}