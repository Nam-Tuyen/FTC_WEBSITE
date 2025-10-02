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
    <form onSubmit={submit} className="space-y-2 border p-4 rounded bg-white">
      <h3 className="font-semibold">Tạo câu hỏi</h3>
      <input className="w-full border rounded p-2" placeholder="Tiêu đề" value={title} onChange={e=>setTitle(e.target.value)} />
      <select className="w-full border rounded p-2" value={category} onChange={e=>setCategory(e.target.value as any)}>
        {CATS.map(c=> <option key={c} value={c}>{c}</option>)}
      </select>
      <textarea className="w-full border rounded p-2" rows={4} placeholder="Nội dung" value={content} onChange={e=>setContent(e.target.value)} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={anonymous} onChange={e=>setAnonymous(e.target.checked)} />
        Đăng ẩn danh
      </label>
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <button disabled={loading} className="bg-black text-white rounded px-4 py-2">{loading?"Đang tạo...":"Đăng câu hỏi"}</button>
    </form>
  );
}
