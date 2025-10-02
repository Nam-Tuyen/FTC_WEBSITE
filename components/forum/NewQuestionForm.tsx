"use client";
import { useState } from "react";
import { ForumApi } from "@/lib/forumApi";
import { useAuth } from "@/context/AuthContext";

const CATS = ["Hỏi về ngành học","Hỏi về câu lạc bộ","Thảo luận"] as const;

export default function NewQuestionForm({ onCreated }: { onCreated?: () => void }) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<typeof CATS[number]>("Thảo luận");
  const [content, setContent] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [err, setErr] = useState(""); const [loading, setLoading]=useState(false);

  async function submit(e: React.FormEvent){
    e.preventDefault(); setErr(""); if(!user) return setErr("Vui lòng đăng nhập.");
    try{
      setLoading(true);
      const res = await ForumApi.createQuestion({ title, category, user: user.mssv, content, anonymous });
      if(!res.ok) throw new Error(res.message || "Tạo câu hỏi thất bại");
      setTitle(""); setContent(""); setAnonymous(true);
      onCreated?.();
    }catch(e:any){ setErr(e.message); }
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Tiêu đề câu hỏi</label>
          <input 
            className="w-full border-2 border-slate-600/30 rounded-lg p-3 bg-slate-700/50 text-white placeholder-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200" 
            placeholder="Nhập tiêu đề câu hỏi..." 
            value={title} 
            onChange={e=>setTitle(e.target.value)} 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Danh mục</label>
          <select 
            className="w-full border-2 border-slate-600/30 rounded-lg p-3 bg-slate-700/50 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200" 
            value={category} 
            onChange={e=>setCategory(e.target.value as any)}
          >
            {CATS.map(c=> <option key={c} value={c} className="bg-slate-700">{c}</option>)}
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">Nội dung câu hỏi</label>
        <textarea 
          className="w-full border-2 border-slate-600/30 rounded-lg p-3 bg-slate-700/50 text-white placeholder-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 resize-none" 
          rows={4} 
          placeholder="Mô tả chi tiết câu hỏi của bạn..." 
          value={content} 
          onChange={e=>setContent(e.target.value)} 
        />
      </div>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input 
            type="checkbox" 
            checked={anonymous} 
            onChange={e=>setAnonymous(e.target.checked)}
            className="w-4 h-4 text-orange-500 bg-slate-700 border-slate-600 rounded focus:ring-orange-500 focus:ring-2"
          />
          <span>Đăng ẩn danh</span>
        </label>
      </div>

      {err && (
        <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white border-2 border-red-400 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-lg">❌</span>
            <span className="font-semibold">{err}</span>
          </div>
        </div>
      )}

      <button 
        disabled={loading} 
        className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg px-6 py-3 font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Đang tạo câu hỏi...</span>
          </>
        ) : (
          <>
            <span>💬</span>
            <span>Đăng câu hỏi</span>
          </>
        )}
      </button>
    </form>
  );
}
