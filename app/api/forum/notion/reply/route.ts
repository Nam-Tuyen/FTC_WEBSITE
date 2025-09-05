import { NextRequest, NextResponse } from 'next/server'
import { createNotionReply } from '@/lib/notion'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const cloned = (req as any).clone ? (req as any).clone() : req
    const body = await cloned.json()
    const { questionPageId, content, authorName, authorId } = body || {}

    if (!questionPageId || !content) return NextResponse.json({ error: 'Thiếu tham số' }, { status: 400 })

    const replyId = await createNotionReply({
      questionPageId,
      content,
      authorName: authorName || 'Ẩn danh',
      authorId: authorId || 'unknown',
    })

    return NextResponse.json({ ok: true, replyId })
  } catch (e: any) {
    console.error('Notion reply API error:', e)
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}
