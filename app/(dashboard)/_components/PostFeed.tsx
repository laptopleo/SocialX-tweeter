"use client";


import usePost from "@/hooks/usePost";
import React, { useEffect } from "react";
import PostItem from "./_common/PostItem";
import { useInView } from "react-intersection-observer";
import { PostType } from "@/types/post.type";
import { InfiniteData, UseInfiniteQueryResult, UseQueryResult } from "@tanstack/react-query";
import { PostListResponse, SinglePostResponse } from "@/types/post-response.type";


interface PostFeedProps {
  userId?: number;
  postId?: number;
}

const PostFeed: React.FC<PostFeedProps> = ({ userId, postId }) => {
  // Determine if this instance should be an infinite query
  // It's infinite if no postId is given and either userId is defined (for user's infinite feed) or neither are defined (for global infinite feed)
  const isInfiniteQueryMode = !postId; 

  const hookResult = usePost({
    userId,
    postId,
    isInfinite: isInfiniteQueryMode,
  });

  const { data, isError, isLoading } = hookResult;

  // Conditionally destructure based on query mode
  let fetchNextPage: (() => void) | undefined;
  let hasNextPage: boolean = false;
  let isFetchingNextPage: boolean = false;
  let posts: PostType[] = [];


  if (isInfiniteQueryMode) {
    // If in infinite query mode, safely cast and extract infinite query properties
    const infiniteQueryResult = hookResult as UseInfiniteQueryResult<PostListResponse, Error>;
    fetchNextPage = infiniteQueryResult.fetchNextPage;
    hasNextPage = infiniteQueryResult.hasNextPage ?? false;
    isFetchingNextPage = infiniteQueryResult.isFetchingNextPage ?? false;
    
    // Data for infinite query
    posts = (data as InfiniteData<PostListResponse>)?.pages?.flatMap((page) => page.posts) ?? [];

  } else {
    // If in standard query mode (single post or simple list)
    const standardQueryResult = hookResult as UseQueryResult<SinglePostResponse | PostListResponse, Error>;
    
    // Data for single post
    if (postId) {
      const singlePostData = standardQueryResult.data as SinglePostResponse;
      posts = singlePostData?.post ? [singlePostData.post] : [];
    } 
    // Data for simple list (e.g., from TweetList type usage)
    else {
      const listPostData = standardQueryResult.data as PostListResponse;
      posts = listPostData?.posts ?? [];
    }
  }


  const { ref, inView } = useInView();

  useEffect(() => {
    // Only run infinite scroll logic if in infinite mode and conditions are met
    if (isInfiniteQueryMode && inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage?.(); // Use optional chaining because fetchNextPage might be undefined if not in infinite mode
    }
  }, [isInfiniteQueryMode, inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isError) {
    return (
      <div className="flex flex-col h-[25vh] items-center w-full justify-center">
        <p className="text-sm text-muted-foreground">
          Error loading posts. Please try again.
        </p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col h-[25vh] items-center w-full justify-center">
        <p className="text-sm text-muted-foreground">
          No posts yet. Be the first to post!
        </p>
      </div>
    );
  }

  return (
    <>
      {posts.map((post: PostType) => (
        <PostItem key={post.id} post={post} />
      ))}
      {/* Only show loader if in infinite mode */}
      {isInfiniteQueryMode && hasNextPage && (
        <div ref={ref} className="flex justify-center items-center h-14">
          {isFetchingNextPage}
        </div>
      )}
    </>
  );
};

export default PostFeed;

 PostFeed;
