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

  const { hasLiked, loading, toggleLike } = useLike(
    post?.id,
    post?.likeIds
  );

  const goToUser = useCallback(
    (event: { stopPropagation: () => void }) => {
      event.stopPropagation();
      router.push(`/${post.user?.username}`);
    },
    [router, post.user?.username]
  );

  const goToPost = useCallback(() => {
    router.push(`/${post.user?.username}/post/${post.id}`);
  }, [router, post.user?.username, post.id]);

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
      className="flex-1 py-4 transition cursor-pointer border border-gray-200 dark:border-neutral-800"
    >
      <div className="flex gap-3">
        {/* Left padding for avatar alignment */}
        <div className="w-1"></div>
        {/* Avatar Section */}
        <div className="flex-shrink-0">
          <div className="relative">
            <div
              role="button"
              onClick={goToUser}
              className="cursor-pointer"
            >
              <Avatar className="ring-2 ring-white dark:ring-black">
                <AvatarImage
                  src={post?.user?.profileImage || ""}
                  alt={post?.user.username || ""}
                  className="object-cover"
                />
                <AvatarFallback className="font-bold bg-blue-500 text-white">
                  {post?.user?.name?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0 pr-4">
          {/* User Info */}
          <div className="flex flex-wrap items-center gap-1 mb-1">
            <div className="flex items-center gap-1">
              <h5
                className="font-bold text-gray-900 dark:text-white cursor-pointer hover:underline truncate"
                role="button"
                onClick={goToUser}
              >
                {post?.user?.name}
              </h5>
              {post?.user?.subscription?.plan === PLAN_TYPE.PRO && <Badge />}
            </div>

            <span
              className="text-gray-500 dark:text-gray-400 text-sm font-normal truncate cursor-pointer hover:underline"
              role="button"
              onClick={goToUser}
            >
              @{post?.user?.username}
            </span>

            <Dot
              className="text-gray-500 dark:text-gray-400 flex-shrink-0"
              size={15}
            />

            <span className="text-gray-500 dark:text-gray-400 text-sm flex-shrink-0">
              {createdAt}
            </span>
          </div>

          {/* Post Body */}
          <div className="mb-3">
            <div
              dangerouslySetInnerHTML={{ __html: post.body }}
              className="text-gray-900 dark:text-gray-100 break-words font-normal text-[15px] leading-5 line-clamp-4 lg:line-clamp-6 overflow-hidden"
            />
          </div>

          {/* Media Content */}
          {post?.postImage && (
            <div 
              className="relative w-full rounded-2xl overflow-hidden mb-3 border border-gray-200 dark:border-neutral-800"
              onClick={stopPropagation}
            >
              <Image
                src={post.postImage}
                alt={post.user?.username || "Post image"}
                width={500}
                height={500}
                className="w-full object-cover cursor-pointer"
              />
            </div>
          )}

          {post?.postVideo && (
            <div 
              className="relative w-full rounded-2xl overflow-hidden mb-3 border border-gray-200 dark:border-neutral-800"
              onClick={stopPropagation}
            >
              <video
                ref={videoRef}
                src={post.postVideo}
                controls
                className="w-full object-cover cursor-pointer"
              />
            </div>
          )}

          {post?.postGif && (
            <div 
              className="relative w-full rounded-2xl overflow-hidden mb-3 border border-gray-200 dark:border-neutral-800"
              onClick={stopPropagation}
            >
              <video
                src={post.postGif}
                muted
                loop
                autoPlay
                playsInline
                className="w-full object-contain bg-transparent"
                controls={false}
                disablePictureInPicture
                disableRemotePlayback
                controlsList="nodownload nofullscreen noremoteplayback"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-8 mt-3 pt-1">
            <button
              type="button"
              onClick={stopPropagation}
              className="flex items-center group gap-1 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                <MessageCircle size={18} />
              </div>
              <span className="text-sm">{post?.comments?.length || 0}</span>
            </button>

            <button
              type="button"
              onClick={onLike}
              disabled={loading}
              className={`flex items-center group gap-1 text-gray-500 hover:text-red-500 transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div className="p-2 rounded-full group-hover:bg-red-500/10 transition-colors">
                
                  <Heart
                    size={18}
                    className={hasLiked ? "fill-red-500 stroke-red-500" : ""}
                  />
              
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
