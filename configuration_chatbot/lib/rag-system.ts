import fs from 'fs';
import path from 'path';

// Configurable RAG tuning knobs (can be overridden via env)
const DEFAULT_TOP_K = parseInt(process.env.RAG_TOP_K ?? '3', 10); // how many items to return by default
const MIN_RELEVANCE_SCORE = parseFloat(process.env.RAG_MIN_SCORE ?? '1.5'); // minimum score to consider a match

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  source: string;
  category: string;
  lastModified: Date;
}

export interface RAGContext {
  knowledgeItems: KnowledgeItem[];
  totalItems: number;
  lastUpdated: Date;
}

class RAGSystem {
  private knowledgeBaseDir: string;
  private cacheFile: string;
  private cache: RAGContext | null = null;
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.knowledgeBaseDir = path.resolve(process.cwd(), 'backend', 'data', 'knowledge_base');
    this.cacheFile = path.join(this.knowledgeBaseDir, '.rag_cache.json');
  }

  /**
   * Load all knowledge base files and create structured data
   */
  async loadKnowledgeBase(): Promise<RAGContext> {
    // Check cache first
    if (this.cache && this.isCacheValid()) {
      return this.cache;
    }

    const knowledgeItems: KnowledgeItem[] = [];
    
    try {
      // Check if directory exists
      await fs.promises.access(this.knowledgeBaseDir);
    } catch (e) {
      console.warn('Knowledge base directory not found:', this.knowledgeBaseDir);
      return this.createEmptyContext();
    }

    try {
      const files = await fs.promises.readdir(this.knowledgeBaseDir);
      
      for (const file of files) {
        if (this.isValidFile(file)) {
          try {
            const filePath = path.join(this.knowledgeBaseDir, file);
            const content = await fs.promises.readFile(filePath, 'utf-8');
            const stat = await fs.promises.stat(filePath);
            
            if (content.trim()) {
              const knowledgeItem = this.parseFile(file, content, stat.mtime);
              knowledgeItems.push(knowledgeItem);
            }
          } catch (e) {
            console.error(`Error reading file ${file}:`, e);
          }
        }
      }
    } catch (e) {
      console.error('Error reading knowledge base directory:', e);
    }

    const context: RAGContext = {
      knowledgeItems,
      totalItems: knowledgeItems.length,
      lastUpdated: new Date()
    };

    // Cache the result
    this.cache = context;
    await this.saveCache(context);

    return context;
  }

  /**
   * Get relevant knowledge items for a query
   */
  async getRelevantKnowledge(query: string, limit: number = DEFAULT_TOP_K): Promise<KnowledgeItem[]> {
    const context = await this.loadKnowledgeBase();
    
    if (context.knowledgeItems.length === 0) {
      return [];
    }

    // Simple keyword matching for now
    const queryLower = query.toLowerCase();
    const scoredItems = context.knowledgeItems.map(item => ({
      item,
      score: this.calculateRelevanceScore(item, queryLower)
    }));

    // Sort by relevance score and return top items
    return scoredItems
      .filter(scored => scored.score >= MIN_RELEVANCE_SCORE)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(scored => scored.item);
  }

  /**
   * Build context string for Gemini prompt
   */
  async buildContextString(query: string): Promise<string> {
    const relevantItems = await this.getRelevantKnowledge(query, 3);
    
    if (relevantItems.length === 0) {
      return this.getDefaultContext();
    }

    const contextParts = relevantItems.map(item => 
      `[${item.category.toUpperCase()}] ${item.title}\n${item.content}`
    );

    return contextParts.join('\n\n');
  }

  /**
   * Add new knowledge item
   */
  async addKnowledgeItem(
    title: string, 
    content: string, 
    category: string = 'general',
    filename?: string
  ): Promise<void> {
    const safeFilename = filename || this.generateFilename(title);
    const filePath = path.join(this.knowledgeBaseDir, safeFilename);
    
    const formattedContent = this.formatContent(title, content, category);
    await fs.promises.writeFile(filePath, formattedContent, 'utf-8');
    
    // Clear cache to force reload
    this.cache = null;
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<string[]> {
    const context = await this.loadKnowledgeBase();
    const categories = new Set(context.knowledgeItems.map(item => item.category));
    return Array.from(categories).sort();
  }

  /**
   * Search knowledge base
   */
  async search(query: string): Promise<KnowledgeItem[]> {
    return this.getRelevantKnowledge(query, 10);
  }

  private isValidFile(filename: string): boolean {
    const validExtensions = ['.txt', '.md', '.json'];
    return validExtensions.some(ext => filename.endsWith(ext)) && 
           !filename.startsWith('.') && 
           filename !== '.rag_cache.json';
  }

  private parseFile(filename: string, content: string, lastModified: Date): KnowledgeItem {
    const id = path.basename(filename, path.extname(filename));
    const category = this.extractCategory(filename, content);
    const title = this.extractTitle(filename, content);
    
    return {
      id,
      title,
      content: content.trim(),
      source: filename,
      category,
      lastModified
    };
  }

  private extractCategory(filename: string, content: string): string {
    // Try to extract category from filename
    if (filename.includes('_')) {
      return filename.split('_')[0];
    }
    
    // Try to extract from content
    const categoryMatch = content.match(/^#\s*([^#\n]+)/m);
    if (categoryMatch) {
      return categoryMatch[1].toLowerCase().trim();
    }
    
    return 'general';
  }

  private extractTitle(filename: string, content: string): string {
    // Try to extract title from content
    const titleMatch = content.match(/^#\s*([^#\n]+)/m);
    if (titleMatch) {
      return titleMatch[1].trim();
    }
    
    // Use filename as title
    return path.basename(filename, path.extname(filename))
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  private calculateRelevanceScore(item: KnowledgeItem, query: string): number {
    let score = 0;
    const text = `${item.title} ${item.content} ${item.category}`.toLowerCase();
    
    // Title matches get higher score
    if (item.title.toLowerCase().includes(query)) score += 3;
    
    // Content matches
    const contentMatches = (item.content.toLowerCase().match(new RegExp(query, 'g')) || []).length;
    score += contentMatches;
    
    // Category matches
    if (item.category.toLowerCase().includes(query)) score += 2;
    
    // Keyword density
    const words = query.split(' ');
    words.forEach(word => {
      if (text.includes(word)) score += 1;
    });
    
    return score;
  }

  private formatContent(title: string, content: string, category: string): string {
    return `# ${title}\n\n**Thể loại:** ${category}\n\n${content}`;
  }

  private generateFilename(title: string): string {
    const safeTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50);
    
    return `${safeTitle}.txt`;
  }

  private getDefaultContext(): string {
    return `Câu lạc bộ Công nghệ – Tài chính (FTC) là một câu lạc bộ sinh viên tại UEL.
Mục tiêu: Phát triển kỹ năng về công nghệ tài chính và fintech.
Hoạt động: Tổ chức các workshop, seminar, hackathon về fintech.
Thành viên: Sinh viên quan tâm đến lĩnh vực fintech và công nghệ tài chính.`;
  }

  private createEmptyContext(): RAGContext {
    return {
      knowledgeItems: [],
      totalItems: 0,
      lastUpdated: new Date()
    };
  }

  private isCacheValid(): boolean {
    if (!this.cache) return false;
    const now = Date.now();
    const cacheTime = this.cache.lastUpdated.getTime();
    return (now - cacheTime) < this.cacheTimeout;
  }

  private async saveCache(context: RAGContext): Promise<void> {
    try {
      await fs.promises.writeFile(
        this.cacheFile, 
        JSON.stringify(context, null, 2), 
        'utf-8'
      );
    } catch (e) {
      console.warn('Failed to save cache:', e);
    }
  }
}

export const ragSystem = new RAGSystem();
