import { NextRequest, NextResponse } from 'next/server'

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyCfakaiFBnEQT0DYiyfjTJYxSO0_yZa0MzrsqjbodAI7Ay9i3OtF2zYpXdWibIX6P_Yw/exec"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('=== DEBUG REGISTER API ===')
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
      return NextResponse.json({
        success: true,
        debug: {
          requestBody: body,
          responseStatus: response.status,
          responseData: jsonData
        }
      })
    } catch (parseError) {
      console.log('Parse error:', parseError)
      return NextResponse.json({
        success: false,
        error: 'Parse error',
        debug: {
          requestBody: body,
          responseStatus: response.status,
          responseText: data,
          parseError: parseError instanceof Error ? parseError.message : 'Unknown parse error'
        }
      })
    }
  } catch (error) {
    console.log('Network error:', error)
    return NextResponse.json({
      success: false,
      error: 'Network error',
      debug: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
}
