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
    <form onSubmit={submit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-lg font-semibold text-blue-200 mb-3">Tiêu đề câu hỏi</label>
          <input 
            className="w-full border-2 border-blue-400/30 rounded-xl p-4 bg-[#003663]/50 text-white placeholder-blue-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 text-lg" 
            placeholder="Nhập tiêu đề câu hỏi..." 
            value={title} 
            onChange={e=>setTitle(e.target.value)} 
          />
        </div>
        <div>
          <label className="block text-lg font-semibold text-blue-200 mb-3">Danh mục</label>
          <select 
            className="w-full border-2 border-blue-400/30 rounded-xl p-4 bg-[#003663]/50 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 text-lg" 
            value={category} 
            onChange={e=>setCategory(e.target.value as any)}
          >
            {CATS.map(c=> <option key={c} value={c} className="bg-[#003663]">{c}</option>)}
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-lg font-semibold text-blue-200 mb-3">Nội dung câu hỏi</label>
        <textarea 
          className="w-full border-2 border-blue-400/30 rounded-xl p-4 bg-[#003663]/50 text-white placeholder-blue-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 resize-none text-lg" 
          rows={6} 
          placeholder="Mô tả chi tiết câu hỏi của bạn..." 
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
          <span>Đăng ẩn danh</span>
        </label>
      </div>

      {err && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white border-2 border-red-400 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="text-xl">❌</span>
            <span className="font-semibold text-lg">{err}</span>
          </div>
        </div>
      )}

      <button 
        disabled={loading} 
        className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl px-8 py-4 font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Đang tạo câu hỏi...</span>
          </>
        ) : (
          <>
            <span className="text-xl">💬</span>
            <span>Đăng câu hỏi</span>
          </>
        )}
      </button>
    </form>
  );
}
