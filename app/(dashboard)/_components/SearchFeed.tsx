"use client";
import { Spinner } from "@/components/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useSearch from "@/hooks/useSearch";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import FollowButton from "./_common/FollowButton";
import PostItem from "./_common/PostItem";

import Badge from "@/components/badge";
import { PLAN_TYPE } from "@/constants/pricing-plans";
import { UserType } from "@/types/user.type";
import { PostType } from "@/types/post.type";

const SearchFeed = () => {
  const router = useRouter();
  const param = useSearchParams();
  const query = param.get("q") ?? "";
  const currentFilter = param.get("f") ?? "";

  const { data, isLoading } = useSearch({
    query,
    filter: currentFilter,
  });

  // Type guards to safely access data based on the filter
  const hasPostsData = (data: unknown): data is { posts: PostType[] } => {
    return data !== null && data !== undefined && typeof data === "object" && "posts" in data;
  };

  const hasUsersData = (data: unknown): data is { users: UserType[] } => {
    return data !== null && data !== undefined && typeof data === "object" && "users" in data;
  };

  const posts: PostType[] = currentFilter !== "user" && hasPostsData(data) ? data.posts : [];

  const users: UserType[] = currentFilter === "user" && hasUsersData(data) ? data.users : [];

  const handleQuery = () => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handlePeopleQuery = () => {
    router.push(`/search?q=${encodeURIComponent(query)}&f=user`);
  };

  return (
    <Tabs defaultValue={currentFilter ? "people" : "posts"} className="w-full">
      <TabsList className="flex h-auto w-full items-center justify-start gap-14 border-b-[1px] !bg-transparent px-5 pb-2 dark:border-[rgb(47,51,54)]">
        <TabsTrigger value="posts" className="!text-base active:font-bold" onClick={handleQuery}>
          Posts
        </TabsTrigger>
        <TabsTrigger
          value="people"
          className="!text-base active:font-bold"
          onClick={handlePeopleQuery}>
          People
        </TabsTrigger>
      </TabsList>
      <TabsContent value="posts">
        <div className="flex w-full flex-col items-center justify-center">
          {isLoading ? (
            <Spinner size="icon" />
          ) : posts?.length === 0 ? (
            <div className="w-full p-6">
              <p className="text-center text-xl dark:text-white/80">No post found</p>
            </div>
          ) : (
            <>
              {posts?.map((post: PostType) => (
                <PostItem key={post.id} post={post} />
              ))}
            </>
          )}
        </div>
      </TabsContent>
      <TabsContent value="people" className="w-full px-5">
        <div className="flex w-full flex-col items-center justify-center">
          {isLoading ? (
            <Spinner size="icon" />
          ) : users?.length === 0 ? (
            <div className="w-full p-6">
              <p className="text-center text-xl dark:text-white/80">No user found</p>
            </div>
          ) : (
            <ul role="list" className="mt-4 flex w-full flex-col gap-6 pb-2">
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
                  <div className="flex-1">
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
                        <FollowButton
                          userId={Number(user?.id)}
                          username={user?.username as string}
                        />
                      </div>
                    </div>
                    <div className="pt-3">
                      <p className="text-[15px] font-normal">{user?.bio}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default SearchFeed;
