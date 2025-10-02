"use client";
import { useState } from "react";
import { ForumApi } from "@/lib/forumApi";

export default function RegisterForm() {
  const [form, setForm] = useState({
    mssv:"", password:"", full_name:"", email:"",
    sec_q1:"Tên thú cưng đầu tiên?", sec_a1:"",
    sec_q2:"Trường tiểu học của bạn?", sec_a2:"",
    sec_q3:"Thành phố bạn sinh ra?", sec_a3:"",
  });
  const [msg, setMsg] = useState(""); const [err, setErr] = useState("");

  async function submit(e: React.FormEvent){
    e.preventDefault(); setMsg(""); setErr("");
    try {
      const res = await ForumApi.registerUser(form);
      if(!res.ok) throw new Error(res.message || "Đăng ký thất bại");
      setMsg("Đăng ký thành công. Hãy đăng nhập.");
    } catch(e:any){ setErr(e.message); }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {["mssv","password","full_name","email","sec_a1","sec_a2","sec_a3"].map((k) => (
          <input 
            key={k} 
            className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            type={k==="password"?"password":"text"}
            placeholder={k}
            value={(form as any)[k]}
            onChange={e=>setForm({...form, [k]: e.target.value})}
          />
        ))}
      </div>
      {err && (
        <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white border-2 border-red-400 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-lg">❌</span>
            <span className="font-semibold">{err}</span>
          </div>
        </div>
      )}
      {msg && (
        <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white border-2 border-green-400 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-lg">✅</span>
            <span className="font-semibold">{msg}</span>
          </div>
        </div>
      )}
      <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg px-6 py-3 font-semibold hover:shadow-lg transition-all duration-200">
        Đăng ký
      </button>
    </form>
  )
}
