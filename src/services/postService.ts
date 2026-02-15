import { api } from './api';
import { Post, PostsResponse, PostDetailResponse, CreatePostFormData, UpdatePostFormData } from '../types/models';

class PostService {

import api from './api';
import type { Post, PostsResponse } from '../types/models';

class PostService {
  /**
   * Buscar todos os posts com paginação
   */
  async getAllPosts(page: number = 1, limit: number = 10, query?: string): Promise<PostsResponse> {
    try {
      const params: Record<string, string | number> = { page, limit };
      if (query) {
        params.q = query;
      }

      const response = await api.get<PostsResponse>('/posts', { params });
      const response = await api.get<PostsResponse>('/posts', {
        params: { page, limit },
      });

      console.log(`📝 Posts fetched: ${response.data.data.length} posts`);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar posts:', error);
      throw error;
    }
  }

  /**
   * Buscar um post específico pelo ID
   */
  async getPostById(postId: number): Promise<Post> {
    try {
      const response = await api.get<PostDetailResponse>(`/posts/${postId}`);
      const response = await api.get(`/posts/${postId}`);
      // backend returns { success, data: Post }
      return response.data.data;
    } catch (error) {
      console.error('❌ Erro ao buscar post:', error);
      throw error;
    }
  }

  /**
   * Buscar posts por termo de busca
   */
  async searchPosts(searchTerm: string, page: number = 1, limit: number = 10): Promise<PostsResponse> {
  async searchPosts(searchTerm: string, page: number = 1, limit: number = 10): Promise<Post[]> {
    try {
      const response = await api.get<PostsResponse>('/posts', {
        params: { q: searchTerm, page, limit },
      });
      return response.data.data;
    } catch (error) {
      console.error('❌ Erro ao buscar posts:', error);
      throw error;
    }
  }

  /**
   * Criar um novo post
   */
  async createPost(data: CreatePostFormData): Promise<Post> {
  async createPost(data: { titulo: string; conteudo: string; descricao?: string }): Promise<Post> {
    try {
      const response = await api.post<{ success: boolean; data: Post }>('/posts', data);

      console.log('✅ Post criado com sucesso');
      return response.data.data;
    } catch (error) {
      console.error('❌ Erro ao criar post:', error);
      throw error;
    }
  }

  /**
   * Atualizar um post existente
   */
  async updatePost(postId: number, data: UpdatePostFormData): Promise<Post> {
  async updatePost(
    postId: number,
    data: { titulo: string; conteudo: string; descricao?: string }
  ): Promise<Post> {
    try {
      const response = await api.put<{ success: boolean; data: Post }>(`/posts/${postId}`, data);

      console.log('✅ Post atualizado com sucesso');
      return response.data.data;
    } catch (error) {
      console.error('❌ Erro ao atualizar post:', error);
      throw error;
    }
  }

  /**
   * Deletar um post
   */
  async deletePost(postId: number): Promise<void> {
    try {
      await api.delete(`/posts/${postId}`);
      console.log('✅ Post deletado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao deletar post:', error);
      throw error;
    }
  }
}

export const postService = new PostService();
