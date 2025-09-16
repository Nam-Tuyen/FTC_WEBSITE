"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, HelpCircle } from "lucide-react"

const suggestedQuestions = [
  "Câu lạc bộ có những hoạt động gì?",
  "Làm thế nào để tham gia câu lạc bộ?",
  "Các ban trong câu lạc bộ làm gì?",
  "Thời gian sinh hoạt diễn ra khi nào?",
  "Cần kỹ năng gì để ứng tuyển?",
  "Câu lạc bộ được thành lập khi nào?",
  "Câu lạc bộ có những thành tích gì?",
]

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void
}

export function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  return (
    <Card className="flex flex-col bg-card/20 backdrop-blur-sm border-accent/20 ring-1 ring-accent/10 hover:border-accent/40 transition-all duration-500 hover:glow">
      <CardHeader>
        <CardTitle className="text-lg font-heading flex items-center">
          <HelpCircle className="h-5 w-5 mr-2" />
          Câu hỏi gợi ý
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 flex-1 overflow-y-auto">
        {suggestedQuestions.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full text-left justify-start h-auto p-3 bg-transparent whitespace-normal break-words"
            onClick={() => {
            // notify chat to fill input
            try { window.dispatchEvent(new CustomEvent('chat:selectQuestion', { detail: question })) } catch (_) {}
            onSelect(question)
          }}
          >
            <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm break-words">{question}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
