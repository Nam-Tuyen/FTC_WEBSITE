/**
 * Centralized exports for all type definitions
 */

// Chat related types
export type { 
  ChatMode, 
  ChatMessage, 
  ChatState, 
  ChatConfig, 
  ChatResponse 
} from './chat'

// Component types (for better organization)
export interface MessageBubbleProps {
  message: ChatMessage
}

export interface TypingIndicatorProps {
  className?: string
}

export interface ModeSelectorProps {
  selectedMode: ChatMode
  onModeChange: (mode: ChatMode) => void
  showNotification?: boolean
}

export interface SuggestedQuestionsProps {
  questions: string[]
  onQuestionSelect: (question: string) => void
  isExpanded?: boolean
  onToggleExpand?: () => void
}

export interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: (message?: string) => void
  disabled?: boolean
  placeholder?: string
}

// Utility types
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type ClassNameProp = { className?: string }
