import { BASE_URL } from "@/lib/base-url";
import fetcher from "@/lib/fetcher";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { PostType } from "@/types/post.type";
import { UserType } from "@/types/user.type";

interface PropsType {
  query: string;
  filter?: string;
}

// --- Specific Search Results Interfaces ---
interface PostSearchResults {
  status: string; // From API response
  posts: PostType[];
}

interface UserSearchResults {
  status: string; // From API response
  users: UserType[];
}

// --- Hook Overloads ---
// For when filter is 'user'
function useSearch(
  params: PropsType & { filter: "user" }
): UseQueryResult<UserSearchResults, Error>;
// For when filter is anything else (including undefined)
function useSearch(
  params: PropsType & { filter?: Exclude<string, "user"> }
): UseQueryResult<PostSearchResults, Error>;

// --- Hook Implementation ---
function useSearch({ query, filter }: PropsType) {
  const url = query
    ? `${BASE_URL}/api/search?q=${query}&f=${filter || ""}`
    : null;

  const commonQueryOptions = {
    queryKey: ["search", query, filter],
    enabled: !!url,
    staleTime: 1000 * 60 * 5, // 5 minutes for search results
  };

  if (filter === "user") {
    // Return useQuery for user results
    return useQuery<UserSearchResults, Error>({
      ...commonQueryOptions,
      queryFn: () => fetcher<UserSearchResults>(url!),
    });
  } else {
    // Return useQuery for post results (default)
    return useQuery<PostSearchResults, Error>({
      ...commonQueryOptions,
      queryFn: () => fetcher<PostSearchResults>(url!),
    });
  }
}

export default useSearch;