import { NextRequest, NextResponse } from 'next/server'
import { createQuestion, fetchQuestions } from '../../../../googleSheetApi/sheet'

export async function GET() {
  try {
    const questions = await fetchQuestions({})
    return NextResponse.json(questions)
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await createQuestion(body)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating question:', error)
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 })
  }
}
