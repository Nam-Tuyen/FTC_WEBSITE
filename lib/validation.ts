// Validation schemas với Zod
import { z } from 'zod';

const MSSV = z.string().regex(/^K\d{9}$/i, 'MSSV phải theo dạng K + 9 số');

export const RegisterSchema = z.object({
  mssv: MSSV,
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
  full_name: z.string().min(2, 'Họ tên tối thiểu 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  sec_q1: z.string().min(3, 'Câu hỏi bảo mật 1 tối thiểu 3 ký tự'),
  sec_a1: z.string().min(1, 'Đáp án bảo mật 1 không được để trống'),
  sec_q2: z.string().min(3, 'Câu hỏi bảo mật 2 tối thiểu 3 ký tự'),
  sec_a2: z.string().min(1, 'Đáp án bảo mật 2 không được để trống'),
  sec_q3: z.string().min(3, 'Câu hỏi bảo mật 3 tối thiểu 3 ký tự'),
  sec_a3: z.string().min(1, 'Đáp án bảo mật 3 không được để trống'),
});

export const LoginSchema = z.object({
  mssv: MSSV,
  password: z.string().min(1, 'Mật khẩu không được để trống'),
});

export const ForgotGetSchema = z.object({
  mssv: MSSV,
});

export const ForgotResetSchema = z.object({
  mssv: MSSV,
  answers: z.object({
    a1: z.string().min(1, 'Đáp án 1 không được để trống'),
    a2: z.string().min(1, 'Đáp án 2 không được để trống'),
    a3: z.string().min(1, 'Đáp án 3 không được để trống'),
  }),
  new_password: z.string().min(6, 'Mật khẩu mới tối thiểu 6 ký tự'),
});

export const AskSchema = z.object({
  title: z.string().min(5, 'Tiêu đề tối thiểu 5 ký tự'),
  category: z.enum(['Hỏi về ngành học', 'Hỏi về câu lạc bộ', 'Thảo luận'], {
    errorMap: () => ({ message: 'Vui lòng chọn danh mục' })
  }),
  content: z.string().min(10, 'Nội dung tối thiểu 10 ký tự'),
  anonymous: z.boolean().optional()
});

export const ResponseSchema = z.object({
  content: z.string().min(1, 'Nội dung phản hồi không được để trống'),
  anonymous: z.boolean().optional()
});

export type RegisterFormData = z.infer<typeof RegisterSchema>;
export type LoginFormData = z.infer<typeof LoginSchema>;
export type ForgotGetFormData = z.infer<typeof ForgotGetSchema>;
export type ForgotResetFormData = z.infer<typeof ForgotResetSchema>;
export type AskFormData = z.infer<typeof AskSchema>;
export type ResponseFormData = z.infer<typeof ResponseSchema>;
