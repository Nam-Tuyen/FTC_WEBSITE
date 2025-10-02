"use client";
import Link from "next/link";
import LikeButton from "./LikeButton";

export default function QuestionCard({ q }: { q: any }) {
  return (
    <div className="border rounded p-4 bg-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{q.title}</h3>
          <div className="text-xs text-gray-500">
            {q.category} • người đăng: {q.user}
          </div>
        </div>
        <LikeButton questionId={q.id} initialLikes={q.like_count} />
      </div>
      <p className="mt-2 whitespace-pre-wrap">{q.content}</p>
      <div className="mt-3 text-sm">
        <Link href={`/forum/${q.id}`} className="underline">Xem chi tiết & phản hồi ({q.responses?.length || 0})</Link>
      </div>
    </div>
  );
}
