"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"

export default function TestGasPage() {
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testGas = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/test-gas-simple')
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
          <h1 className="text-2xl font-bold">Test Google Apps Script</h1>
          <p className="text-gray-600">
            This page will test the Google Apps Script connection and registerUser function.
          </p>
          
          <Button onClick={testGas} disabled={isLoading}>
            {isLoading ? "Testing..." : "Test Google Apps Script"}
          </Button>

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
