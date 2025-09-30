'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResponseSchema, ResponseFormData } from '@/lib/validation';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';

interface ResponseFormProps {
  onSubmit: (data: ResponseFormData) => void;
  loading?: boolean;
  onCancel?: () => void;
}

export function ResponseForm({ onSubmit, loading = false, onCancel }: ResponseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm<ResponseFormData>({
    resolver: zodResolver(ResponseSchema),
    defaultValues: {
      anonymous: false
    }
  });

  const anonymous = watch('anonymous');

  const handleFormSubmit = (data: ResponseFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="bg-white rounded-lg border p-4">
        <Textarea
          label="Phản hồi của bạn"
          placeholder="Viết phản hồi của bạn..."
          rows={3}
          error={errors.content?.message}
          {...register('content')}
        />

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="anonymous-response"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={anonymous}
              onChange={(e) => setValue('anonymous', e.target.checked)}
            />
            <label htmlFor="anonymous-response" className="ml-2 block text-sm text-gray-700">
              Phản hồi ẩn danh
            </label>
          </div>

          <div className="flex space-x-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Hủy
              </Button>
            )}
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Đang gửi...' : 'Gửi phản hồi'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
