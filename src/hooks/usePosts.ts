import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { postService } from '../services/postService';
import { CreatePostFormData, UpdatePostFormData } from '../types/models';
import type { PostFormData } from '../types/models';

// Chaves para queries
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: { page?: number; query?: string }) => [...postKeys.lists(), { filters }] as const,
  list: (filters: { search?: string; page?: number; limit?: number }) => 
    [...postKeys.lists(), filters] as const,
  infinite: (search?: string) => [...postKeys.lists(), 'infinite', { search }] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: number) => [...postKeys.details(), id] as const,
};

/**
 * Hook para buscar posts com paginação
 */
export function usePosts(page: number = 1, limit: number = 10, query?: string) {
  return useQuery({
    queryKey: postKeys.list({ page, query }),
    queryFn: () => postService.getAllPosts(page, limit, query),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Hook para buscar posts com scroll infinito
 */
export function useInfinitePosts(limit: number = 10, query?: string) {
  return useInfiniteQuery({
    queryKey: [...postKeys.lists(), 'infinite', query],
    queryFn: ({ pageParam = 1 }) => postService.getAllPosts(pageParam, limit, query),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination) {
        const { page, pages } = lastPage.pagination;
        return page < pages ? page + 1 : undefined;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para buscar um único post pelo ID
 * Hook para buscar posts com paginação infinita
 */
export function useInfinitePosts(searchTerm?: string) {
  return useInfiniteQuery({
    queryKey: postKeys.infinite(searchTerm),
    queryFn: async ({ pageParam = 1 }) => {
      if (searchTerm) {
        return postService.searchPosts(searchTerm, pageParam, 10);
      }
      return postService.getAllPosts(pageParam, 10);
    },
    getNextPageParam: (lastPage, allPages) => {
      // Se a última página tem menos de 10 itens, chegamos ao fim
      return lastPage.length === 10 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
}

/**
 * Hook para buscar um post específico
 */
export function usePost(postId: number) {
  return useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => postService.getPostById(postId),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to create a new post
    enabled: !!postId,
  });
}

/**
 * Hook para criar um novo post
 */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostFormData) => postService.createPost(data),
    onSuccess: () => {
      // Invalida todas as listas de posts
    mutationFn: (data: PostFormData) => postService.createPost(data),
    onSuccess: () => {
      // Invalida todas as listas de posts para recarregar
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

/**
 * Hook to update a post
 * Hook para atualizar um post
 */
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, data }: { postId: number; data: UpdatePostFormData }) =>
      postService.updatePost(postId, data),
    onSuccess: (_, variables) => {
      // Invalida o detalhe do post específico
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
      // Invalida todas as listas de posts
    mutationFn: ({ postId, data }: { postId: number; data: PostFormData }) =>
      postService.updatePost(postId, data),
    onSuccess: (_, variables) => {
      // Invalida o post específico e todas as listas
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

/**
 * Hook to delete a post
 * Hook para deletar um post
 */
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => postService.deletePost(postId),
    onSuccess: () => {
      // Invalida todas as listas de posts
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

/**
 * Hook para buscar posts (sem paginação infinita - para casos simples)
 */
export function usePosts(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: postKeys.list({ page, limit }),
    queryFn: () => postService.getAllPosts(page, limit),
  });
}
