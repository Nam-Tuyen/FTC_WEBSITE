export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export interface ChatState {
  messages: Message[]
  isTyping: boolean
  error?: string
}

export interface SuggestedQuestion {
  id: string
  text: string
  category: string
}
