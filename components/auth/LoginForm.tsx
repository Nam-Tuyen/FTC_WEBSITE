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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState<'email' | 'questions' | 'reset'>('email');
  const [forgotPasswordData, setForgotPasswordData] = useState({
    mssv: '',
    questions: [] as string[],
    answers: { a1: '', a2: '', a3: '' },
    newPassword: ''
  });

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

  async function handleForgotPassword() {
    setLoading(true); setErr("");
    try {
      const res = await ForumApi.forgotPasswordGetQuestions({ mssv: forgotPasswordData.mssv });
      if (!res.ok) throw new Error(res.message || "Không thể lấy câu hỏi bảo mật");
      setForgotPasswordData({ ...forgotPasswordData, questions: res.data!.questions });
      setForgotPasswordStep('questions');
    } catch (e:any) { setErr(e.message); }
    setLoading(false);
  }

  async function handleResetPassword() {
    setLoading(true); setErr("");
    try {
      const res = await ForumApi.forgotPasswordReset({
        mssv: forgotPasswordData.mssv,
        answers: forgotPasswordData.answers,
        new_password: forgotPasswordData.newPassword
      });
      if (!res.ok) throw new Error(res.message || "Đặt lại mật khẩu thất bại");
      setShowForgotPassword(false);
      setForgotPasswordStep('email');
      setForgotPasswordData({ mssv: '', questions: [], answers: { a1: '', a2: '', a3: '' }, newPassword: '' });
      setErr(""); // Clear any errors
    } catch (e:any) { setErr(e.message); }
    setLoading(false);
  }

  if (showForgotPassword) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔑</span>
          </div>
          <h3 className="text-2xl font-bold text-white">Quên mật khẩu</h3>
          <p className="text-blue-200 mt-2">Khôi phục tài khoản của bạn</p>
        </div>

        {/* Forgot Password Steps */}
        {forgotPasswordStep === 'email' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-blue-200 mb-2">
                Hãy nhập mã số sinh viên của bạn
              </label>
              <input 
                className="w-full border-2 border-blue-400/30 rounded-lg p-3 bg-[#003663]/50 text-white placeholder-blue-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200" 
                placeholder="Nhập MSSV (VD: K225123456)" 
                value={forgotPasswordData.mssv} 
                onChange={e=>setForgotPasswordData({...forgotPasswordData, mssv: e.target.value})} 
              />
            </div>
            
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="flex-1 px-4 py-2 bg-slate-600/50 text-slate-300 rounded-lg font-semibold hover:bg-slate-500/50 transition-all duration-200"
              >
                Quay lại
              </button>
              <button 
                type="button"
                onClick={handleForgotPassword}
                disabled={loading || !forgotPasswordData.mssv}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Đang xử lý..." : "Tiếp tục"}
              </button>
            </div>
          </div>
        )}

        {forgotPasswordStep === 'questions' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-400/30 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <span className="text-orange-400">🔐</span>
                Câu hỏi bảo mật
              </h4>
              <p className="text-sm text-orange-200">Hãy trả lời các câu hỏi bảo mật để xác thực danh tính</p>
            </div>
            
            <div className="space-y-4">
              {forgotPasswordData.questions.map((question, index) => (
                <div key={index}>
                  <label className="block text-sm font-semibold text-blue-200 mb-2">
                    {question}
                  </label>
                  <input 
                    className="w-full border-2 border-blue-400/30 rounded-lg p-3 bg-[#003663]/50 text-white placeholder-blue-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200" 
                    placeholder={`Trả lời câu hỏi ${index + 1}`}
                    value={forgotPasswordData.answers[`a${index + 1}` as keyof typeof forgotPasswordData.answers]}
                    onChange={e=>setForgotPasswordData({
                      ...forgotPasswordData, 
                      answers: { ...forgotPasswordData.answers, [`a${index + 1}`]: e.target.value }
                    })}
                  />
                </div>
              ))}
              
              <div>
                <label className="block text-sm font-semibold text-blue-200 mb-2">
                  Mật khẩu mới
                </label>
                <input 
                  className="w-full border-2 border-blue-400/30 rounded-lg p-3 bg-[#003663]/50 text-white placeholder-blue-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200" 
                  type="password"
                  placeholder="Nhập mật khẩu mới"
                  value={forgotPasswordData.newPassword}
                  onChange={e=>setForgotPasswordData({...forgotPasswordData, newPassword: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={() => setForgotPasswordStep('email')}
                className="flex-1 px-4 py-2 bg-slate-600/50 text-slate-300 rounded-lg font-semibold hover:bg-slate-500/50 transition-all duration-200"
              >
                Quay lại
              </button>
              <button 
                type="button"
                onClick={handleResetPassword}
                disabled={loading || !forgotPasswordData.answers.a1 || !forgotPasswordData.answers.a2 || !forgotPasswordData.answers.a3 || !forgotPasswordData.newPassword}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
              </button>
            </div>
          </div>
        )}

        {err && (
          <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white border-2 border-red-400 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-lg">❌</span>
              <span className="font-semibold">{err}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Login Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-blue-200 mb-2">
              Hãy nhập mã số sinh viên của bạn
            </label>
            <input 
              className="w-full border-2 border-blue-400/30 rounded-lg p-3 bg-[#003663]/50 text-white placeholder-blue-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200" 
              placeholder="Nhập MSSV (VD: K225123456)" 
              value={mssv} 
              onChange={e=>setMssv(e.target.value)} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-blue-200 mb-2">
              Mật khẩu của bạn
            </label>
            <input 
              className="w-full border-2 border-blue-400/30 rounded-lg p-3 bg-[#003663]/50 text-white placeholder-blue-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200" 
              type="password" 
              placeholder="Nhập mật khẩu" 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
            />
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
        
        <button 
          disabled={loading} 
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg px-6 py-3 font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      {/* Forgot Password Link */}
      <div className="text-center">
        <button 
          type="button"
          onClick={() => setShowForgotPassword(true)}
          className="text-blue-300 hover:text-white text-sm underline transition-colors duration-200"
        >
          Quên mật khẩu?
        </button>
      </div>
    </div>
  );
}
