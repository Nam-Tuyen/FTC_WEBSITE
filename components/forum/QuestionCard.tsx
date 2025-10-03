"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import LikeButton from "./LikeButton";
import { useAuth } from "@/context/AuthContext";

export default function QuestionCard({ q }: { q: any }) {
  const { user } = useAuth();
  const [likeCount, setLikeCount] = useState(q.like_count || 0);
  const [isLiked, setIsLiked] = useState(false);

  // Check if current user has liked this question
  useEffect(() => {
    if (user && q.liked_by) {
      const userLiked = q.liked_by.includes(user.mssv);
      setIsLiked(userLiked);
    }
  }, [user, q.liked_by]);

  const handleLikeChange = (liked: boolean, newLikeCount: number) => {
    setIsLiked(liked);
    setLikeCount(newLikeCount);
  };

  return (
    <div className="group bg-gradient-to-br from-[#003663]/90 to-[#004a7c]/90 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl border border-blue-400/30 p-4 sm:p-6 lg:p-8 shadow-2xl hover:shadow-3xl hover:scale-[1.01] transition-all duration-300">
      {/* Header với category badge - Mobile Optimized */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <span className="px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border border-orange-400/30 flex-shrink-0">
            {q.category || 'Thảo luận'}
          </span>
          <span className="text-xs text-blue-300">
            {new Date(q.createdAt).toLocaleDateString('vi-VN')}
          </span>
        </div>
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:text-orange-300 transition-colors duration-200 leading-tight break-words">
          {q.title}
        </h3>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-200 mb-3 sm:mb-4">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex-shrink-0"></span>
          <span className="truncate">Người đăng: <span className="text-white font-semibold">{q.user}</span></span>
        </div>
      </div>

      {/* Content - Mobile Optimized */}
      <div className="mb-4 sm:mb-6">
        <p className="text-blue-100 leading-relaxed whitespace-pre-wrap text-sm sm:text-base lg:text-lg break-words">
          {q.content}
        </p>
      </div>

      {/* Footer với stats và action button - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-blue-400/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm lg:text-base text-blue-300">
            <span className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-orange-400 text-sm sm:text-base lg:text-lg">💬</span>
              <span className="text-xs sm:text-sm lg:text-base">{q.responses?.length || 0} phản hồi</span>
            </span>
            <span className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-red-400 text-sm sm:text-base lg:text-lg">❤️</span>
              <span className="text-xs sm:text-sm lg:text-base">{likeCount} lượt thích</span>
            </span>
          </div>
          {user && (
            <LikeButton
              questionId={q.id}
              initialLikes={likeCount}
              initialLiked={isLiked}
              onLikeChange={handleLikeChange}
            />
          )}
        </div>
        <Link 
          href={`/dien-dan/question/${q.id}`} 
          className="w-full sm:w-auto px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg sm:rounded-xl text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <span>Trả lời câu hỏi</span>
          <span className="text-sm sm:text-base lg:text-lg">→</span>
        </Link>
      </div>
    </div>
  );
}
