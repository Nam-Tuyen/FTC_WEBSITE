import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, MessageSquare } from 'lucide-react'
import { CATEGORIES } from '@/app/dien-dan/types'

export function QuestionCard({ q, children, onLike }: { q: any; children?: React.ReactNode; onLike?: () => void }) {
  const created = typeof q.createdAt === 'number' ? new Date(q.createdAt) : new Date(q.createdAt || Date.now())
  const likes = typeof q.likes === 'number' ? q.likes : Array.isArray(q.likes) ? q.likes.length : 0
  const replies = typeof q.repliesCount === 'number' ? q.repliesCount : Array.isArray(q.replies) ? q.replies.length : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{q.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs text-slate-500">Chủ đề: {CATEGORIES[q.category] ?? q.category} • {created.toLocaleString()}</div>
        <p className="text-sm whitespace-pre-wrap">{q.content}</p>
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <button className="inline-flex items-center gap-1" onClick={onLike} aria-label="Like">
            <Heart className="w-4 h-4" /> {likes}
          </button>
          <span className="inline-flex items-center gap-1"><MessageSquare className="w-4 h-4" /> {replies}</span>
        </div>
        {children}
      </CardContent>
    </Card>
  )
}
