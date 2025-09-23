/**
 * Chat related type definitions
 */

export type ChatMode = "club" | "industry"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  mode?: ChatMode
  ts?: number
  reactions?: {
    likes?: number
    shares?: number
  }
  isLiked?: boolean
  isTyping?: boolean
}

export interface ChatState {
  messages: ChatMessage[]
  selectedMode: ChatMode
  inputValue: string
  isSending: boolean
  showModeChangeNotification: boolean
}

export interface ChatConfig {
  mode: ChatMode
  question: string
  history?: Array<{ role: "user" | "assistant"; content: string }>
}

export interface ChatResponse {
  reply?: string
  response?: string
  text?: string
  answer?: string
}
