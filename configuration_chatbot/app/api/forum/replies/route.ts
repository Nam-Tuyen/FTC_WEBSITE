import { NextResponse } from 'next/server'
import { forumDB } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const questionId = url.searchParams.get('questionId')

  if (!questionId) {
    return NextResponse.json({ error: 'Missing questionId parameter' }, { status: 400 })
  }

  try {
    const replies = await forumDB.getReplies(questionId)
    return NextResponse.json(replies)
  } catch (error) {
    console.error('Error fetching replies:', error)
    return NextResponse.json({ error: 'Failed to fetch replies' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { questionId, studentId, name, content, isAnonymous = false } = body

    if (!studentId || !/^K\d{9}$/.test(studentId)) {
      return NextResponse.json({ error: 'MSSV không hợp lệ (định dạng K#########)' }, { status: 400 })
    }
    if (!content) {
      return NextResponse.json({ error: 'Thiếu nội dung' }, { status: 400 })
    }
    if (!questionId) {
      return NextResponse.json({ error: 'Missing questionId' }, { status: 400 })
    }

    const reply = await forumDB.createReply({
      questionId,
      content,
      studentId,
      authorName: name,
      isAnonymous
    })

    return NextResponse.json(reply)
  } catch (error: any) {
    console.error('Error creating reply:', error)
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to create reply' }, { status: 500 })
  }
}
