// Cấu hình thời gian ứng tuyển
export const RECRUITMENT_CONFIG = {
  // Thời gian kết thúc nhận đơn - Format: "YYYY-MM-DDThh:mm"
  endDate: new Date("2025-09-08T19:22"),

  // Link form đăng ký
  formUrl: "https://forms.gle/3sWKn8XGUUVXRDxZ7",

  // Kiểm tra trạng thái đơn ứng tuyển
  getStatus(): "NOT_STARTED" | "OPEN" | "CLOSED" {
    const now = new Date();

    // Nếu chưa set thời gian kết thúc
    if (!this.endDate) {
      return "NOT_STARTED";
    }

    // Tính thời điểm 3 ngày sau khi kết thúc
    const threeDaysAfterEnd = new Date(this.endDate.getTime() + (3 * 24 * 60 * 60 * 1000));
    
    // Nếu đã qua 3 ngày sau khi kết thúc
    if (now > threeDaysAfterEnd) {
      return "NOT_STARTED";
    }
    
    // Nếu đã kết thúc (trong vòng 3 ngày)
    if (now > this.endDate) {
      return "CLOSED";
    }

    // Đang trong thời gian nhận đơn
    return "OPEN";
  },

  // Tính thời gian còn lại đến khi kết thúc
  getRemainingTime(): { days: number; hours: number; minutes: number; seconds: number } | null {
    if (!this.endDate || this.getStatus() !== "OPEN") {
      return null;
    }

    const now = new Date();
    const remaining = this.endDate.getTime() - now.getTime();

    // Nếu đã hết hạn
    if (remaining <= 0) {
      return null;
    }

    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }
} as const;
