"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"

export default function TestRegisterSimplePage() {
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testGasConnection = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/test-gas')
      const data = await response.json()
      setResult(data)
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

      const data = await response.json()
      setResult(data)
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
          <Button onClick={testGasConnection} disabled={isLoading}>
            {isLoading ? "Testing..." : "Test Google Apps Script Connection"}
          </Button>
          
          <Button onClick={testRegister} disabled={isLoading}>
            {isLoading ? "Testing..." : "Test Register User"}
          </Button>

          {result && (
            <div className="mt-4">
              <h3 className="font-bold mb-2">Result:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
