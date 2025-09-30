'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { User, Mail, Hash, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Vui lòng đăng nhập</h2>
          <p className="text-gray-600 mb-6">Bạn cần đăng nhập để xem thông tin cá nhân</p>
          <Link href="/auth/login">
            <Button>Đăng nhập</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Thông tin cá nhân</h1>
            <Link href="/">
              <Button variant="outline">Quay lại</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Profile Info */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin cơ bản</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Hash className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">MSSV</p>
                      <p className="font-medium text-gray-900">{user.mssv}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Họ và tên</p>
                      <p className="font-medium text-gray-900">{user.full_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">ID người dùng</p>
                      <p className="font-medium text-gray-900 text-sm">{user.userId}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hành động</h3>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    disabled
                  >
                    Chỉnh sửa thông tin
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    disabled
                  >
                    Đổi mật khẩu
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    disabled
                  >
                    Câu hỏi bảo mật
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Các chức năng chỉnh sửa sẽ được cập nhật trong phiên bản sau
                </p>
              </div>

              <div className="bg-red-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-4">Nguy hiểm</h3>
                <p className="text-red-700 mb-4">
                  Đăng xuất khỏi tài khoản hiện tại
                </p>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={logout}
                >
                  Đăng xuất
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">Lưu ý</h4>
              <p className="text-yellow-800 text-sm">
                Thông tin cá nhân được lưu trữ an toàn trong Google Sheets. 
                Nếu bạn cần thay đổi thông tin, vui lòng liên hệ quản trị viên.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
