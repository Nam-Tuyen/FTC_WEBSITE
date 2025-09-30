'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Mail, Phone, MessageSquare, Users, Database } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <Database className="h-16 w-16 mx-auto text-blue-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Quản trị viên
            </h1>
            <p className="text-gray-600 mb-8">
              Trang quản trị hệ thống diễn đàn FTC
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Quản lý người dùng</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Xem danh sách người dùng, quản lý tài khoản và phân quyền
              </p>
              <Button variant="outline" disabled>
                Chức năng đang phát triển
              </Button>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <MessageSquare className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Quản lý nội dung</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Kiểm duyệt câu hỏi, phản hồi và quản lý nội dung
              </p>
              <Button variant="outline" disabled>
                Chức năng đang phát triển
              </Button>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Thông tin liên hệ quản trị viên
            </h3>
            <p className="text-gray-600 mb-4">
              Nếu bạn quên câu hỏi bảo mật hoặc cần hỗ trợ kỹ thuật, vui lòng liên hệ:
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-500 mr-3" />
                <span className="text-gray-700">admin@ftc-club.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-500 mr-3" />
                <span className="text-gray-700">+84 123 456 789</span>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-red-900 mb-4">
              Xóa dữ liệu trực tiếp từ Database
            </h3>
            <p className="text-red-700 mb-4">
              <strong>Chú ý:</strong> Chức năng này chỉ dành cho quản trị viên có quyền truy cập trực tiếp vào Google Sheets.
            </p>
            <p className="text-gray-600 mb-4">
              Nếu bạn quên câu hỏi bảo mật và không thể khôi phục tài khoản, vui lòng:
            </p>
            <ol className="list-decimal list-inside text-gray-600 space-y-2">
              <li>Liên hệ quản trị viên qua email hoặc số điện thoại trên</li>
              <li>Cung cấp MSSV và thông tin xác thực danh tính</li>
              <li>Quản trị viên sẽ xóa tài khoản cũ để bạn có thể đăng ký lại</li>
            </ol>
          </div>

          <div className="text-center">
            <Link href="/">
              <Button variant="outline">
                Quay lại trang chủ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
