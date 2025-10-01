import { NextRequest, NextResponse } from 'next/server'

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyCfakaiFBnEQT0DYiyfjTJYxSO0_yZa0MzrsqjbodAI7Ay9i3OtF2zYpXdWibIX6P_Yw/exec"

export async function GET() {
  try {
    console.log('=== TESTING GOOGLE APPS SCRIPT ===')
    console.log('URL:', WEB_APP_URL)
    
    // Test with a simple request
    const testPayload = {
      function: 'test',
      body: { message: 'Hello from Next.js' }
    }
    
    console.log('Sending test payload:', JSON.stringify(testPayload, null, 2))
    
    const response = await fetch(WEB_APP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))

    const data = await response.text()
    console.log('Raw response:', data)
    
    return NextResponse.json({
      success: true,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      data: data,
      url: WEB_APP_URL
    })
  } catch (error) {
    console.log('Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      url: WEB_APP_URL
    })
  }
}
