import { NextRequest, NextResponse } from 'next/server'

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyCfakaiFBnEQT0DYiyfjTJYxSO0_yZa0MzrsqjbodAI7Ay9i3OtF2zYpXdWibIX6P_Yw/exec"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const response = await fetch(WEB_APP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.text()
    
    try {
      const jsonData = JSON.parse(data)
      return NextResponse.json(jsonData)
    } catch (parseError) {
      return NextResponse.json({
        ok: false,
        message: "Lỗi: Phản hồi từ server không hợp lệ",
        error: data,
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    return NextResponse.json({
      ok: false,
      message: "Lỗi kết nối đến server",
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    })
  }
}
