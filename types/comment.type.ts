import { PostType } from "./post.type";

export type CommentType = {
  id: number;
  body: string;
  userId: number;
  postId: number;
  commentImage: string | null;
  commentVideo: string | null;
  commentGif: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: number;
    name: string;
    username: string | null;
    profileImage?: string | null;
    subscription?: { plan: string } | null;
  };
};