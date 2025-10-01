import { NextRequest, NextResponse } from 'next/server'

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyCfakaiFBnEQT0DYiyfjTJYxSO0_yZa0MzrsqjbodAI7Ay9i3OtF2zYpXdWibIX6P_Yw/exec"

export async function GET() {
  try {
    console.log('=== TESTING GOOGLE APPS SCRIPT SIMPLE ===')
    console.log('URL:', WEB_APP_URL)
    
    // Test 1: Simple GET request
    console.log('Testing GET request...')
    const getResponse = await fetch(WEB_APP_URL, {
      method: 'GET',
    })
    
    console.log('GET Response status:', getResponse.status)
    const getData = await getResponse.text()
    console.log('GET Response data:', getData)
    
    // Test 2: Simple POST request
    console.log('Testing POST request...')
    const postResponse = await fetch(WEB_APP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        function: 'test',
        body: { message: 'Hello from Next.js' }
      }),
    })
    
    console.log('POST Response status:', postResponse.status)
    const postData = await postResponse.text()
    console.log('POST Response data:', postData)
    
    // Test 3: Register user test
    console.log('Testing registerUser...')
    const registerResponse = await fetch(WEB_APP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        function: 'registerUser',
        body: {
          mssv: 'K225123456',
          password: 'test123',
          full_name: 'Test User',
          email: 'test@example.com',
          sec_q1: 'What is your favorite color?',
          sec_a1: 'blue',
          sec_q2: 'What is your pet name?',
          sec_a2: 'fluffy',
          sec_q3: 'What city were you born in?',
          sec_a3: 'hanoi'
        }
      }),
    })
    
    console.log('Register Response status:', registerResponse.status)
    const registerData = await registerResponse.text()
    console.log('Register Response data:', registerData)
    
    return NextResponse.json({
      success: true,
      tests: {
        get: {
          status: getResponse.status,
          data: getData
        },
        post: {
          status: postResponse.status,
          data: postData
        },
        register: {
          status: registerResponse.status,
          data: registerData
        }
      },
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
