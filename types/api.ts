// API Types theo Apps Script
export type Category = 'Hỏi về ngành học' | 'Hỏi về câu lạc bộ' | 'Thảo luận';

export type AuthUser = { 
  userId: string; 
  mssv: string; 
  full_name: string; 
  email: string; 
};

export type ResponseItem = {
  id: string;
  user: string;            // 'anonymous' | MSSV
  content: string;
  questionId: string;
  reaction: number;
  createdAt: string | Date;
};

export type QuestionItem = {
  id: string;
  title: string;
  category: Category;
  user: string;            // 'anonymous' | MSSV
  content: string;
  like_count: number;
  createdAt: string | Date;
  responses: ResponseItem[];
};

export type ApiResp<T = any> = { 
  ok: boolean; 
  message: string; 
  data?: T; 
  timestamp: string; 
  error?: string; 
};

// Auth payloads
export type RegisterPayload = {
  mssv: string;
  password: string;
  full_name: string;
  email: string;
  sec_q1: string;
  sec_a1: string;
  sec_q2: string;
  sec_a2: string;
  sec_q3: string;
  sec_a3: string;
};

export type LoginPayload = {
  mssv: string;
  password: string;
};

export type ForgotGetPayload = {
  mssv: string;
};

export type ForgotResetPayload = {
  mssv: string;
  answers: { a1: string; a2: string; a3: string };
  new_password: string;
};

// Forum payloads
export type CreateQuestionPayload = {
  title: string;
  category: Category;
  user: string;
  content: string;
  anonymous?: boolean;
};

export type CreateResponsePayload = {
  user: string;
  anonymous?: boolean;
  content: string;
  questionId: string;
};

export type ToggleLikePayload = {
  questionId: string;
  mssv: string;
  like: 0 | 1;
};

export type DeleteQuestionPayload = {
  questionId: string;
  mssv: string;
};

export type DeleteResponsePayload = {
  responseId: string;
  mssv: string;
};

export type FetchQuestionsPayload = {
  take?: number;
  category?: Category;
  search?: string;
  includeDeleted?: boolean;
};
