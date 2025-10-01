"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { forgotPasswordGetQuestions, forgotPasswordReset } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [mssv, setMssv] = useState("")
  const [questions, setQuestions] = useState<string[]>([])
  const [answers, setAnswers] = useState({ a1: "", a2: "", a3: "" })
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!/^K\d{9}$/i.test(mssv)) {
      toast({
        title: "Lỗi",
        description: "MSSV phải theo định dạng K + 9 số",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await forgotPasswordGetQuestions({ mssv })

      if (response.ok && response.data) {
        setQuestions(response.data.questions)
        setStep(2)
        toast({
          title: "Thành công",
          description: "Vui lòng trả lời các câu hỏi bảo mật",
        })
      } else {
        toast({
          title: "Lỗi",
          description: response.message || "Không tìm thấy tài khoản",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!answers.a1 || !answers.a2 || !answers.a3) {
      toast({
        title: "Lỗi",
        description: "Vui lòng trả lời đầy đủ 3 câu hỏi",
        variant: "destructive",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu xác nhận không khớp",
        variant: "destructive",
      })
      return
    }

    if (newPassword.length < 6) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu phải có ít nhất 6 ký tự",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await forgotPasswordReset({
        mssv,
        answers,
        new_password: newPassword,
      })

      if (response.ok) {
        toast({
          title: "Thành công",
          description: response.message || "Đặt lại mật khẩu thành công!",
        })
        router.push("/auth/login")
      } else {
        toast({
          title: "Lỗi",
          description: response.message || "Đáp án không chính xác",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra",
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
          <CardTitle className="text-3xl font-bold text-center">Quên mật khẩu</CardTitle>
          <CardDescription className="text-white/70 text-center">
            {step === 1 ? "Nhập MSSV để lấy câu hỏi bảo mật" : "Trả lời câu hỏi để đặt lại mật khẩu"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <form onSubmit={handleStep1} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mssv">MSSV</Label>
                <Input
                  id="mssv"
                  placeholder="K225123456"
                  value={mssv}
                  onChange={(e) => setMssv(e.target.value.toUpperCase())}
                  className="bg-white/10 border-white/30 text-white placeholder-white/60"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Tiếp tục"
                )}
              </Button>

              <Link
                href="/auth/login"
                className="flex items-center justify-center gap-2 text-sm text-blue-300 hover:text-blue-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại đăng nhập
              </Link>
            </form>
          ) : (
            <form onSubmit={handleStep2} className="space-y-4">
              {questions.map((question, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`answer${index + 1}`}>
                    Câu hỏi {index + 1}: {question}
                  </Label>
                  <Input
                    id={`answer${index + 1}`}
                    placeholder="Nhập đáp án"
                    value={answers[`a${index + 1}` as keyof typeof answers]}
                    onChange={(e) => setAnswers({ ...answers, [`a${index + 1}`]: e.target.value })}
                    className="bg-white/10 border-white/30 text-white placeholder-white/60"
                    required
                  />
                </div>
              ))}

              <div className="space-y-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-white/10 border-white/30 text-white placeholder-white/60"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-white/10 border-white/30 text-white placeholder-white/60"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Đặt lại mật khẩu"
                )}
              </Button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center justify-center gap-2 w-full text-sm text-blue-300 hover:text-blue-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

