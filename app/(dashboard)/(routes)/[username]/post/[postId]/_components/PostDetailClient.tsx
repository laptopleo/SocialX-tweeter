"use client";
import type {
  SerializedPostWithRelations,
  PostWithRelations,
  CommentWithUser,
} from "@/types/post-detail.type"; // 👈 Cambia este import
import React, { Fragment, useMemo } from "react";
import Header from "../../../../../_components/_common/Header";
import PostItem from "../../../../../_components/_common/PostItem";
import CommentFeed from "../../../../../_components/CommentFeed";

// ⚡ Props bien tipadas
interface PostDetailClientProps {
  post: SerializedPostWithRelations;
}

/**
 * ⚡ Client Component para interactividad del post
 * El Server Component padre maneja el fetching y SEO
 */
const PostDetailClient: React.FC<PostDetailClientProps> = ({ post }) => {
  // ⚡ Deserializar fechas de string a Date usando los tipos CORRECTOS
  const deserializedPost: PostWithRelations = useMemo(
    () =>
      ({
        ...post,
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt),
        comments: post.comments.map((comment) => ({
          ...comment,
          createdAt: new Date(comment.createdAt),
          updatedAt: new Date(comment.updatedAt),
          user: comment.user, // 👈 Mantiene la relación de usuario
        })),
        user: post.user, // 👈 Asegura que el usuario esté incluido
        _count: post._count, // 👈 Asegura que los counts estén incluidos
      }) as PostWithRelations, // 👈 Type assertion para asegurar compatibilidad
    [post]
  );

  const deserializedComments: CommentWithUser[] = useMemo(
    () =>
      post.comments.map((comment) => ({
        ...comment,
        createdAt: new Date(comment.createdAt),
        updatedAt: new Date(comment.updatedAt),
        user: comment.user, // 👈 Mantiene la relación
      })) as CommentWithUser[],
    [post.comments]
  );

  return (
    <Fragment>
      <Header label="Post" showBackArrow />

      {/* ⚡ Post principal - Pasa PostWithRelations, no PostType */}
      <PostItem post={deserializedPost} userId={post.user.id} />

      {/* ⚡ Comentarios */}
      {post.comments.length > 0 && (
        <div className="mt-4 border-t border-border">
          <div className="px-4 py-3">
            <h3 className="text-lg font-semibold">Comments ({post._count.comments})</h3>
          </div>
          <CommentFeed comments={deserializedComments} />
        </div>
      )}

      {/* ⚡ Empty state para comentarios */}
      {post.comments.length === 0 && (
        <div className="mt-4 border-t border-border px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
        </div>
      )}
    </Fragment>
  );
};

export default PostDetailClient;
