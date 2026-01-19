"use client";
import Badge from "@/components/badge";
import { Spinner } from "@/components/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PLAN_TYPE } from "@/constants/pricing-plans";
import useLike from "@/hooks/useLike";
import { PostType } from "@/types/post.type";
import { formatDistanceToNowStrict } from "date-fns";
import { Dot, Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useRef } from "react";

interface PropsType {
  userId?: number;
  post: PostType;
}

const PostItem: React.FC<PropsType> = ({ post, userId }) => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const currentVideoRef = videoRef.current;
    if (!currentVideoRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          currentVideoRef.pause();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(currentVideoRef);

    return () => {
      observer.unobserve(currentVideoRef);
    };
  }, []);

  const { hasLiked, loading, toggleLike } = useLike(post?.id, post?.likeIds);

  const username = post.user?.username;

  const goToUser = useCallback(
    (event: { stopPropagation: () => void }) => {
      event.stopPropagation();
      if (username) {
        router.push(`/${username}`);
      }
    },
    [router, username]
  );

  const goToPost = useCallback(() => {
    if (username) {
      router.push(`/${username}/post/${post.id}`);
    }
  }, [router, username, post.id]);

  const onLike = useCallback(
    (event: { stopPropagation: () => void }) => {
      event.stopPropagation();
      toggleLike();
    },
    [toggleLike]
  );

  const stopPropagation = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
  }, []);

  const createdAt = useMemo(() => {
    if (!post.createdAt) return null;

    const timeDifference = formatDistanceToNowStrict(new Date(post.createdAt));
    const timeParts = timeDifference.split(" ");
    let formattedTime;

    if (timeParts[1]?.startsWith("second")) {
      formattedTime = `${timeParts[0]}s`;
    } else if (timeParts[1]?.startsWith("minute")) {
      formattedTime = `${timeParts[0]}min`;
    } else if (timeParts[1]?.startsWith("hour")) {
      formattedTime = `${timeParts[0]}h`;
    } else if (timeParts[1]?.startsWith("day")) {
      formattedTime = `${timeParts[0]}d`;
    } else {
      formattedTime = timeDifference;
    }

    return formattedTime;
  }, [post.createdAt]); // Remover el ? del objeto post

  return (
    <div
      role="button"
      onClick={goToPost}
      className="flex-1 cursor-pointer border border-gray-200 py-4 transition dark:border-neutral-800">
      <div className="flex gap-3">
        {/* Left padding for avatar alignment */}
        <div className="w-1"></div>
        {/* Avatar Section */}
        <div className="flex-shrink-0">
          <div className="relative">
            <div role="button" onClick={goToUser} className="cursor-pointer">
              <Avatar className="ring-2 ring-white dark:ring-black">
                <AvatarImage
                  src={post?.user?.profileImage || ""}
                  alt={post?.user.username || ""}
                  className="object-cover"
                />
                <AvatarFallback className="bg-blue-500 font-bold text-white">
                  {post?.user?.name?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="min-w-0 flex-1 pr-4">
          {/* User Info */}
          <div className="mb-1 flex flex-wrap items-center gap-1">
            <div className="flex items-center gap-1">
              <h5
                className="cursor-pointer truncate font-bold text-gray-900 hover:underline dark:text-white"
                role="button"
                onClick={goToUser}>
                {post?.user?.name}
              </h5>
              {post?.user?.subscription?.plan === PLAN_TYPE.PRO && <Badge />}
            </div>

            <span
              className="cursor-pointer truncate text-sm font-normal text-gray-500 hover:underline dark:text-gray-400"
              role="button"
              onClick={goToUser}>
              @{post?.user?.username}
            </span>

            <Dot className="flex-shrink-0 text-gray-500 dark:text-gray-400" size={15} />

            <span className="flex-shrink-0 text-sm text-gray-500 dark:text-gray-400">
              {createdAt}
            </span>
          </div>

          {/* Post Body */}
          <div className="mb-3">
            <div
              dangerouslySetInnerHTML={{ __html: post.body }}
              className="line-clamp-4 overflow-hidden text-[15px] leading-5 font-normal break-words text-gray-900 lg:line-clamp-6 dark:text-gray-100"
            />
          </div>

          {/* Media Content */}
          {post?.postImage && (
            <div
              className="relative mb-3 w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-neutral-800"
              onClick={stopPropagation}>
              <Image
                src={post.postImage}
                alt={post.user?.username || "Post image"}
                width={500}
                height={500}
                className="w-full cursor-pointer object-cover"
              />
            </div>
          )}

          {post?.postVideo && (
            <div
              className="relative mb-3 w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-neutral-800"
              onClick={stopPropagation}>
              <video
                ref={videoRef}
                src={post.postVideo}
                controls
                className="w-full cursor-pointer object-cover"
              />
            </div>
          )}

          {post?.postGif && (
            <div
              className="relative mb-3 w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-neutral-800"
              onClick={stopPropagation}>
              <video
                src={post.postGif}
                muted
                loop
                autoPlay
                playsInline
                className="w-full bg-transparent object-contain"
                controls={false}
                disablePictureInPicture
                disableRemotePlayback
                controlsList="nodownload nofullscreen noremoteplayback"
              />
            </div>
          )}

          {/* Actions */}
          <div className="mt-3 flex items-center gap-8 pt-1">
            <button
              type="button"
              onClick={stopPropagation}
              className="group flex items-center gap-1 text-gray-500 transition-colors hover:text-blue-500">
              <div className="rounded-full p-2 transition-colors group-hover:bg-blue-500/10">
                <MessageCircle size={18} />
              </div>
              <span className="text-sm">{post?.comments?.length || 0}</span>
            </button>

            <button
              type="button"
              onClick={onLike}
              disabled={loading}
              className={`group flex items-center gap-1 text-gray-500 transition-colors hover:text-red-500 ${
                loading ? "cursor-not-allowed opacity-50" : ""
              }`}>
              <div className="rounded-full p-2 transition-colors group-hover:bg-red-500/10">
                <Heart size={18} className={hasLiked ? "fill-red-500 stroke-red-500" : ""} />
              </div>
              <span className="text-sm">{post?.likeIds?.length || 0}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
