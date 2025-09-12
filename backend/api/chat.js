const express = require('express');
const { ragService } = require('../services/ragService');
const { logger } = require('../utils/logger');

const app = express();

// Chat endpoint với RAG
app.post('/', async (req, res) => {
  try {
    const { message, conversationId, useRag = true } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required and must be a string'
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        error: 'Message too long. Maximum 2000 characters allowed.'
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
        ragUsed: useRag,
        contextUsed: response.contextUsed
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

module.exports = app;