"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"

export default function CheckSheetPage() {
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const checkUsers = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      // Test fetchQuestions để xem có dữ liệu không
      const response = await fetch('/api/forum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          function: 'fetchQuestions',
          body: {
            take: 50,
            token: 'ftc-2025-secret'
          }
        }),
      })

      const data = await response.json()
      
      // Phân tích dữ liệu
      const analysis = {
        totalQuestions: data.data?.items?.length || 0,
        questionsWithData: data.data?.items?.filter((q: any) => q.title && q.content && q.user).length || 0,
        questionsEmpty: data.data?.items?.filter((q: any) => !q.title || !q.content || !q.user).length || 0,
        uniqueUsers: [...new Set(data.data?.items?.map((q: any) => q.user).filter(Boolean))].length,
        categories: [...new Set(data.data?.items?.map((q: any) => q.category).filter(Boolean))],
        sampleQuestions: data.data?.items?.slice(0, 5).map((q: any) => ({
          id: q.id,
          title: q.title || 'NO TITLE',
          user: q.user || 'NO USER',
          category: q.category || 'NO CATEGORY',
          content: q.content || 'NO CONTENT',
          createdAt: q.createdAt || 'NO DATE'
        }))
      }

      setResult({
        success: true,
        status: response.status,
        analysis: analysis,
        rawData: data
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

  const testNewUser = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const randomMSSV = `K225${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`
      
      const response = await fetch('/api/forum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          function: 'registerUser',
          body: {
            mssv: randomMSSV,
            password: 'test123',
            full_name: `Test User ${randomMSSV}`,
            email: `test${randomMSSV}@example.com`,
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
        mssv: randomMSSV,
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

  const testNewQuestion = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/forum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          function: 'createQuestion',
          body: {
            title: `Test Question ${new Date().toISOString()}`,
            category: 'Thảo luận',
            user: 'K225123456',
            content: 'This is a test question to verify data is being saved correctly.',
            anonymous: false,
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

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Check Google Sheet Data</h1>
          <p className="text-gray-600">
            Kiểm tra dữ liệu trong Google Sheet và test tạo mới
          </p>
          
          <div className="flex gap-4">
            <Button onClick={checkUsers} disabled={isLoading}>
              {isLoading ? "Checking..." : "Check Questions Data"}
            </Button>
            
            <Button onClick={testNewUser} disabled={isLoading}>
              {isLoading ? "Testing..." : "Test New User"}
            </Button>
            
            <Button onClick={testNewQuestion} disabled={isLoading}>
              {isLoading ? "Testing..." : "Test New Question"}
            </Button>
          </div>

          {result && (
            <div className="mt-4">
              <h3 className="font-bold mb-2 text-gray-800">Analysis Results:</h3>
              <div className="bg-gradient-to-br from-indigo-50 to-purple-100 p-6 rounded-xl shadow-lg border border-indigo-200">
                <div className={`p-4 rounded-lg mb-4 font-semibold ${
                  result.success 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-2 border-indigo-400' 
                    : 'bg-gradient-to-r from-red-500 to-pink-600 text-white border-2 border-red-400'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{result.success ? '📊' : '❌'}</span>
                    <span>{result.success ? 'Data Analysis Complete' : 'Analysis Failed'}</span>
                  </div>
                </div>
                <pre className="text-sm overflow-auto bg-gray-900 text-cyan-400 p-4 rounded-lg">
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
