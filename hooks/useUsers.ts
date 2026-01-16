"use client";
import { BASE_URL } from "@/lib/base-url";
import fetcher from "@/lib/fetcher";
import { useQuery } from "@tanstack/react-query";
import type { UsersApiResponse } from "@/types/api.types";

const useUsers = () => {
  const { data, error, isLoading, refetch } = useQuery<UsersApiResponse>({
    queryKey: ["users", "allusers"],
    queryFn: () => fetcher(`${BASE_URL}/api/users`),
    staleTime: 5 * 60 * 1000, // 5 minutes - user suggestions don't need real-time updates
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection time
    refetchOnMount: false, // Don't refetch on component mount if data is fresh
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
  });
  return {
    data,
    error,
    isLoading,
    refetch,
  };
};

export default useUsers;
