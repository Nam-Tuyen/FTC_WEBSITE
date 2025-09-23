import { ChatMode } from "../types/chat"

/**
 * Chat Mode Configurations
 */
export const CHAT_MODES: Array<{
  mode: ChatMode
  label: string
  description: string
  gradient: string
  lightGradient: string
  icon: string
}> = [
  {
    mode: "club",
    label: "Hỏi về câu lạc bộ",
    description: "Ưu tiên FAQ FTC; ngoài danh sách dùng Gemini (vai cố vấn tân sinh viên).",
    gradient: "bg-gradient-to-r from-[#003663] to-[#0e1117]",
    lightGradient: "bg-gradient-to-br from-[#003663]/10 via-[#1a5490]/5 to-[#0e1117]/10",
    icon: "👥",
  },
  {
    mode: "industry",
    label: "Hỏi về ngành",
    description: "Tổng hợp từ Google (API thật hoặc mô phỏng), có trích nguồn ngắn gọn.",
    gradient: "bg-gradient-to-r from-[#0e1117] to-[#003663]",
    lightGradient: "bg-gradient-to-r from-[#003663]/10 via-[#1a5490]/5 to-[#0e1117]/10",
    icon: "📚",
  },
]

/**
 * Suggested Questions for Quick Chat
 */
export const SUGGESTED_QUESTIONS = [
  "Câu lạc bộ có những hoạt động gì?",
  "Làm thế nào để tham gia câu lạc bộ?",
  "Các ban trong câu lạc bộ làm gì?",
  "Thời gian sinh hoạt diễn ra khi nào?",
  "Cần kỹ năng gì để ứng tuyển?",
  "Câu lạc bộ được thành lập khi nào?",
  "Câu lạc bộ có những thành tích gì?"
]

/**
 * Animation Classes
 */
export const ANIMATIONS = {
  fadeIn: "animate-in fade-in duration-500",
  slideUp: "animate-in slide-in-from-bottom-3",
  slideDown: "animate-in slide-in-from-top-3",
  scaleIn: "animate-in zoom-in-50 duration-300",
}

/**
 * Environment Variables
 */
export const ENV_CONFIG = {
  FTC_WEBSITE: process.env.NEXT_PUBLIC_FTC_WEBSITE || "",
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || "",
}

/**
 * UI Constants
 */
export const UI_CONFIG = {
  CHAT_HEIGHT: {
    DESKTOP: "h-[600px] sm:h-[700px]",
    MOBILE: "h-[500px]"
  },
  WELCOME_SUGGESTIONS_LIMIT: 4,
  SIDEBAR_SUGGESTIONS_LIMIT: 5,
  HISTORY_CONTEXT_LIMIT: 6
} as const
