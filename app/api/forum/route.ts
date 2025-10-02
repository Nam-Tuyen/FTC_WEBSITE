import { NextRequest, NextResponse } from 'next/server'

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwI9EHz05gL9_O_IG6cC-lKApzx-UW8uGdCLt6WAuSGfwzzMO2RDpRImXX5Yo67Vy_oeg/exec"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log the request for debugging
    console.log('=== FORUM API PROXY ===')
    console.log('Request body:', JSON.stringify(body, null, 2))
    
    const response = await fetch(WEB_APP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))

    const data = await response.text()
    console.log('Response data:', data)
    
    try {
      const jsonData = JSON.parse(data)
      console.log('Parsed JSON:', jsonData)
      return NextResponse.json(jsonData)
    } catch (parseError) {
      console.log('Parse error:', parseError)
      return NextResponse.json({
        ok: false,
        message: "Lỗi: Phản hồi từ server không hợp lệ",
        error: data,
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.log('Network error:', error)
    return NextResponse.json({
      ok: false,
      message: "Lỗi kết nối đến server",
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    })
  }
}
