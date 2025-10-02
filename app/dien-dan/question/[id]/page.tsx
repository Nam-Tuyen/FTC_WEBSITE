"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ForumApi } from "@/lib/forumApi";
import type { QuestionItem } from "@/types/forum";
import LikeButton from "@/components/forum/LikeButton";
import NewResponseForm from "@/components/forum/NewResponseForm";
import CommentSection from "@/components/forum/CommentSection";
import { AuthProvider } from "@/context/AuthContext";

function DetailInner({ questionId }: { questionId: string }) {
  const [q, setQ] = useState<QuestionItem | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await ForumApi.fetchQuestions({ take: 100 });
    const found = res.data?.items?.find(x => x.id === questionId) || null;
    setQ(found);
    setLoading(false);
  }
  useEffect(() => { if(questionId) load(); }, [questionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003663] via-[#004a7c] to-[#003663] text-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <button 
            onClick={() => window.history.back()} 
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-slate-600/50 to-slate-700/50 hover:from-slate-500/50 hover:to-slate-600/50 text-slate-200 hover:text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105"
          >
            <span className="text-xl">←</span>
            <span>Quay lại danh sách</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
            <p className="text-blue-200 mt-4 text-lg">Đang tải câu hỏi...</p>
          </div>
        ) : !q ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">❓</div>
            <p className="text-blue-200 text-xl">Không tìm thấy câu hỏi</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Question Card */}
            <div className="bg-gradient-to-br from-[#003663]/90 to-[#004a7c]/90 backdrop-blur-xl rounded-3xl border border-blue-400/30 p-8 shadow-2xl">
              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border border-orange-400/30">
                      {q.category || 'Thảo luận'}
                    </span>
                    <span className="text-sm text-blue-300">
                      {new Date(q.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4 leading-tight">{q.title}</h2>
                  <div className="flex items-center gap-2 text-base text-blue-200">
                    <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></span>
                    <span>Người đăng: <span className="text-white font-semibold">{q.user}</span></span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <LikeButton questionId={q.id} initialLikes={q.like_count} />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border border-blue-400/20 rounded-2xl p-6">
                <p className="text-blue-100 leading-relaxed whitespace-pre-wrap text-lg">
                  {q.content}
                </p>
              </div>
            </div>

            {/* Responses Section */}
            <div className="bg-gradient-to-br from-[#003663]/90 to-[#004a7c]/90 backdrop-blur-xl rounded-3xl border border-blue-400/30 p-8 shadow-2xl">
              {/* Comment Section */}
              <CommentSection 
                questionId={q.id} 
                initialComments={q.responses || []} 
                onCommentAdded={load}
              />

              {/* New Response Form */}
              <div className="mt-8 pt-8 border-t border-blue-400/30">
                <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-xl">✍️</span>
                  Viết phản hồi mới
                </h4>
                <NewResponseForm questionId={q.id} onCreated={load} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page({ params }: { params: { id: string } }) {
  return (
    <AuthProvider>
      <DetailInner questionId={params.id} />
    </AuthProvider>
  );
}