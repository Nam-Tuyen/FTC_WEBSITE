import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { BRAND } from '../../constants'

/**
 * Normalize markdown stars to prevent display of unmatched **
 * If text contains ***, reprocess entire content for proper formatting
 */
function normalizeMarkdownStars(s: string): string {
  // Nếu có dấu ***, xử lý lại toàn bộ nội dung
  if (s.includes('***')) {
    console.log('Detected *** in text, reprocessing entire content...')
    
    // Xử lý *** thành ** (bold) - giả sử *** là lỗi của **
    let out = s.replace(/\*\*\*/g, '**')
    
    // Xử lý lại toàn bộ markdown formatting
    out = processMarkdownFormatting(out)
    
    return out
  }
  
  // Xử lý markdown stars bình thường để tránh hiển thị dấu ** không hợp lệ
  let out = s
  
  // Bước 1: Xử lý ** lẻ (không tạo thành cặp)
  const doubleStarCount = (out.match(/\*\*/g) || []).length
  if (doubleStarCount % 2 === 1) {
    // Tìm và loại bỏ ** lẻ đầu tiên
    out = out.replace(/\*\*/, "")
  }
  
  // Bước 2: Xử lý * đơn lẻ (không tạo thành cặp italic)
  // Đếm số * không nằm trong **
  let singleStarCount = 0
  let inDoubleStar = false
  
  for (let i = 0; i < out.length; i++) {
    if (out[i] === '*' && out[i + 1] === '*') {
      inDoubleStar = true
      i++ // Skip next *
    } else if (out[i] === '*' && !inDoubleStar) {
      singleStarCount++
    } else if (out[i] === '*' && inDoubleStar) {
      inDoubleStar = false
    }
  }
  
  // Nếu số * đơn lẻ là lẻ, loại bỏ một dấu *
  if (singleStarCount % 2 === 1) {
    let removed = false
    for (let i = 0; i < out.length && !removed; i++) {
      if (out[i] === '*' && out[i + 1] !== '*') {
        out = out.substring(0, i) + out.substring(i + 1)
        removed = true
      }
    }
  }
  
  return out
}

/**
 * Process markdown formatting for entire content
 */
function processMarkdownFormatting(s: string): string {
  let out = s
  
  // 1. Xử lý *** thành ** (bold)
  out = out.replace(/\*\*\*/g, '**')
  
  // 2. Xử lý ** lẻ (không tạo thành cặp)
  const doubleStarCount = (out.match(/\*\*/g) || []).length
  if (doubleStarCount % 2 === 1) {
    out = out.replace(/\*\*/, "")
  }
  
  // 3. Xử lý * đơn lẻ (không tạo thành cặp italic)
  let singleStarCount = 0
  let inDoubleStar = false
  
  for (let i = 0; i < out.length; i++) {
    if (out[i] === '*' && out[i + 1] === '*') {
      inDoubleStar = true
      i++ // Skip next *
    } else if (out[i] === '*' && !inDoubleStar) {
      singleStarCount++
    } else if (out[i] === '*' && inDoubleStar) {
      inDoubleStar = false
    }
  }
  
  // Nếu số * đơn lẻ là lẻ, loại bỏ một dấu *
  if (singleStarCount % 2 === 1) {
    let removed = false
    for (let i = 0; i < out.length && !removed; i++) {
      if (out[i] === '*' && out[i + 1] !== '*') {
        out = out.substring(0, i) + out.substring(i + 1)
        removed = true
      }
    }
  }
  
  // 4. Xử lý các lỗi formatting khác
  // Loại bỏ các dấu * đơn lẻ không hợp lệ
  out = out.replace(/(?<!\*)\*(?!\*)/g, '')
  
  // 5. Đảm bảo ** được đóng đúng cách
  const openBold = (out.match(/\*\*/g) || []).length
  if (openBold % 2 === 1) {
    out = out.replace(/\*\*/, '')
  }
  
  console.log('Processed markdown formatting:', out.substring(0, 100) + '...')
  
  return out
}

/**
 * Convert @https://... format to clickable links
 */
function processAtLinks(s: string): string {
  // Convert @https://... to [@https://...](https://...)
  return s.replace(/@(https?:\/\/[^\s\)]+)/g, '[@$1]($1)')
}

/**
 * MarkdownMessage Component
 * Renders markdown content with proper styling and link handling
 */
export function MarkdownMessage({ text }: { text: string }) {
  const normalizedText = processAtLinks(normalizeMarkdownStars(text))
  
  return (
    <div className="markdown-content" style={{ color: '#ffffff' }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
        strong: ({ children }) => (
          <strong className="font-bold text-white" style={{ fontWeight: '700', color: '#ffffff' }}>
            {children}
          </strong>
        ),
        em: ({ children }) => (
          <em className="italic text-gray-300" style={{ fontStyle: 'italic', color: '#d1d5db' }}>
            {children}
          </em>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-blue-400 underline underline-offset-2 hover:text-blue-300 transition-colors"
            style={{ textDecoration: 'underline' }}
          >
            {children}
          </a>
        ),
        p: ({ children }) => (
          <p className="mb-2 last:mb-0 text-sm leading-relaxed text-white" style={{ color: '#ffffff' }}>{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc pl-5 mb-2 space-y-1 text-white" style={{ color: '#ffffff' }}>{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-5 mb-2 space-y-1 text-white" style={{ color: '#ffffff' }}>{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-sm leading-relaxed text-white" style={{ color: '#ffffff' }}>{children}</li>
        ),
        code: ({ children }) => (
          <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 text-xs font-mono">
            {children}
          </code>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-blue-400 pl-4 my-2 italic text-gray-300">
            {children}
          </blockquote>
        ),
        h1: ({ children }) => (
          <h1 className="text-lg font-bold text-white mb-2" style={{ fontWeight: '700', color: '#ffffff' }}>
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-base font-bold text-white mb-2" style={{ fontWeight: '700', color: '#ffffff' }}>
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-bold text-white mb-1" style={{ fontWeight: '700', color: '#ffffff' }}>
            {children}
          </h3>
        ),
        }}
      >
        {normalizedText}
      </ReactMarkdown>
    </div>
  )
}
