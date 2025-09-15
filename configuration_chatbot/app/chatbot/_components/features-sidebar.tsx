"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Zap, MessageSquare, Sparkles } from "lucide-react"

export function FeaturesSidebar() {
  return (
    <Card className="bg-card/20 backdrop-blur-sm border-accent/20 ring-1 ring-accent/10 hover:border-accent/40 transition-all duration-500 hover:glow">
      <CardHeader>
        <CardTitle className="text-lg font-heading flex items-center">
          <Sparkles className="h-5 w-5 mr-2" />
          Tính năng
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Bot className="h-4 w-4 text-accent" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">AI Thông minh</h4>
            <p className="text-xs text-muted-foreground">Hiểu ngữ cảnh và trả lời chính xác</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Zap className="h-4 w-4 text-accent" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">Phản hồi nhanh</h4>
            <p className="text-xs text-muted-foreground">Trả lời trong vài giây</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <MessageSquare className="h-4 w-4 text-accent" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">Hỗ trợ 24/7</h4>
            <p className="text-xs text-muted-foreground">Luôn sẵn sàng giúp đỡ</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
