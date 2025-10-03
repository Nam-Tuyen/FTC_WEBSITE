export type ApiResponse<T = any> = {
  ok: boolean;
  message?: string;
  data?: T;
  error?: string;
  timestamp?: string;
};

export type ForumUser = {
  userId: string;
  mssv: string;
  full_name: string;
  email: string;
};

export type ResponseItem = {
  id: string;
  user: string; // "anonymous" hoặc MSSV
  content: string;
  reaction: number;
  questionId: string;
  createdAt: string | Date;
};

export type QuestionItem = {
  id: string;
  title: string;
  category: "Hỏi về ngành học" | "Hỏi về câu lạc bộ" | "Thảo luận";
  user: string; // "anonymous" hoặc MSSV
  content: string;
  like_count: number;
  liked_by?: string[]; // Array of MSSVs who liked this question
  createdAt: string | Date;
  responses: ResponseItem[];
};
