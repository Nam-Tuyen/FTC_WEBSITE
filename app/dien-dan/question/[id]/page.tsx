"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ForumApi } from "@/lib/forumApi";
import type { QuestionItem } from "@/types/forum";
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
        {/* Modern Back Button */}
        <div className="mb-8">
          <button 
            onClick={() => window.history.back()} 
            className="group relative inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-blue-400/30 rounded-2xl text-white font-bold hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Icon with Animation */}
            <div className="relative flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full group-hover:scale-110 transition-transform duration-300">
              <span className="text-lg group-hover:-translate-x-0.5 transition-transform duration-300">←</span>
            </div>
            
            {/* Text */}
            <span className="relative text-lg group-hover:text-blue-100 transition-colors duration-300">
              Quay lại danh sách
            </span>
            
            {/* Hover Effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
              <div className="mb-6">
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