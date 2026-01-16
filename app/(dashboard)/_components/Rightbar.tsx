"use client";
import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import SubscribeAds from "./_common/SubscribeAds";
import QuickActions from "./_common/QuickActions";
import SearchForm from "./SearchForms";
import FollowList from "./FollowList";
import TweetList from "./_common/TweetList";


const Rightbar = (props: { isPro: boolean }) => {
  const pathname = usePathname();
  return (
  
    <>
        {pathname !== "/search" && (
          <div className="flex justify-center p-2 sticky top-0 z-30 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full text-black dark:text-white">
            <Suspense fallback={<div className="w-full h-12 flex items-center justify-center">Loading search...</div>}>
              <SearchForm />
            </Suspense>
          </div>
        )}
        {!props.isPro && <SubscribeAds />}
        <QuickActions />
        <TweetList />
        <FollowList />
    </>
    
  
  );
};

export default Rightbar;