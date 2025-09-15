import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null

// Forum categories
export type ForumCategory = 'CLUB' | 'MAJOR' | 'DISCUSSION'

export const CATEGORIES = {
  CLUB: 'CLUB' as ForumCategory,
  MAJOR: 'MAJOR' as ForumCategory,
  DISCUSSION: 'DISCUSSION' as ForumCategory
} as const

export interface ForumQuestion {
  id: string
  title: string
  content: string
  author: string
  created_at: string
  updated_at: string
  category: ForumCategory
  likes: number
  replies_count: number
  student_id: string
  is_anonymous: boolean
}

export interface ForumReply {
  id: string
  question_id: string
  content: string
  author: string
  created_at: string
  updated_at: string
  likes: number
  is_anonymous: boolean
  student_id: string
}

export const forumDB = {
  async getQuestions() {
    const { data, error } = await supabase
      .from('questions')
      .select('*, author:profiles(display_name, avatar_url)')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getQuestionById(id: string) {
    const { data, error } = await supabase
      .from('questions')
      .select('*, author:profiles(display_name, avatar_url)')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async createQuestion({ title, content, category, studentId, authorName, isAnonymous = false }: {
    title: string
    content: string
    category: ForumQuestion['category']
    studentId: string
    authorName: string
    isAnonymous?: boolean
  }) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data, error } = await supabase
      .rpc('add_question', {
        p_title: title,
        p_content: content,
        p_category: category,
        p_is_anonymous: isAnonymous,
        p_student_id: studentId
      })
    
    if (error) throw error
    return data
  },

  async getReplies(questionId: string) {
    const { data, error } = await supabase
      .from('replies')
      .select('*, author:profiles(display_name, avatar_url)')
      .eq('question_id', questionId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data
  },

  async createReply({ questionId, content, studentId, authorName, isAnonymous = false }: {
    questionId: string
    content: string
    studentId: string
    authorName: string
    isAnonymous?: boolean
  }) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data, error } = await supabase
      .rpc('add_reply', {
        p_question_id: questionId,
        p_content: content,
        p_is_anonymous: isAnonymous
      })
    
    if (error) throw error
    return data
  },

  async toggleLikeQuestion(questionId: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data, error } = await supabase
      .rpc('toggle_like_question', {
        qid: questionId
      })
    
    if (error) throw error
    return data
  },

  async toggleLikeReply(replyId: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data, error } = await supabase
      .rpc('toggle_like_reply', {
        rid: replyId
      })
    
    if (error) throw error
    return data
  }
}
