"use client";
import { useState, useEffect } from "react";
import { ForumApi } from "@/lib/forumApi";
import { useAuth } from "@/context/AuthContext";
import CommentThread from "./CommentThread";

interface Comment {
  id: string;
  user: string;
  content: string;
  createdAt: string | Date;
  parentId?: string;
  replies?: Comment[];
  like_count: number;
}

interface CommentSectionProps {
  questionId: string;
  initialComments: Comment[];
  onCommentAdded: () => void;
}

const COMMENTS_PER_PAGE = 5;

export default function CommentSection({ 
  questionId, 
  initialComments, 
  onCommentAdded 
}: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const topLevelComments = comments.filter(comment => !comment.parentId);
  const displayedComments = showAll ? topLevelComments : topLevelComments.slice(0, COMMENTS_PER_PAGE);
  const hasMoreComments = topLevelComments.length > COMMENTS_PER_PAGE;

  const handleReply = async (parentId: string, content: string, anonymous: boolean) => {
    if (!user) return;
    
    try {
      const res = await ForumApi.createResponse({
        user: user.mssv,
        content,
        anonymous,
        questionId,
        parentId
      });
      
      if (res.ok) {
        // Reload comments
        onCommentAdded();
      }
    } catch (error) {
      console.error("Error creating reply:", error);
    }
  };


  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Comments Header - Mobile Optimized */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
          <span className="text-lg sm:text-xl lg:text-2xl">💬</span>
          <span className="text-sm sm:text-base lg:text-lg">Phản hồi</span>
          <span className="text-sm sm:text-base lg:text-lg text-blue-300">({comments.length})</span>
        </h3>
      </div>

      {/* Comments List - Mobile Optimized */}
      <div className="space-y-4 sm:space-y-6">
        {displayedComments.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">💬</div>
            <p className="text-blue-200 text-lg sm:text-xl mb-2">Chưa có phản hồi</p>
            <p className="text-blue-300 text-sm sm:text-base">Hãy là người đầu tiên trả lời!</p>
          </div>
        ) : (
          <>
            {displayedComments.map((comment) => (
              <CommentThread
                key={comment.id}
                comment={comment}
                questionId={questionId}
                onReply={handleReply}
                level={0}
              />
            ))}
          </>
        )}
      </div>

      {/* Load More Button - Mobile Optimized */}
      {hasMoreComments && (
        <div className="text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 text-blue-200 hover:text-white rounded-lg sm:rounded-xl font-semibold transition-all duration-200 border border-blue-400/30 text-sm sm:text-base"
          >
            {showAll ? (
              <>
                <span className="text-base sm:text-lg">👆</span>
                <span className="ml-1 sm:ml-2">Thu gọn</span>
              </>
            ) : (
              <>
                <span className="text-base sm:text-lg">👇</span>
                <span className="ml-1 sm:ml-2">Xem thêm {topLevelComments.length - COMMENTS_PER_PAGE} phản hồi</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
