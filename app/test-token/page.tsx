"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"

export default function TestTokenPage() {
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [customToken, setCustomToken] = useState('ftc-2025-secret')

  const testWithToken = async (token: string) => {
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
            mssv: `K225${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
            password: 'test123',
            full_name: `Test User ${Date.now()}`,
            email: `test${Date.now()}@example.com`,
            sec_q1: 'Tên thú cưng đầu tiên?',
            sec_a1: 'fluffy',
            sec_q2: 'Trường tiểu học của bạn?',
            sec_a2: 'Nguyen Hue',
            sec_q3: 'Thành phố bạn sinh ra?',
            sec_a3: 'Ho Chi Minh',
            token: token
          }
        }),
      })

      const data = await response.json()
      setResult({
        success: true,
        status: response.status,
        token: token,
        data: data
      })
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error',
        details: error instanceof Error ? error.message : 'Unknown error',
        token: token
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testFetchQuestions = async (token: string) => {
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
            take: 5,
            token: token
          }
        }),
      })

      const data = await response.json()
      setResult({
        success: true,
        status: response.status,
        token: token,
        data: data
      })
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error',
        details: error instanceof Error ? error.message : 'Unknown error',
        token: token
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testDirectGAS = async (token: string) => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbwI9EHz05gL9_O_IG6cC-lKApzx-UW8uGdCLt6WAuSGfwzzMO2RDpRImXX5Yo67Vy_oeg/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          function: 'fetchQuestions',
          body: {
            take: 5,
            token: token
          }
        }),
      })

      const data = await response.text()
      setResult({
        success: true,
        status: response.status,
        token: token,
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
        details: error instanceof Error ? error.message : 'Unknown error',
        token: token
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Test API Token</h1>
          <p className="text-gray-600">
            Test các token khác nhau để tìm token đúng cho Google Apps Script
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Custom Token:</label>
              <input 
                type="text" 
                value={customToken}
                onChange={(e) => setCustomToken(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="Enter token to test"
              />
            </div>
            
            <div className="flex gap-4">
              <Button onClick={() => testWithToken(customToken)} disabled={isLoading}>
                {isLoading ? "Testing..." : "Test Register (Proxy)"}
              </Button>
              
              <Button onClick={() => testFetchQuestions(customToken)} disabled={isLoading}>
                {isLoading ? "Testing..." : "Test Fetch (Proxy)"}
              </Button>
              
              <Button onClick={() => testDirectGAS(customToken)} disabled={isLoading}>
                {isLoading ? "Testing..." : "Test Direct GAS"}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button onClick={() => testWithToken('ftc-2025-secret')} disabled={isLoading}>
                Test: ftc-2025-secret
              </Button>
              <Button onClick={() => testWithToken('')} disabled={isLoading}>
                Test: No Token
              </Button>
              <Button onClick={() => testWithToken('FTC-2025-SECRET')} disabled={isLoading}>
                Test: FTC-2025-SECRET
              </Button>
              <Button onClick={() => testWithToken('ftc2025')} disabled={isLoading}>
                Test: ftc2025
              </Button>
            </div>
          </div>

          {result && (
            <div className="mt-4">
              <h3 className="font-bold mb-2 text-gray-800">Test Results:</h3>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-100 p-6 rounded-xl shadow-lg border border-yellow-200">
                <div className={`p-4 rounded-lg mb-4 font-semibold ${
                  result.success 
                    ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white border-2 border-green-400' 
                    : 'bg-gradient-to-r from-red-500 to-pink-600 text-white border-2 border-red-400'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{result.success ? '🔑' : '❌'}</span>
                    <span>{result.success ? 'Token Test Successful' : 'Token Test Failed'}</span>
                    {result.token && <span className="text-sm opacity-80">({result.token})</span>}
                  </div>
                </div>
                <pre className="text-sm overflow-auto bg-gray-900 text-yellow-400 p-4 rounded-lg">
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
