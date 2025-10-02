"use client";
import { useState } from "react";
import { ForumApi } from "@/lib/forumApi";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const { setUser } = useAuth();
  const [mssv, setMssv] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr("");
    try {
      const res = await ForumApi.login({ mssv, password });
      if (!res.ok) throw new Error(res.message || "Đăng nhập thất bại");
      const u = res.data!;
      setUser({ userId: u.userId, mssv: u.mssv, full_name: u.full_name, email: u.email });
    } catch (e:any) { setErr(e.message); }
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <input 
          className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" 
          placeholder="MSSV (K+9 số)" 
          value={mssv} 
          onChange={e=>setMssv(e.target.value)} 
        />
        <input 
          className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" 
          type="password" 
          placeholder="Mật khẩu" 
          value={password} 
          onChange={e=>setPassword(e.target.value)} 
        />
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
        className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg px-6 py-3 font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
    </form>
  );
}
