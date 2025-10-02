"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"

export default function TestFinalPage() {
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testRegisterNewUser = async () => {
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
        data: data,
        message: data.ok ? '✅ User created successfully!' : '❌ User creation failed'
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

  const testCreateQuestion = async () => {
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
            content: 'This is a test question to verify Google Sheet is working correctly with the new GAS code.',
            anonymous: false,
            token: 'ftc-2025-secret'
          }
        }),
      })

      const data = await response.json()
      setResult({
        success: true,
        status: response.status,
        data: data,
        message: data.ok ? '✅ Question created successfully!' : '❌ Question creation failed'
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

  const testFetchAllData = async () => {
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
            take: 20,
            token: 'ftc-2025-secret'
          }
        }),
      })

      const data = await response.json()
      
      // Analyze data quality
      const questions = data.data?.items || []
      const analysis = {
        totalQuestions: questions.length,
        questionsWithFullData: questions.filter((q: any) => 
          q.title && q.content && q.user && q.category && q.createdAt
        ).length,
        questionsWithEmptyData: questions.filter((q: any) => 
          !q.title || !q.content || !q.user || !q.category || !q.createdAt
        ).length,
        uniqueUsers: [...new Set(questions.map((q: any) => q.user).filter(Boolean))].length,
        categories: [...new Set(questions.map((q: any) => q.category).filter(Boolean))],
        recentQuestions: questions.slice(0, 5).map((q: any) => ({
          id: q.id,
          title: q.title || 'NO TITLE',
          user: q.user || 'NO USER',
          category: q.category || 'NO CATEGORY',
          createdAt: q.createdAt || 'NO DATE',
          likeCount: q.like_count || 0
        }))
      }

      setResult({
        success: true,
        status: response.status,
        analysis: analysis,
        rawData: data,
        message: '✅ Data fetched successfully!'
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
          <h1 className="text-2xl font-bold">Final Google Sheet Test</h1>
          <p className="text-gray-600">
            Test cuối cùng để xác nhận Google Sheet hoạt động hoàn hảo với token ftc-2025-secret
          </p>
          
          <div className="flex gap-4">
            <Button onClick={testRegisterNewUser} disabled={isLoading}>
              {isLoading ? "Testing..." : "Test New User"}
            </Button>
            
            <Button onClick={testCreateQuestion} disabled={isLoading}>
              {isLoading ? "Testing..." : "Test New Question"}
            </Button>
            
            <Button onClick={testFetchAllData} disabled={isLoading}>
              {isLoading ? "Testing..." : "Fetch All Data"}
            </Button>
          </div>

          {result && (
            <div className="mt-4">
              <h3 className="font-bold mb-2">Test Results:</h3>
              <div className="bg-white p-4 rounded shadow">
                {result.message && (
                  <div className={`p-3 rounded mb-4 ${
                    result.message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {result.message}
                  </div>
                )}
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
