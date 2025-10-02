"use client";
import Link from "next/link";

export default function QuestionCard({ q }: { q: any }) {
  return (
    <div className="group bg-gradient-to-br from-[#003663]/90 to-[#004a7c]/90 backdrop-blur-xl rounded-3xl border border-blue-400/30 p-8 shadow-2xl hover:shadow-3xl hover:scale-[1.01] transition-all duration-300">
      {/* Header với category badge */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border border-orange-400/30">
            {q.category || 'Thảo luận'}
          </span>
          <span className="text-xs text-blue-300">
            {new Date(q.createdAt).toLocaleDateString('vi-VN')}
          </span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-300 transition-colors duration-200">
          {q.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-blue-200 mb-4">
          <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></span>
          <span>Người đăng: <span className="text-white font-semibold">{q.user}</span></span>
        </div>
      </div>

      {/* Content */}
      <div className="mb-6">
        <p className="text-blue-100 leading-relaxed whitespace-pre-wrap text-lg">
          {q.content}
        </p>
      </div>

      {/* Footer với stats và action button */}
      <div className="flex items-center justify-between pt-6 border-t border-blue-400/30">
        <div className="flex items-center gap-6 text-base text-blue-300">
          <span className="flex items-center gap-2">
            <span className="text-orange-400 text-lg">💬</span>
            <span>{q.responses?.length || 0} phản hồi</span>
          </span>
        </div>
        <Link 
          href={`/dien-dan/question/${q.id}`} 
          className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl text-white font-bold hover:shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Text */}
          <span className="relative">Xem chi tiết</span>
          
          {/* Arrow Icon with Animation */}
          <div className="relative flex items-center justify-center w-6 h-6 bg-white/20 rounded-full group-hover:scale-110 transition-transform duration-300">
            <span className="text-lg group-hover:translate-x-0.5 transition-transform duration-300">→</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
