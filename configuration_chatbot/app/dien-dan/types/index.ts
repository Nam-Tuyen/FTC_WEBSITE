export const STORAGE_KEYS = {
  userId: 'ftc-forum-user-id',
  studentId: 'ftc-forum-student-id',
  questions: 'ftc-forum-questions'
} as const

export const CATEGORIES = {
  CLUB: 'Hỏi về câu lạc bộ',
  MAJOR: 'Hỏi về ngành học',
  DISCUSSION: 'Thảo luận'
} as const

export type ForumCategory = keyof typeof CATEGORIES

export interface Reply {
  id: string
  authorId: string
  authorName: string
  content: string
  createdAt: number
}

export interface QuestionItem {
  id: string
  title: string
  content: string
  authorId: string 
  authorName: string
  studentId: string
  category: string
  createdAt: number
  likes: string[]
  replies: Reply[]
}
