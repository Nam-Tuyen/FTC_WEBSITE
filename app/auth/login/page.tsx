"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { PageHeader } from "@/components/page-header"
import { User, Lock, ArrowLeft, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// API functions
const API_BASE = '/api/forum'
const API_TOKEN = 'ftc-2025-secret'

async function apiCall(functionName: string, payload: any) {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      function: functionName,
      body: {
        ...payload,
        token: API_TOKEN
      }
    }),
  })
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  return response.json()
}

async function login(payload: any) {
  return apiCall('login', payload)
}

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [form, setForm] = useState({
    mssv: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.mssv.trim() || !form.password.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await login({
        mssv: form.mssv.trim(),
        password: form.password,
      })

      if (response.ok && response.data) {
        // Save user to localStorage
        localStorage.setItem('user', JSON.stringify(response.data))
        
        toast({
          title: "Thành công",
          description: "Đăng nhập thành công!",
        })
        
        // Redirect to forum
        router.push('/dien-dan')
      } else {
        toast({
          title: "Lỗi",
          description: response.message || "Đăng nhập thất bại",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error logging in:", error)
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi đăng nhập",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#003663] text-white">
      <PageHeader 
        title="ĐĂNG NHẬP"
        subtitle="Đăng nhập để tham gia diễn đàn và đặt câu hỏi"
        showSocialMedia={false}
        badgeText="Tài khoản"
        badgeIcon={User}
        badgeColor="from-blue-500/20 to-purple-500/20"
        badgeBorderColor="border-blue-400/30"
        badgeIconColor="text-blue-400"
        badgeTextColor="text-blue-100"
        badgeShadowColor="shadow-blue-500/10"
      />

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/10 rounded-2xl border border-white/20 p-8 backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-blue-200" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Đăng nhập</h2>
            <p className="text-white/70">Nhập thông tin để truy cập diễn đàn</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">MSSV</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <User className="h-5 w-5 text-white/60" />
                </div>
                <Input
                  type="text"
                  value={form.mssv}
                  onChange={(e) => setForm({ ...form, mssv: e.target.value })}
                  placeholder="Nhập MSSV (VD: K225123456)"
                  className="pl-12 bg-white/10 border-white/30 text-white placeholder-white/60"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mật khẩu</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Lock className="h-5 w-5 text-white/60" />
                </div>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Nhập mật khẩu"
                  className="pl-12 bg-white/10 border-white/30 text-white placeholder-white/60"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <User className="h-4 w-4 mr-2" />
              )}
              Đăng nhập
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/70 mb-4">Chưa có tài khoản?</p>
            <Link href="/auth/register">
              <Button variant="outline" className="w-full">
                Đăng ký tài khoản mới
              </Button>
            </Link>
          </div>

          <div className="mt-6 text-center">
            <Link href="/dien-dan" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Quay lại diễn đàn
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}