'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Quick Links - Compact */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-200 uppercase tracking-wide">Liên kết</h4>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <Link href="/thong-tin" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 py-1">
                THÔNG TIN
              </Link>
              <Link href="/thanh-tich" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 py-1">
                THÀNH TÍCH
              </Link>
              <Link href="/hoat-dong" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 py-1">
                HOẠT ĐỘNG
              </Link>
              <Link href="/co-cau" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 py-1">
                CƠ CẤU
              </Link>
              <Link href="/dien-dan" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 py-1">
                DIỄN ĐÀN
              </Link>
              <Link href="/ung-tuyen" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 py-1">
                ỨNG TUYỂN
              </Link>
              <Link href="/chatbot" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 py-1 col-span-2 font-bold">
                CHATBOT
              </Link>
            </div>
          </div>

          {/* Social Media - Compact */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-200 uppercase tracking-wide">Mạng xã hội</h4>
            <div className="flex space-x-3">
              <a 
                href="https://www.instagram.com/ftcers/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-md hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <Instagram className="h-4 w-4 text-white" />
              </a>
              <a 
                href="https://www.facebook.com/clbfintechuel" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gradient-to-br from-blue-600 to-blue-800 rounded-md hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <Facebook className="h-4 w-4 text-white" />
              </a>
              <a 
                href="https://www.linkedin.com/company/ftc-financial-technology-club/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gradient-to-br from-blue-700 to-blue-900 rounded-md hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <Linkedin className="h-4 w-4 text-white" />
              </a>
            </div>
          </div>

          {/* Contact Info - Compact */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-200 uppercase tracking-wide">Liên hệ</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center">
                <Mail className="h-3 w-3 text-cyan-400 mr-2 flex-shrink-0" />
                <span className="break-all">clbcongnghetaichinh@st.uel.edu.vn</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-3 w-3 text-cyan-400 mr-2 flex-shrink-0" />
                <span>0564032119</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-3 w-3 text-cyan-400 mr-2 flex-shrink-0 mt-0.5" />
                <span>Trường đại học Kinh tế - Luật, ĐHQG-HCM</span>
              </div>
            </div>
          </div>

          {/* Brand Info - Compact */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-200 uppercase tracking-wide">FTC</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Câu lạc bộ Công nghệ Tài chính - Kết nối tri thức, dẫn dắt xu hướng tài chính tương lai
            </p>
          </div>
        </div>

        {/* Copyright - Compact */}
        <div className="border-t border-slate-700/50 pt-4 text-center">
          <p className="text-xs text-slate-500 italic">
            ©2025. Câu lạc bộ Công nghệ Tài chính
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
