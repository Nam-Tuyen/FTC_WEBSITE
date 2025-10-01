"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { registerUser } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const { setUser } = useAuthStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    mssv: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    email: "",
    sec_q1: "",
    sec_a1: "",
    sec_q2: "",
    sec_a2: "",
    sec_q3: "",
    sec_a3: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate MSSV format
    if (!/^K\d{9}$/i.test(formData.mssv)) {
      toast({
        title: "Lỗi",
        description: "MSSV phải theo định dạng K + 9 số (ví dụ: K225123456)",
        variant: "destructive",
      })
      return
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu xác nhận không khớp",
        variant: "destructive",
      })
      return
    }

    // Validate all fields
    if (
      !formData.full_name ||
      !formData.email ||
      !formData.sec_q1 ||
      !formData.sec_a1 ||
      !formData.sec_q2 ||
      !formData.sec_a2 ||
      !formData.sec_q3 ||
      !formData.sec_a3
    ) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await registerUser({
        mssv: formData.mssv,
        password: formData.password,
        full_name: formData.full_name,
        email: formData.email,
        sec_q1: formData.sec_q1,
        sec_a1: formData.sec_a1,
        sec_q2: formData.sec_q2,
        sec_a2: formData.sec_a2,
        sec_q3: formData.sec_q3,
        sec_a3: formData.sec_a3,
      })

      if (response.ok && response.data) {
        setUser({
          userId: response.data.userId,
          mssv: response.data.mssv,
          full_name: formData.full_name,
          email: formData.email,
        })

        toast({
          title: "Thành công",
          description: response.message || "Đăng ký thành công!",
        })

        router.push("/")
      } else {
        toast({
          title: "Lỗi",
          description: response.message || "Đăng ký thất bại",
          variant: "destructive",
        })
      }
    } catch (error) {
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
    <div className="min-h-screen bg-[#003663] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/10 border-white/20 text-white backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Đăng ký tài khoản</CardTitle>
          <CardDescription className="text-white/70 text-center">
            Tạo tài khoản mới để tham gia diễn đàn FTC
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mssv">MSSV *</Label>
                  <Input
                    id="mssv"
                    placeholder="K225123456"
                    value={formData.mssv}
                    onChange={(e) => setFormData({ ...formData, mssv: e.target.value.toUpperCase() })}
                    className="bg-white/10 border-white/30 text-white placeholder-white/60"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="full_name">Họ và tên *</Label>
                  <Input
                    id="full_name"
                    placeholder="Nguyễn Văn A"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="bg-white/10 border-white/30 text-white placeholder-white/60"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@student.hcmus.edu.vn"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white/10 border-white/30 text-white placeholder-white/60"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-white/10 border-white/30 text-white placeholder-white/60"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="bg-white/10 border-white/30 text-white placeholder-white/60"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Security Questions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Câu hỏi bảo mật</h3>
              <p className="text-sm text-white/70">Dùng để khôi phục mật khẩu khi quên</p>

              {[1, 2, 3].map((num) => (
                <div key={num} className="space-y-2">
                  <Label htmlFor={`sec_q${num}`}>Câu hỏi {num} *</Label>
                  <Input
                    id={`sec_q${num}`}
                    placeholder={`Ví dụ: Tên thú cưng của bạn là gì?`}
                    value={formData[`sec_q${num}` as keyof typeof formData]}
                    onChange={(e) => setFormData({ ...formData, [`sec_q${num}`]: e.target.value })}
                    className="bg-white/10 border-white/30 text-white placeholder-white/60"
                    required
                  />
                  <Label htmlFor={`sec_a${num}`}>Đáp án {num} *</Label>
                  <Input
                    id={`sec_a${num}`}
                    placeholder="Nhập đáp án"
                    value={formData[`sec_a${num}` as keyof typeof formData]}
                    onChange={(e) => setFormData({ ...formData, [`sec_a${num}`]: e.target.value })}
                    className="bg-white/10 border-white/30 text-white placeholder-white/60"
                    required
                  />
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng ký...
                </>
              ) : (
                "Đăng ký"
              )}
            </Button>

            <p className="text-center text-sm text-white/70">
              Đã có tài khoản?{" "}
              <Link href="/auth/login" className="text-blue-300 hover:text-blue-200 underline">
                Đăng nhập
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

