// API Client theo Apps Script
import { 
  ApiResp, 
  RegisterPayload, 
  LoginPayload, 
  ForgotGetPayload, 
  ForgotResetPayload,
  CreateQuestionPayload,
  CreateResponsePayload,
  ToggleLikePayload,
  DeleteQuestionPayload,
  DeleteResponsePayload,
  FetchQuestionsPayload,
  AuthUser,
  QuestionItem
} from '@/types/api';

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyCfakaiFBnEQT0DYiyfjTJYxSO0_yZa0MzrsqjbodAI7Ay9i3OtF2zYpXdWibIX6P_Yw/exec';

async function apiCall<T>(action: string, body: any): Promise<ApiResp<T>> {
  try {
    const res = await fetch(WEB_APP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ function: action, body })
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const text = await res.text();
    try { 
      return JSON.parse(text); 
    } catch { 
      throw new Error('Phản hồi không phải JSON:\n' + text); 
    }
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Auth APIs
export const registerUser = (payload: RegisterPayload) =>
  apiCall<{ userId: string; mssv: string }>('registerUser', payload);

export const login = (payload: LoginPayload) =>
  apiCall<AuthUser>('login', payload);

export const forgotPasswordGetQuestions = (payload: ForgotGetPayload) =>
  apiCall<{ mssv: string; questions: string[] }>('forgotPasswordGetQuestions', payload);

export const forgotPasswordReset = (payload: ForgotResetPayload) =>
  apiCall('forgotPasswordReset', payload);

// Forum APIs
export const createQuestion = (payload: CreateQuestionPayload) =>
  apiCall<{ id: string; createdAt: string }>('createQuestion', payload);

export const createResponse = (payload: CreateResponsePayload) =>
  apiCall<{ id: string; createdAt: string }>('createResponse', payload);

export const toggleLike = (payload: ToggleLikePayload) =>
  apiCall<{ like_count: number }>('toggleLike', payload);

export const deleteQuestion = (payload: DeleteQuestionPayload) =>
  apiCall('deleteQuestion', payload);

export const deleteResponse = (payload: DeleteResponsePayload) =>
  apiCall('deleteResponse', payload);

export const fetchQuestions = (payload: FetchQuestionsPayload) =>
  apiCall<{ items: QuestionItem[] }>('fetchQuestions', payload);
