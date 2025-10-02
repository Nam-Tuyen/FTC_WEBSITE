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
    <form onSubmit={submit} className="space-y-2">
      {["mssv","password","full_name","email","sec_a1","sec_a2","sec_a3"].map((k) => (
        <input key={k} className="w-full border rounded p-2"
          type={k==="password"?"password":"text"}
          placeholder={k}
          value={(form as any)[k]}
          onChange={e=>setForm({...form, [k]: e.target.value})}/>
      ))}
      {err && <p className="text-red-600 text-sm">{err}</p>}
      {msg && <p className="text-green-600 text-sm">{msg}</p>}
      <button className="bg-black text-white rounded px-4 py-2">Đăng ký</button>
    </form>
  )
}
