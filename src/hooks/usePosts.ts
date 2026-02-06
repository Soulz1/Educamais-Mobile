import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { postService } from '../services/postService';
import type { PostFormData } from '../types/models';

// Query keys
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
      // If the last page has less than 10 items, we've reached the end
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
    enabled: !!postId,
  });
}

/**
 * Hook para criar um novo post
 */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PostFormData) => postService.createPost(data),
    onSuccess: () => {
      // Invalidate all post lists to refetch
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
    mutationFn: ({ postId, data }: { postId: number; data: PostFormData }) =>
      postService.updatePost(postId, data),
    onSuccess: (_, variables) => {
      // Invalidate the specific post and all lists
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
      // Invalidate all post lists
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
