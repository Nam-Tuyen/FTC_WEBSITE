'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ForgotGetSchema, ForgotResetSchema, ForgotGetFormData, ForgotResetFormData } from '@/lib/validation';
import { forgotPasswordGetQuestions, forgotPasswordReset } from '@/lib/api-client';
import { useToast } from '@/contexts/ToastContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

type Step = 'email' | 'questions' | 'reset';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [step, setStep] = useState<Step>('email');
  const [loading, setLoading] = useState(false);
  const [mssv, setMssv] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);

  const emailForm = useForm<ForgotGetFormData>({
    resolver: zodResolver(ForgotGetSchema)
  });

  const resetForm = useForm<ForgotResetFormData>({
    resolver: zodResolver(ForgotResetSchema)
  });

  const handleGetQuestions = async (data: ForgotGetFormData) => {
    setLoading(true);
    try {
      const response = await forgotPasswordGetQuestions(data);
      
      if (response.ok && response.data) {
        setMssv(data.mssv);
        setQuestions(response.data.questions);
        setStep('questions');
        addToast({
          type: 'success',
          message: 'Đã lấy câu hỏi bảo mật thành công!'
        });
      } else {
        addToast({
          type: 'error',
          message: response.message || 'Không thể lấy câu hỏi bảo mật!'
        });
      }
    } catch (error) {
      console.error('Get questions error:', error);
      addToast({
        type: 'error',
        message: 'Có lỗi xảy ra. Vui lòng thử lại!'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (data: ForgotResetFormData) => {
    setLoading(true);
    try {
      const response = await forgotPasswordReset({
        mssv,
        answers: data.answers,
        new_password: data.new_password
      });
      
      if (response.ok) {
        addToast({
          type: 'success',
          message: response.message || 'Đặt lại mật khẩu thành công!'
        });
        router.push('/auth/login');
      } else {
        addToast({
          type: 'error',
          message: response.message || 'Đặt lại mật khẩu thất bại!'
        });
      }
    } catch (error) {
      console.error('Reset password error:', error);
      addToast({
        type: 'error',
        message: 'Có lỗi xảy ra. Vui lòng thử lại!'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'email':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Quên mật khẩu</h2>
              <p className="mt-2 text-sm text-gray-600">
                Nhập MSSV của bạn để lấy câu hỏi bảo mật
              </p>
            </div>

            <form onSubmit={emailForm.handleSubmit(handleGetQuestions)} className="space-y-6">
              <Input
                label="MSSV"
                placeholder="K225123456"
                error={emailForm.formState.errors.mssv?.message}
                {...emailForm.register('mssv')}
              />

              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Lấy câu hỏi bảo mật'}
              </Button>
            </form>

            <div className="text-center">
              <Link href="/auth/login" className="text-sm text-blue-600 hover:text-blue-500">
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        );

      case 'questions':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Câu hỏi bảo mật</h2>
              <p className="mt-2 text-sm text-gray-600">
                Vui lòng trả lời các câu hỏi bảo mật để đặt lại mật khẩu
              </p>
            </div>

            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900 mb-2">
                    Câu hỏi {index + 1}: {question}
                  </p>
                </div>
              ))}
            </div>

            <Button
              onClick={() => setStep('reset')}
              className="w-full"
            >
              Tiếp tục
            </Button>
          </div>
        );

      case 'reset':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Đặt lại mật khẩu</h2>
              <p className="mt-2 text-sm text-gray-600">
                Nhập câu trả lời và mật khẩu mới
              </p>
            </div>

            <form onSubmit={resetForm.handleSubmit(handleResetPassword)} className="space-y-6">
              {questions.map((question, index) => (
                <div key={index} className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Câu hỏi {index + 1}: {question}
                  </p>
                  <Input
                    placeholder={`Đáp án ${index + 1}`}
                    error={resetForm.formState.errors.answers?.[`a${index + 1}` as keyof typeof resetForm.formState.errors.answers]?.message}
                    {...resetForm.register(`answers.a${index + 1}` as keyof ForgotResetFormData)}
                  />
                </div>
              ))}

              <Input
                label="Mật khẩu mới"
                type="password"
                placeholder="Nhập mật khẩu mới"
                error={resetForm.formState.errors.new_password?.message}
                {...resetForm.register('new_password')}
              />

              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
              </Button>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}
