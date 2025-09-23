/**
 * Utility functions for formatting data
 */

/**
 * Format timestamp to Vietnamese time format
 */
export function formatTime(timestamp?: number): string {
  if (!timestamp) return ""
  
  const date = new Date(timestamp)
  return date.toLocaleTimeString('vi-VN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

/**
 * Format message content for display (convert newlines to HTML breaks)
 */
export function formatMessageContent(content: string): string {
  return content.replace(/\n/g, "<br/>")
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + "..."
}

/**
 * Generate unique ID for messages
 */
export function generateMessageId(): string {
  return crypto.randomUUID()
}

/**
 * Normalize text for search/comparison (remove accents, lowercase)
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

/**
 * Check if message content indicates typing
 */
export function isTypingMessage(content: string): boolean {
  return content === "Đang suy nghĩ..." || content.includes("đang suy nghĩ")
}

/**
 * Format large numbers for display (1k, 1M, etc.)
 */
export function formatNumber(num: number): string {
  if (num < 1000) return num.toString()
  if (num < 1000000) return (num / 1000).toFixed(1) + "k"
  return (num / 1000000).toFixed(1) + "M"
}
