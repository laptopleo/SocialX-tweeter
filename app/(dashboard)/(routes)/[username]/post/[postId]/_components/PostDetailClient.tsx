"use client";
import type { SerializedPostWithRelations } from "@/types/post-detail.type";
import type { PostType } from "@/types/post.type";
import type { CommentType } from "@/types/comment.type";
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
  // ⚡ Deserializar fechas de string a Date
  const deserializedPost: PostType = useMemo(() => ({
    ...post,
    createdAt: new Date(post.createdAt),
    updatedAt: new Date(post.updatedAt),
    comments: post.comments.map(comment => ({
      ...comment,
      createdAt: new Date(comment.createdAt),
      updatedAt: new Date(comment.updatedAt),
    })),
  }), [post]);

  const deserializedComments: CommentType[] = useMemo(() => 
    post.comments.map(comment => ({
      ...comment,
      createdAt: new Date(comment.createdAt),
      updatedAt: new Date(comment.updatedAt),
    })),
  [post.comments]);

  return (
    <Fragment>
      <Header label="Post" showBackArrow />

      {/* ⚡ Post principal */}
      <PostItem post={deserializedPost} userId={post.user.id} />

      {/* ⚡ Comentarios */}
      {post.comments.length > 0 && (
        <div className="border-t border-border mt-4">
          <div className="px-4 py-3">
            <h3 className="text-lg font-semibold">
              Comments ({post._count.comments})
            </h3>
          </div>
          <CommentFeed comments={deserializedPost.comments} />
        </div>
      )}

      {/* ⚡ Empty state para comentarios */}
      {post.comments.length === 0 && (
        <div className="border-t border-border mt-4 px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            No comments yet. Be the first to comment!
          </p>
        </div>
      )}
    </Fragment>
  );
};

export default PostDetailClient;
