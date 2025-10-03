"use client";
import { useState } from "react";
import { ForumApi } from "@/lib/forumApi";
import { useAuth } from "@/context/AuthContext";

interface Comment {
  id: string;
  user: string;
  content: string;
  createdAt: string | Date;
  parentId?: string;
  replies?: Comment[];
  like_count: number;
}

interface CommentThreadProps {
  comment: Comment;
  questionId: string;
  onReply: (parentId: string, content: string, anonymous: boolean) => void;
  level?: number;
}

export default function CommentThread({ 
  comment, 
  questionId, 
  onReply, 
  level = 0 
}: CommentThreadProps) {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replyAnonymous, setReplyAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onReply(comment.id, replyContent, replyAnonymous);
      setReplyContent("");
      setShowReplyForm(false);
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
    setIsSubmitting(false);
  };

  const isTopLevel = level === 0;
  const marginLeft = level * 4; // 4rem per level

  return (
    <div 
      className={`${isTopLevel ? 'bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border border-blue-400/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6' : 'ml-2 sm:ml-4 border-l-2 border-blue-400/30 pl-2 sm:pl-4'}`}
      style={{ marginLeft: `${marginLeft}rem` }}
    >
      {/* Comment Header - Mobile Optimized */}
      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
        <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-xs sm:text-sm">👤</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs sm:text-sm text-blue-200 font-semibold truncate">{comment.user}</div>
          <div className="text-xs text-blue-400">
            {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
          </div>
        </div>
      </div>

      {/* Comment Content - Mobile Optimized */}
      <div className="text-blue-100 leading-relaxed whitespace-pre-wrap text-sm sm:text-base mb-3 sm:mb-4 break-words">
        {comment.content}
      </div>

      {/* Comment Actions - Mobile Optimized */}
      <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="text-blue-300 hover:text-white transition-colors duration-200 flex items-center gap-1"
        >
          <span className="text-xs sm:text-sm">💬</span>
          <span className="text-xs sm:text-sm">Trả lời</span>
        </button>
        <span className="text-blue-400 text-xs sm:text-sm">
          {comment.replies?.length || 0} phản hồi
        </span>
      </div>

      {/* Reply Form - Mobile Optimized */}
      {showReplyForm && (
        <form onSubmit={handleReply} className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
          <div>
            <textarea
              className="w-full border-2 border-blue-400/30 rounded-lg sm:rounded-xl p-2 sm:p-3 bg-[#003663]/50 text-white placeholder-blue-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 resize-none text-sm sm:text-base"
              rows={3}
              placeholder="Viết phản hồi..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <label className="flex items-center gap-2 text-xs sm:text-sm text-blue-200 cursor-pointer">
              <input
                type="checkbox"
                checked={replyAnonymous}
                onChange={(e) => setReplyAnonymous(e.target.checked)}
                className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 bg-[#003663] border-blue-400 rounded focus:ring-orange-500 focus:ring-2"
              />
              <span>Trả lời ẩn danh</span>
            </label>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setShowReplyForm(false)}
                className="flex-1 sm:flex-none px-3 py-2 sm:px-4 sm:py-2 bg-slate-600/50 text-slate-300 rounded-lg font-semibold hover:bg-slate-500/50 transition-all duration-200 text-xs sm:text-sm"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !replyContent.trim()}
                className="flex-1 sm:flex-none px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
              >
                {isSubmitting ? "Đang gửi..." : "Gửi phản hồi"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Nested Replies - Mobile Optimized */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
          {comment.replies.map((reply) => (
            <CommentThread
              key={reply.id}
              comment={reply}
              questionId={questionId}
              onReply={onReply}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
