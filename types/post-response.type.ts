import { PostType } from "./post.type";

export interface PostListResponse {
  posts: PostType[];
  pagination?: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface SinglePostResponse {
  post: PostType;
}