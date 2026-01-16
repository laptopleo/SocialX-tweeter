
import type { CommentType } from "./comment.type";

export type PostType = {
  id: number;
  body: string;
  userId: number;
  comments: CommentType[];

  likeIds: number[];

  postImage: string | null;
  postVideo: string | null;
  postGif: string | null;

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