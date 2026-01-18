"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/hooks/useStore";

const SubscribeAds = () => {
  const { onOpenProModal } = useStore();

  return (
    <div className="rounded-xl border bg-background p-4 dark:border-[rgb(47,51,54)]">
      <div className="w-full">
        <h2 className="mb-2 text-[20px] font-bold text-black dark:text-white">
          Subscribe to Premium
        </h2>
        <div className="flex flex-col gap-2 text-black dark:text-white">
          <p className="text-[15px] leading-[19px]">
            Subscribe to unlock new features and if eligible, receive a share of ads revenue.
          </p>
          <Button
            variant="brandPrimary"
            size="brandsm"
            className="!h-auto text-base font-semibold !text-white"
            onClick={onOpenProModal}>
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubscribeAds;
