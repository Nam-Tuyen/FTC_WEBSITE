"use client";
import Link from "next/link";
import LikeButton from "./LikeButton";

export default function QuestionCard({ q }: { q: any }) {
  return (
    <div className="group bg-gradient-to-br from-[#003663]/90 to-[#004a7c]/90 backdrop-blur-xl rounded-2xl border border-blue-400/30 p-6 shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all duration-300">
      {/* Header với category badge */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border border-orange-400/30">
              {q.category || 'Thảo luận'}
            </span>
            <span className="text-xs text-blue-300">
              {new Date(q.createdAt).toLocaleDateString('vi-VN')}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors duration-200">
            {q.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-blue-200">
            <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></span>
            <span>Người đăng: <span className="text-white font-semibold">{q.user}</span></span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <LikeButton questionId={q.id} initialLikes={q.like_count} />
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-blue-100 leading-relaxed whitespace-pre-wrap">
          {q.content}
        </p>
      </div>

      {/* Footer với action button */}
      <div className="flex items-center justify-between pt-4 border-t border-blue-400/30">
        <div className="flex items-center gap-4 text-sm text-blue-300">
          <span className="flex items-center gap-1">
            <span className="text-orange-400">💬</span>
            <span>{q.responses?.length || 0} phản hồi</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="text-red-400">❤️</span>
            <span>{q.like_count} lượt thích</span>
          </span>
        </div>
        <Link 
          href={`/dien-dan/question/${q.id}`} 
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
        >
          <span>Xem chi tiết</span>
          <span className="text-sm">→</span>
        </Link>
      </div>
    </div>
  );
}
