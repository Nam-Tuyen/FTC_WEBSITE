"use client";
import { useState } from "react";
import { ForumApi } from "@/lib/forumApi";

export default function RegisterForm() {
  const [form, setForm] = useState({
    mssv:"", password:"", full_name:"", email:"",
    sec_q1:"", sec_a1:"",
    sec_q2:"", sec_a2:"",
    sec_q3:"", sec_a3:"",
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
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <span className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></span>
                Thông tin cơ bản
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-blue-200 mb-3">
                    Mã số sinh viên của bạn
                  </label>
                  <input 
                    className="w-full border-2 border-blue-400/30 rounded-xl p-4 bg-[#003663]/50 text-white placeholder-blue-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 text-lg"
                    type="text"
                    placeholder="Nhập MSSV (VD: K225123456)"
                    value={form.mssv}
                    onChange={e=>setForm({...form, mssv: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-lg font-semibold text-blue-200 mb-3">
                    Hãy đặt mật khẩu cho tài khoản của bạn
                  </label>
                  <input 
                    className="w-full border-2 border-blue-400/30 rounded-xl p-4 bg-[#003663]/50 text-white placeholder-blue-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 text-lg"
                    type="password"
                    placeholder="Nhập mật khẩu mạnh"
                    value={form.password}
                    onChange={e=>setForm({...form, password: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-lg font-semibold text-blue-200 mb-3">
                    Họ và tên đầy đủ của bạn
                  </label>
                  <input 
                    className="w-full border-2 border-blue-400/30 rounded-xl p-4 bg-[#003663]/50 text-white placeholder-blue-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 text-lg"
                    type="text"
                    placeholder="Nhập họ tên đầy đủ"
                    value={form.full_name}
                    onChange={e=>setForm({...form, full_name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-lg font-semibold text-blue-200 mb-3">
                    Hãy nhập email của bạn
                  </label>
                  <input 
                    className="w-full border-2 border-blue-400/30 rounded-xl p-4 bg-[#003663]/50 text-white placeholder-blue-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 text-lg"
                    type="email"
                    placeholder="Nhập email liên hệ"
                    value={form.email}
                    onChange={e=>setForm({...form, email: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Câu hỏi bảo mật */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-400/30 rounded-xl p-6">
                <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                  <span className="text-orange-400 text-2xl">🔐</span>
                  Câu hỏi bảo mật
                </h4>
                <p className="text-base text-orange-200 leading-relaxed">
                  Nhằm mục đích hỗ trợ bạn khôi phục tài khoản khi xảy ra sự cố hãy tự tạo 3 câu hỏi bảo mật và câu trả lời của riêng bạn để sử dụng làm phương thức xác thực để cài đặt lại mật khẩu
                </p>
              </div>
              
              <div className="space-y-8">
                {/* Câu hỏi 1 */}
                <div className="bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border border-blue-400/20 rounded-xl p-6">
                  <h5 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-sm">1</span>
                    Câu hỏi bảo mật 1
                  </h5>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-base font-semibold text-blue-200 mb-2">
                        Câu hỏi của bạn
                      </label>
                      <input 
                        className="w-full border-2 border-blue-400/30 rounded-xl p-4 bg-[#003663]/50 text-white placeholder-blue-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 text-lg"
                        type="text"
                        placeholder="VD: Tên thú cưng đầu tiên của bạn là gì?"
                        value={form.sec_q1}
                        onChange={e=>setForm({...form, sec_q1: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-blue-200 mb-2">
                        Câu trả lời
                      </label>
                      <input 
                        className="w-full border-2 border-blue-400/30 rounded-xl p-4 bg-[#003663]/50 text-white placeholder-blue-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 text-lg"
                        type="text"
                        placeholder="Nhập câu trả lời cho câu hỏi trên"
                        value={form.sec_a1}
                        onChange={e=>setForm({...form, sec_a1: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Câu hỏi 2 */}
                <div className="bg-gradient-to-r from-green-500/5 to-emerald-500/5 border border-green-400/20 rounded-xl p-6">
                  <h5 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-sm">2</span>
                    Câu hỏi bảo mật 2
                  </h5>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-base font-semibold text-blue-200 mb-2">
                        Câu hỏi của bạn
                      </label>
                      <input 
                        className="w-full border-2 border-blue-400/30 rounded-xl p-4 bg-[#003663]/50 text-white placeholder-blue-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 text-lg"
                        type="text"
                        placeholder="VD: Trường tiểu học của bạn tên gì?"
                        value={form.sec_q2}
                        onChange={e=>setForm({...form, sec_q2: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-blue-200 mb-2">
                        Câu trả lời
                      </label>
                      <input 
                        className="w-full border-2 border-blue-400/30 rounded-xl p-4 bg-[#003663]/50 text-white placeholder-blue-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 text-lg"
                        type="text"
                        placeholder="Nhập câu trả lời cho câu hỏi trên"
                        value={form.sec_a2}
                        onChange={e=>setForm({...form, sec_a2: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Câu hỏi 3 */}
                <div className="bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-purple-400/20 rounded-xl p-6">
                  <h5 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-sm">3</span>
                    Câu hỏi bảo mật 3
                  </h5>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-base font-semibold text-blue-200 mb-2">
                        Câu hỏi của bạn
                      </label>
                      <input 
                        className="w-full border-2 border-blue-400/30 rounded-xl p-4 bg-[#003663]/50 text-white placeholder-blue-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 text-lg"
                        type="text"
                        placeholder="VD: Thành phố bạn sinh ra là gì?"
                        value={form.sec_q3}
                        onChange={e=>setForm({...form, sec_q3: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-blue-200 mb-2">
                        Câu trả lời
                      </label>
                      <input 
                        className="w-full border-2 border-blue-400/30 rounded-xl p-4 bg-[#003663]/50 text-white placeholder-blue-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 text-lg"
                        type="text"
                        placeholder="Nhập câu trả lời cho câu hỏi trên"
                        value={form.sec_a3}
                        onChange={e=>setForm({...form, sec_a3: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
      {err && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white border-2 border-red-400 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="text-xl">❌</span>
            <span className="font-semibold text-lg">{err}</span>
          </div>
        </div>
      )}
      {msg && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white border-2 border-green-400 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="text-xl">✅</span>
            <span className="font-semibold text-lg">{msg}</span>
          </div>
        </div>
      )}
      <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl px-8 py-4 font-semibold hover:shadow-lg transition-all duration-200 text-lg">
        Đăng ký
      </button>
    </form>
  )
}
