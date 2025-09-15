import fs from 'node:fs';
import path from 'node:path';
import { watch } from 'node:fs';

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  lastUpdated: Date;
  filePath: string;
  fileType: 'md' | 'json' | 'txt';
}

export interface KnowledgeStats {
  totalItems: number;
  categories: Record<string, number>;
  lastUpdated: Date;
}

class KnowledgeManager {
  private knowledgeBase: Map<string, KnowledgeItem> = new Map();
  private watcherActive = false;
  private readonly KNOWLEDGE_DIRS = [
    path.join(process.cwd(), 'knowledge_base'),
    path.join(process.cwd(), 'backend', 'data', 'knowledge_base')
  ];

  constructor() {
    this.loadAllKnowledge();
    this.startWatcher();
  }

  /**
   * Load tất cả kiến thức từ các thư mục
   */
  async loadAllKnowledge(): Promise<void> {
    console.log('🔄 Loading knowledge base...');
    this.knowledgeBase.clear();

    for (const dir of this.KNOWLEDGE_DIRS) {
      if (fs.existsSync(dir)) {
        await this.loadFromDirectory(dir);
      }
    }

    console.log(`✅ Loaded ${this.knowledgeBase.size} knowledge items`);
  }

  /**
   * Load kiến thức từ một thư mục cụ thể
   */
  private async loadFromDirectory(dirPath: string): Promise<void> {
    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          // Recursively load subdirectories
          await this.loadFromDirectory(fullPath);
        } else if (entry.isFile()) {
          const item = await this.processFile(fullPath);
          if (item) {
            this.knowledgeBase.set(item.id, item);
          }
        }
      }
    } catch (error) {
      console.error(`Error loading from ${dirPath}:`, error);
    }
  }

  /**
   * Xử lý từng file và tạo KnowledgeItem
   */
  private async processFile(filePath: string): Promise<KnowledgeItem | null> {
    try {
      const ext = path.extname(filePath).toLowerCase();
      const relativePath = path.relative(process.cwd(), filePath);
      const stats = fs.statSync(filePath);

      // Skip non-knowledge files
      if (!['.md', '.json', '.txt'].includes(ext)) {
        return null;
      }

      // Skip README and template files from processing
      const fileName = path.basename(filePath, ext).toLowerCase();
      if (fileName === 'readme' || filePath.includes('templates/')) {
        return null;
      }

      const content = fs.readFileSync(filePath, 'utf-8');
      let item: KnowledgeItem;

      switch (ext) {
        case '.md':
          item = this.processMarkdown(content, filePath, relativePath, stats.mtime);
          break;
        case '.json':
          item = this.processJSON(content, filePath, relativePath, stats.mtime);
          break;
        case '.txt':
          item = this.processText(content, filePath, relativePath, stats.mtime);
          break;
        case '.py':
          item = this.processPython(content, filePath, relativePath, stats.mtime);
          break;
        default:
          return null;
      }

      return item;
    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Xử lý file Markdown
   */
  private processMarkdown(content: string, filePath: string, relativePath: string, mtime: Date): KnowledgeItem {
    const lines = content.split('\n');
    let title = path.basename(filePath, '.md');
    const tags: string[] = [];

    // Extract title from first # heading
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('# ')) {
        title = trimmed.substring(2).trim();
        break;
      }
    }

    // Extract tags from content
    const tagMatches = content.match(/#[\w-]+/g);
    if (tagMatches) {
      tags.push(...tagMatches.map(tag => tag.substring(1)));
    }

    // Determine category from path
    const pathParts = relativePath.split(path.sep);
    const category = pathParts.length > 2 ? pathParts[1] : 'general';

    return {
      id: this.generateId(relativePath),
      title,
      content: content.trim(),
      category,
      tags,
      lastUpdated: mtime,
      filePath: relativePath,
      fileType: 'md'
    };
  }

  /**
   * Xử lý file JSON
   */
  private processJSON(content: string, filePath: string, relativePath: string, mtime: Date): KnowledgeItem {
    try {
      const data = JSON.parse(content);
      const pathParts = relativePath.split(path.sep);
      const defaultCategory = pathParts.length > 2 ? pathParts[1] : 'general';

      return {
        id: this.generateId(relativePath),
        title: data.title || path.basename(filePath, '.json'),
        content: data.content || JSON.stringify(data, null, 2),
        category: data.category || defaultCategory,
        tags: Array.isArray(data.tags) ? data.tags : [],
        lastUpdated: data.lastUpdated ? new Date(data.lastUpdated) : mtime,
        filePath: relativePath,
        fileType: 'json'
      };
    } catch (error) {
      // If JSON parsing fails, treat as text
      return this.processText(content, filePath, relativePath, mtime);
    }
  }

  /**
   * Xử lý file Text
   */
  private processText(content: string, filePath: string, relativePath: string, mtime: Date): KnowledgeItem {
    const lines = content.split('\n');
    let title = path.basename(filePath, '.txt');
    let category = 'general';
    const tags: string[] = [];

    // Try to extract structured info from text
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('Tiêu đề:') || trimmed.startsWith('Title:')) {
        title = trimmed.split(':')[1]?.trim() || title;
      } else if (trimmed.startsWith('Danh mục:') || trimmed.startsWith('Category:')) {
        category = trimmed.split(':')[1]?.trim() || category;
      }
    }

    const pathParts = relativePath.split(path.sep);
    if (pathParts.length > 2) {
      category = pathParts[1];
    }

    return {
      id: this.generateId(relativePath),
      title,
      content: content.trim(),
      category,
      tags,
      lastUpdated: mtime,
      filePath: relativePath,
      fileType: 'txt'
    };
  }

  /**
   * Xử lý file Python (backward compatibility)
   */
  private processPython(content: string, filePath: string, relativePath: string, mtime: Date): KnowledgeItem {
    // Extract docstrings and comments
    const docstrings: string[] = [];
    const tripleQuoteRegex = /"""([\s\S]*?)"""/g;
    let match;

    while ((match = tripleQuoteRegex.exec(content)) !== null) {
      const docstring = match[1].trim();
      if (docstring.length > 20) {
        docstrings.push(docstring);
      }
    }

    const extractedContent = docstrings.join('\n\n') || content;
    const pathParts = relativePath.split(path.sep);
    const category = pathParts.length > 3 ? pathParts[2] : 'general';

    return {
      id: this.generateId(relativePath),
      title: path.basename(filePath, '.py'),
      content: extractedContent.trim(),
      category,
      tags: ['python', 'legacy'],
      lastUpdated: mtime,
      filePath: relativePath,
      fileType: 'txt'
    };
  }

  /**
   * Tạo ID duy nhất từ file path
   */
  private generateId(filePath: string): string {
    return filePath.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  }

  /**
   * Lấy tất cả kiến thức
   */
  getAllKnowledge(): KnowledgeItem[] {
    return Array.from(this.knowledgeBase.values());
  }

  /**
   * Tìm kiếm kiến thức
   */
  search(query: string, category?: string): KnowledgeItem[] {
    const searchTerm = query.toLowerCase();
    const items = Array.from(this.knowledgeBase.values());

    return items.filter(item => {
      const matchesQuery = 
        item.title.toLowerCase().includes(searchTerm) ||
        item.content.toLowerCase().includes(searchTerm) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm));

      const matchesCategory = !category || item.category === category;

      return matchesQuery && matchesCategory;
    });
  }

  /**
   * Lấy kiến thức theo category
   */
  getByCategory(category: string): KnowledgeItem[] {
    return Array.from(this.knowledgeBase.values())
      .filter(item => item.category === category);
  }

  /**
   * Lấy thống kê
   */
  getStats(): KnowledgeStats {
    const items = Array.from(this.knowledgeBase.values());
    const categories: Record<string, number> = {};

    items.forEach(item => {
      categories[item.category] = (categories[item.category] || 0) + 1;
    });

    const lastUpdated = items.reduce((latest, item) => 
      item.lastUpdated > latest ? item.lastUpdated : latest, 
      new Date(0)
    );

    return {
      totalItems: items.length,
      categories,
      lastUpdated
    };
  }

  /**
   * Lấy nội dung đã format cho chatbot
   */
  getFormattedContent(): string {
    const items = this.getAllKnowledge();
    const sections: string[] = [];

    // Group by category
    const byCategory: Record<string, KnowledgeItem[]> = {};
    items.forEach(item => {
      if (!byCategory[item.category]) {
        byCategory[item.category] = [];
      }
      byCategory[item.category].push(item);
    });

    // Format each category
    Object.entries(byCategory).forEach(([category, categoryItems]) => {
      sections.push(`\n=== ${category.toUpperCase()} ===`);
      
      categoryItems.forEach(item => {
        sections.push(`\n--- ${item.title} ---`);
        sections.push(item.content);
      });
    });

    return sections.join('\n');
  }

  /**
   * Bắt đầu theo dõi thay đổi file
   */
  private startWatcher(): void {
    if (this.watcherActive) return;

    this.KNOWLEDGE_DIRS.forEach(dir => {
      if (fs.existsSync(dir)) {
        watch(dir, { recursive: true }, (eventType, filename) => {
          if (filename && (filename.endsWith('.md') || filename.endsWith('.json') || filename.endsWith('.txt'))) {
            console.log(`📝 Knowledge file changed: ${filename}`);
            // Debounce reload
            setTimeout(() => this.loadAllKnowledge(), 1000);
          }
        });
      }
    });

    this.watcherActive = true;
    console.log('👁️ Knowledge watcher started');
  }

  /**
   * Thêm kiến thức mới từ API
   */
  async addKnowledge(data: {
    title: string;
    content: string;
    category: string;
    tags?: string[];
    fileType?: 'md' | 'json' | 'txt';
  }): Promise<KnowledgeItem> {
    const { title, content, category, tags = [], fileType = 'md' } = data;
    
    // Create filename from title
    const filename = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);

    const categoryDir = path.join(process.cwd(), 'knowledge_base', category);
    const filePath = path.join(categoryDir, `${filename}.${fileType}`);

    // Ensure directory exists
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }

    // Format content based on file type
    let fileContent: string;
    switch (fileType) {
      case 'md':
        fileContent = `# ${title}\n\n${content}\n\n#${tags.join(' #')}`;
        break;
      case 'json':
        fileContent = JSON.stringify({
          title,
          content,
          category,
          tags,
          lastUpdated: new Date().toISOString()
        }, null, 2);
        break;
      case 'txt':
        fileContent = `Tiêu đề: ${title}\nDanh mục: ${category}\nNội dung:\n${content}`;
        break;
      default:
        fileContent = content;
    }

    // Write file
    fs.writeFileSync(filePath, fileContent, 'utf-8');

    // Process and add to memory
    const item = await this.processFile(filePath);
    if (item) {
      this.knowledgeBase.set(item.id, item);
      return item;
    }

    throw new Error('Failed to create knowledge item');
  }
}

// Singleton instance
export const knowledgeManager = new KnowledgeManager();
export default knowledgeManager;