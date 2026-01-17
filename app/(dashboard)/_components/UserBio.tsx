"use client";
import { Button } from "@/components/ui/button";
import { useCurrentUserContext } from "@/context/currentuser-provider";
import { useStore } from "@/hooks/useStore";
import { format } from "date-fns";
import { CalendarCheck } from "lucide-react";
import React, { useMemo } from "react";

import Badge from "@/components/badge";
import { PLAN_TYPE } from "@/constants/pricing-plans";
import type { UserWithRelations } from "@/types/user-profile.type";
import FollowButton from "./_common/FollowButton";
import { UserType } from "@/types/user.type";

interface PropsType {
  user: UserWithRelations;
}

const UserBio: React.FC<PropsType> = ({ user }) => {
  const { data } = useCurrentUserContext();
  const currentUser: UserType = data?.currentUser ?? ({} as UserType);

  const { onOpenEditModal } = useStore();

  const createdAt = useMemo(() => {
    if (!user?.createdAt) return null;
    return format(new Date(user.createdAt), "MMM yyyy");
  }, [user?.createdAt]);

  return (
    <div className="border-b-[1px] pb-4">
      <div className="flex justify-end p-2 px-4 pt-3">
        {currentUser?.id === user?.id ? (
          <Button variant="outline" className="!border-[rgb(83,100,113)]" onClick={onOpenEditModal}>
            Edit Profile
          </Button>
        ) : (
          <FollowButton userId={Number(user?.id)} username={user?.username ?? ""} />
        )}
      </div>
      <div className="mt-7 px-4">
        <div className="flex flex-col">
          <div className="flex flex-row items-center gap-1">
            <h5 className="text-2xl font-black">{user?.name}</h5>
            {user?.subscription?.plan === PLAN_TYPE.PRO && <Badge />}
          </div>
          <p className="block truncate text-base font-normal !text-[#959fa8]">
            @{user.username ?? ""}
          </p>
          {/* Se agrega el bio, solo si existe */}
          {user.bio && <p className="mt-2 text-base text-gray-600">{user.bio}</p>}
        </div>

        <div className="mt-4 flex flex-row items-center gap-1 text-[15px] text-[rgb(113,118,123)]">
          <CalendarCheck size={17} />
          <p>Joined {createdAt}</p>
        </div>

        <div className="mt-3 flex items-center gap-6">
          <div className="flex items-center gap-1">
            <p>{user?.followingIds?.length}</p>
            <p className="text-[rgb(113,118,123)]">Following</p>
          </div>
          <div className="flex items-center gap-1">
            <p>{user?.followersCount}</p>
            <p className="text-[rgb(113,118,123)]">Followers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBio;
