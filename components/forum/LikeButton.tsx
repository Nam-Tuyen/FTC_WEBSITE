"use client";
import { useState } from "react";
import { ForumApi } from "@/lib/forumApi";
import { useAuth } from "@/context/AuthContext";

export default function LikeButton({ questionId, initialLikes }: { questionId: string; initialLikes: number }) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if(!user) return alert("Vui lòng đăng nhập.");
    setLoading(true);
    const next = liked ? 0 : 1;
    const res = await ForumApi.toggleLike({ questionId, mssv: user.mssv, like: next });
    if(res.ok && res.data) {
      setLikes(res.data.like_count);
      setLiked(!liked);
    }
    setLoading(false);
  }

  return (
    <button 
      onClick={toggle} 
      disabled={loading} 
      className={`group flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
        liked 
          ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg hover:shadow-red-500/25" 
          : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600/30"
      } ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
    >
      <span className={`text-lg transition-transform duration-200 ${liked ? "animate-pulse" : ""}`}>
        {liked ? "❤️" : "🤍"}
      </span>
      <span>{likes}</span>
      {loading && <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>}
    </button>
  );
}
