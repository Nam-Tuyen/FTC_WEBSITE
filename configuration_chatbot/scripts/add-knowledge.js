#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Script để thêm thông tin mới vào knowledge base
// Sử dụng: node scripts/add-knowledge.js

const knowledgeDir = path.join(__dirname, '..', 'backend', 'data', 'knowledge_base');

function addKnowledge(title, content, category = 'general', filename = null) {
  try {
    // Tạo thư mục nếu chưa có
    if (!fs.existsSync(knowledgeDir)) {
      fs.mkdirSync(knowledgeDir, { recursive: true });
    }

    // Tạo filename nếu không có
    if (!filename) {
      filename = title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 50) + '.txt';
    }

    // Đảm bảo có extension
    if (!filename.endsWith('.txt')) {
      filename += '.txt';
    }

    const filePath = path.join(knowledgeDir, filename);
    
    // Format content
    const formattedContent = `# ${title}\n\n**Thể loại:** ${category}\n\n${content}`;
    
    // Ghi file
    fs.writeFileSync(filePath, formattedContent, 'utf-8');
    
    console.log(`✅ Đã thêm thông tin: ${title}`);
    console.log(`📁 File: ${filename}`);
    console.log(`📂 Thể loại: ${category}`);
    console.log(`📄 Nội dung: ${content.substring(0, 100)}...`);
    
    return true;
  } catch (error) {
    console.error('❌ Lỗi khi thêm thông tin:', error.message);
    return false;
  }
}

// Ví dụ sử dụng
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log(`
📚 Script thêm thông tin vào Knowledge Base

Cách sử dụng:
  node scripts/add-knowledge.js "Tiêu đề" "Nội dung" [thể_loại] [tên_file]

Ví dụ:
  node scripts/add-knowledge.js "Lịch hoạt động" "Thứ 3: Workshop Blockchain\\nThứ 5: Seminar Fintech" "schedule"
  node scripts/add-knowledge.js "Quy định" "Các quy định của câu lạc bộ..." "rules" "quy_dinh.txt"
    `);
    process.exit(1);
  }

  const [title, content, category = 'general', filename] = args;
  addKnowledge(title, content, category, filename);
}

module.exports = { addKnowledge };
