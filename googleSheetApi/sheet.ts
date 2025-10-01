/**
 * Google Sheets API Client
 * Connects to Apps Script Web App for Forum & Auth functionality
 * 
 * Backend: Google Apps Script deployed as Web App
 * Sheets: Info_user, Questions, Responses, React
 */

import { CATEGORIES } from "./constants"

// Use Next.js API route as proxy to avoid CORS issues
const WEB_APP_URL = "/api/forum"

/**
 * Allowed categories matching Apps Script ALLOWED_CATEGORIES
 */
export type Category = "Hỏi về ngành học" | "Hỏi về câu lạc bộ" | "Thảo luận"

// Re-export constants for convenience
export { CATEGORIES, STORAGE_KEYS } from "./constants"

/**
 * User data returned after successful login
 * Maps to: userId, mssv, full_name, email from Info_user sheet
 */
export type AuthUser = {
  userId: string
  mssv: string
  full_name: string
  email: string
}

/**
 * Response/Reply item from Responses sheet
 * - user: 'anonymous' if anonymous=true, otherwise MSSV
 * - reaction: upvote count (currently not used in UI)
 */
export type ResponseItem = {
  id: string
  user: string // 'anonymous' | MSSV
  content: string
  questionId: string
  reaction: number
  createdAt: string | Date
}

/**
 * Question item from Questions sheet
 * - user: 'anonymous' if anonymous=true, otherwise MSSV
 * - like_count: calculated from React sheet
 * - responses: array of ResponseItem sorted by reaction desc, createdAt desc
 */
export type QuestionItem = {
  id: string
  title: string
  category: Category
  user: string // 'anonymous' | MSSV
  content: string
  like_count: number
  createdAt: string | Date
  responses: ResponseItem[]
}

/**
 * Standard API response wrapper from Apps Script
 * - ok: true if success, false if error
 * - message: Vietnamese message for user display
 * - data: payload (varies by endpoint)
 * - timestamp: ISO 8601 timestamp
 * - error?: error details (when ok=false)
 */
export type ApiResp<T = any> = {
  ok: boolean
  message: string
  data?: T
  timestamp: string
  error?: string
}

/**
 * Generic API call to Google Apps Script Web App
 * @param action - Function name to call (matches Apps Script switch cases)
 * @param body - Payload object (goes into payload parameter in Apps Script)
 * @returns ApiResp<T> with standardized response format
 */
async function apiCall<T>(action: string, body: any): Promise<ApiResp<T>> {
  try {
    const res = await fetch(WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ function: action, body }),
    })
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    
    const json = await res.json()
    return json as ApiResp<T>
  } catch (networkError) {
    // Network or fetch error
    return {
      ok: false,
      message: "Lỗi kết nối: Không thể kết nối đến server",
      error: networkError instanceof Error ? networkError.message : "Unknown error",
      timestamp: new Date().toISOString(),
    } as ApiResp<T>
  }
}

// ==================== AUTH APIs ====================

/**
 * Register a new user
 * @param payload - User registration data
 * @returns userId and mssv on success
 * 
 * Validations (Apps Script):
 * - mssv: Must match K+9 digits (e.g., K225123456)
 * - All fields required
 * - MSSV must be unique
 * - Password hashed with SHA-256
 * - Security answers hashed and lowercased
 */
export const registerUser = (payload: {
  mssv: string
  password: string
  full_name: string
  email: string
  sec_q1: string
  sec_a1: string
  sec_q2: string
  sec_a2: string
  sec_q3: string
  sec_a3: string
}) => apiCall<{ userId: string; mssv: string }>("registerUser", payload)

/**
 * Login with MSSV and password
 * @param payload - Login credentials
 * @returns AuthUser data on success
 * 
 * Validations:
 * - MSSV must exist and not be deleted
 * - Password must match hashed password in sheet
 */
export const login = (payload: { mssv: string; password: string }) => apiCall<AuthUser>("login", payload)

/**
 * Get security questions for password reset
 * @param payload - MSSV to lookup
 * @returns Array of 3 security questions
 */
export const forgotPasswordGetQuestions = (payload: { mssv: string }) =>
  apiCall<{ mssv: string; questions: string[] }>("forgotPasswordGetQuestions", payload)

/**
 * Reset password with security answers
 * @param payload - MSSV, security answers, and new password
 * @returns Success message
 * 
 * Validations:
 * - All 3 answers must match (case-insensitive, trimmed)
 * - New password will be hashed and stored
 */
export const forgotPasswordReset = (payload: {
  mssv: string
  answers: { a1: string; a2: string; a3: string }
  new_password: string
}) => apiCall("forgotPasswordReset", payload)

// ==================== FORUM APIs ====================

/**
 * Create a new question
 * @param payload - Question data
 * @returns Generated question ID and creation timestamp
 * 
 * Validations:
 * - title, category, user (MSSV), content are required
 * - category must be one of ALLOWED_CATEGORIES
 * - user must be valid MSSV format (K+9 digits)
 * - anonymous: if true, user will be displayed as 'anonymous'
 */
export const createQuestion = (payload: {
  title: string
  category: Category
  user: string
  content: string
  anonymous?: boolean
}) => apiCall<{ id: string; createdAt: string | Date }>("createQuestion", payload)

/**
 * Create a response/reply to a question
 * @param payload - Response data
 * @returns Generated response ID and creation timestamp
 * 
 * Validations:
 * - user (MSSV), content, questionId are required
 * - Question must exist and not be deleted
 * - anonymous: if true, user will be displayed as 'anonymous'
 */
export const createResponse = (payload: {
  user: string
  anonymous?: boolean
  content: string
  questionId: string
}) => apiCall<{ id: string; createdAt: string | Date }>("createResponse", payload)

/**
 * Toggle like/unlike on a question
 * @param payload - Question ID, MSSV, and like state (0 or 1)
 * @returns Updated like_count for the question
 * 
 * Behavior:
 * - like=1: Add/update like in React sheet
 * - like=0: Remove like from React sheet
 * - like_count is recalculated and updated in Questions sheet
 */
export const toggleLike = (payload: { questionId: string; mssv: string; like: 0 | 1 }) =>
  apiCall<{ like_count: number }>("toggleLike", payload)

/**
 * Delete a question (soft delete)
 * @param payload - Question ID and owner MSSV
 * @returns Success message
 * 
 * Validations:
 * - Only question owner can delete
 * - Sets isDeleted=true on question and all its responses
 */
export const deleteQuestion = (payload: { questionId: string; mssv: string }) => apiCall("deleteQuestion", payload)

/**
 * Delete a response (soft delete)
 * @param payload - Response ID and owner MSSV
 * @returns Success message
 * 
 * Validations:
 * - Only response owner can delete
 * - Sets isDeleted=true on the response
 */
export const deleteResponse = (payload: { responseId: string; mssv: string }) => apiCall("deleteResponse", payload)

/**
 * Fetch questions with filters and search
 * @param payload - Query parameters
 * @returns Array of QuestionItem with nested responses
 * 
 * Filters:
 * - take: Limit number of results (after sorting)
 * - category: Filter by category
 * - search: Search in title and content (case-insensitive)
 * - includeDeleted: Include soft-deleted questions (default: false)
 * 
 * Sorting:
 * - Primary: like_count descending
 * - Secondary: createdAt descending
 * 
 * Responses within each question are also sorted by:
 * - Primary: reaction descending
 * - Secondary: createdAt descending
 */
export const fetchQuestions = (payload: {
  take?: number
  category?: Category
  search?: string
  includeDeleted?: boolean
}) => apiCall<{ items: QuestionItem[] }>("fetchQuestions", payload)
