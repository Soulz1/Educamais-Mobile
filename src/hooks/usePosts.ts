import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { postService } from '../services/postService';
import { CreatePostFormData, UpdatePostFormData } from '../types/models';
import type { PostFormData } from '../types/models';

// Query keys
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
 * Hook to fetch posts with pagination
 */
export function usePosts(page: number = 1, limit: number = 10, query?: string) {
  return useQuery({
    queryKey: postKeys.list({ page, query }),
    queryFn: () => postService.getAllPosts(page, limit, query),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch posts with infinite scroll
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
 * Hook to fetch a single post by ID
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
      // Invalidate all post lists
    mutationFn: (data: PostFormData) => postService.createPost(data),
    onSuccess: () => {
      // Invalidate all post lists to refetch
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
      // Invalidate specific post detail
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
      // Invalidate all post lists
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
 * Hook to delete a post
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
 * Hook to search posts
 */
export function useSearchPosts(searchTerm: string, page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: postKeys.list({ page, query: searchTerm }),
    queryFn: () => postService.searchPosts(searchTerm, page, limit),
    enabled: searchTerm.length > 0,
    staleTime: 1000 * 60 * 5,
 * Hook para buscar posts (sem paginação infinita - para casos simples)
 */
export function usePosts(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: postKeys.list({ page, limit }),
    queryFn: () => postService.getAllPosts(page, limit),
  });
}
