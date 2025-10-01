"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { login } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useAuthStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    mssv: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!/^K\d{9}$/i.test(formData.mssv)) {
      toast({
        title: "Lỗi",
        description: "MSSV phải theo định dạng K + 9 số",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await login({
        mssv: formData.mssv,
        password: formData.password,
      })

      if (response.ok && response.data) {
        setUser(response.data)

        toast({
          title: "Thành công",
          description: response.message || "Đăng nhập thành công!",
        })

        router.push("/")
      } else {
        toast({
          title: "Lỗi",
          description: response.message || "Đăng nhập thất bại",
          variant: "destructive",
        })
      }
    } catch (error) {
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
    <div className="min-h-screen bg-[#003663] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 border-white/20 text-white backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Đăng nhập</CardTitle>
          <CardDescription className="text-white/70 text-center">Đăng nhập để tham gia diễn đàn FTC</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mssv">MSSV</Label>
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
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-white/10 border-white/30 text-white placeholder-white/60"
                required
              />
            </div>

            <div className="text-right">
              <Link href="/auth/forgot" className="text-sm text-blue-300 hover:text-blue-200 underline">
                Quên mật khẩu?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng nhập"
              )}
            </Button>

            <p className="text-center text-sm text-white/70">
              Chưa có tài khoản?{" "}
              <Link href="/auth/register" className="text-blue-300 hover:text-blue-200 underline">
                Đăng ký ngay
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

