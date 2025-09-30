'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { fetchQuestions, toggleLike, createResponse, deleteQuestion, deleteResponse } from '@/lib/api-client';
import { QuestionItem, ResponseItem } from '@/types/api';
import { ResponseForm } from '@/components/forum/ResponseForm';
import { ResponseItem as ResponseItemComponent } from '@/components/forum/ResponseItem';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Heart, MessageCircle, User, Clock, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function QuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { addToast } = useToast();
  
  const [question, setQuestion] = useState<QuestionItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittingResponse, setSubmittingResponse] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const questionId = params.id as string;

  const loadQuestion = async () => {
    setLoading(true);
    try {
      const response = await fetchQuestions({
        search: '',
        category: undefined,
        take: 100
      });

      if (response.ok && response.data) {
        const foundQuestion = response.data.items.find(q => q.id === questionId);
        if (foundQuestion) {
          setQuestion(foundQuestion);
        } else {
          addToast({
            type: 'error',
            message: 'Không tìm thấy câu hỏi!'
          });
          router.push('/');
        }
      } else {
        addToast({
          type: 'error',
          message: response.message || 'Không thể tải câu hỏi!'
        });
      }
    } catch (error) {
      console.error('Load question error:', error);
      addToast({
        type: 'error',
        message: 'Có lỗi xảy ra khi tải câu hỏi!'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (questionId) {
      loadQuestion();
    }
  }, [questionId]);

  const handleLike = async () => {
    if (!isAuthenticated || !user || !question) return;

    try {
      const response = await toggleLike({
        questionId: question.id,
        mssv: user.mssv,
        like: isLiked ? 0 : 1
      });

      if (response.ok) {
        setQuestion(prev => prev ? {
          ...prev,
          like_count: response.data?.like_count || prev.like_count
        } : null);
        setIsLiked(!isLiked);
      } else {
        addToast({
          type: 'error',
          message: response.message || 'Không thể like câu hỏi!'
        });
      }
    } catch (error) {
      console.error('Like error:', error);
      addToast({
        type: 'error',
        message: 'Có lỗi xảy ra khi like câu hỏi!'
      });
    }
  };

  const handleSubmitResponse = async (data: { content: string; anonymous?: boolean }) => {
    if (!user || !question) return;

    setSubmittingResponse(true);
    try {
      const response = await createResponse({
        user: user.mssv,
        anonymous: data.anonymous,
        content: data.content,
        questionId: question.id
      });

      if (response.ok) {
        addToast({
          type: 'success',
          message: 'Gửi phản hồi thành công!'
        });
        loadQuestion(); // Reload to get updated responses
      } else {
        addToast({
          type: 'error',
          message: response.message || 'Không thể gửi phản hồi!'
        });
      }
    } catch (error) {
      console.error('Submit response error:', error);
      addToast({
        type: 'error',
        message: 'Có lỗi xảy ra khi gửi phản hồi!'
      });
    } finally {
      setSubmittingResponse(false);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!user || !question || question.user !== user.mssv) return;

    if (!confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) return;

    try {
      const response = await deleteQuestion({
        questionId: question.id,
        mssv: user.mssv
      });

      if (response.ok) {
        addToast({
          type: 'success',
          message: 'Xóa câu hỏi thành công!'
        });
        router.push('/');
      } else {
        addToast({
          type: 'error',
          message: response.message || 'Không thể xóa câu hỏi!'
        });
      }
    } catch (error) {
      console.error('Delete question error:', error);
      addToast({
        type: 'error',
        message: 'Có lỗi xảy ra khi xóa câu hỏi!'
      });
    }
  };

  const handleDeleteResponse = async (responseId: string) => {
    if (!user) return;

    if (!confirm('Bạn có chắc chắn muốn xóa phản hồi này?')) return;

    try {
      const response = await deleteResponse({
        responseId,
        mssv: user.mssv
      });

      if (response.ok) {
        addToast({
          type: 'success',
          message: 'Xóa phản hồi thành công!'
        });
        loadQuestion(); // Reload to get updated responses
      } else {
        addToast({
          type: 'error',
          message: response.message || 'Không thể xóa phản hồi!'
        });
      }
    } catch (error) {
      console.error('Delete response error:', error);
      addToast({
        type: 'error',
        message: 'Có lỗi xảy ra khi xóa phản hồi!'
      });
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Đang tải câu hỏi...</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy câu hỏi</h2>
          <Link href="/">
            <Button>Quay lại trang chủ</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Quay lại</span>
            </Button>
          </Link>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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
              {user && question.user === user.mssv && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteQuestion}
                  className="flex items-center space-x-1"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Xóa</span>
                </Button>
              )}
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">{question.title}</h1>
          <p className="text-gray-700 leading-relaxed mb-6">{question.content}</p>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                disabled={!isAuthenticated}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isLiked 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="font-medium">{question.like_count}</span>
              </button>
              
              <div className="flex items-center space-x-2 text-gray-600">
                <MessageCircle className="h-5 w-5" />
                <span className="font-medium">{question.responses?.length || 0} phản hồi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Responses */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Phản hồi ({question.responses?.length || 0})</h2>
          
          {question.responses && question.responses.length > 0 ? (
            <div className="space-y-4">
              {question.responses.map(response => (
                <ResponseItemComponent
                  key={response.id}
                  response={response}
                  canDelete={user && response.user === user.mssv}
                  onDelete={handleDeleteResponse}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Chưa có phản hồi nào. Hãy là người đầu tiên phản hồi!</p>
            </div>
          )}

          {/* Response Form */}
          {isAuthenticated ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Gửi phản hồi</h3>
              <ResponseForm
                onSubmit={handleSubmitResponse}
                loading={submittingResponse}
              />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600 mb-4">Vui lòng đăng nhập để gửi phản hồi</p>
              <Link href="/auth/login">
                <Button>Đăng nhập</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
