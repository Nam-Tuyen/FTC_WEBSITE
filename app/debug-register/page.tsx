"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugRegisterPage() {
  const [formData, setFormData] = useState({
    mssv: "K225123456",
    password: "test123",
    full_name: "Test User",
    email: "test@example.com",
    sec_q1: "What is your favorite color?",
    sec_a1: "blue",
    sec_q2: "What is your pet's name?",
    sec_a2: "fluffy",
    sec_q3: "What city were you born in?",
    sec_a3: "hanoi",
  })

  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleTest = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      // Test direct API call
      const response = await fetch('/api/test-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          function: 'registerUser',
          body: formData
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
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Debug Register API</CardTitle>
            <CardDescription>
              Test the register API call to see what's happening
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mssv">MSSV</Label>
                <Input
                  id="mssv"
                  value={formData.mssv}
                  onChange={(e) => setFormData({...formData, mssv: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sec_q1">Security Question 1</Label>
              <Input
                id="sec_q1"
                value={formData.sec_q1}
                onChange={(e) => setFormData({...formData, sec_q1: e.target.value})}
              />
              <Input
                placeholder="Answer 1"
                value={formData.sec_a1}
                onChange={(e) => setFormData({...formData, sec_a1: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sec_q2">Security Question 2</Label>
              <Input
                id="sec_q2"
                value={formData.sec_q2}
                onChange={(e) => setFormData({...formData, sec_q2: e.target.value})}
              />
              <Input
                placeholder="Answer 2"
                value={formData.sec_a2}
                onChange={(e) => setFormData({...formData, sec_a2: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sec_q3">Security Question 3</Label>
              <Input
                id="sec_q3"
                value={formData.sec_q3}
                onChange={(e) => setFormData({...formData, sec_q3: e.target.value})}
              />
              <Input
                placeholder="Answer 3"
                value={formData.sec_a3}
                onChange={(e) => setFormData({...formData, sec_a3: e.target.value})}
              />
            </div>

            <Button onClick={handleTest} disabled={isLoading} className="w-full">
              {isLoading ? "Testing..." : "Test Register API"}
            </Button>

            {result && (
              <div className="mt-4">
                <h3 className="font-bold mb-2">Result:</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
