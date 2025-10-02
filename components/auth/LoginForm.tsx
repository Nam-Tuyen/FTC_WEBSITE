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
    <form onSubmit={onSubmit} className="space-y-3">
      <input className="w-full border rounded p-2" placeholder="MSSV (K+9 số)" value={mssv} onChange={e=>setMssv(e.target.value)} />
      <input className="w-full border rounded p-2" type="password" placeholder="Mật khẩu" value={password} onChange={e=>setPassword(e.target.value)} />
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <button disabled={loading} className="bg-black text-white rounded px-4 py-2">{loading?"Đang đăng nhập...":"Đăng nhập"}</button>
    </form>
  );
}
