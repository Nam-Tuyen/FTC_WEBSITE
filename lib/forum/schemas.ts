import { z } from 'zod'

// Forum category enum
export const ForumCategory = z.enum(['CLUB', 'MAJOR', 'DISCUSSION'])

export const QuestionCreate = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(1).max(8000),
  authorName: z.string().min(1).max(80),
  category: ForumCategory.default('DISCUSSION'),
})

export const ReplyCreate = z.object({
  questionId: z.string().uuid(),
  content: z.string().min(1).max(8000),
  authorName: z.string().min(1).max(80)
})

export const LikeToggle = z.object({
  questionId: z.string().uuid(),
  clientId: z.string().min(8).max(120)
})
