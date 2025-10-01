"use client"

import { useState, useEffect } from "react"
import { RECRUITMENT_CONFIG } from "./constants"

type RecruitmentStatus = "NOT_STARTED" | "OPEN" | "CLOSED"

interface ApplicationDeadlineCheckProps {
  recruitmentStatus: RecruitmentStatus
}

export function ApplicationDeadlineCheck({ recruitmentStatus }: ApplicationDeadlineCheckProps) {
  const [currentTime, setCurrentTime] = useState(() => RECRUITMENT_CONFIG.getRemainingTime());

  useEffect(() => {
    if (recruitmentStatus !== "OPEN") return;

    const timer = setInterval(() => {
      const newTime = RECRUITMENT_CONFIG.getRemainingTime();
      setCurrentTime(newTime);
      
      // Nếu hết thời gian, reload page để cập nhật trạng thái
      if (!newTime) {
        window.location.reload();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [recruitmentStatus]);

  if (recruitmentStatus === "NOT_STARTED") {
    return (
      <div className="relative group max-w-4xl mx-auto">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-all duration-1000"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-3xl animate-pulse"></div>
        
        {/* Main Container */}
        <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-12 shadow-2xl overflow-hidden">
          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400"></div>
          
          {/* Content */}
          <div className="text-center space-y-8">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            {/* Title */}
            <div className="space-y-4">
              <h3 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent animate-pulse">
                CHƯA TỚI THỜI GIAN ỨNG TUYỂN
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
            </div>
            
            {/* Description */}
            <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto italic">
              Vui lòng theo dõi Fanpage của FTC để cập nhật thông tin về tuyển thành viên
            </p>
            
            {/* Decorative Elements */}
            <div className="flex justify-center items-center gap-2 mt-8">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (recruitmentStatus === "CLOSED") {
    return (
      <div className="relative group max-w-4xl mx-auto">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-all duration-1000"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 rounded-3xl animate-pulse"></div>
        
        {/* Main Container */}
        <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-12 shadow-2xl overflow-hidden">
          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400"></div>
          
          {/* Content */}
          <div className="text-center space-y-8">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            {/* Title */}
            <div className="space-y-4">
              <h3 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent animate-pulse">
                ĐÃ KẾT THÚC THỜI GIAN ỨNG TUYỂN
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-red-400 to-orange-400 mx-auto rounded-full"></div>
            </div>
            
            {/* Description */}
            <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto italic">
              Cảm ơn sự quan tâm của bạn. Hãy theo dõi fanpage của FTC để nhận thông tin tuyển thành viên cho đợt tiếp theo nhé!
            </p>
            
            {/* Decorative Elements */}
            <div className="flex justify-center items-center gap-2 mt-8">
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentTime) {
    const { days, hours, minutes, seconds } = currentTime;
    return (
      <div className="mt-8 text-center">
        <h3 className="text-2xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-8">
          THỜI GIAN CÒN LẠI
        </h3>
        <div className="flex gap-6 justify-center">
          {/* Days */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-all"></div>
            <div className="relative px-6 py-4 bg-background/40 backdrop-blur-lg rounded-xl border border-primary/10 shadow-lg transform group-hover:scale-105 transition-all">
              <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {days.toString().padStart(2, '0')}
              </div>
              <div className="text-sm font-medium text-muted-foreground/90 mt-2">NGÀY</div>
            </div>
          </div>

          {/* Hours */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-all"></div>
            <div className="relative px-6 py-4 bg-background/40 backdrop-blur-lg rounded-xl border border-primary/10 shadow-lg transform group-hover:scale-105 transition-all">
              <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {hours.toString().padStart(2, '0')}
              </div>
              <div className="text-sm font-medium text-muted-foreground/90 mt-2">GIỜ</div>
            </div>
          </div>

          {/* Minutes */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-all"></div>
            <div className="relative px-6 py-4 bg-background/40 backdrop-blur-lg rounded-xl border border-primary/10 shadow-lg transform group-hover:scale-105 transition-all">
              <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-sm font-medium text-muted-foreground/90 mt-2">PHÚT</div>
            </div>
          </div>

          {/* Seconds */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-all"></div>
            <div className="relative px-6 py-4 bg-background/40 backdrop-blur-lg rounded-xl border border-primary/10 shadow-lg transform group-hover:scale-105 transition-all">
              <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-pulse">
                {seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-sm font-medium text-muted-foreground/90 mt-2">GIÂY</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
