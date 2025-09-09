export const CATEGORIES = {
  CLUB: 'Câu lạc bộ',
  FINTECH: 'Công nghệ Tài chính',
  CAREER: 'Nghề nghiệp',
  STUDY: 'Học tập',
  GENERAL: 'Chung',
} as const

export const STORAGE_KEYS = {
  userId: 'ftc-forum-user-id',
  studentId: 'ftc-forum-student-id',
  questions: 'ftc-forum-questions'
} as const

export type ForumCategory = keyof typeof CATEGORIES

export interface QuestionItem {
  id: string
  title: string
  content: string
  createdAt: number
  category: ForumCategory
  studentId?: string
  userId: string
  likes: string[]
  replies: Reply[]
}

export interface Reply {
  id: string
  content: string
  createdAt: number
  studentId?: string
  userId: string
  likes: string[]
}