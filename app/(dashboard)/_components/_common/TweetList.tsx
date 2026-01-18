"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import usePost from "@/hooks/usePost";
import { PostType } from "@/types/post.type";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const TweetList = () => {
  const { data } = usePost({ isInfinite: false }); // Explicitly set isInfinite to false
  const router = useRouter();

  // Simplified data extraction for useQuery response - need to properly check the data type
  const posts = data && "posts" in data ? (data.posts ?? []) : [];

  return (
    <div className="rounded-xl border bg-background p-4 dark:border-[rgb(47,51,54)]">
      <h2 className="text-[20px] font-bold">What is happening</h2>

      <div className="h-[25vh] w-full overflow-auto scroll-smooth scrollbar-hide">
        <div className="mt-4 space-y-4">
          {posts.map((post: PostType, index: number) => {
            // Eliminar etiquetas HTML del campo "body"
            const cleanBody = (post.body ?? "").replace(/<[^>]+>/g, "");
            return (
              <React.Fragment key={post.id}>
                <div className="rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.user.profileImage || ""} alt={post.user.name} />
                      <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Link href={`/${post.user.username}`}>
                        <p className="font-bold">{post.user.name}</p>
                      </Link>
                      <p className="text-sm text-gray-500">@{post.user.username}</p>
                    </div>
                  </div>
                  <p className="mt-4 line-clamp-3 flex flex-col overflow-hidden break-words text-[15px] font-semibold text-black dark:text-white lg:h-32">
                    {cleanBody.length > 100 ? (
                      <>
                        {cleanBody.slice(0, 100)}
                        <button
                          onClick={() => router.push("/" + post.user.username)}
                          className="mt-2 w-full text-start text-blue-500">
                          Show more
                        </button>
                      </>
                    ) : (
                      <span className="line-clamp-1 overflow-hidden break-words font-semibold text-black dark:text-white lg:h-24">
                        {cleanBody || "No hay contenido"}
                      </span>
                    )}
                  </p>
                </div>

                {index !== posts.length - 1 && (
                  <hr className="border-gray-200 dark:border-gray-700" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TweetList;
