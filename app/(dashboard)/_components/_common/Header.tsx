"use client";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";

interface PropsType {
  label?: string;
  showBackArrow?: boolean;
  showBorder?: boolean;
  children?: React.ReactNode;
}

const Header: React.FC<PropsType> = ({ label, children, showBackArrow, showBorder = true }) => {
  const router = useRouter();
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);
  return (
    <div
      className={cn(
        "bg-background/90 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex w-full justify-center p-4 text-black backdrop-blur dark:text-white",
        {
          "border-b-[1px] dark:border-[rgb(29,111,173)]": showBorder,
        }
      )}>
      <div className="flex flex-row items-center gap-5">
        {showBackArrow && (
          <ArrowLeft
            onClick={handleBack}
            color="currentColor"
            size={20}
            className="cursor-pointer transition hover:opacity-70"
          />
        )}
        {label ? <h1 className="text-xl font-semibold">{label}</h1> : <>{children}</>}
      </div>
    </div>
  );
};

export default Header;
