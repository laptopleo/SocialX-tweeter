"use client";

import { Spinner } from "@/components/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Link from "next/link";

import Badge from "@/components/badge";
import { PLAN_TYPE } from "@/constants/pricing-plans";
import useUsers from "@/hooks/useUsers";
import type { UsersApiResponse } from "@/types/api.types";
import FollowButton from "./_common/FollowButton";
import { UserType } from "@/types/user.type";

const FollowList = () => {
  const { data, isLoading } = useUsers();
  const users: UserType[] = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="bg-background min-h-[150px] rounded-xl p-4 dark:border dark:border-[rgb(47,51,54)]">
        <div className="flex items-center justify-center">
          <Spinner size="icon" />
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return null;
  }

  return (
    <div className="bg-background rounded-xl border p-4 dark:border-[rgb(47,51,54)]">
      <h2 className="text-[20px] font-bold">Who to follow</h2>

      <div className="scrollbar-hide h-[28vh] w-full overflow-auto scroll-smooth">
        <ul role="list" className="mt-4 flex flex-col gap-6 pb-2">
          {users?.map((user) => (
            <li key={user?.id} role="listitem" className="flex cursor-pointer flex-row gap-4">
              <Link href={`/${user?.username}`} className="w-fit shrink-0">
                <Avatar className="cursor-pointer hover:opacity-90">
                  <AvatarImage src={user?.profileImage || ""} className="object-cover" />
                  <AvatarFallback className="text-[18px] font-bold">
                    {user?.name?.[0]}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex flex-1 items-center justify-between">
                <div className="flex flex-col">
                  <Link href={`/${user?.username}`} className="hover:underline">
                    <div className="gap1 flex">
                      <h5 className="text-[15.5px] font-semibold transition">{user?.name}</h5>
                      {user?.subscription?.plan === PLAN_TYPE.PRO && <Badge />}
                    </div>
                  </Link>
                  <div className="block w-full">
                    <Link href={`/${user?.username}`}>
                      <p className="block truncate text-sm font-medium !text-[#959fa8]">
                        @{user.username}
                      </p>
                    </Link>
                  </div>
                </div>
                <div className="shrink">
                  <FollowButton userId={Number(user?.id)} username={user?.username as string} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FollowList;
