import { z } from 'zod';

// User Role enum
export enum UserRole {
  TEACHER = 'teacher',
  STUDENT = 'student',
  ADMIN = 'admin',
}

// User type
export interface User {
  id: string;
  email: string;
  name: string;
  appRole?: string;
  role?: UserRole;
}

// Auth Response
export interface AuthResponse {
  user: User;
  token: string;
}

// User Session
export interface UserSession {
  user: User;
  sessionToken: string;
}

// Post type
export interface Post {
  id: number;
  titulo: string;
  conteudo: string;
  descricao?: string;
  autorId: string;
  createdAt: string;
  atualizacao: string;
  autor?: {
    name: string;
    email: string;
    appRole?: string;
  };
}

// Posts Response with pagination
export interface PostsResponse {
  success: boolean;
  data: Post[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Comment type (for future implementation)
export interface Comment {
  id: number;
  content: string;
  postId: number;
  authorId: string;
  author?: User;
  createdAt: string;
  updatedAt: string;
}

// Teacher type (scaffold for future CRUD)
export interface Teacher {
  id: string;
  name: string;
  email: string;
  subject?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

// Student type (scaffold for future CRUD)
export interface Student {
  id: string;
  name: string;
  email: string;
  enrollment?: string;
  course?: string;
  createdAt: string;
  updatedAt: string;
}

// === Zod Schemas for Validation ===

// Login Schema
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Post Create/Edit Schema
export const postSchema = z.object({
  titulo: z
    .string()
    .min(3, 'O título deve ter no mínimo 3 caracteres')
    .max(200, 'O título deve ter no máximo 200 caracteres'),
  conteudo: z
    .string()
    .min(10, 'O conteúdo deve ter no mínimo 10 caracteres')
    .max(10000, 'O conteúdo deve ter no máximo 10000 caracteres'),
  descricao: z
    .string()
    .max(500, 'A descrição deve ter no máximo 500 caracteres')
    .optional(),
});

export type PostFormData = z.infer<typeof postSchema>;

// Comment Schema (for future use)
export const commentSchema = z.object({
  content: z
    .string()
    .min(1, 'O comentário não pode estar vazio')
    .max(1000, 'O comentário deve ter no máximo 1000 caracteres'),
});

export type CommentFormData = z.infer<typeof commentSchema>;

// Teacher Schema (scaffold)
export const teacherSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  subject: z.string().optional(),
  department: z.string().optional(),
});

export type TeacherFormData = z.infer<typeof teacherSchema>;

// Student Schema (scaffold)
export const studentSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  enrollment: z.string().optional(),
  course: z.string().optional(),
});

export type StudentFormData = z.infer<typeof studentSchema>;
