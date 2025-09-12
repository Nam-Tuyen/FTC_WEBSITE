const axios = require('axios');
const { logger } = require('../utils/logger');

class GeminiService {
  constructor() {
    // Lấy API key từ Vercel environment variables
    this.apiKey = this.getSecureApiKey();
    this.model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models';
    
    if (!this.apiKey) {
      const errorMsg = 'GEMINI_API_KEY is required. Please set it in Vercel environment variables.';
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    logger.info('GeminiService initialized successfully');
    logger.info(`Using model: ${this.model}`);
    logger.info(`API Key configured: ${this.getMaskedApiKey()}`);
  }

  getSecureApiKey() {
    // Ưu tiên lấy từ Vercel environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      logger.error('GEMINI_API_KEY not found in environment variables');
      return null;
    }

    // Validate API key format (Google API keys thường bắt đầu với AIza)
    if (!apiKey.startsWith('AIza')) {
      logger.warn('API key format might be incorrect. Google API keys typically start with "AIza"');
    }

    return apiKey;
  }

  getMaskedApiKey() {
    if (!this.apiKey) return 'Not configured';
    if (this.apiKey.length < 8) return 'Invalid format';
    return `${this.apiKey.substring(0, 4)}...${this.apiKey.substring(this.apiKey.length - 4)}`;
  }

  async generateContent(prompt, context = null) {
    try {
      if (!this.apiKey) {
        throw new Error('Gemini API key is not configured');
      }

      const fullPrompt = context 
        ? `Context: ${context}\n\nQuestion: ${prompt}\n\nPlease answer based on the provided context. If the context doesn't contain relevant information, please say so and provide a general response.`
        : prompt;

      logger.info(`Generating content for prompt: ${prompt.substring(0, 100)}...`);

      const requestData = {
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      };

      const response = await axios.post(
        `${this.baseURL}/${this.model}:generateContent?key=${this.apiKey}`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 25000 // 25 seconds timeout
        }
      );

      if (response.data.candidates && response.data.candidates.length > 0) {
        const content = response.data.candidates[0].content;
        if (content && content.parts && content.parts.length > 0) {
          const generatedText = content.parts[0].text;
          logger.info(`Successfully generated content: ${generatedText.substring(0, 100)}...`);
          return generatedText;
        }
      }

      throw new Error('No valid response from Gemini API');

    } catch (error) {
      logger.error('Gemini API error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      if (error.response?.status === 429) {
        throw new Error('API rate limit exceeded. Please try again later.');
      } else if (error.response?.status === 401) {
        throw new Error('Invalid or expired API key. Please check your Vercel environment variables.');
      } else if (error.response?.status === 400) {
        throw new Error('Invalid request to Gemini API. Please check your input.');
      } else if (error.response?.status === 403) {
        throw new Error('API access forbidden. Please check your API key permissions.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please try again.');
      }
      
      throw new Error(`Failed to generate response: ${error.message}`);
    }
  }

  async generateEmbedding(text) {
    try {
      if (!text || typeof text !== 'string') {
        throw new Error('Text input is required for embedding generation');
      }

      logger.info(`Generating embedding for text: ${text.substring(0, 50)}...`);

      // Sử dụng Gemini để tạo semantic analysis
      const response = await axios.post(
        `${this.baseURL}/${this.model}:generateContent?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{
              text: `Analyze the semantic meaning and extract key concepts from this text: "${text}". Return only the key concepts as a comma-separated list.`
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 256,
          }
        },
        {
          timeout: 15000
        }
      );

      let analysis = '';
      if (response.data.candidates && response.data.candidates.length > 0) {
        analysis = response.data.candidates[0].content.parts[0].text;
      }
      
      const embedding = this.textToVector(text + ' ' + analysis);
      logger.info(`Successfully generated embedding with ${embedding.length} dimensions`);
      return embedding;
      
    } catch (error) {
      logger.error('Embedding generation error:', error.message);
      // Fallback to simple text-based vector
      logger.info('Falling back to simple text-to-vector conversion');
      return this.textToVector(text);
    }
  }

  textToVector(text) {
    if (!text) return new Array(100).fill(0);
    
    const words = text.toLowerCase().match(/\w+/g) || [];
    const vector = new Array(100).fill(0);
    
    words.forEach((word, index) => {
      const hash = this.simpleHash(word) % 100;
      vector[hash] += 1 / (index + 1);
    });
    
    // Normalize vector
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return magnitude > 0 ? vector.map(val => val / magnitude) : vector;
  }

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) {
      return 0;
    }

    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    
    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
  }

  async healthCheck() {
    try {
      const testResponse = await this.generateContent('Hello, this is a test message.');
      return {
        status: 'healthy',
        apiKeyConfigured: !!this.apiKey,
        model: this.model,
        testResponse: testResponse ? 'success' : 'failed'
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        apiKeyConfigured: !!this.apiKey,
        model: this.model,
        error: error.message
      };
    }
  }
}

module.exports = { geminiService: new GeminiService() };