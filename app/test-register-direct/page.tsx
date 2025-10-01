"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"

export default function TestRegisterDirectPage() {
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testDirectRegister = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      // Test direct call to Google Apps Script
      const response = await fetch('https://script.google.com/macros/s/AKfycbyCfakaiFBnEQT0DYiyfjTJYxSO0_yZa0MzrsqjbodAI7Ay9i3OtF2zYpXdWibIX6P_Yw/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          function: 'registerUser',
          body: {
            mssv: 'K225123456',
            password: 'test123',
            full_name: 'Test User Direct',
            email: 'testdirect@example.com',
            sec_q1: 'What is your favorite color?',
            sec_a1: 'blue',
            sec_q2: 'What is your pet name?',
            sec_a2: 'fluffy',
            sec_q3: 'What city were you born in?',
            sec_a3: 'hanoi'
          }
        }),
      })

      const data = await response.text()
      console.log('Direct response:', data)
      
      try {
        const jsonData = JSON.parse(data)
        setResult({
          success: true,
          status: response.status,
          data: jsonData
        })
      } catch (parseError) {
        setResult({
          success: false,
          status: response.status,
          error: 'Parse error',
          rawData: data,
          parseError: parseError instanceof Error ? parseError.message : 'Unknown parse error'
        })
      }
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testProxyRegister = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      // Test through our proxy
      const response = await fetch('/api/forum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          function: 'registerUser',
          body: {
            mssv: 'K225123457',
            password: 'test123',
            full_name: 'Test User Proxy',
            email: 'testproxy@example.com',
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
        method: 'proxy',
        status: response.status,
        data: data
      })
    } catch (error) {
      setResult({
        success: false,
        method: 'proxy',
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
          <h1 className="text-2xl font-bold">Test Register Direct vs Proxy</h1>
          <p className="text-gray-600">
            Test registerUser function both directly and through our proxy to identify the issue.
          </p>
          
          <div className="flex gap-4">
            <Button onClick={testDirectRegister} disabled={isLoading}>
              {isLoading ? "Testing..." : "Test Direct (GAS)"}
            </Button>
            
            <Button onClick={testProxyRegister} disabled={isLoading}>
              {isLoading ? "Testing..." : "Test Proxy (API)"}
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
