// ⚡ Tipos para perfil de usuario con ISR
import { User, Post, Comment, Subscription } from "@prisma/client";

export type UserWithRelations = User & {
  posts: Post[];
  comments: Array<
    Comment & {
      user: Pick<User, "id" | "name" | "username" | "profileImage"> & {
        subscription?: Subscription | null;
      };
    }
  >;
  subscription: Subscription | null;
  _count: {
    posts: number;
    comments: number;
  };
  // Campo derivado para compatibilidad con componentes del perfil
  followersCount?: number;
};

export interface UserProfilePageProps {
  params: {
    username: string;
  };
}

export interface UserProfileMetadata {
  title: string;
  description: string;
  openGraph: {
    title: string;
    description: string;
    images: string[];
    type: "profile";
  };
  twitter: {
    card: "summary_large_image";
    title: string;
    description: string;
    images: string[];
  };
}
