'use client';

import React from 'react';
import { ResponseItem as ResponseItemType } from '@/types/api';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { User, Clock, ThumbsUp } from 'lucide-react';

interface ResponseItemProps {
  response: ResponseItemType;
  canDelete?: boolean;
  onDelete?: (responseId: string) => void;
}

export function ResponseItem({ response, canDelete = false, onDelete }: ResponseItemProps) {
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

  return (
    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">
                {response.user === 'anonymous' ? 'Ẩn danh' : response.user}
              </span>
              {response.reaction > 0 && (
                <div className="flex items-center space-x-1 text-green-600">
                  <ThumbsUp className="h-4 w-4" />
                  <span className="text-sm font-medium">{response.reaction}</span>
                </div>
              )}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              {formatDate(response.createdAt)}
            </div>
          </div>
        </div>
        
        {canDelete && onDelete && (
          <button
            onClick={() => onDelete(response.id)}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Xóa
          </button>
        )}
      </div>

      <p className="text-gray-700 leading-relaxed">
        {response.content}
      </p>
    </div>
  );
}
