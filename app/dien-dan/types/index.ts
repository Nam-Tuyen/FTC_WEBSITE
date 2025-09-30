export const STORAGE_KEYS = {
  userId: 'ftc-forum-user-id',
  studentId: 'ftc-forum-student-id',
  questions: 'ftc-forum-questions'
} as const

export const CATEGORIES = {
  CLUB: 'Câu lạc bộ',
  MAJOR: 'Ngành học',
  DISCUSSION: 'Thảo luận',
} as const

export type ForumCategory = keyof typeof CATEGORIES

export interface Reply {
  id: string
  content: string
  createdAt: number
  studentId?: string
  userId?: string
  likes?: any[]
  authorName?: string
}

export interface QuestionItem {
  id: string
  title: string
  content: string
  createdAt: number | string
  category: ForumCategory
  studentId?: string
  userId?: string
  likes: number | any[]
  replies?: any[]
  repliesCount?: number
  authorName?: string
}
