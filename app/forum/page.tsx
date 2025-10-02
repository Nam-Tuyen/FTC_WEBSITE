"use client";
import { useEffect, useState } from "react";
import { ForumApi } from "@/lib/forumApi";
import type { QuestionItem } from "@/types/forum";
import QuestionCard from "@/components/forum/QuestionCard";
import NewQuestionForm from "@/components/forum/NewQuestionForm";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { AuthProvider, useAuth } from "@/context/AuthContext";

function ForumHome() {
  const [items, setItems] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"forum"|"login"|"register">("forum");
  const { user, logout } = useAuth();

  async function load() {
    setLoading(true);
    const res = await ForumApi.fetchQuestions({ take: 30 });
    setItems(res.data?.items || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <header className="flex items-center justify-between bg-white p-4 rounded shadow">
          <h1 className="text-2xl font-bold">Diễn đàn FTC</h1>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="text-sm text-gray-600">Xin chào, {user.full_name} ({user.mssv})</span>
                <button className="text-sm underline" onClick={logout}>Đăng xuất</button>
              </>
            ) : (
              <>
                <button className={`text-sm ${tab==="login"?"font-semibold underline":""}`} onClick={()=>setTab("login")}>Đăng nhập</button>
                <button className={`text-sm ${tab==="register"?"font-semibold underline":""}`} onClick={()=>setTab("register")}>Đăng ký</button>
              </>
            )}
          </div>
        </header>

        {tab==="login" && <div className="border rounded p-4 bg-white"><LoginForm /></div>}
        {tab==="register" && <div className="border rounded p-4 bg-white"><RegisterForm /></div>}

        <NewQuestionForm onCreated={load} />

        {loading ? <p>Đang tải...</p> : (
          <div className="grid gap-3">
            {items.map(q => <QuestionCard key={q.id} q={q} />)}
            {items.length===0 && <p className="text-gray-500">Chưa có câu hỏi.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return <AuthProvider><ForumHome /></AuthProvider>;
}
