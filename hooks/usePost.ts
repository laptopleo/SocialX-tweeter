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
  // Single post query
  const singlePostQuery = useQuery<SinglePostResponse, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetcher<SinglePostResponse>(`${BASE_URL}/api/posts/${postId}`),
    enabled: !!postId,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5, // 5 minutes for a single post
  });

  // Infinite posts query
  const infinitePostsQuery = useInfiniteQuery<PostListResponse, Error>({
    queryKey: ["posts", "infinite", { userId }],
    queryFn: async ({ pageParam = 1 }) => {
      const url = userId
        ? `${BASE_URL}/api/posts?userId=${userId}`
        : `${BASE_URL}/api/posts`;
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
    enabled: isInfinite && !postId,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 5,
  });

  // Regular posts query
  const regularPostsQuery = useQuery<PostListResponse, Error>({
    queryKey: ["posts", { userId }],
    queryFn: () => {
      const url = userId
        ? `${BASE_URL}/api/posts?userId=${userId}`
        : `${BASE_URL}/api/posts`;
      const fetchUrl = url.includes("?")
        ? `${url}&limit=5`
        : `${url}?limit=5`;
      return fetcher<PostListResponse>(fetchUrl);
    },
    enabled: !isInfinite && !postId,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60, // 1 minute
  });

  // Return the appropriate query based on conditions
  if (postId) {
    return singlePostQuery;
  }
  
  if (isInfinite) {
    return infinitePostsQuery;
  }
  
  return regularPostsQuery;
}

export default usePost;
