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
    <button onClick={toggle} disabled={loading} className={`text-sm rounded px-3 py-1 border ${liked ? "bg-black text-white":"bg-white"}`}>
      ❤️ {likes}
    </button>
  );
}
