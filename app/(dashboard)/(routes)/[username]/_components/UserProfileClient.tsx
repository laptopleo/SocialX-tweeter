"use client";
import type { UserWithRelations } from "@/types/user-profile.type";
import React, { Fragment } from "react";
import Header from "../../../_components/_common/Header";
import CommentFeed from "../../../_components/CommentFeed";
import PostFeed from "../../../_components/PostFeed";
import UserBio from "../../../_components/UserBio";
import UserHero from "../../../_components/UserHero";

// ⚡ Props bien tipadas
interface UserProfileClientProps {
  user: UserWithRelations;
}

/**
 * ⚡ Client Component para interactividad del perfil
 * El Server Component padre maneja el fetching y SEO
 */
const UserProfileClient: React.FC<UserProfileClientProps> = ({ user }) => {
  return (
    <Fragment>
      <Header label={user.name || ""} showBackArrow />
      <UserHero user={user} />
      <UserBio user={user} />
      {/* ⚡ Deshabilitar polling en perfil (no necesita real-time) */}
      <PostFeed userId={Number(user.id)} /> <CommentFeed comments={user.comments} />
    </Fragment>
  );
};

export default UserProfileClient;
