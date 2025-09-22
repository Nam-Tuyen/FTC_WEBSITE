"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { Bot, BookOpen, HelpCircle, MessageSquare, Send, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// --- Dynamic (giữ nguyên Navigation như project của bạn) ---
const Navigation = dynamic(() => import("@/components/navigation"), { ssr: false })

// --- Types ---
type ChatMode = "club" | "industry"
type ChatMessage = { id: string; role: "user" | "assistant"; content: string; mode?: ChatMode }

// --- ENV & constants ---
const NEXT_PUBLIC_FTC_WEBSITE = (typeof window !== 'undefined' && (window as any).process?.env?.NEXT_PUBLIC_FTC_WEBSITE) || "" // ví dụ https://ftc.uel.edu.vn
const FTC_FANPAGE = "https://www.facebook.com/clbfintechuel"

const SUGGESTED_QUESTIONS: string[] = [
  "Câu lạc bộ có những hoạt động gì?",
  "Làm thế nào để tham gia câu lạc bộ?",
  "Các ban trong câu lạc bộ làm gì?",
  "Thời gian sinh hoạt diễn ra khi nào?",
  "Cần kỹ năng gì để ứng tuyển?",
  "Câu lạc bộ được thành lập khi nào?",
  "Câu lạc bộ có những thành tích gì?",
]

const CHAT_MODES: Array<{ mode: ChatMode; label: string; description: string; color: string; icon: React.ComponentType<any> }> = [
  {
    mode: "club",
    label: "Hỏi về câu lạc bộ",
    description: "Ưu tiên trả lời theo FAQ cố định của FTC. Nếu ngoài danh sách, dùng Gemini vai cố vấn tân sinh viên.",
    color: "bg-blue-600",
    icon: Users,
  },
  {
    mode: "industry",
    label: "Hỏi về ngành",
    description: "Trả lời dựa trên kiến thức từ Google (API thật hoặc mô phỏng), có trích nguồn ngắn gọn.",
    color: "bg-green-600",
    icon: BookOpen,
  },
]

// --- FAQ fixed mapping (khóa) ---
const FAQ_MAP: Record<string, string> = {
  "cac ban trong cau lac bo lam gi":
    "Ban Học thuật: Thiết kế nội dung cho workshop và talkshow, chuẩn bị câu hỏi cho tọa đàm, xây dựng ngân hàng câu hỏi, ra đề và chấm cuộc thi ATTACKER.\nBan Sự kiện: Lập kế hoạch và hồ sơ tổ chức, xây dựng kịch bản MC và timeline, điều phối hậu cần và giám sát thực thi tại hiện trường.\nBan Truyền thông: Thiết kế ấn phẩm, quản lý các kênh truyền thông, lập kế hoạch nội dung và phát triển hình ảnh thương hiệu của câu lạc bộ.\nBan Tài chính cá nhân: Tổ chức đào tạo về quản lý tài chính cá nhân cho sinh viên, phát triển và cập nhật bộ bài MoneyWe, hỗ trợ giảng viên ở các học phần liên quan.\nBan Nhân sự: Phân công và theo dõi tiến độ, bảo đảm nguồn lực, triển khai hoạt động gắn kết và gìn giữ văn hóa tổ chức.",
  "cau lac bo co nhung hoat dong gi":
    "FTC triển khai hệ sinh thái hoạt động học thuật và trải nghiệm thực tế gồm hội thảo, tọa đàm và chuyên đề về FinTech, dữ liệu, trí tuệ nhân tạo, ngân hàng số, thị trường vốn và quản trị rủi ro. Bên cạnh đó là cuộc thi học thuật ATTACKER, chuỗi talkshow và workshop, các buổi training nội bộ, tham quan doanh nghiệp như VNG, sự kiện hướng nghiệp Web3 Career Innovation và hoạt động gắn kết cộng đồng FTC Trip.",
  "lam the nao de tham gia cau lac bo":
    `Bạn theo dõi Fanpage để cập nhật đợt tuyển thành viên và hướng dẫn nộp hồ sơ. Link Fanpage: ${FTC_FANPAGE} . Thông báo sẽ nêu rõ mốc thời gian, điều kiện và quy trình.`,
  "thoi gian sinh hoat dien ra khi nao":
    "Lịch sinh hoạt được công bố trước trên các kênh nội bộ và Fanpage để mọi thành viên nắm bắt kịp thời. Tùy chương trình, câu lạc bộ sẽ thông báo rõ thời gian, hình thức tham gia và yêu cầu chuẩn bị cho từng hoạt động như talkshow, workshop, training hoặc sự kiện theo mùa.",
  "can ky nang gi de ung tuyen":
    "FTC chào đón đa dạng chuyên ngành. Tinh thần học hỏi, kỷ luật và chủ động là nền tảng quan trọng. Kiến thức nền về Excel, SQL hoặc Python là lợi thế khi tham gia các nội dung dữ liệu và công nghệ tài chính. Kỹ năng viết và thuyết trình giúp bạn đóng góp hiệu quả cho học thuật và truyền thông. Kỹ năng làm việc nhóm và quản lý thời gian hỗ trợ bạn theo kịp tiến độ dự án và sự kiện. Ứng viên quan tâm mảng sự kiện nên có tư duy tổ chức và khả năng phối hợp nhiều đầu việc. Ứng viên thiên về truyền thông cần khả năng xây dựng nội dung và thẩm mỹ thị giác.",
  "cau lac bo duoc thanh lap khi nao":
    "FTC trực thuộc Khoa Tài chính và Ngân hàng, Trường Đại học Kinh tế và Luật, ĐHQG-HCM. Câu lạc bộ được thành lập vào tháng mười một năm 2020 dưới sự hướng dẫn của ThS. NCS Phan Huy Tâm cùng đội ngũ sinh viên ngành công nghệ tài chính.",
  "cau lac bo co nhung thanh tich gi":
    "Năm học 2024–2025, FTC được Ban Cán sự Đoàn ĐHQG-HCM tặng Giấy khen vì đóng góp tích cực cho công tác Đoàn và phong trào thanh niên. Câu lạc bộ đồng thời vào Top 10 Nhóm 4 của Giải thưởng Đổi mới sáng tạo và Khởi nghiệp TP.HCM I-STAR, được cấp Giấy chứng nhận ghi nhận nỗ lực và đóng góp trong hoạt động đổi mới sáng tạo.",
}

// --- Prompts (tham chiếu, BE sẽ dùng; FE không cần gửi) ---
const CLUB_MODE_SYSTEM_PROMPT = `Mục tiêu: Khi câu hỏi của người dùng trùng/giống một trong các câu FAQ, phải trả nguyên văn "answer" đã định nghĩa. Nếu không khớp, gọi model Gemini với role cố vấn tân sinh viên.
Luật so khớp:
1) Chuẩn hoá câu hỏi: chữ thường, loại dấu tiếng Việt (NFD), bỏ ký tự ngoài chữ-số, rút gọn khoảng trắng.
2) So khớp trực tiếp: nếu câu người dùng sau chuẩn hoá chứa nguyên cụm câu hỏi chuẩn hoá (hoặc ngược lại).
3) So khớp theo từ khoá: nếu có từ 2 cụm khoá độc nhất của câu hỏi chuẩn hoá xuất hiện trong câu người dùng.
4) So khớp xấp xỉ: Jaccard ≥ 0.35 hoặc Levenshtein ≤ 10 nếu độ dài > 30 ký tự.
5) Nếu nhiều mục khớp, chọn mục có điểm cao nhất.
6) Nếu khớp: trả nguyên văn "answer". Không thêm bớt.
7) Nếu không khớp: chuyển sang nhánh Gemini (role bên dưới).`

const GEMINI_ADVISOR_ROLE = `Bạn là cố vấn học tập dành cho tân sinh viên. Hãy giới thiệu ngắn gọn, thân thiện và dễ hiểu về Câu lạc bộ Công nghệ tài chính FTC cùng định hướng ngành học liên quan... (rút gọn—BE đã có bản đầy đủ).`

const INDUSTRY_MODE_SYSTEM_PROMPT = `CHẾ ĐỘ HỎI VỀ NGÀNH (Google-mode): Tổng hợp nhanh, có cấu trúc, trả lời gãy gọn bằng tiếng Việt, không dùng dấu ";" hay gạch đầu dòng. Cuối câu trả lời luôn thêm "Nguồn: domain1, domain2, domain3" với các tên miền uy tín.`

// --- Helpers ---
function normalize(text: string) {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function faqMatchOrNull(q: string): string | null {
  const nx = normalize(q)
  for (const [k, v] of Object.entries(FAQ_MAP)) {
    if (nx.includes(k) || k.includes(nx)) return v
  }
  return null
}

function websiteAnchor(): string {
  if (NEXT_PUBLIC_FTC_WEBSITE) {
    return `Bạn có thể xem thêm tại website chính thức: <a href="${NEXT_PUBLIC_FTC_WEBSITE}" target="_blank" rel="noopener noreferrer">${NEXT_PUBLIC_FTC_WEBSITE}</a>.`
  }
  return `Theo dõi Fanpage: <a href="${FTC_FANPAGE}" target="_blank" rel="noopener noreferrer">${FTC_FANPAGE}</a>.`
}

async function askServer({
  mode,
  question,
  history,
}: {
  mode: ChatMode
  question: string
  history?: Array<{ role: "user" | "assistant"; content: string }>
}) {
  const res = await fetch("/api/chat/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode,
      message: question,
      messages: [...(history || []), { role: "user", content: question }],
    }),
  })
  const data = await res.json().catch(() => ({}))
  return data.reply || data.response || data.text || data.answer || ""
}

// --- Page component ---
export default function ChatbotPage() {
  const [mounted, setMounted] = useState(false)
  const [selectedMode, setSelectedMode] = useState<ChatMode>("club")
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isSending, setIsSending] = useState(false)
  const [showModeChangeNotification, setShowModeChangeNotification] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const dynamicPlaceholder = useMemo(
    () => (selectedMode === "club" ? "Hỏi về câu lạc bộ, hoạt động, cách tham gia…" : "Hỏi về FinTech, blockchain, ngân hàng số…"),
    [selectedMode]
  )

  const handleModeChange = (m: ChatMode) => {
    setSelectedMode(m)
    setShowModeChangeNotification(true)
    setTimeout(() => setShowModeChangeNotification(false), 2200)
  }

  async function handleSendMessage() {
    const q = inputValue.trim()
    if (!q || isSending) return

    const newUserMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: q, mode: selectedMode }
    setMessages((prev: ChatMessage[]) => [...prev, newUserMsg])
    setInputValue("")
    setIsSending(true)

    try {
      let botText: string | null = null

      // 1) Club-mode: thử match FAQ ngay trên FE cho mượt
      if (selectedMode === "club") {
        const quick = faqMatchOrNull(q)
        if (quick) botText = quick
      }

      // 2) Không khớp thì gọi BE
      if (!botText) {
        const history = messages.slice(-6).map((m: ChatMessage) => ({ role: m.role, content: m.content }))
        const out = await askServer({ mode: selectedMode, question: q, history })
        botText = out || "Xin lỗi, hiện chưa thể trả lời."
      }

      // 3) Nếu hỏi link/website trong club-mode → gợi ý link
      if (selectedMode === "club") {
        const keys = ["link", "website", "trang web", "web", "thông tin", "thong tin", "tuyển", "tuyen"]
        if (keys.some((k) => normalize(q).includes(normalize(k)))) {
          botText = `${botText}\n\n${websiteAnchor()}`
        }
      }

      setMessages((prev: ChatMessage[]) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: botText!, mode: selectedMode }])
    } catch {
      setMessages((prev: ChatMessage[]) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: "Xin lỗi, hiện chưa thể trả lời.", mode: selectedMode }])
    } finally {
      setIsSending(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!mounted) return <div className="min-h-screen" />

  return (
    <div suppressHydrationWarning className="min-h-screen bg-gradient-to-b from-background to-background/80 overflow-hidden">
      <Navigation />

      {/* Hero Section (giữ như bạn có) */}
      <section className="relative min-h-[48vh] flex items-center justify-center py-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[40%] h-[60%] bg-gradient-to-br from-indigo-700/20 to-emerald-600/6 rounded-full blur-3xl transform translate-x-24 -translate-y-8" />
          <div className="absolute bottom-0 left-0 w-[35%] h-[50%] bg-gradient-to-tr from-emerald-500/10 to-indigo-600/6 rounded-full blur-3xl -translate-x-24 translate-y-8" />
        </div>

        <div className="relative responsive-container text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-indigo-600 to-emerald-500 rounded-full shadow-lg mb-6">
            <Bot className="h-9 w-9 text-white" />
          </div>
          <h1 className="relative" style={{ letterSpacing: "-1.2px", position: "relative", font: "800 48px/60px Inter, ui-sans-serif, system-ui, -apple-system" }}>
            <div className="inline-block" style={{ backgroundClip: "text", backgroundImage: "linear-gradient(to right, oklch(0.673 0.182 276.935) 0%, oklch(0.845 0.143 164.978) 100%)", fontFamily: 'Montserrat, "Montserrat Fallback", sans-serif', fontWeight: 800 }}>
              <p>TRỢ LÝ HỖ TRỢ </p>
            </div>
          </h1>
          <div className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            <p>Trợ lý AI thân thiện giúp tân sinh viên tìm hiểu thông tin về câu lạc bộ và kiến thức về ngành công nghệ tài chính</p>
          </div>
        </div>
      </section>

      {/* Main layout */}
      <div className="responsive-container pt-6 pb-12">
        <div className="flex justify-center">
          <div className="w-full max-w-[1200px]">
            {/* Card Chat */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl sm:text-2xl">FTC Chatbot</CardTitle>
                    <p className="text-xs text-muted-foreground">Hai chế độ: Hỏi về câu lạc bộ / Hỏi về ngành</p>
                  </div>
                </div>

                {/* Mode Selector */}
                <div className="mt-3 flex gap-1 bg-accent/10 p-1 rounded-lg w-full">
                  {CHAT_MODES.map((mc) => {
                    const Icon = mc.icon
                    const selected = selectedMode === mc.mode
                    return (
                      <Button
                        key={mc.mode}
                        variant={selected ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handleModeChange(mc.mode)}
                        className={cn("flex items-center gap-2 transition-all duration-300", selected ? `${mc.color} text-white shadow-lg scale-105` : "hover:bg-accent/30 text-muted-foreground hover:text-foreground")}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline font-medium">{mc.label}</span>
                        {selected && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                      </Button>
                    )
                  })}
                </div>

                {/* Mode Description */}
                <div className="mt-3 p-3 bg-gradient-to-r from-accent/20 to-primary/20 rounded-lg border border-accent/30">
                  <div className="flex items-center gap-2 mb-1">
                    {selectedMode === "club" ? <Users className="h-4 w-4 text-blue-500" /> : <BookOpen className="h-4 w-4 text-green-500" />}
                    <span className="text-sm font-semibold text-foreground">Chế độ: {CHAT_MODES.find((m) => m.mode === selectedMode)?.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{CHAT_MODES.find((m) => m.mode === selectedMode)?.description}</p>
                </div>
              </CardHeader>

              {/* Mode Change Notification */}
              {showModeChangeNotification && (
                <div className="mx-4 mb-2 p-2 bg-gradient-to-r from-blue-500/20 to-green-500/20 border border-accent/30 rounded-lg animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                    <span className="text-muted-foreground">
                      Đã chuyển sang chế độ: <strong>{CHAT_MODES.find((m) => m.mode === selectedMode)?.label}</strong>
                    </span>
                  </div>
                </div>
              )}

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[65vh]">
                {messages.map((m: ChatMessage) => (
                  <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "px-3 py-2 rounded-lg max-w-[85%] whitespace-pre-wrap break-words",
                        m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground border border-accent/20"
                      )}
                      dangerouslySetInnerHTML={{ __html: m.content.replace(/\n/g, "<br/>") }}
                    />
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Input */}
              <div className="border-t border-accent/20 pt-4 px-4 pb-3 bg-card/10 backdrop-blur-sm sticky bottom-0 mt-auto">
                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                  {selectedMode === "club" ? (
                    <>
                      <Users className="h-3 w-3 text-blue-500" />
                      <span>Chế độ CLB - Trả lời về thông tin câu lạc bộ</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-3 w-3 text-green-500" />
                      <span>Chế độ Ngành - Trả lời về kiến thức FinTech</span>
                    </>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={dynamicPlaceholder}
                    className="flex-1 w-full"
                  />
                  <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isSending} className="glow">
                    <Send className="h-4 w-4 mr-1" /> Gửi
                  </Button>
                </div>
              </div>
            </Card>

            {/* Suggested Questions (auto dùng CLB) */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" /> Câu hỏi gợi ý
                </CardTitle>
                <div className="mt-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="text-blue-700 font-medium">Tự động dùng chế độ CLB</span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">Các câu hỏi này sẽ luôn trả lời về thông tin câu lạc bộ</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {SUGGESTED_QUESTIONS.map((q, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className="w-full text-left justify-start h-auto p-3 bg-transparent whitespace-normal break-words hover:bg-blue-500/10 hover:border-blue-500/30 transition-all duration-200 group"
                    onClick={() => {
                      setSelectedMode("club")
                      setInputValue(q)
                    }}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className="flex-shrink-0 mt-0.5">
                        <MessageSquare className="h-4 w-4 text-blue-500 group-hover:text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm break-words text-left block">{q}</span>
                        <div className="flex items-center gap-1 mt-1">
                          <Users className="h-3 w-3 text-blue-400" />
                          <span className="text-xs text-blue-500">Chế độ CLB</span>
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* global style (giữ nguyên animation) */}
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -30px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(30px, 30px) scale(1.05); }
        }
        .animate-gradient-slow { animation: gradient 15s ease infinite; background-size: 200% 200%; }
        .animate-blob { animation: blob 20s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  )
}