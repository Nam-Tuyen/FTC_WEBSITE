/ /app/chat/page.tsx
className="w-full text-left justify-start h-auto p-3 bg-transparent whitespace-normal break-words"
onClick={() => handleSuggestedQuestion(question)}
>
<MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
<span className="text-sm break-words">{question}</span>
</Button>
))}
</CardContent>
</Card>
</div>


<div className="col-start-3 col-span-1 row-start-2">
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
<div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
<Zap className="h-4 w-4 text-accent" />
</div>
<div>
<h4 className="font-semibold text-sm">Phản hồi nhanh</h4>
<p className="text-xs text-muted-foreground">Trả lời trong vài giây</p>
</div>
</div>
<div className="flex items-start space-x-3">
<div className="w-8 h-8 bg-chart-3/10 rounded-lg flex items-center justify-center">
<MessageSquare className="h-4 w-4 text-accent" />
</div>
<div>
<h4 className="font-semibold text-sm">Hỗ trợ 24/7</h4>
<p className="text-xs text-muted-foreground">Luôn sẵn sàng giúp đỡ</p>
</div>
</div>
</CardContent>
</Card>
</div>
</div>
</div>
</div>
);
}
