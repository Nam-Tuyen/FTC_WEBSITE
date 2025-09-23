"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic"
import {
  Bot,
  BookOpen,
  HelpCircle,
  MessageSquare,
  Send,
  Users,
  Heart,
  Repeat2,
  Share2,
  MoreHorizontal,
  CheckCheck,
  X,
  Minimize2,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// Navigation động (giữ như project)
const Navigation = dynamic(() => import("@/components/navigation"), { ssr: false })

// --- Types ---
type ChatMode = "club" | "industry"
type ChatMessage = { id: string; role: "user" | "assistant"; content: string; mode?: ChatMode; ts?: number }

// --- Constants ---
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
    label: "Câu lạc bộ",
    description: "Thông tin về FTC",
    color: "from-[#003663] to-[#004785]",
    icon: Users,
  },
  {
    mode: "industry", 
    label: "Ngành học",
    description: "Kiến thức FinTech",
    color: "from-[#0EA5E9] to-[#0284C7]",
    icon: BookOpen,
  },
]

// --- FAQ Map - Exact matches for suggested questions ---
const FAQ_MAP: Record<string, string> = {
  "cac ban trong cau lac bo lam gi":
    "Ban Học thuật: Thiết kế nội dung cho workshop và talkshow, chuẩn bị câu hỏi cho tọa đàm, xây dựng ngân hàng câu hỏi, ra đề và chấm cuộc thi ATTACKER.\n\nBan Sự kiện: Lập kế hoạch và hồ sơ tổ chức, xây dựng kịch bản MC và timeline, điều phối hậu cần và giám sát thực thi tại hiện trường.\n\nBan Truyền thông: Thiết kế ấn phẩm, quản lý các kênh truyền thông, lập kế hoạch nội dung và phát triển hình ảnh thương hiệu của câu lạc bộ.\n\nBan Tài chính cá nhân: Tổ chức đào tạo về quản lý tài chính cá nhân cho sinh viên, phát triển và cập nhật bộ bài MoneyWe, hỗ trợ giảng viên ở các học phần liên quan.\n\nBan Nhân sự: Phân công và theo dõi tiến độ, bảo đảm nguồn lực, triển khai hoạt động gắn kết và gìn giữ văn hóa tổ chức.",
  
  "cau lac bo co nhung hoat dong gi":
    "FTC triển khai hệ sinh thái hoạt động học thuật và trải nghiệm thực tế gồm hội thảo, tọa đàm và chuyên đề về FinTech, dữ liệu, trí tuệ nhân tạo, ngân hàng số, thị trường vốn và quản trị rủi ro.\n\nBên cạnh đó là cuộc thi học thuật ATTACKER, chuỗi talkshow và workshop, các buổi training nội bộ, tham quan doanh nghiệp như VNG, sự kiện hướng nghiệp Web3 Career Innovation và hoạt động gắn kết cộng đồng FTC Trip.",
  
  "lam the nao de tham gia cau lac bo":
    `Bạn theo dõi Fanpage để cập nhật đợt tuyển thành viên và hướng dẫn nộp hồ sơ. Link Fanpage: ${FTC_FANPAGE}. Thông báo sẽ nêu rõ mốc thời gian, điều kiện và quy trình.`,
  
  "thoi gian sinh hoat dien ra khi nao":
    "Lịch sinh hoạt được công bố trước trên các kênh nội bộ và Fanpage để mọi thành viên nắm bắt kịp thời. Tùy chương trình, câu lạc bộ sẽ thông báo rõ thời gian, hình thức tham gia và yêu cầu chuẩn bị cho từng hoạt động như talkshow, workshop, training hoặc sự kiện theo mùa.",
  
  "can ky nang gi de ung tuyen":
    "FTC chào đón đa dạng chuyên ngành. Tinh thần học hỏi, kỷ luật và chủ động là nền tảng quan trọng.\n\nKiến thức nền về Excel, SQL hoặc Python là lợi thế khi tham gia các nội dung dữ liệu và công nghệ tài chính. Kỹ năng viết và thuyết trình giúp bạn đóng góp hiệu quả cho học thuật và truyền thông.\n\nKỹ năng làm việc nhóm và quản lý thời gian hỗ trợ bạn theo kịp tiến độ dự án và sự kiện. Ứng viên quan tâm mảng sự kiện nên có tư duy tổ chức và khả năng phối hợp nhiều đầu việc. Ứng viên thiên về truyền thông cần khả năng xây dựng nội dung và thẩm mỹ thị giác.",
  
  "cau lac bo duoc thanh lap khi nao":
    "FTC trực thuộc Khoa Tài chính và Ngân hàng, Trường Đại học Kinh tế và Luật, ĐHQG-HCM. Câu lạc bộ được thành lập vào tháng mười một năm 2020 dưới sự hướng dẫn của ThS. NCS Phan Huy Tâm cùng đội ngũ sinh viên ngành công nghệ tài chính.",
  
  "cau lac bo co nhung thanh tich gi":
    "Năm học 2024–2025, FTC được Ban Cán sự Đoàn ĐHQG-HCM tặng Giấy khen vì đóng góp tích cực cho công tác Đoàn và phong trào thanh niên.\n\nCâu lạc bộ đồng thời vào Top 10 Nhóm 4 của Giải thưởng Đổi mới sáng tạo và Khởi nghiệp TP.HCM I-STAR, được cấp Giấy chứng nhận ghi nhận nỗ lực và đóng góp trong hoạt động đổi mới sáng tạo.",
}

// --- Helper Functions ---
function normalize(text: string): string {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

// Enhanced FAQ matching - more precise for suggested questions
function faqMatchOrNull(question: string): string | null {
  const normalizedQuestion = normalize(question)
  
  // Direct mapping for suggested questions
  const questionMappings = {
    "cau lac bo co nhung hoat dong gi": ["hoat dong", "lam gi", "chuong trinh", "su kien"],
    "lam the nao de tham gia cau lac bo": ["tham gia", "vao clb", "ung tuyen", "dang ky"],
    "cac ban trong cau lac bo lam gi": ["ban nao", "cac ban", "bo may", "phan cong"],
    "thoi gian sinh hoat dien ra khi nao": ["thoi gian", "lich sinh hoat", "khi nao", "bao gio"],
    "can ky nang gi de ung tuyen": ["ky nang", "yeu cau", "dieu kien", "can gi"],
    "cau lac bo duoc thanh lap khi nao": ["thanh lap", "ra doi", "bat dau", "khoi tao"],
    "cau lac bo co nhung thanh tich gi": ["thanh tich", "giai thuong", "danh hieu", "thanh cong"]
  }
  
  // Find best match
  for (const [faqKey, keywords] of Object.entries(questionMappings)) {
    const matchCount = keywords.filter(keyword => 
      normalizedQuestion.includes(normalize(keyword))
    ).length
    
    // If at least 1 keyword matches, return the answer
    if (matchCount > 0) {
      return FAQ_MAP[faqKey] || null
    }
  }
  
  return null
}

// Mock Google Search API call
async function mockGoogleSearch(query: string): Promise<Array<{title: string; domain: string; snippet: string}>> {
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500))
  
  // Mock search results based on query
  const mockResults = [
    {
      title: "FinTech và Tương lai Ngân hàng Số tại Việt Nam",
      domain: "vneconomy.vn",
      snippet: "FinTech đang thay đổi cách thức hoạt động của ngành tài chính, từ thanh toán di động đến cho vay P2P và blockchain."
    },
    {
      title: "Công nghệ Blockchain trong Tài chính",
      domain: "cafef.vn",
      snippet: "Blockchain mang lại tính minh bạch và bảo mật cao cho các giao dịch tài chính, đặc biệt trong thanh toán xuyên biên giới."
    },
    {
      title: "AI và Machine Learning trong Quản trị Rủi ro",
      domain: "banking.gov.vn",
      snippet: "Trí tuệ nhân tạo giúp các ngân hàng phân tích dữ liệu khách hàng, dự đoán rủi ro tín dụng và phát hiện gian lận."
    },
    {
      title: "Xu hướng Thanh toán Số và Ví Điện tử",
      domain: "techcombank.com.vn",
      snippet: "Thanh toán không tiếp xúc và ví điện tử đang trở thành xu hướng chính trong thanh toán hiện đại."
    },
    {
      title: "Thị trường Vốn Số và Fintech Innovation",
      domain: "sbv.gov.vn",
      snippet: "Sự phát triển của thị trường vốn số mở ra nhiều cơ hội đầu tư mới và nâng cao hiệu quả quản lý tài chính."
    }
  ]
  
  // Return random 3-4 results
  return mockResults
    .sort(() => Math.random() - 0.5)
    .slice(0, 3 + Math.floor(Math.random() * 2))
}

// Mock Gemini API call with proper system prompt
async function callGeminiAPI(mode: ChatMode, question: string, history: Array<{ role: string; content: string }> = []): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))
  
  if (mode === "club") {
    // System prompt for FTC advisor role (same as before)
    const systemPrompt = `Bạn là cố vấn học tập dành cho tân sinh viên. Hãy giới thiệu ngắn gọn, thân thiện và dễ hiểu về Câu lạc bộ Công nghệ tài chính FTC cùng định hướng ngành học liên quan.

Thông tin nền để dùng khi trả lời:
FTC trực thuộc Khoa Tài chính và Ngân hàng, Trường Đại học Kinh tế và Luật, ĐHQG-HCM, thành lập tháng 11/2020 dưới sự hướng dẫn của ThS. NCS Phan Huy Tâm.

Hoạt động tiêu biểu gồm hội thảo, tọa đàm và chuyên đề về FinTech, dữ liệu, trí tuệ nhân tạo, ngân hàng số, thị trường vốn, quản trị rủi ro; cuộc thi học thuật ATTACKER; chuỗi talkshow và workshop; training nội bộ; tham quan doanh nghiệp như VNG; sự kiện hướng nghiệp Web3 Career Innovation; hoạt động gắn kết cộng đồng FTC Trip.

Cơ cấu gồm 5 ban chuyên môn: Học thuật, Sự kiện, Truyền thông, Tài chính cá nhân, Nhân sự (Ban Điều hành giữ vai trò định hướng và phê duyệt, không tính là ban chuyên môn).

Cách tham gia: theo dõi Fanpage để cập nhật đợt tuyển và hướng dẫn nộp hồ sơ (https://www.facebook.com/clbfintechuel).

Lịch sinh hoạt được công bố trước trên kênh nội bộ và Fanpage theo từng chương trình.

Kỹ năng khuyến khích: tinh thần học hỏi, kỷ luật, chủ động; nền tảng Excel, SQL hoặc Python là lợi thế; kỹ năng viết, thuyết trình, làm việc nhóm và quản lý thời gian giúp theo kịp dự án và sự kiện; thiên về sự kiện cần tư duy tổ chức, thiên về truyền thông cần năng lực xây dựng nội dung và thẩm mỹ thị giác.

Thành tích: Giấy khen của Ban Cán sự Đoàn ĐHQG-HCM năm học 2024–2025; Top 10 Nhóm 4 Giải thưởng I-STAR TP.HCM.

Khi thiếu dữ liệu chi tiết, hãy nói rõ "tài liệu chưa nêu" và hướng người hỏi sang Fanpage. Trả lời bằng tiếng Việt, mạch lạc, không dùng dấu ";" hoặc gạch đầu dòng.`
    
    // Mock response based on common questions about FTC
    const responses = [
      "Chào bạn! FTC là câu lạc bộ Công nghệ tài chính thuộc Khoa Tài chính và Ngân hàng, ĐHQG-HCM, thành lập từ tháng 11/2020. Chúng mình tạo môi trường học tập về FinTech, tổ chức nhiều workshop, talkshow và cuộc thi ATTACKER. Bạn có thể theo dõi Fanpage để biết thêm thông tin tuyển thành viên nhé!",
      "FTC có 5 ban chuyên môn: Học thuật, Sự kiện, Truyền thông, Tài chính cá nhân và Nhân sự. Mỗi ban đều có vai trò riêng trong việc tổ chức hoạt động và phát triển thương hiệu câu lạc bộ. Bạn quan tâm ban nào đặc biệt không?",
      "Để tham gia FTC, bạn cần theo dõi Fanpage https://www.facebook.com/clbfintechuel để cập nhật thông tin tuyển thành viên. Chúng mình chào đón tất cả chuyên ngành, chỉ cần có tinh thần học hỏi và chủ động. Kiến thức về Excel, SQL, Python sẽ là lợi thế đấy!",
      "FTC đã đạt được nhiều thành tích như Giấy khen của Ban Cán sự Đoàn ĐHQG-HCM năm 2024-2025 và Top 10 Nhóm 4 Giải thưởng I-STAR TP.HCM. Đây là minh chứng cho sự phát triển bền vững của câu lạc bộ."
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
    
  } else {
    // Industry mode - Google Search + Gemini synthesis
    try {
      // Step 1: Get Google search results
      const searchResults = await mockGoogleSearch(question)
      
      // Step 2: Create system prompt for synthesis
      const systemPrompt = `Bạn là trợ lý học thuật. Tóm tắt ngắn gọn, chính xác, dễ hiểu về chủ đề mà người dùng hỏi liên quan tới ngành FinTech và các lĩnh vực sát cạnh (ngân hàng số, dữ liệu, AI tài chính, blockchain, thị trường vốn, quản trị rủi ro). Chỉ sử dụng thông tin rút ra từ danh sách kết quả tìm kiếm kèm theo. Trả lời bằng tiếng Việt, mạch lạc, không dùng dấu ";" hoặc gạch đầu dòng. Kết thúc phần trả lời bằng một dòng "Nguồn: domain1, domain2, domain3".`
      
      // Step 3: Create user prompt with search results
      const searchResultsText = searchResults.map((result, index) => 
        `${index + 1}) ${result.title} — ${result.domain}\n   Tóm tắt: ${result.snippet}`
      ).join('\n')
      
      const userPrompt = `Câu hỏi: "${question}"

Kết quả tìm kiếm (tối đa 5):
${searchResultsText}

Yêu cầu: Dựa vào các tóm tắt trên để trả lời.`

      // Step 4: Mock Gemini response based on search results
      const domains = searchResults.map(r => r.domain).join(', ')
      
      // Create synthesized response based on search results
      let synthesizedResponse = ""
      
      if (question.toLowerCase().includes('fintech') || question.toLowerCase().includes('công nghệ tài chính')) {
        synthesizedResponse = "FinTech (Financial Technology) là sự kết hợp giữa công nghệ và dịch vụ tài chính, đang thay đổi cách thức hoạt động của ngành tài chính truyền thống. Từ thanh toán di động, cho vay P2P đến blockchain, FinTech mang lại những giải pháp sáng tạo và tiện lợi cho người dùng. Tại Việt Nam, lĩnh vực này đang phát triển mạnh mẽ với sự xuất hiện của nhiều ứng dụng thanh toán số và dịch vụ ngân hàng trực tuyến."
      } else if (question.toLowerCase().includes('blockchain')) {
        synthesizedResponse = "Blockchain là công nghệ chuỗi khối mang lại tính minh bạch và bảo mật cao cho các giao dịch tài chính. Công nghệ này đặc biệt hữu ích trong thanh toán xuyên biên giới, giúp giảm chi phí và tăng tốc độ xử lý giao dịch. Nhiều tổ chức tài chính đang nghiên cứu và ứng dụng blockchain để nâng cao hiệu quả hoạt động."
      } else if (question.toLowerCase().includes('ai') || question.toLowerCase().includes('machine learning')) {
        synthesizedResponse = "Trí tuệ nhân tạo (AI) và Machine Learning đang cách mạng hóa ngành tài chính thông qua việc phân tích dữ liệu khách hàng, dự đoán rủi ro tín dụng và phát hiện gian lận. Các ngân hàng sử dụng AI để cải thiện trải nghiệm khách hàng và tối ưu hóa quy trình ra quyết định tín dụng."
      } else {
        synthesizedResponse = "Ngành FinTech và các lĩnh vực liên quan đang phát triển nhanh chóng với nhiều xu hướng mới như thanh toán số, ví điện tử, và thị trường vốn số. Những công nghệ này mở ra nhiều cơ hội nghề nghiệp và đổi mới trong lĩnh vực tài chính."
      }
      
      return `${synthesizedResponse}\n\nNguồn: ${domains}`
      
    } catch (error) {
      console.error("Error in industry mode:", error)
      return "Xin lỗi, hiện tại tôi không thể tìm kiếm thông tin về chủ đề này. Vui lòng thử lại sau."
    }
  }
}

export default function ChatbotPage() {
  const [selectedMode, setSelectedMode] = useState<ChatMode>("club")
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isSending, setIsSending] = useState(false)
  const [triggerQuestion, setTriggerQuestion] = useState<string>("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (triggerQuestion) {
      handleSendMessage(triggerQuestion)
      setTriggerQuestion("")
    }
  }, [triggerQuestion])

  async function handleSendMessage(messageOverride?: string) {
    const q = (messageOverride || inputValue).trim()
    if (!q || isSending) return

    const newUserMsg: ChatMessage = { 
      id: crypto.randomUUID(), 
      role: "user", 
      content: q, 
      mode: selectedMode, 
      ts: Date.now() 
    }
    
    setMessages(prev => [...prev, newUserMsg])
    if (!messageOverride) setInputValue("")
    setIsSending(true)

    try {
      let botText: string | null = null

      // Priority 1: Check for FAQ matches (only in club mode)
      if (selectedMode === "club") {
        const faqAnswer = faqMatchOrNull(q)
        if (faqAnswer) {
          botText = faqAnswer
        }
      }

      // Priority 2: Call Gemini API if no FAQ match found
      if (!botText) {
        const chatHistory = messages.slice(-6).map(m => ({ 
          role: m.role, 
          content: m.content 
        }))
        botText = await callGeminiAPI(selectedMode, q, chatHistory)
      }

      // Priority 3: Fallback response
      if (!botText) {
        botText = selectedMode === "club" 
          ? "Xin lỗi, tôi chưa thể trả lời câu hỏi này. Bạn có thể tham khao thêm thông tin tại Fanpage: https://www.facebook.com/clbfintechuel"
          : "Xin lỗi, hiện tại tôi chưa thể cung cấp thông tin về chủ đề này."
      }

      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: botText,
        mode: selectedMode,
        ts: Date.now(),
      }
      setMessages(prev => [...prev, botMsg])
      
    } catch (error) {
      console.error("Error in handleSendMessage:", error)
      setMessages(prev => [
        ...prev,
        { 
          id: crypto.randomUUID(), 
          role: "assistant", 
          content: selectedMode === "club" 
            ? "Xin lỗi, có lỗi xảy ra. Bạn có thể tham khảo thông tin tại Fanpage FTC: https://www.facebook.com/clbfintechuel"
            : "Xin lỗi, có lỗi xảy ra khi xử lý câu hỏi.", 
          mode: selectedMode, 
          ts: Date.now() 
        },
      ])
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

  const handleQuestionSelect = (question: string) => {
    setSelectedMode("club") // Auto switch to club mode for suggested questions
    setTriggerQuestion(question)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation />
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#003663]/10 to-[#0EA5E9]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#0284C7]/10 to-[#003663]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#003663] to-[#004785] rounded-2xl mb-6 shadow-xl">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#003663] to-[#0EA5E9] text-transparent bg-clip-text mb-4">
            FTC CHATBOT
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Trợ lý AI thông minh dành cho sinh viên về Câu lạc bộ Công nghệ tài chính FTC
          </p>
        </div>

        {/* Main Layout */}
        <div className="flex gap-8 justify-center items-start">
          {/* Chat Window */}
          <div className="flex-shrink-0">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#003663] to-[#004785] p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">FTC Bot</h3>
                      <div className="flex items-center gap-2 text-sm text-blue-100">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>Đang hoạt động</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 hover:bg-white/10 rounded-xl transition-all">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-xl transition-all">
                      <Minimize2 className="h-5 w-5" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-xl transition-all">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Mode Selector */}
              <div className="p-6 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
                <div className="flex gap-2">
                  {CHAT_MODES.map((mode) => {
                    const Icon = mode.icon
                    const isActive = selectedMode === mode.mode
                    return (
                      <button
                        key={mode.mode}
                        onClick={() => setSelectedMode(mode.mode)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 flex-1 ${
                          isActive 
                            ? `bg-gradient-to-r ${mode.color} text-white shadow-lg shadow-[#003663]/25 scale-105` 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-700'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{mode.label}</span>
                      </button>
                    )
                  })}
                </div>
                <p className="text-xs text-slate-500 mt-3 text-center">
                  {selectedMode === "club" ? "💼 Thông tin câu lạc bộ FTC" : "📚 Kiến thức FinTech"}
                </p>
              </div>

              {/* Messages Area */}
              <div className="h-96 overflow-y-auto p-6 bg-gradient-to-b from-white to-slate-50">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#003663] to-[#0EA5E9] rounded-3xl flex items-center justify-center mb-6 shadow-xl">
                      <Bot className="h-10 w-10 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-[#003663] mb-3">Xin chào bạn!</h4>
                    <p className="text-sm text-slate-600 mb-6 max-w-xs leading-relaxed">
                      {selectedMode === "club" 
                        ? "Tôi có thể giúp bạn tìm hiểu về câu lạc bộ FTC. Hãy đặt câu hỏi nhé!" 
                        : "Khám phá thế giới FinTech cùng tôi!"}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <div className="w-2 h-2 bg-[#0EA5E9] rounded-full animate-pulse"></div>
                      <span>Sẵn sàng hỗ trợ</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                          msg.role === 'user' 
                            ? 'bg-gradient-to-br from-[#0EA5E9] to-[#0284C7]' 
                            : 'bg-gradient-to-br from-[#003663] to-[#004785]'
                        }`}>
                          {msg.role === 'user' ? (
                            <div className="w-6 h-6 bg-white rounded-full"></div>
                          ) : (
                            <Bot className="h-6 w-6 text-white" />
                          )}
                        </div>
                        
                        <div className={`max-w-[75%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                          <div className={`inline-block p-4 rounded-2xl text-sm leading-relaxed shadow-md ${
                            msg.role === 'user'
                              ? 'bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white'
                              : 'bg-white text-slate-700 border border-slate-100'
                          }`}>
                            <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, "<br/>") }} />
                          </div>
                          {msg.ts && (
                            <div className={`text-xs text-slate-400 mt-2 ${msg.role === 'user' ? 'text-right' : ''}`}>
                              {new Date(msg.ts).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          )}
                          {/* Show loading indicator for industry mode */}
                          {msg.role === 'assistant' && msg.mode === 'industry' && isSending && msg === messages[messages.length - 1] && (
                            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                              <div className="w-4 h-4 border-2 border-slate-300 border-t-[#0EA5E9] rounded-full animate-spin"></div>
                              <span>Đang tìm kiếm thông tin...</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-6 bg-gradient-to-r from-slate-50 to-white border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Nhắn tin cho FTC Bot..."
                      className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-[#003663] focus:ring-4 focus:ring-[#003663]/10 text-sm transition-all bg-white/50 backdrop-blur-sm"
                      disabled={isSending}
                    />
                  </div>
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isSending}
                    className="w-12 h-12 bg-gradient-to-r from-[#003663] to-[#004785] hover:from-[#004785] hover:to-[#005a99] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl flex items-center justify-center transition-all shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    {isSending ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {/* Loading indicator for industry mode */}
                {isSending && selectedMode === 'industry' && (
                  <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-[#0EA5E9] rounded-full animate-spin"></div>
                    <span>🔍 Đang tìm kiếm thông tin từ Google...</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-3 bg-gradient-to-r from-slate-50 to-white text-center border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  Powered by ⚡ <span className="font-semibold text-[#003663]">FTC</span>
                  {selectedMode === 'industry' && <span className="ml-2">• Tích hợp Google Search</span>}
                </span>
              </div>
            </div>
          </div>

          {/* Suggested Questions */}
          <div className="flex-shrink-0">
            <div className="w-full max-w-sm bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#003663] to-[#004785] p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                <div className="relative flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <HelpCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Câu hỏi gợi ý</h3>
                    <p className="text-sm text-blue-100">Nhấp để hỏi ngay</p>
                  </div>
                </div>
              </div>

              {/* Questions List */}
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto bg-gradient-to-b from-white to-slate-50">
                {SUGGESTED_QUESTIONS.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionSelect(question)}
                    className="w-full text-left p-4 rounded-2xl border-2 border-slate-100 hover:border-[#003663]/30 hover:bg-[#003663]/5 transition-all duration-300 group transform hover:scale-[1.02]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#003663] to-[#004785] text-white rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-md">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800 group-hover:text-[#003663] leading-relaxed mb-2">
                          {question}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-[#003663]" />
                            <span className="text-xs text-[#003663] font-medium">Câu lạc bộ</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Send className="h-3 w-3 text-slate-400 group-hover:text-[#003663] transition-colors" />
                            <span className="text-xs text-slate-400 group-hover:text-[#003663] transition-colors">Gửi</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-t border-slate-100">
                <div className="text-xs text-slate-600 space-y-2">
                  <div className="flex items-center justify-between">
                    <span>💡 Mẹo: Nhấp câu hỏi để hỏi nhanh</span>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-600 font-medium">Sẵn sàng</span>
                    </div>
                  </div>
                  <div className="bg-[#003663]/5 rounded-xl p-3 border border-[#003663]/10">
                    <h4 className="text-xs font-semibold text-[#003663] mb-1 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Hướng dẫn sử dụng
                    </h4>
                    <ul className="text-xs text-slate-600 space-y-1">
                      <li>• <strong>Chế độ CLB:</strong> Thông tin chính xác về FTC</li>
                      <li>• <strong>Chế độ Ngành:</strong> Kiến thức FinTech từ Google</li>
                      <li>• <strong>Câu hỏi gợi ý:</strong> Auto chuyển sang chế độ CLB</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
