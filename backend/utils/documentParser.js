const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { logger } = require('./logger');

class DocumentParser {
  async parseDocument(file) {
    try {
      let content = '';

      switch (file.mimetype) {
        case 'text/plain':
          content = file.buffer.toString('utf8');
          break;
          
        case 'application/pdf':
          const pdfData = await pdfParse(file.buffer);
          content = pdfData.text;
          break;
          
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          const docxData = await mammoth.extractRawText({ buffer: file.buffer });
          content = docxData.value;
          break;
          
        default:
          throw new Error(`Unsupported file type: ${file.mimetype}`);
      }

      if (!content || content.trim().length === 0) {
        throw new Error('Document appears to be empty or could not be parsed');
      }

      logger.info(`Parsed document ${file.originalname}, content length: ${content.length}`);
      
      return content;

    } catch (error) {
      logger.error(`Error parsing document ${file.originalname}:`, error);
      throw new Error(`Failed to parse document: ${error.message}`);
    }
  }

  validateFile(file) {
    const allowedTypes = [
      'text/plain',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error(`File type ${file.mimetype} is not supported`);
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error(`File size ${file.size} exceeds maximum allowed size of ${maxSize} bytes`);
    }

    return true;
  }

  getFileInfo(file) {
    return {
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      sizeFormatted: this.formatFileSize(file.size)
    };
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

module.exports = { documentParser: new DocumentParser() };