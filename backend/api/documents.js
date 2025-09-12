const express = require('express');
const multer = require('multer');
const { vectorService } = require('../services/vectorService');
const { documentParser } = require('../utils/documentParser');
const { logger } = require('../utils/logger');

const app = express();

// Cấu hình multer để upload file
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'text/plain', 
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only TXT, PDF, and DOCX files are allowed.'));
    }
  }
});

// Upload và xử lý documents
app.post('/upload', upload.array('documents', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'No documents provided'
      });
    }

    const results = [];
    
    for (const file of req.files) {
      try {
        logger.info(`Processing document: ${file.originalname}`);
        
        // Validate file
        documentParser.validateFile(file);
        
        // Parse document content
        const content = await documentParser.parseDocument(file);
        
        // Add to vector database
        const documentId = await vectorService.addDocument({
          filename: file.originalname,
          content: content,
          mimetype: file.mimetype,
          size: file.size
        });

        results.push({
          filename: file.originalname,
          documentId: documentId,
          status: 'success',
          size: documentParser.getFileInfo(file).sizeFormatted
        });

      } catch (error) {
        logger.error(`Error processing ${file.originalname}:`, error);
        results.push({
          filename: file.originalname,
          status: 'error',
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      data: {
        processed: results,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Document upload error:', error);
    res.status(500).json({
      error: 'Failed to process documents',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

module.exports = app;