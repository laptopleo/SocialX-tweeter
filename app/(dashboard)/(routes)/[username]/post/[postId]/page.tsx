
import React from "react";
import { prisma } from "@/lib/prismadb";
import { notFound } from "next/navigation";
import PostDetailClient from "./_components/PostDetailClient";
// Eliminamos tipos personalizados de props para alinear con Next 15
import type { Metadata } from "next";

// ⚡ ISR: Revalida cada 60 segundos
export const revalidate = 60;

// ⚡ Genera rutas estáticas para los 1000 posts más recientes
export async function generateStaticParams() {
  try {
    const posts = await prisma.post.findMany({
      take: 1000,
      select: {
        id: true,
        user: {
          select: { username: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return posts.map((post) => ({
      username: post.user.username,
      postId: post.id.toString(),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// ⚡ Metadata para SEO y compartir en redes sociales
export async function generateMetadata({
  params,
}: { params: Promise<{ username: string; postId: string }> }): Promise<Metadata> {
  try {
    const { username, postId: postIdStr } = await params;
    const postId = parseInt(postIdStr);
    
    if (isNaN(postId)) {
      return {
        title: "Post Not Found - SocialX",
        description: "This post does not exist.",
      };
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        body: true,
        postImage: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            username: true,
            profileImage: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (!post || post.user.username !== username) {
      return {
        title: "Post Not Found - SocialX",
        description: "This post does not exist.",
      };
    }

    // ⚡ Truncar body para meta description
    const truncatedBody = post.body.length > 160 
      ? `${post.body.slice(0, 157)}...` 
      : post.body;

    const title = `${post.user.name} on SocialX: "${post.body.slice(0, 50)}${post.body.length > 50 ? "..." : ""}"`;
    const description = truncatedBody;
    const imageUrl = post.postImage || post.user.profileImage || "/og-image.png";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [imageUrl],
        type: "article",
        publishedTime: post.createdAt.toISOString(),
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
 * - Pre-renderiza posts estáticos
 * - Revalida cada 60 segundos
 * - SEO perfecto para compartir
 * - Cacheable por CDN
 */
export default async function PostDetailPage(
  props: { params: Promise<{ username: string; postId: string }> }
) {
  try {
    const { username, postId: postIdStr } = await props.params;
    const postId = parseInt(postIdStr);

    // ⚡ Validar que postId sea un número
    if (isNaN(postId)) {
      notFound();
    }

    // ⚡ Fetch post con todas las relaciones necesarias
    const post = await prisma.post.findUnique({
      where: { id: postId },
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
          take: 50, // Limitar a 50 comentarios
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
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    // ⚡ 404 si el post no existe o el username no coincide
    if (!post || post.user.username !== username) {
      notFound();
    }

    // ⚡ Crear objeto limpio sin propiedades internas de React
    const cleanPost = {
      id: post.id,
      body: post.body,
      userId: post.userId,
      likeIds: [...post.likeIds], // Copiar array
      postImage: post.postImage,
      postVideo: post.postVideo,
      postGif: post.postGif,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      user: {
        id: post.user.id,
        name: post.user.name,
        username: post.user.username,
        profileImage: post.user.profileImage,
      },
      comments: post.comments.map(comment => ({
        id: comment.id,
        body: comment.body,
        userId: comment.userId,
        postId: comment.postId,
        commentImage: comment.commentImage,
        commentVideo: comment.commentVideo,
        commentGif: comment.commentGif,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString(),
        user: {
          id: comment.user.id,
          name: comment.user.name,
          username: comment.user.username,
          profileImage: comment.user.profileImage,
        },
      })),
      _count: {
        comments: post._count.comments,
      },
    };

    // ⚡ Renderizar componente cliente con datos del servidor
    return cleanPost;
  } catch (error) {
    console.error("Error fetching post detail:", error);
    notFound();
  }
}

// Wrapper component to handle JSX rendering outside try/catch
async function PostDetailWrapper(props: { params: Promise<{ username: string; postId: string }> }) {
  const cleanPost = await PostDetailPage(props);
  return <PostDetailClient post={cleanPost} />;
}

export default PostDetailWrapper;
