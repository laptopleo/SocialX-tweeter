import { BASE_URL } from "@/lib/base-url";
import fetcher from "@/lib/fetcher";
import { PostType } from "@/types/post.type";
import { PostListResponse, SinglePostResponse } from "@/types/post-response.type";
import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useQuery,
  UseQueryResult,
  InfiniteData,
} from "@tanstack/react-query";

// Implementation without overloads to allow runtime flexibility
function usePost({
  userId,
  postId,
  isInfinite = false,
}: {
  userId?: number;
  postId?: number;
  isInfinite?: boolean;
} = {}) {
  // Case 1: Fetching a single post by ID (highest specificity)
  if (postId) {
    const url = `${BASE_URL}/api/posts/${postId}`;
    return useQuery<SinglePostResponse, Error>({
      queryKey: ["post", postId],
      queryFn: () => fetcher<SinglePostResponse>(url),
      enabled: !!postId,
      refetchOnWindowFocus: true,
      staleTime: 1000 * 60 * 5, // 5 minutes for a single post
    });
  }

  // Case 2: Fetching an infinite list of posts
  if (isInfinite) {
    const url = userId
      ? `${BASE_URL}/api/posts?userId=${userId}`
      : `${BASE_URL}/api/posts`;
    return useInfiniteQuery<PostListResponse, Error>({
      queryKey: ["posts", "infinite", { userId }],
      queryFn: async ({ pageParam = 1 }) => {
        const separator = url.includes("?") ? "&" : "?";
        const paginatedUrl = `${url}${separator}page=${pageParam}&limit=10`;
        return fetcher<PostListResponse>(paginatedUrl);
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.pagination?.hasMore) {
          return allPages.length + 1;
        }
        return undefined;
      },
      refetchOnWindowFocus: true,
      staleTime: 1000 * 5,
    });
  }

  // Case 3: Default - fetching a simple list of posts
  const url = userId
    ? `${BASE_URL}/api/posts?userId=${userId}`
    : `${BASE_URL}/api/posts`;
  return useQuery<PostListResponse, Error>({
    queryKey: ["posts", { userId }],
    queryFn: () => {
      const fetchUrl = url.includes("?")
        ? `${url}&limit=5`
        : `${url}?limit=5`;
      return fetcher<PostListResponse>(fetchUrl);
    },
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60, // 1 minute
  });
}

export default usePost;
