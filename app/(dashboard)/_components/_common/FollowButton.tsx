"use client";
import React, { useState } from "react";
import useFollow from "@/hooks/useFollow";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/spinner";

interface PropsType {
  userId: number;
  username: string;
}

const FollowButton: React.FC<PropsType> = ({ userId, username }) => {
  const { isFollowing, toggleFollow, loading } = useFollow(userId, username);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Button
      type="button"
      variant={isFollowing ? "brandOutline" : "brandPrimary"}
      title={isFollowing ? "unfollow" : "Follow"}
      disabled={loading}
      onClick={toggleFollow}
      className={cn("gap-1 !font-semibold", {
        "text-sm hover:!border-red-500 hover:bg-red-500/10 hover:!text-red-500": isFollowing,
      })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {loading && <Spinner />}
      {isHovered && isFollowing ? "Unfollow" : isFollowing ? "Following" : "Follow"}
    </Button>
  );
};

export default FollowButton;
