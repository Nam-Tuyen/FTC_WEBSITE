'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AskSchema, AskFormData } from '@/lib/validation';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Category } from '@/types/api';

interface QuestionFormProps {
  onSubmit: (data: AskFormData) => void;
  loading?: boolean;
  defaultValues?: Partial<AskFormData>;
}

const categoryOptions = [
  { value: 'Hỏi về ngành học', label: 'Hỏi về ngành học' },
  { value: 'Hỏi về câu lạc bộ', label: 'Hỏi về câu lạc bộ' },
  { value: 'Thảo luận', label: 'Thảo luận' }
];

export function QuestionForm({ onSubmit, loading = false, defaultValues }: QuestionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<AskFormData>({
    resolver: zodResolver(AskSchema),
    defaultValues: {
      anonymous: false,
      ...defaultValues
    }
  });

  const anonymous = watch('anonymous');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Đặt câu hỏi mới</h2>
        
        <div className="space-y-4">
          <Input
            label="Tiêu đề câu hỏi"
            placeholder="Nhập tiêu đề câu hỏi của bạn..."
            error={errors.title?.message}
            {...register('title')}
          />

          <Select
            label="Danh mục"
            options={categoryOptions}
            error={errors.category?.message}
            {...register('category')}
          />

          <Textarea
            label="Nội dung câu hỏi"
            placeholder="Mô tả chi tiết câu hỏi của bạn..."
            rows={6}
            error={errors.content?.message}
            {...register('content')}
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              id="anonymous"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={anonymous}
              onChange={(e) => setValue('anonymous', e.target.checked)}
            />
            <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
              Đăng câu hỏi ẩn danh
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Đang đăng...' : 'Đăng câu hỏi'}
          </Button>
        </div>
      </div>
    </form>
  );
}
