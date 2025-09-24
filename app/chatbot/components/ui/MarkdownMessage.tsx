import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { BRAND } from '../../constants'

/**
 * Normalize markdown stars to prevent display of unmatched **
 */
function normalizeMarkdownStars(s: string): string {
  // Xử lý markdown stars để tránh hiển thị dấu ** không hợp lệ
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
 * MarkdownMessage Component
 * Renders markdown content with proper styling and link handling
 */
export function MarkdownMessage({ text }: { text: string }) {
  const normalizedText = normalizeMarkdownStars(text)
  
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
        strong: ({ children }) => (
          <strong className="font-bold text-white" style={{ fontWeight: '700' }}>
            {children}
          </strong>
        ),
        em: ({ children }) => (
          <em className="italic text-gray-300" style={{ fontStyle: 'italic' }}>
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
          <p className="mb-2 last:mb-0 text-sm leading-relaxed">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-sm leading-relaxed">{children}</li>
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
          <h1 className="text-lg font-bold text-white mb-2" style={{ fontWeight: '700' }}>
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-base font-bold text-white mb-2" style={{ fontWeight: '700' }}>
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-bold text-white mb-1" style={{ fontWeight: '700' }}>
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
