"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { PageHeader } from "@/components/page-header"
import { User, Lock, Mail, UserPlus, ArrowLeft, Loader2 } from "lucide-react"
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

async function registerUser(payload: any) {
  return apiCall('registerUser', payload)
}

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [form, setForm] = useState({
    mssv: "",
    password: "",
    full_name: "",
    email: "",
    sec_q1: "Tên thú cưng đầu tiên của bạn là gì?",
    sec_a1: "",
    sec_q2: "Tên trường cấp 3 của bạn là gì?",
    sec_a2: "",
    sec_q3: "Tên người bạn thân nhất thời cấp 3?",
    sec_a3: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!form.mssv.trim() || !form.password.trim() || !form.full_name.trim() || !form.email.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      })
      return
    }

    if (!form.sec_a1.trim() || !form.sec_a2.trim() || !form.sec_a3.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng trả lời đầy đủ 3 câu hỏi bảo mật",
        variant: "destructive",
      })
      return
    }

    // Validate MSSV format
    if (!/^K\d{9}$/i.test(form.mssv.trim())) {
      toast({
        title: "Lỗi",
        description: "MSSV không đúng định dạng (VD: K225123456)",
        variant: "destructive",
      })
      return
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      toast({
        title: "Lỗi",
        description: "Email không đúng định dạng",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await registerUser({
        mssv: form.mssv.trim().toUpperCase(),
        password: form.password,
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        sec_q1: form.sec_q1,
        sec_a1: form.sec_a1.trim(),
        sec_q2: form.sec_q2,
        sec_a2: form.sec_a2.trim(),
        sec_q3: form.sec_q3,
        sec_a3: form.sec_a3.trim(),
      })

      if (response.ok && response.data) {
        toast({
          title: "Thành công",
          description: "Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.",
        })
        
        // Redirect to login
        router.push('/auth/login')
      } else {
        toast({
          title: "Lỗi",
          description: response.message || "Đăng ký thất bại",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error registering:", error)
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi đăng ký",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#003663] text-white">
      <PageHeader 
        title="ĐĂNG KÝ"
        subtitle="Tạo tài khoản mới để tham gia diễn đàn FTC"
        showSocialMedia={false}
        badgeText="Tài khoản mới"
        badgeIcon={UserPlus}
        badgeColor="from-green-500/20 to-emerald-500/20"
        badgeBorderColor="border-green-400/30"
        badgeIconColor="text-green-400"
        badgeTextColor="text-green-100"
        badgeShadowColor="shadow-green-500/10"
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/10 rounded-2xl border border-white/20 p-8 backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/30 to-emerald-500/30 flex items-center justify-center mx-auto mb-4">
              <UserPlus className="h-8 w-8 text-green-200" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Đăng ký tài khoản</h2>
            <p className="text-white/70">Điền thông tin để tạo tài khoản mới</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">MSSV *</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <User className="h-5 w-5 text-white/60" />
                  </div>
                  <Input
                    type="text"
                    value={form.mssv}
                    onChange={(e) => setForm({ ...form, mssv: e.target.value })}
                    placeholder="K225123456"
                    className="pl-12 bg-white/10 border-white/30 text-white placeholder-white/60"
                    required
                  />
                </div>
                <p className="text-xs text-white/60 mt-1">Định dạng: K + 9 số</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Họ và tên *</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <User className="h-5 w-5 text-white/60" />
                  </div>
                  <Input
                    type="text"
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="pl-12 bg-white/10 border-white/30 text-white placeholder-white/60"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Mail className="h-5 w-5 text-white/60" />
                  </div>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="example@email.com"
                    className="pl-12 bg-white/10 border-white/30 text-white placeholder-white/60"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mật khẩu *</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Lock className="h-5 w-5 text-white/60" />
                  </div>
                  <Input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Mật khẩu mạnh"
                    className="pl-12 bg-white/10 border-white/30 text-white placeholder-white/60"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Security Questions */}
            <div className="border-t border-white/20 pt-6">
              <h3 className="text-lg font-semibold mb-4">Câu hỏi bảo mật *</h3>
              <p className="text-sm text-white/70 mb-4">Trả lời 3 câu hỏi để bảo mật tài khoản</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Câu hỏi 1: {form.sec_q1}</label>
                  <Input
                    type="text"
                    value={form.sec_a1}
                    onChange={(e) => setForm({ ...form, sec_a1: e.target.value })}
                    placeholder="Trả lời câu hỏi 1"
                    className="bg-white/10 border-white/30 text-white placeholder-white/60"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Câu hỏi 2: {form.sec_q2}</label>
                  <Input
                    type="text"
                    value={form.sec_a2}
                    onChange={(e) => setForm({ ...form, sec_a2: e.target.value })}
                    placeholder="Trả lời câu hỏi 2"
                    className="bg-white/10 border-white/30 text-white placeholder-white/60"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Câu hỏi 3: {form.sec_q3}</label>
                  <Input
                    type="text"
                    value={form.sec_a3}
                    onChange={(e) => setForm({ ...form, sec_a3: e.target.value })}
                    placeholder="Trả lời câu hỏi 3"
                    className="bg-white/10 border-white/30 text-white placeholder-white/60"
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <UserPlus className="h-4 w-4 mr-2" />
              )}
              Đăng ký tài khoản
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/70 mb-4">Đã có tài khoản?</p>
            <Link href="/auth/login">
              <Button variant="outline" className="w-full">
                Đăng nhập ngay
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