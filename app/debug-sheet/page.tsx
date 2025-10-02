"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"

export default function DebugSheetPage() {
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testRegister = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/forum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          function: 'registerUser',
          body: {
            mssv: 'K225123999',
            password: 'test123',
            full_name: 'Test User Debug',
            email: 'testdebug@example.com',
            sec_q1: 'Tên thú cưng đầu tiên?',
            sec_a1: 'fluffy',
            sec_q2: 'Trường tiểu học của bạn?',
            sec_a2: 'Nguyen Hue',
            sec_q3: 'Thành phố bạn sinh ra?',
            sec_a3: 'Ho Chi Minh',
            token: 'ftc-2025-secret'
          }
        }),
      })

      const data = await response.json()
      setResult({
        success: true,
        status: response.status,
        data: data
      })
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

  const testFetch = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/forum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          function: 'fetchQuestions',
          body: {
            take: 10,
            token: 'ftc-2025-secret'
          }
        }),
      })

      const data = await response.json()
      setResult({
        success: true,
        status: response.status,
        data: data
      })
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

  const testDirectGAS = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbyCfakaiFBnEQT0DYiyfjTJYxSO0_yZa0MzrsqjbodAI7Ay9i3OtF2zYpXdWibIX6P_Yw/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          function: 'registerUser',
          body: {
            mssv: 'K225123888',
            password: 'test123',
            full_name: 'Test Direct GAS',
            email: 'testdirect@example.com',
            sec_q1: 'Tên thú cưng đầu tiên?',
            sec_a1: 'fluffy',
            sec_q2: 'Trường tiểu học của bạn?',
            sec_a2: 'Nguyen Hue',
            sec_q3: 'Thành phố bạn sinh ra?',
            sec_a3: 'Ho Chi Minh',
            token: 'ftc-2025-secret'
          }
        }),
      })

      const data = await response.text()
      setResult({
        success: true,
        status: response.status,
        rawData: data,
        parsedData: (() => {
          try {
            return JSON.parse(data)
          } catch (e) {
            return null
          }
        })()
      })
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

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Debug Google Sheet Connection</h1>
          <p className="text-gray-600">
            Test các API để xem tại sao dữ liệu không được lưu vào Google Sheet
          </p>
          
          <div className="flex gap-4">
            <Button onClick={testRegister} disabled={isLoading}>
              {isLoading ? "Testing..." : "Test Register (Proxy)"}
            </Button>
            
            <Button onClick={testFetch} disabled={isLoading}>
              {isLoading ? "Testing..." : "Test Fetch Questions"}
            </Button>
            
            <Button onClick={testDirectGAS} disabled={isLoading}>
              {isLoading ? "Testing..." : "Test Direct GAS"}
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
