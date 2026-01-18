// ⚡ Tipos para perfil de usuario con ISR
import { Prisma } from "@prisma/client";

// 1. Define los 'includes' para las relaciones del usuario
const userWithRelationsArgs = Prisma.validator()({
  include: {
    posts: true,
    comments: {
      include: {
        user: {
          include: {
            subscription: true,
          },
        },
      },
    },
    subscription: true,
    _count: {
      select: {
        posts: true,
        comments: true,
      },
    },
  },
});

// 2. Genera el tipo 'UserWithRelations' usando Prisma.UserGetPayload
export type UserWithRelations = Prisma.UserGetPayload<typeof userWithRelationsArgs> & {
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
