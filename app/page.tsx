'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { fetchQuestions, toggleLike, deleteQuestion } from '@/lib/api-client';
import { QuestionItem, Category } from '@/types/api';
import { QuestionList } from '@/components/forum/QuestionList';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Spinner } from '@/components/ui/Spinner';
import { Search, Plus, User, LogOut } from 'lucide-react';
import Link from 'next/link';

const categoryOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'Hỏi về ngành học', label: 'Hỏi về ngành học' },
  { value: 'Hỏi về câu lạc bộ', label: 'Hỏi về câu lạc bộ' },
  { value: 'Thảo luận', label: 'Thảo luận' }
];

export default function HomePage() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [likedQuestions, setLikedQuestions] = useState<Set<string>>(new Set());
  const [searchInput, setSearchInput] = useState('');

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetchQuestions({
        category: category || undefined,
        search: search || undefined,
        take: 50
      });

      if (response.ok && response.data) {
        setQuestions(response.data.items);
      } else {
        addToast({
          type: 'error',
          message: response.message || 'Không thể tải câu hỏi!'
        });
      }
    } catch (error) {
      console.error('Load questions error:', error);
      addToast({
        type: 'error',
        message: 'Có lỗi xảy ra khi tải câu hỏi!'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [search, category]);

  const handleLike = async (questionId: string) => {
    if (!isAuthenticated || !user) {
      addToast({
        type: 'warning',
        message: 'Vui lòng đăng nhập để like câu hỏi!'
      });
      return;
    }

    try {
      const isCurrentlyLiked = likedQuestions.has(questionId);
      const response = await toggleLike({
        questionId,
        mssv: user.mssv,
        like: isCurrentlyLiked ? 0 : 1
      });

      if (response.ok) {
        // Update local state
        setQuestions(prev => prev.map(q => 
          q.id === questionId 
            ? { ...q, like_count: response.data?.like_count || q.like_count }
            : q
        ));

        // Update liked questions
        if (isCurrentlyLiked) {
          setLikedQuestions(prev => {
            const newSet = new Set(prev);
            newSet.delete(questionId);
            return newSet;
          });
        } else {
          setLikedQuestions(prev => new Set(prev).add(questionId));
        }
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

  const handleDelete = async (questionId: string) => {
    if (!isAuthenticated || !user) {
      return;
    }

    if (!confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
      return;
    }

    try {
      const response = await deleteQuestion({
        questionId,
        mssv: user.mssv
      });

      if (response.ok) {
        addToast({
          type: 'success',
          message: 'Xóa câu hỏi thành công!'
        });
        loadQuestions(); // Reload questions
      } else {
        addToast({
          type: 'error',
          message: response.message || 'Không thể xóa câu hỏi!'
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
      addToast({
        type: 'error',
        message: 'Có lỗi xảy ra khi xóa câu hỏi!'
      });
    }
  };

  const handleLogout = () => {
    logout();
    addToast({
      type: 'success',
      message: 'Đăng xuất thành công!'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                FTC Forum
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm câu hỏi..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              {/* Category Filter */}
              <Select
                options={categoryOptions}
                value={category}
                onChange={(e) => setCategory(e.target.value as Category | '')}
                className="w-48"
              />

              {/* Ask Question Button */}
              {isAuthenticated ? (
                <Link href="/ask">
                  <Button className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Đặt câu hỏi</span>
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/login">
                  <Button variant="outline">Đăng nhập</Button>
                </Link>
              )}

              {/* User Menu */}
              {isAuthenticated && user && (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <User className="h-4 w-4" />
                    <span>{user.mssv}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center space-x-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Đăng xuất</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Diễn đàn FTC</h1>
            <p className="text-gray-600 mt-2">
              Nơi cộng đồng fintech chia sẻ kiến thức và thảo luận
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={loadQuestions}
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : 'Làm mới'}
            </Button>
          </div>
        </div>

        {/* Questions List */}
        <QuestionList
          questions={questions}
          loading={loading}
          onLike={handleLike}
          onDelete={handleDelete}
          likedQuestions={likedQuestions}
          currentUser={user?.mssv}
        />
      </main>
    </div>
  );
}