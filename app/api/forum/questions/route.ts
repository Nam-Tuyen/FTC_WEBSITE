import { NextResponse } from 'next/server';
import { forumDB } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const ALLOWED_CATEGORIES = [
  'GENERAL',
  'KNOWLEDGE',
  'CAREER',
  'TECHNICAL',
  'EXPERIENCE',
  'OTHER'
] as const;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get('category') as typeof ALLOWED_CATEGORIES[number] | null;
  const search = url.searchParams.get('search');

  try {
    const questions = await forumDB.getQuestions()
    return NextResponse.json(questions)
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { studentId, name, title, content, category, isAnonymous = false } = body

    if (!studentId || !/^K\d{9}$/.test(studentId)) {
      return NextResponse.json({ error: 'MSSV không hợp lệ (định dạng K#########)' }, { status: 400 })
    }
    if (!title || !content) {
      return NextResponse.json({ error: 'Thiếu tiêu đề hoặc nội dung' }, { status: 400 })
    }
    if (!ALLOWED_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: 'Chủ đề không hợp lệ' }, { status: 400 })
    }

    const question = await forumDB.createQuestion({
      title,
      content,
      category,
      studentId,
      authorName: name,
      isAnonymous
    })

    return NextResponse.json(question)
  } catch (error: any) {
    console.error('Error creating question:', error)
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 })
  }
}
