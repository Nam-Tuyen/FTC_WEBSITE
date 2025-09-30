'use client';

import React from 'react';
import Link from 'next/link';
import { QuestionItem } from '@/types/api';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Heart, MessageCircle, User, Clock } from 'lucide-react';

interface QuestionCardProps {
  question: QuestionItem;
  onLike: (questionId: string) => void;
  isLiked?: boolean;
  canDelete?: boolean;
  onDelete?: (questionId: string) => void;
}

export function QuestionCard({ 
  question, 
  onLike, 
  isLiked = false, 
  canDelete = false,
  onDelete 
}: QuestionCardProps) {
  const formatDate = (date: string | Date) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return formatDistanceToNow(dateObj, { 
        addSuffix: true, 
        locale: vi 
      });
    } catch {
      return 'Vừa xong';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Hỏi về ngành học':
        return 'bg-blue-100 text-blue-800';
      case 'Hỏi về câu lạc bộ':
        return 'bg-green-100 text-green-800';
      case 'Thảo luận':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900">
                {question.user === 'anonymous' ? 'Ẩn danh' : question.user}
              </span>
              {question.like_count >= 5 && (
                <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded-full">
                  HOT
                </span>
              )}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              {formatDate(question.createdAt)}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(question.category)}`}>
            {question.category}
          </span>
          {canDelete && onDelete && (
            <button
              onClick={() => onDelete(question.id)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Xóa
            </button>
          )}
        </div>
      </div>

      <Link href={`/q/${question.id}`}>
        <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer">
          {question.title}
        </h3>
      </Link>

      <p className="text-gray-700 mb-4 line-clamp-3">
        {question.content}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => onLike(question.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              isLiked 
                ? 'bg-red-100 text-red-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="font-medium">{question.like_count}</span>
          </button>
          
          <div className="flex items-center space-x-2 text-gray-600">
            <MessageCircle className="h-5 w-5" />
            <span className="font-medium">{question.responses?.length || 0}</span>
          </div>
        </div>

        <Link 
          href={`/q/${question.id}`}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Xem chi tiết →
        </Link>
      </div>
    </div>
  );
}
