"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ForumApi } from "@/lib/forumApi";
import type { QuestionItem } from "@/types/forum";
import LikeButton from "@/components/forum/LikeButton";
import NewResponseForm from "@/components/forum/NewResponseForm";
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
    <div className="min-h-screen bg-[#003663] text-white">
      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <button onClick={() => window.history.back()} className="text-sm underline">← Quay lại danh sách</button>

        {loading ? <p>Đang tải...</p> : !q ? <p>Không tìm thấy câu hỏi.</p> : (
          <>
            <div className="border rounded p-4 bg-white/10 backdrop-blur-xl">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{q.title}</h2>
                  <div className="text-xs text-white/70">{q.category} • người đăng: {q.user}</div>
                </div>
                <LikeButton questionId={q.id} initialLikes={q.like_count} />
              </div>
              <p className="mt-2 whitespace-pre-wrap">{q.content}</p>
            </div>

            <div className="border rounded p-4 bg-white/10 backdrop-blur-xl">
              <h3 className="font-semibold mb-2">Phản hồi</h3>
              <div className="space-y-3">
                {(q.responses || []).map(r => (
                  <div key={r.id} className="border rounded p-3 bg-white/5">
                    <div className="text-xs text-white/70 mb-1">{r.user}</div>
                    <div className="whitespace-pre-wrap">{r.content}</div>
                  </div>
                ))}
                {q.responses?.length===0 && <p className="text-white/70 text-sm">Chưa có phản hồi.</p>}
              </div>

              <div className="mt-4">
                <NewResponseForm questionId={q.id} onCreated={load} />
              </div>
            </div>
          </>
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