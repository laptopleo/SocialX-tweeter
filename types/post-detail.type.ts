// ⚡ Tipos para página de post individual con ISR
import { Prisma } from "@prisma/client";

// 1. Define el 'include' para las relaciones del post
const postWithRelationsArgs = Prisma.validator()({
  include: {
    user: {
      select: {
        id: true,
        name: true,
        username: true,
        profileImage: true,
      },
    },
    comments: {
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            profileImage: true,
          },
        },
      },
    },
    _count: {
      select: {
        comments: true,
      },
    },
  },
});

// 2. Genera el tipo 'PostWithRelations' usando Prisma.PostGetPayload
export type PostWithRelations = Prisma.PostGetPayload<typeof postWithRelationsArgs>;

// 3. Define un tipo para los comentarios con su usuario
type CommentWithUser = Prisma.CommentGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        name: true;
        username: true;
        profileImage: true;
      };
    };
  };
}>;

// 4. Tipo para datos de post serializados (fechas como string para SSR)
export type SerializedPostWithRelations = Omit<
  PostWithRelations,
  "createdAt" | "updatedAt" | "comments"
> & {
  createdAt: string;
  updatedAt: string;
  comments: (Omit<CommentWithUser, "createdAt" | "updatedAt"> & {
    createdAt: string;
    updatedAt: string;
  })[];
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
