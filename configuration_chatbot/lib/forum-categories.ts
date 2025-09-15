import { CATEGORIES, ForumCategory } from '@/app/dien-dan/types'

export const FORUM_CATEGORIES = {
  CLUB: 'Hỏi về câu lạc bộ',
  MAJOR: 'Hỏi về ngành học',
  DISCUSSION: 'Thảo luận'
} as const

export const mapCategory = (category: string): ForumCategory => {
  switch (category.toUpperCase()) {
    case 'CLUB':
    case 'HỎI VỀ CÂU LẠC BỘ':
      return 'CLUB'
    case 'MAJOR':
    case 'HỎI VỀ NGÀNH HỌC':
      return 'STUDY'
    case 'DISCUSSION':
    case 'THẢO LUẬN':
      return 'GENERAL'
    default:
      return 'GENERAL'
  }
}
