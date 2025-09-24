import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { BRAND } from '../../constants'

/**
 * Normalize markdown stars to prevent display of unmatched **
 */
function normalizeMarkdownStars(s: string): string {
  // 1) Giữ nguyên các cặp **bold** hợp lệ
  // 2) Với dấu * đơn lẻ dùng cho italic: nếu không đủ cặp thì chuyển sang plain text (loại bỏ *)
  // 3) Với ** lẻ: chuyển chúng thành ký tự thường (thoát ra) để không hiển thị sao trong UI

  // Bước nhẹ nhàng: nếu số lượng ** là số lẻ, thay thế ** lẻ bằng ký tự trống
  const doubleStarCount = (s.match(/\*\*/g) || []).length
  let out = s
  if (doubleStarCount % 2 === 1) {
    // thay thế ** đầu tiên không tạo thành cặp thành rỗng
    out = out.replace(/\*\*/, "")
  }

  // (tuỳ chọn) loại bỏ * đơn lẻ không tạo thành cặp italic
  // Cách đơn giản: nếu tổng số * (không tính ** đã xử lý) là lẻ -> bỏ 1 dấu *
  const singleStars = (out.match(/(?<!\*)\*(?!\*)/g) || []).length
  if (singleStars % 2 === 1) {
    out = out.replace(/(?<!\*)\*(?!\*)/, "") // bỏ một dấu * đơn lẻ
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
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        strong: ({ children }) => (
          <strong className="font-bold text-white">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-gray-300">{children}</em>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-blue-400 underline underline-offset-2 hover:text-blue-300 transition-colors"
          >
            {children}
          </a>
        ),
        p: ({ children }) => (
          <p className="mb-2 last:mb-0">{children}</p>
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
          <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 text-xs">
            {children}
          </code>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-blue-400 pl-4 my-2 italic text-gray-300">
            {children}
          </blockquote>
        ),
        h1: ({ children }) => (
          <h1 className="text-lg font-bold text-white mb-2">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-base font-bold text-white mb-2">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-bold text-white mb-1">{children}</h3>
        ),
      }}
    >
      {normalizedText}
    </ReactMarkdown>
  )
}
