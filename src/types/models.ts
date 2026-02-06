import { z } from 'zod';

// ==================== ENUMS ====================

export const Role = {
  TEACHER: 'teacher',
  STUDENT: 'student',
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];

// ==================== USER TYPES ====================

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

export interface UserSession {
  user: User;
  sessionToken: string;
}

// ==================== POST TYPES ====================

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
