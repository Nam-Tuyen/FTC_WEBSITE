import { NextResponse } from 'next/server'
import { forumDB } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    const result = await forumDB.toggleLikeReply(id)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error toggling reply like:', error)
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to toggle reply like' }, { status: 500 })
  }
}
