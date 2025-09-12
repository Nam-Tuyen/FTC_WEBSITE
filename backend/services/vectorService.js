const { geminiService } = require('./geminiService');
const { textProcessor } = require('../utils/textProcessor');
const { logger } = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

class VectorService {
  constructor() {
    this.documents = new Map(); // In-memory storage
    this.vectors = new Map();   // Document vectors
    this.maxDocuments = parseInt(process.env.MAX_DOCUMENTS) || 1000;
    
    logger.info('VectorService initialized');
    logger.info(`Max documents: ${this.maxDocuments}`);
  }

  async addDocument({ filename, content, mimetype, size }) {
    try {
      const documentId = uuidv4();
      
      // Xử lý và chia nhỏ text
      const processedContent = textProcessor.processText(content);
      const chunks = textProcessor.chunkText(processedContent);
      
      if (chunks.length === 0) {
        throw new Error('No valid content chunks found in document');
      }

      // Tạo vectors cho từng chunk
      const chunkVectors = [];
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        try {
          const vector = await geminiService.generateEmbedding(chunk);
          chunkVectors.push({
            id: uuidv4(),
            content: chunk,
            vector: vector,
            chunkIndex: i
          });
        } catch (error) {
          logger.warn(`Failed to generate embedding for chunk ${i}: ${error.message}`);
          // Continue with other chunks
        }
      }

      if (chunkVectors.length === 0) {
        throw new Error('Failed to generate embeddings for any chunks');
      }

      // Lưu document
      const document = {
        id: documentId,
        filename,
        originalContent: content,
        processedContent,
        chunks: chunkVectors,
        mimetype,
        size,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.documents.set(documentId, document);
      
      // Lưu vectors để search
      chunkVectors.forEach(chunk => {
        this.vectors.set(chunk.id, {
          documentId,
          filename,
          content: chunk.content,
          vector: chunk.vector,
          chunkIndex: chunk.chunkIndex
        });
      });

      logger.info(`Added document ${filename} with ${chunkVectors.length} chunks`);

      // Cleanup nếu quá nhiều documents
      await this.cleanupOldDocuments();

      return documentId;

    } catch (error) {
      logger.error('Add document error:', error);
      throw error;
    }
  }

  async searchSimilar(query, limit = 5) {
    try {
      if (this.vectors.size === 0) {
        logger.info('No documents available for search');
        return [];
      }

      // Tạo vector cho query
      const queryVector = await geminiService.generateEmbedding(query);
      
      // Tính similarity với tất cả chunks
      const similarities = [];
      
      for (const [chunkId, vectorData] of this.vectors.entries()) {
        const similarity = geminiService.cosineSimilarity(queryVector, vectorData.vector);
        
        if (similarity > 0) { // Chỉ lấy những kết quả có similarity > 0
          similarities.push({
            chunkId,
            documentId: vectorData.documentId,
            filename: vectorData.filename,
            content: vectorData.content,
            similarity,
            chunkIndex: vectorData.chunkIndex
          });
        }
      }

      // Sắp xếp theo similarity và lấy top results
      const topResults = similarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);

      logger.info(`Found ${topResults.length} similar chunks for query: ${query.substring(0, 50)}...`);

      return topResults;

    } catch (error) {
      logger.error('Search similar error:', error);
      throw error;
    }
  }

  async getAllDocuments() {
    const documents = Array.from(this.documents.values()).map(doc => ({
      id: doc.id,
      filename: doc.filename,
      mimetype: doc.mimetype,
      size: doc.size,
      chunksCount: doc.chunks.length,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    }));

    return documents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async deleteDocument(documentId) {
    const document = this.documents.get(documentId);
    if (!document) {
      throw new Error('Document not found');
    }

    // Xóa vectors của document
    document.chunks.forEach(chunk => {
      this.vectors.delete(chunk.id);
    });

    // Xóa document
    this.documents.delete(documentId);

    logger.info(`Deleted document ${document.filename}`);
  }

  async cleanupOldDocuments() {
    if (this.documents.size <= this.maxDocuments) {
      return;
    }

    // Lấy documents cũ nhất
    const documents = Array.from(this.documents.entries())
      .sort(([,a], [,b]) => new Date(a.createdAt) - new Date(b.createdAt));

    const toDelete = documents.slice(0, documents.length - this.maxDocuments);
    
    for (const [documentId] of toDelete) {
      await this.deleteDocument(documentId);
    }

    logger.info(`Cleaned up ${toDelete.length} old documents`);
  }

  getStats() {
    return {
      totalDocuments: this.documents.size,
      totalChunks: this.vectors.size,
      maxDocuments: this.maxDocuments
    };
  }
}

module.exports = { vectorService: new VectorService() };