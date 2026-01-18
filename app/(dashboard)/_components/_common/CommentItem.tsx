"use client";
import React, { useCallback, useMemo } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dot } from "lucide-react";
import Image from "next/image";

import Badge from "@/components/badge";
import { PLAN_TYPE } from "@/constants/pricing-plans";
import { CommentType } from "@/types/comment.type";

interface PropsType {
  comment: CommentType;
}

const CommentItem: React.FC<PropsType> = ({ comment }) => {
  const router = useRouter();

  const goToUser = useCallback(
    (event: { stopPropagation: () => void }) => {
      event.stopPropagation();
      router.push(`/${comment?.user?.username}`);
    },
    [router, comment.user?.username] // Remover el ? del objeto comment
  );

  const createdAt = useMemo(() => {
    if (!comment.createdAt) return null;

    const timeDifference = formatDistanceToNowStrict(new Date(comment.createdAt));
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
  }, [comment.createdAt]); // Remover el ? del objeto comment

  return (
    <div className="h-auto w-full border-b-[1px] p-5 transition dark:border-[rgb(47,51,54)]">
      <div className="flex flex-row items-start gap-3">
        <div role="button" onClick={goToUser} className="cursor-pointer">
          <Avatar>
            <AvatarImage
              src={comment?.user?.profileImage || ""}
              alt={comment?.user?.username || ""}
              className="object-cover"
            />
            <AvatarFallback className="font-bold">{comment?.user?.name?.[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="w-[90%] lg:w-[91.25%]">
          <div className="flex items-center gap-[4px]">
            <div className="flex flex-row gap-[2px]">
              <h5
                className="cursor-pointer font-bold hover:underline"
                role="button"
                onClick={goToUser}>
                {comment?.user?.name}
              </h5>
              {comment?.user?.subscription?.plan === PLAN_TYPE.PRO && <Badge />}
            </div>
            <span
              className="inline-block truncate text-sm font-normal !text-[#959fa8]"
              role="button"
              onClick={goToUser}>
              @{comment?.user?.username}
            </span>
            <div className="flex items-center">
              <span className="text-sm !text-[#959fa8]">
                <Dot size="15px" />
              </span>
              <span className="text-sm !text-[#959fa8]">{createdAt}</span>
            </div>
          </div>

          <div className="mt-1 flex w-full">
            <div
              dangerouslySetInnerHTML={{ __html: comment.body }}
              className="line-clamp-6 overflow-hidden break-words text-white lg:h-24"
            />
          </div>
          {comment?.commentImage && (
            <div className="relative my-3 h-80 w-full overflow-hidden rounded-md bg-[#eee] dark:bg-gray-600">
              <Image
                src={comment?.commentImage}
                alt={comment?.user?.username || "Image"}
                fill
                loading="lazy"
                className="rounded-md object-cover"
              />
            </div>
          )}
          {comment?.commentVideo && (
            <div className="relative my-3 h-80 w-full overflow-hidden rounded-md bg-[#eee] dark:bg-gray-600">
              <video
                src={comment?.commentVideo}
                controls
                className="h-full w-full rounded-md object-cover"
              />
            </div>
          )}
          {comment?.commentGif && (
            <div className="relative my-3 h-80 w-full overflow-hidden rounded-md bg-[#eee] bg-transparent">
              <video
                src={comment?.commentGif}
                muted
                loop
                autoPlay
                playsInline
                disablePictureInPicture
                disableRemotePlayback
                controls={false}
                className="h-full w-[10em] rounded-2xl bg-purple-700 object-cover transition-opacity group-hover:opacity-90 lg:w-full"
                style={{
                  backgroundColor: "transparent",
                  objectFit: "contain",
                  objectPosition: "center",
                }}
                controlsList="nodownload nofullscreen noremoteplayback"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
