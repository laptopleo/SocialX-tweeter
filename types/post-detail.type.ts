// ⚡ Tipos para página de post individual con ISR
import { Post, User, Comment } from "@prisma/client";

// Tipo para datos de post con relaciones (fechas como Date)
export type PostWithRelations = Post & {
  user: Pick<User, "id" | "name" | "username" | "profileImage">;
  comments: Array<
    Comment & {
      user: Pick<User, "id" | "name" | "username" | "profileImage">;
    }
  >;
  _count: {
    comments: number;
  };
};

// Tipo para datos de post serializados (fechas como string para SSR)
export type SerializedPostWithRelations = Omit<
  PostWithRelations,
  "createdAt" | "updatedAt" | "comments"
> & {
  createdAt: string;
  updatedAt: string;
  comments: Array<
    Omit<
      Comment & {
        user: Pick<User, "id" | "name" | "username" | "profileImage">;
      },
      "createdAt" | "updatedAt"
    > & {
      createdAt: string;
      updatedAt: string;
    }
  >;
};

export interface PostDetailPageProps {
  params: {
    username: string;
    postId: string;
  };
}

export interface PostDetailMetadata {
  title: string;
  description: string;
  openGraph: {
    title: string;
    description: string;
    images: string[];
    type: "article";
  };
  twitter: {
    card: "summary_large_image";
    title: string;
    description: string;
    images: string[];
  };
}
