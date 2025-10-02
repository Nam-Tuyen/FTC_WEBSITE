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
    <form onSubmit={submit} className="space-y-2">
      <textarea className="w-full border rounded p-2" rows={3} placeholder="Viết phản hồi..." value={content} onChange={e=>setContent(e.target.value)} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={anonymous} onChange={e=>setAnonymous(e.target.checked)} />
        Trả lời ẩn danh
      </label>
      <button className="bg-black text-white rounded px-4 py-2" disabled={loading}>{loading?"Đang gửi...":"Gửi phản hồi"}</button>
    </form>
  );
}
