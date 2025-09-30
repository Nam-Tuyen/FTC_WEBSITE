'use client';

import React from 'react';
import { QuestionItem } from '@/types/api';
import { QuestionCard } from './QuestionCard';
import { Spinner } from '../ui/Spinner';

interface QuestionListProps {
  questions: QuestionItem[];
  loading?: boolean;
  onLike: (questionId: string) => void;
  onDelete?: (questionId: string) => void;
  likedQuestions?: Set<string>;
  currentUser?: string;
}

export function QuestionList({ 
  questions, 
  loading = false, 
  onLike, 
  onDelete,
  likedQuestions = new Set(),
  currentUser
}: QuestionListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
        <span className="ml-2 text-gray-600">Đang tải câu hỏi...</span>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có câu hỏi nào</h3>
        <p className="text-gray-500">Hãy là người đầu tiên đặt câu hỏi!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {questions.map(question => (
        <QuestionCard
          key={question.id}
          question={question}
          onLike={onLike}
          isLiked={likedQuestions.has(question.id)}
          canDelete={currentUser && question.user === currentUser}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
