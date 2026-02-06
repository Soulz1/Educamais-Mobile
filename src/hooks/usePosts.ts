import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { postService } from '../services/postService';
import { Post, CreatePostFormData, UpdatePostFormData } from '../types/models';

// Query keys
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: { page?: number; query?: string }) => [...postKeys.lists(), { filters }] as const,
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
 */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostFormData) => postService.createPost(data),
    onSuccess: () => {
      // Invalidate all post lists
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

/**
 * Hook to update a post
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
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

/**
 * Hook to delete a post
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
  });
}
