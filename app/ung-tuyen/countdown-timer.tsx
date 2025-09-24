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
      <div className="relative group max-w-2xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-muted/20 to-muted/20 rounded-xl blur-xl opacity-70 group-hover:opacity-100 transition-all"></div>
        <div className="relative bg-background/40 backdrop-blur-lg rounded-xl border border-muted/10 p-8 text-center transform transition-all">
          <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-muted-foreground to-muted-foreground/70 bg-clip-text text-transparent">
            CHƯA TỚI THỜI GIAN ỨNG TUYỂN
          </h3>
          <p className="text-base text-muted-foreground/90">
            Vui lòng theo dõi Fanpage của FTC để cập nhật thông tin về tuyển thành viên
          </p>
        </div>
      </div>
    );
  }

  if (recruitmentStatus === "CLOSED") {
    return (
      <div className="relative group max-w-2xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-destructive/20 to-destructive/20 rounded-xl blur-xl opacity-70 group-hover:opacity-100 transition-all"></div>
        <div className="relative bg-background/40 backdrop-blur-lg rounded-xl border border-destructive/10 p-8 text-center transform transition-all">
          <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-destructive to-destructive/70 bg-clip-text text-transparent">
            ĐÃ KẾT THÚC THỜI GIAN ỨNG TUYỂN
          </h3>
          <p className="text-base text-destructive/90">
            Cảm ơn sự quan tâm của bạn. Hãy theo dõi fanpage của FTC để nhận thông tin tuyển thành viên cho đợt tiếp theo nhé!
          </p>
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
