import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { postService } from '../services/postService';
import { CreatePostFormData, UpdatePostFormData } from '../types/models';

// Chaves para queries
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
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
    queryKey: postKeys.list({ page, limit, search: query }),
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
 * Hook para buscar um post específico
 */
export function usePost(postId: number) {
  return useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => postService.getPostById(postId),
    staleTime: 1000 * 60 * 5,
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
      // Invalida todas as listas de posts para recarregar
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

/**
 * Hook para atualizar um post
 */
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, data }: { postId: number; data: UpdatePostFormData }) =>
      postService.updatePost(postId, data),
    onSuccess: (_, variables) => {
      // Invalida o post específico e todas as listas
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

/**
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
