"use client";
import { useState, useEffect } from "react";
import { ForumApi } from "@/lib/forumApi";
import { useAuth } from "@/context/AuthContext";

interface LikeButtonProps {
  questionId: string;
  initialLikes: number;
  initialLiked?: boolean;
  onLikeChange?: (liked: boolean, likeCount: number) => void;
}

export default function LikeButton({ 
  questionId, 
  initialLikes, 
  initialLiked = false,
  onLikeChange 
}: LikeButtonProps) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);

  // Check if user has already liked this question
  useEffect(() => {
    if (user) {
      // Check if user's MSSV is in the liked_by array from the question data
      // This will be set by the parent component based on server data
      setLiked(initialLiked);
    }
  }, [user, questionId, initialLiked]);

  async function toggle() {
    if (!user) {
      alert("Vui lòng đăng nhập để thích câu hỏi.");
      return;
    }

    setLoading(true);
    try {
      const next = liked ? 0 : 1;
      const res = await ForumApi.toggleLike({ 
        questionId, 
        mssv: user.mssv, 
        like: next 
      });
      
      if (res.ok && res.data) {
        const newLiked = !liked;
        const newLikeCount = res.data.like_count;
        
        setLikes(newLikeCount);
        setLiked(newLiked);
        
        // Notify parent component
        onLikeChange?.(newLiked, newLikeCount);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      alert("Có lỗi xảy ra khi thích câu hỏi.");
    }
    setLoading(false);
  }

  return (
    <button 
      onClick={toggle} 
      disabled={loading} 
      className={`group flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
        liked 
          ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg hover:shadow-red-500/30 scale-105" 
          : "bg-gradient-to-r from-slate-600/50 to-slate-700/50 text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-red-500/20 hover:to-pink-500/20 border border-slate-400/30 hover:border-red-400/50"
      } ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-110 active:scale-95"}`}
    >
      <span className={`text-lg transition-all duration-300 ${liked ? "animate-pulse scale-110" : "group-hover:scale-110"}`}>
        {liked ? "❤️" : "🤍"}
      </span>
      <span className="font-bold">{likes}</span>
      {loading && (
        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      )}
    </button>
  );
}
