"use client";

import { createContext, useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "@/lib/base-url";
import fetcher from "@/lib/fetcher";
import { useStore } from "@/hooks/useStore";
import type { CurrentUserApiResponse } from "@/types/api.types";
import { UserType } from "@/types/user.type";

type CurrentUserType = {
  currentUser: UserType;
};

// Define the context shape
type CurrentUserContextType = {
  data?: CurrentUserType;
  error: any;
  isLoading: boolean;
  isFetching: boolean;
  refetch: () => void;
};

const CurrentUserContext = createContext<CurrentUserContextType | undefined>(undefined);

export const CurrentUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, error, isLoading, isFetching, refetch } = useQuery<CurrentUserApiResponse>({
    queryKey: ["currentUser"],
    queryFn: () => fetcher(`${BASE_URL}/api/current-user`),
    staleTime: 30000, // 30 seconds - user data doesn't change frequently
    gcTime: 5 * 60 * 1000, // 5 minutes garbage collection time
    refetchInterval: 60000, // 60 seconds - reduced frequency
    refetchIntervalInBackground: false, // No polling in background
    refetchOnWindowFocus: true, // Refresh when user returns to tab
  });

  const { onOpenBirthDayModal } = useStore();

  useEffect(() => {
    if (data?.currentUser && !data?.currentUser?.dateOfBirth) {
      onOpenBirthDayModal();
    }
  }, [data, onOpenBirthDayModal]);

  return (
    <CurrentUserContext.Provider value={{ data, error, isLoading, isFetching, refetch }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUserContext = () => {
  const context = useContext(CurrentUserContext);
  if (!context) {
    throw new Error("useCurrentUserContext must be used within a CurrentUserProvider");
  }
  return context;
};
