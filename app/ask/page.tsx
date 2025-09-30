'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { createQuestion } from '@/lib/api-client';
import { AskFormData } from '@/lib/validation';
import { QuestionForm } from '@/components/forum/QuestionForm';

export default function AskPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      addToast({
        type: 'warning',
        message: 'Vui lòng đăng nhập để đặt câu hỏi!'
      });
      router.push('/auth/login');
    }
  }, [isAuthenticated, router, addToast]);

  const handleSubmit = async (data: AskFormData) => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await createQuestion({
        title: data.title,
        category: data.category,
        user: user.mssv,
        content: data.content,
        anonymous: data.anonymous
      });

      if (response.ok && response.data) {
        addToast({
          type: 'success',
          message: 'Đăng câu hỏi thành công!'
        });
        router.push(`/q/${response.data.id}`);
      } else {
        addToast({
          type: 'error',
          message: response.message || 'Không thể đăng câu hỏi!'
        });
      }
    } catch (error) {
      console.error('Create question error:', error);
      addToast({
        type: 'error',
        message: 'Có lỗi xảy ra khi đăng câu hỏi!'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Đang chuyển hướng...</h2>
          <p className="text-gray-600">Vui lòng đăng nhập để tiếp tục</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <QuestionForm
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
}
