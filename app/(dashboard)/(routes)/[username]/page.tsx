import { prisma } from "@/lib/prismadb";
import { notFound } from "next/navigation";
import UserProfileClient from "./_components/UserProfileClient";
// Eliminamos tipos personalizados de props para alinear con Next 15
import type { Metadata } from "next";

// ⚡ ISR: Revalida cada 60 segundos
export const revalidate = 60;

// ⚡ Genera rutas estáticas para los 100 usuarios más activos
export async function generateStaticParams() {
  try {
    const users = await prisma.user.findMany({
      take: 100,
      select: { username: true },
      orderBy: [
        { posts: { _count: "desc" } },
        { createdAt: "desc" },
      ],
    });

    return users.map((user) => ({
      username: user.username,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// ⚡ Metadata para SEO y compartir en redes sociales
export async function generateMetadata(
  props: { params: Promise<{ username: string }> }
): Promise<Metadata> {
  try {
    const { username } = await props.params;
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        name: true,
        username: true,
        bio: true,
        profileImage: true,
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!user) {
      return {
        title: "User Not Found - SocialX",
        description: "This user profile does not exist.",
      };
    }

    const title = `${user.name} (@${user.username}) - SocialX`;
    const description = user.bio || 
      `${user.name} has ${user._count.posts} posts on SocialX.`;
    const imageUrl = user.profileImage || "/default-avatar.png";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [imageUrl],
        type: "profile",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "SocialX",
      description: "Social media platform",
    };
  }
}

/**
 * ⚡ Server Component con ISR
 * - Pre-renderiza páginas estáticas
 * - Revalida cada 60 segundos
 * - SEO perfecto
 * - Cacheable por CDN
 */
export default async function UserProfilePage(
  props: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await props.params;
    // ⚡ Fetch usuario con todas las relaciones necesarias
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        posts: {
          take: 10,
          orderBy: { createdAt: "desc" },
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
        comments: {
          take: 10,
          orderBy: { createdAt: "desc" },
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
        subscription: true,
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
    });

    // ⚡ 404 si el usuario no existe
    if (!user) {
      notFound();
    }

    // ⚡ Calcular cantidad de seguidores (usuarios que tienen este id en su followingIds)
    const followersCount = await prisma.user.count({
      where: { followingIds: { has: user.id } },
    });

    // ⚡ Serializar fechas para evitar problemas de hidratación
    const serializedUser = {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      dateOfBirth: user.dateOfBirth?.toISOString() || null,
      emailVerified: user.emailVerified?.toISOString() || null,
      posts: user.posts.map(post => ({
        ...post,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
      })),
      comments: user.comments.map(comment => ({
        ...comment,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString(),
      })),
      subscription: user.subscription ? {
        ...user.subscription,
        stripeCurrentPeriodEnd: user.subscription.stripeCurrentPeriodEnd?.toISOString() || null,
      } : null,
      followersCount,
    };

    // ⚡ Renderizar componente cliente con datos del servidor y campo derivado
    return <UserProfileClient user={serializedUser as any} />;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    notFound();
  }
}
