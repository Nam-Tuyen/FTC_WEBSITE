'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema, RegisterFormData } from '@/lib/validation';
import { registerUser } from '@/lib/api-client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema)
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      const response = await registerUser(data);
      
      if (response.ok) {
        addToast({
          type: 'success',
          message: response.message || 'Đăng ký thành công!'
        });
        
        // Auto login after successful registration
        login({
          userId: response.data!.userId,
          mssv: response.data!.mssv,
          full_name: data.full_name,
          email: data.email
        });
        
        router.push('/');
      } else {
        addToast({
          type: 'error',
          message: response.message || 'Đăng ký thất bại!'
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      addToast({
        type: 'error',
        message: 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại!'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Đăng ký tài khoản
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Hoặc{' '}
          <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
            đăng nhập nếu đã có tài khoản
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="MSSV"
              placeholder="K225123456"
              error={errors.mssv?.message}
              {...register('mssv')}
            />

            <Input
              label="Họ và tên"
              placeholder="Nguyễn Văn A"
              error={errors.full_name?.message}
              {...register('full_name')}
            />

            <Input
              label="Email"
              type="email"
              placeholder="example@email.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Mật khẩu"
              type="password"
              placeholder="Tối thiểu 6 ký tự"
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Câu hỏi bảo mật</h3>
              <p className="text-sm text-gray-600">
                Những câu hỏi này sẽ giúp bạn khôi phục mật khẩu nếu quên.
              </p>
              
              <Input
                label="Câu hỏi bảo mật 1"
                placeholder="Tên trường tiểu học của bạn?"
                error={errors.sec_q1?.message}
                {...register('sec_q1')}
              />
              <Input
                label="Đáp án 1"
                placeholder="Trường Tiểu học ABC"
                error={errors.sec_a1?.message}
                {...register('sec_a1')}
              />

              <Input
                label="Câu hỏi bảo mật 2"
                placeholder="Tên thú cưng đầu tiên của bạn?"
                error={errors.sec_q2?.message}
                {...register('sec_q2')}
              />
              <Input
                label="Đáp án 2"
                placeholder="Mèo"
                error={errors.sec_a2?.message}
                {...register('sec_a2')}
              />

              <Input
                label="Câu hỏi bảo mật 3"
                placeholder="Nơi sinh của bạn?"
                error={errors.sec_q3?.message}
                {...register('sec_q3')}
              />
              <Input
                label="Đáp án 3"
                placeholder="Hà Nội"
                error={errors.sec_a3?.message}
                {...register('sec_a3')}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
