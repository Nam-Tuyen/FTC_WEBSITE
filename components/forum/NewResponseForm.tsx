"use client";
import { useState } from "react";
import { ForumApi } from "@/lib/forumApi";
import { useAuth } from "@/context/AuthContext";

export default function NewResponseForm({ questionId, onCreated }:{ questionId: string; onCreated?: ()=>void }) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if(!user) return alert("Vui lòng đăng nhập.");
    setLoading(true);
    const res = await ForumApi.createResponse({ user: user.mssv, anonymous, content, questionId });
    if(res.ok) { setContent(""); onCreated?.(); }
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div>
        <label className="block text-lg font-semibold text-blue-200 mb-3">
          Viết phản hồi
        </label>
        <textarea 
          className="w-full border-2 border-blue-400/30 rounded-xl p-4 bg-[#003663]/50 text-white placeholder-blue-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 resize-none text-lg" 
          rows={4} 
          placeholder="Chia sẻ suy nghĩ của bạn về câu hỏi này..." 
          value={content} 
          onChange={e=>setContent(e.target.value)} 
        />
      </div>
      
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-3 text-lg text-blue-200 cursor-pointer">
          <input 
            type="checkbox" 
            checked={anonymous} 
            onChange={e=>setAnonymous(e.target.checked)}
            className="w-5 h-5 text-orange-500 bg-[#003663] border-blue-400 rounded focus:ring-orange-500 focus:ring-2"
          />
          <span>Trả lời ẩn danh</span>
        </label>
      </div>
      
      <button 
        className="group relative w-full bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl px-8 py-4 font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg overflow-hidden"
        disabled={loading}
      >
        {loading ? (
          <>
            {/* Loading Animation */}
            <div className="relative">
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-6 h-6 border-3 border-orange-300/50 border-r-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
            </div>
            <span className="animate-pulse">Đang gửi phản hồi...</span>
            
            {/* Loading Progress Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </>
        ) : (
          <>
            <span className="text-xl group-hover:scale-110 transition-transform duration-200">💬</span>
            <span>Gửi phản hồi</span>
            
            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
          </>
        )}
      </button>
    </form>
  );
}
