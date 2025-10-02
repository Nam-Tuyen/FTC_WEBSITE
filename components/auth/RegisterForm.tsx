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
    <form onSubmit={submit} className="space-y-6">
      {/* Thông tin cơ bản */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></span>
          Thông tin cơ bản
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-blue-200 mb-2">
              Mã số sinh viên của bạn
            </label>
            <input 
              className="w-full border-2 border-blue-400/30 rounded-lg p-3 bg-[#003663]/50 text-white placeholder-blue-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
              type="text"
              placeholder="Nhập MSSV (VD: K225123456)"
              value={form.mssv}
              onChange={e=>setForm({...form, mssv: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-blue-200 mb-2">
              Hãy đặt mật khẩu cho tài khoản của bạn
            </label>
            <input 
              className="w-full border-2 border-blue-400/30 rounded-lg p-3 bg-[#003663]/50 text-white placeholder-blue-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
              type="password"
              placeholder="Nhập mật khẩu mạnh"
              value={form.password}
              onChange={e=>setForm({...form, password: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-blue-200 mb-2">
              Họ và tên đầy đủ của bạn
            </label>
            <input 
              className="w-full border-2 border-blue-400/30 rounded-lg p-3 bg-[#003663]/50 text-white placeholder-blue-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
              type="text"
              placeholder="Nhập họ tên đầy đủ"
              value={form.full_name}
              onChange={e=>setForm({...form, full_name: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-blue-200 mb-2">
              Hãy nhập email của bạn
            </label>
            <input 
              className="w-full border-2 border-blue-400/30 rounded-lg p-3 bg-[#003663]/50 text-white placeholder-blue-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
              type="email"
              placeholder="Nhập email liên hệ"
              value={form.email}
              onChange={e=>setForm({...form, email: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* Từ khóa bí mật */}
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-400/30 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <span className="text-orange-400">🔐</span>
            Từ khóa bí mật
          </h4>
          <p className="text-sm text-orange-200 leading-relaxed">
            Nhằm mục đích hỗ trợ bạn khôi phục tài khoản khi xảy ra sự cố hãy nhập 3 từ khóa bí mật của riêng bạn để sau này sử dụng làm phương thức xác thực để cài đặt lại mật khẩu
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-blue-200 mb-2">
              Từ khóa 1
            </label>
            <input 
              className="w-full border-2 border-blue-400/30 rounded-lg p-3 bg-[#003663]/50 text-white placeholder-blue-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
              type="text"
              placeholder="Từ khóa bí mật 1"
              value={form.sec_a1}
              onChange={e=>setForm({...form, sec_a1: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-blue-200 mb-2">
              Từ khóa 2
            </label>
            <input 
              className="w-full border-2 border-blue-400/30 rounded-lg p-3 bg-[#003663]/50 text-white placeholder-blue-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
              type="text"
              placeholder="Từ khóa bí mật 2"
              value={form.sec_a2}
              onChange={e=>setForm({...form, sec_a2: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-blue-200 mb-2">
              Từ khóa 3
            </label>
            <input 
              className="w-full border-2 border-blue-400/30 rounded-lg p-3 bg-[#003663]/50 text-white placeholder-blue-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
              type="text"
              placeholder="Từ khóa bí mật 3"
              value={form.sec_a3}
              onChange={e=>setForm({...form, sec_a3: e.target.value})}
            />
          </div>
        </div>
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
