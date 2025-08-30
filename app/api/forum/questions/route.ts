import { appendForumQuestion } from '@/lib/google-sheets'
import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_CATEGORIES = [
  'Hỏi đáp về câu lạc bộ',
  'Hỏi đáp thông tin về ngành học',
  'Thảo luận',
]

function formatDateSheetTitle(d = new Date()) {
  const y = d.getFullYear()
  const m = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  return `${y}-${m}-${day}`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { studentId, name, title, content, category, questionId } = body || {}

    if (!studentId || !/^K\d{9}$/.test(studentId)) {
      return NextResponse.json({ error: 'MSSV không hợp lệ (định dạng K#########)' }, { status: 400 })
    }
    if (!title || !content) {
      return NextResponse.json({ error: 'Thiếu tiêu đề hoặc nội dung' }, { status: 400 })
    }
    if (!ALLOWED_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: 'Chủ đề không hợp lệ' }, { status: 400 })
    }

    const spreadsheetId = process.env.GOOGLE_SHEET_ID
    if (!spreadsheetId) {
      return NextResponse.json({ error: 'Thiếu cấu hình GOOGLE_SHEET_ID' }, { status: 500 })
    }

    const sheetTitle = formatDateSheetTitle()
    const timestamp = new Date().toISOString()

    await appendForumQuestion({
      spreadsheetId,
      sheetTitle,
      timestamp,
      studentId,
      name: name || '',
      title,
      content,
      category,
      questionId: questionId || '',
    })

    return NextResponse.json({ ok: true, sheetTitle })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unexpected error' }, { status: 500 })
  }
}
