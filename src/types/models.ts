import { z } from 'zod';

// ==================== ENUMS ====================

export const Role = {
  TEACHER: 'teacher',
  STUDENT: 'student',
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];

// ==================== USER TYPES ====================

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
  appRole?: RoleType;
}

export interface AuthResponse {
  token: string;
  user: User;
}

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

// ==================== POST TYPES ====================

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
    appRole?: RoleType;
  };
}

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

export interface PostDetailResponse {
  success: boolean;
  data: Post;
}

// ==================== ZOD SCHEMAS ====================

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
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

export const signUpSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;

// Post Schemas
export const createPostSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres').max(200, 'Título muito longo'),
  conteudo: z.string().min(10, 'Conteúdo deve ter pelo menos 10 caracteres'),
  descricao: z.string().max(500, 'Descrição muito longa').optional(),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;

export const updatePostSchema = createPostSchema;
export type UpdatePostFormData = z.infer<typeof updatePostSchema>;

// ==================== API ERROR TYPES ====================

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}
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
