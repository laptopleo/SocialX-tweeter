import React from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { UserWithRelations } from "@/types/user-profile.type";

interface PropsType {
  user: UserWithRelations;
}

const UserHero: React.FC<PropsType> = ({ user }) => {
  return (
    <div className="relative h-44 bg-neutral-200 dark:bg-neutral-700">
      {user?.coverImage && (
        <div className="relative h-44 w-full">
          <Image
            src={user?.coverImage}
            fill
            alt="cover image"
            className="h-full w-full object-center"
            style={{ objectFit: "cover" }}
          />
        </div>
      )}
      <div className="absolute -bottom-16 left-4">
        <div className="!h-[141px] !w-[141px] rounded-full border-2 bg-neutral-800 p-[2px]">
          <Avatar className="!h-full !w-full hover:opacity-90">
            <AvatarImage
              src={user?.profileImage || ""}
              alt={user?.name || ""}
              className="h-full w-full object-cover"
            />
            <AvatarFallback className="text-[60px] font-bold">{user?.name?.[0]}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default UserHero;
