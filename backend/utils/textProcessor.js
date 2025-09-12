const natural = require('natural');
const stopword = require('stopword');
const compromise = require('compromise');

class TextProcessor {
  constructor() {
    this.chunkSize = parseInt(process.env.CHUNK_SIZE) || 500;
    this.chunkOverlap = parseInt(process.env.CHUNK_OVERLAP) || 50;
    this.stemmer = natural.PorterStemmer;
  }

  processText(text) {
    if (!text || typeof text !== 'string') {
      return '';
    }

    // Làm sạch text
    let processed = text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n+/g, '\n')
      .replace(/\s+/g, ' ')
      .trim();

    // Loại bỏ ký tự đặc biệt không cần thiết nhưng giữ lại dấu câu
    processed = processed.replace(/[^\w\s\.\,\!\?\-\:\;\(\)\[\]]/g, ' ');

    return processed;
  }

  chunkText(text, chunkSize = this.chunkSize, overlap = this.chunkOverlap) {
    if (!text) return [];

    const sentences = this.splitIntoSentences(text);
    const chunks = [];
    let currentChunk = '';
    let currentSize = 0;

    for (const sentence of sentences) {
      const sentenceSize = sentence.length;

      // Nếu câu hiện tại làm chunk vượt quá kích thước
      if (currentSize + sentenceSize > chunkSize && currentChunk) {
        chunks.push(currentChunk.trim());
        
        // Tạo overlap
        const words = currentChunk.split(' ');
        const overlapWords = words.slice(-Math.floor(overlap / 10));
        currentChunk = overlapWords.join(' ') + ' ' + sentence;
        currentSize = currentChunk.length;
      } else {
        currentChunk += (currentChunk ? ' ' : '') + sentence;
        currentSize = currentChunk.length;
      }
    }

    // Thêm chunk cuối cùng
    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    return chunks.filter(chunk => chunk.length > 50); // Loại bỏ chunks quá ngắn
  }

  splitIntoSentences(text) {
    try {
      const tokenizer = new natural.SentenceTokenizer();
      return tokenizer.tokenize(text);
    } catch (error) {
      // Fallback: split by periods
      return text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    }
  }

  extractKeywords(text, limit = 10) {
    if (!text) return [];

    try {
      // Tokenize
      const tokens = natural.WordTokenizer().tokenize(text.toLowerCase());
      
      // Loại bỏ stop words
      const filteredTokens = stopword.removeStopwords(tokens);
      
      // Stem words
      const stemmedTokens = filteredTokens.map(token => this.stemmer.stem(token));
      
      // Đếm frequency
      const frequency = {};
      stemmedTokens.forEach(token => {
        if (token.length > 2) {
          frequency[token] = (frequency[token] || 0) + 1;
        }
      });

      // Sắp xếp theo frequency
      const sortedKeywords = Object.entries(frequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, limit)
        .map(([word, freq]) => ({ word, frequency: freq }));

      return sortedKeywords;
    } catch (error) {
      return [];
    }
  }

  summarizeText(text, maxLength = 200) {
    if (!text || text.length <= maxLength) {
      return text;
    }

    try {
      const doc = compromise(text);
      const sentences = doc.sentences().out('array');
      
      if (sentences.length <= 2) {
        return text.substring(0, maxLength) + '...';
      }

      let summary = sentences[0];
      let currentLength = summary.length;

      // Thêm câu từ giữa văn bản
      for (let i = 1; i < sentences.length - 1; i++) {
        if (currentLength + sentences[i].length < maxLength - sentences[sentences.length - 1].length - 10) {
          summary += ' ' + sentences[i];
          currentLength = summary.length;
        }
      }

      // Thêm câu cuối
      if (currentLength + sentences[sentences.length - 1].length < maxLength) {
        summary += ' ' + sentences[sentences.length - 1];
      }

      return summary.length > maxLength 
        ? summary.substring(0, maxLength) + '...'
        : summary;
    } catch (error) {
      return text.substring(0, maxLength) + '...';
    }
  }

  calculateTextSimilarity(text1, text2) {
    try {
      const tokens1 = new Set(natural.WordTokenizer().tokenize(text1.toLowerCase()));
      const tokens2 = new Set(natural.WordTokenizer().tokenize(text2.toLowerCase()));

      const intersection = new Set([...tokens1].filter(x => tokens2.has(x)));
      const union = new Set([...tokens1, ...tokens2]);

      return intersection.size / union.size; // Jaccard similarity
    } catch (error) {
      return 0;
    }
  }
}

module.exports = { textProcessor: new TextProcessor() };