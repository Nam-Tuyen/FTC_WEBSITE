import { callAPI } from "./forumClient";
import type { ApiResponse, ForumUser, QuestionItem } from "@/types/forum";

export const ForumApi = {
  // AUTH
  registerUser: (p: {
    mssv: string; password: string; full_name: string; email: string;
    sec_q1: string; sec_a1: string; sec_q2: string; sec_a2: string; sec_q3: string; sec_a3: string;
  }) => callAPI<ApiResponse>( "registerUser", p ),

  login: (p: { mssv: string; password: string }) =>
    callAPI<ApiResponse<ForumUser>>( "login", p ),

  forgotPasswordGetQuestions: (p: { mssv: string }) =>
    callAPI<ApiResponse<{ mssv: string; questions: string[] }>>(
      "forgotPasswordGetQuestions", p
    ),

  forgotPasswordReset: (p: {
    mssv: string; answers: { a1: string; a2: string; a3: string }; new_password: string;
  }) => callAPI<ApiResponse>( "forgotPasswordReset", p ),

  // FORUM
  createQuestion: (p: {
    title: string; category: string; user: string; content: string; anonymous?: boolean;
  }) => callAPI<ApiResponse<{ id: string; createdAt: string }>>( "createQuestion", p ),

  createResponse: (p: {
    user: string; anonymous?: boolean; content: string; questionId: string;
  }) => callAPI<ApiResponse<{ id: string; createdAt: string }>>( "createResponse", p ),

  toggleLike: (p: { questionId: string; mssv: string; like: 0 | 1 }) =>
    callAPI<ApiResponse<{ like_count: number }>>( "toggleLike", p ),

  deleteQuestion: (p: { questionId: string; mssv: string }) =>
    callAPI<ApiResponse>( "deleteQuestion", p ),

  deleteResponse: (p: { responseId: string; mssv: string }) =>
    callAPI<ApiResponse>( "deleteResponse", p ),

  fetchQuestions: (p: { take?: number; category?: string; search?: string; sortBy?: string; includeDeleted?: boolean } = {}) =>
    callAPI<ApiResponse<{ items: QuestionItem[] }>>( "fetchQuestions", p ),
};
