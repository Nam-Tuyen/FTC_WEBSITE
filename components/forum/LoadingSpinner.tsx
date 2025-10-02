"use client";
import { useState, useEffect } from "react";

interface LoadingSpinnerProps {
  message?: string;
  showEncouragement?: boolean;
  size?: "sm" | "md" | "lg";
}

const encouragementMessages = [
  "Đang kết nối với cộng đồng... 🤝",
  "Tải dữ liệu mới nhất... ⚡",
  "Chuẩn bị nội dung cho bạn... 📚",
  "Kết nối với tri thức... 🧠",
  "Sắp xong rồi... 💫",
  "Đang tải câu hỏi hay... 💭",
  "Kết nối với cộng đồng FinTech... 🚀",
  "Chuẩn bị trải nghiệm tuyệt vời... ✨",
  "Đang tải thông tin mới... 📊",
  "Sắp có kết quả rồi... 🎯"
];

export default function LoadingSpinner({ 
  message = "Đang tải...", 
  showEncouragement = true,
  size = "md" 
}: LoadingSpinnerProps) {
  const [currentMessage, setCurrentMessage] = useState(message);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!showEncouragement) return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % encouragementMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [showEncouragement]);

  useEffect(() => {
    if (showEncouragement) {
      setCurrentMessage(encouragementMessages[messageIndex]);
    }
  }, [messageIndex, showEncouragement]);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-12">
      {/* Animated Spinner */}
      <div className="relative">
        {/* Outer Ring */}
        <div className={`${sizeClasses[size]} border-4 border-blue-400/20 rounded-full animate-spin`}></div>
        {/* Inner Ring */}
        <div className={`absolute top-0 left-0 ${sizeClasses[size]} border-4 border-transparent border-t-blue-400 rounded-full animate-spin`} style={{ animationDuration: '0.8s' }}></div>
        {/* Center Dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse"></div>
      </div>

      {/* Loading Message */}
      <div className="text-center space-y-2">
        <p className={`${textSizeClasses[size]} text-blue-200 font-medium animate-pulse`}>
          {currentMessage}
        </p>
        
        {/* Progress Dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>

      {/* Encouragement Quote */}
      {showEncouragement && (
        <div className="max-w-md text-center">
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-400/20 rounded-2xl p-4">
            <p className="text-sm text-blue-300 italic">
              "Tri thức được chia sẻ là tri thức được nhân đôi" 💡
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
