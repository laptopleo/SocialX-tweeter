// API Response Types for SocialX

import { UserType } from "./user.type";

export interface ApiResponse<T> {
  message: string;
  status: "success" | "error";
  data?: T;
}

export interface UsersApiResponse {
  message: string;
  status: "success" | "error";
  data: UserType[];
}

export interface CurrentUserApiResponse {
  currentUser: UserType;
}

// Utility type for paginated responses
export interface PaginatedApiResponse<T> {
  message: string;
  status: "success" | "error";
  data?: T[];
  pagination?: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
}
