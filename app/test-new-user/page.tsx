"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"

export default function TestNewUserPage() {
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testNewUser = async () => {
    setIsLoading(true)
    setResult(null)

    // Generate random MSSV to avoid conflicts
    const randomNumber = Math.floor(Math.random() * 900000000) + 100000000
    const mssv = `K${randomNumber}`

    try {
      const response = await fetch('/api/forum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          function: 'registerUser',
          body: {
            mssv: mssv,
            password: 'test123',
            full_name: `Test User ${randomNumber}`,
            email: `test${randomNumber}@example.com`,
            sec_q1: 'What is your favorite color?',
            sec_a1: 'blue',
            sec_q2: 'What is your pet name?',
            sec_a2: 'fluffy',
            sec_q3: 'What city were you born in?',
            sec_a3: 'hanoi'
          }
        }),
      })

      const data = await response.json()
      setResult({
        success: true,
        mssv: mssv,
        status: response.status,
        data: data
      })
    } catch (error) {
      setResult({
        success: false,
        mssv: mssv,
        error: 'Network error',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testLogin = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/forum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          function: 'login',
          body: {
            mssv: 'K225123456', // Use the existing user
            password: 'test123'
          }
        }),
      })

      const data = await response.json()
      setResult({
        success: true,
        method: 'login',
        status: response.status,
        data: data
      })
    } catch (error) {
      setResult({
        success: false,
        method: 'login',
        error: 'Network error',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Test New User Registration</h1>
          <p className="text-gray-600">
            Test with a new random MSSV to confirm data is being saved to Google Sheets.
          </p>
          
          <div className="flex gap-4">
            <Button onClick={testNewUser} disabled={isLoading}>
              {isLoading ? "Testing..." : "Test New User Registration"}
            </Button>
            
            <Button onClick={testLogin} disabled={isLoading}>
              {isLoading ? "Testing..." : "Test Login Existing User"}
            </Button>
          </div>

          {result && (
            <div className="mt-4">
              <h3 className="font-bold mb-2">Test Results:</h3>
              <div className="bg-white p-4 rounded shadow">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
